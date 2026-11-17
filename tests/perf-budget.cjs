// TEST-026 · Performance budget of the app/ first screen (static, deterministic — no timing, no browser).
// Baseline measured on main 8607321 (2026-11-13): 47 render-blocking scripts = 680 KB gzip, 13 stylesheets = 36 KB gzip,
// index.html = 27 KB gzip → 743 KB gzip before the first screen can be drawn. Measured in Chromium (emulated, local server
// without compression): start button after 0.46 s without throttling, 21.3 s on slow 4G (1.6 Mbit/s, 150 ms RTT, CPU ×4).
// The budget below only stops the redesign from making the first load heavier (≈2 % headroom). Raising it is a deliberate
// decision recorded in docs/LERENBE-3-UI-CONTRACTS.md («Бюджети продуктивності»), not a way to make this test pass.
const fs = require('node:fs'), path = require('node:path'), zlib = require('node:zlib'), assert = require('node:assert/strict');
const app = path.join(__dirname, '..', 'app'), html = fs.readFileSync(path.join(app, 'index.html'), 'utf8');
const BUDGET = {blockingKB: 760, stylesKB: 45, blockingScripts: 50, htmlKB: 30};
const gz = f => zlib.gzipSync(fs.readFileSync(path.join(app, f.split('?')[0])), {level: 9}).length / 1024;
const scripts = [...html.matchAll(/<script\b([^>]*)>/g)].map(m => m[1]).filter(a => /\bsrc="/.test(a));
assert(!scripts.some(a => /\bsrc="https?:/.test(a)), 'no external script on the first screen');
const blocking = scripts.filter(a => !/\b(defer|async)\b|type="module"/.test(a)).map(a => a.match(/\bsrc="([^"]+)"/)[1]);
const styles = [...html.matchAll(/<link rel="stylesheet" href="([^"]+)"/g)].map(m => m[1]);
assert(!styles.some(s => /^https?:/.test(s)), 'no external stylesheet (fonts are local)');
const kb = list => list.reduce((a, f) => a + gz(f), 0), js = kb(blocking), css = kb(styles), page = zlib.gzipSync(html, {level: 9}).length / 1024, total = js + css + page;
const top = blocking.map(f => [gz(f), f]).sort((a, b) => b[0] - a[0]).slice(0, 3).map(([k, f]) => f + ' ' + k.toFixed(0) + ' KB').join(', ');
console.log('INFO: render-blocking ' + total.toFixed(0) + ' KB gzip (' + blocking.length + ' scripts ' + js.toFixed(0) + ' KB, ' + styles.length + ' styles ' + css.toFixed(0) + ' KB, html ' + page.toFixed(0) + ' KB); largest: ' + top);
assert(total <= BUDGET.blockingKB, 'render-blocking ' + total.toFixed(0) + ' KB > budget ' + BUDGET.blockingKB + ' KB');
assert(css <= BUDGET.stylesKB, 'stylesheets ' + css.toFixed(0) + ' KB > ' + BUDGET.stylesKB + ' KB');
assert(blocking.length <= BUDGET.blockingScripts, blocking.length + ' blocking scripts > ' + BUDGET.blockingScripts);
assert(page <= BUDGET.htmlKB, 'index.html ' + page.toFixed(0) + ' KB > ' + BUDGET.htmlKB + ' KB');
console.log('PASS: first-screen budget — ≤ ' + BUDGET.blockingKB + ' KB gzip render-blocking, ≤ ' + BUDGET.stylesKB + ' KB styles, ≤ ' + BUDGET.blockingScripts + ' blocking scripts, no external scripts/styles');
