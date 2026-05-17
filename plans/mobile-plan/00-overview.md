# Mobile-friendly conversion — overview

## Context

The site is live as a Next.js 16 / React 19 / Tailwind 4 app router project with desktop chrome + components already built from the original handoff. The new `Bio.zip` ships an updated design handoff that fills in what was missing: explicit mobile components (`MNav`, `MFoot`), four mobile page artboards (Landing / Bio / Projects / ProjectDetail), and patterns for the other five pages (horizontal-scroll chip rows, fluid `clamp()` hero type, sticky horizontal TOC, 22px gutters, stacked sections).

Today the site is effectively desktop-only. `app/globals.css:272-279` is the sole mobile rule and just hides the nav links with no replacement; the landing hero is a hardcoded `fontSize: 132px` inside a fixed `1fr 320px` grid (`app/page.tsx:18-32`) — both will break on phones. We need to convert the site to be genuinely mobile-friendly, matching the new mockups, in a phased rollout so each PR is reviewable and shippable on its own.

Source of truth for the new mobile patterns: `Bio.zip` → `design_handoff_phillipsben/mockups/pages-mobile.jsx` and `README.md`.

## Decisions (locked in)

- **Chrome strategy:** separate `MNav` / `MFoot` components mirroring the mockup files, alongside the existing `Nav` / `Footer`.
- **Swap mechanism:** render both in the root layout; CSS visibility flips at the breakpoint (no JS, no hydration flash, no UA sniffing).
- **Breakpoint:** `720px` (matches README). `<720` = mobile chrome; `≥720` = desktop chrome.
- **Mobile menu:** full-screen overlay slide-down on hamburger tap (Esc, outside-tap, link-tap close; focus-trapped; `prefers-reduced-motion` honored).
- **Fluid type:** `clamp()` tiers (`display-xxl`, `display-xl`, `display-l`, `display-m`, `display-s`) defined in `app/globals.css`; pages stop hardcoding `fontSize` inline.
- **Rollout:** four phased PRs — chrome → landing+bio → projects+detail → remaining pages.
- **Assets:** copy `ben-fullbody.png` and `ben-matt-lights.jpeg` from `Bio.zip` into `public/images/` in PR 1.

## Reuse map (do not re-create)

| Need | Existing | File |
| --- | --- | --- |
| Desktop nav | `Nav` | `components/nav.tsx` |
| Desktop footer | `Footer` | `components/footer.tsx` |
| Chip pill (incl. `.solid`, `.accent`, `.pulse`) | `Chip` + `.chip` CSS | `components/chip.tsx`, `app/globals.css:158-179` |
| Project card | `ProjectCard` | `components/project-card.tsx` |
| Stats row | `Stats` + `.stats` CSS | `components/stats.tsx`, `app/globals.css:238-244` |
| Timeline | `Timeline` + `.timeline` CSS | `components/timeline.tsx`, `app/globals.css:226-236` |
| Def list | `DefList` + `.deflist` CSS | `components/def-list.tsx`, `app/globals.css:246-257` |
| Image placeholder | `ImagePlaceholder` + `.imgph` CSS | `components/image-placeholder.tsx`, `app/globals.css:181-198` |
| Section head | `SectionHead` | `components/section-head.tsx` |
| Project filters | `ProjectFilters` | `components/project-filters.tsx` (needs mobile variant) |
| Content collections (projects/now) | `lib/content.ts` | unchanged |

## Phase index

**Mobile conversion (core)**
1. [`01-chrome-tokens-assets.md`](01-chrome-tokens-assets.md) — `MNav`, `MFoot`, fluid-type tiers, swap CSS, asset copy.
2. [`02-landing-bio.md`](02-landing-bio.md) — Landing hero + "Currently" + skill strip; Bio cutout + stats 2×2.
3. [`03-projects-detail.md`](03-projects-detail.md) — Filter horizontal scroll, single-column card grid, sticky horizontal TOC.
4. [`04-remaining-pages.md`](04-remaining-pages.md) — Now, Hobbies, Uses, Contact, 404; wire `ben-matt-lights.jpeg`.

**Ship-readiness (adjacent)**
5. [`05-a11y-seo.md`](05-a11y-seo.md) — Skip link, focus rings, per-page OG/canonical, `rel="me"`, RSS feed.
6. [`06-performance.md`](06-performance.md) — `next/font` self-hosting, `next/image` migration, Lighthouse mobile ≥95.
7. [`07-content-schema.md`](07-content-schema.md) — Zod-validated front-matter for projects + `/now`; zero-code project adds.
8. [`08-deploy.md`](08-deploy.md) — Host choice (Cloudflare / Netlify / self-host), DNS cutover, analytics decision.

Each phase is independently mergeable. Build phases 1–4 in order (later phases rely on Phase 1's tiers + chrome swap). Phases 5–8 can interleave after Phase 4 — 5 and 6 are independent; 7 is independent of mobile work; 8 needs everything else done.

## Cross-cutting verification (after Phase 4)

- `npm run build && npm run start` then DevTools device emulation through iPhone SE / 12 / 14 Pro / iPad mini.
- Real-device test on whatever phone is handy (the only way to catch iOS Safari sticky / 100vh quirks).
- Confirm `/resume/print` and the `postbuild` PDF generator still work (the print stylesheet at `app/globals.css:282-286` is preserved).
- `next-sitemap` postbuild still emits same routes.
- `grep -rn "fontSize:" app/` returns only intentional one-offs (small UI labels), not display headings.
