// TEST-043 · Performance and memory lab (Chromium, local server, CDP counters). Not a phone: absolute times are of this
// machine; growth over repeated actions is what matters.
//   node tools/test-043/perf-lab.cjs   → prints JSON (load timings, long tasks, DOM nodes / listeners / heap after repeated actions)
const fs = require('node:fs'), path = require('node:path');
const {browser, repo} = require('./serve.cjs');
const rel = fs.readFileSync(path.join(repo, 'app/app.js'), 'utf8').match(/RELEASE_VERSION="(\d+)"/)[1];
const SEED = {leren_release_seen: JSON.stringify(rel), poly_ui: 'uk', poly_target: 'nl', leren_home_v1: 'path', leren_welcome_seen: 'true', leren_onboarding_language_v1: '1',
 leren_start_known_v1: 'zero', leren_ai_consent18: 'true', leren_char: '"peter"', leren_tour_done: 'true'};

// Settle first: speech retries keep utterances (and their listeners) for 2.5 s by design (app.js ttsSpeak), and Blink frees DOM
// nodes only on a full collection — a heap snapshot forces one. Without this, counters show growth that is not a leak.
async function full(cdp) { const h = () => {}; cdp.on('HeapProfiler.addHeapSnapshotChunk', h); await cdp.send('HeapProfiler.takeHeapSnapshot', {reportProgress: false}); cdp.off('HeapProfiler.addHeapSnapshotChunk', h) }
async function counters(cdp, page) { if (page) await page.waitForTimeout(6000); await full(cdp); await cdp.send('HeapProfiler.collectGarbage'); const d = await cdp.send('Memory.getDOMCounters'), h = await cdp.send('Runtime.getHeapUsage'); return {nodes: d.nodes, listeners: d.jsEventListeners, documents: d.documents, heapMB: +(h.usedSize / 1048576).toFixed(2)} }

async function run({rounds = 60} = {}) {
 const B = await browser({viewport: {width: 390, height: 844}, hasTouch: true}); const out = {};
 await B.ctx.route('**/mock-ai/', r => r.fulfill({status: 200, contentType: 'application/json', body: JSON.stringify({reply: 'Goed zo!', translation: '', correction: null})}));
 const page = await B.ctx.newPage(), cdp = await B.ctx.newCDPSession(page); await cdp.send('Performance.enable');
 await page.addInitScript(([s, ai]) => { if (!sessionStorage.getItem('seeded')) { sessionStorage.setItem('seeded', '1'); localStorage.clear(); for (const [k, v] of Object.entries({...s, leren_ai_endpoint: JSON.stringify(ai)})) localStorage.setItem(k, v) }
  window.__long = []; try { new PerformanceObserver(l => { for (const e of l.getEntries()) window.__long.push(Math.round(e.duration)) }).observe({type: 'longtask', buffered: true}) } catch {} }, [SEED, B.base + '/mock-ai/']);
 const t0 = Date.now(); await page.goto(B.base + '/app/index.html'); await page.waitForFunction(() => typeof setView === 'function' && document.querySelector('#learningPath, .lp-root, main'));
 out.load = await page.evaluate(() => { const n = performance.getEntriesByType('navigation')[0], p = Object.fromEntries(performance.getEntriesByType('paint').map(e => [e.name, Math.round(e.startTime)]));
  const res = performance.getEntriesByType('resource'); return {domContentLoaded: Math.round(n.domContentLoadedEventEnd), load: Math.round(n.loadEventEnd), ...p, resources: res.length, transferKB: Math.round(res.reduce((a, r) => a + (r.decodedBodySize || 0), 0) / 1024)} });
 out.load.wallMs = Date.now() - t0; await page.waitForTimeout(1500); out.longTasksAtStart = await page.evaluate(() => window.__long.slice());
 const m = (await cdp.send('Performance.getMetrics')).metrics; const g = k => m.find(x => x.name === k)?.value; out.scriptMs = Math.round(g('ScriptDuration') * 1000); out.layoutMs = Math.round(g('LayoutDuration') * 1000);
 out.start = await counters(cdp, page);
 // lesson rounds (quiz answer → next), the hottest path
 const quizRound = () => page.evaluate(() => { lessonMode = 'quiz'; mode = 'quiz'; if (view !== 'lesson') setView('lesson'); newRound(); const o = document.querySelector('#card .opt[data-ok="1"]'); o && o.click() });
 await page.evaluate(() => { setView('lesson'); buildNav() }); for (let i = 0; i < 5; i++) await quizRound(); const q0 = await counters(cdp, page);
 const tq = Date.now(); for (let i = 0; i < rounds; i++) await quizRound(); out.quizMsPerRound = +((Date.now() - tq) / rounds).toFixed(1); const q1 = await counters(cdp, page);
 out.quiz = {rounds, before: q0, after: q1, listenersPerRound: +((q1.listeners - q0.listeners) / rounds).toFixed(2), nodesPerRound: +((q1.nodes - q0.nodes) / rounds).toFixed(1)};
 // view switching
 const views = ['path', 'lesson', 'games', 'toets', 'path']; const v0 = await counters(cdp, page);
 for (let i = 0; i < rounds / 5; i++) for (const v of views) await page.evaluate(v => setView(v), v); const v1 = await counters(cdp, page);
 out.views = {switches: rounds, before: v0, after: v1, listenersPerSwitch: +((v1.listeners - v0.listeners) / rounds).toFixed(2), nodesPerSwitch: +((v1.nodes - v0.nodes) / rounds).toFixed(1)};
 // Lexi open / send / close
 const lexiCycle = async () => { await page.evaluate(() => lexiOpen('free', {})); await page.waitForFunction(() => document.querySelector('.lexi-host')?.shadowRoot?.querySelector('#draft'));
  await page.evaluate(() => lexiClose()); };
 for (let i = 0; i < 3; i++) await lexiCycle(); const l0 = await counters(cdp, page); const n = Math.round(rounds / 3);
 for (let i = 0; i < n; i++) await lexiCycle(); const l1 = await counters(cdp, page);
 out.lexi = {cycles: n, before: l0, after: l1, listenersPerCycle: +((l1.listeners - l0.listeners) / n).toFixed(2), nodesPerCycle: +((l1.nodes - l0.nodes) / n).toFixed(1), heapKBPerCycle: Math.round((l1.heapMB - l0.heapMB) * 1024 / n)};
 // Lesson Help scanner: how often it runs during the quiz rounds
 out.lessonHelp = await page.evaluate(async () => { let c = 0; const s = LerenLessonHelp.scan; LerenLessonHelp.scan = () => { c++; return s() }; return c });
 out.longTasksTotal = await page.evaluate(() => ({count: window.__long.length, maxMs: Math.max(0, ...window.__long)}));
 out.storage = await page.evaluate(() => ({keys: localStorage.length, kb: Math.round([...Array(localStorage.length)].reduce((a, _, i) => { const k = localStorage.key(i); return a + k.length + (localStorage.getItem(k) || '').length }, 0) * 2 / 1024)}));
 await B.close(); return out;
}
module.exports = {run};
if (require.main === module) run().then(o => console.log(JSON.stringify(o, null, 1))).catch(e => { console.error(e); process.exit(1) });
