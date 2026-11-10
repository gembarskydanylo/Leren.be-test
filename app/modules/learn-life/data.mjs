// Learn Life stories are small, complete situations. Add a story here without
// changing the practice engine or the existing guided course.
export const fence = {
 id: 'fence-neighbour',
 title: 'Будуємо паркан із сусідом',
 subtitle: 'Справжні фрази для роботи у дворі: від розмітки до встановлення хвіртки.',
 objects: [
  {id:'tape',icon:'📏',nl:'de rolmeter',uk:'рулетка',acc:'рулетку'},
  {id:'cord',icon:'🧵',nl:'het metselkoord',uk:'будівельний шнур',acc:'будівельний шнур'},
  {id:'stake',icon:'📍',nl:'de piketpaal',uk:'кілочок',acc:'кілочок'},
  {id:'shovel',icon:'🪏',nl:'de schop',uk:'лопата',acc:'лопату'},
  {id:'hammer',icon:'🔨',nl:'de hamer',uk:'молоток',acc:'молоток'},
  {id:'sledge',icon:'🛠️',nl:'de voorhamer',uk:'кувалда',acc:'кувалду'},
  {id:'post',icon:'🪵',nl:'de paal',uk:'стовпчик',acc:'стовпчик'},
  {id:'gate',icon:'🚪',nl:'de tuinpoort',uk:'хвіртка',acc:'хвіртку'},
  {id:'block',icon:'🟫',nl:'het houten blokje',uk:'дерев’яний брусочок',acc:'дерев’яний брусочок'},
  {id:'level',icon:'📐',nl:'de waterpas',uk:'будівельний рівень',acc:'будівельний рівень'},
  {id:'driver',icon:'🪛',nl:'de accuschroevendraaier',uk:'шуруповерт',acc:'шуруповерт'},
  {id:'drill',icon:'🔩',nl:'de boormachine',uk:'дриль',acc:'дриль'},
  {id:'nails',icon:'📌',nl:'de spijkers',uk:'цвяхи',acc:'цвяхи'},
  {id:'screws',icon:'🔧',nl:'de schroeven',uk:'шурупи',acc:'шурупи'},
  {id:'gravel',icon:'🪨',nl:'het grind',uk:'щебінь',acc:'щебінь'},
  {id:'sand',icon:'🏖️',nl:'het zand',uk:'пісок',acc:'пісок'},
  {id:'brick',icon:'🧱',nl:'de baksteen',uk:'цегла',acc:'цеглу'},
  {id:'concrete',icon:'⚪',nl:'het oude beton',uk:'старий бетон',acc:'старий бетон'}
 ],
 // The first sentence is what to say on the job; the second is the meaning.
 phrases: [
  {id:'measure-all',nl:'We moeten eerst alles opmeten.',uk:'Спочатку треба все виміряти.',note:'opmeten — виміряти розміри на місці.'},
  {id:'tape-please',nl:'Kun je me de rolmeter even aangeven?',uk:'Можеш подати мені рулетку?',note:'Kun je … even …? — ввічливе коротке прохання.'},
  {id:'mark-stakes',nl:'Sla hier de piketpalen in de grond.',uk:'Вбий тут кілочки в землю.',note:'de piketpalen — кілочки для розмітки.'},
  {id:'stretch-cord',nl:'Span het metselkoord strak tussen de piketpalen.',uk:'Натягни будівельний шнур між кілочками.',note:'strak — туго, без провисання.'},
  {id:'measure-distance',nl:'Meet de afstand tussen de palen.',uk:'Виміряй відстань між стовпчиками.',note:'tussen — між.'},
  {id:'give-shovel',nl:'Kun je me de schop even aangeven?',uk:'Можеш подати мені лопату?',note:'aangeven — подати в руки.'},
  {id:'dig-hole',nl:'Kun je hier een gat graven?',uk:'Можеш тут викопати яму?',note:'een gat graven — копати яму.'},
  {id:'how-deep',nl:'Hoe diep moet het gat zijn?',uk:'Якої глибини має бути яма?',note:'hoe diep — наскільки глибоко.'},
  {id:'check-depth',nl:'Meet de diepte van het gat.',uk:'Виміряй глибину ями.',note:'de diepte — глибина.'},
  {id:'deep-hole',nl:'Kijk, ik heb het gat heel diep gegraven.',uk:'Дивись, я викопав яму дуже глибоко.',note:'ik heb … gegraven — я викопав.'},
  {id:'help-me',nl:'Kun je me even helpen?',uk:'Можеш мені допомогти?',note:'У Бельгії таке прохання звучить природно й ввічливо.'},
  {id:'hold-here',nl:'Hou dit hier even vast.',uk:'Потримай це тут, будь ласка.',note:'vasthouden — тримати, не відпускати.'},
  {id:'hold-gate',nl:'Hou de tuinpoort even vast.',uk:'Потримай хвіртку, будь ласка.',note:'de tuinpoort — садова хвіртка або ворітця.'},
  {id:'gate-height',nl:'Meet de hoogte van de tuinpoort.',uk:'Виміряй висоту хвіртки.',note:'de hoogte — висота.'},
  {id:'lift-gate',nl:'Til de tuinpoort een beetje op.',uk:'Трохи підніми хвіртку.',note:'een beetje — трішки.'},
  {id:'block-under',nl:'Leg er een houten blokje onder.',uk:'Підклади під неї дерев’яний брусочок.',note:'eronder — під неї / під це.'},
  {id:'put-post',nl:'Zet de paal in het gat.',uk:'Постав стовпчик у яму.',note:'de paal — стовпчик для паркану.'},
  {id:'hold-post',nl:'Hou de paal even recht.',uk:'Потримай стовпчик рівно.',note:'recht — прямо, вертикально.'},
  {id:'check-level',nl:'Controleer met de waterpas of de paal recht staat.',uk:'Перевір рівнем, чи стовпчик стоїть рівно.',note:'de waterpas — будівельний рівень.'},
  {id:'fill-gravel',nl:'Vul het gat met grind en zand.',uk:'Засип яму щебенем і піском.',note:'vullen met — заповнювати чимось.'},
  {id:'break-brick',nl:'Sla de baksteen in stukken.',uk:'Розбий цеглу на шматки.',note:'in stukken — на шматки.'},
  {id:'broken-brick',nl:'Doe er ook gebroken bakstenen bij.',uk:'Додай туди також биту цеглу.',note:'gebroken bakstenen — бита цегла.'},
  {id:'old-concrete',nl:'Doe er ook wat oud beton bij.',uk:'Додай туди також трохи старого бетону.',note:'Тверді старі шматки — beton; cement — порошок-в’яжуче.'},
  {id:'hammer-please',nl:'Geef me de hamer even aan.',uk:'Подай мені молоток, будь ласка.',note:'even пом’якшує коротке прохання.'},
  {id:'show-again',nl:'Kun je het nog eens laten zien?',uk:'Можеш показати ще раз?',note:'Корисна фраза, коли не встиг зрозуміти.'},
  {id:'wait',nl:'Wacht even, ik begrijp het niet.',uk:'Зачекай, я не зрозумів.',note:'Можна сказати в будь-який момент роботи.'},
  {id:'water-break',nl:'Zullen we even wat water drinken?',uk:'Може, поп’ємо трохи води?',note:'Zullen we …? — пропозиція зробити щось разом.'},
  {id:'deep-enough',nl:'Is dit diep genoeg?',uk:'Це достатньо глибоко?',note:'genoeg — достатньо.'},
  {id:'move-left',nl:'Een beetje naar links, alsjeblieft.',uk:'Трохи лівіше, будь ласка.',note:'naar links — ліворуч.'},
  {id:'move-right',nl:'Een beetje naar rechts, alsjeblieft.',uk:'Трохи правіше, будь ласка.',note:'naar rechts — праворуч.'},
  {id:'repeat-please',nl:'Kun je dat herhalen, alsjeblieft?',uk:'Можеш повторити, будь ласка?',note:'herhalen — повторити.'},
  {id:'slower-please',nl:'Kun je wat langzamer spreken?',uk:'Можеш говорити трохи повільніше?',note:'langzamer — повільніше.'}
 ],
 stages: [
  {id:'mark',number:'01',title:'Розмітка',intro:'Спочатку вимірюємо ділянку, ставимо кілочки й натягуємо шнур.',objectIds:['tape','cord','stake'],tasks:[
   {id:'mark-1',context:'Ви тільки вийшли у двір.',goal:'Скажи, що спочатку все треба виміряти.',answer:'measure-all',choices:['stretch-cord','measure-all','dig-hole']},
   {id:'mark-2',context:'Ви позначаєте лінію майбутнього паркану.',goal:'Попроси вбити тут кілочки.',answer:'mark-stakes',choices:['mark-stakes','put-post','hold-here']},
   {id:'mark-2b',context:'Кілочки потрібно забити в землю, а молоток у сусіда.',goal:'Попроси подати тобі молоток.',answer:'hammer-please',choices:['hammer-please','give-shovel','tape-please']},
   {id:'mark-3',context:'Кілочки вже стоять.',goal:'Попроси натягнути шнур між ними.',answer:'stretch-cord',choices:['hold-post','stretch-cord','mark-stakes']},
   {id:'mark-4',context:'Стовпчики треба поставити на правильній відстані.',goal:'Попроси виміряти відстань між ними.',answer:'measure-distance',choices:['measure-distance','gate-height','check-depth']}
  ]},
  {id:'dig',number:'02',title:'Копаємо ями',intro:'Беремо лопату, копаємо й перевіряємо глибину.',objectIds:['shovel','hammer','sledge'],tasks:[
   {id:'dig-1',context:'Лопата лежить біля сусіда.',goal:'Попроси подати тобі лопату.',answer:'give-shovel',choices:['hammer-please','give-shovel','tape-please']},
   {id:'dig-2',context:'Ви вибрали місце для стовпчика.',goal:'Запропонуй викопати тут яму.',answer:'dig-hole',choices:['how-deep','dig-hole','put-post']},
   {id:'dig-3',context:'Яма вже глибока, але ти не знаєш, чи достатньо.',goal:'Запитай, якої глибини вона має бути.',answer:'how-deep',choices:['how-deep','deep-hole','check-level']},
   {id:'dig-4',context:'Копати одному важко.',goal:'Попроси сусіда допомогти.',answer:'help-me',choices:['water-break','help-me','show-again']},
   {id:'dig-5',context:'Ти закінчив копати й хочеш показати результат.',goal:'Скажи: дивись, я викопав яму дуже глибоко.',answer:'deep-hole',choices:['check-depth','deep-hole','dig-hole']}
  ]},
  {id:'gate',number:'03',title:'Ставимо хвіртку',intro:'Тримаємо хвіртку, перевіряємо її висоту й підкладаємо брусочок.',objectIds:['gate','block','tape'],tasks:[
   {id:'gate-1',context:'Хвіртка хитається, поки ви її приміряєте.',goal:'Попроси сусіда потримати хвіртку.',answer:'hold-gate',choices:['hold-gate','hold-post','hold-here']},
   {id:'gate-2',context:'Ви перевіряєте, як високо буде хвіртка.',goal:'Попроси виміряти її висоту.',answer:'gate-height',choices:['gate-height','measure-distance','check-depth']},
   {id:'gate-3',context:'Треба залишити зазор над землею.',goal:'Попроси трохи підняти хвіртку.',answer:'lift-gate',choices:['put-post','lift-gate','gate-height']},
   {id:'gate-4',context:'Хвіртку треба тимчасово підперти.',goal:'Попроси підкласти дерев’яний брусочок.',answer:'block-under',choices:['fill-gravel','block-under','mark-stakes']}
  ]},
  {id:'posts',number:'04',title:'Стовпчики й засипка',intro:'Встановлюємо стовпчики рівно, додаємо щебінь, пісок і старі шматки бетону.',objectIds:['post','level','gravel','sand','brick','concrete'],tasks:[
   {id:'posts-1',context:'Яма готова, стовпчик лежить поруч.',goal:'Попроси поставити стовпчик у яму.',answer:'put-post',choices:['put-post','mark-stakes','lift-gate']},
   {id:'posts-2',context:'Стовпчик уже опустили в яму.',goal:'Попроси потримати його рівно.',answer:'hold-post',choices:['hold-gate','hold-post','check-depth']},
   {id:'posts-3',context:'Перш ніж засипати яму, треба переконатися, що стовпчик стоїть прямо.',goal:'Попроси перевірити його рівнем.',answer:'check-level',choices:['check-level','measure-distance','gate-height']},
   {id:'posts-4',context:'Стовпчик стоїть рівно. Час заповнити яму.',goal:'Скажи засипати яму щебенем і піском.',answer:'fill-gravel',choices:['break-brick','old-concrete','fill-gravel']},
   {id:'posts-5',context:'Є шматки старої цегли й бетону.',goal:'Скажи додати трохи старого бетону.',answer:'old-concrete',choices:['broken-brick','fill-gravel','old-concrete']},
   {id:'posts-6',context:'Робота триває вже давно. Ви обоє хочете перепочити.',goal:'Запропонуй разом попити води.',answer:'water-break',choices:['help-me','water-break','wait']}
  ]}
 ],
 templates: [
  {id:'hand',label:'Подай мені…',nl:'Kun je me {thing} even aangeven?',uk:'Можеш подати мені {thing}?'},
  {id:'bring',label:'Принеси…',nl:'Kun je {thing} even halen?',uk:'Можеш принести {thing}?'},
  {id:'hold',label:'Потримай…',nl:'Kun je {thing} even vasthouden?',uk:'Можеш потримати {thing}?'}
 ]
};

export const phraseById = id => fence.phrases.find(p=>p.id===id);
export const objectById = id => fence.objects.find(o=>o.id===id);
const searchTokens=text=>(text.toLocaleLowerCase().match(/[a-z0-9а-яіїєґ]+/gu)||[]).map(token=>token.length>=3?token.replace(/[аеєиіїоуюя]$/u,''):token);
export function searchPhrases(phrases,query){
 const terms=searchTokens(query);
 if(!terms.length)return phrases;
 return phrases.filter(phrase=>{
  const words=searchTokens(phrase.nl+' '+phrase.uk);
  return terms.every(term=>words.some(word=>word.includes(term)));
 });
}
export function buildQuickPhrase(templateId,objectId){
 const template=fence.templates.find(x=>x.id===templateId),object=objectById(objectId);
 if(!template||!object)return null;
 return {nl:template.nl.replace('{thing}',object.nl),uk:template.uk.replace('{thing}',object.acc)};
}
