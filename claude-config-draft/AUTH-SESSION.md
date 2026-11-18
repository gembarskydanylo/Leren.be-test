# Авторизована сесія Claude Code у worktree TEST-036 (без змін production)

Сесію в `/private/tmp/leren-test-036` може відкрити лише власник: агент не має права стартувати в папці, якої немає в списку застосунку. Не відкривайте `~/Documents/Leren.be` і не копіюйте туди `.claude/` чи `CLAUDE.md`.

**Варіант A — термінал (найпростіше):**
1. `cd /private/tmp/leren-test-036`
2. `"$HOME/Library/Application Support/Claude/claude-code/2.1.325/485fdac4332e/claude.app/Contents/MacOS/claude"`
3. Якщо просить вхід, виконайте `/login` і увійдіть своїм акаунтом. Облікові дані CLI зберігаються в Keychain; налаштування не змінюються.
4. `/model` → Sonnet (дешевше для перевірки).
5. Наберіть `/` і переконайтеся, що бачите `leren-audit`, `leren-test`, `leren-ui`, `leren-security`, `leren-release`.

**Варіант B — застосунок Claude:**
1. Code → New session → у виборі папки вкажіть `/private/tmp/leren-test-036`.
2. **Вимкніть** створення окремого worktree (ізоляцію) для цієї сесії, щоб працювати в наявному worktree.

   Якщо застосунок не дає вибрати цю папку, скористайтеся варіантом A. Не обходьте обмеження й не копіюйте конфігурацію в production.

**Перевірка:**
- `/leren-test sw-` → `tests ok=1 fail=0`;
- `/leren-audit` → база 8607321;
- `/leren-release` → номер релізу 230, як у main; Draft PR #21;
- `git status --short` → порожньо.

Дозволяйте лише читання та запуск тестів. На запити push, merge чи deploy відповідайте «ні».
