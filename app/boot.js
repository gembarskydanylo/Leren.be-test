/* lerenbe.com: loaded before every other script (end of <body>), so it sees their errors. */
// Clickjacking guard: GitHub Pages cannot send X-Frame-Options / frame-ancestors (and <meta> CSP ignores frame-ancestors),
// so a page on another site that puts the app in an <iframe> gets only a link that opens lerenbe.com in the whole tab.
// Same-origin frames (our own widgets, tests) are left alone.
(()=>{if(window.top===window.self)return;let same=false;try{same=!!window.top.location.href}catch(e){}if(same)return;
 try{window.top.location.replace(location.href)}catch(e){}
 const st=document.createElement("style");st.textContent="body>*:not(#lbeFramed){display:none!important}#lbeFramed{display:block;margin:40px 16px;font:600 18px/1.4 system-ui,sans-serif;text-align:center}";
 const a=document.createElement("a");a.id="lbeFramed";a.href=location.href;a.target="_top";a.rel="noopener";a.textContent="lerenbe.com ↗";
 document.head.appendChild(st);document.body.appendChild(a)})();
// Error reports: uncaught errors, unhandled promise rejections and CSP violations on lerenbe.com go to the AI server's
// log (POST /errors), at most 5 different ones per page. Only technical text: no answers, names, e-mail or progress.
(()=>{let on=/^(www\.)?lerenbe\.com$/.test(location.hostname);try{on=on||localStorage.getItem("leren_err_test")==="1"}catch(e){}if(!on)return;
const seen=new Set();
const send=(kind,msg,src,stack)=>{msg=String(msg==null?"":msg).slice(0,300);src=String(src||"").slice(0,200);
 if(seen.size>=5||!msg||msg==="Script error."||/ResizeObserver loop|extension:\/\//.test(msg+" "+src))return;
 const k=kind+"|"+msg+"|"+src;if(seen.has(k))return;seen.add(k);
 try{fetch("https://leren-ai.gembarsky-d.workers.dev/errors",{method:"POST",keepalive:true,headers:{"Content-Type":"text/plain"},body:JSON.stringify({kind,msg,src,stack:String(stack||"").slice(0,1500),
  v:typeof RELEASE_VERSION==="string"?RELEASE_VERSION:"",page:location.pathname,ui:document.documentElement.lang,online:navigator.onLine,ua:navigator.userAgent.slice(0,200)})}).catch(()=>{})}catch(e){}};
addEventListener("error",e=>{if(e instanceof ErrorEvent)send("error",e.message,(e.filename||"")+":"+(e.lineno||0)+":"+(e.colno||0),e.error&&e.error.stack)});
addEventListener("unhandledrejection",e=>{const r=e.reason;send("rejection",r&&r.message||r,"",r&&r.stack)});
addEventListener("securitypolicyviolation",e=>send("csp",e.effectiveDirective+" "+e.blockedURI,(e.sourceFile||"")+":"+(e.lineNumber||0),""));
})()
