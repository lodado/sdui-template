import type { SduiDocumentContent } from '@lodado/sdui-document'
import { createDocumentBlock } from '@lodado/sdui-document'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import React from 'react'

import { SduiDocumentEditor } from '../SduiDocumentEditor'

function twoParagraphs(): SduiDocumentContent {
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

function renderEditor() {
  const ids = ['gen-1', 'gen-2', 'gen-3', 'gen-4']
  const onContentChange = jest.fn()
  const utils = render(
    <SduiDocumentEditor
      content={twoParagraphs()}
      onContentChange={onContentChange}
      generateBlockId={() => ids.shift() ?? 'gen-x'}
    />,
  )
  return { ...utils, onContentChange }
}

function dispatchClipboard(type: 'copy' | 'cut' | 'paste', store = new Map<string, string>()) {
  const event = new Event(type, { cancelable: true, bubbles: true }) as Event & { clipboardData: unknown }
  event.clipboardData = {
    setData: (mime: string, value: string) => store.set(mime, value),
    getData: (mime: string) => store.get(mime) ?? '',
  }
  document.dispatchEvent(event)
  return store
}

function childIds(content: SduiDocumentContent): string[] {
  return (content.root.children ?? []).map((child) => child.id)
}

describe('block-selection clipboard', () => {
  it('copy writes the selected block as markdown', async () => {
    const user = userEvent.setup()
    renderEditor()

    await user.click(screen.getByLabelText('Drag block p1'))
    const store = dispatchClipboard('copy')

    expect(store.get('text/plain')).toContain('First')
  })

  it('cut writes markdown and removes the selected block', async () => {
    const user = userEvent.setup()
    const { onContentChange } = renderEditor()

    await user.click(screen.getByLabelText('Drag block p1'))
    const store = dispatchClipboard('cut')

    expect(store.get('text/plain')).toContain('First')
    const next = onContentChange.mock.calls.at(-1)?.[0] as SduiDocumentContent
    expect(childIds(next)).not.toContain('p1')
  })

  it('paste inserts markdown as blocks after the selection', async () => {
    const user = userEvent.setup()
    const { onContentChange } = renderEditor()

    await user.click(screen.getByLabelText('Drag block p1'))
    const store = new Map<string, string>([['text/plain', '# New heading\n\nA paragraph']])
    dispatchClipboard('paste', store)

    const next = onContentChange.mock.calls.at(-1)?.[0] as SduiDocumentContent
    const ids = childIds(next)
    // two new blocks landed between p1 and p2
    expect(ids[0]).toBe('p1')
    expect(ids[ids.length - 1]).toBe('p2')
    expect(ids.length).toBe(4)
    const inserted = next.root.children?.slice(1, 3) ?? []
    expect(inserted[0]?.type).toBe('document.heading')
    expect(inserted[1]?.type).toBe('document.paragraph')
  })
})
