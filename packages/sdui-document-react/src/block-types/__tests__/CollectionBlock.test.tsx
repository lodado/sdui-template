import type { SduiDocumentContent } from '@lodado/sdui-document'
import { COLLECTION_BLOCK_TYPE, createDocumentBlock, PAGE_BLOCK_TYPE } from '@lodado/sdui-document'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import React from 'react'

import { SduiDocumentEditor } from '../../editor/SduiDocumentEditor'
import { SduiPageProvider } from '../../page/SduiPageProvider'

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
          attributes: {
            view,
            properties: [
              {
                id: 'status',
                name: 'Status',
                type: 'select',
                options: [{ id: 'active', label: 'Active', color: 'green' }],
              },
            ],
          },
          children: [
            {
              id: 'i1',
              type: PAGE_BLOCK_TYPE,
              state: { text: 'Project A' },
              attributes: { documentId: 'doc-a', properties: { status: 'active' } },
            },
            { id: 'i2', type: PAGE_BLOCK_TYPE, state: { text: 'Project B' }, attributes: { documentId: 'doc-b' } },
          ],
        },
        { id: 'tail', type: 'document.paragraph', state: { text: '' } },
      ],
    }),
  }
}

const renderCollection = (
  view: string,
  navigator: { push?: jest.Mock; peek?: jest.Mock } = {},
  editorProps: Partial<React.ComponentProps<typeof SduiDocumentEditor>> = {},
) =>
  render(
    <SduiPageProvider resolver={jest.fn().mockResolvedValue(undefined)} navigator={navigator}>
      <SduiDocumentEditor content={content(view)} {...editorProps} />
    </SduiPageProvider>,
  )

describe('CollectionBlock', () => {
  describe('as is: gallery view (EP: cards render + navigate)', () => {
    it('to be: renders a card per page item with its chip', () => {
      renderCollection('gallery', {}, { readOnly: true })
      expect(screen.getByText('Project A')).toBeInTheDocument()
      expect(screen.getByText('Project B')).toBeInTheDocument()
      expect(screen.getByText('Active')).toBeInTheDocument()
    })

    it('to be: clicking a card opens the target document', async () => {
      const push = jest.fn()
      renderCollection('gallery', { push }, { readOnly: true })
      await userEvent.click(screen.getByRole('button', { name: /Project A/ }))
      expect(push).toHaveBeenCalledWith('doc-a')
    })
  })

  describe('as is: list view (EP: rows)', () => {
    it('to be: renders one row per item', () => {
      renderCollection('list', {}, { readOnly: true })
      expect(screen.getAllByRole('listitem')).toHaveLength(2)
    })
  })

  describe('as is: children not rendered as normal block rows', () => {
    it('to be: page items do not appear as [data-block-id] rows', () => {
      const { container } = renderCollection('gallery', {}, { readOnly: true })
      expect(container.querySelector('[data-block-id="i1"]')).toBeNull()
      expect(container.querySelector('[data-block-id="col"]')).not.toBeNull()
    })
  })

  describe('as is: + New (EP: editor with onCreatePage)', () => {
    it('to be: hidden in read mode', () => {
      renderCollection('gallery', {}, { readOnly: true })
      expect(screen.queryByRole('button', { name: '+ New' })).not.toBeInTheDocument()
    })

    it('to be: creates a document and inserts it as a collection item', async () => {
      const onContentChange = jest.fn()
      const onCreatePage = jest.fn().mockResolvedValue({ documentId: 'doc-new', title: 'New page' })
      let genCount = 0
      const generateBlockId = () => {
        genCount += 1
        return `gen-${genCount}`
      }
      renderCollection('gallery', {}, { onCreatePage, onContentChange, generateBlockId })

      await userEvent.click(screen.getByRole('button', { name: '+ New' }))

      const last: SduiDocumentContent = onContentChange.mock.calls.at(-1)![0]
      const col = last.root.children!.find((child) => child.id === 'col')!
      const items = (col.children ?? []).filter((child) => child.type === PAGE_BLOCK_TYPE)
      expect(items).toHaveLength(3)
      expect(items.at(-1)!.attributes?.documentId).toBe('doc-new')
    })
  })
})
