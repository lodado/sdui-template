---
name: SDUIBestPractices
# prettier-ignore
description: Server-Driven UI implementation using @lodado/sdui-template library
---

## Problem

When first using the SDUI library, consistent patterns are needed for document structure, custom component creation, and Storybook story writing.

## Solution

### 1. SDUI Document Structure Pattern

```typescript
import type { SduiLayoutDocument } from '@lodado/sdui-template'

const document: SduiLayoutDocument = {
  version: '1.0.0',
  metadata: {
    id: 'unique-document-id',
    name: 'Document Name',
  },
  root: {
    id: 'root',
    type: 'Div',
    attributes: {
      className: 'container-class',
    },
    children: [
      {
        id: 'child-1', // Unique, meaningful ID
        type: 'ComponentType', // Component type
        state: {
          // Dynamic data (mutable)
          text: 'Dynamic content',
        },
        attributes: {
          // Static props (className, as, etc.)
          className: 'styling-class',
        },
        children: [], // Child nodes
      },
    ],
  },
}
```

**Key Rules:**

- `id`: Assign unique, meaningful IDs to all nodes (e.g., `form-field-email`, `submit-button`)
- `state`: Dynamic data that can change at runtime
- `attributes`: Static HTML attributes (className, type, placeholder, etc.)

### 2. Zod Schema Type Casting (REQUIRED)

**You MUST define a Zod schema and type cast the state in every custom component.**

```typescript
import { useSduiNodeSubscription } from '@lodado/sdui-template'
import { z } from 'zod'

// 1. Define Zod schema (REQUIRED)
const componentStateSchema = z.object({
  label: z.string().optional(),
  value: z.number().default(0),
  isActive: z.boolean().optional(),
})

// 2. Extract type from schema
type ComponentState = z.infer<typeof componentStateSchema>

// 3. Use in component
const MyComponent: React.FC<{ nodeId: string }> = ({ nodeId }) => {
  const { state, childrenIds } = useSduiNodeSubscription<typeof componentStateSchema>({
    nodeId,
    schema: componentStateSchema, // Pass schema (REQUIRED)
  })

  // 4. Type cast (REQUIRED)
  const typedState = state as ComponentState

  // typedState now has full type safety
  return <div>{typedState.label}</div>
}
```

**Why is this required:**

- `useSduiNodeSubscription`'s `state` defaults to `Record<string, unknown>` type
- Without Zod schema, runtime type validation is not possible
- Without type casting, IDE autocomplete and type checking won't work
- Schema acts as a contract for document structure

**Anti-pattern (DON'T do this):**

```typescript
// ❌ Bad: Using any without schema
const { state } = useSduiNodeSubscription({ nodeId })
const label = (state as any).label // No type safety

// ❌ Bad: Schema defined but not type cast
const { state } = useSduiNodeSubscription({ nodeId, schema: mySchema })
state.label // Error: Property 'label' does not exist on type 'Record<string, unknown>'
```

### 3. Custom Component Creation Pattern

```typescript
'use client'

import { type ComponentFactory, useSduiNodeSubscription, useRenderNode } from '@lodado/sdui-template'
import { sduiComponents as baseSduiComponents } from '@lodado/sdui-template-component'
import { z } from 'zod'

// 1. Define state type with Zod schema
const myComponentStateSchema = z.object({
  label: z.string().optional(),
  variant: z.enum(['primary', 'secondary']).optional(),
})

type MyComponentState = z.infer<typeof myComponentStateSchema>

// 2. Implement component
const MyComponent: React.FC<{ nodeId: string; parentPath?: string[] }> = ({ nodeId, parentPath = [] }) => {
  issue
  const { state, childrenIds } = useSduiNodeSubscription<typeof myComponentStateSchema>({
    nodeId,
    schema: myComponentStateSchema,
  })
  const { renderChildren } = useRenderNode({ nodeId, parentPath })

  const typedState = state as MyComponentState

  return (
    <div className={typedState.variant === 'primary' ? 'primary-style' : 'secondary-style'}>
      {typedState.label}
      {renderChildren(childrenIds)}
    </div>
  )
}

// 3. Create ComponentFactory
const MyComponentFactory: ComponentFactory = (id, parentPath) => <MyComponent nodeId={id} parentPath={parentPath} />

// 4. Export component map (extending base components)
export const sduiComponents: Record<string, ComponentFactory> = {
  ...baseSduiComponents,
  MyComponent: MyComponentFactory,
}
```

### 4. Storybook Story Writing Pattern

```typescript
import { type SduiLayoutDocument, SduiLayoutRenderer } from '@lodado/sdui-template'
import { sduiComponents } from '@lodado/sdui-template-component'
import type { Meta, StoryObj } from '@storybook/react-vite'

const meta: Meta<typeof YourComponent> = {
  title: 'Category/UI/ComponentName',
  component: YourComponent,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `## Overview\n\nComponent description...`,
      },
    },
  },
}

export default meta
type Story = StoryObj<typeof YourComponent>

export const Default: Story = {
  render: () => {
    const document: SduiLayoutDocument = {
      version: '1.0.0',
      root: {
        id: 'root',
        type: 'Div',
        children: [
          /* ... */
        ],
      },
    }
    return <SduiLayoutRenderer document={document} components={sduiComponents} />
  },
}
```

### 5. Form + Zod Validation Pattern

```typescript
import { registerSchemas } from '@lodado/sdui-template-component'
import { z } from 'zod'

// Define schema
const schemas = {
  loginForm: z.object({
    email: z.string().min(1, 'Required').email('Invalid email'),
    password: z.string().min(8, 'Min 8 characters'),
  }),
}

// Register schemas before rendering
registerSchemas(schemas)

// Reference schemaName in document
const document: SduiLayoutDocument = {
  root: {
    id: 'form',
    type: 'Form',
    attributes: { schemaName: 'loginForm' },
    children: [
      {
        id: 'email-field',
        type: 'FormField',
        attributes: { name: 'email', label: 'Email' },
      },
    ],
  },
}
```

### 6. Next.js Integration Pattern

```typescript
// lib/sdui-document.ts - Document definition
export const loginDocument: SduiLayoutDocument = {
  /* ... */
}

// components/sdui-components.tsx - Component map
export const sduiComponents = { ...baseSduiComponents, CustomComponent }

// components/page-sdui.tsx - Renderer
;('use client')
import { SduiLayoutRenderer } from '@lodado/sdui-template'

export default function PageSdui() {
  return <SduiLayoutRenderer document={loginDocument} components={sduiComponents} />
}
```

### 7. Conditional Rendering Pattern (AuthSwitch Example)

```typescript
// AuthSlot: Compare slot value with current state
const AuthSlot: React.FC<{ nodeId: string }> = ({ nodeId }) => {
  const { state, childrenIds } = useSduiNodeSubscription({ nodeId })
  const { status } = useSession()

  // Only render when slot matches current status
  if (state.slot !== status) return null

  return <>{renderChildren(childrenIds)}</>
}

// Usage in document
{
  id: 'auth-area',
  type: 'AuthSwitch',
  children: [
    { id: 'loading', type: 'AuthSlot', state: { slot: 'loading' }, children: [...] },
    { id: 'authenticated', type: 'AuthSlot', state: { slot: 'authenticated' }, children: [...] },
    { id: 'unauthenticated', type: 'AuthSlot', state: { slot: 'unauthenticated' }, children: [...] },
  ],
}
```

### 8. Attributes vs State: Placement Rules

**Core Rule:**

- `attributes`: HTML-native attributes only (className, id, style, data-\*, aria-\*)
- `state`: Dynamic data + Radix UI / third-party component props

| Property Type   | Location     | Examples                                                |
| --------------- | ------------ | ------------------------------------------------------- |
| HTML attributes | `attributes` | `className`, `id`, `style`, `data-testid`, `aria-label` |
| Radix UI props  | `state`      | `side`, `sideOffset`, `align`, `disabled`, `open`       |
| SDUI-specific   | `state`      | `providerId`, `value`, `selectedId`, `label`            |

**Why this separation:**

- `attributes` maps directly to HTML DOM attributes
- `state` represents component-level logic and third-party library props
- This distinction enables proper serialization and type safety

**Correct Example:**

```typescript
{
  id: 'dropdown-content',
  type: 'DropdownContent',
  attributes: {
    className: 'custom-dropdown',  // HTML attribute
    'data-testid': 'main-dropdown', // HTML attribute
  },
  state: {
    providerId: 'dropdown-root',  // SDUI-specific
    side: 'bottom',               // Radix UI prop
    sideOffset: 4,                // Radix UI prop
    align: 'start',               // Radix UI prop
  },
}
```

**Anti-pattern (DON'T):**

```typescript
// ❌ Bad: Radix props in attributes
{
  type: 'DropdownContent',
  attributes: {
    side: 'bottom',     // Wrong! Radix prop should be in state
    sideOffset: 4,      // Wrong!
  },
}

// ❌ Bad: HTML attributes in state
{
  type: 'DropdownContent',
  state: {
    className: 'custom', // Wrong! HTML attr should be in attributes
  },
}
```

### 9. Compound Component Pattern with providerId

When implementing compound components (like Dropdown, Dialog) with SDUI:

1. **Provider (Root)**: Holds shared state (`open`, `selectedId`)
2. **Children**: Use `state.providerId` to subscribe to provider's state (optional - can inherit from context)

**Pattern (Simplified - providerId inherited from context):**

```typescript
{
  id: 'dropdown-root',
  type: 'Dropdown',
  state: { open: false, selectedId: 'opt-1' },  // Provider state
  children: [
    {
      id: 'trigger',
      type: 'DropdownTrigger',
      // providerId omitted - automatically inherits from parent Dropdown
      children: [{ type: 'Button', ... }],
    },
    {
      id: 'content',
      type: 'DropdownContent',
      state: { side: 'bottom' },  // Radix props in state
      // providerId omitted - automatically inherits from parent Dropdown
      children: [
        { id: 'item-1', type: 'DropdownItem', state: { value: 'opt-1', label: 'Option 1' } },
        { id: 'item-2', type: 'DropdownItem', state: { value: 'opt-2', label: 'Option 2' } },
      ],
    },
  ],
}
```

**Pattern (Explicit providerId - for nested/cross-referencing):**

```typescript
{
  id: 'dropdown-root',
  type: 'Dropdown',
  state: { open: false, selectedId: 'opt-1' },
  children: [
    {
      id: 'trigger',
      type: 'DropdownTrigger',
      state: { providerId: 'dropdown-root' },  // Explicit - useful for nested dropdowns
      children: [{ type: 'Button', ... }],
    },
    // ...
  ],
}
```

**providerId Inheritance Rules:**

1. If `state.providerId` is specified, use that explicit ID
2. If omitted, inherit from nearest parent compound component via React Context
3. Use explicit `providerId` when referencing a different provider (e.g., nested Dropdowns)

**Why this hybrid approach:**

- Simplifies common cases (single dropdown) - no need to repeat providerId everywhere
- Supports complex cases (nested dropdowns) via explicit providerId
- Documents remain serializable JSON
- State changes still tracked through SDUI store

**Container Implementation Pattern:**

```typescript
// Child component uses providerId from state, falls back to context
export const DropdownItemContainer = ({ id }) => {
  const { state } = useSduiNodeSubscription({ nodeId: id })
  const store = useSduiLayoutAction()
  const dropdownContext = useDropdownContext() // React Context for inheritance

  // Use explicit providerId if specified, otherwise inherit from context
  const providerId = state?.providerId ?? dropdownContext?.providerId
  const value = state?.value as string
  const label = state?.label as string

  // Subscribe to provider's state
  const { state: providerState } = useSduiNodeSubscription({
    nodeId: providerId ?? '',
  })

  const selectedId = providerState?.selectedId as string
  const isSelected = selectedId === value

  const handleSelect = () => {
    if (providerId) {
      store.updateNodeState(providerId, { selectedId: value, open: false })
    }
  }

  return <DropdownItem label={label} isSelected={isSelected} onSelect={handleSelect} />
}
```

## When to Use

- Implementing new components with SDUI library
- Writing Storybook stories
- Creating custom SDUI components
- Integrating SDUI with Next.js
- Writing SDUI documents with form validation
- Implementing compound components (Dropdown, Dialog, Tabs, etc.)

## Example Files

- Storybook stories: `apps/docs/src/stories/`
- Next.js example: `apps/nextAuthOauthLoginExample/src/app/components/`
- Document definition: `apps/nextAuthOauthLoginExample/src/app/lib/sdui-document.ts`
- Compound Dropdown: `packages/sdui-template-component/src/shared/ui/dropdown/`
