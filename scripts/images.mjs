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
await crop(h1, [0, 110, 736, 702], 1600, 'hero-wide.webp', 78);          // desktop hero: sky for the wordmark
await crop(h1, [0, 0, 736, 922], 900, 'hero-tall.webp', 78);           // phone hero
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
// Foreground cut-out of the helicopter, same crops as the hero images, so the wordmark can sit behind it
await sharp('assets-src/helipad-black-cutout.png').extract({ left: 0, top: 110, width: 736, height: 702 }).resize({ width: 1600, kernel: 'lanczos3' }).sharpen(sharpen).modulate({ saturation: 1.04 }).webp({ quality: 80, alphaQuality: 90 }).toFile(out + 'hero-wide-fg.webp');
await sharp('assets-src/helipad-black-cutout.png').resize({ width: 900, kernel: 'lanczos3' }).sharpen(sharpen).modulate({ saturation: 1.04 }).webp({ quality: 80, alphaQuality: 90 }).toFile(out + 'hero-tall-fg.webp');
