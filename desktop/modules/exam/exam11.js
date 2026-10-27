/* Leren.be — exam preparation "1.1 test deel 8 → 11" (CVO course chapters 8–11).
 * Parts follow the teacher's exam sheet: Lezen, Luisteren, Schrijven, Spreken, Woordenschat, Grammatica + a mock exam.
 * Uses the app's globals (el, $, tgt, say, listenOnce, toast, addXP, lsGet, lsSet, shuffle, uiLang). */
(function(){
"use strict";
const KEY="leren_exam11";
const L=()=>uiLang==="uk"?"uk":"en";
const T={
 uk:{title:"🎓 Іспит 1.1 · deel 8 → 11",sub:"Підготовка точно за листком вчителя: читання, слухання, письмо, говоріння, слова й граматика.",
  when:"Чт 29.10 — Lezen · Schrijven · Luisteren\nПт 30.10 — Spreken",back:"← Іспит",toets:"← Toets",
  parts:{lezen:["📖","Lezen","Запрошення, чат, інформація на ліках"],luisteren:["🎧","Luisteren","Запрошення й діалог у лікаря"],schrijven:["✍️","Schrijven","3 листи: мій день, відповідь на запрошення, мої страви"],spreken:["🗣️","Spreken","6 тем: питання вчителя + твоя відповідь"],woorden:["📚","Woordenschat","Усі слова розділів 8–11 (25 випадкових за раз)"],grammatica:["🧩","Grammatica","Inversie, niet/geen, omdat, moeten, meer/minder"],meervoud:["🔢","Meervoud","Множина: +en, +s, ’s, raam → ramen (з уроку 26.10)"],omdat:["❓","Waarom? Omdat …","Відповідай «Omdat …» — дієслово в кінці (з уроку 26.10)"],proef:["🏁","Proefexamen","Великий пробний тест: половина всього"]},
  q:"Питання",of:"з",next:"Далі",check:"Перевірити",right:"Правильно!",wrong:"Неправильно. Правильна відповідь:",
  listen:"▶ Слухати",again:"🔁 Ще раз",showText:"Показати текст",hideText:"Сховати текст",readFirst:"Спершу прочитай питання, потім слухай.",
  done:"Готово!",score:(a,b)=>a+" з "+b+" правильно",repeat:"Повтори:",restart:"Пройти ще раз",best:"Найкраще",
  order:"Натискай слова по порядку",clear:"Очистити",
  wTask:"Завдання",wWrite:"Напиши лист тут…",wCheck:"Перевірити лист",wModel:"Показати зразок",wHideModel:"Сховати зразок",wTips:"Перевірка:",wSaved:"Чернетка зберігається на цьому пристрої.",
  sAsk:"🔊 Питання",sSpeak:"🎤 Відповісти",sShow:"Показати відповідь",sHeard:"Ти сказав:",sModel:"Зразок:",sOk:"✓ Вмію",sRe:"↺ Ще потренуватись",sTopic:"Тема",sDone:(a,b)=>a+" з "+b+" питань вже вмієш",
  ai:"🤖 AI-тренер",aiS:"Peter знає весь листок до іспиту й тренує тебе за ним.",aiSpeak:"🗣️ Пробний іспит з говоріння",aiSpeakS:"Peter — твій вчитель: 6 тем по черзі, в кінці оцінка",aiAsk:"✍️ Перевірка листів і вправи",aiAskS:"Встав свій лист — Peter виправить. Або попроси вправу",wAi:"🤖 Перевірити з Peter",wAiEmpty:"Спершу напиши лист.",
  timer:"Час",proefInfo:"22 питання: читання, слухання, слова й граматика. Як на іспиті — без підказок до кінця."},
 en:{title:"🎓 Exam 1.1 · part 8 → 11",sub:"Preparation that follows the teacher's exam sheet: reading, listening, writing, speaking, words and grammar.",
  when:"Thu 29.10 — Reading · Writing · Listening\nFri 30.10 — Speaking",back:"← Exam",toets:"← Tests",
  parts:{lezen:["📖","Lezen","Invitation, chat, medicine label"],luisteren:["🎧","Luisteren","Invitation and doctor dialogue"],schrijven:["✍️","Schrijven","3 e-mails: my day, reply to an invitation, my meals"],spreken:["🗣️","Spreken","6 topics: teacher's questions + your answer"],woorden:["📚","Woordenschat","Words of chapters 8–11"],grammatica:["🧩","Grammatica","Inversion, niet/geen, omdat, moeten, meer/minder"],meervoud:["🔢","Meervoud","Plurals: +en, +s, ’s, raam → ramen"],omdat:["❓","Waarom? Omdat …","Answer with «Omdat …» — verb at the end"],proef:["🏁","Proefexamen","Big mock test: half of everything"]},
  q:"Question",of:"of",next:"Next",check:"Check",right:"Correct!",wrong:"Not quite. The right answer:",
  listen:"▶ Listen",again:"🔁 Again",showText:"Show text",hideText:"Hide text",readFirst:"Read the question first, then listen.",
  done:"Done!",score:(a,b)=>a+" of "+b+" correct",repeat:"Review:",restart:"Try again",best:"Best",
  order:"Tap the words in order",clear:"Clear",
  wTask:"Task",wWrite:"Write your e-mail here…",wCheck:"Check my e-mail",wModel:"Show model",wHideModel:"Hide model",wTips:"Checklist:",wSaved:"Your draft is saved on this device.",
  sAsk:"🔊 Question",sSpeak:"🎤 Answer",sShow:"Show answer",sHeard:"You said:",sModel:"Model:",sOk:"✓ I can do it",sRe:"↺ Practise more",sTopic:"Topic",sDone:(a,b)=>a+" of "+b+" questions mastered",
  ai:"🤖 AI coach",aiS:"Peter knows the whole exam sheet and practises it with you.",aiSpeak:"🗣️ Mock speaking exam",aiSpeakS:"Peter is your teacher: 6 topics in turn, feedback at the end",aiAsk:"✍️ E-mail check & exercises",aiAskS:"Paste your e-mail and Peter corrects it, or ask for an exercise",wAi:"🤖 Check with Peter",wAiEmpty:"Write your e-mail first.",
  timer:"Time",proefInfo:"22 questions: reading, listening, words and grammar. Like the real exam — no hints until the end."}
};
const U=()=>T[L()];
const tr=x=>typeof x==="string"?x:(x[L()]||x.uk||x.en||"");

// ---------------- DATA ----------------
const TEXTS={
 karim:{title:"Een uitnodiging",body:"Hoera, ik word 40!\nKom je naar mijn feest? Het feest is op zaterdag 14 juni van 19 tot 23 uur in Café De Zwaan, Kerkstraat 12 in Mechelen. Er is eten en muziek. Neem gerust je partner mee!\nLaat het weten vóór 1 juni via sms: 0470 12 34 56.\nGroetjes, Karim",uk:"Ура, мені 40!\nПрийдеш на моє свято? Свято в суботу, 14 червня, з 19:00 до 23:00 у кафе «De Zwaan», Kerkstraat 12, у Мехелені. Буде їжа й музика. Приходь разом зі своїм партнером!\nДай знати до 1 червня смс-кою: 0470 12 34 56.\nБувай, Карім"},
 sofie:{title:"Een uitnodiging",body:"Sofie en Jonas gaan trouwen!\nJullie zijn uitgenodigd op vrijdag 20 juni om 11 uur aan het stadhuis van Aalst.\nNa de ceremonie is er een receptie in zaal Het Anker, Molenstraat 5.\n’s Avonds om 19 uur is er een etentje voor familie en vrienden.\nGraag een antwoord vóór 1 mei via e-mail: sofie.jonas@gmail.com",uk:"Софі та Йонас одружуються!\nВас запрошено в п’ятницю, 20 червня, об 11:00 до ратуші Алста.\nПісля церемонії — прийом у залі «Het Anker», Molenstraat 5.\nУвечері о 19:00 — вечеря для родини й друзів.\nБудь ласка, дайте відповідь до 1 травня електронною поштою: sofie.jonas@gmail.com"},
 chat:{title:"Een chat",body:"Anna: Hoi Omar! Zaterdag ga ik naar de markt in Leuven. Ga je mee?\nOmar: Ja, dat is goed! Hoe laat spreken we af?\nAnna: Om 10 uur?\nOmar: Oei, om 10 uur kan ik niet. Ik breng mijn dochter naar de zwemles. Om half twaalf?\nAnna: Oké! Waar spreken we af?\nOmar: Aan de bushalte bij het station.\nAnna: Prima. Na de markt gaan we iets drinken. Tot zaterdag!",uk:"Анна: Привіт, Омаре! У суботу я йду на ринок у Левені. Підеш зі мною?\nОмар: Так, добре! О котрій зустрінемося?\nАнна: О 10:00?\nОмар: Ой, о 10:00 я не можу. Я веду доньку на плавання. О пів на дванадцяту?\nАнна: Гаразд! Де зустрінемося?\nОмар: На автобусній зупинці біля вокзалу.\nАнна: Чудово. Після ринку підемо щось вип’ємо. До суботи!"},
 mail:{title:"Een e-mail",body:"Dag Lies,\nHoe gaat het met jou? Met mij gaat het goed. Ik heb nu werk in een bakkerij. Ik sta elke dag om vier uur op! Ik werk van vijf tot één uur. ’s Middags slaap ik een uur. Daarna haal ik mijn zoon van school. ’s Avonds kook ik en om tien uur ga ik slapen.\nIn het weekend werk ik niet. Dan ga ik graag fietsen of wandelen in het park. Ik ga niet graag winkelen.\nGroetjes, Mira",uk:"Привіт, Ліс!\nЯк у тебе справи? У мене все добре. Тепер у мене є робота в пекарні. Я встаю щодня о четвертій ранку! Я працюю з п’ятої до першої. Після обіду я сплю годину. Потім забираю сина зі школи. Увечері я готую, а о десятій лягаю спати.\nУ вихідні я не працюю. Тоді я люблю кататися на велосипеді або гуляти в парку. Я не люблю ходити по магазинах.\nБувай, Міра"},
 siroop:{title:"Informatie op een medicijn",body:"HOESTSIROOP (oefentekst)\nVolwassenen: 3 keer per dag 1 eetlepel (15 ml), na de maaltijd.\nKinderen van 6 tot 12 jaar: 3 keer per dag 1 koffielepel (5 ml).\nNiet geven aan kinderen jonger dan 6 jaar.\nVerkrijgbaar zonder voorschrift.",uk:"СИРОП ВІД КАШЛЮ (текст для вправи)\nДорослі: 3 рази на день по 1 столовій ложці (15 мл), після їжі.\nДіти від 6 до 12 років: 3 рази на день по 1 чайній ложці (5 мл).\nНе давати дітям молодшим за 6 років.\nПродається без рецепта."},
 tabletten:{title:"Informatie op een medicijn",body:"PIJNSTILLER 500 mg (oefentekst)\nVolwassenen: 1 tot 2 tabletten per keer.\nMaximaal 6 tabletten per dag.\nMinimaal 4 uur tussen 2 innames.\nNeem de tablet in met een glas water, tijdens of na de maaltijd.\nAlleen met voorschrift van de dokter.",uk:"ЗНЕБОЛЮВАЛЬНЕ 500 мг (текст для вправи)\nДорослі: 1–2 таблетки за раз.\nМаксимум 6 таблеток на день.\nЩонайменше 4 години між двома прийомами.\nЗапивай таблетку склянкою води, під час або після їжі.\nТільки за рецептом лікаря."}
};
const Q=(uk,en)=>({uk,en});
const LEZEN=[
 {t:"karim",q:Q("Чому Карім робить свято?","Why is Karim having a party?"),o:["Hij is jarig.","Hij gaat trouwen.","Hij heeft een nieuw huis."]},
 {t:"karim",q:Q("Де свято?","Where is the party?"),o:["In een café.","Bij Karim thuis.","In een restaurant."]},
 {t:"karim",q:Q("О котрій починається свято?","What time does the party start?"),o:["Om 19 uur.","Om 23 uur.","Om 14 uur."]},
 {t:"karim",q:Q("Як треба відповісти?","How should you reply?"),o:["Met een sms.","Met een e-mail.","Met een brief."]},
 {t:"karim",q:Q("До якої дати треба відповісти?","Reply before which date?"),o:["Vóór 1 juni.","Vóór 14 juni.","Vóór 12 juni."]},
 {t:"sofie",q:Q("Чому Софі та Йонас надсилають запрошення?","Why do Sofie and Jonas send this card?"),o:["Ze gaan trouwen.","Ze verjaren.","Ze gaan verhuizen."]},
 {t:"sofie",q:Q("Де церемонія?","Where is the ceremony?"),o:["Aan het stadhuis van Aalst.","In zaal Het Anker.","In de Molenstraat."]},
 {t:"sofie",q:Q("Що буде о 19:00?","What happens at 19:00?"),o:["Een etentje.","De ceremonie.","Een receptie."]},
 {t:"sofie",q:Q("Як відповісти?","How do you reply?"),o:["Via e-mail.","Via sms.","Met de telefoon."]},
 {t:"chat",q:Q("Куди йдуть Анна й Омар?","Where are Anna and Omar going?"),o:["Naar de markt.","Naar de cinema.","Naar het zwembad."]},
 {t:"chat",q:Q("О котрій вони зустрічаються?","What time do they meet?"),o:["Om half twaalf.","Om 10 uur.","Om half elf."]},
 {t:"chat",q:Q("Чому Омар не може о 10:00?","Why can't Omar come at 10?"),o:["Hij brengt zijn dochter naar de zwemles.","Hij moet werken.","Hij is ziek."]},
 {t:"chat",q:Q("Де вони зустрічаються?","Where do they meet?"),o:["Aan de bushalte.","Aan de ingang van de markt.","Bij Anna thuis."]},
 {t:"mail",q:Q("Де працює Міра?","Where does Mira work?"),o:["In een bakkerij.","In een supermarkt.","In een school."]},
 {t:"mail",q:Q("О котрій Міра встає?","What time does Mira get up?"),o:["Om 4 uur.","Om 5 uur.","Om 1 uur."]},
 {t:"mail",q:Q("Що Міра НЕ любить робити?","What does Mira NOT like doing?"),o:["Winkelen.","Fietsen.","Wandelen."]},
 {t:"mail",q:Q("Що Міра робить після обіду?","What does Mira do after her nap?"),o:["Ze haalt haar zoon van school.","Ze gaat werken.","Ze gaat winkelen."]},
 {t:"siroop",q:Q("Скільки разів на день дорослий п’є сироп?","How many times a day does an adult take it?"),o:["3 keer.","1 keer.","6 keer."]},
 {t:"siroop",q:Q("Коли приймати сироп?","When do you take the syrup?"),o:["Na de maaltijd.","Voor de maaltijd.","Voor je gaat slapen."]},
 {t:"siroop",q:Q("Чи можна дитині 4 років?","May a 4-year-old take it?"),o:["Nee.","Ja.","Ja, 1 koffielepel."]},
 {t:"siroop",q:Q("Чи потрібен рецепт?","Do you need a prescription?"),o:["Nee.","Ja."]},
 {t:"tabletten",q:Q("Скільки таблеток максимум на день?","Maximum tablets per day?"),o:["6 tabletten.","2 tabletten.","4 tabletten."]},
 {t:"tabletten",q:Q("Скільки годин мінімум між двома прийомами?","Minimum hours between 2 doses?"),o:["4 uur.","2 uur.","6 uur."]},
 {t:"tabletten",q:Q("Чи потрібен рецепт?","Do you need a prescription?"),o:["Ja.","Nee."]}
];
const DLG={
 cinema:[["A", "Hoi Hua! Ik ga morgenavond naar de cinema. Ga je mee?", "Привіт, Хуа! Завтра ввечері я йду в кіно. Підеш зі мною?"], ["B", "Morgenavond? Hmm, ik weet het niet. Ik moet tot zes uur werken.", "Завтра ввечері? Хм, не знаю. Я мушу працювати до шостої."], ["A", "De film begint om half negen.", "Фільм починається о пів на дев’яту."], ["B", "O, dat is goed! Waar spreken we af?", "О, тоді добре! Де зустрінемося?"], ["A", "Aan de ingang van de cinema, om kwart over acht.", "Біля входу в кінотеатр, о 8:15."], ["B", "Oké, tot morgen!", "Гаразд, до завтра!"]],
 voetbal:[["A", "Hallo Andrei! Het is mooi weer. Ik ga voetballen in het park. Ga je mee?", "Привіт, Андрію! Гарна погода. Я йду грати у футбол у парку. Підеш зі мною?"], ["B", "Het spijt me, Nasir. Ik kan niet. Ik ben moe, ik heb vandaag veel gewerkt.", "Вибач, Насіре. Я не можу. Я втомився, я сьогодні багато працював."], ["A", "Spijtig!", "Шкода!"], ["B", "Een andere keer misschien. Zaterdag heb ik tijd.", "Може, іншим разом. У суботу в мене є час."]],
 route:[["A", "Gloria, we spreken af aan de bushalte om kwart voor drie, goed?", "Глоріє, зустрічаємося на автобусній зупинці о 14:45, гаразд?"], ["B", "Ja, maar hoe kom ik daar?", "Так, але як мені туди дійти?"], ["A", "Ga rechtdoor tot aan de school. Dan ga je rechtsaf. Daarna de eerste straat links. Daar is de bushalte.", "Іди прямо до школи. Потім поверни праворуч. Далі перша вулиця ліворуч. Там зупинка."], ["B", "Rechtdoor, rechtsaf, en dan links. Dank je!", "Прямо, праворуч, а потім ліворуч. Дякую!"]],
 dokter:[["A", "Goedemorgen, mevrouw Peeters. Wat scheelt er?", "Доброго ранку, пані Петерс. Що вас турбує?"], ["B", "Ik ben verkouden en ik moet veel hoesten.", "Я застудилася і сильно кашляю."], ["A", "Sinds wanneer?", "Відколи?"], ["B", "Sinds drie dagen. En ik heb ook keelpijn.", "Уже три дні. І ще болить горло."], ["A", "Heeft u koorts?", "У вас є температура?"], ["B", "Ja, 38 graden.", "Так, 38 градусів."], ["A", "Doe uw trui maar even uit. Adem eens diep in en uit. Zeg eens aaa.", "Зніміть, будь ласка, светр. Вдихніть глибоко… і видихніть. Скажіть «а-а-а»."], ["A", "U heeft een bronchitis. Ik schrijf een hoestsiroop voor. Neem drie keer per dag een eetlepel, na de maaltijd. En gebruik de neusspray twee keer per dag.", "У вас бронхіт. Я випишу сироп від кашлю. Приймайте по столовій ложці тричі на день, після їжі. І користуйтеся спреєм для носа двічі на день."], ["B", "Moet ik thuisblijven?", "Мені треба сидіти вдома?"], ["A", "Ja, blijf drie dagen thuis en drink veel water.", "Так, побудьте три дні вдома і пийте багато води."]],
 apotheek:[["A", "Goedemiddag, zeg het maar.", "Добрий день, слухаю вас."], ["B", "Ik heb hoofdpijn en een beetje koorts. Heeft u iets tegen de pijn?", "У мене болить голова і невелика температура. У вас є щось від болю?"], ["A", "Neem deze tabletten. Eén tablet per keer, maximaal vier per dag.", "Візьміть ці таблетки. Одна таблетка за раз, максимум чотири на день."], ["B", "Moet ik ze voor of na het eten innemen?", "Їх приймати до чи після їжі?"], ["A", "Na het eten, met een glas water.", "Після їжі, зі склянкою води."], ["B", "Heb ik een voorschrift nodig?", "Мені потрібен рецепт?"], ["A", "Nee, dat is niet nodig. Dat is zes euro. Beterschap!", "Ні, не потрібен. З вас шість євро. Одужуйте!"]]
};
const LUISTEREN=[
 {d:"cinema",q:Q("Що Ана робитиме завтра ввечері?","What will Ana do tomorrow evening?"),o:["Een film kijken.","Iets eten.","Iets drinken."]},
 {d:"cinema",q:Q("Чи йде Хуа?","Is Hua going?"),o:["Ja.","Nee.","Ze weet het nog niet."]},
 {d:"cinema",q:Q("О котрій вони зустрічаються?","What time do they meet?"),o:["8:15","8:30","6:00"]},
 {d:"cinema",q:Q("Де вони зустрічаються?","Where do they meet?"),o:["Aan de ingang van de cinema.","Aan de bushalte.","Bij Ana thuis."]},
 {d:"voetbal",q:Q("Що Насір збирається робити?","What is Nasir going to do?"),o:["Voetballen.","Fietsen.","Lopen."]},
 {d:"voetbal",q:Q("Чому Андрій не йде?","Why isn't Andrei coming?"),o:["Hij is moe.","Hij moet werken.","Hij heeft geen zin."]},
 {d:"voetbal",q:Q("Яка погода?","What is the weather like?"),o:["Het is mooi weer.","Het regent.","Het is bewolkt."]},
 {d:"route",q:Q("О котрій вони зустрічаються?","What time do they meet?"),o:["2:45","3:15","3:45"]},
 {d:"route",q:Q("Яким маршрутом іти Глорії?","Which route must Gloria take?"),o:["↑ → ←","↑ ← →","↑ → ↑"]},
 {d:"dokter",q:Q("Що з пані Петерс?","What is wrong with Mrs Peeters?"),o:["Een bronchitis.","Griep.","Een keelontsteking."]},
 {d:"dokter",q:Q("Коли приймати сироп?","When should she take the syrup?"),o:["Na de maaltijd.","Voor de maaltijd.","Tijdens de maaltijd."]},
 {d:"dokter",q:Q("Скільки разів на день спрей для носа?","How often the nasal spray?"),o:["2 keer per dag.","3 keer per dag.","1 keer per dag."]},
 {d:"dokter",q:Q("Скільки днів сидіти вдома?","How many days at home?"),o:["3 dagen.","2 dagen.","Een week."]},
 {d:"apotheek",q:Q("Що болить у пацієнта?","What does the customer have?"),o:["Hoofdpijn en een beetje koorts.","Buikpijn.","Keelpijn en hoesten."]},
 {d:"apotheek",q:Q("Скільки таблеток максимум на день?","Maximum tablets per day?"),o:["4","1","6"]},
 {d:"apotheek",q:Q("Чи потрібен рецепт?","Is a prescription needed?"),o:["Nee.","Ja."]}
];
const OPT_UK={"Hij is jarig.": "Він святкує день народження.", "Hij gaat trouwen.": "Він одружується.", "Hij heeft een nieuw huis.": "У нього новий дім.", "In een café.": "У кафе.", "Bij Karim thuis.": "Удома в Каріма.", "In een restaurant.": "У ресторані.", "Met een sms.": "Смс-кою.", "Met een e-mail.": "Електронним листом.", "Met een brief.": "Паперовим листом.", "Vóór 1 juni.": "До 1 червня.", "Vóór 14 juni.": "До 14 червня.", "Vóór 12 juni.": "До 12 червня.", "Ze gaan trouwen.": "Вони одружуються.", "Ze verjaren.": "У них день народження.", "Ze gaan verhuizen.": "Вони переїжджають.", "Aan het stadhuis van Aalst.": "Біля ратуші Алста.", "In zaal Het Anker.": "У залі «Het Anker».", "In de Molenstraat.": "На вулиці Molenstraat.", "Een etentje.": "Вечеря.", "De ceremonie.": "Церемонія.", "Een receptie.": "Прийом (фуршет).", "Via e-mail.": "Електронною поштою.", "Via sms.": "Смс-кою.", "Met de telefoon.": "Телефоном.", "Naar de markt.": "На ринок.", "Naar de cinema.": "У кіно.", "Naar het zwembad.": "У басейн.", "Om half twaalf.": "О пів на дванадцяту (11:30).", "Om 10 uur.": "О 10:00.", "Om half elf.": "О пів на одинадцяту (10:30).", "Hij brengt zijn dochter naar de zwemles.": "Він веде доньку на плавання.", "Hij moet werken.": "Він мусить працювати.", "Hij is ziek.": "Він хворий.", "Aan de bushalte.": "На автобусній зупинці.", "Aan de ingang van de markt.": "Біля входу на ринок.", "Bij Anna thuis.": "Удома в Анни.", "In een bakkerij.": "У пекарні.", "In een supermarkt.": "У супермаркеті.", "In een school.": "У школі.", "Om 4 uur.": "О 4:00.", "Om 5 uur.": "О 5:00.", "Om 1 uur.": "О 1:00.", "Om 19 uur.": "О 19:00.", "Om 23 uur.": "О 23:00.", "Om 14 uur.": "О 14:00.", "Winkelen.": "Ходити по магазинах.", "Fietsen.": "Їздити на велосипеді.", "Wandelen.": "Гуляти.", "Ze haalt haar zoon van school.": "Вона забирає сина зі школи.", "Ze gaat werken.": "Вона йде на роботу.", "Ze gaat winkelen.": "Вона йде по магазинах.", "3 keer.": "3 рази.", "1 keer.": "1 раз.", "6 keer.": "6 разів.", "Na de maaltijd.": "Після їжі.", "Voor de maaltijd.": "Перед їжею.", "Tijdens de maaltijd.": "Під час їжі.", "Voor je gaat slapen.": "Перед сном.", "Nee.": "Ні.", "Ja.": "Так.", "Ja, 1 koffielepel.": "Так, 1 чайну ложку.", "6 tabletten.": "6 таблеток.", "2 tabletten.": "2 таблетки.", "4 tabletten.": "4 таблетки.", "4 uur.": "4 години.", "2 uur.": "2 години.", "6 uur.": "6 годин.", "Een film kijken.": "Подивитися фільм.", "Iets eten.": "Щось поїсти.", "Iets drinken.": "Щось випити.", "Ze weet het nog niet.": "Вона ще не знає.", "Aan de ingang van de cinema.": "Біля входу в кінотеатр.", "Bij Ana thuis.": "Удома в Ани.", "Voetballen.": "Грати у футбол.", "Lopen.": "Бігати.", "Hij is moe.": "Він утомився.", "Hij heeft geen zin.": "Йому не хочеться.", "Het is mooi weer.": "Гарна погода.", "Het regent.": "Іде дощ.", "Het is bewolkt.": "Хмарно.", "Een bronchitis.": "Бронхіт.", "Griep.": "Грип.", "Een keelontsteking.": "Ангіна (запалення горла).", "2 keer per dag.": "2 рази на день.", "3 keer per dag.": "3 рази на день.", "1 keer per dag.": "1 раз на день.", "3 dagen.": "3 дні.", "2 dagen.": "2 дні.", "Een week.": "Тиждень.", "Hoofdpijn en een beetje koorts.": "Головний біль і невелика температура.", "Buikpijn.": "Біль у животі.", "Keelpijn en hoesten.": "Біль у горлі й кашель."};
// vocabulary: [nl, uk, en]
const WOORDEN=[
 ["strijken","прасувати","to iron"],["stofzuigen","пилососити","to vacuum"],["afwassen","мити посуд","to do the dishes"],["de was doen","прати","to do the laundry"],["boodschappen doen","робити покупки","to do the shopping"],["poetsen","прибирати","to clean"],
 ["wandelen","гуляти пішки","to walk"],["lopen","бігати","to run"],["naar de fitness gaan","ходити в спортзал","to go to the gym"],["op café gaan","йти в кафе","to go to a café"],["in de tuin werken","працювати в саду","to work in the garden"],["foto’s nemen","фотографувати","to take photos"],
 ["opstaan","вставати","to get up"],["thuiskomen","приходити додому","to come home"],["van school halen","забирати зі школи","to pick up from school"],["werkloos","безробітний","unemployed"],
 ["de uitnodiging","запрошення","the invitation"],["afspreken","домовлятися про зустріч","to arrange to meet"],["meegaan","йти разом","to come along"],["de ingang","вхід","the entrance"],["de bushalte","автобусна зупинка","the bus stop"],["Spijtig!","Шкода!","What a pity!"],["Ik heb geen zin.","Мені не хочеться.","I don't feel like it."],["morgenavond","завтра ввечері","tomorrow evening"],["Ga rechtsaf.","Поверни праворуч.","Turn right."],["een bos bloemen","букет квітів","a bunch of flowers"],
 ["Wat scheelt er?","Що з тобою? Що болить?","What's wrong?"],["verkouden","застуджений","having a cold"],["hoesten","кашляти","to cough"],["niezen","чхати","to sneeze"],["de keel","горло","the throat"],["de koorts","температура","the fever"],["het voorschrift","рецепт","the prescription"],["de hoestsiroop","сироп від кашлю","the cough syrup"],["innemen","приймати (ліки)","to take (medicine)"],["uitademen","видихати","to breathe out"],["tijdens de maaltijd","під час їжі","during the meal"],
 ["het bestek","столові прибори","the cutlery"],["de vork","виделка","the fork"],["de kom","миска","the bowl"],["het beleg","начинка для бутерброда","the sandwich filling"],["de hesp","шинка","the ham"],["de boterham","скибка хліба, бутерброд","the slice of bread"],["de havermout","вівсянка","the oatmeal"],["de frisdrank","газована вода","the soft drink"],["ongezond","шкідливий","unhealthy"],["hartig","солоний, пікантний","savoury"],["dikwijls","часто","often"],["nooit","ніколи","never"],["meestal","зазвичай","usually"],["minder","менше","less"]
];
// grammar: gap {s,o} (first = correct) or order {w:[words], a:"answer"} + explanation
const GRAM=[
 {s:"Ik heb ___ tijd.",o:["geen","niet"],e:Q("geen + іменник без артикля","geen + noun without article"),u:"У мене немає часу."},
 {s:"Ik kook ___ graag.",o:["niet","geen"],e:Q("niet перед graag","niet before graag"),u:"Я не люблю готувати."},
 {s:"Hij heeft ___ koorts.",o:["geen","niet"],e:Q("geen + іменник","geen + noun"),u:"У нього немає температури."},
 {s:"Ik luister ___ naar muziek.",o:["niet","geen"],e:Q("niet перед прийменником","niet before a preposition"),u:"Я не слухаю музику."},
 {s:"Wij hebben ___ auto.",o:["geen","niet"],e:Q("een auto → geen auto","een auto → geen auto"),u:"У нас немає машини."},
 {s:"Ik ontbijt ___ elke dag.",o:["niet","geen"],e:Q("niet перед elke dag","niet before elke dag"),u:"Я снідаю не щодня."},
 {s:"Op maandag ___ ik werken.",o:["moet","moeten","moetten"],e:Q("ik moet","ik moet"),u:"У понеділок я мушу працювати."},
 {s:"___ jij zaterdag komen?",o:["Kun","Kunnen","Kunt"],e:Q("У питанні: Kun jij …? / Kan jij …? (без -t перед jij)","In a question: Kun jij …? / Kan jij …?"),u:"Ти можеш прийти в суботу?"},
 {s:"Wij ___ morgen naar de markt.",o:["gaan","gaat","ga"],e:Q("wij gaan","wij gaan"),u:"Ми завтра йдемо на ринок."},
 {s:"Je moet meer water ___.",o:["drinken","drinkt","drink"],e:Q("moeten + інфінітив у кінці","moeten + infinitive at the end"),u:"Тобі треба пити більше води."},
 {s:"Ik drink veel cola. → Je moet ___ cola drinken.",o:["minder","meer","weinig"],e:Q("багато cola → треба менше","a lot of cola → less"),u:"Я п’ю багато коли. → Тобі треба пити менше коли."},
 {s:"Ik eet weinig groenten. → Je moet ___ groenten eten.",o:["meer","minder","veel"],e:Q("мало овочів → треба більше","few vegetables → more"),u:"Я їм мало овочів. → Тобі треба їсти більше овочів."},
 {s:"Neem de tablet in ___ de maaltijd. (після)",o:["na","voor","tijdens"],e:Q("na = після","na = after"),u:"Прийми таблетку після їжі."},
 {s:"Ik blijf thuis, omdat ik ziek ___.",o:["ben","is","zijn"],e:Q("omdat → дієслово в кінці","omdat → verb at the end"),u:"Я лишаюся вдома, тому що я хворий."},
 {s:"Ik blijf thuis, want ik ___ ziek.",o:["ben","zijn","is"],e:Q("want → звичайний порядок","want → normal word order"),u:"Я лишаюся вдома, бо я хворий."},
 {s:"Bedankt ___ de uitnodiging.",o:["voor","met","van"],e:Q("bedankt voor","bedankt voor"),u:"Дякую за запрошення."},
 {s:"Gefeliciteerd ___ je verjaardag!",o:["met","voor","op"],e:Q("gefeliciteerd met","gefeliciteerd met"),u:"Вітаю з днем народження!"},
 {s:"Ik drink koffie ___ suiker. (без)",o:["zonder","met","voor"],e:Q("zonder = без","zonder = without"),u:"Я п’ю каву без цукру."},
 {w:["Om","7 uur","sta","ik","op."],a:"Om 7 uur sta ik op.",e:Q("Inversie: дієслово на 2-му місці, op у кінці","Inversion: verb second, op at the end"),u:"О 7-й я встаю."},
 {w:["’s Avonds","kook","ik","voor","mijn gezin."],a:"’s Avonds kook ik voor mijn gezin.",e:Q("Inversie після часу","Inversion after time"),u:"Увечері я готую для своєї сім’ї."},
 {w:["Hij","wast","elke dag","af."],a:"Hij wast elke dag af.",e:Q("afwassen: af у кінці","afwassen: af at the end"),u:"Він щодня миє посуд."},
 {w:["Ga","je","mee","naar de cinema?"],a:"Ga je mee naar de cinema?",e:Q("meegaan у питанні","meegaan in a question"),u:"Підеш зі мною в кіно?"},
 {w:["Ik","kan","niet","komen,","omdat","ik","moet","werken."],a:"Ik kan niet komen, omdat ik moet werken.",e:Q("omdat: обидва дієслова в кінці","omdat: both verbs at the end"),u:"Я не можу прийти, тому що мушу працювати."},
 {w:["Na het werk","doe","ik","boodschappen."],a:"Na het werk doe ik boodschappen.",e:Q("Inversie: Na het werk + дієслово + ik","Inversion"),u:"Після роботи я роблю покупки."},
 {w:["Je","moet","minder","frieten","eten."],a:"Je moet minder frieten eten.",e:Q("moeten + інфінітив у кінці","moeten + infinitive at the end"),u:"Тобі треба їсти менше картоплі фрі."},
 {w:["Neem","de siroop","in","na","de maaltijd."],a:"Neem de siroop in na de maaltijd.",e:Q("innemen: in після додатка","innemen: in after the object"),u:"Приймай сироп після їжі."}
];
const WRITE=[
 {id:"dag",task_uk:"Напиши e-mail Сарі. Що ти робиш у звичайний день? Що ти любиш і що не любиш робити?",model_uk:"Привіт, Саро!\n\nЯк у тебе справи? Розкажу тобі про свій день.\nЯ встаю щодня о 7-й. Я приймаю душ і снідаю. О пів на дев’яту я відводжу сина до школи. Потім іду на урок нідерландської. Удень я їм бутерброд із сиром. Після уроку роблю покупки. О 17:00 я готую. Увечері дивлюся серіал або читаю книжку. О 23:00 лягаю спати.\nЯ люблю кататися на велосипеді й ходити в спортзал. Ще я люблю готувати. Я не люблю прасувати і не люблю прати.\nА ти? Що ти любиш робити?\n\nБувай,\nДанило",title:Q("E-mail: мій день + що я люблю / не люблю робити","E-mail: my day + what I like / don't like doing"),
  task:"Schrijf een e-mail aan Sara. Wat doe je op een normale dag? Wat doe je graag en wat doe je niet graag?",
  checks:[["Begroeting (Hallo / Beste …)",/^\s*(hallo|beste|dag|lieve|hoi)\b/i],["Uren: om … uur",/\bom\s+(\d|half|kwart)/i],["’s morgens / ’s middags / ’s avonds",/['’]s\s+(morgens|middags|avonds)/i],["Inversie (Om 8 uur ga ik / ’s Avonds kook ik)",/(\bom\s+[\w ]+?\s+uur|['’]s\s+\w+|daarna|dan|na het \w+)\s+[a-z]+\s+ik\b/i],["graag",/\bgraag\b/i],["niet graag",/\bniet\s+graag\b/i],["Afscheid (Groetjes)",/\b(groetjes|groeten|tot ziens|tot snel)\b/i]],
  model:"Hallo Sara,\n\nHoe gaat het met jou? Ik vertel je over mijn dag.\nIk sta elke dag om 7 uur op. Ik neem een douche en ik ontbijt. Om half negen breng ik mijn zoon naar school. Dan ga ik naar de les Nederlands. ’s Middags eet ik een boterham met kaas. Na de les doe ik boodschappen. Om 17 uur kook ik. ’s Avonds kijk ik een serie of ik lees een boek. Om 23 uur ga ik slapen.\nIk fiets graag en ik ga graag naar de fitness. Ik kook ook graag. Ik strijk niet graag en ik doe niet graag de was.\nEn jij? Wat doe jij graag?\n\nGroetjes,\nDanylo"},
 {id:"rita",card_uk:"3 червня мені 50!\nЯ хотіла б випити з вами келих із цієї нагоди. Чекаю вас у суботу, 5 червня, з 15:00 до 18:00 у себе вдома.\nТи теж прийдеш? Будь ласка, дай відповідь до 15 травня.\nРіта Янссенс · rita.janssens@gmail.com",task_uk:"Прочитай запрошення. Ти не можеш прийти. Напиши відповідь.",model_uk:"Дорога Ріто!\n\nВітаю з днем народження! Дякую за запрошення.\nМені шкода, але я не можу прийти. У суботу, 5 червня, я мушу працювати.\nБажаю тобі гарного свята!\n\nВсього доброго,\nДанило",title:Q("Відповідь на запрошення: я НЕ можу прийти","Reply to an invitation: I can't come"),
  card:"Op 3 juni word ik 50!\nDaarop zou ik graag samen met jullie een glaasje drinken. Welkom op zaterdag 5 juni tussen 15 en 18 uur bij mij thuis.\nKom jij ook? Graag een antwoord vóór 15 mei.\nRita Janssens · rita.janssens@gmail.com",
  task:"Lees de uitnodiging. Je kan niet komen. Schrijf een antwoord.",
  checks:[["Begroet Rita (Beste Rita,)",/^\s*(beste|dag|lieve|hallo)\s+rita/i],["Feliciteer (Gefeliciteerd / Proficiat)",/\b(gefeliciteerd|proficiat)\b/i],["Bedank (Bedankt voor de uitnodiging)",/\bbedankt\b|\bdank (je|u)\b/i],["Verontschuldig je (Het spijt me)",/\bhet spijt me\b|\bsorry\b/i],["Je kan niet komen",/\b(kan|kun)\b[^.!?]*\bniet\b[^.!?]*\bkomen\b|\bniet komen\b/i],["Waarom (Ik moet werken / Ik ben ziek …)",/\b(ik moet|ik ben ziek|ik heb geen|ik ga|omdat|want)\b/i],["Afscheid (Groetjes)",/\b(groetjes|groeten|tot ziens)\b/i]],
  model:"Beste Rita,\n\nGefeliciteerd met je verjaardag! Bedankt voor de uitnodiging.\nHet spijt me, maar ik kan niet komen. Op zaterdag 5 juni moet ik werken.\nIk wens je een fijn feest!\n\nGroetjes,\nDanylo"},
 {id:"victor",card_uk:"Віктор і Марі\nВас запрошено 16 травня о 13:00 до ратуші Дендермонде. Після весільної церемонії ми підемо щось випити в кафе «Tijl». О 20:00 — наша вечірка з танцями в Hof ter Velden.\nБудь ласка, дайте відповідь до 22 квітня. marie.dehond@gmail.com",task_uk:"Прочитай запрошення. Ти з радістю прийдеш. Напиши відповідь.",model_uk:"Дорогі Вікторе і Марі!\n\nВітаю з весіллям! Дякую за запрошення.\nЯ з радістю прийду до ратуші і на танцювальну вечірку. Я принесу квіти.\nДо 16 травня!\n\nВсього доброго,\nДанило",title:Q("Відповідь на запрошення: так, я прийду","Reply to an invitation: yes, I'm coming"),
  card:"Victor en Marie\nJullie zijn uitgenodigd op 16 mei om 13.00 uur aan het stadhuis van Dendermonde. Na de trouwceremonie gaan we iets drinken in Café Tijl. Om 20.00 uur is ons dansfeest in Hof ter Velden.\nGraag antwoorden vóór 22 april. marie.dehond@gmail.com",
  task:"Lees de uitnodiging. Je komt graag. Schrijf een antwoord.",
  checks:[["Begroeting (Beste Victor en Marie,)",/^\s*(beste|dag|lieve|hallo)\b/i],["Feliciteer (Proficiat met jullie huwelijk!)",/\b(gefeliciteerd|proficiat)\b/i],["Bedankt voor de uitnodiging",/\bbedankt\b|\bdank (je|jullie|u)\b/i],["Ik kom graag",/\bik kom\b|\bik ben er\b/i],["Afscheid (Groetjes / Tot 16 mei)",/\b(groetjes|groeten|tot ziens|tot \d+)\b/i]],
  model:"Beste Victor en Marie,\n\nProficiat met jullie huwelijk! Bedankt voor de uitnodiging.\nIk kom graag naar het stadhuis en naar het dansfeest. Ik neem bloemen mee.\nTot 16 mei!\n\nGroetjes,\nDanylo"},
 {id:"eten",task_uk:"Напиши e-mail Тому про свої страви. Що ти їси й п’єш уранці, вдень і ввечері? Що тобі (не) смакує?",model_uk:"Привіт, Томе!\n\nТи питаєш, що я їм. Уранці я снідаю о 7-й. Я їм бутерброд із шоколадною пастою або вівсянку з молоком. Я п’ю каву без цукру.\nУдень я їм булочку з сиром і шинкою та яблуко.\nУвечері я їм гарячу страву: картоплю або рис із м’ясом чи рибою та овочами.\nМені дуже смакують макарони й суп. Картопля фрі мені теж смакує, але я їм її нечасто, бо вона шкідлива. Я п’ю багато води. Я ніколи не п’ю колу.\nА що ти любиш їсти?\n\nБувай,\nДанило",title:Q("E-mail про мої страви","E-mail about my meals"),
  task:"Schrijf een e-mail aan Tom met informatie over jouw maaltijden. Wat eet en drink je ’s morgens, ’s middags en ’s avonds? Wat vind je (niet) lekker?",
  checks:[["Begroeting",/^\s*(hallo|beste|dag|lieve|hoi)\b/i],["’s morgens",/['’]s\s+morgens|ontbijt/i],["’s middags",/['’]s\s+middags|lunch/i],["’s avonds",/['’]s\s+avonds|avondeten/i],["lekker vinden (Ik vind … lekker)",/\bvind\b[^.!?]*\blekker\b/i],["met / zonder",/\b(met|zonder)\b/i],["Frequentie (nooit / soms / vaak / meestal / altijd)",/\b(nooit|soms|vaak|dikwijls|meestal|altijd)\b/i],["Afscheid",/\b(groetjes|groeten|tot ziens)\b/i]],
  model:"Hallo Tom,\n\nJe vraagt wat ik eet. ’s Morgens ontbijt ik om 7 uur. Ik eet een boterham met choco of havermout met melk. Ik drink koffie zonder suiker.\n’s Middags eet ik een broodje met kaas en hesp en een appel.\n’s Avonds eet ik een warme maaltijd: aardappelen of rijst met vlees of vis en groenten.\nIk vind pasta en soep heel lekker. Ik vind frieten ook lekker, maar ik eet ze niet vaak, want ze zijn ongezond. Ik drink veel water. Ik drink nooit cola.\nWat eet jij graag?\n\nGroetjes,\nDanylo"}
];
const COMMON=[ // frequent mistakes in writing
 [/\bbedenkt\b/i,Q("«Bedenkt» → правильно «Bedankt» (дякую).","«Bedenkt» → write «Bedankt» (thanks).")],
 [/\bik heb\b[^.!?]{0,25}\bwerken\b/i,Q("«Ik heb … werken» → «Ik moet … werken».","«Ik heb … werken» → «Ik moet … werken».")],
 [/['’]s\s+(morgens|middags|avonds)\s+ik\b/i,Q("Після «’s avonds» дієслово перед ik: «’s Avonds kook ik».","After «’s avonds» the verb comes before ik: «’s Avonds kook ik».")],
 [/\bom\s+\d+\s+uur\s+ik\b/i,Q("Інверсія: «Om 8 uur ga ik», а не «Om 8 uur ik ga».","Inversion: «Om 8 uur ga ik».")],
 [/\bik\s+graag\b/i,Q("graag після дієслова: «Ik fiets graag».","graag after the verb: «Ik fiets graag».")],
 [/\bik\s+niet\s+heb\b/i,Q("«Ik heb geen …» замість «ik niet heb».","«Ik heb geen …».")],
 [/\bik\s+opsta\b/i,Q("«Ik sta om 7 uur op» — op у кінці.","«Ik sta om 7 uur op».")]
];
const SPREKEN=[
 {id:"dag",t:Q("Мій звичайний день","My normal day"),qa:[["Hoe laat sta jij op?", "Ik sta om 7 uur op.", "О котрій ти встаєш?", "Я встаю о 7-й."], ["Wat doe je ’s morgens?", "Ik neem een douche en ik ontbijt. Dan breng ik mijn zoon naar school.", "Що ти робиш уранці?", "Я приймаю душ і снідаю. Потім відводжу сина до школи."], ["Wat doe je ’s middags?", "’s Middags ga ik naar de les Nederlands.", "Що ти робиш після обіду?", "Після обіду я йду на урок нідерландської."], ["Wat doe je na de les?", "Na de les doe ik boodschappen.", "Що ти робиш після уроку?", "Після уроку я роблю покупки."], ["Wat doe je ’s avonds?", "’s Avonds kook ik. Daarna kijk ik een serie.", "Що ти робиш увечері?", "Увечері я готую. Потім дивлюся серіал."], ["Hoe laat ga je slapen?", "Ik ga om 23 uur slapen.", "О котрій ти лягаєш спати?", "Я лягаю спати о 23:00."], ["Wat doe jij in het weekend?", "In het weekend fiets ik en ik ga wandelen.", "Що ти робиш у вихідні?", "У вихідні я катаюся на велосипеді й гуляю."], ["Kook jij elke dag?", "Ja, ik kook elke dag.", "Ти готуєш щодня?", "Так, я готую щодня."]]},
 {id:"graag",t:Q("Що я люблю / не люблю робити","What I like / don't like doing"),qa:[["Wat doe jij graag?", "Ik fiets graag. Ik lees ook graag.", "Що ти любиш робити?", "Я люблю кататися на велосипеді. Ще люблю читати."], ["Wat doe jij niet graag?", "Ik strijk niet graag.", "Що ти не любиш робити?", "Я не люблю прасувати."], ["Zwem jij graag?", "Ja, ik zwem graag.", "Ти любиш плавати?", "Так, я люблю плавати."], ["Ga jij graag op restaurant?", "Ja, ik ga graag op restaurant.", "Ти любиш ходити в ресторан?", "Так, я люблю ходити в ресторан."], ["Doe jij graag boodschappen?", "Nee, ik doe niet graag boodschappen.", "Ти любиш робити покупки?", "Ні, я не люблю робити покупки."], ["Kook jij graag?", "Ja, ik kook graag.", "Ти любиш готувати?", "Так, я люблю готувати."]]},
 {id:"afspraak",t:Q("Домовитися / відмовитися","Make plans / say no"),qa:[["Ik ga zaterdagavond naar de cinema. Ga je mee?", "Ja, dat is goed! Hoe laat spreken we af?", "У суботу ввечері я йду в кіно. Підеш зі мною?", "Так, добре! О котрій зустрінемося?"], ["Om half acht.", "Waar spreken we af?", "О пів на восьму.", "Де зустрінемося?"], ["Aan de ingang.", "Oké, tot zaterdag!", "Біля входу.", "Гаразд, до суботи!"], ["Het is mooi weer. Ik ga wandelen in het park. Ga je mee?", "Het spijt me, ik kan niet. Ik moet werken.", "Гарна погода. Я йду гуляти в парк. Підеш зі мною?", "Вибач, я не можу. Я мушу працювати."], ["Spijtig!", "Een andere keer misschien!", "Шкода!", "Може, іншим разом!"], ["Ga je morgen mee naar de markt?", "Het spijt me, maar ik heb geen tijd.", "Підеш завтра зі мною на ринок?", "Вибач, але в мене немає часу."]]},
 {id:"dokter",t:Q("У лікаря: Wat scheelt er?","At the doctor's"),qa:[["Goedemorgen. Wat scheelt er?", "Ik voel me niet goed. Ik heb keelpijn en ik moet veel hoesten.", "Доброго ранку. Що вас турбує?", "Мені погано. У мене болить горло і я сильно кашляю."], ["Sinds wanneer?", "Sinds twee dagen.", "Відколи?", "Уже два дні."], ["Heeft u koorts?", "Ja, ik heb 38,5 graden koorts.", "У вас є температура?", "Так, у мене температура 38,5."], ["Waar heeft u pijn?", "Ik heb pijn aan mijn rug.", "Де у вас болить?", "У мене болить спина."], ["Moet u niezen?", "Ja, ik moet veel niezen. Ik ben verkouden.", "Ви чхаєте?", "Так, я часто чхаю. Я застудився."], ["Neemt u medicijnen?", "Nee, ik neem geen medicijnen.", "Ви приймаєте ліки?", "Ні, я не приймаю ліків."]]},
 {id:"eten",t:Q("Мої страви: Wat vind jij lekker?","My meals"),qa:[["Wat eet je ’s morgens?", "’s Morgens eet ik een boterham met kaas.", "Що ти їси вранці?", "Уранці я їм бутерброд із сиром."], ["Wat eet je ’s avonds?", "’s Avonds eet ik vlees met aardappelen en groenten.", "Що ти їси ввечері?", "Увечері я їм м’ясо з картоплею та овочами."], ["Vind jij koffie lekker?", "Ja, ik vind koffie heel lekker.", "Тобі смакує кава?", "Так, мені дуже смакує кава."], ["Drink jij graag bier?", "Nee, ik drink niet graag bier.", "Ти любиш пити пиво?", "Ні, я не люблю пити пиво."], ["Eet jij graag frieten?", "Ja, ik eet graag frieten, maar niet vaak.", "Ти любиш їсти картоплю фрі?", "Так, я люблю картоплю фрі, але їм її нечасто."], ["Eet jij gezond?", "Ja, meestal. Ik eet veel groenten en fruit.", "Ти харчуєшся здорово?", "Так, зазвичай. Я їм багато овочів і фруктів."]]},
 {id:"advies",t:Q("Інструкції: meer / minder","Advice: meer / minder"),qa:[["Ik drink veel cola.", "Je moet minder cola drinken.", "Я п’ю багато коли.", "Тобі треба пити менше коли."], ["Ik drink elke dag maar een glas water.", "Je moet meer water drinken.", "Я п’ю лише одну склянку води на день.", "Тобі треба пити більше води."], ["Ik eet elke dag frieten.", "Je moet minder frieten eten.", "Я щодня їм картоплю фрі.", "Тобі треба їсти менше картоплі фрі."], ["Ik eet weinig groenten.", "Je moet meer groenten eten.", "Я їм мало овочів.", "Тобі треба їсти більше овочів."], ["Ik eet veel chocolade.", "Je moet minder chocolade eten.", "Я їм багато шоколаду.", "Тобі треба їсти менше шоколаду."], ["Ik sport nooit.", "Je moet meer sporten.", "Я ніколи не займаюся спортом.", "Тобі треба більше займатися спортом."]]}
];

// ---- class worksheets (26 Oct): plural (meervoud) and «Waarom? — Omdat …» ----
const MV=[["Ze wast de ___ van haar huis.", "raam", "ramen", ["raamen", "raams", "rammen"], "Вона миє вікна свого будинку."], ["De patiënt moet 3 ___ siroop per dag nemen.", "lepel", "lepels", ["lepelen", "lepells", "lepelles"], "Пацієнт мусить приймати 3 ложки сиропу на день."], ["5 ___ per dag is te veel!", "maaltijd", "maaltijden", ["maaltijds", "maaltijdden", "maaltijde"], "5 прийомів їжі на день — це забагато!"], ["Een persoon heeft 2 ___.", "arm", "armen", ["arms", "armmen", "arme"], "Людина має 2 руки."], ["Een persoon heeft 2 ___.", "schouder", "schouders", ["schouderen", "schouderren", "schouder's"], "Людина має 2 плечі."], ["Ik heb 10 ___.", "vinger", "vingers", ["vingeren", "vingerren", "vinger's"], "У мене 10 пальців."], ["In het ziekenhuis werken veel ___.", "dokter", "dokters", ["dokteren", "doktors", "dokter's"], "У лікарні працює багато лікарів."], ["We kopen ___ bij Ikea.", "tafel", "tafels", ["tafelen", "taffels", "tafel's"], "Ми купуємо столи в Ikea."], ["Heb je ___?", "kind", "kinderen", ["kinds", "kinden", "kinderens"], "У тебе є діти?"], ["Ja, 2 ___ en 2 dochters.", "zoon", "zonen|zoons", ["zoonen", "zonnen", "zoon's"], "Так, 2 сини і 2 доньки."], ["Ja, 2 zonen en 2 ___.", "dochter", "dochters", ["dochteren", "dochterren", "dochter's"], "Так, 2 сини і 2 доньки."], ["2 ___ en 2 meisjes. Wat een grote familie!", "jongen", "jongens", ["jongenen", "jongennen", "jongen's"], "2 хлопчики і 2 дівчинки. Яка велика сім’я!"], ["2 jongens en 2 ___. Wat een grote familie!", "meisje", "meisjes", ["meisjen", "meisje's", "meisjens"], "2 хлопчики і 2 дівчинки. Яка велика сім’я!"], ["Vandaag is een feestdag: alle ___ zijn gesloten.", "winkel", "winkels", ["winkelen", "winkells", "winkel's"], "Сьогодні свято: усі магазини зачинені."], ["We schrijven ___.", "brief", "brieven", ["briefen", "briefs", "brieffen"], "Ми пишемо листи."], ["We luisteren naar ___.", "liedje", "liedjes", ["liedjen", "liedje's", "liedjens"], "Ми слухаємо пісеньки."], ["Hij eet 2 ___ met eieren.", "boterham", "boterhammen", ["boterhamen", "boterhams", "boterhammes"], "Він їсть 2 бутерброди з яйцями."], ["Hij eet 2 boterhammen met ___.", "ei", "eieren", ["eien", "eis", "eiers"], "Він їсть 2 бутерброди з яйцями."], ["Zij heeft veel ___ op Facebook.", "foto", "foto's", ["fotos", "fotoën", "fotoes"], "У неї багато фото у Facebook."], ["De dokter schrijft 3 ___ voor de patiënt.", "briefje", "briefjes", ["briefjen", "briefje's", "brieven"], "Лікар пише пацієнтові 3 довідки."], ["Wat scheelt er? Ik heb pijn aan mijn ___.", "oog", "ogen", ["oogen", "oogs", "oggen"], "Що з тобою? У мене болять очі."], ["Hij loopt niet graag, omdat hij pijn aan zijn ___ heeft.", "been", "benen", ["beenen", "beens", "bennen"], "Він не любить ходити, бо в нього болять ноги."], ["We kopen ___ voor de kinderen.", "snoepje", "snoepjes", ["snoepjen", "snoepje's", "snoepen"], "Ми купуємо цукерки для дітей."], ["We kopen 2 ___ eieren.", "doos", "dozen", ["doosen", "doozen", "doos's"], "Ми купуємо 2 коробки яєць."], ["Ik vind ___ niet lekker.", "oester", "oesters", ["oesteren", "oesterren", "oester's"], "Мені не смакують устриці."], ["Hij vertrekt naar de supermarkt met 2 ___.", "zak", "zakken", ["zaken", "zaks", "zakkens"], "Він іде в супермаркет із 2 пакетами."], ["Hij heeft 2 ___.", "auto", "auto's", ["autos", "autoën", "auto'en"], "У нього 2 машини."], ["Hij heeft 6 ___.", "paraplu", "paraplu's", ["paraplus", "paraplu'en", "parapluën"], "У нього 6 парасольок."], ["Hij heeft 2 ___.", "computer", "computers", ["computeren", "computer's", "computerren"], "У нього 2 комп’ютери."], ["Hij gaat graag naar de ___ en restaurants.", "café", "cafés", ["caféen", "café's", "cafeeën"], "Він любить ходити в кафе й ресторани."], ["In de winkel liggen veel ___.", "kaas", "kazen", ["kaasen", "kaazen", "kazzen"], "У магазині лежить багато сирів."], ["Het huis heeft 2 ingangen met 2 ___.", "deur", "deuren", ["deurs", "deurren", "deur's"], "У будинку 2 входи з 2 дверима."], ["Het huis heeft 2 ___.", "ingang", "ingangen", ["ingangs", "ingangens", "ingang's"], "У будинку 2 входи."], ["Ik heb 3 ___ in mijn tas.", "pen", "pennen", ["penen", "pens", "pen's"], "У мене в сумці 3 ручки."], ["’s Morgens eten ze ___ en croissants.", "pistolet", "pistolets", ["pistoleten", "pistoletten", "pistolet's"], "Уранці вони їдять булочки й круасани."]];
const MV_PICK={"text": "Carlo heeft een grote familie: hij heeft 4 kinderen, 2 jongens en 2 meisjes. Zijn 2 zonen heten Christof en Matthieu. Zijn 2 dochters heten Christine en Chantal. ’s Morgens eten ze veel pistolets en croissants. ’s Middags eten ze 2 boterhammen met soep. In de namiddag eten ze graag koekjes. Carlo heeft 2 grote tafels in zijn huis. Zijn huis heeft 2 ingangen met 2 deuren. Hij gaat graag naar de cafés, restaurants en winkels in het centrum van de stad. Hij heeft 2 auto’s, 2 computers en 6 paraplu’s.", "targets": ["kinderen", "jongens", "meisjes", "zonen", "dochters", "pistolets", "croissants", "boterhammen", "koekjes", "tafels", "ingangen", "deuren", "cafés", "restaurants", "winkels", "auto’s", "computers", "paraplu’s"], "uk": "Карло має велику сім’ю: у нього 4 дітей, 2 хлопчики і 2 дівчинки. Його 2 синів звуть Крістоф і Матьє. Його 2 доньок звуть Крістін і Шанталь. Уранці вони їдять багато булочок і круасанів. Удень вони їдять 2 бутерброди із супом. Після обіду вони люблять їсти печиво. У Карло вдома 2 великі столи. У його будинку 2 входи з 2 дверима. Він любить ходити в кафе, ресторани й магазини в центрі міста. У нього 2 машини, 2 комп’ютери і 6 парасольок."};
const OM=[["Waarom huilt de baby?", "Omdat hij honger heeft.", "Чому плаче дитина?", "Тому що вона голодна."], ["Waarom dragen de kinderen een handdoek?", "Omdat ze gaan zwemmen.", "Чому діти несуть рушник?", "Тому що вони підуть плавати."], ["Waarom zijn An en Bart niet in de klas?", "Omdat ze te laat zijn.", "Чому Ан і Барта немає в класі?", "Тому що вони запізнюються."], ["Waarom dragen de kinderen warme kleren?", "Omdat ze in de sneeuw gaan spelen.", "Чому діти в теплому одязі?", "Тому що вони підуть гратися в сніг."], ["Waarom zitten moeder en dochter in de wachtkamer?", "Omdat het meisje buikpijn heeft.", "Чому мама з донькою сидять у приймальні?", "Тому що в дівчинки болить живіт."], ["Waarom gaat Monserrat naar de supermarkt?", "Omdat de koelkast leeg is.", "Чому Монсеррат іде в супермаркет?", "Тому що холодильник порожній."], ["Waarom telt Améline haar geld?", "Omdat ze een boek gaat kopen.", "Чому Амелін рахує гроші?", "Тому що вона купуватиме книжку."], ["Waarom staat Lutgarde op een ladder?", "Omdat ze de ramen gaat wassen.", "Чому Лютгард стоїть на драбині?", "Тому що вона митиме вікна."], ["Waarom blijf je thuis?", "Omdat ik ziek ben.", "Чому ти лишаєшся вдома?", "Тому що я хворий."], ["Waarom kom je niet naar het feest?", "Omdat ik moet werken.", "Чому ти не прийдеш на свято?", "Тому що я мушу працювати."], ["Waarom ga je naar de apotheek?", "Omdat ik hoestsiroop nodig heb.", "Чому ти йдеш в аптеку?", "Тому що мені потрібен сироп від кашлю."], ["Waarom eet je geen frieten?", "Omdat frieten ongezond zijn.", "Чому ти не їси картоплю фрі?", "Тому що картопля фрі шкідлива."], ["Waarom ga je naar de dokter?", "Omdat ik koorts heb.", "Чому ти йдеш до лікаря?", "Тому що в мене температура."], ["Waarom drink je veel water?", "Omdat het gezond is.", "Чому ти п’єш багато води?", "Тому що це корисно."], ["Waarom sta je zo vroeg op?", "Omdat mijn les om 8 uur begint.", "Чому ти так рано встаєш?", "Тому що мій урок починається о 8:00."], ["Waarom ga je niet mee naar de cinema?", "Omdat ik geen tijd heb.", "Чому ти не підеш у кіно?", "Тому що в мене немає часу."]];
const OM_MC=[["Omdat ik ziek ben.", ["Omdat ik ben ziek.", "Omdat ben ik ziek.", "Omdat ziek ik ben."], "Тому що я хворий."], ["Omdat ik moet werken.", ["Omdat ik werken moet niet.", "Omdat moet ik werken.", "Omdat ik moet werk."], "Тому що я мушу працювати."], ["Want ik ben ziek.", ["Want ik ziek ben.", "Want ben ik ziek.", "Want ziek ik ben."], "Бо я хворий."], ["Omdat de koelkast leeg is.", ["Omdat de koelkast is leeg.", "Omdat is de koelkast leeg.", "Omdat leeg de koelkast is."], "Тому що холодильник порожній."], ["Omdat hij om 6 uur opstaat.", ["Omdat hij staat om 6 uur op.", "Omdat hij om 6 uur staat op.", "Omdat staat hij om 6 uur op."], "Тому що він встає о 6:00."]];
const RULES={
 meervoud:{uk:"<b>Meervoud: +en (70%)</b> — більшість слів: zoon → zonen, deur → deuren, ingang → ingangen.<br><b>+s (30%)</b> — слова на <b>-en, -el, -er, -je</b> і міжнародні: jongen → jongens, tafel → tafels, dochter → dochters, meisje → meisjes, computer → computers, café → cafés.<br><b>'s</b> — слова на <b>a, o, u, i</b>: auto → auto’s, foto → foto’s, paraplu → paraplu’s.<br><b>Довгий / короткий звук:</b> raam → ramen, oog → ogen (aa → a, oo → o); zak → zakken, pen → pennen, boterham → boterhammen (подвоюємо приголосну!).<br><b>Особливі:</b> brief → brieven, kaas → kazen, doos → dozen (f → v, s → z), kind → kinderen, ei → eieren.<br><b>Увага:</b> heten, eten — це дієслова, а не множина!",en:"<b>Plural +en (70%)</b>: zoon → zonen, deur → deuren.<br><b>+s (30%)</b>: words in -en, -el, -er, -je and international words: jongens, tafels, dochters, meisjes, computers, cafés.<br><b>'s</b> after a, o, u, i: auto’s, foto’s, paraplu’s.<br><b>Long/short vowel:</b> raam → ramen, oog → ogen; zak → zakken, pen → pennen, boterham → boterhammen.<br><b>Special:</b> brief → brieven, kaas → kazen, doos → dozen, kind → kinderen, ei → eieren."},
 omdat:{uk:"<b>Omdat</b> + хто + … + <b>дієслово в кінці</b>.<br>Waarom huilt de baby? → Omdat hij honger <b>heeft</b>.<br>Два дієслова — обидва в кінці: Omdat ze een boek <b>gaat kopen</b>. Omdat ik <b>moet werken</b>.<br>Розділюване дієслово зливається: Omdat hij om 6 uur <b>opstaat</b>.<br><b>Want</b> — звичайний порядок: Want ik <b>ben</b> ziek.<br>Підмет — правильна особа: Monserrat → <b>ze</b>, de baby → <b>hij</b>, het meisje → <b>ze</b>.",en:"<b>Omdat</b> + subject + … + <b>verb at the end</b>: Omdat hij honger <b>heeft</b>. Two verbs at the end: Omdat ze een boek <b>gaat kopen</b>. Separable verbs join: Omdat hij om 6 uur <b>opstaat</b>. <b>Want</b> keeps normal order: Want ik <b>ben</b> ziek."}
};
function mkMV(m,i){const acc=m[2].split("|"),gap=m[0].replace("___","___ ("+m[1]+")"),full=m[0].replace("___",acc[0]);
 return i%2?{kind:"type",gap,acc,ok:acc[0],full,u:m[4],e:L()==="uk"?m[1]+" → "+acc.join(" / "):m[1]+" → "+acc[0]}:{kind:"mc",gap,o:[acc[0],...m[3]],ok:acc[0],full,u:m[4],e:m[1]+" → "+acc.join(" / "),nlOpts:true}}
function mkOM(o){const w=o[1].replace(/\.$/,"").split(" ");return{kind:"order",prompt:o[0],promptU:o[2],w:w.map((x,i)=>i===w.length-1?x+".":x),a:o[1],u:o[3],e:tr(Q("Omdat → дієслово в кінці речення","Omdat → verb at the end"))}}
function mkOMmc(o){return{kind:"mc",q:L()==="uk"?"Яке речення правильне?":"Which sentence is correct?",o:[o[0],...o[1]],ok:o[0],full:o[0],u:o[2],nlOpts:true,e:/^Want/.test(o[0])?tr(Q("want → звичайний порядок: підмет + дієслово","want → normal order")):tr(Q("omdat → дієслово(а) в кінці","omdat → verb(s) at the end"))}}
function mkPick(){return{kind:"pick",ptext:MV_PICK.text,targets:MV_PICK.targets,ok:MV_PICK.targets.join(", "),textUk:MV_PICK.uk,e:tr(Q("heten, eten — дієслова, не множина іменників","heten, eten are verbs, not plural nouns"))}}
// ---------------- HELPERS ----------------
const st=()=>{try{const s=lsGet(KEY,{});return s&&typeof s==="object"?s:{}}catch(e){return{}}};
const save=s=>{try{lsSet(KEY,s)}catch(e){}};
function setBest(part,pct){const s=st();s.best=s.best||{};if(!(s.best[part]>=pct)){s.best[part]=pct;save(s)}}
function head(title,sub,backTo){
 cardToTop&&cardToTop();
 const c=$("card");c.replaceChildren();$("prog").textContent=title;$("rnd").textContent=sub||"";bar(0);
 const b=el("button","ex-back",backTo==="toets"?U().toets:U().back);b.type="button";b.onclick=backTo==="toets"?()=>startToets():home;c.appendChild(b);
 return c;
}
function bar(p){const f=$("barfill");if(f){f.style.width=Math.round(p*100)+"%";f.parentElement&&f.parentElement.setAttribute("aria-valuenow",String(Math.round(p*100)))}}
function playLines(lines,btn,i=0){
 if(i>=lines.length){if(btn)btn.disabled=false;return}
 if(btn)btn.disabled=true;
 say(lines[i][1],null,()=>setTimeout(()=>playLines(lines,btn,i+1),350));
}
const nl=t=>{const s=el("span","",t);return tgt(s)};
const UKON=()=>uiLang==="uk";
const trEl=(t,cls)=>el(cls||"small","ex-tr",t);
function fullGap(g){return g.s.replace("___",g.o[0]).replace(/\s*\(.*\)\s*$/,"")}

// ---------------- HOME ----------------
function home(){
 const u=U(),c=head(u.title,"","toets"),s=st();
 c.appendChild(el("h2","ex-h",u.title));c.appendChild(el("p","ex-sub",u.sub));c.appendChild(el("p","ex-when",u.when));
 const grid=el("div","ex-grid");
 Object.entries(u.parts).forEach(([id,[ic,t,d]])=>{
  const b=el("button","ex-tile"+(id==="proef"?" wide":""));b.type="button";b.dataset.part=id;
  b.append(el("span","ex-ic",ic),el("strong","",t),el("span","ex-d",d));
  const run=(s.run||{})[id];if(run&&run.i>0&&run.i<(run.items||[]).length)b.appendChild(el("span","ex-cont",(L()==="uk"?"▶ Продовжити ":"▶ Continue ")+(run.i+1)+"/"+run.items.length));
  const best=s.best&&s.best[id];if(best!=null){b.appendChild(el("span","ex-best","★ "+best+"%"));if(best>=70)b.classList.add("ok")}
  b.onclick=()=>({lezen:()=>quiz("lezen"),meervoud:()=>quiz("meervoud"),omdat:()=>quiz("omdat"),luisteren:()=>quiz("luisteren"),woorden:()=>quiz("woorden"),grammatica:()=>quiz("grammatica"),proef:()=>quiz("proef"),schrijven:writePick,spreken:speakPick})[id]();
  grid.appendChild(b);
 });
 c.appendChild(grid);
 if(typeof AI_ENDPOINT!=="undefined"&&AI_ENDPOINT&&targetLang==="nl"){
  const nm=(typeof cx==="function"?cx("{N}"):"Peter");const fix=t=>t.replace(/Peter/g,nm);
  c.appendChild(el("h3","ex-aih",u.ai));c.appendChild(el("p","ex-sub",fix(u.aiS)));
  const mk=(id,t,d,fn)=>{const b=el("button","btn toets-pick ex-ai");b.type="button";b.dataset.ai=id;const av=el("span","tp-no ex-av");try{av.innerHTML=charSvg("happy")}catch(e){av.textContent="🤖"}b.appendChild(av);const tx=el("span","tp-text");tx.append(el("strong","",fix(t)),el("small","tp-meta",fix(d)));b.appendChild(tx);b.onclick=fn;c.appendChild(b)};
  let aiRun=null;try{aiRun=lsGet("leren_exam11_ai",null)}catch(e){}
  const cont=aiRun&&aiRun.exam&&!aiRun.exam.done&&aiRun.msgs&&aiRun.msgs.length?(L()==="uk"?" · ▶ Продовжити з питання ":" · ▶ Continue at question ")+(aiRun.exam.i+1)+"/"+aiRun.exam.list.length:"";
  mk("speak",u.aiSpeak,u.aiSpeakS+cont,()=>aiStart({id:"exam11",fromExam:true}));
  mk("ask",u.aiAsk,u.aiAskS,()=>askStart({focus:"exam11"}));
 }
}

// ---------------- QUIZ ENGINE ----------------
function mkLezen(x){return{kind:"mc",text:TEXTS[x.t],q:tr(x.q),o:x.o,ok:x.o[0]}}
function mkLuisteren(x){return{kind:"mc",dlg:DLG[x.d],q:tr(x.q),o:x.o,ok:x.o[0]}}
function wordPool(){ // the exam words + every word of the four "exam words" lessons (chapters 8-11)
 const seen=new Set(),out=[];const add=x=>{const k=x[0].toLowerCase();if(!seen.has(k)&&x[1]){seen.add(k);out.push(x)}};
 WOORDEN.forEach(add);
 try{["ex8","ex9","ex10","ex11"].forEach(t=>(DATA[t]?.items||[]).forEach(it=>add([it.nl,it.uk,it.en])))}catch(e){}
 return out;
}
function mkWoord(w,i,all){
 const kind=x=>/[.?!]$/.test(x[0])?"s":/\s/.test(x[0].replace(/^(de|het|een) /i,""))?"p":"w";
 const same=all.filter(x=>x!==w&&kind(x)===kind(w)&&x[1]!==w[1]);const others=shuffle(same.length>=3?same:all.filter(x=>x!==w)).slice(0,3),dir=i%2;
 return dir?{kind:"mc",pair:w,q:(L()==="uk"?"Як нідерландською: «":"In Dutch: “")+(L()==="uk"?w[1]:w[2])+(L()==="uk"?"»?":"”?"),o:[w[0],...others.map(x=>x[0])],ok:w[0],nlOpts:true}
  :{kind:"mc",pair:w,q:(L()==="uk"?"Що означає «":"What does “")+w[0]+(L()==="uk"?"»?":"” mean?"),o:[L()==="uk"?w[1]:w[2],...others.map(x=>L()==="uk"?x[1]:x[2])],ok:L()==="uk"?w[1]:w[2],nlQ:w[0]};
}
function mkGram(g){return g.w?{kind:"order",w:g.w,a:g.a,e:tr(g.e),u:g.u}:{kind:"mc",gap:g.s,full:fullGap(g),o:g.o,ok:g.o[0],e:tr(g.e),u:g.u,nlOpts:true}}
function build(part){
 if(part==="lezen")return LEZEN.map(mkLezen);
 if(part==="luisteren")return LUISTEREN.map(mkLuisteren);
 if(part==="woorden"){const P=wordPool(),w=shuffle(P).slice(0,25);return w.map((x,i)=>mkWoord(x,i,P))}
 if(part==="grammatica")return shuffle(GRAM).map(mkGram);
 if(part==="meervoud")return [mkPick(),...shuffle(MV).slice(0,19).map(mkMV)];
 if(part==="omdat")return [...shuffle(OM).slice(0,12).map(mkOM),...shuffle(OM_MC).slice(0,3).map(mkOMmc)];
 // mock exam: half of everything, grouped like the exam
 const pick=(a,n)=>shuffle(a).slice(0,n);
 const lez=pick(["karim","sofie","chat","mail","siroop","tabletten"],3).flatMap(t=>pick(LEZEN.filter(x=>x.t===t),2)).map(mkLezen);
 const lui=pick(Object.keys(DLG),2).flatMap(d=>pick(LUISTEREN.filter(x=>x.d===d),2)).map(mkLuisteren);
 const P=wordPool(),w=pick(P,6).map((x,i)=>mkWoord(x,i,P));
 return [...lez,...lui,...w,...pick(GRAM,4).map(mkGram),...pick(MV,3).map(mkMV),...pick(OM,3).map(mkOM)];
}
let QZ=null;
function qzSave(){if(!QZ)return;const s=st();s.run=s.run||{};const clean=o=>JSON.parse(JSON.stringify(o,(k,v)=>k.startsWith("_")?undefined:v));s.run[QZ.part]={items:clean(QZ.items),i:QZ.i,right:QZ.right,miss:clean(QZ.miss),t0:QZ.t0};save(s)}
function qzClear(part){const s=st();if(s.run&&s.run[part]){delete s.run[part];save(s)}}
function quiz(part,fresh){
 const r=!fresh&&(st().run||{})[part];
 if(r&&Array.isArray(r.items)&&r.i>0&&r.i<r.items.length){QZ={part,items:r.items,i:r.i,right:r.right||0,miss:r.miss||[],t0:r.t0||Date.now()};toast((L()==="uk"?"Продовжуємо з питання ":"Continuing from question ")+(r.i+1));ask();return}
 QZ={part,items:build(part),i:0,right:0,miss:[],t0:Date.now()};qzSave();if(part==="proef")toast(U().proefInfo);ask()}
function ask(){
 const u=U(),s=QZ,it=s.items[s.i],title=u.parts[s.part][0]+" "+u.parts[s.part][1];
 const c=head(title,u.q+" "+(s.i+1)+" "+u.of+" "+s.items.length);bar(s.i/s.items.length);
 if(s.i>0){const rs=el("button","ex-restart",L()==="uk"?"↺ Почати заново":"↺ Start over");rs.type="button";rs.onclick=()=>quiz(s.part,true);c.firstChild.after(rs)}
 if(it.text){const box=el("div","ex-text");box.appendChild(el("small","",it.text.title));const p=el("p","");p.appendChild(nl(it.text.body));box.appendChild(p);c.appendChild(box);it._textEl=box}
 if(it.dlg){
  c.appendChild(el("p","ex-hint",u.readFirst));
  const row=el("div","row ex-play"),pl=el("button","btn primary",u.listen);pl.type="button";pl.onclick=()=>playLines(it.dlg,pl);
  const sh=el("button","btn",u.showText);sh.type="button";const box=el("div","ex-text ex-dlg");box.hidden=true;
  it.dlg.forEach(([w,t,u2])=>{const p=el("p","");p.appendChild(el("b","",w+": "));p.appendChild(nl(t));if(u2){const x=trEl(u2);x.hidden=true;p.appendChild(x)}box.appendChild(p)});
  sh.onclick=()=>{box.hidden=!box.hidden;sh.textContent=box.hidden?u.showText:u.hideText};
  row.append(pl,sh);c.append(row,box);it._box=box;
 }
 if(RULES[s.part]){const d=el("details","ex-rules");if(s.i===0)d.open=true;d.appendChild(el("summary","",L()==="uk"?"📘 Правило":"📘 Rule"));const r=el("div","ex-rtext");r.innerHTML=RULES[s.part][L()]||RULES[s.part].uk;d.appendChild(r);c.appendChild(d)}
 if(it.prompt){const pq=el("div","ex-text ex-speakq");const qt=el("p","ex-q");qt.appendChild(nl(it.prompt));pq.appendChild(qt);const sb=el("button","btn ex-say","🔊");sb.type="button";sb.onclick=()=>say(it.prompt,sb);pq.appendChild(sb);if(UKON()&&it.promptU)pq.appendChild(trEl(it.promptU));c.appendChild(pq)}
 const qh=el("h3","ex-q");
 if(it.gap){qh.appendChild(nl(it.gap))}else if(it.nlQ){qh.textContent=it.q.split(it.nlQ)[0];qh.appendChild(nl(it.nlQ));qh.append(it.q.split(it.nlQ)[1]||"")}else qh.textContent=it.q;
 if(it.kind==="order")qh.textContent=it.prompt?(L()==="uk"?"Склади відповідь: Omdat …":"Build the answer: Omdat …"):u.order;
 if(it.kind==="pick")qh.textContent=L()==="uk"?"Натисни всі іменники в множині (meervoud), потім «Перевірити».":"Tap every plural noun, then «Check».";
 c.appendChild(qh);
 if(it.kind==="mc"){
  const box=el("div","opts ex-opts");
  shuffle(it.o).forEach(o=>{const b=el("button","opt");b.type="button";b.appendChild(it.nlOpts||it.text||it.dlg||it.gap?nl(o):el("span","",o));b.onclick=()=>answer(o===it.ok,b,box);box.appendChild(b)});
  c.appendChild(box);
 }else if(it.kind==="type"){
  const f=el("form","g-type ex-typef"),inp=el("input");inp.type="text";inp.autocomplete="off";inp.setAttribute("autocapitalize","off");inp.setAttribute("spellcheck","false");inp.lang="nl";inp.placeholder=L()==="uk"?"Напиши множину…":"Type the plural…";
  const b=el("button","btn primary",u.check);b.type="submit";f.append(inp,b);
  f.onsubmit=e=>{e.preventDefault();const v=inp.value.trim().toLowerCase().replace(/[’`´]/g,"'");if(!v)return;inp.disabled=true;const ok=it.acc.some(a=>a.toLowerCase().replace(/[’]/g,"'")===v);inp.classList.add(ok?"ok":"bad");answer(ok,null,f)};
  c.appendChild(f);setTimeout(()=>{try{inp.focus()}catch(e){}},50);
 }else if(it.kind==="pick"){
  const box=el("div","ex-pick"),sel=new Set(),norm2=w=>w.toLowerCase().replace(/[.,:!?]/g,"").replace(/[’']/g,"’");
  it.ptext.split(/\s+/).forEach((w,i)=>{const b=el("button","ex-word");b.type="button";b.appendChild(nl(w));b.dataset.w=norm2(w);b.onclick=()=>{if(b.disabled)return;b.classList.toggle("on");b.classList.contains("on")?sel.add(i):sel.delete(i)};box.appendChild(b)});
  const chk=el("button","btn primary",u.check);chk.type="button";
  chk.onclick=()=>{const T=new Set(it.targets.map(norm2));let ok=true;box.querySelectorAll(".ex-word").forEach(b=>{const on=b.classList.contains("on"),t=T.has(b.dataset.w);if(on&&t)b.classList.add("good");else if(on&&!t){b.classList.add("bad");ok=false}else if(!on&&t){b.classList.add("miss");ok=false}});chk.remove();answer(ok,null,box)};
  c.append(box,chk);
 }else{
  const line=el("div","ex-line"),pool=el("div","ex-pool"),picked=[];
  const draw=()=>{line.replaceChildren(...picked.map(w=>nl(w)));};
  shuffle(it.w).forEach(w=>{const b=el("button","opt ex-chip");b.type="button";b.appendChild(nl(w));b.onclick=()=>{if(b.disabled)return;picked.push(w);b.disabled=true;draw();if(picked.length===it.w.length){const ok=picked.join(" ")===it.a;answer(ok,null,pool,it.a)}};pool.appendChild(b)});
  const clr=el("button","btn",u.clear);clr.type="button";clr.onclick=()=>{picked.length=0;pool.querySelectorAll("button").forEach(b=>b.disabled=false);draw()};
  c.append(line,pool,clr);
 }
}
function answer(ok,btn,box,orderAnswer){
 const u=U(),s=QZ,it=s.items[s.i],c=$("card");
 box.querySelectorAll("button").forEach(b=>{b.disabled=true;if(it.kind==="mc"&&b.textContent===it.ok)b.classList.add("correct")});
 if(btn&&!ok)btn.classList.add("incorrect");
 if(ok)s.right++;else s.miss.push(it);
 s.i++;qzSave();s.i--; // the answer counts even if the learner leaves now
 const fb=el("div","ex-fb "+(ok?"ok":"bad"));fb.appendChild(el("strong","",ok?u.right:u.wrong+" "));
 if(!ok&&it.kind!=="pick"){fb.appendChild(nl(it.kind==="order"?it.a:it.ok))}
 if(it.kind==="pick")fb.appendChild(el("p","",(L()==="uk"?"Множина в тексті: ":"Plurals: ")+it.ok));
 if(it.kind==="pick"&&UKON()&&it.textUk){const d2=el("details","ex-trbox");d2.append(el("summary","","🇺🇦 Переклад"),trEl(it.textUk,"p"));fb.appendChild(d2)}
 if(UKON()){
  if(it.full||it.kind==="order"){const sx=el("p","ex-full");sx.appendChild(nl(it.full||it.a));fb.appendChild(sx);if(it.u)fb.appendChild(trEl(it.u,"p"))}
  if(it.pair){const sx=el("p","ex-full");sx.appendChild(nl(it.pair[0]));sx.append(" — "+it.pair[1]);fb.appendChild(sx)}
  box.querySelectorAll(".opt").forEach(b=>{const u2=OPT_UK[b.textContent];if(u2&&!b.querySelector(".ex-tr"))b.appendChild(trEl(u2))});
  if(it._textEl&&it.text.uk&&!it._textEl.querySelector(".ex-tr")){const d2=el("details","ex-trbox");d2.open=true;d2.append(el("summary","","🇺🇦 Переклад"),trEl(it.text.uk,"p"));it._textEl.appendChild(d2)}
  if(it._box)it._box.querySelectorAll(".ex-tr").forEach(x=>x.hidden=false);
 }
 if(it.e)fb.appendChild(el("p","",it.e));
 c.appendChild(fb);
 if(it._box&&it._box.hidden){it._box.hidden=false}
 if(it.gap||it.kind==="order"||it.kind==="type")say(it.kind==="order"?it.a:it.full.replace(/^.*→\s*/,""));
 const nx=el("button","btn primary ex-next",u.next);nx.type="button";nx.id="nx";nx.onclick=()=>{s.i++;if(s.i<s.items.length){qzSave();ask()}else end()};c.appendChild(nx);
 setTimeout(()=>{try{nx.scrollIntoView({block:"nearest",behavior:"smooth"})}catch(e){}},30);
}
function end(){
 const u=U(),s=QZ,n=s.items.length,pct=Math.round(s.right/n*100),title=u.parts[s.part][0]+" "+u.parts[s.part][1];
 const c=head(title,u.done);bar(1);
 qzClear(s.part);const prev=(st().best||{})[s.part];setBest(s.part,pct);
 const xp=Math.max(0,s.right-Math.round((prev||0)/100*n))*5;if(xp)addXP(xp);
 const box=el("div","ex-end");box.append(el("div","ex-big",pct>=70?"🏆":"💪"),el("h2","",pct+"%"),el("p","ex-score",u.score(s.right,n)+(xp?" · +"+xp+" ⭐":"")));
 if(s.part==="proef"){const m=Math.round((Date.now()-s.t0)/60000);box.appendChild(el("p","ex-hint",u.timer+": "+m+" min"))}
 if(s.miss.length){box.appendChild(el("h3","",u.repeat));const ul=el("ul","ex-miss");s.miss.forEach(it=>{const li=el("li","");li.append(el("span","",(it.gap||it.q||u.order)+" → "));li.appendChild(nl(it.kind==="order"?it.a:it.ok));ul.appendChild(li)});box.appendChild(ul)}
 c.appendChild(box);
 const row=el("div","row");const a=el("button","btn primary",u.restart);a.type="button";a.id="nx";a.onclick=()=>quiz(s.part,true);const h=el("button","btn",u.back);h.type="button";h.onclick=home;row.append(a,h);c.appendChild(row);
}

// ---------------- WRITING ----------------
function writePick(){
 const u=U(),c=head(u.parts.schrijven[0]+" "+u.parts.schrijven[1],"");
 c.appendChild(el("p","ex-sub",u.parts.schrijven[2]));
 WRITE.forEach((w,i)=>{const b=el("button","btn toets-pick ex-wpick");b.type="button";b.dataset.write=w.id;b.append(el("span","tp-no",String(i+1)));const tx=el("span","tp-text");tx.appendChild(el("strong","",tr(w.title)));const d=(st().draft||{})[w.id];if(d)tx.appendChild(el("small","tp-meta","✎ "+d.trim().split(/\s+/).length+" woorden"));b.appendChild(tx);b.onclick=()=>write(w);c.appendChild(b)});
}
function write(w){
 const u=U(),c=head(u.parts.schrijven[0]+" "+u.parts.schrijven[1],tr(w.title));
 c.appendChild(el("h3","ex-q",tr(w.title)));
 if(w.card){const box=el("div","ex-text ex-card");box.appendChild(nl(w.card));if(UKON()&&w.card_uk){const d2=el("details","ex-trbox");d2.append(el("summary","","🇺🇦 Переклад"),trEl(w.card_uk,"p"));box.appendChild(d2)}c.appendChild(box)}
 const tk=el("p","ex-task");tk.append(el("b","",u.wTask+": "));tk.appendChild(nl(w.task));if(UKON()&&w.task_uk)tk.appendChild(trEl(w.task_uk,"span"));c.appendChild(tk);
 const ta=el("textarea","ex-ta");ta.rows=10;ta.lang="nl";ta.placeholder=u.wWrite;ta.setAttribute("spellcheck","false");ta.value=((st().draft||{})[w.id])||"";
 ta.oninput=()=>{const s=st();s.draft=s.draft||{};s.draft[w.id]=ta.value;save(s)};
 c.append(ta,el("small","ex-hint",u.wSaved));
 const res=el("div","ex-check");const model=el("div","ex-text ex-model");model.hidden=true;model.appendChild(nl(w.model));if(UKON()&&w.model_uk){const d2=el("details","ex-trbox");d2.open=true;d2.append(el("summary","","🇺🇦 Переклад"),trEl(w.model_uk,"p"));model.appendChild(d2)}
 const row=el("div","row"),ck=el("button","btn primary",u.wCheck),md=el("button","btn",u.wModel);ck.type=md.type="button";
 ck.onclick=()=>{
  const t=ta.value.trim();res.replaceChildren(el("strong","",u.wTips));const ul=el("ul","ex-list");let okN=0;
  w.checks.forEach(([lbl,re])=>{const ok=re.test(t);if(ok)okN++;const li=el("li",ok?"ok":"bad",(ok?"✅ ":"⬜ ")+lbl);ul.appendChild(li)});
  const sents=t.split(/(?<=[.!?])\s+|\n+/).map(x=>x.trim()).filter(x=>x.length>2&&!/^(hallo|beste|dag|hoi|lieve|groetjes|groeten)\b/i.test(x)&&!/,$/.test(x)&&x.split(/\s+/).length>1);
  const cap=sents.filter(x=>!/^[A-Z’'0-9]/.test(x)),dot=sents.filter(x=>!/[.!?]$/.test(x));
  [[cap.length===0,L()==="uk"?"Кожне речення з великої літери":"Every sentence starts with a capital"],[dot.length===0,L()==="uk"?"Кожне речення закінчується . ! або ?":"Every sentence ends with . ! or ?"],[sents.length>=5,(L()==="uk"?"Щонайменше 5 речень (зараз: ":"At least 5 sentences (now: ")+sents.length+")"],[/\n\s*[A-Z][a-z]+\s*$/.test(t)||/groetjes,?\s*\n?\s*\S+\s*$/i.test(t),L()==="uk"?"Ім’я в кінці":"Your name at the end"]].forEach(([ok,lbl])=>{if(ok)okN++;ul.appendChild(el("li",ok?"ok":"bad",(ok?"✅ ":"⬜ ")+lbl))});
  res.appendChild(ul);
  const tips=COMMON.filter(([re])=>re.test(t));if(tips.length){const tl=el("ul","ex-list warn");tips.forEach(([,m])=>tl.appendChild(el("li","bad","⚠️ "+tr(m))));res.appendChild(tl)}
  const total=w.checks.length+4,pct=Math.round(okN/total*100);setBest("schrijven",pct);bar(okN/total);
  if(pct===100&&!tips.length)toast("🏆 "+pct+"%");
 };
 md.onclick=()=>{model.hidden=!model.hidden;md.textContent=model.hidden?u.wModel:u.wHideModel};
 row.append(ck,md);
 if(typeof AI_ENDPOINT!=="undefined"&&AI_ENDPOINT){const ai=el("button","btn",(U().wAi).replace(/Peter/g,typeof cx==="function"?cx("{N}"):"Peter"));ai.type="button";ai.onclick=()=>{const t=ta.value.trim();if(t.length<20){toast(U().wAiEmpty);return}
  askStart({focus:"exam11",send:"Kijk mijn e-mail na (examen 1.1). Opdracht: "+w.task+(w.card?"\nUitnodiging: "+w.card.replace(/\n/g," "):"")+"\n\nMijn e-mail:\n"+t})};row.appendChild(ai)}
 c.append(row,res,model);
}

// ---------------- SPEAKING ----------------
function speakPick(){
 const u=U(),c=head(u.parts.spreken[0]+" "+u.parts.spreken[1],""),s=st();
 c.appendChild(el("p","ex-sub",u.parts.spreken[2]));
 SPREKEN.forEach((t,i)=>{const okN=((s.sp||{})[t.id]||[]).length;const b=el("button","btn toets-pick");b.type="button";b.dataset.speak=t.id;b.append(el("span","tp-no",String(i+1)));const tx=el("span","tp-text");tx.append(el("strong","",tr(t.t)),el("small","tp-meta",u.sDone(okN,t.qa.length)));b.appendChild(tx);if(okN>=t.qa.length)b.classList.add("passed");const pos=((s.spPos||{})[t.id])||0;if(pos>0&&pos<t.qa.length)tx.appendChild(el("small","tp-nl",(L()==="uk"?"Продовжити з питання ":"Continue at question ")+(pos+1)));b.onclick=()=>speak(t,pos>0&&pos<t.qa.length?pos:0);c.appendChild(b)});
}
const norm=x=>String(x).toLowerCase().replace(/[’']/g,"'").replace(/[^a-z0-9à-ÿ' ]+/g," ").replace(/\s+/g," ").trim();
function speak(topic,i){
 const u=U(),qa=topic.qa[i],c=head(u.parts.spreken[0]+" "+tr(topic.t),u.q+" "+(i+1)+" "+u.of+" "+topic.qa.length);bar(i/topic.qa.length);
 const q=el("div","ex-text ex-speakq");const qb=el("button","btn ex-say",u.sAsk);qb.type="button";qb.onclick=()=>say(qa[0],qb);q.append(qb);const qt=el("p","ex-q");qt.appendChild(nl(qa[0]));q.appendChild(qt);c.appendChild(q);
 setTimeout(()=>say(qa[0]),250);
 const out=el("div","ex-check"),model=el("div","ex-text ex-model");model.hidden=true;model.append(el("small","",u.sModel+" "));model.appendChild(nl(qa[1]));const mb=el("button","btn ex-say","🔊");mb.type="button";mb.onclick=()=>say(qa[1],mb);model.appendChild(mb);if(UKON()&&qa[3]){model.appendChild(trEl("🇺🇦 "+qa[2]+" — "+qa[3],"p"))}
 const row=el("div","row");
 const mic=el("button","btn primary",u.sSpeak);mic.type="button";
 const hasSR=!!(window.SpeechRecognition||window.webkitSpeechRecognition);if(!hasSR)mic.hidden=true;
 let job=null;
 const judge=alts=>{const said=alts[0]||"";const words=norm(qa[1]).split(" ").filter(w=>w.length>2),got=norm(alts.join(" "));const hit=words.filter(w=>got.includes(w)).length,good=hit/Math.max(1,words.length)>=.6;
  out.replaceChildren(el("small","",u.sHeard),nl(" «"+said+"» "),el("span",good?"ex-good":"ex-meh",good?" 👍":" 🙂"));model.hidden=false};
 mic.onclick=()=>{
  if(mic.classList.contains("rec")){job&&job.stop();return}
  mic.classList.add("rec");mic.textContent=L()==="uk"?"⏹ Готово":"⏹ Done";out.replaceChildren(el("small","",L()==="uk"?"Говори — я слухаю…":"Speak — I'm listening…"));
  const reset=()=>{mic.classList.remove("rec");mic.textContent=u.sSpeak;job=null};
  if(typeof listenLong==="function")job=listenLong({onInterim:t=>{out.replaceChildren(el("small","",u.sHeard),nl(" «"+t+"»"))},onDone:alts=>{reset();judge(alts)},onFail:()=>{reset();model.hidden=false}});
  else listenOnce(alts=>{reset();judge(alts)},()=>{reset();model.hidden=false});
 };
 const sh=el("button","btn",u.sShow);sh.type="button";sh.onclick=()=>{model.hidden=false;say(qa[1])};
 row.append(mic,sh);c.append(row,out,model);
 const mark=el("div","row ex-mark");const ok=el("button","btn ex-ok",u.sOk),re=el("button","btn",u.sRe);ok.type=re.type="button";
 const go=good=>{const s=st();s.sp=s.sp||{};const a=new Set(s.sp[topic.id]||[]);good?a.add(i):a.delete(i);s.sp[topic.id]=[...a];save(s);
  const all=SPREKEN.reduce((n,t)=>n+t.qa.length,0),done=SPREKEN.reduce((n,t)=>n+((s.sp[t.id]||[]).length),0);setBestRaw("spreken",Math.round(done/all*100));
  {const s2=st();s2.spPos=s2.spPos||{};s2.spPos[topic.id]=i+1<topic.qa.length?i+1:0;save(s2)}
  i+1<topic.qa.length?speak(topic,i+1):speakPick()};
 ok.onclick=()=>go(true);re.onclick=()=>go(false);mark.append(ok,re);c.appendChild(mark);
}
function setBestRaw(part,pct){const s=st();s.best=s.best||{};s.best[part]=pct;save(s)}

// ---------------- PUBLIC ----------------
function texts(){ // every Dutch text this module can speak (for tools/collect-audio-texts.js)
 const out=[];Object.values(DLG).forEach(d=>d.forEach(l=>out.push(l[1])));
 GRAM.forEach(g=>out.push(g.w?g.a:g.s.replace("___",g.o[0]).replace(/\s*\(.*\)\s*$/,"").replace(/\s*→.*$/,"")));
 SPREKEN.forEach(t=>t.qa.forEach(([q,a])=>{out.push(q);out.push(a)}));
 MV.forEach(m=>out.push(m[0].replace("___",m[2].split("|")[0])));OM.forEach(o=>{out.push(o[0]);out.push(o[1])});OM_MC.forEach(o=>out.push(o[0]));
 return out;
}
function speakScript(){ // mock speaking exam for the AI: 6 topics in course order, ~22 questions
 const take={dag:[4,true],graag:[3,true],afspraak:[5,false],dokter:[4,false],eten:[3,true],advies:[3,true]};
 const out=[];SPREKEN.forEach((t,ti)=>{const [n,rnd]=take[t.id]||[3,true];let qa=t.qa.slice();if(rnd){const first=qa[0];qa=[first,...shuffle(qa.slice(1))]}qa.slice(0,n).forEach(x=>out.push({q:x[0],ti:ti+1,tn:tr(t.t)}))});
 return out;
}
function chips(){return L()==="uk"?["Дай мені вправу на читання (запрошення)","Потренуй мене: omdat чи want","5 речень на niet / geen","Які питання будуть на говорінні?","Перевір: Beste Rita, bedenkt voor de uitnodiging. Ik kan niet komen."]:["Give me a reading exercise (invitation)","Practise omdat vs want with me","5 sentences with niet / geen","Which questions come in the speaking exam?","Check: Beste Rita, bedenkt voor de uitnodiging. Ik kan niet komen."]}
window.EXAM11={open:home,texts,chips,speakScript,data:{LEZEN,LUISTEREN,WOORDEN,GRAM,WRITE,SPREKEN,DLG,TEXTS},_quiz:quiz,_write:write,_speak:speak};
})();
