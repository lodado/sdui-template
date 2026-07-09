import type { SduiDocumentContent } from '@lodado/sdui-document'
import { BOOKMARK_BLOCK_TYPE, createDocumentBlock, EMBED_BLOCK_TYPE, VIDEO_BLOCK_TYPE } from '@lodado/sdui-document'
import { SduiDocumentEditor, SduiEmbedConfigProvider } from '@lodado/sdui-document-react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import React from 'react'

const meta: Meta = {
  title: 'Document/Embed Blocks',
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'Embed-family blocks (plan-03): `bookmark` (unfurl card, metadata persisted at edit time), ' +
          '`video` (YouTube/Vimeo facade — thumbnail first, iframe on click), and `embed` (generic iframe ' +
          'gated by a host allowlist; disallowed hosts render a fallback card).',
      },
    },
  },
  tags: ['autodocs'],
}

export default meta

const content: SduiDocumentContent = {
  schemaVersion: '1.0',
  root: createDocumentBlock({
    id: 'root',
    type: 'document.root',
    children: [
      { id: 'h1', type: 'document.heading', state: { text: 'Bookmark' }, attributes: { level: 3 } },
      {
        id: 'bm',
        type: BOOKMARK_BLOCK_TYPE,
        attributes: {
          url: 'https://github.com/lodado/sdui-template',
          title: '@lodado/sdui-template',
          description: 'Server-Driven UI template library for React with subscription-based rendering.',
          faviconUrl: 'https://github.com/favicon.ico',
        },
      },
      { id: 'h2', type: 'document.heading', state: { text: 'Video' }, attributes: { level: 3 } },
      {
        id: 'vid',
        type: VIDEO_BLOCK_TYPE,
        attributes: {
          url: 'https://youtu.be/dQw4w9WgXcQ',
          provider: 'youtube',
          videoId: 'dQw4w9WgXcQ',
          aspectRatio: '16:9',
        },
      },
      { id: 'h3', type: 'document.heading', state: { text: 'Embed (allowlisted)' }, attributes: { level: 3 } },
      {
        id: 'emb',
        type: EMBED_BLOCK_TYPE,
        attributes: { url: 'https://codepen.io/team/codepen/embed/PNaGbb', height: 320 },
      },
    ],
  }),
}

export const AllThree: StoryObj = {
  render: () => (
    <SduiEmbedConfigProvider value={{ allowedHosts: ['codepen.io', 'codesandbox.io'] }}>
      <div style={{ maxWidth: 720, margin: '0 auto' }}>
        <SduiDocumentEditor content={content} readOnly />
      </div>
    </SduiEmbedConfigProvider>
  ),
}

export const EmbedBlockedByAllowlist: StoryObj = {
  render: () => (
    <SduiEmbedConfigProvider value={{ allowedHosts: [] }}>
      <div style={{ maxWidth: 720, margin: '0 auto' }}>
        <SduiDocumentEditor content={content} readOnly />
      </div>
    </SduiEmbedConfigProvider>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'With an empty allowlist the embed falls back to a link card — the document data never forces an iframe.',
      },
    },
  },
}
