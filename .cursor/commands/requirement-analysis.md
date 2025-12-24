---
description: Requirements Analysis
---

# Workflow: Requirements Analysis (System Design Style)

## Input

Provide the following if available:

- Product/feature description (1–5 sentences)
- Primary users/actors
- Constraints (time, tech stack, policy, security, cost)
- Any existing APIs, docs, or screenshots (optional)

If something is unknown, explicitly state "unknown" and proceed with assumptions.

---

## Step 1) Problem Statement

- Restate the problem in 1–2 precise sentences.
- Define the user value and the business value.
- Identify success criteria (measurable if possible).

Output:

- Problem statement
- Success metrics (or placeholders)

---

## Step 2) Actors & Use Cases

- List actors (end user, admin, system, 3rd party, scheduler, etc.)
- For each actor, list top use cases (3–7).

Output:

- Actor list
- Use case list

---

## Step 3) Requirements

### 3.1 Functional Requirements (FR)

- Enumerate MUST/SHOULD/COULD (MoSCoW)
- Write each FR as testable statements.

### 3.2 Non-Functional Requirements (NFR)

Cover:

- Performance (latency, throughput)
- Reliability (availability, error handling)
- Security/Privacy
- Accessibility (if UI)
- Observability (logs/metrics/tracing)
- Compatibility (browsers/devices)
- Cost (if relevant)

Output:

- FR table
- NFR table

---

## Step 4) Out of Scope

- Explicitly list what is NOT included.
- Add "won't do (this iteration)" items.

Output:

- Out-of-scope list

---

## Step 5) User Flows

- Write at least:
  - Happy path
  - 2–3 failure modes
  - Edge/boundary conditions
- Express flows as steps, not prose.

Output:

- Flow diagrams in text (step lists)

---

## Step 6) Data/State Model

- Identify core entities and fields.
- Define state transitions for the main entity.
- If async/networked, define "latest user intent wins" rules.

Output:

- Entity list + fields
- State machine (text)

---

## Step 7) Interfaces (API/Contracts)

- Define:
  - Inputs/outputs
  - Errors
  - Idempotency / retries (if applicable)
  - Pagination/caching rules (if applicable)

Output:

- API sketch (endpoints or function signatures)

---

## Step 8) Risks & Open Questions

- List top risks (tech, UX, data, security).
- List open questions and assumptions.

Output:

- Risk list
- Open questions
- Assumptions

---

## Step 9) MVP & Delivery Plan

- Propose MVP scope (what we can ship first).
- Propose phased rollout and validation plan.
- Define test strategy:
  - Scenario-first tests (as-is → when → to-be/should)
  - EP/BVA input sampling
  - Deterministic async/race tests

Output:

- MVP definition
- Phase plan
- Test plan

---

## Final Output Format (REQUIRED)

### 1) Problem

### 2) Actors & Use cases

### 3) FR (table)

### 4) NFR (table)

### 5) Out of scope

### 6) User flows

### 7) Data/State model

### 8) Interfaces

### 9) Risks / Open questions / Assumptions

### 10) MVP + next steps
