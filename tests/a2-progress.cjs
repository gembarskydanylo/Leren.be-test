// TEST-027 · A2 (curLevel "a21") on the progress screen and in Peter's advice.
// Before: merge.js and insights knew only a11/a12, so A2 reading/listening answers and grammar slips were never stored,
// and the progress screen of A2 showed the A1.1 exam («Іспит A2: 90%» was the A1.1 exam). A2 has no exam.
// Sync compatibility: an older app version drops the a21 part when it merges; the device that has it keeps it (merging
// takes each device's part), so nothing is corrupted — the newer device adds it back on its next sync.
const fs = require('node:fs'), path = require('node:path'), http = require('node:http'), vm = require('node:vm'), assert = require('node:assert/strict');
const repo = path.join(__dirname, '..'), app = path.join(repo, 'app'), read = f => fs.readFileSync(path.join(app, f), 'utf8');
const ctx = vm.createContext({console, crypto: globalThis.crypto, TextEncoder}); vm.runInContext(read('modules/sync/merge.js') + '\n' + read('modules/insights/core.js'), ctx);
const M = ctx.LerenMerge, I = ctx.LerenInsights, J = v => JSON.parse(JSON.stringify(v));
// 1 · A2 answers and slips are stored, viewed and merged like A1.1/A1.2.
let s = M.skillAdd(M.skillAdd(null, 'dA', 'a21', 'lezen', true), 'dA', 'a21', 'luisteren', false);
assert.equal(M.skillsView(s).a21.lezen.n, 1); assert.equal(M.skillsView(s).a21.luisteren.n, 1);
let sl = null; for (const ok of [false, false, true, false]) sl = M.slipAdd(sl, 'dA', 'a21', 'perfectum', ok);
assert.equal(M.slipsView(sl).a21.perfectum, '0010');
// 2 · an older version's merge result (no a21 part) does not erase this device's A2 data.
const oldCleaned = J(s); delete oldCleaned.dev.dA.a21; oldCleaned.dev.dB = {a11: J(s).dev.dA.a21 ? M.skillsView({}).a11 : undefined};
assert.equal(M.skillsView(M.skillsMerge(s, oldCleaned)).a21.lezen.n, 1, 'A2 part kept when the other copy lacks it');
assert.equal(M.skillsView(M.skillsMerge(M.skillsMerge(s, oldCleaned), s)).a21.lezen.n, 1, 'retry-safe');
// 3 · insights: A2 has no exam; A2 grammar slips open A2 practice — never an exam action, never a dead button.
const sum = I.summary(M.skillsView(s), 'a21', {}); assert.equal(sum.lezen.exam, null); assert.equal(sum.lezen.n, 1);
const tabs = ['a2tijden', 'a2adj', 'a2bijzin'];
for (const [tag, want] of [['perfectum', 'a2tijden'], ['vergelijking', 'a2adj'], ['scheidbaar', 'a2bijzin'], ['grammatica', 'a2bijzin']]) {
 const r = I.recommend({lv: 'a21', skills: sum, slips: {[tag]: '0000'}, due: [], tests: [], lessonsDone: 10, tabs, canSpeak: false});
 const a = r.items.find(x => x.kind === 'slip')?.action; assert.deepEqual(J(a), {t: 'tab', tab: want, mode: 'quiz'}, 'A2 slip ' + tag + ' → ' + want);
 assert(!r.items.some(x => x.action?.t === 'exam' && x.action.lv === 'a21'), 'no A2 exam advice');
}
assert(!I.recommend({lv: 'a21', skills: sum, slips: {perfectum: '0000'}, due: [], tests: [], lessonsDone: 10, tabs: [], canSpeak: false}).items.some(x => x.kind === 'slip'), 'no practice tab → no slip advice (no dead button)');
// A1.1 and A1.2 keep their exam advice.
assert.equal(J(I.recommend({lv: 'a12', skills: I.summary({}, 'a12', {}), slips: {perfectum: '0000'}, due: [], tests: [], lessonsDone: 10, tabs: [], canSpeak: false}).items.find(x => x.kind === 'slip').action).t, 'exam');
console.log('PASS: unit — A2 answers and slips stored and merged (older copies do not erase them), A2 has no exam, A2 slips → A2 practice tabs, A1 exam advice unchanged');

(async () => {
 let chromium; try { ({chromium} = require('playwright')) } catch { console.log('SKIP: browser part (Playwright is not installed)'); return }
 const T = {'.html': 'text/html', '.js': 'text/javascript', '.mjs': 'text/javascript', '.css': 'text/css', '.json': 'application/json', '.webp': 'image/webp', '.png': 'image/png', '.svg': 'image/svg+xml', '.woff': 'font/woff'};
 const server = http.createServer((q, r) => { let f = path.join(repo, decodeURIComponent(new URL(q.url, 'http://x').pathname)); if (fs.existsSync(f) && fs.statSync(f).isDirectory()) f = path.join(f, 'index.html'); if (!f.startsWith(repo) || !fs.existsSync(f)) { r.statusCode = 404; return r.end() } r.setHeader('content-type', T[path.extname(f)] || 'application/octet-stream'); fs.createReadStream(f).pipe(r) });
 await new Promise(r => server.listen(0, '127.0.0.1', r));
 let browser; try { browser = await chromium.launch() } catch { console.log('SKIP: no Chromium'); server.close(); return }
 try {
  const c = await browser.newContext({serviceWorkers: 'block', viewport: {width: 390, height: 844}}), p = await c.newPage(), errors = []; p.on('pageerror', e => errors.push(e.message));
  await c.route(/^https?:\/\/(?!127\.0\.0\.1)/, r => r.abort());
  const rel = read('app.js').match(/RELEASE_VERSION="(\d+)"/)[1];
  await p.addInitScript(rel => { if (sessionStorage.s) return; sessionStorage.s = 1; for (const [k, v] of Object.entries({leren_release_seen: JSON.stringify(rel), poly_ui: 'uk', leren_home_v1: 'path', leren_welcome_seen: 'true', leren_onboarding_language_v1: '1', leren_start_known_v1: 'zero', leren_exam11: JSON.stringify({best: {lezen: 90, luisteren: 70}})})) localStorage.setItem(k, v) }, rel);
  await p.goto('http://127.0.0.1:' + server.address().port + '/app/'); await p.waitForFunction(() => typeof learningPath === 'object' && learningPath);
  const screen = lv => p.evaluate(lv => { switchCourse(lv); for (let i = 0; i < 12; i++) skillLog(i % 2 ? 'lezen' : 'luisteren', i % 3 > 0); setView('progress'); return document.querySelector('#insSkills').innerText.replace(/\s+/g, ' ') }, lv);
  const a2 = await screen('a21'), a1 = await screen('a11');
  assert(/A2/.test(a2) && !/90%|70%/.test(a2), 'A2 shows no A1.1 exam result: ' + a2.slice(0, 160));
  assert((a2.match(/6 з 10/g) || []).length === 2, 'A2 answers are counted (6 reading + 6 listening; a percentage from 10): ' + a2.slice(0, 160));
  assert(/90%/.test(a1) && /70%/.test(a1), 'A1.1 still shows its own exam');
  assert.deepEqual(errors, []); await c.close();
 } finally { await browser.close(); server.close() }
 console.log('PASS: browser — A2 progress screen counts A2 answers and shows no A1.1 exam; A1.1 keeps its exam');
})().catch(e => { console.error(e); process.exit(1) });
