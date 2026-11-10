/* One short, randomized Dutch invitation call during an active lesson visit. */
(() => {
 'use strict';
 const KEY='leren-mid-lesson-call-v1';
 const names=['Noor','Milan','Lotte','Sam','Mila','Jules','Emma','Luca'];
 const plans={
  'A1.1':[
   {nl:'Wil je morgen met mij fietsen?',uk:'Хочеш завтра покататися зі мною на велосипеді?',en:'Would you like to go cycling with me tomorrow?',fr:'Tu veux faire du vélo avec moi demain ?',ar:'هل تريد ركوب الدراجة معي غداً؟'},
   {nl:'Ga je morgen met mij zwemmen?',uk:'Підеш завтра зі мною плавати?',en:'Will you go swimming with me tomorrow?',fr:'Tu viens nager avec moi demain ?',ar:'هل ستذهب للسباحة معي غداً؟'},
   {nl:'Wil je morgen naar het park gaan?',uk:'Хочеш завтра піти до парку?',en:'Would you like to go to the park tomorrow?',fr:'Tu veux aller au parc demain ?',ar:'هل تريد الذهاب إلى الحديقة غداً؟'},
   {nl:'Ga je morgen naar het zwembad?',uk:'Підеш завтра до басейну?',en:'Are you going to the swimming pool tomorrow?',fr:'Tu vas à la piscine demain ?',ar:'هل ستذهب إلى المسبح غداً؟'}
  ],
  'A1.2':[
   {nl:'Heb je morgen zin om samen te gaan fietsen?',uk:'Хочеш завтра разом покататися на велосипеді?',en:'Do you feel like cycling together tomorrow?',fr:'Tu as envie de faire du vélo ensemble demain ?',ar:'هل ترغب في ركوب الدراجة معاً غداً؟'},
   {nl:'Zullen we morgen samen gaan zwemmen?',uk:'Може, завтра разом підемо плавати?',en:'Shall we go swimming together tomorrow?',fr:'On va nager ensemble demain ?',ar:'هل نذهب للسباحة معاً غداً؟'},
   {nl:'Heb je zin om morgen in het park te wandelen?',uk:'Хочеш завтра прогулятися в парку?',en:'Would you like to walk in the park tomorrow?',fr:'Tu as envie de te promener dans le parc demain ?',ar:'هل ترغب في المشي في الحديقة غداً؟'},
   {nl:'Zullen we morgen naar de markt gaan en daar iets drinken?',uk:'Може, завтра підемо на ринок і щось там вип’ємо?',en:'Shall we go to the market tomorrow and have a drink there?',fr:'On va au marché demain et on boit quelque chose là-bas ?',ar:'هل نذهب إلى السوق غداً ونشرب شيئاً هناك؟'}
  ],
  A2:[
   {nl:'Als het morgen mooi weer is, zullen we dan gaan fietsen?',uk:'Якщо завтра буде гарна погода, поїдемо на велосипеді?',en:'If the weather is nice tomorrow, shall we go cycling?',fr:'S’il fait beau demain, on fait du vélo ?',ar:'إذا كان الطقس جميلاً غداً، هل نذهب لركوب الدراجة؟'},
   {nl:'Zullen we morgen eerst zwemmen en daarna iets gaan drinken?',uk:'Може, завтра спочатку поплаваємо, а потім щось вип’ємо?',en:'Shall we go swimming first tomorrow and then get a drink?',fr:'On va d’abord nager demain, puis prendre un verre ?',ar:'هل نسبح أولاً غداً ثم نشرب شيئاً؟'},
   {nl:'Ik dacht eraan om morgen naar het park te gaan. Ga je mee?',uk:'Я думав піти завтра до парку. Підеш зі мною?',en:'I was thinking of going to the park tomorrow. Would you come along?',fr:'Je pensais aller au parc demain. Tu viens avec moi ?',ar:'كنت أفكر في الذهاب إلى الحديقة غداً. هل تأتي معي؟'},
   {nl:'Heb je morgen tijd voor een lange fietstocht?',uk:'Маєш завтра час на довгу велопрогулянку?',en:'Do you have time for a long bike ride tomorrow?',fr:'Tu as du temps demain pour une longue balade à vélo ?',ar:'هل لديك وقت غداً لجولة طويلة بالدراجة؟'}
  ]
 };
 const answers=[
  {kind:'yes',nl:['Ja, leuk! Hoe laat spreken we af?','Ja, graag. Ik heb morgen tijd.','Leuk idee! Ik ga graag mee.'],uk:['Так, клас! О котрій зустрінемося?','Так, із задоволенням. Я завтра маю час.','Чудова ідея! Я охоче піду з тобою.'],en:['Yes, great! What time shall we meet?','Yes, I’d love to. I have time tomorrow.','Great idea! I’d like to come.'],fr:['Oui, super ! À quelle heure se retrouve-t-on ?','Oui, avec plaisir. Je suis libre demain.','Bonne idée ! Je viens avec plaisir.'],ar:['نعم، رائع! في أي ساعة نلتقي؟','نعم، بكل سرور. لدي وقت غداً.','فكرة رائعة! يسعدني أن آتي.'],reply:['Leuk! Zullen we om tien uur afspreken?','Top! Ik stuur je straks een berichtje.'],replyUk:['Чудово! Зустріньмося о десятій?','Супер! Я трохи пізніше напишу тобі.'],replyEn:['Great! Shall we meet at ten?','Awesome! I’ll message you later.'],replyFr:['Super ! On se retrouve à dix heures ?','Génial ! Je t’envoie un message plus tard.'],replyAr:['رائع! هل نلتقي الساعة العاشرة؟','ممتاز! سأرسل لك رسالة لاحقاً.']},
  {kind:'no',nl:['Sorry, morgen kan ik niet.','Helaas, ik moet morgen werken.','Morgen lukt niet. Misschien een andere dag?'],uk:['Вибач, завтра я не можу.','На жаль, завтра я маю працювати.','Завтра не вийде. Може, іншого дня?'],en:['Sorry, I can’t tomorrow.','Unfortunately, I have to work tomorrow.','Tomorrow won’t work. Maybe another day?'],fr:['Désolé(e), je ne peux pas demain.','Dommage, je dois travailler demain.','Pas possible demain. Un autre jour ?'],ar:['آسف، لا أستطيع غداً.','للأسف، يجب أن أعمل غداً.','لا أستطيع غداً. ربما يوماً آخر؟'],reply:['Jammer! Misschien volgende week.','Geen probleem. We spreken snel af!'],replyUk:['Шкода! Може, наступного тижня.','Нічого страшного. Домовимося іншим разом!'],replyEn:['Too bad! Maybe next week.','No worries. We’ll make plans another time!'],replyFr:['Dommage ! Peut-être la semaine prochaine.','Pas de souci. On s’organisera une autre fois !'],replyAr:['للأسف! ربما الأسبوع القادم.','لا بأس. سنرتب موعداً آخر!']},
  {kind:'maybe',nl:['Misschien! Hoe laat wil je gaan?','Ik weet het nog niet. Ik laat het je vanavond weten.','Dat klinkt leuk. Waar spreken we af?'],uk:['Можливо! О котрій ти хочеш піти?','Я ще не знаю. Напишу тобі ввечері.','Звучить чудово. Де зустрінемося?'],en:['Maybe! What time do you want to go?','I’m not sure yet. I’ll let you know tonight.','That sounds fun. Where shall we meet?'],fr:['Peut-être ! À quelle heure veux-tu y aller ?','Je ne sais pas encore. Je te le dirai ce soir.','Ça a l’air sympa. Où se retrouve-t-on ?'],ar:['ربما! في أي ساعة تريد الذهاب؟','لا أعرف بعد. سأخبرك هذا المساء.','هذا يبدو جميلاً. أين نلتقي؟'],reply:['Dat is goed. Laat het maar weten!','We spreken af bij het station.'],replyUk:['Добре, дай знати!','Зустріньмося біля вокзалу.'],replyEn:['That’s fine. Let me know!','Let’s meet by the station.'],replyFr:['D’accord. Tiens-moi au courant !','Retrouvons-nous près de la gare.'],replyAr:['حسناً، أخبرني!','لنلتقِ قرب المحطة.']}
 ];
 const labels={
  uk:{incoming:'Вхідний дзвінок',friend:'Друг телефонує',answer:'Що відповіси?',your:'Твоя відповідь',their:'Друг',close:'Повернутися до уроку',speak:'Прослухати фразу',picked:'Гарна мовна практика!'},
  en:{incoming:'Incoming call',friend:'Your friend is calling',answer:'What will you say?',your:'You said',their:'Your friend',close:'Back to the lesson',speak:'Listen to the phrase',picked:'Nice language practice!'},
  fr:{incoming:'Appel entrant',friend:'Ton ami t’appelle',answer:'Que réponds-tu ?',your:'Ta réponse',their:'Ton ami',close:'Retour à la leçon',speak:'Écouter la phrase',picked:'Bonne pratique !'},
  ar:{incoming:'مكالمة واردة',friend:'صديقك يتصل بك',answer:'ماذا ستقول؟',your:'إجابتك',their:'صديقك',close:'العودة إلى الدرس',speak:'استمع إلى العبارة',picked:'تدريب لغوي رائع!'}
 };
 const pick=a=>a[Math.floor(Math.random()*a.length)];
 function create(config){
  let data={};try{data=JSON.parse(sessionStorage.getItem(KEY)||'{}')||{}}catch{}
  let elapsed=Number.isFinite(data.elapsed)?Math.max(0,data.elapsed):0;
  const target=Number.isFinite(data.target)?data.target:180000+Math.floor(Math.random()*60000);
  let shown=data.shown===true,opened=false,scenario=null,chosen=null,interval=null,returnFocus=null;
  let last=Date.now(),overlay=null;
  const language=()=>labels[config.language?.()]?config.language(): 'uk';
  const make=(tag,cls,text)=>{const e=document.createElement(tag);if(cls)e.className=cls;if(text!=null)e.textContent=text;return e};
  const save=()=>{try{sessionStorage.setItem(KEY,JSON.stringify({elapsed,target,shown}))}catch{}};
  function close(){if(!opened)return;opened=false;overlay?.remove();overlay=null;returnFocus?.focus?.({preventScroll:true});returnFocus=null}
  function onKeyDown(event){if(!opened)return;if(event.key==='Escape'){event.preventDefault();close();return}if(event.key==='Tab'){const card=overlay?.querySelector('.midcall-card'),items=[...(card?.querySelectorAll('button:not(:disabled)')||[])];if(!items.length)return;const first=items[0],lastItem=items[items.length-1];if(event.shiftKey&&document.activeElement===first){event.preventDefault();lastItem.focus()}else if(!event.shiftKey&&document.activeElement===lastItem){event.preventDefault();first.focus()}}}
  function say(text){if(text&&config.speak)config.speak(text)}
  function render(){
   overlay?.remove();overlay=null;if(!opened)return;
   const lang=language(),copy=labels[lang],shade=make('div','midcall-shade');shade.id='midLessonCall';
   const card=make('section','midcall-card');card.setAttribute('role','dialog');card.setAttribute('aria-modal','true');card.setAttribute('aria-labelledby','midcallTitle');
   const top=make('div','midcall-top');top.append(make('span','midcall-live','● '+copy.incoming));
   const dismiss=make('button','midcall-dismiss','×');dismiss.type='button';dismiss.setAttribute('aria-label',copy.close);dismiss.onclick=close;top.appendChild(dismiss);card.appendChild(top);
   const avatar=make('div','midcall-avatar',scenario.name.slice(0,1));avatar.setAttribute('aria-hidden','true');
   const icon=make('span','midcall-phone','☎');icon.setAttribute('aria-hidden','true');avatar.appendChild(icon);card.appendChild(avatar);
   const heading=make('h2','',scenario.name);heading.id='midcallTitle';card.append(heading,make('p','midcall-subtitle',copy.friend));
   const prompt=make('div','midcall-prompt');const nl=make('p','midcall-dutch',scenario.plan.nl);nl.lang='nl';prompt.append(nl,make('p','midcall-translation',scenario.plan[lang]||scenario.plan.uk));const listen=make('button','midcall-listen',copy.speak);listen.type='button';listen.onclick=()=>say(scenario.plan.nl);prompt.appendChild(listen);card.appendChild(prompt);
   if(!chosen){
    card.appendChild(make('h3','',copy.answer));const options=make('div','midcall-options');
    scenario.choices.forEach(choice=>{const b=make('button','midcall-choice');b.type='button';const text=make('strong','midcall-dutch',choice.nl);text.lang='nl';b.append(text,make('span','midcall-translation',choice[lang]||choice.uk));b.onclick=()=>{chosen=choice;render()};options.appendChild(b)});
    card.appendChild(options);
   }else{
    const result=make('div','midcall-result');result.appendChild(make('strong','',copy.picked));
    const you=make('div','midcall-line');you.append(make('span','midcall-label',copy.your));const said=make('p','midcall-dutch',chosen.nl);said.lang='nl';you.append(said,make('p','midcall-translation',chosen[lang]||chosen.uk));result.appendChild(you);
    const friend=make('div','midcall-line');friend.append(make('span','midcall-label',copy.their));const reply=make('p','midcall-dutch',chosen.replyText);reply.lang='nl';friend.append(reply,make('p','midcall-translation',chosen.replyTranslation));result.appendChild(friend);
    const sayBack=make('button','midcall-listen',copy.speak);sayBack.type='button';sayBack.onclick=()=>say(chosen.nl);result.appendChild(sayBack);
    const back=make('button','midcall-back',copy.close);back.type='button';back.onclick=close;result.appendChild(back);card.appendChild(result);
   }
   shade.appendChild(card);document.body.appendChild(shade);overlay=shade;
   (card.querySelector('button')||card).focus?.({preventScroll:true});
  }
  function start(){
   if(shown||opened||!config.eligible?.()||!config.boundary?.())return;
   const level=config.level?.(),plan=pick(plans[level]||plans['A1.1']),name=pick(names),choices=answers.map(group=>{const i=Math.floor(Math.random()*group.nl.length);return {kind:group.kind,nl:group.nl[i],uk:group.uk[i],en:group.en[i],fr:group.fr[i],ar:group.ar[i],replyText:pick(group.reply),replyTranslation:''}});
   choices.forEach(choice=>{const group=answers.find(x=>x.kind===choice.kind),i=group.reply.indexOf(choice.replyText);choice.replyTranslation=(group['reply'+language().toUpperCase()]||group.replyUk)[i]});
   scenario={name,plan,choices:choices.sort(()=>Math.random()-.5)};shown=true;opened=true;returnFocus=document.activeElement;save();render();
  }
  function tick(){
   const now=Date.now(),delta=Math.max(0,Math.min(now-last,5000));last=now;
   if(!shown&&config.active?.()&&!document.hidden){elapsed+=delta;save();if(elapsed>=target)start()}
  }
  document.addEventListener('keydown',onKeyDown);interval=setInterval(tick,1000);
  return {close,destroy(){clearInterval(interval);document.removeEventListener('keydown',onKeyDown);close()}};
 }
 globalThis.LerenMidLessonCall={create};
})();