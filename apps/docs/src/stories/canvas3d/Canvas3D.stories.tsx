import { type SduiLayoutDocument, SduiLayoutRenderer, useSduiLayoutAction } from '@lodado/sdui-template'
import { Canvas3DContainer, sduiComponents } from '@lodado/sdui-template-component'
import type { Meta, StoryObj } from '@storybook/react-vite'
import type { ReactNode } from 'react'
import { useEffect, useRef, useState } from 'react'

import { createChartDataToPixel, storybookCanvas3DRenderStrategy } from './canvas3d-renderers'

/** Component map: Canvas3D gets renderStrategy injected from Storybook (cube + hexagon). */
const canvas3DComponents = {
  ...sduiComponents,
  Canvas3D: (id: string, parentPath?: string[]) => (
    <Canvas3DContainer id={id} parentPath={parentPath ?? []} renderStrategy={storybookCanvas3DRenderStrategy} />
  ),
}

const meta: Meta<typeof SduiLayoutRenderer> = {
  title: 'Shared/UI/Canvas3D',
  component: SduiLayoutRenderer,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `
## Overview

**Canvas3D** draws 3D wireframe shapes (cube, hexagon, etc.) on a 2D HTML canvas. The scene is driven by your SDUI document: you define **collections** and **items** in the tree; the canvas reads that data every frame and does not subscribe to individual nodes. A **render strategy** (injected from outside) maps item \`type\` (e.g. \`'cube'\`) to a draw function, so you can add custom shapes without changing the core.

**Key idea:** We live in 3D, but the screen is 2D. So we need a consistent way to turn 3D positions into 2D pixel coordinates and to decide which object is in front. The sections below explain that pipeline and the math in a beginner-friendly way.

---

## Rendering Pipeline (High Level)

Each frame, the following happens in order:

\`\`\`
  ┌─────────────────────────────────────────────────────────────────────────┐
  │  requestAnimationFrame loop (every ~16ms)                               │
  └─────────────────────────────────────────────────────────────────────────┘
                                      │
                                      ▼
  ┌─────────────────────────────────────────────────────────────────────────┐
  │  1. Get "what to draw"                                                   │
  │     getCollections() → reads SDUI store, builds Collection[] from       │
  │     Canvas3D's child nodes (Canvas3DCollection → Canvas3DItem)           │
  └─────────────────────────────────────────────────────────────────────────┘
                                      │
                                      ▼
  ┌─────────────────────────────────────────────────────────────────────────┐
  │  2. Clear canvas, then for each collection:                              │
  │     - Sort 3D items by depth (z) so far objects are drawn first          │
  │     - For each item: look up strategy[item.type] and call it              │
  │       with (ctx, viewport, item, kind, dt)                                │
  └─────────────────────────────────────────────────────────────────────────┘
                                      │
                                      ▼
  ┌─────────────────────────────────────────────────────────────────────────┐
  │  3. Each ItemRenderer:                                                    │
  │     - Builds a "world matrix" from item position/rotation/scale           │
  │     - Transforms shape vertices (e.g. cube corners) to world space         │
  │     - Projects 3D points to 2D (orthographic + view tilt)                │
  │     - Draws lines on ctx between projected points                         │
  └─────────────────────────────────────────────────────────────────────────┘
\`\`\`

No React state or SDUI subscription is used for the scene data; the loop always reads the latest from the store via the getter.

---

## SDUI Document Structure

The document tree under **Canvas3D** describes what appears on the canvas.

\`\`\`
  Canvas3D (id, state: width, height, scale, …)
    │
    ├── Canvas3DCollection (state.kind: '3d' | '2d')
    │     │
    │     ├── Canvas3DItem (state: type, position, info)
    │     ├── Canvas3DItem (state: type, position, info)
    │     └── …
    │
    └── Canvas3DCollection (state.kind: '3d')
          ├── Canvas3DItem …
          └── …
\`\`\`

| Node | Role |
|------|------|
| **Canvas3D** | Root. Optional \`state\`: \`width\`, \`height\`, \`scale\`, \`className\`. |
| **Canvas3DCollection** | Group of items. \`state.kind\`: \`'3d'\` (depth-sorted) or \`'2d'\`. |
| **Canvas3DItem** | One shape. \`state.type\` (e.g. \`'cube'\`, \`'hexagon'\`), \`position\` \`{ x, y, z }\`, \`info\` (scale, rotation, stroke/color). |

To **animate** (e.g. rotate): update the item's state with \`updateNodeState(itemNodeId, { info: { ...info, rotation: { x, y, z } } })\`. The next frame will read the new value and redraw.

---

## From 3D to 2D: Why Orthographic? What Is "View Rotation"?

### The problem

We have 3D coordinates (e.g. a corner of a cube). The screen has only 2D pixels. We need a **projection** that maps 3D to 2D in a consistent way.

### Two common projections

| Projection | Idea | Use case |
|-----------|------|----------|
| **Perspective** | Far things look smaller (like a photo). | Realistic games, CAD. |
| **Orthographic** | No shrinking with distance: 1 unit in the world = fixed pixels. | Diagrams, technical views, this component. |

Canvas3D uses **orthographic** so that moving an object in depth doesn’t change its on-screen size—only its position and draw order.

### Why "view rotation"?

If we map world X and Y directly, we’re looking straight down the **Z axis**. A cube centered at the origin would look like a single square (only the front face). To see **three faces** (top, front, side), we first **tilt** the scene: we rotate the world around X and Y by small angles (viewRotationX, viewRotationY). That “view rotation” gives us a view space; we then project the tilted X and Y to the screen and use the tilted depth only for depth ordering (who is in front).

---

## Coordinate Systems and the Full Path of a Point

A single vertex (e.g. one corner of a cube) goes through four stages:

- **Local**: Vertices are defined in the shape’s own space (e.g. cube corners in model units).
- **World**: A world matrix moves the shape to the scene (position, rotation, scale).
- **View**: View rotation turns the whole scene so we see multiple faces.
- **Screen**: View X and Y map to pixels with a fixed scale; view depth is only used for draw order.

---

## The World Matrix (Per-Item Transform)

Each item has position, rotation (Euler angles in radians), and scale. These are combined into one transform so we can move every vertex in one go. **Order matters**: apply scale first, then rotation (X, then Y, then Z), then translation.

---

## Scale, Rotation, and Translation (Theory)

**Scale (S)** — From info.scale or per-axis (sx, sy, sz). Each axis multiplies the local coordinate by that factor.

**Rotation (R)** — From info.rotation (x, y, z in radians). Rotations are applied around X, then Y, then Z. Each axis rotation leaves that axis unchanged and rotates the other two (e.g. Z rotation keeps z and rotates x and y in the XY plane using cos and sin of the angle).

**Translation (T)** — From position (tx, ty, tz). We add these to the rotated-and-scaled coordinates to get the final world position.

To get a pixel: take the world position, apply view rotation to get view-space coordinates, then map view X and Y to screen using the viewport scale and center. View depth is only used for depth ordering. Screen Y is flipped so that "up" in the world is up on screen.

---

## Orthographic Projection

Viewport stores width, height, scale (pixels per world unit), centerX (width/2), centerY (height/2), and optional viewRotationX, viewRotationY (radians). View rotation tilts the world (first around X, then around Y) so we see three faces of a cube. Orthographic projection then maps the tilted X and Y to pixel coordinates using the scale and center; the tilted depth is not used for pixel position, only for depth order (who is in front).

---

## Depth Ordering

For collections with kind "3d", we draw farther objects first so that closer ones appear on top. Each item is assigned a single depth value (e.g. from its position, or 0 if only x and y are given). Items are sorted by this value (ascending: small depth first), then drawn in that order. More advanced engines sometimes sort by per-vertex depth; here we use one depth per item for simplicity.

---

## Summary

| Step | What happens |
|------|----------------------|
| **Loop** | requestAnimationFrame runs renderSystem(dt) every frame. |
| **Data** | getCollections() builds Collection[] from SDUI store (Canvas3D children). |
| **Draw** | Clear canvas; for each collection sort by depth, then for each item call strategy[item.type](ctx, viewport, item, kind, dt). |
| **Per item** | World transform from position, rotation, scale (scale then rotate X/Y/Z then translate). |
| **Per vertex** | Local to world (via that transform), then view rotation, then orthographic to pixels; depth used for draw order. |
| **Strategy** | No default in the package; inject renderStrategy (e.g. from Storybook or createSduiComponents). |
        `,
      },
    },
  },
}

export default meta
type Story = StoryObj<typeof SduiLayoutRenderer>

/** Example source for Docs "Show code": cube document. */
const CUBE_DOCUMENT_SOURCE = `const document = {
  version: '1.0.0',
  root: {
    id: 'root',
    type: 'Div',
    attributes: { className: 'w-full h-[400px]' },
    children: [{
      id: 'canvas',
      type: 'Canvas3D',
      state: { width: 600, height: 400, scale: 80 },
      children: [{
        id: 'col-3d',
        type: 'Canvas3DCollection',
        state: { kind: '3d' },
        children: [{
          id: 'cube-1',
          type: 'Canvas3DItem',
          state: {
            type: 'cube',
            position: { x: 0, y: 0, z: 0 },
            info: { scale: 1, rotation: { x: 0, y: 0, z: 0 }, stroke: '#1a1a1a' },
          },
        }],
      }],
    }],
  },
}

<SduiLayoutRenderer document={document} components={canvas3DComponents} />`

/** Example source for Docs "Show code": interpolation chart document. */
const INTERPOLATION_CHART_DOCUMENT_SOURCE = `// Data: 12 points (x 0..11)
const data = [
  { x: 0, y: 0 }, { x: 1, y: 20 }, { x: 2, y: 20 }, { x: 3, y: 58 },
  { x: 4, y: 58 }, { x: 5, y: 118 }, { x: 6, y: 148 }, { x: 7, y: 178 },
  { x: 8, y: 118 }, { x: 9, y: 125 }, { x: 10, y: 105 }, { x: 11, y: 110 },
]

const document = {
  version: '1.0.0',
  root: {
    id: 'root',
    type: 'Div',
    attributes: { className: 'w-full h-[420px]' },
    children: [{
      id: 'chart-canvas',
      type: 'Canvas3D',
      state: { width: 640, height: 400, scale: 80 },
      children: [{
        id: 'chart-col',
        type: 'Canvas3DCollection',
        state: { kind: '2d' },
        children: [{
          id: 'chart-item',
          type: 'Canvas3DItem',
          state: {
            type: 'interpolationChart',
            position: { x: 0, y: 0 },
            info: {
              title: 'Interpolation Modes',
              xRange: [0, 11],
              yRange: [-50, 200],
              series: [
                { data, interpolation: 'monotone', stroke: '#dc2626' },
                { data, interpolation: 'cubic', stroke: '#2563eb' },
                { data, interpolation: 'linear', stroke: '#0d9488' },
              ],
            },
          },
        }],
      }],
    }],
  },
}

<SduiLayoutRenderer document={document} components={canvas3DComponents} />`

/** SDUI document: one 3D collection with a single cube item. */
function cubeDocument(rotation?: { x: number; y: number; z: number }): SduiLayoutDocument {
  return {
    version: '1.0.0',
    root: {
      id: 'root',
      type: 'Div',
      attributes: { className: 'w-full h-[400px]' },
      children: [
        {
          id: 'canvas',
          type: 'Canvas3D',
          state: { width: 600, height: 400, scale: 80 },
          children: [
            {
              id: 'col-3d',
              type: 'Canvas3DCollection',
              state: { kind: '3d' },
              children: [
                {
                  id: 'cube-1',
                  type: 'Canvas3DItem',
                  state: {
                    type: 'cube',
                    position: { x: 0, y: 0, z: 0 },
                    info: {
                      scale: 1,
                      rotation: rotation ?? { x: 0, y: 0, z: 0 },
                      stroke: '#1a1a1a',
                    },
                  },
                },
              ],
            },
          ],
        },
      ],
    },
  }
}

/** SDUI document: one 3D collection with a single hexagon item. */
function hexagonDocument(rotation?: { x: number; y: number; z: number }): SduiLayoutDocument {
  return {
    version: '1.0.0',
    root: {
      id: 'root',
      type: 'Div',
      attributes: { className: 'w-full h-[400px]' },
      children: [
        {
          id: 'canvas',
          type: 'Canvas3D',
          state: { width: 600, height: 400, scale: 80 },
          children: [
            {
              id: 'col-3d',
              type: 'Canvas3DCollection',
              state: { kind: '3d' },
              children: [
                {
                  id: 'hexagon-1',
                  type: 'Canvas3DItem',
                  state: {
                    type: 'hexagon',
                    position: { x: 0, y: 0, z: 0 },
                    info: {
                      scale: 1,
                      rotation: rotation ?? { x: 0, y: 0, z: 0 },
                      stroke: '#1a1a1a',
                    },
                  },
                },
              ],
            },
          ],
        },
      ],
    },
  }
}

/** SDUI document: one 3D collection with a single cup (surface-of-revolution) item. */
function cupDocument(rotation?: { x: number; y: number; z: number }): SduiLayoutDocument {
  return {
    version: '1.0.0',
    root: {
      id: 'root',
      type: 'Div',
      attributes: { className: 'w-full h-[400px]' },
      children: [
        {
          id: 'canvas',
          type: 'Canvas3D',
          state: { width: 600, height: 400, scale: 80 },
          children: [
            {
              id: 'col-3d',
              type: 'Canvas3DCollection',
              state: { kind: '3d' },
              children: [
                {
                  id: 'cup-1',
                  type: 'Canvas3DItem',
                  state: {
                    type: 'cup',
                    position: { x: 0, y: 0, z: 0 },
                    info: {
                      scale: 1,
                      rotation: rotation ?? { x: 0, y: 0, z: 0 },
                      stroke: '#1a1a1a',
                    },
                  },
                },
              ],
            },
          ],
        },
      ],
    },
  }
}

/** SDUI document: one 3D collection with a single filled cup (blue fill + black outline). */
function cupFilledDocument(rotation?: { x: number; y: number; z: number }): SduiLayoutDocument {
  return {
    version: '1.0.0',
    root: {
      id: 'root',
      type: 'Div',
      attributes: { className: 'w-full h-[400px]' },
      children: [
        {
          id: 'canvas',
          type: 'Canvas3D',
          state: { width: 600, height: 400, scale: 80 },
          children: [
            {
              id: 'col-3d',
              type: 'Canvas3DCollection',
              state: { kind: '3d' },
              children: [
                {
                  id: 'cup-filled-1',
                  type: 'Canvas3DItem',
                  state: {
                    type: 'cupFilled',
                    position: { x: 0, y: 0, z: 0 },
                    info: {
                      scale: 1,
                      rotation: rotation ?? { x: 0, y: 0, z: 0 },
                      fill: '#3366CC',
                      stroke: '#1a1a1a',
                    },
                  },
                },
              ],
            },
          ],
        },
      ],
    },
  }
}

interface RotationDriverState {
  targetNodeId?: string
}

interface RotationTargetInfo {
  rotation?: { x: number; y: number; z: number }
  [key: string]: unknown
}

function getRotationTargetInfo(node: { state?: { info?: unknown } } | undefined): RotationTargetInfo {
  const info = node?.state?.info
  if (info == null || typeof info !== 'object') return {}
  return info as RotationTargetInfo
}

/** Drives rotation of a target node by updating its state every frame. Renders nothing. */
const RotationDriver = ({ nodeId }: { nodeId: string }) => {
  const store = useSduiLayoutAction()
  const nodeState = store.state.nodes[nodeId]?.state as RotationDriverState | undefined
  const targetNodeId = typeof nodeState?.targetNodeId === 'string' ? nodeState.targetNodeId : ''

  useEffect(() => {
    if (!targetNodeId) return () => {}
    let rafId: number
    const loop = () => {
      const node = store.state.nodes[targetNodeId]
      const info = getRotationTargetInfo(node)
      const t = performance.now() / 1000
      store.updateNodeState(targetNodeId, {
        info: {
          ...info,
          rotation: { x: 0, y: 0, z: t * 0.5 },
        },
      })
      rafId = requestAnimationFrame(loop)
    }
    rafId = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(rafId)
  }, [store, targetNodeId])

  return null
}

const componentsWithDriver = {
  ...canvas3DComponents,
  RotationDriver: (id: string) => <RotationDriver nodeId={id} />,
}

/** Wrapper for canvas stories: consistent card and centering. */
const CanvasStoryWrapper = ({ children }: { children: ReactNode }) => (
  <div className="flex justify-center rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
    {children}
  </div>
)

/** Static cube (no rotation). */
export const StaticCube: Story = {
  render: () => (
    <CanvasStoryWrapper>
      <SduiLayoutRenderer document={cubeDocument()} components={canvas3DComponents} />
    </CanvasStoryWrapper>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Renders a single 3D cube from an SDUI document. No rotation.',
      },
      source: {
        code: CUBE_DOCUMENT_SOURCE,
        language: 'tsx',
        type: 'code',
      },
    },
  },
}

/** Rotating cube: RotationDriver updates cube node state every frame. */
export const RotatingCube: Story = {
  render: () => {
    const document: SduiLayoutDocument = {
      version: '1.0.0',
      root: {
        id: 'root',
        type: 'Div',
        attributes: { className: 'w-full h-[400px]' },
        children: [
          {
            id: 'canvas',
            type: 'Canvas3D',
            state: { width: 600, height: 400, scale: 80 },
            children: [
              {
                id: 'col-3d',
                type: 'Canvas3DCollection',
                state: { kind: '3d' },
                children: [
                  {
                    id: 'cube-1',
                    type: 'Canvas3DItem',
                    state: {
                      type: 'cube',
                      position: { x: 0, y: 0, z: 0 },
                      info: {
                        scale: 1,
                        rotation: { x: 0, y: 0, z: 0 },
                        stroke: '#1a1a1a',
                      },
                    },
                  },
                ],
              },
            ],
          },
          {
            id: 'driver',
            type: 'RotationDriver',
            state: { targetNodeId: 'cube-1' },
          },
        ],
      },
    }

    return (
      <CanvasStoryWrapper>
        <SduiLayoutRenderer document={document} components={componentsWithDriver} />
      </CanvasStoryWrapper>
    )
  },
  parameters: {
    docs: {
      description: {
        story: "Rotating 3D cube. RotationDriver updates the cube node's rotation state every frame.",
      },
    },
  },
}

/** Static hexagon (no rotation). */
export const StaticHexagon: Story = {
  render: () => (
    <CanvasStoryWrapper>
      <SduiLayoutRenderer document={hexagonDocument()} components={canvas3DComponents} />
    </CanvasStoryWrapper>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Renders a single 3D hexagon from an SDUI document. No rotation.',
      },
    },
  },
}

/** Rotating hexagon: RotationDriver updates hexagon node state every frame. */
export const RotatingHexagon: Story = {
  render: () => {
    const document: SduiLayoutDocument = {
      version: '1.0.0',
      root: {
        id: 'root',
        type: 'Div',
        attributes: { className: 'w-full h-[400px]' },
        children: [
          {
            id: 'canvas',
            type: 'Canvas3D',
            state: { width: 600, height: 400, scale: 80 },
            children: [
              {
                id: 'col-3d',
                type: 'Canvas3DCollection',
                state: { kind: '3d' },
                children: [
                  {
                    id: 'hexagon-1',
                    type: 'Canvas3DItem',
                    state: {
                      type: 'hexagon',
                      position: { x: 0, y: 0, z: 0 },
                      info: {
                        scale: 1,
                        rotation: { x: 0, y: 0, z: 0 },
                        stroke: '#1a1a1a',
                      },
                    },
                  },
                ],
              },
            ],
          },
          {
            id: 'driver',
            type: 'RotationDriver',
            state: { targetNodeId: 'hexagon-1' },
          },
        ],
      },
    }

    return (
      <CanvasStoryWrapper>
        <SduiLayoutRenderer document={document} components={componentsWithDriver} />
      </CanvasStoryWrapper>
    )
  },
  parameters: {
    docs: {
      description: {
        story:
          "Rotating hexagon. RotationDriver updates the hexagon node's rotation state every frame, and the canvas reads the store every frame to reflect it.",
      },
    },
  },
}

/** Static cup (surface-of-revolution wireframe, no rotation). */
export const StaticCup: Story = {
  render: () => (
    <CanvasStoryWrapper>
      <SduiLayoutRenderer document={cupDocument()} components={canvas3DComponents} />
    </CanvasStoryWrapper>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Renders a single 3D cup (surface of revolution) wireframe from an SDUI document. No rotation.',
      },
    },
  },
}

/** Rotating cup: RotationDriver updates cup node state every frame. */
export const RotatingCup: Story = {
  render: () => {
    const document: SduiLayoutDocument = {
      version: '1.0.0',
      root: {
        id: 'root',
        type: 'Div',
        attributes: { className: 'w-full h-[400px]' },
        children: [
          {
            id: 'canvas',
            type: 'Canvas3D',
            state: { width: 600, height: 400, scale: 80 },
            children: [
              {
                id: 'col-3d',
                type: 'Canvas3DCollection',
                state: { kind: '3d' },
                children: [
                  {
                    id: 'cup-1',
                    type: 'Canvas3DItem',
                    state: {
                      type: 'cup',
                      position: { x: 0, y: 0, z: 0 },
                      info: {
                        scale: 1,
                        rotation: { x: 0, y: 0, z: 0 },
                        stroke: '#1a1a1a',
                      },
                    },
                  },
                ],
              },
            ],
          },
          {
            id: 'driver',
            type: 'RotationDriver',
            state: { targetNodeId: 'cup-1' },
          },
        ],
      },
    }

    return (
      <CanvasStoryWrapper>
        <SduiLayoutRenderer document={document} components={componentsWithDriver} />
      </CanvasStoryWrapper>
    )
  },
  parameters: {
    docs: {
      description: {
        story:
          "Rotating 3D cup. RotationDriver updates the cup node's rotation state every frame.",
      },
    },
  },
}

/** Filled cup (blue fill + black outline), static. */
export const StaticCupFilled: Story = {
  render: () => (
    <CanvasStoryWrapper>
      <SduiLayoutRenderer document={cupFilledDocument()} components={canvas3DComponents} />
    </CanvasStoryWrapper>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Renders a 3D cup with solid blue fill and black outline (surface of revolution).',
      },
    },
  },
}

/** Filled cup with rotation. */
export const RotatingCupFilled: Story = {
  render: () => {
    const document: SduiLayoutDocument = {
      version: '1.0.0',
      root: {
        id: 'root',
        type: 'Div',
        attributes: { className: 'w-full h-[400px]' },
        children: [
          {
            id: 'canvas',
            type: 'Canvas3D',
            state: { width: 600, height: 400, scale: 80 },
            children: [
              {
                id: 'col-3d',
                type: 'Canvas3DCollection',
                state: { kind: '3d' },
                children: [
                  {
                    id: 'cup-filled-1',
                    type: 'Canvas3DItem',
                    state: {
                      type: 'cupFilled',
                      position: { x: 0, y: 0, z: 0 },
                      info: {
                        scale: 1,
                        rotation: { x: 0, y: 0, z: 0 },
                        fill: '#3366CC',
                        stroke: '#1a1a1a',
                      },
                    },
                  },
                ],
              },
            ],
          },
          {
            id: 'driver',
            type: 'RotationDriver',
            state: { targetNodeId: 'cup-filled-1' },
          },
        ],
      },
    }

    return (
      <CanvasStoryWrapper>
        <SduiLayoutRenderer document={document} components={componentsWithDriver} />
      </CanvasStoryWrapper>
    )
  },
  parameters: {
    docs: {
      description: {
        story: 'Filled 3D cup with rotation. Blue fill and black outline.',
      },
    },
  },
}

/** Shared data for Interpolation Modes chart: x축 12개 (0..11), Y -50..200. */
const interpolationChartData = [
  { x: 0, y: 0 },
  { x: 1, y: 20 },
  { x: 2, y: 20 },
  { x: 3, y: 58 },
  { x: 4, y: 58 },
  { x: 5, y: 118 },
  { x: 6, y: 148 },
  { x: 7, y: 178 },
  { x: 8, y: 118 },
  { x: 9, y: 125 },
  { x: 10, y: 105 },
  { x: 11, y: 110 },
]

const CHART_WIDTH = 640
const CHART_HEIGHT = 400
const CHART_X_RANGE: [number, number] = [0, 11]
const CHART_Y_RANGE: [number, number] = [-50, 200]
const HOVER_HIT_RADIUS = 14

type ChartTooltip = { clientX: number; clientY: number; x: number; y: number }

/** Wrapper that adds point hover tooltip to the interpolation chart. */
const InterpolationModesWithTooltip = () => {
  const wrapperRef = useRef<HTMLDivElement>(null)
  const [tooltip, setTooltip] = useState<ChartTooltip | null>(null)

  useEffect(() => {
    const wrapper = wrapperRef.current
    if (!wrapper) return undefined

    const canvas = wrapper.querySelector('canvas')
    if (!canvas) return undefined

    const onMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect()
      const cw = canvas.width
      const ch = canvas.height
      if (cw <= 0 || ch <= 0 || rect.width <= 0 || rect.height <= 0) return

      // Map mouse from display (CSS) coords to canvas buffer coords (same space as drawInterpolationChart)
      const mousePx = ((e.clientX - rect.left) / rect.width) * cw
      const mousePy = ((e.clientY - rect.top) / rect.height) * ch

      const dataToPixel = createChartDataToPixel(
        CHART_X_RANGE[0],
        CHART_X_RANGE[1],
        CHART_Y_RANGE[0],
        CHART_Y_RANGE[1],
        cw,
        ch,
      )

      const best = interpolationChartData.reduce<{ x: number; y: number; dist: number } | null>(
        (acc, p) => {
          const { px, py } = dataToPixel(p.x, p.y)
          const dist = Math.hypot(mousePx - px, mousePy - py)
          if (dist <= HOVER_HIT_RADIUS && (acc === null || dist < acc.dist)) {
            return { x: p.x, y: p.y, dist }
          }
          return acc
        },
        null,
      )

      if (best !== null) {
        setTooltip({ clientX: e.clientX, clientY: e.clientY, x: best.x, y: best.y })
      } else {
        setTooltip(null)
      }
    }

    const onMouseLeave = () => setTooltip(null)

    canvas.addEventListener('mousemove', onMouseMove)
    canvas.addEventListener('mouseleave', onMouseLeave)
    return () => {
      canvas.removeEventListener('mousemove', onMouseMove)
      canvas.removeEventListener('mouseleave', onMouseLeave)
    }
  }, [])

  const document: SduiLayoutDocument = {
    version: '1.0.0',
    root: {
      id: 'root',
      type: 'Div',
      attributes: { className: 'w-full h-[420px]' },
      children: [
        {
          id: 'chart-canvas',
          type: 'Canvas3D',
          state: { width: CHART_WIDTH, height: CHART_HEIGHT, scale: 80 },
          children: [
            {
              id: 'chart-col',
              type: 'Canvas3DCollection',
              state: { kind: '2d' },
              children: [
                {
                  id: 'chart-item',
                  type: 'Canvas3DItem',
                  state: {
                    type: 'interpolationChart',
                    position: { x: 0, y: 0 },
                    info: {
                      title: 'Interpolation Modes',
                      xRange: CHART_X_RANGE,
                      yRange: CHART_Y_RANGE,
                      series: [
                        {
                          data: interpolationChartData,
                          interpolation: 'monotone',
                          stroke: '#dc2626',
                          label: 'Cubic interpolation (monotone)',
                        },
                        {
                          data: interpolationChartData,
                          interpolation: 'cubic',
                          stroke: '#2563eb',
                          label: 'Cubic interpolation',
                        },
                        {
                          data: interpolationChartData,
                          interpolation: 'linear',
                          stroke: '#0d9488',
                          label: 'Linear interpolation (default)',
                        },
                      ],
                    },
                  },
                },
              ],
            },
          ],
        },
      ],
    },
  }

  const activeTooltip = tooltip

  const tooltipStyle =
    activeTooltip !== null
      ? (() => {
          const offset = 12
          const padding = 8
          const tooltipW = 80
          const tooltipH = 28
          let left = activeTooltip.clientX + offset
          let top = activeTooltip.clientY + offset
          const vw = typeof window !== 'undefined' ? window.innerWidth : 0
          const vh = typeof window !== 'undefined' ? window.innerHeight : 0
          if (vw > 0 && left + tooltipW + padding > vw) left = vw - tooltipW - padding
          if (vw > 0 && left < padding) left = padding
          if (vh > 0 && top + tooltipH + padding > vh) top = vh - tooltipH - padding
          if (vh > 0 && top < padding) top = padding
          return { left, top }
        })()
      : null

  const legendItems = [
    { label: 'Cubic interpolation (monotone)', color: '#dc2626' },
    { label: 'Cubic interpolation', color: '#2563eb' },
    { label: 'Linear interpolation (default)', color: '#0d9488' },
  ]

  return (
    <CanvasStoryWrapper>
      <div ref={wrapperRef} className="relative flex flex-col items-center gap-4">
        <SduiLayoutRenderer document={document} components={canvas3DComponents} />
        <div className="flex flex-wrap justify-center gap-6 text-sm text-gray-600" role="list" aria-label="Chart legend">
          {legendItems.map((item) => (
            <span key={item.label} className="flex items-center gap-2" role="listitem">
              <span
                className="h-3 w-3 shrink-0 rounded-sm border border-gray-300"
                style={{ backgroundColor: item.color }}
                aria-hidden
              />
              <span>{item.label}</span>
            </span>
          ))}
        </div>
        <p className="text-xs text-gray-500">Hover over a data point to see (x, y) values.</p>
      </div>
      {activeTooltip !== null && tooltipStyle !== null ? (
        <div
          className="pointer-events-none fixed z-10 rounded bg-gray-900 px-2 py-1.5 text-xs text-white shadow-lg"
          style={{ left: tooltipStyle.left, top: tooltipStyle.top }}
          role="tooltip"
        >
          <span className="font-medium">x: {activeTooltip.x}</span>
          <span className="ml-2 font-medium">y: {activeTooltip.y}</span>
        </div>
      ) : null}
    </CanvasStoryWrapper>
  )
}

/** Interpolation Modes: 2D line chart with linear, cubic, and monotone cubic interpolation (canvas-3d 2D collection). */
export const InterpolationModes: Story = {
  render: () => <InterpolationModesWithTooltip />,
  parameters: {
    docs: {
      description: {
        story: `
**2D line chart** comparing three interpolation modes on the same 12-point data (x: 0–11):

- **Linear** (teal): piecewise straight segments.
- **Cubic** (blue): natural cubic spline; smooth but may overshoot.
- **Cubic monotone** (red): Fritsch–Carlson; smooth and preserves monotonicity.

Rendered with \`Canvas3DCollection\` \`kind: "2d"\` and one \`Canvas3DItem\` \`type: "interpolationChart"\`.  
**Hover** a data point to see (x, y) in a tooltip. The legend below the chart identifies each series.
        `.trim(),
      },
      source: {
        code: INTERPOLATION_CHART_DOCUMENT_SOURCE,
        language: 'tsx',
        type: 'code',
      },
    },
  },
}
