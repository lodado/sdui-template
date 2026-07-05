import {
  applyDocumentPatches,
  createDocumentBlock,
  createProjectedBlockMovePatch,
  findBlockById,
  type SduiDocumentContent,
} from '../../index'

const INDENT_WIDTH = 24

/**
 * Complex nested fixture — mirrors the "Nested Drag And Drop" Storybook story
 * (apps/docs/src/stories/DocumentEditor.stories.tsx). Keep both in sync.
 *
 * root
 * ├── section-a  heading            depth 1
 * │   ├── a-1    paragraph          depth 2
 * │   │   ├── a-1-1   paragraph     depth 3
 * │   │   │   └── a-1-1-1 checklist depth 4
 * │   │   └── a-1-2   paragraph     depth 3
 * │   └── a-2    callout            depth 2
 * ├── section-b  heading            depth 1
 * │   └── b-1    paragraph          depth 2
 * └── tail       paragraph          depth 1
 */
function createNestedFixture(): SduiDocumentContent {
  return {
    schemaVersion: '1.0',
    root: createDocumentBlock({
      id: 'root',
      type: 'document.root',
      children: [
        createDocumentBlock({
          id: 'section-a',
          type: 'document.heading',
          state: { text: 'Section A' },
          attributes: { level: 2 },
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
                      type: 'document.checklist',
                      state: { text: 'A-1-1-1' },
                      attributes: { checked: false },
                    }),
                  ],
                }),
                createDocumentBlock({ id: 'a-1-2', type: 'document.paragraph', state: { text: 'A-1-2' } }),
              ],
            }),
            createDocumentBlock({ id: 'a-2', type: 'document.callout', state: { text: 'A-2' } }),
          ],
        }),
        createDocumentBlock({
          id: 'section-b',
          type: 'document.heading',
          state: { text: 'Section B' },
          attributes: { level: 2 },
          children: [createDocumentBlock({ id: 'b-1', type: 'document.paragraph', state: { text: 'B-1' } })],
        }),
        createDocumentBlock({ id: 'tail', type: 'document.paragraph', state: { text: 'Tail' } }),
      ],
    }),
  }
}

const childIdsOf = (content: SduiDocumentContent, blockId: string): string[] =>
  (findBlockById(content, blockId)?.children ?? []).map((child) => child.id)

describe('nested drag scenario (complex 4-depth fixture)', () => {
  describe('as is: tail (depth 1) dragged onto a-1-1-1 (depth 4)', () => {
    describe('when offsetX = 0 (BVA: projected depth clamps to minDepth 3 — ancestor walk)', () => {
      it('to be: tail lands after a-1-1 inside a-1, subtree order preserved', () => {
        const content = createNestedFixture()

        const patch = createProjectedBlockMovePatch({
          content,
          activeId: 'tail',
          overId: 'a-1-1-1',
          offsetX: 0,
          indentWidth: INDENT_WIDTH,
        })

        expect(patch).toEqual({ type: 'block.move', blockId: 'tail', parentId: 'a-1', after: 'a-1-1' })

        const next = applyDocumentPatches(content, [patch!])
        expect(childIdsOf(next, 'a-1')).toEqual(['a-1-1', 'tail', 'a-1-2'])
        expect(childIdsOf(next, 'root')).toEqual(['section-a', 'section-b'])
      })
    })

    describe('when offsetX = 4 * indentWidth (BVA: projected depth clamps to maxDepth 5 — inside)', () => {
      it('to be: tail becomes the first child of the depth-4 checklist', () => {
        const content = createNestedFixture()

        const patch = createProjectedBlockMovePatch({
          content,
          activeId: 'tail',
          overId: 'a-1-1-1',
          offsetX: 4 * INDENT_WIDTH,
          indentWidth: INDENT_WIDTH,
        })

        expect(patch).toEqual({ type: 'block.move', blockId: 'tail', parentId: 'a-1-1-1', after: null })

        const next = applyDocumentPatches(content, [patch!])
        expect(childIdsOf(next, 'a-1-1-1')).toEqual(['tail'])
      })
    })
  })

  describe('as is: b-1 dragged onto a-1 whose next visible item is deeper (BVA: minDepth = maxDepth = 3)', () => {
    describe('when offsetX = 0 (clamp forces the single legal depth)', () => {
      it('to be: b-1 inserted as the FIRST child of a-1 — the slot the indicator line points at', () => {
        const content = createNestedFixture()

        const patch = createProjectedBlockMovePatch({
          content,
          activeId: 'b-1',
          overId: 'a-1',
          offsetX: 0,
          indentWidth: INDENT_WIDTH,
        })

        expect(patch).toEqual({ type: 'block.move', blockId: 'b-1', parentId: 'a-1', after: null })

        const next = applyDocumentPatches(content, [patch!])
        expect(childIdsOf(next, 'a-1')).toEqual(['b-1', 'a-1-1', 'a-1-2'])
        expect(childIdsOf(next, 'section-b')).toEqual([])
      })
    })
  })

  describe('as is: a-1 subtree (3 descendants) dragged onto b-1 (EP: subtree move partition)', () => {
    describe('when offsetX = 0 (same depth — plain after drop)', () => {
      it('to be: whole subtree moves under section-b with descendants intact', () => {
        const content = createNestedFixture()

        const patch = createProjectedBlockMovePatch({
          content,
          activeId: 'a-1',
          overId: 'b-1',
          offsetX: 0,
          indentWidth: INDENT_WIDTH,
        })

        expect(patch).toEqual({ type: 'block.move', blockId: 'a-1', parentId: 'section-b', after: 'b-1' })

        const next = applyDocumentPatches(content, [patch!])
        expect(childIdsOf(next, 'section-b')).toEqual(['b-1', 'a-1'])
        // descendants travel with the subtree
        expect(childIdsOf(next, 'a-1')).toEqual(['a-1-1', 'a-1-2'])
        expect(childIdsOf(next, 'a-1-1')).toEqual(['a-1-1-1'])
        expect(childIdsOf(next, 'section-a')).toEqual(['a-2'])
      })
    })
  })

  describe('as is: a-1-1-1 (depth 4) dragged onto a-1-2 (depth 3)', () => {
    describe('when offsetX = -2 * indentWidth (BVA: outdent two levels — ancestor walk to depth 2)', () => {
      it('to be: checklist lands after a-1 as a child of section-a', () => {
        const content = createNestedFixture()

        const patch = createProjectedBlockMovePatch({
          content,
          activeId: 'a-1-1-1',
          overId: 'a-1-2',
          offsetX: -2 * INDENT_WIDTH,
          indentWidth: INDENT_WIDTH,
        })

        expect(patch).toEqual({ type: 'block.move', blockId: 'a-1-1-1', parentId: 'section-a', after: 'a-1' })

        const next = applyDocumentPatches(content, [patch!])
        expect(childIdsOf(next, 'section-a')).toEqual(['a-1', 'a-1-1-1', 'a-2'])
        expect(childIdsOf(next, 'a-1-1')).toEqual([])
      })
    })
  })
})
