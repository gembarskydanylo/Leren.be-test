// TEST-024 · The beta snapshot (app/) never talks to production services (app/README.md: «Ізоляція»).
// Before TEST-024 app/reviews.html kept the production CSP and loaded reviews.js: on github.io it signed visitors in
// anonymously in the live Firebase project «leren-be», read and wrote reviews and started App Check on an unregistered
// domain; app/privacy.html sent visits to production Cloudflare analytics. Static: every page's CSP allows only 'self'
// for scripts, connections and frames, no external <script src>, top-level pages are noindex. Browser: opening every
// page (and following the home's «Відгуки» link) makes no request outside the test server.
const fs = require('node:fs'), path = require('node:path'), http = require('node:http'), assert = require('node:assert/strict');
const repo = path.join(__dirname, '..'), app = path.join(repo, 'app');
const pages = []; (function walk(d) { for (const f of fs.readdirSync(d)) { const p = path.join(d, f); if (fs.statSync(p).isDirectory()) { if (f !== 'audio') walk(p) } else if (f.endsWith('.html')) pages.push(path.relative(app, p)) } })(app);
(async () => {
 const top = ['index.html', 'learn-life.html', 'learn-life-story.html', 'reviews.html', 'privacy.html', ...pages.filter(p => p.startsWith('guides/'))];
 for (const p of pages) {
  const s = fs.readFileSync(path.join(app, p), 'utf8'), csp = s.match(/http-equiv="Content-Security-Policy" content="([^"]+)"/)?.[1];
  if (top.includes(p)) assert(csp, p + ': has a CSP');
  if (csp) { const dir = n => (csp.match(new RegExp('(?:^|;)\\s*' + n + '\\s+([^;]+)')) || [])[1];
   for (const n of ['script-src', 'connect-src', 'frame-src']) { const v = dir(n) ?? dir('default-src'); assert(v && v.trim().split(/\s+/).every(x => ["'self'", "'none'"].includes(x)), p + ': ' + n + ' only self (' + v + ')') }
   assert(!/https?:/.test(dir('default-src') || ''), p + ': default-src only self') }
  assert(!/<script[^>]+src=["']https?:/i.test(s), p + ': no external script');
  assert(!/firebasejs|firestore\.googleapis|workers\.dev|cloudflareinsights/.test(s.replace(/<!--[\s\S]*?-->/g, '')), p + ': no production endpoint in the page');
  if (top.includes(p)) assert(/<meta name="robots" content="noindex,nofollow">/.test(s), p + ': noindex');
 }
 assert(!fs.readFileSync(path.join(app, 'reviews.html'), 'utf8').includes('reviews.js'), 'reviews.js (live Firebase) is not loaded in the snapshot');
 console.log('PASS: static — ' + pages.length + ' pages: CSP script/connect/frame = self, no external scripts or production endpoints, ' + top.length + ' top-level pages noindex');
 let chromium; try { ({chromium} = require('playwright')) } catch { console.log('SKIP: browser part (Playwright is not installed)'); return }
 const T = {'.html': 'text/html', '.js': 'text/javascript', '.mjs': 'text/javascript', '.css': 'text/css', '.json': 'application/json', '.webp': 'image/webp', '.png': 'image/png', '.svg': 'image/svg+xml', '.woff': 'font/woff', '.jpg': 'image/jpeg', '.m4a': 'audio/mp4'};
 const server = http.createServer((q, r) => { let f = path.join(repo, decodeURIComponent(new URL(q.url, 'http://x').pathname)); if (fs.existsSync(f) && fs.statSync(f).isDirectory()) f = path.join(f, 'index.html'); if (!f.startsWith(repo) || !fs.existsSync(f)) { r.statusCode = 404; return r.end() } r.setHeader('content-type', T[path.extname(f)] || 'application/octet-stream'); fs.createReadStream(f).pipe(r) });
 await new Promise(r => server.listen(0, '127.0.0.1', r)); const B = 'http://127.0.0.1:' + server.address().port + '/app/';
 let browser; try { browser = await chromium.launch() } catch { console.log('SKIP: no Chromium'); server.close(); return }
 const release = fs.readFileSync(path.join(app, 'app.js'), 'utf8').match(/RELEASE_VERSION="(\d+)"/)[1];
 try {
  const ctx = await browser.newContext({viewport: {width: 390, height: 844}, serviceWorkers: 'block'}), outside = [], errors = [];
  ctx.on('request', q => { if (!q.url().startsWith('http://127.0.0.1')) outside.push(q.url()) }); await ctx.route(/^https?:\/\/(?!127\.0\.0\.1)/, r => r.abort());
  await ctx.addInitScript(rel => { if (sessionStorage.getItem('s')) return; sessionStorage.setItem('s', '1'); for (const [k, v] of Object.entries({leren_release_seen: JSON.stringify(rel), poly_ui: 'uk', leren_home_v1: 'path', leren_welcome_seen: 'true', leren_onboarding_language_v1: '1', leren_start_known_v1: 'zero', leren_home_all_v1: '1'})) localStorage.setItem(k, v) }, release);
  const page = await ctx.newPage(); page.on('pageerror', e => errors.push(e.message));
  for (const p of top) { await page.goto(B + p); await page.waitForLoadState('load'); await page.waitForTimeout(p === 'index.html' ? 1500 : 300) }
  // The home's reviews link opens the static page: a short note, no form that could put a review into the URL.
  await page.goto(B + 'reviews.html?lang=uk');
  assert(await page.locator('.test-note').isVisible()); assert.equal(await page.locator('#reviewForm').isVisible(), false); assert.equal(await page.locator('#adminLogin').isVisible(), false);
  assert.deepEqual(outside, [], 'no request leaves the test server'); assert.deepEqual(errors, []);
  await ctx.close();
 } finally { await browser.close(); server.close() }
 console.log('PASS: browser — ' + top.length + ' pages opened, no request outside the test server, reviews page is static with a note');
})().catch(e => { console.error(e); process.exit(1) });
