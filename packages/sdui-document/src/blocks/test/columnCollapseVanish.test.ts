import { appendColumnCleanupPatches, createHorizontalBlockDropPatches } from '../drag'
import { applyDocumentPatches } from '../patch'
import {
  createDocumentBlock,
  type SduiDocumentBlock,
  type SduiDocumentContent,
  type SduiDocumentPatch,
} from '../schema'

function storyContent(): SduiDocumentContent {
  return {
    schemaVersion: '1.0',
    root: createDocumentBlock({
      id: 'root',
      type: 'document.root',
      children: [
        createDocumentBlock({ id: 'range-p1', type: 'document.paragraph', state: { text: 'P1' } }),
        createDocumentBlock({
          id: 'range-p2',
          type: 'document.paragraph',
          state: { text: 'P2' },
          children: [
            createDocumentBlock({ id: 'range-p2-child', type: 'document.paragraph', state: { text: 'CHILD' } }),
          ],
        }),
        createDocumentBlock({ id: 'range-tail', type: 'document.paragraph', state: { text: 'TAIL' } }),
      ],
    }),
  }
}

function collectTexts(block: SduiDocumentBlock, into: string[] = []): string[] {
  const text = (block.state as { text?: string } | undefined)?.text
  if (typeof text === 'string') into.push(text)
  block.children?.forEach((child) => collectTexts(child, into))
  return into
}

// The user's exact applied patches (origin stripped), in order.
const USER_PATCHES: SduiDocumentPatch[] = [
  { type: 'block.move', blockId: 'range-p2-child', parentId: 'root', after: 'range-p1' },
  { type: 'block.delete', blockId: 'range-p2-child-col' },
  { type: 'block.move', blockId: 'range-tail', parentId: 'range-p2', before: 'range-p2-child-cols' },
  { type: 'block.delete', blockId: 'range-p2-child-cols' },
  {
    type: 'block.insert',
    parentId: 'range-p2',
    after: 'range-tail',
    block: {
      id: 'range-p2-child-cols',
      type: 'document.columnList',
      children: [{ id: 'range-tail-col', type: 'document.column', position: 'a1', children: [] }],
      position: 'Zz',
    },
  } as SduiDocumentPatch,
  {
    type: 'block.move',
    blockId: 'range-tail',
    parentId: 'range-tail-col',
    after: null,
    before: null,
  } as SduiDocumentPatch,
  {
    type: 'block.insert',
    parentId: 'range-p2-child-cols',
    after: null,
    block: { id: 'range-p2-child-col', type: 'document.column', position: 'a0', children: [] },
  } as SduiDocumentPatch,
  {
    type: 'block.move',
    blockId: 'range-p2-child',
    parentId: 'range-p2-child-col',
    after: null,
    before: null,
  } as SduiDocumentPatch,
  { type: 'block.move', blockId: 'range-p2-child', parentId: 'range-p1', after: null },
  { type: 'block.delete', blockId: 'range-p2-child-col' },
  { type: 'block.move', blockId: 'range-tail', parentId: 'range-p2', before: 'range-p2-child-cols' },
  { type: 'block.delete', blockId: 'range-p2-child-cols' },
]

describe('column collapse must not drop blocks (regression: 칸 사라짐)', () => {
  it('applying the user exact patch log to the split tree keeps every block', () => {
    // Reconstruct the pre-log state: split range-tail onto range-p2-child.
    let doc = storyContent()
    doc = applyDocumentPatches(
      doc,
      appendColumnCleanupPatches(
        doc,
        createHorizontalBlockDropPatches({
          content: doc,
          activeId: 'range-tail',
          overId: 'range-p2-child',
          side: 'right',
        }) ?? [],
      ),
    )
    expect(collectTexts(doc.root).sort()).toEqual(['CHILD', 'P1', 'P2', 'TAIL'])

    // Replay the user's exact patch log. The patch layer keeps every block —
    // the vanish was in the React render model's GC (see entry.test.ts), not here.
    USER_PATCHES.forEach((patch) => {
      doc = applyDocumentPatches(doc, [patch])
      expect(collectTexts(doc.root).sort()).toEqual(['CHILD', 'P1', 'P2', 'TAIL'])
    })
  })
})
