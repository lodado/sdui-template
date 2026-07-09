import { createDocumentBlock, type SduiDocumentContent } from '@lodado/sdui-document'

/**
 * Complex nested fixture — same tree as
 * packages/sdui-document/src/__tests__/nestedDragScenario.test.ts and
 * packages/sdui-document-react/src/__tests__/NestedDocumentEditor.test.tsx.
 * Keep all three in sync.
 *
 * root
 * ├── section-a  heading            depth 1
 * │   ├── a-1    paragraph          depth 2
 * │   │   ├── a-1-1   paragraph     depth 3
 * │   │   │   └── a-1-1-1 checklist depth 4
 * │   │   └── a-1-2   paragraph     depth 3
 * │   └── a-2    callout            depth 2
 * ├── section-b  heading            depth 1
 * │   └── b-1    paragraph          depth 2
 * └── tail       paragraph          depth 1
 */
export const nestedDragContent: SduiDocumentContent = {
  schemaVersion: '1.0',
  root: createDocumentBlock({
    id: 'root',
    type: 'document.root',
    children: [
      createDocumentBlock({
        id: 'section-a',
        type: 'document.heading',
        state: { text: 'Section A' },
        attributes: { level: 2 },
        children: [
          createDocumentBlock({
            id: 'a-1',
            type: 'document.paragraph',
            state: { text: 'A-1 — drag me onto B-1: my whole subtree travels along' },
            children: [
              createDocumentBlock({
                id: 'a-1-1',
                type: 'document.paragraph',
                state: { text: 'A-1-1 (depth 3)' },
                children: [
                  createDocumentBlock({
                    id: 'a-1-1-1',
                    type: 'document.checklist',
                    state: { text: 'A-1-1-1 (depth 4) — drag me left to outdent two levels at once' },
                    attributes: { checked: false },
                  }),
                ],
              }),
              createDocumentBlock({ id: 'a-1-2', type: 'document.paragraph', state: { text: 'A-1-2 (depth 3)' } }),
            ],
          }),
          createDocumentBlock({ id: 'a-2', type: 'document.callout', state: { text: 'A-2 (callout, depth 2)' } }),
        ],
      }),
      createDocumentBlock({
        id: 'section-b',
        type: 'document.heading',
        state: { text: 'Section B' },
        attributes: { level: 2 },
        children: [createDocumentBlock({ id: 'b-1', type: 'document.paragraph', state: { text: 'B-1 (depth 2)' } })],
      }),
      createDocumentBlock({
        id: 'tail',
        type: 'document.paragraph',
        state: { text: 'Tail — drop me onto A-1-1-1 and slide right to nest 4 levels deep' },
      }),
    ],
  }),
}
