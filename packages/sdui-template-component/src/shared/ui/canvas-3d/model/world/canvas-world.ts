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

  const syncCanvasSize = () => {
    const w = Math.max(1, canvas.clientWidth || config.width)
    const h = Math.max(1, canvas.clientHeight || config.height)
    if (canvas.width !== w || canvas.height !== h) {
      canvas.width = w
      canvas.height = h
    }
    return { w: canvas.width, h: canvas.height }
  }

  syncCanvasSize()

  const offscreenCanvas = new OffscreenCanvas(canvas.width, canvas.height)
  const backCtx = offscreenCanvas.getContext('2d')
  if (!backCtx) return () => {}

  const viewport = createViewport(canvas.width, canvas.height, config.scale)
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
    displayCtx.clearRect(0, 0, canvas.width, canvas.height)
    displayCtx.drawImage(offscreenCanvas, 0, 0)
    rafId = requestAnimationFrame(loop)
  }
  rafId = requestAnimationFrame(loop)

  const resize = () => {
    const { w, h } = syncCanvasSize()
    if (offscreenCanvas.width !== w || offscreenCanvas.height !== h) {
      offscreenCanvas.width = w
      offscreenCanvas.height = h
      const v = contextRef.current.viewport
      contextRef.current.viewport = createViewport(w, h, v.scale, v.viewRotationX, v.viewRotationY)
    }
  }

  const observer = new ResizeObserver(resize)
  observer.observe(canvas)

  return () => {
    cancelAnimationFrame(rafId)
    observer.disconnect()
  }
}
