---
description: architecture-design
---

# Workflow: Architecture Design (System Design Style)

## Input (Required)

- Output from "Requirements Analysis" workflow:
  - Problem statement + success criteria
  - FR/NFR tables
  - User flows (happy + failure + edge)
  - Data/State model
  - Interfaces sketch (if any)
  - Risks & assumptions

If any section is missing, explicitly mark it as "unknown" and proceed with assumptions.

---

## Step 1) Architecture Goals & Constraints

1. Restate the top 3 goals that drive architecture (e.g., reliability, latency, maintainability).
2. List hard constraints:
   - runtime (browser/edge/node)
   - tech stack constraints
   - deployment constraints
   - security/privacy constraints
3. Identify “architecture drivers” from NFR:
   - performance SLO (e.g., p95 latency)
   - availability targets
   - data integrity rules
   - accessibility obligations

Output:

- Goals (Top 3)
- Constraints (must not violate)
- Architecture drivers (from NFR)

---

## Step 2) System Boundaries & Context Diagram

Define the system boundary and external dependencies.

- Actors → system boundary → external systems/APIs

Output:

- Context diagram (text form)
  - In-scope components
  - External services
  - Data stores
  - Event sources (if any)

---

## Step 3) Decomposition into Modules (Bounded Context / Ownership)

Decompose into modules aligned with:

- reasons to change (Parnas: information hiding)
- team ownership boundaries
- deployment boundaries (if relevant)

Rules:

- Each module must have a single primary responsibility.
- Do not split by “technical layer only” (UI/service/db) unless it matches change reasons.

Output:

- Module list with:
  - responsibility
  - public interface (what it exposes)
  - private decisions (what it hides)
  - owners (optional)

---

## Step 4) Choose Architectural Style (Justified)

Select style(s) and justify trade-offs:

- Layered (UI → domain → infra)
- Hexagonal / Ports & Adapters
- Micro-frontend / modular monolith
- Event-driven (if needed)
- Offline-first (if needed)

Decision rule:

- Pick the simplest style that satisfies NFR.
- Explicitly state what you are NOT choosing and why.

Output:

- Style decision + rationale
- Trade-offs table (pros/cons, risks)

---

## Step 5) Core Data & State Architecture

Define data ownership, caching, and state boundaries.

### 5.1 Data ownership

- Which module is the source of truth for each entity?
- How does data flow between modules?

### 5.2 Client state vs Server state (for UI systems)

Classify:

- Server state (remote truth, cacheable, invalidation rules)
- Client/UI state (ephemeral view state, focus, open/close, selected index)
- Derived state (computed from others)

### 5.3 Concurrency rules (Required if async/network)

- Latest intent wins
- Cancellation/sequence guards
- Idempotency/retry policy (if commands)

Output:

- Data ownership matrix
- State taxonomy (server/client/derived)
- Concurrency policy

---

## Step 6) Key Flows as Sequence Diagrams

Pick 2–3 highest-risk flows from requirements:

- 1 happy path
- 1 failure path
- 1 async/race path (if applicable)

Represent as stepwise sequence:
Actor → UI → service → cache/store → API → response handling → UI updates

Output:

- 2–3 sequence diagrams (text)

---

## Step 7) Interface Contracts (API / Ports)

Define interfaces between modules (internal) and to external systems.

For each interface:

- input/output schemas
- error model
- timeouts/retries
- pagination/caching rules
- security/auth boundaries
- observability hooks (logs/metrics)

Output:

- Contract definitions (TypeScript types or pseudocode)
- Error taxonomy

---

## Step 8) Cross-Cutting Concerns (Non-negotiable)

Define how the architecture addresses:

- Logging / metrics / tracing (or minimal equivalents)
- Error handling strategy (user-facing + internal)
- Security & privacy (PII handling, tokens, secrets)
- Performance plan (budgets, caching, batching)
- Accessibility plan (if UI)
- Configuration & feature flags (if needed)

Output:

- Cross-cutting checklist with decisions

---

## Step 9) Test Architecture (Guardrails)

Define test strategy aligned with architecture:

- Scenario-first tests for key flows (as is → when → to be/should)
- EP/BVA to sample inputs
- Deterministic async/race tests
- Contract tests at module boundaries (if relevant)
- Minimal unit tests for pure helpers only

Output:

- Test pyramid for this system
- “Must-have” test portfolio list (6–10 scenario tests + optional units)

---

## Step 10) ADR (Architecture Decision Records)

Record key decisions:

- chosen style & why
- boundary/module decomposition
- caching strategy
- concurrency strategy
- security assumptions

Output:

- ADR entries (short, numbered)

---

## Final Output Format (REQUIRED)

### 1) Goals & Constraints

### 2) System Context & Boundary

### 3) Module Decomposition

### 4) Architectural Style + Trade-offs

### 5) Data & State Architecture

### 6) Key Flows (Sequence)

### 7) Interface Contracts

### 8) Cross-Cutting Concerns

### 9) Test Architecture

### 10) ADR Summary + Next Steps

---

## Quality Gates (REQUIRED)

Before considering this "done", verify:

1. Every NFR has an explicit architectural decision that supports it.
2. Every module has:
   - clear responsibility
   - clear public interface
   - hidden/private decisions
3. Key flows include at least one failure mode and (if async) one race mode.
4. Concurrency policy is explicit (no “it should work”).
5. Test plan protects the architecture’s contracts (not internal details).
