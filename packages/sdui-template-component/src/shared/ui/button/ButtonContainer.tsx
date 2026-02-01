'use client'

import { useRenderNode, useSduiNodeSubscription } from '@lodado/sdui-template'
import React from 'react'

import { Button } from './Button'
import { type ButtonProps, buttonStatesSchema } from './types'

interface ButtonContainerProps {
  id: string
  parentPath?: string[]
}

/**
 * ButtonContainer - SDUI Container for Button component
 *
 * @description
 * Uses forwardRef to enable Radix UI's asChild pattern.
 * When used as a child of Dialog.Trigger or Dropdown.Trigger,
 * the ref and event handlers are properly forwarded.
 */
export const ButtonContainer = React.forwardRef<HTMLButtonElement, ButtonContainerProps>(
  ({ id, parentPath = [] }, ref) => {
    const { childrenIds, attributes, state } = useSduiNodeSubscription({
      nodeId: id,
      schema: buttonStatesSchema,
    })
    const { renderChildren } = useRenderNode({ nodeId: id, parentPath })

    const children = childrenIds.length > 0 ? renderChildren(childrenIds) : undefined

    return (
      <Button
        ref={ref}
        nodeId={id}
        // eslint-disable-next-line react/jsx-props-no-spreading
        {...(attributes as ButtonProps)}
        // eslint-disable-next-line react/jsx-props-no-spreading
        {...(state as ButtonProps)}
      >
        {children}
      </Button>
    )
  },
)

ButtonContainer.displayName = 'ButtonContainer'
