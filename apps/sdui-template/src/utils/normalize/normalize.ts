/**
 * SDUI Layout Normalize
 *
 * normalizr를 사용하여 SduiLayoutDocument를 normalize하고
 * id를 통해 조회 가능한 entities로 변환합니다.
 */

import { normalize, schema } from "normalizr";

import type {
  BaseLayoutState,
  SduiLayoutDocument,
  SduiLayoutNode,
} from "../../schema";
import type { NormalizedSduiEntities } from "./types";

// ==================== Schema Definitions ====================

/**
 * LayoutState Schema
 *
 * grid, layout, edit를 포함한 레이아웃 상태를 normalize합니다.
 */
const layoutStateSchema = new schema.Entity<BaseLayoutState>(
  "layoutStates",
  {},
  {
    idAttribute: (_entity, parent: any) => `${parent.id}`,
    processStrategy: (value: BaseLayoutState): BaseLayoutState => {
      return {
        ...value,
      };
    },
  }
);

/**
 * LayoutAttributes Schema
 *
 * attributes를 normalize합니다.
 */
const layoutAttributesSchema = new schema.Entity<Record<string, unknown>>(
  "layoutAttributes",
  {},
  {
    idAttribute: (_entity, parent: any) => `${parent.id}`,
    processStrategy: (
      value: Record<string, unknown>
    ): Record<string, unknown> => {
      return {
        ...value,
      };
    },
  }
);

/**
 * SduiLayoutNode Schema (재귀)
 *
 * children을 재귀적으로 normalize합니다.
 * state와 attributes는 별도 엔티티로 분리합니다.
 */
const sduiLayoutNodeSchema = new schema.Entity<
  Omit<SduiLayoutNode, "state" | "attributes" | "children">
>(
  "nodes",
  {
    // state와 attributes는 별도로 처리하므로 여기서는 정의하지 않음
  },
  {
    idAttribute: "id",
    processStrategy: (
      value: SduiLayoutNode
    ): Omit<SduiLayoutNode, "state" | "attributes" | "children"> => {
      // state와 attributes는 별도 엔티티로 분리되므로 여기서는 제외
      return {
        id: value.id,
        type: value.type,
      };
    },
  }
);

// 재귀 구조를 위해 children 정의 (순환 참조 처리)
sduiLayoutNodeSchema.define({
  children: [sduiLayoutNodeSchema],
});

// ==================== Normalize Functions ====================

/**
 * SduiLayoutNode를 normalize하여 entities로 변환
 *
 * @param node - normalize할 노드
 * @returns normalize된 결과 (entities와 result)
 */
export function normalizeSduiNode(node: SduiLayoutNode) {
  // state와 attributes를 별도로 추출하여 entities에 저장
  const stateEntities: Record<string, BaseLayoutState> = {};
  const attributesEntities: Record<string, Record<string, unknown>> = {};

  // 재귀적으로 모든 노드를 순회하며 state와 attributes 수집
  const collectEntities = (currentNode: SduiLayoutNode) => {
    stateEntities[currentNode.id] = currentNode.state;
    if ((currentNode as any).attributes) {
      attributesEntities[currentNode.id] = (currentNode as any).attributes;
    }

    if (currentNode.children) {
      currentNode.children.forEach(collectEntities);
    }
  };

  collectEntities(node);

  // 노드 구조를 normalize (state와 attributes는 제외하고 normalize)
  const nodeWithoutStateAndAttributes: Omit<
    SduiLayoutNode,
    "state" | "attributes" | "children"
  > = {
    id: node.id,
    type: node.type,
  };

  // children 배열을 별도로 normalize
  const childrenArray = node.children || [];
  const normalizedChildren =
    childrenArray.length > 0
      ? normalize(childrenArray, [sduiLayoutNodeSchema])
      : { result: [], entities: { nodes: {} } };

  const normalizedData = normalize<
    Omit<SduiLayoutNode, "state" | "attributes" | "children">,
    { nodes?: Record<string, any> },
    string
  >(nodeWithoutStateAndAttributes, sduiLayoutNodeSchema);

  // entities에 state와 attributes 추가
  const entities: NormalizedSduiEntities = {
    nodes: {},
    layoutStates: stateEntities,
    layoutAttributes: attributesEntities,
    ...normalizedData.entities,
    ...normalizedChildren.entities,
  };

  // nodes를 올바르게 설정 (childrenIds 포함)
  const collectNodes = (currentNode: SduiLayoutNode) => {
    entities.nodes![currentNode.id] = {
      id: currentNode.id,
      type: currentNode.type,
      // childrenIds를 저장하여 denormalize 시 사용
      childrenIds: currentNode.children?.map((child) => child.id) || [],
    } as any;

    if (currentNode.children) {
      currentNode.children.forEach(collectNodes);
    }
  };

  collectNodes(node);

  return {
    result: normalizedData.result,
    entities,
  };
}

/**
 * SduiLayoutDocument를 normalize
 *
 * @param document - normalize할 문서
 * @returns normalize된 결과
 */
export function normalizeSduiLayout(document: SduiLayoutDocument) {
  const { result, entities } = normalizeSduiNode(document.root);

  return {
    result,
    entities,
  };
}


