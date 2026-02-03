# @lodado/sdui-template

> ⚠️ **For personal use - Feel free to use as you like**

**Server-Driven UI Template Library for React** - A flexible and powerful template system for building server-driven user interfaces with dynamic layouts and components.

## 📖 What is This?

**SDUI (Server-Driven UI)** is a pattern where your server defines the UI structure, and your React app renders it dynamically. Instead of hardcoding components, you receive a JSON document from your server that describes what to render.

### Real-World Examples

- **Dashboard Builders**: Users drag-and-drop widgets, layouts are saved to the server, then loaded and rendered
- **Dynamic Forms**: Form structure comes from the server, client just renders it
- **CMS Page Builder**: Admins design pages, users see the same layout
- **A/B Testing**: Server sends different UI layouts for experiments

### The Problem

Building these features from scratch means:

- ❌ Reimplementing state management for each project
- ❌ Building subscription systems for efficient updates
- ❌ Writing component rendering logic repeatedly
- ❌ Dealing with performance issues (unnecessary re-renders)

### The Solution

This library provides:

- ✅ **Reusable**: Write once, use everywhere
- ✅ **Fast**: Only changed components re-render (subscription-based)
- ✅ **Flexible**: Override components per project
- ✅ **Type Safe**: Full TypeScript + optional Zod validation
- ✅ **Next.js Ready**: Works seamlessly with App Router

## ✨ Features

- 🎯 **Server-Driven UI**: Define layouts from server JSON
- ⚡ **Performance**: ID-based subscriptions = minimal re-renders
- 🔄 **Normalize/Denormalize**: Efficient data structure (normalizr)
- 🎨 **Type Safe**: TypeScript + Zod schema validation
- 🧩 **Modular**: Clean, separated architecture
- 🚀 **Next.js Compatible**: Built for App Router
- 🔧 **State Management**: Update component state programmatically
- 🔗 **Node References**: Reference other nodes to access their state and subscribe to changes

## 📦 Installation

```bash
npm install @lodado/sdui-template zod
# or
pnpm add @lodado/sdui-template zod
# or
yarn add @lodado/sdui-template zod
```

This package uses the latest **zod v4** types. Install a compatible Zod version:

```bash
pnpm add zod@^4.3.6
# or
npm install zod@^4.3.6
# or
yarn add zod@^4.3.6
```

## 🚀 Quick Start

### Step 1: Basic Rendering

The simplest way to use this library - just pass a document:

```tsx
'use client'

import { SduiLayoutRenderer } from '@lodado/sdui-template'
import type { SduiLayoutDocument } from '@lodado/sdui-template'

// This document typically comes from your server API
const document: SduiLayoutDocument = {
  version: '1.0.0',
  root: {
    id: 'root',
    type: 'Container',
    children: [
      {
        id: 'card-1',
        type: 'Card',
        state: {
          title: 'Hello World',
          content: 'This is a card component',
        },
      },
    ],
  },
}

export default function Page() {
  return <SduiLayoutRenderer document={document} />
}
```

**What's happening?**

- The `document` describes your UI structure
- `SduiLayoutRenderer` reads it and renders components
- Each node has an `id` (unique identifier) and `type` (component name)
- `state` contains data your component needs

### Step 2: Create Your Own Components

Now let's create a custom component that can handle state:

```tsx
'use client'

import {
  SduiLayoutRenderer,
  useSduiNodeSubscription,
  useSduiLayoutAction,
  type ComponentFactory,
} from '@lodado/sdui-template'
import { z } from 'zod'

// 1. Define what your component's state looks like
const cardStateSchema = z.object({
  title: z.string(),
  content: z.string(),
  count: z.number().optional(),
})

// 2. Create your component
function Card({ id }: { id: string }) {
  // Subscribe to this node's state changes
  const { state } = useSduiNodeSubscription({
    nodeId: id,
    schema: cardStateSchema, // Validates and types the state
  })

  // Get the store to update state
  const store = useSduiLayoutAction()

  const handleClick = () => {
    // Update state - only this card re-renders!
    store.updateNodeState(id, {
      count: (state.count || 0) + 1,
    })
  }

  return (
    <div className="card">
      <h2>{state.title}</h2>
      <p>{state.content}</p>
      {state.count !== undefined && <p>Clicked: {state.count} times</p>}
      <button onClick={handleClick}>Click me</button>
    </div>
  )
}

// 3. Create a factory function (tells the library how to render your component)
const CardFactory: ComponentFactory = (id) => <Card id={id} />

// 4. Define your document
const document: SduiLayoutDocument = {
  version: '1.0.0',
  root: {
    id: 'root',
    type: 'Container',
    children: [
      {
        id: 'card-1',
        type: 'Card',
        state: {
          title: 'My First Card',
          content: 'This card can update its own state!',
          count: 0,
        },
      },
    ],
  },
}

// 5. Render with your component map
export default function Page() {
  return <SduiLayoutRenderer document={document} components={{ Card: CardFactory }} />
}
```

**Key Points:**

- `useSduiNodeSubscription`: Subscribe to a node's state (auto re-renders on changes)
- `useSduiLayoutAction`: Get the store to update state
- `ComponentFactory`: Function that creates your component
- `components` prop: Maps component types to factories

### Step 3: Complete Example - Toggle Component

Here's a full example with a toggle switch:

```tsx
'use client'

import {
  SduiLayoutRenderer,
  useSduiNodeSubscription,
  useSduiLayoutAction,
  type ComponentFactory,
} from '@lodado/sdui-template'
import { z } from 'zod'

// Define state schema
const toggleStateSchema = z.object({
  checked: z.boolean(),
  label: z.string().optional(),
})

// Create toggle component
function Toggle({ id }: { id: string }) {
  const { state } = useSduiNodeSubscription({
    nodeId: id,
    schema: toggleStateSchema,
  })
  const store = useSduiLayoutAction()

  const handleToggle = () => {
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

// Create factory
const ToggleFactory: ComponentFactory = (id) => <Toggle id={id} />

// Document with multiple toggles
const document: SduiLayoutDocument = {
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

**Why This Works:**

- ✅ Clicking one toggle only re-renders that toggle (performance!)
- ✅ Type-safe state with Zod validation
- ✅ Server controls initial state, client handles interactions
- ✅ Easy to add more components

### Step 4: Node References

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
  // Note: Consider managing node IDs as constants instead of hardcoded strings
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

const document: SduiLayoutDocument = {
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
const document: SduiLayoutDocument = {
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
  // Note: Consider managing node IDs as constants instead of hardcoded strings
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

### Step 5: Recursive Rendering - Container with Children

When you have nested structures (like a Container with Cards inside), you need to recursively render children. Here's how:

```tsx
'use client'

import {
  SduiLayoutRenderer,
  useSduiNodeSubscription,
  useRenderNode,
  type ComponentFactory,
} from '@lodado/sdui-template'

// 1. Create a Container component that renders its children
function Container({ id, parentPath = [] }: { id: string; parentPath?: string[] }) {
  const { childrenIds } = useSduiNodeSubscription({ nodeId: id })
  const { renderChildren } = useRenderNode({ nodeId: id, parentPath })

  return (
    <div className="container p-4 border-2 border-gray-300 rounded-lg">
      <h3 className="mb-2">Container: {id}</h3>
      <div className="flex flex-col gap-2">
        {/* Recursively render each child */}
        {renderChildren(childrenIds)}
      </div>
    </div>
  )
}

// 2. Create a simple Card component
function Card({ id }: { id: string }) {
  const { state } = useSduiNodeSubscription({ nodeId: id })

  return (
    <div className="card p-3 bg-blue-100 rounded">
      <h4>{state.title || `Card ${id}`}</h4>
      {state.content && <p>{state.content}</p>}
    </div>
  )
}

// 3. Create factories
const ContainerFactory: ComponentFactory = (id, _renderNode, parentPath) => (
  <Container id={id} parentPath={parentPath} />
)
const CardFactory: ComponentFactory = (id) => <Card id={id} />

// 4. Document with nested structure
const document: SduiLayoutDocument = {
  version: '1.0.0',
  root: {
    id: 'root',
    type: 'Container',
    children: [
      {
        id: 'card-1',
        type: 'Card',
        state: {
          title: 'First Card',
          content: 'This is inside the root container',
        },
      },
      {
        id: 'container-1',
        type: 'Container',
        children: [
          {
            id: 'card-2',
            type: 'Card',
            state: {
              title: 'Nested Card',
              content: 'This card is inside a nested container',
            },
          },
          {
            id: 'card-3',
            type: 'Card',
            state: {
              title: 'Another Nested Card',
              content: 'Also inside the nested container',
            },
          },
        ],
      },
    ],
  },
}

export default function Page() {
  return (
    <SduiLayoutRenderer
      document={document}
      components={{
        Container: ContainerFactory,
        Card: CardFactory,
      }}
    />
  )
}
```

**How Recursive Rendering Works:**

1. **`useSduiNodeSubscription`**: Gets `childrenIds` array for the current node
2. **`useRenderNode`**: Returns an object with `renderChildren`, `renderNode`, and `currentPath` (automatically calculated)
3. **Map over children**: Pass `childrenIds` to `renderChildren(childrenIds)` for keyed child rendering
4. **Automatic recursion**: Each child renders itself, and if it has children, it renders them too!

**Result Structure:**

```text
Container (root)
  ├── Card (card-1)
  └── Container (container-1)
      ├── Card (card-2)
      └── Card (card-3)
```

**Key Points:**

- ✅ `useRenderNode({ nodeId, parentPath })` returns `renderChildren`, `renderNode`, and `currentPath` (automatically calculated)
- ✅ `childrenIds` tells you which nodes are children of the current node
- ✅ `renderChildren(childrenIds)` handles parent path tracking and keys for you
- ✅ Each component handles its own children, creating natural recursion
- ✅ Works with any nesting depth automatically

## 📋 Understanding the Schema

### Document Structure

Your SDUI document is a JSON object that describes your entire UI:

```typescript
interface SduiLayoutDocument {
  version: string // Required: Schema version (e.g., "1.0.0")
  metadata?: {
    // Optional: Document info
    id?: string // Document identifier
    name?: string // Document name
    description?: string // Description
    createdAt?: string // ISO 8601 timestamp
    updatedAt?: string // ISO 8601 timestamp
    author?: string // Author info
  }
  root: SduiLayoutNode // Required: Root node (your UI tree starts here)
  variables?: Record<string, unknown> // Optional: Global variables for all nodes
}
```

### Node Structure

Each node in your UI tree:

```typescript
interface SduiLayoutNode {
  id: string // Required: Unique ID (must be unique in document)
  type: string // Required: Component type (must match your component map)
  state?: Record<string, unknown> // Optional: Component data (auto-filled as {} if omitted)
  attributes?: Record<string, unknown> // Optional: CSS/styling (auto-filled as {} if omitted)
  children?: SduiLayoutNode[] // Optional: Child nodes (for nested structures)
  reference?: string | string[] // Optional: Reference to other node(s) by ID
}
```

### What Each Field Does

#### Required Fields

- **`id`** (string): Unique identifier. Like a React `key`, but for your entire document.
- **`type`** (string): Component name. Must match a key in your `components` prop.

#### Optional Fields (Auto-filled if omitted)

- **`state`**: Component data. Examples:

  ```tsx
  state: {
    title: 'Card Title',        // Text content
    count: 42,                  // Numbers
    checked: true,              // Booleans
    items: ['a', 'b', 'c'],    // Arrays
    config: { theme: 'dark' },  // Objects
  }
  ```

  If you omit it, it becomes `{}` automatically.

- **`attributes`**: CSS styling. Examples:

  ```tsx
  attributes: {
    className: 'my-card primary',           // CSS classes
    style: { padding: '20px', color: 'red' }, // Inline styles
    'data-testid': 'card-1',               // Data attributes
  }
  ```

  If you omit it, it becomes `{}` automatically.

- **`children`**: Child nodes. Omit for leaf nodes (components with no children).

### Minimal Example

You only need `id` and `type` - everything else is optional:

```tsx
// ✅ This works! state and attributes are auto-filled as {}
const minimalNode = {
  id: 'card-1',
  type: 'Card',
}

// ✅ With state (for components that need data)
const nodeWithData = {
  id: 'card-1',
  type: 'Card',
  state: {
    title: 'My Card',
  },
}

// ✅ With children (for nested structures)
const nodeWithChildren = {
  id: 'container-1',
  type: 'Container',
  children: [
    { id: 'card-1', type: 'Card' },
    { id: 'card-2', type: 'Card' },
  ],
}
```

### Best Practices

1. **Keep IDs unique**: Every node needs a unique `id` within the document
2. **Match types**: Node `type` must exist in your `components` prop
3. **Use state for data**: Put component data in `state`, not `attributes`
4. **Use attributes for styling**: CSS classes and styles go in `attributes`

## 🎛️ Component Overrides

Override components by ID or type:

```tsx
'use client'

import { SduiLayoutRenderer, type ComponentFactory } from '@lodado/sdui-template'

// Special component for a specific node
const SpecialCardFactory: ComponentFactory = (id) => <div className="special-card">Special: {id}</div>

// Override for all Card types
const CustomCardFactory: ComponentFactory = (id) => <div className="custom-card">Custom: {id}</div>

export default function Page() {
  return (
    <SduiLayoutRenderer
      document={document}
      componentOverrides={{
        // Highest priority: Override by node ID
        byNodeId: {
          'special-card-1': SpecialCardFactory,
        },
        // Second priority: Override by node type
        byNodeType: {
          Card: CustomCardFactory,
        },
      }}
    />
  )
}
```

**Priority Order:**

1. `byNodeId` (highest) - Specific node overrides
2. `byNodeType` - Type-based overrides
3. `components` prop - Default component map
4. `defaultComponentFactory` - Fallback (shows node info)

## 📚 API Reference

### Components

#### `SduiLayoutRenderer`

Main component that renders your SDUI document.

**Props:**

| Prop                 | Type                                | Required | Description                   |
| -------------------- | ----------------------------------- | -------- | ----------------------------- |
| `document`           | `SduiLayoutDocument`                | ✅       | Your SDUI document            |
| `components`         | `Record<string, ComponentFactory>`  | ❌       | Component factory map         |
| `componentOverrides` | `{ byNodeId?, byNodeType? }`        | ❌       | Override specific nodes/types |
| `onLayoutChange`     | `(doc: SduiLayoutDocument) => void` | ❌       | Called when layout changes    |
| `onError`            | `(error: Error) => void`            | ❌       | Called on errors              |

**Example:**

```tsx
<SduiLayoutRenderer
  document={myDocument}
  components={{ Card: CardFactory, Toggle: ToggleFactory }}
  onError={(error) => console.error(error)}
/>
```

#### `SduiLayoutProvider`

Context provider (usually used internally, but available if needed).

**Props:**

- `store: SduiLayoutStore` - Store instance
- `children: React.ReactNode` - Child components

### Hooks

#### `useSduiLayoutAction(): SduiLayoutStore`

Get the store to update state and access store data.

```tsx
const store = useSduiLayoutAction()

// Update a node's state
store.updateNodeState('node-1', { count: 5 })

// Access store state
const { rootId, nodes } = store.state
```

#### `useSduiNodeSubscription<T>(params): NodeData`

Subscribe to a node's changes. Returns node info and auto re-renders when the node changes.

**Parameters:**

- `nodeId: string` - The node ID to subscribe to
- `schema?: ZodSchema` - Optional Zod schema for validation and type inference

**Returns:**

```typescript
{
  node: SduiLayoutNode | undefined      // Full node object
  type: string | undefined              // Node type
  state: T                              // Node state (typed if schema provided)
  childrenIds: string[]                 // Array of child node IDs
  attributes: Record<string, unknown>   // Node attributes
  reference: string | string[] | undefined // Reference to other node(s)
  exists: boolean                       // Whether node exists
}
```

**Example:**

```tsx
const { state, childrenIds, attributes } = useSduiNodeSubscription({
  nodeId: 'card-1',
  schema: cardStateSchema, // Optional: validates and types state
})

// state is now typed based on your schema!
console.log(state.title) // TypeScript knows this exists
```

#### `useSduiNodeReference<T>(params): ReferencedNodesData`

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

**Example:**

```tsx
// Single reference
const { referencedNodesMap } = useSduiNodeReference({ nodeId: 'source-node' })
// Note: Consider managing node IDs as constants instead of hardcoded strings
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
// Note: Consider managing node IDs as constants instead of hardcoded strings
const node1 = referencedNodesMap['target-1']
const node2 = referencedNodesMap['target-2']
```

#### `useRenderNode(params): UseRenderNodeReturn`

Returns an object with `renderNode` function and node information including automatically calculated `currentPath`.

**Parameters:**

- `params.nodeId: string` - Current node ID (required)
- `params.componentMap?: Record<string, ComponentFactory>` - Optional component map
- `params.parentPath?: ParentPath` - Parent node ID path (default: `[]`)

**Returns:**

```typescript
{
  renderNode: RenderNodeFn // Function to render a single child node
  renderChildren: (childrenIds: string[]) => React.ReactNode[] // Render list with keys
  currentPath: ParentPath // Current path array (automatically calculated)
  pathString: string // Current path string (automatically calculated)
  nodeId: string // Current node ID
  parentPath: ParentPath // Parent node ID path
}
```

**Example:**

```tsx
function Container({ id }: { id: string }) {
  const { childrenIds } = useSduiNodeSubscription({ nodeId: id })
  const { renderChildren } = useRenderNode({ nodeId: id, parentPath: [] })

  return (
    <div>
      {renderChildren(childrenIds)}
    </div>
  )
}
```

### Store Methods

#### `SduiLayoutStore`

The main store class. Usually accessed via `useSduiLayoutAction()` hook.

**Query Methods (throw errors if not found):**

```tsx
store.getNodeById(nodeId) // Get node (throws if not found)
store.getNodeTypeById(nodeId) // Get node type (throws if not found)
store.getChildrenIdsById(nodeId) // Get children IDs (throws if not found)
store.getLayoutStateById(nodeId) // Get state (returns {} if not set)
store.getAttributesById(nodeId) // Get attributes (returns {} if not set)
store.getReferenceById(nodeId) // Get reference (returns undefined if not set)
store.getRootId() // Get root ID (throws if not found)
store.getDocument() // Convert store to document
```

**Update Methods:**

```tsx
store.updateLayout(document)                    // Update entire layout
store.updateNodeState(nodeId, partialState)     // Update node state
store.updateNodeAttributes(nodeId, attributes) // Update node attributes
store.updateNodeReference(nodeId, reference)   // Update node reference (string | string[] | undefined)
store.updateVariables(variables)                // Update global variables
store.updateVariable(key, value)                // Update single variable
store.deleteVariable(key)                       // Delete variable
store.cancelEdit(documentId?)                  // Cancel edits, restore original
```

**Subscription Methods:**

```tsx
const unsubscribe = store.subscribeNode(nodeId, callback) // Subscribe to node changes
const unsubscribe = store.subscribeVersion(callback) // Subscribe to global changes
```

**Utility Methods:**

```tsx
store.reset() // Reset to initial state
store.clearCache() // Clear cache and reset
```

## 🔧 TypeScript Types

All types are exported from the package:

```tsx
import type {
  SduiLayoutDocument, // Root document type
  SduiLayoutNode, // Node type
  SduiDocument, // Base document type
  SduiNode, // Base node type
  ComponentFactory, // Component factory function type
  RenderNodeFn, // Render node function type
  SduiLayoutStoreState, // Store state type
  SduiLayoutStoreOptions, // Store options type
  UseSduiNodeSubscriptionParams, // Hook params type
  NormalizedSduiEntities, // Normalized entities type
} from '@lodado/sdui-template'
```

## 🏗️ Architecture

This library uses a clean architecture:

- **SubscriptionManager**: Manages observer pattern for efficient updates
- **LayoutStateRepository**: Handles state storage and retrieval
- **DocumentManager**: Manages document caching and serialization
- **VariablesManager**: Manages global variables

## ⚡ Performance

- **Subscription-based re-renders**: Only changed nodes update
- **Normalized data**: Efficient lookups using normalizr
- **Minimal bundle**: < 50KB gzipped

## 🚀 Next.js App Router

This library is designed for Next.js App Router. All React components include `"use client"`:

```tsx
// app/page.tsx
'use client'

import { SduiLayoutRenderer } from '@lodado/sdui-template'

export default function Page() {
  return <SduiLayoutRenderer document={document} />
}
```

## 🚀 Worktree-Based Development

This repository uses a **git worktree** workflow for isolated PR development:

> "1 Task = 1 Worktree = 1 PR"

### Quick Start

```bash
# Create a new worktree for your feature
./.claude/scripts/pr-task.sh "feat: add billing table"

# Navigate to the worktree
cd .worktrees/feat-add-billing-table

# Make changes, then commit and push
git add .
git commit -m "feat: add billing table"
git push -u origin chore/feat-add-billing-table

# Create PR
gh pr create --title "feat: add billing table"

# After merge, clean up
cd ../..
git worktree remove .worktrees/feat-add-billing-table
```

### Why Worktrees?

- **Isolation**: Each feature is completely isolated
- **Parallel work**: Work on multiple features simultaneously
- **Clean main**: Never develop directly on main branch
- **Easy cleanup**: Remove worktree after PR merge

### Agent Workflow

See `agents/` directory for orchestrator and implementer agent specifications:

- `agents/pr-orchestrator.md` - Manages PR lifecycle
- `agents/pr-implementer.md` - Handles code implementation

## 📝 License

MIT
