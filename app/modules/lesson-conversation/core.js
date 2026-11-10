/* Persisted guided conversations; completion is practice, never a pronunciation score. */
(() => {
 'use strict';
 const api=globalThis.LerenLessonConversation,KEY='leren_path_talk_v1';
 function create(course,storage){
  const lessons=new Map(course.lessons.map(l=>[l.id,l]));let persistent=true;
  const blank=()=>({version:1,lesson:null,open:false,index:0,stage:'question',hint:0,draft:'',practiceDraft:'',correctionCount:0,replies:[],pending:null,corrections:[],completed:[]});
  let state=blank(),raw,value;try{value=storage.getItem(KEY)}catch{persistent=false}try{raw=JSON.parse(value||'null')}catch{}
  const obj=x=>x&&typeof x==='object'&&!Array.isArray(x),short=x=>typeof x==='string'&&x.length<=300;
  const validFix=x=>obj(x)&&short(x.original)&&short(x.corrected)&&Object.hasOwn(api.RULES,x.rule);
  if(obj(raw)&&raw.version===1){
   if(Array.isArray(raw.completed))state.completed=[...new Set(raw.completed.filter(id=>lessons.has(id)))];
   if(Array.isArray(raw.corrections))state.corrections=raw.corrections.filter(x=>validFix(x)&&lessons.has(x.lesson)&&Number.isInteger(x.turn)&&x.turn>=0&&x.turn<3).slice(-30).map(x=>({...x,practised:x.practised===true}));
   const turns=lessons.has(raw.lesson)&&api.SCENARIOS[lessons.get(raw.lesson).chapter];
   if(turns&&Number.isInteger(raw.index)&&raw.index>=0&&raw.index<=turns.length&&Array.isArray(raw.replies)&&raw.replies.length===raw.index&&raw.replies.every(x=>obj(x)&&short(x.text)&&typeof x.assisted==='boolean')){
    state.lesson=raw.lesson;state.index=raw.index;state.open=raw.open===true;state.replies=raw.replies.map(x=>({text:x.text,assisted:x.assisted}));state.draft=short(raw.draft)?raw.draft:'';state.practiceDraft=short(raw.practiceDraft)?raw.practiceDraft:'';state.correctionCount=Number.isInteger(raw.correctionCount)&&raw.correctionCount>=0&&raw.correctionCount<=100?raw.correctionCount:0;
    state.hint=Number.isInteger(raw.hint)&&raw.hint>=0&&raw.hint<=3?raw.hint:0;
    if(raw.index===turns.length)state.stage='summary';
    else if(['question','feedback','repeat','transfer'].includes(raw.stage)){
     const p=raw.pending;
     if(raw.stage==='question')state.stage='question';
     else if(obj(p)&&short(p.original)&&['ok','unconfirmed','correction'].includes(p.kind)&&(p.kind!=='correction'||validFix(p))){state.pending={kind:p.kind,original:p.original,...(p.kind==='correction'?{rule:p.rule,corrected:p.corrected}:{}),practised:p.practised===true,assisted:p.assisted===true};state.stage=(raw.stage==='repeat'||raw.stage==='transfer')&&p.kind!=='correction'?'feedback':raw.stage}
    }
   }
  }
  function save(){try{storage.setItem(KEY,JSON.stringify(state))}catch{persistent=false}}
  const lesson=()=>lessons.get(state.lesson),turns=()=>api.SCENARIOS[lesson()?.chapter]||[],current=()=>turns()[state.index],token=()=>state.lesson+':'+state.index;
  function begin(id){const l=lessons.get(id);if(!l||!api.SCENARIOS[l.chapter])return false;const {corrections,completed}=state;state={...blank(),lesson:id,open:true,corrections,completed};save();return true}
  function submit(text,expected){
   if(state.stage!=='question'||!current()||token()!==expected||!String(text||'').trim())return false;
   state.draft=String(text).trim().slice(0,300);state.pending=api.checkResponse(current(),state.draft);state.pending.assisted=state.hint>0;
   if(state.pending.kind==='correction'){
    state.correctionCount=Math.min(100,state.correctionCount+1);
    const {original,corrected,rule}=state.pending;
    if(!state.corrections.some(x=>x.lesson===state.lesson&&x.turn===state.index&&x.original===original))state.corrections.push({lesson:state.lesson,turn:state.index,original,corrected,rule,practised:false});
    state.corrections=state.corrections.slice(-30);
   }
   state.stage='feedback';save();return true;
  }
  function hint(n){if(state.stage!=='question'||![1,2,3].includes(n))return false;state.hint=Math.max(state.hint,n);save();return true}
  function next(expected){
   const p=state.pending;if(state.stage!=='feedback'||!p||token()!==expected||p.kind==='unconfirmed'||p.kind==='correction'&&!p.practised)return false;
   state.replies.push({text:p.corrected||p.original,assisted:p.assisted||p.kind==='correction'});state.index++;state.hint=0;state.draft='';state.pending=null;
   state.stage=state.index===turns().length?'summary':'question';
   if(state.stage==='summary'&&!state.completed.includes(state.lesson))state.completed.push(state.lesson);
   save();return true;
  }
  function retry(){if(state.stage!=='feedback')return false;state.pending=null;state.stage='question';save();return true}
  function useExample(){if(state.stage!=='feedback'||!current())return false;state.pending={kind:'ok',original:current().sample,assisted:true};save();return true}
  function repair(){if(state.stage!=='feedback'||state.pending?.kind!=='correction')return false;state.stage='repeat';state.practiceDraft='';save();return true}
  function repeat(text){if(state.stage!=='repeat'||api.normalize(text)!==api.normalize(state.pending.corrected))return false;state.stage='transfer';state.practiceDraft='';save();return true}
  function transfer(text){
   if(state.stage!=='transfer'||api.normalize(text)!==api.normalize(api.RULES[state.pending.rule].practice))return false;
   state.pending.practised=true;state.stage='feedback';state.practiceDraft='';
   for(const item of state.corrections)if(item.lesson===state.lesson&&item.turn===state.index&&item.original===state.pending.original)item.practised=true;
   save();return true;
  }
  return {get state(){return state},get persistent(){return persistent},begin,submit,hint,next,retry,useExample,repair,repeat,transfer,current,token,lesson,save,
   practiceDraft(text){state.practiceDraft=String(text||'').slice(0,300);save()},
   draft(text){state.draft=String(text||'').slice(0,300);save()},
   pause(){state.open=false;save()},resume(){if(!lesson())return false;state.open=true;save();return true},
   stats(){return {turns:state.replies.length,independent:state.replies.filter(x=>!x.assisted).length,assisted:state.replies.filter(x=>x.assisted).length,corrections:state.correctionCount}}
  };
 }
 Object.assign(api,{KEY,create});
})();
