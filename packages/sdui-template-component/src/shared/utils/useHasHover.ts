/**
 * Hook to detect if the device supports hover interaction
 *
 * @description
 * Uses CSS media query `(hover: hover)` to detect if the device has hover capability.
 * Returns `true` if hover is supported (desktop), `false` if not (mobile/touch devices).
 *
 * @returns `true` if device supports hover, `false` otherwise
 *
 * @example
 * ```tsx
 * const hasHover = useHasHover()
 * if (hasHover) {
 *   // Desktop behavior
 * } else {
 *   // Mobile behavior
 * }
 * ```
 */
export function useHasHover(): boolean {
  try {
    return matchMedia('(hover: hover)').matches
  } catch {
    // Assume that if browser too old to support matchMedia it's likely not a touch device
    return true
  }
}
