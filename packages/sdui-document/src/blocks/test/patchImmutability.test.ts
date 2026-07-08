import {
  applyDocumentPatch,
  createBlockId,
  createDocumentBlock,
  ensureFractionalContent,
  findBlockById,
  type SduiDocumentContent,
  type SduiDocumentPatch,
} from '../../index'

/**
 * Safety net for the copy-on-write contract (spec P1-3).
 *
 * `applyDocumentPatch` must never mutate the input `content`. Today that holds
 * only because `touchedBlockIds` (a hand-maintained manifest) stays in sync
 * with what every operation actually writes. If a future operation writes to a
 * block whose id is absent from that manifest, the original is mutated silently
 * — no compile error, no failing assertion in the existing snapshot tests.
 *
 * Deep-freezing the input turns that silent mutation into a thrown TypeError
 * (strict mode rejects writes to frozen objects), so any regression fails loud
 * regardless of how the manifest is maintained.
 */
function deepFreeze<T>(value: T): T {
  if (value && typeof value === 'object' && !Object.isFrozen(value)) {
    Object.freeze(value)
    Object.values(value as Record<string, unknown>).forEach(deepFreeze)
  }
  return value
}

/**
 * Fixture tree (schema 1.1, positions already assigned):
 * root
 * ├── a "A" (a1 "A1", a2 "A2")
 * ├── b "B" (b1 "B1")
 * └── c "C"
 */
function createContent(): SduiDocumentContent {
  return ensureFractionalContent({
    schemaVersion: '1.0',
    root: createDocumentBlock({
      id: 'root',
      type: 'document.root',
      children: [
        createDocumentBlock({
          id: 'a',
          type: 'document.paragraph',
          state: { text: 'A' },
          children: [
            createDocumentBlock({ id: 'a1', type: 'document.paragraph', state: { text: 'A1' } }),
            createDocumentBlock({ id: 'a2', type: 'document.paragraph', state: { text: 'A2' } }),
          ],
        }),
        createDocumentBlock({
          id: 'b',
          type: 'document.paragraph',
          state: { text: 'B' },
          children: [createDocumentBlock({ id: 'b1', type: 'document.paragraph', state: { text: 'B1' } })],
        }),
        createDocumentBlock({ id: 'c', type: 'document.paragraph', state: { text: 'C' } }),
      ],
    }),
  })
}

/** One representative patch per variant, all targeting the fixture. */
function patchCases(content: SduiDocumentContent): Array<{ name: string; patch: SduiDocumentPatch }> {
  return [
    {
      name: 'block.insert',
      patch: {
        type: 'block.insert',
        parentId: findBlockById(content, 'a')!.id,
        block: createDocumentBlock({ id: 'z', type: 'document.paragraph', state: { text: 'Z' } }),
        after: null,
      },
    },
    {
      name: 'block.update',
      patch: { type: 'block.update', blockId: findBlockById(content, 'a1')!.id, state: { text: 'A1 changed' } },
    },
    { name: 'block.delete', patch: { type: 'block.delete', blockId: findBlockById(content, 'a1')!.id } },
    {
      name: 'block.move',
      patch: {
        type: 'block.move',
        blockId: findBlockById(content, 'b1')!.id,
        parentId: findBlockById(content, 'a')!.id,
        after: null,
      },
    },
    {
      name: 'block.split',
      patch: {
        type: 'block.split',
        blockId: findBlockById(content, 'a')!.id,
        offset: 0,
        newBlockId: createBlockId('z'),
      },
    },
    {
      name: 'block.merge',
      patch: {
        type: 'block.merge',
        blockId: findBlockById(content, 'a2')!.id,
        intoBlockId: findBlockById(content, 'a1')!.id,
      },
    },
    {
      name: 'block.setType',
      patch: { type: 'block.setType', blockId: findBlockById(content, 'a1')!.id, blockType: 'document.heading' },
    },
    { name: 'document.setTitle', patch: { type: 'document.setTitle', title: 'New title' } },
  ]
}

describe('applyDocumentPatch immutability (copy-on-write safety net)', () => {
  describe('as is: input is deep-frozen before applying each patch variant', () => {
    it.each(patchCases(createContent()).map((c) => c.name))(
      'to be: %s does not mutate the frozen original (no TypeError thrown)',
      (name) => {
        const content = deepFreeze(createContent())
        const {patch} = (patchCases(content).find((c) => c.name === name)!)

        expect(() => applyDocumentPatch(content, patch)).not.toThrow()
      },
    )
  })

  describe('as is: sibling subtrees off the touched path keep their references', () => {
    it('to be: block.update on a1 shares a2/b/b1/c (memo bail-out contract)', () => {
      const content = createContent()

      const next = applyDocumentPatch(content, {
        type: 'block.update',
        blockId: findBlockById(content, 'a1')!.id,
        state: { text: 'changed' },
      })

      expect(findBlockById(next, 'a2')).toBe(findBlockById(content, 'a2'))
      expect(findBlockById(next, 'b')).toBe(findBlockById(content, 'b'))
      expect(findBlockById(next, 'b1')).toBe(findBlockById(content, 'b1'))
      expect(findBlockById(next, 'c')).toBe(findBlockById(content, 'c'))
    })
  })
})
