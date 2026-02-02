/**
 * SDUI Integration Tests for Text Component
 *
 * Tests that verify Text component renders correctly when used via SDUI documents.
 * These tests complement any existing text.logic.test.tsx which tests the component directly.
 */

import type { SduiLayoutDocument } from '@lodado/sdui-template'
import { renderWithSduiLayout } from '@lodado/sdui-template/test'
import { screen } from '@testing-library/react'

import { sduiComponents } from '../../../../app/sduiComponents'

describe('Text - SDUI Integration Tests', () => {
  describe('as is: Text with minimal document', () => {
    describe('when: rendered via SDUI with id, type, and state.text', () => {
      it('to be: component renders correctly, should have correct DOM structure and display text', () => {
        const document: SduiLayoutDocument = {
          version: '1.0.0',
          root: {
            id: 'text-1',
            type: 'Text',
            state: {
              text: 'Hello World',
            },
          },
        }

        renderWithSduiLayout(document, { components: sduiComponents })

        const text = screen.getByTestId('text-text-1')
        expect(text).toBeInTheDocument()
        expect(text.tagName).toBe('SPAN')
        expect(text).toHaveAttribute('data-node-id', 'text-1')
        expect(text).toHaveTextContent('Hello World')
      })
    })
  })

  describe('as is: Text with state.text display', () => {
    describe('when: state.text="Sample Text" provided', () => {
      it('to be: text content displayed, should render the text value', () => {
        const document: SduiLayoutDocument = {
          version: '1.0.0',
          root: {
            id: 'text-sample',
            type: 'Text',
            state: {
              text: 'Sample Text',
            },
          },
        }

        renderWithSduiLayout(document, { components: sduiComponents })

        const text = screen.getByText('Sample Text')
        expect(text).toBeInTheDocument()
        expect(text).toHaveAttribute('data-node-id', 'text-sample')
      })
    })
  })

  describe('as is: Text with empty text', () => {
    describe('when: state.text is empty string "" (boundary: min-1)', () => {
      it('to be: component does not render, should return null', () => {
        const document: SduiLayoutDocument = {
          version: '1.0.0',
          root: {
            id: 'text-empty',
            type: 'Text',
            state: {
              text: '',
            },
          },
        }

        renderWithSduiLayout(document, { components: sduiComponents })

        // Text component returns null when text is empty
        expect(screen.queryByTestId('text-text-empty')).not.toBeInTheDocument()
      })
    })

    describe('when: state.text is undefined', () => {
      it('to be: component does not render, should return null', () => {
        const document: SduiLayoutDocument = {
          version: '1.0.0',
          root: {
            id: 'text-undefined',
            type: 'Text',
            state: {},
          },
        }

        renderWithSduiLayout(document, { components: sduiComponents })

        // Text component returns null when text is undefined
        expect(screen.queryByTestId('text-text-undefined')).not.toBeInTheDocument()
      })
    })
  })

  describe('as is: Text with non-empty text', () => {
    describe('when: state.text="Non-empty text" (boundary: non-empty)', () => {
      it('to be: text content rendered, should display the text', () => {
        const document: SduiLayoutDocument = {
          version: '1.0.0',
          root: {
            id: 'text-non-empty',
            type: 'Text',
            state: {
              text: 'Non-empty text',
            },
          },
        }

        renderWithSduiLayout(document, { components: sduiComponents })

        const text = screen.getByText('Non-empty text')
        expect(text).toBeInTheDocument()
        expect(text).toHaveAttribute('data-node-id', 'text-non-empty')
      })
    })
  })

  describe('as is: Text with className attribute', () => {
    describe('when: attributes.className="custom-text" provided (equivalence: valid className)', () => {
      it('to be: className applied to element, should have custom-text in classList', () => {
        const document: SduiLayoutDocument = {
          version: '1.0.0',
          root: {
            id: 'text-class',
            type: 'Text',
            state: {
              text: 'Styled Text',
            },
            attributes: {
              className: 'custom-text',
            },
          },
        }

        renderWithSduiLayout(document, { components: sduiComponents })

        const text = screen.getByTestId('text-text-class')
        expect(text).toHaveClass('custom-text')
        expect(text).toHaveTextContent('Styled Text')
      })
    })
  })

  describe('as is: Text with long text content', () => {
    describe('when: state.text contains long string', () => {
      it('to be: full text content rendered, should display entire text', () => {
        const longText = 'This is a very long text content that should be displayed in full without any truncation or modification.'
        const document: SduiLayoutDocument = {
          version: '1.0.0',
          root: {
            id: 'text-long',
            type: 'Text',
            state: {
              text: longText,
            },
          },
        }

        renderWithSduiLayout(document, { components: sduiComponents })

        const text = screen.getByText(longText)
        expect(text).toBeInTheDocument()
        expect(text).toHaveTextContent(longText)
      })
    })
  })

  describe('as is: Text with special characters', () => {
    describe('when: state.text contains special characters', () => {
      it('to be: special characters rendered correctly, should display all characters', () => {
        const specialText = 'Text with <special> & "characters"'
        const document: SduiLayoutDocument = {
          version: '1.0.0',
          root: {
            id: 'text-special',
            type: 'Text',
            state: {
              text: specialText,
            },
          },
        }

        renderWithSduiLayout(document, { components: sduiComponents })

        const text = screen.getByText(specialText)
        expect(text).toBeInTheDocument()
        expect(text).toHaveTextContent(specialText)
      })
    })
  })

  describe('as is: Text with default text color styling', () => {
    describe('when: rendered without custom className', () => {
      it('to be: default text color class applied, should have text-[var(--color-text-default)] class', () => {
        const document: SduiLayoutDocument = {
          version: '1.0.0',
          root: {
            id: 'text-default',
            type: 'Text',
            state: {
              text: 'Default Text',
            },
          },
        }

        renderWithSduiLayout(document, { components: sduiComponents })

        const text = screen.getByTestId('text-text-default')
        expect(text).toHaveClass('text-[var(--color-text-default)]')
      })
    })
  })
})
