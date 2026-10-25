/* Durable achievements and conservative progress merging. No network/DOM. */
(()=>{'use strict';
 const KEY='leren_achievements_v1',GAME_KEY='leren_reward_games_v1';
 const obj=v=>v!==null&&typeof v==='object'&&!Array.isArray(v);
 const safe=k=>!['__proto__','prototype','constructor'].includes(k);
 const num=v=>Number.isFinite(Number(v))?Math.max(0,Number(v)):0;
 const parse=(s,f={})=>{try{const v=JSON.parse(s);return v??f}catch{return f}};
 const milestones=[100,250,500,1000,2500,5000,10000];
 const badges=[...milestones.map((xp,i)=>({id:'xp-'+xp,xp,hero:i%2?'dafna':'peter',pose:i>=2?'wow':'',kind:'xp',goal:xp})),
  {id:'lesson-1',kind:'lessons',goal:1,hero:'peter',pose:'wow'},
  {id:'lesson-5',kind:'lessons',goal:5,hero:'dafna',pose:'wow'},
  {id:'lesson-10',kind:'lessons',goal:10,hero:'peter',pose:'wow'},
  {id:'chapter-1',kind:'chapters',goal:1,hero:'dafna',pose:'wow'},
  {id:'perfect-1',kind:'perfect',goal:1,hero:'peter',pose:'wow'},
  {id:'streak-7',kind:'streak',goal:7,hero:'dafna',pose:'wow'}];
 function clean(raw){const earned={};if(obj(raw?.earned))for(const b of badges){const v=raw.earned[b.id];if(typeof v==='string'&&/^\d{4}-\d{2}-\d{2}T/.test(v)&&!Number.isNaN(Date.parse(v)))earned[b.id]=v}return {version:1,earned}}
 function create(storage){let persistent=true,state;try{state=clean(parse(storage.getItem(KEY)))}catch{state=clean({});persistent=false}
  function save(){try{storage.setItem(KEY,JSON.stringify(state))}catch{persistent=false}}
  function observe(facts,now=new Date().toISOString()) {const added=[];for(const b of badges)if(!state.earned[b.id]&&num(facts[b.kind])>=b.goal){state.earned[b.id]=now;added.push(b)}save();return added}
  return {get state(){return state},get persistent(){return persistent},observe,refresh(){try{state=clean(parse(storage.getItem(KEY)))}catch{persistent=false}},next:xp=>milestones.find(n=>n>num(xp))||null};
 }
 function mergeValue(a,b){
  if(a===undefined)return b;if(b===undefined)return a;
  if(obj(a)&&obj(b)){const out={};for(const k of new Set([...Object.keys(a),...Object.keys(b)]))if(safe(k))out[k]=mergeValue(a[k],b[k]);return out}
  if(Array.isArray(a)&&Array.isArray(b))return [...new Map([...b,...a].map(v=>[JSON.stringify(v),v])).values()];
  if(typeof a==='number'&&typeof b==='number')return Math.max(a,b);
  if(typeof a==='boolean'&&typeof b==='boolean')return a||b;
  return a;
 }
 function mergeSnapshots(local,cloud,allow){
  const out={};for(const k of new Set([...Object.keys(cloud||{}),...Object.keys(local||{})])){
   if(!safe(k)||!allow(k))continue;const a=local?.[k],b=cloud?.[k];if(a===undefined){if(typeof b==='string')out[k]=b;continue}if(b===undefined){if(typeof a==='string')out[k]=a;continue}
   if(typeof a!=='string'||typeof b!=='string')continue;
   if(k===KEY){const aa=clean(parse(a)),bb=clean(parse(b));for(const [id,at]of Object.entries(bb.earned))aa.earned[id]=aa.earned[id]&&aa.earned[id]<at?aa.earned[id]:at;out[k]=JSON.stringify(aa)}
   else if(k==='poly_score')out[k]=String(Math.max(num(a),num(b)));
   else if(['poly_progress','poly_toetsbest','poly_unlocked','leren_path_rewards_v1',GAME_KEY].includes(k))out[k]=JSON.stringify(mergeValue(parse(a),parse(b)));
   else if(k==='leren_path_v1'){const aa=parse(a),bb=parse(b);out[k]=JSON.stringify({...bb,...aa,completed:mergeValue(aa.completed,bb.completed),mistakes:mergeValue(aa.mistakes||[],bb.mistakes||[])})}
   else if(k==='poly_daily'||k==='poly_streak'||k==='leren_week'){const aa=parse(a),bb=parse(b),field=k==='poly_daily'?'d':k==='poly_streak'?'last':'w';out[k]=JSON.stringify(aa[field]===bb[field]?mergeValue(aa,bb):(String(aa[field]||'')>String(bb[field]||'')?aa:bb))}
   else out[k]=a; // Device settings and resumable sessions stay local.
  }return out;
 }
 function gameGain(storage,id,xp,day){if(!/^[a-z]+$/.test(id)||!/^\d{4}-\d{2}-\d{2}$/.test(day))return 0;let all=parse(storage.getItem(GAME_KEY));if(!obj(all))all={};if(!obj(all[day]))all[day]={};const best=Math.min(50,Math.floor(num(xp))),old=num(all[day][id]);all[day][id]=Math.max(old,best);for(const d of Object.keys(all).sort().slice(0,-30))delete all[d];storage.setItem(GAME_KEY,JSON.stringify(all));return Math.max(0,best-old)}
 window.LerenRewards={KEY,GAME_KEY,badges,milestones,create,clean,mergeSnapshots,gameGain};
})();
