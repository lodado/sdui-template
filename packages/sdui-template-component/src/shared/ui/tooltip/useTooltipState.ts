'use client'

import { useState } from 'react'

import { useHasHover } from '../../utils'

interface UseTooltipStateProps {
  open?: boolean
  defaultOpen?: boolean
}

/**
 * Hook to manage tooltip open state with mobile support
 *
 * @description
 * Manages tooltip open/close state with special handling for mobile devices.
 * On mobile (devices without hover), tooltip can be opened via touch.
 * On desktop (devices with hover), tooltip uses default hover behavior.
 *
 * @param open - Controlled open state
 * @param defaultOpen - Default open state
 * @returns Object containing finalOpen state and event handlers
 *
 * @example
 * ```tsx
 * const { finalOpen, handleOpenChange, handleTouchStart } = useTooltipState({
 *   open,
 *   defaultOpen
 * })
 * ```
 */
export function useTooltipState({ open, defaultOpen }: UseTooltipStateProps) {
  const hasHover = useHasHover()
  const [internalOpen, setInternalOpen] = useState(defaultOpen ?? false)
  const isControlled = open !== undefined

  const handleOpenChange = (newOpen: boolean) => {
    if (!isControlled) {
      // On devices without hover (mobile), prevent closing via hover
      if (!hasHover && !open && !internalOpen) {
        return
      }
      setInternalOpen(newOpen)
    }
  }

  const handleTouchStart = () => {
    if (!isControlled && !hasHover && !internalOpen) {
      setInternalOpen(true)
    }
  }

  const finalOpen = isControlled ? open : internalOpen

  return {
    finalOpen,
    handleOpenChange,
    handleTouchStart,
  }
}
