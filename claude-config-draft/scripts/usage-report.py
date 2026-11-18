# usage: python3 -I usage-report.py ~/.claude/projects/<project>/<session>.jsonl  — фактичні токени сесії, найбільші результати інструментів.
import json,sys,collections
f=sys.argv[1]
U=collections.Counter();n=0;seen=set()
tool_in={};tool_size=collections.Counter();tool_cnt=collections.Counter()
reads=collections.Counter();bash_cmds=collections.Counter();big=[]
for line in open(f):
    try:d=json.loads(line)
    except:continue
    m=d.get('message') or {}
    if d.get('type')=='assistant':
        mid=m.get('id')
        u=m.get('usage') or {}
        if mid and mid not in seen and u:
            seen.add(mid);n+=1
            for k in('input_tokens','output_tokens','cache_read_input_tokens','cache_creation_input_tokens'):U[k]+=u.get(k,0) or 0
        for c in m.get('content') or []:
            if isinstance(c,dict) and c.get('type')=='tool_use':
                tool_in[c['id']]=(c['name'],c.get('input',{}))
                if c['name']=='Read':reads[c['input'].get('file_path','')]+=1
                if c['name']=='Bash':
                    cmd=c['input'].get('command','')
                    for key in('tests/','runall','lexi-ui-port','http.server','git '):
                        if key in cmd:bash_cmds[key]+=1
    if d.get('type')=='user':
        for c in (m.get('content') or []) if isinstance(m.get('content'),list) else []:
            if isinstance(c,dict) and c.get('type')=='tool_result':
                t=c.get('content');s=len(json.dumps(t)) if not isinstance(t,str) else len(t)
                name,inp=tool_in.get(c.get('tool_use_id'),('?',{}))
                tool_size[name]+=s;tool_cnt[name]+=1
                big.append((s,name,(inp.get('file_path') or inp.get('command','') or '')[:90]))
print('assistant API calls',n);print(dict(U))
print('tool result chars by tool:')
for k,v in tool_size.most_common(10):print(f'  {k:40} {v:>9} chars  {tool_cnt[k]} calls')
print('top 12 tool results:')
for s,nm,x in sorted(big,reverse=True)[:12]:print(f'  {s:>7} {nm} {x}')
print('files read >=3 times:')
for k,v in reads.most_common():
    if v>=3:print(f'  {v} {k}')
print('bash keyword counts',dict(bash_cmds))
