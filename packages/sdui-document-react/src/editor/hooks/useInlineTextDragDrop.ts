import type { InlineDragSource, SduiDocumentContent, SduiDocumentPatch } from '@lodado/sdui-document'
import { canHostInlineText, createInlineDragPatches, findBlockById } from '@lodado/sdui-document'
import type { MutableRefObject, RefObject } from 'react'
import { useEffect, useRef } from 'react'

import {
  caretRectAtDomPosition,
  inlineOffsetFromDomPosition,
  resolveCaretFromPoint,
} from '../../inline/domInlineOffsets'
import { positionDropCaretOverlay } from './dropCaretOverlay'
import { findInlineRoot, parseInlineDragSource } from './inlineDragDom'

/** dataTransfer type carrying the inline drag source across editor instances. */
export const INLINE_DRAG_MIME = 'application/x-sdui-inline'

export type UseInlineTextDragDropInput = {
  docRef: MutableRefObject<SduiDocumentContent>
  /** Editor root ([data-sdui-document-editor]); listeners attach here (delegation). */
  containerRef: RefObject<HTMLElement>
  /** The drop-caret overlay element (position:absolute inside the container). */
  caretRef: RefObject<HTMLElement>
  applyPatches(patches: SduiDocumentPatch[]): void
  /** Focus the drop target with the caret after the inserted fragment. */
  onDropFocus(blockId: string, caretOffset: number): void
  /**
   * Called (deferred) once a text drag has started. The editor clears focus
   * here so the focused PM editor unmounts and commits — from that point on
   * every block renders statically and the drop path is uniform.
   */
  onDragStart?(): void
  readOnly?: boolean
}

/**
 * ProseMirror-style inline text drag-and-drop across blocks.
 *
 * Native HTML5 drag (not dnd-kit — that channel is the block-structure drag,
 * activated only from the drag handle). The browser starts a drag when the
 * user drags an existing text selection; this hook captures the selection as
 * an inline offset range at dragstart, paints an insertion caret while
 * dragging, and applies block.update patches at drop.
 *
 * All listeners are delegated on the container (zero per-row props, zero
 * re-renders during the drag); the caret is painted via direct DOM mutation.
 */
export function useInlineTextDragDrop(input: UseInlineTextDragDropInput): void {
  const { docRef, containerRef, caretRef, readOnly = false } = input
  const sessionRef = useRef<InlineDragSource | null>(null)
  const latest = useRef(input)
  latest.current = input

  useEffect(() => {
    const container = containerRef.current
    if (readOnly || !container) {
      return undefined
    }

    const hideCaret = () => {
      if (caretRef.current) {
        positionDropCaretOverlay(caretRef.current, container, null)
      }
    }

    /** Deepest text-hosting block row (with its inline root) under an event target. */
    const resolveDropTarget = (target: EventTarget | null): { blockId: string; root: HTMLElement } | null => {
      if (!(target instanceof Node)) {
        return null
      }

      const element = target instanceof Element ? target : target.parentElement
      const row = element?.closest<HTMLElement>('[data-block-id]')
      const blockId = row?.getAttribute('data-block-id')
      if (!row || !blockId) {
        return null
      }

      const block = findBlockById(docRef.current, blockId)
      if (!block || !canHostInlineText(block)) {
        return null
      }

      // scope to this row's own content — nested child rows have their own roots
      const root = row.querySelector<HTMLElement>(':scope > [data-block-row] [data-inline-root]')

      return root ? { blockId, root } : null
    }

    const isInlineDrag = (event: DragEvent): boolean =>
      sessionRef.current !== null || (event.dataTransfer?.types.includes(INLINE_DRAG_MIME) ?? false)

    const handleDragStart = (event: DragEvent) => {
      const selection = container.ownerDocument.defaultView?.getSelection()
      if (!selection || selection.isCollapsed || selection.rangeCount === 0 || !selection.anchorNode) {
        return
      }

      // the whole selection AND the drag origin must live in one block's inline root
      const root = findInlineRoot(selection.anchorNode)
      if (!root || findInlineRoot(selection.focusNode) !== root || findInlineRoot(event.target as Node) !== root) {
        return
      }

      const blockId = root.closest('[data-block-id]')?.getAttribute('data-block-id')
      if (!blockId) {
        return
      }

      const anchor = inlineOffsetFromDomPosition(root, selection.anchorNode, selection.anchorOffset)
      const focus = selection.focusNode
        ? inlineOffsetFromDomPosition(root, selection.focusNode, selection.focusOffset)
        : null
      if (anchor === null || focus === null || anchor === focus) {
        return
      }

      sessionRef.current = { blockId, from: Math.min(anchor, focus), to: Math.max(anchor, focus) }

      const transfer = event.dataTransfer
      if (transfer) {
        transfer.effectAllowed = 'copyMove'
        transfer.setData(INLINE_DRAG_MIME, JSON.stringify(sessionRef.current))
        transfer.setData('text/plain', selection.toString())
      }

      // Deferred so the browser fully starts the drag before the focused PM
      // editor unmounts (its unmount commit persists any typed text; the drag
      // itself survives source DOM replacement per the HTML5 drag model).
      // Skipped when the drag already ended — a late focus-clear would undo
      // the drop's own focus.
      setTimeout(() => {
        if (sessionRef.current) {
          latest.current.onDragStart?.()
        }
      }, 0)
    }

    const handleDragOver = (event: DragEvent) => {
      if (!isInlineDrag(event)) {
        return
      }

      const drop = resolveDropTarget(event.target)
      if (!drop) {
        hideCaret()

        return
      }

      event.preventDefault()
      const transfer = event.dataTransfer
      if (transfer) {
        transfer.dropEffect = event.altKey ? 'copy' : 'move'
      }

      const caret = resolveCaretFromPoint(container.ownerDocument, event.clientX, event.clientY)
      if (caretRef.current) {
        const rect =
          caret && drop.root.contains(caret.node)
            ? caretRectAtDomPosition(caret, drop.root)
            : caretRectAtDomPosition({ node: drop.root, offset: drop.root.childNodes.length }, drop.root)
        positionDropCaretOverlay(caretRef.current, container, rect)
      }
    }

    const resolveDropOffset = (root: HTMLElement, event: DragEvent): number => {
      const caret = resolveCaretFromPoint(container.ownerDocument, event.clientX, event.clientY)
      if (caret && root.contains(caret.node)) {
        const offset = inlineOffsetFromDomPosition(root, caret.node, caret.offset)
        if (offset !== null) {
          return offset
        }
      }

      // point missed the text (padding/margin): snap to start or end by x
      const rect = root.getBoundingClientRect()

      return event.clientX <= rect.left ? 0 : Number.MAX_SAFE_INTEGER
    }

    const readSession = (event: DragEvent): InlineDragSource | null => {
      if (sessionRef.current) {
        return sessionRef.current
      }

      const raw = event.dataTransfer?.getData(INLINE_DRAG_MIME)

      return raw ? parseInlineDragSource(raw) : null
    }

    const handleDrop = (event: DragEvent) => {
      if (!isInlineDrag(event)) {
        return
      }

      const session = readSession(event)
      sessionRef.current = null
      hideCaret()

      const drop = resolveDropTarget(event.target)
      if (!session || !drop) {
        return
      }

      event.preventDefault()
      event.stopPropagation()

      const result = createInlineDragPatches({
        content: docRef.current,
        source: session,
        targetBlockId: drop.blockId,
        targetOffset: resolveDropOffset(drop.root, event),
        copy: event.altKey,
      })
      if (!result) {
        return
      }

      latest.current.applyPatches(result.patches)
      latest.current.onDropFocus(result.focusBlockId, result.caretOffset)
    }

    const handleDragEnd = () => {
      sessionRef.current = null
      hideCaret()
    }

    const handleDragLeave = (event: DragEvent) => {
      if (!(event.relatedTarget instanceof Node) || !container.contains(event.relatedTarget)) {
        hideCaret()
      }
    }

    container.addEventListener('dragstart', handleDragStart)
    container.addEventListener('dragover', handleDragOver)
    container.addEventListener('drop', handleDrop)
    container.addEventListener('dragend', handleDragEnd)
    container.addEventListener('dragleave', handleDragLeave)

    return () => {
      container.removeEventListener('dragstart', handleDragStart)
      container.removeEventListener('dragover', handleDragOver)
      container.removeEventListener('drop', handleDrop)
      container.removeEventListener('dragend', handleDragEnd)
      container.removeEventListener('dragleave', handleDragLeave)
    }
    // container/caret refs are stable per editor instance; live values via `latest`
  }, [readOnly, containerRef, caretRef, docRef])
}
