import {
  applyDocumentPatch,
  createDocumentBlock,
  ensureFractionalContent,
  findBlockById,
  type SduiDocumentContent,
  type SduiInlineContent,
} from '../../index'

/**
 * `state.text` is a derived cache of `state.content` (spec P1-2). Every text
 * edit routes through the `block.update` patch, so `updateBlock` must re-derive
 * `text` whenever the merged state is in content mode — otherwise a patch that
 * touches `content` alone leaves the cache stale.
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
          state: { content: [{ type: 'text', text: 'old' }], text: 'old' },
        }),
      ],
    }),
  })
}

const richContent: SduiInlineContent = [
  { type: 'text', text: 'Hello ' },
  { type: 'text', text: 'world', marks: [{ type: 'bold' }] },
]

describe('updateBlock derived text cache', () => {
  describe('as is: block.update sets content only', () => {
    it('to be: text is re-derived from the new content, not left stale', () => {
      const content = createContent()

      const next = applyDocumentPatch(content, {
        type: 'block.update',
        blockId: findBlockById(content, 'a')!.id,
        state: { content: richContent },
      })

      const block = findBlockById(next, 'a')!
      expect(block.state?.content).toEqual(richContent)
      expect(block.state?.text).toBe('Hello world')
    })
  })

  describe('as is: block.update sends content plus a stale text', () => {
    it('to be: derived text from content wins over the incoming text', () => {
      const content = createContent()

      const next = applyDocumentPatch(content, {
        type: 'block.update',
        blockId: findBlockById(content, 'a')!.id,
        state: { content: richContent, text: 'STALE' },
      })

      expect(findBlockById(next, 'a')!.state?.text).toBe('Hello world')
    })
  })

  describe('as is: block.update sets text only (plain-text block, no content key)', () => {
    it('to be: text is left as the caller set it', () => {
      const content = ensureFractionalContent({
        schemaVersion: '1.0',
        root: createDocumentBlock({
          id: 'root',
          type: 'document.root',
          children: [createDocumentBlock({ id: 'p', type: 'document.paragraph', state: { text: 'before' } })],
        }),
      })

      const next = applyDocumentPatch(content, {
        type: 'block.update',
        blockId: findBlockById(content, 'p')!.id,
        state: { text: 'after' },
      })

      const block = findBlockById(next, 'p')!
      expect(block.state?.text).toBe('after')
      expect(block.state?.content).toBeUndefined()
    })
  })
})
