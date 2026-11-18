import{mountLexiChat}from'./chat.js?v=test033-preview4';import{createDemoEngine}from'./mock.js';
const q=new URLSearchParams(location.search),pick=(key,values,fallback)=>values.includes(q.get(key))?q.get(key):fallback;
const chat=mountLexiChat(document.getElementById('lexiRoot'),{engine:createDemoEngine(),demo:true,initial:{theme:pick('theme',['light','dark'],'light'),ui:pick('ui',['uk','en','fr','ar'],'uk'),target:pick('target',['nl','fr','en'],'nl'),level:pick('level',['a11','a12','a21'],'a11')}});
if(q.has('state'))chat.preview(pick('state',['welcome','listening','thinking','speaking','correct','incorrect','offline','error','idle'],'welcome'),pick('code',['offline','beta','unavailable','timeout','network','slow','limit','refusal','off','format','tooLong','empty'],'network'));
