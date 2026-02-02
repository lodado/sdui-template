import { render, screen } from '@testing-library/react'
import React from 'react'

import {
  ErrorReportingProvider,
  useErrorReportingContext,
} from '../ErrorReportingContext'
import type { ErrorPolicy, ErrorSituation } from '../types'

describe('ErrorReportingContext', () => {
  describe('ErrorReportingProvider', () => {
    it('should provide context value when policy is set', () => {
      const mockPolicy: ErrorPolicy = {
        handleSituation: jest.fn(),
      }

      const TestComponent = () => {
        const context = useErrorReportingContext()
        return (
          <div>
            {context ? 'Context available' : 'Context not available'}
          </div>
        )
      }

      render(
        <ErrorReportingProvider policy={mockPolicy}>
          <TestComponent />
        </ErrorReportingProvider>
      )

      expect(screen.getByText('Context available')).toBeInTheDocument()
    })

    it('should call policy.handleSituation when reportSituation is called', () => {
      const mockPolicy: ErrorPolicy = {
        handleSituation: jest.fn(),
      }

      const TestComponent = () => {
        const context = useErrorReportingContext()
        const situation: ErrorSituation = {
          error: new Error('Test error'),
          context: {
            nodeId: 'test-node',
            componentName: 'TestComponent',
            timestamp: Date.now(),
          },
          lifecycle: {
            phase: 'catch',
            currentState: {
              hasError: true,
              error: new Error('Test error'),
            },
          },
        }

        React.useEffect(() => {
          context?.reportSituation(situation)
        }, [context])

        return <div>Test</div>
      }

      render(
        <ErrorReportingProvider policy={mockPolicy}>
          <TestComponent />
        </ErrorReportingProvider>
      )

      expect(mockPolicy.handleSituation).toHaveBeenCalled()
    })

    it('should handle null policy', () => {
      const TestComponent = () => {
        const context = useErrorReportingContext()
        const situation: ErrorSituation = {
          error: new Error('Test error'),
          context: {
            nodeId: 'test-node',
            componentName: 'TestComponent',
            timestamp: Date.now(),
          },
          lifecycle: {
            phase: 'catch',
            currentState: {
              hasError: true,
              error: new Error('Test error'),
            },
          },
        }

        React.useEffect(() => {
          context?.reportSituation(situation)
        }, [context])

        return <div>Test</div>
      }

      render(
        <ErrorReportingProvider policy={null}>
          <TestComponent />
        </ErrorReportingProvider>
      )

      // Should not throw
      expect(screen.getByText('Test')).toBeInTheDocument()
    })

    it('should handle async policy.handleSituation', async () => {
      const mockPolicy: ErrorPolicy = {
        handleSituation: jest.fn(async () => undefined) as ErrorPolicy['handleSituation'],
      }

      const TestComponent = () => {
        const context = useErrorReportingContext()
        const situation: ErrorSituation = {
          error: new Error('Test error'),
          context: {
            nodeId: 'test-node',
            componentName: 'TestComponent',
            timestamp: Date.now(),
          },
          lifecycle: {
            phase: 'catch',
            currentState: {
              hasError: true,
              error: new Error('Test error'),
            },
          },
        }

        React.useEffect(() => {
          context?.reportSituation(situation)
        }, [context])

        return <div>Test</div>
      }

      render(
        <ErrorReportingProvider policy={mockPolicy}>
          <TestComponent />
        </ErrorReportingProvider>
      )

      expect(mockPolicy.handleSituation).toHaveBeenCalled()
    })

    it('should handle policy errors gracefully', () => {
      const mockPolicy: ErrorPolicy = {
        handleSituation: jest.fn(() => {
          throw new Error('Policy error')
        }) as ErrorPolicy['handleSituation'],
      }

      const consoleSpy = jest.spyOn(console, 'error').mockImplementation()

      const TestComponent = () => {
        const context = useErrorReportingContext()
        const situation: ErrorSituation = {
          error: new Error('Test error'),
          context: {
            nodeId: 'test-node',
            componentName: 'TestComponent',
            timestamp: Date.now(),
          },
          lifecycle: {
            phase: 'catch',
            currentState: {
              hasError: true,
              error: new Error('Test error'),
            },
          },
        }

        React.useEffect(() => {
          context?.reportSituation(situation)
        }, [context])

        return <div>Test</div>
      }

      render(
        <ErrorReportingProvider policy={mockPolicy}>
          <TestComponent />
        </ErrorReportingProvider>
      )

      expect(consoleSpy).toHaveBeenCalledWith(
        'Error in policy handler:',
        expect.any(Error)
      )

      consoleSpy.mockRestore()
    })
  })

  describe('useErrorReportingContext', () => {
    it('should return null when used outside provider', () => {
      const TestComponent = () => {
        const context = useErrorReportingContext()
        return <div>{context ? 'Has context' : 'No context'}</div>
      }

      render(<TestComponent />)

      expect(screen.getByText('No context')).toBeInTheDocument()
    })
  })
})
