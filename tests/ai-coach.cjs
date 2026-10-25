const assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
const read=p=>fs.readFileSync(p,'utf8'),html=read('index.html'),script=html.match(/<script>\s*([\s\S]*?)<\/script>/)[1];
const ctx=vm.createContext({console,AbortController,setTimeout,clearTimeout});vm.runInContext(read('modules/ai-coach/core.js'),ctx);const api=ctx.LerenAICoach;
const element=tag=>({tag,children:[],attrs:{},textContent:'',append(...xs){this.children.push(...xs)},appendChild(x){this.children.push(x)},setAttribute(k,v){this.attrs[k]=v}});ctx.document={createElement:element};vm.runInContext(read('modules/ai-coach/ui.js'),ctx);
const flat=e=>[e,...e.children.flatMap(flat)];
(async()=>{
 assert.equal(api.normalize('Ik ben Anna!'),api.normalize(' ik BEN Anna. '));
 for(const target of ['nl','en','fr']){assert(api.helpPrompt({target,question:'a'.repeat(1000)}).length<=600);assert(api.helpPrompt({target,corrected:'a'.repeat(1000)}).length<=600)}
 assert.equal(api.examples({examples:[{lang:'en',text:'wrong language'},{lang:'nl',text:'Hallo!',translation:'Привіт'},{lang:'nl',text:'second'}]},'nl').length,1);
 let captured;const good=await api.request('test',{mode:'chat'},{fetch:async(url,opts)=>{captured=opts;return {ok:true,json:async()=>({reply:'Hallo!'})}}});assert.equal(good.reply,'Hallo!');assert(captured.signal);assert.equal(JSON.parse(captured.body).mode,'chat');
 await assert.rejects(api.request('test',{}, {fetch:async()=>({ok:false,status:429,json:async()=>({})})}),e=>e.code==='limit');
 await assert.rejects(api.request('test',{}, {fetch:async()=>({ok:true,json:async()=>null})}),e=>e.code==='format');
 let signal;await assert.rejects(api.request('test',{}, {timeout:5,fetch:async(u,o)=>{signal=o.signal;return new Promise(()=>{})}}),e=>e.code==='timeout');assert.equal(signal.aborted,true);
 const state=()=>({chat:true,target:'nl',lang:'uk',msgs:[],busy:false,draft:''});let renders=0,speech=0,rewards=0,logged=0,resolve,reject,requests=[];
 const runtime=vm.createContext({console,gState:state(),view:'games',targetLang:'nl',uiLang:'uk',AI_ENDPOINT:'test',LerenAICoach:{...api,request:async(url,body)=>{requests.push(body);return await new Promise((ok,no)=>{resolve=ok;reject=no})}},aiRender:()=>renders++,aiProfile:()=>({level:'a11'}),charId:()=> 'peter',aiMemory:()=>'',aiMsgs:x=>x.map(m=>({role:m.role,content:m.content})),gNorm:api.normalize,logMistake:()=>logged++,say:()=>speech++,gameDone:()=>rewards++,aiRemember:()=>{}});
 vm.runInContext(script.slice(script.indexOf('function aiCurrent(s){'),script.indexOf('// ========== ASK {N}')),runtime);
 const original=runtime.gState;let task=runtime.aiSend('Ik bent Anna.');assert.equal(original.msgs.length,1);reject(Error('offline'));await task;assert(original.failed);assert.equal(original.pendingUser.content,'Ik bent Anna.');
 task=runtime.aiSend(null);assert.equal(original.msgs.length,1,'Retry must not duplicate a learner message');resolve({reply:'Hallo Anna. Hoe gaat het?',translation:'Привіт, як справи?',correction:{corrected:'Ik ben Anna.',explanation:'Ik + ben'}});await task;assert.equal(original.msgs.length,2);assert.equal(original.msgs[0].fix.corrected,'Ik ben Anna.');assert.equal(logged,1);assert.equal(rewards,0);
 // Starting another chat before the response arrives must block all old side effects.
 runtime.gState=state();task=runtime.aiSend('Hallo!');const before={renders,speech,logged,rewards};runtime.gState=state();resolve({reply:'Old reply',correction:{corrected:'changed'}});await task;assert.deepEqual({renders,speech,logged,rewards},before);assert.equal(runtime.gState.msgs.length,0);
 // A navigation error must not render over another screen either.
 task=runtime.aiSend('Hallo!');const count=renders;runtime.view='lesson';reject(Error('offline'));await task;assert.equal(renders,count);runtime.view='games';runtime.gState=state();
 task=runtime.aiSend('   ');await task;assert.equal(runtime.gState.msgs.length,0);
 runtime.gState.msgs=[{role:'assistant',content:'Waar woon je?'}];const messages=runtime.gState.msgs.length;
 task=runtime.aiHelp();assert.equal(requests.at(-1).mode,'ask');resolve({answer:'Почни з «Ik woon in…».',examples:[{lang:'nl',text:'Ik woon in Gent.',translation:'Я живу в Генті.'}]});await task;assert.equal(runtime.gState.help.examples[0].text,'Ik woon in Gent.');assert.equal(runtime.gState.msgs.length,messages);assert.equal(rewards,0);
 // A delayed hint cannot enter a different session.
 task=runtime.aiHelp();runtime.gState=state();resolve({answer:'Old help',examples:[]});await task;assert.equal(runtime.gState.help,undefined);
 for(const lang of ['uk','en','fr','ar']){assert(api.tr('help',lang));assert(api.tr('heard',lang));const root=element('root'),practice={corrected:'Ik ben Anna.',draft:'',status:''};api.tools(root,{msgs:[{role:'assistant'}],practice},{lang,target:'nl',help(){},close(){}});assert(flat(root).some(x=>x.tag==='textarea'));}
 const root=element('root'),practice={corrected:'Ik ben Anna.',draft:'',status:''};let used;
 api.tools(root,{msgs:[{role:'assistant'}],practice,help:{answer:'<script>text</script>',examples:[{text:'Ik woon in Gent.',translation:'Я живу в Генті.'}]}},{lang:'uk',target:'nl',help(){},close(){},use:x=>used=x});
 const all=flat(root),input=all.find(x=>x.tag==='textarea'),form=all.find(x=>x.tag==='form');input.value='Ik Anna ben.';form.onsubmit({preventDefault(){}});assert.equal(practice.status,'again');input.value='ik ben Anna!';form.onsubmit({preventDefault(){}});assert.equal(practice.status,'ok');all.find(x=>x.tag==='button'&&x.textContent==='Вставити й відредагувати приклад').onclick();assert.equal(used,'Ik woon in Gent.');assert(all.some(x=>x.textContent==='<script>text</script>'&&x.children.length===0));
 const cache=JSON.parse(read('sw.js').match(/const APP_FILES = (\[[^;]+\]);/)[1]);for(const p of ['core','ui']){assert(cache.includes('./modules/ai-coach/'+p+'.js?v=92'));assert(html.includes('./modules/ai-coach/'+p+'.js?v=92'))}
 console.log('PASS: live-chat retry without duplicates, stale replies/errors/hints blocked, request timeout and abort, rate limit, editable hint examples, correction practice in four languages, safe text rendering and offline resources');
})().catch(e=>{console.error(e);process.exitCode=1});
