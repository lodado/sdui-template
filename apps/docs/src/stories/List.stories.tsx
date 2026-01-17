/* eslint-disable local-rules/no-console-log */
import { type SduiLayoutDocument, SduiLayoutRenderer } from '@lodado/sdui-template'
import { getListComponents,Icon, List } from '@lodado/sdui-template-component'
import type { Meta, StoryObj } from '@storybook/react-vite'
import React from 'react'

const meta: Meta<typeof List> = {
  title: 'Shared/UI/List',
  component: List,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `
## Overview

The **List** component is a compound component pattern for creating interactive navigation list items. It consists of an icon, content (title and description), and an arrow indicator.

## Architecture

Uses the **Compound Component pattern** to flexibly arrange:
- **Icon**: Circular colored background with icon (uses shared Icon component)
- **Content**: Container for title and description
- **Title**: Bold title text
- **Description**: Lighter description text
- **Arrow**: Right-pointing indicator

## Features

### Visual Design
- **Rounded corners**: Soft, modern appearance
- **Hover effects**: Interactive feedback
- **Icon colors**: Blue, green, purple, red, or default
- **Proper spacing**: Consistent gaps between elements

### Interactive States
- **Default**: Ready for interaction
- **Hover**: Background color change
- **Active**: Pressed state feedback
- **Disabled**: Non-interactive state

## Integration

- ✅ **SDUI template system** integration
- ✅ **Keyboard navigation** support
- ✅ **Accessibility features** built-in
- ✅ **ARIA attributes** for screen readers
- ✅ **Link support**: Can render as anchor tag

## Common Use Cases

- Navigation lists
- Action items
- Feature lists
- Learning guides
- Menu items
        `,
      },
    },
  },
}

export default meta
type Story = StoryObj<typeof List>

// Icon components
const BookIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M4 19.5C4 18.3954 4.89543 17.5 6 17.5H18C19.1046 17.5 20 18.3954 20 19.5C20 20.6046 19.1046 21.5 18 21.5H6C4.89543 21.5 4 20.6046 4 19.5Z"
      fill="white"
    />
    <path
      d="M6 2.5C5.44772 2.5 5 2.94772 5 3.5V16.5C5 17.0523 5.44772 17.5 6 17.5H18C18.5523 17.5 19 17.0523 19 16.5V3.5C19 2.94772 18.5523 2.5 18 2.5H6Z"
      fill="white"
    />
  </svg>
)

const BooksIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M4 19.5C4 18.3954 4.89543 17.5 6 17.5H18C19.1046 17.5 20 18.3954 20 19.5C20 20.6046 19.1046 21.5 18 21.5H6C4.89543 21.5 4 20.6046 4 19.5Z"
      fill="white"
    />
    <path
      d="M6 2.5C5.44772 2.5 5 2.94772 5 3.5V7.5H19V3.5C19 2.94772 18.5523 2.5 18 2.5H6Z"
      fill="white"
    />
    <path d="M5 9.5H19V16.5C19 17.0523 18.5523 17.5 18 17.5H6C5.44772 17.5 5 17.0523 5 16.5V9.5Z" fill="white" />
  </svg>
)

const TargetIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="12" cy="12" r="10" stroke="white" strokeWidth="2" fill="none" />
    <circle cx="12" cy="12" r="3" fill="white" />
  </svg>
)

const XIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M18 6L6 18M6 6L18 18"
      stroke="white"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
)

// Default story - Compound Pattern
export const Default: Story = {
  render: () => (
    <div className="p-4">
      <List onClick={() => console.log('Clicked')} className="w-[70vw]">
        <List.Icon color="blue">
          <BookIcon />
        </List.Icon>
        <List.Content>
          <List.Title>기사 읽기</List.Title>
          <List.Description>오늘의 추천 기사를 읽고 단어를 저장하세요</List.Description>
        </List.Content>
        <List.Arrow />
      </List>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: `
## Overview

The **default list configuration** demonstrates the basic compound component pattern.

## Structure

- **List.Icon**: Blue circular background with book icon (uses shared Icon component)
- **List.Content**: Contains title and description
- **List.Title**: Bold title text
- **List.Description**: Lighter description text
- **List.Arrow**: Right-pointing arrow indicator

## Usage

This is the recommended pattern for creating interactive list items with icons, text, and navigation indicators.
        `,
      },
    },
  },
}

// With Multiple Items
export const WithMultipleItems: Story = {
  render: () => {
    const items = [
      {
        id: 1,
        iconColor: 'blue' as const,
        title: '1. 기사 읽기',
        description: '오늘의 추천 기사를 읽고 단어를 저장하세요',
        icon: <BookIcon />,
      },
      {
        id: 2,
        iconColor: 'green' as const,
        title: '2. 단어장 확인',
        description: '저장한 단어들을 확인하고 관리하세요',
        icon: <BooksIcon />,
      },
      {
        id: 3,
        iconColor: 'purple' as const,
        title: '3. 퀴즈 풀기',
        description: '퀴즈로 학습 효과를 확인하세요',
        icon: <TargetIcon />,
      },
      {
        id: 4,
        iconColor: 'red' as const,
        title: '4. 오답 복습',
        description: '틀린 문제를 다시 풀어보세요',
        icon: <XIcon />,
      },
    ]

    return (
      <div className="p-4">
        <div className="flex flex-col gap-3">
          {items.map((item) => (
            <List key={item.id} onClick={() => console.log(`Clicked: ${item.title}`)} className="w-[70vw]">
              <List.Icon color={item.iconColor}>{item.icon}</List.Icon>
              <List.Content>
                <List.Title>{item.title}</List.Title>
                <List.Description>{item.description}</List.Description>
              </List.Content>
              <List.Arrow />
            </List>
          ))}
        </div>
      </div>
    )
  },
  parameters: {
    docs: {
      description: {
        story: `
## Overview

**With Multiple Items** demonstrates multiple list items in a vertical layout.

## Figma Design Recreation

This story demonstrates the "학습 가이드" (Learning Guide) section from the Figma design:

1. **기사 읽기** (Read Article) - Blue icon
2. **단어장 확인** (Check Vocabulary) - Green icon
3. **퀴즈 풀기** (Take Quiz) - Purple icon
4. **오답 복습** (Review Incorrect Answers) - Red icon

## Icon Colors

- **Blue**: Primary actions
- **Green**: Success/positive actions
- **Purple**: Special features
- **Red**: Important/critical actions

## Best Practices

- Use consistent icon styles
- Maintain color meaning
- Keep descriptions concise
- Ensure proper spacing
        `,
      },
    },
  },
}

// Interactive
export const Interactive: Story = {
  render: () => (
    <div className="p-4">
      <List
        onClick={(e) => {
          e.preventDefault()
          alert('List item clicked!')
        }}
        className="w-[70vw]"
      >
        <List.Icon color="blue">
          <BookIcon />
        </List.Icon>
        <List.Content>
          <List.Title>Interactive List Item</List.Title>
          <List.Description>Click me to see the interaction</List.Description>
        </List.Content>
        <List.Arrow />
      </List>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: `
## Overview

**Interactive** demonstrates click event handling in List components.

## Behavior

- **Click handler**: onClick prop receives click events
- **Event object**: Standard React MouseEvent
- **Prevent default**: Can prevent default behavior if needed

## Best Practices

- Provide clear feedback on interaction
- Handle loading states
- Consider navigation vs. action distinction
- Use href for navigation, onClick for actions

## When to Use

- Navigation links
- Action triggers
- Modal openers
- Form submissions
        `,
      },
    },
  },
}

// States
export const States: Story = {
  render: () => (
    <div className="p-4">
      <div className="flex flex-col gap-4">
        <div>
          <h3 className="mb-2 text-sm font-semibold">Default</h3>
          <List className="w-[70vw]">
            <List.Icon color="blue">
              <BookIcon />
            </List.Icon>
            <List.Content>
              <List.Title>Default State</List.Title>
              <List.Description>Ready for interaction</List.Description>
            </List.Content>
            <List.Arrow />
          </List>
        </div>

        <div>
          <h3 className="mb-2 text-sm font-semibold">Hover (hover to see)</h3>
          <List className="w-[70vw]">
            <List.Icon color="green">
              <BooksIcon />
            </List.Icon>
            <List.Content>
              <List.Title>Hover State</List.Title>
              <List.Description>Background changes on hover</List.Description>
            </List.Content>
            <List.Arrow />
          </List>
        </div>

        <div>
          <h3 className="mb-2 text-sm font-semibold">Disabled</h3>
          <List disabled className="w-[70vw]">
            <List.Icon color="purple">
              <TargetIcon />
            </List.Icon>
            <List.Content>
              <List.Title>Disabled State</List.Title>
              <List.Description>Non-interactive, reduced opacity</List.Description>
            </List.Content>
            <List.Arrow />
          </List>
        </div>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: `
## Overview

**States** demonstrates the different interactive states of List components.

## Interactive States

### 1. Default
- Initial state
- Ready for interaction
- Standard appearance

### 2. Hover
- Mouse over state
- Background color change
- Indicates interactivity

### 3. Disabled
- Non-interactive state
- Reduced opacity (50%)
- No pointer events
- Clear "unavailable" indication

## Consistency

All states maintain **consistent visual behavior** while providing clear feedback to users about the component's current state.
        `,
      },
    },
  },
}

// Compound Pattern
export const CompoundPattern: Story = {
  render: () => (
    <div className="p-4">
      <div className="space-y-4">
        <div>
          <h3 className="mb-2 text-sm font-semibold">Basic Structure</h3>
          <List className="w-[70vw]">
            <List.Icon color="blue">
              <BookIcon />
            </List.Icon>
            <List.Content>
              <List.Title>Compound Pattern</List.Title>
              <List.Description>Flexible component composition</List.Description>
            </List.Content>
            <List.Arrow />
          </List>
        </div>

        <div>
          <h3 className="mb-2 text-sm font-semibold">Without Arrow</h3>
          <List className="w-[70vw]">
            <List.Icon color="green">
              <BooksIcon />
            </List.Icon>
            <List.Content>
              <List.Title>No Arrow</List.Title>
              <List.Description>Arrow is optional</List.Description>
            </List.Content>
          </List>
        </div>

        <div>
          <h3 className="mb-2 text-sm font-semibold">Title Only</h3>
          <List className="w-[70vw]">
            <List.Icon color="purple">
              <TargetIcon />
            </List.Icon>
            <List.Content>
              <List.Title>Title Only</List.Title>
            </List.Content>
            <List.Arrow />
          </List>
        </div>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: `
## Overview

**Compound Pattern** demonstrates the flexibility of the List compound component pattern.

## Flexibility

The compound pattern allows you to:
- **Include or omit** any sub-component
- **Customize** individual parts
- **Compose** different layouts
- **Maintain** consistent styling

## Examples Shown

1. **Basic Structure**: All components included
2. **Without Arrow**: Arrow is optional
3. **Title Only**: Description is optional

## Best Practices

- Use consistent patterns across your app
- Only include necessary components
- Maintain visual hierarchy
- Keep descriptions concise when used
        `,
      },
    },
  },
}

// SDUI Integration
export const SduiIntegration: Story = {
  render: () => {
    const document: SduiLayoutDocument = {
      version: '1.0.0',
      root: {
        id: 'root',
        type: 'Div',
        attributes: {
          className: 'p-4',
        },
        children: [
          {
            id: 'list-sdui',
            type: 'List',
            state: {
              disabled: false,
            },
            attributes: {
              className: 'w-[70vw]',
            },
            children: [
              {
                id: 'list-sdui-icon',
                type: 'Div',
                attributes: {
                  className: 'flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-blue-500',
                },
                children: [
                  {
                    id: 'list-sdui-icon-svg',
                    type: 'Span',
                    state: {
                      text: '📖',
                    },
                    attributes: {
                      className: 'text-white',
                    },
                  },
                ],
              },
              {
                id: 'list-sdui-content',
                type: 'Div',
                attributes: {
                  className: 'flex flex-1 flex-col gap-1',
                },
                children: [
                  {
                    id: 'list-sdui-title',
                    type: 'Span',
                    state: {
                      text: 'SDUI List Example',
                    },
                    attributes: {
                      className: 'text-base font-semibold text-[var(--color-text-default)]',
                    },
                  },
                  {
                    id: 'list-sdui-description',
                    type: 'Span',
                    state: {
                      text: 'This list item is rendered via SDUI Layout Document.',
                    },
                    attributes: {
                      className: 'text-sm text-[var(--color-text-subtle)]',
                    },
                  },
                ],
              },
            ],
          },
        ],
      },
    }

    return <SduiLayoutRenderer document={document} components={getListComponents()} />
  },
  parameters: {
    docs: {
      description: {
        story: `
## Overview

**SDUI Integration** demonstrates how List component works with the Server-Driven UI template system.

## How It Works

1. **Layout Document**: List structure is defined in JSON
2. **Component Factory**: getListComponents() provides component mapping
3. **Renderer**: SduiLayoutRenderer renders the document
4. **State Management**: List state is managed via SDUI subscription

## Benefits

- **Server-driven**: Content structure from server
- **Type-safe**: Zod schema validation
- **Dynamic**: State updates without page reload
- **Flexible**: Easy to modify structure

## Use Cases

- Dynamic navigation lists
- User-customizable menus
- A/B testing layouts
- Content management systems
        `,
      },
    },
  },
}
