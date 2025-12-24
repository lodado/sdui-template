'use client'

import React, { useCallback } from 'react'
import type { ComponentFactory } from '@lodado/sdui-template'
import { useSduiNodeSubscription, useSduiLayoutAction } from '@lodado/sdui-template'
import { z } from 'zod'

/**
 * Toggle State 스키마
 */
const toggleStateSchema = z.object({
  grid: z.object({
    cols: z.number(),
    rowHeight: z.number(),
    margin: z.tuple([z.number(), z.number()]),
    compactType: z.enum(['vertical', 'horizontal']).nullable().optional(),
    preventCollision: z.boolean().optional(),
    isDraggable: z.boolean().optional(),
    isResizable: z.boolean().optional(),
    maxRows: z.number().optional(),
  }),
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
  checked: z.boolean(),
  label: z.string().optional(),
})

interface ToggleProps {
  id: string
}

export const Toggle: React.FC<ToggleProps> = ({ id }) => {
  const { state } = useSduiNodeSubscription({
    nodeId: id,
    schema: toggleStateSchema,
  })
  const store = useSduiLayoutAction()

  const { checked, label } = state

  const handleToggle = useCallback(() => {
    store.updateNodeState(id, {
      checked: !checked,
    })
  }, [id, checked, store])

  return (
    <div className="flex items-center gap-2 p-3 bg-white dark:bg-zinc-900 rounded-lg border border-zinc-200 dark:border-zinc-800 h-full">
      {label && (
        <label
          onClick={handleToggle}
          className="text-sm text-zinc-700 dark:text-zinc-300 cursor-pointer select-none"
        >
          {label}
        </label>
      )}
      <button
        type="button"
        onClick={handleToggle}
        className={`relative w-11 h-6 rounded-full transition-colors duration-200 ${
          checked ? 'bg-blue-600' : 'bg-zinc-400'
        }`}
        aria-label={label || 'Toggle'}
      >
        <span
          className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform duration-200 shadow-sm ${
            checked ? 'translate-x-5' : 'translate-x-0'
          }`}
        />
      </button>
    </div>
  )
}

export const ToggleFactory: ComponentFactory = (id) => <Toggle id={id} />

