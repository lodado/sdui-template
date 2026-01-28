/**
 * Pure domain functions for session refresh logic.
 * These functions are stateless and easily testable.
 */

/** Refresh token 3 minutes before expiration */
export const REFRESH_THRESHOLD_MS = 3 * 60 * 1000

/** Cooldown period between refresh attempts to prevent rapid calls */
export const REFRESH_COOLDOWN_MS = 5000

/**
 * Checks if enough time has passed since the last refresh to allow another refresh.
 * @param lastRefreshTime - Timestamp of the last refresh attempt
 * @param now - Current timestamp
 * @returns true if refresh is allowed, false if still in cooldown
 */
export function canRefresh(lastRefreshTime: number, now: number): boolean {
  return now - lastRefreshTime >= REFRESH_COOLDOWN_MS
}

/**
 * Calculates the time to wait before triggering a proactive refresh.
 * @param expiresAt - Session expiration timestamp
 * @param now - Current timestamp
 * @param threshold - How early before expiration to refresh (default: REFRESH_THRESHOLD_MS)
 * @returns Time to wait in ms, 0 if immediate refresh needed, null if session already expired
 */
export function calculateTimeUntilRefresh(
  expiresAt: number,
  now: number,
  threshold: number = REFRESH_THRESHOLD_MS
): number | null {
  const timeLeft = expiresAt - now

  // Session already expired
  if (timeLeft <= 0) return null

  // Within threshold - refresh immediately
  if (timeLeft <= threshold) return 0

  // Schedule refresh for (threshold) ms before expiration
  return timeLeft - threshold
}
