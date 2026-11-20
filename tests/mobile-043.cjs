// TEST-043 · Mobile quality (Chromium emulation, NOT a phone): 320 / 390 portrait, 844×390 landscape, 1024 × uk / en / fr / ar
// on 8 screens (Learning Path, quiz, answered quiz with Lesson Help, study, settings, Lexi chat, Lexi error panel, Course Player).
// Fails on page errors, horizontal overflow, controls under 44 px, controls outside the viewport, clipped text, wrong lang / dir.
// The full 14-viewport sweep is tools/test-043/mobile-lab.cjs. Known and accepted (FINAL_REPORT M-2): the English dock label
// «Dictionary» is cut to «Dictiona…» at 320 px (a fix needs new CSS beyond the 760 KB first-screen budget).
const assert = require('node:assert/strict');
const {run} = require('../tools/test-043/mobile-lab.cjs');
const KNOWN = r => r.ui === 'en' && r.w <= 340 && r.clipped.length === 1 && /dock-tx/.test(r.clipped[0]) && !r.small.length && !r.outside.length;
(async () => {
 let res; try { res = await run({views: [{w: 320, h: 568, o: 'portrait'}, {w: 390, h: 844, o: 'portrait'}, {w: 844, h: 390, o: 'landscape'}, {w: 1024, h: 768, o: 'landscape'}]}) }
 catch (e) { if (/Executable doesn't exist|Cannot find module 'playwright'/.test(e.message)) { console.log('SKIP: ' + e.message); return } throw e }
 const bad = res.filter(r => r.problem && !KNOWN(r));
 assert.deepEqual(bad.map(r => `${r.screen} ${r.ui} ${r.w}x${r.h}: ${r.fail || ''} ${r.errors.join('|')} overflow=${r.overflow} small=${(r.small || []).join(',')} outside=${(r.outside || []).join(',')} clipped=${(r.clipped || []).join(',')} lang=${r.lang} dir=${r.dir}`), []);
 assert.ok(res.filter(r => r.screen === 'player' && !r.fail).length === 16, 'Course Player measured in every view');
 console.log(`PASS: mobile — ${res.length} screen states (4 viewports × 4 languages × 8 screens): no overflow, no control under 44 px or off-screen, no clipped text (1 known: en «Dictionary» at 320 px), lang/dir right, no page errors`);
})().catch(e => { console.error(e); process.exit(1) });
