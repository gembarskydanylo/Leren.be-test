// TEST-043 · Learning engine stress test (Chromium, local server, network blocked, mock data only — never real learner data).
// Empty storage, corrupted storage, invalid progress values, XP preservation across reload / interface language / course
// (A1.1 ↔ A1.2) / learning language (nl ↔ en), a double tap on an answer, a reload in the middle of an exercise and offline use.
const assert = require('node:assert/strict'), fs = require('node:fs'), path = require('node:path');
const {browser, repo} = require('../tools/test-043/serve.cjs');
const rel = fs.readFileSync(path.join(repo, 'app/app.js'), 'utf8').match(/RELEASE_VERSION="(\d+)"/)[1];
const SEED = {leren_release_seen: JSON.stringify(rel), poly_ui: 'uk', poly_target: 'nl', leren_home_v1: 'path', leren_welcome_seen: 'true', leren_onboarding_language_v1: '1',
 leren_start_known_v1: 'zero', leren_char: '"peter"', leren_tour_done: 'true'};
const LEDGER = JSON.stringify({v: 2, base: 500, g: {}, d: {}});
// Every key the app reads with lsGet / loadNumber / validStored / JSON.parse (collected from app.js), each set to hostile values.
const keys = [...new Set([...fs.readFileSync(path.join(repo, 'app/app.js'), 'utf8').matchAll(/["'](leren_[a-z0-9_]+|poly_[A-Za-z0-9_]+)["']/g)].map(m => m[1]), 'leren_voice_nl', 'leren_voice_en', 'leren_voice_fr')]; // + the per-language voice keys built at run time
const GARBAGE = ['{', 'null', 'NaN', '-1', '1e400', '[]', '{"__proto__":{"x":1}}', '"<img src=x onerror=alert(1)>"', 'true', '{"v":2,"base":-50,"g":{"a":"x"},"d":{"dev":{"bad-day":5}}}'];

(async () => {
 let B; try { B = await browser({viewport: {width: 390, height: 844}, hasTouch: true}) } catch (e) { console.log('SKIP: no Playwright/Chromium: ' + e.message); return }
 const open = async (seed, {quiet} = {}) => {
  const page = await B.ctx.newPage(), errors = [];
  page.on('pageerror', e => errors.push(e.message)); page.on('dialog', d => d.dismiss());
  if (seed) await page.addInitScript(s => { if (!sessionStorage.getItem('seeded')) { sessionStorage.setItem('seeded', '1'); localStorage.clear(); for (const [k, v] of Object.entries(s)) localStorage.setItem(k, v) } }, seed);
  await page.goto(B.base + '/app/index.html'); await page.waitForFunction(() => typeof score === 'number' && typeof DATA === 'object', null, {timeout: 20000});
  await page.waitForTimeout(300); return {page, errors};
 };
 const quiz = page => page.evaluate(() => { lessonMode = 'quiz'; mode = 'quiz'; setView('lesson'); buildNav(); newRound() }).then(() => page.waitForSelector('#card .opt'));
 const sane = async (page, label) => {
  const s = await page.evaluate(() => score); assert.ok(Number.isFinite(s) && s >= 0, label + ': score is a finite number (' + s + ')');
  const txt = await page.evaluate(() => document.body.innerText); assert.ok(!/\bNaN\b|\bundefined\b|\[object Object\]/.test(txt), label + ': no NaN / undefined / [object Object] on screen');
  assert.equal(await page.evaluate(() => !!document.querySelector('img[src="x"]')), false, label + ': stored text is never rendered as HTML');
 };

 // 1 · empty storage: first start, no errors
 { const {page, errors} = await open({}); assert.deepEqual(errors, [], 'empty storage: no page errors'); await sane(page, 'empty storage'); assert.equal(await page.evaluate(() => score), 0); await page.close() }
 console.log('PASS: empty storage — first start without errors, 0 points');

 // 2 · corrupted storage: every key the app reads, ten hostile values each
 for (const g of GARBAGE) {
  const {page, errors} = await open({...SEED, ...Object.fromEntries(keys.filter(k => !(k in SEED)).map(k => [k, g]))});
  assert.deepEqual(errors, [], `corrupted storage (${g}): no page errors`); await sane(page, 'corrupted ' + g);
  await quiz(page); await page.locator('#card .opt[data-ok="1"]').first().click(); await sane(page, 'corrupted ' + g + ' after an answer');
  await page.close();
 }
 console.log(`PASS: corrupted storage — ${keys.length} keys × ${GARBAGE.length} hostile values: no page error, finite score, nothing rendered as HTML, a lesson still works`);

 // 3 · XP preservation
 {
  const {page, errors} = await open({...SEED, leren_xp_v2: LEDGER, poly_score: '500'});
  assert.equal(await page.evaluate(() => score), 500, 'the stored ledger is read');
  await quiz(page);
  const ok = page.locator('#card .opt[data-ok="1"]').first();
  await page.evaluate(() => { const b = document.querySelector('#card .opt[data-ok="1"]'); b.click(); b.click(); b.dispatchEvent(new MouseEvent('click', {bubbles: true})) });
  const s1 = await page.evaluate(() => score); assert.ok(s1 > 500 && s1 <= 520, 'one correct answer (triple tap) adds one gain, not three: ' + s1);
  assert.equal(await ok.isDisabled(), true, 'options are locked after the answer');
  await page.reload(); await page.waitForFunction(() => typeof score === 'number'); assert.equal(await page.evaluate(() => score), s1, 'reload keeps the points');
  // reload in the middle of an exercise: nothing is granted or lost
  await quiz(page); await page.reload(); await page.waitForFunction(() => typeof score === 'number'); assert.equal(await page.evaluate(() => score), s1, 'reload during a question keeps the points');
  // interface language
  for (const ui of ['en', 'fr', 'ar', 'uk']) { await page.evaluate(u => localStorage.setItem('poly_ui', u), ui); await page.reload(); await page.waitForFunction(() => typeof score === 'number');
   assert.equal(await page.evaluate(() => score), s1, 'points are the same in ' + ui); assert.equal(await page.evaluate(() => document.documentElement.lang), ui, 'interface is ' + ui);
   if (ui === 'ar') assert.equal(await page.evaluate(() => document.documentElement.dir), 'rtl', 'Arabic is right-to-left'); }
  // course A1.1 → A1.2 → A1.1 keeps points and lesson progress
  const prog = await page.evaluate(() => localStorage.getItem('poly_progress'));
  assert.equal(await page.evaluate(() => switchCourse('a12')), true); await quiz(page); await page.locator('#card .opt[data-ok="1"]').first().click();
  const s2 = await page.evaluate(() => score); assert.ok(s2 > s1, 'A1.2 answer adds points');
  await page.evaluate(() => switchCourse('a11')); assert.equal(await page.evaluate(() => score), s2, 'switching back keeps the points');
  const p2 = JSON.parse(await page.evaluate(() => localStorage.getItem('poly_progress'))); for (const id of Object.keys(JSON.parse(prog))) assert.ok(id in p2, 'A1.1 card progress kept: ' + id);
  // learning language nl → en (preview) → nl: points are shared, per-course progress is separate
  await page.evaluate(() => { localStorage.setItem('leren_multilang', '1'); localStorage.setItem('leren_learn_lang', 'en') }); await page.reload(); await page.waitForFunction(() => typeof score === 'number');
  assert.equal(await page.evaluate(() => score), s2, 'points are shared by all learning languages');
  assert.equal(await page.evaluate(() => localStorage.getItem('poly_progress')), JSON.stringify(p2), 'the Dutch progress is not touched by the English course');
  await page.evaluate(() => localStorage.setItem('leren_learn_lang', 'nl')); await page.reload(); await page.waitForFunction(() => typeof score === 'number');
  assert.equal(await page.evaluate(() => score), s2, 'back to Dutch: same points');
  // offline: answering still works and is stored
  await B.ctx.setOffline(true); await quiz(page); await page.locator('#card .opt[data-ok="1"]').first().click();
  const s3 = await page.evaluate(() => score); assert.ok(s3 > s2, 'offline answer counts'); await B.ctx.setOffline(false);
  assert.equal(JSON.parse(await page.evaluate(() => localStorage.getItem('poly_score'))), s3, 'poly_score follows the ledger');
  assert.deepEqual(errors, [], 'no page errors during the XP scenario');
  await page.close();
 }
 console.log('PASS: XP — ledger read; triple tap = one gain and locked options; kept across reload, reload mid-question, uk/en/fr/ar (ar = rtl), A1.1↔A1.2, nl↔en; offline answer counts');

 // 4 · invalid / partial progress values
 {
  const {page, errors} = await open({...SEED, poly_progress: JSON.stringify({fam_moeder: {seen: 'x', wrong: -3, due: 'tomorrow'}, no_such_card: {seen: 5}, '__proto__': {seen: 1}}), poly_cat: '"no_such_chapter"', poly_tab: '"no_such_lesson"', poly_level: '"z9"', leren_lesson_mode: '"hack"'});
  await quiz(page); await page.locator('#card .opt[data-ok="1"]').first().click(); await sane(page, 'invalid progress');
  assert.deepEqual(errors, [], 'invalid progress values: no page errors'); await page.close();
 }
 console.log('PASS: invalid progress values (bad card state, unknown card / chapter / lesson / level / mode) — lesson still works');
 await B.close();
})().catch(e => { console.error(e); process.exit(1) });
