'use client'

import type { ComponentFactory } from '@lodado/sdui-template'
import { useSduiLayoutAction, useSduiNodeSubscription } from '@lodado/sdui-template'
import React from 'react'

const shapes = ['square', 'triangle', 'circle'] as const

type ShapeType = (typeof shapes)[number]

type ShapeTileState = {
  shape?: ShapeType
  label?: string
}

const shapeClassName: Record<ShapeType, string> = {
  square: 'rounded-xl',
  triangle: 'rounded-none',
  circle: 'rounded-full',
}

const ShapeTileComponent: React.FC<{ nodeId: string }> = ({ nodeId }) => {
  const store = useSduiLayoutAction()
  const { state } = useSduiNodeSubscription({ nodeId })
  const typedState = state as ShapeTileState | undefined

  const shape = typedState?.shape ?? 'square'
  const label = typedState?.label ?? 'Shape'

  const handleToggle = () => {
    const currentIndex = shapes.indexOf(shape)
    const nextShape = shapes[(currentIndex + 1) % shapes.length]
    store.updateNodeState(nodeId, { shape: nextShape })
  }

  return (
    <button
      type="button"
      onClick={handleToggle}
      className="flex h-full w-full flex-col items-center justify-center gap-3 bg-gradient-to-br from-white/10 to-white/5 text-sm font-semibold text-white"
      aria-label={`${label} shape toggle`}
    >
      <div
        className={`h-16 w-16 bg-white/80 ${shapeClassName[shape]}`}
        style={shape === 'triangle' ? { clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)' } : undefined}
      />
      <div className="text-xs uppercase tracking-[0.2em] text-white/70">
        {label}: {shape}
      </div>
    </button>
  )
}

ShapeTileComponent.displayName = 'ShapeTile'

export const ShapeTile = ShapeTileComponent

export const ShapeTileFactory: ComponentFactory = (id) => <ShapeTile nodeId={id} />
