# TEST-035 — аудит 3D-середовища, 2026-11-18

## Стан і межі

Worktree `/private/tmp/leren-test-035`, гілка `codex/test-035-living-lexi-3d`, база `claude/test-032-lexi-integration`. До аудиту в worktree вже були незакомічені зміни моделі/рендерів від попереднього етапу: їх збережено; під час аудиту модель не перероблялась, додаткові пакети/MCP не встановлювались. Наступна робота із зовнішністю чекає рішення власника.

## Встановлено та перевірено

- MacBook Pro Apple M1, 8 GB RAM, macOS 26.3, arm64.
- Blender 4.1.1: `/Applications/Blender.app/Contents/MacOS/Blender`. `bpy` працює **у вбудованому Blender Python 3.11.7**; `/usr/bin/python3` не має `bpy`. Використано `--factory-startup --python-exit-code 1`, не змінюючи користувацькі налаштування.
- На тестовому об'єкті ввімкнено SCULPT mode, створено SUBSURF modifier, матеріал із синтетичною текстурою, Basis/Smile shape keys і анімацію. Експорт у GLB 2.0 дав 1 material, 1 image, 1 animation і 1 morph-target primitive. Повторний import у чистий Blender знайшов 2 shape keys, image texture, material та animation action. Тестовий файл `/private/tmp/test035-audit/probe.glb` — **не модель Lexi**.
- Cycles бачить Apple M1 GPU (8 cores) як пристрій METAL; реальний рендер на Metal, швидкість і витрати пам'яті не виміряні.
- Three.js 0.180.0 та GLTFLoader/OrbitControls/MIT license локально включені в TEST-035 viewer. Раніше завантаження цього GLB перевірене в Chromium.
- Node.js 24.22.1, npm 11.19.1, `uv` і `uvx` доступні.
- `@gltf-transform/cli` і `gltf-validator` не знайдено в PATH/Node resolution поточного worktree; повний обшук усього комп’ютера не проводився. npm registry відповів версіями `@gltf-transform/cli` 4.5.1 (Node >=20, MIT) і `gltf-validator` 2.0.0-dev.3.10 (Apache-2.0, development tag). Наявність у registry не означає, що пакети тут встановлено чи протестовано.

## Blender MCP: сумісність і ризики

- У доступному Codex tool inventory немає Blender MCP; `codex mcp list` показав `codex_app`, `computer-use`, `cua_repl`, `node_repl`. Аддону MCP у перевіреній директорії Blender 4.1 не виявлено; на стандартному TCP 9876 listener не виявлено. Це не доводить відсутність іншого нестандартного встановлення.
- Репозиторій проєкту описує Codex MCP registration, Blender addon та вимоги Blender >=3.0 / Python >=3.10 / uv, які за версіями виконуються. **Живого з'єднання або сумісності конкретного addon/server на цьому комп’ютері не перевірено.** Проєкт сторонній, не Blender Foundation.
- Upstream прямо повідомляє: сокет без authentication/encryption, а tool може виконувати Python. Відкритий issue #404 описує проблему для 1.6.0; це не доводить автоматично конкретний стан версії 2.3.1. Поточний upstream README також попереджає про відсутність автентифікації. Доступ до порту іншого локального процесу та виконання коду з правами Blender — суттєвий ризик. Safe mode не слід вважати повноцінною OS-пісочницею або заміною перевірки доступу до сокета.
- Upstream описує мінімальну телеметрію за замовчуванням; `DISABLE_TELEMETRY=true` її вимикає. Ніяка телеметрія цього сервера тут не запускалась.
- Сам Git worktree не ізолює конфіг Codex, Blender preferences, локальний сокет чи доступ Blender до файлів. Команда `codex mcp add` редагує спільний конфіг. Якщо власник надалі обере MCP: незалежний review закріпленої версії та залежностей, тільки localhost, safe mode і telemetry off, окрема Blender user-scripts директорія/резервні копії, без LAN bind; після цього окремий тест сумісності. Навіть так не гарантується повна ізоляція від інших локальних процесів.

## Запропоновані команди — НЕ ЗАПУСКАЛИСЯ

Після дозволу власника можна поставити лише інструменти для аналізу GLB в окремий тимчасовий каталог (без глобальної інсталяції, production і Git repo node_modules):

```sh
npm install --prefix /private/tmp/leren-test-035-tools --save-dev --package-lock @gltf-transform/cli@4.5.1 gltf-validator@2.0.0-dev.3.10
npm audit --prefix /private/tmp/leren-test-035-tools
/private/tmp/leren-test-035-tools/node_modules/.bin/gltf-transform inspect /private/tmp/leren-test-035/design-lab/test-035-lexi-3d/assets/lexi-prototype.glb
```

Це завантажує сторонні пакети й залежності та може виконувати npm lifecycle scripts; перед запуском переглянути lockfile/dependency tree та аудит безпеки. Тимчасовий каталог може зникнути після очищення `/private/tmp`. Ніякі результати оптимізації не можна вважати безпечними без повторної валідації morph targets, текстур, матеріалів та тестів на фізичному телефоні.

Як **умовний варіант**, не рекомендація встановити зараз, upstream MCP можна налаштувати так після дозволу та повного огляду пакета `mcp-for-blender==2.3.1`:

```sh
DISABLE_TELEMETRY=true uvx --from mcp-for-blender==2.3.1 mcp-for-blender install-addon
codex mcp add blender --env BLENDER_MCP_SAFE_MODE=1 --env DISABLE_TELEMETRY=true --env BLENDER_HOST=127.0.0.1 -- uvx --from mcp-for-blender==2.3.1 mcp-for-blender
```

Перша команда записує addon до користувацького Blender-профілю, друга змінює **спільну** конфігурацію Codex. Потім addon потрібно увімкнути у Blender і перезапустити Codex; це не ізольовано лише worktree. Команди наведено за upstream, але конкретну версію не встановлено/не запущено й не перевірено. Не виконувати без окремого рішення власника.

## Висновок

Для художнього результату вирішальні ручний скульпт/retopology/UV/material authoring і досвід 3D-художника; MCP лише механізм керування, а glTF Transform/Validator перевіряють/оптимізують готовий asset. Підходять текстурні fur cards/запечені карти з полігонним бюджетом; Blender procedural hair/складні shader graphs не слід автоматично вважати сумісними з WebGL. У документації Blender glTF для анімації прямо підтримані transform, pose bones і shape key values; physics/material animation потребують окремого вирішення.

8 GB спільної пам'яті обмежують складність сцени і розмір текстур. Samsung/Safari FPS, реальна мобільна пам'ять, інтерактивний sculpt у UI, великий asset та повний facial rig не перевірялися. Неможливо гарантувати роботу ще не встановлених інструментів чи premium-якість лише перевіркою API.

Джерела: https://github.com/ahujasid/mcp-for-blender ; https://github.com/ahujasid/mcp-for-blender/issues/404 ; https://gltf-transform.dev/cli ; https://github.com/KhronosGroup/glTF-Validator/blob/main/node/README.md ; https://docs.blender.org/manual/en/4.0/addons/import_export/scene_gltf2.html

## Встановлення за дозволом власника

Встановлено `@gltf-transform/cli@4.5.1` і `gltf-validator@2.0.0-dev.3.10` у `/private/tmp/leren-test-035-tools`, локально для TEST-035. `gltf-transform inspect` на синтетичному `probe.glb` успішний; Khronos Validator: 0 errors, 0 warnings, 0 infos, 0 hints на цьому тестовому файлі. Це не перевірка самої моделі Lexi. `npm audit` повідомив 4 moderate (через @gltf-transform/cli, @donmccurdy/caporal, glob, minimatch), 0 high/critical; npm також попередив про застарілий glob. До усунення обмежити обробку довіреними локальними файлами. Повний audit JSON збережений у `/private/tmp/test035-audit/npm-audit.json`.

Blender MCP не встановлено: для поточного етапу працюючого bpy достатньо, а сокет MCP потребує окремої перевірки безпеки. Модель Lexi під час інсталяції не змінювалася; робота над нею залишається призупиненою.
