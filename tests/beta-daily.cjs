const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const html=fs.readFileSync('modules/daily-learning/index.html','utf8');
let source=[...html.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script>/g)].find(m=>!m[1].includes('src='))[2];
new vm.Script(source);
source=source.replace('function next(){','globalThis.testDaily={get state(){return state},get answers(){return answers},dialogues,chapterNames,start,reviewScreen,setStep(n){step=n;render()}};function next(){');
function boot(saved={},unavailable=false,loadCurriculum=true){
 const nodes={};
 class Element{
  constructor(tag='div'){this.tag=tag;this.children=[];this.disabled=false}
  set innerHTML(s){this.html=s;this.children=[];for(const m of s.matchAll(/id="([^"]+)"/g))nodes[m[1]]=new Element()}
  get innerHTML(){return this.html||''}
  append(...xs){this.children.push(...xs)}
  addEventListener(type,fn){this['on'+type]=fn}
 }
 nodes.app=new Element();
 const document={documentElement:{},getElementById:id=>nodes[id],createElement:t=>new Element(t),querySelectorAll:()=>nodes.opts.children};
 const ctx=vm.createContext({document,navigator:{languages:['uk']},Date,console,localStorage:{getItem(k){if(unavailable)throw Error('blocked');return saved[k]??null},setItem(k,v){if(unavailable)throw Error('blocked');saved[k]=v}}});
 if(loadCurriculum)vm.runInContext(fs.readFileSync('course-curriculum.js','utf8'),ctx);vm.runInContext(source,ctx);
 return {ctx,nodes,saved,api:ctx.testDaily,clickText(node,text){const b=node.children.find(x=>x.tag==='button'&&x.textContent===text);assert(b,'Missing button '+text);b.onclick();return b}};
}
const KEY='leren_daily_beta_v1',LANG='leren_daily_language_v1';
for(const raw of ['null','[]','true','42','"bad"','{','{"start":"x","completed":[],"review":"broken"}','{"completed":{"999":{"score":8}},"review":{"0-0":{"due":"yesterday"}}}']){
 const b=boot({[KEY]:raw,[LANG]:'not-a-language'});assert.equal(Object.keys(b.api.state.completed).length,0);assert.equal(Object.keys(b.api.state.review).length,0);
}
assert.doesNotThrow(()=>boot({},true),'Storage denial must leave onboarding usable');
for(const lang of ['uk','en','fr','ar']){const b=boot({[LANG]:lang});assert.equal(b.ctx.document.documentElement.lang,lang);assert.equal(b.ctx.document.documentElement.dir,lang==='ar'?'rtl':'ltr')}
const b=boot({[LANG]:'uk',[KEY]:JSON.stringify({start:'zero'})});
assert.equal(b.api.dialogues.length,12);assert.equal(b.api.chapterNames.length,12);
for(const [question,answer] of b.api.dialogues){assert(question.nl.endsWith('?'));assert(question.uk&&answer.nl&&answer.uk)}
assert(boot({},false,false).nodes.app.innerHTML.includes('Не вдалося завантажити теми'),'A failed course download must show a recovery screen');
b.api.start(0);b.api.setStep(2);
for(const answer of ['Привіт!','Дякую.','Як тебе звати?']){
 const button=b.nodes.opts.children.find(x=>x.textContent===answer);assert(button);button.onclick();button.onclick();b.clickText(b.nodes.stage,'Далі →');
}
assert.equal(b.api.answers,3,'A repeated click must not turn 3/3 into 6/3');
const due=Date.now()-1000;
const review={nl:'Hallo!',uk:'Привіт!',due,interval:4};
const r=boot({[LANG]:'uk',[KEY]:JSON.stringify({start:'zero',completed:{},review:{'0-0':review,'0-1':{nl:'Dank u.',uk:'Дякую.',due,interval:1}}})});
r.api.reviewScreen();r.clickText(r.nodes.reviewActions,'Показати переклад');const yes=r.clickText(r.nodes.reviewActions,'🙂 Так, згадав');yes.onclick();
assert.equal(r.api.state.review['0-0'].interval,8);assert.equal(r.api.state.review['0-1'].interval,1,'Old answer callback must not answer the next review card');
const nextDue=r.api.state.review['0-0'].due;r.api.start(0);r.api.setStep(4);r.clickText(r.nodes.stage,'✅ Завершити заняття');
assert.equal(r.api.state.review['0-0'].interval,8);assert.equal(r.api.state.review['0-0'].due,nextDue,'Replaying a chapter must preserve spaced repetition');
assert.equal(Object.keys(r.api.state.review).length,5);assert.equal(Object.keys(boot(r.saved).api.state.completed).length,1,'Completion survives reopening');
const appFiles=JSON.parse(fs.readFileSync('sw.js','utf8').match(/const APP_FILES = (\[[^;]+\]);/)[1]);
for(const path of ['index.html','modules/daily-learning/index.html']){
 const content=fs.readFileSync(path,'utf8');
 for(const m of content.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script>/g)){
  const src=m[1].match(/\bsrc=["']([^"']+)["']/);
  if(!src){new vm.Script(m[2]);continue}
  if(/^https?:/.test(src[1]))continue;
  const resolved=require('node:path').posix.normalize(require('node:path').posix.join(require('node:path').posix.dirname(path),src[1]));
  assert(fs.existsSync(resolved.split('?')[0]),'Missing browser script '+resolved);assert(appFiles.includes('./'+resolved),'Script missing from offline cache '+resolved);
 }
}
assert(!fs.readFileSync('index.html','utf8').includes('modules/belgium-lab/'),'Absent module must not break normal pages or printable exercises');
console.log('PASS: corrupted/blocked storage, four saved languages, repeated answers, persistent review intervals, restored completion and all page script dependencies');
