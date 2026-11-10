// Story 1 of LerenBe LIFE: «Перший день у Бельгії» (Flemish Dutch, A1). Olena arrives in Ghent; Annick (a volunteer
// buddy) meets her at the station, takes her home by tram, shows the flat; the neighbour Jan says hello; plan for
// tomorrow (the town hall — story 2). Step types: line, reply, listen, find, say — see modules/learn-life/story-engine.mjs.
// Every Dutch line is natural spoken Flemish at A1; `repeat` options let the learner ask again instead of guessing.
export const firstDay = {
 id: 'first-day',
 lang: 'nl',
 level: 'A1',
 icon: '🏡',
 title: 'Перший день у Бельгії',
 subtitle: 'Тебе зустрічають на вокзалі в Генті. Познайомся, доїдь додому трамваєм, роздивись квартиру й привітайся із сусідом.',
 cast: {
  annick: {name: 'Annick', icon: '👩🏼', voice: 'f', role: 'волонтерка, допомагає в перші дні'},
  jan: {name: 'Jan', icon: '👴🏻', voice: 'm', role: 'сусід'}
 },
 scenes: [
  {id: 'station', icon: '🚉', title: 'На вокзалі Gent-Sint-Pieters', steps: [
   {type: 'line', who: 'annick', nl: 'Hallo! Ben jij Olena?', uk: 'Привіт! Ти Олена?'},
   {type: 'reply', prompt: 'Що відповіси?', options: [
    {nl: 'Ja, dat ben ik!', uk: 'Так, це я!', ok: true},
    {nl: 'Sorry, ik begrijp het niet.', uk: 'Вибач, я не розумію.', repeat: true},
    {nl: 'Nee, ik woon in Gent.', uk: 'Ні, я живу в Генті.', why: 'Вона питає, чи ти Олена. Ben jij…? — «Ти…?»'}]},
   {type: 'line', who: 'annick', nl: 'Welkom in Gent! Ik ben Annick. Ik help je vandaag.', uk: 'Ласкаво просимо до Гента! Я Анік. Я сьогодні тобі допомагаю.'},
   {type: 'reply', prompt: 'Привітайся у відповідь.', options: [
    {nl: 'Aangenaam, Annick!', uk: 'Приємно познайомитися, Анік!', ok: true},
    {nl: 'Tot ziens!', uk: 'До побачення!', why: 'Tot ziens — це прощання, а ви щойно зустрілися.'},
    {nl: 'Kunt u dat herhalen, alstublieft?', uk: 'Можете повторити, будь ласка?', repeat: true}]},
   {type: 'line', who: 'annick', nl: 'Was de reis goed?', uk: 'Добре доїхала?'},
   {type: 'reply', prompt: 'Скажи, що так, але ти трохи втомилася.', options: [
    {nl: 'Ja, maar ik ben een beetje moe.', uk: 'Так, але я трохи втомилася.', ok: true, react: {who: 'annick', nl: 'Dat begrijp ik. We gaan snel naar huis.', uk: 'Розумію. Швидко поїдемо додому.'}},
    {nl: 'Ja, de reis was goed, dank je.', uk: 'Так, поїздка була добра, дякую.', ok: true, react: {who: 'annick', nl: 'Fijn om te horen!', uk: 'Приємно чути!'}},
    {nl: 'Ik ben dertig jaar.', uk: 'Мені тридцять років.', why: 'Це про вік. Moe — втомлений(-а).'},
    {nl: 'Kun je wat trager spreken?', uk: 'Можеш говорити трохи повільніше?', repeat: true}]},
   {type: 'line', who: 'annick', nl: 'Heb je al een ticket voor de tram?', uk: 'У тебе вже є квиток на трамвай?'},
   {type: 'reply', prompt: 'Що відповіси? Підходить кілька відповідей — історія піде по-різному.', explain: 'Ticket — квиток. Анік питає, чи є в тебе квиток на трамвай.', options: [
    {nl: 'Ja, ik heb al een ticket.', uk: 'Так, у мене вже є квиток.', ok: true, set: {ticket: 'had'}, react: {who: 'annick', nl: 'Top! Dan gaan we meteen naar de tram.', uk: 'Чудово! Тоді одразу йдемо до трамвая.'}},
    {nl: 'Nee, waar kan ik een ticket kopen?', uk: 'Ні, де я можу купити квиток?', ok: true, set: {ticket: 'buy'}, react: {who: 'annick', nl: 'Aan de automaat daar. Kom, ik toon het je.', uk: 'В автоматі он там. Ходімо, я покажу.'}},
    {nl: 'Sorry, ik begrijp het niet.', uk: 'Вибач, я не розумію.', repeat: true},
    {nl: 'Ja, ik ben moe.', uk: 'Так, я втомилася.', why: 'Питання про квиток (ticket). Ja, ik heb al een ticket — або Nee, waar kan ik een ticket kopen?'}]}]},

  {id: 'machine', icon: '🎫', title: 'Квиток в автоматі', if: {ticket: 'buy'}, steps: [
   {type: 'listen', who: 'annick', nl: 'Kies hier: één rit. Dat kost drie euro.', uk: 'Вибери тут: одна поїздка. Це коштує три євро.',
    q: 'Що вибрати й скільки це коштує?', options: ['одна поїздка, €3', 'денний квиток, €3', 'одна поїздка, €13'], answer: 0, why: 'één rit — одна поїздка; drie euro — три євро (dertien = 13).'},
   {type: 'reply', prompt: 'Запитай, чи можна заплатити карткою.', options: [
    {nl: 'Kan ik met de kaart betalen?', uk: 'Можна заплатити карткою?', ok: true, react: {who: 'annick', nl: 'Ja, met Bancontact. Hou je kaart hier.', uk: 'Так, Bancontact. Прикладай картку сюди.'}},
    {nl: 'Hoe laat is het?', uk: 'Котра година?', why: 'Ти питаєш про оплату: Kan ik met de kaart betalen?'},
    {nl: 'Kun je dat herhalen?', uk: 'Можеш повторити?', repeat: true}]},
   {type: 'say', nl: 'Eén rit, alstublieft.', uk: 'Одну поїздку, будь ласка.', tip: 'één rit — одна поїздка; alstublieft — будь ласка (ввічливо).'}]},

  {id: 'meet', icon: '🤝', title: 'Знайомимося', steps: [
   {type: 'line', who: 'annick', nl: 'Waar kom je vandaan?', uk: 'Звідки ти?'},
   {type: 'say', nl: 'Ik kom uit Oekraïne.', uk: 'Я з України.', tip: 'uit — «з» (країни): Ik kom uit Oekraïne.'},
   {type: 'line', who: 'annick', nl: 'Spreek je al Nederlands?', uk: 'Ти вже говориш нідерландською?'},
   {type: 'reply', prompt: 'Скажи, що трохи, і що ти вчиш нідерландську.', options: [
    {nl: 'Een beetje. Ik leer Nederlands.', uk: 'Трохи. Я вчу нідерландську.', ok: true},
    {nl: 'Ja, ik ben moe.', uk: 'Так, я втомилася.', why: 'Питання про мову: Spreek je Nederlands? — Een beetje (трохи).'},
    {nl: 'Sorry, wat zeg je?', uk: 'Вибач, що ти кажеш?', repeat: true}]},
   {type: 'line', who: 'annick', nl: 'Super! Dan oefenen we samen.', uk: 'Супер! Тоді потренуємося разом.'}]},

  {id: 'tram', icon: '🚋', title: 'Трамваєм додому', steps: [
   {type: 'listen', who: 'annick', nl: 'We nemen tram 1, richting Evergem.', uk: 'Ми сідаємо на трамвай 1 у напрямку Евергем.',
    q: 'На що ви сідаєте?', options: ['🚋 трамвай 1', '🚋 трамвай 4', '🚌 автобус 1'], answer: 0, why: 'tram 1 — трамвай номер один; richting — напрямок (кінцева зупинка).'},
   {type: 'listen', who: 'annick', nl: 'We stappen uit aan de Korenmarkt.', uk: 'Ми виходимо на Коренмаркт.',
    q: 'Де ви виходите?', options: ['Korenmarkt', 'Evergem', 'біля вокзалу'], answer: 0, why: 'uitstappen — виходити. Evergem — лише напрямок трамвая.'},
   {type: 'line', who: 'annick', nl: 'Vergeet niet je ticket te scannen.', uk: 'Не забудь відсканувати квиток.', if: {ticket: 'had'}},
   {type: 'line', who: 'annick', nl: 'Scan je nieuwe ticket hier, bij de deur.', uk: 'Відскануй свій новий квиток тут, біля дверей.', if: {ticket: 'buy'}},
   {type: 'listen', who: 'annick', nl: 'De volgende keer kan je ook de app van De Lijn gebruiken.', uk: 'Наступного разу можеш також скористатися застосунком De Lijn.',
    q: 'Що ще можна використати для квитка?', options: ['застосунок De Lijn', 'паспорт', 'ключ від квартири'], answer: 0, why: 'De Lijn — фламандський перевізник автобусів і трамваїв; de app — застосунок.'}]},

  {id: 'flat', icon: '🔑', title: 'Твоя квартира', steps: [
   {type: 'line', who: 'annick', nl: 'Dit is je appartement. Kijk maar rond!', uk: 'Це твоя квартира. Роззирнися!'},
   {type: 'find', who: 'annick', prompt: 'Анік питає, де речі. Натисни потрібну.', items: [
    {id: 'key', icon: '🔑', nl: 'de sleutel', uk: 'ключ'},
    {id: 'bed', icon: '🛏️', nl: 'het bed', uk: 'ліжко'},
    {id: 'kitchen', icon: '🍳', nl: 'de keuken', uk: 'кухня'},
    {id: 'bath', icon: '🛁', nl: 'de badkamer', uk: 'ванна кімната'},
    {id: 'window', icon: '🪟', nl: 'het raam', uk: 'вікно'},
    {id: 'heating', icon: '🔥', nl: 'de verwarming', uk: 'опалення'}],
    ask: ['key', 'bath', 'heating']},
   {type: 'listen', who: 'annick', nl: 'De verwarming zet je hier aan. Niet te warm, het is duur!', uk: 'Опалення вмикаєш тут. Не надто тепло, це дорого!',
    q: 'Що радить Анік?', options: ['не вмикати опалення надто сильно', 'відчиняти вікно вночі', 'купити новий обігрівач'], answer: 0, why: 'niet te warm — не надто тепло; duur — дорого.'}]},

  {id: 'neighbour', icon: '🚪', title: 'Сусід Jan', steps: [
   {type: 'line', who: 'jan', nl: 'Goeiedag! Ik ben Jan, uw buurman.', uk: 'Добрий день! Я Ян, ваш сусід.'},
   {type: 'reply', prompt: 'Привітайся й скажи, що живеш тут від сьогодні.', options: [
    {nl: 'Goeiedag! Ik ben Olena. Ik woon hier sinds vandaag.', uk: 'Добрий день! Я Олена. Я живу тут від сьогодні.', ok: true},
    {nl: 'Hoeveel kost het?', uk: 'Скільки це коштує?', why: 'Це питання про ціну. sinds vandaag — від сьогодні.'},
    {nl: 'Sorry, ik begrijp het niet.', uk: 'Вибачте, я не розумію.', repeat: true}]},
   {type: 'listen', who: 'jan', nl: 'Als u iets nodig hebt, bel gerust aan. Ik woon op nummer twaalf.', uk: 'Якщо вам щось знадобиться, сміливо дзвоніть у двері. Я живу в номері дванадцять.',
    q: 'У якому будинку живе Jan?', options: ['12', '20', '2'], answer: 0, why: 'twaalf = 12 (twintig = 20, twee = 2). Jan каже «u» — це ввічлива форма.'},
   {type: 'reply', prompt: 'Подякуй Янові.', options: [
    {nl: 'Dank u wel, dat is vriendelijk!', uk: 'Дуже дякую, це мило!', ok: true},
    {nl: 'Tot morgen in de les.', uk: 'До завтра на уроці.', why: 'Jan не твій вчитель. Dank u wel — ввічлива подяка.'},
    {nl: 'Wat bedoelt u?', uk: 'Що ви маєте на увазі?', repeat: true}]},
   {type: 'line', who: 'jan', nl: 'Komt u zaterdag een kopje koffie drinken?', uk: 'Прийдете в суботу на чашку кави?'},
   {type: 'reply', prompt: 'Jan запрошує тебе на каву. Обидві ввічливі відповіді підходять — Jan запам’ятає.', options: [
    {nl: 'Graag! Hoe laat?', uk: 'Залюбки! О котрій?', ok: true, set: {coffee: 'yes'}, react: {who: 'jan', nl: 'Om drie uur. Tot zaterdag!', uk: 'О третій. До суботи!'}},
    {nl: 'Dat is lief, maar ik drink geen koffie.', uk: 'Це мило, але я не п’ю каву.', ok: true, set: {coffee: 'tea'}, react: {who: 'jan', nl: 'Geen probleem, ik heb ook thee!', uk: 'Не проблема, у мене є й чай!'}},
    {nl: 'Sorry, kunt u dat herhalen?', uk: 'Вибачте, можете повторити?', repeat: true},
    {nl: 'Nee, ik woon op nummer twaalf.', uk: 'Ні, я живу в номері дванадцять.', why: 'Номер 12 — це дім Яна. Він запрошує на каву: Graag! — або ввічливо відмовитися.'}]}]},

  {id: 'tomorrow', icon: '🏛️', title: 'План на завтра', steps: [
   {type: 'listen', who: 'annick', nl: 'Morgen gaan we samen naar het gemeentehuis. Om tien uur, oké?', uk: 'Завтра ми разом підемо до комуни (gemeentehuis). О десятій, добре?',
    q: 'Куди й коли ви йдете завтра?', options: ['до комуни о 10:00', 'на вокзал о 2:00', 'у супермаркет о 10:00'], answer: 0, why: 'om tien uur — о десятій; het gemeentehuis — комуна, там реєструють адресу.'},
   {type: 'listen', who: 'annick', nl: 'Neem je paspoort mee!', uk: 'Візьми з собою паспорт!',
    q: 'Що треба взяти?', options: ['паспорт', 'ключ від квартири', 'квиток на трамвай'], answer: 0, why: 'meenemen — взяти з собою; je paspoort — твій паспорт.'},
   {type: 'say', nl: 'Tot morgen, Annick!', uk: 'До завтра, Анік!', tip: 'Tot morgen — до завтра; tot ziens — до побачення.'},
   {type: 'line', who: 'annick', nl: 'Slaap lekker en tot morgen!', uk: 'Солодких снів і до завтра!'}]}
 ]
};
