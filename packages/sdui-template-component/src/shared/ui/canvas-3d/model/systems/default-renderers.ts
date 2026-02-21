import type { ItemRenderer, RenderStrategy } from '../collection'
import type { Euler3, Transform3, Vec3 } from '../ecs/component'
import { fromTransform3, transformPoint } from '../math/matrix3d'
import { type OrthoViewport, project } from '../math/orthographic'

function isVec3(p: Vec3 | { x: number; y: number }): p is Vec3 {
  return 'z' in p && typeof (p as Vec3).z === 'number'
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

/** 3D hexagonal prism: bottom hexagon (0–5) z=-0.5, top hexagon (6–11) z=0.5, radius 0.5. */
const HEXAGON_PRISM_VERTICES: Vec3[] = (() => {
  const r = 0.5
  const out: Vec3[] = []
  for (let face = 0; face < 2; face += 1) {
    const z = face === 0 ? -0.5 : 0.5
    for (let i = 0; i < 6; i += 1) {
      const angle = (i * Math.PI) / 3
      out.push({ x: r * Math.cos(angle), y: r * Math.sin(angle), z })
    }
  }
  return out
})()

/** Bottom ring, top ring, 6 vertical edges. */
const HEXAGON_PRISM_LINE_INDICES = [
  0, 1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 0,
  6, 7, 7, 8, 8, 9, 9, 10, 10, 11, 11, 6,
  0, 6, 1, 7, 2, 8, 3, 9, 4, 10, 5, 11,
]

export const drawHexagonWireframe: ItemRenderer = (context) => {
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
  const projected = HEXAGON_PRISM_VERTICES.map((v) => {
    const w = transformPoint(matrix, v)
    return project(viewport, w.x, w.y, w.z)
  })

  ctx.beginPath()
  ctx.strokeStyle = stroke
  for (let i = 0; i < HEXAGON_PRISM_LINE_INDICES.length; i += 2) {
    const a = projected[HEXAGON_PRISM_LINE_INDICES[i]!]!
    const b = projected[HEXAGON_PRISM_LINE_INDICES[i + 1]!]!
    ctx.moveTo(a.sx, a.sy)
    ctx.lineTo(b.sx, b.sy)
  }
  ctx.stroke()
}

export const defaultRenderers: RenderStrategy = {
  cube: drawCubeWireframe,
  hexagon: drawHexagonWireframe,
}
