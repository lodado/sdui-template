---
description: Implementation Design
---

# Implementation Design: SDUI Component Library

## Input

- **Requirement Analysis**: `requirement-analysis.md`
- **Deliverables**: Button component with SDUI integration, tests, documentation
- **Tech Stack**: React 18+, TypeScript, Radix UI, Vitest, @testing-library/react
- **Architecture**: Feature-Sliced Design (FSD)

## Step 0) Pre-flight Checklist

- ✅ Target branch: `agent/sdui-template-component` (worktree)
- ✅ Integration strategy: Feature branch (will merge to main later)
- ✅ Feature flag plan: N/A (new package)
- ✅ Local dev environment: Reproducible (pnpm workspace)
- ✅ Baseline tests: N/A (new package)

**Assumptions**:

- Radix UI `@radix-ui/react-slot` is available
- Workspace configs (rollup-config, jest-config, tsconfig) are available
- pnpm workspace is properly configured

## Step 1) PR Plan

| PR# | Scope                          | Files                                    | Risks                    | Tests Added                    | Acceptance Checks                                    |
| --- | ------------------------------ | ---------------------------------------- | ------------------------ | ------------------------------ | ---------------------------------------------------- |
| 1   | Contracts & Types              | `features/button/model/types.ts`         | Type compatibility       | None                           | Types compile, JSDoc complete                        |
| 2   | Scaffold                       | FSD structure, package.json, configs    | Config errors            | None                           | Package installs, builds                             |
| 3   | Core UI Skeleton + A11y        | `features/button/ui/Button.tsx`          | Accessibility gaps       | Basic render test              | Component renders, ARIA attributes present          |
| 4   | Core Interactions              | Button onClick, keyboard handlers        | Event handling bugs      | Click/keyboard tests           | Mouse and keyboard interactions work                 |
| 5   | SDUI Integration               | Button with useSduiNodeSubscription    | Integration complexity   | SDUI integration test          | Works with SDUI template                             |
| 6   | Scenario Tests (P0)            | `__tests__/scenario/button.test.tsx`     | Test coverage gaps       | 6-10 scenario tests            | All tests pass, EP/BVA applied                       |
| 7   | Polish: Exports & Build        | `app/index.ts`, build config            | Export errors            | Import/export test             | Can import from package, build succeeds              |
| 8   | Documentation                  | README, JSDoc updates                    | Documentation gaps       | None                           | Documentation complete and accurate                   |

## Step 2) Contracts

### TypeScript Types

```typescript
// features/button/model/types.ts

/**
 * Button component variant styles
 */
export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost'

/**
 * Button component size options
 */
export type ButtonSize = 'sm' | 'md' | 'lg'

/**
 * Button component props
 *
 * @description
 * - Supports multiple variants and sizes for flexible styling
 * - Integrates with SDUI via nodeId prop
 * - Supports event emission via eventId prop
 * - Full keyboard navigation support (Enter, Space)
 * - Accessible by default (ARIA attributes)
 *
 * @param variant - Visual style variant (default: 'primary')
 * @param size - Size of the button (default: 'md')
 * @param disabled - Whether button is disabled (default: false)
 * @param children - Button content
 * @param onClick - Click event handler
 * @param className - Additional CSS classes (merged with defaults)
 * @param nodeId - SDUI node ID for integration (optional)
 * @param eventId - Event ID for event emission (optional)
 * @param 'aria-label' - Accessible label (optional, uses children if not provided)
 * @param 'aria-describedby' - Element ID that describes button (optional)
 *
 * @example
 * ```tsx
 * <Button variant="primary" size="md" onClick={handleClick}>
 *   Submit
 * </Button>
 * ```
 *
 * @example
 * ```tsx
 * // SDUI integration
 * <Button nodeId="button-1" eventId="submit-click">
 *   Submit
 * </Button>
 * ```
 */
export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** Visual style variant */
  variant?: ButtonVariant
  /** Size of the button */
  size?: ButtonSize
  /** Whether button is disabled */
  disabled?: boolean
  /** Button content */
  children: React.ReactNode
  /** Click event handler */
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void
  /** Additional CSS classes */
  className?: string
  /** SDUI node ID for integration */
  nodeId?: string
  /** Event ID for event emission */
  eventId?: string
}
```

### Policy Bullets

- **Variant Default**: If variant is not provided or invalid, defaults to 'primary'
- **Size Default**: If size is not provided or invalid, defaults to 'md'
- **Disabled Behavior**: When disabled, onClick is not called, keyboard events are ignored
- **Keyboard Support**: Enter and Space keys trigger onClick (standard button behavior)
- **Focus Management**: Button receives focus on tab, maintains focus until blurred
- **Event Emission**: If eventId provided, event can be emitted via EventMapper (separate component)
- **SDUI Integration**: If nodeId provided, component can use useSduiNodeSubscription (optional)

## Step 3) Minimal Vertical Slice

**Implementation Order**:

1. Create Button component with basic rendering
2. Add variant and size props
3. Add onClick handler
4. Add keyboard support
5. Add disabled state
6. Add SDUI integration (optional)
7. Add accessibility attributes

**Demo Steps**:

```tsx
// 1. Basic rendering
<Button>Click me</Button>

// 2. With variant
<Button variant="primary">Submit</Button>

// 3. With onClick
<Button onClick={() => console.log('clicked')}>Click</Button>

// 4. Disabled
<Button disabled>Disabled</Button>

// 5. SDUI integration
function ButtonWithSDUI({ nodeId }: { nodeId: string }) {
  const { state } = useSduiNodeSubscription({ nodeId })
  return <Button disabled={state.disabled}>{state.label}</Button>
}
```

## Step 4) Scenario Tests

### Test Portfolio (6-10 Tests)

1. **Success flow (mouse click)**
   - `as is: Button with onClick handler`
   - `when: user clicks button`
   - `to be: onClick handler called with event`

2. **Success flow (keyboard - Enter)**
   - `as is: Button with onClick handler, focused`
   - `when: user presses Enter`
   - `to be: onClick handler called`

3. **Success flow (keyboard - Space)**
   - `as is: Button with onClick handler, focused`
   - `when: user presses Space`
   - `to be: onClick handler called`

4. **Disabled state**
   - `as is: Button with disabled=true and onClick handler`
   - `when: user clicks button`
   - `to be: onClick handler not called, button is non-interactive`

5. **Variant changes**
   - `as is: Button with variant="primary"`
   - `when: variant changes to "secondary"`
   - `to be: correct variant styles applied`

6. **Size changes**
   - `as is: Button with size="md"`
   - `when: size changes to "lg"`
   - `to be: correct size styles applied`

7. **SDUI integration**
   - `as is: Button with nodeId, SDUI document loaded`
   - `when: node state changes`
   - `to be: button reflects state changes`

8. **Boundary: invalid variant**
   - `as is: Button with invalid variant prop`
   - `when: component renders`
   - `to be: defaults to "primary" variant`

9. **Accessibility: focus management**
   - `as is: Button in DOM`
   - `when: user tabs to button`
   - `to be: button receives focus, focus indicator visible`

10. **Accessibility: ARIA attributes**
    - `as is: Button with aria-label`
    - `when: component renders`
    - `to be: aria-label attribute present`

### EP/BVA Justification

**Variants**:
- Test: 'primary', 'secondary', 'outline', 'ghost' (all valid variants)
- Boundary: invalid string → defaults to 'primary'

**Sizes**:
- Test: 'sm', 'md', 'lg' (all valid sizes)
- Boundary: invalid string → defaults to 'md'

**Disabled**:
- Test: true, false (boolean boundary values)
- EP: enabled (false) vs disabled (true)

**Event Handlers**:
- Test: with handler, without handler (presence/absence)

## Step 5) Deterministic Async/Race Strategy

**No async behavior in Button component** - all operations are synchronous.

- No debouncing
- No network requests
- No timers
- No race conditions

**SDUI Integration** (if used):
- useSduiNodeSubscription is synchronous for state access
- Subscription callbacks are synchronous
- No async handling needed

## Step 6) Error/Empty/Loading UX

### Empty State

- **No children**: Button renders with no visible content (not recommended, but allowed)
- **No onClick**: Button renders but does nothing (valid use case for disabled buttons)

### Error State

- **Invalid variant**: Defaults to 'primary', no error thrown
- **Invalid size**: Defaults to 'md', no error thrown
- **Missing required props**: TypeScript will catch at compile time

### Loading State

- **N/A**: Button has no loading state (synchronous only)

### Recovery

- **Invalid props**: Component gracefully handles invalid props by using defaults
- **Type errors**: TypeScript compilation prevents invalid props

## Step 7) Observability/Performance Notes

### Observability

- **No internal logging**: Component does not log internally
- **User can add logging**: Via onClick handler or EventMapper
- **Error boundaries**: Errors in onClick handlers are not caught by component

### Performance

- **Bundle size target**: < 10KB per component (gzipped)
- **Render performance**: < 16ms for initial render (60fps)
- **Optimization strategies**:
  - Use React.memo if needed (not in MVP)
  - Minimize re-renders (controlled by SDUI subscription system)
  - Tree-shaking friendly exports

## Step 8) Documentation & ADR Update

### JSDoc Updates

- All public interfaces have JSDoc
- Policy bullets documented in JSDoc
- Examples provided in JSDoc

### README Updates

- Installation instructions
- Basic usage examples
- Component API documentation
- SDUI integration guide

### ADR Entries

- **FSD Architecture**: Using Feature-Sliced Design for component organization
- **Radix UI**: Using Radix UI primitives for accessibility
- **No Default Styles**: Components have minimal default styles, allow full override

## Step 9) Merge Readiness Checklist

- [ ] All P0 scenario tests pass in CI
- [ ] No flaky tests (no timing dependence)
- [ ] Lint/build pass
- [ ] Keyboard-only flow works
- [ ] A11y roles/aria match spec
- [ ] TypeScript types are correct
- [ ] Can be imported and used
- [ ] Documentation complete
- [ ] Bundle size within target (< 10KB gzipped)

**Known Limitations**:

- No loading state support
- No animation/transition support
- Minimal default styling (requires CSS or Tailwind)
- Event emission requires separate EventMapper component

## Step 10) Release & Rollout Plan

### Release Steps

1. **Version**: Start at 1.0.0
2. **Publish**: `pnpm publish --access public`
3. **Verify**: Install in test project, verify imports work
4. **Documentation**: Update main README if needed

### Monitoring Signals

- **Package downloads**: Monitor npm download stats
- **Type errors**: Monitor TypeScript compatibility issues
- **Bundle size**: Monitor bundle size in consuming projects

### Rollback Criteria

- Critical bugs in production
- Type compatibility issues
- Bundle size exceeds target significantly

### Post-Release Validation

- [ ] Package installs correctly
- [ ] Types are available
- [ ] Component renders correctly
- [ ] Tests pass in consuming project
- [ ] Documentation is accessible

