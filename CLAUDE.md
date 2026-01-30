# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**@lodado/sdui-template** is a Server-Driven UI (SDUI) template library for React. It enables dynamic UI rendering where the server defines the UI structure via JSON documents, and the React client renders components accordingly.

### Key Use Cases

- Dashboard builders with drag-and-drop widgets
- Dynamic form generation from server schemas
- CMS page builders
- A/B testing with server-controlled layouts

### Core Features

- **Subscription-based rendering**: Only changed nodes re-render (ID-based subscriptions)
- **Normalized data structure**: Uses normalizr for efficient lookups
- **Type-safe**: Full TypeScript support with optional Zod validation
- **Node references**: Components can reference and subscribe to other nodes' state changes

## Monorepo Structure

This is a **pnpm + Turborepo** monorepo:

```text
packages/
  sdui-template/           # Core library (@lodado/sdui-template)
  sdui-template-component/ # Radix UI-based component library (@lodado/sdui-template-component)
  sdui-design-files/       # Design system files
  ssr-testing/             # SSR testing utilities
apps/
  docs/                    # Storybook documentation (port 6006)
  nextAuthOauthLoginExample/ # Next.js example app with OAuth
```

## Common Commands

```bash
# Install dependencies
pnpm install

# Development
pnpm dev              # Run all packages in dev mode (parallel)
pnpm storybook        # Run Storybook on port 6006

# Build
pnpm build            # Build all packages

# Quality
pnpm lint             # Lint all packages with ESLint
pnpm typecheck        # TypeScript type checking
pnpm test             # Run Jest tests
pnpm test:e2e         # Run E2E tests

# Single package commands
pnpm --filter @lodado/sdui-template build
pnpm --filter @lodado/sdui-template test
pnpm --filter sdui-template-storybook storybook

# Publishing
pnpm changeset        # Create a changeset for versioning
pnpm release          # Build and publish packages
```

## Architecture

### Core Library (`packages/sdui-template`)

The library uses a **Facade Pattern** with specialized managers:

```text
SduiLayoutStore (Facade)
├── SubscriptionManager   # Observer pattern for node subscriptions
├── LayoutStateRepository # State storage with normalized entities
├── DocumentManager       # Document caching and serialization
└── VariablesManager      # Global variables management
```

**Key Files:**

- [SduiLayoutStore.ts](packages/sdui-template/src/store/SduiLayoutStore.ts) - Main store class with all public APIs
- [hooks/](packages/sdui-template/src/react-wrapper/hooks/) - React hooks (`useSduiNodeSubscription`, `useSduiLayoutAction`, `useRenderNode`, `useSduiNodeReference`)
- [schema/](packages/sdui-template/src/schema/) - Zod schemas for document/node validation
- [normalize/](packages/sdui-template/src/utils/normalize/) - Normalizr-based normalization/denormalization

### Data Flow

1. **Document normalization**: JSON document → normalized entities (nodes map + rootId)
2. **Component rendering**: `SduiLayoutRenderer` traverses nodes via `renderNode`
3. **State updates**: `store.updateNodeState(id, state)` → notifies only that node's subscribers
4. **Recursive rendering**: Container components use `useRenderNode` + `childrenIds` to render children

### Document Schema

```typescript
interface SduiLayoutDocument {
  version: string              // Required
  metadata?: { id?, name?, ... }
  root: SduiLayoutNode         // Required - root node
  variables?: Record<string, unknown>
}

interface SduiLayoutNode {
  id: string                   // Required - unique
  type: string                 // Required - component type
  state?: Record<string, unknown>
  attributes?: Record<string, unknown>
  children?: SduiLayoutNode[]
  reference?: string | string[] // Reference to other nodes
}
```

## Code Quality Guidelines

### Component Design

- **Separate layers**: UI (render) / State / Domain Logic / Network (API)
- **Side effect isolation**: Inject environment dependencies as parameters
- **Strategy pattern**: Define business policies as interfaces, inject implementations

### Code Quality Principles

#### Coupling

- Single responsibility: components change for one reason only
- Allow strategic duplication over excessive coupling
- Eliminate props drilling via composition or context redesign

#### Cohesion

- Group by change unit: feature/domain-based file organization
- Extract magic numbers to constants
- Keep form validation/state/submit logic together

#### Readability

- Separate code by execution timing (render/effect/handler)
- Use meaningful names for complex conditions
- Maintain top-to-bottom reading flow

#### Predictability

- Use domain prefixes to avoid naming conflicts
- Unify return types across similar functions
- Make implicit dependencies explicit via parameters

### Security (XSS Prevention)

- Use JSX `{}` bindings for dynamic values (auto-escapes)
- Never use `dangerouslySetInnerHTML` without DOMPurify sanitization
- Whitelist URL schemes: `http:`, `https:`, `mailto:`, `tel:`
- Use React event props (`onClick={handler}`), never inline event strings
- For Next.js: use per-request nonce with CSP headers

### Accessibility

- Ensure keyboard navigation for all features
- Use semantic HTML tags
- Maintain proper color contrast (WCAG AA)
- Provide visible focus indicators

---

## Working with SDUI Library

When implementing components using the SDUI library (e.g., Storybook stories, example apps):

1. **Always reference existing examples first** - Check `apps/docs/src/stories/` for Storybook story patterns
2. **Study similar implementations** - Look at how other components use `SduiLayoutRenderer`, hooks, and document schemas
3. **Follow established patterns** - Match the structure and conventions used in existing code

Key example locations:

- [apps/docs/src/stories/](apps/docs/src/stories/) - Storybook stories
- [apps/nextAuthOauthLoginExample/](apps/nextAuthOauthLoginExample/) - Next.js integration example

---

## Important: After Code Changes

**Always run tests after completing any modifications:**

```bash
pnpm run test
```

This is mandatory to ensure changes don't break existing functionality. Do not skip this step.

---

## Token Optimization Guidelines

### Context Efficiency

- Request only the files you need, not the entire project
- Limit queries to specific functions or line ranges
- For large files (50KB+), reference only relevant sections

### Compact Mode

- Use `/compact` command to compress conversation history
- Recommended during long sessions to reduce token usage

### Task-Specific Strategies

| Task            | Optimization Strategy              |
| --------------- | ---------------------------------- |
| Code generation | Generate in small, iterative units |
| Debugging       | Include only error context         |
| Code review     | Focus on structure and core logic  |

### Files for Token Reduction

- `.claudeignore` - Excludes unnecessary files from context (node_modules, dist, lock files, etc.)
