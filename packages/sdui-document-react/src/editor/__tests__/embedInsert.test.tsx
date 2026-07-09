import type { SduiDocumentContent } from '@lodado/sdui-document'
import { BOOKMARK_BLOCK_TYPE, createDocumentBlock, EMBED_BLOCK_TYPE, VIDEO_BLOCK_TYPE } from '@lodado/sdui-document'
import { act, fireEvent, render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import type { EditorView } from 'prosemirror-view'
import React from 'react'

import { SduiDocumentEditor } from '../SduiDocumentEditor'

function contentOf(children: Parameters<typeof createDocumentBlock>[0][]): SduiDocumentContent {
  return { schemaVersion: '1.0', root: createDocumentBlock({ id: 'root', type: 'document.root', children }) }
}

const oneEmpty = () => contentOf([{ id: 'p1', type: 'document.paragraph', state: { text: '' } }])

function renderEditor(props: Partial<React.ComponentProps<typeof SduiDocumentEditor>> = {}) {
  const onContentChange = jest.fn()
  const utils = render(
    <SduiDocumentEditor
      content={oneEmpty()}
      onContentChange={onContentChange}
      generateBlockId={() => 'gen-1'}
      {...props}
    />,
  )
  return { ...utils, onContentChange }
}

function typeInFocused(text: string): void {
  const host = screen.getByTestId('focused-block-editor') as HTMLElement & { pmView?: EditorView }
  act(() => {
    host.pmView!.dispatch(host.pmView!.state.tr.insertText(text, host.pmView!.state.selection.from))
  })
}

function submitLink(url: string): void {
  const input = screen.getByPlaceholderText('https://…') as HTMLInputElement
  fireEvent.change(input, { target: { value: url } })
  fireEvent.submit(input.closest('form')!)
}

function firstChild(onContentChange: jest.Mock) {
  const last: SduiDocumentContent = onContentChange.mock.calls.at(-1)![0]
  return last.root.children![0]
}

describe('embed-family slash insert', () => {
  it('bookmark: inserts a URL-only card, then unfurl fills metadata', async () => {
    const onUnfurl = jest.fn().mockResolvedValue({ title: 'GitHub', imageUrl: 'https://img/x.png' })
    const { container, onContentChange } = renderEditor({ onUnfurl })

    await userEvent.click(container.querySelector('[data-block-id="p1"] [data-inline-root]') as HTMLElement)
    typeInFocused('/bookmark')
    fireEvent.keyDown(screen.getByTestId('focused-block-editor'), { key: 'Enter' })
    submitLink('https://github.com/lodado')

    await waitFor(() => expect(firstChild(onContentChange).type).toBe(BOOKMARK_BLOCK_TYPE))
    expect(firstChild(onContentChange).attributes?.url).toBe('https://github.com/lodado')
    await waitFor(() => expect(firstChild(onContentChange).attributes?.title).toBe('GitHub'))
  })

  it('video: parses a YouTube URL into provider/videoId', async () => {
    const { container, onContentChange } = renderEditor()
    await userEvent.click(container.querySelector('[data-block-id="p1"] [data-inline-root]') as HTMLElement)
    typeInFocused('/video')
    fireEvent.keyDown(screen.getByTestId('focused-block-editor'), { key: 'Enter' })
    submitLink('https://youtu.be/dQw4w9WgXcQ')

    await waitFor(() => expect(firstChild(onContentChange).type).toBe(VIDEO_BLOCK_TYPE))
    expect(firstChild(onContentChange).attributes).toMatchObject({ provider: 'youtube', videoId: 'dQw4w9WgXcQ' })
  })

  it('video: a non-video URL is rejected (no block inserted)', async () => {
    const warn = jest.spyOn(console, 'warn').mockImplementation(() => {})
    const { container, onContentChange } = renderEditor()
    await userEvent.click(container.querySelector('[data-block-id="p1"] [data-inline-root]') as HTMLElement)
    typeInFocused('/video')
    fireEvent.keyDown(screen.getByTestId('focused-block-editor'), { key: 'Enter' })
    submitLink('https://example.com/not-a-video')

    await act(async () => {
      await Promise.resolve()
    })
    const p1 = onContentChange.mock.calls.length > 0 ? firstChild(onContentChange) : { type: 'document.paragraph' }
    expect(p1.type).toBe('document.paragraph')
    warn.mockRestore()
  })

  it('embed: inserts with the URL', async () => {
    const { container, onContentChange } = renderEditor()
    await userEvent.click(container.querySelector('[data-block-id="p1"] [data-inline-root]') as HTMLElement)
    typeInFocused('/embed')
    fireEvent.keyDown(screen.getByTestId('focused-block-editor'), { key: 'Enter' })
    submitLink('https://codepen.io/x/pen')

    await waitFor(() => expect(firstChild(onContentChange).type).toBe(EMBED_BLOCK_TYPE))
    expect(firstChild(onContentChange).attributes?.url).toBe('https://codepen.io/x/pen')
  })
})
