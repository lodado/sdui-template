import {
  type SduiLayoutDocument,
  SduiLayoutRenderer,
  useSduiLayoutAction,
} from '@lodado/sdui-template'
import {
  Canvas3DContainer,
  defaultRenderers,
  sduiComponents,
} from '@lodado/sdui-template-component'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { useEffect } from 'react'

/** Component map: Canvas3D gets renderStrategy via factory (cube + hexagon). */
const canvas3DComponents = {
  ...sduiComponents,
  Canvas3D: (id: string, parentPath?: string[]) => (
    <Canvas3DContainer
      id={id}
      parentPath={parentPath ?? []}
      renderStrategy={defaultRenderers}
    />
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

**Canvas3D** is rendered via SDUI. The document tree is:

- \`Canvas3D\` → \`Canvas3DCollection\` (state.kind: '3d' | '2d') → \`Canvas3DItem\` (state: type, position, info).

Collections are read from the store every frame (no subscription). Use \`updateNodeState(itemNodeId, { info: { rotation } })\` to drive rotation.
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
  const targetNodeId =
    (store.state.nodes[nodeId]?.state?.targetNodeId as string) || ''

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

/** Static cube (정육면체, no rotation). */
export const StaticCube: Story = {
  render: () => (
    <div className="rounded border border-gray-200 p-4 bg-white">
      <SduiLayoutRenderer
        document={cubeDocument()}
        components={canvas3DComponents}
      />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: '3D 정육면체 한 개를 SDUI 문서로 그립니다. 회전 없음.',
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
        <SduiLayoutRenderer
          document={document}
          components={componentsWithDriver}
        />
      </div>
    )
  },
  parameters: {
    docs: {
      description: {
        story: '회전하는 3D 정육면체. RotationDriver가 매 프레임 cube 노드의 rotation state를 갱신합니다.',
      },
    },
  },
}

/** Static hexagon (no rotation). */
export const StaticHexagon: Story = {
  render: () => (
    <div className="rounded border border-gray-200 p-4 bg-white">
      <SduiLayoutRenderer
        document={hexagonDocument()}
        components={canvas3DComponents}
      />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: '정육각형 한 개를 SDUI 문서로 그립니다. 회전 없음.',
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
        <SduiLayoutRenderer
          document={document}
          components={componentsWithDriver}
        />
      </div>
    )
  },
  parameters: {
    docs: {
      description: {
        story:
          '회전하는 정육각형. RotationDriver가 매 프레임 hexagon 노드의 rotation state를 갱신하고, 캔버스가 store를 매 프레임 읽어 반영합니다.',
      },
    },
  },
}
