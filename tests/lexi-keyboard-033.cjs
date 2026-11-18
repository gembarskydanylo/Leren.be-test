// TEST-033 · Lexi chat with an on-screen keyboard — EMULATION, not a physical Samsung keyboard.
// Chrome on Android keeps the layout viewport when the keyboard opens (interactive-widget=resizes-visual) and only the
// visual viewport shrinks. Here window.visualViewport is replaced by a controllable one (layout stays e.g. 390×844, the
// visible part becomes 844 − keyboard). Checked in the design lab (source) and in the app (generated, shadow root, demo):
// header, history (its own and only scroll) and composer stay inside the visible part; the history keeps most of the
// height and stays at its end; Lexi's reply avatar stays visible; settings are one tap away; no browser autocomplete of
// earlier messages; reopening the keyboard, sending while it is open, RTL, 200 % text, Escape and Android Back (app).
const assert = require('node:assert/strict'), fs = require('node:fs'), path = require('node:path'), http = require('node:http');
const repo = path.join(__dirname, '..');
const T = {'.html': 'text/html', '.js': 'text/javascript', '.mjs': 'text/javascript', '.css': 'text/css', '.json': 'application/json', '.webp': 'image/webp', '.png': 'image/png', '.svg': 'image/svg+xml', '.woff': 'font/woff', '.jpg': 'image/jpeg', '.m4a': 'audio/mp4', '.webmanifest': 'application/manifest+json'};
const FAKE_VV = () => { // runs in the page before any script
 const vv = new EventTarget(); let kb = 0, top = 0;
 Object.defineProperties(vv, {height: {get: () => innerHeight - kb}, width: {get: () => innerWidth}, offsetTop: {get: () => top}, offsetLeft: {get: () => 0}, scale: {get: () => 1}, pageTop: {get: () => scrollY + top}});
 Object.defineProperty(window, 'visualViewport', {configurable: true, get: () => vv});
 window.__keyboard = (px, off = 0) => { kb = px; top = off; vv.dispatchEvent(new Event('resize')) };
};
(async () => {
 let chromium; try { ({chromium} = require('playwright')) } catch { console.log('SKIP: Playwright is not installed'); return }
 const server = http.createServer((q, r) => { let f = path.join(repo, decodeURIComponent(new URL(q.url, 'http://x').pathname)); if (fs.existsSync(f) && fs.statSync(f).isDirectory()) f = path.join(f, 'index.html'); if (!f.startsWith(repo + path.sep) || !fs.existsSync(f)) { r.statusCode = 404; return r.end() } r.setHeader('content-type', T[path.extname(f)] || 'application/octet-stream'); fs.createReadStream(f).pipe(r) });
 await new Promise(r => server.listen(0, '127.0.0.1', r)); const O = 'http://localhost:' + server.address().port;
 let browser; try { browser = await chromium.launch() } catch { console.log('SKIP: no Chromium'); server.close(); return }
 const rel = fs.readFileSync(path.join(repo, 'app/app.js'), 'utf8').match(/RELEASE_VERSION="(\d+)"/)[1];
 // measures everything in the page; R = the chat's root (document in the lab, the shadow root in the app)
 const measure = page => page.evaluate(() => {
  const R = document.querySelector('.lexi-host')?.shadowRoot || document, q = s => R.querySelector(s), box = s => { const e = q(s); if (!e) return null; const b = e.getBoundingClientRect(), st = getComputedStyle(e); return {top: b.top, bottom: b.bottom, h: b.height, w: b.width, shown: b.height > 0 && st.display !== 'none' && st.visibility !== 'hidden'} };
  const log = q('.chat-log'), vv = visualViewport, avatars = [...R.querySelectorAll('.reply-avatar')], last = avatars.at(-1)?.getBoundingClientRect(), lb = log.getBoundingClientRect();
  const scrollers = [document.scrollingElement, document.querySelector('.lexi-host'), ...R.querySelectorAll('*')].filter(e => e && e !== log && e.scrollHeight > e.clientHeight + 2 && /auto|scroll/.test(getComputedStyle(e).overflowY) && e.clientHeight > 0 && !(e.closest && e.closest('.sidebar')));
  return {vvh: vv.height, top: vv.offsetTop, keyboard: !!R.querySelector('.lexi-keyboard') || !!document.querySelector('.lexi-keyboard') || (R.host && R.firstElementChild?.classList.contains('lexi-keyboard')),
   header: box('.chat-header'), form: box('.ai-type'), input: box('#draft'), send: box('.ai-type .send'), mic: box('.ai-type .g-mic-btn'), sidebar: box('.sidebar'), settings: box('.settings-button'), log: {h: lb.height, top: lb.top, bottom: lb.bottom, end: log.scrollHeight - log.scrollTop - log.clientHeight < 3, scrolls: log.scrollHeight > log.clientHeight},
   lastAvatar: last ? {w: last.width, visible: last.bottom > lb.top && last.top < lb.bottom} : null, pageScroll: document.scrollingElement.scrollHeight > innerHeight + 1 && getComputedStyle(document.documentElement).overflowY !== 'hidden' && getComputedStyle(document.body).overflowY !== 'hidden' ? document.scrollingElement.scrollHeight - innerHeight : 0,
   otherScrollers: scrollers.map(e => e.className || e.tagName), overflowX: document.documentElement.scrollWidth > innerWidth + 1, focused: (R.activeElement || document.activeElement)?.id,
   autocomplete: [q('#draft')?.getAttribute('autocomplete'), q('.ai-type')?.getAttribute('autocomplete')], bubbles: R.querySelectorAll('.g-bub').length};
 });
 const S = (app, s) => (app ? '.lexi-host >> ' : '') + s;
 async function sendMsg(page, app, text) { const n = (await measure(page)).bubbles; await page.fill(S(app, '#draft'), text); await page.press(S(app, '#draft'), 'Enter'); await page.waitForFunction(([app, n]) => { const R = app ? document.querySelector('.lexi-host').shadowRoot : document; return R.querySelectorAll('.g-bub').length >= n + 2 && !R.querySelector('[aria-busy=true]') }, [app, n], {timeout: 8000}) }
 function checkOpen(m, label, {minLog = 0.42} = {}) {
  assert.ok(m.keyboard, label + ': keyboard state'); const vis = m.top + m.vvh;
  assert.ok(m.header.shown && m.header.top >= m.top - 1, label + ': header visible ' + JSON.stringify(m.header));
  assert.ok(m.form.bottom <= vis + 1 && m.send.shown && m.send.bottom <= vis + 1 && m.input.bottom <= vis + 1, label + ': composer above the keyboard ' + JSON.stringify({form: m.form, vis}));
  assert.ok(m.send.w >= 44 && m.send.h >= 44 && m.input.h >= 44, label + ': send button and field ≥ 44 px');
  assert.ok(m.log.h >= minLog * m.vvh, label + `: history keeps ${Math.round(m.log.h)} px of ${m.vvh} (≥ ${Math.round(minLog * 100)} %)`);
  assert.ok(m.log.end, label + ': history at its end'); assert.equal(m.pageScroll, 0, label + ': no page scroll'); assert.deepEqual(m.otherScrollers, [], label + ': the history is the only scroll');
  assert.ok(!m.overflowX, label + ': no horizontal overflow'); assert.ok(m.settings.shown && m.settings.top >= m.top - 1, label + ': settings stay one tap away');
  if (m.lastAvatar) assert.ok(m.lastAvatar.w >= 48, label + ': Lexi avatar beside the replies');
 }
 let checks = 0;
 // ---- design lab (source)
 for (const [w, h, kb] of [[320, 640, 290], [360, 780, 330], [390, 844, 380], [412, 915, 400]]) {
  const ctx = await browser.newContext({viewport: {width: w, height: h}, isMobile: true, hasTouch: true}), page = await ctx.newPage(), errs = []; page.on('pageerror', e => errs.push(e.message));
  await page.addInitScript(FAKE_VV); await page.goto(O + '/design-lab/test-030/lexi/'); await page.waitForSelector('#draft');
  let m = await measure(page); assert.deepEqual(m.autocomplete, ['off', 'off'], 'no browser autocomplete of earlier messages');
  assert.equal(m.sidebar.shown, h >= 760, w + '×' + h + ': settings open on the welcome screen only when there is room');
  assert.ok(m.form.bottom <= h + 1 && m.send.shown && m.log.h >= 120, w + '×' + h + ': welcome screen — composer in view, history visible ' + JSON.stringify({form: m.form, log: m.log.h}));
  for (let i = 1; i <= 6; i++) await sendMsg(page, false, 'Ik woon in Gent ' + i + '.');
  m = await measure(page); assert.ok(!m.sidebar.shown && m.settings.shown, w + ': settings collapse once the conversation runs, button stays');
  await page.focus('#draft'); await page.evaluate(k => __keyboard(k), kb); await page.waitForTimeout(120); m = await measure(page); checkOpen(m, `lab ${w}×${h} keyboard ${kb}`); assert.equal(m.focused, 'draft');
  await sendMsg(page, false, 'Nog een zin.'); await page.waitForTimeout(80); m = await measure(page); assert.notEqual(m.focused, 'draft', w + ': on a phone sending takes the focus out of the field, so the keyboard closes (owner, Samsung preview 2)');
  await page.evaluate(() => __keyboard(0)); await page.waitForTimeout(120); m = await measure(page); assert.ok(!m.keyboard && m.form.bottom <= h + 1 && m.log.end && m.lastAvatar?.visible, w + ': keyboard closed after sending — composer in view, history at its end with Lexi\'s reply ' + JSON.stringify({form: m.form, end: m.log.end}));
  await page.focus('#draft'); assert.equal(await page.evaluate(() => getComputedStyle(document.activeElement).outlineOffset), '-3px', w + ': focus ring inside the field, not over the mic / send row');
  await page.evaluate(() => { document.activeElement.blur(); __keyboard(0) }); await page.waitForTimeout(80); m = await measure(page); assert.ok(!m.keyboard && m.form.bottom <= h + 1 && m.header.top >= 0, w + ': keyboard closed — composer and header in view');
  await page.focus('#draft'); await page.evaluate(k => __keyboard(k), kb); await page.waitForTimeout(80); checkOpen(await measure(page), `lab ${w} keyboard reopened`);
  await page.evaluate(() => { document.activeElement.blur(); __keyboard(0) }); await page.click('.settings-button'); m = await measure(page); assert.ok(m.sidebar.shown, w + ': settings button opens settings'); assert.equal(await page.getAttribute('.settings-button', 'aria-expanded'), 'true');
  await page.click('.settings-button'); assert.ok(!(await measure(page)).sidebar.shown, w + ': and closes them');
  assert.deepEqual(errs, []); await ctx.close(); checks++;
 }
 { // RTL + 200 % text, 320 px, keyboard
  const ctx = await browser.newContext({viewport: {width: 320, height: 640}, isMobile: true, hasTouch: true}), page = await ctx.newPage();
  await page.addInitScript(FAKE_VV); await page.goto(O + '/design-lab/test-030/lexi/?ui=ar'); await page.waitForSelector('#draft');
  await page.evaluate(() => document.documentElement.style.fontSize = '200%'); for (let i = 1; i <= 3; i++) await sendMsg(page, false, 'Hallo ' + i);
  await page.focus('#draft'); await page.evaluate(() => __keyboard(280)); await page.waitForTimeout(100); const m = await measure(page);
  assert.equal(await page.evaluate(() => document.documentElement.dir), 'rtl'); assert.ok(m.form.bottom <= m.vvh + 1 && m.header.top >= 0 && !m.overflowX && m.send.shown, 'RTL 200 %: composer and header visible, no overflow ' + JSON.stringify(m));
  assert.ok(m.log.h > 0, 'RTL 200 %: history still visible'); await ctx.close(); checks++;
 }
 { // desktop: unchanged layout
  const ctx = await browser.newContext({viewport: {width: 1440, height: 900}}), page = await ctx.newPage(); await page.addInitScript(FAKE_VV); await page.goto(O + '/design-lab/test-030/lexi/'); await page.waitForSelector('#draft');
  await sendMsg(page, false, 'Hallo'); const m = await measure(page); assert.ok(m.sidebar.shown && !m.settings.shown && !m.keyboard, 'desktop: sidebar always visible, no settings button'); assert.equal(m.focused, 'draft', 'desktop: the focus stays in the field after sending'); await ctx.close(); checks++;
 }
 // ---- app (generated chat in the shadow root, demo replies, no network)
 {
  const ctx = await browser.newContext({viewport: {width: 390, height: 844}, isMobile: true, hasTouch: true, serviceWorkers: 'block'}), page = await ctx.newPage(), errs = []; page.on('pageerror', e => errs.push(e.message));
  await ctx.route(/^https?:\/\/(?!localhost)/, r => r.abort());
  await page.addInitScript(FAKE_VV);
  await page.addInitScript(rel => { if (localStorage.getItem('seeded')) return; localStorage.setItem('seeded', '1'); for (const [k, v] of Object.entries({leren_release_seen: JSON.stringify(rel), poly_ui: 'uk', poly_target: 'nl', leren_home_v1: 'path', leren_welcome_seen: 'true', leren_onboarding_language_v1: '1', leren_start_known_v1: 'zero'})) localStorage.setItem(k, v) }, rel);
  await page.goto(O + '/app/?lexi=demo'); await page.waitForFunction(() => typeof lexiOpen === 'function');
  await page.evaluate(() => lexiOpen('free', {})); await page.waitForSelector(S(true, '#draft'));
  for (let i = 1; i <= 6; i++) await sendMsg(page, true, 'Ik werk in Brussel ' + i + '.');
  await page.focus(S(true, '#draft')); await page.evaluate(() => __keyboard(380)); await page.waitForTimeout(120); let m = await measure(page); checkOpen(m, 'app 390×844 keyboard 380');
  assert.deepEqual(m.autocomplete, ['off', 'off'], 'app: no browser autocomplete');
  await page.evaluate(() => { __keyboard(0) }); await page.keyboard.press('Escape'); await page.waitForTimeout(200); assert.equal(await page.locator('.lexi-host').count(), 0, 'app: Escape closes the chat');
  await page.evaluate(() => lexiOpen('free', {})); await page.waitForSelector(S(true, '#draft')); await page.focus(S(true, '#draft')); await page.evaluate(() => __keyboard(380)); await page.waitForTimeout(80);
  await page.goBack(); await page.waitForTimeout(300); assert.equal(await page.locator('.lexi-host').count(), 0, 'app: Android Back (history) closes the chat'); assert.ok(page.url().startsWith(O + '/app/'), 'app: Back stays in the app');
  assert.deepEqual(errs, []); await ctx.close(); checks++;
 }
 await browser.close(); server.close();
 console.log(`PASS: ${checks} keyboard scenarios (EMULATED visualViewport, not a physical keyboard) — lab 320/360/390/412 with long history, send closes the keyboard on a phone (focus stays on desktop), reopen, settings button, RTL 200 %, desktop; app shadow chat with Escape and Back; composer above the keyboard, history ≥ 42 % and the only scroll, no autocomplete of earlier messages`);
})().catch(e => { console.error(e); process.exit(1) });
