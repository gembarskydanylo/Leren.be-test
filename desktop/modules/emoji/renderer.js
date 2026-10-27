/* Leren.be's locally bundled emoji artwork. Emoji in app text are rendered from img/emoji, not system fonts. */
(() => {
 'use strict';
 const exact = {"😀":"cat-04","😃":"cat-04","😄":"cat-04","😁":"cat-04","😆":"cat-06","😅":"cat-06","😂":"cat-06","🤣":"cat-06","😊":"cat-09","😍":"cat-09","🥰":"cat-09","😘":"cat-09","😎":"cat-03","🤔":"cat-07","😕":"cat-07","😮":"cat-05","😲":"cat-05","😴":"cat-08","😪":"cat-08","😭":"cat-12","😢":"cat-12","😟":"cat-13","😡":"cat-06","🤒":"cat-11","🤧":"cat-15","🤕":"cat-14","👋":"cat-04","👏":"cat-10","👍":"cat-03","👎":"cat-02","🙏":"cat-10","💪":"cat-03","🧑":"cat-01","👤":"cat-01","👥":"cat-10","👨":"cat-18","👩":"cat-19","👶":"cat-05","👪":"cat-10","🔊":"learn-13","🔉":"learn-13","🔈":"learn-13","🎧":"learn-04","🎤":"learn-05","📘":"symbol-16","📖":"learn-02","📚":"learn-01","📱":"learn-06","☎":"symbol-17","📞":"symbol-17","✉":"symbol-18","📨":"symbol-18","🔑":"symbol-19","🏠":"places-10","🏡":"symbol-20","⏰":"symbol-15","🕒":"symbol-15","⏱":"games-17","➡":"symbol-13","→":"symbol-13","➜":"symbol-13","⬅":"symbol-14","←":"symbol-14","↻":"symbol-12","🔢":"symbol-01","✦":"games-10","✨":"games-10","🎮":"games-01","🎲":"games-02","🃏":"games-03","🧩":"games-04","🏆":"games-05","🥇":"games-06","🏅":"games-15","🎁":"games-07","🏁":"games-08","⭐":"games-09","🌟":"games-09","💫":"games-10","🎯":"games-11","📆":"games-16","📅":"games-16","🗓":"games-16","🔒":"games-19","🔐":"games-19","💬":"cat-08","🗣":"cat-14","🤖":"cat-17","🏫":"places-01","🏥":"places-02","🏪":"places-03","🛒":"places-04","🏛":"places-08","🏦":"places-08","🏨":"places-14","🚉":"places-15","📮":"places-18","⛪":"places-09","🚗":"travel-01","🚲":"travel-02","🚌":"travel-03","🚎":"travel-04","🚆":"travel-05","🚦":"travel-07","🚸":"travel-08","🛣":"travel-09","🗺":"travel-10","✈":"places-16","🏙":"travel-11","🌞":"travel-15","🌧":"weather-04","❄":"weather-05","🌙":"weather-02","🌳":"weather-09","🌼":"weather-10","☀":"weather-01","🌤":"weather-02","⛅":"weather-03","⚡":"weather-06","🌈":"weather-07","💨":"weather-08","🌲":"weather-09","🌸":"weather-10","🍃":"weather-11","🌺":"weather-12","🏔":"weather-13","🌊":"weather-14","🐚":"weather-15","🌱":"weather-16","🍁":"weather-17","☂":"weather-18","🌨":"weather-19","🌠":"weather-20","🍳":"food-01","🥛":"food-02","🍞":"food-03","🥣":"food-04","🥪":"food-05","🥖":"places-05","🧈":"food-07","🥗":"food-08","🍫":"food-09","🍪":"food-10","🧀":"food-11","🥚":"food-12","🥫":"food-13","🧂":"food-14","🍬":"food-15","🍝":"food-16","🐟":"food-17","🥦":"food-18","🍌":"food-19","🍎":"food-20","🥒":"food-21","🍅":"food-22","🥔":"food-23","🧅":"food-24","🍚":"food-25","🥩":"food-26","🍗":"food-27","🍇":"food-28","🍊":"food-29","🍵":"food-30","🍺":"food-31","🍷":"food-32","🍕":"food-33","🍟":"food-34","🍮":"food-35","🥐":"food-36","🥓":"food-37","🫘":"food-38","🍓":"food-39","🥤":"food-40","☕":"places-06","🐶":"animal-01","🐱":"animal-02","🐈":"cat-01","🐦":"animal-03","🐴":"animal-04","🐮":"animal-05","🐷":"animal-06","🐰":"animal-07","🐘":"animal-08","🐞":"animal-09","🐢":"animal-10","🐠":"animal-11","🐑":"animal-12","🦊":"animal-13","🐻":"animal-14","🦋":"animal-15","🐝":"animal-16","🐓":"animal-17","🐭":"animal-18","🐸":"animal-19","🦔":"animal-20","🔴":"games-14","🟠":"games-14","🟡":"games-14","🟢":"games-14","🔵":"games-14","🟣":"games-14","⚪":"games-14","⚫":"games-14","✅":"games-14","✔":"games-14","❌":"games-13","❓":"games-12","❔":"games-12","❗":"games-14","‼":"games-14","❤":"games-03","💛":"games-09","💙":"games-09","💚":"games-09","💜":"games-09","🇧🇪":"status-11","🇺🇦":"status-12","🇫🇷":"status-13","🇬🇧":"status-14","👕":"clothes-01","🧶":"clothes-02","🧥":"clothes-03","👖":"clothes-04","👗":"clothes-06","👘":"clothes-07","🩳":"clothes-08","👟":"clothes-09","👞":"clothes-10","🧦":"clothes-11","🧤":"clothes-12","🧣":"clothes-13","🧢":"clothes-14","👒":"clothes-15","👓":"learn-09","👜":"clothes-17","🎒":"learn-08","💍":"clothes-19","⌚":"clothes-20","😺":"cat-01","✏":"learn-03","✂":"learn-07","💻":"learn-10","📓":"learn-11","📒":"learn-12","🎾":"learn-15","🏃":"learn-16","🏊":"learn-18","🎉":"learn-19","⚽":"learn-20","🪙":"games-18","💰":"games-20","🍽":"places-07","🏢":"places-13","🏬":"places-20","0":"symbol-01","1":"symbol-02","2":"symbol-03","3":"symbol-04","4":"symbol-05","5":"symbol-06","6":"symbol-07","7":"symbol-08","8":"symbol-09","9":"symbol-10","↕":"symbol-11","🔄":"symbol-12","🚋":"travel-04","⌛":"status-01","⏪":"status-04","▶":"status-05","⏸":"status-06","⏹":"status-07","⬆":"status-09","⬇":"status-10","📈":"status-15","🎛":"status-16","💳":"status-19","👛":"status-20","🎂":"learn-19"};
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
