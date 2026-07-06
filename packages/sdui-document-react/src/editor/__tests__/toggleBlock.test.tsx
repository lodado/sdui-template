import type { SduiDocumentContent } from '@lodado/sdui-document'
import { createDocumentBlock } from '@lodado/sdui-document'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import React from 'react'

import { SduiDocumentEditor } from '../SduiDocumentEditor'
import { stripPatchOrigins } from './patchTestUtils'

/** root → toggle t1 ("Summary") → paragraph p1 ("Hidden detail") */
function createContent(collapsed: boolean, withChild = true): SduiDocumentContent {
  return {
    schemaVersion: '1.0',
    root: createDocumentBlock({
      id: 'root',
      type: 'document.root',
      children: [
        createDocumentBlock({
          id: 't1',
          type: 'document.toggle',
          state: { text: 'Summary' },
          attributes: { collapsed },
          children: withChild
            ? [createDocumentBlock({ id: 'p1', type: 'document.paragraph', state: { text: 'Hidden detail' } })]
            : undefined,
        }),
      ],
    }),
  }
}

describe('toggle block', () => {
  test('expanded toggle renders its children', () => {
    render(<SduiDocumentEditor content={createContent(false)} />)

    expect(screen.getByText('Hidden detail')).toBeInTheDocument()
  })

  test('collapsed toggle hides its children', () => {
    render(<SduiDocumentEditor content={createContent(true)} />)

    expect(screen.queryByText('Hidden detail')).not.toBeInTheDocument()
  })

  test('clicking the triangle emits a collapsed block.update patch', async () => {
    const user = userEvent.setup()
    const onContentChange = jest.fn()
    render(<SduiDocumentEditor content={createContent(false)} onContentChange={onContentChange} />)

    await user.click(screen.getByRole('button', { name: 'Toggle t1' }))

    expect(onContentChange).toHaveBeenCalledTimes(1)
    const [, patches] = onContentChange.mock.calls[0]
    expect(stripPatchOrigins(patches)).toEqual([
      { type: 'block.update', blockId: 't1', attributes: { collapsed: true } },
    ])
  })

  test('triangle is disabled in readOnly mode', () => {
    render(<SduiDocumentEditor content={createContent(false)} readOnly />)

    expect(screen.getByRole('button', { name: 'Toggle t1' })).toBeDisabled()
  })

  test('empty expanded toggle shows the placeholder', () => {
    render(<SduiDocumentEditor content={createContent(false, false)} />)

    expect(screen.getByText('Empty toggle. Press Enter, click, or drop blocks inside.')).toBeInTheDocument()
  })

  test('empty collapsed toggle shows no placeholder', () => {
    render(<SduiDocumentEditor content={createContent(true, false)} />)

    expect(screen.queryByText('Empty toggle. Press Enter, click, or drop blocks inside.')).not.toBeInTheDocument()
  })

  test('clicking the empty-toggle placeholder inserts a first child', async () => {
    const user = userEvent.setup()
    const onContentChange = jest.fn()
    render(
      <SduiDocumentEditor
        content={createContent(false, false)}
        onContentChange={onContentChange}
        generateBlockId={() => 'child-1'}
      />,
    )

    await user.click(screen.getByText('Empty toggle. Press Enter, click, or drop blocks inside.'))

    const inserts = onContentChange.mock.calls
      .flatMap(([, patches]) => stripPatchOrigins(patches) as Array<{ type: string; parentId?: string }>)
      .filter((patch) => patch.type === 'block.insert')
    expect(inserts).toHaveLength(1)
    expect(inserts[0].parentId).toBe('t1')
  })

  test('placeholder is disabled in readOnly mode', () => {
    render(<SduiDocumentEditor content={createContent(false, false)} readOnly />)

    expect(screen.getByText('Empty toggle. Press Enter, click, or drop blocks inside.')).toBeDisabled()
  })
})
