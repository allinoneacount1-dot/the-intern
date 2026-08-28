#!/usr/bin/env bash
# THE INTERN — Recovery Preflight (P5)
# Read-only collection. No mutation, no secrets.
set -euo pipefail

# Resolve project root robustly regardless of caller cwd
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
PROJECT_ROOT="$(git -C "$SCRIPT_DIR" rev-parse --show-toplevel 2>/dev/null || echo "$(cd "$SCRIPT_DIR/../.." && pwd)")"
cd "$PROJECT_ROOT" 2>/dev/null || true

URL="${RECOVERY_URL:-https://the-intern-snowy.vercel.app/}"
MARKER="${RECOVERY_MARKER:-MARKET CONTROL}"

timestamp="$(date -u +"%Y-%m-%dT%H:%M:%SZ")"

# Health (reuse production-health.sh semantics, non-fatal)
health_status="UNKNOWN"
health_detail="n/a"
if bash "$(dirname "$0")/production-health.sh" >/tmp/p5_preflight_health.log 2>&1; then
  health_status="HEALTHY"
  health_detail="$(tail -1 /tmp/p5_preflight_health.log)"
else
  health_status="UNHEALTHY"
  health_detail="$(tail -1 /tmp/p5_preflight_health.log 2>&1 | head -1)"
fi

# Current / previous production deployments via Vercel CLI JSON (filtered target=production)
current_deployment="UNKNOWN"
current_sha="UNKNOWN"
previous_deployment="UNKNOWN"
previous_sha="UNKNOWN"
vercel_state="UNKNOWN"
github_main="UNKNOWN"
rollback_status="UNKNOWN"
promote_status="UNKNOWN"

# Vercel deployments
if vercel ls --json >/tmp/p5_vercel_ls.json 2>&1; then
  # Extract first two production deployments
  read -r current_deployment current_sha vercel_state <<<"$(python3 -c "
import json
t=open('/tmp/p5_vercel_ls.json').read()
import re
idx=t.find('{')
data=json.loads(t[idx:])
deps=[d for d in data.get('deployments',[]) if d.get('target')=='production']
if len(deps) >= 1:
    d=deps[0]
    sha=d.get('meta',{}).get('githubCommitSha','-')
    print(f\"{d.get('url','-')} {sha[:7] if sha!='-' else '-'} {d.get('state','-')}\")
else:
    print('- - -')
" 2>&1)"
  read -r previous_deployment previous_sha _ <<<"$(python3 -c "
import json
t=open('/tmp/p5_vercel_ls.json').read()
import re
idx=t.find('{')
data=json.loads(t[idx:])
deps=[d for d in data.get('deployments',[]) if d.get('target')=='production']
if len(deps) >= 2:
    d=deps[1]
    sha=d.get('meta',{}).get('githubCommitSha','-')
    print(f\"{d.get('url','-')} {sha[:7] if sha!='-' else '-'} -\")
else:
    print('- - -')
" 2>&1)"
else
  vercel_state="VERCEL_LS_FAILED"
fi

# Rollback / promote status (Hobby: use --yes)
if vercel rollback status --yes >/tmp/p5_rollback_status.txt 2>&1; then
  rollback_status="$(grep -E 'No deployment rollback|rollback in progress|Checking rollback' /tmp/p5_rollback_status.txt | tail -1 | xargs || echo 'UNKNOWN')"
  # Normalize
  if grep -q "No deployment rollback" /tmp/p5_rollback_status.txt; then
    rollback_status="No deployment rollback in progress"
  elif grep -q "rollback in progress" /tmp/p5_rollback_status.txt; then
    rollback_status="$(cat /tmp/p5_rollback_status.txt | tr -d '\n' | xargs)"
  fi
else
  rollback_status="UNKNOWN"
fi

if vercel promote status --yes >/tmp/p5_promote_status.txt 2>&1; then
  if grep -q "No deployment promotion" /tmp/p5_promote_status.txt; then
    promote_status="No deployment promotion in progress"
  else
    promote_status="$(grep -E 'promotion in progress|No deployment promotion' /tmp/p5_promote_status.txt | tail -1 | xargs || echo UNKNOWN)"
  fi
else
  promote_status="UNKNOWN"
fi

# GitHub main SHA
if git rev-parse origin/main >/tmp/p5_github_sha.txt 2>&1; then
  github_main="$(cat /tmp/p5_github_sha.txt | cut -c1-7)"
else
  github_main="UNKNOWN"
fi

provider_status="CHECK https://www.vercel-status.com/ — if provider incident, DO NOT ROLLBACK (see docs/RECOVERY.md class B)"

cat <<EOF
RECOVERY_PREFLIGHT

production_health: ${health_status} (${health_detail})
current_deployment: ${current_deployment}
current_sha: ${current_sha}
previous_deployment: ${previous_deployment}
previous_sha: ${previous_sha}
rollback_status: ${rollback_status}
promote_status: ${promote_status}
github_main: ${github_main}
provider_status: ${provider_status}
timestamp: ${timestamp}
url: ${URL}
marker: ${MARKER}
EOF

echo ""
echo "Note: preflight is read-only. No production mutation performed."
