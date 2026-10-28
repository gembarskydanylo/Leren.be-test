const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const c=vm.createContext({});vm.runInContext(fs.readFileSync('modules/clock/clock.js','utf8')+'\nthis.clock=LerenClock;',c);const clock=c.clock;
const expected=['twee uur','vijf over twee','tien over twee','kwart over twee','tien voor half drie','vijf voor half drie','half drie','vijf over half drie','tien over half drie','kwart voor drie','tien voor drie','vijf voor drie'];
expected.forEach((phrase,i)=>assert.equal(clock.timeInfo(14*60+i*5).phrase,phrase));
for(let t=0;t<1440;t+=5)for(const lang of ['uk','en','fr','ar']){const x=clock.timeInfo(t,lang);assert(x.phrase&&x.hint&&!x.hint.includes('{'));assert.equal(x.total,t);assert.match(x.digital,/^\d\d:\d\d$/)}
assert.equal(clock.timeInfo(23*60+55).phrase,'vijf voor twaalf');assert.equal(clock.timeInfo(1440).digital,'00:00');assert.equal(clock.timeInfo(-5).digital,'23:55');
let raw=23*60+55;raw=clock.dragTime(raw,330,359);assert.equal(clock.timeInfo(raw).digital,'00:00');raw=clock.dragTime(raw,359,1);assert.equal(clock.timeInfo(raw).digital,'00:00');
raw=clock.dragTime(0,0,330);assert.equal(clock.timeInfo(raw).digital,'23:55');
const preview=vm.createContext({});vm.runInContext(fs.readFileSync('desktop/modules/clock/clock.js','utf8')+'\nthis.clock=LerenClock;',preview);const previewClock=preview.clock;
let draggedHour=14*60+20,previousHourAngle=70;for(const angle of [100,130,160,190,220,250,280,310,330]){draggedHour=previewClock.dragHourTime(draggedHour,previousHourAngle,angle);previousHourAngle=angle}assert.equal(previewClock.timeInfo(draggedHour).digital,'23:00');
assert.equal(previewClock.timeInfo(previewClock.dragHourTime(23*60,359,29)).digital,'00:00');
assert.equal(previewClock.timeInfo(previewClock.dragHourTime(0,29,359)).digital,'23:00');
console.log('PASS: all 288 five-minute times in four languages; half-hour phrases; midnight, minute dragging and independent hour-hand dragging');
