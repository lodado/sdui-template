import { type SduiLayoutDocument, SduiLayoutRenderer, useSduiLayoutAction } from '@lodado/sdui-template'
import { Canvas3DContainer, sduiComponents } from '@lodado/sdui-template-component'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { useEffect } from 'react'

import { storybookCanvas3DRenderStrategy } from './canvas3d-renderers'

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

We have 3D coordinates \\((x, y, z)\\) (e.g. a corner of a cube). The screen has only 2D pixels \\((s_x, s_y)\\). We need a **projection** that maps 3D → 2D in a consistent way.

### Two common projections

| Projection | Idea | Use case |
|-----------|------|----------|
| **Perspective** | Far things look smaller (like a photo). | Realistic games, CAD. |
| **Orthographic** | No shrinking with distance: 1 unit in the world = fixed pixels. | Diagrams, technical views, this component. |

Canvas3D uses **orthographic** so that moving an object in \\(z\\) doesn’t change its on-screen size—only its position and draw order.

### Why "view rotation"?

If we map world \\(x \\to s_x\\) and \\(y \\to s_y\\) directly, we’re looking straight down the **Z axis**. A cube centered at the origin would look like a single square (only the front face). To see **three faces** (top, front, side), we first **tilt** the scene: we rotate the world around X and Y by small angles (\`viewRotationX\`, \`viewRotationY\`). That “view rotation” gives us a **view space** \\((x', y', z')\\); then we project \\((x', y')\\) to the screen and use \\(z'\\) only for depth ordering.

\`\`\`
  World space (x,y,z)     View rotation (tilt)      View space (x',y',z')
  ┌──────────────┐        R = Ry · Rx               ┌──────────────┐
  │   Y          │   ─────────────────────────►    │   y'         │
  │   │    Z     │   (default ~0.35, 0.75 rad)     │   │   z'     │
  │   │   /      │                                 │   │   /      │
  │   └──┴─X     │   Cube now shows 3 faces        │   └──┴─x'    │
  └──────────────┘                                 └──────────────┘
         │                                                    │
         │                                                    ▼
         │                                          Orthographic project
         │                                          (x',y') → (sx,sy)
         │                                          z' kept for depth
         └──────────────────────────────────────────────────────────────►
                          Screen (sx, sy) — pixels
\`\`\`

---

## Coordinate Systems and the Full Path of a Point

A single vertex (e.g. one corner of a cube) goes through four stages:

\`\`\`
  ① Local space          ② World space           ③ View space            ④ Screen
  (model coords)         (scene coords)           (after view tilt)       (pixels)

  Cube corner             Same point after        Same point after        (sx, sy)
  e.g. (0.5, 0.5, 0.5)    position/rotation/      view rotation           for drawing
  (in model units)        scale of the item       (x', y', z')            z' for order
         │                         │                       │
         │  World matrix M          │  View rotation        │  Orthographic
         │  M = T·Rz·Ry·Rx·S        │  R = Ry·Rx            │  sx = centerX + x'·scale
         └─────────────────────────┼───────────────────────┼  sy = centerY - y'·scale
                                   ▼                       ▼  (Y flipped for screen)
                              (x, y, z)                (x', y', z')
\`\`\`

- **Local**: Vertices are defined in the shape’s own space (e.g. cube \\(\\pm 0.5\\)).
- **World**: \\(M\\) (world matrix) moves the shape to the scene (position, rotation, scale).
- **View**: View rotation turns the whole scene so we see multiple faces.
- **Screen**: \\((x', y')\\) → \\((s_x, s_y)\\) with a fixed scale; \\(z'\\) is only used for depth order.

---

## The World Matrix (Per-Item Transform)

Each item has \`position\`, \`rotation\` (Euler angles in radians), and \`scale\`. These are combined into one **4×4 matrix** \\(M\\) so we can transform every vertex in one go.

**Order matters.** We want: “scale the shape, then rotate it, then move it.” In matrix form (right-to-left application):

\\( M = T \\cdot (R_z \\cdot R_y \\cdot R_x) \\cdot S \\)

| Symbol | Meaning | From |
|--------|---------|------|
| \\(S\\) | Scale | \`info.scale\` (or 1) |
| \\(R_x, R_y, R_z\\) | Rotate around X, Y, Z | \`info.rotation.x, y, z\` (radians) |
| \\(T\\) | Translate | \`position.x, y, z\` |

**Simple 2D analogy:** To draw a square at \\((5, 10)\\) rotated by 90°: first scale/define the square, then rotate it, then move its center to \\((5, 10)\\). 3D is the same idea with one more axis and one more rotation.

\`\`\`
  Local vertex v  ──►  M·v  ──►  world (x,y,z)  ──►  view rotation  ──►  (x',y',z')
                                                                              │
                                                                              ├── (x',y') → (sx,sy)  draw
                                                                              └── z'       → depth   order
\`\`\`

---

## Orthographic Projection (The Exact Formulas)

**Viewport** stores: \`width\`, \`height\`, \`scale\` (pixels per world unit), \`centerX = width/2\`, \`centerY = height/2\`, and optional \`viewRotationX\`, \`viewRotationY\` (radians).

1. **View rotation** (world → view):
   - \\( R = R_y(\\texttt{viewRotationY}) \\cdot R_x(\\texttt{viewRotationX}) \\)
   - \\( (x', y', z')^T = R \\cdot (x, y, z)^T \\)
   - If both angles are 0, \\((x', y', z') = (x, y, z)\\).

2. **Orthographic map to screen** (view → pixels):
   - \\( s_x = \\texttt{centerX} + x' \\cdot \\texttt{scale} \\)
   - \\( s_y = \\texttt{centerY} - y' \\cdot \\texttt{scale} \\)
     (minus so that +y is up in world, down on screen.)
   - \\(z'\\) is **not** used for \\(s_x, s_y\\); it is used only for **depth ordering** (who is in front).

So: **world → view rotation → use \\((x', y')\\) for drawing and \\(z'\\) for order.**

---

## Depth Ordering

For collections with \`kind: '3d'\`, we draw **farther objects first** so that closer ones appear on top. Each item is assigned a single depth value (e.g. the \\(z\\) of its position, or 0 if only \\(x, y\\) are given). Items are sorted by this value (ascending: small z first), then drawn in that order.

\`\`\`
  Collection (kind: '3d')
    Item A  z=2   ──►  draw 3rd (front)
    Item B  z=0   ──►  draw 1st (back)
    Item C  z=1   ──►  draw 2nd (middle)
\`\`\`

More advanced engines sometimes sort by per-vertex depth; here we use one z per item for simplicity.

---

## Summary

| Step | What happens |
|------|----------------------|
| **Loop** | \`requestAnimationFrame\` → \`renderSystem(dt)\` every frame. |
| **Data** | \`getCollections()\` builds \`Collection[]\` from SDUI store (Canvas3D children). |
| **Draw** | Clear canvas; for each collection: sort by z → for each item call \`strategy[item.type](ctx, viewport, item, kind, dt)\`. |
| **Per item** | World matrix \\(M = T \\cdot R_z R_y R_x \\cdot S\\) from position/rotation/scale. |
| **Per vertex** | Local → \\(M\\cdot v\\) → world → view rotation \\((x',y',z')\\) → orthographic \\((s_x, s_y)\\); use \\(z'\\) for depth. |
| **Strategy** | No default in the package; inject \`renderStrategy\` (e.g. from Storybook or \`createSduiComponents({ canvas3DRenderStrategy })\`). |
        `,
      },
    },
  },
}

export default meta
type Story = StoryObj<typeof SduiLayoutRenderer>

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

/** Drives rotation of a target node by updating its state every frame. Renders nothing. */
const RotationDriver = ({ nodeId }: { nodeId: string }) => {
  const store = useSduiLayoutAction()
  const targetNodeId = (store.state.nodes[nodeId]?.state?.targetNodeId as string) || ''

  useEffect(() => {
    if (!targetNodeId) return () => {}
    let rafId: number
    const loop = () => {
      const node = store.state.nodes[targetNodeId]
      const info = (node?.state?.info as Record<string, unknown>) ?? {}
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

/** Static cube (no rotation). */
export const StaticCube: Story = {
  render: () => (
    <div className="rounded border border-gray-200 p-4 bg-white">
      <SduiLayoutRenderer document={cubeDocument()} components={canvas3DComponents} />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Renders a single 3D cube from an SDUI document. No rotation.',
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
      <div className="rounded border border-gray-200 p-4 bg-white">
        <SduiLayoutRenderer document={document} components={componentsWithDriver} />
      </div>
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
    <div className="rounded border border-gray-200 p-4 bg-white">
      <SduiLayoutRenderer document={hexagonDocument()} components={canvas3DComponents} />
    </div>
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
      <div className="rounded border border-gray-200 p-4 bg-white">
        <SduiLayoutRenderer document={document} components={componentsWithDriver} />
      </div>
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
