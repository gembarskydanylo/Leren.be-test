// TEST-023: UI-driven lessons and review at eight viewport widths. Chromium is required.
const assert=require('node:assert/strict'),fs=require('fs'),path=require('path'),http=require('http'),{chromium}=require('playwright');
const root=path.resolve(__dirname,'..'),out=process.env.SHOTS||null;
if(out)fs.mkdirSync(out,{recursive:true});
const types={'.html':'text/html','.js':'text/javascript','.mjs':'text/javascript','.css':'text/css','.json':'application/json','.webp':'image/webp','.png':'image/png','.svg':'image/svg+xml','.woff':'font/woff','.m4a':'audio/mp4','.mp3':'audio/mpeg','.webmanifest':'application/manifest+json'};
const server=http.createServer((q,r)=>{let f=path.join(root,new URL(q.url,'http://x').pathname);if(fs.existsSync(f)&&fs.statSync(f).isDirectory())f=path.join(f,'index.html');if(!fs.existsSync(f)){r.statusCode=404;return r.end()}r.setHeader('Content-Type',types[path.extname(f)]||'application/octet-stream');fs.createReadStream(f).pipe(r)});
(async()=>{await new Promise(r=>server.listen(0,'127.0.0.1',r));const B='http://127.0.0.1:'+server.address().port+'/app/';const browser=await chromium.launch();const rows=[];
for(const w of [320,360,390,430,768,1024,1280,1440]){
 const ctx=await browser.newContext({viewport:{width:w,height:900},serviceWorkers:'block'}),page=await ctx.newPage(),errors=[];page.on('pageerror',e=>errors.push(e.message));await ctx.route(/^https?:\/\/(?!127\.0\.0\.1)/,r=>r.abort());
 const audit=async(state)=>{const data=await page.evaluate(()=>({overflow:document.documentElement.scrollWidth>innerWidth,offenders:[...document.querySelectorAll('body *')].filter(e=>{const r=e.getBoundingClientRect();return r.width&&r.right>innerWidth+2&&getComputedStyle(e).position!=='fixed'}).slice(0,6).map(e=>e.tagName+'.'+e.className),small:[...document.querySelectorAll('button,a,summary,select')].filter(e=>{const r=e.getBoundingClientRect();return r.width&&r.height&&r.height<40}).slice(0,10).map(e=>[e.textContent.trim().slice(0,30),Math.round(e.getBoundingClientRect().height)])}));rows.push({w,state,...data,errors:[...errors]});assert.equal(data.overflow,false,w+' '+state+': horizontal overflow');assert.deepEqual(errors,[],w+' '+state+': JS errors');if(out)await page.screenshot({path:out+`/${w}-${state}.png`,fullPage:true});};
 await page.goto(B);await page.waitForSelector('.onb-panel');await audit('onboarding');await page.click('.onb-next');await page.click('[data-choice="zero"]');await page.waitForSelector('.lp-exercise');await audit('study');
 // Complete the real lesson by UI. Read the expected word, but submit via visible buttons.
 let wrong=false,guard=0;
 while(guard++<65){
  if(await page.locator('.lp-result').count())break;
  const st=await page.evaluate(()=>({s:learningPath.model.state.session,w:learningPath.model.current()}));
  if(await page.locator('.lp-feedback').count()){await page.locator('#learningPath .lp-primary').last().click();continue}
  if(st.s.index===st.s.ids.length){await page.locator('#learningPath .lp-primary').last().click();continue}
  if(st.s.phase===0){await page.locator('.fh-study-actions button').click();continue}
  const expected=st.s.phase===1?st.w.uk:st.w.nl,opts=page.locator('.lp-options button');const texts=await opts.allTextContents();let idx=texts.indexOf(expected);
  if(!wrong&&st.s.phase===2){idx=texts.findIndex(t=>t!==expected);wrong=true}
  await opts.nth(idx).click();
 }
 await page.waitForSelector('.lp-result');await audit('lesson-result');
 const saved=await page.evaluate(()=>({xp:localStorage.getItem('poly_score'),done:Object.keys(learningPath.model.state.completed).length}));rows.push({w,state:'earned',...saved});
 // Review the deliberate error using the button shown to the learner.
 const review=page.locator('#learningPath button').filter({hasText:/Повторити мої помилки/});
 assert.equal(await review.count(),1,'the intentional mistake has a review action');
 await review.click();await audit('review');
 for(let i=0;i<15;i++){if(await page.locator('.lp-result').count())break;if(await page.locator('.lp-feedback').count()){await page.locator('#learningPath .lp-primary').last().click();continue}const answer=await page.evaluate(()=>learningPath.model.current().nl);await page.locator('.lp-options button').filter({hasText:new RegExp('^'+answer.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')+'$')}).click()}
 await page.waitForSelector('.lp-result');assert.equal(await page.evaluate(()=>learningPath.model.mistakes().length),0,'review clears the mistake');await page.locator('.fh-back').click();
 await page.waitForSelector('.hv');await audit('home');
 assert.equal(saved.done,1,'exactly one lesson completed');assert(+saved.xp>0,'lesson awarded XP');
 const bounds=await page.locator('.fh-more-tile').evaluateAll(es=>es.map(e=>{const b=e.getBoundingClientRect();return [...e.querySelectorAll('strong,small')].every(t=>{const r=document.createRange();r.selectNodeContents(t);return [...r.getClientRects()].every(x=>x.left>=b.left&&x.right<=b.right)})}));assert(bounds.every(Boolean),w+': shortcut text fits its own button');
 const brand=await page.locator('main>header .brand').boundingBox();if(w<=360)assert(brand.width>=32,w+': header logo must not shrink away');
 for(const selector of ['#settingsBtn','#streakPill']){const b=await page.locator(selector).boundingBox();assert(b.width>=44&&b.height>=44,w+': header touch target '+selector)}
 await page.locator('.hv-route summary').click();await audit('map');await page.locator('.hv-stop-button').first().click();await audit('chapter');await page.locator('.fh-back').click();await page.locator('.fh-back').click();
 await page.reload();await page.waitForSelector('.hv');assert.equal(await page.locator('.onb-panel').count(),0,'onboarding does not return');assert.equal(await page.evaluate(()=>localStorage.getItem('poly_score')),saved.xp,'reload keeps XP');rows.push({w,state:'reload',onboarding:await page.locator('.onb-panel').count(),saved:await page.evaluate(()=>({xp:localStorage.getItem('poly_score'),done:Object.keys(learningPath.model.state.completed).length}))});
 if(w===390){
 await page.locator('#settingsBtn').focus();await page.keyboard.press('Enter');await page.waitForSelector('#settingsSheet:not([hidden])');await page.keyboard.press('Escape');assert.equal(await page.locator('#settingsSheet').evaluate(e=>e.hidden),true,'settings closes by keyboard');
 await page.evaluate(()=>{const m=learningPath.model,c=LerenLearningPath.catalog(DATA,LerenCurriculum);m.state.completed[c.lessons[1].id]=c.lessons[1].ids.length;m.save();learningPath.home()});
 assert.equal(await page.evaluate(()=>learningPath.model.courseStats('A1.1').done),2,'two finished lessons');assert.equal(await page.locator('.hv-route details').evaluate(e=>e.open),false,'two lessons still calm home');assert.equal(await page.evaluate(()=>localStorage.getItem('poly_score')),saved.xp,'map fixture does not touch XP');
 const select=page.locator('main>header select');if(await select.count()){await select.selectOption('en');await page.reload();await page.waitForSelector('.hv');assert.equal(await select.inputValue(),'en','explanation language persists');}
}
 for(const f of fs.readdirSync(root+'/app/guides').filter(f=>f.endsWith('.html'))){await page.goto(B+'guides/'+f);assert.equal(await page.locator('meta[name=robots]').getAttribute('content'),'noindex,nofollow');await audit('guide-'+f.replace('.html',''));const summary=page.locator('details summary');if(await summary.count()){await summary.click();if(!await page.locator('details').evaluate(e=>e.open))throw Error('exercise not open')}}
 await page.goto(B+'learn-life-story.html?s=first-day');await page.waitForSelector('.ls-hero');await audit('life-home');await page.locator('.ls-hero .ls-primary').click();await page.waitForSelector('.ls-stage-say');await audit('life-scene');await ctx.close();
 if(out)fs.writeFileSync(out+'/probe.json',JSON.stringify(rows,null,2));console.log(w,'complete');
}
await browser.close();server.close();console.log('PASS: UI-driven first lesson, wrong answer and review, XP, reload, map/back, 4 guides and LIFE at 8 widths');})().catch(e=>{console.error(e);process.exit(1)});
