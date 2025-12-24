# Requirements Analysis: SDUI Template Library

## Why is this library needed?

### Problem Statement

Many applications require dynamically controlling UI structure and layout from the server. For example:

- **Dashboard Builder**: Users configure dashboards via drag-and-drop, and saved layouts are loaded from the server and rendered
- **Dynamic Form Generator**: Form structure is defined on the server and dynamically rendered on the client
- **Content Management System**: Administrators configure page layouts, and users see the same layout
- **A/B Testing**: Server sends different UI layouts for experimentation

In these situations, implementing state management, subscription systems, and component rendering logic from scratch for each new project is inefficient.

### Solution: SDUI Template

**SDUI (Server-Driven UI)** is a pattern where UI structure is defined on the server and dynamically rendered on the client. This library provides the core logic for implementing the SDUI pattern.

**Core Value**:

- ✅ **Reusable**: Implement once, use across multiple projects
- ✅ **Performance Optimized**: Subscription-based re-rendering updates only changed nodes
- ✅ **Flexible**: Component overrides allow project-specific customization
- ✅ **Type Safe**: Full TypeScript type support
- ✅ **Next.js Compatible**: Works out of the box with App Router

## Use Cases

### User 1: Dashboard Developer

**Scenario**: Users need to configure dashboards via drag-and-drop, and saved layouts must be loaded from the server and rendered.

**Solution**:

```tsx
import { SduiLayoutRenderer } from '@lodado/sdui-template'

function Dashboard({ layoutData }) {
  return (
    <SduiLayoutRenderer
      document={layoutData}
      components={{
        Chart: ChartComponent,
        Table: TableComponent,
        Card: CardComponent,
      }}
    />
  )
}
```

### User 2: Dynamic Form Generator Developer

**Scenario**: Form structure must be defined on the server and dynamically rendered on the client.

**Solution**:

```tsx
import { SduiLayoutRenderer, useSduiNodeSubscription } from '@lodado/sdui-template'

function FormField({ nodeId }) {
  const { state, type } = useSduiNodeSubscription({ nodeId })

  if (type === 'TextField') {
    return <input {...state.props} />
  }
  // ... other field types
}
```

### User 3: Content Management System Developer

**Scenario**: Administrators configure page layouts, and users must see the same layout.

**Solution**:

```tsx
import { SduiLayoutRenderer } from '@lodado/sdui-template'

function Page({ pageData }) {
  return (
    <SduiLayoutRenderer
      document={pageData.layout}
      onError={(error) => {
        // Error handling
        console.error('Layout error:', error)
      }}
    />
  )
}
```

## Functional Requirements

### Must Have Features

| Feature                 | Description                                                  | Priority |
| ----------------------- | ------------------------------------------------------------ | -------- |
| **Document Rendering**  | Render SDUI documents as React component trees               | P0       |
| **State Management**    | Efficiently manage layout state                              | P0       |
| **Subscription System** | Subscription-based system that re-renders only changed nodes | P0       |
| **Component Override**  | Customize components by type or ID                           | P0       |
| **Next.js Compatible**  | Works with "use client" in App Router                        | P0       |
| **TypeScript Support**  | Full type definitions provided                               | P0       |

### Should Have Features

| Feature             | Description                         | Priority |
| ------------------- | ----------------------------------- | -------- |
| **Layout Updates**  | Programmatically update layouts     | P1       |
| **Variable System** | Manage and access global variables  | P1       |
| **Error Handling**  | Handle invalid documents gracefully | P1       |

### Could Have Features

| Feature                    | Description                              | Priority |
| -------------------------- | ---------------------------------------- | -------- |
| **Schema Validation**      | Document schema validation with Zod      | P2       |
| **Document Serialization** | Convert current state to document format | P2       |

## Non-Functional Requirements

### Performance

- **Initial Rendering**: < 100ms for 100 nodes
- **Re-rendering**: Only changed nodes update (maintain 60fps)
- **Bundle Size**: < 50KB (gzipped)

### Compatibility

- **React**: 18+
- **Next.js**: 13+ (App Router)
- **TypeScript**: 4.3+

### Reliability

- **Error Handling**: Graceful handling of invalid documents
- **Memory Leaks**: Subscription cleanup on component unmount
- **Type Safety**: TypeScript strict mode compliance

## User Flows

### Basic Usage Flow

1. **Install**: `pnpm add @lodado/sdui-template`
2. **Prepare Document**: Receive SDUI document (JSON) from server
3. **Map Components**: Define components for each node type
4. **Render**: Render document with `SduiLayoutRenderer`
5. **Subscribe to State**: Use `useSduiNodeSubscription` to detect state changes if needed

### Error Handling Flow

1. Invalid document passed
2. `onError` callback called
3. Check and handle error information
4. Display fallback UI if needed

### Layout Update Flow

1. User interaction (drag, resize, etc.)
2. Call `store.updateNodeLayout()`
3. Subscription system notifies only changed nodes
4. Only affected components re-render

## Data Model

### SDUI Document Structure

```typescript
interface SduiLayoutDocument {
  version: string // Document version
  metadata?: {
    // Metadata (optional)
    id?: string
    name?: string
    description?: string
  }
  root: SduiLayoutNode // Root node
  variables?: Record<string, unknown> // Global variables (optional)
}
```

### Node Structure

```typescript
interface SduiLayoutNode {
  id: string // Unique identifier
  type: string // Component type
  state: BaseLayoutState // Layout state
  attributes?: Record<string, unknown> // Additional attributes (optional)
  children?: SduiLayoutNode[] // Child nodes (recursive)
}
```

### Layout State

```typescript
interface BaseLayoutState {
  layout: {
    x: number // Grid X coordinate
    y: number // Grid Y coordinate
    w: number // Width
    h: number // Height
    minW?: number // Minimum width (optional)
    minH?: number // Minimum height (optional)
    maxW?: number // Maximum width (optional)
    maxH?: number // Maximum height (optional)
    static?: boolean // Fixed position (optional)
  }
  grid?: GridLayoutConfig // Grid configuration (optional)
  edit?: {
    // Edit state (optional)
    isDragging?: boolean
    isResizing?: boolean
    isEdited?: boolean
  }
}
```

## API Overview

### Component API

```typescript
<SduiLayoutRenderer
  document={document} // SDUI document (required)
  components={{
    // Component map (optional)
    Chart: ChartComponent,
    Table: TableComponent,
  }}
  componentOverrides={{
    // Component overrides (optional)
    byNodeId: { 'custom-id': CustomComponent },
    byNodeType: { Card: CustomCard },
  }}
  onError={(error) => {}} // Error callback (optional)
  onLayoutChange={(doc) => {}} // Layout change callback (optional)
/>
```

### Hook API

```typescript
// State selection
const { rootId, nodes } = useSduiLayoutStores((state) => ({ rootId: state.rootId, nodes: state.nodes }))

// Action calls
const store = useSduiLayoutAction()
store.updateNodeLayout('node-1', { x: 2, y: 0 })

// Node subscription
const { node, state } = useSduiNodeSubscription({
  nodeId: 'node-1',
  schema: baseLayoutStateSchema, // Optional schema validation
})
```

## Constraints and Assumptions

### Constraints

- **Client Only**: Cannot be used in server components (only in client components)
- **React 18+**: Requires React 18 or higher
- **Browser Environment**: Cannot be used in Node.js environment

### Assumptions

- Users use React 18+
- Users use TypeScript (recommended)
- Users provide their own components
- Users handle styling themselves

## Out of Scope

The following items are not included in this library's scope:

- ❌ Default component implementations (users provide)
- ❌ Styling (users handle)
- ❌ Data fetching (users handle)
- ❌ Authentication/Authorization (users handle)
- ❌ Persistence (localStorage, IndexedDB, etc., users handle)
- ❌ Server-side rendering (client only)

## Success Criteria

What this library successfully provides:

- ✅ Renders SDUI documents as React component trees
- ✅ Efficiently re-renders only changed nodes
- ✅ Allows component overrides by type or ID
- ✅ Works out of the box with Next.js App Router
- ✅ Full TypeScript type support
- ✅ Bundle size under 50KB
- ✅ Initial rendering under 100ms for 100 nodes

## Next Steps

Based on this requirements analysis:

1. **Architecture Design** (`arch.md`): System structure and module decomposition
2. **Implementation Design** (`design-flow.md`): Detailed implementation plan
3. **Implementation** (`implements.md`): Actual code implementation
4. **Optimization** (`optimization.md`): Performance optimization and improvements
