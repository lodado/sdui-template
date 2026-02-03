/**
 * Parent Path Utilities
 *
 * Utility functions for working with parent node ID paths.
 */

import type { ParentPath } from '../components/types'

/**
 * Helper function to convert ParentPath to a string.
 *
 * Converts a path into a readable string for debugging.
 * Example: ['root', 'container-1', 'button-1'] → 'root > container-1 > button-1'
 *
 * @param path - Parent node ID path
 * @param separator - Separator (default: ' > ')
 * @returns Path string
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
 * Helper function to build the current path array from parentPath and nodeId.
 *
 * Creates a ParentPath array that can be passed to renderNode.
 * Example: buildCurrentPathArray(['root', 'container-1'], 'button-1') → ['root', 'container-1', 'button-1']
 *
 * @param parentPath - Parent node ID path
 * @param nodeId - Current node ID
 * @returns Path array to the current node (ParentPath)
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
 * Helper function to build the current path string from parentPath and nodeId.
 *
 * Converts the full path to the current node into a readable string for debugging.
 * Example: buildCurrentPath(['root', 'container-1'], 'button-1') → 'root > container-1 > button-1'
 *
 * @param parentPath - Parent node ID path
 * @param nodeId - Current node ID
 * @param separator - Separator (default: ' > ')
 * @returns Path string to the current node
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
