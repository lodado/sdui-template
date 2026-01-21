'use client'

import { useSession } from 'next-auth/react'
import { useCallback, useEffect, useRef, useState } from 'react'

type RefreshState = {
  isRefreshing: boolean
  lastRefreshAt: Date | null
  errorMessage: string | null
}

const REFRESH_THRESHOLD_MS = 3 * 60 * 1000 // 만료 3분 전에 갱신

export function useRefreshSession() {
  const { data: session, status, update } = useSession()
  const [state, setState] = useState<RefreshState>({
    isRefreshing: false,
    lastRefreshAt: null,
    errorMessage: null,
  })
  const refreshAttemptedRef = useRef(false)
  const refreshInitializedRef = useRef(false)
  const refreshTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

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

  // 로그아웃 시에만 리프레시 시도 (세션 없고 쿠키가 있을 때만)
  useEffect(() => {
    if (status === 'unauthenticated' && !refreshAttemptedRef.current) {
      refreshAttemptedRef.current = true
      refreshSession().catch(() => {})
    }
  }, [refreshSession, status])

  // 세션 만료 전 자동 갱신 (Proactive Refresh)
  useEffect(() => {
    if (status !== 'authenticated' || !session?.expires) {
      if (refreshTimerRef.current) {
        clearTimeout(refreshTimerRef.current)
        refreshTimerRef.current = null
      }
      return undefined
    }

    // 첫 로그인 시 리프레시 토큰 초기화
    if (!refreshInitializedRef.current) {
      refreshAttemptedRef.current = false
      initializeRefreshToken().catch(() => {})
    }

    const expiresAt = new Date(session.expires).getTime()
    const now = Date.now()
    const expiresIn = expiresAt - now

    // 이미 만료 임박 또는 만료됨
    if (expiresIn < REFRESH_THRESHOLD_MS) {
      refreshSession().catch(() => {})
      return undefined
    }

    // 만료 3분 전에 자동 갱신 타이머 설정
    const timeUntilRefresh = expiresIn - REFRESH_THRESHOLD_MS
    refreshTimerRef.current = setTimeout(() => {
      refreshSession().catch(() => {})
    }, timeUntilRefresh)

    return () => {
      if (refreshTimerRef.current) {
        clearTimeout(refreshTimerRef.current)
        refreshTimerRef.current = null
      }
    }
  }, [initializeRefreshToken, refreshSession, session?.expires, status])

  return {
    ...state,
    refreshSession,
  }
}
