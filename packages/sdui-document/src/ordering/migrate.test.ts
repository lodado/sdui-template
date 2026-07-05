import { createDocumentBlock } from '../blocks/schema'
import { ensureFractionalContent, migrateToFractionalPositions } from './migrate'
import { sortBlocksByPosition } from './sortChildren'

function createLegacyContent() {
  return {
    schemaVersion: '1.0' as const,
    root: createDocumentBlock({
      id: 'root',
      type: 'document.root',
      children: [
        createDocumentBlock({ id: 'a', type: 'document.paragraph' }),
        createDocumentBlock({
          id: 'b',
          type: 'document.callout',
          children: [
            createDocumentBlock({ id: 'b1', type: 'document.paragraph' }),
            createDocumentBlock({ id: 'b2', type: 'document.paragraph' }),
          ],
        }),
      ],
    }),
  }
}

describe('migrateToFractionalPositions', () => {
  it('is idempotent for schema 1.1 content', () => {
    const once = migrateToFractionalPositions(createLegacyContent())
    expect(migrateToFractionalPositions(once)).toBe(once)
  })

  it('preserves sibling order from array order', () => {
    const migrated = migrateToFractionalPositions(createLegacyContent())
    expect(migrated.root.children?.map((block) => block.id)).toEqual(['a', 'b'])
    expect(migrated.root.children?.[1].children?.map((block) => block.id)).toEqual(['b1', 'b2'])
    expect(sortBlocksByPosition(migrated.root.children ?? []).map((block) => block.id)).toEqual(['a', 'b'])
  })

  it('assigns position keys and bumps schemaVersion', () => {
    const migrated = migrateToFractionalPositions(createLegacyContent())
    expect(migrated.schemaVersion).toBe('1.1')
    expect(migrated.root.children?.every((child) => typeof child.position === 'string')).toBe(true)
  })
})

describe('ensureFractionalContent', () => {
  it('returns the same reference for schema 1.1 input', () => {
    const migrated = migrateToFractionalPositions(createLegacyContent())
    expect(ensureFractionalContent(migrated)).toBe(migrated)
  })
})
