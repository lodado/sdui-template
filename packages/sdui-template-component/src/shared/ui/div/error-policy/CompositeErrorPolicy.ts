import type { ErrorPolicy, ErrorSituation } from './types'

/**
 * Composite Error Policy Options
 */
export interface CompositeErrorPolicyOptions {
  /** 실행 방식: 순차 또는 병렬 */
  execution?: 'sequential' | 'parallel'
  /** 에러 발생 시 중단 여부 */
  stopOnError?: boolean
}

/**
 * Composite Error Policy
 * 여러 Policy를 조합하여 실행하는 Policy
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
      // 한 Policy가 실패해도 다른 Policy는 계속 실행
      // eslint-disable-next-line no-console
      console.error('Error in policy handler:', err)
    }
  }
}
