'use client'

import { useRenderNode, useSduiLayoutAction, useSduiNodeSubscription } from '@lodado/sdui-template'
import React, { useCallback } from 'react'

import {
  Dialog,
  DialogBody,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogOverlay,
  DialogPortal,
  DialogTitle,
  useDialogContext,
} from './Dialog'
import { dialogCancelButtonVariants, dialogConfirmButtonVariants } from './dialog-variants'
import {
  type DialogAppearance,
  type DialogBodyState,
  dialogBodyStateSchema,
  type DialogContainerProps,
  type DialogContentState,
  dialogContentStateSchema,
  type DialogFooterState,
  dialogFooterStateSchema,
  type DialogHeaderState,
  dialogHeaderStateSchema,
  type DialogPortalState,
  dialogPortalStateSchema,
  type DialogRootState,
  dialogRootStateSchema,
  type DialogSize,
  type DialogTriggerState,
  dialogTriggerStateSchema,
} from './types'

/**
 * DialogContainer - SDUI Container for Dialog component
 *
 * @description
 * Integrates Dialog with the SDUI template system.
 * Subscribes to node state changes and renders the Dialog with current state.
 *
 * Provides DialogContext for child components to inherit providerId.
 *
 * @example SDUI Document (compound pattern with providerId inheritance)
 * ```json
 * {
 *   "id": "dialog-root",
 *   "type": "Dialog",
 *   "state": { "open": false },
 *   "children": [
 *     { "type": "DialogTrigger", "children": [...] },
 *     { "type": "DialogPortal", "children": [
 *       { "type": "DialogContent", "state": { "size": "small" }, "children": [
 *         { "type": "DialogHeader", "state": { "title": "Title", "hasCloseButton": true } },
 *         { "type": "DialogBody", "children": [...] },
 *         { "type": "DialogFooter", "state": { "cancelLabel": "Cancel", "confirmLabel": "OK" } }
 *       ]}
 *     ]}
 *   ]
 * }
 * ```
 */
export const DialogContainer = ({ id, parentPath = [] }: DialogContainerProps) => {
  const { childrenIds, state } = useSduiNodeSubscription({
    nodeId: id,
  })
  const { renderChildren } = useRenderNode({ nodeId: id, parentPath })
  const store = useSduiLayoutAction()

  const typedState = state as DialogRootState

  // Handle open state change
  const handleOpenChange = useCallback(
    (open: boolean) => {
      store.updateNodeState(id, { open })
    },
    [id, store],
  )

  return (
    <Dialog.Root id={id} open={typedState?.open ?? false} onOpenChange={handleOpenChange}>
      {renderChildren(childrenIds)}
    </Dialog.Root>
  )
}

DialogContainer.displayName = 'DialogContainer'

// =============================================================================
// SDUI Sub-component Containers (providerId pattern)
// =============================================================================

/**
 * DialogTriggerContainer - SDUI Container for Dialog.Trigger
 *
 * @description
 * Subscribes to the provider (Dialog) via providerId and controls open state.
 * Clicking the trigger toggles the provider's open state.
 *
 * If providerId is not specified, it inherits from parent Dialog context.
 *
 * @example SDUI Document
 * ```json
 * {
 *   "type": "DialogTrigger",
 *   "children": [{ "type": "Button", ... }]
 * }
 * ```
 */
export const DialogTriggerContainer = ({ id, parentPath = [] }: DialogContainerProps) => {
  const { childrenIds, state } = useSduiNodeSubscription({
    nodeId: id,
  })
  const { renderChildren } = useRenderNode({ nodeId: id, parentPath })
  const store = useSduiLayoutAction()
  const dialogContext = useDialogContext()

  const typedState = state as DialogTriggerState

  // Use providerId from state, fallback to context
  const providerId = typedState?.providerId ?? dialogContext?.providerId

  // Subscribe to provider state
  const { state: providerState } = useSduiNodeSubscription({
    nodeId: providerId ?? '',
  })

  const providerTypedState = providerState as DialogRootState
  const isOpen = providerTypedState?.open ?? false

  // Toggle provider's open state on click
  const handleClick = useCallback(() => {
    if (providerId) {
      store.updateNodeState(providerId, { open: !isOpen })
    }
  }, [providerId, isOpen, store])

  // asChild requires exactly one child element
  if (childrenIds.length === 0) {
    return (
      <Dialog.Trigger asChild={false} onClick={handleClick}>
        Open
      </Dialog.Trigger>
    )
  }

  const children = renderChildren(childrenIds)
  const childArray = React.Children.toArray(children)

  // asChild requires exactly one child
  if (childArray.length === 1) {
    return (
      <Dialog.Trigger asChild onClick={handleClick}>
        {childArray[0]}
      </Dialog.Trigger>
    )
  }

  // Multiple children - wrap in div
  return (
    <Dialog.Trigger asChild={false} onClick={handleClick}>
      {children}
    </Dialog.Trigger>
  )
}

DialogTriggerContainer.displayName = 'DialogTriggerContainer'

/**
 * DialogPortalContainer - SDUI Container for Dialog.Portal with Overlay
 *
 * @description
 * If providerId is not specified, it inherits from parent Dialog context.
 */
export const DialogPortalContainer = ({ id, parentPath = [] }: DialogContainerProps) => {
  const { childrenIds, state } = useSduiNodeSubscription({
    nodeId: id,
  })
  const { renderChildren } = useRenderNode({ nodeId: id, parentPath })
  const dialogContext = useDialogContext()

  const typedState = state as DialogPortalState

  // Use providerId from state, fallback to context (for future use)
  const providerId = typedState?.providerId ?? dialogContext?.providerId

  return (
    <DialogPortal>
      <DialogOverlay />
      {renderChildren(childrenIds)}
    </DialogPortal>
  )
}

DialogPortalContainer.displayName = 'DialogPortalContainer'

/**
 * DialogContentContainer - SDUI Container for Dialog.Content
 *
 * @description
 * If providerId is not specified, it inherits from parent Dialog context.
 */
export const DialogContentContainer = ({ id, parentPath = [] }: DialogContainerProps) => {
  const { childrenIds, state } = useSduiNodeSubscription({
    nodeId: id,
  })
  const { renderChildren } = useRenderNode({ nodeId: id, parentPath })
  const dialogContext = useDialogContext()

  const typedState = state as DialogContentState

  // Use providerId from state, fallback to context (for future use)
  const providerId = typedState?.providerId ?? dialogContext?.providerId

  const size = (typedState?.size as DialogSize) ?? 'small'

  return <DialogContent size={size}>{renderChildren(childrenIds)}</DialogContent>
}

DialogContentContainer.displayName = 'DialogContentContainer'

/**
 * DialogHeaderContainer - SDUI Container for Dialog.Header
 *
 * @description
 * Subscribes to the provider (Dialog) via providerId.
 * Close button updates provider's open state to false.
 *
 * If providerId is not specified, it inherits from parent Dialog context.
 */
export const DialogHeaderContainer = ({ id, parentPath = [] }: DialogContainerProps) => {
  const { childrenIds, state } = useSduiNodeSubscription({
    nodeId: id,
  })
  const { renderChildren } = useRenderNode({ nodeId: id, parentPath })
  const store = useSduiLayoutAction()
  const dialogContext = useDialogContext()

  const typedState = state as DialogHeaderState

  // Use providerId from state, fallback to context
  const providerId = typedState?.providerId ?? dialogContext?.providerId

  const title = typedState?.title
  const hasCloseButton = typedState?.hasCloseButton ?? true

  // Handle close button click
  const handleClose = useCallback(() => {
    if (providerId) {
      store.updateNodeState(providerId, { open: false })
    }
  }, [providerId, store])

  return (
    <DialogHeader>
      <div className="flex-1">
        {title && <DialogTitle>{title}</DialogTitle>}
        {renderChildren(childrenIds)}
      </div>
      {hasCloseButton && <DialogClose onClick={handleClose} />}
    </DialogHeader>
  )
}

DialogHeaderContainer.displayName = 'DialogHeaderContainer'

/**
 * DialogBodyContainer - SDUI Container for Dialog.Body
 *
 * @description
 * If providerId is not specified, it inherits from parent Dialog context.
 */
export const DialogBodyContainer = ({ id, parentPath = [] }: DialogContainerProps) => {
  const { childrenIds, state } = useSduiNodeSubscription({
    nodeId: id,
  })
  const { renderChildren } = useRenderNode({ nodeId: id, parentPath })
  const dialogContext = useDialogContext()

  const typedState = state as DialogBodyState

  // Use providerId from state, fallback to context (for future use)
  const providerId = typedState?.providerId ?? dialogContext?.providerId

  return <DialogBody>{renderChildren(childrenIds)}</DialogBody>
}

DialogBodyContainer.displayName = 'DialogBodyContainer'

/**
 * DialogFooterContainer - SDUI Container for Dialog.Footer
 *
 * @description
 * Subscribes to the provider (Dialog) via providerId.
 * Cancel button updates provider's open state to false.
 *
 * If providerId is not specified, it inherits from parent Dialog context.
 */
export const DialogFooterContainer = ({ id, parentPath = [] }: DialogContainerProps) => {
  const { childrenIds, state } = useSduiNodeSubscription({
    nodeId: id,
  })
  const { renderChildren } = useRenderNode({ nodeId: id, parentPath })
  const store = useSduiLayoutAction()
  const dialogContext = useDialogContext()

  const typedState = state as DialogFooterState

  // Use providerId from state, fallback to context
  const providerId = typedState?.providerId ?? dialogContext?.providerId

  const appearance = (typedState?.appearance as DialogAppearance) ?? 'default'
  const confirmLabel = typedState?.confirmLabel
  const cancelLabel = typedState?.cancelLabel

  // Handle cancel button click
  const handleCancel = useCallback(() => {
    if (providerId) {
      store.updateNodeState(providerId, { open: false })
    }
  }, [providerId, store])

  // If no children, render default cancel/confirm buttons
  if (childrenIds.length === 0 && (cancelLabel || confirmLabel)) {
    return (
      <DialogFooter>
        {cancelLabel && (
          <button type="button" className={dialogCancelButtonVariants()} onClick={handleCancel}>
            {cancelLabel}
          </button>
        )}
        {confirmLabel && (
          <button
            type="button"
            className={dialogConfirmButtonVariants({
              appearance,
              isDisabled: false,
              isLoading: false,
            })}
          >
            {confirmLabel}
          </button>
        )}
      </DialogFooter>
    )
  }

  return <DialogFooter>{renderChildren(childrenIds)}</DialogFooter>
}

DialogFooterContainer.displayName = 'DialogFooterContainer'
