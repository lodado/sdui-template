---
description: architecture-design
---

# Architecture Design: SDUI Template Library

## 1) Goals & Constraints

### Top 3 Architecture Goals

1. **Performance**: Subscription-based re-rendering updates only changed nodes (maintain 60fps)
2. **Modularity**: Clean separation allows easy component customization by users
3. **Next.js Compatibility**: Works seamlessly with App Router, minimal client bundle

### Hard Constraints

- **Runtime**: Browser (client components) + Node.js (server components for SSR)
- **Tech Stack**: React 18+, TypeScript, Next.js 13+ App Router
- **Deployment**: npm package, tree-shaking support, ESM + CJS exports
- **Security**: XSS prevention (React auto-escaping), safe HTML rendering, SSR state serialization safety

### Architecture Drivers (from NFR)

- **Performance SLO**: Initial render < 100ms (100 nodes), re-render < 16ms (single node)
- **Availability**: No crashes on invalid documents (graceful error handling)
- **Data Integrity**: Normalized state consistency, subscription cleanup
- **Accessibility**: API provided for keyboard navigation (users implement)

## 2) System Context & Boundary

### Context Diagram

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

**In-Scope Components**:

- Document normalization/denormalization
- State management and subscription system
- React integration (components, hooks, context)
- Component factory system

**External Services**:

- API servers (data source - users handle)
- Storage systems (optional - users handle)

**Data Stores**:

- In-memory store (library manages)
- Document cache (optional, library manages)

## 3) Module Decomposition

### Module 1: Schema Module (`src/schema/`)

**Responsibility**: Domain models and type definitions

**Public Interface**:

- `SduiLayoutDocument` type
- `SduiLayoutNode` type
- `BaseLayoutState` type
- `LayoutPosition` type

**Private Decisions**:

- Internal type structure
- Validation rules (if any)

**Owners**: Library maintainers

### Module 2: Store Module (`src/store/`)

**Responsibility**: State management and subscription system

**Public Interface**:

- `SduiLayoutStore` class
- `SduiLayoutStoreState` type
- `SduiLayoutStoreOptions` type

**Private Decisions**:

- Subscription implementation (Map<nodeId, Set<callbacks>>)
- State storage structure (normalized entities)
- Version management
- Manager coordination (Facade pattern)

**Owners**: Library maintainers

**Sub-modules**:

- `SubscriptionManager`: Subscription system
- `LayoutStateRepository`: State storage
- `DocumentManager`: Document caching
- `VariablesManager`: Global variables

### Module 3: Normalization Module (`src/utils/normalize/`)

**Responsibility**: Document normalization and denormalization

**Public Interface**:

- `normalizeSduiLayout()` function
- `denormalizeSduiLayout()` function
- `normalizeSduiNode()` function (optional)
- `denormalizeSduiNode()` function (optional)
- `NormalizedSduiEntities` type

**Private Decisions**:

- Normalizr schema structure
- Entity separation strategy
- Caching strategy (optional)

**Owners**: Library maintainers

### Module 4: React Integration Module (`src/react-wrapper/`)

**Responsibility**: React Context, hooks, component rendering

**Public Interface**:

- `SduiLayoutProvider` component
- `SduiLayoutRenderer` component
- `useSduiLayoutAction` hook
- `useSduiNodeSubscription` hook
- `useRenderNode` hook (internal)

**Private Decisions**:

- Context implementation
- Hook memoization strategy
- Component override resolution
- Render function stability

**Owners**: Library maintainers

### Module 5: Component System Module (`src/components/`)

**Responsibility**: Component mapping and factory system

**Public Interface**:

- `ComponentFactory` type
- `RenderNodeFn` type
- `componentMap` (default empty)
- `defaultComponentFactory` function

**Private Decisions**:

- Factory resolution priority
- Default component behavior

**Owners**: Library maintainers

## 4) Architectural Style + Trade-offs

### Chosen Style: Layered Architecture

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

**Rationale**:

- Clear separation between React integration and core logic
- Each layer can be tested independently
- Provides React-optimized API while keeping core logic framework-agnostic
- Easy to extend (new hooks/components without changing core)

**Trade-offs**:

| Aspect                  | Pros                             | Cons                       | Risk                        |
| ----------------------- | -------------------------------- | -------------------------- | --------------------------- |
| Layered                 | Clear separation, testable       | Some indirection           | Low                         |
| Subscription vs Context | Performance (only changed nodes) | More complex than Context  | Medium (mitigated by tests) |
| Normalization           | Fast lookups, efficient updates  | Initial normalization cost | Low (caching available)     |

**Alternatives Considered**:

- **React Context**: Excluded - causes entire tree re-render (performance issue)
- **Zustand/Redux**: Excluded - additional dependency, overkill for this use case
- **Event-driven**: Excluded - not needed (synchronous operations)
- **Micro-frontend**: Excluded - single package, no need

## 5) Data & State Architecture

### Data Ownership

| Entity        | Owner Module          | Access Method                                 |
| ------------- | --------------------- | --------------------------------------------- |
| Document      | DocumentManager       | `updateLayout()`, `getDocument()`             |
| Nodes         | LayoutStateRepository | `getNodeById()`, `nodes` getter               |
| Layout States | LayoutStateRepository | `getLayoutStateById()`, `layoutStates` getter |
| Variables     | VariablesManager      | `updateVariables()`, `variables` getter       |
| Subscriptions | SubscriptionManager   | `subscribeNode()`, `subscribeVersion()`       |

**Data Flow**:

- Document → Normalization → Store (normalized entities)
- Store → React Context → Components (via hooks)
- Components → Store (via actions) → Notifications → Components (re-render)

### State Taxonomy

**Server State** (from document):

- `nodes`: Node entities (source of truth: document)
- `layoutStates`: Component states (source of truth: document)
- `variables`: Global variables (source of truth: document)
- `metadata`: Document metadata (source of truth: document)

**Client/UI State**:

- `selectedNodeId`: Selected node (ephemeral, UI-only)
- `isEdited`: Edit flag (ephemeral, UI-only)
- Subscription callbacks (ephemeral, component lifecycle)

**Derived State**:

- `childrenIds`: Computed from `nodes[id].childrenIds`
- Component factory resolution: Computed from overrides + componentMap

### Concurrency Rules

**Current Approach (Synchronous)**:

- All operations synchronous (no async in MVP)
- Latest update wins (no conflicts)
- No race conditions (synchronous only)

**Future (if async added)**:

- Latest user intent wins (cancellation via AbortController)
- Sequence guards (prevent stale updates)
- Idempotent operations (safe to retry)

## 6) Key Flows (Sequence)

### Flow 1: Document Rendering (Happy Path)

```
User → SduiLayoutRenderer: document={doc}
  → SduiLayoutRenderer: validate document
  → SduiLayoutRenderer: create SduiLayoutStore
  → SduiLayoutStore: normalizeSduiLayout(document)
  → SduiLayoutStore: updateLayout(normalized)
  → LayoutStateRepository: updateNodes(entities.nodes)
  → LayoutStateRepository: updateLayoutStates(entities.layoutStates)
  → SduiLayoutProvider: provide store via Context
  → SduiLayoutRendererInner: render root node
  → useRenderNode: resolve component factory
  → ComponentFactory: render component with id
  → useSduiNodeSubscription: subscribe to node
  → SubscriptionManager: register callback
  → Component: render with state
```

### Flow 2: State Update (Happy Path)

```
User → Component: user interaction
  → Component: store.updateNodeState(nodeId, newState)
  → SduiLayoutStore: updateNodeState(nodeId, newState)
  → LayoutStateRepository: updateNodeLayoutState(nodeId, mergedState)
  → SubscriptionManager: notifyNode(nodeId)
  → SubscriptionManager: call registered callbacks
  → useSduiNodeSubscription: forceRender()
  → Component: re-render with new state
```

### Flow 3: Error Handling (Failure Path)

```
User → SduiLayoutRenderer: document={invalidDoc}
  → SduiLayoutRenderer: validate document
  → SduiLayoutRenderer: detect missing root.id
  → SduiLayoutRenderer: catch error
  → SduiLayoutRenderer: call onError(error)
  → SduiLayoutRenderer: create empty store (fallback)
  → SduiLayoutRenderer: return null
  → User: handle error via onError callback
```

## 7) Interface Contracts

### Internal Interfaces

**Store → Managers**:

```typescript
interface SubscriptionManager {
  subscribeNode(nodeId: string, callback: () => void): () => void
  subscribeVersion(callback: () => void): () => void
  notifyNode(nodeId: string): void
  notifyVersion(): void
}

interface LayoutStateRepository {
  getNodeById(nodeId: string): SduiLayoutNode | undefined
  getLayoutStateById(nodeId: string): BaseLayoutState | undefined
  updateNodes(nodes: Record<string, SduiLayoutNode>): void
  updateNodeLayoutState(nodeId: string, state: BaseLayoutState): void
}
```

**React → Store**:

```typescript
interface SduiLayoutStore {
  // Query
  getNodeById(nodeId: string): SduiLayoutNode | undefined
  getChildrenIdsById(nodeId: string): string[]

  // Update
  updateLayout(document: SduiLayoutDocument): void
  updateNodeState(nodeId: string, state: Partial<BaseLayoutState>): void

  // Subscribe
  subscribeNode(nodeId: string, callback: () => void): () => void
  subscribeVersion(callback: () => void): () => void
}
```

### External Interfaces

**User → Library**:

```typescript
interface SduiLayoutRendererProps {
  document: SduiLayoutDocument
  components?: Record<string, ComponentFactory>
  componentOverrides?: {
    byNodeId?: Record<string, ComponentFactory>
    byNodeType?: Record<string, ComponentFactory>
  }
  onError?: (error: Error) => void
  onLayoutChange?: (document: SduiLayoutDocument) => void
}
```

### Error Taxonomy

- **InvalidDocumentError**: Document missing required fields
- **NodeNotFoundError**: Node ID not found
- **SchemaValidationError**: Zod schema validation failed

**Error Handling Strategy**:

- Errors caught internally
- Passed to `onError` callback
- Library continues if possible (fallback)
- No exceptions thrown to user code

### Timeouts/Retries

- Not applicable (synchronous operations)
- Future: If async added, use AbortController for cancellation

### Pagination/Caching

- No pagination (all nodes in memory)
- Document caching optional (via DocumentManager)
- Normalization caching optional (performance optimization)

### Security/Auth Boundaries

- No authentication (users handle)
- XSS prevention: React auto-escaping (no dangerouslySetInnerHTML)
- SSR safety: JSON serialization only (no functions)

### Observability Hooks

- Error callbacks: `onError` for user-facing errors
- No internal logging (users can add via callbacks)
- Performance: Users can measure via React Profiler

## 8) Cross-Cutting Concerns

### Logging / Metrics / Tracing

- **Strategy**: Minimal - error callbacks only
- **Implementation**: `onError` callback for user-facing errors
- **No internal logging**: Users can add via callbacks if needed

### Error Handling Strategy

- **User-facing**: `onError` callback with Error object
- **Internal**: Try-catch, fallback to empty store
- **Recovery**: Continue rendering if possible, return null if not

### Security & Privacy

- **XSS Prevention**: React auto-escaping (no dangerouslySetInnerHTML)
- **SSR Safety**: JSON serialization only (no functions, no circular refs)
- **PII Handling**: Users handle (library doesn't process PII)
- **Tokens/Secrets**: Users handle (library doesn't store secrets)

### Performance Plan

- **Budgets**: Bundle < 50KB, initial render < 100ms (100 nodes)
- **Caching**: Document caching optional, normalization caching optional
- **Batching**: Not needed (synchronous operations)
- **Measurement**: React Profiler, bundle analyzer

### Accessibility Plan

- **Strategy**: API provided, users implement
- **Keyboard Navigation**: Users handle in components
- **ARIA**: Users handle in components
- **Focus Management**: Users handle in components

### Configuration & Feature Flags

- **Store Options**: `componentOverrides` via constructor
- **No feature flags**: Not needed (single package)
- **Environment**: Detected automatically (browser vs server)

## 9) Test Architecture

### Test Pyramid

```
        /\
       /  \     Unit Tests (P1)
      /____\    - Pure helpers only
     /      \
    /________\  Integration Tests (P1)
   /          \ - Manager integration
  /____________\ Scenario Tests (P0)
                 - 10+ scenario tests
                 - EP/BVA sampling
                 - Deterministic async
```

### Must-Have Test Portfolio

**Scenario Tests (P0 - 10 tests)**:

1. Render single root node
2. Render nested child nodes (3 levels)
3. Update node state (verify only that node re-renders)
4. Component override by type
5. Component override by ID (priority test)
6. Handle invalid document (error callback)
7. Render empty children array
8. Handle deep nesting (10 levels)
9. Subscription system (multiple nodes, verify isolation)
10. Store reset (verify cleanup)

**EP/BVA Sampling**:

- Node count: 0, 1, 10, 100, 1000
- Nesting depth: 0, 1, 5, 10, 20
- Layout position: -1, 0, 5, 12, max
- Layout width: 0, 1, 6, 12, max

**Deterministic Tests**:

- All synchronous (no timing issues)
- Explicit unsubscribe tests (memory leak prevention)
- No race conditions (synchronous only)

**Contract Tests** (if needed):

- Store → Manager interfaces
- React → Store interfaces

**Unit Tests (P1 - Optional)**:

- Pure helpers: `normalizeSduiLayout`, `denormalizeSduiLayout`
- Manager classes (if complex logic)

## 10) ADR Summary + Next Steps

### ADR 1: Subscription System over React Context

**Decision**: Use custom subscription system instead of React Context

**Context**: Need to re-render only changed nodes for performance

**Decision**: Implement Map<nodeId, Set<callbacks>> subscription system

**Consequences**: More complex than Context, but better performance

### ADR 2: Normalization with Normalizr

**Decision**: Use normalizr library for document normalization

**Context**: Need efficient ID-based lookups for recursive structures

**Decision**: Use normalizr (proven library)

**Consequences**: Additional dependency, but proven and efficient

### ADR 3: Layered Architecture

**Decision**: Use layered architecture (React → Business Logic → Data)

**Context**: Need clear separation, testability, extensibility

**Decision**: Three-layer architecture

**Consequences**: Some indirection, but clear separation and testability

### ADR 4: SSR Support without Serialization

**Decision**: Support SSR without state serialization (optional feature)

**Context**: Same document produces same result on server and client

**Decision**: Works without serialization, add only if profiling shows bottleneck

**Consequences**: Simpler implementation, acceptable performance for most cases

### Next Steps

1. **Implementation Design** (`design-flow.md`): Detailed implementation plan
2. **Implementation** (`implements.md`): Actual code implementation
3. **Optimization** (`optimization.md`): Performance optimization
