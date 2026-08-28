# INCIDENT TEMPLATE — THE INTERN

> Copy to `docs/incidents/INCIDENT-YYYY-MM-DD-<slug>.md`. No secrets.

## Identity

- **INCIDENT_ID:**
- **START_TIME:** (UTC, ISO-8601)
- **END_TIME:**
- **DETECTION_SOURCE:** (uptime workflow / health script / Vercel dashboard / user report / provider status)
- **SEVERITY:** (low/medium/high)
- **CLASSIFICATION:** (A_TRANSIENT / B_PROVIDER_INCIDENT / C_DEPLOYMENT_REGRESSION / D_SOURCE_REGRESSION)

## Symptom

- **SYMPTOM:**

## Deployment Baseline (from `scripts/recovery/preflight.sh`)

- **CURRENT_DEPLOYMENT:**
- **CURRENT_SHA:**
- **PREVIOUS_DEPLOYMENT:**
- **PREVIOUS_SHA:**
- **GITHUB_MAIN_SHA:**
- **PROVIDER_STATUS:** (https://www.vercel-status.com/ — checked at <time> — result)
- **ROLLBACK_STATUS:** (`vercel rollback status --yes`)
- **PROMOTE_STATUS:** (`vercel promote status --yes`)
- **PRODUCTION_HEALTH:** (`scripts/recovery/production-health.sh` — exit / log)

## Timeline

| Time (UTC) | Action | Evidence |
|---|---|---|
|  | DETECT |  |
|  | CONFIRM |  |
|  | CLASSIFY |  |
|  | CONTAIN |  |
|  | DIAGNOSE |  |
|  | RECOVER |  |
|  | VERIFY (×3) |  |
|  | DOCUMENT |  |

## Containment

- **CONTAINMENT:** (none / recheck / wait-for-provider / owner rollback to `<deployment>`)
- **OWNER_APPROVAL:** (who, when, command run)

## Recovery Action

- **RECOVERY_ACTION:**
- **ROLLBACK_COMMAND:** (if any: `vercel rollback <id> --yes`)
- **PROMOTE_COMMAND:** (if rollback-state active: `vercel promote <verified-deployment> --yes`)
- **FIX_FORWARD_PR:** (branch → PR → CI/Dependency Review/Preview → merge)

## Verification

- **PRODUCTION_HEALTH_POST:** (3× `production-health.sh` exits)
- **DEPLOYMENT_STATE_POST:**
- **DOMAIN_POST:** (canonical `https://the-intern-snowy.vercel.app/` — HTTP + marker)
- **STABILITY_WINDOW:** (3 successes, intervals)

## Root Cause

- **ROOT_CAUSE:**

## Follow-Up

- **FOLLOW_UP:** (revert commit / fix / provider ticket / doc update / runbook change)

## Tags

- `project: the-intern`
- `environment: production`
- `commit_sha:`
- `deployment_id:`
