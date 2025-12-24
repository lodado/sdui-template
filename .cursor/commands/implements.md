---
description: implements
---

# Workflow: Implement (Build & Ship)

## Purpose

Turn the "Implementation Design" output into working, reviewable code that is safe to merge and ready to ship.
This workflow prioritizes:

- small, reversible changes
- contract-first development
- scenario-first tests as guardrails
- deterministic async/timer behavior
- release readiness (docs + observability)

---

## Input (Required)

- Output from "Implementation Design":
  - Deliverables + Done Criteria
  - UI/Interaction rules + A11y mapping
  - State machine + concurrency rules
  - Contracts & types (TS)
  - File/folder structure
  - PR plan + test plan
- Repo constraints:
  - lint/test/build commands
  - CI requirements
  - release constraints (flags, environments)

If anything is missing, explicitly mark it as "unknown" and proceed with assumptions.

---

## Step 0) Pre-flight Checklist (Before Writing Code)

Confirm:

- target branch and integration strategy (trunk-based / feature branch)
- feature flag plan (if applicable)
- local dev environment is reproducible
- baseline tests pass on main

Output:

- Pre-flight checklist status (pass/fail)
- Any assumptions

---

## Step 1) Create a Small-Batch PR Plan (Required)

Break work into 5–10 PRs. Each PR must be:

- reviewable (prefer < ~400 net LOC)
- reversible (no hard-to-rollback migrations without flags)
- measurable (has explicit acceptance checks)

Recommended PR sequence:

1. **Contracts & types**: TS types, error taxonomy, constants, fixtures
2. **Scaffold**: file tree, exports, empty components/hook shells
3. **Core UI skeleton + a11y roles**: rendering and keyboard focus basics
4. **Core interactions**: mouse + keyboard flows
5. **Async + concurrency**: debounce, cancellation/sequence guard, race handling
6. **Scenario tests (P0)**: 6–10 scenario tests + deterministic timers
7. **Polish**: observability, perf tuning, docs, storybook (optional)

Output:

- PR plan table:
  - PR#, scope, files, risks, tests added, acceptance checks

---

## Step 2) Implement Contract-First (Non-negotiable)

Before implementing logic:

- write/lock **TypeScript types** for public interfaces
- add **JSDoc** including:
  - responsibilities
  - parameter constraints
  - return/error behavior
  - side effects
  - behavior-critical policies (debounce, minChars, close-on-blur, latest-intent-wins)

Output:

- Contracts list (types + JSDoc)
- Policy bullets (explicit)

---

## Step 3) Build the Minimal Vertical Slice

Implement the smallest end-to-end slice that proves:

- core rendering works
- core state transitions are reachable
- basic user interaction works

Rules:

- prefer simplest implementation that meets NFR
- keep private details private (no leaking internal state)

Output:

- Working vertical slice (feature flag ok)
- Demo steps (how to verify manually)

---

## Step 4) Add Scenario-First Tests as Guardrails (P0 Required)

Write scenario tests using mandatory structure:

- `describe('<Unit>')`
  - `describe('as is: ...')`
    - `describe('when ...')`
      - `it('to be: ..., should ...')`

Rules:

- test **observable behavior only**
- apply EP/BVA at the **when** level (justify chosen inputs)
- avoid implementation-detail assertions

Minimum portfolio (default):

- success flow (mouse)
- success flow (keyboard)
- boundary below threshold (e.g., minChars-1)
- boundary at threshold (minChars)
- one negative scenario (empty/error)
- one async/race scenario (if networked)

Output:

- Scenario test list (6–10) with titles
- EP/BVA justification notes

---

## Step 5) Deterministic Async/Timer Control (Required if async)

Rules:

- do not rely on real time
- use one of:
  - set debounceMs=0 in tests, OR
  - `vi.useFakeTimers()` and explicit flush
- for race conditions:
  - use deferred promises to control resolution order
  - verify "latest user intent wins"
- late responses must not override new results

Output:

- Deterministic async test utilities (if needed)
- Race test proof (one test minimum)

---

## Step 6) Implement Error/Empty/Loading UX + Recovery

Define and implement:

- empty state behavior
- error state behavior (user-facing message + recovery action)
- loading state rules
- retry policy (if applicable)

Output:

- UI state matrix completed
- Corresponding scenario tests added/updated

---

## Step 7) Performance & Observability Hooks (As Required by NFR)

Add only what the architecture requires:

- performance budgets or lightweight profiling notes
- logging/metrics hooks for critical flows
- user-visible errors traced to internal diagnostics

Output:

- Observability notes (what is logged/where)
- Performance notes (what was considered)

---

## Step 8) Documentation & ADR Update

Update:

- JSDoc for public units
- README or feature docs (if used)
- ADR entries for any deviations or new decisions

Output:

- Doc/ADR changes summary

---

## Step 9) Merge Readiness Checklist (Quality Gates)

Before merging, confirm:

- all P0 scenario tests pass in CI
- no flaky tests (remove timing dependence)
- lint/build pass
- keyboard-only flow works (if UI)
- a11y roles/aria match spec
- concurrency policy is satisfied (latest-intent-wins)
- out-of-scope has not leaked into implementation
- rollback/flag plan exists (if relevant)

Output:

- Merge readiness checklist (pass/fail)
- Known limitations (explicit)

---

## Step 10) Release & Rollout Plan (If Shipping)

Define:

- release steps (flag on/off, environments)
- monitoring signals (errors, latency, user impact)
- rollback criteria
- post-release validation checklist

Output:

- Rollout plan
- Post-release checklist

---

## Final Output Format (REQUIRED)

### 1) PR Plan (table)

### 2) Contracts (types + JSDoc policy bullets)

### 3) Implementation Notes (vertical slice + key decisions)

### 4) Scenario Tests (6–10) + EP/BVA justification

### 5) Deterministic Async/Race Strategy

### 6) Error/Empty/Loading UX

### 7) Observability/Performance Notes

### 8) Docs/ADR Updates

### 9) Merge Readiness Checklist

### 10) Rollout Plan (if applicable)
