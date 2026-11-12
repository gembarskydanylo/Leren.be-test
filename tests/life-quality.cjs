// TEST-018 · LerenBe LIFE technical quality and mobile experience (life/learn-life-story.html, Engine 2.0).
// Engine: scene finish is idempotent, answers after the end are ignored, damaged saved progress is cleaned.
// Browser (Chromium via Playwright, phone/desktop emulation — not a physical phone):
//  1 missing image   2 broken image   3 missing audio (deterministic stub + the browser's real Audio)
//  4 rapid scene switching (no late reply, voice or timer from the old scene; one voice at a time)
//  5 reopening the story   6 progress saving   7 repeated XP (end-card re-render, replay)
//  8 phone screens 360/390/430 and desktop 1280/1440 (stage size, faces above the dialogue, tap targets, no
//    horizontal scroll, large text)   9 orientation change mid-scene   10 language / help-level switching
//  + emotions follow the lines, the learner speaks with the protagonist's (female) voice, no external requests.
// Run: node tests/life-quality.cjs (browser part skipped without Playwright).
const fs = require('node:fs'), path = require('node:path'), http = require('node:http'), assert = require('node:assert/strict');
const root = path.join(__dirname, '..', 'life');
const A = 'assets/lerenbe-life/';

(async () => {
 // ---------- engine (no browser)
 const E = await import(path.join(root, 'modules/learn-life/story-engine.mjs'));
 const {firstDay} = await import(path.join(root, 'modules/learn-life/stories/first-day.mjs'));
 const mem = () => { const m = new Map(); return {m, getItem: k => m.get(k) ?? null, setItem: (k, v) => m.set(k, String(v))} };
 const playAll = run => { let g = 0; while (!run.finished && g++ < 99) { const x = run.step; if (x.type === 'line') run.next(); else if (x.type === 'reply') run.answer(x.options.findIndex(o => o.ok)); else if (x.type === 'listen') run.answer(x.answer); else if (x.type === 'find') x.ask.forEach(a => run.answer(a)); else run.answer({tiles: x.nl}) } };
 {
  const st = mem(), ss = E.createStorySession(firstDay, st), run = ss.play('station'); playAll(run);
  const a = run.finish(), b = run.finish();
  assert.equal(a, b, 'finish() twice returns the same result');
  assert.deepEqual(ss.state.skills.understand, [4, 4], 'skills counted once');
  assert.equal(run.answer(0), null, 'no answers after the scene is finished');
  assert.equal(E.recordXp(st, 'first-day', 'station', a.xp), 20); assert.equal(E.recordXp(st, 'first-day', 'station', a.xp), 20, 'recordXp keeps the best, never adds');
  const again = ss.play('station'); playAll(again); assert.equal(again.finish().gained, 0, 'a replay gives no new XP');
  assert.deepEqual(ss.state.skills.understand, [8, 8], 'a replay is a new attempt for the skill statistics (rule unchanged)');
 }
 {
  const st = mem();
  st.setItem('leren_life_story_v1_first-day', JSON.stringify({best: {station: 999, ghost: 3, meet: -1, flat: 1.5}, skills: {understand: [5, 2], grammar: 'x'}, flags: {'<img src=x>': 1, ticket: 'buy', deep: {a: 1}}, mode: 'evil', missed: ['<b>x</b>', 42, 'Waar kom je vandaan?']}));
  st.setItem(E.MEMORY_KEY, '{not json'); st.setItem(E.XP_KEY, '[1,2]');
  const ss = E.createStorySession(firstDay, st);
  assert.deepEqual(ss.state.best, {station: 4}, 'unknown scenes, negative and fractional values dropped; capped at the scene size');
  assert.deepEqual(ss.state.skills, {understand: [0, 0], grammar: [0, 0], speaking: [0, 0]});
  assert.deepEqual(ss.state.flags, {ticket: 'buy'}); assert.equal(ss.state.mode, 'learn'); assert.deepEqual(ss.state.missed, ['Waar kom je vandaan?']);
  assert.deepEqual(ss.memory(), {met: {}, flags: {}}); assert.equal(E.recordXp(st, 'first-day', 'station', 20), 20);
 }
 // emotions in the story data are valid
 const EMO = ['neutral', 'happy', 'thinking', 'surprised'], emo = [];
 for (const sc of firstDay.scenes) for (const s of sc.steps) { if (s.emotion) emo.push(s.emotion); for (const o of s.options || []) if (o.react?.emotion) emo.push(o.react.emotion) }
 assert(emo.length >= 20 && emo.every(e => EMO.includes(e)) && EMO.every(e => emo.includes(e)), 'lines carry all four emotions');
 // security of the page itself
 const html = fs.readFileSync(path.join(root, 'learn-life-story.html'), 'utf8');
 const csp = html.match(/http-equiv="Content-Security-Policy" content="([^"]+)"/)?.[1] || '';
 for (const d of ["default-src 'self'", "script-src 'self'", "connect-src 'self'", "img-src 'self' data:", "media-src 'self'", "object-src 'none'"]) assert(csp.includes(d), 'CSP ' + d);
 assert(!/\*|unsafe-inline|unsafe-eval|https?:/.test(csp), 'CSP: no wildcard, inline/eval or external host');
 const code = fs.readdirSync(path.join(root, 'modules/learn-life'), {recursive: true}).filter(f => /\.(mjs|css)$/.test(f)).map(f => fs.readFileSync(path.join(root, 'modules/learn-life', f), 'utf8')).join('\n') + html;
 assert(!/firebase|firestore|googleapis|AIza[0-9A-Za-z_-]{20}|apiKey|secret|innerHTML|eval\(/i.test(code), 'no Firebase, keys, innerHTML or eval in LIFE');
 console.log('PASS: TEST-018 engine — finish idempotent, no answers after the end, XP best-only (replay +0), damaged saved progress cleaned, emotions valid, CSP strict, no Firebase/secrets/innerHTML');

 // ---------- browser
 let chromium; try { ({chromium} = require('playwright')) } catch { console.log('SKIP: browser part (Playwright is not installed)'); return }
 const types = {'.html': 'text/html', '.mjs': 'text/javascript', '.js': 'text/javascript', '.css': 'text/css', '.json': 'application/json', '.png': 'image/png', '.webp': 'image/webp', '.m4a': 'audio/mp4'};
 const server = http.createServer((req, res) => { const f = path.join(root, decodeURIComponent(new URL(req.url, 'http://x').pathname)); if (!f.startsWith(root) || !fs.existsSync(f) || fs.statSync(f).isDirectory()) { res.statusCode = 404; return res.end() } res.setHeader('content-type', types[path.extname(f)] || 'application/octet-stream'); fs.createReadStream(f).pipe(res) });
 await new Promise(r => server.listen(0, '127.0.0.1', r)); const base = 'http://127.0.0.1:' + server.address().port + '/learn-life-story.html?s=first-day';
 let browser; try { browser = await chromium.launch() } catch { console.log('SKIP: no Chromium'); server.close(); return }
 const M = JSON.parse(fs.readFileSync(path.join(root, A, 'visual-manifest.json'), 'utf8'));
 const art = fs.readFileSync(path.join(root, A, 'reference/visual-style-and-cast.webp')); // a test stand-in served at the artist's paths
 const S = Object.fromEntries(firstDay.scenes.map(s => [s.id, s]));
 const external = [], report = [];
 // Audio stub: plays for __dur ms, fires ended/pause/error like a media element; counts how many play at once.
 const AUDIO_STUB = () => {
  window.__A = []; window.__maxPlaying = 0; window.__tts = [];
  const playing = () => window.__A.filter(a => !a.paused).length;
  window.Audio = class { constructor(src) { this.src = src; this.paused = true; this.ended = false; this.l = {}; window.__A.push(this) }
   addEventListener(t, f) { (this.l[t] = this.l[t] || []).push(f) }
   fire(t) { this['on' + t]?.(); (this.l[t] || []).splice(0).forEach(f => f()) }
   play() { this.paused = false; window.__maxPlaying = Math.max(window.__maxPlaying, playing());
    if (window.__badAudio && window.__badAudio.test(this.src)) setTimeout(() => { this.paused = true; this.fire('error') }, 20);
    else this._t = setTimeout(() => { if (!this.paused) { this.paused = true; this.ended = true; this.fire('ended') } }, window.__dur || 400);
    return Promise.resolve() }
   pause() { if (!this.paused) { this.paused = true; clearTimeout(this._t); this.fire('pause') } } };
  Object.defineProperty(window, 'speechSynthesis', {value: {speak: u => window.__tts.push(u.text), cancel() {}, getVoices: () => []}, configurable: true});
 };
 async function open({w = 390, h = 844, stub = true, manifest = null, routes = null, init = null, zoom = null} = {}) {
  const ctx = await browser.newContext({viewport: {width: w, height: h}, serviceWorkers: 'block'}), page = await ctx.newPage(), errors = [];
  page.on('pageerror', e => errors.push(e.message)); page.on('request', r => { if (!r.url().startsWith('http://127.0.0.1')) external.push(r.url()) });
  await ctx.route(/^https?:\/\/(?!127\.0\.0\.1)/, r => r.abort());
  if (manifest) await ctx.route('**/assets/lerenbe-life/visual-manifest.json', r => r.fulfill({status: 200, contentType: 'application/json', body: JSON.stringify(manifest)}));
  if (routes) await routes(ctx);
  if (stub) await page.addInitScript(AUDIO_STUB);
  if (init) await page.addInitScript(init);
  if (zoom) await page.addInitScript(z => document.addEventListener('DOMContentLoaded', () => { document.documentElement.style.zoom = z }), zoom);
  await page.goto(base); await page.waitForSelector('.ls-hero h1'); await page.waitForTimeout(250);
  return {ctx, page, errors};
 }
 const startScene = async (page, id) => { await page.click(`.ls-scenes li[data-scene="${id}"] .ls-scene`); await page.waitForSelector('.ls-stage') };
 const toHome = page => page.click('.ls-back-scene');
 const idx = async page => +await page.locator('#app').getAttribute('data-index');
 // Play the open scene to its end with right first answers (reply: first right option, find: in order, say: tiles).
 async function playScene(page, id, {stopAt = null} = {}) {
  const steps = S[id].steps; let g = 0;
  while (!(await page.locator('.ls-end').count()) && g++ < 80) {
   const i = await idx(page), s = steps[i], t = await page.locator('#app').getAttribute('data-step');
   if (stopAt !== null && i >= stopAt) return;
   if (t === 'line') await page.click('.ls-panel .ls-primary');
   else if (t === 'reply') await page.click(`.ls-option[data-option="${s.options.findIndex(o => o.ok)}"]`);
   else if (t === 'listen') { await page.click(`.ls-option[data-option="${s.answer}"]`); await page.click('.ls-panel .ls-primary') }
   else if (t === 'find') { for (const a of s.ask) { await page.click(`.ls-item[data-item="${a}"]`); await page.waitForTimeout(500) } await page.click('.ls-panel .ls-primary') }
   else if (t === 'say') { await page.click('.ls-panel button:has-text("Скласти зі слів")'); for (const w of s.nl.split(' ')) await page.click(`.ls-tile:not([disabled]) >> text="${w}"`); await page.click('.ls-panel .ls-primary') }
   await page.waitForTimeout(40);
  }
  assert(await page.locator('.ls-end').count(), 'scene ' + id + ' reaches its end card');
 }
 const ls = (page, k) => page.evaluate(k => JSON.parse(localStorage.getItem(k) || 'null'), k);
 const box = (page, sel) => page.evaluate(s => { const e = document.querySelector(s); if (!e) return null; const r = e.getBoundingClientRect(); return {l: r.left, t: r.top, r: r.right, b: r.bottom, w: r.width, h: r.height} }, sel);

 try {
  // ---- 1 missing image + 2 broken image: manifest names files that do not exist / are damaged
  {
   const G = JSON.parse(JSON.stringify(M));
   G.stories['first-day'].scenes.station.background = {mobile: A + 'stories/first-day/station-mobile.webp', desktop: A + 'stories/first-day/station-desktop.webp'};
   G.characters.annick.full.happy = A + 'characters/annick/full-happy.webp';     // missing on the server (404)
   G.characters.annick.full.neutral = A + 'characters/annick/full-neutral.webp'; // missing too → stand-in
   G.characters.anastasia.full.neutral = A + 'characters/anastasia/full-neutral.webp'; // damaged bytes
   G.stories['first-day'].cover = {mobile: A + 'stories/first-day/cover-mobile.webp', desktop: A + 'stories/first-day/cover-desktop.webp', alt: 'cover'}; // missing
   const {ctx, page, errors} = await open({manifest: G, routes: async c => {
    await c.route('**/stories/first-day/station-*.webp', r => r.fulfill({status: 200, contentType: 'image/webp', body: Buffer.from('not an image at all')}));
    await c.route('**/characters/anastasia/*.webp', r => r.fulfill({status: 200, contentType: 'image/webp', body: Buffer.from('RIFF....WEBPbroken')}));
   }});
   await page.waitForTimeout(300); assert.equal(await page.locator('.ls-cover').count(), 0, 'a missing cover is removed, the story home stays');
   await page.click('.ls-hero .ls-primary'); await page.waitForSelector('.ls-stage'); await page.waitForTimeout(600);
   assert.equal(await page.locator('.ls-stage-bg').count(), 0, 'damaged background → placeholder');
   assert.equal(await page.locator('.ls-stage-ph').count(), 1);
   for (const id of ['anastasia', 'annick']) assert.equal(await page.locator(`.ls-stage-token[data-character="${id}"]`).count(), 1, id + ': stand-in after a failed picture');
   assert.equal(await page.locator('.ls-stage img').count(), 0, 'no broken image left on the stage');
   assert.equal(await page.locator('.ls-stage-token[data-character="annick"]').getAttribute('aria-label'), 'Annick — радіє');
   await playScene(page, 'station'); assert.deepEqual(errors, []); await ctx.close(); report.push('missing + broken images');
  }
  // ---- 3 missing audio: (a) stub: a recording that fails → device voice once, story goes on;
  //      (b) the browser's real Audio with every recording and the recordings list returning 404
  {
   const {ctx, page, errors} = await open({init: () => { window.__badAudio = /audio\/nl-f\// }});
   await page.click('.ls-hero .ls-primary'); await page.waitForTimeout(300);
   assert.deepEqual(await page.evaluate(() => window.__tts), ['Hallo! Ben jij Anastasia?'], 'failed recording → device voice');
   await playScene(page, 'station'); assert.deepEqual(errors, []); await ctx.close();
  }
  {
   const {ctx, page, errors} = await open({stub: false, init: () => { window.__tts = []; Object.defineProperty(window, 'speechSynthesis', {value: {speak: u => window.__tts.push(u.text), cancel() {}, getVoices: () => []}, configurable: true}) },
    routes: c => c.route(/\/audio\/nl(-f)?\/.*\.(m4a|json)$/, r => r.fulfill({status: 404, body: ''}))});
   await page.click('.ls-hero .ls-primary'); await page.waitForTimeout(400);
   assert((await page.evaluate(() => window.__tts)).includes('Hallo! Ben jij Anastasia?'), 'no recordings → device voice');
   await playScene(page, 'station'); assert.deepEqual(errors, []); await ctx.close(); report.push('missing audio (stub + real Audio)');
  }
  // ---- voices, one at a time, queue order, replay
  {
   const {ctx, page, errors} = await open({init: () => { window.__dur = 300 }});
   await page.click('.ls-hero .ls-primary'); await page.waitForTimeout(100);
   await playScene(page, 'station', {stopAt: 5}); // the reply with a reaction
   await page.waitForTimeout(800); const n0 = await page.evaluate(() => window.__lsSaid.length);
   await page.click(`.ls-option[data-option="0"]`); // "Ja, maar ik ben een beetje moe." → Annick reacts → next line
   await page.waitForTimeout(1600);
   const said = await page.evaluate(n => window.__lsSaid.slice(n), n0), srcs = await page.evaluate(n => window.__A.slice(-3).map(a => a.src.replace(/^.*audio\//, '')), 0);
   assert.deepEqual(said, ['Ja, maar ik ben een beetje moe.', 'Dat begrijp ik. We gaan snel naar huis.', 'Heb je al een ticket voor de tram?'], 'answer → reaction → next line, in order');
   assert(srcs.every(s => s.startsWith('nl-f/')), 'Anastasia and Annick: female recordings ' + srcs);
   assert.equal(await page.evaluate(() => window.__maxPlaying), 1, 'never two voices at once');
   const k = await page.evaluate(() => window.__lsSaid.length); await page.click('.ls-stage-repeat'); await page.waitForTimeout(50);
   assert.equal(await page.evaluate(k => window.__lsSaid[k], k), 'Heb je al een ticket voor de tram?', 'replay the line on the stage');
   await toHome(page); await startScene(page, 'neighbour'); await page.waitForTimeout(100);
   assert(await page.evaluate(() => window.__A.at(-1).src.includes('audio/nl/')), 'Jan speaks with the male voice');
   assert.deepEqual(errors, []); await ctx.close(); report.push('one voice at a time, answer→reaction→next line, replay, voices per character');
  }
  // ---- 4 rapid scene switching
  {
   const {ctx, page, errors} = await open({init: () => { window.__dur = 600 }});
   await page.click('.ls-hero .ls-primary'); await playScene(page, 'station', {stopAt: 5});
   await page.click(`.ls-option[data-option="0"]`); // reaction queued behind the learner's line
   await toHome(page); await startScene(page, 'meet'); const n0 = await page.evaluate(() => window.__lsSaid.length);
   await page.waitForTimeout(1500);
   const said = await page.evaluate(n => window.__lsSaid.slice(n), n0), log = await page.locator('.ls-log .ls-nl').allTextContents();
   assert(!said.some(t => /Dat begrijp ik|ticket/.test(t)), 'no voice from the old scene: ' + said);
   assert(!log.some(t => /Dat begrijp ik|ticket/.test(t)), 'no bubble from the old scene');
   assert.equal(await page.evaluate(() => window.__A.filter(a => !a.paused && !a.src.includes(window.__A.at(-1).src)).length), 0, 'old audio stopped');
   // find step timers and tiles retries die with the scene
   await toHome(page); await startScene(page, 'flat'); await page.click('.ls-panel .ls-primary'); await page.click('.ls-item[data-item="key"]'); await toHome(page);
   await page.waitForTimeout(700); assert.equal(await page.locator('.ls-stage').count(), 0, 'a pending find timer does not redraw a left scene');
   for (let i = 0; i < 6; i++) { await startScene(page, ['station', 'meet', 'tram', 'flat', 'neighbour', 'tomorrow'][i]); await page.click('.ls-panel button').catch(() => {}); await toHome(page) }
   await startScene(page, 'tram'); await page.waitForTimeout(900);
   assert.equal(await page.locator('.ls-log .ls-bubble').count(), 1, 'only the new scene\'s first line');
   assert.equal(await page.evaluate(() => window.__maxPlaying), 1); assert.deepEqual(errors, []); await ctx.close(); report.push('rapid scene switching');
  }
  // ---- 5 reopening + 6 progress saving + 7 repeated XP
  {
   const {ctx, page, errors} = await open({init: () => { window.__dur = 30 }});
   await page.click('.ls-hero .ls-primary'); await playScene(page, 'station');
   assert.equal(await page.locator('.ls-gain').textContent(), '+20 XP');
   const x1 = await ls(page, 'leren_life_xp_v1'), s1 = (await ls(page, 'leren_life_story_v1_first-day')).skills;
   for (const m of ['practice', 'real', 'learn']) { await page.click(`.ls-mode [data-mode="${m}"]`); await page.waitForTimeout(80) }
   assert.equal(await page.locator('.ls-end').count(), 1, 'one end card');
   assert.deepEqual(await ls(page, 'leren_life_xp_v1'), x1, 'mode switches on the end card give no XP');
   assert.deepEqual((await ls(page, 'leren_life_story_v1_first-day')).skills, s1, 'and no extra skills');
   await page.click('.ls-end button:has-text("До всіх сцен")'); await startScene(page, 'station'); await playScene(page, 'station');
   assert.equal(await page.locator('.ls-gain').count(), 0, 'replay: no new XP'); assert.deepEqual(await ls(page, 'leren_life_xp_v1'), {'first-day:station': 20});
   await page.click('.ls-end button:has-text("Наступна сцена")'); await playScene(page, 'meet');
   await page.click(`.ls-mode [data-mode="practice"]`);
   await page.reload(); await page.waitForSelector('.ls-hero h1'); await page.waitForTimeout(200);
   assert.equal(await page.locator('.ls-scenes li.is-done').count(), 2, 'done scenes after reopening');
   assert.match(await page.locator('.ls-xp-line').textContent(), /⭐ 30 \//, 'XP after reopening');
   assert.match(await page.locator('.ls-hero .ls-primary').textContent(), /Продовжити/);
   assert.equal(await page.locator('.ls-mode [data-mode="practice"]').getAttribute('aria-pressed'), 'true', 'help level remembered');
   assert(await page.locator('.ls-review, .ls-skills').count(), 'skills card after reopening');
   await page.click('.ls-hero .ls-primary'); assert.equal(await page.locator('#app').getAttribute('data-scene'), 'tram', 'continue = the next unfinished scene (ticket "had" skips the machine)');
   const prev = page.locator('.ls-back-scene'); await prev.click(); await startScene(page, 'meet'); assert.equal(await idx(page), 0, 'an earlier scene can be opened again from the list');
   assert.deepEqual(errors, []); await ctx.close(); report.push('reopen, saving, no repeated XP');
  }
  // ---- 8 screens: phones (portrait) and desktops, without art and with art (test stand-in pictures)
  const G = JSON.parse(JSON.stringify(M));
  for (const e of ['neutral', 'happy', 'thinking', 'surprised']) for (const id of ['anastasia', 'annick']) G.characters[id].full[e] = A + `characters/${id}/full-${e}.webp`;
  for (const withArt of [false, true]) for (const [w, h] of [[360, 740], [390, 844], [430, 932], [1280, 800], [1440, 900]]) {
   const {ctx, page, errors} = await open({w, h, manifest: withArt ? G : null, routes: withArt ? c => c.route(/\/characters\/.*\.webp$/, r => r.fulfill({status: 200, contentType: 'image/webp', body: art})) : null});
   await page.click('.ls-hero .ls-primary'); await page.waitForSelector('.ls-stage-say'); await page.waitForTimeout(400);
   const st = await box(page, '.ls-stage'), say = await box(page, '.ls-stage-say');
   if (w < 720) { assert(Math.abs(st.w - w) < 1, w + ': stage edge to edge'); assert(st.h >= .55 * h, w + ': stage ≥ 55% of the screen (' + st.h + ')') }
   else { assert(st.h >= .7 * h, w + ': stage fills the window height (' + st.h + ')'); assert(st.b <= h + 1, w + ': whole stage visible') }
   const faces = await page.evaluate(() => [...document.querySelectorAll('.ls-stage-char')].map(e => { const r = e.getBoundingClientRect(), head = e.querySelector('.ls-token-head')?.getBoundingClientRect();
    return {id: e.dataset.character, img: e.tagName === 'IMG', top: r.top, faceBottom: head ? head.bottom : r.top + r.height * .3, w: r.width, h: r.height} }));
   assert.equal(faces.length, 2, w + ': both characters on the stage');
   for (const f of faces) { assert(f.faceBottom <= say.t + 1, `${w}: ${f.id}'s face above the dialogue box`); assert(f.h >= .45 * st.h, `${w}: ${f.id} is large (${Math.round(f.h)} of ${Math.round(st.h)})`); assert.equal(f.img, withArt, w + ': picture only when delivered') }
   const small = await page.evaluate(() => [...document.querySelectorAll('button, a.ls-btn, .ls-back')].filter(e => { const r = e.getBoundingClientRect(); return r.width && r.height && (r.height < 44 || (r.width < 44 && e.tagName === 'BUTTON')) }).map(e => e.textContent.trim().slice(0, 12)));
   assert.deepEqual(small.filter(t => t !== '← Тест'), [], w + ': tap targets ≥ 44 px');
   assert(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), w + ': no horizontal scroll');
   if (process.env.SHOTS) await page.screenshot({path: path.join(process.env.SHOTS, `life-quality-${w}${withArt ? '-art' : ''}.png`)});
   await playScene(page, 'station', {stopAt: 1}); await page.click('.ls-option[data-option="2"]'); await page.waitForTimeout(100);
   assert.equal(await page.locator('.ls-stage-char.is-hero').getAttribute('data-emotion'), 'thinking', 'wrong answer → Anastasia thinking');
   assert.equal(await page.locator('.ls-stage-char[data-character="annick"]').getAttribute('data-emotion'), 'surprised', 'wrong answer → Annick surprised');
   await page.click('.ls-option[data-option="0"]'); await page.waitForTimeout(100);
   assert.equal(await page.locator('.ls-stage-char.is-hero').getAttribute('data-emotion'), 'happy', 'right answer → Anastasia happy');
   assert.deepEqual(errors, []); await ctx.close(); report.push(w + (withArt ? ' art' : ''));
  }
  // large text: 130% zoom at 390 (≈ 300 CSS px wide)
  {
   const {ctx, page, errors} = await open({w: 390, h: 844, zoom: 1.3});
   await page.click('.ls-hero .ls-primary'); await page.waitForSelector('.ls-stage-say'); await page.waitForTimeout(300);
   assert(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1), 'large text: no horizontal scroll');
   const clipped = await page.evaluate(() => [...document.querySelectorAll('.ls-stage-say .ls-nl, .ls-option, .ls-btn, .ls-token-name')].filter(e => e.scrollWidth > e.clientWidth + 2).length + [...document.querySelectorAll(".ls-mode button")].filter(e => e.scrollWidth > e.clientWidth + 1).length);
   assert.equal(clipped, 0, 'large text: nothing cut off sideways');
   if (process.env.SHOTS) await page.screenshot({path: path.join(process.env.SHOTS, 'life-quality-390-large-text.png')});
   await playScene(page, 'station'); assert.deepEqual(errors, []); await ctx.close(); report.push('large text 130%');
  }
  // ---- 9 orientation change mid-scene
  {
   const {ctx, page, errors} = await open({w: 390, h: 844});
   await page.click('.ls-hero .ls-primary'); await playScene(page, 'station', {stopAt: 2}); const i0 = await idx(page), log0 = await page.locator('.ls-log .ls-bubble').count();
   await page.setViewportSize({width: 844, height: 390}); await page.waitForTimeout(300);
   assert.equal(await idx(page), i0, 'same step after rotation'); assert.equal(await page.locator('.ls-log .ls-bubble').count(), log0, 'transcript kept');
   const st = await box(page, '.ls-stage'), panel = await box(page, '.ls-panel');
   assert(st.b <= 390 + 1 && st.h >= 220, 'landscape: the stage fits the screen height (' + Math.round(st.t) + '–' + Math.round(st.b) + ')');
   assert(panel.l >= st.r - 1, 'landscape: answers beside the stage');
   assert(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), 'landscape: no horizontal scroll');
   if (process.env.SHOTS) await page.screenshot({path: path.join(process.env.SHOTS, 'life-quality-844-landscape.png')});
   await page.setViewportSize({width: 390, height: 844}); await page.waitForTimeout(200);
   assert.equal(await idx(page), i0); await playScene(page, 'station'); assert.deepEqual(errors, []); await ctx.close(); report.push('rotation');
  }
  // ---- 10 language: the app's interface language (poly_ui) does not break LIFE; LIFE help texts are Ukrainian
  //      only (no UI-language switch yet); Dutch is marked nl-BE; help levels switch mid-step without losing it
  {
   const {ctx, page, errors} = await open({init: () => { try { localStorage.setItem('poly_ui', 'en') } catch {} }});
   assert.equal(await page.evaluate(() => document.documentElement.lang), 'uk');
   await page.click('.ls-hero .ls-primary'); await page.waitForSelector('.ls-stage-say');
   assert.equal(await page.locator('.ls-stage-say .ls-nl').getAttribute('lang'), 'nl-BE');
   assert.equal(await page.locator('.ls-stage-say .ls-uk').count(), 1, 'learn: translation shown');
   await page.click('.ls-panel .ls-primary'); const i0 = await idx(page);
   await page.click('.ls-mode [data-mode="practice"]'); assert.equal(await idx(page), i0, 'practice: same step');
   assert.equal(await page.locator('.ls-opt-uk').count(), 0, 'practice: no translations under the answers');
   await page.click('.ls-mode [data-mode="real"]'); assert.equal(await idx(page), i0);
   assert.equal(await page.locator('.ls-stage-say .ls-nl.is-hidden').count(), 1, 'real: text hidden until asked');
   await page.click('.ls-stage-say button:has-text("Текст")'); assert.equal(await page.locator('.ls-stage-say .ls-nl.is-hidden').count(), 0);
   await page.click('.ls-mode [data-mode="learn"]'); assert.equal(await page.locator('.ls-opt-uk').count(), 3);
   assert.deepEqual(errors, []); await ctx.close(); report.push('language/help levels');
  }
  assert.deepEqual(external, [], 'no requests outside the test server (no Firebase, no CDNs)');
  console.log('PASS: TEST-018 browser — ' + report.join(', '));
 } finally { await browser.close(); server.close() }
})().catch(e => { console.error(e); process.exit(1) });
