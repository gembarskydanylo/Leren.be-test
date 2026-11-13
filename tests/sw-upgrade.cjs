// TEST-024 · Service worker: precache list = what the pages really load, and an update from the previous release.
// Static: every precached file exists; every versioned script/style of index.html, learn-life.html and
// learn-life-story.html (which loads LIFE from ../life/ through <base>) is precached with the same ?v=, and so is the whole
// LIFE import chain; the cache name is the release. Before TEST-024 the worker precached unused app/modules/learn-life
// copies (?v=2/3) and not the LIFE files in use (?v=5-quality), plus four snapshot-missing audio files and three images.
// Browser (real worker, Chromium on localhost, emulated — not a phone): install the previous release (origin/main or
// PREV=<git ref>), keep a learner's progress, deploy this tree, update: new cache only, the update bar (no automatic
// reload, no reload loop), one tap → new release, progress kept; then offline: home and LIFE open from the cache.
const fs = require('node:fs'), path = require('node:path'), http = require('node:http'), os = require('node:os'), vm = require('node:vm'), assert = require('node:assert/strict'), {execSync} = require('node:child_process');
const repo = path.join(__dirname, '..'), app = path.join(repo, 'app');
const swList = dir => { const c = {self: {addEventListener() {}, location: {hostname: 'x'}}, caches: {}, fetch() {}, URL, console}; vm.createContext(c);
 vm.runInContext(fs.readFileSync(path.join(dir, 'sw.js'), 'utf8').replace(/const (CACHE_NAME|APP_FILES)/g, 'var $1'), c); return {name: c.CACHE_NAME, files: JSON.parse(JSON.stringify(c.APP_FILES))} };
(async () => {
 const {name, files} = swList(app), norm = u => path.posix.normalize(u), set = new Set(files.map(norm));
 assert.equal(name, 'leren-be-v' + fs.readFileSync(path.join(app, 'app.js'), 'utf8').match(/RELEASE_VERSION="(\d+)"/)[1], 'cache name = release');
 const onDisk = f => { const p = f.split('?')[0]; return fs.existsSync(path.join(app, p === './' ? 'index.html' : p)) };
 assert.deepEqual(files.filter(f => !onDisk(f)), [], 'every precached file exists');
 assert.equal(new Set(files).size, files.length, 'no duplicate entries');
 const want = new Set();
 for (const [page, base] of [['index.html', './'], ['learn-life.html', './'], ['learn-life-story.html', '../life/']]) {
  const h = fs.readFileSync(path.join(app, page), 'utf8'); for (const m of h.matchAll(/(?:src|href)="(\.\/[^"]+\?v=[^"]+)"/g)) want.add(norm(base + m[1]));
 }
 // LIFE: follow the ES module imports from the entry points (relative to each file, with their own ?v=).
 const queue = [...want].filter(u => u.endsWith('.mjs') || u.includes('.mjs?'));
 while (queue.length) { const u = queue.pop(), file = path.join(app, u.split('?')[0]); if (!fs.existsSync(file)) continue;
  for (const m of fs.readFileSync(file, 'utf8').matchAll(/(?:from|import)\s*['"](\.{1,2}\/[^'"]+)['"]/g)) { const v = norm(path.posix.join(path.posix.dirname(u), m[1])); const r = v.startsWith('.') ? v : './' + v; if (!want.has(r)) { want.add(r); queue.push(r) } } }
 const rel = u => u.startsWith('.') ? u : './' + u;
 assert.deepEqual([...want].map(rel).filter(u => !set.has(norm(u))), [], 'every versioned file the pages load is precached with the same ?v=');
 assert(![...set].some(f => /^modules\/learn-life\/(story|stories)/.test(f)), 'no unused app/ LIFE copies in the precache');
 console.log('PASS: static — ' + files.length + ' precached files exist, ' + want.size + ' versioned page/LIFE files precached with matching ?v=, cache = release');
 let chromium; try { ({chromium} = require('playwright')) } catch { console.log('SKIP: browser part (Playwright is not installed)'); return }
 const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'sw-upgrade-')), root = path.join(tmp, 'site'), prev = process.env.PREV || 'origin/main';
 try { execSync(`git -C "${repo}" rev-parse --verify ${prev}`, {stdio: 'ignore'}) } catch { console.log('SKIP: browser part (no previous release ' + prev + ')'); return }
 const deployPrev = () => { fs.rmSync(root, {recursive: true, force: true}); fs.mkdirSync(root); execSync(`git -C "${repo}" archive ${prev} app life | tar -x -C "${root}"`) };
 const deployNow = () => { fs.rmSync(root, {recursive: true, force: true}); fs.mkdirSync(root); execSync(`cp -r "${repo}/app" "${repo}/life" "${root}/"`) };
 const prevName = (() => { deployPrev(); return swList(path.join(root, 'app')).name })();
 if (prevName === name) { console.log('SKIP: browser part (' + prev + ' already has ' + name + ')'); return }
 let offline = false;
 const T = {'.html': 'text/html', '.js': 'text/javascript', '.mjs': 'text/javascript', '.css': 'text/css', '.json': 'application/json', '.png': 'image/png', '.webp': 'image/webp', '.jpg': 'image/jpeg', '.svg': 'image/svg+xml', '.m4a': 'audio/mp4', '.woff': 'font/woff', '.webmanifest': 'application/manifest+json'};
 const server = http.createServer((q, r) => { if (offline) { q.socket.destroy(); return }
  let f = path.join(root, decodeURIComponent(new URL(q.url, 'http://x').pathname)); if (f.endsWith(path.sep)) f += 'index.html';
  if (!f.startsWith(root) || !fs.existsSync(f) || fs.statSync(f).isDirectory()) { r.statusCode = 404; return r.end() }
  r.setHeader('content-type', T[path.extname(f)] || 'application/octet-stream'); r.setHeader('cache-control', 'max-age=600'); fs.createReadStream(f).pipe(r) });
 await new Promise(r => server.listen(0, '127.0.0.1', r)); const B = 'http://localhost:' + server.address().port + '/app/';
 let browser; try { browser = await chromium.launch() } catch { console.log('SKIP: no Chromium'); server.close(); return }
 const ctx = await browser.newContext({viewport: {width: 390, height: 844}}), page = await ctx.newPage(), errors = [], navs = [];
 page.on('pageerror', e => errors.push(e.message)); page.on('framenavigated', f => { if (f === page.mainFrame()) navs.push(Date.now()) });
 await ctx.route(/^https?:\/\/(?!localhost)/, r => r.abort());
 const poll = async (fn, arg, ms, label) => { const end = Date.now() + ms; let v; while (Date.now() < end) { v = await page.evaluate(fn, arg).catch(() => false); if (v) return v; await page.waitForTimeout(250) } assert.fail('timeout: ' + label) };
 const caches = () => page.evaluate(() => caches.keys()), rel_ = () => page.evaluate(() => typeof RELEASE_VERSION === 'string' ? RELEASE_VERSION : '');
 try {
  // 1 · previous release installed and controlling, a learner with progress.
  await page.addInitScript(() => { if (localStorage.getItem('seeded')) return; localStorage.setItem('seeded', '1');
   for (const [k, v] of Object.entries({poly_ui: 'uk', leren_home_v1: 'path', leren_welcome_seen: 'true', leren_onboarding_language_v1: '1', leren_start_known_v1: 'zero', poly_score: '35', leren_release_seen: '"999"'})) localStorage.setItem(k, v) });
  await page.goto(B); await page.waitForFunction(() => navigator.serviceWorker.controller, null, {timeout: 30000}).catch(async () => { await page.reload(); await page.waitForFunction(() => navigator.serviceWorker.controller, null, {timeout: 30000}) });
  await poll(n => caches.keys().then(k => k.includes(n)), prevName, 60000, 'previous cache installed');
  await page.reload(); await page.waitForSelector('.hv'); // a returning visit: the page starts under the old worker (a first install is not an update)
  assert(await page.evaluate(() => !!navigator.serviceWorker.controller));
  await page.evaluate(() => { const m = learningPath.model, l = m.recommended(); m.start(); m.state.completed[l.id] = l.ids.length; m.save() });
  const progress = await page.evaluate(() => localStorage.getItem('leren_path_v1')); const oldRelease = await rel_();
  // 2 · deploy this tree; the open app checks for an update (as on return to the tab).
  deployNow(); const before = navs.length;
  await page.evaluate(() => navigator.serviceWorker.getRegistration().then(r => r.update()));
  await poll(n => caches.keys().then(k => k.includes(n)), name, 90000, 'new cache installed');
  await page.waitForSelector('#updBar', {timeout: 30000});
  assert.equal(navs.length, before, 'no automatic reload on update'); await poll(n => caches.keys().then(k => k.length === 1 && k[0] === n), name, 20000, 'only the new cache').catch(() => {}); assert.deepEqual(await caches(), [name], 'old cache removed by activate (controllerchange comes first, so wait), only ' + name);
  assert.equal(await rel_(), oldRelease, 'page stays on the old release until the learner taps');
  // 3 · one tap → the new release, progress kept, no reload loop.
  await page.click('#updBar .btn.primary'); await page.waitForLoadState('load'); await page.waitForSelector('.hv');
  assert.equal(await rel_(), name.replace(/\D+/g, ''), 'new release after one tap');
  assert.equal(await page.evaluate(() => localStorage.getItem('leren_path_v1')), progress, 'route progress kept'); assert.equal(await page.evaluate(() => localStorage.getItem('poly_score')), '35', 'XP kept');
  const n0 = navs.length; await page.waitForTimeout(4000); assert.equal(navs.length, n0, 'no reload loop'); assert.equal(await page.locator('#updBar').count(), 0, 'no second update bar');
  // 4 · offline: home and LIFE open from the cache without a prior LIFE visit.
  offline = true; await ctx.setOffline(true);
  await page.reload(); await page.waitForSelector('.hv', {timeout: 20000}).catch(() => assert.fail('home offline'));
  await page.goto(B + 'learn-life-story.html?s=first-day'); await poll(() => document.querySelector('#app')?.children.length > 0, null, 20000, 'LIFE renders offline (not the home)'); assert.equal(await page.locator('.hv').count(), 0, 'offline LIFE link opens LIFE, not the home');
  assert.deepEqual(errors, []);
 } finally { await browser.close(); server.close(); fs.rmSync(tmp, {recursive: true, force: true}) }
 console.log('PASS: real worker — ' + prevName + ' → ' + name + ': only the new cache, update bar (no automatic reload, no loop), progress + XP kept, home and LIFE offline');
})().catch(e => { console.error(e); process.exit(1) });
