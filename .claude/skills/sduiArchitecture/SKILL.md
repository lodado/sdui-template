---
name: sduiArchitecture
# prettier-ignore
description: Implementing compound components (Dropdown, Dialog, Popover, Tabs, etc.) in Server-Driven UI systems
---

In SDUI, components are rendered from JSON documents. Each node is isolated and only knows its own `id`, `state`, and `attributes`. This creates a fundamental challenge:

**How do child components (like DropdownItem) access and modify shared state (like `selectedId`) from a parent provider (like Dropdown)?**

Traditional React solutions don't work:

- **Props drilling**: Not possible in SDUI - nodes don't pass props to children directly
- **React Context only**: Lost during SSR/hydration, not serializable to JSON
- **Global state**: No scoping for nested components

## Solution: Provider Pattern with providerId + Context Inheritance

### Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                    SDUI Document (JSON)                     │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌───────────────────────────────────────────────────────┐  │
│  │  Provider (Root Component)                            │  │
│  │  id: "dropdown-root"                                  │  │
│  │  state: { open: false, selectedId: "opt-1" }         │  │
│  │                                                       │  │
│  │  ┌─────────────────────────────────────────────────┐  │  │
│  │  │  React Context Provider                         │  │  │
│  │  │  value: { providerId: "dropdown-root" }         │  │  │
│  │  │                                                 │  │  │
│  │  │  ┌───────────────────────────────────────────┐  │  │  │
│  │  │  │  Child Component (Trigger/Content/Item)  │  │  │  │
│  │  │  │                                          │  │  │  │
│  │  │  │  1. Check state.providerId               │  │  │  │
│  │  │  │  2. If missing, get from Context         │  │  │  │
│  │  │  │  3. Subscribe to provider's state        │  │  │  │
│  │  │  │  4. Update provider's state on action    │  │  │  │
│  │  │  └───────────────────────────────────────────┘  │  │  │
│  │  └─────────────────────────────────────────────────┘  │  │
│  └───────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

### Key Components

#### 1. Context Definition

```typescript
// Create context for providerId inheritance
interface CompoundContextValue {
  providerId: string
}

const CompoundContext = createContext<CompoundContextValue | null>(null)

export const useCompoundContext = () => useContext(CompoundContext)
```

#### 2. Provider (Root) Component

```typescript
export interface RootProps {
  id?: string // SDUI node ID - also serves as providerId
  children?: React.ReactNode
  // Shared state props
  open?: boolean
  onOpenChange?: (open: boolean) => void
}

export const Root = ({ id, children, open, onOpenChange }: RootProps) => {
  const contextValue = useMemo(() => (id ? { providerId: id } : null), [id])

  const content = (
    <RadixPrimitive.Root open={open} onOpenChange={onOpenChange}>
      {children}
    </RadixPrimitive.Root>
  )

  // Wrap with context only if id is provided
  if (contextValue) {
    return <CompoundContext.Provider value={contextValue}>{content}</CompoundContext.Provider>
  }

  return content
}
```

#### 3. SDUI Container for Root

```typescript
export const RootContainer = ({ id, parentPath = [] }: ContainerProps) => {
  const { childrenIds, state } = useSduiNodeSubscription({ nodeId: id })
  const { renderChildren } = useRenderNode({ nodeId: id, parentPath })
  const store = useSduiLayoutAction()

  const handleOpenChange = useCallback(
    (open: boolean) => {
      store.updateNodeState(id, { open })
    },
    [id, store],
  )

  return (
    <Root
      id={id} // Pass id for context provider
      open={state?.open ?? false}
      onOpenChange={handleOpenChange}
    >
      {renderChildren(childrenIds)}
    </Root>
  )
}
```

#### 4. Child Container with providerId Fallback

```typescript
export const ChildContainer = ({ id, parentPath = [] }: ContainerProps) => {
  const { state } = useSduiNodeSubscription({ nodeId: id })
  const store = useSduiLayoutAction()
  const compoundContext = useCompoundContext() // Get context

  // Use explicit providerId if specified, otherwise inherit from context
  const providerId = state?.providerId ?? compoundContext?.providerId

  // Subscribe to provider's state
  const { state: providerState } = useSduiNodeSubscription({
    nodeId: providerId ?? '',
  })

  // Access shared state
  const isOpen = providerState?.open ?? false
  const selectedId = providerState?.selectedId

  // Update provider's state
  const handleAction = useCallback(() => {
    if (providerId) {
      store.updateNodeState(providerId, {
        selectedId: state?.value,
        open: false,
      })
    }
  }, [providerId, state?.value, store])

  return <ChildComponent onAction={handleAction} />
}
```

### State Schema Design

```typescript
// Provider state - holds shared state
export const rootStateSchema = z.object({
  open: z.boolean().optional(),
  selectedId: z.string().optional(),
})

// Child state - providerId is OPTIONAL (inherits from context)
export const childStateSchema = z.object({
  providerId: z.string().optional(), // Optional!
  value: z.string(),
  label: z.string(),
  disabled: z.boolean().optional(),
})
```

### SDUI Document Structure

#### Simplified (providerId inherited from context)

```json
{
  "id": "dropdown-root",
  "type": "Dropdown",
  "state": { "open": false, "selectedId": "opt-1" },
  "children": [
    {
      "type": "DropdownTrigger",
      "children": [{ "type": "Button", "children": [...] }]
    },
    {
      "type": "DropdownContent",
      "state": { "side": "bottom" },
      "children": [
        { "type": "DropdownItem", "state": { "value": "opt-1", "label": "Option 1" } },
        { "type": "DropdownItem", "state": { "value": "opt-2", "label": "Option 2" } }
      ]
    }
  ]
}
```

#### Explicit (for nested/cross-referencing scenarios)

```json
{
  "id": "outer-dropdown",
  "type": "Dropdown",
  "children": [
    {
      "id": "inner-dropdown",
      "type": "Dropdown",
      "children": [
        {
          "type": "DropdownItem",
          "state": {
            "providerId": "inner-dropdown",
            "value": "inner-opt"
          }
        }
      ]
    }
  ]
}
```

## Applicable Components

This architecture applies to any compound component pattern:

| Component     | Provider  | Shared State         | Children                                       |
| ------------- | --------- | -------------------- | ---------------------------------------------- |
| **Dropdown**  | Dropdown  | `open`, `selectedId` | Trigger, Content, Item, Value                  |
| **Dialog**    | Dialog    | `open`               | Trigger, Portal, Content, Header, Body, Footer |
| **Popover**   | Popover   | `open`               | Trigger, Content, Arrow                        |
| **Tabs**      | Tabs      | `activeTab`          | List, Trigger, Content                         |
| **Accordion** | Accordion | `expandedItems`      | Item, Trigger, Content                         |
| **Select**    | Select    | `open`, `value`      | Trigger, Content, Item, Value                  |
| **Menu**      | Menu      | `open`               | Trigger, Content, Item, SubMenu                |
| **Tooltip**   | Tooltip   | `open`               | Trigger, Content                               |

## Key Design Decisions

### 1. Why providerId + Context (Hybrid Approach)?

| Approach                 | SDUI Compatible | Serializable | Nested Support | DX  |
| ------------------------ | --------------- | ------------ | -------------- | --- |
| React Context only       | ❌              | ❌           | ⚠️             | ✅  |
| Props drilling           | ❌              | ✅           | ❌             | ❌  |
| Global store key         | ✅              | ✅           | ❌             | ⚠️  |
| **providerId + Context** | ✅              | ✅           | ✅             | ✅  |

### 2. Why providerId is Optional?

- **Common case**: Single dropdown - no need to specify providerId everywhere
- **Complex case**: Nested dropdowns - explicit providerId for clarity
- **Best DX**: Less boilerplate, still explicit when needed

### 3. Attributes vs State Separation

| Field          | Location     | Examples                                       |
| -------------- | ------------ | ---------------------------------------------- |
| HTML-native    | `attributes` | `className`, `id`, `style`, `data-*`, `aria-*` |
| Radix UI props | `state`      | `side`, `sideOffset`, `align`, `disabled`      |
| SDUI-specific  | `state`      | `providerId`, `value`, `label`, `open`         |

## Implementation Checklist

When implementing a new compound component:

- [ ] Create Context and `useCompoundContext` hook
- [ ] Root component provides Context with its `id`
- [ ] Root Container passes `id` to Root component
- [ ] Child state schemas have `providerId` as **optional**
- [ ] Child containers use `state.providerId ?? context?.providerId`
- [ ] Child containers subscribe to provider state via `useSduiNodeSubscription`
- [ ] Register all containers in `sduiComponents` map
- [ ] Export Context hook from index.ts

## When to Use

- Implementing compound components in SDUI
- Components with shared state between parent and children
- Components that need to work in nested scenarios
- Any Radix UI primitive being wrapped for SDUI

## Related Files

- `packages/sdui-template-component/src/shared/ui/dropdown/` - Reference implementation
- `packages/sdui-template-component/src/features/dialog/` - Dialog implementation
- `apps/docs/src/stories/Dropdown.stories.tsx` - Usage examples
