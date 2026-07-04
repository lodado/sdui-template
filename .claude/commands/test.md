Generate behavior-focused, accessibility-aware tests for $ARGUMENTS following the Antigravity engineering and testing guidelines.

## Playwright page specs (`src/page/*/__tests__/*.spec.ts`)

Hermes QA 주석·`@qa-live-policy`·fixture·`pnpm qa:*` 등은 **이 command에 적지 않는다.** 아래 문서를 열어 **직접 참조**해 따른다.

- https://github.com/lodado/playwright-spec-for-AI-Agent
- [scripts/qa-agent/readme.md](../../scripts/qa-agent/readme.md)
- [.cursor/rules/qa-live-skip-criteria.mdc](../../.cursor/rules/qa-live-skip-criteria.mdc) — **live skip vs staging judge** (`@qa-live-policy: skip` 분류: GET body / mutation / MSW fixture / 클라-only UI)
- https://github.com/NousResearch/hermes-agent

`@qa-live-policy`를 붙이거나 live judge 범위를 조정할 때 **qa-live-skip-criteria** 규칙을 반드시 읽고 적용한다. 변경 후 `pnpm qa:spec -- --page=<slug>` · `pnpm qa:abstract-ai -- --page=<slug>` 실행.

---

## Step 1: Identify Target

If `$ARGUMENTS` is provided, target that file/component.
If not, run `git diff --name-only HEAD~1 HEAD` and identify recently modified components or features to test.

Read the target file(s) to understand:

- What the component/function does
- Public API (props, parameters, return values)
- Side effects (network calls, storage, timers, focus management)
- Any existing tests nearby

---

## Step 2: Add JSDoc (if missing or incomplete)

For every exported function, method, or component that lacks JSDoc, add:

```ts
/**
 * [One-line purpose / responsibility]
 *
 * @param paramName - [description, constraints: nullable / range / format]
 * @returns [description, including error or edge behavior]
 *
 * @sideEffects [network / storage / timer / DOM focus — omit if none]
 *
 * Policies:
 * - [behavior-critical policy, e.g. debounce 300ms]
 * - [e.g. minChars=2 before triggering search]
 * - [e.g. closes on blur unless clicking within dropdown]
 */
```

Keep it concise. Only add to units with non-obvious behavior.

---

## Step 3: Choose Test File Location & Name

- Scenario tests → `*.scenario.test.ts(x)` placed next to the component
- Pure helper tests → `*.unit.test.ts`

---

## Step 4: Write Tests

### Mandatory structure (non-negotiable)

Every test MUST follow this nesting:

```
describe('<Unit>')
  describe('as is: <initial state or policy>')
    describe('when <user action or condition>')
      it('to be: <expected result> / should <assertion>')
```

### Required test portfolio (minimum)

Write **6–10 scenario tests (P0)** covering:

1. ✅ Success flow via mouse interaction
2. ✅ Success flow via keyboard navigation
3. ✅ Boundary just below threshold (e.g. `minChars - 1` → list stays closed)
4. ✅ Boundary at threshold (e.g. `minChars` → list opens)
5. ✅ One negative scenario (empty input, error state, no results)
6. ✅ One async/race scenario — if the unit makes network calls:
   - Simulate an earlier request resolving AFTER a later one
   - Assert UI reflects only the latest user intent

Add **P1 unit tests** only for small pure helpers (normalization, boundary checks). Skip action/reducer/state-machine tests unless explicitly asked.

### EP / BVA rules

- At the `when` level, every input value MUST represent:
  - an **equivalence class** (valid / invalid / error partition), OR
  - a **boundary point** (min−1, min, max, first/last index)
- Never use arbitrary values. Comment the EP/BVA reasoning if not obvious.

### Tooling

```ts
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
```

- Use `userEvent` (not `fireEvent`) for user interactions
- Use `debounceMs=0` in props when testing debounced behavior, or use `vi.useFakeTimers()` + flush
- For race conditions: use deferred promises to control resolution order — never rely on real timing

### Assert only observable behavior

✅ Rendered UI (open/closed, items, error/empty messages)
✅ Controlled values (input value changes)
✅ Public callbacks (`onSelect`, `onChange`, etc.)
✅ Accessibility attributes (`role`, `aria-expanded`, `aria-activedescendant`, `aria-label`)

❌ Internal reducer state
❌ Dispatched actions
❌ Hook call order
❌ Implementation details

---

## Step 5: Report

After writing, summarize:

```
📄 Test file: <path>
📋 Tests written: <N> scenario (P0) + <N> unit (P1)
🧪 Coverage: success-mouse / success-keyboard / BVA-boundary / negative / async-race
⚠️  Skipped: [anything not covered and why]
```
