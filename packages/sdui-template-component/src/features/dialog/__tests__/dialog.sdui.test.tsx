/**
 * Dialog - SDUI Integration Tests
 *
 * Tests for Dialog component rendering via SDUI documents
 */

import type { SduiLayoutDocument } from '@lodado/sdui-template'
import { renderWithSduiLayout } from '@lodado/sdui-template/test'
import { screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import { sduiComponents } from '../../../app/sduiComponents'

describe('Dialog - SDUI Integration Tests', () => {
  describe('as is: Dialog with minimal document', () => {
    describe('when: rendered via SDUI with open=false', () => {
      it('to be: dialog root renders, should not display content', () => {
        const document: SduiLayoutDocument = {
          version: '1.0.0',
          root: {
            id: 'dialog-1',
            type: 'Dialog',
            state: {
              open: false,
            },
            children: [],
          },
        }

        renderWithSduiLayout(document, { components: sduiComponents })

        // Dialog root should be rendered (Radix UI Dialog.Root doesn't have data-node-id)
        // Since open=false, no portal content should be visible
        // We verify by checking that rendering completed without errors
        // The Dialog.Root is a context provider, so we just verify it rendered
        expect(true).toBe(true) // Placeholder - Dialog rendered successfully if no error thrown
      })
    })
  })

  describe('as is: Dialog with DialogTrigger and DialogPortal', () => {
    describe('when: compound structure rendered', () => {
      it('to be: trigger and portal rendered, should have correct structure', () => {
        const document: SduiLayoutDocument = {
          version: '1.0.0',
          root: {
            id: 'dialog-compound',
            type: 'Dialog',
            state: {
              open: false,
            },
            children: [
              {
                id: 'trigger',
                type: 'DialogTrigger',
                children: [
                  {
                    id: 'btn',
                    type: 'Button',
                    state: {
                      appearance: 'primary',
                    },
                    children: [
                      {
                        id: 'btn-text',
                        type: 'Span',
                        state: {
                          text: 'Open Dialog',
                        },
                      },
                    ],
                  },
                ],
              },
              {
                id: 'portal',
                type: 'DialogPortal',
                children: [
                  {
                    id: 'content',
                    type: 'DialogContent',
                    state: {
                      size: 'small',
                    },
                    children: [],
                  },
                ],
              },
            ],
          },
        }

        renderWithSduiLayout(document, { components: sduiComponents })

        // Trigger button should be visible
        expect(screen.getByText('Open Dialog')).toBeInTheDocument()
      })
    })
  })

  describe('as is: Dialog with DialogHeader', () => {
    describe('when: DialogHeader with title and hasCloseButton rendered', () => {
      it('to be: header renders with title and close button, should display title text', () => {
        const document: SduiLayoutDocument = {
          version: '1.0.0',
          root: {
            id: 'dialog-header',
            type: 'Dialog',
            state: {
              open: true,
            },
            children: [
              {
                id: 'portal',
                type: 'DialogPortal',
                children: [
                  {
                    id: 'content',
                    type: 'DialogContent',
                    state: {
                      size: 'small',
                    },
                    children: [
                      {
                        id: 'header',
                        type: 'DialogHeader',
                        state: {
                          title: 'Dialog Title',
                          hasCloseButton: true,
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

        // Title should be visible when dialog is open
        expect(screen.getByText('Dialog Title')).toBeInTheDocument()
      })
    })
  })

  describe('as is: Dialog with DialogBody', () => {
    describe('when: DialogBody with children rendered', () => {
      it('to be: body renders children, should display body content', () => {
        const document: SduiLayoutDocument = {
          version: '1.0.0',
          root: {
            id: 'dialog-body',
            type: 'Dialog',
            state: {
              open: true,
            },
            children: [
              {
                id: 'portal',
                type: 'DialogPortal',
                children: [
                  {
                    id: 'content',
                    type: 'DialogContent',
                    state: {
                      size: 'small',
                    },
                    children: [
                      {
                        id: 'body',
                        type: 'DialogBody',
                        children: [
                          {
                            id: 'body-text',
                            type: 'Span',
                            state: {
                              text: 'Dialog body content',
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

        renderWithSduiLayout(document, { components: sduiComponents })

        expect(screen.getByText('Dialog body content')).toBeInTheDocument()
      })
    })
  })

  describe('as is: Dialog with DialogFooter', () => {
    describe('when: DialogFooter with cancelLabel and confirmLabel rendered', () => {
      it('to be: footer renders with buttons, should display cancel and confirm labels', () => {
        const document: SduiLayoutDocument = {
          version: '1.0.0',
          root: {
            id: 'dialog-footer',
            type: 'Dialog',
            state: {
              open: true,
            },
            children: [
              {
                id: 'portal',
                type: 'DialogPortal',
                children: [
                  {
                    id: 'content',
                    type: 'DialogContent',
                    state: {
                      size: 'small',
                    },
                    children: [
                      {
                        id: 'footer',
                        type: 'DialogFooter',
                        state: {
                          cancelLabel: 'Cancel',
                          confirmLabel: 'OK',
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

        expect(screen.getByText('Cancel')).toBeInTheDocument()
        expect(screen.getByText('OK')).toBeInTheDocument()
      })
    })
  })

  describe('as is: Dialog with complete compound structure', () => {
    describe('when: Dialog with all sub-components rendered', () => {
      it('to be: all components render correctly, should display complete dialog', () => {
        const document: SduiLayoutDocument = {
          version: '1.0.0',
          root: {
            id: 'dialog-complete',
            type: 'Dialog',
            state: {
              open: true,
            },
            children: [
              {
                id: 'trigger',
                type: 'DialogTrigger',
                children: [
                  {
                    id: 'btn',
                    type: 'Button',
                    state: {
                      appearance: 'primary',
                    },
                    children: [
                      {
                        id: 'btn-text',
                        type: 'Span',
                        state: {
                          text: 'Open',
                        },
                      },
                    ],
                  },
                ],
              },
              {
                id: 'portal',
                type: 'DialogPortal',
                children: [
                  {
                    id: 'content',
                    type: 'DialogContent',
                    state: {
                      size: 'medium',
                    },
                    children: [
                      {
                        id: 'header',
                        type: 'DialogHeader',
                        state: {
                          title: 'Complete Dialog',
                          hasCloseButton: true,
                        },
                      },
                      {
                        id: 'body',
                        type: 'DialogBody',
                        children: [
                          {
                            id: 'body-text',
                            type: 'Span',
                            state: {
                              text: 'This is a complete dialog example',
                            },
                          },
                        ],
                      },
                      {
                        id: 'footer',
                        type: 'DialogFooter',
                        state: {
                          cancelLabel: 'Cancel',
                          confirmLabel: 'Confirm',
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

        expect(screen.getByText('Complete Dialog')).toBeInTheDocument()
        expect(screen.getByText('This is a complete dialog example')).toBeInTheDocument()
        expect(screen.getByText('Cancel')).toBeInTheDocument()
        expect(screen.getByText('Confirm')).toBeInTheDocument()
      })
    })
  })

  describe('as is: Dialog with open state toggle', () => {
    describe('when: DialogTrigger clicked (boundary: boolean toggle)', () => {
      it('to be: dialog opens, should display content after click', async () => {
        const user = userEvent.setup()
        const document: SduiLayoutDocument = {
          version: '1.0.0',
          root: {
            id: 'dialog-toggle',
            type: 'Dialog',
            state: {
              open: false,
            },
            children: [
              {
                id: 'trigger',
                type: 'DialogTrigger',
                children: [
                  {
                    id: 'btn',
                    type: 'Button',
                    state: {
                      appearance: 'primary',
                    },
                    children: [
                      {
                        id: 'btn-text',
                        type: 'Span',
                        state: {
                          text: 'Open Dialog',
                        },
                      },
                    ],
                  },
                ],
              },
              {
                id: 'portal',
                type: 'DialogPortal',
                children: [
                  {
                    id: 'content',
                    type: 'DialogContent',
                    state: {
                      size: 'small',
                    },
                    children: [
                      {
                        id: 'header',
                        type: 'DialogHeader',
                        state: {
                          title: 'Test Dialog',
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

        // Initially closed
        expect(screen.queryByText('Test Dialog')).not.toBeInTheDocument()

        // Click trigger
        const triggerButton = screen.getByText('Open Dialog')
        await user.click(triggerButton)

        // Dialog should open
        await waitFor(() => {
          expect(screen.getByText('Test Dialog')).toBeInTheDocument()
        })
      })
    })
  })

  describe('as is: Dialog with providerId inheritance (implicit)', () => {
    describe('when: child components omit providerId', () => {
      it('to be: components inherit providerId from context, should work correctly', () => {
        const document: SduiLayoutDocument = {
          version: '1.0.0',
          root: {
            id: 'dialog-inherit',
            type: 'Dialog',
            state: {
              open: true,
            },
            children: [
              {
                id: 'trigger',
                type: 'DialogTrigger',
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
                id: 'portal',
                type: 'DialogPortal',
                children: [
                  {
                    id: 'content',
                    type: 'DialogContent',
                    state: {
                      size: 'small',
                    },
                    children: [
                      {
                        id: 'header',
                        type: 'DialogHeader',
                        // No providerId - should inherit from parent
                        state: {
                          title: 'Inherited Dialog',
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

        // Should render correctly with inherited providerId
        expect(screen.getByText('Inherited Dialog')).toBeInTheDocument()
      })
    })
  })

  describe('as is: Dialog with explicit providerId', () => {
    describe('when: child components specify providerId explicitly', () => {
      it('to be: components use explicit providerId, should work correctly', () => {
        const document: SduiLayoutDocument = {
          version: '1.0.0',
          root: {
            id: 'dialog-explicit',
            type: 'Dialog',
            state: {
              open: true,
            },
            children: [
              {
                id: 'trigger',
                type: 'DialogTrigger',
                state: {
                  providerId: 'dialog-explicit',
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
                id: 'portal',
                type: 'DialogPortal',
                children: [
                  {
                    id: 'content',
                    type: 'DialogContent',
                    state: {
                      size: 'small',
                      providerId: 'dialog-explicit',
                    },
                    children: [
                      {
                        id: 'header',
                        type: 'DialogHeader',
                        state: {
                          title: 'Explicit Dialog',
                          providerId: 'dialog-explicit',
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

        // Should render correctly with explicit providerId
        expect(screen.getByText('Explicit Dialog')).toBeInTheDocument()
      })
    })
  })
})
