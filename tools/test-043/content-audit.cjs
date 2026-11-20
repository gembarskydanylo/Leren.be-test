// TEST-043 · Automated content validation of every course the app ships (Dutch A1.1 / A1.2 / A2, English 1.1 / 1.2, French 1.1).
// The data is taken from the RUNNING app (Chromium, local server, network blocked), i.e. exactly what learners see after the
// app built its lessons — not from a re-implementation of the build. Nothing is corrected automatically: every finding names
// course / chapter / lesson / card and a suggested action; anything linguistic is marked for human review.
//   node tools/test-043/content-audit.cjs            → prints a summary, writes docs/audits/test-043/content-findings.json + CONTENT.md
//   require('./content-audit.cjs').run()             → {dump, findings} (used by tests/content-043.cjs)
const fs = require('node:fs'), path = require('node:path');
const {browser, repo} = require('./serve.cjs');
const UI_LANGS = ['uk', 'en', 'fr', 'ar'], SPECIAL_TABS = new Set(['clock', 'vervoegen', 'diphthongs']);

// Everything is read inside the page; only plain data comes back.
function dumpInPage() {
 const C = globalThis.LerenCourseData || {}, X = globalThis.LerenCourseExams || {};
 const plain = o => JSON.parse(JSON.stringify(o, (k, v) => typeof v === 'function' ? undefined : v));
 const hash = t => (typeof audioHash === 'function' ? audioHash(t) : null);
 const nlCards = Object.entries(DATA).flatMap(([tab, d]) => d.items.map(c => ({tab, ...c, icon: c.icon ? String(c.icon).slice(0, 40) : '', audio: hash(c.nl)})));
 const courses = {};
 for (const [lang, c] of Object.entries(C)) courses[lang] = {
  chapters: plain(c.curriculum.chapters), advanced: plain(c.curriculum.advanced || []), chapterNames: plain(c.curriculum.chapterNames || {}),
  grammar: plain(c.grammar || {}),
  tabs: Object.fromEntries(Object.entries(c.data).map(([tab, d]) => [tab, {title: plain(d.title || {}), items: d.items.map(i => ({...plain(i), audio: hash(i[lang])}))}]))
 };
 return {
  categories: plain(CATEGORIES), nlCards, toets: plain(TOETS),
  uiCats: Object.fromEntries(['uk', 'en', 'fr', 'ar'].map(l => [l, plain(UI[l].cats || {})])),
  uiTabs: Object.fromEntries(['uk', 'en', 'fr', 'ar'].map(l => [l, plain(UI[l].tabs || {})])),
  courses, exams: plain(X), examIds: Object.keys(X),
  registry: globalThis.LerenCourses ? plain(LerenCourses.list ? LerenCourses.list() : {}) : null
 };
}

async function dump() {
 const B = await browser(); const p = await B.ctx.newPage(), errors = [];
 p.on('pageerror', e => errors.push(e.message));
 await p.goto(B.base + '/app/index.html'); await p.waitForFunction(() => typeof DATA === 'object' && globalThis.LerenCourseData?.en, null, {timeout: 20000});
 const d = await p.evaluate(dumpInPage); d.pageErrors = errors; await B.close(); return d;
}

// Script checks: which writing system a field is in. Only obvious mismatches are reported (human review, never auto-fixed).
const CYR = /[Ѐ-ӿ]/, ARAB = /[؀-ۿ]/, LATIN = /[A-Za-zÀ-ÿ]/;
function scriptProblem(lang, s) {
 if (!s) return null;
 if (lang === 'uk' && !CYR.test(s) && LATIN.test(s) && !/^[\d\s.,:;!?…–—'’"«»()+\-/=%€]*$/.test(s)) return 'Ukrainian field has no Cyrillic text';
 if (lang === 'ar' && !ARAB.test(s) && LATIN.test(s)) return 'Arabic field has no Arabic text';
 if (['en', 'fr', 'nl'].includes(lang) && (CYR.test(s) || ARAB.test(s))) return lang + ' field contains Cyrillic/Arabic text';
 return null;
}

function audit(d, files = audioFiles()) {
 const F = []; const add = (severity, course, chapter, lesson, card, problem, suggestion) => F.push({severity, course, chapter, lesson, card, problem, suggestion});
 // ---- Dutch: chapters → lessons → cards
 const chapterOf = {}; for (const c of d.categories) for (const t of c.tabs) chapterOf[t] = c.id + (c.chapter ? ' (H' + c.chapter + ')' : '') + ' ' + c.lvl;
 const tabs = new Set(d.nlCards.map(c => c.tab));
 const ownerCount = {}; for (const c of d.categories) for (const t of c.tabs) ownerCount[t] = (ownerCount[t] || 0) + 1;
 for (const c of d.categories) {
  for (const l of UI_LANGS) if (!d.uiCats[l][c.id]) add('HIGH', 'nl', c.id, '', '', `chapter title missing in interface language ${l}`, 'add UI.' + l + '.cats.' + c.id);
  for (const t of c.tabs) {
   if (!SPECIAL_TABS.has(t) && !tabs.has(t)) add('CRITICAL', 'nl', c.id, t, '', 'chapter references a lesson that has no cards', 'remove the reference or add the lesson');
   if (!SPECIAL_TABS.has(t)) for (const l of UI_LANGS) if (!d.uiTabs[l][t]) add('HIGH', 'nl', c.id, t, '', `lesson title missing in interface language ${l}`, 'add UI.' + l + '.tabs.' + t);
  }
 }
 for (const t of tabs) {
  if (!ownerCount[t]) add('HIGH', 'nl', '', t, '', 'lesson is not in any chapter (unreachable from the lesson picker)', 'add it to a chapter or remove it');
  if (ownerCount[t] > 1) add('MEDIUM', 'nl', '', t, '', 'lesson belongs to ' + ownerCount[t] + ' chapters', 'keep one home');
  const n = d.nlCards.filter(c => c.tab === t).length; if (n < 4) add('HIGH', 'nl', chapterOf[t], t, '', `only ${n} cards (quiz needs 4 options)`, 'add cards');
 }
 const ids = new Map();
 for (const c of d.nlCards) {
  const ch = chapterOf[c.tab] || '?';
  if (ids.has(c.id)) add('HIGH', 'nl', ch, c.tab, c.id, 'duplicate card ID (also in ' + ids.get(c.id) + ')', 'give one card a new ID; never rename the legacy one');
  ids.set(c.id, c.tab);
  for (const l of ['nl', ...UI_LANGS]) {
   const v = c[l];
   if (typeof v !== 'string' || !v.trim()) add('HIGH', 'nl', ch, c.tab, c.id, `empty ${l} text`, 'human translation needed');
   else {
    if (v !== v.trim() || /\s{2,}/.test(v)) add('LOW', 'nl', ch, c.tab, c.id, `${l} text has extra whitespace`, 'trim');
    const sp = scriptProblem(l, v); if (sp) add('MEDIUM', 'nl', ch, c.tab, c.id, sp + ': «' + v.slice(0, 60) + '»', 'HUMAN REVIEW');
   }
  }
  if (c.ex_nl && !c.ex_uk) add('LOW', 'nl', ch, c.tab, c.id, 'example sentence has no Ukrainian translation', 'HUMAN REVIEW');
  if (!c.icon) add('LOW', 'nl', ch, c.tab, c.id, 'card has no picture/icon', 'add an icon');
 }
 // the same Dutch text twice in ONE lesson = two identical quiz options / study cards
 const seen = {};
 // Not reported: gap cards (one answer word in several gap sentences is the exercise) and the Kort/lang game levels of «klanken»
 // (k2_ = two syllables, k3_ = verb level reuse the same verbs on purpose). makeOptions() also removes duplicate option labels.
 for (const c of d.nlCards) { if (c.gap || c.tab === 'klanken') continue; const k = c.tab + '|' + (c.nl || '').trim().toLowerCase(); if (seen[k]) add('MEDIUM', 'nl', chapterOf[c.tab], c.tab, c.id, 'same Dutch text as ' + seen[k] + ' in the same lesson: «' + c.nl + '»', 'remove or differentiate (HUMAN REVIEW)'); else seen[k] = c.id }
 // the same Dutch text meaning different things in different lessons is normal; same text + different translation is reported for review
 const byText = {};
 for (const c of d.nlCards) (byText[(c.nl || '').trim().toLowerCase()] ||= []).push(c);
 for (const [txt, cs] of Object.entries(byText)) { const uk = new Set(cs.map(c => (c.uk || '').trim())); if (cs.length > 1 && uk.size > 1 && new Set(cs.map(c => c.tab)).size > 1) add('LOW', 'nl', '', cs.map(c => c.tab).join(','), cs.map(c => c.id).join(','), `«${txt}» has ${uk.size} different Ukrainian translations: ${[...uk].join(' | ').slice(0, 120)}`, 'HUMAN REVIEW: consistent translation') }
 // ---- Dutch tests (Toets)
 const tIds = new Set();
 for (const t of d.toets) {
  if (tIds.has(t.id)) add('HIGH', 'nl', 'toets', t.id, '', 'duplicate test ID', 'rename the new test'); tIds.add(t.id);
  for (const l of UI_LANGS) if (t.title && typeof t.title === 'object' && !t.title[l]) add('MEDIUM', 'nl', 'toets', t.id, '', 'test title missing in ' + l, 'add title');
  (t.questions || []).forEach((q, i) => {
   const qid = t.id + '#' + (i + 1);
   const opts = q.opts || [];
   if (q.type === 'speak' || q.open) return;
   if (!opts.length) { add('HIGH', 'nl', 'toets', t.id, qid, 'question has no options', 'add options'); return }
   if (!(Number.isInteger(q.ok) && q.ok >= 0 && q.ok < opts.length)) add('CRITICAL', 'nl', 'toets', t.id, qid, `correct answer index ${q.ok} outside the ${opts.length} options`, 'fix the answer index');
   for (const l of UI_LANGS) {
    const qt = typeof q.q === 'string' ? q.q : q.q && q.q[l]; if (!qt && !q.sentence && !q.text && !q.word) add('HIGH', 'nl', 'toets', t.id, qid, 'empty question in ' + l, 'add the question text');
    const o = opts.map(x => typeof x === 'string' ? x : x && x[l]);
    if (o.some(x => !x || !String(x).trim())) add('HIGH', 'nl', 'toets', t.id, qid, 'empty answer option in ' + l, 'add the option text');
    else if (new Set(o.map(x => String(x).trim().toLowerCase())).size !== o.length) add('MEDIUM', 'nl', 'toets', t.id, qid, 'two identical answer options in ' + l + ': ' + o.join(' | ').slice(0, 120), 'make options distinct');
   }
  });
 }
 // ---- English / French courses
 for (const [lang, c] of Object.entries(d.courses)) {
  const chTabs = new Map(); for (const [id, , tbs, lvl] of [...c.chapters, ...c.advanced]) for (const t of tbs) chTabs.set(t, id + ' ' + (lvl || ''));
  for (const [id] of [...c.chapters, ...c.advanced]) for (const l of UI_LANGS) if (!c.chapterNames[id]?.[l]) add('MEDIUM', lang, id, '', '', 'chapter name missing in ' + l, 'add chapterNames.' + id + '.' + l);
  for (const t of chTabs.keys()) if (!c.tabs[t]) add('CRITICAL', lang, chTabs.get(t), t, '', 'chapter references a lesson that does not exist', 'fix the reference');
  const cid = new Map();
  for (const [t, tab] of Object.entries(c.tabs)) {
   const ch = chTabs.get(t) || '';
   if (!chTabs.has(t)) add('HIGH', lang, '', t, '', 'lesson is not in any chapter (unreachable)', 'add it to the curriculum');
   for (const l of UI_LANGS) if (!tab.title[l]) add('MEDIUM', lang, ch, t, '', 'lesson title missing in ' + l, 'add title');
   if (!c.grammar[t]) add('MEDIUM', lang, ch, t, '', 'no grammar/usage explanation for this lesson', 'write one (HUMAN)');
   else for (const l of UI_LANGS) if (!c.grammar[t][l]) add('MEDIUM', lang, ch, t, '', 'grammar explanation missing in ' + l, 'HUMAN translation');
   if (tab.items.length < 4) add('HIGH', lang, ch, t, '', 'fewer than 4 cards', 'add cards');
   const texts = {};
   for (const it of tab.items) {
    if (cid.has(it.id)) add('HIGH', lang, ch, t, it.id, 'duplicate card ID (also in ' + cid.get(it.id) + ')', 'rename'); cid.set(it.id, t);
    if (!String(it.id).startsWith(lang + ':')) add('MEDIUM', lang, ch, t, it.id, 'card ID does not start with "' + lang + ':"', 'keep the language prefix (progress keys depend on it)');
    for (const l of [lang, ...UI_LANGS.filter(x => x !== lang), 'nl']) {
     const v = it[l];
     if (typeof v !== 'string' || !v.trim()) add('HIGH', lang, ch, t, it.id, `empty ${l} text`, 'human translation needed');
     else { const sp = scriptProblem(l, v); if (sp) add('MEDIUM', lang, ch, t, it.id, sp + ': «' + v.slice(0, 60) + '»', 'HUMAN REVIEW') }
    }
    const k = String(it[lang] || '').trim().toLowerCase(); if (texts[k]) add('MEDIUM', lang, ch, t, it.id, 'same text as ' + texts[k] + ' in the same lesson', 'HUMAN REVIEW'); texts[k] = it.id;
    if (it.audio && files[lang] && !files[lang].manifest.has(it.audio)) add('LOW', lang, ch, t, it.id, 'no recorded audio (device voice is used): «' + it[lang] + '»', 'record with tools/make-audio-azure.sh');
   }
  }
  const exams = Object.values(d.exams).filter(x => x.lang === lang);
  if (!exams.length) add('MEDIUM', lang, '', '', '', 'course has no final exam (English has en11/en12)', 'decide whether a final exam is planned');
  for (const x of exams) for (const part of ['reading', 'listening', 'writing']) {
   const items = (x[part] || []).flatMap(b => b.items || [b]);
   const xid = new Set();
   for (const it of items) {
    const id = x.id + ':' + part + ':' + (it.id || '?');
    if (it.id && xid.has(it.id)) add('HIGH', lang, x.id, part, id, 'duplicate exam item ID', 'rename'); xid.add(it.id);
    if (Array.isArray(it.options)) {
     if (!(Number.isInteger(it.answer) && it.answer >= 0 && it.answer < it.options.length)) add('CRITICAL', lang, x.id, part, id, 'answer index outside the options', 'fix');
     if (new Set(it.options.map(o => typeof o === 'string' ? o.trim().toLowerCase() : JSON.stringify(o))).size !== it.options.length) add('MEDIUM', lang, x.id, part, id, 'two identical options', 'make distinct');
    }
    if (it.why) for (const l of UI_LANGS) if (!it.why[l]) add('MEDIUM', lang, x.id, part, id, 'explanation missing in ' + l, 'HUMAN translation');
   }
  }
 }
 // ---- recorded audio: manifest ↔ files
 for (const [dir, f] of Object.entries(files)) {
  for (const h of f.manifest) if (!f.files.has(h)) add('HIGH', 'audio', dir, '', h, 'manifest lists a recording that does not exist (playback falls back to the device voice after an error)', 'record again or remove from manifest');
  for (const h of f.files) if (!f.manifest.has(h)) add('LOW', 'audio', dir, '', h, 'recording is not in the manifest (never played, still downloaded by nobody)', 'add to manifest or delete');
 }
 if (d.pageErrors.length) add('HIGH', 'app', '', '', '', 'page errors while loading: ' + d.pageErrors.join(' | ').slice(0, 200), 'fix');
 return F;
}

function audioFiles() {
 const out = {}, base = path.join(repo, 'app', 'audio');
 for (const dir of fs.readdirSync(base)) {
  const p = path.join(base, dir); if (!fs.statSync(p).isDirectory()) continue;
  let manifest = []; try { manifest = JSON.parse(fs.readFileSync(path.join(p, 'manifest.json'), 'utf8')) } catch {}
  out[dir] = {manifest: new Set(manifest), files: new Set(fs.readdirSync(p).filter(f => f.endsWith('.m4a')).map(f => f.slice(0, -4)))};
 }
 return out;
}

async function run() { const d = await dump(); return {dump: d, findings: audit(d)} }
module.exports = {run, audit, dump, scriptProblem};

if (require.main === module) (async () => {
 const {dump: d, findings} = await run();
 const out = path.join(repo, 'docs', 'audits', 'test-043'); fs.mkdirSync(out, {recursive: true});
 fs.writeFileSync(path.join(out, 'content-findings.json'), JSON.stringify(findings, null, 1) + '\n');
 const by = {}; for (const f of findings) by[f.severity] = (by[f.severity] || 0) + 1;
 const stats = {nlCards: d.nlCards.length, nlLessons: new Set(d.nlCards.map(c => c.tab)).size, chapters: d.categories.length, toets: d.toets.length,
  courses: Object.fromEntries(Object.entries(d.courses).map(([l, c]) => [l, {lessons: Object.keys(c.tabs).length, cards: Object.values(c.tabs).reduce((s, t) => s + t.items.length, 0)}])), exams: d.examIds};
 console.log(JSON.stringify({stats, by}, null, 1));
 const kinds = {}; for (const f of findings) { const k = f.severity + ' · ' + f.course + ' · ' + f.problem.replace(/«.*$/, '').replace(/\(also in.*\)/, '').replace(/ in (uk|en|fr|ar)\b.*/, ' in <lang>').replace(/only \d+/, 'only N').replace(/index -?\d+/, 'index N').replace(/\d+ different/, 'N different').slice(0, 90); kinds[k] = (kinds[k] || 0) + 1 }
 for (const [k, n] of Object.entries(kinds).sort()) console.log(String(n).padStart(5), k);
})().catch(e => { console.error(e); process.exit(1) });
