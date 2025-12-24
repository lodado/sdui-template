# @lodado/sdui-template

> ⚠️ **For personal use - Feel free to use as you like**

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

## Installation

```bash
npm install @lodado/sdui-template
# or
pnpm add @lodado/sdui-template
# or
yarn add @lodado/sdui-template
```

## Schema Reference

### SduiLayoutDocument Structure

The `SduiLayoutDocument` is the root structure that defines your entire UI layout. Here's what each field means:

```typescript
interface SduiLayoutDocument {
  version: string // Required: Schema version (e.g., "1.0.0")
  metadata?: {
    // Optional: Document metadata
    id?: string // Document identifier
    name?: string // Document name
    description?: string // Document description
    createdAt?: string // ISO 8601 timestamp
    updatedAt?: string // ISO 8601 timestamp
    author?: string // Author information
  }
  root: SduiLayoutNode // Required: Root node of the layout tree
  variables?: Record<string, unknown> // Optional: Global variables accessible to all nodes
}
```

### SduiLayoutNode Structure

Each node in the layout tree follows this structure:

```typescript
interface SduiLayoutNode {
  id: string // Required: Unique identifier for this node
  type: string // Required: Component type (e.g., "Container", "Card", "Toggle")
  state?: Record<string, unknown> // Optional: Component state (auto-filled as {} if omitted)
  attributes?: {
    // Optional: CSS styling attributes (auto-filled as {} if omitted)
    style?: Record<string, string | number> // Inline styles
    className?: string // CSS class names
  }
  children?: SduiLayoutNode[] // Optional: Child nodes (recursive structure)
}
```

### Field Details

#### Required Fields

- **`id`** (string): Unique identifier for the node. Must be unique within the document.
- **`type`** (string): Component type that determines which React component will render this node. Must match a component factory in your `components` prop or `componentMap`.

#### Optional Fields (Auto-filled)

- **`state`** (Record<string, unknown>): Component-specific state data. If omitted, automatically set to `{}` during normalization. Use this for:

  - Component configuration (e.g., `{ title: "Card Title", content: "..." }`)
  - UI state (e.g., `{ checked: true, value: 42 }`)
  - Any custom data your component needs

- **`attributes`** (object): CSS styling attributes. If omitted, automatically set to `{}` during normalization. Use this for:

  - `style`: Inline CSS styles (e.g., `{ backgroundColor: "red", padding: "10px" }`)
  - `className`: CSS class names (e.g., `"card-container primary"`)

- **`children`** (SduiLayoutNode[]): Array of child nodes. Omit for leaf nodes.

### Best Practices

1. **Minimal Required Fields**: You only need `id` and `type` for each node. `state` and `attributes` are automatically handled if omitted.

```tsx
// ✅ Minimal - state and attributes auto-filled
const node = {
  id: 'card-1',
  type: 'Card',
}

// ✅ With state - for components that need data
const nodeWithState = {
  id: 'card-1',
  type: 'Card',
  state: {
    title: 'My Card',
    content: 'Card content here',
  },
}

// ✅ With attributes - for styling
const nodeWithStyle = {
  id: 'card-1',
  type: 'Card',
  attributes: {
    className: 'custom-card',
    style: { padding: '20px' },
  },
}
```

1. **Unique IDs**: Ensure all node IDs are unique within the document.
2. **Type Matching**: Node `type` must match a component factory you provide via the `components` prop.

## Quick Start

### Basic Usage

```tsx
'use client'

import { SduiLayoutRenderer } from '@lodado/sdui-template'
import type { SduiLayoutDocument } from '@lodado/sdui-template'

// Define your SDUI document (typically received from server)
// Note: state and attributes are optional - they're auto-filled as {} if omitted
const document: SduiLayoutDocument = {
  version: '1.0.0',
  metadata: {
    id: 'my-layout',
    name: 'My Layout',
  },
  root: {
    id: 'root',
    type: 'Container',
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
- `state: T` - Layout state (inferred from schema if provided, otherwise `Record<string, unknown>`)
- `childrenIds: string[]` - Array of child node IDs
- `attributes: Record<string, unknown> | undefined` - Node attributes
- `exists: boolean` - Whether the node exists

```tsx
const { node, state, childrenIds, attributes, exists } = useSduiNodeSubscription({
  nodeId: 'node-1',
  schema: baseLayoutStateSchema, // optional - validates and types state
})
```

#### `useRenderNode(componentMap?: Record<string, ComponentFactory>): RenderNodeFn`

Returns a function to render child nodes (internal use).

### Store

#### `SduiLayoutStore`

Main store class for managing SDUI layout state.

**Getters:**

- `state: SduiLayoutStoreState` - Current store state
- `nodes: Record<string, SduiLayoutNode>` - Node entities
- `metadata: SduiLayoutDocument['metadata'] | undefined` - Document metadata
- `getComponentOverrides(): Record<string, ComponentFactory>` - Get component overrides

**Query Methods:**

- `getNodeById(nodeId: string): SduiLayoutNode` - Get node by ID (throws `NodeNotFoundError` if not found)
- `getNodeTypeById(nodeId: string): string` - Get node type by ID (throws `NodeNotFoundError` if not found)
- `getChildrenIdsById(nodeId: string): string[]` - Get children IDs by node ID (throws `NodeNotFoundError` if not found)
- `getLayoutStateById(nodeId: string): Record<string, unknown>` - Get layout state by ID (returns `{}` if not set, throws `NodeNotFoundError` if node not found)
- `getAttributesById(nodeId: string): Record<string, unknown>` - Get attributes by ID (returns `{}` if not set, throws `NodeNotFoundError` if node not found)
- `getRootId(): string` - Get root node ID (throws `RootNotFoundError` if not found)
- `getDocument(): SduiLayoutDocument | null` - Convert current state to document

**Update Methods:**

- `updateLayout(document: SduiLayoutDocument): void` - Update layout document
- `updateNodeState(nodeId: string, state: Partial<Record<string, unknown>>): void` - Update node state
- `updateNodeAttributes(nodeId: string, attributes: Partial<Record<string, unknown>>): void` - Update node attributes
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
