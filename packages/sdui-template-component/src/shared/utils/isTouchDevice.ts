/**
 * Detects if the current device is a touch device
 *
 * @description
 * Checks if the device supports touch events.
 * Uses multiple detection methods for better compatibility.
 *
 * @returns {boolean} True if the device is a touch device, false otherwise
 *
 * @example
 * ```ts
 * if (isTouchDevice()) {
 *   // Handle touch-specific behavior
 * }
 * ```
 */
export const isTouchDevice = (): boolean => {
  if (typeof window === 'undefined') {
    return false
  }

  return (
    'ontouchstart' in window ||
    navigator.maxTouchPoints > 0 ||
    // @ts-expect-error - msMaxTouchPoints is a legacy IE property
    (navigator.msMaxTouchPoints && navigator.msMaxTouchPoints > 0)
  )
}
