/* Leren.be — exam preparation engine shared by the course exams (A1.1: exam11.js, A1.2: exam12.js).
 * Parts: reading, listening, writing (with checklists), speaking, words, grammar and a mock exam.
 * LerenExam.make(data) returns {open, texts, chips, speakScript, data, …}. Uses the app's globals
 * (el, $, tgt, say, listenOnce, toast, addXP, lsGet, lsSet, shuffle, uiLang). */
(function(){
"use strict";
const LANGS=["uk","en","fr","ar"];
const L=()=>LANGS.includes(uiLang)?uiLang:"en";
const Q=(uk,en,fr,ar)=>({uk,en,fr,ar});
const tr=x=>typeof x==="string"?x:(x[L()]||x.en||x.uk||"");
// Engine words (the exam's own copy is in its data file).
const E={
 uk:{cont:"▶ Продовжити ",contAt:"Продовжити з питання ",contFrom:"Продовжуємо з питання ",restart:"↺ Почати заново",rule:"📘 Правило",omdat:"Склади відповідь: Omdat …",plural:"Натисни всі іменники в множині (meervoud), потім «Перевірити».",typePl:"Напиши множину…",plurals:"Множина в тексті: ",which:"Яке речення правильне?",inNl:w=>"Як нідерландською: «"+w+"»?",means:w=>"Що означає «"+w+"»?",cap:"Кожне речення з великої літери",dot:"Кожне речення закінчується . ! або ?",min:(n,c)=>"Щонайменше "+n+" речень (зараз: "+c+")",name:"Ім’я в кінці",stop:"⏹ Готово",listening:"Говори — я слухаю…",tr:"🇺🇦 Переклад",words:n=>n+" слів"},
 en:{cont:"▶ Continue ",contAt:"Continue at question ",contFrom:"Continuing from question ",restart:"↺ Start over",rule:"📘 Rule",omdat:"Build the answer: Omdat …",plural:"Tap every plural noun, then «Check».",typePl:"Type the plural…",plurals:"Plurals: ",which:"Which sentence is correct?",inNl:w=>"In Dutch: “"+w+"”?",means:w=>"What does “"+w+"” mean?",cap:"Every sentence starts with a capital",dot:"Every sentence ends with . ! or ?",min:(n,c)=>"At least "+n+" sentences (now: "+c+")",name:"Your name at the end",stop:"⏹ Done",listening:"Speak — I'm listening…",tr:"Translation",words:n=>n+" words"},
 fr:{cont:"▶ Continuer ",contAt:"Reprendre à la question ",contFrom:"On reprend à la question ",restart:"↺ Recommencer",rule:"📘 Règle",omdat:"Construis la réponse : Omdat …",plural:"Touche tous les noms au pluriel, puis « Vérifier ».",typePl:"Écris le pluriel…",plurals:"Pluriels : ",which:"Quelle phrase est correcte ?",inNl:w=>"En néerlandais : « "+w+" » ?",means:w=>"Que signifie « "+w+" » ?",cap:"Chaque phrase commence par une majuscule",dot:"Chaque phrase se termine par . ! ou ?",min:(n,c)=>"Au moins "+n+" phrases (maintenant : "+c+")",name:"Ton nom à la fin",stop:"⏹ Terminé",listening:"Parle, je t’écoute…",tr:"Traduction",words:n=>n+" mots"},
 ar:{cont:"▶ متابعة ",contAt:"المتابعة من السؤال ",contFrom:"نتابع من السؤال ",restart:"↺ البدء من جديد",rule:"📘 القاعدة",omdat:"كوّن الجواب: Omdat …",plural:"اضغط على كل الأسماء بصيغة الجمع، ثم «تحقق».",typePl:"اكتب صيغة الجمع…",plurals:"صيغ الجمع: ",which:"أي جملة صحيحة؟",inNl:w=>"بالهولندية: «"+w+"»؟",means:w=>"ما معنى «"+w+"»؟",cap:"كل جملة تبدأ بحرف كبير",dot:"كل جملة تنتهي بـ . ! أو ?",min:(n,c)=>"على الأقل "+n+" جمل (الآن: "+c+")",name:"اسمك في النهاية",stop:"⏹ انتهيت",listening:"تكلّم، أنا أستمع…",tr:"الترجمة",words:n=>n+" كلمات"}
};
const X=()=>E[L()];
const BASE={
 uk:{backLesson:"← До уроку"},
 en:{backLesson:"← Back to the lesson"},
 fr:{back:"← Examen",toets:"← Tests",backLesson:"← Retour à la leçon",q:"Question",of:"sur",next:"Suivant",check:"Vérifier",right:"Correct !",wrong:"Pas tout à fait. La bonne réponse :",
  listen:"🎧 Écouter",again:"🔁 Encore",showText:"Afficher le texte",hideText:"Masquer le texte",readFirst:"Lis d’abord la question, puis écoute.",
  done:"Terminé !",score:(a,b)=>a+" sur "+b+" correct",repeat:"À revoir :",restart:"Recommencer",best:"Meilleur",order:"Touche les mots dans l’ordre",clear:"Effacer",
  wTask:"Consigne",wWrite:"Écris ici…",wCheck:"Vérifier mon texte",wModel:"Voir le modèle",wHideModel:"Masquer le modèle",wTips:"Liste de contrôle :",wSaved:"Ton brouillon est enregistré sur cet appareil.",
  sAsk:"🔊 Question",sSpeak:"🎤 Répondre",sShow:"Voir la réponse",sHeard:"Tu as dit :",sModel:"Modèle :",sOk:"✓ Je sais",sRe:"↺ M’entraîner encore",sTopic:"Thème",sDone:(a,b)=>a+" questions sur "+b+" maîtrisées",
  ai:"🤖 Coach IA",wAi:"🤖 Vérifier avec Peter",wAiEmpty:"Écris d’abord ton texte.",timer:"Temps"},
 ar:{back:"→ الامتحان",toets:"→ الاختبارات",backLesson:"→ العودة إلى الدرس",q:"السؤال",of:"من",next:"التالي",check:"تحقق",right:"صحيح!",wrong:"ليس تماماً. الإجابة الصحيحة:",
  listen:"🎧 استمع",again:"🔁 مرة أخرى",showText:"أظهر النص",hideText:"أخفِ النص",readFirst:"اقرأ السؤال أولاً، ثم استمع.",
  done:"انتهيت!",score:(a,b)=>a+" من "+b+" صحيحة",repeat:"للمراجعة:",restart:"أعد المحاولة",best:"الأفضل",order:"اضغط على الكلمات بالترتيب",clear:"امسح",
  wTask:"المهمة",wWrite:"اكتب هنا…",wCheck:"تحقق من نصي",wModel:"أظهر النموذج",wHideModel:"أخفِ النموذج",wTips:"قائمة التحقق:",wSaved:"تُحفظ مسودتك على هذا الجهاز.",
  sAsk:"🔊 السؤال",sSpeak:"🎤 أجب",sShow:"أظهر الجواب",sHeard:"قلتَ:",sModel:"النموذج:",sOk:"✓ أستطيع",sRe:"↺ أتدرب أكثر",sTopic:"الموضوع",sDone:(a,b)=>a+" من "+b+" أسئلة متقنة",
  ai:"🤖 المدرّب الذكي",wAi:"🤖 تحقق مع بيتر",wAiEmpty:"اكتب نصك أولاً.",timer:"الوقت"}
};
// Writing checklist, shared by the exam and the lesson writing practice. Returns {items:[{ok,label}], ok, total, pct, tips}.
function score(w,text,common,minDefault=5){
 const t=String(text||"").trim(),items=w.checks.map(([label,re])=>({ok:re.test(t),label}));
 // The line after the closing (Groetjes, / Met vriendelijke groeten,) is the signature, not a sentence: "Olena Kovalenko, appartement 3".
 const lines=t.split(/\n+/).map(x=>x.trim()).filter(Boolean),sign=lines.length>1&&/(groetjes|groeten|groet|kusjes|^tot\b.*)[,!]?$/i.test(lines[lines.length-2])&&/^[A-Z]/.test(lines[lines.length-1])?lines[lines.length-1]:"";
 const sents=t.split(/(?<=[.!?])\s+|\n+/).map(x=>x.trim()).filter(x=>x.length>2&&x!==sign&&!/^(hallo|beste|dag|hoi|lieve|groetjes|groeten)\b/i.test(x)&&!/,$/.test(x)&&x.split(/\s+/).length>1);
 if(!w.form){const cap=sents.filter(x=>!/^[A-Z’'0-9]/.test(x)),dot=sents.filter(x=>!/[.!?]$/.test(x)),n=w.min||minDefault;
  items.push({ok:cap.length===0,label:X().cap},{ok:dot.length===0,label:X().dot},{ok:sents.length>=n,label:X().min(n,sents.length)},{ok:!!sign||/\n\s*[A-Z][a-z]+\s*$/.test(t)||/groetjes,?\s*\n?\s*\S+\s*$/i.test(t),label:X().name})}
 const hits=(common||[]).filter(([re])=>re.test(t)),tips=hits.map(([,m])=>tr(m)),ok=items.filter(x=>x.ok).length;
 return {items,ok,total:items.length,pct:Math.round(ok/items.length*100),tips,tipRes:hits.map(([re])=>re)};
}
function make(D){
const {KEY,T,TEXTS,LEZEN,DLG,LUISTEREN,WOORDEN=[],GRAM,WRITE,COMMON=[],SPREKEN,MV=null,MV_PICK=null,OM=null,OM_MC=null,RULES={}}=D,OPT_UK=D.OPT_UK||{};
// Exam copy: shared words from BASE, the exam's own title and parts from its data file (English as fallback).
const U=()=>({...T.en,...BASE[L()],...(T[L()]||{})});
function mkMV(m,i){const acc=m[2].split("|"),gap=m[0].replace("___","___ ("+m[1]+")"),full=m[0].replace("___",acc[0]);
 return i%2?{src:"meervoud",kind:"type",gap,acc,ok:acc[0],full,u:m[4],e:L()==="uk"?m[1]+" → "+acc.join(" / "):m[1]+" → "+acc[0]}:{src:"meervoud",kind:"mc",gap,o:[acc[0],...m[3]],ok:acc[0],full,u:m[4],e:m[1]+" → "+acc.join(" / "),nlOpts:true}}
function mkOM(o){const w=o[1].replace(/\.$/,"").split(" ");return{src:"omdat",kind:"order",prompt:o[0],promptU:o[2],w:w.map((x,i)=>i===w.length-1?x+".":x),a:o[1],u:o[3],e:tr(Q("Omdat → дієслово в кінці речення","Omdat → verb at the end"))}}
function mkOMmc(o){return{src:"omdat",kind:"mc",q:X().which,o:[o[0],...o[1]],ok:o[0],full:o[0],u:o[2],nlOpts:true,e:/^Want/.test(o[0])?tr(Q("want → звичайний порядок: підмет + дієслово","want → normal order")):tr(Q("omdat → дієслово(а) в кінці","omdat → verb(s) at the end"))}}
function mkPick(){return{kind:"pick",ptext:MV_PICK.text,targets:MV_PICK.targets,ok:MV_PICK.targets.join(", "),textUk:MV_PICK.uk,e:tr(Q("heten, eten — дієслова, не множина іменників","heten, eten are verbs, not plural nouns"))}}
// ---------------- HELPERS ----------------
const st=()=>{try{const s=lsGet(KEY,{});return s&&typeof s==="object"?s:{}}catch(e){return{}}};
const save=s=>{try{lsSet(KEY,s)}catch(e){}};
function setBest(part,pct){const s=st();s.best=s.best||{};if(!(s.best[part]>=pct)){s.best[part]=pct;save(s)}}
function head(title,sub,backTo){
 cardToTop&&cardToTop();
 const c=$("card");c.replaceChildren();$("prog").textContent=title;$("rnd").textContent=sub||"";bar(0);
 c.dir=L()==="ar"?"rtl":"ltr";
 const hook=typeof backTo==="function"?backTo:null,b=el("button","ex-back",hook?U().backLesson||U().back:backTo==="toets"?U().toets:U().back);b.type="button";b.onclick=hook||(backTo==="toets"?()=>startToets():home);c.appendChild(b);
 return c;
}
function bar(p){const f=$("barfill");if(f){f.style.width=Math.round(p*100)+"%";f.parentElement&&f.parentElement.setAttribute("aria-valuenow",String(Math.round(p*100)))}}
function playLines(lines,btn,i=0){
 if(i>=lines.length){if(btn)btn.disabled=false;return}
 if(btn)btn.disabled=true;
 say(lines[i][1],null,()=>setTimeout(()=>playLines(lines,btn,i+1),350));
}
const nl=t=>{const s=el("span","",t);return tgt(s)};
const UKON=()=>uiLang==="uk";
const trEl=(t,cls)=>el(cls||"small","ex-tr",t);
function fullGap(g){return g.s.replace("___",g.o[0]).replace(/\s*\(.*\)\s*$/,"")}

// ---------------- HOME ----------------
function home(){
 const u=U(),c=head(u.title,"","toets"),s=st();
 c.appendChild(el("h2","ex-h",u.title));c.appendChild(el("p","ex-sub",u.sub));c.appendChild(el("p","ex-when",u.when));
 const grid=el("div","ex-grid");
 Object.entries(u.parts).forEach(([id,[ic,t,d]])=>{
  const b=el("button","ex-tile"+(id==="proef"?" wide":""));b.type="button";b.dataset.part=id;
  b.append(el("span","ex-ic",ic),el("strong","",t),el("span","ex-d",d));
  const run=(s.run||{})[id];if(run&&run.i>0&&run.i<(run.items||[]).length)b.appendChild(el("span","ex-cont",X().cont+(run.i+1)+"/"+run.items.length));
  const best=s.best&&s.best[id];if(best!=null){b.appendChild(el("span","ex-best","★ "+best+"%"));if(best>=70)b.classList.add("ok")}
  b.onclick=()=>({schrijven:writePick,spreken:speakPick}[id]||(()=>quiz(id)))();
  grid.appendChild(b);
 });
 c.appendChild(grid);
 if(D.ai&&typeof AI_ENDPOINT!=="undefined"&&AI_ENDPOINT&&targetLang==="nl"){
  const nm=(typeof cx==="function"?cx("{N}"):"Peter");const fix=t=>t.replace(/Peter/g,nm);
  c.appendChild(el("h3","ex-aih",u.ai));c.appendChild(el("p","ex-sub",fix(u.aiS)));
  const mk=(id,t,d,fn)=>{const b=el("button","btn toets-pick ex-ai");b.type="button";b.dataset.ai=id;const av=el("span","tp-no ex-av");try{av.innerHTML=charSvg("happy")}catch(e){av.textContent="🤖"}b.appendChild(av);const tx=el("span","tp-text");tx.append(el("strong","",fix(t)),el("small","tp-meta",fix(d)));b.appendChild(tx);b.onclick=fn;c.appendChild(b)};
  let aiRun=null;try{aiRun=lsGet(D.ai.store,null)}catch(e){}
  const cont=aiRun&&aiRun.exam&&!aiRun.exam.done&&aiRun.msgs&&aiRun.msgs.length?" · ▶ "+X().contAt+(aiRun.exam.i+1)+"/"+aiRun.exam.list.length:"";
  mk("speak",u.aiSpeak,u.aiSpeakS+cont,()=>aiStart({id:D.ai.scene,fromExam:true}));
  mk("ask",u.aiAsk,u.aiAskS,()=>askStart({focus:D.focus}));
 }
}

// ---------------- QUIZ ENGINE ----------------
function mkLezen(x){return{src:"lezen",kind:"mc",text:TEXTS[x.t],q:tr(x.q),o:x.o,ok:x.o[0]}}
function mkLuisteren(x){return{src:"luisteren",kind:"mc",dlg:DLG[x.d],q:tr(x.q),o:x.o,ok:x.o[0]}}
function wordPool(){ // the exam words + every word of the four "exam words" lessons (chapters 8-11)
 const seen=new Set(),out=[];const add=x=>{const k=x[0].toLowerCase();if(!seen.has(k)&&x[1]){seen.add(k);out.push(x)}};
 WOORDEN.forEach(add);
 try{D.wordTabs.forEach(t=>(DATA[t]?.items||[]).forEach(it=>add([it.nl,it.uk,it.en,it.fr,it.ar])))}catch(e){}
 return out;
}
function mkWoord(w,i,all){
 const kind=x=>/[.?!]$/.test(x[0])?"s":/\s/.test(x[0].replace(/^(de|het|een) /i,""))?"p":"w";
 const same=all.filter(x=>x!==w&&kind(x)===kind(w)&&x[1]!==w[1]&&x[2]!==w[2]);const others=shuffle(same.length>=3?same:all.filter(x=>x!==w)).slice(0,3),dir=i%2;
 // [nl, uk, en, fr, ar]: older word lists only have uk and en, then English is used.
 const m=x=>x[{uk:1,en:2,fr:3,ar:4}[L()]]||x[2]||x[1];
 return dir?{kind:"mc",pair:w,q:X().inNl(m(w)),o:[w[0],...others.map(x=>x[0])],ok:w[0],nlOpts:true}
  :{kind:"mc",pair:w,q:X().means(w[0]),o:[m(w),...others.map(m)],ok:m(w),nlQ:w[0]};
}
function mkGram(g){return g.w?{src:"gram",kind:"order",w:g.w,a:g.a,e:tr(g.e),u:g.u}:{src:"gram",kind:"mc",gap:g.s,full:fullGap(g),o:g.o,ok:g.o[0],e:tr(g.e),u:g.u,nlOpts:true}}
function build(part){
 if(part==="lezen")return LEZEN.map(mkLezen);
 if(part==="luisteren")return LUISTEREN.map(mkLuisteren);
 if(part==="woorden"){const P=wordPool(),w=shuffle(P).slice(0,25);return w.map((x,i)=>mkWoord(x,i,P))}
 if(part==="grammatica")return shuffle(GRAM).map(mkGram);
 if(part==="meervoud"&&MV)return [mkPick(),...shuffle(MV).slice(0,19).map(mkMV)];
 if(part==="omdat"&&OM)return [...shuffle(OM).slice(0,12).map(mkOM),...shuffle(OM_MC).slice(0,3).map(mkOMmc)];
 // mock exam: half of everything, grouped like the exam
 const pick=(a,n)=>shuffle(a).slice(0,n);
 const lez=pick(Object.keys(TEXTS),3).flatMap(t=>pick(LEZEN.filter(x=>x.t===t),2)).map(mkLezen);
 const lui=pick(Object.keys(DLG),2).flatMap(d=>pick(LUISTEREN.filter(x=>x.d===d),2)).map(mkLuisteren);
 const P=wordPool(),w=pick(P,6).map((x,i)=>mkWoord(x,i,P));
 return [...lez,...lui,...w,...pick(GRAM,D.proefGram||4).map(mkGram),...(MV?pick(MV,3).map(mkMV):[]),...(OM?pick(OM,3).map(mkOM):[])];
}
let QZ=null;
function qzSave(){if(!QZ)return;const s=st();s.run=s.run||{};const clean=o=>JSON.parse(JSON.stringify(o,(k,v)=>k.startsWith("_")?undefined:v));s.run[QZ.part]={items:clean(QZ.items),i:QZ.i,right:QZ.right,miss:clean(QZ.miss),t0:QZ.t0};save(s)}
function qzClear(part){const s=st();if(s.run&&s.run[part]){delete s.run[part];save(s)}}
function quiz(part,fresh){
 const r=!fresh&&(st().run||{})[part];
 if(r&&Array.isArray(r.items)&&r.i>0&&r.i<r.items.length){QZ={part,items:r.items,i:r.i,right:r.right||0,miss:r.miss||[],t0:r.t0||Date.now()};toast(X().contFrom+(r.i+1));ask();return}
 QZ={part,items:build(part),i:0,right:0,miss:[],t0:Date.now()};qzSave();if(part==="proef")toast(U().proefInfo);ask()}
function ask(){
 const u=U(),s=QZ,it=s.items[s.i],title=u.parts[s.part][0]+" "+u.parts[s.part][1];
 const c=head(title,u.q+" "+(s.i+1)+" "+u.of+" "+s.items.length);bar(s.i/s.items.length);
 if(s.i>0){const rs=el("button","ex-restart",X().restart);rs.type="button";rs.onclick=()=>quiz(s.part,true);c.firstChild.after(rs)}
 if(it.text){const box=el("div","ex-text");box.appendChild(el("small","",it.text.title));const p=el("p","");p.appendChild(nl(it.text.body));box.appendChild(p);c.appendChild(box);it._textEl=box}
 if(it.dlg){
  c.appendChild(el("p","ex-hint",u.readFirst));
  const row=el("div","row ex-play"),pl=el("button","btn primary",u.listen);pl.type="button";pl.onclick=()=>playLines(it.dlg,pl);
  const sh=el("button","btn",u.showText);sh.type="button";const box=el("div","ex-text ex-dlg");box.hidden=true;
  it.dlg.forEach(([w,t,u2])=>{const p=el("p","");p.appendChild(el("b","",w+": "));p.appendChild(nl(t));if(u2){const x=trEl(u2);x.hidden=true;p.appendChild(x)}box.appendChild(p)});
  sh.onclick=()=>{box.hidden=!box.hidden;sh.textContent=box.hidden?u.showText:u.hideText};
  row.append(pl,sh);c.append(row,box);it._box=box;
 }
 if(RULES[s.part]){const d=el("details","ex-rules");if(s.i===0)d.open=true;d.appendChild(el("summary","",X().rule));const r=el("div","ex-rtext");r.innerHTML=RULES[s.part][L()]||RULES[s.part].uk;d.appendChild(r);c.appendChild(d)}
 if(it.prompt){const pq=el("div","ex-text ex-speakq");const qt=el("p","ex-q");qt.appendChild(nl(it.prompt));pq.appendChild(qt);const sb=el("button","btn ex-say","🔊");sb.type="button";sb.onclick=()=>say(it.prompt,sb);pq.appendChild(sb);if(UKON()&&it.promptU)pq.appendChild(trEl(it.promptU));c.appendChild(pq)}
 const qh=el("h3","ex-q");
 if(it.gap){qh.appendChild(nl(it.gap))}else if(it.nlQ){qh.textContent=it.q.split(it.nlQ)[0];qh.appendChild(nl(it.nlQ));qh.append(it.q.split(it.nlQ)[1]||"")}else qh.textContent=it.q;
 if(it.kind==="order")qh.textContent=it.prompt?X().omdat:u.order;
 if(it.kind==="pick")qh.textContent=X().plural;
 c.appendChild(qh);
 if(it.kind==="mc"){
  const box=el("div","opts ex-opts");
  shuffle(it.o).forEach(o=>{const b=el("button","opt");b.type="button";b.appendChild(it.nlOpts||it.text||it.dlg||it.gap?nl(o):el("span","",o));b.onclick=()=>answer(o===it.ok,b,box);box.appendChild(b)});
  c.appendChild(box);
 }else if(it.kind==="type"){
  const f=el("form","g-type ex-typef"),inp=el("input");inp.type="text";inp.autocomplete="off";inp.setAttribute("autocapitalize","off");inp.setAttribute("spellcheck","false");inp.lang="nl";inp.placeholder=X().typePl;
  const b=el("button","btn primary",u.check);b.type="submit";f.append(inp,b);
  f.onsubmit=e=>{e.preventDefault();const v=inp.value.trim().toLowerCase().replace(/[’`´]/g,"'");if(!v)return;inp.disabled=true;const ok=it.acc.some(a=>a.toLowerCase().replace(/[’]/g,"'")===v);inp.classList.add(ok?"ok":"bad");answer(ok,null,f)};
  c.appendChild(f);setTimeout(()=>{try{inp.focus()}catch(e){}},50);
 }else if(it.kind==="pick"){
  const box=el("div","ex-pick"),sel=new Set(),norm2=w=>w.toLowerCase().replace(/[.,:!?]/g,"").replace(/[’']/g,"’");
  it.ptext.split(/\s+/).forEach((w,i)=>{const b=el("button","ex-word");b.type="button";b.appendChild(nl(w));b.dataset.w=norm2(w);b.onclick=()=>{if(b.disabled)return;b.classList.toggle("on");b.classList.contains("on")?sel.add(i):sel.delete(i)};box.appendChild(b)});
  const chk=el("button","btn primary",u.check);chk.type="button";
  chk.onclick=()=>{const T=new Set(it.targets.map(norm2));let ok=true;box.querySelectorAll(".ex-word").forEach(b=>{const on=b.classList.contains("on"),t=T.has(b.dataset.w);if(on&&t)b.classList.add("good");else if(on&&!t){b.classList.add("bad");ok=false}else if(!on&&t){b.classList.add("miss");ok=false}});chk.remove();answer(ok,null,box)};
  c.append(box,chk);
 }else{
  // Tiles carry no capital letter or full stop: otherwise the first and last word give the order away.
  const flat=w=>w.replace(/[.,!?]+$/,"").toLowerCase(),line=el("div","ex-line"),pool=el("div","ex-pool"),picked=[];
  const draw=()=>{line.replaceChildren(...picked.map(w=>nl(flat(w))));};
  shuffle(it.w).forEach(w=>{const b=el("button","opt ex-chip");b.type="button";b.appendChild(nl(flat(w)));b.onclick=()=>{if(b.disabled)return;picked.push(w);b.disabled=true;draw();if(picked.length===it.w.length){const ok=picked.map(flat).join(" ")===it.a.split(" ").map(flat).join(" ");answer(ok,null,pool,it.a)}};pool.appendChild(b)});
  const clr=el("button","btn",u.clear);clr.type="button";clr.onclick=()=>{picked.length=0;pool.querySelectorAll("button").forEach(b=>b.disabled=false);draw()};
  c.append(line,pool,clr);
 }
}
function answer(ok,btn,box,orderAnswer){
 const u=U(),s=QZ,it=s.items[s.i],c=$("card");
 box.querySelectorAll("button").forEach(b=>{b.disabled=true;if(it.kind==="mc"&&b.textContent===it.ok)b.classList.add("correct")});
 if(btn&&!ok)btn.classList.add("incorrect");
 if(ok)s.right++;else s.miss.push(it);
 // Progress by skill and grammar point (index.html: modules/insights).
 if(typeof examLog==="function")examLog(KEY,it,ok);
 s.i++;qzSave();s.i--; // the answer counts even if the learner leaves now
 const fb=el("div","ex-fb "+(ok?"ok":"bad"));fb.appendChild(el("strong","",ok?u.right:u.wrong+" "));
 if(!ok&&it.kind!=="pick"){fb.appendChild(nl(it.kind==="order"?it.a:it.ok))}
 if(it.kind==="pick")fb.appendChild(el("p","",X().plurals+it.ok));
 if(it.kind==="pick"&&UKON()&&it.textUk){const d2=el("details","ex-trbox");d2.append(el("summary","","🇺🇦 Переклад"),trEl(it.textUk,"p"));fb.appendChild(d2)}
 if(UKON()){
  if(it.full||it.kind==="order"){const sx=el("p","ex-full");sx.appendChild(nl(it.full||it.a));fb.appendChild(sx);if(it.u)fb.appendChild(trEl(it.u,"p"))}
  if(it.pair){const sx=el("p","ex-full");sx.appendChild(nl(it.pair[0]));sx.append(" — "+it.pair[1]);fb.appendChild(sx)}
  box.querySelectorAll(".opt").forEach(b=>{const u2=OPT_UK[b.textContent];if(u2&&!b.querySelector(".ex-tr"))b.appendChild(trEl(u2))});
  if(it._textEl&&it.text.uk&&!it._textEl.querySelector(".ex-tr")){const d2=el("details","ex-trbox");d2.open=true;d2.append(el("summary","","🇺🇦 Переклад"),trEl(it.text.uk,"p"));it._textEl.appendChild(d2)}
  if(it._box)it._box.querySelectorAll(".ex-tr").forEach(x=>x.hidden=false);
 }
 if(it.e)fb.appendChild(el("p","",it.e));
 c.appendChild(fb);
 if(it._box&&it._box.hidden){it._box.hidden=false}
 if(it.gap||it.kind==="order"||it.kind==="type")say(it.kind==="order"?it.a:it.full.replace(/^.*→\s*/,""));
 const nx=el("button","btn primary ex-next",u.next);nx.type="button";nx.id="nx";nx.onclick=()=>{s.i++;if(s.i<s.items.length){qzSave();ask()}else end()};c.appendChild(nx);
 setTimeout(()=>{try{nx.scrollIntoView({block:"nearest",behavior:"smooth"})}catch(e){}},30);
}
function end(){
 const u=U(),s=QZ,n=s.items.length,pct=Math.round(s.right/n*100),title=u.parts[s.part][0]+" "+u.parts[s.part][1];
 const c=head(title,u.done);bar(1);
 qzClear(s.part);const prev=(st().best||{})[s.part];setBest(s.part,pct);
 const xp=Math.max(0,s.right-Math.round((prev||0)/100*n))*5;if(xp)addXP(xp,"x:"+KEY+":"+s.part); // a record grant: counted once on all devices
 const box=el("div","ex-end");box.append(el("div","ex-big",pct>=70?"🏆":"💪"),el("h2","",pct+"%"),el("p","ex-score",u.score(s.right,n)+(xp?" · +"+xp+" ⭐":"")));
 if(s.part==="proef"){const m=Math.round((Date.now()-s.t0)/60000);box.appendChild(el("p","ex-hint",u.timer+": "+m+" min"))}
 if(s.miss.length){box.appendChild(el("h3","",u.repeat));const ul=el("ul","ex-miss");s.miss.forEach(it=>{const li=el("li","");li.append(el("span","",(it.gap||it.q||u.order)+" → "));li.appendChild(nl(it.kind==="order"?it.a:it.ok));ul.appendChild(li)});box.appendChild(ul)}
 c.appendChild(box);
 const row=el("div","row");const a=el("button","btn primary",u.restart);a.type="button";a.id="nx";a.onclick=()=>quiz(s.part,true);const h=el("button","btn",u.back);h.type="button";h.onclick=home;row.append(a,h);c.appendChild(row);
}

// ---------------- WRITING ----------------
function writePick(){
 const u=U(),c=head(u.parts.schrijven[0]+" "+u.parts.schrijven[1],"");
 c.appendChild(el("p","ex-sub",u.parts.schrijven[2]));
 WRITE.forEach((w,i)=>{const b=el("button","btn toets-pick ex-wpick");b.type="button";b.dataset.write=w.id;b.append(el("span","tp-no",String(i+1)));const tx=el("span","tp-text");tx.appendChild(el("strong","",tr(w.title)));const d=(st().draft||{})[w.id];if(d)tx.appendChild(el("small","tp-meta","✎ "+d.trim().split(/\s+/).length+" woorden"));b.appendChild(tx);b.onclick=()=>write(w);c.appendChild(b)});
}
function write(w,back){
 // back: a function when the task is opened from a lesson; "back" then returns there instead of to the exam.
 const u=U(),c=head(u.parts.schrijven[0]+" "+u.parts.schrijven[1],tr(w.title),back);
 c.appendChild(el("h3","ex-q",tr(w.title)));
 if(w.card){const box=el("div","ex-text ex-card");box.appendChild(nl(w.card));if(UKON()&&w.card_uk){const d2=el("details","ex-trbox");d2.append(el("summary","","🇺🇦 Переклад"),trEl(w.card_uk,"p"));box.appendChild(d2)}c.appendChild(box)}
 const own=(w.task_tr&&w.task_tr[L()])||(L()==="uk"?w.task_uk:"");
 const tk=el("p","ex-task");tk.append(el("b","",u.wTask+": "));tk.appendChild(nl(w.task));if(own)tk.appendChild(trEl(own,"span"));c.appendChild(tk);
 const ta=el("textarea","ex-ta");ta.rows=10;ta.lang="nl";ta.dir="ltr";ta.placeholder=u.wWrite;ta.setAttribute("spellcheck","false");ta.value=((st().draft||{})[w.id])||"";
 ta.oninput=()=>{const s=st();s.draft=s.draft||{};s.draft[w.id]=ta.value;save(s)};
 c.append(ta,el("small","ex-hint",u.wSaved));
 const res=el("div","ex-check");const model=el("div","ex-text ex-model");model.hidden=true;model.appendChild(nl(w.model));if(UKON()&&w.model_uk){const d2=el("details","ex-trbox");d2.open=true;d2.append(el("summary","","🇺🇦 Переклад"),trEl(w.model_uk,"p"));model.appendChild(d2)}
 const row=el("div","row ex-wrow"),ck=el("button","btn primary",u.wCheck),md=el("button","btn",u.wModel);ck.type=md.type="button";
 ck.onclick=()=>{
  const r=score(w,ta.value,COMMON,D.min||5);res.replaceChildren(el("strong","",u.wTips));const ul=el("ul","ex-list");
  r.items.forEach(x=>ul.appendChild(el("li",x.ok?"ok":"bad",(x.ok?"✅ ":"⬜ ")+x.label)));res.appendChild(ul);
  if(r.tips.length){const tl=el("ul","ex-list warn");r.tips.forEach(m=>tl.appendChild(el("li","bad","⚠️ "+m)));res.appendChild(tl)}
  if(typeof examLog==="function")r.tipRes.forEach(re=>examLog(KEY,{src:"tip",re},false));
  setBest("schrijven",r.pct);{const s=st();s.wbest=s.wbest||{};if(!(s.wbest[w.id]>=r.pct)){s.wbest[w.id]=r.pct;save(s)}}bar(r.ok/r.total);
  if(r.pct===100&&!r.tips.length)toast("🏆 "+r.pct+"%");
 };
 md.onclick=()=>{model.hidden=!model.hidden;md.textContent=model.hidden?u.wModel:u.wHideModel};
 row.append(ck,md);
 if(typeof AI_ENDPOINT!=="undefined"&&AI_ENDPOINT){const ai=el("button","btn",(U().wAi).replace(/Peter/g,typeof cx==="function"?cx("{N}"):"Peter"));ai.type="button";ai.onclick=()=>{const t=ta.value.trim();if(t.length<20){toast(U().wAiEmpty);return}
  askStart({focus:D.focus,send:"Kijk mijn e-mail na ("+D.examName+"). Opdracht: "+w.task+(w.card?"\nUitnodiging: "+w.card.replace(/\n/g," "):"")+"\n\nMijn e-mail:\n"+t})};row.appendChild(ai)}
 c.append(row,res,model);
}
// ---------------- SPEAKING ----------------
function speakPick(){
 const u=U(),c=head(u.parts.spreken[0]+" "+u.parts.spreken[1],""),s=st();
 c.appendChild(el("p","ex-sub",u.parts.spreken[2]));
 SPREKEN.forEach((t,i)=>{const okN=((s.sp||{})[t.id]||[]).length;const b=el("button","btn toets-pick");b.type="button";b.dataset.speak=t.id;b.append(el("span","tp-no",String(i+1)));const tx=el("span","tp-text");tx.append(el("strong","",tr(t.t)),el("small","tp-meta",u.sDone(okN,t.qa.length)));b.appendChild(tx);if(okN>=t.qa.length)b.classList.add("passed");const pos=((s.spPos||{})[t.id])||0;if(pos>0&&pos<t.qa.length)tx.appendChild(el("small","tp-nl",X().contAt+(pos+1)));b.onclick=()=>speak(t,pos>0&&pos<t.qa.length?pos:0);c.appendChild(b)});
}
const norm=x=>String(x).toLowerCase().replace(/[’']/g,"'").replace(/[^a-z0-9à-ÿ' ]+/g," ").replace(/\s+/g," ").trim();
function speak(topic,i){
 const u=U(),qa=topic.qa[i],c=head(u.parts.spreken[0]+" "+tr(topic.t),u.q+" "+(i+1)+" "+u.of+" "+topic.qa.length);bar(i/topic.qa.length);
 const q=el("div","ex-text ex-speakq");const qb=el("button","btn ex-say",u.sAsk);qb.type="button";qb.onclick=()=>say(qa[0],qb);q.append(qb);const qt=el("p","ex-q");qt.appendChild(nl(qa[0]));q.appendChild(qt);c.appendChild(q);
 setTimeout(()=>say(qa[0]),250);
 const out=el("div","ex-check"),model=el("div","ex-text ex-model");model.hidden=true;model.append(el("small","",u.sModel+" "));model.appendChild(nl(qa[1]));const mb=el("button","btn ex-say","🔊");mb.type="button";mb.onclick=()=>say(qa[1],mb);model.appendChild(mb);if(UKON()&&qa[3]){model.appendChild(trEl("🇺🇦 "+qa[2]+" — "+qa[3],"p"))}
 const row=el("div","row");
 const mic=el("button","btn primary",u.sSpeak);mic.type="button";
 const hasSR=!!(window.SpeechRecognition||window.webkitSpeechRecognition);if(!hasSR)mic.hidden=true;
 let job=null;
 const judge=alts=>{if(typeof examSpoke==="function")examSpoke(KEY);const said=alts[0]||"";const words=norm(qa[1]).split(" ").filter(w=>w.length>2),got=norm(alts.join(" "));const hit=words.filter(w=>got.includes(w)).length,good=hit/Math.max(1,words.length)>=.6;
  out.replaceChildren(el("small","",u.sHeard),nl(" «"+said+"» "),el("span",good?"ex-good":"ex-meh",good?" 👍":" 🙂"));model.hidden=false};
 mic.onclick=()=>{
  if(mic.classList.contains("rec")){job&&job.stop();return}
  mic.classList.add("rec");mic.textContent=X().stop;out.replaceChildren(el("small","",X().listening));
  const reset=()=>{mic.classList.remove("rec");mic.textContent=u.sSpeak;job=null};
  if(typeof listenLong==="function")job=listenLong({onInterim:t=>{out.replaceChildren(el("small","",u.sHeard),nl(" «"+t+"»"))},onDone:alts=>{reset();judge(alts)},onFail:()=>{reset();model.hidden=false}});
  else listenOnce(alts=>{reset();judge(alts)},()=>{reset();model.hidden=false});
 };
 const sh=el("button","btn",u.sShow);sh.type="button";sh.onclick=()=>{model.hidden=false;say(qa[1])};
 row.append(mic,sh);c.append(row,out,model);
 const mark=el("div","row ex-mark");const ok=el("button","btn ex-ok",u.sOk),re=el("button","btn",u.sRe);ok.type=re.type="button";
 const go=good=>{const s=st();s.sp=s.sp||{};const a=new Set(s.sp[topic.id]||[]);good?a.add(i):a.delete(i);s.sp[topic.id]=[...a];save(s);
  const all=SPREKEN.reduce((n,t)=>n+t.qa.length,0),done=SPREKEN.reduce((n,t)=>n+((s.sp[t.id]||[]).length),0);setBestRaw("spreken",Math.round(done/all*100));
  {const s2=st();s2.spPos=s2.spPos||{};s2.spPos[topic.id]=i+1<topic.qa.length?i+1:0;save(s2)}
  i+1<topic.qa.length?speak(topic,i+1):speakPick()};
 ok.onclick=()=>go(true);re.onclick=()=>go(false);mark.append(ok,re);c.appendChild(mark);
}
function setBestRaw(part,pct){const s=st();s.best=s.best||{};s.best[part]=pct;save(s)}

// ---------------- PUBLIC ----------------
function texts(){ // every Dutch text this module can speak (for tools/collect-audio-texts.js)
 const out=[];Object.values(DLG).forEach(d=>d.forEach(l=>out.push(l[1])));
 GRAM.forEach(g=>out.push(g.w?g.a:g.s.replace("___",g.o[0]).replace(/\s*\(.*\)\s*$/,"").replace(/\s*→.*$/,"")));
 SPREKEN.forEach(t=>t.qa.forEach(([q,a])=>{out.push(q);out.push(a)}));
 (MV||[]).forEach(m=>out.push(m[0].replace("___",m[2].split("|")[0])));(OM||[]).forEach(o=>{out.push(o[0]);out.push(o[1])});(OM_MC||[]).forEach(o=>out.push(o[0]));
 return out;
}
function speakScript(){ // mock speaking exam for the AI: 6 topics in course order, ~22 questions
 const take=D.speakTake||{};
 const out=[];SPREKEN.forEach((t,ti)=>{const [n,rnd]=take[t.id]||[3,true];let qa=t.qa.slice();if(rnd){const first=qa[0];qa=[first,...shuffle(qa.slice(1))]}qa.slice(0,n).forEach(x=>out.push({q:x[0],ti:ti+1,tn:tr(t.t)}))});
 return out;
}
function chips(){return D.chips?D.chips(L()):[]}
// Writing practice inside lessons: open one task by id with a "back to the lesson" target.
const tasks=()=>[...WRITE,...(D.LESSON_WRITE||[])];
function writeTask(id,back){const w=tasks().find(x=>x.id===id);if(!w)return false;write(w,back);return true}
const writeBest=id=>((st().wbest||{})[id]);
return {open:home,texts,chips,speakScript,data:{LEZEN,LUISTEREN,WOORDEN,GRAM,WRITE,SPREKEN,DLG,TEXTS},tasks,writeTask,writeBest,score:(w,t)=>score(w,t,COMMON,D.min||5),practice:part=>part==="spreken"?speakPick():part==="schrijven"?writePick():quiz(part,true),_current:()=>QZ&&QZ.items[QZ.i],_quiz:quiz,_write:write,_speak:speak};
}
globalThis.LerenExam={make,Q,score};
})();
