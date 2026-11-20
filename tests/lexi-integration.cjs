// TEST-032 · The Lexi chat designed in TEST-030 running in the real app/ on the real TEST-031 engine (LerenLexi), with a
// MOCK AI on the same origin (no real AI call, no Worker). Chromium, emulated phone and desktop.
// The UI is the generated copy of design-lab/test-030/lexi (tools/lexi-ui-port.cjs --check) with the approved artwork
// byte for byte; all 11 AI entries; five scenarios; studied language / explanation language / level; history; errors
// (API failure + retry without duplicate, minute and daily limits, offline, beta); states idle / error (never «api-error»);
// XP, mistakes list and notes as before, LIFE and progress untouched; report; voice (edit before send, refusal, speak);
// Android back and Escape; dialog, inert background, focus return; no overflow, 44 px targets, dark theme, RTL;
// no CSP violation; service worker: the chat opens offline from the cache; AI exam keeps its screens.
const fs = require('node:fs'), path = require('node:path'), http = require('node:http'), assert = require('node:assert/strict'), crypto = require('node:crypto'), {execFileSync} = require('node:child_process');
const repo = path.join(__dirname, '..');
const T = {'.html': 'text/html', '.js': 'text/javascript', '.mjs': 'text/javascript', '.css': 'text/css', '.json': 'application/json', '.png': 'image/png', '.webp': 'image/webp', '.jpg': 'image/jpeg', '.svg': 'image/svg+xml', '.m4a': 'audio/mp4', '.woff': 'font/woff', '.webmanifest': 'application/manifest+json'};
const OK = {reply: 'Hallo! Waar woon je?', translation: 'Привіт! Де ти живеш?', correction: null};
const FIX = {reply: 'Ah, in Gent! Werk je daar ook?', translation: 'А, у Генті!', correction: {has_error: true, severity: 'minor', original: 'Ik woon op Gent', corrected: 'Ik woon in Gent.', explanation: 'Перед містом — «in».'}};
const ASK = {answer: '«de» — для більшості слів.', examples: [{lang: 'nl', text: 'de man', translation: 'чоловік'}]};
const sha = f => crypto.createHash('sha256').update(fs.readFileSync(path.join(repo, f))).digest('hex');

// ---- static: the app copy is exactly the design lab + the documented patches; artwork unchanged; no «api-error»
execFileSync(process.execPath, [path.join(repo, 'tools/lexi-ui-port.cjs'), '--check'], {stdio: 'pipe'});
assert.equal(sha('app/img/lexi/lexi.webp'), sha('design-lab/test-030/assets/lexi-master-proposal.webp'), 'approved Lexi artwork unchanged');
assert.equal(sha('app/img/lexi/lexi-emotions.webp'), sha('design-lab/test-030/assets/lexi-emotions-proposal.webp'), 'approved emotions unchanged');
for (const f of ['app/app.js', 'app/modules/lexi/chat.js', 'app/modules/lexi/engine.js']) assert(!fs.readFileSync(path.join(repo, f), 'utf8').includes('api-error'), f + ': the error state is «error» + code (contract §10), not «api-error»');
assert.match(fs.readFileSync(path.join(repo, 'app/app.js'), 'utf8'), /const lexiDemo=\(\)=>\{if\(prodServices\(\)\)return false;/, 'demo replies can never run on lerenbe.com');
console.log('PASS: static — app chat = design lab + documented patches (port --check), approved artwork byte-identical, no «api-error», demo never in production');

(async () => {
 let chromium; try { ({chromium} = require('playwright')) } catch { console.log('SKIP: Playwright is not installed'); return }
 const queue = [], seen = [];
 const server = http.createServer((q, r) => {
  const u = new URL(q.url, 'http://x');
  if (u.pathname === '/mock-ai/') { let b = ''; q.on('data', c => b += c); q.on('end', () => { if (q.method !== 'POST') { r.statusCode = 204; return r.end() }
   const j = JSON.parse(b); seen.push(j);
   const n = j.mode === 'memo' ? {status: 200, body: {memory: 'Woont in Gent.'}} : j.mode === 'report' ? {status: 200, body: {ok: true}} : queue.shift() || {status: 200, body: j.mode === 'ask' ? ASK : OK};
   r.statusCode = n.status; r.setHeader('content-type', 'application/json'); if (n.headers) for (const [k, v] of Object.entries(n.headers)) r.setHeader(k, v); r.end(JSON.stringify(n.body)) }); return }
  let f = path.join(repo, decodeURIComponent(u.pathname)); if (f.endsWith(path.sep)) f += 'index.html';
  if (!f.startsWith(repo) || !fs.existsSync(f) || fs.statSync(f).isDirectory()) { r.statusCode = 404; return r.end() }
  r.setHeader('content-type', T[path.extname(f)] || 'application/octet-stream'); fs.createReadStream(f).pipe(r) });
 await new Promise(r => server.listen(0, '127.0.0.1', r)); const port = server.address().port, B = 'http://localhost:' + port + '/app/', AI = 'http://localhost:' + port + '/mock-ai/';
 let browser; try { browser = await chromium.launch() } catch { console.log('SKIP: no Chromium'); server.close(); return }
 const rel = fs.readFileSync(path.join(repo, 'app/app.js'), 'utf8').match(/RELEASE_VERSION="(\d+)"/)[1];
 const KEYS = ['poly_score', 'leren_path_v1', 'leren_life_xp_v1', 'leren_xp_v2', 'poly_progress', 'leren_char', 'poly_target', 'poly_ui', 'poly_level'];
 async function open({endpoint = AI, viewport = {width: 390, height: 844}, ui = 'uk', sw = 'block', query = '', theme} = {}) {
  const ctx = await browser.newContext({viewport, serviceWorkers: sw}), page = await ctx.newPage(), errors = [], outside = [];
  // TEST-033: on phones the chat settings (scenarios, languages, level, situation) sit behind the header settings button once
  // the conversation runs, so a sidebar control is reached the way a user reaches it — tap «Налаштування чату» first.
  for (const m of ['click', 'selectOption']) { const orig = page[m].bind(page); page[m] = async (sel, ...a) => { if (typeof sel === 'string' && sel.startsWith(S) && await page.locator(sel).count() && !await page.locator(sel).first().isVisible() && await page.locator(sel).first().evaluate(e => !!e.closest('.sidebar'))) { const b = page.locator(S + '.settings-button'); if (await b.isVisible()) await b.click() } return orig(sel, ...a) } }
  page.on('pageerror', e => errors.push(e.message)); await ctx.route(/^https?:\/\/(?!localhost)/, r => { outside.push(r.request().url()); r.abort() });
  await page.addInitScript(([rel, endpoint, ui, theme]) => {
   if (!localStorage.getItem('seeded')) { localStorage.setItem('seeded', '1');
    for (const [k, v] of Object.entries({leren_release_seen: JSON.stringify(rel), poly_ui: ui, poly_target: 'nl', leren_home_v1: 'path', leren_welcome_seen: 'true', leren_onboarding_language_v1: '1', leren_start_known_v1: 'zero', leren_ai_consent18: 'true', leren_char: '"peter"', leren_life_xp_v1: JSON.stringify({'first-day:station': 40}), ...(theme ? {poly_theme: theme, leren_theme: JSON.stringify(theme)} : {})})) localStorage.setItem(k, v);
    if (endpoint) localStorage.setItem('leren_ai_endpoint', JSON.stringify(endpoint)) }
   window.__csp = []; document.addEventListener('securitypolicyviolation', e => window.__csp.push(e.violatedDirective + ' ' + e.blockedURI));
   window.SpeechRecognition = class { start() { if (!window.__srArmed) return; window.__srArmed = false; setTimeout(() => { if (window.__srDeny) { this.onerror && this.onerror({error: 'not-allowed'}); this.onend && this.onend(); return }
     const alt = [{transcript: window.__srText, confidence: .9}]; alt.isFinal = true; this.onresult && this.onresult({results: [alt], resultIndex: 0}); setTimeout(() => { window.__srLang = this.lang; this.onend && this.onend() }, 30) }, 30) }
    stop() { setTimeout(() => this.onend && this.onend(), 10) } abort() { setTimeout(() => this.onend && this.onend(), 10) } };
  }, [rel, endpoint, ui, theme]);
  await page.goto(B + query); await page.waitForSelector('.hv'); await page.waitForFunction(() => !!window.LerenLexi);
  await page.evaluate(() => { window.__said = []; say = (t, b, done) => { window.__said.push(t); done && setTimeout(done, 20) }; window.__games = []; const g = gameDone; gameDone = (id, xp) => { window.__games.push([id, xp]); return g(id, xp) } });
  return {ctx, page, errors, outside};
 }
 const data = page => page.evaluate(k => k.map(x => localStorage.getItem(x)), KEYS);
 const S = '.lexi-host >> '; // Playwright pierces the open shadow root
 const lexi = (page, sc, ctx) => page.evaluate(([sc, ctx]) => lexiOpen(sc, ctx), [sc, ctx || {}]).then(() => page.waitForSelector(S + '.ai-chat-card', {timeout: 15000}));
 const send = async (page, text, n) => { const k = await page.locator(S + '.g-bub.them').count(); await page.fill(S + 'input[name=draft]', text); await page.click(S + 'button.send'); if (n !== false) await page.waitForFunction(k => { const r = document.querySelector('.lexi-host')?.shadowRoot; return r && (r.querySelectorAll('.g-bub.them').length > k || r.querySelector('.error-panel')) }, k, {timeout: 15000}) };
 const state = page => page.evaluate(() => { const r = document.querySelector('.lexi-host').shadowRoot; return {status: r.querySelector('.status').textContent, err: r.querySelector('.error-panel')?.textContent || '', bubbles: r.querySelectorAll('.g-bub').length, prog: r.querySelector('#prog').textContent} });
 const last = () => seen.filter(j => j.mode === 'chat' || j.mode === 'ask').at(-1);
 const closeLexi = page => page.click(S + '[data-action=leave]').then(() => page.waitForFunction(() => !document.querySelector('.lexi-host')));
 try {
  // ---- A · entries: ten open the Lexi chat on the engine, the A1.1 speaking exam keeps its screen (Lexi), all requests char lexi
  {
   const src = fs.readFileSync(path.join(repo, 'app/app.js'), 'utf8');
   assert.match(src, /  chat:\(\)=>aiStart\(\),/, 'bridge.chat opens Lexi (no id, no view switch)'); assert.match(src, /health:"huisarts"[^\n]*\};aiStart\(SCENES\.find\(sc=>sc\.id===\(ids\[chapter\]\|\|"buren"\)\)\)\}/, 'bridge.ai(chapter) → aiStart(scene)');
   const {ctx, page, errors, outside} = await open(), before = await data(page), seen0 = seen.length;
   const entries = [
    ['game «Praat met Lexi»', () => { setView('games'); aiStart() }, 'free'],
    ['game «Запитай Lexi»', () => { setView('games'); askStart() }, 'grammar'],
    ['lexiOpen free', () => lexiOpen('free'), 'free'], ['lexiOpen speaking', () => lexiOpen('speaking'), 'speaking'],
    ['lexiOpen roleplay', () => lexiOpen('roleplay', {scene: 'doctor'}), 'roleplay'], ['lexiOpen grammar', () => lexiOpen('grammar'), 'grammar'],
    ['lexiOpen lesson', () => lexiOpen('lesson', {lesson: 'Begroeten', question: 'Hoe heet je?', answer: 'Ik heet Anna'}), 'lesson'],
    ['Day in Belgium scene', () => aiStart(SCENES.find(s => s.id === 'cafe')), 'roleplay'],
    ['lesson conversation (bridge.ai «health» = what the bridge calls)', () => aiStart(SCENES.find(s => s.id === 'huisarts')), 'roleplay'],
    ['home «talk to Lexi» (real button → bridge.chat)', () => { setView('path'); const t = document.querySelector('.fh-more-tile[data-more="chat"]') || [...document.querySelectorAll('.hs-button')].find(x => /Lexi|AI/.test(x.textContent)); t.click() }, 'free'],
   ];
   for (const [name, fn, sc] of entries) {
    await page.evaluate(`(${fn})()`); await page.waitForSelector(S + '.ai-chat-card', {timeout: 15000});
    const st = await page.evaluate(() => { const r = document.querySelector('.lexi-host').shadowRoot; return {prog: r.querySelector('#prog').textContent, av: r.querySelector('img.lexi-av').getAttribute('src'), pressed: r.querySelector('[data-scenario][aria-pressed=true]').dataset.scenario, scene: r.querySelector('select[name=scene]')?.value || ''} });
    assert.equal(st.prog, 'Lexi', name); assert.equal(st.av, './img/lexi/lexi.webp', name); assert.equal(st.pressed, sc, name + ': scenario');
    if (name === 'Day in Belgium scene') assert.equal(st.scene, 'cafe', 'older scene kept and named');
    if (name.startsWith('lesson conversation')) assert.equal(st.scene, 'doctor', 'huisarts → doctor in the picker');
    await send(page, 'Ik woon in Gent'); const j = last(); assert.equal(j.char, 'lexi', name); assert.equal(j.scenario, sc, name + ': request scenario');
    if (name === 'Day in Belgium scene') assert.equal(j.scene, 'cafe'); if (name === 'lexiOpen roleplay') assert.equal(j.scene, 'huisarts');
    if (name === 'lexiOpen lesson') { assert.equal(j.profile.lesson, 'Begroeten'); assert.equal(j.profile.question, 'Hoe heet je?'); assert.equal(j.profile.answer, 'Ik heet Anna') }
    await closeLexi(page);
   }
   // 11th: the A1.1 mock speaking exam keeps its screen (Lexi's picture, exam style, exam scene)
   queue.push({status: 200, body: OK}); await page.evaluate(() => { setView('games'); EXAM11.open(); aiStart({id: 'exam11', fromExam: true, fresh: true}) }); await page.waitForSelector('.ai-chat .g-bub.them');
   assert.equal(await page.locator('.lexi-host').count(), 0); assert(await page.locator('.ai-chat img.lexi-av').count() > 0, 'exam screen uses Lexi');
   let j = last(); assert.equal(j.char, 'lexi'); assert.equal(j.style, 'exam'); assert.equal(j.scene, 'exam11');
   // exam writing check (Ask Lexi with the exam focus) keeps its screen too, 1600 characters
   queue.push({status: 200, body: ASK}); await page.evaluate(() => askStart({focus: 'exam11', send: 'Beste Tom, ik kom morgen niet naar de les want ik ben ziek. Groetjes, Anna'})); await page.waitForSelector('.ai-chat .ai-ans + .ai-row, .ai-chat .ai-row:nth-child(3)');
   j = last(); assert.equal(j.focus, 'exam11'); assert.equal(j.mode, 'ask'); assert.equal(await page.locator('form.g-type input').getAttribute('maxlength'), '1600');
   assert(seen.slice(seen0).every(x => x.char === 'lexi'), 'every request is Lexi');
   assert.deepEqual(errors, []); assert.deepEqual(outside, [], 'no request outside localhost (no real AI)');
   const after = await data(page); assert.deepEqual([after[2], after[5], after[6], after[7], after[8]], [before[2], before[5], before[6], before[7], before[8]], 'LIFE XP, teacher, studied language, interface language, level untouched');
   await ctx.close();
   console.log('PASS: 11 AI entries — 10 open the TEST-030 chat on the engine (scenario, scene, lesson context), the A1.1 speaking exam and the exam writing check keep their screens; every request char lexi; LIFE and settings untouched');
  }

  // ---- B · scenarios, languages, level, history, states, corrections
  {
   const {ctx, page, errors} = await open();
   await lexi(page, 'free'); const htmlLang = await page.evaluate(() => document.documentElement.lang);
   for (const [sc, mode, style] of [['speaking', 'chat', 'slow'], ['roleplay', 'chat', 'teacher'], ['grammar', 'ask', undefined], ['lesson', 'ask', undefined], ['free', 'chat', 'talk']]) {
    await page.click(S + `[data-scenario=${sc}]`); await send(page, sc === 'grammar' || sc === 'lesson' ? 'de of het?' : 'Ik werk in Gent');
    const j = last(); assert.equal(j.mode, mode, sc); assert.equal(j.scenario, sc); if (style) assert.equal(j.style, style, sc);
    if (sc === 'roleplay') assert.equal(j.scene, 'super', 'default situation: shop → super');
    assert.match((await state(page)).status, mode === 'ask' ? /Відповідь готова/ : /Гарна відповідь/, sc + ': idle after a question, correct after a clean answer');
   }
   await page.click(S + '[data-scenario=roleplay]'); await page.selectOption(S + 'select[name=scene]', 'work'); await send(page, 'Ik zoek werk'); assert.equal(last().scene, 'werk', 'work → werk by the engine');
   await page.selectOption(S + 'select[name=target]', 'fr'); await page.selectOption(S + 'select[name=ui]', 'en'); await page.selectOption(S + 'select[name=level]', 'a21');
   await page.click(S + '[data-scenario=free]'); await send(page, 'Je travaille à Gand'); let j = last(); assert.deepEqual([j.target, j.lang, j.level], ['fr', 'en', 'a21'], 'studied language, explanation language and level reach the request');
   assert.equal(await page.evaluate(() => document.documentElement.lang), htmlLang, 'the chat language does not change the app page'); assert.equal(await page.evaluate(() => targetLang), 'nl', 'the app\'s studied language is untouched');
   await page.selectOption(S + 'select[name=ui]', 'ar'); assert.equal(await page.evaluate(() => document.querySelector('.lexi-host').dir), 'rtl', 'Arabic explanations: RTL inside the chat'); await page.selectOption(S + 'select[name=ui]', 'uk'); await page.selectOption(S + 'select[name=target]', 'nl'); await page.selectOption(S + 'select[name=level]', 'a11');
   // history: every message goes with the last 12
   await page.click(S + '[data-scenario=speaking]'); for (let i = 1; i <= 7; i++) await send(page, 'Zin ' + i);
   j = last(); assert.equal(j.messages.length, 12, 'last 12 messages'); assert.equal(j.messages.at(-1).content, 'Zin 7'); assert.equal((await state(page)).bubbles, 14, '7 questions + 7 answers stay on screen');
   // corrections: shown in speaking / roleplay, hidden in free talk (rule kept)
   queue.push({status: 200, body: FIX}); await send(page, 'Ik woon op Gent'); assert.equal(await page.locator(S + '.ai-fix').count(), 1, 'correction shown in speaking'); assert.match((await state(page)).status, /Спробуймо ще разом/, 'incorrect state');
   await page.click(S + '[data-scenario=free]'); queue.push({status: 200, body: FIX}); await send(page, 'Ik woon op Gent'); assert.equal(await page.locator(S + '.ai-fix').count(), 0, 'free talk: no correction card');
   assert.deepEqual(errors, []); await ctx.close();
   console.log('PASS: five scenarios (mode, style, scene), studied / explanation language and level in every request without touching the app, RTL, 12-message history, states idle / correct / incorrect, corrections by scenario');
  }

  // ---- C · errors: API failure + retry once, edit, minute and daily limit, offline, too long; states «error» / «offline»
  {
   const {ctx, page, errors} = await open(); await lexi(page, 'free');
   queue.push({status: 500, body: {error: 'boom'}}); const n0 = seen.length; await send(page, 'Hallo');
   let st = await state(page); assert.match(st.err, /Lexi/); assert.equal(await page.locator(S + '.error-panel [data-action=retry]').count(), 1, 'retry offered');
   queue.push({status: 200, body: OK}); await page.click(S + '[data-action=retry]'); await page.waitForSelector(S + '.g-bub.them');
   const sent = seen.slice(n0).filter(j => j.mode === 'chat'); assert.equal(sent.length, 2); assert.equal(sent[1].messages.filter(m => m.content === 'Hallo').length, 1, 'retry sends the message once, no duplicate');
   queue.push({status: 429, body: {error: 'slow', retry_after: 3}}); await send(page, 'Nog een'); st = await state(page);
   assert.equal(await page.locator(S + '.error-panel [data-action=retry]').isDisabled(), true, 'minute limit: retry waits');
   await page.click(S + '[data-action=cancel]'); queue.push({status: 429, body: {error: 'limit', scope: 'device', reset_at: new Date(Date.now() + 3600e3).toISOString()}}); await page.waitForTimeout(3200); await send(page, 'Morgen');
   st = await state(page); assert.equal(await page.locator(S + '.error-panel [data-action=retry]').count(), 0, 'daily limit: no retry');
   await page.click(S + '[data-action=edit]'); assert.equal(await page.inputValue(S + 'input[name=draft]'), 'Morgen', 'edit puts the message back');
   assert.equal(await page.locator(S + 'button.send').isDisabled(), true, 'daily limit: sending waits until the reset time');
   await closeLexi(page); await lexi(page, 'free');
   assert.equal(await page.locator(S + 'button.send').isDisabled(), true, 'reopening preserves the daily cooldown');
   await page.click(S + '[data-scenario=speaking]'); await ctx.setOffline(true); const n1 = seen.length; await send(page, 'Offline');
   assert.match((await state(page)).err, /офлайн|мережі|інтернет/i); assert.equal(seen.length, n1, 'offline: nothing sent');
   assert.equal(await page.evaluate(() => document.querySelector('.lexi-host').shadowRoot.querySelector('.error-panel').getAttribute('role')), 'status');
   await ctx.setOffline(false); assert.deepEqual(errors, []); await ctx.close();
   console.log('PASS: errors — API failure with one retry (no duplicate) and edit, minute limit waits, daily limit without retry, offline sends nothing; engine «error» / «offline» states, messages from LerenLexi.message');
  }

  // ---- D · XP, mistakes list, notes, report: the old chat's rules
  {
   const {ctx, page, errors} = await open(); const before = await data(page);
   await lexi(page, 'speaking'); queue.push({status: 200, body: FIX}); await send(page, 'Ik woon op Gent');
   assert.equal(await page.evaluate(() => JSON.parse(localStorage.getItem('leren_mistakes') || '[]')[0]?.nl), 'Ik woon in Gent.', 'a shown Dutch correction goes to the mistakes list');
   for (let i = 2; i <= 5; i++) await send(page, 'Zin ' + i);
   await page.waitForFunction(() => window.__games.some(g => g[0] === 'ai'));
   assert.deepEqual(await page.evaluate(() => window.__games), [['ai', 30]], '5 messages = «ai» game, 30 XP (once)');
   assert(seen.some(j => j.mode === 'memo' && j.char === 'lexi'), 'notes written after the 2nd message'); await page.waitForFunction(() => localStorage.getItem('leren_ai_memory') === '"Woont in Gent."');
   await page.click(S + '[data-scenario=grammar]'); for (const q of ['de of het?', 'hoe zeg je hallo?', 'wat is perfectum?']) await send(page, q);
   assert.deepEqual(await page.evaluate(() => window.__games), [['ai', 30], ['ask', 15]], '3 questions = «ask» game, 15 XP');
   queue.push({status: 500, body: {}}); await send(page, 'fout'); assert.equal((await page.evaluate(() => window.__games)).length, 2, 'a failed request gives no XP');
   await page.click(S + '[data-action=cancel]');
   // what Lexi remembers, with «forget»
   await page.click(S + '.memory summary'); assert.match(await page.textContent(S + '.memory'), /Woont in Gent/); await page.click(S + '[data-action=forget]');
   assert.equal(await page.evaluate(() => localStorage.getItem('leren_ai_memory')), '""'); assert.equal(await page.locator(S + '.memory').count(), 0);
   // report an answer (Google Play AI content policy)
   page.once('dialog', d => d.accept()); const r0 = seen.length; await page.click(S + '.g-bub.them >> nth=0 >> [data-action=report]');
   await page.waitForFunction(n => true, r0); await page.waitForTimeout(300); assert(seen.slice(r0).some(j => j.mode === 'report' && j.char === 'lexi'), 'report sent');
   const after = await data(page); assert.equal(after[2], before[2], 'LIFE XP untouched'); assert.equal(after[5], before[5], 'teacher choice untouched');
   assert.deepEqual(errors, []); await ctx.close();
   console.log('PASS: XP as before (5 messages → 30, 3 questions → 15, failures → 0), Dutch corrections to the mistakes list, notes and «forget», report; LIFE untouched');
  }

  // ---- E · voice, speaking, Android back, Escape, dialog / inert / focus
  {
   const {ctx, page, errors} = await open(); await page.evaluate(() => setView('games')); await page.focus('body');
   await lexi(page, 'speaking'); const n0 = seen.length;
   await page.evaluate(() => { window.__srArmed = true; window.__srText = 'Ik woon in Gent' }); await page.click(S + '[data-action=mic]');
   await page.waitForFunction(() => document.querySelector('.lexi-host').shadowRoot.querySelector('input[name=draft]').value === 'Ik woon in Gent');
   assert.equal(seen.length, n0, 'recognised text is not sent by itself'); assert.equal(await page.evaluate(() => window.__srLang), 'nl-BE', 'studied language recognition');
   await page.fill(S + 'input[name=draft]', 'Ik woon in Gent.'); await page.click(S + 'button.send'); await page.waitForSelector(S + '.g-bub.them'); assert.equal(last().messages.at(-1).content, 'Ik woon in Gent.', 'the corrected text is sent');
   await page.click(S + '[data-scenario=grammar]'); await page.evaluate(() => { window.__srArmed = true; window.__srText = 'що таке de' }); await page.click(S + '[data-action=mic]');
   await page.waitForFunction(() => window.__srLang === 'uk-UA'); // questions are asked in the explanation language
   await page.evaluate(() => { window.__srArmed = true; window.__srDeny = true }); await page.click(S + '[data-action=mic]');
   await page.waitForFunction(() => /мікрофон/i.test(document.querySelector('.lexi-host').shadowRoot.querySelector('.notice').textContent)); await page.evaluate(() => { window.__srDeny = false });
   await page.click(S + '[data-scenario=free]'); await send(page, 'Hallo'); await page.click(S + '[data-action=speak]'); await page.waitForFunction(() => window.__said.includes('Hallo! Waar woon je?'));
   // dialog semantics, the app behind is inert
   assert.deepEqual(await page.evaluate(() => { const h = document.querySelector('.lexi-host'); return [h.getAttribute('role'), h.getAttribute('aria-modal'), [...document.body.children].filter(n => n !== h && n.tagName !== 'SCRIPT').every(n => n.inert)] }), ['dialog', 'true', true]);
   await page.goBack(); await page.waitForFunction(() => !document.querySelector('.lexi-host')); assert.equal(await page.evaluate(() => view), 'games', 'Android back closes Lexi and stays in the app');
   assert.equal(await page.evaluate(() => [...document.body.children].some(n => n.inert)), false, 'app usable again');
   await lexi(page, 'free'); await page.keyboard.press('Escape'); await page.waitForFunction(() => !document.querySelector('.lexi-host'));
   assert(page.url().startsWith(B), 'still in the app after Escape');
   assert.deepEqual(errors, []); await ctx.close();
   console.log('PASS: voice — recognised text edited before sending (nl-BE; questions uk-UA), microphone refused → message, reply read aloud; dialog with inert app; Android back and Escape close Lexi');
  }

  // ---- F · layout: phone / tablet / desktop, light and dark, Arabic; 44 px targets; no CSP violation
  {
   for (const [w, h] of [[320, 640], [390, 844], [768, 1024], [1440, 900]]) for (const theme of ['light', 'dark']) {
    const {ctx, page, errors} = await open({viewport: {width: w, height: h}, ui: w === 320 && theme === 'dark' ? 'ar' : 'uk'});
    await page.evaluate(t => { document.documentElement.dataset.theme = t }, theme); await lexi(page, 'roleplay', {scene: 'school'}); await send(page, 'Goedemorgen');
    const m = await page.evaluate(() => { const h = document.querySelector('.lexi-host'), r = h.shadowRoot, small = [...r.querySelectorAll('button,select,input,summary')].filter(e => { const b = e.getBoundingClientRect(); return b.width && b.height && (b.height < 43.5 || (b.width < 43.5)) }).map(e => (e.dataset.action || e.name || e.tagName) + ' ' + Math.round(e.getBoundingClientRect().width) + 'x' + Math.round(e.getBoundingClientRect().height));
     return {over: r.querySelector('.lexi-app').scrollWidth - h.clientWidth, small, theme: h.dataset.theme, dir: h.dir, csp: window.__csp} });
    assert(m.over <= 1, `${w}px: no horizontal overflow (${m.over})`); assert.deepEqual(m.small, [], `${w}px ${theme}: targets ≥ 44 px`); assert.equal(m.theme, theme, 'the chat follows the app theme'); assert.deepEqual(m.csp, [], 'no CSP violation');
    if (w === 320 && theme === 'dark') assert.equal(m.dir, 'rtl');
    assert.deepEqual(errors, []); await ctx.close();
   }
   console.log('PASS: layout 320 / 390 / 768 / 1440 in light and dark (Arabic RTL at 320): no horizontal overflow, every control ≥ 44 px, app theme followed, no CSP violation');
  }

  // ---- G · beta snapshot: Lexi off, nothing sent; demo replies only on request, labelled, no network
  {
   const beta = await open({endpoint: null}), n0 = seen.length;
   await beta.page.evaluate(() => lexiOpen('free')); await beta.page.waitForSelector('.lexi-off'); assert.equal(await beta.page.locator('.lexi-host').count(), 0, 'no chat in the beta snapshot');
   assert.match(await beta.page.textContent('.lexi-off'), /тестовій версії/); assert.equal(seen.length, n0); assert.deepEqual(beta.outside, []); await beta.ctx.close();
   const demo = await open({endpoint: null, query: '?lexi=demo'}); await lexi(demo.page, 'free');
   assert.match(await demo.page.textContent(S + '.demo-strip'), /Демонстрація/); await send(demo.page, 'Ik werken in België.');
   assert.equal(await demo.page.locator(S + '.ai-fix').count(), 0, 'demo free talk follows the same correction rule'); assert.equal(seen.length, n0, 'demo: nothing sent to any AI'); assert.deepEqual(demo.outside, []);
   assert.deepEqual(demo.errors, []); await demo.ctx.close();
   console.log('PASS: beta snapshot — Lexi off, no request; ?lexi=demo shows the TEST-030 demo replies, labelled «Демонстрація», with no network request (for checking screens on a phone)');
  }

  // TEST-037 · Resume within this tab without writing transcripts or replaying award side effects.
  {
   const {ctx, page} = await open();
   const text = 'Testzin voor de hervatting';
   await lexi(page, 'free');
   await send(page, text);
   assert.equal((await state(page)).bubbles, 2);
   queue.push({status: 503, body: {error: 'unavailable'}});
   await send(page, 'Mislukte poging');
   await closeLexi(page);
   await lexi(page, 'free');
   await page.click(S + '[data-action=edit]');
   assert.equal(await page.inputValue(S + '#draft'), 'Mislukte poging');
   assert.equal((await state(page)).bubbles, 2, 'editing removes the restored pending bubble');
   const requests = seen.length;
   const awards = await page.evaluate(() => window.__games);
   await closeLexi(page);
   await lexi(page, 'free');
   assert.match(await page.locator(S + '.chat-log').innerText(), /Testzin voor de hervatting/);
   assert.equal((await state(page)).bubbles, 2);
   assert.equal(seen.length, requests, 'restoring only renders the transcript');
   assert.deepEqual(await page.evaluate(() => window.__games), awards);
   await send(page, 'Tweede testzin');
   assert(last().messages.some(m => m.content === text), 'next request has the earlier context');
   await page.goBack();
   await lexi(page, 'free');
   assert.equal((await state(page)).bubbles, 4, 'browser back also saves the transcript');
   assert.equal(await page.evaluate(t => [localStorage, sessionStorage].some(store =>
    Object.values(store).some(value => value.includes(t))), text), false, 'transcript is not written to Web Storage');
   await closeLexi(page);
   await lexi(page, 'roleplay', {scene: 'doctor'});
   assert.equal((await state(page)).bubbles, 0, 'a different entry never gets the transcript');
   await page.reload();
   await lexi(page, 'free');
   assert.equal((await state(page)).bubbles, 0, 'reloading clears the tab-memory transcript');
   await ctx.close();
   console.log('PASS: TEST-037 — same-entry resume via Close and browser Back; no storage, replay or cross-scenario leakage');
  }

  // ---- H · service worker: the release (255+) precaches the chat; it opens offline from the cache and says it is offline
  {
   const {ctx, page, errors} = await open({sw: 'allow'});
   await page.evaluate(async () => { await navigator.serviceWorker.ready }); await page.reload(); await page.waitForFunction(() => !!navigator.serviceWorker.controller && !!window.LerenLexi);
   const cached = await page.evaluate(async () => { const c = await caches.open((await caches.keys()).find(k => k.startsWith('leren-be-v'))); return Promise.all(['./modules/lexi/chat.js?v=261', './modules/lexi/copy.js?v=261', './modules/lexi/chat.css?v=261', './img/lexi/lexi.webp', './img/lexi/lexi-emotions.webp'].map(async u => !!(await c.match(u)))) });
   assert.deepEqual(cached, [true, true, true, true, true], 'chat files precached');
   await ctx.setOffline(true); await page.evaluate(() => { lexiOpen('free') }); await page.waitForSelector('.lexi-off', {timeout: 15000}); assert.equal(await page.locator('.lexi-host').count(), 0, 'offline at the start: the «Lexi is offline» card with retry');
   await ctx.setOffline(false);
   await ctx.setOffline(true); await page.evaluate(() => { lexiReady = true; window.__on = navigator.onLine }); // open the chat itself offline (engine reports offline on send)
   await page.evaluate(() => lexiMount('free', {})); await page.waitForSelector(S + '.ai-chat-card', {timeout: 15000}); await send(page, 'offline?');
   assert.match((await state(page)).err, /офлайн|мережі|інтернет/i, 'offline message from the cached chat');
   await ctx.setOffline(false); assert.deepEqual(errors, []); await ctx.close();
   console.log('PASS: service worker — chat module, styles and artwork precached in the current leren-be cache; offline the chat opens from the cache and reports «offline»');
  }
 } finally { await browser.close(); server.close() }
})().catch(e => { console.error(e); process.exit(1) });
