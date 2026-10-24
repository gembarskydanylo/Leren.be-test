const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm'),assert=require('node:assert/strict');
const root=path.join(__dirname,'..'),html=fs.readFileSync(path.join(root,'index.html'),'utf8');
const script=html.match(/<script>([\s\S]*?)<\/script>/)[1];new vm.Script(script);
// Validate the lesson database before any browser initialization runs.
vm.runInNewContext(fs.readFileSync(path.join(root,'course-curriculum.js'),'utf8')+'\n'+script.slice(0,script.indexOf('function validStored'))+`
 const ids=new Set();
 for(const d of Object.values(DATA))for(const item of d.items){
  if(!item.id||ids.has(item.id))throw Error('Missing or duplicate card ID: '+item.id);
  ids.add(item.id);
  for(const lang of ['nl','en','fr','uk','ar'])if(!item[lang])throw Error('Missing '+lang+' for '+item.id);
 }
`);
function fn(name){const start=script.indexOf('function '+name+'(');assert(start>=0,name);return script.slice(start,script.indexOf('\n}',start)+2)}
const saved={},ctx=vm.createContext({xp:0,stats:0,saves:0,
 addXP(n){ctx.xp+=n},weekState:()=>saved.week||{played:[],done:false},
 lsSet:(_,v)=>{saved.week=v},saveStore:()=>{ctx.saves++},updateStats:()=>{ctx.stats++},toast:()=>{},gU:()=>({})});
vm.runInContext(fn('gameDone'),ctx);
for(const id of ['rp','mm','dlg','bl','dc'])vm.runInContext(`gameDone('${id}',10)`,ctx);
assert.equal(ctx.xp,150);assert.equal(ctx.saves,5);assert.equal(ctx.stats,5);
vm.runInContext("gameDone('dc',10)",ctx);assert.equal(ctx.xp,160);assert.equal(saved.week.played.length,5);
let removed=0;const syncCtx=vm.createContext({syncSnapshot:()=>({poly_score:'12'}),localStorage:{removeItem:()=>removed++,setItem:()=>{}}});
vm.runInContext('const syncable=()=>true;\n'+fn('syncApply'),syncCtx);
for(const bad of ['null','[]','"invalid"'])assert.throws(()=>vm.runInContext(`syncApply(${bad})`,syncCtx));
assert.equal(removed,0,'invalid cloud data must not delete local progress');
// Execute the actual role-play render callback with a minimal DOM substitute.
class Element{constructor(){this.children=[];this.isConnected=true;this.classList={add(){}}}append(...xs){this.children.push(...xs)}appendChild(x){this.children.push(x)} }
let timers=[],speech=0,steps=0;const card=new Element(),state={d:{title:{},hint:'',lines:[['B','Hallo']]},role:'B',lvl:1,i:0,log:[],ok:0};
const rp=vm.createContext({gState:state,view:'games',gU:()=>({}),gTr:()=>'',gHead:()=>card,el:()=>new Element(),tgt:x=>x,dlgLineTr:()=>'',gBar(){},shuffle:x=>x,DIALOGUES:[],say:()=>speech++,setTimeout:f=>timers.push(f),rpStep:()=>steps++});
vm.runInContext(fn('rpRender')+'\nrpRender()',rp);
const options=card.children.at(-1);options.children[0].onclick();options.children[0].onclick();
assert.equal(state.i,1);assert.equal(state.ok,1);assert.equal(speech,1);assert.equal(timers.length,1);
rp.view='lesson';timers[0]();assert.equal(steps,0,'leaving game cancels delayed transition');
// Cache entries and manifest assets must all exist locally.
const sw=fs.readFileSync(path.join(root,'sw.js'),'utf8');new vm.Script(sw);
const appFiles=JSON.parse(sw.match(/const APP_FILES = (\[[^;]+\]);/)[1]);
for(const file of appFiles)assert(fs.existsSync(path.join(root,file.split("?")[0])),`Missing offline asset: ${file}`);
const manifest=JSON.parse(fs.readFileSync(path.join(root,'manifest.webmanifest'),'utf8'));
for(const item of [...manifest.icons,...manifest.screenshots])assert(fs.existsSync(path.join(root,item.src)),`Missing manifest asset: ${item.src}`);
(async()=>{
 const worker=await import('data:text/javascript;base64,'+Buffer.from(fs.readFileSync(path.join(root,'tools/ai-worker.js'),'utf8')).toString('base64'));
 for(const body of [null,[],true,'invalid']){
 const req=new Request('https://example.test/',{method:'POST',headers:{Origin:'http://localhost:8765','Content-Type':'application/json'},body:JSON.stringify(body)});
 const response=await worker.default.fetch(req,{});assert.equal(response.status,400);
 }
 console.log(`PASS: game XP persistence, weekly bonus, repeated clicks, navigation timer, cloud data guards, worker validation, syntax and ${appFiles.length} offline assets`);
})().catch(e=>{console.error(e);process.exitCode=1});
