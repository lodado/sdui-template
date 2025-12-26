# @lodado/sdui-template

Server-Driven UI Template Library for React. A flexible and powerful template system for building server-driven user interfaces with dynamic layouts and components.

## Problem

Many applications require dynamically controlling UI structure and layout from the server. Common use cases include:

- **Dashboard Builders**: Users configure dashboards via drag-and-drop, and saved layouts are loaded from the server and rendered
- **Dynamic Form Generators**: Form structure is defined on the server and dynamically rendered on the client
- **Content Management Systems**: Administrators configure page layouts, and users see the same layout
- **A/B Testing**: Server sends different UI layouts for experimentation

In these situations, implementing state management, subscription systems, and component rendering logic from scratch for each new project is inefficient and error-prone.

## Solution

**SDUI (Server-Driven UI)** is a pattern where UI structure is defined on the server and dynamically rendered on the client. This library provides the core logic for implementing the SDUI pattern with:

- ✅ **Reusable**: Implement once, use across multiple projects
- ✅ **Performance Optimized**: Subscription-based re-rendering updates only changed nodes
- ✅ **Flexible**: Component overrides allow project-specific customization
- ✅ **Type Safe**: Full TypeScript support with optional Zod schema validation
- ✅ **Next.js Compatible**: Works seamlessly with Next.js App Router

## Features

- 🎯 **Server-Driven UI**: Define layouts from server-side configuration
- ⚡ **Performance Optimized**: ID-based subscription system for minimal re-renders
- 🔄 **Normalize/Denormalize**: Efficient data structure using normalizr
- 🎨 **Type Safe**: Full TypeScript support with optional Zod schema validation
- 🧩 **Modular**: Clean architecture with separated concerns
- 🚀 **Next.js Compatible**: Works seamlessly with Next.js App Router
- 🔧 **Flexible State Management**: Update component state programmatically
- 🔗 **Node References**: Reference other nodes to access their state and subscribe to changes

## Installation

```bash
npm install @lodado/sdui-template
# or
pnpm add @lodado/sdui-template
# or
yarn add @lodado/sdui-template
```

## Quick Start

### Basic Usage

```tsx
'use client'

import { SduiLayoutRenderer } from '@lodado/sdui-template'
import type { SduiLayoutDocument } from '@lodado/sdui-template'

// Define your SDUI document (typically received from server)
const document: SduiLayoutDocument = {
  version: '1.0.0',
  metadata: {
    id: 'my-layout',
    name: 'My Layout',
  },
  root: {
    id: 'root',
    type: 'Container',
    state: {},
    children: [
      {
        id: 'card-1',
        type: 'Card',
        state: {
          title: 'Card 1',
          content: 'First card content',
        },
      },
      {
        id: 'card-2',
        type: 'Card',
        state: {
          title: 'Card 2',
          content: 'Second card content',
        },
      },
    ],
  },
}

export default function Page() {
  return <SduiLayoutRenderer document={document} />
}
```

### Custom Components with State Management

```tsx
'use client'

import {
  SduiLayoutRenderer,
  useSduiNodeSubscription,
  useSduiLayoutAction,
  type ComponentFactory,
} from '@lodado/sdui-template'
import { z } from 'zod'

// Define state schema for type safety
const toggleStateSchema = z.object({
  checked: z.boolean(),
  label: z.string().optional(),
})

// Create your component
function Toggle({ id }: { id: string }) {
  const { state } = useSduiNodeSubscription({
    nodeId: id,
    schema: toggleStateSchema, // Optional: validates state structure
  })
  const store = useSduiLayoutAction()

  const handleToggle = () => {
    store.updateNodeState(id, {
      checked: !state.checked,
    })
  }

  return (
    <div className="flex items-center gap-2">
      {state.label && <label>{state.label}</label>}
      <button onClick={handleToggle}>{state.checked ? 'ON' : 'OFF'}</button>
    </div>
  )
}

// Define component factory
const ToggleFactory: ComponentFactory = (id) => <Toggle id={id} />

const document = {
  version: '1.0.0',
  root: {
    id: 'root',
    type: 'Container',
    state: {},
    children: [
      {
        id: 'toggle-1',
        type: 'Toggle',
        state: {
          checked: false,
          label: 'Enable notifications',
        },
      },
    ],
  },
}

export default function Page() {
  return <SduiLayoutRenderer document={document} components={{ Toggle: ToggleFactory }} />
}
```

### Complete Example: Toggle Component

Here's a complete example showing how to create an interactive component with state management:

```tsx
'use client'

import {
  SduiLayoutRenderer,
  useSduiNodeSubscription,
  useSduiLayoutAction,
  type ComponentFactory,
} from '@lodado/sdui-template'
import { z } from 'zod'

// 1. Define state schema
const toggleStateSchema = z.object({
  checked: z.boolean(),
  label: z.string().optional(),
})

// 2. Create component that subscribes to node state
function Toggle({ id }: { id: string }) {
  const { state } = useSduiNodeSubscription({
    nodeId: id,
    schema: toggleStateSchema, // Validates and types state
  })
  const store = useSduiLayoutAction()

  const handleToggle = () => {
    // Update state - only this component re-renders
    store.updateNodeState(id, {
      checked: !state.checked,
    })
  }

  return (
    <div className="flex items-center gap-2 p-3">
      {state.label && <label>{state.label}</label>}
      <button
        onClick={handleToggle}
        className={`w-11 h-6 rounded-full transition-colors ${state.checked ? 'bg-blue-600' : 'bg-gray-400'}`}
      >
        <span
          className={`block w-5 h-5 bg-white rounded-full transition-transform ${
            state.checked ? 'translate-x-5' : 'translate-x-0'
          }`}
        />
      </button>
    </div>
  )
}

// 3. Create component factory
const ToggleFactory: ComponentFactory = (id) => <Toggle id={id} />

// 4. Define SDUI document
const document = {
  version: '1.0.0',
  root: {
    id: 'root',
    type: 'Container',
    state: {},
    children: [
      {
        id: 'toggle-1',
        type: 'Toggle',
        state: {
          checked: false,
          label: 'Enable notifications',
        },
      },
      {
        id: 'toggle-2',
        type: 'Toggle',
        state: {
          checked: true,
          label: 'Dark mode',
        },
      },
    ],
  },
}

// 5. Render with component map
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

**Key Benefits:**

- ✅ Only the clicked toggle re-renders (performance optimized)
- ✅ Type-safe state with Zod validation
- ✅ Server controls initial state, client handles interactions
- ✅ Easy to extend with more components

### Node References

Nodes can reference other nodes to access their state and subscribe to changes. This is useful for components that need to display or react to other components' state.

```tsx
'use client'

import {
  SduiLayoutRenderer,
  useSduiNodeSubscription,
  useSduiNodeReference,
  useSduiLayoutAction,
  type ComponentFactory,
} from '@lodado/sdui-template'
import { z } from 'zod'

// Toggle state schema
const toggleStateSchema = z.object({
  checked: z.boolean(),
  label: z.string().optional(),
})

// Toggle component: manages its own state
function Toggle({ id }: { id: string }) {
  const { state } = useSduiNodeSubscription({
    nodeId: id,
    schema: toggleStateSchema,
  })
  const store = useSduiLayoutAction()

  const handleClick = () => {
    store.updateNodeState(id, { checked: !state.checked })
  }

  return (
    <div>
      <button onClick={handleClick}>{state.label || 'Toggle'}</button>
      <span>{state.checked ? 'ON' : 'OFF'}</span>
    </div>
  )
}

// StatusDisplay component: displays state from referenced toggle
function StatusDisplay({ id }: { id: string }) {
  const { referencedNodesMap } = useSduiNodeReference({
    nodeId: id,
    schema: toggleStateSchema, // Validates referenced node's state
  })

  // Access referenced node by ID
  const toggleNode = referencedNodesMap['toggle-node']

  if (!toggleNode) {
    return <div>No reference</div>
  }

  return (
    <div>
      <div>Status: {toggleNode.state.checked ? 'ON' : 'OFF'}</div>
      {toggleNode.state.label && <div>Label: {toggleNode.state.label}</div>}
    </div>
  )
}

const document = {
  version: '1.0.0',
  root: {
    id: 'root',
    type: 'Container',
    children: [
      {
        id: 'toggle-node',
        type: 'Toggle',
        state: {
          checked: false,
          label: 'Power',
        },
      },
      {
        id: 'status-display',
        type: 'StatusDisplay',
        reference: 'toggle-node', // Reference to toggle-node
      },
    ],
  },
}

export default function Page() {
  return (
    <SduiLayoutRenderer
      document={document}
      components={{
        Toggle: (id) => <Toggle id={id} />,
        StatusDisplay: (id) => <StatusDisplay id={id} />,
      }}
    />
  )
}
```

**Multiple References:**

You can also reference multiple nodes:

```tsx
const document = {
  version: '1.0.0',
  root: {
    id: 'root',
    type: 'Container',
    children: [
      {
        id: 'source-node',
        type: 'Card',
        reference: ['target-1', 'target-2'], // Multiple references
      },
      {
        id: 'target-1',
        type: 'Card',
        state: { count: 10 },
      },
      {
        id: 'target-2',
        type: 'Card',
        state: { count: 20 },
      },
    ],
  },
}

function Card({ id }: { id: string }) {
  const { referencedNodesMap, referencedNodes } = useSduiNodeReference({ nodeId: id })

  // Access by ID (O(1))
  const node1 = referencedNodesMap['target-1']
  const node2 = referencedNodesMap['target-2']

  // Or iterate over array
  return (
    <div>
      {referencedNodes.map((node) => (
        <div key={node.id}>Count: {String(node.state.count)}</div>
      ))}
    </div>
  )
}
```

**Key Benefits:**

- ✅ Automatically subscribes to referenced nodes' changes
- ✅ Type-safe access to referenced nodes' state
- ✅ Efficient O(1) access via `referencedNodesMap`
- ✅ Supports both single and multiple references

### Component Overrides

```tsx
'use client'

import { SduiLayoutRenderer, type ComponentFactory } from '@lodado/sdui-template'

const SpecialCardFactory: ComponentFactory = (id) => <div className="special-card">Special: {id}</div>

export default function Page() {
  return (
    <SduiLayoutRenderer
      document={document}
      componentOverrides={{
        // Override by node ID (highest priority)
        byNodeId: {
          'special-card-1': SpecialCardFactory,
        },
        // Override by node type
        byNodeType: {
          Card: CustomCardFactory,
        },
      }}
    />
  )
}
```

## API Reference

### Components

#### `SduiLayoutRenderer`

Main component for rendering SDUI layouts.

**Props:**

- `document: SduiLayoutDocument` - SDUI Layout Document (required)
- `components?: Record<string, ComponentFactory>` - Custom component map
- `componentOverrides?: { byNodeId?: Record<string, ComponentFactory>, byNodeType?: Record<string, ComponentFactory> }` - Component overrides
- `onLayoutChange?: (document: SduiLayoutDocument) => void` - Layout change callback
- `onError?: (error: Error) => void` - Error callback

#### `SduiLayoutProvider`

Context provider for SDUI Layout Store.

**Props:**

- `store: SduiLayoutStore` - Store instance
- `children: React.ReactNode` - Child components

### Hooks

#### `useSduiLayoutAction(): SduiLayoutStore`

Returns store instance for calling actions and accessing store state.

```tsx
const store = useSduiLayoutAction()
store.updateNodeState(nodeId, { count: 5 })

// Access store state directly (if needed)
const { rootId, nodes } = store.state
```

#### `useSduiNodeSubscription<T>(params: { nodeId: string, schema?: ZodSchema }): NodeData`

Subscribes to a specific node's changes and returns node information.

**Parameters:**

- `nodeId: string` - Node ID to subscribe to
- `schema?: ZodSchema` - Optional Zod schema for state validation and type inference

**Returns:**

- `node: SduiLayoutNode | undefined` - Node entity
- `type: string | undefined` - Node type
- `state: T` - Layout state (inferred from schema if provided, otherwise `BaseLayoutState`)
- `childrenIds: string[]` - Array of child node IDs
- `attributes: Record<string, unknown> | undefined` - Node attributes
- `reference: string | string[] | undefined` - Reference to other node(s)
- `exists: boolean` - Whether the node exists

```tsx
const { node, state, childrenIds, attributes, reference, exists } = useSduiNodeSubscription({
  nodeId: 'node-1',
  schema: baseLayoutStateSchema, // optional - validates and types state
})
```

#### `useSduiNodeReference<T>(params: { nodeId: string, schema?: ZodSchema }): ReferencedNodesData`

Accesses referenced nodes' information and subscribes to their changes. Use this hook when a node has a `reference` field pointing to other nodes.

**Parameters:**

- `nodeId: string` - Node ID that has a reference field
- `schema?: ZodSchema` - Optional Zod schema for referenced nodes' state validation and type inference

**Returns:**

- `referencedNodes: Array<ReferencedNodeInfo>` - Array of referenced node information (for iteration)
- `referencedNodesMap: Record<string, ReferencedNodeInfo>` - Map of referenced nodes by ID (for O(1) access)
- `reference: string | string[] | undefined` - Original reference value
- `hasReference: boolean` - Whether the node has any references

**ReferencedNodeInfo includes:**

- `id: string` - Referenced node ID
- `node: SduiLayoutNode | undefined` - Node entity
- `type: string | undefined` - Node type
- `state: T` - Layout state (inferred from schema if provided)
- `attributes: Record<string, unknown> | undefined` - Node attributes
- `exists: boolean` - Whether the node exists

```tsx
// Single reference
const { referencedNodesMap } = useSduiNodeReference({ nodeId: 'source-node' })
const targetNode = referencedNodesMap['target-node-id']
if (targetNode) {
  console.log(targetNode.state.title)
}

// Multiple references
const { referencedNodes, referencedNodesMap } = useSduiNodeReference({
  nodeId: 'source-node',
  schema: cardStateSchema, // optional - validates referenced nodes' state
})
referencedNodes.forEach((node) => {
  console.log(node.state.title)
})
// Or access by ID
const node1 = referencedNodesMap['target-1']
const node2 = referencedNodesMap['target-2']
```

#### `useRenderNode(componentMap?: Record<string, ComponentFactory>): RenderNodeFn`

Returns a function to render child nodes (internal use).

### Store

#### `SduiLayoutStore`

Main store class for managing SDUI layout state.

**Getters:**

- `state: SduiLayoutStoreState` - Current store state
- `nodes: Record<string, SduiLayoutNode>` - Node entities
- `layoutStates: Record<string, BaseLayoutState>` - Layout states
- `layoutAttributes: Record<string, Record<string, unknown>>` - Layout attributes
- `metadata: SduiLayoutDocument['metadata'] | undefined` - Document metadata
- `getComponentOverrides(): Record<string, ComponentFactory>` - Get component overrides

**Query Methods:**

- `getNodeById(nodeId: string): SduiLayoutNode | undefined` - Get node by ID
- `getNodeTypeById(nodeId: string): string | undefined` - Get node type by ID
- `getChildrenIdsById(nodeId: string): string[]` - Get children IDs by node ID
- `getLayoutStateById(nodeId: string): BaseLayoutState | undefined` - Get layout state by ID
- `getAttributesById(nodeId: string): Record<string, unknown> | undefined` - Get attributes by ID
- `getReferenceById(nodeId: string): string | string[] | undefined` - Get reference by node ID
- `getRootId(): string | undefined` - Get root node ID
- `getDocument(): SduiLayoutDocument | null` - Convert current state to document

**Update Methods:**

- `updateLayout(document: SduiLayoutDocument): void` - Update layout document
- `updateNodeState(nodeId: string, state: Partial<BaseLayoutState>): void` - Update node state
- `updateNodeAttributes(nodeId: string, attributes: Partial<Record<string, unknown>>): void` - Update node attributes
- `updateNodeReference(nodeId: string, reference: string | string[] | undefined): void` - Update node reference (set to undefined to remove)
- `updateVariables(variables: Record<string, unknown>): void` - Update global variables
- `updateVariable(key: string, value: unknown): void` - Update single variable
- `deleteVariable(key: string): void` - Delete variable
- `cancelEdit(documentId?: string): void` - Cancel edits and restore original document

**Selection Methods:**

- `setSelectedNodeId(nodeId?: string): void` - Set selected node ID

**Subscription Methods:**

- `subscribeNode(nodeId: string, callback: () => void): () => void` - Subscribe to node changes
- `subscribeVersion(callback: () => void): () => void` - Subscribe to global changes

**Utility Methods:**

- `reset(): void` - Reset store to initial state
- `clearCache(): void` - Clear cache and reset store

## TypeScript Types

All types are exported from the main package:

```tsx
import type {
  SduiLayoutDocument,
  SduiLayoutNode,
  BaseLayoutState,
  LayoutPosition,
  SduiDocument,
  SduiNode,
  ComponentFactory,
  RenderNodeFn,
  SduiLayoutStoreState,
  SduiLayoutStoreOptions,
  UseSduiNodeSubscriptionParams,
  NormalizedSduiEntities,
} from '@lodado/sdui-template'
```

## Architecture

This library uses a clean architecture with separated concerns:

- **SubscriptionManager**: Manages observer pattern for state changes
- **LayoutStateRepository**: Handles state storage and retrieval
- **DocumentManager**: Manages document caching and serialization
- **VariablesManager**: Manages global variables

## Performance

- Subscription-based re-renders ensure only changed nodes update
- Normalized data structure for efficient lookups
- Minimal bundle size (< 50KB gzipped)

## Next.js App Router

This library is designed to work with Next.js App Router. All React components include the `"use client"` directive and should be used in client components.

```tsx
// app/page.tsx
'use client'

import { SduiLayoutRenderer } from '@lodado/sdui-template'

export default function Page() {
  return <SduiLayoutRenderer document={document} />
}
```

## License

MIT
