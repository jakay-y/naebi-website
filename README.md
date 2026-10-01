# Naebi Dynamic Concepts website

Cinematic, scroll-driven marketing site for Naebi Dynamic Concepts Ltd (helicopter surveillance and airspace security, Port Harcourt).

**Stack:** Next.js 15 (static export), React 19, three.js via @react-three/fiber + drei, GSAP ScrollTrigger, Lenis smooth scroll.

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # static site in ./out (deploy anywhere: Vercel, Netlify, S3, cPanel)
```

## The experience

One continuous camera move, driven by scroll:

| # | Section | What happens |
|---|---------|--------------|
| 01 | Arrival (`Hero`) | Helicopter flyby plays once inside a riveted window frame, then holds. Scrolling opens the window to full bleed while HQ slides up over it. |
| 02 | Inside Naebi (`Headquarters`) | **Digital twin of the Rumueme HQ.** The walkthrough footage is a 470-frame sequence scrubbed by scroll on a canvas. It "reconstructs" from voxels, then walks through 8 zones with a live schematic, zone list and sync/frame readouts. |
| 03 | Aircraft | Pinned 3D Bell 407 (GLB) orbiting through Track / Identify / Record / Secure, with hotspots and a stat column. |
| 04 | Airspace | Radar map of Nigeria: sweep, traffic blips, flight paths drawn on scroll. |
| 05 | Mandate | Horizontal pinned scroll across NAMA, NCAA and FAAN. |
| 06 | System | Detect → Verify → Log → Levy timeline with a sticky ops console mock. |
| 07 | Control room | Operators / agencies cards and the newsroom. |
| 08 | Touchdown | Contact form and the NAEBI wordmark fill. |

Persistent chrome: glass pill nav, left section rail, altimeter/heading HUD (reads 0 ft inside HQ), custom cursor, rotor-blade page wipe, preloader.

## Media

| File | Source |
|------|--------|
| `public/media/hero-flyby.{webm,mp4}` + poster | Flyby clip supplied by Naebi (upscaled to 1472px). |
| `public/media/hq/f0000–f0469.webp` | `naebi_intro_video11.mp4` (HQ walkthrough), 12 fps, 720×1280. |
| Aircraft render, control room, helipad, Bell 407 GLB | Generated with Higgsfield and loaded from its CDN (`lib/media.ts`). Download them into `public/media/` to self-host. |

To regenerate the HQ frames from a new walkthrough video:

```bash
ffmpeg -i walkthrough.mp4 -an -vf "fps=12,scale=720:-2" -c:v libwebp -quality 58 -start_number 0 public/media/hq/f%04d.webp
```

Then update `HQ_FRAMES.count` in `lib/media.ts` and the zone timings in `lib/hq.ts`.

## Before launch: client to confirm

- **Flyby footage branding:** the helicopter in the intro clip carries another operator's livery and logo on the tail. Replace it with Naebi footage or an unbranded clip before going live.
- **Logo:** `BrandMark` in `components/chrome/Nav.tsx` is a placeholder. Swap in the official SVG.
- **Contact details:** set `email` and `phone` in `lib/content.ts`. Wire the contact form in `components/sections/Contact.tsx` to a real endpoint.
- **Copy:** HQ zone descriptions (`lib/hq.ts`), stats (`AIRCRAFT_STATS`), the mandate quote (`Mandate.tsx`) and agency descriptions are drafts.
- **Dashboard:** the ops console in section 06 is labelled illustrative and uses sample data.
- **Agency names:** NAMA, NCAA and FAAN appear as text only. Get permission before adding their logos.
- **3D model orientation:** if the GLB faces the wrong way, adjust `MODEL_TUNING` in `lib/media.ts`. Hotspot positions are in `HOTSPOTS` (`lib/content.ts`).
