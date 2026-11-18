// TEST-034 · Regression of the whole app WITH AI SWITCHED ON. The other browser tests run like the beta (AI off), which
// is how the TEST-031 exam crash (ReferenceError in exam-core.js, only when AI_ENDPOINT is set) went unnoticed.
// Here AI is on through a MOCK endpoint on the same origin (no real AI, no network): every screen, lesson mode, game,
// the A1.1 exam with its AI cards, review, progress, LIFE pages and language switches must run without a JS error;
// opening screens and AI entries must not change XP or progress; every AI request goes through Lexi (char "lexi").
const fs = require('node:fs'), path = require('node:path'), http = require('node:http'), assert = require('node:assert/strict');
const repo = path.join(__dirname, '..');
const T = {'.html': 'text/html', '.js': 'text/javascript', '.mjs': 'text/javascript', '.css': 'text/css', '.json': 'application/json', '.webp': 'image/webp', '.png': 'image/png', '.svg': 'image/svg+xml', '.woff': 'font/woff', '.jpg': 'image/jpeg', '.m4a': 'audio/mp4', '.webmanifest': 'application/manifest+json'};
const CHAT = {reply: 'Leuk! Waar woon je?', reply_nl: 'Leuk! Waar woon je?', translation: 'Класно! Де ти живеш?', correction: null}, ASK = {answer: 'Пояснення.', examples: [{lang: 'nl', text: 'Ik woon in Gent.', translation: 'Я живу в Генті.'}]};
(async () => {
 let chromium; try { ({chromium} = require('playwright')) } catch { console.log('SKIP: Playwright is not installed'); return }
 const seen = [];
 const server = http.createServer((q, r) => {
  const u = new URL(q.url, 'http://x');
  if (u.pathname === '/mock-ai/') { let b = ''; q.on('data', c => b += c); q.on('end', () => { if (q.method !== 'POST') { r.statusCode = 204; return r.end() } const j = JSON.parse(b); seen.push(j);
   r.setHeader('content-type', 'application/json'); r.end(JSON.stringify(j.mode === 'ask' ? ASK : j.mode === 'memo' ? {memory: ''} : j.mode === 'report' ? {ok: true} : CHAT)) }); return }
  let f = path.join(repo, decodeURIComponent(u.pathname)); if (fs.existsSync(f) && fs.statSync(f).isDirectory()) f = path.join(f, 'index.html');
  if (!f.startsWith(repo) || !fs.existsSync(f)) { r.statusCode = 404; return r.end() }
  r.setHeader('content-type', T[path.extname(f)] || 'application/octet-stream'); fs.createReadStream(f).pipe(r) });
 await new Promise(r => server.listen(0, '127.0.0.1', r)); const port = server.address().port, B = 'http://localhost:' + port + '/app/';
 let browser; try { browser = await chromium.launch() } catch { console.log('SKIP: no Chromium'); server.close(); return }
 const rel = fs.readFileSync(path.join(repo, 'app/app.js'), 'utf8').match(/RELEASE_VERSION="(\d+)"/)[1];
 const GAMES = ['story', 'ask', 'dlg', 'rp', 'sp', 'bl', 'mm', 'dc', 'md', 'om', 'ks', 'wb', 'kamer', 'kamer1'];
 const SCREENS = [
  ['home', `setView('path');learningPath.home()`], ['map', `setView('path');learningPath.chapter(LerenLearningPath.catalog(DATA,LerenCurriculum).chapters[0].id)`],
  ...['study', 'quiz', 'audio', 'build', 'review'].map(m => ['lesson-' + m, `lessonMode=${JSON.stringify(m)};mode=lessonMode;setView('lesson');newRound()`]),
  ['toets', `setView('toets')`], ['progress', `setView('progress')`], ['dict', `setView('dict')`], ['games', `setView('games')`],
  ...GAMES.map(g => ['game-' + g, `setView('games');const f=gameStart(${JSON.stringify(g)});f&&f()`]),
  ['exam-a11', `setView('games');EXAM11.open()`],
  ['exam-a11-ai-speaking', `setView('games');EXAM11.open();aiStart({id:'exam11',fromExam:true,fresh:true})`],
  ['exam-a11-ai-writing', `askStart({focus:'exam11',send:'Beste Tom, ik kom morgen niet naar de les want ik ben ziek. Groetjes, Anna'})`],
  ['settings', `setView('path');openSheet('settingsSheet')`], ['level-a12', `switchCourse('a12');setView('path');learningPath.refresh()`], ['level-a2', `switchCourse('a21');setView('path');learningPath.refresh()`], ['level-a11', `switchCourse('a11');setView('path');learningPath.refresh()`],
 ];
 const errors = [];
 for (const lang of ['uk', 'en', 'fr', 'ar']) {
  const ctx = await browser.newContext({viewport: {width: 390, height: 844}, serviceWorkers: 'block', isMobile: true, hasTouch: true}), page = await ctx.newPage();
  let cur = 'boot'; const add = (k, d) => errors.push(`${lang} ${cur}: ${k} ${String(d).split('\n')[0].slice(0, 200)}`);
  page.on('pageerror', e => add('js-error', e.message)); page.on('console', m => { if (m.type() === 'error' && !/Failed to load resource|net::ERR_|Content Security Policy|Refused to (connect|load)|play\(\)|NotAllowedError|NotSupportedError/.test(m.text())) add('console', m.text()) });
  page.on('dialog', d => d.accept());
  await ctx.route(/^https?:\/\/(?!localhost)/, r => r.abort());
  await page.addInitScript(([rel, lang, endpoint]) => { if (sessionStorage.getItem('s')) return; sessionStorage.setItem('s', '1'); localStorage.clear();
   for (const [k, v] of Object.entries({leren_release_seen: JSON.stringify(rel), poly_ui: lang, poly_target: 'nl', leren_home_v1: 'path', leren_welcome_seen: 'true', leren_onboarding_language_v1: '1', leren_start_known_v1: 'zero', leren_tour_done: 'true', leren_level_asked: 'true', poly_score: '1200', leren_ai_consent18: 'true', leren_ai_endpoint: JSON.stringify(endpoint)})) localStorage.setItem(k, v) }, [rel, lang, 'http://localhost:' + port + '/mock-ai/']);
  await page.goto(B); await page.waitForFunction(() => typeof learningPath === 'object' && learningPath, null, {timeout: 20000});
  assert.equal(await page.evaluate(() => !!AI_ENDPOINT && lexi().availability().ok), true, lang + ': AI is on in this test');
  const before = await page.evaluate(() => ({score: localStorage.getItem('poly_score'), xp: localStorage.getItem('leren_life_xp_v1'), path: localStorage.getItem('leren_learning_path_v1')}));
  for (const [name, code] of SCREENS) { cur = name;
   try { await page.evaluate(code) } catch (e) { add('throw', e.message) }
   await page.waitForTimeout(name.startsWith('exam-a11-ai') ? 900 : 300);
   await page.evaluate(() => { document.querySelectorAll('dialog[open]').forEach(d => d.close()); try { closeSheet('settingsSheet') } catch {} if (typeof gStop === 'function') gStop(); if (typeof lexiClose === 'function' && document.querySelector('.lexi-host')) lexiClose(false) }).catch(() => {});
  }
  cur = 'lexi-chat'; await page.evaluate(() => lexiOpen('free', {})); await page.waitForSelector('.lexi-host >> input[name=draft]');
  await page.fill('.lexi-host >> input[name=draft]', 'Ik woon in Gent.'); await page.click('.lexi-host >> button.send'); await page.waitForSelector('.lexi-host >> .g-bub.them');
  await page.evaluate(() => lexiClose(false));
  cur = 'switch'; for (const l of ['en', 'ar', lang]) { await page.evaluate(l => changeUiLang(l), l); await page.waitForTimeout(250) }
  await page.evaluate(() => changeTargetLang('fr')); await page.waitForTimeout(250); await page.evaluate(() => changeTargetLang('nl')); await page.waitForTimeout(250);
  const after = await page.evaluate(() => ({score: localStorage.getItem('poly_score'), xp: localStorage.getItem('leren_life_xp_v1'), path: localStorage.getItem('leren_learning_path_v1')}));
  assert.equal(after.score, before.score, lang + ': opening screens, exams and AI entries does not change the score');
  assert.equal(after.xp, before.xp, lang + ': LIFE XP unchanged');
  for (const p of ['learn-life.html', 'learn-life-story.html?s=first-day', 'reviews.html', 'privacy.html']) { cur = p; await page.goto(B + p); await page.waitForTimeout(600) }
  await ctx.close();
 }
 await browser.close(); server.close();
 assert.deepEqual(errors, [], 'no JS errors with AI on:\n' + errors.join('\n'));
 assert.ok(seen.length >= 12, 'AI requests were made: ' + seen.length);
 assert.ok(seen.every(j => j.char === 'lexi'), 'every AI request is a Lexi request: ' + [...new Set(seen.map(j => j.char))]);
 const modes = new Set(seen.map(j => j.mode)); assert.ok(modes.has('chat') && modes.has('ask'), 'chat and ask: ' + [...modes]);
 assert.ok(seen.some(j => j.scene === 'exam11') && seen.some(j => j.focus === 'exam11'), 'exam speaking and writing reached Lexi with AI on');
 console.log(`PASS: AI on (mock) in uk / en / fr / ar — ${SCREENS.length} screens incl. study, quiz, audio, build, review, ${GAMES.length} games, A1.1 exam with AI speaking and writing, levels, Lexi chat, language switches and LIFE / reviews / privacy pages: no JS error; score and LIFE XP unchanged; ${seen.length} AI requests, all char «lexi»`);
})().catch(e => { console.error(e); process.exit(1) });
