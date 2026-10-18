// Enumerate only the current site's dependencies; do not publish unrelated working files.
const fs=require('node:fs'),path=require('node:path');
const root=path.resolve(__dirname,'..'),files=new Set();
function visit(relative){
  relative=relative.replaceAll('\\','/');
  if(files.has(relative))return;
  const absolute=path.resolve(root,relative);
  if(!absolute.toLowerCase().startsWith((root+path.sep).toLowerCase()))throw Error('Outside site: '+relative);
  if(!fs.statSync(absolute).isFile())throw Error('Not a file: '+relative);
  files.add(relative);
  if(!/\.(html|css|js)$/i.test(relative))return;
  const text=fs.readFileSync(absolute,'utf8');
  const references=[...text.matchAll(/\b(?:src|href|poster)=["']([^"']+)["']/g)].map(m=>m[1]);
  if(relative.endsWith('.css'))references.push(...[...text.matchAll(/url\(\s*['"]?([^)'"\s]+)['"]?\s*\)/g)].map(m=>m[1]));
  for(let ref of references){
    if(/^(?:[a-z][a-z0-9+.-]*:|#|\/\/)/i.test(ref))continue;
    ref=decodeURIComponent(ref.split(/[?#]/)[0]);if(!ref)continue;
    const target=path.resolve(ref.startsWith('/')?root:path.dirname(absolute),ref.replace(/^\//,''));
    visit(path.relative(root,target));
  }
}
for(const name of ['index','journey','background','science','system','evidence','safety','team'])visit(name+'.html');
for(const name of fs.readdirSync(path.join(root,'assets/fonts')).filter(n=>/OFL\.txt$/i.test(n)))visit('assets/fonts/'+name);
for(const name of ['.gitignore','.vercelignore','vercel.json','tests/entrance.test.cjs','tests/waveforms.test.cjs','tests/ui-controls.test.cjs','tests/package-closure.cjs'])visit(name);
for(const forbidden of ['CHATGPT_IMAGE_PROMPTS.md','ictra-theme.css','assets/web/byteflies-official-neck-setup.png','assets/web/biosignal-acquisition-sites-v2.png']){
  if(files.has(forbidden))throw Error('Unintended release dependency: '+forbidden);
}
const sorted=[...files].sort();
for(const required of ['assets/video/intro.mp4','assets/video/intro-poster.jpg','site-entrance.css','site-entrance.js']){
  if(!files.has(required))throw Error('Missing required entrance asset: '+required);
}
if(process.argv.includes('--json'))console.log(JSON.stringify(sorted));
else console.log(JSON.stringify({files:sorted.length,bytes:sorted.reduce((sum,f)=>sum+fs.statSync(path.join(root,f)).size,0),missing:0,unrelatedAndUnlicensedFilesExcluded:true},null,2));
