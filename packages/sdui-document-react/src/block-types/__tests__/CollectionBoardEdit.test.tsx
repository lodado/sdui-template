import type { SduiDocumentContent } from '@lodado/sdui-document'
import { COLLECTION_BLOCK_TYPE, createDocumentBlock, PAGE_BLOCK_TYPE } from '@lodado/sdui-document'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import React from 'react'

import { SduiDocumentEditor } from '../../editor/SduiDocumentEditor'
import { SduiPageProvider } from '../../page/SduiPageProvider'

const STATUS_DEF = {
  id: 'status',
  name: 'Status',
  type: 'select',
  options: [
    { id: 'active', label: 'Active', color: 'green' },
    { id: 'done', label: 'Done', color: 'gray' },
  ],
}

function boardContent(): SduiDocumentContent {
  return {
    schemaVersion: '1.0',
    root: createDocumentBlock({
      id: 'root',
      type: 'document.root',
      children: [
        {
          id: 'col',
          type: COLLECTION_BLOCK_TYPE,
          attributes: { view: 'board', groupBy: 'status', properties: [STATUS_DEF] },
          children: [
            {
              id: 'i1',
              type: PAGE_BLOCK_TYPE,
              state: { text: 'A' },
              attributes: { documentId: 'doc-a', properties: { status: 'active' } },
            },
            {
              id: 'i2',
              type: PAGE_BLOCK_TYPE,
              state: { text: 'B' },
              attributes: { documentId: 'doc-b', properties: { status: 'done' } },
            },
            {
              id: 'i3',
              type: PAGE_BLOCK_TYPE,
              state: { text: 'C' },
              attributes: { documentId: 'doc-c', properties: { status: 'active' } },
            },
          ],
        },
        { id: 'tail', type: 'document.paragraph', state: { text: '' } },
      ],
    }),
  }
}

const renderEditor = (
  content: SduiDocumentContent,
  props: Partial<React.ComponentProps<typeof SduiDocumentEditor>> = {},
) => {
  const onContentChange = jest.fn()
  render(
    <SduiPageProvider resolver={jest.fn().mockResolvedValue(undefined)} navigator={{}}>
      <SduiDocumentEditor content={content} onContentChange={onContentChange} {...props} />
    </SduiPageProvider>,
  )
  return { onContentChange }
}

const lastCol = (onContentChange: jest.Mock) => {
  const last: SduiDocumentContent = onContentChange.mock.calls.at(-1)![0]
  return last.root.children!.find((child) => child.id === 'col')!
}

describe('collection board + property editing', () => {
  describe('as is: board view (EP: groupBy columns)', () => {
    it('to be: renders a column per select option with its items', () => {
      renderEditor(boardContent(), { readOnly: true })
      // two option columns + empty column
      expect(screen.getByText(/Active · 2/)).toBeInTheDocument()
      expect(screen.getByText(/Done · 1/)).toBeInTheDocument()
    })
  })

  describe('as is: view switcher (EP: tab click → view attr)', () => {
    it('to be: switching to List updates the collection view attribute', async () => {
      const { onContentChange } = renderEditor(boardContent())
      await userEvent.click(screen.getByRole('tab', { name: 'List' }))
      expect(lastCol(onContentChange).attributes?.view).toBe('list')
    })
  })

  describe('as is: property manager (EP: add + remove)', () => {
    it('to be: adding a property appends a definition', async () => {
      const { onContentChange } = renderEditor(boardContent())
      await userEvent.click(screen.getByRole('button', { name: 'Manage properties' }))
      await userEvent.type(screen.getByLabelText('Property name'), 'Priority')
      await userEvent.click(screen.getByRole('button', { name: 'Add' }))

      const props = lastCol(onContentChange).attributes?.properties as { id: string; name: string }[]
      expect(props.map((property) => property.name)).toContain('Priority')
    })

    it('to be: removing a property drops it and clears groupBy', async () => {
      const { onContentChange } = renderEditor(boardContent())
      await userEvent.click(screen.getByRole('button', { name: 'Manage properties' }))
      await userEvent.click(screen.getByRole('button', { name: 'Remove Status' }))

      const col = lastCol(onContentChange)
      expect(col.attributes?.properties).toEqual([])
      expect(col.attributes?.groupBy).toBeUndefined()
    })
  })
})
