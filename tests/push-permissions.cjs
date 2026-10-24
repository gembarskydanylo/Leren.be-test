// Exercise the actual notification functions without a browser or network.
const fs = require('node:fs');
const vm = require('node:vm');
const assert = require('node:assert/strict');
const html = fs.readFileSync(require('node:path').join(__dirname, '../index.html'), 'utf8');
function fn(name) {
  const start = html.indexOf('async function ' + name + '(');
  return html.slice(start, html.indexOf('\n}', start) + 2);
}
async function scenario(permission, existing, enabled = true) {
  let creates = 0, prompts = 0, writes = 0, timer;
  let state = {on: enabled, hour: 18};
  const sub = {endpoint: 'test'};
  const context = vm.createContext({
    navigator: {serviceWorker: {ready: Promise.resolve({pushManager: {
      getSubscription: async () => existing ? sub : null,
      subscribe: async () => { creates++; return sub; }
    }})}},
    Notification: {permission, requestPermission: async () => { prompts++; return 'granted'; }},
    PUSH_CONFIG: {vapid: ''}, b64uToBytes: () => [],
    pushReady: () => true, pushState: () => state,
    pushU: () => ({}), toast: () => {}, lsSet: (_, value) => {state = value;},
    pushWrite: async () => {writes++;},
    clearTimeout: () => {}, setTimeout: callback => {timer = callback; return 1;}
  });
  const syncStart = html.indexOf('const pushAllowed=');
  const syncEnd = html.indexOf('\nfunction renderPushRow', syncStart);
  vm.runInContext(fn('pushSubscribe') + '\n' + fn('pushEnable') + '\nlet pushTimer=0;\n' + html.slice(syncStart, syncEnd), context);
  vm.runInContext('pushSync()', context);
  if(timer) await timer();
  assert.equal(creates, 0, 'background sync must never subscribe');
  assert.equal(prompts, 0, 'background sync must never request permission');
  assert.equal(writes, enabled && permission !== 'denied' && existing ? 1 : 0);
  if(permission !== 'denied') {
    await vm.runInContext('pushEnable()', context);
    assert.equal(creates, existing ? 0 : 1, 'explicit enable creates only a missing subscription');
    assert.equal(prompts, permission === 'granted' ? 0 : 1);
  }
}
(async () => {
  new vm.Script(html.match(/<script>([\s\S]*?)<\/script>/)[1]);
  for(const permission of ['default', 'granted', 'denied'])
    for(const existing of [false, true])
      for(const enabled of [false, true]) await scenario(permission, existing, enabled);
  console.log('PASS: syntax and 12 notification scenarios; background never prompts or subscribes');
})().catch(error => {console.error(error); process.exitCode = 1;});
