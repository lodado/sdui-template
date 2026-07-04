import type { DragEndEvent, DragMoveEvent, DragStartEvent } from '@dnd-kit/core'
import {
  createProjectedBlockMovePatch,
  type ProjectedNestedBlockDrop,
  projectNestedBlockDrop,
  type SduiDocumentContent,
  type SduiDocumentPatch,
} from '@lodado/sdui-document'
import type { MutableRefObject } from 'react'
import { useState } from 'react'

type NestedBlockDragDropOptions = {
  docRef: MutableRefObject<SduiDocumentContent>
  indentWidth: number
  applyPatches(patches: SduiDocumentPatch[]): void
  onDragStart(): void
}

export function useNestedBlockDragDrop({ docRef, indentWidth, applyPatches, onDragStart }: NestedBlockDragDropOptions) {
  const [dropIndicator, setDropIndicator] = useState<ProjectedNestedBlockDrop | null>(null)

  const projectDrop = (event: DragMoveEvent | DragEndEvent): ProjectedNestedBlockDrop | null => {
    if (!event.over) {
      return null
    }

    return projectNestedBlockDrop({
      content: docRef.current,
      activeId: String(event.active.id),
      overId: String(event.over.id),
      offsetX: event.delta.x,
      indentWidth,
    })
  }

  const handleDragStart = (_event: DragStartEvent) => {
    onDragStart()
  }

  const handleDragMove = (event: DragMoveEvent) => {
    setDropIndicator(projectDrop(event))
  }

  const handleDragEnd = (event: DragEndEvent) => {
    setDropIndicator(null)
    if (!event.over) {
      return
    }

    const patch = createProjectedBlockMovePatch({
      content: docRef.current,
      activeId: String(event.active.id),
      overId: String(event.over.id),
      offsetX: event.delta.x,
      indentWidth,
    })
    if (patch) {
      applyPatches([patch])
    }
  }

  const handleDragCancel = () => {
    setDropIndicator(null)
  }

  return { dropIndicator, handleDragStart, handleDragMove, handleDragEnd, handleDragCancel }
}
