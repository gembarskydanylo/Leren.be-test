# Firebase App Check для AI Lexi — план безпечного впровадження (TEST-041)

**Стан:** документація і локальний прототип.
- Cloudflare, Firebase, production Worker, CORS і CSP **не змінювались**.
- `tools/appcheck-verify.mjs` ніде не підключений. `tests/appcheck-verify.cjs` перевіряє, що Worker його не використовує.

## 1. Зараз

| Що | Стан |
|---|---|
| App Check у застосунку | є лише для Firestore і Auth (`appCheckHeaders`, reCAPTCHA Enterprise, лише на lerenbe.com, найкраща спроба 5 с) |
| AI-запити | токен **не надсилають** |
| Worker `leren-ai` | токен **не перевіряє**; захист — Origin, ліміти за хвилину і за день, `AI_OFF`, ліміт витрат |
| CORS Worker | `Access-Control-Allow-Headers: Content-Type, X-Leren-Device` |
| CSP production | `script-src` має `www.gstatic.com`, `apis.google.com`, але **не `www.google.com`**; `frame-src` не має `www.google.com` |

**Ймовірна наявна проблема (перевірити лише читанням).** reCAPTCHA Enterprise завантажує `https://www.google.com/recaptcha/enterprise.js` і iframe з `www.google.com`. Якщо CSP це блокує, App Check для Firestore уже зараз тихо не отримує токенів.

Як перевірити: Firebase Console → App Check → метрики Firestore (частка перевірених запитів). Нічого не змінювати.

## 2. Архітектура

```
застосунок (лише lerenbe.com)                     Worker leren-ai
 appCheckHeaders() → той самий токен,  ──POST──▶  1. CORS: дозволити заголовок X-Firebase-AppCheck
 що й для Firestore (кеш SDK, ~1 год)             2. verifyAppCheck(): RS256, kid з JWKS (кеш 6 год),
 + X-Leren-Device                                    iss = …/533895640416, aud = projects/533895640416|leren-be,
                                                     sub = web appId, exp / iat
                                                  3. режим APPCHECK = off | report | enforce
                                                  4. рішення → ліміти, а не одразу 403
```

**Рішення в режимі `enforce`:**

| Токен | Дія |
|---|---|
| дійсний | звичайні ліміти |
| відсутній (старі версії застосунку з кешу SW, браузер без reCAPTCHA, блокувальник) | **знижені** ліміти: наприклад, 10 повідомлень на день замість 60. Не 403 |
| недійсний (підроблений, чужий проєкт, прострочений) | 403 `{error:"forbidden"}` → у застосунку `unavailable` (TEST-038) |

**Тайм-аут.** Токен береться до 5 с у межах 30 с запиту. Якщо він не надійшов, запит іде без токена.

**Вартість.** Використовується той самий токен, що вже береться для Firestore, тож нових перевірок reCAPTCHA немає. Одноразові токени (`getLimitedUseToken`) **не використовувати**: кожен — платна перевірка.

## 3. Сумісність (ризики)

1. **CORS — найбільший ризик.** Якщо клієнт почне надсилати `X-Firebase-AppCheck` раніше, ніж Worker дозволить цей заголовок, браузер не пропустить жоден AI-запит. Порядок: **спершу Worker, потім клієнт**.
2. **Старі клієнти.** Кеш Service Worker тримає старі версії днями, і вони токен не надсилають. Тому «немає токена» ≠ «бот».
3. **CSP production:** див. §1. Без виправлення CSP токенів може не бути зовсім. Тоді режим `enforce` знизить ліміти всім учням.
4. **Play-застосунок (TWA)** відкриває lerenbe.com у Chrome, тож reCAPTCHA працює. Окремий провайдер Play Integrity не потрібен.
5. **Бета і localhost:** `prodServices()` = false, токена немає. Тестовий Worker має працювати в режимі `off` або `report`.
   - Debug-токени App Check вимагають реєстрації в консолі Firebase (це зміна Firebase), тому їх не використовуємо.
   - Локальні тести працюють на власних ключах.
6. **Ротація ключів:** кеш JWKS на 6 год; якщо оновлення не вдалося, лишаються старі ключі. Перевірено в тесті.

## 4. Тестування

**Локально (готово):** `tests/appcheck-verify.cjs` — 15 випадків на власних RSA-ключах:
- дійсний токен;
- відсутній, зламаний, `alg:none`, HS256;
- невідомий `kid`, підроблений підпис, змінені claims;
- чужий проєкт, audience, app id;
- прострочений, виданий у майбутньому;
- порожній JWKS;
- кеш ключів;
- гарантія, що Worker не використовує прототип.

**Далі (після погодження, без production):**
1. Тест Worker: CORS-preflight з `X-Firebase-AppCheck` → дозволено; режими `off` / `report` / `enforce`; знижені ліміти без токена.
2. Тест клієнта: заголовок додається лише при `prodServices()`; 5 с тайм-аут не зриває 30 с запит.
3. Тестовий Worker `leren-ai-test`: режим `report`, перевірка журналу.

## 5. Поступове впровадження (кожен крок — окреме погодження)

| Крок | Що | Де | Відкат |
|---|---|---|---|
| 0 | Прототип + локальні тести | репозиторій | — (готово) |
| 1 | Підключити `verifyAppCheck` у Worker за змінною `APPCHECK` (за замовчуванням `off`) + дозволити заголовок у CORS | код | — |
| 2 | Тестовий Worker, `APPCHECK=report` | Cloudflare (тест) | `off` |
| 3 | Перевірити CSP production для reCAPTCHA і метрики Firestore | лише читання | — |
| 4 | Production Worker з кроком 1, `APPCHECK=off`, потім `report` | Cloudflare (prod) | `off` |
| 5 | Реліз клієнта, що надсилає токен | застосунок | попередній реліз |
| 6 | ≥ 2 тижні: частки дійсних / відсутніх / недійсних | журнал Worker | — |
| 7 | `APPCHECK=enforce`: недійсні → 403, відсутні → знижені ліміти | Cloudflare (prod) | `report` |

Аварійний вимикач `AI_OFF` лишається незалежним.
