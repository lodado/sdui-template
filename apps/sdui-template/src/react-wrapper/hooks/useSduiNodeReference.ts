'use client'

/**
 * SDUI Node Reference Hook
 *
 * reference 필드를 통해 참조된 노드들의 정보를 쉽게 접근할 수 있게 하는 hook입니다.
 * 참조된 노드들의 변경사항도 자동으로 구독하여 리렌더링을 트리거합니다.
 *
 * @description
 * - reference가 string이면 단일 노드, string[]이면 다중 노드 참조
 * - 참조된 노드들의 state, attributes 등을 배열과 Map으로 반환
 * - 참조된 노드들의 변경사항도 자동으로 구독
 * - ID로 직접 접근: referencedNodesMap[id]
 * - 순회: referencedNodes.forEach(...)
 */

import { useEffect, useMemo, useReducer } from 'react'
import type { z, ZodSchema } from 'zod'

import type { SduiLayoutNode } from '../../schema'
import { useSduiLayoutAction } from './useSduiLayoutAction'
import { useSduiNodeSubscription } from './useSduiNodeSubscription'

/**
 * 참조된 노드 정보 타입
 */
export interface ReferencedNodeInfo {
  /** 노드 ID */
  id: string
  /** 노드 엔티티 */
  node: SduiLayoutNode | undefined
  /** 노드 타입 */
  type: string | undefined
  /** 노드 상태 */
  state: Record<string, unknown>
  /** 노드 속성 */
  attributes: Record<string, unknown> | undefined
  /** 노드 존재 여부 */
  exists: boolean
}

/**
 * useSduiNodeReference 파라미터 타입
 */
export interface UseSduiNodeReferenceParams<
  TSchema extends ZodSchema<Record<string, unknown>> = ZodSchema<Record<string, unknown>>,
> {
  /** 참조를 가진 노드 ID */
  nodeId: string
  /** 참조된 노드의 state를 검증할 Zod 스키마 (선택적) */
  schema?: TSchema
}

/**
 * 여러 노드 ID에 대해 구독 및 정보를 수집하는 헬퍼 hook
 *
 * @template TSchema - Zod 스키마 타입
 * @param nodeIds - 구독할 노드 ID 배열
 * @param schema - Zod 스키마 (선택적)
 * @returns 각 노드에 대한 구독 결과 배열
 */
function useMultipleNodeSubscriptions<
  TSchema extends ZodSchema<Record<string, unknown>> = ZodSchema<Record<string, unknown>>,
>(nodeIds: string[], schema?: TSchema): Array<ReturnType<typeof useSduiNodeSubscription<TSchema>>> {
  const store = useSduiLayoutAction()
  const [renderKey, forceRender] = useReducer((x: number) => x + 1, 0)

  // 모든 참조된 노드에 대해 구독 설정
  useEffect(() => {
    const unsubscribes = nodeIds.map((refId) => store.subscribeNode(refId, forceRender))
    return () => {
      unsubscribes.forEach((unsubscribe) => unsubscribe())
    }
  }, [store, nodeIds, forceRender])

  // 각 노드의 정보 수집
  // renderKey를 의존성에 추가하여 forceRender 호출 시 재계산되도록 함
  return useMemo(() => {
    return nodeIds.map((refId) => {
      const node = store.getNodeById(refId)
      const state = store.getLayoutStateById(refId)
      const attributes = store.getAttributesById(refId)
      const reference = store.getReferenceById(refId)
      const childrenIds = (node as any)?.childrenIds || []

      // 스키마가 있으면 검증
      let validatedState: Record<string, unknown>
      if (schema) {
        const result = schema.safeParse(state)
        if (!result.success) {
          throw new Error(`State validation failed for referenced node "${refId}": ${result.error.message}`)
        }
        validatedState = result.data
      } else {
        validatedState = state
      }

      return {
        node,
        type: node?.type,
        state: validatedState,
        childrenIds,
        attributes,
        reference,
        exists: !!node,
      }
    })
  }, [nodeIds, store, schema, renderKey]) as Array<ReturnType<typeof useSduiNodeSubscription<TSchema>>>
}

/**
 * reference 필드를 통해 참조된 노드들의 정보를 반환하는 hook
 *
 * @template TSchema - Zod 스키마 타입. 참조된 노드들의 state를 검증합니다.
 * @param params - 파라미터 객체
 *   - `nodeId`: 참조를 가진 노드 ID
 *   - `schema`: Zod 스키마 (선택적). 참조된 노드들의 state를 검증합니다.
 * @returns 참조된 노드 정보
 *   - `referencedNodes`: 참조된 노드 정보 배열 (순회용)
 *   - `referencedNodesMap`: 참조된 노드 정보 맵 (ID로 직접 접근용)
 *   - `reference`: 원본 reference 값 (string | string[] | undefined)
 *   - `hasReference`: reference가 있는지 여부 (boolean)
 *
 * @example
 * ```tsx
 * // ID로 직접 접근
 * const { referencedNodesMap } = useSduiNodeReference({ nodeId: 'source-node' })
 * const targetNode = referencedNodesMap['target-node-id']
 *
 * // 배열로 순회
 * const { referencedNodes } = useSduiNodeReference({
 *   nodeId: 'source-node',
 *   schema: cardStateSchema // optional
 * })
 * referencedNodes.forEach(node => {
 *   console.log(node.state.title)
 * })
 * ```
 */
export function useSduiNodeReference<
  TSchema extends ZodSchema<Record<string, unknown>> = ZodSchema<Record<string, unknown>>,
>(
  params: UseSduiNodeReferenceParams<TSchema>,
): {
  referencedNodes: Array<
    ReferencedNodeInfo & { state: TSchema extends ZodSchema<any> ? z.infer<TSchema> : Record<string, unknown> }
  >
  referencedNodesMap: Record<
    string,
    ReferencedNodeInfo & { state: TSchema extends ZodSchema<any> ? z.infer<TSchema> : Record<string, unknown> }
  >
  reference: string | string[] | undefined
  hasReference: boolean
} {
  const { nodeId, schema } = params

  // 현재 노드의 reference 가져오기
  const { reference } = useSduiNodeSubscription({ nodeId })

  // 참조된 노드 ID 배열로 변환
  const referencedIds = useMemo(() => {
    if (!reference) return []
    return Array.isArray(reference) ? reference : [reference]
  }, [reference])

  // 각 참조된 노드에 대해 구독 및 정보 수집 (헬퍼 함수 사용)
  const referencedSubscriptions = useMultipleNodeSubscriptions<TSchema>(referencedIds, schema)

  // 참조된 노드들의 정보를 ReferencedNodeInfo 형태로 변환
  const referencedNodes = useMemo(() => {
    return referencedSubscriptions.map((sub, index) => {
      const refId = referencedIds[index]
      return {
        id: refId,
        node: sub.node,
        type: sub.type,
        state: sub.state,
        attributes: sub.attributes,
        exists: sub.exists,
      }
    })
  }, [referencedSubscriptions, referencedIds]) as Array<
    ReferencedNodeInfo & { state: TSchema extends ZodSchema<any> ? z.infer<TSchema> : Record<string, unknown> }
  >

  // ID로 바로 접근할 수 있는 Map 생성
  const referencedNodesMap = useMemo(() => {
    const map: Record<
      string,
      ReferencedNodeInfo & { state: TSchema extends ZodSchema<any> ? z.infer<TSchema> : Record<string, unknown> }
    > = {}
    referencedNodes.forEach((node) => {
      map[node.id] = node
    })
    return map
  }, [referencedNodes])

  return {
    referencedNodes,
    referencedNodesMap,
    reference,
    hasReference: referencedIds.length > 0,
  }
}
