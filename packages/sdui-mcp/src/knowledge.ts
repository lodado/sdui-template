import { createHash } from 'node:crypto'
import { readFileSync } from 'node:fs'
import path from 'node:path'

export interface KnowledgeFile {
  path: string
  hash: string
  lastModified: string
}

export interface KnowledgeManifest {
  generatedAt: string
  gitCommit: string
  files: KnowledgeFile[]
  skipped: string[]
}

export interface SnapshotDelta {
  changed: string[]
  removed: string[]
}

export function sha1(content: string): string {
  return createHash('sha1').update(content, 'utf8').digest('hex')
}

export function loadManifest(knowledgeDir: string): KnowledgeManifest {
  const raw = readFileSync(path.join(knowledgeDir, 'manifest.json'), 'utf8')
  return JSON.parse(raw) as KnowledgeManifest
}

export function readKnowledgeFile(knowledgeDir: string, relativePath: string): string {
  const base = path.resolve(knowledgeDir)
  const resolved = path.resolve(base, relativePath)
  if (resolved !== base && !resolved.startsWith(base + path.sep)) {
    throw new Error(`Path "${relativePath}" resolves outside knowledge directory`)
  }
  return readFileSync(resolved, 'utf8')
}

export function computeDelta(manifest: KnowledgeManifest, knownHashes: Record<string, string>): SnapshotDelta {
  const manifestPaths = new Set(manifest.files.map((f) => f.path))
  const changed = manifest.files.filter((f) => knownHashes[f.path] !== f.hash).map((f) => f.path)
  const removed = Object.keys(knownHashes).filter((p) => !manifestPaths.has(p))
  return { changed, removed }
}
