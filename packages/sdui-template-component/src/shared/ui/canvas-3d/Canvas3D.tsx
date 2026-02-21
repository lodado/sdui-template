'use client'

import { useEffect, useRef } from 'react'

import type { Collection, RenderStrategy } from './model/collection'
import { createViewport } from './model/math/orthographic'
import { createRenderSystem, defaultRenderers, type RenderContext } from './model/systems/render-system'

export interface Canvas3DProps {
  width?: number
  height?: number
  scale?: number
  className?: string
  /** Collections: type + position + info per item. */
  collections?: Collection[]
  /** Type → how to render. Omit to use default (e.g. cube). */
  renderStrategy?: RenderStrategy
}

export const Canvas3D = ({
  width = 800,
  height = 600,
  scale = 80,
  className,
  collections = [],
  renderStrategy,
}: Canvas3DProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const contextRef = useRef<RenderContext | null>(null)
  const collectionsRef = useRef<Collection[]>(collections)
  const strategyRef = useRef<RenderStrategy>(renderStrategy ?? defaultRenderers)
  collectionsRef.current = collections
  strategyRef.current = renderStrategy ?? defaultRenderers

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return () => {}

    const ctx = canvas.getContext('2d')
    if (!ctx) return () => {}

    const viewport = createViewport(width, height, scale)
    contextRef.current = { ctx, viewport }

    const renderSystem = createRenderSystem(
      () => contextRef.current,
      () => collectionsRef.current,
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
          contextRef.current.viewport = createViewport(w, h, contextRef.current.viewport.scale)
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
