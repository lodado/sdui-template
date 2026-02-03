'use client'

/**
 * SDUI Render Node Hook
 *
 * Hook that creates the renderNode function for the Render Props Pattern.
 * Subscribes to node changes using useSyncExternalStore.
 * Automatically computes and returns the current node info and currentPath.
 */

import React, { useCallback, useMemo } from 'react'

import { defaultComponentFactory } from '../../components/defaultComponentFactory'
import type { ComponentFactory, ParentPath, RenderNodeFn } from '../../components/types'
import { buildCurrentPath, buildCurrentPathArray } from '../../utils/parentPath'
import { useSduiLayoutContext } from '../context'

/**
 * useRenderNode hook parameter types
 */
export interface UseRenderNodeParams {
  /** Current node ID */
  nodeId: string
  /** Base component map (optional) */
  componentMap?: Record<string, ComponentFactory>
  /** Parent node ID path (default: []) */
  parentPath?: ParentPath
}

/**
 * useRenderNode hook return types
 */
export interface UseRenderNodeReturn {
  /** Function to render a child node */
  renderNode: RenderNodeFn
  /** Function to convert child node IDs into a React children array */
  renderChildren: (childrenIds: string[]) => React.ReactNode[]
  /** Path array to the current node (auto-calculated) */
  currentPath: ParentPath
  /** Path string to the current node (auto-calculated) */
  pathString: string
  /** Current node ID */
  nodeId: string
  /** Parent node ID path */
  parentPath: ParentPath
}

/**
 * Hook that creates the renderNode function.
 *
 * Subscribes to node changes using useSyncExternalStore,
 * and auto re-renders on changes.
 * Automatically computes and returns current node info and currentPath.
 *
 * @param params - Parameter object that includes node info
 * @param params.nodeId - Current node ID
 * @param params.componentMap - Base component map (optional)
 * @param params.parentPath - Parent node ID path (default: [])
 * @returns Object containing node info and rendering functions
 */
export const useRenderNode = ({ nodeId, componentMap, parentPath = [] }: UseRenderNodeParams): UseRenderNodeReturn => {
  const { store } = useSduiLayoutContext()

  // Re-read nodes when the lastModified object reference changes
  // useSyncExternalStore re-renders when it detects lastModified reference changes
  const { nodes } = store.state

  // Automatically compute currentPath and pathString
  const currentPath = useMemo(() => buildCurrentPathArray(parentPath, nodeId), [parentPath, nodeId])
  const pathString = useMemo(() => buildCurrentPath(parentPath, nodeId), [parentPath, nodeId])

  /**
   * Node rendering function (Render Props).
   *
   * Renders the component that matches the node type for the given ID.
   * Priority: byNodeId[id] > byNodeType[node.type] > componentMap[node.type] > defaultComponentFactory
   * parentPath is the parent node ID path for debugging.
   */
  const renderNode: RenderNodeFn = useCallback(
    (id: string, parentPathForChild: ParentPath = []) => {
      const node = nodes[id]
      if (!node) return null

      const overrides = store.getComponentOverrides()
      const componentMapEntries = componentMap || {}

      // Select factory based on priority
      // 1. ID-based override (highest priority)
      // 2. Type-based override (store componentOverrides)
      // 3. Type-based mapping in componentMap
      // 4. Default factory
      const factory = overrides[id] || overrides[node.type] || componentMapEntries[node.type] || defaultComponentFactory

      // Pass the current node's parentPath to the factory
      // Components can render child nodes using the useRenderNode hook
      return factory(id, parentPathForChild)
    },
    [nodes, store, componentMap],
  )

  /**
   * Convert child node IDs into a React children array.
   *
   * @param childrenIds - Array of child node IDs
   * @returns React children array (each element includes a key)
   */
  const renderChildren = useCallback(
    (childrenIds: string[]): React.ReactNode[] => {
      return childrenIds.map((childId) => {
        const child = renderNode(childId, currentPath)
        return React.isValidElement(child) ? React.cloneElement(child, { key: childId }) : child
      })
    },
    [renderNode, currentPath],
  )

  return {
    renderNode,
    renderChildren,
    currentPath,
    pathString,
    nodeId,
    parentPath,
  }
}
