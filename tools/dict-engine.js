// ========== DICTIONARY ENGINE: Dutch forms (verbs, nouns, adjectives) + smart search ==========
// Source of truth for the block injected into index.html (between DICT-ENGINE markers) and tested with node.
const DX={};
// irregular / strong verbs: base -> [past sg, past pl, participle, aux(h|z|hz), present ik, present jij/hij]
DX.IRR={zijn:["was","waren","geweest","z","ben","is","bent"],hebben:["had","hadden","gehad","h","heb","heeft","hebt"],
kunnen:["kon","konden","gekund","h","kan","kan","kunt"],mogen:["mocht","mochten","gemogen","h","mag","mag","mag"],willen:["wilde","wilden","gewild","h","wil","wil","wilt"],
zullen:["zou","zouden","","h","zal","zal","zult"],moeten:["moest","moesten","gemoeten","h"],gaan:["ging","gingen","gegaan","z","ga","gaat","gaat"],
staan:["stond","stonden","gestaan","h","sta","staat","staat"],slaan:["sloeg","sloegen","geslagen","h","sla","slaat","slaat"],doen:["deed","deden","gedaan","h","doe","doet","doet"],
zien:["zag","zagen","gezien","h","zie","ziet","ziet"],komen:["kwam","kwamen","gekomen","z","kom","komt","komt"],worden:["werd","werden","geworden","z"],weten:["wist","wisten","geweten","h"],
bakken:["bakte","bakten","gebakken","h"],beginnen:["begon","begonnen","begonnen","z"],bedriegen:["bedroog","bedrogen","bedrogen","h"],bieden:["bood","boden","geboden","h"],
bijten:["beet","beten","gebeten","h"],binden:["bond","bonden","gebonden","h"],blazen:["blies","bliezen","geblazen","h"],blijken:["bleek","bleken","gebleken","z"],
blijven:["bleef","bleven","gebleven","z"],breken:["brak","braken","gebroken","hz"],brengen:["bracht","brachten","gebracht","h"],buigen:["boog","bogen","gebogen","h"],
denken:["dacht","dachten","gedacht","h"],dragen:["droeg","droegen","gedragen","h"],drinken:["dronk","dronken","gedronken","h"],eten:["at","aten","gegeten","h"],
gelden:["gold","golden","gegolden","h"],genezen:["genas","genazen","genezen","hz","genees","geneest","geneest"],genieten:["genoot","genoten","genoten","h"],geven:["gaf","gaven","gegeven","h"],
gieten:["goot","goten","gegoten","h"],grijpen:["greep","grepen","gegrepen","h"],hangen:["hing","hingen","gehangen","h"],helpen:["hielp","hielpen","geholpen","h"],
heten:["heette","heetten","geheten","h"],houden:["hield","hielden","gehouden","h"],kiezen:["koos","kozen","gekozen","h"],kijken:["keek","keken","gekeken","h"],
klimmen:["klom","klommen","geklommen","hz"],kopen:["kocht","kochten","gekocht","h"],krijgen:["kreeg","kregen","gekregen","h"],lachen:["lachte","lachten","gelachen","h"],
laten:["liet","lieten","gelaten","h"],lezen:["las","lazen","gelezen","h"],liegen:["loog","logen","gelogen","h"],liggen:["lag","lagen","gelegen","h"],lijden:["leed","leden","geleden","h"],
lijken:["leek","leken","geleken","h"],lopen:["liep","liepen","gelopen","hz"],meten:["mat","maten","gemeten","h"],nemen:["nam","namen","genomen","h"],
raden:["raadde","raadden","geraden","h"],rijden:["reed","reden","gereden","hz"],roepen:["riep","riepen","geroepen","h"],ruiken:["rook","roken","geroken","h"],
scheiden:["scheidde","scheidden","gescheiden","hz"],schenken:["schonk","schonken","geschonken","h"],schieten:["schoot","schoten","geschoten","h"],schijnen:["scheen","schenen","geschenen","h"],
schrijven:["schreef","schreven","geschreven","h"],schrikken:["schrok","schrokken","geschrokken","z"],slapen:["sliep","sliepen","geslapen","h"],sluiten:["sloot","sloten","gesloten","h"],
snijden:["sneed","sneden","gesneden","h"],spreken:["sprak","spraken","gesproken","h"],springen:["sprong","sprongen","gesprongen","hz"],stelen:["stal","stalen","gestolen","h"],
sterven:["stierf","stierven","gestorven","z"],stijgen:["steeg","stegen","gestegen","z"],trekken:["trok","trokken","getrokken","h"],vallen:["viel","vielen","gevallen","z"],
vangen:["ving","vingen","gevangen","h"],vergeten:["vergat","vergaten","vergeten","hz","vergeet","vergeet","vergeet"],verliezen:["verloor","verloren","verloren","h"],verdwijnen:["verdween","verdwenen","verdwenen","z"],
vinden:["vond","vonden","gevonden","h"],vliegen:["vloog","vlogen","gevlogen","hz"],vragen:["vroeg","vroegen","gevraagd","h"],vriezen:["vroor","vroren","gevroren","h"],
wassen:["waste","wasten","gewassen","h"],wegen:["woog","wogen","gewogen","h"],werpen:["wierp","wierpen","geworpen","h"],winnen:["won","wonnen","gewonnen","h"],
zeggen:["zei","zeiden","gezegd","h"],zingen:["zong","zongen","gezongen","h"],zitten:["zat","zaten","gezeten","h"],zoeken:["zocht","zochten","gezocht","h"],
zwemmen:["zwom","zwommen","gezwommen","hz"],zwijgen:["zweeg","zwegen","gezwegen","h"],bewegen:["bewoog","bewogen","bewogen","h","beweeg","beweegt","beweegt"],mijden:["meed","meden","gemeden","h"],wijzen:["wees","wezen","gewezen","h"],overlijden:["overleed","overleden","overleden","z"],
verbieden:["verbood","verboden","verboden","h"],vergelijken:["vergeleek","vergeleken","vergeleken","h"],skiën:["skiede","skieden","geskied","h","ski","skiet","skiet"],
leggen:["legde","legden","gelegd","h"],schuiven:["schoof","schoven","geschoven","h"],steken:["stak","staken","gestoken","h"],strijken:["streek","streken","gestreken","h"],bidden:["bad","baden","gebeden","h"],zeggen_:null};
DX.INSEP=["be","ge","ver","ont","her","over","onder","achter","mis"];
DX.NOIRR=new Set(["ontmoeten"]);
DX.NATIVE_EREN=new Set(["luisteren","veranderen","verbeteren","herinneren","verzekeren","ergeren","hinderen","verhinderen","bewonderen","leveren","afleveren","opleveren","verminderen","vergaderen","schitteren","timmeren","slenteren","bevorderen","veroveren","wapperen","fladderen","plunderen","overleveren","uitleveren","bibberen","inneren","beteren","zekeren","gaderen","minderen","vorderen","wonderen","kletteren","ploeteren","mopperen","sputteren","zwerven_"]);
DX.NOPREFIX=new Set(["bellen","beven","verven","bergen","geven","gelden","gieten","genezen","genieten","onderhouden_","overleggen_"]);
DX.vowels=/[aeiouy]/;
DX.stem=inf=>{
 if(DX.IRR[inf]&&DX.IRR[inf][4])return{s:DX.IRR[inf][4],raw:DX.IRR[inf][4]};
 let s=inf.endsWith("ën")?inf.slice(0,-2):inf.endsWith("en")?inf.slice(0,-2):inf.slice(0,-1);
 const raw=s;
 if(/([bcdfghjklmnpqrstvwxz])\1$/.test(s))s=s.slice(0,-1);
 else{
  const m=s.match(/^(.*?)([^aeiouy]*)([aeou])([^aeiouyjw])$/);
  if(m){const before=m[1]+m[2],prevIsVowel=/[aeiouy]$/.test(m[1]+m[2]);
   const groups=(s.match(/[aeiouy]+/g)||[]).length;
   const nativeLike=/(ei|ui|ij|ou|au|oe|eu)[^aeiouy]+eren$/.test(inf)||/[aeiou][lnm][bcdfgkpst]eren$/.test(inf);
   const stressedEren=/eren$/.test(inf)&&!DX.NATIVE_EREN.has(inf)&&!nativeLike;
   const schwa=m[3]==="e"&&groups>1&&!stressedEren;
   if(!prevIsVowel&&!schwa)s=before+m[3]+m[3]+m[4];}
 }
 s=s.replace(/z$/,"s").replace(/v$/,"f");
 return {s,raw};
};
DX.split=(w,sep)=>{ // returns {pre,base,insep}
 if(sep)return{pre:sep,base:w.slice(sep.length),insep:""};
 if(DX.IRR[w]||DX.NOPREFIX.has(w))return{pre:"",base:w,insep:""};
 for(const p of DX.INSEP){if(w.startsWith(p)&&w.length-p.length>=4){const rest=w.slice(p.length);
  if(/^[aeiouy]/.test(rest)&&p==="ge")continue; if(!DX.vowels.test(rest.slice(0,-2)))continue;
  if(/^([bcdfghjklmnpqrstvwxz])\1/.test(rest))continue;
  return{pre:"",base:rest,insep:p}}}
 return{pre:"",base:w,insep:""};
};
DX.conj=(lemma,opts={})=>{
 let w=lemma.replace(/^zich /,"");if(w.includes(" "))return null;
 const sep=opts.sep||"",aux0=opts.aux||"";
 let {pre,base,insep}=DX.split(w,sep);
 let irr=DX.NOIRR.has(w)?null:DX.IRR[insep+base]?(base=insep+base,insep="",DX.IRR[base]):DX.IRR[base];
 let pres,pastS,pastP,part,aux,st;

 if(irr){
  const s0=irr[4]||DX.stem(base).s;
  pres=[s0,irr[5]||(/t$/.test(s0)?s0:s0+"t"),irr[6]||irr[5]||(/t$/.test(s0)?s0:s0+"t")];
  pastS=irr[0];pastP=irr[1];part=irr[2];aux=irr[3];
  if(insep&&!DX.IRR[insep+base]){pastS=insep+pastS;pastP=insep+pastP;part=insep+part.replace(/^ge/,"");pres=pres.map(x=>insep+x)}
 }else{
  let {s,raw}=DX.stem(base);s=insep+s;raw=insep+raw;st=s;
  const last=raw.slice(-2)==="ch"?"ch":raw.slice(-1);
  const t="tkfspx".includes(last)||last==="ch";
  pres=[s,/t$/.test(s)?s:s+"t",/t$/.test(s)?s:s+"t"];
  pastS=s+(t?"te":"de");pastP=s+(t?"ten":"den");
  const end=t?"t":"d";const gs=insep?s:/^[ei]/.test(s)?"ge"+{e:"ë",i:"ï"}[s[0]]+s.slice(1):"ge"+s;part=gs+(s.endsWith(end)?"":end);
  aux="h";
 }
 if(aux0)aux=aux0==="z"?"z":aux0==="hz"?"hz":"h";
 const sp=x=>pre?x+" "+pre:x;
 const partF=opts.part||(part?(pre?pre+part:part):"");
 return{inf:lemma,ik:sp(pres[0]),jij:sp(pres[2]||pres[1]),hij:sp(pres[1]),wij:sp(w.slice(pre.length)),
  pastS:sp(pastS),pastP:sp(pastP),part:partF,aux,sep:pre,
  forms:(pre?[sp(pres[0]),sp(pres[1]),sp(pres[2]),sp(pastS),sp(pastP),partF]:[pres[0],pres[1],pres[2],pastS,pastP,partF]).filter(Boolean)};
};
DX.nounForms=e=>{const f=[];if(e.pl)f.push(e.pl);return f};
DX.adjE=a=>{
if(/[ e]$|^(oranje|roze|extra|prima|gratis|plastic|beige|tof|privé|kapot)$/.test(a)||/en$/.test(a)&&a.length>=4)return a;
 if(/(ig|lijk|isch|baar|el|er|ief|end|s)$/.test(a)&&(a.match(/[aeiouy]+/g)||[]).length>1){
  if(/ief$/.test(a))return a.slice(0,-1)+"ve";if(/[aeiou]s$/.test(a)&&!/(is|us)$/.test(a))return a.slice(0,-1)+"ze";return a+"e"}
 let m=a.match(/^(.*?)(aa|ee|oo|uu)([^aeiouy])$/);if(m){let c=m[3];if(c==="f")c="v";if(c==="s")c="z";return m[1]+m[2][0]+c+"e"}
 m=a.match(/^(.*[^aeiouy])([aeiou])([bdfgklmnprst])$/);if(m&&(a.match(/[aeiouy]+/g)||[]).length===1)return a+m[3]+"e";
 m=a.match(/^(.*)(ie|ij|ui|ei|eu|ou|oe)([fs])$/);if(m)return m[1]+m[2]+(m[3]==="f"?"v":"z")+"e";
 return a+"e";
};
DX.adjForms=e=>{if(e.p!=="adj"||e.w.includes(" "))return[];const f=[DX.adjE(e.w)];
 const c=(e.f||"").match(/cmp=([^;]+)/);if(c){c[1].split(",").forEach(x=>{f.push(x,x+"e")})}
 else if(!/^(oranje|roze|extra|prima|gratis|plastic|beige|tof|privé|kapot|dood|moe|open|dicht|klaar|bezet|kwijt|dood|leeg_)$/.test(e.w)&&!/e$/.test(e.w)){const comp=/r$/.test(e.w)?e.w+"der":DX.adjE(e.w).slice(0,-1)+"er";f.push(comp,e.w+(e.w.endsWith("s")?"t":"st"))}
 return f};
DX.opt=f=>{const o={};(f||"").split(";").forEach(kv=>{const[k,v]=kv.split("=");if(k)o[k.trim()]=(v||"").trim()});return o};
// ---------- normalisation & search ----------
DX.norm=s=>String(s||"").toLowerCase().normalize("NFD").replace(/([a-z])[̀-ͯ]+/g,"$1").normalize("NFC").replace(/[’`´ʼ]/g,"'").replace(/[^\p{L}\p{N}' -]/gu," ").replace(/\s+/g," ").trim();
DX.stripArt=s=>s.replace(/^(de|het|een|'t|to|the|a|an|le|la|les|l')\s+/,"");
DX.terms=s=>{const out=[];String(s||"").replace(/\([^)]*\)/g," ").split(/[;,/]| or | або /).map(x=>DX.stripArt(DX.norm(x))).filter(Boolean).forEach(t=>{out.push(t);if(/^[ій]ти/.test(t))out.push((t[0]==="і"?"й":"і")+t.slice(1));if(/ґ/.test(t))out.push(t.replace(/ґ/g,"г"))});return out};
DX.lev=(a,b,max)=>{if(Math.abs(a.length-b.length)>max)return max+1;const d=[];for(let i=0;i<=a.length;i++){d[i]=[i]}for(let j=1;j<=b.length;j++)d[0][j]=j;
 for(let i=1;i<=a.length;i++){let rowMin=99;for(let j=1;j<=b.length;j++){d[i][j]=Math.min(d[i-1][j]+1,d[i][j-1]+1,d[i-1][j-1]+(a[i-1]===b[j-1]?0:1));
  if(i>1&&j>1&&a[i-1]===b[j-2]&&a[i-2]===b[j-1])d[i][j]=Math.min(d[i][j],d[i-2][j-2]+1);rowMin=Math.min(rowMin,d[i][j])}if(rowMin>max)return max+1}return d[a.length][b.length]};
DX.build=entries=>{
 entries.forEach((e,i)=>{e.i=i;const o=DX.opt(e.f);
  e.h=DX.norm(e.w);e.h2=e.h.replace(/^zich /,"");e.hs=e.h.replace(/ /g,"");
  let forms=[];
  if(e.p==="v"){const c=DX.conj(e.w,{sep:o.sep,aux:o.aux,part:o.part});e.cj=c;if(c)forms=c.forms}
  else if(e.p==="n")forms=DX.nounForms(e);
  else if(e.p==="adj")forms=DX.adjForms(e);
  e.fm=[...new Set(forms.map(DX.norm).filter(x=>x&&x!==e.h))];
  e.tu=DX.terms(e.uk);e.te=DX.terms(e.en);e.tf=DX.terms(e.fr);e.ta=DX.terms(e.ar);
 });
 const byForm=new Map();
 entries.forEach(e=>[...new Set([e.h,e.h2,e.hs,...e.fm])].forEach(f=>{if(!byForm.has(f))byForm.set(f,[]);byForm.get(f).push(e)}));
 return{entries,byForm};
};
DX.script=q=>/[Ѐ-ӿ]/.test(q)?"uk":/[؀-ۿ]/.test(q)?"ar":"lat";
DX.search=(ix,raw,{lang="uk",pos="",limit=60}={})=>{
 const q0=DX.norm(raw);if(!q0)return{list:[],q:""};
 const enOnly=/^to /.test(q0);const q=DX.stripArt(q0),sc=DX.script(q);const res=new Map();
 const put=(e,s,why)=>{if(pos&&e.p!==pos)return;const o=res.get(e.i);if(!o||o.s>s)res.set(e.i,{e,s,why})};
 const tl=sc==="uk"?["tu"]:sc==="ar"?["ta"]:["te","tf"];
 const wb=(t,q)=>t===q?0:t.startsWith(q)?1:(" "+t).includes(" "+q)?2:t.includes(q)?3:9;
 if(sc==="lat"&&!enOnly){const qs=q.replace(/ /g,"");[...(ix.byForm.get(q)||[]),...(ix.byForm.get(qs)||[])].forEach(e=>{const ex=e.h===q||e.h2===q||e.hs===qs;put(e,ex?0:1,ex?"":"form")})}
 for(const e of ix.entries){
  if(sc==="lat"&&!enOnly){const k=Math.min(wb(e.h,q),wb(e.h2,q));
   if(k===1)put(e,3);else if(k===2)put(e,5);else if(k===3&&q.length>=3)put(e,7);
   if(q.length>=3)for(const f of e.fm){if(f.startsWith(q)){put(e,6);break}}}
  for(const f of tl){for(const t of e[f]||[]){const k=wb(t,q);
   if(k===0)put(e,2);else if(k===1)put(e,4);else if(k===2)put(e,6);else if(k===3&&q.length>=3)put(e,8)}}
 }
 let list=[...res.values()];
 let fuzzy=false;
 if(!list.some(r=>r.s<=4)&&list.length<5&&q.length>=3){const max=q.length>=7?2:1;let nf=0;
  for(const e of ix.entries){const cands=sc==="lat"?[e.h2,...e.fm,...e.te]:sc==="uk"?e.tu:e.ta;
   for(const c of cands){if(Math.abs(c.length-q.length)>max)continue;const dd=DX.lev(c,q,max);if(dd<=max){put(e,10+dd,"fuzzy");fuzzy=true;nf++;break}}if(nf>=8)break}
  list=[...res.values()];}
 list.sort((a,b)=>a.s-b.s||a.e.l-b.e.l||(a.e.p==="phr")-(b.e.p==="phr")||a.e.w.length-b.e.w.length||a.e.w.localeCompare(b.e.w,"nl"));
 return{list:list.slice(0,limit),q,total:list.length,fuzzy:fuzzy&&list.every(r=>r.s>=10)};
};
if(typeof module!=="undefined")module.exports=DX;
