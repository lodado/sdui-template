---
name: sdui-sync
description: Sync compressed SDUI authoring knowledge from the sdui MCP server into .ai/sdui/. Use before SDUI work when the local snapshot is missing or older than 7 days, or when the user asks to refresh SDUI docs.
---

# sdui-sync

Sync the `@lodado/sdui-mcp` knowledge base into this repo at `.ai/sdui/` so day-to-day SDUI work reads local files instead of calling MCP tools.

## Prerequisite

The `sdui` MCP server must be configured (see the @lodado/sdui-mcp README). If the `sdui_get_snapshot` tool is unavailable, stop and tell the user to run:

```bash
claude mcp add sdui -- npx -y @lodado/sdui-mcp
```

## Steps

1. Read `.ai/sdui/manifest.json` if it exists. Build `knownHashes` as `{ [file.path]: file.hash }` from its `files` array. If the file does not exist, use `{}`.
2. Call the `sdui_get_snapshot` tool with `{ knownHashes }`.
3. Parse the JSON result:
   - Write each entry of `files` to `.ai/sdui/<path>` (create directories as needed).
   - Delete each `.ai/sdui/<path>` listed in `removed`.
   - Write `manifest` to `.ai/sdui/manifest.json`.
4. If the repo's CLAUDE.md does not mention `.ai/sdui/`, append this line (once, verbatim):

   `- SDUI work: read the snapshot in .ai/sdui/ first (syntax.md, components/, examples/). If manifest.json generatedAt is older than 7 days, run /sdui-sync.`

5. Report: number of files written, removed, and the new `generatedAt`.

## Staleness rule (for other sessions reading this)

Before SDUI work: if `.ai/sdui/manifest.json` is missing or `generatedAt` is older than 7 days, run this skill first. Otherwise do NOT call MCP tools — the local snapshot is authoritative.

## Layout after sync

```text
.ai/sdui/
├── manifest.json          # generatedAt, gitCommit, per-file hash + lastModified
├── syntax.md              # document schema, hooks, authoring patterns
├── architecture.md        # compound component architecture
├── types.md               # public TS types
├── components/            # _overview.md + one guide per component
└── examples/              # real Storybook document JSON per component
```
