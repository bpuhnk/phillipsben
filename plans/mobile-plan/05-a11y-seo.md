# Phase 5 — Accessibility + SEO polish

## Goal

Close the gap between "functional" and "shippable to recruiters." The site is a recruiting surface; accessibility failures and missing meta are visible defects. Handoff README §SEO/a11y is the spec.

## Prerequisites

Phases 1–4 merged. Mobile chrome and pages are stable.

## Files modified

### Accessibility

- `app/layout.tsx` — add a skip-to-content link as the first focusable element: `<a href="#main" className="skip-link">Skip to content</a>`. Visually hidden until focused.
- `app/globals.css` — add `.skip-link` rule (sr-only-until-focus pattern) and ensure `:focus-visible` rings are present on all interactive elements (links, buttons, `.nav-cta`, `.chip` when used as button). Mockup hover states should not be the only focus indicator.
- Every page's top-level wrapper: ensure `<main id="main">` exists (currently may be implicit). Audit `app/**/page.tsx`.
- `components/m-nav.tsx` — verify focus trap, `aria-expanded` on hamburger, `aria-controls` pointing at overlay, `aria-label="Menu"` already present.
- Audit alt text on every `<img>` and `next/image`. Cutouts (`ben-fullbody.png`, `ben-matt-lights.jpeg`) need descriptive alt, not decorative.
- `prefers-reduced-motion` honored on `.chip .pulse` keyframe — add `@media (prefers-reduced-motion: reduce) { .chip .pulse { animation: none; } }`.
- Color contrast: spot-check accent on bg-2 / bg-3. README notes accent fails AA at small body text — confirm it's only used decoratively or against `--ink`.

### SEO

- Per-page `metadata` export — verify every `app/**/page.tsx` has unique `title`, `description`, `alternates.canonical`. Currently `app/page.tsx:6-10` has this; audit the other 8.
- Open Graph + Twitter card on each page. Project pages: dynamic OG image from `hero` front-matter.
- `app/layout.tsx` — site-wide `<meta name="theme-color" content="#FAF8F4">`, favicon set, web manifest if PWA-leaning.
- `app/feed.xml/route.ts` (new) — RSS feed covering projects + `/now` updates. Use `lib/content.ts` queries.
- Footer Mastodon link: add `rel="me"` for identity verification.
- `next-sitemap.config.js` — verify project detail routes are included (dynamic routes need explicit handling).

## Verification

- axe DevTools / Lighthouse a11y on every page: 100.
- Keyboard-only navigation: tab from page top, reach every interactive element, no traps outside the menu overlay.
- VoiceOver pass on `/`, `/projects`, `/projects/hermes-agent` — landmarks announced, skip link works.
- `curl -I https://localhost:3000/feed.xml` returns 200 + `application/rss+xml`.
- View source on each page: unique title, description, canonical, OG tags present.
- Mastodon profile verifies the `rel="me"` link.
