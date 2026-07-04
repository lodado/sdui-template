import type { BlockOrigin } from '../blocks/schema/block'

/** Reference used for lexicographic sibling ordering. */
export type OrderedRef = {
  position: string
  clientId?: string
  opId?: string
}

export function orderedRefFromBlock(block: { position?: string; origin?: BlockOrigin }): OrderedRef {
  return {
    position: block.position ?? '',
    clientId: block.origin?.clientId,
    opId: block.origin?.opId,
  }
}
