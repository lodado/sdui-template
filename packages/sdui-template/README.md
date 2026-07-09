# @lodado/sdui-template

**Server-Driven UI template library for React — subscription-based rendering, normalized documents, and type-safe node references.**

[![npm version](https://img.shields.io/npm/v/@lodado/sdui-template.svg)](https://www.npmjs.com/package/@lodado/sdui-template)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![Node.js](https://img.shields.io/badge/Node.js-20%2B-339933?logo=node.js&logoColor=white)](https://nodejs.org/)
[![React](https://img.shields.io/badge/React-18%2B-61DAFB?logo=react&logoColor=white)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5%2B-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![GitHub stars](https://img.shields.io/github/stars/lodado/sdui-template?style=social)](https://github.com/lodado/sdui-template/stargazers)

[![SDUI](https://img.shields.io/badge/SDUI-Server--Driven%20UI-2563EB)](https://github.com/lodado/sdui-template)
[![Next.js](https://img.shields.io/badge/Next.js-App%20Router-000000?logo=next.js&logoColor=white)](https://nextjs.org/)
[![Zod](https://img.shields.io/badge/Zod-v4-3E63DD)](https://zod.dev/)

[Quick start](#quick-start) · [Features](#features) · [Hooks](#hooks) · [Store API](#store) · [Architecture](#architecture) · [Next.js](#nextjs-app-router)

---

Define UI structure in JSON on the server; render and interact on the client with minimal re-renders. Only changed nodes update thanks to ID-based subscriptions.

```
SduiLayoutDocument → normalize → SduiLayoutRenderer → subscribed components
                              ↑ updateNodeState (patch)
```

### End-to-end example

| **① server JSON** | →   | **② renderer** | →   | **③ interactive component** |
| ----------------- | --- | -------------- | --- | --------------------------- |

```tsx
'use client'

import {
  SduiLayoutRenderer,
  useSduiNodeSubscription,
  useSduiLayoutAction,
  type ComponentFactory,
} from '@lodado/sdui-template'
import { z } from 'zod'

const toggleSchema = z.object({ checked: z.boolean(), label: z.string().optional() })

function Toggle({ id }: { id: string }) {
  const { state } = useSduiNodeSubscription({ nodeId: id, schema: toggleSchema })
  const store = useSduiLayoutAction()

  return (
    <button onClick={() => store.updateNodeState(id, { checked: !state.checked })}>
      {state.label}: {state.checked ? 'ON' : 'OFF'}
    </button>
  )
}

const document = {
  version: '1.0.0',
  root: {
    id: 'root',
    type: 'Container',
    children: [{ id: 'toggle-1', type: 'Toggle', state: { checked: false, label: 'Notifications' } }],
  },
}

export default function Page() {
  return <SduiLayoutRenderer document={document} components={{ Toggle: (id) => <Toggle id={id} /> }} />
}
```

Only the clicked toggle re-renders. Server controls initial state; client handles interactions.

---

## Table of Contents

- [Why this exists](#why-this-exists)
- [Features](#features)
- [Installation](#installation)
- [Quick start](#quick-start)
- [Node references](#node-references)
- [Component overrides](#component-overrides)
- [API Reference](#api-reference)
- [TypeScript types](#typescript-types)
- [Architecture](#architecture)
- [Performance](#performance)
- [Next.js App Router](#nextjs-app-router)

---

## Why this exists

Many apps need server-controlled UI structure:

| Use case           | What the server controls             |
| ------------------ | ------------------------------------ |
| Dashboard builders | Widget layout from saved config      |
| Dynamic forms      | Field structure and validation rules |
| CMS page builders  | Page layout for all users            |
| A/B testing        | Layout variants per experiment       |

Building subscription systems, normalization, and render logic per project is slow and error-prone. This library implements the SDUI pattern once, reusable everywhere.

## Features

| Feature                | Description                                       |
| ---------------------- | ------------------------------------------------- |
| Subscription rendering | ID-based observers — only changed nodes re-render |
| Normalized store       | `normalizr`-based entities for O(1) lookups       |
| Type safety            | Full TypeScript + optional Zod schema validation  |
| Node references        | Components subscribe to other nodes' state        |
| Component overrides    | Override by node ID or type                       |
| Next.js compatible     | `'use client'` components for App Router          |

---

## Installation

```bash
pnpm add @lodado/sdui-template zod@^4.3.6
# or
npm install @lodado/sdui-template zod@^4.3.6
```

Peer dependencies: `react`, `react-dom`, `zod@^4.3.6`

---

## Quick start

### Basic render

```tsx
'use client'

import { SduiLayoutRenderer, type SduiLayoutDocument } from '@lodado/sdui-template'

const document: SduiLayoutDocument = {
  version: '1.0.0',
  metadata: { id: 'my-layout', name: 'My Layout' },
  root: {
    id: 'root',
    type: 'Container',
    state: {},
    children: [
      { id: 'card-1', type: 'Card', state: { title: 'Card 1', content: 'First card' } },
      { id: 'card-2', type: 'Card', state: { title: 'Card 2', content: 'Second card' } },
    ],
  },
}

export default function Page() {
  return <SduiLayoutRenderer document={document} />
}
```

### Custom components with state

```tsx
'use client'

import {
  SduiLayoutRenderer,
  useSduiNodeSubscription,
  useSduiLayoutAction,
  type ComponentFactory,
} from '@lodado/sdui-template'
import { z } from 'zod'

const toggleStateSchema = z.object({
  checked: z.boolean(),
  label: z.string().optional(),
})

function Toggle({ id }: { id: string }) {
  const { state } = useSduiNodeSubscription({ nodeId: id, schema: toggleStateSchema })
  const store = useSduiLayoutAction()

  return (
    <div className="flex items-center gap-2">
      {state.label && <label>{state.label}</label>}
      <button onClick={() => store.updateNodeState(id, { checked: !state.checked })}>
        {state.checked ? 'ON' : 'OFF'}
      </button>
    </div>
  )
}

const ToggleFactory: ComponentFactory = (id) => <Toggle id={id} />

export default function Page() {
  return (
    <SduiLayoutRenderer
      document={document}
      components={{ Toggle: ToggleFactory }}
      onError={(error) => console.error('SDUI Error:', error)}
    />
  )
}
```

---

## Node references

Nodes can reference other nodes to access and subscribe to their state:

```tsx
function StatusDisplay({ id }: { id: string }) {
  const { referencedNodesMap } = useSduiNodeReference({
    nodeId: id,
    schema: toggleStateSchema,
  })
  const toggle = referencedNodesMap['toggle-node']
  if (!toggle) return <div>No reference</div>
  return <div>Status: {toggle.state.checked ? 'ON' : 'OFF'}</div>
}

const document = {
  version: '1.0.0',
  root: {
    id: 'root',
    type: 'Container',
    children: [
      { id: 'toggle-node', type: 'Toggle', state: { checked: false, label: 'Power' } },
      { id: 'status-display', type: 'StatusDisplay', reference: 'toggle-node' },
    ],
  },
}
```

**Multiple references:**

```tsx
{ id: 'source', type: 'Card', reference: ['target-1', 'target-2'] }
```

Access via `referencedNodesMap['target-1']` (O(1)) or iterate `referencedNodes`.

---

## Component overrides

```tsx
<SduiLayoutRenderer
  document={document}
  componentOverrides={{
    byNodeId: { 'special-card-1': SpecialCardFactory },
    byNodeType: { Card: CustomCardFactory },
  }}
/>
```

Priority: `byNodeId` > `byNodeType` > `components` map.

---

## API Reference

### Components

#### `SduiLayoutRenderer`

| Prop                  | Type                               | Description              |
| --------------------- | ---------------------------------- | ------------------------ |
| `document`            | `SduiLayoutDocument`               | SDUI document (required) |
| `components?`         | `Record<string, ComponentFactory>` | Custom component map     |
| `componentOverrides?` | `{ byNodeId?, byNodeType? }`       | Override factories       |
| `onLayoutChange?`     | `(document) => void`               | Layout change callback   |
| `onError?`            | `(error) => void`                  | Error callback           |

#### `SduiLayoutProvider`

| Prop       | Type              | Description      |
| ---------- | ----------------- | ---------------- |
| `store`    | `SduiLayoutStore` | Store instance   |
| `children` | `React.ReactNode` | Child components |

### Hooks

#### `useSduiLayoutAction(): SduiLayoutStore`

```tsx
const store = useSduiLayoutAction()
store.updateNodeState(nodeId, { count: 5 })
```

#### `useSduiNodeSubscription<T>({ nodeId, schema? })`

| Return        | Description         |
| ------------- | ------------------- |
| `node`        | Node entity         |
| `type`        | Node type string    |
| `state`       | Typed layout state  |
| `childrenIds` | Child node IDs      |
| `attributes`  | Node attributes     |
| `reference`   | Reference target(s) |
| `exists`      | Whether node exists |

#### `useSduiNodeReference<T>({ nodeId, schema? })`

| Return               | Description                   |
| -------------------- | ----------------------------- |
| `referencedNodes`    | Array of referenced node info |
| `referencedNodesMap` | Map by ID (O(1) access)       |
| `reference`          | Original reference value      |
| `hasReference`       | Whether references exist      |

#### `useRenderNode({ nodeId, componentMap?, parentPath? })`

Returns `{ renderNode, currentPath, pathString, nodeId, parentPath }` for recursive container rendering:

```tsx
function Container({ id }: { id: string }) {
  const { childrenIds } = useSduiNodeSubscription({ nodeId: id })
  const { renderNode, currentPath } = useRenderNode({ nodeId: id })

  return (
    <div>
      {childrenIds.map((childId) => (
        <div key={childId}>{renderNode(childId, currentPath)}</div>
      ))}
    </div>
  )
}
```

### Store

#### `SduiLayoutStore`

**Getters:** `state`, `nodes`, `layoutStates`, `layoutAttributes`, `metadata`, `getComponentOverrides()`

**Query:** `getNodeById`, `getNodeTypeById`, `getChildrenIdsById`, `getLayoutStateById`, `getAttributesById`, `getReferenceById`, `getRootId`, `getDocument`

**Update:** `updateLayout`, `updateNodeState`, `updateNodeAttributes`, `updateNodeReference`, `updateVariables`, `updateVariable`, `deleteVariable`, `cancelEdit`

**Selection:** `setSelectedNodeId`

**Subscribe:** `subscribeNode`, `subscribeVersion`

**Utility:** `reset`, `clearCache`

---

## TypeScript types

```tsx
import type {
  SduiLayoutDocument,
  SduiLayoutNode,
  BaseLayoutState,
  ComponentFactory,
  RenderNodeFn,
  SduiLayoutStoreState,
  SduiLayoutStoreOptions,
  UseSduiNodeSubscriptionParams,
  NormalizedSduiEntities,
} from '@lodado/sdui-template'
```

### Document schema

```typescript
interface SduiLayoutDocument {
  version: string
  metadata?: { id?, name?, ... }
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

---

## Architecture

```text
SduiLayoutStore (Facade)
├── SubscriptionManager    # Observer pattern for node subscriptions
├── LayoutStateRepository  # Normalized state storage
├── DocumentManager        # Document caching and serialization
└── VariablesManager       # Global variables
```

Data flow:

1. Document JSON → normalized entities (`nodes` map + `rootId`)
2. `SduiLayoutRenderer` traverses nodes via `renderNode`
3. `store.updateNodeState(id, state)` → notifies only that node's subscribers
4. Container components use `useRenderNode` + `childrenIds` for recursive rendering

---

## Performance

- Subscription-based re-renders — only changed nodes update
- Normalized data structure for O(1) lookups
- Minimal bundle size (< 50KB gzipped)

---

## Next.js App Router

All React exports use `'use client'`. Use in client components:

```tsx
// app/page.tsx
'use client'

import { SduiLayoutRenderer } from '@lodado/sdui-template'

export default function Page() {
  return <SduiLayoutRenderer document={document} />
}
```

---

## License

MIT
