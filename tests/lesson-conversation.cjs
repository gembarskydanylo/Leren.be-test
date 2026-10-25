const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const read=p=>fs.readFileSync(p,'utf8'),html=read('index.html'),script=html.match(/<script>([\s\S]*?)<\/script>/)[1];
const ctx=vm.createContext({console});vm.runInContext(read('course-curriculum.js')+'\n'+script.slice(0,script.indexOf('function validStored'))+'\nglobalThis.fixture={DATA,LerenCurriculum}',ctx);
for(const p of ['learning-path/core','lesson-conversation/content','lesson-conversation/core'])vm.runInContext(read('modules/'+p+'.js'),ctx);
const api=ctx.LerenLessonConversation,course=ctx.LerenLearningPath.catalog(ctx.fixture.DATA,ctx.fixture.LerenCurriculum);
function storage(initial={}){const data={...initial};return {data,getItem:k=>data[k]||null,setItem:(k,v)=>data[k]=v}}
const s=storage(),make=()=>api.create(course,s);let m=make();
let turns=0;
for(const chapter of course.chapters){
 const scenario=api.SCENARIOS[chapter.id];assert.equal(scenario.length,3,chapter.id);
 for(const turn of scenario){
  assert.equal(api.checkResponse(turn,turn.sample).kind,'ok',chapter.id+' '+turn.sample);
  for(const lang of api.langs){assert(turn.translations[lang].q);assert(turn.translations[lang].sample)}turns++;
 }
 m.begin(chapter.lessons[0].id);
 for(let i=0;i<3;i++){const token=m.token();assert(m.submit(m.current().sample,token));assert.equal(m.submit(m.current().sample,token),false);assert(m.next(token));assert.equal(m.next(token),false)}
 assert.equal(m.state.stage,'summary');assert.equal(m.stats().turns,3);
}
assert.equal(m.state.completed.length,20);
const first=course.lessons[0].id;m.begin(first);
assert(m.submit('Hallo!',m.token()));m.next(m.token());
assert(m.submit('Ik bent Olena.',m.token()));assert.equal(m.state.pending.corrected,'Ik ben Olena.');assert.equal(m.state.pending.rule,'zijn');
m=make();assert.equal(m.state.stage,'feedback');assert.equal(m.state.pending.original,'Ik bent Olena.');assert.equal(m.next(m.token()),false,'A correction needs practice or an explicitly assisted example');
assert(m.repair());assert.equal(m.repeat('Ik ben iemand anders.'),false);assert(m.repeat('IK BEN OLENA!'));
m.practiceDraft('Ik moe ben.');m=make();assert.equal(m.state.practiceDraft,'Ik moe ben.');assert.equal(m.state.stage,'transfer');assert.equal(m.transfer('Ik moe ben.'),false);assert(m.transfer('Ik ben moe.'));assert(m.state.pending.practised);
assert(m.state.corrections.find(x=>x.original==='Ik bent Olena.').practised);m.next(m.token());
m.hint(1);m.hint(3);assert.equal(m.state.hint,3);m.hint(1);assert.equal(m.state.hint,3);
m=make();assert.equal(m.state.hint,3);m.submit('Goed, dank je.',m.token());m.next(m.token());assert.equal(m.state.stage,'summary');assert.equal(m.stats().independent,1);assert.equal(m.stats().assisted,2);assert.equal(m.stats().corrections,1);
// No false error claims for unsupported wording; a model answer is explicitly assisted.
m.begin(first);assert.equal(m.stats().corrections,0);m.submit('Een heel andere formulering.',m.token());assert.equal(m.state.pending.kind,'unconfirmed');assert.equal(m.next(m.token()),false);m.retry();assert.equal(m.state.draft,'Een heel andere formulering.');m.submit('Een heel andere formulering.',m.token());m.useExample();assert(m.next(m.token()));assert(m.state.replies[0].assisted);
// Every known rule preserves the rest of the learner's sentence and has a transfer task.
for(const [text,key,corrected] of [['Ik hebt een kat.','hebben','Ik heb een kat.'],['Ik gaat naar huis.','gaan','Ik ga naar huis.'],['Ik willen water.','willen','Ik wil water.'],['Morgen ik ga werken.','inversion','Morgen ga ik werken.'],['Ik heb gegaan.','perfectZijn','Ik ben gegaan.'],['Ik ben gewerkt.','perfectHebben','Ik heb gewerkt.']]){
 const result=api.checkResponse(api.SCENARIOS.comm[1],text);assert.equal(result.rule,key);assert.equal(result.corrected,corrected);assert(api.RULES[key].practice);assert.equal(api.RULES[key].prompt.length,4);
}
m.pause();assert.equal(make().state.open,false);m.resume();assert.equal(make().state.open,true);
for(const raw of ['{','[]','null','{"version":1,"lesson":"bad","open":true,"index":999}','{"version":1,"corrections":[{"rule":"bad"}]}']){
 const x=api.create(course,storage({[api.KEY]:raw}));assert.equal(x.state.lesson,null);assert.equal(x.state.open,false);assert.equal(x.state.corrections.length,0);
}
const denied=api.create(course,{getItem(){throw Error('denied')},setItem(){throw Error('denied')}});denied.begin(first);assert(denied.current());assert.equal(denied.persistent,false);
// Render the real UI with a small DOM to test the speech callback lifecycle.
function element(tag){return {tag,children:[],textContent:'',attrs:{},append(...xs){this.children.push(...xs)},appendChild(x){this.children.push(x)},setAttribute(k,v){this.attrs[k]=v},focus(){},replaceChildren(...xs){this.children=xs}}}
ctx.document={createElement:element};vm.runInContext(read('modules/lesson-conversation/ui.js'),ctx);
const flat=e=>[e,...e.children.flatMap(flat)],root=element('root'),speech=[];let recognizer,canListen=true,view;
const uiModel=api.create(course,storage());uiModel.begin(first);
const bridge={person:()=>({name:'Dafna',image:'./img/chars/dafna.webp'}),lessonWords:()=>['hallo'],speak:x=>speech.push(x),stopListening(){},canListen:()=>canListen,listen:(ok,fail)=>recognizer={ok,fail},render(){root.replaceChildren();view.render(root,'uk')},nextLesson(){}};
view=api.createView(uiModel,bridge);bridge.render();
const click=text=>{const b=flat(root).find(e=>e.tag==='button'&&e.textContent===text);assert(b,'Missing button '+text);b.onclick()};
click('🔊 Послухати');assert.equal(speech[0],'Hallo!');click('🎤 Відповісти голосом');recognizer.ok(['Hallo!']);
assert.equal(uiModel.state.draft,'Hallo!','Recognising after playback must still update the draft');assert.equal(uiModel.state.stage,'question','Speech must be reviewed before submission');
const stale=recognizer;view.cancel();stale.ok(['late callback']);assert.equal(uiModel.state.draft,'Hallo!','Late microphone callbacks must not change the conversation');
canListen=false;bridge.render();assert(!flat(root).some(e=>e.tag==='button'&&e.textContent==='🎤 Відповісти голосом'));assert(flat(root).some(e=>e.tag==='textarea'));
for(const lang of api.langs){assert(api.tr('hint3',lang));assert(api.tr('unknown',lang));assert(api.tr('limits',lang))}
assert(script.includes('"leren_path_talk_v1"]);'),'Conversation transcripts must be excluded from account sync');
const cache=JSON.parse(read('sw.js').match(/const APP_FILES = (\[[^;]+\]);/)[1]);for(const f of ['content','core','ui'])assert(cache.includes('./modules/lesson-conversation/'+f+'.js?v=90'));
console.log(`PASS: ${turns} authored turns across 20 topics; four languages, seven correction patterns, sentence repetition and transfer, interrupted-conversation restoration, hints/assisted counts, duplicate/stale guards, speech-after-playback and stale microphone callbacks, text fallback, corrupt/blocked storage and offline assets`);
