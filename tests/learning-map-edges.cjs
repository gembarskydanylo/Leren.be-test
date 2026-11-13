// TEST-020 Learning · independent audit: edge cases of the home route (the topic map of the active course).
// New user, one lesson, a partly and a fully finished topic, a finished course, broken saved data, switching
// A1.1 ↔ A1.2 ↔ A2 (no mixing of lessons between courses, XP untouched), a stop → its chapter map → back, reload,
// TEST-022 calm home (the list is folded until three lessons) and 44 px targets at 360/390/430/1280/1440.
// Browser: Playwright Chromium, emulated screens — not a physical phone. SHOTS=<dir> saves screenshots.
const fs = require('node:fs'), path = require('node:path'), http = require('node:http'), assert = require('node:assert/strict');
const repo = path.join(__dirname, '..'), root = path.join(repo, 'app'), read = f => fs.readFileSync(path.join(root, f), 'utf8');
(async () => {
 // Static: the cached copies must change with the code (service worker serves ?v= files from its cache).
 const html = read('index.html'), sw = read('sw.js'), release = read('app.js').match(/RELEASE_VERSION="(\d+)"/)[1];
 for (const f of ['modules/home-v2/ui.js', 'modules/home-v2/style.css', 'modules/learning-path/ui.js']) {
  const v = html.match(new RegExp(f.replace(/[./]/g, '\\$&') + '\\?v=(\\d+)'))?.[1];
  assert(v && sw.includes('./' + f + '?v=' + v), f + ': index.html and sw.js name the same version');
 }
 assert.equal(sw.match(/leren-be-v(\d+)/)[1], release, 'cache name = release');
 assert(/routeOpen/.test(read('modules/learning-path/ui.js')) && /ctx\.routeOpen/.test(read('modules/home-v2/ui.js')), 'route follows the calm-home rule');
 console.log('PASS: static — versions of the changed files agree in index.html and sw.js, cache ' + release);
 let chromium; try { ({chromium} = require('playwright')) } catch { console.log('SKIP: browser part (Playwright is not installed)'); return }
 const T = {'.html': 'text/html', '.js': 'text/javascript', '.mjs': 'text/javascript', '.css': 'text/css', '.json': 'application/json', '.png': 'image/png', '.webp': 'image/webp', '.jpg': 'image/jpeg', '.svg': 'image/svg+xml', '.m4a': 'audio/mp4', '.woff': 'font/woff', '.webmanifest': 'application/manifest+json'};
 const server = http.createServer((q, r) => { let f = path.join(root, decodeURIComponent(new URL(q.url, 'http://x').pathname)); if (fs.existsSync(f) && fs.statSync(f).isDirectory()) f = path.join(f, 'index.html'); if (!f.startsWith(root) || !fs.existsSync(f)) { r.statusCode = 404; return r.end() } r.setHeader('content-type', T[path.extname(f)] || 'application/octet-stream'); fs.createReadStream(f).pipe(r) });
 await new Promise(r => server.listen(0, '127.0.0.1', r)); const B = 'http://127.0.0.1:' + server.address().port + '/';
 let browser; try { browser = await chromium.launch() } catch { console.log('SKIP: no Chromium'); server.close(); return }
 const shot = async (page, name) => { if (process.env.SHOTS) { await page.locator('.hv-route').scrollIntoViewIfNeeded(); await page.screenshot({path: path.join(process.env.SHOTS, 'route-' + name + '.png')}) } };
 async function open(w, h, path_ = null) {
  const ctx = await browser.newContext({viewport: {width: w, height: h}, serviceWorkers: 'block'}), page = await ctx.newPage(), errors = [];
  page.on('pageerror', e => errors.push(e.message)); await ctx.route(/^https?:\/\/(?!127\.0\.0\.1)/, r => r.abort());
  await page.addInitScript(([rel, p]) => { if (sessionStorage.getItem('seed')) return; sessionStorage.setItem('seed', '1'); localStorage.clear();
   for (const [k, v] of Object.entries({leren_release_seen: JSON.stringify(rel), poly_ui: 'uk', leren_home_v1: 'path', leren_welcome_seen: 'true', leren_onboarding_language_v1: '1', leren_start_known_v1: 'zero', poly_score: '35'})) localStorage.setItem(k, v);
   if (p != null) localStorage.setItem('leren_path_v1', p) }, [release, path_]);
  await page.goto(B); await page.waitForSelector('.hv-route'); return {ctx, page, errors};
 }
 const route = page => page.evaluate(() => { const r = document.querySelector('.hv-route');
  return {open: r.querySelector('details').open, empty: !!r.querySelector('.hv-route-empty'), current: [...r.querySelectorAll('[aria-current="step"]')].map(b => b.closest('.hv-stop').dataset.chapter),
   stops: [...r.querySelectorAll('.hv-stop')].map(s => ({id: s.dataset.chapter, state: s.dataset.state, done: s.querySelector('progress').value, total: +s.querySelector('progress').max}))} });
 const model = page => page.evaluate(() => { const m = learningPath.model; return {course: m.course, levels: m.levels, own: m.course && LerenLearningPath.catalog(DATA, LerenCurriculum).chapters.filter(c => c.level === m.course).map(c => c.id), stats: Object.fromEntries(m.levels.map(l => [l, m.courseStats(l)])), xp: localStorage.getItem('poly_score')} });
 // Marks lessons as finished through the engine's own state (as finish() does), then redraws the home.
 const finish = (page, pick) => page.evaluate(pick => { const m = learningPath.model, c = LerenLearningPath.catalog(DATA, LerenCurriculum); if (!m.state.started) m.start();
  for (const l of (f => c.lessons.filter(l => f(l, c)))(new Function('l', 'c', 'return ' + pick))) m.state.completed[l.id] = l.ids.length; m.state.session = null; m.save(); learningPath.home() }, pick);
 const report = [];
 try {
  // 1 · new user
  let {ctx, page, errors} = await open(390, 844);
  let r = await route(page), m = await model(page);
  assert.equal(m.course, 'A1.1'); assert.deepEqual(r.stops.map(s => s.id), m.own, 'route = chapters of the active course, in order');
  assert(r.empty && !r.open, 'new user: hint shown, list folded (TEST-022 calm home)'); assert(r.stops.every(s => s.done === 0 && s.state !== 'complete'));
  assert.deepEqual(r.current, [m.own[0]], 'new user: «Ти тут» on the first topic');
  const plural = n => n % 10 === 1 && n % 100 !== 11 ? 'урок' : n % 10 >= 2 && n % 10 <= 4 && (n % 100 < 12 || n % 100 > 14) ? 'уроки' : 'уроків';
  for (const [text, total] of await page.$$eval('.hv-stop', x => x.map(s => [s.querySelector('.hv-stop-info > span').textContent, +s.querySelector('progress').max])))
   assert.equal(text.split(' ').pop(), plural(total), 'Ukrainian plural for ' + total + ': ' + text);
  await shot(page, '390-new');
  await page.click('.hv-route summary'); assert((await route(page)).open, 'summary unfolds the list');
  // 2 · one lesson → counted in its topic only; reload keeps it; XP is not touched by the map
  const first = await page.evaluate(() => LerenLearningPath.catalog(DATA, LerenCurriculum).lessons[0].id);
  await finish(page, `l.id===${JSON.stringify(first)}`); await page.reload(); await page.waitForSelector('.hv-route');
  r = await route(page); m = await model(page);
  assert.equal(r.stops[0].done, 1); assert.equal(r.stops[0].state, 'current'); assert(!r.empty && !r.open); assert(r.stops.slice(1).every(s => s.done === 0));
  assert.equal(m.xp, '35', 'XP untouched'); assert.equal(m.stats['A1.1'].done, 1); assert.equal(m.stats['A1.2'].done, 0, 'A1.2 untouched');
  await shot(page, '390-one-lesson');
  // 3 · whole first topic → ✓ and «Ти тут» moves on; ≥ 3 lessons → the list is open
  await finish(page, `l.chapter===${JSON.stringify(m.own[0])}`); r = await route(page);
  assert.equal(r.stops[0].state, 'complete'); assert.equal(r.stops[0].done, r.stops[0].total); assert.deepEqual(r.current, [m.own[1]]); assert(r.open, '≥ 3 lessons: open');
  assert.equal(await page.locator('.hv-stop[data-state=complete] .hv-stop-number').first().textContent(), '✓');
  const a11 = (await model(page)).stats['A1.1'];
  // 4 · a stop opens its own chapter map; back twice returns home with the same counts
  const stopTitle = await page.locator(`.hv-stop[data-chapter="${m.own[1]}"] .hv-stop-info b`).textContent();
  await page.locator(`.hv-stop[data-chapter="${m.own[1]}"] button`).click(); await page.waitForFunction(() => document.querySelector('#learningPath').dataset.screen === 'map');
  assert.equal(await page.locator('.fh-map-heading h2').textContent(), stopTitle, 'a stop opens the map of that same topic');
  await page.click('.fh-back'); await page.waitForSelector('.fh-topic-grid'); await page.click('.fh-back'); await page.waitForSelector('.hv-route');
  assert.deepEqual((await model(page)).stats['A1.1'], a11, 'back: progress unchanged');
  // 5 · switch to A1.2 → only A1.2 topics, all at zero; A1.1 kept; back to A1.1 restores its route
  await page.click('.hv-pick-btn'); await page.click('.hv-pick-panel .hv-level[data-level="A1.2"]'); await page.waitForFunction(() => learningPath.model.course === 'A1.2');
  r = await route(page); m = await model(page);
  assert.deepEqual(r.stops.map(s => s.id), m.own); assert(r.stops.every(s => s.done === 0), 'A1.2 route has no A1.1 lessons'); assert.deepEqual(r.current, [m.own[0]]);
  assert.deepEqual(m.stats['A1.1'], a11, 'A1.1 progress kept after switching'); assert.equal(m.xp, '35');
  if (m.levels.includes('A2')) { await page.click('.hv-pick-btn'); await page.click('.hv-pick-panel .hv-level[data-level="A2"]'); await page.waitForFunction(() => learningPath.model.course === 'A2');
   r = await route(page); m = await model(page); assert.deepEqual(r.stops.map(s => s.id), m.own); assert(r.stops.every(s => s.done === 0));
   assert.match(await page.locator('.hv-pick-panel .hv-level[data-level="A2"] small').textContent(), /^A2\.1 · /, 'A2 course is labelled A2.1');
   await page.locator('.hv-stop button').first().click(); await page.waitForFunction(() => document.querySelector('#learningPath').dataset.screen === 'map');
   assert.match(await page.locator('.fh-map-heading .fh-eyebrow').textContent(), /A2\.1/, 'A2 chapter map does not say «A1»');
   await page.click('.fh-back'); await page.click('.fh-back'); await page.waitForSelector('.hv-route') }
  await page.click('.hv-pick-btn'); await page.click('.hv-pick-panel .hv-level[data-level="A1.1"]'); await page.waitForFunction(() => learningPath.model.course === 'A1.1');
  r = await route(page); assert.equal(r.stops[0].state, 'complete'); assert.deepEqual((await model(page)).stats['A1.1'], a11);
  await page.reload(); await page.waitForSelector('.hv-route'); assert.deepEqual((await model(page)).stats['A1.1'], a11, 'reload keeps A1.1');
  // 6 · finished course: every stop ✓, nobody is «Ти тут», no errors
  await finish(page, `c.chapters.find(x=>x.id===l.chapter).level==='A1.1'`); r = await route(page);
  assert(r.stops.every(s => s.state === 'complete')); assert.deepEqual(r.current, []); assert.equal((await model(page)).stats['A1.2'].done, 0, 'finishing A1.1 leaves A1.2 at zero');
  await shot(page, '390-course-done');
  assert.deepEqual(errors, []); await ctx.close(); report.push('390: new → 1 lesson → topic → map/back → A1.2/A2 → A1.1 → reload → course done');
  // 7 · broken or foreign saved data: the route still draws from zero, no JS errors
  for (const bad of ['{broken', '[]', JSON.stringify({version: 1, completed: {'nope:x:0': 5, [first]: 'x'}, course: 'Z9'})]) {
   ({ctx, page, errors} = await open(390, 844, bad)); r = await route(page);
   assert(r.stops.length > 0 && r.stops.every(s => s.done === 0), 'bad save ' + bad.slice(0, 12) + ': zero route'); assert.equal(r.current.length, 1); assert.deepEqual(errors, []); await ctx.close();
  }
  report.push('broken saves: 3 variants → zero route, no errors');
  // 8 · five widths: no horizontal scroll, stops and the guides link are ≥ 44 px, focus outline is defined
  for (const [w, h] of [[360, 780], [390, 844], [430, 932], [1280, 800], [1440, 900]]) {
   ({ctx, page, errors} = await open(w, h)); await finish(page, 'c.lessons.indexOf(l)<3'); await page.waitForSelector('.hv-route details[open]');
   const s = await page.evaluate(() => ({hscroll: document.documentElement.scrollWidth > innerWidth,
    small: [...document.querySelectorAll('.hv-stop-button, .hv-route summary, .hv-benefits a')].filter(e => { const b = e.getBoundingClientRect(); return b.height < 44 }).map(e => e.textContent.slice(0, 20)),
    cols: getComputedStyle(document.querySelector('.hv-route-list')).gridTemplateColumns.split(' ').length}));
   assert(!s.hscroll, w + ': no horizontal scroll'); assert.deepEqual(s.small, [], w + ': targets ≥ 44 px'); assert.equal(s.cols, w < 768 ? 1 : 3, w + ': columns');
   await page.locator('.hv-stop-button').first().focus(); await page.keyboard.press('Shift+Tab'); await page.keyboard.press('Tab');
   const outline = await page.evaluate(() => { const e = document.activeElement; return e.classList.contains('hv-stop-button') ? getComputedStyle(e).outlineStyle : 'not-a-stop' });
   assert.equal(outline, 'solid', w + ': keyboard focus is visible on a stop');
   if ([360, 1440].includes(w)) await shot(page, w + '-three-lessons');
   assert.deepEqual(errors, []); await ctx.close(); report.push(w + ': ok');
  }
 } finally { await browser.close(); server.close() }
 for (const line of report) console.log('  ' + line);
 console.log('PASS: route edge cases — courses kept apart, XP untouched, map/back, reload, broken saves, calm home, 5 widths');
})().catch(e => { console.error(e); process.exit(1) });
