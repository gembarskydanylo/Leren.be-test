# TEST-030 → TEST-031: готовий інтерфейс Lexi

2026-11-18, Europe/Brussels. Власна гілка `codex/test-030-lexi-design`, продовження Draft PR #15. База дизайну `0187225779c0d8e8bd4191ad23999d4c8e469a12`: чисте дерево, зелений CI #58 перед початком.

Прочитано [оригінальний контракт Claude](https://github.com/gembarskydanylo/Leren.be-test/blob/dfae2cfe7ae3f0b66946829285f1a907481f1268/docs/LEXI-UI-CONTRACT.md) у гілці `claude/test-031-lexi-engine`, SHA `dfae2cfe7ae3f0b66946829285f1a907481f1268` (release 254). Гілку не зливали; рушій не копіювався в runtime прототипу й не змінювався.

## Відкрити

`python3 -m http.server 8280 --bind 127.0.0.1`, потім `/design-lab/test-030/lexi/`.

Галерея TEST-030 і нові AI-входи на головній ведуть до контрактного чату. Попередній mock-чат лишається за старим прямим URL для історії та попередніх перевірок; це не другий AI-сервіс. Новий чат не виконує мережевих запитів, запису голосу, XP або збереження розмов.

Поточний образ Lexi з TEST-030 збережено за інструкцією власника використовувати затверджений образ. Нового персонажа/графіки не створювали, пікселі ресурсів незмінні. Історичні назви `*-proposal.webp` збережено, щоб не ламати попередні посилання. Старий тимчасовий кіт із TEST-031 не використовується.

## Готові компоненти

| Компонент | Поведінка |
|---|---|
| Chat shell | Повноекранна композиція, світла B/темна C, адаптивна бічна панель/мобільні налаштування, видимий вихід |
| Lexi identity | Один аватар і шість наявних емоцій; контекстний status |
| Context controls | target `nl/fr/en`, explanation `uk/en/fr/ar`, level `a11/a12/a21`; RTL для арабської, LTR у мовних прикладах |
| Scenario navigation | `free`, `speaking`, `roleplay`, `grammar`, `lesson` |
| Roleplay picker | `shop/school/work/doctor/transport/municipality` передаються як `extra.scene`; мапінг до worker IDs виконує рушій |
| Transcript | User/assistant bubbles, безпечний plain text, озвучення через voice port, переклад у details |
| Correction | `talk`: не показує; `teacher/slow/exam`: показує original/corrected/explanation, без самостійного переоцінювання verdict |
| Ask result | answer + до трьох examples з lang і translation |
| Composer | 300 символів для chat, 600 для ask; Enter submit; лічильник; чернетка переживає зміну теми й помилки |
| Error recovery | Усі 12 кодів; повідомлення учня залишається; retry без дубля; edit/cancel; cooldown `slow`, deadline `limit`; неретрайні коди без Retry |
| Voice states | listening/speaking; unavailable fallback; розпізнаний текст лише в полі, без автонадсилання |
| Design controls | welcome/listening/thinking/speaking/correct/incorrect/offline/error/idle. Видимий success — це `correct` із контракту, без перейменування engine state |
| Lifecycle | Відписка on(), destroy(), ігнорування застарілих відповідей при зміні контексту або виході |

## Підключення без зміни контракту

`chat.js` експортує `mountLexiChat(root, {engine, voice, demo, initial, context, onLeave})`.

```js
// Лише майбутній app-host після окремого погодження інтеграції.
// Engine уже налаштований TEST-031; UI не викликає configure(), fetch() чи Worker.
const view = mountLexiChat(root, {
  engine: globalThis.LerenLexi,
  initial: {ui: 'uk', target: 'nl', level: 'a11'},
  context: {topic: currentTopic, lesson: currentLesson, question, answer},
  voice: hostVoiceAdapter,
  onLeave: returnToExistingApp
});
// При виході / розмонтуванні:
view.destroy();
```

- `engine.send(scenario, {ui,target,level,topic,lesson}, messages, extra)`. Передаються останні 12 `{role,content}`; формування request/body, обмеження й нормалізація залишаються в TEST-031.
- Для `lesson` зараз заготовлений демонстраційний контекст; майбутній host має передати реальні topic/lesson/question/answer у параметрі context. Ім’я, uid, e-mail, XP і серії UI не додає.
- `engine.on(fn)` → unsubscribe; thinking-подія використовується тільки для активного запиту цього view; термінальні стани беруться з його Promise, бо глобальні engine-події не мають request ID; закінчення старого запиту не змінює новий контекст.
- `engine.message(code, ui)` формує справжні повідомлення про помилки; fixture має окремі демонстраційні тексти.
- `voice.listen({lang,onText,onEnd,onError})` повертає stop; `voice.speak(text, target, onEnd)` повертає stop. Host адаптує існуючі micBox/say/sayIn і `speechTag()`. UI звіряє підтримку з `engine.voice()`; відсутній port дає текстовий fallback. Нового voice engine немає.
- Селектори §7 збережено: `#prog`, `img.lexi-av`, `.ai-chat-card`, `.g-bub.me/.them`, `.ai-fix`, `.lexi-thinking[role=status]`, `.ai-type input`, `.ac-tools .st-fb.bad`, `.ac-tools .btn`, `.lexi-off`, `form.g-type input`, `.g-mic-btn`, `.g-heard`.

Реальне підключення **не ввімкнене**: `demo.js` завжди монтує `createDemoEngine()`, а CSP містить `connect-src 'none'; media-src 'none'`. Не знімати це обмеження для демонстрації live AI. Деплой Worker `2026-11-18-lexi-v1` і перенесення UI в app/ — окремі наступні роботи за контрактом Claude, не частина цього PR.

## Перевірки

`NODE_PATH=<Playwright node_modules> node design-lab/test-030/checks/lexi-contract.cjs`.

- 144 комбінації: 8 ширин × 2 теми × 9 контрактних станів.
- 24 перевірки тексту 200%: 4 мови пояснення × 2 теми × welcome/incorrect/error на 320px.
- Touch 44×44, assets, horizontal overflow, JavaScript errors, external requests.
- 14 interaction-груп, включно з незміненим реальним TEST-031 engine у тестовому контексті та підставним `LerenAICoach.request`: signature/char/level, `work→werk`, приховане talk-виправлення й видиме teacher-виправлення.
- Engine source читається через `git show` за точним SHA тільки для тесту. Ізоляція fixture не є перевіркою live Worker/API.
- Скриншоти: `screenshots/test-030/contract-ready` — усі стани на 390/1440, welcome також 320/768, AR RTL із текстом 200%.

Машинні результати: `checks.json`. Емуляція Chromium, не фізичний Samsung; live AI/мікрофон/TTS та screen reader не перевірялися. Перевірка кольорів успадковує палітру TEST-030; це не сертифікація WCAG.
