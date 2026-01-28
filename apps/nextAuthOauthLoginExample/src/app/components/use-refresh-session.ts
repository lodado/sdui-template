'use client'

import {
  useAutoRefresh,
  useRefreshAction,
  useRefreshSessionState,
} from '@/app/contexts/refresh-session.context'

/**
 * Facade hook for session refresh functionality.
 * Provides the same interface as the original implementation.
 *
 * Features:
 * - Manual refresh via `refreshSession()`
 * - Automatic proactive refresh before session expiration
 * - Recovery from unauthenticated state using refresh token
 * - Cooldown protection against rapid refresh calls
 *
 * @requires RefreshSessionProvider - Must be wrapped in provider (see providers.tsx)
 */
export function useRefreshSession() {
  const state = useRefreshSessionState()
  const { refreshSession } = useRefreshAction()

  // Activate automatic refresh scheduling
  useAutoRefresh()

  return {
    isRefreshing: state.isRefreshing,
    lastRefreshAt: state.lastRefreshAt,
    errorMessage: state.errorMessage,
    refreshSession,
  }
}
