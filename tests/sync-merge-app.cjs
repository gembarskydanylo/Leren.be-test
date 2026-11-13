// TEST-026 · XP and study-time merging of the app/ snapshot (app/modules/sync/merge.js). It decides what a learner keeps
// when two devices sync or a backup is restored, and had no test (the root copy of the older beta has no such module).
// A redesign must keep writing XP through addXP() → LerenMerge.xpAdd(); these checks pin the rules it relies on.
const fs = require('node:fs'), path = require('node:path'), vm = require('node:vm'), assert = require('node:assert/strict');
const ctx = vm.createContext({console, crypto: globalThis.crypto, TextEncoder}); vm.runInContext(fs.readFileSync(path.join(__dirname, '..', 'app', 'modules', 'sync', 'merge.js'), 'utf8'), ctx);
const M = ctx.LerenMerge, J = v => JSON.parse(JSON.stringify(v)), day = '2026-11-13';

// Keyed record grants (route lesson «p:<id>», LIFE «l:<story>:<scene>») count once across devices and repeated syncs.
let phone = M.xpAdd(M.xpAbsorb(null, 0), 'dphone', day, 25, 'p:comm:phrases:0'), laptop = M.xpAdd(M.xpAbsorb(null, 0), 'dlaptop', day, 25, 'p:comm:phrases:0');
assert.equal(M.xpTotal(M.xpMerge(phone, laptop)), 25, 'same lesson record on two devices = once');
// Unkeyed points are per device and add up; merging the same copy again (sync retry) adds nothing.
phone = M.xpAdd(phone, 'dphone', day, 10); laptop = M.xpAdd(laptop, 'dlaptop', day, 7);
const both = M.xpMerge(phone, laptop); assert.equal(M.xpTotal(both), 42);
assert.equal(M.xpTotal(M.xpMerge(both, phone)), 42, 'merging again is idempotent'); assert.equal(M.xpTotal(M.xpMerge(laptop, phone)), 42, 'order does not matter');
// Points from before the ledger (only poly_score) become the base once; an equal or lower poly_score adds nothing.
const old = M.xpAbsorb(null, 500); assert.deepEqual(J(old), {v: 2, base: 500, g: {}, d: {}});
assert.equal(M.xpTotal(M.xpAbsorb(old, 500)), 500); assert.equal(M.xpTotal(M.xpAbsorb(old, 300)), 500, 'never lowers XP');
assert.equal(M.xpTotal(M.xpMerge(old, M.xpAbsorb(null, 500))), 500, 'two devices with the same legacy score: base once');
// Broken / hostile ledgers are cleaned, never throw, never go negative.
for (const raw of [null, 42, 'x', [], {v: 2, base: 'x', g: [], d: 5}, {base: -9, g: {a: -1, b: 'z', __proto__: 5}, d: {dev: {'not-a-day': 3, [day]: -2}}}]) { const x = M.cleanXp(raw); assert(M.xpTotal(x) >= 0 && Number.isFinite(M.xpTotal(x))) }
{ const g = M.cleanXp(JSON.parse('{"g":{"__proto__":{"x":1},"ok":2}}')).g; assert.equal(g.x, undefined, 'no prototype pollution'); assert.equal(vm.runInContext('({}).x', ctx), undefined); assert.equal(g.ok, 2) }
// Study minutes: per device and day, merged by maximum, capped at a day.
const m1 = M.minutesAdd(null, 'dphone', day, 60000), m2 = M.minutesAdd(null, 'dlaptop', day, 120000);
assert.equal(M.minutesView(M.minutesMerge(m1, m2)).days[day], 180); assert.equal(M.minutesView(M.minutesMerge(M.minutesMerge(m1, m2), m1)).days[day], 180);
assert.equal(M.minutesView(M.minutesAdd(null, 'd', day, 9e9)).days[day], 86400);
// Skills per course. A1.1 and A1.2 are kept; A2 answers are NOT kept by this module (LEVELS = a11, a12) — see the report.
const sk = M.skillAdd(M.skillAdd(null, 'dphone', 'a11', 'lezen', true), 'dphone', 'a12', 'luisteren', false);
const view = M.skillsView(sk); assert.equal(view.a11.lezen.n, 1); assert.equal(view.a12.luisteren.n, 1);
const a2kept = !!M.skillsView(M.skillAdd(null, 'dphone', 'a21', 'lezen', true)).a21?.lezen?.n;
console.log((a2kept ? 'PASS' : 'WARN') + ': A2 (a21) reading/listening answers ' + (a2kept ? 'are' : 'are not') + ' stored in leren_skills_v2 (Peter\'s A2 advice has no skill data) — known gap, TEST-026 report');
console.log('PASS: app/ sync merge — keyed grants once across devices, retry-safe, order-free, legacy poly_score base once, broken ledgers cleaned, minutes per device capped');
