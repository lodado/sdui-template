import{j as e}from"./jsx-runtime-9B6oo110.js";import"./iframe-DWXfGETz.js";import"./preload-helper-ggYluGXI.js";const r={background:"#1e1e1e",color:"#d4d4d4",borderRadius:8,padding:"16px 20px",fontFamily:"ui-monospace, SFMono-Regular, Menlo, monospace",fontSize:13,lineHeight:1.6,overflowX:"auto",whiteSpace:"pre",margin:"0 0 16px"},a={maxWidth:820,margin:"0 auto"},o=({label:i,children:d})=>e.jsxs("figure",{style:{margin:"0 0 24px"},children:[i?e.jsx("figcaption",{style:{fontSize:12,fontWeight:600,color:"#6b7280",margin:"0 0 6px"},children:i}):null,e.jsx("pre",{style:r,children:e.jsx("code",{children:d})})]}),m={title:"Guides/SDUI MCP Server",parameters:{layout:"padded",docs:{description:{component:["# @lodado/sdui-mcp","","An MCP (Model Context Protocol) server that feeds **compressed SDUI authoring knowledge** to AI","coding assistants (Claude Code, Cursor, Claude Desktop). Instead of pasting the whole component","library into a prompt, the assistant pulls exactly the guide, types, or Storybook example it needs.","","## What it serves","","- **`syntax`** — document schema, hooks, authoring patterns (from the `sduiFormat` skill)","- **`architecture`** — compound-component architecture (`providerId`, references)","- **`types`** — the public TypeScript schema (`base.ts`, `document.ts`, `node.ts`)","- **per-component guides** — one entry per component in `@lodado/sdui-template-component` (Dialog, Dropdown, TextField, …)","- **Storybook examples** — the real `SduiLayoutDocument` JSON from these very stories","","Knowledge is generated at publish time from `.claude/skills/*` and `apps/docs/src/stories/*`, so the","package version *is* the knowledge version — no server to host.","","## Tools","","| Tool | Purpose |","| --- | --- |","| `sdui_list_components` | List components with one-line summaries |","| `sdui_get_guide` | Fetch a guide: `syntax`, `architecture`, `types`, `components-overview`, or a component name |","| `sdui_get_examples` | Real Storybook document JSON for a component |","| `sdui_get_snapshot` | Delta sync for a repo (`knownHashes` → only changed files) |","","Prompt: **`sdui-author-document`** guides the assistant through authoring a document.","Resource: **`sdui://knowledge/{path}`** exposes each knowledge file directly.","","See the stories in this page for install config and the two usage workflows."].join(`
`)}}},tags:["autodocs"]},s={name:"Install",render:()=>e.jsxs("div",{style:a,children:[e.jsx(o,{label:"Claude Code — one command",children:"claude mcp add sdui -- npx -y @lodado/sdui-mcp"}),e.jsx(o,{label:"Share with the team — .mcp.json in the repo root",children:JSON.stringify({mcpServers:{sdui:{command:"npx",args:["-y","@lodado/sdui-mcp"]}}},null,2)}),e.jsx(o,{label:"Cursor — .cursor/mcp.json (same shape). Claude Desktop — claude_desktop_config.json → mcpServers",children:JSON.stringify({mcpServers:{sdui:{command:"npx",args:["-y","@lodado/sdui-mcp"]}}},null,2)})]}),parameters:{docs:{description:{story:"`npx -y` always resolves the latest published version, so the served knowledge tracks the latest release automatically."}}}},t={name:"Workflow A — call tools directly",render:()=>e.jsxs("div",{style:a,children:[e.jsx(o,{label:"Ask the assistant (it calls the tools for you)",children:['"Build an SDUI document with a Dialog confirming account deletion."',"",'→ sdui_get_guide   { topic: "syntax" }','→ sdui_get_guide   { topic: "Dialog" }','→ sdui_get_examples{ component: "Dialog" }',"→ then writes the SduiLayoutDocument JSON following those patterns"].join(`
`)}),e.jsx(o,{label:"Or invoke the guided prompt",children:"/sdui-author-document component=Dialog"})]}),parameters:{docs:{description:{story:"Simplest path: let the assistant fetch `syntax` first, then the component guide + examples, then author. Good for one-off documents."}}}},n={name:"Workflow B — snapshot into your repo",render:()=>e.jsxs("div",{style:a,children:[e.jsx(o,{label:"1. Install the consumer skill (once)",children:["mkdir -p .claude/skills/sdui-sync","cp node_modules/@lodado/sdui-mcp/consumer/sdui-sync/SKILL.md \\","   .claude/skills/sdui-sync/SKILL.md"].join(`
`)}),e.jsx(o,{label:"2. Sync — writes .ai/sdui/ (re-syncs only changed files via sha1)",children:"/sdui-sync"}),e.jsx(o,{label:"Result layout",children:[".ai/sdui/","├── manifest.json      # generatedAt, gitCommit, per-file hash + lastModified","├── syntax.md","├── architecture.md","├── types.md","├── components/        # _overview.md + one guide per component","└── examples/          # real Storybook document JSON per component"].join(`
`)})]}),parameters:{docs:{description:{story:"For teams doing frequent SDUI work: snapshot the knowledge into `.ai/sdui/` so the assistant reads local files instead of calling MCP every task. `sdui_get_snapshot` sends only files whose hash changed; the skill re-syncs when the snapshot is older than 7 days."}}}};s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{originalSource:`{
  name: 'Install',
  render: () => <div style={shell}>
      <CodeBlock label="Claude Code — one command">claude mcp add sdui -- npx -y @lodado/sdui-mcp</CodeBlock>
      <CodeBlock label="Share with the team — .mcp.json in the repo root">
        {JSON.stringify({
        mcpServers: {
          sdui: {
            command: 'npx',
            args: ['-y', '@lodado/sdui-mcp']
          }
        }
      }, null, 2)}
      </CodeBlock>
      <CodeBlock label="Cursor — .cursor/mcp.json (same shape). Claude Desktop — claude_desktop_config.json → mcpServers">
        {JSON.stringify({
        mcpServers: {
          sdui: {
            command: 'npx',
            args: ['-y', '@lodado/sdui-mcp']
          }
        }
      }, null, 2)}
      </CodeBlock>
    </div>,
  parameters: {
    docs: {
      description: {
        story: '\`npx -y\` always resolves the latest published version, so the served knowledge tracks the latest release automatically.'
      }
    }
  }
}`,...s.parameters?.docs?.source}}};t.parameters={...t.parameters,docs:{...t.parameters?.docs,source:{originalSource:`{
  name: 'Workflow A — call tools directly',
  render: () => <div style={shell}>
      <CodeBlock label="Ask the assistant (it calls the tools for you)">
        {['"Build an SDUI document with a Dialog confirming account deletion."', '', '→ sdui_get_guide   { topic: "syntax" }', '→ sdui_get_guide   { topic: "Dialog" }', '→ sdui_get_examples{ component: "Dialog" }', '→ then writes the SduiLayoutDocument JSON following those patterns'].join('\\n')}
      </CodeBlock>
      <CodeBlock label="Or invoke the guided prompt">/sdui-author-document component=Dialog</CodeBlock>
    </div>,
  parameters: {
    docs: {
      description: {
        story: 'Simplest path: let the assistant fetch \`syntax\` first, then the component guide + examples, then author. ' + 'Good for one-off documents.'
      }
    }
  }
}`,...t.parameters?.docs?.source}}};n.parameters={...n.parameters,docs:{...n.parameters?.docs,source:{originalSource:`{
  name: 'Workflow B — snapshot into your repo',
  render: () => <div style={shell}>
      <CodeBlock label="1. Install the consumer skill (once)">
        {['mkdir -p .claude/skills/sdui-sync', 'cp node_modules/@lodado/sdui-mcp/consumer/sdui-sync/SKILL.md \\\\', '   .claude/skills/sdui-sync/SKILL.md'].join('\\n')}
      </CodeBlock>
      <CodeBlock label="2. Sync — writes .ai/sdui/ (re-syncs only changed files via sha1)">/sdui-sync</CodeBlock>
      <CodeBlock label="Result layout">
        {['.ai/sdui/', '├── manifest.json      # generatedAt, gitCommit, per-file hash + lastModified', '├── syntax.md', '├── architecture.md', '├── types.md', '├── components/        # _overview.md + one guide per component', '└── examples/          # real Storybook document JSON per component'].join('\\n')}
      </CodeBlock>
    </div>,
  parameters: {
    docs: {
      description: {
        story: 'For teams doing frequent SDUI work: snapshot the knowledge into \`.ai/sdui/\` so the assistant reads local ' + 'files instead of calling MCP every task. \`sdui_get_snapshot\` sends only files whose hash changed; the skill ' + 're-syncs when the snapshot is older than 7 days.'
      }
    }
  }
}`,...n.parameters?.docs?.source}}};const u=["Install","DirectToolUse","SnapshotWorkflow"];export{t as DirectToolUse,s as Install,n as SnapshotWorkflow,u as __namedExportsOrder,m as default};
