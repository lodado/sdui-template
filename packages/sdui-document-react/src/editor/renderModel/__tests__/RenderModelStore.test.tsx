import { applyDocumentPatches, createDocumentBlock, type SduiDocumentContent } from '@lodado/sdui-document'
import { act, render, screen } from '@testing-library/react'
import React from 'react'

import { createRenderModelStore } from '../RenderModelStore'
import { useBlockEntry } from '../useBlockEntry'

function makeContent(): SduiDocumentContent {
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

describe('RenderModelStore', () => {
  it('notifies only the changed id', () => {
    const content = makeContent()
    const store = createRenderModelStore()
    store.sync(null, content.root)

    const aCalls: number[] = []
    const bCalls: number[] = []
    store.subscribe('a', () => aCalls.push(1))
    store.subscribe('b', () => bCalls.push(1))

    const after = applyDocumentPatches(content, [{ type: 'block.update', blockId: 'a', state: { text: 'A2' } }])
    store.sync(content.root, after.root)

    expect(aCalls).toHaveLength(1) // edited
    expect(bCalls).toHaveLength(0) // untouched
  })

  it('useBlockEntry re-renders only the edited row', () => {
    const content = makeContent()
    const store = createRenderModelStore()
    store.sync(null, content.root)

    const counts: Record<string, number> = {}
    const Row: React.FC<{ id: string }> = ({ id }) => {
      const entry = useBlockEntry(store, id)
      counts[id] = (counts[id] ?? 0) + 1
      return <div data-testid={`row-${id}`}>{String((entry?.state as { text?: string })?.text)}</div>
    }

    render(
      <>
        <Row id="a" />
        <Row id="b" />
      </>,
    )

    expect(counts.a).toBe(1)
    expect(counts.b).toBe(1)

    const after = applyDocumentPatches(content, [{ type: 'block.update', blockId: 'a', state: { text: 'A2' } }])
    act(() => {
      store.sync(content.root, after.root)
    })

    expect(screen.getByTestId('row-a')).toHaveTextContent('A2')
    expect(counts.a).toBe(2) // re-rendered
    expect(counts.b).toBe(1) // untouched
  })

  // The block-DnD re-render optimization: dragging a block to a new slot changes
  // only the parent's child-id list, so the render model must wake ONLY the
  // parent — never the untouched siblings. (The moved block itself may wake once
  // for its own position change; that is expected, not a leak.)
  it('reorders notify the parent and leave untouched siblings silent', () => {
    const content: SduiDocumentContent = {
      schemaVersion: '1.0',
      root: createDocumentBlock({
        id: 'root',
        type: 'document.root',
        children: [
          createDocumentBlock({ id: 'a', type: 'document.paragraph', position: 'a0', state: { text: 'A' } }),
          createDocumentBlock({ id: 'b', type: 'document.paragraph', position: 'a1', state: { text: 'B' } }),
          createDocumentBlock({ id: 'c', type: 'document.paragraph', position: 'a2', state: { text: 'C' } }),
        ],
      }),
    }
    const store = createRenderModelStore()
    store.sync(null, content.root)

    const calls: Record<string, number> = { root: 0, a: 0, b: 0, c: 0 }
    ;(['root', 'a', 'b', 'c'] as const).forEach((id) => {
      store.subscribe(id, () => {
        calls[id] += 1
      })
    })

    // reorder [a, b, c] -> [a, c, b]: only root's child-id list changes
    const after = applyDocumentPatches(content, [{ type: 'block.move', blockId: 'c', parentId: 'root', after: 'a' }])
    store.sync(content.root, after.root)

    expect(calls.root).toBe(1) // parent's childrenIds reordered → one notify
    expect(calls.a).toBe(0) // untouched sibling stays silent
    expect(calls.b).toBe(0) // untouched sibling stays silent
  })
})
