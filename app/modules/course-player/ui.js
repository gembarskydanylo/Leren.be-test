/* Course player for the new languages (English and French; German later). Same three steps as the Dutch route —
   study, listen, check — on the same core (modules/learning-path/core.js), with this language's own progress key
   (LerenCourses.key('leren_path_v1', lang) → leren_path_v1@en). Opens as a full-screen layer above the app and never
   touches the Dutch route. Shown only in preview (lerenbe.com/?multilang=1) while the course status is "planned". */
(() => {
 'use strict';
 const COPY={
  uk:{preview:'Перегляд: інші мови',soon:'Курс готується. Скоро тут будуть уроки.',close:'Закрити',start:'Почати урок',resume:'Продовжити урок',lesson:'Урок',done:'пройдено',study:'Вивчи',listen:'Почуй',check:'Перевір',
   next:'Далі',listenQ:'Що ти почув(ла)?',checkQ:'Як це сказати?',right:'Правильно!',wrong:'Правильна відповідь:',stepDone:'Крок завершено!',nextStep:'Наступний крок',result:'Урок пройдено!',score:'Правильних відповідей',
   nextLesson:'Наступний урок',back:'До курсу',allDone:'Розділ пройдено! Нові розділи — скоро.',rule:'Правило',sound:'Послухати',noVoice:'На цьому пристрої немає голосу для цієї мови ({n}), тому вимова може звучати неточно. Додай його в налаштуваннях телефона (Мова → Синтез мовлення).'},
  en:{preview:'Preview: other languages',soon:'This course is being prepared. Lessons are coming soon.',close:'Close',start:'Start lesson',resume:'Continue lesson',lesson:'Lesson',done:'done',study:'Study',listen:'Listen',check:'Check',
   next:'Next',listenQ:'What did you hear?',checkQ:'How do you say it?',right:'Correct!',wrong:'The right answer:',stepDone:'Step complete!',nextStep:'Next step',result:'Lesson complete!',score:'Correct answers',
   nextLesson:'Next lesson',back:'Back to the course',allDone:'Chapter complete! New chapters are coming soon.',rule:'Rule',sound:'Listen',noVoice:'This device has no voice for this language, so the pronunciation may be wrong. Add one in your phone settings (Language → Text-to-speech).'},
  fr:{preview:'Aperçu : autres langues',soon:'Ce cours est en préparation. Les leçons arrivent bientôt.',close:'Fermer',start:'Commencer la leçon',resume:'Reprendre la leçon',lesson:'Leçon',done:'terminée',study:'Apprends',listen:'Écoute',check:'Vérifie',
   next:'Suivant',listenQ:'Qu’as-tu entendu ?',checkQ:'Comment le dire ?',right:'Correct !',wrong:'La bonne réponse :',stepDone:'Étape terminée !',nextStep:'Étape suivante',result:'Leçon terminée !',score:'Bonnes réponses',
   nextLesson:'Leçon suivante',back:'Retour au cours',allDone:'Chapitre terminé ! De nouveaux chapitres arrivent bientôt.',rule:'Règle',sound:'Écouter',noVoice:'Cet appareil n’a pas de voix pour cette langue : la prononciation peut être fausse. Ajoute-en une dans les réglages (Langue → Synthèse vocale).'},
  ar:{preview:'معاينة: لغات أخرى',soon:'هذه الدورة قيد الإعداد. الدروس قريبًا.',close:'إغلاق',start:'ابدأ الدرس',resume:'تابع الدرس',lesson:'الدرس',done:'مكتمل',study:'تعلّم',listen:'استمع',check:'تحقّق',
   next:'التالي',listenQ:'ماذا سمعت؟',checkQ:'كيف تقولها؟',right:'صحيح!',wrong:'الإجابة الصحيحة:',stepDone:'اكتملت الخطوة!',nextStep:'الخطوة التالية',result:'اكتمل الدرس!',score:'الإجابات الصحيحة',
   nextLesson:'الدرس التالي',back:'العودة إلى الدورة',allDone:'اكتمل الفصل! فصول جديدة قريبًا.',rule:'قاعدة',sound:'استمع',noVoice:'لا يوجد صوت لهذه اللغة على هذا الجهاز، لذلك قد يكون النطق غير دقيق. أضف صوتًا من إعدادات الهاتف (اللغة ← تحويل النص إلى كلام).'}
 };
 const STEPS=['study','listen','check'];
 // Level names of the Flemish adult-education profile (internal course levels, not a certificate).
 const LEVEL_NAME={'1.1':'Breakthrough (A1)','1.2':'Waystage (A2)'};
 const node=(tag,cls,text)=>{const e=document.createElement(tag);if(cls)e.className=cls;if(text!=null)e.textContent=text;return e};
 const button=(label,fn,cls='cp-btn')=>{const b=node('button',cls,label);b.type='button';b.onclick=fn;return b};
 const storage={getItem:k=>{try{return localStorage.getItem(k)}catch{return null}},setItem:(k,v)=>{try{localStorage.setItem(k,v)}catch{}}};
 const shuffle=a=>{const x=[...a];for(let i=x.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[x[i],x[j]]=[x[j],x[i]]}return x};

 // Recorded audio (Azure neural voices, tools/make-audio-azure.sh): audio/<lang>/<hash>.m4a listed in audio/<lang>/manifest.json,
 // same hash as app.js audioHash(). Anything not recorded, or a clip that fails to load, uses the device voice.
 const REC={};let recEl=null;
 function recLoad(lang){if(REC[lang])return REC[lang];const set=REC[lang]=new Set();
  try{fetch('audio/'+lang+'/manifest.json',{cache:'no-cache'}).then(r=>r.ok?r.json():[]).then(a=>{if(Array.isArray(a))a.forEach(h=>set.add(h))}).catch(()=>{})}catch{}return set}
 function speak(text,lang){
  const h=typeof globalThis.audioHash==='function'?globalThis.audioHash(text):null;
  if(h&&REC[lang]?.has(h)){
   try{globalThis.speechSynthesis?.cancel()}catch{}try{recEl?.pause()}catch{}
   try{const a=new Audio('audio/'+lang+'/'+h+'.m4a');recEl=a;a.preservesPitch=true;a.playbackRate=.9;a.onerror=()=>{REC[lang].delete(h);tts(text,lang)};
    const p=a.play();if(p&&p.catch)p.catch(()=>{});globalThis.__cpSaid=(globalThis.__cpSaid||[]).concat(text);globalThis.__cpRecorded=(globalThis.__cpRecorded||[]).concat(h);return true}catch{}
  }
  return tts(text,lang);
 }
 function tts(text,lang){
  try{const synth=globalThis.speechSynthesis;if(!synth||!globalThis.SpeechSynthesisUtterance)return false;
   const code=globalThis.LerenCourses?.VOICE?.[lang]||lang,u=new SpeechSynthesisUtterance(text);u.lang=code;u.rate=.9;
   const v=synth.getVoices().find(v=>v.lang===code)||synth.getVoices().find(v=>v.lang&&v.lang.slice(0,2)===code.slice(0,2));if(v)u.voice=v;
   synth.cancel();synth.speak(u);globalThis.__cpSaid=(globalThis.__cpSaid||[]).concat(text);return true}catch{return false}
 }
 // false only when the device lists its voices and none speaks this language (then the text would be read in another accent).
 function voiceFor(lang){try{const vs=globalThis.speechSynthesis?.getVoices?.()||[];if(!vs.length)return true;const code=(globalThis.LerenCourses?.VOICE?.[lang]||lang).slice(0,2);return vs.some(v=>v.lang&&v.lang.slice(0,2).toLowerCase()===code)}catch{return true}}

 function open(lang,ui='uk'){
  const R=globalThis.LerenCourses,C=COPY[ui]||COPY.uk,info=R?.COURSES?.[lang];if(!info)return null;
  document.querySelector('.cp-stage')?.remove();
  const stage=node('section','cp-stage');stage.setAttribute('role','dialog');stage.setAttribute('aria-modal','true');stage.dir=ui==='ar'?'rtl':'ltr';stage.lang=ui;stage.dataset.lang=lang;
  const head=node('div','cp-head'),title=node('h2','cp-title',info.flag+' '+R.name(lang,ui)+' '+info.levels[0]),close=button('✕',()=>{try{globalThis.speechSynthesis?.cancel()}catch{}stage.remove();document.documentElement.classList.remove('cp-open')},'cp-close');
  close.setAttribute('aria-label',C.close);head.append(title,close);const body=node('div','cp-body');stage.append(head,body);
  document.body.appendChild(stage);document.documentElement.classList.add('cp-open');
  const pack=globalThis.LerenCourseData?.[lang];
  recLoad(lang);
  if(!pack){body.append(node('div','cp-soon-icon','🐱📚'),node('p','cp-soon',C.soon));return stage}
  const core=globalThis.LerenLearningPath,course=core.catalog(pack.data,pack.curriculum,{text:pack.text});
  const model=core.create(course,storage,{key:R.key('leren_path_v1',lang)});
  const tr=w=>(ui===pack.text?w.uk:(w[ui]||w.uk)),target=w=>w[pack.text];
  const chapterName=ch=>pack.curriculum.chapterNames?.[ch.id]?.[ui]||ch.nl;
  let feedback=null;
  // The next lesson of the current level; when that level is finished, the first open lesson of the next level (1.1 → 1.2).
  const levels=[...new Set(course.chapters.map(c=>c.level))];
  const nextLesson=()=>model.recommended()||levels.map(lv=>lv===model.state.course?null:model.recommended(lv)).find(Boolean)||null;

  function home(){
   body.replaceChildren();feedback=null;
   // The one main action first (on the first screen), then the chapters: the current one open, the others folded with
   // their progress (36 lessons would otherwise push the button far below the screen).
   const next=nextLesson(),s=model.state.session,lvl=(next?course.chapters.find(c=>c.id===next.chapter):course.chapters[course.chapters.length-1])?.level||info.levels[0];
   title.textContent=info.flag+' '+R.name(lang,ui)+' '+lvl;
   const resume=!!next&&s&&s.kind==='lesson'&&s.lesson===next.id&&!(s.phase===2&&s.index===s.ids.length);
   if(next){const ch=course.chapters.find(c=>c.id===next.chapter),n=ch.lessons.findIndex(l=>l.id===next.id)+1;
    body.append(button((resume?C.resume:C.start)+' →',()=>{if(!resume)model.begin(next.id);lesson()},'cp-btn cp-primary'),node('p','cp-muted cp-next',chapterName(ch)+' · '+C.lesson+' '+n))}
   else body.appendChild(node('p','cp-all-done',C.allDone));
   // Final exam of the course (modules/course-player/exam.js): best result on the button.
   // One button per exam of this language (1.1, 1.2), in level order.
   const XU=globalThis.LerenCourseExamUI;
   for(const E of Object.values(globalThis.LerenCourseExams||{}).filter(e=>e.lang===lang).sort((a,b)=>a.level.localeCompare(b.level)))if(XU){const k=R.key('leren_course_exam_v1',lang),sm=XU.summary(storage,k,E.id),X=XU.COPY[ui]||XU.COPY.uk;
    const b=button('📝 '+X.exam+' '+E.level+(sm?' · '+X.best+': '+sm.lastPct+'%':''),()=>XU.run({body,lang,ui,exam:E,speak,storage,key:k,onBack:home,canPlay:t=>typeof globalThis.audioHash==='function'&&!!REC[lang]?.has(globalThis.audioHash(t)),
     onResult:(id,best,pct)=>{try{return globalThis.LerenCourseRewards?.exam?.(lang,id,best)||0}catch{return 0}}}),'cp-btn cp-exam');b.dataset.exam=E.id;body.appendChild(b)}
   let shownLevel=null;
   for(const ch of course.chapters){
    // A heading where a level starts (1.1 Breakthrough, 1.2 Waystage), only when the course has more than one level.
    if(ch.level!==shownLevel&&new Set(course.chapters.map(c=>c.level)).size>1){shownLevel=ch.level;const h=node('h3','cp-level',ch.level+(LEVEL_NAME[ch.level]?' · '+LEVEL_NAME[ch.level]:''));h.dataset.level=ch.level;body.appendChild(h)}
    const done=ch.lessons.filter(l=>model.state.completed[l.id]!=null).length,box=node('details','cp-card');box.dataset.chapter=ch.id;
    if(next?ch.id===next.chapter:ch===course.chapters[0])box.open=true;
    const sum=node('summary','cp-sum');sum.append(node('span','cp-sum-name',chapterName(ch)),node('span','cp-sum-n',done+' / '+ch.lessons.length+(done===ch.lessons.length?' ✓':'')));box.appendChild(sum);
    const list=node('ol','cp-lessons');ch.lessons.forEach((l,i)=>{const li=node('li',model.state.completed[l.id]!=null?'is-done':'');li.dataset.lesson=l.id;
     li.append(node('span','cp-li-n',C.lesson+' '+(i+1)),node('span','cp-li-words',l.ids.slice(0,2).map(id=>target(course.cards.get(id))).join(' · ')+' …'));
     if(model.state.completed[l.id]!=null)li.appendChild(node('span','cp-li-done','✓ '+C.done));list.appendChild(li)});
    box.appendChild(list);body.appendChild(box);
   }
  }

  function options(w,showTarget){
   // Wrong answers come from the same topic when there are enough (a fair choice), else from the whole course.
   const tabOf=id=>course.lessons.find(l=>l.ids.includes(id))?.tab,pool=[...course.cards.values()].filter(x=>x.id!==w.id),same=pool.filter(x=>tabOf(x.id)===tabOf(w.id));
   const others=shuffle(same.length>=3?same:pool).slice(0,3);return shuffle([w,...others]).map(x=>({text:showTarget?target(x):tr(x),ok:x.id===w.id}));
  }

  function lesson(){
   body.replaceChildren();const s=model.state.session;if(!s){home();return}
   const l=course.lessons.find(x=>x.id===s.lesson),steps=node('ol','cp-steps');
   STEPS.forEach((k,i)=>{const li=node('li',i===s.phase?'is-active':i<s.phase?'is-done':'',(i<s.phase?'✓ ':(i+1)+'. ')+C[k]);steps.appendChild(li)});
   body.appendChild(steps);
   if(s.index===s.ids.length){
    if(s.phase<2){body.append(node('h3','cp-h',C.stepDone),button(C.nextStep+' → '+C[STEPS[s.phase+1]],()=>{model.nextPhase();lesson()},'cp-btn cp-primary'));return}
    const r=model.finish();body.append(node('h3','cp-h',C.result),node('p','cp-score',r.correct+' / '+r.total),node('p','cp-muted',C.score));
    // Shared progress (app.js LerenCourseRewards): points only above this lesson's best, never twice.
    let xp=0;try{xp=globalThis.LerenCourseRewards?.lesson?.(lang,r.id,r.correct,r.total)||0}catch{}if(xp)body.appendChild(node('p','cp-xp','+'+xp+' XP'));
    const list=node('ul','cp-learned');s.ids.forEach(id=>{const w=course.cards.get(id);const li=node('li');const t=node('strong','',target(w));t.lang=lang;li.append(t,node('span','',' — '+tr(w)));list.appendChild(li)});body.appendChild(list);
    const nxt=nextLesson();
    if(nxt)body.appendChild(button(C.nextLesson+' →',()=>{model.home();model.begin(nxt.id);lesson()},'cp-btn cp-primary'));
    body.appendChild(button(C.back,()=>{model.state.session=null;home()}));return;
   }
   const w=model.current(),progress=node('p','cp-muted',(s.index+1)+' / '+s.ids.length);body.appendChild(progress);stage.dataset.card=w.id;stage.dataset.phase=STEPS[s.phase];
   const art=node('div','cp-art',w.icon||'📘');art.setAttribute('aria-hidden','true');
   if(s.phase===0){
    const word=node('p','cp-word',target(w));word.lang=lang;word.dir='ltr';
    const say=button('🔊 '+C.sound,()=>speak(target(w),lang),'cp-btn cp-sound');
    body.append(art,word,node('p','cp-tr',tr(w)),say);
    if(!voiceFor(lang)&&!REC[lang]?.size)body.appendChild(node('p','cp-novoice',C.noVoice.replace('{n}',R.name(lang,ui).toLowerCase())));
    if(s.index===0&&pack.grammar?.[l.tab]){const rule=node('div','cp-rule');rule.append(node('strong','',C.rule+': '),node('span','',pack.grammar[l.tab][ui]||pack.grammar[l.tab].uk));body.appendChild(rule)}
    body.appendChild(button(C.next+' →',()=>{model.advance(w.id,true);lesson()},'cp-btn cp-primary'));
    setTimeout(()=>{if(say.isConnected)speak(target(w),lang)},150);return;
   }
   const listen=s.phase===1;
   if(listen){const play=button('🎧 '+C.sound,()=>speak(target(w),lang),'cp-btn cp-sound cp-big');body.append(node('p','cp-q',C.listenQ),play);setTimeout(()=>{if(play.isConnected)speak(target(w),lang)},150)}
   else body.append(art,node('p','cp-tr cp-q',tr(w)),node('p','cp-muted',C.checkQ));
   const opts=node('div','cp-options');
   if(feedback&&feedback.id===w.id){
    for(const o of feedback.opts){const b=node('button','cp-opt'+(o.ok?' is-right':o.text===feedback.picked?' is-wrong':''),o.text);b.type='button';b.disabled=true;if(!listen)b.lang=lang;opts.appendChild(b)}
    body.appendChild(opts);const fb=node('div','cp-feedback '+(feedback.ok?'is-right':'is-wrong'));fb.setAttribute('role','status');
    fb.appendChild(node('strong','',feedback.ok?C.right:C.wrong));if(!feedback.ok){const t=node('span','',' '+target(w)+' — '+tr(w));fb.appendChild(t)}
    body.append(fb,button(C.next+' →',()=>{const ok=feedback.ok;feedback=null;model.advance(w.id,ok);lesson()},'cp-btn cp-primary'));return;
   }
   const list=options(w,!listen);
   for(const o of list){const b=button(o.text,()=>{feedback={id:w.id,ok:o.ok,picked:o.text,opts:list};if(o.ok&&!listen)speak(target(w),lang);lesson()},'cp-opt');if(!listen){b.lang=lang;b.dir='ltr'}opts.appendChild(b)}
   body.appendChild(opts);
  }
  home();
  return stage;
 }

 // Entry card on the Dutch route home, preview only: one button per course that is not live yet.
 function previewCard(ui='uk'){
  const R=globalThis.LerenCourses;if(!R||!R.preview(storage))return null;
  const C=COPY[ui]||COPY.uk,box=node('section','cp-preview');box.appendChild(node('h3','',C.preview));
  const row=node('div','cp-preview-row');
  for(const c of Object.values(R.COURSES))if(c.status!=='live'){const b=button(c.flag+' '+R.name(c.id,ui)+' '+c.levels[0],()=>open(c.id,ui),'cp-btn');b.dataset.course=c.id;row.appendChild(b)}
  box.appendChild(row);return box;
 }
 globalThis.LerenCoursePlayer={open,previewCard,speak,COPY};
})();
