# Leren.be-test — правила для Claude Code
@AGENTS.md

## Архітектура (коротко)
- Статичний PWA без збірки: `app/` (застосунок, `app.js`, `sw.js`, `modules/`), `life/`, `index.html` (лендінг), `ai/knowledge/` (дані AI), `design-lab/` (лабораторія Codex), `tests/*.cjs` (Node + Playwright), `tools/` (генератори/порт).
- Lexi: джерело — `design-lab/test-030/lexi/`; `app/modules/lexi/` **генерується** `node tools/lexi-ui-port.cjs` (перевірка `--check`). Не редагуй згенеровані файли вручну.
- Мінімізовані однорядкові файли (`app/app.js`, `chat.js`, CSS в `index.html`): шукай через `python3`/`grep -o '.\{80\}КЛЮЧ.\{80\}'`, не читай цілком.

## Команди (перевірені)
- Один тест: `NODE_PATH=$HOME/.cache/leren-audio/node_modules node tests/<name>.cjs`
- Повний набір тихо: `bash claude-config-draft/scripts/suite.sh` (лише підсумок; логи — у `$TMPDIR`).
- Лабораторія: `python3 -m http.server 8279 --bind 127.0.0.1` + `node design-lab/test-030/checks/{audit,interactions,gallery}.cjs`; контракт — `LEXI_LAB_URL=http://127.0.0.1:8279/design-lab/test-030/lexi/ node design-lab/test-030/checks/lexi-contract.cjs`.
- Після лабораторних перевірок відновлюй лише `screenshots/test-030` (`git checkout -- screenshots/test-030`). Ніколи `git checkout -- design-lab docs`.

## Реліз (кеш)
Один номер у: `RELEASE_VERSION`, `LEXI_V` (`app/app.js`), `app.js?v=` (`app/index.html`, `app/sw.js`), `CACHE_NAME leren-be-vN`, lexi-файли в `sw.js`, пін у `tests/first-lesson.cjs`, блок H у `tests/lexi-integration.cjs`. Два релізи з одним номером — заборонено.

## Git і worktree
- Кожне завдання TEST-0NN — окрема гілка й окремий worktree у `/private/tmp/leren-test-0NN`. `claude/*` — гілки Claude, `codex/*` — Codex.
- Не редагуй гілку/worktree, де працює Codex, без явного доручення; не запускай одночасне редагування тих самих файлів.
- Без force-push, `reset --hard`, `clean -f`, `stash drop` на чужих змінах. Не відновлюй чужі stash автоматично.
- PR — лише Draft; злиття — тільки з дозволу власника.

## Production — заборонено без окремого дозволу
- Репозиторій `~/Documents/Leren.be` (production) — лише читання.
- Жодних `firebase deploy`, `wrangler deploy`, змін Cloudflare/Firebase/GitHub Pages; push у `main` запускає Pages.
- Не прибирай `noindex,nofollow`; не змінюй формат прогресу й AI API без узгодження.

## Звітність
- Не заявляй перевірку на телефоні/реальному AI, якщо тестувався емулятор/mock.
- Не змінюй тести, щоб приховати помилку.
- Підсумок: що змінено, які команди й результати, що не перевірено.
