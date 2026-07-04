import type { SduiDocumentBlock } from '../blocks/schema/block'
import type { SduiDocumentContent } from '../blocks/schema/document'
import { generatePositions } from './generate'
import { sortBlocksByPosition } from './sortChildren'

function assignPositionsToChildren(block: SduiDocumentBlock): SduiDocumentBlock {
  if (!block.children || block.children.length === 0) {
    return block
  }

  const needsMigration = block.children.some((child) => child.position === undefined)
  let nextChildren: SduiDocumentBlock[]

  if (needsMigration) {
    const positions = generatePositions(null, null, block.children.length)
    nextChildren = block.children.map((child, index) =>
      assignPositionsToChildren({
        ...child,
        position: child.position ?? positions[index],
      }),
    )
  } else {
    nextChildren = block.children.map(assignPositionsToChildren)
  }

  return {
    ...block,
    children: sortBlocksByPosition(nextChildren),
  }
}

/**
 * One-time migration: assign fractional position keys from current array order.
 * Idempotent — schema 1.1 content is returned unchanged.
 */
export function migrateToFractionalPositions(content: SduiDocumentContent): SduiDocumentContent {
  if (content.schemaVersion === '1.1') {
    return content
  }

  return {
    schemaVersion: '1.1',
    root: assignPositionsToChildren(content.root),
  }
}

/** Ensures content is on schema 1.1 with fractional positions before patch apply. */
export function ensureFractionalContent(content: SduiDocumentContent): SduiDocumentContent {
  return content.schemaVersion === '1.1' ? content : migrateToFractionalPositions(content)
}
