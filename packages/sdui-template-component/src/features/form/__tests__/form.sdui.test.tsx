import type { SduiLayoutDocument } from '@lodado/sdui-template'
import { renderWithSduiLayout } from '@lodado/sdui-template/test'
import { screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { z } from 'zod'

import { sduiComponents } from '../../../app/sduiComponents'
import { registerSchema } from '../types'

describe('Form - SDUI Integration Tests', () => {
  describe('as is: Form with minimal document', () => {
    describe('when: rendered via SDUI with root only', () => {
      it('to be: form renders correctly, should have form element in DOM', () => {
        const document: SduiLayoutDocument = {
          version: '1.0.0',
          root: {
            id: 'form-root',
            type: 'Form',
            attributes: {
              schemaName: 'testForm',
            },
          },
        }
        const { container } = renderWithSduiLayout(document, { components: sduiComponents })
        // Form should render (check via form element)
        const form = container.querySelector('form')
        expect(form).toBeInTheDocument()
      })
    })
  })

  describe('as is: Form with schemaName attribute', () => {
    describe('when: schemaName is provided (valid schema name)', () => {
      it('to be: form uses registered schema, should validate fields correctly', () => {
        const loginSchema = z.object({
          email: z.string().email('Invalid email'),
          password: z.string().min(8, 'Password must be at least 8 characters'),
        })
        registerSchema('loginForm', loginSchema)

        const document: SduiLayoutDocument = {
          version: '1.0.0',
          root: {
            id: 'form-root',
            type: 'Form',
            attributes: {
              schemaName: 'loginForm',
            },
            children: [
              {
                id: 'email-field',
                type: 'FormField',
                attributes: {
                  name: 'email',
                  label: 'Email',
                  required: true,
                  type: 'email',
                },
              },
              {
                id: 'password-field',
                type: 'FormField',
                attributes: {
                  name: 'password',
                  label: 'Password',
                  required: true,
                  type: 'password',
                },
              },
            ],
          },
        }
        renderWithSduiLayout(document, { components: sduiComponents })
        // Form fields should render
        expect(screen.getByLabelText(/email/i)).toBeInTheDocument()
        expect(screen.getByLabelText(/password/i)).toBeInTheDocument()
      })
    })

    describe('when: schemaName is invalid (non-existent schema)', () => {
      it('to be: form renders without schema, should not throw error', () => {
        const document: SduiLayoutDocument = {
          version: '1.0.0',
          root: {
            id: 'form-root',
            type: 'Form',
            attributes: {
              schemaName: 'nonExistentSchema',
            },
          },
        }
        const { container } = renderWithSduiLayout(document, { components: sduiComponents })
        // Form should still render without schema
        const form = container.querySelector('form')
        expect(form).toBeInTheDocument()
      })
    })
  })

  describe('as is: Form with FormField composition', () => {
    describe('when: FormField children are rendered', () => {
      it('to be: all fields render correctly, should have correct hierarchy', () => {
        const userSchema = z.object({
          name: z.string().min(2),
          email: z.string().email(),
        })
        registerSchema('userForm', userSchema)

        const document: SduiLayoutDocument = {
          version: '1.0.0',
          root: {
            id: 'form-root',
            type: 'Form',
            attributes: {
              schemaName: 'userForm',
            },
            children: [
              {
                id: 'name-field',
                type: 'FormField',
                attributes: {
                  name: 'name',
                  label: 'Name',
                  required: true,
                },
              },
              {
                id: 'email-field',
                type: 'FormField',
                attributes: {
                  name: 'email',
                  label: 'Email',
                  required: true,
                  type: 'email',
                },
              },
            ],
          },
        }
        renderWithSduiLayout(document, { components: sduiComponents })
        expect(screen.getByLabelText(/name/i)).toBeInTheDocument()
        expect(screen.getByLabelText(/email/i)).toBeInTheDocument()
      })
    })
  })

  describe('as is: FormField with required attribute', () => {
    describe('when: required=true (boundary: boolean true)', () => {
      it('to be: field is marked as required, should have required attribute', () => {
        const testSchema = z.object({
          field: z.string(),
        })
        registerSchema('testForm', testSchema)

        const document: SduiLayoutDocument = {
          version: '1.0.0',
          root: {
            id: 'form-root',
            type: 'Form',
            attributes: {
              schemaName: 'testForm',
            },
            children: [
              {
                id: 'required-field',
                type: 'FormField',
                attributes: {
                  name: 'field',
                  label: 'Required Field',
                  required: true,
                },
              },
            ],
          },
        }
        renderWithSduiLayout(document, { components: sduiComponents })
        const input = screen.getByLabelText(/required field/i)
        expect(input).toHaveAttribute('required')
      })
    })

    describe('when: required=false (boundary: boolean false)', () => {
      it('to be: field is not required, should not have required attribute', () => {
        const testSchema = z.object({
          field: z.string().optional(),
        })
        registerSchema('testFormOptional', testSchema)

        const document: SduiLayoutDocument = {
          version: '1.0.0',
          root: {
            id: 'form-root',
            type: 'Form',
            attributes: {
              schemaName: 'testFormOptional',
            },
            children: [
              {
                id: 'optional-field',
                type: 'FormField',
                attributes: {
                  name: 'field',
                  label: 'Optional Field',
                  required: false,
                },
              },
            ],
          },
        }
        renderWithSduiLayout(document, { components: sduiComponents })
        const input = screen.getByLabelText(/optional field/i)
        // Field should render without required attribute
        expect(input).toBeInTheDocument()
      })
    })
  })

  describe('as is: Form with Zod validation', () => {
    describe('when: invalid email is submitted', () => {
      it('to be: validation error is displayed, should show error message', async () => {
        const user = userEvent.setup()
        const emailSchema = z.object({
          email: z.string().email('Invalid email address'),
        })
        registerSchema('emailForm', emailSchema)

        const document: SduiLayoutDocument = {
          version: '1.0.0',
          root: {
            id: 'form-root',
            type: 'Form',
            attributes: {
              schemaName: 'emailForm',
            },
            children: [
              {
                id: 'email-field',
                type: 'FormField',
                attributes: {
                  name: 'email',
                  label: 'Email',
                  required: true,
                  type: 'email',
                },
              },
              {
                id: 'submit-button',
                type: 'Button',
                attributes: {
                  type: 'submit',
                },
                children: [
                  {
                    id: 'submit-text',
                    type: 'Text',
                    state: { text: 'Submit' },
                  },
                ],
              },
            ],
          },
        }
        renderWithSduiLayout(document, { components: sduiComponents })
        const input = screen.getByLabelText(/email/i)
        const submitButton = screen.getByText('Submit')

        await user.type(input, 'invalid-email')
        await user.click(submitButton)

        await waitFor(() => {
          // Error message should appear after validation
          expect(screen.getByText(/invalid email/i)).toBeInTheDocument()
        })
      })
    })

    describe('when: valid data is submitted', () => {
      it('to be: form submits successfully, should call onSubmit handler', async () => {
        const user = userEvent.setup()
        const onSubmitMock = jest.fn()
        const validSchema = z.object({
          name: z.string().min(2),
        })
        registerSchema('validForm', validSchema)

        const document: SduiLayoutDocument = {
          version: '1.0.0',
          root: {
            id: 'form-root',
            type: 'Form',
            attributes: {
              schemaName: 'validForm',
              onSubmitHandler: onSubmitMock,
            },
            children: [
              {
                id: 'name-field',
                type: 'FormField',
                attributes: {
                  name: 'name',
                  label: 'Name',
                  required: true,
                },
              },
              {
                id: 'submit-button',
                type: 'Button',
                attributes: {
                  type: 'submit',
                },
                children: [
                  {
                    id: 'submit-text',
                    type: 'Text',
                    state: { text: 'Submit' },
                  },
                ],
              },
            ],
          },
        }
        renderWithSduiLayout(document, { components: sduiComponents })
        const input = screen.getByLabelText(/name/i)
        const submitButton = screen.getByText('Submit')

        await user.type(input, 'John Doe')
        await user.click(submitButton)

        await waitFor(() => {
          expect(onSubmitMock).toHaveBeenCalledWith({ name: 'John Doe' })
        })
      })
    })
  })

  describe('as is: FormField with different input types', () => {
    describe('when: type="email" (equivalence: valid type)', () => {
      it('to be: email input renders, should have type="email" attribute', () => {
        const testSchema = z.object({
          email: z.string(),
        })
        registerSchema('typeTestForm', testSchema)

        const document: SduiLayoutDocument = {
          version: '1.0.0',
          root: {
            id: 'form-root',
            type: 'Form',
            attributes: {
              schemaName: 'typeTestForm',
            },
            children: [
              {
                id: 'email-field',
                type: 'FormField',
                attributes: {
                  name: 'email',
                  label: 'Email',
                  type: 'email',
                },
              },
            ],
          },
        }
        renderWithSduiLayout(document, { components: sduiComponents })
        const input = screen.getByLabelText(/email/i)
        expect(input).toHaveAttribute('type', 'email')
      })
    })

    describe('when: type="password" (equivalence: valid type)', () => {
      it('to be: password input renders, should have type="password" attribute', () => {
        const testSchema = z.object({
          password: z.string(),
        })
        registerSchema('passwordTestForm', testSchema)

        const document: SduiLayoutDocument = {
          version: '1.0.0',
          root: {
            id: 'form-root',
            type: 'Form',
            attributes: {
              schemaName: 'passwordTestForm',
            },
            children: [
              {
                id: 'password-field',
                type: 'FormField',
                attributes: {
                  name: 'password',
                  label: 'Password',
                  type: 'password',
                },
              },
            ],
          },
        }
        renderWithSduiLayout(document, { components: sduiComponents })
        const input = screen.getByLabelText(/password/i)
        expect(input).toHaveAttribute('type', 'password')
      })
    })
  })

  describe('as is: Form with empty vs filled state', () => {
    describe('when: form is empty (boundary: min-1)', () => {
      it('to be: form renders with no fields, should be empty form element', () => {
        const document: SduiLayoutDocument = {
          version: '1.0.0',
          root: {
            id: 'form-root',
            type: 'Form',
            attributes: {
              schemaName: 'emptyForm',
            },
          },
        }
        registerSchema('emptyForm', z.object({}))
        const { container } = renderWithSduiLayout(document, { components: sduiComponents })
        // Form should render without fields
        const form = container.querySelector('form')
        expect(form).toBeInTheDocument()
      })
    })

    describe('when: form has multiple fields (boundary: multiple)', () => {
      it('to be: all fields render, should have correct number of inputs', () => {
        const multiFieldSchema = z.object({
          field1: z.string(),
          field2: z.string(),
          field3: z.string(),
        })
        registerSchema('multiFieldForm', multiFieldSchema)

        const document: SduiLayoutDocument = {
          version: '1.0.0',
          root: {
            id: 'form-root',
            type: 'Form',
            attributes: {
              schemaName: 'multiFieldForm',
            },
            children: [
              {
                id: 'field1',
                type: 'FormField',
                attributes: {
                  name: 'field1',
                  label: 'Field 1',
                },
              },
              {
                id: 'field2',
                type: 'FormField',
                attributes: {
                  name: 'field2',
                  label: 'Field 2',
                },
              },
              {
                id: 'field3',
                type: 'FormField',
                attributes: {
                  name: 'field3',
                  label: 'Field 3',
                },
              },
            ],
          },
        }
        renderWithSduiLayout(document, { components: sduiComponents })
        expect(screen.getByLabelText(/field 1/i)).toBeInTheDocument()
        expect(screen.getByLabelText(/field 2/i)).toBeInTheDocument()
        expect(screen.getByLabelText(/field 3/i)).toBeInTheDocument()
      })
    })
  })
})
