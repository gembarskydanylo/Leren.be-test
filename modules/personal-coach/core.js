/* Device-local tutor preferences and an explainable plan from actual course progress. */
(() => {
 'use strict';
 const KEY='leren_coach_v1',MEMORY='leren_ai_memory';
 function create(storage){
  let persistent=true,fallback={};const failed=new Set();
  const read=k=>{if(failed.has(k))return fallback[k]||null;try{const s=storage.getItem(k);return s?JSON.parse(s):null}catch{persistent=false;return fallback[k]||null}};
  const write=(k,v)=>{fallback[k]=v;try{storage.setItem(k,JSON.stringify(v));failed.delete(k)}catch{persistent=false;failed.add(k)}};
  function settings(){const x=read(KEY)||{};return {goal:['daily','work','study'].includes(x.goal)?x.goal:'daily',minutes:[5,10,15].includes(x.minutes)?x.minutes:10,enabled:x.enabled!==false,revision:typeof x.revision==='string'?x.revision:'initial'}}
  function update(p){const s=settings();if(['daily','work','study'].includes(p.goal))s.goal=p.goal;if([5,10,15].includes(p.minutes))s.minutes=p.minutes;if(typeof p.enabled==='boolean')s.enabled=p.enabled;s.revision=Date.now()+':'+Math.random();write(KEY,s);if(!s.enabled)write(MEMORY,'');return s}
  const memory=()=>{if(!settings().enabled)return '';const m=read(MEMORY);return typeof m==='string'?m.slice(0,500):''};
  function edit(text){update({});write(MEMORY,String(text||'').trim().slice(0,500))}
  function forget(){update({});write(MEMORY,'')}
  function ticket(){if(!settings().enabled)return null;return update({}).revision}
  function accept(token,text){const s=settings();if(!token||!s.enabled||s.revision!==token||typeof text!=='string')return false;write(MEMORY,text.trim().slice(0,500));return true}
  function plan(model,talk){
   const s=settings(),lesson=model.recommended(),session=model.state.session;
   const unfinished=session&&(session.phase<2||session.index<session.ids.length);
   const review=model.state.mistakes.length>0;
   const items=[];
   if(unfinished)items.push({kind:'resume',lesson:session.kind==='lesson'?session.lesson:null,reason:'paused'});
   else if(review)items.push({kind:'review',reason:'mistakes'});
   else if(lesson)items.push({kind:'lesson',lesson:lesson.id,reason:model.state.started?'next':'start'});
   if(s.minutes>=10){
    if(unfinished&&review&&session.kind!=='review')items.push({kind:'review',reason:'afterLesson',locked:true});
    else if(!unfinished&&review&&lesson)items.push({kind:'lesson',lesson:lesson.id,reason:'next'});
    else if(lesson)items.push({kind:'talk',lesson:lesson.id,reason:'use'});
   }
   if(s.minutes>=15&&lesson&&!items.some(x=>x.kind==='talk'))items.push({kind:'talk',lesson:lesson.id,reason:'use'});
   // A paused conversation is offered instead of starting another one.
   if(talk?.state.lesson&&talk.state.index<3&&s.minutes>=10){const i=items.findIndex(x=>x.kind==='talk');const v={kind:'talk',lesson:talk.state.lesson,reason:'pausedTalk'};if(i>=0)items[i]=v;else if(s.minutes>=15)items.push(v)}
   return {minutes:s.minutes,goal:s.goal,items:items.slice(0,3),done:model.stats().done,total:model.stats().total,mistakes:model.state.mistakes.length};
  }
  return {settings,update,memory,edit,forget,ticket,accept,plan,get persistent(){return persistent}};
 }
 globalThis.LerenPersonalCoach={KEY,MEMORY,create};
})();
