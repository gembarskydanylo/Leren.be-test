# app/ — знімок production LerenBe з новою головною (TEST-016)

- Основа: `gembarskydanylo/Leren.be` main `34add48` (release 225): увесь застосунок (курси, маршрут, ігри, тести, LIFE, Engine 2.0, курс-плеєр), **без** Telegram-пакета, тестів, інструментів і документації.
- Аудіо: лише англійський і французький курси (`audio/en`, `audio/fr`) і 60 фраз історії LIFE обома голосами (`audio/nl`, `audio/nl-f`). Основний нідерландський курс у знімку звучить голосом пристрою (усі 6 417 записів — лише в production).
- **Ізоляція:** CSP знімка `connect-src 'self'`, без gstatic / Google / AI-воркера / аналітики — Firebase, вхід, синхронізація, нагадування й AI-чат тут не працюють і не можуть торкнутися production-даних. `noindex`.
- **Нова головна:** `modules/home-v2/` (+ виклик у `modules/learning-path/ui.js`, `hero()`), зображення — `img/home/home-visuals.json`.
- Перегляд після злиття: https://gembarskydanylo.github.io/Leren.be-test/app/
