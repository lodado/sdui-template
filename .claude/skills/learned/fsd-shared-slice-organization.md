---
name:  FSDArchitecture
# prettier-ignore
description: Slice Structure and File Organization Guide
---

## Problem

When working with Feature-Sliced Design architecture, it can be unclear:

- What role each layer plays and their responsibilities
- How to structure slices internally
- Where to place utils, ui components, and hooks in the `shared` slice
- When to use generic hooks vs component-specific hooks

## Solution

### FSD Layer Structure

```
app → pages → widgets → features → entities → shared
```

**Dependency Rule:** Only upper layers can import from lower layers. Never reverse.

- ❌ `shared` cannot import from `features`
- ❌ `entities` cannot import from `widgets`
- ✅ `features` can import from `entities` and `shared`

### Slice Internal Segments

Each slice consists of these segments:

```
[slice]/
├── ui/        # UI components
├── model/     # State, types, business logic
├── api/       # API calls, data fetching
├── lib/       # Slice-specific utilities (optional)
└── index.ts   # Public API only
```

### Shared Slice Structure

```
shared/
├── lib/              # Library wrappers/helpers
│   ├── cn.ts
│   └── index.ts
├── utils/            # Generic utilities and hooks
│   ├── useHasHover.ts
│   ├── isServerSide.ts
│   └── index.ts
└── ui/               # Reusable UI components
    └── [component]/
        ├── [Component].tsx
        ├── [Component]Container.tsx
        ├── use[Component]State.ts
        ├── [Component]Context.tsx
        ├── types.ts
        ├── *-variants.ts
        └── index.ts
```

### Strict File Placement Rules

#### **shared/utils/** - Generic Utilities Only

**MUST be placed here if:**

- ✅ Used by 3+ different components/slices
- ✅ No dependency on specific component/domain
- ✅ Generic functionality (device detection, environment checks, API helpers)

**MUST NOT be placed here if:**

- ❌ Used only by one component
- ❌ Contains component-specific logic
- ❌ Tightly coupled to a component

**Examples:**

```typescript
// ✅ CORRECT: shared/utils/useHasHover.ts
export function useHasHover(): boolean {
  return matchMedia('(hover: hover)').matches
}

// ✅ CORRECT: shared/utils/isServerSide.ts
export function isServerSide(): boolean {
  return typeof window === 'undefined'
}
```

#### **shared/ui/[component]/** - Component-Specific Files

**MUST be placed here if:**

- ✅ Used only by this specific component
- ✅ Component state management logic
- ✅ Component Context and hooks
- ✅ Component types and variants

**File Structure (Required):**

1. **`[Component].tsx`** - Main component (compound pattern root)
2. **`[Component]Container.tsx`** - SDUI integration container
3. **`use[Component]State.ts`** - Component-specific state hook
4. **`[Component]Context.tsx`** - Context + context hook (if needed)
5. **`types.ts`** - Component types
6. **`*-variants.ts`** - Style variants
7. **`index.ts`** - Public API (exports only what's needed externally)

**Examples:**

```typescript
// ✅ CORRECT: shared/ui/tooltip/useTooltipState.ts
export function useTooltipState({ open, defaultOpen }) {
  // Tooltip-specific state logic
}

// ✅ CORRECT: shared/ui/textfield/TextFieldContext.tsx
export const TextFieldContext = React.createContext(...)
export const useTextFieldContext = () => { ... }
```

### Import Rules

#### Inter-Layer Imports

```typescript
// ✅ CORRECT: Upper → Lower
// features/login/ui/LoginForm.tsx
import { Button } from 'shared/ui/button'
import { User } from 'entities/user'

// ❌ FORBIDDEN: Lower → Upper
// shared/ui/button/Button.tsx
import { LoginForm } from 'features/login'  // NEVER!
```

#### Slice Internal Imports

```typescript
// ✅ CORRECT: Import segments within same slice
// features/login/ui/LoginForm.tsx
import { useLoginStore } from '../model/store'
import { loginApi } from '../api/loginApi'

// ✅ CORRECT: Import only public API from other slices
// pages/home/index.tsx
import { LoginForm } from 'features/login'  // From index.ts only
```

#### Public API Pattern

**Every slice MUST have `index.ts` that exports only public API:**

```typescript
// features/login/index.ts
export { LoginForm } from './ui/LoginForm'
export { useLoginStore } from './model/store'
export type { LoginState } from './model/types'
// ❌ DO NOT export internal files directly
```

## Example

### Complete Project Structure

```
src/
├── app/
│   ├── providers/AppProviders.tsx
│   ├── router/router.tsx
│   └── index.tsx
│
├── pages/
│   ├── home/index.tsx
│   └── profile/index.tsx
│
├── widgets/
│   ├── header/
│   │   ├── ui/Header.tsx
│   │   └── index.ts
│   └── sidebar/
│       ├── ui/Sidebar.tsx
│       └── index.ts
│
├── features/
│   ├── login/
│   │   ├── ui/LoginForm.tsx
│   │   ├── model/store.ts
│   │   ├── model/types.ts
│   │   ├── api/loginApi.ts
│   │   └── index.ts
│   └── search/
│       ├── ui/SearchBar.tsx
│       ├── model/store.ts
│       ├── api/searchApi.ts
│       └── index.ts
│
├── entities/
│   ├── user/
│   │   ├── ui/UserCard.tsx
│   │   ├── model/types.ts
│   │   ├── api/userApi.ts
│   │   └── index.ts
│   └── product/
│       ├── ui/ProductCard.tsx
│       ├── model/types.ts
│       ├── api/productApi.ts
│       └── index.ts
│
└── shared/
    ├── ui/
    │   ├── button/
    │   │   ├── Button.tsx
    │   │   ├── ButtonContainer.tsx
    │   │   ├── useButtonState.ts
    │   │   ├── types.ts
    │   │   └── index.ts
    │   └── tooltip/
    │       ├── Tooltip.tsx
    │       ├── TooltipContainer.tsx
    │       ├── useTooltipState.ts
    │       └── index.ts
    ├── utils/
    │   ├── useHasHover.ts
    │   ├── isServerSide.ts
    │   └── index.ts
    ├── lib/
    │   ├── cn.ts
    │   └── index.ts
    └── api/client.ts
```

### Correct vs Incorrect Placement

```typescript
// ✅ CORRECT: shared/utils/useHasHover.ts
// Used by multiple components (tooltip, popover, dropdown)
export function useHasHover(): boolean { ... }

// ✅ CORRECT: shared/ui/tooltip/useTooltipState.ts
// Only used by Tooltip component
export function useTooltipState({ open, defaultOpen }) { ... }

// ❌ INCORRECT: shared/utils/useTooltipState.ts
// Only used by Tooltip, must be in ui/tooltip/

// ❌ INCORRECT: shared/ui/tooltip/useHasHover.ts
// Used by multiple components, must be in utils/
```

## When to Use

### Decision Tree

**Adding a new hook/utility:**

1. Is it used by 3+ different components/slices?
   - ✅ YES → `shared/utils/`
   - ❌ NO → Continue

2. Is it specific to one component?
   - ✅ YES → `shared/ui/[component]/`
   - ❌ NO → Continue

3. Is it feature/entity-specific?
   - ✅ YES → `features/[feature]/model/` or `entities/[entity]/model/`

**Adding a new component:**

1. Determine layer: `shared/ui/` (reusable) vs `features/` (user scenario) vs `entities/` (domain)
2. Create slice folder: `[component]/`
3. Add required files: `[Component].tsx`, `types.ts`, `index.ts`
4. Add optional files: `use[Component]State.ts`, `[Component]Context.tsx`, `*-variants.ts`

## Best Practices

### Core Rules

1. **Single Responsibility**: Each slice has one clear purpose
2. **Dependency Direction**: Always upper → lower, never reverse
3. **Public API**: Export only through `index.ts`
4. **No Business Logic in Shared**: `shared` contains only reusable code
5. **No Cross-Layer Imports**: Slices in same layer cannot import each other

### Strict Warnings

- ❌ **NEVER** place business logic in `shared`
- ❌ **NEVER** import from upper layers in lower layers
- ❌ **NEVER** import internal files directly (always use `index.ts`)
- ❌ **NEVER** place component-specific code in `shared/utils/`
- ❌ **NEVER** place generic utilities in component folders

### Checklist

Before committing code:

1. [ ] Is the file in the correct layer?
2. [ ] Is the slice structure correct (ui/model/api/lib)?
3. [ ] Are imports following upper → lower direction?
4. [ ] Is public API exported in `index.ts`?
5. [ ] Is generic code in `utils/` and specific code in component folder?
6. [ ] Is there no business logic in `shared`?
