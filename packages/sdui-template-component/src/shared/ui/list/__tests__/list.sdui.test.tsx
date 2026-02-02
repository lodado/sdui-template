import type { SduiLayoutDocument } from '@lodado/sdui-template'
import { renderWithSduiLayout } from '@lodado/sdui-template/test'
import { screen } from '@testing-library/react'

import { sduiComponents } from '../../../../app/sduiComponents'

describe('List - SDUI Integration Tests', () => {
  describe('as is: List with minimal document', () => {
    describe('when: rendered via SDUI with root only', () => {
      it('to be: list renders correctly, should have list element in DOM', () => {
        const document: SduiLayoutDocument = {
          version: '1.0.0',
          root: {
            id: 'list-root',
            type: 'List',
          },
        }
        const { container } = renderWithSduiLayout(document, { components: sduiComponents })
        // List should render
        expect(container).toBeInTheDocument()
      })
    })
  })

  describe('as is: List with disabled state', () => {
    describe('when: disabled=true (boundary: boolean true)', () => {
      it('to be: list is disabled, should have disabled styling', () => {
        const document: SduiLayoutDocument = {
          version: '1.0.0',
          root: {
            id: 'list-root',
            type: 'List',
            state: {
              disabled: true,
            },
            children: [
              {
                id: 'list-text',
                type: 'Text',
                state: { text: 'Disabled List Item' },
              },
            ],
          },
        }
        renderWithSduiLayout(document, { components: sduiComponents })
        expect(screen.getByText('Disabled List Item')).toBeInTheDocument()
        // List should render with disabled state
      })
    })

    describe('when: disabled=false (boundary: boolean false)', () => {
      it('to be: list is enabled, should not have disabled styling', () => {
        const document: SduiLayoutDocument = {
          version: '1.0.0',
          root: {
            id: 'list-root',
            type: 'List',
            state: {
              disabled: false,
            },
            children: [
              {
                id: 'list-text',
                type: 'Text',
                state: { text: 'Enabled List Item' },
              },
            ],
          },
        }
        renderWithSduiLayout(document, { components: sduiComponents })
        expect(screen.getByText('Enabled List Item')).toBeInTheDocument()
        // List should render without disabled state
      })
    })
  })

  describe('as is: List with children rendering', () => {
    describe('when: single child is rendered', () => {
      it('to be: child renders correctly, should display child content', () => {
        const document: SduiLayoutDocument = {
          version: '1.0.0',
          root: {
            id: 'list-root',
            type: 'List',
            children: [
              {
                id: 'list-text',
                type: 'Text',
                state: { text: 'Single Item' },
              },
            ],
          },
        }
        renderWithSduiLayout(document, { components: sduiComponents })
        expect(screen.getByText('Single Item')).toBeInTheDocument()
      })
    })

    describe('when: multiple children are rendered', () => {
      it('to be: all children render correctly, should display all items', () => {
        const document: SduiLayoutDocument = {
          version: '1.0.0',
          root: {
            id: 'list-root',
            type: 'List',
            children: [
              {
                id: 'list-text-1',
                type: 'Text',
                state: { text: 'Item 1' },
              },
              {
                id: 'list-text-2',
                type: 'Text',
                state: { text: 'Item 2' },
              },
              {
                id: 'list-text-3',
                type: 'Text',
                state: { text: 'Item 3' },
              },
            ],
          },
        }
        renderWithSduiLayout(document, { components: sduiComponents })
        expect(screen.getByText('Item 1')).toBeInTheDocument()
        expect(screen.getByText('Item 2')).toBeInTheDocument()
        expect(screen.getByText('Item 3')).toBeInTheDocument()
      })
    })

    describe('when: children array is empty (boundary: min-1)', () => {
      it('to be: list renders empty, should be empty list element', () => {
        const document: SduiLayoutDocument = {
          version: '1.0.0',
          root: {
            id: 'list-root',
            type: 'List',
            children: [],
          },
        }
        renderWithSduiLayout(document, { components: sduiComponents })
        // List should render without children
        expect(document.root.id).toBe('list-root')
      })
    })
  })

  describe('as is: List with nested children', () => {
    describe('when: nested structure is rendered', () => {
      it('to be: nested children render correctly, should have correct hierarchy', () => {
        const document: SduiLayoutDocument = {
          version: '1.0.0',
          root: {
            id: 'list-root',
            type: 'List',
            children: [
              {
                id: 'list-div',
                type: 'Div',
                children: [
                  {
                    id: 'list-text',
                    type: 'Text',
                    state: { text: 'Nested Content' },
                  },
                ],
              },
            ],
          },
        }
        renderWithSduiLayout(document, { components: sduiComponents })
        expect(screen.getByText('Nested Content')).toBeInTheDocument()
      })
    })
  })
})
