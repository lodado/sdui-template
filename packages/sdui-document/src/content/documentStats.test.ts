import type { SduiDocumentContent } from '../blocks/schema'
import { documentStats } from './documentStats'

const content: SduiDocumentContent = {
  schemaVersion: '1.0',
  root: {
    id: 'root',
    type: 'document.root',
    children: [
      { id: 'a', type: 'document.paragraph', state: { content: [{ type: 'text', text: 'hello world' }] } },
      { id: 'b', type: 'document.paragraph', state: { content: [{ type: 'text', text: 'three more words here' }] } },
    ],
  },
}

describe('documentStats', () => {
  it('counts words, characters, and blocks (root excluded)', () => {
    // Act
    const stats = documentStats(content)

    // Assert
    expect(stats).toEqual({ words: 6, chars: 33, blocks: 2 })
  })

  it('returns zeros for an empty document', () => {
    const empty: SduiDocumentContent = {
      schemaVersion: '1.0',
      root: { id: 'root', type: 'document.root', children: [] },
    }

    expect(documentStats(empty)).toEqual({ words: 0, chars: 0, blocks: 0 })
  })
})
