/* Final exam screen for a course in the course player (English 1.1 and 1.2 first). Four parts: Reading, Listening, Writing are
   scored; Speaking is practice (answer aloud, then compare with a model; not scored — pronunciation cannot be checked
   reliably in a browser). Results per skill, every mistake with the right answer and an explanation, "practise my
   mistakes" and "take the exam again". Best results are kept per course in leren_course_exam_v1@<lang>.
   This is an internal practice exam of lerenbe.com, not an official CEFR or Cambridge certificate. */
(() => {
 'use strict';
 const COPY={
  uk:{exam:'Підсумковий іспит',intro:'Чотири частини: читання, аудіювання, письмо й говоріння. Приблизно {m} хв. Відповіді й пояснення — наприкінці.',
   note:'Це внутрішній тренувальний іспит lerenbe.com, а не офіційний сертифікат CEFR чи Cambridge.',start:'Почати іспит',
   reading:'Читання',listening:'Аудіювання',writing:'Письмо',speaking:'Говоріння',part:'Частина',of:'з',next:'Далі',play:'Послухати ще раз',
   noVoice:'На цьому пристрої немає англійського голосу — аудіювання не оцінюється. Спробуй на телефоні або в Chrome.',
   order:'Склади речення: торкайся слів по черзі.',reset:'Скинути',type:'Напиши відповідь',speakQ:'Послухай питання й відповідай уголос англійською.',
   showModel:'Показати приклад відповіді',model:'Приклад',selfOk:'Я відповів(ла)',practice:'тренування, не оцінюється',notScored:'не оцінено',
   result:'Результат іспиту',total:'Разом',pass:'Іспит складено! Ти впевнено володієш темами English {l}.',fail:'Ще трохи практики — повтори помилки й спробуй знову. Потрібно {p}%.',
   mistakes:'Помилки й пояснення',your:'Твоя відповідь',right:'Правильно',none:'(немає відповіді)',retryWrong:'Потренувати помилки',again:'Пройти іспит знову',back:'До курсу',
   best:'Найкращий результат',practiceTitle:'Тренування помилок',correct:'Правильно!',wrongAns:'Правильна відповідь:',done:'Готово'},
  en:{exam:'Final exam',intro:'Four parts: reading, listening, writing and speaking. About {m} min. Answers and explanations at the end.',
   note:'This is an internal practice exam of lerenbe.com, not an official CEFR or Cambridge certificate.',start:'Start the exam',
   reading:'Reading',listening:'Listening',writing:'Writing',speaking:'Speaking',part:'Part',of:'of',next:'Next',play:'Listen again',
   noVoice:'This device has no English voice, so listening is not scored. Try on a phone or in Chrome.',
   order:'Build the sentence: tap the words in order.',reset:'Reset',type:'Write your answer',speakQ:'Listen to the question and answer aloud in English.',
   showModel:'Show a model answer',model:'Model',selfOk:'I answered',practice:'practice, not scored',notScored:'not scored',
   result:'Exam result',total:'Total',pass:'Exam passed! You are confident with the English {l} topics.',fail:'A bit more practice: go over your mistakes and try again. {p}% is needed.',
   mistakes:'Mistakes and explanations',your:'Your answer',right:'Correct',none:'(no answer)',retryWrong:'Practise my mistakes',again:'Take the exam again',back:'Back to the course',
   best:'Best result',practiceTitle:'Practise your mistakes',correct:'Correct!',wrongAns:'The right answer:',done:'Done'},
  fr:{exam:'Examen final',intro:'Quatre parties : lecture, écoute, écriture et expression orale. Environ {m} min. Réponses et explications à la fin.',
   note:'C’est un examen d’entraînement interne de lerenbe.com, pas un certificat officiel CECR ou Cambridge.',start:'Commencer l’examen',
   reading:'Lecture',listening:'Écoute',writing:'Écriture',speaking:'Expression orale',part:'Partie',of:'sur',next:'Suivant',play:'Réécouter',
   noVoice:'Cet appareil n’a pas de voix anglaise : l’écoute n’est pas notée. Essaie sur un téléphone ou dans Chrome.',
   order:'Construis la phrase : touche les mots dans l’ordre.',reset:'Effacer',type:'Écris ta réponse',speakQ:'Écoute la question et réponds à voix haute en anglais.',
   showModel:'Voir un exemple de réponse',model:'Exemple',selfOk:'J’ai répondu',practice:'entraînement, non noté',notScored:'non noté',
   result:'Résultat de l’examen',total:'Total',pass:'Examen réussi ! Tu maîtrises les thèmes d’English {l}.',fail:'Encore un peu d’entraînement : revois tes erreurs et réessaie. Il faut {p} %.',
   mistakes:'Erreurs et explications',your:'Ta réponse',right:'Correct',none:'(pas de réponse)',retryWrong:'Revoir mes erreurs',again:'Repasser l’examen',back:'Retour au cours',
   best:'Meilleur résultat',practiceTitle:'Revoir tes erreurs',correct:'Correct !',wrongAns:'La bonne réponse :',done:'Terminé'},
  ar:{exam:'الامتحان النهائي',intro:'أربعة أجزاء: القراءة والاستماع والكتابة والمحادثة. حوالي {m} دقيقة. الإجابات والشروح في النهاية.',
   note:'هذا امتحان تدريبي داخلي من lerenbe.com وليس شهادة رسمية من CEFR أو Cambridge.',start:'ابدأ الامتحان',
   reading:'القراءة',listening:'الاستماع',writing:'الكتابة',speaking:'المحادثة',part:'الجزء',of:'من',next:'التالي',play:'استمع مرة أخرى',
   noVoice:'لا يوجد صوت إنجليزي على هذا الجهاز، لذلك لا يُقيَّم الاستماع. جرّب على الهاتف أو في Chrome.',
   order:'رتّب الجملة: المس الكلمات بالترتيب.',reset:'مسح',type:'اكتب إجابتك',speakQ:'استمع إلى السؤال وأجب بصوت عالٍ بالإنجليزية.',
   showModel:'اعرض مثالًا للإجابة',model:'مثال',selfOk:'أجبت',practice:'تدريب، بدون تقييم',notScored:'غير مُقيَّم',
   result:'نتيجة الامتحان',total:'المجموع',pass:'نجحت في الامتحان! أنت تتقن مواضيع English {l}.',fail:'تحتاج إلى قليل من التدريب: راجع أخطاءك وحاول مرة أخرى. المطلوب {p}%.',
   mistakes:'الأخطاء والشروح',your:'إجابتك',right:'الصحيح',none:'(لا توجد إجابة)',retryWrong:'تدرّب على أخطائي',again:'أعد الامتحان',back:'العودة إلى الدورة',
   best:'أفضل نتيجة',practiceTitle:'تدرّب على أخطائك',correct:'صحيح!',wrongAns:'الإجابة الصحيحة:',done:'تم'}
 };
 const SKILLS=['reading','listening','writing','speaking'],SCORED=['reading','listening','writing'];
 const node=(tag,cls,text)=>{const e=document.createElement(tag);if(cls)e.className=cls;if(text!=null)e.textContent=text;return e};
 const button=(label,fn,cls='cp-btn')=>{const b=node('button',cls,label);b.type='button';b.onclick=fn;return b};
 const shuffleOpts=(item)=>{const idx=item.options.map((_,i)=>i);for(let i=idx.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[idx[i],idx[j]]=[idx[j],idx[i]]}return idx};
 const hasVoice=()=>{try{return !!(globalThis.speechSynthesis&&globalThis.SpeechSynthesisUtterance)}catch{return false}};

 // Saved best results: {<examId>:{attempts, best:{reading,listening,writing}, lastPct, lastDay}}
 function load(storage,key){try{const v=JSON.parse(storage.getItem(key)||'null');return v&&typeof v==='object'&&!Array.isArray(v)?v:{}}catch{return {}}}
 function summary(storage,key,examId){const r=load(storage,key)[examId];return r&&r.best?r:null}

 // Flatten the exam into a list of questions with their part.
 function items(E){
  const out=[];for(const t of E.reading)for(const it of t.items)out.push({...it,skill:'reading',text:t.text});
  for(const it of E.listening)out.push({...it,skill:'listening'});for(const it of E.writing)out.push({...it,skill:'writing'});
  for(const it of E.speaking)out.push({...it,skill:'speaking'});return out;
 }

 function run({body,lang,ui='uk',exam:E,speak,storage,key,onBack,onResult,canPlay}){
  // Listening is scored when the device has a voice or every listening text has a recording (canPlay from the player).
  const C=COPY[ui]||COPY.uk,list=items(E),voice=hasVoice()||(typeof canPlay==='function'&&E.listening.every(it=>canPlay(it.say)));
  let i=0,answers={},order=null,practice=null;
  const fill=(s,o)=>s.replace('{m}',o.m).replace('{p}',o.p).replace('{l}',o.l);
  const label=sk=>C[sk];

  function intro(){
   body.replaceChildren();const box=node('div','cp-card ex-intro');box.append(node('h3','',C.exam+' '+E.level),node('p','',fill(C.intro,{m:E.minutes})));
   const ul=node('ul','ex-parts');SKILLS.forEach(sk=>ul.appendChild(node('li','',label(sk)+(sk==='speaking'?' — '+C.practice:''))));box.appendChild(ul);
   box.appendChild(node('p','ex-note',C.note));const s=summary(storage,key,E.id);
   if(s)box.appendChild(node('p','cp-muted',C.best+': '+s.lastPct+'%'));
   body.append(box,button(C.start+' →',()=>{i=0;answers={};order=null;question()},'cp-btn cp-primary'),button(C.back,onBack));
  }

  function head(it){
   const p=SKILLS.indexOf(it.skill)+1,inPart=list.filter(x=>x.skill===it.skill),n=inPart.indexOf(it)+1;
   const h=node('div','ex-head');h.append(node('strong','',C.part+' '+p+' · '+label(it.skill)),node('span','cp-muted',n+' / '+inPart.length));
   const bar=node('progress','ex-bar');bar.max=list.length;bar.value=i;body.append(h,bar);
  }
  const advance=()=>{i++;order=null;if(i>=list.length)finish();else question()};

  function question(){
   body.replaceChildren();const it=list[i];head(it);body.dataset.item=it.id;
   if(it.skill==='reading'){
    const t=node('div','ex-text');t.append(node('strong','',it.text.title),node('p','ex-body',it.text.body));t.lang='en';body.appendChild(t);
    choice(it);return;
   }
   if(it.skill==='listening'){
    if(!voice){answers[it.id]=null;body.append(node('p','ex-note',C.noVoice),button(C.next+' →',advance,'cp-btn cp-primary'));return}
    body.appendChild(button('🎧 '+C.play,()=>speak(it.say,lang),'cp-btn cp-sound cp-big'));setTimeout(()=>{if(body.isConnected&&list[i]===it)speak(it.say,lang)},200);
    choice(it);return;
   }
   if(it.skill==='writing'){
    if(it.kind==='order'){
     order=order||[];body.appendChild(node('p','cp-q',C.order));
     const line=node('p','ex-line',order.map(k=>it.tiles[k]).join(' ')||'…');line.lang='en';body.appendChild(line);
     const tiles=node('div','ex-tiles');it.tiles.forEach((w,k)=>{const b=button(w,()=>{order.push(k);question()},'cp-opt ex-tile');b.lang='en';b.disabled=order.includes(k);tiles.appendChild(b)});body.appendChild(tiles);
     const row=node('div','ex-row');row.append(button(C.reset,()=>{order=[];question()}),button(C.next+' →',()=>{answers[it.id]=order.map(k=>it.tiles[k]).join(' ');advance()},'cp-btn cp-primary'));body.appendChild(row);return;
    }
    body.appendChild(node('p','cp-q',it.prompt[ui]||it.prompt.uk));
    const f=node('form','ex-form'),inp=node('input','ex-input');inp.type='text';inp.lang='en';inp.autocomplete='off';inp.setAttribute('autocapitalize','sentences');inp.maxLength=120;inp.setAttribute('aria-label',C.type);inp.placeholder=C.type;
    f.append(inp,button(C.next+' →',()=>{},'cp-btn cp-primary'));f.lastChild.type='submit';f.onsubmit=e=>{e.preventDefault();answers[it.id]=inp.value.trim();advance()};body.appendChild(f);setTimeout(()=>inp.focus(),50);return;
   }
   // speaking: practice only
   body.appendChild(node('p','cp-q',C.speakQ));body.appendChild(button('🎧 '+C.play,()=>speak(it.say,lang),'cp-btn cp-sound cp-big'));
   const q=node('p','ex-line',it.say);q.lang='en';body.appendChild(q);setTimeout(()=>{if(body.isConnected&&list[i]===it)speak(it.say,lang)},200);
   const model=node('div','ex-model');model.hidden=true;const m=node('p','',C.model+': '+it.model);m.lang='en';model.appendChild(m);
   body.append(button(C.showModel,()=>{model.hidden=false;speak(it.model.split(' / ')[0],lang)}),model,button(C.selfOk+' →',()=>{answers[it.id]='practised';advance()},'cp-btn cp-primary'));
  }

  function choice(it){
   const opts=node('div','cp-options');body.appendChild(node('p','cp-q',it.q)).lang='en';
   for(const k of shuffleOpts(it)){const b=button(it.options[k],()=>{answers[it.id]=k;advance()},'cp-opt');b.lang='en';b.dir='ltr';opts.appendChild(b)}
   body.appendChild(opts);
  }

  const isRight=it=>it.skill==='writing'?E.check(it,answers[it.id]):answers[it.id]===it.answer;
  const shown=it=>{const a=answers[it.id];if(a==null||a==='')return C.none;return it.options?it.options[a]:a};
  const rightText=it=>it.options?it.options[it.answer]:(it.answer||it.model);

  function finish(){
   const res={},wrong=[];
   for(const sk of SCORED){const its=list.filter(x=>x.skill===sk);if(sk==='listening'&&!voice){res[sk]=null;continue}
    const ok=its.filter(isRight).length;res[sk]={ok,total:its.length};its.filter(x=>!isRight(x)).forEach(x=>wrong.push(x))}
   const sc=SCORED.filter(sk=>res[sk]),ok=sc.reduce((a,sk)=>a+res[sk].ok,0),tot=sc.reduce((a,sk)=>a+res[sk].total,0),pct=tot?Math.round(ok/tot*100):0;
   // Save: attempts +1, best per skill, last percentage.
   const all=load(storage,key),rec=all[E.id]||{attempts:0,best:{}};rec.attempts=(rec.attempts||0)+1;rec.best=rec.best||{};
   for(const sk of sc)rec.best[sk]=Math.max(rec.best[sk]||0,res[sk].ok);rec.lastPct=pct;rec.lastDay=new Date().toISOString().slice(0,10);all[E.id]=rec;
   try{storage.setItem(key,JSON.stringify(all))}catch{}
   const gained=onResult?onResult(E.id,Object.fromEntries(sc.map(sk=>[sk,res[sk].ok])),pct):0;
   results(res,wrong,pct,gained);
  }

  function results(res,wrong,pct,gained){
   body.replaceChildren();delete body.dataset.item;const top=node('div','cp-card ex-result');top.append(node('h3','',C.result+' · '+E.level),node('p','cp-score',pct+'%'));
   const pass=pct>=E.passPct;top.appendChild(node('p','ex-verdict '+(pass?'is-pass':'is-fail'),pass?fill(C.pass,{l:E.level}):fill(C.fail,{p:E.passPct})));
   if(gained)top.appendChild(node('p','ex-xp','+'+gained+' XP'));
   const tbl=node('ul','ex-skills');
   for(const sk of SKILLS){const li=node('li');li.dataset.skill=sk;li.appendChild(node('span','',label(sk)));
    const r=res[sk],v=sk==='speaking'?C.practice:r==null?C.notScored:r.ok+' / '+r.total;li.appendChild(node('strong','',v));
    if(r){const bar=node('progress','ex-bar');bar.max=r.total;bar.value=r.ok;li.appendChild(bar)}tbl.appendChild(li)}
   top.append(tbl,node('p','ex-note',C.note));body.appendChild(top);
   if(wrong.length){const box=node('div','cp-card ex-mistakes');box.appendChild(node('h3','',C.mistakes));
    for(const it of wrong){const m=node('div','ex-mistake');m.dataset.item=it.id;const q=node('p','ex-mq',it.q||(it.prompt?(it.prompt[ui]||it.prompt.uk):it.answer));q.lang=it.prompt?ui:'en';
     m.append(q,node('p','ex-your',C.your+': '+shown(it)),node('p','ex-right',C.right+': '+rightText(it)),node('p','ex-why',it.why[ui]||it.why.uk));box.appendChild(m)}
    body.appendChild(box);body.appendChild(button(C.retryWrong+' →',()=>retry(wrong),'cp-btn cp-primary'))}
   body.append(button(C.again,()=>intro()),button(C.back,onBack));
  }

  // Practice the wrong items with immediate feedback (does not change the exam result).
  function retry(wrong){
   let k=0,fb=null,ord=[];
   const show=()=>{body.replaceChildren();if(k>=wrong.length){body.append(node('h3','cp-h',C.done+' ✓'),button(C.again,()=>intro(),'cp-btn cp-primary'),button(C.back,onBack));return}
    const it=wrong[k];body.dataset.item=it.id;body.append(node('h3','',C.practiceTitle),node('p','cp-muted',(k+1)+' / '+wrong.length));
    if(fb){const f=node('div','cp-feedback '+(fb.ok?'is-right':'is-wrong'));f.append(node('strong','',fb.ok?C.correct:C.wrongAns+' '+rightText(it)),node('p','',it.why[ui]||it.why.uk));
     body.append(f,button(C.next+' →',()=>{fb=null;ord=[];k++;show()},'cp-btn cp-primary'));return}
    if(it.skill==='reading'){const t=node('div','ex-text');t.append(node('strong','',it.text.title),node('p','ex-body',it.text.body));t.lang='en';body.appendChild(t)}
    if(it.skill==='listening'&&voice){body.appendChild(button('🎧 '+C.play,()=>speak(it.say,lang),'cp-btn cp-sound'));speak(it.say,lang)}
    else if(it.skill==='listening'){const s=node('p','ex-line',it.say);s.lang='en';body.appendChild(s)}
    if(it.options){body.appendChild(node('p','cp-q',it.q)).lang='en';const opts=node('div','cp-options');
     for(const j of shuffleOpts(it)){const b=button(it.options[j],()=>{fb={ok:j===it.answer};show()},'cp-opt');b.lang='en';opts.appendChild(b)}body.appendChild(opts);return}
    if(it.kind==='order'){body.appendChild(node('p','cp-q',C.order));const line=node('p','ex-line',ord.map(j=>it.tiles[j]).join(' ')||'…');line.lang='en';body.appendChild(line);
     const tiles=node('div','ex-tiles');it.tiles.forEach((w,j)=>{const b=button(w,()=>{ord.push(j);show()},'cp-opt ex-tile');b.disabled=ord.includes(j);tiles.appendChild(b)});body.appendChild(tiles);
     body.append(button(C.reset,()=>{ord=[];show()}),button(C.next+' →',()=>{fb={ok:E.check(it,ord.map(j=>it.tiles[j]).join(' '))};show()},'cp-btn cp-primary'));return}
    body.appendChild(node('p','cp-q',it.prompt[ui]||it.prompt.uk));const f=node('form','ex-form'),inp=node('input','ex-input');inp.type='text';inp.lang='en';inp.placeholder=C.type;inp.setAttribute('aria-label',C.type);
    const sb=button(C.next+' →',()=>{},'cp-btn cp-primary');sb.type='submit';f.append(inp,sb);f.onsubmit=e=>{e.preventDefault();fb={ok:E.check(it,inp.value)};show()};body.appendChild(f);
   };
   show();
  }
  intro();
 }
 globalThis.LerenCourseExamUI={run,summary,COPY};
})();
