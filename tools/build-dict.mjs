// Builds dict/nl.json from dict/src/*.tsv  (lemma|g|pl|pos|lvl|uk|en|forms|ex_nl|ex_uk)
import fs from "fs";
const dir=new URL("../dict/src/",import.meta.url),out=new URL("../dict/nl.json",import.meta.url);
const POS=new Set(["n","v","adj","adv","prep","conj","pron","num","det","int","phr"]);
const errs=[],warn=[];const map=new Map();
for(const f of fs.readdirSync(dir).filter(f=>f.endsWith(".tsv")).sort()){
  fs.readFileSync(new URL(f,dir),"utf8").split("\n").forEach((line,i)=>{
    if(!line.trim()||line.startsWith("#"))return;
    const c=line.split("|");if(c.length<7){errs.push(f+":"+(i+1)+" fields "+c.length);return}
    let [w,g,pl,pos,lvl,uk,en,forms="",exn="",exu=""]=c.map(s=>s.trim());
    if(!POS.has(pos))errs.push(f+":"+(i+1)+" pos "+pos);
    if(!["1","2"].includes(lvl))errs.push(f+":"+(i+1)+" lvl "+lvl);
    if(g&&!/^(de|het|de,het)$/.test(g))errs.push(f+":"+(i+1)+" g "+g);
    if(pos==="n"&&!g&&!/^[A-Z0-9]/.test(w))warn.push(f+":"+(i+1)+" noun without article "+w);
    if(!uk||!en)errs.push(f+":"+(i+1)+" missing tr");
    if(pl==="-")pl="";
    const key=w+"|"+pos+"|"+pl;
    const e={w,g,pl,p:pos,l:+lvl,uk,en};if(forms)e.f=forms;if(exn){e.x=exn;e.xu=exu}
    if(map.has(key)){const o=map.get(key);
      // merge: keep lowest level, add new meanings, keep first example
      o.l=Math.min(o.l,e.l);
      const add=(a,b)=>{const s=new Set(a.split(/[;,] ?/).map(x=>x.trim()));return b.split(/[;,] ?/).some(x=>!s.has(x.trim()))?a+"; "+b:a};
      if(o.uk!==e.uk)o.uk=add(o.uk,e.uk);if(o.en!==e.en)o.en=add(o.en,e.en);
      if(!o.x&&e.x){o.x=e.x;o.xu=e.xu}if(!o.f&&e.f)o.f=e.f;if(!o.g&&e.g)o.g=e.g;
    }else map.set(key,e);
  });
}
const list=[...map.values()].sort((a,b)=>a.w.localeCompare(b.w,"nl"));
fs.writeFileSync(out,JSON.stringify(list));
const by=p=>list.filter(e=>e.p===p).length;
console.log("entries",list.length,"nouns",by("n"),"verbs",by("v"),"adj",by("adj"),"A1",list.filter(e=>e.l===1).length,"A2",list.filter(e=>e.l===2).length,"examples",list.filter(e=>e.x).length,"bytes",fs.statSync(out).size);
if(warn.length)console.log("WARN",warn.length,warn.slice(0,15).join("\n"));
if(errs.length){console.log("ERR",errs.join("\n"));process.exit(1)}
