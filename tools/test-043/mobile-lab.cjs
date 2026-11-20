// TEST-043 · Mobile quality lab (Chromium emulation — NOT a physical device). 11 widths × uk / en / fr / ar, portrait and, for
// phones, landscape. Screens: Learning Path home, classic lesson (quiz, study), Lexi chat (+ error panel), Lesson Help, the
// Course Player (English preview) and settings. Per screen: horizontal overflow, controls under 44 × 44 px, controls outside
// the viewport, clipped text, document language / direction and page errors.
//   node tools/test-043/mobile-lab.cjs [--shots]   → docs/audits/test-043/mobile-findings.json (+ screenshots of problems)
const fs = require('node:fs'), path = require('node:path');
const {browser, repo} = require('./serve.cjs');
const rel = fs.readFileSync(path.join(repo, 'app/app.js'), 'utf8').match(/RELEASE_VERSION="(\d+)"/)[1];
const WIDTHS = [320, 360, 375, 390, 412, 430, 768, 800, 844, 915, 1024], HEIGHT = {320: 568, 360: 740, 375: 667, 390: 844, 412: 915, 430: 932, 768: 1024, 800: 1280, 844: 390, 915: 412, 1024: 768};
const LANGS = ['uk', 'en', 'fr', 'ar'];
// Phones also in landscape (width × height swapped). 844 / 915 / 1024 are already landscape sizes of common phones / tablets.
const VIEWS = [...WIDTHS.map(w => ({w, h: HEIGHT[w], o: w >= 844 ? 'landscape' : 'portrait'})), ...[360, 390, 412].map(w => ({w: HEIGHT[w], h: w, o: 'landscape'}))];

function measure() {
 const vw = innerWidth, vh = innerHeight, d = document.documentElement, out = {lang: d.lang, dir: d.dir || getComputedStyle(d).direction, overflow: d.scrollWidth - vw, small: [], outside: [], clipped: []};
 const name = c => (c.id ? '#' + c.id : '') + (typeof c.className === 'string' && c.className ? '.' + c.className.trim().split(/\s+/).slice(0, 2).join('.') : '') || c.tagName.toLowerCase();
 const roots = [document, ...[...document.querySelectorAll('.lexi-host')].map(h => h.shadowRoot).filter(Boolean)];
 for (const r of roots) for (const c of r.querySelectorAll('button, select, input:not([type=hidden]), summary, a[href], [role=button]')) {
  const b = c.getBoundingClientRect(), cs = getComputedStyle(c);
  if (!b.width || !b.height || cs.visibility === 'hidden' || c.closest('[hidden],[inert],[aria-hidden="true"]')) continue;
  // inline text links inside a paragraph are exempt (WCAG 2.5.8 inline exception)
  const inline = c.tagName === 'A' && cs.display === 'inline';
  if (!inline && (b.width < 43.5 || b.height < 43.5)) out.small.push(name(c) + ' ' + Math.round(b.width) + '×' + Math.round(b.height));
  if (b.right > vw + 1 || b.left < -1) {
   // inside a horizontal scroller (carousel / chips) it is reachable by swiping
   let p = c.parentElement, scroller = false; while (p && p !== document.body) { const s = getComputedStyle(p); if (/(auto|scroll)/.test(s.overflowX) && p.scrollWidth > p.clientWidth) { scroller = true; break } p = p.parentElement }
   if (!scroller) out.outside.push(name(c));
  }
 }
 for (const r of roots) for (const e of r.querySelectorAll('h1,h2,h3,p,span,strong,small,label,button,li,td,th,b,em,summary')) {
  const cs = getComputedStyle(e); if (!e.offsetParent && cs.position !== 'fixed') continue;
  // visually hidden labels for screen readers (.sr, clip / 1 px boxes) are meant to be clipped
  const r0 = e.getBoundingClientRect(); if (e.classList.contains('sr') || r0.width <= 2 || r0.height <= 2 || (cs.clip && cs.clip !== 'auto') || (cs.clipPath && cs.clipPath !== 'none')) continue;
  const own = [...e.childNodes].some(n => n.nodeType === 3 && n.textContent.trim()); if (!own) continue;
  if ((cs.overflowX === 'hidden' || cs.overflow === 'hidden' || cs.textOverflow === 'ellipsis') && e.scrollWidth > e.clientWidth + 2) out.clipped.push(name(e) + ' «' + e.textContent.trim().slice(0, 30) + '»');
 }
 for (const k of ['small', 'outside', 'clipped']) out[k] = [...new Set(out[k])];
 out.vh = vh; return out;
}

const SCREENS = {
 home: async p => { await p.evaluate(() => setView('path')); await p.waitForTimeout(250) },
 quiz: async p => { await p.evaluate(() => { lessonMode = 'quiz'; mode = 'quiz'; setView('lesson'); buildNav(); newRound() }); await p.waitForSelector('#card .opt'); await p.waitForSelector('#card .lesson-help', {timeout: 5000}).catch(() => {}) },
 answered: async p => { await SCREENS.quiz(p); await p.evaluate(() => document.querySelector('#card .opt').click()); await p.waitForTimeout(150) },
 study: async p => { await p.evaluate(() => { lessonMode = 'study'; mode = 'study'; setView('lesson'); buildNav(); newRound() }); await p.waitForSelector('#card .study-row') },
 settings: async p => { await p.evaluate(() => { const b = document.getElementById('settingsBtn'); b && b.click() }); await p.waitForTimeout(300) },
 lexi: async p => { await p.evaluate(() => lexiOpen('free', {})); await p.waitForFunction(() => document.querySelector('.lexi-host')?.shadowRoot?.querySelector('#draft'), null, {timeout: 15000}) },
 lexiError: async p => { await SCREENS.lexi(p); await p.evaluate(() => { const r = document.querySelector('.lexi-host').shadowRoot, i = r.querySelector('#draft'); i.value = 'Ik woon in Gent.'; i.dispatchEvent(new Event('input', {bubbles: true})); r.querySelector('button.send').click() });
  await p.waitForFunction(() => document.querySelector('.lexi-host')?.shadowRoot?.querySelector('.error-panel'), null, {timeout: 15000}) },
 player: null, // set below (needs the English preview course)
};

async function run({shots = false, views = VIEWS, langs = LANGS} = {}) {
 const B = await browser(); const results = [], shotDir = path.join(repo, 'docs', 'audits', 'test-043', 'shots');
 await B.b.close(); const {chromium} = require('playwright'); const br = await chromium.launch();
 for (const v of views) for (const ui of langs) {
  const ctx = await br.newContext({viewport: {width: v.w, height: v.h}, hasTouch: v.w < 1024, isMobile: false, serviceWorkers: 'block'});
  await ctx.route('**/*', r => { const u = r.request().url(); if (u.includes('/mock-ai/')) return r.fulfill({status: 500, body: ''}); return u.startsWith(B.base) ? r.continue() : r.abort() });
  for (const [screen, go] of Object.entries(SCREENS)) {
   const page = await ctx.newPage(), errors = []; page.on('pageerror', e => errors.push(e.message));
   await page.addInitScript(([s]) => { localStorage.clear(); for (const [k, val] of Object.entries(s)) localStorage.setItem(k, val) }, [{leren_release_seen: JSON.stringify(rel), poly_ui: ui, poly_target: 'nl',
    leren_home_v1: 'path', leren_welcome_seen: 'true', leren_onboarding_language_v1: '1', leren_start_known_v1: 'zero', leren_ai_consent18: 'true', leren_char: '"peter"', leren_tour_done: 'true',
    leren_ai_endpoint: JSON.stringify(B.base + '/mock-ai/')}]);
   let m, err = '';
   try {
    await page.goto(B.base + '/app/index.html'); await page.waitForFunction(() => typeof setView === 'function' && typeof DATA === 'object', null, {timeout: 20000}); await page.waitForTimeout(200);
    if (screen === 'player') { await page.waitForFunction(() => !!window.LerenCoursePlayer && !!window.LerenCourses); await page.evaluate(async ui => { try { await (LerenCourses.load ? LerenCourses.load('en') : 0) } catch {} LerenCoursePlayer.open('en', ui) }, ui);
     await page.waitForSelector('.cp-body .cp-primary', {timeout: 8000}); await page.click('.cp-body .cp-primary'); await page.waitForSelector('.cp-q, .cp-word', {timeout: 8000}); await page.waitForTimeout(200) }
    else await go(page);
    m = await page.evaluate(measure);
   } catch (e) { err = e.message.split('\n')[0] }
   const r = {w: v.w, h: v.h, o: v.o, ui, screen, ...(m || {}), errors, fail: err};
   r.problem = !!(err || errors.length || (m && (m.overflow > 1 || m.small.length || m.outside.length || m.clipped.length || m.lang !== ui || (ui === 'ar') !== (m.dir === 'rtl'))));
   results.push(r);
   if (shots && r.problem && !err) { fs.mkdirSync(shotDir, {recursive: true}); const f = `${screen}-${ui}-${v.w}x${v.h}.png`; if (results.filter(x => x.shot).length < 40) { await page.screenshot({path: path.join(shotDir, f), scale: 'css'}); r.shot = 'shots/' + f } }
   await page.close();
  }
  await ctx.close();
 }
 await br.close(); B.close?.();
 return results;
}
SCREENS.player = async () => {};
module.exports = {run, measure, VIEWS, LANGS};

if (require.main === module) (async () => {
 const res = await run({shots: process.argv.includes('--shots')});
 const out = path.join(repo, 'docs', 'audits', 'test-043'); fs.mkdirSync(out, {recursive: true});
 fs.writeFileSync(path.join(out, 'mobile-findings.json'), JSON.stringify(res.filter(r => r.problem), null, 1) + '\n');
 const agg = {};
 for (const r of res.filter(r => r.problem)) for (const k of ['small', 'outside', 'clipped']) for (const x of r[k] || []) { const key = r.screen + ' · ' + k + ' · ' + x.replace(/\d+×\d+/, '').replace(/«.*»/, '').trim(); (agg[key] ||= new Set()).add(r.ui + '@' + r.w + 'x' + r.h) }
 console.log(`checked ${res.length} screen states (${VIEWS.length} viewports × ${LANGS.length} languages × ${Object.keys(SCREENS).length} screens); with a problem: ${res.filter(r => r.problem).length}`);
 for (const r of res.filter(r => r.fail || r.errors.length || r.overflow > 1 || (r.lang && r.lang !== r.ui) || (r.ui === 'ar') !== (r.dir === 'rtl'))) console.log('!!', r.screen, r.ui, r.w + 'x' + r.h, r.fail || '', r.errors.join('|'), r.overflow > 1 ? 'overflow ' + r.overflow : '', r.lang !== r.ui ? 'lang ' + r.lang : '', 'dir ' + r.dir);
 for (const [k, s] of Object.entries(agg).sort((a, b) => b[1].size - a[1].size)) console.log(String(s.size).padStart(4), k, [...s].slice(0, 4).join(' '));
})().catch(e => { console.error(e); process.exit(1) });
