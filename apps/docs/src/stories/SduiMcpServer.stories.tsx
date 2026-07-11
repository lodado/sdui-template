import type { Meta, StoryObj } from '@storybook/react-vite'
import React from 'react'

/**
 * Docs-only story page for the `@lodado/sdui-mcp` MCP server.
 *
 * No runtime component — the MCP server is a CLI process, not React. These
 * stories render copy-paste config panels so SDUI authors can wire the server
 * into their AI tooling and see what each tool returns.
 */

const panel: React.CSSProperties = {
  background: '#1e1e1e',
  color: '#d4d4d4',
  borderRadius: 8,
  padding: '16px 20px',
  fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace',
  fontSize: 13,
  lineHeight: 1.6,
  overflowX: 'auto',
  whiteSpace: 'pre',
  margin: '0 0 16px',
}

const shell: React.CSSProperties = { maxWidth: 820, margin: '0 auto' }

const CodeBlock = ({ label, children }: { label?: string; children: React.ReactNode }) => (
  <figure style={{ margin: '0 0 24px' }}>
    {label ? (
      <figcaption style={{ fontSize: 12, fontWeight: 600, color: '#6b7280', margin: '0 0 6px' }}>{label}</figcaption>
    ) : null}
    <pre style={panel}>
      <code>{children}</code>
    </pre>
  </figure>
)

const meta: Meta = {
  title: 'Guides/SDUI MCP Server',
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: [
          '# @lodado/sdui-mcp',
          '',
          'An MCP (Model Context Protocol) server that feeds **compressed SDUI authoring knowledge** to AI',
          'coding assistants (Claude Code, Cursor, Claude Desktop). Instead of pasting the whole component',
          'library into a prompt, the assistant pulls exactly the guide, types, or Storybook example it needs.',
          '',
          '## What it serves',
          '',
          '- **`syntax`** — document schema, hooks, authoring patterns (from the `sduiFormat` skill)',
          '- **`architecture`** — compound-component architecture (`providerId`, references)',
          '- **`types`** — the public TypeScript schema (`base.ts`, `document.ts`, `node.ts`)',
          '- **per-component guides** — one entry per component in `@lodado/sdui-template-component` (Dialog, Dropdown, TextField, …)',
          '- **Storybook examples** — the real `SduiLayoutDocument` JSON from these very stories',
          '',
          'Knowledge is generated at publish time from `.claude/skills/*` and `apps/docs/src/stories/*`, so the',
          'package version *is* the knowledge version — no server to host.',
          '',
          '## Tools',
          '',
          '| Tool | Purpose |',
          '| --- | --- |',
          '| `sdui_list_components` | List components with one-line summaries |',
          '| `sdui_get_guide` | Fetch a guide: `syntax`, `architecture`, `types`, `components-overview`, or a component name |',
          '| `sdui_get_examples` | Real Storybook document JSON for a component |',
          '| `sdui_get_snapshot` | Delta sync for a repo (`knownHashes` → only changed files) |',
          '',
          'Prompt: **`sdui-author-document`** guides the assistant through authoring a document.',
          'Resource: **`sdui://knowledge/{path}`** exposes each knowledge file directly.',
          '',
          'See the stories in this page for install config and the two usage workflows.',
        ].join('\n'),
      },
    },
  },
  tags: ['autodocs'],
}

export default meta

type Story = StoryObj

export const Install: Story = {
  name: 'Install',
  render: () => (
    <div style={shell}>
      <CodeBlock label="Claude Code — one command">claude mcp add sdui -- npx -y @lodado/sdui-mcp</CodeBlock>
      <CodeBlock label="Share with the team — .mcp.json in the repo root">
        {JSON.stringify({ mcpServers: { sdui: { command: 'npx', args: ['-y', '@lodado/sdui-mcp'] } } }, null, 2)}
      </CodeBlock>
      <CodeBlock label="Cursor — .cursor/mcp.json (same shape). Claude Desktop — claude_desktop_config.json → mcpServers">
        {JSON.stringify({ mcpServers: { sdui: { command: 'npx', args: ['-y', '@lodado/sdui-mcp'] } } }, null, 2)}
      </CodeBlock>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          '`npx -y` always resolves the latest published version, so the served knowledge tracks the latest release automatically.',
      },
    },
  },
}

export const DirectToolUse: Story = {
  name: 'Workflow A — call tools directly',
  render: () => (
    <div style={shell}>
      <CodeBlock label="Ask the assistant (it calls the tools for you)">
        {[
          '"Build an SDUI document with a Dialog confirming account deletion."',
          '',
          '→ sdui_get_guide   { topic: "syntax" }',
          '→ sdui_get_guide   { topic: "Dialog" }',
          '→ sdui_get_examples{ component: "Dialog" }',
          '→ then writes the SduiLayoutDocument JSON following those patterns',
        ].join('\n')}
      </CodeBlock>
      <CodeBlock label="Or invoke the guided prompt">/sdui-author-document component=Dialog</CodeBlock>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'Simplest path: let the assistant fetch `syntax` first, then the component guide + examples, then author. ' +
          'Good for one-off documents.',
      },
    },
  },
}

export const SnapshotWorkflow: Story = {
  name: 'Workflow B — snapshot into your repo',
  render: () => (
    <div style={shell}>
      <CodeBlock label="1. Install the consumer skill (once)">
        {[
          'mkdir -p .claude/skills/sdui-sync',
          'cp node_modules/@lodado/sdui-mcp/consumer/sdui-sync/SKILL.md \\',
          '   .claude/skills/sdui-sync/SKILL.md',
        ].join('\n')}
      </CodeBlock>
      <CodeBlock label="2. Sync — writes .ai/sdui/ (re-syncs only changed files via sha1)">/sdui-sync</CodeBlock>
      <CodeBlock label="Result layout">
        {[
          '.ai/sdui/',
          '├── manifest.json      # generatedAt, gitCommit, per-file hash + lastModified',
          '├── syntax.md',
          '├── architecture.md',
          '├── types.md',
          '├── components/        # _overview.md + one guide per component',
          '└── examples/          # real Storybook document JSON per component',
        ].join('\n')}
      </CodeBlock>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'For teams doing frequent SDUI work: snapshot the knowledge into `.ai/sdui/` so the assistant reads local ' +
          'files instead of calling MCP every task. `sdui_get_snapshot` sends only files whose hash changed; the skill ' +
          're-syncs when the snapshot is older than 7 days.',
      },
    },
  },
}
