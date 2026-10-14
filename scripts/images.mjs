// Regenerates the optimised images in public/assets from the cleaned sources in assets-src/.
// The helicopter photos already have third-party operator markings removed.
import sharp from 'sharp';
const out = 'public/assets/';
const h1 = 'assets-src/helipad-black.png', h2 = 'assets-src/waterfall-blue.png';
// 3D mark: trim transparent padding, export at display sizes
const mark = await sharp('assets-src/mark-3d-render.png').trim({ threshold: 2 }).toBuffer();
await sharp(mark).resize({ height: 160 }).png({ compressionLevel: 9 }).toFile(out + 'mark-3d.png');
await sharp(mark).resize({ height: 480 }).png({ compressionLevel: 9 }).toFile(out + 'mark-3d-lg.png');
await sharp(mark).resize(64, 64, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } }).png().toFile(out + 'favicon.png');
const sharpen = { sigma: 0.8, m1: 0.6, m2: 1.4 };
async function crop(src, [l, t, w, h], width, name, q = 80) {
  await sharp(src).extract({ left: l, top: t, width: w, height: h })
    .resize({ width, kernel: 'lanczos3' }).sharpen(sharpen).modulate({ saturation: 1.04 })
    .webp({ quality: q }).toFile(out + name);
}
// Photo 1: black helicopter on a clifftop helipad, sky above (736x922)
// Home hero: 'Front View of a Helicopter' (Pexels 23124351), 2400x3600, plus its background-removed cut-out
const HERO = 'assets-src/hero-heli.jpg', HERO_FG = 'assets-src/hero-heli-cutout.png';
await sharp(HERO).extract({ left: 0, top: 900, width: 2400, height: 2000 }).resize({ width: 2200 }).webp({ quality: 76 }).toFile(out + 'hero-wide.webp');
await sharp(HERO).resize({ width: 1200 }).webp({ quality: 76 }).toFile(out + 'hero-tall.webp');
await crop(h1, [90, 300, 646, 300], 1000, 'helipad.webp');              // helicopter on the pad
await crop(h1, [130, 440, 600, 300], 900, 'pad-marking.webp');          // the H marking
await crop(h1, [40, 270, 340, 260], 700, 'tail-rotor.webp');            // tail rotor detail
await crop(h1, [0, 120, 736, 700], 1400, 'cta-bg.webp', 70);            // footer CTA background
// Photo 2: blue helicopter beside a waterfall (1080x1350)
await crop(h2, [0, 420, 1080, 780], 1200, 'field-wide.webp');          // big services card
await crop(h2, [0, 160, 1080, 1190], 900, 'field-tall.webp');          // FAQ portrait
await crop(h2, [600, 760, 480, 470], 700, 'cockpit.webp');              // cockpit / nose
await crop(h2, [330, 960, 700, 380], 900, 'skids.webp');                // skids on grass
await crop(h2, [280, 560, 700, 300], 900, 'rotor-head.webp');           // rotor head and cowling
await crop(h2, [0, 0, 560, 700], 700, 'waterfall.webp');                // landing site, no aircraft
console.log('done');
// Foreground cut-out, same crops as the hero images, so the wordmark sits behind the helicopter
await sharp(HERO_FG).extract({ left: 0, top: 900, width: 2400, height: 2000 }).resize({ width: 2200 }).webp({ quality: 80, alphaQuality: 92 }).toFile(out + 'hero-wide-fg.webp');
await sharp(HERO_FG).resize({ width: 1200 }).webp({ quality: 80, alphaQuality: 92 }).toFile(out + 'hero-tall-fg.webp');
// Social share image (1200x630) and home-screen icon
const ogBg = await sharp(HERO).extract({ left: 0, top: 1150, width: 2400, height: 1260 }).resize(1200, 630, { kernel: 'lanczos3' }).modulate({ brightness: 0.82 }).toBuffer();
const ogMark = await sharp('assets-src/mark-3d-render.png').trim({ threshold: 2 }).resize({ height: 150 }).toBuffer();
await sharp(ogBg).composite([{ input: ogMark, left: 64, top: 64 }]).jpeg({ quality: 82, mozjpeg: true }).toFile(out + 'og.jpg');
await sharp({ create: { width: 180, height: 180, channels: 4, background: '#070c18' } })
  .composite([{ input: await sharp('assets-src/mark-3d-render.png').trim({ threshold: 2 }).resize({ height: 130 }).toBuffer(), gravity: 'center' }])
  .png().toFile(out + 'apple-touch-icon.png');
