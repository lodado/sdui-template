import assert from 'node:assert/strict'
import { mkdirSync, mkdtempSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import path from 'node:path'
import { test } from 'node:test'

import { Client } from '@modelcontextprotocol/client'
import { InMemoryTransport } from '@modelcontextprotocol/server'

import { sha1 } from './knowledge.js'
import { createServer } from './server.js'

function makeKnowledgeDir(): string {
  const dir = mkdtempSync(path.join(tmpdir(), 'sdui-server-'))
  mkdirSync(path.join(dir, 'components'), { recursive: true })
  mkdirSync(path.join(dir, 'examples'), { recursive: true })
  const files: Record<string, string> = {
    'syntax.md': '# syntax guide\n',
    'components/_overview.md': '## Overview\n',
    'components/Card.md': '### Card\n\nCard is a container.\n',
    'examples/Card.md': '# Card — Storybook usage examples\n',
  }
  for (const [rel, content] of Object.entries(files)) writeFileSync(path.join(dir, rel), content)
  writeFileSync(
    path.join(dir, 'manifest.json'),
    JSON.stringify({
      generatedAt: '2026-07-11T00:00:00.000Z',
      gitCommit: 'abc1234',
      files: Object.entries(files).map(([rel, content]) => ({
        path: rel,
        hash: sha1(content),
        lastModified: '2026-07-01T00:00:00.000Z',
      })),
      skipped: [],
    }),
  )
  return dir
}

async function connect(dir: string): Promise<Client> {
  const server = createServer(dir)
  const [clientTransport, serverTransport] = InMemoryTransport.createLinkedPair()
  await server.connect(serverTransport)
  const client = new Client({ name: 'test-client', version: '0.0.0' })
  await client.connect(clientTransport)
  return client
}

function textOf(result: { content?: { type: string; text?: string }[] }): string {
  const block = result.content?.find((c) => c.type === 'text')
  assert.ok(block?.text, 'expected text content block')
  return block.text
}

test('sdui_get_guide returns syntax file and component file case-insensitively', async () => {
  const client = await connect(makeKnowledgeDir())
  const syntax = await client.callTool({ name: 'sdui_get_guide', arguments: { topic: 'syntax' } })
  assert.ok(textOf(syntax).includes('# syntax guide'))
  const card = await client.callTool({ name: 'sdui_get_guide', arguments: { topic: 'card' } })
  assert.ok(textOf(card).includes('Card is a container'))
})

test('sdui_get_guide unknown topic lists valid topics without throwing', async () => {
  const client = await connect(makeKnowledgeDir())
  const result = await client.callTool({ name: 'sdui_get_guide', arguments: { topic: 'Nope' } })
  assert.equal(result.isError, true)
  assert.ok(textOf(result).includes('Card'))
})

test('sdui_list_components lists component names', async () => {
  const client = await connect(makeKnowledgeDir())
  const result = await client.callTool({ name: 'sdui_list_components', arguments: {} })
  assert.ok(textOf(result).includes('Card'))
  assert.ok(!textOf(result).includes('_overview'))
})

test('sdui_get_snapshot returns delta only', async () => {
  const dir = makeKnowledgeDir()
  const client = await connect(dir)

  const full = JSON.parse(textOf(await client.callTool({ name: 'sdui_get_snapshot', arguments: {} })))
  assert.equal(full.files.length, 4)
  assert.equal(full.manifest.gitCommit, 'abc1234')

  const knownHashes = Object.fromEntries(
    full.manifest.files.map((f: { path: string; hash: string }) => [f.path, f.hash]),
  )
  const fresh = JSON.parse(textOf(await client.callTool({ name: 'sdui_get_snapshot', arguments: { knownHashes } })))
  assert.equal(fresh.files.length, 0)

  const stale = JSON.parse(
    textOf(
      await client.callTool({
        name: 'sdui_get_snapshot',
        arguments: { knownHashes: { ...knownHashes, 'syntax.md': 'deadbeef', 'orphan.md': 'ff' } },
      }),
    ),
  )
  assert.deepEqual(
    stale.files.map((f: { path: string }) => f.path),
    ['syntax.md'],
  )
  assert.deepEqual(stale.removed, ['orphan.md'])
})
