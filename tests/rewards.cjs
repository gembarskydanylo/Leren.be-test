const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const read=p=>fs.readFileSync(p,'utf8'),script=read('index.html').match(/<script>([\s\S]*?)<\/script>/)[1];
const c=vm.createContext({});c.window=c;vm.runInContext(read('modules/rewards/core.js'),c);const api=c.LerenRewards;
function storage(initial={}){const map=new Map(Object.entries(initial));return {get length(){return map.size},key:i=>[...map.keys()][i],getItem:k=>map.get(k)??null,setItem:(k,v)=>map.set(k,String(v)),removeItem:k=>map.delete(k),data:()=>Object.fromEntries(map)}}
const s=storage(),model=api.create(s),time='2026-10-25T12:00:00.000Z';assert.equal(model.observe({xp:99},time).length,0);assert.equal(model.observe({xp:100},time)[0].id,'xp-100');assert.equal(model.observe({xp:100},time).length,0);
assert.equal(api.create(s).state.earned['xp-100'],time);assert.equal(model.observe({xp:500,lessons:10,chapters:1,perfect:1,streak:7},time).length,8);
assert.equal(model.next(249),250);assert.equal(model.next(10000),null);assert.equal(api.create(storage({[api.KEY]:'{'})).observe({xp:100},time).length,1);
const denied=api.create({getItem(){throw Error('blocked')},setItem(){throw Error('blocked')}});denied.observe({xp:100},time);assert.equal(denied.persistent,false);assert.equal(denied.state.earned['xp-100'],time);
assert.equal(api.gameGain(s,'ai',30,'2026-10-25'),30);assert.equal(api.gameGain(s,'ai',30,'2026-10-25'),0);assert.equal(api.gameGain(s,'ai',80,'2026-10-25'),20);assert.equal(api.gameGain(s,'ai',80,'2026-10-25'),0);assert.equal(api.gameGain(s,'ai',30,'2026-10-26'),30);
const merged=api.mergeSnapshots({poly_score:'500',poly_progress:'{"a":{"correct":4,"known":true}}',leren_path_v1:'{"completed":{"a":5},"session":{"lesson":"a"}}',[api.KEY]:JSON.stringify({earned:{'xp-100':time}})}, {poly_score:'250',poly_progress:'{"b":{"correct":3},"a":{"correct":2,"known":false}}',leren_path_v1:'{"completed":{"b":4},"session":{"lesson":"b"}}',[api.KEY]:JSON.stringify({earned:{'lesson-1':time}})},()=>true);
assert.equal(merged.poly_score,'500');assert.equal(JSON.parse(merged.poly_progress).a.correct,4);assert.equal(JSON.parse(merged.poly_progress).a.known,true);assert.equal(JSON.parse(merged.poly_progress).b.correct,3);assert.equal(JSON.parse(merged.leren_path_v1).session.lesson,'a');assert.equal(Object.keys(JSON.parse(merged[api.KEY]).earned).length,2);
const poison=api.mergeSnapshots(JSON.parse('{"__proto__":"x","poly_score":"NaN"}'),{poly_score:'10',private:'secret'},k=>k.startsWith('poly_'));assert.equal(poison.poly_score,'10');assert.equal(poison.private,undefined);assert.equal(Object.hasOwn(poison,'__proto__'),false);
// Run the actual host account/sync code against an in-memory Firestore transport.
function runtime(initial){const disk=storage(initial),requests=[],server={rev:'rev-1',envelope:{poly_score:'777',poly_progress:'{"main":true}',leren_beta_progress_v1:JSON.stringify({poly_score:'100',poly_toetsbest:'{"cloud":3}'})},conflict:false};let reloads=0;
 const r=vm.createContext({console,URLSearchParams,localStorage:disk,LerenRewards:api,location:{reload(){reloads++}},PUSH_CONFIG:{projectId:'fake'},toast(){},acctU:()=>({err:'sync error'}),rewardTimer:0,rewardPending:[],clearTimeout(){},setTimeout(){},renderRewards(){},view:'none',acctRender(){}});
 r.lsGet=(k,f)=>{try{return JSON.parse(disk.getItem(k))??f}catch{return f}};r.lsSet=(k,v)=>disk.setItem(k,JSON.stringify(v));
 const skip=script.slice(script.indexOf('const SYNC_SKIP='),script.indexOf('const acct={mod:null'));
 const host=script.slice(script.indexOf('const acct={mod:null'),script.indexOf('async function acctSignIn()'));
 vm.runInContext(skip+host+'\nglobalThis.testAcct=acct;globalThis.allowed=syncable;',r);
 r.testAcct.user={uid:'alice',getIdToken:async()=> 'mock-token'};r.testAcct.scopeReady=true;
 r.fetch=async(url,opts)=>{requests.push({url,opts});if(opts.method==='GET')return {ok:true,status:200,json:async()=>({updateTime:server.rev,fields:{blob:{stringValue:JSON.stringify(server.envelope)}}})};
  const query=new URL(url).searchParams;assert.equal(query.get('currentDocument.updateTime'),server.rev);assert.deepEqual(query.getAll('updateMask.fieldPaths'),['blob','updated','v']);
  if(server.conflict){server.conflict=false;server.rev='rev-2';server.envelope.poly_score='999';return {ok:false,status:412}}
  server.envelope=JSON.parse(JSON.parse(opts.body).fields.blob.stringValue);server.rev='rev-next';return {ok:true,status:200};
 };
 return {r,disk,requests,server,get reloads(){return reloads}};
}
(async()=>{
 let t=runtime({poly_score:'250',poly_toetsbest:'{"local":5}'});await t.r.syncPush();assert.equal(t.server.envelope.poly_score,'777','beta must preserve main XP');assert.equal(t.server.envelope.poly_progress,'{"main":true}');const beta=JSON.parse(t.server.envelope.leren_beta_progress_v1);assert.equal(beta.poly_score,'250');assert.equal(JSON.parse(beta.poly_toetsbest).cloud,3);assert.equal(JSON.parse(t.disk.getItem('poly_toetsbest')).cloud,3);assert.equal(t.reloads,1);
 t=runtime({poly_score:'250'});t.server.conflict=true;await t.r.syncPush();assert.equal(t.server.envelope.poly_score,'999');assert.equal(t.requests.filter(q=>q.opts.method==='GET').length,2,'conflict must reread');
 t=runtime({poly_score:'250'});t.r.fetch=async()=>({ok:false,status:403});await assert.rejects(t.r.syncPush());assert.equal(t.disk.getItem('poly_score'),'250');assert.equal(t.disk.getItem('leren_sync_at'),null);assert.equal(t.r.testAcct.syncing,null);
 t=runtime({poly_score:'250',leren_progress_owner_v1:'"alice"',leren_ai_memory:'"private note"'});t.r.testAcct.user={uid:'bob'};assert(t.r.scopeAccount('bob'));assert.equal(t.disk.getItem('poly_score'),null);assert.equal(t.disk.getItem('leren_ai_memory'),null);assert.equal(JSON.parse(t.disk.getItem('leren_profiles_v1')).alice.poly_score,'250');t.r.scopeAccount('alice');assert.equal(t.disk.getItem('poly_score'),'250');assert.equal(t.disk.getItem('leren_ai_memory'),'"private note"');
 t=runtime({poly_score:'250'});assert.equal(t.r.scopeAccount('alice'),false);assert.equal(t.disk.getItem('poly_score'),'250');t.r.scopeAccount(null);assert.equal(t.disk.getItem('poly_score'),null);t.r.scopeAccount('bob');assert.equal(t.disk.getItem('poly_score'),null,'second account must not inherit claimed guest work');
 for(const k of ['leren_profiles_v1','leren_progress_owner_v1','leren_beta_progress_v1','leren_ai_memory'])assert.equal(t.r.allowed(k),false);
 // Answers completed while PATCH is in flight must remain on the device.
 t=runtime({poly_score:'250'});const transport=t.r.fetch;let release;let entered;const writeEntered=new Promise(r=>entered=r);t.r.fetch=async(url,opts)=>{if(opts.method==='PATCH'){entered();await new Promise(r=>release=r)}return transport(url,opts)};
 const inFlight=t.r.syncPush();await writeEntered;t.disk.setItem('poly_score','300');t.disk.setItem('poly_toetsbest','{"newAnswer":5}');release();await inFlight;assert.equal(t.disk.getItem('poly_score'),'300');assert.equal(JSON.parse(t.disk.getItem('poly_toetsbest')).newAnswer,5);
 // Central XP must persist even when its caller does not save afterwards.
 let saved=0,observed=0;const xp=vm.createContext({score:90,rankInfo:()=>({cur:{id:'a11'}}),dailyState:()=>({xp:0,done:false}),dailyGoal:()=>100,lsSet(){},pushSync(){},saveStore(){saved++},rewardCheck(){observed++},queueProgressSync(){}});
 vm.runInContext(script.slice(script.indexOf('function addXP(n){'),script.indexOf('// XP for a correct answer')),xp);xp.addXP(10);assert.equal(xp.score,100);assert.equal(saved,1);assert.equal(observed,1);xp.addXP(Infinity);assert.equal(xp.score,100);
 // UI translations, safe text and offline resources are part of this release.
 c.document={};vm.runInContext(read('modules/rewards/ui.js'),c);for(const lang of ['uk','en','fr','ar'])assert.equal(api.tr(lang).names.length,api.badges.length);
 const files=JSON.parse(read('sw.js').match(/const APP_FILES = (\[[^;]+\]);/)[1]);for(const file of ['core.js','ui.js','style.css']){assert(files.includes('./modules/rewards/'+file+'?v='+(file==='ui.js'?'94':'93')));assert(read('index.html').includes('./modules/rewards/'+file+'?v='+(file==='ui.js'?'94':'93')))}
 assert(read('modules/rewards/style.css').includes('prefers-reduced-motion'));assert(script.includes('progress:syncSnapshot()'));assert(!script.slice(script.indexOf('async function acctDelete(){'),script.indexOf('function acctRender()')).includes('DELETE'));
 console.log('PASS: durable/idempotent milestones, corrupt/blocked storage, capped daily game improvements, non-destructive progress merge, beta envelope preserves production, revision retry, failed sync, account isolation including local AI memory, full backup, four languages and offline assets');
})().catch(e=>{console.error(e);process.exitCode=1});
