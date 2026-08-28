# THE INTERN — Recovery

> Verified 2026-08-28 — P5_RECOVERY
> Repo: `allinoneacount1-dot/the-intern` | Project: `the-intern` (`prj_fkVTmCDIsdOgL2NbvVZd5u3EmxUF`, team `mrmacro-s-projects`)
> Class: **A_STATELESS** (no DB, no auth, no wallet, no stateful backend)
> Production: `https://the-intern-snowy.vercel.app/` → `the-intern-313d9xvg4-mrmacro-s-projects.vercel.app` (`dpl_5GX9B3MBZN4uNHjAbFc5vKTrzDkM`)
> Previous production (Hobby-eligible): `the-intern-dkvv1rb8v-mrmacro-s-projects.vercel.app` (`dpl_BzwADknoGiQapnWwys8g6XDYydVH`) @ `c0abd05`
> Node: `22.x` (engines `22.x`, runtime `nodejs22.x`)
> Plan: **HOBBY**
> P5 baseline: `2026-08-28T15:00Z` — `rollback status --yes: No deployment rollback in progress`, `promote status --yes: No deployment promotion in progress`, health `HEALTHY (HTTP 200 + MARKET CONTROL)`

## 1. Lifecycle

```
DETECT → CONFIRM → CLASSIFY → CONTAIN → DIAGNOSE → RECOVER → VERIFY → DOCUMENT
```

*Recovery ≠ rollback alone.* Rollback is **containment**; durable recovery is **fix-forward**.

## 2. Authority

| Capability | Authority |
|---|---|
| recheck health, collect logs, `vercel inspect`, `vercel ls`, `vercel rollback status`, compare commits, prepare plan, bounded retry, document | **AUTO_SAFE** (any operator/Anya) |
| `vercel rollback`, `vercel promote`, production redeploy outside Git→Vercel, DNS/domain mutation, destructive restore, credential change | **OWNER_REQUIRED** — LLM recommendation ≠ authority |

Rules: `AUTO_DESTRUCTIVE_RECOVERY=OFF`, `AUTO_ROLLBACK=OFF`, `AUTO_PROD_REDEPLOY=OFF`, `AUTO_DNS_MUTATION=OFF`.

## 3. Classification

**A. TRANSIENT** — single probe fail, retry succeeds. **Action:** `RECHECK`, no rollback.
**B. PROVIDER INCIDENT** — `https://www.vercel-status.com` incident, multiple projects affected, deployment `READY` but edge unavailable. **Action:** `WAIT + RECHECK + DOCUMENT`, **DO NOT ROLLBACK** (cannot fix provider outage).
**C. APPLICATION DEPLOYMENT REGRESSION** — production unhealthy, provider healthy, current deployment correlates, previous known-good verified healthy. **Action:** `OWNER_REQUIRED_INSTANT_ROLLBACK` to **previous production only** (Hobby).
**D. SOURCE/CODE REGRESSION** — after containment, durable repair via `branch → fix/revert → PR → CI / quality → Dependency Review → Preview READY → merge → production READY` (never direct-push `main`).

## 4. Hobby Rollback Limitation

Hobby plan: **only immediately previous production deployment is rollback-eligible.** Do not target arbitrary old deployment. Current: `5e69346` → rollback target `c0abd05` only.

## 5. Instant Rollback State

After `vercel rollback`:
- production domains (`the-intern-snowy.vercel.app`) point to previous deployment
- **auto-assignment of production domains becomes disabled** (verified via `vercel rollback status` docs)
- Push to `main` does NOT auto-publish while in rollback state

Restoration requires owner: `vercel promote <verified-fixed-deployment> --yes` + `vercel promote status --yes`.

## 6. Fix-Forward / Reconciliation

```
Emergency rollback (owner) → service restored → identify bad commit
→ recovery branch → fix / git revert → PR → CI/Dependency Review/Preview
→ merge → new production READY → verify → owner promote if rollback-active
→ normal Git→Vercel flow restored
```

Rollback and Git source must not diverge indefinitely.

## 7. Decision Matrix

| Signal | Action |
|---|---|
| 1 failed probe | RECHECK |
| 3 failed probes | INVESTIGATE |
| Vercel provider incident | WAIT / NO ROLLBACK |
| bad preview | FIX PREVIEW |
| production regression | OWNER_REQUIRED ROLLBACK |
| production healthy | NO ACTION |
| bad source commit | FIX/REVERT VIA PR |
| rollback successful | VERIFY + FIX SOURCE |
| fixed production READY | OWNER PROMOTE IF NEEDED |

## 8. Tools

| Script | Path | Behavior |
|---|---|---|
| Health | `scripts/recovery/production-health.sh` | deterministic read-only: `curl --location --connect-timeout 10 --max-time 20` ×3, `sleep 10`, success `HTTP 2xx + grep -Fq MARKET CONTROL`, exit `0` healthy / `1` unhealthy, respects `RECOVERY_MARKER` override for drill |
| Preflight | `scripts/recovery/preflight.sh` | read-only: timestamp, URL health, `vercel ls --json` (production filter), current/previous deployment + SHA, `vercel rollback status --yes`, `vercel promote status --yes`, `git rev-parse origin/main`, provider reminder; outputs `RECOVERY_PREFLIGHT` block; no secrets |
| Rollback | `scripts/recovery/rollback.sh` | **default DRY_RUN** — no mutation; prints preflight, identity, health evidence, planned `vercel rollback <previous> --yes`; execution requires **both** `--execute --owner-approved`; refuses if provider incident, healthy, previous unknown, identity mismatch, rollback pending; post-rollback reminds promote |

No secrets printed. No `AUTO_*`.

## 9. Observability Correlation

- `vercel ls --prod` / `vercel ls --json` / `vercel inspect <url>` → project, deployment_id, SHA, state, timestamps, `nodejs22.x`
- `vercel rollback status --yes`, `vercel promote status --yes`
- `.github/workflows/uptime.yml` (15m, `MARKET CONTROL`) + `scripts/recovery/production-health.sh` (same marker)
- `docs/OBSERVABILITY.md` (Web Analytics, Speed Insights, synthetic)

## 10. Stability Verification

Not one lucky request. After real recovery require:
- `HTTP 2xx + MARKET CONTROL`
- deployment state expected, canonical domain correct, no pending rollback
- **3 successful health checks** separated by intervals (drill: short; incident: reasonable)

## 11. Escalation

1. Run `scripts/recovery/preflight.sh` + `production-health.sh`
2. Check `https://www.vercel-status.com`
3. Classify (A/B/C/D)
4. If **C** and criteria met, request **owner** for `rollback.sh --execute --owner-approved`
5. Verify + document via `docs/incidents/INCIDENT_TEMPLATE.md`

## 12. Known Limitations

- Hobby: single previous rollback target only
- `AUTO_DESTRUCTIVE_RECOVERY` off — no autonomous production mutation
- Rollback disables auto-domain assignment until promote
- Class A stateless: minimal function/runtime logs expected

## 13. Verification (P5 drill 2026-08-28)

- `production-health.sh` on `main`: **PASS** `HTTP 200 + marker`
- `RECOVERY_MARKER=__P5_NON_EXISTENT_MARKER__`: **FAIL** after 3 attempts (expected)
- Restore marker: **PASS**
- `./scripts/recovery/rollback.sh` (no flags): **DRY_RUN, NO MUTATION**, production ID unchanged (`dpl_5GX9B3MBZN4uNHjAbFc5vKTrzDkM`), domain unchanged, rollback status unchanged
- `./scripts/recovery/rollback.sh --execute`: **REFUSED** (double gate)
- `./scripts/recovery/rollback.sh --owner-approved`: **REFUSED** (double gate)
- Never ran `--execute --owner-approved` on healthy production
