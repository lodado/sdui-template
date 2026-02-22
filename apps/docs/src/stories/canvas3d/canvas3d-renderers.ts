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

import {
  cubicSplineSeries,
  type DataPoint,
  linearSeries,
  monotoneCubicSeries,
} from './chart-interpolation'

function isVec3(p: Vec3 | { x: number; y: number }): p is Vec3 {
  return 'z' in p && typeof (p as Vec3).z === 'number'
}

const DEFAULT_EULER: Euler3 = { x: 0, y: 0, z: 0 }
const DEFAULT_STROKE = '#1a1a1a'

function isEuler3(u: unknown): u is Euler3 {
  if (typeof u !== 'object' || u === null) return false
  const o = u as Record<string, unknown>
  return (
    typeof o.x === 'number' &&
    typeof o.y === 'number' &&
    typeof o.z === 'number'
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

function readFill(info: Record<string, unknown> | undefined): string {
  const fill = info?.fill
  const color = info?.color
  if (typeof fill === 'string') return fill
  if (typeof color === 'string') return color
  return '#3366CC'
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

/** Profile r(z) for cup: 0 ≤ z ≤ 1. Quadratic (2z - z²) gives flat base and gentle flare at rim. */
function defaultCupProfile(z: number, rBase: number, rTop: number): number {
  return rBase + (rTop - rBase) * (2 * z - z * z)
}

/**
 * Build wireframe for a cup as a surface of revolution.
 * - θ_i = 2π i / M (meridians), z_j = j / N (height rings), r_j = r(z_j).
 * - Vertex (i,j) → (r_j cos θ_i, r_j sin θ_i, z_j); index = j * M + i.
 * - Edges: meridians (i,j)–(i,j+1), parallels (i,j)–((i+1) mod M, j).
 */
function buildCupWireframe(
  M: number,
  N: number,
  rTop: number,
  rBase: number,
  rCurve?: (z: number) => number,
): { vertices: Vec3[]; lineIndices: number[] } {
  const r = (z: number) => (rCurve ? rCurve(z) : defaultCupProfile(z, rBase, rTop))
  const vertices: Vec3[] = []
  const lineIndices: number[] = []

  for (let j = 0; j <= N; j += 1) {
    const zNorm = j / N
    const zJ = zNorm - 0.5
    const rJ = r(zNorm)
    for (let i = 0; i < M; i += 1) {
      const thetaI = (2 * Math.PI * i) / M
      vertices.push({
        x: rJ * Math.cos(thetaI),
        y: rJ * Math.sin(thetaI),
        z: zJ,
      })
      // Meridian: (i, j) — (i, j+1)
      if (j < N) {
        lineIndices.push(j * M + i, (j + 1) * M + i)
      }
      // Parallel: (i, j) — ((i+1) mod M, j)
      const nextI = (i + 1) % M
      lineIndices.push(j * M + i, j * M + nextI)
    }
  }

  return { vertices, lineIndices }
}

/**
 * Build triangle indices for the cup grid (same vertex layout as buildCupWireframe).
 * Each quad (i,j), (i+1,j), (i+1,j+1), (i,j+1) → two triangles. Index = j*M + i.
 */
function buildCupTriangleIndices(M: number, N: number): [number, number, number][] {
  const triangles: [number, number, number][] = []
  for (let j = 0; j < N; j += 1) {
    for (let i = 0; i < M; i += 1) {
      const a = j * M + i
      const b = (j + 1) * M + i
      const c = j * M + ((i + 1) % M)
      const d = (j + 1) * M + ((i + 1) % M)
      triangles.push([a, b, c])
      triangles.push([c, b, d])
    }
  }
  return triangles
}

/** Bottom cap: center + ring at z = -0.5, same fill so no white hole. */
function buildCupBottomCap(M: number, rBase: number): { vertices: Vec3[]; triangleIndices: [number, number, number][] } {
  const vertices: Vec3[] = [{ x: 0, y: 0, z: -0.5 }]
  const triangleIndices: [number, number, number][] = []
  for (let i = 0; i < M; i += 1) {
    const thetaI = (2 * Math.PI * i) / M
    vertices.push({
      x: rBase * Math.cos(thetaI),
      y: rBase * Math.sin(thetaI),
      z: -0.5,
    })
  }
  for (let i = 0; i < M; i += 1) {
    triangleIndices.push([0, 1 + ((i + 1) % M), 1 + i])
  }
  return { vertices, triangleIndices }
}

const CUP_M = 16
const CUP_N = 8
const CUP_R_TOP = 0.5
const CUP_R_BASE = 0.25
const { vertices: CUP_VERTICES, lineIndices: CUP_LINE_INDICES } = buildCupWireframe(
  CUP_M,
  CUP_N,
  CUP_R_TOP,
  CUP_R_BASE,
)
const CUP_TRIANGLE_INDICES = buildCupTriangleIndices(CUP_M, CUP_N)
const CUP_SIDE_VERTEX_COUNT = (CUP_N + 1) * CUP_M
const { vertices: CUP_BOTTOM_VERTICES, triangleIndices: CUP_BOTTOM_TRIANGLES } = buildCupBottomCap(
  CUP_M,
  CUP_R_BASE,
)
const CUP_FILLED_VERTICES = [...CUP_VERTICES, ...CUP_BOTTOM_VERTICES]
const CUP_FILLED_TRIANGLE_INDICES: [number, number, number][] = [
  ...CUP_TRIANGLE_INDICES,
  ...CUP_BOTTOM_TRIANGLES.map(([a, b, c]) => [a + CUP_SIDE_VERTEX_COUNT, b + CUP_SIDE_VERTEX_COUNT, c + CUP_SIDE_VERTEX_COUNT] as [number, number, number]),
]

export const drawCupWireframe: ItemRenderer = (context) => {
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
  const projected = CUP_VERTICES.map((v) => {
    const w = transformPoint(matrix, v)
    return project(viewport, w.x, w.y, w.z)
  })

  ctx.beginPath()
  ctx.strokeStyle = stroke
  for (let i = 0; i < CUP_LINE_INDICES.length; i += 2) {
    const a = projected[CUP_LINE_INDICES[i]!]!
    const b = projected[CUP_LINE_INDICES[i + 1]!]!
    ctx.moveTo(a.sx, a.sy)
    ctx.lineTo(b.sx, b.sy)
  }
  ctx.stroke()
}

/** Renders the cup as filled surfaces (blue) with black outline, painter's algorithm by depth. */
export const drawCupFilled: ItemRenderer = (context) => {
  const { ctx, viewport, item, kind } = context
  if (kind !== '3d') return
  const pos = item.position
  if (!isVec3(pos)) return
  const scale = readScale(item.info)
  const rotation = isEuler3(item.info?.rotation) ? item.info.rotation : DEFAULT_EULER
  const fillStyle = readFill(item.info)

  const transform: Transform3 = {
    position: { x: pos.x, y: pos.y, z: pos.z },
    rotation: { x: rotation.x ?? 0, y: rotation.y ?? 0, z: rotation.z ?? 0 },
    scale: { x: scale, y: scale, z: scale },
  }
  const matrix = fromTransform3(transform)
  const projected = CUP_FILLED_VERTICES.map((v) => {
    const w = transformPoint(matrix, v)
    return project(viewport, w.x, w.y, w.z)
  })

  const trianglesWithDepth = CUP_FILLED_TRIANGLE_INDICES.map(([i0, i1, i2]) => {
    const p0 = projected[i0]!
    const p1 = projected[i1]!
    const p2 = projected[i2]!
    const depth = (p0.z + p1.z + p2.z) / 3
    return { depth, p0, p1, p2 }
  })
  trianglesWithDepth.sort((a, b) => a.depth - b.depth)

  trianglesWithDepth.forEach(({ p0, p1, p2 }) => {
    ctx.beginPath()
    ctx.moveTo(p0.sx, p0.sy)
    ctx.lineTo(p1.sx, p1.sy)
    ctx.lineTo(p2.sx, p2.sy)
    ctx.closePath()
    ctx.fillStyle = fillStyle
    ctx.fill()
  })
}

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

/** Chart layout: used by drawInterpolationChart and by story hover hit-testing. */
export const CHART_MARGIN = { left: 48, right: 24, top: 24, bottom: 40 }

function formatTick(value: number): string {
  if (Number.isInteger(value)) return String(value)
  const abs = Math.abs(value)
  if (abs >= 1000 || (abs > 0 && abs < 0.01)) return value.toExponential(1)
  if (abs >= 1) return value.toFixed(1)
  return value.toFixed(2)
}
const CHART_POINT_RADIUS = 3

/**
 * Returns a function that maps data coordinates (xd, yd) to pixel (px, py) for the interpolation chart.
 * Use this in the story for hover hit-testing so coordinates match the canvas renderer.
 */
export function createChartDataToPixel(
  xMin: number,
  xMax: number,
  yMin: number,
  yMax: number,
  width: number,
  height: number,
): (xd: number, yd: number) => { px: number; py: number } {
  const ml = CHART_MARGIN.left
  const mr = CHART_MARGIN.right
  const mt = CHART_MARGIN.top
  const plotW = Math.max(0, width - ml - mr)
  const plotH = Math.max(0, height - mt - CHART_MARGIN.bottom)
  return (xd: number, yd: number) => {
    const px = ml + ((xd - xMin) / (xMax - xMin)) * plotW
    const py = mt + plotH - ((yd - yMin) / (yMax - yMin)) * plotH
    return { px, py }
  }
}

/** Series entry for interpolation chart (from SDUI info.series). */
interface InterpolationSeriesEntry {
  data?: unknown
  interpolation?: string
  stroke?: string
}

/** Interpolation chart item info (from SDUI state.info). */
interface InterpolationChartInfo {
  series?: unknown[]
  title?: string
  xRange?: [number, number]
  yRange?: [number, number]
}

function isInterpolationChartInfo(info: unknown): info is InterpolationChartInfo {
  return typeof info === 'object' && info !== null
}

function parseSeriesEntry(s: unknown): InterpolationSeriesEntry | null {
  if (s == null || typeof s !== 'object') return null
  return s as InterpolationSeriesEntry
}

function parseDataPoints(raw: unknown): DataPoint[] {
  if (!Array.isArray(raw)) return []
  return raw
    .map((p) => {
      if (p == null || typeof p !== 'object' || !('x' in p) || !('y' in p)) return null
      const o = p as { x: unknown; y: unknown }
      const x = Number(o.x)
      const y = Number(o.y)
      if (Number.isNaN(x) || Number.isNaN(y)) return null
      return { x, y }
    })
    .filter((p): p is DataPoint => p !== null)
}

function getInterpolatedPoints(
  data: DataPoint[],
  mode: 'linear' | 'cubic' | 'monotone',
  numSteps = 32,
): DataPoint[] {
  if (data.length < 2) return [...data]
  switch (mode) {
    case 'linear':
      return linearSeries(data, numSteps)
    case 'cubic':
      return cubicSplineSeries(data, numSteps)
    case 'monotone':
      return monotoneCubicSeries(data, numSteps)
    default:
      return linearSeries(data, numSteps)
  }
}

/** 2D interpolation chart: series with linear/cubic/monotone cubic. Draws in pixel space using viewport size. */
export const drawInterpolationChart: ItemRenderer = (context) => {
  const { ctx, viewport, item, kind } = context
  if (kind !== '2d' || item.type !== 'interpolationChart') return

  const rawInfo = item.info
  const info: InterpolationChartInfo = isInterpolationChartInfo(rawInfo) ? rawInfo : {}
  const seriesRaw = Array.isArray(info.series) ? info.series : []
  const infoTitle = info.title
  const infoXRange = info.xRange
  const infoYRange = info.yRange

  if (seriesRaw.length === 0) return

  const w = viewport.width
  const h = viewport.height
  const ml = CHART_MARGIN.left
  const mr = CHART_MARGIN.right
  const mt = CHART_MARGIN.top
  const mb = CHART_MARGIN.bottom
  const plotW = Math.max(0, w - ml - mr)
  const plotH = Math.max(0, h - mt - mb)

  let xMin: number
  let xMax: number
  let yMin: number
  let yMax: number
  if (
    Array.isArray(infoXRange) &&
    infoXRange.length >= 2 &&
    Array.isArray(infoYRange) &&
    infoYRange.length >= 2
  ) {
    xMin = Number(infoXRange[0])
    xMax = Number(infoXRange[1])
    yMin = Number(infoYRange[0])
    yMax = Number(infoYRange[1])
  } else {
    let loX = Infinity
    let hiX = -Infinity
    let loY = Infinity
    let hiY = -Infinity
    seriesRaw.forEach((s) => {
      const entry = parseSeriesEntry(s)
      const data = parseDataPoints(entry?.data)
      data.forEach((p) => {
        loX = Math.min(loX, p.x)
        hiX = Math.max(hiX, p.x)
        loY = Math.min(loY, p.y)
        hiY = Math.max(hiY, p.y)
      })
    })
    if (loX === hiX) hiX = loX + 1
    if (loY === hiY) hiY = loY + 1
    xMin = loX
    xMax = hiX
    yMin = loY
    yMax = hiY
  }

  const dataToPixel = (xd: number, yd: number) => {
    const px = ml + ((xd - xMin) / (xMax - xMin)) * plotW
    const py = mt + plotH - ((yd - yMin) / (yMax - yMin)) * plotH
    return { px, py }
  }

  // X-axis: integer ticks when range is integer (e.g. 0..11 → 12 ticks)
  const xSpan = xMax - xMin
  const useIntegerX =
    xSpan >= 1 &&
    xSpan <= 24 &&
    Number.isInteger(xMin) &&
    Number.isInteger(xMax)
  const xTickValues: number[] = useIntegerX
    ? Array.from({ length: xSpan + 1 }, (_, i) => xMin + i)
    : Array.from({ length: 7 }, (_, i) => xMin + (i / 6) * xSpan)

  // Grid: vertical and horizontal lines
  ctx.strokeStyle = '#e5e7eb'
  ctx.lineWidth = 1
  const yTicks = 5
  xTickValues.forEach((xd) => {
    const { px } = dataToPixel(xd, yMin)
    ctx.beginPath()
    ctx.moveTo(px, mt)
    ctx.lineTo(px, mt + plotH)
    ctx.stroke()
  })
  Array.from({ length: yTicks + 1 }, (_, j) => j).forEach((j) => {
    const t = j / yTicks
    const yd = yMin + t * (yMax - yMin)
    const { py } = dataToPixel(xMin, yd)
    ctx.beginPath()
    ctx.moveTo(ml, py)
    ctx.lineTo(ml + plotW, py)
    ctx.stroke()
  })

  // X-axis tick labels (integer when useIntegerX)
  ctx.fillStyle = '#6b7280'
  ctx.font = '11px sans-serif'
  ctx.textAlign = 'center'
  ctx.textBaseline = 'top'
  const xLabelY = mt + plotH + 4
  xTickValues.forEach((xd) => {
    const { px } = dataToPixel(xd, yMin)
    const label = useIntegerX ? String(Math.round(xd)) : formatTick(xd)
    ctx.fillText(label, px, xLabelY)
  })

  // Y-axis tick labels (values left of plot)
  ctx.fillStyle = '#6b7280'
  ctx.font = '11px sans-serif'
  ctx.textAlign = 'right'
  ctx.textBaseline = 'middle'
  const yLabelX = ml - 6
  Array.from({ length: yTicks + 1 }, (_, j) => j).forEach((j) => {
    const t = j / yTicks
    const yd = yMin + t * (yMax - yMin)
    const { py } = dataToPixel(xMin, yd)
    const label = formatTick(yd)
    ctx.fillText(label, yLabelX, py)
  })

  // Title
  const title = (typeof infoTitle === 'string' ? infoTitle : undefined) ?? 'Interpolation Modes'
  ctx.fillStyle = '#1a1a1a'
  ctx.font = '16px sans-serif'
  ctx.textAlign = 'center'
  ctx.fillText(title, w / 2, mt - 6)

  type InterpolationMode = 'linear' | 'cubic' | 'monotone'
  function toInterpolationMode(v: string | undefined): InterpolationMode {
    if (v === 'linear' || v === 'cubic' || v === 'monotone') return v
    return 'linear'
  }

  // Draw each series
  seriesRaw
    .map((s) => {
      const entry = parseSeriesEntry(s)
      const data = parseDataPoints(entry?.data)
      const mode = toInterpolationMode(entry?.interpolation)
      const stroke = typeof entry?.stroke === 'string' ? entry.stroke : DEFAULT_STROKE
      return { data, mode, stroke }
    })
    .filter(({ data }) => data.length >= 2)
    .forEach(({ data, mode, stroke }) => {
      const points = getInterpolatedPoints(data, mode)
      const firstPt = points[0]
      if (!firstPt) return
      ctx.strokeStyle = stroke
      ctx.lineWidth = 2
      ctx.beginPath()
      const first = dataToPixel(firstPt.x, firstPt.y)
      ctx.moveTo(first.px, first.py)
      points.slice(1).forEach((pt) => {
        const { px, py } = dataToPixel(pt.x, pt.y)
        ctx.lineTo(px, py)
      })
      ctx.stroke()

      // Data points (circles)
      ctx.fillStyle = stroke
      data.forEach((p) => {
        const { px, py } = dataToPixel(p.x, p.y)
        ctx.beginPath()
        ctx.arc(px, py, CHART_POINT_RADIUS, 0, Math.PI * 2)
        ctx.fill()
      })
    })

  // Y-axis label
  ctx.save()
  ctx.translate(12, mt + plotH / 2)
  ctx.rotate(-Math.PI / 2)
  ctx.textAlign = 'center'
  ctx.fillStyle = '#374151'
  ctx.font = '12px sans-serif'
  ctx.fillText('Value', 0, 0)
  ctx.restore()
}

/** Storybook default render strategy: cube + hexagon + cup + cupFilled + interpolationChart. Injected in Canvas3D stories. */
export const storybookCanvas3DRenderStrategy: RenderStrategy = {
  cube: drawCubeWireframe,
  hexagon: drawHexagonWireframe,
  cup: drawCupWireframe,
  cupFilled: drawCupFilled,
  interpolationChart: drawInterpolationChart,
}
