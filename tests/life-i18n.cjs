// TEST-028 · LIFE pages (the story page and the fence page) in the app's interface languages uk / en / fr / ar.
// The Ukrainian text is the source and the key (i18n.mjs + i18n-story.mjs / i18n-fence.mjs), so story data, engines and
// saved progress are unchanged. This test fails when a text the page can show has no English, French or Arabic row, when
// a row is left over, when a translation keeps Ukrainian letters or loses a {0}, and (browser part) when a page in
// en / fr / ar shows Ukrainian, has the wrong lang / dir, or loses progress saved in another language.
const fs = require('node:fs'), path = require('node:path'), http = require('node:http'), assert = require('node:assert/strict');
const repo = path.join(__dirname, '..'), CYR = /[а-яіїєґ]/i, rd = f => fs.readFileSync(path.join(repo, f), 'utf8');
const STORY = 'life/modules/learn-life', FENCE = 'app/modules/learn-life';
const imp = f => import(require('node:url').pathToFileURL(path.join(repo, f)).href);
// Ukrainian string literals in code (comments skipped) and text / labels of an HTML page.
const literals = f => { const out = []; for (const line of rd(f).split('\n')) { const code = line.replace(/^\s*\/\/.*$/, '').replace(/\s\/\/ .*$/, ''); for (const m of code.matchAll(/'((?:\\.|[^'\\])*)'/g)) if (CYR.test(m[1])) out.push(m[1]) } return out };
const htmlTexts = f => { const h = rd(f).replace(/<noscript>[\s\S]*?<\/noscript>/g, ''), out = []; for (const m of h.matchAll(/>([^<>]*[а-яіїєґ][^<>]*)</gi)) out.push(m[1].trim()); for (const m of h.matchAll(/(?:aria-label|content|placeholder|title)="([^"]*[а-яіїєґ][^"]*)"/gi)) out.push(m[1]); return out };
const strings = (o, out = []) => { if (typeof o === 'string') { if (CYR.test(o)) out.push(o) } else if (Array.isArray(o)) o.forEach(x => strings(x, out)); else if (o && typeof o === 'object') Object.values(o).forEach(x => strings(x, out)); return out };
const holes = s => (s.match(/\{\w+\}/g) || []).sort().join();
function check(name, keys, DICT) {
 const need = new Set(keys), missing = [...need].filter(k => !DICT[k]), extra = Object.keys(DICT).filter(k => !need.has(k));
 assert.deepEqual(missing, [], name + ': shown Ukrainian text without a translation row');
 assert.deepEqual(extra, [], name + ': rows nobody shows (remove them or the text they were for changed)');
 for (const [k, row] of Object.entries(DICT)) {
  assert.equal(row.length, 3, name + ': [en, fr, ar] for «' + k + '»');
  row.forEach((t, i) => { assert(t && t.trim(), name + ': empty ' + ['en', 'fr', 'ar'][i] + ' for «' + k + '»'); assert(!CYR.test(t), name + ': Ukrainian letters in ' + ['en', 'fr', 'ar'][i] + ' «' + t + '»'); assert.equal(holes(t), holes(k), name + ': placeholders of «' + k + '»') });
  assert(/[\u0600-\u06ff]/.test(row[2]), name + ': the Arabic row has no Arabic: «' + row[2] + '»');
 }
 return need.size;
}

(async () => {
 assert.equal(rd(STORY + '/i18n.mjs'), rd(FENCE + '/i18n.mjs'), 'the two copies of i18n.mjs are the same file');
 // ---- story page
 const {STORIES, ROADMAP} = await imp(STORY + '/stories/index.mjs'), m = JSON.parse(rd('life/assets/lerenbe-life/visual-manifest.json'));
 const storyKeys = [...strings(STORIES), ...strings(ROADMAP), ...literals(STORY + '/story-ui.mjs'), ...literals(STORY + '/story-engine.mjs'), ...htmlTexts('life/learn-life-story.html'), ...htmlTexts('app/learn-life-story.html')];
 for (const c of Object.values(m.characters || {})) if (c.alt) storyKeys.push(c.alt);
 for (const s of STORIES) { const ms = m.stories?.[s.id]; if (ms?.cover?.alt) storyKeys.push(ms.cover.alt); for (const sc of Object.values(ms?.scenes || {})) if (sc.alt) storyKeys.push(sc.alt) }
 const ns = check('story', storyKeys, (await imp(STORY + '/i18n-story.mjs')).DICT);
 // ---- fence page ('@' + acc: the object inside «Можеш подати мені {thing}?»)
 const {fence} = await imp(FENCE + '/data.mjs');
 const fenceKeys = [...strings({...fence, objects: fence.objects.map(({acc, ...o}) => o)}), ...fence.objects.map(o => '@' + o.acc), ...literals(FENCE + '/ui.mjs'), ...htmlTexts('app/learn-life.html')];
 const nf = check('fence', fenceKeys, (await imp(FENCE + '/i18n-fence.mjs')).DICT);
 // ---- the pages load the dictionaries only for en / fr / ar, through the shared helper
 for (const f of [STORY + '/story-ui.mjs', FENCE + '/ui.mjs']) assert(/await loadDict\(\(\) ?=> ?import\('\.\/i18n-(story|fence)\.mjs\?v=\d+'\)\)/.test(rd(f)), f + ' loads its dictionary');
 console.log('PASS: unit — ' + ns + ' story and ' + nf + ' fence texts have en / fr / ar rows (no gaps, no leftovers, no Ukrainian letters, same {0}); one shared i18n.mjs');

 let chromium; try { ({chromium} = require('playwright')) } catch { console.log('SKIP: browser part (Playwright is not installed)'); return }
 const T = {'.html': 'text/html', '.js': 'text/javascript', '.mjs': 'text/javascript', '.css': 'text/css', '.json': 'application/json', '.webp': 'image/webp', '.png': 'image/png', '.svg': 'image/svg+xml', '.woff': 'font/woff'};
 const server = http.createServer((q, r) => { let f = path.join(repo, decodeURIComponent(new URL(q.url, 'http://x').pathname)); if (fs.existsSync(f) && fs.statSync(f).isDirectory()) f = path.join(f, 'index.html'); if (!f.startsWith(repo) || !fs.existsSync(f)) { r.statusCode = 404; return r.end() } r.setHeader('content-type', T[path.extname(f)] || 'application/octet-stream'); fs.createReadStream(f).pipe(r) });
 await new Promise(r => server.listen(0, '127.0.0.1', r)); const B = 'http://127.0.0.1:' + server.address().port + '/';
 let browser; try { browser = await chromium.launch() } catch { console.log('SKIP: no Chromium'); server.close(); return }
 const ukrainian = () => { const out = [], w = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT); let n; while ((n = w.nextNode())) { const p = n.parentElement; if (p && !p.closest('script,style,noscript') && p.getClientRects().length && /[а-яіїєґ]{2,}/i.test(n.textContent)) out.push(n.textContent.trim().slice(0, 60)) }
  for (const e of document.querySelectorAll('[aria-label],img[alt],[placeholder]')) for (const a of ['aria-label', 'alt', 'placeholder']) if (/[а-яіїєґ]{2,}/i.test(e.getAttribute(a) || '')) out.push('@' + a + ' ' + e.getAttribute(a).slice(0, 60));
  if (/[а-яіїєґ]/i.test(document.title)) out.push('title ' + document.title); return out };
 try {
  for (const [lang, how] of [['en', 'url'], ['fr', 'app'], ['ar', 'url']]) {
   const c = await browser.newContext({serviceWorkers: 'block', viewport: {width: 390, height: 844}}), p = await c.newPage(), errors = []; p.on('pageerror', e => errors.push(e.message));
   await c.route(/^https?:\/\/(?!127\.0\.0\.1)/, r => r.abort());
   const q = how === 'url' ? '&lang=' + lang : '';
   if (how === 'app') await p.addInitScript(l => localStorage.setItem('poly_ui', l), lang); // the app's own language choice
   // story: home, then the first scene through its first reply
   await p.goto(B + 'app/learn-life-story.html?s=first-day' + q); await p.waitForSelector('.ls-hero');
   assert.deepEqual(await p.evaluate(() => [document.documentElement.lang, document.documentElement.getAttribute('dir')]), [lang, lang === 'ar' ? 'rtl' : null], lang + ' story: html lang / dir');
   assert.deepEqual(await p.evaluate(ukrainian), [], lang + ' story home shows Ukrainian');
   await p.locator('.ls-scene').first().click(); await p.click('.ls-panel .ls-primary'); await p.waitForSelector('.ls-option');
   assert.deepEqual(await p.evaluate(ukrainian), [], lang + ' story scene shows Ukrainian');
   assert.equal(await p.evaluate(() => getComputedStyle(document.querySelector('.ls-nl')).direction), 'ltr', lang + ': Dutch stays left-to-right');
   if (how === 'url') assert(/lang=/.test(await p.evaluate(() => [...document.querySelectorAll('a[href*="learn-life-story"]')].map(a => a.getAttribute('href')).join(' ') || 'lang=')), lang + ': LIFE links keep ?lang=');
   // fence: a task answered in Ukrainian is still done in this language (same saved progress, same key)
   await p.evaluate(() => localStorage.setItem('leren_learn_life_v1_fence-neighbour', JSON.stringify({done: ['mark-1'], missed: [], spoken: [], favourites: ['tape-please']})));
   await p.goto(B + 'app/learn-life.html' + (q ? '?lang=' + lang : '')); await p.waitForSelector('.ll-choice');
   assert.equal(await p.textContent('#heroProgress'), '1 / 20', lang + ': progress saved in Ukrainian is kept');
   assert.deepEqual(await p.evaluate(ukrainian), [], lang + ' fence page shows Ukrainian');
   const search = {en: 'deep', fr: 'profond', ar: 'عميق'}[lang]; await p.fill('#phraseSearch', search);
   assert((await p.$$('#phraseList .ll-phrase')).length > 0, lang + ': the phrase bank finds «' + search + '»');
   assert.deepEqual(errors, [], lang + ': no JS errors'); await c.close();
  }
  // Ukrainian stays exactly Ukrainian: no dictionary request, no dir.
  const c = await browser.newContext({serviceWorkers: 'block'}), p = await c.newPage(), asked = []; p.on('request', r => { if (/i18n-(story|fence)/.test(r.url())) asked.push(r.url()) });
  await c.route(/^https?:\/\/(?!127\.0\.0\.1)/, r => r.abort());
  await p.goto(B + 'app/learn-life-story.html?s=first-day'); await p.waitForSelector('.ls-hero');
  assert.equal(await p.textContent('.ls-primary'), 'Почати історію →'); assert.equal(await p.evaluate(() => document.documentElement.lang + '/' + document.documentElement.dir), 'uk/');
  await p.goto(B + 'app/learn-life.html'); await p.waitForSelector('.ll-choice'); assert.match(await p.textContent('#stageNumber'), /^КРОК 01$/);
  assert.deepEqual(asked, [], 'Ukrainian pages load no dictionary'); await c.close();
 } finally { await browser.close(); server.close() }
 console.log('PASS: browser — story and fence pages in en (?lang=), fr (app choice) and ar (rtl): no Ukrainian, Dutch stays ltr, progress kept across languages, search in the page language; uk unchanged');
})().catch(e => { console.error(e); process.exit(1) });
