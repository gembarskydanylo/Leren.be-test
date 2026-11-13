// TEST-026 · LerenBe 3.0: the contracts between any home/lesson design and the learning engine (docs/LERENBE-3-UI-CONTRACTS.md).
// Runs the REAL app/ snapshot (app/index.html + app/app.js + app/modules), not the older root copies. The checks go through the
// contract surface (learningPath.*, its .model, the bridge functions switchCourse / recordPathResult / absorbLifeXP), not
// through CSS selectors, so a redesign that keeps the contracts keeps passing and one that breaks a contract fails here.
// Covered: A1.1, A1.2, A2 (shown as «A2.1»), course switching with a paused lesson, finishing a lesson again, reload,
// old saves, broken saves, XP ledger = poly_score, resuming a lesson, Review, LIFE XP, settings. Emulated Chromium, no network.
const fs = require('node:fs'), path = require('node:path'), http = require('node:http'), vm = require('node:vm'), assert = require('node:assert/strict');
const repo = path.join(__dirname, '..'), app = path.join(repo, 'app'), read = f => fs.readFileSync(path.join(app, f), 'utf8');

// Lesson IDs from the app/ catalog itself (node, no browser), to build old and broken saves.
const ctx = vm.createContext({console}), src = read('app.js');
vm.runInContext(read('course-curriculum.js') + '\n' + src.slice(0, src.indexOf('function validStored')) + '\nglobalThis.fixture={DATA,LerenCurriculum};', ctx);
vm.runInContext(read('modules/learning-path/core.js'), ctx);
const course = ctx.LerenLearningPath.catalog(ctx.fixture.DATA, ctx.fixture.LerenCurriculum);
const levelOf = id => course.chapters.find(c => c.id === course.lessons.find(l => l.id === id).chapter).level;
const of = lvl => course.lessons.filter(l => levelOf(l.id) === lvl).map(l => l.id);

// Static part of the contract: the globals and functions a new design may rely on exist in app/.
const lpUi = read('modules/learning-path/ui.js'), core = read('modules/learning-path/core.js');
for (const f of ['startFirst', 'startPlacement', 'refresh', 'home', 'chapter', 'open', 'review', 'pauseSpeech', 'model', 'conversation']) assert(new RegExp('return \\{[^\\n]*\\b' + f + '\\b').test(lpUi), 'mount() returns ' + f);
for (const f of ['recommended', 'begin', 'current', 'advance', 'nextPhase', 'finish', 'continueRoute', 'setCourse', 'courseStats', 'stats', 'reviewWords', 'beginReview', 'mistakes', 'levels']) assert(core.includes(f), 'engine has ' + f);
for (const f of ['function switchCourse(', 'function recordPathResult(', 'function absorbLifeXP(', 'function addXP(', 'function saveStore(', 'function initLearningPath(', 'complete:recordPathResult', 'setLevel:name=>']) assert(src.includes(f), 'app.js has ' + f);
for (const k of ['A1.1', 'A1.2', 'A2']) assert(of(k).length > 2, k + ' has lessons');
console.log('PASS: static — contract surface present in app/ (mount API, engine API, bridge), ' + course.lessons.length + ' lessons in A1.1/A1.2/A2');

(async () => {
 let chromium; try { ({chromium} = require('playwright')) } catch { console.log('SKIP: browser part (Playwright is not installed)'); return }
 const T = {'.html': 'text/html', '.js': 'text/javascript', '.mjs': 'text/javascript', '.css': 'text/css', '.json': 'application/json', '.webp': 'image/webp', '.png': 'image/png', '.svg': 'image/svg+xml', '.woff': 'font/woff', '.jpg': 'image/jpeg', '.m4a': 'audio/mp4'};
 const server = http.createServer((q, r) => { let f = path.join(repo, decodeURIComponent(new URL(q.url, 'http://x').pathname)); if (fs.existsSync(f) && fs.statSync(f).isDirectory()) f = path.join(f, 'index.html'); if (!f.startsWith(repo) || !fs.existsSync(f)) { r.statusCode = 404; return r.end() } r.setHeader('content-type', T[path.extname(f)] || 'application/octet-stream'); fs.createReadStream(f).pipe(r) });
 await new Promise(r => server.listen(0, '127.0.0.1', r)); const B = 'http://127.0.0.1:' + server.address().port + '/app/';
 let browser; try { browser = await chromium.launch() } catch { console.log('SKIP: no Chromium'); server.close(); return }
 const release = src.match(/RELEASE_VERSION="(\d+)"/)[1];
 const base = {leren_release_seen: JSON.stringify(release), poly_ui: 'uk', leren_home_v1: 'path', leren_welcome_seen: 'true', leren_onboarding_language_v1: '1', leren_start_known_v1: 'zero'};
 async function open(seed = {}) {
  const c = await browser.newContext({viewport: {width: 390, height: 844}, serviceWorkers: 'block'}), page = await c.newPage(), errors = [], outside = [];
  page.on('pageerror', e => errors.push(e.message)); c.on('request', q => { if (!q.url().startsWith('http://127.0.0.1')) outside.push(q.url()) });
  await c.route(/^https?:\/\/(?!127\.0\.0\.1)/, r => r.abort());
  await page.addInitScript(s => { if (sessionStorage.getItem('seeded')) return; sessionStorage.setItem('seeded', '1'); localStorage.clear(); for (const [k, v] of Object.entries(s)) localStorage.setItem(k, v) }, {...base, ...seed});
  await page.goto(B); await ready(page); return {c, page, errors, outside};
 }
 const ready = page => page.waitForFunction(() => typeof learningPath === 'object' && learningPath && learningPath.model, null, {timeout: 20000});
 const reload = async page => { await page.reload(); await ready(page) };
 const ls = (page, k) => page.evaluate(k => localStorage.getItem(k), k);
 const xp = page => page.evaluate(() => ({score, poly: Number(localStorage.getItem('poly_score')), ledger: LerenMerge.xpTotal(JSON.parse(localStorage.getItem('leren_xp_v2')))}));
 const xpOk = async (page, want, label) => { const x = await xp(page); assert.deepEqual(x, {score: want, poly: want, ledger: want}, label + ': score = poly_score = ledger') };
 // Play the open session to its end: `right` correct answers in the check phase (the first cards), the rest wrong.
 const play = (page, right) => page.evaluate(right => { const m = learningPath.model; for (let p = 0; p < 3; p++) { let i = 0; while (m.current()) m.advance(m.current().id, p < 2 || i++ < right); if (p < 2) m.nextPhase() } }, right);

 try {
  // 1 · A1.1 through the UI's own flow: first lesson → result screen → the UI credits XP exactly once (5 × 5 = 25).
  {
   const {c, page, errors, outside} = await open();
   await xpOk(page, 0, 'new learner');
   const id = await page.evaluate(() => learningPath.startFirst() && learningPath.model.state.session.lesson);
   assert.equal(id, of('A1.1')[0], 'first lesson is the first A1.1 lesson'); assert.equal(await page.evaluate(() => curLevel), 'a11');
   await play(page, 5); await page.evaluate(() => learningPath.refresh()); // the result screen renders: finish() + bridge.complete()
   await xpOk(page, 25, 'A1.1 lesson 5/5');
   for (let i = 0; i < 3; i++) await page.evaluate(() => learningPath.refresh()); // the result screen shown again (re-render, rotation…)
   await xpOk(page, 25, 'result screen re-rendered: no extra XP');
   assert.equal(JSON.parse(await ls(page, 'leren_path_rewards_v1'))[id], 5); assert.equal(JSON.parse(await ls(page, 'leren_xp_v2')).g['p:' + id], 25, 'keyed grant (sync counts it once)');
   assert.equal(await page.evaluate(() => learningPath.model.courseStats('A1.1').done), 1);
   // 2 · reload keeps everything; finishing the same lesson again after the reload gives nothing more.
   await reload(page); await xpOk(page, 25, 'after reload');
   assert.equal(await page.evaluate(id => [learningPath.model.courseStats('A1.1').done, recordPathResult(id, 5, 5)].join(), id), '1,0', 'repeat after reload: 0 XP');
   // 3 · repeat with a better score gives only the difference; a worse repeat gives nothing and keeps the best.
   const id2 = of('A1.1')[1];
   const gains = await page.evaluate(id => { const m = learningPath.model, g = []; for (const right of [3, 5, 4]) { m.begin(id); for (let p = 0; p < 3; p++) { let i = 0; while (m.current()) m.advance(m.current().id, p < 2 || i++ < right); if (p < 2) m.nextPhase() } const r = m.finish(); g.push(recordPathResult(r.id, r.correct, r.total)) } return g }, id2);
   assert.deepEqual(gains, [15, 10, 0], 'XP only above the best score'); await xpOk(page, 50, 'after repeats');
   assert.equal(await page.evaluate(id => learningPath.model.state.completed[id], id2), 5, 'best score kept');
   // Invalid results from a broken UI are refused.
   assert.equal(await page.evaluate(id => [recordPathResult(id, 6, 5), recordPathResult(id, 2, 4), recordPathResult('zz:yy:0', 5, 5), recordPathResult(id, 1.5, 5)].join(), id2), '0,0,0,0');
   // 4 · A1.2 and A2: the host course switch drives the engine; each course keeps its own progress.
   for (const [hostId, level] of [['a12', 'A1.2'], ['a21', 'A2']]) {
    const r = await page.evaluate(([h, lvl]) => { switchCourse(h); learningPath.refresh(); const m = learningPath.model, l = m.recommended(); m.begin(l.id); for (let p = 0; p < 3; p++) { while (m.current()) m.advance(m.current().id, true); if (p < 2) m.nextPhase() } const f = m.finish(); return {course: m.course, cur: curLevel, lesson: l.id, gain: recordPathResult(f.id, f.correct, f.total), done: m.courseStats(lvl).done} }, [hostId, level]);
    assert.equal(r.course, level); assert.equal(r.cur, hostId); assert.equal(r.lesson, of(level)[0], level + ' starts at its first lesson'); assert.equal(r.gain, 25); assert.equal(r.done, 1);
   }
   await xpOk(page, 100, 'A1.1 + A1.2 + A2');
   assert.deepEqual(await page.evaluate(() => ['A1.1', 'A1.2', 'A2'].map(l => learningPath.model.courseStats(l).done)), [2, 1, 1], 'no mixing between courses');
   // 5 · a paused A1.1 lesson survives rapid course switching and a reload, and resumes at the same card.
   const paused = await page.evaluate(() => { switchCourse('a11'); learningPath.refresh(); const m = learningPath.model, l = m.recommended(); m.begin(l.id); m.advance(m.current().id, true); m.advance(m.current().id, true); return l.id });
   await page.evaluate(() => { for (const h of ['a12', 'a21', 'a12', 'a11', 'a21', 'a12']) { switchCourse(h); learningPath.refresh() } });
   assert.equal(await page.evaluate(() => learningPath.model.course), 'A1.2');
   await reload(page);
   assert.deepEqual(await page.evaluate(() => [curLevel, learningPath.model.course]), ['a12', 'A1.2'], 'host and engine agree after reload');
   const back = await page.evaluate(() => { switchCourse('a11'); learningPath.refresh(); const s = learningPath.model.state.session; return s && {lesson: s.lesson, index: s.index, phase: s.phase, rec: learningPath.model.recommended().id} });
   assert.deepEqual(back, {lesson: paused, index: 2, phase: 0, rec: paused}, 'resume: same lesson, same card');
   // 6 · Review: wrong answers in the check phase become this course's review words; Review opens a review session.
   const rv = await page.evaluate(() => { const m = learningPath.model; for (let p = 0; p < 3; p++) { let i = 0; while (m.current()) m.advance(m.current().id, p < 2 || i++ < 3); if (p < 2) m.nextPhase() } const f = m.finish(); recordPathResult(f.id, f.correct, f.total); const ids = m.mistakes(); return {n: ids.length, ok: learningPath.review(ids), kind: m.state.session.kind, size: m.state.session.ids.length} });
   assert.deepEqual(rv, {n: 3, ok: true, kind: 'review', size: 3}, '2 wrong now + 1 left from the 4/5 repeat in step 3 (A1.1 only)');
   assert.equal(await page.evaluate(() => learningPath.review([])), false, 'nothing to review → false, the design shows its own empty state');
   // 7 · settings persist through the host's saveStore (poly_*).
   await page.evaluate(() => { uiLang = 'fr'; saveStore() }); await reload(page);
   assert.equal(await page.evaluate(() => uiLang), 'fr'); assert.equal(await ls(page, 'poly_level'), 'a11');
   assert.deepEqual(errors, []); assert.deepEqual(outside, [], 'no request leaves the test server'); await c.close();
  }
  // 8 · an old save: one route over A1.1+A1.2 (no course/entries), points only in poly_score (before the v175 ledger), card states.
  {
   const card = course.lessons.find(l => l.id === of('A1.1')[0]).ids[0], [cat12, tab12] = of('A1.2')[0].split(':');
   const {c, page, errors} = await open({poly_score: '500', poly_level: 'a12', poly_cat: cat12, poly_tab: tab12, poly_progress: JSON.stringify({[card]: {seen: 3, correct: 2, wrong: 1, streak: 0, due: 1, known: false}}),
    leren_path_v1: JSON.stringify({version: 1, started: true, entry: of('A1.2')[2], completed: {[of('A1.1')[0]]: 5, [of('A1.2')[0]]: 4}, mistakes: []}),
    leren_path_rewards_v1: JSON.stringify({[of('A1.1')[0]]: 5, [of('A1.2')[0]]: 4})}); // both keys are written together since b061263
   await xpOk(page, 500, 'old poly_score kept as ledger base');
   assert.deepEqual(await page.evaluate(() => [learningPath.model.course, learningPath.model.courseStats('A1.1').done, learningPath.model.courseStats('A1.2').done, learningPath.model.recommended().id]), ['A1.2', 1, 1, of('A1.2')[2]]);
   assert.equal(await page.evaluate(id => dueItems('a11').some(x => x.id === id) && store[id].seen === 3, card), true, 'old card state kept and due for Review');
   assert.equal(await page.evaluate(id => recordPathResult(id, 5, 5), of('A1.2')[0]), 5, 'old lesson at 4/5: only the 5th answer is new… once');
   await reload(page); await xpOk(page, 505, 'after reload');
   assert.deepEqual(errors, []); await c.close();
  }
  // 8b · the host's course is the source of truth: poly_tab decides curLevel (before poly_level) and the engine follows it on
  //      every render; the engine's own A1.2 entry point is kept for when the learner opens A1.2.
  {
   const {c, page, errors} = await open({poly_level: 'a12', leren_path_v1: JSON.stringify({version: 1, started: true, entry: of('A1.2')[2], completed: {}, mistakes: []})});
   assert.deepEqual(await page.evaluate(() => [curLevel, learningPath.model.course]), ['a11', 'A1.1'], 'no poly_tab → default A1.1 tab → host A1.1 → engine A1.1');
   assert.equal(await page.evaluate(() => { switchCourse('a12'); learningPath.refresh(); return learningPath.model.recommended().id }), of('A1.2')[2], 'A1.2 entry point kept');
   assert.deepEqual(errors, []); await c.close();
  }
  // 9 · broken saves: the app starts, invents nothing, LIFE XP is capped, and learning still credits XP.
  {
   const {c, page, errors} = await open({leren_path_v1: '{broken', leren_xp_v2: '{"v":2,"base":"x","g":[]}', poly_score: 'NaN', poly_progress: '[]', poly_level: 'zz', leren_path_rewards_v1: '[1,2]', leren_life_xp_v1: JSON.stringify({'bad key': 5, 'first-day:arrival': 1e9, 'first-day:shop': -3})});
   await xpOk(page, 100, 'broken saves: only the capped LIFE scene (100)');
   assert.deepEqual(await page.evaluate(() => [curLevel, learningPath.model.course, ...['A1.1', 'A1.2', 'A2'].map(l => learningPath.model.courseStats(l).done)]), ['a11', 'A1.1', 0, 0, 0]);
   const id = await page.evaluate(() => learningPath.startFirst() && learningPath.model.state.session.lesson); await play(page, 5); await page.evaluate(() => learningPath.refresh());
   await xpOk(page, 125, 'learning works after broken saves'); assert.equal(JSON.parse(await ls(page, 'leren_path_rewards_v1'))[id], 5);
   assert.deepEqual(errors, []); await c.close();
  }
  // 10 · LIFE: a story's best XP is added to the shared XP once, also after a reload or a replay with a lower score.
  {
   const {c, page, errors} = await open({leren_life_xp_v1: JSON.stringify({'first-day:arrival': 30})});
   await xpOk(page, 30, 'LIFE XP absorbed'); await reload(page); await xpOk(page, 30, 'not counted twice after reload');
   await page.evaluate(() => { localStorage.setItem('leren_life_xp_v1', JSON.stringify({'first-day:arrival': 40})); absorbLifeXP() }); await xpOk(page, 40, 'better replay: +10');
   const r = await page.goto(B + 'learn-life-story.html?s=first-day'); assert.equal(r.status(), 200); await page.waitForFunction(() => document.querySelector('#app')?.children.length > 0, null, {timeout: 20000});
   assert.deepEqual(errors, []); await c.close();
  }
 } finally { await browser.close(); server.close() }
 console.log('PASS: browser (real app/) — A1.1 via the UI flow (25 XP once, re-render safe), reload, repeat only above best, invalid results refused, A1.2 + A2 separate, paused lesson survives switching + reload, Review, settings, old save (poly_score 500, single route, card states), broken saves, LIFE XP once and capped');
})().catch(e => { console.error(e); process.exit(1) });
