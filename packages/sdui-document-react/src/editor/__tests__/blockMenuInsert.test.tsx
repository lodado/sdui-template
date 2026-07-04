import type { SduiDocumentContent } from '@lodado/sdui-document'
import { createDocumentBlock } from '@lodado/sdui-document'
import { act, fireEvent, render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import type { EditorView } from 'prosemirror-view'
import React from 'react'

import { SduiDocumentEditor } from '../SduiDocumentEditor'

function createContent(children: Parameters<typeof createDocumentBlock>[0][]): SduiDocumentContent {
  return {
    schemaVersion: '1.0',
    root: createDocumentBlock({ id: 'root', type: 'document.root', children }),
  }
}

const twoParagraphs = () =>
  createContent([
    { id: 'p1', type: 'document.paragraph', state: { text: 'First' } },
    { id: 'p2', type: 'document.paragraph', state: { text: '' } },
  ])

function renderEditor(
  content: SduiDocumentContent,
  overrides?: Partial<React.ComponentProps<typeof SduiDocumentEditor>>,
) {
  const ids = ['gen-1', 'gen-2', 'gen-3']
  const onContentChange = jest.fn()
  const utils = render(
    <SduiDocumentEditor
      content={content}
      onContentChange={onContentChange}
      generateBlockId={() => ids.shift() ?? 'gen-x'}
      {...overrides}
    />,
  )

  return { ...utils, onContentChange }
}

function blockIds(container: HTMLElement): string[] {
  return Array.from(container.querySelectorAll('[data-block-id]')).map(
    (element) => element.getAttribute('data-block-id') ?? '',
  )
}

/** Latest document content published to the consumer. */
function lastContent(onContentChange: jest.Mock): SduiDocumentContent {
  return onContentChange.mock.calls[onContentChange.mock.calls.length - 1][0]
}

function findChild(content: SduiDocumentContent, id: string) {
  return (content.root.children ?? []).find((child) => child.id === id)
}

/** jsdom cannot type into contenteditable — drive PM through the test-only view handle. */
function typeIntoFocusedBlock(text: string): void {
  const host = screen.getByTestId('focused-block-editor') as HTMLElement & { pmView?: EditorView }
  const view = host.pmView
  if (!view) {
    throw new Error('pmView test handle missing')
  }

  act(() => {
    view.dispatch(view.state.tr.insertText(text, view.state.selection.from))
  })
}

function pressKeyOnFocusedBlock(key: string): void {
  fireEvent.keyDown(screen.getByTestId('focused-block-editor'), { key })
}

describe('block menu insert semantics (Notion style)', () => {
  test('empty block + /divider + Enter converts the SAME block in place', async () => {
    const user = userEvent.setup()
    const { container, onContentChange } = renderEditor(twoParagraphs())

    // focus the empty paragraph p2 via its static textbox
    const p2Static = container.querySelector('[data-block-id="p2"] [data-inline-root]') as HTMLElement
    await user.click(p2Static)
    typeIntoFocusedBlock('/divider')
    pressKeyOnFocusedBlock('Enter')

    const doc = lastContent(onContentChange)
    const p2 = findChild(doc, 'p2')
    expect(p2?.type).toBe('document.divider')
    // no extra sibling beyond the trailing-block invariant paragraph
    expect(blockIds(container)).toEqual(['p1', 'p2', 'gen-1'])
  })

  test('non-empty block + /head + Enter inserts a new heading sibling below', async () => {
    const user = userEvent.setup()
    const { container, onContentChange } = renderEditor(twoParagraphs())

    await user.click(screen.getByText('First'))
    typeIntoFocusedBlock('/head')
    pressKeyOnFocusedBlock('Enter')

    expect(blockIds(container)).toEqual(['p1', 'gen-1', 'p2'])
    const doc = lastContent(onContentChange)
    const inserted = findChild(doc, 'gen-1')
    expect(inserted?.type).toBe('document.heading')
    expect(inserted?.attributes).toEqual({ level: 1 })
    // original untouched
    expect(findChild(doc, 'p1')?.state?.text).toBe('First')
    // new block focused
    expect(screen.getByTestId('focused-block-editor').closest('[data-block-id]')).toHaveAttribute(
      'data-block-id',
      'gen-1',
    )
  })

  test('single undo reverts the whole menu insert in one step', async () => {
    const user = userEvent.setup()
    const { container } = renderEditor(twoParagraphs())

    await user.click(screen.getByText('First'))
    typeIntoFocusedBlock('/head')
    pressKeyOnFocusedBlock('Enter')
    expect(blockIds(container)).toEqual(['p1', 'gen-1', 'p2'])

    await user.keyboard('{Control>}z{/Control}')

    expect(blockIds(container)).toEqual(['p1', 'p2'])
  })

  describe('image upload flow', () => {
    const pickImage = async (overrides?: Partial<React.ComponentProps<typeof SduiDocumentEditor>>) => {
      const user = userEvent.setup()
      const rendered = renderEditor(twoParagraphs(), overrides)

      await user.click(screen.getByText('First'))
      typeIntoFocusedBlock('/image')
      pressKeyOnFocusedBlock('Enter')

      const input = rendered.container.querySelector('[data-block-menu-file-input]') as HTMLInputElement
      expect(input).not.toBeNull()
      const file = new File(['x'], 'photo.png', { type: 'image/png' })
      fireEvent.change(input, { target: { files: [file] } })

      return rendered
    }

    test('resolving onUploadFile: placeholder then src, upload flag cleared', async () => {
      let resolveUpload: (value: { url: string }) => void = () => {}
      const onUploadFile = jest.fn(
        () =>
          new Promise<{ url: string }>((resolve) => {
            resolveUpload = resolve
          }),
      )
      const { onContentChange } = await pickImage({ onUploadFile })

      // placeholder inserted below p1 with uploading state
      const placeholder = findChild(lastContent(onContentChange), 'gen-1')
      expect(placeholder?.type).toBe('document.image')
      expect(placeholder?.state?.upload).toBe('uploading')
      expect(placeholder?.attributes).toEqual({ alt: 'photo.png' })

      await act(async () => {
        resolveUpload({ url: 'https://cdn/x.png' })
        await Promise.resolve()
      })

      await waitFor(() => {
        const done = findChild(lastContent(onContentChange), 'gen-1')
        expect(done?.attributes?.src).toBe('https://cdn/x.png')
        expect(done?.state?.upload).toBeUndefined()
      })
      expect(onUploadFile).toHaveBeenCalledTimes(1)
    })

    test('rejecting onUploadFile marks the block with upload error', async () => {
      const onUploadFile = jest.fn(() => Promise.reject(new Error('nope')))
      const { onContentChange } = await pickImage({ onUploadFile })

      await waitFor(() => {
        const failed = findChild(lastContent(onContentChange), 'gen-1')
        expect(failed?.state?.upload).toBe('error')
      })
    })

    test('upload resolving after the block was deleted fires no patch', async () => {
      let resolveUpload: (value: { url: string }) => void = () => {}
      const onUploadFile = jest.fn(
        () =>
          new Promise<{ url: string }>((resolve) => {
            resolveUpload = resolve
          }),
      )
      const user = userEvent.setup()
      const { onContentChange } = await pickImage({ onUploadFile })

      // the placeholder block is selected after insert — delete it before resolving
      await user.keyboard('{Backspace}')
      expect(findChild(lastContent(onContentChange), 'gen-1')).toBeUndefined()
      const callsBefore = onContentChange.mock.calls.length

      await act(async () => {
        resolveUpload({ url: 'https://cdn/late.png' })
        await Promise.resolve()
      })

      expect(onContentChange.mock.calls.length).toBe(callsBefore)
    })

    test('no onUploadFile prop falls back to an object URL', async () => {
      const createObjectURL = jest.fn(() => 'blob:local-1')
      ;(URL as unknown as { createObjectURL: unknown }).createObjectURL = createObjectURL
      const { onContentChange } = await pickImage()

      await waitFor(() => {
        const done = findChild(lastContent(onContentChange), 'gen-1')
        expect(done?.attributes?.src).toBe('blob:local-1')
        expect(done?.state?.upload).toBeUndefined()
      })
      expect(createObjectURL).toHaveBeenCalledTimes(1)
    })
  })

  test('link selected from the menu inserts a link block with the submitted url', async () => {
    const user = userEvent.setup()
    const { onContentChange } = renderEditor(twoParagraphs())

    await user.click(screen.getByText('First'))
    typeIntoFocusedBlock('/link')
    pressKeyOnFocusedBlock('Enter')
    await user.type(screen.getByPlaceholderText('https://…'), 'example.com{Enter}')

    const doc = lastContent(onContentChange)
    const inserted = findChild(doc, 'gen-1')
    expect(inserted?.type).toBe('document.link')
    expect(inserted?.attributes?.url).toBe('https://example.com')
  })
})
