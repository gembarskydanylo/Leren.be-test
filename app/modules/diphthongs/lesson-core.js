/* Diphthongs mini-lesson: persisted rounds, balanced question banks and review queues. */
(() => {
  'use strict';
  const KEY='leren_diphthongs_v2';
  const LIMITS={battle:6,dict:8,quiz:10};
  const GROUPS=['ui','ij/ei','ou/au'];
  const PAIRS=[['huis','haas'],['muis','mes'],['ijs','is'],['pijn','pen'],['hout','hoed'],['koud','kat']];
  const group=w=>w.pattern==='ui'?'ui':['ij','ei'].includes(w.pattern)?'ij/ei':['ou','au','ouw','auw'].includes(w.pattern)?'ou/au':w.pattern;
  const shuffled=(items,random=Math.random)=>{const a=[...items];for(let i=a.length-1;i>0;i--){const j=Math.floor(random()*(i+1));[a[i],a[j]]=[a[j],a[i]]}return a};
  function create(words,storage,random=Math.random){
    const bank=new Map(words.map(w=>[w.word,w]));
    const core=words.filter(w=>GROUPS.includes(group(w)));
    const singles=words.filter(w=>!w.isDiph&&w.pattern!=='trema');
    const hiatus=words.filter(w=>w.pattern==='trema');
    if(GROUPS.some(g=>core.filter(w=>group(w)===g).length<2)||singles.length<2||hiatus.length<2||PAIRS.some(p=>p.some(w=>!bank.has(w))))throw Error('Incomplete diphthongs bank');
    const blank=()=>({version:2,stage:'learn',sound:'ui',listening:'battle',learned:[],best:{battle:0,dict:0,quiz:0},mistakes:{battle:[],dict:[],quiz:[]},rounds:{battle:null,dict:null,quiz:null}});
    let state=blank(),persistent=true;
    const object=v=>v&&typeof v==='object'&&!Array.isArray(v);
    function question(kind,key){
      if(kind==='battle'){
        const [num,word]=String(key).split(':');const pair=PAIRS[Number(num)];
        if(!/^\d+$/.test(num)||!pair?.includes(word))return null;
        return {key,word,choices:[...pair],answer:word};
      }
      const w=bank.get(key);if(!w)return null;
      if(kind==='dict'&&[...GROUPS,'oe','ie','eu'].includes(group(w)))return {key,word:key,choices:[...GROUPS,'oe','ie','eu'],answer:group(w)};
      if(kind==='quiz'&&(GROUPS.includes(group(w))||!w.isDiph))return {key,word:key,choices:['yes','no'],answer:w.isDiph?'yes':'no'};
      return null;
    }
    let raw;try{raw=storage.getItem(KEY)}catch{persistent=false}
    try{
      const saved=JSON.parse(raw);
      if(object(saved)&&saved.version===2){
        if(['learn','listen','quiz'].includes(saved.stage))state.stage=saved.stage;
        if(GROUPS.includes(saved.sound))state.sound=saved.sound;
        if(['battle','dict'].includes(saved.listening))state.listening=saved.listening;
        if(Array.isArray(saved.learned))state.learned=[...new Set(saved.learned.filter(g=>GROUPS.includes(g)))];
        for(const kind of Object.keys(LIMITS)){
          const best=saved.best?.[kind];if(Number.isInteger(best)&&best>=0&&best<=LIMITS[kind])state.best[kind]=best;
          const missed=saved.mistakes?.[kind];if(Array.isArray(missed))state.mistakes[kind]=[...new Set(missed.filter(key=>typeof key==='string'&&question(kind,key)))].slice(0,60);
          const r=saved.rounds?.[kind];
          if(object(r)&&Array.isArray(r.keys)&&r.keys.length>0&&r.keys.length<=60&&r.keys.every(k=>typeof k==='string'&&question(kind,k))&&new Set(r.keys).size===r.keys.length&&['full','review'].includes(r.mode)&&Number.isInteger(r.index)&&r.index>=0&&r.index<=r.keys.length&&Array.isArray(r.answers)&&r.answers.length<=r.keys.length&&r.answers.every((a,i)=>a===null||question(kind,r.keys[i]).choices.includes(a))){
            // A full round must have the normal size, and may not skip unanswered questions.
            if((r.mode==='review'||r.keys.length===LIMITS[kind])&&r.keys.slice(0,r.index).every((_,i)=>r.answers[i]!=null)&&r.answers.slice(r.index+1).every(a=>a==null)){
              state.rounds[kind]={mode:r.mode,keys:r.keys,index:r.index,answers:r.answers};
            }
          }
        }
      }
    }catch{}
    const save=()=>{try{storage.setItem(KEY,JSON.stringify(state))}catch{persistent=false}};
    let legacyBest=0;try{legacyBest=Math.max(0,Math.min(100,Number(storage.getItem('lerenbe.diphthongs.best.v1'))||0))}catch{persistent=false}
    const picks=(items,n)=>shuffled(items,random).slice(0,n).map(w=>w.word);
    function start(kind,review=false){
      if(!LIMITS[kind])return false;
      let keys;
      if(review){keys=shuffled(state.mistakes[kind],random);if(!keys.length)return false}
      else if(kind==='battle')keys=shuffled(PAIRS.map((pair,i)=>i+':'+pair[Math.floor(random()*pair.length)]),random);
      else if(kind==='dict')keys=shuffled([...GROUPS.flatMap(g=>picks(core.filter(w=>group(w)===g),2)),...picks(singles.filter(w=>['oe','ie','eu'].includes(w.pattern)),2)],random);
      else keys=shuffled([...GROUPS.flatMap(g=>picks(core.filter(w=>group(w)===g),2)),...picks(singles,2),...picks(hiatus,2)],random);
      state.rounds[kind]={mode:review?'review':'full',keys,index:0,answers:[]};save();return true;
    }
    const round=kind=>state.rounds[kind];
    const current=kind=>{const r=round(kind);return r&&r.index<r.keys.length?question(kind,r.keys[r.index]):null};
    function answer(kind,choice,expected){
      const r=round(kind),q=current(kind);if(!q||q.key!==expected||r.answers[r.index]!=null||!q.choices.includes(choice))return false;
      r.answers[r.index]=choice;
      if(choice===q.answer)state.mistakes[kind]=state.mistakes[kind].filter(k=>k!==q.key);
      else if(!state.mistakes[kind].includes(q.key))state.mistakes[kind].push(q.key);
      save();return true;
    }
    function count(kind){const r=round(kind);return r?r.answers.filter((a,i)=>a===question(kind,r.keys[i]).answer).length:0}
    function next(kind,expected){
      const r=round(kind),q=current(kind);if(!q||q.key!==expected||r.answers[r.index]==null)return false;
      r.index++;
      if(r.index===r.keys.length&&r.mode==='full')state.best[kind]=Math.max(state.best[kind],count(kind));
      save();return true;
    }
    return {
      get state(){return state},get persistent(){return persistent},legacyBest,limits:LIMITS,groups:GROUPS,group,word:w=>bank.get(w),current,round,count,question,start,save,
      stage(name){if(['learn','listen','quiz'].includes(name)){state.stage=name;save()}},
      sound(g){if(GROUPS.includes(g)){state.sound=g;save()}},
      listening(kind){if(['battle','dict'].includes(kind)){state.listening=kind;save()}},
      learn(){if(!state.learned.includes(state.sound))state.learned.push(state.sound);save()},
      ensure(kind){if(!round(kind))start(kind)},answer,next,
      done(kind){const r=round(kind);return !!r&&r.index===r.keys.length},
      steps(){return [state.learned.length===3,state.best.battle>=5&&state.best.dict>=7,state.best.quiz>=8]}
    };
  }
  globalThis.LerenDiphthongsLesson={create,KEY,LIMITS,PAIRS};
})();
