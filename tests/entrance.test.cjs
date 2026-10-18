const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const source=fs.readFileSync(require('node:path').join(__dirname,'..','site-entrance.js'),'utf8');
function setup({reduced=false,hash='',seen=false,replay=false,hidden=false,storageBlocked=false,ready=4,blocked=false,history=false,now=100}={}){
  const timers=new Map(),classes=new Set(),media={matches:reduced,events:{},addEventListener(t,f){this.events[t]=f}};let id=0;
  class Node{
    constructor(){this.events={};this.attrs=new Map();this.dataset={};this.open=false;this.removed=false;this.classList={add:n=>classes.add(n),remove:n=>classes.delete(n),contains:n=>classes.has(n)}}
    addEventListener(t,f){(this.events[t]??=[]).push(f)}fire(t,event={}){for(const f of this.events[t]||[])f({preventDefault(){},...event})}
    setAttribute(k,v){this.attrs.set(k,v)}getAttribute(k){return this.attrs.get(k)??null}removeAttribute(k){this.attrs.delete(k)}
    focus(){doc.activeElement=this}remove(){this.removed=true}showModal(){this.open=true}close(){this.open=false;this.fire('close')}
  }
  const main=new Node(),video=new Node(),button=new Node(),dialog=new Node();video.readyState=ready;video.paused=true;video.playCalls=0;
  video.play=()=>{video.playCalls++;video.paused=false;return blocked?Promise.reject(new Error('Autoplay blocked')):Promise.resolve()};video.pause=()=>{video.paused=true};video.load=()=>{};
  dialog.querySelector=q=>q==='video'?video:button;
  const root=new Node();const doc={documentElement:root,hidden,readyState:'complete',activeElement:null,events:{},created:0,body:{append(){}},createElement(){this.created++;return dialog},querySelector:q=>q==='main'?main:null,addEventListener(t,f){(this.events[t]??=[]).push(f)},dispatchEvent(e){for(const f of this.events[e.type]||[])f(e)}};
  const win={events:{},addEventListener(t,f){this.events[t]=f}};
  const storage=new Map(seen?[['ictra-entry-seen-v1','1']]:[]);
  vm.runInNewContext(source,{document:doc,window:win,location:{href:'https://example.test/index'+(replay?'?intro=1':''),hash},performance:{now:()=>now,getEntriesByType:()=>[{type:history?'back_forward':'navigate'}]},sessionStorage:{getItem(k){if(storageBlocked)throw Error('Storage denied');return storage.get(k)},setItem(k,v){if(storageBlocked)throw Error('Storage denied');storage.set(k,v)}},matchMedia:()=>media,HTMLDialogElement:Node,URL,CustomEvent:class{constructor(type){this.type=type}},setTimeout:(fn,ms)=>{timers.set(++id,{fn,ms});return id},clearTimeout:id=>timers.delete(id)});
  const fireTimer=ms=>{const pair=[...timers].find(([,v])=>v.ms===ms);if(pair){timers.delete(pair[0]);pair[1].fn()}};
  return{root,dialog,video,button,main,doc,media,win,timers,storage,fireTimer};
}
(async()=>{
  for(const options of [{reduced:true},{hash:'#results'},{seen:true},{hidden:true},{history:true},{now:2200}]){const f=setup(options);assert.equal(f.doc.created,0);assert.equal(f.root.dataset.entryState,'skipped');assert.equal(f.video.playCalls,0);assert.equal(f.storage.get('ictra-entry-seen-v1'),'1')}
  const normal=setup();assert.equal(normal.dialog.open,true);assert.equal(normal.video.muted,true);assert.equal(normal.doc.activeElement,normal.button);assert.equal(normal.root.classList.contains('intro-active'),true);
  normal.video.fire('playing');assert.equal(normal.root.dataset.entryState,'playing');assert.equal([...normal.timers.values()].some(t=>t.ms===1600),false);
  normal.video.fire('ended');normal.fireTimer(190);assert.equal(normal.dialog.removed,true);assert.equal(normal.doc.activeElement,normal.main);assert.equal(normal.video.paused,true);assert.equal(normal.root.classList.contains('intro-active'),false);
  for(const event of ['skip','escape','error','timeout','background','pagehide','reduced']){
    const f=setup();
    if(event==='skip')f.button.fire('click');
    if(event==='escape')f.dialog.fire('cancel');
    if(event==='error')f.video.fire('error');
    if(event==='timeout')f.fireTimer(6500);
    if(event==='background'){f.doc.hidden=true;f.doc.dispatchEvent({type:'visibilitychange'})}
    if(event==='pagehide')f.win.events.pagehide();
    if(event==='reduced'){f.media.matches=true;f.media.events.change()}
    f.fireTimer(190);assert.equal(f.root.dataset.entryState,'done',event);assert.equal(f.dialog.removed,true,event);assert.equal(f.video.paused,true,event);assert.equal(f.root.classList.contains('intro-active'),false,event);
  }
  const slow=setup({ready:0});slow.fireTimer(1600);assert.equal(slow.root.dataset.entryReason,'slow-start');
  const decoded=setup({ready:2});decoded.fireTimer(1600);assert.equal(decoded.root.dataset.entryReason,'slow-start','decoded but not playing must fail open');
  const denied=setup({blocked:true});await Promise.resolve();await Promise.resolve();assert.equal(denied.root.dataset.entryReason,'autoplay-blocked');assert.equal(denied.dialog.removed,true);
  const noStorage=setup({storageBlocked:true});noStorage.button.fire('click');noStorage.fireTimer(190);assert.equal(noStorage.root.dataset.entryState,'done');
  const replay=setup({seen:true,replay:true});assert.equal(replay.dialog.open,true);
  console.log('PASS: first entry, session/deep-link/history/reduced-motion/background bypass, muted playback, Skip/Escape/end/error/timeouts, blocked autoplay/storage and focus release.');
})().catch(e=>{console.error(e);process.exitCode=1});
