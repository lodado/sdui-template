'use client'

/**
 * SDUI Node Subscription Hook
 *
 * ID 기반 구독 시스템을 사용하여 특정 노드의 layoutState 변경을 감지하고
 * forceRender를 트리거합니다.
 *
 * @description
 * - nodes, variables: version 구독으로 변경 감지
 * - layoutStates/layoutAttributes: 노드별 구독으로 변경 감지
 */

import { useEffect, useMemo, useReducer } from 'react'
import type { ZodSchema, z } from 'zod'

import { useSduiLayoutAction } from './useSduiLayoutAction'
import type { BaseLayoutState, SduiLayoutNode } from '../../schema'

/**
 * forceRender를 위한 reducer
 */
const forceRenderReducer = (x: number): number => x + 1

/**
 * useSduiNodeSubscription 파라미터 타입
 */
export interface UseSduiNodeSubscriptionParams<
  TSchema extends ZodSchema<BaseLayoutState> = ZodSchema<BaseLayoutState>,
> {
  /** 구독할 노드 ID */
  nodeId: string
  /** Zod 스키마 (선택적). state를 검증하고, 실패 시 에러를 throw합니다. 성공 시 state는 스키마에서 추론된 타입으로 보장됩니다. */
  schema?: TSchema
}

/**
 * 특정 노드 ID를 구독하고 변경 시 forceRender를 트리거합니다.
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
 *   - `state`: 레이아웃 상태 (스키마가 제공되면 z.infer<TSchema>, 아니면 BaseLayoutState)
 *   - `childrenIds`: 자식 노드 ID 배열 (string[])
 *   - `attributes`: 노드 속성 (Record<string, unknown> | undefined)
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
// Overload for when schema is provided
// If schema is provided and validation passes, state is always defined (never undefined)
// If rawState is missing or validation fails, hook throws error (component won't render)
export function useSduiNodeSubscription<TSchema extends ZodSchema<BaseLayoutState>>(
  params: UseSduiNodeSubscriptionParams<TSchema> & { schema: TSchema },
): {
  node: SduiLayoutNode | undefined
  type: string | undefined
  state: z.infer<TSchema> // Non-nullable: if component renders, state is always defined
  childrenIds: string[]
  attributes: Record<string, unknown> | undefined
  exists: boolean
}
// Overload for when schema is not provided
export function useSduiNodeSubscription(params: UseSduiNodeSubscriptionParams & { schema?: undefined }): {
  node: SduiLayoutNode | undefined
  type: string | undefined
  state: BaseLayoutState | undefined
  childrenIds: string[]
  attributes: Record<string, unknown> | undefined
  exists: boolean
}
// Implementation
export function useSduiNodeSubscription<TSchema extends ZodSchema<BaseLayoutState> = ZodSchema<BaseLayoutState>>(
  params: UseSduiNodeSubscriptionParams<TSchema>,
): {
  node: SduiLayoutNode | undefined
  type: string | undefined
  state: TSchema extends ZodSchema<any> ? z.infer<TSchema> | undefined : BaseLayoutState | undefined
  childrenIds: string[]
  attributes: Record<string, unknown> | undefined
  exists: boolean
} {
  const { nodeId, schema } = params
  // forceRender를 위한 state (layoutStates 및 nodes/variables 변경 감지용)
  const [, forceRender] = useReducer(forceRenderReducer, 0)

  // Store 인스턴스 가져오기
  const store = useSduiLayoutAction()

  // layoutStates 변경 구독 (구독 시스템)
  useEffect(() => {
    const unsubscribe = store.subscribeNode(nodeId, () => {
      console.log('useSduiNodeSubscription', nodeId)

      forceRender()
    })

    return unsubscribe
  }, [store, nodeId])

  // Store에서 직접 노드 정보 가져오기
  const node = store.getNodeById(nodeId)
  const childrenIds = (node as any)?.childrenIds || []

  // layoutStates/layoutAttributes는 store에서 직접 접근 (일반 변수)
  const rawState = store.getLayoutStateById(nodeId)
  const attributes = store.getAttributesById(nodeId)

  // 스키마가 있으면 검증
  const validatedState = useMemo(() => {
    if (!schema) {
      // 스키마가 없으면 rawState 반환 (없을 수 있음)
      return rawState
    }

    // 스키마가 제공되면 rawState가 없으면 throw
    if (!rawState) {
      throw new Error(`State not found for node "${nodeId}". Schema was provided but state is missing.`)
    }

    // 스키마 검증 실패 시 throw
    const result = schema.safeParse(rawState)
    if (!result.success) {
      throw new Error(`State validation failed for node "${nodeId}": ${result.error.message}`)
    }

    // 검증 성공 시 항상 정의된 데이터 반환
    return result.data
  }, [rawState, schema, nodeId]) as TSchema extends ZodSchema<any>
    ? z.infer<TSchema> | undefined
    : BaseLayoutState | undefined

  return {
    node,
    type: node?.type,
    state: validatedState,
    childrenIds,
    attributes,
    exists: !!node,
  }
}
