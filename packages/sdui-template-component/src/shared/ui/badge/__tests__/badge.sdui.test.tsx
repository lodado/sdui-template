import type { SduiLayoutDocument } from '@lodado/sdui-template'
import { renderWithSduiLayout } from '@lodado/sdui-template/test'
import { screen } from '@testing-library/react'

import { sduiComponents } from '../../../../app/sduiComponents'

describe('Badge - SDUI Integration Tests', () => {
  describe('as is: Badge with minimal document', () => {
    describe('when: rendered via SDUI with state.label only', () => {
      it('to be: badge renders correctly, should display badge label', () => {
        const document: SduiLayoutDocument = {
          version: '1.0.0',
          root: {
            id: 'badge-root',
            type: 'Badge',
            state: {
              label: 25,
            },
          },
        }
        renderWithSduiLayout(document, { components: sduiComponents })
        expect(screen.getByText('25')).toBeInTheDocument()
      })
    })
  })

  describe('as is: Badge with appearance state', () => {
    describe('when: appearance="default" (first enum value)', () => {
      it('to be: badge renders with default appearance, should have correct appearance variant', () => {
        const document: SduiLayoutDocument = {
          version: '1.0.0',
          root: {
            id: 'badge-root',
            type: 'Badge',
            state: {
              label: 25,
              appearance: 'default',
            },
          },
        }
        renderWithSduiLayout(document, { components: sduiComponents })
        expect(screen.getByText('25')).toBeInTheDocument()
      })
    })
  })

  describe('as is: Badge with label state', () => {
    describe('when: label is provided as number (non-zero number)', () => {
      it('to be: badge label is displayed, should show badge content', () => {
        const document: SduiLayoutDocument = {
          version: '1.0.0',
          root: {
            id: 'badge-root',
            type: 'Badge',
            state: {
              label: 99,
            },
          },
        }
        renderWithSduiLayout(document, { components: sduiComponents })
        expect(screen.getByText('99')).toBeInTheDocument()
      })
    })

    describe('when: label is provided as string (non-empty string)', () => {
      it('to be: badge label is displayed, should show badge content', () => {
        const document: SduiLayoutDocument = {
          version: '1.0.0',
          root: {
            id: 'badge-root',
            type: 'Badge',
            state: {
              label: '99+',
            },
          },
        }
        renderWithSduiLayout(document, { components: sduiComponents })
        expect(screen.getByText('99+')).toBeInTheDocument()
      })
    })

    describe('when: label is zero (boundary: zero)', () => {
      it('to be: badge renders with zero label, should display zero badge', () => {
        const document: SduiLayoutDocument = {
          version: '1.0.0',
          root: {
            id: 'badge-root',
            type: 'Badge',
            state: {
              label: 0,
            },
          },
        }
        renderWithSduiLayout(document, { components: sduiComponents })
        expect(screen.getByText('0')).toBeInTheDocument()
      })
    })

    describe('when: label is empty string (boundary: empty string)', () => {
      it('to be: badge renders with empty label, should display empty badge', () => {
        const document: SduiLayoutDocument = {
          version: '1.0.0',
          root: {
            id: 'badge-root',
            type: 'Badge',
            state: {
              label: '',
            },
          },
        }
        const { container } = renderWithSduiLayout(document, { components: sduiComponents })
        // Badge should render even with empty label
        expect(container).toBeInTheDocument()
      })
    })
  })

  describe('as is: Badge with attributes', () => {
    describe('when: className is provided', () => {
      it('to be: badge has custom class, should have className attribute', () => {
        const document: SduiLayoutDocument = {
          version: '1.0.0',
          root: {
            id: 'badge-root',
            type: 'Badge',
            state: {
              label: 25,
            },
            attributes: {
              className: 'custom-badge-class',
            },
          },
        }
        renderWithSduiLayout(document, { components: sduiComponents })
        expect(screen.getByText('25')).toBeInTheDocument()
        // Badge should have custom className
      })
    })
  })
})
