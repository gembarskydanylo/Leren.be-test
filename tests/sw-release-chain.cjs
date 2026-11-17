// TEST-028 · Release chain of the Service Worker across the branches that became this integration.
// Static (needs the git refs; skipped where they are missing, e.g. a shallow CI clone): this tree's cache name is used
// by no other ref and is higher than every release found in the refs — two different releases with the same cache
// name would leave learners on stale files (TEST-023 and TEST-024 both used leren-be-v231; neither was deployed, the
// integration release replaces both). Collisions between other refs are listed as information.
// Browser (real worker, Chromium on localhost, emulated): a learner with XP, lesson progress and LIFE XP goes through
// CHAIN (default origin/main → pr/13 → pr/14 → this tree, i.e. 230 → 231 → 250 → this release): every step installs
// the new cache only, shows the update bar (no automatic reload), one tap → the new release, and keeps XP, lesson
// progress and LIFE XP. At the end, offline: home, the LIFE story in uk and in en (translation loaded from the cache)
// and the fence page.
const fs = require('node:fs'), path = require('node:path'), http = require('node:http'), os = require('node:os'), vm = require('node:vm'), assert = require('node:assert/strict'), {execSync} = require('node:child_process');
const repo = path.join(__dirname, '..'), sh = c => execSync(c, {cwd: repo, encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'], maxBuffer: 1e8});
const cacheOf = src => (src.match(/const CACHE_NAME = "(leren-be-v\d+)"/) || [])[1];
const name = cacheOf(fs.readFileSync(path.join(repo, 'app/sw.js'), 'utf8')), num = s => +String(s).replace(/\D+/g, '');
(async () => {
 // ---- static: uniqueness against every ref
 let refs = []; try { refs = sh("git for-each-ref '--format=%(refname)' refs/remotes refs/heads").split('\n').filter(Boolean) } catch {}
 const byCache = new Map(), head = (() => { try { return sh('git rev-parse HEAD:app').trim() } catch { return '' } })();
 for (const r of refs) { let src, tree; try { src = sh(`git show ${r}:app/sw.js`); tree = sh(`git rev-parse ${r}:app`).trim() } catch { continue } const c = cacheOf(src); if (!c) continue; if (!byCache.has(c)) byCache.set(c, new Map()); byCache.get(c).set(tree, (byCache.get(c).get(tree) || []).concat(r)) }
 if (byCache.size) {
  const others = [...(byCache.get(name) || new Map())].filter(([tree]) => tree !== head);
  assert.deepEqual(others.map(([, r]) => r), [], name + ' is used by another ref with different app/ files');
  const top = Math.max(...[...byCache.keys()].filter(c => c !== name).map(num));
  assert(num(name) > top, name + ' is higher than every other release in the refs (' + top + ')');
  const dup = [...byCache].filter(([c, m]) => c !== name && m.size > 1).map(([c, m]) => c + ': ' + [...m.values()].map(r => r.join('|')).join(' ≠ '));
  console.log('PASS: static — ' + name + ' unique and above all ' + byCache.size + ' cache names in ' + refs.length + ' refs' + (dup.length ? '; other refs that share a cache name with different files (never deploy both): ' + dup.join('; ') : ''));
 } else console.log('SKIP: static (no git refs)');

 let chromium; try { ({chromium} = require('playwright')) } catch { console.log('SKIP: browser part (Playwright is not installed)'); return }
 const chain = (process.env.CHAIN || 'origin/main,pr/13,pr/14').split(',').filter(r => { try { sh(`git rev-parse --verify ${r}`); return true } catch { return false } });
 if (!chain.length) { console.log('SKIP: browser part (no previous releases)'); return }
 const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'sw-chain-')), root = path.join(tmp, 'site');
 const deploy = ref => { fs.rmSync(root, {recursive: true, force: true}); fs.mkdirSync(root); if (ref) execSync(`git -C "${repo}" archive ${ref} app life | tar -x -C "${root}"`); else execSync(`cp -r "${repo}/app" "${repo}/life" "${root}/"`) };
 let offline = false;
 const T = {'.html': 'text/html', '.js': 'text/javascript', '.mjs': 'text/javascript', '.css': 'text/css', '.json': 'application/json', '.png': 'image/png', '.webp': 'image/webp', '.jpg': 'image/jpeg', '.svg': 'image/svg+xml', '.m4a': 'audio/mp4', '.woff': 'font/woff', '.webmanifest': 'application/manifest+json'};
 const server = http.createServer((q, r) => { if (offline) { q.socket.destroy(); return }
  let f = path.join(root, decodeURIComponent(new URL(q.url, 'http://x').pathname)); if (f.endsWith(path.sep)) f += 'index.html';
  if (!f.startsWith(root) || !fs.existsSync(f) || fs.statSync(f).isDirectory()) { r.statusCode = 404; return r.end() }
  r.setHeader('content-type', T[path.extname(f)] || 'application/octet-stream'); r.setHeader('cache-control', 'max-age=600'); fs.createReadStream(f).pipe(r) });
 await new Promise(r => server.listen(0, '127.0.0.1', r)); const B = 'http://localhost:' + server.address().port + '/app/';
 let browser; try { browser = await chromium.launch() } catch { console.log('SKIP: no Chromium'); server.close(); return }
 const ctx = await browser.newContext({viewport: {width: 390, height: 844}}), page = await ctx.newPage(), errors = [], navs = [], steps = [];
 page.on('pageerror', e => errors.push(e.message)); page.on('framenavigated', f => { if (f === page.mainFrame()) navs.push(Date.now()) });
 await ctx.route(/^https?:\/\/(?!localhost)/, r => r.abort());
 const poll = async (fn, arg, ms, label) => { const end = Date.now() + ms; let v; while (Date.now() < end) { v = await page.evaluate(fn, arg).catch(() => false); if (v) return v; await page.waitForTimeout(250) } assert.fail('timeout: ' + label) };
 const rel = () => page.evaluate(() => typeof RELEASE_VERSION === 'string' ? RELEASE_VERSION : '');
 const kept = () => page.evaluate(() => ['poly_score', 'leren_path_v1', 'leren_life_xp_v1', 'leren_learn_life_v1_fence-neighbour'].map(k => localStorage.getItem(k)));
 try {
  // 1 · the first release of the chain installed; a learner with XP, a finished lesson, LIFE XP and fence progress.
  deploy(chain[0]);
  await page.addInitScript(() => { if (localStorage.getItem('seeded')) return; localStorage.setItem('seeded', '1');
   for (const [k, v] of Object.entries({poly_ui: 'uk', leren_home_v1: 'path', leren_welcome_seen: 'true', leren_onboarding_language_v1: '1', leren_start_known_v1: 'zero', poly_score: '35', leren_release_seen: '"999"',
    leren_life_xp_v1: JSON.stringify({'first-day:station': 40}), 'leren_learn_life_v1_fence-neighbour': JSON.stringify({done: ['mark-1'], missed: [], spoken: [], favourites: []})})) localStorage.setItem(k, v) });
  await page.goto(B); await page.waitForFunction(() => navigator.serviceWorker.controller, null, {timeout: 30000}).catch(async () => { await page.reload(); await page.waitForFunction(() => navigator.serviceWorker.controller, null, {timeout: 30000}) });
  let cur = await poll(() => caches.keys().then(k => k.length === 1 && k[0]), null, 60000, 'first cache');
  await page.reload(); await page.waitForSelector('.hv');
  await page.evaluate(() => { const m = learningPath.model, l = m.recommended(); m.start(); m.state.completed[l.id] = l.ids.length; m.save() });
  const want = await kept(); steps.push(cur);
  // 2 · every next release of the chain, then this tree: update → bar → one tap.
  for (const ref of [...chain.slice(1), null]) {
   deploy(ref); const next = cacheOf(fs.readFileSync(path.join(root, 'app/sw.js'), 'utf8'));
   if (next === cur) { steps.push(next + ' (same cache name: no update reaches the learner)'); continue }
   const before = navs.length;
   await page.evaluate(() => navigator.serviceWorker.getRegistration().then(r => r.update()));
   await poll(n => caches.keys().then(k => k.includes(n)), next, 90000, next + ' installed');
   await page.waitForSelector('#updBar', {timeout: 30000}); assert.equal(navs.length, before, next + ': no automatic reload');
   await page.click('#updBar .btn.primary'); await page.waitForLoadState('load'); await page.waitForSelector('.hv');
   assert.equal(await rel(), String(num(next)), next + ': new release after one tap');
   await poll(n => caches.keys().then(k => k.length === 1 && k[0] === n), next, 20000, next + ': only its cache');
   assert.deepEqual(await kept(), want, next + ': XP, lesson progress, LIFE XP and fence progress kept');
   const n0 = navs.length; await page.waitForTimeout(1500); assert.equal(navs.length, n0, next + ': no reload loop');
   cur = next; steps.push(next);
  }
  assert.equal(cur, name, 'the chain ends on this release');
  // 3 · offline: home, LIFE story (uk and en: the translation comes from the cache), fence page.
  offline = true; await ctx.setOffline(true);
  await page.reload(); await page.waitForSelector('.hv', {timeout: 20000});
  await page.goto(B + 'learn-life-story.html?s=first-day'); await poll(() => !!document.querySelector('.ls-hero'), null, 20000, 'LIFE uk offline');
  await page.goto(B + 'learn-life-story.html?s=first-day&lang=en'); await poll(() => document.querySelector('.ls-hero .ls-primary')?.textContent.includes('story') && document.documentElement.lang === 'en', null, 20000, 'LIFE en offline (dictionary cached)');
  await page.goto(B + 'learn-life.html?lang=fr'); await poll(() => !!document.querySelector('.ll-choice') && document.documentElement.lang === 'fr', null, 20000, 'fence page fr offline');
  assert.equal(await page.textContent('#heroProgress'), '1 / 20', 'fence progress kept offline');
  assert.deepEqual(errors, []);
 } finally { await browser.close(); server.close(); fs.rmSync(tmp, {recursive: true, force: true}) }
 console.log('PASS: real worker — ' + steps.join(' → ') + ': one cache at a time, update bar each step, XP / lessons / LIFE XP / fence progress kept; offline home, LIFE uk + en, fence fr');
})().catch(e => { console.error(e); process.exit(1) });
