import { applyDocumentPatches, createDocumentBlock, type SduiDocumentContent } from '@lodado/sdui-document'
import { render, screen } from '@testing-library/react'
import React from 'react'

import { buildBlockDropPatches, type OverHit } from '../hooks/useBlockPointerDrag'
import { SduiDocumentEditor } from '../SduiDocumentEditor'

function content(): SduiDocumentContent {
  return {
    schemaVersion: '1.0',
    root: createDocumentBlock({
      id: 'root',
      type: 'document.root',
      children: [
        createDocumentBlock({ id: 'a', type: 'document.paragraph', position: 'a0', state: { text: 'AAA' } }),
        createDocumentBlock({ id: 'b', type: 'document.paragraph', position: 'a1', state: { text: 'BBB' } }),
      ],
    }),
  }
}

function drop(pointerX: number, rowWidth: number, pointerY: number, rowHeight: number) {
  const hit: OverHit = { overId: 'b', rowRect: { left: 0, top: 0, width: rowWidth, height: rowHeight } }
  const patches = buildBlockDropPatches({
    content: content(),
    activeId: 'a',
    hit,
    pointerX,
    pointerY,
    startX: pointerX,
    indentWidth: 24,
  })
  return applyDocumentPatches(content(), patches ?? [])
}

describe('drop result still renders both blocks (regression: nodes vanish on drop)', () => {
  it('right-edge column split', () => {
    render(<SduiDocumentEditor content={drop(180, 200, 15, 30)} />)
    expect(screen.getByText('AAA')).toBeInTheDocument()
    expect(screen.getByText('BBB')).toBeInTheDocument()
  })

  it('middle nest (a inside b)', () => {
    render(<SduiDocumentEditor content={drop(100, 200, 15, 30)} />)
    expect(screen.getByText('AAA')).toBeInTheDocument()
    expect(screen.getByText('BBB')).toBeInTheDocument()
  })

  it('bottom-zone vertical move', () => {
    render(<SduiDocumentEditor content={drop(100, 200, 29, 30)} />)
    expect(screen.getByText('AAA')).toBeInTheDocument()
    expect(screen.getByText('BBB')).toBeInTheDocument()
  })

  it('block nested inside a paragraph after column collapse still renders', () => {
    // matches the post-collapse state from the story bug: range-tail ends up as
    // a child of the range-p2 paragraph, range-p2-child under range-p1.
    const nested: SduiDocumentContent = {
      schemaVersion: '1.0',
      root: createDocumentBlock({
        id: 'root',
        type: 'document.root',
        children: [
          createDocumentBlock({
            id: 'range-p1',
            type: 'document.paragraph',
            state: { text: 'P1' },
            children: [
              createDocumentBlock({ id: 'range-p2-child', type: 'document.paragraph', state: { text: 'CHILD' } }),
            ],
          }),
          createDocumentBlock({
            id: 'range-p2',
            type: 'document.paragraph',
            state: { text: 'P2' },
            children: [createDocumentBlock({ id: 'range-tail', type: 'document.paragraph', state: { text: 'TAIL' } })],
          }),
        ],
      }),
    }
    render(<SduiDocumentEditor content={nested} />)
    expect(screen.getByText('CHILD')).toBeInTheDocument()
    expect(screen.getByText('TAIL')).toBeInTheDocument()
  })
})
