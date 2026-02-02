/**
 * Card - SDUI Integration Tests
 *
 * Tests for Card component rendering via SDUI documents
 */

import type { SduiLayoutDocument } from '@lodado/sdui-template'
import { renderWithSduiLayout } from '@lodado/sdui-template/test'
import { screen } from '@testing-library/react'

import { sduiComponents } from '../../../../app/sduiComponents'

describe('Card - SDUI Integration Tests', () => {
  describe('as is: Card with minimal document', () => {
    describe('when: rendered via SDUI without title', () => {
      it('to be: component renders correctly, should have correct DOM structure', () => {
        const document: SduiLayoutDocument = {
          version: '1.0.0',
          root: {
            id: 'card-1',
            type: 'Card',
            state: {},
            children: [],
          },
        }

        const { container } = renderWithSduiLayout(document, { components: sduiComponents })

        const cardElement = container.querySelector('[data-node-id="card-1"]')
        expect(cardElement).toBeInTheDocument()
        expect(cardElement).toHaveAttribute('data-node-id', 'card-1')
        expect(cardElement?.tagName).toBe('DIV')
      })
    })
  })

  describe('as is: Card with title in state', () => {
    describe('when: state.title provided', () => {
      it('to be: title rendered in header, should display title text', () => {
        const document: SduiLayoutDocument = {
          version: '1.0.0',
          root: {
            id: 'card-title',
            type: 'Card',
            state: {
              title: 'Learning Guide',
            },
            children: [],
          },
        }

        const { container } = renderWithSduiLayout(document, { components: sduiComponents })

        const cardElement = container.querySelector('[data-node-id="card-title"]')
        expect(cardElement).toBeInTheDocument()

        const titleElement = screen.getByText('Learning Guide')
        expect(titleElement).toBeInTheDocument()
        expect(titleElement.tagName).toBe('H3')
        expect(titleElement).toHaveClass('mb-4', 'text-lg', 'font-bold')
      })
    })
  })

  describe('as is: Card with single child', () => {
    describe('when: children array contains one child', () => {
      it('to be: child rendered inside card, should display child content', () => {
        const document: SduiLayoutDocument = {
          version: '1.0.0',
          root: {
            id: 'card-single',
            type: 'Card',
            state: {},
            children: [
              {
                id: 'card-content',
                type: 'Span',
                state: {
                  text: 'Card content goes here',
                },
              },
            ],
          },
        }

        const { container } = renderWithSduiLayout(document, { components: sduiComponents })

        const cardElement = container.querySelector('[data-node-id="card-single"]')
        expect(cardElement).toBeInTheDocument()

        const contentElement = screen.getByText('Card content goes here')
        expect(contentElement).toBeInTheDocument()
        expect(cardElement).toContainElement(contentElement)
      })
    })
  })

  describe('as is: Card with multiple children', () => {
    describe('when: children array contains multiple children', () => {
      it('to be: all children rendered, should display all child contents', () => {
        const document: SduiLayoutDocument = {
          version: '1.0.0',
          root: {
            id: 'card-multi',
            type: 'Card',
            state: {},
            children: [
              {
                id: 'text-1',
                type: 'Text',
                state: {
                  text: 'First paragraph',
                },
              },
              {
                id: 'text-2',
                type: 'Text',
                state: {
                  text: 'Second paragraph',
                },
              },
            ],
          },
        }

        const { container } = renderWithSduiLayout(document, { components: sduiComponents })

        const cardElement = container.querySelector('[data-node-id="card-multi"]')
        expect(cardElement).toBeInTheDocument()

        expect(screen.getByText('First paragraph')).toBeInTheDocument()
        expect(screen.getByText('Second paragraph')).toBeInTheDocument()
      })
    })
  })

  describe('as is: Card with nested content structure', () => {
    describe('when: Card contains Div which contains Text', () => {
      it('to be: nested structure rendered correctly, should display nested content', () => {
        const document: SduiLayoutDocument = {
          version: '1.0.0',
          root: {
            id: 'card-nested',
            type: 'Card',
            state: {
              title: 'Nested Content',
            },
            children: [
              {
                id: 'nested-div',
                type: 'Div',
                attributes: {
                  className: 'space-y-2',
                },
                children: [
                  {
                    id: 'nested-text',
                    type: 'Text',
                    state: {
                      text: 'Nested text content',
                    },
                  },
                ],
              },
            ],
          },
        }

        const { container } = renderWithSduiLayout(document, { components: sduiComponents })

        const cardElement = container.querySelector('[data-node-id="card-nested"]')
        expect(cardElement).toBeInTheDocument()

        expect(screen.getByText('Nested Content')).toBeInTheDocument()
        expect(screen.getByText('Nested text content')).toBeInTheDocument()

        const nestedDiv = screen.getByTestId('div-nested-div')
        expect(nestedDiv).toBeInTheDocument()
        expect(cardElement).toContainElement(nestedDiv)
      })
    })
  })

  describe('as is: Card with empty children array (boundary: min-1)', () => {
    describe('when: children array is empty', () => {
      it('to be: card renders without content, should be empty DOM element', () => {
        const document: SduiLayoutDocument = {
          version: '1.0.0',
          root: {
            id: 'card-empty',
            type: 'Card',
            state: {},
            children: [],
          },
        }

        const { container } = renderWithSduiLayout(document, { components: sduiComponents })

        const cardElement = container.querySelector('[data-node-id="card-empty"]')
        expect(cardElement).toBeInTheDocument()
        // Card should render even with empty children (only title would be shown if present)
      })
    })
  })

  describe('as is: Card with title and children', () => {
    describe('when: both state.title and children provided', () => {
      it('to be: title and children both rendered, should display title and content', () => {
        const document: SduiLayoutDocument = {
          version: '1.0.0',
          root: {
            id: 'card-full',
            type: 'Card',
            state: {
              title: 'Card Title',
            },
            children: [
              {
                id: 'card-body',
                type: 'Span',
                state: {
                  text: 'Card body content',
                },
              },
            ],
          },
        }

        const { container } = renderWithSduiLayout(document, { components: sduiComponents })

        const cardElement = container.querySelector('[data-node-id="card-full"]')
        expect(cardElement).toBeInTheDocument()

        expect(screen.getByText('Card Title')).toBeInTheDocument()
        expect(screen.getByText('Card body content')).toBeInTheDocument()
      })
    })
  })

  describe('as is: Card with className attribute', () => {
    describe('when: attributes.className provided', () => {
      it('to be: className applied to card element, should have custom class', () => {
        const document: SduiLayoutDocument = {
          version: '1.0.0',
          root: {
            id: 'card-class',
            type: 'Card',
            state: {},
            attributes: {
              className: 'w-full max-w-md',
            },
            children: [],
          },
        }

        const { container } = renderWithSduiLayout(document, { components: sduiComponents })

        const cardElement = container.querySelector('[data-node-id="card-class"]')
        expect(cardElement).toHaveClass('w-full')
        expect(cardElement).toHaveClass('max-w-md')
      })
    })
  })
})
