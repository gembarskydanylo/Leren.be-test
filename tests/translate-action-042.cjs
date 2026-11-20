// TEST-042 · The chat action under a Lexi reply: «Translate» in the interface language, «Explain simply» when the
// interface language is the studied language. Evaluates the real aiTrLabels() from app/app.js with the real engine context().
const fs = require('node:fs'), path = require('node:path'), vm = require('node:vm'), assert = require('node:assert/strict');
const root = path.join(__dirname, '..'), app = fs.readFileSync(path.join(root, 'app/app.js'), 'utf8');
const i = app.indexOf('function aiTrLabels(s,g){'), j = app.indexOf('async function aiTranslate(m){'); assert(i > 0 && j > i, 'aiTrLabels found in app.js'); const m = [app.slice(i, j)];
const ctx = vm.createContext({console, localStorage: {getItem: () => null, setItem() {}}, crypto: require('node:crypto').webcrypto});
ctx.globalThis = ctx;
for (const f of ['app/modules/ai-coach/core.js', 'app/modules/lexi/engine.js']) vm.runInContext(fs.readFileSync(path.join(root, f), 'utf8'), ctx);
let cur; ctx.lexiCtx = () => cur; ctx.lexi = () => ctx.LerenLexi;
vm.runInContext(m[0], ctx);
const want = {uk: ['🇺🇦 Перекласти українською', 'Поясни простіше'], en: ['Translate', 'Explain simply'], fr: ['Traduire', 'Explique plus simplement'], ar: ['ترجمة', 'اشرح ببساطة أكثر']};
let n = 0;
for (const ui of Object.keys(want)) for (const target of ['nl', 'fr', 'en']) {
 cur = {ui, target}; const l = vm.runInContext('aiTrLabels({},{trShow:"SHOW",trHide:"HIDE"})', ctx), same = ui === target;
 assert.equal(l.act, want[ui][same ? 1 : 0], `${ui}/${target}: action`);
 for (const k of ['show', 'hide', 'err']) assert.ok(l[k] && l[k].length >= 3, `${ui}/${target}: ${k} label exists`);
 if (!same) assert.deepEqual([l.show, l.hide], ['SHOW', 'HIDE'], `${ui}/${target}: translated text keeps the existing show / hide labels`);
 if (same) assert.notEqual(l.hide, 'HIDE'); if (same) assert.notEqual(l.show, want[ui][0], `${ui}/${target}: no «translate» label for a same-language learner`);
 n++;
}
console.log(`PASS: translate / explain-simply action labels — ${n} interface × studied-language combinations (uk en fr ar; nl fr en)`);
