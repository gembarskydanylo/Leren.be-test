/* Learning insights: active study minutes, the daily goal in minutes, the streak of study days, progress by skill
   and Peter's advice. Pure functions over plain stored objects: no DOM, no storage, no network (tests run them in node).
   Stored keys (all synced by the account like other leren_ keys):
   - leren_minutes_v1 {days:{"YYYY-MM-DD":seconds}}: active study time per local day, last 60 days.
   - leren_goal_min: 5 | 10 | 15 | 20 | 30 (default 10).
   - poly_streak {n,last,best}: the existing streak record; best is added, old saves keep working.
   - leren_skills_v1 {a11:{lezen:{ok,n,r},luisteren:{…},schrijven:{…},spreken:{n}},a12:{…}}: answers by skill and course
     (r = the last 30 results as "1"/"0").
   - leren_slips_v1 {a11:{omdat:"0110",…},a12:{…}}: the last 20 results per grammar point, for Peter's advice. */
(()=>{'use strict';
 const DAY=864e5,IDLE=90e3,STEP=15e3,GOALS=[5,10,15,20,30],GOAL_DEFAULT=10,KEEP_DAYS=60,RECENT=30,SLIP_RECENT=20,MIN_ANSWERS=10;
 const LEVELS=['a11','a12'],QUIZ_SKILLS=['lezen','luisteren','schrijven'],TAGS=['omdat','perfectum','meervoud','vergelijking','scheidbaar','werkwoorden','klinkers','spelling','grammatica'];
 const obj=v=>v!==null&&typeof v==='object'&&!Array.isArray(v);
 const int=v=>Number.isFinite(Number(v))&&Number(v)>0?Math.floor(Number(v)):0;

 // ---- Local calendar days. A day is the learner's own date (their time zone); differences between days are counted
 // on the calendar (UTC of that date), so a 23- or 25-hour day at a daylight-saving change is still one day.
 const day=(d=new Date())=>d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0');
 const dayNum=s=>{const m=/^(\d{4})-(\d{2})-(\d{2})$/.exec(String(s||''));return m?Math.round(Date.UTC(+m[1],+m[2]-1,+m[3])/DAY):NaN};

 // ---- Active time. The app ticks every few seconds; a tick counts only while a learning screen is visible and the
 // learner did something (tap, key, scroll) in the last 90 seconds. One tick adds at most 15 seconds, so a sleeping
 // computer or a throttled background tab never adds a long gap.
 function credit(prev,now,lastInput,active){if(!active||!(lastInput>0)||now-lastInput>IDLE||!(now>prev))return 0;return Math.min(STEP,now-prev)}
 function cleanMinutes(raw){const days={};if(obj(raw)&&obj(raw.days))for(const [d,s] of Object.entries(raw.days))if(!Number.isNaN(dayNum(d))&&Number.isFinite(s)&&s>0)days[d]=Math.min(86400,s);return {days}}
 function addTime(raw,ms,today){const m=cleanMinutes(raw);if(!(ms>0))return m;m.days[today]=Math.min(86400,(m.days[today]||0)+ms/1000);
  const keep=Object.keys(m.days).sort().slice(-KEEP_DAYS);for(const d of Object.keys(m.days))if(!keep.includes(d))delete m.days[d];return m}
 const minutesOn=(raw,d)=>Math.floor((cleanMinutes(raw).days[d]||0)/60);
 const goal=v=>GOALS.includes(Number(v))?Number(v):GOAL_DEFAULT;

 // ---- Streak of study days: a day counts when the daily goal is reached. A missed day only starts a new streak;
 // points, rewards and the best streak are never taken away.
 function streakView(s,today){s=obj(s)?s:{};const n=int(s.n),gap=dayNum(today)-dayNum(s.last),live=gap===0||gap===1;return {n:live?n:0,best:Math.max(int(s.best),n),last:typeof s.last==='string'?s.last:'',today:gap===0}}
 function streakAdvance(s,today){s=obj(s)?s:{};const n=int(s.n),gap=dayNum(today)-dayNum(s.last);
  if(gap===0||gap<0)return {...s,n:Math.max(1,n),last:gap<0?s.last:today,best:Math.max(int(s.best),n,1)}; // same day, or a date from a device clock ahead: never lower anything
  const next=gap===1?n+1:1;return {...s,n:next,last:today,best:Math.max(int(s.best),next)}}

 // ---- Skills
 const blank=()=>({lezen:{ok:0,n:0,r:''},luisteren:{ok:0,n:0,r:''},schrijven:{ok:0,n:0,r:''},spreken:{n:0}});
 function cleanSkills(raw){const out={};for(const lv of LEVELS){const src=obj(raw)&&obj(raw[lv])?raw[lv]:{},b=blank();
   for(const k of QUIZ_SKILLS){const x=obj(src[k])?src[k]:{};b[k].n=int(x.n);b[k].ok=Math.min(int(x.ok),b[k].n);b[k].r=typeof x.r==='string'?x.r.replace(/[^01]/g,'').slice(-RECENT):''}
   b.spreken.n=int(obj(src.spreken)?src.spreken.n:0);out[lv]=b}return out}
 function skillLog(raw,lv,skill,ok){const s=cleanSkills(raw);if(!s[lv]||!QUIZ_SKILLS.includes(skill)||typeof ok!=='boolean')return s;const x=s[lv][skill];x.n++;if(ok)x.ok++;x.r=(x.r+(ok?'1':'0')).slice(-RECENT);return s}
 function spoke(raw,lv){const s=cleanSkills(raw);if(s[lv])s[lv].spreken.n++;return s}
 const rate=r=>r.length?[...r].filter(c=>c==='1').length/r.length:null;
 // What the progress screen shows for one course. Percentages exist only for answers checked by the app
 // (multiple choice, dictation, the writing checklist); speaking shows counts, never a percentage.
 function summary(raw,lv,exam){const s=cleanSkills(raw)[lv]||blank(),e=obj(exam)?exam:{},best=obj(e.best)?e.best:{};const pct=x=>x.n>=MIN_ANSWERS?Math.round(x.ok/x.n*100):null;
  const wb=obj(e.wbest)?Object.values(e.wbest).filter(v=>Number.isFinite(v)&&v>=0&&v<=100):[];
  const sp=obj(e.sp)?Object.values(e.sp).reduce((n,a)=>n+(Array.isArray(a)?a.length:0),0):0;
  const examPct=k=>Number.isFinite(best[k])?best[k]:null;
  return {lezen:{...s.lezen,pct:pct(s.lezen),exam:examPct('lezen')},luisteren:{...s.luisteren,pct:pct(s.luisteren),exam:examPct('luisteren')},
   schrijven:{...s.schrijven,pct:pct(s.schrijven),tasks:wb.length,avg:wb.length?Math.round(wb.reduce((a,b)=>a+b,0)/wb.length):null},
   spreken:{n:s.spreken.n,exam:sp}}}

 // ---- Grammar points the learner slips on (exam parts, games, the writing checklist)
 function cleanSlips(raw){const out={};for(const lv of LEVELS){out[lv]={};const src=obj(raw)&&obj(raw[lv])?raw[lv]:{};for(const t of TAGS)if(typeof src[t]==='string'){const r=src[t].replace(/[^01]/g,'').slice(-SLIP_RECENT);if(r)out[lv][t]=r}}return out}
 function slipLog(raw,lv,tag,ok){const s=cleanSlips(raw);if(!s[lv]||!TAGS.includes(tag)||typeof ok!=='boolean')return s;s[lv][tag]=((s[lv][tag]||'')+(ok?'1':'0')).slice(-SLIP_RECENT);return s}
 // Grammar point of an exam grammar question, from its text and options.
 function tagGram(it){const text=[it.gap,it.a,it.full,it.s].filter(Boolean).join(' '),o=(it.o||[]).join(' ');
  if(/\bomdat\b/i.test(text+' '+o))return 'omdat';
  if(/(^| )(ben|heb|is|heeft|hebt)( |$)/.test(o)||/(^| )ge\w+[dt]( |$)/.test(o))return 'perfectum';
  if(/\bdan\b/.test(o)||/\w+er\s+dan\b/.test(text))return 'vergelijking';
  return 'grammatica'}
 // Grammar point of a writing tip (by the tip's pattern).
 function tipTag(re){const s=String(re&&re.source||re||'');if(/omdat/.test(s))return 'omdat';if(/gegaan|gewerkt/.test(s))return 'perfectum';if(/er als/.test(s))return 'vergelijking';if(/geop|gein/.test(s))return 'scheidbaar';return 'spelling'}

 // ---- Peter's advice: up to 3 concrete steps, each with the exercise that trains it.
 // facts: {lv, skills (summary), slips (cleanSlips()[lv]), due:[ids], tests:[{id,title,best,total}], lessonsDone, writeTask:id|null, tabs:[visible lesson tabs],
 //  canSpeak: false when the browser has no speech recognition (then speaking can't be counted, so it is not suggested)}
 function weakSlips(slips){return Object.entries(slips||{}).map(([tag,r])=>({tag,wrong:[...r].filter(c=>c==='0').length,n:r.length})).filter(x=>x.wrong>=3&&x.wrong/x.n>=.3).sort((a,b)=>b.wrong-a.wrong||b.wrong/b.n-a.wrong/a.n)}
 function slipAction(tag,lv,tabs){
  if(tag==='omdat')return {t:'game',id:'om'};
  if(tag==='spelling')return {t:'game',id:'dc'};
  if(tag==='meervoud')return {t:'exam',lv:'a11',part:'meervoud'};
  const tab={scheidbaar:'separable',werkwoorden:'vervoegen',klinkers:'klanken'}[tag];
  if(tab&&(tabs||[]).includes(tab))return {t:'tab',tab,mode:'quiz'};
  return {t:'exam',lv,part:'grammatica'}}
 function recommend(f){
  const out=[],sk=f.skills||summary({},f.lv,{}),recent=k=>rate(sk[k].r||'');
  const slip=weakSlips(f.slips)[0];if(slip)out.push({kind:'slip',tag:slip.tag,wrong:slip.wrong,n:slip.n,action:slipAction(slip.tag,f.lv,f.tabs)});
  // The weakest checked skill among recent answers (at least 10), below 70%.
  const weak=['luisteren','lezen'].filter(k=>sk[k].n>=MIN_ANSWERS&&recent(k)!==null&&recent(k)<.7).sort((a,b)=>recent(a)-recent(b))[0];
  if(weak)out.push({kind:'skill',skill:weak,pct:Math.round(recent(weak)*100),action:{t:'mode',mode:weak==='luisteren'?'audio':'quiz'}});
  else if(sk.schrijven.n>=5&&recent('schrijven')<.7)out.push({kind:'skill',skill:'schrijven',pct:Math.round(recent('schrijven')*100),action:{t:'game',id:'dc'}});
  else if(sk.schrijven.tasks>=2&&sk.schrijven.avg<70&&f.writeTask)out.push({kind:'write',pct:sk.schrijven.avg,action:{t:'write',lv:f.lv,id:f.writeTask}});
  const due=(f.due||[]).length;if(due>=3)out.push({kind:'due',n:due,action:{t:'review',ids:f.due.slice(0,5)}});
  const test=(f.tests||[]).filter(t=>t.total>0&&Number.isFinite(t.best)&&t.best/t.total<.6).sort((a,b)=>a.best/a.total-b.best/b.total)[0];
  if(test)out.push({kind:'test',id:test.id,title:test.title,best:test.best,total:test.total,action:{t:'test',id:test.id}});
  if(f.canSpeak!==false&&f.lessonsDone>=5&&sk.spreken.n+sk.spreken.exam<5)out.push({kind:'speak',n:sk.spreken.n+sk.spreken.exam,action:{t:'game',id:'sp'}});
  // Something the learner does well (at least 10 recent answers, 80% or more), said before the first weak point.
  const strong=['lezen','luisteren','schrijven'].filter(k=>sk[k].n>=MIN_ANSWERS&&recent(k)>=.8&&!out.some(r=>r.skill===k)).sort((a,b)=>recent(b)-recent(a))[0]||null;
  return {strong,items:out.slice(0,3)};
 }

 // ---- Wording (uk, en, fr, ar)
 const ukN=(n,a,b,c)=>{const m=n%10,h=n%100;return m===1&&h!==11?a:m>=2&&m<=4&&(h<12||h>14)?b:c};
 const T={
  uk:{but:'але',strong:{lezen:'Ти добре читаєш',luisteren:'Ти добре розумієш на слух',schrijven:'Ти добре пишеш'},
   slip:{omdat:'часто помиляєшся в реченнях з omdat',perfectum:'плутаєшся в минулому часі (ben / heb + ge…)',meervoud:'помиляєшся в множині іменників',vergelijking:'після порівняння пишеш «als» замість «dan»',scheidbaar:'помиляєшся з дієсловами, що розділяються',werkwoorden:'плутаєш форми дієслів',klinkers:'плутаєш короткі й довгі голосні',spelling:'робиш помилки в написанні слів',grammatica:'помиляєшся в граматичних вправах'},
   slipPlan:'Сьогодні потренуємо це правило.',
   skill:{lezen:p=>'у вправах на читання поки '+p+'% правильних',luisteren:p=>'на слух поки '+p+'% правильних відповідей',schrijven:p=>'у диктанті поки '+p+'% правильних'},
   skillPlan:{lezen:'Сьогодні потренуємо слова теми: читаємо й обираємо переклад.',luisteren:'Сьогодні послухаємо слова теми й оберемо переклад.',schrijven:'Сьогодні напишемо короткий диктант.'},
   write:p=>'письмові завдання поки в середньому на '+p+'% за списком перевірки',writePlan:'Сьогодні напишемо коротке повідомлення.',
   due:n=>n+' '+ukN(n,'слово','слова','слів')+' пора повторити',duePlan:'Повторимо їх зараз — це 2–3 хвилини.',
   test:(t,b,n)=>'тест «'+t+'» поки на '+b+' з '+n,testPlan:'Пройдемо його ще раз.',
   speak:n=>'ти ще мало говориш уголос ('+n+' '+ukN(n,'усна відповідь','усні відповіді','усних відповідей')+')',speakPlan:'Сьогодні скажемо кілька відповідей у мікрофон.',
   go:{slip:'Тренувати правило →',skill:'Почати вправу →',write:'Написати →',due:'Повторити слова →',test:'Пройти тест →',speak:'Говорити →'},
   title:'Пітер радить',none:'Поки все добре. Продовжуй маршрут — я підкажу, коли щось варто повторити.',noneBtn:'Продовжити маршрут →'},
  en:{but:'but',strong:{lezen:'You read well',luisteren:'You understand spoken Dutch well',schrijven:'You write well'},
   slip:{omdat:'you often slip in sentences with omdat',perfectum:'the past tense (ben / heb + ge…) still trips you up',meervoud:'plural nouns still trip you up',vergelijking:'after a comparison you write «als» instead of «dan»',scheidbaar:'separable verbs still trip you up',werkwoorden:'you mix up verb forms',klinkers:'you mix up short and long vowels',spelling:'you make spelling mistakes',grammatica:'grammar exercises still trip you up'},
   slipPlan:'Today we practise this rule.',
   skill:{lezen:p=>'reading exercises are at '+p+'% right so far',luisteren:p=>'listening is at '+p+'% right so far',schrijven:p=>'dictation is at '+p+'% right so far'},
   skillPlan:{lezen:'Today we practise the topic words: read and pick the translation.',luisteren:'Today we listen to the topic words and pick the translation.',schrijven:'Today we write a short dictation.'},
   write:p=>'writing tasks average '+p+'% on the checklist',writePlan:'Today we write a short message.',
   due:n=>n+' words are due for review',duePlan:'Let’s review them now — it takes 2–3 minutes.',
   test:(t,b,n)=>'the test «'+t+'» is at '+b+' of '+n,testPlan:'Let’s take it again.',
   speak:n=>'you have spoken very little so far ('+n+' spoken answers)',speakPlan:'Today we say a few answers into the microphone.',
   go:{slip:'Practise the rule →',skill:'Start the exercise →',write:'Write →',due:'Review words →',test:'Take the test →',speak:'Speak →'},
   title:'Peter suggests',none:'All good so far. Keep following the route — I’ll tell you when something needs review.',noneBtn:'Continue the route →'},
  fr:{but:'mais',strong:{lezen:'Tu lis bien',luisteren:'Tu comprends bien à l’oral',schrijven:'Tu écris bien'},
   slip:{omdat:'tu te trompes souvent dans les phrases avec omdat',perfectum:'le passé composé (ben / heb + ge…) te pose encore problème',meervoud:'le pluriel des noms te pose encore problème',vergelijking:'après une comparaison tu écris « als » au lieu de « dan »',scheidbaar:'les verbes séparables te posent encore problème',werkwoorden:'tu confonds les formes des verbes',klinkers:'tu confonds voyelles courtes et longues',spelling:'tu fais des fautes d’orthographe',grammatica:'les exercices de grammaire te posent encore problème'},
   slipPlan:'Aujourd’hui, on travaille cette règle.',
   skill:{lezen:p=>'en lecture tu as '+p+' % de bonnes réponses',luisteren:p=>'à l’écoute tu as '+p+' % de bonnes réponses',schrijven:p=>'en dictée tu as '+p+' % de bonnes réponses'},
   skillPlan:{lezen:'Aujourd’hui, on lit les mots du thème et on choisit la traduction.',luisteren:'Aujourd’hui, on écoute les mots du thème et on choisit la traduction.',schrijven:'Aujourd’hui, on fait une courte dictée.'},
   write:p=>'tes écrits ont en moyenne '+p+' % sur la liste de contrôle',writePlan:'Aujourd’hui, on écrit un court message.',
   due:n=>n+' mots sont à réviser',duePlan:'Révisons-les maintenant : 2 à 3 minutes.',
   test:(t,b,n)=>'le test « '+t+' » est à '+b+' sur '+n,testPlan:'Refaisons-le.',
   speak:n=>'tu as encore peu parlé à voix haute ('+n+' réponses orales)',speakPlan:'Aujourd’hui, on dit quelques réponses au micro.',
   go:{slip:'Travailler la règle →',skill:'Commencer l’exercice →',write:'Écrire →',due:'Réviser les mots →',test:'Passer le test →',speak:'Parler →'},
   title:'Peter te conseille',none:'Tout va bien. Continue le parcours — je te dirai quand il faut réviser.',noneBtn:'Continuer le parcours →'},
  ar:{but:'لكن',strong:{lezen:'أنت تقرأ جيداً',luisteren:'أنت تفهم السماع جيداً',schrijven:'أنت تكتب جيداً'},
   slip:{omdat:'تخطئ كثيراً في الجمل مع omdat',perfectum:'الماضي التام (ben / heb + ge…) ما زال صعباً عليك',meervoud:'جمع الأسماء ما زال صعباً عليك',vergelijking:'بعد المقارنة تكتب «als» بدل «dan»',scheidbaar:'الأفعال المنفصلة ما زالت صعبة عليك',werkwoorden:'تخلط بين تصريفات الأفعال',klinkers:'تخلط بين الحروف المتحركة القصيرة والطويلة',spelling:'ترتكب أخطاء إملائية',grammatica:'تمارين القواعد ما زالت صعبة عليك'},
   slipPlan:'اليوم نتدرّب على هذه القاعدة.',
   skill:{lezen:p=>'نسبة إجاباتك الصحيحة في القراءة '+p+'%',luisteren:p=>'نسبة إجاباتك الصحيحة في السماع '+p+'%',schrijven:p=>'نسبة إجاباتك الصحيحة في الإملاء '+p+'%'},
   skillPlan:{lezen:'اليوم نقرأ كلمات الموضوع ونختار الترجمة.',luisteren:'اليوم نستمع إلى كلمات الموضوع ونختار الترجمة.',schrijven:'اليوم نكتب إملاءً قصيراً.'},
   write:p=>'متوسط مهام الكتابة '+p+'% حسب قائمة التحقق',writePlan:'اليوم نكتب رسالة قصيرة.',
   due:n=>n+' كلمات حان وقت مراجعتها',duePlan:'لنراجعها الآن، يكفي 2–3 دقائق.',
   test:(t,b,n)=>'اختبار «'+t+'» ما زال '+b+' من '+n,testPlan:'لنُعِده مرة أخرى.',
   speak:n=>'تحدثت بصوت عالٍ قليلاً حتى الآن ('+n+' إجابات شفهية)',speakPlan:'اليوم نقول بعض الإجابات في الميكروفون.',
   go:{slip:'تدرّب على القاعدة ←',skill:'ابدأ التمرين ←',write:'اكتب ←',due:'راجع الكلمات ←',test:'أجرِ الاختبار ←',speak:'تحدّث ←'},
   title:'بيتر ينصحك',none:'كل شيء جيد حتى الآن. تابع المسار، وسأخبرك عندما يحتاج شيء إلى مراجعة.',noneBtn:'تابع المسار ←'}};
 const tr=lang=>T[lang]||T.uk;
 const cap=(s,lang)=>lang==='ar'?s:s.charAt(0).toUpperCase()+s.slice(1);
 function why(r,lang){const t=tr(lang);return r.kind==='slip'?t.slip[r.tag]:r.kind==='skill'?t.skill[r.skill](r.pct):r.kind==='write'?t.write(r.pct):r.kind==='due'?t.due(r.n):r.kind==='test'?t.test(r.title,r.best,r.total):t.speak(r.n)}
 function plan(r,lang){const t=tr(lang);return r.kind==='slip'?t.slipPlan:r.kind==='skill'?t.skillPlan[r.skill]:r.kind==='write'?t.writePlan:r.kind==='due'?t.duePlan:r.kind==='test'?t.testPlan:t.speakPlan}
 // One sentence pair: "You read well, but you often slip in sentences with omdat. Today we practise this rule."
 function say(r,lang,strong){const t=tr(lang),w=why(r,lang);return (strong?t.strong[strong]+', '+t.but+' '+w:cap(w,lang))+'. '+plan(r,lang)}
 const label=(r,lang)=>tr(lang).go[r.kind];

 // ---- Wording of the progress screen (skills, daily goal)
 const UI={
  uk:{lessonDone:'✓ Урок завершено!',goalLeft:(m,g)=>'Мета дня: '+m+' з '+g+' хв. Урок зараховано — решту можна добрати пізніше.',goalMet:'🔥 Мета дня теж виконана.',skills:L=>'Навички · '+L,sk:{lezen:'📖 Читання (Lezen)',luisteren:'🎧 Аудіювання (Luisteren)',schrijven:'✍️ Письмо (Schrijven)',spreken:'🗣️ Говоріння (Spreken)'},
   right:(p,n)=>p+'% правильних · '+n+' '+ukN(n,'відповідь','відповіді','відповідей'),few:n=>'Ще мало даних: '+n+' з 10 відповідей',none:'Ще немає відповідей',exam:(L,p)=>'Іспит '+L+': '+p+'%',
   dict:(p,n)=>'Диктант: '+p+'% правильних · '+n,dictFew:n=>'Диктант: '+n+' з 5 спроб',tasks:(n,a)=>'Письмові завдання: '+n+' · середній бал перевірки '+a+'%',noTasks:'Письмових завдань ще немає',
   spoken:n=>'Усних відповідей у мікрофон: '+n,spExam:n=>'Питань усного іспиту відпрацьовано: '+n,
   note:'Відсотки рахуємо лише з відповідей, які застосунок перевіряє сам. Говоріння показуємо кількістю виконаних завдань: вимову застосунок не оцінює.',
   min:'хв',goalTitle:'Щоденна мета',goalHint:'Скільки хвилин навчатися щодня? Рахуємо лише час у вправах: коли сторінка відкрита без дій або ти в іншій вкладці, час не йде. Виконана мета додає день до серії 🔥.',
   goals:{5:'Коротко',10:'Звичайно',15:'Добре',20:'Серйозно',30:'Інтенсивно'},today:(m,g)=>'Сьогодні: '+m+' з '+g+' хв',best:n=>'найкраща серія: '+n,noLoss:'Пропущений день не забирає ні балів, ні нагород — просто почнеш нову серію.'},
  en:{lessonDone:'✓ Lesson complete!',goalLeft:(m,g)=>'Daily goal: '+m+' of '+g+' min. The lesson counts — you can do the rest later.',goalMet:'🔥 Your daily goal is reached too.',skills:L=>'Skills · '+L,sk:{lezen:'📖 Reading (Lezen)',luisteren:'🎧 Listening (Luisteren)',schrijven:'✍️ Writing (Schrijven)',spreken:'🗣️ Speaking (Spreken)'},
   right:(p,n)=>p+'% right · '+n+' answers',few:n=>'Not enough data yet: '+n+' of 10 answers',none:'No answers yet',exam:(L,p)=>'Exam '+L+': '+p+'%',
   dict:(p,n)=>'Dictation: '+p+'% right · '+n,dictFew:n=>'Dictation: '+n+' of 5 tries',tasks:(n,a)=>'Writing tasks: '+n+' · average checklist score '+a+'%',noTasks:'No writing tasks yet',
   spoken:n=>'Spoken answers into the microphone: '+n,spExam:n=>'Speaking exam questions practised: '+n,
   note:'Percentages only count answers the app checks itself. Speaking shows the number of tasks done: the app does not grade pronunciation.',
   min:'min',goalTitle:'Daily goal',goalHint:'How many minutes a day? Only time in exercises counts: an idle page or another tab does not. Reaching the goal adds a day to your streak 🔥.',
   goals:{5:'Short',10:'Regular',15:'Good',20:'Serious',30:'Intensive'},today:(m,g)=>'Today: '+m+' of '+g+' min',best:n=>'best streak: '+n,noLoss:'A missed day never takes points or rewards away — you simply start a new streak.'},
  fr:{lessonDone:'✓ Leçon terminée !',goalLeft:(m,g)=>'Objectif du jour : '+m+' sur '+g+' min. La leçon compte — tu peux faire le reste plus tard.',goalMet:'🔥 L’objectif du jour est atteint aussi.',skills:L=>'Compétences · '+L,sk:{lezen:'📖 Lecture (Lezen)',luisteren:'🎧 Écoute (Luisteren)',schrijven:'✍️ Écrit (Schrijven)',spreken:'🗣️ Oral (Spreken)'},
   right:(p,n)=>p+' % de bonnes réponses · '+n+' réponses',few:n=>'Pas encore assez de données : '+n+' réponses sur 10',none:'Pas encore de réponses',exam:(L,p)=>'Examen '+L+' : '+p+' %',
   dict:(p,n)=>'Dictée : '+p+' % justes · '+n,dictFew:n=>'Dictée : '+n+' essais sur 5',tasks:(n,a)=>'Écrits : '+n+' · score moyen de la liste '+a+' %',noTasks:'Pas encore d’écrits',
   spoken:n=>'Réponses orales au micro : '+n,spExam:n=>'Questions de l’oral travaillées : '+n,
   note:'Les pourcentages ne comptent que les réponses vérifiées par l’application. L’oral est compté en tâches faites : l’application n’évalue pas la prononciation.',
   min:'min',goalTitle:'Objectif du jour',goalHint:'Combien de minutes par jour ? Seul le temps dans les exercices compte : une page inactive ou un autre onglet ne comptent pas. L’objectif atteint ajoute un jour à ta série 🔥.',
   goals:{5:'Court',10:'Normal',15:'Bien',20:'Sérieux',30:'Intensif'},today:(m,g)=>'Aujourd’hui : '+m+' sur '+g+' min',best:n=>'meilleure série : '+n,noLoss:'Un jour manqué n’enlève ni points ni récompenses : tu commences simplement une nouvelle série.'},
  ar:{lessonDone:'✓ اكتمل الدرس!',goalLeft:(m,g)=>'هدف اليوم: '+m+' من '+g+' د. الدرس محسوب، ويمكنك إكمال الباقي لاحقاً.',goalMet:'🔥 تحقق هدف اليوم أيضاً.',skills:L=>'المهارات · '+L,sk:{lezen:'📖 القراءة (Lezen)',luisteren:'🎧 الاستماع (Luisteren)',schrijven:'✍️ الكتابة (Schrijven)',spreken:'🗣️ التحدث (Spreken)'},
   right:(p,n)=>p+'% صحيحة · '+n+' إجابة',few:n=>'لا توجد بيانات كافية بعد: '+n+' من 10 إجابات',none:'لا توجد إجابات بعد',exam:(L,p)=>'امتحان '+L+': '+p+'%',
   dict:(p,n)=>'الإملاء: '+p+'% صحيحة · '+n,dictFew:n=>'الإملاء: '+n+' من 5 محاولات',tasks:(n,a)=>'مهام الكتابة: '+n+' · متوسط قائمة التحقق '+a+'%',noTasks:'لا توجد مهام كتابة بعد',
   spoken:n=>'إجابات شفهية في الميكروفون: '+n,spExam:n=>'أسئلة الامتحان الشفهي التي تدرّبت عليها: '+n,
   note:'النسب تُحسب فقط من الإجابات التي يتحقق منها التطبيق بنفسه. التحدث يُعرض بعدد المهام المنجزة: التطبيق لا يقيّم النطق.',
   min:'د',goalTitle:'الهدف اليومي',goalHint:'كم دقيقة تتعلّم يومياً؟ نحسب فقط الوقت في التمارين: الصفحة المفتوحة دون نشاط أو تبويب آخر لا يُحسب. تحقيق الهدف يضيف يوماً إلى سلسلتك 🔥.',
   goals:{5:'قصير',10:'عادي',15:'جيد',20:'جادّ',30:'مكثّف'},today:(m,g)=>'اليوم: '+m+' من '+g+' د',best:n=>'أفضل سلسلة: '+n,noLoss:'اليوم الفائت لا يأخذ نقاطاً ولا مكافآت، فقط تبدأ سلسلة جديدة.'}};
 const ui=lang=>UI[lang]||UI.uk;

 globalThis.LerenInsights={DAY,IDLE,STEP,GOALS,GOAL_DEFAULT,MIN_ANSWERS,TAGS,day,dayNum,credit,cleanMinutes,addTime,minutesOn,goal,streakView,streakAdvance,
  cleanSkills,skillLog,spoke,summary,cleanSlips,slipLog,tagGram,tipTag,recommend,say,label,tr,ui,ukN};
})();
