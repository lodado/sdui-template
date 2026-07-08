import {
  applyDocumentPatch,
  BlockNotFoundError,
  createBlockId,
  createDocumentBlock,
  ensureFractionalContent,
  type SduiDocumentContent,
  SduiDocumentError,
} from '../../index'

/**
 * All domain errors share the `SduiDocumentError` base (spec P1-4B), so a caller
 * can catch every expected failure with one `instanceof` check instead of
 * importing each concrete class.
 */
function createContent(): SduiDocumentContent {
  return ensureFractionalContent({
    schemaVersion: '1.0',
    root: createDocumentBlock({ id: 'root', type: 'document.root', children: [] }),
  })
}

describe('SduiDocumentError hierarchy', () => {
  describe('as is: a concrete domain error (BlockNotFoundError)', () => {
    it('to be: an instance of the shared SduiDocumentError base', () => {
      const content = createContent()

      let caught: unknown
      try {
        applyDocumentPatch(content, { type: 'block.update', blockId: createBlockId('missing'), state: { text: 'x' } })
      } catch (error) {
        caught = error
      }

      expect(caught).toBeInstanceOf(BlockNotFoundError)
      expect(caught).toBeInstanceOf(SduiDocumentError)
      expect((caught as BlockNotFoundError).name).toBe('BlockNotFoundError')
    })
  })
})
