---
name: leren-audit
description: Read-only аудит гілки/зміни LerenBe перед плануванням — стан git, що змінено відносно бази, ризикові файли, які тести зачеплено. Використовуй на початку завдання TEST-0NN або перед рев'ю.
allowed-tools: Bash(git status:*), Bash(git diff:*), Bash(git log:*), Bash(git worktree list:*), Bash(git rev-parse:*), Read, Grep, Glob
---
Мета: за ≤6 викликів скласти картину без читання великих файлів цілком.

1. `git status --short | head -30`, `git log --oneline -5`, `git worktree list`.
2. База: `git merge-base HEAD origin/main` (або гілка з завдання). `git diff --stat <base>...HEAD | tail -25`.
3. Для мінімізованих файлів (`app/app.js`, `app/modules/lexi/*.js`, `app/index.html`) — тільки `git diff --stat` або `grep -o '.\{60\}ключ.\{60\}'`; не Read цілком.
4. Зіставити змінені файли з тестами: `grep -l '<файл>' tests/*.cjs` (не більше 5 файлів).
5. Перевір сторонні незакомічені зміни та `codex/*` гілки — не чіпати.

Результат (≤15 рядків):
```
Гілка/HEAD: … | База: … | Брудних файлів: N
Змінено: <файли, групами>
Ризики: <production/кеш/прогрес/AI API/чужі зміни>
Тести для прогону: <список>
Пропозиція плану: 1… 2… 3…
```
