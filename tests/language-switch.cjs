// TEST-028 · Changing the interface language (and the language being learned) never touches the learner's data.
// Real app/ in Chromium (no service worker, no external request). A learner with an old save (poly_score, a finished
// A1.1 lesson, LIFE XP, fence progress) switches the interface uk → en → fr → ar → uk, reloading after each change:
// every progress key stays byte-for-byte the same, the home renders in that language (ar: dir=rtl), and the LIFE story
// opens in the chosen language without losing LIFE XP. Then the learned language nl → fr → nl: progress unchanged.
const fs = require('node:fs'), path = require('node:path'), http = require('node:http'), assert = require('node:assert/strict');
const repo = path.join(__dirname, '..');
// Keys that only remember the interface choice; everything else in localStorage is learner data and must not change.
const UI_KEYS = new Set(['poly_ui', 'poly_target', 'poly_tab', 'poly_cat', 'leren_release_seen', 'seeded']);
(async () => {
 let chromium; try { ({chromium} = require('playwright')) } catch { console.log('SKIP: Playwright is not installed'); return }
 const T = {'.html': 'text/html', '.js': 'text/javascript', '.mjs': 'text/javascript', '.css': 'text/css', '.json': 'application/json', '.png': 'image/png', '.webp': 'image/webp', '.jpg': 'image/jpeg', '.svg': 'image/svg+xml', '.m4a': 'audio/mp4', '.woff': 'font/woff', '.webmanifest': 'application/manifest+json'};
 const server = http.createServer((q, r) => { let f = path.join(repo, decodeURIComponent(new URL(q.url, 'http://x').pathname)); if (f.endsWith(path.sep)) f += 'index.html';
  if (!f.startsWith(repo) || !fs.existsSync(f) || fs.statSync(f).isDirectory()) { r.statusCode = 404; return r.end() }
  r.setHeader('content-type', T[path.extname(f)] || 'application/octet-stream'); fs.createReadStream(f).pipe(r) });
 await new Promise(r => server.listen(0, '127.0.0.1', r)); const B = 'http://localhost:' + server.address().port + '/app/';
 let browser; try { browser = await chromium.launch() } catch { console.log('SKIP: no Chromium'); server.close(); return }
 const rel = fs.readFileSync(path.join(repo, 'app/app.js'), 'utf8').match(/RELEASE_VERSION="(\d+)"/)[1];
 const ctx = await browser.newContext({viewport: {width: 390, height: 844}, serviceWorkers: 'block'}), page = await ctx.newPage(), errors = [];
 page.on('pageerror', e => errors.push(e.message)); await ctx.route(/^https?:\/\/(?!localhost)/, r => r.abort());
 await page.addInitScript(rel => { if (localStorage.getItem('seeded')) return; localStorage.setItem('seeded', '1');
  for (const [k, v] of Object.entries({poly_ui: 'uk', poly_target: 'nl', leren_home_v1: 'path', leren_welcome_seen: 'true', leren_onboarding_language_v1: '1', leren_start_known_v1: 'zero', poly_score: '35', leren_release_seen: JSON.stringify(rel),
   leren_life_xp_v1: JSON.stringify({'first-day:station': 40}), 'leren_learn_life_v1_fence-neighbour': JSON.stringify({done: ['mark-1'], missed: [], spoken: [], favourites: []})})) localStorage.setItem(k, v) }, rel);
 const data = () => page.evaluate(keys => Object.fromEntries(Object.keys(localStorage).filter(k => !keys.includes(k)).sort().map(k => [k, localStorage.getItem(k)])), [...UI_KEYS]);
// every learner key of the settled snapshot keeps its exact value; new keys may appear only for one-time interface flags
 const same = async label => { const d = await data(); for (const k of Object.keys(want)) assert.equal(d[k], want[k], label + ': ' + k); for (const k of Object.keys(d)) if (!(k in want)) assert.doesNotMatch(k, /score|xp|progress|path|life|skill|review|achiev|daily/, label + ': new data key ' + k) };
 const home = async () => { await page.waitForSelector('.hv', {timeout: 20000}); await page.waitForTimeout(300) };
 let want; try {
  await page.goto(B); await home();
  // a finished A1.1 lesson on top of the old save, then a settled snapshot (whatever the app writes on its own start-up)
  await page.evaluate(() => { const m = learningPath.model, l = m.recommended(); m.start(); m.state.completed[l.id] = l.ids.length; m.save() });
  await page.reload(); await home(); want = await data();
  assert(+want.poly_score >= 35 && /"base":35/.test(want.leren_xp_v2) && /completed/.test(want.leren_path_v1) && want.leren_life_xp_v1, 'seeded progress present');
  const seen = [];
  for (const [ui, dir] of [['en', 'ltr'], ['fr', 'ltr'], ['ar', 'rtl'], ['uk', 'ltr']]) {
   await page.evaluate(l => changeUiLang(l), ui); await page.waitForTimeout(500); // the settings switch rebuilds the exercise view, not the home
   await same(ui + ': learner data unchanged right after the switch');
   await page.reload(); await home();
   const s = await page.evaluate(() => ({ui: localStorage.getItem('poly_ui'), lang: document.documentElement.lang, dir: document.documentElement.dir || 'ltr', score: typeof score === 'number' ? score : null}));
   assert.equal(s.ui, ui, ui + ': choice saved'); assert.equal(s.dir, dir, ui + ': direction'); assert.equal(s.score, +want.poly_score, ui + ': XP in memory after reload');
   await same(ui + ': learner data unchanged after reload');
   // LIFE follows the interface language (poly_ui) and keeps its XP
   await page.goto(B + 'learn-life-story.html?s=first-day'); await page.waitForSelector('.ls-hero', {timeout: 20000});
   assert.equal(await page.evaluate(() => document.documentElement.lang), ui, ui + ': LIFE story in the same language');
   await same(ui + ': LIFE page leaves learner data unchanged');
   await page.goto(B); await home(); seen.push(ui + (dir === 'rtl' ? ' (rtl)' : ''));
  }
  for (const t of ['fr', 'nl']) {
   await page.evaluate(l => changeTargetLang(l), t); await page.reload(); // the path home is for Dutch; other languages open the exercises
   if (t === 'nl') await home(); else { await page.waitForSelector('main', {timeout: 20000}); await page.waitForTimeout(800); assert.equal(await page.evaluate(() => view), 'lesson', 'fr: exercises view') }
   assert.equal(await page.evaluate(() => localStorage.getItem('poly_target')), t, 'learned language ' + t + ' saved');
   await same('learned language ' + t + ': learner data unchanged');
  }
  assert.deepEqual(errors, []);
  console.log('PASS: interface ' + ['uk', ...seen].join(' → ') + ' and learned nl → fr → nl, reload after each: ' + Object.keys(want).length + ' learner keys (XP, A1.1 lesson, LIFE XP, fence) byte-for-byte unchanged; LIFE follows the language');
 } finally { await browser.close(); server.close() }
})().catch(e => { console.error(e); process.exit(1) });
