# TEST-033: початкові результати

База: `claude/test-032-lexi-integration` @ `a0428af5a1fbe17b9b13252e2da058f00a301fc4`. Окрема гілка: `codex/test-033-lexi-mobile-ux`.

- `design-lab/test-030/lexi` — джерело UI; `tools/lexi-ui-port.cjs` генерує `app/modules/lexi`. Ручні правки лише згенерованого CSS будуть перезаписані.
- Мобільний CSS задає `.lexi-app{min-height:780px}`, `.layout,.ai-chat-card{min-height:min-content}`; контейнер `.lexi-host` має `overflow:auto`. Ця комбінація може збільшити висоту сторінки і винести composer за межі viewport. Поведінку клавіатури на фізичному Android ще не перевірено.
- Глобальний Escape та history/back уже реалізовані в `lexiMount`/`lexiClose`; їх треба зберегти і перевірити при зміні viewport.
- Старий екран іспиту в `aiRender` містить вибір стилю, функції `aiHelp` і практику виправлення. Поточний Lexi presenter не має відповідних UI-компонентів; збереження контракту потребує окремого аналізу зв'язку з host, повтором і станом запиту.
- Локально пройшли `node tests/lexi-engine.cjs` та `node tools/lexi-ui-port.cjs --check`. Повний набір і браузерні перевірки не запускалися.

Це початковий аудит, не реалізація TEST-033. Немає висновку про всі п'ять функцій, доступність, Before/After або готовність до злиття.
