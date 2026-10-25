const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const read=p=>fs.readFileSync(p,'utf8'),html=read('index.html'),script=html.match(/<script>([\s\S]*?)<\/script>/)[1];
const ctx=vm.createContext({console});
vm.runInContext(read('course-curriculum.js')+'\n'+script.slice(0,script.indexOf('function validStored'))+'\nglobalThis.fixture={DATA,LerenCurriculum};',ctx);
vm.runInContext(read('modules/learning-path/core.js'),ctx);
const core=ctx.LerenLearningPath,course=core.catalog(ctx.fixture.DATA,ctx.fixture.LerenCurriculum);
assert.equal(course.chapters.length,20);assert.equal(course.chapters.filter(c=>c.level==='A1.1').length,12);
assert(course.chapters.every(c=>c.lessons.length));
const expected=course.chapters.flatMap(c=>c.tabs.flatMap(t=>(ctx.fixture.DATA[t]?.items||[]).map(w=>w.id)));
const actual=course.lessons.flatMap(l=>l.ids);
assert.equal(new Set(actual).size,actual.length);assert.equal(actual.length,expected.length);assert(expected.every(id=>actual.includes(id)),'Every course card must appear, including final small chunks');
assert(course.lessons.every(l=>l.ids.length>0&&l.ids.length<=5));
assert(!course.lessons.some(l=>l.tab==='diphthongs'),'Supplementary pronunciation stays in free practice');
function storage(initial={}){const data={...initial};return {getItem:k=>data[k]||null,setItem:(k,v)=>data[k]=v,data}}
let s=storage(),m=core.create(course,s);m.start();const first=course.lessons[0];assert.equal(m.recommended().id,first.id);m.begin(first.id);
assert.equal(m.nextPhase(),false);assert.equal(m.finish(),null);assert.equal(m.advance('stale',true),false);
for(let phase=0;phase<3;phase++){
 while(m.current()){
  const w=m.current();assert(m.advance(w.id,true));assert.equal(m.advance(w.id,true),false);
  m=core.create(course,s);assert.equal(m.state.session.phase,phase,'Reload must preserve phase');
 }
 if(phase<2)assert(m.nextPhase());
}
const result=m.finish();assert.equal(result.correct,first.ids.length);assert(m.mastered(first.id));assert.equal(m.stats('comm').done,1);
assert.equal(m.recommended().id,course.lessons[1].id);assert.equal(core.create(course,s).recommended().id,course.lessons[1].id);
assert.equal(m.continueRoute().id,course.lessons[1].id);
// Complete the entire catalogue to exercise the A1.1 → A1.2 boundary and ending.
const full=core.create(course,storage());full.start();let visited=0;
while(full.recommended()){
 const l=full.recommended();full.begin(l.id);
 for(let phase=0;phase<3;phase++){while(full.current())full.advance(full.current().id,true);if(phase<2)full.nextPhase()}
 full.finish();visited++;assert(visited<=course.lessons.length);
}
assert.equal(visited,course.lessons.length);assert.equal(full.stats().done,course.lessons.length);
// A weak result never locks the learner; wrong words are saved for a targeted review.
m.state.session.phase=2;
while(m.current())m.advance(m.current().id,false);
const weak=m.finish();assert.equal(weak.correct,0);assert.equal(m.mastered(weak.id),false);assert(m.state.mistakes.length);
const done=m.stats().done;assert(m.beginReview());
while(m.current())m.advance(m.current().id,true);
assert.equal(m.finish().kind,'review');assert.equal(m.state.mistakes.length,0);assert.equal(m.stats().done,done,'Review must not complete a different lesson');
// Placement suggests a start without claiming earlier lessons were mastered.
m=core.create(course,storage());m.place();
for(let i=0;i<12;i++){const w=m.placementCard();assert(w);assert(m.placementAnswer(w.id,i!==3));m=core.create(course,{getItem:()=>JSON.stringify(m.state),setItem(){}})}
assert(m.acceptPlacement());assert.equal(m.recommended().chapter,course.chapters[3].id);assert.equal(m.stats().done,0);
m=core.create(course,storage());m.place();for(let i=0;i<12;i++)m.placementAnswer(m.placementCard().id,true);assert(m.acceptPlacement());assert.equal(m.recommended().chapter,'past');
// Corrupt data and denied browser storage cannot break startup.
for(const raw of ['{','null','[]','{"version":1,"completed":{"bad":999},"session":{"kind":"lesson","ids":["bad"],"phase":9}}']){
 const x=core.create(course,storage({[core.KEY]:raw}));assert.equal(x.state.session,null);assert.equal(x.stats().done,0);
}
const denied=core.create(course,{getItem(){throw Error('denied')},setItem(){throw Error('denied')}});denied.begin(first.id);assert.equal(denied.persistent,false);assert(denied.current());
// Real host rewards: improve a best once, including after page reload.
const from=script.indexOf('function recordPathResult('),to=script.indexOf('\nfunction start()',from),ledger={};
function host(){const x=vm.createContext({learningPath:{model:m},lsGet:k=>ledger[k],lsSet:(k,v)=>ledger[k]=v,rewardCheck(){},queueProgressSync(){},addXP(){},saveStore(){},updateStats(){}});vm.runInContext('const pathSessionRewards={};'+script.slice(from,to),x);return x}
let h=host();assert.equal(h.recordPathResult(first.id,2,first.ids.length),10);assert.equal(h.recordPathResult(first.id,2,first.ids.length),0);
h=host();assert.equal(h.recordPathResult(first.id,2,first.ids.length),0);assert.equal(h.recordPathResult(first.id,5,first.ids.length),15);assert.equal(h.recordPathResult('bad',5,5),0);
const files=JSON.parse(read('sw.js').match(/const APP_FILES = (\[[^;]+\]);/)[1]);for(const file of ['core.js','ui.js','style.css'])assert(files.includes('./modules/learning-path/'+file+'?v='+(file==='core.js'?'89':file==='ui.js'?'93':'92')));
new vm.Script(read('modules/learning-path/ui.js'));
console.log(`PASS: ${course.chapters.length} chapters, ${course.lessons.length} lessons, all ${actual.length} course cards; phase-by-phase resume, stale answers, next lesson, targeted review, 12-question placement, corrupt/blocked storage, repeat-safe host XP and offline dependencies`);
