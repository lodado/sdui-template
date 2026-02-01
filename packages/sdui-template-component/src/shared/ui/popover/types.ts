import type React from 'react'
import { z } from 'zod'

// =============================================================================
// Component Props
// =============================================================================

/**
 * Popover size variants
 */
export type PopoverSize = 'small' | 'medium' | 'large'

/**
 * Popover.Root props
 */
export interface PopoverRootProps {
  /** Context provider ID for SDUI integration */
  id?: string
  /** Whether the popover is open (controlled) */
  open?: boolean
  /** Default open state (uncontrolled) */
  defaultOpen?: boolean
  /** Callback when open state changes */
  onOpenChange?: (open: boolean) => void
  /** Whether to enable modal behavior */
  modal?: boolean
  /** Children elements */
  children: React.ReactNode
}

/**
 * Popover.Trigger props
 */
export interface PopoverTriggerProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** Trigger element */
  children: React.ReactNode
  /** Whether to render as child element */
  asChild?: boolean
}

/**
 * Popover.Content props
 */
export interface PopoverContentProps {
  /** Children elements */
  children: React.ReactNode
  /** Content size */
  size?: PopoverSize
  /** Positioning side relative to trigger */
  side?: 'top' | 'right' | 'bottom' | 'left'
  /** Offset from trigger (px) */
  sideOffset?: number
  /** Alignment relative to trigger */
  align?: 'start' | 'center' | 'end'
  /** Alignment offset (px) */
  alignOffset?: number
  /** Additional CSS classes */
  className?: string
  /** Whether to force mount */
  forceMount?: true
  /** Callback when escape key is pressed */
  onEscapeKeyDown?: (event: KeyboardEvent) => void
  /** Callback when pointer down outside */
  onPointerDownOutside?: (event: CustomEvent) => void
  /** Callback when interact outside */
  onInteractOutside?: (event: CustomEvent) => void
  /** Callback when open auto focus */
  onOpenAutoFocus?: (event: Event) => void
  /** Callback when close auto focus */
  onCloseAutoFocus?: (event: Event) => void
}

/**
 * Popover.Close props
 */
export interface PopoverCloseProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** Close button element (optional) */
  children?: React.ReactNode
  /** Whether to render as child element */
  asChild?: boolean
}

/**
 * Popover.Arrow props
 */
export interface PopoverArrowProps {
  /** Arrow width (px) */
  width?: number
  /** Arrow height (px) */
  height?: number
  /** Additional CSS classes */
  className?: string
}

// =============================================================================
// SDUI Integration
// =============================================================================

/**
 * Popover container props for SDUI integration
 */
export interface PopoverContainerProps {
  /** SDUI node ID */
  id: string
  /** Parent path for nested rendering */
  parentPath?: string[]
}

// =============================================================================
// State Schemas (providerId pattern)
// =============================================================================

/**
 * PopoverRoot state schema
 * @description Root component holds the shared state for all children
 */
export const popoverRootStateSchema = z.object({
  /** Whether the popover is open */
  open: z.boolean().optional(),
})

export type PopoverRootState = z.infer<typeof popoverRootStateSchema>

/**
 * PopoverTrigger state schema
 * @description Trigger subscribes to provider and controls open state
 */
export const popoverTriggerStateSchema = z.object({
  /** Optional: ID of the Popover provider to subscribe to. If omitted, inherits from parent context. */
  providerId: z.string().optional(),
})

export type PopoverTriggerState = z.infer<typeof popoverTriggerStateSchema>

/**
 * PopoverContent state schema
 * @description Content subscribes to provider for open state
 *
 * Radix UI props are placed in state (not attributes) per SDUI convention
 */
export const popoverContentStateSchema = z.object({
  /** Optional: ID of the Popover provider to subscribe to. If omitted, inherits from parent context. */
  providerId: z.string().optional(),
  /** Content size */
  size: z.enum(['small', 'medium', 'large']).optional(),
  /** Positioning side relative to trigger */
  side: z.enum(['top', 'right', 'bottom', 'left']).optional(),
  /** Offset from trigger (px) */
  sideOffset: z.number().optional(),
  /** Alignment relative to trigger */
  align: z.enum(['start', 'center', 'end']).optional(),
  /** Alignment offset (px) */
  alignOffset: z.number().optional(),
})

export type PopoverContentState = z.infer<typeof popoverContentStateSchema>

/**
 * PopoverClose state schema
 * @description Close button subscribes to provider to update open state
 */
export const popoverCloseStateSchema = z.object({
  /** Optional: ID of the Popover provider to subscribe to. If omitted, inherits from parent context. */
  providerId: z.string().optional(),
})

export type PopoverCloseState = z.infer<typeof popoverCloseStateSchema>

/**
 * PopoverArrow state schema
 */
export const popoverArrowStateSchema = z.object({
  /** Optional: ID of the Popover provider to subscribe to. If omitted, inherits from parent context. */
  providerId: z.string().optional(),
  /** Arrow width (px) */
  width: z.number().optional(),
  /** Arrow height (px) */
  height: z.number().optional(),
})

export type PopoverArrowState = z.infer<typeof popoverArrowStateSchema>
