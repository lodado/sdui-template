import type { SduiDocumentBlock } from '../blocks/schema/block'
import { comparePosition } from './compare'
import { orderedRefFromBlock } from './types'

/** Returns a new array sorted by `(position, clientId, opId)`. */
export function sortBlocksByPosition(blocks: SduiDocumentBlock[]): SduiDocumentBlock[] {
  return [...blocks].sort((left, right) => comparePosition(orderedRefFromBlock(left), orderedRefFromBlock(right)))
}
