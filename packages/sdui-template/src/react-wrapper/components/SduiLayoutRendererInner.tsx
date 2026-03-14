'use client'

/**
 * SduiLayoutRenderer internal component.
 *
 * Uses the useRenderNode hook to create the renderNode function and
 * injects it into child components.
 * Each component renders its children through this function.
 *
 * @internal Exported for testing only. Use SduiLayoutRenderer for public API.
 */

import type { ComponentFactory } from '../../components/types'
import { useRenderNode } from '../hooks'

export const SduiLayoutRendererInner = ({
  id,
  componentMap: customComponentMap,
}: {
  id: string
  componentMap?: Record<string, ComponentFactory>
}) => {
  const { renderNode } = useRenderNode({ nodeId: id, componentMap: customComponentMap, parentPath: [] })
  return renderNode(id, [])
}
