import type { Meta, StoryObj } from '@storybook/react-vite'
import React from 'react'

import { type DeepDiveConfig, DeepDiveTemplate, type Principle } from '../components'
import { FractionalOrderDemo } from '../demos/FractionalOrderDemo'

const meta: Meta = {
  title: 'Document/Deep Dive/03 · Fractional 순서',
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          '형제 블록을 배열 인덱스가 아니라 fractional 키로 정렬해, 사이에 삽입해도 이웃 키가 바뀌지 않고 재인덱싱이 없는 방법.',
      },
    },
  },
}

export default meta
type Story = StoryObj

const STEPS: Principle[] = [
  {
    num: '01',
    title: '사이값 생성',
    body: (
      <>
        두 블록 사이에 넣을 때 <code>generatePositionBetween</code> 이 이웃의 위치 사이에 새 <em>fractional 키</em>를
        만듭니다.
      </>
    ),
  },
  {
    num: '02',
    title: '이웃 불변',
    body: <>사이 키만 새로 생기고 좌우 이웃의 position은 그대로입니다. 재인덱싱이 없습니다.</>,
  },
  {
    num: '03',
    title: '동시삽입 · tie-break',
    body: (
      <>
        같은 자리에 동시에 삽입해도 충돌하지 않습니다. 키가 소진되면 <code>BlockOrigin</code> (clientId·opId)으로 결정적
        tie-break 합니다.
      </>
    ),
    wide: true,
  },
]

const config: DeepDiveConfig = {
  accent: 'core',
  kicker: 'Deep Dive · @lodado/sdui-document',
  title: 'Fractional 순서 · 충돌 없는 정렬',
  lead: '형제 블록을 배열 인덱스가 아니라 fractional 키로 정렬합니다. 두 블록 사이에 삽입해도 이웃 키가 바뀌지 않아 재인덱싱이 없고, 여러 클라이언트가 같은 자리에 동시에 삽입해도 충돌하지 않습니다.',
  pills: ['generatePositionBetween', 'fractional-indexing', 'no reindex', 'BlockOrigin tie-break'],
  steps: STEPS,
  stepsIntro: '사이값을 새로 만들 뿐 이웃 키는 건드리지 않으니, 동시 삽입도 재인덱싱 없이 안전하게 합쳐집니다.',
  sections: [
    {
      index: '3.1',
      label: 'Why',
      title: '배열 인덱스 대신 사이값',
      blocks: [
        {
          kind: 'prose',
          body: (
            <>
              형제 블록은 배열 인덱스가 아니라 <strong>fractional 키</strong>로 정렬됩니다. 두 블록 사이에 삽입할 때{' '}
              <code>generatePositionBetween</code> 이 <em>사이 값</em>을 새로 만들 뿐, 이웃의 키는 바뀌지 않습니다.
              재인덱싱 없는 단일 <code>block.insert</code> 라서 동시 삽입도 충돌하지 않고, 키가 소진되면{' '}
              <code>BlockOrigin</code> (clientId·opId)으로 결정적 tie-break 합니다.
            </>
          ),
        },
      ],
    },
    {
      index: '3.2',
      label: 'Live',
      title: '형제 사이에 삽입',
      blocks: [
        {
          kind: 'prose',
          body: (
            <>
              아래에서 두 형제 사이에 블록을 삽입해 보세요. <code>generatePositionBetween</code> 이 사이 키를 만들어도
              좌우 이웃의 <code>position</code> 은 그대로 유지됩니다.
            </>
          ),
        },
        {
          kind: 'demo',
          title: 'Insert between siblings',
          hint: '사이 키를 생성해도 이웃 position 불변',
          node: <FractionalOrderDemo />,
        },
        {
          kind: 'badges',
          items: [
            'generatePositionBetween',
            'sortChildren',
            'resolvePositionBounds',
            'ensureFractionalContent (1.0→1.1)',
            'rebalance',
          ],
        },
      ],
    },
  ],
}

export const FractionalOrdering: Story = {
  name: 'Fractional 순서',
  render: () => <DeepDiveTemplate config={config} />,
}
