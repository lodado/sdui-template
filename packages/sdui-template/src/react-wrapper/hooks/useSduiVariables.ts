'use client'

/**
 * useSduiVariables / useSduiVariable
 *
 * Reactive access to the store's global variables. Components re-render when
 * any variable changes (variables are replaced wholesale on update, so the
 * snapshot is a stable reference between updates).
 *
 * @example
 * ```tsx
 * const done = useSduiVariable<number>('doc.checkedCount')
 * ```
 */

import { useSyncExternalStore } from 'react'

import { useSduiLayoutContext } from '../context'

export const useSduiVariables = (): Record<string, unknown> => {
  const { store } = useSduiLayoutContext()

  return useSyncExternalStore(
    (onStoreChange) => store.subscribeVersion(onStoreChange),
    () => store.state.variables,
    () => store.state.variables,
  )
}

export const useSduiVariable = <T = unknown>(key: string): T | undefined => {
  const variables = useSduiVariables()

  return variables[key] as T | undefined
}
