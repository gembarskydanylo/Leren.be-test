# Чернетка правил заборони (НЕ активна)

`settings.permissions.draft.json` — блок `permissions` для майбутнього `.claude/settings.json` тестового репозиторію. Claude Code його зараз не читає.

- **deny** (43):
  - Firebase deploy/hosting/database/firestore;
  - `wrangler secret/delete/kv/pages deploy`;
  - force-push, push у main;
  - `gh pr merge`, `gh workflow run` (запускає Pages), `gh release`, `gh secret/variable`, `gh repo edit/delete`;
  - `node tools/play-listing.mjs` (Google Play);
  - Edit/Write у production-каталозі;
  - читання файлів з обліковими даними.
- **ask** (35):
  - `wrangler deploy`: тестовий Worker тільки з окремого дозволу;
  - будь-який `git push`, merge/rebase/reset --hard/clean/stash drop|pop/branch -D/worktree remove/remote add|set-url;
  - `gh pr ready|close`, `gh api`;
  - `npm run`, `npx`, `npx --yes`, `/usr/local/bin/npx`;
  - обгортки `bash -c`, `sh -c`, `zsh -c`, `eval`, `xargs`;
  - `curl -X POST|PUT|DELETE`.

Покриття: `python3 -I bypass-check.py`. Скрипт нічого не виконує. Він симулює prefix-збіг і порівнює з чернеткою guard.

Що лишається непокритим навіть разом із guard:
- `bash ./script.sh` з deploy всередині;
- `git -C <шлях> push origin main`;
- `python3 -c` / `node -e`. Їх ловить лише guard, а prefix-правила ні.

Prefix-правила не бачать вміст скриптів і шляхів, тому основний захист від розгортання — відсутність облікових даних. Потрібен також guard hook.
