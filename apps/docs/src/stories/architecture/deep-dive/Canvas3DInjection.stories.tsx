import type { Meta, StoryObj } from '@storybook/react-vite'
import React from 'react'

import { type DeepDiveConfig, DeepDiveTemplate, type Principle } from '../components'

const meta: Meta = {
  title: 'Document/Deep Dive/25 · Canvas3D 전략 주입',
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'Canvas3D 는 기본 렌더 전략이 없어 소비자가 전략을 주입해야 그려집니다 — 의존성 역전으로 번들과 관심사를 분리.',
      },
    },
  },
}

export default meta
type Story = StoryObj

const STEPS: Principle[] = [
  {
    num: '01',
    title: '기본은 렌더 없음',
    body: (
      <>
        무거운 3D 의존성을 코어에 넣지 않으려고 <code>Canvas3D</code> 는 기본 렌더 전략을 갖지 않습니다. 전략이 없으면
        아무것도 그려지지 않습니다.
      </>
    ),
  },
  {
    num: '02',
    title: '전략 주입',
    body: (
      <>
        소비자가 <code>createSduiComponents({'{ canvas3DRenderStrategy }'})</code> 로 렌더 전략을 넘겨야 실제로
        그려집니다 — 의존성 역전.
      </>
    ),
  },
  {
    num: '03',
    title: '쓰는 사람만 비용',
    body: <>3D를 쓰는 앱만 Three.js 같은 라이브러리 비용을 부담하고, 안 쓰는 앱의 번들은 가볍게 유지됩니다.</>,
    wide: true,
  },
]

const CANVAS_CODE = `import { createSduiComponents } from '@lodado/sdui-template-component'
import { myRenderStrategy } from './my-canvas3d-renderers'

// Canvas3D 는 기본 렌더 전략이 없습니다(무거운 3D 의존성을 코어에서 분리).
// 소비자가 전략을 주입해야 실제로 그려집니다.
const components = createSduiComponents({ canvas3DRenderStrategy: myRenderStrategy })
// { type: 'Canvas3D', children: [{ type: 'Canvas3DCollection', children: [{ type: 'Canvas3DItem' }] }] }`

const config: DeepDiveConfig = {
  accent: 'components',
  kicker: 'Deep Dive · @lodado/sdui-template-component',
  title: 'Canvas3D · 렌더 전략 주입',
  lead: '무거운 3D 의존성을 코어에 넣지 않기 위해 Canvas3D는 기본 렌더 전략이 없음. 소비자가 createSduiComponents({ canvas3DRenderStrategy })로 전략을 주입해야 실제로 그려짐 — 의존성 역전으로 번들과 관심사를 분리.',
  pills: ['Canvas3D', 'createSduiComponents', 'render strategy', 'dependency inversion'],
  steps: STEPS,
  stepsIntro: '기본은 렌더 없음. 전략을 주입한 소비자만 3D가 그려지고, 그 비용도 쓰는 사람만 냅니다.',
  sections: [
    {
      index: '25.1',
      label: 'Injection',
      title: '전략을 주입해야 그려짐',
      blocks: [
        {
          kind: 'prose',
          body: (
            <>
              무거운 3D 의존성을 코어에 넣지 않기 위해 <code>Canvas3D</code> 는{' '}
              <strong>기본 렌더 전략이 없습니다</strong>. 소비자가{' '}
              <code>createSduiComponents({'{ canvas3DRenderStrategy }'})</code> 로 전략을 주입해야 실제로 그려집니다 —
              의존성 역전으로 번들과 관심사를 분리하는 패턴.
            </>
          ),
        },
        { kind: 'code', file: 'shared/ui/canvas-3d/*', code: CANVAS_CODE },
        {
          kind: 'callout',
          icon: '◆',
          body: (
            <>
              <strong>왜 주입인가:</strong> Three.js 같은 라이브러리를 라이브러리 코어가 강제로 끌고 오면 3D를 안 쓰는
              앱까지 번들이 커집니다. 전략 주입으로 「쓰는 사람만」 비용을 냅니다.
            </>
          ),
        },
      ],
    },
  ],
}

export const Canvas3DInjection: Story = {
  name: 'Canvas3D 전략 주입',
  render: () => <DeepDiveTemplate config={config} />,
}
