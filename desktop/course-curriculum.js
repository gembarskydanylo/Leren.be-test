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
  return {title,description,dutch,number:chapter>=0?chapter+1:advancedIndex>=0?advancedIndex+1:null,image:`./img/topics/${id}.svg`};
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
 function apply({DATA,CATEGORIES,UI,R,LEVELS}) {
  const grammar = {...CATEGORIES.find(c=>c.id==='grammar')}; // Includes the untouched diphthongs lesson.
  grammar.tabs=grammar.tabs.filter(t=>t!=='adjectives');
  CATEGORIES.splice(0,CATEGORIES.length,
   ...chapters.map(([id,title,tabs],i)=>({id,lvl:'a11',chapter:i+1,tabs})),grammar,
   ...advanced.map(([id,title,tabs])=>({id,lvl:'a12',tabs})));
  LEVELS[0].name='A1.1'; LEVELS[1].name='A1.2'; LEVELS[2].name='A2.1';
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
  // Ordinals are explicit practice, not just mentioned in the chapter heading.
  const ordinals=[['eerste','перший','first','premier','الأول'],['tweede','другий','second','deuxième','الثاني'],['derde','третій','third','troisième','الثالث'],['vierde','четвертий','fourth','quatrième','الرابع'],['vijfde','п’ятий','fifth','cinquième','الخامس'],['zesde','шостий','sixth','sixième','السادس'],['zevende','сьомий','seventh','septième','السابع'],['achtste','восьмий','eighth','huitième','الثامن'],['negende','дев’ятий','ninth','neuvième','التاسع'],['tiende','десятий','tenth','dixième','العاشر'],['elfde','одинадцятий','eleventh','onzième','الحادي عشر'],['twaalfde','дванадцятий','twelfth','douzième','الثاني عشر']];
  DATA.birthday.items.push(...R(ordinals.map(([nl,uk,en,fr,ar],i)=>[`course_ordinal_${i+1}`,nl,en,fr,uk,ar,'📅'])).items);
  for(const [tab,text] of Object.entries(practice))
   DATA[tab].items.push(...R(text.trim().split('\n').map((line,i)=>{
    const [nl,uk,en,fr,ar,icon]=line.split('|');
    return [`course_pt_${tab}_${i+1}`,nl,en,fr,uk,ar,icon||'📖'];
   })).items);
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
  grammar2:['Deze tas is even groot ___ die tas.','als','dan','omdat','naar']
 };
 function assessments(tests,DATA) {
  const translated=(uk,en,fr,ar)=>({uk,en,fr,ar});
  const prompt=translated('Заповни пропуск','Fill the gap','Complète','أكمل الفراغ');
  for(const id of ['t5','t10']){const t=tests.find(t=>t.id===id);t.lvl='a11';for(const lang in t.title)t.title[lang]=t.title[lang].replaceAll('A1.2','A1.1');}
  // Give changed assessments new IDs; old achievements and unlocked levels remain saved.
  const health=tests.find(t=>t.id==='t10');health.id='t10_course_v2';
  const ambiguous=health.questions.find(q=>q.opts?.[0]==='Ik ga om elf uur slapen.');
  if(ambiguous)ambiguous.opts[1]='Ik gaat om elf uur slapen.';
  for(const [id,title,tabs] of [...chapters,...advanced]){
   const lvl=chapters.some(c=>c[0]===id)?'a11':'a12',g=gaps[id];
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
   const no=lvl==='a11'?chapters.findIndex(c=>c[0]===id)+1:advanced.findIndex(c=>c[0]===id)+1,clean=title.replace(/^\S+\s/,m=>/\p{Extended_Pictographic}/u.test(m)?'':m);
   tests.push({id:`course_${id}_v2`,lvl,group:'chapter',no,chapter:id,dutch:clean,title:translated(`${no} · ${clean}`,`${no} · ${clean}`,`${no} · ${clean}`,`${no} · ${clean}`),questions});
  }
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
 }
 return {chapters,advanced,lessons,topicInfo,apply,buildBank,assessments,games};
})();
