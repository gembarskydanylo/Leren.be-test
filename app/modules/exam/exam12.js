/* Leren.be — final exam A1.2 (topics 1–16). Copy for the shared exam engine; texts and tasks are in exam12-data.js. */
(function(){
"use strict";
if(!window.LerenExam||!window.EXAM12_DATA)return;
const T={
 uk:{title:"🎓 Фінальний іспит A1.2",sub:"Перевір усі 16 тем A1.2 як на іспиті NT2: читання, аудіювання, письмо, говоріння, слова й граматика.",
  when:"Склади кожну частину щонайменше на 70%, потім пройди пробний іспит.",back:"← Іспит",toets:"← Тести",
  parts:{lezen:["📖","Lezen","Оголошення, лист зі школи, вакансія, аптека, лист подруги"],luisteren:["🎧","Luisteren","Вокзал, лікар, дзвінок зі школи, магазин, сусідка"],schrijven:["✍️","Schrijven","11 повідомлень і 2 анкети"],spreken:["🗣️","Spreken","6 тем: питання + твоя відповідь"],woorden:["📚","Woordenschat","Слова всіх 16 тем A1.2 (25 випадкових за раз)"],grammatica:["🧩","Grammatica","Perfectum, was/had, порівняння, hem/haar, want/omdat, наказ, gaan + інфінітив"],proef:["🏁","Proefexamen","Пробний іспит: читання, аудіювання, слова й граматика"]},
  q:"Питання",of:"з",next:"Далі",check:"Перевірити",right:"Правильно!",wrong:"Неправильно. Правильна відповідь:",
  listen:"🎧 Слухати",again:"🔁 Ще раз",showText:"Показати текст",hideText:"Сховати текст",readFirst:"Спершу прочитай питання, потім слухай.",
  done:"Готово!",score:(a,b)=>a+" з "+b+" правильно",repeat:"Повтори:",restart:"Пройти ще раз",best:"Найкраще",
  order:"Натискай слова по порядку",clear:"Очистити",
  wTask:"Завдання",wWrite:"Напиши тут…",wCheck:"Перевірити лист",wModel:"Показати зразок",wHideModel:"Сховати зразок",wTips:"Перевірка:",wSaved:"Чернетка зберігається на цьому пристрої.",
  sAsk:"🔊 Питання",sSpeak:"🎤 Відповісти",sShow:"Показати відповідь",sHeard:"Ти сказав:",sModel:"Зразок:",sOk:"✓ Вмію",sRe:"↺ Ще потренуватись",sTopic:"Тема",sDone:(a,b)=>a+" з "+b+" питань вже вмієш",
  ai:"🤖 AI-тренер",aiS:"Peter перевірить твій лист.",aiSpeak:"🗣️ Пробний іспит з говоріння",aiSpeakS:"Peter — твій вчитель: 6 тем по черзі, в кінці оцінка",aiAsk:"✍️ Перевірка листів і вправи",aiAskS:"Встав свій лист — Peter виправить. Або попроси вправу",wAi:"🤖 Перевірити з Peter",wAiEmpty:"Спершу напиши лист.",
  timer:"Час",proefInfo:"22 питання: читання, аудіювання, слова й граматика. Як на іспиті — без підказок до кінця."},
 en:{title:"🎓 Final exam A1.2",sub:"Check all 16 A1.2 topics like an NT2 exam: reading, listening, writing, speaking, words and grammar.",
  when:"Pass every part with at least 70%, then take the mock exam.",back:"← Exam",toets:"← Tests",
  parts:{lezen:["📖","Lezen","Advert, school letter, job advert, pharmacy, e-mail"],luisteren:["🎧","Luisteren","Station, doctor, call from school, shop, neighbour"],schrijven:["✍️","Schrijven","11 messages and 2 forms"],spreken:["🗣️","Spreken","6 topics: questions + your answer"],woorden:["📚","Woordenschat","Words of all 16 A1.2 topics (25 at a time)"],grammatica:["🧩","Grammatica","Perfect tense, was/had, comparison, hem/haar, want/omdat, imperative, gaan + infinitive"],proef:["🏁","Proefexamen","Mock exam: reading, listening, words and grammar"]},
  q:"Question",of:"of",next:"Next",check:"Check",right:"Correct!",wrong:"Not quite. The right answer:",
  listen:"🎧 Listen",again:"🔁 Again",showText:"Show text",hideText:"Hide text",readFirst:"Read the question first, then listen.",
  done:"Done!",score:(a,b)=>a+" of "+b+" correct",repeat:"Review:",restart:"Try again",best:"Best",
  order:"Tap the words in order",clear:"Clear",
  wTask:"Task",wWrite:"Write here…",wCheck:"Check my e-mail",wModel:"Show model",wHideModel:"Hide model",wTips:"Checklist:",wSaved:"Your draft is saved on this device.",
  sAsk:"🔊 Question",sSpeak:"🎤 Answer",sShow:"Show answer",sHeard:"You said:",sModel:"Model:",sOk:"✓ I can do it",sRe:"↺ Practise more",sTopic:"Topic",sDone:(a,b)=>a+" of "+b+" questions mastered",
  ai:"🤖 AI coach",aiS:"Peter checks your message.",aiSpeak:"🗣️ Mock speaking exam",aiSpeakS:"Peter is your teacher: 6 topics in turn, feedback at the end",aiAsk:"✍️ E-mail check & exercises",aiAskS:"Paste your e-mail and Peter corrects it, or ask for an exercise",wAi:"🤖 Check with Peter",wAiEmpty:"Write your e-mail first.",
  timer:"Time",proefInfo:"22 questions: reading, listening, words and grammar. Like the real exam — no hints until the end."},
 fr:{title:"🎓 Examen final A1.2",sub:"Vérifie les 16 thèmes A1.2 comme à un examen NT2 : lecture, écoute, écrit, oral, vocabulaire et grammaire.",when:"Réussis chaque partie avec au moins 70 %, puis passe l’examen blanc.",
  parts:{lezen:["📖","Lezen","Annonce, lettre de l’école, offre d’emploi, pharmacie, e-mail"],luisteren:["🎧","Luisteren","Gare, médecin, appel de l’école, magasin, voisine"],schrijven:["✍️","Schrijven","11 messages et 2 formulaires"],spreken:["🗣️","Spreken","6 thèmes : questions + ta réponse"],woorden:["📚","Woordenschat","Les mots des 16 thèmes A1.2 (25 à la fois)"],grammatica:["🧩","Grammatica","Passé composé, was/had, comparaison, hem/haar, want/omdat, impératif, gaan + infinitif"],proef:["🏁","Proefexamen","Examen blanc : lecture, écoute, vocabulaire et grammaire"]},
  aiS:"Peter vérifie ton message.",proefInfo:"22 questions : lecture, écoute, vocabulaire et grammaire. Comme à l’examen : pas d’indice avant la fin."},
 ar:{title:"🎓 الامتحان النهائي A1.2",sub:"راجع كل مواضيع A1.2 الـ16 كما في امتحان NT2: القراءة والاستماع والكتابة والتحدث والمفردات والقواعد.",when:"انجح في كل جزء بنسبة 70٪ على الأقل، ثم قدّم الامتحان التجريبي.",
  parts:{lezen:["📖","Lezen","إعلان، رسالة من المدرسة، عرض عمل، صيدلية، بريد إلكتروني"],luisteren:["🎧","Luisteren","المحطة، الطبيب، اتصال من المدرسة، المتجر، الجارة"],schrijven:["✍️","Schrijven","11 رسالة واستمارتان"],spreken:["🗣️","Spreken","6 مواضيع: أسئلة + جوابك"],woorden:["📚","Woordenschat","كلمات مواضيع A1.2 الـ16 (25 في كل مرة)"],grammatica:["🧩","Grammatica","الماضي التام، was/had، المقارنة، hem/haar، want/omdat، الأمر، gaan + المصدر"],proef:["🏁","Proefexamen","امتحان تجريبي: القراءة والاستماع والمفردات والقواعد"]},
  aiS:"بيتر يتحقق من رسالتك.",proefInfo:"22 سؤالاً: القراءة والاستماع والمفردات والقواعد. كما في الامتحان: بلا تلميحات حتى النهاية."}
};
const D=window.EXAM12_DATA;
// Words and phrases of every A1.2 lesson (the engine picks 25 at a time and keeps sentences apart from words).
const tabs=()=>{try{return LerenCurriculum.advanced.filter(c=>!(LerenCurriculum.a2Ids||[]).includes(c[0])).flatMap(c=>c[2])}catch(e){return []}};
window.EXAM12=LerenExam.make({KEY:"leren_exam12",T,...D,wordTabs:tabs(),focus:"exam12",examName:"examen A1.2",ai:null,proefGram:6,min:4,
 chips:L=>L==="uk"?["Перевір мій лист орендодавцю","Потренуй мене: perfectum з hebben чи zijn","5 речень з omdat про мій день","Як написати скаргу в магазин?"]:["Check my message to the landlord","Practise the perfect: hebben or zijn","5 sentences with omdat about my day","How do I write a complaint to a shop?"]});
})();
