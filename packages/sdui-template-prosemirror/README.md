# @lodado/sdui-template-prosemirror

ProseMirror renderer package for the SDUI template ecosystem.

## Installation

```bash
pnpm add @lodado/sdui-template-prosemirror
```

## Usage

```tsx
import { SduiLayoutRenderer } from '@lodado/sdui-template'
import { ProseMirrorRenderer } from '@lodado/sdui-template-prosemirror'

const document = {
  version: '1.0.0',
  root: {
    id: 'root',
    type: 'Div',
    children: [
      {
        id: 'editor-1',
        type: 'ProseMirrorRenderer',
        state: {
          doc: {
            type: 'doc',
            content: [{ type: 'paragraph', content: [{ type: 'text', text: 'Hello ProseMirror' }] }],
          },
          editable: true,
        },
      },
    ],
  },
}

const components = {
  ProseMirrorRenderer: (id: string) => <ProseMirrorRenderer id={id} />,
}

export default function Page() {
  return <SduiLayoutRenderer document={document} components={components} />
}
```
