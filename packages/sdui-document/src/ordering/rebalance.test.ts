import { createDocumentBlock } from '../blocks/schema'
import { generatePositionBetween } from './generate'
import { migrateToFractionalPositions } from './migrate'
import { rebalanceChildren } from './rebalance'
import { sortBlocksByPosition } from './sortChildren'

describe('rebalanceChildren', () => {
  it('preserves sibling order while shortening position keys', () => {
    const migrated = migrateToFractionalPositions({
      schemaVersion: '1.0',
      root: createDocumentBlock({
        id: 'root',
        type: 'document.root',
        children: [
          createDocumentBlock({ id: 'a', type: 'document.paragraph' }),
          createDocumentBlock({ id: 'b', type: 'document.paragraph' }),
        ],
      }),
    })

    const longKey = generatePositionBetween('a0', 'a1')
    const inflated = {
      ...migrated,
      root: {
        ...migrated.root,
        children: sortBlocksByPosition([
          { ...migrated.root.children![0], position: longKey.repeat(10) },
          { ...migrated.root.children![1], position: longKey.repeat(10) + 'z' },
        ]),
      },
    }

    const rebalanced = rebalanceChildren(inflated, 'root')
    const ids = rebalanced.root.children?.map((child) => child.id)
    expect(ids).toEqual(['a', 'b'])
    expect(rebalanced.root.children?.every((child) => (child.position?.length ?? 0) <= 4)).toBe(true)
  })
})
