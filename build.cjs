/* Static marketing site only. No database, credentials, user records or app bundle. */
const fs = require('node:fs');
const path = require('node:path');
const sharp = require('sharp');
const c = require('./site.json');
const content = require('./content.json');
const out = path.resolve(process.env.MARKETING_OUTPUT || path.join(__dirname, '_site'));
const asset = path.join(out, 'assets');
const sourceAsset = path.join(__dirname, 'assets');
fs.mkdirSync(asset, {recursive:true});
const esc = s => String(s).replace(/[&<>"']/g, x=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[x]));
if (!c.operator || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(c.supportEmail)) throw Error('Set operator and a real support email before publishing');
const fontRoot = fs.existsSync(path.join(sourceAsset,'poppins-bold.ttf')) ? sourceAsset : path.resolve(__dirname,'../../apps/mobile/node_modules/@expo-google-fonts/poppins');
const bold = fs.existsSync(path.join(fontRoot,'poppins-bold.ttf')) ? path.join(fontRoot,'poppins-bold.ttf') : path.join(fontRoot,'800ExtraBold/Poppins_800ExtraBold.ttf');
const regular = fs.existsSync(path.join(fontRoot,'poppins-regular.ttf')) ? path.join(fontRoot,'poppins-regular.ttf') : path.join(fontRoot,'400Regular/Poppins_400Regular.ttf');
const logo = fs.existsSync(path.join(sourceAsset,'marlow-lockup.png')) ? path.join(sourceAsset,'marlow-lockup.png') : path.resolve(__dirname,'../../public/brand/marlow-lockup.png');
const icon = fs.existsSync(path.join(sourceAsset,'marlow-avatar.png')) ? path.join(sourceAsset,'marlow-avatar.png') : path.resolve(__dirname,'../../public/brand/marlow-avatar.png');
const svg = (w,h,body) => Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">${body}</svg>`);
const rect=(x,y,w,h,r,fill,stroke='none')=>`<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${r}" fill="${fill}" stroke="${stroke}"/>`;
const circle=(x,y,r,fill,stroke='none')=>`<circle cx="${x}" cy="${y}" r="${r}" fill="${fill}" stroke="${stroke}"/>`;
const colors=['#3B82FF','#FF4DA6','#A855FF','#22D3EE'];
// Pango renders the actual bundled Poppins font rather than a system-font substitute.
async function text(str,size,color='#f4f4f8',weight=800,width=1000){return sharp({text:{text:`<span foreground="${color}">${esc(str)}</span>`,font:`Poppins ${weight===800?'ExtraBold':'Regular'} ${size}`,fontfile:weight===800?bold:regular,rgba:true,width:Math.round(width),wrap:'word',spacing:6}}).png().toBuffer();}
async function label(layers,str,x,y,size,color,weight,width){const input=await text(str,size,color,weight,width);layers.push({input,left:Math.round(x),top:Math.round(y)});return sharp(input).metadata();}
async function screen(kind){
  const w=390,h=844,layers=[];
  let b=rect(0,0,w,h,0,'#0B0B0F');
  if(kind==='circles'){
    b+=circle(344,112,26,'#FF4DA6');
    for(const [y,name] of [[248,'Family'],[480,'The weekend crew']]){
      b+=rect(20,y,350,216,28,'#111117','#292931');
      b+=circle(164,y+70,58,'#101725','#243451')+circle(226,y+70,58,'#211522','#49243b');
      for(let i=0;i<4;i++){const x=131+i*43;b+=rect(x-20,y+83,10,10,3,colors[i])+circle(x,y+62,26,'#0b0b0f',colors[i])+circle(x,y+62,21,colors[i]+'24');await label(layers,['A','J','S','R'][i],x-6,y+53,16,colors[i],800,40);}
      b+=rect(36,y+162,155,39,14,'#f4f4f8')+rect(199,y+162,155,39,14,'#1b1b1b','#303030');
      await label(layers,name,kind==='circles'&&name==='Family'?151:85,y+107,24,'#f4f4f8',800,300);
      await label(layers,'4 people',170,y+139,12,'#b0b0c0',400,100);
      await label(layers,'Open Circle',75,y+172,12,'#0b0b0f',800,140);
      await label(layers,'Invite +',250,y+172,12,'#ff4da6',800,100);
    }
    await label(layers,'YOUR PEOPLE',20,82,11,'#ff4da6',800,300);await label(layers,'Circles',20,106,48,'#fff',800,300);await label(layers,'+',334,95,29,'#0b0b0f',800,50);
    await label(layers,'Different groups know different sides\nof you.',20,184,16,'#888888',400,330);
  }else if(kind==='play'){
    b+=rect(14,76,362,640,32,'#ff4da6')+rect(32,94,70,30,15,'#ffffff');
    await label(layers,'PICK 1',43,103,11,'#090909',800,80);await label(layers,'1/12',321,100,12,'#6b2449',800,60);
    await label(layers,'Who gives the\nbest advice?',32,147,34,'#090909',800,320);
    for(let i=0;i<4;i++){const x=32+(i%2)*167,y=276+Math.floor(i/2)*180;b+=rect(x,y,157,170,25,['#ff4da6','#a855ff','#22d3ee','#a855ff'][i])+circle(x+41,y+41,27,'#ffffff');await label(layers,['A','J','S','R'][i],x+34,y+29,20,'#090909',800,50);await label(layers,['Alex','Jamie','Sam','Riley'][i],x+14,y+128,21,'#090909',800,145);}
    await label(layers,'Skip this one',145,670,12,'#77264e',800,180);
  }else{
    b+=rect(22,80,58,58,20,'#ff4da6');await label(layers,'A',42,94,22,'#090909',800,40);await label(layers,'Alex',94,85,18,'#fff',800,200);await label(layers,'@alex',94,112,11,'#b0b0c0',400,180);await label(layers,'EDIT',330,99,11,'#ff4da6',800,70);
    await label(layers,'SETTINGS',292,160,11,'#999999',800,90);
    b+=rect(14,196,362,260,32,'#ff4da6');await label(layers,'APPARENTLY…',36,218,11,'#090909',800,300);await label(layers,'12 real picks\nare shaping\nyour profile.',36,258,36,'#090909',800,325);
    await label(layers,'HOW THEY SEE YOU',14,488,11,'#b0b0c0',800,340);
    for(let i=0;i<2;i++){b+=rect(14+i*185,520,175,110,22,'#111118');await label(layers,['Thoughtful','Funny'][i],30+i*185,539,18,'#fff',800,150);await label(layers,'FORMING',30+i*185,598,10,'#b0b0c0',800,145);}
    await label(layers,'RECEIPTS',14,662,11,'#b0b0c0',800,300);b+=rect(14,690,362,60,22,'#a855ff');await label(layers,'Who gives the best advice?',30,704,15,'#090909',800,330);await label(layers,'4 picks · 3 people',30,727,10,'#28123e',400,300);
  }
  b+=rect(14,758,362,72,27,'#15151d','#30303a');
  const active=kind==='play'?0:kind==='you'?1:2;
  b+=rect(38+active*118,768,60,29,15,'#ff4da624');
  for(let i=0;i<3;i++){
    const x=68+i*118,col=i===active?'#ff4da6':'#b0b0c0';
    if(i===0)b+=`<path d="M${x-7} 774l14 8-14 8z" fill="${col}"/>`;
    if(i===1)b+=circle(x,778,5,col)+rect(x-9,786,18,8,7,col);
    if(i===2)b+=circle(x-5,782,8,'#3b82ff')+circle(x+5,782,8,'#ff4da6');
    await label(layers,['Play','You','Circles'][i],x-(i===2?20:13),804,11,col,800,90);
  }
  await label(layers,'9:41',26,22,13,'#f4f4f8',800,80);await label(layers,'•••  ▰',306,23,12,'#f4f4f8',800,70);
  return sharp(svg(w,h,b)).composite(layers).png().toBuffer();
}
async function composition(kind,title,subtitle,num){
  const w=1320,h=2868,layers=[];
  const bg=`<defs><radialGradient id="a"><stop stop-color="#3b82ff" stop-opacity=".22"/><stop offset="1" stop-color="#0b0b0f" stop-opacity="0"/></radialGradient><radialGradient id="b"><stop stop-color="#ff4da6" stop-opacity=".2"/><stop offset="1" stop-color="#0b0b0f" stop-opacity="0"/></radialGradient></defs>`+rect(0,0,w,h,0,'#0b0b0f')+circle(100,1100,900,'url(#a)')+circle(1260,2300,900,'url(#b)');
  await label(layers,'MARLOW LOL',90,100,26,'#ff4da6',800,1100);
  await label(layers,title,90,190,94,'#f4f4f8',800,1140);
  await label(layers,subtitle,90,455,32,'#b0b0c0',400,1140);
  const shot=await screen(kind);await sharp(shot).toFile(path.join(asset,`screen-${kind}-sample.png`));
  const phone=await sharp(shot).resize(858,1857).png().toBuffer();
  layers.push({input:svg(894,1893,rect(0,0,894,1893,79,'#030306','#363641')),left:213,top:690});
  layers.push({input:phone,left:231,top:708});
  await label(layers,'your friends have opinions lol',90,2680,31,'#f4f4f8',400,1140);
  await label(layers,'Illustrative app preview · sample people and picks',90,2768,22,'#b0b0c0',400,1140);
  const name=`${num}-${kind}-preview.png`;await sharp(svg(w,h,bg)).composite(layers).removeAlpha().png().toFile(path.join(asset,name));return name;
}
async function banner(w,h,name){
  const layers=[];const s=w/1200;
  const b=`<defs><radialGradient id="g"><stop stop-color="#a855ff" stop-opacity=".22"/><stop offset="1" stop-color="#0b0b0f" stop-opacity="0"/></radialGradient></defs>`+rect(0,0,w,h,0,'#0b0b0f')+circle(w*.72,h*.5,h*.8,'url(#g)')+circle(w*.95,h*.13,h*.32,'#3b82ff10')+circle(w*.9,h*.8,h*.35,'#ff4da610');
  const resized=await sharp(logo).resize({width:Math.round(w*.36),height:Math.round(h*.82),fit:'inside'}).png().toBuffer();const m=await sharp(resized).metadata();layers.push({input:resized,left:Math.round(w*.61),top:Math.round((h-m.height)/2)});
  await label(layers,'MARLOW LOL',60*s,75*s,20*s,'#ff4da6',800,w*.52);
  await label(layers,'Your people.\nYour plot twist.',60*s,155*s,62*s,'#f4f4f8',800,w*.55);
  await label(layers,c.tagline,60*s,355*s,23*s,'#b0b0c0',400,w*.54);
  await label(layers,'marlow.lol',60*s,Math.min(h-55*s,485*s),20*s,'#22d3ee',800,w*.5);
  await sharp(svg(w,h,b)).composite(layers).removeAlpha().png().toFile(path.join(asset,name));
}
// Page header only. Favicon and the published app icon stay on the original opaque avatar.
async function headerMark(src, dest) {
  const {data, info} = await sharp(src).removeAlpha().raw().toBuffer({resolveWithObject:true});
  const w = info.width, h = info.height, cutoff = 42;
  const bg = new Uint8Array(w * h);
  const qx = new Int32Array(w * h), qy = new Int32Array(w * h);
  let qe = 0;
  const maxAt = (x, y) => { const i = (y * w + x) * 3; return Math.max(data[i], data[i + 1], data[i + 2]); };
  const push = (x, y) => {
    const p = y * w + x;
    if (bg[p] || maxAt(x, y) > cutoff) return;
    bg[p] = 1; qx[qe] = x; qy[qe] = y; qe++;
  };
  for (let x = 0; x < w; x++) { push(x, 0); push(x, h - 1); }
  for (let y = 0; y < h; y++) { push(0, y); push(w - 1, y); }
  for (let qs = 0; qs < qe; qs++) {
    const x = qx[qs], y = qy[qs];
    if (x > 0) push(x - 1, y);
    if (x + 1 < w) push(x + 1, y);
    if (y > 0) push(x, y - 1);
    if (y + 1 < h) push(x, y + 1);
  }
  const out = Buffer.alloc(w * h * 4);
  for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
    const p = y * w + x, i = p * 3, o = p * 4;
    if (bg[p]) continue;
    let r = data[i], g = data[i + 1], b = data[i + 2];
    const touch = (x > 0 && bg[p - 1]) || (x + 1 < w && bg[p + 1]) || (y > 0 && bg[p - w]) || (y + 1 < h && bg[p + w]);
    if (touch) {
      const m = Math.max(r, g, b, 1), a = m / 255;
      out[o] = Math.min(255, Math.round(r / a));
      out[o + 1] = Math.min(255, Math.round(g / a));
      out[o + 2] = Math.min(255, Math.round(b / a));
      out[o + 3] = m;
    } else {
      out[o] = r; out[o + 1] = g; out[o + 2] = b; out[o + 3] = 255;
    }
  }
  await sharp(out, {raw:{width:w, height:h, channels:4}}).png().toFile(dest);
}
function layout(title,description,body,depth=0,slug=''){
  const p=depth?'../':'./',url=c.siteUrl.replace(/\/$/,'')+(slug?`/${slug}/`:'/');
  return `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${esc(title)} | Marlow LoL</title><meta name="description" content="${esc(description)}"><link rel="canonical" href="${esc(url)}"><meta property="og:type" content="website"><meta property="og:title" content="${esc(title)} | Marlow LoL"><meta property="og:description" content="${esc(description)}"><meta property="og:url" content="${esc(url)}"><meta property="og:image" content="${esc(c.siteUrl)}/assets/marlow-social-preview.png"><meta property="og:image:width" content="1200"><meta property="og:image:height" content="630"><meta name="twitter:card" content="summary_large_image"><meta name="twitter:image" content="${esc(c.siteUrl)}/assets/marlow-social-preview.png"><link rel="icon" href="${p}assets/favicon.png"><link rel="stylesheet" href="${p}styles.css"></head><body><a class="skip" href="#main">Skip to content</a><header><a class="brand" href="${p}"><img src="${p}assets/marlow-header-mark.png" width="54" height="54" alt=""><span>Marlow<span class="gradient">.lol</span></span></a><nav aria-label="Main navigation"><a href="${p}#how-it-works">How it works</a><a href="${p}support/">Support</a></nav></header>${body}<footer><span>© ${new Date().getUTCFullYear()} ${esc(c.operator)} · Made for your people.</span><div><a href="${p}privacy/">Privacy</a><a href="${p}terms/">Terms</a><a href="${p}support/">Support</a></div></footer></body></html>`;
}
function previewPhones(){
  const tab=on=>`<div class="tabs" aria-hidden="true"><span class="${on==='Play'?'on':''}">Play</span><span class="${on==='You'?'on':''}">You</span><span class="${on==='Circles'?'on':''}">Circles</span></div><div class="home-bar" aria-hidden="true"></div>`;
  const faces=`<div class="avatar-row" aria-hidden="true"><span class="avatar a1">A</span><span class="avatar a2">J</span><span class="avatar a3">S</span><span class="avatar a4">R</span></div>`;
  const card=title=>`<article class="preview-card">${faces}<h4>${title}</h4><p>4 people</p><div class="pill-row"><span class="pill primary">Open Circle</span><span class="pill secondary">Invite</span></div></article>`;
  const circles=`<div class="phone-screen"><div class="status">9:41</div><h3>Circles</h3><p class="lead-in">Different groups know different sides of you.</p>${card('Family')}${card('The weekend crew')}${tab('Circles')}</div>`;
  const play=`<div class="phone-screen"><div class="status">9:41</div><h3>Who gives the best advice?</h3><div class="choices"><span class="pill"><span class="avatar a1">A</span>Alex</span><span class="pill"><span class="avatar a2">J</span>Jamie</span><span class="pill"><span class="avatar a3">S</span>Sam</span><span class="pill"><span class="avatar a4">R</span>Riley</span></div><p class="skip">Skip this one</p>${tab('Play')}</div>`;
  const you=`<div class="phone-screen"><div class="status">9:41</div><div class="profile"><span class="avatar a1">A</span><div><strong>Alex</strong><p>@alex</p></div></div><p class="lead-in">12 real picks are shaping your profile.</p><div class="traits"><span class="trait">Thoughtful</span><span class="trait">Funny</span></div><div class="note"><strong>Who gives the best advice?</strong><p>4 picks · 3 people</p></div>${tab('You')}</div>`;
  const fig=(screen,caption)=>`<figure class="phone"><div class="phone-frame">${screen}</div><figcaption>${caption}</figcaption></figure>`;
  return `<div class="screens">${fig(circles,'Keep your people close.')}${fig(play,'Pick someone you know.')}${fig(you,'Find out how they see you.')}</div>`;
}
async function main(){
  fs.copyFileSync(bold,path.join(asset,'poppins-bold.ttf'));fs.copyFileSync(regular,path.join(asset,'poppins-regular.ttf'));
  fs.copyFileSync(logo,path.join(asset,'marlow-lockup.png'));fs.copyFileSync(icon,path.join(asset,'marlow-avatar.png'));
  const license=path.resolve(path.dirname(bold),'../OFL.txt');if(fs.existsSync(license))fs.copyFileSync(license,path.join(asset,'Poppins-OFL.txt'));else if(fs.existsSync(path.join(sourceAsset,'Poppins-OFL.txt')))fs.copyFileSync(path.join(sourceAsset,'Poppins-OFL.txt'),path.join(asset,'Poppins-OFL.txt'));
  await sharp(icon).resize(64,64).png().toFile(path.join(asset,'favicon.png'));
  await headerMark(icon, path.join(asset,'marlow-header-mark.png'));
  const previews=[];previews.push(await composition('circles','Every side of you.\nOne Circle at a time.','Bring together the people who know you best.','01'));
  previews.push(await composition('play','Quick picks.\nReal friends.','Who gives the best advice? Your people decide.','02'));
  previews.push(await composition('you','See yourself\nthrough their eyes.','Discover the traits your friends see in you.','03'));
  await banner(1200,630,'marlow-social-preview.png');await banner(1600,600,'marlow-header.png');await banner(1200,1200,'marlow-square-search.png');
  fs.copyFileSync(path.join(__dirname,'styles.css'),path.join(out,'styles.css'));
  const body=`<main id="main"><section class="hero"><div><p class="eyebrow">Real friends. Fresh perspective.</p><h1>Your people.<br>Your <span class="gradient">plot twist.</span></h1><p class="lead">See yourself through everyone else's eyes. Quick picks from the friends who actually know you.</p><p class="tagline">${esc(c.tagline)}</p><div class="cta"><a class="button" href="${esc(c.testflightUrl)}">Join the iPhone beta</a><a class="button secondary" href="#how-it-works">Meet Marlow</a></div><p class="fine">18+ · iPhone beta requires Apple's TestFlight app.</p></div><div class="hero-art"><img src="./assets/marlow-lockup.png" width="1036" height="896" alt="Two overlapping blue and pink smiling bubbles above the Marlow.lol wordmark"></div></section><section id="how-it-works" class="section"><div class="section-heading"><p class="eyebrow">People talk. Marlow listens.</p><h2>Different groups.<br>Different sides of you.</h2></div><div class="cards"><article class="card"><span class="number">01 / YOUR PEOPLE</span><h3>Make your Circles.</h3><p>Family, besties, roommates. Invite the people who know a particular side of you.</p></article><article class="card"><span class="number">02 / THEIR OPINIONS</span><h3>Make a quick pick.</h3><p>Answer curated questions about people you know. Add at least two connections to start a round.</p></article><article class="card"><span class="number">03 / YOUR PERSPECTIVE</span><h3>Find your plot twist.</h3><p>See your picks and the traits forming on your profile. Sometimes your friends see something you don't.</p></article></div></section><section class="section"><p class="eyebrow">Inside Marlow</p><h2>Less scrolling.<br>More “wait, that's me?”</h2>${previewPhones()}<p class="fine">Illustrative app previews recreated from the current interface. Names, Circles and picks are sample data; these are not captured device screenshots.</p></section><section class="section"><div class="callout"><p class="eyebrow">Keep it kind. Keep it you.</p><h2>Real conversations.<br>Better perspectives.</h2><p>Curated questions. Invite-based Circles. Report and block controls when you need them.</p><div class="cta"><a class="button" href="${esc(c.testflightUrl)}">Try Marlow LoL</a><a class="button secondary" href="./support/">Get support</a></div></div></section></main>`;
  fs.writeFileSync(path.join(out,'index.html'),layout('Your friends have opinions lol','Quick picks from the friends who actually know you. Meet Marlow LoL and join the iPhone beta.',body));
  for(const [slug,page] of Object.entries(content)){
    fs.mkdirSync(path.join(out,slug),{recursive:true});
    const mail=`<p><a class="button" href="mailto:${esc(c.supportEmail)}?subject=${encodeURIComponent('Marlow LoL '+(slug==='privacy'?'privacy request':'support'))}">Email ${esc(c.supportEmail)}</a></p>`;
    const doc=`<main id="main" class="document"><p class="eyebrow">${esc(c.operator)}</p><h1>${esc(page.title)}</h1><p class="date">Updated ${esc(c.updated)}</p><p>${esc(page.intro)}</p>${slug==='support'?mail:''}${page.sections.map(s=>`<section><h2>${esc(s.title)}</h2>${s.paragraphs.map(p=>`<p>${esc(p)}</p>`).join('')}</section>`).join('')}${slug==='privacy'?mail:''}${slug==='support'?`<div class="cta"><a class="button secondary" href="${esc(c.testflightUrl)}">Open TestFlight beta</a></div>`:''}</main>`;
    fs.writeFileSync(path.join(out,slug,'index.html'),layout(page.title,page.intro,doc,1,slug));
  }
  fs.writeFileSync(path.join(out,'404.html'),layout('Page not found','Find your way back to Marlow.',`<main id="main" class="document"><h1>Wrong Circle?</h1><p>This page does not exist.</p><a class="button" href="${esc(c.siteUrl)}/">Back to Marlow</a></main>`));
  fs.writeFileSync(path.join(out,'.nojekyll'),'');
  fs.writeFileSync(path.join(out,'robots.txt'),`User-agent: *\nAllow: /\nSitemap: ${c.siteUrl}/sitemap.xml\n`);
  fs.writeFileSync(path.join(out,'sitemap.xml'),`<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${['','privacy/','support/','terms/'].map(s=>`<url><loc>${esc(c.siteUrl)}/${s}</loc></url>`).join('')}</urlset>`);
  const manifest={generated:new Date().toISOString(),appSource:'Project-Gas main, appVersion 0.1.0',assets:[...previews.map(name=>({name,width:1320,height:2868,use:'Illustrative marketing preview. Replace with a real-device or simulator capture before App Store submission.'})),{name:'marlow-header.png',width:1600,height:600,use:'Website/social header'},{name:'marlow-social-preview.png',width:1200,height:630,use:'Open Graph and search/link preview'},{name:'marlow-square-search.png',width:1200,height:1200,use:'Square social/search artwork'}]};
  fs.writeFileSync(path.join(out,'assets/manifest.json'),JSON.stringify(manifest,null,2));console.log('Built static site and six artwork files:',out);
}
main().catch(e=>{console.error(e);process.exit(1)});
