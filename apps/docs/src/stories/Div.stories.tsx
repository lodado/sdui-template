
import { type SduiLayoutDocument, SduiLayoutRenderer } from '@lodado/sdui-template'
import { Div, sduiComponents } from '@lodado/sdui-template-component'
import type { Meta, StoryObj } from '@storybook/react-vite'
import React from 'react'

const meta: Meta<typeof Div> = {
  title: 'Shared/UI/Div',
  component: Div,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `
## Overview

The **Div** component is a container component with built-in **Error Boundary** and **Suspense** support, providing robust error handling and loading states out of the box.

## Key Features

### Error Boundary (기본 내장)
- ✅ **자동 에러 격리**: Div 컴포넌트는 기본적으로 ErrorBoundary로 감싸져 있어 에러가 발생해도 전체 앱이 크래시되지 않습니다
- ✅ **에러 격리**: 한 Div의 에러가 다른 Div에 영향을 주지 않습니다
- ✅ **Fallback UI**: 에러 발생 시 기본 에러 메시지가 표시됩니다

> 💡 **에러 로깅/알림이 필요하다면?**
> ErrorReportingProvider와 ErrorPolicy를 사용하세요. 자세한 내용은 **ErrorBoundary** 스토리북을 참고하세요.

### Suspense Support
- ✅ Handles asynchronous component loading
- ✅ Shows loading states during async operations
- ✅ Customizable loading fallback UI

## Integration

When used in the **SDUI template system**, the Div component:
- Integrates seamlessly with SduiLayoutRenderer
- Provides error handling without additional configuration
- Supports async loading patterns

## Best Use Cases

- Wrapping dynamic content
- Components that may fail
- Async component loading
- Error-prone sections
        `,
      },
    },
  },
}

export default meta
type Story = StoryObj<typeof Div>

// Basic Div example
export const Default: Story = {
  render: () => {
    const document: SduiLayoutDocument = {
      version: '1.0.0',
      root: {
        id: 'root',
        type: 'Div',
        attributes: {
          className: 'p-6',
        },
        children: [
          {
            id: 'title',
            type: 'Span',
            state: {
              text: 'Basic Div Component',
            },
            attributes: {
              className: 'text-lg font-bold mb-4',
            },
          },
          {
            id: 'description',
            type: 'Span',
            state: {
              text: 'The Div component includes built-in Error Boundary and Suspense.',
            },
            attributes: {
              className: 'text-gray-600 mb-4',
            },
          },
          {
            id: 'div-container',
            type: 'Div',
            attributes: {
              className: 'p-4 border border-gray-300 rounded bg-gray-50',
            },
            children: [
              {
                id: 'div-content',
                type: 'Span',
                state: {
                  text: 'This div is wrapped with Error Boundary and Suspense.',
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
## Overview

Basic usage of the **Div component** demonstrating its core functionality.

## Important Note

⚠️ In actual usage, the Div component should be used with **SduiLayoutRenderer** in the SDUI template system.

## Automatic Features

The component automatically:
- ✅ Wraps children with Error Boundary
- ✅ Wraps children with Suspense
- ✅ Provides error handling
- ✅ Supports async loading

## Configuration

No additional configuration needed - error handling and async loading support are built-in!
        `,
      },
    },
  },
}

// Nested Divs example
export const NestedDivs: Story = {
  render: () => {
    const document: SduiLayoutDocument = {
      version: '1.0.0',
      root: {
        id: 'root',
        type: 'Div',
        attributes: {
          className: 'p-6',
        },
        children: [
          {
            id: 'title',
            type: 'Span',
            state: {
              text: 'Nested Divs Example',
            },
            attributes: {
              className: 'text-lg font-bold mb-4',
            },
          },
          {
            id: 'outer-div',
            type: 'Div',
            attributes: {
              className: 'p-4 border-2 border-blue-300 rounded bg-blue-50',
            },
            children: [
              {
                id: 'outer-text',
                type: 'Span',
                state: {
                  text: 'Outer Div',
                },
                attributes: {
                  className: 'font-semibold mb-2',
                },
              },
              {
                id: 'inner-div',
                type: 'Div',
                attributes: {
                  className: 'p-3 border border-blue-500 rounded bg-blue-100',
                },
                children: [
                  {
                    id: 'inner-text',
                    type: 'Span',
                    state: {
                      text: 'Inner Div',
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
## Overview

Demonstrates how **Div components** can be nested to create complex layouts.

## Structure

- Outer Div with blue border
- Inner Div nested inside with darker blue border

## Use Cases

- Creating layout sections
- Grouping related content
- Building complex UI structures
        `,
      },
    },
  },
}

// Div with Custom Styling
export const WithCustomStyling: Story = {
  render: () => {
    const document: SduiLayoutDocument = {
      version: '1.0.0',
      root: {
        id: 'root',
        type: 'Div',
        attributes: {
          className: 'p-6',
        },
        children: [
          {
            id: 'title',
            type: 'Span',
            state: {
              text: 'Custom Styling Example',
            },
            attributes: {
              className: 'text-lg font-bold mb-4',
            },
          },
          {
            id: 'styled-div',
            type: 'Div',
            attributes: {
              className: 'p-6 bg-gradient-to-r from-purple-400 to-pink-400 rounded-lg shadow-lg',
            },
            children: [
              {
                id: 'styled-text',
                type: 'Span',
                state: {
                  text: 'This Div has custom styling with gradient background and shadow',
                },
                attributes: {
                  className: 'text-white font-semibold',
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
## Overview

Shows how to apply **custom styling** to Div components using className attributes.

## Styling Options

- Tailwind CSS classes
- Custom CSS classes
- Inline styles (via attributes)

## Best Practices

- Use Tailwind utilities for consistency
- Keep styling in attributes for SDUI compatibility
- Maintain design system tokens
        `,
      },
    },
  },
}

// Div as Container
export const AsContainer: Story = {
  render: () => {
    const document: SduiLayoutDocument = {
      version: '1.0.0',
      root: {
        id: 'root',
        type: 'Div',
        attributes: {
          className: 'p-6',
        },
        children: [
          {
            id: 'title',
            type: 'Span',
            state: {
              text: 'Container Example',
            },
            attributes: {
              className: 'text-lg font-bold mb-4',
            },
          },
          {
            id: 'container-div',
            type: 'Div',
            attributes: {
              className: 'flex flex-col gap-4 p-4 border border-gray-300 rounded',
            },
            children: [
              {
                id: 'item-1',
                type: 'Span',
                state: {
                  text: 'Item 1',
                },
                attributes: {
                  className: 'p-2 bg-gray-100 rounded',
                },
              },
              {
                id: 'item-2',
                type: 'Span',
                state: {
                  text: 'Item 2',
                },
                attributes: {
                  className: 'p-2 bg-gray-100 rounded',
                },
              },
              {
                id: 'item-3',
                type: 'Span',
                state: {
                  text: 'Item 3',
                },
                attributes: {
                  className: 'p-2 bg-gray-100 rounded',
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
## Overview

Demonstrates using **Div as a container** to group multiple child elements.

## Container Features

- Flexbox layout support
- Gap spacing
- Border and padding
- Grouped content

## Use Cases

- Card layouts
- List containers
- Form sections
- Content grouping
        `,
      },
    },
  },
}
