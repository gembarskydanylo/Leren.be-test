# Запуск AI-чату Leren.be: чекліст і план відкату

## Як це влаштовано
`lerenbe.com` (GitHub Pages) → `https://leren-ai.gembarsky-d.workers.dev/` (Cloudflare Worker, код у `tools/ai-worker.js`) → Claude Haiku 5.5 (Anthropic).
Ключ Anthropic — лише секрет `ANTHROPIC_KEY` у Cloudflare; у репозиторії та на сайті його немає.

## Чекліст перед публічним запуском
- [ ] Anthropic Console: місячний ліміт витрат стоїть ($10), автопоповнення вимкнене, сповіщення на пошту ввімкнене.
- [ ] Cloudflare → leren-ai → Settings: `ANTHROPIC_KEY` має тип **Secret**; binding `RATE` → KV `leren-ai-rate`.
- [ ] Код у Cloudflare = `tools/ai-worker.js` з `main` (вставляти ASCII-копію, див. нижче).
- [ ] Перевірка сервера (Термінал): відповідь нідерландською, пояснення українською, відмова на питання не про мови.
- [ ] На телефоні (Android Chrome та iPhone Safari, також встановлена PWA): «Ігри» → «Praat met Peter» → екран згоди з галочкою 18+ → розмова; «Запитай Руля» → питання → приклади озвучуються.
- [ ] Після оновлення сайту на телефоні: закрити й відкрити застосунок — нова версія підтягується (кеш `leren-be-vNN` у `sw.js` піднято).
- [ ] `privacy.html` відповідає дійсності: провайдер Anthropic, Cloudflare, лічильник за IP до 25 год, 18+.

## Обмеження, про які варто пам'ятати
- Ліміт 60 повідомлень на день з однієї IP-адреси рахується в KV. На безкоштовному тарифі KV дозволяє ~1000 записів на добу; якщо їх вичерпано, чат **продовжує працювати** без ліміту за IP.
- Жорстка загальна стеля — місячний ліміт витрат в Anthropic. Коли його досягнуто або закінчилися кредити, Anthropic відмовляє, а в застосунку з'являється «Пітер зараз недоступний…». Решта застосунку працює як завжди.
- Точний загальний денний ліміт (наприклад, 2000 повідомлень) потребує Durable Object і деплою через `wrangler`.

## Як оновити код сервера
Звичайно — **автоматично**: зміни в `tools/ai-worker.js` (або `wrangler.toml`) потрапляють у Cloudflare після push у `main` (GitHub Actions «Deploy AI worker»). Нижче — запасний ручний шлях.

У Терміналі з папки репозиторію скопіювати ASCII-версію (неанглійські символи як `\uXXXX`, щоб буфер обміну їх не зіпсував):
```bash
python3 -c "import sys;s=open('tools/ai-worker.js',encoding='utf-8').read();sys.stdout.write(s.encode('ascii','backslashreplace').decode().replace('\\\\x','\\\\u00'))" | pbcopy
```
Cloudflare → leren-ai → Edit code → ⌘A → ⌘V → Deploy.

## План відкату (від найшвидшого)
1. **Вимкнути AI негайно:** Anthropic Console → API Keys → Disable ключ `leren-be-worker`. Чат показуватиме «недоступний», решта застосунку працює.
2. **Повернути попередній код сервера:** Cloudflare → leren-ai → Deployments → попередня версія → Rollback.
3. **Сховати AI-картки з сайту:** у `index.html` поставити `const AI_ENDPOINT=""`, підняти `CACHE_NAME` у `sw.js`, закомітити й відправити в `main`.
4. **Повернути весь сайт:** `git revert <коміт>` у `main` і відправити; GitHub Pages збере попередній стан (під час збоїв GitHub це може тривати довше).
