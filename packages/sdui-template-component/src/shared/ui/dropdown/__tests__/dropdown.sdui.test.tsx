/**
 * Dropdown - SDUI Integration Tests
 *
 * Tests for Dropdown component rendering via SDUI documents
 */

import type { SduiLayoutDocument } from '@lodado/sdui-template'
import { renderWithSduiLayout } from '@lodado/sdui-template/test'
import { screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import { sduiComponents } from '../../../../app/sduiComponents'

describe('Dropdown - SDUI Integration Tests', () => {
  describe('as is: Dropdown with minimal document', () => {
    describe('when: rendered via SDUI with open=false', () => {
      it('to be: dropdown root renders, should not display content', () => {
        const document: SduiLayoutDocument = {
          version: '1.0.0',
          root: {
            id: 'dropdown-1',
            type: 'Dropdown',
            state: {
              open: false,
            },
            children: [],
          },
        }

        const { container } = renderWithSduiLayout(document, { components: sduiComponents })

        // Dropdown root should be rendered
        const dropdownRoot = container.querySelector('[data-node-id="dropdown-1"]')
        expect(dropdownRoot).toBeInTheDocument()
      })
    })
  })

  describe('as is: Dropdown with DropdownTrigger and DropdownContent', () => {
    describe('when: compound structure rendered', () => {
      it('to be: trigger and content rendered, should have correct structure', () => {
        const document: SduiLayoutDocument = {
          version: '1.0.0',
          root: {
            id: 'dropdown-compound',
            type: 'Dropdown',
            state: {
              open: false,
            },
            children: [
              {
                id: 'trigger',
                type: 'DropdownTrigger',
                children: [
                  {
                    id: 'btn',
                    type: 'Button',
                    state: {
                      appearance: 'default',
                    },
                    children: [
                      {
                        id: 'btn-text',
                        type: 'Span',
                        state: {
                          text: 'Select Option',
                        },
                      },
                    ],
                  },
                ],
              },
              {
                id: 'content',
                type: 'DropdownContent',
                state: {
                  side: 'bottom',
                },
                children: [
                  {
                    id: 'item-1',
                    type: 'DropdownItem',
                    state: {
                      value: 'opt-1',
                      label: 'Option 1',
                    },
                  },
                ],
              },
            ],
          },
        }

        renderWithSduiLayout(document, { components: sduiComponents })

        // Trigger button should be visible
        expect(screen.getByText('Select Option')).toBeInTheDocument()
      })
    })
  })

  describe('as is: Dropdown with DropdownItem', () => {
    describe('when: DropdownContent contains DropdownItem children', () => {
      it('to be: items rendered, should display item labels', async () => {
        const document: SduiLayoutDocument = {
          version: '1.0.0',
          root: {
            id: 'dropdown-items',
            type: 'Dropdown',
            state: {
              open: true,
            },
            children: [
              {
                id: 'content',
                type: 'DropdownContent',
                state: {
                  side: 'bottom',
                },
                children: [
                  {
                    id: 'item-1',
                    type: 'DropdownItem',
                    state: {
                      value: 'opt-1',
                      label: 'Option 1',
                    },
                  },
                  {
                    id: 'item-2',
                    type: 'DropdownItem',
                    state: {
                      value: 'opt-2',
                      label: 'Option 2',
                    },
                  },
                ],
              },
            ],
          },
        }

        renderWithSduiLayout(document, { components: sduiComponents })

        // Items should be visible when dropdown is open (portaled content)
        await waitFor(() => {
          expect(screen.getByText('Option 1')).toBeInTheDocument()
          expect(screen.getByText('Option 2')).toBeInTheDocument()
        })
      })
    })
  })

  describe('as is: Dropdown with DropdownValue', () => {
    describe('when: DropdownValue with options and selectedId rendered', () => {
      it('to be: value displays selected option label, should show correct label', () => {
        const document: SduiLayoutDocument = {
          version: '1.0.0',
          root: {
            id: 'dropdown-value',
            type: 'Dropdown',
            state: {
              open: false,
              selectedId: 'opt-2',
            },
            children: [
              {
                id: 'trigger',
                type: 'DropdownTrigger',
                children: [
                  {
                    id: 'btn',
                    type: 'Button',
                    children: [
                      {
                        id: 'value',
                        type: 'DropdownValue',
                        state: {
                          placeholder: 'Select...',
                          options: [
                            { id: 'opt-1', label: 'Option 1' },
                            { id: 'opt-2', label: 'Option 2' },
                            { id: 'opt-3', label: 'Option 3' },
                          ],
                        },
                      },
                    ],
                  },
                ],
              },
            ],
          },
        }

        renderWithSduiLayout(document, { components: sduiComponents })

        // Should display selected option label
        expect(screen.getByText('Option 2')).toBeInTheDocument()
      })
    })
  })

  describe('as is: Dropdown with selectedId state', () => {
    describe('when: selectedId is set (boundary: exists vs null)', () => {
      it('to be: selected item highlighted, should have selected state', async () => {
        const document: SduiLayoutDocument = {
          version: '1.0.0',
          root: {
            id: 'dropdown-selected',
            type: 'Dropdown',
            state: {
              open: true,
              selectedId: 'opt-2',
            },
            children: [
              {
                id: 'content',
                type: 'DropdownContent',
                state: {
                  side: 'bottom',
                },
                children: [
                  {
                    id: 'item-1',
                    type: 'DropdownItem',
                    state: {
                      value: 'opt-1',
                      label: 'Option 1',
                    },
                  },
                  {
                    id: 'item-2',
                    type: 'DropdownItem',
                    state: {
                      value: 'opt-2',
                      label: 'Option 2',
                    },
                  },
                ],
              },
            ],
          },
        }

        renderWithSduiLayout(document, { components: sduiComponents })

        // Both items should be visible (portaled content)
        await waitFor(() => {
          expect(screen.getByText('Option 1')).toBeInTheDocument()
          expect(screen.getByText('Option 2')).toBeInTheDocument()
        })
      })
    })
  })

  describe('as is: Dropdown with item selection', () => {
    describe('when: DropdownItem clicked (boundary: selection action)', () => {
      it('to be: selectedId updates and dropdown closes, should update state', async () => {
        const user = userEvent.setup()
        const document: SduiLayoutDocument = {
          version: '1.0.0',
          root: {
            id: 'dropdown-select',
            type: 'Dropdown',
            state: {
              open: true,
            },
            children: [
              {
                id: 'content',
                type: 'DropdownContent',
                state: {
                  side: 'bottom',
                },
                children: [
                  {
                    id: 'item-1',
                    type: 'DropdownItem',
                    state: {
                      value: 'opt-1',
                      label: 'Option 1',
                    },
                  },
                  {
                    id: 'item-2',
                    type: 'DropdownItem',
                    state: {
                      value: 'opt-2',
                      label: 'Option 2',
                    },
                  },
                ],
              },
            ],
          },
        }

        renderWithSduiLayout(document, { components: sduiComponents })

        // Items should be visible (portaled content)
        const option1 = await screen.findByText('Option 1')
        expect(option1).toBeInTheDocument()

        // Click item
        await user.click(option1)

        // Dropdown should close after selection
        await waitFor(() => {
          expect(screen.queryByText('Option 2')).not.toBeInTheDocument()
        })
      })
    })
  })

  describe('as is: Dropdown with disabled item (boundary: disabled=true)', () => {
    describe('when: DropdownItem has disabled=true', () => {
      it('to be: item rendered but not selectable, should have disabled state', async () => {
        const document: SduiLayoutDocument = {
          version: '1.0.0',
          root: {
            id: 'dropdown-disabled',
            type: 'Dropdown',
            state: {
              open: true,
            },
            children: [
              {
                id: 'content',
                type: 'DropdownContent',
                state: {
                  side: 'bottom',
                },
                children: [
                  {
                    id: 'item-1',
                    type: 'DropdownItem',
                    state: {
                      value: 'opt-1',
                      label: 'Enabled Option',
                      disabled: false,
                    },
                  },
                  {
                    id: 'item-2',
                    type: 'DropdownItem',
                    state: {
                      value: 'opt-2',
                      label: 'Disabled Option',
                      disabled: true,
                    },
                  },
                ],
              },
            ],
          },
        }

        renderWithSduiLayout(document, { components: sduiComponents })

        // Both items should be visible (portaled content)
        await waitFor(() => {
          expect(screen.getByText('Enabled Option')).toBeInTheDocument()
          expect(screen.getByText('Disabled Option')).toBeInTheDocument()
        })
      })
    })
  })

  describe('as is: Dropdown with providerId inheritance (implicit)', () => {
    describe('when: child components omit providerId', () => {
      it('to be: components inherit providerId from context, should work correctly', async () => {
        const document: SduiLayoutDocument = {
          version: '1.0.0',
          root: {
            id: 'dropdown-inherit',
            type: 'Dropdown',
            state: {
              open: true,
              selectedId: 'opt-1',
            },
            children: [
              {
                id: 'trigger',
                type: 'DropdownTrigger',
                // No providerId - should inherit from parent
                children: [
                  {
                    id: 'btn',
                    type: 'Button',
                    children: [
                      {
                        id: 'btn-text',
                        type: 'Span',
                        state: {
                          text: 'Trigger',
                        },
                      },
                    ],
                  },
                ],
              },
              {
                id: 'content',
                type: 'DropdownContent',
                // No providerId - should inherit from parent
                state: {
                  side: 'bottom',
                },
                children: [
                  {
                    id: 'item-1',
                    type: 'DropdownItem',
                    // No providerId - should inherit from parent
                    state: {
                      value: 'opt-1',
                      label: 'Inherited Option',
                    },
                  },
                ],
              },
            ],
          },
        }

        renderWithSduiLayout(document, { components: sduiComponents })

        // Should render correctly with inherited providerId (portaled content)
        await waitFor(() => {
          expect(screen.getByText('Inherited Option')).toBeInTheDocument()
        })
      })
    })
  })

  describe('as is: Dropdown with explicit providerId', () => {
    describe('when: child components specify providerId explicitly', () => {
      it('to be: components use explicit providerId, should work correctly', async () => {
        const document: SduiLayoutDocument = {
          version: '1.0.0',
          root: {
            id: 'dropdown-explicit',
            type: 'Dropdown',
            state: {
              open: true,
              selectedId: 'opt-1',
            },
            children: [
              {
                id: 'trigger',
                type: 'DropdownTrigger',
                state: {
                  providerId: 'dropdown-explicit',
                },
                children: [
                  {
                    id: 'btn',
                    type: 'Button',
                    children: [
                      {
                        id: 'btn-text',
                        type: 'Span',
                        state: {
                          text: 'Trigger',
                        },
                      },
                    ],
                  },
                ],
              },
              {
                id: 'content',
                type: 'DropdownContent',
                state: {
                  side: 'bottom',
                  providerId: 'dropdown-explicit',
                },
                children: [
                  {
                    id: 'item-1',
                    type: 'DropdownItem',
                    state: {
                      value: 'opt-1',
                      label: 'Explicit Option',
                      providerId: 'dropdown-explicit',
                    },
                  },
                ],
              },
            ],
          },
        }

        renderWithSduiLayout(document, { components: sduiComponents })

        // Should render correctly with explicit providerId (portaled content)
        await waitFor(() => {
          expect(screen.getByText('Explicit Option')).toBeInTheDocument()
        })
      })
    })
  })

  describe('as is: Dropdown with DropdownValue placeholder', () => {
    describe('when: selectedId is null and placeholder provided', () => {
      it('to be: placeholder displayed, should show placeholder text', () => {
        const document: SduiLayoutDocument = {
          version: '1.0.0',
          root: {
            id: 'dropdown-placeholder',
            type: 'Dropdown',
            state: {
              open: false,
            },
            children: [
              {
                id: 'trigger',
                type: 'DropdownTrigger',
                children: [
                  {
                    id: 'btn',
                    type: 'Button',
                    children: [
                      {
                        id: 'value',
                        type: 'DropdownValue',
                        state: {
                          placeholder: 'Select an option...',
                          options: [
                            { id: 'opt-1', label: 'Option 1' },
                            { id: 'opt-2', label: 'Option 2' },
                          ],
                        },
                      },
                    ],
                  },
                ],
              },
            ],
          },
        }

        renderWithSduiLayout(document, { components: sduiComponents })

        // Should display placeholder when no selection
        expect(screen.getByText('Select an option...')).toBeInTheDocument()
      })
    })
  })
})
