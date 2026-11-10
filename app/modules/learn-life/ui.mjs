import {fence,phraseById,objectById,buildQuickPhrase,searchPhrases} from './data.mjs?v=2';
import {createLifeSession} from './engine.mjs';

const $=id=>document.getElementById(id);
const el=(tag,className,text)=>{const node=document.createElement(tag);if(className)node.className=className;if(text!==undefined)node.textContent=text;return node};
const safeStorage=(()=>{try{return localStorage}catch{return {getItem:()=>null,setItem:()=>{}}}})();
const session=createLifeSession(fence,safeStorage);
const firstOpen=fence.stages.findIndex(stage=>session.complete(stage.id)<stage.tasks.length);
let stageIndex=firstOpen<0?fence.stages.length-1:firstOpen;
let objectId=fence.stages[stageIndex].objectIds[0],templateId='hand',onlyFavourites=false;
let speakId=null,recognition=null;

function hear(text,button){
 if(!('speechSynthesis' in window)){if(button)button.textContent='🔇 Озвучення недоступне';return}
 speechSynthesis.cancel();
 const utterance=new SpeechSynthesisUtterance(text);
 utterance.lang='nl-BE';utterance.rate=.86;utterance.pitch=1;
 const voices=speechSynthesis.getVoices();
 utterance.voice=voices.find(voice=>voice.lang.toLowerCase()==='nl-be')||voices.find(voice=>voice.lang.toLowerCase().startsWith('nl'))||null;
 speechSynthesis.speak(utterance);
}
function updateProgress(){
 $('heroProgress').textContent=session.done()+' / '+session.total;
 fence.stages.forEach((stage,index)=>{
  const button=$('stageNav').children[index];
  if(button)button.querySelector('small').textContent=session.complete(stage.id)+' / '+stage.tasks.length;
 });
}
function renderNav(){
 const nav=$('stageNav');nav.replaceChildren();
 fence.stages.forEach((stage,index)=>{
  const button=el('button','ll-stage-tab');button.type='button';
  if(index===stageIndex)button.setAttribute('aria-current','step');
  button.append(el('b','',stage.number),el('span','',stage.title),el('small','',session.complete(stage.id)+' / '+stage.tasks.length));
  button.addEventListener('click',()=>{stageIndex=index;objectId=stage.objectIds[0];renderStage();$('story').scrollIntoView({block:'start',behavior:'smooth'})});
  nav.append(button);
 });
}
function renderObjects(stage){
 const hotspots=$('hotspots');hotspots.replaceChildren();
 stage.objectIds.forEach(id=>{
  const object=objectById(id),button=el('button','ll-hotspot');
  button.type='button';button.setAttribute('aria-pressed',String(objectId===id));
  button.append(el('i','',object.icon),el('span','',object.uk));
  button.addEventListener('click',()=>{objectId=id;$('quickObject').value=id;renderObjects(stage);renderObjectInfo();renderQuick()});
  hotspots.append(button);
 });
 renderObjectInfo();
}
function renderObjectInfo(){
 const object=objectById(objectId),box=$('objectInfo');box.replaceChildren();
 const dutch=el('strong','',object.nl);dutch.lang='nl-BE';box.append(el('span','',object.icon),dutch,el('span','',object.uk));
 const sound=el('button','','🔊');sound.type='button';sound.setAttribute('aria-label','Послухати: '+object.nl);sound.addEventListener('click',()=>hear(object.nl,sound));box.append(sound);
}
function renderTask(){
 const stage=fence.stages[stageIndex],task=session.next(stage.id),box=$('challenge');box.replaceChildren();
 if(!task){
  const done=el('div','ll-complete');
  done.append(el('span','icon','✦'),el('h3','',stageIndex===fence.stages.length-1&&session.done()===session.total?'Ти пройшов усю роботу!':'Цей етап готовий!'),el('p','','Спробуй сказати ці фрази вголос. Помилки повернуться у повторенні.'));
  const next=el('button','ll-next',stageIndex<fence.stages.length-1?'Наступний етап →':'Повторити фрази →');next.type='button';
  next.addEventListener('click',()=>{if(stageIndex<fence.stages.length-1){stageIndex++;objectId=fence.stages[stageIndex].objectIds[0];renderStage()}else $('speak').scrollIntoView({behavior:'smooth',block:'start'})});
  done.append(next);box.append(done);return;
 }
 const stepNumber=stage.tasks.indexOf(task)+1;
 const top=el('div','ll-challenge-top');top.append(el('span','','СИТУАЦІЯ '+stepNumber+' / '+stage.tasks.length),el('span','','Обери, що сказати сусіду'));
 box.append(top,el('h3','',task.goal),el('p','ll-context',task.context));
 const choices=el('div','ll-choice-list');
 task.choices.forEach((id,index)=>{
  const phrase=phraseById(id),button=el('button','ll-choice');button.type='button';
  const dutch=el('span','',phrase.nl);dutch.lang='nl-BE';button.append(el('span','ll-choice-code',String.fromCharCode(65+index)),dutch);
  button.addEventListener('click',()=>{
   const result=session.answer(task.id,id);
   if(!result)return;
   button.dataset.result=result.correct?'correct':'wrong';
   const previous=box.querySelector('.ll-feedback');if(previous)previous.remove();
   const feedback=el('div','ll-feedback');feedback.dataset.kind=result.correct?'correct':'wrong';
   const answer=phraseById(result.answer);
   feedback.append(el('strong','',result.correct?'Так, саме це можна сказати!':'Спробуй ще раз. Потрібна фраза:'),el('p','',answer.nl+' — '+answer.uk),el('p','',answer.note));
   box.append(feedback);
   if(result.correct){
    hear(answer.nl);choices.querySelectorAll('button').forEach(choice=>choice.disabled=true);
    const next=el('button','ll-next','Далі →');next.type='button';next.addEventListener('click',()=>{renderTask();renderNav()});box.append(next);
    $('stageCount').textContent=session.complete(stage.id)+' / '+stage.tasks.length+' ситуацій';
    updateProgress();renderSpeak();
   }
  });
  choices.append(button);
 });
 box.append(choices);
}
function renderStage(){
 const stage=fence.stages[stageIndex];
 $('stageNumber').textContent='КРОК '+stage.number;
 $('stageTitle').textContent=stage.title;
 $('stageIntro').textContent=stage.intro;
 $('stageCount').textContent=session.complete(stage.id)+' / '+stage.tasks.length+' ситуацій';
 renderNav();renderObjects(stage);renderTask();updateProgress();
}
function renderQuickActions(){
 const actions=$('quickActions');actions.replaceChildren();
 fence.templates.forEach(template=>{
  const button=el('button','',template.label);button.type='button';button.setAttribute('aria-pressed',String(template.id===templateId));
  button.addEventListener('click',()=>{templateId=template.id;renderQuickActions();renderQuick()});actions.append(button);
 });
}
function renderQuick(){
 const value=buildQuickPhrase(templateId,$('quickObject').value||objectId);
 if(!value)return;
 $('quickNl').textContent=value.nl;$('quickUk').textContent=value.uk;
}
function setupQuick(){
 const select=$('quickObject');
 fence.objects.forEach(object=>{const option=el('option','',object.icon+'  '+object.uk+' · '+object.nl);option.value=object.id;select.append(option)});
 select.value=objectId;select.addEventListener('change',renderQuick);
 $('quickHear').addEventListener('click',()=>hear($('quickNl').textContent,$('quickHear')));
 renderQuickActions();renderQuick();
}
function renderSpeak(){
 const queue=session.reviewQueue();
 speakId=queue[0]||fence.phrases[0].id;
 const phrase=phraseById(speakId);
 $('speakGoal').textContent=phrase.uk;
 $('speakInput').value='';$('speakAnswer').replaceChildren();$('speakFeedback').textContent=queue.length?'': 'Усі фрази вже повторені. Можеш почати ще раз.';
}
function revealSpeak(){
 const phrase=phraseById(speakId);
 const dutch=el('strong','',phrase.nl);dutch.lang='nl-BE';$('speakAnswer').replaceChildren(dutch);
 const sound=el('button','ll-sound','🔊 Послухати');sound.type='button';sound.addEventListener('click',()=>hear(phrase.nl,sound));$('speakAnswer').append(' ',sound);
 const attempt=$('speakInput').value.trim().toLocaleLowerCase('nl-BE').replace(/[.,!?;:]+/g,'').replace(/\s+/g,' ');
 const target=phrase.nl.toLocaleLowerCase('nl-BE').replace(/[.,!?;:]+/g,'').replace(/\s+/g,' ');
 $('speakFeedback').textContent=!attempt?'Послухай і повтори речення вголос.':attempt===target?'Чудово, слова збігаються!':'Порівняй свою фразу з правильною та повтори її ще раз.';
}
function setupSpeaking(){
 $('reveal').addEventListener('click',revealSpeak);
 $('speakInput').addEventListener('keydown',event=>{if(event.key==='Enter'){event.preventDefault();revealSpeak()}});
 $('speakDone').addEventListener('click',()=>{session.speak(speakId);renderSpeak()});
 const Recognition=window.SpeechRecognition||window.webkitSpeechRecognition;
 if(!Recognition){$('microphone').hidden=true;return}
 $('microphone').addEventListener('click',()=>{
  if(recognition){recognition.stop();return}
  recognition=new Recognition();recognition.lang='nl-BE';recognition.interimResults=false;recognition.maxAlternatives=1;
  $('microphone').textContent='■ Зупинити';
  recognition.onresult=event=>{$('speakInput').value=event.results[0][0].transcript;revealSpeak()};
  recognition.onerror=()=>{$('speakFeedback').textContent='Мікрофон зараз недоступний. Можна написати фразу.'};
  recognition.onend=()=>{recognition=null;$('microphone').textContent='🎤 Сказати'};
  try{recognition.start()}catch{recognition=null;$('microphone').textContent='🎤 Сказати';$('speakFeedback').textContent='Мікрофон не запустився. Можна написати фразу.'}
 });
}
function renderBank(){
 const list=$('phraseList');list.replaceChildren();
 const query=$('phraseSearch').value.trim();
 const phrases=searchPhrases(fence.phrases,query).filter(phrase=>!onlyFavourites||session.state.favourites.includes(phrase.id));
 if(!phrases.length){list.append(el('p','',query?'За цим запитом фраз немає. Спробуй інше слово.':'Тут з’являться фрази, які ти позначиш зірочкою.'));return}
 phrases.forEach(phrase=>{
  const row=el('div','ll-phrase');
  const main=el('button','ll-phrase-main');main.type='button';main.setAttribute('aria-label','Послухати: '+phrase.nl);
  const dutch=el('strong','',phrase.nl);dutch.lang='nl-BE';main.append(dutch,el('small','',phrase.uk));
  main.addEventListener('click',()=>hear(phrase.nl,main));
  const star=el('button','ll-favourite',session.state.favourites.includes(phrase.id)?'★':'☆');star.type='button';star.setAttribute('aria-label',(session.state.favourites.includes(phrase.id)?'Прибрати із збережених: ':'Зберегти: ')+phrase.nl);
  star.addEventListener('click',()=>{session.favourite(phrase.id);renderBank()});
  row.append(main,star);list.append(row);
 });
}
$('favouritesOnly').addEventListener('click',()=>{onlyFavourites=!onlyFavourites;$('favouritesOnly').textContent=onlyFavourites?'★ Показати всі':'☆ Лише збережені';renderBank()});
$('phraseSearch').addEventListener('input',renderBank);
setupQuick();setupSpeaking();renderStage();renderSpeak();renderBank();
