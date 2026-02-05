import { type SduiLayoutDocument, SduiLayoutRenderer } from '@lodado/sdui-template'
import { Badge, sduiComponents } from '@lodado/sdui-template-component'
import type { Meta, StoryObj } from '@storybook/react-vite'

const meta: Meta<typeof Badge> = {
  title: 'Shared/UI/Badge',
  component: Badge,
  tags: ['autodocs'],
  argTypes: {
    label: {
      control: 'text',
      description: 'Badge label content (numeric value or string)',
      table: {
        defaultValue: { summary: '25' },
      },
    },
    appearance: {
      control: 'select',
      options: ['default', 'primary', 'primaryInverted', 'important', 'added', 'removed'],
      description: 'Badge appearance variant',
      table: {
        defaultValue: { summary: 'default' },
      },
    },
  },
  parameters: {
    docs: {
      description: {
        component: `
## Overview

The **Badge** component follows the Atlassian Design System (ADS) specifications. A badge is a visual indicator for numeric values such as tallies and scores.

## Design Specs

- Height: 16px
- Min Width: 24px
- Padding: 4px horizontal (xxsmall)
- Border Radius: 2px
- Border: none
- Font Size: 12px (Body S)
- Line Height: 16px
- Background: neutral300 (#dddee1)
- Text Color: neutral1000 (#292a2e)

## Appearance Variants

| Appearance | Description |
|------------|-------------|
| \`default\` | Default neutral appearance |
| \`primary\` | Primary blue appearance |
| \`primaryInverted\` | Primary inverted appearance (white background, brand text) |
| \`important\` | Important red appearance |


## Features

- **label**: Supports both numeric and string values
- **props spread**: All HTML div attributes supported

## Integration

- ✅ **SDUI template system** integration

## Usage

Badges are typically used to display:
- Notification counts
- Unread message counts
- Item quantities
- Scores or tallies
        `,
      },
    },
  },
}

export default meta
type Story = StoryObj<typeof Badge>

// ============================================================================
// Basic Stories with Controls
// ============================================================================

export const Playground: Story = {
  args: {
    label: 25,
    appearance: 'default',
  },
  render: (args) => {
    const document: SduiLayoutDocument = {
      version: '1.0.0',
      root: {
        id: 'root',
        type: 'Div',
        attributes: { className: 'flex items-center justify-center p-4' },
        children: [
          {
            id: 'badge-playground',
            type: 'Badge',
            state: {
              label: args.label,
              appearance: args.appearance,
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
## Interactive Playground

Use the controls panel to experiment with different badge configurations.

### Available Controls

- **label**: Badge label (number or string)
- **appearance**: Appearance variant (default, primary, primaryInverted, important, added, removed)
        `,
      },
    },
  },
}

// ============================================================================
// Numeric Labels
// ============================================================================

export const NumericLabels: Story = {
  render: () => {
    const document: SduiLayoutDocument = {
      version: '1.0.0',
      root: {
        id: 'root',
        type: 'Div',
        attributes: { className: 'flex flex-col gap-6 p-6' },
        children: [
          {
            id: 'section-default',
            type: 'Div',
            attributes: { className: 'flex flex-col gap-3' },
            children: [
              {
                id: 'title-default',
                type: 'Span',
                state: { text: 'Default Appearance' },
                attributes: { className: 'text-sm font-semibold text-gray-700' },
              },
              {
                id: 'badges-default',
                type: 'Div',
                attributes: { className: 'flex items-center gap-3 flex-wrap' },
                children: [
                  { id: 'badge-0', type: 'Badge', state: { label: 0, appearance: 'default' } },
                  { id: 'badge-1', type: 'Badge', state: { label: 1, appearance: 'default' } },
                  { id: 'badge-5', type: 'Badge', state: { label: 5, appearance: 'default' } },
                  { id: 'badge-25', type: 'Badge', state: { label: 25, appearance: 'default' } },
                  { id: 'badge-99', type: 'Badge', state: { label: 99, appearance: 'default' } },
                  { id: 'badge-999', type: 'Badge', state: { label: 999, appearance: 'default' } },
                ],
              },
            ],
          },
          {
            id: 'section-variants',
            type: 'Div',
            attributes: { className: 'flex flex-col gap-3' },
            children: [
              {
                id: 'title-variants',
                type: 'Span',
                state: { text: 'All Variants' },
                attributes: { className: 'text-sm font-semibold text-gray-700' },
              },
              {
                id: 'row-0',
                type: 'Div',
                attributes: { className: 'flex items-center gap-3 flex-wrap' },
                children: [
                  { id: 'badge-0-default', type: 'Badge', state: { label: 0, appearance: 'default' } },
                  { id: 'badge-0-primary', type: 'Badge', state: { label: 0, appearance: 'primary' } },
                  { id: 'badge-0-important', type: 'Badge', state: { label: 0, appearance: 'important' } },
                  { id: 'badge-0-added', type: 'Badge', state: { label: 0, appearance: 'added' } },
                  { id: 'badge-0-removed', type: 'Badge', state: { label: 0, appearance: 'removed' } },
                ],
              },
              {
                id: 'row-25',
                type: 'Div',
                attributes: { className: 'flex items-center gap-3 flex-wrap' },
                children: [
                  { id: 'badge-25-default', type: 'Badge', state: { label: 25, appearance: 'default' } },
                  { id: 'badge-25-primary', type: 'Badge', state: { label: 25, appearance: 'primary' } },
                  { id: 'badge-25-important', type: 'Badge', state: { label: 25, appearance: 'important' } },
                  { id: 'badge-25-added', type: 'Badge', state: { label: 25, appearance: 'added' } },
                  { id: 'badge-25-removed', type: 'Badge', state: { label: 25, appearance: 'removed' } },
                ],
              },
              {
                id: 'row-99',
                type: 'Div',
                attributes: { className: 'flex items-center gap-3 flex-wrap' },
                children: [
                  { id: 'badge-99-default', type: 'Badge', state: { label: 99, appearance: 'default' } },
                  { id: 'badge-99-primary', type: 'Badge', state: { label: 99, appearance: 'primary' } },
                  { id: 'badge-99-important', type: 'Badge', state: { label: 99, appearance: 'important' } },
                  { id: 'badge-99-added', type: 'Badge', state: { label: 99, appearance: 'added' } },
                  { id: 'badge-99-removed', type: 'Badge', state: { label: 99, appearance: 'removed' } },
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
## Numeric Labels

Badges can display numeric values from 0 to any number across all appearance variants.
        `,
      },
    },
  },
}

// ============================================================================
// String Labels
// ============================================================================

export const StringLabels: Story = {
  render: () => {
    const document: SduiLayoutDocument = {
      version: '1.0.0',
      root: {
        id: 'root',
        type: 'Div',
        attributes: { className: 'flex flex-col gap-6 p-6' },
        children: [
          {
            id: 'section-common',
            type: 'Div',
            attributes: { className: 'flex flex-col gap-3' },
            children: [
              {
                id: 'title-common',
                type: 'Span',
                state: { text: 'Common String Labels' },
                attributes: { className: 'text-sm font-semibold text-gray-700' },
              },
              {
                id: 'badges-common',
                type: 'Div',
                attributes: { className: 'flex items-center gap-3 flex-wrap' },
                children: [
                  { id: 'badge-99plus', type: 'Badge', state: { label: '99+', appearance: 'default' } },
                  { id: 'badge-new', type: 'Badge', state: { label: 'New', appearance: 'primary' } },
                  { id: 'badge-excl', type: 'Badge', state: { label: '!', appearance: 'important' } },
                  { id: 'badge-hot', type: 'Badge', state: { label: 'Hot', appearance: 'added' } },
                  { id: 'badge-del', type: 'Badge', state: { label: 'Del', appearance: 'removed' } },
                ],
              },
            ],
          },
          {
            id: 'section-all-variants',
            type: 'Div',
            attributes: { className: 'flex flex-col gap-3' },
            children: [
              {
                id: 'title-all-variants',
                type: 'Span',
                state: { text: 'All Variants with Same Label' },
                attributes: { className: 'text-sm font-semibold text-gray-700' },
              },
              {
                id: 'badges-all-variants',
                type: 'Div',
                attributes: { className: 'flex items-center gap-3 flex-wrap' },
                children: [
                  { id: 'badge-new-default', type: 'Badge', state: { label: 'New', appearance: 'default' } },
                  { id: 'badge-new-primary', type: 'Badge', state: { label: 'New', appearance: 'primary' } },
                  { id: 'badge-new-primaryInverted', type: 'Badge', state: { label: 'New', appearance: 'primaryInverted' } },
                  { id: 'badge-new-important', type: 'Badge', state: { label: 'New', appearance: 'important' } },
                  { id: 'badge-new-added', type: 'Badge', state: { label: 'New', appearance: 'added' } },
                  { id: 'badge-new-removed', type: 'Badge', state: { label: 'New', appearance: 'removed' } },
                ],
              },
            ],
          },
          {
            id: 'section-special',
            type: 'Div',
            attributes: { className: 'flex flex-col gap-3' },
            children: [
              {
                id: 'title-special',
                type: 'Span',
                state: { text: 'Special Characters' },
                attributes: { className: 'text-sm font-semibold text-gray-700' },
              },
              {
                id: 'badges-special',
                type: 'Div',
                attributes: { className: 'flex items-center gap-3 flex-wrap' },
                children: [
                  { id: 'badge-excl-default', type: 'Badge', state: { label: '!', appearance: 'default' } },
                  { id: 'badge-quest-primary', type: 'Badge', state: { label: '?', appearance: 'primary' } },
                  { id: 'badge-star-important', type: 'Badge', state: { label: '*', appearance: 'important' } },
                  { id: 'badge-plus-added', type: 'Badge', state: { label: '+', appearance: 'added' } },
                  { id: 'badge-minus-removed', type: 'Badge', state: { label: '-', appearance: 'removed' } },
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
## String Labels

Badges can also display string values for special cases like "99+", custom labels, or special characters across all appearance variants.
        `,
      },
    },
  },
}

// ============================================================================
// Common Use Cases
// ============================================================================

export const NotificationCounts: Story = {
  render: () => {
    const document: SduiLayoutDocument = {
      version: '1.0.0',
      root: {
        id: 'root',
        type: 'Div',
        attributes: { className: 'flex flex-col gap-8 p-6' },
        children: [
          {
            id: 'section-menu',
            type: 'Div',
            attributes: { className: 'flex flex-col gap-4' },
            children: [
              {
                id: 'title-menu',
                type: 'Span',
                state: { text: 'Menu Items with Badges' },
                attributes: { className: 'text-sm font-semibold text-gray-700' },
              },
              {
                id: 'menu-items',
                type: 'Div',
                attributes: { className: 'flex flex-col gap-3' },
                children: [
                  {
                    id: 'menu-1',
                    type: 'Div',
                    attributes: { className: 'flex items-center justify-between p-3 bg-gray-50 rounded' },
                    children: [
                      {
                        id: 'menu-1-text',
                        type: 'Span',
                        state: { text: 'Messages' },
                        attributes: { className: 'font-medium' },
                      },
                      {
                        id: 'menu-1-badge',
                        type: 'Badge',
                        state: { label: 3, appearance: 'default' },
                      },
                    ],
                  },
                  {
                    id: 'menu-2',
                    type: 'Div',
                    attributes: { className: 'flex items-center justify-between p-3 bg-gray-50 rounded' },
                    children: [
                      {
                        id: 'menu-2-text',
                        type: 'Span',
                        state: { text: 'Notifications' },
                        attributes: { className: 'font-medium' },
                      },
                      {
                        id: 'menu-2-badge',
                        type: 'Badge',
                        state: { label: 12, appearance: 'primary' },
                      },
                    ],
                  },
                  {
                    id: 'menu-3',
                    type: 'Div',
                    attributes: { className: 'flex items-center justify-between p-3 bg-gray-50 rounded' },
                    children: [
                      {
                        id: 'menu-3-text',
                        type: 'Span',
                        state: { text: 'Tasks' },
                        attributes: { className: 'font-medium' },
                      },
                      {
                        id: 'menu-3-badge',
                        type: 'Badge',
                        state: { label: 99, appearance: 'important' },
                      },
                    ],
                  },
                  {
                    id: 'menu-4',
                    type: 'Div',
                    attributes: { className: 'flex items-center justify-between p-3 bg-gray-50 rounded' },
                    children: [
                      {
                        id: 'menu-4-text',
                        type: 'Span',
                        state: { text: 'Alerts' },
                        attributes: { className: 'font-medium' },
                      },
                      {
                        id: 'menu-4-badge',
                        type: 'Badge',
                        state: { label: '99+', appearance: 'important' },
                      },
                    ],
                  },
                ],
              },
            ],
          },
          {
            id: 'section-status',
            type: 'Div',
            attributes: { className: 'flex flex-col gap-4' },
            children: [
              {
                id: 'title-status',
                type: 'Span',
                state: { text: 'Status Indicators' },
                attributes: { className: 'text-sm font-semibold text-gray-700' },
              },
              {
                id: 'status-items',
                type: 'Div',
                attributes: { className: 'flex flex-wrap gap-3' },
                children: [
                  {
                    id: 'status-1',
                    type: 'Div',
                    attributes: { className: 'flex items-center gap-2' },
                    children: [
                      {
                        id: 'status-1-text',
                        type: 'Span',
                        state: { text: 'Active Users:' },
                        attributes: { className: 'text-sm' },
                      },
                      {
                        id: 'status-1-badge',
                        type: 'Badge',
                        state: { label: 42, appearance: 'added' },
                      },
                    ],
                  },
                  {
                    id: 'status-2',
                    type: 'Div',
                    attributes: { className: 'flex items-center gap-2' },
                    children: [
                      {
                        id: 'status-2-text',
                        type: 'Span',
                        state: { text: 'Pending:' },
                        attributes: { className: 'text-sm' },
                      },
                      {
                        id: 'status-2-badge',
                        type: 'Badge',
                        state: { label: 7, appearance: 'important' },
                      },
                    ],
                  },
                  {
                    id: 'status-3',
                    type: 'Div',
                    attributes: { className: 'flex items-center gap-2' },
                    children: [
                      {
                        id: 'status-3-text',
                        type: 'Span',
                        state: { text: 'Completed:' },
                        attributes: { className: 'text-sm' },
                      },
                      {
                        id: 'status-3-badge',
                        type: 'Badge',
                        state: { label: 128, appearance: 'primary' },
                      },
                    ],
                  },
                  {
                    id: 'status-4',
                    type: 'Div',
                    attributes: { className: 'flex items-center gap-2' },
                    children: [
                      {
                        id: 'status-4-text',
                        type: 'Span',
                        state: { text: 'Removed:' },
                        attributes: { className: 'text-sm' },
                      },
                      {
                        id: 'status-4-badge',
                        type: 'Badge',
                        state: { label: 5, appearance: 'removed' },
                      },
                    ],
                  },
                ],
              },
            ],
          },
          {
            id: 'section-buttons',
            type: 'Div',
            attributes: { className: 'flex flex-col gap-4' },
            children: [
              {
                id: 'title-buttons',
                type: 'Span',
                state: { text: 'Button Badges' },
                attributes: { className: 'text-sm font-semibold text-gray-700' },
              },
              {
                id: 'button-items',
                type: 'Div',
                attributes: { className: 'flex flex-wrap gap-3' },
                children: [
                  {
                    id: 'button-1',
                    type: 'Div',
                    attributes: { className: 'px-4 py-2 bg-blue-600 text-white rounded flex items-center gap-2' },
                    children: [
                      {
                        id: 'button-1-text',
                        type: 'Span',
                        state: { text: 'Inbox' },
                      },
                      {
                        id: 'button-1-badge',
                        type: 'Badge',
                        state: { label: 5, appearance: 'primaryInverted' },
                      },
                    ],
                  },
                  {
                    id: 'button-2',
                    type: 'Div',
                    attributes: { className: 'px-4 py-2 bg-gray-200 text-gray-800 rounded flex items-center gap-2' },
                    children: [
                      {
                        id: 'button-2-text',
                        type: 'Span',
                        state: { text: 'Updates' },
                      },
                      {
                        id: 'button-2-badge',
                        type: 'Badge',
                        state: { label: 12, appearance: 'default' },
                      },
                    ],
                  },
                  {
                    id: 'button-3',
                    type: 'Div',
                    attributes: { className: 'px-4 py-2 bg-red-100 text-red-800 rounded flex items-center gap-2' },
                    children: [
                      {
                        id: 'button-3-text',
                        type: 'Span',
                        state: { text: 'Issues' },
                      },
                      {
                        id: 'button-3-badge',
                        type: 'Badge',
                        state: { label: 3, appearance: 'important' },
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
## Common Use Cases

Real-world examples of badges in different contexts: menu items, status indicators, and button badges.
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
        id: 'root',
        type: 'Div',
        attributes: { className: 'flex flex-wrap items-center justify-center p-4 gap-4' },
        children: [
          {
            id: 'badge-1',
            type: 'Badge',
            state: { label: 0 },
          },
          {
            id: 'badge-2',
            type: 'Badge',
            state: { label: 5 },
          },
          {
            id: 'badge-3',
            type: 'Badge',
            state: { label: 25 },
          },
          {
            id: 'badge-4',
            type: 'Badge',
            state: { label: 99 },
          },
          {
            id: 'badge-5',
            type: 'Badge',
            state: { label: '99+' },
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
## SDUI Integration

Badges rendered via SDUI document structure.

\`\`\`json
{
  "id": "badge-1",
  "type": "Badge",
  "state": { "label": 25 }
}
\`\`\`
        `,
      },
    },
  },
}

// ============================================================================
// With Custom Styling
// ============================================================================

export const WithCustomStyling: Story = {
  render: () => {
    const document: SduiLayoutDocument = {
      version: '1.0.0',
      root: {
        id: 'root',
        type: 'Div',
        attributes: { className: 'flex flex-col items-center justify-center p-4 gap-4' },
        children: [
          {
            id: 'row-1',
            type: 'Div',
            attributes: { className: 'flex items-center gap-2' },
            children: [
              {
                id: 'text-1',
                type: 'Span',
                state: { text: 'Default' },
              },
              {
                id: 'badge-1',
                type: 'Badge',
                state: { label: 25 },
              },
            ],
          },
          {
            id: 'row-2',
            type: 'Div',
            attributes: { className: 'flex items-center gap-2' },
            children: [
              {
                id: 'text-2',
                type: 'Span',
                state: { text: 'Custom Class' },
              },
              {
                id: 'badge-2',
                type: 'Badge',
                state: { label: 25 },
                attributes: { className: 'opacity-75' },
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
## Custom Styling

Badges support custom className for additional styling.
        `,
      },
    },
  },
}

// ============================================================================
// Appearance Variants
// ============================================================================

export const AppearanceVariants: Story = {
  render: () => {
    const document: SduiLayoutDocument = {
      version: '1.0.0',
      root: {
        id: 'root',
        type: 'Div',
        attributes: { className: 'flex flex-col gap-8 p-6' },
        children: [
          {
            id: 'grid',
            type: 'Div',
            attributes: { className: 'grid grid-cols-2 gap-6' },
            children: [
              {
                id: 'col-default',
                type: 'Div',
                attributes: { className: 'flex flex-col gap-3' },
                children: [
                  {
                    id: 'title-default',
                    type: 'Span',
                    state: { text: 'appearance=default' },
                    attributes: { className: 'text-sm font-mono text-gray-600 font-semibold' },
                  },
                  {
                    id: 'badges-default',
                    type: 'Div',
                    attributes: { className: 'flex items-center gap-3 flex-wrap' },
                    children: [
                      { id: 'badge-default-0', type: 'Badge', state: { label: 0, appearance: 'default' } },
                      { id: 'badge-default-5', type: 'Badge', state: { label: 5, appearance: 'default' } },
                      { id: 'badge-default-25', type: 'Badge', state: { label: 25, appearance: 'default' } },
                      { id: 'badge-default-99', type: 'Badge', state: { label: 99, appearance: 'default' } },
                      { id: 'badge-default-99plus', type: 'Badge', state: { label: '99+', appearance: 'default' } },
                    ],
                  },
                ],
              },
              {
                id: 'col-primary',
                type: 'Div',
                attributes: { className: 'flex flex-col gap-3' },
                children: [
                  {
                    id: 'title-primary',
                    type: 'Span',
                    state: { text: 'appearance=primary' },
                    attributes: { className: 'text-sm font-mono text-gray-600 font-semibold' },
                  },
                  {
                    id: 'badges-primary',
                    type: 'Div',
                    attributes: { className: 'flex items-center gap-3 flex-wrap' },
                    children: [
                      { id: 'badge-primary-0', type: 'Badge', state: { label: 0, appearance: 'primary' } },
                      { id: 'badge-primary-5', type: 'Badge', state: { label: 5, appearance: 'primary' } },
                      { id: 'badge-primary-25', type: 'Badge', state: { label: 25, appearance: 'primary' } },
                      { id: 'badge-primary-99', type: 'Badge', state: { label: 99, appearance: 'primary' } },
                      { id: 'badge-primary-new', type: 'Badge', state: { label: 'New', appearance: 'primary' } },
                    ],
                  },
                ],
              },
              {
                id: 'col-primaryInverted',
                type: 'Div',
                attributes: { className: 'flex flex-col gap-3' },
                children: [
                  {
                    id: 'title-primaryInverted',
                    type: 'Span',
                    state: { text: 'appearance=primaryInverted' },
                    attributes: { className: 'text-sm font-mono text-gray-600 font-semibold' },
                  },
                  {
                    id: 'badges-primaryInverted',
                    type: 'Div',
                    attributes: { className: 'flex items-center gap-3 flex-wrap bg-gray-100 p-3 rounded' },
                    children: [
                      { id: 'badge-primaryInverted-0', type: 'Badge', state: { label: 0, appearance: 'primaryInverted' } },
                      { id: 'badge-primaryInverted-5', type: 'Badge', state: { label: 5, appearance: 'primaryInverted' } },
                      { id: 'badge-primaryInverted-25', type: 'Badge', state: { label: 25, appearance: 'primaryInverted' } },
                      { id: 'badge-primaryInverted-99', type: 'Badge', state: { label: 99, appearance: 'primaryInverted' } },
                      { id: 'badge-primaryInverted-excl', type: 'Badge', state: { label: '!', appearance: 'primaryInverted' } },
                    ],
                  },
                ],
              },
              {
                id: 'col-important',
                type: 'Div',
                attributes: { className: 'flex flex-col gap-3' },
                children: [
                  {
                    id: 'title-important',
                    type: 'Span',
                    state: { text: 'appearance=important' },
                    attributes: { className: 'text-sm font-mono text-gray-600 font-semibold' },
                  },
                  {
                    id: 'badges-important',
                    type: 'Div',
                    attributes: { className: 'flex items-center gap-3 flex-wrap' },
                    children: [
                      { id: 'badge-important-1', type: 'Badge', state: { label: 1, appearance: 'important' } },
                      { id: 'badge-important-5', type: 'Badge', state: { label: 5, appearance: 'important' } },
                      { id: 'badge-important-25', type: 'Badge', state: { label: 25, appearance: 'important' } },
                      { id: 'badge-important-99', type: 'Badge', state: { label: 99, appearance: 'important' } },
                      { id: 'badge-important-excl', type: 'Badge', state: { label: '!', appearance: 'important' } },
                    ],
                  },
                ],
              },
              {
                id: 'col-added',
                type: 'Div',
                attributes: { className: 'flex flex-col gap-3' },
                children: [
                  {
                    id: 'title-added',
                    type: 'Span',
                    state: { text: 'appearance=added' },
                    attributes: { className: 'text-sm font-mono text-gray-600 font-semibold' },
                  },
                  {
                    id: 'badges-added',
                    type: 'Div',
                    attributes: { className: 'flex items-center gap-3 flex-wrap' },
                    children: [
                      { id: 'badge-added-1', type: 'Badge', state: { label: 1, appearance: 'added' } },
                      { id: 'badge-added-5', type: 'Badge', state: { label: 5, appearance: 'added' } },
                      { id: 'badge-added-25', type: 'Badge', state: { label: 25, appearance: 'added' } },
                      { id: 'badge-added-99', type: 'Badge', state: { label: 99, appearance: 'added' } },
                      { id: 'badge-added-new', type: 'Badge', state: { label: 'New', appearance: 'added' } },
                    ],
                  },
                ],
              },
              {
                id: 'col-removed',
                type: 'Div',
                attributes: { className: 'flex flex-col gap-3' },
                children: [
                  {
                    id: 'title-removed',
                    type: 'Span',
                    state: { text: 'appearance=removed' },
                    attributes: { className: 'text-sm font-mono text-gray-600 font-semibold' },
                  },
                  {
                    id: 'badges-removed',
                    type: 'Div',
                    attributes: { className: 'flex items-center gap-3 flex-wrap' },
                    children: [
                      { id: 'badge-removed-1', type: 'Badge', state: { label: 1, appearance: 'removed' } },
                      { id: 'badge-removed-5', type: 'Badge', state: { label: 5, appearance: 'removed' } },
                      { id: 'badge-removed-25', type: 'Badge', state: { label: 25, appearance: 'removed' } },
                      { id: 'badge-removed-99', type: 'Badge', state: { label: 99, appearance: 'removed' } },
                      { id: 'badge-removed-del', type: 'Badge', state: { label: 'Del', appearance: 'removed' } },
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
## Appearance Variants

All available appearance variants for the Badge component with various label values.

- **default**: Default neutral appearance
- **primary**: Primary blue appearance
- **primaryInverted**: Primary inverted appearance (white background, brand text)
- **important**: Important red appearance
- **added**: Success appearance
- **removed**: Danger appearance
        `,
      },
    },
  },
}
