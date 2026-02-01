import React from 'react'
import { z } from 'zod'

/**
 * Dialog size variants (ADS style)
 * @description
 * - small: 400px width (default)
 * - medium: 600px width
 * - large: 800px width
 * - xlarge: 968px width
 */
export type DialogSize = 'small' | 'medium' | 'large' | 'xlarge'

/**
 * Dialog appearance variants
 * @description
 * - default: Neutral appearance
 * - danger: Red theme for destructive actions
 * - warning: Yellow theme for warnings
 */
export type DialogAppearance = 'default' | 'danger' | 'warning'

// =============================================================================
// Compound Component Props
// =============================================================================

/**
 * Dialog.Root props
 */
export interface DialogRootProps {
  /** Whether the dialog is open (controlled) */
  open?: boolean
  /** Default open state (uncontrolled) */
  defaultOpen?: boolean
  /** Callback when open state changes */
  onOpenChange?: (open: boolean) => void
  /** Children elements */
  children: React.ReactNode
  /** Whether to enable modal behavior */
  modal?: boolean
}

/**
 * Dialog.Trigger props
 */
export interface DialogTriggerProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** Trigger element */
  children: React.ReactNode
  /** Whether to render as child element */
  asChild?: boolean
  /** Additional CSS classes */
  className?: string
}

/**
 * Dialog.Portal props
 */
export interface DialogPortalProps {
  /** Children elements */
  children: React.ReactNode
  /** Portal container */
  container?: HTMLElement
  /** Whether to force mount */
  forceMount?: true
}

/**
 * Dialog.Overlay props
 */
export interface DialogOverlayProps {
  /** Additional CSS classes */
  className?: string
  /** Whether to force mount */
  forceMount?: true
}

/**
 * Dialog.Content props
 */
export interface DialogContentProps {
  /** Dialog size */
  size?: DialogSize
  /** Additional CSS classes */
  className?: string
  /** Children elements */
  children: React.ReactNode
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
 * Dialog.Header props
 */
export interface DialogHeaderProps {
  /** Additional CSS classes */
  className?: string
  /** Children elements */
  children: React.ReactNode
}

/**
 * Dialog.Title props
 */
export interface DialogTitleProps {
  /** Additional CSS classes */
  className?: string
  /** Children elements */
  children: React.ReactNode
}

/**
 * Dialog.Description props
 */
export interface DialogDescriptionProps {
  /** Additional CSS classes */
  className?: string
  /** Children elements */
  children: React.ReactNode
}

/**
 * Dialog.Close props
 */
export interface DialogCloseProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** Close button element (default: X icon) */
  children?: React.ReactNode
  /** Whether to render as child element */
  asChild?: boolean
  /** Additional CSS classes */
  className?: string
}

/**
 * Dialog.Body props
 */
export interface DialogBodyProps {
  /** Additional CSS classes */
  className?: string
  /** Children elements */
  children: React.ReactNode
}

/**
 * Dialog.Footer props
 */
export interface DialogFooterProps {
  /** Additional CSS classes */
  className?: string
  /** Children elements */
  children: React.ReactNode
}

// =============================================================================
// Preset Component Props
// =============================================================================

/**
 * SimpleDialog props
 * @description
 * A simple dialog preset with basic structure.
 * Use for quick implementation of dialogs with title, content, and optional close button.
 *
 * @example
 * ```tsx
 * <SimpleDialog
 *   trigger={<Button>Open</Button>}
 *   title="Modal Title"
 *   size="small"
 * >
 *   <p>Dialog content goes here</p>
 * </SimpleDialog>
 * ```
 */
export interface SimpleDialogProps {
  /** Trigger element */
  trigger: React.ReactNode
  /** Dialog title */
  title: string
  /** Dialog description (optional) */
  description?: string
  /** Dialog size */
  size?: DialogSize
  /** Whether to show close button */
  hasCloseButton?: boolean
  /** Children elements (body content) */
  children: React.ReactNode
  /** Whether the dialog is open (controlled) */
  open?: boolean
  /** Default open state (uncontrolled) */
  defaultOpen?: boolean
  /** Callback when open state changes */
  onOpenChange?: (open: boolean) => void
  /** Additional CSS classes for content */
  className?: string
}

/**
 * ConfirmDialog props
 * @description
 * A confirm dialog preset with confirm/cancel buttons.
 * Use for confirmation dialogs with actions.
 *
 * @example
 * ```tsx
 * <ConfirmDialog
 *   trigger={<Button>Delete</Button>}
 *   title="Confirm Delete"
 *   appearance="danger"
 *   confirmLabel="Delete"
 *   cancelLabel="Cancel"
 *   onConfirm={() => handleDelete()}
 * >
 *   <p>Are you sure you want to delete this item?</p>
 * </ConfirmDialog>
 * ```
 */
export interface ConfirmDialogProps {
  /** Trigger element */
  trigger: React.ReactNode
  /** Dialog title */
  title: string
  /** Dialog description (optional) */
  description?: string
  /** Dialog size */
  size?: DialogSize
  /** Dialog appearance */
  appearance?: DialogAppearance
  /** Whether to show close button in header */
  hasCloseButton?: boolean
  /** Children elements (body content) */
  children: React.ReactNode
  /** Confirm button label */
  confirmLabel?: string
  /** Cancel button label */
  cancelLabel?: string
  /** Callback when confirm button is clicked */
  onConfirm?: () => void
  /** Callback when cancel button is clicked */
  onCancel?: () => void
  /** Whether confirm button is in loading state */
  isLoading?: boolean
  /** Whether confirm button is disabled */
  isConfirmDisabled?: boolean
  /** Whether the dialog is open (controlled) */
  open?: boolean
  /** Default open state (uncontrolled) */
  defaultOpen?: boolean
  /** Callback when open state changes */
  onOpenChange?: (open: boolean) => void
  /** Additional CSS classes for content */
  className?: string
}

// =============================================================================
// SDUI Integration
// =============================================================================

/**
 * Dialog container props for SDUI integration
 */
export interface DialogContainerProps {
  /** SDUI node ID */
  id: string
  /** Parent path for nested rendering */
  parentPath?: string[]
}

/**
 * Dialog state schema for SDUI validation
 */
export const dialogStatesSchema: z.ZodSchema<Record<string, unknown>> = z.object({
  open: z.boolean().optional(),
  size: z.enum(['small', 'medium', 'large', 'xlarge']).optional(),
  appearance: z.enum(['default', 'danger', 'warning']).optional(),
  title: z.string().optional(),
  description: z.string().optional(),
  hasCloseButton: z.boolean().optional(),
  confirmLabel: z.string().optional(),
  cancelLabel: z.string().optional(),
  isLoading: z.boolean().optional(),
  isConfirmDisabled: z.boolean().optional(),
}) as z.ZodSchema<Record<string, unknown>>

export type DialogState = z.infer<typeof dialogStatesSchema>

// =============================================================================
// Compound Component State Schemas (providerId pattern)
// =============================================================================

/**
 * DialogRoot state schema
 * @description Root component holds the shared state for all children
 */
export const dialogRootStateSchema = z.object({
  /** Whether the dialog is open */
  open: z.boolean().optional(),
})

export type DialogRootState = z.infer<typeof dialogRootStateSchema>

/**
 * DialogTrigger state schema
 * @description Trigger subscribes to provider and controls open state
 */
export const dialogTriggerStateSchema = z.object({
  /** Optional: ID of the Dialog provider to subscribe to. If omitted, inherits from parent context. */
  providerId: z.string().optional(),
})

export type DialogTriggerState = z.infer<typeof dialogTriggerStateSchema>

/**
 * DialogPortal state schema
 * @description Portal subscribes to provider for rendering
 */
export const dialogPortalStateSchema = z.object({
  /** Optional: ID of the Dialog provider to subscribe to. If omitted, inherits from parent context. */
  providerId: z.string().optional(),
})

export type DialogPortalState = z.infer<typeof dialogPortalStateSchema>

/**
 * DialogContent state schema
 * @description Content subscribes to provider for open state
 *
 * Radix UI props are placed in state (not attributes) per SDUI convention
 */
export const dialogContentStateSchema = z.object({
  /** Optional: ID of the Dialog provider to subscribe to. If omitted, inherits from parent context. */
  providerId: z.string().optional(),
  /** Dialog size */
  size: z.enum(['small', 'medium', 'large', 'xlarge']).optional(),
})

export type DialogContentState = z.infer<typeof dialogContentStateSchema>

/**
 * DialogHeader state schema
 * @description Header with title and close button
 */
export const dialogHeaderStateSchema = z.object({
  /** Optional: ID of the Dialog provider to subscribe to. If omitted, inherits from parent context. */
  providerId: z.string().optional(),
  /** Dialog title */
  title: z.string().optional(),
  /** Whether to show close button */
  hasCloseButton: z.boolean().optional(),
})

export type DialogHeaderState = z.infer<typeof dialogHeaderStateSchema>

/**
 * DialogBody state schema
 * @description Body content section
 */
export const dialogBodyStateSchema = z.object({
  /** Optional: ID of the Dialog provider to subscribe to. If omitted, inherits from parent context. */
  providerId: z.string().optional(),
})

export type DialogBodyState = z.infer<typeof dialogBodyStateSchema>

/**
 * DialogFooter state schema
 * @description Footer with action buttons
 */
export const dialogFooterStateSchema = z.object({
  /** Optional: ID of the Dialog provider to subscribe to. If omitted, inherits from parent context. */
  providerId: z.string().optional(),
  /** Cancel button label */
  cancelLabel: z.string().optional(),
  /** Confirm button label */
  confirmLabel: z.string().optional(),
  /** Footer appearance */
  appearance: z.enum(['default', 'danger', 'warning']).optional(),
})

export type DialogFooterState = z.infer<typeof dialogFooterStateSchema>
