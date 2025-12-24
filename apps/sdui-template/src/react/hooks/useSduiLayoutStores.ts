"use client";

/**
 * useSduiLayoutStores
 *
 * Store 상태를 선택적으로 가져옵니다.
 * selector 함수를 통해 필요한 상태만 선택할 수 있습니다.
 * version을 구독하여 상태 변경을 감지합니다.
 *
 * @param selector - 상태 선택 함수
 * @returns 선택된 상태
 *
 * @example
 * ```tsx
 * const { rootId, nodes } = useSduiLayoutStores(
 *   (state) => ({ rootId: state.rootId, nodes: state.nodes })
 * );
 * ```
 */

import { useEffect, useMemo, useReducer } from "react";

import { useSduiLayoutContext } from "../context";
import type { SduiLayoutStoreState } from "../../store";

export function useSduiLayoutStores<T>(
  selector: (state: SduiLayoutStoreState) => T
): T {
  const { store } = useSduiLayoutContext();
  const [, forceRender] = useReducer((x: number) => x + 1, 0);

  // version을 구독하여 상태 변경 감지
  useEffect(() => {
    const unsubscribe = store.subscribeVersion(forceRender);
    return unsubscribe;
  }, [store]);

  // Store에서 직접 상태 조회
  const { state } = store;
  return useMemo(() => selector(state), [state, selector]);
}


