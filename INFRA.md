# Leren.be — де що лежить і за що відповідає

Короткий довідник по всіх онлайн-сервісах проєкту. Ключів і паролів тут немає — лише де вони зберігаються.
Перелік файлів на комп'ютері — у локальному `LOCAL-FILES.md` (не публікується на GitHub).

## Як усе пов'язано

```
Користувач (браузер / застосунок з Google Play)
   │
   ├─► lerenbe.com ──────────────► GitHub Pages (репозиторій gembarskydanylo/Leren.be, гілка main)
   │                               index.html, sw.js, audio/, dict/, privacy.html …
   │
   ├─► AI-чат ───────────────────► Cloudflare Worker "leren-ai" ──► Anthropic (Claude Haiku 5.5)
   │                               (код: tools/ai-worker.js, ключ — секрет у Cloudflare)
   │
   ├─► Акаунт (необов'язково) ───► Firebase Authentication (Google / e-mail)
   │   і синхронізація ──────────► Firestore: users/{uid}
   │
   └─► Нагадування ──────────────► Firestore: subs/{id} ◄── GitHub Actions щогодини (tools/send-reminders.mjs)
```

## Сервіси

| Сервіс | Акаунт | Що там лежить | За що відповідає | Вартість |
|---|---|---|---|---|
| **GitHub** — репозиторій `gembarskydanylo/Leren.be` | GitHub gembarskydanylo | Увесь код і дані застосунку (гілка `main`) | Джерело правди для сайту; історія змін | Безкоштовно |
| **GitHub Pages** | той самий | Зібраний сайт з гілки `main` | Хостинг **lerenbe.com** (файл `CNAME`) | Безкоштовно |
| **GitHub Actions** | той самий | `reminders.yml` (секрети `FIREBASE_SA`, `VAPID_PUBLIC`, `VAPID_PRIVATE`), `deploy-worker.yml` (секрет `CLOUDFLARE_API_TOKEN`) | Щогодини надсилає push-нагадування; деплоїть сервер AI в Cloudflare; збирає Pages | Безкоштовно |
| **Cloudflare** — DNS | gembarsky.d@gmail.com | DNS-записи **lerenbe.com** → GitHub Pages (копія: `lerenbe.com.txt`) | Домен веде на сайт | Безкоштовно |
| **Cloudflare Workers** — `leren-ai` | той самий | Код = `tools/ai-worker.js`; секрет `ANTHROPIC_KEY`; KV `leren-ai-rate` (binding `RATE`); журнали (скарги `AI_REPORT`) | Сервер AI-чату: інструкції для Claude, ліміт 60 повідомлень/день з IP, пам'ять, скарги. Адреса: `https://leren-ai.gembarsky-d.workers.dev/` | Безкоштовний тариф |
| **Anthropic Console** — platform.claude.com | особистий акаунт | API-ключ `leren-be-worker`; кредити; місячний ліміт $10; автопоповнення вимкнене | Модель **Claude Haiku 5.5**, що відповідає в чаті | Оплата за використання (~$0.0003–0.0005 за повідомлення) |
| **Firebase** — проєкт `leren-be` (тариф Spark) | gembarsky.d@gmail.com | Authentication (Google, Email link; домени lerenbe.com, www.lerenbe.com); Firestore `subs`, `users`; правила = `firestore.rules` | Акаунти, синхронізація прогресу й пам'яті AI, підписки на нагадування | Безкоштовно (Spark) |
| **Google Play Console** | розробника | Застосунок **be.leren.app** (TWA-обгортка сайту); App signing | Публікація в Google Play; сторінка й форми — `store/store-listing.md` | Разовий внесок розробника |
| **Digital Asset Links** | — | `.well-known/assetlinks.json` на lerenbe.com | Дозволяє застосунку з Play відкривати сайт без адресного рядка | — |
| **Microsoft Azure** — ресурс Speech `leren-be-speech` | особистий акаунт | Група ресурсів `leren-be`, регіон North Europe, тариф Free F0; KEY 1 | Лише для запису озвучення голосом **Arnaud** (`tools/run-azure.sh`); сайт до Azure не звертається | Безкоштовно (F0) |
| **gstatic.com** (Google) | — | Firebase JS SDK 10.12.2 | Завантажується лише при вході в акаунт | — |
| **Perplexity** (лише для розробки) | — | `.mcp.json`, ключ у змінній `PERPLEXITY_API_KEY` | Пошук для AI-помічника під час розробки; на сайт не впливає | — |

## Секрети: де зберігаються

| Секрет | Де живе | Як оновити |
|---|---|---|
| `ANTHROPIC_KEY` | Cloudflare → leren-ai → Settings → Variables and Secrets (тип **Secret**) | Новий ключ в Anthropic Console → замінити Secret → Deploy |
| `CLOUDFLARE_API_TOKEN` | GitHub → Settings → Secrets and variables → Actions | Cloudflare → My Profile → API Tokens → шаблон «Edit Cloudflare Workers» |
| `FIREBASE_SA` (service account JSON) | GitHub → Settings → Secrets and variables → Actions | Firebase → Project settings → Service accounts → Generate new key |
| `VAPID_PUBLIC` / `VAPID_PRIVATE` | GitHub Actions secrets (публічний також у `index.html`) | Нову пару генерувати лише разом зі скиданням усіх підписок |
| Ключ Azure Speech | Azure → leren-be-speech → Keys and Endpoint (лише вводиться в Термінал) | Regenerate Key1 |
| Ключ підпису Android | Google Play App Signing + локальний keystore (див. `LOCAL-FILES.md`) | Втрата upload-ключа → запит на скидання в Play Console |

## Як оновлювати

| Що змінилося | Що зробити |
|---|---|
| Сайт (`index.html`, `privacy.html`, аудіо, словник) | Коміт у `main` → push; **підняти `CACHE_NAME` у `sw.js`**; GitHub Pages збирає 1–5 хв |
| Сервер AI (`tools/ai-worker.js`, `wrangler.toml`) | **Автоматично:** push у `main` → GitHub Actions «Deploy AI worker» (`.github/workflows/deploy-worker.yml`) → Cloudflare. Піднімай `WORKER_VERSION` у коді: після деплою вона видна в заголовку `X-Leren-AI`. Запасний ручний шлях — у `LAUNCH.md` |
| Правила Firestore (`firestore.rules`) | Firebase → Firestore Database → Rules → вставити → Publish |
| Озвучення | `bash tools/run-azure.sh` (Arnaud) → коміт `audio/nl` → підняти кеш |
| Сторінка в Google Play | Тексти й відповіді — `store/store-listing.md`; графіка — `store/`, `screenshots/` |

Детальніше: запуск і план відкату AI — `LAUNCH.md`; дизайн — `DESIGN.md`; рівні — `LEVELS.md`; загальний опис — `README.md`.
