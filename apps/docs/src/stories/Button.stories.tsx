import { type SduiLayoutDocument, SduiLayoutRenderer } from '@lodado/sdui-template'
import { Button, sduiComponents } from '@lodado/sdui-template-component'
import type { Meta, StoryObj } from '@storybook/react-vite'
import React from 'react'

const meta: Meta<typeof Button> = {
  title: 'Shared/UI/Button',
  component: Button,
  tags: ['autodocs'],
  argTypes: {
    appearance: {
      control: 'select',
      options: ['default', 'primary', 'subtle', 'warning', 'danger'],
      description: 'Button appearance style',
      table: {
        defaultValue: { summary: 'default' },
      },
    },
    spacing: {
      control: 'select',
      options: ['default', 'compact'],
      description: 'Button spacing (size)',
      table: {
        defaultValue: { summary: 'default' },
      },
    },
    isDisabled: {
      control: 'boolean',
      description: 'Whether the button is disabled',
      table: {
        defaultValue: { summary: 'false' },
      },
    },
    isLoading: {
      control: 'boolean',
      description: 'Whether the button is in loading state',
      table: {
        defaultValue: { summary: 'false' },
      },
    },
    isSelected: {
      control: 'boolean',
      description: 'Whether the button is selected (toggle state)',
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

The **Button** component follows the Atlassian Design System (ADS) specifications. It's an interactive element that triggers specific actions when clicked.

## Appearance Variants

| Appearance | Description | Use Case |
|------------|-------------|----------|
| \`default\` | Neutral button with border | Secondary actions |
| \`primary\` | Brand blue filled button | Primary actions |
| \`subtle\` | Transparent button, no border | Tertiary actions |
| \`warning\` | Yellow/orange filled button | Warning actions |
| \`danger\` | Red filled button | Destructive actions |

## Spacing Options

| Spacing | Height | Description |
|---------|--------|-------------|
| \`default\` | 32px | Standard button size |
| \`compact\` | 24px | Compact button for dense UIs |

## States

- **isDisabled**: Non-interactive disabled state
- **isLoading**: Shows spinner, blocks interaction
- **isSelected**: Toggle/selected state with visual feedback

## Icons

- **iconBefore**: Icon before the label (16px)
- **iconAfter**: Icon after the label (12px)

## Integration

- ✅ **SDUI template system** integration
- ✅ **Keyboard navigation** (Enter & Space keys)
- ✅ **Accessibility features** built-in
- ✅ **ARIA attributes** for screen readers
        `,
      },
    },
  },
}

export default meta
type Story = StoryObj<typeof Button>

// ============================================================================
// Basic Stories with Controls
// ============================================================================

export const Playground: Story = {
  args: {
    appearance: 'default',
    spacing: 'default',
    isDisabled: false,
    isLoading: false,
    isSelected: false,
    children: 'Button',
  },
  parameters: {
    docs: {
      description: {
        story: `
## Interactive Playground

Use the controls panel to experiment with different button configurations.

### Available Controls

- **appearance**: default, primary, subtle, warning, danger
- **spacing**: default (32px), compact (24px)
- **isDisabled**: Enable/disable the button
- **isLoading**: Show loading spinner
- **isSelected**: Toggle selected state
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
        id: 'root',
        type: 'Div',
        attributes: { className: 'flex items-center justify-center p-4 gap-4' },
        children: [
          {
            id: 'btn-default',
            type: 'Button',
            state: { appearance: 'default' },
            children: [{ id: 'text', type: 'Span', state: { text: 'Default' } }],
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
## Default Appearance

Neutral button with border. Use for secondary actions that need less visual emphasis.

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
        id: 'root',
        type: 'Div',
        attributes: { className: 'flex items-center justify-center p-4 gap-4' },
        children: [
          {
            id: 'btn-primary',
            type: 'Button',
            state: { appearance: 'primary' },
            children: [{ id: 'text', type: 'Span', state: { text: 'Primary' } }],
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
## Primary Appearance

Brand blue filled button for primary actions. The highest visual emphasis.

### Characteristics
- Solid brand blue background
- White text for contrast
- Use for the most important action on a page
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
        id: 'root',
        type: 'Div',
        attributes: { className: 'flex items-center justify-center p-4 gap-4' },
        children: [
          {
            id: 'btn-subtle',
            type: 'Button',
            state: { appearance: 'subtle' },
            children: [{ id: 'text', type: 'Span', state: { text: 'Subtle' } }],
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
## Subtle Appearance

Transparent button without border. Lowest visual emphasis, similar to text links.

### Characteristics
- Transparent background, no border
- Subtle text color
- Use for tertiary actions or link-like buttons
        `,
      },
    },
  },
}

export const AppearanceWarning: Story = {
  render: () => {
    const document: SduiLayoutDocument = {
      version: '1.0.0',
      root: {
        id: 'root',
        type: 'Div',
        attributes: { className: 'flex items-center justify-center p-4 gap-4' },
        children: [
          {
            id: 'btn-warning',
            type: 'Button',
            state: { appearance: 'warning' },
            children: [{ id: 'text', type: 'Span', state: { text: 'Warning' } }],
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
## Warning Appearance

Yellow/orange filled button for warning actions.

### Characteristics
- Warning background color
- Dark text for contrast
- Use for actions that need user attention but aren't destructive
        `,
      },
    },
  },
}

export const AppearanceDanger: Story = {
  render: () => {
    const document: SduiLayoutDocument = {
      version: '1.0.0',
      root: {
        id: 'root',
        type: 'Div',
        attributes: { className: 'flex items-center justify-center p-4 gap-4' },
        children: [
          {
            id: 'btn-danger',
            type: 'Button',
            state: { appearance: 'danger' },
            children: [{ id: 'text', type: 'Span', state: { text: 'Danger' } }],
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
## Danger Appearance

Red filled button for destructive actions.

### Characteristics
- Danger/red background color
- White text for contrast
- Use for delete, remove, or other destructive actions
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
        id: 'root',
        type: 'Div',
        attributes: { className: 'flex items-center justify-center p-4 gap-4' },
        children: [
          {
            id: 'btn-default-spacing',
            type: 'Button',
            state: { appearance: 'primary', spacing: 'default' },
            children: [{ id: 'text', type: 'Span', state: { text: 'Default (32px)' } }],
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
## Default Spacing

Standard button size with 32px height.

### Specifications
- **Height**: 32px minimum
- **Padding**: 12px horizontal
- **Font size**: 14px
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
        id: 'root',
        type: 'Div',
        attributes: { className: 'flex items-center justify-center p-4 gap-4' },
        children: [
          {
            id: 'btn-compact-spacing',
            type: 'Button',
            state: { appearance: 'primary', spacing: 'compact' },
            children: [{ id: 'text', type: 'Span', state: { text: 'Compact (24px)' } }],
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
## Compact Spacing

Smaller button size with 24px height for dense UIs.

### Specifications
- **Height**: 24px minimum
- **Padding**: 8px horizontal
- **Font size**: 12px
        `,
      },
    },
  },
}

// ============================================================================
// States
// ============================================================================

export const StateDisabled: Story = {
  render: () => {
    const document: SduiLayoutDocument = {
      version: '1.0.0',
      root: {
        id: 'root',
        type: 'Div',
        attributes: { className: 'flex items-center justify-center p-4 gap-4' },
        children: [
          {
            id: 'btn-disabled',
            type: 'Button',
            state: { appearance: 'primary', isDisabled: true },
            children: [{ id: 'text', type: 'Span', state: { text: 'Disabled' } }],
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

Non-interactive button indicating an action is unavailable.

### Behavior
- Cannot be clicked
- Keyboard navigation disabled
- Visual feedback: reduced opacity, disabled colors
- \`aria-disabled="true"\` for accessibility
        `,
      },
    },
  },
}

export const StateLoading: Story = {
  render: () => {
    const document: SduiLayoutDocument = {
      version: '1.0.0',
      root: {
        id: 'root',
        type: 'Div',
        attributes: { className: 'flex items-center justify-center p-4 gap-4' },
        children: [
          {
            id: 'btn-loading',
            type: 'Button',
            state: { appearance: 'primary', isLoading: true },
            children: [{ id: 'text', type: 'Span', state: { text: 'Loading...' } }],
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
## Loading State

Shows a spinner and blocks interaction during async operations.

### Behavior
- Spinner animation displayed
- Click events blocked
- Original content hidden but preserves width
- \`aria-busy="true"\` for accessibility
- Icons are hidden during loading
        `,
      },
    },
  },
}

export const StateSelected: Story = {
  render: () => {
    const document: SduiLayoutDocument = {
      version: '1.0.0',
      root: {
        id: 'root',
        type: 'Div',
        attributes: { className: 'flex items-center justify-center p-4 gap-4' },
        children: [
          {
            id: 'btn-selected',
            type: 'Button',
            state: { appearance: 'default', isSelected: true },
            children: [{ id: 'text', type: 'Span', state: { text: 'Selected' } }],
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
## Selected State

Toggle/selected state for buttons that act as toggles.

### Behavior
- Visual feedback with selected background color
- \`aria-pressed="true"\` for accessibility
- Can be combined with any appearance
- Useful for toggle buttons, filters, etc.
        `,
      },
    },
  },
}

// ============================================================================
// Icons
// ============================================================================

export const WithIconBefore: Story = {
  render: () => (
    <div className="flex items-center justify-center p-4 gap-4">
      <Button
        appearance="primary"
        iconBefore={
          <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full">
            <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" stroke="currentColor" strokeWidth="2" fill="none" />
          </svg>
        }
      >
        Search
      </Button>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: `
## Icon Before Label

Add an icon before the button label using \`iconBefore\` prop.

### Specifications
- Icon size: 16x16px
- Gap between icon and label: 6px
- Icon inherits text color
        `,
      },
    },
  },
}

export const WithIconAfter: Story = {
  render: () => (
    <div className="flex items-center justify-center p-4 gap-4">
      <Button
        appearance="default"
        iconAfter={
          <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full">
            <path d="M19 9l-7 7-7-7" stroke="currentColor" strokeWidth="2" fill="none" />
          </svg>
        }
      >
        Dropdown
      </Button>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: `
## Icon After Label

Add an icon after the button label using \`iconAfter\` prop.

### Specifications
- Icon size: 12x12px (smaller for chevrons)
- Gap between label and icon: 6px
- Commonly used for dropdown indicators
        `,
      },
    },
  },
}

export const WithBothIcons: Story = {
  render: () => (
    <div className="flex items-center justify-center p-4 gap-4">
      <Button
        appearance="primary"
        iconBefore={
          <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full">
            <path d="M12 4v16m8-8H4" stroke="currentColor" strokeWidth="2" fill="none" />
          </svg>
        }
        iconAfter={
          <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full">
            <path d="M19 9l-7 7-7-7" stroke="currentColor" strokeWidth="2" fill="none" />
          </svg>
        }
      >
        Add Item
      </Button>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: `
## Both Icons

Buttons can have both iconBefore and iconAfter simultaneously.

### Use Case
- Split button patterns
- Complex action indicators
        `,
      },
    },
  },
}

// ============================================================================
// All Appearances Grid
// ============================================================================

export const AllAppearances: Story = {
  render: () => {
    const document: SduiLayoutDocument = {
      version: '1.0.0',
      root: {
        id: 'root',
        type: 'Div',
        attributes: { className: 'flex flex-col gap-6 p-6' },
        children: [
          {
            id: 'title',
            type: 'Span',
            state: { text: 'All Appearances' },
            attributes: { className: 'text-xl font-bold' },
          },
          {
            id: 'buttons-row',
            type: 'Div',
            attributes: { className: 'flex flex-wrap gap-4 items-center' },
            children: (['default', 'primary', 'subtle', 'warning', 'danger'] as const).map((appearance) => ({
              id: `btn-${appearance}`,
              type: 'Button',
              state: { appearance },
              children: [
                {
                  id: `text-${appearance}`,
                  type: 'Span',
                  state: { text: appearance.charAt(0).toUpperCase() + appearance.slice(1) },
                },
              ],
            })),
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
## All Appearances Overview

Visual comparison of all 5 appearance variants side by side.

| Appearance | Use Case |
|------------|----------|
| Default | Secondary actions |
| Primary | Primary actions |
| Subtle | Tertiary/link-like |
| Warning | Attention needed |
| Danger | Destructive actions |
        `,
      },
    },
  },
}

// ============================================================================
// Spacing Comparison
// ============================================================================

export const SpacingComparison: Story = {
  render: () => {
    const document: SduiLayoutDocument = {
      version: '1.0.0',
      root: {
        id: 'root',
        type: 'Div',
        attributes: { className: 'flex flex-col gap-6 p-6' },
        children: [
          {
            id: 'title',
            type: 'Span',
            state: { text: 'Spacing Comparison' },
            attributes: { className: 'text-xl font-bold' },
          },
          {
            id: 'comparison-row',
            type: 'Div',
            attributes: { className: 'flex gap-8 items-end' },
            children: [
              {
                id: 'default-col',
                type: 'Div',
                attributes: { className: 'flex flex-col gap-2 items-center' },
                children: [
                  {
                    id: 'default-label',
                    type: 'Span',
                    state: { text: 'Default (32px)' },
                    attributes: { className: 'text-sm font-medium' },
                  },
                  {
                    id: 'default-btn',
                    type: 'Button',
                    state: { appearance: 'primary', spacing: 'default' },
                    children: [{ id: 'default-text', type: 'Span', state: { text: 'Button' } }],
                  },
                ],
              },
              {
                id: 'compact-col',
                type: 'Div',
                attributes: { className: 'flex flex-col gap-2 items-center' },
                children: [
                  {
                    id: 'compact-label',
                    type: 'Span',
                    state: { text: 'Compact (24px)' },
                    attributes: { className: 'text-sm font-medium' },
                  },
                  {
                    id: 'compact-btn',
                    type: 'Button',
                    state: { appearance: 'primary', spacing: 'compact' },
                    children: [{ id: 'compact-text', type: 'Span', state: { text: 'Button' } }],
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
## Spacing Side-by-Side

Compare default and compact spacing options.

| Spacing | Height | Padding | Font |
|---------|--------|---------|------|
| Default | 32px | 12px | 14px |
| Compact | 24px | 8px | 12px |
        `,
      },
    },
  },
}

// ============================================================================
// States Matrix
// ============================================================================

export const StatesMatrix: Story = {
  render: () => {
    const appearances = ['default', 'primary', 'subtle', 'warning', 'danger'] as const

    const document: SduiLayoutDocument = {
      version: '1.0.0',
      root: {
        id: 'root',
        type: 'Div',
        attributes: { className: 'flex flex-col gap-6 p-6' },
        children: [
          {
            id: 'title',
            type: 'Span',
            state: { text: 'States Matrix' },
            attributes: { className: 'text-xl font-bold mb-4' },
          },
          // Header row
          {
            id: 'header',
            type: 'Div',
            attributes: { className: 'grid grid-cols-6 gap-4 items-center mb-2' },
            children: [
              { id: 'h-appearance', type: 'Span', state: { text: 'Appearance' }, attributes: { className: 'font-bold' } },
              { id: 'h-default', type: 'Span', state: { text: 'Default' }, attributes: { className: 'text-center text-sm' } },
              { id: 'h-disabled', type: 'Span', state: { text: 'Disabled' }, attributes: { className: 'text-center text-sm' } },
              { id: 'h-loading', type: 'Span', state: { text: 'Loading' }, attributes: { className: 'text-center text-sm' } },
              { id: 'h-selected', type: 'Span', state: { text: 'Selected' }, attributes: { className: 'text-center text-sm' } },
              { id: 'h-hover', type: 'Span', state: { text: 'Hover (try)' }, attributes: { className: 'text-center text-sm' } },
            ],
          },
          // Data rows
          ...appearances.map((appearance) => ({
            id: `row-${appearance}`,
            type: 'Div',
            attributes: { className: 'grid grid-cols-6 gap-4 items-center' },
            children: [
              {
                id: `label-${appearance}`,
                type: 'Span',
                state: { text: appearance.charAt(0).toUpperCase() + appearance.slice(1) },
                attributes: { className: 'font-medium capitalize' },
              },
              {
                id: `btn-default-${appearance}`,
                type: 'Button',
                state: { appearance },
                children: [{ id: `text-default-${appearance}`, type: 'Span', state: { text: 'Button' } }],
              },
              {
                id: `btn-disabled-${appearance}`,
                type: 'Button',
                state: { appearance, isDisabled: true },
                children: [{ id: `text-disabled-${appearance}`, type: 'Span', state: { text: 'Button' } }],
              },
              {
                id: `btn-loading-${appearance}`,
                type: 'Button',
                state: { appearance, isLoading: true },
                children: [{ id: `text-loading-${appearance}`, type: 'Span', state: { text: 'Button' } }],
              },
              {
                id: `btn-selected-${appearance}`,
                type: 'Button',
                state: { appearance, isSelected: true },
                children: [{ id: `text-selected-${appearance}`, type: 'Span', state: { text: 'Button' } }],
              },
              {
                id: `btn-hover-${appearance}`,
                type: 'Button',
                state: { appearance },
                children: [{ id: `text-hover-${appearance}`, type: 'Span', state: { text: 'Button' } }],
              },
            ],
          })),
        ],
      },
    }

    return <SduiLayoutRenderer document={document} components={sduiComponents} />
  },
  parameters: {
    docs: {
      description: {
        story: `
## Complete States Matrix

A comprehensive view of all appearance variants across different states.

### States Shown
- **Default**: Normal interactive state
- **Disabled**: Non-interactive, reduced opacity
- **Loading**: Spinner shown, interaction blocked
- **Selected**: Toggle/selected state
- **Hover**: Hover over to see hover state
        `,
      },
    },
  },
}

// ============================================================================
// Complete Matrix
// ============================================================================

export const CompleteMatrix: Story = {
  render: () => {
    const appearances = ['default', 'primary', 'subtle', 'warning', 'danger'] as const
    const spacings = ['default', 'compact'] as const

    const document: SduiLayoutDocument = {
      version: '1.0.0',
      root: {
        id: 'root',
        type: 'Div',
        attributes: { className: 'flex flex-col gap-8 p-6' },
        children: [
          {
            id: 'title',
            type: 'Span',
            state: { text: 'Complete Button Matrix (ADS Style)' },
            attributes: { className: 'text-2xl font-bold' },
          },
          {
            id: 'subtitle',
            type: 'Span',
            state: { text: '5 Appearances × 2 Spacings = 10 Combinations' },
            attributes: { className: 'text-sm text-gray-600 mb-4' },
          },
          ...spacings.map((spacing) => ({
            id: `section-${spacing}`,
            type: 'Div',
            attributes: { className: 'flex flex-col gap-4' },
            children: [
              {
                id: `section-title-${spacing}`,
                type: 'Span',
                state: { text: `Spacing: ${spacing} (${spacing === 'default' ? '32px' : '24px'})` },
                attributes: { className: 'text-lg font-semibold' },
              },
              {
                id: `buttons-${spacing}`,
                type: 'Div',
                attributes: { className: 'flex flex-wrap gap-4 items-center' },
                children: appearances.map((appearance) => ({
                  id: `btn-${spacing}-${appearance}`,
                  type: 'Button',
                  state: { appearance, spacing },
                  children: [
                    {
                      id: `text-${spacing}-${appearance}`,
                      type: 'Span',
                      state: { text: appearance.charAt(0).toUpperCase() + appearance.slice(1) },
                    },
                  ],
                })),
              },
            ],
          })),
        ],
      },
    }

    return <SduiLayoutRenderer document={document} components={sduiComponents} />
  },
  parameters: {
    docs: {
      description: {
        story: `
## Complete Button Matrix

All 10 button combinations organized by spacing.

### Matrix Overview

| Spacing \\ Appearance | Default | Primary | Subtle | Warning | Danger |
|----------------------|---------|---------|--------|---------|--------|
| Default (32px) | ✓ | ✓ | ✓ | ✓ | ✓ |
| Compact (24px) | ✓ | ✓ | ✓ | ✓ | ✓ |

### Usage Guidelines

- **Primary actions**: Use \`primary\` appearance
- **Secondary actions**: Use \`default\` appearance
- **Tertiary actions**: Use \`subtle\` appearance
- **Warning actions**: Use \`warning\` appearance
- **Destructive actions**: Use \`danger\` appearance
        `,
      },
    },
  },
}
