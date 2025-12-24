# Implementation Guide: SDUI Template Library

## Overview

This document provides step-by-step instructions for implementing the SDUI Template library. It guides you through what to implement at each step, how to test it, and what to watch out for.

## Pre-Implementation Checklist

### Required Checks

- [ ] TypeScript configuration complete
- [ ] Test environment setup complete (Jest)
- [ ] Build configuration complete (Rollup)
- [ ] Dependencies installed (normalizr, lodash-es, zod, etc.)

### Development Environment

```bash
# Install dependencies
pnpm install

# Run development mode
pnpm run dev

# Run tests
pnpm test

# Build
pnpm run build
```

## Implementation Steps

### Step 1: Type and Schema Definitions

**Goal**: Define all domain types and interfaces

**Files**:

- `src/schema/base.ts`: Base node and document types
- `src/schema/node.ts`: Layout node types
- `src/schema/state.ts`: Layout state types
- `src/schema/grid.ts`: Grid configuration types
- `src/schema/document.ts`: Layout document types

**Notes**:

- Be careful with recursive type definitions
- Add JSDoc comments to all fields
- Mark optional fields with `?`

**Tests**:

- TypeScript compilation check
- Type checking only

### Step 2: Normalization Utility Implementation

**Goal**: Convert documents to normalized entities

**Files**:

- `src/utils/normalize/normalize.ts`: Normalization function
- `src/utils/normalize/denormalize.ts`: Denormalization function
- `src/utils/normalize/types.ts`: Normalized entity types

**Implementation Points**:

- Define normalizr schema
- Handle recursive structures
- Separate state and attributes

**Tests**:

- Normalize → denormalize round-trip test
- Various nested structure tests
- Edge case tests (empty array, single node, etc.)

**Example**:

```typescript
const document = createTestDocument({ /* ... */ })
const { entities } = normalizeSduiLayout(document)
const denormalized = denormalizeSduiLayout(entities.rootId, entities)
expect(denormalized).toEqual(document)
```

### Step 3: Store Manager Implementation

**Goal**: Implement manager classes responsible for each store concern

**Files**:

- `src/store/managers/SubscriptionManager.ts`: Subscription management
- `src/store/managers/LayoutStateRepository.ts`: State storage
- `src/store/managers/DocumentManager.ts`: Document management
- `src/store/managers/VariablesManager.ts`: Variable management

**Implementation Points**:

**SubscriptionManager**:

- `Map<nodeId, Set<callbacks>>` structure
- Subscribe/unsubscribe methods
- Notification methods

**LayoutStateRepository**:

- State storage and retrieval
- Version management
- Edit state management

**DocumentManager**:

- Document caching
- Metadata management
- Original document storage

**VariablesManager**:

- Global variable management
- Increment version on variable updates

**Tests**:

- Unit tests for each manager
- Memory leak tests (subscription cleanup)
- State consistency tests

### Step 4: Store Core Implementation

**Goal**: Main store class that integrates managers

**Files**:

- `src/store/SduiLayoutStore.ts`: Main store class
- `src/store/types.ts`: Store type definitions

**Implementation Points**:

- Integrate managers using Facade pattern
- Define public API
- Error handling

**Key Methods**:

- `updateLayout()`: Update document
- `updateNodeLayout()`: Update node layout
- `updateNodeState()`: Update node state
- `subscribeNode()`: Subscribe to node
- `subscribeVersion()`: Subscribe to version
- `getNodeById()`: Get node by ID
- `reset()`: Reset store

**Tests**:

- Unit tests for store methods
- Integration tests (with managers)
- Error case tests

### Step 5: React Context Implementation

**Goal**: Provide store via React Context

**Files**:

- `src/react/context/SduiLayoutContext.tsx`: Context and Provider

**Implementation Points**:

- Create Context
- Provider component
- Error handling (when used outside Provider)

**Tests**:

- Provider integration test
- Context access test
- Error case test (using without Provider)

### Step 6: Hook Implementation (Part 1)

**Goal**: Implement state selection and action hooks

**Files**:

- `src/react/hooks/useSduiLayoutStores.ts`: State selection hook
- `src/react/hooks/useSduiLayoutAction.ts`: Action hook

**Implementation Points**:

**useSduiLayoutStores**:

- Select state with selector function
- Detect changes via version subscription
- Memoize results with `useMemo`

**useSduiLayoutAction**:

- Return store instance
- Maintain stable reference

**Tests**:

- Integration tests with Provider
- Selector memoization test
- Re-render optimization test

### Step 7: Hook Implementation (Part 2)

**Goal**: Implement node subscription and rendering hooks

**Files**:

- `src/react/hooks/useSduiNodeSubscription.ts`: Node subscription hook
- `src/react/hooks/useRenderNode.ts`: Render function hook

**Implementation Points**:

**useSduiNodeSubscription**:

- Subscribe to specific node
- Return node data
- Optional schema validation
- Unsubscribe (useEffect cleanup)

**useRenderNode**:

- Generate render function
- Resolve component overrides
- Support recursive rendering
- Maintain stable reference (useRef)

**Tests**:

- Subscription behavior test
- Unsubscribe test (prevent memory leaks)
- Render function stability test

### Step 8: Renderer Component Implementation

**Goal**: Main component that renders SDUI documents

**Files**:

- `src/react/components/SduiLayoutRenderer.tsx`: Renderer component

**Implementation Points**:

- Document validation
- Store creation and initialization
- Error handling (onError callback)
- Add "use client" directive

**Tests**:

- Basic rendering scenario test
- Error handling test
- Component override test

### Step 9: Component System Implementation

**Goal**: Component mapping and factory system

**Files**:

- `src/components/componentMap.tsx`: Default component map
- `src/components/types.ts`: Factory type definitions

**Implementation Points**:

- Default component map (empty)
- Default factory function
- Type definitions

**Tests**:

- Default factory behavior test
- Override priority test

### Step 10: Scenario Test Writing

**Goal**: Test all P0 use cases

**Files**:

- `src/__tests__/scenario/*.test.tsx`: Scenario tests

**Test List**:

1. Render single root node
2. Render nested child nodes
3. Update node layout
4. Component override by type
5. Component override by ID
6. Handle invalid document
7. Render empty children array
8. Handle deep nesting
9. Subscription system
10. Store reset

**Test Structure**:

```typescript
describe('Scenario Name', () => {
  describe('as is: initial state', () => {
    describe('when: action', () => {
      it('to be: expected result', () => {
        // Test code
      })
    })
  })
})
```

### Step 11: Public API and Exports

**Goal**: Export all public APIs correctly

**Files**:

- `src/index.ts`: Main export file
- `package.json`: Package configuration

**Export Items**:

- Components: `SduiLayoutRenderer`, `SduiLayoutProvider`
- Hooks: `useSduiLayoutStores`, `useSduiLayoutAction`, `useSduiNodeSubscription`
- Store: `SduiLayoutStore`
- Types: All public types
- Utilities: `normalizeSduiLayout`, `denormalizeSduiLayout` (optional)

**Tests**:

- Export test (verify all items exported correctly)
- Bundle size check (< 50KB gzipped)
- Tree-shaking verification

### Step 12: Documentation

**Goal**: Write documentation for users

**Files**:

- `README.md`: Usage guide
- JSDoc comments: All public APIs

**Documentation Content**:

- Installation instructions
- Quick start guide
- API reference
- Example code
- Next.js App Router usage
- Component override examples

## Implementation Notes

### Performance

- **Unsubscribe**: Must be called in `useEffect` cleanup
- **Memoization**: Memoize selector results with `useMemo`
- **Stable References**: Maintain stable references for store instance and render function

### Memory Management

- **Subscription Cleanup**: Unsubscribe required on component unmount
- **Store Reset**: Use `reset()` method to clean up when needed
- **Reference Removal**: Verify callback references are removed on unsubscribe

### Error Handling

- **Validation**: Validate document before processing
- **Error Callback**: Pass errors to `onError` callback
- **Fallback**: Continue rendering if possible (with empty store)

### Type Safety

- **Strict Mode**: Use TypeScript strict mode
- **Type Exports**: Export all public types
- **JSDoc**: Add JSDoc comments to all public APIs

## Testing Strategy

### Scenario First

- Test behavior, not implementation details
- Use "as is → when → to be" structure
- Verify only observable behavior

### Boundary Value Analysis

- Node count: 0, 1, 10, 100, 1000
- Nesting depth: 0, 1, 5, 10, 20
- Layout position: Boundary value tests

### Deterministic Async

- All operations are synchronous (MVP)
- No timing issues
- Explicit unsubscribe tests

## Merge Readiness Checklist

- [ ] All P0 scenario tests pass
- [ ] No flaky tests (all synchronous)
- [ ] Lint/build passes
- [ ] Keyboard-only flow works (API provided)
- [ ] Accessibility roles/aria match (API provided)
- [ ] Concurrency policy satisfied (latest intent wins, synchronous)
- [ ] No out-of-scope leakage
- [ ] TypeScript strict mode enabled
- [ ] No memory leaks (unsubscribe test)
- [ ] Bundle size < 50KB gzipped (measured)
- [ ] Next.js App Router compatible ("use client" directive)

## Known Limitations

- No SSR support (client only)
- No persistence (users handle)
- No default styles (users provide)
- No default components (users provide)
- No async operations (synchronous only)

## Next Steps

After implementation:

1. **Optimization** (`optimization.md`): Performance optimization and improvements
2. **Documentation**: Complete README and API documentation
3. **Deployment**: Deploy as npm package
