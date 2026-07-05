import type { Meta, StoryObj } from '@storybook/react-vite'
import React from 'react'

import { type DeepDiveConfig, DeepDiveTemplate, type Principle } from '../components'

const meta: Meta = {
  title: 'Document/Deep Dive/20 · Zod 검증',
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          '구독 시 schema를 넘겨 노드 상태를 Zod로 검증하고, 성공 시 반환 state 타입을 스키마로 좁히는 경계 안전 지점.',
      },
    },
  },
}

export default meta
type Story = StoryObj

const STEPS: Principle[] = [
  {
    num: '01',
    title: '스키마 정의',
    body: (
      <>
        노드 상태의 모양을 <code>z.object</code> 로 선언합니다. 이 스키마가 곧 신뢰의 계약이 됩니다.
      </>
    ),
  },
  {
    num: '02',
    title: '구독 시 검증',
    body: (
      <>
        <code>useSduiNodeSubscription</code> 에 <code>schema</code> 를 넘기면 구독하면서 동시에 <code>safeParse</code>{' '}
        로 검증합니다. 유효하지 않으면 throw 합니다.
      </>
    ),
  },
  {
    num: '03',
    title: '타입 좁힘',
    body: (
      <>
        검증에 성공하면 반환 <code>state</code> 타입이 <code>z.infer</code> 로 스키마까지 좁혀집니다.
      </>
    ),
    wide: true,
  },
]

const ZOD_CODE = `import { z } from 'zod'

const toggleStateSchema = z.object({
  isChecked: z.boolean(),
  label: z.string(),
})

// 구독하면서 동시에 검증 — 실패 시 throw, 성공 시 타입이 스키마로 좁혀짐
const { state } = useSduiNodeSubscription({
  nodeId: 'toggle-1',
  schema: toggleStateSchema,
})
state.isChecked // boolean 으로 타입 추론`

const config: DeepDiveConfig = {
  accent: 'renderer',
  kicker: 'Deep Dive · @lodado/sdui-template',
  title: 'Zod 검증 · 경계에서 안전하게',
  lead: '구독 시 schema를 넘기면 노드 상태를 Zod로 검증하고 성공 시 반환 state 타입이 스키마로 좁혀집니다. 서버가 내려준 신뢰할 수 없는 JSON을 시스템 경계에서 안전하게 다루는 지점입니다.',
  pills: ['zod', 'safeParse', 'z.infer', 'schema on subscribe'],
  steps: STEPS,
  stepsIntro: '스키마를 한 번 정의하면, 구독하는 순간 검증과 타입 좁힘이 함께 따라옵니다.',
  sections: [
    {
      index: '20.1',
      label: 'Validation',
      title: '구독하며 검증',
      blocks: [
        {
          kind: 'prose',
          body: (
            <>
              구독 시 <code>schema</code> 를 넘기면 노드 상태를 Zod로 검증하고, 성공 시 반환 <code>state</code> 타입이
              스키마로 좁혀집니다. 서버가 내려준 신뢰할 수 없는 JSON을 시스템 경계에서 안전하게 다루는 지점입니다.
            </>
          ),
        },
        { kind: 'code', file: 'react-wrapper/hooks/useSduiNodeSubscription.ts', code: ZOD_CODE },
        {
          kind: 'badges',
          items: ['SduiLayoutDocument', 'SduiLayoutNode', 'z.infer<TSchema>', 'safeParse', 'throw on invalid'],
        },
      ],
    },
  ],
}

export const ZodValidation: Story = {
  name: 'Zod 검증',
  render: () => <DeepDiveTemplate config={config} />,
}
