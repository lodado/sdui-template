import type {
  SduiDocumentBlock,
  SduiDocumentContent,
  SduiDocumentPatch,
  SduiInlineContent,
  SduiInlineMark,
} from '@lodado/sdui-document'
import { createBlockId, findBlockById, getInlineContentLength, inlineState } from '@lodado/sdui-document'
import type React from 'react'
import { useEffect, useRef, useState } from 'react'

import { deleteInlineRange } from '../../inline/deleteInlineRange'
import type { NormalizedRange } from '../../inline/docRange'
import { normalizeDocRange, readDocRangeFromDom } from '../../inline/docRange'
import { domPositionFromInlineOffset } from '../../inline/domInlineOffsets'
import {
  addMarkInRange,
  coveredTextSegments,
  rangeHasMark,
  rangeMarkAttr,
  removeMarkInRange,
} from '../../inline/inlineRangeMarks'
import type { SelectionSnapshot } from '../../selection-toolbar/selectionSnapshot'
import { blockInlineContent, isTextBlock } from '../blockContent'
import type { EditorUIStore, FocusTarget } from '../uiStore'

/** Mark names the cross-block toolbar reflects an active state for. */
const TOOLBAR_MARK_NAMES = ['bold', 'italic', 'strikethrough', 'code', 'underline'] as const

function key(event: KeyboardEvent): string {
  return event.key.toLowerCase()
}

/** Mark shortcuts mirrored from the per-mark PM keymaps (marks/<name>/keys). */
const MARK_SHORTCUTS: ReadonlyArray<{ matches: (event: KeyboardEvent) => boolean; mark: SduiInlineMark }> = [
  { matches: (e) => key(e) === 'b' && !e.shiftKey, mark: { type: 'bold' } },
  { matches: (e) => key(e) === 'i' && !e.shiftKey, mark: { type: 'italic' } },
  { matches: (e) => key(e) === 'u' && !e.shiftKey, mark: { type: 'underline' } },
  { matches: (e) => key(e) === 'd' && !e.shiftKey, mark: { type: 'strikethrough' } },
  { matches: (e) => key(e) === 'e' || (e.shiftKey && key(e) === 'c'), mark: { type: 'code' } },
]

export type UseRangeOperationsInput = {
  store: EditorUIStore
  docRef: React.MutableRefObject<SduiDocumentContent>
  containerRef: React.RefObject<HTMLElement>
  readOnly: boolean
  applyPatches: (patches: SduiDocumentPatch[]) => void
  focusBlock: (blockId: string, caret: FocusTarget['caret']) => void
}

/** Props the editor feeds straight into SelectionToolbar for a cross-block range. */
export type CrossBlockToolbar = {
  snapshot: SelectionSnapshot
  onToggleMark: (name: 'bold' | 'italic' | 'strikethrough' | 'code') => void
  onSetHighlight: (color: string | null) => void
  onSetColor: (color: string | null) => void
  onSetLink: (href: string | null) => void
}

export type UseRangeOperationsResult = {
  /**
   * Document-level keydown handler for cross-block native selections. Returns
   * true when it consumed the event (caller should stop there). A single-block
   * or absent range is left untouched so the focused PM editor owns it.
   */
  handleRangeKeyDown: (event: KeyboardEvent) => boolean
  /** copy/cut/paste for cross-block selections. Return true = event consumed. */
  handleClipboard: (event: ClipboardEvent) => boolean
  /** Toolbar props while a cross-block selection is active, else null. */
  toolbar: CrossBlockToolbar | null
}

/**
 * Cross-block range operations for the hybrid editor. Only a native selection
 * that spans two or more blocks reaches here (no single ProseMirror instance
 * owns it); everything is expressed as document patches so undo/redo is free.
 */
export function useRangeOperations(input: UseRangeOperationsInput): UseRangeOperationsResult {
  const { store, docRef, containerRef, readOnly, applyPatches, focusBlock } = input

  const currentRange = (): NormalizedRange | null => {
    const container = containerRef.current
    if (!container) {
      return null
    }
    // Block-selection mode (⠿ handle / Escape) is handled by useSelectionKeyboard.
    if (store.get().selection.selectedIds.length > 0) {
      return null
    }
    const range = readDocRangeFromDom(container)
    if (!range) {
      return null
    }
    const normalized = normalizeDocRange(docRef.current, range)
    return normalized?.isCrossBlock ? normalized : null
  }

  // Notion delete/replace: the surviving prefix of the start block, the typed
  // text (empty for a plain delete), and the suffix of the end block merge into
  // one block; every block between them is removed.
  const mutateRange = (range: NormalizedRange, insertText: string) => {
    const startBlock = findBlockById(docRef.current, range.start.blockId)
    const endBlock = findBlockById(docRef.current, range.end.blockId)
    const startIsText = startBlock !== undefined && isTextBlock(startBlock)
    const endIsText = endBlock !== undefined && isTextBlock(endBlock)

    const patches: SduiDocumentPatch[] = []
    let caretTarget: { blockId: string; offset: number } | null = null

    if (startIsText) {
      const head = deleteInlineRange(
        blockInlineContent(startBlock),
        range.start.offset,
        getInlineContentLength(blockInlineContent(startBlock)),
      )
      const tail = endIsText ? deleteInlineRange(blockInlineContent(endBlock), 0, range.end.offset) : []
      // ponytail: typed text is plain; mark inheritance from the left edge can come later
      const inserted = insertText ? [{ type: 'text' as const, text: insertText }] : []
      patches.push({
        type: 'block.update',
        blockId: createBlockId(range.start.blockId),
        state: inlineState([...head, ...inserted, ...tail]),
      })
      // delete everything after the start block, up to and including the end
      range.blockIds.slice(1).forEach((id) => patches.push({ type: 'block.delete', blockId: createBlockId(id) }))
      caretTarget = { blockId: range.start.blockId, offset: range.start.offset + insertText.length }
    } else {
      // start is non-text (image/divider): drop it and the middles; keep the
      // end block's suffix if it is text.
      range.blockIds.slice(0, -1).forEach((id) => patches.push({ type: 'block.delete', blockId: createBlockId(id) }))
      if (endIsText) {
        patches.push({
          type: 'block.update',
          blockId: createBlockId(range.end.blockId),
          state: inlineState(deleteInlineRange(blockInlineContent(endBlock), 0, range.end.offset)),
        })
        caretTarget = { blockId: range.end.blockId, offset: 0 }
      } else {
        patches.push({ type: 'block.delete', blockId: createBlockId(range.end.blockId) })
      }
    }

    applyPatches(patches)
    containerRef.current?.ownerDocument.getSelection()?.removeAllRanges()
    if (caretTarget) {
      focusBlock(caretTarget.blockId, caretTarget.offset)
    }
  }

  // Each covered block's own sub-range: the start block from its offset, the
  // end block up to its offset, the middles in full.
  const perBlockRange = (range: NormalizedRange, block: SduiDocumentBlock): [number, number] => {
    const from = block.id === range.start.blockId ? range.start.offset : 0
    const to = block.id === range.end.blockId ? range.end.offset : getInlineContentLength(blockInlineContent(block))
    return [from, to]
  }

  const coveredTextBlocks = (range: NormalizedRange): SduiDocumentBlock[] =>
    range.blockIds
      .map((id) => findBlockById(docRef.current, id))
      .filter((block): block is SduiDocumentBlock => block !== undefined && isTextBlock(block))

  const isMarkActive = (range: NormalizedRange, markType: string): boolean => {
    const blocks = coveredTextBlocks(range)
    return (
      blocks.length > 0 &&
      blocks.every((block) => {
        const [from, to] = perBlockRange(range, block)
        return rangeHasMark(blockInlineContent(block), from, to, markType)
      })
    )
  }

  // Uniform attr value across the range, or null on a mixed selection.
  const uniformAttr = (range: NormalizedRange, markType: string, attrKey: string): string | null => {
    const blocks = coveredTextBlocks(range)
    if (blocks.length === 0) {
      return null
    }
    const values = blocks.map((block) => {
      const [from, to] = perBlockRange(range, block)
      return rangeMarkAttr(blockInlineContent(block), from, to, markType, attrKey)
    })
    return values.some((value) => value === null) || !values.every((value) => value === values[0]) ? null : values[0]
  }

  // Patch every covered text block's sub-range with `apply` (add/remove a mark).
  const patchRangeMarks = (
    range: NormalizedRange,
    apply: (content: SduiInlineContent, from: number, to: number) => SduiInlineContent,
  ) => {
    const blocks = coveredTextBlocks(range)
    if (blocks.length === 0) {
      return
    }
    const patches: SduiDocumentPatch[] = blocks.map((block) => {
      const [from, to] = perBlockRange(range, block)
      return {
        type: 'block.update',
        blockId: createBlockId(block.id),
        state: inlineState(apply(blockInlineContent(block), from, to)),
      }
    })
    applyPatches(patches)
  }

  // Toggle a mark across the range: if every covered text segment already has
  // it, remove; otherwise add (Notion's whole-selection toggle semantics).
  const toggleMark = (range: NormalizedRange, mark: SduiInlineMark) => {
    const allMarked = isMarkActive(range, mark.type)
    patchRangeMarks(range, (content, from, to) =>
      allMarked ? removeMarkInRange(content, from, to, mark.type) : addMarkInRange(content, from, to, mark),
    )
  }

  // Set (mark != null) or clear (mark == null) a mark across the range — used
  // for color / highlight / link where the value replaces rather than toggles.
  const setMark = (range: NormalizedRange, markType: string, mark: SduiInlineMark | null) => {
    patchRangeMarks(range, (content, from, to) =>
      mark ? addMarkInRange(content, from, to, mark) : removeMarkInRange(content, from, to, markType),
    )
  }

  // Re-derive the browser selection after a cross-block edit re-renders the
  // static DOM (nodes are recreated, so the old Selection is stale). Block ids
  // survive a mark toggle, so the range endpoints stay valid.
  const restoreSelection = (range: NormalizedRange) => {
    const container = containerRef.current
    if (!container) {
      return
    }
    const startRoot = container.querySelector(`[data-block-id="${range.start.blockId}"] [data-inline-root]`)
    const endRoot = container.querySelector(`[data-block-id="${range.end.blockId}"] [data-inline-root]`)
    if (!startRoot || !endRoot) {
      return
    }
    const start = domPositionFromInlineOffset(startRoot, range.start.offset)
    const end = domPositionFromInlineOffset(endRoot, range.end.offset)
    const selection = container.ownerDocument.getSelection()
    const domRange = container.ownerDocument.createRange()
    domRange.setStart(start.node, start.offset)
    domRange.setEnd(end.node, end.offset)
    selection?.removeAllRanges()
    selection?.addRange(domRange)
  }

  const buildSnapshot = (range: NormalizedRange): SelectionSnapshot => {
    const selection = containerRef.current?.ownerDocument.getSelection()
    const rect = selection && selection.rangeCount > 0 ? selection.getRangeAt(0).getBoundingClientRect() : null
    const anchorRect =
      rect && (rect.width > 0 || rect.height > 0)
        ? { left: rect.left, top: rect.top, width: rect.width, height: rect.height }
        : null

    const activeMarks: Record<string, boolean> = {}
    TOOLBAR_MARK_NAMES.forEach((name) => {
      activeMarks[name] = isMarkActive(range, name)
    })
    activeMarks.highlight = isMarkActive(range, 'highlight')
    activeMarks.color = isMarkActive(range, 'color')
    activeMarks.link = isMarkActive(range, 'link')

    return {
      empty: false,
      from: range.start.offset,
      to: range.end.offset,
      activeMarks,
      highlightColor: uniformAttr(range, 'highlight', 'color'),
      textColor: uniformAttr(range, 'color', 'color'),
      linkHref: uniformAttr(range, 'link', 'href'),
      anchorRect,
    }
  }

  const [toolbarSnapshot, setToolbarSnapshot] = useState<SelectionSnapshot | null>(null)

  // Recompute lives behind a ref so the selectionchange listener stays stable
  // while still reading the latest closures/refs.
  const refreshRef = useRef<() => void>(() => {})
  refreshRef.current = () => {
    const range = currentRange()
    setToolbarSnapshot(range ? buildSnapshot(range) : null)
  }
  useEffect(() => {
    const onSelectionChange = () => refreshRef.current()
    document.addEventListener('selectionchange', onSelectionChange)
    // Scroll/resize don't fire selectionchange, so the toolbar's fixed anchor
    // (measured from the live selection rect) goes stale and detaches from the
    // text. Re-measure so it tracks. Capture phase catches nested scrollers.
    window.addEventListener('scroll', onSelectionChange, true)
    window.addEventListener('resize', onSelectionChange)
    return () => {
      document.removeEventListener('selectionchange', onSelectionChange)
      window.removeEventListener('scroll', onSelectionChange, true)
      window.removeEventListener('resize', onSelectionChange)
    }
  }, [])

  // Run a range mutation for a toolbar action, then restore the native
  // selection (the re-render recreated the DOM nodes) so the toolbar stays open
  // and marks can be chained.
  const runToolbarMutation = (mutate: (range: NormalizedRange) => void) => {
    const range = currentRange()
    if (!range) {
      return
    }
    mutate(range)
    const restore = () => {
      restoreSelection(range)
      refreshRef.current()
    }
    if (typeof requestAnimationFrame === 'function') {
      requestAnimationFrame(restore)
    } else {
      restore()
    }
  }

  const toolbar: CrossBlockToolbar | null =
    toolbarSnapshot === null
      ? null
      : {
          snapshot: toolbarSnapshot,
          onToggleMark: (name) => runToolbarMutation((range) => toggleMark(range, { type: name } as SduiInlineMark)),
          onSetHighlight: (color) =>
            runToolbarMutation((range) =>
              setMark(range, 'highlight', color ? ({ type: 'highlight', attrs: { color } } as SduiInlineMark) : null),
            ),
          onSetColor: (color) =>
            runToolbarMutation((range) =>
              setMark(range, 'color', color ? ({ type: 'color', attrs: { color } } as SduiInlineMark) : null),
            ),
          onSetLink: (href) =>
            runToolbarMutation((range) =>
              setMark(range, 'link', href ? ({ type: 'link', attrs: { href } } as SduiInlineMark) : null),
            ),
        }

  // Plain-text serialization of the range: each covered block's covered slice,
  // joined by newlines (one line per block).
  const serializeRangeText = (range: NormalizedRange): string =>
    coveredTextBlocks(range)
      .map((block) => {
        const [from, to] = perBlockRange(range, block)
        return coveredTextSegments(blockInlineContent(block), from, to)
          .map((segment) => segment.text)
          .join('')
      })
      .join('\n')

  const handleClipboard = (event: ClipboardEvent): boolean => {
    const range = currentRange()
    if (!range) {
      return false
    }

    if (event.type === 'copy' || event.type === 'cut') {
      // cut also mutates, so it needs an editable surface
      if (event.type === 'cut' && readOnly) {
        return false
      }
      event.preventDefault()
      event.clipboardData?.setData('text/plain', serializeRangeText(range))
      if (event.type === 'cut') {
        mutateRange(range, '')
      }
      return true
    }

    if (event.type === 'paste') {
      if (readOnly) {
        return false
      }
      event.preventDefault()
      // ponytail: multi-line paste collapses newlines to spaces (single block);
      // splitting into blocks per line can come later.
      const text = (event.clipboardData?.getData('text/plain') ?? '').replace(/\r?\n/g, ' ')
      mutateRange(range, text)
      return true
    }

    return false
  }

  const handleRangeKeyDown = (event: KeyboardEvent): boolean => {
    if (readOnly) {
      return false
    }

    // Backspace/Delete and Enter both collapse the range (Notion merges the
    // surrounding text; Enter does not additionally split a multi-block delete).
    if (event.key === 'Backspace' || event.key === 'Delete' || event.key === 'Enter') {
      const range = currentRange()
      if (!range) {
        return false
      }
      event.preventDefault()
      mutateRange(range, '')
      return true
    }

    // Printable character (no modifier): replace the selection with it, then the
    // freshly focused start block's PM editor takes over subsequent typing.
    if (!event.metaKey && !event.ctrlKey && !event.altKey && event.key.length === 1) {
      const range = currentRange()
      if (!range) {
        return false
      }
      event.preventDefault()
      mutateRange(range, event.key)
      return true
    }

    if (event.metaKey || event.ctrlKey) {
      const shortcut = MARK_SHORTCUTS.find((entry) => entry.matches(event))
      if (shortcut) {
        const range = currentRange()
        if (!range) {
          return false
        }
        event.preventDefault()
        toggleMark(range, shortcut.mark)
        return true
      }
    }

    return false
  }

  return { handleRangeKeyDown, handleClipboard, toolbar }
}
