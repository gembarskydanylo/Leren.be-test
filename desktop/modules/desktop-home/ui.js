/* TEST-009 · Desktop header: language with flag, reminders bell and account, next to the streak and points.
   Shown from 1024px; phones keep the existing compact header. */
(() => {
 'use strict';
 const FLAG={
  uk:'<svg viewBox="0 0 24 24" aria-hidden="true"><clipPath id="dhc1"><circle cx="12" cy="12" r="12"/></clipPath><g clip-path="url(#dhc1)"><rect width="24" height="12" fill="#0057B7"/><rect y="12" width="24" height="12" fill="#FFD700"/></g></svg>',
  fr:'<svg viewBox="0 0 24 24" aria-hidden="true"><clipPath id="dhc2"><circle cx="12" cy="12" r="12"/></clipPath><g clip-path="url(#dhc2)"><rect width="8" height="24" fill="#002395"/><rect x="8" width="8" height="24" fill="#fff"/><rect x="16" width="8" height="24" fill="#ED2939"/></g></svg>',
  en:'<svg viewBox="0 0 24 24" aria-hidden="true"><clipPath id="dhc3"><circle cx="12" cy="12" r="12"/></clipPath><g clip-path="url(#dhc3)"><rect width="24" height="24" fill="#012169"/><path d="M0 0l24 24M24 0L0 24" stroke="#fff" stroke-width="5"/><path d="M0 0l24 24M24 0L0 24" stroke="#C8102E" stroke-width="2"/><path d="M12 0v24M0 12h24" stroke="#fff" stroke-width="7"/><path d="M12 0v24M0 12h24" stroke="#C8102E" stroke-width="4"/></g></svg>',
  ar:'<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="11" fill="#E3F1EA" stroke="#16955A" stroke-width="1.6"/><path d="M1 12h22M12 1c4 4 4 18 0 22M12 1c-4 4-4 18 0 22" fill="none" stroke="#16955A" stroke-width="1.6"/></svg>'
 };
 const NAMES={uk:'Українська',en:'English',fr:'Français',ar:'العربية'};
 const T={
  uk:{lang:'Мова пояснень',bell:'Нагадування',signIn:'Увійти',account:'Акаунт'},
  en:{lang:'Explanation language',bell:'Reminders',signIn:'Sign in',account:'Account'},
  fr:{lang:'Langue des explications',bell:'Rappels',signIn:'Se connecter',account:'Compte'},
  ar:{lang:'لغة الشرح',bell:'التذكيرات',signIn:'تسجيل الدخول',account:'الحساب'}
 };
 let host=null,box=null,flag,select,bell,account,avatar,name;
 const el=(tag,cls,text)=>{const e=document.createElement(tag);if(cls)e.className=cls;if(text!=null)e.textContent=text;return e};
 const userIcon='<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="9" r="4.2" fill="currentColor"/><path d="M4.5 20.5c1.2-4.2 4-6 7.5-6s6.3 1.8 7.5 6" fill="currentColor"/></svg>';
 const bellIcon='<svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 16V11a6 6 0 0 1 12 0v5l1.6 2H4.4z"/><path d="M10 20.5a2 2 0 0 0 4 0"/></svg>';
 function mount(bridge){
  host=bridge;const header=document.querySelector('main>header'),stats=header&&header.querySelector('.hdr-stats');if(!stats||box)return;
  box=el('div','dh-tools');
  const lang=el('label','dh-lang');flag=el('span','dh-flag');select=el('select');for(const [v,n] of Object.entries(NAMES)){const o=el('option','',n);o.value=v;select.appendChild(o)}
  select.onchange=()=>host.setLanguage(select.value);lang.append(flag,select);
  bell=el('button','dh-icon');bell.type='button';bell.innerHTML=bellIcon;bell.onclick=()=>host.reminders();
  account=el('button','dh-account');account.type='button';avatar=el('span','dh-avatar');name=el('span','dh-name');account.append(avatar,name);account.onclick=()=>host.account();
  box.append(lang,el('span','dh-sep'),bell,el('span','dh-sep'),account);stats.before(box);
  refresh();
 }
 function refresh(){
  if(!box)return;const l=host.language(),t=T[l]||T.uk,user=host.user();
  select.value=l;select.setAttribute('aria-label',t.lang);flag.innerHTML=FLAG[l]||FLAG.uk;
  bell.title=t.bell;bell.setAttribute('aria-label',t.bell);bell.hidden=!host.canRemind();
  if(user){const label=String(user.displayName||'').split(' ')[0]||String(user.email||'').split('@')[0]||t.account;name.textContent=label;avatar.textContent=label.charAt(0).toUpperCase();avatar.classList.add('has-initial');account.setAttribute('aria-label',t.account+' · '+label)}
  else{name.textContent=t.signIn;avatar.innerHTML=userIcon;avatar.classList.remove('has-initial');account.setAttribute('aria-label',t.signIn)}
 }
 globalThis.LerenDesktop={mount,refresh};
})();
