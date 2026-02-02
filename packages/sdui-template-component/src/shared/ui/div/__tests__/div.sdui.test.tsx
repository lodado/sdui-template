/**
 * SDUI Integration Tests for Div Component
 *
 * Tests that verify Div component renders correctly when used via SDUI documents.
 * These tests complement the existing div.logic.test.tsx which tests the component directly.
 */

import type { SduiLayoutDocument } from '@lodado/sdui-template'
import { renderWithSduiLayout } from '@lodado/sdui-template/test'
import { screen } from '@testing-library/react'

import { sduiComponents } from '../../../../app/sduiComponents'

describe('Div - SDUI Integration Tests', () => {
  describe('as is: Div with minimal document', () => {
    describe('when: rendered via SDUI with id and type only', () => {
      it('to be: component renders correctly, should have correct DOM structure and data attributes', () => {
        const document: SduiLayoutDocument = {
          version: '1.0.0',
          root: {
            id: 'div-1',
            type: 'Div',
          },
        }

        renderWithSduiLayout(document, { components: sduiComponents })

        const div = screen.getByTestId('div-div-1')
        expect(div).toBeInTheDocument()
        expect(div.tagName).toBe('DIV')
        expect(div).toHaveAttribute('data-node-id', 'div-1')
        expect(div).toHaveAttribute('data-testid', 'div-div-1')
      })
    })
  })

  describe('as is: Div with className attribute', () => {
    describe('when: attributes.className="custom-class" provided (equivalence: valid className)', () => {
      it('to be: className applied to element, should have custom-class in classList', () => {
        const document: SduiLayoutDocument = {
          version: '1.0.0',
          root: {
            id: 'div-class',
            type: 'Div',
            attributes: {
              className: 'custom-class',
            },
          },
        }

        renderWithSduiLayout(document, { components: sduiComponents })

        const div = screen.getByTestId('div-div-class')
        expect(div).toHaveClass('custom-class')
      })
    })
  })

  describe('as is: Div with as attribute', () => {
    describe('when: attributes.as="section" provided', () => {
      it('to be: renders as section element, should have correct tag name', () => {
        const document: SduiLayoutDocument = {
          version: '1.0.0',
          root: {
            id: 'div-section',
            type: 'Div',
            attributes: {
              as: 'section',
            },
          },
        }

        renderWithSduiLayout(document, { components: sduiComponents })

        const element = screen.getByTestId('div-div-section')
        expect(element.tagName).toBe('SECTION')
        expect(element).toHaveAttribute('data-node-id', 'div-section')
      })
    })
  })

  describe('as is: Div with empty children array', () => {
    describe('when: children array is empty (boundary: min-1)', () => {
      it('to be: renders empty div, should be empty DOM element', () => {
        const document: SduiLayoutDocument = {
          version: '1.0.0',
          root: {
            id: 'div-empty',
            type: 'Div',
            children: [],
          },
        }

        renderWithSduiLayout(document, { components: sduiComponents })

        const div = screen.getByTestId('div-div-empty')
        expect(div).toBeInTheDocument()
        expect(div).toBeEmptyDOMElement()
      })
    })
  })

  describe('as is: Div with single child', () => {
    describe('when: childrenIds contains one childId (boundary: single child)', () => {
      it('to be: renders child element, should display child content', () => {
        const document: SduiLayoutDocument = {
          version: '1.0.0',
          root: {
            id: 'div-parent',
            type: 'Div',
            children: [
              {
                id: 'text-1',
                type: 'Text',
                state: {
                  text: 'Child Content',
                },
              },
            ],
          },
        }

        renderWithSduiLayout(document, { components: sduiComponents })

        expect(screen.getByTestId('div-div-parent')).toBeInTheDocument()
        expect(screen.getByTestId('text-text-1')).toBeInTheDocument()
        expect(screen.getByText('Child Content')).toBeInTheDocument()
      })
    })
  })

  describe('as is: Div with multiple children', () => {
    describe('when: childrenIds contains multiple childIds (boundary: multiple children)', () => {
      it('to be: renders all children in order, should display all child contents', () => {
        const document: SduiLayoutDocument = {
          version: '1.0.0',
          root: {
            id: 'div-multi',
            type: 'Div',
            children: [
              {
                id: 'text-1',
                type: 'Text',
                state: {
                  text: 'Child 1',
                },
              },
              {
                id: 'text-2',
                type: 'Text',
                state: {
                  text: 'Child 2',
                },
              },
              {
                id: 'text-3',
                type: 'Text',
                state: {
                  text: 'Child 3',
                },
              },
            ],
          },
        }

        renderWithSduiLayout(document, { components: sduiComponents })

        expect(screen.getByText('Child 1')).toBeInTheDocument()
        expect(screen.getByText('Child 2')).toBeInTheDocument()
        expect(screen.getByText('Child 3')).toBeInTheDocument()
      })
    })
  })

  describe('as is: Div with nested children structure', () => {
    describe('when: Div contains another Div as child', () => {
      it('to be: renders nested structure correctly, should display both parent and child', () => {
        const document: SduiLayoutDocument = {
          version: '1.0.0',
          root: {
            id: 'div-parent',
            type: 'Div',
            children: [
              {
                id: 'div-child',
                type: 'Div',
                children: [],
              },
            ],
          },
        }

        renderWithSduiLayout(document, { components: sduiComponents })

        const parentDiv = screen.getByTestId('div-div-parent')
        const childDiv = screen.getByTestId('div-div-child')

        expect(parentDiv).toBeInTheDocument()
        expect(childDiv).toBeInTheDocument()
        expect(parentDiv).toContainElement(childDiv)
      })
    })
  })

  describe('as is: Div with multiple nested levels', () => {
    describe('when: Div contains Div which contains Text', () => {
      it('to be: renders all levels correctly, should display nested content', () => {
        const document: SduiLayoutDocument = {
          version: '1.0.0',
          root: {
            id: 'div-level1',
            type: 'Div',
            children: [
              {
                id: 'div-level2',
                type: 'Div',
                children: [
                  {
                    id: 'text-level3',
                    type: 'Text',
                    state: {
                      text: 'Nested Text',
                    },
                  },
                ],
              },
            ],
          },
        }

        renderWithSduiLayout(document, { components: sduiComponents })

        expect(screen.getByTestId('div-div-level1')).toBeInTheDocument()
        expect(screen.getByTestId('div-div-level2')).toBeInTheDocument()
        expect(screen.getByTestId('text-text-level3')).toBeInTheDocument()
        expect(screen.getByText('Nested Text')).toBeInTheDocument()
      })
    })
  })

  describe('as is: Div with className and custom element type', () => {
    describe('when: attributes.className="container" and attributes.as="main" both provided', () => {
      it('to be: both className and element type applied, should have container class and main tag', () => {
        const document: SduiLayoutDocument = {
          version: '1.0.0',
          root: {
            id: 'div-combined',
            type: 'Div',
            attributes: {
              className: 'container',
              as: 'main',
            },
          },
        }

        renderWithSduiLayout(document, { components: sduiComponents })

        const element = screen.getByTestId('div-div-combined')
        expect(element.tagName).toBe('MAIN')
        expect(element).toHaveClass('container')
      })
    })
  })
})
