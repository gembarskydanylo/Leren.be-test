# TEST-027 — LIFE: ресурси й точні завдання художнику

17 листопада 2026. Перевірено **фактичні файли**, `life/assets/lerenbe-life/visual-manifest.json`, `ART_REQUEST.md`, `app/img/home/home-visuals.json` і сцени `first-day.mjs` на TEST-025 `56b6ec2`.

## Що є і чого немає

- Затверджені HERO A/C існують: `app/img/home/home-hero-mobile.webp` 1280×800, `home-hero-desktop.webp` 1920×1080. Наявний котик: `app/img/home/hero-cat-v196-320.webp` 320×320. Не змінені.
- У `life/assets/lerenbe-life/` поза `reference/` **немає runtime PNG/WebP/JPG/AVIF**: лише `.gitkeep`, маніфести й документи. Референси — не сцени й не окремі sprites; їх не нарізали й не видавали за готові ресурси.
- Маніфест має 7 персонажів і 13 описаних сцен (7 first-day, 6 supermarket); відповідні image slots `null`.
- [Повний CSV](missing-assets.csv): **94 відсутні очікувані файли**. Це не 94 поточні HTTP 404: більшість слотів `null`, тому renderer показує fallback. Цільові назви взято з існуючого ART_REQUEST, де можливо; решта дотримуються тієї самої домовленості.

| Пріоритет | Кількість | Призначення |
|---|---:|---|
| P0: перша опублікована історія | 40 | Anastasia/Annick/Jan × 8 sprites = 24; 7 сцен × 2 фони = 14; 2 обкладинки |
| P1: промо головної | 2 | `app/img/home/life-promo-mobile.webp`, `life-promo-desktop.webp` |
| P2: майбутні персонажі | 32 | Peter/Sofie/Van-den-Berg/hero-male × 8 |
| P2: неопубліковані історії | 20 | 6 supermarket-сцен × 2 + 4 історії × 2 обкладинки |

Не запитувати всі 94 як блокер першого релізу. P0 забезпечує лише вже наявний first-day; P2 не означає, що сценарії commune/doctor готові. У supermarket є відомий конфлікт Tom/Lien проти затвердженої Sofie: рішення про cast потрібне до виробництва, не підміняти персонажів автоматично.

## Формати й приймання

| Тип | Точний canvas | Формат / бюджет |
|---|---|---|
| Фон ПК | 1920×1320 | WebP, ≤400 КБ, без персонажів |
| Фон телефону | 1200×900 | WebP, ≤250 КБ; це поточний контракт ART_REQUEST, не новий затверджений portrait format |
| Повний персонаж | 900×1600 | WebP alpha, ≤350 КБ; запропонована фіксована ширина 900 уточнює стару вимогу «висота 1600», потребує art approval |
| Портрет | 512×512 | WebP alpha або однотонне тло, ≤100 КБ |
| Обкладинка ПК | 1600×900 | WebP, ≤300 КБ |
| Обкладинка телефону | 1080×1080 | WebP, ≤220 КБ |
| Home LIFE mobile / desktop | 960×540 / 1200×675 | WebP, ≤200 / 250 КБ |

Однаковий anchor/масштаб для емоцій: canvas 900×1600, стопи біля y=1530, центр тіла x=450; тінь під ногами не вбудована. Фони мають спокійні нижні ~32% під dialogue dock; персонажі — окремі шари. Зберігати обличчя у видимій області під час cover/crop. Для майбутньої повноекранної композиції B окремо затвердити portrait background variant; не змінювати розміри старого контракту мовчки.

## Стиль та незмінні ознаки

Тепла напівреалістична 2D-ілюстрація для дорослих. Сучасна Фландрія, правдоподібний одяг, руки й пропорції, м'яке ранкове світло, теплий жовтий і глибокий синій. Без тексту, логотипів, watermark, вбудованого UI, emoji й карикатурних великих голів. Не генерувати новий образ котика. HERO A/C — затверджений референс облич і одягу, не об'єкт для перезапису.

- **Anastasia:** 25–30, каштанове хвилясте волосся, жовта куртка, темний наплічник. Нейтральна, радіє, замислена, здивована.
- **Annick:** близько 35, темно-русяве/темно-каштанове волосся, синя куртка, приглушений бірюзовий шарф. Не перетворювати на блондинку emoji-fallback.
- **Jan:** 35–40, коротке волосся, повсякденний/робочий одяг; затвердити обличчя за наявними reference перед 8 sprites.

Для кожного P0 персонажа точні назви: `characters/<id>/full-neutral.webp`, `full-happy.webp`, `full-thinking.webp`, `full-surprised.webp`, `portrait-neutral.webp`, `portrait-happy.webp`, `portrait-thinking.webp`, `portrait-surprised.webp`. Префікс на диску — `life/assets/lerenbe-life/`.

## Окремі завдання для P0 фонів

Кожне завдання — **два окремі файли**, `stories/first-day/<id>-desktop.webp` і `<id>-mobile.webp`, у розмірах вище. Кожен фон без людей на передньому плані та без читабельних написів.

1. **station:** привітний історичний вокзальний простір Gent-Sint-Pieters, цегла/світлий камінь і скло, сучасний потяг у глибині. Місце зліва для Anastasia, справа Annick. Тепле ранкове світло. Не видавати ілюстрацію за архітектурну фотозйомку.
2. **machine:** трамвайна зупинка біля вокзалу, автомат квитків із нейтральним нерозбірливим екраном, впізнаваний громадський транспорт Фландрії; чисте місце для двох окремих персонажів.
3. **meet:** спокійна зона біля вокзалу, відкритий простір для знайомства; не дублювати station точно. Однаковий ранок, колір і масштаб перспективи.
4. **tram:** інтер'єр сучасного трамвая, великі вікна, міська Фландрія за ними; без людей на місці двох головних персонажів і без маршрутного тексту, який потребує перевірки.
5. **flat:** невелика світла бельгійська квартира, вхід/вікно/меблі, відчуття першого дня, не розкішний готель. Нижня частина проста для UI.
6. **neighbour:** сходовий майданчик квартири, двері сусіда; Anastasia зліва, Jan справа як окремі шари. Тепле побутове світло, без номерів квартири й персональних даних.
7. **tomorrow:** та сама квартира ввечері; Annick прощається до завтра. Узгодити геометрію кімнати з flat, змінити світло, а не створювати іншу квартиру.

**Обкладинки:** `stories/first-day/cover-desktop.webp` 1600×900 і `cover-mobile.webp` 1080×1080. Дві героїні біля вокзалу, дружня розмова, обличчя не обрізані, без тексту. Для home LIFE promo — власні 1200×675/960×540 crops, не довільна картинка міста.

## Самодостатні prompts для виробництва

**Background prompt:** “Semirealistic polished 2D editorial illustration for an adult language-learning story set in Flanders. [Insert the exact scene above]. Background only, no foreground people, no readable lettering, no interface, no logos. Keep left/right staging zones for two separate characters and bottom 32% calm for a dialogue overlay. Match the established warm Belgian story-world palette. Output the exact requested canvas, with clean perspective and plausible contemporary details.”

**Character prompt:** “One full-body character, [exact character description], [neutral/happy/thinking/surprised] expression. Adult realistic proportions, warm semirealistic 2D illustration, consistent face/hair/clothes with the approved reference, same pose scale and feet anchor as the other expressions. Exact 900×1600 transparent canvas, true alpha, no background, no ground shadow, no text or collage. One expression per file.”

**Portrait prompt:** “Head-and-shoulders portrait of [character], [expression], exact 512×512 canvas, same approved identity/clothing/color palette and lighting as the full-body sprite, centered face, true alpha or approved flat background, no lettering, no montage.”

Потрібні перевірки після генерації: обидві руки/пальці; однакова ідентичність; одяг; alpha; точні pixel dimensions; вага; обличчя при crop на 320/390/768/1440. Тільки після приймання вписувати paths замість `null` у manifest й перевіряти renderer. Цей етап manifest не змінює.

## Нова концепт-ілюстрація цього етапу

`design-lab/test-027/assets/station-concept-draft.png`, 1024×1536, близько 2.3 МБ, створено через imagegen. На ній фон і дві героїні **з'єднані**. Вона потрібна лише для порівняння композиції A/B/C й підписана в усіх LIFE-прототипах.

Вона **не** є готовим фоном без персонажів, не має окремих емоцій/alpha, не оптимізована під production, не затверджена на схожість чи архітектурну точність. Не включена в precache і не закриває жоден із 94 рядків CSV. Уся потрібна runtime-графіка чесно залишається missing.
