---
name: figma-pr
description: "Figma design sync + isolated worktree PR workflow"
---

You are a **Figma-to-PR orchestrator** that combines:
1. **Worktree-based PR isolation** (@worktree-pr-workflow.mdc)
2. **Figma design sync** (/figma-sync)

# Input Parameters

Collect from user:
- **figma_url**: Figma design URL (must include node-id)
- **component_name**: Target component name (e.g., TextField, Button)
- **scope** (optional): Update scope (default: colors, sizes, spacing)

---

# Workflow Overview

```
┌─────────────────────────────────────────────────────────┐
│  Phase 0: Worktree Setup                                │
│  └── @worktree-pr-workflow.mdc Phase 0 참조             │
├─────────────────────────────────────────────────────────┤
│  Phase 1-5: Figma Sync                                  │
│  └── /figma-sync 명령어 위임                            │
├─────────────────────────────────────────────────────────┤
│  Phase 6-7: PR Creation & Report                        │
│  └── @worktree-pr-workflow.mdc Phase N, N+1 참조        │
└─────────────────────────────────────────────────────────┘
```

---

# Phase 0: Worktree Setup

> **Reference**: @worktree-pr-workflow.mdc Phase 0

## Variables

```
pr_title = "feat(<component_name>): update styles from Figma design"
```

## Execute

```bash
./.claude/scripts/pr-task.sh "<pr_title>"
cd <worktreePath>
```

---

# Phase 1-5: Delegate to /figma-sync

Execute `/figma-sync` **within the worktree context**:

```
/figma-sync
```

With parameters:
- figma_url: <user provided>
- component_name: <user provided>

**Follow all /figma-sync phases:**
1. **Analysis**: Extract Figma context + analyze current code
2. **Planning**: Create comparison table + list changes
3. **⚠️ WAIT FOR USER CONFIRM** before implementation
4. **Implementation**: Update styles/types/examples
5. **Verification**: Run tests, build, typecheck, lint

**IMPORTANT**: All file operations happen inside the worktree path.

---

# Phase 6: PR Creation

> **Reference**: @worktree-pr-workflow.mdc Phase N

## Commit Message Template

```
feat(<component_name>): update styles from Figma design

- Updated colors, sizes, spacing based on Figma
- Figma URL: <figma_url>

Co-Authored-By: Claude <noreply@anthropic.com>
```

## PR Body Template

```markdown
## Summary
- Updated <component_name> styles based on Figma design
- Figma: <figma_url>

## Changes
<insert changed styles/values table from figma-sync report>

## Test plan
- [x] Unit tests pass
- [x] Build succeeds
- [x] Typecheck passes
- [x] Lint passes

---
Generated with [Claude Code](https://claude.ai/code)
```

---

# Phase 7: Final Report

> **Reference**: @worktree-pr-workflow.mdc Phase N+1

Include in report:
- PR Info (URL, Branch, Worktree)
- Figma Sync Summary (from Phase 5)
- Next Steps (PR review link, cleanup command)

---

# Rules

> **Reference**: @worktree-pr-workflow.mdc Rules 섹션

Additional Figma-specific rules:
1. **Delegate to /figma-sync**: figma-sync 로직 중복 금지, 명령어 호출
2. **Wait for approval**: /figma-sync Phase 2 승인 대기점 준수

---

# Error Handling

> **Reference**: @worktree-pr-workflow.mdc Error Handling 섹션

Figma-specific errors handled by /figma-sync:
- Figma API 실패
- Component not found
- Style extraction 실패
