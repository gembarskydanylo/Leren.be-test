// TEST-033 · Features of the earlier chat, brought back into the TEST-030 Lexi chat (design lab = source, app = generated):
// «Не знаю, що відповісти» (a hint + one editable example, never sent by itself), the conversation style for free talk
// (talk / teacher / slow — sent as the engine's existing extra.style), practising a correction (write the corrected
// sentence, compare with the example), light corrections in free talk («Краще: …»), automatic voice of Lexi's replies with
// a switch. In the app: the real engine with a MOCK AI on the same origin (no real AI): requests, mistakes list, XP,
// progress and LIFE as before, settings remembered on this device. Chromium emulation, not a physical phone.
const fs = require('node:fs'), path = require('node:path'), http = require('node:http'), assert = require('node:assert/strict');
const repo = path.join(__dirname, '..');
const T = {'.html': 'text/html', '.js': 'text/javascript', '.mjs': 'text/javascript', '.css': 'text/css', '.json': 'application/json', '.png': 'image/png', '.webp': 'image/webp', '.jpg': 'image/jpeg', '.svg': 'image/svg+xml', '.m4a': 'audio/mp4', '.woff': 'font/woff', '.webmanifest': 'application/manifest+json'};
const OK = {reply: 'Hallo! Waar woon je?', translation: 'Привіт! Де ти живеш?', correction: null};
const FIX = {reply: 'Ah, in Gent! Werk je daar ook?', translation: 'А, у Генті!', correction: {has_error: true, severity: 'minor', original: 'Ik woon op Gent', corrected: 'Ik woon in Gent.', explanation: 'Перед містом — «in».'}};
const HINT = {answer: 'Почни з «Ik woon in …».', examples: [{lang: 'nl', text: 'Ik woon in Antwerpen.', translation: 'Я живу в Антверпені.'}]};
const FAKE_VV = () => { const vv = new EventTarget(); let kb = 0; Object.defineProperties(vv, {height: {get: () => innerHeight - kb}, width: {get: () => innerWidth}, offsetTop: {get: () => 0}, offsetLeft: {get: () => 0}, scale: {get: () => 1}}); Object.defineProperty(window, 'visualViewport', {configurable: true, get: () => vv}); window.__keyboard = px => { kb = px; vv.dispatchEvent(new Event('resize')) } };
(async () => {
 let chromium; try { ({chromium} = require('playwright')) } catch { console.log('SKIP: Playwright is not installed'); return }
 const queue = [], seen = [];
 const server = http.createServer((q, r) => {
  const u = new URL(q.url, 'http://x');
  if (u.pathname === '/mock-ai/') { let b = ''; q.on('data', c => b += c); q.on('end', () => { if (q.method !== 'POST') { r.statusCode = 204; return r.end() }
   const j = JSON.parse(b); seen.push(j); const n = j.mode === 'memo' ? {memory: ''} : j.mode === 'report' ? {ok: true} : queue.shift() || (j.mode === 'ask' ? HINT : OK);
   r.setHeader('content-type', 'application/json'); r.end(JSON.stringify(n)) }); return }
  let f = path.join(repo, decodeURIComponent(u.pathname)); if (fs.existsSync(f) && fs.statSync(f).isDirectory()) f = path.join(f, 'index.html');
  if (!f.startsWith(repo + path.sep) || !fs.existsSync(f)) { r.statusCode = 404; return r.end() }
  r.setHeader('content-type', T[path.extname(f)] || 'application/octet-stream'); fs.createReadStream(f).pipe(r) });
 await new Promise(r => server.listen(0, '127.0.0.1', r)); const O = 'http://localhost:' + server.address().port, AI = O + '/mock-ai/';
 let browser; try { browser = await chromium.launch() } catch { console.log('SKIP: no Chromium'); server.close(); return }
 const rel = fs.readFileSync(path.join(repo, 'app/app.js'), 'utf8').match(/RELEASE_VERSION="(\d+)"/)[1];
 let checks = 0;
 const R = app => app ? '.lexi-host >> ' : '';
 const bubbles = (page, app) => page.locator(R(app) + '.g-bub.them').count();
 async function send(page, app, text) { const n = await bubbles(page, app); await page.fill(R(app) + '#draft', text); await page.press(R(app) + '#draft', 'Enter'); await page.waitForFunction(([app, n]) => { const r = app ? document.querySelector('.lexi-host').shadowRoot : document; return r.querySelectorAll('.g-bub.them').length > n && r.querySelector('.chat-log').getAttribute('aria-busy') === 'false' }, [app, n], {timeout: 10000}) }
 const vis = (page, sel) => page.locator(sel).first().isVisible();
 async function openSettings(page, app) { if (!await vis(page, R(app) + '.sidebar')) await page.click(R(app) + '.settings-button') }

 // ---- design lab (demo engine): every feature, phone and RTL
 for (const [w, h, ui] of [[390, 844, 'uk'], [320, 640, 'ar'], [1440, 900, 'en']]) {
  const ctx = await browser.newContext({viewport: {width: w, height: h}, isMobile: w < 768, hasTouch: w < 768}), page = await ctx.newPage(), errs = []; page.on('pageerror', e => errs.push(e.message));
  await page.addInitScript(FAKE_VV); await page.goto(O + `/design-lab/test-030/lexi/?ui=${ui}`); await page.waitForSelector('#draft');
  const L = await page.evaluate(async ui => (await import('./copy.js')).copy(ui), ui);
  assert.equal(await page.locator('[data-action=help]').count(), 0, w + ': no hint before Lexi has said anything');
  await send(page, false, ui === 'uk' ? 'Hallo, ik ben Anastasia.' : 'Hallo'); // demo: correct
  assert.equal(await page.textContent('[data-action=help]'), L.help, w + ': «' + L.help + '» after Lexi\'s reply');
  // light correction in free talk (default style «talk»)
  await send(page, false, 'Ik werken in België.');
  assert.equal(await page.locator('.ai-fix').count(), 0, w + ': no big correction panel in the light conversation style');
  const light = page.locator('.light-fix').last(); assert.ok(await light.isVisible(), w + ': light correction shown in free talk');
  assert.match(await light.textContent(), new RegExp(L.better.replace(/[?]/g, '\\?') + '.*Ik werk in België\\.'), w + ': «' + L.better + ' Ik werk in België.»');
  // «I don't know what to answer»: hint + one example, inserted for editing, never sent
  await page.click('[data-action=help]'); await page.waitForSelector('.ac-hint');
  assert.match(await page.textContent('.ac-hint'), /Ik werk in België\./, w + ': hint with one example');
  const before = await bubbles(page, false); await page.click('[data-action=use]');
  assert.equal(await page.inputValue('#draft'), 'Ik werk in België.', w + ': example in the field to edit'); assert.equal(await bubbles(page, false), before, w + ': nothing sent by itself'); assert.equal(await page.locator('.ac-hint').count(), 0);
  await page.fill('#draft', '');
  // practise the correction
  await page.locator('.light-fix [data-action=practise]').last().click(); await page.waitForSelector('.ac-practice');
  assert.ok(!await vis(page, '.ai-type'), w + ': composer out of the way while practising'); assert.ok(await vis(page, '#practice'), w + ': practice field visible');
  await page.fill('#practice', 'Ik werken in België'); await page.press('#practice', 'Enter'); assert.equal(await page.textContent('.practice-status'), L.practiceAgain, w + ': wrong sentence → try again');
  await page.fill('#practice', 'ik werk in belgië'); await page.click('.ac-repeat button[type=submit]'); assert.equal(await page.textContent('.practice-status'), L.practiceOk, w + ': same words (case and punctuation ignored) → matches');
  await page.click('[data-action=another]'); await page.waitForSelector('.ac-hint'); assert.ok(await vis(page, '.ac-practice'), w + ': another example below the exercise');
  await page.click('[data-action=closePractice]'); assert.equal(await page.locator('.ac-practice').count(), 0); assert.ok(await vis(page, '#draft'), w + ': back to the conversation');
  // style picker: teacher → full panel with practise; the notice says the next reply uses it
  await openSettings(page, false); assert.equal(await page.inputValue('select[name=style]'), 'talk');
  await page.selectOption('select[name=style]', 'teacher'); assert.equal(await page.textContent('.notice'), L.styleChanged); const kept = await bubbles(page, false); assert.ok(kept >= 2, w + ': the conversation is kept when the style changes');
  if (w < 768 && await vis(page, '.sidebar')) await page.click('.settings-button');
  await send(page, false, 'Ik werken in België.'); assert.ok(await vis(page, '.ai-fix >> nth=-1'), w + ': teacher style → correction panel'); assert.equal(await page.locator('.ai-fix').last().locator('[data-action=practise]').count(), 1);
  // only in conversations
  await openSettings(page, false); await page.click('[data-scenario=grammar]'); assert.equal(await page.locator('select[name=style]').count(), 0, w + ': style only for free conversation');
  if (w < 768 && await vis(page, '.sidebar')) await page.click('.settings-button');
  await send(page, false, 'de of het?'); assert.equal(await page.locator('[data-action=help]').count(), 0, w + ': no «help me answer» for grammar questions');
  assert.ok(!await page.evaluate(() => document.documentElement.scrollWidth > innerWidth + 1), w + ': no horizontal overflow');
  if (ui === 'ar') assert.equal(await page.evaluate(() => document.documentElement.dir), 'rtl');
  // phone keyboard (emulated): the practice field stays above the keyboard, the history is the only scroll
  if (w < 768) {
   await page.click('[data-scenario=free]').catch(async () => { await openSettings(page, false); await page.click('[data-scenario=free]') });
   if (await vis(page, '.sidebar')) await page.click('.settings-button');
   await send(page, false, 'Ik werken in België.'); await page.locator('[data-action=practise]').last().click(); await page.focus('#practice'); await page.evaluate(() => __keyboard(Math.round(innerHeight * .45))); await page.waitForTimeout(150);
   const k = await page.evaluate(() => { const b = document.querySelector('#practice').getBoundingClientRect(), log = document.querySelector('.chat-log').getBoundingClientRect(); return {bottom: b.bottom, top: b.top, vv: visualViewport.height, logTop: log.top, logBottom: log.bottom, page: document.scrollingElement.scrollHeight - innerHeight} });
   assert.ok(k.top >= k.logTop - 1 && k.bottom <= Math.min(k.vv, k.logBottom) + 1 && k.page <= 0, w + ': practice field visible above the keyboard ' + JSON.stringify(k));
  }
  assert.deepEqual(errs, []); await ctx.close(); checks++;
 }

 // ---- app: real engine, mock AI
 const ctx = await browser.newContext({viewport: {width: 390, height: 844}, isMobile: true, hasTouch: true, serviceWorkers: 'block'}), page = await ctx.newPage(), errs = [], outside = [];
 page.on('pageerror', e => errs.push(e.message)); await ctx.route(/^https?:\/\/(?!localhost)/, r => { outside.push(r.request().url()); r.abort() });
 await page.addInitScript(([rel, AI]) => { if (localStorage.getItem('seeded')) return; localStorage.setItem('seeded', '1');
  for (const [k, v] of Object.entries({leren_release_seen: JSON.stringify(rel), poly_ui: 'uk', poly_target: 'nl', leren_home_v1: 'path', leren_welcome_seen: 'true', leren_onboarding_language_v1: '1', leren_start_known_v1: 'zero', leren_ai_consent18: 'true', leren_ai_endpoint: JSON.stringify(AI), poly_score: '500', leren_life_xp_v1: JSON.stringify({'first-day:station': 40})})) localStorage.setItem(k, v) }, [rel, AI]);
 await page.goto(O + '/app/'); await page.waitForFunction(() => !!window.LerenLexi && typeof lexiOpen === 'function');
 await page.evaluate(() => { window.__said = []; say = (t, b, done) => { window.__said.push(t); done && setTimeout(done, 20) }; window.__games = []; const g = gameDone; gameDone = (id, xp) => { window.__games.push([id, xp]); return g(id, xp) } });
 const KEYS = ['poly_score', 'leren_life_xp_v1', 'leren_path_v1', 'leren_learning_path_v1', 'leren_mistakes'];
 const store = () => page.evaluate(k => Object.fromEntries(k.map(x => [x, localStorage.getItem(x)])), KEYS);
 const before = await store();
 await page.evaluate(() => lexiOpen('free', {})); await page.waitForSelector('.lexi-host >> #draft');
 await openSettings(page, true); assert.equal(await page.inputValue('.lexi-host >> select[name=style]'), 'talk', 'app: light conversation style by default'); assert.ok(await page.isChecked('.lexi-host >> input[name=autoVoice]'), 'app: auto voice on by default');
 await page.click('.lexi-host >> .settings-button');
 queue.push(FIX); await send(page, true, 'Ik woon op Gent');
 let j = seen.filter(x => x.mode === 'chat').at(-1); assert.equal(j.style, 'talk', 'app: the style reaches the engine as extra.style (existing API)');
 assert.ok(await vis(page, '.lexi-host >> .light-fix'), 'app: light correction in free talk'); assert.equal((await store()).leren_mistakes, before.leren_mistakes, 'app: a minor correction in the light style is not added to the mistakes list (as the old «talk» style)');
 assert.deepEqual(await page.evaluate(() => __said), ['Ah, in Gent! Werk je daar ook?'], 'app: Lexi\'s reply read aloud automatically');
 // hint: an «ask» request with learning data, not counted as a message
 const n0 = seen.length; await page.click('.lexi-host >> [data-action=help]'); await page.waitForSelector('.lexi-host >> .ac-hint');
 const hint = seen.slice(n0).find(x => x.mode === 'ask'); assert.ok(hint && JSON.stringify(hint.messages).includes("Help me answer my tutor's question") && hint.char === 'lexi', 'app: hint asked through Lexi (lesson / ask), same prompt as the old chat');
 assert.ok(hint.profile && Object.keys(hint.profile).length, 'app: hint request has a profile'); { const {question, ...rest} = hint.profile; assert.equal(question, 'Ah, in Gent! Werk je daar ook?', 'app: the hint knows Lexi\'s question'); assert.deepEqual(rest, j.profile, 'app: the hint request carries the same learning profile as a message (from extra.learning), as the old one') }
 await page.click('.lexi-host >> [data-action=use]'); assert.equal(await page.inputValue('.lexi-host >> #draft'), 'Ik woon in Antwerpen.');
 // switch auto voice off (remembered), teacher style (remembered)
 await openSettings(page, true); await page.uncheck('.lexi-host >> input[name=autoVoice]'); await page.selectOption('.lexi-host >> select[name=style]', 'teacher'); await page.click('.lexi-host >> .settings-button');
 assert.deepEqual(await page.evaluate(() => [localStorage.getItem('leren_lexi_autovoice'), localStorage.getItem('leren_ai_style')]), ['false', '"teacher"'], 'app: settings remembered on this device');
 queue.push(FIX); await send(page, true, 'Ik woon op Gent');
 j = seen.filter(x => x.mode === 'chat').at(-1); assert.equal(j.style, 'teacher'); assert.ok(await vis(page, '.lexi-host >> .ai-fix >> nth=-1'), 'app: teacher style → correction panel');
 assert.equal((await page.evaluate(() => __said)).length, 1, 'app: no automatic voice once switched off');
 assert.match((await store()).leren_mistakes || '', /Ik woon in Gent\./, 'app: teacher style adds the correction to the mistakes list (as the old chat)');
 await page.locator('.lexi-host >> .ai-fix [data-action=practise]').last().click(); await page.fill('.lexi-host >> #practice', 'Ik woon in Gent'); await page.press('.lexi-host >> #practice', 'Enter');
 assert.match(await page.textContent('.lexi-host >> .practice-status'), /збігається/, 'app: practice compared');
 await page.click('.lexi-host >> [data-action=closePractice]');
 // XP / progress / LIFE: two messages, a hint and a practice give no XP and change nothing else
 assert.deepEqual(await page.evaluate(() => __games), [], 'app: no XP for a hint or a practice (5 messages = 30 XP stays the rule)');
 const after = await store(); for (const k of ['poly_score', 'leren_life_xp_v1', 'leren_path_v1', 'leren_learning_path_v1']) assert.equal(after[k], before[k], 'app: ' + k + ' unchanged');
 // reopen: remembered
 await page.click('.lexi-host >> [data-action=leave]'); await page.waitForFunction(() => !document.querySelector('.lexi-host'));
 await page.evaluate(() => lexiOpen('free', {})); await page.waitForSelector('.lexi-host >> #draft'); await openSettings(page, true);
 assert.equal(await page.inputValue('.lexi-host >> select[name=style]'), 'teacher'); assert.ok(!await page.isChecked('.lexi-host >> input[name=autoVoice]'), 'app: switches remembered when Lexi opens again');
 // 5 messages still = 30 XP («ai» game), as before
 await page.click('.lexi-host >> .settings-button'); for (let i = 1; i <= 5; i++) await send(page, true, 'Zin ' + i);
 assert.deepEqual(await page.evaluate(() => __games), [['ai', 30]], 'app: 5 messages → 30 XP, as before');
 assert.deepEqual(errs, []); assert.deepEqual(outside, [], 'no request outside localhost (no real AI)'); assert.ok(seen.every(x => x.char === 'lexi'));
 await ctx.close(); checks++;

 // ---- app: AI exam screens (A1.1 mock speaking exam, exam writing check) in the Concept B look; exam logic unchanged
 for (const [w, h, theme] of [[390, 844, 'light'], [320, 640, 'dark'], [1440, 900, 'light']]) {
  const ctx = await browser.newContext({viewport: {width: w, height: h}, isMobile: w < 768, hasTouch: w < 768, serviceWorkers: 'block'}), page = await ctx.newPage(), errs = [];
  page.on('pageerror', e => errs.push(e.message)); await ctx.route(/^https?:\/\/(?!localhost)/, r => r.abort());
  await page.addInitScript(([rel, AI, theme]) => { if (localStorage.getItem('seeded')) return; localStorage.setItem('seeded', '1');
   for (const [k, v] of Object.entries({leren_release_seen: JSON.stringify(rel), poly_ui: 'uk', poly_target: 'nl', leren_home_v1: 'path', leren_welcome_seen: 'true', leren_onboarding_language_v1: '1', leren_start_known_v1: 'zero', leren_tour_done: 'true', leren_level_asked: 'true', leren_ai_consent18: 'true', leren_ai_endpoint: JSON.stringify(AI), poly_theme: theme})) localStorage.setItem(k, v) }, [rel, AI, theme]);
  await page.goto(O + '/app/'); await page.waitForFunction(() => typeof learningPath === 'object' && learningPath && typeof EXAM11 === 'object', null, {timeout: 20000});
  await page.evaluate(() => { setView('games'); EXAM11.open(); aiStart({id: 'exam11', fromExam: true, fresh: true}) }); await page.waitForSelector('#card.lexi-b .ai-row');
  queue.push(FIX); await page.fill('#card .ai-type input', 'Ik woon op Gent'); await page.press('#card .ai-type input', 'Enter'); await page.waitForSelector('#card.lexi-b .ai-fix');
  const m = await page.evaluate(() => { const c = document.getElementById('card'), q = s => c.querySelector(s), r = s => q(s)?.getBoundingClientRect();
   const small = [...c.querySelectorAll('button,input,select,summary')].filter(e => { const b = e.getBoundingClientRect(); return b.width && b.height && getComputedStyle(e).visibility !== 'hidden' && (b.height < 43.5 || b.width < 43.5) }).map(e => (e.className || e.tagName) + ' ' + Math.round(e.getBoundingClientRect().width) + 'x' + Math.round(e.getBoundingClientRect().height));
   return {small, input: r('.ai-type input').width, av: r('.ai-row .st-av').width, over: document.documentElement.scrollWidth - innerWidth, me: getComputedStyle(q('.g-bub.me')).backgroundColor, mic: q('.g-mic-btn')?.textContent || '', progress: !!q('.ex-progress')} });
  assert.deepEqual(m.small, [], `exam ${w} ${theme}: targets ≥ 44 px`); assert.ok(m.over <= 1, `exam ${w}: no horizontal overflow`);
  assert.ok(m.input >= (w < 360 ? 120 : 150), `exam ${w}: the message field keeps room (${Math.round(m.input)} px)`); assert.ok(m.av >= 44, `exam ${w}: Lexi's avatar beside her replies (${m.av})`); assert.ok(m.progress, 'exam progress strip kept');
  assert.equal(m.me, theme === 'dark' ? 'rgb(48, 72, 54)' : 'rgb(232, 237, 221)', `exam ${theme}: Concept B colours (learner bubble)`); assert.match(m.mic, /Говорити|Speak/, 'exam: the mic keeps its label as accessible name');
  await page.evaluate(() => askStart({focus: 'exam11', send: 'Beste Tom, ik kom morgen niet. Groetjes, Anna'})); await page.waitForSelector('#card.lexi-b .ai-ans + .ai-row, #card.lexi-b .ai-row:nth-child(2)');
  assert.ok(await page.evaluate(() => document.getElementById('card').classList.contains('lexi-b')), 'exam writing check in the Concept B look');
  await page.evaluate(() => { setView('games'); renderGamesHome() }); assert.ok(!await page.evaluate(() => /lexi-b|ai-chat-card/.test(document.getElementById('card').className)), 'exam look does not leak to the games screen');
  await page.evaluate(() => setView('lesson')); assert.ok(!await page.evaluate(() => /lexi-b|ai-chat-card/.test(document.getElementById('card').className)), 'nor to the lesson');
  assert.deepEqual(errs, []); await ctx.close(); checks++;
 }
 await browser.close(); server.close();
 console.log(`PASS: ${checks} runs — lab 390 uk / 320 ar RTL / 1440 en and app (real engine, mock AI): «Не знаю, що відповісти» (hint + editable example, never sent, learning data), light corrections in free talk, style talk / teacher / slow via extra.style (kept conversation, remembered), practising a correction (again / matches, another example, back), auto voice with a remembered switch, mistakes list as the old chat, no XP for hints or practice, 5 messages = 30 XP, score / LIFE / path unchanged, practice field above the emulated keyboard; AI exam (speaking + writing check) in the Concept B look at 390 / 320 dark / 1440 — 44 px targets, room for the field, Lexi avatar, no overflow, no leak to other screens`);
})().catch(e => { console.error(e); process.exit(1) });
