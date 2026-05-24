#!/usr/bin/env bash
# phillipsben.com dashboard refresh orchestrator.
#
#   refresh.sh prep      sync repo, run the deterministic fetchers into
#                        $DASH_STAGE, build the claude memory digest, and
#                        print a brief telling the agent exactly what small
#                        artifacts to write.
#   refresh.sh dry       merge artifacts + raw data -> content/data, validate,
#                        and print a freshness report. NO git, NO push.
#   refresh.sh finalize  same as dry, then commit & push if anything changed.
#
# Why this exists: the daily refresh used to be ~15 fiddly shell steps with
# long exact paths, which a local model mangles (stray underscores, backticks,
# heredoc quote corruption) and "works around" by writing its own broken
# scripts. Here, ALL exact paths / schema shaping / validation / git live in
# code. The agent runs TWO short commands and writes a handful of tiny
# prose artifacts in between. See plans/dashboard-plan/HERMES.md.
set -uo pipefail  # deliberately NOT -e: per-step failures are handled inline.

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO="${PB_REPO:-$(cd "$SCRIPT_DIR/../.." && pwd)}"
STAGE="${DASH_STAGE:-/tmp/dash}"
DATA="$REPO/content/data"
TILES="github news currently claude spotify"
export PB_REPO="$REPO" DASH_STAGE="$STAGE"

cd "$REPO" || { echo "FATAL: cannot cd to repo $REPO"; exit 1; }

# fetch_to <stage-name> <python-args...> : run a fetcher to $STAGE/<name>.json,
# echo "ok"/"FAIL". Refuses to keep an empty payload.
fetch_to() {
  local out="$1"; shift
  if python3 "$@" >"$STAGE/$out.tmp" 2>"$STAGE/$out.err" && [ -s "$STAGE/$out.tmp" ]; then
    mv "$STAGE/$out.tmp" "$STAGE/$out.json"; echo "ok"
  else
    rm -f "$STAGE/$out.tmp"; echo "FAIL"
  fi
}

phase="${1:-}"
case "$phase" in
prep)
  echo "== sync =="
  if git fetch -q origin main && git checkout -q main && git reset -q --hard origin/main; then
    echo "repo at $(git rev-parse --short HEAD)"
  else
    echo "FATAL: git sync failed"; exit 1
  fi
  if [ ! -d node_modules ]; then
    echo "installing deps (first run)…"
    npm install --no-audit --no-fund >/dev/null 2>&1 || echo "WARN: npm install failed — validator may be unavailable"
  fi
  mkdir -p "$STAGE"
  rm -f "$STAGE"/*.json "$STAGE"/*.err "$STAGE"/*.tmp "$STAGE"/*.txt 2>/dev/null

  echo "== fetch =="
  echo "github  fetch: $(fetch_to gh-raw   scripts/dashboard/fetch_github.py)"
  echo "news    fetch: $(fetch_to news-raw scripts/dashboard/fetch_news.py)"
  echo "spotify fetch: $(fetch_to spotify  scripts/dashboard/fetch_spotify.py)"

  echo "== claude memory digest =="
  pop="/opt/data/snapshots/claude-memory/pop-os/projects"
  h01="$HOME/.claude/projects"
  : >"$STAGE/mem.txt"
  pop_n=0; h01_n=0
  if [ -d "$pop" ]; then
    while IFS= read -r f; do
      { echo "### [pop-os] $f"; cat "$f"; echo; } >>"$STAGE/mem.txt"
      pop_n=$((pop_n + 1))
    done < <(find "$pop" -name '*.md' -mtime -7 2>/dev/null)
  fi
  if [ -d "$h01" ]; then
    while IFS= read -r f; do
      { echo "### [host01] $f"; cat "$f"; echo; } >>"$STAGE/mem.txt"
      h01_n=$((h01_n + 1))
    done < <(find "$h01" -name '*.md' -mtime -7 2>/dev/null)
  fi
  stale="no"
  if [ -d "$pop" ]; then
    last="$(find "$pop" -name '*.md' -printf '%TY-%Tm-%Td\n' 2>/dev/null | sort | tail -1)"
    [ "$last" = "$(date -u +%Y-%m-%d)" ] || stale="yes (newest snapshot file dated ${last:-none})"
  else
    stale="yes (no pop-os snapshot dir)"
  fi
  echo "pop-os files (7d): $pop_n | host01: $h01_n | snapshot stale: $stale"

  echo "== allowlist =="
  # claudeTopicsAllowlist auto-expands with every published project page
  # (on-site => safe to name). Falls back to the raw config if the builder fails.
  python3 "$SCRIPT_DIR/build_allowlist.py" \
    || { cp -f "$DATA/dashboard-config.json" "$STAGE/config.json" 2>/dev/null \
         && echo "allowlist staged (raw fallback) -> $STAGE/config.json"; }

  cat <<BRIEF

== WHAT TO DO NOW ==
1. Read these staged inputs (short paths):
     $STAGE/gh-raw.json    raw GitHub activity (repos[].name + _recent_messages)
     $STAGE/news-raw.json  up to 20 HN candidates (title/url/source/points)
     $STAGE/mem.txt        recent Claude memory — pop-os PRIMARY, host01 supporting
     $STAGE/config.json    claudeTopicsAllowlist + claudeRedactionRules (HONOR these)
2. Write these artifacts with the file tool. SKIP any tile whose fetch said FAIL above
   (its published data is kept automatically):
     $STAGE/gh-sum.json    {"<repo full_name>": "past-tense summary, <=140 chars", ...}
     $STAGE/news-pick.json [{"url":"<from candidates>","whyItMatters":"<=140 chars"}, ...]  best 5
     $STAGE/focus.txt      1-2 sentences, present-tense first-person, this week's focus
     $STAGE/claude.md      2-4 short markdown paragraphs, redacted per allowlist + rules
     $STAGE/claude-hl.json [{"repo":"<in allowlist>","oneLiner":"..."}]  up to 4 (optional)
3. Run:  bash scripts/dashboard/refresh.sh finalize
4. Reply with ONLY finalize's report.
Do NOT write content/data directly. Do NOT author your own scripts.
BRIEF
  ;;

dry | finalize)
  echo "== merge =="
  python3 "$SCRIPT_DIR/merge.py" || { echo "FATAL: merge hard error"; exit 1; }

  echo "== validate =="
  vfail=0
  for t in $TILES; do
    f="$DATA/dashboard-$t.json"
    if npx --yes tsx "$SCRIPT_DIR/validate.ts" "$f" >"$STAGE/val-$t.txt" 2>&1; then
      echo "  $t: valid"
    else
      echo "  $t: INVALID — reverting this tile to published"
      sed 's/^/      /' "$STAGE/val-$t.txt"
      git checkout -- "$f" 2>/dev/null
      vfail=$((vfail + 1))
    fi
  done

  echo "== freshness =="
  today="$(date -u +%Y-%m-%d)"
  for t in $TILES; do
    f="$DATA/dashboard-$t.json"
    ua="$(python3 -c "import json,sys;print(json.load(open(sys.argv[1])).get('updatedAt',''))" "$f" 2>/dev/null)"
    case "$ua" in
      "$today"*) echo "  $t: FRESH ($ua)" ;;
      *)         echo "  $t: kept  ($ua)" ;;
    esac
  done

  if [ "$phase" = "dry" ]; then
    echo "== dry run: no commit, no push =="
    exit 0
  fi

  echo "== commit & push =="
  git add content/data/dashboard-*.json
  if git diff --cached --quiet; then
    echo "no changes to commit — nothing to deploy"
    exit 0
  fi
  if git commit -q -m "chore(dashboard): daily refresh $today

Refreshed by Hermes-Agent. See plans/dashboard-plan/HERMES.md." \
    && git push -q origin main; then
    echo "pushed $(git rev-parse --short HEAD) — deploy hook will rebuild within ~1 min"
  else
    echo "FATAL: commit/push failed"; exit 1
  fi
  ;;

*)
  echo "usage: refresh.sh {prep|dry|finalize}"; exit 2 ;;
esac
