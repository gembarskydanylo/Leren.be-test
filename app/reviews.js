import {initializeApp} from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js';
import {getAuth,onAuthStateChanged,signInAnonymously,GoogleAuthProvider,signInWithPopup,signInWithRedirect,getRedirectResult,signOut} from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js';
import {initializeAppCheck,ReCaptchaEnterpriseProvider} from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-app-check.js';
import {getFirestore,collection,doc,getDoc,getDocs,query,orderBy,limit,setDoc,deleteDoc,writeBatch,serverTimestamp} from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js';

const app=initializeApp({apiKey:'AIzaSyA-v4mkpSlmpjwM5s34nD6jlgRZfVuxOwQ',authDomain:'leren-be.firebaseapp.com',projectId:'leren-be',appId:'1:533895640416:web:770d52f1926e13a186da05'},'reviews');
// App Check (reCAPTCHA Enterprise, only on lerenbe.com): Firestore can then refuse requests that do not come from this site.
if(/(^|\.)lerenbe\.com$/.test(location.hostname)){try{initializeAppCheck(app,{provider:new ReCaptchaEnterpriseProvider('6Lct5RYuAAAAABhPFLfNjJzc-QTy4hleZyGPAQHV'),isTokenAutoRefreshEnabled:true})}catch(error){console.error('App Check:',error)}}
const auth=getAuth(app),db=getFirestore(app);
const owner='gembarsky.d@gmail.com';
const $=id=>document.getElementById(id);
const copy={
 uk:{language:'Мова',eyebrow:'Голоси учнів',title:'Відгуки про навчання',intro:'Справжні враження людей, які вчать нідерландську з lerenbe.com. Прочитай їх або розкажи про свій досвід.',heroCta:'Написати відгук ↓',published:'Опубліковані історії',readTitle:'Що кажуть учні',loading:'Завантажуємо відгуки…',empty:'Перші відгуки ще чекають на публікацію. Можеш залишити свій — він з’явиться тут після перевірки.',loadError:'Не вдалося завантажити відгуки. Перевір з’єднання та онови сторінку.',yourVoice:'Твій голос',writeTitle:'Поділися враженням',writeIntro:'Що допомогло тобі у вивченні мови? Відгук з’явиться на сторінці після перевірки. Пошта й реєстрація не потрібні.',nameLabel:'Ім’я або псевдонім',nameHint:'Наприклад, Олена',ratingLabel:'Твоя оцінка',textLabel:'Твій відгук',textHint:'Що тобі сподобалося? Що можна покращити?',consent:'Дозволяю опублікувати моє ім’я або псевдонім, оцінку та текст відгуку. Не вказуватиму приватні дані.',send:'Надіслати відгук',sending:'Надсилаємо…',sent:'Дякуємо! Відгук збережено. Після перевірки він з’явиться тут.',pending:'Твій відгук уже на перевірці. Можеш оновити його через цю форму.',sendError:'Не вдалося зберегти відгук. Перевір інтернет і спробуй ще раз.',noSwear:'Будь ласка, напиши відгук без лайки — тоді ми зможемо його опублікувати.',flagged:'⚠ Можлива лайка',adminLogin:'Модерація для власника',adminTitle:'Нові відгуки на перевірці',logout:'Вийти',notOwner:'Цей Google-акаунт не має доступу до модерації.',loginError:'Не вдалося увійти. Спробуй ще раз.',adminEmpty:'Нових відгуків немає.',adminError:'Не вдалося завантажити чергу.',approve:'Опублікувати',reject:'Відхилити',confirmReject:'Відхилити й видалити цей відгук?',moderateError:'Не вдалося виконати дію. Спробуй ще раз.',back:'← На головну',privacy:'Конфіденційність'},
 en:{language:'Language',eyebrow:'Learner voices',title:'Learner reviews',intro:'Real experiences from people learning Dutch with lerenbe.com. Read their stories or share yours.',heroCta:'Write a review ↓',published:'Published stories',readTitle:'What learners say',loading:'Loading reviews…',empty:'The first reviews are awaiting publication. You can leave yours; it will appear here after review.',loadError:'Could not load reviews. Check your connection and refresh.',yourVoice:'Your voice',writeTitle:'Share your experience',writeIntro:'What has helped you learn? Your review will appear after moderation. No email or registration is needed.',nameLabel:'Name or nickname',nameHint:'For example, Olena',ratingLabel:'Your rating',textLabel:'Your review',textHint:'What did you like? What could improve?',consent:'I agree to publish my name or nickname, rating, and review text. I will not include private information.',send:'Send review',sending:'Sending…',sent:'Thank you! Your review is saved and will appear here after moderation.',pending:'Your review is awaiting moderation. You can update it using this form.',sendError:'Could not save your review. Check your connection and try again.',noSwear:'Please write your review without swear words so we can publish it.',flagged:'⚠ Possible swearing',adminLogin:'Owner moderation',adminTitle:'Reviews awaiting moderation',logout:'Sign out',notOwner:'This Google account cannot moderate reviews.',loginError:'Could not sign in. Please try again.',adminEmpty:'No new reviews.',adminError:'Could not load the queue.',approve:'Publish',reject:'Reject',confirmReject:'Reject and delete this review?',moderateError:'Could not complete this action. Please try again.',back:'← Home',privacy:'Privacy'},
 fr:{language:'Langue',eyebrow:'Voix des apprenants',title:'Avis des apprenants',intro:'Des témoignages de personnes qui apprennent le néerlandais avec lerenbe.com. Lis-les ou partage ton expérience.',heroCta:'Écrire un avis ↓',published:'Témoignages publiés',readTitle:'Ce qu’en disent les apprenants',loading:'Chargement des avis…',empty:'Les premiers avis attendent leur publication. Tu peux laisser le tien ; il apparaîtra ici après vérification.',loadError:'Impossible de charger les avis. Vérifie ta connexion.',yourVoice:'À toi de parler',writeTitle:'Partage ton expérience',writeIntro:'Qu’est-ce qui t’a aidé ? Ton avis apparaîtra après modération. Aucune adresse e-mail ni inscription requise.',nameLabel:'Nom ou pseudonyme',nameHint:'Par exemple, Olena',ratingLabel:'Ta note',textLabel:'Ton avis',textHint:'Qu’as-tu aimé ? Que pourrait-on améliorer ?',consent:'J’accepte la publication de mon nom ou pseudonyme, de ma note et de mon avis. Je ne mentionnerai pas de données privées.',send:'Envoyer mon avis',sending:'Envoi…',sent:'Merci ! Ton avis est enregistré et apparaîtra ici après modération.',pending:'Ton avis attend sa vérification. Tu peux le modifier ici.',sendError:'Impossible d’enregistrer ton avis. Vérifie ta connexion et réessaie.',noSwear:'Merci d’écrire ton avis sans gros mots pour que nous puissions le publier.',flagged:'⚠ Grossièretés possibles',adminLogin:'Modération du propriétaire',adminTitle:'Avis à vérifier',logout:'Se déconnecter',notOwner:'Ce compte Google ne peut pas modérer les avis.',loginError:'Connexion impossible. Réessaie.',adminEmpty:'Aucun nouvel avis.',adminError:'Impossible de charger les avis.',approve:'Publier',reject:'Rejeter',confirmReject:'Rejeter et supprimer cet avis ?',moderateError:'Action impossible. Réessaie.',back:'← Accueil',privacy:'Confidentialité'},
 ar:{language:'اللغة',eyebrow:'آراء المتعلمين',title:'تجارب المتعلمين',intro:'تجارب حقيقية لأشخاص يتعلمون الهولندية مع lerenbe.com. اقرأها أو شارك تجربتك.',heroCta:'اكتب رأيك ↓',published:'تجارب منشورة',readTitle:'ماذا يقول المتعلمون',loading:'جارٍ تحميل الآراء…',empty:'أول الآراء قيد المراجعة. يمكنك كتابة رأيك وسيظهر هنا بعد الموافقة.',loadError:'تعذر تحميل الآراء. تحقق من اتصال الإنترنت.',yourVoice:'رأيك مهم',writeTitle:'شارك تجربتك',writeIntro:'ما الذي ساعدك على التعلم؟ سيظهر رأيك بعد مراجعته. لا حاجة للبريد الإلكتروني أو التسجيل.',nameLabel:'الاسم أو الاسم المستعار',nameHint:'مثلاً أولينا',ratingLabel:'تقييمك',textLabel:'رأيك',textHint:'ما الذي أعجبك؟ وما الذي يمكن تحسينه؟',consent:'أوافق على نشر اسمي أو اسمي المستعار وتقييمي ونص رأيي. لن أذكر معلومات خاصة.',send:'إرسال الرأي',sending:'جارٍ الإرسال…',sent:'شكراً! حُفظ رأيك وسيظهر هنا بعد المراجعة.',pending:'رأيك قيد المراجعة. يمكنك تحديثه من هذا النموذج.',sendError:'تعذر حفظ الرأي. تحقق من الاتصال وحاول مجدداً.',noSwear:'يرجى كتابة رأيك بدون ألفاظ نابية حتى نتمكن من نشره.',flagged:'⚠ ألفاظ نابية محتملة',adminLogin:'إدارة المراجعات',adminTitle:'آراء تنتظر المراجعة',logout:'تسجيل الخروج',notOwner:'لا يملك حساب Google هذا صلاحية إدارة الآراء.',loginError:'تعذر تسجيل الدخول. حاول مجدداً.',adminEmpty:'لا توجد آراء جديدة.',adminError:'تعذر تحميل القائمة.',approve:'نشر',reject:'رفض',confirmReject:'رفض هذا الرأي وحذفه؟',moderateError:'تعذر إكمال العملية. حاول مجدداً.',back:'← الرئيسية',privacy:'الخصوصية'}
};
// Swearing. STRONG: unambiguous swear stems at the START of a word (so «рахуй», «люблять», «дебати» stay allowed); the page refuses them and firestore.rules refuses the same list (keep both in
// sync, tests/reviews-filter.cjs checks it). SOFT: rude or ambiguous words; only highlighted for the moderator, never refused.
const STRONG=/(^|[^a-zа-яёіїєґ])(хуй|хуя|хує|хуї|хуе|нахуй|нахуя|похуй|похуя|ніхуя|нихуя|охуе|охуї|пизд|розпизд|спизд|запизд|напизд|впизд|підпизд|бляд|блять|їбан|їбат|їбал|заїба|йобан|ебан|ебат|ебал|заеба|наеба|уеба|проеба|виеба|выеба|єбан|єбат|єбал|заєба|мудак|мудил|підор|підар|пидор|пидар|гандон|залуп|шлюх|курв|fuck|motherf|shit|cunt|asshole|klootzak|godverdomme|putain|connard|salope|encul)/i,SOFT=/сука|суки|дебіл|дебил|ідіот|идиот|лох|придур|урод|срак|жоп|idiot|stupid|bitch|damn|kut|lul|kanker|tering|merde|con /i;
const swears=x=>STRONG.test(String(x||'').toLowerCase()),rude=x=>SOFT.test(' '+String(x||'').toLowerCase()+' ');
const validLang=['uk','en','fr','ar'];
let lang=validLang.includes(new URLSearchParams(location.search).get('lang'))?new URLSearchParams(location.search).get('lang'):validLang.includes(localStorage.getItem('poly_ui'))?localStorage.getItem('poly_ui'):'uk';
const t=()=>copy[lang];
const dateOf=x=>x&&typeof x.toDate==='function'?x.toDate():null;
function translate(){
 document.documentElement.lang=lang;document.documentElement.dir=lang==='ar'?'rtl':'ltr';$('language').value=lang;
 document.querySelectorAll('[data-i18n]').forEach(el=>{el.textContent=t()[el.dataset.i18n]});
 $('reviewName').placeholder=t().nameHint;$('reviewText').placeholder=t().textHint;
 document.title=t().title+' — lerenbe.com';
}
function reviewCard(data){
 const card=document.createElement('article');card.className='review-card';
 const top=document.createElement('div');top.className='review-top';
 const name=document.createElement('strong');name.textContent=data.name;
 const stars=document.createElement('span');stars.className='stars';stars.setAttribute('aria-label',String(data.rating)+'/5');stars.textContent='★'.repeat(data.rating)+'☆'.repeat(5-data.rating);
 top.append(name,stars);card.append(top);
 const body=document.createElement('p');body.textContent=data.text;card.append(body);
 const date=dateOf(data.approvedAt||data.createdAt);
 if(date){const time=document.createElement('time');time.dateTime=date.toISOString();time.textContent=new Intl.DateTimeFormat(lang==='uk'?'uk-UA':lang==='fr'?'fr-BE':lang==='ar'?'ar':'en-GB',{year:'numeric',month:'long',day:'numeric'}).format(date);card.append(time)}
 return card;
}
async function loadPublic(){
 $('listStatus').textContent=t().loading;$('listStatus').hidden=false;$('reviewList').replaceChildren();
 try{
  const docs=await getDocs(query(collection(db,'reviews_public'),orderBy('approvedAt','desc'),limit(30)));
  $('reviewCount').hidden=docs.empty;$('reviewCount').textContent=String(docs.size);
  if(docs.empty){$('listStatus').textContent=t().empty;return}
  $('listStatus').hidden=true;docs.forEach(item=>$('reviewList').append(reviewCard(item.data())));
 }catch(error){console.error('Review list:',error);$('listStatus').textContent=t().loadError}
}
async function loadOwn(user){
 if(!user || user.email===owner)return;
 try{const snap=await getDoc(doc(db,'reviews_pending',user.uid));if(snap.exists())$('formStatus').textContent=t().pending}
 catch(error){console.error('Own review:',error)}
}
function isOwner(user){return !!user&&user.email===owner&&user.emailVerified}
async function loadPending(){
 $('adminStatus').textContent=t().loading;$('pendingList').replaceChildren();
 try{
  const docs=await getDocs(query(collection(db,'reviews_pending'),orderBy('createdAt','desc'),limit(100)));
  $('adminStatus').textContent=docs.empty?t().adminEmpty:'';
  docs.forEach(item=>{
   const data=item.data(),card=reviewCard(data),actions=document.createElement('div');actions.className='moderation';
   if(swears(data.name)||swears(data.text)||rude(data.name)||rude(data.text)){card.classList.add('is-flagged');const flag=document.createElement('p');flag.className='flag';flag.textContent=t().flagged;card.prepend(flag)}
   const approve=document.createElement('button');approve.type='button';approve.textContent=t().approve;
   approve.addEventListener('click',()=>moderate(item,true,approve,actions));
   const reject=document.createElement('button');reject.type='button';reject.textContent=t().reject;
   reject.addEventListener('click',()=>{if(confirm(t().confirmReject))moderate(item,false,reject,actions)});
   actions.append(approve,reject);card.append(actions);$('pendingList').append(card);
  });
 }catch(error){console.error('Moderation list:',error);$('adminStatus').textContent=t().adminError}
}
async function moderate(item,publish,button,actions){
 [...actions.querySelectorAll('button')].forEach(x=>x.disabled=true);
 try{
  const pending=doc(db,'reviews_pending',item.id);
  if(publish){
   const {name,text,rating,locale,createdAt}=item.data();
   const batch=writeBatch(db);
   batch.set(doc(db,'reviews_public',item.id),{name,text,rating,locale,createdAt,approvedAt:serverTimestamp()});
   batch.delete(pending);await batch.commit();await loadPublic();
  }else await deleteDoc(pending);
  actions.closest('.review-card').remove();
  if(!$('pendingList').children.length)$('adminStatus').textContent=t().adminEmpty;
 }catch(error){console.error('Moderation:',error);$('adminStatus').textContent=t().moderateError;[...actions.querySelectorAll('button')].forEach(x=>x.disabled=false)}
}
$('language').addEventListener('change',event=>{lang=event.target.value;localStorage.setItem('poly_ui',lang);translate();loadPublic();if(isOwner(auth.currentUser))loadPending()});
$('reviewText').addEventListener('input',()=>{$('charCount').textContent=$('reviewText').value.length+' / 600'});
$('reviewForm').addEventListener('submit',async event=>{
 event.preventDefault();
 if(!$('reviewForm').reportValidity()||$('reviewForm').website.value)return;
 const name=$('reviewName').value.trim(),text=$('reviewText').value.trim(),rating=Number($('reviewRating').value);
 if(name.length<2||text.length<20||text.length>600)return;
 if(swears(name)||swears(text)){$('formStatus').textContent=t().noSwear;$('formStatus').classList.add('error');return}
 const button=$('submitReview');button.disabled=true;button.textContent=t().sending;$('formStatus').textContent='';$('formStatus').classList.remove('error');
 try{
  const user=auth.currentUser|| (await signInAnonymously(auth)).user;
  await setDoc(doc(db,'reviews_pending',user.uid),{name,text,rating,locale:lang,createdAt:serverTimestamp()});
  $('formStatus').textContent=t().sent;$('reviewForm').reset();$('charCount').textContent='0 / 600';
 }catch(error){console.error('Review submission:',error);$('formStatus').textContent=t().sendError;$('formStatus').classList.add('error')}
 finally{button.disabled=false;button.textContent=t().send}
});
$('adminLogin').addEventListener('click',async()=>{
 try{const provider=new GoogleAuthProvider();provider.setCustomParameters({prompt:'select_account'});await signInWithPopup(auth,provider)}
 catch(error){
  if(error.code==='auth/popup-blocked'||error.code==='auth/cancelled-popup-request'){
   try{await signInWithRedirect(auth,new GoogleAuthProvider())}catch(redirectError){console.error('Moderation redirect:',redirectError);$('adminMessage').textContent=t().loginError}
  }else{$('adminMessage').textContent=t().loginError}
 }
});
$('adminLogout').addEventListener('click',()=>signOut(auth));
onAuthStateChanged(auth,user=>{
 const admin=isOwner(user);$('adminLogin').hidden=admin;$('adminPanel').hidden=!admin;
 $('adminMessage').textContent=!admin&&user&&user.email?t().notOwner:'';
 if(admin)loadPending();
 loadOwn(user);
});
getRedirectResult(auth).catch(error=>console.error('Moderation sign-in:',error));
translate();loadPublic();
