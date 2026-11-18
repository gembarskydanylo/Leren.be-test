---
name: leren-ui
description: Візуальна та мобільна перевірка екранів LerenBe (Lexi, чат, іспит, LIFE) у ширинах 320/390/768/1440, світла/темна тема, RTL. Використовуй після змін CSS/HTML або для звіту зі скриншотами.
allowed-tools: Bash(python3 -m http.server:*), Bash(node:*), Read, mcp__Claude_Browser__*
---
1. Сервер: `python3 -m http.server 8279 --bind 127.0.0.1` (у фоні). Не 0.0.0.0, якщо не просили телефонний preview.
2. Віддавай перевагу наявним перевіркам: `tests/lexi-mobile-033.cjs`, `tests/lexi-keyboard-033.cjs`, `tests/ui-contracts.cjs`, `design-lab/test-030/checks/*.cjs`.
3. Скриншоти — у `screenshots/test-0NN/` або scratchpad; переглядай ≤4 зображення за раз, зменшені (`scale` 0.5) — кожне зображення дороге за токенами.
4. Перевір: горизонтальний скрол, touch-target ≥44px, фокус, клавіатура (visualViewport), контраст, `dir=rtl` для ar.
5. Для телефонного preview — LAN-адреса й `?v=` з новим тегом; не заявляй перевірку на пристрої без підтвердження власника.

Результат: таблиця «екран × ширина × тема → OK/проблема» + шляхи до скриншотів.
