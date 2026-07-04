---
'@lodado/sdui-document': minor
'@lodado/sdui-document-react': minor
---

feat: block menu — slash command (`/`) and `+` gutter button for inserting all block types

- `createDefaultBlock(type, id, attributes?)` factory in the core package
- Slash detection PM plugin with `FocusedBlockCallbacks` delegation (open/query/close/key routing)
- Radix Popover `BlockMenu` with ko/en keyword filtering, keyboard navigation, and a link URL entry view
- Notion insert semantics: empty block converts in place (`block.setType`), non-empty inserts a sibling below (`block.insert`); single-step undo
- `+` gutter button inserts an empty paragraph below and opens the menu on it
- Image/file picking with a new `onUploadFile` editor prop (object-URL fallback), upload placeholder/error rendering on Image/File blocks
