# Architecture Design: SDUI Template Library

## Overview

This document explains the architecture of the SDUI Template library. It helps you understand how the library is structured and how each part interacts.

## Architecture Goals

### Core Goals

1. **Performance**: Subscription-based re-rendering updates only changed nodes
2. **Modularity**: Clean separation allows easy component customization by users
3. **Next.js Compatibility**: Works with minimal client bundle in App Router

### Constraints

- **Runtime**: Browser (client components) + Node.js (server components)
- **Tech Stack**: React 18+, TypeScript, Next.js 13+ App Router
- **Deployment**: npm package, tree-shaking support, ESM + CJS exports
- **Security**: XSS prevention, safe HTML rendering, SSR state serialization safety

## System Structure

### Overall Architecture Diagram

```text
┌─────────────────────────────────────────────────────────────┐
│                    Consumer Application                      │
│  (Next.js App Router / React App)                           │
│                                                              │
│  ┌──────────────────────────────────────────────────────┐   │
│  │         @lodado/sdui-template (Library)              │   │
│  │                                                      │   │
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────┐ │   │
│  │  │   Renderer   │  │    Store    │  │  Hooks   │ │   │
│  │  │  Component   │──│  Management  │──│  Access  │ │   │
│  │  └──────────────┘  └──────────────┘  └──────────┘ │   │
│  │         │                 │                        │   │
│  │  ┌──────┴─────────────────┴────────────┐          │   │
│  │  │      Normalization Layer            │          │   │
│  │  │  (normalizr-based)                 │          │   │
│  │  └────────────────────────────────────┘          │   │
│  └──────────────────────────────────────────────────────┘   │
│                                                              │
│  ┌──────────────────────────────────────────────────────┐   │
│  │         Consumer Components (External)                  │   │
│  │  - Custom component implementations                   │   │
│  │  - Styling (CSS/Tailwind/styled-components)          │   │
│  │  - Data fetching logic                               │   │
│  └──────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
                              │
                              │ Document (JSON)
                              │ Component Overrides
                              │ Event Callbacks
                              ▼
                    ┌─────────────────────┐
                    │   External Systems   │
                    │  - API (data source)  │
                    │  - Storage (optional) │
                    └─────────────────────┘
```

## Module Structure

The library consists of 6 main modules:

### 1. Schema Module (`src/schema/`)

**Responsibility**: Domain models and type definitions

**Provides**:

- `SduiLayoutDocument`: SDUI document type
- `SduiLayoutNode`: Node type
- `BaseLayoutState`: Layout state type
- `LayoutPosition`: Position and size type
- `GridLayoutConfig`: Grid configuration type

**Usage Example**:

```typescript
import type { SduiLayoutDocument } from '@lodado/sdui-template'

const document: SduiLayoutDocument = {
  version: '1.0.0',
  root: {
    /* ... */
  },
}
```

### 2. Store Module (`src/store/`)

**Responsibility**: State management and subscription system

**Provides**:

- `SduiLayoutStore`: Main store class
- `SduiLayoutStoreState`: Store state type
- `SduiLayoutStoreOptions`: Store options type

**Internal Structure**:

- `SubscriptionManager`: Subscription system management
- `LayoutStateRepository`: State storage management
- `DocumentManager`: Document caching and serialization
- `VariablesManager`: Global variable management

**Usage Example**:

```typescript
import { SduiLayoutStore } from '@lodado/sdui-template'

const store = new SduiLayoutStore()
store.updateLayout(document)
store.updateNodeLayout('node-1', { x: 2, y: 0 })
```

### 3. Normalization Module (`src/utils/normalize/`)

**Responsibility**: Document normalization and denormalization

**Provides**:

- `normalizeSduiLayout()`: Convert document to normalized entities
- `denormalizeSduiLayout()`: Convert normalized entities to document
- `NormalizedSduiEntities`: Normalized entity type

**How It Works**:

- Converts recursive node structures to flat entities
- Enables fast ID-based lookups
- Separates state and attributes into separate entities

**Usage Example**:

```typescript
import { normalizeSduiLayout } from '@lodado/sdui-template'

const { entities } = normalizeSduiLayout(document)
// entities.nodes, entities.layoutStates, entities.layoutAttributes
```

### 4. React Integration Module (`src/react/`)

**Responsibility**: React Context, hooks, component rendering

**Provides**:

- `SduiLayoutProvider`: Context Provider component
- `SduiLayoutRenderer`: Main renderer component
- `useSduiLayoutStores`: State selection hook
- `useSduiLayoutAction`: Action hook
- `useSduiNodeSubscription`: Node subscription hook
- `useRenderNode`: Render function hook (internal)

**Usage Example**:

```typescript
import { SduiLayoutRenderer, useSduiNodeSubscription } from '@lodado/sdui-template'

function MyComponent() {
  const { state } = useSduiNodeSubscription({ nodeId: 'node-1' })
  return <div>{/* ... */}</div>
}
```

### 5. Component System Module (`src/components/`)

**Responsibility**: Component mapping and factory system

**Provides**:

- `ComponentFactory`: Component factory type
- `RenderNodeFn`: Render node function type
- `componentMap`: Default component map (empty)
- `defaultComponentFactory`: Default factory function

**How It Works**:

- Maps node types to component factories
- Priority: ID override > type override > default factory

**Usage Example**:

```typescript
import type { ComponentFactory } from '@lodado/sdui-template'

const customFactory: ComponentFactory = (id, renderNode) => {
  return <CustomComponent id={id}>{/* children */}</CustomComponent>
}
```

### 6. Test Module (`src/__tests__/`)

**Responsibility**: Test utilities and scenario tests

**Provides**:

- `createTestDocument()`: Create test documents
- `renderWithSduiLayout()`: Test rendering helper
- Scenario tests: Tests for major use cases

## Data Flow

### Document Rendering Flow

```text
1. User passes document to SduiLayoutRenderer
   ↓
2. Document normalization (normalizeSduiLayout)
   - Recursive node structure → flat entities
   ↓
3. Store creation and update
   - Create SduiLayoutStore instance
   - Update store with normalized entities
   ↓
4. Provide store via Context Provider
   - Provide store to Context via SduiLayoutProvider
   ↓
5. Render root node
   - SduiLayoutRendererInner renders root node
   ↓
6. Recursive child rendering
   - Call component factory matching each node's type
   - Recursively render child nodes
```

### Layout Update Flow

```text
1. User interaction or programmatic update
   ↓
2. Call store.updateNodeLayout(nodeId, layout)
   ↓
3. Store updates that node's state internally
   ↓
4. SubscriptionManager notifies subscribers of that node
   ↓
5. Only subscribed components re-render
   - useSduiNodeSubscription hook calls forceRender
   - Only that component updates
```

## Architecture Style

### Layered Architecture

```text
┌─────────────────────────────────────┐
│      React Integration Layer         │  ← Components, Hooks, Context
│  (Consumer-facing API)               │
├─────────────────────────────────────┤
│         Business Logic Layer         │  ← Store, Managers, Normalization
│  (Core domain logic)                 │
├─────────────────────────────────────┤
│         Data/State Layer             │  ← Schema, Types, Entities
│  (Domain models)                     │
└─────────────────────────────────────┘
```

**Why This Choice**:

- Clear separation between React integration and core logic
- Each layer can be tested independently
- Provides React-optimized API

## Key Design Decisions

### 1. Subscription-Based Re-rendering

**Decision**: Use subscription system instead of React Context

**Reason**:

- Context re-renders the entire tree
- Subscription system re-renders only changed nodes
- Essential for performance optimization

**Alternatives Considered**:

- React Context: Excluded due to performance issues
- Zustand: Excluded due to additional dependency

### 2. Normalization Usage

**Decision**: Use normalizr library

**Reason**:

- Efficiently handles recursive structures
- Enables fast ID-based lookups
- Uses proven library

**Alternatives Considered**:

- Manual normalization: High error risk
- Custom solution: Reinventing the wheel

### 3. SSR Support

**Decision**: Support SSR with server/client component separation

**Reason**:

- Better initial load performance (SEO, FCP)
- Progressive enhancement (works without JS)
- Next.js App Router best practices

**Implementation**:

- Server component: Initialize store, serialize state
- Client component: Hydrate store, enable interactivity
- State serialization: Store state → JSON → HTML
- Hydration: JSON → Store state → Subscribe system

**Alternatives Considered**:

- Client only: Simpler but worse initial performance
- Full SSR: Too complex, subscription system is client-only

### 4. Component Override System

**Decision**: Priority order: ID > type > default

**Reason**:

- Flexible customization
- Allows instance-specific customization

**Alternatives Considered**:

- Type only: Less flexible
- No overrides: Too rigid

## Performance Considerations

### Optimization Strategy

1. **Subscription-based re-rendering**: Updates only changed nodes
2. **Memoization**: Appropriate memoization in hooks and components
3. **Normalization caching**: Prevents re-normalizing same document
4. **Stable references**: Maintain stable references for store instance and render function

### Performance Goals

- **Initial Rendering**: < 100ms for 100 nodes
- **Re-rendering**: Updates only changed nodes (maintain 60fps)
- **Bundle Size**: < 50KB (gzipped)

## Security Considerations

### XSS Prevention

- Leverages React's automatic escaping
- No `dangerouslySetInnerHTML` usage
- Users control component rendering (library only provides structure)

### Data Validation

- Optional Zod schema validation
- Users can validate provided documents

## Extensibility

### Future Extensible Areas

1. **Schema Validation**: Enhanced Zod integration
2. **Developer Tools**: React DevTools integration
3. **Performance Monitoring**: Render time tracking
4. **Async Operations**: AbortController support

### Extension Points

- Component override system
- Error callbacks
- Layout change callbacks
- Store options

## SSR Architecture

### Server/Client Separation

```text
┌─────────────────────────────────────────────────────────────┐
│                    Server Layer                             │
│  (Next.js Server Components)                                │
│                                                             │
│  - Document fetching (API/DB)                               │
│  - Store initialization (read-only)                          │
│  - State serialization                                      │
│  - HTML generation                                          │
└─────────────────────────────────────────────────────────────┘
                              │
                              │ serializedState (JSON)
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                    Client Layer                             │
│  (React Client Components)                                 │
│                                                             │
│  - State hydration                                          │
│  - Subscription system initialization                        │
│  - Interactive features                                     │
│  - Event handlers                                           │
└─────────────────────────────────────────────────────────────┘
```

### Data Flow (SSR)

```text
1. Server Component receives document
   ↓
2. Create SduiLayoutStore (server instance)
   ↓
3. Store.updateLayout(document)
   ↓
4. Store.serializeState() → JSON
   ↓
5. Pass serializedState to Client Component
   ↓
6. Client Component creates new store
   ↓
7. Store.hydrateState(serializedState)
   ↓
8. Initialize subscription system
   ↓
9. Render with hydrated state
```

### Key Design Decisions (SSR)

1. **State Serialization**: Only serializable state (no functions, no subscriptions)
2. **Hydration Safety**: Validate serialized state before hydration
3. **Progressive Enhancement**: Works without serializedState (client-only fallback)
4. **Component Separation**: Server component for data, client component for interactivity

## Next Steps

Based on this architecture:

1. **Implementation Design** (`design-flow.md`): Detailed implementation plan (includes SSR)
2. **Implementation** (`implements.md`): Actual code implementation
3. **Optimization** (`optimization.md`): Performance optimization
