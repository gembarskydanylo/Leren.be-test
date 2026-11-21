# TEST-043 · Архітектура LerenBe 3.0 (інвентаризація)

**Дата:** 20.11.2026. **База:** `b94e39b` (TEST-042, PR #25).

**Метод:** читання коду. Розміри, кількості й посилання отримано скриптами з `tools/test-043/` і разовими командами; їхні результати подано нижче.

## 1. Що це за застосунок

| Частина | Де | Факт |
|---|---|---|
| **LerenBe 3.0 (тестовий застосунок)** | `app/` | Статичний PWA без збирання й без npm-залежностей. 47 блокувальних і 8 відкладених `<script>` у `app/index.html`. Знімок production (release 225) з новою головною та Lexi (`app/README.md`) |
| Старий одно-файловий застосунок | `index.html` (684 KB), `course-curriculum.js` (50 KB), `sw.js` у корені | Окремий, старший (`README.md`: «увесь застосунок в `index.html`»). Тести `curriculum.cjs` та інші частково перевіряють саме його |
| AI Worker (Cloudflare) | `tools/ai-worker.js` (54 KB) | Не розгортається з цього репозиторію автоматично. У TEST-043 лише читався |
| Тести | `tests/*.cjs` (57 після TEST-043) | Node + Playwright/Chromium. CI: `.github/workflows/site-preview.yml` запускає кожен `tests/*.cjs` |
| Лабораторія Codex | `design-lab/test-030/` | Перевірки `audit`, `interactions`, `gallery`, `lexi-contract` |

## 2. Карта модулів `app/`

| Область | Файли (розмір) | Глобальний API |
|---|---|---|
| Ядро: стан, уроки, квіз, тести, ігри, налаштування, акаунт, Lexi-хост | `app.js` (683 KB, 6 429 рядків) | `DATA`, `CATEGORIES`, `TOETS`, `UI`, `addXP`, `setView`, `lexiOpen` … |
| Контент nl A1.1 / A1.2 / A2 | `course-curriculum.js` (262 KB) + таблиці в `app.js` | `LerenCurriculum` |
| Курси en / fr | `modules/courses/{en,en12,fr}.js`, іспити `en-exam*.js`, реєстр `registry.js` | `LerenCourseData`, `LerenCourseExams`, `LerenCourses` |
| Learning Path | `modules/learning-path/{core,ui,invitation}.js` | `LerenLearningPath` |
| Course Player | `modules/course-player/{ui,exam}.js` | `LerenCoursePlayer` |
| Повторення (SRS) | `modules/review/srs.js` | `LerenSRS` |
| XP, хвилини, навички, синхронізація | `modules/sync/merge.js` | `LerenMerge` (чисті функції) |
| Аналітика навчання, серії | `modules/insights/core.js` | `LerenInsights` |
| Lexi (AI) | `modules/lexi/engine.js` (рушій, без DOM), `chat.js` (UI у shadow DOM, згенеровано `tools/lexi-ui-port.cjs`), `lesson-help.js` (відкладений), `ai-coach/core.js` (HTTP) | `LerenLexi`, `LerenAICoach`, `LerenLessonHelp` |
| Іспити nl | `modules/exam/*` (відкладені, 220 KB) | `LerenExam` |
| Ігри | `kamer`, `word-builder`, `dialogues`, `lesson-conversation`, `scenes`, `diphthongs` | — |
| Графіка | `card-art/*`, `emoji/*`, `word-builder/art.js` | `LerenEmoji`, `LerenWordArt` |
| Service Worker | `sw.js` (32 KB) | `CACHE_NAME leren-be-v261`, `APP_FILES` |
| Аудіо | `audio/{nl,nl-f,en,fr}` (11 MB), `manifest.json` + хеш FNV (`app.js` `audioHash`) | — |

**Сховище.** Лише `localStorage`: 81 ключ `leren_*` / `poly_*` у `app.js` і 82 звернення в модулях; IndexedDB немає.
- Курсові ключі мають суфікс `@en` / `@fr` (`registry.js` `PER_COURSE`).
- XP — журнал v2 `{base, g: записи за ключем, d: пристрій → день}` (`merge.js` `cleanXp`, `xpAdd`, `xpMerge`). `poly_score` — копія для старих версій.

**Мережа:**
- CSP `app/` — `connect-src 'self'`: Firebase, AI і аналітика в тестовому застосунку вимкнені за задумом.
- AI йде через `LerenAICoach.request` (тайм-аут, `X-Leren-Device`), Worker — через `fetch` (Anthropic / Gemini / Workers AI).

**Автентифікація.** Firebase Auth (e-mail-посилання, Google) і Firestore для синхронізації — лише на `lerenbe.com` (`prodServices()`). Правил Firestore у репозиторії немає (SECURITY S-2).

## 3. Знахідки

| # | Знахідка | Доказ | Ризик |
|---|---|---|---|
| A-1 | **Величезне ядро.** Уроки, квіз, тести, ігри, акаунт, синхронізація, налаштування й хост Lexi зібрано в одному файлі | `app/app.js` 683 KB / 6 429 рядків; 273 KB gzip | HIGH для супроводу: будь-яка правка конфліктує (8 конфліктів у TEST-042), складно тестувати поза браузером |
| A-2 | **Бюджет першого екрана вичерпано.** Будь-який новий байт у блокувальних файлах вимагає рішення | `tests/perf-budget.cjs`: 759,981 / 760 KB gzip (запас ≈ 19 байтів) | HIGH: блокує виправлення (наприклад, M-2 у FINAL_REPORT) |
| A-3 | **Два застосунки в одному репозиторії.** Корінь (старий) і `app/` (3.0) мають окремі `index.html`, `course-curriculum.js`, `sw.js`; частина тестів перевіряє корінь | `index.html` 684 KB, `course-curriculum.js` 50 KB проти `app/course-curriculum.js` 262 KB; `tests/curriculum.cjs` читає кореневий `index.html` | MEDIUM: тести можуть бути зеленими для не того застосунку |
| A-4 | **Залежність від DOM-селекторів.** Lesson Help читає вправу зі сторінки, а не з даних | `app/modules/lexi/lesson-help.js` `SCREENS` (`#card .q h2`, `.lp-word`, `.cp-q`, `#feedback strong + p`) | MEDIUM: зміна розмітки тихо ламає контекст. Пом'якшено тестами `lesson-help-042`, `lexi-reliability-043`. Ліпше рішення — подія з даними від екрана, коли з'явиться місце в бюджеті |
| A-5 | **Глобальний стан** у змінних верхнього рівня (`mode`, `tab`, `currentCat`, `view`, `score`, `locked`, `gState`), який змінюють десятки функцій | `app.js` (тести керують ним напряму: `lessonMode='quiz';mode='quiz';newRound()`) | MEDIUM |
| A-6 | **Мертві або невикористані ресурси.** 231 зображення (4,7 MB), чиї імена ніде не згадуються в коді чи JSON, переважно `img/emoji/*` (219) | разовий скрипт перевірки посилань (див. PROGRESS) | LOW: SW їх не кешує, учень їх не завантажує. Видалення — рішення власника / Codex (можливо, бібліотека для майбутнього) |
| A-7 | **Невикористаного JS-коду не знайдено.** Усі 100 файлів `.js` / `.css` згадуються за назвою | той самий скрипт | — |
| A-8 | **Непослідовні мови.** 14 гілок `uiLang==="uk" ? a : b`: інтерфейси fr і ar отримують англійський текст | `app.js`, наприклад розмовні питання `{q, uk, en}` (`course-curriculum.js` `speech.push({q,uk,en,m})`), підказки історії `t[1] / t[2]` | MEDIUM (контент): потрібні переклади fr/ar від людини |
| A-9 | **Дублювання логіки.** Два шляхи аудіо: `app.js` `recordedAudioUrl` / `audioSets` і `course-player/ui.js` `REC` / `recLoad`; два шляхи до мовних підписів (`UI[l]` в `app.js` і словники в модулях) | `app.js:1916–1930`, `course-player/ui.js:29–37` | LOW |
| A-10 | **Слухачі та спостерігачі.** 116 `addEventListener` проти 18 `removeEventListener`; 4 `MutationObserver` (Lesson Help стежить за всім документом) | інвентаризація (`tools/test-043/` інвентар у PROGRESS); заміри — FINAL_REPORT, «Продуктивність» | Перевірено замірами: без росту на повторних діях (див. FINAL_REPORT) |
| A-11 | **Обробка помилок сховища надійна.** `lsGet`, `loadNumber`, `loadStore`, `validStored` у try/catch; `LerenMerge.cleanXp` відкидає сміття | `app.js:1213–1215, 1396–1397`, `merge.js:16–29` | Підтверджено тестом на 81 ключі × 10 значень; знайдено й виправлено один збій (`saved.split`) |
| A-12 | **Тести.** 53 тести до TEST-043, усі зелені; CI запускає кожен. Прогалин було три: валідація всього контенту en/fr, пошкоджене сховище в усіх ключах, HTTP-коди без тіла Worker | `tests/`, `.github/workflows/site-preview.yml` | Закрито тестами `*-043` |
| A-13 | **Lexi UI згенеровано з лабораторії Codex** (`tools/lexi-ui-port.cjs --check`): ручні правки `chat.js` заборонені | `app/modules/lexi/chat.js` | Інформаційно: виправлення UI Lexi робить Codex |

## 4. Межі безпеки (коротко; детально — SECURITY.md)
- Дані курсу — довірені (з репозиторію).
- Ввід учня й відповіді AI — недовірені; їх екранує `chat.js` `escape()`, а в `app.js` вони йдуть через `el(…, text)` / `textContent`.
- AI-запит містить лише поля контракту (`engine.js` `context()` / `profile()`).
- Worker — Origin + ліміти, без автентифікації (App Check — план).
