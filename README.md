# naebi-website

Website for **Naebi Dynamic Concepts Limited**, which monitors civil helicopter operations in Nigeria and administers landing and take-off charges on behalf of the Federal Ministry of Aviation.

It's a fast static site with no framework. A small Node script generates the eight pages from one set of templates, so the header, footer and loading screen stay identical everywhere and every internal link is checked.

## Quick start

```bash
npm install        # dev tools only (image processing, logo rendering, tests)
npm run build      # writes the site to dist/
npm test           # builds, then checks every internal link, #anchor and asset
npm run preview    # serves dist/ on http://localhost:3000
```

`npm run build` needs only Node 20+, not `npm install`, because the optimised images are committed in `public/assets/`.

## Pages

| Page | File | Purpose |
|---|---|---|
| Home | `index.html` | Hero with Verify box, mandate, services, coverage carousel, trust band, operator steps, news, FAQ |
| About | `about.html` | Company, `#mandate`, milestones, leadership, `#careers` |
| Services | `services.html` | `#monitoring`, `#charges`, `#technology`, `#consulting` |
| Operators | `operators.html` | How it works, `#charges`, `#pay`, `#query` (billing query form) |
| Verify | `verify.html` | Check a staff ID or payment account. `verify.html#NDC-PH-0142` pre-fills the check |
| Newsroom | `newsroom.html` | Press coverage (external links) |
| Contact | `contact.html` | Offices, phone, contact form |
| Legal | `legal.html` | `#privacy`, `#terms`, `#cookies`, `#accessibility` |

## Project structure

```
src/pages.mjs        page templates and content → dist/*.html
src/assets/          site.css, site.js (loader, nav, reveals, carousel, verify tool, forms), logo3d.js
public/assets/       optimised images, 3D logo renders, favicon (copied to dist/assets)
assets-src/          cleaned source photos, helicopter cut-out, 3D logo render, traced logo SVG
scripts/             images.mjs, render-logo.html + shot.mjs, check-links.mjs, browser-test.mjs
```

## The 3D logo

`src/assets/logo3d.js` builds the logo as four extruded, clear-coated pieces in three.js, with the brand gradients baked in. The geometry is traced from `assets-src/logo-original.webp` (see `assets-src/mark.svg`).

- **Loading screen:** the pieces assemble live. three.js r160 loads from jsDelivr only on the first page of a visit. If it can't load, a still render is shown instead.
- **Header, footer and favicon:** these use still renders (`public/assets/mark-3d*.png`). To re-render them after changing the logo:
  ```bash
  npm run logo     # needs Chromium; set the path in scripts/shot.mjs
  ```

## Images

- **Home hero:** "Front View of a Helicopter" (Pexels 23124351, 2400×3600) in `assets-src/hero-heli.jpg`. Its background-removed cut-out (`hero-heli-cutout.png`, made with rembg/BiRefNet) is layered on top so the giant "NAEBI" wordmark sits behind the aircraft. `npm run images` regenerates the hero, its cut-out and the share image.
- **Stock photos:** every section has its own photo from [Pexels](https://www.pexels.com/license/), listed in `src/stock.mjs` and credited on `legal.html#credits`. The optimised files are committed in `public/assets/stock/`. To change one, edit its id in `src/stock.mjs`, delete its `.webp`, and run `npm run images:stock` (needs internet) or `npm run build`.
- **CEO portrait:** taken from the original naebidynamic.com upload (`assets-src/ceo-original.png`, 914×777, the largest version on the old site). It was upscaled 2× with EDSR super-resolution (`assets-src/ceo-upscaled.png`) and exported as `public/assets/ceo.webp`. For a sharper portrait, drop the original camera file in as `public/assets/ceo.webp`.
- **Supplied helicopter photos:** these are no longer used on the pages. They're kept in `assets-src/` with operator markings removed.
- **Fetching images when your machine is offline:** the `asset-fetch` branch has two GitHub Actions. *Fetch remote assets* downloads the URLs in `.github/fetch-list.txt` and mirrors the old site. *Process images* runs rembg on the files in `.github/process-list.txt`. Both commit their results back to that branch.

## Before going live

- **Verify register:** `/api/verify` (`netlify/functions/verify.mjs`) checks `data/register.json`. Replace the sample records with Naebi's real staff IDs and collection accounts, and keep the file current. Lookups are exact-match only, rate-limited and return only the public fields. Where the API isn't deployed (a local preview, for example), the page falls back to the sample records and labels them "Sample records". `node scripts/test-verify.mjs` tests the function.
- **Forms:** the contact and billing-query forms submit to Netlify Forms. In Netlify, go to **Forms** and add an email notification so submissions reach the operators desk. If sending fails, the page shows the phone number.
- **Legal:** the text in `legal.html` is general wording that needs legal review.
- **Facts:** confirm the leadership details, offices and phone number with the client. Set `SITE_URL` in Netlify if the domain isn't `https://naebidynamic.com`. It drives canonical links, the sitemap and social-share tags.

## Deploy (Netlify)

Import the repo in Netlify. `netlify.toml` sets the build command (`npm run build`), the publish directory (`dist`), long-lived caching for `/assets/*` and security headers.
