'use client'

/**
 * SDUI Layout Context
 *
 * Context API를 사용하여 SduiLayoutStore를 제공합니다.
 */

import React, { createContext, useContext, useMemo } from 'react'

import type { SduiLayoutStore } from '../../store'

/**
 * SduiLayoutContext 타입
 */
interface SduiLayoutContextValue {
  /** Store 인스턴스 */
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
  /** Store 인스턴스 */
  store: SduiLayoutStore
  /** 자식 컴포넌트 */
  children: React.ReactNode
}

/**
 * SduiLayoutProvider
 *
 * Context를 통해 SduiLayoutStore를 제공합니다.
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
 * Context에서 store를 가져옵니다.
 * Provider 외부에서 사용 시 에러를 throw합니다.
 */
export const useSduiLayoutContext = (): SduiLayoutContextValue => {
  const context = useContext(SduiLayoutContext)

  if (!context) {
    throw new Error('useSduiLayoutContext must be used within SduiLayoutProvider')
  }

  return context
}

