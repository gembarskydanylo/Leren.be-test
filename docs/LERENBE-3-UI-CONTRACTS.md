# LerenBe 3.0 — контракти між інтерфейсом і навчальним рушієм

TEST-026 · 2026-11-13 · основа: `main` 8607321 (тестовий знімок `app/`).

Документ описує **лише те, що вже реалізовано** в `app/`. Посилання на рядки вказують на `main` 8607321. Пропозиції нових інтерфейсів зібрано окремо в розділі «Запропоновано (ще не реалізовано)».

Ці правила перевіряють тести `tests/ui-contracts.cjs`, `tests/app-engine.cjs`, `tests/sync-merge-app.cjs` і `tests/perf-budget.cjs`. Вони запускаються на справжньому `app/`, а не на старих кореневих копіях. Якщо редизайн зберігає контракти, ці тести проходять.

---

## 0. Шари: що можна переробляти, а що ні

| Шар | Файли | Для редизайну |
|---|---|---|
| **Рушій маршруту** | `app/modules/learning-path/core.js` (`LerenLearningPath.catalog/create`) | Не змінювати. Він не залежить від DOM і мережі. |
| **Дані курсу** | `app/course-curriculum.js` (`LerenCurriculum`), `DATA` в `app/app.js` | Не змінювати ID карток, уроків і розділів. |
| **Хост (стан застосунку, XP, синхронізація)** | `app/app.js`: `curLevel`, `score`, `store`, `switchCourse`, `recordPathResult`, `addXP`, `saveStore`, `setView`, Firebase | Залишити функції й ключі. Змінювати можна лише виклики з UI. |
| **Злиття і SRS** | `app/modules/sync/merge.js` (`LerenMerge`), `app/modules/review/srs.js` (`LerenSRS`) | Не змінювати (це формат синхронізації). |
| **Екрани маршруту** | `app/modules/learning-path/ui.js` (`LerenLearningPath.mount`) | Можна переписати, якщо новий код дотримується розділів 1–9. |
| **Головна (лише DOM)** | `app/modules/focused-home/ui.js` (`LerenFocus`), `app/modules/home-v2/ui.js` (`LerenHomeV2`), `home-showcase`, CSS | Можна вільно замінювати. Самі вони не звертаються до `learningPath`: їх викликає `learning-path/ui.js`. |
| **LIFE** | `app/learn-life.html`, `app/learn-life-story.html` (`<base href="../life/">` → `life/modules/learn-life/*`) | Окремі сторінки. Контракт описано в розділі 8. |

Основний шов для заміни інтерфейсу — `LerenLearningPath.mount(root, bridge)`, який викликається в `initLearningPath()` (`app/app.js`).

---

## 1. Як UI отримує поточний курс

Є **два стани курсу**, і їх треба тримати синхронними:

| Де | Значення | Ключ сховища |
|---|---|---|
| Хост: `curLevel` | `"a11"`, `"a12"`, `"a21"` (`LEVELS`, `app.js:42`) | `poly_level`, а також `poly_cat` і `poly_tab` |
| Рушій: `model.course` | `"A1.1"`, `"A1.2"`, `"A2"` | `leren_path_v1` → `course` |

- **Джерело правди — хост.** Під час кожного `render()` UI маршруту викликає `syncCourse()`: `bridge.level()` повертає `levelById(curLevel).name`, і рушій виконує `setCourse(...)` (`ui.js:36`).
- Під час старту `curLevel` визначає **`poly_tab`**, а не `poly_level`: якщо збережений урок належить іншому рівню, береться рівень уроку (`app.js:1236`). Це перевіряє тест `ui-contracts` 8b.
- Що показувати: `model.course` (рядок рівня), `model.levels` (`["A1.1","A1.2","A2"]`). На карті A2 підписано «A2.1». Внутрішній ID залишається `A2`, на хості — `a21`.
- ⚠️ Об’єкт з `create()` має дві властивості `course`. Діє пізніший getter, тому `model.course` — це **рядок рівня**, а не каталог. Каталог доступний через `LerenLearningPath.catalog(DATA, LerenCurriculum)` або `model.lesson(id)`.

## 2. Як UI отримує прогрес

| Що | API | Звідки дані |
|---|---|---|
| Уроки рівня | `model.courseStats(level)` → `{done,total}` | `state.completed` |
| Уроки теми | `model.stats(chapterId)` → `{done,total}` | те саме |
| Наступний урок | `model.recommended(level?)` → урок або `null` (курс завершено) | незавершена сесія, інакше перший непройдений урок від точки входу |
| Урок «засвоєно» | `model.mastered(lessonId)` (≥ 80 %) | `state.completed[id] / ids.length` |
| Слова для повторення | `model.mistakes()` (лише поточний курс) | `state.mistakes` |
| XP | глобальний `score` | `leren_xp_v2` (журнал), копія в `poly_score` |
| Серія, хвилини, ціль | `bridge.stats()` → `{streak,min,goal,points}` | `LerenInsights`, `leren_minutes_v2`, `leren_goal_min` |

Інваріант, який перевіряють тести: `score === Number(poly_score) === LerenMerge.xpTotal(leren_xp_v2)`.

## 3. Як запускається урок

- Перший урок новачка: `learningPath.startFirst()` (A1.1, без проміжного екрана).
- Перевірка рівня: `learningPath.startPlacement()`. Далі `model.placementCard/placementAnswer/acceptPlacement`; після цього UI викликає `bridge.setLevel(model.course)`.
- Будь-який урок: `model.begin(lessonId)`. Якщо урок з іншого курсу, UI **спочатку** перемикає курс хоста (`pickCourse` → `bridge.setLevel`, `ui.js:37–38`). Інакше під час наступного рендеру хост поверне старий курс.
- Продовження: якщо `model.state.session` — незавершений урок, `recommended()` повертає саме його. UI має відкрити екран уроку, **не** викликаючи `begin()`, бо `begin()` починає урок спочатку.
- Етапи: `model.phases` = `study → listen → check`. Поточна картка — `model.current()`. Відповідь — `model.advance(cardId, bool)`. Наступний етап — `model.nextPhase()`.
- Після кожної відповіді на етапах «слухання» й «перевірка» UI викликає `bridge.answer(cardId, ok, final, listen)`. Він оновлює SRS (`poly_progress`) і статистику навичок.

## 4. Як завершується урок і нараховується XP

1. Остання відповідь на етапі `check` → `model.finish()` повертає `{kind,id,total,correct}` і записує **найкращий** результат у `state.completed`.
2. Для `kind==='lesson'` UI викликає **`bridge.complete(id, correct, total)`**, тобто `recordPathResult` (`app.js:5983`).
3. `recordPathResult` нараховує **5 XP за кожну правильну відповідь понад попередній найкращий результат**. Найкращий результат зберігається в `leren_path_rewards_v1`, а також у `pathSessionRewards` до кінця сесії. Нарахування йде через `addXP(gain, "p:"+id)`, тобто з ключем запису, тому з двох пристроїв воно рахується один раз.
4. Некоректний результат повертає `0`: невідомий урок, `total` не дорівнює розміру уроку, дробове значення або значення поза межами.

Зараз `finish()` і `complete()` викликаються **під час рендеру екрана результату** (`ui.js:174`). Повторний рендер безпечний: XP не дублюється, це перевіряє тест. Новий дизайн може викликати їх по кліку, але **рівно один раз** і в цьому порядку.

⚠️ Ключі `leren_path_v1` і `leren_path_rewards_v1` завжди записуються разом. Не можна скидати один без іншого. Якщо скинути лише `leren_path_rewards_v1`, повторний урок нарахує XP вдруге.

## 5. Як перемикаються курси

- Хост: `switchCourse("a11"|"a12"|"a21")`. Функція змінює `curLevel`, `currentCat` і `tab` та викликає `saveStore()`. Рушій наздоганяє хост під час наступного `learningPath.refresh()` або рендеру.
- UI маршруту: `pickCourse(level)`, тобто `bridge.setLevel(level)`, а потім `model.setCourse(level)`.
- Незавершений урок старого курсу **паркується** (`state.parked[level]`) і повертається, коли користувач знову відкриває цей курс. Стан витримує швидке перемикання й перезавантаження сторінки (тести `app-engine` і `ui-contracts` 5).
- Точку входу кожен курс зберігає окремо: `state.entries[level]`.

## 6. Як працює Review

У застосунку **три різні механізми повторення**:

| Механізм | Запуск | Дані |
|---|---|---|
| Повторення маршруту (помилки) | `learningPath.review(ids)` → `true/false`; або `model.beginReview()` | `state.mistakes` поточного курсу, до 5 карток, одразу етап `check` |
| Розминка дня | `model.warmupDue(dueIds)` / `model.beginWarmup(dueIds)` | помилки + `bridge.due()` (SRS), раз на день, від 3 слів |
| Вільна практика «Повторення» | `lessonMode="review"`, `setView("lesson")` | `dueItems(curLevel)` → `LerenSRS.due` за `poly_progress` |

Порада Петра (`runAdvice`, `app.js:1482`) для нідерландської відкриває маршрут через `learningPath.review(ids)`, а коли це неможливо — вільну практику. Якщо `review([])` повертає `false`, дизайн має показати власний «порожній» стан.

## 7. Навігація

- Екрани хоста: `setView(v)` з `v ∈ {path, lesson, toets, games, progress, dict}`. Видимість задає `data-views` в `index.html`. `path` — це маршрут і головна, він можливий лише для нідерландської.
- Екрани всередині маршруту: `home | intro | lesson | placement | map | talk`. Перемикаються внутрішньою функцією `go()`. Назовні доступні `home()`, `open()`, `chapter(id)`, `refresh()` і `pauseSpeech()`.
- Повернення на головну: `goHome()` (`setHomePref("path")` + `setView("path")` + `learningPath.home()`).
- Вибір між маршрутом і вільною практикою зберігається в `leren_home_v1` (`path` або `free`).

## 8. Як працює LIFE

- Окремі сторінки: `learn-life.html` (хаб) і `learn-life-story.html?s=<story>`. Вони завантажують `life/modules/learn-life/*` через `<base href="../life/">`. Головна посилається на `learn-life-story.html?s=first-day` (`home-v2/ui.js:109`).
- LIFE **не викликає** `app.js`. Найкращий XP кожної сцени зберігається в `leren_life_xp_v1` (`{"<story>:<scene>": xp}`), пам’ять історії — у `leren_life_memory_v1`.
- `app.js` → `absorbLifeXP()` переносить у загальний XP лише ще не зараховану частину, з ключем `l:<story>:<scene>`, максимум 100 за сцену. Це відбувається під час старту і на `pageshow` з bfcache. Повтор LIFE з гіршим результатом нічого не додає. Перевіряє тест `ui-contracts` 10.
- Офлайн: SW має кешувати `../life/...` з тими самими `?v=`, а навігація з query має повертати сторінку LIFE. Це виправлено в TEST-024 (ще не злито).

## 9. Як зберігаються налаштування

Усе зберігається в `localStorage` під ключами `poly_*` і `leren_*`. Нові ключі для синхронізації мають називатися так само: синхронізується все, що відповідає `^(poly_|leren_)`, крім `SYNC_SKIP` і `leren_voice_*` (`app.js:5763`).

| Налаштування | Змінна / API | Ключ |
|---|---|---|
| Мова інтерфейсу | `uiLang`, `bridge.setLanguage(l)` | `poly_ui` (через `saveStore`) |
| Мова, що вивчається | `targetLang` | `poly_target` |
| Курс | `curLevel`, `switchCourse` | `poly_level`, `poly_cat`, `poly_tab` |
| Тема | — | `poly_theme` |
| Ціль на день (хв) | `goalMin()` | `leren_goal_min` |
| Автоозвучення | `autoSpeech` | `leren_auto_speech` |
| Голос | — | `leren_voice_*`, `leren_char` (лише на цьому пристрої) |
| Головна | `setHomePref` | `leren_home_v1` |

Запис іде через `lsSet` або `saveStore`. Обидва обгорнуті в `try`, тож приватний режим не ламає застосунок.

## 10. Firebase, AI і ізоляція тестового середовища

- Код акаунта звертається до **production**-проєкту `leren-be` (`PUSH_CONFIG`, `fbApp`). У тестовому знімку `app/` запити не проходять лише завдяки **CSP у meta-тегу** (`connect-src 'self'; script-src 'self'`). Тому:
  - **Новий дизайн не повинен послаблювати CSP в `app/*.html`.** Жодних CDN, Google Fonts, зовнішніх скриптів чи аналітики. Інакше тестові дії почнуть записуватися в production Firebase.
  - Через це вхід, синхронізацію, AI і push у тестовому знімку перевірити неможливо. UI цих функцій має коректно показувати стан «недоступно».
- На `main` сторінка `app/reviews.html` досі має production CSP і `reviews.js` (живий Firebase). Це виправлено в TEST-024 (`claude/test-024-technical-audit`, ще не злито).

## 11. Service Worker і релізи

- `RELEASE_VERSION` в `app.js` = `CACHE_NAME` у `sw.js` = `?v=` скрипта `app.js` в `index.html` і в `sw.js`. Ці значення перевіряють тести.
- Кожен новий або змінений CSS чи JS додається в `APP_FILES` у `sw.js` з тим самим `?v=`, що й у HTML (тест `sw-upgrade.cjs` з TEST-024).
- **Номер релізу визначається в момент злиття, а не під час розробки:** `max(злитий реліз) + 1`. Дві гілки з однаковим номером і різним вмістом дають однаковий URL `app.js?v=N`, і тоді повторний користувач залишається зі старим файлом із кешу.

## 12. Бюджети продуктивності

Базові показники, виміряні на `main` 8607321 у Chromium (емуляція, телефон 390×844, локальний сервер без стиснення):

| Показник | Без обмежень | Slow 4G (1.6 Мбіт/с, 150 мс RTT, CPU ×4) |
|---|---|---|
| DOMContentLoaded | 0,37 с | 21,2 с |
| Кнопка «Почати навчання» видима | 0,46 с | 21,3 с |
| load | 0,47 с | 35,3 с |
| Запити / обсяг | 111 / 5,28 МБ (JS 2085 КБ) | те саме |
| Блокування головного потоку (long tasks − 50 мс) | 27 мс | 164 мс |
| Пам’ять після 80 переходів головна↔карта | 10,0 МБ, 938 вузлів DOM (стабільно) | — |

На першому екрані рендер блокують 47 скриптів (680 КБ gzip), 13 стилів (36 КБ) і HTML (27 КБ): **743 КБ gzip**. Найбільші — `app.js` (267 КБ) і `course-curriculum.js` (119 КБ).

**Бюджет, що діє** (тест `perf-budget.cjs`), лише не дає погіршити поточний стан: ≤ 760 КБ gzip, що блокують рендер; ≤ 45 КБ стилів; ≤ 50 блокуючих скриптів; жодних зовнішніх скриптів і стилів. Підвищувати бюджет можна лише свідомим рішенням із записом тут.

**Цільовий бюджет 3.0** (рекомендація, ще не досягнуто):
- ≤ 350 КБ gzip до першої взаємодії;
- кнопка видима ≤ 8 с на slow 4G;
- блокування ≤ 200 мс при CPU ×4;
- пам’ять стабільна.

Шлях до цілі: позначити `defer` модулі, яких немає на першому екрані (ігри `kamer`, курси `en`/`fr`, іспити), і завантажувати `course-curriculum.js` після першого екрана. Кожен крок перевіряти вимірюванням.

---

## Запропоновано (ще не реалізовано)

Нижче — **пропозиції**. Таких API у коді зараз немає.

1. **Тонкий фасад `LerenApp`** над наявними функціями, без зміни даних: `course()`, `setCourse(level)`, `progress(level)`, `xp()`, `startLesson(id)`, `completeLesson(result)`, `review(ids)`, `settings.get/set`. Він дав би дизайну стабільний вхід замість глобальних `let`. Робити його варто лише тоді, коли TEST-025 справді потребуватиме його в кількох місцях.
2. **Одне джерело правди для курсу:** записувати `poly_level` під час `pickCourse` і не визначати рівень із `poly_tab` під час старту. Це змінює поведінку, тому потрібні міграція і тест.
3. **A2 у статистиці навичок:** додати `a21` у `LEVELS` модуля `merge.js`. Зараз відповіді в A2 не записуються в `leren_skills_v2` і `leren_slips_v2`, тож порада Петра для A2 не має даних. Зміна стосується формату синхронізації: старі версії під час злиття відкинуть `a21`. Потрібні тест сумісності й окремий реліз.
4. **Захист ізоляції в коді**, а не лише через CSP: на хостах, відмінних від `lerenbe.com`, не завантажувати Firebase SDK.
