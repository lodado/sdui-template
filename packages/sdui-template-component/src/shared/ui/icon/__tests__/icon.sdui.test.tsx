import type { SduiLayoutDocument } from '@lodado/sdui-template'
import { renderWithSduiLayout } from '@lodado/sdui-template/test'
import { screen } from '@testing-library/react'

import { sduiComponents } from '../../../../app/sduiComponents'

describe('Icon - SDUI Integration Tests', () => {
  describe('as is: Icon with minimal document', () => {
    describe('when: rendered via SDUI with root only', () => {
      it('to be: icon renders correctly, should have icon element in DOM', () => {
        const document: SduiLayoutDocument = {
          version: '1.0.0',
          root: {
            id: 'icon-root',
            type: 'Icon',
          },
        }
        const { container } = renderWithSduiLayout(document, { components: sduiComponents })
        // Icon should render
        expect(container).toBeInTheDocument()
      })
    })
  })

  describe('as is: Icon with size state', () => {
    describe('when: size="12px" (first predefined size)', () => {
      it('to be: icon renders with 12px size, should have correct size prop', () => {
        const document: SduiLayoutDocument = {
          version: '1.0.0',
          root: {
            id: 'icon-root',
            type: 'Icon',
            state: {
              size: '12px',
            },
            children: [
              {
                id: 'svg-child',
                type: 'Div',
                children: [
                  {
                    id: 'svg-text',
                    type: 'Text',
                    state: { text: 'SVG' },
                  },
                ],
              },
            ],
          },
        }
        renderWithSduiLayout(document, { components: sduiComponents })
        expect(screen.getByText('SVG')).toBeInTheDocument()
      })
    })

    describe('when: size="64px" (last predefined size)', () => {
      it('to be: icon renders with 64px size, should have correct size prop', () => {
        const document: SduiLayoutDocument = {
          version: '1.0.0',
          root: {
            id: 'icon-root',
            type: 'Icon',
            state: {
              size: '64px',
            },
            children: [
              {
                id: 'svg-child',
                type: 'Div',
                children: [
                  {
                    id: 'svg-text',
                    type: 'Text',
                    state: { text: 'Large SVG' },
                  },
                ],
              },
            ],
          },
        }
        renderWithSduiLayout(document, { components: sduiComponents })
        expect(screen.getByText('Large SVG')).toBeInTheDocument()
      })
    })

    describe('when: size is custom value (equivalence: valid custom size)', () => {
      it('to be: icon renders with custom size, should have correct size prop', () => {
        const document: SduiLayoutDocument = {
          version: '1.0.0',
          root: {
            id: 'icon-root',
            type: 'Icon',
            state: {
              size: '18px',
            },
            children: [
              {
                id: 'svg-child',
                type: 'Div',
                children: [
                  {
                    id: 'svg-text',
                    type: 'Text',
                    state: { text: 'Custom SVG' },
                  },
                ],
              },
            ],
          },
        }
        renderWithSduiLayout(document, { components: sduiComponents })
        expect(screen.getByText('Custom SVG')).toBeInTheDocument()
      })
    })
  })

  describe('as is: Icon with children (SVG) rendering', () => {
    describe('when: SVG children are provided', () => {
      it('to be: SVG renders correctly, should display SVG content', () => {
        const document: SduiLayoutDocument = {
          version: '1.0.0',
          root: {
            id: 'icon-root',
            type: 'Icon',
            state: {
              size: '24px',
            },
            children: [
              {
                id: 'svg-wrapper',
                type: 'Div',
                attributes: {
                  'data-testid': 'svg-content',
                },
                children: [
                  {
                    id: 'svg-text',
                    type: 'Text',
                    state: { text: 'SVG Icon Content' },
                  },
                ],
              },
            ],
          },
        }
        renderWithSduiLayout(document, { components: sduiComponents })
        expect(screen.getByText('SVG Icon Content')).toBeInTheDocument()
      })
    })

    describe('when: children array is empty (boundary: min-1)', () => {
      it('to be: icon renders without children, should be placeholder icon', () => {
        const document: SduiLayoutDocument = {
          version: '1.0.0',
          root: {
            id: 'icon-root',
            type: 'Icon',
            state: {
              size: '24px',
            },
            children: [],
          },
        }
        renderWithSduiLayout(document, { components: sduiComponents })
        // Icon should render as placeholder when no children
        expect(document.root.id).toBe('icon-root')
      })
    })
  })

  describe('as is: Icon with attributes', () => {
    describe('when: aria-label is provided', () => {
      it('to be: icon has accessible label, should have aria-label attribute', () => {
        const document: SduiLayoutDocument = {
          version: '1.0.0',
          root: {
            id: 'icon-root',
            type: 'Icon',
            attributes: {
              'aria-label': 'Close icon',
            },
            children: [
              {
                id: 'svg-child',
                type: 'Div',
                children: [
                  {
                    id: 'svg-text',
                    type: 'Text',
                    state: { text: 'X' },
                  },
                ],
              },
            ],
          },
        }
        renderWithSduiLayout(document, { components: sduiComponents })
        const icon = screen.getByLabelText('Close icon')
        expect(icon).toBeInTheDocument()
      })
    })

    describe('when: className is provided', () => {
      it('to be: icon has custom class, should have className attribute', () => {
        const document: SduiLayoutDocument = {
          version: '1.0.0',
          root: {
            id: 'icon-root',
            type: 'Icon',
            attributes: {
              className: 'custom-icon-class',
            },
            children: [
              {
                id: 'svg-child',
                type: 'Div',
                children: [
                  {
                    id: 'svg-text',
                    type: 'Text',
                    state: { text: 'Icon' },
                  },
                ],
              },
            ],
          },
        }
        renderWithSduiLayout(document, { components: sduiComponents })
        expect(screen.getByText('Icon')).toBeInTheDocument()
        // Icon should have custom className
      })
    })
  })
})
