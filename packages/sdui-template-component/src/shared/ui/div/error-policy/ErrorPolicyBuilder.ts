import type { CompositeErrorPolicyOptions } from './CompositeErrorPolicy'
import { CompositeErrorPolicy } from './CompositeErrorPolicy'
import type { ErrorPolicy } from './types'

/**
 * Error Policy Builder
 * Builder that registers multiple policies in a chained manner.
 */
export class ErrorPolicyBuilder {
  private policies: ErrorPolicy[] = []
  private options: CompositeErrorPolicyOptions = {}

  /**
   * Add a policy.
   * @param policy - Policy to add (ignores null/undefined)
   * @returns this (for chaining)
   */
  add(policy: ErrorPolicy | null | undefined): this {
    if (policy) {
      this.policies.push(policy)
    }
    return this
  }

  /**
   * Conditionally add a policy.
   * @param condition - Condition to add
   * @param policy - Policy to add or policy factory
   * @returns this (for chaining)
   */
  addIf(
    condition: boolean,
    policy: ErrorPolicy | (() => ErrorPolicy)
  ): this {
    if (condition) {
      const policyInstance =
        typeof policy === 'function' ? policy() : policy
      this.policies.push(policyInstance)
    }
    return this
  }

  /**
   * Add multiple policies at once.
   * @param policies - Array of policies to add
   * @returns this (for chaining)
   */
  addMany(...policies: (ErrorPolicy | null | undefined)[]): this {
    policies.forEach(policy => this.add(policy))
    return this
  }

  /**
   * Set composite policy options.
   * @param options - Options
   * @returns this (for chaining)
   */
  withOptions(options: CompositeErrorPolicyOptions): this {
    this.options = { ...this.options, ...options }
    return this
  }

  /**
   * Combine registered policies into the final policy.
   * @returns Final policy or null (when no policies exist)
   */
  build(): ErrorPolicy | null {
    if (this.policies.length === 0) {
      return null
    }
    if (this.policies.length === 1) {
      return this.policies[0]
    }
    return new CompositeErrorPolicy(this.policies, this.options)
  }
}

/**
 * Error policy creation helper
 */
export const createErrorPolicy = {
  /**
   * Create a new builder instance.
   */
  builder: () => new ErrorPolicyBuilder(),

  /**
   * Chain multiple policies into a single policy.
   * @param policies - Array of policies to combine
   * @returns Final policy or null
   */
  chain: (...policies: ErrorPolicy[]): ErrorPolicy | null => {
    const builder = new ErrorPolicyBuilder()
    builder.addMany(...policies)
    return builder.build()
  },
}
