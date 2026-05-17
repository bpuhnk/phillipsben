# Phase 4 — Projects list + detail (`/projects`, `/projects/[slug]`)

## Mockups

- `MPageProjects` (L322–394) — list.
- `MPageProjectDetail` (L398–542) — detail.

## Projects list — sections

1. **Title** — kicker `§ 01 · PROJECTS`, `h1` at **48px**, italic display
   lede 16px.
2. **Filter bar** — horizontal-scroll chip row with a divider between
   status chips and role chips. Already wired as `.filter-bar-inner` with
   mobile overrides; verify chip sizes (font 9.5px, padding 4×9).
3. **Card stack** — vertical, `gap: 28px`. Each card is bordered, has a
   16:9 image, then body with year · status (with pulse dot if ACTIVE) ·
   role meta row, 24px display title, 13px description, tag chip row at
   bottom.
4. **Archive footer** — `var(--bg-2)` section with kicker `ARCHIVE`, 26px
   display heading, outline CTA "Browse archive →" (this may be out of
   scope content-wise; render only if `getArchivedProjects()` returns
   anything, otherwise omit).

## Project detail — sections

1. **Crumb** — `← PROJECTS / HERMES-AGENT`. Already exists.
2. **Hero text** — chip row (active pulse, year, role), **56px** display
   title with one italic break, italic display lede 17px.
3. **Hero image** — `Img` placeholder + meta caption "FIG. 01 — …".
4. **Meta dl** — 4 rows (Role · Stack · Host · Status). 80px label column,
   value column. Hairline rules. Status value in accent color.
5. **Sticky TOC dock** — horizontal scroll, `position: sticky; top: 0`.
   Items font-mono 10.5px, current section in accent. Already wired as
   `.toc-dock` (visible at mobile via foundations). Verify items reflect
   real H2s.
6. **Body** — H2 at 32px display with circled-number prefix italics. Body
   paragraphs at 15px line-height 1.6.
7. **Prev/next** — `var(--bg-2)` band, vertical stack `gap: 24px`. Each
   link: small meta label + 22px display title + tiny description. Already
   handled by `.proj-nav` 1-col mobile rule.

## Files modified

### `app/projects/page.tsx`

- Verify card stack uses `.project-grid` (1-col on mobile already).
- Verify card structure: image → meta row → title → description → tag chips.
  Mockup has tag chips on each card; current implementation may or may not.
  Add if missing.
- Conditionally render archive footer when archived projects exist.

### `app/projects/[slug]/page.tsx`

- Verify hero `h1` mobile size matches 56px.
- Meta dl uses `.def` (already 1-col on mobile via foundations) — verify the
  80px label column at mobile (mockup uses a tighter grid).
- TOC dock: confirm sticky behavior works inside the page (the `.toc-dock`
  rule is in place; verify `position: sticky; top: 0` is uncovered by the
  m-nav header).
- Prose H2 at mobile already clamps to ≥ 26px; align with mockup's 32px.

### `app/globals.css` (under projects comment group)

- `.project-card` chip row tweaks for mobile: ensure active status has pulse
  dot.
- `.project-meta-dl` mobile: `grid-template-columns: 80px 1fr; gap: 16px`
  (mockup uses this tighter layout instead of the desktop 1fr/1fr).
- TOC dock vertical alignment: ensure top sticks beneath m-nav (m-nav is
  not sticky — check), or below it if m-nav becomes sticky later.

## Verification

- 390 × 844 vs both mockups.
- Filter chips horizontally scroll, divider visible between status/role
  groups.
- Cards in list: all six projects render, image-on-top, chips at bottom.
- Detail: prev/next stack vertically, links navigate correctly.
- Sticky TOC dock follows scroll position; active section highlights.
- `npm run build` clean.
