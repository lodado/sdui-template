import type React from 'react'

/**
 * Error Context
 * Metadata related to where an error occurred.
 */
export interface ErrorContext {
  /** SDUI node ID */
  nodeId?: string
  /** Component name */
  componentName?: string
  /** Error timestamp */
  timestamp: number
  /** ErrorBoundary ID (used to distinguish multiple boundaries) */
  errorBoundaryId?: string
  /** Parent path (SDUI hierarchy) */
  parentPath?: string[]
  /** Additional metadata */
  metadata?: Record<string, unknown>
}

/**
 * Error Situation
 * Situation details passed from ErrorBoundary to a policy.
 */
export interface ErrorSituation {
  /** Error object */
  error: Error
  /** React ErrorInfo (provided by componentDidCatch) */
  errorInfo?: React.ErrorInfo

  /** Context info */
  context: ErrorContext

  /** Lifecycle info */
  lifecycle: {
    /** Current lifecycle phase */
    phase: 'mount' | 'update' | 'unmount' | 'catch' | 'recovery'
    /** Previous state */
    previousState?: {
      hasError: boolean
      error: Error | null
    }
    /** Current state */
    currentState: {
      hasError: boolean
      error: Error | null
    }
  }

  /** Additional metadata */
  metadata?: Record<string, unknown>
}

/**
 * Error Policy
 * Policy interface for handling error situations.
 */
export interface ErrorPolicy {
  /**
   * Handle an error situation.
   * @param situation - Error situation details
   */
  handleSituation(situation: ErrorSituation): void | Promise<void>
}
