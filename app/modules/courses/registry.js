/* Learning languages of lerenbe.com: which courses exist, which one the learner is studying, and where each course keeps
   its progress. No DOM or network. See MULTILANG.md.

   Storage rule: the Dutch course (the original one) keeps every existing key unchanged, so the progress of current
   learners is never moved or renamed. Another language stores the same kind of data under the same key with a suffix:
   leren_path_v1 (Dutch) → leren_path_v1@en, leren_path_v1@fr. Shared by all languages (about the learner, not about a
   language): streak, points, minutes, daily goal, account and settings. Suffixed keys start with leren_/poly_, so the
   account sync and backups take them as they are, and modules/sync/merge.js applies the rule of the base key. */
(() => {
 'use strict';
 // status: 'live' = shown to learners; 'planned' = built behind the flag only (leren_multilang = "1"), not offered yet.
 // levels follow the Flemish adult-education profiles: Dutch NT2 (A1.1, A1.2, A2); English and French
 // "Europese talen groep 1, Richtgraad 1": 1.1 Breakthrough (A1) and 1.2 Waystage (A2), 120 lesson hours each.
 const COURSES={
  nl:{id:'nl',flag:'🇳🇱',status:'live',levels:['A1.1','A1.2','A2'],names:{uk:'Нідерландська',en:'Dutch',fr:'Néerlandais',ar:'الهولندية'}},
  en:{id:'en',flag:'🇬🇧',status:'planned',levels:['1.1','1.2'],names:{uk:'Англійська',en:'English',fr:'Anglais',ar:'الإنجليزية'}},
  fr:{id:'fr',flag:'🇫🇷',status:'planned',levels:['1.1','1.2'],names:{uk:'Французька',en:'French',fr:'Français',ar:'الفرنسية'}},
  // German: architecture only (same Flemish profile "Europese talen groep 1"); no course data yet.
  de:{id:'de',flag:'🇩🇪',status:'planned',levels:['1.1','1.2'],names:{uk:'Німецька',en:'German',fr:'Allemand',ar:'الألمانية'}}
 };
 // Voice for each target language (speech synthesis on the learner's device).
 const VOICE={nl:'nl-BE',en:'en-GB',fr:'fr-BE',de:'de-DE'};
 const DEFAULT='nl',LANG_KEY='leren_learn_lang',FLAG_KEY='leren_multilang';
 // Preview switch for testing new courses on a phone: open lerenbe.com/?multilang=1 (on) or ?multilang=0 (off).
 try{const q=new URLSearchParams(globalThis.location?.search||'').get('multilang');if(q==='1')globalThis.localStorage?.setItem(FLAG_KEY,'1');else if(q==='0')globalThis.localStorage?.removeItem(FLAG_KEY)}catch{}
 // Keys that hold results of ONE course. Everything else is shared by all languages.
 const PER_COURSE=new Set(['leren_path_v1','leren_path_rewards_v1','leren_mistakes','leren_skills_v2','leren_slips_v2','poly_progress','poly_toetsbest','poly_unlocked','leren_exam11','leren_exam12','leren_story','leren_ks_set','leren_course_exam_v1']);
 const get=(storage,k)=>{try{return storage.getItem(k)}catch{return null}};
 function preview(storage){return get(storage,FLAG_KEY)==='1'}
 // Courses the learner may pick: live ones, plus planned ones in preview mode.
 function available(storage){return Object.values(COURSES).filter(c=>c.status==='live'||preview(storage))}
 // The language being studied. Anything unknown or not available falls back to Dutch, so the app always works.
 function current(storage){const v=get(storage,LANG_KEY);return available(storage).some(c=>c.id===v)?v:DEFAULT}
 function choose(storage,id){if(!available(storage).some(c=>c.id===id))return false;try{storage.setItem(LANG_KEY,id);return true}catch{return false}}
 // Storage key of a per-course value for a language. Dutch: the key itself (existing data stays where it is).
 function key(base,lang=DEFAULT){
  if(!/^(leren_|poly_)[a-z0-9_]+$/.test(base))throw new Error('unknown key '+base);
  if(!COURSES[lang])throw new Error('unknown language '+lang);
  return lang===DEFAULT||!PER_COURSE.has(base)?base:base+'@'+lang;
 }
 const name=(id,ui)=>(COURSES[id]?.names[ui])||COURSES[id]?.names.uk||id;
 globalThis.LerenCourses={COURSES,VOICE,DEFAULT,LANG_KEY,FLAG_KEY,PER_COURSE,available,current,choose,key,name,preview};
})();
