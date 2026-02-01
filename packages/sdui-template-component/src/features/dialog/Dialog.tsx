'use client'

import * as DialogPrimitive from '@radix-ui/react-dialog'
import React, { createContext, useContext, useMemo } from 'react'

import { cn } from '../../shared/lib/cn'

// =============================================================================
// Dialog Context for providerId inheritance
// =============================================================================

interface DialogContextValue {
  providerId: string
}

const DialogContext = createContext<DialogContextValue | null>(null)

/**
 * Hook to get providerId from Dialog context
 * Used by child components when providerId is not explicitly provided in state
 */
export const useDialogContext = () => useContext(DialogContext)
import {
  dialogBodyVariants,
  dialogCancelButtonVariants,
  dialogCloseVariants,
  dialogConfirmButtonVariants,
  dialogContentVariants,
  dialogDescriptionVariants,
  dialogFooterVariants,
  dialogHeaderVariants,
  dialogOverlayVariants,
  dialogTitleVariants,
} from './dialog-variants'
import type {
  ConfirmDialogProps,
  DialogBodyProps,
  DialogCloseProps,
  DialogContentProps,
  DialogDescriptionProps,
  DialogFooterProps,
  DialogHeaderProps,
  DialogOverlayProps,
  DialogPortalProps,
  DialogRootProps,
  DialogTitleProps,
  DialogTriggerProps,
  SimpleDialogProps,
} from './types'

// =============================================================================
// Icons
// =============================================================================

/**
 * Close icon (X) for dialog close button
 */
const CloseIcon = ({ className }: { className?: string }) => (
  <svg
    className={cn('w-4 h-4', className)}
    viewBox="0 0 16 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
  >
    <path
      d="M12 4L4 12M4 4L12 12"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
)

/**
 * Loading spinner for confirm button
 */
const LoadingSpinner = ({ className }: { className?: string }) => (
  <svg
    className={cn('w-4 h-4 animate-spin', className)}
    viewBox="0 0 16 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
  >
    <circle className="opacity-25" cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="2" />
    <path
      className="opacity-75"
      fill="currentColor"
      d="M15 8a7 7 0 01-7 7v-2a5 5 0 005-5h2z"
    />
  </svg>
)

// =============================================================================
// Compound Components
// =============================================================================

/**
 * Dialog.Root - Context provider and state management
 * Provides DialogContext for child components to inherit providerId
 */
const DialogRoot = ({ id, children, ...props }: DialogRootProps & { id?: string }) => {
  const contextValue = useMemo(() => (id ? { providerId: id } : null), [id])

  const content = <DialogPrimitive.Root {...props}>{children}</DialogPrimitive.Root>

  // Wrap with context only if id is provided
  if (contextValue) {
    return <DialogContext.Provider value={contextValue}>{content}</DialogContext.Provider>
  }

  return content
}
DialogRoot.displayName = 'Dialog.Root'

/**
 * Dialog.Trigger - Trigger element wrapper
 */
const DialogTrigger = React.forwardRef<HTMLButtonElement, DialogTriggerProps>(
  ({ children, asChild = true, className, ...props }, ref) => {
    return (
      <DialogPrimitive.Trigger ref={ref} asChild={asChild} className={className} {...props}>
        {children}
      </DialogPrimitive.Trigger>
    )
  },
)
DialogTrigger.displayName = 'Dialog.Trigger'

/**
 * Dialog.Portal - Portal container
 */
const DialogPortal = ({ children, ...props }: DialogPortalProps) => {
  return <DialogPrimitive.Portal {...props}>{children}</DialogPrimitive.Portal>
}
DialogPortal.displayName = 'Dialog.Portal'

/**
 * Dialog.Overlay - Background overlay (blanket)
 */
const DialogOverlay = React.forwardRef<HTMLDivElement, DialogOverlayProps>(
  ({ className, ...props }, ref) => {
    return (
      <DialogPrimitive.Overlay
        ref={ref}
        className={cn(dialogOverlayVariants(), className)}
        {...props}
      />
    )
  },
)
DialogOverlay.displayName = 'Dialog.Overlay'

/**
 * Dialog.Content - Main dialog container
 */
const DialogContent = React.forwardRef<HTMLDivElement, DialogContentProps>(
  ({ size = 'small', className, children, ...props }, ref) => {
    return (
      <DialogPrimitive.Content
        ref={ref}
        className={cn(dialogContentVariants({ size }), className)}
        {...props}
      >
        {children}
      </DialogPrimitive.Content>
    )
  },
)
DialogContent.displayName = 'Dialog.Content'

/**
 * Dialog.Header - Header section with title and close button
 */
const DialogHeader = ({ className, children }: DialogHeaderProps) => {
  return <div className={cn(dialogHeaderVariants(), className)}>{children}</div>
}
DialogHeader.displayName = 'Dialog.Header'

/**
 * Dialog.Title - Dialog title text
 */
const DialogTitle = React.forwardRef<HTMLHeadingElement, DialogTitleProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <DialogPrimitive.Title ref={ref} className={cn(dialogTitleVariants(), className)} {...props}>
        {children}
      </DialogPrimitive.Title>
    )
  },
)
DialogTitle.displayName = 'Dialog.Title'

/**
 * Dialog.Description - Dialog description text
 */
const DialogDescription = React.forwardRef<HTMLParagraphElement, DialogDescriptionProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <DialogPrimitive.Description
        ref={ref}
        className={cn(dialogDescriptionVariants(), className)}
        {...props}
      >
        {children}
      </DialogPrimitive.Description>
    )
  },
)
DialogDescription.displayName = 'Dialog.Description'

/**
 * Dialog.Close - Close button (default: X icon)
 */
const DialogClose = React.forwardRef<HTMLButtonElement, DialogCloseProps>(
  ({ children, asChild, className, ...props }, ref) => {
    return (
      <DialogPrimitive.Close
        ref={ref}
        asChild={asChild}
        className={cn(!asChild && dialogCloseVariants(), className)}
        aria-label="Close"
        {...props}
      >
        {children ?? <CloseIcon />}
      </DialogPrimitive.Close>
    )
  },
)
DialogClose.displayName = 'Dialog.Close'

/**
 * Dialog.Body - Body content section
 */
const DialogBody = ({ className, children }: DialogBodyProps) => {
  return <div className={cn(dialogBodyVariants(), className)}>{children}</div>
}
DialogBody.displayName = 'Dialog.Body'

/**
 * Dialog.Footer - Footer section with action buttons
 */
const DialogFooter = ({ className, children }: DialogFooterProps) => {
  return <div className={cn(dialogFooterVariants(), className)}>{children}</div>
}
DialogFooter.displayName = 'Dialog.Footer'

// =============================================================================
// Preset Components
// =============================================================================

/**
 * SimpleDialog - Basic dialog preset
 *
 * @description
 * A simple dialog with title, optional description, and content.
 * Use for quick implementation of basic dialogs.
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
export const SimpleDialog = ({
  trigger,
  title,
  description,
  size = 'small',
  hasCloseButton = true,
  children,
  open,
  defaultOpen,
  onOpenChange,
  className,
}: SimpleDialogProps) => {
  return (
    <DialogRoot open={open} defaultOpen={defaultOpen} onOpenChange={onOpenChange}>
      <DialogTrigger>{trigger}</DialogTrigger>
      <DialogPortal>
        <DialogOverlay />
        <DialogContent size={size} className={className}>
          <DialogHeader>
            <div className="flex-1">
              <DialogTitle>{title}</DialogTitle>
              {description && <DialogDescription>{description}</DialogDescription>}
            </div>
            {hasCloseButton && <DialogClose />}
          </DialogHeader>
          <DialogBody>{children}</DialogBody>
        </DialogContent>
      </DialogPortal>
    </DialogRoot>
  )
}
SimpleDialog.displayName = 'SimpleDialog'

/**
 * ConfirmDialog - Confirmation dialog preset
 *
 * @description
 * A dialog with confirm/cancel buttons for confirmation actions.
 * Supports different appearances for different action types.
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
export const ConfirmDialog = ({
  trigger,
  title,
  description,
  size = 'small',
  appearance = 'default',
  hasCloseButton = true,
  children,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  onConfirm,
  onCancel,
  isLoading = false,
  isConfirmDisabled = false,
  open,
  defaultOpen,
  onOpenChange,
  className,
}: ConfirmDialogProps) => {
  const handleConfirm = () => {
    onConfirm?.()
  }

  const handleCancel = () => {
    onCancel?.()
  }

  return (
    <DialogRoot open={open} defaultOpen={defaultOpen} onOpenChange={onOpenChange}>
      <DialogTrigger>{trigger}</DialogTrigger>
      <DialogPortal>
        <DialogOverlay />
        <DialogContent size={size} className={className}>
          <DialogHeader>
            <div className="flex-1">
              <DialogTitle>{title}</DialogTitle>
              {description && <DialogDescription>{description}</DialogDescription>}
            </div>
            {hasCloseButton && <DialogClose />}
          </DialogHeader>
          <DialogBody>{children}</DialogBody>
          <DialogFooter>
            <DialogClose asChild>
              <button
                type="button"
                className={dialogCancelButtonVariants()}
                onClick={handleCancel}
              >
                {cancelLabel}
              </button>
            </DialogClose>
            <button
              type="button"
              className={dialogConfirmButtonVariants({
                appearance,
                isDisabled: isConfirmDisabled,
                isLoading,
              })}
              onClick={handleConfirm}
              disabled={isConfirmDisabled || isLoading}
            >
              {isLoading && <LoadingSpinner className="mr-2" />}
              {confirmLabel}
            </button>
          </DialogFooter>
        </DialogContent>
      </DialogPortal>
    </DialogRoot>
  )
}
ConfirmDialog.displayName = 'ConfirmDialog'

// =============================================================================
// Compound Pattern Export
// =============================================================================

/**
 * Dialog compound component
 *
 * @description
 * A modal dialog component following Atlassian Design System (ADS) specifications.
 * Uses Radix UI Dialog primitive for full accessibility support.
 *
 * Features:
 * - Compound pattern for maximum flexibility
 * - Keyboard navigation (Escape to close)
 * - Focus trap and restoration
 * - ARIA attributes for screen readers
 * - Customizable through sub-components
 *
 * @example
 * ```tsx
 * // Full compound pattern
 * <Dialog.Root>
 *   <Dialog.Trigger asChild>
 *     <Button>Open Dialog</Button>
 *   </Dialog.Trigger>
 *   <Dialog.Portal>
 *     <Dialog.Overlay />
 *     <Dialog.Content size="medium">
 *       <Dialog.Header>
 *         <Dialog.Title>Title</Dialog.Title>
 *         <Dialog.Close />
 *       </Dialog.Header>
 *       <Dialog.Body>
 *         Content here...
 *       </Dialog.Body>
 *       <Dialog.Footer>
 *         <Dialog.Close asChild>
 *           <Button>Cancel</Button>
 *         </Dialog.Close>
 *         <Button>Confirm</Button>
 *       </Dialog.Footer>
 *     </Dialog.Content>
 *   </Dialog.Portal>
 * </Dialog.Root>
 * ```
 */
export const Dialog = {
  Root: DialogRoot,
  Trigger: DialogTrigger,
  Portal: DialogPortal,
  Overlay: DialogOverlay,
  Content: DialogContent,
  Header: DialogHeader,
  Title: DialogTitle,
  Description: DialogDescription,
  Close: DialogClose,
  Body: DialogBody,
  Footer: DialogFooter,
}

// Named exports for individual components
export {
  DialogBody,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogOverlay,
  DialogPortal,
  DialogRoot,
  DialogTitle,
  DialogTrigger,
}
