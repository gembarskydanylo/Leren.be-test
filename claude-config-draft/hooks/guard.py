#!/usr/bin/env python3
"""PreToolUse guard для LerenBe. Читає JSON події зі stdin, нічого не виконує.
deny  -> exit 0 + permissionDecision=deny ; ask -> permissionDecision=ask ; інакше мовчки exit 0."""
import json, os, re, shlex, subprocess, sys

PROD = os.path.realpath(os.path.expanduser(os.environ.get('LEREN_PROD_DIR', '~/Documents/Leren.be')))

DENY = [
    (r'\bgit\s+push\b[^|;&]*(\s--force\b|\s-f\b|\s--force-with-lease\b|\s\+\S)', 'force-push заборонено'),
    (r'\bfirebase\s+deploy\b', 'deploy Firebase заборонено без дозволу власника'),
    (r'\bwrangler\s+(deploy|publish)\b(?![^|;&]*--env[= ]test)', 'deploy Worker (не test) заборонено'),
    (r'\bwrangler\s+secret\s+put\b', 'зміна секретів Worker заборонена'),
    (r'\bgh\s+pr\s+merge\b[^|;&]*--admin', 'merge з --admin заборонено'),
    (r'\bgit\s+push\b[^|;&]*\b(origin|upstream)\s+(\S+:)?(main|master)\b', 'push у main (публікує Pages) заборонено'),
]
ASK = [
    (r'\bgh\s+pr\s+merge\b', 'злиття PR — потрібен дозвіл власника'),
    (r'\bgh\s+pr\s+ready\b', 'перевід PR з Draft'),
    (r'\bgit\s+merge\b', 'git merge — перевір цільову гілку'),
    (r'\bgit\s+reset\s+[^|;&]*--hard', 'reset --hard знищує незакомічені зміни'),
    (r'\bgit\s+(checkout|restore)\s+[^|;&]*(--\s+\.|\s\.(\s|$)|--\s+(design-lab|docs|app)\b)', 'відкат робочих файлів'),
    (r'\bgit\s+clean\s+-[a-zA-Z]*f', 'git clean видаляє невідстежувані файли'),
    (r'\bgit\s+stash\s+(drop|clear|pop)\b', 'операція зі stash може втратити зміни'),
    (r'\bgit\s+worktree\s+remove\b', 'видалення worktree'),
    (r'\bgit\s+branch\s+-D\b', 'примусове видалення гілки'),
    (r'\bgit\s+push\b[^|;&]*--delete', 'видалення віддаленої гілки'),
    (r'\brm\s+-[a-zA-Z]*r[a-zA-Z]*f?\b[^|;&]*(/private/tmp/leren-|scratchpad/(test|int|l\d+|lexi|q)\b)', 'видалення worktree-каталогу'),
]

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

def main():
    try: ev = json.load(sys.stdin)
    except Exception: sys.exit(0)
    tool, inp, cwd = ev.get('tool_name', ''), ev.get('tool_input') or {}, ev.get('cwd') or os.getcwd()
    if tool == 'Bash':
        cmd = inp.get('command', '')
        for rx, why in DENY:
            if re.search(rx, cmd): out('deny', why)
        if prod_write(cmd, cwd): out('deny', 'production-репозиторій лише для читання')
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
