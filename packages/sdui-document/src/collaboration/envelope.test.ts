import { createBlockId, createDocumentId } from '../blocks/schema'
import { createPatchEnvelope, parsePatchEnvelope } from './envelope'

const validRaw = {
  envelopeId: 'env-1',
  documentId: 'doc-1',
  actorId: 'client-a',
  hlc: { millis: 100, counter: 0, actorId: 'client-a' },
  baseSeq: 0,
  patches: [{ type: 'block.update', blockId: 'b1', state: { text: 'hi' } }],
}

describe('parsePatchEnvelope', () => {
  test('accepts a valid envelope and parses nested patches', () => {
    const envelope = parsePatchEnvelope(validRaw)

    expect(envelope.envelopeId).toBe('env-1')
    expect(envelope.baseSeq).toBe(0)
    expect(envelope.patches).toEqual([{ type: 'block.update', blockId: 'b1', state: { text: 'hi' } }])
  })

  test('rejects negative baseSeq', () => {
    expect(() => parsePatchEnvelope({ ...validRaw, baseSeq: -1 })).toThrow()
  })

  test('rejects an envelope with an invalid patch', () => {
    expect(() => parsePatchEnvelope({ ...validRaw, patches: [{ type: 'block.explode' }] })).toThrow()
  })

  test('rejects an empty patches array', () => {
    expect(() => parsePatchEnvelope({ ...validRaw, patches: [] })).toThrow()
  })
})

describe('createPatchEnvelope', () => {
  test('returns a defensive copy — mutating the input does not leak', () => {
    const input = {
      envelopeId: 'env-2',
      documentId: createDocumentId('doc-1'),
      actorId: 'client-a',
      hlc: { millis: 1, counter: 0, actorId: 'client-a' },
      baseSeq: 3,
      patches: [{ type: 'block.delete' as const, blockId: createBlockId('b1') }],
    }

    const envelope = createPatchEnvelope(input)
    input.patches.pop()

    expect(envelope.patches).toHaveLength(1)
  })
})
