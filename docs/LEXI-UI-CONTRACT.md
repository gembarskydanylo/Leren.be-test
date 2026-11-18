# Lexi — контракт між інтерфейсом і AI-рушієм

TEST-031 · 2026-11-17 · гілка `claude/test-031-lexi-engine` від `claude/test-028-integration` (реліз 254).

Рушій — `app/modules/lexi/engine.js` (`globalThis.LerenLexi`). Документ описує **лише реалізоване**. Дизайн чату, аватари й анімації — робота Codex (TEST-030), він може їх вільно змінювати, якщо дотримується цього контракту. Тести: `tests/lexi-engine.cjs`, `tests/lexi-app.cjs`, `tests/lexi-worker.cjs`.

---

## 1. Як відкрити Lexi

```js
lexiOpen(scenario, ctx)            // глобальна функція в app.js
bridge.lexi(scenario, ctx)         // те саме для модулів, змонтованих через LerenLearningPath.mount
bridge.chat()                      // «Поговорити з AI» (старий маршрут; аргумент з ім’ям ігнорується)
```

| `scenario` | Що відкривається | Запит до Worker |
|---|---|---|
| `free` | Вільна розмова | `mode: chat`, `style: talk` |
| `speaking` | Повільна розмовна практика (голос) | `mode: chat`, `style: slow` |
| `roleplay` | Ситуація з життя, `ctx.scene` — див. §5 | `mode: chat`, `style: teacher`, `scene` |
| `grammar` | Питання про мову (граматика, слова, переклад, вимова) | `mode: ask` |
| `lesson` | Помічник у поточному уроці | `mode: ask`, `focus: lesson` + контекст уроку |

`ctx` (усе необов’язкове): `{topic, lesson, question, answer, scene, send}`. Поле `send` — текст першого питання. З TEST-032 він потрапляє в поле введення, і учень сам натискає «Надіслати», щоб перевірити текст; винятком є перевірка листа на іспиті, яка надсилає його одразу.

Невідомий сценарій означає `free`, а невідома сцена — `super` (магазин).

---

## 2. Запит (`LerenLexi.body` → Worker)

```json
{
  "mode": "chat" | "ask",
  "scenario": "free" | "grammar" | "roleplay" | "lesson" | "speaking",
  "char": "lexi",
  "target": "nl" | "fr" | "en",
  "lang": "uk" | "en" | "fr" | "ar",
  "level": "a11" | "a12" | "a21",
  "style": "talk" | "teacher" | "slow" | "exam",
  "scene": "super" | "school" | "werk" | "huisarts" | "station" | "gemeente" | "cafe" | "apotheek" | "buren" | "exam11",
  "focus": "lesson" | "exam11" | "exam12",
  "profile": {
    "level": "...", "topic": "...", "lesson": "...", "question": "...", "answer": "...",
    "learned": 0, "weak": [], "mistakes": [], "review": [], "mastered": []
  },
  "memory": "нотатки, що зберігаються лише на пристрої",
  "messages": [{"role": "user" | "assistant", "content": "..."}]
}
```

- **Навчальний контекст.** Передаються лише мова інтерфейсу, мова навчання, рівень, тема, урок, вправа й відповідь учня. До них додаються навчальні дані, які застосунок надсилав і раніше: слабкі слова, недавні виправлення, слова на повторення.
  - Ім’я, e-mail, акаунт, `uid` і числа прогресу (XP, серії) **не передаються**: `context()` їх відкидає, а тест це перевіряє.
- **Значення за замовчуванням:** `uk` / `nl` / `a11`, порожні тема й урок.
  - Якщо мова інтерфейсу збігається з мовою навчання, пояснення йдуть українською.
- **Довжина:**
  - повідомлення чату — 300 символів;
  - питання — 600;
  - лист для іспиту — 1600;
  - тема — 60, урок — 80, вправа й відповідь — по 200;
  - в історії — останні 12 повідомлень.
- **Голос:** якщо повідомлення сказане вголос, до тексту додаються інші варіанти розпізнавання (`[spoken; other possible transcriptions: …]`).

---

## 3. Відповідь (`LerenLexi.send` → Promise)

```js
// chat
{kind: 'chat', reply, translation, verdict: 'correct' | 'incorrect' | null,
 correction: null | {original, corrected, explanation, severity: 'minor' | 'major'}}
// ask
{kind: 'ask', answer, examples: [{lang: 'nl' | 'fr' | 'en', text, translation}]}   // до 3 прикладів
```

- `verdict` дорівнює `null` на першому привітанні, коли учень ще нічого не написав.
- Якщо «виправлення» збігається з текстом учня, це не помилка: `correction` дорівнює `null`, а `verdict` — `correct`.
- **Коли інтерфейс показує виправлення** (правило з часів до Lexi): у стилі `talk` (вільна розмова) — ніколи; у стилях `teacher`, `slow` і `exam` — завжди.

---

## 4. Стани й помилки

**Стани** (`LerenLexi.STATES`) — для анімацій Lexi:

| Стан | Хто надсилає | Коли |
|---|---|---|
| `welcome` | інтерфейс | Чат відкрито, відповіді ще немає |
| `listening` | інтерфейс | Мікрофон слухає |
| `thinking` | рушій | Запит у дорозі |
| `speaking` | інтерфейс | Відповідь озвучується |
| `correct` / `incorrect` | рушій | Відповідь чату без помилки / з виправленням |
| `idle` | рушій | Відповідь без оцінки: перше привітання чату або відповідь на питання (`ask`) |
| `offline` | рушій | Немає мережі |
| `error` | рушій | Будь-яка інша помилка (поле `code`) |

Рушій надсилає лише `thinking`, `correct`, `incorrect`, `idle`, `offline` і `error`. Стани `welcome`, `listening` і `speaking` інтерфейс вмикає сам: рушій про мікрофон і озвучення не знає.

**Події:** `LerenLexi.on(fn)` повертає функцію відписки. `fn` отримує `{type: 'state', state, code?, scenario}`.

**Коди помилок** (`e.code`). Тексти чотирма мовами повертає `LerenLexi.message(code, ui)`:

| Код | Що сталося | Повторити? |
|---|---|---|
| `offline` | Немає мережі; нічого не надіслано | так |
| `beta` | Тестова версія: AI вимкнений; нічого не надіслано | ні |
| `unavailable` | Немає адреси AI | ні |
| `timeout` | Немає відповіді за 30 с (чат) / 45 с (питання) | так |
| `network` | Збій мережі або AI (5xx) | так |
| `slow` | Ліміт за хвилину (`e.wait.seconds`) | так, пізніше |
| `limit` | Денний ліміт (`e.wait.at` — коли можна знову) | ні |
| `refusal` | Модель відмовилась відповідати | ні |
| `off` | Аварійний вимикач на Worker | ні |
| `format` | Незрозуміла відповідь | так |
| `tooLong` | Повідомлення задовге; нічого не надіслано | ні |
| `empty` | Немає питання | ні |

**Чат на помилку реагує так:**
- повідомлення учня лишається в історії;
- з'являються кнопки «Повторити» (повтор надсилає його один раз, без дубля) і «Редагувати»;
- для `limit` / `slow` інтерфейс показує, коли можна писати знову.

---

## 5. Мови, рівні, ситуації

| | Значення |
|---|---|
| Мова навчання | `nl` (nl-BE), `fr` (fr-BE), `en` (en-GB). **Німецької в застосунку немає**: її не показувати. |
| Мова пояснень | `uk`, `en`, `fr`, `ar` (RTL) |
| Рівні | `a11`, `a12`, `a21` |
| Ситуації (`ROLEPLAYS`) | `shop → super`, `school`, `work → werk`, `doctor → huisarts`, `transport → station`, `municipality → gemeente` |

Старі сцени (`cafe`, `apotheek`, `buren`, `exam11`) теж приймаються. Пробний іспит A1.1 (`exam11`) працює лише нідерландською.

⚠️ **Що потрібно від Worker.** Рольові ігри французькою та англійською, сцени `school` і `werk`, рівень A2.1, контекст уроку, особа Lexi й захист від prompt injection працюють лише з Worker `2026-11-18-lexi-v1` із цієї гілки.

Поточний production-Worker (`2026-11-03-security-v1`) поводиться інакше:
- рольові ігри для fr/en і нових сцен перетворює на вільну розмову;
- A2 вважає A1.1;
- на `char: lexi` відповідає як Пітер.

Тому **спершу розгортається Worker, а вже потім клієнт** (див. інструкцію в PR).

---

## 6. Голос

| Можливість | Як |
|---|---|
| Перевірка підтримки | `LerenLexi.voice()` → `{listen, speak}` |
| Мова розпізнавання | `LerenLexi.speechTag(lang)`: `nl-BE`, `fr-BE`, `en-GB`, `uk-UA`, `ar-SA` |
| Голосовий ввід у чаті | `micBox(…, {edit: true})`: текст з'являється в полі наживо, учень виправляє й натискає ➤ |
| Голосове питання | Розпізнаний текст потрапляє в поле з підказкою «Перевір текст…» і **не надсилається сам** |
| Відмова в мікрофоні | Повідомлення `micDenied`, лишається введення текстом |
| Озвучення відповіді | `say(reply)` (записи або TTS браузера); приклади — `sayIn(text, lang)` |
| Збереження голосу | **Немає.** Розпізнавання робить браузер, надсилається лише текст. Рушій не використовує `MediaRecorder` чи `getUserMedia` (перевіряє тест). |

---

## 7. Події та DOM, на які спираються тести

Якщо їх змінювати, треба оновити тести в тому самому коміті.

З TEST-032 чат (усі сценарії, крім іспиту) працює в `.lexi-host` — повноекранному `role=dialog` з відкритим shadow root. Селектори нижче діють усередині нього (`.lexi-host >> .ai-chat-card` у Playwright). Пробний іспит A1.1 і перевірка листа на іспиті лишаються на старому екрані в документі.

| Що | Селектор / API |
|---|---|
| Заголовок гри | `#prog` містить «Lexi» |
| Аватар Lexi | `img.lexi-av`, затверджений образ `img/lexi/lexi.webp` (TEST-030, побайтово як у design-lab) |
| Картка чату | `.ai-chat-card`, повідомлення `.g-bub.me` / `.g-bub.them`, виправлення `.ai-fix` |
| «Lexi думає» | `.lexi-thinking` з `role=status` |
| Поле чату | `.ai-type input` + `button[type=submit]` |
| Помилка й повтор | `.ac-tools .st-fb.bad` + перша `.ac-tools .btn` |
| Lexi недоступний | `.lexi-off` з `role=status` (beta, офлайн під час старту, немає адреси) |
| Поле питання | `form.g-type input`, мікрофон `.g-mic-btn`, підказка `.g-heard` |
| AI-тренер в іспиті | `.ex-aih`, картки `.ex-ai` з `img.lexi-av` |

---

## 8. Що лишається незмінним

- XP нараховується як і раніше: за 5 реплік у чаті (`gameDone("ai", 30)`) і 3 питання (`gameDone("ask", 15)`). Невдалі запити XP не дають.
- Ключі прогресу й налаштувань не змінено.
- `leren_char` тепер обирає лише вчителя-провідника історій і голос, а не AI.
- Ключі AI на пристрої — `leren_ai_consent18`, `leren_ai_memory`, `leren_ai_memrev`, `leren_ai_style`, `leren_ai_device`. Нових ключів немає.
- Peter, Dafna, Sam, персонажі LIFE та історій лишаються як сюжетні персонажі, а не AI.

---

## 9. Конфлікти з Codex і як їх інтегрувати

TEST-031 змінив спільні з дизайном файли:

| Файл | Що змінено | Як інтегрувати з TEST-030 |
|---|---|---|
| `app/app.js` | AI-розділ (`lexiOpen`, `lexiBlocked`, `lexiAv`, запити через `lexi()`), назви в `G_UI` | Codex не змінює логіку `app.js`; конфлікти можливі лише в текстах. Брати версію TEST-031 |
| `app/modules/home-showcase/ui.js` | Картка «Знайомся: Lexi» замість вибору Пітер/Дафна | Якщо Codex переробляє головну — замінити картку новою, викликати `onChat()` / `bridge.lexi()` |
| `app/modules/learning-path/ui.js` | Лише `chatHint` (Пітер → Lexi) | Тексти брати з TEST-031 |
| `app/modules/exam/exam-core.js` | AI-тренер іспиту — Lexi (назва й аватар `lexiAv()`) | — |
| `app/index.html` | `<script defer>` рушія + preload; опис сторінки | Зберегти обидва рядки рушія; `defer` залишити |
| `app/sw.js` | Реліз 254, рушій у `APP_FILES` і `critical` | Номер релізу визначається під час злиття: `max + 1` |

`design-lab/` не змінювався.

Тимчасовий аватар — котик LerenBe. Його треба замінити на затверджений образ Lexi з TEST-030, коли той буде готовий: це один рядок `lexiAv()` в `app.js` і одна картинка в `home-showcase`.

---

## 10. Точні назви для Codex (перевірено за кодом рушія)

Цей список узято з `Object.keys(LerenLexi)` і констант рушія. Якщо назва змінюється, міняти треба і рушій, і тести.

**Глобальні функції в `app.js`:**
- `lexiOpen(scenario, ctx)` — відкриває Lexi в потрібному сценарії;
- `lexiAv()` — HTML аватара (`img.lexi-av`);
- `lexiBlocked(title)` — повертає `true` і показує `.lexi-off`, якщо Lexi недоступний;
- `aiStart(scene?, scenario?)` — розмова;
- `askStart(opts?)` — питання.

**Міст для модулів:** `bridge.lexi(scenario, ctx)`, `bridge.chat()`, `bridge.ai(chapter)`.

**`LerenLexi`, константи:**
- `NAME` = `"Lexi"`, `CHAR` = `"lexi"`;
- `TARGETS`: `nl`, `fr`, `en`;
- `UI`: `uk`, `en`, `fr`, `ar`;
- `LEVELS`: `a11`, `a12`, `a21`;
- `SCENARIOS`: `free`, `grammar`, `roleplay`, `lesson`, `speaking`;
- `ROLEPLAYS`: `shop`, `school`, `work`, `doctor`, `transport`, `municipality`;
- `STATES`: `welcome`, `listening`, `thinking`, `speaking`, `correct`, `incorrect`, `offline`, `error`, `idle`;
- `ERRORS`: `offline`, `beta`, `unavailable`, `timeout`, `network`, `limit`, `slow`, `format`, `refusal`, `off`, `tooLong`, `empty` — у кожного є поле `retry`;
- `LIMITS`: `chat` 300, `ask` 600, `exam` 1600, `history` 12, `topic` 60, `lesson` 80, `question` 200, `answer` 200.

**`LerenLexi`, функції:**
- `configure({endpoint, production, local, online, fetch})`
- `availability()` → `{ok: false, code}` або `{ok: true, endpoint, local?}`
- `context(raw)`
- `profile(ctx, learning)`
- `body(scenario, ctx, messages, extra)`
- `normalize(mode, data, lastUser)`
- `send(scenario, ctx, messages, extra)` → Promise
- `memo(ctx, messages, memory)` → нотатки або `null`
- `report(ctx, kind, text)` → `true`/`false`
- `message(code, ui)`
- `voice()` → `{listen, speak}`
- `speechTag(lang)`
- `scenario(id)`
- `on(fn)` → функція відписки
- `emit` — внутрішня; інтерфейс її не викликає.

**Подія:** одна — `{type: 'state', state, code?, scenario}`.

**Відповідність прототипу Codex** (`design-lab/test-030/prototype.js`, `chatStates`):

| Codex | Рушій |
|---|---|
| `welcome`, `listening`, `speaking` | Стани інтерфейсу, рушій їх не надсилає |
| `thinking`, `correct`, `incorrect`, `offline` | Ті самі назви |
| `api-error` | `state: 'error'` + `code` (текст — `LerenLexi.message(code, ui)`, кнопку повтору показувати за `ERRORS[code].retry`) |
| немає | `idle`: відповідь без оцінки (привітання чату або відповідь на питання). Lexi можна показувати спокійним, як у `welcome` |

Мови в прототипі (`nl`, `en`, `fr`) збігаються з `TARGETS`. Рівнів і сценаріїв прототип не задає, тому вони беруться з рушія.

---

## 11. Інтеграція в застосунок (TEST-032)

**Звідки інтерфейс.** Чат — це `design-lab/test-030/lexi/chat.js` (Codex). `node tools/lexi-ui-port.cjs` копіює його в `app/modules/lexi/` (`chat.js`, `copy.js`, `mock.js`, `chat.css`) з іменованими латками, а образ Lexi — в `img/lexi/` побайтово. Файли в `app/modules/lexi/` не редагують вручну: Codex змінює лабораторію, потім запускається скрипт. Тест `lexi-integration.cjs` падає, якщо копія розійшлася з лабораторією (`--check`).

**API рушія не змінювалось.** Латки лише додають необов’язкові опції до `mountLexiChat`. Без них компонент поводиться так само, як у лабораторії:

| Опція | Навіщо |
|---|---|
| `scope` | `lang`, `dir` і `data-theme` ставляться на shadow host, а не на `<html>` застосунку |
| `assets: {avatar, review}` | Шлях до образу в app; посилання демо-смуги |
| `extra(scenario)` | Навчальні дані в `engine.send(…, extra)` (`learning`, `memory`, контракт §2) |
| `onReply(out, info)` | Правила старого чату після відповіді: XP, список помилок, нотатки |
| `report: {label, send}` | Кнопка «Поскаржитися» на кожній відповіді Lexi (політика Google Play для AI-контенту) |
| `memory: {get, forget, title, note, forgetLabel}` | «Що Lexi пам’ятає» з кнопкою «Забути» (обіцяно в згоді) |
| `privacy` | Правдивий текст про приватність (текст лабораторії правдивий лише для демо) |
| `sceneLabels` | Назви старих сцен `cafe`, `apotheek`, `buren`, які ще відкривають застосунок |

Ще дві латки виправляють поведінку, а не додають опції:
- кнопка «Озвучити» читає саме ту відповідь, біля якої стоїть (у лабораторії — завжди останню);
- фокус відновлюється всередині shadow root.

`voice.listen` отримує ще й `ui` та `scenario`: питання в «Граматиці» й «Допомозі в уроці» розпізнаються мовою пояснень, як було раніше.

**Хост** (`app.js`):
- `lexiOpen` перевіряє доступність і згоду 18+, а потім `lexiMount` створює `.lexi-host` (`role=dialog`, `aria-modal`, решта застосунку `inert`).
- Кнопка «Назад» Android, браузерна «Назад» і Escape закривають Lexi; фокус повертається туди, звідки його відкрили.
- `aiStart()` і `askStart()` без фокуса іспиту відкривають Lexi; `aiStartExam` і `askStartExam` — екрани іспиту.

**Стани.** UI показує `state: "error"` + `code`; `api-error` з прототипу більше ніде не вживається (перевіряє тест). `idle` — відповідь на питання або без оцінки. `offline` — окремий стан.

**Демо на телефоні.** `?lexi=demo` на будь-якому хості, крім production (`prodServices()`), вмикає відповіді-заглушки TEST-030 з позначкою «Демонстрація». Нічого не надсилається. На lerenbe.com цей режим вимкнений у коді.
