// TEST-022 · A calm home for beginners (app/): until three lessons are done the long showcase (games gallery, clock,
// characters, reviews, FAQ, topic preview) is folded into one short «Ще в LerenBe» block — games, AI chat, clock and
// topics stay one tap away, «Показати все на головній» brings everything back (remembered), and after the third
// lesson the full home appears by itself. Duplicates are gone: no second «Почати навчання» and no LIFE button in the
// HERO, no old «Learn Life» block next to the LIFE card. Every tap target on the home is at least 44 px high.
// Browser: Playwright Chromium, emulated 360/390/430/1280/1440 — not a physical phone. SHOTS=<dir> saves screenshots.
const fs = require('node:fs'), path = require('node:path'), http = require('node:http'), assert = require('node:assert/strict');
const repo = path.join(__dirname, '..'), root = path.join(repo, 'app');
(async () => {
 const lp = fs.readFileSync(path.join(root, 'modules/learning-path/ui.js'), 'utf8');
 assert(/leren_home_all_v1/.test(lp) && /doneLessons<3/.test(lp), 'simple home rule');
 for (const l of ['uk', 'en', 'fr', 'ar']) assert(new RegExp(l + ":\\{title:'[^']+',hint:").test(lp), '«More» texts in ' + l);
 console.log('PASS: TEST-022 static — simple-home rule and texts in 4 languages');
 let chromium; try { ({chromium} = require('playwright')) } catch { console.log('SKIP: browser part (Playwright is not installed)'); return }
 const T = {'.html': 'text/html', '.js': 'text/javascript', '.mjs': 'text/javascript', '.css': 'text/css', '.json': 'application/json', '.png': 'image/png', '.webp': 'image/webp', '.jpg': 'image/jpeg', '.svg': 'image/svg+xml', '.m4a': 'audio/mp4', '.woff': 'font/woff', '.webmanifest': 'application/manifest+json'};
 const server = http.createServer((q, r) => { let f = path.join(repo, decodeURIComponent(new URL(q.url, 'http://x').pathname)); if (f.endsWith(path.sep)) f += 'index.html'; if (!f.startsWith(repo) || !fs.existsSync(f) || fs.statSync(f).isDirectory()) { r.statusCode = 404; return r.end() } r.setHeader('content-type', T[path.extname(f)] || 'application/octet-stream'); fs.createReadStream(f).pipe(r) });
 await new Promise(r => server.listen(0, '127.0.0.1', r)); const B = 'http://127.0.0.1:' + server.address().port + '/app/';
 let browser; try { browser = await chromium.launch() } catch { console.log('SKIP: no Chromium'); server.close(); return }
 const report = [], external = [], shot = async (page, name, full = false) => { if (process.env.SHOTS) await page.screenshot({path: path.join(process.env.SHOTS, 'simple-home-' + name + '.png'), fullPage: full}) };
 async function open(w, h) {
  const ctx = await browser.newContext({viewport: {width: w, height: h}, serviceWorkers: 'block'}), page = await ctx.newPage(), errors = [];
  page.on('pageerror', e => errors.push(e.message)); page.on('request', q => { if (!q.url().startsWith('http://127.0.0.1')) external.push(q.url()) }); await ctx.route(/^https?:\/\/(?!127\.0\.0\.1)/, r => r.abort());
  await page.goto(B); await page.waitForSelector('.onb-panel[data-step="1"]'); await page.click('.onb-panel .tour-skip:not(.onb-back)'); await page.waitForSelector('.fh-hero'); await page.waitForTimeout(500);
  return {ctx, page, errors};
 }
 const home = page => page.evaluate(() => { const lp = document.querySelector('#learningPath'), has = s => !!lp.querySelector(s);
  const small = [...lp.querySelectorAll('button, a.hv-btn, a.hv-life, a.hs-life-link, a.hs-feedback-link')].filter(e => { const r = e.getBoundingClientRect(); return r.width && r.height && (r.height < 44 || r.width < 44) }).map(e => e.textContent.trim().slice(0, 22) + ' ' + Math.round(r(e).width) + '×' + Math.round(r(e).height)); function r(e) { return e.getBoundingClientRect() }
  return {mode: lp.dataset.home, more: has('.fh-more'), intro: has('.hs-intro'), features: has('.hs-features'), overview: has('.fh-overview'), oldLife: has('.hs-life'), routeDup: has('.hs-intro .hs-text-link'), heroBtns: lp.querySelectorAll('.hv-hero .hv-btn').length,
   primary: lp.querySelectorAll('.fh-primary').length, lifeLinks: [...lp.querySelectorAll('a[href*="learn-life"]')].length, courses: has('.hv-pick') && lp.firstElementChild.nextElementSibling === lp.querySelector('.hv-pick') || lp.querySelector('.hv-pick') === [...lp.children].find(e => e.offsetHeight), oldCourses: has('.hv-courses'), lifeCard: has('.hv-life'), progress: has('.hv-progress'),
   height: document.documentElement.scrollHeight, hscroll: document.documentElement.scrollWidth > innerWidth, small} });
 const finish = (page, n) => page.evaluate(n => { const m = learningPath.model, ids = LerenLearningPath.catalog(DATA, LerenCurriculum).lessons.slice(0, n).map(l => l.id); if (!m.state.started) m.start(); for (const id of ids) m.state.completed[id] = 1; m.state.session = null; m.save(); learningPath.home() }, n);
 try {
  for (const [w, h] of [[360, 780], [390, 844], [430, 932], [1280, 800], [1440, 900]]) {
   const {ctx, page, errors} = await open(w, h);
   const s = await home(page);
   assert.equal(s.mode, 'simple', w + ': beginner → simple home'); assert(s.more && !s.intro && !s.features && !s.overview, w + ': the long showcase is folded');
   assert(s.courses && !s.oldCourses && s.lifeCard && s.progress, w + ': «Я вчу» is the first block (no separate Courses block), LIFE and progress stay'); assert.equal(s.heroBtns, 0, w + ': no buttons in the HERO'); assert.equal(s.primary, 1, w + ': one main button');
   assert.equal(s.lifeLinks, 1, w + ': one LIFE entrance'); assert(!s.hscroll, w + ': no horizontal scroll'); assert.deepEqual(s.small, [], w + ': tap targets ≥ 44 px');
   assert.deepEqual(await page.$$eval('.fh-more-tile strong', x => x.map(e => e.textContent)), ['Ігри', 'Поговорити з AI', 'Годинник', 'Усі теми']);
   await shot(page, w + '-beginner', true);
   // «Я вчу» — one button at the top: opens every language and the Dutch levels; picking a level changes the label and the lesson
   assert.match(await page.locator('.hv-pick-btn').textContent(), /Я вчу.*Нідерландська · Починаю з нуля/); assert.equal(await page.getAttribute('.hv-pick-btn', 'aria-expanded'), 'false'); assert.equal(await page.locator('.hv-pick-panel').isVisible(), false);
   const cta = await page.evaluate(() => document.querySelector('.fh-primary').getBoundingClientRect().bottom); assert(cta <= h, w + ': lesson button stays on the first screen under the picker (' + Math.round(cta) + ')');
   await page.click('.hv-pick-btn'); assert.equal(await page.getAttribute('.hv-pick-btn', 'aria-expanded'), 'true'); assert.deepEqual(await page.$$eval('.hv-pick-panel .hv-course', x => x.map(e => e.dataset.course)), ['nl', 'en', 'fr', 'de']);
   assert.deepEqual(await page.$$eval('.hv-pick-panel .hv-level-name', x => x.map(e => e.textContent)), ['Починаю з нуля', 'Вивчаю основи', 'Спілкуюся в повсякденних ситуаціях']); assert(await page.locator('.hv-pick-panel .hv-cefr').count(), 'CEFR note');
   assert.deepEqual(await page.evaluate(() => [...document.querySelectorAll('.hv-pick button')].filter(e => { const r = e.getBoundingClientRect(); return r.width && r.height < 44 }).length), 0, w + ': picker targets ≥ 44 px'); await shot(page, w + '-picker-open');
   await page.click('.hv-pick-panel .hv-level[data-level="A1.2"]'); await page.waitForFunction(() => /Вивчаю основи/.test(document.querySelector('.hv-pick-btn')?.textContent || '')); assert.equal(await page.evaluate(() => localStorage.getItem('poly_level')), 'a12'); assert.equal(await page.locator('.hv-pick-panel').isVisible(), false, 'closes after the choice');
   await page.click('.hv-pick-btn'); await page.click('.hv-pick-panel .hv-level[data-level="A1.1"]'); await page.waitForFunction(() => /Починаю з нуля/.test(document.querySelector('.hv-pick-btn')?.textContent || ''));
   await page.click('.hv-pick-btn'); await page.click('.hv-pick-panel .hv-course[data-course="en"] button'); await page.waitForSelector('.cp-stage'); await page.goto(B); await page.waitForSelector('.fh-more'); await page.waitForTimeout(300);
   // everything from the folded part is one tap away
   await page.click('.fh-more-tile[data-more="topics"]'); await page.waitForFunction(() => document.querySelector('#learningPath').dataset.screen === 'map'); await page.click('.fh-back'); await page.waitForSelector('.fh-more');
   await page.click('.fh-more-tile[data-more="games"]'); await page.waitForFunction(() => view === 'games'); await page.evaluate(() => setView('path')); await page.waitForSelector('.fh-more');
   await page.click('.fh-more-tile[data-more="clock"]'); await page.waitForFunction(() => view === 'lesson' && tab === 'clock'); await page.evaluate(() => setView('path')); await page.waitForSelector('.fh-more');
   await page.click('.fh-more-tile[data-more="chat"]'); await page.waitForFunction(() => view === 'games'); assert(await page.locator('.ai-consent, .ai-chat, .g-chat').count(), w + ': AI chat (consent first)'); await page.evaluate(() => setView('path')); await page.waitForSelector('.fh-more');
   // «show everything» → the full home, remembered; «show less» → back
   await page.click('.fh-more-all'); await page.waitForSelector('.hs-features'); const f = await home(page);
   assert.equal(f.mode, 'full'); assert(f.intro && f.features && f.overview && !f.more, w + ': full home on request'); assert(!f.oldLife && !f.routeDup && f.heroBtns === 0 && f.lifeLinks === 1, w + ': duplicates stay away in the full home');
   assert.deepEqual(f.small, [], w + ': full home tap targets ≥ 44 px'); assert(!f.hscroll); assert(s.height < f.height * .65, w + ': beginner home is much shorter (' + s.height + ' vs ' + f.height + ')');
   await page.reload(); await page.waitForSelector('.fh-hero'); await page.evaluate(() => setView('path')); await page.waitForSelector('.hs-features'); // remembered
   await page.click('.fh-less'); await page.waitForSelector('.fh-more'); assert.equal((await home(page)).mode, 'simple', w + ': «show less» folds it again');
   // progress: two lessons → still simple; three → the full home by itself; XP untouched
   await finish(page, 2); await page.waitForSelector('.fh-more'); assert.equal((await home(page)).mode, 'simple'); assert.match(await page.locator('.fh-hero .fh-primary').textContent(), /Продовжити навчання/);
   await finish(page, 3); await page.waitForSelector('.hs-features'); const g = await home(page); assert.equal(g.mode, 'full', w + ': three lessons → full home'); assert.equal(await page.locator('.fh-less').count(), 0);
   await shot(page, w + '-after-3-lessons', true);
   await page.click('.fh-hero .fh-primary'); await page.waitForFunction(() => document.querySelector('#learningPath').dataset.screen === 'lesson'); // the main button still opens a lesson
   assert.deepEqual(errors, []); await ctx.close(); report.push(w + ' px (' + s.height + ' → full ' + f.height + ')');
  }
  assert.deepEqual(external, [], 'no request leaves the test site');
  console.log('PASS: TEST-022 browser (emulated) — ' + report.join(', '));
 } finally { await browser.close(); server.close() }
})().catch(e => { console.error(e); process.exit(1) });
