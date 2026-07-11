import type { SduiDocumentContent } from '@lodado/sdui-document'
import { createDocumentBlock } from '@lodado/sdui-document'
import { render } from '@testing-library/react'
import React from 'react'

import { SduiDocumentViewer } from '../../viewer/SduiDocumentViewer'
import { SduiDocumentEditor } from '../SduiDocumentEditor'

function createContent(): SduiDocumentContent {
  return {
    schemaVersion: '1.0',
    root: createDocumentBlock({
      id: 'root',
      type: 'document.root',
      children: [createDocumentBlock({ id: 'p1', type: 'document.paragraph', state: { text: 'Hello' } })],
    }),
  }
}

function themeAttr(container: HTMLElement): string | null {
  return container.querySelector('[data-sdui-document-editor]')?.getAttribute('data-sdui-doc-theme') ?? null
}

describe('theme prop', () => {
  describe('as is: SduiDocumentEditor without a theme prop', () => {
    it('to be: data-sdui-doc-theme defaults to "swiss" on the root', () => {
      const { container } = render(<SduiDocumentEditor content={createContent()} onContentChange={() => {}} />)
      expect(themeAttr(container)).toBe('swiss')
    })
  })

  describe('as is: SduiDocumentEditor with theme="notion"', () => {
    it('to be: data-sdui-doc-theme renders the opt-out value', () => {
      const { container } = render(
        <SduiDocumentEditor content={createContent()} onContentChange={() => {}} theme="notion" />,
      )
      expect(themeAttr(container)).toBe('notion')
    })
  })

  describe('as is: SduiDocumentViewer without a theme prop', () => {
    it('to be: data-sdui-doc-theme defaults to "swiss" on the root', () => {
      const { container } = render(<SduiDocumentViewer content={createContent()} />)
      expect(themeAttr(container)).toBe('swiss')
    })
  })

  describe('as is: SduiDocumentViewer with theme="notion"', () => {
    it('to be: data-sdui-doc-theme renders the opt-out value', () => {
      const { container } = render(<SduiDocumentViewer content={createContent()} theme="notion" />)
      expect(themeAttr(container)).toBe('notion')
    })
  })
})
