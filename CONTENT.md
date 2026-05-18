# Content authoring guide

All content for phillipsben.com is git-tracked. There are two ways to edit it:

1. **Direct** — edit files in `content/` and commit, the normal developer flow.
2. **Browser** — visit `/admin` (Sveltia CMS), edit fields in a form, save → auto-commits to `main`.

Both produce identical commits. The build validates everything; if a file is broken, CI fails before deploy.

---

## Add a project

Projects deliberately stay as raw markdown — they're not editable via `/admin`.

1. Create a folder: `content/projects/<slug>/`.
2. Add `index.mdx` with the required frontmatter (see existing entries like `content/projects/hermes-agent/index.mdx`):

   ```mdx
   ---
   title: My Project
   slug: my-project              # must match the folder name
   summary: One-line summary used on the index and meta tags.
   status: active                # active | shipped | archived
   techStack: [C#, WPF]
   role: Lead                    # optional
   startDate: 2026-01            # YYYY-MM (string)
   endDate: 2026-04              # optional
   featured: true                # if true, may appear in landing "Recent work"
   links:                        # all optional
     github: https://github.com/...
     site: https://...
   cover: /images/projects/my-project/cover.png   # optional
   ---

   ## First H2

   Body markdown. Each `## H2` becomes a TOC entry on the project detail page.
   ```

3. Drop any project images into `content/projects/<slug>/` (or `public/images/projects/<slug>/`) and reference them in the MDX body.
4. Commit. The project appears at `/projects/<slug>`.

`status: archived` projects are still served at their URL but hidden from list views (see `lib/content.ts`).

---

## Edit site copy

### Option A — direct (any text editor)

```
content/site/         # MDX prose: home, bio, contact
content/data/         # typed JSON: timelines, cards, tiles, nav, footer
```

Edit, save, commit. `pnpm dev` hot-reloads. Examples:

- Change the landing hero kicker → `content/site/home.mdx`, frontmatter `kicker` field.
- Add a career row → append to `content/data/bio-career.json`.
- Change footer wording → `content/data/footer.json`.

Small inline formatting in string fields uses literal HTML tags: `<i>italic</i>`, `<br>`, `<span style="...">…</span>`. These render via `dangerouslySetInnerHTML`, so the content is trusted because it lives in git.

### Option B — browser (`/admin`)

1. Go to `https://phillipsben.com/admin`.
2. Authenticate via Cloudflare Access (your email/IdP).
3. Authenticate to GitHub when prompted (PKCE OAuth flow — no client secret).
4. Pick a collection in the sidebar (each maps to one file in `content/site/` or `content/data/`).
5. Edit fields, **Save**.
6. Sveltia commits to `main`; CI rebuilds and deploys.

The collections mirror the file layout 1:1 — see `public/admin/config.yml` for the schema.

---

## Build-time validation

`lib/site-schemas.ts` defines Zod schemas for every file. On build, any malformed JSON or missing/wrong frontmatter field fails with a clear path:

```
Invalid content in content/data/bio-career.json:
  - 3.h: Required
```

Run `pnpm build` (or `pnpm typecheck`) locally to verify before pushing.

---

## Local preview

```
pnpm install
pnpm dev          # http://localhost:3000
pnpm build        # production build (also runs Zod validation)
pnpm typecheck    # tsc --noEmit
```

`/admin` loads locally too, but commits require the GitHub OAuth app and won't work without it.

---

## One-time external setup

These need to be done once (manually, outside the repo) before `/admin` can commit:

1. **GitHub OAuth App** — Settings → Developer settings → OAuth Apps → New.
   - Homepage URL: `https://phillipsben.com`
   - Authorization callback URL: `https://phillipsben.com/admin/`  (**trailing slash matters**)
   - Copy the Client ID into `public/admin/config.yml` under `backend.app_id`. PKCE means no client secret is needed.

2. **Cloudflare Access** — Zero Trust → Access → Applications → Add.
   - Application URL: `phillipsben.com/admin/*`
   - Policy: allow your email address (or your GitHub IdP).
   - This gates *who can load the admin UI* at the network edge, on top of the GitHub gate that controls *who can commit*.

3. **CI/CD** — verify a workflow exists that rebuilds the site image on `main` push. If not, add `.github/workflows/deploy.yml`.

---

## Admin gotchas

- The OAuth callback URL in GitHub **must** end with `/admin/` (trailing slash) and match the deployed domain exactly.
- Cloudflare Access must allow your IdP — otherwise you'll get a 1101 / access-denied page before Sveltia loads.
- Saves go straight to `main` (`publish_mode: simple`). For a draft/review flow, switch to `editorial_workflow` in `public/admin/config.yml` — that requires the repo to have open-PR permissions on the OAuth app.
- Inline HTML inside string fields is rendered as raw HTML. Don't paste untrusted markup.
