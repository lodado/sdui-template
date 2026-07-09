import type { SduiDocumentContent } from '@lodado/sdui-document'
import { createDocumentBlock } from '@lodado/sdui-document'
import type { ComponentFactory } from '@lodado/sdui-template'
import { useSduiVariable } from '@lodado/sdui-template'
import { render, screen } from '@testing-library/react'
import React from 'react'

import { SduiDocumentViewer } from '../../viewer/SduiDocumentViewer'
import { SduiComponentsProvider } from '../sdui/SduiComponentsContext'
import { SduiDocumentBridgeProvider, type SduiDocumentVariablesSelector } from '../sdui/SduiDocumentBridgeContext'

function contentWithChecks(checked: number): SduiDocumentContent {
  return {
    schemaVersion: '1.0',
    root: createDocumentBlock({
      id: 'root',
      type: 'document.root',
      children: [
        createDocumentBlock({
          id: 'c1',
          type: 'document.checklist',
          state: { text: 'a' },
          attributes: { checked: checked > 0 },
        }),
        createDocumentBlock({
          id: 'c2',
          type: 'document.checklist',
          state: { text: 'b' },
          attributes: { checked: checked > 1 },
        }),
        createDocumentBlock({
          id: 'widget',
          type: 'document.sdui',
          attributes: { document: { version: '1.0', root: { id: 'w', type: 'Progress' } } },
        }),
      ],
    }),
  }
}

const ProgressWidget = () => {
  const done = useSduiVariable<number>('doc.checkedCount')
  return <div data-testid="progress">done:{String(done)}</div>
}

const components: Record<string, ComponentFactory> = {
  Progress: () => <ProgressWidget />,
}

const selectVariables: SduiDocumentVariablesSelector = (content) => ({
  'doc.checkedCount': (content.root.children ?? []).filter((child) => child.attributes?.checked === true).length,
})

function renderBridged(content: SduiDocumentContent) {
  return render(
    <SduiComponentsProvider value={components}>
      <SduiDocumentBridgeProvider value={selectVariables}>
        <SduiDocumentViewer content={content} />
      </SduiDocumentBridgeProvider>
    </SduiComponentsProvider>,
  )
}

describe('document → sdui layout state bridge', () => {
  describe('as is: viewer with a bridge selector counting checked checklists', () => {
    it('to be: the embedded widget reads the selected variables', () => {
      renderBridged(contentWithChecks(1))

      expect(screen.getByTestId('progress')).toHaveTextContent('done:1')
    })

    it('to be: variables follow document content changes', () => {
      const { rerender } = renderBridged(contentWithChecks(1))

      rerender(
        <SduiComponentsProvider value={components}>
          <SduiDocumentBridgeProvider value={selectVariables}>
            <SduiDocumentViewer content={contentWithChecks(2)} />
          </SduiDocumentBridgeProvider>
        </SduiComponentsProvider>,
      )

      expect(screen.getByTestId('progress')).toHaveTextContent('done:2')
    })
  })

  describe('as is: no bridge provider (EP: bridge is optional)', () => {
    it('to be: widget renders with no variables injected', () => {
      render(
        <SduiComponentsProvider value={components}>
          <SduiDocumentViewer content={contentWithChecks(1)} />
        </SduiComponentsProvider>,
      )

      expect(screen.getByTestId('progress')).toHaveTextContent('done:undefined')
    })
  })
})
