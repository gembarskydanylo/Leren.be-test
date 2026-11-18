// TEST-031 / TEST-032 · Lexi in the real app/ (the chat itself: tests/lexi-integration.cjs) (Chromium, emulated phone) with a MOCK AI on the same origin — no real AI call.
// Every AI entry opens Lexi (name, picture, char "lexi" in every request); the request carries only the learning context;
// a correction is shown and the reply is spoken; API failure → message + retry without a duplicate; minute limit; offline;
// roleplay (school, in French); lesson assistant (lesson, exercise, answer); voice question: recognised text is shown and
// can be corrected before sending; microphone refused → message; XP and progress untouched by failures; the old
// «chat with Dafna» route opens Lexi and keeps the teacher/voice choice; the beta snapshot shows Lexi as switched off
// and sends nothing.
const fs = require('node:fs'), path = require('node:path'), http = require('node:http'), assert = require('node:assert/strict');
const repo = path.join(__dirname, '..');
const T = {'.html': 'text/html', '.js': 'text/javascript', '.mjs': 'text/javascript', '.css': 'text/css', '.json': 'application/json', '.png': 'image/png', '.webp': 'image/webp', '.jpg': 'image/jpeg', '.svg': 'image/svg+xml', '.m4a': 'audio/mp4', '.woff': 'font/woff', '.webmanifest': 'application/manifest+json'};
const CHAT_OK = {reply: 'Hallo! Waar woon je?', reply_nl: 'Hallo! Waar woon je?', translation: 'Привіт! Де ти живеш?', correction: null};
// free talk shows only major mistakes (minor ones in the teacher style) — app rule kept from before Lexi
const CHAT_FIX = {reply: 'Ah, in Gent! Werk je daar ook?', translation: 'А, у Генті! Ти там теж працюєш?', correction: {has_error: true, severity: 'major', original: 'Ik woon op Gent', corrected: 'Ik woon in Gent.', explanation: 'Перед містом — «in».'}};
(async () => {
 let chromium; try { ({chromium} = require('playwright')) } catch { console.log('SKIP: Playwright is not installed'); return }
 const queue = [], seen = [];
 const server = http.createServer((q, r) => {
  const u = new URL(q.url, 'http://x');
  if (u.pathname === '/mock-ai/') { let b = ''; q.on('data', c => b += c); q.on('end', () => { if (q.method !== 'POST') { r.statusCode = 204; return r.end() }
   const j = JSON.parse(b); seen.push(j); // background notes and reports do not take the scripted answers
   const n = j.mode === 'memo' ? {status: 200, body: {memory: ''}} : j.mode === 'report' ? {status: 200, body: {ok: true}} : queue.shift() || {status: 200, body: CHAT_OK}; r.statusCode = n.status; r.setHeader('content-type', 'application/json'); r.end(JSON.stringify(n.body)) }); return }
  let f = path.join(repo, decodeURIComponent(u.pathname)); if (f.endsWith(path.sep)) f += 'index.html';
  if (!f.startsWith(repo) || !fs.existsSync(f) || fs.statSync(f).isDirectory()) { r.statusCode = 404; return r.end() }
  r.setHeader('content-type', T[path.extname(f)] || 'application/octet-stream'); fs.createReadStream(f).pipe(r) });
 await new Promise(r => server.listen(0, '127.0.0.1', r)); const port = server.address().port, B = 'http://localhost:' + port + '/app/';
 let browser; try { browser = await chromium.launch() } catch { console.log('SKIP: no Chromium'); server.close(); return }
 const rel = fs.readFileSync(path.join(repo, 'app/app.js'), 'utf8').match(/RELEASE_VERSION="(\d+)"/)[1];
 async function open({endpoint}) {
  const ctx = await browser.newContext({viewport: {width: 390, height: 844}, serviceWorkers: 'block'}), page = await ctx.newPage(), errors = [], outside = [];
  page.on('pageerror', e => errors.push(e.message)); await ctx.route(/^https?:\/\/(?!localhost)/, r => { outside.push(r.request().url()); r.abort() });
  await page.addInitScript(([rel, endpoint]) => {
   if (!localStorage.getItem('seeded')) { localStorage.setItem('seeded', '1');
    for (const [k, v] of Object.entries({leren_release_seen: JSON.stringify(rel), poly_ui: 'uk', poly_target: 'nl', leren_home_v1: 'path', leren_welcome_seen: 'true', leren_onboarding_language_v1: '1', leren_start_known_v1: 'zero', leren_ai_consent18: 'true', leren_char: '"peter"', poly_score: '35',
     leren_life_xp_v1: JSON.stringify({'first-day:station': 40})})) localStorage.setItem(k, v);
    if (endpoint) localStorage.setItem('leren_ai_endpoint', JSON.stringify(endpoint)) }
   // fake speech recognition: one result per armed use (window.__srText), or a refusal (window.__srDeny)
   window.SpeechRecognition = class { start() { if (!window.__srArmed) return; window.__srArmed = false; setTimeout(() => { if (window.__srDeny) { this.onerror && this.onerror({error: 'not-allowed'}); this.onend && this.onend(); return }
     const alt = [{transcript: window.__srText, confidence: .9}]; alt.isFinal = true; this.onresult && this.onresult({results: [alt], resultIndex: 0}); setTimeout(() => this.onend && this.onend(), 30) }, 30) }
    stop() { setTimeout(() => this.onend && this.onend(), 10) } abort() { setTimeout(() => this.onend && this.onend(), 10) } };
  }, [rel, endpoint]);
  await page.goto(B); await page.waitForSelector('.hv'); await page.waitForFunction(() => !!window.LerenLexi);
  await page.evaluate(() => { window.__said = []; say = t => { window.__said.push(t) } }); // the reply is spoken through say()
  return {ctx, page, errors, outside};
 }
 const data = page => page.evaluate(() => ['poly_score', 'leren_path_v1', 'leren_life_xp_v1', 'leren_xp_v2'].map(k => localStorage.getItem(k)));
 const chatSend = async (page, text) => { await page.fill('.ai-type input', text); await page.click('.ai-type button[type=submit]') };
 const last = () => [...seen].reverse().find(x => x.mode !== 'memo' && x.mode !== 'report');
 const ALLOWED_PROFILE = ['level', 'topic', 'lesson', 'question', 'answer', 'learned', 'weak', 'mistakes', 'review', 'mastered'];
 try {
  // ---- A · Lexi available (local test endpoint on localhost)
  const {ctx, page, errors, outside} = await open({endpoint: 'http://localhost:' + port + '/mock-ai/'});
  const before = await data(page);
  // The chat, roleplay / lesson assistant and voice checks moved to tests/lexi-integration.cjs with the TEST-030 chat (TEST-032).
  await page.evaluate(() => setView('games'));

  // ---- exam A1.1 with AI on: the AI coach cards are Lexi (name and picture), the page does not break
  await page.evaluate(() => EXAM11.open()); await page.waitForSelector('.ex-ai', {timeout: 15000});
  const exam = await page.evaluate(() => [...document.querySelectorAll('.ex-ai')].map(b => ({text: b.textContent, lexi: !!b.querySelector('img.lexi-av'), svg: !!b.querySelector('svg')})));
  assert(exam.length >= 1, 'exam AI coach cards shown'); assert(exam.every(b => b.lexi && !b.svg), 'exam AI cards use the Lexi picture, not the teacher drawing');
  assert(!/Peter|Pieter|Пітер|Dafna|Дафн/.test(await page.evaluate(() => [...document.querySelectorAll('.ex-aih, .ex-aih + .ex-sub, .ex-ai')].map(e => e.textContent).join(' '))), 'no Peter / Dafna in the exam AI coach');
  assert.deepEqual(errors, [], 'exam home with AI renders without errors');
  console.log('PASS: exam A1.1 with AI on — the AI coach is Lexi (name and picture), no page error');

  // ---- old route: «talk to AI» with an id still opens Lexi and leaves the teacher / voice choice alone
  queue.push({status: 200, body: CHAT_OK}); await page.evaluate(() => setView('path')); await page.waitForSelector('.hv');
  // the real «talk to AI» buttons still pass an old tutor id (learning-path tile: 'peter'); the bridge ignores it
  const tile = await page.evaluate(() => { const t = document.querySelector('.fh-more-tile[data-more="chat"]') || [...document.querySelectorAll('.hs-button')].find(x => /AI/.test(x.textContent)); if (!t) return ''; t.click(); return t.className });
  assert(tile, 'a «talk to AI» button exists on the home');
  await page.waitForSelector('.lexi-host >> .ai-chat-card'); assert.match(await page.textContent('.lexi-host >> #prog'), /Lexi/);
  assert.equal(await page.evaluate(() => localStorage.getItem('leren_char')), '"peter"', 'leren_char unchanged');
  assert.deepEqual(errors, []); assert.deepEqual(outside, [], 'no request outside localhost (no real AI)');
  await ctx.close();
  console.log('PASS: old «chat with Peter / Dafna» routes open Lexi; teacher and voice choice kept; no external request');

  // ---- B · beta snapshot (no local endpoint): Lexi is switched off, entries hidden, nothing sent
  const beta = await open({endpoint: null}), s2 = seen.length;
  assert.equal(await beta.page.evaluate(() => AI_ENDPOINT), '', 'no AI endpoint in the beta snapshot');
  assert.equal(await beta.page.evaluate(() => gameCards().some(c => c.id === 'ask' || c.id === 'ai')), false, 'AI games hidden');
  await beta.page.evaluate(() => lexiOpen('free')); await beta.page.waitForSelector('.lexi-off');
  assert.match(await beta.page.textContent('.lexi-off'), /тестовій версії/);
  await beta.page.evaluate(() => askStart()); await beta.page.waitForSelector('.lexi-off');
  assert.equal(seen.length, s2); assert.deepEqual(beta.outside, [], 'beta: no request to the production AI or anywhere else'); assert.deepEqual(beta.errors, []);
  await beta.ctx.close();
  console.log('PASS: beta snapshot — AI games hidden, Lexi explains it is off in the test version, no request sent');
 } finally { await browser.close(); server.close() }
})().catch(e => { console.error(e); process.exit(1) });
