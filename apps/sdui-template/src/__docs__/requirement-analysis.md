---
description: Requirements Analysis
---

# Requirements Analysis: SDUI Template Library

## 1) Problem

Many applications require dynamically controlling UI structure and layout from the server. Common use cases include:

- **Dashboard Builders**: Users configure dashboards via drag-and-drop, and saved layouts are loaded from the server and rendered
- **Dynamic Form Generators**: Form structure is defined on the server and dynamically rendered on the client
- **Content Management Systems**: Administrators configure page layouts, and users see the same layout
- **A/B Testing**: Server sends different UI layouts for experimentation

In these situations, implementing state management, subscription systems, and component rendering logic from scratch for each new project is inefficient and error-prone.

**Problem Statement**: Developers need a reusable library that provides core logic for implementing Server-Driven UI (SDUI) patterns, enabling dynamic UI rendering from server-defined configurations without rebuilding state management and subscription systems for each project.

**User Value**: Faster development, consistent patterns, reduced bugs from custom implementations.

**Business Value**: Reduced development time, improved code quality, easier maintenance.

**Success Criteria**:

- Library can render SDUI documents as React component trees
- Only changed nodes re-render (performance optimized)
- Works with Next.js App Router out of the box
- Bundle size < 50KB (gzipped)
- Initial rendering < 100ms for 100 nodes

## 2) Actors & Use cases

### Actors

1. **Dashboard Developer**: Builds dashboards with drag-and-drop configuration
2. **Form Generator Developer**: Creates dynamic forms from server definitions
3. **CMS Developer**: Implements page layout systems
4. **A/B Testing Developer**: Implements experimental UI layouts

### Use Cases

**Dashboard Developer**:

1. Load saved dashboard layout from server
2. Render dashboard with custom chart/table components
3. Update component state programmatically
4. Handle layout errors gracefully

**Form Generator Developer**:

1. Render form structure from server definition
2. Subscribe to form field state changes
3. Validate form fields with Zod schemas
4. Submit form data

**CMS Developer**:

1. Render page layouts from server configuration
2. Override components by type or ID
3. Handle missing components gracefully
4. Support nested component structures

**A/B Testing Developer**:

1. Render different UI layouts from server
2. Track user interactions
3. Switch layouts dynamically
4. Measure layout performance

## 3) FR (table)

| ID   | Feature                | Description                                                  | Priority | Testable Statement                                                                 |
| ---- | ---------------------- | ------------------------------------------------------------ | -------- | ---------------------------------------------------------------------------------- |
| FR1  | Document Rendering     | Render SDUI documents as React component trees               | MUST     | Given valid document, when rendered, then React components are created             |
| FR2  | State Management       | Efficiently manage layout state                              | MUST     | Given document, when loaded, then state is normalized and accessible               |
| FR3  | Subscription System    | Subscription-based system that re-renders only changed nodes | MUST     | Given node update, when state changes, then only that node's components re-render  |
| FR4  | Component Override     | Customize components by type or ID                           | MUST     | Given override config, when rendering, then overridden component is used           |
| FR5  | Next.js Compatible     | Works with "use client" in App Router                        | MUST     | Given Next.js App Router, when used, then no SSR errors occur                      |
| FR6  | TypeScript Support     | Full type definitions provided                               | MUST     | Given TypeScript project, when imported, then types are available                  |
| FR7  | State Updates          | Programmatically update component state                      | SHOULD   | Given node ID and state, when updated, then state changes and subscribers notified |
| FR8  | Variable System        | Manage and access global variables                           | SHOULD   | Given variables, when set, then accessible to all components                       |
| FR9  | Error Handling         | Handle invalid documents gracefully                          | SHOULD   | Given invalid document, when rendered, then error callback called                  |
| FR10 | Schema Validation      | Optional Zod schema validation for state                     | SHOULD   | Given schema, when subscribing, then state validated and typed                     |
| FR11 | Document Serialization | Convert current state to document format                     | COULD    | Given store state, when serialized, then document format returned                  |

## 4) NFR (table)

| ID    | Requirement                     | Target                                 | Measurement Method   | Priority |
| ----- | ------------------------------- | -------------------------------------- | -------------------- | -------- |
| NFR1  | Performance - Initial Rendering | < 100ms for 100 nodes                  | React Profiler       | MUST     |
| NFR2  | Performance - Re-rendering      | Only changed nodes update (60fps)      | React Profiler       | MUST     |
| NFR3  | Performance - Bundle Size       | < 50KB (gzipped)                       | Bundle analyzer      | MUST     |
| NFR4  | Reliability - Error Handling    | Graceful handling of invalid documents | Error callback tests | SHOULD   |
| NFR5  | Reliability - Memory Leaks      | No leaks on unmount                    | Memory profiler      | MUST     |
| NFR6  | Compatibility - React           | 18+                                    | Type definitions     | MUST     |
| NFR7  | Compatibility - Next.js         | 13+ (App Router)                       | Integration tests    | MUST     |
| NFR8  | Compatibility - TypeScript      | 4.3+                                   | Type checking        | MUST     |
| NFR9  | Security - XSS Prevention       | React auto-escaping                    | Code review          | MUST     |
| NFR10 | Accessibility - API Provided    | Keyboard navigation API                | Documentation        | SHOULD   |
| NFR11 | Observability - Error Callbacks | onError callback available             | API tests            | SHOULD   |

## 5) Out of scope

The following items are explicitly NOT included:

- ❌ Default component implementations (users provide their own)
- ❌ Styling (users handle CSS/styling themselves)
- ❌ Data fetching (users handle API calls)
- ❌ Authentication/Authorization (users handle)
- ❌ Persistence (localStorage, IndexedDB, etc. - users handle)
- ❌ Server-side serialization (works without it, optional feature)
- ❌ Async operations (synchronous only in MVP)
- ❌ Default themes or UI components

**Won't do (this iteration)**:

- Document schema validation (Zod validation for state only, not document structure)
- Visual editor/builder (library provides rendering only)
- Real-time collaboration features

## 6) User flows

### Happy Path: Render Document

```
1. User installs library: pnpm add @lodado/sdui-template
2. User receives SDUI document from server (JSON)
3. User defines component map for node types
4. User renders document: <SduiLayoutRenderer document={doc} components={map} />
5. Library normalizes document
6. Library creates store and updates state
7. Library renders root node
8. Library recursively renders child nodes
9. Components subscribe to their node state
10. UI displays correctly
```

### Failure Mode 1: Invalid Document

```
1. User passes invalid document (missing root.id)
2. Library validates document
3. Library calls onError callback with error
4. Library creates empty store (fallback)
5. Library renders null (or fallback UI if provided)
6. User handles error via onError callback
```

### Failure Mode 2: Missing Component

```
1. User renders document with node type not in component map
2. Library resolves component factory
3. Library uses defaultComponentFactory (renders placeholder)
4. Library continues rendering other nodes
5. User can override via componentOverrides if needed
```

### Edge Case: Empty Children

```
1. User renders document with root node, children: []
2. Library renders root node
3. Library attempts to render children
4. Library finds empty array
5. Library renders root node only (no children)
6. No errors thrown
```

### Edge Case: Deep Nesting

```
1. User renders document with 10+ levels of nesting
2. Library normalizes recursive structure
3. Library renders recursively
4. Library handles stack depth (no stack overflow)
5. All nodes render correctly
```

## 7) Data/State model

### Core Entities

**SduiLayoutDocument**:

- `version: string` - Document version
- `metadata?: { id?, name?, description? }` - Optional metadata
- `root: SduiLayoutNode` - Root node (required)
- `variables?: Record<string, unknown>` - Global variables (optional)

**SduiLayoutNode**:

- `id: string` - Unique identifier
- `type: string` - Component type
- `state: BaseLayoutState` - Layout state (flexible, user-defined)
- `attributes?: Record<string, unknown>` - Additional attributes
- `children?: SduiLayoutNode[]` - Child nodes (recursive)

**BaseLayoutState**:

- Flexible structure: `[key: string]: unknown`
- User-defined shape
- Optional Zod schema validation via `useSduiNodeSubscription`

**Normalized Entities** (internal):

- `nodes: Record<string, SduiLayoutNode>` - Flat node map
- `layoutStates: Record<string, BaseLayoutState>` - State map
- `layoutAttributes: Record<string, Record<string, unknown>>` - Attributes map

### State Machine

```text
INITIAL
  └─[LOAD_DOCUMENT]→ LOADED
                      ├─[UPDATE_NODE]→ UPDATING
                      │                 └─[notify complete]→ LOADED
                      ├─[UPDATE_VARIABLES]→ LOADED
                      └─[RESET]→ INITIAL

* (all states)
  └─[ERROR]→ ERROR
```

**State Transitions**:

- `LOAD_DOCUMENT`: document.root.id must exist (guard)
- `UPDATE_NODE`: nodeId must exist in store (guard)
- `UPDATE_VARIABLES`: variables must be object (guard)
- `RESET`: Always allowed, returns to INITIAL

**Concurrency Rules**:

- All operations synchronous (no async in MVP)
- Latest update wins (no conflicts)
- No race conditions (synchronous only)

## 8) Interfaces

### Component API

```typescript
interface SduiLayoutRendererProps {
  document: SduiLayoutDocument // Required
  components?: Record<string, ComponentFactory> // Optional
  componentOverrides?: {
    byNodeId?: Record<string, ComponentFactory>
    byNodeType?: Record<string, ComponentFactory>
  }
  onLayoutChange?: (document: SduiLayoutDocument) => void
  onError?: (error: Error) => void
}
```

### Hook API

```typescript
// Store actions
useSduiLayoutAction(): SduiLayoutStore

// Node subscription
useSduiNodeSubscription<T>(params: {
  nodeId: string
  schema?: ZodSchema<T>
}): {
  node: SduiLayoutNode | undefined
  type: string | undefined
  state: T
  childrenIds: string[]
  attributes: Record<string, unknown> | undefined
  exists: boolean
}
```

### Store API

```typescript
class SduiLayoutStore {
  // Getters
  get state(): SduiLayoutStoreState
  get nodes(): Record<string, SduiLayoutNode>

  // Query
  getNodeById(nodeId: string): SduiLayoutNode | undefined
  getChildrenIdsById(nodeId: string): string[]

  // Update
  updateLayout(document: SduiLayoutDocument): void
  updateNodeState(nodeId: string, state: Partial<BaseLayoutState>): void

  // Subscribe
  subscribeNode(nodeId: string, callback: () => void): () => void
  subscribeVersion(callback: () => void): () => void

  // Utility
  reset(): void
}
```

### Error Model

- **InvalidDocumentError**: Document missing required fields (root.id)
- **NodeNotFoundError**: Node ID not found in store
- **SchemaValidationError**: Zod schema validation failed

**Error Handling**:

- Errors passed to `onError` callback
- Library continues rendering if possible (fallback)
- No exceptions thrown to user code (caught internally)

### Idempotency

- `updateLayout()`: Idempotent (same document → same state)
- `updateNodeState()`: Idempotent (same state → no change)
- `reset()`: Idempotent (always returns to INITIAL)

### Pagination/Caching

- No pagination (all nodes in memory)
- Document caching optional (via DocumentManager)
- Normalization caching optional (performance optimization)

## 9) Risks / Open questions / Assumptions

### Risks

1. **Performance Risk**: Normalization overhead for large documents

   - Mitigation: Caching, optimization, document size limits
   - Impact: High (affects initial render time)

2. **Memory Risk**: Large documents consume memory

   - Mitigation: Document size limits, cleanup on unmount
   - Impact: Medium (browser memory limits)

3. **Type Safety Risk**: Flexible state structure may cause runtime errors

   - Mitigation: Zod schema validation, TypeScript types
   - Impact: Medium (developer experience)

4. **Subscription Leak Risk**: Unsubscribed callbacks cause memory leaks
   - Mitigation: Strict cleanup in useEffect, tests
   - Impact: High (memory leaks)

### Open Questions

1. **Q1**: Should we support async operations in future?

   - **Answer**: Not in MVP, consider for future if needed

2. **Q2**: Should we provide default components?

   - **Answer**: No, users provide (out of scope)

3. **Q3**: Should we support document versioning?
   - **Answer**: Document has version field, but migration not supported

### Assumptions

1. Users use React 18+ (required)
2. Users use TypeScript (recommended, not required)
3. Users provide their own components (required)
4. Users handle styling themselves (required)
5. All operations synchronous (MVP assumption)
6. Browser environment only (client components)
7. Next.js App Router usage (primary target)

## 10) MVP + next steps

### MVP Scope

**Core Features (P0)**:

- ✅ Document rendering (SduiLayoutRenderer)
- ✅ State management (SduiLayoutStore)
- ✅ Subscription system (useSduiNodeSubscription)
- ✅ Component overrides (by type and ID)
- ✅ Next.js compatibility ("use client")
- ✅ TypeScript support (full types)
- ✅ Error handling (onError callback)

**Deferred Features (P1/P2)**:

- State updates (P1)
- Variable system (P1)
- Schema validation (P1)
- Document serialization (P2)

### Phased Rollout

**Phase 1: Core MVP**:

- Basic rendering
- Subscription system
- Component overrides
- Tests (scenario-first)

**Phase 2: Enhancements**:

- State updates
- Variable system
- Schema validation

**Phase 3: Optimization**:

- Performance tuning
- Bundle size optimization
- Memory optimization

### Test Strategy

**Scenario-First Tests** (P0 Required):

1. Render single root node
2. Render nested child nodes
3. Update node state
4. Component override by type
5. Component override by ID
6. Handle invalid document
7. Render empty children array
8. Handle deep nesting
9. Subscription system
10. Store reset

**EP/BVA Input Sampling**:

- Node count: 0, 1, 10, 100, 1000
- Nesting depth: 0, 1, 5, 10, 20
- Layout position: -1, 0, 5, 12, max
- Layout width: 0, 1, 6, 12, max

**Deterministic Tests**:

- All operations synchronous (no timing issues)
- No async/race conditions
- Explicit unsubscribe tests

### Next Steps

1. **Architecture Design** (`arch.md`): System structure and module decomposition
2. **Implementation Design** (`design-flow.md`): Detailed implementation plan
3. **Implementation** (`implements.md`): Actual code implementation
4. **Optimization** (`optimization.md`): Performance optimization
