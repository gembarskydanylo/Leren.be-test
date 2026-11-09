// TEST-013 · LerenBe LIFE visual system (life/ snapshot of production LIFE + visuals). Checks:
// visual-manifest.json is valid and covers every scene of the stories (null = art not delivered yet), paths are
// safe (only assets/lerenbe-life/, web image formats, never reference/), files named in the manifest exist,
// reference sheets are not used by the app; visuals.mjs falls back cleanly and never swaps full figure ↔ portrait;
// in a phone and a desktop browser the story shows a placeholder stage without art and the artist's pictures
// (served from existing test images) when the manifest names them, while the story itself still works.
// Run: node tests/life-visuals.cjs (browser part skipped without Playwright).
const fs=require('node:fs'),path=require('node:path'),http=require('node:http'),assert=require('node:assert/strict');
const root=path.join(__dirname,'..','life');
(async()=>{
 const V=await import(path.join(root,'modules/learn-life/visuals.mjs'));
 const {firstDay}=await import(path.join(root,'modules/learn-life/stories/first-day.mjs'));
 const M=JSON.parse(fs.readFileSync(path.join(root,'assets/lerenbe-life/visual-manifest.json'),'utf8'));
 // manifest
 assert.equal(M.version,1);for(const id of ['first-day','supermarket','commune','fence','doctor'])assert(M.stories[id],'story '+id);
 for(const id of ['annick','jan','peter'])assert(M.characters[id],'character '+id);
 const problems=V.validateManifest(M,{'first-day':firstDay.scenes.map(s=>s.id),supermarket:['list','shelves','help','counter','till','home']});
 assert.deepEqual(problems,[],problems.join('\n'));
 for(const p of V.manifestPaths(M))assert(fs.existsSync(path.join(root,p)),'file named in the manifest exists: '+p);
 assert.equal(V.manifestPaths(M).length,0,'no art delivered yet: every slot is null');
 for(const d of ['reference','characters/annick','characters/jan','characters/peter','stories/first-day','stories/supermarket','stories/commune','stories/fence','stories/doctor','backgrounds','ui'])assert(fs.statSync(path.join(root,'assets/lerenbe-life',d)).isDirectory(),d);
 const appText=['learn-life-story.html','modules/learn-life/story-ui.mjs','modules/learn-life/visuals.mjs','modules/learn-life/story.css'].map(f=>fs.readFileSync(path.join(root,f),'utf8')).join('\n');
 assert(!/reference\/[\w-]+\.(webp|png|jpe?g)/i.test(appText),'the app never loads reference sheets');
 // safe paths
 for(const p of ['assets/lerenbe-life/stories/first-day/station.webp','assets/lerenbe-life/characters/annick/portrait-happy.png'])assert.equal(V.safePath(p),p);
 for(const p of ['assets/lerenbe-life/../app.js','https://evil.example/x.webp','/assets/lerenbe-life/a.webp','assets/lerenbe-life/reference/visual-style-and-cast.webp','assets/lerenbe-life/a.svg','assets/other/a.webp','javascript:alert(1)',null,42])assert.equal(V.safePath(p),null,String(p));
 // fallbacks and resolution
 assert.deepEqual(V.sceneVisual(M,'first-day','station'),{background:null,characters:[],alt:M.stories['first-day'].scenes.station.alt});
 assert.equal(V.storyCover(M,'first-day'),null);assert.equal(V.characterImage(M,'annick'),null);
 const F=JSON.parse(JSON.stringify(M)),A='assets/lerenbe-life/';
 F.stories['first-day'].cover={mobile:A+'stories/first-day/cover-mobile.webp',desktop:A+'stories/first-day/cover-desktop.webp',alt:'cover'};
 F.stories['first-day'].scenes.station.background={mobile:A+'stories/first-day/station-mobile.webp',desktop:null};
 F.characters.annick.full.neutral=A+'characters/annick/full-neutral.webp';F.characters.annick.full.happy=A+'characters/annick/full-happy.webp';F.characters.annick.portrait.neutral=A+'characters/annick/portrait-neutral.webp';
 const sv=V.sceneVisual(F,'first-day','station',{who:'annick',emotion:'happy'});
 assert.deepEqual(sv.background,{mobile:A+'stories/first-day/station-mobile.webp',desktop:A+'stories/first-day/station-mobile.webp'},'one size serves both');
 assert.equal(sv.characters[0].src,A+'characters/annick/full-happy.webp');assert.equal(V.sceneVisual(F,'first-day','station',{who:'annick',emotion:'surprised'}).characters[0].src,A+'characters/annick/full-neutral.webp','unknown emotion → neutral');
 assert.equal(V.characterImage(F,'annick',{pose:'portrait',emotion:'happy'}),A+'characters/annick/portrait-neutral.webp');
 F.characters.annick.portrait.neutral=null;assert.equal(V.characterImage(F,'annick',{pose:'portrait'}),null,'a full figure never stands in for a portrait');
 assert.equal(V.sceneVisual(F,'first-day','no-such').background,null);assert.deepEqual(await V.loadVisuals(async()=>({ok:false})),V.empty());assert.deepEqual(await V.loadVisuals(async()=>{throw Error('offline')}),V.empty());
 console.log('PASS: LIFE visual manifest — 5 stories, 3 characters × 2 poses × 4 emotions, '+firstDay.scenes.length+' first-day scenes covered, safe paths, clean fallbacks');
 // ---- browser
 let chromium;try{({chromium}=require('playwright'))}catch{console.log('SKIP: browser part (Playwright is not installed)');return}
 const types={'.html':'text/html','.mjs':'text/javascript','.js':'text/javascript','.css':'text/css','.json':'application/json','.png':'image/png','.webp':'image/webp','.m4a':'audio/mp4'};
 const server=http.createServer((req,res)=>{let f=path.join(root,decodeURIComponent(new URL(req.url,'http://x').pathname));if(!f.startsWith(root)||!fs.existsSync(f)||fs.statSync(f).isDirectory()){res.statusCode=404;return res.end()}res.setHeader('content-type',types[path.extname(f)]||'application/octet-stream');fs.createReadStream(f).pipe(res)});
 await new Promise(r=>server.listen(0,'127.0.0.1',r));const base='http://127.0.0.1:'+server.address().port+'/';
 let browser;try{browser=await chromium.launch()}catch{console.log('SKIP: no Chromium');server.close();return}
 const art=fs.readFileSync(path.join(root,'assets/lerenbe-life/reference/visual-style-and-cast.webp')); // test stand-in for delivered art
 const report=[];
 try{for(const [w,h] of [[390,844],[1280,800]]){
  for(const withArt of [false,true]){
   const ctx=await browser.newContext({viewport:{width:w,height:h},serviceWorkers:'block'}),page=await ctx.newPage(),errors=[];page.on('pageerror',e=>errors.push(e.message));
   await ctx.route(/^https?:\/\/(?!127\.0\.0\.1)/,r=>r.abort());
   if(withArt){await ctx.route('**/assets/lerenbe-life/visual-manifest.json',r=>r.fulfill({status:200,contentType:'application/json',body:JSON.stringify((()=>{const G=JSON.parse(JSON.stringify(F));G.characters.annick.portrait.neutral=A+'characters/annick/portrait-neutral.webp';return G})())}));
    await ctx.route(/\/assets\/lerenbe-life\/(stories|characters)\/.*\.webp$/,r=>r.fulfill({status:200,contentType:'image/webp',body:art}))}
   await page.goto(base+'learn-life-story.html?s=first-day');await page.waitForSelector('.ls-hero h1');await page.waitForTimeout(300);
   assert.equal(await page.locator('.ls-cover img').count(),withArt?1:0,'cover only when delivered');
   await page.click('.ls-hero .ls-primary');await page.waitForSelector('.ls-stage .ls-stage-say');
   if(withArt){assert.equal(await page.locator('.ls-stage-bg img').getAttribute('alt'),F.stories['first-day'].scenes.station.alt);assert.equal(await page.locator('.ls-stage-bg source').getAttribute('media'),'(min-width: 768px)');
    assert.equal(await page.locator('.ls-stage-char[data-character="annick"]').getAttribute('data-emotion'),F.stories['first-day'].scenes.station.characters[0].emotion,'the scene\'s default emotion');assert(await page.locator('.ls-log .ls-avatar').count(),'portrait next to the line');
    assert(await page.evaluate(()=>document.querySelector('.ls-stage-bg img').naturalWidth>0),'the picture loads')}
   else{assert.equal(await page.locator('.ls-stage-ph').getAttribute('aria-label'),F.stories['first-day'].scenes.station.alt,'placeholder carries the alt text');assert.equal(await page.locator('.ls-stage img').count(),0)}
   assert.match(await page.locator('.ls-stage-say .ls-nl').textContent(),/Ben jij Olena/);assert.equal(await page.locator('.ls-stage-repeat').count(),1);assert(await page.locator('.ls-progress').count());
   // the story still works: answer the first reply, progress moves
   await page.locator('.ls-panel .ls-primary').click();const before=await page.locator('.ls-progress-fill').evaluate(e=>e.style.width);
   await page.click('.ls-option[data-option="0"]');await page.waitForTimeout(900);
   assert.notEqual(await page.locator('.ls-progress-fill').evaluate(e=>e.style.width),before,'progress bar moves');
   if(withArt)assert.equal(await page.locator('.ls-stage-char.is-speaking').count(),1,'the speaking character stays on stage');
   assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),'no horizontal scroll at '+w);
   if(process.env.SHOTS)await page.screenshot({path:path.join(process.env.SHOTS,`life-visual-${w}-${withArt?'art':'none'}.png`)});
   await page.locator('.ls-back-scene').click();assert.equal(await page.locator('.ls-hero').count(),1,'back to the story home');
   assert.deepEqual(errors,[]);await ctx.close();report.push(w+'px '+(withArt?'with art':'placeholder'))}}
  console.log('PASS: LIFE visual stage — '+report.join(', ')+': alt texts, mobile/desktop sources, emotions, portrait, repeat button, progress, back, no horizontal scroll');
 }finally{await browser.close();server.close()}
})().catch(e=>{console.error(e);process.exit(1)});
