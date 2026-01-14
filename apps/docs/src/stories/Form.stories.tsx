/* eslint-disable local-rules/no-console-log */
import '@lodado/sdui-design-files/colors.css'

import { type SduiLayoutDocument, SduiLayoutRenderer } from '@lodado/sdui-template'
import { Form, getFormComponents } from '@lodado/sdui-template-component'
import type { Meta, StoryObj } from '@storybook/react-vite'
import React from 'react'

const meta: Meta<typeof Form> = {
  title: 'Features/UI/Form',
  component: Form,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `
## Overview

The **Form** component integrates **react-hook-form** with **zod** to provide comprehensive form validation with excellent developer experience.

## Key Features

### Form State Management
- ✅ **react-hook-form** for efficient state handling
- ✅ Minimal re-renders
- ✅ Optimized performance

### Validation
- ✅ **zod** schema-based validation
- ✅ Type-safe form data
- ✅ Custom validation rules
- ✅ Cross-field validation support

### Integration
- ✅ Works seamlessly with **TextField** component
- ✅ Consistent UI and validation experience
- ✅ Automatic error handling

## Flexibility

The Form component supports:
- **Schema-based** validation (recommended)
- **Schema-less** forms (for simple cases)

## Use Cases

- Login/registration forms
- User profile forms
- Data entry forms
- Multi-step forms
        `,
      },
    },
  },
}

export default meta
type Story = StoryObj<typeof Form>

// Basic Form Example
export const Basic: Story = {
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
            id: 'form-container',
            type: 'Div',
            attributes: {
              className: 'w-[340px]',
            },
            children: [
              {
                id: 'form',
                type: 'Form',
                attributes: {},
                children: [
                  {
                    id: 'form-fields-container',
                    type: 'Div',
                    attributes: {
                      className: 'flex flex-col gap-4',
                    },
                    children: [
                      {
                        id: 'form-field-email',
                        type: 'FormField',
                        attributes: {
                          name: 'email',
                          label: '로그인',
                          type: 'text',
                          required: true,
                          disabled: false,
                        },
                      },
                      {
                        id: 'form-field-password',
                        type: 'FormField',
                        attributes: {
                          name: 'password',
                          label: '비밀번호',
                          type: 'password',
                          required: true,
                          disabled: false,
                        },
                      },
                      {
                        id: 'submit-button',
                        type: 'Button',
                        state: {
                          buttonStyle: 'filled',
                          buttonType: 'primary',
                          size: 'L',
                        },
                        attributes: {
                          type: 'submit',
                          className: 'w-full',
                        },
                        children: [
                          {
                            id: 'submit-button-text',
                            type: 'Span',
                            state: {
                              text: '로그인',
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
        ],
      },
    }
    return <SduiLayoutRenderer document={document} components={getFormComponents()} />
  },
  parameters: {
    docs: {
      description: {
        story:
          'A basic form example demonstrating the core functionality. The form uses a zod schema to validate email and password fields. When validation fails, error messages are automatically displayed below the corresponding fields. The form only submits when all validations pass.',
      },
    },
  },
}

// Registration Form Example
export const RegistrationForm: Story = {
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
            id: 'form-container',
            type: 'Div',
            attributes: {
              className: 'w-[340px]',
            },
            children: [
              {
                id: 'form',
                type: 'Form',
                attributes: {},
                children: [
                  {
                    id: 'form-fields-container',
                    type: 'Div',
                    attributes: {
                      className: 'flex flex-col gap-4',
                    },
                    children: [
                      {
                        id: 'form-field-name',
                        type: 'FormField',
                        attributes: {
                          name: 'name',
                          label: '이름',
                          type: 'text',
                          placeholder: '홍길동',
                          required: true,
                          disabled: false,
                        },
                      },
                      {
                        id: 'form-field-email',
                        type: 'FormField',
                        attributes: {
                          name: 'email',
                          label: '이메일',
                          type: 'email',
                          placeholder: 'example@email.com',
                          required: true,
                          disabled: false,
                        },
                      },
                      {
                        id: 'form-field-password',
                        type: 'FormField',
                        attributes: {
                          name: 'password',
                          label: '비밀번호',
                          type: 'password',
                          placeholder: '8자 이상 입력',
                          required: true,
                          disabled: false,
                        },
                      },
                      {
                        id: 'form-field-confirmPassword',
                        type: 'FormField',
                        attributes: {
                          name: 'confirmPassword',
                          label: '비밀번호 확인',
                          type: 'password',
                          placeholder: '비밀번호 재입력',
                          required: true,
                          disabled: false,
                        },
                      },
                      {
                        id: 'submit-button',
                        type: 'Button',
                        state: {
                          buttonStyle: 'filled',
                          buttonType: 'primary',
                          size: 'L',
                        },
                        attributes: {
                          type: 'submit',
                          className: 'w-full',
                        },
                        children: [
                          {
                            id: 'submit-button-text',
                            type: 'Span',
                            state: {
                              text: '회원가입',
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
        ],
      },
    }
    return <SduiLayoutRenderer document={document} components={getFormComponents()} />
  },
  parameters: {
    docs: {
      description: {
        story:
          "A registration form example that demonstrates cross-field validation. The form validates that the password and confirm password fields match using zod's refine method. This shows how to implement complex validation rules that depend on multiple fields.",
      },
    },
  },
}

// Form with Help Messages
export const WithHelpMessages: Story = {
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
            id: 'form-container',
            type: 'Div',
            attributes: {
              className: 'w-[340px]',
            },
            children: [
              {
                id: 'form',
                type: 'Form',
                attributes: {},
                children: [
                  {
                    id: 'form-fields-container',
                    type: 'Div',
                    attributes: {
                      className: 'flex flex-col gap-4',
                    },
                    children: [
                      {
                        id: 'form-field-username',
                        type: 'FormField',
                        attributes: {
                          name: 'username',
                          label: '사용자명',
                          type: 'text',
                          placeholder: 'username',
                          required: true,
                          disabled: false,
                          helpMessage: '3자 이상의 영문, 숫자, 언더스코어를 사용할 수 있습니다',
                        },
                      },
                      {
                        id: 'form-field-email',
                        type: 'FormField',
                        attributes: {
                          name: 'email',
                          label: '이메일',
                          type: 'email',
                          placeholder: 'example@email.com',
                          required: true,
                          disabled: false,
                          helpMessage: '로그인 및 알림에 사용됩니다',
                        },
                      },
                      {
                        id: 'submit-button',
                        type: 'Button',
                        state: {
                          buttonStyle: 'filled',
                          buttonType: 'primary',
                          size: 'L',
                        },
                        attributes: {
                          type: 'submit',
                          className: 'w-full',
                        },
                        children: [
                          {
                            id: 'submit-button-text',
                            type: 'Span',
                            state: {
                              text: '제출',
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
        ],
      },
    }
    return <SduiLayoutRenderer document={document} components={getFormComponents()} />
  },
  parameters: {
    docs: {
      description: {
        story:
          'Demonstrates how to add help messages to form fields. Help messages provide additional context and guidance to users about what to enter in each field. Help messages are displayed below the input field and remain visible even when the field is in an error state.',
      },
    },
  },
}

// Form without Schema (No Validation)
export const WithoutSchema: Story = {
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
            id: 'form-container',
            type: 'Div',
            attributes: {
              className: 'w-[340px]',
            },
            children: [
              {
                id: 'form',
                type: 'Form',
                attributes: {},
                children: [
                  {
                    id: 'form-fields-container',
                    type: 'Div',
                    attributes: {
                      className: 'flex flex-col gap-4',
                    },
                    children: [
                      {
                        id: 'form-field-email',
                        type: 'FormField',
                        attributes: {
                          name: 'email',
                          label: '이메일',
                          type: 'text',
                          placeholder: 'example@email.com',
                          required: false,
                          disabled: false,
                        },
                      },
                      {
                        id: 'form-field-password',
                        type: 'FormField',
                        attributes: {
                          name: 'password',
                          label: '비밀번호',
                          type: 'password',
                          placeholder: '비밀번호 입력',
                          required: false,
                          disabled: false,
                        },
                      },
                      {
                        id: 'submit-button',
                        type: 'Button',
                        state: {
                          buttonStyle: 'filled',
                          buttonType: 'primary',
                          size: 'L',
                        },
                        attributes: {
                          type: 'submit',
                          className: 'w-full',
                        },
                        children: [
                          {
                            id: 'submit-button-text',
                            type: 'Span',
                            state: {
                              text: '제출',
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
        ],
      },
    }
    return <SduiLayoutRenderer document={document} components={getFormComponents()} />
  },
  parameters: {
    docs: {
      description: {
        story:
          'Shows how to use the Form component without a validation schema. In this mode, the form collects data without performing any validation. This is useful for simple forms where validation is handled server-side or when you need maximum flexibility.',
      },
    },
  },
}

// Form with Custom Validation
export const CustomValidation: Story = {
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
            id: 'form-container',
            type: 'Div',
            attributes: {
              className: 'w-[340px]',
            },
            children: [
              {
                id: 'form',
                type: 'Form',
                attributes: {},
                children: [
                  {
                    id: 'form-fields-container',
                    type: 'Div',
                    attributes: {
                      className: 'flex flex-col gap-4',
                    },
                    children: [
                      {
                        id: 'form-field-phone',
                        type: 'FormField',
                        attributes: {
                          name: 'phone',
                          label: '전화번호',
                          type: 'text',
                          placeholder: '010-1234-5678',
                          required: true,
                          disabled: false,
                          helpMessage: '010-XXXX-XXXX 형식으로 입력해주세요',
                        },
                      },
                      {
                        id: 'form-field-age',
                        type: 'FormField',
                        attributes: {
                          name: 'age',
                          label: '나이',
                          type: 'number',
                          placeholder: '18',
                          required: true,
                          disabled: false,
                        },
                      },
                      {
                        id: 'submit-button',
                        type: 'Button',
                        state: {
                          buttonStyle: 'filled',
                          buttonType: 'primary',
                          size: 'L',
                        },
                        attributes: {
                          type: 'submit',
                          className: 'w-full',
                        },
                        children: [
                          {
                            id: 'submit-button-text',
                            type: 'Span',
                            state: {
                              text: '제출',
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
        ],
      },
    }
    return <SduiLayoutRenderer document={document} components={getFormComponents()} />
  },
  parameters: {
    docs: {
      description: {
        story:
          'Demonstrates custom validation rules using zod. The phone field uses a regex pattern to validate Korean phone number format (010-XXXX-XXXX), and the age field uses a refine method to check that the value is between 18 and 100. This shows how to implement domain-specific validation rules beyond basic type checking.',
      },
    },
  },
}

// Form with Disabled Fields
export const DisabledFields: Story = {
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
            id: 'form-container',
            type: 'Div',
            attributes: {
              className: 'w-[340px]',
            },
            children: [
              {
                id: 'form',
                type: 'Form',
                attributes: {},
                children: [
                  {
                    id: 'form-fields-container',
                    type: 'Div',
                    attributes: {
                      className: 'flex flex-col gap-4',
                    },
                    children: [
                      {
                        id: 'form-field-email',
                        type: 'FormField',
                        attributes: {
                          name: 'email',
                          label: '이메일',
                          disabled: true,
                          inputProps: {
                            defaultValue: 'user@example.com',
                          },
                        },
                      },
                      {
                        id: 'form-field-username',
                        type: 'FormField',
                        attributes: {
                          name: 'username',
                          label: '사용자명',
                          placeholder: '사용자명 입력',
                          required: true,
                        },
                      },
                      {
                        id: 'submit-button',
                        type: 'Button',
                        state: {
                          buttonStyle: 'filled',
                          buttonType: 'primary',
                          size: 'L',
                        },
                        attributes: {
                          type: 'submit',
                          className: 'w-full',
                        },
                        children: [
                          {
                            id: 'submit-button-text',
                            type: 'Span',
                            state: {
                              text: '제출',
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
        ],
      },
    }
    return <SduiLayoutRenderer document={document} components={getFormComponents()} />
  },
  parameters: {
    docs: {
      description: {
        story:
          "Shows how to include disabled fields in a form. Disabled fields are read-only and cannot be edited by users. They are useful for displaying pre-filled information that shouldn't be changed, such as user email addresses in profile forms. Disabled fields are still included in the form submission.",
      },
    },
  },
}
