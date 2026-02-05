import '@lodado/sdui-design-files/colors.css'

import { type SduiLayoutDocument, SduiLayoutRenderer } from '@lodado/sdui-template'
import { Radio, sduiComponents } from '@lodado/sdui-template-component'
import type { Meta, StoryObj } from '@storybook/react-vite'
import React from 'react'

const meta: Meta<typeof Radio.Root> = {
  title: 'Shared/UI/Radio',
  component: Radio.Root,
  tags: ['autodocs'],
  argTypes: {
    disabled: {
      control: 'boolean',
      description: 'Whether the radio is disabled',
      table: {
        defaultValue: { summary: 'false' },
      },
    },
    required: {
      control: 'boolean',
      description: 'Whether the radio is required',
      table: {
        defaultValue: { summary: 'false' },
      },
    },
    error: {
      control: 'boolean',
      description: 'Whether the radio has an error',
      table: {
        defaultValue: { summary: 'false' },
      },
    },
  },
  parameters: {
    docs: {
      description: {
        component: `
## Overview

The **Radio** component follows the Atlassian Design System (ADS) specifications.
A radio button allows users to select only one option from a number of choices.

## Compound Pattern Structure

\`\`\`json
{
  "id": "radio-group-1",
  "type": "RadioGroup",
  "state": { "value": "option1", "disabled": false, "error": false },
  "children": [
    {
      "type": "Radio",
      "children": [
        { "type": "RadioLabel", "children": [{ "type": "Text", "text": "Option 1" }] },
        { "type": "RadioRadio", "state": { "value": "option1" } }
      ]
    },
    {
      "type": "Radio",
      "children": [
        { "type": "RadioLabel", "children": [{ "type": "Text", "text": "Option 2" }] },
        { "type": "RadioRadio", "state": { "value": "option2" } }
      ]
    }
  ]
}
\`\`\`

---

## Why Provider Pattern?

### The Problem

In SDUI, components are rendered from JSON documents. Unlike React components that share state via props drilling or Context, SDUI nodes are **isolated** - each node only knows its own \`id\`, \`state\`, and \`attributes\`.

**How does a RadioRadio know which RadioGroup's \`value\` to compare against?**

### The Solution: Provider Pattern

The **Provider Pattern** solves this by:

1. **Provider (Root)**: The \`RadioGroup\` component holds shared state (\`value\`, \`disabled\`, \`required\`, \`error\`, \`name\`)
2. **Subscriber (Children)**: Child \`RadioRadio\` components subscribe to the provider's state via \`providerId\`

\`\`\`
┌─────────────────────────────────────────────┐
│  RadioGroup (id: "radio-group-1")          │
│  state: { value: "option1", disabled: false }│
│                                             │
│  ┌─────────────────────────────────────┐    │
│  │  Radio (Root)                       │    │
│  │  ┌─────────────────────────────┐    │    │
│  │  │  RadioLabel                 │    │    │
│  │  │  "Option 1"                 │    │    │
│  │  └─────────────────────────────┘    │    │
│  │  ┌─────────────────────────────┐    │    │
│  │  │  RadioRadio (value: option1)│    │    │
│  │  │  → subscribes to "radio-group-1"││    │
│  │  │  → compares with value       │    │    │
│  │  │  → updates value on select   │    │    │
│  │  └─────────────────────────────┘    │    │
│  └─────────────────────────────────────┘    │
└─────────────────────────────────────────────┘
\`\`\`

### Why Not Just Use React Context?

| Approach | SDUI Compatibility | Serializable | Nested Support |
|----------|-------------------|--------------|----------------|
| React Context only | ❌ Lost on SSR/hydration | ❌ Not JSON | ⚠️ Complex |
| Props drilling | ❌ Not possible in SDUI | ✅ Yes | ❌ Verbose |
| **providerId + Context** | ✅ Full support | ✅ Yes | ✅ Explicit |

**Key benefits of providerId:**

1. **SDUI documents are JSON** - Must be serializable for server-side rendering
2. **Explicit targeting** - Nested radio groups can reference specific providers
3. **Store-based state** - Changes tracked in SDUI store, enabling debugging/time-travel

---

## providerId Inheritance

**providerId is optional!** Child components automatically inherit from parent RadioGroup context.

### How it works:

1. If \`state.providerId\` is specified → use that explicit ID
2. If omitted → inherit from nearest parent \`RadioGroup\` via React Context

### When to use explicit providerId:

- **Nested radio groups**: Inner group's children should reference the inner provider
- **Cross-referencing**: A component outside the tree needs to reference a specific radio group
- **Dynamic scenarios**: Provider ID changes at runtime

### Example: Nested Radio Groups

\`\`\`json
{
  "id": "outer-group",
  "type": "RadioGroup",
  "state": { "value": "outer-opt-1" },
  "children": [
    {
      "id": "inner-group",
      "type": "RadioGroup",
      "state": { "value": "inner-opt-1" },
      "children": [
        {
          "type": "Radio",
          "children": [
            { "type": "RadioLabel", "children": [{ "type": "Text", "text": "Inner Option 1" }] },
            {
              "type": "RadioRadio",
              "state": {
                "providerId": "inner-group",  // Explicit - targets inner group
                "value": "inner-opt-1"
              }
            }
          ]
        }
      ]
    }
  ]
}
\`\`\`

---

## Compound Pattern

The Radio component uses a compound pattern with three subcomponents:

- **Radio.Root**: Provides context and manages shared state (disabled, required, error, name)
- **Radio.Radio**: The actual radio input (native HTML radio)
- **Radio.Label**: Label text that connects to the radio

## Size

- **Circle size**: 14px × 14px (Figma spec)
- **Border radius**: 50% (fully rounded)
- **Focus ring**: 2px border inset by 3px

## States

- **checked**: Radio is selected
- **unchecked**: Radio is not selected
- **disabled**: Non-interactive state
- **required**: Shows asterisk indicator
- **error**: Applies error styling to label

## Colors

| State | Background | Border |
|-------|------------|--------|
| Unchecked | White | Gray (#8c8f97) |
| Checked | Blue (#0052cc) | Blue (#0052cc) |
| Error (Unchecked) | White | Red (#e2483d) |
| Error (Checked) | Red (#e2483d) | Red (#e2483d) |
| Disabled | Light Gray (rgba(23,23,23,0.03)) | None |
| Focus | White | Blue (#4688ec) - 2px ring |

## Key Rules

| Field | Location | Examples |
|-------|----------|----------|
| HTML attributes | \`attributes\` | \`className\`, \`id\`, \`style\`, \`data-*\` |
| Component state | \`state\` | \`value\`, \`disabled\`, \`error\`, \`required\` |
| SDUI-specific | \`state\` | \`providerId\` (optional), \`value\`, \`checked\` |

## Integration

- ✅ **SDUI template system** integration
- ✅ **Keyboard navigation** (Space & Enter keys)
- ✅ **Accessibility features** (role="radio", aria-checked)
- ✅ **Form integration** (name attribute for grouping)
        `,
      },
    },
  },
}

export default meta
type Story = StoryObj<typeof Radio.Root>

// ============================================================================
// Basic Stories with Controls
// ============================================================================

export const Playground: Story = {
  args: {
    disabled: false,
    required: false,
    error: false,
  },
  render: (args) => {
    const document: SduiLayoutDocument = {
      version: '1.0.0',
      root: {
        id: 'radio-root',
        type: 'Radio',
        state: {
          disabled: args.disabled,
          required: args.required,
          error: args.error,
          name: 'playground',
        },
        children: [
          {
            id: 'radio-label',
            type: 'RadioLabel',
            state: {
              text: 'Option 1',
            },
          },
          {
            id: 'radio-input',
            type: 'RadioRadio',
            state: {
              checked: false,
              value: 'option1',
            },
          },
        ],
      },
    }
    return (
      <div className="p-4">
        <SduiLayoutRenderer document={document} components={sduiComponents} />
      </div>
    )
  },
  parameters: {
    docs: {
      description: {
        story: `
## Interactive Playground

Use the controls panel to experiment with different radio configurations.

### Available Controls

- **disabled**: Enable/disable the radio
- **required**: Show required indicator (asterisk)
- **error**: Apply error styling to label
        `,
      },
    },
  },
}

// ============================================================================
// Basic States
// ============================================================================

export const Default: Story = {
  render: () => {
    const document: SduiLayoutDocument = {
      version: '1.0.0',
      root: {
        id: 'root',
        type: 'Div',
        attributes: { className: 'flex items-center gap-4 p-4' },
        children: [
          {
            id: 'radio-root',
            type: 'Radio',
            state: {
              name: 'default',
            },
            children: [
              {
                id: 'radio-label',
                type: 'RadioLabel',
                state: {
                  text: 'Option 1',
                },
              },
              {
                id: 'radio-input',
                type: 'RadioRadio',
                state: {
                  checked: false,
                  value: 'option1',
                },
              },
            ],
          },
        ],
      },
    }
    return <SduiLayoutRenderer document={document} components={sduiComponents} />
  },
  parameters: {
    docs: {
      description: {
        story: `
## Default Radio

Basic radio in unchecked state. Click to select.
        `,
      },
    },
  },
}

export const Checked: Story = {
  render: () => {
    const document: SduiLayoutDocument = {
      version: '1.0.0',
      root: {
        id: 'root',
        type: 'Div',
        attributes: { className: 'flex items-center gap-4 p-4' },
        children: [
          {
            id: 'radio-root',
            type: 'Radio',
            state: {
              name: 'checked',
            },
            children: [
              {
                id: 'radio-label',
                type: 'RadioLabel',
                state: {
                  text: 'Option 1',
                },
              },
              {
                id: 'radio-input',
                type: 'RadioRadio',
                state: {
                  checked: true,
                  value: 'option1',
                },
              },
            ],
          },
        ],
      },
    }
    return <SduiLayoutRenderer document={document} components={sduiComponents} />
  },
  parameters: {
    docs: {
      description: {
        story: `
## Checked State

Radio in checked state with inner dot visible.
        `,
      },
    },
  },
}

export const Disabled: Story = {
  render: () => {
    const document: SduiLayoutDocument = {
      version: '1.0.0',
      root: {
        id: 'root',
        type: 'Div',
        attributes: { className: 'flex flex-col gap-4 p-4' },
        children: [
          {
            id: 'radio-1',
            type: 'Radio',
            state: {
              disabled: true,
              name: 'disabled',
            },
            children: [
              {
                id: 'label-1',
                type: 'RadioLabel',
                state: {
                  text: 'Disabled unchecked',
                },
              },
              {
                id: 'input-1',
                type: 'RadioRadio',
                state: {
                  checked: false,
                  value: 'option1',
                },
              },
            ],
          },
          {
            id: 'radio-2',
            type: 'Radio',
            state: {
              disabled: true,
              name: 'disabled',
            },
            children: [
              {
                id: 'label-2',
                type: 'RadioLabel',
                state: {
                  text: 'Disabled checked',
                },
              },
              {
                id: 'input-2',
                type: 'RadioRadio',
                state: {
                  checked: true,
                  value: 'option2',
                },
              },
            ],
          },
        ],
      },
    }
    return <SduiLayoutRenderer document={document} components={sduiComponents} />
  },
  parameters: {
    docs: {
      description: {
        story: `
## Disabled State

Radios in disabled state (unchecked and checked).
Disabled radios have a light gray background and no border.
        `,
      },
    },
  },
}

export const Required: Story = {
  render: () => {
    const document: SduiLayoutDocument = {
      version: '1.0.0',
      root: {
        id: 'root',
        type: 'Div',
        attributes: { className: 'flex items-center gap-4 p-4' },
        children: [
          {
            id: 'radio-root',
            type: 'Radio',
            state: {
              required: true,
              name: 'required',
            },
            children: [
              {
                id: 'radio-label',
                type: 'RadioLabel',
                state: {
                  text: 'Select an option',
                },
              },
              {
                id: 'radio-input',
                type: 'RadioRadio',
                state: {
                  checked: false,
                  value: 'option1',
                },
              },
            ],
          },
        ],
      },
    }
    return <SduiLayoutRenderer document={document} components={sduiComponents} />
  },
  parameters: {
    docs: {
      description: {
        story: `
## Required State

Radio with required indicator (asterisk) displayed next to label.
        `,
      },
    },
  },
}

export const Error: Story = {
  render: () => {
    const document: SduiLayoutDocument = {
      version: '1.0.0',
      root: {
        id: 'root',
        type: 'Div',
        attributes: { className: 'flex flex-col gap-4 p-4' },
        children: [
          {
            id: 'radio-1',
            type: 'Radio',
            state: {
              error: true,
              name: 'error',
            },
            children: [
              {
                id: 'label-1',
                type: 'RadioLabel',
                state: {
                  text: 'Error unchecked',
                },
              },
              {
                id: 'input-1',
                type: 'RadioRadio',
                state: {
                  checked: false,
                  value: 'option1',
                },
              },
            ],
          },
          {
            id: 'radio-2',
            type: 'Radio',
            state: {
              error: true,
              name: 'error',
            },
            children: [
              {
                id: 'label-2',
                type: 'RadioLabel',
                state: {
                  text: 'Error checked',
                },
              },
              {
                id: 'input-2',
                type: 'RadioRadio',
                state: {
                  checked: true,
                  value: 'option2',
                },
              },
            ],
          },
        ],
      },
    }
    return <SduiLayoutRenderer document={document} components={sduiComponents} />
  },
  parameters: {
    docs: {
      description: {
        story: `
## Error State

Radios with error styling. When in error state:
- Unchecked: Red border, white background
- Checked: Red background and border
- Label text is also styled in red
        `,
      },
    },
  },
}

// ============================================================================
// Provider Pattern Examples (providerId)
// ============================================================================

export const ProviderIdInheritance: Story = {
  render: () => {
    const document: SduiLayoutDocument = {
      version: '1.0.0',
      root: {
        id: 'root',
        type: 'Div',
        attributes: { className: 'flex flex-col gap-6 p-4' },
        children: [
          {
            id: 'section-1',
            type: 'Div',
            attributes: { className: 'space-y-2' },
            children: [
              {
                id: 'title-1',
                type: 'Span',
                state: { text: 'Implicit providerId (inherited from context)' },
                attributes: { className: 'text-sm font-medium block mb-2' },
              },
              {
                id: 'radio-group-1',
                type: 'RadioGroup',
                state: {
                  name: 'group1',
                  value: 'option1',
                },
                children: [
                  {
                    id: 'radio-1-1',
                    type: 'Radio',
                    children: [
                      {
                        id: 'label-1-1',
                        type: 'RadioLabel',
                        state: { text: 'Option 1' },
                      },
                      {
                        id: 'input-1-1',
                        type: 'RadioRadio',
                        state: {
                          value: 'option1',
                          // No providerId - inherits from RadioGroup context
                        },
                      },
                    ],
                  },
                  {
                    id: 'radio-1-2',
                    type: 'Radio',
                    children: [
                      {
                        id: 'label-1-2',
                        type: 'RadioLabel',
                        state: { text: 'Option 2' },
                      },
                      {
                        id: 'input-1-2',
                        type: 'RadioRadio',
                        state: {
                          value: 'option2',
                          // No providerId - inherits from RadioGroup context
                        },
                      },
                    ],
                  },
                ],
              },
            ],
          },
          {
            id: 'section-2',
            type: 'Div',
            attributes: { className: 'space-y-2' },
            children: [
              {
                id: 'title-2',
                type: 'Span',
                state: { text: 'Explicit providerId' },
                attributes: { className: 'text-sm font-medium block mb-2' },
              },
              {
                id: 'radio-group-2',
                type: 'RadioGroup',
                state: {
                  name: 'group2',
                  value: 'option3',
                },
                children: [
                  {
                    id: 'radio-2-1',
                    type: 'Radio',
                    children: [
                      {
                        id: 'label-2-1',
                        type: 'RadioLabel',
                        state: { text: 'Option 3' },
                      },
                      {
                        id: 'input-2-1',
                        type: 'RadioRadio',
                        state: {
                          providerId: 'radio-group-2', // Explicit providerId
                          value: 'option3',
                        },
                      },
                    ],
                  },
                  {
                    id: 'radio-2-2',
                    type: 'Radio',
                    children: [
                      {
                        id: 'label-2-2',
                        type: 'RadioLabel',
                        state: { text: 'Option 4' },
                      },
                      {
                        id: 'input-2-2',
                        type: 'RadioRadio',
                        state: {
                          providerId: 'radio-group-2', // Explicit providerId
                          value: 'option4',
                        },
                      },
                    ],
                  },
                ],
              },
            ],
          },
        ],
      },
    }
    return <SduiLayoutRenderer document={document} components={sduiComponents} />
  },
  parameters: {
    docs: {
      description: {
        story: `
## providerId Inheritance

This example demonstrates how \`providerId\` can be inherited from context or specified explicitly.

### Implicit (Inherited)

When \`providerId\` is omitted from \`RadioRadio\` state, it automatically inherits from the nearest parent \`RadioGroup\` via React Context.

### Explicit

When \`providerId\` is specified in \`RadioRadio\` state, it explicitly targets that provider, useful for nested groups or cross-referencing.

Both approaches work identically - the explicit form is more verbose but clearer for complex scenarios.
        `,
      },
    },
  },
}

export const NestedRadioGroups: Story = {
  render: () => {
    const document: SduiLayoutDocument = {
      version: '1.0.0',
      root: {
        id: 'root',
        type: 'Div',
        attributes: { className: 'flex flex-col gap-6 p-4' },
        children: [
          {
            id: 'outer-group',
            type: 'RadioGroup',
            state: {
              name: 'outer',
              value: 'outer-1',
            },
            children: [
              {
                id: 'outer-radio-1',
                type: 'Radio',
                children: [
                  {
                    id: 'outer-label-1',
                    type: 'RadioLabel',
                    state: { text: 'Outer Option 1' },
                  },
                  {
                    id: 'outer-input-1',
                    type: 'RadioRadio',
                    state: {
                      value: 'outer-1',
                      // Inherits from outer-group
                    },
                  },
                ],
              },
              {
                id: 'outer-radio-2',
                type: 'Radio',
                children: [
                  {
                    id: 'outer-label-2',
                    type: 'RadioLabel',
                    state: { text: 'Outer Option 2' },
                  },
                  {
                    id: 'outer-input-2',
                    type: 'RadioRadio',
                    state: {
                      value: 'outer-2',
                      // Inherits from outer-group
                    },
                  },
                ],
              },
              {
                id: 'inner-group',
                type: 'RadioGroup',
                state: {
                  name: 'inner',
                  value: 'inner-1',
                },
                children: [
                  {
                    id: 'inner-radio-1',
                    type: 'Radio',
                    children: [
                      {
                        id: 'inner-label-1',
                        type: 'RadioLabel',
                        state: { text: 'Inner Option 1' },
                      },
                      {
                        id: 'inner-input-1',
                        type: 'RadioRadio',
                        state: {
                          providerId: 'inner-group', // Explicit - targets inner group
                          value: 'inner-1',
                        },
                      },
                    ],
                  },
                  {
                    id: 'inner-radio-2',
                    type: 'Radio',
                    children: [
                      {
                        id: 'inner-label-2',
                        type: 'RadioLabel',
                        state: { text: 'Inner Option 2' },
                      },
                      {
                        id: 'inner-input-2',
                        type: 'RadioRadio',
                        state: {
                          providerId: 'inner-group', // Explicit - targets inner group
                          value: 'inner-2',
                        },
                      },
                    ],
                  },
                ],
              },
            ],
          },
        ],
      },
    }
    return <SduiLayoutRenderer document={document} components={sduiComponents} />
  },
  parameters: {
    docs: {
      description: {
        story: `
## Nested Radio Groups

This example shows nested \`RadioGroup\` components. The inner group's radios use explicit \`providerId\` to target the inner group, preventing them from accidentally subscribing to the outer group.

**Key points:**
- Outer group radios inherit \`providerId\` from context (implicit)
- Inner group radios use explicit \`providerId: "inner-group"\` to target the correct provider
- Each group maintains its own independent selection state
        `,
      },
    },
  },
}

// ============================================================================
// RadioGroup Examples
// ============================================================================

export const RadioGroup: Story = {
  render: () => {
    const document: SduiLayoutDocument = {
      version: '1.0.0',
      root: {
        id: 'root',
        type: 'Div',
        attributes: { className: 'flex flex-col gap-4 p-4' },
        children: [
          {
            id: 'radio-group',
            type: 'RadioGroup',
            state: {
              name: 'options',
              value: 'option2',
            },
            children: [
              {
                id: 'radio-1',
                type: 'Radio',
                state: {},
                children: [
                  {
                    id: 'label-1',
                    type: 'RadioLabel',
                    state: {
                      text: 'Option 1',
                    },
                  },
                  {
                    id: 'input-1',
                    type: 'RadioRadio',
                    state: {
                      value: 'option1',
                    },
                  },
                ],
              },
              {
                id: 'radio-2',
                type: 'Radio',
                state: {},
                children: [
                  {
                    id: 'label-2',
                    type: 'RadioLabel',
                    state: {
                      text: 'Option 2',
                    },
                  },
                  {
                    id: 'input-2',
                    type: 'RadioRadio',
                    state: {
                      value: 'option2',
                    },
                  },
                ],
              },
              {
                id: 'radio-3',
                type: 'Radio',
                state: {},
                children: [
                  {
                    id: 'label-3',
                    type: 'RadioLabel',
                    state: {
                      text: 'Option 3',
                    },
                  },
                  {
                    id: 'input-3',
                    type: 'RadioRadio',
                    state: {
                      value: 'option3',
                    },
                  },
                ],
              },
            ],
          },
        ],
      },
    }
    return <SduiLayoutRenderer document={document} components={sduiComponents} />
  },
  parameters: {
    docs: {
      description: {
        story: `
## RadioGroup

RadioGroup manages multiple Radio buttons and ensures only one is selected at a time.
The selected value is managed by the RadioGroup component.
        `,
      },
    },
  },
}

export const RadioGroupWithError: Story = {
  render: () => {
    const document: SduiLayoutDocument = {
      version: '1.0.0',
      root: {
        id: 'root',
        type: 'Div',
        attributes: { className: 'flex flex-col gap-4 p-4' },
        children: [
          {
            id: 'radio-group',
            type: 'RadioGroup',
            state: {
              name: 'options',
              error: true,
            },
            children: [
              {
                id: 'radio-1',
                type: 'Radio',
                state: {},
                children: [
                  {
                    id: 'label-1',
                    type: 'RadioLabel',
                    state: {
                      text: 'Option 1',
                    },
                  },
                  {
                    id: 'input-1',
                    type: 'RadioRadio',
                    state: {
                      value: 'option1',
                    },
                  },
                ],
              },
              {
                id: 'radio-2',
                type: 'Radio',
                state: {},
                children: [
                  {
                    id: 'label-2',
                    type: 'RadioLabel',
                    state: {
                      text: 'Option 2',
                    },
                  },
                  {
                    id: 'input-2',
                    type: 'RadioRadio',
                    state: {
                      value: 'option2',
                    },
                  },
                ],
              },
            ],
          },
        ],
      },
    }
    return <SduiLayoutRenderer document={document} components={sduiComponents} />
  },
  parameters: {
    docs: {
      description: {
        story: `
## RadioGroup with Error

RadioGroup with error state applied to all child radios.
        `,
      },
    },
  },
}

// ============================================================================
// SDUI Integration
// ============================================================================

export const SduiIntegration: Story = {
  render: () => {
    const document: SduiLayoutDocument = {
      version: '1.0.0',
      root: {
        id: 'radio-root',
        type: 'Radio',
        state: {
          disabled: false,
          required: true,
          error: false,
          name: 'sdui-radio',
        },
        children: [
          {
            id: 'radio-label',
            type: 'RadioLabel',
            state: {
              text: 'Select this option',
            },
          },
          {
            id: 'radio-input',
            type: 'RadioRadio',
            state: {
              checked: false,
              value: 'option1',
            },
          },
        ],
      },
    }
    return (
      <div className="p-4">
        <SduiLayoutRenderer document={document} components={sduiComponents} />
      </div>
    )
  },
  parameters: {
    docs: {
      description: {
        story: `
## SDUI Integration

Radio rendered from SDUI document. The document defines the structure and state, and the SDUI renderer creates the component tree.

### SDUI Document Structure

\`\`\`json
{
  "id": "radio-root",
  "type": "Radio",
  "state": {
    "disabled": false,
    "required": true,
    "error": false,
    "name": "sdui-radio"
  },
  "children": [
    {
      "id": "radio-label",
      "type": "RadioLabel",
      "state": { "text": "Select this option" }
    },
    {
      "id": "radio-input",
      "type": "RadioRadio",
      "state": { "checked": false, "value": "option1" }
    }
  ]
}
\`\`\`
        `,
      },
    },
  },
}
