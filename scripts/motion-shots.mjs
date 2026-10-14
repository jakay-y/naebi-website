// Captures the home intro (loader → hero) and scroll states, for visual checks.
import { chromium } from 'playwright-core';
import http from 'node:http'; import { readFileSync, existsSync, mkdirSync } from 'node:fs'; import { join, extname } from 'node:path';
const SITE = join(process.cwd(), 'dist'); mkdirSync('test-output', { recursive: true });
const T = { '.html': 'text/html', '.css': 'text/css', '.js': 'text/javascript', '.png': 'image/png', '.webp': 'image/webp', '.jpg': 'image/jpeg' };
const srv = http.createServer((q, r) => { let p = decodeURIComponent(q.url.split(/[?#]/)[0]); if (p === '/') p = '/index.html'; const f = join(SITE, p); if (!existsSync(f)) { r.writeHead(404); return r.end(); } r.writeHead(200, { 'content-type': T[extname(f)] }); r.end(readFileSync(f)); }).listen(4180);
const fontCss = ['Light:300', 'Regular:400', 'Medium:500', 'SemiBold:600', 'Bold:700'].map(s => { const [n, w] = s.split(':'); return `@font-face{font-family:"Geist";font-weight:${w};src:url(data:font/woff2;base64,${readFileSync(`node_modules/geist/dist/fonts/geist-sans/Geist-${n}.woff2`).toString('base64')}) format("woff2")}`; }).join('');
const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome', args: ['--use-gl=swiftshader', '--enable-unsafe-swiftshader'] });
async function page(w, h, skipLoader) {
  const ctx = await b.newContext({ viewport: { width: w, height: h } });
  await ctx.route('https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.min.js', r => r.fulfill({ body: readFileSync('node_modules/three/build/three.min.js'), contentType: 'text/javascript' }));
  await ctx.route('https://fonts.googleapis.com/**', r => r.fulfill({ body: fontCss, contentType: 'text/css' }));
  const p = await ctx.newPage(); p.on('pageerror', e => console.log('pageerror', e.message));
  if (skipLoader) await p.addInitScript(() => sessionStorage.setItem('naebi-visited', '1'));
  return p;
}
const [what = 'home', w = 1440, h = 900] = process.argv.slice(2);
if (what === 'intro') {
  const p = await page(+w, +h, false); await p.goto('http://localhost:4180/index.html');
  for (const t of [3000, 3400, 3900, 4800]) { await p.waitForTimeout(t === 3000 ? 3000 : (t - [3000, 3400, 3900, 4800][[3000, 3400, 3900, 4800].indexOf(t) - 1])); await p.screenshot({ path: `test-output/intro-${t}.png` }); }
} else {
  const p = await page(+w, +h, true); await p.goto(`http://localhost:4180/${what}.html`); await p.waitForTimeout(2200);
  for (const y of (process.argv[5] || '0,450,900').split(',').map(Number)) {
    await p.evaluate(y => scrollTo(0, y), y); await p.waitForTimeout(1500);
    await p.screenshot({ path: `test-output/${what}-${w}-y${y}.png` });
  }
}
await b.close(); srv.close();
