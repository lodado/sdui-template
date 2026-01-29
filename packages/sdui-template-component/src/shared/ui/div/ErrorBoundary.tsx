'use client'

import React, { Component, type ReactNode } from 'react'

interface ErrorBoundaryProps {
  children: ReactNode
  fallback?: ReactNode | ((error: Error, errorInfo: React.ErrorInfo) => ReactNode)
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void
}

interface ErrorBoundaryState {
  hasError: boolean
  error: Error | null
  errorInfo: React.ErrorInfo | null
}

/**
 * Error Boundary for Div component
 *
 * @description
 * Catches JavaScript errors anywhere in the child component tree,
 * logs those errors, and displays a fallback UI instead of crashing the whole app.
 *
 * @example
 * ```tsx
 * <ErrorBoundary fallback={<div>Something went wrong</div>}>
 *   <Div id="div-1" />
 * </ErrorBoundary>
 * ```
 */
export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
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

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    const { onError } = this.props
    this.setState({
      error,
      errorInfo,
    })

    // Call optional error handler
    if (onError) {
      onError(error, errorInfo)
    }
  }

  render() {
    const { hasError, error, errorInfo } = this.state
    const { fallback, children } = this.props

    if (hasError && error) {
      // Custom fallback UI
      if (fallback) {
        if (typeof fallback === 'function') {
          return fallback(error, errorInfo!)
        }
        return fallback
      }

      // Default fallback UI with error details
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
