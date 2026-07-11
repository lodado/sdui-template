# CLAUDE.md

Guidance for Claude Code working in this repository. Written to be **self-sufficient**: a model that follows only this file should produce work matching this project's quality bar. When this file and code disagree, trust the code and update this file.

## Project Overview

**@lodado/sdui-template** monorepo — Server-Driven UI (SDUI) libraries for React. The server ships UI structure as JSON; the React client renders it. Two independent product lines live here:

1. **SDUI layout** (`sdui-template`, `sdui-template-component`) — JSON layout documents → `SduiLayoutRenderer` → React. Use cases: dashboard builders, dynamic forms, CMS pages, A/B layouts.
2. **Block documents** (`sdui-document`, `sdui-document-react`) — Notion-like block editor. Headless domain (patches, permissions, ordering, collaboration) + React editor UI.

They are separate models. **Do not use `SduiLayoutDocument` for block content or vice versa.** The only bridge is one-directional: `toSduiLayoutDocument()` converts a block document into a layout document. The reverse embedding (`document.sdui` block, `SduiLayoutBlock`) was **removed** in commit `271aa56` — do not reintroduce it or reference it in docs.

## Monorepo Map

pnpm 9 + Turborepo. Node ≥ 18.19 locally, **Node 24 in CI**.

```text
packages/
  sdui-template/            # Core: SduiLayoutStore, renderer, hooks, Zod schemas
  sdui-template-component/  # Radix-based component map (FSD layout: app/features/shared/widgets)
  sdui-document/            # Headless block-document domain (NO React imports allowed)
  sdui-document-react/      # Block editor UI (React chrome + ProseMirror on focused text block)
  sdui-mcp/                 # MCP server serving compressed SDUI authoring knowledge
  sdui-design-files/        # Design system files
  ssr-testing/              # Playwright E2E lives here (playwright.config.ts)
configs/                    # Shared jest/eslint configs
apps/
  docs/                     # Storybook (port 6006) — also the de-facto example/fixture source
  nextAuthOauthLoginExample/ # Next.js OAuth example (needs GITHUB_CLIENT_*, NEXTAUTH_*, SUPABASE_* env)
  reactGridLayoutExample/   # react-grid-layout integration example
```

Dependency direction (never reverse it):

```text
sdui-document-react → sdui-document
sdui-template-component → sdui-template
sdui-document → sdui-template  (types + toSduiLayoutDocument only)
```

## Commands (verified 2026-07)

```bash
pnpm install
pnpm dev              # turbo dev, parallel
pnpm storybook        # port 6006
pnpm build            # turbo build
pnpm lint             # eslint --cache --fix
pnpm typecheck
pnpm test             # Jest, all packages — MANDATORY after any code change
pnpm test:e2e         # Playwright (packages/ssr-testing)

# Single package
pnpm --filter @lodado/sdui-template test
pnpm --filter @lodado/sdui-mcp build   # REGENERATES knowledge/ — run after component/story changes

# Versioning
pnpm changeset        # required for any publishable package change
```

## Architecture

### SDUI layout core (`packages/sdui-template`)

Facade pattern:

```text
SduiLayoutStore (Facade)
├── SubscriptionManager   # Observer pattern, ID-based node subscriptions
├── LayoutStateRepository # Normalized entities (normalizr)
├── DocumentManager       # Document caching/serialization
└── VariablesManager      # Global variables
```

- Entry: [SduiLayoutStore.ts](packages/sdui-template/src/store/SduiLayoutStore.ts)
- Hooks: [react-wrapper/hooks/](packages/sdui-template/src/react-wrapper/hooks/) — `useSduiNodeSubscription`, `useSduiLayoutAction`, `useRenderNode`, `useSduiNodeReference`
- Data flow: JSON → normalize (nodes map + rootId) → `SduiLayoutRenderer` traverses → `store.updateNodeState(id, state)` notifies **only that node's subscribers**. This subscription model is the core value proposition — never introduce a change that re-renders the whole tree.

### Layout document schema

```typescript
interface SduiLayoutDocument {
  version: string              // required
  metadata?: { id?, name?, ... }
  root: SduiLayoutNode         // required
  variables?: Record<string, unknown>
}
interface SduiLayoutNode {
  id: string                   // required, unique in document
  type: string                 // must match a components-registry key
  state?: Record<string, unknown>      // dynamic, subscribable data
  attributes?: Record<string, unknown> // static props (className, as, …)
  children?: SduiLayoutNode[]
  reference?: string | string[]        // subscribe to other nodes
}
```

### Block documents (`packages/sdui-document`)

- Root block `type: 'document.root'`; `schemaVersion: '1.0' | '1.1'`; unique `id` per block.
- Patches only: `applyDocumentPatch(content, patch)` — content is immutable, never mutate in place.
- Patch types: `block.insert|update|delete|move|split|merge|setType`, `document.setTitle` — schema at [patch.ts](packages/sdui-document/src/blocks/schema/patch.ts).
- Insert placement uses **anchors** (`after`, `before`, `fallbackAfter`), never array indices. Anchor resolution is strict: stale anchors throw `StaleAnchorError` (supports offline replay / collaboration outbox retries). If you touch anchor logic, keep it strict — silent fallback reintroduces the replay bugs this was built to prevent.
- Block registry: [block-types/index.ts](packages/sdui-document/src/block-types/index.ts).
- Client-side permissions are UX-only; re-check on server.

### Block editor (`packages/sdui-document-react`)

- React owns block chrome; **ProseMirror mounts only on the focused text block** (performance — one PM instance, not N).
- Domain logic stays in `@lodado/sdui-document`; the React package renders and dispatches patches.
- CSS uses cascade layers (`@layer sdui-doc.*`); import `@lodado/sdui-document-react/styles/index.css` **after** Tailwind, or Preflight wins the cascade.
- `onContentChange(next, patches)` — persist **patches**, not just full content (collaboration/undo depend on it).
- Themes: `'swiss'` (default) and `'notion'`.

## Conventions (each with the reason — do not drop the reason when editing)

| Rule                                                                                                                       | Why                                                                                    |
| -------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------- | -------- | ---- | ---- | ----- | ---- | -------------- | ----------------------------------------------------- |
| Immutable updates everywhere (new objects, never mutate)                                                                   | Subscription diffing and patch replay both assume it                                   |
| `state` vs `attributes` strictly separated in nodes                                                                        | `state` is subscribable/dynamic; `attributes` static — mixing breaks re-render scoping |
| Every custom SDUI component ships a Zod schema                                                                             | Server JSON is untrusted input; schema is the boundary validation                      |
| Compound components (Dialog, Dropdown, Tabs…) require `providerId`                                                         | Children resolve shared context by id, not React nesting                               |
| No React imports in `sdui-document`                                                                                        | It runs server-side and in workers; React coupling was removed deliberately            |
| Unique node/block `id`s                                                                                                    | Normalization keys and subscriptions collide otherwise                                 |
| Conventional commits (`feat                                                                                                | fix                                                                                    | refactor | docs | test | chore | perf | ci(scope): …`) | commitlint enforces it; changelog generation reads it |
| Branch names: `feat/*`, `refactor/*`, `fix/*`, `agent/*` (AI-driven work)                                                  | CI triggers on `main`/`dev`; PRs target `main`                                         |
| Changeset required for publishable package changes                                                                         | `changeset publish` drives npm releases; no changeset = no release                     |
| XSS: JSX `{}` bindings only; no `dangerouslySetInnerHTML` without DOMPurify; whitelist URL schemes `http/https/mailto/tel` | Server-driven JSON is an injection vector by design                                    |
| Keyboard nav + WCAG AA contrast + visible focus on all components                                                          | Library ships to consumers who inherit our a11y bugs                                   |

## CI / Release Reality

- `intergrate_workflow.yml` (note the typo — keep filename) runs **test + Playwright e2e** on push/PR to `main`/`dev`.
- npm publish runs **only** on push to `main` AND repo variable `ENABLE_NPM_RELEASE == 'true'`, after test+e2e pass. Publishing needs an NPM_TOKEN that can _create_ new `@lodado/*` packages.
- Release = `pnpm release` (build → `changeset version` → `changeset publish`). Don't run it locally unless explicitly asked; CI owns publishing.
- Storybook deploys via `deploy-storybook.yml` (manual `workflow_dispatch` available).

## Workflows — use these instead of improvising

| Task                                      | Use                                                                                   | Where                                        |
| ----------------------------------------- | ------------------------------------------------------------------------------------- | -------------------------------------------- |
| New/updated component from Figma          | `/figma-sync` (analysis → plan → impl → verify → report)                              | `.claude/commands/figma-sync.md`             |
| Figma change as isolated PR               | `/figma-pr`                                                                           | `.claude/commands/figma-pr.md`               |
| Add a brand-new SDUI component end-to-end | `sdui-component-new` skill                                                            | `.claude/skills/sdui-component-new/SKILL.md` |
| Version/publish a package change          | `release-ship` skill                                                                  | `.claude/skills/release-ship/SKILL.md`       |
| Code review before merge                  | `/review` (4 parallel agents, evidence-mandatory)                                     | `.claude/commands/review.md`                 |
| Writing tests                             | `/test` (behavior-focused, a11y-aware)                                                | `.claude/commands/test.md`                   |
| Authoring SDUI layout JSON                | MCP: `sdui_get_guide syntax` → `components-overview` → per-component guide + examples | `@lodado/sdui-mcp`                           |
| Where does a new file go?                 | `FSD` skill (sdui-template-component only)                                            | `.claude/skills/FSD/SKILL.md`                |

**MCP snapshot:** `.ai/sdui/` is the cached knowledge; re-sync via `/sdui-sync` when `manifest.json` is older than 7 days. MCP covers **layout JSON only**, never block-document APIs.

**After changing `sdui-template-component` or its stories:** run `pnpm --filter @lodado/sdui-mcp build` so MCP knowledge stays in sync with reality.

## Mandatory: After Code Changes

```bash
pnpm run test   # from repo root
```

1. Run at the END, after all edits are complete.
2. Tests FAIL → fix and re-run until green. Fix the implementation, not the test, unless the test is provably wrong.
3. Task is not complete with failing tests. Report result: ✅ passed (N tests) / ❌ failed → fixed → passed.

## Operating Standard (quality bar — follow even when it feels slow)

1. **Read before writing.** Before editing any file, read it and at least one sibling that does the same job (an existing component, story, or block type). Match its structure exactly; this repo's consistency is deliberate.
2. **Reuse ladder.** Existing helper in repo → stdlib → already-installed dependency → new code. Never add a dependency for something a few lines can do. Never re-implement what exists a few files over.
3. **Evidence over assertion.** Every claim of "works/fixed/passing" requires having run the command and seen the output. Quote the actual test summary line. No claim without evidence.
4. **Root cause, not symptom.** Before fixing a bug, grep all callers of the function you're changing. Fix at the shared point, not the reported path.
5. **Smallest correct diff.** No drive-by refactors, no speculative abstractions, no config for values that never change. But smallest diff in the _right place_ — a small patch in the wrong layer is a second bug.
6. **Layer discipline.** Domain logic → `sdui-document` / store logic → `sdui-template`. React packages render and dispatch. If your change adds React to a headless package or business rules to a component, stop and move it.
7. **Ambiguity protocol.** If the task is ambiguous, state your interpretation in one line and proceed with the most conservative reading. Destructive or public-facing actions (delete, publish, force-push): stop and ask.
8. **Verification loop.** `pnpm typecheck` after type-level changes; `pnpm lint` after new files; `pnpm test` always; stories in `apps/docs` updated whenever a component's public API changes.
9. **Docs follow code.** If you change a public API, update: the package README, `AGENTS.md` (if schema/rules changed), stories, and MCP knowledge (`pnpm --filter @lodado/sdui-mcp build`). Stale docs in this repo have caused real bugs — commit `271aa56` removed APIs that docs still advertised.
10. **Report format.** End every task with: what changed (files), what was verified (commands + results), what was NOT done (explicitly), open risks.

## Token Notes

- `.claudeignore` excludes node_modules/dist/lock files.
- Prefer reading specific symbols/line ranges over whole files.
- `apps/docs/src/stories/` files are large (30–66KB) — read targeted sections only.
