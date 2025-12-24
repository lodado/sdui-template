'use client'

import React, { useMemo } from 'react'
import type { ComponentFactory, RenderNodeFn } from '@lodado/sdui-template'
import { useSduiNodeSubscription, useSduiLayoutAction } from '@lodado/sdui-template'
import { z } from 'zod'

/**
 * GridLayout State 스키마
 */
const gridLayoutStateSchema = z.object({
  grid: z
    .object({
      cols: z.number(),
      rowHeight: z.number(),
      margin: z.tuple([z.number(), z.number()]),
      compactType: z.enum(['vertical', 'horizontal']).nullable().optional(),
      preventCollision: z.boolean().optional(),
      isDraggable: z.boolean().optional(),
      isResizable: z.boolean().optional(),
      maxRows: z.number().optional(),
    })
    .optional(),
  layout: z.object({
    x: z.number(),
    y: z.number(),
    w: z.number(),
    h: z.number(),
    minW: z.number().optional(),
    minH: z.number().optional(),
    maxW: z.number().optional(),
    maxH: z.number().optional(),
    static: z.boolean().optional(),
  }),
})

/**
 * Grid 기본값
 */
const DEFAULT_GRID = {
  cols: 12,
  rowHeight: 100,
  margin: [8, 8] as [number, number],
  compactType: 'horizontal' as const,
  preventCollision: false,
  isDraggable: true,
  isResizable: true,
}

interface GridLayoutProps {
  id: string
  renderNode: RenderNodeFn
}

const index = 0

const GridLayoutComponent: React.FC<GridLayoutProps> = ({ id, renderNode }) => {
  const store = useSduiLayoutAction()
  // GridLayout은 자신의 state와 childrenIds만 구독 (자식의 state 변경은 구독하지 않음)
  const { state, childrenIds } = useSduiNodeSubscription({
    nodeId: id,
    schema: gridLayoutStateSchema,
  })

  // grid가 없으면 기본값 사용
  const grid = state.grid || DEFAULT_GRID

  // CSS Grid 스타일 계산
  const gridStyle = useMemo(() => {
    const [marginX, marginY] = grid.margin
    return {
      display: 'grid',
      gridTemplateColumns: `repeat(${grid.cols}, 1fr)`,
      gap: `${marginY}px ${marginX}px`,
      width: '100%',
      height: '100%',
    } as React.CSSProperties
  }, [grid.cols, grid.margin])

  // 각 자식 아이템의 스타일 계산 (grid-column, grid-row)
  // childrenIds가 변경될 때만 재계산 (자식의 state 변경은 구독하지 않음)
  const childStyles = useMemo(() => {
    if (!childrenIds || childrenIds.length === 0) return {}

    const styles: Record<string, React.CSSProperties> = {}

    childrenIds.forEach((childId: string) => {
      const childState = store.getLayoutStateById(childId)
      if (!childState) return

      const { layout } = childState
      // CSS Grid는 1-based index를 사용하므로 +1
      // grid-column: start / span width
      // grid-row: start / span height
      styles[childId] = {
        gridColumn: `${layout.x + 1} / span ${layout.w}`,
        gridRow: `${layout.y + 1} / span ${layout.h}`,
        minHeight: `${grid.rowHeight * layout.h}px`,
      }
    })

    return styles
    // childrenIds가 변경될 때만 재계산 (자식의 state 변경은 구독하지 않음)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [childrenIds?.join(','), grid.rowHeight])

  return (
    <div style={gridStyle} className="w-full h-full">
      {childrenIds?.map((childId: string) => {
        const itemStyle = childStyles[childId] || {}
        return (
          <div key={childId} style={itemStyle} className="w-full">
            {renderNode(childId)}
          </div>
        )
      })}
    </div>
  )
}

GridLayoutComponent.displayName = 'GridLayout'

export const GridLayout = GridLayoutComponent

export const GridLayoutFactory: ComponentFactory = (id, renderNode) => <GridLayout id={id} renderNode={renderNode} />
