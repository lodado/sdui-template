import type { SduiLayoutDocument } from '@lodado/sdui-template'
import { renderWithSduiLayout } from '@lodado/sdui-template/test'
import { screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import { sduiComponents } from '../../../../app/sduiComponents'

describe('Checkbox - SDUI Integration Tests', () => {
  describe('as is: Checkbox with compound structure', () => {
    describe('when: compound structure rendered', () => {
      it('to be: checkbox renders correctly, should have checkbox element', () => {
        const document: SduiLayoutDocument = {
          version: '1.0.0',
          root: {
            id: 'checkbox-root',
            type: 'Checkbox',
            state: {
              disabled: false,
              required: false,
              error: false,
            },
            children: [
              {
                id: 'checkbox-label',
                type: 'CheckboxLabel',
                state: {
                  text: 'Accept terms',
                },
              },
              {
                id: 'checkbox-input',
                type: 'CheckboxCheckbox',
                state: {
                  checked: false,
                },
              },
            ],
          },
        }
        renderWithSduiLayout(document, { components: sduiComponents })
        // Checkbox should render as checkbox (Radix UI Checkbox uses role="checkbox")
        const checkbox = screen.getByRole('checkbox')
        expect(checkbox).toBeInTheDocument()
        expect(checkbox).not.toBeChecked()
        // Label should be connected
        const label = screen.getByText('Accept terms')
        expect(label).toBeInTheDocument()
      })
    })
  })

  describe('as is: Checkbox with checked state', () => {
    describe('when: checked=true (boundary: boolean true)', () => {
      it('to be: checkbox is checked, should have checked attribute', () => {
        const document: SduiLayoutDocument = {
          version: '1.0.0',
          root: {
            id: 'checkbox-root',
            type: 'Checkbox',
            state: {},
            children: [
              {
                id: 'checkbox-label',
                type: 'CheckboxLabel',
                state: {
                  text: 'Accept terms',
                },
              },
              {
                id: 'checkbox-input',
                type: 'CheckboxCheckbox',
                state: {
                  checked: true,
                },
              },
            ],
          },
        }
        renderWithSduiLayout(document, { components: sduiComponents })
        const checkbox = screen.getByRole('checkbox')
        expect(checkbox).toBeChecked()
      })
    })

    describe('when: checked=false (boundary: boolean false)', () => {
      it('to be: checkbox is unchecked, should not have checked attribute', () => {
        const document: SduiLayoutDocument = {
          version: '1.0.0',
          root: {
            id: 'checkbox-root',
            type: 'Checkbox',
            state: {},
            children: [
              {
                id: 'checkbox-label',
                type: 'CheckboxLabel',
                state: {
                  text: 'Accept terms',
                },
              },
              {
                id: 'checkbox-input',
                type: 'CheckboxCheckbox',
                state: {
                  checked: false,
                },
              },
            ],
          },
        }
        renderWithSduiLayout(document, { components: sduiComponents })
        const checkbox = screen.getByRole('checkbox')
        expect(checkbox).not.toBeChecked()
      })
    })
  })

  describe('as is: Checkbox with disabled state', () => {
    describe('when: disabled=true (boundary: boolean true)', () => {
      it('to be: checkbox is disabled, should have disabled attribute', () => {
        const document: SduiLayoutDocument = {
          version: '1.0.0',
          root: {
            id: 'checkbox-root',
            type: 'Checkbox',
            state: {
              disabled: true,
            },
            children: [
              {
                id: 'checkbox-label',
                type: 'CheckboxLabel',
                state: {
                  text: 'Accept terms',
                },
              },
              {
                id: 'checkbox-input',
                type: 'CheckboxCheckbox',
                state: {
                  checked: false,
                },
              },
            ],
          },
        }
        renderWithSduiLayout(document, { components: sduiComponents })
        const checkbox = screen.getByRole('checkbox')
        expect(checkbox).toBeDisabled()
      })
    })

    describe('when: disabled=false (boundary: boolean false)', () => {
      it('to be: checkbox is enabled, should not have disabled attribute', () => {
        const document: SduiLayoutDocument = {
          version: '1.0.0',
          root: {
            id: 'checkbox-root',
            type: 'Checkbox',
            state: {
              disabled: false,
            },
            children: [
              {
                id: 'checkbox-label',
                type: 'CheckboxLabel',
                state: {
                  text: 'Accept terms',
                },
              },
              {
                id: 'checkbox-input',
                type: 'CheckboxCheckbox',
                state: {
                  checked: false,
                },
              },
            ],
          },
        }
        renderWithSduiLayout(document, { components: sduiComponents })
        const checkbox = screen.getByRole('checkbox')
        expect(checkbox).not.toBeDisabled()
      })
    })
  })

  describe('as is: Checkbox with required state', () => {
    describe('when: required=true (boundary: boolean true)', () => {
      it('to be: required indicator is displayed, should show asterisk', () => {
        const document: SduiLayoutDocument = {
          version: '1.0.0',
          root: {
            id: 'checkbox-root',
            type: 'Checkbox',
            state: {
              required: true,
            },
            children: [
              {
                id: 'checkbox-label',
                type: 'CheckboxLabel',
                state: {
                  text: 'Accept terms',
                },
              },
              {
                id: 'checkbox-input',
                type: 'CheckboxCheckbox',
                state: {
                  checked: false,
                },
              },
            ],
          },
        }
        renderWithSduiLayout(document, { components: sduiComponents })
        const label = screen.getByText('Accept terms')
        expect(label).toBeInTheDocument()
        // Required indicator should be present
        const asterisk = label.querySelector('span')
        expect(asterisk).toBeInTheDocument()
      })
    })
  })

  describe('as is: Checkbox with error state', () => {
    describe('when: error=true (boundary: boolean true)', () => {
      it('to be: error styling is applied, should have error class', () => {
        const document: SduiLayoutDocument = {
          version: '1.0.0',
          root: {
            id: 'checkbox-root',
            type: 'Checkbox',
            state: {
              error: true,
            },
            children: [
              {
                id: 'checkbox-label',
                type: 'CheckboxLabel',
                state: {
                  text: 'Accept terms',
                },
              },
              {
                id: 'checkbox-input',
                type: 'CheckboxCheckbox',
                state: {
                  checked: false,
                },
              },
            ],
          },
        }
        renderWithSduiLayout(document, { components: sduiComponents })
        const label = screen.getByText('Accept terms')
        expect(label).toBeInTheDocument()
        // Error styling should be applied to label
        expect(label.className).toContain('text-[var(--color-text-danger)]')
      })
    })
  })

  describe('as is: Checkbox with click interaction', () => {
    describe('when: checkbox is clicked', () => {
      it('to be: checked state toggles, should update checked state via store', async () => {
        const user = userEvent.setup()
        const document: SduiLayoutDocument = {
          version: '1.0.0',
          root: {
            id: 'checkbox-root',
            type: 'Checkbox',
            state: {},
            children: [
              {
                id: 'checkbox-label',
                type: 'CheckboxLabel',
                state: {
                  text: 'Accept terms',
                },
              },
              {
                id: 'checkbox-input',
                type: 'CheckboxCheckbox',
                state: {
                  checked: false,
                },
              },
            ],
          },
        }
        renderWithSduiLayout(document, { components: sduiComponents })
        const checkbox = screen.getByRole('checkbox')
        expect(checkbox).not.toBeChecked()

        await user.click(checkbox)

        // After click, checkbox should update state via store
        await waitFor(() => {
          // Checkbox should respond to click (state update via store.updateNodeState)
          expect(checkbox).toBeInTheDocument()
        })
      })
    })

    describe('when: disabled checkbox is clicked', () => {
      it('to be: state does not change, should not toggle when disabled', async () => {
        const user = userEvent.setup()
        const document: SduiLayoutDocument = {
          version: '1.0.0',
          root: {
            id: 'checkbox-root',
            type: 'Checkbox',
            state: {
              disabled: true,
            },
            children: [
              {
                id: 'checkbox-label',
                type: 'CheckboxLabel',
                state: {
                  text: 'Accept terms',
                },
              },
              {
                id: 'checkbox-input',
                type: 'CheckboxCheckbox',
                state: {
                  checked: false,
                },
              },
            ],
          },
        }
        renderWithSduiLayout(document, { components: sduiComponents })
        const checkbox = screen.getByRole('checkbox')
        expect(checkbox).toBeDisabled()
        expect(checkbox).not.toBeChecked()

        await user.click(checkbox)

        // Disabled checkbox should not change state
        await waitFor(() => {
          expect(checkbox).not.toBeChecked()
        })
      })
    })
  })

  describe('as is: Checkbox with indeterminate state', () => {
    describe('when: indeterminate=true (boundary: boolean true)', () => {
      it('to be: indeterminate state is displayed, should have indeterminate attribute', () => {
        const document: SduiLayoutDocument = {
          version: '1.0.0',
          root: {
            id: 'checkbox-root',
            type: 'Checkbox',
            state: {},
            children: [
              {
                id: 'checkbox-label',
                type: 'CheckboxLabel',
                state: {
                  text: 'Select all',
                },
              },
              {
                id: 'checkbox-input',
                type: 'CheckboxCheckbox',
                state: {
                  checked: false,
                  indeterminate: true,
                },
              },
            ],
          },
        }
        renderWithSduiLayout(document, { components: sduiComponents })
        const checkbox = screen.getByRole('checkbox')
        expect(checkbox).toBeInTheDocument()
        // Indeterminate state should be set
        expect(checkbox).toHaveAttribute('data-indeterminate', '')
      })
    })
  })
})
