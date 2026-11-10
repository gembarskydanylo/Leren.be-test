# LerenBe LIFE — завдання для художника (ART_REQUEST)

Мета: професійна графіка для інтерактивних історій LerenBe LIFE. Застосунок уже готовий: файли треба лише покласти за точними шляхами нижче й вписати шлях у `visual-manifest.json` замість `null`. Поки файлу немає, застосунок показує запасний вигляд — тож графіку можна передавати частинами.

## Стиль (для всіх файлів)
- Напівреалістична 2D-ілюстрація; тепле кінематографічне освітлення.
- Сучасна Бельгія (Гент і Фландрія): реалістична архітектура, вивіски без читабельного тексту.
- **Без тексту всередині ілюстрацій** (написи, субтитри, логотипи — їх додає інтерфейс).
- Єдина стилістика й масштаб усіх персонажів; ті самі обличчя, одяг і пропорції в усіх емоціях і сценах.
- Референси (лише для стилю, не підставляти як готові файли): `reference/visual-style-and-cast.webp`, `reference/character-sheet-man-backpack.webp`, `reference/ui-mockup-dashboard.webp`.

## Формати й розміри
| Що | Розмір | Формат | Примітки |
|---|---|---|---|
| Фон сцени ПК | 1920×1320 | WebP | ≤ 400 КБ |
| Фон сцени телефон | 1200×900 | WebP | ≤ 250 КБ |
| Персонаж у повний зріст | висота 1600 px | WebP з прозорістю (PNG — якщо WebP з альфою недоступний) | ноги внизу кадру, без тіні на підлозі, той самий масштаб для всіх емоцій |
| Портрет | 512×512 | WebP | обличчя по центру, прозорий або однотонний фон |
| Обкладинка історії ПК | 1600×900 | WebP | |
| Обкладинка історії телефон | 1080×1080 | WebP | |

- **Фони без персонажів**: персонажі — окремі шари поверх фону (у маніфесті `backgroundHasCharacters: false`).
- **Місце для діалогу**: нижні ~32 % кадру фону лишити спокійними (підлога, тротуар) — там вікно репліки. Головне — у верхніх двох третинах.
- Головна героїня стоїть **ліворуч**, співрозмовник — **праворуч**: композиція фону має лишати місце обабіч.
- Кожна емоція — **окремий файл**. Аркуші-колажі не ріжуться автоматично.

## Персонажі (7)
Для кожного — 8 файлів у `characters/<id>/`: `full-neutral.webp`, `full-happy.webp`, `full-thinking.webp`, `full-surprised.webp`, `portrait-neutral.webp`, `portrait-happy.webp`, `portrait-thinking.webp`, `portrait-surprised.webp`.

| id (папка) | Ім’я | Роль | Зовнішність |
|---|---|---|---|
| `anastasia` | Anastasia | головна героїня: приїхала до Бельгії, вчить нідерландську | 25–30 років, каштанове волосся, жовта куртка, наплічник; доброзичлива, допитлива, іноді невпевнена |
| `annick` | Annick | бельгійська наставниця, зустрічає Анастасію на вокзалі | близько 35 років, темно-русяве волосся, синя куртка; доброзичлива, терпляча |
| `jan` | Jan | сусід і майстер; знайомиться з Анастасією в історії «Перший день у Бельгії» | 35–40 років, коротке волосся, повсякденний або робочий одяг |
| `peter` | Peter | старший сусід, власник будинку (ремонт, сад, паркан) | 55–60 років, сиве волосся, окуляри |
| `sofie` | Sofie | продавчиня (історії про покупки) | близько 30 років, доброзичлива, зелений робочий фартух |
| `van-den-berg` | Dr. Van den Berg | лікарка (лікар, здоров’я, аптека) | 35–40 років, білий медичний халат; спокійна, уважна |
| `hero-male` | Male protagonist | альтернативний головний герой для майбутнього вибору героя (поки не використовується в сюжеті) | чоловік із наплічником з третього референс-аркуша: зелена куртка, темні штани-карго, черевики |

Пріоритет: 1) `anastasia`, `annick`, `jan` (перша історія); 2) `peter`, `sofie`, `van-den-berg`; 3) `hero-male` (майбутній вибір героя, у сюжеті поки не використовується).

## Історія «Перший день у Бельгії» (`stories/first-day/`)
Для кожної сцени — два фони: `<сцена>-desktop.webp` (1920×1320) і `<сцена>-mobile.webp` (1200×900). Обкладинка: `cover-desktop.webp` (1600×900), `cover-mobile.webp` (1080×1080).

| Сцена | Фон (що намалювати, без персонажів) | Персонажі-шари й емоції в сцені |
|---|---|---|
| `station` | Вокзал Gent-Sint-Pieters: перон/хол, табло, ранкове світло | anastasia (left), annick (right); емоції змінюються під час діалогу (усі 4) |
| `machine` | Трамвайна зупинка біля вокзалу з автоматом квитків (без читабельного тексту на екрані) | anastasia (left), annick (right); емоції змінюються під час діалогу (усі 4) |
| `meet` | Привокзальна площа Гента, трамвайні колії, будинки | anastasia (left), annick (right); емоції змінюються під час діалогу (усі 4) |
| `tram` | Салон трамвая De Lijn, вікна з видом на центр Гента | anastasia (left), annick (right); емоції змінюються під час діалогу (усі 4) |
| `flat` | Невелика квартира: ліжко, вікно, радіатор, стіл із ключами (речі, які шукає учень) | anastasia (left), annick (right); емоції змінюються під час діалогу (усі 4) |
| `neighbour` | Сходовий майданчик старого будинку, двері сусідньої квартири | anastasia (left), jan (right); емоції змінюються під час діалогу (усі 4) |
| `tomorrow` | Та сама квартира ввечері, тепле світло лампи | anastasia (left), annick (right); емоції змінюються під час діалогу (усі 4) |

## Інші історії (пізніше)
- `stories/supermarket/`: обкладинка + фони 6 сцен (`list`, `shelves`, `help`, `counter`, `till`, `home`) — **після рішення щодо персонажів** (див. «Конфлікти»).
- `stories/commune/`, `stories/fence/`, `stories/doctor/`: обкладинки; сцени — коли буде сценарій.

## Точний список файлів для першої черги (40)

- `assets/lerenbe-life/characters/anastasia/full-neutral.webp`
- `assets/lerenbe-life/characters/anastasia/full-happy.webp`
- `assets/lerenbe-life/characters/anastasia/full-thinking.webp`
- `assets/lerenbe-life/characters/anastasia/full-surprised.webp`
- `assets/lerenbe-life/characters/anastasia/portrait-neutral.webp`
- `assets/lerenbe-life/characters/anastasia/portrait-happy.webp`
- `assets/lerenbe-life/characters/anastasia/portrait-thinking.webp`
- `assets/lerenbe-life/characters/anastasia/portrait-surprised.webp`
- `assets/lerenbe-life/characters/annick/full-neutral.webp`
- `assets/lerenbe-life/characters/annick/full-happy.webp`
- `assets/lerenbe-life/characters/annick/full-thinking.webp`
- `assets/lerenbe-life/characters/annick/full-surprised.webp`
- `assets/lerenbe-life/characters/annick/portrait-neutral.webp`
- `assets/lerenbe-life/characters/annick/portrait-happy.webp`
- `assets/lerenbe-life/characters/annick/portrait-thinking.webp`
- `assets/lerenbe-life/characters/annick/portrait-surprised.webp`
- `assets/lerenbe-life/characters/jan/full-neutral.webp`
- `assets/lerenbe-life/characters/jan/full-happy.webp`
- `assets/lerenbe-life/characters/jan/full-thinking.webp`
- `assets/lerenbe-life/characters/jan/full-surprised.webp`
- `assets/lerenbe-life/characters/jan/portrait-neutral.webp`
- `assets/lerenbe-life/characters/jan/portrait-happy.webp`
- `assets/lerenbe-life/characters/jan/portrait-thinking.webp`
- `assets/lerenbe-life/characters/jan/portrait-surprised.webp`
- `assets/lerenbe-life/stories/first-day/station-desktop.webp`
- `assets/lerenbe-life/stories/first-day/station-mobile.webp`
- `assets/lerenbe-life/stories/first-day/machine-desktop.webp`
- `assets/lerenbe-life/stories/first-day/machine-mobile.webp`
- `assets/lerenbe-life/stories/first-day/meet-desktop.webp`
- `assets/lerenbe-life/stories/first-day/meet-mobile.webp`
- `assets/lerenbe-life/stories/first-day/tram-desktop.webp`
- `assets/lerenbe-life/stories/first-day/tram-mobile.webp`
- `assets/lerenbe-life/stories/first-day/flat-desktop.webp`
- `assets/lerenbe-life/stories/first-day/flat-mobile.webp`
- `assets/lerenbe-life/stories/first-day/neighbour-desktop.webp`
- `assets/lerenbe-life/stories/first-day/neighbour-mobile.webp`
- `assets/lerenbe-life/stories/first-day/tomorrow-desktop.webp`
- `assets/lerenbe-life/stories/first-day/tomorrow-mobile.webp`
- `assets/lerenbe-life/stories/first-day/cover-desktop.webp`
- `assets/lerenbe-life/stories/first-day/cover-mobile.webp`
- (+ `alt` у маніфесті, якщо намальоване відрізняється від опису)

## Друга черга (32 файли)
- `peter`, `sofie`, `van-den-berg`, `hero-male`: по 8 файлів (`full-*`, `portrait-*`, 4 емоції).

## Конфлікти й відкриті питання
- **Супермаркет:** чернетка сценарію (у production, не опублікована) має працівника **Tom** і касирку **Lien**; затверджена продавчиня — **Sofie**. Автоматично не замінено. Варіанти: Sofie замість Lien (касирка), Tom лишається; або Sofie замінює обох. Потрібне рішення до малювання сцен супермаркету.
- **Peter** у production-застосунку — ще й ім’я AI-співрозмовника з основного курсу (картинки `img/chars/peter*.webp`). Для LIFE це інший персонаж (старший сусід) — варто переконатися, що зовнішність не плутатиметься, або перейменувати одного з них.
- **Анастасія** замінила «Олену» в тестовій версії; у production перша історія ще каже «Ben jij Olena?» — перенесення разом із візуальною системою (і новими записами голосу).

