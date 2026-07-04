import { createBlockId, createDocumentBlock, findBlockById, type SduiDocumentContent } from '@lodado/sdui-document'
import { fireEvent, render, screen } from '@testing-library/react'

import { useDocumentPatches } from '../hooks/useDocumentPatches'
import { stripPatchOrigins } from './patchTestUtils'

function createContent(): SduiDocumentContent {
  return {
    schemaVersion: '1.0',
    root: createDocumentBlock({
      id: 'root',
      type: 'document.root',
      children: [createDocumentBlock({ id: 'p1', type: 'document.paragraph', state: { text: 'Before' } })],
    }),
  }
}

type ProbeProps = {
  onContentChange: jest.Mock
}

const Probe = ({ onContentChange }: ProbeProps) => {
  const { doc, applyPatches } = useDocumentPatches({ content: createContent(), onContentChange })
  const text = String(findBlockById(doc, 'p1')?.state?.text)

  return (
    <>
      <p>{text}</p>
      <button type="button" onClick={() => applyPatches([])}>
        no-op
      </button>
      <button
        type="button"
        onClick={() => applyPatches([{ type: 'block.update', blockId: createBlockId('p1'), state: { text: 'After' } }])}
      >
        update
      </button>
    </>
  )
}

describe('useDocumentPatches', () => {
  it('keeps empty patch batches silent and publishes applied document patches', () => {
    const onContentChange = jest.fn()
    render(<Probe onContentChange={onContentChange} />)

    fireEvent.click(screen.getByText('no-op'))
    expect(onContentChange).not.toHaveBeenCalled()

    fireEvent.click(screen.getByText('update'))
    expect(screen.getByText('After')).toBeInTheDocument()
    expect(onContentChange).toHaveBeenCalledTimes(1)
    expect(stripPatchOrigins(onContentChange.mock.calls[0][1])).toEqual([
      { type: 'block.update', blockId: createBlockId('p1'), state: { text: 'After' } },
    ])
  })
})
