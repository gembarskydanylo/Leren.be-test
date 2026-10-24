const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const c=vm.createContext({});vm.runInContext(fs.readFileSync('modules/clock/clock.js','utf8')+'\nthis.clock=LerenClock;',c);const clock=c.clock;
const expected=['twee uur','vijf over twee','tien over twee','kwart over twee','tien voor half drie','vijf voor half drie','half drie','vijf over half drie','tien over half drie','kwart voor drie','tien voor drie','vijf voor drie'];
expected.forEach((phrase,i)=>assert.equal(clock.timeInfo(14*60+i*5).phrase,phrase));
for(let t=0;t<1440;t+=5)for(const lang of ['uk','en','fr','ar']){const x=clock.timeInfo(t,lang);assert(x.phrase&&x.hint&&!x.hint.includes('{'));assert.equal(x.total,t);assert.match(x.digital,/^\d\d:\d\d$/)}
assert.equal(clock.timeInfo(23*60+55).phrase,'vijf voor twaalf');assert.equal(clock.timeInfo(1440).digital,'00:00');assert.equal(clock.timeInfo(-5).digital,'23:55');
let raw=23*60+55;raw=clock.dragTime(raw,330,359);assert.equal(clock.timeInfo(raw).digital,'00:00');raw=clock.dragTime(raw,359,1);assert.equal(clock.timeInfo(raw).digital,'00:00');
raw=clock.dragTime(0,0,330);assert.equal(clock.timeInfo(raw).digital,'23:55');
console.log('PASS: all 288 five-minute times in four languages; half-hour phrases; midnight and dragging across 12 in both directions');
