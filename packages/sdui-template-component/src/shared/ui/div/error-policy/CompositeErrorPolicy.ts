import type { ErrorPolicy, ErrorSituation } from './types'

/**
 * Composite Error Policy Options
 */
export interface CompositeErrorPolicyOptions {
  /** Execution mode: sequential or parallel */
  execution?: 'sequential' | 'parallel'
  /** Whether to stop on error */
  stopOnError?: boolean
}

/**
 * Composite Error Policy
 * Policy that executes multiple policies together.
 */
export class CompositeErrorPolicy implements ErrorPolicy {
  constructor(
    private policies: ErrorPolicy[],
    private options: CompositeErrorPolicyOptions = {}
  ) {
    this.options = {
      execution: 'sequential',
      stopOnError: false,
      ...options,
    }
  }

  async handleSituation(situation: ErrorSituation): Promise<void> {
    if (this.policies.length === 0) {
      return
    }

    if (this.options.execution === 'parallel') {
      await Promise.allSettled(
        this.policies.map(policy => this.executePolicy(policy, situation))
      )
    } else {

      for (let i = 0; i < this.policies.length; i+=1) {
        const policy = this.policies[i]
        // eslint-disable-next-line no-await-in-loop
        await this.executePolicy(policy, situation)
      }
    }
  }

  private async executePolicy(
    policy: ErrorPolicy,
    situation: ErrorSituation
  ): Promise<void> {
    try {
      await policy.handleSituation(situation)
    } catch (err) {
      if (this.options.stopOnError) {
        throw err
      }
      // Continue executing other policies even if one fails
      // eslint-disable-next-line no-console
      console.error('Error in policy handler:', err)
    }
  }
}
