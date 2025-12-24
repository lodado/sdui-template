/**
 * Server-Driven UI - Component System Types
 *
 * 컴포넌트 팩토리 및 렌더링 함수 타입 정의
 */

import type { ReactNode } from "react";

/**
 * 자식 노드 렌더링 함수 타입 (Render Props)
 *
 * 상위에서 주입되어 자식 노드를 렌더링할 때 사용합니다.
 */
export type RenderNodeFn = (childId: string) => ReactNode;

/**
 * 컴포넌트 팩토리 타입
 *
 * id, renderNode를 받아서 컴포넌트를 렌더링합니다.
 */
export type ComponentFactory = (
  id: string,
  renderNode: RenderNodeFn
) => ReactNode;


