/* Card pictures: places, transport, nature, weather and signs. */
(function(L){
'use strict';
const {A,K,T,arrow,star,C}=L,{SK,HR,RD,BL,YE,GR,BR,GY,DK,LB,PK,OR,INK,W,DB}=C;
const sun=(x,y,r)=>`<circle cx="${x}" cy="${y}" r="${r}" fill="${YE}" stroke="#C48A12"/>`+Array.from({length:8},(_,i)=>{const a=i*Math.PI/4,c=Math.cos(a),s=Math.sin(a);return `<path d="M${(x+c*(r+3)).toFixed(1)} ${(y+s*(r+3)).toFixed(1)}L${(x+c*(r+7)).toFixed(1)} ${(y+s*(r+7)).toFixed(1)}" stroke="#C48A12" stroke-width="2"/>`}).join('');
const cloud=(x,y,c=W)=>`<path d="M${x} ${y}h28q6 0 6-6t-7-6q-2-8-10-8t-10 8q-7 0-7 6t0 6z" fill="${c}"/>`;
const house=(roof=RD,wall=W)=>`<path d="M5 32L32 8l27 24z" fill="${roof}"/><rect x="12" y="32" width="40" height="24" fill="${wall}"/><rect x="27" y="40" width="10" height="16" fill="${BR}"/><rect x="16" y="37" width="8" height="8" fill="${LB}"/><rect x="41" y="37" width="8" height="8" fill="${LB}"/>`;
const sign=(inner,c=RD)=>`<circle cx="32" cy="32" r="24" fill="${c}"/>`+inner;
const badge=(txt,c=BL)=>`<rect x="6" y="18" width="52" height="28" rx="6" fill="${c}"/>`+T(32,38,txt,15,W);
const flower=(x,y,c)=>`<circle cx="${x}" cy="${y-5}" r="4" fill="${c}"/><circle cx="${x+5}" cy="${y}" r="4" fill="${c}"/><circle cx="${x}" cy="${y+5}" r="4" fill="${c}"/><circle cx="${x-5}" cy="${y}" r="4" fill="${c}"/><circle cx="${x}" cy="${y}" r="3" fill="${YE}"/>`;
Object.assign(A,{
 '🏠':K('house',house()),
 '🏡':K('house with garden',house(OR)+`<path d="M2 56h60" stroke="${GR}" stroke-width="3"/><circle cx="8" cy="48" r="5" fill="${GR}"/><circle cx="57" cy="48" r="5" fill="${GR}"/>`),
 '🏢':K('office building',`<rect x="14" y="6" width="36" height="52" fill="${GY}"/>`+Array.from({length:12},(_,i)=>`<rect x="${19+(i%3)*10}" y="${11+Math.floor(i/3)*10}" width="6" height="6" fill="${LB}"/>`).join('')+`<rect x="27" y="50" width="10" height="8" fill="${BR}"/>`),
 '🏙️':K('city',`<rect x="6" y="24" width="14" height="32" fill="${GY}"/><rect x="22" y="10" width="16" height="46" fill="${BL}"/><rect x="40" y="18" width="18" height="38" fill="${GY}"/><path d="M26 16h3M33 16h3M26 24h3M33 24h3M26 32h3M33 32h3M10 30h6M10 38h6M45 24h8M45 32h8M45 40h8" stroke="${W}" stroke-width="2"/><path d="M2 56h60"/>`),
 '🌃':K('city at night',`<rect x="2" y="2" width="60" height="60" rx="8" fill="#2B3A67" stroke="none"/><path d="M48 10a7 7 0 1 0 6 10 6 6 0 0 1-6-10z" fill="${YE}" stroke="none"/><rect x="8" y="30" width="12" height="28" fill="${DK}"/><rect x="22" y="20" width="14" height="38" fill="${DK}"/><rect x="38" y="32" width="16" height="26" fill="${DK}"/><path d="M12 36h4M12 44h4M26 26h3M31 26h3M26 34h3M42 38h8M42 46h8" stroke="${YE}" stroke-width="2"/>`),
 '🏛️':K('museum, town hall',`<path d="M6 22L32 8l26 14z" fill="${GY}"/><rect x="8" y="22" width="48" height="5" fill="${GY}"/><path d="M14 27v22M24 27v22M34 27v22M44 27v22" stroke-width="4" stroke="${GY}"/><path d="M14 27v22M24 27v22M34 27v22M44 27v22" stroke-opacity=".0"/><rect x="6" y="49" width="52" height="7" fill="${GY}"/>`),
 '🏥':K('hospital',`<rect x="10" y="14" width="44" height="42" fill="${W}"/><rect x="24" y="20" width="16" height="16" rx="2" fill="${RD}" stroke="none"/><path d="M32 23v10M27 28h10" stroke="${W}" stroke-width="3"/><path d="M16 42h6M28 42h8M42 42h6" stroke="${LB}" stroke-width="5"/><rect x="28" y="48" width="8" height="8" fill="${LB}"/>`),
 '⛪':K('church',`<path d="M32 4v10M27 8h10" stroke-width="2.4"/><path d="M22 26l10-12 10 12z" fill="${RD}"/><rect x="22" y="26" width="20" height="30" fill="${W}"/><path d="M8 56V36l14-8v28M56 56V36l-14-8v28" fill="${GY}"/><path d="M28 56V46a4 4 0 0 1 8 0v10" fill="${BR}"/>`),
 '💒':K('wedding',`<path d="M22 26l10-12 10 12z" fill="${PK}"/><rect x="18" y="26" width="28" height="30" fill="${W}"/><path d="M32 46q-8-6-8-10a4.3 4.3 0 0 1 8-1.5a4.3 4.3 0 0 1 8 1.5q0 4-8 10z" fill="${RD}" stroke="none"/><path d="M32 4v8M28 8h8" stroke-width="2.4"/>`),
 '🚉':K('station',`<rect x="14" y="8" width="36" height="36" rx="6" fill="${YE}"/><rect x="18" y="13" width="28" height="13" rx="2" fill="${LB}"/><circle cx="22" cy="35" r="3" fill="${INK}" stroke="none"/><circle cx="42" cy="35" r="3" fill="${INK}" stroke="none"/><path d="M20 44l-6 12M44 44l6 12M16 52h32" stroke-width="2.4"/>`),
 '🚌':K('bus',`<rect x="8" y="10" width="48" height="38" rx="6" fill="${YE}"/><rect x="12" y="16" width="40" height="14" rx="2" fill="${LB}"/><path d="M32 16v14"/><circle cx="18" cy="48" r="5" fill="${DK}"/><circle cx="46" cy="48" r="5" fill="${DK}"/><circle cx="14" cy="38" r="2.4" fill="${W}"/><circle cx="50" cy="38" r="2.4" fill="${W}"/>`),
 '🚋':K('tram',`<path d="M24 4h16M32 4v6" stroke-width="2.4"/><rect x="12" y="10" width="40" height="40" rx="6" fill="${RD}"/><rect x="16" y="16" width="32" height="14" rx="2" fill="${LB}"/><circle cx="20" cy="40" r="2.4" fill="${W}"/><circle cx="44" cy="40" r="2.4" fill="${W}"/><path d="M18 50l-4 8M46 50l4 8M8 58h48" stroke-width="2.4"/>`),
 '🚏':K('bus stop',`<path d="M32 22v34M22 58h20" stroke-width="3"/><circle cx="32" cy="16" r="11" fill="${W}"/>`+T(32,20,'H',12,GR)),
 '🚲':K('bicycle',`<circle cx="16" cy="40" r="11" fill="${W}"/><circle cx="48" cy="40" r="11" fill="${W}"/><path d="M16 40l10-16h16l6 16M26 24l6 16H16M42 24l-2-8h-6M24 18h6" stroke="${RD}" stroke-width="2.4"/>`),
 '⛵':K('sailing boat, sea',`<rect x="2" y="44" width="60" height="16" fill="${LB}" stroke="none"/><path d="M30 6v34M30 9l17 28H30zM28 15L15 37h13z" fill="${W}"/><path d="M13 40h40l-6 8H19z" fill="${BR}"/><path d="M4 54q6-5 12 0t12 0 12 0 12 0 12 0" stroke="${DB}"/>`),
 '🗺️':K('map',`<path d="M6 14l16-6 20 6 16-6v42l-16 6-20-6-16 6z" fill="#E8F3D9"/><path d="M22 8v42M42 14v42"/><path d="M10 34q8-6 14 0t14-2 14 4" stroke="${DB}" stroke-width="2"/><path d="M48 22l4 4m0-4l-4 4" stroke="${RD}" stroke-width="2.4"/>`),
 '📍':K('place, meeting point',`<path d="M32 58Q12 34 12 24a20 20 0 0 1 40 0q0 10-20 34z" fill="${RD}"/><circle cx="32" cy="24" r="7" fill="${W}"/>`),
 '🚸':K('children crossing',`<path d="M32 6l26 46H6z" fill="${YE}"/>`+`<g transform="translate(16 18) scale(.5)">${L.person(0,1,INK,INK)}</g><g transform="translate(28 22) scale(.42)">${L.person(0,1,INK,INK)}</g>`),
 '🌳':K('tree, park',`<path d="M28 40h8v18h-8z" fill="${BR}"/><circle cx="32" cy="24" r="16" fill="${GR}"/><circle cx="20" cy="32" r="10" fill="${GR}"/><circle cx="44" cy="32" r="10" fill="${GR}"/>`),
 '🌱':K('plant, garden',`<path d="M32 56V30"/><path d="M32 36q-18 0-18-16 16 0 18 16zM32 30q14 0 16-14-14 0-16 14z" fill="${GR}"/><path d="M14 56h36" stroke="${BR}" stroke-width="4"/>`),
 '🌿':K('herbs',`<path d="M16 56Q30 36 46 8"/><path d="M24 44q-14-2-14-14 12 2 14 14zM30 34q-12-4-10-16 10 4 10 16zM36 24q-8-6-4-16 8 6 4 16zM28 40q12 2 18-8-12-2-18 8zM34 30q10 0 14-10-10 0-14 10z" fill="#6DBB5A"/>`),
 '🌷':K('tulip',`<path d="M32 58V30" stroke="${GR}" stroke-width="2.6"/><path d="M32 46q-14-6-16-16 12 2 16 16zM32 50q12-4 14-14-10 2-14 14z" fill="${GR}"/><path d="M20 10l6 8 6-10 6 10 6-8v14q0 10-12 10t-12-10z" fill="${RD}"/>`),
 '🌸':K('blossom, spring',flower(32,30,PK).replace(/r="4"/g,'r="8"').replace(/cy="25"/,'cy="20"').replace(/cx="37"/,'cx="42"').replace(/cy="35"/,'cy="40"').replace(/cx="27"/,'cx="22"').replace('r="3"','r="5"')),
 '💐':K('bunch of flowers',`<path d="M22 58l10-24 10 24z" fill="${PK}"/><path d="M32 34L20 22M32 34V16M32 34l12-12" stroke="${GR}" stroke-width="2"/>`+flower(20,20,RD)+flower(32,14,YE.replace('F2','E0'))+flower(44,20,'#8E5CC2')),
 '☀️':K('sun',sun(32,32,12)),
 '🌤️':K('sun and clouds',sun(24,24,9)+cloud(26,46)),
 '🌅':K('early morning, sunrise',`<rect x="2" y="40" width="60" height="20" fill="${LB}" stroke="none"/><path d="M14 40a18 18 0 0 1 36 0z" fill="${YE}" stroke="#C48A12"/><path d="M32 12v8M14 20l5 5M50 20l-5 5M6 40h52" stroke="#C48A12" stroke-width="2"/><path d="M12 48h12M30 48h22M18 54h28" stroke="${W}" stroke-width="2"/>`),
 '🌙':K('evening, night',`<path d="M38 8a22 22 0 1 0 18 34A18 18 0 0 1 38 8z" fill="${YE}"/>`+star(18,16,3.5,YE)+star(14,30,2.5,YE)),
 '💨':K('air, blowing',`<path d="M8 22h30q8 0 8-7t-7-7M8 34h40q8 0 8 7t-7 7M8 46h22" stroke="${DB}" stroke-width="3"/>`),
 '🐘':K('big (elephant)',`<path d="M12 46V28q0-14 18-14h8q14 0 14 14v18h-8V36h-4v10h-8V36h-8v10z" fill="${GY}"/><path d="M50 28q8 2 6 14-1 6-6 4" fill="${GY}"/><circle cx="44" cy="24" r="2" fill="${INK}" stroke="none"/><path d="M30 18q-6 6-2 12" stroke-opacity=".5"/>`),
 '🐜':K('small (ant)',`<ellipse cx="18" cy="34" rx="6" ry="5" fill="${INK}"/><ellipse cx="30" cy="34" rx="5" ry="4" fill="${INK}"/><circle cx="41" cy="31" r="5" fill="${INK}"/><path d="M24 36l-4 8M28 37l2 8M32 37l6 7M24 32l-4-8M30 31l2-8M44 27l4-8M42 26l0-8"/>`),
 '🐇':K('fast (rabbit)',`<ellipse cx="28" cy="40" rx="14" ry="10" fill="${W}"/><circle cx="42" cy="30" r="7" fill="${W}"/><path d="M40 24l-2-16q4 0 6 14M44 24l4-14q4 2 0 14" fill="${W}"/><circle cx="44" cy="29" r="1.3" fill="${INK}" stroke="none"/><path d="M4 30h8M2 38h8M4 46h8" stroke="${DB}" stroke-width="2"/>`),
 '🐢':K('slow (tortoise)',`<path d="M12 44q0-20 20-20t20 20z" fill="${GR}"/><path d="M22 30l10 6 10-6M32 36v8" stroke="#1E7A45"/><path d="M52 40q8-6 10 0-2 4-10 4" fill="#9BD86B"/><path d="M16 44v6M26 44v6M38 44v6M48 44v6" stroke="#9BD86B" stroke-width="4"/>`),
 '❓':K('question',T(32,48,'?',44,DB)),
 '❗':K('important',T(32,50,'!',46,RD)),
 '✅':K('yes, correct',`<rect x="10" y="10" width="44" height="44" rx="8" fill="${GR}"/><path d="M20 32l8 8 16-16" stroke="${W}" stroke-width="5"/>`),
 '✔️':K('done',`<path d="M12 32l14 14 26-28" stroke="${GR}" stroke-width="7"/>`),
 '❌':K('no, wrong',`<path d="M16 16l32 32M48 16L16 48" stroke="${RD}" stroke-width="7"/>`),
 '➕':K('plus, with',`<path d="M32 12v40M12 32h40" stroke="${GR}" stroke-width="8"/>`),
 '🚫':K('not allowed',`<circle cx="32" cy="32" r="22" fill="${W}" stroke="${RD}" stroke-width="5"/><path d="M17 17l30 30" stroke="${RD}" stroke-width="5"/>`),
 '⛔':K('no entry',sign(`<rect x="16" y="28" width="32" height="8" rx="2" fill="${W}" stroke="none"/>`)),
 '🔁':K('repeat',`<path d="M14 30v-4q0-8 8-8h26M42 10l8 8-8 8M50 34v4q0 8-8 8H16M22 54l-8-8 8-8" stroke="${DB}" stroke-width="4"/>`),
 '↩️':K('back, return',`<path d="M50 50V34q0-10-10-10H16M26 12L14 24l12 12" stroke="${DB}" stroke-width="5"/>`),
 '⬅️':K('left',arrow('M52 32H14M26 18L12 32l14 14',DB)),
 '➡️':K('right',arrow('M12 32h38M38 18l14 14-14 14',DB)),
 '⬆️':K('straight on, up',arrow('M32 52V14M18 26l14-14 14 14',DB)),
 '⬇️':K('down',arrow('M32 12v38M18 38l14 14 14-14',DB)),
 '🔚':K('end',badge('END',DK)),
 '🔜':K('soon',badge('SOON',DB)),
 '🆕':K('new',badge('NEW',OR)),
 '💬':K('message, chat',`<path d="M8 14q0-6 6-6h36q6 0 6 6v22q0 6-6 6H26l-12 10v-10q-6 0-6-6z" fill="${W}"/><circle cx="22" cy="25" r="2.4" fill="${INK}" stroke="none"/><circle cx="32" cy="25" r="2.4" fill="${INK}" stroke="none"/><circle cx="42" cy="25" r="2.4" fill="${INK}" stroke="none"/>`),
 '📊':K('chart',`<path d="M8 8v48h48"/><rect x="14" y="36" width="9" height="20" fill="${BL}"/><rect x="27" y="24" width="9" height="32" fill="${GR}"/><rect x="40" y="14" width="9" height="42" fill="${OR}"/>`),
 '🫙':K('nothing (empty jar)',`<rect x="18" y="8" width="28" height="8" rx="2" fill="${GY}"/><path d="M16 16h32q4 0 4 6v30q0 6-6 6H18q-6 0-6-6V22q0-6 4-6z" fill="${LB}" fill-opacity=".5"/><path d="M20 24v24" stroke="${W}" stroke-width="3"/>`),
});
})(LerenCardArt);
