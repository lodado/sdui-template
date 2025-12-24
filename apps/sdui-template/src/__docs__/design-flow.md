---
description: design-flow
---

# Implementation Design: SDUI Template Library

## 1) Deliverables + Done Criteria

### 1.1 Deliverables

**UI Components**:

- `SduiLayoutProvider`: Context Provider component
- `SduiLayoutRenderer`: Main renderer component

**Hooks**:

- `useSduiLayoutAction`: Action hook (returns store instance)
- `useSduiNodeSubscription`: Node subscription hook
- `useRenderNode`: Render function hook (internal)

**Types/Schemas**:

- `SduiLayoutDocument`: Document type
- `SduiLayoutNode`: Node type
- `BaseLayoutState`: State type
- `ComponentFactory`: Factory type
- `RenderNodeFn`: Render function type
- `SduiLayoutStoreState`: Store state type
- `SduiLayoutStoreOptions`: Store options type

**Tests**:

- Scenario tests (P0): 10+ tests
- Unit tests (P1): Optional for pure helpers

**Docs**:

- JSDoc for all public APIs
- README.md with usage guide
- ADR updates for key decisions

**Optional**:

- Storybook (not in MVP)
- Fixtures (test utilities only)

### 1.2 Done Criteria (non-negotiable)

- [x] All P0 user flows implemented and have scenario tests
- [x] Async flows are deterministic (no async in MVP, all synchronous)
- [x] Accessibility basics covered (API provided, users implement)
- [x] Error & empty states defined (onError callback, fallback handling)
- [x] Logging/metrics hooks exist (onError callback)
- [x] File structure follows team conventions
- [x] TypeScript types exported correctly
- [x] Next.js App Router compatible ("use client" directive)
- [x] Bundle size < 50KB gzipped (measured)
- [x] No memory leaks (unsubscribe tests)

## 2) UI State & Interaction Rules

### UI State Table

| State   | Description              | Trigger             | Visual/Behavior                         |
| ------- | ------------------------ | ------------------- | --------------------------------------- |
| Initial | No document loaded       | Component mount     | Renders null                            |
| Loading | Document being processed | Document received   | Renders null (synchronous, instant)     |
| Loaded  | Document rendered        | Document normalized | Renders component tree                  |
| Error   | Invalid document         | Validation failure  | Calls onError, renders null or fallback |
| Empty   | No children              | children: []        | Renders root only, no children          |

**Note**: All operations are synchronous, so "Loading" state is theoretical (instant).

### Interaction Rules Table

| Interaction      | Mouse        | Keyboard     | Focus/Blur   | Behavior                       |
| ---------------- | ------------ | ------------ | ------------ | ------------------------------ |
| Component Render | N/A          | N/A          | N/A          | Auto-render on mount           |
| State Update     | User handles | User handles | User handles | Library provides API only      |
| Error Display    | User handles | User handles | User handles | Library calls onError callback |

**Note**: Library provides API only. Users implement interactions in their components.

### A11y Mapping Table

| Element          | Role         | ARIA         | Keyboard     | Focus        |
| ---------------- | ------------ | ------------ | ------------ | ------------ |
| Root Container   | N/A          | N/A          | N/A          | N/A          |
| Child Components | User-defined | User-defined | User-defined | User-defined |

**Note**: Library provides structure only. Users implement accessibility in their components.

## 3) State Machine + Concurrency Rules

### State Classification

| State Type      | Examples                          | Source of Truth | Lifecycle                  |
| --------------- | --------------------------------- | --------------- | -------------------------- |
| Server State    | nodes, layoutStates, variables    | Document        | Updated via updateLayout() |
| Client/UI State | selectedNodeId, isEdited          | Store           | Updated via store methods  |
| Derived State   | childrenIds, component resolution | Computed        | Re-computed on access      |

### State Machine Definition

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

**States**:

- `INITIAL`: No document loaded
- `LOADED`: Document loaded and rendered
- `UPDATING`: Node state being updated
- `ERROR`: Error occurred

**Events**:

- `LOAD_DOCUMENT`: Document received
- `UPDATE_NODE`: Node state update requested
- `UPDATE_VARIABLES`: Variables update requested
- `RESET`: Store reset requested
- `ERROR`: Error occurred

**Transitions**:

- `LOAD_DOCUMENT`: document.root.id must exist (guard)
- `UPDATE_NODE`: nodeId must exist in store (guard)
- `UPDATE_VARIABLES`: variables must be object (guard)
- `RESET`: Always allowed

**Guards**:

- `LOAD_DOCUMENT`: `document.root.id !== undefined`
- `UPDATE_NODE`: `store.getNodeById(nodeId) !== undefined`
- `UPDATE_VARIABLES`: `typeof variables === 'object'`

### Concurrency Design

**Current Approach (Synchronous)**:

- All operations synchronous (no async in MVP)
- Latest update wins (no conflicts)
- No race conditions (synchronous only)
- No cancellation needed (synchronous only)

**Future (if async added)**:

- Latest user intent wins (cancellation via AbortController)
- Sequence guards (prevent stale updates)
- Idempotent operations (safe to retry)

## 4) Contracts & Types (TS)

### Public Interfaces

**Component Props**:

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

interface SduiLayoutProviderProps {
  store: SduiLayoutStore
  children: React.ReactNode
}
```

**Hook Returns**:

```typescript
// useSduiLayoutAction
(): SduiLayoutStore

// useSduiNodeSubscription
<T>(params: {
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

// useRenderNode (internal)
(componentMap?: Record<string, ComponentFactory>): RenderNodeFn
```

**Callbacks**:

```typescript
type ErrorCallback = (error: Error) => void
type LayoutChangeCallback = (document: SduiLayoutDocument) => void
```

**Error Shapes**:

```typescript
class InvalidDocumentError extends Error {
  constructor(message: string, public document: unknown) {
    super(message)
    this.name = 'InvalidDocumentError'
  }
}

class NodeNotFoundError extends Error {
  constructor(public nodeId: string) {
    super(`Node not found: ${nodeId}`)
    this.name = 'NodeNotFoundError'
  }
}

class SchemaValidationError extends Error {
  constructor(public nodeId: string, public validationError: z.ZodError) {
    super(`Schema validation failed for node "${nodeId}"`)
    this.name = 'SchemaValidationError'
  }
}
```

### Domain Types

**Entity Types**:

```typescript
interface SduiLayoutDocument {
  version: string
  metadata?: {
    id?: string
    name?: string
    description?: string
  }
  root: SduiLayoutNode
  variables?: Record<string, unknown>
}

interface SduiLayoutNode {
  id: string
  type: string
  state: BaseLayoutState
  attributes?: Record<string, unknown>
  children?: SduiLayoutNode[]
}

interface BaseLayoutState {
  [key: string]: unknown
}
```

**Request/Response DTOs**:

- Not applicable (synchronous operations, no network)

**Enums**:

- Not applicable (no status enums)

### Invariants (Design by Contract)

**Must Always Hold True**:

- Document must have `root.id` (enforced by validation)
- Node IDs must be unique within document (enforced by normalization)
- Subscription callbacks must be unsubscribed on unmount (enforced by useEffect cleanup)
- Store state must be normalized (enforced by updateLayout)

**Failure Behavior**:

- Invalid document: Call `onError`, create empty store, return null
- Node not found: Return `undefined` (query methods), throw error (update methods)
- Schema validation failure: Throw `SchemaValidationError` in hook
- Subscription leak: Prevented by useEffect cleanup (tested)

## 5) File/Folder Structure

### Target Structure

```text
apps/sdui-template/
├── src/
│   ├── index.ts                    # Public API exports
│   │
│   ├── schema/                     # Domain models
│   │   ├── index.ts
│   │   ├── document.ts             # SduiLayoutDocument
│   │   ├── node.ts                 # SduiLayoutNode
│   │   ├── state.ts                # BaseLayoutState
│   │   └── base.ts                 # Base types
│   │
│   ├── store/                      # State management
│   │   ├── index.ts
│   │   ├── SduiLayoutStore.ts      # Main store class
│   │   ├── managers/
│   │   │   ├── index.ts
│   │   │   ├── SubscriptionManager.ts
│   │   │   ├── LayoutStateRepository.ts
│   │   │   ├── DocumentManager.ts
│   │   │   └── VariablesManager.ts
│   │   └── types.ts                # StoreState, StoreOptions
│   │
│   ├── utils/                      # Utilities
│   │   ├── index.ts
│   │   └── normalize/
│   │       ├── index.ts
│   │       ├── normalize.ts        # normalizeSduiLayout
│   │       ├── denormalize.ts      # denormalizeSduiLayout
│   │       └── types.ts            # NormalizedSduiEntities
│   │
│   ├── react-wrapper/              # React integration
│   │   ├── index.ts
│   │   ├── context/
│   │   │   ├── index.ts
│   │   │   └── SduiLayoutContext.tsx
│   │   ├── hooks/
│   │   │   ├── index.ts
│   │   │   ├── useSduiLayoutAction.ts
│   │   │   ├── useSduiNodeSubscription.ts
│   │   │   └── useRenderNode.ts
│   │   └── components/
│   │       ├── index.ts
│   │       └── SduiLayoutRenderer.tsx
│   │
│   └── components/                 # Component system
│       ├── index.ts
│       ├── componentMap.tsx        # Default (empty) component map
│       └── types.ts                # ComponentFactory, RenderNodeFn
│
├── __tests__/                      # Tests
│   ├── scenario/
│   │   ├── render-document.test.tsx
│   │   ├── update-state.test.tsx
│   │   ├── component-override.test.tsx
│   │   ├── error-handling.test.tsx
│   │   ├── subscription.test.tsx
│   │   ├── store-reset.test.tsx
│   │   └── zod-validation.test.tsx
│   └── utils/
│       └── test-utils.tsx
│
├── package.json
├── tsconfig.json
└── README.md
```

### Export Boundaries

**Public** (`src/index.ts`):

- Components: `SduiLayoutRenderer`, `SduiLayoutProvider`
- Hooks: `useSduiLayoutAction`, `useSduiNodeSubscription`
- Store: `SduiLayoutStore`
- Types: All public types
- Utilities: `normalizeSduiLayout`, `denormalizeSduiLayout` (optional)

**Private** (internal):

- Managers (SubscriptionManager, LayoutStateRepository, etc.)
- Internal hooks (`useRenderNode`)
- Internal utilities

## 6) PR Plan

| PR#  | Scope              | Files                                                           | Risks                 | Tests Added        | Acceptance Checks                  |
| ---- | ------------------ | --------------------------------------------------------------- | --------------------- | ------------------ | ---------------------------------- |
| PR1  | Types + Contracts  | `src/schema/*`, `src/store/types.ts`, `src/components/types.ts` | Type compatibility    | Type tests         | TypeScript compiles                |
| PR2  | Scaffold           | File tree, exports, empty shells                                | Structure changes     | N/A                | Files exist, exports work          |
| PR3  | Normalization      | `src/utils/normalize/*`                                         | Normalizr integration | Unit tests         | Normalize → denormalize round-trip |
| PR4  | Store Managers     | `src/store/managers/*`                                          | State consistency     | Unit tests         | Managers work independently        |
| PR5  | Store Core         | `src/store/SduiLayoutStore.ts`                                  | Integration           | Integration tests  | Store methods work                 |
| PR6  | React Context      | `src/react-wrapper/context/*`                                   | Context usage         | Integration tests  | Provider works                     |
| PR7  | Hooks              | `src/react-wrapper/hooks/*`                                     | Hook behavior         | Integration tests  | Hooks work with Provider           |
| PR8  | Renderer Component | `src/react-wrapper/components/*`                                | Component rendering   | Scenario tests     | Basic rendering works              |
| PR9  | Component System   | `src/components/*`                                              | Factory resolution    | Unit tests         | Override priority works            |
| PR10 | Scenario Tests     | `__tests__/scenario/*`                                          | Test coverage         | 10+ scenario tests | All P0 tests pass                  |
| PR11 | Public API         | `src/index.ts`                                                  | Export correctness    | Export tests       | All public APIs exported           |
| PR12 | Documentation      | `README.md`, JSDoc                                              | API clarity           | N/A                | Docs complete                      |

**PR Size**: Each PR < 400 LOC net new

**Shippable**: Each PR can be merged independently (except PR10 requires PR1-9)

## 7) Test Plan (Scenario + EP/BVA + Race)

### Scenario Test List (6-10)

1. **Render Single Root Node**

   - As is: Empty store
   - When: Document with only root node rendered
   - To be: Root node renders correctly
   - Should: Display root component

2. **Render Nested Child Nodes**

   - As is: Empty store
   - When: Document with 3-level nesting rendered
   - To be: All nodes render in correct hierarchy
   - Should: Display nested structure

3. **Update Node State**

   - As is: Document loaded, node subscribed
   - When: store.updateNodeState() called
   - To be: Only that node re-renders
   - Should: Other nodes unchanged

4. **Component Override by Type**

   - As is: Document with node type "Card"
   - When: Override provided for "Card" type
   - To be: Overridden component used
   - Should: Default component not used

5. **Component Override by ID**

   - As is: Document with node ID "card-1" type "Card"
   - When: Override provided for "card-1" ID
   - To be: ID override used (higher priority than type)
   - Should: Type override not used

6. **Handle Invalid Document**

   - As is: Empty store
   - When: Document missing root.id passed
   - To be: onError callback called
   - Should: Component renders null or fallback

7. **Render Empty Children Array**

   - As is: Empty store
   - When: Document with root, children: [] rendered
   - To be: Root renders, no children
   - Should: No errors thrown

8. **Handle Deep Nesting**

   - As is: Empty store
   - When: Document with 10 levels of nesting rendered
   - To be: All nodes render correctly
   - Should: Performance acceptable, no stack overflow

9. **Subscription System**

   - As is: Multiple nodes subscribed
   - When: One node updated
   - To be: Only that node's subscribers notified
   - Should: Other nodes unchanged

10. **Store Reset**
    - As is: Document loaded, nodes subscribed
    - When: store.reset() called
    - To be: Store returns to initial state
    - Should: Subscriptions cleaned up

### EP/BVA Input Table

| Input Category    | Boundary Values                 | Reason              | Test Case                                 |
| ----------------- | ------------------------------- | ------------------- | ----------------------------------------- |
| Node Count        | 0, 1, 10, 100, 1000             | Performance testing | Render documents with varying node counts |
| Nesting Depth     | 0, 1, 5, 10, 20                 | Recursion limits    | Render documents with varying depths      |
| Layout X Position | -1, 0, 5, 12, max               | Boundary validation | Test layout position boundaries           |
| Layout Width      | 0, 1, 6, 12, max                | Size constraints    | Test layout width boundaries              |
| Document Version  | "", "1.0.0", "999.999.999"      | Version format      | Test version string handling              |
| Node ID           | "", "a", "node-1", very-long-id | ID format           | Test node ID handling                     |

### Race Test Design

**Not Applicable**: All operations synchronous (no async in MVP)

**Future (if async added)**:

- Test: Latest user intent wins
- Method: Deferred promises, control resolution order
- Verify: Late responses don't override new results

## 8) Quality Gates

### Quality Gate Checklist

- [x] No implementation-detail assertions in tests (test behavior only)
- [x] Keyboard-only flow works (API provided, users implement)
- [x] Focus behavior matches spec (API provided, users implement)
- [x] Error and empty UX defined and tested (onError callback, fallback)
- [x] Performance budget notes (Bundle < 50KB, render < 100ms)
- [x] ADR updated for any architectural deviation (see arch.md)

### Known Limitations

- SSR support (works without serialization)
- No persistence (users handle)
- No default styles (users provide)
- No default components (users provide)
- No async operations (synchronous only)
