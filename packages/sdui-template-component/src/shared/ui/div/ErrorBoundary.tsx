'use client'

import React, { Component, type ReactNode } from 'react'

import type { ErrorSituation } from './error-policy'
import { useErrorReportingContext } from './error-policy'

interface ErrorBoundaryProps {
  children: ReactNode
  fallback?: ReactNode | ((error: Error, errorInfo: React.ErrorInfo) => ReactNode)
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void
  /** SDUI node ID (included in error context) */
  nodeId?: string
  /** Parent path (included in error context) */
  parentPath?: string[]
}

interface ErrorBoundaryState {
  hasError: boolean
  error: Error | null
  errorInfo: React.ErrorInfo | null
}

/**
 * Internal ErrorBoundary implementation (without context).
 */
class ErrorBoundaryInner extends Component<
  ErrorBoundaryProps & { reportSituation?: (situation: ErrorSituation) => void },
  ErrorBoundaryState
> {
  private previousState: ErrorBoundaryState | null = null

  constructor(
    props: ErrorBoundaryProps & { reportSituation?: (situation: ErrorSituation) => void }
  ) {
    super(props)
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    }
  }

  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    return {
      hasError: true,
      error,
    }
  }

  componentDidMount() {
    this.reportSituation({
      error: new Error('Boundary mounted'),
      lifecycle: {
        phase: 'mount',
        currentState: {
          hasError: false,
          error: null,
        },
      },
    })
  }

  componentDidUpdate(
    prevProps: ErrorBoundaryProps,
    prevState: ErrorBoundaryState
  ) {
    const { hasError: prevHasError, error: prevError } = prevState
    const { hasError, error, errorInfo } = this.state

    this.previousState = prevState

    if (prevHasError && !hasError && prevError) {
      this.reportSituation({
        error: prevError,
        lifecycle: {
          phase: 'recovery',
          previousState: {
            hasError: true,
            error: prevError,
          },
          currentState: {
            hasError: false,
            error: null,
          },
        },
      })
    } else if (!prevHasError && hasError && error) {
      this.reportSituation({
        error,
        errorInfo: errorInfo || undefined,
        lifecycle: {
          phase: 'update',
          previousState: {
            hasError: false,
            error: null,
          },
          currentState: {
            hasError: true,
            error,
          },
        },
      })
    }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    this.setState(
      {
        error,
        errorInfo,
      },
      () => {
        this.reportSituation({
          error,
          errorInfo,
          lifecycle: {
            phase: 'catch',
            previousState: this.previousState
              ? {
                  hasError: this.previousState.hasError,
                  error: this.previousState.error,
                }
              : undefined,
            currentState: {
              hasError: true,
              error,
            },
          },
        })
      }
    )

    const { onError } = this.props
    if (onError) {
      onError(error, errorInfo)
    }
  }

  componentWillUnmount() {
    const { error, hasError } = this.state
    if (error) {
      this.reportSituation({
        error,
        lifecycle: {
          phase: 'unmount',
          currentState: {
            hasError,
            error,
          },
        },
      })
    }
  }

  private reportSituation(situation: Partial<ErrorSituation>) {
    const { nodeId, parentPath, reportSituation } = this.props
    const fullSituation: ErrorSituation = {
      ...situation,
      error: situation.error!,
      context: {
        nodeId,
        componentName: 'ErrorBoundary',
        timestamp: Date.now(),
        parentPath,
      },
    } as ErrorSituation

    if (reportSituation) {
      reportSituation(fullSituation)
    }
  }

  render() {
    const { hasError, error, errorInfo } = this.state
    const { fallback, children, reportSituation: _, ...restProps } = this.props

    if (hasError && error) {
      if (fallback) {
        if (typeof fallback === 'function') {
          return fallback(error, errorInfo!)
        }
        return fallback
      }

      return (
        <div
          role="alert"
          data-testid="error-boundary-fallback"
          className="p-4 border border-[var(--color-border-danger)] rounded bg-[var(--color-background-danger-default)] text-[var(--color-text-danger)]"
        >
          <div className="font-bold mb-2">Something went wrong</div>
          {error.message && (
            <div>
              <span className="font-semibold">Error: </span>
              <span>{error.message}</span>
            </div>
          )}
        </div>
      )
    }

    return children
  }
}

/**
 * Error Boundary for Div component
 *
 * @description
 * Catches JavaScript errors anywhere in the child component tree,
 * logs those errors, and displays a fallback UI instead of crashing the whole app.
 *
 * Error Reporting:
 * - If wrapped with ErrorReportingProvider, errors are reported via Policy
 * - Otherwise, falls back to onError prop
 *
 * @example
 * ```tsx
 * <ErrorBoundary fallback={<div>Something went wrong</div>}>
 *   <Div id="div-1" />
 * </ErrorBoundary>
 * ```
 */
export const ErrorBoundary: React.FC<ErrorBoundaryProps> = props => {
  const context = useErrorReportingContext()
  const { children, fallback, onError, nodeId, parentPath } = props

  return (
    <ErrorBoundaryInner
      fallback={fallback}
      onError={onError}
      nodeId={nodeId}
      parentPath={parentPath}
      reportSituation={context?.reportSituation}
    >
      {children}
    </ErrorBoundaryInner>
  )
}
