# TEST-036: оптимізація Claude Code для LerenBe 3.0 (аудит + чернетки)

Статус: **чернетка, нічого не активовано**. Файли лежать у `claude-config-draft/`, а не в `.claude/`, тому Claude Code їх не завантажує.

## 1. Поточне середовище (аудит, лише читання)

| Що | Факт |
|---|---|
| Claude Code | десктоп-застосунок, вбудований CLI 2.1.325; `claude` у PATH відсутній |
| Модель / effort | Opus 5.5, `--effort=medium` |
| Глобальні налаштування `~/.claude/settings.json` | лише `autoCompactWindow: 400000` для Opus 5.5; hooks і permissions відсутні |
| Глобальні CLAUDE.md, агенти | відсутні (`~/.claude/CLAUDE.md`, `~/.claude/agents` немає) |
| Skills користувача | `skill-creator` |
| Плагіни (org/remote) | product-management, design, kmj-codebridge, banner-design, ui-ux-pro-max, humanizer, 8b, design-system, brand, ui-styling |
| MCP без авторизації | 15 серверів плагінів design / product-management / kmj-codebridge, усі неактивні |
| Робочі MCP | Claude_Browser, ccd_*, computer-use, claude-in-chrome, terminal, visualize, scheduled-tasks, mcp-registry, iOS Simulator, Cloudflare (claude.ai), docs, easel |
| Production-репозиторій (HEAD, наразі неактивний: робоче дерево видалене) | `CLAUDE.md` + skill graphify (43 КБ), PreToolUse hooks `graphify hook-guard` (Bash/Grep/Read/Glob), плагіни context7 / 21st / agent-skills, `.mcp.json` з perplexity |
| Тестовий репозиторій | CLAUDE.md немає; є `AGENTS.md` (948 Б, правила журналів), який використовує й Codex |
| Playwright | npm-пакет у `~/.cache/leren-audio/node_modules` (через `NODE_PATH`); 45 тестів `tests/*.cjs` + 4 лабораторні перевірки |
| GitHub | `gh` автентифікований (repo, workflow); GitHub MCP немає. `push` у `main` запускає `site-preview.yml` (Pages) |
| Worktree | 12 шт.; знімок до й після — розділ 9 |

## 2. Фактичні витрати токенів (ця сесія, з `.jsonl`; скрипт `scripts/usage-report.py`)

| Метрика | Значення |
|---|---|
| Викликів API | 1 061 |
| `cache_read_input_tokens` | 241,7 млн (≈ 228 тис. контексту на виклик) |
| `cache_creation_input_tokens` | 3,10 млн |
| `output_tokens` | 1,02 млн |
| Некешований вхід | 2,2 тис. |
| Читання зображень (скриншоти png/jpeg/webp) | 71 (≈11,7 млн символів base64 у транскрипті) |
| Читання текстових файлів | 30, ≈ 0,24 млн символів (дрібниця) |
| Bash-результатів | 1 010; медіана 640 символів; 64 результати > 5 тис. символів дали разом ≈ 0,6 млн символів |
| Запусків тестів | 264 команди з `tests/`, 9 повних прогонів `runall` |

Висновки (виміряні, без оцінок економії):
1. Основна стаття — **розмір контексту × кількість викликів**: `cache_read` у ~80 разів більший за кешований запис. Контекст росте до порогу `autoCompactWindow 400000`, тож кожен виклик у другій половині сесії перечитує 200–400 тис. токенів.
2. Повторні читання великих файлів **не підтвердилися**: жоден файл не читався ≥3 разів. Мінімізовані файли переглядалися зрізами через python/grep.
3. Найважчі одиничні вставки в контекст — скриншоти й довгі логи тестів.
4. Сабагенти в цій сесії не використовувались, тож їхнього надмірного запуску немає.
5. CLAUDE.md у тестовому репозиторії відсутній. Через це правила (кеш, порт Lexi, небезпечний `runall.sh`) щоразу пояснювались у повідомленнях.

## 3. Рекомендовані інструменти

| Інструмент | Рішення | Чому |
|---|---|---|
| GitHub MCP | **не потрібен** | `gh` уже автентифікований і покриває PR/checks; ccd_pr стежить за PR |
| Context7 MCP | необов'язковий, не вмикати зараз | проєкт без фреймворків (vanilla JS + Playwright); користь мала. Плагін є в кеші (1.0.4) і в production-налаштуваннях |
| Browser / Playwright | **вже є**: вбудований браузер + Playwright npm | окремий Playwright MCP дублював би їх |
| Blender MCP | відкладено до TEST-035 | за завданням |
| graphify hooks | не переносити в тестовий репозиторій без окремого рішення | вимагають `graphify update` після змін; конфліктів із guard немає (різні matcher-и; при кількох hooks перемагає deny) |
| 15 неавторизованих MCP плагінів | запропонувати вимкнути в claude.ai, якщо не потрібні | зараз вони лише з'являються в списках і нагадуваннях. **Не змінено** — це глобальне налаштування |

## 4. Чернетки конфігурації (`claude-config-draft/`)

- `CLAUDE.md` (3,4 КБ). Імпортує `@AGENTS.md`, щоб не дублювати правила журналів. Містить архітектуру, команди, реліз, Git/worktree, production і звітність.
- `skills/`:
  - `leren-audit` — read-only, ≤6 викликів;
  - `leren-test` — тихий прогін;
  - `leren-ui` — ширини, теми, RTL, обмеження скриншотів;
  - `leren-security` — diff-чекліст;
  - `leren-release` — лише перевірка, у ньому заборонені push, merge, ready та deploy.
- `agents/`:
  - `architect` — opus, read-only;
  - `frontend-qa` — sonnet, запускає тести без редагування;
  - `security-reviewer` — sonnet, read-only.
- `scripts/`:
  - `suite.sh` — тести за підрядком; `--lab` додає лабораторію. Друкує лише підсумок і хвости провалів, відкочує тільки `screenshots/test-030`. Замінює небезпечний `runall.sh`.
  - `release-check.sh` — узгодженість номера релізу; `engine.js` має власну версію й виключений.
  - `usage-report.py` — фактичні токени сесії.
- `hooks/guard.py` + `hooks/settings.draft.json` — PreToolUse для Bash/Edit/Write:
  - **deny**:
    - force-push;
    - push у `main`;
    - `firebase deploy`;
    - `wrangler deploy` (крім `--env test`) і `wrangler secret put`;
    - `gh pr merge --admin`;
    - будь-який запис у `~/Documents/Leren.be`: git-мутації, rm/cp/mv/sed -i, редиректи; відстежуються `cd` і `git -C`.
  - **ask**:
    - `gh pr merge`, `gh pr ready`, `git merge`;
    - `reset --hard`, `checkout -- .` та відкат `design-lab`/`docs`/`app`;
    - `clean -f`, `stash drop/clear/pop`;
    - `worktree remove`, `branch -D`, видалення віддаленої гілки, `rm -rf` worktree-каталогів;
    - Edit/Write у worktree з `.agent-lock` іншого агента;
    - Edit/Write незакоміченого файлу в гілці `codex/*`.
  - Безпечні команди проходять без запитів.

## 5. Перевірка чернеток

- `hooks/fixtures/run.sh`: **50/50 фікстур PASS**. Hook отримує JSON у stdin, і жодна команда з фікстур не виконується. Тимчасові git-репозиторії для lock/codex створюються в `$TMPDIR` і видаляються.
- Затримка guard: ≈ 38 мс на виклик (20 викликів за 0,75 с).
- `release-check.sh`:
  - test-033 → `CONSISTENT 257`;
  - `main` → `CONSISTENT 230`;
  - перша версія хибно ловила `engine.js?v=1`, виправлено.
- `suite.sh sw-` на test-033 → 3/3 ok, `git status` лишився чистим.
- Skills і агенти **не запускались** як активні, бо не встановлені. Перевірено лише, що команди в них існують і працюють.

## 6. Очікувана користь (без вигаданих відсотків)

| Захід | Що змінює | Як виміряти |
|---|---|---|
| CLAUDE.md | правила кешу, порту й безпечних команд не треба пояснювати в кожній сесії | кількість уточнень і помилок типу «забув номер кешу» в TESTING-JOURNAL |
| `suite.sh` замість сирих логів | у контекст потрапляє підсумок, а не лог. Верхня межа: ≈0,6 млн символів великих Bash-виводів цієї сесії | `usage-report.py`: сума Bash > 5k |
| Скриншоти ≤4 за раз і `scale 0.5` | менше зображень у контексті | кількість `image` у `usage-report.py` |
| `frontend-qa` для повної регресії | логи та скриншоти лишаються в контексті сабагента | `cache_read` на виклик в основній сесії |
| Нижчий `autoCompactWindow` (глобальне, **не змінено**) | менший контекст на виклик; найбільший важіль за даними розділу 2 | `cache_read / виклики` |
| guard hook | блокує незворотні дії, а не економить токени | фікстури + журнал спрацювань |

Справжню економію можна назвати лише після 1–2 сесій із новою конфігурацією: треба порівняти `usage-report.py` з базою (228 тис. токенів контексту на виклик; 71 зображення; 0,6 млн символів великих Bash-виводів).

## 7. Ризики та обмеження

- Регулярні вирази guard можна обійти навмисно (через змінні, `eval`, скрипти). Це страховка від випадковостей, а не пісочниця. Команди всередині `bash script.sh` не аналізуються.
- `ask` для `git merge` спрацьовує і на безпечних злиттях feature-гілок. Так задумано, але це додаткові підтвердження.
- `.agent-lock` працює лише за умови, що Codex теж створює цей файл. Потрібна домовленість в `AGENTS.md`.
- Перевірка `codex/*` викликає `git status` для файлу: ≈ +10–30 мс на Edit.
- Сабагенти стартують «холодно» й заново читають контекст. Для дрібних задач вони дорожчі, тому їх варто вмикати лише для великих досліджень і повної регресії.
- `CLAUDE.md` з `@AGENTS.md` треба тримати коротким: він завантажується в кожну сесію.
- Skills з `allowed-tools` звужують дозволи лише в межах skill. Глобальні дозволи не змінюються.

## 8. Стандарт роботи та вибір моделі

1. **Аудит, лише читання** (`leren-audit`) →
2. **фокусний план** (≤7 кроків, конкретні файли) →
3. **мала реалізація** (одна гілка й один worktree на агента) →
4. **цільові тести** (`suite.sh <підрядок>`) →
5. **повна регресія** один раз, у фоні або в `frontend-qa` →
6. **короткий звіт** (що змінено, команди й результати, що не перевірено).

| Задача | Модель / effort |
|---|---|
| Пошук, читання, прогін тестів, дрібні правки тексту чи CSS | Sonnet 5.5 (або Haiku 5.5 для пошуку), effort low |
| Звичайна фіча в 1–3 файлах | Sonnet 5.5, medium |
| Архітектура, складний дебаг (клавіатура, SW, синхронізація прогресу), безпека | Opus 5.5, medium–high |

## 9. Перевірка незмінності

- TEST-033 / 034 / 035, production і всі worktree порівняно знімками до й після. Деталі — у фінальному звіті сесії.
- Глобальні налаштування, плагіни й MCP не змінювались. Hooks не активовано. Нічого не встановлено.

## 10. План впровадження (кожен крок — з погодження власника)

1. Переглянути чернетки. Перенести `CLAUDE.md` у корінь тестового репозиторію через Draft PR.
2. Перенести `scripts/` у `tools/claude/` і виправити шляхи в skills.
3. Перенести skills у `.claude/skills/` і агентів у `.claude/agents/` (рівень проєкту).
4. Увімкнути guard: `.claude/hooks/guard.py` + `.claude/settings.json` з `settings.draft.json`. Спершу протестувати на одній робочій сесії.
5. Додати в `AGENTS.md` домовленість про `.agent-lock` для Codex.
6. (Глобальне, за бажанням) знизити `autoCompactWindow` і вимкнути непотрібні плагіни в claude.ai.
7. Через 1–2 сесії порівняти `usage-report.py` з базою з розділу 2.

## 11. Етап 1 впроваджено (2026-11-18)
- Активовано лише `CLAUDE.md` у корені (3 209 байт, 2 347 символів, 31 рядок; дубль про телефон/mock прибрано, бо він уже є в AGENTS.md) і 5 Skills у `.claude/skills/`. Скрипти перенесено в `tools/claude/`.
- Hooks, agents, `usage-report.py` і цей звіт лишаються чернетками в `claude-config-draft/`.

## 12. Етап 2: перевірка Skills і аналіз Subagents (2026-11-18)

### Skills у новій сесії
Авторизовану сесію саме в worktree не запущено. Застосунок дозволяє стартувати лише в папці проєкту (`~/Documents/Leren.be`, production) або в хмарі, а консольний CLI окремо не авторизований. Обходу не було.

Кроки Skills виконано вручну в worktree:

| Skill | Команди | Результат |
|---|---|---|
| leren-test | `suite.sh sw-` | ok=1 fail=0, `git status` чистий |
| leren-audit | status / log / merge-base / diff --stat | база 8607321, 19 файлів, +574 |
| leren-release | release-check, номер у main, журнали, push, PR | 230 = main; TEST-036 в обох журналах; HEAD = remote fa80e31; Draft, MERGEABLE |

Знайдено й виправлено: `leren-release` вимагав «новий номер» навіть тоді, коли `app/` не змінено (як у цьому PR). Тепер для таких змін номер має дорівнювати main.

### Subagents (чернетки, не активовані)
Перевірка завантаження: CLI 2.1.325 в окремому тимчасовому каталозі (згодом видаленому) розпізнав `architect`, `frontend-qa` і `security-reviewer` в `init`.

| Агент | Модель | Інструменти | Чи може змінити файли / зробити deploy |
|---|---|---|---|
| architect | opus | Read, Grep, Glob (Bash прибрано) | **ні**: немає Bash, Edit, Write |
| security-reviewer | sonnet | Read, Grep, Glob, Bash | технічно так через Bash; стримують інструкція та дозволи сесії |
| frontend-qa | sonnet | Read, Grep, Glob, Bash | технічно так через Bash; потрібен для тестів |

- Ізоляція контексту: кожен агент стартує з чистим контекстом (системний промпт + CLAUDE.md проєкту + бриф). В основну сесію повертається лише фінальна відповідь. Логи й скриншоти лишаються в агента.
- Дозволи: агент не отримує більше прав, ніж сесія. Правила `permissions.deny` проєкту й PreToolUse hooks діють і на нього. Без них агент із Bash у режимі auto може виконати команду, яку класифікатор вважатиме безпечною. Тому **Bash-агентів активувати лише разом із deny-правилами або guard hook**.
- Ризик: два агенти не мають редагувати одні файли. Усі три агенти без Edit/Write, тож конфлікту правок немає. `frontend-qa` може лише відновити `screenshots/test-030`.

### Sonnet замість Opus (за спостереженнями цієї сесії)
- **Sonnet:**
  - прогін тестів і стислий підсумок;
  - lab-перевірки зі скриншотами;
  - `leren-audit`, `leren-release`;
  - security-рев'ю diff;
  - пошук по коду;
  - оновлення журналів;
  - перенос копій через `lexi-ui-port`.
- **Haiku:** суто механічний пошук або перелік файлів.
- **Opus:**
  - архітектура, складні баги на кшталт клавіатури/visualViewport чи SW-оновлень;
  - зміни AI-рушія, формату прогресу й міграцій;
  - фінальне рішення щодо злиття.

Саме в цій сесії найбільше токенів пішло на повні прогони, логи й скриншоти (розділ 2). Це робота для `frontend-qa` на Sonnet. Фактичну економію виміряти `usage-report.py` після першої сесії з агентами.

### План активації (кожен крок — з погодження власника)
1. Додати в `.claude/settings.json` проєкту лише `permissions.deny`: `firebase deploy`, `wrangler deploy`, `git push --force/-f`, `git push origin main`, `gh pr merge`. Перевірити фікстурою, що безпечні команди не блокуються.
2. Активувати `architect`: без Bash, найменший ризик.
3. Активувати `security-reviewer` і `frontend-qa`; один реальний прогін `frontend-qa` (`suite.sh sw-`) в авторизованій сесії.
4. Порівняти `usage-report.py` до й після.
5. Окремо вирішити, чи вмикати guard hook. Він сильніший за deny-правила, бо бачить `cd`, `-C` і production-шлях.

## 13. Етап 3: правила заборони й авторизована сесія (2026-11-18, не активовано)

**Push f600a7e:** перед ним `git status` був чистим, гілка `claude/test-036-cc-optimization`. Коміт змінює 3 файли TEST-036 (`leren-release`, `architect`, `REPORT.md`). CI «Beta checks» на pull_request — success (9 с). Workflow розгортання не запускались: `site-preview` реагує лише на push у main.

**Правила:** `permissions/` (див. README). Висновки з `bypass-check.py`:
- Prefix-правила ловлять прямі команди, `npx`/`npx --yes`, env-префікси та ланцюжки `&&`. Пропускають `python3 -c`/`node -e`, скрипти й `git -C … push origin main`.
- **Знайдено дефекти чернетки guard.py** (hook не змінювався, бо зміни hooks окремо заборонені):
  - regex `wrangler\s+deploy` не ловить `wrangler@4 deploy`, тобто реальну команду з `docs/LEXI-TEST-WORKER.md` гілки test-034;
  - не покриті `gh workflow run` і `git -C … push origin main`;
  - виняток `--env test` застарів: тестовий Worker розгортається через `-c tools/lexi-test-worker.toml` і теж потребує дозволу.

  Виправити перед будь-якою активацією hook.
- Облікові дані на машині (перевірено лише наявність файлів, вміст не читався):
  - `wrangler` не встановлено, його конфігурації немає;
  - `~/.config/configstore/firebase-tools.json` **існує**, тож `npx firebase-tools deploy` може бути авторизованим;
  - `gh` має scope `workflow`, тож `gh workflow run` здатен запустити Pages.

  Рекомендація: deny-правила для firebase і `gh workflow run` мають найвищий пріоритет.

**Рекомендований наступний етап:**
1. Ручна перевірка Skills в авторизованій сесії.
2. Виправити guard.py за знахідками вище (окремий дозвіл).
3. Активувати `permissions` разом із `architect`.

## 14. Етап 4: виправлення guard.py (2026-11-18, hook НЕ активовано)

Виправлено:
1. **Wrangler у будь-якій формі:** `wrangler`, `wrangler@4`, `npx [--yes]`, абсолютний шлях, `pnpm dlx`, `npm exec`, env-префікс, ланцюжки.
   - `deploy` без `-c tools/lexi-test-worker.toml` → **deny**;
   - тестовий Worker → **ask**;
   - `--name` поверх тестової конфігурації → deny;
   - `secret`, `delete`, `kv`, `r2`, `d1`, `pages deploy`, `versions`, `rollback` → deny;
   - `whoami` і `dev` → allow.
2. **Pages і `git -C`:**
   - `gh workflow run|enable` → deny;
   - `gh api` з `/dispatches`, `/merge`, `/pages` → deny, інші POST/PUT/PATCH/DELETE → ask;
   - усі git-правила приймають глобальні опції (`-C <шлях>`, `-c k=v`, `--no-pager`), тож `git -C … push origin main` і `HEAD:refs/heads/main` → deny;
   - `push --mirror` → deny; push на URL production-репозиторію → deny;
   - `git push` без refspec, коли поточна гілка main/master → deny.
3. **Виняток `--env test` видалено.**

Обходи:
- `python3 -c` / `node -e`: явний текст небезпечної команди → deny; інший код, що запускає процеси (`subprocess`, `child_process` тощо) → ask.
- `bash/sh/source/python3/node <файл>`, `./файл`, `npm|pnpm|yarn run <скрипт>`: hook читає вміст скрипта (1 рівень) або `package.json` і застосовує ті самі правила. Скрипт невідомого вмісту при `npm run` без `package.json` → ask.
- `… | sh`, `xargs bash`, `xargs git|gh|npx` → ask.
- Сегменти лише для читання (`grep`, `cat`, `head`…) не аналізуються як дії, тож `grep 'wrangler deploy' docs` не блокується.

Тести:
- `fixtures/run.sh`: **132/132 PASS** (50 старих, з них 1 очікування змінено: `--env test` тепер deny; плюс 82 нові);
- 51 реальний скрипт `tests/`, `design-lab/…/checks`, `tools/` гілки test-033 → 0 хибних спрацювань;
- затримка ≈ 39 мс на виклик.

Залишкові ризики:
- Обфускація (`'fire'+'base'`, base64, змінні) — лише ask, якщо видно запуск процесу. Скрипти глибше 1 рівня, завантажені з мережі чи згенеровані під час виконання hook не бачить.
- `git push` без refspec на feature-гілці з upstream `main` не розпізнається. Гілки TEST мають власні upstream.
- Hook — страховка від випадкових дій, а не пісочниця. Головний захист — облікові дані:
  - `firebase-tools.json` існує;
  - `gh` має scope `workflow`.
