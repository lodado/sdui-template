import { createDocumentBlock, type SduiDocument } from '@lodado/sdui-document'
import { fireEvent, render, screen } from '@testing-library/react'

import { useDocumentTreeHistory } from '../hooks/useDocumentTreeHistory'

const now = '2026-07-05T00:00:00.000Z'

function doc(input: Partial<SduiDocument> & Pick<SduiDocument, 'id' | 'title'>): SduiDocument {
  return {
    workspaceId: 'workspace-1',
    collectionId: 'collection-1',
    state: 'published',
    content: {
      schemaVersion: '1.0',
      root: createDocumentBlock({ id: `${input.id}-root`, type: 'document.root' }),
    },
    version: 1,
    createdAt: now,
    updatedAt: now,
    ...input,
  }
}

function createDocuments(): SduiDocument[] {
  return [doc({ id: 'a', title: 'A', sortIndex: 0 }), doc({ id: 'd', title: 'D', sortIndex: 1 })]
}

type ProbeProps = {
  onDocumentsChange?: jest.Mock
}

const Probe = ({ onDocumentsChange }: ProbeProps) => {
  const { documents, moveDocument, undo, redo } = useDocumentTreeHistory({
    documents: createDocuments(),
    onDocumentsChange,
    now: () => now,
  })

  const target = documents.find((document) => document.id === 'd')

  return (
    <>
      <p>parent: {String(target?.parentDocumentId)}</p>
      <button
        type="button"
        onClick={() => moveDocument({ documentId: 'd', targetParentDocumentId: 'a', targetIndex: 0 })}
      >
        move-under-a
      </button>
      <button type="button" onClick={() => undo()}>
        undo
      </button>
      <button type="button" onClick={() => redo()}>
        redo
      </button>
    </>
  )
}

describe('useDocumentTreeHistory', () => {
  it('moves, undoes back to the original location, and redoes the move', () => {
    render(<Probe />)
    expect(screen.getByText('parent: undefined')).toBeInTheDocument()

    fireEvent.click(screen.getByText('move-under-a'))
    expect(screen.getByText('parent: a')).toBeInTheDocument()

    fireEvent.click(screen.getByText('undo'))
    expect(screen.getByText('parent: undefined')).toBeInTheDocument()

    fireEvent.click(screen.getByText('redo'))
    expect(screen.getByText('parent: a')).toBeInTheDocument()
  })

  it('restores sortIndex and collection on undo', () => {
    const onDocumentsChange = jest.fn()
    render(<Probe onDocumentsChange={onDocumentsChange} />)

    fireEvent.click(screen.getByText('move-under-a'))
    fireEvent.click(screen.getByText('undo'))

    const lastDocuments: SduiDocument[] = onDocumentsChange.mock.calls.at(-1)![0]
    expect(lastDocuments.find((document) => document.id === 'd')).toMatchObject({
      parentDocumentId: undefined,
      collectionId: 'collection-1',
      sortIndex: 1,
    })
  })

  it('publishes documents + events on every applied step, stays silent on empty stacks', () => {
    const onDocumentsChange = jest.fn()
    render(<Probe onDocumentsChange={onDocumentsChange} />)

    fireEvent.click(screen.getByText('undo'))
    fireEvent.click(screen.getByText('redo'))
    expect(onDocumentsChange).not.toHaveBeenCalled()

    fireEvent.click(screen.getByText('move-under-a'))
    expect(onDocumentsChange).toHaveBeenCalledTimes(1)
    expect(onDocumentsChange.mock.calls[0][1]).toEqual([
      expect.objectContaining({ type: 'document.moved', documentId: 'd', occurredAt: now }),
    ])

    fireEvent.click(screen.getByText('undo'))
    expect(onDocumentsChange).toHaveBeenCalledTimes(2)
  })

  it('clears the redo stack when a fresh move forks history', () => {
    const onDocumentsChange = jest.fn()
    render(<Probe onDocumentsChange={onDocumentsChange} />)

    fireEvent.click(screen.getByText('move-under-a'))
    fireEvent.click(screen.getByText('undo'))
    fireEvent.click(screen.getByText('move-under-a'))

    const callsBefore = onDocumentsChange.mock.calls.length
    fireEvent.click(screen.getByText('redo'))
    expect(onDocumentsChange.mock.calls.length).toBe(callsBefore)
  })
})
