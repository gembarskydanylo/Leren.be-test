#!/usr/bin/env python3
"""PreToolUse guard для LerenBe. Читає JSON події зі stdin, нічого не виконує.
deny  -> exit 0 + permissionDecision=deny ; ask -> permissionDecision=ask ; інакше мовчки exit 0."""
import json, os, re, shlex, subprocess, sys

PROD = os.path.realpath(os.path.expanduser(os.environ.get('LEREN_PROD_DIR', '~/Documents/Leren.be')))

# git з будь-якими глобальними опціями: git -C <path> / -c k=v / --no-pager ... <підкоманда>
G = r'\bgit(?:\s+(?:-C\s+\S+|-c\s+\S+|--?[\w-]+(?:=\S+)?))*\s+'
# wrangler у будь-якій формі запуску: wrangler, wrangler@4, npx [--yes] wrangler@4, /abs/path/wrangler, bunx/pnpm dlx/npm exec/yarn
W = r'\bwrangler(?:@[\w.^~-]+)?\b'
SEP = r'[^|;&\n]*?'
TEST_WORKER = re.compile(r'(?:-c|--config)[\s=]+\S*lexi-test-worker\.toml\b')

DENY = [
    (G + r'push\b[^|;&\n]*(\s--force\b|\s-f\b|\s--force-with-lease\b|\s--mirror\b|\s\+\S)', 'force-push заборонено'),
    (G + r'push\b[^|;&\n]*\s(?:\S+\s+)?(?:\S*:)?(?:refs/heads/)?(main|master)(\s|$|[;&|])', 'push у main (публікує Pages) заборонено'),
    (G + r'push\b[^|;&\n]*github\.com[:/]gembarskydanylo/Leren\.be(\.git)?(\s|$)', 'push у production-репозиторій заборонено'),
    (r'\bfirebase(?:-tools)?(?:@[\w.^~-]+)?\b' + SEP + r'\s(deploy|hosting:\S+|database:\S+|firestore:\S+|functions:\S+)', 'Firebase deploy/зміни даних заборонені'),
    (W + SEP + r'\s(secret|delete|rollback|kv|r2|d1|pages\s+deploy|versions\s+(deploy|upload)|triggers\s+deploy)\b', 'зміна Worker/секретів/даних Cloudflare заборонена'),
    (r'\bgh\s+workflow\s+(run|enable)\b', 'запуск workflow (Pages/deploy) заборонено'),
    (r'\bgh\s+api\b' + SEP + r'(/dispatches\b|/merges?\b|/pulls/\d+/merge\b|/pages\b)', 'gh api: dispatch/merge/pages заборонено'),
    (r'\bgh\s+pr\s+merge\b[^|;&\n]*--admin', 'merge з --admin заборонено'),
    (r'\bgh\s+(release\s+create|secret|variable|repo\s+(edit|delete))\b', 'зміна релізів/секретів/репозиторію заборонена'),
    (r'\btools/play-listing\.mjs\b', 'публікація в Google Play заборонена'),
]
ASK = [
    (W + SEP + r'\s(deploy|publish)\b', 'deploy тестового Worker — лише з окремого дозволу власника'),
    (r'\bgh\s+pr\s+merge\b', 'злиття PR — потрібен дозвіл власника'),
    (r'\bgh\s+pr\s+ready\b', 'перевід PR з Draft'),
    (r'\bgh\s+api\b' + SEP + r'(-X|--method)\s*(POST|PUT|PATCH|DELETE)\b', 'gh api зі зміною даних'),
    (r'\bcurl\b' + SEP + r'(api\.cloudflare\.com|firebase|googleapis\.com)' , 'прямий виклик API Cloudflare/Firebase/Google'),
    (G + r'merge\b', 'git merge — перевір цільову гілку'),
    (G + r'reset\s+[^|;&\n]*--hard', 'reset --hard знищує незакомічені зміни'),
    (G + r'(checkout|restore)\s+[^|;&\n]*(--\s+\.|\s\.(\s|$)|--\s+(design-lab|docs|app)\b)', 'відкат робочих файлів'),
    (G + r'clean\s+-[a-zA-Z]*f', 'git clean видаляє невідстежувані файли'),
    (G + r'stash\s+(drop|clear|pop)\b', 'операція зі stash може втратити зміни'),
    (G + r'worktree\s+remove\b', 'видалення worktree'),
    (G + r'branch\s+-D\b', 'примусове видалення гілки'),
    (G + r'push\b[^|;&\n]*--delete', 'видалення віддаленої гілки'),
    (G + r'remote\s+(add|set-url)\b', 'зміна remote'),
    (r'\bgit\b[^|;&\n]*\bconfig\b(?![^|;&\n]*(--get|--list|\s-l\b|--show))[^|;&\n]*\bpush\.default\b|\bgit\b[^|;&\n]*\s-c\s+push\.default=(upstream|tracking|matching)\b|\bgit\b[^|;&\n]*\bbranch\b[^|;&\n]*(--set-upstream-to|-u)\b|\bgit\b[^|;&\n]*\bpush\b[^|;&\n]*(-u|--set-upstream)\s+\S+\s+\S*(main|master)\b', 'зміна push.default/upstream (ризик push у main)'),
    (r'\|\s*(?:\S*/)?(ba|z|da)?sh\b|\|\s*xargs\b[^|;&\n]*\b(ba|z)?sh\b|\bxargs\b[^|;&\n]*\b(git|gh|npx|wrangler|firebase)\b', 'передача даних у shell/xargs — вміст не перевірити'),
    (r'\brm\s+-[a-zA-Z]*r[a-zA-Z]*f?\b[^|;&\n]*(/private/tmp/leren-|scratchpad/(test|int|l\d+|lexi|q)\b)', 'видалення worktree-каталогу'),
]
# Вбудований код інтерпретаторів, що запускає процеси: вміст не можна надійно розібрати -> ask
INLINE = re.compile(r'\b(python3?|node|perl|ruby|osascript|deno|bun)\b[^|;&\n]*\s(-c|-e|--eval|-p|--print)\s.*(subprocess|os\.system|os\.exec|popen|child_process|execSync|spawn|exec\(|system\(|`)', re.S)
SCRIPT_EXT = ('.sh', '.bash', '.zsh', '.py', '.js', '.cjs', '.mjs', '.ts', '.pl', '.rb')

def out(decision, reason):
    print(json.dumps({'hookSpecificOutput': {'hookEventName': 'PreToolUse',
          'permissionDecision': decision, 'permissionDecisionReason': f'[leren-guard] {reason}'}}, ensure_ascii=False))
    sys.exit(0)

def in_prod(p, cwd):
    if not p: return False
    p = os.path.realpath(os.path.join(cwd, os.path.expanduser(p)))
    return p == PROD or p.startswith(PROD + os.sep)

def git(cwd, *a):
    try: return subprocess.run(['git', '-C', cwd, *a], capture_output=True, text=True, timeout=5).stdout.strip()
    except Exception: return ''


GIT_MUT = {'add','commit','push','reset','checkout','restore','clean','stash','merge','rebase','rm','mv','tag','branch','switch','cherry-pick','revert','am','apply','worktree','pull','fetch','gc','prune','config'}

def prod_write(cmd, cwd):
    """True, якщо команда змінює файли/git у production. Відстежує cd, git -C, редиректи."""
    cur = cwd
    for seg in re.split(r'&&|\|\||;|\||\n', cmd):
        for t in re.findall(r'(?:^|[^0-9&<])>>?\s*("[^"]+"|[^\s;&|]+)', seg):
            t = t.strip('"')
            if t != '/dev/null' and not t.startswith('&') and in_prod(t, cur): return True
        try: a = shlex.split(re.sub(r'\d?>>?\s*("[^"]+"|[^\s;&|]+)', ' ', seg))
        except ValueError: a = seg.split()
        while a and re.match(r'^\w+=', a[0]): a = a[1:]
        if not a: continue
        c = os.path.basename(a[0])
        if c == 'cd' and len(a) > 1:
            cur = os.path.realpath(os.path.join(cur, os.path.expanduser(a[1]))); continue
        if c == 'git':
            d, i = cur, 1
            while i < len(a) and a[i].startswith('-'):
                if a[i] == '-C' and i + 1 < len(a): d = os.path.join(d, os.path.expanduser(a[i+1])); i += 2
                else: i += 1
            sub = a[i] if i < len(a) else ''
            ro = sub == 'branch' and not any(x in a for x in ('-d','-D','-m','-M','--delete')) or sub == 'stash' and len(a) > i+1 and a[i+1] in ('list','show') or sub == 'worktree' and len(a) > i+1 and a[i+1] == 'list' or sub == 'config' and ('--get' in a or '-l' in a or '--list' in a)
            if sub in GIT_MUT and not ro and in_prod(d, '/'): return True
            continue
        args = [x for x in a[1:] if not x.startswith('-')]
        if c in ('rm','rmdir','tee','touch','truncate','chmod','unlink') and any(in_prod(x, cur) for x in args): return True
        if c in ('mv','cp','rsync','ln','install') and args and in_prod(args[-1], cur): return True
        if c == 'mv' and any(in_prod(x, cur) for x in args): return True
        if c in ('sed','perl') and any(x.startswith('-i') or x.startswith('-pi') for x in a[1:]) and any(in_prod(x, cur) for x in args[1:]): return True
    return False

READONLY = {'grep', 'egrep', 'fgrep', 'rg', 'cat', 'head', 'tail', 'less', 'more', 'wc', 'ls', 'file', 'stat'}

def active_text(cmd):
    """Команда без сегментів, що лише читають (grep/cat/…): їхні аргументи — дані, не дії."""
    keep = []
    for seg in re.split(r'(&&|\|\||;|\||\n)', cmd):
        w = re.sub(r'^\s*(\w+=\S*\s+)*', '', seg).split(maxsplit=1)
        if w and os.path.basename(w[0]) in READONLY: continue
        keep.append(seg)
    return ''.join(keep)

def worker_deploy(text):
    """deny для deploy Worker без тестової конфігурації, ask для тестового Worker, інакше None."""
    for m in re.finditer(W + SEP + r'\s(deploy|publish)\b[^|;&\n]*', text):
        if TEST_WORKER.search(m.group(0)) and not re.search(r'--name\b', m.group(0)):
            return ('ask', 'deploy тестового Worker — лише з окремого дозволу власника')
        return ('deny', 'deploy Worker без конфігурації тестового Worker (tools/lexi-test-worker.toml) заборонено')
    return None

def bare_push_risk(cmd, cwd):
    """git push без явного refspec. Повертає ('deny'|'ask', причина) або None.
    deny: поточна гілка main/master; або push.default=upstream|tracking і upstream гілки — main/master.
    ask: push.default=matching (може відправити й main), push --all/--mirror без явної гілки."""
    cur = cwd
    for seg in re.split(r'&&|\|\||;|\||\n', cmd):
        try: a = shlex.split(seg)
        except ValueError: a = seg.split()
        while a and re.match(r'^\w+=', a[0]): a = a[1:]
        if not a: continue
        if a[0] == 'cd' and len(a) > 1: cur = os.path.realpath(os.path.join(cur, os.path.expanduser(a[1]))); continue
        if os.path.basename(a[0]) != 'git': continue
        d, i, pd = cur, 1, None
        while i < len(a) and a[i].startswith('-'):
            if a[i] in ('-C', '-c') and i + 1 < len(a):
                if a[i] == '-C': d = os.path.join(d, os.path.expanduser(a[i+1]))
                elif a[i+1].lower().startswith('push.default='): pd = a[i+1].split('=', 1)[1].lower()
                i += 2
            else: i += 1
        if i >= len(a) or a[i] != 'push' or not os.path.isdir(d): continue
        rest = a[i+1:]
        pos = [x for x in rest if not x.startswith('-')]
        if len(pos) > 1: continue          # є явний refspec: його перевіряють DENY-правила
        branch = git(d, 'rev-parse', '--abbrev-ref', 'HEAD')
        if branch in ('main', 'master'): return ('deny', 'git push з гілки main (публікує Pages) заборонено')
        if '--all' in rest or '--mirror' in rest: return ('ask', 'git push --all/--mirror може відправити main')
        pd = pd or (git(d, 'config', '--get', 'push.default') or 'simple').lower()
        if pd in ('upstream', 'tracking'):
            up = git(d, 'rev-parse', '--abbrev-ref', '@{upstream}')
            if up.split('/', 1)[-1] in ('main', 'master'):
                return ('deny', f'push.default={pd} і upstream гілки {branch} — {up}: push піде в main')
        if pd == 'matching': return ('ask', 'push.default=matching може відправити main')
    return None

def scan_text(text):
    """Повертає (decision, reason) для небезпечного вмісту або None."""
    for rx, why in DENY:
        if re.search(rx, text): return ('deny', why)
    v = worker_deploy(text)
    if v: return v
    for rx, why in ASK[:5]:
        if re.search(rx, text): return ('ask', why)
    return None

def referenced_code(cmd, cwd):
    """Тексти скриптів, які команда запускає (1 рівень): bash/sh/python/node <файл>, ./файл, npm/pnpm/yarn run <script>."""
    found = []
    cur = cwd
    for seg in re.split(r'&&|\|\||;|\||\n', cmd):
        try: a = shlex.split(seg)
        except ValueError: a = seg.split()
        while a and re.match(r'^\w+=', a[0]): a = a[1:]
        if not a: continue
        c = os.path.basename(a[0])
        if c == 'cd' and len(a) > 1:
            cur = os.path.realpath(os.path.join(cur, os.path.expanduser(a[1]))); continue
        cands = []
        if c in ('npm', 'pnpm', 'yarn', 'bun') and len(a) > 1:
            name = a[2] if a[1] in ('run', 'run-script') and len(a) > 2 else (a[1] if c == 'yarn' else '')
            if name:
                pj = os.path.join(cur, 'package.json')
                try: found.append((f'{c} run {name}', json.load(open(pj)).get('scripts', {}).get(name, '')))
                except Exception: found.append((f'{c} run {name}', '\0unknown'))
            continue
        if c in ('bash', 'sh', 'zsh', 'python', 'python3', 'node', 'deno', 'bun', 'perl', 'ruby', 'source', '.'):
            cands = [x for x in a[1:] if not x.startswith('-')][:1]
        elif a[0].startswith(('./', '/', '~/')) or a[0].endswith(SCRIPT_EXT):
            cands = [a[0]]
        for f in cands:
            fp = os.path.realpath(os.path.join(cur, os.path.expanduser(f)))
            try:
                if os.path.isfile(fp) and os.path.getsize(fp) < 1_000_000:
                    found.append((f, open(fp, errors='ignore').read()))
            except Exception: pass
    return found

def main():
    try: ev = json.load(sys.stdin)
    except Exception:
        print('[leren-guard] не вдалося прочитати подію hook (fail-closed)', file=sys.stderr); sys.exit(2)
    tool, inp, cwd = ev.get('tool_name', ''), ev.get('tool_input') or {}, ev.get('cwd') or os.getcwd()
    if tool == 'Bash':
        raw = inp.get('command', '')
        cmd = active_text(raw)
        for rx, why in DENY:
            if re.search(rx, cmd): out('deny', why)
        if prod_write(raw, cwd): out('deny', 'production-репозиторій лише для читання')
        v = worker_deploy(cmd)
        if v and v[0] == 'deny': out(*v)
        v = bare_push_risk(raw, cwd)
        if v and v[0] == 'deny': out(*v)
        verdicts = []
        for name, text in referenced_code(raw, cwd):
            if text == '\0unknown': verdicts.append(('ask', f'{name}: вміст скрипта невідомий')); continue
            v = scan_text(text)
            if v: verdicts.append((v[0], f'скрипт {name}: {v[1]}'))
        for d in ('deny', 'ask'):
            for v in verdicts:
                if v[0] == d: out(d, v[1])
        if v: out(*v)
        if INLINE.search(cmd): out('ask', 'вбудований код запускає процеси — вміст не перевірити')
        for rx, why in ASK:
            if re.search(rx, cmd): out('ask', why)
        sys.exit(0)
    if tool in ('Edit', 'Write', 'MultiEdit', 'NotebookEdit'):
        fp = inp.get('file_path') or inp.get('notebook_path') or ''
        if in_prod(fp, cwd): out('deny', 'production-репозиторій лише для читання')
        d = os.path.dirname(os.path.realpath(fp)) if fp else ''
        if d and os.path.isdir(d):
            top = git(d, 'rev-parse', '--show-toplevel')
            if top:
                lock = os.path.join(top, '.agent-lock')
                if os.path.exists(lock):
                    owner = open(lock).read().strip().splitlines()[0:1] or ['?']
                    if not owner[0].lower().startswith('claude'):
                        out('ask', f'worktree заблоковано агентом: {owner[0]}')
                br = git(top, 'rev-parse', '--abbrev-ref', 'HEAD')
                if br.startswith('codex/') and os.path.exists(fp):
                    rel = os.path.relpath(os.path.realpath(fp), top)
                    if git(top, 'status', '--porcelain', '--', rel):
                        out('ask', f'файл має незакомічені зміни в гілці Codex ({br})')
    sys.exit(0)

if __name__ == '__main__':
    main()
