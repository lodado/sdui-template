# @lodado/sdui-template

**Server-Driven UI template library for React — the server defines UI structure as JSON; the client renders it with type-safe, subscription-based React components.**

[![npm version](https://img.shields.io/npm/v/@lodado/sdui-template.svg)](https://www.npmjs.com/package/@lodado/sdui-template)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![Node.js](https://img.shields.io/badge/Node.js-20%2B-339933?logo=node.js&logoColor=white)](https://nodejs.org/)
[![React](https://img.shields.io/badge/React-18%2B-61DAFB?logo=react&logoColor=white)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5%2B-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![GitHub stars](https://img.shields.io/github/stars/lodado/sdui-template?style=social)](https://github.com/lodado/sdui-template/stargazers)
[![GitHub issues](https://img.shields.io/github/issues/lodado/sdui-template)](https://github.com/lodado/sdui-template/issues)

[![Server-Driven UI](https://img.shields.io/badge/SDUI-Server--Driven%20UI-2563EB)](https://github.com/lodado/sdui-template)
[![Next.js](https://img.shields.io/badge/Next.js-App%20Router-000000?logo=next.js&logoColor=white)](https://nextjs.org/)
[![Zod](https://img.shields.io/badge/Zod-v4-3E63DD)](https://zod.dev/)
[![Turborepo](https://img.shields.io/badge/Turborepo-monorepo-EF4444?logo=turborepo&logoColor=white)](https://turbo.build/)

[Quick start](#quick-start) · [Packages](#packages) · [Philosophy](#philosophy) · [Architecture](#architecture) · [Document model](#document-model) · [Development](#development)

---

The server decides **what** to show; the client decides **how** to render it through an explicit component registry. Built for dashboard builders, dynamic forms, CMS pages, and A/B layouts in React/Next.js apps — change UI structure without redeploying the client.

```
Server / CMS / Builder
        │ SduiLayoutDocument (JSON)
        ▼
SduiLayoutRenderer + registered ComponentFactory map
        ▼
Subscription-based React UI (only changed nodes re-render)
```

### End-to-end example

| **① server JSON** | →   | **② renderer** | →   | **③ interactive UI** |
| ----------------- | --- | -------------- | --- | -------------------- |

**① Server JSON** — nested 3-level tree (`Container` → `Card` → `Counter`):

```json
{
  "version": "1.0.0",
  "root": {
    "id": "page",
    "type": "Container",
    "children": [
      {
        "id": "card",
        "type": "Card",
        "state": { "title": "Dashboard" },
        "children": [{ "id": "counter", "type": "Counter", "state": { "label": "Clicks", "count": 0 } }]
      }
    ]
  }
}
```

**② Renderer + ③ interactive UI** — register factories; containers recurse with `useRenderNode`:

```tsx
'use client'

import {
  SduiLayoutRenderer,
  useSduiNodeSubscription,
  useSduiLayoutAction,
  useRenderNode,
  type SduiLayoutDocument,
} from '@lodado/sdui-template'
import { z } from 'zod'

const counterSchema = z.object({ label: z.string(), count: z.number().default(0) })
const cardSchema = z.object({ title: z.string() })

function Container({ id }: { id: string }) {
  const { childrenIds } = useSduiNodeSubscription({ nodeId: id })
  const { renderChildren } = useRenderNode({ nodeId: id })
  return <section>{renderChildren(childrenIds)}</section>
}

function Card({ id }: { id: string }) {
  const { state, childrenIds } = useSduiNodeSubscription({ nodeId: id, schema: cardSchema })
  const { renderChildren } = useRenderNode({ nodeId: id })
  return (
    <article>
      <h2>{state.title}</h2>
      {renderChildren(childrenIds)}
    </article>
  )
}

function Counter({ id }: { id: string }) {
  const { state } = useSduiNodeSubscription({ nodeId: id, schema: counterSchema })
  const store = useSduiLayoutAction()

  return (
    <button type="button" onClick={() => store.updateNodeState(id, { count: state.count + 1 })}>
      {state.label}: {state.count}
    </button>
  )
}

const document: SduiLayoutDocument = {
  version: '1.0.0',
  root: {
    id: 'page',
    type: 'Container',
    children: [
      {
        id: 'card',
        type: 'Card',
        state: { title: 'Dashboard' },
        children: [{ id: 'counter', type: 'Counter', state: { label: 'Clicks', count: 0 } }],
      },
    ],
  },
}

export default function Page() {
  return (
    <SduiLayoutRenderer
      document={document}
      components={{
        Container: (id) => <Container id={id} />,
        Card: (id) => <Card id={id} />,
        Counter: (id) => <Counter id={id} />,
      }}
    />
  )
}
```

---

## Table of Contents

- [At a glance](#at-a-glance)
- [Installation](#installation)
- [Quick start](#quick-start)
- [Packages](#packages)
- [Philosophy](#philosophy)
- [Architecture](#architecture)
- [Document model](#document-model)
- [Node references](#node-references)
- [Component package](#component-package)
- [Development](#development)
- [When to use](#when-to-use)

---

## At a glance

| Capability              | Description                                                                       |
| ----------------------- | --------------------------------------------------------------------------------- |
| **Server-Driven UI**    | UI tree expressed as `SduiLayoutDocument` JSON                                    |
| **React renderer**      | `SduiLayoutRenderer` resolves registered component factories                      |
| **Typed state**         | Per-node `state` validated and inferred with Zod                                  |
| **Node subscriptions**  | Only changed nodes re-render — not the full tree                                  |
| **Node references**     | Nodes subscribe to other nodes' state changes                                     |
| **Recursive rendering** | Nested UI via `children` and `useRenderNode`                                      |
| **Next.js friendly**    | Works as client components in App Router                                          |
| **Monorepo**            | Core renderer, components, design tokens, and document editor split into packages |

---

## Installation

```bash
pnpm add @lodado/sdui-template zod@^4.3.6
# or
npm install @lodado/sdui-template zod@^4.3.6
```

With default UI components and design tokens:

```bash
pnpm add @lodado/sdui-template-component @lodado/sdui-design-files
```

> This repo targets **Zod v4**. Use a compatible version in your app.

---

## Quick start

```tsx
'use client'

import { SduiLayoutRenderer, type ComponentFactory, type SduiLayoutDocument } from '@lodado/sdui-template'

const document: SduiLayoutDocument = {
  version: '1.0.0',
  root: {
    id: 'root-card',
    type: 'Card',
    state: {
      title: 'Hello SDUI',
      body: 'This UI came from a JSON document.',
    },
  },
}

const CardFactory: ComponentFactory = (id) => <Card id={id} />

function Card({ id }: { id: string }) {
  return <article data-node-id={id}>Card node: {id}</article>
}

export default function Page() {
  return <SduiLayoutRenderer document={document} components={{ Card: CardFactory }} />
}
```

The server owns `document`. The client maps `type: 'Card'` to `components.Card`.

---

## Packages

| Package                                                               | npm                                                                                                                                       | Role                                                 |
| --------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------- |
| [`@lodado/sdui-template`](packages/sdui-template)                     | [![npm](https://img.shields.io/npm/v/@lodado/sdui-template.svg)](https://www.npmjs.com/package/@lodado/sdui-template)                     | SDUI renderer, store, hooks, schema, normalization   |
| [`@lodado/sdui-template-component`](packages/sdui-template-component) | [![npm](https://img.shields.io/npm/v/@lodado/sdui-template-component.svg)](https://www.npmjs.com/package/@lodado/sdui-template-component) | Radix UI component map (`sduiComponents`)            |
| [`@lodado/sdui-design-files`](packages/sdui-design-files)             | [![npm](https://img.shields.io/npm/v/@lodado/sdui-design-files.svg)](https://www.npmjs.com/package/@lodado/sdui-design-files)             | Design tokens and CSS variables (Atlassian DS)       |
| [`@lodado/sdui-document`](packages/sdui-document)                     | [![npm](https://img.shields.io/npm/v/@lodado/sdui-document.svg)](https://www.npmjs.com/package/@lodado/sdui-document)                     | Headless block document domain, patches, permissions |
| [`@lodado/sdui-document-react`](packages/sdui-document-react)         | [![npm](https://img.shields.io/npm/v/@lodado/sdui-document-react.svg)](https://www.npmjs.com/package/@lodado/sdui-document-react)         | Notion-like block editor (React + ProseMirror)       |
| `ssr-testing`                                                         | —                                                                                                                                         | Next.js SSR + Playwright E2E integration testbed     |
| `apps/docs`                                                           | —                                                                                                                                         | Storybook documentation (port 6006)                  |

**Which package do I need?**

- Layout JSON → React components → `@lodado/sdui-template`
- Ready-made Button/Dialog/Form map → `@lodado/sdui-template-component`
- Block document editing → `@lodado/sdui-document-react`
- Document domain only (no React) → `@lodado/sdui-document`

---

## Philosophy

### 1. The server sends screen intent, not JSX

SDUI documents are data — component names, state, children, and references. No arbitrary code over the wire.

### 2. The client renders only registered components

`type` maps to an explicit `components` registry. The server drives layout; the client controls rendering authority.

### 3. State is owned per node

| Field        | Purpose                           |
| ------------ | --------------------------------- |
| `state`      | Component data and behavior       |
| `attributes` | Style, className, HTML-like props |
| `children`   | Nested UI                         |
| `reference`  | Other node IDs to read/subscribe  |

### 4. Subscriptions beat full-tree re-renders

`SduiLayoutStore` + `SubscriptionManager` propagate node-level changes instead of re-rendering the entire tree.

### 5. Headless core, optional component layer

`@lodado/sdui-template` is the rendering engine. Bring your own design system, or use `@lodado/sdui-template-component` for a fast start.

---

## Architecture

```text
Server / CMS / Builder
        │
        │ SduiLayoutDocument (JSON)
        ▼
┌──────────────────────────────────────────┐
│ @lodado/sdui-template                     │
│  React layer: Renderer, Provider, hooks   │
│  Store layer: SduiLayoutStore, subs       │
│  Data layer: schema, normalize/denormalize│
└──────────────────────────────────────────┘
        │ ComponentFactory(id, parentPath)
        ▼
Consumer React Components
```

### Rendering flow

```text
1. Server/builder creates SduiLayoutDocument
2. SduiLayoutRenderer builds SduiLayoutStore
3. Document normalizes into id-keyed storage
4. renderNode walks from root
5. ComponentFactory resolved by type (with override priority)
6. useSduiNodeSubscription reads node state
7. store.updateNodeState patches a node
8. SubscriptionManager notifies only that node's subscribers
```

### Component resolution priority

1. `componentOverrides.byNodeId[node.id]`
2. `componentOverrides.byNodeType[node.type]`
3. `components[node.type]`
4. `defaultComponentFactory`

---

## Document model

```ts
interface SduiLayoutDocument {
  version: string
  metadata?: { id?: string; name?: string; description?: string; [key: string]: unknown }
  root: SduiLayoutNode
  variables?: Record<string, unknown>
}

interface SduiLayoutNode {
  id: string
  type: string
  state?: Record<string, unknown>
  attributes?: Record<string, unknown>
  children?: SduiLayoutNode[]
  reference?: string | string[]
}
```

Rules:

- `id` must be unique within the document
- `type` must match a registered component key
- Put component data in `state`, presentation props in `attributes`
- Nest UI with `children`; link nodes with `reference`

---

## Node references

```ts
const document = {
  version: '1.0.0',
  root: {
    id: 'root',
    type: 'Container',
    children: [
      { id: 'toggle', type: 'Toggle', state: { checked: false, label: 'Enable' } },
      { id: 'status', type: 'StatusText', reference: 'toggle' },
    ],
  },
}
```

```tsx
import { useSduiNodeReference } from '@lodado/sdui-template'

function StatusText({ id }: { id: string }) {
  const { referencedNodesMap } = useSduiNodeReference({ nodeId: id })
  const toggle = referencedNodesMap['toggle']
  return <p>Status: {toggle?.state.checked ? 'ON' : 'OFF'}</p>
}
```

Supports `string` or `string[]` references. Access via `referencedNodesMap[id]` (O(1)) or iterate `referencedNodes`.

---

## Component package

```tsx
'use client'

import { SduiLayoutRenderer } from '@lodado/sdui-template'
import { sduiComponents } from '@lodado/sdui-template-component'
import '@lodado/sdui-design-files/index.css'

export default function Page({ document }) {
  return <SduiLayoutRenderer document={document} components={sduiComponents} />
}
```

See [packages/sdui-template-component/README.md](packages/sdui-template-component/README.md) for the full component map.

---

## Development

pnpm workspace + Turborepo:

```bash
pnpm install
pnpm dev          # parallel dev across packages
pnpm storybook    # Storybook on port 6006
pnpm build
pnpm test
pnpm typecheck
pnpm lint
```

Per-package:

```bash
pnpm --filter @lodado/sdui-template test
pnpm --filter @lodado/sdui-document build
```

---

## When to use

- Admin dashboards or layouts configured from JSON
- Dynamic forms, cards, and lists driven by server config
- CMS/builder output rendered in a React app
- Per-node overrides for A/B tests or tenant-specific UI
- Design-system components with server-controlled layout decisions

## What this library does not do

- Data fetching, auth, or persistence policies (app responsibility)
- Final accessibility guarantees (component responsibility)
- Arbitrary HTML or server-delivered function execution

---

## License

MIT
