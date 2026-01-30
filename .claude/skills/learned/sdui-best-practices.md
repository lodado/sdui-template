# SDUI Template Best Practices

**Extracted:** 2026-01-30
**Context:** Server-Driven UI implementation using @lodado/sdui-template library

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
        id: 'child-1',           // Unique, meaningful ID
        type: 'ComponentType',   // Component type
        state: {                 // Dynamic data (mutable)
          text: 'Dynamic content',
        },
        attributes: {            // Static props (className, as, etc.)
          className: 'styling-class',
        },
        children: [],            // Child nodes
      },
    ],
  },
}
```

**Key Rules:**
- `id`: Assign unique, meaningful IDs to all nodes (e.g., `form-field-email`, `submit-button`)
- `state`: Dynamic data that can change at runtime
- `attributes`: Static HTML attributes (className, type, placeholder, etc.)

### 2. Custom Component Creation Pattern

```typescript
'use client'

import {
  type ComponentFactory,
  useSduiNodeSubscription,
  useRenderNode,
} from '@lodado/sdui-template'
import { sduiComponents as baseSduiComponents } from '@lodado/sdui-template-component'
import { z } from 'zod'

// 1. Define state type with Zod schema
const myComponentStateSchema = z.object({
  label: z.string().optional(),
  variant: z.enum(['primary', 'secondary']).optional(),
})

type MyComponentState = z.infer<typeof myComponentStateSchema>

// 2. Implement component
const MyComponent: React.FC<{ nodeId: string; parentPath?: string[] }> = ({
  nodeId,
  parentPath = [],
}) => {
  // @ts-expect-error - Zod version compatibility issue
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
const MyComponentFactory: ComponentFactory = (id, parentPath) => (
  <MyComponent nodeId={id} parentPath={parentPath} />
)

// 4. Export component map (extending base components)
export const sduiComponents: Record<string, ComponentFactory> = {
  ...baseSduiComponents,
  MyComponent: MyComponentFactory,
}
```

### 3. Storybook Story Writing Pattern

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
        children: [/* ... */],
      },
    }
    return <SduiLayoutRenderer document={document} components={sduiComponents} />
  },
}
```

### 4. Form + Zod Validation Pattern

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

### 5. Next.js Integration Pattern

```typescript
// lib/sdui-document.ts - Document definition
export const loginDocument: SduiLayoutDocument = { /* ... */ }

// components/sdui-components.tsx - Component map
export const sduiComponents = { ...baseSduiComponents, CustomComponent }

// components/page-sdui.tsx - Renderer
'use client'
import { SduiLayoutRenderer } from '@lodado/sdui-template'

export default function PageSdui() {
  return <SduiLayoutRenderer document={loginDocument} components={sduiComponents} />
}
```

### 6. Conditional Rendering Pattern (AuthSwitch Example)

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

## When to Use

- Implementing new components with SDUI library
- Writing Storybook stories
- Creating custom SDUI components
- Integrating SDUI with Next.js
- Writing SDUI documents with form validation

## Example Files

- Storybook stories: `apps/docs/src/stories/`
- Next.js example: `apps/nextAuthOauthLoginExample/src/app/components/`
- Document definition: `apps/nextAuthOauthLoginExample/src/app/lib/sdui-document.ts`
