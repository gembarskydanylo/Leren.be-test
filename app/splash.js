// First launch: choose an explanation language; then show a localized four-second welcome.
// Returning learners go directly to the app. No progress is reset.
(function(){
 "use strict";
 var box=document.getElementById("splash");if(!box)return;
 var languages=[
  {id:"uk",label:"🇺🇦 Українська",title:"Ласкаво просимо!",subtitle:"Нідерландська стане ближчою."},
  {id:"en",label:"🇬🇧 English",title:"Welcome!",subtitle:"Your Dutch journey starts here."},
  {id:"fr",label:"🇫🇷 Français",title:"Bienvenue !",subtitle:"Le néerlandais devient plus simple."},
  {id:"ar",label:"🇸🇦 العربية",title:"أهلاً بك!",subtitle:"تعلّم الهولندية خطوة بخطوة."}
 ];
 var key="leren_onboarding_language_v1";
 function storage(k){try{return localStorage.getItem(k)}catch(e){return null}}
 function save(k,v){try{localStorage.setItem(k,v)}catch(e){}}
 function remove(){document.documentElement.classList.remove("splash-on");if(box&&box.parentNode)box.remove();box=null}
 // Existing users already made a language choice in Settings. Respect it.
 // Automated browsers may bypass onboarding to keep unrelated regression tests deterministic.
 var skip=false;
 try{skip=!!navigator.webdriver||/[?&]nosplash\b/.test(location.search)}catch(e){}
 if(skip||storage(key)==="1"||languages.some(function(l){return l.id===storage("poly_ui")})){remove();return}
 var selected=false;
 function node(tag,cls,content){var el=document.createElement(tag);if(cls)el.className=cls;if(content!=null)el.textContent=content;return el}
 function cat(){var img=node("img","onboard-cat");img.alt="";img.src="./img/mascot/student-cat-v1.png";return img}
 function finish(){if(!box)return;box.classList.add("out");setTimeout(remove,320)}
 function choose(l){
  if(selected)return;selected=true;
  // Persist before transitioning. If the main app hasn't initialized yet,
  // it will read this same stored language when it starts.
  save("poly_ui",l.id);save(key,"1");
  var picker=document.getElementById("headerUiLangPicker");
  if(picker){picker.value=l.id;picker.dispatchEvent(new Event("change",{bubbles:true}))}
  else document.addEventListener("DOMContentLoaded",function(){var p=document.getElementById("headerUiLangPicker");if(p){p.value=l.id;p.dispatchEvent(new Event("change",{bubbles:true}))}},{once:true});
  box.setAttribute("role","status");box.removeAttribute("aria-modal");box.removeAttribute("aria-labelledby");
  box.replaceChildren();
  var banner=node("section","onboard-banner");if(l.id==="ar")banner.dir="rtl";
  var heading=node("h2","",l.title),sub=node("p","",l.subtitle),logo=node("strong","","lerenbe.com");
  var img=node("img");img.src="./img/home/hero-cat-v196.png";img.alt="";
  banner.append(heading,img,sub,logo);box.append(banner);
  // Four seconds after the language choice, reveal the main app.
  setTimeout(finish,4000);
 }
 function show(){
  box.hidden=false;box.setAttribute("role","dialog");box.setAttribute("aria-modal","true");box.setAttribute("aria-labelledby","onboardTitle");
  document.documentElement.classList.add("splash-on");
  var card=node("section","onboard-card");
  var title=node("h2","", "Оберіть мову");title.id="onboardTitle";
  var subtitle=node("p","","Якою мовою пояснювати нідерландську?");
  var options=node("div","onboard-options");
  languages.forEach(function(l){var button=node("button","",l.label);button.type="button";button.addEventListener("click",function(){choose(l)});options.append(button)});
  card.append(cat(),title,subtitle,options);box.append(card);
  var first=options.querySelector("button");if(first)first.focus({preventScroll:true});
 }
 show();
})();
