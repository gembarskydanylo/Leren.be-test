---
name: leren-release
description: Перевірка готовності тестового релізу LerenBe — номер кешу, журнали, тести, чистота гілки, Draft PR. Лише перевіряє; НІКОЛИ не публікує, не зливає й не деплоїть.
allowed-tools: Bash(bash tools/claude/release-check.sh), Bash(git status:*), Bash(git log:*), Bash(git ls-remote:*), Bash(git show:*), Bash(git rev-parse:*), Bash(grep:*), Bash(gh pr view:*), Bash(gh pr checks:*), Read
---
Заборонено в цьому skill: `git push`, `gh pr merge`, `gh pr ready`, `firebase`, `wrangler`, будь-які deploy.
1. `bash tools/claude/release-check.sh` — єдиний номер релізу; порівняй з `main` (`git show origin/main:app/sw.js | grep -o 'leren-be-v[0-9]*'`), номер має бути новим і не збігатися з іншою відкритою гілкою (`git ls-remote origin` + `git show <ref>:app/sw.js`).
2. `TESTING-JOURNAL.md` і `PRODUCTION-TRANSFER.md` мають запис цього TEST-0NN (`grep -n 'TEST-0NN'`).
3. Останній повний прогін `leren-test` — PASS (або перелік відомих провалів).
4. `git status --short` порожній; гілка запушена (`git rev-parse HEAD` == `git ls-remote origin <branch>`).
5. `gh pr view --json isDraft,baseRefName,mergeable` — Draft, правильна база.
Результат: чекліст ✅/❌ з одним рядком доказу на пункт і вердикт «готово до огляду власником / не готово».
