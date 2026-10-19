const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const root=path.resolve(process.env.MARKETING_OUTPUT||path.join(__dirname,'_site'));
const site=require('./site.json');
for(const name of ['index.html','privacy/index.html','support/index.html','terms/index.html','404.html']){
  const file=path.join(root,name),html=fs.readFileSync(file,'utf8');
  assert(html.includes('<html lang="en">'),name+' missing language');
  assert(html.includes('id="main"'),name+' missing main anchor');
  assert(!/V1.*draft|contact information will be published|TODO|undefined/.test(html),name+' contains placeholders');
  for(const [,link] of html.matchAll(/(?:src|href)="([^"]+)"/g)){
    if(/^(https?:|mailto:|#)/.test(link))continue;
    const target=path.resolve(path.dirname(file),link.split('#')[0]);
    assert(target.startsWith(root),name+' escapes publish folder');
    assert(fs.existsSync(target),name+' broken asset/link '+link);
  }
}
assert(fs.readFileSync(path.join(root,'support/index.html'),'utf8').includes('mailto:'+site.supportEmail));
assert(fs.readFileSync(path.join(root,'index.html'),'utf8').includes('requires Apple'));
assert(!fs.existsSync(path.join(root,'CNAME')),'Do not move marlow.lol away from the live app');
(async()=>{const sharp=require('sharp');for(const a of require(path.join(root,'assets/manifest.json')).assets){const m=await sharp(path.join(root,'assets',a.name)).metadata();assert.equal(m.width,a.width);assert.equal(m.height,a.height);assert.equal(m.hasAlpha,false);}console.log('Validated all pages, local links, contact, beta disclosure, domain safety and artwork dimensions.');})().catch(e=>{console.error(e);process.exit(1)});
