/**
 * SDUI Layout Denormalize
 *
 * Normalized entities에서 문서를 복원합니다.
 */

import type { SduiLayoutDocument, SduiLayoutNode } from "../../schema";
import type { NormalizedSduiEntities } from "./types";

/**
 * Normalized entities에서 노드를 denormalize
 *
 * @param nodeId - 복원할 노드 ID
 * @param entities - normalize된 entities
 * @returns 복원된 노드
 */
export function denormalizeSduiNode(
  nodeId: string,
  entities: NormalizedSduiEntities
): SduiLayoutNode | null {
  const node = entities.nodes?.[nodeId];
  if (!node) return null;

  const state = entities.layoutStates?.[nodeId];
  const attributes = entities.layoutAttributes?.[nodeId];

  // children을 재귀적으로 복원
  // children 정보는 별도로 저장되어 있지 않으므로, entities.nodes에서 찾아야 함
  // 실제로는 노드 트리를 순회하면서 children을 찾아야 하지만,
  // 여기서는 간단하게 처리하기 위해 노드에 childrenIds를 저장하는 방식 사용
  const childrenIds: string[] = [];

  // entities.nodes를 순회하여 현재 노드를 parent로 가진 노드 찾기
  // 또는 노드에 childrenIds 정보가 있다면 사용
  if ((node as any).childrenIds) {
    childrenIds.push(...(node as any).childrenIds);
  }

  const children = childrenIds
    .map((childId: string) => denormalizeSduiNode(childId, entities))
    .filter((child): child is SduiLayoutNode => child !== null);

  return {
    id: node.id,
    type: node.type,
    state: state!,
    ...(attributes && { attributes }),
    ...(children.length > 0 && { children }),
  };
}

/**
 * Normalized entities에서 전체 문서를 denormalize
 *
 * @param rootId - 루트 노드 ID
 * @param entities - normalize된 entities
 * @param metadata - 문서 메타데이터 (선택적)
 * @returns 복원된 문서
 */
export function denormalizeSduiLayout(
  rootId: string,
  entities: NormalizedSduiEntities,
  metadata?: SduiLayoutDocument["metadata"]
): SduiLayoutDocument | null {
  const rootNode = denormalizeSduiNode(rootId, entities);
  if (!rootNode) return null;

  return {
    version: "1.0.0",
    metadata,
    root: rootNode,
  };
}


