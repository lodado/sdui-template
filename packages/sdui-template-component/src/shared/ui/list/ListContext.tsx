import React from 'react'

/**
 * List Context Value
 *
 * @description
 * Context value shared between List compound components.
 * Currently minimal, but can be extended for future state sharing needs.
 */
export interface ListContextValue {
  /** Whether list item is disabled */
  disabled?: boolean
}

/**
 * List Context
 *
 * @description
 * React Context for sharing state between List compound components.
 * Used to connect Icon, Content, Title, Description, and Arrow components.
 */
export const ListContext = React.createContext<ListContextValue | null>(null)

/**
 * Hook to access List context
 *
 * @throws Error if used outside List component
 */
export const useListContext = (): ListContextValue => {
  const context = React.useContext(ListContext)
  if (!context) {
    throw new Error('List compound components must be used within List component')
  }
  return context
}
