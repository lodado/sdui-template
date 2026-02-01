'use client'

import {
  useRenderNode,
  useSduiLayoutAction,
  useSduiNodeReference,
  useSduiNodeSubscription,
} from '@lodado/sdui-template'
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
  DialogRoot,
  DialogTitle,
} from './Dialog'
import { dialogCancelButtonVariants, dialogConfirmButtonVariants } from './dialog-variants'
import { type DialogAppearance, type DialogContainerProps, type DialogSize, dialogStatesSchema } from './types'

/**
 * DialogContainer - SDUI Container for Dialog component
 *
 * @description
 * Integrates Dialog with the SDUI template system.
 * Subscribes to node state changes and renders the Dialog with current state.
 *
 * Supports:
 * - State-driven open/close control
 * - Dynamic title, description
 * - Appearance variants
 * - Children rendering for body content
 *
 * @example SDUI Document
 * ```json
 * {
 *   "id": "dialog-1",
 *   "type": "Dialog",
 *   "attributes": {
 *     "title": "Modal Title",
 *     "size": "small",
 *     "hasCloseButton": true
 *   },
 *   "state": {
 *     "open": false
 *   },
 *   "children": [
 *     {
 *       "id": "dialog-trigger",
 *       "type": "DialogTrigger",
 *       "children": [...]
 *     },
 *     {
 *       "id": "dialog-body",
 *       "type": "DialogBody",
 *       "children": [...]
 *     },
 *     {
 *       "id": "dialog-footer",
 *       "type": "DialogFooter",
 *       "children": [...]
 *     }
 *   ]
 * }
 * ```
 */
export const DialogContainer = ({ id, parentPath = [] }: DialogContainerProps) => {
  const { childrenIds, attributes, state } = useSduiNodeSubscription({
    nodeId: id,
    schema: dialogStatesSchema,
  })
  const { renderChildren } = useRenderNode({ nodeId: id, parentPath })
  const store = useSduiLayoutAction()

  // Handle open state change
  const handleOpenChange = useCallback(
    (open: boolean) => {
      store.updateNodeState(id, { open })
    },
    [id, store],
  )

  // Merge attributes and state with type assertion
  const mergedProps = {
    ...(attributes ?? {}),
    ...(state ?? {}),
  } as Record<string, unknown>

  const open = mergedProps.open as boolean | undefined

  return (
    <DialogRoot open={open} onOpenChange={handleOpenChange}>
      <>{renderChildren(childrenIds)}</>
    </DialogRoot>
  )
}

DialogContainer.displayName = 'DialogContainer'

// =============================================================================
// SDUI Sub-component Containers
// =============================================================================

/**
 * DialogTriggerContainer - SDUI Container for Dialog.Trigger
 *
 * @description
 * Uses reference to get parent Dialog's state for open/close control.
 * Set `reference` field to point to the parent Dialog's id.
 */
export const DialogTriggerContainer = ({ id, parentPath = [] }: DialogContainerProps) => {
  const { childrenIds } = useSduiNodeSubscription({
    nodeId: id,
  })
  const { renderChildren } = useRenderNode({ nodeId: id, parentPath })

  // asChild requires exactly one child element
  // If no children, use asChild={false} to render default button
  if (childrenIds.length === 0) {
    return <Dialog.Trigger asChild={false}>Open</Dialog.Trigger>
  }

  // For asChild to work, we need exactly one child element
  const children = renderChildren(childrenIds)
  const childArray = React.Children.toArray(children)

  // asChild requires exactly one child - if single child, pass directly
  if (childArray.length === 1) {
    return <Dialog.Trigger>{childArray[0]}</Dialog.Trigger>
  }

  // Multiple children - wrap in div for asChild to work
  return (
    <Dialog.Trigger>
      <div className="inline-flex">{children}</div>
    </Dialog.Trigger>
  )
}

DialogTriggerContainer.displayName = 'DialogTriggerContainer'

/**
 * DialogPortalContainer - SDUI Container for Dialog.Portal with Overlay
 */
export const DialogPortalContainer = ({ id, parentPath = [] }: DialogContainerProps) => {
  const { childrenIds } = useSduiNodeSubscription({
    nodeId: id,
  })
  const { renderChildren } = useRenderNode({ nodeId: id, parentPath })

  return (
    <DialogPortal>
      <DialogOverlay />
      <>{renderChildren(childrenIds)}</>
    </DialogPortal>
  )
}

DialogPortalContainer.displayName = 'DialogPortalContainer'

/**
 * DialogContentContainer - SDUI Container for Dialog.Content
 */
export const DialogContentContainer = ({ id, parentPath = [] }: DialogContainerProps) => {
  const { childrenIds, attributes, state } = useSduiNodeSubscription({
    nodeId: id,
    schema: dialogStatesSchema,
  })
  const { renderChildren } = useRenderNode({ nodeId: id, parentPath })

  const mergedProps = {
    ...(attributes ?? {}),
    ...(state ?? {}),
  } as Record<string, unknown>

  const size = (mergedProps.size as DialogSize) ?? 'small'

  return (
    <DialogContent size={size}>
      <>{renderChildren(childrenIds)}</>
    </DialogContent>
  )
}

DialogContentContainer.displayName = 'DialogContentContainer'

/**
 * DialogHeaderContainer - SDUI Container for Dialog.Header
 */
export const DialogHeaderContainer = ({ id, parentPath = [] }: DialogContainerProps) => {
  const { childrenIds, attributes, state } = useSduiNodeSubscription({
    nodeId: id,
    schema: dialogStatesSchema,
  })
  const { renderChildren } = useRenderNode({ nodeId: id, parentPath })

  const mergedProps = {
    ...(attributes ?? {}),
    ...(state ?? {}),
  } as Record<string, unknown>

  const title = mergedProps.title as string | undefined
  const hasCloseButton = (mergedProps.hasCloseButton as boolean) ?? true

  return (
    <DialogHeader>
      <div className="flex-1">
        {title && <DialogTitle>{title}</DialogTitle>}
        <>{renderChildren(childrenIds)}</>
      </div>
      {hasCloseButton && <DialogClose />}
    </DialogHeader>
  )
}

DialogHeaderContainer.displayName = 'DialogHeaderContainer'

/**
 * DialogBodyContainer - SDUI Container for Dialog.Body
 */
export const DialogBodyContainer = ({ id, parentPath = [] }: DialogContainerProps) => {
  const { childrenIds } = useSduiNodeSubscription({
    nodeId: id,
  })
  const { renderChildren } = useRenderNode({ nodeId: id, parentPath })

  return (
    <DialogBody>
      <>{renderChildren(childrenIds)}</>
    </DialogBody>
  )
}

DialogBodyContainer.displayName = 'DialogBodyContainer'

/**
 * DialogFooterContainer - SDUI Container for Dialog.Footer
 */
export const DialogFooterContainer = ({ id, parentPath = [] }: DialogContainerProps) => {
  const { childrenIds, attributes, state } = useSduiNodeSubscription({
    nodeId: id,
    schema: dialogStatesSchema,
  })
  const { renderChildren } = useRenderNode({ nodeId: id, parentPath })

  const mergedProps = {
    ...(attributes ?? {}),
    ...(state ?? {}),
  } as Record<string, unknown>

  const appearance = (mergedProps.appearance as DialogAppearance) ?? 'default'
  const confirmLabel = mergedProps.confirmLabel as string | undefined
  const cancelLabel = mergedProps.cancelLabel as string | undefined
  const isLoading = (mergedProps.isLoading as boolean) ?? false
  const isConfirmDisabled = (mergedProps.isConfirmDisabled as boolean) ?? false

  // If no children, render default cancel/confirm buttons
  if (childrenIds.length === 0 && (cancelLabel || confirmLabel)) {
    return (
      <DialogFooter>
        {cancelLabel && (
          <DialogClose asChild>
            <button type="button" className={dialogCancelButtonVariants()}>
              {cancelLabel}
            </button>
          </DialogClose>
        )}
        {confirmLabel && (
          <button
            type="button"
            className={dialogConfirmButtonVariants({
              appearance,
              isDisabled: isConfirmDisabled,
              isLoading,
            })}
            disabled={isConfirmDisabled || isLoading}
          >
            {confirmLabel}
          </button>
        )}
      </DialogFooter>
    )
  }

  return (
    <DialogFooter>
      <>{renderChildren(childrenIds)}</>
    </DialogFooter>
  )
}

DialogFooterContainer.displayName = 'DialogFooterContainer'
