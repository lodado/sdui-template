'use client'

import { useSession } from 'next-auth/react'
import { useCallback, useEffect, useRef, useState } from 'react'

type RefreshState = {
  isRefreshing: boolean
  lastRefreshAt: Date | null
  errorMessage: string | null
}

export function useRefreshSession() {
  const { status, update } = useSession()
  const [state, setState] = useState<RefreshState>({
    isRefreshing: false,
    lastRefreshAt: null,
    errorMessage: null,
  })
  const refreshAttemptedRef = useRef(false)
  const refreshInitializedRef = useRef(false)

  const refreshSession = useCallback(async () => {
    setState((prev) => ({ ...prev, isRefreshing: true, errorMessage: null }))

    try {
      const response = await fetch('/api/auth/refresh', { method: 'POST' })
      if (!response.ok) {
        const payload = await response.json().catch(() => ({}))
        throw new Error(payload?.error ?? '리프레시 토큰 갱신 실패')
      }

      await update()
      setState((prev) => ({
        ...prev,
        isRefreshing: false,
        lastRefreshAt: new Date(),
        errorMessage: null,
      }))
      return true
    } catch (error) {
      setState((prev) => ({
        ...prev,
        isRefreshing: false,
        errorMessage: error instanceof Error ? error.message : '알 수 없는 오류',
      }))
      return false
    }
  }, [update])

  const initializeRefreshToken = useCallback(async () => {
    if (refreshInitializedRef.current) {
      return
    }

    refreshInitializedRef.current = true
    await refreshSession()
  }, [refreshSession])

  useEffect(() => {
    if (status === 'unauthenticated' && !refreshAttemptedRef.current) {
      refreshAttemptedRef.current = true
      refreshSession().catch(() => {})
    }

    if (status === 'authenticated') {
      refreshAttemptedRef.current = false
      initializeRefreshToken().catch(() => {})
    }
  }, [initializeRefreshToken, refreshSession, status])

  return {
    ...state,
    refreshSession,
  }
}
