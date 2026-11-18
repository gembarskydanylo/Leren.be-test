---
name: leren-security
description: Безпекова перевірка змін LerenBe — секрети, XSS у innerHTML, CSP, сервіс-воркер, Firebase-правила, Worker/AI ліміти, персональні дані в журналах. Використовуй перед Draft PR або для рев'ю чужої гілки.
allowed-tools: Bash(git diff:*), Bash(git log:*), Bash(grep:*), Read, Grep
---
Тільки читання. Аналізуй diff, а не весь репозиторій: `git diff <base>...HEAD -- . ':!screenshots' ':!*.png'`.
Чекліст:
- Секрети/токени/ключі у diff (`grep -nE 'AIza|sk-|Bearer |api[_-]?key|secret'`) — не друкуй значення, лише файл:рядок.
- `innerHTML`/`insertAdjacentHTML` з даними користувача або AI без екранування.
- Нові зовнішні домени (fetch/script/img) і CSP/`connect-src`.
- `sw.js`: що кешується, чи не кешуються відповіді AI/персональні дані.
- `noindex,nofollow` на тестових сторінках не прибрано.
- Firebase/Worker: зміни правил, CORS, лімітів (`tests/ai-worker-limits.cjs`, `firebase-isolation.cjs`).
- Журнали/звіти без повідомлень користувачів і записів мікрофона.
Результат: список `severity | файл:рядок | проблема | пропозиція`, або «зауважень немає» з переліком перевіреного.
