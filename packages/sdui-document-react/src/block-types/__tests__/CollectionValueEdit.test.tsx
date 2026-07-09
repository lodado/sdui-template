import type { SduiDocumentContent } from '@lodado/sdui-document'
import { COLLECTION_BLOCK_TYPE, createDocumentBlock, PAGE_BLOCK_TYPE } from '@lodado/sdui-document'
import { render, screen } from '@testing-library/react'
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
const DATE_DEF = { id: 'shipped', name: 'Shipped', type: 'date' }

function content(view: string): SduiDocumentContent {
  return {
    schemaVersion: '1.0',
    root: createDocumentBlock({
      id: 'root',
      type: 'document.root',
      children: [
        {
          id: 'col',
          type: COLLECTION_BLOCK_TYPE,
          attributes: { view, properties: [STATUS_DEF, DATE_DEF] },
          children: [
            {
              id: 'i1',
              type: PAGE_BLOCK_TYPE,
              state: { text: 'A' },
              attributes: { documentId: 'doc-a', properties: { status: 'active', shipped: '2022-01-01' } },
            },
            {
              id: 'i2',
              type: PAGE_BLOCK_TYPE,
              state: { text: 'B' },
              attributes: { documentId: 'doc-b', properties: { shipped: '2020-01-01' } },
            },
          ],
        },
        { id: 'tail', type: 'document.paragraph', state: { text: '' } },
      ],
    }),
  }
}

const renderEditor = (view: string, props: Partial<React.ComponentProps<typeof SduiDocumentEditor>> = {}) => {
  const onContentChange = jest.fn()
  render(
    <SduiPageProvider resolver={jest.fn().mockResolvedValue(undefined)} navigator={{}}>
      <SduiDocumentEditor content={content(view)} onContentChange={onContentChange} {...props} />
    </SduiPageProvider>,
  )
  return { onContentChange }
}

const itemById = (onContentChange: jest.Mock, id: string) => {
  const last: SduiDocumentContent = onContentChange.mock.calls.at(-1)![0]
  const col = last.root.children!.find((child) => child.id === 'col')!
  return (col.children ?? []).find((child) => child.id === id)!
}

describe('collection value editing + sort', () => {
  describe('as is: value editing (EP: select value via popover)', () => {
    it('to be: read mode shows chips as static (no edit cell buttons)', () => {
      renderEditor('list', { readOnly: true })
      expect(screen.queryByRole('button', { name: /Edit Status/ })).not.toBeInTheDocument()
    })

    it('to be: editing a select value writes the item property', async () => {
      const { onContentChange } = renderEditor('list')
      // item i2 has no status → "Empty"; open its Status editor and pick Done
      const statusCells = screen.getAllByRole('button', { name: 'Edit Status' })
      await userEvent.click(statusCells[1])
      await userEvent.click(await screen.findByRole('button', { name: 'Done' }))

      expect(itemById(onContentChange, 'i2').attributes?.properties).toMatchObject({ status: 'done' })
    })
  })

  describe('as is: sort (EP: sort attr + direction)', () => {
    it('to be: choosing a sort property sets sortBy', async () => {
      const { onContentChange } = renderEditor('list')
      await userEvent.selectOptions(screen.getByLabelText('Sort by'), 'shipped')

      const last: SduiDocumentContent = onContentChange.mock.calls.at(-1)![0]
      const col = last.root.children!.find((child) => child.id === 'col')!
      expect(col.attributes?.sortBy).toEqual({ propertyId: 'shipped', direction: 'asc' })
    })
  })

  describe('as is: timeline view (EP: renders period from date property)', () => {
    it('to be: shows the compact yyyy.mm period per item', () => {
      renderEditor('timeline', { readOnly: true })
      expect(screen.getByText('2022.01')).toBeInTheDocument()
      expect(screen.getByText('2020.01')).toBeInTheDocument()
    })
  })
})
