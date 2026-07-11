import assert from 'node:assert/strict'
import { mkdtempSync, mkdirSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import path from 'node:path'
import { test } from 'node:test'

import { computeDelta, loadManifest, readKnowledgeFile, sha1 } from './knowledge.js'
import type { KnowledgeManifest } from './knowledge.js'

function makeKnowledgeDir(): string {
  const dir = mkdtempSync(path.join(tmpdir(), 'sdui-knowledge-'))
  mkdirSync(path.join(dir, 'components'), { recursive: true })
  writeFileSync(path.join(dir, 'syntax.md'), '# syntax\n')
  writeFileSync(path.join(dir, 'components', 'Card.md'), '### Card\n')
  const manifest: KnowledgeManifest = {
    generatedAt: '2026-07-11T00:00:00.000Z',
    gitCommit: 'abc1234',
    files: [
      { path: 'syntax.md', hash: sha1('# syntax\n'), lastModified: '2026-07-01T00:00:00.000Z' },
      { path: 'components/Card.md', hash: sha1('### Card\n'), lastModified: '2026-07-02T00:00:00.000Z' },
    ],
    skipped: [],
  }
  writeFileSync(path.join(dir, 'manifest.json'), JSON.stringify(manifest))
  return dir
}

test('loadManifest parses manifest.json', () => {
  const dir = makeKnowledgeDir()
  const manifest = loadManifest(dir)
  assert.equal(manifest.gitCommit, 'abc1234')
  assert.equal(manifest.files.length, 2)
})

test('readKnowledgeFile reads relative paths inside dir', () => {
  const dir = makeKnowledgeDir()
  assert.equal(readKnowledgeFile(dir, 'components/Card.md'), '### Card\n')
})

test('readKnowledgeFile rejects path traversal', () => {
  const dir = makeKnowledgeDir()
  assert.throws(() => readKnowledgeFile(dir, '../../../etc/passwd'), /outside knowledge directory/)
  assert.throws(() => readKnowledgeFile(dir, '/etc/passwd'), /outside knowledge directory/)
})

test('computeDelta: empty knownHashes means everything changed', () => {
  const dir = makeKnowledgeDir()
  const delta = computeDelta(loadManifest(dir), {})
  assert.deepEqual(delta.changed.sort(), ['components/Card.md', 'syntax.md'])
  assert.deepEqual(delta.removed, [])
})

test('computeDelta: matching hashes yield no changes; stale + orphan detected', () => {
  const dir = makeKnowledgeDir()
  const manifest = loadManifest(dir)
  const fresh = Object.fromEntries(manifest.files.map((f) => [f.path, f.hash]))
  assert.deepEqual(computeDelta(manifest, fresh), { changed: [], removed: [] })

  const stale = { ...fresh, 'syntax.md': 'deadbeef', 'gone.md': 'cafe' }
  const delta = computeDelta(manifest, stale)
  assert.deepEqual(delta.changed, ['syntax.md'])
  assert.deepEqual(delta.removed, ['gone.md'])
})
