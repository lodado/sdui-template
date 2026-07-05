---
description: Generate behavior-focused, accessibility-aware tests using this library's test tooling (Playwright recommended). Shim for the global /behavior-tests command.
argument-hint: [file or component path — defaults to recently changed files]
---

Run the global `/behavior-tests` workflow (`~/.claude/commands/behavior-tests.md`) for `$ARGUMENTS`.

Repo notes for sdui-template:

- Use this library's own test tooling — **Playwright recommended**, especially for component/E2E behavior. Check `packages/*/package.json` and existing `__tests__/` setup before choosing the runner; unit tests currently run on Jest via `pnpm run test`.
- Follow the same `as is / when / to be` describe nesting and EP/BVA rules from the global command.
- Run `pnpm run test` (and Playwright specs if added) from the monorepo root after writing tests.
