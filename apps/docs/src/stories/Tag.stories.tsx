import { type SduiLayoutDocument, SduiLayoutRenderer } from '@lodado/sdui-template'
import { sduiComponents,Tag } from '@lodado/sdui-template-component'
import type { Meta, StoryObj } from '@storybook/react-vite'
import React from 'react'

const meta: Meta<typeof Tag> = {
  title: 'Shared/UI/Tag',
  component: Tag,
  tags: ['autodocs'],
  argTypes: {
    text: {
      control: 'text',
      description: 'Tag text content',
      table: {
        defaultValue: { summary: 'Tag' },
      },
    },
    color: {
      control: 'select',
      options: ['standard', 'blue', 'red', 'yellow', 'green', 'teal', 'purple', 'grey', 'lime', 'orange', 'magenta'],
      description: 'Tag color variant',
      table: {
        defaultValue: { summary: 'standard' },
      },
    },
    isRemovable: {
      control: 'boolean',
      description: 'Whether to show remove button',
      table: {
        defaultValue: { summary: 'false' },
      },
    },
    isLink: {
      control: 'boolean',
      description: 'Whether to render as link style with underline',
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

The **Tag** component follows the Atlassian Design System (ADS) specifications. A tag labels UI objects for quick recognition and navigation.

## Color Variants

| Color | Description |
|-------|-------------|
| \`standard\` | Default neutral gray |
| \`blue\` | Blue accent - Information |
| \`red\` | Red accent - Danger/Error |
| \`yellow\` | Yellow accent - Warning |
| \`green\` | Green accent - Success |
| \`teal\` | Teal accent |
| \`purple\` | Purple accent |
| \`grey\` | Grey/muted |
| \`lime\` | Lime accent |
| \`orange\` | Orange accent |
| \`magenta\` | Magenta accent |

## Features

- **isRemovable**: Shows a close button for removing tags
- **isLink**: Renders with underline for link-style tags
- **iconBefore**: Supports icon before text

## Integration

- ✅ **SDUI template system** integration
- ✅ **Keyboard navigation** (Backspace/Delete to remove)
- ✅ **Accessibility features** built-in
        `,
      },
    },
  },
}

export default meta
type Story = StoryObj<typeof Tag>

// ============================================================================
// Basic Stories with Controls
// ============================================================================

export const Playground: Story = {
  args: {
    text: 'Tag',
    color: 'standard',
    isRemovable: false,
    isLink: false,
  },
  parameters: {
    docs: {
      description: {
        story: `
## Interactive Playground

Use the controls panel to experiment with different tag configurations.

### Available Controls

- **text**: Tag text content
- **color**: 11 color variants
- **isRemovable**: Show/hide remove button
- **isLink**: Enable link style
        `,
      },
    },
  },
}

// ============================================================================
// Color Variants
// ============================================================================

export const ColorStandard: Story = {
  render: () => (
    <div className="flex items-center justify-center p-4 gap-4">
      <Tag text="Standard" color="standard" />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Default neutral gray tag.',
      },
    },
  },
}

export const ColorBlue: Story = {
  render: () => (
    <div className="flex items-center justify-center p-4 gap-4">
      <Tag text="Blue" color="blue" />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Blue accent tag for information.',
      },
    },
  },
}

export const ColorRed: Story = {
  render: () => (
    <div className="flex items-center justify-center p-4 gap-4">
      <Tag text="Red" color="red" />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Red accent tag for danger/error.',
      },
    },
  },
}

export const AllColors: Story = {
  render: () => {
    const colors = [
      'standard',
      'blue',
      'red',
      'yellow',
      'green',
      'teal',
      'purple',
      'grey',
      'lime',
      'orange',
      'magenta',
    ] as const

    return (
      <div className="flex flex-wrap items-center justify-center p-4 gap-2">
        {colors.map((color) => (
          <Tag key={color} text={color.charAt(0).toUpperCase() + color.slice(1)} color={color} />
        ))}
      </div>
    )
  },
  parameters: {
    docs: {
      description: {
        story: `
## All Color Variants

Visual comparison of all 11 color variants.
        `,
      },
    },
  },
}

// ============================================================================
// Removable Tags
// ============================================================================

export const Removable: Story = {
  render: () => {
    const [tags, setTags] = React.useState(['React', 'TypeScript', 'Tailwind'])

    const handleRemove = (tag: string) => {
      setTags((prev) => prev.filter((t) => t !== tag))
    }

    return (
      <div className="flex flex-col items-center justify-center p-4 gap-4">
        <div className="flex flex-wrap gap-2">
          {tags.map((tag) => (
            <Tag key={tag} text={tag} color="blue" isRemovable onRemove={() => handleRemove(tag)} />
          ))}
        </div>
        {tags.length === 0 && <p className="text-gray-500">All tags removed</p>}
        {tags.length < 3 && (
          <button
            type="button"
            className="text-sm text-blue-500 underline"
            onClick={() => setTags(['React', 'TypeScript', 'Tailwind'])}
          >
            Reset tags
          </button>
        )}
      </div>
    )
  },
  parameters: {
    docs: {
      description: {
        story: `
## Removable Tags

Tags with a close button. Click the X to remove a tag.
        `,
      },
    },
  },
}

// ============================================================================
// Link Tags
// ============================================================================

export const LinkStyle: Story = {
  render: () => (
    <div className="flex items-center justify-center p-4 gap-4">
      <Tag text="Link Tag" color="blue" isLink onClick={() => alert('Tag clicked!')} />
      <Tag text="With href" color="purple" isLink href="https://atlassian.design" />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: `
## Link Style Tags

Tags rendered with underline text, indicating clickable links.
        `,
      },
    },
  },
}

// ============================================================================
// With Icon
// ============================================================================

export const WithIcon: Story = {
  render: () => (
    <div className="flex items-center justify-center p-4 gap-4">
      <Tag
        text="Settings"
        color="standard"
        iconBefore={
          <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full">
            <path d="M12 15a3 3 0 100-6 3 3 0 000 6z" />
            <path
              fillRule="evenodd"
              d="M1.323 11.447C2.811 6.976 7.028 3.75 12.001 3.75c4.97 0 9.185 3.223 10.675 7.69.12.362.12.752 0 1.113-1.487 4.471-5.705 7.697-10.677 7.697-4.97 0-9.186-3.223-10.675-7.69a1.762 1.762 0 010-1.113zM17.25 12a5.25 5.25 0 11-10.5 0 5.25 5.25 0 0110.5 0z"
              clipRule="evenodd"
            />
          </svg>
        }
      />
      <Tag
        text="User"
        color="blue"
        iconBefore={
          <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full">
            <path
              fillRule="evenodd"
              d="M7.5 6a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM3.751 20.105a8.25 8.25 0 0116.498 0 .75.75 0 01-.437.695A18.683 18.683 0 0112 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 01-.437-.695z"
              clipRule="evenodd"
            />
          </svg>
        }
      />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: `
## Tags with Icons

Tags can have an icon before the text using the \`iconBefore\` prop.
        `,
      },
    },
  },
}

// ============================================================================
// Combined Features
// ============================================================================

export const Combined: Story = {
  render: () => (
    <div className="flex flex-wrap items-center justify-center p-4 gap-2">
      <Tag
        text="Removable with Icon"
        color="green"
        isRemovable
        iconBefore={
          <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full">
            <path
              fillRule="evenodd"
              d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm13.36-1.814a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z"
              clipRule="evenodd"
            />
          </svg>
        }
        onRemove={() => alert('Remove clicked!')}
      />
      <Tag text="Link + Removable" color="purple" isLink isRemovable onRemove={() => alert('Remove clicked!')} />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: `
## Combined Features

Tags can combine multiple features like icons, removable, and link style.
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
        attributes: { className: 'flex flex-wrap items-center justify-center p-4 gap-2' },
        children: [
          {
            id: 'tag-1',
            type: 'Tag',
            state: { text: 'Standard', color: 'standard' },
          },
          {
            id: 'tag-2',
            type: 'Tag',
            state: { text: 'Blue', color: 'blue' },
          },
          {
            id: 'tag-3',
            type: 'Tag',
            state: { text: 'Red', color: 'red' },
          },
          {
            id: 'tag-4',
            type: 'Tag',
            state: { text: 'Green', color: 'green' },
          },
          {
            id: 'tag-5',
            type: 'Tag',
            state: { text: 'Purple', color: 'purple' },
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

Tags rendered via SDUI document structure.

\`\`\`json
{
  "id": "tag-1",
  "type": "Tag",
  "state": { "text": "Standard", "color": "standard" }
}
\`\`\`
        `,
      },
    },
  },
}

// ============================================================================
// Colors Matrix
// ============================================================================

export const ColorsMatrix: Story = {
  render: () => {
    const colors = [
      'standard',
      'blue',
      'red',
      'yellow',
      'green',
      'teal',
      'purple',
      'grey',
      'lime',
      'orange',
      'magenta',
    ] as const

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
            state: { text: 'Tag Colors Matrix' },
            attributes: { className: 'text-xl font-bold' },
          },
          {
            id: 'subtitle',
            type: 'Span',
            state: { text: '11 Color Variants' },
            attributes: { className: 'text-sm text-gray-600 mb-4' },
          },
          {
            id: 'tags-grid',
            type: 'Div',
            attributes: { className: 'grid grid-cols-4 gap-4' },
            children: colors.map((color) => ({
              id: `tag-${color}`,
              type: 'Tag',
              state: {
                text: color.charAt(0).toUpperCase() + color.slice(1),
                color,
              },
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
## Complete Colors Matrix

All 11 tag color variants displayed in a grid via SDUI.
        `,
      },
    },
  },
}
