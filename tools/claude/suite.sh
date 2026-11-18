#!/bin/bash
# Тихий прогін тестів: лише підсумок + хвіст логів провалених. Нічого не відкочує, крім screenshots/test-030 (за --lab).
# usage: suite.sh [--lab] [pattern]   (pattern: підрядок імені тесту, напр. lexi)
set -u
ROOT=$(git rev-parse --show-toplevel) || exit 2; cd "$ROOT"
export NODE_PATH=${NODE_PATH:-$HOME/.cache/leren-audio/node_modules}
LOG=$(mktemp -d "${TMPDIR:-/tmp}/leren-suite.XXXX"); LAB=0; PAT=""
for a in "$@"; do [ "$a" = --lab ] && LAB=1 || PAT=$a; done
OK=0; BAD=()
for t in tests/*${PAT}*.cjs; do n=$(basename "$t" .cjs)
  if node "$t" >"$LOG/$n.log" 2>&1; then OK=$((OK+1)); else BAD+=("$n"); fi; done
echo "tests ok=$OK fail=${#BAD[@]} ${BAD[*]:-}"
for n in "${BAD[@]:-}"; do [ -n "$n" ] && { echo "--- $n (tail)"; tail -8 "$LOG/$n.log"; }; done
if [ $LAB = 1 ] && [ -d design-lab/test-030/checks ]; then
  python3 -m http.server 8279 --bind 127.0.0.1 >/dev/null 2>&1 & P=$!; sleep 1
  for c in audit interactions gallery; do node design-lab/test-030/checks/$c.cjs >"$LOG/lab-$c.log" 2>&1 && echo "lab $c PASS" || echo "lab $c FAIL"; done
  LEXI_LAB_URL=http://127.0.0.1:8279/design-lab/test-030/lexi/ node design-lab/test-030/checks/lexi-contract.cjs >"$LOG/lab-contract.log" 2>&1 && echo "lab contract PASS" || echo "lab contract FAIL"
  kill $P 2>/dev/null; git checkout -q -- screenshots/test-030 2>/dev/null
fi
echo "logs: $LOG"; [ ${#BAD[@]} = 0 ]
