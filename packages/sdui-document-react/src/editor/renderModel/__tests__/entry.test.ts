import {
  applyDocumentPatches,
  createDocumentBlock,
  ensureFractionalContent,
  type SduiDocumentContent,
} from '@lodado/sdui-document'

import { collectTreeIds, deriveEntry, type RenderEntryCache, syncTree } from '../entry'

/**
 * Data-layer proof of O(1): editing one deep leaf must change ONLY that leaf's
 * entry reference. Every ancestor and sibling entry must stay identical (===)
 * across the edit — that identity is exactly what lets subscribed rows bail.
 *
 * root
 * └ section-a
 *   └ a-1
 *     └ a-1-1
 *       └ a-1-1-1
 *         └ target   <- edited
 *       └ a-1-1-2    <- sibling, must stay identical
 *   └ a-2
 * section-b, tail    <- far branch, must stay identical
 */
function makeContent(): SduiDocumentContent {
  return ensureFractionalContent({
    schemaVersion: '1.0',
    root: createDocumentBlock({
      id: 'root',
      type: 'document.root',
      children: [
        createDocumentBlock({
          id: 'section-a',
          type: 'document.heading',
          state: { text: 'Section A' },
          children: [
            createDocumentBlock({
              id: 'a-1',
              type: 'document.paragraph',
              state: { text: 'A-1' },
              children: [
                createDocumentBlock({
                  id: 'a-1-1',
                  type: 'document.paragraph',
                  state: { text: 'A-1-1' },
                  children: [
                    createDocumentBlock({
                      id: 'a-1-1-1',
                      type: 'document.paragraph',
                      state: { text: 'A-1-1-1' },
                      children: [
                        createDocumentBlock({ id: 'target', type: 'document.paragraph', state: { text: 'old' } }),
                      ],
                    }),
                    createDocumentBlock({ id: 'a-1-1-2', type: 'document.paragraph', state: { text: 'A-1-1-2' } }),
                  ],
                }),
              ],
            }),
            createDocumentBlock({ id: 'a-2', type: 'document.callout', state: { text: 'A-2' } }),
          ],
        }),
        createDocumentBlock({ id: 'section-b', type: 'document.heading', state: { text: 'Section B' } }),
        createDocumentBlock({ id: 'tail', type: 'document.paragraph', state: { text: 'Tail' } }),
      ],
    }),
  })
}

/** Seed the cache with a full snapshot of the initial tree. */
function snapshotEntries(root: SduiDocumentContent['root'], cache: RenderEntryCache): Map<string, unknown> {
  const ids = collectTreeIds(root)
  const map = new Map<string, unknown>()
  ids.forEach((id) => map.set(id, cache.get(id)))
  return map
}

describe('render model projection', () => {
  it('editing one deep leaf changes only that leaf entry reference', () => {
    const before = makeContent()
    const cache: RenderEntryCache = new Map()

    // seed: derive every entry once
    syncTree(null, before.root, cache)
    const beforeEntries = snapshotEntries(before.root, cache)

    // edit only `target` via a real structural-sharing patch
    const after = {
      ...before,
      root: applyDocumentPatches(before, [{ type: 'block.update', blockId: 'target', state: { text: 'new' } }]).root,
    }

    const changed = syncTree(before.root, after.root, cache)

    // only the edited id is reported as changed
    expect(changed).toEqual(['target'])

    // target entry: new reference + new value
    expect(cache.get('target')).not.toBe(beforeEntries.get('target'))
    expect(cache.get('target')?.state).toEqual({ text: 'new' })

    // every other entry: SAME reference (subscribers would bail)
    for (const id of ['root', 'section-a', 'a-1', 'a-1-1', 'a-1-1-1', 'a-1-1-2', 'a-2', 'section-b', 'tail']) {
      expect(cache.get(id)).toBe(beforeEntries.get(id))
    }
  })

  it('childrenIds arrays are reference-stable when the id list is unchanged', () => {
    const before = makeContent()
    const cache: RenderEntryCache = new Map()
    syncTree(null, before.root, cache)
    const a11ChildrenIds = cache.get('a-1-1')?.childrenIds

    const after = applyDocumentPatches(before, [{ type: 'block.update', blockId: 'target', state: { text: 'new' } }])
    syncTree(before.root, after.root, cache)

    // a-1-1's child id list didn't change → same array reference reused
    expect(cache.get('a-1-1')?.childrenIds).toBe(a11ChildrenIds)
  })

  it('structural change (new child) reports the parent and the new block', () => {
    const before = makeContent()
    const cache: RenderEntryCache = new Map()
    syncTree(null, before.root, cache)

    // split target → inserts a new sibling under a-1-1-1
    const after = applyDocumentPatches(before, [
      { type: 'block.split', blockId: 'target', offset: 1, newBlockId: 'gen-1' },
    ])
    const changed = syncTree(before.root, after.root, cache)

    // the new block and its parent (childrenIds changed) are reported; far branch is not
    expect(changed).toContain('gen-1')
    expect(changed).toContain('a-1-1-1')
    expect(changed).not.toContain('section-b')
    expect(changed).not.toContain('tail')
  })

  it('assigns numbered-list ordinals and re-numbers siblings when one changes type', () => {
    const content: SduiDocumentContent = ensureFractionalContent({
      schemaVersion: '1.0',
      root: createDocumentBlock({
        id: 'root',
        type: 'document.root',
        children: [
          createDocumentBlock({ id: 'n1', type: 'document.numbered-list', state: { text: 'one' } }),
          createDocumentBlock({ id: 'n2', type: 'document.numbered-list', state: { text: 'two' } }),
          createDocumentBlock({ id: 'n3', type: 'document.numbered-list', state: { text: 'three' } }),
        ],
      }),
    })
    const cache: RenderEntryCache = new Map()
    syncTree(null, content.root, cache)

    expect(cache.get('n1')?.listOrdinal).toBe(1)
    expect(cache.get('n2')?.listOrdinal).toBe(2)
    expect(cache.get('n3')?.listOrdinal).toBe(3)

    // turn n2 into a paragraph → resets the run: n1=1, n2=undefined, n3 restarts at 1
    const after = applyDocumentPatches(content, [
      { type: 'block.setType', blockId: 'n2', blockType: 'document.paragraph' },
    ])
    const changed = syncTree(content.root, after.root, cache)

    expect(cache.get('n1')?.listOrdinal).toBe(1)
    expect(cache.get('n2')?.listOrdinal).toBeUndefined()
    expect(cache.get('n3')?.listOrdinal).toBe(1) // sibling re-numbered despite its own block being unchanged
    expect(changed).toContain('n3')
  })

  it('drops cache entries for deleted blocks', () => {
    const before = makeContent()
    const cache: RenderEntryCache = new Map()
    syncTree(null, before.root, cache)
    expect(cache.has('a-1-1-2')).toBe(true)

    const after = applyDocumentPatches(before, [{ type: 'block.delete', blockId: 'a-1-1-2' }])
    syncTree(before.root, after.root, cache)

    expect(cache.has('a-1-1-2')).toBe(false)
  })
})
