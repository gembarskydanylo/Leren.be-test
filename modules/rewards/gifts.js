/* Distinct, original vector gifts. Stable achievement IDs keep existing collections. */
(()=>{'use strict';
 const gifts={
 'xp-100':['medal','Медаль першого кроку','First-step medal','Médaille du premier pas','ميدالية البداية'],
 'xp-250':['backpack','Рюкзак дослідника','Explorer’s backpack','Sac de l’explorateur','حقيبة المستكشف'],
 'xp-500':['silver','Срібний кубок практики','Silver practice cup','Coupe d’argent','كأس التدريب الفضية'],
 'xp-1000':['gold','Золотий кубок поступу','Golden progress cup','Coupe du progrès','كأس التقدّم الذهبية'],
 'xp-2500':['crystal','Кришталевий кубок','Crystal trophy','Trophée de cristal','كأس بلورية'],
 'xp-5000':['crown','Корона наполегливості','Crown of determination','Couronne de persévérance','تاج المثابرة'],
 'xp-10000':['legend','Кубок легенди','Legend’s trophy','Coupe de légende','كأس الأسطورة'],
 'lesson-1':['notebook','Перший записник кота','Cat’s first notebook','Premier carnet du chat','أول دفتر للقط'],
 'lesson-5':['pencils','Кольорові олівці','Colouring pencils','Crayons de couleur','أقلام ملوّنة'],
 'lesson-10':['headphones','Навушники для практики','Practice headphones','Casque d’entraînement','سماعات التدريب'],
 'chapter-1':['compass','Компас мандрівника','Traveller’s compass','Boussole du voyageur','بوصلة المسافر'],
 'perfect-1':['star','Зірка уважності','Star of attention','Étoile de l’attention','نجمة الانتباه'],
 'streak-7':['scarf','Шарф наполегливості','Scarf of determination','Écharpe de persévérance','وشاح المثابرة']};
 let serial=0;
 const entry=b=>Object.hasOwn(gifts,b?.id)?gifts[b.id]:gifts['xp-100'];
 function title(b,lang){const i=['uk','en','fr','ar'].indexOf(lang);return entry(b)[i<0?2:i+1]}
 function svg(b){const kind=entry(b)[0],id='catGift'+(++serial),gold='url(#'+id+'g)',silver='url(#'+id+'s)',blue='url(#'+id+'b)';
 const star='<path d="m50 20 8 18 20 2-15 13 5 20-18-10-18 10 5-20-15-13 20-2z" fill="'+gold+'" stroke="#c57b11" stroke-width="2"/>';
 const cup=metal=>'<path d="M29 20H13v14q0 22 25 24M71 20h16v14q0 22-25 24" fill="none" stroke="#d09127" stroke-width="7"/><path d="M27 13h46v26q0 26-23 31-23-5-23-31z" fill="'+metal+'" stroke="#ac7628" stroke-width="2"/><path d="M36 22v17q0 14 10 19" fill="none" stroke="#ffffff88" stroke-width="5" stroke-linecap="round"/><path d="M50 70v18" stroke="#bf8c36" stroke-width="9"/><path d="M35 88h30l8 13H27z" fill="'+gold+'"/><rect x="25" y="100" width="50" height="7" rx="3" fill="#7e5230"/>';
 const shapes={
 medal:'<path d="M27 4h18l11 29-16 12z" fill="#1378c9"/><path d="M55 4h18L60 45 44 33z" fill="#f1c632"/><circle cx="50" cy="65" r="29" fill="'+gold+'" stroke="#b87819" stroke-width="3"/><circle cx="50" cy="65" r="22" fill="none" stroke="#fff2b7" stroke-width="2"/><path d="m50 48 5 10 12 2-9 8 2 12-10-6-10 6 2-12-9-8 12-2z" fill="#fff4ba"/>',
 backpack:'<path d="M38 25v-9q12-12 24 0v9" fill="none" stroke="#d69b2a" stroke-width="7"/><rect x="20" y="25" width="60" height="74" rx="18" fill="'+blue+'" stroke="#237f96" stroke-width="3"/><path d="M22 48q28 12 56 0" fill="none" stroke="#bbf7e6" stroke-width="3"/><rect x="30" y="61" width="40" height="29" rx="8" fill="#ffcf54" stroke="#d5a12c" stroke-width="2"/><rect x="42" y="42" width="16" height="13" rx="4" fill="'+gold+'"/><path d="M15 45v36M85 45v36" stroke="#f1bd4c" stroke-width="7" stroke-linecap="round"/>',
 silver:cup(silver)+'<path d="m50 27 5 9 10 1-8 7 2 11-9-6-9 6 2-11-8-7 10-1z" fill="#edf5ff" stroke="#8c9dad"/>',
 gold:cup(gold)+'<path d="M43 31q-10 12 0 24M57 31q10 12 0 24" fill="none" stroke="#8a5713" stroke-width="3"/><circle cx="50" cy="42" r="6" fill="#fff4bc"/>',
 crystal:'<path d="m50 6 31 28-14 41H33L19 34z" fill="'+blue+'" stroke="#3c9bb7" stroke-width="2"/><path d="m50 6-9 28 9 41 9-41z" fill="#d8fbff"/><path d="M19 34h62M34 16l7 18-8 41M66 16l-7 18 8 41" fill="none" stroke="#ffffffaa" stroke-width="2"/><rect x="44" y="75" width="12" height="15" fill="#73b5ca"/><path d="M31 90h38l8 13H23z" fill="'+silver+'"/>',
 crown:'<path d="m14 31 19 17 17-31 17 31 19-17-8 54H22z" fill="'+gold+'" stroke="#a56e1b" stroke-width="3"/><rect x="21" y="81" width="58" height="13" rx="4" fill="#e7a72a"/><circle cx="50" cy="65" r="9" fill="'+blue+'" stroke="#fff1a3" stroke-width="2"/><circle cx="15" cy="29" r="6" fill="#ffde6d"/><circle cx="50" cy="16" r="6" fill="#ffde6d"/><circle cx="85" cy="29" r="6" fill="#ffde6d"/>',
 legend:'<path d="M31 35 4 17q-2 35 30 44M69 35l27-18q2 35-30 44" fill="'+gold+'" stroke="#bb871b" stroke-width="2"/>'+cup(gold)+'<path d="m50 23 5 11 12 1-9 8 2 12-10-6-10 6 2-12-9-8 12-1z" fill="#fff5c2"/><path d="m9 80 2 5 5 2-5 2-2 5-2-5-5-2 5-2zM89 70l2 5 5 2-5 2-2 5-2-5-5-2 5-2z" fill="#e8ad26"/>',
 notebook:'<rect x="22" y="13" width="61" height="85" rx="8" fill="'+blue+'" stroke="#317f9b" stroke-width="3"/><path d="M32 15v81" stroke="#fff0be" stroke-width="5"/><rect x="43" y="34" width="28" height="33" rx="4" fill="#fff6d6"/><path d="M49 43h16M49 51h16M49 59h10" stroke="#87a5ad" stroke-width="3"/><path d="M15 30h13M15 45h13M15 60h13M15 75h13" stroke="#d69b2a" stroke-width="5" stroke-linecap="round"/>',
 pencils:'<path d="m22 16 13-2 9 70-5 16-10-13z" fill="#f48339" stroke="#c55c20" stroke-width="2"/><path d="m44 10 14 1-3 74-8 15-7-16z" fill="#5eb8ca" stroke="#2d899d" stroke-width="2"/><path d="m72 18 12 5-25 66-12 10-1-17z" fill="#f6cc41" stroke="#c79521" stroke-width="2"/><path d="m29 87 10 13 5-16M40 84l7 16 8-15M46 82l1 17 12-10" fill="#edc9a0"/><path d="m36 96 3 4 2-5M45 96l2 4 2-4M47 95v4l4-3" fill="#525363"/>',
 headphones:'<path d="M18 62V48q0-36 32-36t32 36v14" fill="none" stroke="#2d718d" stroke-width="13"/><path d="M21 45q0-28 29-28t29 28" fill="none" stroke="#8ce0de" stroke-width="4"/><rect x="10" y="53" width="25" height="40" rx="10" fill="'+blue+'" stroke="#24718c" stroke-width="3"/><rect x="65" y="53" width="25" height="40" rx="10" fill="'+blue+'" stroke="#24718c" stroke-width="3"/><path d="M22 61v24M78 61v24" stroke="#e8be43" stroke-width="5" stroke-linecap="round"/>',
 compass:'<circle cx="50" cy="59" r="36" fill="'+gold+'" stroke="#ac7b25" stroke-width="3"/><circle cx="50" cy="59" r="28" fill="#fff6d9"/><path d="m65 35-9 30-22 18 10-30z" fill="#e98047"/><path d="m34 83 10-30 12 12z" fill="#44aabc"/><circle cx="50" cy="59" r="5" fill="#e5b34a"/><path d="M42 21v-7q8-9 16 0v7" fill="none" stroke="#c59633" stroke-width="5"/>',
 star:'<path d="m22 71 1 32 27-12 27 12 1-32" fill="#56b8bb" stroke="#348e9d" stroke-width="2"/>'+star+'<circle cx="50" cy="46" r="8" fill="#fff5c6"/>',
 scarf:'<path d="M21 30q29-24 58 0v24q-29-19-58 0z" fill="#2585c5" stroke="#1c6d9e" stroke-width="3"/><path d="M22 46q28-15 56 0" stroke="#f4cc3a" stroke-width="10"/><path d="m49 47 24 2-1 50H49z" fill="#2585c5" stroke="#1c6d9e" stroke-width="3"/><path d="M50 68h23" stroke="#f4cc3a" stroke-width="12"/><path d="M52 98v8M60 98v8M68 98v8" stroke="#247cba" stroke-width="4"/>'};
 const s=document.createElementNS('http://www.w3.org/2000/svg','svg');s.setAttribute('viewBox','0 0 100 110');s.setAttribute('class','rw-cup');s.setAttribute('aria-hidden','true');s.dataset.gift=kind;s.innerHTML='<defs><linearGradient id="'+id+'g" x2=".8" y2="1"><stop stop-color="#fff0a6"/><stop offset=".45" stop-color="#ffc53e"/><stop offset="1" stop-color="#ca841c"/></linearGradient><linearGradient id="'+id+'s" x2=".8" y2="1"><stop stop-color="#f7fcff"/><stop offset=".5" stop-color="#becfdf"/><stop offset="1" stop-color="#7d96ae"/></linearGradient><linearGradient id="'+id+'b" x2=".8" y2="1"><stop stop-color="#b3f8ed"/><stop offset=".5" stop-color="#5cbfc9"/><stop offset="1" stop-color="#3286ac"/></linearGradient></defs>'+shapes[kind];return s;
 }
 window.LerenGifts={gifts,title,svg};
})();
