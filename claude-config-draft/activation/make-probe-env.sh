#!/bin/bash
# Створює ПОРОЖНІ тимчасові каталоги для живої перевірки guard. Нічого не чіпає в проєктах.
#   /private/tmp/leren-guard-probe         — «фальшивий production» (передається як LEREN_PROD_DIR)
#   /private/tmp/leren-guard-probe-codex   — git-репозиторій, гілка codex/demo, з незакоміченим файлом dirty.txt
#   /private/tmp/leren-guard-probe-locked  — git-репозиторій з .agent-lock від іншого агента
set -e
G="git -c user.email=t@t -c user.name=t"
mk(){ rm -rf "$1"; mkdir -p "$1"; git -C "$1" init -q; $G -C "$1" commit -q --allow-empty -m init; }
rm -rf /private/tmp/leren-guard-probe; mkdir -p /private/tmp/leren-guard-probe; git -C /private/tmp/leren-guard-probe init -q
mk /private/tmp/leren-guard-probe-codex; git -C /private/tmp/leren-guard-probe-codex checkout -q -b codex/demo
echo a > /private/tmp/leren-guard-probe-codex/dirty.txt; git -C /private/tmp/leren-guard-probe-codex add .; $G -C /private/tmp/leren-guard-probe-codex commit -qm f
echo b >> /private/tmp/leren-guard-probe-codex/dirty.txt
mk /private/tmp/leren-guard-probe-locked; echo "codex TEST-035" > /private/tmp/leren-guard-probe-locked/.agent-lock
echo "probe env ready"
