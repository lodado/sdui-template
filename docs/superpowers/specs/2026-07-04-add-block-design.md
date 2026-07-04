# Add Block (Slash Menu + '+' Gutter Button) — Design

Date: 2026-07-04
Packages: `@lodado/sdui-document` (core helpers), `@lodado/sdui-document-react` (UI), `ssr-testing` (E2E)
Reference: Outline editor (`SuggestionsMenuPlugin`, `BlockMenu` extension, `menus/block.tsx`, `SuggestionsMenu.tsx`)

## Goal

Users can insert new blocks via two entry points:

1. **Slash menu** — typing `/` in the focused block opens a filterable block-type menu.
2. **'+' gutter button** — hovering a block reveals a `+` button next to the drag handle; clicking it inserts an empty paragraph below and opens the same menu targeting it.

All block types are offered: paragraph, heading 1–3, checklist, divider, callout, image, file, link.

## Architecture

No new patch types. Existing `block.insert`, `block.setType`, `block.update` (with inverse patches) cover everything, so undo/redo works without new history code.

```
focused-block PM plugin (slashMenuPlugin)      ← detects '/', tracks query
        ↓ keymapDelegation extension (onSlashMenu*)
SduiDocumentEditor handler (insertBlockFromMenu) ← Notion semantics
        ↓ applyPatches (existing useDocumentPatches)
core: createDefaultBlock(type, attrs)            ← per-type initial state
```

Menu UI: Radix Popover following the existing `SelectionToolbar.tsx` pattern — fixed zero-size virtual anchor moved to `view.coordsAtPos(...)`, `onOpenAutoFocus` prevented so the editor keeps focus; keyboard events reach the menu via PM delegation.

## Components

| New                               | Location                                     | Responsibility                                                                                                                                                                                 |
| --------------------------------- | -------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `slashMenuPlugin.ts`              | `sdui-document-react/src/focused-block/pm/`  | Port of Outline's SuggestionsMenuPlugin. Opens on `/` at block start or after whitespace; updates query on typing; closes when the `/` is deleted or focus moves; safe during IME composition. |
| `FocusedBlockCallbacks` extension | `focused-block/pm/keymapDelegation.ts`       | `onSlashMenuOpen(rect)`, `onSlashMenuQueryChange(query)`, `onSlashMenuClose()`. While menu open, ArrowUp/Down/Enter/Escape route to the menu (take precedence over split/navigate).            |
| `blockMenuItems.tsx`              | `sdui-document-react/src/editor/block-menu/` | Item registry, analog of Outline `menus/block.tsx`: `{ type, title, keywords (en+ko), icon, attrs, action }` for all supported block types.                                                    |
| `BlockMenu.tsx`                   | `editor/block-menu/`                         | Radix Popover menu. Substring filter over title+keywords, keyboard highlight, click/Enter select, listbox ARIA.                                                                                |
| `insertBlockFromMenu` handler     | `editor/SduiDocumentEditor.tsx`              | Implements insert semantics below.                                                                                                                                                             |
| '+' button                        | BlockNode (next to drag handle)              | Visible on hover. Click → insert empty paragraph below → focus → open menu with empty query.                                                                                                   |
| `createDefaultBlock(type, attrs)` | `sdui-document/src/block-types/`             | Per-type default state (checklist `checked: false`, image `{ status: 'empty' }`, …).                                                                                                           |

## Insert semantics (Notion style)

**Slash select:**

1. Delete the `/query` text in PM, commit.
2. Block now empty → `block.setType` (convert in place).
3. Block has other content → `block.insert` new default block below, focus it.
4. Patches batched into one history entry (existing `applyPatches` batching) — single undo restores.

**'+' button:** `block.insert` empty paragraph below target → focus → open menu (empty query). Selecting converts via setType path.

**image/file:** menu select → hidden `<input type="file">` → on pick, insert placeholder block (`state: { status: 'uploading', name }`) → call new editor prop `onUploadFile?: (file: File) => Promise<{ url: string }>` → on success `block.update` with url/`status: 'done'`. No callback → `URL.createObjectURL` fallback.

**link:** insert empty link block → in-block URL input UI (placeholder state), reusing `safeHref` scheme validation.

## Error handling

- Upload failure → `block.update { status: 'error' }`; block shows error + retry/delete.
- File picker cancelled → no patches at all (placeholder inserted only after a file is chosen).
- Upload resolves after block deleted (undo etc.) → skip update patch (existence check).
- URL validation via `safeHref` whitelist (http/https/mailto/tel).

## Testing

- **Unit (core):** `createDefaultBlock` per-type defaults.
- **Unit (react):** slash plugin query tracking (open/update/backspace-close); menu filtering (ko/en keywords); insert semantics (empty → setType, non-empty → insert); upload success/failure/deleted-block race; single-undo restore.
- **E2E (ssr-testing):** `/` → menu → filter "head" → Enter → heading created; '+' hover/click → paragraph + menu; Escape closes; image upload placeholder → done.
