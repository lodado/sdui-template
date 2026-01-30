'use client'

import type { ComponentFactory, ParentPath } from '@lodado/sdui-template'
import { useRenderNode, useSduiLayoutAction, useSduiNodeReference, useSduiNodeSubscription } from '@lodado/sdui-template'
import React from 'react'
import GridLayoutBase, { type Layout } from 'react-grid-layout'
import { WidthProvider } from 'react-grid-layout'
import { z } from 'zod'

const ReactGridLayout = WidthProvider(GridLayoutBase)

const gridLayoutStateSchema = z.object({
  cols: z.number().optional(),
  rowHeight: z.number().optional(),
  margin: z.tuple([z.number(), z.number()]).optional(),
})

const gridLayoutItemSchema = z.object({
  x: z.number(),
  y: z.number(),
  w: z.number(),
  h: z.number(),
})

const gridLayoutChildStateSchema = z.object({
  layout: gridLayoutItemSchema.optional(),
})

interface GridLayoutProps {
  id: string
  parentPath?: ParentPath
}

const defaultItemSize = { w: 4, h: 4 }

const buildFallbackLayout = (childrenIds: string[] | undefined): Layout[] => {
  if (!childrenIds) return []
  return childrenIds.map((childId, index) => ({
    i: childId,
    x: (index * 4) % 12,
    y: Math.floor(index / 3) * 4,
    w: defaultItemSize.w,
    h: defaultItemSize.h,
  }))
}

const GridLayoutComponent: React.FC<GridLayoutProps> = ({ id, parentPath = [] }) => {
  const store = useSduiLayoutAction()
  // @ts-expect-error - Zod schema type compatibility issue between zod versions
  const { state, childrenIds } = useSduiNodeSubscription<typeof gridLayoutStateSchema>({
    nodeId: id,
    schema: gridLayoutStateSchema,
  })
  const { renderNode, currentPath } = useRenderNode({ nodeId: id, parentPath })
  const typedState = gridLayoutStateSchema.parse(state ?? {})
  // @ts-expect-error - Zod schema type compatibility issue between zod versions
  const { referencedNodesMap } = useSduiNodeReference<typeof gridLayoutChildStateSchema>({
    nodeId: id,
    schema: gridLayoutChildStateSchema,
  })

  const layout = React.useMemo<Layout[]>(() => {
    const fallbackLayout = buildFallbackLayout(childrenIds)

    return (childrenIds ?? []).map((childId, index) => {
      const referencedNode = referencedNodesMap[childId]
      const parsedChildState = gridLayoutChildStateSchema.safeParse(referencedNode?.state ?? {})
      const item = parsedChildState.success ? parsedChildState.data.layout : undefined

      return item
        ? { i: childId, x: item.x, y: item.y, w: item.w, h: item.h }
        : fallbackLayout[index]
    })
  }, [childrenIds, referencedNodesMap])

  const handleLayoutChange = React.useCallback(
    (updatedLayout: Layout[]) => {
      updatedLayout.forEach((item) => {
        store.updateNodeState(item.i, {
          layout: {
            x: item.x,
            y: item.y,
            w: item.w,
            h: item.h,
          },
        })
      })
    },
    [store],
  )

  return (
    <div className="w-full max-w-5xl">
      <ReactGridLayout
        className="rounded-3xl border border-white/10 bg-white/5 p-4"
        cols={typedState?.cols ?? 12}
        rowHeight={typedState?.rowHeight ?? 80}
        margin={typedState?.margin ?? [16, 16]}
        layout={layout}
        onLayoutChange={handleLayoutChange}
      >
        {(childrenIds ?? []).map((childId) => (
          <div
            key={childId}
            className="h-full w-full overflow-hidden rounded-2xl border border-white/10 bg-black/40"
          >
            {renderNode(childId, currentPath)}
          </div>
        ))}
      </ReactGridLayout>
    </div>
  )
}

GridLayoutComponent.displayName = 'GridLayout'

export const GridLayout = GridLayoutComponent

export const GridLayoutFactory: ComponentFactory = (id, parentPath) => (
  <GridLayout id={id} parentPath={parentPath} />
)
