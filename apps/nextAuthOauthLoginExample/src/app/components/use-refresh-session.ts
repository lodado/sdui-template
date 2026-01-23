'use client'

import { useSession } from 'next-auth/react'
import { useCallback, useEffect, useRef, useSyncExternalStore } from 'react'

type RefreshState = {
  isRefreshing: boolean
  lastRefreshAt: Date | null
  errorMessage: string | null
}

const REFRESH_THRESHOLD_MS = 3 * 60 * 1000 // 만료 3분 전에 갱신
const REFRESH_COOLDOWN_MS = 5000 // 연속 호출 방지 쿨다운

// ============================================================================
// Module-level shared state (prevents multiple hook instances from racing)
// ============================================================================
let sharedState: RefreshState = {
  isRefreshing: false,
  lastRefreshAt: null,
  errorMessage: null,
}
let refreshAttempted = false
let refreshInitialized = false
let lastRefreshTime = 0
const listeners = new Set<() => void>()

const subscribe = (listener: () => void) => {
  listeners.add(listener)
  return () => listeners.delete(listener)
}

const getSnapshot = () => sharedState

const setSharedState = (updater: (prev: RefreshState) => RefreshState) => {
  sharedState = updater(sharedState)
  listeners.forEach((listener) => listener())
}

/**
 * 아 ai 개똥코드 ;;
 */
export function useRefreshSession() {
  const { data: session, status, update } = useSession()
  const state = useSyncExternalStore(subscribe, getSnapshot, getSnapshot)
  const refreshTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const refreshSession = useCallback(async () => {
    // Prevent concurrent/rapid calls
    const now = Date.now()
    if (sharedState.isRefreshing || now - lastRefreshTime < REFRESH_COOLDOWN_MS) {
      return false
    }
    lastRefreshTime = now

    setSharedState((prev) => ({ ...prev, isRefreshing: true, errorMessage: null }))

    try {
      const response = await fetch('/api/auth/refresh', { method: 'POST' })
      if (!response.ok) {
        const payload = await response.json().catch(() => ({}))
        throw new Error(payload?.error ?? '리프레시 토큰 갱신 실패')
      }

      await update()
      setSharedState((prev) => ({
        ...prev,
        isRefreshing: false,
        lastRefreshAt: new Date(),
        errorMessage: null,
      }))
      return true
    } catch (error) {
      setSharedState((prev) => ({
        ...prev,
        isRefreshing: false,
        errorMessage: error instanceof Error ? error.message : '알 수 없는 오류',
      }))
      return false
    }
  }, [update])

  const initializeRefreshToken = useCallback(async () => {
    if (refreshInitialized) {
      return
    }

    refreshInitialized = true
    await refreshSession()
  }, [refreshSession])

  // 로그아웃 시에만 리프레시 시도 (세션 없고 쿠키가 있을 때만)
  useEffect(() => {
    if (status === 'unauthenticated' && !refreshAttempted) {
      refreshAttempted = true
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
    if (!refreshInitialized) {
      refreshAttempted = false
      initializeRefreshToken().catch(() => {})
    }

    const expiresAt = new Date(session.expires).getTime()
    const now = Date.now()
    const expiresIn = expiresAt - now

    // 이미 만료 임박 또는 만료됨 - 쿨다운으로 중복 호출 방지됨
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
