// Converts locally downloaded Pexels originals (pexels-<id>.jpg) into public/assets/stock/<name>.webp.
// Usage: node scripts/import-stock.mjs <folder-with-originals>
import sharp from 'sharp';
import { existsSync, mkdirSync } from 'node:fs';
import { STOCK } from '../src/stock.mjs';
const dir = process.argv[2];
mkdirSync('public/assets/stock', { recursive: true });
for (const [name, s] of Object.entries(STOCK)) {
  const src = `${dir}/pexels-${s.id}.jpg`;
  if (!existsSync(src)) { console.log(`missing  ${name} (${s.id})`); continue; }
  await sharp(src).rotate().resize({ width: s.w, withoutEnlargement: true }).webp({ quality: 78 }).toFile(`public/assets/stock/${name}.webp`);
  console.log(`ok       ${name}`);
}
