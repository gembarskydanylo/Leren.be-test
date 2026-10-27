/* Interactive Dutch clock. No document-wide listeners; safe to mount again. */
const LerenClock = (() => {
 'use strict';
 const hours=['twaalf','een','twee','drie','vier','vijf','zes','zeven','acht','negen','tien','elf'];
 const copy={
  uk:{title:'Покрути годинник',intro:'Веди хвилинну стрілку пальцем або рухай повзунок. Відпусти — і послухай час. Крок — 5 хвилин.',hour:'Година',minutes:'Хвилини',listen:'Послухати ще раз',back:'До уроку',exact:'Рівна година: назва години + uur.',past:'{n} хв після поточної години.',before:'{n} хв до наступної години.',beforeHalf:'{n} хв до половини наступної години.',afterHalf:'{n} хв після половини наступної години.',half:'Half називає наступну годину: half {h} = {time}.',quarter:'Kwart = 15 хвилин.',alternate:'Також можна сказати: ',keys:'Стрілки клавіатури: ±5 хв; Page Up / Page Down: ±1 год.'},
  en:{title:'Turn the clock',intro:'Drag the minute hand or move the slider. Release to hear the time. Each step is 5 minutes.',hour:'Hour',minutes:'Minutes',listen:'Listen again',back:'Back to lesson',exact:'On the hour: hour name + uur.',past:'{n} minutes past the current hour.',before:'{n} minutes before the next hour.',beforeHalf:'{n} minutes before half past the current hour.',afterHalf:'{n} minutes after half past the current hour.',half:'Half names the next hour: half {h} = {time}.',quarter:'Kwart = 15 minutes.',alternate:'You can also say: ',keys:'Arrow keys: ±5 min; Page Up / Page Down: ±1 hour.'},
  fr:{title:'Tourne les aiguilles',intro:'Déplace l’aiguille des minutes ou le curseur. Relâche pour écouter. Chaque pas vaut 5 minutes.',hour:'Heure',minutes:'Minutes',listen:'Écouter encore',back:'Retour à la leçon',exact:'Heure pile : nom de l’heure + uur.',past:'{n} minutes après l’heure actuelle.',before:'{n} minutes avant l’heure suivante.',beforeHalf:'{n} minutes avant la demie.',afterHalf:'{n} minutes après la demie.',half:'Half indique l’heure suivante : half {h} = {time}.',quarter:'Kwart = 15 minutes.',alternate:'On peut aussi dire : ',keys:'Flèches : ±5 min ; Page Up / Page Down : ±1 heure.'},
  ar:{title:'حرّك عقارب الساعة',intro:'حرّك عقرب الدقائق أو شريط التمرير ثم ارفع إصبعك لسماع الوقت. كل خطوة تساوي 5 دقائق.',hour:'الساعة',minutes:'الدقائق',listen:'استمع مرة أخرى',back:'العودة إلى الدرس',exact:'الساعة تمامًا: اسم الساعة + uur.',past:'{n} دقائق بعد الساعة الحالية.',before:'{n} دقائق قبل الساعة التالية.',beforeHalf:'{n} دقائق قبل النصف.',afterHalf:'{n} دقائق بعد النصف.',half:'تشير half إلى الساعة التالية: half {h} = {time}.',quarter:'Kwart = 15 دقيقة.',alternate:'يمكنك أيضًا أن تقول: ',keys:'الأسهم: ±5 دقائق؛ Page Up / Page Down: ±ساعة.'}
 };
 const text=lang=>copy[lang]||copy.en;
 const wrap=n=>((n%1440)+1440)%1440;
 function timeInfo(total,lang='uk'){
  total=wrap(Math.round(total/5)*5);
  const h=Math.floor(total/60),m=total%60,cur=hours[h%12],next=hours[(h+1)%12],u=text(lang);
  const digital=String(h).padStart(2,'0')+':'+String(m).padStart(2,'0');
  const phrases=[`${cur} uur`,`vijf over ${cur}`,`tien over ${cur}`,`kwart over ${cur}`,`tien voor half ${next}`,`vijf voor half ${next}`,`half ${next}`,`vijf over half ${next}`,`tien over half ${next}`,`kwart voor ${next}`,`tien voor ${next}`,`vijf voor ${next}`];
  const key=m===0?'exact':m<=15?'past':m<30?'beforeHalf':m===30?'half':m<=40?'afterHalf':'before';
  const n=m<=15?m:m<30?30-m:m<=40?m-30:60-m;
  let hint=u[key].replace('{n}',n).replace('{h}',next).replace('{time}',digital);
  if(m===15||m===45)hint+=' '+u.quarter;
  if([20,25,35,40].includes(m))hint+=' '+u.half.replace('{h}',next).replace('{time}',String(h).padStart(2,'0')+':30');
  return {total,h,m,digital,phrase:phrases[m/5],hint,alternate:m===20?`twintig over ${cur}`:m===40?`twintig voor ${next}`:''};
 }
 // Unwrap the angle before snapping, so 57.5 minutes rolls into the next hour immediately.
 function dragTime(start,previousAngle,angle){
  const delta=((angle-previousAngle+540)%360)-180;
  return start+delta/6;
 }
 return {text,timeInfo,dragTime};
})();
