/* "Kamer van Pieter": a small CSS-3D room (A2). Tap things, name them, tidy up, tell short stories.
 * Offline, no AI, no 3D library: every piece of furniture is a few CSS boxes inside one preserve-3d room. */
(() => {
 'use strict';
 const LANGS=['uk','en','fr','ar'],KEY='leren_kamer_v1';
 const T={
  uk:{title:'Kamer van Pieter',sub:'Кімната Пітера: знаходь предмети й розмовляй',explore:'Вільне дослідження',exploreS:'Торкайся предметів і вчи слова',tasks:'Завдання',tasksS:'П’ять завдань: до 3 зірок за кожне',menu:'← Меню',left:'Повернути вліво',right:'Повернути вправо',tapHint:'Торкнися предмета. Щоб повернути кімнату, потягни пальцем убік або натисни стрілки.',listen:'🔊 Послухати',send:'Надіслати',example:'Показати приклад',next:'Далі',retry:'Ще раз',allTasks:'До завдань',model:'Приклад',typeNl:'Пиши нідерландською…',tryAgain:'Ще не те. Спробуй ще раз.',notDrink:'Це не те, що п’ють. Шукай далі.',wrongPlace:'Не туди. Спробуй інше місце.',picked:'Обрано. Тепер торкнися місця для цієї речі.',tidyDone:'Усе на місці! Тепер поясни.',pickOutfit:'Що ти вдягнеш або візьмеш? Торкнися речі.',star:'зірок',done:'Готово!',r3:['Fantastisch!','Чудово!'],r2:['Goed gedaan!','Добре!'],r1:['Prima, oefen nog even.','Непогано, ще потренуйся.'],best:'Найкращий результат',yours:'Твоя відповідь',pieter:'Пітер'},
  en:{title:'Kamer van Pieter',sub:'Pieter’s room: find things and talk',explore:'Free exploring',exploreS:'Tap things and learn the words',tasks:'Tasks',tasksS:'Five tasks: up to 3 stars each',menu:'← Menu',left:'Rotate left',right:'Rotate right',tapHint:'Tap an object. To turn the room, drag sideways or use the arrows.',listen:'🔊 Listen',send:'Send',example:'Show an example',next:'Next',retry:'Again',allTasks:'Back to tasks',model:'Example',typeNl:'Write in Dutch…',tryAgain:'Not quite. Try again.',notDrink:'That is not something to drink. Keep looking.',wrongPlace:'Not there. Try another place.',picked:'Picked. Now tap the place for this item.',tidyDone:'Everything is in place! Now explain.',pickOutfit:'What do you wear or take? Tap an item.',star:'stars',done:'Done!',r3:['Fantastisch!','Fantastic!'],r2:['Goed gedaan!','Well done!'],r1:['Prima, oefen nog even.','Good, practise a little more.'],best:'Best result',yours:'Your answer',pieter:'Pieter'},
  fr:{title:'Kamer van Pieter',sub:'La chambre de Pieter : trouve des objets et parle',explore:'Exploration libre',exploreS:'Touche les objets et apprends les mots',tasks:'Missions',tasksS:'Cinq missions : jusqu’à 3 étoiles chacune',menu:'← Menu',left:'Tourner à gauche',right:'Tourner à droite',tapHint:'Touche un objet. Pour tourner la pièce, glisse sur le côté ou utilise les flèches.',listen:'🔊 Écouter',send:'Envoyer',example:'Voir un exemple',next:'Suivant',retry:'Encore',allTasks:'Retour aux missions',model:'Exemple',typeNl:'Écris en néerlandais…',tryAgain:'Pas tout à fait. Essaie encore.',notDrink:'Ce n’est pas quelque chose à boire. Cherche encore.',wrongPlace:'Pas là. Essaie un autre endroit.',picked:'Choisi. Touche maintenant l’endroit pour cet objet.',tidyDone:'Tout est rangé ! Maintenant, explique.',pickOutfit:'Que mets-tu ou prends-tu ? Touche un objet.',star:'étoiles',done:'Terminé !',r3:['Fantastisch!','Fantastique !'],r2:['Goed gedaan!','Bien joué !'],r1:['Prima, oefen nog even.','Bien, entraîne-toi encore un peu.'],best:'Meilleur résultat',yours:'Ta réponse',pieter:'Pieter'},
  ar:{title:'Kamer van Pieter',sub:'غرفة بيتر: ابحث عن الأشياء وتحدّث',explore:'استكشاف حر',exploreS:'المس الأشياء وتعلّم الكلمات',tasks:'مهام',tasksS:'خمس مهام: حتى 3 نجوم لكل مهمة',menu:'← القائمة',left:'تدوير لليسار',right:'تدوير لليمين',tapHint:'المس شيئاً. ولتدوير الغرفة اسحب جانباً أو استخدم الأسهم.',listen:'🔊 استمع',send:'إرسال',example:'أرني مثالاً',next:'التالي',retry:'مرة أخرى',allTasks:'العودة إلى المهام',model:'مثال',typeNl:'اكتب بالهولندية…',tryAgain:'ليس تماماً. حاول مرة أخرى.',notDrink:'هذا ليس شيئاً للشرب. تابع البحث.',wrongPlace:'ليس هنا. جرّب مكاناً آخر.',picked:'تم الاختيار. المس الآن مكان هذا الشيء.',tidyDone:'كل شيء في مكانه! اشرح الآن.',pickOutfit:'ماذا سترتدي أو تأخذ؟ المس شيئاً.',star:'نجوم',done:'انتهى!',r3:['Fantastisch!','رائع!'],r2:['Goed gedaan!','أحسنت!'],r1:['Prima, oefen nog even.','جيد، تدرّب أكثر قليلاً.'],best:'أفضل نتيجة',yours:'إجابتك',pieter:'بيتر'}
 };
 // id: [article, noun, uk, en, fr, ar, example nl, example uk, en, fr, ar, picture]
 const O={
  bed:['het','bed','ліжко','bed','lit','سرير','Het bed staat in de hoek.','Ліжко стоїть у кутку.','The bed is in the corner.','Le lit est dans le coin.','السرير في الزاوية.','🛏️'],
  kast:['de','kast','шафа','wardrobe','armoire','خزانة','Mijn jas hangt in de kast.','Моя куртка висить у шафі.','My coat is hanging in the wardrobe.','Mon manteau est dans l’armoire.','معطفي معلّق في الخزانة.','🧥'],
  tafel:['de','tafel','стіл','table','table','طاولة','De boeken liggen op de tafel.','Книжки лежать на столі.','The books are on the table.','Les livres sont sur la table.','الكتب على الطاولة.','📚'],
  stoel:['de','stoel','стілець','chair','chaise','كرسي','Ik zit op de stoel.','Я сиджу на стільці.','I am sitting on the chair.','Je suis assis sur la chaise.','أجلس على الكرسي.','🪑'],
  koelkast:['de','koelkast','холодильник','fridge','réfrigérateur','ثلاجة','De melk staat in de koelkast.','Молоко стоїть у холодильнику.','The milk is in the fridge.','Le lait est dans le frigo.','الحليب في الثلاجة.','🧊'],
  raam:['het','raam','вікно','window','fenêtre','نافذة','Ik open het raam.','Я відчиняю вікно.','I open the window.','J’ouvre la fenêtre.','أفتح النافذة.','🪟'],
  deur:['de','deur','двері','door','porte','باب','Doe de deur dicht, alstublieft.','Зачини двері, будь ласка.','Close the door, please.','Ferme la porte, s’il te plaît.','أغلق الباب من فضلك.','🚪'],
  klok:['de','klok','годинник','clock','horloge','ساعة','De klok wijst half negen.','Годинник показує пів на дев’яту (8:30).','The clock says half past eight.','L’horloge indique huit heures et demie.','تشير الساعة إلى الثامنة والنصف.','🕒'],
  lamp:['de','lamp','лампа','lamp','lampe','مصباح','Doe de lamp aan.','Увімкни лампу.','Turn on the lamp.','Allume la lampe.','شغّل المصباح.','💡'],
  boeken:['de','boeken','книжки','books','livres','كتب','Ik lees elke avond een boek.','Я читаю книжку щовечора.','I read a book every evening.','Je lis un livre chaque soir.','أقرأ كتاباً كل مساء.','📚'],
  kopje:['het','kopje','чашка','cup','tasse','فنجان','Ik drink een kopje koffie.','Я п’ю чашку кави.','I drink a cup of coffee.','Je bois une tasse de café.','أشرب فنجان قهوة.','☕'],
  sleutels:['de','sleutels','ключі','keys','clés','مفاتيح','Waar zijn mijn sleutels?','Де мої ключі?','Where are my keys?','Où sont mes clés ?','أين مفاتيحي؟','🔑'],
  fles:['de','fles','пляшка','bottle','bouteille','زجاجة','Ik heb een fles water.','У мене є пляшка води.','I have a bottle of water.','J’ai une bouteille d’eau.','لدي زجاجة ماء.','🥤'],
  rugzak:['de','rugzak','рюкзак','backpack','sac à dos','حقيبة ظهر','Mijn rugzak is zwaar.','Мій рюкзак важкий.','My backpack is heavy.','Mon sac à dos est lourd.','حقيبتي الظهرية ثقيلة.','🎒'],
  trui:['de','trui','светр','sweater','pull','كنزة','Ik draag een warme trui.','Я ношу теплий светр.','I am wearing a warm sweater.','Je porte un pull chaud.','أرتدي كنزة دافئة.','👕'],
  laptop:['de','laptop','ноутбук','laptop','ordinateur portable','حاسوب محمول','Mijn laptop staat op de tafel.','Мій ноутбук стоїть на столі.','My laptop is on the table.','Mon ordinateur portable est sur la table.','حاسوبي المحمول على الطاولة.','💻'],
  schrift:['het','schrift','зошит','notebook','cahier','دفتر','Ik schrijf in mijn schrift.','Я пишу у своєму зошиті.','I write in my notebook.','J’écris dans mon cahier.','أكتب في دفتري.','📓'],
  koptelefoon:['de','koptelefoon','навушники','headphones','casque','سماعات الرأس','Ik luister naar muziek met mijn koptelefoon.','Я слухаю музику в навушниках.','I listen to music with my headphones.','J’écoute de la musique avec mon casque.','أستمع إلى الموسيقى بسماعات الرأس.','🎧'],
  sneakers:['de','sneakers','кросівки','sneakers','baskets','أحذية رياضية','Mijn sneakers staan bij de deur.','Мої кросівки стоять біля дверей.','My sneakers are by the door.','Mes baskets sont près de la porte.','حذائي الرياضي بجانب الباب.','👟'],
  plant:['de','plant','рослина','plant','plante','نبتة','De plant staat bij het raam.','Рослина стоїть біля вікна.','The plant is by the window.','La plante est près de la fenêtre.','النبتة بجانب النافذة.','🌱'],
  jas:['de','jas','куртка','coat','manteau','معطف','Ik trek mijn jas aan.','Я вдягаю куртку.','I put on my coat.','J’enfile mon manteau.','أرتدي معطفي.','🧥']
 };
 const L=(o,lang)=>o[2+Math.max(0,LANGS.indexOf(lang))],EX=(o,lang)=>o[7+Math.max(0,LANGS.indexOf(lang))];
 const tl=(arr,lang)=>arr[Math.max(0,LANGS.indexOf(lang))];
 // tasks: nl line, instructions in four languages
 const TASKS=[
  {id:'t1',nl:'Zoek iets om te drinken.',ins:['Знайди в кімнаті щось, щоб випити. Торкнися предмета.','Find something to drink in the room. Tap an object.','Trouve quelque chose à boire dans la chambre. Touche un objet.','ابحث في الغرفة عن شيء تشربه. المس شيئاً.'],
   ask:'Wat is dit? En hoe voel je je?',askT:['Що це? І як ти почуваєшся? Скажи: Dit is een … Ik heb …','What is this? And how do you feel? Say: Dit is een … Ik heb …','Qu’est-ce que c’est ? Et comment te sens-tu ? Dis : Dit is een … Ik heb …','ما هذا؟ وكيف تشعر؟ قل: Dit is een … Ik heb …'],model:'Dit is een fles water. Ik heb dorst.'},
  {id:'t2',nl:'Wat ligt er op de tafel?',ins:['Подивися на стіл. Назви 3–4 предмети, які на ньому лежать.','Look at the table. Name 3 or 4 things on it.','Regarde la table. Nomme 3 ou 4 objets dessus.','انظر إلى الطاولة. سمِّ 3 أو 4 أشياء عليها.'],
   ask:'Wat ligt er op de tafel?',askT:['Скажи: Op de tafel liggen … (торкайся предметів, щоб побачити слова)','Say: Op de tafel liggen … (tap objects to see the words)','Dis : Op de tafel liggen … (touche les objets pour voir les mots)','قل: Op de tafel liggen … (المس الأشياء لترى الكلمات)'],model:'Op de tafel liggen boeken, een kopje, een lamp en sleutels.'},
  {id:'t3',nl:'Maak de kamer netjes.',ins:['Три речі лежать не на місці. Торкнися речі, потім місця для неї.','Three things are in the wrong place. Tap an item, then its place.','Trois objets ne sont pas à leur place. Touche un objet, puis son emplacement.','ثلاثة أشياء ليست في مكانها. المس الشيء ثم مكانه.'],
   ask:'Waarom leg je de trui in de kast? Gebruik omdat.',askT:['Поясни, чому ти кладеш речі саме туди. Використай omdat.','Explain why you put things there. Use omdat.','Explique pourquoi tu ranges les objets là. Utilise omdat.','اشرح لماذا تضع الأشياء هناك. استعمل omdat.'],model:'Ik leg de trui in de kast omdat het daar netjes is.'},
  {id:'t4',nl:'Vertel over gisteren.',ins:['Торкнися будь-якого предмета й розкажи, що ти робив(ла) з ним учора (perfectum).','Tap any object and tell what you did with it yesterday (perfectum).','Touche un objet et raconte ce que tu as fait avec hier (perfectum).','المس أي شيء وأخبر ماذا فعلت به أمس (perfectum).'],
   ask:'Wat heb je gisteren gedaan?',askT:['Почни так: Gisteren heb ik … / Gisteren ben ik …','Start like this: Gisteren heb ik … / Gisteren ben ik …','Commence ainsi : Gisteren heb ik … / Gisteren ben ik …','ابدأ هكذا: Gisteren heb ik … / Gisteren ben ik …'],model:'Gisteren heb ik de lamp aangedaan en ik heb lang gelezen.'},
  {id:'t5',nl:'Wat ga je doen?',ins:['Торкнися шафи, обери одяг і розкажи свій план на день.','Tap the wardrobe, choose clothes and tell your plan for the day.','Touche l’armoire, choisis des vêtements et dis ton programme.','المس الخزانة واختر ملابس وأخبر عن خطتك لليوم.'],
   ask:'Wat ga je doen?',askT:['Скажи: Morgen ga ik … (з назвою обраної речі)','Say: Morgen ga ik … (with the item you chose)','Dis : Morgen ga ik … (avec l’objet choisi)','قل: Morgen ga ik … (مع الشيء الذي اخترته)'],model:'Morgen ga ik met mijn jas naar school.'}
 ];
 const DRINK=new Set(['fles','kopje']),TIDY={trui:'kast',rugzak:'stoel',fles:'koelkast'},TABLE=['boeken','kopje','lamp','sleutels'];
 const OUTFIT=['jas','trui','rugzak'],OUT_RX={jas:/\bjas\b/,trui:/\btrui\b/,rugzak:/\brugzak\b/};
 const norm=s=>String(s||'').toLowerCase().replace(/[’‘]/g,"'").replace(/[.,!?;:()]/g,' ').replace(/\s+/g,' ').trim();
 function load(){try{const v=JSON.parse(localStorage.getItem(KEY)||'{}');return v&&typeof v==='object'&&!Array.isArray(v)?v:{}}catch{return {}}}
 function save(v){try{localStorage.setItem(KEY,JSON.stringify(v))}catch{}}
 const tr=lang=>T[lang]||T.uk;
 // ---- grading (exported for tests) ----
 function grade(id,text,ctx={}){
  const s=norm(text),words=s?s.split(' ').length:0;
  if(id==='t1'){if(!s)return 0;const named=(ctx.item==='kopje'?/\bkop(je)?\b|koffie|thee/:/\bfles\b|water/).test(s);return Math.min(3,1+(named?1:0)+(/dorst/.test(s)?1:0))}
  if(id==='t2'){const n=[/\bboek(en)?\b/,/\bkop(je|jes)?\b|koffie/,/\blamp\b/,/\bsleutels?\b/].filter(r=>r.test(s)).length;return n>=4?3:n===3?2:n===2?1:0}
  if(id==='t3'){if(!s)return 0;const base=2+(/\b(omdat|want)\b/.test(s)?1:0);return Math.max(1,base-((ctx.misses||0)>2?1:0))}
  if(id==='t4'){const aux=/\b(heb|hebt|heeft|hebben|ben|bent|is|zijn)\b/.test(s),part=/\bge[a-zëï]{3,}\b|\b(vergeten|bezocht|verloren|begonnen|ontmoet|bekeken)\b/.test(s);return aux&&part?(/gisteren/.test(s)&&words>=4?3:2):0}
  if(id==='t5'){const plan=/\b(ga ik|ik ga|gaan we|ga je)\b/.test(s)&&words>=4;if(!plan)return 0;return 2+((ctx.outfit&&OUT_RX[ctx.outfit].test(s))||/\bomdat\b/.test(s)?1:0)}
  return 0;
 }
 const el=(tag,cls,text)=>{const e=document.createElement(tag);if(cls)e.className=cls;if(text!=null)e.textContent=text;return e};
 const btn=(text,cls,fn)=>{const b=el('button',cls,text);b.type='button';if(fn)b.onclick=fn;return b};
 const stars=n=>'★'.repeat(n)+'☆'.repeat(3-n);

 // ---- the 3D room ----
 function box(w,h,d,color,x,y,z){
  const r=el('div','k-box');r.style.width=w+'px';r.style.height=h+'px';r.style.marginLeft=-w/2+'px';r.style.marginTop=-h/2+'px';r.style.setProperty('--c',color);r.style.transform='translate3d('+x+'px,'+y+'px,'+z+'px)';
  const f=(cls,fw,fh,tf,left,top)=>{const e=el('div','k-face '+cls);e.style.width=fw+'px';e.style.height=fh+'px';e.style.transform=tf;if(left!=null)e.style.left=left+'px';if(top!=null)e.style.top=top+'px';r.appendChild(e)};
  f('k-f',w,h,'translateZ('+d/2+'px)');f('k-s',w,h,'rotateY(180deg) translateZ('+d/2+'px)');
  f('k-s',d,h,'rotateY(90deg) translateZ('+w/2+'px)',(w-d)/2);f('k-s',d,h,'rotateY(-90deg) translateZ('+w/2+'px)',(w-d)/2);
  f('k-t',w,d,'rotateX(90deg) translateZ('+h/2+'px)',null,(h-d)/2);
  return r;
 }
 const HI=4;// pictures (emoji images) are laid out HI× larger and scaled by 1/HI: sharp at any camera zoom
 const shadow=(w,d,y=0)=>{const e=el('div','k-shadow');e.style.width=w+'px';e.style.height=d+'px';e.style.marginLeft=-w/2+'px';e.style.marginTop=-d/2+'px';e.style.transform='translateY('+(y-.5)+'px) rotateX(90deg)';return e};
 const group=(id,x,y,z,kids,extra,sh)=>{const g=el('div','k-obj'+(extra?' '+extra:''));g.dataset.item=id;g.style.transform='translate3d('+x+'px,'+y+'px,'+z+'px)';if(sh)g.appendChild(shadow(sh[0],sh[1]));kids.forEach(k=>g.appendChild(k));return g};
 function wallItem(id,x,y,z,rot,w,h,cls,kids=[]){const g=el('div','k-obj k-wall');g.dataset.item=id;g.style.transform='translate3d('+x+'px,'+y+'px,'+z+'px) rotateY('+rot+'deg)';const f=el('div','k-face k-flat '+cls);f.style.width=w+'px';f.style.height=h+'px';f.style.marginLeft=-w/2+'px';f.style.marginTop=-h/2+'px';kids.forEach(k=>f.appendChild(k));g.appendChild(f);return g}
 function billboard(id,x,y,z,size,pic){const g=el('div','k-obj k-bb-wrap');g.dataset.item=id;g.style.transform='translate3d('+x+'px,'+y+'px,'+z+'px)';const b=el('div','k-bb'),S=size*HI;b.style.width=S+'px';b.style.height=S+'px';b.style.marginLeft=-S/2+'px';b.style.marginTop=-S/2+'px';const p=pic();if(p){p.classList?.add('k-pic');b.appendChild(p)}else b.textContent=O[id][11];g.append(shadow(size*.8,size*.4,size/2),b);return g}
 function buildRoom(host,opts={}){
  const room=el('div','k-room');
  const face=(cls,w,h,tf,left,top)=>{const e=el('div','k-face k-shell '+cls);e.style.width=w+'px';e.style.height=h+'px';e.style.transform=tf;if(left!=null)e.style.left=left+'px';if(top!=null)e.style.top=top+'px';room.appendChild(e)};
  face('k-floor',240,240,'rotateX(90deg) translateZ(-85px)',0,-35);face('k-back',240,170,'translateZ(-120px)');face('k-left',240,170,'rotateY(90deg) translateZ(-120px)');
  face('k-rug',130,100,'rotateX(90deg) translateZ(-84.6px) translate3d(8px,28px,0)',55,35);face('k-sun',70,92,'rotateX(90deg) translateZ(-84.7px) translate3d(-68px,-52px,0) skewY(-14deg)',85,39);
  face('k-skirt',240,8,'translateZ(-119.5px)',0,162);face('k-skirt',240,8,'rotateY(90deg) translateZ(-119.5px)',0,162);
  const pic=e=>()=>host.icon?host.icon(O[e][11]):null;const things=[];
  things.push(group('bed',-78,85,-62,[box(70,14,112,'#8b6b4a',0,-7,0),box(66,12,104,'#5b8def',0,-20,0),box(50,8,22,'#ffffff',0,-30,-38)],null,[86,128]));
  things.push(group('kast',75,85,-98,[box(60,120,40,'#c08a5a',0,-60,0),box(4,16,4,'#5c4033',-7,-62,21),box(4,16,4,'#5c4033',7,-62,21)],null,[76,54]));
  things.push(group('koelkast',8,85,-100,[box(42,96,36,'#e6edf2',0,-48,0),box(3,26,3,'#8fa0ab',14,-62,19)],null,[56,48]));
  const leg=(lx,lz)=>box(5,50,5,'#7a5232',lx,-25,lz);
  things.push(group('tafel',30,85,12,[box(84,6,52,'#a8764b',0,-53,0),leg(-36,-21),leg(36,-21),leg(-36,21),leg(36,21)],null,[100,68]));
  const sl=(lx,lz)=>box(4,26,4,'#8c2f3c',lx,-13,lz);
  things.push(group('stoel',-8,85,52,[box(30,5,30,'#d1495b',0,-27,0),sl(-12,-12),sl(12,-12),sl(-12,12),sl(12,12),box(30,28,4,'#d1495b',0,-43,-13)],null,[40,40]));
  const win=[el('i','k-cross-v'),el('i','k-cross-h')];
  things.push(wallItem('raam',-119,-18,-62,90,64,54,'k-window',win));
  things.push(wallItem('deur',-119,25,72,90,50,120,'k-door',[el('i','k-knob')]));
  const clockPic=host.icon?host.icon(O.klok[11]):null;if(clockPic)clockPic.classList?.add('k-pic');
  things.push(wallItem('klok',15,-48,-119,0,36*HI,36*HI,'k-clock k-hi',clockPic?[clockPic]:[]));
  things.push(billboard('lamp',58,13,2,30,pic('lamp')),billboard('boeken',6,17,12,28,pic('boeken')),billboard('kopje',32,20,26,22,pic('kopje')),billboard('sleutels',22,24,-4,18,pic('sleutels')));
  things.push(billboard('fles',8,-24,-100,24,pic('fles')));
  things.push(billboard('rugzak',-18,69,78,30,pic('rugzak')),billboard('trui',48,70,70,30,pic('trui')));
  things.push(billboard('laptop',22,14,8,32,pic('laptop')),billboard('schrift',46,22,24,20,pic('schrift')),billboard('koptelefoon',-70,43,-30,24,pic('koptelefoon')),billboard('sneakers',-95,72,48,26,pic('sneakers')),billboard('plant',100,66,62,28,pic('plant')));
  const A1X=new Set(['laptop','schrift']);
  const shown=opts.keep?things.filter(t=>opts.keep.has(t.dataset.item)):things.filter(t=>!A1X.has(t.dataset.item));
  shown.forEach(t=>{const id=t.dataset.item;t.tabIndex=0;t.setAttribute('role','button');t.setAttribute('aria-label',O[id][0]+' '+O[id][1]);room.appendChild(t)});
  if(opts.sam)room.appendChild(buildSam(host));
  return room;
 }

 // ================= game stage: full-screen layout, HUD and camera (shared by the A2 and A1 rooms) =================
 const HT={
  uk:{menu:'Меню',close:'До списку ігор',soundOn:'Вимкнути звук',soundOff:'Увімкнути звук',full:'На весь екран',fullExit:'Вийти з повноекранного режиму',zoomIn:'Наблизити',zoomOut:'Віддалити',reset:'Початковий ракурс',left:'Повернути вліво',right:'Повернути вправо',hint:'Торкнися предмета · тягни, щоб повернути · щипок або коліщатко — масштаб',task:'Завдання',talk:'Розмова',score:'Рахунок',view:'Камера'},
  en:{menu:'Menu',close:'Back to the games',soundOn:'Turn sound off',soundOff:'Turn sound on',full:'Full screen',fullExit:'Exit full screen',zoomIn:'Zoom in',zoomOut:'Zoom out',reset:'Starting view',left:'Turn left',right:'Turn right',hint:'Tap an object · drag to turn · pinch or scroll to zoom',task:'Task',talk:'Talk',score:'Score',view:'Camera'},
  fr:{menu:'Menu',close:'Retour aux jeux',soundOn:'Couper le son',soundOff:'Activer le son',full:'Plein écran',fullExit:'Quitter le plein écran',zoomIn:'Zoomer',zoomOut:'Dézoomer',reset:'Vue de départ',left:'Tourner à gauche',right:'Tourner à droite',hint:'Touche un objet · glisse pour tourner · pince ou molette pour zoomer',task:'Mission',talk:'Dialogue',score:'Score',view:'Caméra'},
  ar:{menu:'القائمة',close:'العودة إلى الألعاب',soundOn:'كتم الصوت',soundOff:'تشغيل الصوت',full:'ملء الشاشة',fullExit:'الخروج من ملء الشاشة',zoomIn:'تكبير',zoomOut:'تصغير',reset:'الزاوية الأولى',left:'تدوير لليسار',right:'تدوير لليمين',hint:'المس شيئاً · اسحب للتدوير · قرّب بإصبعين أو بالعجلة للتكبير',task:'مهمة',talk:'حوار',score:'النتيجة',view:'الكاميرا'}
 };
 const ht=lang=>HT[lang]||HT.uk;
 const MUTE_KEY='leren_kamer_mute';
 const muted=()=>{try{return localStorage.getItem(MUTE_KEY)==='1'}catch{return false}};
 // Every spoken line goes through here, so the sound button silences the whole game.
 const quiet=host=>({...host,say:t=>{if(!muted())host.say(t)}});
 const SVG={
  back:'<path d="M15 5l-7 7 7 7"/>',close:'<path d="M6 6l12 12M18 6L6 18"/>',
  on:'<path d="M4 9v6h4l5 4V5L8 9H4z"/><path d="M16.5 8.5a5 5 0 010 7M19 6a8.5 8.5 0 010 12"/>',off:'<path d="M4 9v6h4l5 4V5L8 9H4z"/><path d="M17 9l5 6M22 9l-5 6"/>',
  full:'<path d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5"/>',exit:'<path d="M9 4v5H4M15 4v5h5M9 20v-5H4M15 20v-5h5"/>',
  plus:'<path d="M12 5v14M5 12h14"/>',minus:'<path d="M5 12h14"/>',reset:'<path d="M4 12a8 8 0 108-8 8 8 0 00-6 2.7"/><path d="M4 4v4h4"/>',
  left:'<path d="M15 5l-7 7 7 7"/>',right:'<path d="M9 5l7 7-7 7"/>'
 };
 const icon=name=>{const s=document.createElementNS('http://www.w3.org/2000/svg','svg');s.setAttribute('viewBox','0 0 24 24');s.setAttribute('aria-hidden','true');s.setAttribute('focusable','false');s.innerHTML=SVG[name];return s};
 const iconBtn=(name,cls,label,fn)=>{const b=btn('',cls,fn);b.appendChild(icon(name));b.setAttribute('aria-label',label);b.title=label;return b};
 let activeStage=null;
 const closeStage=()=>{if(activeStage){activeStage.destroy();activeStage=null}};
 const REDUCE=()=>typeof matchMedia==='function'&&matchMedia('(prefers-reduced-motion: reduce)').matches;

 // Orbit camera over the CSS-3D room: yaw/pitch/zoom eased towards a target; the room is scaled (in all three axes) and the
 // perspective grows with it, so the room is framed the same way on a phone and on a 1920px screen.
 function camera(scene,room,yaw0){
  const HOME={yaw:yaw0,pitch:-24,zoom:1},cam={...HOME},cur={...HOME};let fit=1,raf=0;
  const LIM={yaw:[-50,50],pitch:[-40,-8],zoom:[.8,2.2]};
  const clamp=()=>{for(const k in LIM)cam[k]=Math.max(LIM[k][0],Math.min(LIM[k][1],cam[k]))};
  const apply=()=>{const s=fit*cur.zoom;room.style.setProperty('--ry',cur.yaw.toFixed(2)+'deg');
   room.style.transform='translate('+(10*fit).toFixed(1)+'px,'+(-17*fit).toFixed(1)+'px) scale3d('+s.toFixed(4)+','+s.toFixed(4)+','+s.toFixed(4)+') rotateX('+cur.pitch.toFixed(2)+'deg) rotateY('+cur.yaw.toFixed(2)+'deg)'};
  const tick=()=>{raf=0;let moving=false;for(const k in cam){const d=cam[k]-cur[k],eps=k==='zoom'?.001:.04;if(Math.abs(d)>eps){cur[k]+=d*.22;moving=true}else cur[k]=cam[k]}apply();if(moving)raf=requestAnimationFrame(tick)};
  const go=()=>{clamp();if(REDUCE()||!scene.isConnected){Object.assign(cur,cam);apply();return}if(!raf)raf=requestAnimationFrame(tick)};
  const measure=()=>{const r=scene.getBoundingClientRect();if(!r.width||!r.height)return;
   // what you see of the room at scale 1 (default view) measures about 325×280 px; keep a margin around it
   fit=Math.max(.7,Math.min(r.width/345,r.height/300)*.95);scene.style.perspective=Math.round(900*fit)+'px';apply()};
  return{cam,go,measure,apply,
   turn:d=>{cam.yaw+=d;go()},tilt:d=>{cam.pitch+=d;go()},zoom:f=>{cam.zoom*=f;go()},
   reset:()=>{Object.assign(cam,HOME);go()},
   set yawNow(v){cam.yaw=v;clamp();cur.yaw=cam.yaw;apply()},
   stop:()=>{if(raf)cancelAnimationFrame(raf);raf=0}};
 }

 // Builds the full-screen game: HUD on top, the 3D scene as the main area, the question panel at the side (wide screens)
 // or below (phones). Returns the pieces the game logic needs.
 function stage(host,{card,lang,dir,title,titleNl,sub,room,onMenu,yaw=-24}){
  const h=ht(lang);card.classList.add('k-host');
  const root=el('section','k k-stage k-play');root.dir=dir;root.setAttribute('aria-label',title);
  // HUD
  const hud=el('div','k-hud');
  const back=btn('','k-back-btn k-hud-btn k-hud-menu',()=>{closeStage();onMenu()});back.append(icon('back'),el('span','',h.menu));back.setAttribute('aria-label',h.menu);
  const head=el('div','k-hud-title');const tt=el('strong','k-title',title);if(titleNl){tt.lang='nl';tt.dir='ltr'}head.append(tt,el('small','',sub));
  const chips=el('div','k-hud-chips');const prog=el('span','k-chip k-chip-prog');prog.hidden=true;const score=el('span','k-chip k-chip-score');score.hidden=true;score.setAttribute('aria-live','polite');chips.append(prog,score);
  const tools=el('div','k-hud-tools');
  const snd=iconBtn(muted()?'off':'on','k-hud-btn k-icon-btn k-sound',muted()?h.soundOff:h.soundOn,()=>{const m=!muted();try{localStorage.setItem(MUTE_KEY,m?'1':'0')}catch{}
   if(m)try{speechSynthesis.cancel()}catch{}snd.replaceChildren(icon(m?'off':'on'));snd.setAttribute('aria-label',m?h.soundOff:h.soundOn);snd.title=m?h.soundOff:h.soundOn;snd.setAttribute('aria-pressed',String(m))});
  snd.setAttribute('aria-pressed',String(muted()));
  const canFull=!!(document.fullscreenEnabled&&root.requestFullscreen);
  const full=iconBtn('full','k-hud-btn k-icon-btn k-full',h.full,()=>{if(document.fullscreenElement)document.exitFullscreen().catch(()=>{});else root.requestFullscreen({navigationUI:'hide'}).catch(()=>{})});full.hidden=!canFull;
  const close=iconBtn('close','k-hud-btn k-icon-btn k-close',h.close,()=>{closeStage();host.home()});
  tools.append(snd,full,close);hud.append(back,head,chips,tools);
  // scene + camera controls
  const body=el('div','k-body');
  const scene=el('div','k-scene');scene.tabIndex=0;scene.setAttribute('role','group');scene.setAttribute('aria-label',title);scene.appendChild(room);
  const cam=camera(scene,room,yaw);
  const ctl=el('div','k-cam');ctl.setAttribute('role','toolbar');ctl.setAttribute('aria-label',h.view);
  const lb=iconBtn('left','k-rot k-cam-btn',h.left,()=>cam.turn(-15)),rb=iconBtn('right','k-rot k-cam-btn',h.right,()=>cam.turn(15));
  ctl.append(lb,iconBtn('minus','k-cam-btn k-zoom-out',h.zoomOut,()=>cam.zoom(1/1.2)),iconBtn('reset','k-cam-btn k-reset',h.reset,()=>cam.reset()),iconBtn('plus','k-cam-btn k-zoom-in',h.zoomIn,()=>cam.zoom(1.2)),rb);
  const hint=el('p','k-hint',h.hint);
  const view=el('div','k-view');view.append(scene,ctl,hint);
  const panel=el('div','k-panel');panel.setAttribute('aria-live','polite');
  const side=el('aside','k-side');side.appendChild(panel);
  body.append(view,side);root.append(hud,body);card.appendChild(root);
  // pointer: one finger/mouse turns (and tilts), two fingers pinch-zoom. No pointer capture, so taps still reach the objects.
  const pts=new Map();let drag=null,pinch=null,moved=false;
  const used=()=>view.classList.add('k-used');setTimeout(used,7000);
  scene.addEventListener('pointerdown',e=>{if(e.button>0)return;pts.set(e.pointerId,{x:e.clientX,y:e.clientY});
   if(pts.size===1){drag={x:e.clientX,y:e.clientY,yaw:cam.cam.yaw,pitch:cam.cam.pitch};moved=false}
   else if(pts.size===2){const [a,b]=[...pts.values()];pinch={d:Math.hypot(a.x-b.x,a.y-b.y)||1,zoom:cam.cam.zoom};drag=null;moved=true}});
  const mv=e=>{if(!root.isConnected){destroy();return}const p=pts.get(e.pointerId);if(!p)return;p.x=e.clientX;p.y=e.clientY;
   if(pinch&&pts.size>=2){const [a,b]=[...pts.values()];cam.cam.zoom=pinch.zoom*Math.hypot(a.x-b.x,a.y-b.y)/pinch.d;cam.go();used();return}
   if(!drag)return;const dx=e.clientX-drag.x,dy=e.clientY-drag.y;if(!moved&&Math.hypot(dx,dy)>7){moved=true;scene.classList.add('is-dragging');used()}
   if(moved){cam.cam.yaw=drag.yaw+dx*.28;cam.cam.pitch=drag.pitch-dy*.18;cam.go()}};
  const up=e=>{pts.delete(e.pointerId);if(pts.size<2)pinch=null;if(!pts.size){drag=null;scene.classList.remove('is-dragging')}};
  const wheel=e=>{e.preventDefault();cam.zoom(Math.exp(-Math.max(-60,Math.min(60,e.deltaY))*.004));used()};
  scene.addEventListener('wheel',wheel,{passive:false});
  scene.addEventListener('keydown',e=>{if(e.target!==scene)return;const k={ArrowLeft:()=>cam.turn(-10),ArrowRight:()=>cam.turn(10),ArrowUp:()=>cam.tilt(-5),ArrowDown:()=>cam.tilt(5),'+':()=>cam.zoom(1.15),'=':()=>cam.zoom(1.15),'-':()=>cam.zoom(1/1.15),'0':()=>cam.reset()}[e.key];if(k){e.preventDefault();k();used()}});
  const onFull=()=>{const on=document.fullscreenElement===root;full.replaceChildren(icon(on?'exit':'full'));full.setAttribute('aria-label',on?h.fullExit:h.full);full.title=on?h.fullExit:h.full;root.classList.toggle('is-full',on);requestAnimationFrame(cam.measure)};
  window.addEventListener('pointermove',mv);window.addEventListener('pointerup',up);window.addEventListener('pointercancel',up);
  document.addEventListener('fullscreenchange',onFull);
  const ro=typeof ResizeObserver==='function'?new ResizeObserver(()=>{if(!root.isConnected){destroy();return}cam.measure()}):null;
  if(ro)ro.observe(scene);else window.addEventListener('resize',cam.measure);
  // tapping: ignore the click that ends a drag
  let onTap=()=>{};
  const tap=e=>{if(moved){moved=false;return}const n=e.target.closest('[data-item]');if(!n||!room.contains(n))return;used();onTap(n.dataset.item,n)};
  scene.addEventListener('click',tap);
  scene.addEventListener('keydown',e=>{if((e.key==='Enter'||e.key===' ')&&e.target.dataset?.item){e.preventDefault();tap(e)}});
  let dead=false;
  function destroy(){if(dead)return;dead=true;cam.stop();window.removeEventListener('pointermove',mv);window.removeEventListener('pointerup',up);window.removeEventListener('pointercancel',up);
   window.removeEventListener('resize',cam.measure);document.removeEventListener('fullscreenchange',onFull);if(ro)ro.disconnect();
   if(document.fullscreenElement===root)document.exitFullscreen().catch(()=>{})}
  const api={root,panel,scene,room,cam,destroy,
   set onTap(f){onTap=f},get onTap(){return onTap},
   progress:text=>{prog.hidden=text==null;prog.textContent=text||''},
   score:text=>{score.hidden=text==null;score.textContent=text||''},
   bump:()=>{score.classList.remove('is-bump');void score.offsetWidth;score.classList.add('is-bump')},
   title:(text,nl)=>{tt.textContent=text;if(nl){tt.lang='nl';tt.dir='ltr'}else{tt.removeAttribute('lang');tt.removeAttribute('dir')}}};
  activeStage=api;
  cam.measure();requestAnimationFrame(cam.measure);
  return api;
 }

 function start(host){
  host=quiet(host);const lang=host.lang(),u=tr(lang);let st=load();st.stars=st.stars||{};let xpTotal=0;
  const root=()=>host.head(u.title,u.sub);
  const dir=lang==='ar'?'rtl':'ltr';
  const pieterRow=(nl,locText)=>{const row=el('div','k-pieter');const img=el('img','k-avatar');img.src='./img/chars/peter.webp';img.alt=u.pieter;img.width=44;img.height=44;
   const bub=el('div','k-bubble');const n=el('strong','k-nl',nl);n.lang='nl';n.dir='ltr';bub.appendChild(n);if(locText)bub.appendChild(el('span','k-loc',locText));row.append(img,bub);return row};

  function menu(){
   closeStage();const card=root();host.bar(0);const box=el('section','k k-menu');box.dir=dir;
   box.appendChild(pieterRow('Welkom in mijn kamer!',tl(['Ласкаво просимо до моєї кімнати!','Welcome to my room!','Bienvenue dans ma chambre !','مرحباً بك في غرفتي!'],lang)));
   const ex=btn('','k-big',()=>play(null));ex.append(el('strong','',u.explore),el('small','',u.exploreS));box.appendChild(ex);
   box.appendChild(el('h3','k-h',u.tasks));box.appendChild(el('p','k-sub',u.tasksS));
   const list=el('div','k-tasks');TASKS.forEach((t,i)=>{const b=btn('','k-task',()=>play(i));const s=st.stars[t.id]||0;
    const c=el('span','k-task-copy');const n=el('strong','',(i+1)+'. '+t.nl);n.lang='nl';n.dir='ltr';c.append(n,el('small','',tl(t.ins,lang)));const sr=el('span','k-stars',stars(s));sr.setAttribute('aria-label',s+' / 3 '+u.star);b.append(c,sr);list.appendChild(b)});
   box.appendChild(list);card.appendChild(box);
  }

  function play(ti){
   const t=ti==null?null:TASKS[ti];const card=root();host.bar(ti==null?0:ti/TASKS.length);
   const S=stage(host,{card,lang,dir,title:t?(ti+1)+'. '+t.nl:u.explore,titleNl:!!t,sub:u.title,room:buildRoom(host),onMenu:menu});
   const {panel,room}=S;
   if(t){S.progress(ht(lang).task+' '+(ti+1)+' / '+TASKS.length);S.score(stars(st.stars[t.id]||0))}
   const items=()=>[...room.querySelectorAll('[data-item]')];
   const mark=(id,cls,on=true)=>items().forEach(n=>{if(n.dataset.item===id)n.classList.toggle(cls,on)});
   const clearMarks=cls=>items().forEach(n=>n.classList.remove(cls));
   const tag=id=>{const o=O[id];panel.querySelector('.k-tag')?.remove();const g=el('div','k-tag');const n=el('strong','',o[0]+' '+o[1]);n.lang='nl';g.append(n,el('span','',' · '+L(o,lang)));return g};
   let onTap=()=>{};
   S.onTap=id=>{onTap(id);host.say(O[id][0]+' '+O[id][1])};

   // ---- free exploring ----
   if(!t){
    onTap=id=>{const o=O[id];panel.replaceChildren();clearMarks('is-hot');mark(id,'is-hot');
     const w=el('div','k-word');const n=el('strong','k-word-nl',o[0]+' '+o[1]);n.lang='nl';n.dir='ltr';w.append(n,el('span','k-word-tr',L(o,lang)));
     const ex=el('p','k-ex');const exn=el('span','',o[6]);exn.lang='nl';exn.dir='ltr';ex.append(exn,el('small','',EX(o,lang)));
     panel.append(w,ex,btn(u.listen,'btn',()=>host.say(o[0]+' '+o[1]+'. '+o[6])))};
    panel.appendChild(pieterRow('Wat zie je in mijn kamer?',tl(['Що ти бачиш у моїй кімнаті? Торкнися предмета.','What do you see in my room? Tap an object.','Que vois-tu dans ma chambre ? Touche un objet.','ماذا ترى في غرفتي؟ المس شيئاً.'],lang)));
    return;
   }

   // ---- tasks ----
   let misses=0,ctx={};
   const intro=()=>{panel.replaceChildren(pieterRow(t.nl,tl(t.ins,lang)))};
   const form=(onSend)=>{
    const f=el('form','k-form');const inp=el('input','k-input');inp.type='text';inp.lang='nl';inp.dir='ltr';inp.autocomplete='off';inp.autocapitalize='sentences';inp.spellcheck=false;inp.placeholder=u.typeNl;inp.setAttribute('aria-label',u.typeNl);
    const send=btn(u.send,'btn primary');send.type='submit';f.append(inp,send);const msg=el('p','k-msg');msg.setAttribute('role','status');
    let tries=0;const ex=btn(u.example,'btn k-example',()=>onSend(null,true));ex.hidden=true;
    f.onsubmit=e=>{e.preventDefault();const v=inp.value.trim();if(!v){inp.focus();return}const r=onSend(v,false);if(r===false){tries++;msg.textContent=u.tryAgain;if(tries>=1)ex.hidden=false;inp.focus()}};
    const wrap=el('div','k-formwrap');wrap.append(f,msg,ex);setTimeout(()=>inp.focus({preventScroll:true}),50);return wrap;
   };
   const result=(starsN,text,tipModel)=>{
    const best=st.stars[t.id]||0,gain=Math.max(0,starsN-best)*5;if(starsN>best){st.stars[t.id]=starsN;save(st)}xpTotal+=gain;S.score(stars(Math.max(best,starsN)));if(starsN>best)S.bump();
    panel.replaceChildren();const r=el('div','k-result');const re=starsN>=3?u.r3:starsN===2?u.r2:u.r1;
    const big=el('div','k-bigstars',stars(starsN));big.setAttribute('aria-label',starsN+' / 3 '+u.star);r.appendChild(big);
    r.appendChild(pieterRow(re[0],re[1]));
    if(text){const y=el('p','k-yours');y.append(el('small','',u.yours+': '),(()=>{const s=el('span','',text);s.lang='nl';s.dir='ltr';return s})());r.appendChild(y)}
    const m=el('p','k-model');m.append(el('small','',u.model+': '),(()=>{const s=el('strong','',tipModel||t.model);s.lang='nl';s.dir='ltr';return s})());r.appendChild(m);
    const row=el('div','row');row.append(btn(u.listen,'btn',()=>host.say(tipModel||t.model)),btn(u.retry,'btn',()=>play(ti)),
     btn(ti<TASKS.length-1?u.next:u.allTasks,'btn primary',()=>ti<TASKS.length-1?play(ti+1):menu()));r.appendChild(row);panel.appendChild(r);
    host.bar((ti+1)/TASKS.length);host.done(gain);
   };
   const ask=(model)=>{
    panel.replaceChildren(pieterRow(t.ask,tl(t.askT,lang)));
    panel.appendChild(form((v,showModel)=>{
     if(showModel){result(1,'',model||t.model);return true}
     const s=grade(t.id,v,{...ctx,misses});if(s<1)return false;result(s,v,null);return true;
    }));
   };
   intro();
   if(t.id==='t1'){
    onTap=id=>{if(DRINK.has(id)){ctx.item=id;clearMarks('is-hot');mark(id,'is-hot');onTap=()=>{};ask(id==='kopje'?'Dit is een kopje koffie. Ik heb dorst.':'Dit is een fles water. Ik heb dorst.')}else{panel.querySelector('.k-msg2')?.remove();panel.appendChild(el('p','k-msg2',u.notDrink));panel.appendChild(tag(id))}};
   }
   if(t.id==='t2'){
    TABLE.forEach(id=>mark(id,'is-hint'));onTap=id=>{panel.querySelector('.k-tag')?.remove();panel.insertBefore(tag(id),panel.children[1]||null)};ask();
   }
   if(t.id==='t3'){
    const left=new Set(Object.keys(TIDY));let picked=null;Object.keys(TIDY).forEach(id=>mark(id,'is-hint'));
    // in this task the bottle stands on the floor, the others as usual
    const bottle=room.querySelector('[data-item="fles"]');const home=bottle.style.transform;bottle.style.transform='translate3d(90px,71px,52px)';
    const dest={kast:[75,25,-72],stoel:[-8,50,52],koelkast:[8,-20,-72]};
    const say=m=>{panel.querySelector('.k-msg2')?.remove();panel.appendChild(el('p','k-msg2',m))};
    onTap=id=>{
     if(left.has(id)){picked=id;clearMarks('is-hot');mark(id,'is-hot');say(u.picked);return}
     if(!picked){return}
     if(TIDY[picked]===id){const node=items().find(n=>n.dataset.item===picked);const d=dest[id];node.style.transform='translate3d('+d[0]+'px,'+d[1]+'px,'+d[2]+'px)';node.classList.remove('is-hint','is-hot');left.delete(picked);picked=null;
      if(!left.size){clearMarks('is-hint');ctx.misses=misses;ask('Ik leg de trui in de kast omdat het daar netjes is.');panel.insertBefore(el('p','k-msg2 ok',u.tidyDone),panel.children[1]||null)}else say(u.picked.split('.')[0]+'.')}
     else{misses++;say(u.wrongPlace);const o=O[picked],d=O[TIDY[picked]];const hn=el('p','k-hintnl','Nee, '+o[0]+' '+o[1]+' hoort in '+d[0]+' '+d[1]+'.');hn.lang='nl';panel.appendChild(hn)}
    };
    void home;
   }
   if(t.id==='t4'){
    onTap=id=>{ctx.item=id;clearMarks('is-hot');mark(id,'is-hot');const o=O[id];ask('Gisteren heb ik '+o[0]+' '+o[1]+' gebruikt.');panel.insertBefore(tag(id),panel.children[1]||null)};
   }
   if(t.id==='t5'){
    onTap=id=>{if(id!=='kast')return;onTap=()=>{};panel.replaceChildren(pieterRow('Wat trek je aan?',u.pickOutfit));const row=el('div','k-outfits');
     OUTFIT.forEach(o=>{const b=btn('','k-outfit',()=>{ctx.outfit=o;clearMarks('is-hot');ask('Morgen ga ik met mijn '+O[o][1]+' naar school.')});const ic=host.icon?host.icon(O[o][11]):null;if(ic){ic.classList?.add('k-pic');b.appendChild(ic)}const n=el('span','',O[o][0]+' '+O[o][1]);n.lang='nl';b.appendChild(n);row.appendChild(b)});panel.appendChild(row)};
    mark('kast','is-hint');
   }
  }
  menu();
 }
 // ================= A1 version: "Kamer van Pieter & Sam" (buttons only, 7 objects, 5 tasks, 8 talks with Sam) =================
 const A1_OBJ=['bed','tafel','stoel','kast','raam','deur','lamp','laptop','kopje','schrift','rugzak'];
 const A1_KEY='leren_kamer1_v1';
 const A1T={
  uk:{title:'Kamer van Pieter & Sam',sub:'Кімната Пітера й друг Sam: слова, прості питання, діалоги',talk:'Розмова з Sam',talkS:'8 коротких діалогів: вибирай відповіді кнопками',stars:'Зірки',tapSam:'Klik op Sam om te praten.',tapSamT:'Натисни на Sam, щоб поговорити.',q:'?',showTr:'Переклад',samSays:'Sam',choose:'Обери відповідь',round:'Питання',again:'Ще раз',great:'Je kent de kamer nu.',greatT:'Тепер ти знаєш кімнату.',talkDone:'Je kunt nu goed praten met Sam!',talkDoneT:'Тепер ти добре розмовляєш із Sam!',ok:['Goed zo!','Добре!'],ok2:['Heel goed!','Дуже добре!'],no:['Probeer nog een keer.','Спробуй ще раз.'],passed:'Завдання виконано! +1 зірка',notYet:'Ще трохи практики. Спробуй знову.',talkStar:'Розмову завершено! +1 зірка',next:'Далі',list:'До списку',step:'Крок',allDone:'Усі завдання пройдено!',again2:'Пройти все ще раз',games:'До списку ігор'},
  en:{title:'Kamer van Pieter & Sam',sub:'Pieter’s room and his friend Sam: words, simple questions, dialogues',talk:'Talk to Sam',talkS:'8 short dialogues: choose your answers with buttons',stars:'Stars',tapSam:'Klik op Sam om te praten.',tapSamT:'Tap Sam to talk.',q:'?',showTr:'Translation',samSays:'Sam',choose:'Choose an answer',round:'Question',again:'Again',great:'Je kent de kamer nu.',greatT:'Now you know the room.',talkDone:'Je kunt nu goed praten met Sam!',talkDoneT:'Now you can talk well with Sam!',ok:['Goed zo!','Well done!'],ok2:['Heel goed!','Very good!'],no:['Probeer nog een keer.','Try once more.'],passed:'Task done! +1 star',notYet:'A bit more practice. Try again.',talkStar:'Dialogue finished! +1 star',next:'Next',list:'Back to the list',step:'Step',allDone:'All tasks done!',again2:'Play everything again',games:'Back to the games'},
  fr:{title:'Kamer van Pieter & Sam',sub:'La chambre de Pieter et son ami Sam : mots, questions simples, dialogues',talk:'Parler avec Sam',talkS:'8 courts dialogues : choisis tes réponses avec les boutons',stars:'Étoiles',tapSam:'Klik op Sam om te praten.',tapSamT:'Touche Sam pour parler.',q:'?',showTr:'Traduction',samSays:'Sam',choose:'Choisis une réponse',round:'Question',again:'Encore',great:'Je kent de kamer nu.',greatT:'Maintenant, tu connais la chambre.',talkDone:'Je kunt nu goed praten met Sam!',talkDoneT:'Tu parles maintenant bien avec Sam !',ok:['Goed zo!','Bien !'],ok2:['Heel goed!','Très bien !'],no:['Probeer nog een keer.','Essaie encore une fois.'],passed:'Mission réussie ! +1 étoile',notYet:'Encore un peu d’entraînement. Réessaie.',talkStar:'Dialogue terminé ! +1 étoile',next:'Suivant',list:'Retour à la liste',step:'Étape',allDone:'Toutes les missions sont faites !',again2:'Tout rejouer',games:'Retour aux jeux'},
  ar:{title:'Kamer van Pieter & Sam',sub:'غرفة بيتر وصديقه Sam: كلمات وأسئلة بسيطة وحوارات',talk:'تحدّث مع Sam',talkS:'8 حوارات قصيرة: اختر إجاباتك بالأزرار',stars:'النجوم',tapSam:'Klik op Sam om te praten.',tapSamT:'المس Sam لتتحدث معه.',q:'؟',showTr:'الترجمة',samSays:'Sam',choose:'اختر إجابة',round:'سؤال',again:'مرة أخرى',great:'Je kent de kamer nu.',greatT:'الآن تعرف الغرفة.',talkDone:'Je kunt nu goed praten met Sam!',talkDoneT:'الآن تتحدث جيداً مع Sam!',ok:['Goed zo!','أحسنت!'],ok2:['Heel goed!','جيد جداً!'],no:['Probeer nog een keer.','حاول مرة أخرى.'],passed:'أنجزت المهمة! +1 نجمة',notYet:'تدرّب قليلاً بعد. حاول مجدداً.',talkStar:'انتهى الحوار! +1 نجمة',next:'التالي',list:'العودة إلى القائمة',step:'الخطوة',allDone:'أنجزت كل المهام!',again2:'العب كل شيء مرة أخرى',games:'العودة إلى الألعاب'}
 };
 const a1tr=lang=>A1T[lang]||A1T.uk;
 // five tasks: title + instruction in four languages
 const A1_TASKS=[
  {id:'k1',nl:'Wat is dit?',ins:['Пітер показує предмет. Обери, що це.','Pieter points at an object. Choose what it is.','Pieter montre un objet. Choisis ce que c’est.','بيتر يشير إلى شيء. اختر ما هو.']},
  {id:'k2',nl:'Waar is …?',ins:['Пітер питає, де предмет. Торкнися правильного.','Pieter asks where something is. Tap the right object.','Pieter demande où est un objet. Touche le bon.','يسأل بيتر أين الشيء. المس الشيء الصحيح.']},
  {id:'k3',nl:'Ik zie …',ins:['Подивися на предмет і вибери правильне речення.','Look at the object and choose the right sentence.','Regarde l’objet et choisis la bonne phrase.','انظر إلى الشيء واختر الجملة الصحيحة.']},
  {id:'k4',nl:'Kleur',ins:['Який колір має предмет? Вибери слово.','What colour is the object? Choose the word.','Quelle est la couleur de l’objet ? Choisis le mot.','ما لون الشيء؟ اختر الكلمة.']},
  {id:'k5',nl:'Maak de zin',ins:['Доповни речення: Dit / Daar / Hier is een …','Complete the sentence: Dit / Daar / Hier is een …','Complète la phrase : Dit / Daar / Hier is een …','أكمل الجملة: Dit / Daar / Hier is een …']}
 ];
 const COLOR={tafel:['bruin',['bruin','wit','zwart','blauw']],stoel:['rood',['rood','groen','zwart','geel']],bed:['blauw',['blauw','geel','wit','rood']]};
 const COLOR_T={bruin:['коричневий','brown','marron','بني'],wit:['білий','white','blanc','أبيض'],zwart:['чорний','black','noir','أسود'],blauw:['синій','blue','bleu','أزرق'],rood:['червоний','red','rouge','أحمر'],groen:['зелений','green','vert','أخضر'],geel:['жовтий','yellow','jaune','أصفر']};
 // dialogues with Sam: [sam nl, [uk,en,fr,ar], options [[nl, ok, [uk,en,fr,ar]]...], reaction nl, [uk,en,fr,ar], highlighted object or '']
 const TALKS=[
  ['Hoi! Ik ben Sam. En jij?',['Привіт! Я Сем. А ти?','Hi! I am Sam. And you?','Salut ! Je suis Sam. Et toi ?','مرحباً! أنا Sam. وأنت؟'],[['Hoi Sam! Ik ben Anna.',1,['Привіт, Сем! Я Анна.','Hi Sam! I am Anna.','Salut Sam ! Je suis Anna.','مرحباً Sam! أنا Anna.']],['Hallo! Ik heet Danylo.',1,['Привіт! Мене звати Данило.','Hello! My name is Danylo.','Bonjour ! Je m’appelle Danylo.','مرحباً! اسمي Danylo.']],['Goedemorgen, ik ben Olena.',1,['Доброго ранку, я Олена.','Good morning, I am Olena.','Bonjour, je suis Olena.','صباح الخير، أنا Olena.']]],'Leuk je te ontmoeten!',['Приємно познайомитися!','Nice to meet you!','Ravi de te rencontrer !','سررت بلقائك!'],''],
  ['Dit is de kamer van Pieter. Mooi, hè?',['Це кімната Пітера. Гарна, правда?','This is Pieter’s room. Nice, isn’t it?','C’est la chambre de Pieter. Belle, non ?','هذه غرفة بيتر. جميلة، أليس كذلك؟'],[['Ja, heel mooi!',1,['Так, дуже гарна!','Yes, very nice!','Oui, très belle !','نعم، جميلة جداً!']],['Ja, leuk!',1,['Так, гарно!','Yes, nice!','Oui, sympa !','نعم، لطيفة!']],['Ja, ik vind het fijn.',1,['Так, мені подобається.','Yes, I like it.','Oui, je l’aime bien.','نعم، تعجبني.']]],'Ik vind het ook fijn.',['Мені теж подобається.','I like it too.','Moi aussi, je l’aime bien.','وأنا أيضاً تعجبني.'],''],
  ['Wat is dat?',['Що це?','What is that?','Qu’est-ce que c’est ?','ما هذا؟'],[['Dat is een bed.',1,['Це ліжко.','That is a bed.','C’est un lit.','هذا سرير.']],['Een bed.',1,['Ліжко.','A bed.','Un lit.','سرير.']],['Dat is het bed.',1,['Це те ліжко.','That is the bed.','C’est le lit.','هذا هو السرير.']]],'Juist! Goed zo.',['Правильно! Добре.','Right! Well done.','Exact ! Bien.','صحيح! أحسنت.'],'bed'],
  ['Hoe gaat het?',['Як справи?','How are you?','Comment ça va ?','كيف حالك؟'],[['Goed, dank je!',1,['Добре, дякую!','Good, thank you!','Bien, merci !','بخير، شكراً!']],['Prima!',1,['Чудово!','Great!','Très bien !','ممتاز!']],['Een beetje moe.',1,['Трохи втомлений.','A little tired.','Un peu fatigué.','متعب قليلاً.']]],'Oké, fijn.',['Гаразд, добре.','Okay, good.','D’accord, tant mieux.','حسناً، جيد.'],''],
  ['Woon jij hier in België?',['Ти живеш тут, у Бельгії?','Do you live here in Belgium?','Tu habites ici, en Belgique ?','هل تسكن هنا في بلجيكا؟'],[['Ja, ik woon hier.',1,['Так, я живу тут.','Yes, I live here.','Oui, j’habite ici.','نعم، أسكن هنا.']],['Ja, in Antwerpen.',1,['Так, в Антверпені.','Yes, in Antwerp.','Oui, à Anvers.','نعم، في أنتويرب.']],['Nee, ik woon in Gent.',1,['Ні, я живу в Генті.','No, I live in Ghent.','Non, j’habite à Gand.','لا، أسكن في خنت.']]],'Ah, oké!',['А, зрозуміло!','Ah, okay!','Ah, d’accord !','آه، حسناً!'],''],
  ['Wat zie je in de kamer?',['Що ти бачиш у кімнаті?','What do you see in the room?','Que vois-tu dans la chambre ?','ماذا ترى في الغرفة؟'],[['Ik zie een bed en een tafel.',1,['Я бачу ліжко й стіл.','I see a bed and a table.','Je vois un lit et une table.','أرى سريراً وطاولة.']],['Een stoel en een kast.',1,['Стілець і шафу.','A chair and a wardrobe.','Une chaise et une armoire.','كرسياً وخزانة.']],['Ik zie een raam.',1,['Я бачу вікно.','I see a window.','Je vois une fenêtre.','أرى نافذة.']]],'Goed!',['Добре!','Good!','Bien !','جيد!'],''],
  ['Is dit een stoel?',['Це стілець?','Is this a chair?','C’est une chaise ?','هل هذا كرسي؟'],[['Ja, dat is een stoel.',1,['Так, це стілець.','Yes, that is a chair.','Oui, c’est une chaise.','نعم، هذا كرسي.']],['Nee, dat is een tafel.',0,['Ні, це стіл.','No, that is a table.','Non, c’est une table.','لا، هذه طاولة.']],['Ja!',1,['Так!','Yes!','Oui !','نعم!']]],'Juist!',['Правильно!','Right!','Exact !','صحيح!'],'stoel'],
  ['Oké, tot later!',['Гаразд, до зустрічі!','Okay, see you later!','D’accord, à tout à l’heure !','حسناً، إلى اللقاء لاحقاً!'],[['Tot later, Sam!',1,['До зустрічі, Сем!','See you later, Sam!','À tout à l’heure, Sam !','إلى اللقاء، Sam!']],['Dag!',1,['Бувай!','Bye!','Salut !','وداعاً!']],['Doei!',1,['Па-па!','Bye!','Salut !','باي!']],['Tot ziens!',1,['До побачення!','Goodbye!','Au revoir !','إلى اللقاء!']]],'Doei!',['Па-па!','Bye!','Salut !','باي!'],'']
 ];
 const shuffle=a=>{const r=[...a];for(let i=r.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[r[i],r[j]]=[r[j],r[i]]}return r};
 const pickN=(arr,n,not)=>shuffle(arr.filter(x=>x!==not)).slice(0,n);
 function loadA1(){try{const v=JSON.parse(localStorage.getItem(A1_KEY)||'{}');return {tasks:v.tasks&&typeof v.tasks==='object'?v.tasks:{},talks:v.talks&&typeof v.talks==='object'?v.talks:{},at:Number.isInteger(v.at)&&v.at>=0?v.at:0}}catch{return {tasks:{},talks:{},at:0}}}
 function saveA1(v){try{localStorage.setItem(A1_KEY,JSON.stringify(v))}catch{}}
 function buildSam(host){
  const g=el('div','k-obj k-sam');g.dataset.item='sam';g.style.transform='translate3d(96px,85px,34px) rotateY(-28deg)';
  const inner=el('div','k-sam-in');inner.style.transformStyle='preserve-3d';
  [box(7,22,8,'#2c3e50',-5,-11,0),box(7,22,8,'#2c3e50',5,-11,0),box(18,22,10,'#4a90e2',0,-33,0),box(5,20,6,'#f1c27d',-12,-33,0),box(5,20,6,'#f1c27d',12,-33,0),
   box(15,15,15,'#f1c27d',0,-52,0),box(16,5,16,'#5b3a1e',0,-61,0),box(3,3,1,'#222',-3.5,-53,8),box(3,3,1,'#222',3.5,-53,8),box(6,1,1,'#b5523b',0,-47,8)].forEach(b=>inner.appendChild(b));
  const bub=el('div','k-bb k-chat');bub.style.width=22*HI+'px';bub.style.height=22*HI+'px';bub.style.marginLeft=-11*HI+'px';bub.style.marginTop=(-93-11*HI)+'px';const ic=host.icon?host.icon('💬'):null;if(ic){ic.classList?.add('k-pic');bub.appendChild(ic)}else bub.textContent='💬';
  g.append(inner,bub);g.tabIndex=0;g.setAttribute('role','button');g.setAttribute('aria-label','Sam');return g;
 }
 function startA1(host){
  host=quiet(host);const lang=host.lang(),u=tr(lang),a=a1tr(lang),dir=lang==='ar'?'rtl':'ltr';let st=loadA1();
  const stars10=()=>Math.min(10,Object.keys(st.tasks).length+Object.keys(st.talks).length);
  const award=(kind,id)=>{if(st[kind][id])return false;st[kind][id]=1;saveA1(st);host.done(3);return true};
  const pieterRow=(nl,locText)=>{const row=el('div','k-pieter');const img=el('img','k-avatar');img.src='./img/chars/peter.webp';img.alt=u.pieter;img.width=44;img.height=44;const bub=el('div','k-bubble');const n=el('strong','k-nl',nl);n.lang='nl';n.dir='ltr';bub.appendChild(n);if(locText)bub.appendChild(el('span','k-loc',locText));row.append(img,bub);return row};
  const samRow=(nl,locArr)=>{const row=el('div','k-pieter k-samrow');const av=el('div','k-avatar k-sam-av','S');const bub=el('div','k-bubble');const n=el('strong','k-nl',nl);n.lang='nl';n.dir='ltr';bub.appendChild(n);const tr=el('span','k-loc',tl(locArr,lang));tr.hidden=true;const q=btn(a.q,'k-q',()=>{tr.hidden=!tr.hidden;q.setAttribute('aria-pressed',String(!tr.hidden))});q.setAttribute('aria-label',a.showTr);q.setAttribute('aria-pressed','false');bub.append(tr);row.append(av,bub,q);return row};
  // One route, no menu: the five tasks, then the eight talks with Sam. The place is saved, so the game goes on
  // where the learner stopped; a task that was not passed keeps its empty star and comes back on the next round.
  const STEPS=[...A1_TASKS.map((_,i)=>['task',i]),...TALKS.map((_,i)=>['talk',i])];
  function go(i){
   if(i>=STEPS.length){st.at=0;saveA1(st);finale();return}
   st.at=i;saveA1(st);host.bar(i/STEPS.length);const [kind,j]=STEPS[i];if(kind==='task')task(j);else talk(j);
  }
  const nextStep=i=>()=>go(i+1);
  function finale(){
   closeStage();const card=host.head(a.title,a.sub);host.bar(1);const box=el('section','k k-menu k-finale');box.dir=dir;
   const s=stars10();box.appendChild(el('p','k-stars k-total',a.stars+': '+'★'.repeat(s)+'☆'.repeat(10-s)+'  '+s+' / 10'));
   box.appendChild(pieterRow(a.great,a.allDone));
   const row=el('div','row');row.append(btn(a.games,'btn',()=>host.home()),btn(a.again2,'btn primary',()=>go(0)));box.appendChild(row);card.appendChild(box);
  }
  const menu=()=>host.home();
  function mount(titleText,titleNl){
   const card=host.head(a.title,a.sub);
   const S=stage(host,{card,lang,dir,title:titleText,titleNl,sub:a.title,room:buildRoom(host,{keep:new Set(A1_OBJ),sam:true}),onMenu:menu,yaw:-22});
   const {panel,room}=S;
   const items=()=>[...room.querySelectorAll('[data-item]')];
   const mark=(id,cls,on=true)=>items().forEach(n=>{if(n.dataset.item===id)n.classList.toggle(cls,on)});const clearMarks=cls=>items().forEach(n=>n.classList.remove(cls));
   const api={panel,mark,clearMarks,onTap:()=>{},room,stage:S};
   S.onTap=id=>{if(id!=='sam'&&O[id])host.say(O[id][0]+' '+O[id][1]);api.onTap(id)};
   return api;
  }
  const word=id=>O[id][0]+' '+O[id][1];
  // ---- tasks ----
  function task(ti){
   const t=A1_TASKS[ti],m=mount((ti+1)+'. '+t.nl,true),p=m.panel,S=m.stage;let round=0,right=0;const N=3;const objs=shuffle(A1_OBJ);
   const hud=()=>{S.progress(a.round+' '+Math.min(round+1,N)+' / '+N);S.score('✓ '+right)};const gotIt=()=>{right++;hud();S.bump()};
   const choices=(opts,onPick)=>{const row=el('div','k-choices');shuffle(opts).forEach(([label,ok,tr],i)=>{const b=btn('','k-choice');b.dataset.ok=ok?'1':'0';const key=el('span','k-key','ABCD'[i]);key.setAttribute('aria-hidden','true');b.appendChild(key);const s=el('span','k-choice-nl',label);s.lang='nl';s.dir='ltr';b.appendChild(s);if(tr)b.appendChild(el('small','',tr));b.onclick=()=>{if(row.dataset.done)return;onPick(ok,b,row)};row.appendChild(b)});return row};
   // right: green and the Dutch answer is spoken; wrong: soft red and the right answer is shown (one try per question, as before)
   const feedback=(ok,b,row,after)=>{row.dataset.done='1';row.classList.add('is-done');[...row.children].forEach(c=>c.disabled=true);b.classList.add(ok?'is-right':'is-wrong');
    const good=row.querySelector('[data-ok="1"]');if(!ok&&good)good.classList.add('is-answer');
    const r=ok?(round%2?a.ok2:a.ok):a.no;const msg=el('div','k-react '+(ok?'is-ok':'is-no'));msg.append(pieterRow(r[0],r[1]));p.appendChild(msg);msg.scrollIntoView?.({block:'nearest',behavior:'smooth'});if(ok)gotIt();
    host.say((good&&good.querySelector('.k-choice-nl')?.textContent)||r[0]);setTimeout(after,ok?1100:1700)};
   const finish=()=>{p.replaceChildren();const passed=right>=2;if(passed)award('tasks',t.id);const box=el('div','k-result');box.append(el('div','k-bigstars',passed?'★':'☆'),pieterRow(passed?a.ok2[0]:a.no[0],passed?a.passed:a.notYet));
    const row=el('div','row');row.append(btn(a.again,'btn',()=>task(ti)),btn(a.next,'btn primary',nextStep(ti)));box.appendChild(row);p.appendChild(box);host.bar((ti+1)/STEPS.length)};
   const next=()=>{round++;if(round>=N)finish();else ask()};
   const target=()=>objs[round%objs.length];
   function ask(){
    p.replaceChildren();m.clearMarks('is-hot');m.clearMarks('is-hint');m.onTap=()=>{};const obj=target(),o=O[obj];
    hud();
    if(t.id==='k1'){m.mark(obj,'is-hint');p.appendChild(pieterRow('Wat is dit?',tl(['Що це? (предмет світиться)','What is this? (the object is glowing)','Qu’est-ce que c’est ? (l’objet brille)','ما هذا؟ (الشيء يتوهج)'],lang)));
     const wrong=pickN(A1_OBJ,2,obj);p.appendChild(choices([['Dit is een '+o[1]+'.',1],...wrong.map(w=>['Dit is een '+O[w][1]+'.',0])],(ok,b,row)=>feedback(ok,b,row,next)))}
    else if(t.id==='k2'){p.appendChild(pieterRow('Waar is '+word(obj)+'?',tl(['Де '+L(o,'uk')+'? Торкнися предмета в кімнаті.','Where is the '+L(o,'en')+'? Tap it in the room.','Où est « '+L(o,'fr')+' » ? Touche-le dans la chambre.','أين '+L(o,'ar')+'؟ المسه في الغرفة.'],lang)));
     m.onTap=id=>{if(id==='sam'||!O[id])return;p.querySelector('.k-react')?.remove();const ok=id===obj;m.mark(id,ok?'is-hot':'is-bad',true);const r=ok?(round%2?a.ok2:a.ok):a.no;const msg=el('div','k-react');msg.append(pieterRow(r[0],r[1]));p.appendChild(msg);host.say(r[0]);if(ok){gotIt();m.onTap=()=>{};setTimeout(next,900)}else setTimeout(()=>m.mark(id,'is-bad',false),900)}}
    else if(t.id==='k3'){m.mark(obj,'is-hint');p.appendChild(pieterRow('Wat zie je?',tl(['Що ти бачиш? Вибери речення.','What do you see? Choose the sentence.','Que vois-tu ? Choisis la phrase.','ماذا ترى؟ اختر الجملة.'],lang)));
     const wrong=pickN(A1_OBJ,2,obj);p.appendChild(choices([['Ik zie een '+o[1]+'.',1],...wrong.map(w=>['Ik zie een '+O[w][1]+'.',0])],(ok,b,row)=>feedback(ok,b,row,next)))}
    else if(t.id==='k4'){const keys=Object.keys(COLOR),cobj=keys[round%keys.length],c=COLOR[cobj],co=O[cobj];m.mark(cobj,'is-hint');
     p.appendChild(pieterRow('Welke kleur heeft '+word(cobj)+'?',tl(['Який колір має '+L(co,'uk')+'?','What colour is the '+L(co,'en')+'?','De quelle couleur est « '+L(co,'fr')+' » ?','ما لون '+L(co,'ar')+'؟'],lang)));
     p.appendChild(choices(c[1].map(w=>[w,w===c[0]?1:0,tl(COLOR_T[w],lang)]),(ok,b,row)=>feedback(ok,b,row,next)))}
    else{const frames=[['Dit','dichtbij','close'],['Daar','ver weg','far'],['Hier','dichtbij','close']],fr=frames[round%3];m.mark(obj,'is-hint');
     p.appendChild(pieterRow(fr[0]+' is een …',tl(['Доповни речення: '+fr[0]+' is een …','Complete the sentence: '+fr[0]+' is een …','Complète la phrase : '+fr[0]+' is een …','أكمل الجملة: '+fr[0]+' is een …'],lang)));
     const wrong=pickN(A1_OBJ,2,obj);p.appendChild(choices([[o[1],1,L(o,lang)],...wrong.map(w=>[O[w][1],0,L(O[w],lang)])],(ok,b,row)=>feedback(ok,b,row,next)))}
   }
   ask();
  }
  // ---- talks with Sam ----
  function talk(startAt){
   const ti=startAt;
   const d=TALKS[ti];const m=mount(a.talk+' · '+(ti+1)+' / '+TALKS.length);const p=m.panel;m.stage.progress(ht(lang).talk+' '+(ti+1)+' / '+TALKS.length);m.stage.score('★ '+stars10()+' / 10');m.room.querySelector('[data-item="sam"]').classList.add('talking');
   m.onTap=()=>{};if(d[5])m.mark(d[5],'is-hint');
   p.appendChild(samRow(d[0],d[1]));host.say(d[0]);
   const row=el('div','k-choices');p.appendChild(el('p','k-count',a.choose));
   shuffle(d[2]).forEach(([nl,ok,loc])=>{const b=btn('','k-choice');const s=el('span','k-choice-nl',nl);s.lang='nl';s.dir='ltr';b.append(s,el('small','',tl(loc,lang)));
    b.onclick=()=>{if(row.dataset.done)return;if(!ok){b.classList.add('is-wrong');b.disabled=true;p.querySelector('.k-react')?.remove();const msg=el('div','k-react');msg.appendChild(pieterRow(a.no[0],a.no[1]));p.appendChild(msg);host.say(a.no[0]);return}
     row.dataset.done='1';[...row.children].forEach(c=>c.disabled=true);b.classList.add('is-right');host.say(nl);
     p.querySelector('.k-react')?.remove();const msg=el('div','k-react');msg.appendChild(samRow(d[3],d[4]));p.appendChild(msg);const got=award('talks','d'+(ti+1));
     const done=el('div','k-result');if(got)done.appendChild(el('p','k-msg2 ok',a.talkStar));
     const all=Object.keys(st.talks).length>=5&&stars10()>=8;if(all)done.appendChild(pieterRow(a.talkDone,a.talkDoneT));
     const r2=el('div','row');r2.append(btn(a.next,'btn primary',nextStep(A1_TASKS.length+ti)));done.appendChild(r2);p.appendChild(done);host.bar((A1_TASKS.length+ti+1)/STEPS.length);m.stage.score('★ '+stars10()+' / 10');if(got)m.stage.bump()};
    row.appendChild(b)});
   p.appendChild(row);
  }
  go(st.at<STEPS.length?st.at:0);
 }

 globalThis.LerenKamer={start,startA1,A1T:a1tr,grade,tr,T,O,TASKS,KEY,A1_OBJ,A1_TASKS,TALKS,A1_KEY};
})();
