#!/usr/bin/env bash
# THE INTERN — Guarded Rollback (P5 Safety Hardening)
# Default = DRY_RUN. No mutation unless ALL destructive gates satisfied.
# Destructive gates: --execute + --owner-approved + --provider-status healthy + production UNHEALTHY + valid previous + identity + no pending
set -euo pipefail

PROJECT="the-intern"
TEAM="mrmacro-s-projects"
CANONICAL_URL="${RECOVERY_URL:-https://the-intern-snowy.vercel.app/}"
MARKER="${RECOVERY_MARKER:-MARKET CONTROL}"

EXECUTE=false
OWNER_APPROVED=false
PROVIDER_STATUS="unknown"
for arg in "$@"; do
  case "$arg" in
    --execute) EXECUTE=true ;;
    --owner-approved) OWNER_APPROVED=true ;;
    --provider-status) PROVIDER_STATUS="unknown" ;; # placeholder, real parsing in second pass
    --provider-status=*) PROVIDER_STATUS="${arg#*=}" ;;
    --help|-h)
      cat <<HELP
Usage: $0 [--execute --owner-approved --provider-status healthy|incident|unknown]

Default (no flags): DRY_RUN — no production mutation.
Destructive execution requires ALL:
  --execute
  --owner-approved
  --provider-status healthy
plus: production UNHEALTHY, valid previous production, identity correct, no pending rollback.

Provider classification is operator evidence (https://www.vercel-status.com/):
  healthy  = provider healthy, regression is application deployment
  incident = provider incident, DO NOT ROLLBACK
  unknown  = default, not yet classified — REFUSED

Guarded rollback for Hobby plan: only immediately previous production deployment is eligible.
Uses: vercel rollback <previous-deployment-id-or-url> --yes

HELP
      exit 0
      ;;
  esac
done
# Second pass to correctly parse --provider-status <value> (space separated)
# Re-parse with index handling
EXECUTE=false
OWNER_APPROVED=false
PROVIDER_STATUS="unknown"
ARGS=("$@")
i=0
while [[ $i -lt ${#ARGS[@]} ]]; do
  case "${ARGS[$i]}" in
    --execute) EXECUTE=true ;;
    --owner-approved) OWNER_APPROVED=true ;;
    --provider-status)
      if [[ $((i+1)) -lt ${#ARGS[@]} ]]; then
        PROVIDER_STATUS="${ARGS[$((i+1))]}"
        i=$((i+1))
      fi
      ;;
    --provider-status=*) PROVIDER_STATUS="${ARGS[$i]#*=}" ;;
  esac
  i=$((i+1))
done
# Validate provider status value
if [[ "$PROVIDER_STATUS" != "healthy" && "$PROVIDER_STATUS" != "incident" && "$PROVIDER_STATUS" != "unknown" ]]; then
  echo "REFUSED: invalid --provider-status '$PROVIDER_STATUS' (expected healthy|incident|unknown)"
  echo "NO MUTATION"
  exit 1
fi

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
PROJECT_ROOT="$(git -C "$SCRIPT_DIR" rev-parse --show-toplevel 2>/dev/null || echo "$(cd "$SCRIPT_DIR/../.." && pwd)")"
cd "$PROJECT_ROOT" 2>/dev/null || true

echo "=== Guarded Rollback — ${PROJECT} (${TEAM}) ==="
echo "Canonical URL: $CANONICAL_URL"
echo "Provider status: $PROVIDER_STATUS"
echo "Mode: checking guards..."
echo ""

# EARLY DOUBLE-GATE VALIDATION (before destructive eligibility)
if [[ "$EXECUTE" == "true" && "$OWNER_APPROVED" == "false" ]] || [[ "$EXECUTE" == "false" && "$OWNER_APPROVED" == "true" ]]; then
  echo "REFUSED: double gate not satisfied — both --execute and --owner-approved required (got execute=$EXECUTE owner-approved=$OWNER_APPROVED)"
  echo "NO MUTATION"
  exit 1
fi

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

# Default dry-run guard (no flags)
if [[ "$EXECUTE" != "true" || "$OWNER_APPROVED" != "true" ]]; then
  echo "DRY_RUN — NO PRODUCTION MUTATION"
  echo "To execute (owner-required): $0 --execute --owner-approved --provider-status healthy"
  echo "Missing flags: execute=${EXECUTE} owner-approved=${OWNER_APPROVED} provider-status=${PROVIDER_STATUS} — all required for execution."
  if [[ "$EXECUTE" == "true" || "$OWNER_APPROVED" == "true" ]]; then
    echo "REFUSED: double gate not satisfied — NO MUTATION"
    exit 1
  fi
  exit 0
fi

# Both execution gates present — enforce provider guard
if [[ "$PROVIDER_STATUS" == "unknown" ]]; then
  echo "REFUSED: provider status unknown — explicit --provider-status healthy required for destructive execution"
  echo "Check https://www.vercel-status.com/ and classify provider before rollback."
  echo "NO MUTATION"
  exit 1
fi
if [[ "$PROVIDER_STATUS" == "incident" ]]; then
  echo "REFUSED: provider incident — rollback cannot fix provider outage, DO NOT ROLLBACK"
  echo "See docs/RECOVERY.md class B: WAIT + RECHECK + DOCUMENT"
  echo "NO MUTATION"
  exit 1
fi
# PROVIDER_STATUS == healthy continues

# Final checks before destructive mutation — both execution gates + provider healthy
echo "Both execution gates present (--execute --owner-approved) with provider-status healthy. Performing final guards..."
echo "Reminder: verify https://www.vercel-status.com/ — provider healthy confirmed."

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
