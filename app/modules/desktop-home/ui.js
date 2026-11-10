/* TEST-009 · Desktop header: reminders bell and account, next to the streak and points.
   The language picker lives in Settings so it is not duplicated in the header. */
(() => {
 'use strict';
 const T={
  uk:{bell:'Нагадування',signIn:'Увійти',account:'Акаунт'},
  en:{bell:'Reminders',signIn:'Sign in',account:'Account'},
  fr:{bell:'Rappels',signIn:'Se connecter',account:'Compte'},
  ar:{bell:'التذكيرات',signIn:'تسجيل الدخول',account:'الحساب'}
 };
 let host=null,box=null,bell,account,avatar,name;
 const el=(tag,cls,text)=>{const e=document.createElement(tag);if(cls)e.className=cls;if(text!=null)e.textContent=text;return e};
 const userIcon='<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="9" r="4.2" fill="currentColor"/><path d="M4.5 20.5c1.2-4.2 4-6 7.5-6s6.3 1.8 7.5 6" fill="currentColor"/></svg>';
 const bellIcon='<svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 16V11a6 6 0 0 1 12 0v5l1.6 2H4.4z"/><path d="M10 20.5a2 2 0 0 0 4 0"/></svg>';
 function mount(bridge){
  host=bridge;const header=document.querySelector('main>header'),stats=header&&header.querySelector('.hdr-stats');if(!stats||box)return;
  box=el('div','dh-tools');
  bell=el('button','dh-icon');bell.type='button';bell.innerHTML=bellIcon;bell.onclick=()=>host.reminders();
  account=el('button','dh-account');account.type='button';avatar=el('span','dh-avatar');name=el('span','dh-name');account.append(avatar,name);account.onclick=()=>host.account();
  box.append(bell,el('span','dh-sep'),account);stats.before(box);
  refresh();
 }
 function refresh(){
  if(!box)return;const l=host.language(),t=T[l]||T.uk,user=host.user();
  bell.title=t.bell;bell.setAttribute('aria-label',t.bell);bell.hidden=!host.canRemind();
  if(user){const label=String(user.displayName||'').split(' ')[0]||String(user.email||'').split('@')[0]||t.account;name.textContent=label;avatar.textContent=label.charAt(0).toUpperCase();avatar.classList.add('has-initial');account.setAttribute('aria-label',t.account+' · '+label)}
  else{name.textContent=t.signIn;avatar.innerHTML=userIcon;avatar.classList.remove('has-initial');account.setAttribute('aria-label',t.signIn)}
 }
 globalThis.LerenDesktop={mount,refresh};
})();
