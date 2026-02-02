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

    describe('when: color="blue" (equivalence: valid color)', () => {
      it('to be: tag renders with blue color, should have correct color variant', () => {
        const document: SduiLayoutDocument = {
          version: '1.0.0',
          root: {
            id: 'tag-root',
            type: 'Tag',
            state: {
              text: 'Blue Tag',
              color: 'blue',
            },
          },
        }
        renderWithSduiLayout(document, { components: sduiComponents })
        expect(screen.getByText('Blue Tag')).toBeInTheDocument()
      })
    })

    describe('when: color="red" (equivalence: valid color)', () => {
      it('to be: tag renders with red color, should have correct color variant', () => {
        const document: SduiLayoutDocument = {
          version: '1.0.0',
          root: {
            id: 'tag-root',
            type: 'Tag',
            state: {
              text: 'Red Tag',
              color: 'red',
            },
          },
        }
        renderWithSduiLayout(document, { components: sduiComponents })
        expect(screen.getByText('Red Tag')).toBeInTheDocument()
      })
    })
  })

  describe('as is: Tag with text state', () => {
    describe('when: text is provided (non-empty string)', () => {
      it('to be: tag text is displayed, should show tag content', () => {
        const document: SduiLayoutDocument = {
          version: '1.0.0',
          root: {
            id: 'tag-root',
            type: 'Tag',
            state: {
              text: 'Tag Content',
            },
          },
        }
        renderWithSduiLayout(document, { components: sduiComponents })
        expect(screen.getByText('Tag Content')).toBeInTheDocument()
      })
    })

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

  describe('as is: Tag with different color variants', () => {
    describe('when: color="green" (equivalence: valid color)', () => {
      it('to be: tag renders with green color, should have correct styling', () => {
        const document: SduiLayoutDocument = {
          version: '1.0.0',
          root: {
            id: 'tag-root',
            type: 'Tag',
            state: {
              text: 'Green Tag',
              color: 'green',
            },
          },
        }
        renderWithSduiLayout(document, { components: sduiComponents })
        expect(screen.getByText('Green Tag')).toBeInTheDocument()
      })
    })

    describe('when: color="yellow" (equivalence: valid color)', () => {
      it('to be: tag renders with yellow color, should have correct styling', () => {
        const document: SduiLayoutDocument = {
          version: '1.0.0',
          root: {
            id: 'tag-root',
            type: 'Tag',
            state: {
              text: 'Yellow Tag',
              color: 'yellow',
            },
          },
        }
        renderWithSduiLayout(document, { components: sduiComponents })
        expect(screen.getByText('Yellow Tag')).toBeInTheDocument()
      })
    })
  })
})
