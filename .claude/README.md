# Claude Code — SDUI Template

**Project-local AI workflow for `@lodado/sdui-template`: parallel review, Figma sync, learning loops, and quality guardrails.**

[![GitHub](https://img.shields.io/github/stars/lodado/sdui-template?style=social&label=Star)](https://github.com/lodado/sdui-template)
[![Claude Code](https://img.shields.io/badge/Tool-Claude%20Code-D97757)](https://claude.ai/code)
[![SDUI](https://img.shields.io/badge/Project-SDUI%20Template-2563EB)](https://github.com/lodado/sdui-template)

[![Review](https://img.shields.io/badge/Command-%2Freview-059669)](commands/review.md)
[![Figma Sync](https://img.shields.io/badge/Command-%2Ffigma--sync-8B5CF6)](commands/figma-sync.md)
[![FSD](https://img.shields.io/badge/Skill-FSD-0EA5E9)](skills/FSD/SKILL.md)

[Quick start](#quick-start) · [Commands](#commands) · [Agents](#agents) · [Skills](#project-skills) · [Hooks](#hooks) · [Cursor rules](#cursor-rules-cursorrules)

---

This directory is the **Claude Code control plane** for the SDUI monorepo. It wires custom slash commands, review agents, project skills, automation hooks, and continuous-learning data so every session follows the same quality bar.

```
code → /review → 4-agent report
     → /figma-sync → SDUI component update
     → /learn → reusable skill
     → hooks → format · typecheck · observe
```

### End-to-end example

> **One `/review` run** → four parallel specialist reviews → integrated verdict with evidence.

| **① trigger** `/review` | →   | **② parallel agents** PM · Arch · UX · DX | →   | **③ report** Verdict + P0–P3 issues |
| ----------------------- | --- | ----------------------------------------- | --- | ----------------------------------- |

#### ① Trigger — slash command

Run from any Claude Code session in this repo:

```
/review
```

The orchestrator reads [commands/review.md](commands/review.md) and dispatches all four agents **without a fixed order**.

#### ② Parallel agents — evidence-first review

Each agent must cite **Evidence** (file, line, snippet) and **Reasoning** (impact). Guessing is forbidden — missing proof becomes `INSUFFICIENT EVIDENCE`.

| Agent              | Focus                                |
| ------------------ | ------------------------------------ |
| `pm-spec-enforcer` | FR/NFR compliance against specs      |
| `toxic-architect`  | Boundaries, abstraction, testability |
| `ux-art-obsessed`  | Responsive 320–1440, a11y, contrast  |
| `mz-dx-rager`      | API ergonomics, errors, local dev DX |

#### ③ Integrated report — actionable verdict

```
## Verdict
⚠️ CONDITIONAL

## Issues
- P1 — Missing aria-label on Dialog close button
  Evidence: packages/sdui-template-component/.../Dialog.tsx:42
  Reasoning: Screen reader users cannot dismiss the dialog
```

---

## Table of Contents

- [Why this exists](#why-this-exists)
- [Directory structure](#directory-structure)
- [Quick start](#quick-start)
- [Commands](#commands)
- [Agents](#agents)
- [Project skills](#project-skills)
- [Hooks](#hooks)
- [Continuous learning](#continuous-learning-homunculus)
- [Marketplace skills](#marketplace-skills-everything-claude-code)
- [Cursor rules](#cursor-rules-cursorrules)

---

## Why this exists

The SDUI monorepo spans a core library, a component package, Storybook docs, and example apps. Without project-local Claude config, every session would re-discover:

- FSD layer boundaries and SDUI compound-component patterns
- Review dimensions (spec, architecture, UX, DX) with evidence requirements
- Figma → component sync and worktree-based PR isolation
- Test conventions (`as is / when / to be`, EP/BVA sampling)

`.claude/` centralizes those conventions so Claude Code starts every session with the right commands, agents, and skills already loaded.

## Directory structure

```text
.claude/
├── commands/           # Custom slash commands
│   ├── review.md       # 4-agent parallel code review
│   ├── learn.md        # Extract patterns → skills/learned/
│   ├── figma-sync.md   # Figma → SDUI component workflow
│   ├── figma-pr.md     # Figma sync + worktree PR
│   └── test.md         # Behavior-focused test shim
├── agents/             # Specialist review & PR agents
├── skills/             # Project skills (SDUI, FSD, learned patterns)
├── hooks/              # Automation hook scripts
│   ├── post-tool-use.js
│   ├── stop.js
│   └── modules/        # prettier, tsc, file-tracker, observe
├── homunculus/         # Continuous learning observations
├── scripts/            # PR task helpers
├── settings.json       # Permissions & enabled plugins
└── settings.local.json # Local overrides (gitignored)
```

---

## Quick start

Open Claude Code in the repo root:

```bash
cd /path/to/sdui-template
claude
```

Optional — skip permission prompts during local dev:

```bash
claude --dangerously-skip-permissions
```

### Common workflows

| Goal                                      | Command                                    |
| ----------------------------------------- | ------------------------------------------ |
| Full parallel code review                 | `/review`                                  |
| Save a reusable pattern from this session | `/learn`                                   |
| Sync Figma design → SDUI component        | `/figma-sync <figma-url> <component-name>` |
| Figma sync + isolated worktree PR         | `/figma-pr <figma-url> <component-name>`   |
| Behavior-focused tests                    | `/test [path]`                             |
| Check learned instincts                   | `/everything-claude-code:instinct-status`  |
| TDD workflow                              | `/everything-claude-code:tdd`              |

After code changes, always run from the monorepo root:

```bash
pnpm run test
```

---

## Commands

| Command       | File                                             | Description                                                          |
| ------------- | ------------------------------------------------ | -------------------------------------------------------------------- |
| `/review`     | [commands/review.md](commands/review.md)         | 4-agent parallel review (PM + Arch + UX + DX) with integrated report |
| `/learn`      | [commands/learn.md](commands/learn.md)           | Extract reusable patterns to `skills/learned/`                       |
| `/figma-sync` | [commands/figma-sync.md](commands/figma-sync.md) | Figma design → SDUI component (Analysis → Plan → Implement → Verify) |
| `/figma-pr`   | [commands/figma-pr.md](commands/figma-pr.md)     | Figma sync + worktree-isolated PR workflow                           |
| `/test`       | [commands/test.md](commands/test.md)             | Behavior-focused, a11y-aware tests (Playwright recommended)          |

---

## Agents

### Review agents (used by `/review`)

| Agent              | File                                                     | Role                                                  |
| ------------------ | -------------------------------------------------------- | ----------------------------------------------------- |
| `pm-spec-enforcer` | [agents/pm-spec-enforcer.md](agents/pm-spec-enforcer.md) | Spec-based FR/NFR verification                        |
| `toxic-architect`  | [agents/toxic-architect.md](agents/toxic-architect.md)   | Boundaries, abstraction, type contracts, testability  |
| `ux-art-obsessed`  | [agents/ux-art-obsessed.md](agents/ux-art-obsessed.md)   | Responsive (320–1440), accessibility, color contrast  |
| `mz-dx-rager`      | [agents/mz-dx-rager.md](agents/mz-dx-rager.md)           | API usability, consistency, error messages, local dev |

### PR workflow agents

| Agent             | File                                                   | Role                             |
| ----------------- | ------------------------------------------------------ | -------------------------------- |
| `pr-orchestrator` | [agents/pr-orchestrator.md](agents/pr-orchestrator.md) | Worktree setup → delegate → push |
| `pr-implementer`  | [agents/pr-implementer.md](agents/pr-implementer.md)   | Isolated worktree implementation |

---

## Project skills

Auto-applied or invoked skills specific to this monorepo:

| Skill              | File                                                                 | Description                                             |
| ------------------ | -------------------------------------------------------------------- | ------------------------------------------------------- |
| `sduiArchitecture` | [skills/sduiArchitecture/SKILL.md](skills/sduiArchitecture/SKILL.md) | Compound components in SDUI (Context + node references) |
| `sduiComponents`   | [skills/sduiComponents/SKILL.md](skills/sduiComponents/SKILL.md)     | SDUI component implementation patterns                  |
| `sduiFormat`       | [skills/sduiFormat/SKILL.md](skills/sduiFormat/SKILL.md)             | SDUI document/node schema conventions                   |
| `FSD`              | [skills/FSD/SKILL.md](skills/FSD/SKILL.md)                           | Feature-Sliced Design layer placement                   |

### Learned patterns (`skills/learned/`)

Session-extracted patterns from `/learn`:

| File                                                                                                          | Topic                            |
| ------------------------------------------------------------------------------------------------------------- | -------------------------------- |
| [sdui-template-patterns.md](skills/learned/sdui-template-patterns.md)                                         | Core library patterns            |
| [fsd-shared-slice-organization.md](skills/learned/fsd-shared-slice-organization.md)                           | Shared slice utils & hooks       |
| [component-library-reference-skill-template.md](skills/learned/component-library-reference-skill-template.md) | Component library skill template |

---

## Hooks

Hook scripts live in [hooks/](hooks/). Wire them in [settings.json](settings.json) under the `hooks` key when you want automation.

| Script                        | Trigger         | What it does                                          |
| ----------------------------- | --------------- | ----------------------------------------------------- |
| `post-tool-use.js`            | PostToolUse     | Log observations, track edited JS/TS files            |
| `stop.js`                     | Stop            | Prettier format + TypeScript check on edited files    |
| `modules/prettier-format.js`  | —               | Auto-format `*.{ts,tsx,js,jsx}`                       |
| `modules/typescript-check.js` | —               | Run `tsc` on edited TypeScript files                  |
| `modules/observe.js`          | Pre/PostToolUse | Append tool events to `homunculus/observations.jsonl` |
| `modules/file-tracker.js`     | —               | Track files edited in the current session             |

Example `settings.json` wiring:

```json
{
  "hooks": {
    "PostToolUse": [
      {
        "matcher": "*",
        "hooks": [{ "type": "command", "command": "node .claude/hooks/post-tool-use.js" }]
      }
    ],
    "Stop": [
      {
        "matcher": "*",
        "hooks": [{ "type": "command", "command": "node .claude/hooks/stop.js" }]
      }
    ]
  }
}
```

---

## Continuous learning (`homunculus/`)

Local observation and instinct system. See [homunculus/README.md](homunculus/README.md) for full details.

| Stage   | What happens                                                          |
| ------- | --------------------------------------------------------------------- |
| Observe | Tool usage logged to `observations.jsonl`                             |
| Detect  | Repeated patterns surface as instincts                                |
| Evolve  | `/everything-claude-code:evolve` promotes instincts → skills/commands |

| Command                                   | Description                           |
| ----------------------------------------- | ------------------------------------- |
| `/everything-claude-code:instinct-status` | View learned instincts                |
| `/everything-claude-code:evolve`          | Evolve instincts into skills/commands |
| `/everything-claude-code:instinct-export` | Export instincts for sharing          |
| `/everything-claude-code:instinct-import` | Import external instincts             |

---

## Marketplace skills (`everything-claude-code`)

Enabled via [settings.json](settings.json) → `enabledPlugins`.

### Planning & architecture

| Skill                            | Description                                              |
| -------------------------------- | -------------------------------------------------------- |
| `/everything-claude-code:plan`   | Requirements analysis & step-by-step implementation plan |
| `/everything-claude-code:evolve` | Evolve instincts to skills/commands/agents               |

### Testing

| Skill                         | Description                              |
| ----------------------------- | ---------------------------------------- |
| `/everything-claude-code:tdd` | TDD workflow (test first, 80%+ coverage) |
| `/everything-claude-code:e2e` | Playwright E2E test generation/execution |

### Code quality

| Skill                                     | Description                    |
| ----------------------------------------- | ------------------------------ |
| `/everything-claude-code:security-review` | Security review (OWASP Top 10) |
| `/everything-claude-code:go-review`       | Go code review                 |
| `/everything-claude-code:go-build`        | Go build error resolution      |
| `/everything-claude-code:go-test`         | Go TDD workflow                |

### Pattern skills (auto-applied)

| Skill               | Description                            |
| ------------------- | -------------------------------------- |
| `backend-patterns`  | Node.js, Express, Next.js API patterns |
| `frontend-patterns` | React, Next.js, state management       |
| `postgres-patterns` | PostgreSQL optimization, Supabase      |
| `coding-standards`  | TypeScript/JavaScript/React standards  |
| `golang-patterns`   | Idiomatic Go patterns                  |

### Other plugins

| Plugin            | Skill                              | Description                             |
| ----------------- | ---------------------------------- | --------------------------------------- |
| `frontend-design` | `/frontend-design:frontend-design` | High-quality frontend UI generation     |
| `figma`           | MCP tools                          | Figma design context & screenshots      |
| `playwright`      | —                                  | Playwright test tooling                 |
| `superpowers`     | —                                  | Extended planning & execution workflows |
| `context7`        | —                                  | Up-to-date library documentation        |
| `github`          | —                                  | GitHub PR/issue integration             |

---

## Cursor rules (`.cursor/rules/`)

> These rules apply to **Cursor IDE** sessions. To use the same policies in Claude Code, convert them to commands or skills under `.claude/`.

| Rule                   | Apply  | Description                              |
| ---------------------- | ------ | ---------------------------------------- |
| `modular-abstraction`  | Always | Side effect isolation, Strategy pattern  |
| `coupling`             | Always | Single responsibility, no props drilling |
| `cohesion`             | Always | Group by change unit                     |
| `readability`          | Always | Top-to-bottom flow, reduce context       |
| `predictability`       | Always | Unified returns, explicit deps           |
| `accessibility`        | Always | WCAG compliance, keyboard navigation     |
| `screen-reader`        | Always | alt text, ARIA attributes                |
| `xss`                  | Always | XSS defense (JSX escape, CSP)            |
| `fsd-architecture`     | Always | Feature-Sliced Design layer rules        |
| `doc-and-testing`      | Manual | JSDoc, scenario-first tests              |
| `font`                 | Manual | Spoqa Han Sans Neo typography            |
| `PR-rules`             | Manual | PR template                              |
| `refactoring-guide`    | Manual | SOLID/Clean Code refactoring             |
| `worktree-pr-workflow` | Manual | Worktree-based PR isolation              |

---

## Recommended workflow

| Stage         | Check                          | Tool                         |
| ------------- | ------------------------------ | ---------------------------- |
| Feature work  | Implement with SDUI/FSD skills | Claude Code + project skills |
| Before PR     | Parallel 4-agent review        | `/review`                    |
| Design sync   | Figma → component update       | `/figma-sync` or `/figma-pr` |
| After changes | Unit tests pass                | `pnpm run test`              |
| Session end   | Capture reusable patterns      | `/learn`                     |

```
Project skills = domain conventions
/review         = evidence-based quality gate
Hooks           = format + typecheck automation
/learn          = compounding knowledge
```
