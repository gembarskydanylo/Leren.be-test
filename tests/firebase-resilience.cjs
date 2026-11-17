// TEST-024 · Account sync and AI requests on a bad connection (app/ snapshot), with a FAKE Firebase SDK.
// No real Firebase, Google or AI request is made: gstatic modules are replaced by tiny local fakes, Firestore and the AI
// worker are local routes that never answer (or answer 404), and the snapshot's CSP is bypassed only inside this browser.
// Checks: a hung Firestore read ends in «sync error: no connection» (not an endless wait), the one-at-a-time sync queue
// is free again afterwards, a hung AI request is aborted, and concurrent SDK loads register a single auth listener.
const fs = require('node:fs'), path = require('node:path'), http = require('node:http'), assert = require('node:assert/strict');
const root = path.join(__dirname, '..', 'app'), app = fs.readFileSync(path.join(root, 'app.js'), 'utf8');
(async () => {
 assert(/function fetchT\(/.test(app), 'deadline helper exists');
 for (const re of [/fetchT\(docUrl\(id\)/g, /fetchT\("https:\/\/firestore\.googleapis\.com/g]) assert.equal((app.match(re) || []).length, 2, 'Firestore calls use the deadline: ' + re);
 assert(!/[^T]\(?fetch\("https:\/\/firestore/.test(app.replace(/fetchT\(/g, '')), 'no Firestore fetch without a deadline');
 // TEST-031: AI questions go through Lexi (app/modules/lexi/engine.js), whose transport LerenAICoach.request aborts at 45 s.
 const lexi = fs.readFileSync(path.join(root, 'modules/lexi/engine.js'), 'utf8');
 assert(/lexi\(\)\.send\(s\.scenario\|\|"grammar"/.test(app) && /timeout: extra\.timeout \|\| \(b\.mode === 'chat' \? 30000 : 45000\)/.test(lexi) && !/fetch\(AI_ENDPOINT/.test(app), 'AI questions use the deadline (through Lexi)');
 console.log('PASS: static — every Firestore request and the AI question go through fetchT');
 let chromium; try { ({chromium} = require('playwright')) } catch { console.log('SKIP: browser part (Playwright is not installed)'); return }
 const T = {'.html': 'text/html', '.js': 'text/javascript', '.mjs': 'text/javascript', '.css': 'text/css', '.json': 'application/json', '.webp': 'image/webp', '.png': 'image/png', '.svg': 'image/svg+xml', '.woff': 'font/woff', '.jpg': 'image/jpeg'};
 const server = http.createServer((q, r) => { let f = path.join(root, decodeURIComponent(new URL(q.url, 'http://x').pathname)); if (fs.existsSync(f) && fs.statSync(f).isDirectory()) f = path.join(f, 'index.html'); if (!f.startsWith(root) || !fs.existsSync(f)) { r.statusCode = 404; return r.end() } r.setHeader('content-type', T[path.extname(f)] || 'application/octet-stream'); fs.createReadStream(f).pipe(r) });
 await new Promise(r => server.listen(0, '127.0.0.1', r)); const LOCAL = 'http://127.0.0.1:' + server.address().port + '/';
 // TEST-028: account services open only on a production copy (lerenbe.com, no leren-env=beta marker; see
 // tests/firebase-isolation.cjs). The page is therefore served as https://lerenbe.com from the local files, inside this
 // browser only, with the marker removed from index.html; every Google / Firebase request is still a local fake.
 const B = 'https://lerenbe.com/', asProd = async r => { const res = await r.fetch({url: LOCAL + new URL(r.request().url()).pathname.slice(1)}); let body = await res.body();
  if (/\/(index\.html)?$/.test(new URL(r.request().url()).pathname)) body = body.toString('utf8').replace('<meta name="leren-env" content="beta">', '');
  return r.fulfill({response: res, body}) };
 let browser; try { browser = await chromium.launch() } catch { console.log('SKIP: no Chromium'); server.close(); return }
 const release = app.match(/RELEASE_VERSION="(\d+)"/)[1];
 // Like the real SDK, a second initializeApp with the same name throws. __fbInit counts the account / push app ("acct"),
// __fbApps every named app (on lerenbe.com App Check gets its own "appcheck" app).
 const FAKE_APP = 'export function initializeApp(o,n){const s=globalThis.__fbApps=globalThis.__fbApps||[];if(s.includes(n))throw new Error("duplicate-app "+n);s.push(n);if(n==="acct")globalThis.__fbInit=(globalThis.__fbInit||0)+1;return {options:o,name:n}}';
 const FAKE_APPCHECK = 'export class ReCaptchaEnterpriseProvider{constructor(k){this.k=k}}export function initializeAppCheck(app,o){globalThis.__fbAppCheck=(globalThis.__fbAppCheck||0)+1;return {app}}export async function getToken(){return {token:"fake-app-check"}}';
 const FAKE_AUTH = 'export function getAuth(app){return {app}}export function onAuthStateChanged(a,cb){globalThis.__fbListeners=(globalThis.__fbListeners||0)+1;setTimeout(()=>cb(globalThis.__fbUser===false?null:{uid:"fake-uid",getIdToken:async()=>"fake-token"}),5)}export async function signOut(){}';
 async function open(seed, firestore) {
  const ctx = await browser.newContext({viewport: {width: 390, height: 844}, serviceWorkers: 'block', bypassCSP: true}), page = await ctx.newPage(), errors = [], real = [], fsCalls = [];
  page.on('pageerror', e => errors.push(e.message));
  await ctx.route(/^https?:\/\/(?!127\.0\.0\.1)/, r => { const u = r.request().url();
   if (u.startsWith(B)) return asProd(r);
   if (u.startsWith('https://www.gstatic.com/firebasejs/')) return r.fulfill({contentType: 'text/javascript', body: /firebase-auth\.js$/.test(u) ? FAKE_AUTH : /firebase-app\.js$/.test(u) ? FAKE_APP : /firebase-app-check\.js$/.test(u) ? FAKE_APPCHECK : 'export {}'});
   if (u.startsWith('https://firestore.googleapis.com/')) { fsCalls.push(r.request().method()); return firestore(r) }
   if (u.startsWith('https://leren-ai.')) return; // AI worker: never answers
   real.push(u); r.abort() });
  await page.addInitScript(([rel, seed]) => { if (sessionStorage.getItem('s')) return; sessionStorage.setItem('s', '1'); localStorage.clear();
   for (const [k, v] of Object.entries({leren_release_seen: JSON.stringify(rel), poly_ui: 'uk', leren_home_v1: 'path', leren_welcome_seen: 'true', leren_onboarding_language_v1: '1', leren_start_known_v1: 'zero', ...seed})) localStorage.setItem(k, v) }, [release, seed]);
  await page.clock.install(); await page.goto(B); await page.clock.runFor(3000); await page.waitForSelector('.hv');
  return {ctx, page, errors, real, fsCalls};
 }
 try {
  // 1 · returning signed-in user, Firestore never answers: within the deadline the status becomes an error with a retry.
  let mode = 'hang';
  const {ctx, page, errors, real, fsCalls} = await open({leren_acct: 'true'}, r => mode === 'hang' ? undefined : r.fulfill({status: 404, contentType: 'application/json', body: '{}'}));
  await page.clock.runFor(1000);
  assert.equal(await page.evaluate(() => typeof acct === 'object' && !!acct.user), true, 'fake user signed in'); assert.deepEqual(fsCalls, ['GET'], 'one read started');
  assert.equal(await page.evaluate(() => !acct.err), true, 'still waiting before the deadline');
  await page.clock.runFor(21000); await page.waitForFunction(() => acct.err === 'network', null, {timeout: 5000});
  assert.equal(await page.evaluate(() => syncStatus()), 'error');
  // 2 · the connection is back (Firestore answers 404 = no cloud copy yet): the retry reads and then writes.
  mode = 'ok'; await page.clock.runFor(60000); // every queued read that was hanging hits its own deadline, then the retry runs await page.waitForFunction(() => acct.err === '', null, {timeout: 5000});
  assert(fsCalls.length >= 3 && fsCalls.includes('PATCH'), 'retry read + first write: ' + fsCalls.join(','));
  assert.equal(await page.evaluate(() => [globalThis.__fbListeners, globalThis.__fbInit, globalThis.__fbAppCheck, globalThis.__fbApps.sort()].join()), '1,1,2,acct,appcheck', 'one SDK load on start-up; App Check once per named app (acct, appcheck)');
  assert.deepEqual(real, [], 'no real external request'); assert.deepEqual(errors, []); await ctx.close();
 } catch (e) { throw e }
 try {
  // 4 · concurrent loads (returning user + e-mail link at start-up) share one SDK load and one auth listener.
  const {ctx, page, errors, real} = await open({}, r => r.fulfill({status: 404, contentType: 'application/json', body: '{}'}));
  await page.evaluate(() => { globalThis.__fbUser = false; return Promise.all([acctLoad(), acctLoad(), acctLoad()]) });
  assert.equal(await page.evaluate(() => [globalThis.__fbListeners, globalThis.__fbInit].join()), '1,1', 'three concurrent loads → one listener, one app');
  assert.equal(await page.evaluate(() => acctLoad().then(m => m === acct.mod)), true, 'later calls get the loaded module');
  // 5 · the AI deadline really aborts a request that never answers.
  const t0 = await page.evaluate(() => Date.now());
  const pending = page.evaluate(() => fetchT(AI_ENDPOINT, {method: 'POST', body: '{}'}, 45000).then(() => 'answered', e => e.name));
  await page.clock.runFor(46000); assert.equal(await pending, 'AbortError', 'hung AI request ends with AbortError (the chat shows its error and unlocks)');
  assert(await page.evaluate(t0 => Date.now() - t0 >= 45000, t0));
  assert.deepEqual(real, []); assert.deepEqual(errors, []); await ctx.close();
 } finally { await browser.close(); server.close() }
 console.log('PASS: fake Firebase — hung Firestore read ends in a «network» error after 20 s, queue freed, retry reads and writes; concurrent SDK loads → 1 listener; hung AI request aborted at 45 s; no real external request');
})().catch(e => { console.error(e); process.exit(1) });
