// TEST-019 · First run → first lesson (app/, snapshot of production + home v2).
// A brand-new learner chooses the explanation language and a daily goal, answers «How much Dutch do you know?» and
// lands in the real first A1.1 lesson («Починаю з нуля», or «Почати з основ» after «Знаю кілька слів» / «Можу трохи
// говорити») or in the optional starting check — never just on the home screen. The home shows «Your next lesson»
// first («Почати навчання» / «Продовжити навчання»), the daily-goal plan, levels in plain words with a CEFR note; games,
// AI and levels stay below. Existing learners never see the first run again; XP, finished lessons, language and goal
// are kept across reloads.
// Browser: Playwright Chromium, emulated 360/390/1280/1440 px — not a physical phone. SHOTS=<dir> saves screenshots.
// Run: node tests/first-lesson.cjs (the browser part is skipped without Playwright).
const fs = require('node:fs'), path = require('node:path'), http = require('node:http'), assert = require('node:assert/strict');
const root = path.join(__dirname, '..', 'app'), read = f => fs.readFileSync(path.join(root, f), 'utf8');

(async () => {
 // ---- static
 const app = read('app.js'), lp = read('modules/learning-path/ui.js'), hv = read('modules/home-v2/ui.js'), fh = read('modules/focused-home/ui.js');
 assert(/welcomeNl\(1\)/.test(app) && !/welcomeScreen\(\(\)=>\{\},null\)/.test(app), 'the Dutch first run is the 3-step flow, not the old welcome with an empty «Start»');
 assert(!/row\.children\.forEach/.test(app), 'goal buttons: no HTMLCollection.forEach (threw on 5/20 min)');
 for (const l of ['uk', 'en', 'fr', 'ar']) assert(new RegExp(l + ':\\{lang:"[^"]+",next:').test(app), 'first-run texts in ' + l);
 assert(/startFirst,startPlacement,refresh/.test(lp), 'learning path exposes startFirst/startPlacement');
 assert(/Починаю з нуля/.test(hv) && /Вивчаю основи/.test(hv) && /Спілкуюся в повсякденних ситуаціях/.test(hv) && /CEFR/.test(hv), 'plain-words levels + CEFR note');
 assert(!/інтеграці|integration exam|inburgering/i.test(hv + fh + lp), 'no level is tied to an integration exam');
 assert(/START_KEY="leren_start_known_v1"/.test(app) && !/localStorage\.clear|removeItem\("poly_score"|removeItem\("leren_path_v1"/.test(app.slice(app.indexOf('const ONB_UI'), app.indexOf('function firstRun'))), 'first run only adds its own key, removes nothing');
 const sw = read('sw.js'), html = read('index.html');
 for (const f of ['./modules/learning-path/ui.js?v=213', './modules/focused-home/ui.js?v=209', './modules/focused-home/style.css?v=207', './modules/home-v2/ui.js?v=3', './modules/home-v2/style.css?v=3', './app.js?v=228']) { assert(sw.includes('"' + f + '"'), 'offline: ' + f); assert(html.includes(f), 'index: ' + f) }
 assert.equal(sw.match(/leren-be-v(\d+)/)[1], app.match(/RELEASE_VERSION="(\d+)"/)[1]);
 console.log('PASS: TEST-019 static — 3-step first run in 4 languages, start API, plain-words levels + CEFR, no exam link, versions');

 // ---- browser
 let chromium; try { ({chromium} = require('playwright')) } catch { console.log('SKIP: browser part (Playwright is not installed)'); return }
 const types = {'.html': 'text/html', '.js': 'text/javascript', '.mjs': 'text/javascript', '.css': 'text/css', '.json': 'application/json', '.png': 'image/png', '.webp': 'image/webp', '.jpg': 'image/jpeg', '.svg': 'image/svg+xml', '.m4a': 'audio/mp4', '.mp3': 'audio/mpeg', '.woff2': 'font/woff2', '.webmanifest': 'application/manifest+json'};
 const server = http.createServer((req, res) => { let f = path.join(root, decodeURIComponent(new URL(req.url, 'http://x').pathname)); if (f.endsWith(path.sep)) f += 'index.html'; if (!f.startsWith(root) || !fs.existsSync(f) || fs.statSync(f).isDirectory()) { res.statusCode = 404; return res.end() } res.setHeader('content-type', types[path.extname(f)] || 'application/octet-stream'); fs.createReadStream(f).pipe(res) });
 await new Promise(r => server.listen(0, '127.0.0.1', r)); const base = 'http://127.0.0.1:' + server.address().port + '/';
 let browser; try { browser = await chromium.launch() } catch { console.log('SKIP: no Chromium'); server.close(); return }
 const SHOTS = process.env.SHOTS, shot = async (page, name) => { if (SHOTS) await page.screenshot({path: path.join(SHOTS, 'first-lesson-' + name + '.png')}) };
 const external = [], report = [];
 async function open(w, h, seed = null) {
  const ctx = await browser.newContext({viewport: {width: w, height: h}, serviceWorkers: 'block'}), page = await ctx.newPage(), errors = [];
  page.on('pageerror', e => errors.push(e.message)); page.on('request', r => { if (!r.url().startsWith('http://127.0.0.1')) external.push(r.url()) });
  await ctx.route(/^https?:\/\/(?!127\.0\.0\.1)/, r => r.abort());
  if (seed) await page.addInitScript(s => { if (sessionStorage.getItem('seeded')) return; sessionStorage.setItem('seeded', '1'); for (const [k, v] of Object.entries(s)) localStorage.setItem(k, v) }, seed);
  await page.goto(base); return {ctx, page, errors};
 }
 const screen = page => page.evaluate(() => document.querySelector('#learningPath')?.dataset.screen);
 const step = async (page, n) => page.waitForSelector(`.onb-panel[data-step="${n}"]`, {timeout: 15000});
 const ls = (page, k) => page.evaluate(k => localStorage.getItem(k), k);
 const noHScroll = page => page.evaluate(() => document.documentElement.scrollWidth <= innerWidth);
 const lessonTitle = page => page.locator('#learningPath h2').first().textContent();
 async function firstLessonOpen(page, label) {
  await page.waitForFunction(() => document.querySelector('#learningPath')?.dataset.screen === 'lesson', null, {timeout: 10000});
  assert.equal(await page.locator('#growModal').isHidden(), true, label + ': the first-run window is closed');
  assert.match(await lessonTitle(page), /Фрази та привітання · Частина 1\/5|Phrases|Частина 1/, label + ': the first A1.1 lesson');
  assert.match(await page.locator('#learningPath').textContent(), /hallo/, label + ': the lesson\'s first word');
  assert.equal(await page.evaluate(() => view), 'path', label + ': lesson view, not the home');
 }
 try {
  // ---- 1 brand-new learner, three answers, phone + desktop
  for (const [w, h, tag] of [[390, 844, 'mobile'], [1280, 800, 'desktop']]) {
   // «Починаю з нуля» → the first lesson right away
   {
    const {ctx, page, errors} = await open(w, h);
    await step(page, 1); await shot(page, tag + '-1-welcome');
    assert.equal(await page.evaluate(() => document.activeElement?.classList.contains('onb-next')), true, 'focus on «Далі», not on «5 хв»');
    assert.equal(await page.getAttribute('.welcome-goal[data-goal="10"]', 'aria-pressed'), 'true', 'default goal 10');
    await page.click('.welcome-goal[data-goal="5"]'); assert.equal(await page.getAttribute('.welcome-goal[data-goal="5"]', 'aria-pressed'), 'true', '5 min selectable (no error)');
    assert.equal(await page.getAttribute('.welcome-goal[data-goal="10"]', 'aria-pressed'), 'false');
    assert(await noHScroll(page), tag + ': step 1 fits');
    await page.click('.onb-next'); await step(page, 2); await shot(page, tag + '-2-knowledge');
    assert.match(await page.locator('.onb-panel h2').textContent(), /Скільки нідерландської ти вже знаєш\?/);
    assert.deepEqual(await page.$$eval('.onb-opt strong', x => x.map(e => e.textContent)), ['Починаю з нуля', 'Знаю кілька слів', 'Можу трохи говорити']);
    assert.equal(await page.locator('.onb-panel').getByText(/A1|A2/).count(), 0, 'no level codes in the question');
    await page.click('[data-choice="zero"]'); await firstLessonOpen(page, 'zero/' + tag); await shot(page, tag + '-3-first-lesson');
    assert.equal(await ls(page, 'leren_goal_min'), '5'); assert.equal(await ls(page, 'leren_start_known_v1'), '"zero"');
    // reload in the middle of the lesson: no first run again, home → «Продовжити навчання» → the same lesson
    await page.click('#learningPath .lp-primary, #learningPath button:has-text("Зрозуміло, далі")').catch(() => {}); await page.waitForTimeout(300);
    await page.reload(); await page.waitForTimeout(1500);
    assert.equal(await page.locator('.onb-panel').count(), 0, 'no first run after reload');
    await page.evaluate(() => setView('path')); await page.waitForTimeout(300);
    if (await screen(page) !== 'home') await page.click('.fh-back').catch(() => {});
    await page.waitForSelector('.fh-hero .fh-primary');
    assert.match(await page.locator('.fh-hero .fh-primary').textContent(), /Продовжити навчання/, 'started → «Продовжити навчання»');
    assert.match(await page.locator('.fh-goal').textContent(), /5 хв: одна частина уроку/, 'daily-goal plan for 5 min');
    await page.click('.fh-hero .fh-primary'); await page.waitForTimeout(500);
    assert.equal(await screen(page), 'lesson', 'continue → back into the lesson'); assert.match(await lessonTitle(page), /Частина 1\/5/, 'the same first lesson');
    assert.deepEqual(errors, []); await ctx.close();
   }
   // «Знаю кілька слів» → choice → «Пройти коротку перевірку» → the starting check (optional, not forced)
   {
    const {ctx, page, errors} = await open(w, h);
    await step(page, 1); await page.click('.onb-next'); await step(page, 2); await page.click('[data-choice="words"]'); await step(page, 3); await shot(page, tag + '-4-how-to-start');
    assert.deepEqual(await page.$$eval('.onb-opt strong', x => x.map(e => e.textContent)), ['Пройти коротку перевірку', 'Почати з основ'], 'check OR basics — no forced test');
    await page.click('.onb-back'); await step(page, 2); await page.click('[data-choice="words"]'); await step(page, 3);
    await page.click('[data-choice="check"]'); await page.waitForFunction(() => document.querySelector('#learningPath')?.dataset.screen === 'placement');
    await shot(page, tag + '-5-start-check'); assert.equal(await ls(page, 'leren_start_known_v1'), '"words"'); assert.equal(await ls(page, 'leren_goal_min'), '10');
    assert.deepEqual(errors, []); await ctx.close();
   }
   // «Можу трохи говорити» → «Почати з основ» → the first lesson
   {
    const {ctx, page, errors} = await open(w, h);
    await step(page, 1); await page.click('.welcome-goal[data-goal="20"]'); await page.click('.onb-next'); await step(page, 2); await page.click('[data-choice="speak"]'); await step(page, 3);
    await page.click('[data-choice="basics"]'); await firstLessonOpen(page, 'speak/basics/' + tag);
    assert.equal(await ls(page, 'leren_start_known_v1'), '"speak"'); assert.equal(await ls(page, 'leren_goal_min'), '20');
    assert.deepEqual(errors, []); await ctx.close();
   }
   report.push('new learner ×3 answers (' + tag + ')');
  }
  // ---- 2 skip → home: «Твій наступний урок» first and visible, «Почати навчання» opens the lesson; levels in plain words
  for (const [w, h, tag] of [[360, 780, 'mobile'], [390, 844, 'mobile'], [1280, 800, 'desktop'], [1440, 900, 'desktop']]) {
   const {ctx, page, errors} = await open(w, h);
   await step(page, 1); await page.click('.welcome-goal[data-goal="20"]'); await page.click('.onb-panel .tour-skip:not(.onb-back)'); await page.waitForTimeout(500);
   await page.waitForSelector('.fh-hero .fh-primary');
   const order = await page.evaluate(() => { const lp = document.querySelector('#learningPath'), hero = lp.querySelector('.fh-hero'), top = lp.querySelector('.hv'); return {heroFirst: !!hero && (!top || !!(hero.compareDocumentPosition(top) & Node.DOCUMENT_POSITION_FOLLOWING)), btn: hero.querySelector('.fh-primary').getBoundingClientRect().bottom, vh: innerHeight} });
   assert(order.heroFirst, w + ': «Твій наступний урок» above the HERO, courses, games and AI');
   assert(order.btn <= order.vh, w + ': its button is on the first screen (' + Math.round(order.btn) + ' ≤ ' + order.vh + ')');
   assert.match(await page.locator('.fh-hero .fh-eyebrow').textContent(), /Твій наступний урок/);
   assert.match(await page.locator('.fh-hero .fh-primary').textContent(), /Почати навчання/, 'new → «Почати навчання»');
   assert.match(await page.locator('.fh-goal').textContent(), /20 хв: урок, повторення й гра або розмова/, 'plan for 20 min (lesson length unchanged)');
   assert.equal(await page.locator('.hv-hero .hv-primary').count(), 0, 'HERO button is secondary (one main button)');
   for (const name of ['Починаю з нуля', 'Вивчаю основи', 'Спілкуюся в повсякденних ситуаціях']) assert.equal(await page.locator('.hv-level-name', {hasText: name}).count(), 1, name);
   assert.match(await page.locator('.hv-cefr').textContent(), /CEFR/); assert(!/інтеграці/i.test(await page.locator('#learningPath').textContent()), 'no exam link');
   for (const sel of ['.hv-courses', '.hs-intro']) assert.equal(await page.locator(sel).count(), 1, sel + ': still on the home, below');
   assert(await noHScroll(page), w + ': no horizontal scroll');
   await shot(page, tag + '-' + w + '-6-home-new');
   await page.click('.fh-hero .fh-primary'); await firstLessonOpen(page, 'home start ' + w);
   assert.deepEqual(errors, []); await ctx.close(); report.push('home ' + w);
  }
  // ---- 3 an existing learner: no first run; XP, finished lessons, language, goal kept; continue = the next lesson
  {
   const {ctx, page, errors} = await open(390, 844);
   await step(page, 1); await page.click('.onb-next'); await step(page, 2); await page.click('[data-choice="zero"]'); await firstLessonOpen(page, 'seed');
   const first = await page.evaluate(() => { const m = learningPath.model, id = m.state.session.lesson; m.state.completed[id] = 1; m.state.session = null; m.save(); return id });
   await page.evaluate(() => { localStorage.setItem('poly_score', '35'); localStorage.setItem('leren_goal_min', '10'); localStorage.setItem('poly_ui', 'en') });
   const before = await page.evaluate(() => JSON.stringify(JSON.parse(localStorage.getItem('leren_path_v1')).completed));
   await page.reload(); await page.waitForTimeout(1500);
   assert.equal(await page.locator('.onb-panel').count(), 0, 'existing learner: no first run');
   await page.evaluate(() => setView('path')); await page.waitForSelector('.fh-hero .fh-primary');
   assert.match(await page.locator('.fh-hero .fh-primary').textContent(), /Continue learning/, 'progress → «Continue learning» (interface language kept: en)');
   assert.equal(await page.evaluate(() => JSON.stringify(JSON.parse(localStorage.getItem('leren_path_v1')).completed)), before, 'finished lessons kept');
   assert.equal(await ls(page, 'poly_score'), '35', 'XP kept'); assert.equal(await ls(page, 'leren_goal_min'), '10', 'goal kept');
   assert.match(await page.locator('.fh-goal').textContent(), /10 min: a lesson and a short word review/);
   await shot(page, 'mobile-7-home-progress');
   await page.click('.fh-hero .fh-primary'); await page.waitForTimeout(500);
   const now = await page.evaluate(() => learningPath.model.state.session?.lesson); assert(now && now !== first, 'continue opens the next lesson, not the finished one');
   assert.match(await lessonTitle(page), /2\/5/, 'part 2 of the first topic');
   assert.deepEqual(errors, []); await ctx.close(); report.push('existing learner');
  }
  // ---- 4 explanation language in the first run (en) carries into the lesson and survives a reload
  {
   const {ctx, page, errors} = await open(390, 844);
   await step(page, 1); await page.selectOption('.onb-lang-select', 'en'); await step(page, 1);
   assert.match(await page.locator('.onb-panel h2').textContent(), /What you’ll be able to do in 7 days/);
   await page.click('.onb-next'); await step(page, 2); assert.match(await page.locator('.onb-panel h2').textContent(), /How much Dutch do you already know\?/);
   await page.click('[data-choice="zero"]'); await page.waitForFunction(() => document.querySelector('#learningPath')?.dataset.screen === 'lesson');
   assert.match(await page.locator('#learningPath').textContent(), /hallo/); assert.match(await page.locator('#learningPath').textContent(), /hello|Hello|hi/i, 'English explanations');
   await page.reload(); await page.waitForTimeout(1200); assert.equal(await page.locator('.onb-panel').count(), 0);
   assert.equal(await page.evaluate(() => uiLang), 'en', 'language kept after reload');
   assert.deepEqual(errors, []); await ctx.close(); report.push('language en');
  }
  assert.deepEqual(external, [], 'no request leaves the test site');
  console.log('PASS: TEST-019 browser (emulated) — ' + report.join(', '));
 } finally { await browser.close(); server.close() }
})().catch(e => { console.error(e); process.exit(1) });
