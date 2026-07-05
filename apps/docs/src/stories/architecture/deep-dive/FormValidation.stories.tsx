import type { Meta, StoryObj } from '@storybook/react-vite'
import React from 'react'

import { type DeepDiveConfig, DeepDiveTemplate, type Principle } from '../components'

const meta: Meta = {
  title: 'Document/Deep Dive/24 · 폼 검증',
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: '서버가 내려준 폼 구조에 코드로 등록한 zod 스키마를 이름으로 연결해 제출 시 검증하는 방법.',
      },
    },
  },
}

export default meta
type Story = StoryObj

const STEPS: Principle[] = [
  {
    num: '01',
    title: '스키마 등록',
    body: (
      <>
        <code>registerSchemas</code> 로 폼 ID별 zod 스키마를 코드에서 미리 등록합니다.
      </>
    ),
  },
  {
    num: '02',
    title: 'Form이 이름으로 조회',
    body: (
      <>
        문서의 <code>Form</code> 노드가 <code>schemaName</code> 으로 등록된 스키마를 찾아냅니다.
      </>
    ),
  },
  {
    num: '03',
    title: '제출 시 검증',
    body: (
      <>
        <code>react-hook-form</code> 이 zod resolver로 제출 시점에 값을 검증합니다.
      </>
    ),
  },
]

const FORM_CODE = `import { sduiComponents, registerSchemas } from '@lodado/sdui-template-component'
import { z } from 'zod'

// 폼 ID별 zod 스키마를 미리 등록.
registerSchemas({
  loginForm: z.object({
    email: z.string().email(),
    password: z.string().min(8),
  }),
})

// 문서에서 Form 이 schema 이름으로 스키마를 찾아 제출 시 검증.
// { type: 'Form', state: { schemaName: 'loginForm' }, children: [ TextField…, Button ] }
<SduiLayoutRenderer document={doc} components={sduiComponents} />`

const config: DeepDiveConfig = {
  accent: 'components',
  kicker: 'Deep Dive · @lodado/sdui-template-component',
  title: '폼 검증 · zod 스키마 등록',
  lead: '서버가 폼 구조를 JSON으로 내려도 검증 규칙은 코드에 있어야 안전합니다. registerSchemas로 폼 ID별 zod 스키마를 등록해 두면, 문서의 Form 노드가 이름으로 스키마를 찾아 제출 시 검증합니다.',
  pills: ['registerSchemas', 'zod', 'react-hook-form', 'schema by name'],
  steps: STEPS,
  sections: [
    {
      index: '24.1',
      label: 'Forms',
      title: 'zod 스키마를 이름으로',
      blocks: [
        {
          kind: 'prose',
          body: (
            <>
              서버가 폼 구조를 JSON으로 내려도 검증 규칙은 코드에 있어야 안전합니다. <code>registerSchemas</code> 로 폼
              ID별 zod 스키마를 등록해 두면, 문서의 <code>Form</code> 노드가 이름으로 스키마를 찾아 제출 시 검증합니다.
            </>
          ),
        },
        { kind: 'code', file: 'features/form/types.ts', code: FORM_CODE },
        {
          kind: 'badges',
          items: ['registerSchemas', 'registerSchema', 'getSchema', 'react-hook-form', 'zod resolver'],
        },
      ],
    },
  ],
}

export const FormValidation: Story = {
  name: '폼 검증',
  render: () => <DeepDiveTemplate config={config} />,
}
