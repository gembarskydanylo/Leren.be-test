// TEST-020 Learning. Actual model counters, read-only map, useful static guides.
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict'),http=require('node:http');
const root=path.join(__dirname,'../app');
(async()=>{
 const dir=path.join(root,'guides'),files=fs.readdirSync(dir).filter(f=>f.endsWith('.html')&&f!=='index.html');
 assert.equal(files.length,4);const titles=new Set(),descriptions=new Set(),headings=new Set();
 for(const file of files){const s=fs.readFileSync(path.join(dir,file),'utf8');
  titles.add(s.match(/<title>(.*?)<\/title>/)[1]);descriptions.add(s.match(/name="description" content="([^"]+)"/)[1]);headings.add(s.match(/<h1>(.*?)<\/h1>/)[1]);
  assert.equal((s.match(/<h1>/g)||[]).length,1);assert(s.includes('noindex,nofollow'));
  assert((s.match(/<section/g)||[]).length>=5);assert(s.includes('<details>')&&s.includes('lang="nl"'));
  assert(s.replace(/<[^>]+>/g,' ').split(/\s+/).length>250,'useful content: '+file);
  assert(!/<script|AggregateRating|Review"/.test(s),'no heavy scripts or fabricated reviews');
 }
 assert.equal(titles.size,4);assert.equal(descriptions.size,4);assert.equal(headings.size,4);
 console.log('PASS: four unique static SEO drafts with exercises, Dutch phrases and noindex');
 // Audit regressions (TEST-020 Learning review): one register, correct rules, every phrase translated, links resolve.
 const release=fs.readFileSync(path.join(root,'app.js'),'utf8').match(/RELEASE_VERSION="(\d+)"/)[1];
 const all=[...files,'index.html'];
 for(const file of all){const s=fs.readFileSync(path.join(dir,file),'utf8'),description=s.match(/name="description" content="([^"]+)"/)[1];
  assert(!/[а-яіїєґ’]+(?:уйте|айте|ійте|ніть|іть)(?=[\s,.!?:;]|$)/iu.test(description),file+': description uses «ти» like the text (no «ви» imperative)');
  for(const li of s.match(/<li><strong lang="nl">[\s\S]*?<\/li>/g)||[])assert(/<\/strong><span>[^<]{3,}<\/span><\/li>$/.test(li),file+': phrase without translation: '+li.slice(0,60));
  for(const href of [...s.matchAll(/href="(\.{1,2}\/[^"#?]*)/g)].map(m=>m[1])){let f=path.join(dir,href);if(href.endsWith('/'))f=path.join(f,'index.html');assert(fs.existsSync(f),file+': broken link '+href)}
  if(/Woon je/.test(s))assert(/Woont u/.test(s),file+': the -t rule must say it stays with u');
  assert(!/половину до третьої/.test(s),file+': half drie is «пів на третю»');
  assert(!/<span>Я хотів би/.test(s),file+': translation must fit women too');
  if(file!=='index.html')assert((s.split('<div class="reading">')[1].match(/<p>(?:(?!<\/p>).)*<i lang="nl">/gs)||[]).length>=2,file+': Dutch inside Ukrainian paragraphs is marked lang=nl');
 }
 const index=fs.readFileSync(path.join(dir,'index.html'),'utf8');for(const file of files)assert(index.includes('href="'+file+'"'),'guides index lists '+file);
 console.log('PASS: guides — one register, rules for -t and half, every phrase translated, internal links resolve, index lists all four');
 let chromium;try{({chromium}=require('playwright'))}catch{console.log('SKIP: Playwright not installed');return}
 const types={'.html':'text/html','.js':'text/javascript','.mjs':'text/javascript','.css':'text/css','.json':'application/json','.webp':'image/webp','.png':'image/png','.svg':'image/svg+xml','.woff':'font/woff','.m4a':'audio/mp4'};
 const server=http.createServer((q,r)=>{let f=path.join(root,new URL(q.url,'http://x').pathname);if(fs.existsSync(f)&&fs.statSync(f).isDirectory())f=path.join(f,'index.html');if(!f.startsWith(root)||!fs.existsSync(f)){r.statusCode=404;return r.end()}r.setHeader('content-type',types[path.extname(f)]||'application/octet-stream');fs.createReadStream(f).pipe(r)});
 await new Promise(r=>server.listen(0,'127.0.0.1',r));const base='http://127.0.0.1:'+server.address().port;
 const browser=await chromium.launch();
 try{for(const width of [360,390,430,1280,1440]){
  const context=await browser.newContext({viewport:{width,height:900},serviceWorkers:'block'}),page=await context.newPage(),errors=[];page.on('pageerror',e=>errors.push(e.message));
  await context.route(/^https?:\/\/(?!127\.0\.0\.1)/,r=>r.abort());
  await page.addInitScript(release=>{if(sessionStorage.getItem('seed'))return;sessionStorage.setItem('seed','1');for(const [k,v]of Object.entries({leren_release_seen:JSON.stringify(release),poly_ui:'uk',leren_home_v1:'path',leren_welcome_seen:'true',leren_onboarding_language_v1:'1',leren_start_known_v1:'zero',poly_score:'35'}))localStorage.setItem(k,v)},release);
  await page.goto(base);await page.waitForSelector('.hv-route');
  assert(await page.locator('.hv-route-empty').isVisible());
  // Seed one actual completed lesson; the UI must read it and must never modify it itself.
  await page.evaluate(()=>{const m=learningPath.model,l=m.recommended();m.state.completed[l.id]=l.ids.length;m.state.started=true;m.save()});await page.reload();await page.waitForSelector('.hv-route');
  const before=await page.evaluate(()=>[localStorage.getItem('leren_path_v1'),localStorage.getItem('poly_score')]);
  const rows=await page.locator('.hv-stop').evaluateAll(nodes=>nodes.map(n=>({id:n.dataset.chapter,value:n.querySelector('progress').value,max:n.querySelector('progress').max})));
  const expected=await page.evaluate(ids=>ids.map(id=>learningPath.model.stats(id)),rows.map(r=>r.id));rows.forEach((r,i)=>assert.deepEqual([r.value,r.max],[expected[i].done,expected[i].total]));assert(rows.some(r=>r.value>0));
  assert.equal(await page.locator('[aria-current="step"]').count(),1);assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
  if(process.env.SHOTS&&[390,1440].includes(width)){await page.locator('.hv-route').scrollIntoViewIfNeeded();await page.screenshot({path:path.join(process.env.SHOTS,'map-'+width+'.png')})}
  await page.locator('.hv-route summary').click();await page.locator('.hv-route summary').click();
  // TEST-022 calm home: with fewer than three lessons the topic list starts folded; unfold it before tapping a stop.
  if(!await page.locator('.hv-route details').evaluate(d=>d.open))await page.locator('.hv-route summary').click();
  assert.deepEqual(await page.evaluate(()=>[localStorage.getItem('leren_path_v1'),localStorage.getItem('poly_score')]),before);
  await page.locator('.hv-stop-button').first().click();await page.waitForFunction(()=>document.querySelector('#learningPath')?.dataset.screen==='map');
  for(const file of files){await page.goto(base+'/guides/'+file);assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));await page.locator('summary').click();assert(await page.locator('details p').isVisible());
   if(process.env.SHOTS&&[390,1440].includes(width)&&file===files[0])await page.screenshot({path:path.join(process.env.SHOTS,'guide-'+width+'.png')});
   const broken=await page.locator('a[href^="."]').evaluateAll(a=>a.map(x=>x.href));for(const url of broken){const response=await context.request.get(url);assert.equal(response.status(),200,url)}
  }
  assert.deepEqual(errors,[]);await context.close();
 }
 console.log('PASS: route/model equality, existing progress + XP preserved, chapter action, guides/links and no overflow at five widths');
 }finally{await browser.close();server.close()}
})().catch(e=>{console.error(e);process.exit(1)});
