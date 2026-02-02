/**
 * SDUI Integration Tests for Button Component
 *
 * Tests that verify Button component renders correctly when used via SDUI documents.
 * These tests complement the existing button.logic.test.tsx which tests the component directly.
 */

import type { SduiLayoutDocument } from '@lodado/sdui-template'
import { useSduiLayoutAction } from '@lodado/sdui-template'
import { renderWithSduiLayout } from '@lodado/sdui-template/test'
import { screen, waitFor } from '@testing-library/react'
import React from 'react'

import { sduiComponents } from '../../../../app/sduiComponents'

describe('Button - SDUI Integration Tests', () => {
  describe('as is: Button with minimal document', () => {
    describe('when: rendered via SDUI with id, type, and children', () => {
      it('to be: component renders correctly, should have correct DOM structure', () => {
        const document: SduiLayoutDocument = {
          version: '1.0.0',
          root: {
            id: 'button-1',
            type: 'Button',
            children: [
              {
                id: 'text-1',
                type: 'Text',
                state: {
                  text: 'Click me',
                },
              },
            ],
          },
        }

        renderWithSduiLayout(document, { components: sduiComponents })

        const button = screen.getByRole('button', { name: /click me/i })
        expect(button).toBeInTheDocument()
        expect(button).toHaveAttribute('data-node-id', 'button-1')
      })
    })
  })

  describe('as is: Button with appearance state', () => {
    describe('when: state.appearance="default" (first enum value)', () => {
      it('to be: default button rendered, should have border class', () => {
        const document: SduiLayoutDocument = {
          version: '1.0.0',
          root: {
            id: 'button-default',
            type: 'Button',
            state: {
              appearance: 'default',
            },
            children: [
              {
                id: 'text-1',
                type: 'Text',
                state: {
                  text: 'Default',
                },
              },
            ],
          },
        }

        renderWithSduiLayout(document, { components: sduiComponents })

        const button = screen.getByRole('button', { name: /default/i })
        expect(button).toBeInTheDocument()
        expect(button).toHaveClass('border')
      })
    })

    describe('when: state.appearance="primary"', () => {
      it('to be: primary button rendered, should not have border-solid class', () => {
        const document: SduiLayoutDocument = {
          version: '1.0.0',
          root: {
            id: 'button-primary',
            type: 'Button',
            state: {
              appearance: 'primary',
            },
            children: [
              {
                id: 'text-1',
                type: 'Text',
                state: {
                  text: 'Primary',
                },
              },
            ],
          },
        }

        renderWithSduiLayout(document, { components: sduiComponents })

        const button = screen.getByRole('button', { name: /primary/i })
        expect(button).toBeInTheDocument()
        expect(button).not.toHaveClass('border-solid')
      })
    })

    describe('when: state.appearance="danger" (last enum value)', () => {
      it('to be: danger button rendered, should be in document', () => {
        const document: SduiLayoutDocument = {
          version: '1.0.0',
          root: {
            id: 'button-danger',
            type: 'Button',
            state: {
              appearance: 'danger',
            },
            children: [
              {
                id: 'text-1',
                type: 'Text',
                state: {
                  text: 'Danger',
                },
              },
            ],
          },
        }

        renderWithSduiLayout(document, { components: sduiComponents })

        const button = screen.getByRole('button', { name: /danger/i })
        expect(button).toBeInTheDocument()
      })
    })
  })

  describe('as is: Button with spacing state', () => {
    describe('when: state.spacing="default"', () => {
      it('to be: default spacing applied, should have min-h-[32px] class', () => {
        const document: SduiLayoutDocument = {
          version: '1.0.0',
          root: {
            id: 'button-spacing-default',
            type: 'Button',
            state: {
              spacing: 'default',
            },
            children: [
              {
                id: 'text-1',
                type: 'Text',
                state: {
                  text: 'Default Spacing',
                },
              },
            ],
          },
        }

        renderWithSduiLayout(document, { components: sduiComponents })

        const button = screen.getByRole('button', { name: /default spacing/i })
        expect(button).toHaveClass('min-h-[32px]')
      })
    })

    describe('when: state.spacing="compact"', () => {
      it('to be: compact spacing applied, should have min-h-[24px] class', () => {
        const document: SduiLayoutDocument = {
          version: '1.0.0',
          root: {
            id: 'button-spacing-compact',
            type: 'Button',
            state: {
              spacing: 'compact',
            },
            children: [
              {
                id: 'text-1',
                type: 'Text',
                state: {
                  text: 'Compact Spacing',
                },
              },
            ],
          },
        }

        renderWithSduiLayout(document, { components: sduiComponents })

        const button = screen.getByRole('button', { name: /compact spacing/i })
        expect(button).toHaveClass('min-h-[24px]')
      })
    })
  })

  describe('as is: Button with isDisabled state', () => {
    describe('when: state.isDisabled=true (boundary: boolean true)', () => {
      it('to be: button disabled, should have disabled attribute and aria-disabled', () => {
        const document: SduiLayoutDocument = {
          version: '1.0.0',
          root: {
            id: 'button-disabled',
            type: 'Button',
            state: {
              isDisabled: true,
            },
            children: [
              {
                id: 'text-1',
                type: 'Text',
                state: {
                  text: 'Disabled',
                },
              },
            ],
          },
        }

        renderWithSduiLayout(document, { components: sduiComponents })

        const button = screen.getByRole('button', { name: /disabled/i })
        expect(button).toBeDisabled()
        expect(button).toHaveAttribute('aria-disabled', 'true')
      })
    })

    describe('when: state.isDisabled=false (boundary: boolean false)', () => {
      it('to be: button enabled, should not have disabled attribute', () => {
        const document: SduiLayoutDocument = {
          version: '1.0.0',
          root: {
            id: 'button-enabled',
            type: 'Button',
            state: {
              isDisabled: false,
            },
            children: [
              {
                id: 'text-1',
                type: 'Text',
                state: {
                  text: 'Enabled',
                },
              },
            ],
          },
        }

        renderWithSduiLayout(document, { components: sduiComponents })

        const button = screen.getByRole('button', { name: /enabled/i })
        expect(button).not.toBeDisabled()
      })
    })
  })

  describe('as is: Button with isLoading state', () => {
    describe('when: state.isLoading=true (boundary: boolean true)', () => {
      it('to be: loading spinner shown, button non-interactive, should have aria-busy and cursor-wait', () => {
        const document: SduiLayoutDocument = {
          version: '1.0.0',
          root: {
            id: 'button-loading',
            type: 'Button',
            state: {
              isLoading: true,
            },
            children: [
              {
                id: 'text-1',
                type: 'Text',
                state: {
                  text: 'Loading',
                },
              },
            ],
          },
        }

        renderWithSduiLayout(document, { components: sduiComponents })

        const button = screen.getByRole('button', { name: /loading/i })
        expect(button).toBeDisabled()
        expect(button).toHaveAttribute('aria-busy', 'true')
        expect(button).toHaveClass('cursor-wait')

        // Loading spinner should be present
        const spinner = button.querySelector('svg')
        expect(spinner).toBeInTheDocument()
        expect(spinner).toHaveClass('animate-spin')
      })
    })

    describe('when: state.isLoading=false (boundary: boolean false)', () => {
      it('to be: no spinner shown, button interactive', () => {
        const document: SduiLayoutDocument = {
          version: '1.0.0',
          root: {
            id: 'button-not-loading',
            type: 'Button',
            state: {
              isLoading: false,
            },
            children: [
              {
                id: 'text-1',
                type: 'Text',
                state: {
                  text: 'Not Loading',
                },
              },
            ],
          },
        }

        renderWithSduiLayout(document, { components: sduiComponents })

        const button = screen.getByRole('button', { name: /not loading/i })
        expect(button).not.toBeDisabled()
        expect(button).not.toHaveAttribute('aria-busy', 'true')
      })
    })
  })

  describe('as is: Button with isSelected state', () => {
    describe('when: state.isSelected=true', () => {
      it('to be: selected state applied, should have aria-pressed and data-selected attributes', () => {
        const document: SduiLayoutDocument = {
          version: '1.0.0',
          root: {
            id: 'button-selected',
            type: 'Button',
            state: {
              isSelected: true,
            },
            children: [
              {
                id: 'text-1',
                type: 'Text',
                state: {
                  text: 'Selected',
                },
              },
            ],
          },
        }

        renderWithSduiLayout(document, { components: sduiComponents })

        const button = screen.getByRole('button', { name: /selected/i })
        expect(button).toHaveAttribute('aria-pressed', 'true')
        expect(button).toHaveAttribute('data-selected', 'true')
      })
    })
  })

  describe('as is: Button with attributes', () => {
    describe('when: attributes.className="custom-button" provided', () => {
      it('to be: className applied to button, should have custom-button in classList', () => {
        const document: SduiLayoutDocument = {
          version: '1.0.0',
          root: {
            id: 'button-custom-class',
            type: 'Button',
            attributes: {
              className: 'custom-button',
            },
            children: [
              {
                id: 'text-1',
                type: 'Text',
                state: {
                  text: 'Custom',
                },
              },
            ],
          },
        }

        renderWithSduiLayout(document, { components: sduiComponents })

        const button = screen.getByRole('button', { name: /custom/i })
        expect(button).toHaveClass('custom-button')
      })
    })

    describe('when: attributes.type="submit" provided', () => {
      it('to be: type attribute applied, should have type="submit"', () => {
        const document: SduiLayoutDocument = {
          version: '1.0.0',
          root: {
            id: 'button-submit',
            type: 'Button',
            attributes: {
              type: 'submit',
            },
            children: [
              {
                id: 'text-1',
                type: 'Text',
                state: {
                  text: 'Submit',
                },
              },
            ],
          },
        }

        renderWithSduiLayout(document, { components: sduiComponents })

        const button = screen.getByRole('button', { name: /submit/i })
        expect(button).toHaveAttribute('type', 'submit')
      })
    })
  })

  describe('as is: Button with children', () => {
    describe('when: children contains Text component', () => {
      it('to be: text content rendered, should display text from child', () => {
        const document: SduiLayoutDocument = {
          version: '1.0.0',
          root: {
            id: 'button-with-text',
            type: 'Button',
            children: [
              {
                id: 'text-1',
                type: 'Text',
                state: {
                  text: 'Button Text',
                },
              },
            ],
          },
        }

        renderWithSduiLayout(document, { components: sduiComponents })

        const button = screen.getByRole('button', { name: /button text/i })
        expect(button).toBeInTheDocument()
        expect(button).toHaveTextContent('Button Text')
      })
    })

    describe('when: children contains Span component', () => {
      it('to be: span content rendered, should display span text', () => {
        const document: SduiLayoutDocument = {
          version: '1.0.0',
          root: {
            id: 'button-with-span',
            type: 'Button',
            children: [
              {
                id: 'span-1',
                type: 'Span',
                state: {
                  text: 'Span Text',
                },
              },
            ],
          },
        }

        renderWithSduiLayout(document, { components: sduiComponents })

        const button = screen.getByRole('button', { name: /span text/i })
        expect(button).toBeInTheDocument()
        expect(button).toHaveTextContent('Span Text')
      })
    })
  })

  describe('as is: Button with state updates', () => {
    describe('when: store.updateNodeState updates isDisabled from false to true', () => {
      it('to be: button becomes disabled, should reflect updated state', async () => {
        const document: SduiLayoutDocument = {
          version: '1.0.0',
          root: {
            id: 'button-update',
            type: 'Button',
            state: {
              isDisabled: false,
            },
            children: [
              {
                id: 'text-1',
                type: 'Text',
                state: {
                  text: 'Update Test',
                },
              },
            ],
          },
        }

        const UpdateTest: React.FC = () => {
          const store = useSduiLayoutAction()
          React.useEffect(() => {
            // Update button state to disabled
            store.updateNodeState('button-update', { isDisabled: true })
          }, [store])

          return null
        }

        renderWithSduiLayout(
          document,
          { components: sduiComponents },
          <UpdateTest />,
        )

        const button = screen.getByRole('button', { name: /update test/i })

        // Wait for state update to be applied
        await waitFor(() => {
          expect(button).toBeDisabled()
        })
      })
    })

    describe('when: store.updateNodeState updates appearance from default to primary', () => {
      it('to be: button appearance changes, should reflect updated appearance', async () => {
        const document: SduiLayoutDocument = {
          version: '1.0.0',
          root: {
            id: 'button-appearance-update',
            type: 'Button',
            state: {
              appearance: 'default',
            },
            children: [
              {
                id: 'text-1',
                type: 'Text',
                state: {
                  text: 'Appearance Update',
                },
              },
            ],
          },
        }

        const UpdateTest: React.FC = () => {
          const store = useSduiLayoutAction()
          React.useEffect(() => {
            // Update button appearance
            store.updateNodeState('button-appearance-update', { appearance: 'primary' })
          }, [store])

          return null
        }

        renderWithSduiLayout(
          document,
          { components: sduiComponents },
          <UpdateTest />,
        )

        const button = screen.getByRole('button', { name: /appearance update/i })

        // Wait for appearance update to primary (which doesn't have border)
        // Note: useEffect runs immediately, so we wait for the update
        await waitFor(() => {
          expect(button).not.toHaveClass('border')
          expect(button).not.toHaveClass('border-solid')
          // Primary appearance should have brand background
          expect(button).toHaveClass('bg-[var(--color-background-brand-bold-default)]')
        })
      })
    })
  })
})
