import assert from 'node:assert/strict'
import { test } from 'node:test'

import { extractStories, renderExamplesMarkdown } from './extract-stories.js'

const FIXTURE = `
import { type SduiLayoutDocument, SduiLayoutRenderer } from '@lodado/sdui-template'
import { Card, sduiComponents } from '@lodado/sdui-template-component'
import type { Meta, StoryObj } from '@storybook/react-vite'
import React from 'react'

const meta: Meta<typeof Card> = { title: 'Shared/UI/Card', component: Card }
export default meta
type Story = StoryObj<typeof Card>

export const Default: Story = {
  render: () => {
    const document: SduiLayoutDocument = {
      version: '1.0.0',
      root: { id: 'root', type: 'Card', children: [] },
    }
    return <SduiLayoutRenderer document={document} components={sduiComponents} />
  },
}

export const WithTitle: Story = {
  render: () => {
    const document: SduiLayoutDocument = {
      version: '1.0.0',
      root: {
        id: 'root',
        type: 'Card',
        attributes: { title: 'Hello' },
        children: [{ id: 'c1', type: 'Span', state: { text: 'body' } }],
      },
    }
    return <SduiLayoutRenderer document={document} components={sduiComponents} />
  },
}

export const NoDocument: Story = {
  render: () => <div>static</div>,
}
`

test('extracts document literal per exported story', () => {
  const result = extractStories('Card.stories.tsx', FIXTURE)
  assert.equal(result.component, 'Card')
  assert.deepEqual(
    result.stories.map((s) => s.name),
    ['Default', 'WithTitle'], // shortest document first; NoDocument skipped
  )
  assert.ok(result.stories[0].document.includes("version: '1.0.0'"))
  assert.ok(result.stories[1].document.includes("title: 'Hello'"))
})

test('caps story count via maxStories', () => {
  const result = extractStories('Card.stories.tsx', FIXTURE, 1)
  assert.equal(result.stories.length, 1)
  assert.equal(result.stories[0].name, 'Default')
})

test('renders markdown with component heading and ts fences', () => {
  const md = renderExamplesMarkdown(extractStories('Card.stories.tsx', FIXTURE))
  assert.ok(md.startsWith('# Card — Storybook usage examples'))
  assert.ok(md.includes('## Default'))
  assert.ok(md.includes('```ts'))
  assert.ok(md.includes('SduiLayoutRenderer document={document} components={sduiComponents}'))
})
