#!/usr/bin/env bash
# THE INTERN — Guarded Rollback (P5)
# Default = DRY_RUN. No mutation unless BOTH --execute AND --owner-approved are present.
# Owner-required destructive recovery; LLM/operator recommendation != authority.
set -euo pipefail

PROJECT="the-intern"
TEAM="mrmacro-s-projects"
CANONICAL_URL="${RECOVERY_URL:-https://the-intern-snowy.vercel.app/}"
MARKER="${RECOVERY_MARKER:-MARKET CONTROL}"

EXECUTE=false
OWNER_APPROVED=false
for arg in "$@"; do
  case "$arg" in
    --execute) EXECUTE=true ;;
    --owner-approved) OWNER_APPROVED=true ;;
    --help|-h)
      cat <<HELP
Usage: $0 [--execute --owner-approved]

Default (no flags): DRY_RUN — no production mutation.
Requires BOTH --execute AND --owner-approved to attempt rollback.

Guarded rollback for Hobby plan: only immediately previous production deployment is eligible.
Uses: vercel rollback <previous-deployment-id-or-url> --yes

HELP
      exit 0
      ;;
  esac
done

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
PROJECT_ROOT="$(git -C "$SCRIPT_DIR" rev-parse --show-toplevel 2>/dev/null || echo "$(cd "$SCRIPT_DIR/../.." && pwd)")"
cd "$PROJECT_ROOT" 2>/dev/null || true

echo "=== Guarded Rollback — ${PROJECT} (${TEAM}) ==="
echo "Canonical URL: $CANONICAL_URL"
echo "Mode: checking guards..."
echo ""

# Preflight (read-only)
echo "--- Preflight ---"
bash "$SCRIPT_DIR/preflight.sh" 2>&1 | tee /tmp/p5_rollback_preflight.log
echo ""

# Extract values from preflight log for guards
CURRENT_DEPLOYMENT="$(grep '^current_deployment:' /tmp/p5_rollback_preflight.log | awk '{print $2}')"
PREVIOUS_DEPLOYMENT="$(grep '^previous_deployment:' /tmp/p5_rollback_preflight.log | awk '{print $2}')"
ROLLBACK_STATUS="$(grep '^rollback_status:' /tmp/p5_rollback_preflight.log | cut -d: -f2- | xargs)"
PROD_HEALTH="$(grep '^production_health:' /tmp/p5_rollback_preflight.log | cut -d: -f2- | xargs)"

# Verify project identity via .vercel/project.json if present
if [[ -f "$PROJECT_ROOT/.vercel/project.json" ]]; then
  PROJECT_JSON_NAME="$(python3 -c "import json; print(json.load(open('$PROJECT_ROOT/.vercel/project.json')).get('projectName',''))" 2>&1 || echo "")"
  if [[ "$PROJECT_JSON_NAME" != "$PROJECT" ]]; then
    echo "REFUSED: project identity mismatch — expected '$PROJECT', found '${PROJECT_JSON_NAME:-unknown}'"
    echo "NO MUTATION"
    exit 1
  fi
fi

echo "Current production deployment: ${CURRENT_DEPLOYMENT:-UNKNOWN}"
echo "Previous eligible deployment (Hobby): ${PREVIOUS_DEPLOYMENT:-UNKNOWN}"
echo "Production health: ${PROD_HEALTH:-UNKNOWN}"
echo "Rollback status: ${ROLLBACK_STATUS:-UNKNOWN}"
echo ""

# Show health evidence (one fresh check)
echo "--- Health evidence (fresh) ---"
if bash "$SCRIPT_DIR/production-health.sh" 2>&1 | tee /tmp/p5_rollback_health.log; then
  HEALTH_EXIT=0
else
  HEALTH_EXIT=1
fi
echo ""

# Determine if provider incident suspected (heuristic: caller must check status page)
# We do not auto-detect provider incident; we remind and refuse if health is unclear + caller asserts incident.
# For guard, we refuse rollback if health is currently HEALTHY (no need).

if [[ -z "${PREVIOUS_DEPLOYMENT:-}" ]] || [[ "$PREVIOUS_DEPLOYMENT" == "UNKNOWN" ]] || [[ "$PREVIOUS_DEPLOYMENT" == "-" ]]; then
  echo "REFUSED: previous production deployment cannot be identified (Hobby requires exactly previous production)."
  echo "Do not target arbitrary historical deployment."
  echo "NO MUTATION"
  exit 1
fi

if echo "$ROLLBACK_STATUS" | grep -q "No deployment rollback in progress"; then
  : # no rollback pending — continue
elif echo "$ROLLBACK_STATUS" | grep -qi "rollback in progress"; then
  echo "REFUSED: rollback already pending — wait for completion before new action."
  echo "Check: vercel rollback status --yes"
  echo "NO MUTATION"
  exit 1
elif echo "$ROLLBACK_STATUS" | grep -qi "in progress"; then
  echo "REFUSED: rollback already pending — wait for completion before new action."
  echo "Check: vercel rollback status --yes"
  echo "NO MUTATION"
  exit 1
fi

# Guard: if production already healthy, refuse automatic rollback
if [[ "$HEALTH_EXIT" -eq 0 ]]; then
  echo "REFUSED: current production is HEALTHY (HTTP 2xx + marker '${MARKER}' found) — rollback not warranted."
  echo "If provider incident suspected, check https://www.vercel-status.com/ and do NOT rollback."
  echo "NO MUTATION"
  # For dry-run mode, we still want to show planned action but not execute; treat healthy as refusal even for dry-run guard test
  # However per spec, dry-run should show planned action without mutation; we already showed it above.
  # Exit 1 signals guard refused; for default DRY_RUN without flags we exit 0 earlier with planned action.
  # To keep DRY_RUN as non-error, only refuse health guard when flags request execution.
  if [[ "$EXECUTE" == "true" && "$OWNER_APPROVED" == "true" ]]; then
    exit 1
  else
    echo "Planned rollback action (not executed): vercel rollback ${PREVIOUS_DEPLOYMENT} --yes"
    echo "DRY_RUN — NO PRODUCTION MUTATION"
    exit 0
  fi
fi

# At this point production is UNHEALTHY and previous is known — show planned action
echo "Planned rollback action: vercel rollback ${PREVIOUS_DEPLOYMENT} --yes"
echo ""

# Default dry-run guard
if [[ "$EXECUTE" != "true" || "$OWNER_APPROVED" != "true" ]]; then
  echo "DRY_RUN — NO PRODUCTION MUTATION"
  echo "To execute (owner-required): $0 --execute --owner-approved"
  echo "Missing flags: execute=${EXECUTE} owner-approved=${OWNER_APPROVED} — both required."
  if [[ "$EXECUTE" == "true" || "$OWNER_APPROVED" == "true" ]]; then
    echo "REFUSED: double gate not satisfied — NO MUTATION"
    exit 1
  fi
  exit 0
fi

# Both flags present — final checks before destructive mutation
echo "Both execution gates present (--execute --owner-approved). Performing final guards..."

# Re-check provider correlation reminder — require operator to have checked status
echo "Reminder: verify https://www.vercel-status.com/ — if Vercel provider incident, ABORT (rollback cannot fix provider outage)."
# We do not auto-abort on provider incident without explicit signal; operator must abort manually.
# For safety, we still refuse if health check flaps? No.

echo "Executing: vercel rollback ${PREVIOUS_DEPLOYMENT} --yes"
echo "Hobby limitation: only previous production (${PREVIOUS_DEPLOYMENT}) is rollback-eligible."

# Actual Vercel rollback (Hobby: previous production only)
if vercel rollback "${PREVIOUS_DEPLOYMENT}" --yes 2>&1 | tee /tmp/p5_rollback_exec.log; then
  echo "Rollback command issued."
  echo "Checking status..."
  vercel rollback status --yes 2>&1 | tee /tmp/p5_rollback_status_after.log || true
  echo ""
  echo "IMPORTANT: After Instant Rollback, auto-assignment of production domains is DISABLED."
  echo "After root cause fix, restore normal flow with: vercel promote <verified-deployment> --yes"
  echo "Do not assume push to main auto-publishes while in rollback state (see docs/RECOVERY.md)."
  exit 0
else
  echo "Rollback command failed — no promotion assumed."
  exit 1
fi
