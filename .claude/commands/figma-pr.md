---
name: figma-pr
description: "Figma design sync + isolated worktree PR workflow (figma-sync + pr-orchestrator integration)"
---

You are a **Figma-to-PR orchestrator** that combines two workflows:
1. **Worktree-based PR isolation** (from `pr-orchestrator`)
2. **Figma design sync** (from `/figma-sync`)

# Input Parameters

Collect from user:
- **figma_url**: Figma design URL (must include node-id)
- **component_name**: Target component name (e.g., TextField, Button)
- **scope** (optional): Update scope (default: colors, sizes, spacing)

---

# Workflow Overview

```
┌─────────────────────────────────────────────────────────┐
│  Phase 0: Worktree Setup (from pr-orchestrator)         │
│  └── .claude/scripts/pr-task.sh                         │
├─────────────────────────────────────────────────────────┤
│  Phase 1-5: Figma Sync (delegate to /figma-sync)        │
│  └── Analysis → Plan → Implementation → Verification   │
├─────────────────────────────────────────────────────────┤
│  Phase 6: PR Creation (from pr-orchestrator)            │
│  └── commit → push → gh pr create                       │
└─────────────────────────────────────────────────────────┘
```

---

# Phase 0: Worktree Setup

## 0.1 Generate PR Title

Based on component name and scope:
```
feat(<component>): update styles from Figma design
```

Example:
```
feat(TextField): update styles from Figma design
```

## 0.2 Create Worktree

Execute:
```bash
./.claude/scripts/pr-task.sh "feat(<component>): update styles from Figma design"
```

Parse output to get:
- `worktreePath`: e.g., `.worktrees/feat-textfield-update-styles-from-figma-design`
- `branchName`: e.g., `chore/feat-textfield-update-styles-from-figma-design`

## 0.3 Navigate to Worktree

```bash
cd <worktreePath>
```

Verify correct branch before proceeding.

---

# Phase 1-5: Delegate to /figma-sync

Execute the `/figma-sync` command workflow **within the worktree context**:

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

After /figma-sync completes successfully:

## 6.1 Commit Changes

```bash
cd <worktreePath>
git add .
git commit -m "$(cat <<'EOF'
feat(<component>): update styles from Figma design

- Updated colors, sizes, spacing based on Figma
- Figma URL: <figma_url>

Co-Authored-By: Claude <noreply@anthropic.com>
EOF
)"
```

## 6.2 Push to Remote

```bash
git push -u origin <branchName>
```

## 6.3 Create Pull Request

```bash
gh pr create --title "feat(<component>): update styles from Figma design" --body "$(cat <<'EOF'
## Summary
- Updated <component> styles based on Figma design
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
EOF
)"
```

---

# Phase 7: Final Report

```markdown
## PR Created Successfully

### PR Info
- **URL**: <pr_url>
- **Branch**: <branchName>
- **Worktree**: <worktreePath>

### Figma Sync Summary
<insert figma-sync Phase 5 report>

### Next Steps
1. Review PR: <pr_url>
2. After merge, clean up:
   ```bash
   git worktree remove <worktreePath>
   ```
```

---

# Rules

1. **Worktree isolation**: ALL changes happen inside worktree, never in main repo
2. **Delegate to /figma-sync**: Do not duplicate figma-sync logic, invoke it
3. **Wait for approval**: Honor /figma-sync's Phase 2 approval checkpoint
4. **Sequential execution**: Phase 0 → 1-5 (figma-sync) → 6 → 7
5. **Clean failure**: If any phase fails, preserve worktree and report status

---

# Error Handling

| Error | Action |
|-------|--------|
| Worktree exists | Suggest cleanup command, abort |
| figma-sync fails | Keep worktree, report for manual fix |
| Tests fail | Retry fix via figma-sync, max 3 attempts |
| Push fails | Check upstream, suggest rebase |
| PR creation fails | Provide manual gh command |
