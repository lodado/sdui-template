/**
 * Drift guard for the JSX duplicated between ViewerBlockNode and the readOnly
 * branch of editor/BlockNode: both must emit byte-identical DOM per block.
 */
import { render } from '@testing-library/react'
import React from 'react'

import { SduiDocumentEditor } from '../../editor/SduiDocumentEditor'
import { SduiDocumentViewer } from '../SduiDocumentViewer'
import { createViewerFixture } from './viewerFixture'

function topLevelBlocks(container: HTMLElement): Map<string, string> {
  const scope = container.querySelector('[data-sdui-document-editor]')
  const result = new Map<string, string>()
  scope?.querySelectorAll(':scope > [data-block-id]').forEach((element) => {
    result.set(element.getAttribute('data-block-id') ?? '', element.outerHTML)
  })

  return result
}

describe('viewer/editor DOM parity', () => {
  describe('as is: the same rich fixture (all block types, marks, columns, toggles, ordinals)', () => {
    describe('when rendered by SduiDocumentEditor readOnly and by SduiDocumentViewer', () => {
      it('to be: byte-identical outerHTML for every top-level block', () => {
        const content = createViewerFixture()
        const editor = render(<SduiDocumentEditor content={content} onContentChange={() => {}} readOnly />)
        const viewer = render(<SduiDocumentViewer content={content} />)

        const editorBlocks = topLevelBlocks(editor.container)
        const viewerBlocks = topLevelBlocks(viewer.container)

        expect([...viewerBlocks.keys()]).toEqual([...editorBlocks.keys()])
        editorBlocks.forEach((html, id) => {
          expect(viewerBlocks.get(id)).toBe(html)
        })
      })
    })
  })
})
