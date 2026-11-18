#!/bin/bash
# Фікстурні тести guard.py: подає JSON подій у stdin; жодна команда з фікстур не виконується.
H=$(cd "$(dirname "$0")/.." && pwd); T=$(mktemp -d "${TMPDIR:-/tmp}/guardfx.XXXX")
mk(){ git init -q "$1" && git -C "$1" -c user.email=t@t -c user.name=t commit -q --allow-empty -m i; }
mk $T/locked; echo "codex TEST-035" > $T/locked/.agent-lock
mk $T/claudelock; echo "claude TEST-036" > $T/claudelock/.agent-lock
mk $T/codex; git -C $T/codex checkout -q -b codex/demo; echo a>$T/codex/dirty.txt; echo a>$T/codex/clean.txt
git -C $T/codex add . && git -C $T/codex -c user.email=t@t -c user.name=t commit -qm f; echo b>>$T/codex/dirty.txt
python3 -I - "$H" "$T" <<'PY'
import json,subprocess,sys
H,T=sys.argv[1],sys.argv[2]; ok=bad=0
for tool,arg,cwd,exp in json.load(open(H+'/fixtures/cases.json')):
    arg=arg.replace('{LOCKED}',T+'/locked').replace('{CLAUDELOCK}',T+'/claudelock').replace('{CODEX}',T+'/codex')
    inp={'command':arg} if tool=='Bash' else {'file_path':arg}
    r=subprocess.run(['python3',H+'/guard.py'],input=json.dumps({'tool_name':tool,'tool_input':inp,'cwd':cwd,'hook_event_name':'PreToolUse'}),capture_output=True,text=True)
    got=json.loads(r.stdout)['hookSpecificOutput']['permissionDecision'] if r.stdout.strip() else 'allow'
    if r.returncode or got!=exp: bad+=1; print(f'FAIL {tool} {arg[:70]!r} cwd={cwd} expected={exp} got={got} rc={r.returncode} {r.stderr[-200:]}')
    else: ok+=1
print(f'guard fixtures ok={ok} fail={bad}'); sys.exit(1 if bad else 0)
PY
rc=$?; rm -rf "$T"; exit $rc
