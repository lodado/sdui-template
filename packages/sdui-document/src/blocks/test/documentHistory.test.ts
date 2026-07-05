import {
  applyDocumentPatches,
  applyDocumentPatchesWithInverse,
  createBlockId,
  createDocumentBlock,
  createDocumentHistory,
  createHistory,
  type DocumentHistoryEntry,
  ensureFractionalContent,
  type HistoryEntry,
  recordHistoryEntry,
  redoHistory,
  type SduiDocumentContent,
  undoHistory,
} from '../../index'

function createContent(): SduiDocumentContent {
  return {
    schemaVersion: '1.0',
    root: createDocumentBlock({
      id: 'root',
      type: 'document.root',
      children: [
        createDocumentBlock({ id: 'p1', type: 'document.paragraph', state: { text: 'First' } }),
        createDocumentBlock({ id: 'p2', type: 'document.paragraph', state: { text: 'Second' } }),
      ],
    }),
  }
}

function entryOf(label: string): DocumentHistoryEntry {
  return {
    undo: [{ type: 'block.delete', blockId: createBlockId(label) }],
    redo: [],
  }
}

describe('document history (two-stack undo/redo)', () => {
  describe('recordHistoryEntry', () => {
    it('pushes onto the undo stack and clears the redo stack', () => {
      const afterFirst = recordHistoryEntry(createDocumentHistory(), entryOf('a'))
      const afterUndo = undoHistory(afterFirst)
      expect(afterUndo?.history.redoStack).toHaveLength(1)

      const afterRecord = recordHistoryEntry(afterUndo!.history, entryOf('b'))

      expect(afterRecord.undoStack).toHaveLength(1)
      expect(afterRecord.redoStack).toHaveLength(0)
    })

    it('drops the oldest entry beyond the depth cap (BVA: overflow by one)', () => {
      const history = ['a', 'b', 'c'].reduce(
        (current, label) => recordHistoryEntry(current, entryOf(label), 2),
        createDocumentHistory(),
      )

      expect(history.undoStack).toHaveLength(2)
      // oldest ('a') dropped; most recent on top
      expect(undoHistory(history)?.entry).toEqual(entryOf('c'))
    })

    it('does not mutate the input history (immutability contract)', () => {
      const initial = createDocumentHistory()
      recordHistoryEntry(initial, entryOf('a'))

      expect(initial.undoStack).toHaveLength(0)
    })
  })

  describe('undoHistory / redoHistory', () => {
    it('returns null on empty stacks (BVA: nothing to undo/redo)', () => {
      expect(undoHistory(createDocumentHistory())).toBeNull()
      expect(redoHistory(createDocumentHistory())).toBeNull()
    })

    it('moves the popped entry to the opposite stack', () => {
      const recorded = recordHistoryEntry(createDocumentHistory(), entryOf('a'))

      const undone = undoHistory(recorded)
      expect(undone?.entry).toEqual(entryOf('a'))
      expect(undone?.history.undoStack).toHaveLength(0)
      expect(undone?.history.redoStack).toHaveLength(1)

      const redone = redoHistory(undone!.history)
      expect(redone?.entry).toEqual(entryOf('a'))
      expect(redone?.history.undoStack).toHaveLength(1)
      expect(redone?.history.redoStack).toHaveLength(0)
    })
  })

  describe('createHistory (generic entry payloads)', () => {
    type TreeMoveOp = { documentId: string; targetParentDocumentId?: string }

    it('round-trips non-patch entries through the same two-stack semantics', () => {
      const entry: HistoryEntry<TreeMoveOp> = {
        undo: { documentId: 'doc-1', targetParentDocumentId: 'old-parent' },
        redo: { documentId: 'doc-1', targetParentDocumentId: 'new-parent' },
      }

      const recorded = recordHistoryEntry(createHistory<TreeMoveOp>(), entry)

      const undone = undoHistory(recorded)
      expect(undone?.entry.undo.targetParentDocumentId).toBe('old-parent')

      const redone = redoHistory(undone!.history)
      expect(redone?.entry.redo.targetParentDocumentId).toBe('new-parent')
      expect(redone?.history.redoStack).toHaveLength(0)
    })
  })

  describe('integration: engine inverse round-trip through the stacks', () => {
    it('undo restores the pre-batch tree, redo replays it exactly', () => {
      const original = ensureFractionalContent(createContent())
      const batch = [
        {
          type: 'block.split' as const,
          blockId: createBlockId('p1'),
          offset: 2,
          newBlockId: createBlockId('p1-tail'),
        },
        {
          type: 'block.setType' as const,
          blockId: createBlockId('p1-tail'),
          blockType: 'document.heading',
          attributes: { level: 2 },
        },
      ]

      const applied = applyDocumentPatchesWithInverse(original, batch)
      let history = recordHistoryEntry(createDocumentHistory(), { undo: applied.inverse, redo: batch })

      const undone = undoHistory(history)!
      history = undone.history
      const restored = applyDocumentPatches(applied.content, undone.entry.undo)
      expect(restored).toEqual(original)

      const redone = redoHistory(history)!
      const replayed = applyDocumentPatches(restored, redone.entry.redo)
      expect(replayed).toEqual(applied.content)
    })
  })
})
