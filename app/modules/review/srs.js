/* Spaced repetition for word cards. Pure functions, no DOM or storage.
   A card state is {seen,correct,wrong,streak,due,known} (stored in poly_progress); the format does not change.
   Right answers push the next review further away (1, 3, 7, 14, 30 days); a wrong answer brings the word back today
   and starts the steps again, so forgotten words come back more often. */
(()=>{'use strict';
 const DAY=864e5,STEPS=[1,3,7,14,30];
 // Days until the next review after `streak` right answers in a row.
 const interval=streak=>STEPS[Math.min(Math.max(streak,1),STEPS.length)-1];
 function update(s,ok,now=Date.now()){
  if(ok){s.correct++;s.streak++;s.due=now+interval(s.streak)*DAY}
  else{s.wrong++;s.streak=0;s.due=now}
  s.known=s.streak>=2;s.t=now;return s; // t: time of the answer, the newer answer decides the schedule when devices merge
 }
 // Higher = review sooner: words answered wrong more often, then words that waited longest past their date.
 const weight=(s,now=Date.now())=>(s.wrong-s.correct/2)*10+Math.min(30,Math.max(0,(now-s.due)/DAY));
 // Due cards (seen and past their date), most urgent first. `state(id)` returns the card state.
 function due(items,state,now=Date.now()){
  return items.filter(x=>{const s=state(x.id);return s.seen>0&&s.due<=now}).map((x,i)=>({x,i,w:weight(state(x.id),now)})).sort((a,b)=>b.w-a.w||a.i-b.i).map(o=>o.x);
 }
 globalThis.LerenSRS={DAY,STEPS,interval,update,weight,due};
})();
