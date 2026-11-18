#!/bin/bash
# Прибирає лише тимчасові каталоги перевірки (жодного іншого шляху).
for d in /private/tmp/leren-guard-probe /private/tmp/leren-guard-probe-codex /private/tmp/leren-guard-probe-locked; do rm -rf "$d"; done; echo removed
