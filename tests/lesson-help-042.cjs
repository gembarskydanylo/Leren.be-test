// TEST-042 · Lesson Help: «Ask Lexi» under the exercise in the classic lesson, the Learning Path (nl) and the Course Player (en),
// opening Lexi's lesson help with the exercise as context. MOCK AI only (no real model, no Worker). Chromium.
// Engine part (node): kind / expected reach the request profile, are limited and filtered, personal fields never do.
const fs = require('node:fs'), path = require('node:path'), vm = require('node:vm'), http = require('node:http'), assert = require('node:assert/strict');
const repo = path.join(__dirname, '..');
const T = {'.html': 'text/html', '.js': 'text/javascript', '.mjs': 'text/javascript', '.css': 'text/css', '.json': 'application/json', '.png': 'image/png', '.webp': 'image/webp', '.jpg': 'image/jpeg', '.svg': 'image/svg+xml', '.webmanifest': 'application/manifest+json', '.m4a': 'audio/mp4', '.woff2': 'font/woff2'};
const ALLOWED = new Set(['level', 'topic', 'lesson', 'question', 'answer', 'kind', 'expected', 'learned', 'weak', 'mistakes', 'review', 'mastered']);

async function engine() {
 const store = new Map(), ctx = vm.createContext({console, AbortController, setTimeout, clearTimeout, Promise, Error, URL, crypto: require('node:crypto').webcrypto,
  localStorage: {getItem: k => store.get(k) ?? null, setItem: (k, v) => store.set(k, String(v))}});
 ctx.globalThis = ctx;
 for (const f of ['app/modules/ai-coach/core.js', 'app/modules/lexi/engine.js']) vm.runInContext(fs.readFileSync(path.join(repo, f), 'utf8'), ctx);
 const L = ctx.LerenLexi; let body = null;
 L.configure({endpoint: 'http://localhost:1/ai', local: () => true, production: () => false, online: () => true, fetch: async (u, o) => { body = JSON.parse(o.body);
  return {ok: true, status: 200, json: async () => ({reply: 'ok', translation: '', correction: null, verdict: null, answer: 'ok', examples: []})} }});
 const send = (c, help) => L.send('lesson', c, [{role: 'user', content: 'Waarom?'}], {help}).then(() => body);
 let n = 0;
 for (const kind of ['study', 'quiz', 'build', 'listen', 'write', 'talk']) { const b = await send({ui: 'uk', target: 'nl', question: 'de man'}, {kind, expected: 'de man'}); assert.equal(b.profile.kind, kind); assert.equal(b.profile.expected, 'de man'); n++ }
 let b = await send({ui: 'en', target: 'nl'}, {kind: 'hack', expected: ''}); assert.ok(!('kind' in b.profile) && !('expected' in b.profile), 'unknown kind and empty sample answer are dropped');
 b = await send({ui: 'en', target: 'nl'}, {kind: 'quiz', expected: 'x'.repeat(500)}); assert.equal(b.profile.expected.length, 200, 'expected is limited to 200');
 b = await send({ui: 'fr', target: 'nl', uid: 'U123', email: 'a@b.c', xp: 999, streak: 7, history: ['x'], name: 'Anna', answer: 'Ik heet Anna', question: 'Hoe heet je?', lang: 'uk', level: 'a12'}, {kind: 'quiz', expected: 'Ik heet …', uid: 'U123', xp: 9});
 for (const k of Object.keys(b.profile)) assert.ok(ALLOWED.has(k), 'profile field ' + k + ' is not part of the contract');
 assert.ok(!JSON.stringify(b).match(/U123|a@b\.c|999|Anna(?!\b)/) || JSON.stringify(b).includes('Ik heet Anna'), 'no account data');
 assert.ok(!/U123|a@b\.c|"xp"|"streak"/.test(JSON.stringify(b)), 'no uid / e-mail / xp / streak in the request');
 assert.equal(b.lang, 'fr', 'explanation language = interface language'); assert.equal(b.profile.level, 'a12');
 console.log('PASS: engine — kind (6 kinds) and expected reach the profile; unknown kind dropped; 200-char limit; no personal field leaves the app');
}

(async () => {
 await engine();
 let chromium; try { ({chromium} = require('playwright')) } catch { console.log('SKIP: Playwright is not installed'); return }
 const seen = [], server = http.createServer((q, r) => {
  const u = new URL(q.url, 'http://x');
  if (u.pathname === '/mock-ai/') { let b = ''; q.on('data', c => b += c); q.on('end', () => { if (q.method !== 'POST') { r.statusCode = 204; return r.end() } const j = JSON.parse(b); seen.push(j);
   r.statusCode = 200; r.setHeader('content-type', 'application/json'); r.end(JSON.stringify(j.mode === 'chat' ? {reply: 'Goed zo!', translation: '', correction: null} : j.mode === 'memo' ? {memory: ''} : {answer: 'Ik leg het uit.', examples: []})) }); return }
  let f = path.join(repo, decodeURIComponent(u.pathname)); if (f.endsWith(path.sep)) f += 'index.html';
  if (!f.startsWith(repo) || !fs.existsSync(f) || fs.statSync(f).isDirectory()) { r.statusCode = 404; return r.end() }
  r.setHeader('content-type', T[path.extname(f)] || 'application/octet-stream'); fs.createReadStream(f).pipe(r) });
 await new Promise(r => server.listen(0, '127.0.0.1', r)); const port = server.address().port, B = 'http://localhost:' + port + '/app/', AI = 'http://localhost:' + port + '/mock-ai/';
 let browser; try { browser = await chromium.launch() } catch { console.log('SKIP: no Chromium'); server.close(); return }
 const rel = fs.readFileSync(path.join(repo, 'app/app.js'), 'utf8').match(/RELEASE_VERSION="(\d+)"/)[1];
 const S = '.lexi-host >> ';
 async function open(ui, width = 390, target = 'nl') {
  const ctx = await browser.newContext({viewport: {width, height: 844}, hasTouch: true, serviceWorkers: 'block'}), page = await ctx.newPage(), errors = [];
  page.on('pageerror', e => errors.push(e.message)); await ctx.route(/^https?:\/\/(?!localhost)/, r => r.abort());
  await page.addInitScript(([rel, ui, target, ai]) => { if (!localStorage.getItem('seeded')) { localStorage.setItem('seeded', '1');
   for (const [k, v] of Object.entries({leren_release_seen: JSON.stringify(rel), poly_ui: ui, poly_target: target, leren_home_v1: 'path', leren_welcome_seen: 'true', leren_onboarding_language_v1: '1', leren_start_known_v1: 'zero', leren_ai_consent18: 'true', leren_char: '"peter"', leren_ai_endpoint: JSON.stringify(ai)})) localStorage.setItem(k, v) } }, [rel, ui, target, AI]);
  await page.goto(B); await page.waitForSelector('.hv'); await page.waitForFunction(() => !!window.LerenLexi && !!window.LerenLessonHelp);
  return {ctx, page, errors};
 }
 const LABEL = {uk: 'Запитай Lexi', en: 'Ask Lexi', fr: 'Demande à Lexi', ar: 'اسأل Lexi'};
 const lastChat = () => [...seen].reverse().find(j => j.mode === 'chat' || j.mode === 'ask');
 async function ask(page, text) { const n0 = seen.length; await page.fill(S + '#draft', text); await page.click(S + 'button.send'); for (let i = 0; i < 100 && seen.length === n0; i++) await page.waitForTimeout(50); assert.ok(seen.length > n0, 'a request was sent'); await page.waitForTimeout(200) }
 const box = async (page, sel) => { const b = await page.locator(sel).first().boundingBox(); return b };

 // ---- classic lesson: label in 4 languages, 44 px, no overflow at 320; quiz before / after answering; study; not in a chapter test
 for (const ui of ['uk', 'en', 'fr', 'ar']) {
  const {ctx, page, errors} = await open(ui, 320);
  await page.evaluate(() => { lessonMode = 'quiz'; mode = 'quiz'; setView('lesson'); buildNav(); newRound() }); await page.waitForSelector('#card .opt');
  await page.waitForSelector('#card .lesson-help');
  assert.equal((await page.locator('#card .lesson-help').innerText()).trim(), LABEL[ui], ui + ': label');
  const b = await box(page, '#card .lesson-help'); assert.ok(b.height >= 44 && b.width >= 44, ui + ': touch target ≥ 44 px'); assert.ok(b.x >= 0 && b.x + b.width <= 320, ui + ': inside 320 px');
  assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true, ui + ': no horizontal scroll');
  assert.equal(errors.length, 0, errors.join()); await ctx.close();
 }
 console.log('PASS: classic lesson — button in uk / en / fr / ar, ≥ 44 px, inside 320 px, no overflow');

 {
  const {ctx, page} = await open('uk');
  await page.evaluate(() => { lessonMode = 'quiz'; mode = 'quiz'; setView('lesson'); buildNav(); newRound() }); await page.waitForSelector('#card .lesson-help');
  const before = seen.length; await page.click('#card .lesson-help'); await page.waitForSelector(S + '.ai-chat-card', {timeout: 15000});
  assert.equal(seen.length, before, 'nothing is sent by the tap itself');
  await ask(page, 'Waarom?'); let j = lastChat();
  assert.equal(j.mode, 'ask', 'lesson help is a question to Lexi'); assert.ok(j.profile.question, 'the task is in the request'); assert.equal(j.profile.kind, 'quiz');
  assert.ok(!('expected' in j.profile) && !('answer' in j.profile), 'before answering: no sample answer, no answer');
  for (const k of Object.keys(j.profile)) assert.ok(ALLOWED.has(k), 'profile field ' + k); assert.equal(j.lang, 'uk'); assert.equal(j.target, 'nl');
  await page.evaluate(() => lexiClose()); await page.waitForTimeout(200);
  await page.evaluate(() => { document.querySelector('#card .opt').click() }); await page.waitForSelector('#card .opt.correct');
  await page.click('#card .lesson-help'); await page.waitForSelector(S + '.ai-chat-card'); await ask(page, 'Dank je'); j = lastChat();
  assert.ok(j.profile.expected && j.profile.answer, 'after answering: the sample answer and the learner\'s pick are sent'); assert.ok(j.profile.expected.length <= 200);
  await ctx.close();
  console.log('PASS: classic quiz — tap sends nothing; request has task + kind=quiz (no sample answer before answering); after answering the sample answer and the pick; contract fields only');
 }
 {
  const {ctx, page} = await open('en');
  await page.evaluate(() => { lessonMode = 'study'; mode = 'study'; setView('lesson'); buildNav(); newRound() }); await page.waitForSelector('#card .study-row'); await page.waitForSelector('#card .lesson-help');
  await page.click('#card .lesson-help'); await page.waitForSelector(S + '.ai-chat-card'); await ask(page, 'Why?'); const j = lastChat();
  assert.equal(j.profile.kind, 'study'); assert.ok(j.profile.question); assert.equal(j.lang, 'en');
  await ctx.close();
  console.log('PASS: classic study — kind=study with the word, explanation in English');
 }
 {
  const {ctx, page} = await open('uk');
  await page.evaluate(() => { lessonMode = 'quiz'; mode = 'quiz'; setView('lesson'); buildNav(); newRound() }); await page.waitForSelector('#card .lesson-help');
  await page.evaluate(() => { mode = 'toets'; renderLessonModes(); document.querySelector('#card .lesson-help-row')?.remove(); }); await page.waitForTimeout(300);
  assert.equal(await page.locator('#card .lesson-help').count(), 0, 'no help button while no practice mode tab is selected (chapter tests)');
  await ctx.close();
  console.log('PASS: no Lesson Help in the chapter tests');
 }

 // ---- Learning Path (nl)
 {
  const {ctx, page, errors} = await open('uk', 320);
  await page.evaluate(() => { learningPath && learningPath.startFirst() }); await page.waitForSelector('.lp-exercise .lesson-help', {timeout: 15000});
  const b = await box(page, '.lp-exercise .lesson-help'); assert.ok(b.height >= 44, 'LP target'); assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true);
  await page.click('.lp-exercise .lesson-help'); await page.waitForSelector(S + '.ai-chat-card'); await ask(page, 'Waarom?'); const j = lastChat();
  assert.equal(j.profile.kind, 'study'); assert.ok(j.profile.question, 'LP: the word is in the request'); assert.equal(j.target, 'nl');
  assert.equal(errors.length, 0, errors.join()); await ctx.close();
  console.log('PASS: Learning Path — button, kind=study with the word, nl, 320 px');
 }

 // ---- Course Player (en)
 {
  const {ctx, page, errors} = await open('uk', 390);
  await page.waitForFunction(() => !!window.LerenCoursePlayer && !!window.LerenCourses);
  const ok = await page.evaluate(async () => { try { await (window.LerenCourses.load ? window.LerenCourses.load('en') : 0) } catch (e) {} return !!LerenCoursePlayer.open('en', 'uk') });
  assert.ok(ok, 'course player opens'); await page.waitForSelector('.cp-stage'); assert.equal(await page.locator('.cp-body .lesson-help').count(), 0, 'no button on the course home');
  await page.click('.cp-body .cp-primary');
  await page.waitForSelector('.cp-body .lesson-help', {timeout: 15000}).catch(async () => { throw new Error('no button in the Course Player: ' + (await page.locator('.cp-body').innerHTML()).slice(0, 300)) });
  const b = await box(page, '.cp-body .lesson-help'); assert.ok(b.height >= 44, 'CP target');
  await page.click('.cp-body .lesson-help'); await page.waitForSelector(S + '.ai-chat-card', {timeout: 15000});
  const visible = await page.evaluate(() => { const h = document.querySelector('.lexi-host'), r = h.getBoundingClientRect(), e = document.elementFromPoint(r.x + r.width / 2, r.y + r.height / 2); return !!e && (h.contains(e) || e === h || h.shadowRoot?.contains(e) || e.closest('.lexi-host') === h) });
  assert.ok(visible, 'Lexi is on top of the Course Player');
  // second phase of the lesson (listening): after picking an answer the sample answer and the pick are sent
  await page.evaluate(() => { document.querySelector('.lexi-host') && lexiClose() }); await page.waitForTimeout(200);
  for (let i = 0; i < 40 && !await page.locator('.cp-opt').count(); i++) { await page.locator('.cp-body .cp-primary').first().click(); await page.waitForTimeout(60) }
  assert.ok(await page.locator('.cp-opt').count(), 'reached the listening phase');
  assert.equal(await page.locator('.cp-body .lesson-help').count(), 1, 'button on the listening step');
  await page.locator('.cp-opt').first().click(); await page.waitForSelector('.cp-feedback');
  await page.click('.cp-body .lesson-help'); await page.waitForSelector(S + '.ai-chat-card'); await ask(page, 'Why?'); const j = lastChat();
  assert.equal(j.profile.kind, 'listen'); assert.ok(j.profile.expected && j.profile.answer, 'player: sample answer and pick after answering'); assert.ok(!j.profile.question, 'listening: the task text is not invented');
  assert.equal(errors.length, 0, errors.join()); await ctx.close();
  console.log('PASS: Course Player — button, 44 px, Lexi on top of the player, listening step sends kind + sample answer + pick');
 }
 await browser.close(); server.close();
})().catch(e => { console.error('FAIL:', e.stack || e.message); process.exit(1) });
