#!/usr/bin/env python3
"""
Fetch current/recent Spotify listening and emit dashboard-spotify.json
to stdout (matches dashboardSpotifySchema).

Env:
  SPOTIFY_CLIENT_ID      App client ID from developer.spotify.com.
  SPOTIFY_TOKEN_FILE     Path to a file holding the current refresh token.
                         Spotify's PKCE flow ROTATES the refresh token on
                         every refresh (returns a new one, revokes the old),
                         so the live token must be persisted between runs.
                         This file is the source of truth: read at start,
                         rewritten after each refresh.
  SPOTIFY_REFRESH_TOKEN  Bootstrap-only fallback, used when the token file
                         doesn't exist yet (e.g. first run after re-auth).

Exits 0 on success (output is valid JSON), 1 on any failure WITHOUT
emitting partial data. Hermes treats a non-zero exit as "leave
yesterday's dashboard-spotify.json untouched."

Usage:
  SPOTIFY_CLIENT_ID=xxx SPOTIFY_TOKEN_FILE=/opt/data/secrets/spotify_refresh_token \\
    python3 scripts/dashboard/fetch_spotify.py > content/data/dashboard-spotify.json
"""
from __future__ import annotations

import json
import os
import sys
import urllib.parse
import urllib.request
from datetime import datetime, timezone

TOKEN_URL = "https://accounts.spotify.com/api/token"
NOW_URL = "https://api.spotify.com/v1/me/player/currently-playing"
RECENT_URL = "https://api.spotify.com/v1/me/player/recently-played?limit=5"


def err(msg: str) -> None:
    print(f"fetch_spotify: {msg}", file=sys.stderr)


def _token_file() -> str | None:
    path = os.environ.get("SPOTIFY_TOKEN_FILE")
    return os.path.expanduser(path) if path else None


def load_refresh_token() -> str | None:
    """Prefer the rotating token file; fall back to SPOTIFY_REFRESH_TOKEN for
    first-run bootstrap (the file won't exist until the first refresh)."""
    path = _token_file()
    if path and os.path.exists(path):
        try:
            with open(path, encoding="utf-8") as fh:
                tok = fh.read().strip()
            if tok:
                return tok
        except OSError as e:
            err(f"could not read token file {path}: {e}")
    return os.environ.get("SPOTIFY_REFRESH_TOKEN")


def save_refresh_token(token: str) -> None:
    """Persist a rotated refresh token atomically with 0600 perms. If no token
    file is configured this is a no-op WITH a warning — rotation then can't
    survive and the next run will fail until re-auth."""
    path = _token_file()
    if not path:
        err("SPOTIFY_TOKEN_FILE not set — cannot persist rotated refresh token; "
            "next run will fail with 'Refresh token revoked' until re-auth")
        return
    os.makedirs(os.path.dirname(path), exist_ok=True)
    tmp = f"{path}.tmp"
    fd = os.open(tmp, os.O_WRONLY | os.O_CREAT | os.O_TRUNC, 0o600)
    try:
        os.write(fd, (token + "\n").encode())
    finally:
        os.close(fd)
    os.replace(tmp, path)


def refresh_access_token(client_id: str, refresh_token: str) -> tuple[str, str | None]:
    """Mint a 1-hour access token. Returns (access_token, new_refresh_token).

    Spotify's PKCE flow rotates the refresh token: the response carries a new
    refresh_token and the supplied one is revoked. The caller MUST persist the
    new token, or the next run breaks.
    """
    body = urllib.parse.urlencode({
        "grant_type": "refresh_token",
        "refresh_token": refresh_token,
        "client_id": client_id,
    }).encode()
    req = urllib.request.Request(
        TOKEN_URL,
        data=body,
        headers={"Content-Type": "application/x-www-form-urlencoded"},
    )
    with urllib.request.urlopen(req, timeout=30) as resp:
        data = json.loads(resp.read().decode())
    token = data.get("access_token")
    if not token:
        raise RuntimeError(f"no access_token in refresh response: {data}")
    return token, data.get("refresh_token")


def get_json(url: str, access_token: str) -> dict | None:
    req = urllib.request.Request(url, headers={"Authorization": f"Bearer {access_token}"})
    try:
        with urllib.request.urlopen(req, timeout=30) as resp:
            if resp.status == 204:
                return None
            return json.loads(resp.read().decode())
    except urllib.error.HTTPError as e:
        if e.code in (204, 404):
            return None
        raise


def smallest_image(images: list[dict] | None, prefer_min: int = 64) -> str | None:
    """Pick album art >= prefer_min px wide if available, else largest."""
    if not images:
        return None
    sorted_imgs = sorted(images, key=lambda i: i.get("width") or 0)
    for img in sorted_imgs:
        if (img.get("width") or 0) >= prefer_min:
            return img.get("url")
    return sorted_imgs[-1].get("url")


def map_track(item: dict) -> dict:
    """Map a Spotify track object to our schema shape (minus playedAt)."""
    artists = item.get("artists") or []
    artist = ", ".join(a.get("name", "") for a in artists if a.get("name")) or "Unknown"
    album = item.get("album") or {}
    return {
        "track": item.get("name") or "Unknown",
        "artist": artist,
        "albumArt": smallest_image(album.get("images")),
        "url": (item.get("external_urls") or {}).get("spotify") or "https://open.spotify.com",
    }


def main() -> int:
    client_id = os.environ.get("SPOTIFY_CLIENT_ID")
    refresh_token = load_refresh_token()
    if not client_id or not refresh_token:
        err("SPOTIFY_CLIENT_ID and a refresh token "
            "(via SPOTIFY_TOKEN_FILE or SPOTIFY_REFRESH_TOKEN) must be set")
        return 2

    try:
        access, new_refresh = refresh_access_token(client_id, refresh_token)
    except Exception as e:
        err(f"token refresh failed: {e}")
        return 1

    # Persist the rotated token NOW, before the playback calls — Spotify has
    # already revoked the old one, so a later failure must not lose the new.
    if new_refresh and new_refresh != refresh_token:
        save_refresh_token(new_refresh)

    now_playing: dict | None = None
    try:
        now = get_json(NOW_URL, access)
        if now and now.get("item"):
            now_playing = map_track(now["item"])
    except Exception as e:
        # Currently-playing failures are non-fatal; recent is the headline source.
        err(f"currently-playing failed (continuing): {e}")

    recent: list[dict] = []
    try:
        rec = get_json(RECENT_URL, access)
        for entry in (rec or {}).get("items", []):
            track = entry.get("track")
            if not track:
                continue
            mapped = map_track(track)
            mapped["playedAt"] = entry.get("played_at") or datetime.now(timezone.utc).strftime(
                "%Y-%m-%dT%H:%M:%SZ"
            )
            recent.append(mapped)
    except Exception as e:
        err(f"recently-played failed: {e}")
        return 1

    if not recent and not now_playing:
        err("no playing or recent data — refusing to emit empty payload")
        return 1

    out = {
        "updatedAt": datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ"),
        "nowPlaying": now_playing,
        "recent": recent,
    }
    json.dump(out, sys.stdout, indent=2)
    sys.stdout.write("\n")
    return 0


if __name__ == "__main__":
    sys.exit(main())
