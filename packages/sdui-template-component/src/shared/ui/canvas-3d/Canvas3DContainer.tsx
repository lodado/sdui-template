'use client'

import { useSduiLayoutAction } from '@lodado/sdui-template'
import { useMemo } from 'react'

import { Canvas3D } from './Canvas3D'
import type { RenderStrategy } from './model/collection'
import { buildCollectionsFromNodes } from './model/nodes-to-collections'

const DEFAULT_WIDTH = 800
const DEFAULT_HEIGHT = 600
const DEFAULT_SCALE = 80

export interface Canvas3DContainerProps {
  id: string
  parentPath?: string[]
  /** Passed via component factory override (e.g. Storybook). Omit to use default renderers. */
  renderStrategy?: RenderStrategy
}

export const Canvas3DContainer = ({
  id: nodeId,
  parentPath = [],
  renderStrategy,
}: Canvas3DContainerProps) => {
  const store = useSduiLayoutAction()

  const getCollections = useMemo(
    () => () => buildCollectionsFromNodes(store.state.nodes, nodeId),
    [store, nodeId],
  )

  const node = store.state.nodes[nodeId]
  const state = node?.state
  const attributes = node?.attributes
  const width =
    (state?.width as number) ?? (attributes?.width as number) ?? DEFAULT_WIDTH
  const height =
    (state?.height as number) ?? (attributes?.height as number) ?? DEFAULT_HEIGHT
  const scale =
    (state?.scale as number) ?? (attributes?.scale as number) ?? DEFAULT_SCALE
  const className = attributes?.className as string | undefined

  return (
    <Canvas3D
      getCollections={getCollections}
      width={width}
      height={height}
      scale={scale}
      className={className}
      renderStrategy={renderStrategy}
    />
  )
}

Canvas3DContainer.displayName = 'Canvas3DContainer'
