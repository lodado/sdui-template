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

```
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

```
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
- [ ] File structure follows FSD rules
- [ ] TypeScript types exported correctly
- [ ] Next.js App Router compatible ("use client" directive)
- [ ] Bundle size < 50KB gzipped (measured)
- [ ] No memory leaks (unmount test)

## Known Limitations

- No SSR support (client only)
- No persistence (users handle)
- No default styles (users provide)
- No default components (users provide)
- No async operations (synchronous only)

## Next Steps

Based on this design:

1. **Implementation** (`implements.md`): Actual code implementation
2. **Optimization** (`optimization.md`): Performance optimization
