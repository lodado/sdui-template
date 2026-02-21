import type { OrthoViewport } from './math/orthographic'

/** 3D position (z optional for 2D items). */
export interface Vec3 {
  x: number
  y: number
  z: number
}

/** 2D screen position. */
export interface Point2D {
  x: number
  y: number
}

/**
 * Collection item: type + position + info only (SDUI document style).
 * No mesh, transform, or draw function — renderStrategy decides how to render by type.
 */
export interface CollectionItem {
  type: string
  position: Vec3 | Point2D
  info?: Record<string, unknown>
}

export interface Collection3D {
  kind: '3d'
  items: CollectionItem[]
}

export interface Collection2D {
  kind: '2d'
  items: CollectionItem[]
}

export type Collection = Collection3D | Collection2D

/** Context passed to an item renderer for one draw call. */
export interface ItemRenderContext {
  ctx: CanvasRenderingContext2D
  viewport: OrthoViewport
  item: CollectionItem
  kind: '3d' | '2d'
  dt: number
}

/** Renders one item of a given type. */
export type ItemRenderer = (context: ItemRenderContext) => void

/** Type → how to render (SDUI components style). */
export type RenderStrategy = Record<string, ItemRenderer>
