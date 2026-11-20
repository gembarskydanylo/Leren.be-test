# Lesson Help: технічний план підключення `bridge.lexi('lesson', ctx)` (TEST-042, лише план)

**Стан:** нічого не реалізовано. UI, Worker і рушій не змінювались. Контракт полів — [`LEXI-LESSON-HELP-CONTRACT.md`](LEXI-LESSON-HELP-CONTRACT.md).

## 1. Що вже працює

`bridge.lexi(scenario, ctx)` → `lexiOpen` ([app.js](../app/app.js)) → `lexiCtx(s, extra)` → `lexi().context()` → запит. Мови (`ui`, `explain`, `target`) і рівень беруться зі стану застосунку, а не з екрана. Нове: у екранів уроку **немає виклику**. Усі три потрібно підключити однаково, одним спільним помічником.

## 2. Спільний помічник (один раз, у `app.js`)

```js
// ask Lexi about the current exercise; never sends account data
function lessonHelp(ex){ return lexiOpen('lesson', {topic: ex.topic, lesson: ex.lesson,
  kind: ex.kind, question: ex.question, expected: ex.expected, answer: ex.answer}) }
```

- `window.lessonHelp` передається в `bridge` для Learning Path і Course Player.
- `lexiOpen` уже зливає `ctx` у `lexiCtx`, тож змінюється лише розгортання `exercise` у плоскі поля (за контрактом §5).
- Поля `ui`, `target`, `level` з виклику ігноруються.

## 3. Три екрани

| Екран | Де додати кнопку | Звідки дані | Файли |
|---|---|---|---|
| **Classic Lesson** | `renderStudyControls(card)` (study), `renderBuild()` і блок перевірки відповіді (quiz) у `app.js` | `item` (слово/фраза), `meaningFor(item)`, `currentCat`, `mode` | `app/app.js` |
| **Learning Path (nl)** | екран кроку в `modules/learning-path/ui.js`, поруч з «Перевірити» | `lessonTitle(l)`, назва розділу, підказка кроку | `modules/learning-path/ui.js`, `app.js` (bridge) |
| **Course Player (en / fr)** | функція `question()` у `modules/course-player/exam.js` і картка в `ui.js` (`cp-q`) | `it.prompt[ui]`, зразок з курсу, відповідь учня після вибору | `modules/course-player/{ui,exam}.js` |

Кнопка: текст «Запитай Lexi» / «Ask Lexi» / «Demande à Lexi» / «اسأل Lexi» (мова інтерфейсу), `type="button"`, ціль торкання ≥ 44 px, RTL, ліміт символів у кнопці не потрібен. Дизайн кнопки — Codex.

## 4. Приватність (перевірити тестом)

- Передаються лише: `topic` ≤ 60, `lesson` ≤ 80, `kind` (study / quiz / build / listen / write / talk), `question` ≤ 200, `expected` ≤ 200, `answer` ≤ 200.
- **Ніколи:** uid, e-mail, ім'я, XP, серії, бали, історія уроків, аудіо. `context()` у рушії пропускає тільки перелічені поля.
- `answer` іде лише після натискання кнопки учнем і лише якщо він уже відповів.
- `expected` не розкривається учню до спроби (інструкція у `learnerNotes()` Worker; зміна Worker — окремий дозвіл).

## 5. Локалізація

- Підпис кнопки — 4 мови, назва і напрям (RTL) від `uiLang`.
- Відповідь Lexi: мова пояснення = мова інтерфейсу (TEST-041); якщо вона збігається з мовою навчання — проста мова рівня учня.
- Тести: 4 мови × 3 екрани × кнопка видима, ≥ 44 px, без горизонтального скролу на 320 px.

## 6. Тести (нові)

1. **Контекст:** клік кнопки → запит містить `topic`, `lesson`, `kind`, `question`, `expected`; не містить персональних полів (перевірити тіло запиту).
2. **Обмеження:** довгі поля обрізаються; некоректний `kind` відкидається; `ui/target/level` з виклику ігноруються.
3. **Ключ відновлення розмови (TEST-037):** додати нові поля в ключ `[… topic, lesson, question, answer, send]`, інакше Lexi відновить розмову з іншої вправи.
4. **Оффлайн / помилки:** кнопка не ламає урок, якщо Lexi вимкнено (бета без AI) або сервер недоступний.
5. **Урок не зривається:** XP, прогрес, таймер і відповіді не змінюються після відкриття та закриття Lexi.

## 7. Порядок реалізації (після погодження)

1. Claude: `engine.js` `context()` (`kind`, `expected`), `app.js` помічник, тести 1–3. Worker не чіпати.
2. Codex: кнопка й стилі на трьох екранах (окремий worktree).
3. Claude: інтеграція, тести 4–5, оновлення журналів.
4. Окремо, з дозволом: `learnerNotes()` у Worker (рядки `exercise type`, `expected answer`) і його деплой.

**Складність:** середня (3 екрани + рушій + ~5 тестів). **Ризики:** персональні дані в `answer`; ключ відновлення розмови; бюджет першого екрана 760 KB gzip (зараз 759,96 KB — нового коду в `app.js` майже немає куди додавати, помічник треба писати дуже коротким або у модулі з відкладеним завантаженням).
