// Proposal (TEST-021): JSON manifests (home-visuals.json, LIFE visual-manifest.json, audio/*/manifest.json) are fetched
// network-first with a 3 s timeout and the cached copy as fallback; every other file keeps cache-first.
// Real service worker in Chromium on localhost (a copy of app/ + life/ that the test edits between page loads):
//  1 first run   2 repeat run   3 update from the previous version (old cache-first worker with a stale manifest)
//  4 no internet   5 server unavailable (503) and a hanging server   6 graphics update   7 audio-manifest update.
// Emulated browser, not a physical phone. Run: node tests/sw-manifests.cjs (skipped without Playwright).
const fs = require('node:fs'), path = require('node:path'), http = require('node:http'), os = require('node:os'), assert = require('node:assert/strict'), {execSync} = require('node:child_process');
const repo = path.join(__dirname, '..');
(async () => {
 const sw = fs.readFileSync(path.join(repo, 'app/sw.js'), 'utf8');
 assert(/const MANIFEST_RE = /.test(sw) && /freshManifest\(request\)/.test(sw), 'manifest strategy present');
 for (const p of ['/app/img/home/home-visuals.json', '/life/assets/lerenbe-life/visual-manifest.json', '/life/audio/nl/manifest.json', '/app/audio/nl-f/manifest.json']) assert(eval(sw.match(/const MANIFEST_RE = (\/.*\/);/)[1]).test(p), 'manifest: ' + p);
 for (const p of ['/app/dict/nl.json', '/app/modules/diphthongs/words.json', '/app/app.js', '/life/assets/lerenbe-life/manifest.json']) assert(!eval(sw.match(/const MANIFEST_RE = (\/.*\/);/)[1]).test(p), 'not a manifest (stays cache-first): ' + p);
 console.log('PASS: sw-manifests static — only the three kinds of manifests are network-first');
 let chromium; try { ({chromium} = require('playwright')) } catch { console.log('SKIP: browser part (Playwright is not installed)'); return }
 const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'sw-manifests-')), root = path.join(tmp, 'site');
 const deploy = () => { fs.rmSync(root, {recursive: true, force: true}); fs.mkdirSync(root); execSync(`cp -r "${repo}/app" "${repo}/life" "${root}/"`) };
 const edit = (f, fn) => { const p = path.join(root, f); fs.writeFileSync(p, fn(fs.readFileSync(p, 'utf8'))) };
 const json = (f, fn) => edit(f, s => JSON.stringify(fn(JSON.parse(s))));
 let mode = 'up';
 const T = {'.html': 'text/html', '.js': 'text/javascript', '.mjs': 'text/javascript', '.css': 'text/css', '.json': 'application/json', '.png': 'image/png', '.webp': 'image/webp', '.svg': 'image/svg+xml', '.m4a': 'audio/mp4', '.woff': 'font/woff', '.webmanifest': 'application/manifest+json'};
 const server = http.createServer((q, r) => {
  const u = new URL(q.url, 'http://x');
  if (mode === 'down') { r.statusCode = 503; return r.end('down') }
  if (mode === 'hang' && u.pathname.endsWith('.json')) return; // never answers
  let f = path.join(root, decodeURIComponent(u.pathname)); if (f.endsWith(path.sep)) f += 'index.html';
  if (!f.startsWith(root) || !fs.existsSync(f) || fs.statSync(f).isDirectory()) { r.statusCode = 404; return r.end() }
  r.setHeader('content-type', T[path.extname(f)] || 'application/octet-stream'); r.setHeader('cache-control', 'max-age=600'); fs.createReadStream(f).pipe(r);
 });
 await new Promise(r => server.listen(0, '127.0.0.1', r)); const B = 'http://localhost:' + server.address().port; // service workers need https or localhost
 let browser; try { browser = await chromium.launch() } catch { console.log('SKIP: no Chromium'); server.close(); return }
 const report = [];
 const get = (page, url) => page.evaluate(u => fetch(u, {cache: 'no-cache'}).then(r => r.ok ? r.json() : {status: r.status}).catch(e => ({error: String(e)})), url);
 async function controlled(ctx) {
  const page = await ctx.newPage(), errors = []; page.on('pageerror', e => errors.push(e.message));
  await page.addInitScript(() => { try { localStorage.setItem('leren_welcome_seen', 'true') } catch {} });
  await page.goto(B + '/app/'); await page.evaluate(() => navigator.serviceWorker.ready); await page.reload();
  await page.waitForFunction(() => !!navigator.serviceWorker.controller, null, {timeout: 20000}); return {page, errors};
 }
 const newCtx = async () => { const ctx = await browser.newContext({viewport: {width: 390, height: 844}}); await ctx.route(/^https?:\/\/(?!localhost|127\.0\.0\.1)/, r => r.abort()); return ctx };
 try {
  // ---- 1 first run, 2 repeat run, 6 graphics update, 7 audio manifest, 4 offline, 5 server unavailable
  {
   deploy(); const ctx = await newCtx(), {page, errors} = await controlled(ctx);
   const hv0 = await get(page, '/app/img/home/home-visuals.json'); assert(hv0.hero, 'first run: home-visuals.json');
   assert(await page.evaluate(() => caches.open(caches.keys().then ? 'x' : 'x').then(() => caches.keys()).then(async ks => { for (const k of ks) if (await (await caches.open(k)).match('/app/img/home/home-visuals.json')) return true; return false })), 'first run: cached for offline');
   await page.reload(); assert.deepEqual(await get(page, '/app/img/home/home-visuals.json'), hv0, 'repeat run: same manifest'); report.push('first run', 'repeat run');
   // 6 graphics update without a release: the HERO switches from the painted fallback to a picture on the next load
   assert.equal(await page.locator('.hv-hero').getAttribute('data-art'), hv0.hero.status === 'approved' ? 'image' : 'fallback');
   json('app/img/home/home-visuals.json', v => ({...v, marker: 'g1', hero: {...v.hero, status: 'approved', mobile: {src: 'img/home/hero-cat-v196-320.webp', status: 'approved', width: 320, height: 320}, desktop: {src: 'img/home/hero-cat-v196-320.webp', status: 'approved', width: 320, height: 320}}}));
   json('life/assets/lerenbe-life/visual-manifest.json', v => ({...v, marker: 'g1'}));
   await page.reload(); await page.waitForSelector('.hv-hero');
   assert.equal((await get(page, '/app/img/home/home-visuals.json')).marker, 'g1', 'graphics update: new home-visuals.json without a release');
   await page.waitForFunction(() => document.querySelector('.hv-hero')?.dataset.art === 'image', null, {timeout: 8000}); report.push('graphics update (HERO uses the new manifest)');
   // LIFE manifests are requested from a page this worker controls (after PR #9 the LIFE page itself; here the home)
   assert.equal((await get(page, '/life/assets/lerenbe-life/visual-manifest.json')).marker, 'g1', 'graphics update: new LIFE visual-manifest.json');
   // 7 audio manifest update
   json('life/audio/nl-f/manifest.json', a => [...a, 'deadbeef']);
   await page.reload(); await page.waitForSelector('.hv-hero');
   assert((await get(page, '/life/audio/nl-f/manifest.json')).includes('deadbeef'), 'audio manifest update without a release'); report.push('audio manifest update');
   await page.goto(B + '/app/learn-life-story.html?s=first-day'); await page.waitForSelector('.ls-hero h1'); await page.click('.ls-hero .ls-primary'); await page.waitForSelector('#app[data-scene] .ls-bubble');
   await page.goto(B + '/app/'); await page.waitForSelector('.fh-hero');
   // 4 no internet: pages open, manifests come from the last good copy
   await ctx.setOffline(true);
   await page.goto(B + '/app/'); await page.waitForSelector('.fh-hero'); assert.equal((await get(page, '/app/img/home/home-visuals.json')).marker, 'g1', 'offline: cached home-visuals.json');
   await page.goto(B + '/app/learn-life-story.html?s=first-day'); await page.waitForSelector('.ls-hero h1'); await page.click('.ls-hero .ls-primary'); await page.waitForSelector('#app[data-scene] .ls-bubble');
   await page.goto(B + '/app/'); await page.waitForSelector('.fh-hero');
   assert.equal((await get(page, '/life/assets/lerenbe-life/visual-manifest.json')).marker, 'g1', 'offline: cached LIFE manifest'); assert((await get(page, '/life/audio/nl-f/manifest.json')).includes('deadbeef'));
   await ctx.setOffline(false); report.push('offline');
   // 5 server unavailable: 503 and a hanging server → the last good copy (within the timeout)
   mode = 'down'; assert.equal((await get(page, '/app/img/home/home-visuals.json')).marker, 'g1', '503: last good copy');
   mode = 'hang'; const t0 = Date.now(); assert.equal((await get(page, '/app/img/home/home-visuals.json')).marker, 'g1', 'hanging server: last good copy'); const waited = Date.now() - t0;
   assert(waited >= 2500 && waited < 6000, 'timeout ~3 s: ' + waited); mode = 'up'; report.push('server 503 / hanging (' + Math.round(waited / 100) / 10 + ' s)');
   assert.deepEqual(errors, []); await ctx.close();
  }
  // ---- 3 update from the previous version: old cache-first worker with a stale manifest → this worker
  {
   deploy(); const prev = execSync('git show origin/main:app/sw.js', {cwd: repo}).toString();
   if (/freshManifest/.test(prev)) { console.log('NOTE: origin/main already has this strategy; previous-version check uses a cache-first copy of it'); }
   const fresh = fs.readFileSync(path.join(root, 'app/sw.js'), 'utf8');
   fs.writeFileSync(path.join(root, 'app/sw.js'), /freshManifest/.test(prev) ? prev.replace(/  if \(MANIFEST_RE\.test\(url\.pathname\)\) \{[\s\S]*?return;\n  \}\n\n/, '') : prev);
   const ctx = await newCtx(), {page, errors} = await controlled(ctx);
   json('app/img/home/home-visuals.json', v => ({...v, marker: 'u1'})); await page.reload();
   assert.notEqual((await get(page, '/app/img/home/home-visuals.json')).marker, 'u1', 'old worker: manifest stays stale (the problem)');
   fs.writeFileSync(path.join(root, 'app/sw.js'), fresh); // release with the new strategy (same cache name in this proposal)
   await page.evaluate(() => navigator.serviceWorker.ready.then(r => r.update())); await page.waitForTimeout(3000); await page.reload(); await page.waitForTimeout(800);
   assert.equal((await get(page, '/app/img/home/home-visuals.json')).marker, 'u1', 'after the update: fresh manifest');
   json('app/img/home/home-visuals.json', v => ({...v, marker: 'u2'})); await page.reload();
   assert.equal((await get(page, '/app/img/home/home-visuals.json')).marker, 'u2', 'and later changes arrive without a release');
   assert.deepEqual(errors, []); await ctx.close(); report.push('update from the previous version');
  }
  console.log('PASS: sw-manifests (real service worker, emulated Chromium) — ' + report.join(', '));
 } finally { await browser.close(); server.close(); fs.rmSync(tmp, {recursive: true, force: true}) }
})().catch(e => { console.error(e); process.exit(1) });
