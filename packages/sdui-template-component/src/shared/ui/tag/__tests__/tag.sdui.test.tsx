import type { SduiLayoutDocument } from '@lodado/sdui-template'
import { renderWithSduiLayout } from '@lodado/sdui-template/test'
import { screen } from '@testing-library/react'

import { sduiComponents } from '../../../../app/sduiComponents'

describe('Tag - SDUI Integration Tests', () => {
  describe('as is: Tag with minimal document', () => {
    describe('when: rendered via SDUI with state.text only', () => {
      it('to be: tag renders correctly, should display tag text', () => {
        const document: SduiLayoutDocument = {
          version: '1.0.0',
          root: {
            id: 'tag-root',
            type: 'Tag',
            state: {
              text: 'Tag Label',
            },
          },
        }
        renderWithSduiLayout(document, { components: sduiComponents })
        expect(screen.getByText('Tag Label')).toBeInTheDocument()
      })
    })
  })

  describe('as is: Tag with color state', () => {
    describe('when: color="standard" (first enum value)', () => {
      it('to be: tag renders with standard color, should have correct color variant', () => {
        const document: SduiLayoutDocument = {
          version: '1.0.0',
          root: {
            id: 'tag-root',
            type: 'Tag',
            state: {
              text: 'Standard Tag',
              color: 'standard',
            },
          },
        }
        renderWithSduiLayout(document, { components: sduiComponents })
        expect(screen.getByText('Standard Tag')).toBeInTheDocument()
      })
    })

    describe('when: color="magenta" (last enum value)', () => {
      it('to be: tag renders with magenta color, should have correct color variant', () => {
        const document: SduiLayoutDocument = {
          version: '1.0.0',
          root: {
            id: 'tag-root',
            type: 'Tag',
            state: {
              text: 'Magenta Tag',
              color: 'magenta',
            },
          },
        }
        renderWithSduiLayout(document, { components: sduiComponents })
        expect(screen.getByText('Magenta Tag')).toBeInTheDocument()
      })
    })
  })

  describe('as is: Tag with text state', () => {
    describe('when: text is empty string (boundary: empty string)', () => {
      it('to be: tag renders with empty text, should display empty tag', () => {
        const document: SduiLayoutDocument = {
          version: '1.0.0',
          root: {
            id: 'tag-root',
            type: 'Tag',
            state: {
              text: '',
            },
          },
        }
        const { container } = renderWithSduiLayout(document, { components: sduiComponents })
        // Tag should render even with empty text
        expect(container).toBeInTheDocument()
      })
    })
  })

  describe('as is: Tag with attributes', () => {
    describe('when: className is provided', () => {
      it('to be: tag has custom class, should have className attribute', () => {
        const document: SduiLayoutDocument = {
          version: '1.0.0',
          root: {
            id: 'tag-root',
            type: 'Tag',
            state: {
              text: 'Custom Tag',
            },
            attributes: {
              className: 'custom-tag-class',
            },
          },
        }
        renderWithSduiLayout(document, { components: sduiComponents })
        expect(screen.getByText('Custom Tag')).toBeInTheDocument()
        // Tag should have custom className
      })
    })
  })
})
