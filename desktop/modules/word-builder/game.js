/* "Spell the word": look at the picture and build the Dutch word from letter tiles. Offline, no AI. */
(() => {
 'use strict';
 // [word, article, plural or '', uk, en, fr, ar]
 const WORDS=[
  ['appel','de','appels','яблуко','apple','pomme','تفاحة'],['banaan','de','bananen','банан','banana','banane','موزة'],['brood','het','broden','хліб','bread','pain','خبز'],
  ['kaas','de','kazen','сир','cheese','fromage','جبن'],['melk','de','','молоко','milk','lait','حليب'],['koffie','de','','кава','coffee','café','قهوة'],
  ['ei','het','eieren','яйце','egg','œuf','بيضة'],['tomaat','de','tomaten','помідор','tomato','tomate','طماطم'],['vis','de','vissen','риба','fish','poisson','سمكة'],
  ['taart','de','taarten','торт','cake','gâteau','كعكة'],['water','het','','вода','water','eau','ماء'],
  ['huis','het','huizen','будинок','house','maison','بيت'],['deur','de','deuren','двері','door','porte','باب'],['raam','het','ramen','вікно','window','fenêtre','نافذة'],
  ['stoel','de','stoelen','стілець','chair','chaise','كرسي'],['tafel','de','tafels','стіл','table','table','طاولة'],['bed','het','bedden','ліжко','bed','lit','سرير'],
  ['lamp','de','lampen','лампа','lamp','lampe','مصباح'],['sleutel','de','sleutels','ключ','key','clé','مفتاح'],
  ['auto','de',"auto's",'автомобіль','car','voiture','سيارة'],['fiets','de','fietsen','велосипед','bicycle','vélo','دراجة'],['bus','de','bussen','автобус','bus','bus','حافلة'],
  ['trein','de','treinen','потяг','train','train','قطار'],
  ['hond','de','honden','собака','dog','chien','كلب'],['kat','de','katten','кіт','cat','chat','قطة'],['vogel','de','vogels','птах','bird','oiseau','طائر'],
  ['jas','de','jassen','куртка','coat','manteau','معطف'],['schoen','de','schoenen','черевик','shoe','chaussure','حذاء'],['bril','de','brillen','окуляри','glasses','lunettes','نظارة'],
  ['tas','de','tassen','сумка','bag','sac','حقيبة'],['paraplu','de',"paraplu's",'парасолька','umbrella','parapluie','مظلة'],
  ['chauffeur','de','chauffeurs','водій','driver','chauffeur','سائق'],['dokter','de','dokters','лікар','doctor','médecin','طبيب'],
  ['zon','de','','сонце','sun','soleil','شمس'],['regen','de','','дощ','rain','pluie','مطر'],['boom','de','bomen','дерево','tree','arbre','شجرة'],['bloem','de','bloemen','квітка','flower','fleur','زهرة'],
  ['boek','het','boeken','книга','book','livre','كتاب'],['pen','de','pennen','ручка','pen','stylo','قلم'],['klok','de','klokken','годинник','clock','horloge','ساعة'],
  ['telefoon','de','telefoons','телефон','phone','téléphone','هاتف'],['brief','de','brieven','лист','letter','lettre','رسالة']
 ];
 // More everyday A1 nouns. Existing word keys and per-word progress are retained.
 WORDS.push(
  ['peer','de','peren','груша','pear','poire','كمثرى'],
  ['wortel','de','wortels','морква','carrot','carotte','جزرة'],
  ['aardappel','de','aardappelen','картоплина','potato','pomme de terre','حبة بطاطس'],
  ['soep','de','soepen','суп','soup','soupe','حساء'],
  ['bord','het','borden','тарілка','plate','assiette','طبق'],
  ['kom','de','kommen','миска','bowl','bol','وعاء'],
  ['lepel','de','lepels','ложка','spoon','cuillère','ملعقة'],
  ['vork','de','vorken','виделка','fork','fourchette','شوكة'],
  ['mes','het','messen','ніж','knife','couteau','سكين'],
  ['potlood','het','potloden','олівець','pencil','crayon','قلم رصاص'],
  ['broek','de','broeken','штани','trousers','pantalon','بنطال'],
  ['trui','de','truien','светр','sweater','pull','سترة صوفية']
 );
 const LANGS=['uk','en','fr','ar'];
 const T={
  uk:{title:'Склади слово',sub:'Подивись на малюнок і склади нідерландське слово з букв',ask:'Як це нідерландською?',hint:'💡 Підказка',hintWord:'Переклад',hintLetter:'💡 Ще одна буква',erase:'Стерти букву',clear:'Очистити',wrong:'Майже! Червоні букви стоять не на місці — стери їх і спробуй ще раз.',show:'Показати відповідь',right:'Правильно!',shown:'Запам’ятай це слово',plural:'Множина',next:'Далі →',listen:'🔊 Послухати',done:'Готово!',score:'з першої спроби',again:'Ще раз',other:'Інші ігри',words:'Слова цього раунду',slots:'Твоє слово',letters:'Букви',of:'з',keys:'Можна набирати букви на клавіатурі.'},
  en:{title:'Spell it',sub:'Look at the picture and build the Dutch word from letters',ask:'What is this in Dutch?',hint:'💡 Hint',hintWord:'Translation',hintLetter:'💡 One more letter',erase:'Delete letter',clear:'Clear',wrong:'Almost! The red letters are in the wrong place — delete them and try again.',show:'Show the answer',right:'Correct!',shown:'Remember this word',plural:'Plural',next:'Next →',listen:'🔊 Listen',done:'Done!',score:'right first time',again:'Again',other:'Other games',words:'Words in this round',slots:'Your word',letters:'Letters',of:'of',keys:'You can also type on the keyboard.'},
  fr:{title:'Épelle le mot',sub:'Regarde l’image et forme le mot néerlandais avec les lettres',ask:'Comment dit-on en néerlandais ?',hint:'💡 Indice',hintWord:'Traduction',hintLetter:'💡 Encore une lettre',erase:'Effacer la lettre',clear:'Tout effacer',wrong:'Presque ! Les lettres rouges ne sont pas à leur place — efface-les et réessaie.',show:'Voir la réponse',right:'Correct !',shown:'Retiens ce mot',plural:'Pluriel',next:'Suivant →',listen:'🔊 Écouter',done:'Terminé !',score:'du premier coup',again:'Encore',other:'Autres jeux',words:'Mots de ce tour',slots:'Ton mot',letters:'Lettres',of:'sur',keys:'Tu peux aussi taper au clavier.'},
  ar:{title:'كوّن الكلمة',sub:'انظر إلى الصورة وكوّن الكلمة الهولندية من الحروف',ask:'ما اسمه بالهولندية؟',hint:'💡 تلميح',hintWord:'الترجمة',hintLetter:'💡 حرف آخر',erase:'احذف الحرف',clear:'امسح الكل',wrong:'اقتربت! الحروف الحمراء في غير مكانها — احذفها وحاول مجدداً.',show:'أظهر الإجابة',right:'صحيح!',shown:'احفظ هذه الكلمة',plural:'الجمع',next:'التالي ←',listen:'🔊 استمع',done:'انتهى!',score:'من المحاولة الأولى',again:'مرة أخرى',other:'ألعاب أخرى',words:'كلمات هذه الجولة',slots:'كلمتك',letters:'الحروف',of:'من',keys:'يمكنك الكتابة بلوحة المفاتيح أيضاً.'}
 };
 const KEY='leren_wb_v1',ROUND=10;
 const tr=lang=>T[lang]||T.uk;
 const meaning=(w,lang)=>w[3+Math.max(0,LANGS.indexOf(lang))];
 function load(){try{const v=JSON.parse(localStorage.getItem(KEY)||'{}');return v&&typeof v==='object'&&!Array.isArray(v)?v:{}}catch{return {}}}
 function save(v){try{localStorage.setItem(KEY,JSON.stringify(v))}catch{}}
 const shuffle=a=>{const r=[...a];for(let i=r.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[r[i],r[j]]=[r[j],r[i]]}return r};
 // Unseen and weak words first, then the rest; never the same word twice in a round.
 function pick(n){const st=load(),score=w=>{const s=st[w[0]];return s?s.ok*2-s.miss:-5};return shuffle(WORDS).sort((a,b)=>score(a)-score(b)).slice(0,n)}
 function tiles(word){let t;do{t=shuffle([...word].map((ch,i)=>({ch,i})))}while(word.length>2&&t.map(x=>x.ch).join('')===word);return t}

 function start(host){
  const lang=host.lang(),u=tr(lang),list=pick(ROUND);let i=0,firstTry=0,xp=0;const results=[];
  const node=(tag,cls,text)=>{const e=document.createElement(tag);if(cls)e.className=cls;if(text!=null)e.textContent=text;return e};
  const btn=(text,cls,fn)=>{const b=node('button',cls,text);b.type='button';b.onclick=fn;return b};
  let keyHandler=null;const unbind=()=>{if(keyHandler){document.removeEventListener('keydown',keyHandler);keyHandler=null}};
  function round(){
   unbind();const w=list[i],word=w[0],card=host.head(u.title,u.sub);host.bar(i/list.length);card.classList.add('wb-host');
   const st={placed:[],pool:tiles(word),wrong:0,hints:0,shownHint:false,solved:false,gaveUp:false,bad:new Set()};
   const box=node('section','wb');box.dir=lang==='ar'?'rtl':'ltr';
   const top=node('div','wb-top');top.append(node('span','wb-count',(i+1)+' / '+list.length),node('span','wb-xp','+'+xp+' XP'));
   const pic=node('figure','wb-pic');pic.append(node('figcaption','',u.ask));const art=node('div','wb-art');art.innerHTML=globalThis.LerenWordArt?LerenWordArt.svg(word,meaning(w,lang)):'';pic.appendChild(art);
   const hintLine=node('p','wb-hint-line');
   const slots=node('div','wb-slots');slots.dir='ltr';slots.lang='nl';slots.setAttribute('role','group');slots.setAttribute('aria-label',u.slots);
   const live=node('p','wb-live');live.setAttribute('aria-live','polite');
   const pool=node('div','wb-pool');pool.dir='ltr';pool.setAttribute('role','group');pool.setAttribute('aria-label',u.letters);
   const tools=node('div','wb-tools'),after=node('div','wb-after');
   box.append(top,pic,hintLine,slots,live,pool,tools,after,node('p','wb-keys',u.keys));card.appendChild(box);
   const fill=()=>{
    slots.replaceChildren();
    for(let k=0;k<word.length;k++){const t=st.placed[k],s=btn(t?t.ch:'','wb-slot'+(t?' is-filled':'')+(st.bad.has(k)?' is-bad':'')+(st.solved?' is-ok':''),()=>{if(st.solved||!t)return;removeFrom(k)});s.disabled=!t||st.solved;s.setAttribute('aria-label',t?t.ch:'_');slots.appendChild(s)}
    pool.replaceChildren();
    for(const t of st.pool){const used=st.placed.includes(t),b=btn(t.ch,'wb-tile',()=>place(t));b.disabled=used||st.solved;b.setAttribute('aria-label',t.ch);if(used)b.classList.add('is-used');pool.appendChild(b)}
    tools.replaceChildren();
    if(!st.solved){
     const er=btn('⌫','wb-erase',()=>removeFrom(st.placed.length-1));er.setAttribute('aria-label',u.erase);er.disabled=!st.placed.length;
     const hint=btn(st.shownHint?u.hintLetter:u.hint,'btn wb-hint',giveHint);
     tools.append(hint,er);
     if(st.wrong>=2)tools.appendChild(btn(u.show,'btn',reveal));
    }
   };
   const removeFrom=k=>{if(k<0||st.solved)return;st.placed=st.placed.slice(0,k);st.bad=new Set([...st.bad].filter(x=>x<k));fill()};
   const place=t=>{if(st.solved||st.placed.includes(t)||st.placed.length>=word.length)return;st.placed.push(t);fill();if(st.placed.length===word.length)check()};
   function giveHint(){
    if(st.solved)return;st.hints++;
    if(!st.shownHint){st.shownHint=true;hintLine.textContent=u.hintWord+': '+meaning(w,lang);fill();return}
    // next correct letter: keep the correct prefix, then add the right tile
    let k=0;while(k<st.placed.length&&st.placed[k].ch===word[k])k++;st.placed=st.placed.slice(0,k);st.bad.clear();
    const t=st.pool.find(x=>x.ch===word[k]&&!st.placed.includes(x));if(t){st.placed.push(t)}fill();if(st.placed.length===word.length)check();
   }
   function check(){
    const got=st.placed.map(x=>x.ch).join('');
    if(got===word){finish(false);return}
    st.wrong++;st.bad=new Set();for(let k=0;k<word.length;k++)if(got[k]!==word[k])st.bad.add(k);
    live.textContent=u.wrong;slots.classList.remove('wb-shake');void slots.offsetWidth;slots.classList.add('wb-shake');fill();
   }
   function reveal(){finish(true)}
   function finish(gaveUp){
    st.solved=true;st.bad.clear();const clean=!gaveUp&&!st.wrong&&!st.hints;if(clean)firstTry++;
    const gain=gaveUp?0:Math.max(3,10-st.hints*3-st.wrong*2);xp+=gain;
    const rec=load(),r=rec[word]||{ok:0,miss:0};if(gaveUp||st.wrong)r.miss++;else r.ok++;rec[word]=r;save(rec);
    if(gaveUp||st.wrong)host.mistake(w[1]+' '+word+' — '+meaning(w,lang));
    results.push({w,ok:clean});
    if(gaveUp){st.placed=[...word].map(ch=>({ch}))}
    fill();slots.classList.add(gaveUp?'is-shown':'is-done');box.classList.add('is-solved');
    // the result replaces the used tiles, so "Next" sits right under the word without scrolling
    live.textContent='';pool.replaceChildren();
    top.lastChild.textContent='+'+xp+' XP';
    const res=node('div','wb-result '+(gaveUp?'is-shown':'is-ok'));
    const head=node('p','wb-res-word');const art2=node('span','wb-art-de',w[1]+' ');const wd=node('strong','',word);wd.lang='nl';head.lang='nl';head.dir='ltr';head.append(art2,wd);
    res.append(node('strong','wb-res-title',gaveUp?u.shown:u.right+(gain?'  +'+gain+' XP':'')),head,node('p','wb-res-tr',meaning(w,lang)));
    if(w[2]){const pl=node('p','wb-res-pl');const b=node('b','',u.plural+': ');const v=node('span','','de '+w[2]);v.lang='nl';pl.append(b,v);res.appendChild(pl)}
    const row=node('div','row');row.append(btn(u.listen,'btn',()=>host.say(w[1]+' '+word)),btn(u.next,'btn primary',()=>{i++;if(i<list.length)round();else end()}));res.appendChild(row);
    after.replaceChildren(res);host.say(w[1]+' '+word);setTimeout(()=>{row.lastChild.focus({preventScroll:true});res.scrollIntoView({block:'nearest',behavior:'smooth'})},30);
   }
   keyHandler=e=>{if(!box.isConnected){unbind();return}if(e.ctrlKey||e.metaKey||e.altKey||/^(INPUT|TEXTAREA|SELECT)$/.test(e.target?.tagName||'')||e.target?.isContentEditable)return;
    if(st.solved){if(e.key==='Enter'&&document.activeElement?.tagName!=='BUTTON'){e.preventDefault();after.querySelector('.btn.primary')?.click()}return}
    if(e.key==='Backspace'){e.preventDefault();removeFrom(st.placed.length-1);return}
    if(e.key&&e.key.length===1){const ch=e.key.toLowerCase(),t=st.pool.find(x=>x.ch===ch&&!st.placed.includes(x));if(t){e.preventDefault();place(t)}}};
   document.addEventListener('keydown',keyHandler);
   fill();
  }
  function end(){
   unbind();const card=host.head(u.title,u.sub);host.bar(1);card.classList.add('wb-host');const box=node('section','wb wb-end');box.dir=lang==='ar'?'rtl':'ltr';
   box.append(node('h2','',u.done),node('p','wb-big',firstTry+' '+u.of+' '+list.length),node('p','',u.score),node('p','wb-xp','+'+xp+' XP'),node('h3','',u.words));
   const ul=node('ul','wb-list');for(const r of results){const li=node('li',r.ok?'is-ok':'is-miss');const mini=node('span','wb-mini');mini.innerHTML=globalThis.LerenWordArt?LerenWordArt.svg(r.w[0]):'';const txt=node('span','wb-li-txt');const nl=node('strong','',r.w[1]+' '+r.w[0]);nl.lang='nl';txt.append(nl,node('small','',meaning(r.w,lang)));const say=btn('🔊','wb-say',()=>host.say(r.w[1]+' '+r.w[0]));say.setAttribute('aria-label',u.listen+' · '+r.w[0]);li.append(mini,txt,say);ul.appendChild(li)}
   box.appendChild(ul);const row=node('div','row');row.append(btn(u.again,'btn primary',()=>start(host)),btn(u.other,'btn',host.home));box.appendChild(row);card.appendChild(box);
   host.done(xp);
  }
  round();
 }
 globalThis.LerenWordBuilder={start,WORDS,tr,KEY};
})();
