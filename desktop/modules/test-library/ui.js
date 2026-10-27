/* Illustrated test library. Existing test IDs and best results remain authoritative. */
(function(root){
'use strict';
const COPY={
 uk:{title:'Перевір свої знання',intro:'Обери частину курсу. Усередині — спільна перевірка та тести окремих тем.',first:'Знайомство та перші розмови',second:'Нідерландська щодня',firstHint:'Знайомство, люди, числа, час, день народження та години роботи.',secondHint:'Анкети, мій день, запрошення, здоров’я, їжа та покупки.',advanced1:'Досвід і життя навколо',advanced2:'Спілкування в різних ситуаціях',advancedHint:'Перевір теми цієї частини курсу.',range:(a,b)=>'Теми '+a+'–'+b,open:'Відкрити блок',back:'Усі блоки тестів',topics:'Перевірити окрему тему',combined:'Спільний тест блоку',combinedHint:'По 3 питання з кожної теми. Без повторення всіх тестів підряд.',done:(n,total)=>'Складено тем: '+n+' з '+total,best:'Найкраще',questions:n=>n+' питань',passed:'Складено',start:'Почати',exam:'Підготовка до іспиту',examHint:'A1.1 · теми 8–11 · читання, слухання, письмо та говоріння',extra:'Інші перевірки',extraHint:'Підсумки, вимова та перехід до A1.2',level:'Курс',empty:'Поки немає доступних тестів.',summary:'Підсумкові перевірки',pronunciation:'Вимова',unlock:'Перехід до A1.2'},
 en:{title:'Check your knowledge',intro:'Choose a course block, then take a combined check or practise one topic.',first:'Meet people and start talking',second:'Dutch for everyday life',firstHint:'Introductions, people, numbers, time, birthdays and opening hours.',secondHint:'Forms, routines, invitations, health, food and shopping.',advanced1:'Experiences and everyday life',advanced2:'Communication in different situations',advancedHint:'Check the topics in this course block.',range:(a,b)=>'Topics '+a+'–'+b,open:'Open block',back:'All test blocks',topics:'Check one topic',combined:'Combined block test',combinedHint:'3 questions per topic. A short check across the whole block.',done:(n,t)=>n+' of '+t+' topics passed',best:'Best',questions:n=>n+' questions',passed:'Passed',start:'Start',exam:'Prepare for your exam',examHint:'A1.1 · topics 8–11 · reading, listening, writing and speaking',extra:'More checks',extraHint:'Review tests, pronunciation and progression to A1.2',level:'Course',empty:'No tests available yet.',summary:'Review tests',pronunciation:'Pronunciation',unlock:'Progress to A1.2'},
 fr:{title:'Vérifie tes connaissances',intro:'Choisis une partie du cours, puis un bilan ou un thème précis.',first:'Faire connaissance et échanger',second:'Le néerlandais au quotidien',firstHint:'Présentations, personnes, nombres, heure, anniversaires et horaires.',secondHint:'Formulaires, quotidien, invitations, santé, repas et courses.',advanced1:'Expériences et vie quotidienne',advanced2:'Communiquer dans diverses situations',advancedHint:'Vérifie les thèmes de cette partie du cours.',range:(a,b)=>'Thèmes '+a+'–'+b,open:'Ouvrir',back:'Tous les blocs de tests',topics:'Vérifier un thème',combined:'Bilan de la partie',combinedHint:'3 questions par thème, pour réviser toute la partie.',done:(n,t)=>n+' thèmes réussis sur '+t,best:'Meilleur résultat',questions:n=>n+' questions',passed:'Réussi',start:'Commencer',exam:'Préparer l’examen',examHint:'A1.1 · thèmes 8–11 · lecture, écoute, écrit et oral',extra:'Autres tests',extraHint:'Bilans, prononciation et passage à A1.2',level:'Cours',empty:'Aucun test disponible.',summary:'Bilans',pronunciation:'Prononciation',unlock:'Passage à A1.2'},
 ar:{title:'اختبر معرفتك',intro:'اختر جزءًا من الدورة، ثم اختبارًا شاملًا أو موضوعًا واحدًا.',first:'التعارف والمحادثات الأولى',second:'الهولندية في الحياة اليومية',firstHint:'التعارف والأشخاص والأرقام والوقت وأعياد الميلاد ومواعيد العمل.',secondHint:'الاستمارات والروتين والدعوات والصحة والطعام والتسوق.',advanced1:'التجارب والحياة اليومية',advanced2:'التواصل في مواقف مختلفة',advancedHint:'راجع مواضيع هذا الجزء من الدورة.',range:(a,b)=>'المواضيع \u2066'+a+'–'+b+'\u2069',open:'افتح الجزء',back:'جميع أجزاء الاختبارات',topics:'اختبار موضوع واحد',combined:'اختبار شامل للجزء',combinedHint:'3 أسئلة من كل موضوع لمراجعة الجزء كاملًا.',done:(n,t)=>'تم اجتياز '+n+' من '+t+' مواضيع',best:'أفضل نتيجة',questions:n=>n+' أسئلة',passed:'ناجح',start:'ابدأ',exam:'الاستعداد للامتحان',examHint:'A1.1 · المواضيع 8–11 · القراءة والاستماع والكتابة والتحدث',extra:'اختبارات أخرى',extraHint:'المراجعة والنطق والانتقال إلى A1.2',level:'الدورة',empty:'لا توجد اختبارات بعد.',summary:'اختبارات المراجعة',pronunciation:'النطق',unlock:'الانتقال إلى A1.2'}
};
const tr=lang=>COPY[lang]||COPY.en;
const ranges=level=>level==='a11'?[[1,6],[7,12]]:[[1,4],[5,8]];
function blocks(tests,level){return ranges(level).map(([from,to],i)=>({id:level+'-'+from+'-'+to,from,to,index:i,tests:tests.filter(t=>t.group==='chapter'&&(t.lvl||'a11')===level&&t.no>=from&&t.no<=to).sort((a,b)=>a.no-b.no)}))}
function ensureCombined(tests){
 for(const level of ['a11','a12'])for(const b of blocks(tests,level)){
  const id='block_'+b.id+'_v109';if(tests.some(t=>t.id===id)||!b.tests.length)continue;
  // Stable, evenly spaced questions: one grammar item and two vocabulary items per topic.
  const questions=b.tests.flatMap(t=>[0,Math.floor(t.questions.length/2),t.questions.length-1].map(i=>t.questions[i])).filter(Boolean);
  tests.push({id,lvl:level,kind:'block',block:b.id,title:Object.fromEntries(Object.keys(COPY).map(lang=>[lang,(level==='a11'?'A1.1':'A1.2')+' · '+tr(lang).range(b.from,b.to)])),questions});
 }
}
let section=null,previousLevel=null;
function render(o){
 const {card,el,tests,level,lang,best,open,topicInfo,exam,changeLevel}=o,u=tr(lang);
 ensureCombined(tests);if(previousLevel!==level){section=null;previousLevel=level}
 const list=tests.filter(t=>(t.lvl||'a11')===level&&!(t.kind==='leveltest'&&o.unlocked(t.unlocks)));
 const bs=blocks(tests,level),selected=bs.find(b=>b.id===section);
 card.classList.add('test-library');card.replaceChildren();card.dir=lang==='ar'?'rtl':'ltr';
 const button=(text,cls,fn)=>{const e=el('button',cls,text);e.type='button';e.onclick=fn;return e};
 const go=id=>{section=id;render(o);card.ownerDocument?.defaultView?.scrollTo({top:0,behavior:'instant'});const h=card.querySelector?.('h2');if(h){h.tabIndex=-1;h.focus({preventScroll:true})}};
 const picture=(name)=>{const img=el('img','tl-picture');img.src='./img/tests/'+name+'-v109.webp';img.alt='';img.width=768;img.height=512;return img};
 const passed=t=>best[t.id]!=null&&best[t.id]>=Math.ceil(t.questions.length*(t.pass||70)/100);
 const row=t=>{
  const info=t.chapter&&topicInfo(t.chapter,lang),title=info?.title||(t.title[lang]||t.title.en||'').replace(/^[^\p{L}\p{N}]+/u,'');
  const b=button('','tl-row'+(passed(t)?' is-passed':''),()=>{card.classList.remove('test-library');card.removeAttribute('dir');open(t)});b.dataset.test=t.id;
  const marker=el('span','tl-marker',passed(t)?'✓':t.no?String(t.no):'→');marker.setAttribute('aria-hidden','true');
  const copy=el('span','tl-row-copy');copy.append(el('strong','',title),el('small','',u.questions(t.questions.length)+(best[t.id]!=null?' · '+u.best+': '+best[t.id]+'/'+t.questions.length:'')));
  if(passed(t))copy.appendChild(el('span','tl-passed',u.passed));b.append(marker,copy);return b;
 };
 const heading=el('div','tl-heading');
 if(section)heading.appendChild(button('‹ '+u.back,'tl-back',()=>go(null)));
 heading.appendChild(el('h2','',selected?u.range(selected.from,selected.to):section==='extra'?u.extra:u.title));
 if(!section){
  heading.appendChild(el('p','',u.intro));const levels=el('div','tl-levels');levels.setAttribute('aria-label',u.level);
  for(const [id,label] of [['a11','A1.1'],['a12','A1.2']]){const b=button(label,'tl-level',()=>{section=null;changeLevel(id)});b.setAttribute('aria-pressed',String(level===id));levels.appendChild(b)}heading.appendChild(levels);
 }
 card.appendChild(heading);
 if(selected){
  const summary=tests.find(t=>t.kind==='block'&&t.block===selected.id);const banner=el('div','tl-block-banner');banner.append(picture(selected.index?'everyday':'first-steps'),el('p','',level==='a11'?(selected.index?u.secondHint:u.firstHint):u.advancedHint));card.appendChild(banner);
  if(summary){card.appendChild(el('h3','tl-section',u.combined));card.appendChild(el('p','tl-hint',u.combinedHint));card.appendChild(row(summary))}
  card.appendChild(el('h3','tl-section',u.topics));selected.tests.forEach(t=>card.appendChild(row(t)));return;
 }
 if(section==='extra'){
  const rest=list.filter(t=>t.group!=='chapter'&&t.kind!=='block');
  for(const [label,arr] of [[u.summary,rest.filter(t=>!t.kind)],[u.pronunciation,rest.filter(t=>t.kind==='pronunciation')],[u.unlock,rest.filter(t=>t.kind==='leveltest')]]){
   if(arr.length){card.appendChild(el('h3','tl-section',label));arr.forEach(t=>card.appendChild(row(t)))}
  }
  if(!rest.length)card.appendChild(el('p','',u.empty));return;
 }
 const grid=el('div','tl-grid');
 bs.forEach(b=>{
  const tile=button('','tl-block tl-block-'+b.index,()=>go(b.id));tile.dataset.block=b.id;
  const copy=el('span','tl-block-copy');copy.append(el('span','tl-eyebrow',u.range(b.from,b.to)),el('strong','tl-title',level==='a11'?(b.index?u.second:u.first):(b.index?u.advanced2:u.advanced1)),el('span','tl-description',level==='a11'?(b.index?u.secondHint:u.firstHint):u.advancedHint));
  const done=b.tests.filter(passed).length;copy.appendChild(el('span','tl-progress-label',u.done(done,b.tests.length)));
  const meter=el('progress','tl-progress');meter.max=b.tests.length||1;meter.value=done;meter.setAttribute('aria-label',u.done(done,b.tests.length));copy.append(meter,el('span','tl-open',u.open+' →'));tile.append(picture(b.index?'everyday':'first-steps'),copy);grid.appendChild(tile);
 });card.appendChild(grid);
 const utility=el('div','tl-utilities');
 if(level==='a11'&&exam){const b=button('','tl-utility',()=>{card.classList.remove('test-library');card.removeAttribute('dir');exam()});b.id='examPick';const copy=el('span','');copy.append(el('strong','',u.exam),el('small','',u.examHint));b.append(picture('practice'),copy);utility.appendChild(b)}
 const more=button('','tl-utility',()=>go('extra'));const tx=el('span','');tx.append(el('strong','',u.extra),el('small','',u.extraHint));more.append(el('span','tl-more-mark','+'),tx);utility.appendChild(more);card.appendChild(utility);
}
root.LerenTestLibrary={render,blocks,ensureCombined,tr};
})(typeof window!=='undefined'?window:globalThis);
