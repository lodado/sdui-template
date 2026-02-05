import React, { useCallback, useRef } from 'react'

/**
 * Combines multiple refs into a single ref callback
 *
 * @description
 * Useful when you need to forward a ref while also maintaining an internal ref.
 * Supports both function refs and object refs.
 *
 * @template T - The element type
 * @param refs - Array of refs to combine (can be function refs, object refs, or null)
 * @returns A ref callback that updates all provided refs
 *
 * @example
 * ```tsx
 * const MyComponent = React.forwardRef<HTMLInputElement, Props>((props, ref) => {
 *   const internalRef = useRef<HTMLInputElement>(null)
 *   const combinedRef = useCombinedRef(ref, internalRef)
 *
 *   return <input ref={combinedRef} />
 * })
 * ```
 */
export function useCombinedRef<T>(...refs: Array<React.Ref<T> | null | undefined>): React.RefCallback<T> {
  return useCallback(
    (node: T | null) => {
      refs.forEach((ref) => {
        if (typeof ref === 'function') {
          ref(node)
        } else if (ref && 'current' in ref) {
          // eslint-disable-next-line no-param-reassign
          ;(ref as React.MutableRefObject<T | null>).current = node
        }
      })
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    refs,
  )
}
