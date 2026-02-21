'use client'

import { useEffect, useRef } from 'react'

import type { Collection, RenderStrategy } from './model/collection'
import { createViewport } from './model/math/orthographic'
import { createRenderSystem, type RenderContext } from './model/systems/render-system'

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
  const contextRef = useRef<RenderContext | null>(null)
  const collectionsRef = useRef<Collection[]>(collections)
  const strategyRef = useRef<RenderStrategy>(renderStrategy ?? EMPTY_STRATEGY)
  const getCollectionsRef = useRef<() => Collection[]>(() => collectionsRef.current)
  collectionsRef.current = collections
  strategyRef.current = renderStrategy ?? EMPTY_STRATEGY
  getCollectionsRef.current = getCollections ?? (() => collectionsRef.current)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return () => {}

    const ctx = canvas.getContext('2d')
    if (!ctx) return () => {}

    const viewport = createViewport(width, height, scale)
    contextRef.current = { ctx, viewport }

    const renderSystem = createRenderSystem(
      () => contextRef.current,
      () => getCollectionsRef.current(),
      () => strategyRef.current,
    )

    let rafId: number
    let lastTime = performance.now()

    const loop = (now: number) => {
      const dt = (now - lastTime) / 1000
      lastTime = now
      renderSystem(dt)
      rafId = requestAnimationFrame(loop)
    }
    rafId = requestAnimationFrame(loop)

    return () => {
      cancelAnimationFrame(rafId)
    }
  }, [width, height, scale])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas || !contextRef.current) return () => {}

    const resize = () => {
      const w = canvas.clientWidth
      const h = canvas.clientHeight
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w
        canvas.height = h
        if (contextRef.current) {
          const v = contextRef.current.viewport
          contextRef.current.viewport = createViewport(
            w,
            h,
            v.scale,
            v.viewRotationX,
            v.viewRotationY,
          )
        }
      }
    }

    resize()
    const observer = new ResizeObserver(resize)
    observer.observe(canvas)
    return () => observer.disconnect()
  }, [])

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
