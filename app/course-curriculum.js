/* Course 1.1 follows the twelve chapter outlines supplied by the learner.
 * Course 1.2: original practice based on PCVO Moderne Talen's NT2 1.2 outcomes.
 * See COURSE-CURRICULUM.md. Stable legacy card IDs deliberately remain intact. */
globalThis.LerenCurriculum = (() => {
 const chapters = [
  ['comm','Wie ben jij?',['phrases','questions','alphabet']],
  ['people','Wie is dat?',['pronouns','bezit','family','jobs','animals','home','identity','mail']],
  ['nums','Hoeveel?',['numbers','weather','prices']],
  ['travelTime','Hoe laat is het?',['time','clock','transport','city']],
  ['birthday','Wanneer verjaar jij?',['months','birthday']],
  ['opening','Wanneer is de winkel open?',['opening']],
  ['forms','Kunt u dit formulier invullen?',['forms','telefoon','gemeente','cvo','werk']],
  ['dag','Wat doe jij op een dag?',['routine','separable','niet','graag','ex8']],
  ['plans','Ga je mee?',['modal','toekomst','invitation','uitnodigen','ongoing','ex9']],
  ['health','Wat scheelt er?',['body','lichaammv','klachten','doctor','kaartjes','afspraak','instructions','ex10']],
  ['food','Eet jij gezond?',['adjectives','healthy','restaurant','ex11']],
  ['shopping','Wat eten we vandaag?',['shop','groceries','plurals']]
 ];
 const advanced = [
  ['past','⏪ Verleden',['perfectum','verleden']],
  ['holiday','🧳 Familie en vakantie',['holiday']],
  ['travel','🚆 Op reis',['journey']],
  ['service','🛍️ Winkelen en tweedehands',['clothes','colors','market','returns','secondhand']],
  ['wonen','🏡 Wonen',['huren']],
  ['contact','✉️ Berichten en afspraken',['messages','appointments']],
  ['reading','📰 Lezen en reageren',['notices','directions']],
  ['grammar2','📘 Verder met grammatica',['objpron','comparison']]
 ];

 // Practice test of 27 Oct 2026: new cards go into the topic they belong to (nl|uk|en|fr|ar|icon).
 const practice = {
  healthy: `
Je moet minder snoepjes eten.|Тобі треба їсти менше солодощів.|You should eat fewer sweets.|Tu dois manger moins de bonbons.|يجب أن تأكل حلويات أقل.|🍬
Je moet meer vis eten.|Тобі треба їсти більше риби.|You should eat more fish.|Tu dois manger plus de poisson.|يجب أن تأكل المزيد من السمك.|🐟
Je moet minder hamburgers eten.|Тобі треба їсти менше гамбургерів.|You should eat fewer hamburgers.|Tu dois manger moins de hamburgers.|يجب أن تأكل برغر أقل.|🍔
Je moet minder cola drinken.|Тобі треба пити менше коли.|You should drink less cola.|Tu dois boire moins de cola.|يجب أن تشرب كولا أقل.|🥤
Je moet minder koffie drinken.|Тобі треба пити менше кави.|You should drink less coffee.|Tu dois boire moins de café.|يجب أن تشرب قهوة أقل.|☕
Je moet meer groenten eten.|Тобі треба їсти більше овочів.|You should eat more vegetables.|Tu dois manger plus de légumes.|يجب أن تأكل المزيد من الخضار.|🥦
Je moet meer fruit eten.|Тобі треба їсти більше фруктів.|You should eat more fruit.|Tu dois manger plus de fruits.|يجب أن تأكل المزيد من الفاكهة.|🍎
Je moet minder chips eten.|Тобі треба їсти менше чіпсів.|You should eat fewer crisps.|Tu dois manger moins de chips.|يجب أن تأكل شيبس أقل.|🥡
Ik eet 's middags altijd een zak snoepjes.|Удень я завжди з’їдаю пакет цукерок.|In the afternoon I always eat a bag of sweets.|L’après-midi, je mange toujours un sachet de bonbons.|بعد الظهر آكل دائماً كيس حلويات.|🍬
Ik drink meestal cola bij het eten.|Я зазвичай п’ю колу під час їжі.|I usually drink cola with my meal.|Je bois généralement du cola pendant le repas.|أشرب الكولا عادة مع الطعام.|🥤
Ik drink 20 kopjes koffie per dag.|Я п’ю 20 чашок кави на день.|I drink 20 cups of coffee a day.|Je bois 20 tasses de café par jour.|أشرب 20 فنجان قهوة في اليوم.|☕
Ik eet nooit vis.|Я ніколи не їм рибу.|I never eat fish.|Je ne mange jamais de poisson.|لا آكل السمك أبداً.|🐟
Ik eet geen fruit.|Я не їм фруктів.|I don’t eat fruit.|Je ne mange pas de fruits.|لا آكل الفاكهة.|🍎
Ik eet dikwijls chips.|Я часто їм чіпси.|I often eat crisps.|Je mange souvent des chips.|آكل الشيبس كثيراً.|🥡
Ik eet niet gezond.|Я харчуюся нездорово.|I don’t eat healthily.|Je ne mange pas sainement.|لا آكل بشكل صحي.|🍟
het advies|порада|advice|le conseil|النصيحة|💡
het snoepje – de snoepjes|цукерка – цукерки (солодощі)|sweet – sweets|le bonbon – les bonbons|الحلوى – الحلويات|🍬
de hamburger – de hamburgers|гамбургер – гамбургери|hamburger|le hamburger|البرغر|🍔
de chips|чіпси|crisps|les chips|الشيبس|🥡
het kopje koffie|чашка кави|cup of coffee|une tasse de café|فنجان قهوة|☕
de zak snoepjes|пакет цукерок|a bag of sweets|un sachet de bonbons|كيس حلويات|🛍️
`,
  ex8: `
’s morgens – ’s middags – ’s avonds|вранці – вдень – ввечері|in the morning – in the afternoon – in the evening|le matin – l’après-midi – le soir|صباحاً – ظهراً – مساءً|🕒
Om 07:00 u neem ik een douche.|О 07:00 я приймаю душ.|At 7:00 I take a shower.|À 7 h, je prends une douche.|في الساعة 07:00 آخذ دشاً.|🚿
Om 08:15 ontbijt ik.|О 08:15 я снідаю.|At 8:15 I have breakfast.|À 8 h 15, je prends mon petit-déjeuner.|في الساعة 08:15 أتناول الفطور.|🍳
’s Morgens breng ik de kinderen naar school.|Вранці я відвожу дітей до школи.|In the morning I take the children to school.|Le matin, j’emmène les enfants à l’école.|في الصباح أوصل الأطفال إلى المدرسة.|🎒
’s Avonds kook ik.|Ввечері я готую.|In the evening I cook.|Le soir, je cuisine.|في المساء أطبخ.|🍲
Om 18:00 u eet ik een warme maaltijd.|О 18:00 я їм теплу страву (гарячу вечерю).|At 18:00 I eat a hot meal.|À 18 h, je mange un repas chaud.|في الساعة 18:00 آكل وجبة ساخنة.|🍽️
Na de maaltijd kijk ik naar de tv.|Після їжі я дивлюся телевізор.|After the meal I watch TV.|Après le repas, je regarde la télé.|بعد الوجبة أشاهد التلفاز.|📺
Ik ga naar de supermarkt en ik doe boodschappen.|Я йду в супермаркет і роблю покупки.|I go to the supermarket and I do the shopping.|Je vais au supermarché et je fais les courses.|أذهب إلى السوبرماركت وأتسوق.|🛒
Ik lees de krant.|Я читаю газету.|I read the newspaper.|Je lis le journal.|أقرأ الصحيفة.|📰
Ik kijk naar de televisie.|Я дивлюся телевізор.|I watch television.|Je regarde la télévision.|أشاهد التلفاز.|📺
de krant|газета|newspaper|le journal|الصحيفة|📰
de televisie|телевізор|television|la télévision|التلفاز|📺
de warme maaltijd|тепла страва (гарячий обід, вечеря)|hot meal|le repas chaud|الوجبة الساخنة|🍲
het middagmaal|обід (основна їжа вдень)|midday meal|le repas de midi|وجبة الظهيرة|🥪
het avondmaal|вечеря|evening meal|le repas du soir|وجبة المساء|🍽️
`,
  klachten: `
Ik heb pijn aan mijn neus.|У мене болить ніс.|My nose hurts.|J’ai mal au nez.|أشعر بألم في أنفي.|👃
Hij heeft pijn aan zijn neus.|У нього болить ніс.|His nose hurts.|Il a mal au nez.|أنفه يؤلمه.|👃
Hij heeft pijn aan zijn vinger.|У нього болить палець.|His finger hurts.|Il a mal au doigt.|إصبعه يؤلمه.|☝️
Hij heeft pijn aan zijn been.|У нього болить нога.|His leg hurts.|Il a mal à la jambe.|ساقه تؤلمه.|🦵
Hij heeft pijn aan zijn schouder.|У нього болить плече.|His shoulder hurts.|Il a mal à l’épaule.|كتفه يؤلمه.|💪
Hij heeft pijn aan zijn voet.|У нього болить стопа.|His foot hurts.|Il a mal au pied.|قدمه تؤلمه.|🦶
rugpijn, buikpijn, hoofdpijn, tandpijn|в одне слово: біль у спині, животі, голові, зубі|one word: back, stomach, head, tooth pain|en un mot : mal au dos, au ventre, à la tête, aux dents|كلمة واحدة: ألم الظهر والبطن والرأس والأسنان|🤕
pijn aan mijn neus, vinger, voet, schouder|окремими словами: біль у носі, пальці, стопі, плечі|separate words: nose, finger, foot, shoulder pain|en plusieurs mots : mal au nez, au doigt, au pied, à l’épaule|بكلمات منفصلة: ألم في الأنف والإصبع والقدم والكتف|🤕
Ik nies de hele dag.|Я чхаю цілий день.|I sneeze all day.|J’éternue toute la journée.|أعطس طوال اليوم.|🤧
Ik hoest en ik nies dikwijls.|Я кашляю і часто чхаю.|I cough and sneeze often.|Je tousse et j’éternue souvent.|أسعل وأعطس كثيراً.|🤧
Aaatsjie! Ben je allergisch?|Апчхи! У тебе алергія?|Atchoo! Are you allergic?|Atchoum ! Tu es allergique ?|أتشو! هل لديك حساسية؟|🤧
Je hebt koorts: 38° C.|У тебе температура: 38° C.|You have a fever: 38° C.|Tu as de la fièvre : 38 °C.|لديك حمى: 38 درجة.|🌡️
Je moet de siroop 3 keer per dag nemen.|Тобі треба пити сироп 3 рази на день.|You must take the syrup 3 times a day.|Tu dois prendre le sirop 3 fois par jour.|يجب أن تتناول الشراب 3 مرات في اليوم.|🧴
3 keer per dag: ’s morgens, ’s middags en ’s avonds|3 рази на день: вранці, вдень і ввечері|3 times a day: morning, afternoon and evening|3 fois par jour : le matin, l’après-midi et le soir|3 مرات في اليوم: صباحاً وظهراً ومساءً|🔁
Ik kan niet naar de les komen. Ik heb griep.|Я не можу прийти на урок. У мене грип.|I can’t come to the lesson. I have the flu.|Je ne peux pas venir au cours. J’ai la grippe.|لا أستطيع الحضور إلى الدرس. عندي إنفلونزا.|🤒
Dat is spijtig! Wat scheelt er?|Шкода! Що трапилося?|That’s a pity! What’s wrong?|C’est dommage ! Qu’est-ce qui ne va pas ?|هذا مؤسف! ما المشكلة؟|❓
`,
  body: `
de long – de longen|легеня – легені|lung|le poumon|الرئة|🫁
ademen|дихати|to breathe|respirer|يتنفس|🌬️
Ik adem met mijn neus en mijn longen.|Я дихаю носом і легенями.|I breathe with my nose and my lungs.|Je respire avec mon nez et mes poumons.|أتنفس بأنفي ورئتيّ.|🫁
Ik eet, ik spreek en ik drink met mijn mond.|Я їм, говорю і п’ю ротом.|I eat, speak and drink with my mouth.|Je mange, je parle et je bois avec ma bouche.|آكل وأتكلم وأشرب بفمي.|👄
Ik heb 5 vingers aan elke hand en 5 tenen aan elke voet.|У мене по 5 пальців на кожній руці (vingers) і на кожній нозі (tenen).|I have 5 fingers on each hand and 5 toes on each foot.|J’ai 5 doigts à chaque main et 5 orteils à chaque pied.|لدي 5 أصابع في كل يد و5 أصابع في كل قدم.|🖐️
Een kind neemt 1 tablet. Een volwassene neemt 2 tabletten.|Дитина приймає 1 таблетку. Дорослий приймає 2 таблетки.|A child takes 1 tablet. An adult takes 2 tablets.|Un enfant prend 1 comprimé. Un adulte en prend 2.|يتناول الطفل قرصاً واحداً. يتناول البالغ قرصين.|💊
de volwassene – de volwassenen|дорослий – дорослі|adult|l’adulte|البالغ|🧑
`,
  invitation: `
Het spijt me, ik kan niet komen.|Мені шкода, я не можу прийти.|I’m sorry, I can’t come.|Je suis désolé, je ne peux pas venir.|آسف، لا أستطيع الحضور.|😔
Nee, het spijt me, ik ben te moe.|Ні, мені шкода, я надто втомлений.|No, I’m sorry, I’m too tired.|Non, désolé, je suis trop fatigué.|لا، آسف، أنا متعب جداً.|😴
Nee, het spijt me, ik moet koken.|Ні, мені шкода, я маю готувати.|No, I’m sorry, I have to cook.|Non, désolé, je dois cuisiner.|لا، آسف، يجب أن أطبخ.|🍲
Nee, het spijt me, ik heb geen zin.|Ні, мені шкода, я не маю бажання.|No, I’m sorry, I don’t feel like it.|Non, désolé, je n’en ai pas envie.|لا، آسف، ليست لدي رغبة.|🙅
Nee, het spijt me, ik moet poetsen.|Ні, мені шкода, я маю прибирати.|No, I’m sorry, I have to clean.|Non, désolé, je dois faire le ménage.|لا، آسف، يجب أن أنظف.|🧹
Nee, het spijt me, ik heb geen tijd.|Ні, мені шкода, я не маю часу.|No, I’m sorry, I have no time.|Non, désolé, je n’ai pas le temps.|لا، آسف، ليس لدي وقت.|⏳
Nee, het spijt me, ik kan niet: ik moet boodschappen doen.|Ні, мені шкода, я не можу: я маю робити покупки.|No, I’m sorry, I can’t: I have to do the shopping.|Non, désolé, je ne peux pas : je dois faire les courses.|لا، آسف، لا أستطيع: يجب أن أتسوق.|🛒
Bedankt voor de uitnodiging, maar ik kan niet naar het feest komen.|Дякую за запрошення, але я не можу прийти на свято.|Thanks for the invitation, but I can’t come to the party.|Merci pour l’invitation, mais je ne peux pas venir à la fête.|شكراً على الدعوة، لكنني لا أستطيع الحضور إلى الحفلة.|✉️
Waar spreken we af? Aan de ingang van de cinema.|Де зустрічаємося? Біля входу в кінотеатр.|Where shall we meet? At the entrance of the cinema.|On se retrouve où ? À l’entrée du cinéma.|أين نلتقي؟ عند مدخل السينما.|🎬
de tijd|час (вільний час, годинник)|time (free time, clock)|le temps|الوقت|⏳
de keer – drie keer|раз – три рази|time (occasion) – three times|la fois – trois fois|المرة – ثلاث مرات|🔁
de zin (geen zin hebben)|бажання (не мати бажання)|desire (not to feel like it)|l’envie (ne pas en avoir envie)|الرغبة (ليست لدي رغبة)|🙅
Ik ga morgenvroeg wandelen. Ga je mee?|Завтра рано-вранці я йду гуляти. Підеш зі мною?|I’m going for a walk early tomorrow. Are you coming?|Je vais me promener tôt demain matin. Tu viens ?|سأتمشى غداً باكراً. هل تأتي معي؟|🚶
Ik ga in het weekend zwemmen. Ga je mee?|У вихідні я йду плавати. Підеш зі мною?|I’m going swimming at the weekend. Are you coming?|Je vais nager ce week-end. Tu viens ?|سأسبح في عطلة نهاية الأسبوع. هل تأتي معي؟|🏊
Ga je mee naar de markt?|Підеш зі мною на ринок?|Are you coming to the market?|Tu viens au marché ?|هل تأتي معي إلى السوق؟|🧺
Ga je mee naar de zee?|Підеш зі мною на море?|Are you coming to the sea?|Tu viens à la mer ?|هل تأتي معي إلى البحر؟|⛵
Ik ga morgenavond naar een concert. Ga je mee?|Завтра ввечері я йду на концерт. Підеш зі мною?|Tomorrow evening I’m going to a concert. Are you coming?|Demain soir, je vais à un concert. Tu viens ?|غداً مساءً سأذهب إلى حفلة موسيقية. هل تأتي معي؟|🎵
Bij mij thuis.|У мене вдома.|At my place.|Chez moi.|في بيتي.|🏠
Aan de ingang van de cinema.|Біля входу в кінотеатр.|At the entrance of the cinema.|À l’entrée du cinéma.|عند مدخل السينما.|🎬
Nee, ik kan niet. Een andere keer misschien.|Ні, я не можу. Може, іншим разом.|No, I can’t. Another time, maybe.|Non, je ne peux pas. Une autre fois, peut-être.|لا، لا أستطيع. ربما في وقت آخر.|🙅
Het spijt me, ik heb geen tijd: ik moet werken.|Мені шкода, у мене немає часу: я мушу працювати.|I’m sorry, I have no time: I have to work.|Désolé, je n’ai pas le temps : je dois travailler.|آسف، ليس لدي وقت: يجب أن أعمل.|💼
Het spijt me, ik ben te moe.|Мені шкода, я надто втомлений.|I’m sorry, I’m too tired.|Désolé, je suis trop fatigué.|آسف، أنا متعب جداً.|😴
Ik heb geen zin. Een andere keer misschien?|У мене немає бажання. Може, іншим разом?|I don’t feel like it. Another time, maybe?|Je n’ai pas envie. Une autre fois, peut-être ?|ليست لدي رغبة. ربما في وقت آخر؟|🙅
Ik ben te moe.|Я надто втомлений.|I’m too tired.|Je suis trop fatigué.|أنا متعب جداً.|😴
`,
  plurals: `
de neusspray – de neussprays|спрей для носа – спреї для носа|nasal spray|le spray nasal|بخاخ الأنف|👃
het kind – de kinderen|дитина – діти|child – children|l’enfant – les enfants|الطفل – الأطفال|🧒
de dochter – de dochters|дочка – дочки|daughter|la fille|الابنة|👧
de zoon – de zonen|син – сини|son|le fils|الابن|👦
de croissant – de croissants|круасан – круасани|croissant|le croissant|الكرواسان|🥐
de deur – de deuren|двері – двері|door|la porte|الباب|🚪
de sleutel – de sleutels|ключ – ключі|key|la clé|المفتاح|🔑
de agenda – de agenda’s|щоденник – щоденники|diary, planner|l’agenda|المفكرة|📒
de afspraak – de afspraken|домовленість, зустріч – домовленості|appointment|le rendez-vous|الموعد|📅
de zak – de zakken|пакет, мішок – пакети|bag|le sac|الكيس|🛍️
de doos – de dozen|коробка – коробки|box|la boîte|العلبة|📦
de bloemkool – de bloemkolen|цвітна капуста|cauliflower|le chou-fleur|القرنبيط|🥦
het glas|склянка, скло|glass|le verre|الكوب|🥛
`
 };
 // Short, translated names explain the situation before introducing its Dutch title.
 // Each row: Ukrainian, English, French, Arabic; each entry: title, learning goal.
 const topicLabels = {
  comm: [['Знайомство','Вітайся, називай своє ім’я та знайомся з іншими.'],['First introductions','Say hello, give your name and meet someone new.'],['Faire connaissance','Salue, donne ton nom et fais connaissance.'],['التعارف','ألقِ التحية وعرّف بنفسك وتعرّف على الآخرين.']],
  people: [['Люди навколо','Розповідай про себе, сім’ю та людей поруч.'],['People around you','Talk about yourself, your family and people around you.'],['Les gens autour de toi','Parle de toi, de ta famille et de ton entourage.'],['الناس من حولك','تحدث عن نفسك وعائلتك والناس من حولك.']],
  nums: [['Числа, ціни й погода','Рахуй, запитуй ціну та говори про погоду.'],['Numbers, prices & weather','Count, ask about prices and talk about the weather.'],['Nombres, prix et météo','Compte, demande le prix et parle de la météo.'],['الأعداد والأسعار والطقس','عدّ واسأل عن الأسعار وتحدث عن الطقس.']],
  travelTime: [['Котра година?','Називай час і розбирайся в розкладі транспорту.'],['Telling the time','Tell the time and understand transport timetables.'],['Quelle heure est-il ?','Dis l’heure et comprends les horaires de transport.'],['كم الساعة؟','قل الوقت وافهم مواعيد المواصلات.']],
  birthday: [['День народження','Називай дати, свій вік і вітай зі святом.'],['Birthdays','Give dates, say your age and wish someone a happy birthday.'],['Les anniversaires','Donne une date, dis ton âge et souhaite un bon anniversaire.'],['عيد الميلاد','اذكر التواريخ وعمرك وهنّئ الآخرين بعيد ميلادهم.']],
  opening: [['Дні та години роботи','Дізнавайся, коли відкритий магазин і починається заняття.'],['Days & opening hours','Find out when shops open and classes begin.'],['Jours et horaires','Demande quand un magasin ouvre ou un cours commence.'],['الأيام وساعات العمل','اعرف متى تفتح المتاجر وتبدأ الدروس.']],
  forms: [['Анкети й документи','Заповнюй особисті дані та звертайся ввічливо.'],['Forms & documents','Fill in your personal details and speak politely.'],['Formulaires et documents','Remplis tes coordonnées et adresse-toi poliment aux autres.'],['الاستمارات والوثائق','املأ بياناتك الشخصية وتحدث بأدب.']],
  dag: [['Мій звичайний день','Розповідай про щоденні справи й улюблені заняття.'],['My daily routine','Talk about your day and activities you enjoy.'],['Ma journée','Parle de ta routine et de tes activités préférées.'],['يومي المعتاد','تحدث عن يومك والأنشطة التي تحبها.']],
  plans: [['Плани й запрошення','Запрошуй, домовляйся про плани та відповідай на запрошення.'],['Plans & invitations','Make plans, invite someone and reply to invitations.'],['Projets et invitations','Fais des projets, invite quelqu’un et réponds aux invitations.'],['الخطط والدعوات','ضع خططاً وادعُ الآخرين وأجب عن الدعوات.']],
  health: [['Здоров’я та лікар','Пояснюй, що болить, і записуйся до лікаря.'],['Health & the doctor','Explain what hurts and make a doctor’s appointment.'],['Santé et médecin','Explique où tu as mal et prends rendez-vous chez le médecin.'],['الصحة والطبيب','اشرح ما يؤلمك واحجز موعداً عند الطبيب.']],
  food: [['Їжа та корисні звички','Розповідай про харчування й замовляй страви в кафе.'],['Food & healthy habits','Talk about eating habits and order food at a café.'],['Alimentation et bonnes habitudes','Parle de ton alimentation et commande au café.'],['الطعام والعادات الصحية','تحدث عن عاداتك الغذائية واطلب الطعام في المقهى.']],
  shopping: [['Покупки та продукти','Складай список продуктів і купуй потрібну кількість.'],['Groceries & shopping','Make a shopping list and buy the quantities you need.'],['Courses et provisions','Fais une liste de courses et achète les bonnes quantités.'],['التسوق والمواد الغذائية','اكتب قائمة مشتريات واشترِ الكميات التي تحتاجها.']],
  grammar: [['Граматика й вимова','Додаткові тренажери: правила, дієслова та звуки.'],['Grammar & pronunciation','Extra practice with rules, verbs and sounds.'],['Grammaire et prononciation','Entraîne-toi avec les règles, les verbes et les sons.'],['القواعد والنطق','تدريبات إضافية على القواعد والأفعال والأصوات.']],
  past: [['Розповіді про минуле','Розповідай, що робив учора та що вже сталося.'],['Talking about the past','Talk about yesterday and things that have happened.'],['Raconter le passé','Raconte ta journée d’hier et ce qui s’est passé.'],['الحديث عن الماضي','تحدث عما فعلته أمس وما حدث من قبل.']],
  holiday: [['Сім’я та відпустка','Ділися спогадами про родину, подорожі та відпочинок.'],['Family & holidays','Share memories of family, trips and holidays.'],['Famille et vacances','Raconte tes souvenirs de famille, de voyages et de vacances.'],['العائلة والعطلة','شارك ذكريات العائلة والسفر والعطلات.']],
  travel: [['У дорозі','Купуй квитки та розбирайся з пересадками й затримками.'],['On the move','Buy tickets and deal with connections and delays.'],['En voyage','Achète des billets et gère les correspondances et les retards.'],['في الطريق','اشترِ التذاكر وتعامل مع تبديل القطارات والتأخير.']],
  service: [['Магазини та вживані речі','Приміряй одяг, порівнюй ціни й домовляйся про обмін.'],['Shops & second-hand finds','Try on clothes, compare prices and arrange an exchange.'],['Magasins et seconde main','Essaie des vêtements, compare les prix et demande un échange.'],['المتاجر والأشياء المستعملة','جرّب الملابس وقارن الأسعار واطلب الاستبدال.']],
  wonen: [['Оренда житла','Читай оголошення й запитуй про умови оренди.'],['Renting a home','Read adverts and ask about rental conditions.'],['Louer un logement','Lis les annonces et renseigne-toi sur les conditions de location.'],['استئجار سكن','اقرأ الإعلانات واسأل عن شروط الإيجار.']],
  contact: [['Листи та домовленості','Пиши повідомлення, записуйся онлайн і перенось зустрічі.'],['Messages & appointments','Write messages, book online and reschedule appointments.'],['Messages et rendez-vous','Écris des messages, réserve en ligne et déplace un rendez-vous.'],['الرسائل والمواعيد','اكتب رسائل واحجز عبر الإنترنت وغيّر مواعيدك.']],
  reading: [['Читаємо й реагуємо','Розумій оголошення та інструкції, знаходь потрібну інформацію.'],['Reading & responding','Understand notices and instructions and find key information.'],['Lire et réagir','Comprends les annonces et les consignes et trouve les informations utiles.'],['القراءة والتفاعل','افهم الإعلانات والتعليمات واعثر على المعلومات المهمة.']],
  grammar2: [['Граматика в розмові','Порівнюй речі та замінюй іменники займенниками.'],['Grammar in conversation','Compare things and replace nouns with pronouns.'],['La grammaire en conversation','Compare des choses et remplace les noms par des pronoms.'],['القواعد في المحادثة','قارن الأشياء واستبدل الأسماء بالضمائر.']]
 };
 function topicInfo(id,lang='uk') {
  const row=topicLabels[id];if(!row)return null;
  const [title,description]=row[{uk:0,en:1,fr:2,ar:3}[lang]??0];
  const chapter=chapters.findIndex(c=>c[0]===id),advancedIndex=advanced.findIndex(c=>c[0]===id);
  const dutch=chapter>=0?chapters[chapter][1]:advancedIndex>=0?advanced[advancedIndex][1].replace(/^\S+\s/,''):'Grammatica & uitspraak';
  const a2Index=typeof a2!=='undefined'?a2.chapters.findIndex(c=>c[0]===id):-1;
  return {title,description,dutch,number:chapter>=0?chapter+1:a2Index>=0?a2Index+1:advancedIndex>=0?advancedIndex+1:null,image:`./img/topics/${id}.svg`};
 }
 // Rows: Dutch | Ukrainian | English | French | Arabic.
 const lessons = {
  alphabet: ['Алфавіт і написання імені','Alphabet and spelling','Alphabet et épellation','الأبجدية والتهجئة', `
Hoe spel je je naam?|Як пишеться твоє ім’я по літерах?|How do you spell your name?|Comment épelles-tu ton nom ?|كيف تتهجى اسمك؟
Mijn naam begint met een A.|Моє ім’я починається з A.|My name starts with an A.|Mon nom commence par un A.|يبدأ اسمي بحرف A.
Kun je dat spellen?|Можеш сказати це по літерах?|Can you spell that?|Peux-tu épeler cela ?|هل يمكنك تهجئة ذلك؟
Dat is een hoofdletter.|Це велика літера.|That is a capital letter.|C’est une majuscule.|هذا حرف كبير.
Schrijf je naam op.|Запиши своє ім’я.|Write down your name.|Écris ton nom.|اكتب اسمك.
`],
  identity: ['Особисті дані','Personal details','Informations personnelles','المعلومات الشخصية', `
Dit is mijn buurvrouw.|Це моя сусідка.|This is my neighbour.|Voici ma voisine.|هذه جارتي.
Zij komt uit Polen.|Вона з Польщі.|She comes from Poland.|Elle vient de Pologne.|هي من بولندا.
Hij woont in Gent.|Він живе в Генті.|He lives in Ghent.|Il habite à Gand.|يسكن في غنت.
Wij hebben twee kinderen.|У нас двоє дітей.|We have two children.|Nous avons deux enfants.|لدينا طفلان.
Wat is je e-mailadres?|Яка твоя електронна адреса?|What is your email address?|Quelle est ton adresse e-mail ?|ما عنوان بريدك الإلكتروني؟
`],
  prices: ['Ціни й температура','Prices and temperature','Prix et température','الأسعار ودرجة الحرارة', `
Het kost twintig euro.|Це коштує двадцять євро.|It costs twenty euros.|Cela coûte vingt euros.|ثمنه عشرون يورو.
Hoeveel kost een kaartje?|Скільки коштує квиток?|How much is a ticket?|Combien coûte un billet ?|كم ثمن التذكرة؟
Het is vandaag tien graden.|Сьогодні десять градусів.|It is ten degrees today.|Il fait dix degrés aujourd’hui.|درجة الحرارة اليوم عشر درجات.
Het regent vandaag.|Сьогодні йде дощ.|It is raining today.|Il pleut aujourd’hui.|تمطر اليوم.
Dat is samen vijftien euro.|Разом це п’ятнадцять євро.|That is fifteen euros altogether.|Cela fait quinze euros au total.|المجموع خمسة عشر يورو.
`],
  birthday: ['День народження й порядкові числа','Birthdays and ordinal numbers','Anniversaires et nombres ordinaux','أعياد الميلاد والأعداد الترتيبية', `
Wanneer verjaar jij?|Коли в тебе день народження?|When is your birthday?|Quand est ton anniversaire ?|متى عيد ميلادك؟
Ik ben dertig jaar.|Мені тридцять років.|I am thirty years old.|J’ai trente ans.|عمري ثلاثون سنة.
Ik verjaar op de derde mei.|Мій день народження третього травня.|My birthday is on the third of May.|Mon anniversaire est le trois mai.|عيد ميلادي في الثالث من مايو.
Gelukkige verjaardag!|З днем народження!|Happy birthday!|Joyeux anniversaire !|عيد ميلاد سعيد!
Op jouw gezondheid!|За твоє здоров’я!|To your health!|À ta santé !|بصحتك!
`],
  opening: ['Дні й години роботи','Days and opening hours','Jours et heures d’ouverture','الأيام وساعات العمل', `
Wanneer is de winkel open?|Коли магазин відкритий?|When is the shop open?|Quand le magasin est-il ouvert ?|متى يفتح المتجر؟
De winkel is van negen tot zes open.|Магазин відкритий з дев’ятої до шостої.|The shop is open from nine to six.|Le magasin est ouvert de neuf à six heures.|المتجر مفتوح من التاسعة إلى السادسة.
Op zondag zijn we gesloten.|У неділю ми зачинені.|We are closed on Sundays.|Nous sommes fermés le dimanche.|نحن مغلقون يوم الأحد.
De les begint om half negen.|Заняття починається о пів на дев’яту.|The lesson starts at half past eight.|Le cours commence à huit heures et demie.|يبدأ الدرس في الثامنة والنصف.
De film eindigt om tien uur.|Фільм закінчується о десятій.|The film ends at ten.|Le film se termine à dix heures.|ينتهي الفيلم في العاشرة.
Op welke dag heb je les?|У який день у тебе заняття?|On which day do you have class?|Quel jour as-tu cours ?|في أي يوم لديك درس؟
`],
  forms: ['Анкети й офіційне звертання','Forms and polite address','Formulaires et vouvoiement','الاستمارات والخطاب الرسمي', `
Wat is uw geboortedatum?|Яка ваша дата народження?|What is your date of birth?|Quelle est votre date de naissance ?|ما تاريخ ميلادك؟
Waar bent u geboren?|Де ви народилися?|Where were you born?|Où êtes-vous né ?|أين ولدت؟
Vul uw voornaam en familienaam in.|Впишіть своє ім’я та прізвище.|Fill in your first name and surname.|Indiquez votre prénom et votre nom.|اكتب اسمك الأول واسم العائلة.
Mijn postcode is drieduizend.|Мій поштовий індекс — три тисячі.|My postcode is three thousand.|Mon code postal est trois mille.|رمزي البريدي ثلاثة آلاف.
Zet hier uw handtekening.|Поставте тут свій підпис.|Sign here.|Signez ici.|وقّع هنا.
Tienduizend is 10.000.|Десять тисяч — це 10 000.|Ten thousand is 10,000.|Dix mille s’écrit 10 000.|عشرة آلاف هي ١٠٠٠٠.
`],
  invitation: ['Запрошення й вибачення','Invitations and apologies','Invitations et excuses','الدعوات والاعتذار', `
Ga je mee naar het park?|Підеш зі мною до парку?|Will you come to the park with me?|Tu viens au parc avec moi ?|هل تأتي معي إلى الحديقة؟
Ja, graag. Dat is een goed idee.|Так, із задоволенням. Це гарна ідея.|Yes, gladly. That is a good idea.|Oui, volontiers. C’est une bonne idée.|نعم بكل سرور. هذه فكرة جيدة.
Sorry, ik kan niet komen.|Вибач, я не можу прийти.|Sorry, I cannot come.|Désolé, je ne peux pas venir.|آسف، لا أستطيع المجيء.
Ik blijf thuis, want ik ben moe.|Я залишаюся вдома, бо втомився.|I am staying home because I am tired.|Je reste chez moi car je suis fatigué.|سأبقى في المنزل لأنني متعب.
Geen probleem. Tot een andere keer!|Нічого страшного. До іншого разу!|No problem. See you another time!|Pas de problème. À une prochaine fois !|لا مشكلة. إلى مرة أخرى!
`],
  ongoing: ['Що відбувається зараз','What is happening now','Ce qui se passe maintenant','ما يحدث الآن', `
Ik ben aan het koken.|Я зараз готую.|I am cooking.|Je suis en train de cuisiner.|أنا أطبخ الآن.
Wat ben je aan het doen?|Що ти зараз робиш?|What are you doing?|Qu’est-ce que tu es en train de faire ?|ماذا تفعل الآن؟
Zij is aan het lezen.|Вона зараз читає.|She is reading.|Elle est en train de lire.|هي تقرأ الآن.
We zijn aan het eten.|Ми зараз їмо.|We are eating.|Nous sommes en train de manger.|نحن نأكل الآن.
Ga maar zitten.|Сідай, будь ласка.|Please sit down.|Assieds-toi donc.|تفضل بالجلوس.
`],
  instructions: ['Інструкції й пояснення причини','Instructions and reasons','Consignes et raisons','التعليمات والأسباب', `
Ik blijf thuis omdat ik ziek ben.|Я залишаюся вдома, тому що хворий.|I am staying home because I am ill.|Je reste chez moi parce que je suis malade.|سأبقى في المنزل لأنني مريض.
Lees de bijsluiter.|Прочитай інструкцію до ліків.|Read the package leaflet.|Lis la notice.|اقرأ النشرة المرفقة.
Wat betekent deze instructie?|Що означає ця інструкція?|What does this instruction mean?|Que signifie cette consigne ?|ماذا تعني هذه التعليمات؟
Kun je een bericht doorgeven?|Можеш передати повідомлення?|Can you pass on a message?|Peux-tu transmettre un message ?|هل يمكنك نقل رسالة؟
Ik hoest en ik heb keelpijn.|Я кашляю, і в мене болить горло.|I cough and have a sore throat.|Je tousse et j’ai mal à la gorge.|أسعل وأعاني من ألم في الحلق.
`],
  healthy: ['Харчові звички й частота','Eating habits and frequency','Habitudes alimentaires et fréquence','عادات الأكل والتكرار', `
Ik eet elke dag fruit.|Я їм фрукти щодня.|I eat fruit every day.|Je mange des fruits chaque jour.|آكل الفاكهة كل يوم.
Ik drink meestal water.|Я зазвичай п’ю воду.|I usually drink water.|Je bois généralement de l’eau.|أشرب الماء عادة.
Ik eet soms vis.|Я іноді їм рибу.|I sometimes eat fish.|Je mange parfois du poisson.|آكل السمك أحياناً.
Ik eet weinig suiker.|Я їм мало цукру.|I eat little sugar.|Je mange peu de sucre.|آكل القليل من السكر.
Ik wil meer groenten en minder snoep eten.|Я хочу їсти більше овочів і менше цукерок.|I want to eat more vegetables and fewer sweets.|Je veux manger plus de légumes et moins de bonbons.|أريد أن آكل المزيد من الخضار وحلويات أقل.
Ik moet nog ontbijten.|Мені ще треба поснідати.|I still need to have breakfast.|Je dois encore prendre mon petit-déjeuner.|ما زال عليّ تناول الفطور.
`],
  restaurant: ['Замовлення в кафе','Ordering at a café','Commander au café','الطلب في المقهى', `
Mag ik de menukaart?|Можна меню?|May I have the menu?|Puis-je avoir la carte ?|هل يمكنني الحصول على قائمة الطعام؟
Ik wil graag soep.|Я хотів би суп.|I would like soup.|Je voudrais de la soupe.|أود حساءً.
Zonder melk, alstublieft.|Без молока, будь ласка.|Without milk, please.|Sans lait, s’il vous plaît.|بدون حليب من فضلك.
Ik eet geen vlees.|Я не їм м’яса.|I do not eat meat.|Je ne mange pas de viande.|لا آكل اللحم.
Mag ik de rekening?|Можна рахунок?|May I have the bill?|Puis-je avoir l’addition ?|هل يمكنني الحصول على الحساب؟
`],
  groceries: ['Продукти, упаковки й список покупок','Food, packages and shopping lists','Aliments, emballages et liste de courses','الأغذية والعبوات وقائمة التسوق', `
een fles water|пляшка води|a bottle of water|une bouteille d’eau|زجاجة ماء
een pak melk|пакет молока|a carton of milk|une brique de lait|علبة حليب
een kilo appels|кілограм яблук|a kilo of apples|un kilo de pommes|كيلوغرام من التفاح
Wat hebben we nodig?|Що нам потрібно?|What do we need?|De quoi avons-nous besoin ?|ماذا نحتاج؟
Schrijf brood op het boodschappenlijstje.|Запиши хліб у список покупок.|Write bread on the shopping list.|Écris du pain sur la liste de courses.|اكتب الخبز في قائمة التسوق.
De melk staat naast de kaas.|Молоко стоїть поруч із сиром.|The milk is next to the cheese.|Le lait est à côté du fromage.|الحليب بجانب الجبن.
Ik wil pasta maken.|Я хочу приготувати пасту.|I want to make pasta.|Je veux préparer des pâtes.|أريد تحضير المعكرونة.
`],
  plurals: ['Множина іменників','Plural nouns','Pluriel des noms','جمع الأسماء', `
één appel, twee appels|одне яблуко, два яблука|one apple, two apples|une pomme, deux pommes|تفاحة واحدة، تفاحتان
één brood, twee broden|один хліб, два хліби|one loaf, two loaves|un pain, deux pains|رغيف واحد، رغيفان
één ei, zes eieren|одне яйце, шість яєць|one egg, six eggs|un œuf, six œufs|بيضة واحدة، ست بيضات
één fles, drie flessen|одна пляшка, три пляшки|one bottle, three bottles|une bouteille, trois bouteilles|زجاجة واحدة، ثلاث زجاجات
één tomaat, vier tomaten|один помідор, чотири помідори|one tomato, four tomatoes|une tomate, quatre tomates|حبة طماطم واحدة، أربع حبات طماطم
`],
  holiday: ['Сім’я та відпустка','Family and holidays','Famille et vacances','العائلة والعطلة', `
Vorige zomer zijn we naar zee geweest.|Минулого літа ми були на морі.|Last summer we went to the seaside.|L’été dernier, nous sommes allés à la mer.|ذهبنا إلى البحر الصيف الماضي.
We hebben bij mijn zus gelogeerd.|Ми гостювали в моєї сестри.|We stayed with my sister.|Nous avons logé chez ma sœur.|أقمنا عند أختي.
Mijn ouders zijn twintig jaar getrouwd.|Мої батьки одружені двадцять років.|My parents have been married for twenty years.|Mes parents sont mariés depuis vingt ans.|والداي متزوجان منذ عشرين سنة.
Ik heb een kamer voor twee nachten geboekt.|Я забронював кімнату на дві ночі.|I booked a room for two nights.|J’ai réservé une chambre pour deux nuits.|حجزت غرفة لليلتين.
Het ontbijt was inbegrepen.|Сніданок був включений.|Breakfast was included.|Le petit-déjeuner était compris.|كان الفطور مشمولاً.
We hebben veel foto’s gemaakt.|Ми зробили багато фотографій.|We took many photos.|Nous avons pris beaucoup de photos.|التقطنا صوراً كثيرة.
Het regende, maar we hebben toch gewandeld.|Ішов дощ, але ми все одно гуляли.|It rained, but we still went for a walk.|Il pleuvait, mais nous nous sommes quand même promenés.|كانت تمطر، لكننا تمشينا رغم ذلك.
Hoe was jouw vakantie?|Як минула твоя відпустка?|How was your holiday?|Comment se sont passées tes vacances ?|كيف كانت عطلتك؟
`],
  journey: ['Квитки, пересадки й затримки','Tickets, changes and delays','Billets, correspondances et retards','التذاكر والتبديل والتأخير', `
Ik wil een heen-en-terugticket naar Brugge.|Я хочу квиток до Брюгге й назад.|I would like a return ticket to Bruges.|Je voudrais un aller-retour pour Bruges.|أريد تذكرة ذهاب وعودة إلى بروج.
Moet ik in Brussel overstappen?|Мені треба пересідати в Брюсселі?|Do I need to change in Brussels?|Dois-je changer à Bruxelles ?|هل يجب أن أبدل القطار في بروكسل؟
De trein heeft twintig minuten vertraging.|Поїзд запізнюється на двадцять хвилин.|The train is twenty minutes late.|Le train a vingt minutes de retard.|القطار متأخر عشرين دقيقة.
Ik heb mijn aansluiting gemist.|Я пропустив пересадку.|I missed my connection.|J’ai raté ma correspondance.|فاتتني رحلة الربط.
Van welk spoor vertrekt de volgende trein?|З якої колії вирушає наступний поїзд?|Which platform does the next train leave from?|De quel quai part le prochain train ?|من أي رصيف يغادر القطار القادم؟
Is dit ticket ook morgen geldig?|Цей квиток дійсний і завтра?|Is this ticket also valid tomorrow?|Ce billet est-il aussi valable demain ?|هل هذه التذكرة صالحة غداً أيضاً؟
De halte is tijdelijk verplaatst.|Зупинку тимчасово перенесено.|The stop has temporarily moved.|L’arrêt est temporairement déplacé.|تم نقل المحطة مؤقتاً.
Ik ben bij de verkeerde halte uitgestapt.|Я вийшов не на тій зупинці.|I got off at the wrong stop.|Je suis descendu au mauvais arrêt.|نزلت في المحطة الخطأ.
`],
  market: ['На ринку й у супермаркеті','At the market and supermarket','Au marché et au supermarché','في السوق والسوبرماركت', `
Hoeveel kosten deze appels per kilo?|Скільки ці яблука коштують за кілограм?|How much do these apples cost per kilo?|Combien coûtent ces pommes au kilo ?|كم ثمن هذه التفاحات للكيلوغرام؟
Mag het een halve kilo meer zijn?|Можна на пів кілограма більше?|May it be half a kilo more?|Un demi-kilo de plus, ça vous va ?|هل يمكن أن تكون الكمية أكثر بنصف كيلو؟
Deze tomaten zijn goedkoper dan die andere.|Ці помідори дешевші за ті інші.|These tomatoes are cheaper than the other ones.|Ces tomates sont moins chères que les autres.|هذه الطماطم أرخص من الأخرى.
Volgens het prijskaartje kost dit twee euro.|На ціннику написано, що це коштує два євро.|According to the price tag, this costs two euros.|Selon l’étiquette, cela coûte deux euros.|حسب بطاقة السعر، ثمن هذا يوروان.
Er staat een verkeerd bedrag op de kassabon.|У чеку вказана неправильна сума.|There is an incorrect amount on the receipt.|Il y a un montant incorrect sur le ticket de caisse.|يوجد مبلغ خاطئ في الإيصال.
Ik heb drie flessen betaald, maar ik heb er maar twee.|Я заплатив за три пляшки, але в мене лише дві.|I paid for three bottles, but I only have two.|J’ai payé trois bouteilles, mais je n’en ai que deux.|دفعت ثمن ثلاث زجاجات لكن لدي اثنتان فقط.
Is deze aanbieding nog geldig?|Ця акція ще діє?|Is this offer still valid?|Cette offre est-elle encore valable ?|هل هذا العرض ما زال سارياً؟
Kunt u dat voor mij nakijken?|Можете це для мене перевірити?|Could you check that for me?|Pouvez-vous vérifier cela pour moi ?|هل يمكنك التحقق من ذلك من أجلي؟
`],
  returns: ['Одяг, примірка й обмін','Clothes, fitting and exchanges','Vêtements, essayage et échange','الملابس والقياس والاستبدال', `
Kan ik deze jas passen?|Можна приміряти цю куртку?|Can I try on this coat?|Puis-je essayer cette veste ?|هل يمكنني قياس هذه السترة؟
Hebt u een grotere maat?|У вас є більший розмір?|Do you have a larger size?|Avez-vous une taille plus grande ?|هل لديكم مقاس أكبر؟
De mouwen zijn te kort.|Рукави закороткі.|The sleeves are too short.|Les manches sont trop courtes.|الأكمام قصيرة جداً.
Deze broek past beter.|Ці штани сидять краще.|These trousers fit better.|Ce pantalon me va mieux.|هذا البنطال أنسب لي.
Ik heb deze trui gisteren gekocht.|Я купив цей светр учора.|I bought this jumper yesterday.|J’ai acheté ce pull hier.|اشتريت هذه الكنزة أمس.
Kan ik hem omruilen?|Можна його обміняти?|Can I exchange it?|Puis-je l’échanger ?|هل يمكنني استبداله؟
Ik heb de kassabon bij me.|У мене із собою чек.|I have the receipt with me.|J’ai le ticket de caisse avec moi.|لدي الإيصال معي.
Er zit een gat in de stof.|У тканині є дірка.|There is a hole in the fabric.|Il y a un trou dans le tissu.|يوجد ثقب في القماش.
`],
  secondhand: ['Купівля вживаних речей','Buying second-hand items','Achats d’occasion','شراء الأشياء المستعملة', `
Is de fiets nog beschikbaar?|Велосипед ще є в наявності?|Is the bicycle still available?|Le vélo est-il encore disponible ?|هل الدراجة ما زالت متاحة؟
Hoe oud is hij?|Скільки йому років?|How old is it?|Quel âge a-t-il ?|كم عمرها؟
Werken de remmen goed?|Гальма добре працюють?|Do the brakes work well?|Les freins fonctionnent-ils bien ?|هل تعمل المكابح جيداً؟
Mag ik hem eerst proberen?|Можна спочатку його випробувати?|May I try it first?|Puis-je l’essayer d’abord ?|هل يمكنني تجربتها أولاً؟
Kunt u iets van de prijs afdoen?|Можете трохи знизити ціну?|Could you lower the price a little?|Pouvez-vous baisser un peu le prix ?|هل يمكنك تخفيض السعر قليلاً؟
Ik kan hem zaterdag ophalen.|Я можу забрати його в суботу.|I can collect it on Saturday.|Je peux venir le chercher samedi.|يمكنني استلامها يوم السبت.
Is de levering inbegrepen?|Доставку включено?|Is delivery included?|La livraison est-elle comprise ?|هل التوصيل مشمول؟
Ik heb de advertentie op internet gezien.|Я бачив оголошення в інтернеті.|I saw the advertisement online.|J’ai vu l’annonce sur internet.|رأيت الإعلان على الإنترنت.
`],
  messages: ['Листи й повідомлення','Letters and messages','Lettres et messages','الرسائل والمراسلات', `
Bedankt voor uw snelle antwoord.|Дякую за вашу швидку відповідь.|Thank you for your quick reply.|Merci pour votre réponse rapide.|شكراً لردكم السريع.
Ik heb het document als bijlage toegevoegd.|Я додав документ як вкладення.|I attached the document.|J’ai ajouté le document en pièce jointe.|أرفقت المستند.
Kunt u bevestigen dat u mijn bericht hebt ontvangen?|Можете підтвердити, що отримали моє повідомлення?|Could you confirm that you received my message?|Pouvez-vous confirmer que vous avez reçu mon message ?|هل يمكنك تأكيد استلام رسالتي؟
Ik reageer op uw advertentie.|Я відповідаю на ваше оголошення.|I am responding to your advertisement.|Je réponds à votre annonce.|أرد على إعلانكم.
Ik wil graag meer informatie over de cursus.|Я хотів би більше інформації про курс.|I would like more information about the course.|Je voudrais plus d’informations sur le cours.|أود مزيداً من المعلومات عن الدورة.
Helaas kan ik niet deelnemen.|На жаль, я не можу взяти участь.|Unfortunately, I cannot take part.|Malheureusement, je ne peux pas participer.|للأسف لا أستطيع المشاركة.
Ik kijk uit naar uw antwoord.|Чекаю на вашу відповідь.|I look forward to your reply.|J’attends votre réponse avec intérêt.|أتطلع إلى ردكم.
Het adres in uw bericht klopt niet.|Адреса у вашому повідомленні неправильна.|The address in your message is incorrect.|L’adresse dans votre message est incorrecte.|العنوان في رسالتكم غير صحيح.
`],
  appointments: ['Онлайн-запис і зміна зустрічі','Online bookings and changing appointments','Réservations en ligne et changement de rendez-vous','الحجز عبر الإنترنت وتغيير المواعيد', `
Ik heb online een afspraak gemaakt.|Я записався на прийом онлайн.|I made an appointment online.|J’ai pris rendez-vous en ligne.|حجزت موعداً عبر الإنترنت.
Ik heb nog geen bevestiging ontvangen.|Я ще не отримав підтвердження.|I have not received confirmation yet.|Je n’ai pas encore reçu de confirmation.|لم أتلق تأكيداً بعد.
Kan ik mijn afspraak naar vrijdag verplaatsen?|Можна перенести мій запис на п’ятницю?|Can I move my appointment to Friday?|Puis-je déplacer mon rendez-vous à vendredi ?|هل يمكنني نقل موعدي إلى الجمعة؟
Vrijdag past beter dan donderdag.|П’ятниця підходить краще, ніж четвер.|Friday suits me better than Thursday.|Vendredi me convient mieux que jeudi.|الجمعة أنسب لي من الخميس.
Ik moet annuleren omdat mijn trein niet rijdt.|Я мушу скасувати запис, бо мій поїзд не їде.|I have to cancel because my train is not running.|Je dois annuler parce que mon train ne circule pas.|يجب أن ألغي الموعد لأن قطاري لا يعمل.
Welke documenten moet ik meebrengen?|Які документи мені треба принести?|Which documents should I bring?|Quels documents dois-je apporter ?|ما المستندات التي يجب أن أحضرها؟
Ik heb het formulier al ingevuld.|Я вже заповнив анкету.|I have already filled in the form.|J’ai déjà rempli le formulaire.|لقد ملأت الاستمارة بالفعل.
De afspraak is gewijzigd.|Час зустрічі змінено.|The appointment has been changed.|Le rendez-vous a été modifié.|تم تغيير الموعد.
`],
  notices: ['Оголошення й короткі тексти','Notices and short texts','Annonces et textes courts','الإعلانات والنصوص القصيرة', `
Wegens werken is de ingang gesloten.|Через ремонт вхід зачинено.|The entrance is closed due to works.|L’entrée est fermée pour travaux.|المدخل مغلق بسبب الأشغال.
Gebruik de ingang aan de achterkant.|Користуйтеся входом із заднього боку.|Use the entrance at the back.|Utilisez l’entrée à l’arrière.|استخدم المدخل الخلفي.
Inschrijven kan tot en met vrijdag.|Зареєструватися можна до п’ятниці включно.|You can register up to and including Friday.|L’inscription est possible jusqu’à vendredi inclus.|يمكن التسجيل حتى يوم الجمعة ضمناً.
De activiteit gaat door bij slecht weer.|Захід відбудеться і за поганої погоди.|The activity will go ahead in bad weather.|L’activité aura lieu même en cas de mauvais temps.|سيقام النشاط حتى في الطقس السيئ.
Kinderen onder twaalf jaar betalen niet.|Діти до дванадцяти років не платять.|Children under twelve do not pay.|Les enfants de moins de douze ans ne paient pas.|الأطفال دون الثانية عشرة لا يدفعون.
Neem zelf een lunchpakket mee.|Візьміть із собою обід.|Bring your own packed lunch.|Apportez votre pique-nique.|أحضر وجبة غدائك معك.
Ik wil graag op dit bericht reageren.|Я хотів би відповісти на це повідомлення.|I would like to reply to this message.|Je voudrais répondre à ce message.|أود الرد على هذه الرسالة.
Waar kan ik de volledige informatie vinden?|Де знайти повну інформацію?|Where can I find the full information?|Où puis-je trouver toutes les informations ?|أين أجد المعلومات الكاملة؟
`],
  directions: ['Послідовність дій та інструкції','Sequences and instructions','Étapes et consignes','تسلسل الخطوات والتعليمات', `
Eerst kies je een datum, daarna een uur.|Спочатку обираєш дату, потім час.|First choose a date, then a time.|Choisis d’abord une date, puis une heure.|اختر أولاً تاريخاً ثم وقتاً.
Klik op de link om te bevestigen.|Натисніть посилання, щоб підтвердити.|Click the link to confirm.|Cliquez sur le lien pour confirmer.|اضغط على الرابط للتأكيد.
Bewaar de bevestiging op je telefoon.|Збережи підтвердження на телефоні.|Save the confirmation on your phone.|Enregistre la confirmation sur ton téléphone.|احفظ التأكيد على هاتفك.
Je moet het formulier vóór maandag opsturen.|Треба надіслати анкету до понеділка.|You must send the form before Monday.|Tu dois envoyer le formulaire avant lundi.|يجب إرسال الاستمارة قبل الاثنين.
Als je klaar bent, druk je op verzenden.|Коли закінчиш, натисни «надіслати».|When you are ready, press send.|Quand tu as terminé, appuie sur envoyer.|عندما تنتهي اضغط على إرسال.
Ik begrijp de laatste stap niet.|Я не розумію останнього кроку.|I do not understand the last step.|Je ne comprends pas la dernière étape.|لا أفهم الخطوة الأخيرة.
Kunt u het nog eens uitleggen?|Можете пояснити ще раз?|Could you explain it again?|Pouvez-vous l’expliquer encore une fois ?|هل يمكنك شرح ذلك مرة أخرى؟
Daarna krijg je een bevestigingsmail.|Після цього отримаєш лист-підтвердження.|After that you receive a confirmation email.|Ensuite, tu reçois un e-mail de confirmation.|بعد ذلك تصلك رسالة تأكيد.
`],
  comparison: ['Порівняння й вибір','Comparing and choosing','Comparer et choisir','المقارنة والاختيار', `
Deze jas is goedkoper dan die jas.|Ця куртка дешевша за ту.|This coat is cheaper than that coat.|Cette veste est moins chère que celle-là.|هذه السترة أرخص من تلك.
De trein is sneller dan de bus.|Поїзд швидший за автобус.|The train is faster than the bus.|Le train est plus rapide que le bus.|القطار أسرع من الحافلة.
Dit is de goedkoopste kamer.|Це найдешевша кімната.|This is the cheapest room.|C’est la chambre la moins chère.|هذه أرخص غرفة.
Ik reis liever met de trein.|Я волію подорожувати поїздом.|I prefer travelling by train.|Je préfère voyager en train.|أفضل السفر بالقطار.
Deze tas is even groot als die tas.|Ця сумка така сама велика, як та.|This bag is as big as that bag.|Ce sac est aussi grand que celui-là.|هذه الحقيبة بحجم تلك الحقيبة.
Ik vind de blauwe mooier.|Мені більше подобається синя.|I think the blue one is prettier.|Je trouve la bleue plus jolie.|أجد الزرقاء أجمل.
`]
 };

 // One picture per lesson card, in line order (replaces the generic 📖).
 const lessonIcons = {
  alphabet:'🔤 🅰️ 🗣️ 🔠 ✍️', identity:'👩 🌍 🏙️ 🧒 📧', prices:'💶 🎫 🌡️ 🌧️ 🧾',
  birthday:'🎂 🎈 📅 🎉 🥂', opening:'🏪 🕘 🚫 📚 🎬 📅', forms:'📅 📍 📝 📮 ✍️ 🔢',
  invitation:'🌳 👍 🙅 🏠 👋', ongoing:'🍳 ❓ 📖 🍽️ 🪑', instructions:'🤒 💊 ❓ 📨 😷',
  healthy:'🍎 💧 🐟 🥄 🥗 🍳', restaurant:'📋 🍲 🥛 🥩 🧾', groceries:'💧 🥛 🍏 🛒 📝 🧀 🍝',
  plurals:'🍎 🍞 🥚 🧴 🍅', holiday:'🏖️ 👭 💍 🏨 🥐 📸 🌧️ 🧳', journey:'🎫 🔄 ⏱️ 🏃 🚉 ✅ 🚏 🚌',
  market:'🍏 ⚖️ 🍅 🏷️ 🧾 🧴 🛍️ 🔍', returns:'🧥 📏 👕 👖 🧶 🔁 🧾 🕳️', secondhand:'🚲 ⏳ 🛑 🚴 💸 🗓️ 🚚 💻',
  messages:'🙏 📎 ✅ 📰 🎓 😞 📬 📍', appointments:'💻 📩 📅 🗓️ 🚆 📂 📝 🔄', notices:'🚧 🚪 📝 🌧️ 🧒 🥪 💬 ℹ️',
  directions:'📅 🖱️ 📱 📮 📤 🤔 🔁 📧', comparison:'🧥 🚆 🛏️ 🚂 👜 🔵'
 };
 // ---- Course A1.2, part 2 (Nov 2026): everyday life in Flanders. ----
 // Original Leren.be material written against the CEFR A1→A2 "Waystage" goals used for NT2 richtgraad 1.2
 // (short sentences about immediate needs: home, work, health, local services, school, free time, people, plans).
 // Lesson line: nl|uk|en|fr|ar|icon|example nl|example uk. Icons come from the verified 3D set (modules/emoji/cards.js).
 const a12 = {
  // New chapters 9–16 follow the eight existing A1.2 chapters; existing chapters only gain tabs (wonen, travel, grammar2).
  chapters: [
   ['daily','🧺 Thuis en dagelijks leven',['chores','weekplan']],
   ['work','💼 Werk en beroep',['werkplek','solliciteren']],
   ['zorg','🩺 Zorg en apotheek',['apotheek','huisarts']],
   ['stad','🗺️ De weg in de stad',['orientatie','diensten']],
   ['school','🎒 School en opleiding',['schoolwoorden','oudercontact']],
   ['vrijetijd','⚽ Vrije tijd',['clubs','weekend']],
   ['sociaal','🤝 Contact met mensen',['gevoelens','buren']],
   ['future','🔜 Plannen voor later',['tijdwoorden','plannen']]
  ],
  extraTabs: {wonen:['woning','huisbaas'],travel:['openbaar'],grammar2:['omdat','scheidbaar']},
  labels: {
   daily: [['Побут і повсякденне життя','Розповідай про хатні справи, розподіляй обов’язки й плануй тиждень.'],['Home life & daily tasks','Talk about chores, share tasks and plan your week.'],['Vie quotidienne et tâches ménagères','Parle des tâches ménagères, partage-les et organise ta semaine.'],['الحياة اليومية والأعمال المنزلية','تحدث عن الأعمال المنزلية ووزّع المهام وخطط لأسبوعك.']],
   work: [['Робота й професії','Шукай роботу, розповідай про досвід і домовляйся про графік.'],['Work & jobs','Look for work, talk about your experience and agree on a schedule.'],['Travail et métiers','Cherche du travail, parle de ton expérience et organise ton horaire.'],['العمل والمهن','ابحث عن عمل وتحدث عن خبرتك واتفق على جدول العمل.']],
   zorg: [['Здоров’я: аптека й лікар','Купуй ліки, розумій рецепт і знай, куди звертатися в Бельгії.'],['Health: pharmacy & GP','Buy medicine, understand a prescription and know where to go in Belgium.'],['Santé : pharmacie et généraliste','Achète des médicaments, comprends une ordonnance et sache où aller en Belgique.'],['الصحة: الصيدلية والطبيب','اشترِ الأدوية وافهم الوصفة واعرف أين تذهب في بلجيكا.']],
   stad: [['Місто й орієнтування','Питай дорогу, пояснюй маршрут і знаходь міські служби.'],['Finding your way in town','Ask the way, explain a route and find local services.'],['S’orienter en ville','Demande ton chemin, explique un itinéraire et trouve les services de la ville.'],['التنقل في المدينة','اسأل عن الطريق واشرح المسار واعثر على خدمات المدينة.']],
   school: [['Школа й навчання','Розумій шкільні листи, говори з учителем і записуйся на курси.'],['School & learning','Understand school letters, talk to the teacher and sign up for courses.'],['École et formation','Comprends les lettres de l’école, parle avec l’enseignant et inscris-toi à un cours.'],['المدرسة والتعلم','افهم رسائل المدرسة وتحدث مع المعلم وسجّل في الدورات.']],
   vrijetijd: [['Дозвілля','Розповідай про хобі, записуйся в клуб і плануй вихідні.'],['Free time','Talk about hobbies, join a club and plan your weekend.'],['Loisirs','Parle de tes loisirs, inscris-toi dans un club et organise ton week-end.'],['أوقات الفراغ','تحدث عن هواياتك وانضم إلى نادٍ وخطط لعطلة نهاية الأسبوع.']],
   sociaal: [['Спілкування з людьми','Знайомся із сусідами, говори про почуття, проси й пропонуй допомогу.'],['Getting along with people','Meet neighbours, talk about feelings, ask for and offer help.'],['Les contacts avec les gens','Rencontre tes voisins, parle de tes sentiments, demande et propose de l’aide.'],['التواصل مع الناس','تعرّف على جيرانك وتحدث عن مشاعرك واطلب المساعدة وقدّمها.']],
   future: [['Плани на майбутнє','Розповідай про плани, мрії й наступні кроки в Бельгії.'],['Plans for the future','Talk about plans, wishes and next steps in Belgium.'],['Projets d’avenir','Parle de tes projets, de tes souhaits et de tes prochaines étapes en Belgique.'],['خطط للمستقبل','تحدث عن خططك وأمنياتك وخطواتك القادمة في بلجيكا.']]
  },
  lessons: {
   chores: ['Хатні справи','Household chores','Tâches ménagères','الأعمال المنزلية', `
de was ophangen|розвішувати білизну|to hang out the washing|étendre le linge|نشر الغسيل|🧺|Bij mooi weer hang ik de was buiten op.|У гарну погоду я розвішую білизну надворі.
de tafel afruimen|прибирати зі столу|to clear the table|débarrasser la table|رفع الأطباق عن المائدة|🍽️|Na het eten ruim ik de tafel af.|Після їжі я прибираю зі столу.
de vaatwasmachine leegmaken|розвантажувати посудомийку|to empty the dishwasher|vider le lave-vaisselle|تفريغ غسالة الصحون|🧹|Wie maakt de vaatwasmachine leeg?|Хто розвантажить посудомийку?
kuisen|прибирати, чистити (у Фландрії)|to clean (Flemish)|nettoyer (en Flandre)|ينظّف (في فلاندرز)|🧽|Ik kuis de badkamer elke week.|Я прибираю ванну щотижня.
het bed opmaken|застеляти ліжко|to make the bed|faire le lit|ترتيب السرير|🛏️|De kinderen maken zelf hun bed op.|Діти самі застеляють ліжка.
de vuilniszak buitenzetten|виставляти пакет зі сміттям|to put the rubbish bag out|sortir le sac poubelle|إخراج كيس القمامة|🚪|Op dinsdagavond zet ik de vuilniszak buiten.|У вівторок увечері я виставляю пакет зі сміттям.
de planten water geven|поливати рослини|to water the plants|arroser les plantes|سقي النباتات|🌱|Kun jij de planten water geven?|Можеш полити рослини?
de was opplooien|складати білизну|to fold the laundry|plier le linge|طيّ الملابس|👕|Na het drogen plooi ik de was op.|Після сушіння я складаю білизну.
`],
   weekplan: ['Мій тиждень і обов’язки','My week and tasks','Ma semaine et mes tâches','أسبوعي ومهامي', `
Wie doet deze week de boodschappen?|Хто цього тижня робить покупки?|Who is doing the shopping this week?|Qui fait les courses cette semaine ?|من سيتسوق هذا الأسبوع؟|🛒
Ik kook vandaag en jij doet de afwas.|Сьогодні я готую, а ти миєш посуд.|I’m cooking today and you’re doing the dishes.|Aujourd’hui je cuisine et toi, tu fais la vaisselle.|أنا أطبخ اليوم وأنت تغسل الأطباق.|🍳
Ik heb de hele ochtend gepoetst.|Я прибирав увесь ранок.|I cleaned all morning.|J’ai fait le ménage toute la matinée.|نظّفت طوال الصباح.|🧽
Op woensdagmiddag hebben de kinderen geen school.|У середу після обіду в дітей немає уроків.|On Wednesday afternoons the children have no school.|Le mercredi après-midi, les enfants n’ont pas école.|بعد ظهر الأربعاء لا يذهب الأطفال إلى المدرسة.|🏫
Ik heb weinig tijd, want ik werk tot zes uur.|У мене мало часу, бо я працюю до шостої.|I have little time because I work until six.|J’ai peu de temps, car je travaille jusqu’à six heures.|لدي وقت قليل لأنني أعمل حتى السادسة.|⏳
Morgen moet ik de vuilniszak buitenzetten.|Завтра мені треба виставити пакет зі сміттям.|Tomorrow I have to put the rubbish bag out.|Demain, je dois sortir le sac poubelle.|غداً يجب أن أُخرج كيس القمامة.|🚪
Na het werk haal ik de kinderen op.|Після роботи я забираю дітей.|After work I pick up the children.|Après le travail, je vais chercher les enfants.|بعد العمل أُحضر الأطفال.|🧒
In het weekend rust ik uit.|На вихідних я відпочиваю.|At the weekend I rest.|Le week-end, je me repose.|في عطلة نهاية الأسبوع أرتاح.|😌
`],
   werkplek: ['На роботі','At work','Au travail','في العمل', `
de werkgever|роботодавець|employer|l’employeur|صاحب العمل|🧑‍💼|Mijn werkgever is tevreden over mij.|Мій роботодавець задоволений мною.
de werkkledij|робочий одяг|work clothes|les vêtements de travail|ملابس العمل|👔|Op het werk draag ik werkkledij.|На роботі я ношу робочий одяг.
de loonfiche|розрахунковий листок із зарплатою|payslip|la fiche de paie|قسيمة الراتب|🧾|Elke maand krijg ik een loonfiche.|Щомісяця я отримую розрахунковий листок.
het uurrooster|графік роботи|work schedule|l’horaire|جدول الدوام|🗓️|Ik krijg mijn uurrooster op vrijdag.|Я отримую графік роботи в п’ятницю.
de vroege ploeg|рання зміна|early shift|l’équipe du matin|الوردية الصباحية|⏰|Deze week werk ik in de vroege ploeg.|Цього тижня я працюю в ранню зміну.
het interimkantoor|кадрове агентство|temp agency|l’agence d’intérim|وكالة التوظيف المؤقت|🏢|Ik heb werk gevonden via een interimkantoor.|Я знайшов роботу через кадрове агентство.
de VDAB|VDAB, служба зайнятості Фландрії|VDAB, the Flemish employment service|le VDAB, le service flamand de l’emploi|VDAB، مكتب التشغيل الفلمنكي|💼|Ik heb een afspraak bij de VDAB.|У мене зустріч у VDAB.
het sollicitatiegesprek|співбесіда|job interview|l’entretien d’embauche|مقابلة العمل|🤝|Mijn sollicitatiegesprek is morgen om tien uur.|Моя співбесіда завтра о десятій.
`],
   solliciteren: ['Пошук роботи й співбесіда','Job search and interviews','Recherche d’emploi et entretien','البحث عن عمل والمقابلة', `
Ik zoek werk in een winkel.|Я шукаю роботу в магазині.|I’m looking for work in a shop.|Je cherche du travail dans un magasin.|أبحث عن عمل في متجر.|🔍
Ik heb drie jaar in een winkel gewerkt.|Я три роки працював у магазині.|I worked in a shop for three years.|J’ai travaillé trois ans dans un magasin.|عملت ثلاث سنوات في متجر.|🏪
In Oekraïne was ik verpleegster.|В Україні я була медсестрою.|In Ukraine I was a nurse.|En Ukraine, j’étais infirmière.|في أوكرانيا كنت ممرضة.|🧑‍⚕️
Ik kan ook in het weekend werken.|Я можу працювати й на вихідних.|I can also work at the weekend.|Je peux aussi travailler le week-end.|أستطيع العمل في عطلة نهاية الأسبوع أيضاً.|🗓️
Hoeveel uur per week is het?|Скільки це годин на тиждень?|How many hours a week is it?|C’est combien d’heures par semaine ?|كم ساعة في الأسبوع؟|⏱️
Ik spreek Oekraïens, Engels en een beetje Nederlands.|Я говорю українською, англійською й трохи нідерландською.|I speak Ukrainian, English and a little Dutch.|Je parle ukrainien, anglais et un peu néerlandais.|أتكلم الأوكرانية والإنجليزية وقليلاً من الهولندية.|🗣️
Ik ben ziek. Ik bel mijn werkgever voor negen uur.|Я захворів. Я дзвоню роботодавцю до дев’ятої.|I’m ill. I call my employer before nine.|Je suis malade. J’appelle mon employeur avant neuf heures.|أنا مريض. أتصل بصاحب العمل قبل التاسعة.|📞
Wanneer kan ik beginnen?|Коли я можу почати?|When can I start?|Quand est-ce que je peux commencer ?|متى يمكنني أن أبدأ؟|🏁
`],
   apotheek: ['В аптеці','At the pharmacy','À la pharmacie','في الصيدلية', `
de apotheker|фармацевт|pharmacist|le pharmacien|الصيدلي|💊|De apotheker legt alles goed uit.|Фармацевт усе добре пояснює.
de thermometer|термометр|thermometer|le thermomètre|ميزان الحرارة|🌡️|Met de thermometer meet ik mijn koorts.|Термометром я міряю температуру.
de wachtapotheek|чергова аптека|on-duty pharmacy|la pharmacie de garde|الصيدلية المناوبة|🌃|Op zondag ga ik naar de wachtapotheek.|У неділю я йду в чергову аптеку.
het ziekenfonds|лікарняна каса|health insurance fund|la mutuelle|صندوق التأمين الصحي|🪪|Het ziekenfonds betaalt een deel terug.|Лікарняна каса повертає частину грошей.
de spoed|відділення невідкладної допомоги|emergency department|les urgences|قسم الطوارئ|🏥|Na een ongeval ga je naar de spoed.|Після нещасного випадку їдуть у відділення невідкладної допомоги.
de bijsluiter|інструкція до ліків|package leaflet|la notice|نشرة الدواء|📑|Lees eerst de bijsluiter.|Спочатку прочитай інструкцію.
de zalf|мазь|ointment|la pommade|المرهم|🧴|Smeer de zalf twee keer per dag.|Намащуй мазь двічі на день.
het ziektebriefje|лікарняна довідка|sick note|le certificat médical|الشهادة المرضية|📄|De dokter schrijft een ziektebriefje voor drie dagen.|Лікар виписує лікарняну довідку на три дні.
`],
   huisarts: ['У лікаря й у терміновій ситуації','At the GP and in an emergency','Chez le médecin et en urgence','عند الطبيب وفي الطوارئ', `
Ik heb sinds gisteren keelpijn.|У мене з учора болить горло.|I’ve had a sore throat since yesterday.|J’ai mal à la gorge depuis hier.|أعاني من ألم في الحلق منذ أمس.|😷
Ik ben drie dagen ziek geweest.|Я хворів три дні.|I was ill for three days.|J’ai été malade pendant trois jours.|كنت مريضاً ثلاثة أيام.|🤒
Hebt u iets tegen hoest?|У вас є щось від кашлю?|Do you have something for a cough?|Avez-vous quelque chose contre la toux ?|هل لديك شيء للسعال؟|💊
Moet ik dit voor of na het eten nemen?|Мені це приймати до чи після їжі?|Should I take this before or after eating?|Dois-je le prendre avant ou après le repas ?|هل أتناوله قبل الأكل أم بعده؟|🍽️
Ik heb een ziektebriefje nodig voor mijn werk.|Мені потрібна лікарняна довідка для роботи.|I need a sick note for my work.|J’ai besoin d’un certificat médical pour mon travail.|أحتاج شهادة مرضية لعملي.|📝
Bel 112 bij een ongeval of brand.|Телефонуй 112 у разі нещасного випадку чи пожежі.|Call 112 in case of an accident or fire.|Appelle le 112 en cas d’accident ou d’incendie.|اتصل بالرقم 112 عند وقوع حادث أو حريق.|📞
De dokter heeft mij een voorschrift gegeven.|Лікар дав мені рецепт.|The doctor gave me a prescription.|Le médecin m’a donné une ordonnance.|أعطاني الطبيب وصفة طبية.|🩺
Wanneer heeft de dokter raadpleging?|Коли в лікаря прийом?|When does the doctor see patients?|Quand le médecin a-t-il ses consultations ?|متى يستقبل الطبيب المرضى؟|🕘
`],
   orientatie: ['Дорога й напрямки','Directions','Les directions','الاتجاهات', `
de verkeerslichten|світлофор|traffic lights|les feux|إشارات المرور|🚦|Aan de verkeerslichten ga je rechtdoor.|Біля світлофора йдеш прямо.
linksaf|ліворуч (повернути)|(turn) left|(tourner) à gauche|(انعطف) يساراً|⬅️|Sla daar linksaf.|Поверніть там ліворуч.
rechtsaf|праворуч (повернути)|(turn) right|(tourner) à droite|(انعطف) يميناً|➡️|Aan de bakker sla je rechtsaf.|Біля пекарні повертаєш праворуч.
het kruispunt|перехрестя|crossroads|le carrefour|التقاطع|🛣️|Aan het kruispunt ga je links.|На перехресті йдеш ліворуч.
de hoek|ріг вулиці|corner|le coin|الزاوية|📍|De apotheek is op de hoek.|Аптека на розі.
tegenover|навпроти|opposite|en face de|مقابل|🏛️|Het gemeentehuis is tegenover de kerk.|Будинок громади навпроти церкви.
de rotonde|кругова розв’язка|roundabout|le rond-point|الدوّار|🔄|Neem de tweede afslag op de rotonde.|На круговій розв’язці з’їжджай на другому з’їзді.
voorbij|за (проминувши)|past|après, plus loin que|بعد (تجاوز)|🚶|Het station is net voorbij de brug.|Вокзал одразу за мостом.
`],
   diensten: ['Міські служби','Local services','Les services de la ville','خدمات المدينة', `
Waar is de dienst burgerzaken?|Де відділ реєстрації населення?|Where is the civil affairs office?|Où est le service population ?|أين مكتب شؤون السكان؟|🏛️
Is het ver te voet?|Це далеко пішки?|Is it far on foot?|C’est loin à pied ?|هل هو بعيد سيراً على الأقدام؟|🚶
Het is ongeveer tien minuten wandelen.|Це приблизно десять хвилин пішки.|It’s about a ten-minute walk.|C’est à environ dix minutes à pied.|إنه حوالي عشر دقائق سيراً.|⏱️
Ik moet een nieuwe identiteitskaart aanvragen.|Мені треба подати заяву на нову ID-картку.|I need to apply for a new identity card.|Je dois demander une nouvelle carte d’identité.|يجب أن أطلب بطاقة هوية جديدة.|🪪
Het containerpark is op zondag gesloten.|Контейнерний парк у неділю зачинений.|The recycling centre is closed on Sundays.|Le parc à conteneurs est fermé le dimanche.|مركز إعادة التدوير مغلق يوم الأحد.|🚫
In de bibliotheek kun je boeken lenen.|У бібліотеці можна позичати книжки.|At the library you can borrow books.|À la bibliothèque, on peut emprunter des livres.|في المكتبة يمكنك استعارة الكتب.|📚
Neem een nummertje en wacht even.|Візьміть номерок і трохи зачекайте.|Take a number and wait a moment.|Prenez un ticket et attendez un peu.|خذ رقماً وانتظر قليلاً.|🎫
Ik ben verkeerd gelopen. Kunt u mij helpen?|Я заблукав. Можете мені допомогти?|I’ve gone the wrong way. Can you help me?|Je me suis trompé de chemin. Pouvez-vous m’aider ?|أخطأت الطريق. هل يمكنك مساعدتي؟|🗺️
`],
   schoolwoorden: ['Школа дітей','Children’s school','L’école des enfants','مدرسة الأطفال', `
de juf|учителька (у початковій школі)|teacher (woman, primary school)|la maîtresse|المعلّمة|👩|De juf van mijn dochter heet Els.|Учительку моєї доньки звати Елс.
de meester|учитель (у початковій школі)|teacher (man, primary school)|le maître|المعلّم|👨‍🏫|De meester geeft veel huiswerk.|Учитель задає багато домашніх завдань.
het rapport|табель з оцінками|school report|le bulletin|بطاقة العلامات|📊|Voor Kerstmis krijgen de kinderen hun rapport.|Перед Різдвом діти отримують табель.
het oudercontact|зустріч батьків з учителем|parent-teacher meeting|la réunion parents-professeurs|اجتماع أولياء الأمور|👪|Het oudercontact is op dinsdagavond.|Зустріч батьків з учителем у вівторок увечері.
de refter|шкільна їдальня|school dining hall|le réfectoire|مقصف المدرسة|🍴|Mijn zoon eet 's middags in de refter.|Мій син обідає в шкільній їдальні.
de opvang|група продовженого дня|after-school care|la garderie|الرعاية بعد المدرسة|🧒|Na school gaat mijn dochter naar de opvang.|Після школи донька йде в групу продовженого дня.
de boekentas|шкільний рюкзак|school bag|le cartable|الحقيبة المدرسية|🎒|Vergeet je boekentas niet!|Не забудь свій рюкзак!
de schoolreis|шкільна екскурсія|school trip|l’excursion scolaire|الرحلة المدرسية|🚌|De schoolreis kost twaalf euro.|Шкільна екскурсія коштує дванадцять євро.
`],
   oudercontact: ['Розмова з учителем і курси','Talking to the teacher and courses','Parler à l’enseignant et cours','التحدث مع المعلم والدورات', `
Mijn zoon is vandaag ziek. Hij komt niet naar school.|Мій син сьогодні хворий. Він не прийде до школи.|My son is ill today. He isn’t coming to school.|Mon fils est malade aujourd’hui. Il ne vient pas à l’école.|ابني مريض اليوم. لن يأتي إلى المدرسة.|🤒
Hoe gaat het met mijn dochter in de klas?|Як справи в моєї доньки в класі?|How is my daughter doing in class?|Comment va ma fille en classe ?|كيف حال ابنتي في الصف؟|🏫
Hij werkt goed mee, maar hij praat te veel.|Він добре працює на уроці, але забагато розмовляє.|He works well, but he talks too much.|Il participe bien, mais il parle trop.|يشارك جيداً، لكنه يتكلم كثيراً.|💬
Moet ik dit briefje ondertekenen?|Мені треба підписати цей лист?|Do I have to sign this note?|Dois-je signer ce mot ?|هل يجب أن أوقّع هذه الورقة؟|✍️
De kinderen moeten om half negen op school zijn.|Діти мають бути в школі о пів на дев’яту.|The children have to be at school at half past eight.|Les enfants doivent être à l’école à huit heures et demie.|يجب أن يكون الأطفال في المدرسة في الثامنة والنصف.|🕣
Ik wil me inschrijven voor een cursus Nederlands.|Я хочу записатися на курс нідерландської.|I want to sign up for a Dutch course.|Je veux m’inscrire à un cours de néerlandais.|أريد التسجيل في دورة لغة هولندية.|📝
De les begint om zeven uur 's avonds.|Заняття починається о сьомій вечора.|The lesson starts at seven in the evening.|Le cours commence à sept heures du soir.|يبدأ الدرس في السابعة مساءً.|🕖
Ik heb mijn huiswerk niet gemaakt, want ik was ziek.|Я не зробив домашнє завдання, бо хворів.|I didn’t do my homework because I was ill.|Je n’ai pas fait mes devoirs, car j’étais malade.|لم أنجز واجبي لأنني كنت مريضاً.|📓
`],
   clubs: ['Хобі та клуби','Hobbies and clubs','Loisirs et clubs','الهوايات والأندية', `
de sportclub|спортивний клуб|sports club|le club de sport|النادي الرياضي|⚽|Mijn zoon voetbalt bij een sportclub.|Мій син грає у футбол у спортивному клубі.
het lidgeld|членський внесок|membership fee|la cotisation|رسوم العضوية|💶|Het lidgeld is honderd euro per jaar.|Членський внесок — сто євро на рік.
het zwembad|басейн|swimming pool|la piscine|المسبح|🏊|Op zaterdag gaan we naar het zwembad.|У суботу ми йдемо в басейн.
de vereniging|товариство, об’єднання|association|l’association|الجمعية|🧑‍🤝‍🧑|Ik ben lid van een Oekraïense vereniging.|Я член українського товариства.
het concert|концерт|concert|le concert|الحفل الموسيقي|🎵|Het concert begint om acht uur.|Концерт починається о восьмій.
de fietstocht|велопрогулянка|bike ride|la balade à vélo|جولة بالدراجة|🚴|Zondag maken we een fietstocht.|У неділю ми їдемо на велопрогулянку.
de tentoonstelling|виставка|exhibition|l’exposition|المعرض|🏛️|De tentoonstelling is tot eind mei open.|Виставка відкрита до кінця травня.
de dansles|урок танців|dance class|le cours de danse|درس الرقص|💃|Mijn dochter volgt dansles op woensdag.|Моя донька ходить на танці в середу.
`],
   weekend: ['Вихідні й вільний час','Weekends and free time','Week-end et temps libre','عطلة نهاية الأسبوع ووقت الفراغ', `
Wat doe je graag in je vrije tijd?|Що ти любиш робити у вільний час?|What do you like doing in your free time?|Qu’aimes-tu faire pendant ton temps libre ?|ماذا تحب أن تفعل في وقت فراغك؟|❓
Ik sport twee keer per week.|Я займаюся спортом двічі на тиждень.|I do sport twice a week.|Je fais du sport deux fois par semaine.|أمارس الرياضة مرتين في الأسبوع.|🏋️
Vorig weekend hebben we een fietstocht gemaakt.|Минулих вихідних ми їздили на велопрогулянку.|Last weekend we went on a bike ride.|Le week-end dernier, nous avons fait une balade à vélo.|في عطلة نهاية الأسبوع الماضية قمنا بجولة بالدراجة.|🚴
Hoe kan ik me inschrijven bij de club?|Як мені записатися в клуб?|How can I join the club?|Comment puis-je m’inscrire au club ?|كيف يمكنني التسجيل في النادي؟|📝
Ik vind zwemmen leuker dan lopen.|Мені плавати подобається більше, ніж бігати.|I like swimming more than running.|J’aime mieux nager que courir.|أحب السباحة أكثر من الجري.|🏊
Ga je zaterdag mee naar het concert?|Підеш зі мною в суботу на концерт?|Are you coming to the concert with me on Saturday?|Tu viens au concert avec moi samedi ?|هل تأتي معي إلى الحفل يوم السبت؟|🎵
De tickets zijn uitverkocht.|Квитки розпродані.|The tickets are sold out.|Les billets sont épuisés.|نفدت التذاكر.|🎟️
Ik blijf liever thuis met een goed boek.|Я краще залишуся вдома з гарною книжкою.|I’d rather stay at home with a good book.|Je préfère rester à la maison avec un bon livre.|أفضّل البقاء في البيت مع كتاب جيد.|📖
`],
   gevoelens: ['Почуття й настрій','Feelings and mood','Sentiments et humeur','المشاعر والمزاج', `
opgelucht|заспокоєний, з полегшенням|relieved|soulagé|مرتاح البال|😌|Ik ben opgelucht, want mijn zoon is weer gezond.|Мені полегшало, бо мій син знову здоровий.
boos|сердитий|angry|fâché|غاضب|👎|Mijn buurman is boos, want de muziek is te luid.|Мій сусід сердиться, бо музика надто гучна.
ongerust|стурбований|worried|inquiet|قلق|😔|Ik ben ongerust over mijn familie in Oekraïne.|Я хвилююся за свою родину в Україні.
zenuwachtig|знервований|nervous|nerveux|متوتر|🤞|Voor het examen ben ik zenuwachtig.|Перед іспитом я нервую.
tevreden|задоволений|satisfied|satisfait|راضٍ|👍|Ik ben tevreden over mijn cursus.|Я задоволений своїм курсом.
teleurgesteld|розчарований|disappointed|déçu|خائب الأمل|😞|Hij is teleurgesteld, want hij heeft de job niet gekregen.|Він розчарований, бо не отримав роботу.
verrast|здивований|surprised|surpris|متفاجئ|🎁|Ik ben verrast, want mijn buren hebben een taart gebracht.|Я здивований, бо сусіди принесли торт.
eenzaam|самотній|lonely|seul, isolé|وحيد|👤|In het begin was ik soms eenzaam.|Спочатку мені іноді було самотньо.
`],
   buren: ['Сусіди й допомога','Neighbours and help','Voisins et entraide','الجيران والمساعدة', `
Dag, ik ben uw nieuwe buurvrouw. Ik heet Olena.|Добрий день, я ваша нова сусідка. Мене звати Олена.|Hello, I’m your new neighbour. My name is Olena.|Bonjour, je suis votre nouvelle voisine. Je m’appelle Olena.|مرحباً، أنا جارتكم الجديدة. اسمي أولينا.|👋
Kunt u dit pakje voor mij aannemen?|Можете прийняти цю посилку за мене?|Could you take in this parcel for me?|Pourriez-vous réceptionner ce colis pour moi ?|هل يمكنك استلام هذا الطرد نيابة عني؟|📦
Zal ik je helpen met de boodschappen?|Допомогти тобі з покупками?|Shall I help you with the shopping?|Je t’aide à porter les courses ?|هل أساعدك في حمل المشتريات؟|🤝
Dat is heel vriendelijk van u.|Це дуже люб’язно з вашого боку.|That’s very kind of you.|C’est très gentil de votre part.|هذا لطف كبير منك.|🙏
Sorry voor het lawaai gisteren.|Вибачте за шум учора.|Sorry about the noise yesterday.|Désolé pour le bruit d’hier.|آسف على الضجيج أمس.|🔇
Hoe gaat het met je moeder?|Як справи у твоєї мами?|How is your mother?|Comment va ta mère ?|كيف حال والدتك؟|👵
Proficiat met je diploma!|Вітаю з дипломом!|Congratulations on your diploma!|Félicitations pour ton diplôme !|مبروك على شهادتك!|🎉
Kom je eens een koffie drinken?|Зайдеш якось на каву?|Will you come round for a coffee sometime?|Tu viens prendre un café un de ces jours ?|هل تأتي لشرب القهوة يوماً ما؟|☕
`],
   tijdwoorden: ['Коли? Слова про майбутнє','When? Future time words','Quand ? Les mots du futur','متى؟ كلمات المستقبل', `
volgend jaar|наступного року|next year|l’année prochaine|السنة القادمة|📅|Volgend jaar wil ik een opleiding volgen.|Наступного року я хочу піти на навчання.
binnenkort|незабаром|soon|bientôt|قريباً|🔜|Binnenkort verhuizen we.|Незабаром ми переїжджаємо.
over twee weken|через два тижні|in two weeks|dans deux semaines|بعد أسبوعين|🗓️|Over twee weken begint mijn nieuwe job.|Через два тижні починається моя нова робота.
later|пізніше, згодом|later|plus tard|لاحقاً|⏳|Later wil ik verpleegster worden.|Згодом я хочу стати медсестрою.
eerst|спочатку|first|d’abord|أولاً|1️⃣|Eerst leer ik Nederlands.|Спочатку я вчу нідерландську.
daarna|після цього|after that|ensuite|بعد ذلك|2️⃣|Daarna zoek ik werk.|Після цього я шукаю роботу.
de droom|мрія|dream|le rêve|الحلم|✨|Mijn droom is een eigen bakkerij.|Моя мрія — власна пекарня.
het doel|мета|goal|l’objectif|الهدف|🎯|Mijn doel is een job in Gent.|Моя мета — робота в Генті.
`],
   plannen: ['Мої плани','My plans','Mes projets','خططي', `
Volgend jaar ga ik een opleiding tot kok volgen.|Наступного року я піду вчитися на кухаря.|Next year I’m going to train as a cook.|L’année prochaine, je vais suivre une formation de cuisinier.|في السنة القادمة سأتابع تدريباً لأصبح طباخاً.|🧑‍🍳
Ik wil mijn rijbewijs halen.|Я хочу отримати водійські права.|I want to get my driving licence.|Je veux passer mon permis de conduire.|أريد الحصول على رخصة القيادة.|🚗
Na de cursus zoek ik werk in de zorg.|Після курсу я шукатиму роботу в догляді за людьми.|After the course I’ll look for work in care.|Après le cours, je chercherai du travail dans les soins.|بعد الدورة سأبحث عن عمل في مجال الرعاية.|🧑‍⚕️
We gaan in de zomer naar een groter appartement verhuizen.|Улітку ми переїдемо у більшу квартиру.|In summer we’re going to move to a bigger flat.|En été, nous allons déménager dans un appartement plus grand.|في الصيف سننتقل إلى شقة أكبر.|🏘️
Ik hoop dat mijn familie op bezoek komt.|Я сподіваюся, що моя родина приїде в гості.|I hope my family will come to visit.|J’espère que ma famille viendra nous voir.|أتمنى أن تأتي عائلتي للزيارة.|👪
Wat zijn jouw plannen voor volgend jaar?|Які твої плани на наступний рік?|What are your plans for next year?|Quels sont tes projets pour l’année prochaine ?|ما خططك للسنة القادمة؟|❓
Ik weet het nog niet.|Я ще не знаю.|I don’t know yet.|Je ne sais pas encore.|لا أعرف بعد.|🤷
Eerst wil ik beter Nederlands spreken.|Спочатку я хочу краще говорити нідерландською.|First I want to speak Dutch better.|D’abord, je veux mieux parler néerlandais.|أولاً أريد أن أتحدث الهولندية بشكل أفضل.|🗣️
`],
   woning: ['Житло й ремонт','Your home and repairs','Le logement et les réparations','السكن والإصلاحات', `
de huisbaas|власник житла, орендодавець|landlord|le propriétaire|المالك|🔑|De huisbaas komt morgen de verwarming bekijken.|Власник житла завтра прийде подивитися опалення.
de waarborg|застава за оренду|rental deposit|la garantie locative|تأمين الإيجار|💰|De waarborg is twee maanden huur.|Застава дорівнює оплаті за два місяці.
de verwarming|опалення|heating|le chauffage|التدفئة|🌡️|De verwarming werkt niet.|Опалення не працює.
het lek|протікання|leak|la fuite|التسرّب|💧|Er is een lek in de badkamer.|У ванній протікає.
de herstelling|ремонт|repair|la réparation|الإصلاح|🛠️|Wie betaalt de herstelling?|Хто платить за ремонт?
de loodgieter|сантехнік|plumber|le plombier|السبّاك|🔧|De loodgieter komt donderdag.|Сантехнік прийде в четвер.
de meterstand|показник лічильника|meter reading|le relevé du compteur|قراءة العداد|🔢|Ik geef de meterstand door.|Я передаю показник лічильника.
de pmd-zak|мішок PMD для пластику й металу|PMD bag for plastic and cans|le sac PMC|كيس PMD للبلاستيك والمعادن|🧴|De blauwe pmd-zak zet ik op maandag buiten.|Синій мішок PMD я виставляю в понеділок.
`],
   huisbaas: ['Розмова з орендодавцем','Talking to the landlord','Parler au propriétaire','التحدث مع المالك', `
Dag meneer, met Olena van appartement drie.|Добрий день, пане, це Олена з квартири номер три.|Hello sir, this is Olena from flat three.|Bonjour monsieur, c’est Olena de l’appartement trois.|مرحباً سيدي، معك أولينا من الشقة رقم ثلاثة.|📞
Sinds gisteren is er geen warm water.|З учора немає гарячої води.|There has been no hot water since yesterday.|Il n’y a plus d’eau chaude depuis hier.|لا يوجد ماء ساخن منذ أمس.|🚿
Wanneer kan de loodgieter komen?|Коли може прийти сантехнік?|When can the plumber come?|Quand le plombier peut-il venir ?|متى يمكن أن يأتي السبّاك؟|🔧
Ik ben morgen de hele dag thuis.|Завтра я весь день удома.|I’m at home all day tomorrow.|Demain, je suis à la maison toute la journée.|سأكون في البيت طوال اليوم غداً.|🏠
Het raam in de slaapkamer is kapot.|Вікно в спальні розбите.|The bedroom window is broken.|La fenêtre de la chambre est cassée.|نافذة غرفة النوم مكسورة.|🪟
Ik heb een foto van het lek gemaakt.|Я зробив фото протікання.|I took a photo of the leak.|J’ai pris une photo de la fuite.|التقطت صورة للتسرّب.|📸
Mag ik een huisdier hebben?|Чи можна мені тримати домашню тварину?|Am I allowed to have a pet?|Ai-je le droit d’avoir un animal ?|هل يُسمح لي باقتناء حيوان أليف؟|🐈
Ik wil de huur opzeggen.|Я хочу розірвати договір оренди.|I want to give notice on the lease.|Je veux résilier le bail.|أريد إنهاء عقد الإيجار.|📄
`],
   openbaar: ['Автобус, трамвай і велосипед','Bus, tram and bike','Bus, tram et vélo','الحافلة والترام والدراجة', `
Waar kan ik een busticket kopen?|Де можна купити квиток на автобус?|Where can I buy a bus ticket?|Où puis-je acheter un ticket de bus ?|أين يمكنني شراء تذكرة حافلة؟|🎫
Je kunt een ticket in de app kopen.|Квиток можна купити в застосунку.|You can buy a ticket in the app.|Tu peux acheter un ticket dans l’application.|يمكنك شراء تذكرة عبر التطبيق.|📱
Ik heb een abonnement voor een jaar.|У мене абонемент на рік.|I have a one-year pass.|J’ai un abonnement d’un an.|لدي اشتراك لمدة سنة.|💳
Deze bus rijdt niet op zondag.|Цей автобус не їздить у неділю.|This bus doesn’t run on Sundays.|Ce bus ne circule pas le dimanche.|هذه الحافلة لا تعمل يوم الأحد.|🚌
Door werken is er een omleiding.|Через ремонтні роботи є об’їзд.|There is a diversion because of roadworks.|À cause de travaux, il y a une déviation.|بسبب الأشغال هناك تحويلة.|🚧
Hoeveel haltes is het nog?|Скільки ще зупинок?|How many more stops is it?|C’est encore combien d’arrêts ?|كم محطة باقية؟|🚏
Ik zet mijn fiets in de fietsenstalling aan het station.|Я ставлю велосипед на велопарковці біля вокзалу.|I put my bike in the bike park at the station.|Je mets mon vélo au parking vélos de la gare.|أضع دراجتي في موقف الدراجات عند المحطة.|🚲
Met de tram ben ik er in tien minuten.|Трамваєм я буду там за десять хвилин.|By tram I’ll be there in ten minutes.|En tram, j’y suis en dix minutes.|بالترام أصل في عشر دقائق.|🚋
`],
   omdat: ['Причина: want і omdat','Reasons: want and omdat','La cause : want et omdat','السبب: want و omdat', `
Ik blijf thuis, want ik ben ziek.|Я залишаюся вдома, бо я хворий.|I’m staying at home because I’m ill.|Je reste à la maison, car je suis malade.|أبقى في البيت لأنني مريض.|🏠
Ik ga naar de apotheek omdat ik hoest.|Я йду в аптеку, тому що кашляю.|I’m going to the pharmacy because I’m coughing.|Je vais à la pharmacie parce que je tousse.|أذهب إلى الصيدلية لأنني أسعل.|💊
Ik neem de bus, want mijn fiets is kapot.|Я їду автобусом, бо мій велосипед зламався.|I’m taking the bus because my bike is broken.|Je prends le bus, car mon vélo est cassé.|أركب الحافلة لأن دراجتي معطلة.|🚌
Ik neem de bus omdat mijn fiets kapot is.|Я їду автобусом, тому що велосипед зламаний.|I’m taking the bus since my bike is broken.|Je prends le bus parce que mon vélo est cassé.|أركب الحافلة بسبب عطل دراجتي.|🚲
Ik leer Nederlands omdat ik hier wil werken.|Я вчу нідерландську, тому що хочу тут працювати.|I’m learning Dutch because I want to work here.|J’apprends le néerlandais parce que je veux travailler ici.|أتعلم الهولندية لأنني أريد العمل هنا.|📚
Ik ben te laat omdat de trein vertraging had.|Я запізнився, тому що поїзд затримався.|I’m late because the train was delayed.|Je suis en retard parce que le train avait du retard.|تأخرت لأن القطار تأخر.|🚆
Waarom bel je? Omdat ik een vraag heb.|Чому ти дзвониш? Тому що в мене є питання.|Why are you calling? Because I have a question.|Pourquoi tu appelles ? Parce que j’ai une question.|لماذا تتصل؟ لأن لدي سؤالاً.|📞
Ik kom niet, want ik moet werken.|Я не прийду, бо мушу працювати.|I’m not coming because I have to work.|Je ne viens pas, car je dois travailler.|لن آتي لأنني يجب أن أعمل.|💼
`],
   scheidbaar: ['Perfectum дієслів, що розділяються','Perfect tense of separable verbs','Passé composé des verbes séparables','الماضي التام للأفعال المنفصلة', `
ik ben opgestaan|я встав|I got up|je me suis levé|استيقظتُ|⏰|Ik ben om zes uur opgestaan.|Я встав о шостій.
ik heb opgebeld|я подзвонив|I phoned|j’ai téléphoné|اتصلتُ هاتفياً|📞|Ik heb de huisarts opgebeld.|Я подзвонив сімейному лікарю.
ik heb ingevuld|я заповнив|I filled in|j’ai rempli|ملأتُ|📝|Ik heb het formulier ingevuld.|Я заповнив анкету.
ik ben uitgestapt|я вийшов (з транспорту)|I got off|je suis descendu|نزلتُ|🚏|Ik ben aan het station uitgestapt.|Я вийшов біля вокзалу.
ik ben aangekomen|я прибув|I arrived|je suis arrivé|وصلتُ|🏁|De trein is op tijd aangekomen.|Поїзд прибув вчасно.
ik heb meegenomen|я взяв із собою|I brought along|j’ai emporté|أحضرتُ معي|🎒|Ik heb mijn identiteitskaart meegenomen.|Я взяв із собою ID-картку.
ik heb opgeruimd|я навів лад|I tidied up|j’ai rangé|رتّبتُ|🧹|Ik heb mijn kamer opgeruimd.|Я прибрав у своїй кімнаті.
ik heb afgesproken|я домовився|I arranged to meet|j’ai pris rendez-vous|اتفقتُ على موعد|🤝|Ik heb met Anna afgesproken.|Я домовився з Анною.
`]
  },
  // Short grammar rule shown above the exercises of a lesson (uk, en, fr, ar).
  notes: {
   weekplan: ['Час на початку → дієслово на другому місці: Morgen moet ik…','Time first → verb in second place: Morgen moet ik…','Le temps en tête → le verbe en 2e position : Morgen moet ik…','الزمن أولاً ← الفعل في المكان الثاني: Morgen moet ik…'],
   solliciteren: ['Досвід: ik heb … gewerkt; ким був: ik was …','Experience: ik heb … gewerkt; what you were: ik was …','Expérience : ik heb … gewerkt ; ce que tu étais : ik was …','الخبرة: ik heb … gewerkt؛ ما كنتَ: ik was …'],
   huisarts: ['Як довго? sinds + час: Ik heb sinds gisteren keelpijn.','How long? sinds + time: Ik heb sinds gisteren keelpijn.','Depuis quand ? sinds + temps : Ik heb sinds gisteren keelpijn.','منذ متى؟ sinds + الوقت: Ik heb sinds gisteren keelpijn.'],
   orientatie: ['Наказ: дієслово на початку. Ga rechtdoor! Sla linksaf!','Imperative: the verb comes first. Ga rechtdoor! Sla linksaf!','Impératif : le verbe vient en premier. Ga rechtdoor ! Sla linksaf !','الأمر: الفعل في البداية. Ga rechtdoor! Sla linksaf!'],
   weekend: ['Порівняння: leuker dan, liever, beter dan','Comparing: leuker dan, liever, beter dan','Comparer : leuker dan, liever, beter dan','المقارنة: leuker dan، liever، beter dan'],
   buren: ['Ввічливо: u/uw з незнайомими, je/jij з друзями','Polite: u/uw with strangers, je/jij with friends','Poli : u/uw avec des inconnus, je/jij avec des amis','بأدب: u/uw مع الغرباء، je/jij مع الأصدقاء'],
   plannen: ['Майбутнє: gaan/willen + інфінітив у кінці речення','Future: gaan/willen + infinitive at the end','Futur : gaan/willen + infinitif à la fin','المستقبل: gaan/willen + المصدر في نهاية الجملة'],
   omdat: ['want + звичайний порядок слів; після omdat дієслово йде в кінець','want + normal word order; after omdat the verb goes to the end','want + ordre normal ; après omdat, le verbe va à la fin','بعد want ترتيب عادي؛ بعد omdat يأتي الفعل في النهاية'],
   scheidbaar: ['Частка + ge + дієслово: opstaan → opgestaan, invullen → ingevuld','Particle + ge + verb: opstaan → opgestaan, invullen → ingevuld','Particule + ge + verbe : opstaan → opgestaan, invullen → ingevuld','الجزء + ge + الفعل: opstaan ← opgestaan، invullen ← ingevuld']
  },
  gaps: {
   daily:['Gisteren heb ik de hele dag ___.','gepoetst','poetsen','poetst','gepoetsd'],
   work:['Ik heb drie jaar in een winkel ___.','gewerkt','werken','werkt','gewerkd'],
   zorg:['Ik heb ___ gisteren keelpijn.','sinds','voor','na','om'],
   stad:['De bushalte is ___ de bank.','naast','rechtdoor','linksaf','straks'],
   school:['Mijn zoon is ziek. Hij komt ___ naar school.','niet','geen','niets','nee'],
   vrijetijd:['Ik vind zwemmen leuker ___ lopen.','dan','als','of','want'],
   sociaal:['Kunt ___ dit pakje voor mij aannemen, mevrouw?','u','uw','jouw','hem'],
   future:['Volgend jaar ___ ik een opleiding volgen.','ga','gaat','gaan','gegaan']
  },
  // Sentence builder: cat, level, tiles, roles, uk, en, fr, ar, extra tile, final punctuation.
  bank: [
   ['daily',1,'wie|doet|vandaag|de afwas','QVRR','Хто сьогодні миє посуд?','Who is doing the dishes today?','Qui fait la vaisselle aujourd’hui ?','من يغسل الأطباق اليوم؟','','?'],
   ['daily',1,'op zaterdag|doe|ik|de was','TVSR','У суботу я перу білизну.','On Saturday I do the laundry.','Le samedi, je fais la lessive.','يوم السبت أغسل الملابس.','doen','.'],
   ['daily',2,'ik|heb|de hele ochtend|gepoetst','SVRI','Я прибирав увесь ранок.','I cleaned all morning.','J’ai fait le ménage toute la matinée.','نظّفت طوال الصباح.','poetsen','.'],
   ['work',1,'wanneer|kan|ik|beginnen','QVSI','Коли я можу почати?','When can I start?','Quand est-ce que je peux commencer ?','متى يمكنني أن أبدأ؟','','?'],
   ['work',1,'ik|zoek|werk|in een winkel','SVRR','Я шукаю роботу в магазині.','I’m looking for work in a shop.','Je cherche du travail dans un magasin.','أبحث عن عمل في متجر.','','.'],
   ['work',2,'ik|heb|drie jaar|in een winkel|gewerkt','SVRRI','Я три роки працював у магазині.','I worked in a shop for three years.','J’ai travaillé trois ans dans un magasin.','عملت ثلاث سنوات في متجر.','werken','.'],
   ['zorg',1,'hebt|u|iets|tegen hoest','VSRR','У вас є щось від кашлю?','Do you have something for a cough?','Avez-vous quelque chose contre la toux ?','هل لديك شيء للسعال؟','','?'],
   ['zorg',2,'de dokter|heeft|mij|een voorschrift|gegeven','SVRRI','Лікар дав мені рецепт.','The doctor gave me a prescription.','Le médecin m’a donné une ordonnance.','أعطاني الطبيب وصفة طبية.','geeft','.'],
   ['stad',1,'waar|is|de wachtapotheek','QVS','Де чергова аптека?','Where is the on-duty pharmacy?','Où est la pharmacie de garde ?','أين الصيدلية المناوبة؟','','?'],
   ['stad',1,'aan het kruispunt|ga|je|links','TVSR','На перехресті йдеш ліворуч.','At the crossroads you go left.','Au carrefour, tu vas à gauche.','عند التقاطع تذهب يساراً.','gaat','.'],
   ['stad',2,'ik|ben|verkeerd|gelopen','SVRI','Я заблукав.','I went the wrong way.','Je me suis trompé de chemin.','أخطأت الطريق.','heb','.'],
   ['school',1,'moet|ik|dit briefje|ondertekenen','VSRI','Мені треба підписати цей лист?','Do I have to sign this note?','Dois-je signer ce mot ?','هل يجب أن أوقّع هذه الورقة؟','','?'],
   ['school',1,'de les|begint|om zeven uur','SVR','Заняття починається о сьомій.','The lesson starts at seven.','Le cours commence à sept heures.','يبدأ الدرس في السابعة.','','.'],
   ['school',2,'na school|gaat|mijn dochter|naar de opvang','TVSR','Після школи донька йде в групу продовженого дня.','After school my daughter goes to after-school care.','Après l’école, ma fille va à la garderie.','بعد المدرسة تذهب ابنتي إلى الرعاية.','gaan','.'],
   ['vrijetijd',1,'wat|doe|je|graag','QVSR','Що ти любиш робити?','What do you like doing?','Qu’est-ce que tu aimes faire ?','ماذا تحب أن تفعل؟','','?'],
   ['vrijetijd',1,'ik|sport|twee keer per week','SVR','Я займаюся спортом двічі на тиждень.','I do sport twice a week.','Je fais du sport deux fois par semaine.','أمارس الرياضة مرتين في الأسبوع.','','.'],
   ['vrijetijd',2,'vorig weekend|hebben|we|een fietstocht|gemaakt','TVSRI','Минулих вихідних ми їздили на велопрогулянку.','Last weekend we went on a bike ride.','Le week-end dernier, nous avons fait une balade à vélo.','في عطلة نهاية الأسبوع الماضية قمنا بجولة بالدراجة.','maken','.'],
   ['sociaal',1,'zal|ik|je|helpen','VSRI','Тобі допомогти?','Shall I help you?','Je peux t’aider ?','هل أساعدك؟','','?'],
   ['sociaal',1,'dat|is|heel vriendelijk|van u','SVRR','Це дуже люб’язно з вашого боку.','That’s very kind of you.','C’est très gentil de votre part.','هذا لطف كبير منك.','','.'],
   ['sociaal',2,'hij|is|boos|want|de muziek|is|te luid','SVRRSVR','Він сердиться, бо музика надто гучна.','He is angry because the music is too loud.','Il est fâché, car la musique est trop forte.','إنه غاضب لأن الموسيقى عالية جداً.','omdat','.'],
   ['future',1,'volgend jaar|ga|ik|verhuizen','TVSI','Наступного року я переїду.','Next year I’m going to move.','L’année prochaine, je vais déménager.','في السنة القادمة سأنتقل.','gaat','.'],
   ['future',1,'eerst|zoek|ik|werk','TVSR','Спочатку я шукаю роботу.','First I look for work.','D’abord, je cherche du travail.','أولاً أبحث عن عمل.','','.'],
   ['future',2,'na de cursus|wil|ik|in de zorg|werken','TVSRI','Після курсу я хочу працювати в догляді.','After the course I want to work in care.','Après le cours, je veux travailler dans les soins.','بعد الدورة أريد العمل في الرعاية.','wilt','.'],
   ['wonen',1,'de verwarming|werkt|niet','SVR','Опалення не працює.','The heating isn’t working.','Le chauffage ne marche pas.','التدفئة لا تعمل.','','.'],
   ['wonen',2,'wanneer|kan|de loodgieter|komen','QVSI','Коли може прийти сантехнік?','When can the plumber come?','Quand le plombier peut-il venir ?','متى يمكن أن يأتي السبّاك؟','','?'],
   ['travel',1,'hoeveel haltes|is|het|nog','QVSR','Скільки ще зупинок?','How many more stops is it?','C’est encore combien d’arrêts ?','كم محطة باقية؟','','?'],
   ['travel',2,'door werken|is|er|een omleiding','TVSR','Через ремонтні роботи є об’їзд.','There is a diversion because of roadworks.','À cause de travaux, il y a une déviation.','بسبب الأشغال هناك تحويلة.','','.'],
   ['grammar2',2,'ik|blijf|thuis|omdat|ik|ziek|ben','SVRRSRV','Я залишаюся вдома, тому що хворію.','I’m staying at home because I’m ill.','Je reste à la maison parce que je suis malade.','أبقى في البيت لأنني مريض.','want','.'],
   ['grammar2',2,'ik|ben|om zes uur|opgestaan','SVRI','Я встав о шостій.','I got up at six.','Je me suis levé à six heures.','استيقظتُ في السادسة.','heb','.'],
   // Nov 2026 review: at least six beginner sentences per topic and 6–8 sentences per A1.2 grammar rule.
   ['past',1,'ik|heb|gisteren|gewerkt','SVRI','Я вчора працював.','I worked yesterday.','J’ai travaillé hier.','عملت أمس.','werk','.'],
   ['past',1,'we|zijn|naar de markt|gegaan','SVRI','Ми ходили на ринок.','We went to the market.','Nous sommes allés au marché.','ذهبنا إلى السوق.','hebben','.'],
   ['past',1,'hij|heeft|een film|gezien','SVRI','Він подивився фільм.','He watched a film.','Il a regardé un film.','شاهد فيلماً.','is','.'],
   ['past',2,'vorig jaar|was|ik|nog|in Oekraïne','TVSRR','Минулого року я ще був в Україні.','Last year I was still in Ukraine.','L’année dernière, j’étais encore en Ukraine.','في السنة الماضية كنت ما زلت في أوكرانيا.','ben','.'],
   ['past',2,'gisteren|had|ik|geen tijd','TVSR','Учора в мене не було часу.','Yesterday I had no time.','Hier, je n’avais pas le temps.','أمس لم يكن لدي وقت.','heb','.'],
   ['holiday',1,'hoe|was|je vakantie','QVR','Як минула твоя відпустка?','How was your holiday?','Comment se sont passées tes vacances ?','كيف كانت عطلتك؟','','?'],
   ['holiday',1,'we|zijn|naar zee|geweest','SVRI','Ми були на морі.','We went to the seaside.','Nous sommes allés à la mer.','ذهبنا إلى البحر.','hebben','.'],
   ['holiday',1,'het ontbijt|was|inbegrepen','SVR','Сніданок був включений.','Breakfast was included.','Le petit-déjeuner était compris.','كان الفطور مشمولاً.','','.'],
   ['holiday',1,'ik|heb|veel foto’s|gemaakt','SVRI','Я зробив багато фотографій.','I took a lot of photos.','J’ai pris beaucoup de photos.','التقطت صوراً كثيرة.','maak','.'],
   ['holiday',1,'was|het|mooi weer','VSR','Погода була гарна?','Was the weather nice?','Il faisait beau ?','هل كان الطقس جميلاً؟','','?'],
   ['holiday',2,'we|hebben|twee nachten|in een hotel|gelogeerd','SVRRI','Ми дві ночі жили в готелі.','We stayed in a hotel for two nights.','Nous avons logé deux nuits à l’hôtel.','أقمنا ليلتين في فندق.','logeren','.'],
   ['holiday',2,'vorige zomer|zijn|we|naar Spanje|gereisd','TVSRI','Минулого літа ми їздили до Іспанії.','Last summer we travelled to Spain.','L’été dernier, nous sommes allés en Espagne.','الصيف الماضي سافرنا إلى إسبانيا.','hebben','.'],
   ['travel',1,'de trein|heeft|vertraging','SVR','Поїзд запізнюється.','The train is delayed.','Le train a du retard.','القطار متأخر.','','.'],
   ['travel',1,'ik|heb|een abonnement','SVR','У мене є абонемент.','I have a pass.','J’ai un abonnement.','لدي اشتراك.','','.'],
   ['travel',1,'van welk spoor|vertrekt|de trein','QVS','З якої колії відправляється поїзд?','Which platform does the train leave from?','De quel quai part le train ?','من أي رصيف يغادر القطار؟','','?'],
   ['travel',1,'deze bus|rijdt|niet|op zondag','SVRR','Цей автобус не їздить у неділю.','This bus does not run on Sundays.','Ce bus ne circule pas le dimanche.','هذه الحافلة لا تعمل يوم الأحد.','','.'],
   ['service',1,'deze trui|is|te klein','SVR','Цей светр замалий.','This jumper is too small.','Ce pull est trop petit.','هذه الكنزة صغيرة جداً.','','.'],
   ['service',1,'mag|ik|deze broek|passen','VSRI','Можна приміряти ці штани?','May I try on these trousers?','Puis-je essayer ce pantalon ?','هل يمكنني قياس هذا البنطال؟','','?'],
   ['service',1,'hebt|u|een grotere maat','VSR','У вас є більший розмір?','Do you have a bigger size?','Avez-vous une taille plus grande ?','هل لديك مقاس أكبر؟','','?'],
   ['service',1,'hier|is|de kassabon','TVS','Ось чек.','Here is the receipt.','Voici le ticket de caisse.','هذا هو الإيصال.','','.'],
   ['service',1,'hoeveel|kost|de fiets','QVS','Скільки коштує велосипед?','How much is the bicycle?','Combien coûte le vélo ?','كم ثمن الدراجة؟','','?'],
   ['service',2,'ik|heb|deze jas|gisteren|gekocht','SVRRI','Я купив цю куртку вчора.','I bought this coat yesterday.','J’ai acheté cette veste hier.','اشتريت هذه السترة أمس.','koop','.'],
   ['wonen',1,'het raam|is|kapot','SVR','Вікно розбите.','The window is broken.','La fenêtre est cassée.','النافذة مكسورة.','','.'],
   ['wonen',1,'er|is|geen warm water','SVR','Немає гарячої води.','There is no hot water.','Il n’y a pas d’eau chaude.','لا يوجد ماء ساخن.','niet','.'],
   ['contact',1,'ik|stuur|u|een e-mail','SVRR','Я надішлю вам листа.','I will send you an email.','Je vous envoie un e-mail.','سأرسل لك بريداً إلكترونياً.','','.'],
   ['contact',1,'past|vrijdag|voor u','VSR','Вам підходить п’ятниця?','Does Friday suit you?','Vendredi vous convient ?','هل يناسبك يوم الجمعة؟','','?'],
   ['contact',1,'ik|kan|donderdag|niet|komen','SVRRI','Я не можу прийти в четвер.','I cannot come on Thursday.','Je ne peux pas venir jeudi.','لا أستطيع المجيء يوم الخميس.','','.'],
   ['contact',1,'de bijlage|is|een foto','SVR','Вкладення — це фото.','The attachment is a photo.','La pièce jointe est une photo.','المرفق صورة.','','.'],
   ['contact',1,'bedankt|voor|uw bericht','RRR','Дякую за ваше повідомлення.','Thank you for your message.','Merci pour votre message.','شكراً على رسالتك.','','.'],
   ['contact',2,'ik|heb|de bevestiging|nog niet|ontvangen','SVRRI','Я ще не отримав підтвердження.','I have not received the confirmation yet.','Je n’ai pas encore reçu la confirmation.','لم أتلقَّ التأكيد بعد.','ontvang','.'],
   ['reading',1,'de winkel|is|vandaag|gesloten','SVRR','Магазин сьогодні зачинений.','The shop is closed today.','Le magasin est fermé aujourd’hui.','المتجر مغلق اليوم.','','.'],
   ['reading',1,'inschrijven|kan|tot vrijdag','SVR','Записатися можна до п’ятниці.','You can register until Friday.','On peut s’inscrire jusqu’à vendredi.','يمكن التسجيل حتى الجمعة.','','.'],
   ['reading',1,'de wandeling|begint|om tien uur','SVR','Прогулянка починається о десятій.','The walk starts at ten.','La promenade commence à dix heures.','تبدأ النزهة في العاشرة.','','.'],
   ['reading',1,'kinderen|betalen|niets','SVR','Діти нічого не платять.','Children pay nothing.','Les enfants ne paient rien.','الأطفال لا يدفعون شيئاً.','','.'],
   ['reading',1,'eerst|klik|je|op de knop','TVSR','Спочатку натискаєш на кнопку.','First you click on the button.','D’abord, tu cliques sur le bouton.','أولاً تضغط على الزر.','','.'],
   ['grammar2',1,'de trein|is|sneller|dan de bus','SVRR','Поїзд швидший за автобус.','The train is faster than the bus.','Le train est plus rapide que le bus.','القطار أسرع من الحافلة.','als','.'],
   ['grammar2',1,'ik|bel|hem|morgen','SVRR','Я подзвоню йому завтра.','I will call him tomorrow.','Je l’appelle demain.','سأتصل به غداً.','hij','.'],
   ['grammar2',1,'ik|zie|haar|vanavond','SVRR','Я побачу її сьогодні ввечері.','I will see her tonight.','Je la vois ce soir.','سأراها هذا المساء.','zij','.'],
   ['grammar2',1,'deze kamer|is|groter','SVR','Ця кімната більша.','This room is bigger.','Cette chambre est plus grande.','هذه الغرفة أكبر.','','.'],
   ['grammar2',1,'zij|helpt|ons','SVR','Вона нам допомагає.','She helps us.','Elle nous aide.','هي تساعدنا.','wij','.'],
   ['grammar2',2,'deze jas|is|even duur|als die jas','SVRR','Ця куртка така сама дорога, як та.','This coat is as expensive as that one.','Cette veste est aussi chère que l’autre.','هذه السترة غالية مثل تلك.','dan','.'],
   ['grammar2',2,'dit|is|de goedkoopste|kamer','SVRR','Це найдешевша кімната.','This is the cheapest room.','C’est la chambre la moins chère.','هذه أرخص غرفة.','goedkoper','.'],
   ['grammar2',2,'ik|neem|liever|de trein','SVRR','Я краще поїду поїздом.','I would rather take the train.','Je préfère prendre le train.','أفضّل أن أركب القطار.','','.'],
   ['grammar2',2,'kun|je|haar|helpen','VSRI','Можеш їй допомогти?','Can you help her?','Peux-tu l’aider ?','هل يمكنك مساعدتها؟','zij','?'],
   ['grammar2',2,'ik|kom|niet|want|ik|ben|ziek','SVRRSVR','Я не прийду, бо я хворий.','I am not coming because I am ill.','Je ne viens pas, car je suis malade.','لن آتي لأنني مريض.','omdat','.'],
   ['grammar2',2,'ik|leer|Nederlands|omdat|ik|hier|wil|werken','SVRRSRVI','Я вчу нідерландську, тому що хочу тут працювати.','I am learning Dutch because I want to work here.','J’apprends le néerlandais parce que je veux travailler ici.','أتعلم الهولندية لأنني أريد العمل هنا.','want','.'],
   ['grammar2',2,'ik|ben|te laat|omdat|de bus|vertraging|had','SVRRSRV','Я запізнився, тому що автобус затримався.','I am late because the bus was delayed.','Je suis en retard parce que le bus avait du retard.','تأخرت لأن الحافلة تأخرت.','heeft','.'],
   ['grammar2',2,'ik|heb|het formulier|ingevuld','SVRI','Я заповнив анкету.','I filled in the form.','J’ai rempli le formulaire.','ملأت الاستمارة.','invullen','.'],
   ['grammar2',2,'de trein|is|op tijd|aangekomen','SVRI','Поїзд прибув вчасно.','The train arrived on time.','Le train est arrivé à l’heure.','وصل القطار في الموعد.','heeft','.'],
   ['grammar2',2,'ik|heb|de dokter|opgebeld','SVRI','Я подзвонив лікареві.','I phoned the doctor.','J’ai téléphoné au médecin.','اتصلت بالطبيب.','opbellen','.'],
   ['grammar2',2,'we|hebben|met Anna|afgesproken','SVRI','Ми домовилися з Анною.','We arranged to meet Anna.','Nous avons pris rendez-vous avec Anna.','اتفقنا على موعد مع آنا.','afspreken','.'],
   ['grammar2',2,'ik|heb|mijn paspoort|meegenomen','SVRI','Я взяв із собою паспорт.','I brought my passport.','J’ai emporté mon passeport.','أحضرت جواز سفري معي.','meenemen','.'],
   ['daily',1,'ik|kuis|de badkamer','SVR','Я прибираю ванну.','I clean the bathroom.','Je nettoie la salle de bain.','أنظّف الحمام.','','.'],
   ['daily',1,'na het werk|haal|ik|de kinderen|op','TVSRI','Після роботи я забираю дітей.','After work I pick up the children.','Après le travail, je vais chercher les enfants.','بعد العمل أُحضر الأطفال.','','.'],
   ['daily',1,'kun|jij|de planten|water geven','VSRI','Можеш полити рослини?','Can you water the plants?','Peux-tu arroser les plantes ?','هل يمكنك سقي النباتات؟','','?'],
   ['daily',1,'in het weekend|rust|ik|uit','TVSI','На вихідних я відпочиваю.','At the weekend I rest.','Le week-end, je me repose.','في عطلة نهاية الأسبوع أرتاح.','','.'],
   ['work',1,'ik|werk|in de vroege ploeg','SVR','Я працюю в ранню зміну.','I work the early shift.','Je travaille dans l’équipe du matin.','أعمل في الوردية الصباحية.','','.'],
   ['work',1,'hoeveel uur per week|is|het','QVS','Скільки це годин на тиждень?','How many hours a week is it?','C’est combien d’heures par semaine ?','كم ساعة في الأسبوع؟','','?'],
   ['work',1,'ik|kan|in het weekend|werken','SVRI','Я можу працювати на вихідних.','I can work at the weekend.','Je peux travailler le week-end.','أستطيع العمل في عطلة نهاية الأسبوع.','','.'],
   ['work',1,'ik|heb|een afspraak|bij de VDAB','SVRR','У мене зустріч у VDAB.','I have an appointment at the VDAB.','J’ai un rendez-vous au VDAB.','لدي موعد في VDAB.','','.'],
   ['zorg',1,'ik|heb|sinds gisteren|keelpijn','SVRR','У мене з учора болить горло.','I have had a sore throat since yesterday.','J’ai mal à la gorge depuis hier.','أعاني من ألم في الحلق منذ أمس.','','.'],
   ['zorg',1,'lees|eerst|de bijsluiter','VRR','Спочатку прочитай інструкцію.','Read the leaflet first.','Lis d’abord la notice.','اقرأ النشرة أولاً.','','.'],
   ['zorg',1,'ik|heb|een ziektebriefje|nodig','SVRR','Мені потрібна лікарняна довідка.','I need a sick note.','J’ai besoin d’un certificat médical.','أحتاج شهادة مرضية.','','.'],
   ['zorg',1,'bel|112|bij een ongeval','VRR','Телефонуй 112 у разі нещасного випадку.','Call 112 in case of an accident.','Appelle le 112 en cas d’accident.','اتصل بالرقم 112 عند وقوع حادث.','','.'],
   ['zorg',1,'moet|ik|dit|na het eten|nemen','VSRRI','Мені це приймати після їжі?','Should I take this after eating?','Dois-je prendre ceci après le repas ?','هل يجب أن أتناول هذا بعد الأكل؟','','?'],
   ['stad',1,'ga|rechtdoor|tot aan de kerk','VRR','Ідіть прямо до церкви.','Go straight on to the church.','Allez tout droit jusqu’à l’église.','امشِ مباشرة حتى الكنيسة.','','.'],
   ['stad',1,'sla|daar|linksaf','VRR','Поверніть там ліворуч.','Turn left there.','Tournez à gauche là-bas.','انعطف يساراً هناك.','','.'],
   ['stad',1,'de apotheek|is|op de hoek','SVR','Аптека на розі.','The pharmacy is on the corner.','La pharmacie est au coin.','الصيدلية على الزاوية.','','.'],
   ['stad',1,'is|het|ver|te voet','VSRR','Це далеко пішки?','Is it far on foot?','C’est loin à pied ?','هل هو بعيد سيراً؟','','?'],
   ['school',1,'mijn zoon|is|vandaag|ziek','SVRR','Мій син сьогодні хворий.','My son is ill today.','Mon fils est malade aujourd’hui.','ابني مريض اليوم.','','.'],
   ['school',1,'de schoolreis|kost|twaalf euro','SVR','Шкільна екскурсія коштує дванадцять євро.','The school trip costs twelve euros.','L’excursion coûte douze euros.','الرحلة المدرسية تكلّف اثني عشر يورو.','','.'],
   ['school',1,'ik|wil|me|inschrijven','SVRI','Я хочу записатися.','I want to sign up.','Je veux m’inscrire.','أريد التسجيل.','','.'],
   ['school',1,'hoe|gaat|het|met mijn dochter','QVSR','Як справи в моєї доньки?','How is my daughter doing?','Comment va ma fille ?','كيف حال ابنتي؟','','?'],
   ['vrijetijd',1,'het lidgeld|is|honderd euro','SVR','Членський внесок — сто євро.','The membership fee is a hundred euros.','La cotisation est de cent euros.','رسوم العضوية مئة يورو.','','.'],
   ['vrijetijd',1,'ga|je|zaterdag|mee','VSRI','Підеш зі мною в суботу?','Are you coming along on Saturday?','Tu viens samedi ?','هل تأتي معي يوم السبت؟','','?'],
   ['vrijetijd',1,'ik|blijf|liever|thuis','SVRR','Я краще залишуся вдома.','I would rather stay at home.','Je préfère rester à la maison.','أفضّل البقاء في البيت.','','.'],
   ['vrijetijd',1,'de tickets|zijn|uitverkocht','SVR','Квитки розпродані.','The tickets are sold out.','Les billets sont épuisés.','نفدت التذاكر.','','.'],
   ['sociaal',1,'ik|ben|uw nieuwe buurvrouw','SVR','Я ваша нова сусідка.','I am your new neighbour.','Je suis votre nouvelle voisine.','أنا جارتكم الجديدة.','','.'],
   ['sociaal',1,'kom|je|eens|een koffie|drinken','VSRRI','Зайдеш якось на каву?','Will you come round for a coffee sometime?','Tu viens prendre un café un de ces jours ?','هل تأتي لشرب القهوة يوماً ما؟','','?'],
   ['sociaal',1,'ik|ben|ongerust','SVR','Я хвилююся.','I am worried.','Je suis inquiet.','أنا قلق.','','.'],
   ['sociaal',1,'hoe|gaat|het|met je moeder','QVSR','Як справи у твоєї мами?','How is your mother?','Comment va ta mère ?','كيف حال والدتك؟','','?'],
   ['future',1,'ik|wil|mijn rijbewijs|halen','SVRI','Я хочу отримати водійські права.','I want to get my driving licence.','Je veux passer mon permis de conduire.','أريد الحصول على رخصة القيادة.','','.'],
   ['future',1,'binnenkort|verhuizen|we','TVS','Незабаром ми переїжджаємо.','Soon we are moving.','Bientôt, nous déménageons.','قريباً سننتقل.','','.'],
   ['future',1,'wat|zijn|jouw plannen','QVS','Які твої плани?','What are your plans?','Quels sont tes projets ?','ما خططك؟','','?'],
   ['future',1,'daarna|zoek|ik|werk','TVSR','Після цього я шукаю роботу.','After that I look for work.','Ensuite, je cherche du travail.','بعد ذلك أبحث عن عمل.','','.']
  ],
  // Listening and role-play: [id, icon, title uk/en/fr/ar, lines nl|uk|en].
  dialogues: [
   ['daily','🧺','Хто що робить удома?','Who does what at home?','Qui fait quoi à la maison ?','من يفعل ماذا في البيت؟',[
    ['Wie doet vandaag de afwas?','Хто сьогодні миє посуд?','Who is doing the dishes today?'],
    ['Ik heb gisteren al de afwas gedaan.','Я вже мив посуд учора.','I already did the dishes yesterday.'],
    ['Oké, dan doe ik hem vandaag. Kun jij stofzuigen?','Добре, тоді сьогодні мию я. Можеш попилососити?','OK, then I’ll do them today. Can you vacuum?'],
    ['Ja, maar eerst breng ik de kinderen naar school.','Так, але спочатку я відведу дітей до школи.','Yes, but first I’ll take the children to school.'],
    ['Vergeet de vuilniszak niet. Morgen komt de vuilniswagen.','Не забудь про пакет зі сміттям. Завтра приїде сміттєвоз.','Don’t forget the rubbish bag. The bin lorry comes tomorrow.'],
    ['Ik zet hem vanavond buiten.','Я виставлю його сьогодні ввечері.','I’ll put it out tonight.']]],
   ['work','💼','Співбесіда','A job interview','Un entretien d’embauche','مقابلة عمل',[
    ['Goedemorgen, gaat u zitten. Waarom wilt u hier werken?','Доброго ранку, сідайте. Чому ви хочете тут працювати?','Good morning, have a seat. Why do you want to work here?'],
    ['Ik werk graag met mensen en ik heb ervaring in een winkel.','Я люблю працювати з людьми, і маю досвід роботи в магазині.','I like working with people and I have experience in a shop.'],
    ['Hoe lang hebt u in die winkel gewerkt?','Скільки ви працювали в тому магазині?','How long did you work in that shop?'],
    ['Drie jaar, in Kyiv. Daar was ik verkoopster.','Три роки, у Києві. Там я була продавчинею.','Three years, in Kyiv. I was a shop assistant there.'],
    ['Kunt u ook in het weekend werken?','Ви можете працювати й на вихідних?','Can you also work at weekends?'],
    ['Ja, op zaterdag kan ik werken. Wanneer kan ik beginnen?','Так, у суботу я можу працювати. Коли я можу почати?','Yes, I can work on Saturdays. When can I start?']]],
   ['zorg','💊','В аптеці','At the pharmacy','À la pharmacie','في الصيدلية',[
    ['Goedemiddag. Kan ik u helpen?','Добрий день. Можу вам допомогти?','Good afternoon. Can I help you?'],
    ['Ja, ik heb sinds gisteren keelpijn en ik hoest veel.','Так, у мене з учора болить горло, і я сильно кашляю.','Yes, I’ve had a sore throat since yesterday and I cough a lot.'],
    ['Hebt u koorts?','У вас є температура?','Do you have a temperature?'],
    ['Nee, geen koorts. Hebt u iets tegen hoest?','Ні, температури немає. У вас є щось від кашлю?','No, no temperature. Do you have something for a cough?'],
    ['Deze siroop neemt u drie keer per dag, na het eten.','Цей сироп приймайте тричі на день після їжі.','Take this syrup three times a day, after meals.'],
    ['Dank u. Als het niet beter wordt, ga ik naar de huisarts.','Дякую. Якщо не стане краще, я піду до сімейного лікаря.','Thank you. If it doesn’t get better, I’ll go to the GP.']]],
   ['stad','🗺️','Дорога до будинку громади','The way to the town hall','Le chemin de la maison communale','الطريق إلى مبنى البلدية',[
    ['Pardon, mevrouw. Waar is het gemeentehuis?','Перепрошую, пані. Де будинок громади?','Excuse me, madam. Where is the town hall?'],
    ['Ga hier rechtdoor tot aan het kruispunt.','Ідіть тут прямо до перехрестя.','Go straight on here to the crossroads.'],
    ['En dan?','А потім?','And then?'],
    ['Aan het kruispunt gaat u linksaf. Het gemeentehuis is tegenover de kerk.','На перехресті поверніть ліворуч. Будинок громади навпроти церкви.','At the crossroads, turn left. The town hall is opposite the church.'],
    ['Is het ver te voet?','Це далеко пішки?','Is it far on foot?'],
    ['Nee, het is ongeveer tien minuten wandelen.','Ні, це приблизно десять хвилин пішки.','No, it’s about a ten-minute walk.']]],
   ['school','🎒','Розмова з учителькою','Talking to the teacher','Parler à la maîtresse','التحدث مع المعلّمة',[
    ['Dag juf, ik ben de mama van Sofia.','Добрий день, пані вчителько, я мама Софії.','Hello, Miss, I’m Sofia’s mum.'],
    ['Dag mevrouw. Sofia doet het goed in de klas.','Добрий день, пані. Софія добре вчиться.','Hello. Sofia is doing well in class.'],
    ['Fijn! Spreekt ze al goed Nederlands?','Чудово! Вона вже добре говорить нідерландською?','Great! Does she speak Dutch well already?'],
    ['Ja, ze leert snel. Ze praat veel met haar vriendinnen.','Так, вона швидко вчиться. Вона багато розмовляє з подругами.','Yes, she learns fast. She talks a lot with her friends.'],
    ['Moet ik dit briefje voor de schoolreis ondertekenen?','Мені треба підписати цей лист щодо екскурсії?','Do I need to sign this note for the school trip?'],
    ['Ja, graag tegen vrijdag. De schoolreis kost twaalf euro.','Так, будь ласка, до п’ятниці. Екскурсія коштує дванадцять євро.','Yes, by Friday please. The school trip costs twelve euros.']]],
   ['vrijetijd','⚽','Запис у клуб','Joining a club','S’inscrire dans un club','التسجيل في نادٍ',[
    ['Goedenavond. Mijn zoon wil graag voetballen bij jullie club.','Добрий вечір. Мій син хоче грати у футбол у вашому клубі.','Good evening. My son would like to play football at your club.'],
    ['Leuk! Hoe oud is hij?','Чудово! Скільки йому років?','Great! How old is he?'],
    ['Hij is tien. Wanneer zijn de trainingen?','Йому десять. Коли тренування?','He is ten. When are the training sessions?'],
    ['Op woensdagmiddag en op zaterdagochtend.','У середу після обіду й у суботу вранці.','On Wednesday afternoon and Saturday morning.'],
    ['Hoeveel is het lidgeld?','Скільки коштує членський внесок?','How much is the membership fee?'],
    ['Honderd euro per jaar. Het ziekenfonds betaalt soms een deel terug.','Сто євро на рік. Лікарняна каса іноді повертає частину.','A hundred euros a year. The health insurance fund sometimes refunds part of it.']]],
   ['sociaal','🤝','Нова сусідка','The new neighbour','La nouvelle voisine','الجارة الجديدة',[
    ['Dag, ik ben Olena, uw nieuwe buurvrouw.','Добрий день, я Олена, ваша нова сусідка.','Hello, I’m Olena, your new neighbour.'],
    ['Dag Olena, welkom! Ik ben Jan. Woon je hier al lang?','Привіт, Олено, ласкаво просимо! Я Ян. Ти вже давно тут живеш?','Hello Olena, welcome! I’m Jan. Have you lived here long?'],
    ['Nee, we zijn vorige week verhuisd.','Ні, ми переїхали минулого тижня.','No, we moved last week.'],
    ['Als je iets nodig hebt, mag je altijd aanbellen.','Якщо тобі щось потрібно, завжди можеш подзвонити у двері.','If you need anything, you can always ring the bell.'],
    ['Dat is heel vriendelijk. Kunt u morgen een pakje voor mij aannemen?','Це дуже люб’язно. Чи можете ви завтра прийняти для мене посилку?','That’s very kind. Could you take in a parcel for me tomorrow?'],
    ['Natuurlijk, geen probleem.','Звичайно, без проблем.','Of course, no problem.']]],
   ['future','🔜','Плани після курсу','Plans after the course','Projets après le cours','خطط بعد الدورة',[
    ['Wat zijn jouw plannen na de cursus?','Які в тебе плани після курсу?','What are your plans after the course?'],
    ['Eerst wil ik niveau A2 halen. Daarna zoek ik werk.','Спочатку я хочу досягти рівня A2. Потім шукатиму роботу.','First I want to reach level A2. After that I’ll look for work.'],
    ['Welk werk wil je doen?','Яку роботу ти хочеш?','What work do you want to do?'],
    ['Ik wil in de zorg werken. In Oekraïne was ik verpleegster.','Я хочу працювати в догляді за людьми. В Україні я була медсестрою.','I want to work in care. In Ukraine I was a nurse.'],
    ['En wat ga je in de zomer doen?','А що ти робитимеш улітку?','And what are you going to do in summer?'],
    ['We gaan naar een groter appartement verhuizen.','Ми переїдемо у більшу квартиру.','We’re going to move to a bigger flat.']]],
   // Listening for the topics that had no dialogue yet.
   ['past','⏪','Що ти робив на вихідних?','What did you do at the weekend?','Qu’as-tu fait ce week-end ?','ماذا فعلت في عطلة نهاية الأسبوع؟',[
    ['Wat heb je in het weekend gedaan?','Що ти робив на вихідних?','What did you do at the weekend?'],
    ['Zaterdag heb ik gewerkt. Zondag ben ik naar het park gegaan.','У суботу я працював. У неділю я ходив у парк.','On Saturday I worked. On Sunday I went to the park.'],
    ['Was het mooi weer?','Погода була гарна?','Was the weather nice?'],
    ['Ja, het was warm. We hebben buiten gegeten.','Так, було тепло. Ми їли надворі.','Yes, it was warm. We ate outside.'],
    ['En heb je ook gesport?','А спортом ти теж займався?','And did you do any sport?'],
    ['Nee, ik was te moe. Ik ben vroeg gaan slapen.','Ні, я був надто втомлений. Я рано ліг спати.','No, I was too tired. I went to bed early.']]],
   ['wonen','🏡','Дзвінок орендодавцю','Calling the landlord','Appeler le propriétaire','الاتصال بالمالك',[
    ['Goedemorgen, met Olena van appartement drie.','Доброго ранку, це Олена з квартири номер три.','Good morning, this is Olena from flat three.'],
    ['Dag Olena. Wat is er?','Добрий день, Олено. Що трапилося?','Hello Olena. What is the matter?'],
    ['Sinds gisteren werkt de verwarming niet.','З учора не працює опалення.','The heating has not been working since yesterday.'],
    ['Oei. Ik bel de loodgieter. Bent u morgen thuis?','Ой. Я подзвоню сантехніку. Ви будете завтра вдома?','Oh dear. I will call the plumber. Are you at home tomorrow?'],
    ['Ja, ik ben de hele dag thuis.','Так, я весь день удома.','Yes, I am at home all day.'],
    ['Goed. Hij komt morgen om tien uur.','Добре. Він прийде завтра о десятій.','Good. He will come tomorrow at ten.']]],
   ['reading','📰','Оголошення в бібліотеці','A notice at the library','Une annonce à la bibliothèque','إعلان في المكتبة',[
    ['Kijk, er hangt een briefje aan de deur.','Дивись, на дверях висить оголошення.','Look, there is a note on the door.'],
    ['Wat staat erop?','Що там написано?','What does it say?'],
    ['De bibliotheek is maandag gesloten.','Бібліотека в понеділок зачинена.','The library is closed on Monday.'],
    ['Spijtig. En wanneer is ze weer open?','Шкода. А коли вона знову відкрита?','Too bad. And when is it open again?'],
    ['Dinsdag vanaf negen uur.','У вівторок з дев’ятої.','On Tuesday from nine o’clock.'],
    ['Dan breng ik mijn boeken dinsdag terug.','Тоді я поверну книжки у вівторок.','Then I will bring my books back on Tuesday.']]]
  ],
  // Speaking prompts: question, uk, en, model answer.
  speech: [
   ['Wie doet bij jou thuis de afwas?','Хто у вас удома миє посуд?','Who does the dishes in your home?','Bij ons doet mijn man de afwas.'],
   ['Welk werk heb je vroeger gedaan?','Яку роботу ти виконував раніше?','What work did you do before?','Ik heb drie jaar in een winkel gewerkt.'],
   ['Wat vraag je in de apotheek?','Що ти запитаєш в аптеці?','What do you ask at the pharmacy?','Hebt u iets tegen hoest?'],
   ['Hoe kom je van je huis naar de winkel?','Як дійти від твого дому до магазину?','How do you get from your home to the shop?','Ik ga rechtdoor en aan het kruispunt ga ik links.'],
   ['Waarom komt je kind vandaag niet naar school?','Чому твоя дитина сьогодні не прийде до школи?','Why isn’t your child coming to school today?','Mijn zoon komt niet omdat hij ziek is.'],
   ['Wat doe je graag in je vrije tijd?','Що ти любиш робити у вільний час?','What do you like doing in your free time?','Ik sport graag en ik lees veel.'],
   ['Hoe stel je je voor aan een nieuwe buur?','Як ти представишся новому сусідові?','How do you introduce yourself to a new neighbour?','Dag, ik ben Olena, uw nieuwe buurvrouw.'],
   ['Wat zijn je plannen voor volgend jaar?','Які твої плани на наступний рік?','What are your plans for next year?','Volgend jaar wil ik werk zoeken.'],
   // Two or three speaking tasks per topic.
   ['Hoe laat ben je vanmorgen opgestaan?','О котрій ти встав сьогодні вранці?','What time did you get up this morning?','Ik ben om zeven uur opgestaan.'],
   ['Waar heb je in de vakantie gelogeerd?','Де ти жив у відпустці?','Where did you stay on holiday?','Ik heb bij mijn zus gelogeerd.'],
   ['Hoe ga je naar je werk of naar de les?','Як ти добираєшся на роботу чи на заняття?','How do you get to work or to class?','Ik ga met de bus naar de les.'],
   ['Je trein heeft vertraging. Wat doe je?','Твій поїзд запізнюється. Що ти робиш?','Your train is late. What do you do?','Ik bel mijn werk en ik wacht op de volgende trein.'],
   ['De broek is te klein. Wat zeg je in de winkel?','Штани замалі. Що ти скажеш у магазині?','The trousers are too small. What do you say in the shop?','Hebt u een grotere maat?'],
   ['Wat is er kapot in je huis? Wat zeg je tegen de huisbaas?','Що зламалося у твоєму домі? Що ти скажеш орендодавцю?','What is broken in your home? What do you tell the landlord?','De verwarming werkt niet. Wanneer kan de loodgieter komen?'],
   ['Hoe ziet je appartement eruit?','Яка твоя квартира?','What is your flat like?','Mijn appartement heeft twee slaapkamers en een kleine keuken.'],
   ['Je kunt niet naar je afspraak komen. Wat zeg je?','Ти не можеш прийти на зустріч. Що ти скажеш?','You cannot come to your appointment. What do you say?','Het spijt me, ik kan donderdag niet komen. Past vrijdag?'],
   ['Wat staat er op het briefje aan de deur?','Що написано в оголошенні на дверях?','What does the note on the door say?','De bibliotheek is maandag gesloten.'],
   ['Tot wanneer kun je je inschrijven?','До якого часу можна записатися?','Until when can you register?','Je kunt je tot vrijdag inschrijven.'],
   ['Wat neem je liever: de trein of de bus? Waarom?','Що ти обираєш: поїзд чи автобус? Чому?','Which do you prefer: the train or the bus? Why?','Ik neem liever de trein, omdat hij sneller is.'],
   ['Wat doe je op zaterdag in huis?','Що ти робиш удома в суботу?','What do you do at home on Saturday?','Op zaterdag doe ik de was en ik kuis de badkamer.'],
   ['Waarom wil je hier werken?','Чому ти хочеш тут працювати?','Why do you want to work here?','Ik werk graag met mensen en ik heb ervaring.'],
   ['Wat scheelt er? Sinds wanneer?','Що трапилося? Відколи?','What is wrong? Since when?','Ik heb sinds gisteren keelpijn en koorts.'],
   ['Waar is de apotheek?','Де аптека?','Where is the pharmacy?','De apotheek is op de hoek, naast de bank.'],
   ['Hoe laat begint de school van je kinderen?','О котрій починаються уроки в твоїх дітей?','What time does your children’s school start?','De school begint om half negen.'],
   ['Wat heb je vorig weekend gedaan?','Що ти робив минулих вихідних?','What did you do last weekend?','Vorig weekend heb ik een fietstocht gemaakt.'],
   ['Hoe voel je je vandaag? Waarom?','Як ти почуваєшся сьогодні? Чому?','How do you feel today? Why?','Ik ben moe, want ik heb veel gewerkt.'],
   ['Wat wil je eerst doen in België?','Що ти хочеш зробити спочатку в Бельгії?','What do you want to do first in Belgium?','Eerst wil ik beter Nederlands spreken.']
  ],
  // Two original reading texts: a school letter and a municipal notice.
  reading: [
   'Beste ouders, op vrijdag 14 maart gaan alle klassen op schoolreis naar de zoo. De bus vertrekt om half negen aan de schoolpoort. We zijn om vier uur terug. De schoolreis kost 15 euro. Geef uw kind een lunchpakket en een drankje mee. Betaal voor 7 maart via de schoolrekening. Met vriendelijke groeten, juf Ann',
   'Gemeente Zonnedorp. Vanaf 1 april is het gemeentehuis open van maandag tot vrijdag, van 9 tot 12 uur. Op woensdag is het ook open van 14 tot 19 uur. Voor een nieuwe identiteitskaart maakt u eerst online een afspraak. Breng een pasfoto en uw oude kaart mee.'
  ]
  ,
  // Reading questions: text index, question uk/en/fr/ar, answer first, then three wrong options.
  readingQs: [
   [0,'О котрій вирушає автобус?','What time does the bus leave?','À quelle heure part le bus ?','متى تغادر الحافلة؟',['Om half negen','Om vier uur','Om acht uur','Om half tien']],
   [0,'Що дитина має взяти з собою?','What should the child take along?','Qu’est-ce que l’enfant doit emporter ?','ماذا يجب أن يأخذ الطفل معه؟',['Een lunchpakket en een drankje','Vijftien euro in een envelop','Een fiets','Een pasfoto']],
   [0,'До якого дня треба заплатити?','By when do you have to pay?','Avant quelle date faut-il payer ?','قبل أي تاريخ يجب الدفع؟',['Voor 7 maart','Op 14 maart','Na de schoolreis','Voor 1 april']],
   [1,'Коли будинок громади відкритий після обіду?','When is the town hall open in the afternoon?','Quand la maison communale est-elle ouverte l’après-midi ?','متى يكون مبنى البلدية مفتوحاً بعد الظهر؟',['Op woensdag','Op maandag','Op vrijdag','Elke dag']],
   [1,'Що треба зробити спочатку для нової ID-картки?','What do you do first for a new identity card?','Que faut-il faire d’abord pour une nouvelle carte d’identité ?','ماذا تفعل أولاً للحصول على بطاقة هوية جديدة؟',['Online een afspraak maken','Een brief schrijven','Naar de bibliotheek gaan','Om 19 uur langskomen']],
   [1,'Що треба принести?','What must you bring?','Que faut-il apporter ?','ماذا يجب أن تحضر؟',['Een pasfoto en de oude kaart','Een voorschrift','Het lidgeld','Een kassabon']]
  ],
  // Spaced review of A1.2 grammar across chapters (answer first).
  review: [
   ['gap','Gisteren ___ ik naar de markt gegaan.','ben','heb','is','word'],
   ['gap','Ik heb het formulier ___.','ingevuld','geinvuld','invullen','vul in'],
   ['gap','Ik ben om zes uur ___.','opgestaan','opstaan','geopstaan','sta op'],
   ['gap','Ik kom niet omdat ik moet ___.','werken','werk','werkt','gewerkt'],
   ['pick','Ik neem de bus omdat mijn fiets kapot is.','Ik neem de bus omdat mijn fiets is kapot.','Ik neem de bus want mijn fiets kapot is.','Ik neem de bus omdat is mijn fiets kapot.'],
   ['gap','De trein is sneller ___ de bus.','dan','als','van','om'],
   ['gap','Waar is Tom? Ik zie ___ niet.','hem','hij','zijn','hun'],
   ['gap','Volgend jaar ___ we verhuizen.','gaan','gaat','ga','gegaan'],
   ['gap','Aan het kruispunt sla je ___.','linksaf','tegenover','naast','voorbij'],
   ['pick','Morgen moet ik de vuilniszak buitenzetten.','Morgen ik moet de vuilniszak buitenzetten.','Morgen moet ik buitenzetten de vuilniszak.','Morgen moet de vuilniszak ik buitenzetten.']
  ]
 };
 advanced.push(...a12.chapters.map(([id,title,tabs])=>[id,title,[...tabs]]));
 for(const [id,tabs] of Object.entries(a12.extraTabs))advanced.find(c=>c[0]===id)[2].push(...tabs);
 Object.assign(topicLabels,a12.labels);
 // ---- Course A2 (Nov 2026): connected text, subordinate clauses and the past tense. Internal key stays a21 (saved progress); the menu says "A2". ----
 // Original Leren.be material (the nederlearn.nl A2 outline was used only as a topic checklist). Same line format as a12.lessons.
 // Chapter 1 is the first vertical slice; chapters 2–8 follow the plan in COURSE-CURRICULUM.md.
 const a2 = {
  chapters: [
   ['a2work','💼 Werk: contract en rooster',['a2contract','a2rooster','a2ziek','a2vroeger']]
  ],
  labels: {
   a2work: [['Робота: договір і графік','Розумій трудовий договір, домовляйся про графік і правильно повідомляй про хворобу.'],['Work: contract and schedule','Understand your employment contract, agree on a schedule and report sick the right way.'],['Travail : contrat et horaire','Comprends ton contrat de travail, organise ton horaire et préviens correctement en cas de maladie.'],['العمل: العقد والجدول','افهم عقد العمل، واتفق على جدول الدوام، وأبلغ عن المرض بالطريقة الصحيحة.']]
  },
  lessons: {
   a2contract: ['Договір і зарплата','Contract and pay','Contrat et salaire','العقد والراتب', `
het arbeidscontract|трудовий договір|employment contract|le contrat de travail|عقد العمل|📜|Ik heb mijn arbeidscontract gelezen en ondertekend.|Я прочитав і підписав свій трудовий договір.
het contract van onbepaalde duur|безстроковий договір|permanent contract|le contrat à durée indéterminée|عقد غير محدد المدة|📑|Met een contract van onbepaalde duur heb ik meer zekerheid.|З безстроковим договором у мене більше впевненості.
het contract van bepaalde duur|строковий договір|fixed-term contract|le contrat à durée déterminée|عقد محدد المدة|📋|Mijn contract van bepaalde duur loopt tot eind juni.|Мій строковий договір діє до кінця червня.
het brutoloon|зарплата до податків (брутто)|gross pay|le salaire brut|الراتب الإجمالي|💶|Het brutoloon is het bedrag voor de belastingen.|Брутто — це сума до податків.
het nettoloon|зарплата на руки (нетто)|net pay|le salaire net|الراتب الصافي|💵|Mijn nettoloon staat op het einde van de maand op mijn rekening.|Моя нетто-зарплата надходить на рахунок наприкінці місяця.
de opzegtermijn|термін попередження про звільнення|notice period|le délai de préavis|مدة الإشعار|⏱️|Hoe lang is mijn opzegtermijn?|Скільки триває мій термін попередження про звільнення?
de vakantiedagen|дні відпустки|holiday days|les jours de congé|أيام الإجازة|🏖️|Ik heb twintig vakantiedagen per jaar.|У мене двадцять днів відпустки на рік.
de maaltijdcheques|харчові чеки|meal vouchers|les titres-repas|قسائم الوجبات|🧾|Ik krijg maaltijdcheques van mijn werkgever.|Я отримую харчові чеки від роботодавця.
`],
   a2rooster: ['Графік і розмова з керівником','Schedule and talking to your manager','Horaire et discussion avec le responsable','الجدول والحديث مع المسؤول', `
het werkrooster|робочий графік|work schedule|l’horaire de travail|جدول العمل|🗓️|Ik krijg mijn werkrooster elke vrijdag.|Я отримую робочий графік щоп’ятниці.
de late ploeg|пізня зміна|late shift|l’équipe de l’après-midi|الوردية المسائية|🌆|Volgende week werk ik in de late ploeg.|Наступного тижня я працюю в пізню зміну.
de nachtploeg|нічна зміна|night shift|l’équipe de nuit|الوردية الليلية|🌃|In de nachtploeg begin ik om tien uur ’s avonds.|У нічну зміну я починаю о десятій вечора.
de overuren|надурочні години|overtime|les heures supplémentaires|ساعات العمل الإضافية|⌛|Vorige week heb ik tien overuren gewerkt.|Минулого тижня я відпрацював десять надурочних годин.
van ploeg ruilen|помінятися змінами|to swap shifts|changer d’équipe|يبدّل الوردية|🔄|Kan ik van ploeg ruilen met mijn collega?|Чи можу я помінятися змінами з колегою?
vrijaf nemen|взяти вихідний|to take time off|prendre congé|يأخذ يوم إجازة|🛋️|Mag ik donderdag vrijaf nemen?|Чи можна мені взяти вихідний у четвер?
de leidinggevende|керівник|manager, supervisor|le responsable|المسؤول المباشر|🧑‍💼|Mijn leidinggevende is erg vriendelijk.|Мій керівник дуже привітний.
te laat komen|запізнюватися|to be late|arriver en retard|يتأخر عن الموعد|⏰|Het spijt me dat ik te laat kom.|Мені шкода, що я запізнююся.
`],
   a2ziek: ['Хвороба й відсутність','Illness and absence','Maladie et absence','المرض والغياب', `
zich ziek melden|повідомити про хворобу|to report sick|se déclarer malade|يبلّغ عن مرضه|📞|Ik moet me vandaag ziek melden.|Сьогодні мені треба повідомити про хворобу.
het doktersattest|медична довідка від лікаря|doctor’s certificate|le certificat du médecin|شهادة الطبيب|📄|Mijn dokter geeft mij een doktersattest voor drie dagen.|Мій лікар дає мені медичну довідку на три дні.
de werkgever verwittigen|попередити роботодавця|to notify the employer|prévenir l’employeur|إبلاغ صاحب العمل|📨|Verwittig je werkgever voor het werk begint.|Попередь роботодавця до початку роботи.
thuisblijven|залишатися вдома|to stay at home|rester à la maison|يبقى في البيت|🏠|Ik blijf thuis, want ik heb koorts.|Я лишаюся вдома, бо в мене температура.
de afwezigheid|відсутність|absence|l’absence|الغياب|🚫|Mijn afwezigheid duurt twee dagen.|Моя відсутність триває два дні.
bereikbaar zijn|бути на зв’язку|to be reachable|être joignable|أن تكون متاحاً للتواصل|📱|Ben je bereikbaar op je gsm?|Ти на зв’язку за мобільним?
vervangen|замінити (когось)|to replace, to cover for|remplacer|يحلّ محلّ|🔁|Wie kan mij volgende week vervangen?|Хто може мене замінити наступного тижня?
terug aan het werk gaan|повернутися до роботи|to go back to work|reprendre le travail|العودة إلى العمل|↩️|Maandag ga ik weer aan het werk.|У понеділок я знову виходжу на роботу.
`],
   a2vroeger: ['Що я робив раніше (imperfectum)','What I used to do (imperfectum)','Ce que je faisais avant (imparfait)','ماذا كنت أفعل سابقاً (الماضي البسيط)', `
In Oekraïne werkte ik als leraar.|В Україні я працював учителем.|In Ukraine I worked as a teacher.|En Ukraine, je travaillais comme enseignant.|في أوكرانيا كنت أعمل معلماً.|👨‍🏫
Toen woonde ik in een klein dorp.|Тоді я жив у маленькому селі.|At that time I lived in a small village.|À l’époque, j’habitais dans un petit village.|في ذلك الوقت كنت أسكن في قرية صغيرة.|🏘️
Mijn chef was heel streng.|Мій начальник був дуже суворим.|My boss was very strict.|Mon chef était très strict.|كان مديري صارماً جداً.|👔
We hadden veel klanten.|У нас було багато клієнтів.|We had a lot of customers.|Nous avions beaucoup de clients.|كان لدينا زبائن كثيرون.|👥
Ik ging elke dag met de bus naar het werk.|Щодня я їздив на роботу автобусом.|I went to work by bus every day.|Je allais au travail en bus tous les jours.|كنت أذهب إلى العمل بالحافلة كل يوم.|🚌
Mijn collega’s spraken Engels.|Мої колеги говорили англійською.|My colleagues spoke English.|Mes collègues parlaient anglais.|كان زملائي يتحدثون الإنجليزية.|🗣️
Ik kreeg elke maand mijn loon.|Щомісяця я отримував зарплату.|I got my pay every month.|Je recevais mon salaire chaque mois.|كنت أتقاضى راتبي كل شهر.|💶
Na het werk kwam ik laat thuis.|Після роботи я приходив додому пізно.|After work I came home late.|Après le travail, je rentrais tard.|بعد العمل كنت أصل إلى البيت متأخراً.|🌃
`]
  },
  notes: {
   a2contract: ['bepaalde / onbepaalde duur: договір на визначений чи невизначений час; bruto → netto після податків','bepaalde / onbepaalde duur: fixed-term or permanent; gross → net after taxes','bepaalde / onbepaalde duur : durée déterminée ou indéterminée ; brut → net après impôts','bepaalde / onbepaalde duur: عقد محدد أو غير محدد المدة؛ الإجمالي ← الصافي بعد الضرائب'],
   a2rooster: ['Підрядне речення: Het spijt me dat ik te laat kom. Після dat дієслово йде в кінець.','Subordinate clause: Het spijt me dat ik te laat kom. After dat the verb goes to the end.','Subordonnée : Het spijt me dat ik te laat kom. Après dat, le verbe va à la fin.','جملة فرعية: Het spijt me dat ik te laat kom. بعد dat يذهب الفعل إلى النهاية.'],
   a2ziek: ['Хворий? Повідом роботодавця вчасно й запитай, чи потрібен doktersattest.','Ill? Tell your employer in time and ask whether you need a doktersattest.','Malade ? Préviens ton employeur à temps et demande si un doktersattest est nécessaire.','مريض؟ أبلغ صاحب العمل في الوقت المناسب واسأل هل تحتاج إلى doktersattest.'],
   a2vroeger: ['Imperfectum: werk+te, woon+de (’t kofschip). Сильні: gaan–ging, komen–kwam, krijgen–kreeg, zijn–was.','Imperfectum: werk+te, woon+de (’t kofschip). Strong verbs: gaan–ging, komen–kwam, krijgen–kreeg, zijn–was.','Imparfait (imperfectum) : werk+te, woon+de (’t kofschip). Verbes forts : gaan–ging, komen–kwam, krijgen–kreeg, zijn–was.','الماضي البسيط: werk+te، woon+de (’t kofschip). أفعال قوية: gaan–ging، komen–kwam، krijgen–kreeg، zijn–was.']
  },
  gaps: {
   a2work:['Vorig jaar ___ ik nog in een winkel.','werkte','werk','werkt','gewerkt']
  },
  // Sentence builder rows: cat, level, tiles, roles, uk, en, fr, ar, extra tile, final punctuation.
  bank: [
   ['a2work',1,'mag|ik|donderdag|vrijaf nemen','VSRI','Чи можна мені взяти вихідний у четвер?','Can I take Thursday off?','Puis-je prendre congé jeudi ?','هل يمكنني أخذ يوم الخميس إجازة؟','','?'],
   ['a2work',1,'hoe lang|is|de opzegtermijn','QVS','Скільки триває термін попередження про звільнення?','How long is the notice period?','Combien de temps dure le délai de préavis ?','كم مدة الإشعار؟','','?'],
   ['a2work',1,'volgende week|werk|ik|in de late ploeg','TVSR','Наступного тижня я працюю в пізню зміну.','Next week I work the late shift.','La semaine prochaine, je travaille l’après-midi.','الأسبوع القادم أعمل في الوردية المسائية.','werkt','.'],
   ['a2work',2,'ik|moet|me|ziek melden','SVRI','Мені треба повідомити про хворобу.','I have to report sick.','Je dois me déclarer malade.','يجب أن أبلّغ عن مرضي.','','.'],
   ['a2work',2,'in Oekraïne|werkte|ik|als leraar','TVSR','В Україні я працював учителем.','In Ukraine I worked as a teacher.','En Ukraine, je travaillais comme enseignant.','في أوكرانيا كنت أعمل معلماً.','werk','.'],
   ['a2work',2,'mijn collega’s|spraken|Engels','SVR','Мої колеги говорили англійською.','My colleagues spoke English.','Mes collègues parlaient anglais.','كان زملائي يتحدثون الإنجليزية.','spreken','.'],
   ['a2work',2,'ik|blijf|thuis|want|ik|heb|koorts','SVRRSVR','Я лишаюся вдома, бо в мене температура.','I’m staying at home because I have a fever.','Je reste à la maison, car j’ai de la fièvre.','أبقى في البيت لأن لدي حمّى.','is','.'],
   ['a2work',2,'het spijt me|dat|ik|te laat|kom','RRSRI','Мені шкода, що я запізнююся.','I’m sorry that I’m late.','Je suis désolé d’arriver en retard.','آسف لأنني متأخر.','komt','.']
  ],
  dialogues: [
   ['a2work','💼','Повідомлення про хворобу','Calling in sick','Se déclarer malade','إبلاغ عن مرض',[
    ['Goedemorgen, met Pieter. Wat kan ik voor je doen?','Доброго ранку, Пітер слухає. Чим можу допомогти?','Good morning, Pieter speaking. What can I do for you?'],
    ['Goedemorgen, met Olena. Ik ben ziek en ik kan vandaag niet werken.','Доброго ранку, це Олена. Я захворіла й не можу сьогодні працювати.','Good morning, this is Olena. I’m ill and I can’t work today.'],
    ['Dat is jammer. Heb je koorts?','Шкода. У тебе температура?','That’s a pity. Do you have a fever?'],
    ['Ja, ik heb 38 graden. Wie kan mij vervangen?','Так, у мене 38 градусів. Хто може мене замінити?','Yes, I have 38 degrees. Who can cover for me?'],
    ['Dat regel ik. Stuur je het doktersattest morgen door?','Це я владнаю. Ти надішлеш медичну довідку завтра?','I’ll sort that out. Will you send the doctor’s certificate tomorrow?'],
    ['Ja, ik mail het morgen. Bedankt!','Так, я надішлю її завтра е-поштою. Дякую!','Yes, I’ll email it tomorrow. Thanks!']]]
  ],
  speech: [
   ['Wat doe je als je ziek bent?','Що ти робиш, коли хворієш?','What do you do when you are ill?','Ik bel mijn werkgever en ik blijf thuis.'],
   ['Welk werk deed je vroeger?','Яку роботу ти виконував раніше?','What work did you do in the past?','Vroeger werkte ik als leraar.'],
   ['Hoe kom je naar je werk?','Як ти добираєшся на роботу?','How do you get to work?','Ik neem elke dag de bus.'],
   ['Waarom kom je te laat?','Чому ти запізнюєшся?','Why are you late?','Het spijt me dat ik te laat ben. Mijn bus had vertraging.'],
   ['Je wilt vrijaf nemen. Wat vraag je aan je leidinggevende?','Ти хочеш узяти вихідний. Що запитаєш у керівника?','You want to take a day off. What do you ask your manager?','Mag ik vrijdag vrijaf nemen?']
  ]
 };
 // ---- A2 chapters 2–4 ----
 const a2p1 = {
  chapters: [
   ['a2wonen','🏠 Wonen: zoeken en huren',['a2zoeken','a2huur','a2wonenzin']],
   ['a2zorg','🩺 Gezondheid: ziekenfonds en specialist',['a2fonds','a2specialist','a2verleden']],
   ['a2admin','🏛️ Administratie: gemeente en brieven',['a2loket','a2brief','a2omte']]
  ],
  labels: {
   a2wonen: [['Житло: пошук і оренда','Читай оголошення, питай про умови оренди й розумій договір та рахунки за енергію.'],['Housing: searching and renting','Read listings, ask about rental terms and understand the contract and energy bills.'],['Logement : recherche et location','Lis les annonces, pose des questions sur les conditions et comprends le bail et les factures d’énergie.'],['السكن: البحث والإيجار','اقرأ الإعلانات، واسأل عن شروط الإيجار، وافهم العقد وفواتير الطاقة.']],
   a2zorg: [['Здоров’я: лікарняна каса й спеціаліст','Розумій, як працює лікарняна каса, записуйся до спеціаліста й розповідай про минуле.'],['Health: insurance fund and specialist','Understand how the health insurance fund works, see a specialist and talk about the past.'],['Santé : mutualité et spécialiste','Comprends le fonctionnement de la mutualité, consulte un spécialiste et parle du passé.'],['الصحة: التعاضدية والأخصائي','افهم كيف يعمل صندوق التأمين الصحي، وراجع أخصائياً، وتحدّث عن الماضي.']],
   a2admin: [['Адміністрація: громада й листи','Реєструйся за адресою, заповнюй форми й розумій листи від установ.'],['Administration: town hall and letters','Register at your address, fill in forms and understand letters from institutions.'],['Administration : commune et courriers','Inscris-toi à ton adresse, remplis des formulaires et comprends les courriers des services.'],['الإدارة: البلدية والرسائل','سجّل في عنوانك، واملأ الاستمارات، وافهم رسائل الجهات الرسمية.']]
  },
  lessons: {
   a2zoeken: ['Пошук житла','Finding a home','Chercher un logement','البحث عن مسكن', `
de huurwoning|житло в оренду|rental home|le logement à louer|مسكن للإيجار|🏠|Ik zoek een huurwoning in Brussel.|Я шукаю житло в оренду в Брюсселі.
de advertentie|оголошення|advertisement, listing|l’annonce|الإعلان|📰|Ik heb de advertentie op internet gelezen.|Я прочитав оголошення в інтернеті.
de bezichtiging|огляд житла|viewing|la visite|معاينة المسكن|🔍|De bezichtiging is zaterdag om elf uur.|Огляд житла в суботу об одинадцятій.
de makelaar|ріелтор|estate agent|l’agent immobilier|الوسيط العقاري|🤝|De makelaar toont ons het appartement.|Ріелтор показує нам квартиру.
de huurprijs|орендна плата|rent|le loyer|بدل الإيجار|💶|De huurprijs is 750 euro per maand.|Орендна плата — 750 євро на місяць.
beschikbaar|доступний, вільний|available|disponible|متاح|✅|Het appartement is vanaf 1 maart beschikbaar.|Квартира доступна з 1 березня.
de woonoppervlakte|житлова площа|living area|la surface habitable|مساحة السكن|📏|De woonoppervlakte is 65 vierkante meter.|Житлова площа — 65 квадратних метрів.
de verdieping|поверх|floor, storey|l’étage|الطابق|🛗|Het appartement ligt op de derde verdieping.|Квартира на третьому поверсі.
`],
   a2huur: ['Договір оренди й енергія','Rental contract and energy','Bail et énergie','عقد الإيجار والطاقة', `
het huurcontract|договір оренди|rental agreement|le contrat de bail|عقد الإيجار|📄|Ik moet het huurcontract eerst goed lezen.|Спершу я маю уважно прочитати договір оренди.
de huurwaarborg|гарантійний депозит|rental deposit|la garantie locative|ضمانة الإيجار|💰|De huurwaarborg is twee maanden huur.|Депозит — це оренда за два місяці.
de plaatsbeschrijving|акт про стан житла|inventory of fixtures|l’état des lieux|محضر وصف حالة المسكن|📋|Bij het inhuizen maken we een plaatsbeschrijving.|Під час в’їзду ми складаємо акт про стан житла.
de verhuurder|орендодавець|landlord|le bailleur|المؤجّر|👤|De verhuurder woont in Gent.|Орендодавець живе в Генті.
de huurder|орендар|tenant|le locataire|المستأجر|🧑|De huurder betaalt elke maand de huur.|Орендар платить оренду щомісяця.
de energiefactuur|рахунок за енергію|energy bill|la facture d’énergie|فاتورة الطاقة|🧾|De energiefactuur komt elke maand.|Рахунок за енергію приходить щомісяця.
de meterstand|показання лічильника|meter reading|le relevé du compteur|قراءة العدّاد|⏲️|Ik geef de meterstand door aan de leverancier.|Я передаю показання лічильника постачальнику.
de verwarming|опалення|heating|le chauffage|التدفئة|🔥|De verwarming werkt niet.|Опалення не працює.
`],
   a2wonenzin: ['Речення з die / dat й er','Sentences with die / dat and er','Phrases avec die / dat et er','جمل مع die / dat وer', `
Dit is het appartement dat ik zoek.|Це квартира, яку я шукаю.|This is the flat that I’m looking for.|C’est l’appartement que je cherche.|هذه هي الشقة التي أبحث عنها.|🏠
De buurman die boven woont, is heel rustig.|Сусід, який живе нагорі, дуже спокійний.|The neighbour who lives upstairs is very quiet.|Le voisin qui habite à l’étage est très calme.|الجار الذي يسكن في الطابق العلوي هادئ جداً.|🧑
Ik zoek een woning die dicht bij de school ligt.|Я шукаю житло, яке розташоване близько до школи.|I’m looking for a home that is close to the school.|Je cherche un logement qui se trouve près de l’école.|أبحث عن مسكن قريب من المدرسة.|🏫
Het contract dat ik heb getekend, is voor één jaar.|Договір, який я підписав, на один рік.|The contract that I signed is for one year.|Le contrat que j’ai signé est pour un an.|العقد الذي وقّعته لمدة سنة.|📄
Is er een tuin bij het huis?|Чи є сад біля будинку?|Is there a garden with the house?|Y a-t-il un jardin avec la maison ?|هل توجد حديقة مع البيت؟|🌳
Ja, er is een kleine tuin.|Так, є невеликий сад.|Yes, there is a small garden.|Oui, il y a un petit jardin.|نعم، توجد حديقة صغيرة.|🌱
Hoeveel kamers zijn er?|Скільки там кімнат?|How many rooms are there?|Combien y a-t-il de pièces ?|كم غرفة هناك؟|🔢
Er zijn drie slaapkamers en een badkamer.|Є три спальні й ванна кімната.|There are three bedrooms and a bathroom.|Il y a trois chambres et une salle de bain.|توجد ثلاث غرف نوم وحمّام.|🛏️
`],
   a2fonds: ['Лікарняна каса й страховка','Health insurance fund and insurance','Mutualité et assurance','التعاضدية والتأمين', `
de mutualiteit|лікарняна каса (mutualiteit)|health insurance fund|la mutualité|التعاضدية الصحية|🪪|Ik ben aangesloten bij een mutualiteit.|Я приєднаний до лікарняної каси.
zich aansluiten|приєднатися|to join, to affiliate|s’affilier|ينتسب|🤝|Ik wil me aansluiten bij een ziekenfonds.|Я хочу приєднатися до лікарняної каси.
het remgeld|власна частка пацієнта (доплата)|patient’s own share|le ticket modérateur|الحصة التي يدفعها المريض|💶|Bij elk bezoek betaal ik een deel zelf: het remgeld.|Під час кожного візиту я сам плачу частину — remgeld.
de terugbetaling|відшкодування|reimbursement|le remboursement|استرداد المبلغ|↩️|De terugbetaling komt op mijn rekening.|Відшкодування надходить на мій рахунок.
het getuigschrift|довідка про надану допомогу|certificate of care|l’attestation de soins|شهادة الرعاية|📄|Vraag een getuigschrift aan de dokter.|Попроси в лікаря довідку про надану допомогу.
de hospitalisatieverzekering|страховка на лікування в лікарні|hospital insurance|l’assurance hospitalisation|تأمين الاستشفاء|🏥|Mijn hospitalisatieverzekering betaalt een deel van de kosten.|Моя страховка на лікарню покриває частину витрат.
de verwijzing|направлення|referral|la référence|الإحالة|📨|Mijn huisarts geeft mij een verwijzing naar de specialist.|Мій сімейний лікар дає мені направлення до спеціаліста.
de verzekering|страховка|insurance|l’assurance|التأمين|🔒|Ik heb een verzekering voor mijn gezin.|У мене є страховка для моєї сім’ї.
`],
   a2specialist: ['Спеціалісти й запис','Specialists and appointments','Spécialistes et rendez-vous','الأخصائيون والمواعيد', `
de specialist|спеціаліст|specialist|le spécialiste|الأخصائي|🩺|De specialist onderzoekt mijn knie.|Спеціаліст оглядає моє коліно.
de kinderarts|педіатр|paediatrician|le pédiatre|طبيب الأطفال|🧒|De kinderarts onderzoekt mijn zoon.|Педіатр оглядає мого сина.
de tandarts|стоматолог|dentist|le dentiste|طبيب الأسنان|🦷|Ik heb morgen een afspraak bij de tandarts.|Завтра я записаний до стоматолога.
de huisartsenwachtpost|черговий пункт сімейних лікарів|GP on-call service|le poste de garde|مركز الأطباء المناوب|🌃|In het weekend ga ik naar de huisartsenwachtpost.|На вихідних я йду до чергового пункту сімейних лікарів.
de röntgenfoto|рентген-знімок|X-ray|la radiographie|صورة الأشعة|📸|De dokter wil een röntgenfoto laten maken.|Лікар хоче зробити рентген-знімок.
het bloedonderzoek|аналіз крові|blood test|la prise de sang|تحليل الدم|💧|Voor het bloedonderzoek moet ik nuchter zijn.|Для аналізу крові я маю бути натще.
een afspraak verzetten|перенести запис|to reschedule an appointment|reporter un rendez-vous|يؤجّل موعداً|📆|Ik wil mijn afspraak graag verzetten.|Я хотів би перенести свій запис.
de wachtzaal|зала очікування|waiting room|la salle d’attente|غرفة الانتظار|🪑|Ik zit in de wachtzaal.|Я сиджу в залі очікування.
`],
   a2verleden: ['Минуле: perfectum чи imperfectum','Past: perfectum or imperfectum','Passé : perfectum ou imperfectum','الماضي: perfectum أم imperfectum', `
Gisteren ben ik naar de dokter gegaan.|Учора я ходив до лікаря.|Yesterday I went to the doctor.|Hier, je suis allé chez le médecin.|ذهبت أمس إلى الطبيب.|🩺
De dokter onderzocht mijn rug.|Лікар оглядав мою спину.|The doctor examined my back.|Le médecin a examiné mon dos.|فحص الطبيب ظهري.|🧑‍⚕️
Ik had drie dagen koorts.|У мене три дні була температура.|I had a fever for three days.|J’ai eu de la fièvre pendant trois jours.|كانت لدي حمّى ثلاثة أيام.|🤒
Toen ik klein was, was ik vaak ziek.|Коли я був малий, я часто хворів.|When I was little, I was often ill.|Quand j’étais petit, j’étais souvent malade.|عندما كنت صغيراً كنت أمرض كثيراً.|🤧
Ik heb gisteren een tablet genomen.|Учора я випив таблетку.|I took a tablet yesterday.|J’ai pris un comprimé hier.|تناولت قرصاً أمس.|💊
De apotheker legde alles uit.|Фармацевт усе пояснив.|The pharmacist explained everything.|Le pharmacien a tout expliqué.|شرح الصيدلي كل شيء.|💊
Vorig jaar kreeg ik een nieuwe huisarts.|Минулого року я отримав нового сімейного лікаря.|Last year I got a new GP.|L’année dernière, j’ai eu un nouveau médecin généraliste.|في العام الماضي حصلت على طبيب عام جديد.|👨
Ik ben een week thuis gebleven.|Я тиждень лишався вдома.|I stayed at home for a week.|Je suis resté une semaine à la maison.|بقيت أسبوعاً في البيت.|🏠
`],
   a2loket: ['У віконці громади','At the municipal desk','Au guichet de la commune','عند شباك البلدية', `
het loket|віконце обслуговування|counter, service desk|le guichet|الشباك|🏛️|Ik ga naar het loket van de gemeente.|Я йду до віконця громади.
de bevolkingsdienst|служба реєстрації населення|population register office|le service de la population|دائرة السكان|🏢|Bij de bevolkingsdienst schrijf ik me in.|У службі реєстрації населення я реєструюся.
zich inschrijven|зареєструватися за адресою|to register|s’inscrire|يسجّل نفسه|✍️|Ik moet me inschrijven in mijn gemeente.|Я маю зареєструватися у своїй громаді.
de verhuis|переїзд|move|le déménagement|الانتقال|🚚|Na de verhuis meld ik mijn nieuwe adres.|Після переїзду я повідомляю нову адресу.
de identiteitskaart|посвідчення особи|identity card|la carte d’identité|بطاقة الهوية|🪪|Mijn identiteitskaart is nog drie jaar geldig.|Моє посвідчення особи дійсне ще три роки.
het attest|довідка|certificate|l’attestation|الشهادة|📄|Ik haal een attest op bij de gemeente.|Я забираю довідку в громаді.
de openingsuren|години роботи|opening hours|les heures d’ouverture|ساعات العمل|🕘|De openingsuren staan op de website.|Години роботи вказані на сайті.
het rijksregisternummer|національний реєстраційний номер|national register number|le numéro de registre national|الرقم الوطني|🔢|Mijn rijksregisternummer staat op mijn kaart.|Мій національний номер вказаний на моїй картці.
`],
   a2brief: ['Листи від установ','Letters from institutions','Courriers des services','رسائل الجهات الرسمية', `
het OCMW|OCMW, соціальна служба громади|OCMW (public social welfare centre)|le CPAS|OCMW، مركز الرعاية الاجتماعية|🤲|Het OCMW kan mij helpen met mijn aanvraag.|OCMW може допомогти мені із заявою.
de aanvraag|заява|application|la demande|الطلب|📝|Ik dien een aanvraag in.|Я подаю заяву.
het formulier|форма, анкета|form|le formulaire|الاستمارة|📋|Vul het formulier volledig in.|Заповни форму повністю.
de bijlage|додаток до листа|attachment|la pièce jointe|المرفق|📎|Stuur een kopie als bijlage mee.|Надішли копію як додаток.
de termijn|строк|deadline, period|le délai|المهلة|⏳|De termijn is dertig dagen.|Строк — тридцять днів.
de herinnering|нагадування|reminder|le rappel|التذكير|⏰|Ik kreeg een herinnering voor mijn factuur.|Я отримав нагадування про свій рахунок.
de beslissing|рішення|decision|la décision|القرار|✅|Ik wacht op de beslissing.|Я чекаю на рішення.
bezwaar maken|оскаржити рішення|to object, to appeal|faire opposition|يعترض|🙋|Ik wil bezwaar maken tegen deze beslissing.|Я хочу оскаржити це рішення.
`],
   a2omte: ['Мета дії: om … te','Purpose: om … te','But de l’action : om … te','الغرض: om … te', `
Ik ga naar de gemeente om mijn adres te wijzigen.|Я йду до громади, щоб змінити адресу.|I’m going to the municipality to change my address.|Je vais à la commune pour changer mon adresse.|أذهب إلى البلدية لتغيير عنواني.|🏛️
Ik bel het OCMW om een afspraak te maken.|Я телефоную в OCMW, щоб записатися.|I call the OCMW to make an appointment.|J’appelle le CPAS pour prendre rendez-vous.|أتصل بـ OCMW لتحديد موعد.|📞
Je moet een foto meebrengen om een identiteitskaart te krijgen.|Щоб отримати посвідчення, треба принести фото.|You have to bring a photo to get an identity card.|Il faut apporter une photo pour obtenir une carte d’identité.|يجب أن تُحضر صورة للحصول على بطاقة الهوية.|📸
Ik vul het formulier in om hulp aan te vragen.|Я заповнюю форму, щоб попросити допомогу.|I fill in the form to ask for help.|Je remplis le formulaire pour demander de l’aide.|أملأ الاستمارة لطلب المساعدة.|📝
Het is belangrijk om op tijd te antwoorden.|Важливо відповісти вчасно.|It is important to reply on time.|Il est important de répondre à temps.|من المهم الرد في الوقت المناسب.|⏱️
Ik heb geen tijd om vandaag te komen.|У мене немає часу прийти сьогодні.|I have no time to come today.|Je n’ai pas le temps de venir aujourd’hui.|ليس لدي وقت للحضور اليوم.|⌛
Ik probeer de brief te begrijpen.|Я намагаюся зрозуміти лист.|I try to understand the letter.|J’essaie de comprendre la lettre.|أحاول فهم الرسالة.|📨
Vergeet niet de bijlage te versturen.|Не забудь надіслати додаток.|Don’t forget to send the attachment.|N’oublie pas d’envoyer la pièce jointe.|لا تنسَ إرسال المرفق.|📎
`]
  },
  notes: {
   a2zoeken: ['У оголошенні шукай: kamers, m², huurprijs, beschikbaar vanaf. Артикль вчи разом зі словом.','In a listing look for: kamers, m², huurprijs, beschikbaar vanaf. Learn the article with the word.','Dans une annonce, cherche : kamers, m², huurprijs, beschikbaar vanaf. Apprends l’article avec le mot.','في الإعلان ابحث عن: kamers وm² وhuurprijs وbeschikbaar vanaf. تعلّم أداة التعريف مع الكلمة.'],
   a2huur: ['Перед підписом перевір: huurwaarborg, plaatsbeschrijving, opzegtermijn. Питай, якщо щось незрозуміло.','Before signing check: huurwaarborg, plaatsbeschrijving, opzegtermijn. Ask if something is unclear.','Avant de signer, vérifie : huurwaarborg, plaatsbeschrijving, opzegtermijn. Demande si quelque chose n’est pas clair.','قبل التوقيع تحقّق من: huurwaarborg وplaatsbeschrijving وopzegtermijn. اسأل إذا كان شيء غير واضح.'],
   a2wonenzin: ['de-слова й множина → die, het-слова → dat; дієслово в кінці: het huis dat ik zoek. Er is / er zijn: є.','de-words and plurals → die, het-words → dat; verb at the end: het huis dat ik zoek. Er is / er zijn: there is / are.','Mots en de et pluriels → die, mots en het → dat ; verbe à la fin : het huis dat ik zoek. Er is / er zijn : il y a.','كلمات de والجمع ← die، كلمات het ← dat؛ الفعل في النهاية: het huis dat ik zoek. Er is / er zijn: يوجد.'],
   a2fonds: ['Mutualiteit і ziekenfonds — майже те саме. Remgeld — твоя частка, terugbetaling — повернення решти.','Mutualiteit and ziekenfonds mean almost the same. Remgeld is your share, terugbetaling is the refund of the rest.','Mutualiteit et ziekenfonds, c’est presque pareil. Remgeld : ta part ; terugbetaling : le remboursement du reste.','Mutualiteit وziekenfonds بمعنى متقارب. Remgeld حصتك، وterugbetaling استرداد الباقي.'],
   a2specialist: ['Запис: Ik wil mijn afspraak graag verzetten. Спершу привітайся, потім поясни причину.','Booking: Ik wil mijn afspraak graag verzetten. Greet first, then give the reason.','Rendez-vous : Ik wil mijn afspraak graag verzetten. Salue d’abord, puis explique la raison.','الموعد: Ik wil mijn afspraak graag verzetten. حيّ أولاً ثم اذكر السبب.'],
   a2verleden: ['Perfectum — завершена подія (ik ben gegaan, ik heb genomen); imperfectum — опис і звичка (ik had, het was, toen ik klein was).','Perfectum — a finished event (ik ben gegaan, ik heb genomen); imperfectum — description and habit (ik had, het was, toen ik klein was).','Perfectum : événement terminé (ik ben gegaan, ik heb genomen) ; imperfectum : description et habitude (ik had, het was, toen ik klein was).','Perfectum: حدث منتهٍ (ik ben gegaan، ik heb genomen)؛ imperfectum: وصف وعادة (ik had، het was، toen ik klein was).'],
   a2loket: ['Zich inschrijven: ik schrijf me in. Бери з собою identiteitskaart і huurcontract.','Zich inschrijven: ik schrijf me in. Take your identiteitskaart and huurcontract.','Zich inschrijven : ik schrijf me in. Apporte ta identiteitskaart et ton huurcontract.','Zich inschrijven: ik schrijf me in. خذ معك identiteitskaart وhuurcontract.'],
   a2brief: ['У листі шукай: onderwerp, termijn, bijlage. Є рішення, яке не влаштовує? Bezwaar maken — у вказаний термін.','In a letter look for: onderwerp, termijn, bijlage. Do you disagree with a decision? Bezwaar maken — within the stated term.','Dans un courrier, cherche : onderwerp, termijn, bijlage. Décision contestable ? Bezwaar maken — dans le délai indiqué.','في الرسالة ابحث عن: onderwerp وtermijn وbijlage. لا توافق على قرار؟ bezwaar maken ضمن المهلة المذكورة.'],
   a2omte: ['om … te + інфінітив у кінці: Ik bel om een afspraak te maken. Мета дії = «щоб».','om … te + infinitive at the end: Ik bel om een afspraak te maken. Purpose = “in order to”.','om … te + infinitif à la fin : Ik bel om een afspraak te maken. But = « pour ».','om … te + المصدر في النهاية: Ik bel om een afspraak te maken. الغرض = «من أجل».']
  },
  gaps: {
   a2wonen:['Dit is het huis ___ ik zoek.','dat','die','wat','dit'],
   a2zorg:['Toen ik klein ___, was ik vaak ziek.','was','ben','is','geweest'],
   a2admin:['Ik bel de gemeente ___ een afspraak te maken.','om','voor','dat','door']
  },
  bank: [
   ['a2wonen',1,'is|er|een tuin|bij het huis','VSRR','Чи є сад біля будинку?','Is there a garden with the house?','Y a-t-il un jardin avec la maison ?','هل توجد حديقة مع البيت؟','','?'],
   ['a2wonen',1,'hoeveel kamers|zijn|er','QVS','Скільки там кімнат?','How many rooms are there?','Combien y a-t-il de pièces ?','كم غرفة هناك؟','','?'],
   ['a2wonen',1,'de verwarming|werkt|niet','SVR','Опалення не працює.','The heating does not work.','Le chauffage ne fonctionne pas.','التدفئة لا تعمل.','werk','.'],
   ['a2wonen',2,'ik|zoek|een woning|die|dicht bij school|ligt','SVRRRI','Я шукаю житло, яке розташоване близько до школи.','I’m looking for a home that is close to school.','Je cherche un logement qui se trouve près de l’école.','أبحث عن مسكن قريب من المدرسة.','dat','.'],
   ['a2wonen',2,'vanaf 1 maart|is|het appartement|beschikbaar','TVSR','З 1 березня квартира доступна.','From 1 March the flat is available.','À partir du 1er mars, l’appartement est disponible.','اعتباراً من 1 مارس تكون الشقة متاحة.','zijn','.'],
   ['a2wonen',2,'ik|moet|het huurcontract|lezen','SVRI','Я маю прочитати договір оренди.','I have to read the rental agreement.','Je dois lire le contrat de bail.','يجب أن أقرأ عقد الإيجار.','','.'],
   ['a2zorg',1,'wanneer|is|mijn afspraak','QVS','Коли мій запис?','When is my appointment?','Quand est mon rendez-vous ?','متى موعدي؟','','?'],
   ['a2zorg',1,'ik|wil|mijn afspraak|verzetten','SVRI','Я хочу перенести свій запис.','I want to reschedule my appointment.','Je veux reporter mon rendez-vous.','أريد تأجيل موعدي.','','.'],
   ['a2zorg',1,'ik|ben|aangesloten|bij een mutualiteit','SVRR','Я приєднаний до лікарняної каси.','I am affiliated with a health insurance fund.','Je suis affilié à une mutualité.','أنا منتسب إلى تعاضدية صحية.','','.'],
   ['a2zorg',2,'de dokter|onderzocht|mijn rug','SVR','Лікар оглядав мою спину.','The doctor examined my back.','Le médecin a examiné mon dos.','فحص الطبيب ظهري.','onderzoekt','.'],
   ['a2zorg',2,'gisteren|ben|ik|naar de dokter|gegaan','TVSRI','Учора я ходив до лікаря.','Yesterday I went to the doctor.','Hier, je suis allé chez le médecin.','ذهبت أمس إلى الطبيب.','heb','.'],
   ['a2admin',1,'waar|kan|ik|me|inschrijven','QVSRI','Де я можу зареєструватися?','Where can I register?','Où puis-je m’inscrire ?','أين يمكنني التسجيل؟','','?'],
   ['a2admin',1,'wat|moet|ik|meebrengen','QVSI','Що мені треба принести?','What do I have to bring?','Qu’est-ce que je dois apporter ?','ماذا يجب أن أحضر؟','','?'],
   ['a2admin',1,'de termijn|is|dertig dagen','SVR','Строк — тридцять днів.','The deadline is thirty days.','Le délai est de trente jours.','المهلة ثلاثون يوماً.','','.'],
   ['a2admin',2,'ik|vul|het formulier|in','SVRI','Я заповнюю форму.','I fill in the form.','Je remplis le formulaire.','أملأ الاستمارة.','invullen','.'],
   ['a2admin',2,'ik|bel|de gemeente|om|een afspraak|te maken','SVRRRI','Я телефоную до громади, щоб записатися.','I call the municipality to make an appointment.','J’appelle la commune pour prendre rendez-vous.','أتصل بالبلدية لتحديد موعد.','voor','.']
  ],
  dialogues: [
   ['a2wonen','🏠','Огляд квартири','Viewing a flat','Visiter un appartement','معاينة شقة',[
    ['Goedemiddag, ik kom voor de bezichtiging van het appartement.','Добрий день, я прийшов на огляд квартири.','Good afternoon, I’m here for the viewing of the flat.'],
    ['Welkom! Kom binnen. Dit is de woonkamer en daar is de keuken.','Ласкаво просимо! Заходьте. Це вітальня, а там кухня.','Welcome! Come in. This is the living room and there is the kitchen.'],
    ['Mooi. Hoe hoog is de huurprijs?','Гарно. Яка орендна плата?','Nice. How high is the rent?'],
    ['Die is 750 euro per maand, zonder kosten.','Вона 750 євро на місяць, без додаткових витрат.','It is 750 euros a month, excluding costs.'],
    ['En hoeveel bedraagt de huurwaarborg?','А який розмір депозиту?','And how much is the deposit?'],
    ['Twee maanden huur. Ik stuur u het huurcontract morgen door.','Оренда за два місяці. Я надішлю вам договір завтра.','Two months’ rent. I’ll send you the contract tomorrow.']]],
   ['a2zorg','🩺','Перенести запис до лікаря','Rescheduling a doctor’s appointment','Reporter un rendez-vous médical','تأجيل موعد طبي',[
    ['Praktijk De Linde, goedemorgen.','Практика «Де Лінде», доброго ранку.','De Linde practice, good morning.'],
    ['Goedemorgen, ik heb donderdag een afspraak, maar ik kan niet komen.','Доброго ранку, у мене в четвер запис, але я не зможу прийти.','Good morning, I have an appointment on Thursday, but I can’t come.'],
    ['Geen probleem. Past vrijdag om negen uur?','Нічого страшного. Вам підходить п’ятниця о дев’ятій?','No problem. Does Friday at nine suit you?'],
    ['Ja, dat past. Moet ik iets meenemen?','Так, підходить. Мені треба щось узяти з собою?','Yes, that suits me. Do I need to bring anything?'],
    ['Neem uw identiteitskaart mee.','Візьміть із собою посвідчення особи.','Bring your identity card.'],
    ['Prima, tot vrijdag. Dank u wel!','Чудово, до п’ятниці. Дякую!','Great, see you on Friday. Thank you!']]],
   ['a2admin','🏛️','У віконці громади','At the municipal desk','Au guichet de la commune','عند شباك البلدية',[
    ['Goedemorgen, waarmee kan ik u helpen?','Доброго ранку, чим можу допомогти?','Good morning, how can I help you?'],
    ['Goedemorgen, ik ben verhuisd en ik wil me inschrijven.','Доброго ранку, я переїхав і хочу зареєструватися.','Good morning, I moved and I want to register.'],
    ['Hebt u uw identiteitskaart en uw huurcontract bij u?','У вас із собою посвідчення особи й договір оренди?','Do you have your identity card and your rental contract with you?'],
    ['Ja, hier zijn ze. Wat gebeurt er nu?','Так, ось вони. Що буде далі?','Yes, here they are. What happens now?'],
    ['Binnen enkele weken komt de wijkagent langs om uw adres te controleren.','Протягом кількох тижнів до вас прийде дільничний, щоб перевірити адресу.','Within a few weeks the community police officer will come by to check your address.'],
    ['Oké, dank u wel. Tot ziens!','Добре, дякую. До побачення!','OK, thank you. Goodbye!']]]
  ],
  speech: [
   ['Welk soort woning zoek je?','Яке житло ти шукаєш?','What kind of home are you looking for?','Ik zoek een appartement met twee slaapkamers.'],
   ['Wat vraag je tijdens een bezichtiging?','Що ти питаєш під час огляду житла?','What do you ask during a viewing?','Hoeveel is de huurprijs en hoeveel is de huurwaarborg?'],
   ['Wat doe je als de verwarming niet werkt?','Що ти робиш, якщо не працює опалення?','What do you do if the heating does not work?','Ik bel de verhuurder en ik leg het probleem uit.'],
   ['Bij welk ziekenfonds ben je aangesloten?','До якої лікарняної каси ти приєднаний?','Which health insurance fund are you affiliated with?','Ik ben aangesloten bij een mutualiteit.'],
   ['Wat deed je de laatste keer bij de dokter?','Що ти робив востаннє в лікаря?','What did you do the last time at the doctor?','Ik kreeg een voorschrift en ik ging naar de apotheek.'],
   ['Wat zeg je om een afspraak te verzetten?','Що ти скажеш, щоб перенести запис?','What do you say to reschedule an appointment?','Ik kan donderdag niet komen. Past vrijdag?'],
   ['Waarom ga je naar de gemeente?','Чому ти йдеш до громади?','Why are you going to the municipality?','Ik ga naar de gemeente om mijn adres te wijzigen.'],
   ['Wat neem je mee naar het loket?','Що ти береш із собою до віконця?','What do you bring to the counter?','Ik neem mijn identiteitskaart en mijn huurcontract mee.'],
   ['Wat doe je als je een brief niet begrijpt?','Що ти робиш, якщо не розумієш лист?','What do you do if you don’t understand a letter?','Ik bel de dienst of ik vraag hulp aan het OCMW.']
  ]
 };
 // ---- A2 chapters 5–8 ----
 const a2p2 = {
  chapters: [
   ['a2school','🎓 School en opleiding',['a2regels','a2volwassen','a2zich']],
   ['a2geld','💶 Geld: bank en klacht',['a2bank','a2rekening','a2klacht']],
   ['a2nieuws','📰 Nieuws en weer',['a2nieuwsw','a2weer','a2superlatief']],
   ['a2samen','🤝 Samen leven: feesten en clubs',['a2feesten','a2vrijwilliger','a2regelszin']]
  ],
  labels: {
   a2school: [['Школа й навчання','Розумій листи зі школи, говори з учителем і записуйся на курси для дорослих.'],['School and learning','Understand school letters, talk to the teacher and sign up for adult courses.'],['École et formation','Comprends les courriers de l’école, parle à l’enseignant et inscris-toi à des cours pour adultes.'],['المدرسة والتعلّم','افهم رسائل المدرسة، وتحدّث مع المعلّم، وسجّل في دورات الكبار.']],
   a2geld: [['Гроші: банк і скарга','Користуйся банком, розумій рахунки й упевнено подавай скаргу.'],['Money: bank and complaints','Use the bank, understand bills and file a complaint with confidence.'],['Argent : banque et réclamation','Utilise la banque, comprends les factures et dépose une réclamation avec assurance.'],['المال: المصرف والشكوى','استخدم المصرف، وافهم الفواتير، وقدّم شكوى بثقة.']],
   a2nieuws: [['Новини й погода','Розумій короткі новини та прогноз, порівнюй і називай найкраще чи найгірше.'],['News and weather','Understand short news and forecasts, compare and name the best or the worst.'],['Actualités et météo','Comprends les brèves et la météo, compare et nomme le meilleur ou le pire.'],['الأخبار والطقس','افهم الأخبار القصيرة والنشرة الجوية، وقارن وسمِّ الأفضل أو الأسوأ.']],
   a2samen: [['Спільне життя: свята й клуби','Святкуй із сусідами, вступай до клубу й пояснюй причини довшими реченнями.'],['Living together: celebrations and clubs','Celebrate with neighbours, join a club and give reasons in longer sentences.'],['Vivre ensemble : fêtes et clubs','Fête avec les voisins, rejoins un club et explique tes raisons avec des phrases plus longues.'],['العيش معاً: الأعياد والنوادي','احتفل مع الجيران، وانضم إلى نادٍ، وعلّل بجمل أطول.']]
  },
  lessons: {
   a2regels: ['Школа: правила й повідомлення','School rules and messages','Règles et messages de l’école','قواعد المدرسة والرسائل', `
het schoolreglement|шкільний регламент|school rules|le règlement scolaire|لائحة المدرسة|📋|Het schoolreglement staat op de website.|Шкільний регламент є на сайті.
de leerkracht|вчитель|teacher|l’enseignant|المعلّم|👨‍🏫|De leerkracht stuurt een bericht via de app.|Вчитель надсилає повідомлення через застосунок.
het rapport|табель|school report|le bulletin|الشهادة المدرسية|📓|Mijn dochter krijgt vandaag haar rapport.|Моя донька сьогодні отримує табель.
de ouderavond|батьківські збори|parents’ evening|la réunion de parents|اجتماع أولياء الأمور|👪|De ouderavond is op woensdag om zeven uur.|Батьківські збори в середу о сьомій.
het huiswerk|домашнє завдання|homework|les devoirs|الواجب المنزلي|✏️|Mijn zoon maakt zijn huiswerk na school.|Мій син робить домашнє завдання після школи.
de schoolvakantie|шкільні канікули|school holiday|les vacances scolaires|العطلة المدرسية|🏖️|Tijdens de schoolvakantie gaan de kinderen niet naar school.|Під час шкільних канікул діти не ходять до школи.
de schooltoeslag|шкільна доплата|school allowance|l’allocation scolaire|منحة مدرسية|💶|Ik vraag de schooltoeslag aan.|Я подаю заяву на шкільну доплату.
de schoolagenda|шкільний щоденник|school planner|l’agenda scolaire|المفكرة المدرسية|📒|Ik teken de schoolagenda elke week.|Я підписую шкільний щоденник щотижня.
`],
   a2volwassen: ['Освіта дорослих і диплом','Adult education and diploma','Formation d’adultes et diplôme','تعليم الكبار والشهادة', `
het volwassenenonderwijs|освіта дорослих|adult education|l’enseignement pour adultes|تعليم الكبار|🎓|Ik volg Nederlands in het volwassenenonderwijs.|Я вивчаю нідерландську в системі освіти дорослих.
de cursist|слухач курсу|course participant|le cursiste|المتدرّب|🧑|De cursist komt elke dinsdag naar de les.|Слухач приходить на урок щовівторка.
het inschrijvingsgeld|вартість реєстрації|enrolment fee|les frais d’inscription|رسوم التسجيل|💶|Het inschrijvingsgeld is vijftig euro.|Вартість реєстрації — п’ятдесят євро.
het niveau|рівень|level|le niveau|المستوى|📊|Welk niveau heb jij?|Який у тебе рівень?
het intakegesprek|вступна співбесіда|intake interview|l’entretien d’accueil|مقابلة القبول|🗣️|Eerst is er een intakegesprek.|Спершу відбувається вступна співбесіда.
het diploma|диплом|diploma|le diplôme|الشهادة|📜|Mijn diploma komt uit Oekraïne.|Мій диплом з України.
het diploma laten erkennen|визнати диплом|to have a diploma recognised|faire reconnaître un diplôme|الاعتراف بالشهادة|✅|Ik wil mijn diploma laten erkennen.|Я хочу визнати свій диплом.
het examen|іспит|exam|l’examen|الامتحان|📝|Volgende maand heb ik een examen.|Наступного місяця в мене іспит.
`],
   a2zich: ['Зворотні дієслова','Reflexive verbs','Verbes pronominaux','الأفعال الانعكاسية', `
Ik schrijf me in voor een cursus.|Я записуюся на курс.|I enrol for a course.|Je m’inscris à un cours.|أسجّل نفسي في دورة.|✍️
Ik voel me vandaag goed.|Сьогодні я почуваюся добре.|I feel good today.|Je me sens bien aujourd’hui.|أشعر اليوم بأنني بخير.|😊
Hij haast zich naar school.|Він поспішає до школи.|He hurries to school.|Il se dépêche d’aller à l’école.|يسرع إلى المدرسة.|🏃
We melden ons aan bij de school.|Ми реєструємося в школі.|We register at the school.|Nous nous inscrivons à l’école.|نسجّل أنفسنا في المدرسة.|🏫
Ik moet me goed voorbereiden op het examen.|Я мушу добре підготуватися до іспиту.|I have to prepare well for the exam.|Je dois bien me préparer à l’examen.|يجب أن أستعد جيداً للامتحان.|📚
Mijn zoon wast zich elke ochtend.|Мій син вмивається щоранку.|My son washes every morning.|Mon fils se lave chaque matin.|ابني يغسل نفسه كل صباح.|🚿
Ze verheugt zich op de vakantie.|Вона радіє канікулам.|She is looking forward to the holiday.|Elle se réjouit des vacances.|هي سعيدة بقدوم العطلة.|🎉
Zij ontspannen zich in het weekend.|Вони відпочивають на вихідних.|They relax at the weekend.|Ils se détendent le week-end.|هم يرتاحون في عطلة نهاية الأسبوع.|😌
`],
   a2bank: ['Банк і рахунок','Bank and account','Banque et compte','المصرف والحساب', `
de bankrekening|банківський рахунок|bank account|le compte bancaire|الحساب المصرفي|🏦|Ik open een bankrekening bij een bank in Gent.|Я відкриваю банківський рахунок у банку в Генті.
de bankkaart|банківська картка|bank card|la carte bancaire|بطاقة الصرف|💳|Ik betaal met mijn bankkaart.|Я плачу банківською карткою.
het rekeningnummer|номер рахунку|account number|le numéro de compte|رقم الحساب|🔢|Mijn rekeningnummer begint met BE.|Мій номер рахунку починається з BE.
overschrijven|переказувати|to transfer|virer|يحوّل|📤|Ik schrijf het geld over naar mijn rekening.|Я переказую гроші на свій рахунок.
het saldo|залишок на рахунку|balance|le solde|الرصيد|💰|Mijn saldo is vandaag laag.|Мій залишок на рахунку сьогодні низький.
geld afhalen|зняти готівку|to withdraw cash|retirer de l’argent|يسحب نقداً|🏧|Ik haal geld af bij de bankautomaat.|Я знімаю гроші в банкоматі.
de domiciliëring|автоматичне списання (домісиліювання)|direct debit|la domiciliation|الخصم المباشر|🔁|De huur betaal ik via domiciliëring.|Оренду я плачу автоматичним списанням.
sparen|заощаджувати|to save|épargner|يدّخر|💰|Ik spaar elke maand vijftig euro.|Я заощаджую п’ятдесят євро щомісяця.
`],
   a2rekening: ['Рахунки й платежі','Bills and payments','Factures et paiements','الفواتير والدفعات', `
de factuur|рахунок-фактура|invoice, bill|la facture|الفاتورة|🧾|Ik moet de factuur voor vrijdag betalen.|Я маю сплатити рахунок до п’ятниці.
de vervaldatum|кінцева дата оплати|due date|la date d’échéance|تاريخ الاستحقاق|📅|De vervaldatum staat bovenaan.|Кінцева дата оплати вказана угорі.
de betaling|платіж|payment|le paiement|الدفع|💸|De betaling is gelukt.|Платіж пройшов успішно.
de mededeling|повідомлення в платежі|payment message|la communication|الرسالة في التحويل|📨|Vul de gestructureerde mededeling correct in.|Правильно вкажи структуроване повідомлення платежу.
het bedrag|сума|amount|le montant|المبلغ|💶|Het bedrag is 85 euro.|Сума — 85 євро.
de korting|знижка|discount|la réduction|الخصم|🏷️|Met deze kaart krijg ik korting.|З цією карткою я отримую знижку.
de betalingsherinnering|нагадування про оплату|payment reminder|le rappel de paiement|تذكير بالدفع|⏰|Ik kreeg een betalingsherinnering.|Я отримав нагадування про оплату.
de schuld|борг|debt|la dette|الدين|⚠️|Ik wil mijn schuld stap voor stap afbetalen.|Я хочу виплатити свій борг крок за кроком.
`],
   a2klacht: ['Скарга й гарантія','Complaint and warranty','Réclamation et garantie','الشكوى والضمان', `
de klacht|скарга|complaint|la plainte|الشكوى|📝|Ik wil een klacht indienen.|Я хочу подати скаргу.
de klantendienst|служба підтримки клієнтів|customer service|le service clientèle|خدمة العملاء|📞|Ik bel de klantendienst.|Я телефоную в службу підтримки.
de garantie|гарантія|warranty|la garantie|الضمان|✅|Er is twee jaar garantie op dit toestel.|На цей пристрій діє дворічна гарантія.
defect|несправний|faulty|défectueux|معطّل|🛠️|Het toestel is defect.|Пристрій несправний.
terugbetalen|повернути гроші|to refund|rembourser|يعيد المال|↩️|Kunnen jullie mij het geld terugbetalen?|Чи можете ви повернути мені гроші?
het aankoopbewijs|підтвердження покупки|proof of purchase|la preuve d’achat|إثبات الشراء|🧾|Ik heb het aankoopbewijs nog.|У мене ще є підтвердження покупки.
vervangen|замінити|to replace|remplacer|يستبدل|🔁|Ze vervangen het toestel gratis.|Вони безкоштовно замінюють пристрій.
tevreden|задоволений|satisfied|satisfait|راضٍ|🙂|Ik ben niet tevreden over de service.|Я не задоволений сервісом.
`],
   a2nieuwsw: ['Новини','News','Actualités','الأخبار', `
het nieuws|новини|news|les nouvelles|الأخبار|📰|Ik lees het nieuws op mijn telefoon.|Я читаю новини на телефоні.
de krant|газета|newspaper|le journal|الصحيفة|📰|Mijn buurman leest elke dag de krant.|Мій сусід щодня читає газету.
het ongeval|нещасний випадок, ДТП|accident|l’accident|الحادث|🚧|Er is een ongeval op de snelweg.|На автомагістралі сталася ДТП.
de staking|страйк|strike|la grève|الإضراب|✋|Morgen is er een staking bij de trein.|Завтра на залізниці страйк.
de verkiezingen|вибори|elections|les élections|الانتخابات|📋|In België is stemmen bij verkiezingen verplicht.|У Бельгії голосування на виборах обов’язкове.
het bericht|повідомлення, новина|report, message|le message|الخبر|📨|Dit bericht is belangrijk voor ons allemaal.|Ця новина важлива для всіх нас.
de journalist|журналіст|journalist|le journaliste|الصحفي|🗣️|De journalist stelt een vraag.|Журналіст ставить запитання.
de nieuwsbrief|розсилка новин|newsletter|la lettre d’information|النشرة الإخبارية|📧|Ik krijg elke week een nieuwsbrief van de gemeente.|Щотижня я отримую розсилку від громади.
`],
   a2weer: ['Погода й події','Weather and events','Météo et événements','الطقس والفعاليات', `
de weersvoorspelling|прогноз погоди|weather forecast|la prévision météo|توقعات الطقس|🌤️|De weersvoorspelling is slecht voor zondag.|Прогноз погоди на неділю поганий.
de storm|буря|storm|la tempête|العاصفة|💨|Morgen komt er een storm.|Завтра буде буря.
de mist|туман|fog|le brouillard|الضباب|🌬️|Door de mist rijden we langzaam.|Через туман ми їдемо повільно.
de vorst|мороз, заморозки|frost|le gel|الصقيع|❄️|Vannacht is er vorst.|Цієї ночі буде мороз.
de zon|сонце|sun|le soleil|الشمس|☀️|De zon schijnt de hele dag.|Сонце світить цілий день.
de regenbui|злива, короткий дощ|rain shower|l’averse|زخة مطر|🌧️|Er komt een regenbui aan.|Наближається злива.
het evenement|захід, подія|event|l’événement|الحدث|🎉|Het evenement in het park is gratis.|Захід у парку безкоштовний.
de kermis|ярмарок (kermis)|funfair|la kermesse|المعرض الشعبي|🎈|Zaterdag is er kermis in het dorp.|У суботу в селі ярмарок.
`],
   a2superlatief: ['Порівняння й найвищий ступінь','Comparing and superlatives','Comparatif et superlatif','المقارنة وصيغة التفضيل', `
Dit is het mooiste park van de stad.|Це найгарніший парк міста.|This is the most beautiful park in the city.|C’est le plus beau parc de la ville.|هذه أجمل حديقة في المدينة.|🌳
Vandaag is het warmer dan gisteren.|Сьогодні тепліше, ніж учора.|Today it is warmer than yesterday.|Aujourd’hui, il fait plus chaud qu’hier.|اليوم أدفأ من أمس.|☀️
Januari is de koudste maand.|Січень — найхолодніший місяць.|January is the coldest month.|Janvier est le mois le plus froid.|يناير هو أبرد شهر.|❄️
De trein is sneller dan de bus.|Потяг швидший за автобус.|The train is faster than the bus.|Le train est plus rapide que le bus.|القطار أسرع من الحافلة.|🚆
Dit is het belangrijkste nieuws van de dag.|Це найважливіша новина дня.|This is the most important news of the day.|C’est la nouvelle la plus importante du jour.|هذا أهم خبر في اليوم.|📰
Het weer is vandaag het slechtst van de week.|Сьогодні найгірша погода за тиждень.|The weather today is the worst of the week.|Le temps est aujourd’hui le pire de la semaine.|الطقس اليوم هو الأسوأ هذا الأسبوع.|🌧️
Zaterdag is de gezelligste dag van de week.|Субота — найприємніший день тижня.|Saturday is the nicest day of the week.|Le samedi est le jour le plus agréable de la semaine.|السبت هو أكثر أيام الأسبوع متعة.|🎉
Ik vind dit evenement het leukst.|Мені цей захід подобається найбільше.|I like this event the best.|C’est cet événement que je préfère.|هذه الفعالية هي المفضلة لدي.|🎈
`],
   a2feesten: ['Свята в Бельгії','Celebrations in Belgium','Fêtes en Belgique','الأعياد في بلجيكا', `
Sinterklaas|Святий Миколай (6 грудня)|Saint Nicholas|la Saint-Nicolas|القديس نيقولاوس|🎁|Sinterklaas komt op 6 december.|Святий Миколай приходить 6 грудня.
Kerstmis|Різдво|Christmas|Noël|عيد الميلاد|🎉|Met Kerstmis eten we samen met de familie.|На Різдво ми їмо разом із родиною.
Nieuwjaar|Новий рік|New Year|le Nouvel An|رأس السنة|🎆|Op oudejaarsavond wensen we elkaar een gelukkig Nieuwjaar.|У переддень Нового року ми бажаємо одне одному щасливого Нового року.
Pasen|Великдень|Easter|Pâques|عيد الفصح|🐇|Met Pasen zoeken de kinderen paaseieren.|На Великдень діти шукають великодні яйця.
de feestdag|святковий день|public holiday|le jour férié|يوم العطلة الرسمية|📅|Op een feestdag zijn de winkels gesloten.|У святковий день магазини зачинені.
de uitnodiging|запрошення|invitation|l’invitation|الدعوة|💌|Ik heb een uitnodiging voor het feest gekregen.|Я отримав запрошення на свято.
het cadeau|подарунок|present|le cadeau|الهدية|🎁|Ik koop een cadeau voor de verjaardag.|Я купую подарунок на день народження.
feliciteren|вітати|to congratulate|féliciter|يهنّئ|🎈|Wij feliciteren onze buurvrouw.|Ми вітаємо нашу сусідку.
`],
   a2vrijwilliger: ['Клуби й волонтерство','Clubs and volunteering','Clubs et bénévolat','النوادي والتطوع', `
de vrijwilliger|волонтер|volunteer|le bénévole|المتطوّع|🤲|De vrijwilliger helpt bij de voedselbank.|Волонтер допомагає в продовольчому банку.
de vereniging|об’єднання, асоціація|association|l’association|الجمعية|👥|Ik ben lid van een vereniging in de buurt.|Я член об’єднання поблизу.
het lidgeld|членський внесок|membership fee|la cotisation|رسوم العضوية|💶|Het lidgeld is twintig euro per jaar.|Членський внесок — двадцять євро на рік.
de training|тренування|training|l’entraînement|التدريب|🏃|De training begint om zeven uur.|Тренування починається о сьомій.
de buurtwerking|робота з жителями району|neighbourhood work|l’action de quartier|العمل المجتمعي في الحي|🏘️|De buurtwerking organiseert een ontmoeting.|Організація району влаштовує зустріч.
meehelpen|допомагати разом|to help out|donner un coup de main|يساعد معهم|🤝|Wil je meehelpen met het feest?|Хочеш допомогти зі святом?
de ontmoeting|зустріч|meeting|la rencontre|اللقاء|🧑‍🤝‍🧑|De ontmoeting is elke tweede zaterdag.|Зустріч щодругої суботи.
het taalcafé|мовне кафе|language café|le café linguistique|مقهى اللغة|☕|In het taalcafé oefen ik Nederlands.|У мовному кафе я практикую нідерландську.
`],
   a2regelszin: ['Довші речення: hoewel, zodat, zodra','Longer sentences: hoewel, zodat, zodra','Phrases plus longues : hoewel, zodat, zodra','جمل أطول: hoewel وzodat وzodra', `
Hoewel het regent, gaan we naar het feest.|Хоча йде дощ, ми йдемо на свято.|Although it is raining, we are going to the party.|Bien qu’il pleuve, nous allons à la fête.|رغم أنها تمطر، نذهب إلى الحفلة.|🌧️
Ik ruim op zodat de buren niet klagen.|Я прибираю, щоб сусіди не скаржилися.|I tidy up so that the neighbours do not complain.|Je range pour que les voisins ne se plaignent pas.|أرتّب كي لا يشتكي الجيران.|🧹
Zowel mijn man als mijn dochter doen mee.|І мій чоловік, і моя донька беруть участь.|Both my husband and my daughter take part.|Mon mari comme ma fille participent.|يشارك زوجي وابنتي معاً.|👨‍👩‍👧
Niet alleen de kinderen maar ook de ouders komen.|Приходять не лише діти, а й батьки.|Not only the children but also the parents are coming.|Non seulement les enfants, mais aussi les parents viennent.|لا يأتي الأطفال فقط بل الآباء أيضاً.|👪
Zodra de les begint, zetten we onze gsm uit.|Щойно починається урок, ми вимикаємо мобільні.|As soon as the lesson starts, we switch off our phones.|Dès que le cours commence, nous éteignons nos portables.|بمجرد أن يبدأ الدرس نُطفئ هواتفنا.|📱
Ik blijf thuis tenzij het stopt met regenen.|Я лишаюся вдома, хіба що дощ припиниться.|I stay at home unless it stops raining.|Je reste à la maison, sauf s’il arrête de pleuvoir.|أبقى في البيت إلا إذا توقف المطر.|🏠
Het feest was leuk doordat iedereen hielp.|Свято було приємним, бо всі допомагали.|The party was fun because everyone helped.|La fête était sympa parce que tout le monde a aidé.|كانت الحفلة ممتعة لأن الجميع ساعد.|🥂
Zolang we samenwerken, lukt het.|Поки ми працюємо разом, усе вдається.|As long as we work together, it works out.|Tant que nous travaillons ensemble, ça marche.|ما دمنا نعمل معاً ننجح.|✨
`]
  },
  notes: {
   a2regels: ['Читай повідомлення зі школи уважно: datum, uur, wat meenemen. Питай, якщо щось незрозуміло.','Read school messages carefully: datum, uur, wat meenemen. Ask if something is unclear.','Lis bien les messages de l’école : datum, uur, wat meenemen. Demande si quelque chose n’est pas clair.','اقرأ رسائل المدرسة بعناية: datum وuur وwat meenemen. اسأل إذا كان شيء غير واضح.'],
   a2volwassen: ['Ik wil mijn diploma laten erkennen — готова фраза. Спитай у школі або в громаді, куди звернутися.','Ik wil mijn diploma laten erkennen — a ready phrase. Ask at school or the municipality where to go.','Ik wil mijn diploma laten erkennen — phrase toute faite. Demande à l’école ou à la commune où t’adresser.','Ik wil mijn diploma laten erkennen — عبارة جاهزة. اسأل في المدرسة أو البلدية إلى أين تتوجه.'],
   a2zich: ['ik … me, jij … je, hij/zij … zich, wij … ons. Ik voel me goed. Voorbereiden, inschrijven — часто із zich.','ik … me, jij … je, hij/zij … zich, wij … ons. Ik voel me goed. Voorbereiden, inschrijven often go with zich.','ik … me, jij … je, hij/zij … zich, wij … ons. Ik voel me goed. Voorbereiden et inschrijven vont souvent avec zich.','ik … me، jij … je، hij/zij … zich، wij … ons. Ik voel me goed. غالباً مع zich: voorbereiden وinschrijven.'],
   a2bank: ['Номер рахунку в Бельгії починається з BE (IBAN). Overschrijven = зробити переказ.','A Belgian account number starts with BE (IBAN). Overschrijven = make a transfer.','Un numéro de compte belge commence par BE (IBAN). Overschrijven = faire un virement.','رقم الحساب في بلجيكا يبدأ بـ BE (IBAN). Overschrijven = إجراء تحويل.'],
   a2rekening: ['Gestructureerde mededeling (+++…+++) вказуй точно. Перед оплатою перевір vervaldatum.','Enter the gestructureerde mededeling (+++…+++) exactly. Check the vervaldatum before paying.','Indique exactement la gestructureerde mededeling (+++…+++). Vérifie la vervaldatum avant de payer.','اكتب gestructureerde mededeling (+++…+++) بدقة. تحقّق من vervaldatum قبل الدفع.'],
   a2klacht: ['Скарга: опиши проблему й причину: Ik wil een klacht indienen omdat het toestel defect is.','Complaint: describe the problem and the reason: Ik wil een klacht indienen omdat het toestel defect is.','Réclamation : décris le problème et la raison : Ik wil een klacht indienen omdat het toestel defect is.','الشكوى: صف المشكلة والسبب: Ik wil een klacht indienen omdat het toestel defect is.'],
   a2nieuwsw: ['У новинах короткі речення: хто? що сталося? де? Ключові слова: ongeval, staking, storm.','News uses short sentences: who? what happened? where? Key words: ongeval, staking, storm.','Les brèves sont courtes : qui ? que s’est-il passé ? où ? Mots clés : ongeval, staking, storm.','الأخبار جمل قصيرة: من؟ ماذا حدث؟ أين؟ كلمات مفتاحية: ongeval وstaking وstorm.'],
   a2weer: ['Прогноз: Morgen wordt het … / Er komt … Додай температуру: tien graden.','Forecast: Morgen wordt het … / Er komt … Add the temperature: tien graden.','Prévisions : Morgen wordt het … / Er komt … Ajoute la température : tien graden.','التوقعات: Morgen wordt het … / Er komt … أضف الحرارة: tien graden.'],
   a2superlatief: ['Вищий ступінь: warmer dan. Найвищий: de/het + -ste: de koudste, het mooiste.','Comparative: warmer dan. Superlative: de/het + -ste: de koudste, het mooiste.','Comparatif : warmer dan. Superlatif : de/het + -ste : de koudste, het mooiste.','المقارنة: warmer dan. التفضيل: de/het + -ste: de koudste, het mooiste.'],
   a2feesten: ['Sinterklaas — 6 грудня, Kerstmis — 25 грудня. У feestdag магазини й установи часто зачинені.','Sinterklaas — 6 December, Kerstmis — 25 December. On a feestdag shops and offices are often closed.','Sinterklaas — 6 décembre, Kerstmis — 25 décembre. Un feestdag, magasins et administrations sont souvent fermés.','Sinterklaas — 6 ديسمبر، Kerstmis — 25 ديسمبر. في feestdag تُغلق المتاجر والدوائر غالباً.'],
   a2vrijwilliger: ['Приєднатися: Ik wil graag meehelpen. Спитай: Wat is het lidgeld?','To join in: Ik wil graag meehelpen. Ask: Wat is het lidgeld?','Pour participer : Ik wil graag meehelpen. Demande : Wat is het lidgeld ?','للمشاركة: Ik wil graag meehelpen. اسأل: Wat is het lidgeld?'],
   a2regelszin: ['Після hoewel, zodat, zodra, tenzij, doordat, zolang дієслово йде в кінець. Якщо підрядне на початку, головне починається з дієслова: Hoewel het regent, gaan we.','After hoewel, zodat, zodra, tenzij, doordat, zolang the verb goes to the end. If the subordinate clause comes first, the main clause starts with the verb: Hoewel het regent, gaan we.','Après hoewel, zodat, zodra, tenzij, doordat, zolang, le verbe va à la fin. Si la subordonnée est en tête, la principale commence par le verbe : Hoewel het regent, gaan we.','بعد hoewel وzodat وzodra وtenzij وdoordat وzolang يذهب الفعل إلى النهاية. إذا بدأت الجملة بالفرعية، تبدأ الرئيسية بالفعل: Hoewel het regent, gaan we.']
  },
  gaps: {
   a2school:['Ik schrijf ___ in voor een cursus.','me','zich','jullie','hem'],
   a2geld:['Ik wil een klacht indienen ___ het toestel defect is.','omdat','want','dus','maar'],
   a2nieuws:['Januari is de ___ maand van het jaar.','koudste','kouder','koud','kouds'],
   a2samen:['Hoewel het ___, gaan we naar het feest.','regent','regen','regenen','geregend']
  },
  bank: [
   ['a2school',1,'ik|schrijf|me|in','SVRI','Я записуюся.','I enrol.','Je m’inscris.','أسجّل نفسي.','zich','.'],
   ['a2school',1,'wanneer|is|de ouderavond','QVS','Коли батьківські збори?','When is the parents’ evening?','Quand a lieu la réunion de parents ?','متى اجتماع أولياء الأمور؟','','?'],
   ['a2school',1,'mijn zoon|maakt|zijn huiswerk|na school','SVRR','Мій син робить домашнє завдання після школи.','My son does his homework after school.','Mon fils fait ses devoirs après l’école.','ابني يؤدي واجبه بعد المدرسة.','','.'],
   ['a2school',2,'ik|voel|me|vandaag|goed','SVRRR','Сьогодні я почуваюся добре.','I feel good today.','Je me sens bien aujourd’hui.','أشعر اليوم بأنني بخير.','zich','.'],
   ['a2school',2,'ik|moet|me|voorbereiden|op het examen','SVRRR','Я мушу підготуватися до іспиту.','I have to prepare for the exam.','Je dois me préparer à l’examen.','يجب أن أستعد للامتحان.','','.'],
   ['a2geld',1,'ik|betaal|met mijn bankkaart','SVRR','Я плачу банківською карткою.','I pay with my bank card.','Je paie avec ma carte bancaire.','أدفع ببطاقتي المصرفية.','','.'],
   ['a2geld',1,'wanneer|is|de vervaldatum','QVS','Коли кінцева дата оплати?','When is the due date?','Quelle est la date d’échéance ?','متى تاريخ الاستحقاق؟','','?'],
   ['a2geld',1,'ik|wil|een klacht|indienen','SVRI','Я хочу подати скаргу.','I want to file a complaint.','Je veux déposer une réclamation.','أريد تقديم شكوى.','','.'],
   ['a2geld',2,'het toestel|is|defect','SVR','Пристрій несправний.','The device is faulty.','L’appareil est défectueux.','الجهاز معطّل.','zijn','.'],
   ['a2geld',2,'ik|ben|niet tevreden|omdat|het toestel|defect|is','SVRRRRI','Я не задоволений, бо пристрій несправний.','I am not satisfied because the device is faulty.','Je ne suis pas satisfait parce que l’appareil est défectueux.','لست راضياً لأن الجهاز معطّل.','want','.'],
   ['a2nieuws',1,'wat|is|het nieuws','QVS','Які новини?','What is the news?','Quelles sont les nouvelles ?','ما الأخبار؟','','?'],
   ['a2nieuws',1,'de trein|is|sneller|dan de bus','SVRR','Потяг швидший за автобус.','The train is faster than the bus.','Le train est plus rapide que le bus.','القطار أسرع من الحافلة.','','.'],
   ['a2nieuws',1,'morgen|komt|er|een storm','TVSR','Завтра буде буря.','Tomorrow there will be a storm.','Demain, il y aura une tempête.','غداً ستأتي عاصفة.','komen','.'],
   ['a2nieuws',2,'januari|is|de koudste maand','SVR','Січень — найхолодніший місяць.','January is the coldest month.','Janvier est le mois le plus froid.','يناير هو أبرد شهر.','kouder','.'],
   ['a2nieuws',2,'vandaag|is|het|warmer|dan gisteren','TVSRR','Сьогодні тепліше, ніж учора.','Today it is warmer than yesterday.','Aujourd’hui, il fait plus chaud qu’hier.','اليوم أدفأ من أمس.','','.'],
   ['a2samen',1,'ik|wil|graag|meehelpen','SVRI','Я хочу допомогти.','I would like to help out.','Je voudrais donner un coup de main.','أرغب في المساعدة.','','.'],
   ['a2samen',1,'wat|is|het lidgeld','QVS','Який членський внесок?','What is the membership fee?','Quelle est la cotisation ?','كم رسوم العضوية؟','','?'],
   ['a2samen',1,'ik|koop|een cadeau|voor de verjaardag','SVRR','Я купую подарунок на день народження.','I buy a present for the birthday.','J’achète un cadeau pour l’anniversaire.','أشتري هدية لعيد الميلاد.','','.'],
   ['a2samen',2,'hoewel het regent|gaan|we|naar het feest','TVSR','Хоча йде дощ, ми йдемо на свято.','Although it is raining, we are going to the party.','Bien qu’il pleuve, nous allons à la fête.','رغم أنها تمطر، نذهب إلى الحفلة.','gaat','.'],
   ['a2samen',2,'het feest|was|leuk|doordat|iedereen|hielp','SVRRSI','Свято було приємним, бо всі допомагали.','The party was fun because everyone helped.','La fête était sympa parce que tout le monde a aidé.','كانت الحفلة ممتعة لأن الجميع ساعد.','want','.']
  ],
  dialogues: [
   ['a2school','🎓','Батьківська зустріч','Parent–teacher meeting','Rencontre parents-enseignant','لقاء أولياء الأمور والمعلّم',[
    ['Goedenavond, ik ben de mama van Sofia. Hoe gaat het op school?','Добрий вечір, я мама Софії. Як справи в школі?','Good evening, I’m Sofia’s mum. How is she doing at school?'],
    ['Goed. Sofia werkt hard en ze maakt altijd haar huiswerk.','Добре. Софія старанно працює й завжди робить домашнє завдання.','Well. Sofia works hard and always does her homework.'],
    ['En met Nederlands? Ze spreekt thuis Oekraïens.','А з нідерландською? Вдома вона розмовляє українською.','And with Dutch? She speaks Ukrainian at home.'],
    ['Ze maakt veel vooruitgang. Ze leest elke dag een boekje.','Вона робить великі успіхи. Щодня читає книжечку.','She is making a lot of progress. She reads a little book every day.'],
    ['Kan ze extra hulp krijgen?','Чи може вона отримати додаткову допомогу?','Can she get extra help?'],
    ['Ja, op woensdagmiddag is er huiswerkbegeleiding.','Так, у середу після обіду є допомога з домашніми завданнями.','Yes, on Wednesday afternoon there is homework supervision.']]],
   ['a2geld','💶','Скарга в службу підтримки','A complaint to customer service','Une réclamation au service clientèle','شكوى إلى خدمة العملاء',[
    ['Klantendienst, goedemiddag. Waarmee kan ik u helpen?','Служба підтримки, добрий день. Чим можу допомогти?','Customer service, good afternoon. How can I help you?'],
    ['Goedemiddag, ik heb vorige week een wasmachine gekocht, maar ze is defect.','Добрий день, минулого тижня я купив пральну машину, але вона несправна.','Good afternoon, I bought a washing machine last week, but it is faulty.'],
    ['Dat spijt me. Hebt u het aankoopbewijs?','Мені шкода. У вас є підтвердження покупки?','I’m sorry. Do you have the proof of purchase?'],
    ['Ja, ik stuur het u per e-mail door.','Так, я надішлю його вам електронною поштою.','Yes, I’ll send it to you by email.'],
    ['Goed. We komen volgende week langs om de machine te vervangen.','Добре. Наступного тижня ми приїдемо замінити машину.','Good. We’ll come by next week to replace the machine.'],
    ['Prima. Dank u wel voor uw hulp.','Чудово. Дякую за допомогу.','Great. Thank you for your help.']]],
   ['a2nieuws','📰','Новини й погода','News and weather','Actualités et météo','الأخبار والطقس',[
    ['Heb je het nieuws gehoord? Morgen is er een staking bij de trein.','Ти чув новини? Завтра на залізниці страйк.','Did you hear the news? Tomorrow there is a train strike.'],
    ['Nee, dat wist ik niet. Hoe kom ik dan op mijn werk?','Ні, я цього не знав. Як тоді мені дістатися до роботи?','No, I didn’t know that. How do I get to work, then?'],
    ['Neem de fiets, want het weer wordt mooi.','Їдь велосипедом, бо погода буде гарна.','Take your bike, because the weather will be nice.'],
    ['Echt? De weersvoorspelling zei regen.','Справді? Прогноз обіцяв дощ.','Really? The weather forecast said rain.'],
    ['Dat was gisteren. Vandaag zegt men: zon en geen wind.','Це було вчора. Сьогодні кажуть: сонце й без вітру.','That was yesterday. Today they say: sun and no wind.'],
    ['Dan neem ik de fiets. Bedankt voor de tip!','Тоді я поїду велосипедом. Дякую за пораду!','Then I’ll take my bike. Thanks for the tip!']]],
   ['a2samen','🤝','Запрошення на свято вулиці','An invitation to the street party','Une invitation à la fête de quartier','دعوة إلى حفلة الحي',[
    ['Hallo buurvrouw! Er is zaterdag een buurtfeest in de straat.','Привіт, сусідко! У суботу у нашій вулиці свято для сусідів.','Hello neighbour! There is a street party on Saturday.'],
    ['Leuk! Hoe laat begint het?','Чудово! О котрій воно починається?','Nice! What time does it start?'],
    ['Om drie uur. Iedereen brengt iets te eten mee.','О третій. Усі приносять щось поїсти.','At three. Everyone brings something to eat.'],
    ['Dan maak ik een Oekraïense salade. Moet ik zelf stoelen meebrengen?','Тоді я приготую український салат. Мені самій принести стільці?','Then I’ll make a Ukrainian salad. Should I bring chairs myself?'],
    ['Nee, de buurtwerking zorgt voor stoelen en tafels. Wil je meehelpen met opruimen?','Ні, організація району подбає про стільці й столи. Хочеш допомогти з прибиранням?','No, the neighbourhood group will provide chairs and tables. Do you want to help clear up?'],
    ['Natuurlijk, graag! Tot zaterdag!','Звісно, залюбки! До суботи!','Of course, gladly! See you Saturday!']]]
  ],
  speech: [
   ['Wat zeg je tegen de leerkracht van je kind?','Що ти скажеш вчителю своєї дитини?','What do you say to your child’s teacher?','Goedemorgen, mijn zoon is vandaag ziek. Hij komt niet naar school.'],
   ['Waar volg je Nederlandse les?','Де ти вчиш нідерландську?','Where do you take Dutch lessons?','Ik volg Nederlands in het volwassenenonderwijs.'],
   ['Hoe bereid je je voor op het examen?','Як ти готуєшся до іспиту?','How do you prepare for the exam?','Ik oefen elke dag en ik herhaal de woorden.'],
   ['Hoe betaal je meestal?','Як ти зазвичай платиш?','How do you usually pay?','Ik betaal meestal met mijn bankkaart.'],
   ['Wat doe je als je een factuur niet begrijpt?','Що ти робиш, якщо не розумієш рахунок?','What do you do if you do not understand a bill?','Ik bel het bedrijf en ik vraag uitleg.'],
   ['Waarom dien je een klacht in?','Чому ти подаєш скаргу?','Why are you filing a complaint?','Ik dien een klacht in omdat het toestel defect is.'],
   ['Hoe volg je het nieuws?','Як ти стежиш за новинами?','How do you follow the news?','Ik lees het nieuws op mijn telefoon.'],
   ['Wat zegt de weersvoorspelling voor morgen?','Що каже прогноз погоди на завтра?','What does the weather forecast say for tomorrow?','Morgen is het zonnig en tien graden.'],
   ['Wat is de mooiste plaats in jouw stad?','Яке місце в твоєму місті найгарніше?','What is the most beautiful place in your city?','Het mooiste is het park bij de rivier.'],
   ['Welk feest vier je graag?','Яке свято ти любиш святкувати?','Which celebration do you like to celebrate?','Ik vier graag Kerstmis met mijn familie.'],
   ['Waarom ben je lid van een vereniging?','Чому ти член об’єднання?','Why are you a member of an association?','Ik ben lid omdat ik nieuwe mensen wil ontmoeten.'],
   ['Wat zeg je als je wilt meehelpen?','Що ти кажеш, якщо хочеш допомогти?','What do you say if you want to help?','Ik wil graag meehelpen.']
  ]
 };
 // ---- A2 chapter 9: grammar ----
 const a2p3 = {
  chapters: [
   ['a2gram','📘 Grammatica: tijden, bijzinnen, voorzetsels',['a2imp1','a2imp2','a2tijden','a2passief','a2relatief','a2er','a2alswanneer','a2bijzin','a2voorz','a2adj']]
  ],
  labels: {
   a2gram: [['Граматика A2: часи, підрядні, прийменники','Правила A2 з короткими поясненнями й прикладами: imperfectum, пасив, die/dat, er, als/wanneer, порядок слів.'],['A2 grammar: tenses, clauses, prepositions','A2 rules with short explanations and examples: imperfectum, passive, die/dat, er, als/wanneer, word order.'],['Grammaire A2 : temps, subordonnées, prépositions','Règles A2 avec courtes explications et exemples : imperfectum, passif, die/dat, er, als/wanneer, ordre des mots.'],['قواعد A2: الأزمنة والجمل الفرعية وحروف الجر','قواعد A2 مع شروح قصيرة وأمثلة: imperfectum والمبني للمجهول وdie/dat وer وals/wanneer وترتيب الكلمات.']]
  },
  lessons: {
   a2imp1: ['Imperfectum: правильні дієслова','Imperfectum: regular verbs','Imperfectum : verbes réguliers','Imperfectum: الأفعال المنتظمة', `
Ik werkte vroeger in een winkel.|Раніше я працював у магазині.|I used to work in a shop.|Avant, je travaillais dans un magasin.|كنت أعمل سابقاً في متجر.|🛍️
Wij woonden in Kyiv.|Ми жили в Києві.|We lived in Kyiv.|Nous habitions à Kyiv.|كنا نسكن في كييف.|🏠
Zij speelde buiten met de kinderen.|Вона гралася надворі з дітьми.|She played outside with the children.|Elle jouait dehors avec les enfants.|لعبت في الخارج مع الأطفال.|⚽
Hij leerde Nederlands in Oekraïne.|Він вивчав нідерландську в Україні.|He learned Dutch in Ukraine.|Il apprenait le néerlandais en Ukraine.|تعلّم الهولندية في أوكرانيا.|📚
Wij wachtten lang op de bus.|Ми довго чекали на автобус.|We waited a long time for the bus.|Nous avons attendu longtemps le bus.|انتظرنا الحافلة طويلاً.|🚌
Gisteren kookte ik soep.|Учора я варив суп.|Yesterday I cooked soup.|Hier, j’ai fait cuire une soupe.|أمس طبخت حساءً.|🍲
Ik belde mijn vriendin.|Я зателефонував подрузі.|I called my friend.|J’ai appelé mon amie.|اتصلت بصديقتي.|📞
Zij maakten een afspraak.|Вони домовилися про зустріч.|They made an appointment.|Ils ont pris rendez-vous.|حدّدوا موعداً.|📅
`],
   a2imp2: ['Imperfectum: сильні дієслова','Imperfectum: strong verbs','Imperfectum : verbes forts','Imperfectum: الأفعال القوية', `
Ik ging naar school.|Я пішов до школи.|I went to school.|Je suis allé à l’école.|ذهبت إلى المدرسة.|🏫
Hij kwam te laat.|Він прийшов запізно.|He came too late.|Il est arrivé trop tard.|وصل متأخراً.|⏰
Wij zagen een film.|Ми дивилися фільм.|We watched a film.|Nous avons regardé un film.|شاهدنا فيلماً.|🎬
Zij nam de bus.|Вона поїхала автобусом.|She took the bus.|Elle a pris le bus.|ركبت الحافلة.|🚌
Ik schreef een brief.|Я написав листа.|I wrote a letter.|J’ai écrit une lettre.|كتبت رسالة.|✉️
Wij aten samen.|Ми їли разом.|We ate together.|Nous avons mangé ensemble.|أكلنا معاً.|🍽️
Hij sprak met de dokter.|Він говорив із лікарем.|He spoke to the doctor.|Il a parlé au médecin.|تحدث مع الطبيب.|🩺
Het was koud en ik had honger.|Було холодно, і я був голодний.|It was cold and I was hungry.|Il faisait froid et j’avais faim.|كان الجو بارداً وكنت جائعاً.|❄️
`],
   a2tijden: ['Perfectum чи imperfectum?','Perfectum or imperfectum?','Perfectum ou imperfectum ?','Perfectum أم imperfectum؟', `
Vroeger woonde ik in Kyiv, nu woon ik in Gent.|Раніше я жив у Києві, тепер живу в Генті.|I used to live in Kyiv, now I live in Ghent.|Avant, j’habitais à Kyiv, maintenant j’habite à Gand.|كنت أسكن في كييف والآن أسكن في خنت.|🏙️
Gisteren ben ik naar de markt gegaan.|Учора я ходив на ринок.|Yesterday I went to the market.|Hier, je suis allé au marché.|ذهبت أمس إلى السوق.|🛒
Toen ik jong was, speelde ik voetbal.|Коли я був молодим, грав у футбол.|When I was young, I played football.|Quand j’étais jeune, je jouais au football.|عندما كنت شاباً كنت ألعب كرة القدم.|⚽
Ik heb vandaag al gegeten.|Я вже сьогодні їв.|I have already eaten today.|J’ai déjà mangé aujourd’hui.|أكلت اليوم بالفعل.|🍽️
Hij werkte tien jaar in een studio.|Він десять років працював у студії.|He worked in a studio for ten years.|Il a travaillé dix ans dans un studio.|عمل عشر سنوات في استوديو.|🎬
Wij hebben gisteren gewinkeld.|Учора ми ходили по магазинах.|We went shopping yesterday.|Nous avons fait les magasins hier.|تسوقنا أمس.|🛍️
Zij was ziek en bleef thuis.|Вона була хвора й лишилася вдома.|She was ill and stayed at home.|Elle était malade et est restée à la maison.|كانت مريضة وبقيت في البيت.|🤒
Ik heb mijn sleutels verloren.|Я загубив свої ключі.|I have lost my keys.|J’ai perdu mes clés.|أضعت مفاتيحي.|🔑
`],
   a2passief: ['Пасив: worden + дієприкметник','Passive: worden + participle','Passif : worden + participe','المبني للمجهول: worden + اسم المفعول', `
De winkel wordt om zes uur gesloten.|Магазин зачиняють о шостій.|The shop is closed at six.|Le magasin est fermé à six heures.|يُغلق المتجر في السادسة.|🏪
Het pakket wordt morgen bezorgd.|Посилку доставлять завтра.|The parcel will be delivered tomorrow.|Le colis sera livré demain.|سيُسلَّم الطرد غداً.|📦
Mijn aanvraag wordt nu behandeld.|Мою заяву зараз розглядають.|My application is being processed now.|Ma demande est en cours de traitement.|يجري الآن النظر في طلبي.|📋
Hier worden fietsen gerepareerd.|Тут ремонтують велосипеди.|Bicycles are repaired here.|Ici, on répare des vélos.|تُصلَّح الدراجات هنا.|🚲
In Vlaanderen wordt Nederlands gesproken.|У Фландрії розмовляють нідерландською.|Dutch is spoken in Flanders.|En Flandre, on parle néerlandais.|يُتحدث بالهولندية في فلاندر.|🗣️
De brief wordt door de gemeente verstuurd.|Лист надсилає громада.|The letter is sent by the municipality.|La lettre est envoyée par la commune.|تُرسل الرسالة من البلدية.|✉️
Deze straat wordt volgende week afgesloten.|Цю вулицю закриють наступного тижня.|This street will be closed next week.|Cette rue sera fermée la semaine prochaine.|سيُغلق هذا الشارع الأسبوع القادم.|🚧
Het huis werd vorig jaar verkocht.|Будинок продали торік.|The house was sold last year.|La maison a été vendue l’année dernière.|بيع المنزل العام الماضي.|🏠
`],
   a2relatief: ['Відносні речення: die / dat','Relative clauses: die / dat','Propositions relatives : die / dat','الجمل الموصولة: die / dat', `
De man die naast ons woont, is vriendelijk.|Чоловік, що живе поруч із нами, привітний.|The man who lives next to us is friendly.|L’homme qui habite à côté de chez nous est sympathique.|الرجل الذي يسكن بجانبنا لطيف.|👨
Het huis dat ik huur, is klein.|Будинок, який я орендую, малий.|The house that I rent is small.|La maison que je loue est petite.|المنزل الذي أستأجره صغير.|🏠
Ik heb een buurvrouw die heel goed kookt.|У мене є сусідка, яка дуже добре готує.|I have a neighbour who cooks very well.|J’ai une voisine qui cuisine très bien.|لدي جارة تطبخ جيداً جداً.|🍲
Het boek dat ik lees, is spannend.|Книжка, яку я читаю, цікава.|The book that I am reading is exciting.|Le livre que je lis est passionnant.|الكتاب الذي أقرؤه مشوّق.|📖
De kinderen die buiten spelen, zijn mijn buren.|Діти, які граються надворі, мої сусіди.|The children who are playing outside are my neighbours.|Les enfants qui jouent dehors sont mes voisins.|الأطفال الذين يلعبون في الخارج هم جيراني.|🧒
Dit is het formulier dat u moet invullen.|Це форма, яку ви маєте заповнити.|This is the form that you have to fill in.|Voici le formulaire que vous devez remplir.|هذا هو النموذج الذي يجب أن تملأه.|📄
Waar is de pen die op tafel lag?|Де ручка, що лежала на столі?|Where is the pen that was on the table?|Où est le stylo qui était sur la table ?|أين القلم الذي كان على الطاولة؟|✏️
Het feest dat zaterdag begint, is gratis.|Свято, що починається в суботу, безкоштовне.|The party that starts on Saturday is free.|La fête qui commence samedi est gratuite.|الحفلة التي تبدأ يوم السبت مجانية.|🎉
`],
   a2er: ['Er: місце й кількість','Er: place and quantity','Er : lieu et quantité','Er: المكان والكمية', `
Er is een bushalte bij mijn huis.|Біля мого будинку є автобусна зупинка.|There is a bus stop near my house.|Il y a un arrêt de bus près de chez moi.|توجد محطة حافلات قرب بيتي.|🚏
Er zijn twee scholen in de buurt.|У районі є дві школи.|There are two schools in the neighbourhood.|Il y a deux écoles dans le quartier.|توجد مدرستان في الحي.|🏫
Ik ga er morgen naartoe.|Я піду туди завтра.|I am going there tomorrow.|J’y vais demain.|سأذهب إلى هناك غداً.|🚶
Heb je broers? Ja, ik heb er twee.|У тебе є брати? Так, у мене їх двоє.|Do you have brothers? Yes, I have two.|Tu as des frères ? Oui, j’en ai deux.|هل لديك إخوة؟ نعم، لدي اثنان.|👪
Er staat een fiets voor de deur.|Перед дверима стоїть велосипед.|There is a bike in front of the door.|Il y a un vélo devant la porte.|توجد دراجة أمام الباب.|🚲
Wie woont er in dit huis?|Хто живе в цьому будинку?|Who lives in this house?|Qui habite dans cette maison ?|من يسكن في هذا البيت؟|🏠
Hoeveel kinderen zijn er in de klas?|Скільки дітей у класі?|How many children are there in the class?|Combien d’enfants y a-t-il dans la classe ?|كم طفلاً في الصف؟|🧒
Ik werk er al drie jaar.|Я працюю там уже три роки.|I have worked there for three years.|J’y travaille depuis trois ans.|أعمل هناك منذ ثلاث سنوات.|💼
`],
   a2alswanneer: ['Als, wanneer, toen','Als, wanneer, toen','Als, wanneer, toen','Als وwanneer وtoen', `
Als het regent, neem ik de bus.|Якщо йде дощ, я їду автобусом.|If it rains, I take the bus.|S’il pleut, je prends le bus.|إذا أمطرت أركب الحافلة.|🌧️
Wanneer begint de les?|Коли починається урок?|When does the lesson start?|Quand commence le cours ?|متى يبدأ الدرس؟|⏰
Toen ik klein was, woonde ik in Oekraïne.|Коли я був малим, жив в Україні.|When I was small, I lived in Ukraine.|Quand j’étais petit, j’habitais en Ukraine.|عندما كنت صغيراً كنت أسكن في أوكرانيا.|🧒
Als je ziek bent, bel dan je werkgever.|Якщо ти хворий, зателефонуй роботодавцю.|If you are ill, call your employer.|Si tu es malade, appelle ton employeur.|إذا كنت مريضاً اتصل بصاحب العمل.|🤒
Wanneer kom je naar huis?|Коли ти приїдеш додому?|When are you coming home?|Quand rentres-tu à la maison ?|متى ستعود إلى البيت؟|🏠
Toen ik aankwam, was het al laat.|Коли я приїхав, було вже пізно.|When I arrived, it was already late.|Quand je suis arrivé, il était déjà tard.|عندما وصلت كان الوقت متأخراً.|🌙
Als ik tijd heb, bel ik je.|Якщо в мене буде час, я тобі зателефоную.|If I have time, I will call you.|Si j’ai le temps, je t’appelle.|إذا كان لدي وقت سأتصل بك.|📞
Ik weet niet wanneer de trein vertrekt.|Я не знаю, коли відходить потяг.|I do not know when the train leaves.|Je ne sais pas quand le train part.|لا أعرف متى يغادر القطار.|🚆
`],
   a2bijzin: ['Порядок слів у підрядних','Word order in subordinate clauses','Ordre des mots dans les subordonnées','ترتيب الكلمات في الجمل الفرعية', `
Ik denk dat het morgen regent.|Я думаю, що завтра буде дощ.|I think that it will rain tomorrow.|Je pense qu’il pleuvra demain.|أظن أنها ستمطر غداً.|🌧️
Ik weet niet of hij thuis is.|Я не знаю, чи він удома.|I do not know whether he is at home.|Je ne sais pas s’il est à la maison.|لا أعرف إن كان في البيت.|🏠
Zij zegt dat ze graag in Gent woont.|Вона каже, що їй подобається жити в Генті.|She says that she likes living in Ghent.|Elle dit qu’elle aime habiter à Gand.|تقول إنها تحب السكن في خنت.|🏙️
Ik ben moe omdat ik niet goed heb geslapen.|Я втомлений, бо погано спав.|I am tired because I did not sleep well.|Je suis fatigué parce que je n’ai pas bien dormi.|أنا متعب لأنني لم أنم جيداً.|😴
Hij vraagt of ik mee wil komen.|Він питає, чи хочу я піти з ним.|He asks whether I want to come along.|Il demande si je veux venir avec lui.|يسأل إن كنت أريد القدوم معه.|🙋
Ik weet dat jij een afspraak hebt.|Я знаю, що в тебе зустріч.|I know that you have an appointment.|Je sais que tu as un rendez-vous.|أعرف أن لديك موعداً.|📅
Zij blijft thuis omdat de kinderen ziek zijn.|Вона лишається вдома, бо діти хворі.|She stays at home because the children are ill.|Elle reste à la maison parce que les enfants sont malades.|تبقى في البيت لأن الأطفال مرضى.|🤒
Ik hoop dat je snel beter wordt.|Сподіваюся, ти швидко одужаєш.|I hope that you get better soon.|J’espère que tu iras vite mieux.|آمل أن تتحسن قريباً.|💐
`],
   a2voorz: ['Прийменники: in/op, naar/uit','Prepositions: in/op, naar/uit','Prépositions : in/op, naar/uit','حروف الجر: in/op وnaar/uit', `
Ik woon in Gent, maar ik werk in Brussel.|Я живу в Генті, але працюю в Брюсселі.|I live in Ghent, but I work in Brussels.|J’habite à Gand, mais je travaille à Bruxelles.|أسكن في خنت لكنني أعمل في بروكسل.|🏙️
Morgen ga ik naar Antwerpen.|Завтра я їду до Антверпена.|Tomorrow I am going to Antwerp.|Demain, je vais à Anvers.|غداً أذهب إلى أنتويرب.|🚆
Mijn buurman komt uit Polen.|Мій сусід родом із Польщі.|My neighbour comes from Poland.|Mon voisin vient de Pologne.|جاري من بولندا.|🌍
Het boek ligt op de tafel.|Книжка лежить на столі.|The book is on the table.|Le livre est sur la table.|الكتاب على الطاولة.|📖
Ik wacht op de bus.|Я чекаю на автобус.|I am waiting for the bus.|J’attends le bus.|أنتظر الحافلة.|🚌
Ik denk vaak aan mijn familie.|Я часто думаю про свою родину.|I often think of my family.|Je pense souvent à ma famille.|أفكر كثيراً في عائلتي.|👪
De les is op dinsdag om negen uur.|Урок у вівторок о дев’ятій.|The lesson is on Tuesday at nine o’clock.|Le cours a lieu mardi à neuf heures.|الدرس يوم الثلاثاء الساعة التاسعة.|📅
Wij gaan met de trein naar Gent.|Ми їдемо потягом до Гента.|We are going to Ghent by train.|Nous allons à Gand en train.|نذهب إلى خنت بالقطار.|🚆
`],
   a2adj: ['Прикметники: закінчення -e','Adjectives: the -e ending','Adjectifs : la terminaison -e','الصفات: النهاية -e', `
Dat is een groot huis.|Це великий будинок.|That is a big house.|C’est une grande maison.|هذا منزل كبير.|🏠
Dat is het grote huis aan de hoek.|Це великий будинок на розі.|That is the big house on the corner.|C’est la grande maison au coin.|هذا هو المنزل الكبير عند الزاوية.|🏘️
Wij hebben een nieuwe buurman.|У нас новий сусід.|We have a new neighbour.|Nous avons un nouveau voisin.|لدينا جار جديد.|👨
Het nieuwe boek is duur.|Нова книжка дорога.|The new book is expensive.|Le nouveau livre est cher.|الكتاب الجديد غالٍ.|📖
Ik zoek een goedkoop appartement.|Я шукаю дешеву квартиру.|I am looking for a cheap apartment.|Je cherche un appartement bon marché.|أبحث عن شقة رخيصة.|🏢
Zij draagt een rode jas.|Вона носить червоне пальто.|She is wearing a red coat.|Elle porte un manteau rouge.|ترتدي معطفاً أحمر.|🧥
Het rode huis is van mijn buurman.|Червоний будинок належить моєму сусідові.|The red house belongs to my neighbour.|La maison rouge est à mon voisin.|المنزل الأحمر لجاري.|🏠
Dit is een gezellige straat.|Це затишна вулиця.|This is a cosy street.|C’est une rue conviviale.|هذا شارع مريح.|🏘️
`]
  },
  notes: {
   a2imp1: ['Основа + -te/-de: werk→werkte, woon→woonde. Після t, k, f, s, ch, p (’t kofschip) — -te, інакше -de. Множина: -ten/-den.','Stem + -te/-de: werk→werkte, woon→woonde. After t, k, f, s, ch, p (’t kofschip) use -te, otherwise -de. Plural: -ten/-den.','Radical + -te/-de : werk→werkte, woon→woonde. Après t, k, f, s, ch, p (’t kofschip) : -te, sinon -de. Pluriel : -ten/-den.','الجذر + -te/-de: werk→werkte وwoon→woonde. بعد t وk وf وs وch وp (’t kofschip) نستعمل -te وإلا -de. الجمع: -ten/-den.'],
   a2imp2: ['Сильні дієслова змінюють голосну: gaan→ging, komen→kwam, zien→zag, nemen→nam. Їх треба вчити напам’ять; у множині: gingen, kwamen, zagen, namen.','Strong verbs change the vowel: gaan→ging, komen→kwam, zien→zag, nemen→nam. Learn them by heart; plural: gingen, kwamen, zagen, namen.','Les verbes forts changent de voyelle : gaan→ging, komen→kwam, zien→zag, nemen→nam. À apprendre par cœur ; pluriel : gingen, kwamen, zagen, namen.','الأفعال القوية تغيّر حرف العلّة: gaan→ging وkomen→kwam وzien→zag وnemen→nam. تُحفظ عن ظهر قلب؛ الجمع: gingen وkwamen وzagen وnamen.'],
   a2tijden: ['У розмові про недавнє й результат — perfectum (ik heb gegeten). У розповіді про минуле, у was/had і в описах — imperfectum (ik werkte, ik was).','For recent events and results use the perfectum (ik heb gegeten). For stories about the past, was/had and descriptions use the imperfectum (ik werkte, ik was).','Pour le récent et le résultat : perfectum (ik heb gegeten). Pour un récit passé, was/had et les descriptions : imperfectum (ik werkte, ik was).','للحدث القريب والنتيجة نستعمل perfectum (ik heb gegeten). وللسرد عن الماضي وwas/had والوصف نستعمل imperfectum (ik werkte وik was).'],
   a2passief: ['worden + дієприкметник у кінці: De brief wordt verstuurd. Минулий час: werd. Хто виконує дію — door: door de gemeente.','worden + participle at the end: De brief wordt verstuurd. Past: werd. The doer comes with door: door de gemeente.','worden + participe à la fin : De brief wordt verstuurd. Passé : werd. L’agent avec door : door de gemeente.','worden + اسم المفعول في النهاية: De brief wordt verstuurd. الماضي: werd. الفاعل مع door: door de gemeente.'],
   a2relatief: ['die — для de-слів і множини, dat — для het-слів. Дієслово йде в кінець: Het huis dat ik huur. Wat — після alles, iets, niets.','die for de-words and plurals, dat for het-words. The verb goes to the end: Het huis dat ik huur. Wat after alles, iets, niets.','die pour les mots en de et le pluriel, dat pour les mots en het. Le verbe va à la fin : Het huis dat ik huur. Wat après alles, iets, niets.','die لكلمات de والجمع، وdat لكلمات het. الفعل في النهاية: Het huis dat ik huur. وwat بعد alles وiets وniets.'],
   a2er: ['Er is / er zijn = є. Er = «там» (ik ga er naartoe). Er = «їх» при кількості (ik heb er twee). У питаннях: Wie woont er?','Er is / er zijn = there is / are. Er = “there” (ik ga er naartoe). Er = “of them” with a number (ik heb er twee). In questions: Wie woont er?','Er is / er zijn = il y a. Er = « y » (ik ga er naartoe). Er = « en » avec un nombre (ik heb er twee). Dans les questions : Wie woont er ?','Er is / er zijn = يوجد. er = «هناك» (ik ga er naartoe). er = «منهم» مع العدد (ik heb er twee). في الأسئلة: Wie woont er؟'],
   a2alswanneer: ['Als — умова або повторення (als het regent). Wanneer — «коли?» у питанні й підрядному. Toen — одна подія в минулому (toen ik aankwam).','Als — condition or repetition (als het regent). Wanneer — “when?” in questions and subordinate clauses. Toen — one event in the past (toen ik aankwam).','Als — condition ou répétition (als het regent). Wanneer — « quand ? » dans les questions et subordonnées. Toen — un événement passé (toen ik aankwam).','Als — شرط أو تكرار (als het regent). Wanneer — «متى؟» في الأسئلة والجمل الفرعية. Toen — حدث واحد في الماضي (toen ik aankwam).'],
   a2bijzin: ['Після dat, of, omdat, als, wanneer дієслово йде в кінець: Ik denk dat het regent. Два дієслова: …omdat ik niet heb geslapen.','After dat, of, omdat, als, wanneer the verb goes to the end: Ik denk dat het regent. Two verbs: …omdat ik niet heb geslapen.','Après dat, of, omdat, als, wanneer, le verbe va à la fin : Ik denk dat het regent. Deux verbes : …omdat ik niet heb geslapen.','بعد dat وof وomdat وals وwanneer يذهب الفعل إلى النهاية: Ik denk dat het regent. فعلان: …omdat ik niet heb geslapen.'],
   a2voorz: ['in/op — де? (in Gent, op tafel). naar — куди? (naar Gent). uit — звідки? (uit Polen). Op de bus wachten, aan iets denken — фіксовані пари.','in/op — where? (in Gent, op tafel). naar — where to? (naar Gent). uit — where from? (uit Polen). Op de bus wachten, aan iets denken are fixed pairs.','in/op — où ? (in Gent, op tafel). naar — vers où ? (naar Gent). uit — d’où ? (uit Polen). Op de bus wachten, aan iets denken sont des paires fixes.','in/op — أين؟ (in Gent وop tafel). naar — إلى أين؟ (naar Gent). uit — من أين؟ (uit Polen). Op de bus wachten وaan iets denken تراكيب ثابتة.'],
   a2adj: ['Перед іменником прикметник майже завжди має -e: de grote stad, het grote huis, een nieuwe buurman. Виняток: een groot huis (een + het-слово) без -e.','Before a noun an adjective usually ends in -e: de grote stad, het grote huis, een nieuwe buurman. Exception: een groot huis (een + het-word) has no -e.','Devant un nom, l’adjectif prend presque toujours -e : de grote stad, het grote huis, een nieuwe buurman. Exception : een groot huis (een + mot en het) sans -e.','قبل الاسم تنتهي الصفة غالباً بـ -e: de grote stad وhet grote huis وeen nieuwe buurman. الاستثناء: een groot huis (een + كلمة het) بلا -e.']
  },
  gaps: {
   a2gram:['De man ___ naast ons woont, is vriendelijk.','die','dat','wat','wie']
  },
  bank: [
   ['a2gram',1,'ik|werkte|vroeger|in een winkel','SVTR','Раніше я працював у магазині.','I used to work in a shop.','Avant, je travaillais dans un magasin.','كنت أعمل سابقاً في متجر.','werk','.'],
   ['a2gram',1,'wij|woonden|in Kyiv','SVR','Ми жили в Києві.','We lived in Kyiv.','Nous habitions à Kyiv.','كنا نسكن في كييف.','woonde','.'],
   ['a2gram',1,'ik|ging|naar school','SVR','Я пішов до школи.','I went to school.','Je suis allé à l’école.','ذهبت إلى المدرسة.','gaat','.'],
   ['a2gram',1,'hij|kwam|te laat','SVR','Він прийшов запізно.','He came too late.','Il est arrivé trop tard.','وصل متأخراً.','kom','.'],
   ['a2gram',1,'de winkel|wordt|om zes uur|gesloten','SVRR','Магазин зачиняють о шостій.','The shop is closed at six.','Le magasin est fermé à six heures.','يُغلق المتجر في السادسة.','worden','.'],
   ['a2gram',1,'het pakket|wordt|morgen|bezorgd','SVTR','Посилку доставлять завтра.','The parcel will be delivered tomorrow.','Le colis sera livré demain.','سيُسلَّم الطرد غداً.','worden','.'],
   ['a2gram',1,'ik|heb|een buurvrouw|die|goed|kookt','SVRRRV','У мене є сусідка, яка добре готує.','I have a neighbour who cooks well.','J’ai une voisine qui cuisine bien.','لدي جارة تطبخ جيداً.','dat','.'],
   ['a2gram',1,'er|is|een bushalte|bij mijn huis','RVSR','Біля мого будинку є автобусна зупинка.','There is a bus stop near my house.','Il y a un arrêt de bus près de chez moi.','توجد محطة حافلات قرب بيتي.','zijn','.'],
   ['a2gram',1,'er|zijn|twee scholen|in de buurt','RVSR','У районі є дві школи.','There are two schools in the neighbourhood.','Il y a deux écoles dans le quartier.','توجد مدرستان في الحي.','is','.'],
   ['a2gram',1,'wanneer|begint|de les','QVS','Коли починається урок?','When does the lesson start?','Quand commence le cours ?','متى يبدأ الدرس؟','als','?'],
   ['a2gram',1,'ik|denk|dat|het|morgen|regent','SVRSTV','Я думаю, що завтра буде дощ.','I think that it will rain tomorrow.','Je pense qu’il pleuvra demain.','أظن أنها ستمطر غداً.','regen','.'],
   ['a2gram',1,'ik|weet|niet|of|hij|thuis is','SVRRSR','Я не знаю, чи він удома.','I do not know whether he is at home.','Je ne sais pas s’il est à la maison.','لا أعرف إن كان في البيت.','dat','.'],
   ['a2gram',1,'ik|woon|in Gent','SVR','Я живу в Генті.','I live in Ghent.','J’habite à Gand.','أسكن في خنت.','naar','.'],
   ['a2gram',1,'ik|ga|naar Gent','SVR','Я їду до Гента.','I am going to Ghent.','Je vais à Gand.','أذهب إلى خنت.','in','.'],
   ['a2gram',1,'hij|komt|uit Polen','SVR','Він родом із Польщі.','He comes from Poland.','Il vient de Pologne.','هو من بولندا.','in','.'],
   ['a2gram',1,'dat|is|een groot huis','SVR','Це великий будинок.','That is a big house.','C’est une grande maison.','هذا منزل كبير.','grote','.'],
   ['a2gram',1,'ik|heb|vandaag|gegeten','SVTV','Я сьогодні їв.','I have eaten today.','J’ai mangé aujourd’hui.','أكلت اليوم.','at','.'],
   ['a2gram',2,'gisteren|kookte|ik|soep','TVSR','Учора я варив суп.','Yesterday I cooked soup.','Hier, j’ai fait cuire une soupe.','أمس طبخت حساءً.','kook','.'],
   ['a2gram',2,'toen ik klein was|woonde|ik|in Oekraïne','TVSR','Коли я був малим, жив в Україні.','When I was small, I lived in Ukraine.','Quand j’étais petit, j’habitais en Ukraine.','عندما كنت صغيراً كنت أسكن في أوكرانيا.','woon','.'],
   ['a2gram',2,'hier|worden|fietsen|gerepareerd','TVSR','Тут ремонтують велосипеди.','Bicycles are repaired here.','Ici, on répare des vélos.','تُصلَّح الدراجات هنا.','wordt','.'],
   ['a2gram',2,'het boek|dat|ik|lees|is spannend','SRSVR','Книжка, яку я читаю, цікава.','The book that I am reading is exciting.','Le livre que je lis est passionnant.','الكتاب الذي أقرؤه مشوّق.','die','.'],
   ['a2gram',2,'wie|woont|er|in dit huis','QVRR','Хто живе в цьому будинку?','Who lives in this house?','Qui habite dans cette maison ?','من يسكن في هذا البيت؟','wonen','?'],
   ['a2gram',2,'als het regent|neem|ik|de bus','TVSR','Якщо йде дощ, я їду автобусом.','If it rains, I take the bus.','S’il pleut, je prends le bus.','إذا أمطرت أركب الحافلة.','nam','.'],
   ['a2gram',2,'ik|weet|niet|wanneer|de trein|vertrekt','SVRRSV','Я не знаю, коли відходить потяг.','I do not know when the train leaves.','Je ne sais pas quand le train part.','لا أعرف متى يغادر القطار.','als','.'],
   ['a2gram',2,'zij|blijft|thuis|omdat|de kinderen|ziek zijn','SVRRSR','Вона лишається вдома, бо діти хворі.','She stays at home because the children are ill.','Elle reste à la maison parce que les enfants sont malades.','تبقى في البيت لأن الأطفال مرضى.','want','.'],
   ['a2gram',2,'ik|hoop|dat|je|snel|beter wordt','SVRSTR','Сподіваюся, ти швидко одужаєш.','I hope that you get better soon.','J’espère que tu iras vite mieux.','آمل أن تتحسن قريباً.','word','.'],
   ['a2gram',2,'ik|denk|vaak|aan mijn familie','SVTR','Я часто думаю про свою родину.','I often think of my family.','Je pense souvent à ma famille.','أفكر كثيراً في عائلتي.','op','.'],
   ['a2gram',2,'zij|draagt|een rode jas','SVR','Вона носить червоне пальто.','She is wearing a red coat.','Elle porte un manteau rouge.','ترتدي معطفاً أحمر.','rood','.'],
   ['a2gram',2,'vroeger|woonde|ik|in Kyiv','TVSR','Раніше я жив у Києві.','I used to live in Kyiv.','Avant, j’habitais à Kyiv.','كنت أسكن سابقاً في كييف.','woon','.'],
   ['a2gram',2,'gisteren|ben|ik|naar de markt|gegaan','TVSRV','Учора я ходив на ринок.','Yesterday I went to the market.','Hier, je suis allé au marché.','ذهبت أمس إلى السوق.','heb','.']
  ],
  dialogues: [
   ['a2gram','📘','Розмова про минуле','Talking about the past','Parler du passé','الحديث عن الماضي',[
    ['Waar woonde je vroeger?','Де ти жив раніше?','Where did you live before?'],
    ['Ik woonde in Kyiv. Daar werkte ik tien jaar in een studio.','Я жив у Києві. Там я десять років працював у студії.','I lived in Kyiv. I worked in a studio there for ten years.'],
    ['En wanneer ben je naar België gekomen?','А коли ти приїхав до Бельгії?','And when did you come to Belgium?'],
    ['Toen de oorlog begon, ben ik met mijn gezin vertrokken.','Коли почалася війна, я виїхав із родиною.','When the war began, I left with my family.'],
    ['Wat doe je hier nu?','Що ти робиш тут зараз?','What do you do here now?'],
    ['Ik leer Nederlands, want ik wil hier werken.','Я вчу нідерландську, бо хочу тут працювати.','I am learning Dutch because I want to work here.']]],
   ['a2d_dokter','🩺','У лікаря','At the doctor’s','Chez le médecin','عند الطبيب',[
    ['Goedemorgen dokter.','Доброго ранку, докторе.','Good morning, doctor.'],
    ['Goedemorgen, wat is er precies aan de hand?','Доброго ранку, що саме трапилося?','Good morning, what exactly is the matter?'],
    ['Ik heb last van mijn keel en ik hoest.','У мене болить горло, і я кашляю.','I have a sore throat and I am coughing.'],
    ['Sinds wanneer?','Відколи?','Since when?'],
    ['Sinds eergisteren.','Із позавчора.','Since the day before yesterday.'],
    ['Hebt u koorts gehad?','У вас була температура?','Have you had a fever?'],
    ['Nee, geen koorts. Alleen keelpijn.','Ні, без температури. Лише біль у горлі.','No, no fever. Only a sore throat.'],
    ['Oké, ik luister even naar uw longen.','Добре, я послухаю ваші легені.','Okay, I will listen to your lungs for a moment.']]],
   ['a2d_kleding','👕','У магазині одягу','In a clothes shop','Dans un magasin de vêtements','في متجر الملابس',[
    ['Goedemiddag, kan ik u helpen?','Добрий день, чим можу допомогти?','Good afternoon, can I help you?'],
    ['Goedemiddag. Ik zoek een warme trui.','Добрий день. Я шукаю теплий светр.','Good afternoon. I am looking for a warm sweater.'],
    ['Welke maat hebt u?','Який у вас розмір?','Which size are you?'],
    ['Medium, denk ik.','Medium, думаю.','Medium, I think.'],
    ['Mag ik deze even passen?','Можна це приміряти?','May I try this one on?'],
    ['Natuurlijk, de paskamers zijn daar.','Звісно, примірочні там.','Of course, the fitting rooms are over there.'],
    ['Deze is te groot. Hebt u een kleinere?','Цей завеликий. У вас є менший?','This one is too big. Do you have a smaller one?'],
    ['Ja, hier is small.','Так, ось small.','Yes, here is a small.']]],
   ['a2d_station','🚆','На вокзалі','At the station','À la gare','في محطة القطار',[
    ['Goedemiddag.','Добрий день.','Good afternoon.'],
    ['Goedemiddag. Mijn trein heeft vertraging.','Добрий день. Мій потяг запізнюється.','Good afternoon. My train is delayed.'],
    ['Waar moet u naartoe?','Куди вам потрібно їхати?','Where do you need to go?'],
    ['Naar Gent.','До Гента.','To Ghent.'],
    ['Hoe lang is de vertraging?','Скільки триває затримка?','How long is the delay?'],
    ['Ongeveer vijftien minuten.','Приблизно п’ятнадцять хвилин.','About fifteen minutes.'],
    ['Kan ik een andere trein nemen?','Чи можу я поїхати іншим потягом?','Can I take another train?'],
    ['Op dit moment niet, sorry.','Наразі ні, вибачте.','Not at the moment, sorry.']]],
   ['a2d_apotheek','💊','В аптеці','At the pharmacy','À la pharmacie','في الصيدلية',[
    ['Goedemiddag, waarmee kan ik u helpen?','Добрий день, чим можу допомогти?','Good afternoon, how can I help you?'],
    ['Ik zoek iets tegen hoofdpijn.','Я шукаю щось від головного болю.','I am looking for something for a headache.'],
    ['Hebt u al iets genomen?','Ви вже щось приймали?','Have you already taken something?'],
    ['Ja, paracetamol, maar het helpt niet genoeg.','Так, парацетамол, але він не допомагає достатньо.','Yes, paracetamol, but it does not help enough.'],
    ['Sinds wanneer hebt u last?','Відколи у вас болить?','Since when have you had trouble?'],
    ['Sinds vanmorgen.','Із сьогоднішнього ранку.','Since this morning.'],
    ['Ik geef u ibuprofen.','Я дам вам ібупрофен.','I will give you ibuprofen.'],
    ['Neem er maximaal drie per dag.','Приймайте максимум три на день.','Take a maximum of three a day.']]],
   ['a2d_cafe','☕','У кафе','At the café','Au café','في المقهى',[
    ['Goedemorgen, wat mag het zijn?','Доброго ранку, що будете?','Good morning, what can I get you?'],
    ['Een koffie met melk en een croissant.','Каву з молоком і круасан.','A coffee with milk and a croissant.'],
    ['Wilt u de croissant warm?','Хочете круасан теплим?','Would you like the croissant warm?'],
    ['Ja, graag.','Так, будь ласка.','Yes, please.'],
    ['Mag ik er een glas water bij?','Можна до цього склянку води?','May I have a glass of water with it?'],
    ['Natuurlijk.','Звісно.','Of course.'],
    ['Dat is dan 5,90 euro.','Це буде 5,90 євро.','That will be 5.90 euros.'],
    ['Dank u wel.','Дякую.','Thank you.']]],
   ['a2d_buur','🏘️','Розмова із сусідом','Talking to a neighbour','Discussion avec un voisin','حديث مع الجار',[
    ['Hé, alles goed?','Привіт, усе добре?','Hey, all good?'],
    ['Ja, prima. En met jou?','Так, чудово. А в тебе?','Yes, fine. And you?'],
    ['Goed. Woon je hier al lang?','Добре. Ти тут давно живеш?','Good. Have you lived here long?'],
    ['Nee, pas sinds vorige maand.','Ні, лише з минулого місяця.','No, only since last month.'],
    ['Welkom in de buurt!','Ласкаво просимо в наш район!','Welcome to the neighbourhood!'],
    ['Dank je.','Дякую.','Thank you.'],
    ['Als je iets nodig hebt, mag je altijd aankloppen.','Якщо щось потрібно, завжди можеш постукати.','If you need anything, you can always knock.'],
    ['Dat is heel vriendelijk, bedankt.','Це дуже люб’язно, дякую.','That is very kind, thank you.']]],
   ['a2d_afspraak','📞','Запис на прийом по телефону','Booking an appointment by phone','Prendre rendez-vous par téléphone','حجز موعد بالهاتف',[
    ['Goedemiddag, huisartsenpraktijk.','Добрий день, кабінет сімейного лікаря.','Good afternoon, GP practice.'],
    ['Goedemiddag. Ik wil graag een afspraak maken.','Добрий день. Я хочу записатися на прийом.','Good afternoon. I would like to make an appointment.'],
    ['Wat is de reden?','Яка причина?','What is the reason?'],
    ['Ik heb last van mijn rug.','У мене болить спина.','I have back pain.'],
    ['Wanneer past het u?','Коли вам зручно?','When suits you?'],
    ['Bij voorkeur morgen of overmorgen.','Бажано завтра або післязавтра.','Preferably tomorrow or the day after.'],
    ['Morgen om 10.15 uur is nog vrij.','Завтра о 10:15 ще вільно.','Tomorrow at 10.15 is still free.'],
    ['Perfect, dat is goed.','Чудово, це підходить.','Perfect, that is fine.']]],
   ['a2d_super','🛒','У супермаркеті: де знайти?','In the supermarket: where to find it?','Au supermarché : où trouver ?','في السوبرماركت: أين أجد؟',[
    ['Pardon, kunt u mij helpen?','Перепрошую, можете мені допомогти?','Excuse me, can you help me?'],
    ['Natuurlijk.','Звісно.','Of course.'],
    ['Ik zoek de havermout.','Я шукаю вівсянку.','I am looking for the oatmeal.'],
    ['Die staat in gang vier, bovenaan.','Вона в проході чотири, нагорі.','That is in aisle four, at the top.'],
    ['En waar vind ik de yoghurt zonder suiker?','А де я знайду йогурт без цукру?','And where do I find the yoghurt without sugar?'],
    ['Bij de zuivel, links.','Біля молочних продуктів, ліворуч.','By the dairy, on the left.'],
    ['Dank u wel.','Дякую.','Thank you.'],
    ['Graag gedaan.','Будь ласка.','You’re welcome.']]]
  ],
  speech: [
   ['Waar woonde je vroeger?','Де ти жив раніше?','Where did you live before?','Vroeger woonde ik in Kyiv.'],
   ['Wat deed je gisteren?','Що ти робив учора?','What did you do yesterday?','Gisteren ben ik naar de markt gegaan.'],
   ['Wanneer ben je naar België gekomen?','Коли ти приїхав до Бельгії?','When did you come to Belgium?','Ik ben vorig jaar naar België gekomen.'],
   ['Wat doe je als het regent?','Що ти робиш, коли йде дощ?','What do you do when it rains?','Als het regent, neem ik de bus.'],
   ['Wie is jouw buurman?','Хто твій сусід?','Who is your neighbour?','Mijn buurman is een man die heel vriendelijk is.'],
   ['Wat denk je van het weer morgen?','Що ти думаєш про погоду завтра?','What do you think of tomorrow’s weather?','Ik denk dat het morgen regent.']
  ]
 };
 for(const part of [a2p1,a2p2,a2p3]){
  a2.chapters.push(...part.chapters);
  Object.assign(a2.labels,part.labels);
  Object.assign(a2.lessons,part.lessons);
  Object.assign(a2.notes,part.notes);
  Object.assign(a2.gaps,part.gaps);
  a2.bank.push(...part.bank);
  a2.dialogues.push(...part.dialogues);
  a2.speech.push(...part.speech);
 }
 // ---- A2 grammar check: 25 four-option cards (sentence with a gap, one correct answer, explanation in four languages) ----
 const a2plus = [
  ['Ik ___ gisteren naar de bioscoop gegaan.','ben','heb','is','zijn',['З дієсловами руху й зміни місця perfectum утворюється з «zijn»: ik ben gegaan.','With verbs of movement and change of place the perfect uses “zijn”: ik ben gegaan.','Avec les verbes de mouvement et de changement de lieu, le perfectum se forme avec « zijn » : ik ben gegaan.','مع أفعال الحركة وتغيّر المكان يُصاغ الماضي التام بـ zijn: ik ben gegaan.']],
  ['Hij is groter ___ zijn broer.','dan','als','van','met',['У порівнянні після вищого ступеня завжди «dan».','After a comparative you always use “dan”.','Après un comparatif, on utilise toujours « dan ».','بعد صيغة المقارنة نستعمل دائماً dan.']],
  ['Ik woon hier ___ 2023.','sinds','al','voor','vanaf',['«Sinds» стоїть із точкою в часі (sinds 2023). З періодом — «al»: al drie jaar.','“Sinds” goes with a point in time (sinds 2023). With a period use “al”: al drie jaar.','« Sinds » va avec un moment précis (sinds 2023). Avec une durée, on dit « al » : al drie jaar.','sinds مع نقطة زمنية (sinds 2023). ومع المدة نستعمل al: al drie jaar.']],
  ['Er ___ veel mensen in de winkel.','zijn','is','heeft','hebben',['«Er is» — однина, «er zijn» — множина.','“Er is” is singular, “er zijn” is plural.','« Er is » au singulier, « er zijn » au pluriel.','er is للمفرد وer zijn للجمع.']],
  ['Ik ga naar de dokter ___ me te laten controleren.','om','voor','van','met',['Мету дії виражає конструкція «om … te».','Purpose is expressed with “om … te”.','Le but s’exprime avec « om … te ».','الغرض يُعبَّر عنه بـ om … te.']],
  ['Zij ___ de hele dag gewerkt.','heeft','is','wordt','hebben',['Більшість дієслів у perfectum утворюються з «hebben»: zij heeft gewerkt.','Most verbs form the perfect with “hebben”: zij heeft gewerkt.','La plupart des verbes forment le perfectum avec « hebben » : zij heeft gewerkt.','معظم الأفعال تكوّن الماضي التام بـ hebben: zij heeft gewerkt.']],
  ['De film was interessanter ___ ik dacht.','dan','als','dat','zoals',['Після вищого ступеня — «dan», також перед підрядною частиною.','After a comparative use “dan”, also before a subordinate clause.','Après un comparatif, « dan », même devant une subordonnée.','بعد المقارنة نستعمل dan حتى قبل جملة فرعية.']],
  ['Ik ___ mijn sleutels thuis laten liggen.','heb','ben','is','zijn',['«Laten» утворює perfectum з «hebben»: ik heb laten liggen.','“Laten” forms the perfect with “hebben”: ik heb laten liggen.','« Laten » forme le perfectum avec « hebben » : ik heb laten liggen.','laten تكوّن الماضي التام بـ hebben: ik heb laten liggen.']],
  ['Wij hebben honger, ___ wij gaan eten.','dus','omdat','want','hoewel',['«Dus» означає «тому, отже» і не змінює порядок слів.','“Dus” means “so, therefore” and does not change the word order.','« Dus » signifie « donc » et ne change pas l’ordre des mots.','dus تعني «لذلك» ولا تغيّر ترتيب الكلمات.']],
  ['Ik kan niet komen, ___ ik moet werken.','want','dus','omdat','daarom',['«Want» з’єднує дві самостійні частини й не змінює порядок слів (ik moet werken). З «omdat» дієслово пішло б в кінець.','“Want” joins two main clauses and keeps the word order (ik moet werken). With “omdat” the verb would go to the end.','« Want » relie deux principales et garde l’ordre (ik moet werken). Avec « omdat », le verbe irait à la fin.','want تربط جملتين رئيسيتين وتحافظ على الترتيب (ik moet werken). مع omdat يذهب الفعل إلى النهاية.']],
  ['___ veel auto’s op straat.','Er zijn','Er is','Er heeft','Er hebben',['Множина → «er zijn».','Plural → “er zijn”.','Pluriel → « er zijn ».','الجمع → er zijn.']],
  ['Hij praat ___ hard.','te','te veel','teveel','te erg',['«Te» + прикметник/прислівник = «занадто»: te hard.','“Te” + adjective/adverb = “too”: te hard.','« Te » + adjectif/adverbe = « trop » : te hard.','te + صفة/ظرف = «أكثر من اللازم»: te hard.']],
  ['Ik ___ gisteren pizza gegeten.','heb','ben','is','zijn',['«Eten» утворює perfectum з «hebben»: ik heb gegeten.','“Eten” forms the perfect with “hebben”: ik heb gegeten.','« Eten » forme le perfectum avec « hebben » : ik heb gegeten.','eten تكوّن الماضي التام بـ hebben: ik heb gegeten.']],
  ['Zij is naar huis gegaan ___ zij ziek was.','omdat','want','dus','maar',['«Omdat» відкриває підрядну частину, дієслово йде в кінець: …omdat zij ziek was.','“Omdat” opens a subordinate clause, so the verb goes to the end: …omdat zij ziek was.','« Omdat » ouvre une subordonnée : le verbe va à la fin : …omdat zij ziek was.','omdat تبدأ جملة فرعية فيذهب الفعل إلى النهاية: …omdat zij ziek was.']],
  ['Ik moet nog boodschappen ___.','doen','te doen','gedaan','doende',['Після модальних дієслів (moeten, kunnen, willen) — інфінітив без «te».','After modal verbs (moeten, kunnen, willen) use the infinitive without “te”.','Après les verbes modaux (moeten, kunnen, willen) : infinitif sans « te ».','بعد الأفعال المساعدة (moeten وkunnen وwillen) نستعمل المصدر بدون te.']],
  ['De winkel is open van negen ___ zes uur.','tot','naar','voor','bij',['«Van … tot …» = «від … до …».','“Van … tot …” = “from … to …”.','« Van … tot … » = « de … à … ».','van … tot … = «من … إلى …».']],
  ['Ik voel me niet goed. Ik denk dat ik ___ heb.','koorts','een koorts','de koorts','koortsen',['«Koorts hebben» — без артикля.','“Koorts hebben” is used without an article.','« Koorts hebben » s’emploie sans article.','تُقال koorts hebben بدون أداة تعريف.']],
  ['Hij heeft hard gewerkt, ___ is hij moe.','daarom','omdat','want','maar',['«Daarom» = «тому», стоїть на початку другої частини, і далі йде дієслово: daarom is hij moe.','“Daarom” = “that is why”; it starts the second part and the verb follows: daarom is hij moe.','« Daarom » = « c’est pourquoi » ; il ouvre la seconde partie, le verbe suit : daarom is hij moe.','daarom = «لهذا»؛ تبدأ الجزء الثاني ويليها الفعل: daarom is hij moe.']],
  ['Ik ga sporten ___ fitter te worden.','om','voor','van','met',['Мета — «om … te + інфінітив».','Purpose: “om … te + infinitive”.','But : « om … te + infinitif ».','الغرض: om … te + المصدر.']],
  ['Er ___ een auto voor de deur.','is','zijn','heeft','staan',['Однина → «er is» (також «er staat»).','Singular → “er is” (also “er staat”).','Singulier → « er is » (aussi « er staat »).','المفرد → er is (وأيضاً er staat).']],
  ['Zij ___ gisteren op tijd aangekomen.','is','heeft','wordt','hebben',['«Aankomen» — рух до місця, тому perfectum із «zijn»: zij is aangekomen.','“Aankomen” expresses arrival, so the perfect uses “zijn”: zij is aangekomen.','« Aankomen » exprime l’arrivée, donc perfectum avec « zijn » : zij is aangekomen.','aankomen تعبّر عن الوصول، لذا نستعمل zijn: zij is aangekomen.']],
  ['Mijn zus is ___ oud als ik.','even','meer','dan','groter',['«Even + прикметник + als» = «такий самий … як».','“Even + adjective + als” = “as … as”.','« Even + adjectif + als » = « aussi … que ».','even + صفة + als = «بنفس … مثل».']],
  ['We hebben gisteren ___ de film gekeken.','naar','op','aan','voor',['«Kijken naar» = «дивитися на/дивитися (фільм)».','“Kijken naar” = “to watch / look at”.','« Kijken naar » = « regarder ».','kijken naar = «يشاهد / ينظر إلى».']],
  ['Ik blijf thuis ___ ik ziek ben.','omdat','want','dus','daarom',['«Omdat» + підмет + … + дієслово в кінці: …omdat ik ziek ben.','“Omdat” + subject + … + verb at the end: …omdat ik ziek ben.','« Omdat » + sujet + … + verbe à la fin : …omdat ik ziek ben.','omdat + الفاعل + … + الفعل في النهاية: …omdat ik ziek ben.']],
  ['Hij ___ de brief al geschreven.','heeft','is','wordt','hebben',['«Schrijven» утворює perfectum з «hebben»: hij heeft geschreven.','“Schrijven” forms the perfect with “hebben”: hij heeft geschreven.','« Schrijven » forme le perfectum avec « hebben » : hij heeft geschreven.','schrijven تكوّن الماضي التام بـ hebben: hij heeft geschreven.']]
 ];
 const a2Ids=new Set(a2.chapters.map(c=>c[0]));
 advanced.push(...a2.chapters.map(([id,title,tabs])=>[id,title,[...tabs]]));
 Object.assign(topicLabels,a2.labels);
 function apply({DATA,CATEGORIES,UI,R,LEVELS}) {
  const grammar = {...CATEGORIES.find(c=>c.id==='grammar')}; // Includes the untouched diphthongs lesson.
  grammar.tabs=grammar.tabs.filter(t=>t!=='adjectives');
  CATEGORIES.splice(0,CATEGORIES.length,
   ...chapters.map(([id,title,tabs],i)=>({id,lvl:'a11',chapter:i+1,tabs})),grammar,
   ...advanced.map(([id,title,tabs])=>({id,lvl:a2Ids.has(id)?'a21':'a12',tabs})));
  LEVELS[0].name='A1.1'; LEVELS[1].name='A1.2'; LEVELS[2].name='A2'; delete LEVELS[2].soon;
  for(const lang of Object.keys(UI)){
   UI[lang].tagline='A1 · A1.1 / A1.2';
   UI[lang].toetsTitle=UI[lang].modes.toets='Toets';
  }
  for(const c of CATEGORIES)for(const lang of Object.keys(UI))UI[lang].cats[c.id]=topicInfo(c.id,lang).title;
  for(const [key,[uk,en,fr,ar,text]] of Object.entries(lessons)) {
   DATA[key]=R(text.trim().split('\n').map((line,i)=>{
    const [nl,uk,en,fr,ar]=line.split('|');
    return [`course_${key}_${i+1}`,nl,en,fr,uk,ar,lessonIcons[key]?.split(' ')[i]||'📖'];
   }));
   for(const [lang,label] of Object.entries({uk,en,fr,ar}))UI[lang].tabs[key]=UI[lang].subs[key]=label;
  }
  for(const [key,[uk,en,fr,ar,text]] of Object.entries({...a12.lessons,...a2.lessons})) {
   DATA[key]=R(text.trim().split('\n').map((line,i)=>{
    const [nl,uk,en,fr,ar,icon,exNl,exUk]=line.split('|');
    return [`course_${key}_${i+1}`,nl,en,fr,uk,ar,icon||'📖',exNl||'',exUk||''];
   }));
   const note=a12.notes[key]||a2.notes[key];
   for(const [i,[lang,label]] of Object.entries(Object.entries({uk,en,fr,ar}))){UI[lang].tabs[key]=label;UI[lang].subs[key]=note?.[i]||label;}
  }
  // Ordinals are explicit practice, not just mentioned in the chapter heading.
  const ordinals=[['eerste','перший','first','premier','الأول'],['tweede','другий','second','deuxième','الثاني'],['derde','третій','third','troisième','الثالث'],['vierde','четвертий','fourth','quatrième','الرابع'],['vijfde','п’ятий','fifth','cinquième','الخامس'],['zesde','шостий','sixth','sixième','السادس'],['zevende','сьомий','seventh','septième','السابع'],['achtste','восьмий','eighth','huitième','الثامن'],['negende','дев’ятий','ninth','neuvième','التاسع'],['tiende','десятий','tenth','dixième','العاشر'],['elfde','одинадцятий','eleventh','onzième','الحادي عشر'],['twaalfde','дванадцятий','twelfth','douzième','الثاني عشر']];
  DATA.birthday.items.push(...R(ordinals.map(([nl,uk,en,fr,ar],i)=>[`course_ordinal_${i+1}`,nl,en,fr,uk,ar,'📅'])).items);
  for(const [tab,text] of Object.entries(practice))
   DATA[tab].items.push(...R(text.trim().split('\n').map((line,i)=>{
    const [nl,uk,en,fr,ar,icon]=line.split('|');
    return [`course_pt_${tab}_${i+1}`,nl,en,fr,uk,ar,icon||'📖'];
   })).items);
  // body-part sentences get the body-map pictures (a flexed biceps is not a shoulder)
  if(typeof KT_IMG!=='undefined'){const P={1:'neus',2:'neus',3:'hand',4:'been',5:'schouder',6:'voet'};for(const it of DATA.klachten.items){const m=/^course_pt_klachten_(\d)$/.exec(it.id);if(m&&P[m[1]]&&KT_IMG[P[m[1]]])it.icon=KT_IMG[P[m[1]]]}}
  // Move individual cards where an older collection spans several chapters.
  const move=(from,to,ids)=>{const selected=new Set(ids);DATA[to].items.push(...DATA[from].items.filter(x=>selected.has(x.id)));DATA[from].items=DATA[from].items.filter(x=>!selected.has(x.id));};
  move('mail','birthday',['b_proficiat']);move('mail','invitation',['b_spijt']);
  move('mail','messages',['b_bijlage','b_geachte','b_mvg','b_afzender','b_onderwerp']);
  move('telefoon','instructions',['b_ziek','b_bericht']);
  // This past-tense example belongs to 1.2, while negation itself belongs to 1.1.
  const nothing=DATA.niet.items.find(x=>x.id==='b_niets');
  if(nothing){nothing.ex_nl='Ik hoor niets.';nothing.ex_uk='Я нічого не чую.';}
 }
 function buildBank(bank) {
  const original=Object.entries(bank);for(const key of Object.keys(bank))delete bank[key];
  const add=(cat,row)=>(bank[cat]??=[]).push(row);
  for(const [cat,rows] of original)for(const row of rows){
   const text=row[1];let dest=cat;
   if(cat==='home')dest=/eet|drink|koffie|brood|melk|kaas|restaurant|kook/.test(text)?'food':/kost|betaal|koop/.test(text)?'nums':'people';
   if(cat==='city')dest=/les|school|gemeente|werk|formulier/.test(text)?'forms':'travelTime';
   if(cat==='nums')dest=/verjaar|jaar|maand|geboren/.test(text)?'birthday':/uur|laat|tijd/.test(text)?'travelTime':'nums';
   if(cat==='people'&&/pijn|dokter|ziek|koorts|voel|lichaam/.test(text))dest='health';
   if(cat==='comm'&&/graag|elke|weekend/.test(text))dest='dag';
   if(cat==='contact')dest=/gekregen/.test(text)?'contact':'forms';
   if(cat==='grammar2')dest=/geen|niet/.test(text)?'dag':/jouw|mijn|hun/.test(text)?'people':'grammar2';
   add(dest,row);
  }
  const rows=[
   ['grammar2','welke jas|is|goedkoper','QVR','Яка куртка дешевша?','Which coat is cheaper?','Quelle veste est moins chère ?','أي سترة أرخص؟'],
   ['opening','wanneer|begint|de les','QVS','Коли починається заняття?','When does the lesson start?','Quand commence le cours ?','متى يبدأ الدرس؟'],
   ['birthday','wanneer|verjaar|jij','QVS','Коли в тебе день народження?','When is your birthday?','Quand est ton anniversaire ?','متى عيد ميلادك؟'],
   ['health','waar|heb|je|pijn','QVSR','Де в тебе болить?','Where does it hurt?','Où as-tu mal ?','أين تشعر بالألم؟'],
   ['food','wat|eet|je|elke dag','QVSR','Що ти їси щодня?','What do you eat every day?','Que manges-tu chaque jour ?','ماذا تأكل كل يوم؟'],
   ['shopping','wat|hebben|we|nodig','QVSR','Що нам потрібно?','What do we need?','De quoi avons-nous besoin ?','ماذا نحتاج؟'],
   ['holiday','waar|hebben|jullie|gelogeerd','QVSR','Де ви зупинялися?','Where did you stay?','Où avez-vous logé ?','أين أقمتم؟'],
   ['travel','waar|moet|ik|overstappen','QVSR','Де мені пересідати?','Where do I need to change?','Où dois-je changer ?','أين يجب أن أبدل؟'],
   ['service','kan|ik|deze jas|omruilen','VSRR','Можна обміняти цю куртку?','Can I exchange this coat?','Puis-je échanger cette veste ?','هل يمكنني استبدال هذه السترة؟'],
   ['reading','waar|kan|ik|me|inschrijven','QVSRR','Де я можу зареєструватися?','Where can I register?','Où puis-je m’inscrire ?','أين يمكنني التسجيل؟'],
   ['contact','hebt|u|mijn bericht|ontvangen','VSRR','Ви отримали моє повідомлення?','Have you received my message?','Avez-vous reçu mon message ?','هل استلمتم رسالتي؟']
  ];
  for(const [cat,q,roles,uk,en,fr,ar] of rows)add(cat,[1,q,roles,uk,en,fr,ar]);
  // Practice test of 27 Oct 2026: word order in statements. T = time/place first, I = infinitive or particle at the end.
  // Row: cat, level, tiles, roles, uk, en, fr, ar, extra decoy tile.
  const statements=[
   ['food',1,'je|moet|meer fruit|eten','SVRI','Тобі треба їсти більше фруктів.','You should eat more fruit.','Tu dois manger plus de fruits.','يجب أن تأكل المزيد من الفاكهة.','minder'],
   ['food',1,'je|moet|minder chips|eten','SVRI','Тобі треба їсти менше чіпсів.','You should eat fewer crisps.','Tu dois manger moins de chips.','يجب أن تأكل شيبس أقل.','meer'],
   ['food',1,'je|moet|meer vis|eten','SVRI','Тобі треба їсти більше риби.','You should eat more fish.','Tu dois manger plus de poisson.','يجب أن تأكل المزيد من السمك.','minder'],
   ['food',1,'je|moet|meer groenten|eten','SVRI','Тобі треба їсти більше овочів.','You should eat more vegetables.','Tu dois manger plus de légumes.','يجب أن تأكل المزيد من الخضار.','minder'],
   ['food',1,'je|moet|minder cola|drinken','SVRI','Тобі треба пити менше коли.','You should drink less cola.','Tu dois boire moins de cola.','يجب أن تشرب كولا أقل.','eten'],
   ['food',2,'je|moet|minder koffie|drinken','SVRI','Тобі треба пити менше кави.','You should drink less coffee.','Tu dois boire moins de café.','يجب أن تشرب قهوة أقل.','meer'],
   ['food',2,'je|moet|minder snoepjes|eten','SVRI','Тобі треба їсти менше солодощів.','You should eat fewer sweets.','Tu dois manger moins de bonbons.','يجب أن تأكل حلويات أقل.','meer'],
   ['food',2,'je|moet|minder hamburgers|eten','SVRI','Тобі треба їсти менше гамбургерів.','You should eat fewer hamburgers.','Tu dois manger moins de hamburgers.','يجب أن تأكل برغر أقل.','drinken'],
   ['food',2,'ik|eet|nooit|vis','SVRR','Я ніколи не їм рибу.','I never eat fish.','Je ne mange jamais de poisson.','لا آكل السمك أبداً.','geen'],
   ['food',2,'ik|drink|meestal|cola|bij het eten','SVRRR','Я зазвичай п’ю колу під час їжі.','I usually drink cola with my meal.','Je bois généralement du cola pendant le repas.','أشرب الكولا عادة مع الطعام.',''],
   ['food',2,'ik|eet|\'s middags|altijd|een zak snoepjes','SVRRR','Удень я завжди з’їдаю пакет цукерок.','In the afternoon I always eat a bag of sweets.','L’après-midi, je mange toujours un sachet de bonbons.','بعد الظهر آكل دائماً كيس حلويات.',''],
   ['dag',1,'om zeven uur|sta|ik|op','TVSI','О сьомій годині я встаю.','At seven o’clock I get up.','À sept heures, je me lève.','في الساعة السابعة أستيقظ.','ben'],
   ['dag',1,'om 07:00 u|neem|ik|een douche','TVSR','О 07:00 я приймаю душ.','At 7:00 I take a shower.','À 7 h, je prends une douche.','في الساعة 07:00 آخذ دشاً.',''],
   ['dag',1,'om 08:15|ontbijt|ik','TVS','О 08:15 я снідаю.','At 8:15 I have breakfast.','À 8 h 15, je prends mon petit-déjeuner.','في الساعة 08:15 أتناول الفطور.',''],
   ['dag',1,'\'s morgens|breng|ik|de kinderen|naar school','TVSRR','Вранці я відвожу дітей до школи.','In the morning I take the children to school.','Le matin, j’emmène les enfants à l’école.','في الصباح أوصل الأطفال إلى المدرسة.',''],
   ['dag',1,'\'s avonds|kook|ik','TVS','Ввечері я готую.','In the evening I cook.','Le soir, je cuisine.','في المساء أطبخ.',''],
   ['dag',2,'na de maaltijd|kijk|ik|naar de tv','TVSR','Після їжі я дивлюся телевізор.','After the meal I watch TV.','Après le repas, je regarde la télé.','بعد الوجبة أشاهد التلفاز.',''],
   ['dag',2,'\'s avonds|luister|ik|naar muziek','TVSR','Ввечері я слухаю музику.','In the evening I listen to music.','Le soir, j’écoute de la musique.','في المساء أستمع إلى الموسيقى.',''],
   ['dag',2,'om 18:00 u|eet|ik|een warme maaltijd','TVSR','О 18:00 я їм теплу страву.','At 18:00 I eat a hot meal.','À 18 h, je mange un repas chaud.','في الساعة 18:00 آكل وجبة ساخنة.',''],
   ['dag',2,'ik|ga|naar de supermarkt|en|ik|doe|boodschappen','SVRRSVR','Я йду в супермаркет і роблю покупки.','I go to the supermarket and I do the shopping.','Je vais au supermarché et je fais les courses.','أذهب إلى السوبرماركت وأتسوق.',''],
   ['health',1,'ik|heb|pijn|aan mijn neus','SVRR','У мене болить ніс.','My nose hurts.','J’ai mal au nez.','أشعر بألم في أنفي.','neuspijn'],
   ['health',1,'hij|heeft|pijn|aan zijn vinger','SVRR','У нього болить палець.','His finger hurts.','Il a mal au doigt.','إصبعه يؤلمه.',''],
   ['health',1,'wat|scheelt|er','QVS','Що трапилося?','What’s wrong?','Qu’est-ce qui ne va pas ?','ما المشكلة؟',''],
   ['health',2,'je|moet|de siroop|3 keer per dag|nemen','SVRRI','Тобі треба пити сироп 3 рази на день.','You must take the syrup 3 times a day.','Tu dois prendre le sirop 3 fois par jour.','يجب أن تتناول الشراب 3 مرات في اليوم.','tijd'],
   ['health',2,'een volwassene|neemt|2 tabletten','SVR','Дорослий приймає 2 таблетки.','An adult takes 2 tablets.','Un adulte prend 2 comprimés.','يتناول البالغ قرصين.','kind'],
   ['plans',1,'ik|moet|boodschappen|doen','SVRI','Я мушу робити покупки.','I have to do the shopping.','Je dois faire les courses.','يجب أن أتسوق.',''],
   ['plans',1,'het spijt me,|ik|kan|niet|komen','RSVRI','Мені шкода, я не можу прийти.','I’m sorry, I can’t come.','Je suis désolé, je ne peux pas venir.','آسف، لا أستطيع الحضور.',''],
   ['plans',2,'nee, het spijt me,|ik|heb|geen tijd','RSVR','Ні, мені шкода, я не маю часу.','No, I’m sorry, I have no time.','Non, désolé, je n’ai pas le temps.','لا، آسف، ليس لدي وقت.','zin'],
   ['plans',2,'nee, het spijt me,|ik|moet|koken','RSVI','Ні, мені шкода, я маю готувати.','No, I’m sorry, I have to cook.','Non, désolé, je dois cuisiner.','لا، آسف، يجب أن أطبخ.','poetsen']
  ];
  for(const [cat,level,q,roles,uk,en,fr,ar,x] of statements)add(cat,[level,q,roles,uk,en,fr,ar,x||'','.']);
  for(const [cat,level,q,roles,uk,en,fr,ar,x,p] of [...a12.bank,...a2.bank])add(cat,[level,q,roles,uk,en,fr,ar,x,p]);
 }
 const gaps={
  comm:['Hoe ___ jij?','heet','heten','heeft','heeten'],
  people:['Dit is ___ broer. Hij heet Tom.','mijn','ik','mij','me'],
  nums:['Het ___ vandaag tien graden.','is','zijn','heeft','heb'],
  travelTime:['Half negen is ___.','08:30','09:30','08:15','09:00'],
  birthday:['Ik verjaar op de ___ mei. (3)','derde','drie','drieën','driede'],
  opening:['De winkel is ___ negen tot zes open.','van','om','op','naar'],
  forms:['Wat is ___ adres, mevrouw?','uw','u','wij','mij'],
  dag:['Vandaag ___ ik om zeven uur op.','sta','staan','opstaan','staat'],
  plans:['Ik ben aan het ___.','koken','kook','kookt','gekookt'],
  health:['Ik blijf thuis omdat ik ziek ___.','ben','is','zijn','heeft'],
  food:['Ik eet ___ fruit: bijna elke dag.','vaak','nooit','geen','niemand'],
  shopping:['Ik koop zes ___.','eieren','ei','eis','eier'],
  past:['Gisteren ___ ik naar Brugge gegaan.','ben','heb','heeft','is'],
  holiday:['We hebben bij mijn zus ___.','gelogeerd','logeert','logeren','geloogd'],
  travel:['Ik moet in Brussel ___.','overstappen','overstapt','overgestapt','stap over'],
  service:['Deze jas is groter ___ die jas.','dan','als','om','van'],
  wonen:['De huur is 700 euro. De kosten zijn 80 euro. Samen betaal ik ___ euro.','780','700','80','620'],
  contact:['Ik heb nog geen bevestiging ___.','ontvangen','ontvangt','ontvang','ontvangde'],
  reading:['Inschrijven kan tot en met vrijdag. Vrijdag inschrijven ___.','mag nog','is te laat','kan nooit','moet altijd'],
  grammar2:['Deze tas is even groot ___ die tas.','als','dan','omdat','naar'],
  ...a12.gaps
 };
 // Chapter tests whose question set changed get a new version: old results stay saved under the old ID but do not count for the new test.
 const testVersions={travel:3,wonen:3,grammar2:3};
 const testId=id=>`course_${id}_v${testVersions[id]||2}`;
 function assessments(tests,DATA) {
  const translated=(uk,en,fr,ar)=>({uk,en,fr,ar});
  const prompt=translated('Заповни пропуск','Fill the gap','Complète','أكمل الفراغ');
  for(const id of ['t5','t10']){const t=tests.find(t=>t.id===id);t.lvl='a11';for(const lang in t.title)t.title[lang]=t.title[lang].replaceAll('A1.2','A1.1');}
  // Give changed assessments new IDs; old achievements and unlocked levels remain saved.
  const health=tests.find(t=>t.id==='t10');health.id='t10_course_v2';
  const ambiguous=health.questions.find(q=>q.opts?.[0]==='Ik ga om elf uur slapen.');
  if(ambiguous)ambiguous.opts[1]='Ik gaat om elf uur slapen.';
  for(const [id,title,tabs] of [...chapters,...advanced]){
   const lvl=chapters.some(c=>c[0]===id)?'a11':a2Ids.has(id)?'a21':'a12',g=gaps[id]||a2.gaps[id];
   const pool=tabs.flatMap(t=>DATA[t]?.items||[]).filter(x=>x.id.startsWith('course_'));
   const fallback=tabs.flatMap(t=>DATA[t]?.items||[]);
   const src=(pool.length>=6?pool:fallback).filter(x=>x.nl&&x.uk&&!/[→:]/.test(x.nl));
   // up to 9 words spread over the whole chapter; distractors come from the same chapter
   const step=Math.max(1,src.length/9),chosen=[];for(let k=0;k<9&&Math.floor(k*step)<src.length;k++)chosen.push(src[Math.floor(k*step)]);
   const questions=[{type:'gap',sentence:g[0],q:prompt,opts:g.slice(1),ok:0}];
   chosen.forEach((item,i)=>{
    const kind=x=>/[.?!]$/.test(x.nl)||x.nl.replace(/^(de|het) /i,'').includes(' ')?'p':'w';
    const langs=['nl','uk','en','fr','ar'],dis=[],taken=[item];
    const fits=o=>o.id!==item.id&&langs.every(l=>!o[l]||taken.every(t=>String(t[l]||'').trim().toLowerCase()!==String(o[l]).trim().toLowerCase()));
    const wide=fallback.filter(x=>x.nl&&x.uk&&!/[→:]/.test(x.nl));
    for(const group of [src.filter(x=>kind(x)===kind(item)),src,wide.filter(x=>kind(x)===kind(item)),wide]){
     for(let k=1;dis.length<3&&k<=group.length;k++){const o=group[(i*7+k*5)%group.length];if(o&&fits(o)){dis.push(o);taken.push(o)}}
     if(dis.length>=3)break;
    }
    if(dis.length<3)return;
    const cand=[item,...dis];
    if(i%2===0)questions.push({type:'mc',q:translated(`Що означає «${item.nl}»?`,`What does “${item.nl}” mean?`,`Que signifie « ${item.nl} » ?`,`ما معنى «${item.nl}»؟`),opts:cand.map(x=>translated(x.uk,x.en,x.fr,x.ar)),ok:0});
    else questions.push({type:'mc',q:translated(`Як нідерландською «${item.uk}»?`,`How do you say “${item.en}” in Dutch?`,`Comment dit-on « ${item.fr||item.en} » en néerlandais ?`,`كيف تقول «${item.ar||item.en}» بالهولندية؟`),opts:cand.map(x=>x.nl),ok:0});
   });
   const no=lvl==='a11'?chapters.findIndex(c=>c[0]===id)+1:lvl==='a21'?a2.chapters.findIndex(c=>c[0]===id)+1:advanced.findIndex(c=>c[0]===id)+1,clean=title.replace(/^\S+\s/,m=>/\p{Extended_Pictographic}/u.test(m)?'':m);
   tests.push({id:testId(id),lvl,group:'chapter',no,chapter:id,dutch:clean,title:translated(`${no} · ${clean}`,`${no} · ${clean}`,`${no} · ${clean}`,`${no} · ${clean}`),questions});
  }
  tests.push({id:'a2_grammar_cards_v1',lvl:'a21',title:translated('Граматика A2: 25 карток','A2 grammar: 25 cards','Grammaire A2 : 25 cartes','قواعد A2: 25 بطاقة'),pass:70,
   questions:a2plus.map(([sentence,...rest])=>({type:'gap',sentence,q:prompt,opts:rest.slice(0,4),ok:0,explanation:translated(...rest[4])}))});
  const levelTest=tests.find(t=>t.kind==='leveltest'&&t.unlocks==='a12');
  levelTest.id='lt_a12_course_v2';
  // Explicitly test all twelve 1.1 chapters, not just introductions.
  levelTest.questions=chapters.map(([id])=>({type:'gap',sentence:gaps[id][0],q:prompt,opts:gaps[id].slice(1),ok:0}));
  const text1='Te koop: damesfiets, drie jaar oud. De remmen werken goed. Vraagprijs: 85 euro. Ophalen in Leuven op zaterdag tussen 10 en 12 uur. Geen levering. Stuur een bericht om een afspraak te maken.';
  const text2='Buurtwandeling op zondag 8 juni. We vertrekken om 10 uur aan de bibliotheek. De wandeling duurt twee uur en gaat ook bij regen door. Deelname kost 4 euro; kinderen onder twaalf jaar wandelen gratis mee. Schrijf je uiterlijk vrijdag in via de website en neem zelf water mee.';
  const questions=[
   [text1,translated('Як отримати велосипед?','How can you get the bicycle?','Comment obtenir le vélo ?','كيف تحصل على الدراجة؟'),['Zelf ophalen in Leuven','Gratis laten bezorgen','Ophalen op zondag','Ophalen in Gent']],
   [text1,translated('Що треба зробити перед зустріччю?','What should you do before meeting?','Que faut-il faire avant la rencontre ?','ماذا يجب أن تفعل قبل اللقاء؟'),['Een bericht sturen','Een brief per post sturen','De fiets repareren','Naar de bibliotheek gaan']],
   [text1,translated('Коли можна забрати велосипед?','When can you collect the bicycle?','Quand peut-on récupérer le vélo ?','متى يمكنك استلام الدراجة؟'),['Zaterdag tussen tien en twaalf','Vrijdag na twaalf','Zondag om tien','Elke avond']],
   [text2,translated('Що буде, якщо піде дощ?','What happens if it rains?','Que se passe-t-il s’il pleut ?','ماذا يحدث إذا أمطرت؟'),['De wandeling gaat door','De wandeling wordt geannuleerd','De wandeling begint later','Iedereen blijft in de bibliotheek']],
   [text2,translated('Скільки платить десятирічна дитина?','How much does a ten-year-old pay?','Combien paie un enfant de dix ans ?','كم يدفع طفل عمره عشر سنوات؟'),['Niets','Vier euro','Twee euro','Twaalf euro']],
   [text2,translated('До якого дня треба зареєструватися?','By which day must you register?','Jusqu’à quel jour faut-il s’inscrire ?','بحلول أي يوم يجب التسجيل؟'),['Uiterlijk vrijdag','Zaterdagavond','Zondagochtend','Maandag']]
  ].map(([text,q,opts])=>({type:'read',text,q,opts,ok:0}));
  tests.push({id:'course_reading_texts_v1',lvl:'a12',title:translated('A1.2 · Читання оголошень','A1.2 · Reading notices','A1.2 · Lire des annonces','A1.2 · قراءة الإعلانات'),questions});
  // Practice test of 27 Oct 2026 → three short revision tests (always shuffled options; the first option is the answer).
  const T=translated,mc=(q,...opts)=>({type:'mc',q,opts,ok:0}),gap=(sentence,...opts)=>({type:'gap',sentence,q:prompt,opts,ok:0});
  const advice=nl=>T(`Дай пораду: «${nl}»`,`Give advice: “${nl}”`,`Donne un conseil : « ${nl} »`,`قدّم نصيحة: «${nl}»`);
  const pick=T('Яке речення правильне?','Which sentence is correct?','Quelle phrase est correcte ?','أي جملة صحيحة؟');
  const spell=T('Як пишеться правильно?','Which spelling is correct?','Quelle orthographe est correcte ?','ما الكتابة الصحيحة؟');
  const sayIt=(uk,en,fr,ar)=>T(`Що ти скажеш? ${uk}`,`What do you say? ${en}`,`Que dis-tu ? ${fr}`,`ماذا تقول؟ ${ar}`);
  const thursday=[
   ['course_thursday_order_v1',T('Четвер 1 · Порада й порядок слів','Thursday 1 · Advice and word order','Jeudi 1 · Conseils et ordre des mots','الخميس 1 · النصائح وترتيب الكلمات'),[
    mc(advice('Ik eet nooit vis.'),'Je moet meer vis eten.','Je moet minder vis eten.','Je meer vis moet eten.','Je moet meer vis.'),
    mc(advice('Ik eet ’s middags altijd een zak snoepjes.'),'Je moet minder snoepjes eten.','Je minder snoepjes moet eten.','Je moet meer snoepjes eten.','Je moet snoepjes minder.'),
    mc(advice('Ik drink 20 kopjes koffie per dag.'),'Je moet minder koffie drinken.','Je moet minder koffie eten.','Jij minder koffie moet drinken.','Je moet meer koffie drinken.'),
    gap('Ik eet geen fruit. Je moet ___ fruit eten.','meer','minder','geen','niet'),
    gap('Ik drink meestal cola bij het eten. Je moet minder cola ___.','drinken','eten','drink','gedronken'),
    mc(pick,'Om 07:00 u neem ik een douche.','Om 07:00 u ik neem een douche.','Om 07:00 u ik een douche neem.','Om 07:00 u neem een douche ik.'),
    mc(pick,'’s Morgens breng ik de kinderen naar school.','’s Morgens ik breng de kinderen naar school.','’s Morgens ik moet de kinderen brengen.','’s Morgens brengen ik de kinderen naar school.'),
    mc(pick,'Ik ga naar de supermarkt en ik doe boodschappen.','Ik ga naar de supermarkt en ik boodschappen doe.','Ik ga naar de supermarkt en boodschappen doen ik.','Ik ga naar de supermarkt en ik doen boodschappen.'),
    gap('Om 08:15 ___ ik.','ontbijt','ontbijten','ontbijd','ontbeet'),
    gap('Na de maaltijd ___ ik naar de tv.','kijk','kijken','ik kijk','kijkt')
   ]],
  ['course_thursday_health_v1',T('Четвер 2 · Тіло, здоров’я, вибачення','Thursday 2 · Body, health, excuses','Jeudi 2 · Corps, santé, excuses','الخميس 2 · الجسم والصحة والاعتذار'),[
    gap('Ik eet, ik spreek en ik drink met mijn ___.','mond','neus','maaltijd','longen'),
    gap('Ik adem met mijn neus en mijn ___.','longen','kinderen','tenen','oren'),
    gap('Ik heb 5 ___ aan elke voet.','tenen','tanden','vingers','handen'),
    gap('Een kind neemt 1 tablet. Een ___ neemt 2 tabletten.','volwassene','kind','kinderen','medicijn'),
    mc(pick,'Hij heeft pijn aan zijn neus.','Hij heeft neuspijn.','Hij heeft pijn neus.','Hij heeft pijn op zijn neus.'),
    gap('Je moet de siroop 3 ___ per dag nemen.','keer','tijd','zin','dag'),
    gap('Wat ___ er? — Ik heb hoofdpijn.','scheelt','schelt','scheel','scheelen'),
    gap('Ik hoest en ik ___ de hele dag.','nies','niest','neus','neis'),
    gap('38° C? Je hebt ___!','koorts','koords','koors','koerts'),
    mc(sayIt('Je kan niet naar een feest komen.','You cannot come to a party.','Tu ne peux pas venir à une fête.','لا تستطيع الحضور إلى حفلة.'),'Het spijt me, ik kan niet komen.','Het spijt me.','Veel beterschap!','Gelukkige verjaardag!'),
    mc(sayIt('Een persoon is ziek.','Someone is ill.','Quelqu’un est malade.','شخص مريض.'),'Veel beterschap!','Gelukkige verjaardag!','Smakelijk!','Goede reis!'),
    gap('— Ga je mee naar de cinema? — Nee, het spijt me, ik heb geen ___.','tijd','uur','dag','klok')
   ]],
  ['course_thursday_spelling_v1',T('Четвер 3 · Правопис і множина','Thursday 3 · Spelling and plurals','Jeudi 3 · Orthographe et pluriel','الخميس 3 · الإملاء والجمع'),[
    mc(spell,'boodschappen','boodschapen','bodschappen','boedschappen'),
    mc(spell,'ontbijt','ontbijd','ontbet','ontbeet'),
    mc(spell,'verkouden','verkoeden','verkeuden','verkowden'),
    mc(spell,'oren','ooren','oorren','orren'),
    mc(spell,'’s morgens','smorgens','s morgens','morgens’s'),
    mc(spell,'wat scheelt er?','wat schelt er?','wat er scheelt?','wat scheelt het?'),
    gap('Ik moet 2 ___ nemen.','neussprays','neusspray','neussprayen','neusspraaien'),
    gap('In de bakkerij koop ik 2 ___.','broden','brooden','broods','brode'),
    gap('Ik heb 2 ___ voor al mijn afspraken.','agenda’s','agendas','agenda','agendaas'),
    gap('2 dozen koekjes en 3 ___ chips.','zakken','zaken','zakkes','zakkens'),
    gap('Mijn zoon heeft pijn aan zijn ___.','schouders','schouden','schouder','schoudeers'),
    gap('Hij eet 3 ___ met eieren.','boterhammen','boterhamen','boterham','boterhammes')
   ]]
  ];
  for(const [id,title,questions] of thursday)tests.push({id,lvl:'a11',title,questions});
  tests.push({id:'course_reading_texts_v2',lvl:'a12',title:T('A1.2 · Читання: школа й громада','A1.2 · Reading: school and town','A1.2 · Lecture : école et commune','A1.2 · القراءة: المدرسة والبلدية'),
   questions:a12.readingQs.map(([n,uk,en,fr,ar,opts])=>({type:'read',text:a12.reading[n],q:T(uk,en,fr,ar),opts,ok:0}))});
  tests.push({id:'course_a12_review_v1',lvl:'a12',title:T('A1.2 · Повторення граматики','A1.2 · Grammar review','A1.2 · Révision de grammaire','A1.2 · مراجعة القواعد'),
   questions:a12.review.map(([kind,...x])=>kind==='gap'?gap(...x):mc(pick,...x))});
 }
 function games(dialogues,speech) {
  const data=[
   ['holiday','🧳','Після відпустки','After the holiday','Après les vacances','بعد العطلة',[
    ['Hoe was je vakantie?','Як минула твоя відпустка?','How was your holiday?'],
    ['Heel fijn. We zijn naar Brugge geweest.','Дуже добре. Ми були в Брюгге.','Very nice. We went to Bruges.'],
    ['Waar hebben jullie gelogeerd?','Де ви зупинялися?','Where did you stay?'],
    ['Bij mijn zus. We hebben ook een museum bezocht.','У моєї сестри. Ми також відвідали музей.','With my sister. We also visited a museum.'],
    ['Was het mooi weer?','Погода була гарна?','Was the weather nice?'],
    ['Het regende, maar we hebben toch gewandeld.','Ішов дощ, але ми все одно гуляли.','It rained, but we still went for a walk.']]],
   ['journey','🚆','Пропущена пересадка','A missed connection','Une correspondance ratée','رحلة ربط فائتة',[
    ['Goedemiddag. Kan ik u helpen?','Добрий день. Можу вам допомогти?','Good afternoon. Can I help you?'],
    ['Ja, mijn trein was te laat. Ik heb mijn aansluiting gemist.','Так, мій поїзд запізнився. Я пропустив пересадку.','Yes, my train was late. I missed my connection.'],
    ['Waar wilt u naartoe?','Куди ви хочете поїхати?','Where do you want to go?'],
    ['Naar Gent. Wanneer vertrekt de volgende trein?','До Гента. Коли вирушає наступний поїзд?','To Ghent. When does the next train leave?'],
    ['Over twintig minuten, van spoor vier.','За двадцять хвилин, із четвертої колії.','In twenty minutes, from platform four.'],
    ['Dank u. Dan ga ik naar spoor vier.','Дякую. Тоді я піду на четверту колію.','Thank you. Then I will go to platform four.']]],
   ['returns','🛍️','Обмін покупки','Exchanging a purchase','Échanger un achat','استبدال مشتريات',[
    ['Goedemorgen. Wat kan ik voor u doen?','Доброго ранку. Чим можу допомогти?','Good morning. What can I do for you?'],
    ['Ik heb deze trui gisteren gekocht, maar hij is te klein.','Я купив цей светр учора, але він замалий.','I bought this jumper yesterday, but it is too small.'],
    ['Wilt u een grotere maat proberen?','Хочете спробувати більший розмір?','Would you like to try a larger size?'],
    ['Ja, graag. Kan ik hem omruilen?','Так, будь ласка. Можна його обміняти?','Yes, please. Can I exchange it?'],
    ['Ja. Hebt u de kassabon bij u?','Так. У вас із собою чек?','Yes. Do you have the receipt with you?'],
    ['Ja, hier is de kassabon.','Так, ось чек.','Yes, here is the receipt.']]],
   ['appointments','📅','Зміна онлайн-запису','Changing an online booking','Modifier une réservation','تغيير حجز إلكتروني',[
    ['Goedemiddag, waarmee kan ik u helpen?','Добрий день, чим можу допомогти?','Good afternoon, how can I help?'],
    ['Ik heb online een afspraak gemaakt, maar ik kan donderdag niet komen.','Я записався онлайн, але не можу прийти в четвер.','I made an appointment online, but I cannot come on Thursday.'],
    ['Past vrijdag om tien uur voor u?','Вам підходить п’ятниця о десятій?','Does Friday at ten suit you?'],
    ['Ja, vrijdag past beter. Krijg ik een nieuwe bevestiging?','Так, п’ятниця підходить краще. Я отримаю нове підтвердження?','Yes, Friday is better. Will I receive a new confirmation?'],
    ['Ja, ik stuur u een e-mail.','Так, я надішлю вам лист.','Yes, I will send you an email.'],
    ['Dank u. Ik kijk mijn e-mail straks na.','Дякую. Я перевірю пошту пізніше.','Thank you. I will check my email later.']]]
  ];
  for(const [id,icon,uk,en,fr,ar,lines] of data)dialogues.push({id:`course_${id}`,lvl:'a12',icon,title:{uk,en,fr,ar},a:'Alex',b:'Sam',hint:'A1.2',lines:lines.map((row,i)=>[i%2?'B':'A',...row])});
  for(const [q,uk,en,m] of [
   ['Waar ben je op vakantie geweest?','Де ти був у відпустці?','Where did you go on holiday?','Ik ben naar Brugge geweest.'],
   ['Wat heb je gisteren gedaan?','Що ти робив учора?','What did you do yesterday?','Ik heb een museum bezocht.'],
   ['Waarom wil je de jas omruilen?','Чому ти хочеш обміняти куртку?','Why do you want to exchange the coat?','Ik wil hem omruilen omdat hij te klein is.'],
   ['Waarom heb je je aansluiting gemist?','Чому ти пропустив пересадку?','Why did you miss your connection?','Ik heb mijn aansluiting gemist omdat mijn trein te laat was.'],
   ['Heb je de bevestiging ontvangen?','Ти отримав підтвердження?','Have you received the confirmation?','Ik heb de bevestiging nog niet ontvangen.'],
   ['Welke kamer vind je beter?','Яка кімната тобі більше подобається?','Which room do you prefer?','Ik vind deze kamer beter omdat ze groter is.']
  ])speech.push({q,uk,en,m,lvl:'a12',open:true});
  for(const [id,icon,uk,en,fr,ar,lines] of a12.dialogues)dialogues.push({id:`course_${id}`,lvl:'a12',icon,title:{uk,en,fr,ar},a:'Alex',b:'Sam',hint:'A1.2',lines:lines.map((row,i)=>[i%2?'B':'A',...row])});
  for(const [q,uk,en,m] of a12.speech)speech.push({q,uk,en,m,lvl:'a12',open:true});
  for(const [id,icon,uk,en,fr,ar,lines] of a2.dialogues)dialogues.push({id:`course_${id}`,lvl:'a21',icon,title:{uk,en,fr,ar},a:'Alex',b:'Sam',hint:'A2',lines:lines.map((row,i)=>[i%2?'B':'A',...row])});
  for(const [q,uk,en,m] of a2.speech)speech.push({q,uk,en,m,lvl:'a21',open:true});
 }
 return {chapters,advanced,a12,a2,a2Ids:[...a2Ids],lessons,topicInfo,testId,apply,buildBank,assessments,games};
})();
