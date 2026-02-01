import {
  type ComponentFactory,
  type SduiLayoutDocument,
  SduiLayoutRenderer,
  useSduiNodeReference,
  useSduiNodeSubscription,
} from '@lodado/sdui-template'
import { DropdownMenu, sduiComponents } from '@lodado/sdui-template-component'
import type { Meta, StoryObj } from '@storybook/react-vite'
import React, { useState } from 'react'

// ============================================================================
// Custom Reference Components for Storybook Examples
// ============================================================================

/**
 * ReferenceText - Displays text from a referenced node's state
 *
 * Uses `useSduiNodeReference` to subscribe to referenced node's state changes.
 * Displays the `selectedId` or `selectedIds` from the referenced dropdown.
 */
const ReferenceText: React.FC<{ id: string }> = ({ id }) => {
  const { attributes } = useSduiNodeSubscription({ nodeId: id })
  const { referencedNodes, hasReference } = useSduiNodeReference({ nodeId: id })

  const className = attributes?.className as string | undefined
  const prefix = attributes?.prefix as string | undefined
  const suffix = attributes?.suffix as string | undefined
  const optionsAttr = attributes?.options as Array<{ id: string; label: string }> | undefined

  if (!hasReference || referencedNodes.length === 0) {
    return (
      <span className={className} data-node-id={id}>
        No reference
      </span>
    )
  }

  const refNode = referencedNodes[0]
  const selectedId = refNode?.state?.selectedId as string | undefined
  const selectedIds = refNode?.state?.selectedIds as string[] | undefined

  // Try to get label from options
  let displayText = ''
  if (selectedIds && selectedIds.length > 0) {
    if (optionsAttr) {
      displayText = selectedIds
        .map((sid) => optionsAttr.find((opt) => opt.id === sid)?.label || sid)
        .join(', ')
    } else {
      displayText = selectedIds.join(', ')
    }
  } else if (selectedId) {
    if (optionsAttr) {
      displayText = optionsAttr.find((opt) => opt.id === selectedId)?.label || selectedId
    } else {
      displayText = selectedId
    }
  } else {
    displayText = 'None'
  }

  return (
    <span className={className} data-node-id={id}>
      {prefix}
      {displayText}
      {suffix}
    </span>
  )
}

ReferenceText.displayName = 'ReferenceText'

/**
 * ReferenceDisplay - Displays detailed info about multiple referenced nodes
 */
const ReferenceDisplay: React.FC<{ id: string }> = ({ id }) => {
  const { attributes } = useSduiNodeSubscription({ nodeId: id })
  const { referencedNodes, hasReference } = useSduiNodeReference({ nodeId: id })

  const className = attributes?.className as string | undefined
  const optionsMap = attributes?.optionsMap as Record<string, Array<{ id: string; label: string }>> | undefined

  if (!hasReference) {
    return (
      <div className={className} data-node-id={id}>
        No references configured
      </div>
    )
  }

  return (
    <div className={className} data-node-id={id}>
      {referencedNodes.map((refNode, index) => {
        const selectedId = refNode?.state?.selectedId as string | undefined
        const options = optionsMap?.[refNode.id]
        const label = options?.find((opt) => opt.id === selectedId)?.label || selectedId || 'None'

        return (
          <div key={refNode.id || index}>
            <span className="text-gray-500">{refNode.id}:</span>{' '}
            <span className="font-medium">{label}</span>
          </div>
        )
      })}
    </div>
  )
}

ReferenceDisplay.displayName = 'ReferenceDisplay'

// Extended sduiComponents with custom reference components
const extendedSduiComponents: Record<string, ComponentFactory> = {
  ...sduiComponents,
  ReferenceText: (id) => <ReferenceText id={id} />,
  ReferenceDisplay: (id) => <ReferenceDisplay id={id} />,
}

const meta: Meta<typeof DropdownMenu> = {
  title: 'Shared/UI/Dropdown',
  component: DropdownMenu,
  tags: ['autodocs'],
  argTypes: {
    appearance: {
      control: 'select',
      options: ['default', 'primary', 'subtle'],
      description: 'Trigger button appearance',
      table: {
        defaultValue: { summary: 'default' },
      },
    },
    spacing: {
      control: 'select',
      options: ['default', 'compact', 'cozy'],
      description: 'Dropdown spacing/size',
      table: {
        defaultValue: { summary: 'default' },
      },
    },
    placement: {
      control: 'select',
      options: ['bottom-start', 'bottom-end', 'bottom', 'top-start', 'top-end', 'top', 'left', 'right'],
      description: 'Menu placement relative to trigger',
      table: {
        defaultValue: { summary: 'bottom-start' },
      },
    },
    isDisabled: {
      control: 'boolean',
      description: 'Whether the dropdown is disabled',
      table: {
        defaultValue: { summary: 'false' },
      },
    },
    isMultiSelect: {
      control: 'boolean',
      description: 'Enable multi-selection with checkboxes',
      table: {
        defaultValue: { summary: 'false' },
      },
    },
    triggerLabel: {
      control: 'text',
      description: 'Label displayed on trigger button',
    },
  },
  parameters: {
    docs: {
      description: {
        component: `
## Overview

The **DropdownMenu** component follows the Atlassian Design System (ADS) specifications. It provides a menu of options triggered by a button.

## Appearance Variants

| Appearance | Description | Use Case |
|------------|-------------|----------|
| \`default\` | Neutral button with border | Standard dropdowns |
| \`primary\` | Brand blue filled button | Primary actions |
| \`subtle\` | Transparent button, no border | Inline/compact use |

## Spacing Options

| Spacing | Trigger Height | Description |
|---------|----------------|-------------|
| \`default\` | 32px | Standard size |
| \`compact\` | 24px | Compact/dense UIs |
| \`cozy\` | 32px | Alias for default |

## Selection Modes

- **Single Select**: One option at a time (default)
- **Multi Select**: Multiple options with checkboxes

## Features

- Keyboard navigation (Arrow keys, Enter, Escape)
- Focus management
- ARIA attributes for accessibility
- SDUI template integration
        `,
      },
    },
  },
}

export default meta
type Story = StoryObj<typeof DropdownMenu>

// Sample options
const sampleOptions = [
  { id: '1', label: 'Option 1' },
  { id: '2', label: 'Option 2' },
  { id: '3', label: 'Option 3' },
  { id: '4', label: 'Option 4' },
]

const statusOptions = [
  { id: 'open', label: 'Open' },
  { id: 'in-progress', label: 'In Progress' },
  { id: 'review', label: 'In Review' },
  { id: 'done', label: 'Done' },
  { id: 'closed', label: 'Closed' },
]

const priorityOptions = [
  { id: 'highest', label: 'Highest' },
  { id: 'high', label: 'High' },
  { id: 'medium', label: 'Medium' },
  { id: 'low', label: 'Low' },
  { id: 'lowest', label: 'Lowest' },
]

// ============================================================================
// Playground
// ============================================================================

export const Playground: Story = {
  args: {
    triggerLabel: 'Select option',
    appearance: 'default',
    spacing: 'default',
    placement: 'bottom-start',
    isDisabled: false,
    isMultiSelect: false,
    options: sampleOptions,
  },
  render: (args) => {
    const [selectedId, setSelectedId] = useState<string | undefined>()
    const [selectedIds, setSelectedIds] = useState<string[]>([])

    return (
      <DropdownMenu
        {...args}
        selectedId={selectedId}
        selectedIds={selectedIds}
        onSelect={setSelectedId}
        onSelectionChange={setSelectedIds}
      />
    )
  },
  parameters: {
    docs: {
      description: {
        story: `
## Interactive Playground

Use the controls panel to experiment with different dropdown configurations.

### Available Controls

- **appearance**: default, primary, subtle
- **spacing**: default, compact, cozy
- **placement**: bottom-start, bottom-end, top-start, etc.
- **isDisabled**: Enable/disable the dropdown
- **isMultiSelect**: Enable checkbox multi-selection
- **triggerLabel**: Customize trigger button text
        `,
      },
    },
  },
}

// ============================================================================
// Appearance Variants
// ============================================================================

export const AppearanceDefault: Story = {
  render: () => {
    const document: SduiLayoutDocument = {
      version: '1.0.0',
      root: {
        id: 'dropdown-default',
        type: 'Dropdown',
        attributes: {
          triggerLabel: 'Default',
          appearance: 'default',
          options: sampleOptions,
        },
        state: { selectedId: '1' },
      },
    }
    return <SduiLayoutRenderer document={document} components={sduiComponents} />
  },
  parameters: {
    docs: {
      description: {
        story: `
## Default Appearance

Neutral button with border. Standard dropdown trigger style.

### Characteristics
- Transparent background with border
- Uses \`--color-border-default\` for border
- \`--color-text-default\` for text color
        `,
      },
    },
  },
}

export const AppearancePrimary: Story = {
  render: () => {
    const document: SduiLayoutDocument = {
      version: '1.0.0',
      root: {
        id: 'dropdown-primary',
        type: 'Dropdown',
        attributes: {
          triggerLabel: 'Primary',
          appearance: 'primary',
          options: sampleOptions,
        },
        state: { selectedId: '1' },
      },
    }
    return <SduiLayoutRenderer document={document} components={sduiComponents} />
  },
  parameters: {
    docs: {
      description: {
        story: `
## Primary Appearance

Brand blue filled button trigger. Use when dropdown is a primary action.

### Characteristics
- Solid brand blue background
- White text for contrast
- Higher visual emphasis
        `,
      },
    },
  },
}

export const AppearanceSubtle: Story = {
  render: () => {
    const document: SduiLayoutDocument = {
      version: '1.0.0',
      root: {
        id: 'dropdown-subtle',
        type: 'Dropdown',
        attributes: {
          triggerLabel: 'Subtle',
          appearance: 'subtle',
          options: sampleOptions,
        },
        state: { selectedId: '1' },
      },
    }
    return <SduiLayoutRenderer document={document} components={sduiComponents} />
  },
  parameters: {
    docs: {
      description: {
        story: `
## Subtle Appearance

Transparent button without border. Minimal visual footprint.

### Characteristics
- Transparent background, no border
- Subtle text color
- Use for inline/compact scenarios
        `,
      },
    },
  },
}

export const AllAppearances: Story = {
  render: () => {
    const document: SduiLayoutDocument = {
      version: '1.0.0',
      root: {
        id: 'root',
        type: 'Div',
        attributes: { className: 'flex items-center gap-4' },
        children: [
          {
            id: 'dropdown-1',
            type: 'Dropdown',
            attributes: {
              triggerLabel: 'Default',
              appearance: 'default',
              options: sampleOptions,
            },
            state: { selectedId: '1' },
          },
          {
            id: 'dropdown-2',
            type: 'Dropdown',
            attributes: {
              triggerLabel: 'Primary',
              appearance: 'primary',
              options: sampleOptions,
            },
            state: { selectedId: '2' },
          },
          {
            id: 'dropdown-3',
            type: 'Dropdown',
            attributes: {
              triggerLabel: 'Subtle',
              appearance: 'subtle',
              options: sampleOptions,
            },
            state: { selectedId: '3' },
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
## All Appearances Comparison

Side-by-side comparison of all appearance variants.
        `,
      },
    },
  },
}

// ============================================================================
// Spacing Variants
// ============================================================================

export const SpacingDefault: Story = {
  render: () => {
    const document: SduiLayoutDocument = {
      version: '1.0.0',
      root: {
        id: 'dropdown-spacing-default',
        type: 'Dropdown',
        attributes: {
          triggerLabel: 'Default Spacing (32px)',
          spacing: 'default',
          options: sampleOptions,
        },
      },
    }
    return <SduiLayoutRenderer document={document} components={sduiComponents} />
  },
  parameters: {
    docs: {
      description: {
        story: `
## Default Spacing

Standard trigger height (32px). Suitable for most use cases.
        `,
      },
    },
  },
}

export const SpacingCompact: Story = {
  render: () => {
    const document: SduiLayoutDocument = {
      version: '1.0.0',
      root: {
        id: 'dropdown-spacing-compact',
        type: 'Dropdown',
        attributes: {
          triggerLabel: 'Compact Spacing (24px)',
          spacing: 'compact',
          options: sampleOptions,
        },
      },
    }
    return <SduiLayoutRenderer document={document} components={sduiComponents} />
  },
  parameters: {
    docs: {
      description: {
        story: `
## Compact Spacing

Smaller trigger height (24px). Use in dense UIs or tables.
        `,
      },
    },
  },
}

export const AllSpacings: Story = {
  render: () => {
    const document: SduiLayoutDocument = {
      version: '1.0.0',
      root: {
        id: 'root',
        type: 'Div',
        attributes: { className: 'flex items-center gap-4' },
        children: [
          {
            id: 'dropdown-default-spacing',
            type: 'Dropdown',
            attributes: {
              triggerLabel: 'Default',
              spacing: 'default',
              options: sampleOptions,
            },
          },
          {
            id: 'dropdown-compact-spacing',
            type: 'Dropdown',
            attributes: {
              triggerLabel: 'Compact',
              spacing: 'compact',
              options: sampleOptions,
            },
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
## All Spacings Comparison

Side-by-side comparison of spacing variants.
        `,
      },
    },
  },
}

// ============================================================================
// Selection Modes
// ============================================================================

export const SingleSelect: Story = {
  render: () => {
    const SingleSelectExample = () => {
      const [selectedId, setSelectedId] = useState<string>('open')

      return (
        <div className="space-y-2">
          <p className="text-sm text-gray-600">Selected: {selectedId || 'None'}</p>
          <DropdownMenu
            triggerLabel="Select Status"
            options={statusOptions}
            selectedId={selectedId}
            onSelect={setSelectedId}
          />
        </div>
      )
    }

    return <SingleSelectExample />
  },
  parameters: {
    docs: {
      description: {
        story: `
## Single Select Mode

Default selection mode. Only one option can be selected at a time.

- Selected option shows a checkmark
- Clicking an option selects it and closes the menu
        `,
      },
    },
  },
}

export const MultiSelect: Story = {
  render: () => {
    const MultiSelectExample = () => {
      const [selectedIds, setSelectedIds] = useState<string[]>(['high', 'medium'])

      return (
        <div className="space-y-2">
          <p className="text-sm text-gray-600">Selected: {selectedIds.join(', ') || 'None'}</p>
          <DropdownMenu
            triggerLabel="Select Priorities"
            options={priorityOptions}
            isMultiSelect
            selectedIds={selectedIds}
            onSelectionChange={setSelectedIds}
          />
        </div>
      )
    }

    return <MultiSelectExample />
  },
  parameters: {
    docs: {
      description: {
        story: `
## Multi Select Mode

Enable \`isMultiSelect\` for checkbox-based multi-selection.

- Each option has a checkbox
- Multiple options can be selected
- Menu stays open for additional selections
        `,
      },
    },
  },
}

export const SingleSelectSdui: Story = {
  render: () => {
    const document: SduiLayoutDocument = {
      version: '1.0.0',
      root: {
        id: 'dropdown-single',
        type: 'Dropdown',
        attributes: {
          triggerLabel: 'Select Status',
          options: statusOptions,
        },
        state: { selectedId: 'in-progress' },
      },
    }
    return <SduiLayoutRenderer document={document} components={sduiComponents} />
  },
  parameters: {
    docs: {
      description: {
        story: `
## Single Select (SDUI)

SDUI document example for single selection dropdown.
        `,
      },
    },
  },
}

export const MultiSelectSdui: Story = {
  render: () => {
    const document: SduiLayoutDocument = {
      version: '1.0.0',
      root: {
        id: 'dropdown-multi',
        type: 'Dropdown',
        attributes: {
          triggerLabel: 'Select Priorities',
          isMultiSelect: true,
          options: priorityOptions,
        },
        state: { selectedIds: ['high', 'medium'] },
      },
    }
    return <SduiLayoutRenderer document={document} components={sduiComponents} />
  },
  parameters: {
    docs: {
      description: {
        story: `
## Multi Select (SDUI)

SDUI document example for multi-selection dropdown with checkboxes.
        `,
      },
    },
  },
}

// ============================================================================
// Disabled States
// ============================================================================

export const Disabled: Story = {
  render: () => {
    const document: SduiLayoutDocument = {
      version: '1.0.0',
      root: {
        id: 'root',
        type: 'Div',
        attributes: { className: 'flex items-center gap-4' },
        children: [
          {
            id: 'dropdown-enabled',
            type: 'Dropdown',
            attributes: {
              triggerLabel: 'Enabled',
              options: sampleOptions,
            },
          },
          {
            id: 'dropdown-disabled',
            type: 'Dropdown',
            attributes: {
              triggerLabel: 'Disabled',
              isDisabled: true,
              options: sampleOptions,
            },
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

Comparison of enabled and disabled dropdown triggers.
        `,
      },
    },
  },
}

export const WithDisabledOptions: Story = {
  render: () => {
    const optionsWithDisabled = [
      { id: '1', label: 'Available Option 1' },
      { id: '2', label: 'Disabled Option', disabled: true },
      { id: '3', label: 'Available Option 2' },
      { id: '4', label: 'Another Disabled', disabled: true },
      { id: '5', label: 'Available Option 3' },
    ]

    const document: SduiLayoutDocument = {
      version: '1.0.0',
      root: {
        id: 'dropdown-disabled-options',
        type: 'Dropdown',
        attributes: {
          triggerLabel: 'Options with Disabled',
          options: optionsWithDisabled,
        },
      },
    }
    return <SduiLayoutRenderer document={document} components={sduiComponents} />
  },
  parameters: {
    docs: {
      description: {
        story: `
## Options with Disabled Items

Individual options can be disabled while keeping the dropdown functional.
        `,
      },
    },
  },
}

// ============================================================================
// Placement Variants
// ============================================================================

export const PlacementExamples: Story = {
  render: () => (
    <div className="flex flex-wrap gap-4 p-8">
      <DropdownMenu
        triggerLabel="Bottom Start"
        placement="bottom-start"
        options={sampleOptions}
      />
      <DropdownMenu
        triggerLabel="Bottom End"
        placement="bottom-end"
        options={sampleOptions}
      />
      <DropdownMenu
        triggerLabel="Top Start"
        placement="top-start"
        options={sampleOptions}
      />
      <DropdownMenu
        triggerLabel="Top End"
        placement="top-end"
        options={sampleOptions}
      />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: `
## Placement Options

Control where the menu appears relative to the trigger button.

- \`bottom-start\`: Below trigger, aligned to start (default)
- \`bottom-end\`: Below trigger, aligned to end
- \`top-start\`: Above trigger, aligned to start
- \`top-end\`: Above trigger, aligned to end
        `,
      },
    },
  },
}

// ============================================================================
// Practical Examples
// ============================================================================

export const StatusSelector: Story = {
  render: () => {
    const document: SduiLayoutDocument = {
      version: '1.0.0',
      root: {
        id: 'root',
        type: 'Div',
        attributes: { className: 'p-4 border rounded-lg max-w-md' },
        children: [
          {
            id: 'header',
            type: 'Div',
            attributes: { className: 'flex justify-between items-center mb-4' },
            children: [
              {
                id: 'title',
                type: 'Span',
                state: { text: 'Task: Implement feature' },
                attributes: { className: 'font-medium' },
              },
              {
                id: 'status-dropdown',
                type: 'Dropdown',
                attributes: {
                  triggerLabel: 'In Progress',
                  appearance: 'subtle',
                  spacing: 'compact',
                  options: statusOptions,
                },
                state: { selectedId: 'in-progress' },
              },
            ],
          },
          {
            id: 'description',
            type: 'Span',
            state: { text: 'Implement the new authentication feature with OAuth support.' },
            attributes: { className: 'text-sm text-gray-600' },
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
## Status Selector

A practical example showing a task card with a status selector dropdown.
        `,
      },
    },
  },
}

export const FilterDropdowns: Story = {
  render: () => {
    const document: SduiLayoutDocument = {
      version: '1.0.0',
      root: {
        id: 'root',
        type: 'Div',
        attributes: { className: 'flex items-center gap-2 p-4 bg-gray-50 rounded-lg' },
        children: [
          {
            id: 'label',
            type: 'Span',
            state: { text: 'Filter by:' },
            attributes: { className: 'text-sm text-gray-600' },
          },
          {
            id: 'status-filter',
            type: 'Dropdown',
            attributes: {
              triggerLabel: 'Status',
              spacing: 'compact',
              isMultiSelect: true,
              options: statusOptions,
            },
            state: { selectedIds: ['open', 'in-progress'] },
          },
          {
            id: 'priority-filter',
            type: 'Dropdown',
            attributes: {
              triggerLabel: 'Priority',
              spacing: 'compact',
              isMultiSelect: true,
              options: priorityOptions,
            },
            state: { selectedIds: ['high'] },
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
## Filter Dropdowns

Multiple dropdowns used as filters. Uses compact spacing and multi-select mode.
        `,
      },
    },
  },
}

export const FormFieldDropdown: Story = {
  render: () => {
    const document: SduiLayoutDocument = {
      version: '1.0.0',
      root: {
        id: 'root',
        type: 'Div',
        attributes: { className: 'space-y-4 max-w-sm' },
        children: [
          {
            id: 'field-wrapper',
            type: 'Div',
            attributes: { className: 'space-y-1' },
            children: [
              {
                id: 'label',
                type: 'Span',
                state: { text: 'Priority' },
                attributes: { className: 'text-sm font-medium' },
              },
              {
                id: 'priority-dropdown',
                type: 'Dropdown',
                attributes: {
                  triggerLabel: 'Select priority',
                  options: priorityOptions,
                },
                state: { selectedId: 'medium' },
              },
              {
                id: 'help-text',
                type: 'Span',
                state: { text: 'Set the priority level for this task.' },
                attributes: { className: 'text-xs text-gray-500' },
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
## Form Field Dropdown

Dropdown used as a form field with label and help text.
        `,
      },
    },
  },
}

// ============================================================================
// Reference Examples (SDUI)
// ============================================================================

export const WithReferenceSdui: Story = {
  render: () => {
    const document: SduiLayoutDocument = {
      version: '1.0.0',
      root: {
        id: 'root',
        type: 'Div',
        attributes: { className: 'space-y-4 p-4 border rounded-lg max-w-md' },
        children: [
          {
            id: 'title',
            type: 'Span',
            state: { text: 'Reference Example (SDUI)' },
            attributes: { className: 'font-medium block' },
          },
          {
            id: 'desc',
            type: 'Span',
            state: { text: 'The dropdown selection updates the display below in real-time via SDUI reference.' },
            attributes: { className: 'text-sm text-gray-600 block' },
          },
          {
            id: 'content',
            type: 'Div',
            attributes: { className: 'flex items-center gap-4' },
            children: [
              {
                id: 'priority-dropdown',
                type: 'Dropdown',
                attributes: {
                  triggerLabel: 'Select Priority',
                  options: priorityOptions,
                },
                state: { selectedId: 'medium' },
              },
              {
                id: 'display-box',
                type: 'Div',
                attributes: { className: 'flex items-center gap-2 px-3 py-2 bg-gray-100 rounded' },
                children: [
                  {
                    id: 'label',
                    type: 'Span',
                    state: { text: 'Selected:' },
                    attributes: { className: 'text-sm text-gray-500' },
                  },
                  {
                    id: 'value',
                    type: 'ReferenceText',
                    reference: 'priority-dropdown',
                    attributes: {
                      className: 'font-medium',
                      options: priorityOptions,
                    },
                  },
                ],
              },
            ],
          },
          {
            id: 'info-box',
            type: 'Div',
            attributes: { className: 'mt-4 p-3 bg-blue-50 rounded text-sm' },
            children: [
              {
                id: 'info-text',
                type: 'Span',
                state: { text: 'ReferenceText component uses useSduiNodeReference hook to subscribe to dropdown state changes.' },
                attributes: { className: 'text-blue-800' },
              },
            ],
          },
        ],
      },
    }
    return <SduiLayoutRenderer document={document} components={extendedSduiComponents} />
  },
  parameters: {
    docs: {
      description: {
        story: `
## Reference Pattern (SDUI)

This example uses a custom \`ReferenceText\` component that:
1. Has \`reference: 'priority-dropdown'\` to link to the dropdown
2. Uses \`useSduiNodeReference\` hook to subscribe to referenced node's state
3. Automatically re-renders when dropdown selection changes

### Custom Component Implementation
\`\`\`tsx
const ReferenceText = ({ id }) => {
  const { referencedNodes } = useSduiNodeReference({ nodeId: id })
  const selectedId = referencedNodes[0]?.state?.selectedId
  return <span>{selectedId}</span>
}
\`\`\`
        `,
      },
    },
  },
}

export const DynamicTriggerLabelSdui: Story = {
  render: () => {
    const document: SduiLayoutDocument = {
      version: '1.0.0',
      root: {
        id: 'root',
        type: 'Div',
        attributes: { className: 'space-y-4 p-4 border rounded-lg max-w-md' },
        children: [
          {
            id: 'title',
            type: 'Span',
            state: { text: 'Dynamic Trigger Label (SDUI)' },
            attributes: { className: 'font-medium block' },
          },
          {
            id: 'desc',
            type: 'Span',
            state: { text: 'Select a status and see the value update below via reference.' },
            attributes: { className: 'text-sm text-gray-600 block' },
          },
          {
            id: 'status-dropdown',
            type: 'Dropdown',
            attributes: {
              triggerLabel: 'Select status...',
              options: statusOptions,
            },
            state: { selectedId: undefined },
          },
          {
            id: 'result-box',
            type: 'Div',
            attributes: { className: 'p-3 bg-gray-50 rounded text-sm' },
            children: [
              {
                id: 'result-label',
                type: 'Span',
                state: { text: 'You selected: ' },
                attributes: { className: 'text-gray-600' },
              },
              {
                id: 'result-value',
                type: 'ReferenceText',
                reference: 'status-dropdown',
                attributes: {
                  className: 'font-semibold text-gray-900',
                  options: statusOptions,
                },
              },
            ],
          },
        ],
      },
    }
    return <SduiLayoutRenderer document={document} components={extendedSduiComponents} />
  },
  parameters: {
    docs: {
      description: {
        story: `
## Dynamic Trigger Label (SDUI)

The \`ReferenceText\` component subscribes to the dropdown's state and displays the selected label.

- Initial state: \`selectedId: undefined\` → displays "None"
- After selection: displays the selected option's label
        `,
      },
    },
  },
}

export const CascadingDropdownsSdui: Story = {
  render: () => {
    const categoryOptions = [
      { id: 'frontend', label: 'Frontend' },
      { id: 'backend', label: 'Backend' },
      { id: 'devops', label: 'DevOps' },
    ]

    const frontendOptions = [
      { id: 'react', label: 'React' },
      { id: 'vue', label: 'Vue' },
      { id: 'angular', label: 'Angular' },
    ]

    const document: SduiLayoutDocument = {
      version: '1.0.0',
      root: {
        id: 'root',
        type: 'Div',
        attributes: { className: 'space-y-4 p-4 border rounded-lg max-w-lg' },
        children: [
          {
            id: 'title',
            type: 'Span',
            state: { text: 'Cascading Dropdowns (SDUI)' },
            attributes: { className: 'font-medium block' },
          },
          {
            id: 'desc',
            type: 'Span',
            state: { text: 'Two dropdowns - select both and see the summary update via reference.' },
            attributes: { className: 'text-sm text-gray-600 block' },
          },
          {
            id: 'dropdowns-row',
            type: 'Div',
            attributes: { className: 'flex items-start gap-4' },
            children: [
              {
                id: 'category-field',
                type: 'Div',
                attributes: { className: 'space-y-1' },
                children: [
                  {
                    id: 'category-label',
                    type: 'Span',
                    state: { text: 'Category' },
                    attributes: { className: 'text-xs text-gray-500 block' },
                  },
                  {
                    id: 'category-dropdown',
                    type: 'Dropdown',
                    attributes: {
                      triggerLabel: 'Select category',
                      options: categoryOptions,
                    },
                    state: { selectedId: 'frontend' },
                  },
                ],
              },
              {
                id: 'tech-field',
                type: 'Div',
                attributes: { className: 'space-y-1' },
                children: [
                  {
                    id: 'tech-label',
                    type: 'Span',
                    state: { text: 'Technology' },
                    attributes: { className: 'text-xs text-gray-500 block' },
                  },
                  {
                    id: 'tech-dropdown',
                    type: 'Dropdown',
                    attributes: {
                      triggerLabel: 'Select technology',
                      options: frontendOptions,
                    },
                    state: { selectedId: 'react' },
                  },
                ],
              },
            ],
          },
          {
            id: 'summary-box',
            type: 'Div',
            attributes: { className: 'mt-4 p-3 bg-gray-50 rounded text-sm' },
            children: [
              {
                id: 'summary-label',
                type: 'Span',
                state: { text: 'Selection: ' },
                attributes: { className: 'text-gray-500' },
              },
              {
                id: 'category-value',
                type: 'ReferenceText',
                reference: 'category-dropdown',
                attributes: {
                  className: 'font-medium',
                  options: categoryOptions,
                },
              },
              {
                id: 'arrow',
                type: 'Span',
                state: { text: ' → ' },
                attributes: { className: 'text-gray-400' },
              },
              {
                id: 'tech-value',
                type: 'ReferenceText',
                reference: 'tech-dropdown',
                attributes: {
                  className: 'font-medium',
                  options: frontendOptions,
                },
              },
            ],
          },
        ],
      },
    }
    return <SduiLayoutRenderer document={document} components={extendedSduiComponents} />
  },
  parameters: {
    docs: {
      description: {
        story: `
## Cascading Dropdowns (SDUI)

Both dropdowns' selections are displayed in the summary using \`ReferenceText\` components.

Each \`ReferenceText\` has its own \`reference\` to the respective dropdown:
- \`category-value\` references \`category-dropdown\`
- \`tech-value\` references \`tech-dropdown\`
        `,
      },
    },
  },
}

export const SyncedDropdownsSdui: Story = {
  render: () => {
    const document: SduiLayoutDocument = {
      version: '1.0.0',
      root: {
        id: 'root',
        type: 'Div',
        attributes: { className: 'space-y-4 p-4 border rounded-lg max-w-lg' },
        children: [
          {
            id: 'title',
            type: 'Span',
            state: { text: 'Multi-Select with Reference (SDUI)' },
            attributes: { className: 'font-medium block' },
          },
          {
            id: 'desc',
            type: 'Span',
            state: { text: 'Select multiple priorities and see the selection displayed below via ReferenceText.' },
            attributes: { className: 'text-sm text-gray-600 block' },
          },
          {
            id: 'dropdown-field',
            type: 'Div',
            attributes: { className: 'space-y-1' },
            children: [
              {
                id: 'dropdown-label',
                type: 'Span',
                state: { text: 'Priority Filter' },
                attributes: { className: 'text-xs text-gray-500 block' },
              },
              {
                id: 'priority-dropdown',
                type: 'Dropdown',
                attributes: {
                  triggerLabel: 'Select priorities',
                  appearance: 'primary',
                  isMultiSelect: true,
                  options: priorityOptions,
                },
                state: { selectedIds: ['high', 'medium'] },
              },
            ],
          },
          {
            id: 'result-box',
            type: 'Div',
            attributes: { className: 'mt-4 p-3 bg-green-50 rounded text-sm' },
            children: [
              {
                id: 'result-label',
                type: 'Span',
                state: { text: 'Selected priorities: ' },
                attributes: { className: 'text-green-700' },
              },
              {
                id: 'result-value',
                type: 'ReferenceText',
                reference: 'priority-dropdown',
                attributes: {
                  className: 'font-semibold text-green-800',
                  options: priorityOptions,
                },
              },
            ],
          },
        ],
      },
    }
    return <SduiLayoutRenderer document={document} components={extendedSduiComponents} />
  },
  parameters: {
    docs: {
      description: {
        story: `
## Multi-Select with Reference (SDUI)

The \`ReferenceText\` component also supports multi-select dropdowns.

When \`selectedIds\` is an array, it displays all selected labels joined by commas.
        `,
      },
    },
  },
}

export const MultipleReferencesSdui: Story = {
  render: () => {
    const document: SduiLayoutDocument = {
      version: '1.0.0',
      root: {
        id: 'root',
        type: 'Div',
        attributes: { className: 'space-y-4 p-4 border rounded-lg max-w-lg' },
        children: [
          {
            id: 'title',
            type: 'Span',
            state: { text: 'Multiple References (SDUI)' },
            attributes: { className: 'font-medium block' },
          },
          {
            id: 'desc',
            type: 'Span',
            state: { text: 'A single node can reference multiple dropdowns using an array of IDs.' },
            attributes: { className: 'text-sm text-gray-600 block' },
          },
          {
            id: 'dropdowns-row',
            type: 'Div',
            attributes: { className: 'flex items-center gap-4' },
            children: [
              {
                id: 'status-dropdown',
                type: 'Dropdown',
                attributes: {
                  triggerLabel: 'Status',
                  spacing: 'compact',
                  options: statusOptions,
                },
                state: { selectedId: 'in-progress' },
              },
              {
                id: 'priority-dropdown',
                type: 'Dropdown',
                attributes: {
                  triggerLabel: 'Priority',
                  spacing: 'compact',
                  options: priorityOptions,
                },
                state: { selectedId: 'high' },
              },
            ],
          },
          {
            id: 'summary-box',
            type: 'Div',
            attributes: { className: 'mt-4 p-3 bg-yellow-50 rounded border border-yellow-200' },
            children: [
              {
                id: 'summary-title',
                type: 'Span',
                state: { text: 'Summary (ReferenceDisplay with multiple refs)' },
                attributes: { className: 'text-sm font-medium text-yellow-800 block mb-2' },
              },
              {
                id: 'summary-display',
                type: 'ReferenceDisplay',
                reference: ['status-dropdown', 'priority-dropdown'],
                attributes: {
                  className: 'text-sm text-yellow-700 space-y-1',
                  optionsMap: {
                    'status-dropdown': statusOptions,
                    'priority-dropdown': priorityOptions,
                  },
                },
              },
            ],
          },
          {
            id: 'code-box',
            type: 'Div',
            attributes: { className: 'mt-4 p-3 bg-gray-800 rounded text-sm' },
            children: [
              {
                id: 'code-text',
                type: 'Span',
                state: { text: 'reference: ["status-dropdown", "priority-dropdown"]' },
                attributes: { className: 'text-green-400 font-mono' },
              },
            ],
          },
        ],
      },
    }
    return <SduiLayoutRenderer document={document} components={extendedSduiComponents} />
  },
  parameters: {
    docs: {
      description: {
        story: `
## Multiple References (SDUI)

The \`ReferenceDisplay\` component demonstrates multiple references:

\`\`\`json
{
  "id": "summary-display",
  "type": "ReferenceDisplay",
  "reference": ["status-dropdown", "priority-dropdown"],
  "attributes": {
    "optionsMap": {
      "status-dropdown": [...],
      "priority-dropdown": [...]
    }
  }
}
\`\`\`

### ReferenceDisplay Implementation

\`\`\`tsx
const { referencedNodes } = useSduiNodeReference({ nodeId })

return referencedNodes.map(refNode => (
  <div key={refNode.id}>
    {refNode.id}: {refNode.state.selectedId}
  </div>
))
\`\`\`
        `,
      },
    },
  },
}

// ============================================================================
// Compound Pattern Examples (SDUI) with providerId
// ============================================================================

export const CompoundPatternSdui: Story = {
  render: () => {
    const document: SduiLayoutDocument = {
      version: '1.0.0',
      root: {
        id: 'dropdown-root',
        type: 'Dropdown',
        state: { selectedId: 'option-1', open: false },
        children: [
          {
            id: 'trigger',
            type: 'DropdownTrigger',
            state: { providerId: 'dropdown-root' },
            children: [
              {
                id: 'trigger-btn',
                type: 'Button',
                state: { appearance: 'primary' },
                children: [{ id: 'trigger-text', type: 'Span', state: { text: 'Custom Button Trigger' } }],
              },
            ],
          },
          {
            id: 'content',
            type: 'DropdownContent',
            state: {
              providerId: 'dropdown-root',
              side: 'bottom',
              sideOffset: 4,
              align: 'start',
            },
            children: [
              {
                id: 'item-1',
                type: 'DropdownItem',
                state: { providerId: 'dropdown-root', value: 'option-1', label: 'Option 1' },
              },
              {
                id: 'item-2',
                type: 'DropdownItem',
                state: { providerId: 'dropdown-root', value: 'option-2', label: 'Option 2' },
              },
              {
                id: 'item-3',
                type: 'DropdownItem',
                state: { providerId: 'dropdown-root', value: 'option-3', label: 'Option 3' },
              },
              {
                id: 'item-4',
                type: 'DropdownItem',
                state: { providerId: 'dropdown-root', value: 'option-4', label: 'Option 4', disabled: true },
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
## Compound Pattern with providerId (SDUI)

The Dropdown supports compound pattern using \`state.providerId\`:

\`\`\`json
{
  "type": "Dropdown",
  "id": "dropdown-root",
  "state": { "selectedId": "option-1", "open": false },
  "children": [
    {
      "type": "DropdownTrigger",
      "state": { "providerId": "dropdown-root" }  // Subscribe to provider
    },
    {
      "type": "DropdownContent",
      "state": { "providerId": "dropdown-root", "side": "bottom" },
      "children": [
        { "type": "DropdownItem", "state": { "providerId": "dropdown-root", "value": "opt-1", "label": "Option 1" } }
      ]
    }
  ]
}
\`\`\`

### Key Points:
- **attributes**: HTML attributes only (\`className\`, \`id\`, \`style\`, \`data-*\`, \`aria-*\`)
- **state**: Dynamic data + Radix UI props (\`providerId\`, \`side\`, \`sideOffset\`, \`label\`, \`disabled\`)
- All child components use \`state.providerId\` to subscribe to the parent Dropdown's state
        `,
      },
    },
  },
}

export const CompoundWithReferenceSdui: Story = {
  render: () => {
    const document: SduiLayoutDocument = {
      version: '1.0.0',
      root: {
        id: 'root',
        type: 'Div',
        attributes: { className: 'space-y-4 p-4 border rounded-lg max-w-md' },
        children: [
          {
            id: 'title',
            type: 'Span',
            state: { text: 'Compound Pattern with providerId + Reference' },
            attributes: { className: 'font-medium block' },
          },
          {
            id: 'desc',
            type: 'Span',
            state: { text: 'Dropdown uses providerId pattern. ReferenceText uses reference for external display.' },
            attributes: { className: 'text-sm text-gray-600 block' },
          },
          {
            id: 'dropdown-compound',
            type: 'Dropdown',
            state: { selectedId: 'medium', open: false },
            children: [
              {
                id: 'trigger',
                type: 'DropdownTrigger',
                state: { providerId: 'dropdown-compound' },
                children: [
                  {
                    id: 'trigger-btn',
                    type: 'Button',
                    state: { appearance: 'primary' },
                    children: [{ id: 'trigger-text', type: 'Span', state: { text: 'Select Priority' } }],
                  },
                ],
              },
              {
                id: 'content',
                type: 'DropdownContent',
                state: { providerId: 'dropdown-compound', side: 'bottom', sideOffset: 4 },
                children: priorityOptions.map((opt, idx) => ({
                  id: `priority-item-${idx}`,
                  type: 'DropdownItem',
                  state: { providerId: 'dropdown-compound', value: opt.id, label: opt.label },
                })),
              },
            ],
          },
          {
            id: 'result-box',
            type: 'Div',
            attributes: { className: 'p-3 bg-gray-50 rounded text-sm' },
            children: [
              {
                id: 'result-label',
                type: 'Span',
                state: { text: 'Selected: ' },
                attributes: { className: 'text-gray-600' },
              },
              {
                id: 'result-value',
                type: 'ReferenceText',
                reference: 'dropdown-compound',
                attributes: {
                  className: 'font-semibold text-gray-900',
                  options: priorityOptions,
                },
              },
            ],
          },
        ],
      },
    }
    return <SduiLayoutRenderer document={document} components={extendedSduiComponents} />
  },
  parameters: {
    docs: {
      description: {
        story: `
## Compound Pattern with providerId + Reference

Combines the compound pattern (providerId) with reference for external state display.

- **Dropdown children**: Use \`state.providerId\` to subscribe to parent
- **ReferenceText**: Uses \`reference\` field to read dropdown state for display
        `,
      },
    },
  },
}

export const NestedDropdownsSdui: Story = {
  render: () => {
    const subMenuOptions = [
      { id: 'cut', label: 'Cut' },
      { id: 'copy', label: 'Copy' },
      { id: 'paste', label: 'Paste' },
    ]

    const document: SduiLayoutDocument = {
      version: '1.0.0',
      root: {
        id: 'root',
        type: 'Div',
        attributes: { className: 'space-y-4 p-4 border rounded-lg max-w-md' },
        children: [
          {
            id: 'title',
            type: 'Span',
            state: { text: 'Nested Dropdowns with providerId' },
            attributes: { className: 'font-medium block' },
          },
          {
            id: 'desc',
            type: 'Span',
            state: { text: 'Each Dropdown uses its own providerId, enabling nested structures.' },
            attributes: { className: 'text-sm text-gray-600 block' },
          },
          {
            id: 'dropdowns-row',
            type: 'Div',
            attributes: { className: 'flex items-center gap-4' },
            children: [
              {
                id: 'outer-dropdown',
                type: 'Dropdown',
                state: { selectedId: 'in-progress', open: false },
                children: [
                  {
                    id: 'outer-trigger',
                    type: 'DropdownTrigger',
                    state: { providerId: 'outer-dropdown' },
                    children: [
                      {
                        id: 'outer-btn',
                        type: 'Button',
                        children: [{ id: 'outer-text', type: 'Span', state: { text: 'Main Menu' } }],
                      },
                    ],
                  },
                  {
                    id: 'outer-content',
                    type: 'DropdownContent',
                    state: { providerId: 'outer-dropdown', side: 'bottom', sideOffset: 4 },
                    children: statusOptions.map((opt, idx) => ({
                      id: `outer-item-${idx}`,
                      type: 'DropdownItem',
                      state: { providerId: 'outer-dropdown', value: opt.id, label: opt.label },
                    })),
                  },
                ],
              },
              {
                id: 'inner-dropdown',
                type: 'Dropdown',
                state: { selectedId: 'copy', open: false },
                children: [
                  {
                    id: 'inner-trigger',
                    type: 'DropdownTrigger',
                    state: { providerId: 'inner-dropdown' },
                    children: [
                      {
                        id: 'inner-btn',
                        type: 'Button',
                        state: { appearance: 'subtle' },
                        children: [{ id: 'inner-text', type: 'Span', state: { text: 'Edit Menu' } }],
                      },
                    ],
                  },
                  {
                    id: 'inner-content',
                    type: 'DropdownContent',
                    state: { providerId: 'inner-dropdown', side: 'bottom', sideOffset: 4 },
                    children: subMenuOptions.map((opt, idx) => ({
                      id: `inner-item-${idx}`,
                      type: 'DropdownItem',
                      state: { providerId: 'inner-dropdown', value: opt.id, label: opt.label },
                    })),
                  },
                ],
              },
            ],
          },
          {
            id: 'summary-box',
            type: 'Div',
            attributes: { className: 'p-3 bg-blue-50 rounded text-sm' },
            children: [
              {
                id: 'summary-text',
                type: 'Span',
                state: { text: 'Main: ' },
                attributes: { className: 'text-blue-700' },
              },
              {
                id: 'main-value',
                type: 'ReferenceText',
                reference: 'outer-dropdown',
                attributes: {
                  className: 'font-medium text-blue-800',
                  options: statusOptions,
                },
              },
              {
                id: 'separator',
                type: 'Span',
                state: { text: ' | Edit: ' },
                attributes: { className: 'text-blue-500' },
              },
              {
                id: 'edit-value',
                type: 'ReferenceText',
                reference: 'inner-dropdown',
                attributes: {
                  className: 'font-medium text-blue-800',
                  options: subMenuOptions,
                },
              },
            ],
          },
        ],
      },
    }
    return <SduiLayoutRenderer document={document} components={extendedSduiComponents} />
  },
  parameters: {
    docs: {
      description: {
        story: `
## Nested Dropdowns with providerId

Each Dropdown maintains its own state via its unique \`id\`. Child components use \`state.providerId\` to explicitly target which Dropdown to subscribe to.

This pattern supports:
- **Multiple independent dropdowns** on the same page
- **Nested/sub-menus** where each level has its own provider
- **Clear state ownership** - no ambiguity about which dropdown owns the state
        `,
      },
    },
  },
}

export const CustomTriggerSdui: Story = {
  render: () => {
    const document: SduiLayoutDocument = {
      version: '1.0.0',
      root: {
        id: 'root',
        type: 'Div',
        attributes: { className: 'space-y-4 p-4 border rounded-lg max-w-md' },
        children: [
          {
            id: 'title',
            type: 'Span',
            state: { text: 'Custom Trigger Examples' },
            attributes: { className: 'font-medium block' },
          },
          {
            id: 'triggers-row',
            type: 'Div',
            attributes: { className: 'flex items-center gap-4' },
            children: [
              // Primary button trigger
              {
                id: 'dropdown-primary',
                type: 'Dropdown',
                state: { selectedId: '1', open: false },
                children: [
                  {
                    id: 'primary-trigger',
                    type: 'DropdownTrigger',
                    state: { providerId: 'dropdown-primary' },
                    children: [
                      {
                        id: 'primary-btn',
                        type: 'Button',
                        state: { appearance: 'primary' },
                        children: [{ id: 'primary-text', type: 'Span', state: { text: 'Primary' } }],
                      },
                    ],
                  },
                  {
                    id: 'primary-content',
                    type: 'DropdownContent',
                    state: { providerId: 'dropdown-primary', side: 'bottom' },
                    children: sampleOptions.map((opt, idx) => ({
                      id: `primary-item-${idx}`,
                      type: 'DropdownItem',
                      state: { providerId: 'dropdown-primary', value: opt.id, label: opt.label },
                    })),
                  },
                ],
              },
              // Default button trigger
              {
                id: 'dropdown-default',
                type: 'Dropdown',
                state: { selectedId: '2', open: false },
                children: [
                  {
                    id: 'default-trigger',
                    type: 'DropdownTrigger',
                    state: { providerId: 'dropdown-default' },
                    children: [
                      {
                        id: 'default-btn',
                        type: 'Button',
                        children: [{ id: 'default-text', type: 'Span', state: { text: 'Default' } }],
                      },
                    ],
                  },
                  {
                    id: 'default-content',
                    type: 'DropdownContent',
                    state: { providerId: 'dropdown-default', side: 'bottom' },
                    children: sampleOptions.map((opt, idx) => ({
                      id: `default-item-${idx}`,
                      type: 'DropdownItem',
                      state: { providerId: 'dropdown-default', value: opt.id, label: opt.label },
                    })),
                  },
                ],
              },
              // Subtle button trigger
              {
                id: 'dropdown-subtle',
                type: 'Dropdown',
                state: { selectedId: '3', open: false },
                children: [
                  {
                    id: 'subtle-trigger',
                    type: 'DropdownTrigger',
                    state: { providerId: 'dropdown-subtle' },
                    children: [
                      {
                        id: 'subtle-btn',
                        type: 'Button',
                        state: { appearance: 'subtle' },
                        children: [{ id: 'subtle-text', type: 'Span', state: { text: 'Subtle' } }],
                      },
                    ],
                  },
                  {
                    id: 'subtle-content',
                    type: 'DropdownContent',
                    state: { providerId: 'dropdown-subtle', side: 'bottom' },
                    children: sampleOptions.map((opt, idx) => ({
                      id: `subtle-item-${idx}`,
                      type: 'DropdownItem',
                      state: { providerId: 'dropdown-subtle', value: opt.id, label: opt.label },
                    })),
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
## Custom Trigger Examples

The compound pattern allows any component as a trigger via the \`DropdownTrigger\` wrapper.

Each dropdown has:
- **DropdownTrigger** with \`state.providerId\` pointing to its parent
- **DropdownContent** with \`state.providerId\` and Radix UI props (\`side\`, \`sideOffset\`)
- **DropdownItem** children with \`state.providerId\`, \`value\`, and \`label\`
        `,
      },
    },
  },
}
