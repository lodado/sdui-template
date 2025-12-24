# @lodado/sdui-template

Server-Driven UI Template Library for React. A flexible and powerful template system for building server-driven user interfaces with dynamic layouts and components.

## Features

- 🎯 **Server-Driven UI**: Define layouts from server-side configuration
- ⚡ **Performance Optimized**: ID-based subscription system for minimal re-renders
- 🔄 **Normalize/Denormalize**: Efficient data structure using normalizr
- 📐 **Layout Support**: Built-in support for grid-based layouts
- 🎨 **Type Safe**: Full TypeScript support
- 🧩 **Modular**: Clean architecture with separated concerns
- 🚀 **Next.js Compatible**: Works seamlessly with Next.js App Router

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
"use client";

import { SduiLayoutRenderer } from "@lodado/sdui-template";

const document = {
  version: "1.0.0",
  metadata: {
    id: "my-layout",
    name: "My Layout",
  },
  root: {
    id: "root",
    type: "Container",
    state: {
      layout: {
        x: 0,
        y: 0,
        w: 12,
        h: 1,
      },
    },
    children: [
      {
        id: "card-1",
        type: "Card",
        state: {
          layout: {
            x: 0,
            y: 0,
            w: 6,
            h: 2,
          },
        },
      },
      {
        id: "card-2",
        type: "Card",
        state: {
          layout: {
            x: 6,
            y: 0,
            w: 6,
            h: 2,
          },
        },
      },
    ],
  },
};

export default function Page() {
  return <SduiLayoutRenderer document={document} />;
}
```

### Custom Components

```tsx
"use client";

import { SduiLayoutRenderer, type ComponentFactory } from "@lodado/sdui-template";

// Define your component factory
const CardFactory: ComponentFactory = (id, renderNode) => {
  return (
    <div className="card">
      <h3>Card {id}</h3>
      {/* Render children if any */}
      {renderNode(id)}
    </div>
  );
};

const document = {
  version: "1.0.0",
  root: {
    id: "root",
    type: "Card",
    state: {
      layout: { x: 0, y: 0, w: 12, h: 1 },
    },
  },
};

export default function Page() {
  return (
    <SduiLayoutRenderer
      document={document}
      components={{ Card: CardFactory }}
    />
  );
}
```

### Using Hooks

```tsx
"use client";

import {
  SduiLayoutProvider,
  useSduiLayoutAction,
  useSduiNodeSubscription,
} from "@lodado/sdui-template";
import { SduiLayoutStore } from "@lodado/sdui-template";

function MyComponent({ nodeId }: { nodeId: string }) {
  const store = useSduiLayoutAction();
  const { state, childrenIds } = useSduiNodeSubscription({ nodeId });

  const handleUpdate = () => {
    store.updateNodeLayout(nodeId, {
      x: state?.layout.x || 0,
      y: (state?.layout.y || 0) + 1,
      w: state?.layout.w || 12,
      h: state?.layout.h || 1,
    });
  };

  return (
    <div>
      <div>Position: ({state?.layout.x}, {state?.layout.y})</div>
      <button onClick={handleUpdate}>Move Down</button>
      {childrenIds.map((childId) => (
        <MyComponent key={childId} nodeId={childId} />
      ))}
    </div>
  );
}

export default function Page() {
  const store = new SduiLayoutStore();
  // ... initialize store with document

  return (
    <SduiLayoutProvider store={store}>
      <MyComponent nodeId="root" />
    </SduiLayoutProvider>
  );
}
```

### Component Overrides

```tsx
"use client";

import { SduiLayoutRenderer, type ComponentFactory } from "@lodado/sdui-template";

const SpecialCardFactory: ComponentFactory = (id) => (
  <div className="special-card">Special: {id}</div>
);

export default function Page() {
  return (
    <SduiLayoutRenderer
      document={document}
      componentOverrides={{
        // Override by node ID (highest priority)
        byNodeId: {
          "special-card-1": SpecialCardFactory,
        },
        // Override by node type
        byNodeType: {
          Card: CustomCardFactory,
        },
      }}
    />
  );
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

#### `useSduiLayoutStores<T>(selector: (state: SduiLayoutStoreState) => T): T`

Selectively subscribes to store state changes.

```tsx
const { rootId, nodes } = useSduiLayoutStores((state) => ({
  rootId: state.rootId,
  nodes: state.nodes,
}));
```

#### `useSduiLayoutAction(): SduiLayoutStore`

Returns store instance for calling actions.

```tsx
const store = useSduiLayoutAction();
store.updateNodeLayout(nodeId, { x: 0, y: 0 });
```

#### `useSduiNodeSubscription(params: { nodeId: string, schema?: ZodSchema }): NodeData`

Subscribes to a specific node's changes.

```tsx
const { node, state, childrenIds } = useSduiNodeSubscription({
  nodeId: "node-1",
  schema: baseLayoutStateSchema, // optional
});
```

#### `useRenderNode(componentMap?: Record<string, ComponentFactory>): RenderNodeFn`

Returns a function to render child nodes (internal use).

### Store

#### `SduiLayoutStore`

Main store class for managing SDUI layout state.

**Methods:**

- `updateLayout(document: SduiLayoutDocument): void` - Update layout document
- `updateNodeLayout(nodeId: string, layout: Partial<LayoutPosition>): void` - Update node layout
- `updateNodeState(nodeId: string, state: Partial<BaseLayoutState>): void` - Update node state
- `updateVariables(variables: Record<string, unknown>): void` - Update global variables
- `getNodeById(nodeId: string): SduiLayoutNode | undefined` - Get node by ID
- `getChildrenIdsById(nodeId: string): string[]` - Get children IDs
- `subscribeNode(nodeId: string, callback: () => void): () => void` - Subscribe to node changes
- `subscribeVersion(callback: () => void): () => void` - Subscribe to global changes
- `reset(): void` - Reset store to initial state

## TypeScript Types

All types are exported from the main package:

```tsx
import type {
  SduiLayoutDocument,
  SduiLayoutNode,
  BaseLayoutState,
  LayoutPosition,
  GridLayoutConfig,
  ComponentFactory,
  RenderNodeFn,
  SduiLayoutStoreState,
  SduiLayoutStoreOptions,
} from "@lodado/sdui-template";
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
"use client";

import { SduiLayoutRenderer } from "@lodado/sdui-template";

export default function Page() {
  return <SduiLayoutRenderer document={document} />;
}
```

## License

MIT
