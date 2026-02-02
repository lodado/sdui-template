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
   * 에러 상황을 보고합니다.
   * @param situation - 에러 상황 정보
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
  /** 자식 컴포넌트 */
  children: ReactNode
  /** 에러 처리 정책 */
  policy: ErrorPolicy | null
}

/**
 * Error Reporting Provider
 *
 * ErrorBoundary에서 발생한 에러 상황을 Policy로 전달하는 Provider입니다.
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
        // Promise인 경우 처리 (에러는 무시)
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
 * Error Reporting Context를 가져옵니다.
 * Provider 외부에서 사용 시 null을 반환합니다.
 *
 * @returns ErrorReportingContextValue 또는 null
 */
export const useErrorReportingContext =
  (): ErrorReportingContextValue | null => {
    return useContext(ErrorReportingContext)
  }
