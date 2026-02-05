import React, { useCallback } from 'react'

/**
 * Hook for checkbox event handlers
 *
 * @description
 * Provides change and keyboard event handlers for checkbox components.
 * Handles Space and Enter keys for keyboard accessibility.
 *
 * @param params - Handler parameters
 * @param params.checked - Current checked state
 * @param params.disabled - Whether the checkbox is disabled
 * @param params.onCheckedChange - Callback when checkbox state changes
 * @returns Object containing change and keyDown handlers
 *
 * @example
 * ```tsx
 * const { handleChange, handleKeyDown } = useCheckboxHandlers({
 *   checked: isChecked,
 *   disabled: false,
 *   onCheckedChange: setChecked,
 * })
 *
 * return (
 *   <input
 *     type="checkbox"
 *     checked={isChecked}
 *     onChange={handleChange}
 *     onKeyDown={handleKeyDown}
 *   />
 * )
 * ```
 */
export function useCheckboxHandlers({
  checked,
  disabled = false,
  onCheckedChange,
}: {
  checked?: boolean
  disabled?: boolean
  onCheckedChange?: (newCheckedStatus: boolean) => void
}) {
  // Handle change event
  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (!disabled) {
        onCheckedChange?.(e.target.checked)
      }
    },
    [disabled, onCheckedChange],
  )

  // Handle keyboard events (Space and Enter)
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === ' ' || e.key === 'Enter') {
        e.preventDefault()
        if (!disabled && onCheckedChange) {
          onCheckedChange?.(!checked)
        }
      }
    },
    [checked, disabled, onCheckedChange],
  )

  return {
    handleChange,
    handleKeyDown,
  }
}
