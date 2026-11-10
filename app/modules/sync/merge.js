/* Safe merging of learning progress between devices (account sync and backups). Pure functions over stored
   strings/objects: no DOM, no storage, no network (tests run them in node).

   Two rules make simultaneous work on a phone and a computer safe:
   1. Counters are per device ("grow-only counters"). Every device only ever increases its own part
      (dev[<device id>]); merging takes, per device, the larger part (= the newer one); the total is the sum of all
      parts. So two devices that each add 1 give +2, and merging the same copy twice (sync retry, restoring the same
      backup again) never counts anything twice.
   2. XP for beating a record (route lesson, test, exam part, weekly bonus) is a grant with a key. Both devices that
      reach the same record store the same key; merging keeps the larger value, so the reward counts once.
   Everything else has an explicit rule per key (see mergeKey). Data written by v174 and older (the *_v1 keys and
   poly_score) is read as one extra "legacy" part, the same on every device, so it is never counted twice either. */
(()=>{'use strict';
 const LEGACY='v1',KEEP_DAYS=60,RECENT=30,SLIP_RECENT=20,LEVELS=['a11','a12'],QUIZ=['lezen','luisteren','schrijven'];
 const obj=v=>v!==null&&typeof v==='object'&&!Array.isArray(v);
 const num=v=>Number.isFinite(Number(v))&&Number(v)>0?Number(v):0;
 const int=v=>Math.floor(num(v));
 const SAFE=k=>typeof k==='string'&&k.length>0&&k.length<=80&&!['__proto__','prototype','constructor'].includes(k);
 const DAY=/^\d{4}-\d{2}-\d{2}$/;
 const parse=s=>{if(typeof s!=='string')return undefined;try{return JSON.parse(s)}catch{return undefined}};
 const newDeviceId=(rand=Math.random,now=Date.now())=>'d'+now.toString(36)+rand().toString(36).slice(2,10);
 const sumVals=o=>Object.values(o||{}).reduce((a,v)=>a+num(v),0);

 // ---------------- XP: base (points earned before v175) + keyed record grants + per-device daily buckets
 function cleanXp(raw){const x={v:2,base:0,g:{},d:{}};if(!obj(raw))return x;x.base=int(raw.base);
  if(obj(raw.g))for(const [k,v] of Object.entries(raw.g))if(SAFE(k)&&num(v))x.g[k]=int(v);
  if(obj(raw.d))for(const [dev,days] of Object.entries(raw.d))if(SAFE(dev)&&obj(days)){const o={};for(const [d,v] of Object.entries(days))if(DAY.test(d)&&num(v))o[d]=int(v);if(Object.keys(o).length)x.d[dev]=o}
  return x}
 const xpTotal=raw=>{const x=cleanXp(raw);return x.base+sumVals(x.g)+Object.values(x.d).reduce((a,days)=>a+sumVals(days),0)};
 // Add n points: with a key (a record grant) the key grows; without, this device's bucket of the day grows.
 function xpAdd(raw,dev,day,n,key){const x=cleanXp(raw);n=int(n);if(!n)return x;if(key&&SAFE(key))x.g[key]=(x.g[key]||0)+n;else{const own=x.d[dev]||(x.d[dev]={});own[day]=(own[day]||0)+n}return x}
 function xpMerge(a,b){const x=cleanXp(a),y=cleanXp(b),o={v:2,base:Math.max(x.base,y.base),g:{...x.g},d:{}};
  for(const [k,v] of Object.entries(y.g))o.g[k]=Math.max(o.g[k]||0,v);
  for(const dev of new Set([...Object.keys(x.d),...Object.keys(y.d)])){const p=x.d[dev]||{},q=y.d[dev]||{},r={};for(const d of new Set([...Object.keys(p),...Object.keys(q)]))r[d]=Math.max(p[d]||0,q[d]||0);o.d[dev]=r}
  return o}
 // Points that only an older version knew about (it raised poly_score directly) become part of the base, once.
 function xpAbsorb(raw,score){const x=cleanXp(raw),diff=int(score)-xpTotal(x);if(diff>0)x.base+=diff;return x}

 // ---------------- Study minutes per device and local day (seconds)
 function cleanMinutes2(raw){const m={v:2,dev:{}};if(obj(raw)&&obj(raw.dev))for(const [dev,days] of Object.entries(raw.dev))if(SAFE(dev)&&obj(days)){const o={};for(const [d,s] of Object.entries(days))if(DAY.test(d)&&num(s))o[d]=Math.min(86400,num(s));m.dev[dev]=o}return m}
 const prune=days=>{const keep=Object.keys(days).sort().slice(-KEEP_DAYS),o={};for(const d of keep)o[d]=days[d];return o}; // the 60 latest days of a device
 function minutesAdd(raw,dev,day,ms){const m=cleanMinutes2(raw);if(!(ms>0))return m;const own=m.dev[dev]||{};own[day]=Math.min(86400,(own[day]||0)+ms/1000);m.dev[dev]=prune(own);return m}
 function minutesMerge(a,b){const x=cleanMinutes2(a),y=cleanMinutes2(b),o={v:2,dev:{}};for(const dev of new Set([...Object.keys(x.dev),...Object.keys(y.dev)])){const p=x.dev[dev]||{},q=y.dev[dev]||{},r={};for(const d of new Set([...Object.keys(p),...Object.keys(q)]))r[d]=Math.max(p[d]||0,q[d]||0);o.dev[dev]=prune(r)}return o}
 // The shape modules/insights/core.js reads: {days:{day:seconds}} summed over devices.
 function minutesView(raw){const m=cleanMinutes2(raw),days={};for(const p of Object.values(m.dev))for(const [d,s] of Object.entries(p))days[d]=Math.min(86400,(days[d]||0)+s);return {days}}
 const minutesFromV1=v1=>({v:2,dev:{[LEGACY]:obj(v1)&&obj(v1.days)?Object.fromEntries(Object.entries(v1.days).filter(([d,s])=>DAY.test(d)&&num(s))):{}}});

 // ---------------- Skills per device and course: {ok,n,r,t}; speaking {n,t}
 const blankSkills=()=>({lezen:{ok:0,n:0,r:'',t:0},luisteren:{ok:0,n:0,r:'',t:0},schrijven:{ok:0,n:0,r:'',t:0},spreken:{n:0,t:0}});
 function cleanSlice(src){const b=blankSkills();if(!obj(src))return b;for(const k of QUIZ){const x=obj(src[k])?src[k]:{};b[k].n=int(x.n);b[k].ok=Math.min(int(x.ok),b[k].n);b[k].r=typeof x.r==='string'?x.r.replace(/[^01]/g,'').slice(-RECENT):'';b[k].t=int(x.t)}b.spreken.n=int(obj(src.spreken)?src.spreken.n:0);b.spreken.t=int(obj(src.spreken)?src.spreken.t:0);return b}
 function cleanSkills2(raw){const s={v:2,dev:{}};if(obj(raw)&&obj(raw.dev))for(const [dev,lv] of Object.entries(raw.dev))if(SAFE(dev)&&obj(lv)){const o={};for(const l of LEVELS)if(obj(lv[l]))o[l]=cleanSlice(lv[l]);s.dev[dev]=o}return s}
 function skillAdd(raw,dev,lv,skill,ok,now=Date.now()){const s=cleanSkills2(raw);if(!LEVELS.includes(lv))return s;const own=s.dev[dev]||(s.dev[dev]={}),sl=own[lv]||(own[lv]=blankSkills());
  if(skill==='spreken'){sl.spreken.n++;sl.spreken.t=now;return s}
  if(!QUIZ.includes(skill)||typeof ok!=='boolean')return s;const x=sl[skill];x.n++;if(ok)x.ok++;x.r=(x.r+(ok?'1':'0')).slice(-RECENT);x.t=now;return s}
 // Per device the part with more answers is the newer one (a device only adds to its own part).
 function skillsMerge(a,b){const x=cleanSkills2(a),y=cleanSkills2(b),o={v:2,dev:{}};
  for(const dev of new Set([...Object.keys(x.dev),...Object.keys(y.dev)])){const p=x.dev[dev]||{},q=y.dev[dev]||{},r={};
   for(const l of LEVELS){if(!p[l]&&!q[l])continue;const P=p[l]||blankSkills(),Q=q[l]||blankSkills(),m=blankSkills();
    for(const k of QUIZ)m[k]=Q[k].n>P[k].n?{...Q[k]}:{...P[k]};m.spreken=Q.spreken.n>P.spreken.n?{...Q.spreken}:{...P.spreken};r[l]=m}
   o.dev[dev]=r}return o}
 // The shape modules/insights/core.js reads ({a11:{lezen:{ok,n,r}…}}): counts summed, recent answers in time order.
 function skillsView(raw){const s=cleanSkills2(raw),out={};for(const l of LEVELS){const parts=Object.values(s.dev).map(d=>d[l]).filter(Boolean),v={spreken:{n:0}};
   for(const k of QUIZ){const xs=parts.map(p=>p[k]).filter(x=>x.n).sort((a,b)=>a.t-b.t);v[k]={ok:xs.reduce((a,x)=>a+x.ok,0),n:xs.reduce((a,x)=>a+x.n,0),r:xs.map(x=>x.r).join('').slice(-RECENT)}}
   v.spreken.n=parts.reduce((a,p)=>a+p.spreken.n,0);out[l]=v}return out}
 function skillsFromV1(v1){const o={};if(obj(v1))for(const l of LEVELS)if(obj(v1[l]))o[l]=cleanSlice(v1[l]);return {v:2,dev:{[LEGACY]:o}}}

 // ---------------- Grammar slips per device: {lv:{tag:{r,n,t}}}
 function cleanSlips2(raw){const s={v:2,dev:{}};if(obj(raw)&&obj(raw.dev))for(const [dev,lv] of Object.entries(raw.dev))if(SAFE(dev)&&obj(lv)){const o={};for(const l of LEVELS)if(obj(lv[l])){o[l]={};for(const [tag,x] of Object.entries(lv[l]))if(SAFE(tag)&&obj(x)&&typeof x.r==='string'){const r=x.r.replace(/[^01]/g,'').slice(-SLIP_RECENT);if(r)o[l][tag]={r,n:Math.max(int(x.n),r.length),t:int(x.t)}}}s.dev[dev]=o}return s}
 function slipAdd(raw,dev,lv,tag,ok,now=Date.now()){const s=cleanSlips2(raw);if(!LEVELS.includes(lv)||!SAFE(tag)||typeof ok!=='boolean')return s;const own=s.dev[dev]||(s.dev[dev]={}),l=own[lv]||(own[lv]={}),x=l[tag]||{r:'',n:0,t:0};x.r=(x.r+(ok?'1':'0')).slice(-SLIP_RECENT);x.n++;x.t=now;l[tag]=x;return s}
 function slipsMerge(a,b){const x=cleanSlips2(a),y=cleanSlips2(b),o={v:2,dev:{}};for(const dev of new Set([...Object.keys(x.dev),...Object.keys(y.dev)])){const p=x.dev[dev]||{},q=y.dev[dev]||{},r={};
   for(const l of new Set([...Object.keys(p),...Object.keys(q)])){r[l]={};for(const tag of new Set([...Object.keys(p[l]||{}),...Object.keys(q[l]||{})])){const P=(p[l]||{})[tag],Q=(q[l]||{})[tag];r[l][tag]=!P?Q:!Q?P:(Q.n>P.n?Q:P)}}o.dev[dev]=r}return o}
 // {a11:{omdat:"0110"}}: the recent results of all devices in time order (what modules/insights/core.js reads).
 function slipsView(raw){const s=cleanSlips2(raw),out={a11:{},a12:{}};for(const l of LEVELS){const tags={};for(const d of Object.values(s.dev))for(const [tag,x] of Object.entries(d[l]||{}))(tags[tag]=tags[tag]||[]).push(x);
   for(const [tag,xs] of Object.entries(tags))out[l][tag]=xs.sort((a,b)=>a.t-b.t).map(x=>x.r).join('').slice(-SLIP_RECENT)}return out}
 function slipsFromV1(v1){const o={};if(obj(v1))for(const l of LEVELS)if(obj(v1[l])){o[l]={};for(const [tag,r] of Object.entries(v1[l]))if(SAFE(tag)&&typeof r==='string'&&r)o[l][tag]={r:r.replace(/[^01]/g,'').slice(-SLIP_RECENT),n:r.length,t:0}}return {v:2,dev:{[LEGACY]:o}}}

 // ---------------- Words (poly_progress): per word the newer answer decides the review schedule;
 // answer counts add both devices' new answers when the common base is known (sync), else the larger count.
 const WORD_COUNTS=['seen','correct','wrong'];
 function wordMerge(b,l,c){
  if(!obj(l))return c;if(!obj(c))return l;if(JSON.stringify(l)===JSON.stringify(c))return l;
  const lt=int(l.t),ct=int(c.t),newer=lt||ct?(ct>lt?c:l):null,o={};
  if(newer){Object.assign(o,newer)}else{o.streak=Math.max(int(l.streak),int(c.streak));o.due=Math.max(int(l.due),int(c.due));o.known=!!(l.known||c.known)}
  for(const k of WORD_COUNTS){const L=int(l[k]),C=int(c[k]),B=obj(b)?int(b[k]):null;o[k]=B!==null&&B<=L&&B<=C?L+C-B:Math.max(L,C)}
  if(lt||ct)o.t=Math.max(lt,ct);return o}
 function wordsMerge(b,l,c){const B=obj(b)?b:{},L=obj(l)?l:{},C=obj(c)?c:{},o={};for(const id of new Set([...Object.keys(L),...Object.keys(C)]))if(SAFE(id)){const v=wordMerge(B[id],L[id],C[id]);if(obj(v))o[id]=v}return o}

 // ---------------- Route (leren_path_v1)
 function setMerge(b,l,c){const key=JSON.stringify,bs=new Set((Array.isArray(b)?b:[]).map(key)),L=Array.isArray(l)?l:[],C=Array.isArray(c)?c:[],ls=new Set(L.map(key)),cs=new Set(C.map(key)),out=[],seen=new Set();
  for(const x of [...L,...C]){const k=key(x);if(seen.has(k))continue;seen.add(k);if(bs.has(k)&&(!ls.has(k)||!cs.has(k)))continue;out.push(x)}return out} // removed on one side (fixed mistake) stays removed
 function pathMerge(b,l,c){
  if(!obj(l))return c;if(!obj(c))return l;const B=obj(b)?b:{},o={...c,...l};
  o.completed={};for(const id of new Set([...Object.keys(l.completed||{}),...Object.keys(c.completed||{})])){const v=Math.max(int((l.completed||{})[id]),int((c.completed||{})[id]));if(Number.isInteger(v))o.completed[id]=v}
  o.mistakes=setMerge(B.mistakes,l.mistakes||[],c.mistakes||[]);
  // Where each course's route stands: this device's own change wins, otherwise the other device's.
  const E=obj(B.entries)?B.entries:{},le=obj(l.entries)?l.entries:{},ce=obj(c.entries)?c.entries:{};o.entries={};
  for(const lv of new Set([...Object.keys(le),...Object.keys(ce)]))o.entries[lv]=le[lv]!==undefined&&le[lv]!==E[lv]?le[lv]:ce[lv]!==undefined?ce[lv]:le[lv];
  o.started=!!(l.started||c.started);o.warmed=[l.warmed,c.warmed].filter(d=>typeof d==='string'&&DAY.test(d)).sort().pop();if(!o.warmed)delete o.warmed;
  // The open lesson, the paused lessons, the active course and a running placement belong to this device.
  for(const k of ['session','parked','course','entry','placement'])if(k in l)o[k]=l[k];else delete o[k];
  return o}

 // ---------------- Streak, rewards, weekly games, exams
 function streakMerge(l,c){if(!obj(l))return c;if(!obj(c))return l;const ld=String(l.last||''),cd=String(c.last||''),win=cd>ld||(cd===ld&&int(c.n)>int(l.n))?c:l;return {...win,best:Math.max(int(l.best),int(c.best),int(l.n),int(c.n))}}
 function achievementsMerge(l,c){const earned={};for(const src of [c,l])if(obj(src)&&obj(src.earned))for(const [id,at] of Object.entries(src.earned))if(SAFE(id)&&typeof at==='string'&&!Number.isNaN(Date.parse(at)))earned[id]=earned[id]&&earned[id]<at?earned[id]:at; // first date counts
  return {version:1,earned}}
 function weekMerge(l,c){if(!obj(l))return c;if(!obj(c))return l;if(String(l.w)!==String(c.w))return String(c.w)>String(l.w)?c:l;return {w:l.w,played:[...new Set([...(l.played||[]),...(c.played||[])])],done:!!(l.done||c.done)}}
 function examMerge(b,l,c){if(!obj(l))return c;if(!obj(c))return l;const B=obj(b)?b:{},o={...c,...l};
  for(const k of ['best','wbest']){o[k]={};for(const p of new Set([...Object.keys(l[k]||{}),...Object.keys(c[k]||{})]))o[k][p]=Math.max(num((l[k]||{})[p]),num((c[k]||{})[p]))}
  const sp={},bsp=obj(B.sp)?B.sp:{};for(const t of new Set([...Object.keys(l.sp||{}),...Object.keys(c.sp||{})]))sp[t]=setMerge(bsp[t],(l.sp||{})[t]||[],(c.sp||{})[t]||[]);o.sp=sp;
  for(const k of ['run','draft','spPos'])if(k in l)o[k]=l[k];else delete o[k]; // a running part and drafts stay on their device
  return o}

 // ---------------- One rule per key. Strings in, a string out; undefined = use the generic merge.
 const RULES={
  leren_xp_v2:(b,l,c)=>xpMerge(l,c),leren_minutes_v2:(b,l,c)=>minutesMerge(l,c),leren_skills_v2:(b,l,c)=>skillsMerge(l,c),leren_slips_v2:(b,l,c)=>slipsMerge(l,c),
  poly_progress:wordsMerge,leren_path_v1:pathMerge,poly_streak:(b,l,c)=>streakMerge(l,c),leren_achievements_v1:(b,l,c)=>achievementsMerge(l,c),
  leren_week:(b,l,c)=>weekMerge(l,c),leren_exam11:examMerge,leren_exam12:examMerge};
 // A course in another language keeps its results under the same key with a language suffix (leren_path_v1@en,
 // modules/courses/registry.js); it merges and is checked by the rule of the base key. Dutch keys have no suffix.
 const baseKey=k=>String(k).replace(/@[a-z]{2}$/,'');
 function mergeKey(k,b,l,c){
  k=baseKey(k);
  if(k==='poly_score'){const v=Math.max(num(l),num(c));return String(Math.floor(v))}
  const rule=RULES[k];if(!rule)return undefined;
  if(l===undefined)return c;if(c===undefined)return l;if(l===c)return l;
  const L=parse(l),C=parse(c);if(L===undefined)return c;if(C===undefined)return l;
  const v=rule(parse(b),L,C);return v===undefined?undefined:JSON.stringify(v)}

 // ---------------- Backups: v4 = keys + a SHA-256 digest; v3 (keys), v2 (words, points, route) still accepted.
 const MAX_BACKUP=5e6,MAX_VALUE=1e6;
 const canon=keys=>JSON.stringify(Object.keys(keys).sort().map(k=>[k,keys[k]]));
 async function digest(text){const d=await globalThis.crypto.subtle.digest('SHA-256',new TextEncoder().encode(text));return [...new Uint8Array(d)].map(b=>b.toString(16).padStart(2,'0')).join('')}
 async function buildBackup(keys,now=Date.now()){return {app:'leren.be',v:4,ts:now,n:Object.keys(keys).length,sha256:await digest(canon(keys)),keys}}
 // Shape checks for the keys that hold results. A value that fails makes the whole backup invalid.
 const isNumStr=s=>/^\d{1,9}$/.test(s);
 const CHECK={
  poly_score:s=>isNumStr(s),
  poly_progress:v=>obj(v)&&Object.values(v).every(w=>obj(w)&&WORD_COUNTS.every(k=>w[k]===undefined||Number.isFinite(w[k]))),
  poly_toetsbest:v=>obj(v)&&Object.values(v).every(x=>Number.isFinite(x)&&x>=0),
  leren_path_v1:v=>obj(v)&&(v.completed===undefined||obj(v.completed)&&Object.values(v.completed).every(x=>Number.isInteger(x)&&x>=0))&&(v.mistakes===undefined||Array.isArray(v.mistakes)),
  leren_path_rewards_v1:v=>obj(v)&&Object.values(v).every(x=>Number.isInteger(x)&&x>=0),
  leren_achievements_v1:v=>obj(v)&&obj(v.earned)&&Object.values(v.earned).every(x=>typeof x==='string'&&!Number.isNaN(Date.parse(x))),
  poly_streak:v=>obj(v)&&(v.n===undefined||Number.isFinite(v.n))&&(v.last===undefined||typeof v.last==='string'),
  leren_exam11:v=>obj(v)&&(v.best===undefined||obj(v.best)),leren_exam12:v=>obj(v)&&(v.best===undefined||obj(v.best)),
  leren_xp_v2:v=>obj(v)&&Number.isFinite(v.base??0)&&(v.g===undefined||obj(v.g))&&(v.d===undefined||obj(v.d)),
  leren_minutes_v2:v=>obj(v)&&obj(v.dev),leren_skills_v2:v=>obj(v)&&obj(v.dev),leren_slips_v2:v=>obj(v)&&obj(v.dev),
  leren_minutes_v1:v=>obj(v),leren_skills_v1:v=>obj(v),leren_slips_v1:v=>obj(v),leren_goal_min:s=>/^\d{1,2}$/.test(s)};
 const RAW=new Set(['poly_score','leren_goal_min']); // stored as plain text, not JSON
 // Returns {ok:true, keys} with only allowed keys, or {ok:false, error}. Never partly valid.
 async function readBackup(text,allowed){
  if(typeof text!=='string'||text.length>MAX_BACKUP)return {ok:false,error:'size'};
  const data=parse(text);if(!obj(data))return {ok:false,error:'json'};
  let keys;
  if(data.app==='leren.be'&&(data.v===3||data.v===4)){
   if(!obj(data.keys))return {ok:false,error:'shape'};
   if(data.v===4){if(typeof data.sha256!=='string'||data.n!==Object.keys(data.keys).length)return {ok:false,error:'shape'};
    if(await digest(canon(data.keys))!==data.sha256)return {ok:false,error:'digest'}}
   keys={};for(const [k,v] of Object.entries(data.keys)){if(!allowed(k))continue;if(typeof v!=='string'||v.length>MAX_VALUE)return {ok:false,error:'value:'+k};keys[k]=v}
  }else if(obj(data.store)){ // v2 (and v1 without "v"): words, points and the route records, merged like everything else
   if(data.score!==undefined&&!(typeof data.score==='number'&&Number.isFinite(data.score)&&data.score>=0))return {ok:false,error:'value:score'};
   keys={poly_progress:JSON.stringify(data.store)};if(data.score!==undefined)keys.poly_score=String(Math.floor(data.score));
   if(data.companion!==undefined){if(!obj(data.companion))return {ok:false,error:'shape'};for(const k of ['leren_path_v1','leren_path_rewards_v1','leren_achievements_v1']){const v=data.companion[k];if(v===undefined||v===null)continue;if(!obj(v))return {ok:false,error:'value:'+k};keys[k]=JSON.stringify(v)}}
  }else return {ok:false,error:'shape'};
  for(const [k,v] of Object.entries(keys)){const check=CHECK[baseKey(k)];if(!check)continue;const val=RAW.has(baseKey(k))?v:parse(v);if(val===undefined||!check(val))return {ok:false,error:'value:'+k}}
  if(!Object.keys(keys).length)return {ok:false,error:'empty'};
  return {ok:true,keys,version:data.v||2};
 }
 // Write every value or none: on any storage error the values from before are put back.
 function applyAll(storage,values){const before={},done=[];try{for(const [k,v] of Object.entries(values)){const old=storage.getItem(k);if(old===v)continue;before[k]=old;storage.setItem(k,v);done.push(k)}return true}
  catch(e){for(const k of done){try{before[k]===null?storage.removeItem(k):storage.setItem(k,before[k])}catch{}}return false}}

 globalThis.LerenMerge={LEGACY,newDeviceId,cleanXp,xpTotal,xpAdd,xpMerge,xpAbsorb,cleanMinutes2,minutesAdd,minutesMerge,minutesView,minutesFromV1,
  cleanSkills2,skillAdd,skillsMerge,skillsView,skillsFromV1,cleanSlips2,slipAdd,slipsMerge,slipsView,slipsFromV1,wordMerge,wordsMerge,setMerge,pathMerge,
  streakMerge,achievementsMerge,weekMerge,examMerge,mergeKey,digest,canon,buildBackup,readBackup,applyAll,MAX_BACKUP};
})();
