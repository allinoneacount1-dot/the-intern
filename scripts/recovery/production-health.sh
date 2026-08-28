#!/usr/bin/env bash
# THE INTERN — Production Health Check (P5 Recovery)
# Read-only, deterministic. No mutation, no secrets.
# Success = HTTP 2xx AND marker present.
# Canonical: https://the-intern-snowy.vercel.app/ + MARKET CONTROL
set -euo pipefail

URL="${RECOVERY_URL:-https://the-intern-snowy.vercel.app/}"
# Allow drill override via RECOVERY_MARKER env; default is canonical marker
MARKER="${RECOVERY_MARKER:-MARKET CONTROL}"

MAX_ATTEMPTS=3
CONNECT_TIMEOUT=10
MAX_TIME=20
RETRY_DELAY=10

echo "Health check: $URL"
echo "Marker: $MARKER"

for attempt in 1 2 3; do
  echo "Attempt ${attempt}/3"
  BODY="$(mktemp)"
  CODE="$(
    curl \
      --silent \
      --show-error \
      --location \
      --connect-timeout "$CONNECT_TIMEOUT" \
      --max-time "$MAX_TIME" \
      --output "$BODY" \
      --write-out "%{http_code}" \
      "$URL" || true
  )"

  if [[ "$CODE" =~ ^2[0-9][0-9]$ ]] && grep -Fq "$MARKER" "$BODY"; then
    echo "Production healthy: HTTP $CODE + marker found"
    rm -f "$BODY"
    exit 0
  fi

  echo "Attempt failed: HTTP=${CODE} marker_present=$(grep -Fq "$MARKER" "$BODY" && echo yes || echo no)"
  rm -f "$BODY"

  if [[ "$attempt" -lt "$MAX_ATTEMPTS" ]]; then
    sleep "$RETRY_DELAY"
  fi
done

echo "Production health check failed after ${MAX_ATTEMPTS} attempts (HTTP 2xx + marker '${MARKER}' required)"
exit 1
