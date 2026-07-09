import type { SduiDocumentBlock, SduiDocumentContent } from '@lodado/sdui-document'
import { createDocumentBlock } from '@lodado/sdui-document'

function block(
  id: string,
  type: string,
  options?: { state?: Record<string, unknown>; attributes?: Record<string, unknown>; children?: SduiDocumentBlock[] },
): SduiDocumentBlock {
  return createDocumentBlock({
    id,
    type: type as SduiDocumentBlock['type'],
    state: options?.state,
    attributes: options?.attributes,
    children: options?.children,
  })
}

/**
 * Rich fixture exercising every block type and every mark — shared by the
 * import-graph, parity, and behavior suites.
 */
export function createViewerFixture(): SduiDocumentContent {
  return {
    schemaVersion: '1.0',
    root: block('root', 'document.root', {
      children: [
        block('h1', 'document.heading', {
          state: { content: [{ type: 'text', text: 'Title' }], level: 1 },
          attributes: { level: 1 },
        }),
        block('p-marks', 'document.paragraph', {
          state: {
            content: [
              { type: 'text', text: 'bold', marks: [{ type: 'bold' }] },
              { type: 'text', text: 'italic', marks: [{ type: 'italic' }] },
              { type: 'text', text: 'strike', marks: [{ type: 'strikethrough' }] },
              { type: 'text', text: 'under', marks: [{ type: 'underline' }] },
              { type: 'text', text: 'code', marks: [{ type: 'code' }] },
              { type: 'text', text: 'hi', marks: [{ type: 'highlight', attrs: { color: 'yellow' } }] },
              { type: 'text', text: 'color', marks: [{ type: 'color', attrs: { color: '#ff0000' } }] },
              { type: 'text', text: 'link', marks: [{ type: 'link', attrs: { href: 'https://example.com' } }] },
              { type: 'hard_break' },
              { type: 'date', iso: '2026-07-09', display: 'Jul 9' },
            ],
          },
        }),
        block('bl1', 'document.bulleted-list', { state: { text: 'bullet' } }),
        block('n1', 'document.numbered-list', { state: { text: 'one' } }),
        block('n2', 'document.numbered-list', { state: { text: 'two' } }),
        block('break', 'document.paragraph', { state: { text: 'break' } }),
        block('n3', 'document.numbered-list', { state: { text: 'restarts' } }),
        block('chk', 'document.checklist', { state: { text: 'todo' }, attributes: { checked: true } }),
        block('tgl-open', 'document.toggle', {
          state: { text: 'open toggle' },
          attributes: { collapsed: false },
          children: [block('tgl-child', 'document.paragraph', { state: { text: 'inside toggle' } })],
        }),
        block('tgl-closed', 'document.toggle', {
          state: { text: 'closed toggle' },
          attributes: { collapsed: true },
          children: [block('tgl-hidden', 'document.paragraph', { state: { text: 'hidden' } })],
        }),
        block('tgl-empty', 'document.toggle', { state: { text: 'empty toggle' }, attributes: { collapsed: false } }),
        block('cols', 'document.column-list', {
          children: [
            block('col-a', 'document.column', {
              attributes: { ratio: 2 },
              children: [block('col-a-p', 'document.paragraph', { state: { text: 'left' } })],
            }),
            block('col-b', 'document.column', {
              attributes: { ratio: 1 },
              children: [block('col-b-p', 'document.paragraph', { state: { text: 'right' } })],
            }),
          ],
        }),
        block('code', 'document.code', { state: { text: 'const x = 1' }, attributes: { language: 'typescript' } }),
        block('quote', 'document.quote', { state: { text: 'quoted' } }),
        block('callout', 'document.callout', { state: { text: 'note' }, attributes: { style: 'info' } }),
        block('divider', 'document.divider'),
        block('img', 'document.image', { attributes: { src: 'https://example.com/a.png', alt: 'pic' } }),
        block('file', 'document.file', { attributes: { name: 'doc.pdf', url: 'https://example.com/doc.pdf' } }),
        block('link', 'document.link', { attributes: { href: 'https://example.com', title: 'Example' } }),
        block('toc', 'document.toc'),
        block('page', 'document.page', { attributes: { pageId: 'other-doc', title: 'Sub page' } }),
        block('collection', 'document.collection', { attributes: { title: 'Items', layout: 'gallery' } }),
        block('bookmark', 'document.bookmark', { attributes: { url: 'https://example.com' } }),
        block('video', 'document.video', { attributes: { url: 'https://www.youtube.com/watch?v=x' } }),
        block('embed', 'document.embed', { attributes: { url: 'https://example.com/embed' } }),
        block('tags', 'document.tags', { attributes: { items: [{ id: 't1', label: 'tag-one', color: 'blue' }] } }),
        block('button', 'document.button', {
          state: { text: 'Click me' },
          attributes: { href: 'https://example.com' },
        }),
      ],
    }),
  }
}
