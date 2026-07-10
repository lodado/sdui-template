import type { SduiDocumentContent, SduiDocumentPatch } from '@lodado/sdui-document'
import { createDocumentBlock } from '@lodado/sdui-document'

import { appendMultiBlockMovePatches } from '../multiBlockMove'

function doc(): SduiDocumentContent {
  return {
    schemaVersion: '1.0',
    root: createDocumentBlock({
      id: 'root',
      type: 'document.root',
      children: [
        createDocumentBlock({ id: 'a', type: 'document.paragraph', state: { text: 'a' } }),
        createDocumentBlock({ id: 'b', type: 'document.paragraph', state: { text: 'b' } }),
        createDocumentBlock({ id: 'c', type: 'document.paragraph', state: { text: 'c' } }),
      ],
    }),
  }
}

const move = (blockId: string): SduiDocumentPatch =>
  ({ type: 'block.move', blockId, parentId: 'root', after: 'x' } as unknown as SduiDocumentPatch)

describe('appendMultiBlockMovePatches', () => {
  test('single selection is untouched', () => {
    const base = [move('a')]
    expect(appendMultiBlockMovePatches(base, 'a', ['a'], doc())).toBe(base)
  })

  test('active block not in selection is untouched', () => {
    const base = [move('a')]
    expect(appendMultiBlockMovePatches(base, 'a', ['b', 'c'], doc())).toBe(base)
  })

  test('chains the other selected blocks after the dragged one, in document order', () => {
    const base = [move('a')]
    const result = appendMultiBlockMovePatches(base, 'a', ['c', 'a', 'b'], doc())
    expect(result).toHaveLength(3)
    expect(result.map((p) => (p.type === 'block.move' ? [p.blockId, (p as { after?: string }).after] : null))).toEqual([
      ['a', 'x'],
      ['b', 'a'], // b follows a (doc order before c)
      ['c', 'b'], // c follows b
    ])
  })

  test('a multi-patch (column) drop is left as-is', () => {
    const base = [move('a'), move('a')]
    expect(appendMultiBlockMovePatches(base, 'a', ['a', 'b'], doc())).toBe(base)
  })
})
