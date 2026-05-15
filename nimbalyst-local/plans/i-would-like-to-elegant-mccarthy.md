# phillipsben.com — Personal Bio & Portfolio Site

## Context

Ben is building a personal site at https://phillipsben.com to share with recruiters and hiring agencies, track active projects, and publish write-ups of past work. The site needs to function as both a living resume and a portfolio. The repo is currently empty (`/media/bpuhnk/2016SRV/repos/bio`), so this is a greenfield build.

Decisions confirmed with the user:
- **Stack**: Next.js (App Router) + MDX, Markdown content authored in git.
- **Hosting**: Self-hosted Docker container on Ben's home server, exposed via existing Cloudflare tunnel (consistent with other sites he hosts).
- **Design**: Editorial-minimal — serif display + clean sans body, generous whitespace, terracotta accent. **Detailed design system supplied via `Bio.zip` (Claude design export) — see Design System section below.** The supplied JSX mockups are the canonical reference for implementation.
- **Resume PDF**: Generated from the bio page content (single source of truth).
- **v1 pages**: Landing, Bio, Projects (index + per-project), **Now**, Hobbies, Contact (with PDF download), Uses, 404.
- **Project metadata**: status, tech stack tags, date range, external links.

## Site Map (v1)

| Route | Purpose |
| --- | --- |
| `/` | Landing — short intro, links to other sections, featured projects |
| `/bio` | Long-form professional history (resume content) |
| `/projects` | Filterable list of projects (by status, by tag) |
| `/projects/[slug]` | Individual project write-up (MDX with images) |
| `/now` | What I'm currently focused on (single editable MDX page) |
| `/hobbies` | Personal interests outside of work |
| `/contact` | Contact info, social links, "Download Resume PDF" |
| `/uses` | Tools, hardware, dev environment |
| `/resume.pdf` | Build-time generated PDF (served from `public/`) |
| `/404` | Custom not-found page |

Global elements: header nav, footer (social + copyright), dark/light toggle.

## Tech Stack

Versions verified against latest stable releases as of May 2026.

- **Framework**: **Next.js 16.2.6 LTS** (App Router), TypeScript, `output: 'standalone'` for slim Docker images. Node 24 LTS.
- **Content**: MDX files under `content/` with frontmatter.
  - For the static one-off pages (bio, hobbies, uses, landing) use **`@next/mdx`** — Next.js's official integration, cleanest for route-level MDX.
  - For dynamic per-slug project pages use **`@mdx-js/mdx`** directly with `compileMDX` (server component). This replaces the now-archived `next-mdx-remote` (archived April 2026). `next-mdx-remote-client` is a viable fork if we hit limits, but compiling with `@mdx-js/mdx` keeps the dependency surface smaller.
  - Frontmatter parsed with `gray-matter`; validated with Zod schemas in `lib/content.ts`.
- **Styling**: **Tailwind CSS 4.3.0**, system font stack + one display font (e.g. Inter or Geist). Dark mode via `prefers-color-scheme` + manual toggle.
- **Images**: `next/image`, source images stored alongside their MDX file (e.g. `content/projects/foo/cover.jpg`).
- **PDF generation**: **Playwright 1.60.0** at build time — renders `/resume/print` (noindex route) to `public/resume.pdf`. Build stage uses `mcr.microsoft.com/playwright:v1.60.0-noble`. Invoked from `scripts/generate-pdf.mjs` in a `postbuild` step.
- **SEO**: `next-sitemap` for `sitemap.xml` + `robots.txt`, OG image generation via Next.js's built-in `opengraph-image.tsx` per route.
- **Analytics**: Plausible (self-hostable, privacy-friendly) — placeholder env var, off by default.

## Design System

Ported directly from `Bio.zip` → `styles.css`. These become CSS variables in `app/globals.css` and corresponding Tailwind theme tokens.

### Palette (ember — default)

| Token | Value | Use |
| --- | --- | --- |
| `--bg` | `#FAF8F4` | Page background (warm off-white) |
| `--bg-2` | `#F3EFE7` | Card surface |
| `--bg-3` | `#EAE4D7` | Muted surface, image placeholders |
| `--ink` | `#1A1816` | Primary text, dark sections, CTAs |
| `--ink-2` | `#4A453E` | Secondary text |
| `--ink-3` | `#8A8275` | Muted text, meta |
| `--rule` | `#D9D3C5` | Hairline borders |
| `--rule-2` | `#ECE6D8` | Faint hairlines |
| `--accent` | `oklch(0.58 0.16 40)` | Terracotta — links underline, dot, italic emphasis |
| `--accent-2` | `oklch(0.58 0.16 40 / 0.12)` | Accent backgrounds (chips) |

Alternate palettes (ink/forest/plum) carried over as data-attribute themes for future use, ember is v1 default.

### Typography

- **Display**: Instrument Serif (Google Fonts) — H1/H2, lede, italic emphasis for accent words.
- **Body**: Geist 300–700 — paragraphs, nav, UI.
- **Mono**: Geist Mono — kickers, meta, section indices, code.
- Alternates available behind `[data-fonts]` attribute: Newsreader, Fraunces.
- Type primitives: `.kicker` (mono uppercase 11px, 0.14em tracking), `.display` (serif, -0.02em tracking, 0.96 line-height), `.lede` (24px italic serif), `.meta` (mono 11.5px).

### Component Inventory (port to React/Tailwind)

| Component | Source class | Role |
| --- | --- | --- |
| `<Nav>` | `.nav`, `.nav-brand`, `.nav-links`, `.nav-cta` | Sticky top nav, terracotta dot brand, pill CTA |
| `<Footer>` | `.foot` | 4-column footer + mono bottom strip |
| `<SectionHead>` | `.section-head` | Serif H2 + mono index, hairline underline |
| `<Chip>` | `.chip`, `.chip.solid`, `.chip.accent`, `.chip .pulse` | Status pill (with optional pulsing dot for "active") |
| `<ProjectCard>` | `.proj-card` (+ `[data-card]` variants) | Grid / horizontal / minimal layouts |
| `<TimelineRow>` | `.tl-row` | Bio timeline entries |
| `<Stats>` | `.stats`, `.stat` | 4-up stat block, big serif numerals |
| `<DefList>` | `.deflist`, `.def` | Uses page two-column list |
| `<ImagePlaceholder>` | `.imgph` | Hatched placeholder for missing images |

### Page Mockups (canonical reference)

`Bio.zip` contains JSX mockups for all 9 v1 pages. Implementation should port each:

- `pages-main.jsx` → `PageLanding` (3 hero variants A/B/C — pick A for v1, keep B/C as commented alternates), `PageBio`
- `pages-more.jsx` → `PageProjects`, `PageProjectDetail`, `PageNow`
- `pages-final.jsx` → `PageHobbies`, `PageUses`, `PageContact`, `Page404`

`design-canvas.jsx` and `tweaks-panel.jsx` are scaffolding for the Claude design tool — **not ported**.

Mockup files unpacked at `/tmp/bio-design/` and should be copied into the repo at `design/reference/` for the implementation phase.

## Content Model

### Project frontmatter (`content/projects/<slug>.mdx`)

```yaml
---
title: "Project Name"
slug: "project-name"
summary: "One-line description for cards."
status: "active" | "completed" | "archived"
techStack: ["TypeScript", "Postgres", "Docker"]
startDate: "2024-03"
endDate: "2025-01"   # optional, omit for active
links:
  github: "https://github.com/..."
  demo: "https://..."
cover: "./cover.jpg"
featured: true        # show on landing page
---
```

Body is MDX — supports embedded images, code blocks, callouts.

### Bio (`content/bio.mdx`)

Single source for both `/bio` page rendering and the PDF. Structured sections (Summary, Experience, Skills, Education) authored as MDX with semantic headings the print stylesheet targets.

### Other content

- `content/hobbies.mdx`
- `content/uses.mdx`
- `content/now.mdx` (current focus — update monthly)
- `content/landing.mdx` (intro blurb + featured project pointers)
- `content/contact.mdx` (contact info, social links)

## Repository Layout

```
/                       # repo root
├── app/                # Next.js App Router pages
│   ├── page.tsx                  # landing
│   ├── bio/page.tsx
│   ├── projects/page.tsx
│   ├── projects/[slug]/page.tsx
│   ├── now/page.tsx
│   ├── hobbies/page.tsx
│   ├── contact/page.tsx
│   ├── uses/page.tsx
│   └── resume/print/page.tsx     # PDF render target (noindex)
├── components/
│   ├── nav.tsx
│   ├── footer.tsx
│   ├── section-head.tsx
│   ├── chip.tsx                  # incl. pulsing "active" variant
│   ├── project-card.tsx          # grid/horizontal/minimal variants
│   ├── project-filters.tsx
│   ├── timeline.tsx
│   ├── stats.tsx
│   ├── def-list.tsx
│   ├── image-placeholder.tsx
│   └── mdx/                      # custom MDX components
├── design/
│   └── reference/                # original Bio.zip mockups, styles.css
│       ├── styles.css
│       ├── pages-main.jsx
│       ├── pages-more.jsx
│       ├── pages-final.jsx
│       └── images/
├── content/
│   ├── bio.mdx
│   ├── landing.mdx
│   ├── hobbies.mdx
│   ├── uses.mdx
│   └── projects/
│       └── <slug>/index.mdx + assets
├── lib/
│   ├── content.ts                # MDX loader, frontmatter parsing
│   └── pdf.ts                    # Playwright PDF script (build-time)
├── public/                       # static + generated resume.pdf
├── scripts/
│   └── generate-pdf.mjs          # invoked in postbuild
├── Dockerfile
├── docker-compose.yml
├── next.config.mjs               # output: 'standalone', MDX config
├── tailwind.config.ts
├── tsconfig.json
└── package.json
```

## Build & Deploy

### Dockerfile (multi-stage)

1. `deps` — install with `npm ci` (Node 24).
2. `builder` — based on `mcr.microsoft.com/playwright:v1.60.0-noble` (Node 24, Chromium preinstalled). Runs `npm run build` including the postbuild PDF generation.
3. `runner` — `node:24-alpine`, copies `.next/standalone`, `.next/static`, `public/` (including the generated `resume.pdf`). Runs `node server.js` on port 3000. Playwright is **not** needed at runtime.

### docker-compose.yml

Single service `phillipsben-com` exposing internal port 3000. No published port — Ben's existing Cloudflare tunnel container connects to it on the shared Docker network. Document the network name as an env-configurable value so it slots into his existing setup.

### CI/CD

Out of scope for v1 — Ben can `git pull && docker compose up -d --build` on the server. Add a one-line deploy script later if desired.

## Verification Plan

End-to-end smoke test after first build:

1. `npm run dev` — landing renders, nav works, all routes load.
2. Add a sample project under `content/projects/sample/index.mdx`. Confirm:
  - It appears on `/projects` with correct status badge and tag chips.
  - `/projects/sample` renders the MDX body and cover image.
  - Filters (status, tag) update the list client-side.
3. `npm run build` — confirm `public/resume.pdf` is generated and `/resume.pdf` downloads it.
4. Lighthouse: targets ≥95 across Performance, Accessibility, Best Practices, SEO.
5. `docker compose up --build` locally — site reachable on `localhost:3000`.
6. Deploy to server, attach to Cloudflare tunnel, verify `https://phillipsben.com/` loads and `/resume.pdf` downloads.

## Out of Scope (v1) — candidates for v2

- Blog/posts area + RSS feed
- Testimonials
- Comments / guestbook
- i18n
- Contact form (mailto: link suffices for v1)
- CI/CD pipeline

## Critical Files to Create

- `next.config.mjs` — MDX + standalone output.
- `app/globals.css` — CSS variables (palette, type, scale) ported from `design/reference/styles.css`.
- `tailwind.config.ts` — extend theme to consume the CSS variables (`bg`, `ink`, `accent`, fonts).
- `app/layout.tsx` — global shell, nav, footer, theme, font loading (Instrument Serif + Geist + Geist Mono via `next/font/google`).
- `components/{nav,footer,section-head,chip,project-card,timeline,stats,def-list,image-placeholder}.tsx` — design system primitives ported from JSX mockups.
- `lib/content.ts` — MDX loading + frontmatter typing (Zod schemas for safety).
- `app/projects/page.tsx` + `components/project-filters.tsx` — listing & filters.
- `app/projects/[slug]/page.tsx` — `generateStaticParams` from `content/projects/*`.
- `app/now/page.tsx` — renders `content/now.mdx`.
- `app/resume/print/page.tsx` — PDF render target (noindex, print stylesheet).
- `scripts/generate-pdf.mjs` — Playwright PDF generation invoked in `postbuild`.
- `Dockerfile` + `docker-compose.yml` — deployment.

## Implementation Phasing (suggested)

1. **Scaffolding** — Next.js init, Tailwind, fonts, `globals.css` tokens, layout shell (nav + footer).
2. **Design system components** — port the 9 primitives from mockups; verify against `design/reference/`.
3. **Static pages** — Landing (variant A), Bio, Hobbies, Uses, Contact, Now, 404, using MDX content.
4. **Projects** — listing page with filters + dynamic `[slug]` route with one sample project.
5. **PDF pipeline** — `/resume/print` route + Playwright script + `postbuild` wiring.
6. **SEO + analytics** — sitemap, OG images, Plausible script (off until prod).
7. **Docker + deploy** — Dockerfile, compose, attach to existing Cloudflare tunnel network.
