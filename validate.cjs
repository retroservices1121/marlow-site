const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const root=path.resolve(process.env.MARKETING_OUTPUT||path.join(__dirname,'_site'));
const site=require('./site.json');
for(const name of ['index.html','privacy/index.html','support/index.html','terms/index.html','404.html']){
  const file=path.join(root,name),html=fs.readFileSync(file,'utf8');
  assert(html.includes('<html lang="en">'),name+' missing language');
  assert(html.includes('id="main"'),name+' missing main anchor');
  assert(!/V1.*draft|contact information will be published|TODO|undefined/.test(html),name+' contains placeholders');
  assert(!html.includes('/login') && !html.includes('Sign in'),name+' still contains a sign-in link');
  assert(!/marlowe\.io/i.test(html),name+' still references marlowe.io');
  for(const icon of ['favicon.ico?v=2','assets/favicon-32.png?v=2','assets/favicon-192.png?v=2','assets/apple-touch-icon.png?v=2']) assert(html.includes(icon),name+' missing '+icon);
  for(const [,link] of html.matchAll(/(?:src|href)="([^"]+)"/g)){
    if(/^(https?:|mailto:|#)/.test(link))continue;
    const target=path.resolve(path.dirname(file),link.split(/[?#]/)[0]);
    assert(target.startsWith(root),name+' escapes publish folder');
    assert(fs.existsSync(target),name+' broken asset/link '+link);
  }
}
assert(fs.readFileSync(path.join(root,'support/index.html'),'utf8').includes('mailto:'+site.supportEmail));
assert(fs.readFileSync(path.join(root,'index.html'),'utf8').includes('requires Apple'));
assert(!fs.existsSync(path.join(root,'CNAME')),'Do not move marlow.lol away from the live app');
(async()=>{const sharp=require('sharp');for(const a of require(path.join(root,'assets/manifest.json')).assets){const m=await sharp(path.join(root,'assets',a.name)).metadata();assert.equal(m.width,a.width);assert.equal(m.height,a.height);assert.equal(m.hasAlpha,false);}for(const [name,size] of Object.entries({'assets/favicon-32.png':32,'assets/favicon-192.png':192,'assets/apple-touch-icon.png':180})){const m=await sharp(path.join(root,name)).metadata();assert.equal(m.format,'png');assert.equal(m.width,size);assert.equal(m.height,size);}const ico=fs.readFileSync(path.join(root,'favicon.ico'));assert.equal(ico.readUInt16LE(2),1);assert.equal(ico.readUInt16LE(4),3);for(const [i,size] of [16,32,48].entries()){assert.equal(ico.readUInt8(6+i*16),size);assert.equal(ico.readUInt8(7+i*16),size);}console.log('Validated all pages, local links, contact, beta disclosure, domain safety, artwork dimensions and favicons.');})().catch(e=>{console.error(e);process.exit(1)});
