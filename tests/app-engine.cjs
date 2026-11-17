// TEST-024 · Learning engine of the app/ snapshot (app/modules/learning-path/core.js) — the copy the home actually runs.
// tests/learning-path.cjs reads the older root copy (no A2, no separate course routes), so these cases had no unit test:
// zero progress, one lesson, partly/fully finished topic, finished course, broken / missing / old / future saves,
// finishing a lesson again, quick course switching with an unfinished lesson, and no mixing of lessons between courses.
const fs = require('node:fs'), path = require('node:path'), vm = require('node:vm'), assert = require('node:assert/strict');
const app = path.join(__dirname, '..', 'app'), read = f => fs.readFileSync(path.join(app, f), 'utf8');
const html = read('index.html'), script = html.match(/<script>([\s\S]*?)<\/script>/)?.[1];
const ctx = vm.createContext({console});
// DATA lives in app.js in the snapshot (index.html in the older root copy).
const src = script && script.includes('const DATA') ? script : read('app.js');
vm.runInContext(read('course-curriculum.js') + '\n' + src.slice(0, src.indexOf('function validStored')) + '\nglobalThis.fixture={DATA,LerenCurriculum};', ctx);
vm.runInContext(read('modules/learning-path/core.js'), ctx);
const core = ctx.LerenLearningPath, course = core.catalog(ctx.fixture.DATA, ctx.fixture.LerenCurriculum);
const store = (init = {}) => { const d = {...init}; return {getItem: k => k in d ? d[k] : null, setItem: (k, v) => { d[k] = v }, d} };
const levels = [...new Set(course.chapters.map(c => c.level))];
const of = lvl => course.lessons.filter(l => course.chapters.find(c => c.id === l.chapter).level === lvl);
const play = (m, id, ok = true) => { assert(m.begin(id)); for (let p = 0; p < 3; p++) { while (m.current()) assert(m.advance(m.current().id, ok)); if (p < 2) assert(m.nextPhase()) } return m.finish() };

// Course structure: unique lesson IDs, each lesson belongs to exactly one level, levels are the expected three.
assert.deepEqual(levels, ['A1.1', 'A1.2', 'A2']);
assert.equal(new Set(course.lessons.map(l => l.id)).size, course.lessons.length, 'lesson IDs are unique');
assert(course.lessons.every(l => /^[a-zA-Z0-9]+:[^:]+:\d+$/.test(l.id)), 'lesson ID format chapter:tab:offset');
for (const l of levels) assert(of(l).length > 0, l + ' has lessons');

// 0 · zero progress: every level at 0, the first lesson of A1.1 is next.
let s = store(), m = core.create(course, s);
assert.equal(m.course, 'A1.1'); for (const l of levels) assert.equal(m.courseStats(l).done, 0);
assert.equal(m.recommended().id, of('A1.1')[0].id);

// 1 · one lesson: counted once, only in its own topic and level; finishing it again does not add a second lesson.
m.start(); play(m, of('A1.1')[0].id);
assert.equal(m.courseStats('A1.1').done, 1); assert.equal(m.courseStats('A1.2').done, 0); assert.equal(m.courseStats('A2').done, 0);
const firstScore = m.state.completed[of('A1.1')[0].id];
play(m, of('A1.1')[0].id, false);
assert.equal(m.courseStats('A1.1').done, 1, 'repeat does not double count'); assert.equal(m.state.completed[of('A1.1')[0].id], firstScore, 'repeat with mistakes keeps the best score');
assert.deepEqual({...m.finish()}, {...m.finish()}, 'finish() is idempotent for the result screen');

// 2 · partial and full topic.
const ch0 = course.chapters[0];
assert(ch0.lessons.length > 1); m = core.create(course, s);
assert.deepEqual({...m.stats(ch0.id)}, {done: 1, total: ch0.lessons.length});
for (const l of ch0.lessons) if (!Object.hasOwn(m.state.completed, l.id)) play(m, l.id);
assert.deepEqual({...m.stats(ch0.id)}, {done: ch0.lessons.length, total: ch0.lessons.length});
assert.notEqual(m.recommended().chapter, ch0.id, 'next lesson leaves a finished topic');

// 3 · quick course switching with an unfinished A1.1 lesson: it is parked, restored, and never leaks into A1.2/A2.
const open = m.recommended(); m.begin(open.id); m.advance(m.current().id, true);
for (const lvl of ['A1.2', 'A2', 'A1.1', 'A2', 'A1.2', 'A1.1', 'A1.2', 'A1.1']) assert(m.setCourse(lvl));
assert.equal(m.state.session?.lesson, open.id, 'the paused A1.1 lesson survives rapid switching'); assert.equal(m.state.session.index, 1);
m.setCourse('A1.2'); assert.equal(m.state.session, null); assert.equal(m.recommended().id, of('A1.2')[0].id);
const reload = core.create(course, s); assert.equal(reload.course, 'A1.2'); assert.equal(reload.state.parked['A1.1'].lesson, open.id, 'parked lesson survives a reload');
assert.equal(m.setCourse('B9'), false, 'unknown level is refused');

// 4 · finished course: no next lesson in A1.1, other levels untouched.
const done = core.create(course, store()); done.start();
for (const l of of('A1.1')) play(done, l.id);
assert.equal(done.recommended('A1.1'), null); assert.equal(done.courseStats('A1.1').done, of('A1.1').length); assert.equal(done.courseStats('A1.2').done, 0);

// 5 · broken, missing and foreign saves never throw and never invent progress.
const K = core.KEY;
for (const raw of ['{broken', '[]', 'null', '42', '""', JSON.stringify({}), JSON.stringify({version: 1}),
 JSON.stringify({version: 1, completed: {[of('A1.1')[0].id]: 'x', 'zz:yy:0': 3, [of('A1.1')[1].id]: 999, [of('A1.1')[2].id]: -1}, course: 'Z9', entries: [], parked: 'x', session: {kind: 'lesson', lesson: 'zz', ids: [], phase: 9}})]) {
 const x = core.create(course, store({[K]: raw}));
 for (const l of levels) assert.equal(x.courseStats(l).done, 0, 'bad save ' + raw.slice(0, 20) + ': no invented progress');
 assert(levels.includes(x.course)); assert.equal(x.state.session, null); assert(x.recommended());
}
// Storage that throws (private mode / blocked): works in memory, reports not persistent.
const boom = core.create(course, {getItem() { throw new Error('denied') }, setItem() { throw new Error('denied') }});
boom.start(); play(boom, of('A1.1')[0].id); assert.equal(boom.persistent, false); assert.equal(boom.courseStats('A1.1').done, 1);

// 6 · an older save (one route over A1.1+A1.2, no course/entries/parked) keeps its lessons and picks the right course.
const oldDone = {[of('A1.1')[0].id]: 5, [of('A1.2')[0].id]: 4};
const old = core.create(course, store({[K]: JSON.stringify({version: 1, started: true, entry: of('A1.2')[2].id, completed: oldDone, mistakes: []})}));
assert.equal(old.course, 'A1.2', 'old save: course from the saved entry'); assert.equal(old.courseStats('A1.1').done, 1); assert.equal(old.courseStats('A1.2').done, 1);
assert.equal(old.recommended().id, of('A1.2')[2].id, 'old save: continues from its saved entry point (placement result)');

// 7 · a save from a future/unknown version is not silently replaced: TEST-024 rule — only version 1 is read,
//     and reading anything else must not overwrite it until the learner actually does something.
const future = JSON.stringify({version: 2, completed: {[of('A1.1')[0].id]: 5}});
const fs2 = store({[K]: future}); core.create(course, fs2);
assert.equal(fs2.d[K], future, 'opening the app does not overwrite an unknown-version save');

console.log('PASS: app/ engine — structure, zero/one/partial/full/course-done, repeat completion, rapid switching with a parked lesson, 9 broken saves, throwing storage, old save migration, future save untouched');
