/** Viewport for orthographic projection: map 3D x,y to canvas pixel coordinates. */
export interface OrthoViewport {
  width: number
  height: number
  scale: number
  centerX: number
  centerY: number
}

/** Create default viewport: origin at center, 1 unit = scale pixels. */
export function createViewport(width: number, height: number, scale: number = 80): OrthoViewport {
  return {
    width,
    height,
    scale,
    centerX: width / 2,
    centerY: height / 2,
  }
}

/** Project 3D point to 2D screen coordinates (orthographic). */
export function project(
  viewport: OrthoViewport,
  x: number,
  y: number,
  z: number,
): { sx: number; sy: number; z: number } {
  const sx = viewport.centerX + x * viewport.scale
  const sy = viewport.centerY - y * viewport.scale
  return { sx, sy, z }
}
