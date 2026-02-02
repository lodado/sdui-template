import type { CompositeErrorPolicyOptions } from './CompositeErrorPolicy'
import { CompositeErrorPolicy } from './CompositeErrorPolicy'
import type { ErrorPolicy } from './types'

/**
 * Error Policy Builder
 * 여러 Policy를 체이닝 방식으로 등록할 수 있는 Builder
 */
export class ErrorPolicyBuilder {
  private policies: ErrorPolicy[] = []
  private options: CompositeErrorPolicyOptions = {}

  /**
   * Policy를 추가합니다.
   * @param policy - 추가할 Policy (null/undefined는 무시)
   * @returns this (체이닝)
   */
  add(policy: ErrorPolicy | null | undefined): this {
    if (policy) {
      this.policies.push(policy)
    }
    return this
  }

  /**
   * 조건부로 Policy를 추가합니다.
   * @param condition - 추가 조건
   * @param policy - 추가할 Policy 또는 Policy 생성 함수
   * @returns this (체이닝)
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
   * 여러 Policy를 한 번에 추가합니다.
   * @param policies - 추가할 Policy 배열
   * @returns this (체이닝)
   */
  addMany(...policies: (ErrorPolicy | null | undefined)[]): this {
    policies.forEach(policy => this.add(policy))
    return this
  }

  /**
   * Composite Policy 옵션을 설정합니다.
   * @param options - 옵션
   * @returns this (체이닝)
   */
  withOptions(options: CompositeErrorPolicyOptions): this {
    this.options = { ...this.options, ...options }
    return this
  }

  /**
   * 등록된 Policy들을 조합하여 최종 Policy를 생성합니다.
   * @returns 최종 Policy 또는 null (Policy가 없는 경우)
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
 * Error Policy 생성 헬퍼 함수
 */
export const createErrorPolicy = {
  /**
   * 새로운 Builder 인스턴스를 생성합니다.
   */
  builder: () => new ErrorPolicyBuilder(),

  /**
   * 여러 Policy를 체이닝하여 하나의 Policy로 만듭니다.
   * @param policies - 조합할 Policy 배열
   * @returns 최종 Policy 또는 null
   */
  chain: (...policies: ErrorPolicy[]): ErrorPolicy | null => {
    const builder = new ErrorPolicyBuilder()
    builder.addMany(...policies)
    return builder.build()
  },
}
