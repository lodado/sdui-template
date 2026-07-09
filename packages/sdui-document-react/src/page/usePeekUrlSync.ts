import { useEffect, useRef } from 'react'

// Two-way sync between the fallback peek id and a URL search param, so a peeked
// preview is shareable/deep-linkable and the browser back button closes it.
// Opt-in (SduiPageProvider passes a param name); no-op when disabled or on the
// server. The host owns real routing via the navigator — this only drives the
// built-in fallback peek.

function readParam(param: string): string | null {
  if (typeof window === 'undefined') {
    return null
  }

  return new URLSearchParams(window.location.search).get(param)
}

function writeParam(param: string, id: string | null): void {
  if (typeof window === 'undefined') {
    return
  }

  const url = new URL(window.location.href)
  if (id === null) {
    url.searchParams.delete(param)
  } else {
    url.searchParams.set(param, id)
  }

  // pushState so back reverses the open/close; the popstate listener re-syncs.
  window.history.pushState(window.history.state, '', url)
}

/**
 * @param param    URL search param name, or undefined to disable sync.
 * @param peekId   Current fallback peek id (provider state).
 * @param setPeekId Setter to open/close the fallback peek from URL changes.
 */
export function usePeekUrlSync(
  param: string | undefined,
  peekId: string | null,
  setPeekId: (id: string | null) => void,
): void {
  // Latest setter without making the effects depend on its identity.
  const setRef = useRef(setPeekId)
  setRef.current = setPeekId

  // Initialize from the URL on mount + follow browser navigation (back/forward).
  useEffect(() => {
    if (!param) {
      return undefined
    }

    setRef.current(readParam(param))
    const onPopState = () => setRef.current(readParam(param))
    window.addEventListener('popstate', onPopState)

    return () => window.removeEventListener('popstate', onPopState)
  }, [param])

  // Reflect peek open/close into the URL, but only when it diverges from the
  // URL — avoids a second history entry when the change already came from a
  // popstate/initial read.
  useEffect(() => {
    if (!param) {
      return
    }

    if (readParam(param) !== peekId) {
      writeParam(param, peekId)
    }
  }, [param, peekId])
}
