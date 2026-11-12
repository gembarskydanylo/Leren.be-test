// Regression: approved but unavailable images must keep the mobile layout and LIFE fallback.
// Uses the actual home component/CSS; no reference collage or learning-engine mock is rendered.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
let chromium;
try {({chromium} = require('playwright'))} catch {console.log('SKIP: home art failure browser check requires Playwright');process.exit(0)}
const root = path.join(__dirname, '../app');
const storyPage = fs.readFileSync(path.join(root, 'learn-life-story.html'), 'utf8');
assert(storyPage.includes('<base href="../life/">'), 'home story uses the existing LIFE asset root');
assert(storyPage.includes('story-ui.mjs?v=4-visual'), 'home story uses the visual renderer');
assert(storyPage.includes('href="../app/"'), 'return to current homepage');
(async () => {
 const browser = await chromium.launch();
 try {
  for (const width of [360, 390, 430, 1280, 1440]) {
   const page = await browser.newPage({viewport: {width, height: 900}});
   let release; const gate = new Promise(resolve => {release = resolve});
   const entry = name => ({alt: 'Anastasia й Annick — ' + name,
    mobile: {status: 'approved', src: 'img/'+name+'-m.webp', width: 1280, height: 800},
    desktop: {status: 'approved', src: 'img/'+name+'-d.webp', width: 1920, height: 1080}});
   await page.route('http://home.test/**', async route => {
    const url = new URL(route.request().url());
    if (url.pathname.endsWith('home-visuals.json')) return route.fulfill({json: {hero: entry('hero'), lifePromo: entry('life')}});
    if (url.pathname.endsWith('.webp')) {await gate; return route.fulfill({status: 404, body: ''})}
    return route.fulfill({contentType: 'text/html', body: '<!doctype html><meta charset="utf-8"><main></main>'});
   });
   await page.goto('http://home.test/', {waitUntil: 'domcontentloaded'});
   await page.addStyleTag({content: fs.readFileSync(path.join(root,'modules/home-v2/style.css'),'utf8')});
   await page.addScriptTag({content: fs.readFileSync(path.join(root,'modules/home-v2/ui.js'),'utf8')});
   await page.evaluate(async () => {await LerenHomeV2.ready();document.querySelector('main').append(LerenHomeV2.top({lang:'uk', levels:[],stats:{}}))});
   const boxes = () => page.locator('.hv-hero, .hv-hero-copy, .hv-life-art').evaluateAll(nodes => nodes.map(n => {const b=n.getBoundingClientRect();return [b.x,b.y,b.width,b.height]}));
   const before = await boxes(); release();
   await page.waitForFunction(() => document.querySelectorAll('picture[data-state="failed"]').length === 2);
   assert.deepEqual(await boxes(), before, 'failed resources must not move content at '+width);
   assert.equal(await page.locator('.hv-life-pic .hv-life-icon').count(), 1);
   for (const pic of await page.locator('picture').all()) {
    assert.equal(await pic.getAttribute('role'), 'img');
    assert.match(await pic.getAttribute('aria-label'), /Anastasia/);
    assert.equal(await pic.locator('img').evaluate(n => getComputedStyle(n).visibility), 'hidden');
   }
   assert(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth));
   await page.close();
  }
  console.log('PASS: approved-image 404 fallback, accessible description and unchanged geometry at 360/390/430/1280/1440');
 } finally {await browser.close()}
})().catch(e => {console.error(e);process.exitCode=1});
