// TEST-043 · Lexi reliability lab. MOCK responses only — no model, no Worker, no paid call, no production endpoint.
// Part 1 (node, engine + LerenAICoach.request): HTTP 400 / 401 / 403 / 429 / 500 / 503 with and without Worker bodies, HTML error
// pages, empty and malformed bodies, an interrupted connection, a timeout (and that the fetch is really aborted), offline, every
// error leaves a state event and a typed code, never an unhandled rejection; personal fields never leave the device.
// Part 2 (Chromium, app): double tap / Enter+click on Send = one request; offline = no request; a 500 shows the error panel and
// one Retry sends exactly one request; rapid language switching sends each request in the language it was asked in;
// Lesson Help with personal data in storage sends none of it.
const fs = require('node:fs'), path = require('node:path'), vm = require('node:vm'), assert = require('node:assert/strict');
const repo = path.join(__dirname, '..');

function engine({online = true} = {}) {
 const store = new Map(), ctx = vm.createContext({console, AbortController, setTimeout, clearTimeout, Promise, Error, URL, crypto: require('node:crypto').webcrypto,
  localStorage: {getItem: k => store.get(k) ?? null, setItem: (k, v) => store.set(k, String(v))}});
 ctx.globalThis = ctx;
 for (const f of ['app/modules/ai-coach/core.js', 'app/modules/lexi/engine.js']) vm.runInContext(fs.readFileSync(path.join(repo, f), 'utf8'), ctx);
 const L = ctx.LerenLexi, states = [], calls = []; let reply = null;
 L.on(e => states.push(e));
 L.configure({endpoint: 'http://localhost:1/ai', local: () => true, production: () => false, online: () => online,
  fetch: async (u, o) => { calls.push({u, o, body: JSON.parse(o.body)}); return reply(o) }});
 return {L, states, calls, set: f => { reply = f }};
}
const res = (status, body, {raw} = {}) => ({ok: status >= 200 && status < 300, status, json: async () => raw !== undefined ? JSON.parse(raw) : body});
const CTX = {ui: 'uk', target: 'nl', level: 'a11'}, MSG = [{role: 'user', content: 'Ik woon in Gent.'}];

async function part1() {
 const unhandled = []; process.on('unhandledRejection', e => unhandled.push(e));
 // [what, response, expected code, retry policy]
 const cases = [
  ['400 bad request (Worker body)', res(400, {error: 'bad request'}), 'format'],
  ['400 without body', res(400, null), 'network'],
  ['401 without body', res(401, null), 'network'],
  ['403 forbidden (Worker body)', res(403, {error: 'forbidden'}), 'unavailable'],
  ['403 HTML page', res(403, null, {raw: '<html>Forbidden</html>'}), 'network'],
  ['413 too big', res(413, {error: 'too big'}), 'tooLong'],
  ['429 day limit', res(429, {error: 'limit', retry_after: 3600}), 'limit'],
  ['429 per-minute', res(429, {error: 'slow', retry_after: 20}), 'slow'],
  ['429 without body', res(429, null), 'limit'],
  ['500 without body', res(500, null), 'network'],
  ['502 format (Worker body)', res(502, {error: 'format'}), 'format'],
  ['503 Cloudflare HTML', res(503, null, {raw: '<!DOCTYPE html><title>503</title>'}), 'network'],
  ['503 AI off (Worker body)', res(503, {error: 'off'}), 'off'],
  ['504 timeout (Worker body)', res(504, {error: 'timeout'}), 'timeout'],
  ['200 empty body', res(200, null), 'format'],
  ['200 malformed JSON', res(200, null, {raw: '{"reply": "Goed'}), 'format'],
  ['200 JSON array', res(200, []), 'format'],
  ['200 object without reply', res(200, {}), 'format'],
  ['200 reply is not text', res(200, {reply: {html: '<b>x</b>'}}), 'format'],
 ];
 const E = engine(); const policy = E.L.errorPolicy || {};
 for (const [what, r, code] of cases) {
  E.set(() => r); E.states.length = 0;
  const err = await E.L.send('free', CTX, MSG).then(() => null, e => e);
  assert.ok(err, what + ': rejects'); assert.equal(err.code, code, what + ': code ' + err.code + ' (expected ' + code + ')');
  assert.equal(E.states[0]?.state, 'thinking', what + ': thinking state first');
  assert.ok(['error', 'offline'].includes(E.states.at(-1)?.state) && E.states.at(-1).code === code, what + ': error state with the same code');
  assert.ok(typeof E.L.message(code, 'uk') === 'string' && E.L.message(code, 'ar'), what + ': a message exists in uk and ar');
 }
 { const ok = await (E.set(() => res(429, {error: 'slow', retry_after: 20})), E.L.send('free', CTX, MSG).catch(e => e)); assert.equal(ok.wait?.seconds, 20, '429 slow: the wait time reaches the UI') }
 // interrupted connection (fetch rejects) → network when online, offline when the device says so
 E.set(() => Promise.reject(new TypeError('Failed to fetch'))); assert.equal((await E.L.send('free', CTX, MSG).catch(e => e)).code, 'network', 'interrupted request → network');
 // timeout: the request is aborted, not left running
 let aborted = false; E.set(o => new Promise((_, rej) => o.signal.addEventListener('abort', () => { aborted = true; rej(new Error('aborted')) })));
 const t = await E.L.send('free', CTX, MSG, {timeout: 50}).catch(e => e); assert.equal(t.code, 'timeout', 'slow model → timeout'); assert.ok(aborted, 'the timed-out fetch is aborted');
 // offline: nothing is sent at all
 const O = engine({online: false}); O.set(() => res(200, {reply: 'x'})); const off = await O.L.send('free', CTX, MSG).catch(e => e);
 assert.equal(off.code, 'offline'); assert.equal(O.calls.length, 0, 'offline: no request'); assert.equal(O.states.at(-1).state, 'offline');
 // empty / too long input never reaches the network
 // (a chat may start without a learner message — Lexi opens the conversation — so "empty" applies to questions)
 E.set(() => res(200, {reply: 'x'})); const n0 = E.calls.length; assert.equal((await E.L.send('free', CTX, [{role: 'user', content: 'x'.repeat(5000)}]).catch(e => e)).code, 'tooLong');
 assert.equal((await E.L.send('lesson', CTX, []).catch(e => e)).code, 'empty'); assert.equal(E.calls.length, n0, 'invalid input is not sent');
 // success after errors: normal answer, state back to idle / verdict
 E.set(() => res(200, {reply: 'Goed zo!', translation: 'Добре!', correction: null})); const okr = await E.L.send('free', CTX, MSG);
 assert.equal(okr.reply, 'Goed zo!'); assert.notEqual(E.states.at(-1).state, 'error');
 // personal data never leaves the device, whatever the caller puts in the context
 await E.L.send('free', {...CTX, uid: 'U-777', email: 'x@y.z', name: 'Olena Test', xp: 4242, streak: 9, history: ['secret'], token: 'tok_123'}, MSG,
  {learning: {uid: 'U-777', email: 'x@y.z'}, help: {email: 'x@y.z', kind: 'quiz'}});
 const sent = JSON.stringify(E.calls.at(-1).body); for (const s of ['U-777', 'x@y.z', 'Olena Test', '4242', 'secret', 'tok_123']) assert.ok(!sent.includes(s), 'not sent: ' + s);
 // concurrent sends are two requests at engine level: de-duplication is the UI's job (part 2 checks it)
 await new Promise(r => setTimeout(r, 20)); assert.deepEqual(unhandled, [], 'no unhandled promise rejection');
 console.log(`PASS: engine — ${cases.length} HTTP / body cases map to typed codes with thinking→error states and messages in uk/ar; 429 wait reaches the UI; interrupted → network; timeout aborts the fetch; offline sends nothing; invalid input not sent; no personal field leaves; no unhandled rejection`);
 console.log('NOTE: 400/401/500/503 without a Worker body (e.g. a Cloudflare HTML page) are shown as "network" ("check your internet") — documented in FINAL_REPORT as MEDIUM, behaviour unchanged');
}

async function part2() {
 const {browser} = require('../tools/test-043/serve.cjs');
 let B; try { B = await browser({viewport: {width: 390, height: 844}, hasTouch: true}) } catch (e) { console.log('SKIP part 2: ' + e.message); return }
 const rel = fs.readFileSync(path.join(repo, 'app/app.js'), 'utf8').match(/RELEASE_VERSION="(\d+)"/)[1];
 const AI = B.base + '/mock-ai/', seen = []; let mode = 'ok', delay = 0;
 await B.ctx.route(AI, async r => { if (r.request().method() !== 'POST') return r.fulfill({status: 204}); const j = JSON.parse(r.request().postData()); seen.push(j);
  if (delay) await new Promise(x => setTimeout(x, delay));
  if (mode === '500') return r.fulfill({status: 500, body: ''});
  r.fulfill({status: 200, contentType: 'application/json', body: JSON.stringify(j.mode === 'memo' ? {memory: ''} : j.mode === 'ask' ? {answer: 'Uitleg (' + j.lang + ')', examples: []} : {reply: 'Goed zo!', translation: '', correction: null})}) });
 const S = '.lexi-host >> ';
 const open = async (ui, extra = {}) => {
  const page = await B.ctx.newPage(), errors = []; page.on('pageerror', e => errors.push(e.message));
  await page.addInitScript(([s]) => { if (!sessionStorage.getItem('seeded')) { sessionStorage.setItem('seeded', '1'); localStorage.clear(); for (const [k, v] of Object.entries(s)) localStorage.setItem(k, v) } },
   [{leren_release_seen: JSON.stringify(rel), poly_ui: ui, poly_target: 'nl', leren_home_v1: 'path', leren_welcome_seen: 'true', leren_onboarding_language_v1: '1', leren_start_known_v1: 'zero',
     leren_ai_consent18: 'true', leren_char: '"peter"', leren_tour_done: 'true', leren_ai_endpoint: JSON.stringify(AI), ...extra}]);
  await page.goto(B.base + '/app/index.html'); await page.waitForFunction(() => !!window.LerenLexi && typeof lexiOpen === 'function', null, {timeout: 20000});
  return {page, errors};
 };
 const settle = async (page, n0) => { for (let i = 0; i < 60; i++) { await page.waitForTimeout(50); if (seen.length > n0 && !(await page.locator(S + '.lexi-thinking').count())) break } await page.waitForTimeout(300) };
 const chats = () => seen.filter(j => j.mode === 'chat' || j.mode === 'ask');

 // double tap / Enter + click on Send → one request
 {
  const {page, errors} = await open('uk'); await page.evaluate(() => lexiOpen('free', {})); await page.waitForSelector(S + '#draft');
  delay = 400; const n0 = chats().length; await page.fill(S + '#draft', 'Hallo, ik ben Olga.');
  await page.locator(S + '#draft').press('Enter'); await page.locator(S + 'button.send').click({force: true, timeout: 1000}).catch(() => {}); await page.locator(S + 'button.send').click({force: true, timeout: 1000}).catch(() => {});
  await settle(page, n0); delay = 0;
  assert.equal(chats().length - n0, 1, 'Enter + two taps on Send = one request (got ' + (chats().length - n0) + ')');
  assert.deepEqual(errors, []); await page.close();
 }
 console.log('PASS: app — Enter + double tap on Send during a slow answer = exactly one request');

 // offline: nothing is sent, an offline message is shown, the lesson keeps working
 {
  const {page, errors} = await open('en'); await page.evaluate(() => lexiOpen('free', {})); await page.waitForSelector(S + '#draft');
  await B.ctx.setOffline(true); await page.evaluate(() => dispatchEvent(new Event('offline')));
  const n0 = seen.length; await page.fill(S + '#draft', 'Hello').catch(() => {}); await page.locator(S + 'button.send').click({timeout: 1500}).catch(() => {});
  await page.waitForTimeout(500); assert.equal(seen.length, n0, 'offline: no request');
  await B.ctx.setOffline(false); assert.deepEqual(errors, []); await page.close();
 }
 console.log('PASS: app — offline: no AI request');

 // 500 → error panel with Retry; one Retry = one request; success clears the error
 {
  const {page, errors} = await open('uk'); await page.evaluate(() => lexiOpen('free', {})); await page.waitForSelector(S + '#draft');
  mode = '500'; let n0 = chats().length; await page.fill(S + '#draft', 'Ik woon in Gent.'); await page.click(S + 'button.send'); await settle(page, n0);
  assert.equal(chats().length - n0, 1); await page.waitForSelector(S + '.error-panel'); const retry = page.locator(S + '.error-panel [data-action="retry"]');
  assert.equal(await retry.count(), 1, 'a Retry button is offered'); mode = 'ok'; n0 = chats().length;
  await retry.click(); await retry.click({timeout: 500}).catch(() => {}); await settle(page, n0);
  assert.equal(chats().length - n0, 1, 'one Retry (double tap) = one request'); assert.equal(await page.locator(S + '.error-panel').count(), 0, 'success clears the error');
  assert.deepEqual(errors, []); await page.close();
 }
 console.log('PASS: app — HTTP 500 shows the error panel with Retry; a double tap on Retry sends one request; success clears the error');

 // rapid interface-language switching: each request carries the language the page was in when it was asked
 for (const ui of ['uk', 'ar', 'fr', 'en']) {
  const {page, errors} = await open(ui); await page.evaluate(() => lexiOpen('lesson', {question: 'de man'})); await page.waitForSelector(S + '#draft');
  const n0 = chats().length; await page.fill(S + '#draft', 'Waarom?'); await page.click(S + 'button.send'); await settle(page, n0);
  const j = chats().at(-1); assert.equal(j.lang, ui, 'explanation language = interface ' + ui); assert.equal(j.target, 'nl');
  assert.deepEqual(errors, []); await page.close();
 }
 console.log('PASS: app — uk / ar / fr / en in a row: every request carries its own interface language, target stays nl');

 // Lesson Help privacy with personal data present in storage
 {
  const {page, errors} = await open('uk', {leren_user_email: '"olena@example.test"', leren_display_name: '"Olena Testenko"', poly_score: '4242', leren_xp_v2: JSON.stringify({v: 2, base: 4242, g: {}, d: {}})});
  await page.evaluate(() => { lessonMode = 'quiz'; mode = 'quiz'; setView('lesson'); buildNav(); newRound() }); await page.waitForSelector('#card .lesson-help');
  await page.evaluate(() => document.querySelector('#card .opt').click()); await page.waitForSelector('#card .opt.correct');
  await page.click('#card .lesson-help'); await page.waitForSelector(S + '#draft'); const n0 = chats().length;
  await page.fill(S + '#draft', 'Waarom?'); await page.click(S + 'button.send'); await settle(page, n0);
  const sent = JSON.stringify(seen.slice(-3)); for (const s of ['olena@example.test', 'Olena Testenko', '4242', 'leren_device_id']) assert.ok(!sent.includes(s), 'Lesson Help does not send ' + s);
  assert.ok(chats().at(-1).profile.question, 'the exercise itself is sent'); assert.deepEqual(errors, []); await page.close();
 }
 console.log('PASS: app — Lesson Help with e-mail / name / XP in storage sends none of it, only the exercise');
 await B.close();
}

(async () => { await part1(); await part2() })().catch(e => { console.error(e); process.exit(1) });
