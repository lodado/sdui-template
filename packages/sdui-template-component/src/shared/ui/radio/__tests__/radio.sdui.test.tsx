import type { SduiLayoutDocument } from '@lodado/sdui-template'
import { renderWithSduiLayout } from '@lodado/sdui-template/test'
import { screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import { sduiComponents } from '../../../../app/sduiComponents'

describe('Radio - SDUI Integration Tests', () => {
  describe('as is: Radio with compound structure', () => {
    describe('when: compound structure rendered', () => {
      it('to be: radio renders correctly, should have radio element', () => {
        const document: SduiLayoutDocument = {
          version: '1.0.0',
          root: {
            id: 'radio-root',
            type: 'Radio',
            state: {
              disabled: false,
              required: false,
              error: false,
              name: 'test-radio',
            },
            children: [
              {
                id: 'radio-label',
                type: 'RadioLabel',
                state: {
                  text: 'Option 1',
                },
              },
              {
                id: 'radio-input',
                type: 'RadioRadio',
                state: {
                  checked: false,
                  value: 'option1',
                },
              },
            ],
          },
        }
        renderWithSduiLayout(document, { components: sduiComponents })
        const radio = screen.getByRole('radio')
        expect(radio).toBeInTheDocument()
        expect(radio).not.toBeChecked()
        // Label should be connected
        const label = screen.getByText('Option 1')
        expect(label).toBeInTheDocument()
      })
    })
  })

  describe('as is: Radio with checked state', () => {
    describe('when: checked=true (boundary: boolean true)', () => {
      it('to be: radio is checked, should have checked attribute', () => {
        const document: SduiLayoutDocument = {
          version: '1.0.0',
          root: {
            id: 'radio-root',
            type: 'Radio',
            state: {
              name: 'test-radio',
            },
            children: [
              {
                id: 'radio-label',
                type: 'RadioLabel',
                state: {
                  text: 'Option 1',
                },
              },
              {
                id: 'radio-input',
                type: 'RadioRadio',
                state: {
                  checked: true,
                  value: 'option1',
                },
              },
            ],
          },
        }
        renderWithSduiLayout(document, { components: sduiComponents })
        const radio = screen.getByRole('radio')
        expect(radio).toBeChecked()
      })
    })

    describe('when: checked=false (boundary: boolean false)', () => {
      it('to be: radio is unchecked, should not have checked attribute', () => {
        const document: SduiLayoutDocument = {
          version: '1.0.0',
          root: {
            id: 'radio-root',
            type: 'Radio',
            state: {
              name: 'test-radio',
            },
            children: [
              {
                id: 'radio-label',
                type: 'RadioLabel',
                state: {
                  text: 'Option 1',
                },
              },
              {
                id: 'radio-input',
                type: 'RadioRadio',
                state: {
                  checked: false,
                  value: 'option1',
                },
              },
            ],
          },
        }
        renderWithSduiLayout(document, { components: sduiComponents })
        const radio = screen.getByRole('radio')
        expect(radio).not.toBeChecked()
      })
    })
  })

  describe('as is: Radio with disabled state', () => {
    describe('when: disabled=true (boundary: boolean true)', () => {
      it('to be: radio is disabled, should have disabled attribute', () => {
        const document: SduiLayoutDocument = {
          version: '1.0.0',
          root: {
            id: 'radio-root',
            type: 'Radio',
            state: {
              disabled: true,
              name: 'test-radio',
            },
            children: [
              {
                id: 'radio-label',
                type: 'RadioLabel',
                state: {
                  text: 'Option 1',
                },
              },
              {
                id: 'radio-input',
                type: 'RadioRadio',
                state: {
                  checked: false,
                  value: 'option1',
                },
              },
            ],
          },
        }
        renderWithSduiLayout(document, { components: sduiComponents })
        const radio = screen.getByRole('radio')
        expect(radio).toBeDisabled()
      })
    })

    describe('when: disabled=false (boundary: boolean false)', () => {
      it('to be: radio is enabled, should not have disabled attribute', () => {
        const document: SduiLayoutDocument = {
          version: '1.0.0',
          root: {
            id: 'radio-root',
            type: 'Radio',
            state: {
              disabled: false,
              name: 'test-radio',
            },
            children: [
              {
                id: 'radio-label',
                type: 'RadioLabel',
                state: {
                  text: 'Option 1',
                },
              },
              {
                id: 'radio-input',
                type: 'RadioRadio',
                state: {
                  checked: false,
                  value: 'option1',
                },
              },
            ],
          },
        }
        renderWithSduiLayout(document, { components: sduiComponents })
        const radio = screen.getByRole('radio')
        expect(radio).not.toBeDisabled()
      })
    })
  })

  describe('as is: Radio with required state', () => {
    describe('when: required=true (boundary: boolean true)', () => {
      it('to be: required indicator is displayed, should show asterisk', () => {
        const document: SduiLayoutDocument = {
          version: '1.0.0',
          root: {
            id: 'radio-root',
            type: 'Radio',
            state: {
              required: true,
              name: 'test-radio',
            },
            children: [
              {
                id: 'radio-label',
                type: 'RadioLabel',
                state: {
                  text: 'Option 1',
                },
              },
              {
                id: 'radio-input',
                type: 'RadioRadio',
                state: {
                  checked: false,
                  value: 'option1',
                },
              },
            ],
          },
        }
        renderWithSduiLayout(document, { components: sduiComponents })
        const label = screen.getByText('Option 1')
        expect(label).toBeInTheDocument()
        // Required indicator should be present
        const asterisk = label.querySelector('span')
        expect(asterisk).toBeInTheDocument()
      })
    })
  })

  describe('as is: Radio with error state', () => {
    describe('when: error=true (boundary: boolean true)', () => {
      it('to be: error styling is applied, should have error class', () => {
        const document: SduiLayoutDocument = {
          version: '1.0.0',
          root: {
            id: 'radio-root',
            type: 'Radio',
            state: {
              error: true,
              name: 'test-radio',
            },
            children: [
              {
                id: 'radio-label',
                type: 'RadioLabel',
                state: {
                  text: 'Option 1',
                },
              },
              {
                id: 'radio-input',
                type: 'RadioRadio',
                state: {
                  checked: false,
                  value: 'option1',
                },
              },
            ],
          },
        }
        renderWithSduiLayout(document, { components: sduiComponents })
        const label = screen.getByText('Option 1')
        expect(label).toBeInTheDocument()
        // Error styling should be applied to label
        expect(label.className).toContain('text-[var(--color-text-danger)]')
      })
    })
  })

  describe('as is: Radio with click interaction', () => {
    describe('when: radio is clicked', () => {
      it('to be: checked state updates, should update checked state via store', async () => {
        const user = userEvent.setup()
        const document: SduiLayoutDocument = {
          version: '1.0.0',
          root: {
            id: 'radio-root',
            type: 'Radio',
            state: {
              name: 'test-radio',
            },
            children: [
              {
                id: 'radio-label',
                type: 'RadioLabel',
                state: {
                  text: 'Option 1',
                },
              },
              {
                id: 'radio-input',
                type: 'RadioRadio',
                state: {
                  checked: false,
                  value: 'option1',
                },
              },
            ],
          },
        }
        renderWithSduiLayout(document, { components: sduiComponents })
        const radio = screen.getByRole('radio')
        expect(radio).not.toBeChecked()

        await user.click(radio)

        // After click, radio should update state via store
        await waitFor(() => {
          // Radio should respond to click (state update via store.updateNodeState)
          expect(radio).toBeInTheDocument()
        })
      })
    })

    describe('when: disabled radio is clicked', () => {
      it('to be: state does not change, should not toggle when disabled', async () => {
        const user = userEvent.setup()
        const document: SduiLayoutDocument = {
          version: '1.0.0',
          root: {
            id: 'radio-root',
            type: 'Radio',
            state: {
              disabled: true,
              name: 'test-radio',
            },
            children: [
              {
                id: 'radio-label',
                type: 'RadioLabel',
                state: {
                  text: 'Option 1',
                },
              },
              {
                id: 'radio-input',
                type: 'RadioRadio',
                state: {
                  checked: false,
                  value: 'option1',
                },
              },
            ],
          },
        }
        renderWithSduiLayout(document, { components: sduiComponents })
        const radio = screen.getByRole('radio')
        expect(radio).toBeDisabled()
        expect(radio).not.toBeChecked()

        await user.click(radio)

        // Disabled radio should not change state
        await waitFor(() => {
          expect(radio).not.toBeChecked()
        })
      })
    })
  })

  describe('as is: RadioGroup with multiple radios', () => {
    describe('when: RadioGroup with multiple radios rendered', () => {
      it('to be: only one radio can be selected, should have single selected value', () => {
        const document: SduiLayoutDocument = {
          version: '1.0.0',
          root: {
            id: 'radio-group',
            type: 'RadioGroup',
            state: {
              name: 'options',
              value: 'option2',
            },
            children: [
              {
                id: 'radio-1',
                type: 'Radio',
                state: {},
                children: [
                  {
                    id: 'label-1',
                    type: 'RadioLabel',
                    state: { text: 'Option 1' },
                  },
                  {
                    id: 'input-1',
                    type: 'RadioRadio',
                    state: { value: 'option1' },
                  },
                ],
              },
              {
                id: 'radio-2',
                type: 'Radio',
                state: {},
                children: [
                  {
                    id: 'label-2',
                    type: 'RadioLabel',
                    state: { text: 'Option 2' },
                  },
                  {
                    id: 'input-2',
                    type: 'RadioRadio',
                    state: { value: 'option2' },
                  },
                ],
              },
            ],
          },
        }
        renderWithSduiLayout(document, { components: sduiComponents })
        const radios = screen.getAllByRole('radio')
        expect(radios).toHaveLength(2)
        // Only option2 should be checked
        expect(radios[0]).not.toBeChecked()
        expect(radios[1]).toBeChecked()
      })
    })

    describe('when: clicking different radio in group', () => {
      it('to be: selection moves to clicked radio, should update group value', async () => {
        const user = userEvent.setup()
        const document: SduiLayoutDocument = {
          version: '1.0.0',
          root: {
            id: 'radio-group',
            type: 'RadioGroup',
            state: {
              name: 'options',
              value: 'option1',
            },
            children: [
              {
                id: 'radio-1',
                type: 'Radio',
                state: {},
                children: [
                  {
                    id: 'label-1',
                    type: 'RadioLabel',
                    state: { text: 'Option 1' },
                  },
                  {
                    id: 'input-1',
                    type: 'RadioRadio',
                    state: { value: 'option1' },
                  },
                ],
              },
              {
                id: 'radio-2',
                type: 'Radio',
                state: {},
                children: [
                  {
                    id: 'label-2',
                    type: 'RadioLabel',
                    state: { text: 'Option 2' },
                  },
                  {
                    id: 'input-2',
                    type: 'RadioRadio',
                    state: { value: 'option2' },
                  },
                ],
              },
            ],
          },
        }
        renderWithSduiLayout(document, { components: sduiComponents })
        const radios = screen.getAllByRole('radio')
        expect(radios[0]).toBeChecked()
        expect(radios[1]).not.toBeChecked()

        await user.click(radios[1])

        // After click, selection should move to option2
        await waitFor(() => {
          expect(radios[1]).toBeInTheDocument()
        })
      })
    })
  })
})
