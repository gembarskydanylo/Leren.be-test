/* Guided course state. No network or DOM dependencies. */
(() => {
 'use strict';
 const KEY='leren_path_v1';
 const phases=['study','listen','check'];
 function catalog(data,curriculum){
  const chapters=[...curriculum.chapters,...curriculum.advanced].map(([id,nl,tabs],index)=>({id,nl,tabs,index,level:index<12?'A1.1':'A1.2',lessons:[]}));
  const lessons=[],cards=new Map();
  for(const chapter of chapters)for(const tab of chapter.tabs){
   const items=(data[tab]?.items||[]).filter(w=>w.id&&w.nl&&w.uk);
   for(const w of items)cards.set(w.id,w);
   // Stable chunks keep every existing course card on the route.
   for(let offset=0;offset<items.length;offset+=5){
    const lesson={id:chapter.id+':'+tab+':'+offset,chapter:chapter.id,tab,part:Math.floor(offset/5)+1,parts:Math.ceil(items.length/5),ids:items.slice(offset,offset+5).map(w=>w.id)};
    chapter.lessons.push(lesson);lessons.push(lesson);
   }
  }
  return {chapters,lessons,cards};
 }
 function create(course,storage){
  const byId=new Map(course.lessons.map(l=>[l.id,l])),cardIds=course.cards;
  let persistent=true,raw;
  let value;try{value=storage.getItem(KEY)}catch{persistent=false}
  try{raw=JSON.parse(value||'null')}catch{}
  const obj=v=>v&&typeof v==='object'&&!Array.isArray(v);
  const state={version:1,started:false,entry:course.lessons[0].id,completed:{},mistakes:[],session:null,placement:null};
  if(obj(raw)&&raw.version===1){
   state.started=raw.started===true;
   if(byId.has(raw.entry))state.entry=raw.entry;
   if(obj(raw.completed))for(const [id,value] of Object.entries(raw.completed))if(byId.has(id)&&Number.isInteger(value)&&value>=0&&value<=byId.get(id).ids.length)state.completed[id]=value;
   if(Array.isArray(raw.mistakes))state.mistakes=[...new Set(raw.mistakes.filter(id=>cardIds.has(id)))];
   const s=raw.session;
   if(obj(s)&&['lesson','review'].includes(s.kind)&&Array.isArray(s.ids)&&s.ids.length>0&&s.ids.length<=5&&new Set(s.ids).size===s.ids.length&&s.ids.every(id=>cardIds.has(id))&&Number.isInteger(s.phase)&&s.phase>=0&&s.phase<=2&&Number.isInteger(s.index)&&s.index>=0&&s.index<=s.ids.length&&Array.isArray(s.answers)&&s.answers.length<=s.ids.length&&s.answers.every(a=>a===true||a===false)&&s.answers.length===s.index){
    if(s.kind==='review'&&s.phase===2||byId.has(s.lesson)&&JSON.stringify(s.ids)===JSON.stringify(byId.get(s.lesson).ids))state.session={kind:s.kind,lesson:s.lesson,ids:s.ids,phase:s.phase,index:s.index,answers:s.answers};
   }
   const p=raw.placement;
   if(obj(p)&&Array.isArray(p.answers)&&p.answers.length<=12&&p.answers.every(a=>typeof a==='boolean'))state.placement={answers:p.answers};
  }
  function save(){try{storage.setItem(KEY,JSON.stringify(state))}catch{persistent=false}}
  function recommended(){
   if(state.session?.kind==='lesson'&&!(state.session.phase===2&&state.session.index===state.session.ids.length))return byId.get(state.session.lesson);
   const start=course.lessons.findIndex(l=>l.id===state.entry);
   return course.lessons.slice(start).find(l=>!Object.hasOwn(state.completed,l.id))||course.lessons.slice(0,start).find(l=>!Object.hasOwn(state.completed,l.id))||null;
  }
  function begin(id){const l=byId.get(id);if(!l)return false;state.started=true;state.session={kind:'lesson',lesson:id,ids:[...l.ids],phase:0,index:0,answers:[]};save();return true}
  function beginReview(){if(!state.mistakes.length)return false;state.session={kind:'review',lesson:null,ids:state.mistakes.slice(0,5),phase:2,index:0,answers:[]};save();return true}
  function current(){const s=state.session;return s&&s.index<s.ids.length?course.cards.get(s.ids[s.index]):null}
  function advance(id,correct){
   const s=state.session,w=current();if(!s||!w||w.id!==id||typeof correct!=='boolean')return false;
   s.answers.push(correct);s.index++;
   if(s.phase>0){if(correct)state.mistakes=state.mistakes.filter(x=>x!==id);else if(!state.mistakes.includes(id))state.mistakes.push(id)}
   save();return true;
  }
  function nextPhase(){const s=state.session;if(!s||s.index!==s.ids.length||s.kind==='review'||s.phase>=2)return false;s.phase++;s.index=0;s.answers=[];save();return true}
  function finish(){
   const s=state.session;if(!s||s.index!==s.ids.length||s.phase!==2)return null;
   const result={kind:s.kind,id:s.lesson,total:s.ids.length,correct:s.answers.filter(Boolean).length};
   if(s.kind==='lesson')state.completed[s.lesson]=Math.max(state.completed[s.lesson]||0,result.correct);
   // Keep the complete session for a stable result screen after refresh.
   save();return result;
  }
  function continueRoute(){state.session=null;save();const l=recommended();if(l)begin(l.id);return l}
  function start(){state.started=true;state.entry=course.lessons[0].id;state.session=null;state.placement=null;save()}
  function place(){state.placement={answers:[]};save()}
  function placementCard(){const i=state.placement?.answers.length;if(!Number.isInteger(i)||i>=12)return null;const ch=course.chapters[i];return ch?course.cards.get(ch.lessons[0]?.ids[0]):null}
  function placementAnswer(id,ok){const w=placementCard();if(!w||w.id!==id||typeof ok!=='boolean')return false;state.placement.answers.push(ok);save();return true}
  function acceptPlacement(){
   const answers=state.placement?.answers;if(!answers||answers.length!==12)return false;
   const first=answers.indexOf(false),index=first<0?12:first;
   state.entry=course.chapters[index].lessons[0].id;state.started=true;state.session=null;state.placement=null;save();return true;
  }
  return {state,course,phases,get persistent(){return persistent},save,recommended,begin,beginReview,current,advance,nextPhase,finish,continueRoute,start,place,placementCard,placementAnswer,acceptPlacement,
   home(){state.session=null;save()},cancelPlacement(){state.placement=null;save()},lesson:id=>byId.get(id),
   stats(chapter){const ls=chapter?course.chapters.find(c=>c.id===chapter).lessons:course.lessons;return {done:ls.filter(l=>Object.hasOwn(state.completed,l.id)).length,total:ls.length}},
   mastered(id){const l=byId.get(id);return l&&state.completed[id]/l.ids.length>=.8}
  };
 }
 globalThis.LerenLearningPath={catalog,create,KEY};
})();
