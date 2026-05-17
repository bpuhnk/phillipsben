# Phase 8 — Contact + 404 (`/contact`, `/not-found`)

## Mockups

- `MPageContact` (L893–989)
- `MPage404` (L993–1040)

## Contact — sections

1. **Title** — kicker `● OPEN TO INTERESTING WORK · MAY 2026`, `h1` at
   **88px** "Let's _talk._", italic display lede 17px.
2. **Three tiles, stacked** — vertical stack `gap: 14px`. Each tile is
   `padding: 24px`:
   - Email tile: light border, kicker `① EMAIL`, 28px display
     "hello@phillipsben._com_", 13px body.
   - Calendar tile: light border, kicker `② CALENDAR`, 28px display
     "Book a _30-min_ chat →", 13px body.
   - Résumé tile: **dark** (`background: var(--ink)`, `color: var(--bg)`),
     kicker `③ RÉSUMÉ`, 28px display "Download _PDF_ →", muted-white body.
3. **Elsewhere** — `h2` 26px with `§ 02`. Four link rows: kicker (GITHUB/
   LINKEDIN/MASTODON/RSS) + accent `↗`, 18px display value, 12.5px
   description. Hairlines between rows.
4. **Honest notes** — `var(--bg-2)` band. Kicker `§ 03 · A FEW HONEST
   NOTES`, four-item `<ul>` in 18px italic display, hairline between items.

## 404 — sections

1. **Centered hero** — `padding: 64px 22px`, text-align center. Tiny meta
   "HTTP/404 · NOT FOUND", **huge 180px display** "4_0_4" (italic middle
   zero), 28px display copy "This page is still _on the print bed._",
   14px body, **2 stacked CTAs** ("Back to home", "Send me the broken link
   →" outline).
2. **OR TRY** — small meta center label, then a **2×3 grid** of mono-uppercase
   route links (/BIO, /PROJECTS, /NOW, /HOBBIES, /USES, /CONTACT) with
   hairline rules.

## Files modified

### `app/contact/page.tsx`

- Audit tile structure. Likely already has the 3 tiles; mobile needs them
  stacked vertically (`.contact-tile-grid` → 1-col at mobile, gap 14px).
- Dark résumé tile: confirm `background: var(--ink)`, white text.
- Elsewhere link list: use `.m-link-list` pattern with right-side `↗` glyph
  in accent.
- Honest notes: italic display 18px list.

### `app/not-found.tsx`

- Centered hero: ensure `text-align: center` at mobile, font-size **180px**
  for the giant 404 (`clamp(120px, 40vw, 180px)` is fine for safety).
- Two stacked CTAs use `.m-cta-stack`.
- "OR TRY" grid: `grid-template-columns: 1fr 1fr` with hairline rules; 6
  cells in a 3-row 2-col layout. Cells: padding 16×12, mono 11px, centered.

### `app/globals.css` (under contact / 404 comment groups)

- `.contact-tile-grid` mobile: `grid-template-columns: 1fr; gap: 14px`.
- `.contact-tile` mobile padding `24px`; resume tile dark variant.
- `.contact-elsewhere a` uses `.m-link-list` styling + right-arrow accent.
- `.notfound-num` mobile font-size `clamp(120px, 40vw, 180px)`.
- `.notfound-grid` 2-col grid with internal hairlines (`border-right`
  on odd cells, `border-top` on cells past index 1).

## Verification

- 390 × 844 vs both mockups.
- Contact: three tiles stack vertically; résumé tile is dark; tap targets
  cover the full tile.
- Email link uses `mailto:`, calendar link triggers Cal.com modal or routes
  to `/contact` cal section.
- 404: giant 404 number doesn't cause horizontal scroll. Quick-links grid
  is exactly 2×3 with hairlines.
- `npm run build` clean.

## After this phase

All 9 mobile mockups are ported. Final pass:
- Run Lighthouse mobile audit; address any new CLS/LCP regressions.
- Real-device smoke test from a phone on cellular.
- Update root `README.md` "Pages" section if any structural pages were
  added (none expected — layout-only rollout).
