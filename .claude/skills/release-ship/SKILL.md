---
name: release-ship
description: Version and publish @lodado/* packages safely — changeset semantics, gated CI release path, and pre-release verification. Use when the user says "release", "publish", "bump version", "changeset", or asks why a package didn't publish.
---

# Release / Ship a Package Change

## Trigger

- User asks to release/publish/bump, or a PR touches a publishable package without a changeset.
- Debugging "why didn't npm publish run?"

## Input

- Which packages changed (`git diff main...HEAD --stat -- packages/`)
- Change kind per package: patch (fix/style), minor (new API/variant), major (breaking)

## How releasing actually works here (do not improvise)

1. Publish happens **only in CI**: push to `main` + repo variable `ENABLE_NPM_RELEASE == 'true'` + test & Playwright e2e green (`.github/workflows/intergrate_workflow.yml`).
2. CI runs `pnpm release` = `turbo build` → `changeset version` → `changeset publish` (Node 24, scope `@lodado`).
3. **No changeset in the merge = no version bump = no publish.** This is the #1 cause of "release didn't happen".
4. NPM_TOKEN must be allowed to _create_ new `@lodado/*` packages, not just update.
5. Never run `pnpm release` locally unless the user explicitly asks — CI owns publishing.

## Steps

1. Identify changed publishable packages; map each to patch/minor/major. Internal-only packages (`apps/*`, private) need no changeset.
2. `pnpm changeset` — select packages, pick bump, write a changelog entry a consumer can act on (what changed + migration note if minor/major).
3. Verify locally before pushing: `pnpm build && pnpm test && pnpm typecheck`. Quote results.
4. Commit changeset with the feature (conventional commit), PR → `main`.
5. After merge: confirm the release job ran (main push + `ENABLE_NPM_RELEASE`). If skipped, check the gate variable before suspecting auth.
6. Failure triage order: gate variable → test/e2e job status → NPM_TOKEN scope/permissions → changeset presence.

## Output

- Changeset file(s) created (paths + bump levels)
- Local verification results (quoted command output)
- Release path status: what will/won't publish and why
- Anything requiring the user (e.g. flipping `ENABLE_NPM_RELEASE`, rotating NPM_TOKEN) — never change repo variables or secrets yourself

## Hard rules

- Never publish, tag, or force-push without explicit user instruction.
- Breaking change without a `major` changeset = block and tell the user.
- Don't edit `.github/workflows/*` as a side effect of a release task.
