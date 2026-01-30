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

import React, { useMemo, useSyncExternalStore } from 'react'
import type { z, ZodSchema } from 'zod'

import type { SduiLayoutNode } from '../../schema'
import type { SduiLayoutStore } from '../../store/SduiLayoutStore'
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
 * useSyncExternalStore를 사용하여 모든 노드를 한 번에 구독합니다.
 * tearing 문제를 방지합니다.
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

  // 각 노드 ID별 lastModified 값 추출을 위한 캐시
  // nodeIds와 lastModified 값이 같으면 같은 배열 참조 반환
  const lastModifiedCacheRef = React.useRef<{
    nodeIdsKey: string
    values: string[]
  } | null>(null)
  const serverSnapshotCacheRef = React.useRef<{
    nodeIdsKey: string
    values: string[]
  } | null>(null)

  // useSyncExternalStore를 사용하여 모든 노드 구독
  // 각 노드의 lastModified 값만 추출하여 비교
  const lastModifiedValues = useSyncExternalStore(
    // subscribe 함수: 모든 노드와 version 변경 구독
    (onStoreChange) => {
      // 각 노드에 대한 구독
      const unsubscribes = nodeIds.map((nodeId) => store.subscribeNode(nodeId, onStoreChange))
      // version 구독 (nodes 전체 변경 감지)
      const unsubscribeVersion = store.subscribeVersion(onStoreChange)

      return () => {
        unsubscribes.forEach((unsubscribe) => unsubscribe())
        unsubscribeVersion()
      }
    },
    // getSnapshot: 구독한 노드들의 lastModified 값만 추출하여 반환
    () => {
      const lastModifiedSnapshot = store.getSnapshot()
      const values = nodeIds.map((id) => lastModifiedSnapshot[id] || 'none')
      const nodeIdsKey = nodeIds.join(',')

      // 캐시 확인: nodeIds와 값이 같으면 같은 배열 참조 반환
      if (
        lastModifiedCacheRef.current &&
        lastModifiedCacheRef.current.nodeIdsKey === nodeIdsKey &&
        lastModifiedCacheRef.current.values.length === values.length &&
        lastModifiedCacheRef.current.values.every((val, idx) => val === values[idx])
      ) {
        return lastModifiedCacheRef.current.values
      }

      // 새 배열 생성 및 캐시 업데이트
      lastModifiedCacheRef.current = { nodeIdsKey, values }
      return values
    },
    // getServerSnapshot: SSR용 (캐싱하여 무한 루프 방지)
    () => {
      const nodeIdsKey = nodeIds.join(',')
      
      // 서버 스냅샷은 한 번만 계산하고 캐시하여 안정적인 참조 유지
      if (
        serverSnapshotCacheRef.current &&
        serverSnapshotCacheRef.current.nodeIdsKey === nodeIdsKey
      ) {
        return serverSnapshotCacheRef.current.values
      }

      const lastModifiedSnapshot = store.getServerSnapshot()
      const values = nodeIds.map((id) => lastModifiedSnapshot[id] || 'none')
      serverSnapshotCacheRef.current = { nodeIdsKey, values }
      return values
    },
  )

  // lastModified 값들이 변경되면 리렌더링되므로, 이 시점에 store.state에서 직접 읽기
  const { nodes } = store.state

  // 스키마 검증 및 결과 변환
  // lastModified 값들을 문자열로 변환하여 의존성 배열에 사용
  const lastModifiedKeys = useMemo(() => lastModifiedValues.join(':'), [lastModifiedValues])

  return useMemo(() => {
    return nodeIds.map((nodeId) => {
      const node = nodes[nodeId]
      const childrenIds = (node as any)?.childrenIds || []
      const rawState = node?.state || {}
      const attributes = node?.attributes
      const reference = node?.reference

      let validatedState: Record<string, unknown>
      if (schema) {
        const result = schema.safeParse(rawState)
        if (!result.success) {
          throw new Error(`State validation failed for referenced node "${nodeId}": ${result.error.message}`)
        }
        validatedState = result.data
      } else {
        validatedState = rawState
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
    }) as Array<ReturnType<typeof useSduiNodeSubscription<TSchema>>>
  }, [nodeIds, nodes, schema, lastModifiedKeys])
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

  // 참조된 노드들의 정보를 ReferencedNodeInfo 형태로 변환하고 Map도 함께 생성
  const { referencedNodes, referencedNodesMap } = useMemo(() => {
    const nodes = referencedSubscriptions.map((sub, index) => {
      const refId = referencedIds[index]
      return {
        id: refId,
        node: sub.node,
        type: sub.type,
        state: sub.state,
        attributes: sub.attributes,
        exists: sub.exists,
      }
    }) as Array<
      ReferencedNodeInfo & { state: TSchema extends ZodSchema<any> ? z.infer<TSchema> : Record<string, unknown> }
    >

    // ID로 바로 접근할 수 있는 Map 생성 (한 번의 순회로 처리)
    const map: Record<
      string,
      ReferencedNodeInfo & { state: TSchema extends ZodSchema<any> ? z.infer<TSchema> : Record<string, unknown> }
    > = {}
    nodes.forEach((node) => {
      map[node.id] = node
    })

    return { referencedNodes: nodes, referencedNodesMap: map }
  }, [referencedSubscriptions, referencedIds])

  return {
    referencedNodes,
    referencedNodesMap,
    reference,
    hasReference: referencedIds.length > 0,
  }
}
