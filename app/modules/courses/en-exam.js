/* English 1.1 final exam (internal practice exam of lerenbe.com — NOT an official CEFR or Cambridge certificate).
   Built on the 180 cards and the A1 topics of English 1.1: Reading (short message, notice, form), Listening (the device
   voice reads; options are times, prices, arrows or replies), Writing (word order, gaps, own answers, translation),
   Speaking (practice only: the learner answers aloud, then compares with a model — not scored, because pronunciation
   cannot be checked reliably in the browser). Every scored item has an explanation in uk / en / fr / ar. */
(() => {
 'use strict';
 const X=(uk,en,fr,ar)=>({uk,en,fr,ar});
 const reading=[
  {text:{title:'💬 A message',body:"Hi Olena! I'm at the station. The train is late, sorry! See you at half past six at the bus stop. Taras"},items:[
   {id:'r1',q:'Where is Taras now?',options:['at the station','at the bus stop','at home'],answer:0,why:X('«I’m at the station» — він зараз на вокзалі. На зупинці вони зустрінуться пізніше.','“I’m at the station” — he is at the station now; they meet at the bus stop later.','« I’m at the station » : il est à la gare ; ils se retrouvent à l’arrêt de bus plus tard.','«I’m at the station»: هو الآن في المحطة، وسيلتقيان عند موقف الحافلة لاحقًا.')},
   {id:'r2',q:'What is the problem?',options:['The train is late.','The bus is full.','Taras is ill.'],answer:0,why:X('«The train is late» — потяг запізнюється.','“The train is late.”','« The train is late » : le train est en retard.','«The train is late»: القطار متأخر.')},
   {id:'r3',q:'When do they meet?',options:['6:30','6:15','7:30'],answer:0,why:X('Half past six = 6:30 (пів на сьому).','Half past six = 6:30.','Half past six = 6 h 30.','half past six = 6:30.')}]},
  {text:{title:'📌 A notice',body:'CITY LIBRARY\nMonday – Friday: 9 am – 6 pm\nSaturday: 10 am – 1 pm\nSunday: closed\nFree Wi-Fi. Please be quiet.'},items:[
   {id:'r4',q:'Is the library open on Sunday?',options:['No, it’s closed.','Yes, 10 am – 1 pm.','Yes, 9 am – 6 pm.'],answer:0,why:X('«Sunday: closed» — у неділю зачинено.','“Sunday: closed.”','« Sunday: closed » : fermé le dimanche.','«Sunday: closed»: مغلقة يوم الأحد.')},
   {id:'r5',q:'What time does it close on Saturday?',options:['1 pm','6 pm','10 am'],answer:0,why:X('Saturday: 10 am – 1 pm → зачиняється о 13:00 (1 pm).','Saturday: 10 am – 1 pm, so it closes at 1 pm.','Samedi : 10 h – 13 h, donc fermeture à 13 h (1 pm).','السبت: 10 صباحًا – 1 ظهرًا، أي تُغلق الساعة 1 ظهرًا.')},
   {id:'r6',q:'What is free?',options:['the Wi-Fi','the coffee','the books to keep'],answer:0,why:X('«Free Wi-Fi» — безкоштовний вайфай.','“Free Wi-Fi.”','« Free Wi-Fi » : le Wi-Fi est gratuit.','«Free Wi-Fi»: الواي فاي مجاني.')}]},
  {text:{title:'🪪 A form',body:'First name: Anna\nSurname: Kovalenko\nNationality: Ukrainian\nAddress: 12 Park Street, Ghent\nMarried: yes\nChildren: two (a son and a daughter)'},items:[
   {id:'r7',q:'What is her surname?',options:['Kovalenko','Anna','Park'],answer:0,why:X('Surname — прізвище: Kovalenko. Anna — це ім’я (first name).','Surname = family name: Kovalenko. Anna is her first name.','Surname = nom de famille : Kovalenko. Anna est le prénom.','surname هو اسم العائلة: Kovalenko، أما Anna فهو الاسم الأول.')},
   {id:'r8',q:'Where does she live?',options:['in Ghent','in Kyiv','in Brussels'],answer:0,why:X('Address: 12 Park Street, Ghent → вона живе в Генті.','Her address is in Ghent.','Son adresse est à Gand (Ghent).','عنوانها في غنت (Ghent).')},
   {id:'r9',q:'How many children has she got?',options:['two','one','none'],answer:0,why:X('Children: two (a son and a daughter) — двоє дітей.','Children: two — a son and a daughter.','Children: two — un fils et une fille.','Children: two — ابن وابنة.')}]}
 ];
 const listening=[
  {id:'l1',say:"It's quarter past six.",q:'What time is it?',options:['6:15','6:45','5:45'],answer:0,why:X('Quarter past six = чверть на сьому, 6:15. Quarter to seven було б 6:45.','Quarter past six = 6:15 (quarter to seven would be 6:45).','Quarter past six = 6 h 15 (quarter to seven = 6 h 45).','quarter past six = 6:15، أما quarter to seven فهي 6:45.')},
  {id:'l2',say:'The rent is eight hundred euros a month.',q:'How much is the rent?',options:['€800','€80','€18'],answer:0,why:X('Eight hundred = 800 (eighty = 80, eighteen = 18).','Eight hundred = 800 (eighty = 80, eighteen = 18).','Eight hundred = 800 (eighty = 80, eighteen = 18).','eight hundred = 800 (eighty = 80، eighteen = 18).')},
  {id:'l3',say:'My son is fifteen.',q:'How old is the son?',options:['15','50','5'],answer:0,why:X('Fifteen = 15. Наголос у -teen падає на кінець: fif-TEEN; fifty = 50: FIF-ty.','Fifteen = 15: the stress is at the end, fif-TEEN; fifty = 50 is FIF-ty.','Fifteen = 15 : accent à la fin, fif-TEEN ; fifty = 50 : FIF-ty.','fifteen = 15 والنبر في آخرها fif-TEEN، أما fifty = 50 فتُنطق FIF-ty.')},
  {id:'l4',say:'Turn left, then go straight on.',q:'Which way?',options:['← then ↑','→ then ↑','↑ then ←'],answer:0,why:X('Turn left — ліворуч (←), then go straight on — потім прямо (↑).','Turn left (←), then go straight on (↑).','Turn left = à gauche (←), then go straight on = tout droit (↑).','Turn left يسارًا (←) ثم go straight on مباشرة (↑).')},
  {id:'l5',say:'How are you?',q:'Choose the best reply.',options:["I'm fine, thank you.",'My name is Olena.',"It's nine o'clock."],answer:0,why:X('На «How are you?» (Як справи?) відповідають «I’m fine, thank you».','“How are you?” — “I’m fine, thank you.”','« How are you? » (Comment ça va ?) → « I’m fine, thank you ».','على «How are you?» نجيب «I’m fine, thank you».')},
  {id:'l6',say:'Where are you from?',q:'Choose the best reply.',options:["I'm from Ukraine.",'I live in a flat.','By bus.'],answer:0,why:X('Where are you from? — звідки ти родом → I’m from Ukraine.','Where are you from? asks about your country: I’m from Ukraine.','Where are you from? (d’où viens-tu ?) → I’m from Ukraine.','Where are you from? سؤال عن البلد: I’m from Ukraine.')},
  {id:'l7',say:'Can I pay by card?',q:'Choose the best reply.',options:['Yes, of course.',"It's closed.",'Turn right.'],answer:0,why:X('Can I pay by card? — чи можна карткою → Yes, of course (так, звісно).','A yes/no question: Yes, of course.','Question oui/non : Yes, of course (oui, bien sûr).','سؤال بنعم أو لا: Yes, of course (نعم، بالطبع).')},
  {id:'l8',say:'What day is it today?',q:'Choose the best reply.',options:["It's Monday.","It's nine o'clock.","I'm thirty."],answer:0,why:X('What day — який день тижня → It’s Monday. Час — це What time.','“What day…?” asks for the day: It’s Monday. “What time…?” would ask for the time.','« What day… ? » demande le jour : It’s Monday (l’heure = What time).','«What day…?» تسأل عن اليوم: It’s Monday، أما الوقت فهو What time.')}
 ];
 // Writing. order: tiles to put in order (the answer is the joined sentence). type: free short answer; accept = patterns.
 const writing=[
  {id:'w1',kind:'order',tiles:['My','name','is','Olena.'],answer:'My name is Olena.',why:X('Порядок: підмет (My name) + is + ім’я.','Subject (My name) + is + the name.','Sujet (My name) + is + le prénom.','الترتيب: الفاعل (My name) + is + الاسم.')},
  {id:'w2',kind:'order',tiles:['Where','do','you','live?'],answer:'Where do you live?',why:X('Питання з do: Where + do + you + дієслово.','Questions with do: Where + do + you + verb.','Question avec do : Where + do + you + verbe.','السؤال مع do: Where + do + you + الفعل.')},
  {id:'w3',kind:'order',tiles:['There','are','two','bedrooms.'],answer:'There are two bedrooms.',why:X('There are + кілька предметів (two bedrooms).','There are + more than one thing (two bedrooms).','There are + plusieurs choses (two bedrooms).','There are + أكثر من شيء (two bedrooms).')},
  {id:'w4',kind:'order',tiles:['I’d','like','a','coffee,','please.'],answer:'I’d like a coffee, please.',why:X('Ввічливе прохання: I’d like + річ + please.','Polite request: I’d like + thing + please.','Demande polie : I’d like + chose + please.','طلب مهذب: I’d like + الشيء + please.')},
  {id:'w5',kind:'type',prompt:X('Дай відповідь англійською: «What’s your name?»','Answer in English: “What’s your name?”','Réponds en anglais : « What’s your name? »','أجب بالإنجليزية: «What’s your name?»'),accept:['^(my name is|i am|i\'m) [a-zа-яіїєґ\'’ -]{2,30}$'],model:'My name is Olena.',why:X('Починай з «My name is…» або «I’m…» і своє ім’я.','Start with “My name is…” or “I’m…” and your name.','Commence par « My name is… » ou « I’m… » et ton prénom.','ابدأ بـ «My name is…» أو «I’m…» ثم اسمك.')},
  {id:'w6',kind:'type',prompt:X('Встав пропущене слово: «I ___ from Ukraine.»','Fill in the gap: “I ___ from Ukraine.”','Complète : « I ___ from Ukraine. »','أكمل الفراغ: «I ___ from Ukraine.»'),accept:['^(am|\'m)$','^i (am|\'m) from ukraine$'],model:'am',why:X('Дієслово to be з I — am: I am (I’m) from Ukraine.','The verb to be with I is am: I am (I’m) from Ukraine.','Le verbe to be avec I : am → I am (I’m) from Ukraine.','الفعل to be مع I هو am: I am (I’m) from Ukraine.')},
  {id:'w7',kind:'type',prompt:X('Напиши англійською: «У мене двоє дітей.»','Write in English: “I have two children.” (use have or have got)','Écris en anglais : « J’ai deux enfants. »','اكتب بالإنجليزية: «لديّ طفلان.»'),accept:['^i (have|have got|\'ve got) two children$'],model:'I have two children.',why:X('I have / I’ve got + two children. Діти — children (а не childs).','I have / I’ve got + two children (not “childs”).','I have / I’ve got + two children (pas « childs »).','I have / I’ve got + two children، وجمع child هو children.')},
  {id:'w8',kind:'type',prompt:X('Напиши англійською: «Скільки це коштує?»','Ask in English how much it costs (one thing).','Écris en anglais : « Combien ça coûte ? »','اكتب بالإنجليزية: «كم سعره؟»'),accept:['^how much is (it|this|that)$','^how much does (it|this|that) cost$'],model:'How much is it?',why:X('Ціна однієї речі: How much is it? (або How much does it cost?).','For one thing: How much is it? (or How much does it cost?).','Pour une chose : How much is it? (ou How much does it cost?).','لشيء واحد: How much is it? (أو How much does it cost?).')}
 ];
 const speaking=[
  {id:'s1',say:"What's your name?",model:'My name is Olena.'},
  {id:'s2',say:'Where are you from?',model:"I'm from Ukraine."},
  {id:'s3',say:'Where do you live?',model:'I live in Ghent.'},
  {id:'s4',say:'Have you got children?',model:"Yes, I have two children. / No, I haven't."},
  {id:'s5',say:'How do you get to work?',model:'By bus. / By bike. / On foot.'}
 ];
 // Short answers: lower case, one kind of apostrophe, no end punctuation, contractions written out.
 const CONTR=[["i'm","i am"],["i've","i have"],["what's","what is"],["it's","it is"],["i'd","i would"],["there's","there is"],["don't","do not"],["haven't","have not"]];
 function normalize(s){
  let t=String(s||'').toLowerCase().replace(/[’‘`´]/g,"'").replace(/[.!?,;:"«»“”]/g,' ').replace(/\s+/g,' ').trim();
  return t;
 }
 const expand=t=>CONTR.reduce((x,[a,b])=>x.split(a).join(b),t);
 function check(item,answer){
  const raw=normalize(answer);if(!raw)return false;
  if(item.kind==='order')return expand(raw)===expand(normalize(item.answer));
  return item.accept.some(p=>{const re=new RegExp(p,'u');return re.test(raw)||re.test(expand(raw))});
 }
 globalThis.LerenCourseExams=Object.assign(globalThis.LerenCourseExams||{},{en11:{id:'en11',lang:'en',level:'1.1',minutes:20,passPct:70,reading,listening,writing,speaking,check,normalize}});
})();
