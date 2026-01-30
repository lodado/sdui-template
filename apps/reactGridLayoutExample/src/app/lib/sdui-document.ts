import type { SduiLayoutDocument } from '@lodado/sdui-template'

export const gridLayoutDocument: SduiLayoutDocument = {
  version: '1.0.0',
  metadata: {
    id: 'react-grid-layout-example',
    name: 'React Grid Layout Example',
  },
  root: {
    id: 'root',
    type: 'Div',
    attributes: {
      className: 'w-full flex flex-col items-center gap-6',
      as: 'section',
    },
    children: [
      {
        id: 'header-card',
        type: 'Card',
        attributes: {
          className: 'w-full max-w-5xl border border-white/10 bg-white/[0.04] p-6',
        },
        children: [
          {
            id: 'header-title',
            type: 'Text',
            state: {
              text: 'React Grid Layout + SDUI',
            },
            attributes: {
              as: 'h1',
              className: 'text-2xl font-semibold text-white',
            },
          },
          {
            id: 'header-desc',
            type: 'Text',
            state: {
              text: 'Drag or resize tiles to update grid state. Click a tile to toggle between square, triangle, and circle.',
            },
            attributes: {
              className: 'mt-2 text-sm text-white/70',
            },
          },
        ],
      },
      {
        id: 'grid-layout',
        type: 'GridLayout',
        reference: ['shape-1', 'shape-2', 'shape-3', 'shape-4', 'shape-5'],
        state: {
          cols: 12,
          rowHeight: 80,
          margin: [16, 16],
        },
        children: [
          {
            id: 'shape-1',
            type: 'ShapeTile',
            state: {
              shape: 'square',
              label: 'Tile 1',
              layout: { x: 0, y: 0, w: 4, h: 4 },
            },
          },
          {
            id: 'shape-2',
            type: 'ShapeTile',
            state: {
              shape: 'triangle',
              label: 'Tile 2',
              layout: { x: 4, y: 0, w: 4, h: 4 },
            },
          },
          {
            id: 'shape-3',
            type: 'ShapeTile',
            state: {
              shape: 'circle',
              label: 'Tile 3',
              layout: { x: 8, y: 0, w: 4, h: 4 },
            },
          },
          {
            id: 'shape-4',
            type: 'ShapeTile',
            state: {
              shape: 'square',
              label: 'Tile 4',
              layout: { x: 0, y: 4, w: 6, h: 4 },
            },
          },
          {
            id: 'shape-5',
            type: 'ShapeTile',
            state: {
              shape: 'triangle',
              label: 'Tile 5',
              layout: { x: 6, y: 4, w: 6, h: 4 },
            },
          },
        ],
      },
    ],
  },
}
