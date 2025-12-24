# Implementation Design: SDUI Template Library

## Overview

This document explains the implementation design of the SDUI Template library. It provides a detailed plan for how to implement it, what file structure to use, and what testing strategy to employ.

## Implementation Goals

### What to Provide

**Components**:

- `SduiLayoutProvider`: Provides store via Context Provider
- `SduiLayoutRenderer`: Main component that renders SDUI documents

**Hooks**:

- `useSduiLayoutStores`: Select store state
- `useSduiLayoutAction`: Call store actions
- `useSduiNodeSubscription`: Subscribe to specific nodes
- `useRenderNode`: Generate node rendering function (internal)

**Types**:

- All public types and interfaces

**Tests**:

- Scenario tests (P0)
- Unit tests (P1)
- Integration tests (P1)

## File Structure

### Target Structure (FSD Compliant)

```text
apps/sdui-template/
├── src/
│   ├── index.ts                    # Public API exports
│   │
│   ├── schema/                     # Domain models
│   │   ├── index.ts
│   │   ├── document.ts             # SduiLayoutDocument
│   │   ├── node.ts                 # SduiLayoutNode
│   │   ├── state.ts                # BaseLayoutState, LayoutPosition
│   │   └── grid.ts                 # GridLayoutConfig
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
│   ├── react/                      # React integration
│   │   ├── index.ts
│   │   ├── context/
│   │   │   ├── index.ts
│   │   │   └── SduiLayoutContext.tsx
│   │   ├── hooks/
│   │   │   ├── index.ts
│   │   │   ├── useSduiLayoutStores.ts
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
│   │   ├── update-layout.test.tsx
│   │   └── component-override.test.tsx
│   └── utils/
│       └── test-utils.tsx
│
├── package.json
├── tsconfig.json
└── README.md
```

## Key Implementation Details

### 1. Component Override Resolution

**Priority**: ID override > type override > default factory

```typescript
// Inside useRenderNode
const factory =
  overrides[id] || // 1st priority: ID-based
  overrides[node.type] || // 2nd priority: type-based
  componentMap[node.type] || // 3rd priority: component map
  defaultComponentFactory // 4th priority: default factory
```

### 2. Subscription System

**Implementation Approach**:

- Efficient lookups with `Map<nodeId, Set<callbacks>>`
- Version subscription uses `Set<callbacks>` for global updates
- Unsubscribe removes from Set (O(1) average)

**Memory Management**:

- Subscription cleanup required on component unmount
- Call unsubscribe in `useEffect` cleanup

### 3. Normalization

**Implementation Approach**:

- Handle recursive structures with normalizr
- Separate state and attributes into separate entities
- Store childrenIds in nodes for denormalization support

**Optimization**:

- Caching to prevent re-normalizing same document (optional)

### 4. Hook Optimization

**Memoization Strategy**:

- `useSduiLayoutStores`: Memoize selector results with `useMemo`
- `useSduiNodeSubscription`: Subscribe only to specific nodes
- `useRenderNode`: Maintain stable reference with `useCallback`

## State Machine

### State Transitions

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

### Guard Conditions

- `LOAD_DOCUMENT`: document.root.id must exist
- `UPDATE_NODE`: nodeId must exist in store
- `UPDATE_VARIABLES`: variables must be an object

## Testing Strategy

### Scenario Tests (P0 Required)

1. **Render Single Root Node**

   - Document with only root node
   - Verify root node renders correctly

2. **Render Nested Child Nodes**

   - 3-level nested structure
   - Verify all nodes render in correct hierarchy

3. **Update Node Layout**

   - Update one node's layout
   - Verify only that node re-renders

4. **Component Override by Type**

   - Override specific type's component
   - Verify overridden component is used

5. **Component Override by ID**

   - Override specific node ID's component
   - Verify ID override has higher priority than type override

6. **Handle Invalid Document**

   - Document missing root.id
   - Verify onError callback is called

7. **Render Empty Children Array**

   - children: [] case
   - Verify renders without errors

8. **Handle Deep Nesting**

   - 10 levels of nesting
   - Verify all nodes render and performance is acceptable

9. **Subscription System**

   - Subscribe to multiple nodes
   - Verify only updated node's subscribers are notified when one is updated

10. **Store Reset**
    - Load document, then reset
    - Verify store returns to initial state and subscriptions are cleaned up

### Boundary Value Analysis (BVA)

| Input Category    | Boundary Values     | Reason              |
| ----------------- | ------------------- | ------------------- |
| Node Count        | 0, 1, 10, 100, 1000 | Performance testing |
| Nesting Depth     | 0, 1, 5, 10, 20     | Recursion limits    |
| Layout X Position | -1, 0, 5, 12, max   | Boundary validation |
| Layout Width      | 0, 1, 6, 12, max    | Size constraints    |

## Error Handling

### Error States

**Invalid Document**:

- Call `onError` callback
- Continue rendering if possible (fallback UI)

**Node Not Found**:

- Query methods return `undefined`
- Update methods throw `NodeNotFoundError`

### Empty States

**No Children**:

- Root renders, children array is empty
- No errors thrown
- Users can provide empty state UI

### Loading States

**Not Needed in MVP**:

- All operations are synchronous
- No loading state needed
- Future: Provide loading state via store state if async operations added

## Performance Considerations

### Bundle Size

- **Target**: < 50KB (gzipped)
- **Measurement**: Use bundle analyzer
- **Optimization**: Enable tree-shaking, remove unnecessary dependencies

### Render Performance

- **Initial Rendering**: < 100ms for 100 nodes
- **Re-rendering**: Updates only changed nodes (maintain 60fps)
- **Measurement**: Use React Profiler

### Optimization Techniques

- Subscription-based re-rendering (only changed nodes)
- Memoized selectors (`useMemo`)
- Stable references (store instance, render function)

## Implementation Checklist

### Completion Criteria

- [ ] All P0 user flows implemented and scenario tests pass
- [ ] Async flows are deterministic (no timing, all synchronous)
- [ ] Accessibility basics (keyboard navigation API provided)
- [ ] Error and empty states defined (error callbacks, fallback handling)
- [ ] TypeScript types exported correctly
- [ ] Next.js App Router compatible ("use client" directive)
- [ ] SSR support implemented (server/client component separation)
- [ ] Bundle size < 50KB gzipped (measured)
- [ ] No memory leaks (unmount test)

## SSR Support

### 1) Deliverables & Done Criteria

#### 1.1 Deliverables

**Core Components (P0 Required)**:

- `SduiLayoutRenderer`: Client component (already SSR-compatible, verify)
- SSR rendering tests: Verify component works correctly in SSR context

**Optional Components (P1 - Only if serialization needed)**:

- `SduiLayoutRendererServer`: Server component for SSR with serialization (new)
- `SduiLayoutStore.serializeState()`: Serialize store state to JSON
- `SduiLayoutStore.hydrateState()`: Hydrate store from serialized state
- `SerializedStoreState`: Serializable store state interface
- Updated `SduiLayoutRendererProps` with optional `serializedState`
- `server.ts`: Server component exports (new entry point)

**Tests**:

- SSR scenario tests (P0) - Verify SSR works without serialization
- Progressive enhancement tests (P0) - Verify client-only fallback
- Serialization tests (P1) - Only if serialization implemented

#### 1.2 Done Criteria

**Core Requirements**:

- [ ] Works without serializedState (client-only fallback) - **Primary use case**
- [ ] Server component renders document correctly (if implemented)
- [ ] No browser APIs used in server component
- [ ] Same document produces same rendering result on server and client

**Serialization (Optional)**:

- [ ] If implemented: Server component serializes state correctly
- [ ] If implemented: Client component hydrates from serialized state correctly
- [ ] If implemented: Hydration mismatch errors handled gracefully
- [ ] If implemented: Subscription system excluded from serialization
- [ ] If implemented: State serialization is deterministic (no timing dependencies)
- [ ] If implemented: XSS prevention in serialized state (JSON.stringify only)

**Note**: Serialization is **optional**. Current implementation works correctly without it. Add serialization only if profiling shows normalization is a performance bottleneck.

---

### 2) UI/UX Interaction Design

**Visual States**:

- **Server**: No UI (data preparation only)
- **Client (with SSR)**: Renders immediately with hydrated state
- **Client (without SSR)**: Renders after document fetch (loading state)

**Interaction Rules**:

- Server component: No user interactions (data-only)
- Client component: Same as existing (no changes to interaction)

**Accessibility**:

- No changes to existing a11y (server component is transparent to users)
- Focus management unchanged (client-only concern)

---

### 3) Detailed State Design

#### 3.1 State Classification

**Server State** (serialized, optional):

- `SduiLayoutStoreState`: Store state (version, rootId, nodes, variables)
- `layoutStates`: Layout state map
- `layoutAttributes`: Layout attributes map
- `metadata`: Document metadata

**Client State** (not serialized):

- Subscription system (client-only)
- Component overrides (client-only)
- Browser-specific state

**Note on Serialization**:

- **Serialization is optional**: Current implementation works without serialization
- **Same document → same result**: If `document` is identical, `normalizeSduiLayout()` produces identical results on both server and client
- **React hydration succeeds**: Server HTML matches client HTML, no hydration mismatch
- **Performance trade-off**: Serialization adds JSON.stringify/parse overhead; normalization is O(n) on both sides
- **When serialization helps**: Only when server has data unavailable to client, or when avoiding duplicate normalization is critical

#### 3.2 State Machine

```text
SERVER_INITIAL
  └─[LOAD_DOCUMENT]→ SERVER_LOADED
                      └─[SERIALIZE]→ SERIALIZED
                                     └─[SEND_TO_CLIENT]→ CLIENT_RECEIVED
                                                          └─[HYDRATE]→ CLIENT_HYDRATED
                                                                         └─[INIT_SUBSCRIPTIONS]→ CLIENT_READY

CLIENT_INITIAL (fallback)
  └─[LOAD_DOCUMENT]→ CLIENT_LOADED
                      └─[INIT_SUBSCRIPTIONS]→ CLIENT_READY
```

**Guards**:

- `SERIALIZE`: Document must be loaded, store must be initialized
- `HYDRATE`: Serialized state must be valid JSON, structure must match
- `INIT_SUBSCRIPTIONS`: Must be in browser environment

#### 3.3 Concurrency Design

**Current Approach (No Serialization)**:

- Server: `normalizeSduiLayout(document)` → O(n)
- Client: `normalizeSduiLayout(document)` → O(n)
- Total cost: 2 × O(n)
- **Works correctly**: Same document produces same result, React hydration succeeds

**Serialization Approach (Optional)**:

- Server: `normalizeSduiLayout(document)` + `JSON.stringify()` → O(n) + O(n)
- Client: `JSON.parse()` + `hydrateState()` → O(n) + O(n)
- Total cost: 4 × O(n)
- **Trade-off**: Adds serialization overhead, but avoids duplicate normalization

**Recommendation**:

- **Default**: Use current approach (no serialization) - simpler, sufficient for most cases
- **Consider serialization**: Only if normalization is expensive AND server has unique data
- **Synchronous**: All operations are synchronous (no async, no race conditions)

---

### 4) Contracts & Types

#### 4.1 Public Interfaces

```typescript
/**
 * Serializable store state
 * Subscription system excluded (client-only)
 */
export interface SerializedStoreState {
  /** Store state */
  state: SduiLayoutStoreState
  /** Layout state map */
  layoutStates: Record<string, BaseLayoutState>
  /** Layout attributes map */
  layoutAttributes: Record<string, Record<string, unknown>>
  /** Document metadata */
  metadata?: SduiLayoutDocument['metadata']
}

/**
 * Server component props
 */
export interface SduiLayoutRendererServerProps {
  /** SDUI Layout Document */
  document: SduiLayoutDocument
  /** Custom component map */
  components?: Record<string, ComponentFactory>
  /** Component overrides */
  componentOverrides?: {
    byNodeId?: Record<string, ComponentFactory>
    byNodeType?: Record<string, ComponentFactory>
  }
  /** Error callback */
  onError?: (error: Error) => void
}

/**
 * Client component props (updated)
 */
export interface SduiLayoutRendererProps {
  /** SDUI Layout Document */
  document: SduiLayoutDocument
  /** Serialized state from SSR (optional) */
  serializedState?: SerializedStoreState
  // ... existing props
}
```

#### 4.2 Store Methods

```typescript
class SduiLayoutStore {
  /**
   * Serialize current store state to JSON-serializable format
   *
   * @returns Serialized store state
   * @throws Never throws (always returns valid object)
   */
  serializeState(): SerializedStoreState

  /**
   * Hydrate store from serialized state
   *
   * @param serialized - Serialized store state
   * @throws Error if serialized state is invalid
   */
  hydrateState(serialized: SerializedStoreState): void
}
```

#### 4.3 Invariants

- **Serialization (if used)**: Must always produce valid JSON (no functions, no circular refs)
- **Hydration (if used)**: Must restore exact same state structure as serialization
- **Subscription System**: Never serialized (client-only)
- **Component Overrides**: Never serialized (client-only)
- **Progressive Enhancement**: Works without serializedState (fallback to client-only)
- **Deterministic Rendering**: Same `document` always produces same rendering result (with or without serialization)

**Failure Behavior**:

- Invalid serialized state: Throw error, fallback to client-only initialization
- Hydration mismatch: Log warning, fallback to client-only initialization
- Missing serializedState: Normal client-only initialization (not an error)

**Performance Considerations**:

- **Without serialization**: Server and client both run `normalizeSduiLayout()` - acceptable for most cases
- **With serialization**: Adds JSON overhead but avoids duplicate normalization - only beneficial if normalization is expensive
- **Recommendation**: Start without serialization, add only if profiling shows normalization is a bottleneck

---

### 5) File/Folder Structure

```text
apps/sdui-template/
├── src/
│   ├── react/
│   │   ├── components/
│   │   │   ├── SduiLayoutRenderer.tsx           # Client component (updated)
│   │   │   └── SduiLayoutRenderer.server.tsx    # Server component (new)
│   │   └── ...
│   ├── store/
│   │   ├── SduiLayoutStore.ts                    # Add serializeState, hydrateState
│   │   └── types.ts                              # Add SerializedStoreState
│   └── ...
│
├── server.ts                                     # Server exports (new)
│   export { SduiLayoutRendererServer } from './react/components/SduiLayoutRenderer.server'
│   export type { SduiLayoutRendererServerProps } from './react/components/SduiLayoutRenderer.server'
│
└── index.ts                                      # Client exports (existing)
```

**Export Boundaries**:

- `server.ts`: Server component exports (public)
- `index.ts`: Client component exports (public, existing)
- Internal: Store serialization methods (public API)

---

### 6) Implementation Plan (Small PRs)

#### PR1: Basic SSR Support (Required)

- **Files**: `react/components/SduiLayoutRenderer.tsx`
- **Scope**: Ensure component works correctly in SSR context (already works, verify)
- **Risks**: None (current implementation is SSR-compatible)
- **Test Coverage**: SSR rendering tests
- **Note**: Current implementation already works - just verify SSR compatibility

#### PR2: Types + Contracts (Optional - Only if serialization needed)

- **Files**: `store/types.ts`
- **Scope**: Define `SerializedStoreState` type
- **Risks**: Type compatibility
- **Test Coverage**: Type tests
- **Priority**: P1 (optional)

#### PR3: Store Serialization (Optional - Only if serialization needed)

- **Files**: `store/SduiLayoutStore.ts`
- **Scope**: Implement `serializeState()` method
- **Risks**: State structure changes
- **Test Coverage**: Unit tests
- **Priority**: P1 (optional)

#### PR4: Store Hydration (Optional - Only if serialization needed)

- **Files**: `store/SduiLayoutStore.ts`
- **Scope**: Implement `hydrateState()` method
- **Risks**: Hydration correctness
- **Test Coverage**: Unit tests
- **Priority**: P1 (optional)

#### PR5: Server Component (Optional - Only if serialization needed)

- **Files**: `react/components/SduiLayoutRenderer.server.tsx`
- **Scope**: Implement server component with serialization
- **Risks**: Server/client boundary
- **Test Coverage**: SSR scenario tests
- **Priority**: P1 (optional)

#### PR6: Client Hydration (Optional - Only if serialization needed)

- **Files**: `react/components/SduiLayoutRenderer.tsx`
- **Scope**: Update client component to support hydration
- **Risks**: Hydration integration
- **Test Coverage**: Hydration tests
- **Priority**: P1 (optional)

#### PR7: SSR Scenario Tests

- **Files**: `__tests__/scenario/ssr.test.tsx`
- **Scope**: Write P0 scenario tests for SSR (without serialization)
- **Risks**: Test coverage
- **Test Coverage**: P0 scenarios
- **Priority**: P0 (required)

#### PR8: Serialization Tests (Optional - Only if serialization implemented)

- **Files**: `__tests__/scenario/ssr-serialization.test.tsx`
- **Scope**: Write tests for serialization/hydration
- **Risks**: Test coverage
- **Test Coverage**: Serialization scenarios
- **Priority**: P1 (optional)

#### PR9: Documentation

- **Files**: `README.md`, `server.ts` exports (if implemented)
- **Scope**: Update API documentation
- **Risks**: API clarity
- **Test Coverage**: N/A
- **Priority**: P0 (required)

**PR Size**: Each PR < 400 LOC net new

**Shippable**:

- PR1 (Basic SSR): Can ship immediately (already works)
- PR2-6 (Serialization): Only if profiling shows normalization is bottleneck
- PR7 (SSR Tests): Required for SSR support
- PR8 (Serialization Tests): Only if serialization implemented
- PR9 (Docs): Required

---

### 7) Test Design

#### 7.1 Scenario Tests (P0 Required)

#### Test 1: SSR Rendering (P0 Required)

- **As**: `SduiLayoutRenderer` renders on server
- **When**: Component receives document in SSR context
- **Should**: Render correctly, produce same HTML as client, no hydration mismatch

#### Test 2: Client Hydration (P0 Required)

- **As**: Client receives server-rendered HTML
- **When**: `SduiLayoutRenderer` hydrates on client
- **Should**: Hydrate successfully, subscriptions initialize, no errors

#### Test 3: Same Document Same Result (P0 Required)

- **As**: Same document used on server and client
- **When**: Both render with same document
- **Should**: Produce identical rendering results, store state matches

#### Test 4: Progressive Enhancement (P0 Required)

- **As**: Client component renders without SSR
- **When**: `SduiLayoutRenderer` renders in client-only context
- **Should**: Initialize store normally, render correctly, no errors

#### Test 5: Server Component with Serialization (P1 Optional)

- **As**: Server component receives document
- **When**: `SduiLayoutRendererServer` renders with document
- **Should**: Serialize store state correctly, pass to client component

#### Test 6: Client Hydration with Serialization (P1 Optional)

- **As**: Client component receives serialized state
- **When**: `SduiLayoutRenderer` hydrates store from serialized state
- **Should**: Store state matches serialized state, subscriptions initialized

#### Test 7: Hydration Mismatch (P1 Optional)

- **As**: Client receives invalid serialized state
- **When**: `hydrateState()` called with invalid data
- **Should**: Throw error, fallback to client-only initialization

#### Test 8: State Serialization Correctness (P1 Optional)

- **As**: Store has loaded document
- **When**: `serializeState()` called
- **Should**: Return valid JSON, exclude subscription system, include all state

#### Test 9: State Hydration Correctness (P1 Optional)

- **As**: Valid serialized state exists
- **When**: `hydrateState()` called
- **Should**: Restore exact same state structure, initialize subscriptions

#### 7.2 EP/BVA Input Table

#### Serialized State Size

- Boundary Values: 0KB, 1KB, 100KB, 1MB
- Reason: Performance testing

#### Document Node Count

- Boundary Values: 0, 1, 10, 100, 1000
- Reason: Serialization performance

#### Hydration State Validity

- Boundary Values: Valid, Invalid structure, Missing fields
- Reason: Error handling

#### 7.3 Deterministic Tests

- **No async operations**: All serialization/hydration is synchronous
- **No timing dependencies**: No debounce, no delays
- **Deterministic serialization**: Same input always produces same output

---

### 8) Quality Gates

**Core SSR Requirements (P0)**:

- [ ] Works correctly in SSR context (server renders, client hydrates)
- [ ] Same document produces same rendering result (no hydration mismatch)
- [ ] Progressive enhancement works (client-only fallback)
- [ ] No browser APIs used in server rendering
- [ ] Subscription system initializes correctly on client

**Serialization Requirements (P1 - Only if implemented)**:

- [ ] Serialization produces valid JSON (no functions, no circular refs)
- [ ] Hydration restores exact state structure
- [ ] Error handling graceful (invalid state → fallback)
- [ ] Subscription system excluded from serialization
- [ ] Component overrides excluded from serialization
- [ ] XSS prevention (JSON.stringify only, no eval)
- [ ] State size optimized (large documents handled)

**Documentation**:

- [ ] ADR updated for SSR architecture decision
- [ ] README documents SSR support (with/without serialization)
- [ ] Performance considerations documented

## Known Limitations

- ~~No SSR support (client only)~~ ✅ **SSR support added** (works without serialization)
- **Serialization is optional**: Current implementation works without state serialization. Add serialization only if profiling shows normalization is a bottleneck.
- No persistence (users handle)
- No default styles (users provide)
- No default components (users provide)
- No async operations (synchronous only)

## Next Steps

Based on this design:

1. **Implementation** (`implements.md`): Actual code implementation
2. **Optimization** (`optimization.md`): Performance optimization
