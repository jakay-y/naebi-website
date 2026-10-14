// Downloads the Pexels photos listed in src/stock.mjs into public/assets/stock/ as optimised WebP.
// Runs before every build. Existing files are kept (use --force to refresh). Never fails the build:
// a photo that can't be downloaded simply falls back to the bundled image.
import { existsSync, mkdirSync } from 'node:fs';
import { STOCK, pexelsUrl } from '../src/stock.mjs';
let sharp = null;
try { sharp = (await import('sharp')).default; } catch { console.warn('[stock] sharp not installed, skipping'); process.exit(0); }
const DIR = 'public/assets/stock/';
mkdirSync(DIR, { recursive: true });
const force = process.argv.includes('--force');
let got = 0, kept = 0, failed = 0;
await Promise.all(Object.entries(STOCK).map(async ([name, s]) => {
  const out = `${DIR}${name}.webp`;
  if (existsSync(out) && !force) { kept++; return; }
  try {
    const ctl = new AbortController(); const t = setTimeout(() => ctl.abort(), 20000);
    const res = await fetch(pexelsUrl(s.id, Math.max(s.w, 1200)), { signal: ctl.signal, headers: { 'user-agent': 'naebi-website-build' } });
    clearTimeout(t);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const buf = Buffer.from(await res.arrayBuffer());
    await sharp(buf).rotate().resize({ width: s.w, withoutEnlargement: true }).webp({ quality: 74 }).toFile(out);
    got++;
  } catch (e) { failed++; console.warn(`[stock] ${name} (${s.id}): ${e.message}, using ${s.fallback}`); }
}));
console.log(`[stock] downloaded ${got}, kept ${kept}, fell back ${failed}`);
