---
name: sduiComponents
description: Component-by-component reference for @lodado/sdui-template-component — props, state schema, and SDUI JSON examples for all 19 components
---

## Overview

`@lodado/sdui-template-component` provides 19 ready-made components that map directly to SDUI document node `type` values.

### Quick Import

```typescript
import { SduiLayoutRenderer } from '@lodado/sdui-template'
import { sduiComponents } from '@lodado/sdui-template-component'

<SduiLayoutRenderer document={doc} components={sduiComponents} />
```

### Key Rules

- `state` → dynamic props (Radix UI props, component logic, SDUI-specific values)
- `attributes` → static HTML attributes only (`className`, `data-*`, `aria-*`)
- All compound components inherit `providerId` from React Context — explicit only needed for nested cases
- Every `id` must be unique across the entire document

---

## Base Components

### Div

Generic container. Supports `ErrorBoundary` internally.

| type | `Div` |
|------|-------|
| state | none (uses `attributes`) |
| attributes | `className`, `style`, `data-*`, `aria-*` |

```json
{
  "id": "wrapper",
  "type": "Div",
  "attributes": { "className": "flex flex-col gap-4 p-6" },
  "children": []
}
```

---

### Text / Span

Renders text content.

| type | `Text` / `Span` |
|------|-----------------|
| state.text | `string` — text to display |

```json
{ "id": "label", "type": "Span", "state": { "text": "Hello World" } }
```

---

### Icon

SVG container with predefined sizes.

| type | `Icon` |
|------|--------|
| state.size | `"12px"` `"16px"` `"20px"` `"24px"` `"32px"` `"40px"` `"48px"` `"64px"` or any CSS string |
| children | SVG node |

```json
{
  "id": "search-icon",
  "type": "Icon",
  "state": { "size": "24px" },
  "children": [
    { "id": "svg", "type": "Span", "state": { "text": "🔍" } }
  ]
}
```

Note: Predefined sizes use Tailwind classes; custom sizes use inline styles.

---

## Display Components

### Badge

Visual indicator for counts and labels.

| type | `Badge` |
|------|---------|
| state.label | `string \| number` **required** |
| state.appearance | `"default"` `"primary"` `"primaryInverted"` `"important"` `"added"` `"removed"` |

```json
{
  "id": "notification-badge",
  "type": "Badge",
  "state": { "label": 25, "appearance": "primary" }
}
```

`added` → green with `+` prefix, `removed` → red with `-` prefix.

---

### Tag

Colored label pill.

| type | `Tag` |
|------|-------|
| state.text | `string` **required** |
| state.color | `"standard"` `"blue"` `"red"` `"yellow"` `"green"` `"teal"` `"purple"` `"grey"` `"lime"` `"orange"` `"magenta"` |

```json
{
  "id": "status-tag",
  "type": "Tag",
  "state": { "text": "In Progress", "color": "blue" }
}
```

---

### Card

Content container with optional header.

| type | `Card` |
|------|--------|
| state.title | `string` optional — renders a header bar |

```json
{
  "id": "info-card",
  "type": "Card",
  "state": { "title": "Summary" },
  "children": [
    { "id": "card-body", "type": "Span", "state": { "text": "Card content here" } }
  ]
}
```

---

## Input Components

### Button

| type | `Button` |
|------|----------|
| state.appearance | `"default"` `"primary"` `"subtle"` `"warning"` `"danger"` |
| state.spacing | `"default"` (32px height) `"compact"` (24px height) |
| state.isDisabled | `boolean` |
| state.isLoading | `boolean` — shows spinner |
| state.isSelected | `boolean` |

```json
{
  "id": "submit-btn",
  "type": "Button",
  "state": {
    "appearance": "primary",
    "isLoading": false,
    "spacing": "default"
  },
  "children": [
    { "id": "btn-text", "type": "Span", "state": { "text": "Save Changes" } }
  ]
}
```

---

### Toggle

On/off switch.

| type | `Toggle` |
|------|----------|
| state.isChecked | `boolean` |
| state.isDisabled | `boolean` |
| state.isLoading | `boolean` |
| state.size | `"regular"` `"large"` |
| state.label | `string` optional |

```json
{
  "id": "dark-mode-toggle",
  "type": "Toggle",
  "state": {
    "isChecked": false,
    "size": "regular",
    "label": "Dark mode"
  }
}
```

---

### Checkbox (Compound)

Sub-types: `Checkbox` · `CheckboxLabel` · `CheckboxCheckbox`

**Root (`Checkbox`)**

| state.disabled | `boolean` |
|----------------|-----------|
| state.required | `boolean` |
| state.error | `boolean` |

**CheckboxCheckbox**

| state.checked | `boolean` |
|---------------|-----------|
| state.indeterminate | `boolean` — "Select All" tri-state |
| state.disabled | `boolean` |

**CheckboxLabel** — wrap text with `Span` child

```json
{
  "id": "tos-checkbox",
  "type": "Checkbox",
  "state": { "required": true },
  "children": [
    {
      "id": "tos-label",
      "type": "CheckboxLabel",
      "children": [{ "id": "tos-text", "type": "Span", "state": { "text": "Accept Terms" } }]
    },
    { "id": "tos-input", "type": "CheckboxCheckbox", "state": { "checked": false } }
  ]
}
```

---

### TextField (Compound)

Sub-types: `TextField` · `TextFieldWrapper` · `TextFieldLabel` · `TextFieldInput` · `TextFieldHelpMessage`

**Root (`TextField`)**

| state.error | `boolean` |
|-------------|-----------|
| state.errorMessage | `string` |
| state.helpMessage | `string` |
| state.disabled | `boolean` |
| state.required | `boolean` |
| state.size | `"default"` `"compact"` |
| state.appearance | `"standard"` `"subtle"` `"none"` |

**TextFieldInput**

| attributes.placeholder | `string` |
|------------------------|----------|
| attributes.type | `"text"` `"email"` `"password"` `"number"` `"tel"` `"url"` `"search"` |
| attributes.maxLength | `number` |
| state.value | `string` |

```json
{
  "id": "email-field",
  "type": "TextField",
  "state": { "required": true, "helpMessage": "We'll never share your email" },
  "children": [
    {
      "id": "email-label",
      "type": "TextFieldLabel",
      "children": [{ "id": "label-text", "type": "Span", "state": { "text": "Email" } }]
    },
    { "id": "email-input", "type": "TextFieldInput", "attributes": { "type": "email", "placeholder": "you@example.com" } },
    { "id": "email-help", "type": "TextFieldHelpMessage" }
  ]
}
```

---

### Dropdown (Compound)

Sub-types: `Dropdown` · `DropdownTrigger` · `DropdownContent` · `DropdownItem` · `DropdownValue`

**Root (`Dropdown`)**

| state.open | `boolean` |
|------------|-----------|
| state.selectedId | `string` |

**DropdownContent**

| state.side | `"top"` `"right"` `"bottom"` `"left"` |
|------------|----------------------------------------|
| state.sideOffset | `number` |
| state.align | `"start"` `"center"` `"end"` |
| state.spacing | `"default"` `"compact"` `"cozy"` |

**DropdownItem**

| state.value | `string` **required** |
|-------------|----------------------|
| state.label | `string` **required** |
| state.disabled | `boolean` |

**DropdownValue** — displays currently selected option

| state.options | `Array<{ id: string, label: string }>` |
|---------------|----------------------------------------|
| state.placeholder | `string` |

```json
{
  "id": "size-dropdown",
  "type": "Dropdown",
  "state": { "open": false, "selectedId": "sm" },
  "children": [
    {
      "id": "size-trigger",
      "type": "DropdownTrigger",
      "children": [
        {
          "id": "size-value",
          "type": "DropdownValue",
          "state": {
            "placeholder": "Select size",
            "options": [
              { "id": "sm", "label": "Small" },
              { "id": "md", "label": "Medium" },
              { "id": "lg", "label": "Large" }
            ]
          }
        }
      ]
    },
    {
      "id": "size-content",
      "type": "DropdownContent",
      "state": { "side": "bottom", "sideOffset": 4 },
      "children": [
        { "id": "item-sm", "type": "DropdownItem", "state": { "value": "sm", "label": "Small" } },
        { "id": "item-md", "type": "DropdownItem", "state": { "value": "md", "label": "Medium" } },
        { "id": "item-lg", "type": "DropdownItem", "state": { "value": "lg", "label": "Large" } }
      ]
    }
  ]
}
```

---

## Overlay Components

### Tooltip (Compound)

Sub-types: `Tooltip` · `TooltipTrigger` · `TooltipContent`

**Root (`Tooltip`)**

| state.open | `boolean` |
|------------|-----------|
| state.delayDuration | `number` ms |
| state.defaultOpen | `boolean` |

**TooltipContent**

| state.side | `"top"` `"right"` `"bottom"` `"left"` |
|------------|----------------------------------------|
| state.sideOffset | `number` |
| state.align | `"start"` `"center"` `"end"` |

```json
{
  "id": "info-tooltip",
  "type": "Tooltip",
  "state": { "delayDuration": 300 },
  "children": [
    {
      "id": "tooltip-trigger",
      "type": "TooltipTrigger",
      "children": [{ "id": "help-btn", "type": "Button", "state": { "appearance": "subtle" }, "children": [{ "id": "help-text", "type": "Span", "state": { "text": "?" } }] }]
    },
    {
      "id": "tooltip-content",
      "type": "TooltipContent",
      "state": { "side": "top", "sideOffset": 4 },
      "children": [{ "id": "tip-text", "type": "Span", "state": { "text": "Helpful hint" } }]
    }
  ]
}
```

---

### Popover (Compound)

Sub-types: `Popover` · `PopoverTrigger` · `PopoverContent` · `PopoverClose`

**Root (`Popover`)**

| state.open | `boolean` |
|------------|-----------|
| state.modal | `boolean` |

**PopoverContent**

| state.size | `"small"` `"medium"` `"large"` |
|------------|-------------------------------|
| state.side | `"top"` `"right"` `"bottom"` `"left"` |
| state.sideOffset | `number` |
| state.align | `"start"` `"center"` `"end"` |

```json
{
  "id": "filter-popover",
  "type": "Popover",
  "state": { "open": false },
  "children": [
    {
      "id": "filter-trigger",
      "type": "PopoverTrigger",
      "children": [{ "id": "filter-btn", "type": "Button", "state": { "appearance": "default" }, "children": [{ "id": "filter-text", "type": "Span", "state": { "text": "Filter" } }] }]
    },
    {
      "id": "filter-content",
      "type": "PopoverContent",
      "state": { "size": "medium", "side": "bottom", "sideOffset": 8 },
      "children": [
        { "id": "filter-body", "type": "Span", "state": { "text": "Filter options here" } },
        { "id": "filter-close", "type": "PopoverClose" }
      ]
    }
  ]
}
```

---

### Dialog (Compound)

Sub-types: `Dialog` · `DialogTrigger` · `DialogPortal` · `DialogContent` · `DialogHeader` · `DialogBody` · `DialogFooter`

**Root (`Dialog`)**

| state.open | `boolean` |
|------------|-----------|

**DialogContent**

| state.size | `"small"` `"medium"` `"large"` `"xlarge"` |
|------------|-------------------------------------------|

**DialogHeader**

| state.title | `string` |
|-------------|----------|
| state.hasCloseButton | `boolean` |

**DialogFooter**

| state.cancelLabel | `string` |
|-------------------|----------|
| state.confirmLabel | `string` |
| state.appearance | `"default"` `"danger"` `"warning"` |

```json
{
  "id": "delete-dialog",
  "type": "Dialog",
  "state": { "open": false },
  "children": [
    {
      "id": "delete-trigger",
      "type": "DialogTrigger",
      "children": [{ "id": "delete-btn", "type": "Button", "state": { "appearance": "danger" }, "children": [{ "id": "delete-text", "type": "Span", "state": { "text": "Delete" } }] }]
    },
    {
      "id": "delete-portal",
      "type": "DialogPortal",
      "children": [
        {
          "id": "delete-content",
          "type": "DialogContent",
          "state": { "size": "small" },
          "children": [
            { "id": "delete-header", "type": "DialogHeader", "state": { "title": "Confirm Delete", "hasCloseButton": true } },
            {
              "id": "delete-body",
              "type": "DialogBody",
              "children": [{ "id": "delete-desc", "type": "Span", "state": { "text": "This action cannot be undone." } }]
            },
            { "id": "delete-footer", "type": "DialogFooter", "state": { "cancelLabel": "Cancel", "confirmLabel": "Delete", "appearance": "danger" } }
          ]
        }
      ]
    }
  ]
}
```

---

## Layout Components

### List (Compound)

Sub-types: `List` · `ListIcon` · `ListContent` · `ListTitle` · `ListDescription` · `ListArrow`

**Root (`List`)**

| state.disabled | `boolean` |
|----------------|-----------|

**ListIcon**

| state.color | `"default"` `"blue"` `"green"` `"purple"` `"red"` |
|-------------|---------------------------------------------------|

```json
{
  "id": "task-list-item",
  "type": "List",
  "children": [
    {
      "id": "task-icon",
      "type": "ListIcon",
      "state": { "color": "green" },
      "children": [{ "id": "task-icon-svg", "type": "Span", "state": { "text": "✓" } }]
    },
    {
      "id": "task-content",
      "type": "Div",
      "children": [
        { "id": "task-title", "type": "Span", "state": { "text": "Complete onboarding" } },
        { "id": "task-desc", "type": "Span", "state": { "text": "Fill out your profile" } }
      ]
    },
    { "id": "task-arrow", "type": "ListArrow" }
  ]
}
```

---

### Title (Compound)

Sub-types: `Title` · `TitleLogo` · `TitleLeft` · `TitleMiddle` · `TitleRight`

```json
{
  "id": "page-title",
  "type": "Title",
  "children": [
    { "id": "title-logo", "type": "TitleLogo", "children": [{ "id": "logo-text", "type": "Span", "state": { "text": "MyApp" } }] },
    { "id": "title-left", "type": "TitleLeft", "children": [] },
    { "id": "title-middle", "type": "TitleMiddle", "children": [{ "id": "page-name", "type": "Span", "state": { "text": "Dashboard" } }] },
    { "id": "title-right", "type": "TitleRight", "children": [] }
  ]
}
```

---

## Feature Components

### Form (Compound)

Sub-types: `Form` · `FormField`

Integrates `react-hook-form` + `zod`. Register schemas before rendering.

**Root (`Form`)**

| attributes.schemaName | `string` — key in registered schemas |
|----------------------|---------------------------------------|
| attributes.onSubmit | `string` — handler name |

**FormField**

| attributes.name | `string` **required** — field key in schema |
|----------------|---------------------------------------------|
| attributes.label | `string` |
| attributes.required | `boolean` |
| attributes.type | `"text"` `"email"` `"password"` `"number"` |
| attributes.placeholder | `string` |

```typescript
// Register schema before rendering (app entry point)
import { registerSchemas } from '@lodado/sdui-template-component'
import { z } from 'zod'

registerSchemas({
  loginForm: z.object({
    email: z.string().email('Invalid email'),
    password: z.string().min(8, 'Minimum 8 characters'),
  }),
})
```

```json
{
  "id": "login-form",
  "type": "Form",
  "attributes": { "schemaName": "loginForm" },
  "children": [
    { "id": "field-email", "type": "FormField", "attributes": { "name": "email", "label": "Email", "type": "email", "placeholder": "you@example.com" } },
    { "id": "field-password", "type": "FormField", "attributes": { "name": "password", "label": "Password", "type": "password" } },
    {
      "id": "form-submit",
      "type": "Button",
      "state": { "appearance": "primary" },
      "attributes": { "type": "submit" },
      "children": [{ "id": "submit-text", "type": "Span", "state": { "text": "Sign In" } }]
    }
  ]
}
```

---

### Canvas3D

3D canvas rendering with pluggable render strategy.

| type | `Canvas3D` |
|------|------------|
| requires | Custom `renderStrategy` — pass via `createSduiComponents` |

```typescript
// Must use createSduiComponents to inject render strategy
import { createSduiComponents } from '@lodado/sdui-template-component'

const components = createSduiComponents({
  canvas3DRenderStrategy: myThreeJsStrategy,
})
```

```json
{
  "id": "3d-canvas",
  "type": "Canvas3D",
  "state": { "width": 800, "height": 600 },
  "children": [
    { "id": "canvas-collection", "type": "Canvas3DCollection", "children": [] }
  ]
}
```

---

## Component Type Reference

Quick lookup — all valid `type` strings:

| Category | Types |
|----------|-------|
| Base | `Div` `Text` `Span` `Icon` |
| Display | `Badge` `Tag` `Card` |
| List | `List` `ListIcon` `ListContent` `ListTitle` `ListDescription` `ListArrow` |
| Input | `Button` `Toggle` |
| Checkbox | `Checkbox` `CheckboxCheckbox` `CheckboxLabel` |
| TextField | `TextField` `TextFieldWrapper` `TextFieldLabel` `TextFieldInput` `TextFieldHelpMessage` |
| Dropdown | `Dropdown` `DropdownTrigger` `DropdownContent` `DropdownItem` `DropdownValue` |
| Tooltip | `Tooltip` `TooltipTrigger` `TooltipContent` |
| Popover | `Popover` `PopoverTrigger` `PopoverContent` `PopoverClose` |
| Dialog | `Dialog` `DialogTrigger` `DialogPortal` `DialogContent` `DialogHeader` `DialogBody` `DialogFooter` |
| Form | `Form` `FormField` |
| Layout | `Title` `TitleLogo` `TitleLeft` `TitleMiddle` `TitleRight` |
| Canvas | `Canvas3D` `Canvas3DCollection` `Canvas3DItem` |

## When to Use

- Writing SDUI documents for any `@lodado/sdui-template-component` component
- Checking which `type` string maps to which component
- Looking up available `state` props and their valid values
- Writing Storybook stories for new components

## Related Skills

- `sduiFormat` — document structure, Zod schema pattern, custom component creation
- `sduiArchitecture` — compound component architecture, providerId pattern deep-dive
