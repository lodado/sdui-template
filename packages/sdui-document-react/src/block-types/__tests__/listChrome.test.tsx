import { createDocumentBlock } from '@lodado/sdui-document'
import { render, screen } from '@testing-library/react'
import React from 'react'

import { numberedListOrdinals } from '../../editor/blockContent'
import { BlockChrome } from '../BlockChrome'

const make = (id: string, type: string, text = 'item') => createDocumentBlock({ id, type, state: { text } })

describe('list chrome', () => {
  test('bulleted item renders a Notion marker cycling by depth', () => {
    const { rerender } = render(
      <BlockChrome block={make('b1', 'document.bulleted-list')} depth={1}>
        <span>item</span>
      </BlockChrome>,
    )
    expect(screen.getByText('•')).toBeInTheDocument()

    rerender(
      <BlockChrome block={make('b1', 'document.bulleted-list')} depth={2}>
        <span>item</span>
      </BlockChrome>,
    )
    expect(screen.getByText('◦')).toBeInTheDocument()

    rerender(
      <BlockChrome block={make('b1', 'document.bulleted-list')} depth={4}>
        <span>item</span>
      </BlockChrome>,
    )
    expect(screen.getByText('•')).toBeInTheDocument()
  })

  test('numbered item renders the ordinal from props', () => {
    render(
      <BlockChrome block={make('n1', 'document.numbered-list')} listOrdinal={3}>
        <span>item</span>
      </BlockChrome>,
    )
    expect(screen.getByText('3.')).toBeInTheDocument()
  })

  test('numbered item without ordinal falls back to 1.', () => {
    render(
      <BlockChrome block={make('n1', 'document.numbered-list')}>
        <span>item</span>
      </BlockChrome>,
    )
    expect(screen.getByText('1.')).toBeInTheDocument()
  })

  test('quote renders a blockquote element', () => {
    const { container } = render(
      <BlockChrome block={make('q1', 'document.quote')}>
        <span>quoted</span>
      </BlockChrome>,
    )
    expect(container.querySelector('blockquote.quote-block')).toBeInTheDocument()
  })

  test('numberedListOrdinals: consecutive runs count, other types reset', () => {
    const children = [
      make('a', 'document.numbered-list'),
      make('b', 'document.numbered-list'),
      make('c', 'document.paragraph'),
      make('d', 'document.numbered-list'),
    ]
    const ordinals = numberedListOrdinals(children)
    expect(ordinals.get('a')).toBe(1)
    expect(ordinals.get('b')).toBe(2)
    expect(ordinals.has('c')).toBe(false)
    expect(ordinals.get('d')).toBe(1)
  })
})
