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
  render: () => (
    <div className="flex flex-col gap-6 p-6">
      <div className="flex flex-col gap-3">
        <div className="text-sm font-semibold text-gray-700">Default Appearance</div>
        <div className="flex items-center gap-3 flex-wrap">
          <Badge label={0} appearance="default" />
          <Badge label={1} appearance="default" />
          <Badge label={5} appearance="default" />
          <Badge label={25} appearance="default" />
          <Badge label={99} appearance="default" />
          <Badge label={999} appearance="default" />
        </div>
      </div>
      <div className="flex flex-col gap-3">
        <div className="text-sm font-semibold text-gray-700">All Variants</div>
        <div className="flex items-center gap-3 flex-wrap">
          <Badge label={0} appearance="default" />
          <Badge label={0} appearance="primary" />
          <Badge label={0} appearance="important" />
          <Badge label={0} appearance="added" />
          <Badge label={0} appearance="removed" />
        </div>
        <div className="flex items-center gap-3 flex-wrap">
          <Badge label={25} appearance="default" />
          <Badge label={25} appearance="primary" />
          <Badge label={25} appearance="important" />
          <Badge label={25} appearance="added" />
          <Badge label={25} appearance="removed" />
        </div>
        <div className="flex items-center gap-3 flex-wrap">
          <Badge label={99} appearance="default" />
          <Badge label={99} appearance="primary" />
          <Badge label={99} appearance="important" />
          <Badge label={99} appearance="added" />
          <Badge label={99} appearance="removed" />
        </div>
      </div>
    </div>
  ),
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
  render: () => (
    <div className="flex flex-col gap-6 p-6">
      <div className="flex flex-col gap-3">
        <div className="text-sm font-semibold text-gray-700">Common String Labels</div>
        <div className="flex items-center gap-3 flex-wrap">
          <Badge label="99+" appearance="default" />
          <Badge label="New" appearance="primary" />
          <Badge label="!" appearance="important" />
          <Badge label="Hot" appearance="added" />
          <Badge label="Del" appearance="removed" />
        </div>
      </div>
      <div className="flex flex-col gap-3">
        <div className="text-sm font-semibold text-gray-700">All Variants with Same Label</div>
        <div className="flex items-center gap-3 flex-wrap">
          <Badge label="New" appearance="default" />
          <Badge label="New" appearance="primary" />
          <Badge label="New" appearance="primaryInverted" />
          <Badge label="New" appearance="important" />
          <Badge label="New" appearance="added" />
          <Badge label="New" appearance="removed" />
        </div>
      </div>
      <div className="flex flex-col gap-3">
        <div className="text-sm font-semibold text-gray-700">Special Characters</div>
        <div className="flex items-center gap-3 flex-wrap">
          <Badge label="!" appearance="default" />
          <Badge label="?" appearance="primary" />
          <Badge label="*" appearance="important" />
          <Badge label="+" appearance="added" />
          <Badge label="-" appearance="removed" />
        </div>
      </div>
    </div>
  ),
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
  render: () => (
    <div className="flex flex-col gap-8 p-6">
      <div className="flex flex-col gap-4">
        <div className="text-sm font-semibold text-gray-700">Menu Items with Badges</div>
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
            <span className="font-medium">Messages</span>
            <Badge label={3} appearance="default" />
          </div>
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
            <span className="font-medium">Notifications</span>
            <Badge label={12} appearance="primary" />
          </div>
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
            <span className="font-medium">Tasks</span>
            <Badge label={99} appearance="important" />
          </div>
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
            <span className="font-medium">Alerts</span>
            <Badge label="99+" appearance="important" />
          </div>
        </div>
      </div>
      <div className="flex flex-col gap-4">
        <div className="text-sm font-semibold text-gray-700">Status Indicators</div>
        <div className="flex flex-wrap gap-3">
          <div className="flex items-center gap-2">
            <span className="text-sm">Active Users:</span>
            <Badge label={42} appearance="added" />
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm">Pending:</span>
            <Badge label={7} appearance="important" />
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm">Completed:</span>
            <Badge label={128} appearance="primary" />
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm">Removed:</span>
            <Badge label={5} appearance="removed" />
          </div>
        </div>
      </div>
      <div className="flex flex-col gap-4">
        <div className="text-sm font-semibold text-gray-700">Button Badges</div>
        <div className="flex flex-wrap gap-3">
          <button className="px-4 py-2 bg-blue-600 text-white rounded flex items-center gap-2">
            Inbox
            <Badge label={5} appearance="primaryInverted" />
          </button>
          <button className="px-4 py-2 bg-gray-200 text-gray-800 rounded flex items-center gap-2">
            Updates
            <Badge label={12} appearance="default" />
          </button>
          <button className="px-4 py-2 bg-red-100 text-red-800 rounded flex items-center gap-2">
            Issues
            <Badge label={3} appearance="important" />
          </button>
        </div>
      </div>
    </div>
  ),
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
  render: () => (
    <div className="flex flex-col items-center justify-center p-4 gap-4">
      <div className="flex items-center gap-2">
        <span>Default</span>
        <Badge label={25} />
      </div>
      <div className="flex items-center gap-2">
        <span>Custom Class</span>
        <Badge label={25} className="opacity-75" />
      </div>
    </div>
  ),
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
  render: () => (
    <div className="flex flex-col gap-8 p-6">
      <div className="grid grid-cols-2 gap-6">
        <div className="flex flex-col gap-3">
          <div className="text-sm font-mono text-gray-600 font-semibold">appearance=default</div>
          <div className="flex items-center gap-3 flex-wrap">
            <Badge label={0} appearance="default" />
            <Badge label={5} appearance="default" />
            <Badge label={25} appearance="default" />
            <Badge label={99} appearance="default" />
            <Badge label="99+" appearance="default" />
          </div>
        </div>
        <div className="flex flex-col gap-3">
          <div className="text-sm font-mono text-gray-600 font-semibold">appearance=primary</div>
          <div className="flex items-center gap-3 flex-wrap">
            <Badge label={0} appearance="primary" />
            <Badge label={5} appearance="primary" />
            <Badge label={25} appearance="primary" />
            <Badge label={99} appearance="primary" />
            <Badge label="New" appearance="primary" />
          </div>
        </div>
        <div className="flex flex-col gap-3">
          <div className="text-sm font-mono text-gray-600 font-semibold">appearance=primaryInverted</div>
          <div className="flex items-center gap-3 flex-wrap bg-gray-100 p-3 rounded">
            <Badge label={0} appearance="primaryInverted" />
            <Badge label={5} appearance="primaryInverted" />
            <Badge label={25} appearance="primaryInverted" />
            <Badge label={99} appearance="primaryInverted" />
            <Badge label="!" appearance="primaryInverted" />
          </div>
        </div>
        <div className="flex flex-col gap-3">
          <div className="text-sm font-mono text-gray-600 font-semibold">appearance=important</div>
          <div className="flex items-center gap-3 flex-wrap">
            <Badge label={1} appearance="important" />
            <Badge label={5} appearance="important" />
            <Badge label={25} appearance="important" />
            <Badge label={99} appearance="important" />
            <Badge label="!" appearance="important" />
          </div>
        </div>
        <div className="flex flex-col gap-3">
          <div className="text-sm font-mono text-gray-600 font-semibold">appearance=added</div>
          <div className="flex items-center gap-3 flex-wrap">
            <Badge label={1} appearance="added" />
            <Badge label={5} appearance="added" />
            <Badge label={25} appearance="added" />
            <Badge label={99} appearance="added" />
            <Badge label="New" appearance="added" />
          </div>
        </div>
        <div className="flex flex-col gap-3">
          <div className="text-sm font-mono text-gray-600 font-semibold">appearance=removed</div>
          <div className="flex items-center gap-3 flex-wrap">
            <Badge label={1} appearance="removed" />
            <Badge label={5} appearance="removed" />
            <Badge label={25} appearance="removed" />
            <Badge label={99} appearance="removed" />
            <Badge label="Del" appearance="removed" />
          </div>
        </div>
      </div>
    </div>
  ),
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
