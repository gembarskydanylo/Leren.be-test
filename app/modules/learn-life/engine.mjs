const unique=(items,allowed)=>[...new Set(Array.isArray(items)?items:[])].filter(id=>allowed.has(id));

export function createLifeSession(scenario,storage){
 const storeKey='leren_learn_life_v1_'+scenario.id;
 const tasks=scenario.stages.flatMap(stage=>stage.tasks),taskById=new Map(tasks.map(task=>[task.id,task]));
 const phraseIds=new Set(scenario.phrases.map(phrase=>phrase.id)),taskIds=new Set(taskById.keys());
 let saved={};
 try{saved=JSON.parse(storage.getItem(storeKey)||'{}')||{}}catch{}
 const state={
  done:unique(saved.done,taskIds),
  missed:unique(saved.missed,phraseIds),
  spoken:unique(saved.spoken,phraseIds),
  favourites:unique(saved.favourites,phraseIds)
 };
 function save(){try{storage.setItem(storeKey,JSON.stringify(state))}catch{}}
 function answer(taskId,phraseId){
  const task=taskById.get(taskId);
  if(!task||!task.choices.includes(phraseId))return null;
  const correct=phraseId===task.answer;
  if(correct){if(!state.done.includes(taskId))state.done.push(taskId)}
  else if(!state.missed.includes(task.answer))state.missed.push(task.answer);
  save();
  return {correct,answer:task.answer};
 }
 function complete(stageId){
  const stage=scenario.stages.find(stage=>stage.id===stageId);
  return stage?stage.tasks.filter(task=>state.done.includes(task.id)).length:0;
 }
 function next(stageId){
  const stage=scenario.stages.find(stage=>stage.id===stageId);
  return stage?.tasks.find(task=>!state.done.includes(task.id))||null;
 }
 function speak(phraseId){
  if(!phraseIds.has(phraseId))return false;
  if(!state.spoken.includes(phraseId))state.spoken.push(phraseId);
  state.missed=state.missed.filter(id=>id!==phraseId);
  save();return true;
 }
 function favourite(phraseId){
  if(!phraseIds.has(phraseId))return false;
  state.favourites=state.favourites.includes(phraseId)?state.favourites.filter(id=>id!==phraseId):[...state.favourites,phraseId];
  save();return state.favourites.includes(phraseId);
 }
 function reviewQueue(){
  return [...state.missed,...scenario.phrases.map(p=>p.id).filter(id=>!state.spoken.includes(id)&&!state.missed.includes(id))];
 }
 return {state,answer,complete,next,speak,favourite,reviewQueue,total:tasks.length,done:()=>state.done.length};
}
