(() => {
 'use strict';
 const api=globalThis.LerenLessonConversation;
 const rows={
  try:['Спробувати розмову за темою','Try a topic conversation','Essayer un dialogue du thème','جرّب محادثة عن الموضوع'],
  talk:['Поговорити після уроку','Talk after the lesson','Parler après la leçon','تحدّث بعد الدرس'],resume:['Продовжити розмову','Resume conversation','Reprendre la conversation','تابع المحادثة'],with:['Розмова з','Conversation with','Conversation avec','محادثة مع'],guided:['Керований діалог · 3 репліки','Guided dialogue · 3 turns','Dialogue guidé · 3 répliques','حوار موجّه · ٣ ردود'],intro:['Дай свою відповідь нідерландською. Підказки допоможуть, якщо бракує слів.','Answer in Dutch. Use a hint if you need words.','Réponds en néerlandais. Utilise une aide si les mots te manquent.','أجب بالهولندية. استخدم تلميحاً إذا احتجت كلمات.'],
  listen:['Послухати','Listen','Écouter','استمع'],answer:['Твоя відповідь нідерландською','Your answer in Dutch','Ta réponse en néerlandais','إجابتك بالهولندية'],send:['Перевірити відповідь','Check my answer','Vérifier ma réponse','تحقّق من إجابتي'],mic:['Відповісти голосом','Answer by voice','Répondre à voix haute','أجب بصوتك'],stop:['Зупинити мікрофон','Stop microphone','Arrêter le micro','أوقف الميكروفون'],recording:['Слухаю… Після розпізнавання перевір текст і натисни «Перевірити відповідь».','Listening… Check the transcript before sending.','J’écoute… Vérifie le texte reconnu avant de l’envoyer.','أستمع… راجع النص المتعرّف عليه قبل إرساله.'],recognized:['Перевір розпізнаний текст. Його можна виправити перед надсиланням.','Check the recognised text. You can edit it before sending.','Vérifie le texte reconnu. Tu peux le corriger avant de l’envoyer.','راجع النص المتعرّف عليه. يمكنك تعديله قبل الإرسال.'],micError:['Не вдалося розпізнати голос. Спробуй ще раз або напиши відповідь.','Speech could not be recognised. Try again or type your answer.','La voix n’a pas été reconnue. Réessaie ou écris ta réponse.','تعذّر التعرّف على الكلام. حاول مجدداً أو اكتب إجابتك.'],
  hint1:['Покажи початок фрази','Show a sentence starter','Montrer le début','اعرض بداية الجملة'],hint2:['Дай приклад відповіді','Show an example answer','Donner un exemple','اعرض مثالاً للإجابة'],hint3:['Поясни українською','Explain in English','Explique en français','اشرح بالعربية'],insert:['Вставити початок','Use starter','Utiliser le début','استخدم البداية'],
  fits:['Відповідь підходить до цієї репліки.','Your answer fits this turn.','Ta réponse convient à cette réplique.','إجابتك مناسبة لهذا الرد.'],limits:['Це керована практика змісту й окремих мовних форм. Вона не оцінює вимову й не перевіряє всі можливі помилки.','This guided practice checks intent and selected language patterns. It does not score pronunciation or detect every error.','Cet exercice vérifie le sens et certaines formes. Il n’évalue pas la prononciation ni toutes les erreurs possibles.','يتحقق هذا التدريب من المعنى وبعض الصيغ. لا يقيّم النطق ولا يكشف جميع الأخطاء.'],unknown:['Не вдалося підтвердити цю відповідь за зразком. Вона може бути правильною — спробуй інше формулювання або скористайся прикладом.','This answer could not be confirmed against the pattern. It may be correct — try another wording or use the example.','Cette réponse n’a pas pu être confirmée par le modèle. Elle peut être correcte : reformule ou utilise l’exemple.','لم يمكن تأكيد هذه الإجابة وفق النمط. قد تكون صحيحة؛ جرّب صياغة أخرى أو استخدم المثال.'],
  correction:['Зверни увагу на форму','Notice this language pattern','Observe cette forme','انتبه لهذه الصيغة'],said:['Твоя фраза','Your sentence','Ta phrase','جملتك'],better:['Виправлений фрагмент у фразі','Corrected pattern in your sentence','Forme corrigée dans ta phrase','الصيغة المصحّحة في جملتك'],retry:['Спробувати відповідь ще раз','Try answering again','Réessayer ma réponse','حاول الإجابة مجدداً'],example:['Продовжити з прикладом','Continue with the example','Continuer avec l’exemple','تابع باستخدام المثال'],next:['Наступна репліка','Next turn','Réplique suivante','الرد التالي'],
  practise:['Закріпити виправлення','Practise the correction','Pratiquer la correction','تدرّب على التصحيح'],repeat:['Повтори або напиши виправлену фразу','Repeat or type the corrected sentence','Répète ou écris la phrase corrigée','كرّر أو اكتب الجملة المصحّحة'],repeatCheck:['Перевірити повторення','Check repetition','Vérifier la répétition','تحقّق من التكرار'],repeatAgain:['Спробуй повторити саме показану фразу. Регістр і розділові знаки не важливі.','Repeat the sentence shown. Capitalisation and punctuation do not matter.','Répète la phrase affichée. Majuscules et ponctuation ne comptent pas.','كرّر الجملة المعروضة. لا تؤثر الأحرف الكبيرة وعلامات الترقيم.'],transfer:['Тепер застосуй правило в новому реченні','Now use the rule in a new sentence','Applique la règle à une nouvelle phrase','طبّق القاعدة في جملة جديدة'],words:['Використай усі слова й почни з','Use every word and begin with','Utilise tous les mots et commence par','استخدم جميع الكلمات وابدأ بـ'],transferCheck:['Перевірити нове речення','Check new sentence','Vérifier la nouvelle phrase','تحقّق من الجملة الجديدة'],transferAgain:['Перевір порядок слів. Використай усі слова й почни з указаного слова.','Check the word order. Use every word and start with the indicated word.','Vérifie l’ordre. Utilise tous les mots et commence par le mot indiqué.','راجع ترتيب الكلمات. استخدم كل الكلمات وابدأ بالكلمة المحدّدة.'],show:['Показати відповідь','Show answer','Afficher la réponse','اعرض الإجابة'],practised:['Виправлення закріплено: фразу повторено й правило застосовано в новому реченні.','Correction practised: sentence repeated and rule used in a new sentence.','Correction pratiquée : phrase répétée et règle appliquée à une nouvelle phrase.','تدرّبت على التصحيح: كرّرت الجملة وطبّقت القاعدة في جملة جديدة.'],
  finished:['Розмову завершено!','Conversation complete!','Conversation terminée !','اكتملت المحادثة!'],independent:['Самостійних відповідей','Independent answers','Réponses autonomes','إجابات مستقلة'],assisted:['Із підказкою або виправленням','With hints or corrections','Avec aide ou correction','باستخدام التلميحات أو التصحيح'],corrections:['Виправлень під час цієї розмови','Corrections during this conversation','Corrections pendant cette conversation','تصحيحات أثناء هذه المحادثة'],noXp:['Це практика без додаткових балів. Твої бали за урок збережені.','This practice adds no extra points. Your lesson points are preserved.','Cet exercice n’ajoute pas de points. Tes points de leçon sont conservés.','هذا التدريب لا يضيف نقاطاً. نقاط درسك محفوظة.'],again:['Повторити розмову','Repeat conversation','Refaire la conversation','كرّر المحادثة'],continue:['До наступного уроку','Continue to the next lesson','Passer à la leçon suivante','تابع إلى الدرس التالي'],ai:['Вільна розмова з AI через інтернет','Free AI conversation online','Conversation libre avec l’IA en ligne','محادثة حرة مع الذكاء الاصطناعي عبر الإنترنت'],
  saved:['Репліки й місце в розмові зберігаються на цьому пристрої. Мікрофон використовує розпізнавання мовлення браузера.','Replies and your place are saved on this device. The microphone uses browser speech recognition.','Les répliques et ta place sont conservées sur cet appareil. Le micro utilise la reconnaissance vocale du navigateur.','تُحفظ الردود ومكانك على هذا الجهاز. يستخدم الميكروفون التعرّف على الكلام في المتصفح.'],memory:['Сховище недоступне. Розмова збережеться лише на відкритій сторінці.','Storage is unavailable. This conversation lasts while the page is open.','Stockage indisponible. La conversation dure tant que la page reste ouverte.','التخزين غير متاح. تستمر المحادثة ما دامت الصفحة مفتوحة.'],vocab:['Слова з твого уроку','Words from your lesson','Mots de ta leçon','كلمات من درسك']
 };
 const tr=(key,lang)=>rows[key]?.[api.langs.indexOf(lang)]||rows[key]?.[0]||key;
 function createView(model,bridge){
  let generation=0,recording=false,message='',showTransfer=false;
  const node=(tag,cls,text)=>{const e=document.createElement(tag);if(cls)e.className=cls;if(text!=null)e.textContent=text;return e};
  const nl=e=>{e.lang='nl';e.dir='ltr';return e};
  function cancel(){generation++;recording=false;bridge.stopListening?.()}
  function render(root,lang){
   cancel();const t=k=>tr(k,lang),state=model.state,turn=model.current(),token=model.token();
   const rerender=()=>bridge.render(),button=(text,fn,primary=false)=>{const b=node('button',primary?'lp-button lp-primary':'lp-button',text);b.type='button';b.onclick=fn;return b};
   const speak=text=>{cancel();bridge.speak(text)};
   const box=node('div','lp-card lc-card'),person=bridge.person();
   const coach=node('div','lc-coach'),img=node('img');img.src=person.image;img.alt=person.name;img.width=64;img.height=64;
   const heading=node('div');heading.append(node('span','lp-eyebrow',t('guided')),node('h2','',t('with')+' '+person.name));coach.append(img,heading);box.appendChild(coach);
   const words=bridge.lessonWords(state.lesson);if(words.length)box.appendChild(node('p','lp-caption',t('vocab')+': '+words.join(' · ')));
   if(state.stage==='summary'){
    const stats=model.stats();box.append(node('h3','',t('finished')));
    const list=node('dl','lc-summary');for(const [key,n] of [['independent',stats.independent],['assisted',stats.assisted],['corrections',stats.corrections]])list.append(node('dt','',t(key)),node('dd','',String(n)));box.appendChild(list);
    const transcript=node('ol','lc-transcript');for(const r of state.replies)transcript.appendChild(nl(node('li','',r.text)));box.appendChild(transcript);
    box.append(node('p','lp-caption',t('noXp')),button(t('continue'),()=>{model.pause();bridge.nextLesson()},true),button(t('again'),()=>{model.begin(state.lesson);message='';rerender()}));
    if(bridge.ai)box.appendChild(button(t('ai'),()=>bridge.ai(model.lesson().chapter)));
   }else if(turn){
    box.appendChild(node('p','lp-caption',(state.index+1)+' / 3'));
    const bubble=node('div','lc-bubble');bubble.append(nl(node('p','lp-word',turn.q)),button('🔊 '+t('listen'),()=>speak(turn.q)));box.appendChild(bubble);
    if(state.stage==='question'){
     box.appendChild(node('p','',t('intro')));
     const hints=node('div','lc-hints');for(let i=1;i<=3;i++){const b=button(t('hint'+i),()=>{model.hint(i);message='';rerender()});b.setAttribute('aria-expanded',String(state.hint>=i));hints.appendChild(b)}box.appendChild(hints);
     if(state.hint){const help=node('div','lc-help');help.appendChild(nl(node('p','',turn.stem)));if(state.hint>=2)help.append(nl(node('p','',turn.sample)),button('🔊 '+t('listen'),()=>speak(turn.sample)));if(state.hint>=3)help.append(node('p','',turn.translations[lang].q),node('p','',turn.translations[lang].sample));box.appendChild(help)}
     addForm(t('send'),state.draft,text=>model.submit(text,token),text=>model.draft(text));
    }else if(state.stage==='feedback'){
     const p=state.pending,feedback=node('div','lc-feedback');feedback.setAttribute('role','status');
     feedback.append(node('strong','',t(p.kind==='ok'?'fits':p.kind==='unconfirmed'?'unknown':'correction')),node('p','lp-caption',t('said')),nl(node('p','lc-reply',p.original)));
     if(p.kind==='correction'){
      feedback.append(node('p','lp-caption',t('better')),nl(node('p','lc-reply',p.corrected)),node('p','',api.RULES[p.rule].explain[api.langs.indexOf(lang)]),button('🔊 '+t('listen'),()=>speak(p.corrected)));
      if(p.practised)feedback.appendChild(node('p','lc-success',t('practised')));
     }
     box.appendChild(feedback);
     if(p.kind==='ok'||p.kind==='correction'&&p.practised)box.appendChild(button(t('next'),()=>{model.next(token);message='';rerender()},true));
     else{
      if(p.kind==='correction')box.appendChild(button(t('practise'),()=>{model.repair();showTransfer=false;message='';rerender()},true));
      box.appendChild(button(t('retry'),()=>{model.retry();message='';rerender()}));
      box.appendChild(button(t('example'),()=>{model.useExample();message='';rerender()}));
     }
    }else if(state.stage==='repeat'||state.stage==='transfer'){
     const p=state.pending,rule=api.RULES[p.rule],repeat=state.stage==='repeat';
     box.append(node('h3','',t(repeat?'repeat':'transfer')),node('p','',rule.explain[api.langs.indexOf(lang)]));
     if(repeat)box.append(nl(node('p','lc-reply',p.corrected)),button('🔊 '+t('listen'),()=>speak(p.corrected)));
     else{
      const words=rule.practice.replace(/[.!?]/g,'').split(' ');box.append(node('p','',rule.prompt[api.langs.indexOf(lang)]),node('p','lp-caption',t('words')+' «'+words[0]+'»'),nl(node('p','lc-word-bag',[...words].reverse().join(' · '))));
      box.appendChild(button(t('show'),()=>{showTransfer=true;rerender()}));if(showTransfer)box.appendChild(nl(node('p','lc-reply',rule.practice)));
     }
     addForm(t(repeat?'repeatCheck':'transferCheck'),state.practiceDraft,text=>{const accepted=repeat?model.repeat(text):model.transfer(text);if(accepted){message=''}else message=repeat?'repeatAgain':'transferAgain';return true},text=>{model.practiceDraft(text)});
    }
   }
   box.appendChild(node('p','lp-caption lc-limits',t('limits')));root.appendChild(box);root.appendChild(node('p','lp-caption',t(model.persistent?'saved':'memory')));
   function addForm(label,value,submit,draft){
    const form=node('form','lc-form'),lab=node('label','',t('answer')),input=nl(node('textarea'));input.rows=2;input.maxLength=300;input.value=value;input.setAttribute('aria-label',t('answer'));input.autocomplete='off';input.spellcheck=false;input.oninput=()=>draft(input.value);lab.appendChild(input);
    const status=node('p','lp-caption');status.setAttribute('role','status');status.textContent=message?t(message):'';
    const send=node('button','lp-button lp-primary',label);send.type='submit';
    form.onsubmit=e=>{e.preventDefault();if(!input.value.trim()||recording)return;if(submit(input.value)){message=state.stage==='question'?'':message;rerender()}};
    form.append(lab,status,send);
    if(bridge.canListen()){
     const mic=button('🎤 '+t('mic'),()=>{
      if(recording){cancel();mic.textContent='🎤 '+t('mic');send.disabled=false;status.textContent='';return}
      const micGeneration=generation;recording=true;mic.textContent='⏹ '+t('stop');send.disabled=true;status.textContent=t('recording');
      bridge.listen(alts=>{if(generation!==micGeneration)return;const text=Array.isArray(alts)?alts.find(x=>typeof x==='string'):'';if(text){draft(text.slice(0,300));message='recognized'}else message='micError';recording=false;rerender()},()=>{if(generation!==micGeneration)return;recording=false;message='micError';rerender()});
     });form.appendChild(mic);
    }
    box.appendChild(form);
   }
  }
  return {render,cancel,clear(){message='';showTransfer=false}};
 }
 Object.assign(api,{tr,createView});
})();
