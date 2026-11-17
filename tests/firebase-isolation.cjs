// TEST-028 · The beta snapshot never reaches the production Firebase project — in code, not only through the CSP.
// app.js opens production services (Firebase SDK, Auth, Firestore users/ and subs/, App Check, push) only when
// prodServices() is true: hostname lerenbe.com (or a subdomain) AND no <meta name="leren-env" content="beta">.
// Static: every entry point is counted and guarded, so a new unguarded one fails here. Browser: with the CSP removed
// (as if it were loosened by mistake) the beta page on the test host and on beta.lerenbe.com sends no request to
// Google / Firebase while sign-in, sync and reminders are tried; a production copy (lerenbe.com, no marker) opens.
const fs = require('node:fs'), path = require('node:path'), assert = require('node:assert/strict');
const repo = path.join(__dirname, '..'), app = fs.readFileSync(path.join(repo, 'app/app.js'), 'utf8'), html = fs.readFileSync(path.join(repo, 'app/index.html'), 'utf8');
// ---- static
assert(/<meta name="leren-env" content="beta">/.test(html), 'the beta snapshot is marked leren-env=beta');
assert(/function prodServices\(\)\{try\{return \/\(\^\|\\\.\)lerenbe\\\.com\$\/\.test\(location\.hostname\)&&document\.querySelector\('meta\[name="leren-env"\]'\)\?\.content!=="beta"\}catch\(e\)\{return false\}\}/.test(app), 'prodServices(): lerenbe.com and not beta, false on any error');
const count = re => (app.match(re) || []).length;
// Every place that loads the Firebase SDK or calls Firestore. A new one must be guarded and counted here.
assert.equal(count(/import\(FB_SDK\+/g), 6, 'Firebase SDK imports: push app + auth, App Check app, fbApp App Check, account app + auth');
assert.equal(count(/https:\/\/firestore\.googleapis\.com/g), 3, 'Firestore endpoints: docUrl (subs), fsUserDoc, syncWrite');
const guards = [
 [/const pushReady=\(\)=>!!\(prodServices\(\)&&/, 'push reminders hidden and off'],
 [/function docUrl\(id\)\{prodOnly\(\);return "https:\/\/firestore/, 'subs/ documents'],
 [/pushAuthP=\(async\(\)=>\{prodOnly\(\);const \[a,b\]=await Promise\.all\(\[import\(FB_SDK/, 'anonymous push sign-in'],
 [/async function fbApp\(a,name\)\{\n prodOnly\(\);/, 'every Firebase app'],
 [/function appCheckHeaders\(h\)\{\n if\(!prodServices\(\)\)return Promise\.resolve\(h\);/, 'App Check'],
 [/prodOnly\(\);const \[a,b\]=await Promise\.all\(\[import\(FB_SDK\+"firebase-app\.js"\),import\(FB_SDK\+"firebase-auth\.js"\)\]\);\n  acct\.auth=/, 'account sign-in'],
 [/async function fsUserDoc\(method,body\)\{\n prodOnly\(\);/, 'users/ read, delete'],
 [/async function syncWrite\(snap\)\{\n if\(!prodServices\(\)\)return syncFail\("denied"\);/, 'users/ write'],
];
for (const [re, what] of guards) assert(re.test(app), 'guarded: ' + what);
// the App Check import sits behind appCheckHeaders' guard; the other SDK imports behind prodOnly()
assert(/if\(!prodServices\(\)\)return Promise\.resolve\(h\);\n if\(!appCheckP\)appCheckP=import\(FB_SDK/.test(app), 'App Check SDK import only after the guard');
console.log('PASS: static — beta marker, prodServices() rule, 6 SDK imports and 3 Firestore endpoints all behind the guard');

(async () => {
 let chromium; try { ({chromium} = require('playwright')) } catch { console.log('SKIP: browser part (Playwright is not installed)'); return }
 let browser; try { browser = await chromium.launch() } catch { console.log('SKIP: no Chromium'); return }
 const T = {'.html': 'text/html', '.js': 'text/javascript', '.mjs': 'text/javascript', '.css': 'text/css', '.json': 'application/json', '.webp': 'image/webp', '.png': 'image/png', '.svg': 'image/svg+xml', '.woff': 'font/woff', '.jpg': 'image/jpeg', '.m4a': 'audio/mp4'};
 // Serves the repository for any origin; index.html without its CSP and, for the production case, without the marker.
 const serve = (origin, {marker}) => async route => {
  const u = new URL(route.request().url()); if (u.origin !== origin) return route.continue();
  let f = path.join(repo, decodeURIComponent(u.pathname)); if (fs.existsSync(f) && fs.statSync(f).isDirectory()) f = path.join(f, 'index.html');
  if (!f.startsWith(repo) || !fs.existsSync(f)) return route.fulfill({status: 404, body: ''});
  let body = fs.readFileSync(f);
  if (f.endsWith(path.join('app', 'index.html'))) { let s = body.toString('utf8').replace(/<meta http-equiv="Content-Security-Policy"[^>]*>/, ''); if (!marker) s = s.replace('<meta name="leren-env" content="beta">', ''); body = s }
  return route.fulfill({status: 200, body, headers: {'content-type': T[path.extname(f)] || 'application/octet-stream'}});
 };
 const rel = app.match(/RELEASE_VERSION="(\d+)"/)[1];
 try {
  for (const [origin, marker, prod] of [['http://beta-test.example', true, false], ['https://beta.lerenbe.com', true, false], ['https://lerenbe.com', false, true]]) {
   const c = await browser.newContext({serviceWorkers: 'block', viewport: {width: 390, height: 844}}), p = await c.newPage(), outside = [], errors = [];
   p.on('pageerror', e => errors.push(e.message));
   await c.route('**/*', async route => { const u = new URL(route.request().url()); if (u.origin === origin) return serve(origin, {marker})(route); outside.push(u.host + u.pathname.slice(0, 40)); return route.abort() });
   await p.addInitScript(rel => { for (const [k, v] of Object.entries({leren_release_seen: JSON.stringify(rel), poly_ui: 'uk', leren_home_v1: 'path', leren_welcome_seen: 'true', leren_onboarding_language_v1: '1', leren_start_known_v1: 'zero', leren_acct: 'true'})) localStorage.setItem(k, v) }, rel);
   await p.goto(origin + '/app/'); await p.waitForFunction(() => typeof learningPath === 'object' && learningPath, null, {timeout: 20000});
   const r = await p.evaluate(async () => {
    const out = {prod: prodServices(), pushReady: pushReady()}, tryIt = async (k, fn) => { try { await fn(); out[k] = 'ran' } catch (e) { out[k] = 'blocked: ' + String(e.message).slice(0, 40) } };
    await tryIt('acctLoad', () => acctLoad()); await tryIt('pushToken', () => pushToken()); await tryIt('docUrl', () => docUrl('x'));
    await tryIt('fsUserDoc', () => { acct.user = {uid: 'u', getIdToken: async () => 't'}; return fsUserDoc('GET') });
    out.syncWrite = await syncWrite({x: 1}).catch(e => 'threw'); acct.user = null; return out });
   if (!prod) {
    assert.equal(r.prod, false, origin + ': prodServices() is false'); assert.equal(r.pushReady, false, origin + ': no push reminders');
    for (const k of ['acctLoad', 'pushToken', 'docUrl', 'fsUserDoc']) assert.match(r[k], /^blocked: production services are off/, origin + ': ' + k + ' blocked');
    assert.notEqual(r.syncWrite, 'ok', origin + ': syncWrite does not write');
    assert.deepEqual(outside.filter(h => /google|gstatic|firebase|firestore|recaptcha/.test(h)), [], origin + ': no request to Google / Firebase (CSP removed)');
   } else {
    assert.equal(r.prod, true, 'production copy (lerenbe.com, no marker): services open'); assert.equal(r.docUrl, 'ran');
    assert(outside.some(h => /gstatic|googleapis/.test(h)), 'production copy really tries Firebase (requests aborted by the test)');
   }
   assert.deepEqual(errors, [], origin + ': no page errors'); await c.close();
  }
 } finally { await browser.close() }
 console.log('PASS: browser — CSP removed: test host and beta.lerenbe.com make no Google/Firebase request (sign-in, push, Firestore read/write blocked); lerenbe.com without the marker opens them');
})().catch(e => { console.error(e); process.exit(1) });
