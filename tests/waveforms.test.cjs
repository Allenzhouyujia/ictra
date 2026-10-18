const {readFileSync} = require('node:fs');
const vm = require('node:vm');
const assert = require('node:assert/strict');
const code = readFileSync(require('node:path').join(__dirname,'..','waveforms.js'), 'utf8');
function setup(reduce = false) {
  const callbacks = new Map(); let id = 0, intersect;
  const nodes = {};
  for (const name of ['signal-demo','wave-toggle','wave-state','wave-eeg','wave-ecg','wave-emg']) {
    nodes[name] = {attrs:{}, events:{}, setAttribute(k,v){this.attrs[k]=v;}, addEventListener(k,fn){this.events[k]=fn;}};
  }
  const media = {matches:reduce, addEventListener(_,fn){this.change=fn;}};
  const classes = new Set();
  const document = {hidden:false,events:{},documentElement:{classList:{contains:name=>classes.has(name)}},getElementById:id=>nodes[id],addEventListener(type,fn){this.events[type]=fn;if(type==='visibilitychange')this.visibility=fn;}};
  const context = {document, matchMedia:()=>media, window:{IntersectionObserver:true}, IntersectionObserver:class {constructor(fn){intersect=fn;} observe(){}}, requestAnimationFrame:fn=>{callbacks.set(++id,fn);return id;}, cancelAnimationFrame:id=>callbacks.delete(id)};
  vm.runInNewContext(code,context);
  return {nodes,media,document,callbacks,intro(value){value?classes.add('intro-active'):classes.delete('intro-active');document.events['ictra:introchange']();},visible(value){intersect([{isIntersecting:value}]);},tick(time){const pending=[...callbacks.values()];callbacks.clear();pending.forEach(fn=>fn(time));},points(){return nodes['wave-eeg'].attrs.points;}};
}
const normal=setup();
assert.equal(normal.callbacks.size,0,'offscreen should not animate');
normal.visible(true); const initial=normal.points();normal.tick(100);normal.tick(150);
assert.notEqual(normal.points(),initial,'wave should advance');
normal.nodes['wave-toggle'].events.click();const frozen=normal.points();normal.tick(200);
assert.equal(normal.points(),frozen,'pause should freeze samples');
assert.equal(normal.callbacks.size,0);
normal.nodes['wave-toggle'].events.click();assert.equal(normal.callbacks.size,1);
normal.document.hidden=true;normal.document.visibility();assert.equal(normal.callbacks.size,0);
normal.document.hidden=false;normal.document.visibility();assert.equal(normal.callbacks.size,1);
normal.intro(true);assert.equal(normal.callbacks.size,0,'intro suspends background waves');
normal.intro(false);assert.equal(normal.callbacks.size,1,'intro completion resumes waves');
normal.nodes['wave-toggle'].events.click();normal.intro(true);normal.intro(false);assert.equal(normal.callbacks.size,0,'intro must not undo an explicit pause');
normal.nodes['wave-toggle'].events.click();
normal.visible(false);assert.equal(normal.callbacks.size,0);
const quiet=setup(true);quiet.visible(true);assert.equal(quiet.callbacks.size,0);
assert.equal(quiet.nodes['wave-toggle'].textContent,'Play waves');
quiet.nodes['wave-toggle'].events.click();assert.equal(quiet.callbacks.size,1,'explicit play is allowed');
quiet.media.matches=true;quiet.media.change();assert.equal(quiet.callbacks.size,0);
console.log('PASS: waveform progression, pause/resume, offscreen, hidden-tab, reduced-motion and explicit play.');
