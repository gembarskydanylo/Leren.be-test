// TEST-034 · The privacy policy opens in the app interface language. The policy itself exists in Ukrainian, English and
// Dutch (legal text — French and Arabic need a reviewed translation, see docs/audits/TEST-034-AI-VALIDATION.md); this
// script only puts the reader's version first and translates the page chrome. Language: ?lang=, else poly_ui, else uk.
(()=>{'use strict';
const valid=['uk','en','fr','ar'];let lang='uk';
try{const q=new URLSearchParams(location.search).get('lang'),s=localStorage.getItem('poly_ui');lang=valid.includes(q)?q:valid.includes(s)?s:'uk'}catch(e){}
const T={uk:{upd:'Оновлено',del:'🗑 Видалити акаунт',title:'Політика конфіденційності'},
 en:{upd:'Last updated',del:'🗑 Delete account',title:'Privacy Policy'},
 fr:{upd:'Mise à jour',del:'🗑 Supprimer le compte',title:'Politique de confidentialité',note:'Cette politique est disponible en anglais, en ukrainien et en néerlandais. La version anglaise est affichée en premier.'},
 ar:{upd:'آخر تحديث',del:'🗑 حذف الحساب',title:'سياسة الخصوصية',note:'تتوفر هذه السياسة بالإنجليزية والأوكرانية والهولندية. تُعرض النسخة الإنجليزية أولاً.'}}[lang];
const first=lang==='uk'?'uk':'en',byId=id=>document.getElementById(id);
const date=((byId('updated')||{}).textContent||'').match(/\d{2}\.\d{2}\.\d{4}/);
if(byId('updated')){byId('updated').textContent=T.upd+': '+(date?date[0]:'');byId('updated').lang=lang==='ar'?'ar':lang}
if(byId('deleteLink'))byId('deleteLink').textContent=T.del;
const note=byId('langNote');if(note&&T.note){note.textContent=T.note;note.lang=lang;note.dir=lang==='ar'?'rtl':'ltr';note.hidden=false}
document.documentElement.lang=first;document.title='lerenbe.com — '+T.title;
// the reader's version first: sections, the links to them, and the parts of the «delete your account» section
const sec=byId(first),uk=byId('uk');if(sec&&uk&&sec!==uk)uk.before(sec);
const nav=document.querySelector('nav'),link=nav&&nav.querySelector('a[href="#'+first+'"]');if(link)nav.prepend(link);
const del=byId('delete'),part=del&&del.querySelector('[data-part="'+first+'"]'),h=del&&del.querySelector('h2');if(part&&h)h.after(part);
})();
