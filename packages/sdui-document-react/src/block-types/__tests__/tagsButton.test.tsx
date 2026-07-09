import type { SduiDocumentContent } from '@lodado/sdui-document'
import { BUTTON_BLOCK_TYPE, createDocumentBlock, TAGS_BLOCK_TYPE } from '@lodado/sdui-document'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import React from 'react'

import { SduiDocumentEditor } from '../../editor/SduiDocumentEditor'
import { BlockChrome } from '../BlockChrome'

const block = (type: string, attributes: Record<string, unknown>, text?: string) =>
  createDocumentBlock({
    id: 'b',
    type: type as SduiDocumentContent['root']['type'],
    attributes,
    state: text === undefined ? undefined : { text },
  })

describe('TagsBlock (read mode)', () => {
  it('renders static chips', () => {
    render(
      <BlockChrome
        block={block(TAGS_BLOCK_TYPE, {
          items: [
            { id: 'a', label: 'React', color: 'blue' },
            { id: 'b', label: 'TypeScript' },
          ],
        })}
      />,
    )
    expect(screen.getByText('React')).toBeInTheDocument()
    expect(screen.getByText('TypeScript')).toBeInTheDocument()
    expect(screen.queryByLabelText('Add tag')).not.toBeInTheDocument()
  })
})

describe('ButtonBlock (read mode)', () => {
  it('renders a CTA link with variant + target', () => {
    render(<BlockChrome block={block(BUTTON_BLOCK_TYPE, { href: 'https://x.dev', variant: 'outline' }, 'Visit')} />)
    const link = screen.getByRole('link', { name: 'Visit' })
    expect(link).toHaveAttribute('href', 'https://x.dev')
    expect(link).toHaveAttribute('data-variant', 'outline')
    expect(link).toHaveAttribute('rel', 'noopener noreferrer')
  })

  it('mailto link omits target _blank', () => {
    render(<BlockChrome block={block(BUTTON_BLOCK_TYPE, { href: 'mailto:a@b.com' }, 'Email')} />)
    expect(screen.getByRole('link', { name: 'Email' })).not.toHaveAttribute('target')
  })

  it('renders inert (no link) for an unsafe href', () => {
    render(<BlockChrome block={block(BUTTON_BLOCK_TYPE, { href: 'ftp://x.dev' }, 'Nope')} />)
    expect(screen.queryByRole('link')).not.toBeInTheDocument()
    expect(screen.getByText('Nope')).toBeInTheDocument()
  })
})

describe('tags/button editing (in editor)', () => {
  function contentWith(child: Parameters<typeof createDocumentBlock>[0]): SduiDocumentContent {
    return {
      schemaVersion: '1.0',
      root: createDocumentBlock({
        id: 'root',
        type: 'document.root',
        children: [child, { id: 'tail', type: 'document.paragraph', state: { text: '' } }],
      }),
    }
  }

  const renderEditor = (child: Parameters<typeof createDocumentBlock>[0]) => {
    const onContentChange = jest.fn()
    let n = 0
    render(
      <SduiDocumentEditor
        content={contentWith(child)}
        onContentChange={onContentChange}
        generateBlockId={() => {
          n += 1
          return `gen-${n}`
        }}
      />,
    )
    return { onContentChange }
  }

  const firstChild = (onContentChange: jest.Mock) => {
    const last: SduiDocumentContent = onContentChange.mock.calls.at(-1)![0]
    return last.root.children![0]
  }

  it('adds a tag via the input', async () => {
    const { onContentChange } = renderEditor({ id: 'tg', type: TAGS_BLOCK_TYPE, attributes: { items: [] } })
    await userEvent.type(screen.getByLabelText('Add tag'), 'GraphQL{Enter}')

    const items = firstChild(onContentChange).attributes?.items as { label: string }[]
    expect(items.map((item) => item.label)).toContain('GraphQL')
  })

  it('edits a button label and variant via the popover', async () => {
    const { onContentChange } = renderEditor({
      id: 'bt',
      type: BUTTON_BLOCK_TYPE,
      state: { text: 'Old' },
      attributes: { href: 'https://x.dev', variant: 'primary' },
    })

    await userEvent.click(screen.getByRole('button', { name: 'Edit button' }))
    await userEvent.click(screen.getByRole('button', { name: 'outline' }))
    expect(firstChild(onContentChange).attributes?.variant).toBe('outline')
  })
})
