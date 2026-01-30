'use client'

import type { ComponentFactory } from '@lodado/sdui-template'
import { useSduiLayoutAction, useSduiNodeSubscription } from '@lodado/sdui-template'
import React from 'react'
import { z } from 'zod'

const shapes = ['square', 'triangle', 'circle']

type ShapeType = 'square' | 'triangle' | 'circle'

const shapeTileStateSchema = z.object({
  shape: z.enum(['square', 'triangle', 'circle']).optional(),
  label: z.string().optional(),
})


const shapeClassName: Record<ShapeType, string> = {
  square: 'rounded-xl',
  triangle: 'rounded-none',
  circle: 'rounded-full',
}

const ShapeTileComponent: React.FC<{ nodeId: string }> = ({ nodeId }) => {
  const store = useSduiLayoutAction()
  // @ts-expect-error - Zod schema type compatibility issue between zod versions
  const { state } = useSduiNodeSubscription<typeof shapeTileStateSchema>({
    nodeId,
    schema: shapeTileStateSchema,
  })

  const parsedState = shapeTileStateSchema.parse(state ?? {})
  const shape = parsedState.shape ?? 'square'
  const label = parsedState.label ?? 'Shape'

  const handleToggle = () => {
    const currentIndex = shapes.indexOf(shape)
    const nextShape = shapes[(currentIndex + 1) % shapes.length]
    store.updateNodeState(nodeId, { shape: nextShape })
  }

  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-3 bg-gradient-to-br from-white/10 to-white/5 px-3 py-4 text-sm font-semibold text-white">
      <div
        className={`h-16 w-16 bg-white/80 ${shapeClassName[shape]}`}
        style={shape === 'triangle' ? { clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)' } : undefined}
      />
      <div className="text-xs uppercase tracking-[0.2em] text-white/70">
        {label}: {shape}
      </div>
      <div className="flex w-full flex-wrap items-center justify-center gap-2 text-[11px] font-medium uppercase tracking-[0.15em] text-white/80">
        <button
          type="button"
          onClick={handleToggle}
          className="rounded-full border border-white/20 px-3 py-1 transition hover:border-white/50 hover:text-white"
          aria-label={`${label} shape toggle`}
        >
          Toggle
        </button>
        <button
          type="button"
          onClick={() => {
            const randomShape = shapes[Math.floor(Math.random() * shapes.length)]
            store.updateNodeState(nodeId, { shape: randomShape })
          }}
          className="rounded-full border border-white/20 px-3 py-1 transition hover:border-white/50 hover:text-white"
          aria-label={`${label} random shape`}
        >
          Random
        </button>
      </div>
    </div>
  )
}

ShapeTileComponent.displayName = 'ShapeTile'

export const ShapeTile = ShapeTileComponent

export const ShapeTileFactory: ComponentFactory = (id) => <ShapeTile nodeId={id} />
