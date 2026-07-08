import { parseSduiDocumentContent } from '../../index'

/**
 * Per-type `state`/`attributes` schemas are wired into the parse boundary (spec
 * P1-4A) via the block-type registry — previously declared but never invoked.
 * Unknown/custom types stay open by design; known types reject wrong-typed
 * values while tolerating extra keys (non-strict schemas).
 */
function contentWith(block: Record<string, unknown>): unknown {
  return {
    schemaVersion: '1.1',
    root: {
      id: 'root',
      type: 'document.root',
      children: [{ id: 'child', position: 'a0', ...block }],
    },
  }
}

describe('parseSduiDocumentContent per-type schema enforcement', () => {
  describe('as is: a heading with an out-of-range attributes.level', () => {
    it('to be: rejected by the heading attributes schema', () => {
      const input = contentWith({ type: 'document.heading', attributes: { level: 9 } })

      expect(() => parseSduiDocumentContent(input)).toThrow()
    })
  })

  describe('as is: a heading whose state carries valid text plus rich content', () => {
    it('to be: accepted — non-strict schema tolerates the extra content key', () => {
      const input = contentWith({
        type: 'document.heading',
        state: { text: 'Title', content: [{ type: 'text', text: 'Title' }], level: 2 },
      })

      expect(() => parseSduiDocumentContent(input)).not.toThrow()
    })
  })

  describe('as is: an unknown/custom block type', () => {
    it('to be: accepted — no registry module, open by design', () => {
      const input = contentWith({ type: 'custom.widget', state: { anything: 42 }, attributes: { foo: 'bar' } })

      expect(() => parseSduiDocumentContent(input)).not.toThrow()
    })
  })
})
