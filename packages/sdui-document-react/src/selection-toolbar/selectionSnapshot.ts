import type { Attrs, MarkType } from 'prosemirror-model'
import type { EditorState } from 'prosemirror-state'
import type { EditorView } from 'prosemirror-view'

import { focusedBlockSchema } from '../focused-block/pm/schema'
import { MARK_DEFINITIONS } from '../marks'

export type SelectionAnchorRect = {
  left: number
  top: number
  width: number
  height: number
}

/** What the toolbar needs to render — derived from PM state per transaction. */
export type SelectionSnapshot = {
  empty: boolean
  from: number
  to: number
  /** mark name -> active over the current selection */
  activeMarks: Record<string, boolean>
  /** color of the highlight mark under the selection, if any */
  highlightColor: string | null
  /** href of the link mark under the selection, if any */
  linkHref: string | null
  /** viewport rect spanning the selection (null when unmeasurable, e.g. jsdom) */
  anchorRect: SelectionAnchorRect | null
}

/**
 * Outline's isMarkActive: empty selection checks stored/caret marks,
 * ranged selection checks rangeHasMark.
 */
export function isMarkActive(state: EditorState, type: MarkType): boolean {
  const { empty, from, to, $from } = state.selection

  if (empty) {
    return Boolean(type.isInSet(state.storedMarks ?? $from.marks()))
  }

  return state.doc.rangeHasMark(from, to, type)
}

/** First attrs of `type` found inside the selection range (Outline getMarkAttrs). */
export function getMarkAttrsInSelection(state: EditorState, type: MarkType): Attrs | null {
  const { from, to } = state.selection
  let found: Attrs | null = null

  state.doc.nodesBetween(from, to, (node) => {
    if (found) {
      return false
    }

    const mark = type.isInSet(node.marks)
    if (mark) {
      found = mark.attrs
    }

    return !found
  })

  return found
}

/** Selection rect in viewport coords — coordsAtPos is DOM-dependent (jsdom-safe). */
function measureAnchorRect(view: EditorView, from: number, to: number): SelectionAnchorRect | null {
  try {
    const start = view.coordsAtPos(from)
    const end = view.coordsAtPos(to, -1)

    return {
      left: Math.min(start.left, end.left),
      top: Math.min(start.top, end.top),
      width: Math.max(Math.abs(end.right - start.left), 1),
      height: Math.max(end.bottom - start.top, 1),
    }
  } catch {
    return null
  }
}

export function buildSelectionSnapshot(view: EditorView): SelectionSnapshot {
  const { state } = view
  const { empty, from, to } = state.selection

  const activeMarks = MARK_DEFINITIONS.reduce<Record<string, boolean>>(
    (active, definition) => ({
      ...active,
      [definition.name]: isMarkActive(state, focusedBlockSchema.marks[definition.name]),
    }),
    {},
  )

  const highlightAttrs = activeMarks.highlight
    ? getMarkAttrsInSelection(state, focusedBlockSchema.marks.highlight)
    : null
  const linkAttrs = activeMarks.link ? getMarkAttrsInSelection(state, focusedBlockSchema.marks.link) : null

  return {
    empty,
    from,
    to,
    activeMarks,
    highlightColor: highlightAttrs ? String(highlightAttrs.color) : null,
    linkHref: linkAttrs ? String(linkAttrs.href) : null,
    anchorRect: empty ? null : measureAnchorRect(view, from, to),
  }
}

export function selectionSnapshotsEqual(a: SelectionSnapshot, b: SelectionSnapshot): boolean {
  return (
    a.empty === b.empty &&
    a.from === b.from &&
    a.to === b.to &&
    a.highlightColor === b.highlightColor &&
    a.linkHref === b.linkHref &&
    MARK_DEFINITIONS.every((definition) => a.activeMarks[definition.name] === b.activeMarks[definition.name]) &&
    a.anchorRect?.left === b.anchorRect?.left &&
    a.anchorRect?.top === b.anchorRect?.top &&
    a.anchorRect?.width === b.anchorRect?.width &&
    a.anchorRect?.height === b.anchorRect?.height
  )
}
