# @lodado/sdui-mcp

MCP server that serves compressed authoring knowledge for [@lodado/sdui-template](https://www.npmjs.com/package/@lodado/sdui-template) and [@lodado/sdui-template-component](https://www.npmjs.com/package/@lodado/sdui-template-component): document syntax, public types, per-component guides, and real Storybook usage examples. Knowledge is generated from this monorepo at publish time — the package version is the knowledge version.

## Install

### Claude Code

```bash
claude mcp add sdui -- npx -y @lodado/sdui-mcp
```

Or share it with your team via `.mcp.json` in the repo root:

```json
{
  "mcpServers": {
    "sdui": {
      "command": "npx",
      "args": ["-y", "@lodado/sdui-mcp"]
    }
  }
}
```

### Cursor

`.cursor/mcp.json`:

```json
{
  "mcpServers": {
    "sdui": {
      "command": "npx",
      "args": ["-y", "@lodado/sdui-mcp"]
    }
  }
}
```

### Claude Desktop

`claude_desktop_config.json` → `mcpServers`, same `command`/`args` as above.

## Tools

| Tool                   | Purpose                                                                                      |
| ---------------------- | -------------------------------------------------------------------------------------------- |
| `sdui_list_components` | List available components with one-line summaries                                            |
| `sdui_get_guide`       | Fetch a guide: `syntax`, `architecture`, `types`, `components-overview`, or a component name |
| `sdui_get_examples`    | Real Storybook document JSON for a component                                                 |
| `sdui_get_snapshot`    | Delta sync for consumer repos (`knownHashes` → changed files + removals)                     |

Prompt: `sdui-author-document` — guided SDUI document authoring.
Resources: `sdui://knowledge/{path}`.

## Recommended: snapshot workflow for consumer repos (Claude Code)

Instead of calling MCP tools on every task, snapshot the knowledge into your repo once and refresh weekly:

```bash
mkdir -p .claude/skills/sdui-sync
cp node_modules/@lodado/sdui-mcp/consumer/sdui-sync/SKILL.md .claude/skills/sdui-sync/SKILL.md
# or without installing: copy the file from the package tarball / repo
```

Then run `/sdui-sync` in Claude Code. It writes `.ai/sdui/` (syntax, components, examples + manifest) and re-syncs only changed files (sha1 delta) when the snapshot is older than 7 days.

## Versioning & freshness

- `manifest.json` carries `generatedAt`, source `gitCommit`, and per-file `hash` + `lastModified` (last git commit touching the source).
- `npx -y` always resolves the latest published version, so a re-sync after a new release picks up new knowledge automatically.
