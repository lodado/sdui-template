/**
 * Coalesce a high-frequency callback (scroll/resize) to at most one call per
 * animation frame, aligned to paint. Multiple events within a frame collapse to
 * a single call using the latest args — no per-frame lag, fewer layout reads.
 *
 * Not for low-frequency events (click/keydown): the extra frame only adds
 * latency there. Not for handlers that must call preventDefault synchronously
 * (e.g. dragover) — the deferred call runs too late to affect the event.
 *
 * Call `.cancel()` on effect cleanup so a pending frame never fires against a
 * torn-down ref. Falls back to a synchronous call when rAF is unavailable
 * (SSR / jsdom), keeping behavior test-friendly.
 */
export function rafThrottle<Args extends unknown[]>(fn: (...args: Args) => void) {
  let frame: number | null = null
  let lastArgs: Args

  const throttled = (...args: Args): void => {
    lastArgs = args
    if (frame !== null) {
      return
    }
    if (typeof requestAnimationFrame !== 'function') {
      fn(...args)
      return
    }
    frame = requestAnimationFrame(() => {
      frame = null
      fn(...lastArgs)
    })
  }

  throttled.cancel = (): void => {
    if (frame !== null) {
      cancelAnimationFrame(frame)
      frame = null
    }
  }

  return throttled
}
