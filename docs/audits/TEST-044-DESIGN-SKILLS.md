# TEST-044 · Дизайн-skills (Emil Kowalski + Impeccable) на тестовому сайті

Лише читання: код сайту не змінювався. Працювали тільки з `Leren.be-test`; production і lerenbe.com не чіпали.

## 1. Що встановлено (лише для користувача, у `~/.claude/skills/`, НЕ в репозиторій)
| Джерело | Ліцензія | Коміт | Що |
|---|---|---|---|
| github.com/emilkowalski/skills | MIT | `64eb3de` | 20 skills (усі папки з `skills/`): лише Markdown-інструкції, без скриптів/хуків |
| github.com/pbakaus/impeccable | Apache-2.0 | `b49177d` | лише `.claude/skills/impeccable` (skill 4.10.0, engine 0.1.27) |

**НЕ встановлено (свідомо):** `plugin/`, `.claude-plugin/`, `hooks.json`, `npx impeccable install`, маркетплейси, сторонні збірки. `~/.claude/settings.json` не змінювався (хуки не додавались).

**Невиконано:**
- `export DO_NOT_TRACK=1` у `~/.zshrc`: автоматичний класифікатор заблокував запис. Користувачу виконати вручну: `echo 'export DO_NOT_TRACK=1' >> ~/.zshrc`.
- Рушій Impeccable (`scripts/impeccable`, завантаження бінарника з GitHub Releases) НЕ запускався і НЕ завантажувався. Тому `impeccable context/detect/shot` не виконані; аудит Impeccable зроблено вручну за `reference/audit.md` (5 вимірів), а не детектором.
- `.impeccable/config.json` `{"telemetry": false}` створено локально, виключено через `.git/info/exclude`, не комітиться.
- Skills підхопляться лише після перезапуску сесії Claude Code.

## 2. Метод
Playwright Chromium (емуляція), сервер `python3 -m http.server 8765`, новий користувач; «Пропустити» не знадобилось (кнопки не було). Скриншоти: `docs/audits/test-044-screenshots/home-{360,390,1280}[-full].png`. Огляд коду `app/modules/{home-v2,focused-home,learning-path}`. Skills Емілa (review-animations, emil-design-eng) застосовано як чекліст вручну в цій сесії (вони ще не були завантажені як skills); автоматичного прогону не було.

## 3. Виміряно
- Горизонтального скролу немає: 360/390/1280 (scrollWidth = clientWidth). Висота головної 3306 / 3355 / 2751 px. Помилок у консолі немає. Шрифти Nunito, Unbounded завантажуються; `lang="uk"`; `main` один.
- Цілі дотику < 44 px: 390 px — `hdr-pill streak-pill` 35×36, `hdr-btn` «Налаштування» 42×40; 1280 px — ще `dh-icon` «Нагадування» 42×42.
- Два `<h1>` на сторінці («lerenbe.com» і заголовок про життя в Бельгії).

## 4. Знахідки
### Критичне
Не виявлено (немає overflow, помилок, провалів).

### Варто виправити
1. **Кнопки зупинок маршруту (`hv-stop-button`, 12 шт.) без доступного імені в виміру** (`innerText`/`aria-label` порожні у момент перевірки); можливо, текст вставляється пізніше або зони поза екраном. *Не підтверджено* — перевірити екранним читачем. (`home-v2/ui.js:134`)
2. **Sticky hover на телефоні:** 17 правил `:hover` без `@media (hover:hover)` (focused-home, learning-path). Після тапу картка лишається «підсвіченою» (Emil: mobile-native).
3. **Немає press-feedback (`:active`)** у home-v2 (0 правил; у focused-home 3, learning-path 1) — картки уроку/зупинок не «відчуваються» на тап (Emil: scale ~.97 на :active).
4. **Дрібні цілі дотику** (дві–три кнопки шапки < 44 px, див. п.3).
5. **Два `<h1>`** — змішана ієрархія для скрінрідерів/SEO.
6. **~188 жорстких hex-кольорів** у CSS трьох модулів (home-v2 39, focused-home 95, learning-path 54) замість токенів `var(--…)`; ризик розбіжностей при темізації.

### Дрібниці
- `prefers-reduced-motion`: є в focused-home (3), learning-path (2), але немає в home-v2 (там анімацій практично немає — ок).
- Переходи: `transform .2s` / `.15s` без явного easing (за замовч. `ease`), тоді як є токен `cubic-bezier(.2,.8,.2,1)` (Emil: єдиний ease-out токен).
- Пульсація `fh-voice` — `ease-in-out infinite` на box-shadow (лише поки звучить; дрібна вартість перфомансу).
- На 390 px логотип «lerenbe» в шапці обрізається; нижня навігація візуально перекриває край наступного блоку (звичайний fixed-бар, перевірити відступ знизу).
- Не знайдено: `transition: all`, `ease-in` на UI, `scale(0)`, `outline:none`.

## 5. Топ-5 покращень (ризик)
1. Обгорнути `:hover` у `@media (hover:hover)` — **ризик низький** (чистий CSS, лише тач-поведінка).
2. Додати `:active{transform:scale(.97)}` з `transition: transform .15s var(--ease-out)` для кнопок/карток — **низький**.
3. Підняти кнопки шапки (streak, налаштування, нагадування) до мін. 44×44 — **низький–середній** (може зсунути шапку на 360 px; перевірити тестами home-v2/simple-home).
4. Перевірити/додати доступні імена для `hv-stop-button` (`aria-label` з назвою теми й станом) — **низький** (тільки атрибути), але спершу підтвердити проблему.
5. Один `<h1>` (логотип → не заголовок) — **середній** (стилі шапки/SEO-тести, `learning-map-seo`); робити окремим PR.

## 6. Тести (`for t in tests/*.cjs; do node "$t"; done`, NODE_PATH з Playwright)
**22 PASS / 0 FAIL / 0 SKIP.** (Перший запуск дав rc=127 через відсутню на macOS команду `timeout` в моєму скрипті; це помилка запуску, не тестів — повторено без неї.) Файли: ai-coach, beta-daily, clock, code-audit, companion, curriculum, first-lesson, home-art-failure, home-v2, learning-map-edges, learning-map-seo, learning-path, lesson-conversation, life-quality, life-visuals, personal-coach, push-permissions, rewards, runtime-smoke, simple-home, sw-manifests, widgets.

## 7. Не перевірено
Фізичний телефон і реальний дотик; екранний читач; запуск рушія/детектора Impeccable (`detect`, `shot`, live); автоматичний прогін skills Емілa; контраст кольорів вимірюванням; темна тема; LCP/CLS у реальній мережі; сторінки поза головною.
