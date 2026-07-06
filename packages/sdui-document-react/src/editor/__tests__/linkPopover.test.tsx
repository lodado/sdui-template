import type { SduiDocumentContent } from '@lodado/sdui-document'
import { createDocumentBlock } from '@lodado/sdui-document'
import { fireEvent, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import React from 'react'

import { SduiDocumentEditor } from '../SduiDocumentEditor'

function linkedContent(): SduiDocumentContent {
  return {
    schemaVersion: '1.0',
    root: createDocumentBlock({
      id: 'root',
      type: 'document.root',
      children: [
        {
          id: 'p1',
          type: 'document.paragraph',
          state: {
            text: 'visit here',
            content: [
              { type: 'text', text: 'visit ' },
              { type: 'text', text: 'here', marks: [{ type: 'link', attrs: { href: 'https://a.com' } }] },
            ],
          },
        },
      ],
    }),
  }
}

function p1Content(onContentChange: jest.Mock) {
  const content = onContentChange.mock.calls.at(-1)?.[0] as SduiDocumentContent
  const p1 = content.root.children?.find((child) => child.id === 'p1')
  return (p1?.state?.content ?? []) as Array<{
    type: string
    marks?: Array<{ type: string; attrs?: { href: string } }>
  }>
}

function linkMarks(nodes: ReturnType<typeof p1Content>) {
  return nodes.flatMap((node) => (node.marks ?? []).filter((mark) => mark.type === 'link'))
}

describe('link click popover (editable mode)', () => {
  test('clicking a link opens the action popover instead of navigating', () => {
    const { container } = render(<SduiDocumentEditor content={linkedContent()} />)

    const anchor = container.querySelector('a.sdui-doc-link') as HTMLAnchorElement
    const notPrevented = fireEvent.click(anchor)

    expect(notPrevented).toBe(false) // default navigation prevented
    expect(screen.getByText('Open')).toBeInTheDocument()
    expect(screen.getByText('Edit')).toBeInTheDocument()
    expect(screen.getByText('Copy')).toBeInTheDocument()
    expect(screen.getByText('Remove')).toBeInTheDocument()
  })

  test('Cmd/Ctrl+click bypasses the popover and navigates', () => {
    const { container } = render(<SduiDocumentEditor content={linkedContent()} />)

    const anchor = container.querySelector('a.sdui-doc-link') as HTMLAnchorElement
    const notPrevented = fireEvent.click(anchor, { metaKey: true })

    expect(notPrevented).toBe(true)
    expect(screen.queryByText('Open')).not.toBeInTheDocument()
  })

  test('Remove strips the link mark from the block', () => {
    const onContentChange = jest.fn()
    const { container } = render(<SduiDocumentEditor content={linkedContent()} onContentChange={onContentChange} />)

    fireEvent.click(container.querySelector('a.sdui-doc-link') as HTMLAnchorElement)
    fireEvent.click(screen.getByText('Remove'))

    expect(linkMarks(p1Content(onContentChange))).toHaveLength(0)
  })

  test('Edit rewrites the href', async () => {
    const user = userEvent.setup()
    const onContentChange = jest.fn()
    const { container } = render(<SduiDocumentEditor content={linkedContent()} onContentChange={onContentChange} />)

    fireEvent.click(container.querySelector('a.sdui-doc-link') as HTMLAnchorElement)
    fireEvent.click(screen.getByText('Edit'))

    const input = screen.getByLabelText('Link URL')
    await user.clear(input)
    await user.type(input, 'https://z.com{Enter}')

    expect(linkMarks(p1Content(onContentChange))[0]?.attrs?.href).toBe('https://z.com')
  })

  test('popover follows the link on scroll (re-measures the anchor rect)', () => {
    const { container } = render(<SduiDocumentEditor content={linkedContent()} />)
    const anchor = container.querySelector('a.sdui-doc-link') as HTMLAnchorElement

    const rectAt = (bottom: number, left: number) =>
      ({ bottom, left, top: bottom - 20, right: left + 40, width: 40, height: 20, x: left, y: bottom - 20 } as DOMRect)

    anchor.getBoundingClientRect = jest.fn(() => rectAt(100, 20))
    fireEvent.click(anchor)

    const popover = container.querySelector('[data-link-popover]') as HTMLElement
    expect(popover.style.top).toBe('106px') // rect.bottom + 6
    expect(popover.style.left).toBe('20px')

    // scroll up 60px: the link moved, the fixed popover must follow
    anchor.getBoundingClientRect = jest.fn(() => rectAt(40, 20))
    fireEvent.scroll(window)

    expect(popover.style.top).toBe('46px')
  })

  test('popover closes when its link scrolls out of the DOM', () => {
    const { container } = render(<SduiDocumentEditor content={linkedContent()} />)
    const anchor = container.querySelector('a.sdui-doc-link') as HTMLAnchorElement

    fireEvent.click(anchor)
    expect(container.querySelector('[data-link-popover]')).toBeInTheDocument()

    anchor.remove() // element detached (e.g. block unmounted while scrolling)
    fireEvent.scroll(window)

    expect(container.querySelector('[data-link-popover]')).not.toBeInTheDocument()
  })

  test('read-only mode leaves native link behavior intact', () => {
    const { container } = render(<SduiDocumentEditor content={linkedContent()} readOnly />)

    const anchor = container.querySelector('a.sdui-doc-link') as HTMLAnchorElement
    const notPrevented = fireEvent.click(anchor)

    expect(notPrevented).toBe(true)
    expect(screen.queryByText('Open')).not.toBeInTheDocument()
  })
})
