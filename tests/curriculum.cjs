const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const html=fs.readFileSync('index.html','utf8'),script=html.match(/<script>([\s\S]*?)<\/script>/)[1];
const curriculum=fs.readFileSync('course-curriculum.js','utf8');
const prefix=curriculum+'\n'+script.slice(0,script.indexOf('function validStored'));
const ctx=vm.createContext({assert,console,shuffle:a=>a});
vm.runInContext(prefix,ctx);
const testStart=script.indexOf('const DIPH_UI = '),testEnd=script.indexOf('\nlet toetsId',testStart);
vm.runInContext(script.slice(testStart,testEnd)+'\n'+script.slice(script.indexOf('const BUILD_BANK='),script.indexOf('const SENT=')),ctx);
vm.runInContext(`
 const special=new Set(['clock','vervoegen','diphthongs']);
 const allTabs=CATEGORIES.flatMap(c=>c.tabs);
 assert.equal(new Set(allTabs).size,allTabs.length,'A lesson must have exactly one home');
 assert.equal(CATEGORIES.filter(c=>c.chapter).length,12);
 assert.deepEqual(CATEGORIES.filter(c=>c.chapter).map(c=>c.chapter),Array.from({length:12},(_,i)=>i+1));
 for(const c of CATEGORIES){
  assert(BUILD_BANK[c.id]?.some(r=>r[0]===1),'No beginner sentence exercise: '+c.id);
  for(const lang of ['uk','en','fr','ar'])assert(UI[lang].cats[c.id]);
  for(const t of c.tabs)if(!special.has(t)){
   assert(DATA[t]?.items.length>=4,'Insufficient lesson content: '+t);
   for(const lang of ['uk','en','fr','ar'])assert(UI[lang].tabs[t],'Missing label '+t);
  }
 }
 for(const key of Object.keys(DATA))assert(allTabs.includes(key),'Orphaned lesson '+key);
 const owner=t=>CATEGORIES.find(c=>c.tabs.includes(t));
 for(const t of ['routine','separable','niet','bezit','modal','toekomst','afspraak','telefoon'])assert.equal(owner(t).lvl,'a11');
 for(const t of ['holiday','journey','returns','secondhand','messages','appointments','notices','directions','comparison','perfectum'])assert.equal(owner(t).lvl,'a12');
 assert.equal(owner('diphthongs').id,'grammar');
 const ids=new Set();let added=0;
 for(const d of Object.values(DATA))for(const card of d.items){
  assert(!ids.has(card.id),'Duplicate '+card.id);ids.add(card.id);
  if(card.id.startsWith('course_'))added++;
  for(const lang of ['nl','uk','en','fr','ar'])assert(card[lang]?.trim(),'Missing translation '+card.id+' '+lang);
 }
 assert.equal(ids.size-added,762,'Existing card IDs must be retained');
 const testIds=new Set();
 for(const t of TOETS){
  assert(!testIds.has(t.id));testIds.add(t.id);
  if(!t.id.startsWith('course_')&&!t.id.startsWith('lt_a12_course'))continue;
  assert(t.questions.length>=5);
  for(const q of t.questions){
   assert.equal(q.opts.length,4);assert(q.ok>=0&&q.ok<4);
   for(const lang of ['uk','en','fr','ar']){
    assert(q.q[lang]);
    const opts=q.opts.map(o=>typeof o==='string'?o:o[lang]);
    assert(opts.every(Boolean));assert.equal(new Set(opts).size,4,'Ambiguous choices: '+t.id+' '+lang);
   }
  }
 }
 for(const [id] of [...LerenCurriculum.chapters,...LerenCurriculum.advanced])assert(testIds.has('course_'+id+'_v1'));
 assert.equal(TOETS.find(t=>t.kind==='leveltest').questions.length,12);
 assert.equal(TOETS.find(t=>t.id==='t5').lvl,'a11');
 assert.equal(TOETS.find(t=>t.id==='t10_course_v2').lvl,'a11');
 const ds=[],ss=[];LerenCurriculum.games(ds,ss);
 assert.equal(ds.length,4);assert.equal(ss.length,6);assert(ds.every(d=>d.lvl==='a12'&&d.lines.length>=6));
 console.log('PASS: 12 chapters, '+added+' new cards, all legacy IDs retained, '+TOETS.length+' tests, four A1.2 dialogues, six A1.2 speaking prompts, unique lesson ownership and sentence coverage');
`,ctx);
// Execute actual startup migration with old saved locations and earned progress.
const start=script.indexOf('function validStored'),end=script.indexOf('const el=(t,c,x)');
for(const [oldCat,tab,oldLevel,newCat,newLevel] of [
 ['dag','routine','a12','dag','a11'],['grammar2','bezit','a12','people','a11'],
 ['plans','afspraak','a12','health','a11'],['people','doctor','a11','health','a11'],
 ['home','clothes','a11','service','a12'],['grammar','diphthongs','a11','grammar','a11']]){
 const saved={poly_cat:oldCat,poly_tab:tab,poly_level:oldLevel,poly_score:'1200',poly_progress:'{"fam_moeder":{"correct":4,"wrong":1}}'};
 const c=vm.createContext({localStorage:{getItem:k=>saved[k]??null},assert});
 vm.runInContext(prefix+'\n'+`
 function catLevel(id){return CATEGORIES.find(c=>c.id===id)?.lvl||'a11'}
 function levelCats(lv){return CATEGORIES.filter(c=>c.lvl===lv)}
 function levelUnlocked(id){return id==='a11'||(id==='a12'&&score>=1000)}
 `+script.slice(start,end)+`\nassert.equal(currentCat,${JSON.stringify(newCat)});assert.equal(curLevel,${JSON.stringify(newLevel)});assert.equal(tab,${JSON.stringify(tab)});assert.equal(store.fam_moeder.correct,4);assert.equal(score,1200);`,c);
}
console.log('PASS: saved lessons follow their new chapters and retain score and progress');
