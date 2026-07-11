import { readdirSync } from 'node:fs'
import path from 'node:path'

import { McpServer, ResourceTemplate } from '@modelcontextprotocol/server'
import * as z from 'zod'

import { computeDelta, loadManifest, readKnowledgeFile } from './knowledge.js'

const FIXED_TOPICS: Record<string, string> = {
  syntax: 'syntax.md',
  architecture: 'architecture.md',
  types: 'types.md',
  'components-overview': 'components/_overview.md',
}

function componentNames(knowledgeDir: string): string[] {
  return readdirSync(path.join(knowledgeDir, 'components'))
    .filter((f) => f.endsWith('.md') && !f.startsWith('_'))
    .map((f) => f.replace(/\.md$/, ''))
}

function text(body: string, isError = false) {
  return { content: [{ type: 'text' as const, text: body }], ...(isError ? { isError: true } : {}) }
}

export function createServer(knowledgeDir: string): McpServer {
  const server = new McpServer({ name: 'sdui-knowledge', version: '0.0.1' })

  server.registerTool(
    'sdui_list_components',
    {
      description:
        'List SDUI components available in @lodado/sdui-template-component with a one-line summary each. Call sdui_get_guide with a component name for its full guide.',
      inputSchema: z.object({}),
    },
    async () => {
      const lines = componentNames(knowledgeDir).map((name) => {
        const body = readKnowledgeFile(knowledgeDir, `components/${name}.md`)
        const firstLine = body.split('\n').find((l) => l.trim() && !l.startsWith('#')) ?? ''
        return `${name} — ${firstLine.trim()}`
      })
      return text(lines.join('\n'))
    },
  )

  server.registerTool(
    'sdui_get_guide',
    {
      description:
        'Get a compressed SDUI authoring guide. Topics: "syntax" (document schema + hooks + patterns), "architecture" (compound components), "types" (public TS types), "components-overview" (import + key rules), or a component name (e.g. "Dialog").',
      inputSchema: z.object({
        topic: z.string().describe('syntax | architecture | types | components-overview | <ComponentName>'),
      }),
    },
    async ({ topic }) => {
      const fixed = FIXED_TOPICS[topic.toLowerCase()]
      if (fixed) return text(readKnowledgeFile(knowledgeDir, fixed))
      const match = componentNames(knowledgeDir).find((n) => n.toLowerCase() === topic.toLowerCase())
      if (match) return text(readKnowledgeFile(knowledgeDir, `components/${match}.md`))
      return text(
        `Unknown topic "${topic}". Valid: ${Object.keys(FIXED_TOPICS).join(', ')}, ${componentNames(knowledgeDir).join(
          ', ',
        )}`,
        true,
      )
    },
  )

  server.registerTool(
    'sdui_get_examples',
    {
      description: 'Get real Storybook usage examples (SDUI document JSON) for a component, e.g. "Dialog".',
      inputSchema: z.object({ component: z.string() }),
    },
    async ({ component }) => {
      const available = readdirSync(path.join(knowledgeDir, 'examples')).map((f) => f.replace(/\.md$/, ''))
      const match = available.find((n) => n.toLowerCase() === component.toLowerCase())
      if (!match) return text(`No examples for "${component}". Available: ${available.join(', ')}`, true)
      return text(readKnowledgeFile(knowledgeDir, `examples/${match}.md`))
    },
  )

  server.registerTool(
    'sdui_get_snapshot',
    {
      description:
        'Sync tool for consumer repos: returns the knowledge manifest plus contents of files whose hash differs from knownHashes (all files when knownHashes is omitted). "removed" lists paths the consumer should delete.',
      inputSchema: z.object({
        knownHashes: z
          .record(z.string(), z.string())
          .optional()
          .describe('map of local path -> sha1 from previously synced manifest'),
      }),
    },
    async ({ knownHashes }) => {
      const manifest = loadManifest(knowledgeDir)
      const delta = computeDelta(manifest, knownHashes ?? {})
      const files = delta.changed.map((p) => ({ path: p, content: readKnowledgeFile(knowledgeDir, p) }))
      return text(JSON.stringify({ manifest, removed: delta.removed, files }))
    },
  )

  server.registerPrompt(
    'sdui-author-document',
    {
      description: 'Author an SDUI JSON document using the compressed knowledge base',
      argsSchema: z.object({ component: z.string().optional().describe('primary component to use') }),
    },
    ({ component }) => ({
      messages: [
        {
          role: 'user' as const,
          content: {
            type: 'text' as const,
            text: [
              'You are authoring a Server-Driven UI document for @lodado/sdui-template.',
              'Before writing any JSON: call sdui_get_guide with topic "syntax", then topic "components-overview".',
              component
                ? `Then call sdui_get_guide and sdui_get_examples for "${component}" and follow those patterns exactly.`
                : 'Then call sdui_list_components, pick the components you need, and fetch their guides and examples.',
              'Rules: every node needs a unique id and a type; follow the attributes-vs-state placement rules from the syntax guide; compound components need providerId per the architecture guide.',
            ].join('\n'),
          },
        },
      ],
    }),
  )

  server.registerResource(
    'sdui-knowledge',
    new ResourceTemplate('sdui://knowledge/{+path}', {
      list: async () => ({
        resources: loadManifest(knowledgeDir).files.map((f) => ({
          uri: `sdui://knowledge/${f.path}`,
          name: f.path,
        })),
      }),
    }),
    { description: 'Compressed SDUI authoring knowledge files', mimeType: 'text/markdown' },
    async (uri, { path: relPath }) => ({
      contents: [{ uri: uri.href, text: readKnowledgeFile(knowledgeDir, String(relPath)) }],
    }),
  )

  return server
}
