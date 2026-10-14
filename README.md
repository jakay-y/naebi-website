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

The two helicopter photos came with third-party operator markings ("BLADE", "BLUE HAWAIIAN", a tail registration and two emblems), which have been painted out in `assets-src/`. Replace them with Naebi's own photography before launch, then run `npm run images`. The hero uses a cut-out of the helicopter (`hero-*-fg.webp`) so the giant "NAEBI" wordmark sits behind the aircraft.

## Before going live

- **Verify tool:** `site.js` uses a small sample register (IDs like `NDC-PH-0142`, labelled "Sample register" on the page). Connect it to the real staff and account register through an API.
- **Forms:** the contact and billing-query forms validate in the browser but don't send yet. They tell people to call 0201 330 6327. Connect them to Netlify Forms or an email or CRM endpoint.
- **Legal:** the text in `legal.html` is general wording that needs legal review.
- **Facts:** confirm the leadership details, offices and phone number with the client.

## Deploy (Netlify)

Import the repo in Netlify. `netlify.toml` sets the build command (`npm run build`), the publish directory (`dist`), long-lived caching for `/assets/*` and security headers.
