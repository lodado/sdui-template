import { type SduiLayoutDocument, SduiLayoutRenderer } from '@lodado/sdui-template'
import { Button, getButtonComponents } from '@lodado/sdui-template-component'
import type { Meta, StoryObj } from '@storybook/react-vite'
import React from 'react'
 
const meta: Meta<typeof Button> = {
  title: 'Shared/UI/Button',
  component: Button,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `
## Overview

The **Button** component is an interactive element that triggers specific actions when clicked. It's a fundamental UI component used throughout the application for user interactions.

## Features

### Visual Variants
- **Filled**: Solid background, highest emphasis
- **Outline**: Transparent with border, medium emphasis
- **Text**: No background/border, lowest emphasis

### Sizes
- **L (Large)**: 40px height, 16px text
- **M (Medium)**: 32px height, 14px text (default)
- **S (Small)**: 24px height, 12px text (text buttons only)

### Types
- **Primary**: Main action color scheme
- **Secondary**: Alternative action color scheme

## Integration

- ✅ **SDUI template system** integration
- ✅ **Keyboard navigation** (Enter & Space keys)
- ✅ **Accessibility features** built-in
- ✅ **ARIA attributes** for screen readers

## Common Use Cases

- Form submissions
- Navigation actions
- Dialog confirmations
- Feature toggles
        `,
      },
    },
  },
}

export default meta
type Story = StoryObj<typeof Button>

// Default story
export const Default: Story = {
  render: () => {
    const document: SduiLayoutDocument = {
      version: '1.0.0',
      root: {
        id: 'root',
        type: 'Div',
        attributes: {
          className: 'flex items-center justify-center p-4',
        },
        children: [
          {
            id: 'button-1',
            type: 'Button',
            state: {
              buttonStyle: 'filled',
              size: 'M',
              buttonType: 'primary',
              disabled: false,
            },
            attributes: {
              type: 'button',
            },
            children: [
              {
                id: 'button-text',
                type: 'Span',
                state: {
                  text: 'Button',
                },
              },
            ],
          },
        ],
      },
    }

    return <SduiLayoutRenderer document={document} components={getButtonComponents()} />
  },
  parameters: {
    docs: {
      description: {
        story: `
## Overview

The **default button configuration** represents the most commonly used variant in the design system.

## Configuration

- **Style**: Filled
- **Size**: Medium (M)
- **Type**: Primary

## Usage

This is the recommended starting point for most button implementations. Use this variant for primary actions that need clear visual emphasis.
        `,
      },
    },
  },
}

// Style variants
export const Filled: Story = {
  render: () => {
    const document: SduiLayoutDocument = {
      version: '1.0.0',
      root: {
        id: 'root',
        type: 'Div',
        attributes: {
          className: 'flex items-center justify-center p-4',
        },
        children: [
          {
            id: 'button-1',
            type: 'Button',
            state: {
              buttonStyle: 'filled',
              size: 'M',
              buttonType: 'primary',
              disabled: false,
            },
            attributes: {
              type: 'button',
            },
            children: [
              {
                id: 'button-text',
                type: 'Span',
                state: {
                  text: 'Filled Button',
                },
              },
            ],
          },
        ],
      },
    }

    return <SduiLayoutRenderer document={document} components={getButtonComponents()} />
  },
  parameters: {
    docs: {
      description: {
        story: `
## Overview

**Filled buttons** feature a solid background color and provide the highest visual emphasis among all button styles.

## Characteristics

- Solid background color
- Highest visual weight
- Strong call-to-action presence

## Best Practices

- Use for **primary actions** only
- Limit to **1-2 per screen** to maintain hierarchy
- Reserve for the most important user actions

## When to Use

- Submit forms
- Confirm critical actions
- Primary navigation
        `,
      },
    },
  },
}

export const Outline: Story = {
  render: () => {
    const document: SduiLayoutDocument = {
      version: '1.0.0',
      root: {
        id: 'root',
        type: 'Div',
        attributes: {
          className: 'flex items-center justify-center p-4',
        },
        children: [
          {
            id: 'button-1',
            type: 'Button',
            state: {
              buttonStyle: 'outline',
              size: 'M',
              buttonType: 'primary',
              disabled: false,
            },
            attributes: {
              type: 'button',
            },
            children: [
              {
                id: 'button-text',
                type: 'Span',
                state: {
                  text: 'Outline Button',
                },
              },
            ],
          },
        ],
      },
    }

    return <SduiLayoutRenderer document={document} components={getButtonComponents()} />
  },
  parameters: {
    docs: {
      description: {
        story: `
## Overview

**Outline buttons** feature a transparent background with a visible border, providing medium visual emphasis.

## Characteristics

- Transparent background
- Visible border
- Medium visual weight

## Best Practices

- Use for **secondary actions**
- Pair with filled buttons for hierarchy
- Suitable for cancel/dismiss actions

## When to Use

- Secondary form actions
- Cancel buttons
- Alternative navigation options
        `,
      },
    },
  },
}

export const Text: Story = {
  render: () => {
    const document: SduiLayoutDocument = {
      version: '1.0.0',
      root: {
        id: 'root',
        type: 'Div',
        attributes: {
          className: 'flex items-center justify-center p-4',
        },
        children: [
          {
            id: 'button-1',
            type: 'Button',
            state: {
              buttonStyle: 'text',
              size: 'M',
              buttonType: 'primary',
              disabled: false,
            },
            attributes: {
              type: 'button',
            },
            children: [
              {
                id: 'button-text',
                type: 'Span',
                state: {
                  text: 'Text Button',
                },
              },
            ],
          },
        ],
      },
    }

    return <SduiLayoutRenderer document={document} components={getButtonComponents()} />
  },
  parameters: {
    docs: {
      description: {
        story: `
## Overview

**Text buttons** have no background or border, relying solely on text color for visibility. They provide the least visual emphasis.

## Characteristics

- No background or border
- Lowest visual weight
- Minimal visual footprint

## Size Support

Unlike filled and outline buttons, text buttons support **all three sizes**:
- **L** (Large)
- **M** (Medium)
- **S** (Small)

## Best Practices

- Use for **tertiary actions**
- Ideal for less critical actions
- Great for compact UIs

## When to Use

- Tertiary actions
- Link-like buttons
- Compact interfaces
- Mobile-friendly designs
        `,
      },
    },
  },
}

// Sizes
export const SizeL: Story = {
  render: () => {
    const document: SduiLayoutDocument = {
      version: '1.0.0',
      root: {
        id: 'root',
        type: 'Div',
        attributes: {
          className: 'flex items-center justify-center p-4',
        },
        children: [
          {
            id: 'button-1',
            type: 'Button',
            state: {
              buttonStyle: 'filled',
              size: 'L',
              buttonType: 'primary',
              disabled: false,
            },
            attributes: {
              type: 'button',
            },
            children: [
              {
                id: 'button-text',
                type: 'Span',
                state: {
                  text: 'Size L',
                },
              },
            ],
          },
        ],
      },
    }

    return <SduiLayoutRenderer document={document} components={getButtonComponents()} />
  },
  parameters: {
    docs: {
      description: {
        story: `
## Overview

**Large buttons (Size L)** are the most prominent size, ideal for important call-to-action elements.

## Specifications

- **Height**: 40px
- **Text size**: 16px
- **Visual weight**: High

## Best Use Cases

- Hero section CTAs
- Primary user flows
- Landing page actions
- Mobile-friendly touch targets

## When to Use

Use Size L when you need maximum visibility and want to guide users toward the primary action.
        `,
      },
    },
  },
}

export const SizeM: Story = {
  render: () => {
    const document: SduiLayoutDocument = {
      version: '1.0.0',
      root: {
        id: 'root',
        type: 'Div',
        attributes: {
          className: 'flex items-center justify-center p-4',
        },
        children: [
          {
            id: 'button-1',
            type: 'Button',
            state: {
              buttonStyle: 'filled',
              size: 'M',
              buttonType: 'primary',
              disabled: false,
            },
            attributes: {
              type: 'button',
            },
            children: [
              {
                id: 'button-text',
                type: 'Span',
                state: {
                  text: 'Size M',
                },
              },
            ],
          },
        ],
      },
    }

    return <SduiLayoutRenderer document={document} components={getButtonComponents()} />
  },
  parameters: {
    docs: {
      description: {
        story: `
## Overview

**Medium buttons (Size M)** are the default size and the most versatile option for general use.

## Specifications

- **Height**: 32px
- **Text size**: 14px
- **Visual weight**: Medium

## Why Default?

- Balanced proportions
- Works well in most contexts
- Good readability
- Standard touch target size

## Best Use Cases

- Standard form buttons
- General UI actions
- Navigation elements
- Most common use cases
        `,
      },
    },
  },
}

export const SizeS: Story = {
  render: () => {
    const document: SduiLayoutDocument = {
      version: '1.0.0',
      root: {
        id: 'root',
        type: 'Div',
        attributes: {
          className: 'flex items-center justify-center p-4',
        },
        children: [
          {
            id: 'button-1',
            type: 'Button',
            state: {
              buttonStyle: 'text',
              size: 'S',
              buttonType: 'primary',
              disabled: false,
            },
            attributes: {
              type: 'button',
            },
            children: [
              {
                id: 'button-text',
                type: 'Span',
                state: {
                  text: 'Size S',
                },
              },
            ],
          },
        ],
      },
    }

    return <SduiLayoutRenderer document={document} components={getButtonComponents()} />
  },
  parameters: {
    docs: {
      description: {
        story: `
## Overview

**Small buttons (Size S)** provide a compact option for space-constrained interfaces.

## Specifications

- **Height**: 24px
- **Text size**: 12px
- **Visual weight**: Low

## Important Note

⚠️ **Size S is only available for text buttons**, not filled or outline buttons.

## Best Use Cases

- Compact toolbars
- Inline actions
- Dense interfaces
- Secondary actions in tight spaces

## When to Use

Use Size S when space is limited but you still need a clickable action element.
        `,
      },
    },
  },
}

// Types
export const Primary: Story = {
  render: () => {
    const document: SduiLayoutDocument = {
      version: '1.0.0',
      root: {
        id: 'root',
        type: 'Div',
        attributes: {
          className: 'flex items-center justify-center p-4',
        },
        children: [
          {
            id: 'button-1',
            type: 'Button',
            state: {
              buttonStyle: 'filled',
              size: 'M',
              buttonType: 'primary',
              disabled: false,
            },
            attributes: {
              type: 'button',
            },
            children: [
              {
                id: 'button-text',
                type: 'Span',
                state: {
                  text: 'Primary Button',
                },
              },
            ],
          },
        ],
      },
    }

    return <SduiLayoutRenderer document={document} components={getButtonComponents()} />
  },
  parameters: {
    docs: {
      description: {
        story: `
## Overview

**Primary buttons** use the primary color scheme from the design system, indicating the most important action.

## Characteristics

- Primary brand color
- Highest priority indication
- Main call-to-action

## Best Practices

- Use for **the most important action** on a page
- Typically only **one per screen**
- Should be visually distinct from secondary buttons

## Common Use Cases

- Submit forms
- Save changes
- Confirm actions
- Primary navigation
        `,
      },
    },
  },
}

export const Secondary: Story = {
  render: () => {
    const document: SduiLayoutDocument = {
      version: '1.0.0',
      root: {
        id: 'root',
        type: 'Div',
        attributes: {
          className: 'flex items-center justify-center p-4',
        },
        children: [
          {
            id: 'button-1',
            type: 'Button',
            state: {
              buttonStyle: 'filled',
              size: 'M',
              buttonType: 'secondary',
              disabled: false,
            },
            attributes: {
              type: 'button',
            },
            children: [
              {
                id: 'button-text',
                type: 'Span',
                state: {
                  text: 'Secondary Button',
                },
              },
            ],
          },
        ],
      },
    }

    return <SduiLayoutRenderer document={document} components={getButtonComponents()} />
  },
  parameters: {
    docs: {
      description: {
        story: `
## Overview

**Secondary buttons** use the secondary color scheme, indicating important but less critical actions.

## Characteristics

- Secondary brand color
- Medium priority indication
- Alternative action option

## Best Practices

- Use alongside primary buttons
- Provides alternative actions
- Maintains visual hierarchy

## Common Use Cases

- Cancel actions
- Alternative options
- Secondary form actions
- Additional navigation paths
        `,
      },
    },
  },
}

// States
export const Disabled: Story = {
  render: () => {
    const document: SduiLayoutDocument = {
      version: '1.0.0',
      root: {
        id: 'root',
        type: 'Div',
        attributes: {
          className: 'flex items-center justify-center p-4',
        },
        children: [
          {
            id: 'button-1',
            type: 'Button',
            state: {
              buttonStyle: 'filled',
              size: 'M',
              buttonType: 'primary',
              disabled: true,
            },
            attributes: {
              type: 'button',
            },
            children: [
              {
                id: 'button-text',
                type: 'Span',
                state: {
                  text: 'Disabled Button',
                },
              },
            ],
          },
        ],
      },
    }

    return <SduiLayoutRenderer document={document} components={getButtonComponents()} />
  },
  parameters: {
    docs: {
      description: {
        story: `
## Overview

**Disabled buttons** are non-interactive elements that indicate an action is currently unavailable.

## Visual Characteristics

- Reduced opacity (50%)
- Non-clickable state
- Maintains visual style
- Clear "unavailable" indication

## Behavior

- ❌ Cannot be clicked
- ❌ Keyboard navigation disabled
- ❌ No hover/press states
- ✅ Visual style preserved

## When to Use

- Form validation pending
- Permission restrictions
- Loading states
- Conditional availability

## Best Practices

- Provide clear feedback about why disabled
- Consider showing tooltip explaining restriction
- Re-enable when conditions are met
        `,
      },
    },
  },
}

// All Combinations - Filled
export const FilledCombinations: Story = {
  render: () => {
    const document: SduiLayoutDocument = {
      version: '1.0.0',
      root: {
        id: 'root',
        type: 'Div',
        attributes: {
          className: 'flex flex-col gap-4 p-6',
        },
        children: [
          {
            id: 'title',
            type: 'Span',
            state: {
              text: 'Filled Style - All Combinations',
            },
            attributes: {
              className: 'text-lg font-bold mb-4',
            },
          },
          {
            id: 'buttons-container',
            type: 'Div',
            attributes: {
              className: 'flex flex-wrap gap-4',
            },
            children: [
              ...(['L', 'M'] as const).flatMap((size) =>
                (['primary', 'secondary'] as const).map((buttonType, index) => ({
                  id: `button-filled-${size}-${buttonType}`,
                  type: 'Button',
                  state: {
                    buttonStyle: 'filled' as const,
                    size,
                    buttonType,
                  },
                  children: [
                    {
                      id: `button-text-filled-${size}-${buttonType}`,
                      type: 'Span',
                      state: {
                        text: `Filled ${size} ${buttonType}`,
                      },
                    },
                  ],
                })),
              ),
            ],
          },
        ],
      },
    }

    return <SduiLayoutRenderer document={document} components={getButtonComponents()} />
  },
  parameters: {
    docs: {
      description: {
        story: `
## Overview

Displays **all available combinations** of filled button style variants.

## Available Combinations

Filled buttons support:
- **2 sizes**: L, M
- **2 types**: Primary, Secondary
- **Total**: 4 combinations

## Combinations Shown

1. Filled L Primary
2. Filled L Secondary
3. Filled M Primary
4. Filled M Secondary

## Usage

Use this reference to see all filled button options at a glance and choose the appropriate combination for your use case.
        `,
      },
    },
  },
}

// All Combinations - Outline
export const OutlineCombinations: Story = {
  render: () => {
    const document: SduiLayoutDocument = {
      version: '1.0.0',
      root: {
        id: 'root',
        type: 'Div',
        attributes: {
          className: 'flex flex-col gap-4 p-6',
        },
        children: [
          {
            id: 'title',
            type: 'Span',
            state: {
              text: 'Outline Style - All Combinations',
            },
            attributes: {
              className: 'text-lg font-bold mb-4',
            },
          },
          {
            id: 'buttons-container',
            type: 'Div',
            attributes: {
              className: 'flex flex-wrap gap-4',
            },
            children: [
              ...(['L', 'M'] as const).flatMap((size) =>
                (['primary', 'secondary'] as const).map((buttonType) => ({
                  id: `button-outline-${size}-${buttonType}`,
                  type: 'Button',
                  state: {
                    buttonStyle: 'outline' as const,
                    size,
                    buttonType,
                  },
                  children: [
                    {
                      id: `button-text-outline-${size}-${buttonType}`,
                      type: 'Span',
                      state: {
                        text: `Outline ${size} ${buttonType}`,
                      },
                    },
                  ],
                })),
              ),
            ],
          },
        ],
      },
    }

    return <SduiLayoutRenderer document={document} components={getButtonComponents()} />
  },
  parameters: {
    docs: {
      description: {
        story: `
## Overview

Displays **all available combinations** of outline button style variants.

## Available Combinations

Outline buttons support:
- **2 sizes**: L, M
- **2 types**: Primary, Secondary
- **Total**: 4 combinations

## Combinations Shown

1. Outline L Primary
2. Outline L Secondary
3. Outline M Primary
4. Outline M Secondary

## Usage

Use this reference to see all outline button options and choose the appropriate combination for secondary actions.
        `,
      },
    },
  },
}

// All Combinations - Text
export const TextCombinations: Story = {
  render: () => {
    const document: SduiLayoutDocument = {
      version: '1.0.0',
      root: {
        id: 'root',
        type: 'Div',
        attributes: {
          className: 'flex flex-col gap-4 p-6',
        },
        children: [
          {
            id: 'title',
            type: 'Span',
            state: {
              text: 'Text Style - All Combinations',
            },
            attributes: {
              className: 'text-lg font-bold mb-4',
            },
          },
          {
            id: 'buttons-container',
            type: 'Div',
            attributes: {
              className: 'flex flex-wrap gap-4',
            },
            children: [
              ...(['L', 'M', 'S'] as const).flatMap((size) =>
                (['primary', 'secondary'] as const).map((buttonType) => ({
                  id: `button-text-${size}-${buttonType}`,
                  type: 'Button',
                  state: {
                    buttonStyle: 'text' as const,
                    size,
                    buttonType,
                  },
                  children: [
                    {
                      id: `button-text-text-${size}-${buttonType}`,
                      type: 'Span',
                      state: {
                        text: `Text ${size} ${buttonType}`,
                      },
                    },
                  ],
                })),
              ),
            ],
          },
        ],
      },
    }

    return <SduiLayoutRenderer document={document} components={getButtonComponents()} />
  },
  parameters: {
    docs: {
      description: {
        story: `
## Overview

Displays **all available combinations** of text button style variants.

## Available Combinations

Text buttons support:
- **3 sizes**: L, M, S (unique!)
- **2 types**: Primary, Secondary
- **Total**: 6 combinations

## Unique Feature

✨ **Text buttons are the only style** that supports the small (S) size variant.

## Combinations Shown

1. Text L Primary
2. Text L Secondary
3. Text M Primary
4. Text M Secondary
5. Text S Primary
6. Text S Secondary

## Usage

Use this reference to see all text button options, including the compact Size S variant.
        `,
      },
    },
  },
}

// States Matrix
export const StatesMatrix: Story = {
  render: () => {
    const document: SduiLayoutDocument = {
      version: '1.0.0',
      root: {
        id: 'root',
        type: 'Div',
        attributes: {
          className: 'flex flex-col gap-6 p-6',
        },
        children: [
          {
            id: 'title',
            type: 'Span',
            state: {
              text: 'States - Default, Hover, Press, Disabled',
            },
            attributes: {
              className: 'text-lg font-bold mb-4',
            },
          },
          ...(['filled', 'outline', 'text'] as const).map((buttonStyle) => ({
            id: `style-${buttonStyle}`,
            type: 'Div',
            attributes: {
              className: 'flex flex-col gap-2',
            },
            children: [
              {
                id: `style-title-${buttonStyle}`,
                type: 'Span',
                state: {
                  text: `${buttonStyle.charAt(0).toUpperCase() + buttonStyle.slice(1)} Style`,
                },
                attributes: {
                  className: 'text-base font-semibold capitalize',
                },
              },
              {
                id: `buttons-row-${buttonStyle}`,
                type: 'Div',
                attributes: {
                  className: 'flex gap-4 items-center',
                },
                children: [
                  {
                    id: `button-default-${buttonStyle}`,
                    type: 'Div',
                    attributes: {
                      className: 'flex flex-col gap-1',
                    },
                    children: [
                      {
                        id: `label-default-${buttonStyle}`,
                        type: 'Span',
                        state: {
                          text: 'Default',
                        },
                        attributes: {
                          className: 'text-xs mb-1',
                        },
                      },
                      {
                        id: `button-default-btn-${buttonStyle}`,
                        type: 'Button',
                        state: {
                          buttonStyle,
                          size: 'M',
                          buttonType: 'primary',
                        },
                        children: [
                          {
                            id: `button-text-default-${buttonStyle}`,
                            type: 'Span',
                            state: {
                              text: 'Label',
                            },
                          },
                        ],
                      },
                    ],
                  },
                  {
                    id: `button-hover-${buttonStyle}`,
                    type: 'Div',
                    attributes: {
                      className: 'flex flex-col gap-1',
                    },
                    children: [
                      {
                        id: `label-hover-${buttonStyle}`,
                        type: 'Span',
                        state: {
                          text: 'Hover (hover to see)',
                        },
                        attributes: {
                          className: 'text-xs mb-1',
                        },
                      },
                      {
                        id: `button-hover-btn-${buttonStyle}`,
                        type: 'Button',
                        state: {
                          buttonStyle,
                          size: 'M',
                          buttonType: 'primary',
                        },
                        children: [
                          {
                            id: `button-text-hover-${buttonStyle}`,
                            type: 'Span',
                            state: {
                              text: 'Label',
                            },
                          },
                        ],
                      },
                    ],
                  },
                  {
                    id: `button-press-${buttonStyle}`,
                    type: 'Div',
                    attributes: {
                      className: 'flex flex-col gap-1',
                    },
                    children: [
                      {
                        id: `label-press-${buttonStyle}`,
                        type: 'Span',
                        state: {
                          text: 'Press (click to see)',
                        },
                        attributes: {
                          className: 'text-xs mb-1',
                        },
                      },
                      {
                        id: `button-press-btn-${buttonStyle}`,
                        type: 'Button',
                        state: {
                          buttonStyle,
                          size: 'M',
                          buttonType: 'primary',
                        },
                        children: [
                          {
                            id: `button-text-press-${buttonStyle}`,
                            type: 'Span',
                            state: {
                              text: 'Label',
                            },
                          },
                        ],
                      },
                    ],
                  },
                  {
                    id: `button-disabled-${buttonStyle}`,
                    type: 'Div',
                    attributes: {
                      className: 'flex flex-col gap-1',
                    },
                    children: [
                      {
                        id: `label-disabled-${buttonStyle}`,
                        type: 'Span',
                        state: {
                          text: 'Disabled',
                        },
                        attributes: {
                          className: 'text-xs mb-1',
                        },
                      },
                      {
                        id: `button-disabled-btn-${buttonStyle}`,
                        type: 'Button',
                        state: {
                          buttonStyle,
                          size: 'M',
                          buttonType: 'primary',
                        },
                        attributes: {
                          disabled: true,
                        },
                        children: [
                          {
                            id: `button-text-disabled-${buttonStyle}`,
                            type: 'Span',
                            state: {
                              text: 'Label',
                            },
                          },
                        ],
                      },
                    ],
                  },
                ],
              },
            ],
          })),
        ],
      },
    }

    return <SduiLayoutRenderer document={document} components={getButtonComponents()} />
  },
  parameters: {
    docs: {
      description: {
        story: `
## Overview

Demonstrates the **interactive states** of buttons across all three styles (filled, outline, text).

## Interactive States

### 1. Default
- Initial state
- Ready for interaction
- Standard appearance

### 2. Hover
- Mouse over state
- Visual feedback on hover
- Indicates interactivity

### 3. Press/Active
- Click/press state
- Immediate feedback
- Confirms interaction

### 4. Disabled
- Non-interactive state
- Reduced opacity
- Clear "unavailable" indication

## Consistency

All styles maintain **consistent state behavior** while using their respective color schemes, ensuring a cohesive user experience across all button variants.

## Try It

- **Hover** over buttons to see hover states
- **Click** buttons to see press/active states
- Observe disabled buttons for non-interactive state
        `,
      },
    },
  },
}

// Complete Matrix - All combinations
export const AllCombinations: Story = {
  render: () => {
    const document: SduiLayoutDocument = {
      version: '1.0.0',
      root: {
        id: 'root',
        type: 'Div',
        attributes: {
          className: 'flex flex-col gap-8 p-6',
        },
        children: [
          {
            id: 'title',
            type: 'Span',
            state: {
              text: 'Button - All Combinations',
            },
            attributes: {
              className: 'text-2xl font-bold mb-2',
            },
          },
          {
            id: 'note',
            type: 'Span',
            state: {
              text: '*To reduce complexity, styles are separated into individual components rather than being properties',
            },
            attributes: {
              className: 'text-sm text-gray-600 mb-4',
            },
          },
          ...(['filled', 'outline', 'text'] as const).map((buttonStyle) => ({
            id: `section-${buttonStyle}`,
            type: 'Div',
            attributes: {
              className: 'flex flex-col gap-6 border-t border-gray-200 pt-6',
            },
            children: [
              {
                id: `section-title-${buttonStyle}`,
                type: 'Span',
                state: {
                  text: `Button_${buttonStyle.charAt(0).toUpperCase() + buttonStyle.slice(1)}`,
                },
                attributes: {
                  className: 'text-xl font-bold capitalize',
                },
              },
              // Sizes section
              {
                id: `sizes-section-${buttonStyle}`,
                type: 'Div',
                attributes: {
                  className: 'flex flex-col gap-4',
                },
                children: [
                  {
                    id: `sizes-title-${buttonStyle}`,
                    type: 'Span',
                    state: {
                      text: 'Size',
                    },
                    attributes: {
                      className: 'text-base font-semibold',
                    },
                  },
                  {
                    id: `sizes-container-${buttonStyle}`,
                    type: 'Div',
                    attributes: {
                      className: 'flex gap-4 flex-wrap',
                    },
                    children: (buttonStyle === 'text' ? (['L', 'M', 'S'] as const) : (['L', 'M'] as const)).map(
                      (size) => ({
                        id: `size-item-${buttonStyle}-${size}`,
                        type: 'Div',
                        attributes: {
                          className: 'flex flex-col gap-2 items-center',
                        },
                        children: [
                          {
                            id: `size-label-${buttonStyle}-${size}`,
                            type: 'Span',
                            state: {
                              text: `Size ${size}`,
                            },
                            attributes: {
                              className: 'text-sm font-bold',
                            },
                          },
                          {
                            id: `size-button-${buttonStyle}-${size}`,
                            type: 'Button',
                            state: {
                              buttonStyle,
                              size,
                              buttonType: 'primary',
                            },
                            children: [
                              {
                                id: `size-button-text-${buttonStyle}-${size}`,
                                type: 'Span',
                                state: {
                                  text: 'Label',
                                },
                              },
                            ],
                          },
                        ],
                      }),
                    ),
                  },
                ],
              },
              // Types section
              {
                id: `types-section-${buttonStyle}`,
                type: 'Div',
                attributes: {
                  className: 'flex flex-col gap-4',
                },
                children: [
                  {
                    id: `types-title-${buttonStyle}`,
                    type: 'Span',
                    state: {
                      text: 'Type',
                    },
                    attributes: {
                      className: 'text-base font-semibold',
                    },
                  },
                  {
                    id: `types-container-${buttonStyle}`,
                    type: 'Div',
                    attributes: {
                      className: 'flex gap-4 flex-wrap',
                    },
                    children: (['primary', 'secondary'] as const).map((buttonType) => ({
                      id: `type-item-${buttonStyle}-${buttonType}`,
                      type: 'Div',
                      attributes: {
                        className: 'flex flex-col gap-2 items-center',
                      },
                      children: [
                        {
                          id: `type-label-${buttonStyle}-${buttonType}`,
                          type: 'Span',
                          state: {
                            text: `Type ${buttonType.charAt(0).toUpperCase() + buttonType.slice(1)}`,
                          },
                          attributes: {
                            className: 'text-sm font-bold',
                          },
                        },
                        {
                          id: `type-button-${buttonStyle}-${buttonType}`,
                          type: 'Button',
                          state: {
                            buttonStyle,
                            size: 'M',
                            buttonType,
                          },
                          children: [
                            {
                              id: `type-button-text-${buttonStyle}-${buttonType}`,
                              type: 'Span',
                              state: {
                                text: 'Label',
                              },
                            },
                          ],
                        },
                      ],
                    })),
                  },
                ],
              },
            ],
          })),
        ],
      },
    }

    return <SduiLayoutRenderer document={document} components={getButtonComponents()} />
  },
  parameters: {
    docs: {
      description: {
        story: `
## Overview

A **comprehensive showcase** of all button combinations organized by style, providing a complete reference for the button design system.

## Organization

Each style section displays:
- ✅ Available sizes
- ✅ Type variants
- ✅ Interactive states (Default, Hover, Press, Disabled)

## What's Included

### Style Sections
1. **Filled** - All combinations
2. **Outline** - All combinations
3. **Text** - All combinations

### For Each Style
- Size variations
- Type variations (Primary/Secondary)
- State demonstrations

## Purpose

This matrix helps:
- **Designers** understand visual options
- **Developers** choose appropriate variants
- **Teams** maintain design consistency

## Usage

Use this comprehensive reference to:
- Compare all button options
- Understand the complete system
- Make informed design decisions
        `,
      },
    },
  },
}
