---
name: sdui-component-new
description: Add a brand-new SDUI component to @lodado/sdui-template-component end-to-end — FSD folder, Zod schema, container, registry, stories, tests, MCP knowledge rebuild, changeset. Use when the user asks to "add a component", "create a new SDUI component", or a /figma-sync target component does not exist yet.
---

# New SDUI Component — End to End

## Trigger

- User asks for a new component in `@lodado/sdui-template-component`.
- `/figma-sync` was invoked but the target component folder does not exist.

## Input

- **component name** (PascalCase, e.g. `Slider`)
- optional: Figma URL (then run `/figma-sync` Phase 1 for design values first)
- optional: compound? (has Trigger/Content/Item sub-parts like Dialog/Dropdown)

## Reference implementation (copy the shape, don't invent one)

- Simple component: `packages/sdui-template-component/src/shared/ui/badge/`
- Compound component: `packages/sdui-template-component/src/shared/ui/dropdown/` + `.claude/skills/sduiArchitecture/SKILL.md`

Folder anatomy (mirror exactly):

```text
src/shared/ui/{name}/
├── {Name}.tsx            # presentational — pure props, no store access
├── {Name}Container.tsx   # SDUI wrapper — useSduiNodeSubscription + Zod schema
├── {name}-variants.ts    # style variants (cva/tailwind)
├── types.ts              # Props, State, {name}StatesSchema (z.ZodSchema<Record<string, unknown>>)
├── __tests__/            # behavior tests
└── index.ts              # public exports incl. schema
```

## Steps

1. **Read one sibling fully** (`badge/` or `dropdown/`). Match naming, export style, schema typing (`z.ZodSchema<Record<string, unknown>>` cast) exactly.
2. **Write test first** (`__tests__/{Name}.test.tsx`) — render via document JSON, assert behavior + keyboard nav + aria. RED before implementation.
3. Create `types.ts` — Props, State, `{name}StatesSchema`. Every dynamic value in `state`, static config in `attributes`.
4. Create presentational `{Name}.tsx` + `{name}-variants.ts`. WCAG AA contrast, visible focus.
5. Create `{Name}Container.tsx` — `useSduiNodeSubscription({ nodeId, schema })`. Compound components: every sub-part resolves shared context via `providerId`, not React nesting.
6. **Register** in `src/app/sduiComponents.tsx` (component map) and the schema registry alongside it. Export from `src/shared/ui/index.ts` and folder `index.ts`.
7. **Story**: `apps/docs/src/stories/{Name}.stories.tsx` — copy structure from `Badge.stories.tsx`. Include one full `SduiLayoutDocument` JSON example per variant; stories feed MCP examples.
8. **Rebuild MCP knowledge**: `pnpm --filter @lodado/sdui-mcp build` (stories/source are its input — mandatory, not optional).
9. **Verify**: `pnpm test` (root), `pnpm typecheck`, `pnpm lint`. Fix until green.
10. **Changeset**: `pnpm changeset` → minor for `@lodado/sdui-template-component`.

## Output

Report table: files created, registry entries added, test result line (quoted), MCP knowledge rebuilt (Y/N), changeset id. Explicitly list anything skipped.

## Hard rules

- No new npm dependency without asking — Radix primitives + existing deps first.
- No store logic in presentational components; no business rules in containers.
- Duplicate node `id`s or `className` inside `state` = bug, will break re-render scoping.
