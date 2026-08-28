# THE INTERN — Environment Isolation

> Verified 2026-08-28 — P3_ENVIRONMENT_ISOLATION
> Canonical repo: `allinoneacount1-dot/the-intern`
> Provider: Vercel `mrmacro-s-projects/the-intern`

## 1. Project Classification

**Class:** A / STATELESS — verified fresh 2026-08-28

Evidence:
- `grep -R process.env` → no matches (only `.gitignore:.env*`)
- `grep -R NEXT_PUBLIC_` → no matches
- `grep -R database|prisma|supabase|firebase|mongodb|postgres|redis|rpc|wallet|webhook|server*action` → no matches
- `src/` contains only static pages (`page.tsx`, `layout.tsx`, `/archives`, `/asset`, `/comms`, `/employee`, `/handbook`, `/incidents`, `/office`, `/unknown`) — no `/api` routes
- `package.json` dependencies: `next 16.3.3`, `react 19.2.8`, `react-dom 19.2.8`, `gsap ^3.15.0`, `lenis ^1.3.26` — no DB/storage/RPC drivers
- `npm ls --all` shows no persistent-state transitive deps beyond UI/build

| Attribute | Value |
|---|---|
| APPLICATION ENV VARS | NONE |
| PERSISTENT STATE | NONE |
| WRITE-CAPABLE EXTERNAL RESOURCE | NONE |
| RUNTIME CREDENTIALS | NONE |
| DATABASE | NONE |
| STORAGE | NONE |

If future discovery finds state/credential, STOP this classification and re-report with evidence — do not force Class A.

## 2. Canonical Identities

| Layer | Value |
|---|---|
| GitHub repo | `allinoneacount1-dot/the-intern` |
| Git remote (verified) | `https://github.com/allinoneacount1-dot/the-intern.git` — no token in URL |
| Git credential | `gh auth git-credential` (keyring `allinoneacount1-dot`, scopes repo+workflow) |
| Vercel identity | `oxwebthree-7231` |
| Vercel team | `mrmacro-s-projects` (`team_24xZRsYErTeKL6qmbZphBS6g`) |
| Vercel project | `the-intern` (`prj_fkVTmCDIsdOgL2NbvVZd5u3EmxUF`) |
| Vercel framework | `nextjs`, Node `24.x`, region `iad1` |
| Git link (verified) | `type: github, org: allinoneacount1-dot, repo: the-intern, repoId: 1348720039, productionBranch: main` — connected 2026-08-28 via `vercel git connect` |
| Canonical production domains | `the-intern-snowy.vercel.app`, `the-intern-mrmacro-s-projects.vercel.app` (auto aliases) |

## 3. Environment Model

### LOCAL
- Source: developer worktree (`/media/satria/extra/HermesHome/projects/the-intern-env` or any local checkout)
- Environment: `development`
- Production domain: NO
- Production credential: NO
- Persistent prod state: NO
- `vercel env ls` → local reads `.env.local` (git-ignored), never committed

### PREVIEW
- Source: non-main Git branch / PR (e.g., `devops/environment-isolation`)
- Vercel environment: `preview`
- Each PR gets isolated deployment: `https://the-intern-<hash>-mrmacro-s-projects.vercel.app` (unique per commit)
- Production domain alias: NO — preview never promotes to `the-intern-snowy.vercel.app` unless merged to `main`
- Production credential: NO — preview inherits no production-only env (none exist, so isolation is default)
- Production write-capable state: NO

### PRODUCTION
- Source: protected `main` only
- Vercel environment: `production`
- Promotion: only after required GitHub gates pass (see §7) and merge via protected flow — no manual `vercel --prod` for normal flow
- Production domain: `the-intern-snowy.vercel.app` (alias assigned on Ready)
- Deployment example: `dpl_CpTVj9KHfCQiU7kRPNuEJYroANwM` (commit `9cf2bfc feat: THE INTERN — complete universe`, now superseded by `a9ea110` post-P2-correction)

### STAGING
- **NOT USED**
- Reason: Class A stateless project has no current risk/utility requiring a fourth environment (no DB migrations, no blue/green, no persistent state to isolate). Creating staging would be theater. Re-evaluate if stateful service is introduced.

## 4. Git → Vercel Routing

| Git ref | Vercel target | How |
|---|---|---|
| `main` (push/merge) | `production` | Git integration `createDeployments: enabled`, `productionBranch: main` |
| `devops/*`, `security/*`, `dependabot/*`, any PR branch | `preview` | Automatic preview deployment per branch/PR |
| local checkout (no push) | `development` | `vercel dev` or `npm run dev` — no deployment |

`vercel git connect https://github.com/allinoneacount1-dot/the-intern.git` verified 2026-08-28.
`vercel project inspect` → `productionBranch: main`, `gitProviderOptions.createDeployments: enabled`, `gitComments.onPullRequest: true`.

## 5. Vercel Environment Inventory

Fresh `vercel env list` (and `--json`) 2026-08-28:

```
> No Environment Variables found for mrmacro-s-projects/the-intern
{ "envs": [] }
```

Per-scope:

- `vercel env list production` → 0 vars
- `vercel env list preview` → 0 vars
- `vercel env list development` → 0 vars

Classification for every expected variable (none exist, template for future):

| NAME | PURPOSE | ENVIRONMENT | APP_CREDENTIAL / OPERATOR_CREDENTIAL | SENSITIVE? | WRITE_CAPABLE? | REQUIRED? |
|---|---|---|---|---|---|---|
| *(none)* | — | — | — | — | — | — |

Policy:
- Expected for THE INTERN: **APPLICATION ENV VARS = ZERO** → keep zero. Do not invent `.env.example` with fake vars.
- If unexpected variable appears: DO NOT DELETE BLINDLY, DO NOT COPY PRODUCTION → PREVIEW. Investigate usage first (`grep` code, check build).
- Operator credentials (`GITHUB_TOKEN` via `gh` keyring, `VERCEL_TOKEN` via `~/.config`/`HermesHome/.env` 600) stay **operator-side** — never injected as Vercel application runtime env (`vercel env`). They are not in `vercel env list`.
- No secret values are printed in this doc or logs.

## 6. ENV File Safety

`.gitignore`:

```
.env*
.vercel
```

Verified:
- `git log --all --name-only | grep -E "^\.env|^\.vercel"` → no matches — no accidental committed env
- `git ls-files | grep -E "\.env|\.vercel"` → no matches
- `find . -maxdepth 2 -name ".env*"` → no files in tree
- Current worktree `ls -la` → no `.env*`, no `.vercel` (worktree `the-intern-env` has no `.vercel`, main has `.vercel/project.json` but that file is **not** `.vercel` dir secrets — it contains only `projectId/orgId` non-secret linkage, and is git-ignored via `.vercel` pattern? Actually main's `.vercel/project.json` is present on disk but *git-ignored*? `git check-ignore .vercel/project.json` → ignored, not committed. Verified via `git ls-files` no `.vercel` tracked.)

Rules enforced:
- NO `.env` committed
- NO `.env.local` committed
- NO `.vercel` (dir) committed — only runtime linkage, not secrets
- NO production credential in Git
- Because no application env vars required: **DO NOT CREATE empty `.env.example`**, do not invent config variables. If future required variable discovered, create `.env.example` with names only / safe examples, never secrets.

## 7. State Isolation & Preview Safety

- No database, so no cross-environment data leak.
- No RPC/wallet/webhook with write capability — preview cannot write to prod.
- Preview URL ≠ production canonical domain (verified via `vercel ls` deployments: preview would be `the-intern-<hash>-mrmacro-...` vs `the-intern-snowy.vercel.app`).
- Preview does not replace production (promotion only via `main` merge).
- Preview does not receive production-only credential/state (none exist, and Vercel does not auto-copy production env to preview unless explicitly set — verified `envs: []` so nothing to leak).

## 8. Production Promotion Gates

Required checks on `main` (branch protection):

- `CI / quality` — `strict: true`, must pass (lint + tsc + build + `npm audit --audit-level=high`)
- `Dependency Review` — `strict: true`, fail on high/critical, all scopes

Verified `gh api branches/main/protection --jq '{contexts, strict}'` → `["CI / quality", "Dependency Review"]`, `strict: true`, `allow_force_pushes: false`.

Vercel preview deployment:
- Vercel exposes preview deployments per PR (visible in `vercel ls` and dashboard), but **does not expose a stable provider-native GitHub check name on hobby plan** that can be made required in branch protection without custom polling. Observed: `vercel ls` shows deployments, but `gh pr checks` shows only `CI / quality` + `Dependency Review` as required contexts.
- Limitation documented honestly: `PREVIEW_PROMOTION_GATE = VERIFIED_PROVIDER_EVIDENCE` — promotion requires CI + Dependency Review PASS and preview deployment READY as observed in Vercel dashboard/`vercel ls`, not as a third required GitHub check. Do not invent fake check name. Do not build custom polling infra.

Target promotion flow: CI PASS + Dependency Review PASS + Preview READY → merge eligible → `main` → production deployment READY.

## 9. Environment Metadata (canonical, for later observability)

| Field | Value |
|---|---|
| project | `the-intern` |
| vercel projectId | `prj_fkVTmCDIsdOgL2NbvVZd5u3EmxUF` |
| vercel teamId | `team_24xZRsYErTeKL6qmbZphBS6g` |
| environment (this doc) | `production` (main), `preview` (PR branches), `development` (local) |
| commit_sha (P3 base) | `a9ea110 Merge pull request #8 from allinoneacount1-dot/security/dependabot-version-policy` |
| deployment_id (latest prod) | `dpl_CpTVj9KHfCQiU7kRPNuEJYroANwM` (superseded by post-P3 merge) |
| canonical production domain | `the-intern-snowy.vercel.app` |

No secret values. Commit SHA and deployment ID are non-sensitive.

## 10. Incident / Recovery Boundaries

- Local → fix, no prod impact
- Preview → isolated per PR, auto-expires per Vercel `deploymentExpiration` (30 days, keep 10)
- Production → rollback via `git revert` on `main` + new PR through same gates; Vercel `lastRollbackTarget` available but prefer Git revert for audit trail
- No database to recover (stateless) — recovery is just redeploy.

## 11. Verification Evidence

- `vercel whoami` → `oxwebthree-7231`
- `vercel ls` → `mrmacro-s-projects/the-intern` with `● Ready Production` deployments
- `vercel env list --json` → `{"envs":[]}`
- `vercel project inspect` → `prj_fkVTmCDIsdOgL2NbvVZd5u3EmxUF`
- `gh api projects/prj_fk...` → `link.org: allinoneacount1-dot, productionBranch: main`
- `.gitignore` → `.env*`, `.vercel`
- No custom env management script — isolation is architecture/provider config, not shell theater.

---
*Teams responsible: Do not manually `vercel --prod` for normal flow. Git integration owns promotion.*
