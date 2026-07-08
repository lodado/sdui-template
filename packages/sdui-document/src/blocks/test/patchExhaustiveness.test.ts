import {
  applyDocumentPatch,
  createDocumentBlock,
  ensureFractionalContent,
  type SduiDocumentContent,
  type SduiDocumentPatch,
} from '../../index'

/**
 * Guards the exhaustiveness contract (spec P1-1). Every patch switch now ends in
 * `assertNever`, so a new `SduiDocumentPatch` variant fails to compile until it
 * is handled. These runtime tests pin the two observable behaviours that back
 * that contract: `document.setTitle` is a content-level no-op, and an unknown
 * variant (data crossing a trust boundary) fails loud instead of silently.
 */
function createContent(): SduiDocumentContent {
  return ensureFractionalContent({
    schemaVersion: '1.0',
    root: createDocumentBlock({
      id: 'root',
      type: 'document.root',
      children: [createDocumentBlock({ id: 'a', type: 'document.paragraph', state: { text: 'A' } })],
    }),
  })
}

describe('applyDocumentPatch exhaustiveness', () => {
  describe('as is: document.setTitle at the content level', () => {
    it('to be: a no-op that returns the content structurally unchanged', () => {
      const content = createContent()

      const next = applyDocumentPatch(content, { type: 'document.setTitle', title: 'New title' })

      expect(next).toEqual(content)
    })
  })

  describe('as is: a patch variant that is not part of the union (untrusted input)', () => {
    it('to be: throws via the assertNever guard instead of silently no-op', () => {
      const content = createContent()
      const bogus = { type: 'block.teleport', blockId: 'a' } as unknown as SduiDocumentPatch

      expect(() => applyDocumentPatch(content, bogus)).toThrow(/Unhandled variant/)
    })
  })
})
