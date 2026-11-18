#!/usr/bin/env python3
"""Наближена симуляція prefix-правил Bash(...) (розбиття на && || ; |, без env-префіксів) + порівняння з чернеткою guard.py.
Команди НЕ виконуються. Справжній матчинг Claude Code може відрізнятися — це оцінка покриття, не доказ."""
import json,re,subprocess,sys,os
H=os.path.dirname(os.path.abspath(__file__))
P=json.load(open(H+'/settings.permissions.draft.json'))['permissions']
rules={k:[r[5:-3] if r.endswith(':*)') else r[5:-1] for r in P[k] if r.startswith('Bash(')] for k in('deny','ask')}
def sim(cmd):
    res='allow'
    for seg in re.split(r'&&|\|\||;|\|',cmd):
        s=re.sub(r'^\s*(\w+=\S*\s+)*','',seg).strip()
        for k in('deny','ask'):
            if any(s==p or s.startswith(p+' ') or s.startswith(p) and p.endswith(' ') for p in rules[k]):
                if k=='deny':return 'deny'
                res='ask'
    return res
def guard(cmd):
    r=subprocess.run([sys.executable,H+'/../hooks/guard.py'],input=json.dumps({'tool_name':'Bash','tool_input':{'command':cmd},'cwd':'/private/tmp/leren-test-036'}),capture_output=True,text=True)
    return json.loads(r.stdout)['hookSpecificOutput']['permissionDecision'] if r.stdout.strip() else 'allow'
cases=[
 'npx firebase deploy --only hosting','firebase deploy','npx --yes wrangler@4 deploy','npx wrangler@4 deploy -c tools/lexi-test-worker.toml',
 'npx wrangler@4 secret put ANTHROPIC_KEY -c tools/lexi-test-worker.toml','CLOUDFLARE_API_TOKEN=x npx wrangler@4 deploy',
 'git status && npx wrangler@4 deploy','bash -c "npx wrangler@4 deploy"','sh -c \'firebase deploy\'','eval "git push -f origin x"',
 'echo deploy | xargs npx wrangler@4','/usr/local/bin/npx wrangler@4 deploy','python3 -c "import os;os.system(\'firebase deploy\')"',
 'node -e "require(\'child_process\').execSync(\'wrangler deploy\')"','bash ./deploy.sh','npm run deploy',
 'git push --force origin x','git push origin HEAD:main','git -C /tmp/r push origin main','gh pr merge 21 --squash','gh workflow run site-preview.yml',
 'gh api -X POST repos/o/r/actions/workflows/x/dispatches','curl -X POST https://api.cloudflare.com/client/v4/accounts',
 'git status','node tests/sw-upgrade.cjs','bash tools/claude/suite.sh sw-','git push -u origin claude/test-036-cc-optimization']
print(f'{"команда":62} prefix  guard')
for c in cases:print(f'{c[:62]:62} {sim(c):7} {guard(c)}')
