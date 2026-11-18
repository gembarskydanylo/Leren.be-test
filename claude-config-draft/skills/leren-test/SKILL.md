---
name: leren-test
description: Прогін тестів LerenBe з мінімальним виводом — цільові тести за підрядком або повна регресія з лабораторією. Використовуй після змін коду замість ручного запуску tests/*.cjs.
allowed-tools: Bash(bash claude-config-draft/scripts/suite.sh:*), Bash(node tests/*), Bash(git status:*), Read
---
1. Цільово: `bash claude-config-draft/scripts/suite.sh <підрядок>` (напр. `lexi`, `sw-`, `life`).
2. Повна регресія (лише наприкінці, один раз): `bash claude-config-draft/scripts/suite.sh --lab` у фоні (`run_in_background`), ~10 хв.
3. При провалі читай тільки хвіст, який друкує скрипт; повний лог — `tail -40 <logs>/<name>.log`, не весь.
4. Не перезапускай увесь набір після виправлення одного тесту — спершу цей тест окремо.
5. Не змінюй тести, щоб приховати помилку. Після прогону `git status --short` — лишні зміни в `screenshots/` повідом, не відкочуй інше.

Результат:
```
Тести: ok=N fail=M [назви]
Лабораторія: audit/interactions/gallery/contract PASS|FAIL
Причина провалів: <1 рядок на тест>
Не перевірено: <телефон / реальний AI / TalkBack…>
```
