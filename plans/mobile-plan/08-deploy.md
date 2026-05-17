# Phase 8 — Deploy

## Goal

Get phillipsben.com pointed at the new site. Three open decisions from the handoff need answers before this phase can start (see "Open decisions" below).

## Prerequisites

Phases 1–7 merged. `npm run build` clean, Lighthouse targets hit, schema validated, real-device tested.

## Open decisions (need Ben's answer before starting)

1. **Host.** Cloudflare Pages vs Netlify vs self-host on existing Ubuntu box (the home server already runs Hermes-Agent).
2. **Analytics.** None / Plausible (paid, EU-hosted) / nginx log-based counts.
3. **Repo visibility.** Public (so people can see how it's built — fits the "hand-built" footer copy) or private.

## Files modified / added

### Repo

- `.github/workflows/deploy.yml` (if Cloudflare Pages / Netlify with GitHub-based deploys) — build on push to `main`, deploy preview on PRs.
- `README.md` — local dev instructions, deploy notes, link to `plans/` history.
- `.env.example` — already exists; verify it documents anything needed for the chosen host.

### Host config

- **If Cloudflare Pages:** connect repo via dashboard, build command `npm run build`, output dir `.next` (or use `@cloudflare/next-on-pages` if SSR features are used; current site is mostly static so `output: 'export'` in `next.config.mjs` may be simpler).
- **If Netlify:** `netlify.toml` with build command + publish dir + `@netlify/plugin-nextjs`.
- **If self-host:** `Dockerfile` and `docker-compose.yml` already exist (lines 1345 / 394 in root). Verify they build a production image; wire into existing reverse proxy on the Ubuntu box; renew TLS via existing Caddy/Traefik/Certbot setup.

### DNS

- Point `phillipsben.com` (apex) and `www.phillipsben.com` at the chosen host.
- TLS via host's automatic cert (Cloudflare / Netlify) or existing Let's Encrypt for self-host.
- Add `phillipsben.com` to existing `next-sitemap.config.js` `siteUrl` if not already there.

### Analytics (if chosen)

- **Plausible:** add script tag in `app/layout.tsx`, configured for the domain.
- **Log-based:** no code change; doc the log-parsing approach.
- **None:** footer copy "Hand-built, no tracking" stays honest.

## Verification

- `https://phillipsben.com` resolves, serves HTTPS, redirects from `www.` (or vice versa per Ben's preference).
- All 9 routes load with correct status codes; 404 hits the custom page.
- `https://phillipsben.com/feed.xml` and `https://phillipsben.com/sitemap.xml` accessible.
- `https://phillipsben.com/resume.pdf` downloads.
- Real-device test from a phone on cellular (not LAN-cached): LCP feel-test snappy.
- If analytics chosen: confirm events recording within an hour of deploy.
- Set a calendar reminder to recheck Lighthouse scores ~1 week post-deploy (real-world CDN behavior may differ from local).

## Post-launch (out of this phase, but flag for Ben)

- Submit URL to Google Search Console + Bing Webmaster Tools.
- Decide on a cadence for `/now` updates (the page is only useful if it's actually current).
- Set the deferred handoff README open questions as future tickets: dark mode, search, comments, newsletter, `/writing` and `/talks` pages.
