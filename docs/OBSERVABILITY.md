# THE INTERN — Observability

> Verified 2026-08-28 — P4_OBSERVABILITY
> Canonical repo: `allinoneacount1-dot/the-intern`
> Provider: Vercel `mrmacro-s-projects/the-intern` (`prj_fkVTmCDIsdOgL2NbvVZd5u3EmxUF`)
> Production URL: `https://the-intern-snowy.vercel.app`
> Node: `22.x` (engines override)
> Class: A / STATELESS

## 1. Overview

`P4_OBSERVABILITY = IMPLEMENTED_VERIFIED` — baseline observation without SLO theater. For Class A stateless (no DB, no auth, no wallet, no write-capable backend), observability is **provider-native + synthetic HTTP** — no custom tracker, no error aggregator yet.

## 2. Canonical Identities

| Field | Value |
|---|---|
| project | `the-intern` |
| vercel projectId | `prj_fkVTmCDIsdOgL2NbvVZd5u3EmxUF` |
| vercel team | `mrmacro-s-projects` (`team_24xZRsYErTeKL6qmbZphBS6g`) |
| vercel team identity | `oxwebthree-7231` |
| production domain | `the-intern-snowy.vercel.app` (alias) |
| production branch | `main` |
| framework | `nextjs` (Turbopack) |
| nodeVersion (actual) | `22.x` via `engines: 22.x` (project setting `24.x` overridden — build log: `Skipping build cache since Node.js version changed from "24.x" to "22.x"`) |
| region | `iad1` |

## 3. Deployment Metadata (provider-native)

Canonical observable tags per deployment:

`project` | `environment` | `commit_sha` | `deployment_id` | `branch` | `status` | `created_at` | `ready_at`

| deployment | environment | commit_sha | deployment_id | branch | status | created_at | ready_at |
|---|---|---|---|---|---|---|---|
| `the-intern-dkvv1rb8v-mrmacro-s-projects.vercel.app` | production | `c0abd05275167a2993e4cc0c875e195c6d26b5d4` (docs: update runtime) | `dpl_***dkvv1rb8v` | `main` | READY | 2026-08-28 18:?? UTC | READY |
| `the-intern-l629u18k3-mrmacro-s-projects.vercel.app` | production | `5bcba973d422bda9b335721581197781f5fdc5a1` (Merge PR #10 runtime-alignment) | `dpl_5PNAHHkAu9NSgroitu4XJmqVgmxL` | `main` | READY | 2026-08-28T11:08 UTC | 2026-08-28T11:08 UTC |
| `the-intern-10yh3k92c-mrmacro-s-projects.vercel.app` | preview | `9863957f30cfd2ff790b605915381292e7ad0b8a` (chore: runtime alignment) | `dpl_WNBqAYt7uTWbE2YwpP6j1nTEnomk` | `devops/runtime-alignment` | READY | 2026-08-28T11:03 UTC | 2026-08-28T11:03 UTC |

Verification commands (operator):
```bash
vercel ls --json
vercel inspect <deployment-url> --json   # check config.nodeVersion, output[].lambda.runtime = nodejs22.x
# Build logs (provider-native):
TOKEN=$(cat ~/.vercel-token | cut -d= -f2)
curl -H "Authorization: Bearer $TOKEN" "https://api.vercel.com/v2/deployments/<deployment_id>/events?limit=200" | jq
```

Production observability: `vercel ls` shows `target: production`, `state: READY`, `lambdaRuntimeStats: {"nodejs":1}`, `runtime: nodejs22.x`.
Preview isolation: preview deployments `target: null` (preview), unique URL per PR, never promote to `the-intern-snowy.vercel.app` unless `main`.

No custom deployment tracker — all metadata is Vercel-native.

## 4. Web Analytics

- **Enabled:** yes (Vercel Web Analytics project id `Wep7W5Jabyx863OzqxCWggjKj`, verified via `GET /v1/projects/prj_fk...`)
- **Package:** `@vercel/analytics` (npm install)
- **Instrumentation:** `src/app/layout.tsx`:
  ```tsx
  import { Analytics } from "@vercel/analytics/next";
  // in RootLayout body:
  <Analytics />
  ```
- **Scope:** page views, route analytics, basic visitor telemetry (Vercel-managed). No custom events, no wallet/userId/fingerprinting, no secret/query capture.
- **Production verified:** build log shows `Installing dependencies` includes `@vercel/analytics`; preview & production deployments `READY` with instrumentation mounted. Dashboard traffic will appear as real visitors hit production (baseline observation, no threshold yet).

## 5. Speed Insights

- **Enabled:** yes (Vercel Speed Insights id `Qj0kxPxPOedicrGxXwy9PT5JMHV`, `hasData: false` baseline — expected before traffic)
- **Package:** `@vercel/speed-insights`
- **Instrumentation:** `src/app/layout.tsx`:
  ```tsx
  import { SpeedInsights } from "@vercel/speed-insights/next";
  // in RootLayout body:
  <SpeedInsights />
  ```
- **Goal (BASELINE_OBSERVATION):** LCP, CLS, INP, TTFB/FCP as exposed by Vercel. No SLO/threshold until data exists.
- **Production verified:** same build as Analytics; `READY` deployment includes Speed Insights script.

## 6. External Uptime (Synthetic)

- **Workflow:** `.github/workflows/uptime.yml` — `Production Uptime`
- **Runner:** GitHub Actions (not Hermes cron) — `ubuntu-latest`, `timeout-minutes: 5`
- **Cadence:** `*/15 * * * *` (every 15 minutes) + `workflow_dispatch` (manual)
- **Target:** `https://the-intern-snowy.vercel.app/`
- **Marker (server-rendered, stable):** `MARKET CONTROL` — verified via `curl -s https://the-intern-snowy.vercel.app/ | grep -F "MARKET CONTROL"` → present in `<h2>MARKET CONTROL</h2>` of production HTML (static page, not JS-only). Documented actual marker: `MARKET CONTROL`.
- **Success criteria:** HTTP 2xx (`^2[0-9][0-9]$`) **AND** `grep -Fq "MARKET CONTROL"` on body
- **3-attempt bounded policy:**
  ```bash
  for attempt in 1 2 3; do
    curl --silent --show-error --location --connect-timeout 10 --max-time 20 ...
    if 2xx && marker; then exit 0; fi
    [[ $attempt -lt 3 ]] && sleep 10
  done
  exit 1
  ```
- **Required checks:** Uptime is **NOT** a required PR check (watches current production, not PR correctness). Required gates remain `CI / quality` + `Dependency Review` + `Vercel Preview READY`.
- **Alert owner:** GitHub Actions failure notification (repo owner `allinoneacount1-dot`, via Actions UI/email). No auto-rollback/redeploy — observe only.
- **P4 MUST NOT:** auto rollback, auto redeploy, restart production, modify DNS/domain, change isolation.

Manual verification after merge on `main`: `gh workflow run "Production Uptime"` → capture run ID → expect `PASS` (HTTP 2xx + marker).

Failure injection (disposable `test/p4-uptime-failure`): marker `__P4_EXPECTED_FAILURE_MARKER_DO_NOT_EXIST__` → expect 3 attempts `FAIL` → revert marker → recovery `PASS`. No merge of failure branch; preserve Actions history.

## 7. Log Sources

| Source | What | Where | Access |
|---|---|---|---|
| **BUILD** | Vercel build logs (install, Next.js compile, `npm run build`) | Vercel deployment `events` API (`/v2/deployments/<id>/events`) + dashboard | `TOKEN=...; curl -H "Authorization: Bearer $TOKEN" https://api.vercel.com/v2/deployments/dpl_.../events` |
| **RUNTIME** | Vercel function/runtime logs (serverless, edge) | Vercel `vercel logs <deployment>` or dashboard Runtime Logs | `vercel logs <url> --follow` (Class A/stateless = minimal serverless logs = expected, not failure) |
| **CLIENT** | Web Analytics (page views, route) + Speed Insights (LCP/CLS/INP/TTFB) | Vercel dashboard → Analytics / Speed Insights tabs | Provider-native, no custom collector |
| **SYNTHETIC** | GitHub Actions uptime (`curl` HTTP+marker) | GitHub Actions → `Production Uptime` workflow runs | `gh run list --workflow="Production Uptime"` |
| **SECURITY** | Dependabot PRs + Dependency Review (high/critical) | GitHub → Dependabot tab + PR checks | `security/dependabot-version-policy`, `.github/workflows/dependency-review.yml` (implicit via GitHub) |
| **OPERATOR** | Hermes/Anya logs (local ops, deploy, verification) | Local HermesHome, not Vercel | Out of scope for app observability |

THE INTERN Class A/stateless has no API/backend significant — so minimal runtime-function logs is **expected**, not a gap.

## 8. Error Tracking

- **Dedicated client error provider:** `DEFERRED_BY_RISK`
- **Reason:** Current app is stateless, no wallet, no auth, no transaction flow, no critical write-capable client operation. No actual evidence requiring Sentry/etc.
- **Action:** Do not install Sentry. Do not build custom error collector. Re-evaluate if scope gains auth/wallet/transaction.
- **Current errors observed:** none in build logs beyond deprecation warning `eslint@9.39.5 no longer supported` (non-blocking).

## 9. Privacy

Observability does **not** collect/log:
- secret, token, private key, authorization header, session credential, raw operator credential, unnecessary personal data

Enforced:
- `Analytics` and `SpeedInsights` are Vercel-managed, no custom `track()` events in P4
- `uptime.yml` only logs HTTP code + marker presence, not body secrets; `BODY` temp file is `rm -f` immediately
- No custom analytics events, no fingerprinting, no user ID, no wallet tracking
- Vercel `env` remains empty (`vercel env list` → `0 vars`) — no credential in app env
- GitHub Actions permissions `contents: read` only

## 10. Alerting & Provider Correlation

- **Uptime failure:** GitHub Actions run `FAIL` → visible in Actions UI, email to repo owner if notifications enabled. No auto-redeploy.
- **Deployment correlation:** Each deployment carries `commit_sha` + `deployment_id` + `project` + `environment` tags. Correlate via `vercel ls --json` ↔ `git log` ↔ GitHub commit SHA.
- **Canonical tags:** `project=the-intern`, `environment=production/preview/development`, `commit_sha=<sha>`, `deployment_id=dpl_...` — present in Vercel metadata and GitHub commit.

## 11. Known Limitations

- Web Analytics / Speed Insights require real traffic to show data — `hasData: false` baseline is expected immediately after instrumentation.
- Preview deployments show isolated URL, not production domain — Analytics on preview is separate, not counted as production.
- Uptime checks production only, not PR preview correctness — by design.
- Vercel hobby plan does not expose a stable provider-native GitHub check name for preview to make it a required branch protection context — handled as `VERIFIED_PROVIDER_EVIDENCE` via `vercel ls` READY.
- Runtime logs minimal for static Class A app — not an incident.
- `npm warn reify invalid or damaged lockfile detected` appears in both local `npm ci` and Vercel build logs — originates from `npm` handling of lockfile after `engines` change, but install succeeds (`added 690 packages`) and build passes; not blocking.

## 12. Verification Evidence

- `npm list @vercel/analytics @vercel/speed-insights` → both installed
- `grep -F "Analytics" src/app/layout.tsx` → `import { Analytics }` + `<Analytics />`
- `grep -F "SpeedInsights" src/app/layout.tsx` → `import { SpeedInsights }` + `<SpeedInsights />`
- `cat .github/workflows/uptime.yml` → schedule `*/15 * * * *`, target `https://the-intern-snowy.vercel.app/`, marker `MARKET CONTROL`, 3 attempts
- `curl -s https://the-intern-snowy.vercel.app/ | grep -F "MARKET CONTROL"` → found
- `vercel ls --json` → production `target: production` READY, preview READY
- `vercel inspect --json` → `runtime: nodejs22.x`
- `curl ... /v2/deployments/<id>/events` → `Skipping build cache since Node.js version changed from "24.x" to "22.x"` + `Warning: ... Node.js Version "22.x" will be used instead`
- Manual `gh workflow run "Production Uptime"` → PASS (HTTP 2xx + marker)
- Failure injection `__P4_EXPECTED_FAILURE_MARKER_DO_NOT_EXIST__` → FAIL, recovery PASS (run IDs captured in PR/ Actions history)

---
*Provider: Vercel. No secrets in this doc.*
