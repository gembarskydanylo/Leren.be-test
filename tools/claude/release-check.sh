#!/bin/bash
# Лише читання: узгодженість номера релізу/кешу (engine.js має власну версію). Нічого не публікує.
ROOT=$(git rev-parse --show-toplevel) || exit 2; cd "$ROOT"
python3 -I - <<'PY'
import re,pathlib,sys
r=lambda p:pathlib.Path(p).read_text(errors='ignore') if pathlib.Path(p).exists() else ''
a,i,s=r('app/app.js'),r('app/index.html'),r('app/sw.js')
f={'RELEASE_VERSION':re.findall(r'RELEASE_VERSION\s*=\s*"?(\d+)',a),'LEXI_V':re.findall(r'LEXI_V\s*=\s*"?(\d+)',a),
 'index app.js?v':re.findall(r'app\.js\?v=(\d+)',i),'sw app.js?v':re.findall(r'app\.js\?v=(\d+)',s),
 'CACHE_NAME':re.findall(r'leren-be-v(\d+)',s),'sw lexi ?v':re.findall(r'lexi/(?!engine)[\w.-]+\?v=(\d+)',s),
 'first-lesson pin':re.findall(r'app\.js\?v=(\d+)',r('tests/first-lesson.cjs'))}
vals=set()
for k,v in f.items():
  u=sorted(set(v));vals|=set(u);print(f'{k:18} {",".join(u) or "—"}')
ok=len(vals)==1;print('RELEASE', 'CONSISTENT '+vals.pop() if ok else 'MISMATCH');sys.exit(0 if ok else 1)
PY
