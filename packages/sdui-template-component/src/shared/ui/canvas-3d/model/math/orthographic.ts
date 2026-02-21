import type { Vec3 } from '../ecs/component'
import { multiply, rotationX, rotationY, transformPoint } from './matrix3d'

/** Viewport for orthographic projection: map 3D x,y to canvas pixel coordinates. */
export interface OrthoViewport {
  width: number
  height: number
  scale: number
  centerX: number
  centerY: number
  /** View tilt (radians): rotate scene around X then Y so cube etc. show 3 faces. Default ~0.35, 0.75. */
  viewRotationX?: number
  viewRotationY?: number
}

const DEFAULT_VIEW_TILT_X = 0.35
const DEFAULT_VIEW_TILT_Y = 0.75

/** Create default viewport: origin at center, 1 unit = scale pixels. Axis tilted so 3D shapes show depth. */
export function createViewport(
  width: number,
  height: number,
  scale: number = 80,
  viewRotationX: number = DEFAULT_VIEW_TILT_X,
  viewRotationY: number = DEFAULT_VIEW_TILT_Y,
): OrthoViewport {
  return {
    width,
    height,
    scale,
    centerX: width / 2,
    centerY: height / 2,
    viewRotationX,
    viewRotationY,
  }
}

/** Apply view rotation to a point (for orthographic tilt). */
function applyViewRotation(
  viewport: OrthoViewport,
  x: number,
  y: number,
  z: number,
): Vec3 {
  const rx = viewport.viewRotationX ?? 0
  const ry = viewport.viewRotationY ?? 0
  if (rx === 0 && ry === 0) return { x, y, z }
  const R = multiply(rotationY(ry), rotationX(rx))
  return transformPoint(R, { x, y, z })
}

/** Project 3D point to 2D screen coordinates (orthographic). Applies view tilt if set. */
export function project(
  viewport: OrthoViewport,
  x: number,
  y: number,
  z: number,
): { sx: number; sy: number; z: number } {
  const p = applyViewRotation(viewport, x, y, z)
  const sx = viewport.centerX + p.x * viewport.scale
  const sy = viewport.centerY - p.y * viewport.scale
  return { sx, sy, z: p.z }
}
