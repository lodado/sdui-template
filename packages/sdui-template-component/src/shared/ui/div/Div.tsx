'use client'

import { useRenderNode, useSduiNodeSubscription } from '@lodado/sdui-template'
import React, { Suspense } from 'react'

import { cn } from '../../lib/cn'
import { ErrorBoundary } from './ErrorBoundary'

interface DivProps {
  id: string
  parentPath?: string[]
  as?: React.ElementType
  errorFallback?: React.ReactNode | ((error: Error, errorInfo: React.ErrorInfo) => React.ReactNode)
  suspenseFallback?: React.ReactNode
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void
}

/**
 * Div component with Error Boundary and Suspense
 *
 * @description
 * Renders a div element (or custom element via `as` prop) with error handling
 * and async loading support. Wraps children rendering with ErrorBoundary and Suspense.
 *
 * @example
 * ```tsx
 * <Div
 *   id="div-1"
 *   suspenseFallback={<div>Loading...</div>}
 *   errorFallback={<div>Error occurred</div>}
 * />
 * ```
 */
export const Div = ({ id, parentPath = [], as, errorFallback, suspenseFallback, onError }: DivProps) => {
  const { childrenIds, attributes } = useSduiNodeSubscription({ nodeId: id })
  const { renderChildren } = useRenderNode({ nodeId: id, parentPath })

  const className = attributes?.className as string | undefined
  const asFromAttributes = attributes?.as as React.ElementType | undefined
  const Component = as || asFromAttributes || 'div'

  return (
    <ErrorBoundary
      fallback={errorFallback}
      onError={onError}
      nodeId={id}
      parentPath={parentPath}
    >
      <Component className={cn(className)} data-node-id={id} data-testid={`div-${id}`}>
        <Suspense fallback={suspenseFallback || null}>{renderChildren(childrenIds)}</Suspense>
      </Component>
    </ErrorBoundary>
  )
}
