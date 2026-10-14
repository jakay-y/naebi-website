// Serves dist/ locally, maps CDN requests to local copies, screenshots pages and checks links.
import { chromium } from 'playwright-core';
import http from 'node:http';
import { readFileSync, existsSync, mkdirSync } from 'node:fs';
import { join, extname } from 'node:path';
const SITE = join(process.cwd(), 'dist');
const TYPES = { '.html': 'text/html', '.css': 'text/css', '.js': 'text/javascript', '.png': 'image/png', '.webp': 'image/webp', '.svg': 'image/svg+xml' };
const server = http.createServer((req, res) => {
  let p = decodeURIComponent(req.url.split(/[?#]/)[0]); if (p === '/') p = '/index.html';
  const f = join(SITE, p);
  if (!existsSync(f)) { res.writeHead(404); return res.end('404'); }
  let body = readFileSync(f);
  res.writeHead(200, { 'content-type': TYPES[extname(f)] || 'application/octet-stream' }); res.end(body);
}).listen(4173);
const fontCss = ['Light:300', 'Regular:400', 'Medium:500', 'SemiBold:600', 'Bold:700'].map(s => { const [n, w] = s.split(':');
  return `@font-face{font-family:"Geist";font-weight:${w};font-display:swap;src:url(data:font/woff2;base64,${readFileSync(`node_modules/geist/dist/fonts/geist-sans/Geist-${n}.woff2`).toString('base64')}) format("woff2")}`; }).join('\n');
const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome', args: ['--use-gl=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'] });
async function newPage(w, h) {
  const ctx = await browser.newContext({ viewport: { width: w, height: h }, deviceScaleFactor: 1 });
  await ctx.route('https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.min.js', r => r.fulfill({ body: readFileSync('node_modules/three/build/three.min.js'), contentType: 'text/javascript' }));
  await ctx.route('https://fonts.googleapis.com/**', r => r.fulfill({ body: fontCss, contentType: 'text/css' }));
  const p = await ctx.newPage();
  p.on('console', m => { if (m.type() === 'error') console.log('  console error:', m.text()); });
  p.on('pageerror', e => console.log('  pageerror:', e.message));
  return p;
}
mkdirSync('test-output', { recursive: true });
const mode = process.argv[2] || 'shots';
if (mode === 'loader') {
  const p = await newPage(1280, 800);
  await p.goto('http://localhost:4173/index.html');
  for (const t of [400, 1300, 2600]) { await p.waitForTimeout(t === 400 ? 400 : t - 400); await p.screenshot({ path: `test-output/loader-${t}.png` }); }
  await p.waitForTimeout(2600); await p.screenshot({ path: 'test-output/after-loader.png' });
} else if (mode === 'shots') {
  const pages = (process.argv[3] || 'index').split(',');
  for (const name of pages) for (const [w, h, tag] of [[1440, 900, 'd'], [390, 844, 'm']]) {
    const p = await newPage(w, h);
    await p.addInitScript(() => sessionStorage.setItem('naebi-visited', '1'));
    await p.goto(`http://localhost:4173/${name}.html`); await p.waitForTimeout(600);
    // scroll through to trigger reveals, then back to top
    const H = await p.evaluate(() => document.documentElement.scrollHeight);
    for (let y = 0; y < H; y += 500) { await p.evaluate(y => scrollTo(0, y), y); await p.waitForTimeout(60); }
    await p.evaluate(() => { document.querySelectorAll('.rv').forEach(e => e.classList.remove('pre')); scrollTo(0, 0); }); await p.waitForTimeout(900);
    const ow = await p.evaluate(() => document.documentElement.scrollWidth - innerWidth);
    if (ow > 0) console.log(`  ${name} ${tag}: horizontal overflow ${ow}px`);
    await p.screenshot({ path: `test-output/${name}-${tag}.png`, fullPage: true });
    await p.close();
  }
} else if (mode === 'links') {
  const p = await newPage(1280, 800);
  await p.addInitScript(() => sessionStorage.setItem('naebi-visited', '1'));
  const files = ['index', 'about', 'services', 'operators', 'verify', 'newsroom', 'contact', 'legal'];
  let bad = 0, ext = new Set();
  for (const f of files) {
    await p.goto(`http://localhost:4173/${f}.html`); await p.waitForTimeout(150);
    const links = await p.$$eval('a[href]', as => as.map(a => a.getAttribute('href')));
    for (const href of links) {
      if (/^(https?:|tel:|mailto:)/.test(href)) { if (href.startsWith('http')) ext.add(href); continue; }
      const [file, hash] = href.split('#'); const target = file || `${f}.html`;
      if (!existsSync(join(SITE, target))) { console.log(`  BROKEN ${f}.html -> ${href}`); bad++; continue; }
      if (hash) { const html = readFileSync(join(SITE, target), 'utf8'); if (!html.includes(`id="${hash}"`) && !['main'].includes(hash)) { console.log(`  MISSING ANCHOR ${f}.html -> ${href}`); bad++; } }
    }
    const imgs = await p.$$eval('img', im => im.filter(i => i.complete && i.naturalWidth === 0 && !i.loading).map(i => i.src));
    imgs.forEach(s => { console.log('  BROKEN IMG', f, s); bad++; });
  }
  console.log(`internal link problems: ${bad}`); console.log('external links:\n  ' + [...ext].join('\n  '));
}
await browser.close(); server.close();
