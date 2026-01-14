/**
 * Parent Path Utilities
 *
 * 부모 노드 ID 경로를 다루는 유틸리티 함수들
 */

import type { ParentPath } from '../components/types'

/**
 * ParentPath를 문자열로 변환하는 헬퍼 함수
 *
 * 디버깅을 위해 경로를 읽기 쉬운 문자열 형식으로 변환합니다.
 * 예: ['root', 'container-1', 'button-1'] → 'root > container-1 > button-1'
 *
 * @param path - 부모 노드 ID 경로
 * @param separator - 구분자 (기본값: ' > ')
 * @returns 경로 문자열
 *
 * @example
 * ```tsx
 * const pathString = formatParentPath(['root', 'container-1', 'button-1'])
 * // 'root > container-1 > button-1'
 * ```
 */
export function formatParentPath(path: ParentPath, separator: string = ' > '): string {
  return path.join(separator)
}

/**
 * parentPath와 nodeId를 받아 현재 경로 배열을 생성하는 헬퍼 함수
 *
 * renderNode에 전달할 수 있는 ParentPath 배열을 생성합니다.
 * 예: buildCurrentPathArray(['root', 'container-1'], 'button-1') → ['root', 'container-1', 'button-1']
 *
 * @param parentPath - 부모 노드 ID 경로
 * @param nodeId - 현재 노드 ID
 * @returns 현재 노드까지의 경로 배열 (ParentPath)
 *
 * @example
 * ```tsx
 * const currentPath = buildCurrentPathArray(['root', 'container-1'], 'button-1')
 * renderNode(childId, currentPath)
 * ```
 */
export function buildCurrentPathArray(parentPath: ParentPath, nodeId: string): ParentPath {
  return [...parentPath, nodeId]
}

/**
 * parentPath와 nodeId를 받아 현재 경로 문자열을 생성하는 헬퍼 함수
 *
 * 디버깅을 위해 현재 노드까지의 전체 경로를 읽기 쉬운 문자열 형식으로 변환합니다.
 * 예: buildCurrentPath(['root', 'container-1'], 'button-1') → 'root > container-1 > button-1'
 *
 * @param parentPath - 부모 노드 ID 경로
 * @param nodeId - 현재 노드 ID
 * @param separator - 구분자 (기본값: ' > ')
 * @returns 현재 노드까지의 경로 문자열
 *
 * @example
 * ```tsx
 * const pathString = buildCurrentPath(['root', 'container-1'], 'button-1')
 * // 'root > container-1 > button-1'
 * ```
 */
export function buildCurrentPath(parentPath: ParentPath, nodeId: string, separator: string = ' > '): string {
  const currentPath = buildCurrentPathArray(parentPath, nodeId)
  return formatParentPath(currentPath, separator)
}
