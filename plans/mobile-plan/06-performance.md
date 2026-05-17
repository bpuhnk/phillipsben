# Phase 6 — Performance

## Goal

Hit Lighthouse mobile ≥95 across all routes. The handoff explicitly calls out font self-hosting (perf + privacy) and `astro:assets`-equivalent image handling — Next's answer is `next/font` and `next/image`.

## Prerequisites

Phase 5 merged. Real assets identified in `public/images/`.

## Files modified

### Fonts

- `app/layout.tsx` — switch from CDN Google Fonts (if currently loaded that way) to `next/font/google`:
  ```ts
  import { Instrument_Serif, Geist, Geist_Mono } from 'next/font/google';
  const display = Instrument_Serif({ subsets: ['latin'], weight: '400', style: ['normal', 'italic'], variable: '--font-instrument-serif', display: 'swap' });
  const body = Geist({ subsets: ['latin'], weight: ['300','400','500','600','700'], variable: '--font-geist-sans', display: 'swap' });
  const mono = Geist_Mono({ subsets: ['latin'], weight: ['400','500'], variable: '--font-geist-mono', display: 'swap' });
  ```
  Apply variables to `<html className={`${display.variable} ${body.variable} ${mono.variable}`}>`.
- Remove any `<link href="https://fonts.googleapis.com/...">` from `app/layout.tsx`. Tokens in `app/globals.css:19-21,36-38` already reference these CSS variables, so no token changes needed.

### Images

- Convert remaining `.imgph` placeholders to `next/image` wherever a real asset now exists in `public/images/`.
- `ben-fullbody.png` (Bio) and `ben-matt-lights.jpeg` (Hobbies): wrap in `<Image>` with explicit `width`/`height`, `sizes`, `priority` only on above-fold landing/bio hero.
- Verify `next.config.mjs` allows the image domains/formats needed (likely no change — all images are local).
- `components/image-placeholder.tsx` stays for genuinely-unfilled assets; just shrink its footprint where possible.

### Layout shift

- Reserve space for hero images (`aspect-ratio` or explicit dimensions) — landing/bio CLS must be < 0.1.
- Webfont swap may shift hero text; consider `size-adjust` on `next/font` if Instrument Serif vs fallback diverge meaningfully.

### Bundle

- Audit `'use client'` boundaries. `MNav` is the only one that needs to be client; verify nothing else upgrades a tree unnecessarily.
- `components/cal-embed.tsx` — defer Cal.com script load (dynamic import behind an intersection observer, or `next/dynamic` with `ssr: false`).

## Verification

- Lighthouse mobile on `/`, `/projects`, `/projects/hermes-agent`, `/bio`, `/hobbies`, `/now`:
  - Performance ≥ 95
  - Accessibility = 100
  - Best Practices ≥ 95
  - SEO = 100
- Core Web Vitals on the same routes:
  - LCP < 2.5s
  - CLS < 0.1
  - INP < 200ms
- No `fonts.googleapis.com` request in the network tab.
- `npm run build` output: route sizes haven't ballooned; First Load JS per route stays modest (target <100kB).
- WebPageTest filmstrip on a throttled 4G profile shows fonts swap once, no FOIT.
