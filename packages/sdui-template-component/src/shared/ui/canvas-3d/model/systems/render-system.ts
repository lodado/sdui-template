import type { Collection, RenderStrategy } from '../collection'
import type { Vec3 } from '../ecs/component'
import { type OrthoViewport, project } from '../math/orthographic'

export interface RenderContext {
  ctx: CanvasRenderingContext2D
  viewport: OrthoViewport
}

function isVec3(p: Vec3 | { x: number; y: number }): p is Vec3 {
  return 'z' in p && typeof (p as Vec3).z === 'number'
}

function renderFrame(
  ctx: CanvasRenderingContext2D,
  viewport: OrthoViewport,
  collections: Collection[],
  strategy: RenderStrategy,
  dt: number,
): void {
  const w = viewport.width
  const h = viewport.height
  ctx.clearRect(0, 0, w, h)

  collections.forEach((col) => {
    const items = [...col.items]
    if (col.kind === '3d') {
      items.sort((a, b) => {
        const za = isVec3(a.position) ? a.position.z : 0
        const zb = isVec3(b.position) ? b.position.z : 0
        return za - zb
      })
    }
    items.forEach((item) => {
      const renderer = strategy[item.type]
      if (renderer) {
        renderer({ ctx, viewport, item, kind: col.kind, dt })
      }
    })
  })
}

export function createRenderSystem(
  getContext: () => RenderContext | null,
  getCollections: () => Collection[],
  getRenderStrategy: () => RenderStrategy,
): (dt: number) => void {
  return function renderSystem(dt: number) {
    const gc = getContext()
    if (!gc) return
    const collections = getCollections()
    const strategy = getRenderStrategy()
    renderFrame(gc.ctx, gc.viewport, collections, strategy, dt)
  }
}
