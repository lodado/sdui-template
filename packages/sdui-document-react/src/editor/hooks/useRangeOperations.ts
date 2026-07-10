import type {
  BlockAlign,
  SduiDocumentContent,
  SduiDocumentPatch,
  SduiInlineContent,
  SduiInlineMark,
} from '@lodado/sdui-document'
import { createBlockId, findBlockById, resolveBlockAlign } from '@lodado/sdui-document'
import type React from 'react'
import { useEffect, useRef, useState } from 'react'

import type { NormalizedRange } from '../../inline/docRange'
import { normalizeDocRange, readDocRangeFromDom } from '../../inline/docRange'
import { domPositionFromInlineOffset } from '../../inline/domInlineOffsets'
import { inlineToHtml } from '../../inline/inlineToHtml'
import type { SelectionSnapshot } from '../../selection-toolbar/selectionSnapshot'
import { rafThrottle } from '../../shared/rafThrottle'
import {
  computeRangeReplacePatches,
  computeSetRangeMark,
  computeToggleRangeMark,
  isRangeMarkActive,
  parseInlineClipboard,
  SDUI_INLINE_MIME,
  serializeRangeInline,
  serializeRangeText,
  uniformRangeAttr,
} from '../rangePatchLogic'
import type { EditorUIStore, FocusTarget } from '../uiStore'

/** Mark names the cross-block toolbar reflects an active state for. */
/** A single bare http(s) URL (no surrounding whitespace) — pasted → linkified. */
const URL_PASTE_RE = /^https?:\/\/\S+$/i

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
  onToggleMark: (name: 'bold' | 'italic' | 'underline' | 'strikethrough' | 'code') => void
  onSetHighlight: (color: string | null) => void
  onSetColor: (color: string | null) => void
  onSetLink: (href: string | null) => void
  /**
   * Block alignment for a SINGLE-block range only (align is a block property,
   * ambiguous across blocks). Absent for cross-block ranges.
   */
  blockAlign?: BlockAlign | null
  onSetAlign?: (align: BlockAlign | null) => void
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
 *
 * Imperative shell: DOM selection reads/writes, event handling, and patch
 * application live here; the range→patch decisions live in ../rangePatchLogic.
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
    if (!normalized) {
      return null
    }
    // Cross-block ranges are always ours. A single-block range belongs to the
    // focused PM editor when THAT block is focused (PM transactions + stored
    // marks). But a drag-select never focuses first (BlockNode skips focusing a
    // non-collapsed selection to preserve it), so an unfocused/static block has
    // no PM — the document owns its selection here so the toolbar still appears.
    if (!normalized.isCrossBlock && normalized.start.blockId === store.get().focus?.blockId) {
      return null
    }
    return normalized
  }

  // Effect runner for the pure replace decision: apply patches, drop the now
  // stale native selection, put the caret at the join point.
  const mutateRange = (range: NormalizedRange, insert: string | SduiInlineContent) => {
    const { patches, caret } = computeRangeReplacePatches(docRef.current, range, insert)

    applyPatches(patches)
    containerRef.current?.ownerDocument.getSelection()?.removeAllRanges()
    if (caret) {
      focusBlock(caret.blockId, caret.offset)
    }
  }

  const applyMarkPatches = (patches: SduiDocumentPatch[]) => {
    if (patches.length > 0) {
      applyPatches(patches)
    }
  }

  const toggleRangeMark = (range: NormalizedRange, mark: SduiInlineMark) => {
    applyMarkPatches(computeToggleRangeMark(docRef.current, range, mark))
  }

  const setRangeMark = (range: NormalizedRange, markType: string, mark: SduiInlineMark | null) => {
    applyMarkPatches(computeSetRangeMark(docRef.current, range, markType, mark))
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
      activeMarks[name] = isRangeMarkActive(docRef.current, range, name)
    })
    activeMarks.highlight = isRangeMarkActive(docRef.current, range, 'highlight')
    activeMarks.color = isRangeMarkActive(docRef.current, range, 'color')
    activeMarks.link = isRangeMarkActive(docRef.current, range, 'link')

    return {
      empty: false,
      from: range.start.offset,
      to: range.end.offset,
      activeMarks,
      highlightColor: uniformRangeAttr(docRef.current, range, 'highlight', 'color'),
      textColor: uniformRangeAttr(docRef.current, range, 'color', 'color'),
      linkHref: uniformRangeAttr(docRef.current, range, 'link', 'href'),
      anchorRect,
    }
  }

  const [toolbarSnapshot, setToolbarSnapshot] = useState<SelectionSnapshot | null>(null)
  // Alignment is a block property, so it only makes sense for a single-block
  // range; null for cross-block (ambiguous) or no selection.
  const [alignTarget, setAlignTarget] = useState<{ blockId: string; align: BlockAlign | null } | null>(null)

  // Recompute lives behind a ref so the selectionchange listener stays stable
  // while still reading the latest closures/refs.
  const refreshRef = useRef<() => void>(() => {})
  refreshRef.current = () => {
    const range = currentRange()
    setToolbarSnapshot(range ? buildSnapshot(range) : null)
    if (range && !range.isCrossBlock) {
      const block = findBlockById(docRef.current, range.start.blockId)
      setAlignTarget({ blockId: range.start.blockId, align: resolveBlockAlign(block?.attributes?.align) ?? null })
    } else {
      setAlignTarget(null)
    }
  }
  useEffect(() => {
    const onSelectionChange = () => refreshRef.current()
    document.addEventListener('selectionchange', onSelectionChange)
    // Scroll/resize don't fire selectionchange, so the toolbar's fixed anchor
    // (measured from the live selection rect) goes stale and detaches from the
    // text. Re-measure so it tracks. Capture phase catches nested scrollers.
    // rAF-throttle: scroll can fire several times per frame — collapse the
    // re-measure to one paint-aligned read.
    const onReposition = rafThrottle(() => refreshRef.current())
    window.addEventListener('scroll', onReposition, true)
    window.addEventListener('resize', onReposition)
    return () => {
      document.removeEventListener('selectionchange', onSelectionChange)
      onReposition.cancel()
      window.removeEventListener('scroll', onReposition, true)
      window.removeEventListener('resize', onReposition)
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
          onToggleMark: (name) =>
            runToolbarMutation((range) => toggleRangeMark(range, { type: name } as SduiInlineMark)),
          onSetHighlight: (color) =>
            runToolbarMutation((range) =>
              setRangeMark(
                range,
                'highlight',
                color ? ({ type: 'highlight', attrs: { color } } as SduiInlineMark) : null,
              ),
            ),
          onSetColor: (color) =>
            runToolbarMutation((range) =>
              setRangeMark(range, 'color', color ? ({ type: 'color', attrs: { color } } as SduiInlineMark) : null),
            ),
          onSetLink: (href) =>
            runToolbarMutation((range) =>
              setRangeMark(range, 'link', href ? ({ type: 'link', attrs: { href } } as SduiInlineMark) : null),
            ),
          // Single-block only: expose the block's alignment so a static/unfocused
          // block gets the same align controls the focused editor has.
          ...(alignTarget
            ? {
                blockAlign: alignTarget.align,
                onSetAlign: (next: BlockAlign | null) =>
                  runToolbarMutation((range) =>
                    applyPatches([
                      {
                        type: 'block.update',
                        blockId: createBlockId(range.start.blockId),
                        attributes: { align: next ?? undefined },
                      },
                    ]),
                  ),
              }
            : {}),
        }

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
      // text/plain for external targets; text/html so a paste landing in a
      // focused block (PM handles text/html natively) keeps marks + hard breaks;
      // a private mime for the cross-block range paste path (see paste branch).
      const inline = serializeRangeInline(docRef.current, range)
      event.clipboardData?.setData('text/plain', serializeRangeText(docRef.current, range))
      event.clipboardData?.setData('text/html', inlineToHtml(inline))
      event.clipboardData?.setData(SDUI_INLINE_MIME, JSON.stringify(inline))
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
      // Prefer the private mime (mark-preserving); fall back to plain text.
      const rich = parseInlineClipboard(event.clipboardData?.getData(SDUI_INLINE_MIME))
      if (rich) {
        mutateRange(range, rich)
        return true
      }

      // Pasting a bare URL over a text selection linkifies the selection (keeps
      // the text) — Notion behavior. ponytail: the collapsed-caret case (insert
      // URL as a link) overlaps autolink-on-type and fights the focused-PM paste
      // routing; add it there if a request lands.
      const plain = event.clipboardData?.getData('text/plain') ?? ''
      const url = plain.trim()
      const hasSelection = range.isCrossBlock || range.start.offset !== range.end.offset
      if (hasSelection && URL_PASTE_RE.test(url)) {
        setRangeMark(range, 'link', { type: 'link', attrs: { href: url } } as unknown as SduiInlineMark)
        return true
      }

      // ponytail: multi-line plain paste collapses newlines to spaces (single block);
      // splitting into blocks per line can come later.
      const text = plain.replace(/\r?\n/g, ' ')
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
        toggleRangeMark(range, shortcut.mark)
        return true
      }
    }

    return false
  }

  return { handleRangeKeyDown, handleClipboard, toolbar }
}
