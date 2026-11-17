// TEST-025: connected screens, contrast, viewport safety and preserved learning state.
// Requires Playwright/Chromium. SHOTS saves full-page browser-emulation evidence.
const fs = require('node:fs'), path = require('node:path'), http = require('node:http');
const assert = require('node:assert/strict'), {chromium} = require('playwright');
const repo = path.resolve(__dirname, '..'), read = f => fs.readFileSync(path.join(repo, f), 'utf8');
const files = ['tokens', 'foundation', 'home', 'learning', 'engagement', 'life', 'guides'];
const html = read('app/index.html'), sw = read('app/sw.js');
for (const name of files) {
 assert(sw.includes('./modules/design-system/' + name + '.css?v=1'), name + ' cached');
 assert(!/url\(https?:/.test(read('app/modules/design-system/' + name + '.css')), 'no remote dependency');
}
for (const name of ['tokens', 'foundation', 'home', 'learning', 'engagement']) assert(html.includes('design-system/' + name + '.css?v=1'));
for (const file of fs.readdirSync(path.join(repo, 'app/guides')).filter(f => f.endsWith('.html'))) {
 const s = read('app/guides/' + file); assert(s.includes('noindex,nofollow')); assert(s.includes('design-system/tokens.css?v=1') && s.includes('design-system/guides.css?v=1'));
}
assert.equal(sw.match(/leren-be-v(\d+)/)[1], read('app/app.js').match(/RELEASE_VERSION="(\d+)"/)[1]);
console.log('PASS design foundation: shared styles, offline references, no remote assets, robots and release');
const types = {'.html':'text/html','.js':'text/javascript','.mjs':'text/javascript','.css':'text/css','.json':'application/json','.webp':'image/webp','.png':'image/png','.svg':'image/svg+xml','.woff':'font/woff','.m4a':'audio/mp4','.webmanifest':'application/manifest+json'};
const server = http.createServer((req, res) => {
 let f = path.join(repo, decodeURIComponent(new URL(req.url, 'http://x').pathname));
 if (!f.startsWith(repo + path.sep)) {res.statusCode = 403; return res.end()}
 if (fs.existsSync(f) && fs.statSync(f).isDirectory()) f = path.join(f, 'index.html');
 if (!fs.existsSync(f)) {res.statusCode = 404; return res.end()}
 res.setHeader('content-type', types[path.extname(f)] || 'application/octet-stream'); fs.createReadStream(f).pipe(res);
});
(async () => {
 await new Promise(r => server.listen(0, '127.0.0.1', r));
 const B = 'http://127.0.0.1:' + server.address().port + '/app/', browser = await chromium.launch();
 const shotDir = process.env.SHOTS; if (shotDir) fs.mkdirSync(shotDir, {recursive:true});
 let states = 0;
 try {
  for (const width of [320,360,390,430,768,1024,1280,1440]) {
   const ctx = await browser.newContext({viewport:{width,height:900},serviceWorkers:'block'}), page = await ctx.newPage(), errors = [];
   page.on('pageerror', e => errors.push(e.message)); await ctx.route(/^https?:\/\/(?!127\.0\.0\.1)/, r => r.abort());
   async function check(name) {
    const info = await page.evaluate(() => {
     const nav = document.querySelector('#modeButtons'), r = nav?.getBoundingClientRect();
     return {overflow:document.documentElement.scrollWidth > innerWidth,nav:r && {left:r.left,right:r.right,bottom:r.bottom},
      small:[...document.querySelectorAll('button')].filter(b => {const r=b.getBoundingClientRect();return r.width && r.height && (r.width<43.5 || r.height<43.5)}).map(b => b.id || b.className)};
    });
    assert.equal(info.overflow, false, width+' '+name+': overflow'); assert.deepEqual(errors,[],name+': JS errors');
    if (info.nav) assert(info.nav.left>=0 && info.nav.right<=width && info.nav.bottom<=900, width+' '+name+': dock visible');
    assert.deepEqual(info.small,[],width+' '+name+': 44px buttons');
    if (shotDir) await page.screenshot({path:path.join(shotDir,width+'-'+name+'.png'),fullPage:true}); states++;
   }
   await page.goto(B); await page.waitForSelector('.onb-panel'); await check('onboarding');
   await page.locator('.onb-next').click(); await page.locator('[data-choice="zero"]').click(); await page.waitForSelector('.lp-exercise'); await check('study');
   // Actual first lesson: UI answers; no completed progress or XP is injected.
   let wrong = false;
   for (let n=0;n<70 && !await page.locator('.lp-result').count();n++) {
    if (await page.locator('.lp-feedback').count()) {await page.locator('#learningPath .lp-primary').last().click();continue}
    const x = await page.evaluate(() => ({s:learningPath.model.state.session,w:learningPath.model.current()}));
    if (x.s.index===x.s.ids.length) {await page.locator('#learningPath .lp-primary').last().click();continue}
    if (x.s.phase===0) {await page.locator('.fh-study-actions button').click();continue}
    const opts = page.locator('.lp-options button'), texts = await opts.allTextContents(), target = x.s.phase===1?x.w.uk:x.w.nl;
    let i = texts.indexOf(target); if (!wrong && x.s.phase===2) {i=texts.findIndex(t=>t!==target);wrong=true}
    if (x.s.index===0) await check(x.s.phase===1?'audio':'quiz');
    await opts.nth(i).click();
   }
   await page.waitForSelector('.lp-result'); await check('result');
   const saved = await page.evaluate(() => ({xp:localStorage.getItem('poly_score'),done:Object.keys(learningPath.model.state.completed).length}));
   assert(+saved.xp>0 && saved.done===1,'real result and XP');
   await page.locator('#learningPath button').filter({hasText:'Повторити мої помилки'}).click(); await check('review');
   await page.locator('.fh-back').click(); await page.waitForSelector('.fh-hero'); await check('home');
   await page.locator('.hv-route summary').click(); await check('map');
   await page.locator('.hv-stop-button').first().click(); await check('chapter');
   await page.locator('.fh-back').click(); await page.locator('.fh-back').click();
   await page.reload(); await page.waitForSelector('.fh-hero');
   assert.equal(await page.evaluate(() => localStorage.getItem('poly_score')),saved.xp,'XP reload');
   assert.equal(await page.locator('.onb-panel').count(),0,'no repeated onboarding');
   await page.locator('.hv-pick-btn').click(); await check('courses'); await page.locator('.hv-pick-btn').click();
   await page.evaluate(() => setView('progress')); await check('progress');
   await page.locator('#settingsBtn').focus(); await page.keyboard.press('Enter'); await check('settings'); await page.keyboard.press('Escape');
   if (width===390 || width===1440) {
    await page.evaluate(() => {setView('path');document.documentElement.dataset.theme='dark'}); await check('dark-home');
    await page.evaluate(() => {document.documentElement.dataset.theme='light';document.documentElement.style.fontSize='200%'}); await check('large-text');
    await page.evaluate(() => document.documentElement.style.fontSize='');
    await page.emulateMedia({reducedMotion:'reduce'});
    assert(await page.evaluate(() => parseFloat(getComputedStyle(document.querySelector('#modeButtons button')).transitionDuration)<=.001),'reduced motion');
   }
   // Shared semantic foreground/background pairs must meet AA in both themes.
   for (const theme of ['light','dark']) {
    const ratios = await page.evaluate(theme => {
     document.documentElement.dataset.theme=theme; const s=getComputedStyle(document.documentElement);
     const L = hex => {const c=(hex.trim().length===4?hex.trim().slice(1).split('').map(x=>x+x).join(''):hex.trim().slice(1)).match(/../g).map(x=>parseInt(x,16)/255).map(x=>x<=.04045?x/12.92:((x+.055)/1.055)**2.4);return c[0]*.2126+c[1]*.7152+c[2]*.0722};
     return [['--lb-ink','--lb-surface'],['--lb-muted','--lb-surface'],['--lb-on-brand','--lb-brand'],['--lb-success','--lb-success-soft'],['--lb-danger','--lb-danger-soft']].map(([a,b])=>{const x=L(s.getPropertyValue(a)),y=L(s.getPropertyValue(b));return [a,(Math.max(x,y)+.05)/(Math.min(x,y)+.05)]});
    },theme);
    for(const [name,ratio] of ratios) assert(ratio>=4.5,theme+' '+name+' contrast '+ratio);
    assert(await page.evaluate(()=>{const s=getComputedStyle(document.documentElement);return s.getPropertyValue('--surface').trim()===s.getPropertyValue('--lb-surface').trim()}),'legacy surfaces follow the selected palette');
    if(theme==='dark' && (width===390 || width===1440)) {
     const pair=await page.evaluate(()=>{const t=document.querySelector('.hv-title'),b=document.querySelector('.hv-hero-copy');return [getComputedStyle(t).color,getComputedStyle(b).backgroundColor]});
     const lum=c=>{const x=c.match(/[\d.]+/g).slice(0,3).map(Number).map(v=>v/255).map(v=>v<=.04045?v/12.92:((v+.055)/1.055)**2.4);return .2126*x[0]+.7152*x[1]+.0722*x[2]};
     const a=lum(pair[0]),b=lum(pair[1]);assert((Math.max(a,b)+.05)/(Math.min(a,b)+.05)>=4.5,'actual dark HERO foreground/background contrast');
    }
   }
   for (const f of ['index','niderlandska-dlia-ukraintsiv-belhiia','nt2-dlia-pochatkivtsiv','niderlandska-povsiakdenne-zhyttia','movna-pidhotovka-intehratsiia-belhiia']) {await page.goto(B+'guides/'+f+'.html');await check('guide-'+f)}
   await page.goto(B+'learn-life-story.html?s=first-day');await page.waitForSelector('.ls-hero');await check('life-home');await page.locator('.ls-hero .ls-primary').click();await page.waitForSelector('.ls-stage');await check('life-scene');
   await page.goto(B+'learn-life.html');await page.waitForSelector('#stageNav button');await check('life-fence');
   const fence=await page.evaluate(()=>{const t=document.querySelector('.ll-hero-copy>p:not(.ll-kicker)'),b=document.querySelector('.ll-hero');return [getComputedStyle(t).color,getComputedStyle(b).backgroundColor]});
   const lumRGB=c=>c.match(/[\d.]+/g).slice(0,3).map(Number).map(v=>v/255).map(v=>v<=.04045?v/12.92:((v+.055)/1.055)**2.4).reduce((a,v,i)=>a+v*[.2126,.7152,.0722][i],0);
   const f1=lumRGB(fence[0]),f2=lumRGB(fence[1]);assert((Math.max(f1,f2)+.05)/(Math.min(f1,f2)+.05)>=4.5,'actual fence hero description contrast');
   await ctx.close();console.log('PASS design browser '+width);
  }
  console.log('PASS '+states+' screen checks; UI lesson/XP/reload, maps, settings, contrast, large text, reduced motion, guides and LIFE');
 } finally {await browser.close();server.close()}
})().catch(e=>{console.error(e);server.close();process.exit(1)});
