/* Card pictures: food, drinks and kitchen. */
(function(L){
'use strict';
const {A,K,T,plate,star,C}=L,{SK,HR,RD,BL,YE,GR,BR,GY,DK,LB,PK,OR,INK,W,DB}=C;
const cup=(x=20,y=24,c=W)=>`<path d="M${x} ${y}h22v14q0 10-11 10t-11-10z" fill="${c}"/><path d="M${x+22} ${y+4}q8 0 8 6t-8 6"/>`;
const glass=(x,y,w,h,fill,lvl=.35)=>`<path d="M${x} ${y}h${w}l-2 ${h}h${-(w-4)}z" fill="${W}"/><path d="M${x+1} ${y+h*lvl}h${w-2}l${-(1-lvl)*2} ${h*(1-lvl)}h${-(w-4)}z" fill="${fill}" stroke="none"/><path d="M${x} ${y}h${w}l-2 ${h}h${-(w-4)}z"/>`;
const bottle=(x,y,c,label)=>`<path d="M${x+5} ${y}h6v8q5 3 5 9v29h-16V17q0-6 5-9z" fill="${c}"/><rect x="${x+5}" y="${y-3}" width="6" height="4" fill="${DK}"/>${label?`<rect x="${x}" y="${y+22}" width="16" height="12" fill="${W}"/>`:''}`;
const steam=(x)=>`<path d="M${x} 16q-3-4 0-8M${x+7} 16q-3-4 0-8" stroke="${GY}" stroke-width="2"/>`;
Object.assign(A,{
 '☕':K('coffee',steam(26)+cup(18,22,W)+`<ellipse cx="29" cy="24" rx="10" ry="2" fill="${BR}" stroke="none"/>`+`<ellipse cx="31" cy="52" rx="20" ry="4" fill="${W}"/>`),
 '🍵':K('tea',steam(26)+cup(18,22,W)+`<path d="M26 24v12" /><rect x="22" y="34" width="8" height="7" fill="${YE}"/>`+`<ellipse cx="31" cy="52" rx="20" ry="4" fill="${W}"/>`),
 '🥛':K('milk, glass',`<path d="M20 8h24l-3 48H23z" fill="${LB}"/><path d="M21.2 20h21.6l-2.3 34H23.5z" fill="${W}" stroke="none"/><path d="M20 8h24l-3 48H23z"/><path d="M22 20q5 3 10 0t10 0"/>`),
 '💧':K('water',`<path d="M32 6Q16 28 16 40a16 16 0 0 0 32 0Q48 28 32 6z" fill="#8FC7F0"/><path d="M24 40q0 6 6 8" stroke="${W}" stroke-width="2.4"/>`),
 '🥤':K('soft drink',`<path d="M36 4l-4 14" stroke="${RD}" stroke-width="2.6"/><path d="M18 18h28l-4 40H22z" fill="${RD}"/><path d="M16 18h32" stroke-width="3"/><path d="M20 30h24" stroke="${W}" stroke-width="3"/>`),
 '🧃':K('juice',`<path d="M18 16h24v42H18z" fill="${OR}"/><path d="M18 16l6-8h24l-6 8M42 16l6-8v42l-6 8" fill="#D9712A"/><path d="M38 8l4-6" stroke-width="2.4"/><circle cx="30" cy="38" r="6" fill="${YE}"/>`),
 '🍺':K('beer',`<path d="M16 18h26v36q0 4-4 4H20q-4 0-4-4z" fill="${YE}"/><path d="M42 24h6q4 0 4 4v12q0 4-4 4h-6"/><path d="M14 18q0-8 8-8 3-4 8-2 4-3 9 0 6 0 5 10z" fill="${W}"/>`),
 '🍻':K('cheers',`<g transform="rotate(-12 22 36)"><path d="M10 22h18v30H10z" fill="${YE}"/><path d="M8 22q0-6 6-6 3-3 7-1 4-2 7 1 3 1 2 6z" fill="${W}"/></g><g transform="rotate(12 42 36)"><path d="M36 22h18v30H36z" fill="${YE}"/><path d="M34 22q0-6 6-6 3-3 7-1 4-2 7 1 3 1 2 6z" fill="${W}"/></g>`),
 '🍷':K('wine',`<path d="M20 8h24q2 18-12 22-14-4-12-22z" fill="${W}"/><path d="M21 16h22q-1 12-11 14-10-2-11-14z" fill="#9B2C34" stroke="none"/><path d="M20 8h24q2 18-12 22-14-4-12-22z"/><path d="M32 30v20M22 56h20"/>`),
 '🍞':K('bread',`<path d="M10 30q0-14 22-14t22 14q0 4-4 4v18q0 4-4 4H18q-4 0-4-4V34q-4 0-4-4z" fill="#E8A857"/><path d="M14 30q2-10 18-10t18 10" stroke="#B9772A"/>`),
 '🥖':K('baguette',`<path d="M8 50Q4 44 12 38L44 12q8-6 12 0t-4 12L22 52q-8 6-14-2z" fill="#E8A857"/><path d="M20 38l6 6M28 30l6 6M36 22l6 6" stroke="#B9772A"/>`),
 '🥐':K('croissant',`<path d="M8 44q4-18 24-18t24 18q-8 6-24 6T8 44z" fill="#E8A857"/><path d="M20 30l4 18M32 27v22M44 30l-4 18" stroke="#B9772A" stroke-width="1.4"/>`),
 '🥪':K('sandwich',`<path d="M8 40L32 14l24 26z" fill="#F7E3C4"/><path d="M8 40h48l-3 6H11z" fill="${GR}"/><path d="M11 46h42l-2 4H13z" fill="${RD}"/><path d="M8 50h48l-3 6H11z" fill="#F7E3C4"/>`),
 '🧈':K('butter',`<path d="M10 40l14-12h30l-14 12z" fill="#FBE38E"/><path d="M10 40h30v12H10zM40 40l14-12v12l-14 12" fill="${YE}"/>`+plate(32,54,26,5)),
 '🧀':K('cheese',`<path d="M8 42l40-22 8 8v20H8z" fill="${YE}"/><path d="M8 42h48" /><circle cx="20" cy="48" r="2.5" fill="#E0A800" stroke="none"/><circle cx="36" cy="50" r="3" fill="#E0A800" stroke="none"/><circle cx="46" cy="34" r="2.5" fill="#E0A800" stroke="none"/>`),
 '🥚':K('egg',`<path d="M32 8q16 0 16 28a16 16 0 0 1-32 0q0-28 16-28z" fill="#FBF3E4"/><path d="M24 26q2-8 6-10" stroke="${W}" stroke-width="2.4"/>`),
 '🍳':K('frying an egg',`<path d="M46 40l14 14" stroke="${DK}" stroke-width="5"/><circle cx="28" cy="32" r="22" fill="${DK}"/><path d="M18 30q-4-10 8-12 10-4 14 4 8 4 2 12-4 8-14 6-10 0-10-10z" fill="${W}" stroke="none"/><circle cx="29" cy="30" r="6" fill="${YE}" stroke="none"/>`),
 '🥣':K('bowl',`<path d="M6 30h52q0 24-26 24T6 30z" fill="${BL}"/><path d="M12 30q20-8 40 0" fill="#F7E3C4"/><circle cx="24" cy="28" r="2" fill="#B9772A" stroke="none"/><circle cx="36" cy="27" r="2" fill="#B9772A" stroke="none"/><path d="M40 28l14-20" stroke-width="3" stroke="${GY}"/>`),
 '🍲':K('hot meal',steam(26)+`<path d="M8 30h48v4q0 20-24 20T8 34z" fill="${OR}"/><path d="M8 30h48" stroke-width="3"/><path d="M4 32h4M56 32h4" stroke-width="3"/><path d="M14 30q4-6 10-2 6-6 12 0 6-4 12 2" fill="${YE}"/>`),
 '🍽️':K('meal',plate(32,40,18,16)+`<path d="M6 18v14M4 18v8q0 3 2 3t2-3v-8M6 32v24" stroke-width="1.6"/><path d="M58 18q-6 4-6 14h6M58 18v38" stroke-width="1.6"/>`),
 '🍴':K('cutlery',`<path d="M22 8v16M18 8v12q0 6 4 6t4-6V8M22 26v30" stroke-width="2.4"/><path d="M42 8q-8 6-8 20h8M42 8v48" stroke-width="2.4"/>`),
 '🔪':K('knife',`<path d="M8 46L46 10q6 0 4 8L20 50z" fill="${GY}"/><path d="M20 50l-8 8q-4 2-6-2l6-8" fill="${BR}"/>`),
 '🥄':K('spoon',`<ellipse cx="22" cy="20" rx="10" ry="13" transform="rotate(-40 22 20)" fill="${GY}"/><path d="M28 28l26 26" stroke-width="4" stroke="${GY}"/><path d="M28 28l26 26"/>`),
 '🧂':K('salt',`<path d="M22 22h20l4 34H18z" fill="${W}"/><path d="M22 22q0-12 10-12t10 12z" fill="${GY}"/><circle cx="29" cy="15" r="1" fill="${INK}" stroke="none"/><circle cx="35" cy="15" r="1" fill="${INK}" stroke="none"/>`+T(32,44,'S',12,DB)),
 '🍎':K('apple',`<path d="M32 18q-6-4-14-2-10 4-8 18 2 18 14 22 4 2 8-1 4 3 8 1 12-4 14-22 2-14-8-18-8-2-14 2z" fill="${RD}"/><path d="M32 18q0-8 4-12" stroke="${BR}" stroke-width="2.4"/><path d="M34 12q8-6 14 0-6 6-14 0z" fill="${GR}"/>`),
 '🍏':K('green apple',`<path d="M32 18q-6-4-14-2-10 4-8 18 2 18 14 22 4 2 8-1 4 3 8 1 12-4 14-22 2-14-8-18-8-2-14 2z" fill="#9BD86B"/><path d="M32 18q0-8 4-12" stroke="${BR}" stroke-width="2.4"/><path d="M34 12q8-6 14 0-6 6-14 0z" fill="${GR}"/>`),
 '🍌':K('banana',`<path d="M10 22q2 26 26 30 16 2 20-6-20 2-30-10Q18 26 18 18z" fill="${YE}"/><path d="M10 22l2-6 6 2" fill="${BR}"/>`),
 '🍓':K('strawberry',`<path d="M32 58Q12 46 12 30q0-10 20-10t20 10q0 16-20 28z" fill="${RD}"/><path d="M20 18l12 6 12-6-4 8h-16z" fill="${GR}"/><g fill="${YE}" stroke="none"><circle cx="24" cy="32" r="1.3"/><circle cx="32" cy="36" r="1.3"/><circle cx="40" cy="32" r="1.3"/><circle cx="28" cy="44" r="1.3"/><circle cx="36" cy="44" r="1.3"/></g>`),
 '🍇':K('grapes',`<path d="M32 12V6M32 10q8-6 14 0" stroke="${GR}" stroke-width="2.4"/>`+[[24,18],[34,18],[44,18],[19,28],[29,28],[39,28],[24,38],[34,38],[29,48]].map(([x,y])=>`<circle cx="${x}" cy="${y}" r="6" fill="#8E5CC2"/>`).join('')),
 '🍅':K('tomato',`<circle cx="32" cy="36" r="20" fill="${RD}"/><path d="M22 18l10 5 10-5-4 7h-12z" fill="${GR}"/><path d="M20 30q2-6 8-8" stroke="${W}" stroke-width="2.4"/>`),
 '🥒':K('cucumber',`<path d="M10 48Q6 40 16 34L44 14q10-6 12 2t-8 14L20 52q-8 4-10-4z" fill="#6DBB5A"/><g fill="#3F8A36" stroke="none"><circle cx="24" cy="38" r="1.4"/><circle cx="34" cy="30" r="1.4"/><circle cx="44" cy="22" r="1.4"/><circle cx="30" cy="40" r="1.4"/></g>`),
 '🥦':K('broccoli, vegetables',`<path d="M26 34l-4 22h20l-4-22z" fill="#9BD86B"/><circle cx="20" cy="26" r="10" fill="${GR}"/><circle cx="32" cy="20" r="11" fill="${GR}"/><circle cx="44" cy="26" r="10" fill="${GR}"/><circle cx="32" cy="32" r="9" fill="${GR}"/>`),
 '🥔':K('potato',`<path d="M10 36q0-16 22-18 20-2 22 14 2 16-20 18-24 2-24-14z" fill="#D9A866"/><g fill="#A87A3A" stroke="none"><circle cx="22" cy="30" r="1.6"/><circle cx="36" cy="26" r="1.6"/><circle cx="42" cy="38" r="1.6"/><circle cx="26" cy="42" r="1.6"/></g>`),
 '🥡':K('crisps',`<path d="M14 10h36l-4 6 4 6-4 6 4 6-4 6 4 6-4 6 4 6H14l4-6-4-6 4-6-4-6 4-6-4-6 4-6z" fill="${RD}"/>`+T(32,32,'CHIPS',9,W)+`<ellipse cx="32" cy="42" rx="8" ry="5" fill="${YE}"/>`),
 '🧅':K('onion',`<path d="M32 8q4 6 4 10 16 4 16 22 0 16-20 16T12 40q0-18 16-22 0-4 4-10z" fill="#E3B37A"/><path d="M32 22q-10 8-8 30M32 22q10 8 8 30M32 22v32" stroke="#B9772A"/>`),
 '🍟':K('fries',`<path d="M20 26l-4-18M26 26l-2-20M32 26V6M38 26l2-20M44 26l4-18" stroke="${YE}" stroke-width="5"/><path d="M14 24h36l-4 32H18z" fill="${RD}"/><path d="M17 34h30" stroke="${W}" stroke-width="3"/>`),
 '🍔':K('hamburger',`<path d="M10 28q0-16 22-16t22 16z" fill="#E8A857"/><path d="M8 32h48l-4 4-4-3-4 3-4-3-4 3-4-3-4 3-4-3-4 3-4-3z" fill="${GR}"/><rect x="9" y="36" width="46" height="8" rx="4" fill="#7A4A2A"/><path d="M10 46h44q0 8-8 8H18q-8 0-8-8z" fill="#E8A857"/><g fill="${W}" stroke="none"><circle cx="24" cy="20" r="1"/><circle cx="34" cy="17" r="1"/><circle cx="42" cy="22" r="1"/></g>`),
 '🍕':K('pizza',`<path d="M32 58L8 14q24-12 48 0z" fill="#F2C36B"/><path d="M8 14q24-12 48 0l-3 6q-21-10-42 0z" fill="#E8A857"/><circle cx="28" cy="24" r="4" fill="${RD}"/><circle cx="38" cy="30" r="4" fill="${RD}"/><circle cx="31" cy="40" r="3.5" fill="${RD}"/>`),
 '🥩':K('meat',`<path d="M12 30q4-16 24-16 20 0 20 18 0 20-22 20-10 0-12-6-12 0-10-16z" fill="#D9545C"/><path d="M18 30q4-10 16-10t14 10" stroke="${W}" stroke-width="2.4"/><circle cx="38" cy="34" r="4" fill="${W}"/>`),
 '🥓':K('ham',`<path d="M8 22q12-8 24 0t24 0v14q-12 8-24 0t-24 0z" fill="#E88A8A"/><path d="M8 28q12-8 24 0t24 0" stroke="${W}" stroke-width="2.4"/>`+`<path d="M8 40q12-8 24 0t24 0v8q-12 8-24 0t-24 0z" fill="#E88A8A"/>`),
 '🍗':K('chicken',`<path d="M30 34q-16 8-20-6-2-16 16-20 16-2 18 12 0 8-8 12z" fill="#D99A5B"/><path d="M34 34l14 14" stroke="${W}" stroke-width="5"/><path d="M34 34l14 14"/><circle cx="50" cy="48" r="3.5" fill="${W}"/><circle cx="46" cy="52" r="3.5" fill="${W}"/>`),
 '🐟':K('fish',`<path d="M8 32q16-18 36-6l12-8v28l-12-8Q24 50 8 32z" fill="#7FA8D8"/><circle cx="18" cy="30" r="2" fill="${INK}" stroke="none"/><path d="M28 26q4 6 0 12"/>`),
 '🥗':K('salad',`<path d="M6 32h52q0 22-26 22T6 32z" fill="${W}"/><path d="M10 32q2-10 10-8 4-8 12-4 8-4 12 4 8-2 10 8z" fill="${GR}"/><circle cx="24" cy="28" r="4" fill="${RD}"/><circle cx="40" cy="27" r="3.5" fill="${RD}"/><path d="M30 24h6" stroke="${YE}" stroke-width="3"/>`),
 '🍚':K('rice',`<path d="M6 32h52q0 22-26 22T6 32z" fill="${BL}"/><path d="M10 32q2-14 22-14t22 14z" fill="${W}"/><path d="M20 26l2-1M28 22l2 1M36 25l2-1M44 28l1-2M26 29l2 1" stroke-width="1.4"/>`),
 '🍝':K('pasta',plate(32,44,26,9)+`<path d="M14 40q4-14 18-14t18 14q-18 6-36 0z" fill="${YE}"/><path d="M18 36q6-6 14 0t14 0M20 40q6-4 12 0t12 0" stroke="#D9A830"/><circle cx="32" cy="32" r="4" fill="${RD}"/><path d="M44 30l10-20M48 32l8-18" stroke-width="2"/>`),
 '🥫':K('tin',`<rect x="16" y="14" width="32" height="40" rx="3" fill="${RD}"/><ellipse cx="32" cy="14" rx="16" ry="4" fill="${GY}"/><rect x="16" y="26" width="32" height="16" fill="${W}"/>`+T(32,38,'ketchup',7,RD)),
 '🫘':K('beans, hummus',`<path d="M6 34h52q0 20-26 20T6 34z" fill="${BL}"/><path d="M10 34q2-10 22-10t22 10z" fill="#E3C493"/><path d="M24 30q8-4 16 0" stroke="#B9772A"/><circle cx="32" cy="30" r="2" fill="${GR}" stroke="none"/>`),
 '🍪':K('biscuit',`<circle cx="32" cy="32" r="22" fill="#D9A866"/><g fill="#6B4226" stroke="none"><circle cx="24" cy="24" r="3"/><circle cx="38" cy="22" r="2.5"/><circle cx="40" cy="38" r="3"/><circle cx="26" cy="40" r="2.5"/><circle cx="32" cy="31" r="2"/></g>`),
 '🍬':K('sweet',`<path d="M8 22l10 10-10 10zM56 22L46 32l10 10z" fill="${PK}"/><circle cx="32" cy="32" r="14" fill="${PK}"/><path d="M22 26q10-4 20 12M24 38q8 0 16-12" stroke="${W}" stroke-width="2.4"/>`),
 '🍫':K('chocolate',`<rect x="12" y="10" width="40" height="44" rx="3" fill="#7A4A2A"/><path d="M12 25h40M12 40h40M25 10v44M39 10v44" stroke="#5A3418"/><path d="M12 36l40-14v32H12z" fill="${RD}"/>`+T(32,48,'choco',8,W)),
 '🍮':K('dessert',`<path d="M14 44l6-24h24l6 24z" fill="#F2C36B"/><path d="M20 20h24q-2 8-12 8t-12-8z" fill="#9B5A2A"/>`+plate(32,48,24,6)),
 '🍓🥛':K('',''),
});
delete A['🍓🥛'];
})(LerenCardArt);
