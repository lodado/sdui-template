'use client'

import { useSession } from 'next-auth/react'
import {
  createContext,
  type Dispatch,
  type PropsWithChildren,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  useRef,
} from 'react'

import {
  calculateTimeUntilRefresh,
  canRefresh,
} from '@/app/lib/refresh-session.domain'

// ============================================================================
// Types
// ============================================================================

type RefreshState = {
  isRefreshing: boolean
  lastRefreshAt: Date | null
  errorMessage: string | null
  lastRefreshTime: number
  initialized: boolean
  refreshAttempted: boolean
}

type RefreshAction =
  | { type: 'START_REFRESH'; payload: number }
  | { type: 'REFRESH_SUCCESS'; payload: Date }
  | { type: 'REFRESH_ERROR'; payload: string }
  | { type: 'MARK_INITIALIZED' }
  | { type: 'MARK_REFRESH_ATTEMPTED' }

// ============================================================================
// Reducer
// ============================================================================

const initialState: RefreshState = {
  isRefreshing: false,
  lastRefreshAt: null,
  errorMessage: null,
  lastRefreshTime: 0,
  initialized: false,
  refreshAttempted: false,
}

function refreshReducer(state: RefreshState, action: RefreshAction): RefreshState {
  switch (action.type) {
    case 'START_REFRESH':
      return {
        ...state,
        isRefreshing: true,
        errorMessage: null,
        lastRefreshTime: action.payload,
      }
    case 'REFRESH_SUCCESS':
      return {
        ...state,
        isRefreshing: false,
        lastRefreshAt: action.payload,
        errorMessage: null,
      }
    case 'REFRESH_ERROR':
      return {
        ...state,
        isRefreshing: false,
        errorMessage: action.payload,
      }
    case 'MARK_INITIALIZED':
      return {
        ...state,
        initialized: true,
        refreshAttempted: false,
      }
    case 'MARK_REFRESH_ATTEMPTED':
      return {
        ...state,
        refreshAttempted: true,
      }
    default:
      return state
  }
}

// ============================================================================
// Context
// ============================================================================

type RefreshSessionContextValue = {
  state: RefreshState
  dispatch: Dispatch<RefreshAction>
}

const RefreshSessionContext = createContext<RefreshSessionContextValue | null>(null)

// ============================================================================
// Provider
// ============================================================================

export const RefreshSessionProvider = ({ children }: PropsWithChildren) => {
  const [state, dispatch] = useReducer(refreshReducer, initialState)

  return (
    <RefreshSessionContext.Provider value={useMemo(() => ({ state, dispatch }), [state, dispatch])}>
      {children}
    </RefreshSessionContext.Provider>
  )
}

// ============================================================================
// Atomic Hooks
// ============================================================================

/**
 * Access refresh session state from context.
 * @throws Error if used outside RefreshSessionProvider
 */
export function useRefreshSessionState(): RefreshState {
  const ctx = useContext(RefreshSessionContext)
  if (!ctx) {
    throw new Error('useRefreshSessionState must be used within RefreshSessionProvider')
  }
  return ctx.state
}

/**
 * Access dispatch function from context.
 * @throws Error if used outside RefreshSessionProvider
 */
function useRefreshSessionDispatch(): Dispatch<RefreshAction> {
  const ctx = useContext(RefreshSessionContext)
  if (!ctx) {
    throw new Error('useRefreshSessionDispatch must be used within RefreshSessionProvider')
  }
  return ctx.dispatch
}

/**
 * Hook for manual session refresh action.
 * Handles API call, cooldown check, and state updates.
 */
export function useRefreshAction() {
  const state = useRefreshSessionState()
  const dispatch = useRefreshSessionDispatch()
  const { update } = useSession()

  const refreshSession = useCallback(async (): Promise<boolean> => {
    const now = Date.now()

    // Prevent concurrent or rapid calls
    if (state.isRefreshing || !canRefresh(state.lastRefreshTime, now)) {
      return false
    }

    dispatch({ type: 'START_REFRESH', payload: now })

    try {
      const response = await fetch('/api/auth/refresh', { method: 'POST' })

      if (!response.ok) {
        const payload = await response.json().catch(() => ({}))
        throw new Error(payload?.error ?? '리프레시 토큰 갱신 실패')
      }

      await update()
      dispatch({ type: 'REFRESH_SUCCESS', payload: new Date() })
      return true
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : '알 수 없는 오류'
      dispatch({ type: 'REFRESH_ERROR', payload: errorMessage })
      return false
    }
  }, [state.isRefreshing, state.lastRefreshTime, dispatch, update])

  return { refreshSession }
}

/**
 * Hook for automatic session refresh scheduling.
 * Handles:
 * 1. Unauthenticated state recovery (refresh token based)
 * 2. Proactive refresh before session expiration
 */
export function useAutoRefresh() {
  const { status, data: session } = useSession()
  const state = useRefreshSessionState()
  const dispatch = useRefreshSessionDispatch()
  const { refreshSession } = useRefreshAction()
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    // Cleanup function
    const clearTimer = () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current)
        timerRef.current = null
      }
    }

    // Case 1: Unauthenticated - try recovery with refresh token
    if (status === 'unauthenticated' && !state.refreshAttempted) {
      dispatch({ type: 'MARK_REFRESH_ATTEMPTED' })
      refreshSession().catch(() => {})
      return clearTimer
    }

    // Case 2: Not authenticated or no expiration - clear timer
    if (status !== 'authenticated' || !session?.expires) {
      clearTimer()
      return clearTimer
    }

    // Case 3: First login - initialize refresh token
    if (!state.initialized) {
      dispatch({ type: 'MARK_INITIALIZED' })
      refreshSession().catch(() => {})
    }

    // Case 4: Schedule proactive refresh
    const expiresAt = new Date(session.expires).getTime()
    const now = Date.now()
    const timeUntilRefresh = calculateTimeUntilRefresh(expiresAt, now)

    if (timeUntilRefresh === null) {
      // Session expired - nothing to do
      return clearTimer
    }

    if (timeUntilRefresh === 0) {
      // Immediate refresh needed (cooldown prevents rapid calls)
      refreshSession().catch(() => {})
      return clearTimer
    }

    // Schedule future refresh
    timerRef.current = setTimeout(() => {
      refreshSession().catch(() => {})
    }, timeUntilRefresh)

    return clearTimer
  }, [status, session?.expires, state.initialized, state.refreshAttempted, dispatch, refreshSession])
}
