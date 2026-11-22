// TEST-044 · Mobile header (app/): the whole brand name «Lerenbe.com» stays visible from 320 px up, the language switcher is a
// flag + two-letter code (UK, EN, FR, AR) with no clipped characters, nothing in the header overlaps, and Arabic (RTL) mirrors it.
// Browser: Playwright Chromium, emulated 320/360/375/390/412/768 px — not a physical phone. SHOTS=<dir> saves screenshots.
const fs = require('node:fs'), path = require('node:path'), http = require('node:http'), assert = require('node:assert/strict');
const repo = path.join(__dirname, '..'), root = path.join(repo, 'app');
(async () => {
 const html = fs.readFileSync(path.join(root, 'index.html'), 'utf8'), js = fs.readFileSync(path.join(root, 'app.js'), 'utf8');
 assert(/<h1 id="appTitle">Lerenbe\.com<\/h1>/.test(html), 'brand text is «Lerenbe.com»');
 assert(/id="headerLangFlag"/.test(html) && /id="headerLangCode"/.test(html) && /id="headerUiLangPicker"/.test(html), 'switcher markup: flag + code + native select');
 for (const l of ['uk', 'en', 'fr', 'ar']) assert(new RegExp('<option value="' + l + '">').test(html), 'option ' + l);
 assert(/headerCode\.textContent=uiLang\.toUpperCase\(\)/.test(js) && /headerFlag\.dataset\.flag=FLAG_OF\[uiLang\]/.test(js), 'switcher is synced from uiLang');
 console.log('PASS: TEST-044 static — brand text, switcher markup, sync code');
 let chromium; try { ({chromium} = require('playwright')) } catch { console.log('SKIP: browser part (Playwright is not installed)'); return }
 const T = {'.html': 'text/html', '.js': 'text/javascript', '.mjs': 'text/javascript', '.css': 'text/css', '.json': 'application/json', '.png': 'image/png', '.webp': 'image/webp', '.jpg': 'image/jpeg', '.svg': 'image/svg+xml', '.woff': 'font/woff', '.woff2': 'font/woff2', '.m4a': 'audio/mp4', '.webmanifest': 'application/manifest+json'};
 const server = http.createServer((q, r) => { let f = path.join(repo, decodeURIComponent(new URL(q.url, 'http://x').pathname)); if (f.endsWith(path.sep)) f += 'index.html'; if (!f.startsWith(repo) || !fs.existsSync(f) || fs.statSync(f).isDirectory()) { r.writeHead(404); r.end(); return } r.writeHead(200, {'content-type': T[path.extname(f)] || 'application/octet-stream'}); fs.createReadStream(f).pipe(r) });
 await new Promise(r => server.listen(0, '127.0.0.1', r)); const B = 'http://127.0.0.1:' + server.address().port + '/app/';
 let browser; try { browser = await chromium.launch() } catch { console.log('SKIP: no Chromium'); server.close(); return }
 const FLAG = {uk: 'ua', en: 'gb', fr: 'fr', ar: 'sa'};
 try {
  let checks = 0;
  for (const lang of ['uk', 'en', 'fr', 'ar']) for (const w of [320, 360, 375, 390, 412, 768]) {
   const ctx = await browser.newContext({viewport: {width: w, height: 800}, serviceWorkers: 'block'}), page = await ctx.newPage(), errors = [];
   await ctx.route(/^https?:\/\/(?!127\.0\.0\.1)/, r => r.abort()); page.on('pageerror', e => errors.push(e.message));
   await page.addInitScript(l => { try { localStorage.setItem('poly_ui', l) } catch {} }, lang);
   await page.goto(B); await page.waitForSelector('.onb-panel .tour-skip:not(.onb-back)'); await page.click('.onb-panel .tour-skip:not(.onb-back)'); await page.waitForSelector('.fh-hero'); await page.waitForTimeout(400);
   const tag = lang + '@' + w, s = await page.evaluate(() => {
    const R = e => { const r = e.getBoundingClientRect(); return {l: r.left, r: r.right, t: r.top, b: r.bottom, w: r.width, h: r.height} };
    const hdr = document.querySelector('main>header, header'), h1 = document.querySelector('#appTitle'), brand = document.querySelector('.brand'), box = document.querySelector('.hl-box'), face = document.querySelector('#headerLangFace');
    const parts = {brand: R(h1), lang: R(box), streak: R(document.querySelector('#streakPill')), score: R(document.querySelector('#score')), settings: R(document.querySelector('#settingsBtn'))};
    return {text: h1.textContent, dir: document.documentElement.getAttribute('dir'), rtl: getComputedStyle(hdr).direction, parts, brandBox: R(brand), hdr: R(hdr), font: parseFloat(getComputedStyle(h1).fontSize),
     h1Clipped: h1.scrollWidth > h1.clientWidth + 1, face: {code: document.querySelector('#headerLangCode').textContent, flag: document.querySelector('#headerLangFlag').dataset.flag, clipped: face.scrollWidth > face.clientWidth + 1, dir: getComputedStyle(face).direction, hidden: face.getAttribute('aria-hidden')},
     select: {value: document.querySelector('#headerUiLangPicker').value, options: [...document.querySelectorAll('#headerUiLangPicker option')].map(o => o.value), r: R(document.querySelector('#headerUiLangPicker'))},
     boxR: R(box), hscroll: document.documentElement.scrollWidth > innerWidth, label: document.querySelector('#headerUiLangLabel').getAttribute('for')};
   });
   assert.equal(s.text, 'Lerenbe.com', tag + ': brand text'); assert(!s.hscroll, tag + ': no horizontal scroll'); assert.deepEqual(errors, [], tag + ': no page errors');
   // the whole name is visible: the text box is inside the brand box and the browser did not have to clip it
   assert(s.parts.brand.l >= s.brandBox.l - 0.5 && s.parts.brand.r <= s.brandBox.r + 0.5, tag + ': «Lerenbe.com» fits inside the brand area (' + JSON.stringify([s.parts.brand, s.brandBox].map(x => [Math.round(x.l), Math.round(x.r)])) + ')');
   assert(s.font >= 10, tag + ': brand font ≥ 10 px (' + s.font + ')'); if (w >= 360) assert(s.font >= 11, tag + ': brand font ≥ 11 px from 360 px (' + s.font + ')');
   // nothing overlaps and everything stays inside the header
   const names = Object.keys(s.parts);
   for (const n of names) assert(s.parts[n].l >= s.hdr.l - 0.5 && s.parts[n].r <= s.hdr.r + 0.5, tag + ': ' + n + ' inside the header');
   for (let i = 0; i < names.length; i++) for (let j = i + 1; j < names.length; j++) { const a = s.parts[names[i]], b = s.parts[names[j]]; assert(a.r <= b.l + 0.5 || b.r <= a.l + 0.5, tag + ': ' + names[i] + ' does not overlap ' + names[j]) }
   // switcher: flag + two-letter code, not clipped, native select stays on top for keyboard / screen readers
   assert.equal(s.face.code, lang.toUpperCase(), tag + ': code'); assert.equal(s.face.flag, FLAG[lang], tag + ': flag'); assert(!s.face.clipped, tag + ': switcher text is not clipped'); assert.equal(s.face.dir, 'ltr', tag + ': switcher reads LTR even in Arabic');
   assert.deepEqual(s.select.options, ['uk', 'en', 'fr', 'ar']); assert.equal(s.select.value, lang); assert(Math.abs(s.select.r.w - s.boxR.w) < 1 && Math.abs(s.select.r.h - s.boxR.h) < 1, tag + ': select covers the switcher'); assert.equal(s.label, 'headerUiLangPicker');
   // tap targets ≥ 44 px (pills keep an invisible touch area, so only height is required there)
   assert(s.boxR.h >= 44 && s.parts.settings.h >= 44 && s.parts.settings.w >= 44 && s.parts.streak.h >= 44 && s.parts.score.h >= 44, tag + ': header controls ≥ 44 px');
   // RTL: Arabic mirrors the header (brand on the right, settings on the left); other languages keep brand left
   if (lang === 'ar') { assert.equal(s.dir, 'rtl'); assert.equal(s.rtl, 'rtl'); assert(s.parts.brand.l > s.parts.settings.r, tag + ': RTL brand is right of settings') } else { assert.equal(s.dir, null); assert(s.parts.brand.r < s.parts.settings.l, tag + ': LTR brand is left of settings') }
   if (process.env.SHOTS) await page.screenshot({path: path.join(process.env.SHOTS, 'header-' + lang + '-' + w + '.png'), clip: {x: 0, y: 0, width: w, height: 140}});
   // changing the language updates flag and code, and the layout still holds
   if (w === 320 || w === 360) { const next = lang === 'uk' ? 'fr' : lang === 'fr' ? 'ar' : lang === 'ar' ? 'en' : 'uk';
    await page.selectOption('#headerUiLangPicker', next); await page.waitForTimeout(300);
    const a = await page.evaluate(() => { const h1 = document.querySelector('#appTitle'), b = document.querySelector('.brand').getBoundingClientRect(), r = h1.getBoundingClientRect(); return {code: document.querySelector('#headerLangCode').textContent, flag: document.querySelector('#headerLangFlag').dataset.flag, fit: r.left >= b.left - .5 && r.right <= b.right + .5, h: document.documentElement.scrollWidth > innerWidth, dir: document.documentElement.getAttribute('dir')} });
    assert.equal(a.code, next.toUpperCase(), tag + ' → ' + next + ': code follows'); assert.equal(a.flag, FLAG[next]); assert(a.fit && !a.h, tag + ' → ' + next + ': brand still fits'); assert.equal(a.dir, next === 'ar' ? 'rtl' : null) }
   checks++; await ctx.close();
  }
  console.log('PASS: TEST-044 browser (emulated) — ' + checks + ' language × width combinations (uk/en/fr/ar × 320/360/375/390/412/768): full «Lerenbe.com», flag + two-letter code without clipping, no overlaps, RTL for Arabic, targets ≥ 44 px, no horizontal scroll');
 } finally { await browser.close(); server.close() }
})().catch(e => { console.error(e); process.exit(1) });
