import { AlertErrorPolicy } from '../AlertErrorPolicy'
import { CompositeErrorPolicy } from '../CompositeErrorPolicy'
import { createErrorPolicy, ErrorPolicyBuilder } from '../ErrorPolicyBuilder'
import type { ErrorPolicy, ErrorSituation } from '../types'

describe('Error Policy Tests', () => {
  describe('ErrorPolicyBuilder', () => {
    it('should build null when no policies added', () => {
      const builder = createErrorPolicy.builder()
      const policy = builder.build()
      expect(policy).toBeNull()
    })

    it('should build single policy when one policy added', () => {
      const mockPolicy: ErrorPolicy = {
        handleSituation: jest.fn(),
      }

      const builder = createErrorPolicy.builder().add(mockPolicy)
      const policy = builder.build()

      expect(policy).toBe(mockPolicy)
    })

    it('should build CompositePolicy when multiple policies added', () => {
      const policy1: ErrorPolicy = { handleSituation: jest.fn() }
      const policy2: ErrorPolicy = { handleSituation: jest.fn() }

      const builder = createErrorPolicy.builder().add(policy1).add(policy2)
      const policy = builder.build()

      expect(policy).toBeInstanceOf(CompositeErrorPolicy)
    })

    it('should ignore null/undefined policies', () => {
      const policy1: ErrorPolicy = { handleSituation: jest.fn() }

      const builder = createErrorPolicy.builder()
        .add(policy1)
        .add(null)
        .add(undefined)
      const policy = builder.build()

      expect(policy).toBe(policy1)
    })

    it('should conditionally add policy with addIf', () => {
      const policy1: ErrorPolicy = { handleSituation: jest.fn() }
      const policy2: ErrorPolicy = { handleSituation: jest.fn() }

      const builder = createErrorPolicy.builder()
        .add(policy1)
        .addIf(true, policy2)
        .addIf(false, { handleSituation: jest.fn() })

      const policy = builder.build()
      expect(policy).toBeInstanceOf(CompositeErrorPolicy)
    })

    it('should add many policies at once', () => {
      const policy1: ErrorPolicy = { handleSituation: jest.fn() }
      const policy2: ErrorPolicy = { handleSituation: jest.fn() }
      const policy3: ErrorPolicy = { handleSituation: jest.fn() }

      const builder = createErrorPolicy.builder().addMany(policy1, policy2, policy3)
      const policy = builder.build()

      expect(policy).toBeInstanceOf(CompositeErrorPolicy)
    })

    it('should set options with withOptions', () => {
      const policy1: ErrorPolicy = { handleSituation: jest.fn() }
      const policy2: ErrorPolicy = { handleSituation: jest.fn() }

      const builder = createErrorPolicy.builder()
        .add(policy1)
        .add(policy2)
        .withOptions({ execution: 'parallel', stopOnError: true })

      const policy = builder.build()
      expect(policy).toBeInstanceOf(CompositeErrorPolicy)
    })
  })

  describe('createErrorPolicy.chain', () => {
    it('should chain multiple policies', () => {
      const policy1: ErrorPolicy = { handleSituation: jest.fn() }
      const policy2: ErrorPolicy = { handleSituation: jest.fn() }

      const policy = createErrorPolicy.chain(policy1, policy2)

      expect(policy).toBeInstanceOf(CompositeErrorPolicy)
    })
  })

  describe('CompositeErrorPolicy', () => {
    const createMockSituation = (): ErrorSituation => ({
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
    })

    it('should execute policies sequentially by default', async () => {
      const callOrder: number[] = []
      const policy1: ErrorPolicy = {
        handleSituation: jest.fn(async () => {
          callOrder.push(1)
          await new Promise(resolve => {setTimeout(resolve, 10)})
        }) as ErrorPolicy['handleSituation'],
      }
      const policy2: ErrorPolicy = {
        handleSituation: jest.fn(async () => {
          callOrder.push(2)
        }) as ErrorPolicy['handleSituation'],
      }

      const composite = new CompositeErrorPolicy([policy1, policy2])
      await composite.handleSituation(createMockSituation())

      expect(callOrder).toEqual([1, 2])
    })

    it('should execute policies in parallel when option set', async () => {
      const callOrder: number[] = []
      const policy1: ErrorPolicy = {
        handleSituation: jest.fn(async () => {
          await new Promise(resolve => {setTimeout(resolve, 20)})
          callOrder.push(1)
        }) as ErrorPolicy['handleSituation'],
      }
      const policy2: ErrorPolicy = {
        handleSituation: jest.fn(async () => {
          await new Promise(resolve => {setTimeout(resolve, 10)})
          callOrder.push(2)
        }) as ErrorPolicy['handleSituation'],
      }

      const composite = new CompositeErrorPolicy([policy1, policy2], {
        execution: 'parallel',
      })
      await composite.handleSituation(createMockSituation())

      // Parallel execution: faster one should finish first
      expect(callOrder).toEqual([2, 1])
    })

    it('should continue execution when one policy fails', async () => {
      const policy1: ErrorPolicy = {
        handleSituation: jest.fn(() => {
          throw new Error('Policy 1 failed')
        }) as ErrorPolicy['handleSituation'],
      }
      const policy2: ErrorPolicy = {
        handleSituation: jest.fn(),
      }

      const composite = new CompositeErrorPolicy([policy1, policy2])
      await composite.handleSituation(createMockSituation())

      expect(policy2.handleSituation).toHaveBeenCalled()
    })

    it('should stop on error when stopOnError is true', async () => {
      const policy1: ErrorPolicy = {
        handleSituation: jest.fn(() => {
          throw new Error('Policy 1 failed')
        }) as ErrorPolicy['handleSituation'],
      }
      const policy2: ErrorPolicy = {
        handleSituation: jest.fn(),
      }

      const composite = new CompositeErrorPolicy([policy1, policy2], {
        stopOnError: true,
      })

      await expect(
        composite.handleSituation(createMockSituation())
      ).rejects.toThrow('Policy 1 failed')
    })

    it('should handle empty policies array', async () => {
      const composite = new CompositeErrorPolicy([])
      await expect(
        composite.handleSituation(createMockSituation())
      ).resolves.not.toThrow()
    })
  })

  describe('AlertErrorPolicy', () => {
    let originalAlert: typeof window.alert

    beforeEach(() => {
      originalAlert = window.alert
      window.alert = jest.fn()
    })

    afterEach(() => {
      window.alert = originalAlert
    })

    it('should call alert on catch phase', () => {
      const policy = new AlertErrorPolicy()
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

      policy.handleSituation(situation)

      expect(window.alert).toHaveBeenCalledWith(
        expect.stringContaining('에러가 발생했습니다')
      )
    })

    it('should not call alert on other phases when onlyOnCatch is true', () => {
      const policy = new AlertErrorPolicy({ onlyOnCatch: true })
      const situation: ErrorSituation = {
        error: new Error('Test error'),
        context: {
          nodeId: 'test-node',
          componentName: 'TestComponent',
          timestamp: Date.now(),
        },
        lifecycle: {
          phase: 'mount',
          currentState: {
            hasError: false,
            error: null,
          },
        },
      }

      policy.handleSituation(situation)

      expect(window.alert).not.toHaveBeenCalled()
    })

    it('should use custom formatMessage when provided', () => {
      const customFormat = jest.fn().mockReturnValue('Custom message')
      const policy = new AlertErrorPolicy({
        formatMessage: customFormat,
      })
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

      policy.handleSituation(situation)

      expect(customFormat).toHaveBeenCalledWith(situation)
      expect(window.alert).toHaveBeenCalledWith('Custom message')
    })
  })
})
