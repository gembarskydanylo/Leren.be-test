// ========== DICTIONARY UI (data: dict/nl.json + lesson words; engine: DX) ==========
const DICT_UI={
 uk:{ph:"Слово нідерландською або українською",loading:"Завантажую словник…",offline:"Повний словник недоступний без інтернету. Показую слова з уроків.",
  words:n=>"У словнику "+n.toLocaleString("uk")+" слів · A1–A2",found:n=>"Знайдено: "+n,none:"Нічого не знайдено",did:"Можливо, ти мав на увазі:",
  all:"Усі",pos:{n:"ім.",v:"дієсл.",adj:"прикм.",adv:"присл.",prep:"прийм.",conj:"спол.",pron:"займ.",num:"числ.",det:"займ.",int:"виг.",phr:"вираз"},
  filters:[["","Усі"],["n","Іменники"],["v","Дієслова"],["adj","Прикметники"],["phr","Вирази"]],
  formOf:(f,w)=>"«"+f+"» — форма слова "+w,pl:"мн.",sg:"одн.",deW:"de-слово",hetW:"het-слово",both:"de або het",
  present:"Теперішній час",past:"Минулий час",perfect:"Perfectum",sep:p=>"Відокремлюваний префікс «"+p+"»: в реченні він іде в кінець.",refl:"Зворотне дієслово: ik … me, jij … je, hij … zich",
  irr:"неправильне дієслово",withZijn:"з zijn",withBoth:"з hebben або zijn",adjForm:"Перед іменником",cmp:"Порівняння",
  ex:"Приклад",fromLessons:"З уроків",en:"Англ.",listen:"Слухати",star:"Додати до «Мої слова»",unstar:"Прибрати з «Мої слова»",
  wod:"Слово дня",recent:"Нещодавно шукали",mine:"Мої слова",mineEmpty:"Натисни ☆ біля слова, щоб зберегти його тут.",tryT:"Спробуй:",clear:"Очистити"},
 en:{ph:"A word in Dutch or English",loading:"Loading dictionary…",offline:"The full dictionary needs an internet connection. Showing lesson words.",
  words:n=>n.toLocaleString("en")+" words · A1–A2",found:n=>n+" found",none:"Nothing found",did:"Did you mean:",
  all:"All",pos:{n:"noun",v:"verb",adj:"adj.",adv:"adv.",prep:"prep.",conj:"conj.",pron:"pron.",num:"num.",det:"det.",int:"interj.",phr:"phrase"},
  filters:[["","All"],["n","Nouns"],["v","Verbs"],["adj","Adjectives"],["phr","Phrases"]],
  formOf:(f,w)=>"“"+f+"” is a form of "+w,pl:"pl.",sg:"sg.",deW:"de-word",hetW:"het-word",both:"de or het",
  present:"Present",past:"Past",perfect:"Perfect",sep:p=>"Separable prefix “"+p+"”: it moves to the end of the sentence.",refl:"Reflexive verb: ik … me, jij … je, hij … zich",
  irr:"irregular verb",withZijn:"with zijn",withBoth:"with hebben or zijn",adjForm:"Before a noun",cmp:"Comparison",
  ex:"Example",fromLessons:"From lessons",en:"EN",listen:"Listen",star:"Add to My words",unstar:"Remove from My words",
  wod:"Word of the day",recent:"Recent searches",mine:"My words",mineEmpty:"Tap ☆ next to a word to save it here.",tryT:"Try:",clear:"Clear"}};
DICT_UI.fr=Object.assign({},DICT_UI.en,{ph:"Un mot en néerlandais ou en français",loading:"Chargement du dictionnaire…",words:n=>n.toLocaleString("fr")+" mots · A1–A2",found:n=>n+" résultats",none:"Rien trouvé",did:"Vouliez-vous dire :",
 filters:[["","Tout"],["n","Noms"],["v","Verbes"],["adj","Adjectifs"],["phr","Expressions"]],wod:"Mot du jour",recent:"Recherches récentes",mine:"Mes mots",mineEmpty:"Touche ☆ à côté d'un mot pour l'enregistrer ici.",tryT:"Essaie :",listen:"Écouter",ex:"Exemple",fromLessons:"Des leçons",present:"Présent",past:"Passé",perfect:"Passé composé"});
DICT_UI.ar=Object.assign({},DICT_UI.en,{ph:"كلمة بالهولندية أو العربية",loading:"جارٍ تحميل القاموس…",words:n=>n.toLocaleString("ar")+" كلمة · A1–A2",found:n=>"النتائج: "+n,none:"لم يتم العثور على شيء",did:"هل تقصد:",
 filters:[["","الكل"],["n","أسماء"],["v","أفعال"],["adj","صفات"],["phr","عبارات"]],wod:"كلمة اليوم",recent:"عمليات البحث الأخيرة",mine:"كلماتي",mineEmpty:"اضغط ☆ بجانب الكلمة لحفظها هنا.",tryT:"جرّب:",listen:"استمع",ex:"مثال",fromLessons:"من الدروس"});
const dU=()=>DICT_UI[uiLang]||DICT_UI.en;
const DICT={ix:null,loading:null,offline:false,pos:"",open:-1,corpus:null};
function dictTr(e){return uiLang==="uk"?e.uk:uiLang==="fr"?(e.fr||e.en):uiLang==="ar"?(e.ar||e.en):e.en}
function dictMerge(list){
 const key=(w,p)=>w.toLowerCase()+"|"+p,byKey=new Map(),byW=new Map();
 list.forEach(e=>{byKey.set(key(e.w,e.p),e);if(!byW.has(e.w.toLowerCase()))byW.set(e.w.toLowerCase(),e)});
 allVocab().forEach(it=>{
  const m=String(it.nl).match(/^(de|het)\s+(.+)$/i),w=(m?m[2]:it.nl).trim(),g=m?m[1].toLowerCase():"";
  if(!w||/[.?!]$/.test(w))return;
  let e=g?byKey.get(key(w,"n")):byW.get(w.toLowerCase());
  if(!e&&!g)e=byKey.get(key(w,"v"));
  if(e){if(!e.x&&it.ex_nl){e.x=it.ex_nl;e.xu=it.ex_uk||""}if(it.fr&&!e.fr)e.fr=it.fr;if(it.ar&&!e.ar)e.ar=it.ar;if(it.icon&&!e.ic)e.ic=it.icon;e.lesson=1;return}
  const ne={w,g,pl:"",p:g?"n":/\s/.test(w)?"phr":/en$/.test(w)?"v":"adv",l:1,uk:it.uk||it.en||"",en:it.en||"",fr:it.fr,ar:it.ar,x:it.ex_nl,xu:it.ex_uk,ic:it.icon,lesson:1};
  if(ne.p==="adv")ne.p="phr";list.push(ne);byKey.set(key(w,ne.p),ne);byW.set(w.toLowerCase(),ne);
 });
 return list;
}
function dictLoad(){
 if(DICT.ix)return Promise.resolve(DICT.ix);
 if(DICT.loading)return DICT.loading;
 DICT.loading=fetch("dict/nl.json").then(r=>{if(!r.ok)throw new Error(r.status);return r.json()})
  .catch(()=>{DICT.offline=true;return[]})
  .then(list=>{DICT.ix=DX.build(dictMerge(list));DICT.loading=null;return DICT.ix});
 return DICT.loading;
}
function dictCorpus(){
 if(DICT.corpus)return DICT.corpus;const c=[],seen=new Set();
 const add=(nl,uk,en)=>{if(!nl||seen.has(nl))return;seen.add(nl);c.push({nl,uk:uk||"",en:en||"",t:new Set(DX.norm(nl).split(" "))})};
 allVocab().forEach(it=>add(it.ex_nl,it.ex_uk,it.ex_en));
 if(typeof DIALOGUES!=="undefined")DIALOGUES.forEach(d=>d.lines.forEach(l=>add(l[1],l[2],l[3])));
 if(typeof SCENES!=="undefined")SCENES.forEach(s=>s.turns.forEach(t=>{add(cx(t[0]),cx(t[1]),cx(t[2]));t[3].forEach(o=>{if(o[1])add(cx(o[0]))})}));
 return DICT.corpus=c;
}
function dictExamples(e,max){
 const words=[e.h2,...e.fm].filter(w=>w&&!w.includes(" "));if(!words.length)return[];
 const own=e.x||"",out=[];
 for(const s of dictCorpus()){if(s.nl===own)continue;if(words.some(w=>s.t.has(w))){out.push(s);if(out.length>=max)break}}
 return out;
}
const dictKey=e=>e.w+"|"+e.p;
function dictMine(){return lsGet("leren_mywords",[])}
function dictRecent(){return lsGet("leren_dict_recent",[])}
function dictRemember(w){const r=dictRecent().filter(x=>x!==w);r.unshift(w);lsSet("leren_dict_recent",r.slice(0,8))}
function dictHi(text,q){
 const span=el("span");const t=String(text),n=DX.norm(t),i=q?n.indexOf(q):-1;
 if(i<0||n.length!==t.length){span.textContent=t;return span}
 span.append(t.slice(0,i));const m=el("mark","",t.slice(i,i+q.length));span.append(m,t.slice(i+q.length));return span;
}
function dictArt(g){if(!g)return null;const a=el("span","dx-art "+(g==="het"?"het":g==="de"?"de":"both"),g==="de,het"?"de/het":g);return a}
function dictSub(e){
 const u=dU();
 if(e.p==="n"&&e.pl)return u.pl+" "+e.pl;
 if(e.p==="v"&&e.cj){const c=e.cj;return c.pastS+" · "+(c.aux==="z"?"is ":c.aux==="hz"?"heeft/is ":"heeft ")+c.part}
 if(e.p==="adj"&&e.fm&&e.fm.length)return e.fm.slice(0,2).join(" · ");
 return "";
}
function dictSayBtn(text){const b=el("button","dx-say");b.type="button";b.setAttribute("aria-label",dU().listen+": "+text);b.appendChild(ico("volume"));b.onclick=ev=>{ev.stopPropagation();say(text,b)};return b}
function dictStarBtn(e,onChange){
 const u=dU(),k=dictKey(e),on=dictMine().includes(k);const b=el("button","dx-star"+(on?" on":""));b.type="button";
 b.setAttribute("aria-pressed",on?"true":"false");b.setAttribute("aria-label",on?u.unstar:u.star);b.textContent=on?"★":"☆";
 b.onclick=ev=>{ev.stopPropagation();const m=dictMine(),i=m.indexOf(k);if(i>=0)m.splice(i,1);else m.unshift(k);lsSet("leren_mywords",m.slice(0,300));if(onChange)onChange();else runSearch()};return b;
}
function dictSpeak(e){return e.p==="n"&&e.g&&e.g!=="de,het"?e.g+" "+e.w:e.w}
function dictRow(r,q){
 const e=r.e,u=dU(),row=el("div","dx-row"+(DICT.open===e.i?" open":""));row.dataset.i=e.i;
 const main=el("button","dx-main");main.type="button";main.setAttribute("aria-expanded",DICT.open===e.i?"true":"false");
 const head=el("div","dx-head");const a=dictArt(e.g);if(a)head.appendChild(a);
 const w=tgt(el("strong","dx-w"));w.appendChild(dictHi(e.w,q));head.appendChild(w);
 head.appendChild(el("span","dx-pos",(u.pos[e.p]||"")));
 head.appendChild(el("span","dx-lvl l"+e.l,e.l===1?"A1":"A2"));
 const tr=el("div","dx-tr");tr.appendChild(dictHi(dictTr(e)||"",DX.script(q)!=="lat"?q:""));
 main.append(head,tr);
 if(r.why==="form"){main.appendChild(el("div","dx-form",u.formOf(DICT.lastQ,e.w)))}
 const sub=dictSub(e);if(sub)main.appendChild(tgt(el("div","dx-sub",sub)));
 main.onclick=()=>{DICT.open=DICT.open===e.i?-1:e.i;if(DICT.open===e.i)dictRemember(e.w);runSearch()};
 row.append(dictSayBtn(dictSpeak(e)),main,dictStarBtn(e));
 if(DICT.open===e.i)row.appendChild(dictDetail(e));
 return row;
}
function dictTable(rows){const t=el("div","dx-table");rows.forEach(([a,b])=>{const ra=el("span","dx-k",a),rb=tgt(el("button","dx-v",b));rb.type="button";rb.onclick=()=>say(b.replace(/^ik |^jij |^hij |^wij /,"")===b?b:b);t.append(ra,rb)});return t}
function dictDetail(e){
 const u=dU(),d=el("div","dx-detail");
 if(uiLang==="uk"&&e.en)d.appendChild(el("p","dx-en",u.en+": "+e.en));
 if(e.p==="n"){
  const box=el("div","dx-block");
  if(e.g)box.appendChild(el("p","dx-note",e.g==="het"?u.hetW:e.g==="de"?u.deW:u.both));
  const rows=[[u.sg,(e.g&&e.g!=="de,het"?e.g+" ":"")+e.w]];if(e.pl)rows.push([u.pl,"de "+e.pl]);
  box.appendChild(dictTable(rows));d.appendChild(box);
 }
 if(e.p==="v"&&e.cj){
  const c=e.cj,o=DX.opt(e.f),refl=/^zich /.test(e.w),me=["me","je","zich","ons"];
  const r=(p,f,i)=>p+" "+f+(refl?" "+me[i]:"");
  const box=el("div","dx-block");
  box.appendChild(el("h4","",u.present));box.appendChild(dictTable([["ik",r("ik",c.ik,0)],["jij",r("jij",c.jij,1)],["hij/zij",r("hij",c.hij,2)],["wij",r("wij",c.wij,3)]]));
  box.appendChild(el("h4","",u.past));box.appendChild(dictTable([["ik",r("ik",c.pastS,0)],["wij",r("wij",c.pastP,3)]]));
  if(c.part){const aux=c.aux==="z"?"ben":"heb";box.appendChild(el("h4","",u.perfect+(c.aux==="z"?" · "+u.withZijn:c.aux==="hz"?" · "+u.withBoth:"")));
   box.appendChild(dictTable([["ik","ik "+aux+(refl?" me":"")+" "+c.part]]))}
  if(c.sep)box.appendChild(el("p","dx-note",u.sep(c.sep)));
  if(refl)box.appendChild(el("p","dx-note",u.refl));
  d.appendChild(box);
 }
 if(e.p==="adj"&&e.fm&&e.fm.length){
  const box=el("div","dx-block"),rows=[[u.adjForm,"de "+e.fm[0]+" …"]];
  if(e.fm.length>=3)rows.push([u.cmp,e.fm[1]+" · "+(e.fm[2].endsWith("e")?e.fm[3]||e.fm[2]:e.fm[2])]);
  box.appendChild(dictTable(rows));d.appendChild(box);
 }
 const exs=[];if(e.x)exs.push({nl:e.x,uk:e.xu||""});
 dictExamples(e,e.x?1:2).forEach(s=>exs.push({nl:s.nl,uk:uiLang==="uk"?s.uk:(s.en||s.uk),lesson:true}));
 if(exs.length){const box=el("div","dx-block");box.appendChild(el("h4","",u.ex));
  exs.forEach(x=>{const b=el("button","dx-ex");b.type="button";b.append(tgt(el("span","nl",x.nl)));if(x.uk&&uiLang==="uk")b.append(el("span","tr",x.uk));if(x.lesson)b.append(el("small","",u.fromLessons));b.onclick=()=>say(x.nl,b);box.appendChild(b)});
  d.appendChild(box)}
 return d;
}
function dictChips(label,items,onPick){const box=el("div","dx-chips-box");box.appendChild(el("h3","dx-h",label));const row=el("div","dx-chips");
 items.forEach(t=>{const c=tgt(el("button","dx-chip",t));c.type="button";c.onclick=()=>onPick(t);row.appendChild(c)});box.appendChild(row);return box}
function dictHome(box){
 const u=dU(),ix=DICT.ix,pick=t=>{$("searchInput").value=t;DICT.open=-1;runSearch()};
 const pool=ix.entries.filter(e=>(e.p==="n"||e.p==="v"||e.p==="adj")&&e.uk&&(e.x||e.p==="v"));
 if(pool.length){const d=new Date(),n=d.getFullYear()*372+d.getMonth()*31+d.getDate(),e=pool[(n*7919)%pool.length];
  const card=el("div","dx-wod");card.appendChild(el("h3","dx-h",u.wod));
  const r=dictRow({e,s:0},"");card.appendChild(r);box.appendChild(card)}
 const rec=dictRecent();if(rec.length)box.appendChild(dictChips(u.recent,rec,pick));
 const mine=dictMine();const mb=el("div","dx-mine");mb.appendChild(el("h3","dx-h",u.mine+(mine.length?" · "+mine.length:"")));
 if(!mine.length)mb.appendChild(el("p","dx-empty-s",u.mineEmpty));
 else{const map=new Map(ix.entries.map(e=>[dictKey(e),e]));mine.map(k=>map.get(k)).filter(Boolean).slice(0,50).forEach(e=>mb.appendChild(dictRow({e,s:0},"")))}
 box.appendChild(mb);
 box.appendChild(dictChips(u.tryT,uiLang==="uk"?["huizen","ging","лікар","grote","opgestaan","комуна"]:["huizen","ging","to go","grote","opgestaan","doctor"],pick));
}
function runSearch(){
 const u=dU(),box=$("searchResults"),meta=$("dictMeta"),inp=$("searchInput");if(!box)return;
 inp.placeholder=u.ph;const clr=$("dictClear");if(clr)clr.hidden=!inp.value;
 dictFilters();
 if(!DICT.ix){box.replaceChildren(el("div","search-empty",u.loading));dictLoad().then(()=>runSearch());return}
 box.replaceChildren();
 if(DICT.offline)box.appendChild(el("p","dx-offline",u.offline));
 const raw=inp.value||"";
 if(!raw.trim()){meta.textContent=u.words(DICT.ix.entries.length);dictHome(box);return}
 const r=DX.search(DICT.ix,raw,{pos:DICT.pos});DICT.lastQ=raw.trim();DICT.lastRes=r;
 meta.textContent=r.list.length?u.found(r.total):"";
 if(!r.list.length){box.appendChild(el("div","search-empty",u.none));return}
 if(r.fuzzy)box.appendChild(el("p","dx-did",u.did));
 r.list.slice(0,40).forEach(x=>box.appendChild(dictRow(x,r.q)));
}
function dictFilters(){
 const f=$("dictFilters");if(!f)return;const u=dU();
 if(f.dataset.lang!==uiLang){f.replaceChildren();u.filters.forEach(([p,l])=>{const b=el("button","dx-filter",l);b.type="button";b.dataset.pos=p;b.onclick=()=>{DICT.pos=p;DICT.open=-1;runSearch()};f.appendChild(b)});f.dataset.lang=uiLang}
 f.querySelectorAll(".dx-filter").forEach(b=>{const on=b.dataset.pos===DICT.pos;b.classList.toggle("on",on);b.setAttribute("aria-pressed",on?"true":"false")});
}
