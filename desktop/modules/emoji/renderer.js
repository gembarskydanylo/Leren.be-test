/* Leren.be's locally bundled emoji artwork. Emoji in app text are rendered from img/emoji, not system fonts. */
(() => {
 'use strict';
 const exact = {"😀":"cat-04","😃":"cat-04","😄":"cat-04","😁":"cat-04","😆":"cat-06","😅":"cat-06","😂":"cat-06","🤣":"cat-06","😊":"cat-09","😍":"cat-09","🥰":"cat-09","😘":"cat-09","😎":"cat-03","🤔":"cat-07","😕":"cat-07","😮":"cat-05","😲":"cat-05","😴":"cat-08","😪":"cat-08","😭":"cat-12","😢":"cat-12","😟":"cat-13","😡":"cat-06","🤒":"cat-11","🤧":"cat-15","🤕":"cat-14","👋":"cat-04","👏":"cat-10","👍":"cat-03","👎":"cat-02","🙏":"cat-10","💪":"cat-03","🧑":"cat-01","👤":"cat-01","👥":"cat-10","👨":"fx-1f468","👩":"fx-1f469","👶":"cat-05","👪":"cat-10","🔊":"fx-1f50a","🔉":"fx-1f509","🔈":"fx-1f508","🎧":"fx-1f3a7","🎤":"fx-1f3a4","📘":"fx-1f4d8","📖":"fx-1f4d6","📚":"fx-1f4da","📱":"fx-1f4f1","☎":"fx-260e","📞":"fx-1f4de","✉":"fx-2709","📨":"fx-1f4e8","🔑":"fx-1f511","🏠":"fx-1f3e0","🏡":"fx-1f3e1","⏰":"fx-23f0","🕒":"fx-1f552","⏱":"fx-23f1","➡":"symbol-13","→":"symbol-13","➜":"symbol-13","⬅":"symbol-14","←":"symbol-14","↻":"symbol-12","🔢":"fx-1f522","✦":"games-10","✨":"fx-2728","🎮":"fx-1f3ae","🎲":"fx-1f3b2","🃏":"fx-1f0cf","🧩":"fx-1f9e9","🏆":"fx-1f3c6","🥇":"fx-1f947","🏅":"fx-1f3c5","🎁":"fx-1f381","🏁":"fx-1f3c1","⭐":"fx-2b50","🌟":"fx-1f31f","💫":"fx-1f4ab","🎯":"fx-1f3af","📆":"fx-1f4c6","📅":"fx-1f4c5","🗓":"games-16","🔒":"fx-1f512","🔐":"fx-1f510","💬":"cat-08","🗣":"cat-14","🤖":"fx-1f916","🏫":"fx-1f3eb","🏥":"fx-1f3e5","🏪":"fx-1f3ea","🛒":"fx-1f6d2","🏛":"fx-1f3db","🏦":"fx-1f3e6","🏨":"fx-1f3e8","🚉":"fx-1f689","📮":"fx-1f4ee","⛪":"fx-26ea","🚗":"fx-1f697","🚲":"fx-1f6b2","🚌":"fx-1f68c","🚎":"fx-1f68e","🚆":"fx-1f686","🚦":"fx-1f6a6","🚸":"fx-1f6b8","🛣":"fx-1f6e3","🗺":"fx-1f5fa","✈":"fx-2708","🏙":"fx-1f3d9","🌞":"travel-15","🌧":"fx-1f327","❄":"fx-2744","🌙":"fx-1f319","🌳":"fx-1f333","🌼":"weather-10","☀":"fx-2600","🌤":"fx-1f324","⛅":"fx-26c5","⚡":"fx-26a1","🌈":"fx-1f308","💨":"fx-1f4a8","🌲":"fx-1f332","🌸":"fx-1f338","🍃":"fx-1f343","🌺":"fx-1f33a","🏔":"weather-13","🌊":"fx-1f30a","🐚":"fx-1f41a","🌱":"fx-1f331","🍁":"fx-1f341","☂":"fx-2602","🌨":"fx-1f328","🌠":"fx-1f320","🍳":"fx-1f373","🥛":"fx-1f95b","🍞":"fx-1f35e","🥣":"fx-1f963","🥪":"fx-1f96a","🥖":"fx-1f956","🧈":"fx-1f9c8","🥗":"fx-1f957","🍫":"fx-1f36b","🍪":"fx-1f36a","🧀":"fx-1f9c0","🥚":"food-12","🥫":"fx-1f96b","🧂":"fx-1f9c2","🍬":"fx-1f36c","🍝":"fx-1f35d","🐟":"food-17","🥦":"fx-1f966","🍌":"fx-1f34c","🍎":"fx-1f34e","🥒":"fx-1f952","🍅":"fx-1f345","🥔":"fx-1f954","🧅":"fx-1f9c5","🍚":"fx-1f35a","🥩":"fx-1f969","🍗":"food-27","🍇":"fx-1f347","🍊":"fx-1f34a","🍵":"fx-1f375","🍺":"food-31","🍷":"food-32","🍕":"fx-1f355","🍟":"food-34","🍮":"food-35","🥐":"fx-1f950","🥓":"fx-1f953","🫘":"fx-1fad8","🍓":"food-39","🥤":"fx-1f964","☕":"fx-2615","🐶":"fx-1f436","🐱":"fx-1f431","🐈":"cat-01","🐦":"fx-1f426","🐴":"fx-1f434","🐮":"animal-05","🐷":"fx-1f437","🐰":"fx-1f430","🐘":"animal-08","🐞":"fx-1f41e","🐢":"animal-10","🐠":"fx-1f420","🐑":"fx-1f411","🦊":"fx-1f98a","🐻":"fx-1f43b","🦋":"fx-1f98b","🐝":"fx-1f41d","🐓":"fx-1f413","🐭":"fx-1f42d","🐸":"fx-1f438","🦔":"fx-1f994","🔴":"fx-1f534","🟠":"fx-1f7e0","🟡":"fx-1f7e1","🟢":"fx-1f7e2","🔵":"fx-1f535","🟣":"fx-1f7e3","⚪":"fx-26aa","⚫":"fx-26ab","✅":"fx-2705","✔":"fx-2714","❌":"fx-274c","❓":"fx-2753","❔":"fx-2754","❗":"fx-2757","‼":"fx-203c","❤":"fx-2764","💛":"fx-1f49b","💙":"fx-1f499","💚":"fx-1f49a","💜":"fx-1f49c","🇧🇪":"status-11","🇺🇦":"status-12","🇫🇷":"status-13","🇬🇧":"status-14","👕":"fx-1f455","🧶":"fx-1f9f6","🧥":"fx-1f9e5","👖":"fx-1f456","👗":"fx-1f457","👘":"fx-1f458","🩳":"clothes-08","👟":"fx-1f45f","👞":"fx-1f45e","🧦":"fx-1f9e6","🧤":"fx-1f9e4","🧣":"fx-1f9e3","🧢":"fx-1f9e2","👒":"fx-1f452","👓":"fx-1f453","👜":"fx-1f45c","🎒":"fx-1f392","💍":"clothes-19","⌚":"fx-231a","😺":"cat-01","✏":"fx-270f","✂":"fx-2702","💻":"fx-1f4bb","📓":"fx-1f4d3","📒":"fx-1f4d2","🎾":"fx-1f3be","🏃":"fx-1f3c3","🏊":"fx-1f3ca","🎉":"fx-1f389","⚽":"learn-20","🪙":"fx-1fa99","💰":"fx-1f4b0","🍽":"fx-1f37d","🏢":"fx-1f3e2","🏬":"places-20","0":"symbol-01","1":"symbol-02","2":"symbol-03","3":"symbol-04","4":"symbol-05","5":"symbol-06","6":"symbol-07","7":"symbol-08","8":"symbol-09","9":"symbol-10","↕":"fx-2195","🔄":"fx-1f504","🚋":"fx-1f68b","⌛":"fx-231b","⏪":"fx-23ea","▶":"fx-25b6","⏸":"status-06","⏹":"status-07","⬆":"fx-2b06","⬇":"status-10","📈":"fx-1f4c8","🎛":"fx-1f39b","💳":"fx-1f4b3","👛":"fx-1f45b","🎂":"fx-1f382"};
 // The earlier mappings pointed birthdays and dates at unrelated sprout art.
 Object.assign(exact, {"🎈":"learn-19","📅":"status-02","📆":"status-02","🗓":"status-02"});
 // Cats stay only on faces (the mascot's moods); things and people get a picture of the thing itself.
 for(const k of ['👋','👏','👍','👎','🙏','💪','🧑','👤','👥','👨','👩','👶','👪','🔊','🔉','🔈','🎧','🎤','📖','📚','📱','💬','🗣','🤖','👓','🎒','✏','✂','💻','📓','📒','🎾','🏃','🏊','🎉','⚽','🎂'])delete exact[k];
 const assetBase=new URL('../../img/emoji/',document.currentScript.src).href;
 const emojiStyle=document.createElement('style');emojiStyle.textContent='.lbe-emoji{display:inline-block;width:1.18em;height:1.18em;object-fit:contain;vertical-align:-.22em;flex:none}.icon-box>.lbe-emoji{width:1.15em;height:1.15em}';document.head.appendChild(emojiStyle);
 const strip = value => value.replace(/[\uFE0E\uFE0F\u20E3\u{1F3FB}-\u{1F3FF}]/gu,'').replace(/\u200D/gu,'');
 // Verified pictures win over the first guessed map (its file names do not match what the pictures show).
 if(globalThis.LerenCard3D)for(const [k,f] of Object.entries(globalThis.LerenCard3D))exact[strip(k)]=f;
 const emojiPattern = /(?:[0-9#*]\uFE0F?\u20E3|\p{Regional_Indicator}{2}|\p{Extended_Pictographic}(?:[\uFE0E\uFE0F\p{Emoji_Modifier}])*(?:\u200D\p{Extended_Pictographic}(?:[\uFE0E\uFE0F\p{Emoji_Modifier}])*)*)/gu;
 function fileFor(value) {
  const key=strip(value),f=exact[key]||exact[value];return f?f+".png":null;
 }
 function make(value, className='lbe-emoji') {
  // No pack match: our drawing for this emoji if there is one, else the neutral book (never a random cat).
  const A=globalThis.LerenCardArt?.A||{},file=fileFor(value),art=!file&&(A[value]||A[strip(value)]||A[strip(value)+'\uFE0F']);
  const img=document.createElement('img');img.className=className;img.src=file?assetBase+file:art?'data:image/svg+xml;charset=utf-8,'+encodeURIComponent(art.replace('<svg ','<svg xmlns="http://www.w3.org/2000/svg" ')):assetBase+'animal-11.png';img.alt='';img.setAttribute('aria-hidden','true');img.decoding='async';return img;
 }
 const SKIP='script,style,textarea,input,select,option,[data-no-local-emoji]';
 function replaceTextNode(textNode) {
  // Never touch program text: the observer also sees the page's own <script> while it is being parsed.
  const parent=textNode.parentElement;if(!parent||parent.closest(SKIP))return;
  if(!textNode.isConnected || !emojiPattern.test(textNode.data)){emojiPattern.lastIndex=0;return}
  emojiPattern.lastIndex=0;
  const fragment=document.createDocumentFragment();let start=0,match;
  while((match=emojiPattern.exec(textNode.data))){if(match.index>start)fragment.appendChild(document.createTextNode(textNode.data.slice(start,match.index)));fragment.appendChild(make(match[0]));start=match.index+match[0].length}
  if(start<textNode.data.length)fragment.appendChild(document.createTextNode(textNode.data.slice(start)));
  textNode.replaceWith(fragment);
 }
 function enhance(root=document.body) {
  if(!root)return;
  const walker=document.createTreeWalker(root,NodeFilter.SHOW_TEXT,{acceptNode(node){const p=node.parentElement;return p&&p.closest('script,style,textarea,input,select,option,[data-no-local-emoji]')?NodeFilter.FILTER_REJECT:NodeFilter.FILTER_ACCEPT}});
  const nodes=[];while(walker.nextNode())nodes.push(walker.currentNode);nodes.forEach(replaceTextNode);
 }
 globalThis.LerenEmoji={fileFor,make,enhance};
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>enhance(),{once:true});else enhance();
 const observer=new MutationObserver(records=>{for(const record of records){if(record.type==='characterData')replaceTextNode(record.target);else record.addedNodes.forEach(n=>{if(n.nodeType===Node.TEXT_NODE)replaceTextNode(n);else if(n.nodeType===Node.ELEMENT_NODE)enhance(n)})}});
 observer.observe(document.documentElement,{subtree:true,childList:true,characterData:true});
})();
