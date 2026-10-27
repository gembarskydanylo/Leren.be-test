(() => {
  'use strict';
  const script=document.currentScript,base=new URL('.',script.src),version=new URL(script.src).search;
  const asset=name=>new URL(name+version,base);
  const langs=['uk','en','fr','ar'];
  const rows={
    badge:['Фонетика · A1','Pronunciation · A1','Prononciation · A1','النطق · A1'],
    title:['Дифтонги за 3 кроки','Diphthongs in 3 steps','Les diphtongues en 3 étapes','الأصوات المزدوجة في ٣ خطوات'],
    subtitle:['Вивчи звук. Почуй різницю. Перевір себе.','Learn the sound. Hear the difference. Test yourself.','Découvre le son. Écoute la différence. Teste-toi.','تعلّم الصوت. اسمع الفرق. اختبر نفسك.'],
    lessonLabel:['Мініурок','Mini-lesson','Mini-leçon','درس مصغّر'],
    language:['Мова','Language','Langue','اللغة'],learn:['Вивчи','Learn','Apprends','تعلّم'],listenStep:['Почуй','Listen','Écoute','اسمع'],check:['Перевір','Check','Vérifie','اختبر'],
    progress:['Завершено кроків: {n}/3','Steps completed: {n}/3','Étapes terminées : {n}/3','الخطوات المكتملة: {n}/٣'],
    examples:['Послухай та повтори:','Listen and repeat:','Écoute et répète :','استمع وكرّر:'],
    understood:['Зрозуміло — наступний звук →','Got it — next sound →','Compris — son suivant →','فهمت — الصوت التالي ←'],
    goListen:['Тепер розрізняй на слух →','Now listen for the difference →','À toi de distinguer les sons →','ميّز الأصوات الآن ←'],
    reviewed:['Цей звук уже вивчено ✓','Sound studied ✓','Son étudié ✓','تم تعلّم هذا الصوت ✓'],
    trapsTitle:['Не плутай зі схожими буквами','Similar letters, different sounds','Des lettres semblables, des sons différents','حروف متشابهة وأصوات مختلفة'],
    traps:['oe, ie, eu передають один голосний. Дві крапки в ruïne або poëzie означають окремі склади: ru-ï-ne, po-ë-zie.','oe, ie and eu represent a single vowel. The diaeresis in ruïne or poëzie separates syllables: ru-ï-ne, po-ë-zie.','oe, ie et eu représentent une seule voyelle. Le tréma de ruïne ou poëzie sépare les syllabes : ru-ï-ne, po-ë-zie.','تمثل oe وie وeu صوتاً صائتاً واحداً. النقطتان في ruïne وpoëzie تفصلان المقاطع: ru-ï-ne وpo-ë-zie.'],
    extraTitle:['Додатково: ooi та eeuw','Extra: ooi and eeuw','En plus : ooi et eeuw','إضافي: ooi وeeuw'],
    extra:['Це сполучення голосного з переходом до j або w. Вчи їх окремо від трьох основних дифтонгів. У цьому підсумковому тесті їх немає.','These combine a vowel with a glide towards j or w. Study them separately from the three core diphthongs. They are not in this final quiz.','Ces combinaisons associent une voyelle à un glissement vers j ou w. Étudie-les à part des trois diphtongues principales. Elles ne figurent pas dans ce test final.','تجمع هذه التراكيب بين صوت صائت وانتقال نحو j أو w. تعلّمها منفصلة عن الأصوات المزدوجة الثلاثة الأساسية. لا يتضمنها هذا الاختبار النهائي.'],
    battle:['Батл слів','Word battle','Bataille de mots','تحدّي الكلمات'],dict:['Впізнай звук','Identify the sound','Reconnais le son','تعرّف على الصوت'],
    battleHint:['Послухай і вибери слово, яке прозвучало. Після відповіді порівняй обидві вимови.','Listen and choose the word you heard. After answering, compare both pronunciations.','Écoute et choisis le mot entendu. Après ta réponse, compare les deux prononciations.','استمع واختر الكلمة التي سمعتها. بعد الإجابة قارن نطق الكلمتين.'],
    dictHint:['Послухай та вибери групу звуків. ij/ei та ou/au мають спільні кнопки: однакове звучання, різне написання.','Listen and choose the sound group. ij/ei and ou/au share buttons: the same sound, different spellings.','Écoute et choisis le groupe sonore. ij/ei et ou/au partagent un bouton : même son, graphies différentes.','استمع واختر مجموعة الصوت. تشترك ij/ei وou/au في الأزرار: الصوت نفسه والكتابة مختلفة.'],
    quizHint:['У слові є один із трьох основних дифтонгів? Зверни увагу на пастки й окремі склади.','Does the word contain one of the three core diphthongs? Watch for single vowels and separate syllables.','Le mot contient-il une des trois diphtongues principales ? Attention aux voyelles simples et aux syllabes séparées.','هل تحتوي الكلمة على أحد الأصوات المزدوجة الثلاثة الأساسية؟ انتبه للصوائت المفردة والمقاطع المنفصلة.'],
    listen:['🔊 Послухай','🔊 Listen','🔊 Écoute','🔊 استمع'],question:['Завдання {n}/{total}','Question {n}/{total}','Question {n}/{total}','السؤال {n}/{total}'],
    correct:['Правильних: {n}','Correct: {n}','Bonnes réponses : {n}','الإجابات الصحيحة: {n}'],yes:['Є дифтонг','Diphthong','Une diphtongue','صوت مزدوج'],no:['Не дифтонг','No diphthong','Pas de diphtongue','ليس صوتاً مزدوجاً'],
    right:['✓ Правильно!','✓ Correct!','✓ Bien joué !','✓ صحيح!'],wrong:['Спробуй запам’ятати різницю','Remember this difference','Retiens cette différence','تذكّر هذا الفرق'],
    coreRule:['{group} — ковзний звук в одному складі.','{group} — a gliding vowel within one syllable.','{group} — une voyelle qui glisse dans une seule syllabe.','{group} — صوت صائت متحرك داخل مقطع واحد.'],
    monoRule:['Тут один голосний звук, а не основний дифтонг.','This is a single vowel, not a core diphthong.','C’est une seule voyelle, pas une diphtongue principale.','هذا صوت صائت مفرد وليس صوتاً مزدوجاً أساسياً.'],
    tremaRule:['Дві крапки позначають окремий склад. Не зливай ці голосні в один звук.','The diaeresis marks a separate syllable. Do not merge these vowels.','Le tréma indique une syllabe séparée. Ne fusionne pas ces voyelles.','تشير النقطتان إلى مقطع منفصل. لا تدمج هذين الصوتين.'],
    next:['Наступне завдання →','Next question →','Question suivante →','السؤال التالي ←'],finished:['Раунд завершено!','Round complete!','Série terminée !','انتهت الجولة!'],
    best:['Найкраще: {n}/{total}','Best: {n}/{total}','Record : {n}/{total}','الأفضل: {n}/{total}'],
    repeat:['Повторити помилки ({n})','Review mistakes ({n})','Revoir les erreurs ({n})','راجع الأخطاء ({n})'],again:['Новий раунд','New round','Nouvelle série','جولة جديدة'],
    review:['Повторення помилок','Mistake review','Révision des erreurs','مراجعة الأخطاء'],reviewDone:['Помилки повторено. Пройди повний раунд, щоб підтвердити результат.','Mistakes reviewed. Take a full round to confirm your result.','Erreurs revues. Fais une série complète pour confirmer ton résultat.','راجعت الأخطاء. أكمل جولة كاملة لتأكيد نتيجتك.'],
    scoreHint:['Для засвоєння потрібно щонайменше 80% у кожному раунді.','Aim for at least 80% in each full round.','Vise au moins 80 % dans chaque série complète.','استهدف ٨٠٪ على الأقل في كل جولة كاملة.'],
    goDict:['Далі: впізнай звук →','Next: identify the sound →','Ensuite : reconnais le son →','التالي: تعرّف على الصوت ←'],goQuiz:['Далі: перевір себе →','Next: test yourself →','Ensuite : teste-toi →','التالي: اختبر نفسك ←'],
    goLearn:['Повернутися до трьох звуків','Revisit the three sounds','Revoir les trois sons','راجع الأصوات الثلاثة'],
    mastered:['Мініурок засвоєно! 🎉','Mini-lesson mastered! 🎉','Mini-leçon maîtrisée ! 🎉','أتقنت الدرس المصغّر! 🎉'],
    masteredHint:['Ти впізнаєш три основні дифтонги. Повернися пізніше та закріпи результат.','You recognise the three core diphthongs. Come back later to reinforce them.','Tu reconnais les trois diphtongues principales. Reviens plus tard pour consolider tes acquis.','تميّز الآن الأصوات المزدوجة الثلاثة الأساسية. عُد لاحقاً لتثبيتها.'],
    xp:['+{n} балів до твого прогресу','+{n} points towards your progress','+{n} points dans ta progression','+{n} نقطة لتقدّمك'],
    xpRule:['Бали додатка — за нові найкращі результати. Повторення помилок не додає зайвих балів.','App points reward new personal bests. Mistake reviews do not add extra points.','Les points récompensent les nouveaux records. Revoir les erreurs ne rapporte pas de points supplémentaires.','تُمنح نقاط التطبيق للأرقام القياسية الجديدة. مراجعة الأخطاء لا تضيف نقاطاً إضافية.'],
    legacy:['Попередній тренажер: {n}/100 — збережено','Previous quiz: {n}/100 — preserved','Ancien quiz : {n}/100 — conservé','الاختبار السابق: {n}/١٠٠ — محفوظ'],
    resumed:['Твій прогрес відновлено. Можеш продовжити з цього місця.','Your progress is restored. Continue where you left off.','Ta progression est restaurée. Reprends là où tu en étais.','تمت استعادة تقدّمك. تابع من حيث توقفت.'],
    memoryOnly:['Сховище браузера недоступне: прогрес збережеться лише до закриття сторінки.','Browser storage is unavailable: progress lasts only while this page is open.','Le stockage est indisponible : la progression ne sera conservée que tant que cette page reste ouverte.','تخزين المتصفح غير متاح: سيبقى التقدّم ما دامت الصفحة مفتوحة فقط.'],
    noVoice:['Не вдалося відтворити звук. Спробуй ще раз або перевір вибраний голос.','Audio could not play. Try again or check the selected voice.','Impossible de lire le son. Réessaie ou vérifie la voix choisie.','تعذّر تشغيل الصوت. حاول مجدداً أو تحقّق من الصوت المختار.'],
    loadError:['Не вдалося відкрити мініурок. Перевір підключення й онови сторінку.','The mini-lesson could not load. Check your connection and reload.','La mini-leçon n’a pas pu se charger. Vérifie ta connexion et recharge la page.','تعذّر تحميل الدرس. تحقّق من الاتصال وأعد تحميل الصفحة.']
  };
  const sounds={
    ui:{examples:['huis','tuin','muis'],text:[
      ['Плавний перехід між двома положеннями голосного в одному складі.','Округли губи','Підніми язик, зберігай округлення','Це не українське «у-і». Не розділяй звук на два склади.'],
      ['One smooth glide within a single syllable.','Round your lips','Raise your tongue; keep lips rounded','Do not split the sound into two syllables.'],
      ['Un glissement continu dans une seule syllabe.','Arrondis les lèvres','Relève la langue ; garde les lèvres arrondies','Ne sépare pas le son en deux syllabes.'],
      ['انتقال سلس داخل مقطع واحد.','دوّر الشفتين','ارفع اللسان مع إبقاء الشفتين مدورتين','لا تقسّم الصوت إلى مقطعين.']
    ]},
    'ij/ei':{examples:['trein','ijs','pijn'],text:[
      ['ij та ei звучать однаково. Їхнє написання вивчай разом зі словом.','Почни з відкритішого звука','Плавно підніми язик','Не вимовляй дві окремі голосні й не роби паузи посередині.'],
      ['ij and ei sound alike. Learn the spelling with each word.','Start with a more open vowel','Smoothly raise your tongue','Keep the glide in one syllable, without a pause.'],
      ['ij et ei se prononcent de la même façon. Apprends la graphie avec le mot.','Commence par une voyelle plus ouverte','Relève progressivement la langue','Garde le glissement dans une seule syllabe, sans pause.'],
      ['يُنطق ij وei بالطريقة نفسها. تعلّم الكتابة مع كل كلمة.','ابدأ بصوت أكثر انفتاحاً','ارفع اللسان تدريجياً','حافظ على مقطع واحد دون توقف.']
    ]},
    'ou/au':{examples:['koud','blauw','hout'],text:[
      ['ou та au звучать однаково. Звук змінюється, але склад залишається один.','Відкрий рот','Плавно округли губи','Не підміняй цей перехід одним українським «о» або «у».'],
      ['ou and au sound alike. The vowel changes within one syllable.','Open your mouth','Smoothly round your lips','Keep the movement smooth; do not replace it with a single vowel.'],
      ['ou et au se prononcent de la même façon. La voyelle change dans une seule syllabe.','Ouvre la bouche','Arrondis progressivement les lèvres','Garde un mouvement continu, sans remplacer le son par une seule voyelle.'],
      ['يُنطق ou وau بالطريقة نفسها. يتغيّر الصوت داخل مقطع واحد.','افتح الفم','دوّر الشفتين تدريجياً','حافظ على انتقال سلس ولا تستبدله بصوت واحد.']
    ]}
  };
  const instances=new Set();
  const node=(tag,cls,text)=>{const e=document.createElement(tag);if(cls)e.className=cls;if(text!==undefined)e.textContent=text;return e};
  const button=(text,fn,cls='')=>{const b=node('button',cls,text);b.type='button';b.addEventListener('click',fn);return b};
  function init(root,words){
    if(root.dataset.ready)return;root.dataset.ready='1';
    const model=globalThis.LerenDiphthongsLesson.create(words,{getItem:k=>localStorage.getItem(k),setItem:(k,v)=>localStorage.setItem(k,v)});
    const $=s=>root.querySelector(s),$$=s=>[...root.querySelectorAll(s)];
    let lang='uk',lastGain={};
    const tr=(key,values={})=>(rows[key]?.[langs.indexOf(lang)]||rows[key]?.[0]||key).replace(/\{(\w+)\}/g,(_,k)=>String(values[k]??''));
    const translation=w=>w.translations?.[lang]||w.tr;
    function speak(text,automatic=false){
      if(window.LerenLessonWidgets){window.LerenLessonWidgets.speak(text,automatic);return}
      if(!window.speechSynthesis||!window.SpeechSynthesisUtterance){$('[data-role=status]').textContent=tr('noVoice');return}
      const synth=window.speechSynthesis,voices=synth.getVoices(),voice=voices.find(v=>v.lang.toLowerCase()==='nl-be')||voices.find(v=>v.lang.toLowerCase().startsWith('nl'));
      synth.cancel();const utterance=new window.SpeechSynthesisUtterance(text);utterance.lang=voice?.lang||'nl-BE';if(voice)utterance.voice=voice;utterance.rate=.85;utterance.onerror=()=>{$('[data-role=status]').textContent=tr('noVoice')};synth.speak(utterance);
    }
    const stop=()=>window.LerenLessonWidgets?.stop?.();
    function example(word){const w=model.word(word),b=button('',()=>speak(word), 'lbe-example');b.append(node('span','','🔊'),node('strong','',word),node('small','',translation(w)));b.setAttribute('aria-label',tr('listen')+': '+word+' — '+translation(w));return b}
    function setLanguage(next){lang=langs.includes(next)?next:'uk';root.lang=lang;root.dir=lang==='ar'?'rtl':'ltr';$('[data-role=language]').value=lang;render()}
    function stage(name){stop();model.stage(name);render()}
    function render(){
      $$('[data-i18n]').forEach(e=>e.textContent=tr(e.dataset.i18n));
      root.querySelector('[role=tablist]').setAttribute('aria-label',tr('lessonLabel'));
      const steps=model.steps();$('[data-role=progress]').textContent=tr('progress',{n:steps.filter(Boolean).length});
      $$('[data-tab]').forEach((b,i)=>{const on=b.dataset.tab===model.state.stage;b.setAttribute('aria-selected',String(on));b.tabIndex=on?0:-1;b.classList.toggle('is-done',steps[i]);b.querySelector('.lbe-step-num').textContent=steps[i]?'✓':String(i+1)});
      $$('[data-pane]').forEach(p=>p.hidden=p.dataset.pane!==model.state.stage);
      $('[data-role=lesson-done]').hidden=!steps.every(Boolean);
      $('[data-role=status]').textContent=model.persistent?'':tr('memoryOnly');
      const resume=$('[data-role=resume]');resume.hidden=!Object.values(model.state.rounds).some(r=>r&&!r.mode.includes('review')&&r.index>0&&r.index<r.keys.length);resume.textContent=tr('resumed');
      if(model.state.stage==='learn')renderLearn();
      else if(model.state.stage==='listen'){
        const modes=$('[data-role=listen-modes]');modes.replaceChildren();
        for(const kind of ['battle','dict']){const b=button(tr(kind),()=>{stop();model.listening(kind);render()},'');b.setAttribute('aria-pressed',String(kind===model.state.listening));modes.appendChild(b)}
        model.ensure(model.state.listening);renderRound(model.state.listening,$('[data-role=listen-content]'));
      }else{model.ensure('quiz');renderRound('quiz',$('[data-role=quiz-content]'))}
    }
    function renderLearn(){
      const tabs=$('[data-role=sound-tabs]');tabs.replaceChildren();
      model.groups.forEach(g=>{const b=button(g+(model.state.learned.includes(g)?' ✓':''),()=>{stop();model.sound(g);renderLearn()});b.setAttribute('aria-pressed',String(g===model.state.sound));tabs.appendChild(b)});
      const sound=sounds[model.state.sound],text=sound.text[langs.indexOf(lang)];
      $('[data-role=sound-title]').textContent=model.state.sound;
      $('[data-role=sound-count]').textContent=model.state.learned.includes(model.state.sound)?tr('reviewed'):(model.groups.indexOf(model.state.sound)+1)+' / 3';
      for(const [selector,value] of [['sound-rule',text[0]],['artic-start',text[1]],['artic-end',text[2]],['sound-tip',text[3]]])$('[data-role='+selector+']').textContent=value;
      const examples=$('[data-role=examples]');examples.replaceChildren(...sound.examples.map(example));
      $('[data-role=learn-next]').textContent=model.state.learned.filter(g=>g!==model.state.sound).length===2?tr('goListen'):tr('understood');
      $('[data-role=trap-examples]').replaceChildren(...['boek','fiets','neus','ruïne'].map(example));
      $('[data-role=extra-examples]').replaceChildren(...['mooi','leeuw'].map(example));
    }
    function renderRound(kind,box){
      const r=model.round(kind);box.replaceChildren();
      if(model.done(kind)){renderResult(kind,box);return}
      const q=model.current(kind),w=model.word(q.word),answered=r.answers[r.index]!=null;
      const meta=node('div','lbe-meta');meta.append(node('span','',tr('question',{n:r.index+1,total:r.keys.length})),node('span','',tr('correct',{n:model.count(kind)})));box.appendChild(meta);
      if(r.mode==='review')box.appendChild(node('p','lbe-caption',tr('review')));
      box.appendChild(node('p','',tr(kind==='quiz'?'quizHint':kind==='battle'?'battleHint':'dictHint')));
      if(kind==='quiz'){
        const wordbox=node('div','lbe-wordbox');const word=node('div','lbe-word',w.word);word.dataset.role='word';wordbox.append(word,node('small','',translation(w)));box.appendChild(wordbox);
      }
      const audio=button(tr('listen'),()=>speak(w.word),'lbe-audio');audio.dataset.action='listen';box.appendChild(audio);
      const choices=node('div','lbe-answers');choices.dataset.role=kind==='quiz'?'quiz-options':kind==='battle'?'battle-options':'dict-options';
      q.choices.forEach(choice=>{
        const b=button(kind==='quiz'?tr(choice):choice,()=>{if(model.answer(kind,choice,q.key)){render();box.querySelector('[data-action=next]')?.focus({preventScroll:true})}});
        b.dataset.choice=choice;b.disabled=answered;
        if(answered){b.classList.toggle('is-correct',choice===q.answer);b.classList.toggle('is-wrong',choice===r.answers[r.index]&&choice!==q.answer)}
        choices.appendChild(b);
      });box.appendChild(choices);
      if(answered){
        const fb=node('div','lbe-feedback');fb.setAttribute('role','status');fb.setAttribute('aria-live','polite');fb.append(node('strong','',tr(r.answers[r.index]===q.answer?'right':'wrong')));
        const group=model.group(w),explanation=w.pattern==='trema'?tr('tremaRule'):model.groups.includes(group)?tr('coreRule',{group}):tr('monoRule');
        fb.append(node('span','',w.word+' — '+translation(w)+'. '+explanation));
        const compare=node('div','lbe-compare');(kind==='battle'?q.choices:[q.word]).forEach(word=>compare.appendChild(button('🔊 '+word,()=>speak(word))));fb.appendChild(compare);box.appendChild(fb);
        const next=button(tr('next'),()=>{if(model.next(kind,q.key)){render();const word=model.current(kind)?.word;if(word)speak(word,true)}},'lbe-primary');next.dataset.action='next';box.appendChild(next);
      }
    }
    function renderResult(kind,box){
      const r=model.round(kind),correct=model.count(kind),total=r.keys.length;
      if(r.mode==='full'&&window.LerenLessonWidgets?.completeDiphthongs){const gain=window.LerenLessonWidgets.completeDiphthongs(kind,correct,total);if(gain>0)lastGain[kind]=gain}
      const result=node('div','lbe-result');result.append(node('h3','',tr('finished')),node('div','lbe-result-score',correct*10+' / '+total*10),node('p','',tr('best',{n:model.state.best[kind]*10,total:model.limits[kind]*10})));
      if(lastGain[kind]>0&&r.mode==='full')result.appendChild(node('p','',tr('xp',{n:lastGain[kind]})));
      result.appendChild(node('p','',tr(r.mode==='review'?'reviewDone':'scoreHint')));
      if(kind==='quiz'&&model.legacyBest)result.appendChild(node('p','',tr('legacy',{n:model.legacyBest})));
      const pending=model.state.mistakes[kind];
      if(pending.length){
        const list=node('ul');pending.forEach(key=>{const q=model.question(kind,key),w=model.word(q.word);list.appendChild(node('li','',w.word+' — '+translation(w)))});result.appendChild(list);
        result.appendChild(button(tr('repeat',{n:pending.length}),()=>{lastGain[kind]=0;model.start(kind,true);render()},'lbe-primary'));
      }
      result.appendChild(button(tr('again'),()=>{lastGain[kind]=0;model.start(kind);render()},'lbe-secondary'));
      const go=kind==='battle'?()=>{model.listening('dict');render()}:kind==='dict'?()=>stage('quiz'):!model.steps()[0]?()=>stage('learn'):()=>stage('listen');
      result.appendChild(button(tr(kind==='battle'?'goDict':kind==='dict'?'goQuiz':!model.steps()[0]?'goLearn':'listenStep'),go,'lbe-primary'));
      result.appendChild(node('p','lbe-caption',tr('xpRule')));box.appendChild(result);
    }
    $$('[data-tab]').forEach(b=>b.addEventListener('click',()=>stage(b.dataset.tab)));
    $('[data-action=learn-next]').addEventListener('click',()=>{model.learn();const next=model.groups.find(g=>!model.state.learned.includes(g));if(next){model.sound(next);render()}else stage('listen')});
    $('[data-role=language]').addEventListener('change',e=>setLanguage(e.target.value));
    root.addEventListener('keydown',e=>{
      if(!['ArrowLeft','ArrowRight','Home','End'].includes(e.key)||!e.target.closest('[data-tab]'))return;
      const buttons=$$('[data-tab]'),index=buttons.indexOf(e.target.closest('[data-tab]'));let next=e.key==='Home'?0:e.key==='End'?2:(index+(e.key==='ArrowRight'?1:-1)*(lang==='ar'?-1:1)+3)%3;
      e.preventDefault();stage(buttons[next].dataset.tab);buttons[next].focus();
    });
    instances.add({root,setLanguage});
    const initial=window.LerenLessonWidgets?.getLanguage()||document.documentElement.lang||'uk';setLanguage(initial.slice(0,2));
  }
  async function mount(target){
    const host=typeof target==='string'?document.querySelector(target):target;if(!host||host.dataset?.mounted||host.dataset?.mounting)return;
    host.dataset.mounting='1';
    try{
      const [html,words]=await Promise.all([fetch(asset('widget.html')).then(r=>{if(!r.ok)throw Error('html');return r.text()}),fetch(asset('words.json')).then(r=>{if(!r.ok)throw Error('words');return r.json()})]);
      if(!document.querySelector('link[data-lbe-diph-css]')){const link=document.createElement('link');link.rel='stylesheet';link.href=asset('widget.css').href;link.dataset.lbeDiphCss='1';document.head.appendChild(link)}
      host.innerHTML=html;init(host.querySelector('[data-lbe-diph]'),words);host.dataset.mounted='1';
    }catch(error){host.textContent=rows.loadError[langs.indexOf(document.documentElement.lang)]||rows.loadError[0];console.error('Leren.be diphthongs:',error)}finally{delete host.dataset.mounting}
  }
  window.LerenbeDiphthongs={mount,setLanguage(lang){for(const instance of instances){if(instance.root.isConnected)instance.setLanguage(lang);else instances.delete(instance)}}};
  document.querySelectorAll('[data-lerenbe-diphthongs]').forEach(mount);
})();
