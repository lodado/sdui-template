import { createBlockId, createDocumentBlock, findBlockById, type SduiDocumentContent } from '@lodado/sdui-document'
import { act, renderHook } from '@testing-library/react'

import { useDocumentPatches } from '../hooks/useDocumentPatches'
import { stripPatchOrigins } from './patchTestUtils'

function createContent(): SduiDocumentContent {
  return {
    schemaVersion: '1.0',
    root: createDocumentBlock({
      id: 'root',
      type: 'document.root',
      children: [createDocumentBlock({ id: 'p1', type: 'document.paragraph', state: { text: 'Before' } })],
    }),
  }
}

describe('useDocumentPatches', () => {
  it('keeps empty patch batches silent and publishes applied document patches', () => {
    const onContentChange = jest.fn()
    const { result } = renderHook(() => useDocumentPatches({ content: createContent(), onContentChange }))

    act(() => {
      result.current.applyPatches([])
    })
    expect(onContentChange).not.toHaveBeenCalled()

    act(() => {
      result.current.applyPatches([{ type: 'block.update', blockId: createBlockId('p1'), state: { text: 'After' } }])
    })
    expect(findBlockById(result.current.docRef.current, 'p1')?.state?.text).toBe('After')
    expect(onContentChange).toHaveBeenCalledTimes(1)
    expect(stripPatchOrigins(onContentChange.mock.calls[0][1])).toEqual([
      { type: 'block.update', blockId: createBlockId('p1'), state: { text: 'After' } },
    ])
  })
})
