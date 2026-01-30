declare module 'react-grid-layout' {
  import * as React from 'react'

  export type Layout = {
    i: string
    x: number
    y: number
    w: number
    h: number
    [key: string]: string | number | boolean | undefined
  }

  export interface ReactGridLayoutProps {
    className?: string
    cols?: number
    rowHeight?: number
    margin?: [number, number]
    layout?: Layout[]
    onLayoutChange?: (layout: Layout[]) => void
    children?: React.ReactNode
  }

  const ReactGridLayout: React.ComponentType<ReactGridLayoutProps>

  export function WidthProvider<T extends React.ComponentType<any>>(component: T): T

  export default ReactGridLayout
}
