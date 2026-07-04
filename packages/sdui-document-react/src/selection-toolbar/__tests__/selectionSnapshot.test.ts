import type { SduiInlineContent } from '@lodado/sdui-document'
import type { EditorState, Transaction } from 'prosemirror-state'
import { TextSelection } from 'prosemirror-state'
import type { EditorView } from 'prosemirror-view'

import { createFocusedBlockEditorState } from '../../focused-block/pm/editorState'
import type { FocusedBlockCallbacks } from '../../focused-block/pm/keymapDelegation'
import { focusedBlockSchema } from '../../focused-block/pm/schema'
import { buildSelectionSnapshot, isMarkActive, selectionSnapshotsEqual } from '../selectionSnapshot'

const noopCallbacks: FocusedBlockCallbacks = {
  onSplit: () => {},
  onMergeBackward: () => {},
  onIndent: () => {},
  onOutdent: () => {},
  onNavigate: () => {},
  onTurnInto: () => {},
  onEscape: () => {},
}

function stateWithSelection(content: SduiInlineContent, from: number, to: number): EditorState {
  const state = createFocusedBlockEditorState(content, noopCallbacks)

  return state.apply(state.tr.setSelection(TextSelection.create(state.doc, from, to)) as Transaction)
}

/** view stub: buildSelectionSnapshot touches only state + coordsAtPos */
function stubView(state: EditorState, coordsAtPos?: EditorView['coordsAtPos']): EditorView {
  return {
    state,
    coordsAtPos:
      coordsAtPos ??
      (() => {
        throw new Error('unmeasurable (jsdom)')
      }),
  } as unknown as EditorView
}

// fixture: "bold" (bold) + "lit" (highlight #FDEA9B) + "plain"
const CONTENT: SduiInlineContent = [
  { type: 'text', text: 'bold', marks: [{ type: 'bold' }] },
  { type: 'text', text: 'lit', marks: [{ type: 'highlight', attrs: { color: '#FDEA9B' } }] },
  { type: 'text', text: 'plain' },
]

describe('selectionSnapshot', () => {
  describe('as is: a ranged selection fully inside bold text (EP: active partition)', () => {
    describe('when the snapshot is built', () => {
      it('to be: bold active, highlight color null, not empty', () => {
        const snapshot = buildSelectionSnapshot(stubView(stateWithSelection(CONTENT, 0, 4)))

        expect(snapshot.empty).toBe(false)
        expect(snapshot.activeMarks.bold).toBe(true)
        expect(snapshot.activeMarks.italic).toBe(false)
        expect(snapshot.highlightColor).toBeNull()
      })
    })
  })

  describe('as is: a selection over highlighted text (EP: attrs extraction)', () => {
    describe('when the snapshot is built', () => {
      it('to be: highlight active with its color surfaced', () => {
        const snapshot = buildSelectionSnapshot(stubView(stateWithSelection(CONTENT, 4, 7)))

        expect(snapshot.activeMarks.highlight).toBe(true)
        expect(snapshot.highlightColor).toBe('#FDEA9B')
      })
    })
  })

  describe('as is: a collapsed selection (BVA: from === to)', () => {
    describe('when the snapshot is built', () => {
      it('to be: empty with caret marks from the surrounding text', () => {
        const state = stateWithSelection(CONTENT, 2, 2)
        const snapshot = buildSelectionSnapshot(stubView(state))

        expect(snapshot.empty).toBe(true)
        expect(snapshot.anchorRect).toBeNull()
        expect(isMarkActive(state, focusedBlockSchema.marks.bold)).toBe(true)
      })
    })
  })

  describe('as is: coordsAtPos is unavailable (EP: jsdom partition)', () => {
    describe('when the snapshot is built for a ranged selection', () => {
      it('to be: anchorRect is null instead of throwing', () => {
        const snapshot = buildSelectionSnapshot(stubView(stateWithSelection(CONTENT, 0, 4)))

        expect(snapshot.anchorRect).toBeNull()
      })
    })
  })

  describe('as is: coordsAtPos returns viewport coords', () => {
    describe('when the snapshot is built', () => {
      it('to be: anchorRect spans start->end', () => {
        const coords = (pos: number) =>
          pos === 0 ? { left: 10, right: 12, top: 100, bottom: 120 } : { left: 50, right: 52, top: 100, bottom: 120 }
        const snapshot = buildSelectionSnapshot(
          stubView(stateWithSelection(CONTENT, 0, 4), coords as unknown as EditorView['coordsAtPos']),
        )

        expect(snapshot.anchorRect).toEqual({ left: 10, top: 100, width: 42, height: 20 })
      })
    })
  })

  describe('as is: two snapshots of the same state', () => {
    describe('when compared', () => {
      it('to be: equal — and unequal after the selection moves', () => {
        const a = buildSelectionSnapshot(stubView(stateWithSelection(CONTENT, 0, 4)))
        const b = buildSelectionSnapshot(stubView(stateWithSelection(CONTENT, 0, 4)))
        const c = buildSelectionSnapshot(stubView(stateWithSelection(CONTENT, 0, 5)))

        expect(selectionSnapshotsEqual(a, b)).toBe(true)
        expect(selectionSnapshotsEqual(a, c)).toBe(false)
      })
    })
  })
})
