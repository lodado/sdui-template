---
description: implements
---

# Implementation Guide: SDUI Template Library

## 1) PR Plan (table)

| PR# | Scope | Files | Risks | Tests Added | Acceptance Checks |
|-----|-------|-------|-------|-------------|------------------|
| PR1 | Contracts & Types | `src/schema/*`, `src/store/types.ts`, `src/components/types.ts` | Type compatibility | Type tests | TypeScript compiles, types exported |
| PR2 | Scaffold | File tree, `src/index.ts`, empty shells | Structure changes | N/A | Files exist, exports work |
| PR3 | Normalization | `src/utils/normalize/*` | Normalizr integration | Unit tests | Normalize → denormalize round-trip |
| PR4 | Store Managers | `src/store/managers/*` | State consistency | Unit tests | Managers work independently |
| PR5 | Store Core | `src/store/SduiLayoutStore.ts` | Integration | Integration tests | Store methods work |
| PR6 | React Context | `src/react-wrapper/context/*` | Context usage | Integration tests | Provider works |
| PR7 | Hooks | `src/react-wrapper/hooks/*` | Hook behavior | Integration tests | Hooks work with Provider |
| PR8 | Renderer Component | `src/react-wrapper/components/*` | Component rendering | Scenario tests | Basic rendering works |
| PR9 | Component System | `src/components/*` | Factory resolution | Unit tests | Override priority works |
| PR10 | Scenario Tests | `__tests__/scenario/*` | Test coverage | 10+ scenario tests | All P0 tests pass |

**PR Size**: Each PR < 400 LOC net new

**Shippable**: Each PR can be merged independently (except PR10 requires PR1-9)

## 2) Contracts (types + JSDoc policy bullets)

### TypeScript Types

**Document Types**:
```typescript
/**
 * SDUI Layout Document
 * 
 * @description Root document structure containing version, metadata, root node, and optional variables
 * @param version - Document version string (e.g., "1.0.0")
 * @param metadata - Optional metadata (id, name, description)
 * @param root - Root node (required, must have id)
 * @param variables - Optional global variables accessible to all components
 */
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
```

**Component Factory**:
```typescript
/**
 * Component Factory
 * 
 * @description Function that creates a React component for a node
 * @param id - Node ID
 * @param renderNode - Function to render child nodes (Render Props pattern)
 * @returns ReactNode - The rendered component
 * 
 * @policy - Must return stable reference when called with same id
 * @policy - renderNode function is stable across renders
 * @policy - Should handle missing children gracefully (renderNode returns null for non-existent IDs)
 */
type ComponentFactory = (id: string, renderNode: RenderNodeFn) => ReactNode
```

### JSDoc Policy Bullets

**SduiLayoutRenderer**:
- **Responsibility**: Render SDUI documents as React component trees
- **Parameter Constraints**: `document.root.id` must exist (validated internally)
- **Return/Error Behavior**: Returns null on error, calls `onError` callback
- **Side Effects**: Creates store instance, normalizes document, initializes subscriptions
- **Behavior-Critical Policies**: Component override priority (ID > type > default), error handling (fallback to empty store)

**useSduiNodeSubscription**:
- **Responsibility**: Subscribe to node state changes and return node data
- **Parameter Constraints**: `nodeId` must be string, `schema` optional ZodSchema
- **Return/Error Behavior**: Returns node data, throws SchemaValidationError if schema validation fails
- **Side Effects**: Subscribes to node changes, unsubscribes on unmount
- **Behavior-Critical Policies**: Only subscribed node re-renders on state change, schema validation throws on failure

**SduiLayoutStore.updateNodeState**:
- **Responsibility**: Update node state and notify subscribers
- **Parameter Constraints**: `nodeId` must exist in store, `state` must be Partial<BaseLayoutState>
- **Return/Error Behavior**: No return, throws NodeNotFoundError if nodeId not found
- **Side Effects**: Updates state, notifies subscribers, increments version
- **Behavior-Critical Policies**: Latest update wins (synchronous), only that node's subscribers notified

## 3) Implementation Notes (vertical slice + key decisions)

### Minimal Vertical Slice

**Goal**: Render single root node with custom component

**Implementation Steps**:
1. Define types (SduiLayoutDocument, SduiLayoutNode)
2. Implement normalization (normalizeSduiLayout)
3. Create store (SduiLayoutStore with basic methods)
4. Create React Context (SduiLayoutProvider)
5. Create renderer component (SduiLayoutRenderer)
6. Create hook (useSduiNodeSubscription)
7. Render root node

**Demo Steps**:
```typescript
// 1. Create document
const document = {
  version: '1.0.0',
  root: {
    id: 'root',
    type: 'Card',
    state: { title: 'Hello' }
  }
}

// 2. Define component
const CardFactory: ComponentFactory = (id) => {
  const { state } = useSduiNodeSubscription({ nodeId: id })
  return <div>{state.title}</div>
}

// 3. Render
<SduiLayoutRenderer 
  document={document} 
  components={{ Card: CardFactory }} 
/>
```

**Verification**: Root node renders with "Hello" text

### Key Decisions

**Decision 1: Subscription System Implementation**
- **Choice**: Map<nodeId, Set<callbacks>> structure
- **Rationale**: O(1) lookup, O(1) add/remove, efficient notifications
- **Trade-off**: More complex than Context, but better performance

**Decision 2: Normalization Library**
- **Choice**: Use normalizr library
- **Rationale**: Proven library, handles recursive structures efficiently
- **Trade-off**: Additional dependency, but avoids reinventing wheel

**Decision 3: Component Override Priority**
- **Choice**: ID > type > default
- **Rationale**: Maximum flexibility (instance-specific overrides)
- **Trade-off**: More complex resolution, but better customization

**Decision 4: Error Handling Strategy**
- **Choice**: Call onError callback, continue with empty store
- **Rationale**: Graceful degradation, user can handle errors
- **Trade-off**: May hide errors, but better UX

## 4) Scenario Tests (6-10) + EP/BVA justification

### Scenario Test List

1. **Render Single Root Node**
   - **EP/BVA**: Node count = 1 (minimum valid document)
   - **Justification**: Tests basic rendering path
   - **Input**: Document with single root node
   - **Expected**: Root component renders

2. **Render Nested Child Nodes**
   - **EP/BVA**: Nesting depth = 3 (typical nesting)
   - **Justification**: Tests recursive rendering
   - **Input**: Document with 3-level nesting
   - **Expected**: All nodes render in hierarchy

3. **Update Node State**
   - **EP/BVA**: Single node update (minimum change)
   - **Justification**: Tests subscription system isolation
   - **Input**: Update one node's state
   - **Expected**: Only that node re-renders

4. **Component Override by Type**
   - **EP/BVA**: One override (minimum override)
   - **Justification**: Tests override resolution
   - **Input**: Override for node type
   - **Expected**: Overridden component used

5. **Component Override by ID**
   - **EP/BVA**: ID override with type override (priority test)
   - **Justification**: Tests override priority
   - **Input**: Both ID and type overrides
   - **Expected**: ID override used (higher priority)

6. **Handle Invalid Document**
   - **EP/BVA**: Missing root.id (boundary case)
   - **Justification**: Tests error handling
   - **Input**: Document without root.id
   - **Expected**: onError called, null rendered

7. **Render Empty Children Array**
   - **EP/BVA**: children = [] (empty array)
   - **Justification**: Tests edge case handling
   - **Input**: Document with empty children
   - **Expected**: Root renders, no children

8. **Handle Deep Nesting**
   - **EP/BVA**: Nesting depth = 10 (deep nesting)
   - **Justification**: Tests recursion limits
   - **Input**: Document with 10 levels
   - **Expected**: All nodes render, performance acceptable

9. **Subscription System**
   - **EP/BVA**: Multiple nodes, update one (isolation test)
   - **Justification**: Tests subscription isolation
   - **Input**: 3 nodes subscribed, update one
   - **Expected**: Only updated node's subscribers notified

10. **Store Reset**
    - **EP/BVA**: Loaded store reset (state transition)
    - **Justification**: Tests cleanup and state reset
    - **Input**: Load document, then reset
    - **Expected**: Store returns to initial state, subscriptions cleaned up

### EP/BVA Justification

**Node Count (0, 1, 10, 100, 1000)**:
- 0: Invalid (must have root)
- 1: Minimum valid
- 10: Typical use case
- 100: Large document
- 1000: Stress test

**Nesting Depth (0, 1, 5, 10, 20)**:
- 0: Root only (no children)
- 1: One level
- 5: Typical nesting
- 10: Deep nesting
- 20: Stress test

## 5) Deterministic Async/Race Strategy

**Current Approach**: All operations synchronous (no async in MVP)

**Strategy**: 
- No async operations
- No timers
- No race conditions
- All operations complete immediately

**Future (if async added)**:
- Use AbortController for cancellation
- Deferred promises for race tests
- Latest user intent wins
- Sequence guards prevent stale updates

**Race Test Design** (if async added):
```typescript
it('latest user intent wins', async () => {
  const deferred1 = defer()
  const deferred2 = defer()
  
  // Start first request
  updateNodeState('node-1', { count: 1 })
  deferred1.resolve()
  
  // Start second request (should win)
  updateNodeState('node-1', { count: 2 })
  deferred2.resolve()
  
  // Verify latest wins
  expect(getState('node-1').count).toBe(2)
})
```

## 6) Error/Empty/Loading UX

### Error State Behavior

**Invalid Document**:
- **Trigger**: Document missing root.id
- **Behavior**: Call `onError` callback with InvalidDocumentError
- **Recovery**: Create empty store, render null
- **User Action**: Handle error via onError callback

**Node Not Found**:
- **Trigger**: Query/update non-existent nodeId
- **Behavior**: Query returns `undefined`, update throws NodeNotFoundError
- **Recovery**: User handles (library doesn't recover)
- **User Action**: Check nodeId exists before update

**Schema Validation Failure**:
- **Trigger**: Zod schema validation fails
- **Behavior**: Throw SchemaValidationError in hook
- **Recovery**: User handles (library doesn't recover)
- **User Action**: Fix state structure or schema

### Empty State Behavior

**No Children**:
- **Trigger**: children: []
- **Behavior**: Render root node only, no children
- **Recovery**: N/A (not an error)
- **User Action**: Provide empty state UI in component if needed

**Empty Store**:
- **Trigger**: After reset or error
- **Behavior**: Render null
- **Recovery**: Load new document
- **User Action**: Load valid document

### Loading State Behavior

**Not Needed**: All operations synchronous (instant)

**Future (if async added)**:
- **Trigger**: Document loading
- **Behavior**: Show loading state (users implement)
- **Recovery**: Display loaded content
- **User Action**: Handle loading state in component

## 7) Observability/Performance Notes

### Observability

**Error Callbacks**:
- `onError`: Called on document validation errors
- User can log errors, send to monitoring service

**No Internal Logging**:
- Library doesn't log internally
- Users can add logging via callbacks

**Performance Measurement**:
- Users can measure via React Profiler
- Users can measure normalization time via performance API

### Performance Notes

**Bundle Size**:
- Target: < 50KB (gzipped)
- Measurement: Bundle analyzer
- Optimization: Tree-shaking, remove unused dependencies

**Render Performance**:
- Target: < 100ms initial render (100 nodes)
- Target: < 16ms re-render (single node)
- Measurement: React Profiler
- Optimization: Subscription-based re-rendering, memoization

**Memory**:
- Target: No leaks
- Measurement: Memory profiler
- Optimization: Subscription cleanup, store reset

## 8) Docs/ADR Updates

### Documentation Updates

**README.md**:
- Installation instructions
- Quick start guide
- API reference
- Example code
- Next.js App Router usage

**JSDoc**:
- All public APIs documented
- Parameter descriptions
- Return types
- Error behavior
- Side effects

### ADR Updates

**ADR 1: Subscription System** (see arch.md)
- Decision: Custom subscription system over React Context
- Rationale: Performance (only changed nodes re-render)

**ADR 2: Normalization** (see arch.md)
- Decision: Use normalizr library
- Rationale: Proven library, efficient recursive handling

**ADR 3: Error Handling** (new)
- Decision: Call onError callback, continue with empty store
- Rationale: Graceful degradation, user control

## 9) Merge Readiness Checklist

### Pre-flight Checklist

- [x] Target branch: main (trunk-based)
- [x] Feature flag: Not needed (library feature)
- [x] Local dev environment: Reproducible (pnpm install)
- [x] Baseline tests: Pass on main

### Merge Readiness Checklist

- [x] All P0 scenario tests pass
- [x] No flaky tests (all synchronous)
- [x] Lint/build passes
- [x] Keyboard-only flow works (API provided)
- [x] Accessibility roles/aria match (API provided)
- [x] Concurrency policy satisfied (latest intent wins, synchronous)
- [x] No out-of-scope leakage
- [x] TypeScript strict mode enabled
- [x] No memory leaks (unsubscribe test)
- [x] Bundle size < 50KB gzipped (measured)
- [x] Next.js App Router compatible ("use client" directive)

### Known Limitations

- SSR support (works without serialization)
- No persistence (users handle)
- No default styles (users provide)
- No default components (users provide)
- No async operations (synchronous only)

## 10) Rollout Plan (if applicable)

**Not Applicable**: Library package, not a service

**Release Steps**:
1. Version bump in package.json
2. Build package
3. Publish to npm
4. Update documentation

**Monitoring Signals**:
- npm downloads
- GitHub issues
- Bundle size (npm package size)

**Rollback Criteria**:
- Critical bugs reported
- Bundle size regression
- Performance regression

**Post-Release Validation**:
- Verify npm package installs correctly
- Verify types are available
- Verify bundle size is acceptable
- Monitor for issues
