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
 assert.equal(M.version,2);for(const id of ['first-day','supermarket','commune','fence','doctor'])assert(M.stories[id],'story '+id);
 for(const id of ['annick','jan','peter'])assert(M.characters[id],'character '+id);
 const problems=V.validateManifest(M,{'first-day':firstDay.scenes.map(s=>s.id),supermarket:['list','shelves','help','counter','till','home']});
 assert.deepEqual(problems,[],problems.join('\n'));
 for(const p of V.manifestPaths(M))assert(fs.existsSync(path.join(root,p)),'file named in the manifest exists: '+p);
 assert.equal(V.manifestPaths(M).length,0,'no art delivered yet: every slot is null');
 for(const d of ['reference','characters/anastasia','characters/annick','characters/jan','characters/peter','characters/sofie','characters/van-den-berg','characters/hero-male','stories/first-day','stories/supermarket','stories/commune','stories/fence','stories/doctor','backgrounds','ui'])assert(fs.statSync(path.join(root,'assets/lerenbe-life',d)).isDirectory(),d);
 const appText=['learn-life-story.html','modules/learn-life/story-ui.mjs','modules/learn-life/visuals.mjs','modules/learn-life/story.css'].map(f=>fs.readFileSync(path.join(root,f),'utf8')).join('\n');
 assert(!/reference\/[\w-]+\.(webp|png|jpe?g)/i.test(appText),'the app never loads reference sheets');
 // safe paths
 for(const p of ['assets/lerenbe-life/stories/first-day/station.webp','assets/lerenbe-life/characters/annick/portrait-happy.png'])assert.equal(V.safePath(p),p);
 for(const p of ['assets/lerenbe-life/../app.js','https://evil.example/x.webp','/assets/lerenbe-life/a.webp','assets/lerenbe-life/reference/visual-style-and-cast.webp','assets/lerenbe-life/a.svg','assets/other/a.webp','javascript:alert(1)',null,42])assert.equal(V.safePath(p),null,String(p));
 // fallbacks and resolution
 assert.deepEqual(V.sceneVisual(M,'first-day','station'),{background:null,characters:[],alt:M.stories['first-day'].scenes.station.alt,dialogue:{position:'bottom',reserve:.32}});
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
 // ---- TEST-014: approved cast, Anastasia, scene layers, art request
 const CAST=['anastasia','annick','jan','peter','sofie','van-den-berg','hero-male'];
 assert.deepEqual(Object.keys(M.characters),CAST,'all seven approved characters');
 for(const id of CAST){const c=M.characters[id];assert(c.name&&c.role&&c.appearance&&c.alt,id+': described');
  for(const pose of ['full','portrait'])assert.deepEqual(Object.keys(c[pose]).sort(),['happy','neutral','surprised','thinking'],id+' '+pose+': 4 separate emotion files');
  for(const pose of ['full','portrait'])for(const e of V.EMOTIONS)assert.equal(c[pose][e],null,id+' '+pose+'-'+e+': no art yet');
  assert(fs.statSync(path.join(root,'assets/lerenbe-life/characters',id)).isDirectory(),'folder for '+id)}
 assert.equal(M.protagonist,'anastasia');assert.deepEqual(M.protagonistAlternatives,['hero-male']);assert.equal(M.characters['hero-male'].future,true);
 assert.equal(V.protagonistId(M),'anastasia');assert.equal(V.protagonistId(M,'hero-male'),'hero-male','ready for a future hero choice');assert.equal(V.protagonistId(M,'jan'),'anastasia','only an approved alternative');
 const fdScenes=M.stories['first-day'].scenes;assert.deepEqual(Object.keys(fdScenes),['station','machine','meet','tram','flat','neighbour','tomorrow']);
 for(const [sid,sc] of Object.entries(fdScenes)){assert('mobile' in sc.background&&'desktop' in sc.background,sid+': mobile and desktop background slots');
  assert.equal(sc.backgroundHasCharacters,false,sid+': characters are separate layers');assert.deepEqual(sc.dialogue,{position:'bottom',reserve:.32},sid+': dialogue zone');assert(sc.alt.length>20,sid+': alt');
  assert.deepEqual(sc.characters[0],{id:'anastasia',pose:'full',emotion:'neutral',position:'left',role:'protagonist'},sid+': Anastasia on the left');
  assert.equal(sc.characters.length,2,sid);assert.equal(sc.characters[1].position,'right')}
 assert.equal(fdScenes.neighbour.characters[1].id,'jan','Jan is the neighbour in story 1');assert(!Object.values(fdScenes).some(sc=>sc.characters.some(c=>c.id==='peter')),'Peter does not replace Jan');
 for(const sid of ['station','machine','meet','tram','flat','tomorrow'])assert.equal(fdScenes[sid].characters[1].id,'annick',sid+': Annick');
 assert.deepEqual(Object.keys(firstDay.cast),['annick','jan'],'story cast: Annick and Jan (Anastasia is the learner)');
 // Anastasia replaces Olena in every user-facing text; ids that hold progress are unchanged
 const storyText=fs.readFileSync(path.join(root,'modules/learn-life/stories/first-day.mjs'),'utf8'),man=fs.readFileSync(path.join(root,'assets/lerenbe-life/visual-manifest.json'),'utf8'),artReq=fs.readFileSync(path.join(root,'assets/lerenbe-life/ART_REQUEST.md'),'utf8');
 assert(!/Olena|Олен/.test(storyText+man),'no Olena in the story or the manifest');assert(/Ben jij Anastasia\?/.test(storyText)&&/Ik ben Anastasia\./.test(storyText));
 assert.deepEqual(firstDay.scenes.map(x=>x.id),['station','machine','meet','tram','flat','neighbour','tomorrow'],'scene ids (progress keys) unchanged');
 const tsv=fs.readFileSync(path.join(root,'audio/nl/life-texts.tsv'),'utf8');assert(!/Olena/.test(tsv));
 for(const d of ['nl','nl-f']){const am=JSON.parse(fs.readFileSync(path.join(root,'audio',d,'manifest.json'),'utf8'));for(const h of ['a72139ae','3254f3d9'])assert(am.includes(h)&&fs.existsSync(path.join(root,'audio',d,h+'.m4a')),d+': Anastasia lines recorded')}
 {const E=await import(path.join(root,'modules/learn-life/story-engine.mjs'));const mm=new Map(),st={getItem:k=>mm.get(k)??null,setItem:(k,v)=>mm.set(k,v)};
  st.setItem('leren_life_story_v1_first-day',JSON.stringify({best:{station:3},missed:['Hallo! Ben jij Olena?','Waar is de sleutel?','de sleutel']}));
  const ss=E.createStorySession(firstDay,st);assert.deepEqual([...ss.state.missed],['de sleutel'],'old Olena line leaves the review list; progress kept');assert.equal(ss.state.best.station,3)}
 // Engine 2.0 still intact after the rename: a full play of both ticket paths gives full XP, records and memory
 {const E=await import(path.join(root,'modules/learn-life/story-engine.mjs'));
  for(const ticket of ['had','buy']){const mm=new Map(),st={getItem:k=>mm.get(k)??null,setItem:(k,v)=>mm.set(k,v)},ss=E.createStorySession(firstDay,st);
   for(const sc of firstDay.scenes){if(!ss.visibleScenes().includes(sc))continue;const r=ss.play(sc.id);let g=0;
    while(!r.finished&&g++<99){const x=r.step;if(x.type==='line')r.next();else if(x.type==='reply'){let i=x.options.findIndex(o=>o.set?.ticket===ticket);if(i<0)i=x.options.findIndex(o=>o.ok);r.answer(i)}else if(x.type==='listen')r.answer(x.answer);else if(x.type==='find')x.ask.forEach(a=>r.answer(a));else r.answer([x.nl])}
    const f=r.finish();assert.equal(f.correct,f.total,ticket+'/'+sc.id);E.recordXp(st,firstDay.id,sc.id,f.xp)}
   assert.equal(ss.xp(),ss.maxXp(),ticket+': full XP');assert.equal(ss.visibleScenes().some(x=>x.id==='machine'),ticket==='buy');
   assert.deepEqual({...E.readMemory(st).met},{annick:true,jan:true});assert(JSON.parse(mm.get(E.XP_KEY))['first-day:station']>0)}}
 // supermarket conflict documented, not replaced
 assert.match(M.stories.supermarket.castConflicts,/Tom/);assert.match(M.stories.supermarket.castConflicts,/Lien/);assert.match(M.stories.supermarket.castConflicts,/Sofie/);
 assert(!M.stories.supermarket.scenes.till.characters.some(c=>c.id==='sofie'),'Sofie not put in automatically');
 // art request: every first-queue file, all characters, sizes
 for(const id of CAST){assert(artReq.includes('`'+id+'`'),'ART_REQUEST: '+id);}
 const want=[];for(const id of ['anastasia','annick','jan'])for(const pose of ['full','portrait'])for(const e of V.EMOTIONS)want.push(`assets/lerenbe-life/characters/${id}/${pose}-${e}.webp`);
 for(const sid of Object.keys(fdScenes))for(const v of ['desktop','mobile'])want.push(`assets/lerenbe-life/stories/first-day/${sid}-${v}.webp`);want.push('assets/lerenbe-life/stories/first-day/cover-desktop.webp','assets/lerenbe-life/stories/first-day/cover-mobile.webp');
 for(const w of want){assert(artReq.includes(w),'ART_REQUEST lists '+w);assert(V.safePath(w),'safe '+w)}assert.equal(want.length,40);
 for(const sz of ['1920×1320','1200×900','1600 px','512×512','1600×900','1080×1080','WebP'])assert(artReq.includes(sz),'ART_REQUEST: '+sz);
 assert(/Без тексту/.test(artReq)&&/Напівреалістична 2D/.test(artReq)&&/кінематографічне/.test(artReq));
 // hero emotion and protagonist swap
 {const G=JSON.parse(JSON.stringify(M));for(const e of V.EMOTIONS){G.characters.anastasia.full[e]=`assets/lerenbe-life/characters/anastasia/full-${e}.webp`;G.characters['hero-male'].full[e]=`assets/lerenbe-life/characters/hero-male/full-${e}.webp`}
  assert.equal(V.sceneVisual(G,'first-day','flat',{heroEmotion:'thinking'}).characters[0].src,'assets/lerenbe-life/characters/anastasia/full-thinking.webp');
  assert.equal(V.sceneVisual(G,'first-day','flat',{heroEmotion:'happy',hero:'hero-male'}).characters[0].src,'assets/lerenbe-life/characters/hero-male/full-happy.webp');
  assert.deepEqual(V.validateManifest(G,{'first-day':firstDay.scenes.map(x=>x.id)}),[]);
  const bad=JSON.parse(JSON.stringify(M));bad.stories['first-day'].scenes.tram.backgroundHasCharacters=true;bad.stories['first-day'].scenes.flat.dialogue.reserve=.9;
  assert.equal(V.validateManifest(bad,{}).length,2,'validator catches characters baked into a background and a too large dialogue zone')}
 console.log('PASS: TEST-014 cast — 7 characters × 8 separate emotion files, Anastasia as protagonist (hero-male ready, unused), Jan the neighbour, 7 first-day scenes with mobile/desktop backgrounds, layers, dialogue zone and alt, Olena → Anastasia (audio re-recorded, progress kept), supermarket conflict documented, ART_REQUEST complete (40 first-queue files)');
 console.log('PASS: LIFE visual manifest — 5 stories, '+CAST.length+' characters × 2 poses × 4 emotions, '+firstDay.scenes.length+' first-day scenes covered, safe paths, clean fallbacks');
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
   if(withArt){await ctx.route('**/assets/lerenbe-life/visual-manifest.json',r=>r.fulfill({status:200,contentType:'application/json',body:JSON.stringify((()=>{const G=JSON.parse(JSON.stringify(F));G.characters.annick.portrait.neutral=A+'characters/annick/portrait-neutral.webp';for(const e of ['neutral','happy','thinking','surprised'])G.characters.anastasia.full[e]=A+'characters/anastasia/full-'+e+'.webp';return G})())}));
    await ctx.route(/\/assets\/lerenbe-life\/(stories|characters)\/.*\.webp$/,r=>r.fulfill({status:200,contentType:'image/webp',body:art}))}
   await page.goto(base+'learn-life-story.html?s=first-day');await page.waitForSelector('.ls-hero h1');await page.waitForTimeout(300);
   assert.equal(await page.locator('.ls-cover img').count(),withArt?1:0,'cover only when delivered');
   await page.click('.ls-hero .ls-primary');await page.waitForSelector('.ls-stage .ls-stage-say');
   if(withArt){assert.equal(await page.locator('.ls-stage-bg img').getAttribute('alt'),F.stories['first-day'].scenes.station.alt);assert.equal(await page.locator('.ls-stage-bg source').getAttribute('media'),'(min-width: 768px)');
    assert.equal(await page.locator('.ls-stage-char[data-character="annick"]').getAttribute('data-emotion'),F.stories['first-day'].scenes.station.characters.find(c=>c.id==='annick').emotion,'the scene\'s default emotion');assert(await page.locator('.ls-log .ls-avatar').count(),'portrait next to the line');
    assert(await page.evaluate(()=>document.querySelector('.ls-stage-bg img').naturalWidth>0),'the picture loads')}
   else{assert.equal(await page.locator('.ls-stage-ph').getAttribute('aria-label'),F.stories['first-day'].scenes.station.alt,'placeholder carries the alt text');assert.equal(await page.locator('.ls-stage img').count(),0)}
   assert.match(await page.locator('.ls-stage-say .ls-nl').textContent(),/Ben jij Anastasia/);assert.equal(await page.locator('.ls-stage-repeat').count(),1);assert(await page.locator('.ls-progress').count());
   // the story still works: answer the first reply, progress moves
   await page.locator('.ls-panel .ls-primary').click();const before=await page.locator('.ls-progress-fill').evaluate(e=>e.style.width);
   await page.click('.ls-option[data-option="0"]');await page.waitForTimeout(900);
   assert.notEqual(await page.locator('.ls-progress-fill').evaluate(e=>e.style.width),before,'progress bar moves');
   if(withArt){assert.equal(await page.locator('.ls-stage-char.is-speaking').count(),1,'the speaking character stays on stage');
    assert.equal(await page.locator('.ls-stage-char.is-hero').getAttribute('data-emotion'),'happy','Anastasia is happy after a right answer');assert.equal(await page.locator('.ls-stage-char.is-hero').getAttribute('data-character'),'anastasia')}
   assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),'no horizontal scroll at '+w);
   // characters stay inside the picture and never cover the tasks (answers, buttons)
   const overlap=await page.evaluate(()=>{const st=document.querySelector('.ls-stage').getBoundingClientRect(),hit=(a,b)=>a.left<b.right&&b.left<a.right&&a.top<b.bottom&&b.top<a.bottom;
    const tasks=[...document.querySelectorAll('.ls-panel button,.ls-option,.ls-item')].map(e=>e.getBoundingClientRect()).filter(r=>r.width);
    const chars=[...document.querySelectorAll('.ls-stage-char')].map(e=>e.getBoundingClientRect());
    return {outside:chars.some(c=>c.left<st.left-1||c.right>st.right+1||c.top<st.top-1||c.bottom>st.bottom+1),cover:chars.some(c=>tasks.some(t=>hit(c,t))),stageOverTasks:tasks.some(t=>hit(st,t))}});
   assert.deepEqual(overlap,{outside:false,cover:false,stageOverTasks:false},'layout at '+w);
   if(process.env.SHOTS)await page.screenshot({path:path.join(process.env.SHOTS,`life-visual-${w}-${withArt?'art':'none'}.png`)});
   await page.locator('.ls-back-scene').click();assert.equal(await page.locator('.ls-hero').count(),1,'back to the story home');
   assert.deepEqual(errors,[]);await ctx.close();report.push(w+'px '+(withArt?'with art':'placeholder'))}}
  console.log('PASS: LIFE visual stage — '+report.join(', ')+': alt texts, mobile/desktop sources, emotions, portrait, repeat button, progress, back, no horizontal scroll');
 }finally{await browser.close();server.close()}
})().catch(e=>{console.error(e);process.exit(1)});
