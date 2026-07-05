import {
  applyDocumentPatchesWithInverse,
  createBlockId,
  createDocumentBlock,
  createDocumentHistory,
  type DocumentHistory,
  recordHistoryEntry,
  redoHistory,
  type SduiDocumentBlock,
  type SduiDocumentContent,
  type SduiDocumentPatch,
  undoHistory,
} from '@lodado/sdui-document'
import React, { useMemo, useState } from 'react'

const initialContent: SduiDocumentContent = {
  schemaVersion: '1.0',
  root: createDocumentBlock({
    id: 'ur-root',
    type: 'document.root',
    children: [
      createDocumentBlock({ id: 'ur-1', type: 'document.paragraph', state: { text: '첫 번째 블록' } }),
      createDocumentBlock({ id: 'ur-2', type: 'document.paragraph', state: { text: '두 번째 블록' } }),
    ],
  }),
}

function blockText(block: SduiDocumentBlock): string {
  const text = block.state?.text
  return typeof text === 'string' ? text : ''
}

/**
 * Fully headless undo/redo, built directly on the domain command API:
 * applyDocumentPatchesWithInverse records the inverse of every batch, and the
 * two-stack DocumentHistory replays it in either direction. No editor involved.
 */
export const UndoRedoDemo = () => {
  const [content, setContent] = useState(initialContent)
  const [history, setHistory] = useState<DocumentHistory>(createDocumentHistory)
  const [counter, setCounter] = useState(3)

  const commit = (patches: SduiDocumentPatch[]) => {
    const { content: next, inverse } = applyDocumentPatchesWithInverse(content, patches)
    setContent(next)
    setHistory((h) => recordHistoryEntry(h, { undo: inverse, redo: patches }))
  }

  const addBlock = () => {
    const id = `ur-${counter}`
    setCounter((c) => c + 1)
    commit([
      {
        type: 'block.insert',
        parentId: createBlockId('ur-root'),
        block: createDocumentBlock({ id, type: 'document.paragraph', state: { text: `블록 #${counter}` } }),
      },
    ])
  }

  const renameFirst = () => {
    commit([{ type: 'block.update', blockId: createBlockId('ur-1'), state: { text: `수정됨 @${counter}` } }])
  }

  const undo = () => {
    const step = undoHistory(history)
    if (!step) return
    setContent((c) => applyDocumentPatchesWithInverse(c, step.entry.undo).content)
    setHistory(step.history)
  }

  const redo = () => {
    const step = redoHistory(history)
    if (!step) return
    setContent((c) => applyDocumentPatchesWithInverse(c, step.entry.redo).content)
    setHistory(step.history)
  }

  const blocks = useMemo(() => content.root.children ?? [], [content])

  return (
    <div style={{ display: 'grid', gap: 14 }}>
      <div className="sdui-doc__toolbar">
        <button className="sdui-doc__btn sdui-doc__btn--primary" onClick={addBlock}>
          + 블록 추가
        </button>
        <button className="sdui-doc__btn" onClick={renameFirst}>
          ✎ 첫 블록 수정
        </button>
        <span style={{ flex: 1 }} />
        <button className="sdui-doc__btn" onClick={undo} disabled={history.undoStack.length === 0}>
          ↩ undo ({history.undoStack.length})
        </button>
        <button className="sdui-doc__btn" onClick={redo} disabled={history.redoStack.length === 0}>
          ↪ redo ({history.redoStack.length})
        </button>
      </div>
      <div
        style={{
          display: 'grid',
          gap: 6,
          padding: 14,
          borderRadius: 8,
          border: '1px solid var(--doc-border)',
          background: 'var(--doc-surface-raised)',
        }}
      >
        {blocks.map((block) => (
          <div
            key={block.id}
            style={{ display: 'flex', gap: 10, alignItems: 'center', fontSize: 14, color: 'var(--doc-text)' }}
          >
            <code style={{ fontSize: 11, color: 'var(--doc-text-subtlest)' }}>{block.id}</code>
            <span>{blockText(block)}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
