import type { Collection, ItemRenderContext, ItemRenderer, RenderStrategy } from '../collection'
import type { Euler3, Transform3, Vec3 } from '../ecs/component'
import { fromTransform3, transformPoint } from '../math/matrix3d'
import { type OrthoViewport, project } from '../math/orthographic'

export interface RenderContext {
  ctx: CanvasRenderingContext2D
  viewport: OrthoViewport
}

const CUBE_VERTICES: Vec3[] = [
  { x: -0.5, y: -0.5, z: -0.5 },
  { x: 0.5, y: -0.5, z: -0.5 },
  { x: 0.5, y: 0.5, z: -0.5 },
  { x: -0.5, y: 0.5, z: -0.5 },
  { x: -0.5, y: -0.5, z: 0.5 },
  { x: 0.5, y: -0.5, z: 0.5 },
  { x: 0.5, y: 0.5, z: 0.5 },
  { x: -0.5, y: 0.5, z: 0.5 },
]

const CUBE_LINE_INDICES = [0, 1, 1, 2, 2, 3, 3, 0, 4, 5, 5, 6, 6, 7, 7, 4, 0, 4, 1, 5, 2, 6, 3, 7]

function isVec3(p: Vec3 | { x: number; y: number }): p is Vec3 {
  return 'z' in p && typeof (p as Vec3).z === 'number'
}

export const drawCubeWireframe: ItemRenderer = (context) => {
  const { ctx, viewport, item, kind } = context
  if (kind !== '3d') return
  const pos = item.position
  if (!isVec3(pos)) return
  const scale = (item.info?.scale as number) ?? 1
  const rotation = (item.info?.rotation as Euler3) ?? { x: 0, y: 0, z: 0 }
  const stroke = (item.info?.color as string) ?? (item.info?.stroke as string) ?? '#1a1a1a'

  const transform: Transform3 = {
    position: { x: pos.x, y: pos.y, z: pos.z },
    rotation: { x: rotation.x ?? 0, y: rotation.y ?? 0, z: rotation.z ?? 0 },
    scale: { x: scale, y: scale, z: scale },
  }
  const matrix = fromTransform3(transform)
  const projected = CUBE_VERTICES.map((v) => {
    const w = transformPoint(matrix, v)
    return project(viewport, w.x, w.y, w.z)
  })

  ctx.beginPath()
  ctx.strokeStyle = stroke
  for (let i = 0; i < CUBE_LINE_INDICES.length; i += 2) {
    const a = projected[CUBE_LINE_INDICES[i]!]!
    const b = projected[CUBE_LINE_INDICES[i + 1]!]!
    ctx.moveTo(a.sx, a.sy)
    ctx.lineTo(b.sx, b.sy)
  }
  ctx.stroke()
}

export const defaultRenderers: RenderStrategy = {
  cube: drawCubeWireframe,
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
