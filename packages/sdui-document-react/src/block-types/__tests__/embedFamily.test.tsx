import type { SduiDocumentContent } from '@lodado/sdui-document'
import { BOOKMARK_BLOCK_TYPE, createDocumentBlock, EMBED_BLOCK_TYPE, VIDEO_BLOCK_TYPE } from '@lodado/sdui-document'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import React from 'react'

import { BlockChrome } from '../BlockChrome'
import { SduiEmbedConfigProvider } from '../embed/EmbedConfigContext'

const block = (type: string, attributes: Record<string, unknown>) =>
  createDocumentBlock({ id: 'b', type: type as SduiDocumentContent['root']['type'], attributes })

describe('BookmarkBlock', () => {
  it('renders a card with title/description/host from metadata', () => {
    render(
      <BlockChrome
        block={block(BOOKMARK_BLOCK_TYPE, {
          url: 'https://github.com/lodado/sdui',
          title: 'SDUI',
          description: 'Server-driven UI',
        })}
      />,
    )
    expect(screen.getByText('SDUI')).toBeInTheDocument()
    expect(screen.getByText('Server-driven UI')).toBeInTheDocument()
    expect(screen.getByRole('link')).toHaveAttribute('href', 'https://github.com/lodado/sdui')
  })

  it('degrades to a URL-only card when metadata is missing', () => {
    render(<BlockChrome block={block(BOOKMARK_BLOCK_TYPE, { url: 'https://example.com/path' })} />)
    // title falls back to hostname
    expect(screen.getAllByText('example.com').length).toBeGreaterThan(0)
  })

  it('rejects an unsafe URL', () => {
    render(<BlockChrome block={block(BOOKMARK_BLOCK_TYPE, { url: 'ftp://x.dev' })} />)
    expect(screen.getByText(/Invalid bookmark/)).toBeInTheDocument()
  })
})

describe('VideoBlock (facade)', () => {
  it('shows a play facade first, mounts the iframe only after click', async () => {
    render(<BlockChrome block={block(VIDEO_BLOCK_TYPE, { provider: 'youtube', videoId: 'abc123' })} />)
    expect(document.querySelector('iframe')).toBeNull()

    await userEvent.click(screen.getByRole('button', { name: 'Play video' }))
    const iframe = document.querySelector('iframe')
    expect(iframe).not.toBeNull()
    expect(iframe!.getAttribute('src')).toContain('youtube-nocookie.com/embed/abc123')
    expect(iframe!.getAttribute('sandbox')).toContain('allow-scripts')
  })
})

describe('EmbedBlock (allowlist)', () => {
  const renderEmbed = (url: string, allowedHosts: string[]) =>
    render(
      <SduiEmbedConfigProvider value={{ allowedHosts }}>
        <BlockChrome block={block(EMBED_BLOCK_TYPE, { url, height: 300 })} />
      </SduiEmbedConfigProvider>,
    )

  it('renders an iframe when the host is allowed', () => {
    renderEmbed('https://codepen.io/x/pen', ['codepen.io'])
    const iframe = document.querySelector('iframe')
    expect(iframe).not.toBeNull()
    expect(iframe!.getAttribute('src')).toBe('https://codepen.io/x/pen')
  })

  it('falls back to a card (no iframe) when the host is not allowed', () => {
    renderEmbed('https://evil.example/widget', ['codepen.io'])
    expect(document.querySelector('iframe')).toBeNull()
    expect(screen.getByText('Embedded content')).toBeInTheDocument()
  })

  it('blocks everything with the default empty allowlist', () => {
    render(<BlockChrome block={block(EMBED_BLOCK_TYPE, { url: 'https://codepen.io/x' })} />)
    expect(document.querySelector('iframe')).toBeNull()
  })
})
