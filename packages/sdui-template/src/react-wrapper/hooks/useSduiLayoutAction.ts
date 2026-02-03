'use client'

/**
 * useSduiLayoutAction
 *
 * Returns the store instance so actions can be invoked.
 *
 * @returns Store instance
 *
 * @example
 * ```tsx
 * const store = useSduiLayoutAction();
 * store.updateNodeState(nodeId, newState);
 * ```
 */

import type { SduiLayoutStore } from '../../store'
import { useSduiLayoutContext } from '../context'

export const useSduiLayoutAction = (): SduiLayoutStore => {
  const { store } = useSduiLayoutContext()
  return store
}
