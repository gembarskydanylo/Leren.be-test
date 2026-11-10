/* Guided course state. No network or DOM dependencies. */
(() => {
 'use strict';
 const KEY='leren_path_v1';
 const phases=['study','listen','check'];
 // opts.text: the card field with the target-language text ('nl' for the Dutch course, the default). A chapter may give its
 // level as a 4th tuple item; otherwise the Dutch rule applies (A2 list, first 12 chapters A1.1, then A1.2).
 function catalog(data,curriculum,opts={}){
  const text=opts.text||'nl';
  const a2ids=new Set(curriculum.a2Ids||[]);
  const chapters=[...curriculum.chapters,...curriculum.advanced].map(([id,nl,tabs,lvl],index)=>({id,nl,tabs,index,level:lvl||(a2ids.has(id)?'A2':index<12?'A1.1':'A1.2'),lessons:[]}));
  const lessons=[],cards=new Map();
  for(const chapter of chapters)for(const tab of chapter.tabs){
   const items=(data[tab]?.items||[]).filter(w=>w.id&&w[text]&&w.uk);
   for(const w of items)cards.set(w.id,w);
   // Stable chunks keep every existing course card on the route.
   for(let offset=0;offset<items.length;offset+=5){
    const lesson={id:chapter.id+':'+tab+':'+offset,chapter:chapter.id,tab,part:Math.floor(offset/5)+1,parts:Math.ceil(items.length/5),ids:items.slice(offset,offset+5).map(w=>w.id)};
    chapter.lessons.push(lesson);lessons.push(lesson);
   }
  }
  return {chapters,lessons,cards};
 }
 // opts.key: where this course keeps its route (another language: 'leren_path_v1@en'); Dutch keeps KEY.
 function create(course,storage,opts={}){
  const key=opts.key||KEY;
  const byId=new Map(course.lessons.map(l=>[l.id,l])),cardIds=course.cards;
  // A1.1 and A1.2 are independent courses: each has its own route start and its own paused lesson.
  const levels=[...new Set(course.chapters.map(c=>c.level))],levelOf=new Map(course.chapters.map(c=>[c.id,c.level]));
  const lessonLevel=id=>levelOf.get(byId.get(id)?.chapter),cardLevel=new Map();
  for(const l of course.lessons)for(const id of l.ids)if(!cardLevel.has(id))cardLevel.set(id,levelOf.get(l.chapter));
  const courseLessons=level=>course.lessons.filter(l=>levelOf.get(l.chapter)===level);
  let persistent=true,raw;
  let value;try{value=storage.getItem(key)}catch{persistent=false}
  try{raw=JSON.parse(value||'null')}catch{}
  const obj=v=>v&&typeof v==='object'&&!Array.isArray(v);
  const state={version:1,started:false,entry:course.lessons[0].id,completed:{},mistakes:[],session:null,placement:null};
  const validSession=s=>obj(s)&&['lesson','review'].includes(s.kind)&&Array.isArray(s.ids)&&s.ids.length>0&&s.ids.length<=5&&new Set(s.ids).size===s.ids.length&&s.ids.every(id=>cardIds.has(id))&&Number.isInteger(s.phase)&&s.phase>=0&&s.phase<=2&&Number.isInteger(s.index)&&s.index>=0&&s.index<=s.ids.length&&Array.isArray(s.answers)&&s.answers.length<=s.ids.length&&s.answers.every(a=>a===true||a===false)&&s.answers.length===s.index&&(s.kind==='review'&&s.phase===2||byId.has(s.lesson)&&JSON.stringify(s.ids)===JSON.stringify(byId.get(s.lesson).ids));
  const copySession=s=>({kind:s.kind,lesson:s.lesson,ids:s.ids,phase:s.phase,index:s.index,answers:s.answers});
  state.course=levels[0];state.entries={};state.parked={};
  if(obj(raw)&&raw.version===1){
   state.started=raw.started===true;
   if(byId.has(raw.entry))state.entry=raw.entry;
   if(obj(raw.completed))for(const [id,value] of Object.entries(raw.completed))if(byId.has(id)&&Number.isInteger(value)&&value>=0&&value<=byId.get(id).ids.length)state.completed[id]=value;
   if(Array.isArray(raw.mistakes))state.mistakes=[...new Set(raw.mistakes.filter(id=>cardIds.has(id)))];
   const s=raw.session;
   if(validSession(s))state.session=copySession(s);
   // Older saves had one route over both courses: the saved entry and paused lesson tell which course was active.
   if(levels.includes(raw.course))state.course=raw.course;else if(state.session?.kind==='lesson')state.course=lessonLevel(state.session.lesson);else state.course=lessonLevel(state.entry)||levels[0];
   if(obj(raw.entries))for(const [level,id] of Object.entries(raw.entries))if(levels.includes(level)&&lessonLevel(id)===level)state.entries[level]=id;
   if(!obj(raw.entries)&&lessonLevel(state.entry))state.entries[lessonLevel(state.entry)]=state.entry;
   if(obj(raw.parked))for(const [level,p] of Object.entries(raw.parked))if(levels.includes(level)&&level!==state.course&&validSession(p)&&p.kind==='lesson'&&lessonLevel(p.lesson)===level)state.parked[level]=copySession(p);
   if(typeof raw.warmed==='string'&&/^\d{4}-\d{2}-\d{2}$/.test(raw.warmed))state.warmed=raw.warmed;
   const p=raw.placement;
   if(obj(p)&&Array.isArray(p.answers)&&p.answers.length<=12&&p.answers.every(a=>typeof a==='boolean'))state.placement={answers:p.answers};
  }
  function save(){try{storage.setItem(key,JSON.stringify(state))}catch{persistent=false}}
  const entryOf=level=>state.entries[level]||courseLessons(level)[0]?.id;
  function recommended(level=state.course){
   if(level===state.course&&state.session?.kind==='lesson'&&lessonLevel(state.session.lesson)===level&&!(state.session.phase===2&&state.session.index===state.session.ids.length))return byId.get(state.session.lesson);
   const list=courseLessons(level),start=Math.max(0,list.findIndex(l=>l.id===entryOf(level)));
   return list.slice(start).find(l=>!Object.hasOwn(state.completed,l.id))||list.slice(0,start).find(l=>!Object.hasOwn(state.completed,l.id))||null;
  }
  // Switching course parks an unfinished lesson of the old course and restores the one of the new course.
  function setCourse(level){
   if(!levels.includes(level))return false;if(level===state.course)return true;
   const s=state.session;if(s?.kind==='lesson'&&lessonLevel(s.lesson)===state.course&&!(s.phase===2&&s.index===s.ids.length))state.parked[state.course]=s;
   state.session=state.parked[level]||null;delete state.parked[level];state.course=level;save();return true;
  }
  function begin(id){const l=byId.get(id);if(!l)return false;state.started=true;if(lessonLevel(id)!==state.course){state.course=lessonLevel(id)}delete state.parked[state.course];state.session={kind:'lesson',lesson:id,ids:[...l.ids],phase:0,index:0,answers:[]};save();return true}
  const courseMistakes=()=>state.mistakes.filter(id=>cardLevel.get(id)===state.course);
  function beginReview(){const ids=courseMistakes();if(!ids.length)return false;state.session={kind:'review',lesson:null,ids:ids.slice(0,5),phase:2,index:0,answers:[]};save();return true}
  // Daily warm-up of the guided route: before the next lesson, up to 5 words of this course that need review
  // (route mistakes first, then words whose review date came, most urgent first). Offered once a day, from 3 words.
  const today=(now=new Date())=>now.getFullYear()+'-'+String(now.getMonth()+1).padStart(2,'0')+'-'+String(now.getDate()).padStart(2,'0');
  function warmupIds(due=[]){return [...new Set([...courseMistakes(),...due.filter(id=>cardLevel.get(id)===state.course)])].slice(0,5)}
  function warmupDue(due=[],now){return state.started&&state.warmed!==today(now)&&warmupIds(due).length>=3}
  function beginWarmup(due=[],now){const ids=warmupIds(due);if(ids.length<3)return false;state.warmed=today(now);state.session={kind:'review',lesson:null,ids,phase:2,index:0,answers:[]};save();return true}
  // Review of chosen words (Peter's advice): up to 5 cards of the current course.
  function reviewWords(ids=[]){const own=[...new Set(ids)].filter(id=>cardLevel.get(id)===state.course).slice(0,5);if(!own.length)return false;state.started=true;state.session={kind:'review',lesson:null,ids:own,phase:2,index:0,answers:[]};save();return true}
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
  function start(){state.started=true;state.entries[state.course]=courseLessons(state.course)[0].id;state.entry=state.entries[state.course];state.session=null;state.placement=null;save()}
  function place(){state.placement={answers:[]};save()}
  function placementCard(){const i=state.placement?.answers.length;if(!Number.isInteger(i)||i>=12)return null;const ch=course.chapters[i];return ch?course.cards.get(ch.lessons[0]?.ids[0]):null}
  function placementAnswer(id,ok){const w=placementCard();if(!w||w.id!==id||typeof ok!=='boolean')return false;state.placement.answers.push(ok);save();return true}
  function acceptPlacement(){
   const answers=state.placement?.answers;if(!answers||answers.length!==12)return false;
   const first=answers.indexOf(false),index=first<0?12:first;
   state.entry=course.chapters[index].lessons[0].id;state.course=lessonLevel(state.entry);state.entries[state.course]=state.entry;state.started=true;state.session=null;state.placement=null;save();return true;
  }
  return {state,course,phases,get persistent(){return persistent},save,recommended,begin,beginReview,current,advance,nextPhase,finish,continueRoute,start,place,placementCard,placementAnswer,acceptPlacement,
   home(){state.session=null;save()},cancelPlacement(){state.placement=null;save()},lesson:id=>byId.get(id),
   stats(chapter){const ls=chapter?course.chapters.find(c=>c.id===chapter).lessons:courseLessons(state.course);return {done:ls.filter(l=>Object.hasOwn(state.completed,l.id)).length,total:ls.length}},
   courseStats(level){const ls=courseLessons(level);return {done:ls.filter(l=>Object.hasOwn(state.completed,l.id)).length,total:ls.length}},
   levels,setCourse,warmupIds,warmupDue,beginWarmup,reviewWords,get course(){return state.course},mistakes:courseMistakes,
   mastered(id){const l=byId.get(id);return l&&state.completed[id]/l.ids.length>=.8}
  };
 }
 globalThis.LerenLearningPath={catalog,create,KEY};
})();
