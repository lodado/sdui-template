'use client'

/**
 * SDUI Node Subscription Hook
 *
 * useSyncExternalStore 기반 구독 시스템을 사용하여 특정 노드의 변경을 감지하고
 * 리렌더링을 트리거합니다. tearing 문제를 방지하기 위해 내부적으로
 * useSduiNodeSubscriptionSync를 사용합니다.
 *
 * @description
 * - useSyncExternalStore를 사용하여 React 18+ concurrent rendering에서 tearing 방지
 * - nodes, variables: version 구독으로 변경 감지
 * - layoutStates/layoutAttributes: 노드별 구독으로 변경 감지
 * - 타임스탬프 기반 스냅샷 비교로 효율적인 리렌더링
 */

import type { z, ZodSchema } from 'zod'

import type { SduiLayoutNode } from '../../schema'
import { useSduiNodeSubscriptionSync } from './useSduiNodeSubscriptionSync'

/**
 * useSduiNodeSubscription 파라미터 타입
 */
export interface UseSduiNodeSubscriptionParams<
  TSchema extends ZodSchema<Record<string, unknown>> = ZodSchema<Record<string, unknown>>,
> {
  /** 구독할 노드 ID */
  nodeId: string
  /** Zod 스키마 (선택적). state를 검증하고, 실패 시 에러를 throw합니다. 성공 시 state는 스키마에서 추론된 타입으로 보장됩니다. */
  schema?: TSchema
}

/**
 * 특정 노드 ID를 구독하고 변경 시 리렌더링을 트리거합니다.
 *
 * 내부적으로 useSyncExternalStore를 사용하여 tearing 문제를 방지합니다.
 *
 * - nodes, variables: version 구독으로 변경 감지
 * - layoutStates: 노드별 구독으로 변경 감지
 *
 * @template TSchema - Zod 스키마 타입. 스키마에서 타입을 추론합니다.
 * @param params - 구독 파라미터 객체
 *   - `nodeId`: 구독할 노드 ID
 *   - `schema`: Zod 스키마 (선택적). state를 검증하고, 실패 시 에러를 throw합니다. 성공 시 state는 스키마에서 추론된 타입으로 보장됩니다.
 * @returns 노드 정보 객체
 *   - `node`: 노드 엔티티 (SduiLayoutNode | undefined)
 *   - `type`: 노드 타입 (string | undefined)
 *   - `state`: 레이아웃 상태 (스키마가 제공되면 z.infer<TSchema>, 아니면 Record<string, unknown>)
 *   - `childrenIds`: 자식 노드 ID 배열 (string[])
 *   - `attributes`: 노드 속성 (Record<string, unknown> | undefined)
 *   - `reference`: 노드 참조 (string | string[] | undefined)
 *   - `exists`: 노드 존재 여부 (boolean)
 *
 * @example
 * ```tsx
 * const { node, state } = useSduiNodeSubscription({
 *   nodeId: 'node-1',
 *   schema: baseLayoutStateSchema, // optional
 * });
 * ```
 */
export function useSduiNodeSubscription<
  TSchema extends ZodSchema<Record<string, unknown>> = ZodSchema<Record<string, unknown>>,
>(
  params: UseSduiNodeSubscriptionParams<TSchema>,
): {
  node: SduiLayoutNode | undefined
  type: string | undefined
  state: TSchema extends ZodSchema<any> ? z.infer<TSchema> : Record<string, unknown>
  childrenIds: string[]
  attributes: Record<string, unknown> | undefined
  reference: string | string[] | undefined
  exists: boolean
} {
  // useSyncExternalStore 기반 구독으로 위임
  return useSduiNodeSubscriptionSync(params)
}
