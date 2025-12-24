"use client";

/**
 * useSduiLayoutAction
 *
 * Store 인스턴스를 반환하여 액션을 호출할 수 있게 합니다.
 *
 * @returns Store 인스턴스
 *
 * @example
 * ```tsx
 * const store = useSduiLayoutAction();
 * store.updateNodeState(nodeId, newState);
 * ```
 */

import { useSduiLayoutContext } from "../context";
import type { SduiLayoutStore } from "../../store";

export const useSduiLayoutAction = (): SduiLayoutStore => {
  const { store } = useSduiLayoutContext();
  return store;
};



