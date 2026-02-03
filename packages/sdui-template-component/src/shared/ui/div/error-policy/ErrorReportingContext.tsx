'use client'

import React, {
  createContext,
  type ReactNode,
  useCallback,
  useContext,
  useMemo,
} from 'react'

import type { ErrorPolicy, ErrorSituation } from './types'

/**
 * Error Reporting Context Value
 */
interface ErrorReportingContextValue {
  /**
   * Report an error situation.
   * @param situation - Error situation details
   */
  reportSituation: (situation: ErrorSituation) => void
}

/**
 * Error Reporting Context
 */
const ErrorReportingContext =
  createContext<ErrorReportingContextValue | null>(null)

/**
 * Error Reporting Provider Props
 */
interface ErrorReportingProviderProps {
  /** Child components */
  children: ReactNode
  /** Error handling policy */
  policy: ErrorPolicy | null
}

/**
 * Error Reporting Provider
 *
 * Provider that passes ErrorBoundary error situations to a policy.
 *
 * @example
 * ```tsx
 * const policy = createErrorPolicy.builder()
 *   .add(new LoggingErrorPolicy(logger))
 *   .add(new AnalyticsErrorPolicy(analytics))
 *   .build()
 *
 * <ErrorReportingProvider policy={policy}>
 *   <SduiLayoutRenderer document={document} />
 * </ErrorReportingProvider>
 * ```
 */
export const ErrorReportingProvider: React.FC<
  ErrorReportingProviderProps
> = ({ children, policy }) => {
  const reportSituation = useCallback(
    (situation: ErrorSituation) => {
      if (!policy) {
        return
      }

      try {
        const result = policy.handleSituation(situation)
        // Handle Promise results (ignore errors)
        if (result instanceof Promise) {
          result.catch(err => {
            console.error('Error in policy handler:', err)
          })
        }
      } catch (err) {
        console.error('Error in policy handler:', err)
      }
    },
    [policy]
  )

  const value = useMemo(
    () => ({
      reportSituation,
    }),
    [reportSituation]
  )

  return (
    <ErrorReportingContext.Provider value={value}>
      {children}
    </ErrorReportingContext.Provider>
  )
}

/**
 * useErrorReportingContext Hook
 *
 * Get the Error Reporting Context.
 * Returns null when used outside the provider.
 *
 * @returns ErrorReportingContextValue or null
 */
export const useErrorReportingContext =
  (): ErrorReportingContextValue | null => {
    return useContext(ErrorReportingContext)
  }
