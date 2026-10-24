const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const html=fs.readFileSync('index.html','utf8'),script=html.match(/<script>([\s\S]*?)<\/script>/)[1];
function fn(name){const start=script.indexOf('function '+name+'(');return script.slice(start,script.indexOf('\n}',start)+2)}
const grow=script.slice(script.indexOf('const GROW_UI='),script.indexOf('const growU='));
for(const lang of ['uk','en','fr','ar'])for(const count of [12,17]){
 const ctx=vm.createContext({targetLang:"nl",view:"lesson",lsGet:()=>false,el:(tag,cls,text)=>({text,children:[],append(...x){this.children.push(...x)},appendChild(x){this.children.push(x)}}),setTimeout(){}});
 ctx.popup=build=>{const p={children:[],append(...x){this.children.push(...x)},appendChild(x){this.children.push(x)}};build(p,()=>{},{dataset:{}});ctx.panel=p};
 vm.runInContext(grow+`const growU=()=>GROW_UI.${lang};const TOETS=[{kind:'leveltest',unlocks:'a12',questions:Array(${count})}];`+fn('firstRun')+';firstRun()',ctx);
 const subtitle=ctx.panel.children[2].children[1].children[1].text;
 assert(subtitle.includes(String(count)));assert(!subtitle.includes('{n}'));
}
// A stale cached sw.js must not hide the server's version; normal cached lessons
// and offline navigations must still work.
const listeners={},cached=new Response('cached lesson'),calls=[];
const ctx=vm.createContext({URL,Response,console,self:{location:{origin:'https://example.test'},addEventListener:(k,f)=>listeners[k]=f},
 caches:{match:async request=>{calls.push('cache');return cached},open:async()=>({put(){}})},
 fetch:async()=>{throw Error('offline')}});
vm.runInContext(fs.readFileSync('sw.js','utf8'),ctx);
async function request(path,extra={}){let result;listeners.fetch({request:{method:'GET',url:'https://example.test'+path,...extra},respondWith:p=>result=p});return result?await result:undefined}
(async()=>{
 assert.equal(await request('/sw.js'),undefined);
 assert.equal(await request('/project/sw.js?version-check=123',{cache:'no-store'}),undefined);
 assert.equal(calls.length,0,'Version checks must not consult cache');
 assert.equal(await request('/course-curriculum.js'),cached);
 assert.equal(await request('/index.html',{mode:'navigate'}),cached);
 const c=vm.createContext({Date,fetch:async(url,options)=>{assert(url.startsWith('sw.js?version-check='));assert.equal(options.cache,'no-store');return{text:async()=> 'const CACHE_NAME = "leren-be-v999";'}}});
 const start=script.indexOf('async function swVersion()');vm.runInContext(script.slice(start,script.indexOf('\nasync function showUpdateBar',start))+';globalThis.check=swVersion',c);
 assert.equal(await c.check(),'999');
 console.log('PASS: first-run count in four languages, uncached version checks, normal asset cache and offline navigation');
})().catch(e=>{console.error(e);process.exitCode=1});
