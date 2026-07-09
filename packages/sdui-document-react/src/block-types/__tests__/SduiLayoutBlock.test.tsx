import type { ComponentFactory } from '@lodado/sdui-template'
import { render, screen } from '@testing-library/react'
import React from 'react'

import { SduiComponentsProvider } from '../sdui/SduiComponentsContext'
import { SduiLayoutBlock } from '../sdui/SduiLayoutBlock'

const LAYOUT_DOC = {
  version: '1.0',
  root: { id: 'w-root', type: 'Widget' },
}

const sduiBlock = { id: 's1', type: 'document.sdui', attributes: { document: LAYOUT_DOC } }

const components: Record<string, ComponentFactory> = {
  Widget: (id) => <div data-testid="widget">widget:{id}</div>,
}

describe('SduiLayoutBlock', () => {
  describe('as is: sdui block with an embedded layout document', () => {
    describe('when wrapped in SduiComponentsProvider', () => {
      it('to be: the layout renders through the host component map', () => {
        render(
          <SduiComponentsProvider value={components}>
            <SduiLayoutBlock block={sduiBlock as never} />
          </SduiComponentsProvider>,
        )

        expect(screen.getByTestId('widget')).toHaveTextContent('widget:w-root')
      })
    })

    describe('when no component map is provided (EP: blocked-by-default)', () => {
      it('to be: placeholder instead of the layout', () => {
        render(<SduiLayoutBlock block={sduiBlock as never} />)

        expect(screen.getByText(/no component map/i)).toBeInTheDocument()
        expect(screen.queryByTestId('widget')).not.toBeInTheDocument()
      })
    })

    describe('when the component map is empty', () => {
      it('to be: placeholder instead of the layout', () => {
        render(
          <SduiComponentsProvider value={{}}>
            <SduiLayoutBlock block={sduiBlock as never} />
          </SduiComponentsProvider>,
        )

        expect(screen.getByText(/no component map/i)).toBeInTheDocument()
      })
    })
  })

  describe('as is: sdui block with a broken document attribute (EP: invalid partition)', () => {
    it.each([[undefined], [null], ['not-an-object'], [{ version: '1.0' }]])(
      'when document = %p, to be: invalid notice',
      (document) => {
        render(
          <SduiComponentsProvider value={components}>
            <SduiLayoutBlock block={{ id: 'bad', type: 'document.sdui', attributes: { document } } as never} />
          </SduiComponentsProvider>,
        )

        expect(screen.getByText(/invalid sdui layout document/i)).toBeInTheDocument()
      },
    )
  })
})
