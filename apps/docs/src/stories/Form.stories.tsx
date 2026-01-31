/* eslint-disable local-rules/no-console-log */
import '@lodado/sdui-design-files/colors.css'

import { type SduiLayoutDocument, SduiLayoutRenderer } from '@lodado/sdui-template'
import {
  ErrorBoundary,
  type ExtractSchemaFields,
  Form,
  registerSchemas,
  sduiComponents,
} from '@lodado/sdui-template-component'
import type { Meta, StoryObj } from '@storybook/react-vite'
import React from 'react'
import { z } from 'zod'

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

// Basic Form Example with Zod Validation
export const Basic: Story = {
  render: () => {
    // Define zod schema for login form validation
    const schemas = {
      loginForm: z.object({
        // min(1) should come before email() to show custom message for empty fields
        email: z.string().min(1, 'Please enter your email').email('Please enter a valid email'),
        password: z.string().min(8, 'Password must be at least 8 characters'),
      }),
    }

    // Type-safe: Extract field names from schema
    // type LoginFields = ExtractSchemaFields<typeof schemas, 'loginForm'> // "email" | "password"
    // FormField's name can be validated with this type (full type safety is difficult at runtime since it's JSON)

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
                attributes: {
                  schemaName: 'loginForm',
                },
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
                          label: 'Email',
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
                          label: 'Password',
                          type: 'password',
                          placeholder: 'Enter at least 8 characters',
                          required: true,
                          disabled: false,
                        },
                      },
                      {
                        id: 'submit-button',
                        type: 'Button',
                        state: {
                          appearance: 'primary',
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
                              text: 'Login',
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
    registerSchemas(schemas)
    return <SduiLayoutRenderer document={document} components={sduiComponents} />
  },
  parameters: {
    docs: {
      description: {
        story:
          'A basic form example demonstrating zod schema validation. The form uses a zod schema to validate email and password fields. When validation fails, error messages are automatically displayed below the corresponding fields. The form only submits when all validations pass. Try submitting with invalid data to see validation errors.',
      },
    },
  },
}

// Registration Form Example with Cross-field Validation
export const RegistrationForm: Story = {
  render: () => {
    // Define zod schema with cross-field validation
    const schemas = {
      registrationForm: z
        .object({
          name: z.string().min(2, 'Name must be at least 2 characters'),
          // min(1) should come before email() to show custom message for empty fields
          email: z.string().min(1, 'Please enter your email').email('Please enter a valid email'),
          password: z.string().min(8, 'Password must be at least 8 characters'),
          confirmPassword: z.string().min(1, 'Please confirm your password'),
        })
        .refine((data) => data.password === data.confirmPassword, {
          message: 'Passwords do not match',
          path: ['confirmPassword'], // Display error on confirmPassword field
        }),
    }

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
                attributes: {
                  schemaName: 'registrationForm',
                },
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
                          label: 'Name',
                          type: 'text',
                          placeholder: 'John Doe',
                          required: true,
                          disabled: false,
                        },
                      },
                      {
                        id: 'form-field-email',
                        type: 'FormField',
                        attributes: {
                          name: 'email',
                          label: 'Email',
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
                          label: 'Password',
                          type: 'password',
                          placeholder: 'Enter at least 8 characters',
                          required: true,
                          disabled: false,
                        },
                      },
                      {
                        id: 'form-field-confirmPassword',
                        type: 'FormField',
                        attributes: {
                          name: 'confirmPassword',
                          label: 'Confirm Password',
                          type: 'password',
                          placeholder: 'Re-enter password',
                          required: true,
                          disabled: false,
                        },
                      },
                      {
                        id: 'submit-button',
                        type: 'Button',
                        state: {
                          appearance: 'primary',
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
                              text: 'Sign Up',
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
    registerSchemas(schemas)
    return <SduiLayoutRenderer document={document} components={sduiComponents} />
  },
  parameters: {
    docs: {
      description: {
        story:
          "A registration form example that demonstrates cross-field validation using zod's refine method. The form validates that the password and confirm password fields match. When passwords don't match, an error is displayed on the confirmPassword field. This shows how to implement complex validation rules that depend on multiple fields.",
      },
    },
  },
}

// Form with Help Messages and Zod Validation
export const WithHelpMessages: Story = {
  render: () => {
    // Define zod schema with custom validation rules
    const schemas = {
      userForm: z.object({
        username: z
          .string()
          .min(3, 'Username must be at least 3 characters')
          .regex(/^[a-zA-Z0-9_]+$/, 'Only letters, numbers, and underscores are allowed'),
        // min(1) should come before email() to show custom message for empty fields
        email: z.string().min(1, 'Please enter your email').email('Please enter a valid email'),
      }),
    }

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
                attributes: {
                  schemaName: 'userForm',
                },
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
                          label: 'Username',
                          type: 'text',
                          placeholder: 'username',
                          required: true,
                          disabled: false,
                          helpMessage: 'Use at least 3 characters: letters, numbers, and underscores',
                        },
                      },
                      {
                        id: 'form-field-email',
                        type: 'FormField',
                        attributes: {
                          name: 'email',
                          label: 'Email',
                          type: 'email',
                          placeholder: 'example@email.com',
                          required: true,
                          disabled: false,
                          helpMessage: 'Used for login and notifications',
                        },
                      },
                      {
                        id: 'submit-button',
                        type: 'Button',
                        state: {
                          appearance: 'primary',
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
                              text: 'Submit',
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
    registerSchemas(schemas)
    return <SduiLayoutRenderer document={document} components={sduiComponents} />
  },
  parameters: {
    docs: {
      description: {
        story:
          'Demonstrates how to add help messages to form fields with zod validation. Help messages provide additional context and guidance to users about what to enter in each field. Help messages are displayed below the input field and remain visible even when the field is in an error state. The username field uses regex validation to ensure only alphanumeric characters and underscores are allowed.',
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
                          label: 'Email',
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
                          label: 'Password',
                          type: 'password',
                          placeholder: 'Enter password',
                          required: false,
                          disabled: false,
                        },
                      },
                      {
                        id: 'submit-button',
                        type: 'Button',
                        state: {
                          appearance: 'primary',
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
                              text: 'Submit',
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
    return <SduiLayoutRenderer document={document} components={sduiComponents} />
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

// Form with Custom Validation using Zod
export const CustomValidation: Story = {
  render: () => {
    // Define zod schema with custom validation rules
    const schemas = {
      customForm: z.object({
        phone: z
          .string()
          .min(1, 'Please enter your phone number')
          .regex(/^010-\d{4}-\d{4}$/, 'Please enter in format 010-XXXX-XXXX'),
        age: z
          .string()
          .min(1, 'Please enter your age')
          .refine(
            (val) => {
              const num = Number(val)
              return !Number.isNaN(num) && num >= 18 && num <= 100
            },
            {
              message: 'Age must be between 18 and 100',
            }
          ),
      }),
    }

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
                attributes: {
                  schemaName: 'customForm',
                },
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
                          label: 'Phone Number',
                          type: 'text',
                          placeholder: '010-1234-5678',
                          required: true,
                          disabled: false,
                          helpMessage: 'Please enter in format 010-XXXX-XXXX',
                        },
                      },
                      {
                        id: 'form-field-age',
                        type: 'FormField',
                        attributes: {
                          name: 'age',
                          label: 'Age',
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
                          appearance: 'primary',
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
                              text: 'Submit',
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
    registerSchemas(schemas)
    return <SduiLayoutRenderer document={document} components={sduiComponents} />
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

// Form with Schema Name (using registerSchemas)
export const WithSchemaName: Story = {
  render: () => {
    // Define schemas and register them via registerSchemas
    const schemas = {
      profileForm: z.object({
        email: z.string().email('Please enter a valid email'),
        username: z.string().min(3, 'Username must be at least 3 characters'),
      }),
    }

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
                attributes: {
                  schemaName: 'profileForm', // Reference by schema name
                },
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
                          label: 'Email',
                          type: 'email',
                          placeholder: 'example@email.com',
                          required: true,
                          disabled: false,
                        },
                      },
                      {
                        id: 'form-field-username',
                        type: 'FormField',
                        attributes: {
                          name: 'username',
                          label: 'Username',
                          type: 'text',
                          placeholder: 'username',
                          required: true,
                          disabled: false,
                        },
                      },
                      {
                        id: 'submit-button',
                        type: 'Button',
                        state: {
                          appearance: 'primary',
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
                              text: 'Submit',
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
    // Register schemas before rendering
    registerSchemas(schemas)
    return <SduiLayoutRenderer document={document} components={sduiComponents} />
  },
  parameters: {
    docs: {
      description: {
        story:
          'Demonstrates how to use schema names with registerSchemas. Schemas are registered via registerSchemas function, and the form references them using schemaName attribute. This approach is useful when you want to reuse schemas across multiple forms or when schemas are defined separately from the form document.',
      },
    },
  },
}

// Form with Disabled Fields
export const DisabledFields: Story = {
  render: () => {
    // Define schema for profile form with disabled email field
    const schemas = {
      profileForm: z.object({
        email: z.string().email('Please enter a valid email'),
        username: z.string().min(3, 'Username must be at least 3 characters'),
      }),
    }

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
                attributes: {
                  schemaName: 'profileForm',
                },
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
                          label: 'Email',
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
                          label: 'Username',
                          placeholder: 'Enter username',
                          required: true,
                        },
                      },
                      {
                        id: 'submit-button',
                        type: 'Button',
                        state: {
                          appearance: 'primary',
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
                              text: 'Submit',
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
    registerSchemas(schemas)
    return <SduiLayoutRenderer document={document} components={sduiComponents} />
  },
  parameters: {
    docs: {
      description: {
        story:
          "Shows how to include disabled fields in a form with zod validation. Disabled fields are read-only and cannot be edited by users. They are useful for displaying pre-filled information that shouldn't be changed, such as user email addresses in profile forms. Disabled fields are still included in the form submission and validated according to the schema.",
      },
    },
  },
}

// Form with Schema Mismatch (Runtime Validation Example)
export const SchemaMismatch: Story = {
  render: () => {
    // Define zod schema with only email and password
    const schemas = {
      loginForm: z.object({
        // min(1) should come before email() to show custom message for empty fields
        email: z.string().min(1, 'Please enter your email').email('Please enter a valid email'),
        password: z.string().min(8, 'Password must be at least 8 characters'),
      }),
    }

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
                attributes: {
                  schemaName: 'loginForm',
                },
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
                          label: 'Email',
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
                          label: 'Password',
                          type: 'password',
                          placeholder: 'Enter at least 8 characters',
                          required: true,
                          disabled: false,
                        },
                      },
                      {
                        id: 'form-field-username',
                        type: 'FormField',
                        attributes: {
                          name: 'username',
                          label: 'Username',
                          type: 'text',
                          placeholder: 'username',
                          required: true,
                          disabled: false,
                        },
                      },
                      {
                        id: 'submit-button',
                        type: 'Button',
                        state: {
                          appearance: 'primary',
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
                              text: 'Login',
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
    registerSchemas(schemas)
    return (
      <ErrorBoundary>
        <SduiLayoutRenderer document={document} components={sduiComponents} />
      </ErrorBoundary>
    )
  },
  parameters: {
    docs: {
      description: {
        story:
          'Demonstrates runtime validation when FormField names do not match the schema. The schema only defines "email" and "password" fields, but the form includes a "username" field that is not in the schema. This will throw an error and display it in the ErrorBoundary: "FormField with name "username" is not defined in the form schema. Expected fields: email, password". This helps catch mismatches between schema definitions and form fields during development.',
      },
    },
  },
}
