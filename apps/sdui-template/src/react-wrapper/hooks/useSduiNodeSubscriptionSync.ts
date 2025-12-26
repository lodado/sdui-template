'use client'

/**
 * SDUI Node Subscription Sync Hook
 *
 * useSyncExternalStore를 사용하여 tearing 문제를 방지하는 구독 시스템입니다.
 * 타임스탬프 기반 스냅샷 비교를 통해 효율적인 리렌더링을 제공합니다.
 *
 * @description
 * - useSyncExternalStore를 사용하여 React 18+ concurrent rendering에서 tearing 방지
 * - lastModified 타임스탬프를 기반으로 스냅샷 비교
 * - nodes, variables: version 구독으로 변경 감지
 * - layoutStates/layoutAttributes: 노드별 구독으로 변경 감지
 */

import React, { useSyncExternalStore } from 'react'
import type { z, ZodSchema } from 'zod'

import type { SduiLayoutNode } from '../../schema'
import type { SduiLayoutStore } from '../../store/SduiLayoutStore'
import { useSduiLayoutAction } from './useSduiLayoutAction'

/**
 * useSduiNodeSubscriptionSync 파라미터 타입
 */
export interface UseSduiNodeSubscriptionSyncParams<
  TSchema extends ZodSchema<Record<string, unknown>> = ZodSchema<Record<string, unknown>>,
> {
  /** 구독할 노드 ID */
  nodeId: string
  /** Zod 스키마 (선택적). state를 검증하고, 실패 시 에러를 throw합니다. 성공 시 state는 스키마에서 추론된 타입으로 보장됩니다. */
  schema?: TSchema
}

/**
 * 특정 노드 ID를 구독하고 변경 시 리렌더링을 트리거합니다.
 * useSyncExternalStore를 사용하여 tearing 문제를 방지합니다.
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
 * const { node, state } = useSduiNodeSubscriptionSync({
 *   nodeId: 'node-1',
 *   schema: baseLayoutStateSchema, // optional
 * });
 * ```
 */
export function useSduiNodeSubscriptionSync<
  TSchema extends ZodSchema<Record<string, unknown>> = ZodSchema<Record<string, unknown>>,
>(
  params: UseSduiNodeSubscriptionSyncParams<TSchema>,
): {
  node: SduiLayoutNode | undefined
  type: string | undefined
  state: TSchema extends ZodSchema<any> ? z.infer<TSchema> : Record<string, unknown>
  childrenIds: string[]
  attributes: Record<string, unknown> | undefined
  reference: string | string[] | undefined
  exists: boolean
} {
  const { nodeId, schema } = params
  const store = useSduiLayoutAction()

  // useSyncExternalStore를 사용하여 구독 및 스냅샷 선택
  // 해당 노드의 lastModified 값만 비교하여 효율적인 변경 감지
  const lastModifiedCacheRef = React.useRef<string | null>(null)

  const lastModifiedValue = useSyncExternalStore<string>(
    // subscribe 함수: 노드 변경 및 version 변경 모두 구독
    (onStoreChange) => {
      // 노드별 구독 (layoutStates/layoutAttributes 변경 감지)
      const unsubscribeNode = store.subscribeNode(nodeId, onStoreChange)
      // version 구독 (nodes, rootId, variables 변경 감지)
      const unsubscribeVersion = store.subscribeVersion(onStoreChange)

      // 두 구독 모두 해제하는 함수 반환
      return () => {
        unsubscribeNode()
        unsubscribeVersion()
      }
    },
    // getSnapshot 함수: 해당 노드의 lastModified 값만 반환 (비교용)
    () => {
      const lastModifiedSnapshot = store.getSnapshot()
      const value = lastModifiedSnapshot[nodeId] || 'none'

      // 값이 같으면 같은 문자열 참조 반환 (캐싱)
      if (lastModifiedCacheRef.current === value) {
        return lastModifiedCacheRef.current
      }

      lastModifiedCacheRef.current = value
      return value
    },
    // getServerSnapshot 함수: SSR 시 스냅샷 반환
    () => {
      const lastModifiedSnapshot = store.getServerSnapshot()
      return lastModifiedSnapshot[nodeId] || 'none'
    },
  )

  // lastModified 객체 참조가 변경되면 리렌더링되므로, 이 시점에 store.state에서 직접 읽기
  const { nodes } = store.state
  const node = nodes[nodeId]
  const childrenIds = (node as any)?.childrenIds || []
  const rawState = node?.state || {}
  const attributes = node?.attributes
  const reference = node?.reference

  // 스키마 검증
  let validatedState: Record<string, unknown>
  if (schema) {
    if (!rawState || Object.keys(rawState).length === 0) {
      throw new Error(`State not found for node "${nodeId}". Schema was provided but state is missing.`)
    }

    const result = schema.safeParse(rawState)
    if (!result.success) {
      throw new Error(`State validation failed for node "${nodeId}": ${result.error.message}`)
    }

    validatedState = result.data
  } else {
    validatedState = rawState
  }

  return {
    node,
    type: node?.type,
    state: validatedState as TSchema extends ZodSchema<any> ? z.infer<TSchema> : Record<string, unknown>,
    childrenIds,
    attributes,
    reference,
    exists: !!node,
  }
}
