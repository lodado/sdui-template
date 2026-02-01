---
name: figma-pr
description: 'Figma design sync + isolated worktree PR workflow'
---

You are a **Figma-to-PR orchestrator** that combines:

1. **Worktree-based PR isolation** (see: `.cursor/rules/worktree-pr-workflow.mdc`)
2. **Figma design sync** (`/figma-sync` command)

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
│  └── Create isolated workspace via pr-task.sh           │
├─────────────────────────────────────────────────────────┤
│  Phase 1-5: Figma Sync                                  │
│  └── Delegate to /figma-sync command                    │
├─────────────────────────────────────────────────────────┤
│  Phase 6-7: Commit & Push & Report                      │
│  └── commit → push → report                             │
└─────────────────────────────────────────────────────────┘
```

---

# Phase 0: Worktree Setup

## Variables

```
pr_title = "feat(<component_name>): update styles from Figma design"
```

## 0.1 Create Worktree

```bash
./.claude/scripts/pr-task.sh "<pr_title>"
```

**Parse output:**
- `worktreePath`: Created worktree path (e.g., `.worktrees/feat-button-update-styles`)
- `branchName`: Created branch name (e.g., `chore/feat-button-update-styles`)

## 0.2 Navigate to Worktree

```bash
cd <worktreePath>
```

**Verify:** Run `git branch --show-current` to confirm correct branch

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

## 6.1 Commit Changes

```bash
cd <worktreePath>
git add .
git commit -m "$(cat <<'EOF'
feat(<component_name>): update styles from Figma design

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

---

# Phase 7: Final Report

```markdown
## Push Completed Successfully

### Branch Info
- **Branch**: <branchName>
- **Worktree**: <worktreePath>

### Figma Sync Summary
<insert changed styles/values table from /figma-sync Phase 5>

### Next Steps
1. Create PR manually on GitHub
2. After merge, clean up:
   ```bash
   git worktree remove <worktreePath>
   ```
```

---

# Rules

## Worktree Rules
1. **Isolation**: All changes happen only within worktree, never touch main repo
2. **Sequential execution**: Phase 0 → 1-5 → 6 → 7
3. **Preserve on failure**: Keep worktree and report status on errors
4. **Verification required**: Tests/typecheck/lint must pass before push

## Figma-specific Rules
1. **Delegate to /figma-sync**: No duplicating figma-sync logic, call the command
2. **Wait for approval**: Respect /figma-sync Phase 2 approval checkpoint

---

# Error Handling

| Error | Action |
|-------|--------|
| Worktree already exists | Suggest cleanup command, then abort |
| Figma API failure | Verify URL format, retry |
| Component not found | Check path, request correct component name from user |
| Style extraction failure | Verify Figma node-id |
| Tests failure | Retry up to 3 times, then report failure |
| Push failure | Check upstream, suggest rebase |
