---
description: design-flow
---

# Workflow: Implementation Design (Ready-to-Code)

## Input (Required)

- Output from "Architecture Design":
  - module decomposition
  - key flows (sequence)
  - interface contracts
  - data/state architecture
  - cross-cutting decisions (error, perf, a11y, observability)
  - test architecture

If any section is missing, mark "unknown" and proceed with assumptions.

---

## Step 1) Define Deliverables & Done Criteria

### 1.1 Deliverables

- UI components (list)
- hooks/services (list)
- types/schemas (list)
- tests (scenario + optional unit)
- docs (JSDoc + ADR update)
- optional: storybook / fixtures

### 1.2 Done Criteria (non-negotiable)

- All P0 user flows are implemented and have scenario tests
- Async flows are deterministic (no flaky timing)
- Accessibility basics covered (role/aria/keyboard/focus)
- Error & empty states defined
- Logging/metrics hooks exist where required
- File structure follows team conventions

Output:

- Deliverables checklist
- Done criteria checklist

---

## Step 2) UI/UX Interaction Design (Implementation-Level)

Define UI behaviors as explicit rules, not prose.

For each screen/component:

- Visual states (closed/open/loading/empty/error/success)
- Interaction rules:
  - mouse
  - keyboard (up/down/enter/esc/tab)
  - focus/blur behavior (close-on-blur? keep open?)
- Accessibility:
  - role strategy
  - aria mapping
  - focus management policy

Output:

- UI state table
- Interaction rules table
- A11y mapping table

---

## Step 3) Detailed State Design (Single Source of Truth)

### 3.1 Classify state

- Server state (cached, invalidation rules)
- Client/UI state (focus, open, selectedIndex, inputValue)
- Derived state (filteredItems, isInteractive)

### 3.2 State machine (text)

Define:

- states
- events
- transitions
- guards (minChars, disabled, pending, etc.)

### 3.3 Concurrency design (Required for async)

- latest intent wins rule
- cancellation strategy (AbortController or sequence guard)
- stale response handling rules

Output:

- State taxonomy table
- State machine definition
- Concurrency policy (explicit)

---

## Step 4) Contracts & Types (Make It Unambiguous)

### 4.1 Public interfaces

- component props
- callbacks
- error shapes
- optional extension points

### 4.2 Domain types

- Entity types + normalized IDs
- request/response DTO types
- enums for statuses

### 4.3 Invariants (Design by Contract)

Write invariants as bullet points:

- must always hold true
- failure behavior (throw? recover? ignore?)

Output:

- TypeScript type sketches
- JSDoc policy bullets
- Invariants list

---

## Step 5) Concrete File/Folder Structure

Define actual paths and ownership.

Recommended outputs:

- feature folder structure
- component split plan (container/presentational if used)
- hooks and services location
- shared utilities

Output:

- File tree (final target)
- Export boundaries (what is public/private)

---

## Step 6) Implementation Plan (Small PRs)

Break into 5–10 PR-sized increments:

- PR1: types + contracts + fixtures
- PR2: base UI skeleton + a11y roles
- PR3: core interactions (mouse + keyboard)
- PR4: async + race handling
- PR5: scenario tests (P0) + deterministic timers
- PR6+: performance/observability/polish

Each PR must be:

- reviewable (< ~400 LOC net new where possible)
- shippable or at least mergeable behind a flag

Output:

- PR plan table (scope, files, risks, test coverage)

---

## Step 7) Test Design (Before Coding)

### 7.1 Scenario tests (P0 required)

Use mandatory structure:

- as is → when → to be/should

For each key flow define:

- chosen EP/BVA inputs (justify)
- expected UI + callbacks + aria outputs

### 7.2 Deterministic async/race tests (required if networked)

- deferred promise resolution ordering
- fake timers for debounce
- never rely on real timing

### 7.3 Optional unit tests (P1)

- pure helpers only (normalize, clamp, minChars)

Output:

- Scenario test list (6–10) with titles
- EP/BVA input table
- Race test design

---

## Step 8) Quality Gates (Must Pass)

- No implementation-detail assertions in tests
- Keyboard-only flow works
- Focus behavior matches spec
- Error and empty UX defined and tested
- Performance budget notes (if needed)
- ADR updated for any architectural deviation

Output:

- Quality gate checklist

---

## Final Output Format (REQUIRED)

### 1) Deliverables + Done Criteria

### 2) UI State & Interaction Rules

### 3) State Machine + Concurrency Rules

### 4) Contracts & Types (TS)

### 5) File/Folder Structure

### 6) PR Plan

### 7) Test Plan (Scenario + EP/BVA + Race)

### 8) Quality Gates
