# Кіт-учень Leren.be · TEST-007

- Файл: `img/mascot/student-cat-v1.png`.
- Створено 25.10.2026 вбудованим інструментом **imagegen**, без CLI/API-ключа.
- Референс ідентичності: чинний `icon-512.png`; вихідну іконку не замінено.
- Обрана ілюстрація: PNG RGBA 1536×1024, 3 стовпці × 2 рядки; 2 073 047 байтів.
- Шість клітинок 512×512: welcome, study, think / happy, encourage, gift.
- UI показує клітинки через CSS background-position; PNG-листівка використовує відповідний прямокутник джерела в canvas. Сам файл не обрізався й не перемальовувався поза imagegen.
- Альфа-канал перевірено читанням PNG: 764 388 повністю прозорих пікселів. Додатково перевірено реальний вигляд на білому фоні сторінки.
- Фінальний оригінал imagegen: `/Users/danylohembarskyi/.codex/generated_images/01a164dd-6397-7290-8b93-aac6696e865c/exec-36f1b096-a0ca-429e-b2c2-846a63a4ec67.png`.
- Подарунки в `modules/rewards/gifts.js` — власні SVG, продовження попередньої векторної системи нагород; не сторонні картинки.

## Prompt 1 · generation with identity reference

Use case: stylized-concept. Asset type: one production sprite atlas for an educational website, 3 columns by 2 rows, landscape aspect ratio 3:2. Reference image: identity and rendering style ONLY for our existing orange Ukrainian student cat mascot, not an edit target. Create exactly SIX separate poses of that SAME lovable orange cat, soft high-quality dimensional 3D clay/plush rendering, round body, black shiny eyes, tiny orange nose, pink inner ears, tiny paws, same identity/proportions. Make the cat visibly the STUDENT learning Dutch, not a human teacher. Small blue-and-yellow Ukrainian scarf on every pose, subtle and tasteful. TRUE transparent background everywhere outside the six cat cutouts, no gradients/background panels. Exact equal 3x2 grid, each cat centered inside its own equal square cell with generous 15% transparent padding; never overlap cells, no labels, no text, no border. TOP LEFT: warmly welcoming, one paw waving, blue Dutch notebook tucked under other paw. TOP MIDDLE: studying the open book with blue-yellow and black-yellow-red flags matching reference, looking at reader above pages. TOP RIGHT: thinking with small paw on cheek, patient curious expression, no sad/shaming expression. BOTTOM LEFT: happy celebrating, both paws raised and small golden star near paw. BOTTOM MIDDLE: gently encouraging after a mistake, friendly smile, pointing towards reader, small softly curved encouraging gesture; NOT sad or crying. BOTTOM RIGHT: proudly holding a wrapped turquoise present with golden ribbon, delighted. All six full-body including ears and feet fully visible. Consistent camera frontal three-quarter view and soft studio lighting, finely detailed velvety orange fur/material, clean alpha edges, readable at 100px. No humans, no Peter/Dafna, no trophy collection, no extra characters, no watermarks. This is one cohesive sprite-atlas asset. Desired canvas 1536x1024 pixels.

## Prompt 2 · final transparent-background pass

Use case: background-extraction. Edit target: the provided six-pose orange cat sprite atlas. REMOVE ALL colored background, all brown/orange gradients and all colored glow/halos between and around the cats. Make every pixel outside the six character cutouts genuinely TRANSPARENT (alpha 0). Preserve the six cats, their faces, bodies, scarves, accessories, star and gift EXACTLY. Preserve the original 1536x1024 canvas size, exact 3x2 grid and exact location and size of all poses. Do not crop, move or scale the cats, do not add panels, frames or any backdrop. No background color at all. Transparent sprite atlas cutouts only, clean edges. Keep the same six poses and identity; the ONLY change is removing the background and colored glows.
