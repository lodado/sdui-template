# .claude/ Directory

This directory contains Claude Code configuration, commands, agents, and hooks.

## Directory Structure

```text
.claude/
├── commands/       # Custom slash commands
├── agents/         # Custom review agents
├── hooks/          # Automation hooks
├── homunculus/     # Learning observation data
├── settings.json   # Project settings & hooks config
└── settings.local.json  # Local permissions (gitignored)
```

---

## Commands (`/command-name`)

| Command   | File | Description |
|-----------|------|-------------|
| `/review` | [commands/review.md](commands/review.md) | 4-agent parallel code review (PM + Arch + UX + DX) with integrated report |
| `/learn`  | [commands/learn.md](commands/learn.md) | Extract reusable patterns to `.claude/skills/learned/` |

---

## Agents (used by `/review`)

| Agent | File | Role |
|-------|------|------|
| `pm-spec-enforcer` | [agents/pm-spec-enforcer.md](agents/pm-spec-enforcer.md) | Spec-based FR/NFR verification, requirements compliance |
| `toxic-architect` | [agents/toxic-architect.md](agents/toxic-architect.md) | Boundaries/abstraction/type contracts/testability review |
| `ux-art-obsessed` | [agents/ux-art-obsessed.md](agents/ux-art-obsessed.md) | Responsive(320~1440)/accessibility/color contrast/UX |
| `mz-dx-rager` | [agents/mz-dx-rager.md](agents/mz-dx-rager.md) | API usability/consistency/error messages/docs/local dev |

---

## Hooks (Auto-executed)

Configured in [settings.json](settings.json):

| Trigger | Matcher | Description |
|---------|---------|-------------|
| PreToolUse | `*` | Observation logging (observe.sh) |
| PreToolUse | `git push` | Reminder before push |
| PreToolUse | `Edit \| Write` | Suggest manual compaction |
| PostToolUse | `*` | Observation logging |
| PostToolUse | `gh pr create` | Log PR URL with review command |
| PostToolUse | `Edit *.ts/tsx/js/jsx` | Auto-format with Prettier |
| PostToolUse | `Edit *.ts/tsx` | TypeScript check |
| PostToolUse | `Edit *.ts/tsx/js/jsx` | Warn about console.log |
| PostToolUse | `Edit *.ts/tsx/js/jsx` | Run tests (30s debounce) |
| SessionStart | `*` | Load previous context |
| SessionEnd | `*` | Persist session state |
| Stop | `*` | Check console.log in modified files |

---

## Marketplace Skills (everything-claude-code)

### Planning & Architecture

| Skill | Description |
|-------|-------------|
| `/everything-claude-code:plan` | Requirements analysis & step-by-step implementation plan |
| `/everything-claude-code:evolve` | Evolve instincts to skills/commands/agents |

### Testing

| Skill | Description |
|-------|-------------|
| `/everything-claude-code:tdd` | TDD workflow (test first, 80%+ coverage) |
| `/everything-claude-code:e2e` | Playwright E2E test generation/execution |

### Code Quality

| Skill | Description |
|-------|-------------|
| `/everything-claude-code:security-review` | Security review (OWASP Top 10) |
| `/everything-claude-code:go-review` | Go code review |
| `/everything-claude-code:go-build` | Go build error resolution |
| `/everything-claude-code:go-test` | Go TDD workflow |

### Pattern Skills (Auto-applied)

| Skill | Description |
|-------|-------------|
| `backend-patterns` | Node.js, Express, Next.js API patterns |
| `frontend-patterns` | React, Next.js, state management |
| `postgres-patterns` | PostgreSQL optimization, Supabase |
| `coding-standards` | TypeScript/JavaScript/React standards |
| `golang-patterns` | Idiomatic Go patterns |

### Learning & Instincts

| Skill | Description |
|-------|-------------|
| `/everything-claude-code:instinct-status` | View learned instincts |
| `/everything-claude-code:instinct-export` | Export instincts for sharing |
| `/everything-claude-code:instinct-import` | Import external instincts |
| `/everything-claude-code:skill-create` | Extract patterns from git history |

### Other

| Skill | Description |
|-------|-------------|
| `/frontend-design:frontend-design` | High-quality frontend UI generation |
| `/keybindings-help` | Keyboard shortcut customization |

---

## Cursor Rules (`.cursor/rules/`)

> ⚠️ These are for **Cursor IDE only**, not Claude Code.

| Rule | Apply | Description |
|------|-------|-------------|
| `modular-abstraction` | Always | Side effect isolation, Strategy pattern |
| `coupling` | Always | Single responsibility, no props drilling |
| `cohesion` | Always | Group by change unit |
| `readability` | Always | Top-to-bottom flow, reduce context |
| `predictability` | Always | Unified returns, explicit deps |
| `accessibility` | Always | WCAG compliance, keyboard navigation |
| `screen-reader` | Always | alt text, ARIA attributes |
| `xss` | Always | XSS defense (JSX escape, CSP) |
| `doc-and-testing` | Manual | JSDoc, Scenario-first tests |
| `font` | Manual | Spoqa Han Sans Neo typography |
| `PR-rules` | Manual | PR template |
| `refactoring-guide` | Manual | SOLID/Clean Code refactoring |

To use these in Claude Code, convert them to commands in `.claude/commands/`.
