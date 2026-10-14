// Checks every internal link, #anchor and asset reference in dist/. No browser needed.
import { readdirSync, readFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';
const DIST = 'dist';
if (!existsSync(DIST)) { console.error('dist/ not found. Run npm run build first.'); process.exit(1); }
const pages = readdirSync(DIST).filter(f => f.endsWith('.html'));
const html = Object.fromEntries(pages.map(f => [f, readFileSync(join(DIST, f), 'utf8')]));
let problems = 0;
for (const [file, src] of Object.entries(html)) {
  const refs = [...src.matchAll(/\s(?:href|src|srcset)="([^"]+)"/g)].map(m => m[1]);
  for (const ref of refs) {
    if (/^(https?:|tel:|mailto:|data:)/.test(ref)) continue;
    const [path, hash] = ref.split('#');
    const target = path || file;
    if (!existsSync(join(DIST, target))) { console.log(`missing file   ${file} -> ${ref}`); problems++; continue; }
    if (hash && target.endsWith('.html') && !html[target].includes(`id="${hash}"`)) { console.log(`missing anchor ${file} -> ${ref}`); problems++; }
  }
}
// assets referenced from CSS and JS
for (const f of ['assets/site.css', 'assets/site.js']) {
  const src = readFileSync(join(DIST, f), 'utf8');
  for (const m of src.matchAll(/["'(](assets\/[\w./-]+)["')]/g)) if (!existsSync(join(DIST, m[1]))) { console.log(`missing asset  ${f} -> ${m[1]}`); problems++; }
}
console.log(`${pages.length} pages checked, ${problems} problem(s)`);
process.exit(problems ? 1 : 0);
