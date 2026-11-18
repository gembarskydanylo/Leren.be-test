#!/bin/bash
# Фікстурні тести guard.py: подає JSON подій у stdin; жодна команда з фікстур не виконується.
H=$(cd "$(dirname "$0")/.." && pwd); T=$(mktemp -d "${TMPDIR:-/tmp}/guardfx.XXXX")
mk(){ git init -q "$1" && git -C "$1" -c user.email=t@t -c user.name=t commit -q --allow-empty -m i; }
mk $T/locked; echo "codex TEST-035" > $T/locked/.agent-lock
mk $T/claudelock; echo "claude TEST-036" > $T/claudelock/.agent-lock
mk $T/codex; git -C $T/codex checkout -q -b codex/demo; echo a>$T/codex/dirty.txt; echo a>$T/codex/clean.txt
git -C $T/codex add . && git -C $T/codex -c user.email=t@t -c user.name=t commit -qm f; echo b>>$T/codex/dirty.txt
# репозиторії для bare push: на main і на feature-гілці
mk $T/mainrepo; git -C $T/mainrepo branch -q -M main
mk $T/featrepo; git -C $T/featrepo checkout -q -b claude/feature
# скрипти-фікстури: лише текст, ніколи не виконуються
S=$T/scripts; mkdir -p $S
printf '#!/bin/bash\nset -e\nnpx --yes wrangler@4 deploy\n' > $S/deploy.sh
printf 'import os\nos.system("firebase deploy --only hosting")\n' > $S/deploy.py
printf 'require("child_process").execSync("gh workflow run site-preview.yml")\n' > $S/deploy.cjs
printf '#!/bin/bash\nnpx wrangler@4 deploy -c tools/lexi-test-worker.toml\n' > $S/testworker.sh
printf '#!/bin/bash\necho ok\nnode tests/sw-upgrade.cjs\n' > $S/safe.sh
printf 'console.log("ok")\n' > $S/safe.cjs
printf '{"scripts":{"deploy":"firebase deploy","test":"node tests/x.cjs"}}\n' > $S/package.json
python3 -I - "$H" "$T" <<'PY'
import json,subprocess,sys
H,T=sys.argv[1],sys.argv[2]; ok=bad=0
for tool,arg,cwd,exp in json.load(open(H+'/fixtures/cases.json')):
    arg=arg.replace('{LOCKED}',T+'/locked').replace('{CLAUDELOCK}',T+'/claudelock').replace('{CODEX}',T+'/codex').replace('{S}',T+'/scripts').replace('{MAIN}',T+'/mainrepo').replace('{FEAT}',T+'/featrepo')
    cwd=cwd.replace('{S}',T+'/scripts').replace('{MAIN}',T+'/mainrepo').replace('{FEAT}',T+'/featrepo')
    inp={'command':arg} if tool=='Bash' else {'file_path':arg}
    r=subprocess.run(['python3',H+'/guard.py'],input=json.dumps({'tool_name':tool,'tool_input':inp,'cwd':cwd,'hook_event_name':'PreToolUse'}),capture_output=True,text=True)
    got=json.loads(r.stdout)['hookSpecificOutput']['permissionDecision'] if r.stdout.strip() else 'allow'
    if r.returncode or got!=exp: bad+=1; print(f'FAIL {tool} {arg[:70]!r} cwd={cwd} expected={exp} got={got} rc={r.returncode} {r.stderr[-200:]}')
    else: ok+=1
print(f'guard fixtures ok={ok} fail={bad}'); sys.exit(1 if bad else 0)
PY
rc=$?; rm -rf "$T"; exit $rc
