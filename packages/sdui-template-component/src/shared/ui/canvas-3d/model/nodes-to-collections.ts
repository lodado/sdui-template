import type { SduiLayoutNode } from '@lodado/sdui-template'

import type { Collection, CollectionItem, Point2D, Vec3 } from './collection'

/** Node type for collection nodes (direct children of Canvas3D). */
export const CANVAS_3D_COLLECTION_TYPE = 'Canvas3DCollection'

/** Node type for item nodes (direct children of Canvas3DCollection). */
export const CANVAS_3D_ITEM_TYPE = 'Canvas3DItem'

function isVec3(p: unknown): p is Vec3 {
  return (
    typeof p === 'object' &&
    p !== null &&
    'x' in p &&
    'y' in p &&
    'z' in p &&
    typeof (p as Vec3).x === 'number' &&
    typeof (p as Vec3).y === 'number' &&
    typeof (p as Vec3).z === 'number'
  )
}

function isPoint2D(p: unknown): p is Point2D {
  return (
    typeof p === 'object' &&
    p !== null &&
    'x' in p &&
    'y' in p &&
    typeof (p as Point2D).x === 'number' &&
    typeof (p as Point2D).y === 'number'
  )
}

function itemFromNode(node: SduiLayoutNode): CollectionItem | null {
  const {state} = node
  if (!state || typeof state !== 'object') return null

  const {type} = state
  if (typeof type !== 'string') return null

  const {position} = state
  if (isVec3(position)) {
    return {
      type,
      position: { x: position.x, y: position.y, z: position.z },
      info: state.info && typeof state.info === 'object' ? (state.info as Record<string, unknown>) : undefined,
    }
  }
  if (isPoint2D(position)) {
    return {
      type,
      position: { x: position.x, y: position.y },
      info: state.info && typeof state.info === 'object' ? (state.info as Record<string, unknown>) : undefined,
    }
  }
  return null
}

/**
 * Build Collection[] from normalized SDUI nodes for a given canvas node ID.
 * Canvas node's direct children are treated as collections; their children as items.
 * No subscription: call this every frame (e.g. from RAF) to read latest state.
 */
export function buildCollectionsFromNodes(
  nodes: Record<string, SduiLayoutNode>,
  canvasNodeId: string,
): Collection[] {
  const canvasNode = nodes[canvasNodeId]
  if (!canvasNode) return []

  const collectionIds = canvasNode.childrenIds ?? []

  return collectionIds
    .map((colId) => {
      const colNode = nodes[colId]
      if (!colNode || colNode.type !== CANVAS_3D_COLLECTION_TYPE) return null

      const kind = colNode.state?.kind === '2d' ? '2d' : '3d'
      const itemIds = colNode.childrenIds ?? []
      const items = itemIds
        .map((itemId) => {
          const itemNode = nodes[itemId]
          if (!itemNode || itemNode.type !== CANVAS_3D_ITEM_TYPE) return null
          return itemFromNode(itemNode)
        })
        .filter((item): item is CollectionItem => item !== null)

      return { kind, items } as Collection
    })
    .filter((col): col is Collection => col !== null)
}
