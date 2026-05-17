# Phase 1 — Chrome, tokens, fluid type, assets

## Goal

Land the foundation every later phase depends on: mobile chrome (`MNav` / `MFoot`), a fluid-type system, the desktop↔mobile swap rule, and the two new image assets. After this phase the site still looks mostly the same on desktop, but loads correctly on a phone with a working menu, even if individual page bodies aren't fully rebuilt yet.

## Files modified

- `app/globals.css`
  - Add fluid-type tiers: `.display-xxl`, `.display-xl`, `.display-l`, `.display-m`, `.display-s` using `clamp()` per the README type ramp (e.g. `.display-xxl { font-size: clamp(48px, 8vw, 132px); line-height: 0.96; letter-spacing: -0.02em; }`).
  - Replace the existing single `@media (max-width: 900px)` guard at lines 272-279 with a 720px-based block. Inside it: `.nav, .foot { display: none; }`. Outside (default): `.m-nav, .m-foot { display: none; }`.
  - Add mobile rules for `.stats` (2×2 grid), `.section` (22px horizontal padding, 40–48px vertical), `.shell` (22px padding), `.tl-row` / `.def` (single column).
  - Keep the print stylesheet at lines 282-286 intact.
- `app/layout.tsx` — render `<Nav/><MNav/>` and `<Footer/><MFoot/>` (CSS picks which is visible).

## Files added

- `components/m-nav.tsx` — **client component**.
  - Brand + hamburger button (per `pages-mobile.jsx:6-27`).
  - On open: portal-mounted full-screen overlay, `role="dialog"`, `aria-modal="true"`, focus trap, body scroll lock, Esc / outside-click / link-tap close, `prefers-reduced-motion` removes the slide animation.
  - Overlay content: stacked links list (same items as `components/nav.tsx`), résumé CTA pill, social links.
- `components/m-foot.tsx` — **server component**.
  - 2-col `Site` / `Elsewhere` grid (per `pages-mobile.jsx:29-74`).
  - Full-width résumé CTA pill below the columns.
  - Copyright row with mono small caps.
- `public/images/ben-fullbody.png` — copied from `Bio.zip` → `design_handoff_phillipsben/assets/`.
- `public/images/ben-matt-lights.jpeg` — copied from `Bio.zip` → `design_handoff_phillipsben/assets/`.

## Implementation notes

- `MNav` must be a client component because of state + focus management; `MFoot` does not need to be.
- Use the same `items` array as `components/nav.tsx:6-14`. Consider extracting to `lib/nav-items.ts` so future link additions don't drift between Nav and MNav.
- The hamburger overlay should NOT use `position: fixed` inside a transformed parent — render via `createPortal` to `document.body`.
- Body scroll lock: toggle `overflow: hidden` on `<html>` while open. Restore on close + on unmount.
- Test SSR: both `<Nav/>` and `<MNav/>` render server-side; CSS hides the wrong one without any JS hydration.

## Verification

- `npm run typecheck && npm run build` — no errors.
- `npm run dev`; resize browser 1440 → 360px and confirm chrome swap at 720px with no FOUC and no React hydration warnings in console.
- Hamburger flow:
  - Tap hamburger → overlay opens, body scroll locked.
  - Tab cycles within menu only (focus trap holds).
  - Esc closes; outside-click closes; clicking a link navigates AND closes.
  - With `prefers-reduced-motion: reduce` set in DevTools, no slide animation.
- Lighthouse mobile on `/`: a11y ≥ 95.
- DevTools "Toggle device toolbar" → iPhone SE (375px) and Galaxy S20 Ultra (412px): no horizontal page scroll.
