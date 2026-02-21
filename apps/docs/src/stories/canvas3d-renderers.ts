/**
 * Canvas3D render strategy for Storybook: cube and hexagon wireframes.
 * Implemented in docs app; inject via components override. The component
 * package does not ship any default renderers.
 */
import type {
  Euler3,
  ItemRenderer,
  RenderStrategy,
  Transform3,
  Vec3,
} from '@lodado/sdui-template-component'
import {
  fromTransform3,
  project,
  transformPoint,
} from '@lodado/sdui-template-component'

function isVec3(p: Vec3 | { x: number; y: number }): p is Vec3 {
  return 'z' in p && typeof (p as Vec3).z === 'number'
}

const DEFAULT_EULER: Euler3 = { x: 0, y: 0, z: 0 }
const DEFAULT_STROKE = '#1a1a1a'

function isEuler3(u: unknown): u is Euler3 {
  return (
    typeof u === 'object' &&
    u !== null &&
    'x' in u &&
    'y' in u &&
    'z' in u &&
    typeof (u as Record<string, unknown>).x === 'number' &&
    typeof (u as Record<string, unknown>).y === 'number' &&
    typeof (u as Record<string, unknown>).z === 'number'
  )
}

function readScale(info: Record<string, unknown> | undefined): number {
  const s = info?.scale
  return typeof s === 'number' ? s : 1
}

function readStroke(info: Record<string, unknown> | undefined): string {
  const color = info?.color
  const stroke = info?.stroke
  if (typeof color === 'string') return color
  if (typeof stroke === 'string') return stroke
  return DEFAULT_STROKE
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
  const scale = readScale(item.info)
  const rotation = isEuler3(item.info?.rotation) ? item.info.rotation : DEFAULT_EULER
  const stroke = readStroke(item.info)

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
  const scale = readScale(item.info)
  const rotation = isEuler3(item.info?.rotation) ? item.info.rotation : DEFAULT_EULER
  const stroke = readStroke(item.info)

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

/** Storybook default render strategy: cube + hexagon. Injected in Canvas3D stories. */
export const storybookCanvas3DRenderStrategy: RenderStrategy = {
  cube: drawCubeWireframe,
  hexagon: drawHexagonWireframe,
}
