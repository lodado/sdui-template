import { execSync } from 'node:child_process'
import { mkdirSync, readdirSync, readFileSync, rmSync, statSync, writeFileSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

import { sha1 } from '../knowledge.js'
import type { KnowledgeFile, KnowledgeManifest } from '../knowledge.js'
import { extractStories, renderExamplesMarkdown } from './extract-stories.js'
import { splitComponentsSkill } from './split-components.js'

export interface BuildOptions {
  repoRoot: string
  outDir: string
}

const TYPE_SOURCES = [
  'packages/sdui-template/src/schema/base.ts',
  'packages/sdui-template/src/schema/document.ts',
  'packages/sdui-template/src/schema/node.ts',
]

/** ISO date of last git commit touching the file; falls back to fs mtime for untracked/non-git contexts. */
function lastModified(repoRoot: string, relativeSource: string): string {
  try {
    const out = execSync(`git log -1 --format=%cI -- "${relativeSource}"`, {
      cwd: repoRoot,
      stdio: ['ignore', 'pipe', 'ignore'],
    })
      .toString()
      .trim()
    if (out) return out
  } catch {
    // not a git repo (e.g. tests) — fall through to mtime
  }
  return statSync(path.join(repoRoot, relativeSource)).mtime.toISOString()
}

function gitCommit(repoRoot: string): string {
  try {
    return execSync('git rev-parse --short HEAD', { cwd: repoRoot, stdio: ['ignore', 'pipe', 'ignore'] })
      .toString()
      .trim()
  } catch {
    return 'unknown'
  }
}

export function buildKnowledge(options: BuildOptions): KnowledgeManifest {
  const { repoRoot, outDir } = options
  rmSync(outDir, { recursive: true, force: true })
  mkdirSync(path.join(outDir, 'components'), { recursive: true })
  mkdirSync(path.join(outDir, 'examples'), { recursive: true })

  const files: KnowledgeFile[] = []
  const skipped: string[] = []
  const emit = (relativeOut: string, content: string, sourceForDate: string) => {
    writeFileSync(path.join(outDir, relativeOut), content)
    files.push({ path: relativeOut, hash: sha1(content), lastModified: lastModified(repoRoot, sourceForDate) })
  }

  // 1. Skill files copied verbatim
  const syntaxSource = '.claude/skills/sduiFormat/SKILL.md'
  emit('syntax.md', readFileSync(path.join(repoRoot, syntaxSource), 'utf8'), syntaxSource)

  const archSource = '.claude/skills/sduiArchitecture/SKILL.md'
  emit('architecture.md', readFileSync(path.join(repoRoot, archSource), 'utf8'), archSource)

  // 2. Per-component split
  const componentsSource = '.claude/skills/sduiComponents/SKILL.md'
  const split = splitComponentsSkill(readFileSync(path.join(repoRoot, componentsSource), 'utf8'))
  emit('components/_overview.md', split.overview, componentsSource)
  for (const [name, body] of Object.entries(split.components)) {
    emit(`components/${name}.md`, body, componentsSource)
  }

  // 3. Types: schema sources concatenated verbatim with file markers
  const typesSections = TYPE_SOURCES.map((source) => {
    const code = readFileSync(path.join(repoRoot, source), 'utf8')
    return `## ${source}\n\n\`\`\`ts\n${code.trimEnd()}\n\`\`\``
  })
  emit('types.md', `# SDUI public types\n\n${typesSections.join('\n\n')}\n`, TYPE_SOURCES[0])

  // 4. Storybook examples
  const storiesDir = path.join(repoRoot, 'apps/docs/src/stories')
  const storyFiles = readdirSync(storiesDir).filter((f) => f.endsWith('.stories.tsx'))
  for (const storyFile of storyFiles) {
    try {
      const source = readFileSync(path.join(storiesDir, storyFile), 'utf8')
      const result = extractStories(storyFile, source)
      if (result.stories.length === 0) {
        skipped.push(storyFile)
        continue
      }
      emit(`examples/${result.component}.md`, renderExamplesMarkdown(result), `apps/docs/src/stories/${storyFile}`)
    } catch {
      skipped.push(storyFile)
    }
  }

  const manifest: KnowledgeManifest = {
    generatedAt: new Date().toISOString(),
    gitCommit: gitCommit(repoRoot),
    files,
    skipped,
  }
  writeFileSync(path.join(outDir, 'manifest.json'), JSON.stringify(manifest, null, 2))
  return manifest
}

// CLI entry: `node dist/build/build-knowledge.js`
const isDirectRun = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)
if (isDirectRun) {
  const packageRoot = path.resolve(fileURLToPath(import.meta.url), '../../..') // dist/build/x.js -> package root
  const repoRoot = path.resolve(packageRoot, '../..') // packages/sdui-mcp -> repo root
  const manifest = buildKnowledge({ repoRoot, outDir: path.join(packageRoot, 'knowledge') })
  console.error(
    `knowledge: ${manifest.files.length} files, ${manifest.skipped.length} skipped (${
      manifest.skipped.join(', ') || 'none'
    })`,
  )
}
