# Тестовий AI для Lexi (TEST-034)

**Статус:** конфігурацію підготовлено, **нічого не розгорнуто**. Розгортання потребує окремого погодження власника.

## Навіщо

Реальні відповіді Lexi ще ніхто не перевіряв: TEST-031–033 працювали тільки з mock-відповідями.

Production-Worker `leren-ai` використовувати для цього не можна:
- він обслуговує lerenbe.com;
- він не знає ролі Lexi з TEST-031 (відповідає як Пітер);
- його ліміти та ключ — бойові.

Тестовий Worker — це **той самий код** (`tools/ai-worker.js`, не новий рушій), але з окремою назвою, окремими секретами, лімітами й origin.

## Схема

```
Телефон (Chrome) ──USB, adb reverse──► Mac: tools/lexi-test-server.cjs :8765
                                          ├─ /app/…          → файли app/ (без змін)
                                          └─ /lexi-test-ai/  → https://leren-ai-test.<акаунт>.workers.dev
                                                                  (Origin: http://localhost:8765)
                                                                  → Anthropic API, окремий workspace
```

Застосунок не змінюється. Його CSP (`connect-src 'self'`) дозволяє запити тільки до власного origin, а власний AI-адрес він приймає тільки на `localhost`. Тому локальний сервер пересилає запити Lexi на тестовий Worker.

Що робить сервер:
- відмовляє, якщо в `LEXI_TEST_WORKER` вказано production `leren-ai` або будь-яку іншу адресу, крім `leren-ai-test.*.workers.dev`;
- віддає тільки папку `app/`.

## Що відокремлено

| | Production `leren-ai` | Тест `leren-ai-test` |
|---|---|---|
| Код | `tools/ai-worker.js` | той самий файл |
| Розгортання | GitHub Actions у production-репозиторії, push у main | **лише вручну**, жодного workflow (перевіряє тест) |
| Origin | lerenbe.com, www, localhost:8765 | **лише** `http://localhost:8765` (`ALLOWED_ORIGINS`) |
| Ключ AI | production `ANTHROPIC_KEY` | **новий ключ окремого workspace** з лімітом витрат |
| `RATE_SALT` | production | новий випадковий |
| KV | `leren-ai-rate` | новий `leren-ai-test-rate` або жодного |
| Ліміти за хвилину (пристрій / мережа / усі) | 12 / 40 / 300 (namespace 1001–1003) | **6 / 10 / 20** (namespace 2001–2003) |
| Ліміти за день (пристрій / мережа) | 60 / 150 | **30 / 60** |
| Модель | `claude-haiku-5-5` (типово) | `claude-haiku-5-5`, effort `low` |
| Звіти про помилки (`/errors`) | так (ERRS) | ні |
| Firebase, дані користувачів | — (Worker їх не має) | — |
| Вимикач | `AI_OFF=1` у Cloudflare | `AI_OFF=1` **після кожного розгортання** (`keep_vars = false`) |

`tests/lexi-test-worker.cjs` перевіряє цю таблицю. Тест не пройде, якщо конфігурацію змінять так, що вона:
- матиме назву `leren-ai`;
- використовуватиме production KV чи лічильники 1001–1004;
- матиме ліміти, вищі за production;
- дозволятиме lerenbe.com або github.io;
- міститиме секрет;
- розгортатиметься якимось workflow.

## Єдина зміна в коді Worker

У `tools/ai-worker.js` додано необов'язкову змінну `ALLOWED_ORIGINS` (список через кому).
- **Сумісно:** без цієї змінної (тобто в production) діє той самий список, що й раніше. Це перевіряє тест.
- Неправильне значення (наприклад `*`) ніколи не означає «дозволити всім»: тоді діє стандартний список.
- `WORKER_VERSION` → `2026-11-18-lexi-v2`.

## Оцінка витрат

Ціна Claude Haiku 5.5: $0.10 за 1M вхідних і $0.50 за 1M вихідних токенів (листопад 2026).

Один запит чату — приблизно 5–7 тис. токенів на вході (системні правила й курс) і до ~1 тис. на виході разом із міркуваннями. Це близько **$0.001 за відповідь**.

| Сценарій | Відповідей | Орієнтовно |
|---|---|---|
| Одна сесія перевірки на Samsung | ~50 | ~$0.05 |
| Денний максимум одного пристрою | 30 | ~$0.03 |
| Теоретичний максимум усього Worker | 20/хв × 60 хв | ~$1.2 на годину |

Реальний ризик витрат — це не тест, а забутий увімкнений Worker. Тому:
1. `AI_OFF=1` після кожного розгортання;
2. ліміт витрат на workspace в Anthropic Console (рекомендовано $5 на місяць);
3. ліміти 20 відповідей на хвилину на весь Worker і 30 на пристрій за день;
4. origin — лише локальний сервер.

## Ризики

| Ризик | Ймовірність | Наслідок | Захист |
|---|---|---|---|
| Розгорнути тест як `leren-ai` і перезаписати production | низька | високий | інша назва; тест; у цьому репозиторії немає workflow для Worker |
| Використати production-ключ | середня (зручно скопіювати) | середній: спільні витрати й ліміти | окремий workspace; інструкція нижче; ключ не зберігається в репозиторії |
| Забутий увімкнений Worker | середня | низький: ≤ ~$1.2/год, ліміт workspace | `AI_OFF=1` після деплою, ліміт у Console, кроки вимкнення |
| Підробка заголовка Origin з curl | можлива | низький | ліміти за хвилину й день, ліміт workspace |
| Реальні персональні дані в тестових розмовах | низька | середній | правило: лише вигадані дані; Worker нічого не зберігає (лише логи скарг) |
| Тестові скарги змішаються з production | — | — | окремі логи `leren-ai-test` |

## Розгортання (лише після погодження власника)

```bash
# 0. Anthropic Console: окремий workspace «LerenBe test», ліміт витрат $5/міс., новий API-ключ (не production).
npx wrangler@4 whoami
npx wrangler@4 deploy -c tools/lexi-test-worker.toml                  # розгортається ВИМКНЕНИМ (AI_OFF=1)
npx wrangler@4 secret put ANTHROPIC_KEY -c tools/lexi-test-worker.toml # ключ тестового workspace
openssl rand -hex 32 | npx wrangler@4 secret put RATE_SALT -c tools/lexi-test-worker.toml
# (необов'язково) окремий денний лічильник:
npx wrangler@4 kv namespace create leren-ai-test-rate                  # id вписати в [[kv_namespaces]] у toml
```

**Увімкнути на час тесту:**

```bash
npx wrangler@4 deploy -c tools/lexi-test-worker.toml --var AI_OFF:0
LEXI_TEST_WORKER=https://leren-ai-test.<акаунт>.workers.dev/ node tools/lexi-test-server.cjs
```

Потім один раз відкрити `http://localhost:8765/lexi-test.html` у браузері, де тестуєте.

**Вимкнути (будь-що з переліченого):**
- `npx wrangler@4 deploy -c tools/lexi-test-worker.toml` — без `--var`, тож `AI_OFF=1`;
- зупинити локальний сервер (Ctrl+C);
- видалити Worker: `npx wrangler@4 delete -c tools/lexi-test-worker.toml`;
- відкликати ключ у Anthropic Console.

**Перевірка до першого тесту:**

```bash
curl -s -o /dev/null -w '%{http_code}\n' -X POST -H 'Origin: https://lerenbe.com' https://leren-ai-test.<акаунт>.workers.dev/   # 403
```

## Що вважати перевіреним

Реальний AI можна назвати перевіреним лише тоді, коли на тестовому Worker пройдуть **усі 11 точок входу**. Для кожної треба зафіксувати:
- мову, рівень і сценарій;
- сам запит (вигадані дані) і відповідь;
- чи була виправлена помилка;
- час відповіді;
- поведінку на лімітах.
