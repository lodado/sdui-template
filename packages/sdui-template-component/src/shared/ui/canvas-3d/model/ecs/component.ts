/** 3D position. */
export interface Vec3 {
  x: number
  y: number
  z: number
}

/** Euler angles in radians (order: XYZ). */
export interface Euler3 {
  x: number
  y: number
  z: number
}

/** Transform in 3D: position, rotation (euler), scale. Used to build world matrix. */
export interface Transform3 {
  position: Vec3
  rotation: Euler3
  scale: Vec3
}

/** Single 3D vertex. */
export type Vertex = Vec3

/** Mesh: vertices and indices. */
export interface Mesh {
  vertices: Vertex[]
  indices: number[]
  mode: 'lines' | 'triangles'
}

/** Optional color for fill and/or stroke. */
export interface Color {
  fill?: string
  stroke?: string
}

export type Transform3Component = Transform3
export type MeshComponent = Mesh
export type ColorComponent = Color
