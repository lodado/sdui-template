import { applyDocumentPatches, createDocumentBlock, type SduiDocumentContent } from '@lodado/sdui-document'

import { buildBlockDropPatches, type OverHit } from '../../hooks/useBlockPointerDrag'
import { createRenderModelStore } from '../RenderModelStore'

function content(): SduiDocumentContent {
  return {
    schemaVersion: '1.0',
    root: createDocumentBlock({
      id: 'root',
      type: 'document.root',
      children: [
        createDocumentBlock({ id: 'a', type: 'document.paragraph', position: 'a0', state: { text: 'A' } }),
        createDocumentBlock({ id: 'b', type: 'document.paragraph', position: 'a1', state: { text: 'B' } }),
      ],
    }),
  }
}

function afterDrop(pointerX: number, pointerY: number) {
  const hit: OverHit = { overId: 'b', rowRect: { left: 0, top: 0, width: 200, height: 30 } }
  const patches = buildBlockDropPatches({
    content: content(),
    activeId: 'a',
    hit,
    pointerX,
    pointerY,
    startX: pointerX,
    indentWidth: 24,
  })
  return applyDocumentPatches(content(), patches ?? [])
}

/**
 * The LIVE drop path feeds the render store an incremental prev→next sync (not a
 * fresh mount). If a moved block's entry is dropped by that sync, its row
 * renders null and the block vanishes on drop. This is the transition a
 * full-render test cannot catch.
 */
describe('render store survives a drop transition (regression: nodes vanish on drop)', () => {
  it('right-edge column split keeps both block entries live', () => {
    const next = afterDrop(180, 15) // right band → split
    const store = createRenderModelStore()
    store.sync(null, content().root)

    store.sync(content().root, next.root)

    expect(store.entryFor('a')).toBeDefined()
    expect(store.entryFor('b')).toBeDefined()
  })

  it('bottom-zone vertical move keeps both block entries live', () => {
    const next = afterDrop(100, 29)
    const store = createRenderModelStore()
    store.sync(null, content().root)

    store.sync(content().root, next.root)

    expect(store.entryFor('a')).toBeDefined()
    expect(store.entryFor('b')).toBeDefined()
  })
})
