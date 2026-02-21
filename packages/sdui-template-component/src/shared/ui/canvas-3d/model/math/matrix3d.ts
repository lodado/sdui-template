import type { Transform3, Vec3 } from '../ecs/component'

export type Mat4 = number[]

export function identity(): Mat4 {
  return [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1]
}

export function multiply(a: Mat4, b: Mat4): Mat4 {
  const out: Mat4 = []
  for (let row = 0; row < 4; row += 1) {
    for (let col = 0; col < 4; col += 1) {
      let sum = 0
      for (let i = 0; i < 4; i += 1) sum += a[i * 4 + row]! * b[col * 4 + i]!
      out[col * 4 + row] = sum
    }
  }
  return out
}

export function translation(x: number, y: number, z: number): Mat4 {
  return [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, x, y, z, 1]
}

export function scaling(sx: number, sy: number, sz: number): Mat4 {
  return [sx, 0, 0, 0, 0, sy, 0, 0, 0, 0, sz, 0, 0, 0, 0, 1]
}

function cos(x: number): number {
  return Math.cos(x)
}
function sin(x: number): number {
  return Math.sin(x)
}

export function rotationX(rad: number): Mat4 {
  const c = cos(rad)
  const s = sin(rad)
  return [1, 0, 0, 0, 0, c, s, 0, 0, -s, c, 0, 0, 0, 0, 1]
}

export function rotationY(rad: number): Mat4 {
  const c = cos(rad)
  const s = sin(rad)
  return [c, 0, -s, 0, 0, 1, 0, 0, s, 0, c, 0, 0, 0, 0, 1]
}

export function rotationZ(rad: number): Mat4 {
  const c = cos(rad)
  const s = sin(rad)
  return [c, s, 0, 0, -s, c, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1]
}

export function fromTransform3(t: Transform3): Mat4 {
  const T = translation(t.position.x, t.position.y, t.position.z)
  const Rx = rotationX(t.rotation.x)
  const Ry = rotationY(t.rotation.y)
  const Rz = rotationZ(t.rotation.z)
  const S = scaling(t.scale.x, t.scale.y, t.scale.z)
  return multiply(T, multiply(multiply(Rz, multiply(Ry, Rx)), S))
}

export function transformPoint(m: Mat4, p: Vec3): Vec3 {
  const x = p.x * m[0]! + p.y * m[4]! + p.z * m[8]! + m[12]!
  const y = p.x * m[1]! + p.y * m[5]! + p.z * m[9]! + m[13]!
  const z = p.x * m[2]! + p.y * m[6]! + p.z * m[10]! + m[14]!
  return { x, y, z }
}
