# Phase 4 — Hermes: Spotify integration

Populate `dashboard-spotify.json` from the Spotify Web API. Last phase
because OAuth refresh-token handling lives in Hermes's secret store, not
the bio repo.

## One-time setup (Ben + Hermes)

1. Register a Spotify app at https://developer.spotify.com/dashboard.
   Redirect URI: `http://localhost:8888/callback` (just for the initial
   token grab).
2. Run a one-shot local script to authorize and capture the refresh token:
   - Scopes needed: `user-read-currently-playing user-read-recently-played`.
   - Script prints the refresh token; store it in Hermes's secret store.
3. Spotify refresh tokens for this scope don't expire unless revoked, but
   add a Hermes alert if a refresh attempt 401s.

## Cron behavior (06:00 daily, in same cron as Phases 2/3)

1. Use refresh token to mint a 1-hour access token:
   `POST https://accounts.spotify.com/api/token`
   with `grant_type=refresh_token`.
2. `GET https://api.spotify.com/v1/me/player/currently-playing`
   - 204 (nothing playing) → leave `nowPlaying: null`.
   - 200 → extract `{track, artist, albumArt, url}`.
3. `GET https://api.spotify.com/v1/me/player/recently-played?limit=5`
   - Map to `[{track, artist, playedAt, url}]`.
4. Write `dashboard-spotify.json` matching the Phase 1 schema.
5. Commit alongside the other Hermes outputs in the same daily commit.

## UI labeling

The dashboard runs once a day, so "now playing" is up to 24h stale by
design. Label the tile **"Recent listening"** not "Now playing." If
`nowPlaying` is non-null, show it as the headline item with a "playing
earlier today" caveat; otherwise show the top item from `recent` as the
headline.

This labeling is set in `components/dashboard/now-playing-tile.tsx` from
Phase 1 — confirm the copy matches when this phase ships.

## Verification

- Run Hermes cron manually with valid refresh token, confirm
  `dashboard-spotify.json` populates with real tracks.
- Test the empty case: revoke playback, run cron, confirm the page falls
  back to most-recent track without a layout break.
- Test the failure case: invalidate the refresh token, confirm Hermes
  logs an error and does not commit a partial / null `recent` array.
- On the deployed site, confirm album art loads (Spotify CDN should be
  allowed — check `next.config.mjs` `images.remotePatterns` and add
  `i.scdn.co` if not already there).

## Bio-side work

- Add `i.scdn.co` to `next.config.mjs` `images.remotePatterns` so
  `next/image` will optimize Spotify album art.
- That's it — the schema and component already exist from Phase 1.

## Out of scope

- True real-time "now playing" (would require client-side fetch + an API
  route, breaks the SSG model — explicitly rejected in `00-overview.md`).
- Top tracks / top artists / listening history charts.
- Apple Music or any other source.
