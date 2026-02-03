'use client'

/**
 * SDUI Layout Context
 *
 * Provides SduiLayoutStore via the Context API.
 */

import React, { createContext, useContext, useMemo } from 'react'

import type { SduiLayoutStore } from '../../store'

/**
 * SduiLayoutContext type
 */
interface SduiLayoutContextValue {
  /** Store instance */
  store: SduiLayoutStore
}

/**
 * SduiLayoutContext
 */
const SduiLayoutContext = createContext<SduiLayoutContextValue | null>(null)

/**
 * SduiLayoutProvider Props
 */
interface SduiLayoutProviderProps {
  /** Store instance */
  store: SduiLayoutStore
  /** Child components */
  children: React.ReactNode
}

/**
 * SduiLayoutProvider
 *
 * Provides SduiLayoutStore via context.
 */
export const SduiLayoutProvider: React.FC<SduiLayoutProviderProps> = ({ store, children }) => {
  const value = useMemo(
    () => ({
      store,
    }),
    [store],
  )

  return <SduiLayoutContext.Provider value={value}>{children}</SduiLayoutContext.Provider>
}

/**
 * useSduiLayoutContext
 *
 * Retrieves the store from context.
 * Throws an error when used outside the provider.
 */
export const useSduiLayoutContext = (): SduiLayoutContextValue => {
  const context = useContext(SduiLayoutContext)

  if (!context) {
    throw new Error('useSduiLayoutContext must be used within SduiLayoutProvider')
  }

  return context
}

