const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const http = require('node:http');
const {chromium} = require('playwright');

const repo = path.resolve(__dirname, '..');
const release = fs.readFileSync(path.join(repo, 'app/app.js'), 'utf8').match(/RELEASE_VERSION="(\d+)"/)[1];
const types = {'.html':'text/html', '.js':'text/javascript', '.mjs':'text/javascript', '.css':'text/css', '.json':'application/json', '.svg':'image/svg+xml', '.webp':'image/webp'};
const shots = process.env.TEST037_SHOTS;
const server = http.createServer((request, response) => {
 const url = new URL(request.url, 'http://localhost');
 const file = path.join(repo, url.pathname, url.pathname.endsWith('/') ? 'index.html' : '');
 if (!file.startsWith(repo + path.sep) || !fs.statSync(file, {throwIfNoEntry:false})?.isFile()) {
  response.writeHead(404).end();
  return;
 }
 response.setHeader('Content-Type', types[path.extname(file)] || 'application/octet-stream');
 fs.createReadStream(file).pipe(response);
});

async function main() {
 await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
 const base = 'http://localhost:' + server.address().port + '/app/';
 let browser;
 const rows = [];
 try {
  browser = await chromium.launch();
  for (const ui of ['uk', 'en', 'fr', 'ar']) for (const width of [320, 390, 768, 1440]) {
   const context = await browser.newContext({
    viewport: {width, height:width >= 768 ? 900 : 844}, hasTouch: width < 768, serviceWorkers:'block',
   });
   try {
    await context.route(/^https?:\/\/(?!localhost:)/, route => route.abort());
    await context.addInitScript(({ui, release}) => {
     for (const [key, value] of Object.entries({
      poly_ui:ui, poly_target:'nl', poly_theme:ui === 'ar' ? 'dark' : 'light',
      leren_release_seen:JSON.stringify(release), leren_start_known_v1:'zero', leren_welcome_seen:'true',
      leren_onboarding_language_v1:'1', leren_home_v1:'free',
     })) localStorage.setItem(key, value);
    }, {ui, release});
    const page = await context.newPage();
    const errors = [];
    page.on('pageerror', err => errors.push(err.message));
    const audit = async (screen, locator) => {
     await locator.waitFor();
     const m = await locator.evaluate(e => {
      const view = document.documentElement;
      const controls = [...e.querySelectorAll('button, select, input, summary, a[href]')].filter(c => {
       const b = c.getBoundingClientRect();
       return b.width && b.height && !c.closest('[hidden]') && getComputedStyle(c).visibility !== 'hidden';
      });
      return {
       lang:view.lang, dir:view.dir, overflow:view.scrollWidth - innerWidth,
       controls:controls.length,
       small:controls.filter(c => {
        const b = c.getBoundingClientRect();
        return b.width < 43.5 || b.height < 43.5;
       }).map(c => c.id || String(c.className) || c.tagName),
      };
     });
     rows.push({ui,width,screen,...m});
     assert.ok(m.overflow <= 1, JSON.stringify({ui,width,screen,...m}));
     assert.equal(m.lang, ui, screen + ' document language');
     assert.deepEqual(m.small, [], ui + ' ' + width + ' ' + screen + ' controls below 44px');
     if (shots && ui === 'uk' && [390,1440].includes(width) && ['study','ai-tutor','life','settings'].includes(screen)) {
      fs.mkdirSync(shots, {recursive:true});
      await page.screenshot({path:path.join(shots, screen + '-' + width + '.png'), animations:'disabled'});
     }
    };
    await page.goto(base + '?lexi=demo');
    await page.locator('#lessonModes [data-mode=study]').waitFor();
    for (const mode of ['study','quiz','audio','review']) {
     await page.locator('#lessonModes [data-mode=' + mode + ']').click();
     assert.equal(await page.locator('#lessonModes [data-mode=' + mode + ']').getAttribute('aria-selected'), 'true');
     // Chromium runners may have no usable speech voice. Always check the help links in Audio.
     if (mode === 'audio') {
      await page.evaluate(() => showSpeechNote(false));
      assert.equal(await page.locator('#speechNote a').count(), 2);
     }
     await audit(mode, page.locator('#card'));
    }
    await page.locator('#streakPill').click();
    await audit('profile', page.locator('#progressView'));
    await page.locator('#settingsBtn').click();
    await audit('settings', page.locator('#settingsSheet .sheet-panel'));
    await page.keyboard.press('Escape');
    await page.evaluate(() => lexiOpen('free'));
    const chat = page.locator('.lexi-host');
    await chat.locator('#draft').fill('Ik werk in Brussel.');
    await chat.locator('button.send').click();
    await chat.locator('.assistant-row').first().waitFor();
    assert.equal(await chat.getAttribute('lang'), ui);
    assert.equal(await chat.getAttribute('dir'), ui === 'ar' ? 'rtl' : 'ltr');
    await audit('ai-tutor', chat.locator('.lexi-app'));
    for (const button of ['button.send', '.g-mic-btn']) {
     const box = await chat.locator(button).boundingBox();
     assert.ok(box.width >= 44 && box.height >= 44, ui + ' ' + width + ' chat target ' + button);
    }
    await page.goto(base + 'learn-life-story.html?s=first-day&lang=' + ui);
    await page.locator('.ls-hero').waitFor();
    await audit('life', page.locator('body'));
    assert.deepEqual(errors, [], ui + ' ' + width + ' runtime errors');
   } finally {
    await context.close();
   }
  }
  console.log('PASS: ' + rows.length + ' screen / width / locale combinations, Lexi touch targets and RTL');
 } finally {
  if (process.env.TEST037_AUDIT) fs.writeFileSync(process.env.TEST037_AUDIT, JSON.stringify(rows, null, 2));
  if (browser) await browser.close();
  server.close();
 }
}

main().catch(error => { console.error(error); process.exitCode = 1; });
