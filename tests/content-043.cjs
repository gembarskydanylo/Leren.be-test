// TEST-043 · Course content validation (Dutch A1.1 / A1.2 / A2, English 1.1 / 1.2, French 1.1) on the data of the running app.
// Fails on any CRITICAL or HIGH finding: broken chapter → lesson references, unreachable lessons, duplicate card / test IDs,
// empty translations or questions, answer indexes outside the options, missing interface-language titles, recordings listed
// in an audio manifest that do not exist. MEDIUM / LOW findings (human review) are counted, not failed, so linguistic
// judgements are never made by a test. A mutation part proves each rule actually fires on broken data.
const assert = require('node:assert/strict');
const {run, audit, scriptProblem} = require('../tools/test-043/content-audit.cjs');

function mutations(dump) {
 const clone = () => JSON.parse(JSON.stringify(dump)), sev = (F, s) => F.filter(f => f.severity === s), has = (F, s, re) => F.some(f => f.severity === s && re.test(f.problem));
 const files = {};
 let d = clone(); d.categories[0].tabs.push('no_such_lesson'); assert.ok(has(audit(d, files), 'CRITICAL', /no cards/), 'broken chapter reference is detected');
 d = clone(); d.nlCards[1].id = d.nlCards[0].id; assert.ok(has(audit(d, files), 'HIGH', /duplicate card ID/), 'duplicate card ID is detected');
 d = clone(); d.nlCards[0].fr = '  '; assert.ok(has(audit(d, files), 'HIGH', /empty fr text/), 'empty translation is detected');
 d = clone(); d.categories.forEach(c => c.tabs = c.tabs.filter(t => t !== d.nlCards[0].tab)); assert.ok(has(audit(d, files), 'HIGH', /not in any chapter/), 'unreachable lesson is detected');
 d = clone(); const q = d.toets.find(t => t.questions?.some(x => x.opts?.length)).questions.find(x => x.opts?.length); q.ok = 9; assert.ok(sev(audit(d, files), 'CRITICAL').length, 'answer index outside the options is detected');
 d = clone(); delete d.uiTabs.ar[d.categories[0].tabs[0]]; assert.ok(has(audit(d, files), 'HIGH', /lesson title missing in interface language ar/), 'missing interface label is detected');
 d = clone(); const en = d.courses.en; en.chapters[0][2].push('en_missing'); assert.ok(has(audit(d, files), 'CRITICAL', /does not exist/), 'English chapter → missing lesson is detected');
 d = clone(); const t0 = Object.keys(en.tabs)[0]; const e2 = d.courses.en.tabs[t0].items; e2[1].id = e2[0].id; assert.ok(has(audit(d, files), 'HIGH', /duplicate card ID/), 'English duplicate ID is detected');
 assert.ok(has(audit(dump, {nl: {manifest: new Set(['deadbeef']), files: new Set()}}), 'HIGH', /does not exist/), 'manifest entry without a file is detected');
 assert.equal(scriptProblem('uk', 'mother'), 'Ukrainian field has no Cyrillic text'); assert.equal(scriptProblem('uk', 'мама'), null);
 assert.equal(scriptProblem('ar', 'mother'), 'Arabic field has no Arabic text'); assert.equal(scriptProblem('en', 'мама'), 'en field contains Cyrillic/Arabic text');
 console.log('PASS: mutation check — 12 rules fire on deliberately broken data');
}

(async () => {
 const {dump, findings} = await run();
 assert.equal(dump.pageErrors.length, 0, 'no page errors: ' + dump.pageErrors.join(' | '));
 assert.ok(dump.nlCards.length >= 1600 && dump.categories.length >= 38, 'Dutch courses loaded');
 assert.ok(Object.keys(dump.courses.en.tabs).length >= 36 && Object.keys(dump.courses.fr.tabs).length >= 18, 'English and French courses loaded');
 const bad = findings.filter(f => f.severity === 'CRITICAL' || f.severity === 'HIGH');
 assert.deepEqual(bad, [], 'CRITICAL/HIGH content problems:\n' + bad.slice(0, 20).map(f => `${f.severity} ${f.course} ${f.chapter} ${f.lesson} ${f.card}: ${f.problem}`).join('\n'));
 mutations(dump);
 const by = {}; for (const f of findings) by[f.severity] = (by[f.severity] || 0) + 1;
 console.log(`PASS: content — ${dump.nlCards.length} Dutch cards in ${new Set(dump.nlCards.map(c => c.tab)).size} lessons / ${dump.categories.length} chapters, ${dump.toets.length} tests, ` +
  `English ${Object.values(dump.courses.en.tabs).reduce((s, t) => s + t.items.length, 0)} cards, French ${Object.values(dump.courses.fr.tabs).reduce((s, t) => s + t.items.length, 0)} cards; ` +
  `0 critical, 0 high; for human review: ${JSON.stringify(by)}`);
})().catch(e => { console.error(e); process.exit(1) });
