/* Local state-machine regression tests; rendering is checked separately in the browser. */
const fs = require('node:fs');
const vm = require('node:vm');
const assert = require('node:assert/strict');
const source = fs.readFileSync(require('node:path').join(__dirname,'..','ui-components.js'),'utf8');
function fixture({reduce=false, mobile=true, long=false}={}) {
  const timers=new Map(); let seq=0;
  const media=Object.fromEntries(['(prefers-reduced-motion: reduce)','(max-width: 950px)'].map((q,i)=>[q,{matches:i?mobile:reduce,listeners:[],addEventListener(_,fn){this.listeners.push(fn)},set(value){this.matches=value;this.listeners.forEach(fn=>fn())}}]));
  const doc={activeElement:null,events:{},addEventListener(type,fn){(this.events[type]??=[]).push(fn)}};
  class Element {
    constructor(tag){this.tagName=tag.toUpperCase();this.children=[];this.childNodes=this.children;this.attrs=new Map();this.handlers={};this.open=false;this.inert=false;this.dataset={};this.textContent='';const set=new Set();this.classList={add(...v){v.forEach(x=>set.add(x))},remove(...v){v.forEach(x=>set.delete(x))},contains(v){return set.has(v)},toggle(v,on){if(on===undefined)on=!set.has(v);on?set.add(v):set.delete(v);return on}};
    }
    setAttribute(k,v){this.attrs.set(k,String(v))}getAttribute(k){return this.attrs.get(k)??null}
    append(...nodes){for(const node of nodes){if(node.parent){const i=node.parent.children.indexOf(node);if(i>=0)node.parent.children.splice(i,1)}this.children.push(node);node.parent=this}}
    replaceChildren(...nodes){this.children.splice(0);this.append(...nodes)}
    addEventListener(type,fn){(this.handlers[type]??=[]).push(fn)}
    fire(type,event={}){for(const fn of this.handlers[type]||[])fn({target:this,preventDefault(){},...event})}
    closest(){return null}querySelectorAll(){return []}contains(el){return el===this||this.children.some(e=>e.contains(el))}
    getBoundingClientRect(){return {height:100,width:400}}get scrollHeight(){return long?4000:180}
    focus(){doc.activeElement=this}
  }
  const summary=new Element('summary'), details=new Element('details'), content=new Element('p');details.append(summary,content);
  const menu=new Element('button'),nav=new Element('nav');menu.textContent='Menu';menu.setAttribute('aria-expanded','false');
  doc.querySelector=q=>q==='.menu-toggle'?menu:q==='.primary-nav'?nav:null;
  doc.querySelectorAll=q=>q.startsWith('details.')?[details]:[];
  doc.getElementById=()=>null;doc.createElement=tag=>new Element(tag);doc.createElementNS=(_,tag)=>new Element(tag);
  vm.runInNewContext(source,{document:doc,matchMedia:q=>media[q],innerHeight:960,setTimeout:fn=>{timers.set(++seq,fn);return seq},clearTimeout:id=>timers.delete(id)});
  const flush=()=>{const batch=[...timers.values()];timers.clear();batch.forEach(fn=>fn())};
  return {details,summary,inner:details.children[1].children[0],menu,nav,doc,media,timers,flush};
}
{
  const f=fixture();
  f.summary.fire('click');assert.equal(f.details.open,true);assert.equal(f.details.classList.contains('is-expanded'),true);
  f.summary.fire('click');assert.equal(f.inner.inert,true);assert.equal(f.details.classList.contains('is-expanded'),false);
  f.summary.fire('click');assert.equal(f.timers.size,1);f.flush();assert.equal(f.details.open,true);assert.equal(f.inner.inert,false);
  f.summary.fire('click');f.flush();assert.equal(f.details.open,false);assert.equal(f.inner.inert,false,'closed native disclosure must stay searchable');
  f.details.open=true;f.details.fire('toggle');assert.equal(f.details.classList.contains('is-expanded'),true,'external/native opening must sync');
  f.media['(prefers-reduced-motion: reduce)'].set(true);f.summary.fire('click');assert.equal(f.details.open,false);assert.equal(f.timers.size,0);
  f.menu.fire('click');assert.equal(f.nav.inert,false);assert.equal(f.menu.getAttribute('aria-expanded'),'true');
  f.menu.fire('click');assert.equal(f.nav.inert,true);assert.equal(f.nav.classList.contains('is-closing'),false,'reduced motion closes immediately');
}
{
  const f=fixture();f.menu.fire('click');f.menu.fire('click');assert.equal(f.nav.classList.contains('is-closing'),true);f.menu.fire('click');assert.equal(f.nav.classList.contains('is-closing'),false);assert.equal(f.timers.size,0);
  f.media['(max-width: 950px)'].set(false);assert.equal(f.nav.inert,false,'desktop navigation must not remain inert');assert.equal(f.menu.getAttribute('aria-expanded'),'false');
}
{
  const f=fixture({long:true});f.summary.fire('click');assert.equal(f.details.open,true);assert.equal(f.timers.size,0,'long appendices must not animate a giant layout');
}
{
  const research=fs.readFileSync(require('node:path').join(__dirname,'..','research.js'),'utf8');
  const start=research.indexOf('/* ---------- illustrative phone traces;');
  const end=research.indexOf('/* ---------- hero signal strip',start);
  const intervals=new Map();let seq=0,observer;
  const media={matches:false,addEventListener(_,fn){this.change=fn}};
  const elapsed={textContent:'00:12',closest(){return this}};
  const doc={hidden:false,getElementById:id=>id==='elapsed'?elapsed:null,addEventListener(_,fn){this.visibility=fn}};
  function Observer(fn){observer=fn;this.observe=()=>{}};
  vm.runInNewContext(research.slice(start,end),{document:doc,window:{IntersectionObserver:Observer},IntersectionObserver:Observer,matchMedia:()=>media,setInterval:fn=>{intervals.set(++seq,fn);return seq},clearInterval:id=>intervals.delete(id)});
  assert.equal(intervals.size,0);observer([{isIntersecting:true}]);assert.equal(intervals.size,1);[...intervals.values()][0]();assert.equal(elapsed.textContent,'00:13');
  doc.hidden=true;doc.visibility();assert.equal(intervals.size,0);doc.hidden=false;doc.visibility();assert.equal(intervals.size,1);
  media.matches=true;media.change();assert.equal(intervals.size,0);observer([{isIntersecting:false}]);media.matches=false;media.change();assert.equal(intervals.size,0);
}
console.log('PASS: disclosure interruption/native opening/search fallback, reduced motion, menu interruption/desktop reset, and phone clock visibility/reduced-motion lifecycle.');
