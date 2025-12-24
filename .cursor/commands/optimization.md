---
description: optimization
---

# Workflow: Optimization (Measure → Improve → Verify)

## Purpose

Improve an implemented feature/system without breaking correctness.
This workflow focuses on:

- performance (latency, throughput, bundle, render cost)
- reliability (errors, race conditions, flakiness)
- maintainability (complexity, coupling, test stability)
- operational readiness (observability, regressions)

Optimization MUST be evidence-driven: measure first, change second.

---

## Input (Required)

- Implemented feature + baseline behavior
- Requirements/NFR targets (or explicit "unknown")
- Current telemetry and/or profiling data (or explicit "missing")
- Test suite status (scenario tests must exist)

If any target/telemetry is missing, explicitly state "unknown/missing" and define a temporary proxy metric.

---

## Step 0) Define Optimization Targets (Non-negotiable)

### 0.1 Select targets

Pick 1–3 primary targets (avoid optimizing everything at once):

- p95/p99 latency
- UI responsiveness (input delay)
- render time / commit time
- bundle size / code-splitting impact
- memory usage / leaks
- error rate / crash-free sessions
- CI time / flaky rate
- developer efficiency (build time, test time)

### 0.2 Set budgets and thresholds

Define:

- baseline (current)
- target (goal)
- guardrail (must not regress)
- measurement method

Output:

- Target table (baseline → target → guardrail → method)

---

## Step 1) Instrumentation & Measurement Plan

### 1.1 Choose measurement tools

- Frontend:
  - browser devtools performance profiler
  - React Profiler (commit durations, re-render hot paths)
  - bundle analyzer (where applicable)
  - web vitals (LCP/INP/CLS) if relevant
- Backend/Service:
  - APM traces
  - logs/metrics dashboards
  - load testing harness (if applicable)
- Tests:
  - CI timings + flaky test reports

### 1.2 Add minimal instrumentation if missing

Rules:

- instrument only what is needed for the chosen targets
- avoid noisy logs; prefer structured events
- include correlation IDs where applicable

Output:

- Measurement plan
- Instrumentation changes (if any)

---

## Step 2) Hotspot Identification (Diagnosis)

Find where time/memory/errors actually come from.

### 2.1 Performance hotspots

- top render contributors (components, selectors, props churn)
- expensive computations (sort/filter, normalization, layout)
- async bottlenecks (waterfalls, overfetching)
- bundle hotspots (large deps, duplicated modules)
- main-thread blocking (long tasks)

### 2.2 Reliability hotspots

- race conditions (late response overriding new intent)
- retry storms / thundering herd
- flaky tests (timing dependence)
- unhandled errors and silent failures

Output:

- Hotspot list ranked by impact (Top 5)
- Evidence links/notes (profiling snapshots, metrics)

---

## Step 3) Hypothesis-Driven Optimization Plan

For each hotspot:

- hypothesis: "If we change X, then metric Y improves because Z"
- expected improvement range (rough)
- risk (correctness, complexity, regressions)
- verification method (tests + measurement)

Rules:

- prefer low-risk, high-impact changes first
- reject changes without measurable verification

Output:

- Optimization backlog table (impact, effort, risk, plan)

---

## Step 4) Apply Optimizations (Small, Reversible Changes)

Implement in small batches:

- one hypothesis per PR when possible
- feature-flag if risk is high
- preserve public contracts

Common optimization patterns (choose only as applicable):

- UI rendering:
  - reduce rerenders (stable props, memoization where justified)
  - move heavy work off render path (useMemo, precompute, worker)
  - virtualization for large lists
  - debounce/throttle only when supported by UX
- Data fetching:
  - cache policy tuning (staleTime, GC, dedupe)
  - request cancellation / latest-intent-wins
  - batching/parallelizing vs avoiding waterfalls
- Bundle:
  - code splitting / dynamic import
  - remove/replace heavy dependencies
- State:
  - normalize data shape to reduce diff churn
  - avoid derived state stored redundantly
- Tests:
  - remove flakiness (fake timers, deferred promises)
  - reduce redundant tests; keep scenario coverage

Output:

- PR list with applied changes and rationale

---

## Step 5) Verification (Must Prove Improvement)

### 5.1 Correctness gates

- all scenario tests pass
- no new flaky behavior
- accessibility flows still work (if UI)
- error/empty/loading behavior unchanged unless explicitly redesigned

### 5.2 Performance/metric gates

- rerun measurement plan
- compare baseline vs after
- ensure guardrails are not violated

Output:

- Before/After metrics table
- Evidence summary (profiling notes)

---

## Step 6) Regression Protection (Lock It In)

Add protections so the improvement doesn't regress:

- performance budgets (bundle size, render threshold) if feasible
- CI checks (lint/test/build + optional perf check)
- targeted tests for fixed race/bug patterns
- documentation for chosen trade-offs

Output:

- Regression guard list
- Updated docs/ADR

---

## Step 7) Operational Readiness (If Production)

- validate dashboards/alerts (error rate, latency, key user flows)
- rollout gradually
- define rollback triggers based on metrics

Output:

- Rollout validation checklist
- Rollback criteria

---

## Final Output Format (REQUIRED)

### 1) Optimization Targets (baseline/target/guardrails)

### 2) Measurement Plan (tools + instrumentation)

### 3) Hotspots (evidence-ranked)

### 4) Hypotheses & Plan (table)

### 5) Changes Applied (PR-sized)

### 6) Verification Results (before/after)

### 7) Regression Protections (budgets/checks/tests)

### 8) Ops Readiness (rollout + rollback)
