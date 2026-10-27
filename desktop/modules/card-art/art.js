/* Hand-drawn card pictures in the style of the gap cards: one drawing per emoji.
 * A topic switches to drawings only when every emoji in it has one, so a topic never mixes styles. */
(function(root){
'use strict';
const SK='#F6C9A8',HR='#7A5235',RD='#E5484D',BL='#8FB8E8',YE='#F2C14E',GR='#2FA866',BR='#B9772A',GY='#C9CFDC',DK='#4A5068',LB='#CFE6FA',PK='#F4A6B5',OR='#F28C38',INK='#20243A',W='#fff',DB='#4A7BD0';
const K=(l,b)=>`<svg viewBox="0 0 64 64" width="64" height="64" role="img" class="kt-img" aria-label="${l}"><rect x="1" y="1" width="62" height="62" rx="9" fill="#fff" stroke="${INK}" stroke-opacity=".15"/><g fill="none" stroke="${INK}" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">${b}</g></svg>`;
const T=(x,y,t,s=9,c=INK)=>`<text x="${x}" y="${y}" font-family="Nunito,sans-serif" font-size="${s}" font-weight="800" fill="${c}" stroke="none" text-anchor="middle">${t}</text>`;
const N=(v)=>Math.round(v*10)/10;
// face like the gap cards' FACE, any centre and size; m: smile|sad|o|flat|grin|tongue|yum, e: o|shut|x
function face(cx=32,cy=32,r=14,m='smile',e='o'){const s=r/14,p=(x,y)=>N(cx+x*s)+' '+N(cy+y*s);
 let h=`<path d="M${p(-15,-3)}a${N(15*s)} ${N(15*s)} 0 0 1 ${N(30*s)} 0" fill="${HR}" stroke="none"/><circle cx="${cx}" cy="${cy}" r="${r}" fill="${SK}"/><path d="M${p(-10,-7)}q${N(5*s)} ${N(-6*s)} ${N(20*s)} 0" fill="${HR}" stroke="none"/>`;
 if(e==='o')h+=`<circle cx="${N(cx-5*s)}" cy="${N(cy-1*s)}" r="${N(1.4*s)}" fill="${INK}" stroke="none"/><circle cx="${N(cx+5*s)}" cy="${N(cy-1*s)}" r="${N(1.4*s)}" fill="${INK}" stroke="none"/>`;
 else if(e==='shut')h+=`<path d="M${p(-7.5,-1)}q${N(2.5*s)} ${N(1.8*s)} ${N(5*s)} 0M${p(2.5,-1)}q${N(2.5*s)} ${N(1.8*s)} ${N(5*s)} 0"/>`;
 else h+=`<path d="M${p(-7,-3)}l${N(4*s)} ${N(3*s)}m0 ${N(-3*s)}l${N(-4*s)} ${N(3*s)}M${p(3,-3)}l${N(4*s)} ${N(3*s)}m0 ${N(-3*s)}l${N(-4*s)} ${N(3*s)}"/>`;
 if(m==='smile')h+=`<path d="M${p(-4,6)}q${N(4*s)} ${N(3*s)} ${N(8*s)} 0"/>`;
 else if(m==='sad')h+=`<path d="M${p(-4,8)}q${N(4*s)} ${N(-3*s)} ${N(8*s)} 0"/>`;
 else if(m==='o')h+=`<ellipse cx="${cx}" cy="${N(cy+7*s)}" rx="${N(2*s)}" ry="${N(2.4*s)}"/>`;
 else if(m==='flat')h+=`<path d="M${p(-4,7)}h${N(8*s)}"/>`;
 else if(m==='grin')h+=`<path d="M${p(-6,5)}h${N(12*s)}q0 ${N(6*s)} ${N(-6*s)} ${N(6*s)}t${N(-6*s)} ${N(-6*s)}z" fill="${W}"/>`;
 else if(m==='tongue'||m==='yum')h+=`<path d="M${p(-4,6)}q${N(4*s)} ${N(3*s)} ${N(8*s)} 0"/><path d="M${p(1,7.5)}q${N(1.5*s)} ${N(4*s)} ${N(4*s)} ${N(0.5*s)}" fill="${PK}"/>`;
 return h}
// standing person like the gap cards' PERSON; dx shifts, sc scales around the top centre
const person=(dx=0,sc=1,shirt=BL,pants=DK,arms='M24 22l-6 15M40 22l6 15')=>`<g transform="translate(${N(32+dx-32*sc)} ${N(4-4*sc)}) scale(${sc})"><path d="M27.5 40v19M36.5 40v19" stroke-width="4.2" stroke="${pants}"/><path d="M24 21h16l2 19H22z" fill="${shirt}"/><path d="${arms}" stroke-width="3.2" stroke="${SK}"/><circle cx="32" cy="12" r="6" fill="${SK}"/><path d="M26 9a6 6 0 0 1 12 0" fill="${HR}" stroke="none"/></g>`;
const head=(x,y,r=6)=>`<circle cx="${x}" cy="${y}" r="${r}" fill="${SK}"/><path d="M${x-r} ${N(y-r/2)}a${r} ${r} 0 0 1 ${2*r} 0" fill="${HR}" stroke="none"/>`;
const star=(x,y,r=5,c=RD)=>{let d='';for(let i=0;i<10;i++){const a=Math.PI/5*i-Math.PI/2,rr=i%2?r*.45:r;d+=(i?'L':'M')+N(x+rr*Math.cos(a))+' '+N(y+rr*Math.sin(a))}return `<path d="${d}z" fill="${c}" stroke="none"/>`};
const ouch=(x,y)=>star(x,y,4.5)+`<path d="M${x-7} ${y-5}q2-1.5 0-3.5M${x+7} ${y-5}q-2-1.5 0-3.5M${x-7} ${y+5}q2 1.5 0 3.5M${x+7} ${y+5}q-2 1.5 0 3.5" stroke="${RD}" stroke-width="1.3"/>`;
const clock=(x,y,r,h=10,m=2)=>{const ha=(h%12+m/60)*Math.PI/6,ma=m*Math.PI/30;return `<circle cx="${x}" cy="${y}" r="${r}" fill="${W}"/><path d="M${x} ${y}l${N(Math.sin(ha)*r*.5)} ${N(-Math.cos(ha)*r*.5)}M${x} ${y}l${N(Math.sin(ma)*r*.75)} ${N(-Math.cos(ma)*r*.75)}" stroke-width="2"/><circle cx="${x}" cy="${y}" r="1.3" fill="${INK}" stroke="none"/>`};
const arrow=(d,c=RD)=>`<path d="${d}" stroke="${c}" stroke-width="5"/>`;
const plate=(cx=32,cy=46,rx=24,ry=8)=>`<ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" fill="${W}"/><ellipse cx="${cx}" cy="${cy}" rx="${N(rx*.62)}" ry="${N(ry*.62)}" fill="none" stroke-opacity=".35"/>`;
const hand=(c=SK)=>`<path d="M22 58V38l-6-9q-2-4 2-5t6 4l3 4V16q0-3 3-3t3 3v14-17q0-3 3-3t3 3v17-14q0-3 3-3t3 3v16-11q0-3 3-3t3 3v20q0 12-9 19z" fill="${c}"/>`;
const A={};
root.LerenCardArt={A,K,T,face,person,head,star,ouch,clock,arrow,plate,hand,C:{SK,HR,RD,BL,YE,GR,BR,GY,DK,LB,PK,OR,INK,W,DB},
 apply(DATA){
  // Per topic: the verified 3D pictures when every emoji in the topic has one, else the drawings — never both in one topic.
  const P=root.LerenCard3D||{},img=f=>`<img class="card-3d" src="./img/emoji/${f}.png" alt="" loading="lazy" decoding="async">`;let topics=0;
  for(const d of Object.values(DATA)){const items=(d&&d.items)||[];const emo=items.filter(i=>i.icon&&!String(i.icon).startsWith('<'));if(!emo.length)continue;
   if(emo.every(i=>P[i.icon])){emo.forEach(i=>{i.icon=img(P[i.icon])});topics++}
   else if(emo.every(i=>A[i.icon])){emo.forEach(i=>{i.icon=A[i.icon]});topics++}}
  return topics}};
})(typeof window!=='undefined'?window:globalThis);
