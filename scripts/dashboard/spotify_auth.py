#!/usr/bin/env python3
"""
One-shot Spotify OAuth helper. Run this LOCALLY (on a machine with a
browser) ONCE to capture a refresh token, then store the token in
Hermes's secret store. The refresh token doesn't expire unless revoked.

Uses PKCE (no client secret required).

Usage:
  SPOTIFY_CLIENT_ID=xxx python3 scripts/dashboard/spotify_auth.py

The script will:
  1. Open https://accounts.spotify.com/authorize in your browser
  2. Spin up a local HTTP server on http://127.0.0.1:8888/callback
  3. Receive the auth code, exchange it for tokens
  4. Print the refresh token to stdout

Register the Spotify app at https://developer.spotify.com/dashboard
with redirect URI exactly: http://127.0.0.1:8888/callback
"""
from __future__ import annotations

import base64
import hashlib
import http.server
import json
import os
import secrets
import sys
import threading
import urllib.parse
import urllib.request
import webbrowser

CLIENT_ID = os.environ.get("SPOTIFY_CLIENT_ID")
REDIRECT_URI = "http://127.0.0.1:8888/callback"
SCOPES = "user-read-currently-playing user-read-recently-played"
AUTH_URL = "https://accounts.spotify.com/authorize"
TOKEN_URL = "https://accounts.spotify.com/api/token"
PORT = 8888


def pkce_pair() -> tuple[str, str]:
    verifier = base64.urlsafe_b64encode(secrets.token_bytes(64)).rstrip(b"=").decode()
    challenge = base64.urlsafe_b64encode(
        hashlib.sha256(verifier.encode()).digest()
    ).rstrip(b"=").decode()
    return verifier, challenge


class CallbackHandler(http.server.BaseHTTPRequestHandler):
    received_code: str | None = None
    expected_state: str = ""

    def log_message(self, *args, **kwargs):
        pass  # silence

    def do_GET(self):  # noqa: N802
        parsed = urllib.parse.urlparse(self.path)
        if parsed.path != "/callback":
            self.send_response(404)
            self.end_headers()
            return
        params = dict(urllib.parse.parse_qsl(parsed.query))
        if params.get("state") != CallbackHandler.expected_state:
            self.send_response(400)
            self.end_headers()
            self.wfile.write(b"State mismatch.")
            return
        if "error" in params:
            self.send_response(400)
            self.end_headers()
            self.wfile.write(f"Error: {params['error']}".encode())
            return
        CallbackHandler.received_code = params.get("code")
        self.send_response(200)
        self.send_header("Content-Type", "text/html")
        self.end_headers()
        self.wfile.write(
            b"<h1>Got it.</h1><p>Refresh token is being printed to your terminal. "
            b"You can close this tab.</p>"
        )


def main() -> int:
    if not CLIENT_ID:
        print("error: SPOTIFY_CLIENT_ID not set", file=sys.stderr)
        return 2

    verifier, challenge = pkce_pair()
    state = secrets.token_urlsafe(16)
    CallbackHandler.expected_state = state

    auth_params = {
        "client_id": CLIENT_ID,
        "response_type": "code",
        "redirect_uri": REDIRECT_URI,
        "code_challenge_method": "S256",
        "code_challenge": challenge,
        "scope": SCOPES,
        "state": state,
    }
    auth_url = f"{AUTH_URL}?{urllib.parse.urlencode(auth_params)}"

    server = http.server.HTTPServer(("127.0.0.1", PORT), CallbackHandler)
    thread = threading.Thread(target=server.serve_forever, daemon=True)
    thread.start()

    print(f"Opening browser to: {auth_url}", file=sys.stderr)
    if not webbrowser.open(auth_url):
        print(f"\n(Browser didn't open. Visit this URL manually:)\n{auth_url}\n", file=sys.stderr)

    print(f"Waiting for callback on {REDIRECT_URI} ...", file=sys.stderr)
    while CallbackHandler.received_code is None:
        threading.Event().wait(0.5)
    server.shutdown()

    body = urllib.parse.urlencode({
        "client_id": CLIENT_ID,
        "grant_type": "authorization_code",
        "code": CallbackHandler.received_code,
        "redirect_uri": REDIRECT_URI,
        "code_verifier": verifier,
    }).encode()
    req = urllib.request.Request(
        TOKEN_URL,
        data=body,
        headers={"Content-Type": "application/x-www-form-urlencoded"},
    )
    with urllib.request.urlopen(req, timeout=30) as resp:
        tokens = json.loads(resp.read().decode())

    refresh_token = tokens.get("refresh_token")
    if not refresh_token:
        print(f"error: no refresh_token in response: {tokens}", file=sys.stderr)
        return 1

    print("\n=== SPOTIFY REFRESH TOKEN (store in Hermes secrets) ===")
    print(refresh_token)
    print("=======================================================\n")
    print("Also keep your SPOTIFY_CLIENT_ID handy — both are needed by fetch_spotify.py.", file=sys.stderr)
    return 0


if __name__ == "__main__":
    sys.exit(main())
