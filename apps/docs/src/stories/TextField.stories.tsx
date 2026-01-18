import '@lodado/sdui-design-files/colors.css'

import { type SduiLayoutDocument, SduiLayoutRenderer } from '@lodado/sdui-template'
import { defaultComponentMap, TextField } from '@lodado/sdui-template-component'
import type { Meta, StoryObj } from '@storybook/react-vite'
import React from 'react'

// SVG Icon Components for TextField examples
const EmailIconSVG = () => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-5 h-5">
    <path
      d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path d="M22 6l-10 7L2 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

const SearchIconSVG = () => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-5 h-5">
    <circle cx="11" cy="11" r="8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <path d="m21 21-4.35-4.35" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

const ClearIconSVG = () => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-5 h-5">
    <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

// Create component factories for SVG icons
const createSVGIconFactory = (SVGComponent: React.ComponentType) => {
  return () => <SVGComponent />
}

// Get components with SVG factories
const getTextFieldComponentsWithSVG = () => {
  const baseComponents = defaultComponentMap
  return {
    ...baseComponents,
    SVG_email: createSVGIconFactory(EmailIconSVG),
    SVG_search: createSVGIconFactory(SearchIconSVG),
    SVG_clear: createSVGIconFactory(ClearIconSVG),
  }
}

const meta: Meta<typeof TextField> = {
  title: 'Shared/UI/TextField',
  component: TextField,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `
## Overview

The **TextField** component is an input field that accepts text input from users. Built with flexibility and accessibility in mind.

## Architecture

Uses the **Compound Component pattern** to flexibly arrange:
- **Label**: Field identifier
- **Input**: Text input element
- **HelpMessage**: Guidance and error messages

## Layout Options

The **Wrapper** component allows you to choose:
- **Vertical layout**: Stacked (default, mobile-friendly)
- **Horizontal layout**: Side-by-side (compact)
- **Custom layout**: Full control with CSS Grid/Flexbox

## Features

### States
- ✅ Default (empty)
- ✅ Focus (active)
- ✅ Filled (with value)
- ✅ Disabled (read-only)
- ✅ Error (validation failure)

### Additional Features
- ✅ **Icons**: Left and/or right icons
- ✅ **Validation**: Built-in error handling
- ✅ **Accessibility**: ARIA attributes, keyboard navigation
- ✅ **Help messages**: Contextual guidance

## Use Cases

- Form inputs
- Search fields
- Data entry
- User authentication
        `,
      },
    },
  },
}

export default meta
type Story = StoryObj<typeof TextField>

// State 1. Default
export const Default: Story = {
  render: () => {
    const document: SduiLayoutDocument = {
      version: '1.0.0',
      root: {
        id: 'root',
        type: 'Div',
        attributes: {
          className: 'flex justify-center p-20 bg-gray-100',
        },
        children: [
          {
            id: 'textfield-container',
            type: 'Div',
            attributes: {
              className: 'w-[328px]',
            },
            children: [
              {
                id: 'textfield',
                type: 'TextField',
                state: {
                  error: false,
                  required: false,
                  disabled: false,
                },
                children: [
                  {
                    id: 'textfield-wrapper',
                    type: 'TextFieldWrapper',
                    attributes: {
                      orientation: 'vertical',
                    },
                    children: [
                      {
                        id: 'textfield-input',
                        type: 'TextFieldInput',
                        attributes: {
                          placeholder: 'Placeholder',
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
    return <SduiLayoutRenderer document={document} components={defaultComponentMap} />
  },
  parameters: {
    docs: {
      description: {
        story:
          'The default state of the TextField component. This is the initial, empty state where the field is ready for user input. The border uses the default color and no error or help messages are displayed.',
      },
    },
  },
}

// State 2. Focus
export const Focus: Story = {
  render: () => {
    const document: SduiLayoutDocument = {
      version: '1.0.0',
      root: {
        id: 'root',
        type: 'Div',
        attributes: {
          className: 'flex justify-center p-20 bg-gray-100',
        },
        children: [
          {
            id: 'textfield-container',
            type: 'Div',
            attributes: {
              className: 'w-[328px]',
            },
            children: [
              {
                id: 'textfield',
                type: 'TextField',
                state: {
                  error: false,
                  required: false,
                  disabled: false,
                },
                children: [
                  {
                    id: 'textfield-wrapper',
                    type: 'TextFieldWrapper',
                    attributes: {
                      orientation: 'vertical',
                    },
                    children: [
                      {
                        id: 'textfield-input',
                        type: 'TextFieldInput',
                        attributes: {
                          placeholder: 'Placeholder',
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
    return (
      <div>
        <SduiLayoutRenderer document={document} components={defaultComponentMap} />
        <p className="text-sm text-gray-600 mt-2">Click on the input to see focus state</p>
      </div>
    )
  },
  parameters: {
    docs: {
      description: {
        story:
          'The focus state occurs when the input field is active and ready for typing. The border color changes to indicate focus, and the field is ready to accept user input. This state is triggered when the user clicks or tabs into the field.',
      },
    },
  },
}

// State 3. Filled
export const Filled: Story = {
  render: () => {
    const document: SduiLayoutDocument = {
      version: '1.0.0',
      root: {
        id: 'root',
        type: 'Div',
        attributes: {
          className: 'flex justify-center p-20 bg-gray-100',
        },
        children: [
          {
            id: 'textfield-container',
            type: 'Div',
            attributes: {
              className: 'w-[328px]',
            },
            children: [
              {
                id: 'textfield',
                type: 'TextField',
                state: {
                  error: false,
                  required: false,
                  disabled: false,
                },
                children: [
                  {
                    id: 'textfield-wrapper',
                    type: 'TextFieldWrapper',
                    attributes: {
                      orientation: 'vertical',
                    },
                    children: [
                      {
                        id: 'textfield-input',
                        type: 'TextFieldInput',
                        attributes: {
                          placeholder: 'Placeholder',
                          value: 'Placeholder',
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
    return <SduiLayoutRenderer document={document} components={defaultComponentMap} />
  },
  parameters: {
    docs: {
      description: {
        story:
          'The filled state shows when the user has entered a value. A clear icon appears on the right side of the input, allowing users to quickly clear the field. This provides better UX by making it easy to reset the input without manually deleting all text.',
      },
    },
  },
}

// State 4. Disabled
export const Disabled: Story = {
  render: () => {
    const document: SduiLayoutDocument = {
      version: '1.0.0',
      root: {
        id: 'root',
        type: 'Div',
        attributes: {
          className: 'flex justify-center p-20 bg-gray-100',
        },
        children: [
          {
            id: 'textfield-container',
            type: 'Div',
            attributes: {
              className: 'w-[328px]',
            },
            children: [
              {
                id: 'textfield',
                type: 'TextField',
                state: {
                  error: false,
                  disabled: true,
                  required: false,
                },
                children: [
                  {
                    id: 'textfield-wrapper',
                    type: 'TextFieldWrapper',
                    attributes: {
                      orientation: 'vertical',
                    },
                    children: [
                      {
                        id: 'textfield-input',
                        type: 'TextFieldInput',
                        attributes: {
                          placeholder: 'Placeholder',
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
    return <SduiLayoutRenderer document={document} components={defaultComponentMap} />
  },
  parameters: {
    docs: {
      description: {
        story:
          "The disabled state makes the field read-only and non-interactive. Disabled fields appear with reduced opacity and cannot be focused or edited. This is useful for displaying pre-filled information that shouldn't be changed or when the field is temporarily unavailable.",
      },
    },
  },
}

// State 5. Error
export const Error: Story = {
  render: () => {
    const document: SduiLayoutDocument = {
      version: '1.0.0',
      root: {
        id: 'root',
        type: 'Div',
        attributes: {
          className: 'flex justify-center p-20 bg-gray-100',
        },
        children: [
          {
            id: 'textfield-container',
            type: 'Div',
            attributes: {
              className: 'w-[328px]',
            },
            children: [
              {
                id: 'textfield',
                type: 'TextField',
                state: {
                  error: true,
                  errorMessage: 'Help message',
                  required: false,
                },
                attributes: {
                  disabled: false,
                },
                children: [
                  {
                    id: 'textfield-wrapper',
                    type: 'TextFieldWrapper',
                    attributes: {
                      orientation: 'vertical',
                    },
                    children: [
                      {
                        id: 'textfield-input',
                        type: 'TextFieldInput',
                        attributes: {
                          placeholder: 'Placeholder',
                          value: 'Placeholder',
                        },
                      },
                      {
                        id: 'textfield-help-message',
                        type: 'TextFieldHelpMessage',
                        state: {
                          text: 'Help message',
                        },
                        attributes: {
                          error: true,
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
    return <SduiLayoutRenderer document={document} components={defaultComponentMap} />
  },
  parameters: {
    docs: {
      description: {
        story:
          'The error state displays when validation fails or an error occurs. The border turns red and an error message appears below the input field. This provides immediate feedback to users about what needs to be corrected.',
      },
    },
  },
}

// Vertical Layout (Default)
export const VerticalLayout: Story = {
  render: () => {
    const document: SduiLayoutDocument = {
      version: '1.0.0',
      root: {
        id: 'root',
        type: 'Div',
        attributes: {
          className: 'flex justify-center p-20 bg-gray-100',
        },
        children: [
          {
            id: 'textfield-container',
            type: 'Div',
            attributes: {
              className: 'w-[328px]',
            },
            children: [
              {
                id: 'textfield',
                type: 'TextField',
                state: {
                  error: false,
                  helpMessage: 'Enter your email address',
                  required: false,
                },
                attributes: {
                  disabled: false,
                },
                children: [
                  {
                    id: 'textfield-wrapper',
                    type: 'TextFieldWrapper',
                    attributes: {
                      orientation: 'vertical',
                    },
                    children: [
                      {
                        id: 'textfield-label',
                        type: 'TextFieldLabel',
                        state: {
                          text: 'Email',
                        },
                      },
                      {
                        id: 'textfield-input',
                        type: 'TextFieldInput',
                        attributes: {
                          placeholder: 'Enter your email',
                        },
                      },
                      {
                        id: 'textfield-help-message',
                        type: 'TextFieldHelpMessage',
                        state: {
                          text: 'Enter your email address',
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
    return <SduiLayoutRenderer document={document} components={defaultComponentMap} />
  },
  parameters: {
    docs: {
      description: {
        story:
          'The vertical layout (default) stacks the label, input, and help message vertically. This is the most common layout and provides the best readability, especially on mobile devices. The label appears above the input, and help/error messages appear below.',
      },
    },
  },
}

// Horizontal Layout
export const HorizontalLayout: Story = {
  render: () => {
    const document: SduiLayoutDocument = {
      version: '1.0.0',
      root: {
        id: 'root',
        type: 'Div',
        attributes: {
          className: 'flex justify-center p-20 bg-gray-100',
        },
        children: [
          {
            id: 'textfield-container',
            type: 'Div',
            attributes: {
              className: 'w-[328px]',
            },
            children: [
              {
                id: 'textfield',
                type: 'TextField',
                state: {
                  error: false,
                  required: false,
                  disabled: false,
                },
                children: [
                  {
                    id: 'textfield-wrapper',
                    type: 'TextFieldWrapper',
                    attributes: {
                      orientation: 'horizontal',
                    },
                    children: [
                      {
                        id: 'textfield-label',
                        type: 'TextFieldLabel',
                        state: {
                          text: 'Email',
                        },
                      },
                      {
                        id: 'textfield-input',
                        type: 'TextFieldInput',
                        attributes: {
                          placeholder: 'Enter your email',
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
    return <SduiLayoutRenderer document={document} components={defaultComponentMap} />
  },
  parameters: {
    docs: {
      description: {
        story:
          'The horizontal layout places the label and input side by side. The label takes up flex-1 space, allowing it to grow and fill available space while the input maintains its width. This layout is useful when you need to save vertical space or create a more compact form design.',
      },
    },
  },
}

// With Label
export const WithLabel: Story = {
  render: () => {
    const document: SduiLayoutDocument = {
      version: '1.0.0',
      root: {
        id: 'root',
        type: 'Div',
        attributes: {
          className: 'flex justify-center p-20 bg-gray-100',
        },
        children: [
          {
            id: 'textfield-container',
            type: 'Div',
            attributes: {
              className: 'w-[328px]',
            },
            children: [
              {
                id: 'textfield',
                type: 'TextField',
                state: {
                  error: false,
                  required: false,
                  disabled: false,
                },
                children: [
                  {
                    id: 'textfield-wrapper',
                    type: 'TextFieldWrapper',
                    attributes: {
                      orientation: 'vertical',
                    },
                    children: [
                      {
                        id: 'textfield-label',
                        type: 'TextFieldLabel',
                        state: {
                          text: 'Email',
                        },
                      },
                      {
                        id: 'textfield-input',
                        type: 'TextFieldInput',
                        attributes: {
                          placeholder: 'Enter your email',
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
    return <SduiLayoutRenderer document={document} components={defaultComponentMap} />
  },
  parameters: {
    docs: {
      description: {
        story:
          'Shows how to add a label to the TextField. Labels provide context about what information should be entered in the field. They are automatically associated with the input for accessibility, improving screen reader support and form usability.',
      },
    },
  },
}

// With Help Message
export const WithHelpMessage: Story = {
  render: () => {
    const document: SduiLayoutDocument = {
      version: '1.0.0',
      root: {
        id: 'root',
        type: 'Div',
        attributes: {
          className: 'flex justify-center p-20 bg-gray-100',
        },
        children: [
          {
            id: 'textfield-container',
            type: 'Div',
            attributes: {
              className: 'w-[328px]',
            },
            children: [
              {
                id: 'textfield',
                type: 'TextField',
                state: {
                  error: false,
                  helpMessage: 'Enter a valid email address',
                  required: false,
                },
                attributes: {
                  disabled: false,
                },
                children: [
                  {
                    id: 'textfield-wrapper',
                    type: 'TextFieldWrapper',
                    attributes: {
                      orientation: 'vertical',
                    },
                    children: [
                      {
                        id: 'textfield-label',
                        type: 'TextFieldLabel',
                        state: {
                          text: 'Email',
                        },
                      },
                      {
                        id: 'textfield-input',
                        type: 'TextFieldInput',
                        attributes: {
                          placeholder: 'Enter your email',
                        },
                      },
                      {
                        id: 'textfield-help-message',
                        type: 'TextFieldHelpMessage',
                        state: {
                          text: 'Enter a valid email address',
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
    return <SduiLayoutRenderer document={document} components={defaultComponentMap} />
  },
  parameters: {
    docs: {
      description: {
        story:
          'Demonstrates how to add a help message to provide additional guidance to users. Help messages appear below the input field and remain visible even when the field is in an error state. They are useful for explaining format requirements or providing context about the expected input.',
      },
    },
  },
}

// Required Field
export const Required: Story = {
  render: () => {
    const document: SduiLayoutDocument = {
      version: '1.0.0',
      root: {
        id: 'root',
        type: 'Div',
        attributes: {
          className: 'flex justify-center p-20 bg-gray-100',
        },
        children: [
          {
            id: 'textfield-container',
            type: 'Div',
            attributes: {
              className: 'w-[328px]',
            },
            children: [
              {
                id: 'textfield',
                type: 'TextField',
                attributes: {
                  error: false,
                  disabled: false,
                  required: true,
                },
                children: [
                  {
                    id: 'textfield-wrapper',
                    type: 'TextFieldWrapper',
                    attributes: {
                      orientation: 'vertical',
                    },
                    children: [
                      {
                        id: 'textfield-label',
                        type: 'TextFieldLabel',
                        state: {
                          text: 'Email',
                        },
                      },
                      {
                        id: 'textfield-input',
                        type: 'TextFieldInput',
                        attributes: {
                          placeholder: 'Enter your email',
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
    return <SduiLayoutRenderer document={document} components={defaultComponentMap} />
  },
  parameters: {
    docs: {
      description: {
        story:
          'Demonstrates a required field. When the required prop is set, the label displays a visual indicator (typically an asterisk) to show that the field must be filled. This helps users understand which fields are mandatory before submitting the form.',
      },
    },
  },
}

// All States Showcase
export const AllStates: Story = {
  render: () => {
    const document: SduiLayoutDocument = {
      version: '1.0.0',
      root: {
        id: 'root',
        type: 'Div',
        attributes: {
          className: 'flex justify-center p-20 bg-gray-100',
        },
        children: [
          {
            id: 'container',
            type: 'Div',
            attributes: {
              className: 'w-[328px] flex flex-col gap-8',
            },
            children: [
              {
                id: 'state-default',
                type: 'Div',
                attributes: {
                  className: 'flex flex-col gap-2',
                },
                children: [
                  {
                    id: 'state-default-title',
                    type: 'Span',
                    state: {
                      text: 'State 1. Default',
                    },
                    attributes: {
                      className: 'text-base font-bold mb-2',
                    },
                  },
                  {
                    id: 'state-default-desc',
                    type: 'Span',
                    state: {
                      text: 'Default state ready for input',
                    },
                    attributes: {
                      className: 'text-sm text-gray-600 mb-2',
                    },
                  },
                  {
                    id: 'textfield-default',
                    type: 'TextField',
                    children: [
                      {
                        id: 'wrapper-default',
                        type: 'TextFieldWrapper',
                        children: [
                          {
                            id: 'input-default',
                            type: 'TextFieldInput',
                            attributes: {
                              placeholder: 'Placeholder',
                            },
                          },
                        ],
                      },
                    ],
                  },
                ],
              },
              {
                id: 'state-filled',
                type: 'Div',
                attributes: {
                  className: 'flex flex-col gap-2',
                },
                children: [
                  {
                    id: 'state-filled-title',
                    type: 'Span',
                    state: {
                      text: 'State 3. Filled',
                    },
                    attributes: {
                      className: 'text-base font-bold mb-2',
                    },
                  },
                  {
                    id: 'state-filled-desc',
                    type: 'Span',
                    state: {
                      text: 'Filled state with completed input',
                    },
                    attributes: {
                      className: 'text-sm text-gray-600 mb-2',
                    },
                  },
                  {
                    id: 'textfield-filled',
                    type: 'TextField',
                    children: [
                      {
                        id: 'wrapper-filled',
                        type: 'TextFieldWrapper',
                        children: [
                          {
                            id: 'input-filled',
                            type: 'TextFieldInput',
                            attributes: {
                              placeholder: 'Placeholder',
                              value: 'Placeholder',
                            },
                          },
                        ],
                      },
                    ],
                  },
                ],
              },
              {
                id: 'state-disabled',
                type: 'Div',
                attributes: {
                  className: 'flex flex-col gap-2',
                },
                children: [
                  {
                    id: 'state-disabled-title',
                    type: 'Span',
                    state: {
                      text: 'State 4. Disabled',
                    },
                    attributes: {
                      className: 'text-base font-bold mb-2',
                    },
                  },
                  {
                    id: 'state-disabled-desc',
                    type: 'Span',
                    state: {
                      text: 'Disabled state unable to input',
                    },
                    attributes: {
                      className: 'text-sm text-gray-600 mb-2',
                    },
                  },
                  {
                    id: 'textfield-disabled',
                    type: 'TextField',
                    attributes: {
                      disabled: true,
                    },
                    children: [
                      {
                        id: 'wrapper-disabled',
                        type: 'TextFieldWrapper',
                        children: [
                          {
                            id: 'input-disabled',
                            type: 'TextFieldInput',
                            attributes: {
                              placeholder: 'Placeholder',
                            },
                          },
                        ],
                      },
                    ],
                  },
                ],
              },
              {
                id: 'state-error',
                type: 'Div',
                attributes: {
                  className: 'flex flex-col gap-2',
                },
                children: [
                  {
                    id: 'state-error-title',
                    type: 'Span',
                    state: {
                      text: 'State 5. Error',
                    },
                    attributes: {
                      className: 'text-base font-bold mb-2',
                    },
                  },
                  {
                    id: 'state-error-desc',
                    type: 'Span',
                    state: {
                      text: 'Error state',
                    },
                    attributes: {
                      className: 'text-sm text-gray-600 mb-2',
                    },
                  },
                  {
                    id: 'textfield-error',
                    type: 'TextField',
                    attributes: {
                      error: true,
                      errorMessage: 'Help message',
                    },
                    children: [
                      {
                        id: 'wrapper-error',
                        type: 'TextFieldWrapper',
                        children: [
                          {
                            id: 'input-error',
                            type: 'TextFieldInput',
                            attributes: {
                              placeholder: 'Placeholder',
                              value: 'Placeholder',
                            },
                          },
                          {
                            id: 'help-message-error',
                            type: 'TextFieldHelpMessage',
                          },
                        ],
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

    return <SduiLayoutRenderer document={document} components={defaultComponentMap} />
  },
  parameters: {
    docs: {
      description: {
        story:
          'A comprehensive showcase of all TextField states in one view. This includes Default (empty), Focus (active), Filled (with value and clear icon), Disabled (read-only), and Error (validation failure). This helps designers and developers understand the complete state system and choose the appropriate state for their use case.',
      },
    },
  },
}

// With Left Icon
export const WithLeftIcon: Story = {
  render: () => {
    const document: SduiLayoutDocument = {
      version: '1.0.0',
      root: {
        id: 'root',
        type: 'Div',
        attributes: {
          className: 'flex justify-center p-20 bg-gray-100',
        },
        children: [
          {
            id: 'textfield-container',
            type: 'Div',
            attributes: {
              className: 'w-[328px]',
            },
            children: [
              {
                id: 'textfield',
                type: 'TextField',
                state: {
                  error: false,
                  required: false,
                  disabled: false,
                },
                children: [
                  {
                    id: 'textfield-wrapper',
                    type: 'TextFieldWrapper',
                    attributes: {
                      orientation: 'vertical',
                    },
                    children: [
                      {
                        id: 'textfield-label',
                        type: 'TextFieldLabel',
                        state: {
                          text: 'Email',
                        },
                      },
                      {
                        id: 'textfield-input',
                        type: 'TextFieldInput',
                        attributes: {
                          placeholder: 'Enter your email',
                        },
                        state: {
                          iconLocation: 'left',
                        },
                        children: [
                          {
                            id: 'left-icon',
                            type: 'Icon',
                            attributes: {
                              size: 'w-5 h-5',
                            },
                            children: [
                              {
                                id: 'email-icon-svg',
                                type: 'SVG_email',
                              },
                            ],
                          },
                        ],
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
    return <SduiLayoutRenderer document={document} components={getTextFieldComponentsWithSVG()} />
  },
  parameters: {
    docs: {
      description: {
        story:
          'Demonstrates how to add a left icon to the TextField input. Left icons are useful for indicating the type of input expected, such as an email icon for email fields or a search icon for search fields. The icon appears inside the input field on the left side.',
      },
    },
  },
}

// With Right Icon
export const WithRightIcon: Story = {
  render: () => {
    const document: SduiLayoutDocument = {
      version: '1.0.0',
      root: {
        id: 'root',
        type: 'Div',
        attributes: {
          className: 'flex justify-center p-20 bg-gray-100',
        },
        children: [
          {
            id: 'textfield-container',
            type: 'Div',
            attributes: {
              className: 'w-[328px]',
            },
            children: [
              {
                id: 'textfield',
                type: 'TextField',
                state: {
                  error: false,
                  required: false,
                  disabled: false,
                },
                children: [
                  {
                    id: 'textfield-wrapper',
                    type: 'TextFieldWrapper',
                    attributes: {
                      orientation: 'vertical',
                    },
                    children: [
                      {
                        id: 'textfield-label',
                        type: 'TextFieldLabel',
                        state: {
                          text: 'Search',
                        },
                      },
                      {
                        id: 'textfield-input',
                        type: 'TextFieldInput',
                        attributes: {
                          placeholder: 'Search...',
                          value: 'Search query',
                        },
                        state: {
                          iconLocation: 'right',
                        },
                        children: [
                          {
                            id: 'right-icon',
                            type: 'Icon',
                            attributes: {
                              size: 'w-5 h-5',
                            },
                            children: [
                              {
                                id: 'clear-icon-svg',
                                type: 'SVG_clear',
                              },
                            ],
                          },
                        ],
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
    return <SduiLayoutRenderer document={document} components={getTextFieldComponentsWithSVG()} />
  },
  parameters: {
    docs: {
      description: {
        story:
          'Demonstrates how to add a right icon to the TextField input. Right icons are commonly used for actions like clearing the input field or showing/hiding passwords. The icon appears inside the input field on the right side and can be made clickable.',
      },
    },
  },
}

// With Both Icons
export const WithBothIcons: Story = {
  render: () => {
    const document: SduiLayoutDocument = {
      version: '1.0.0',
      root: {
        id: 'root',
        type: 'Div',
        attributes: {
          className: 'flex justify-center p-20 bg-gray-100',
        },
        children: [
          {
            id: 'textfield-container',
            type: 'Div',
            attributes: {
              className: 'w-[328px]',
            },
            children: [
              {
                id: 'textfield',
                type: 'TextField',
                state: {
                  error: false,
                  required: false,
                  disabled: false,
                },
                children: [
                  {
                    id: 'textfield-wrapper',
                    type: 'TextFieldWrapper',
                    attributes: {
                      orientation: 'vertical',
                    },
                    children: [
                      {
                        id: 'textfield-label',
                        type: 'TextFieldLabel',
                        state: {
                          text: 'Search',
                        },
                      },
                      {
                        id: 'textfield-input',
                        type: 'TextFieldInput',
                        attributes: {
                          placeholder: 'Search...',
                          value: 'Search query',
                        },
                        state: {
                          iconLocation: 'both',
                        },
                        children: [
                          {
                            id: 'left-icon',
                            type: 'Icon',
                            attributes: {
                              size: 'w-5 h-5',
                            },
                            children: [
                              {
                                id: 'search-icon-svg',
                                type: 'SVG_search',
                              },
                            ],
                          },
                          {
                            id: 'right-icon',
                            type: 'Icon',
                            attributes: {
                              size: 'w-5 h-5',
                            },
                            children: [
                              {
                                id: 'clear-icon-svg',
                                type: 'SVG_clear',
                              },
                            ],
                          },
                        ],
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
    return <SduiLayoutRenderer document={document} components={getTextFieldComponentsWithSVG()} />
  },
  parameters: {
    docs: {
      description: {
        story:
          'Demonstrates a TextField with both left and right icons. This is useful for search fields where you want to indicate the search functionality with a left icon and provide a clear action with a right icon. Both icons work together to enhance the user experience.',
      },
    },
  },
}
