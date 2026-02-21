import type { Collection, RenderStrategy } from '../collection'
import { createViewport } from '../math/orthographic'
import { createRenderSystem, type RenderContext } from '../systems/render-system'

export interface CanvasWorldConfig {
  width: number
  height: number
  scale: number
  getCollections: () => Collection[]
  getRenderStrategy: () => RenderStrategy
}

/**
 * Creates and runs the canvas "world": double-buffer (OffscreenCanvas) + render loop + resize sync.
 * All drawing goes to the back buffer; each frame is presented to the display canvas via drawImage.
 * Returns a cleanup function (cancel RAF, disconnect ResizeObserver).
 */
export function createCanvasWorld(displayCanvas: HTMLCanvasElement, config: CanvasWorldConfig): () => void {
  const canvas = displayCanvas
  const displayCtx = canvas.getContext('2d')
  if (!displayCtx) return () => {}

  const offscreenCanvas = new OffscreenCanvas(canvas.width, canvas.height)
  const backCtx = offscreenCanvas.getContext('2d')
  if (!backCtx) return () => {}

  const viewport = createViewport(config.width, config.height, config.scale)
  const contextRef: { current: RenderContext } = {
    current: { ctx: backCtx as unknown as CanvasRenderingContext2D, viewport },
  }

  const renderSystem = createRenderSystem(() => contextRef.current, config.getCollections, config.getRenderStrategy)

  let rafId: number
  let lastTime = performance.now()

  const loop = (now: number) => {
    const dt = (now - lastTime) / 1000
    lastTime = now
    renderSystem(dt)
    displayCtx.drawImage(offscreenCanvas, 0, 0)
    rafId = requestAnimationFrame(loop)
  }
  rafId = requestAnimationFrame(loop)

  const resize = () => {
    const w = canvas.clientWidth
    const h = canvas.clientHeight
    if (canvas.width !== w || canvas.height !== h) {
      canvas.width = w
      canvas.height = h
      offscreenCanvas.width = w
      offscreenCanvas.height = h
      const v = contextRef.current.viewport
      contextRef.current.viewport = createViewport(w, h, v.scale, v.viewRotationX, v.viewRotationY)
    }
  }

  resize()
  const observer = new ResizeObserver(resize)
  observer.observe(canvas)

  return () => {
    cancelAnimationFrame(rafId)
    observer.disconnect()
  }
}
