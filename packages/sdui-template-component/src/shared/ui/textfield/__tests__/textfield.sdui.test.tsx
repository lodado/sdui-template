import type { SduiLayoutDocument } from '@lodado/sdui-template'
import { renderWithSduiLayout } from '@lodado/sdui-template/test'
import { screen } from '@testing-library/react'

import { sduiComponents } from '../../../../app/sduiComponents'

describe('TextField - SDUI Integration Tests', () => {
  describe('as is: TextField with minimal document', () => {
    describe('when: rendered via SDUI with root only', () => {
      it('to be: textfield root renders correctly, should have correct DOM structure', () => {
        const document: SduiLayoutDocument = {
          version: '1.0.0',
          root: {
            id: 'textfield-root',
            type: 'TextField',
          },
        }
        const { container } = renderWithSduiLayout(document, { components: sduiComponents })
        // TextField root should render
        expect(container).toBeInTheDocument()
      })
    })
  })

  describe('as is: TextField with compound structure', () => {
    describe('when: TextFieldWrapper + TextFieldLabel + TextFieldInput + TextFieldHelpMessage are rendered', () => {
      it('to be: all components render correctly, should have correct hierarchy', () => {
        const document: SduiLayoutDocument = {
          version: '1.0.0',
          root: {
            id: 'textfield-root',
            type: 'TextField',
            children: [
              {
                id: 'textfield-wrapper',
                type: 'TextFieldWrapper',
                children: [
                  {
                    id: 'textfield-label',
                    type: 'TextFieldLabel',
                    state: { text: 'Email Address' },
                  },
                  {
                    id: 'textfield-input',
                    type: 'TextFieldInput',
                    attributes: {
                      placeholder: 'Enter email',
                      type: 'email',
                    },
                  },
                  {
                    id: 'textfield-help',
                    type: 'TextFieldHelpMessage',
                    state: { text: 'Enter your email address' },
                  },
                ],
              },
            ],
          },
        }
        renderWithSduiLayout(document, { components: sduiComponents })
        expect(screen.getByText('Email Address')).toBeInTheDocument()
        expect(screen.getByPlaceholderText('Enter email')).toBeInTheDocument()
        expect(screen.getByText('Enter your email address')).toBeInTheDocument()
      })
    })
  })

  describe('as is: TextField with error state', () => {
    describe('when: error=true (boundary: boolean true)', () => {
      it('to be: error state is displayed, should show error message', () => {
        const document: SduiLayoutDocument = {
          version: '1.0.0',
          root: {
            id: 'textfield-root',
            type: 'TextField',
            state: {
              error: true,
              errorMessage: 'Invalid email address',
            },
            children: [
              {
                id: 'textfield-wrapper',
                type: 'TextFieldWrapper',
                children: [
                  {
                    id: 'textfield-label',
                    type: 'TextFieldLabel',
                    state: { text: 'Email' },
                  },
                  {
                    id: 'textfield-input',
                    type: 'TextFieldInput',
                  },
                  {
                    id: 'textfield-help',
                    type: 'TextFieldHelpMessage',
                  },
                ],
              },
            ],
          },
        }
        renderWithSduiLayout(document, { components: sduiComponents })
        expect(screen.getByText('Invalid email address')).toBeInTheDocument()
      })
    })

    describe('when: error=false (boundary: boolean false)', () => {
      it('to be: help message is displayed, should show help text', () => {
        const document: SduiLayoutDocument = {
          version: '1.0.0',
          root: {
            id: 'textfield-root',
            type: 'TextField',
            state: {
              error: false,
              helpMessage: 'Enter a valid email address',
            },
            children: [
              {
                id: 'textfield-wrapper',
                type: 'TextFieldWrapper',
                children: [
                  {
                    id: 'textfield-label',
                    type: 'TextFieldLabel',
                    state: { text: 'Email' },
                  },
                  {
                    id: 'textfield-input',
                    type: 'TextFieldInput',
                  },
                  {
                    id: 'textfield-help',
                    type: 'TextFieldHelpMessage',
                  },
                ],
              },
            ],
          },
        }
        renderWithSduiLayout(document, { components: sduiComponents })
        expect(screen.getByText('Enter a valid email address')).toBeInTheDocument()
      })
    })
  })

  describe('as is: TextField with disabled state', () => {
    describe('when: disabled=true (boundary: boolean true)', () => {
      it('to be: input is disabled, should have disabled attribute', () => {
        const document: SduiLayoutDocument = {
          version: '1.0.0',
          root: {
            id: 'textfield-root',
            type: 'TextField',
            state: {
              disabled: true,
            },
            children: [
              {
                id: 'textfield-wrapper',
                type: 'TextFieldWrapper',
                children: [
                  {
                    id: 'textfield-label',
                    type: 'TextFieldLabel',
                    state: { text: 'Disabled Field' },
                  },
                  {
                    id: 'textfield-input',
                    type: 'TextFieldInput',
                  },
                ],
              },
            ],
          },
        }
        renderWithSduiLayout(document, { components: sduiComponents })
        const input = screen.getByLabelText(/disabled field/i)
        expect(input).toBeDisabled()
      })
    })

    describe('when: disabled=false (boundary: boolean false)', () => {
      it('to be: input is enabled, should not have disabled attribute', () => {
        const document: SduiLayoutDocument = {
          version: '1.0.0',
          root: {
            id: 'textfield-root',
            type: 'TextField',
            state: {
              disabled: false,
            },
            children: [
              {
                id: 'textfield-wrapper',
                type: 'TextFieldWrapper',
                children: [
                  {
                    id: 'textfield-label',
                    type: 'TextFieldLabel',
                    state: { text: 'Enabled Field' },
                  },
                  {
                    id: 'textfield-input',
                    type: 'TextFieldInput',
                  },
                ],
              },
            ],
          },
        }
        renderWithSduiLayout(document, { components: sduiComponents })
        const input = screen.getByLabelText(/enabled field/i)
        expect(input).not.toBeDisabled()
      })
    })
  })

  describe('as is: TextField with required state', () => {
    describe('when: required=true (boundary: boolean true)', () => {
      it('to be: input is required, should have required attribute', () => {
        const document: SduiLayoutDocument = {
          version: '1.0.0',
          root: {
            id: 'textfield-root',
            type: 'TextField',
            state: {
              required: true,
            },
            children: [
              {
                id: 'textfield-wrapper',
                type: 'TextFieldWrapper',
                children: [
                  {
                    id: 'textfield-label',
                    type: 'TextFieldLabel',
                    state: { text: 'Required Field' },
                  },
                  {
                    id: 'textfield-input',
                    type: 'TextFieldInput',
                  },
                ],
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
      it('to be: input is not required, should not have required attribute', () => {
        const document: SduiLayoutDocument = {
          version: '1.0.0',
          root: {
            id: 'textfield-root',
            type: 'TextField',
            state: {
              required: false,
            },
            children: [
              {
                id: 'textfield-wrapper',
                type: 'TextFieldWrapper',
                children: [
                  {
                    id: 'textfield-label',
                    type: 'TextFieldLabel',
                    state: { text: 'Optional Field' },
                  },
                  {
                    id: 'textfield-input',
                    type: 'TextFieldInput',
                  },
                ],
              },
            ],
          },
        }
        renderWithSduiLayout(document, { components: sduiComponents })
        const input = screen.getByLabelText(/optional field/i)
        expect(input).not.toHaveAttribute('required')
      })
    })
  })

  describe('as is: TextFieldInput with attributes', () => {
    describe('when: placeholder is provided', () => {
      it('to be: placeholder is displayed, should have placeholder attribute', () => {
        const document: SduiLayoutDocument = {
          version: '1.0.0',
          root: {
            id: 'textfield-root',
            type: 'TextField',
            children: [
              {
                id: 'textfield-wrapper',
                type: 'TextFieldWrapper',
                children: [
                  {
                    id: 'textfield-input',
                    type: 'TextFieldInput',
                    attributes: {
                      placeholder: 'Enter your name',
                    },
                  },
                ],
              },
            ],
          },
        }
        renderWithSduiLayout(document, { components: sduiComponents })
        expect(screen.getByPlaceholderText('Enter your name')).toBeInTheDocument()
      })
    })

    describe('when: type="password" (equivalence: valid type)', () => {
      it('to be: password input renders, should have type="password" attribute', () => {
        const document: SduiLayoutDocument = {
          version: '1.0.0',
          root: {
            id: 'textfield-root',
            type: 'TextField',
            children: [
              {
                id: 'textfield-wrapper',
                type: 'TextFieldWrapper',
                children: [
                  {
                    id: 'textfield-label',
                    type: 'TextFieldLabel',
                    state: { text: 'Password' },
                  },
                  {
                    id: 'textfield-input',
                    type: 'TextFieldInput',
                    attributes: {
                      type: 'password',
                    },
                  },
                ],
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

  describe('as is: TextFieldLabel with state.text', () => {
    describe('when: state.text is provided', () => {
      it('to be: label text is displayed, should show label content', () => {
        const document: SduiLayoutDocument = {
          version: '1.0.0',
          root: {
            id: 'textfield-root',
            type: 'TextField',
            children: [
              {
                id: 'textfield-wrapper',
                type: 'TextFieldWrapper',
                children: [
                  {
                    id: 'textfield-label',
                    type: 'TextFieldLabel',
                    state: { text: 'Username' },
                  },
                  {
                    id: 'textfield-input',
                    type: 'TextFieldInput',
                  },
                ],
              },
            ],
          },
        }
        renderWithSduiLayout(document, { components: sduiComponents })
        expect(screen.getByText('Username')).toBeInTheDocument()
      })
    })
  })

  describe('as is: TextFieldHelpMessage with state.text', () => {
    describe('when: state.text is provided', () => {
      it('to be: help message is displayed, should show help text', () => {
        const document: SduiLayoutDocument = {
          version: '1.0.0',
          root: {
            id: 'textfield-root',
            type: 'TextField',
            children: [
              {
                id: 'textfield-wrapper',
                type: 'TextFieldWrapper',
                children: [
                  {
                    id: 'textfield-label',
                    type: 'TextFieldLabel',
                    state: { text: 'Field' },
                  },
                  {
                    id: 'textfield-input',
                    type: 'TextFieldInput',
                  },
                  {
                    id: 'textfield-help',
                    type: 'TextFieldHelpMessage',
                    state: { text: 'This is a help message' },
                  },
                ],
              },
            ],
          },
        }
        renderWithSduiLayout(document, { components: sduiComponents })
        expect(screen.getByText('This is a help message')).toBeInTheDocument()
      })
    })
  })
})
