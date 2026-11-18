# Активація захисту TEST-036 і відкат (НЕ виконано; потрібне погодження власника)

Що вмикається: PreToolUse hook `hooks/guard.py` (Bash, Edit, Write, MultiEdit, NotebookEdit) і блок `permissions` (43 deny + 35 ask). Обидва — у `settings.guard.json`.

## Сумісність із Claude Code 2.1.325 (перевірено)
- Ключі `hooks.PreToolUse[].matcher/hooks[]`, `type`, `command`, `timeout`, `onFailure`, `statusMessage` існують у схемі 2.1.325.
- Hook із `--settings` справді запускається; `$CLAUDE_PROJECT_DIR` дорівнює папці сесії; у stdin є `cwd`, `hook_event_name`. Для PreToolUse схема містить `tool_name`, `tool_input`, `tool_use_id`; відповідь `hookSpecificOutput.permissionDecision` ∈ allow/deny/ask/defer — саме так відповідає `guard.py`.
- CLI завантажив із `settings.guard.json` усі 43 deny і 35 ask правил (`flagSettings`).
- **`onFailure: "block"`**: без нього збій hook (немає скрипта, таймаут, код не 0/2, зіпсований JSON) за замовчуванням лише повідомляється, а дія виконується. З `block` збій блокує дію. `guard.py` теж завершується кодом 2 при нечитабельному вході.
- Не перевірено: живе спрацювання PreToolUse (потрібна авторизована сесія). Невідомі ключі CLI мовчки ігнорує, помилку не показує — тому живу перевірку (`LIVE-CHECK.md`) пропускати не можна.

## Область дії: лише TEST-036
- Спосіб A (рекомендований для першої перевірки): прапорець `--settings`. Діє тільки в запущеній сесії, нічого не записує ні в репозиторій, ні в `~/.claude`, і не діє ніде більше. Закриття сесії = відкат.
- Спосіб B (після успіху A): `.claude/settings.local.json` у worktree `/private/tmp/leren-test-036`. Файл не комітити. Діє лише для сесій, відкритих у цій папці.
- Не вносити в `.claude/settings.json` у PR #21 без окремого погодження: після злиття в `main` файл потрапить у кожну гілку, що її підтягне, зокрема гілки Codex.
- Перевірено: у worktree TEST-027/030/033/035, `l*`, `int`, `q`, `test` і в `origin/main`, `test-033`, `test-034`, `test-035` немає ні `.claude/settings*`, ні `CLAUDE.md`. Production-папка `.claude` теж не має. `~/.claude/settings.json` не чіпається.
- Якщо запустити сесію з `--settings` в іншій папці, шлях `$CLAUDE_PROJECT_DIR/claude-config-draft/hooks/guard.py` не знайдеться → код 2 → усі Bash/Edit/Write будуть заблоковані (fail-closed). Це видно одразу.

## Активація (способом A, у терміналі)
```bash
bash /private/tmp/leren-test-036/claude-config-draft/activation/make-probe-env.sh
cd /private/tmp/leren-test-036
LEREN_PROD_DIR=/private/tmp/leren-guard-probe \
  "$HOME/Library/Application Support/Claude/claude-code/2.1.325/485fdac4332e/claude.app/Contents/MacOS/claude" \
  --settings claude-config-draft/activation/settings.guard.json
```
`LEREN_PROD_DIR` лише для живої перевірки: hook вважає «production» порожній тимчасовий каталог, тож жодна проба не торкається справжнього production. Для звичайної роботи змінну не задавати (за замовчуванням `~/Documents/Leren.be`).

## Відкат
- Спосіб A: вийти із сесії (`/exit`). Нічого не залишається. Прибрати пробні каталоги: `bash claude-config-draft/activation/remove-probe-env.sh`.
- Спосіб B: `rm /private/tmp/leren-test-036/.claude/settings.local.json` (у терміналі, поза сесією) і перезапустити сесію.
- Якщо hook заблокував усе (наприклад, зіпсований `guard.py`): у терміналі `rm .claude/settings.local.json` або запустити Claude Code без `--settings`. Файли самого hook лишаються в гілці й нічого не роблять, поки не підключені.
- Повний відкат змін репозиторію: `git revert` відповідного коміту в PR #21.
