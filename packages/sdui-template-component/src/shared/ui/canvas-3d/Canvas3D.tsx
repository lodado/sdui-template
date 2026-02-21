'use client'

import { useEffect, useRef } from 'react'

import type { Collection, RenderStrategy } from './model/collection'
import { createCanvasWorld } from './model/world'

const EMPTY_STRATEGY: RenderStrategy = {}

export interface Canvas3DProps {
  width?: number
  height?: number
  scale?: number
  className?: string
  /** Collections: type + position + info per item. */
  collections?: Collection[]
  /** When provided (e.g. SDUI), collections are read from this getter every frame. Overrides collections prop. */
  getCollections?: () => Collection[]
  /** Type → how to render. Must be injected from outside (e.g. component factory or app). No built-in default. */
  renderStrategy?: RenderStrategy
}

export const Canvas3D = ({
  width = 800,
  height = 600,
  scale = 80,
  className,
  collections = [],
  getCollections,
  renderStrategy,
}: Canvas3DProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const collectionsRef = useRef<Collection[]>(collections)
  const strategyRef = useRef<RenderStrategy>(renderStrategy ?? EMPTY_STRATEGY)
  const getCollectionsRef = useRef<() => Collection[]>(() => collectionsRef.current)
  collectionsRef.current = collections
  strategyRef.current = renderStrategy ?? EMPTY_STRATEGY
  getCollectionsRef.current = getCollections ?? (() => collectionsRef.current)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return () => {}

    const stop = createCanvasWorld(canvas, {
      width,
      height,
      scale,
      getCollections: () => getCollectionsRef.current(),
      getRenderStrategy: () => strategyRef.current,
    })
    return stop
  }, [width, height, scale])

  return (
    <canvas
      ref={canvasRef}
      width={width}
      height={height}
      className={className}
      style={{ display: 'block', width: '100%', height: '100%' }}
    />
  )
}
