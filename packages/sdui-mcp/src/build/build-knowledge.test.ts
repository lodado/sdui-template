import assert from 'node:assert/strict'
import { existsSync, mkdirSync, mkdtempSync, readFileSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import path from 'node:path'
import { test } from 'node:test'

import { sha1 } from '../knowledge.js'
import { buildKnowledge } from './build-knowledge.js'

function makeFakeRepo(): string {
  const root = mkdtempSync(path.join(tmpdir(), 'sdui-repo-'))
  const write = (rel: string, content: string) => {
    mkdirSync(path.dirname(path.join(root, rel)), { recursive: true })
    writeFileSync(path.join(root, rel), content)
  }
  write('.claude/skills/sduiFormat/SKILL.md', '# format\nsyntax body\n')
  write('.claude/skills/sduiArchitecture/SKILL.md', '# arch\narch body\n')
  write(
    '.claude/skills/sduiComponents/SKILL.md',
    '---\nname: sduiComponents\n---\n\n## Overview\n\n### Key Rules\n\n- r\n\n## Base Components\n\n### Div\n\nDiv body.\n',
  )
  write('packages/sdui-template/src/schema/base.ts', 'export type Base = { id: string }\n')
  write('packages/sdui-template/src/schema/document.ts', 'export type Doc = { version: string }\n')
  write('packages/sdui-template/src/schema/node.ts', 'export type Node = { type: string }\n')
  write(
    'apps/docs/src/stories/Card.stories.tsx',
    [
      "import { type SduiLayoutDocument } from '@lodado/sdui-template'",
      'export const Default = {',
      '  render: () => {',
      "    const document: SduiLayoutDocument = { version: '1.0.0', root: { id: 'r', type: 'Card' } }",
      '    return null',
      '  },',
      '}',
    ].join('\n'),
  )
  write('apps/docs/src/stories/Broken.stories.tsx', 'export const Default = { render: () => null }') // no document
  return root
}

test('buildKnowledge writes all knowledge files and a consistent manifest', () => {
  const repoRoot = makeFakeRepo()
  const outDir = path.join(repoRoot, 'out')
  const manifest = buildKnowledge({ repoRoot, outDir })

  for (const expected of [
    'syntax.md',
    'architecture.md',
    'types.md',
    'components/_overview.md',
    'components/Div.md',
    'examples/Card.md',
    'manifest.json',
  ]) {
    assert.ok(existsSync(path.join(outDir, expected)), `${expected} should exist`)
  }

  // Broken.stories.tsx has no document -> listed in skipped, no examples/Broken.md
  assert.ok(manifest.skipped.includes('Broken.stories.tsx'))
  assert.ok(!existsSync(path.join(outDir, 'examples/Broken.md')))

  // manifest hashes match file contents
  for (const file of manifest.files) {
    const content = readFileSync(path.join(outDir, file.path), 'utf8')
    assert.equal(file.hash, sha1(content), `hash mismatch for ${file.path}`)
    assert.ok(file.lastModified.length > 0)
  }

  // types.md contains all three schema sources with file markers
  const types = readFileSync(path.join(outDir, 'types.md'), 'utf8')
  assert.ok(types.includes('schema/base.ts'))
  assert.ok(types.includes('export type Doc'))
})
