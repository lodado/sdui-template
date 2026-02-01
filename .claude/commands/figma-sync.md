---
name: figma-sync
description: "Figma design-based SDUI component update workflow (Analysis → Plan → Implementation → Verification → Report)"
---

You are a Figma-to-Code sync orchestrator.
Execute the complete workflow to update SDUI components based on Figma designs sequentially.

# Input Parameters

Collect the following information from the user:
- **figma_url**: Figma design URL (must include node-id)
- **component_name**: Target component name (e.g., TextField, Button)

---

# Phase 1: Analysis

## 1.1 Extract Figma Design Context
- Use `mcp__figma__get_design_context` tool to extract design information
- Parse fileKey and nodeId from URL (e.g., `node-id=13076-29967` → `13076:29967`)
- Collect colors, sizes, spacing, and variants information

## 1.2 Analyze Current Component Code
- Search target component files: `packages/sdui-template-component/src/shared/ui/{component-name}/`
- Files to analyze:
  - `*-variants.ts` - Style variants
  - `types.ts` - Props/Types definitions
  - `index.ts` or main component file
  - `__docs__/*.stories.tsx` - Storybook examples

## 1.3 Create Props/Variants Comparison Table
Compare current state with Figma design in the following format:

| Prop/Variant | Current Value | Figma Value | Change Required |
|--------------|---------------|-------------|-----------------|
| size         | sm/md/lg      | ...         | Yes/No          |
| color        | #xxx          | #yyy        | Yes/No          |
| ...          | ...           | ...         | ...             |

---

# Phase 2: Planning

## 2.1 List Changes
- Extract only items that need changes
- Specify before/after values for each item

## 2.2 Identify Affected Files
```
packages/sdui-template-component/src/shared/ui/{component}/
├── {component}-variants.ts  ← Style changes
├── types.ts                 ← Type changes (if needed)
└── index.ts                 ← Component changes (if needed)

apps/docs/src/stories/
└── {Component}.stories.tsx  ← Example updates
```

## 2.3 Execution Plan Summary
- List of files to change
- Order of operations
- Expected impact scope

**⚠️ MUST wait for user CONFIRM before proceeding to Phase 3**

---

# Phase 3: Implementation

**Proceed only after user approval**

## 3.1 Update Component Styles
- Modify color, size, spacing values in `*-variants.ts` files
- Update Tailwind CSS classes or CSS variables

## 3.2 Update Types (if needed)
- Modify `types.ts` when adding new variants
- Update Props interfaces

## 3.3 Update Related Example Components
- Update Storybook stories
- Add examples for new variants

---

# Phase 4: Verification

## 4.1 Run Tests
```bash
pnpm test
```
- On failure: Analyze error → Fix → Re-run
- On pass: Proceed to next step
- **Once tests pass, no need to re-run tests in subsequent phases**

## 4.2 Type Check
```bash
pnpm typecheck
```

## 4.3 Lint Check
```bash
pnpm lint
```

**Repeat until all verifications pass**
**Note: Skip build step (`pnpm build`) - not required for this workflow**

---

# Phase 5: Final Report

## Output Format

### Change Summary
| File | Changes |
|------|---------|
| ...  | ...     |

### Verification Results
- Tests: ✅ PASS (X tests)
- Typecheck: ✅ PASS
- Lint: ✅ PASS

### Changed Styles/Values
| Item | Before | After |
|------|--------|-------|
| ...  | ...    | ...   |

### Next Steps (Optional)
- Verify Storybook: `pnpm storybook`
- Create commit: `/commit`

---

# Rules

1. **Sequential execution required**: Phase 1 → 2 → (approval) → 3 → 4 → 5
2. **Wait for approval**: MUST wait for user CONFIRM after Phase 2 completion
3. **Auto-fix on verification failure**: Fix and re-verify when Phase 4 fails
4. **Respect scope**: Do not change anything outside user-specified scope (e.g., skip labels if excluded)
5. **Evidence-based**: Cite Figma design values as evidence for all changes
