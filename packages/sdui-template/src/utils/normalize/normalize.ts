/* eslint-disable no-lonely-if */
/**
 * SDUI Layout Normalize
 *
 * normalizr를 사용하여 SduiLayoutDocument를 normalize하고
 * id를 통해 조회 가능한 entities로 변환합니다.
 */

import { normalize, schema } from 'normalizr'

import type { SduiLayoutDocument, SduiLayoutNode } from '../../schema'
import type { NormalizedSduiEntities } from './types'

// ==================== Schema Definitions ====================

/**
 * SduiLayoutNode Schema (재귀)
 *
 * children을 재귀적으로 normalize합니다.
 * state와 attributes는 노드에 포함됩니다.
 */
const sduiLayoutNodeSchema = new schema.Entity<Omit<SduiLayoutNode, 'children'>>(
  'nodes',
  {},
  {
    idAttribute: 'id',
    processStrategy: (value: SduiLayoutNode): Omit<SduiLayoutNode, 'children'> => {
      return {
        id: value.id,
        type: value.type,
        // state가 없으면 빈 객체로 자동 설정
        state: value.state || {},
        // attributes가 없으면 빈 객체로 자동 설정
        attributes: value.attributes || {},
        // reference는 그대로 전달
        ...(value.reference !== undefined && { reference: value.reference }),
      }
    },
  },
)

// 재귀 구조를 위해 children 정의 (순환 참조 처리)
sduiLayoutNodeSchema.define({
  children: [sduiLayoutNodeSchema],
})

// ==================== Normalize Functions ====================

/**
 * SduiLayoutNode를 normalize하여 entities로 변환
 *
 * @param node - normalize할 노드
 * @returns normalize된 결과 (entities와 result)
 */
export function normalizeSduiNode(node: SduiLayoutNode) {
  // children 배열을 normalize
  const childrenArray = node.children || []
  const normalizedChildren =
    childrenArray.length > 0
      ? normalize(childrenArray, [sduiLayoutNodeSchema])
      : { result: [], entities: { nodes: {} } }

  // 현재 노드를 normalize (state와 attributes 포함)
  const nodeWithoutChildren: Omit<SduiLayoutNode, 'children'> = {
    id: node.id,
    type: node.type,
    // state가 없으면 빈 객체로 자동 설정
    state: node.state || {},
    // attributes가 없으면 빈 객체로 자동 설정
    attributes: node.attributes || {},
    // reference는 그대로 전달
    ...(node.reference !== undefined && { reference: node.reference }),
  }

  const normalizedData = normalize<Omit<SduiLayoutNode, 'children'>, { nodes?: Record<string, any> }, string>(
    nodeWithoutChildren,
    sduiLayoutNodeSchema,
  )

  // entities 병합
  const entities: NormalizedSduiEntities = {
    nodes: {
      ...normalizedData.entities.nodes,
      ...normalizedChildren.entities.nodes,
    },
  }

  // nodes에 childrenIds와 parentId 추가 (재귀적으로 모든 노드 순회)
  const collectNodes = (currentNode: SduiLayoutNode, parentId?: string) => {
    // 현재 노드가 entities에 있으면 childrenIds와 parentId 추가
    if (entities.nodes && entities.nodes[currentNode.id]) {
      entities.nodes[currentNode.id] = {
        ...entities.nodes[currentNode.id],
        childrenIds: currentNode.children?.map((child) => child.id) || [],
        parentId,
      }
    } else {
      // 노드가 entities에 없으면 추가 (이 경우는 발생하지 않아야 하지만 안전장치)
      if (entities.nodes) {
        entities.nodes[currentNode.id] = {
          id: currentNode.id,
          type: currentNode.type,
          // state가 없으면 빈 객체로 자동 설정
          state: currentNode.state || {},
          // attributes가 없으면 빈 객체로 자동 설정
          attributes: currentNode.attributes || {},
          // reference는 그대로 전달
          ...(currentNode.reference !== undefined && { reference: currentNode.reference }),
          childrenIds: currentNode.children?.map((child) => child.id) || [],
          parentId,
        }
      }
    }

    // 자식 노드들도 재귀적으로 처리 (현재 노드 ID를 parentId로 전달)
    if (currentNode.children) {
      currentNode.children.forEach((child) => collectNodes(child, currentNode.id))
    }
  }

  collectNodes(node, undefined) // 루트 노드는 parentId가 undefined

  return {
    result: normalizedData.result,
    entities,
  }
}

/**
 * SduiLayoutDocument를 normalize
 *
 * @param document - normalize할 문서
 * @returns normalize된 결과
 */
export function normalizeSduiLayout(document: SduiLayoutDocument) {
  const { result, entities } = normalizeSduiNode(document.root)

  return {
    result,
    entities,
  }
}
