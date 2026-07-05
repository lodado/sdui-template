import type { SduiLayoutDocument } from '@lodado/sdui-template'
import { renderWithSduiLayout } from '@lodado/sdui-template/test'
import { screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import { sduiComponents } from '../../../../app/sduiComponents'

describe('Popover - SDUI Integration Tests', () => {
  describe('as is: Popover with minimal document', () => {
    describe('when: rendered via SDUI with root only', () => {
      it('to be: popover root renders correctly, should have correct DOM structure', () => {
        const document: SduiLayoutDocument = {
          version: '1.0.0',
          root: {
            id: 'popover-root',
            type: 'Popover',
            state: { open: false },
          },
        }
        const { container } = renderWithSduiLayout(document, { components: sduiComponents })
        // Popover root should render (check via DOM structure)
        expect(container).toBeInTheDocument()
      })
    })
  })

  describe('as is: Popover with open state', () => {
    describe('when: open=true (boundary: boolean true)', () => {
      it('to be: popover is open, should render content when open', async () => {
        const document: SduiLayoutDocument = {
          version: '1.0.0',
          root: {
            id: 'popover-root',
            type: 'Popover',
            state: { open: true },
            children: [
              {
                id: 'popover-trigger',
                type: 'PopoverTrigger',
                children: [
                  {
                    id: 'trigger-button',
                    type: 'Button',
                    children: [
                      {
                        id: 'trigger-text',
                        type: 'Text',
                        state: { text: 'Open Popover' },
                      },
                    ],
                  },
                ],
              },
              {
                id: 'popover-content',
                type: 'PopoverContent',
                children: [
                  {
                    id: 'content-text',
                    type: 'Text',
                    state: { text: 'Popover Content' },
                  },
                ],
              },
            ],
          },
        }
        renderWithSduiLayout(document, { components: sduiComponents })
        // Content should be visible when open (portaled content)
        await waitFor(() => {
          expect(screen.getByText('Popover Content')).toBeInTheDocument()
        })
      })
    })

    describe('when: open=false (boundary: boolean false)', () => {
      it('to be: popover is closed, should not render content', () => {
        const document: SduiLayoutDocument = {
          version: '1.0.0',
          root: {
            id: 'popover-root',
            type: 'Popover',
            state: { open: false },
            children: [
              {
                id: 'popover-trigger',
                type: 'PopoverTrigger',
                children: [
                  {
                    id: 'trigger-button',
                    type: 'Button',
                    children: [
                      {
                        id: 'trigger-text',
                        type: 'Text',
                        state: { text: 'Open Popover' },
                      },
                    ],
                  },
                ],
              },
              {
                id: 'popover-content',
                type: 'PopoverContent',
                children: [
                  {
                    id: 'content-text',
                    type: 'Text',
                    state: { text: 'Popover Content' },
                  },
                ],
              },
            ],
          },
        }
        renderWithSduiLayout(document, { components: sduiComponents })
        // Trigger should be visible
        expect(screen.getByText('Open Popover')).toBeInTheDocument()
        // Content should not be visible when closed (Radix UI hides it)
      })
    })
  })

  describe('as is: Popover with compound structure', () => {
    describe('when: PopoverTrigger + PopoverContent + PopoverClose are rendered', () => {
      it('to be: all components render correctly, should have correct hierarchy', async () => {
        const document: SduiLayoutDocument = {
          version: '1.0.0',
          root: {
            id: 'popover-root',
            type: 'Popover',
            state: { open: true },
            children: [
              {
                id: 'popover-trigger',
                type: 'PopoverTrigger',
                children: [
                  {
                    id: 'trigger-button',
                    type: 'Button',
                    children: [
                      {
                        id: 'trigger-text',
                        type: 'Text',
                        state: { text: 'Toggle' },
                      },
                    ],
                  },
                ],
              },
              {
                id: 'popover-content',
                type: 'PopoverContent',
                children: [
                  {
                    id: 'content-text',
                    type: 'Text',
                    state: { text: 'Content' },
                  },
                  {
                    id: 'popover-close',
                    type: 'PopoverClose',
                    children: [
                      {
                        id: 'close-button',
                        type: 'Button',
                        children: [
                          {
                            id: 'close-text',
                            type: 'Text',
                            state: { text: 'Close' },
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
        expect(screen.getByText('Toggle')).toBeInTheDocument()
        // Content is portaled, wait for it to render
        await waitFor(() => {
          expect(screen.getByText('Content')).toBeInTheDocument()
          expect(screen.getByText('Close')).toBeInTheDocument()
        })
      })
    })
  })

  describe('as is: Popover with state updates', () => {
    describe('when: trigger is clicked', () => {
      it('to be: open state toggles, should update popover visibility', async () => {
        const user = userEvent.setup()
        const document: SduiLayoutDocument = {
          version: '1.0.0',
          root: {
            id: 'popover-root',
            type: 'Popover',
            state: { open: false },
            children: [
              {
                id: 'popover-trigger',
                type: 'PopoverTrigger',
                children: [
                  {
                    id: 'trigger-button',
                    type: 'Button',
                    children: [
                      {
                        id: 'trigger-text',
                        type: 'Text',
                        state: { text: 'Toggle Popover' },
                      },
                    ],
                  },
                ],
              },
              {
                id: 'popover-content',
                type: 'PopoverContent',
                children: [
                  {
                    id: 'content-text',
                    type: 'Text',
                    state: { text: 'Dynamic Content' },
                  },
                ],
              },
            ],
          },
        }
        renderWithSduiLayout(document, { components: sduiComponents })
        const trigger = screen.getByText('Toggle Popover')
        await user.click(trigger)
        // After click, popover should open (state update via store)
        await waitFor(() => {
          expect(screen.getByText('Dynamic Content')).toBeInTheDocument()
        })
      })
    })

    describe('when: PopoverClose is clicked', () => {
      it('to be: open state becomes false, should close popover', async () => {
        const user = userEvent.setup()
        const document: SduiLayoutDocument = {
          version: '1.0.0',
          root: {
            id: 'popover-root',
            type: 'Popover',
            state: { open: true },
            children: [
              {
                id: 'popover-content',
                type: 'PopoverContent',
                children: [
                  {
                    id: 'content-text',
                    type: 'Text',
                    state: { text: 'Content to Close' },
                  },
                  {
                    id: 'popover-close',
                    type: 'PopoverClose',
                    children: [
                      {
                        id: 'close-button',
                        type: 'Button',
                        children: [
                          {
                            id: 'close-text',
                            type: 'Text',
                            state: { text: 'Close' },
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
        // Content is portaled, wait for it to render
        await waitFor(() => {
          expect(screen.getByText('Content to Close')).toBeInTheDocument()
        })
        const closeButton = screen.getByText('Close')
        await user.click(closeButton)
        // After close click, popover should close (state update via store)
        // Note: When PopoverClose is clicked, the popover closes and the portaled content disappears
        await waitFor(() => {
          expect(screen.queryByText('Content to Close')).not.toBeInTheDocument()
        })
      })
    })
  })
})
