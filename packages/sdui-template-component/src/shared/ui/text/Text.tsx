'use client'

import { useSduiNodeSubscription } from '@lodado/sdui-template'
import React from 'react'

import { cn } from '../../lib/cn'

interface TextProps {
  id: string
}

/**
 * Text component - Default mode
 * Applies default text color styling
 */
export const Text = ({ id }: TextProps) => {
  const { state, attributes } = useSduiNodeSubscription({ nodeId: id })

  const text = state?.text as string | undefined
  const className = attributes?.className as string | undefined

  if (!text) {
    return null
  }

  return (
    <span className={cn('text-[var(--color-text-default)]', className)} data-node-id={id} data-testid={`text-${id}`}>
      {text}
    </span>
  )
}

Text.displayName = 'Text'

interface SpanProps {
  id: string
}

/**
 * Span component - Custom mode
 * Renders text without default color styling (for use inside buttons, etc.)
 */
export const Span = ({ id }: SpanProps) => {
  const { state, attributes } = useSduiNodeSubscription({ nodeId: id })

  const text = state?.text as string | undefined
  const className = attributes?.className as string | undefined

  if (!text) {
    return null
  }

  return (
    <span className={cn(className)} data-node-id={id} data-testid={`span-${id}`}>
      {text}
    </span>
  )
}

Span.displayName = 'Span'
