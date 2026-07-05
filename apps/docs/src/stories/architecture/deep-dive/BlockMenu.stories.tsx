import type { Meta, StoryObj } from '@storybook/react-vite'
import React from 'react'

import { type DeepDiveConfig, DeepDiveTemplate, type Principle } from '../components'
import { EditorWithPatchLog } from '../demos/EditorWithPatchLog'
import { blockMenuContent } from '../demos/sampleContents'

const meta: Meta = {
  title: 'Document/Deep Dive/12 · 블록 메뉴',
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: '빈 줄에서 / 를 눌러 여는 슬래시 메뉴와 블록 왼쪽 + 버튼 — 구조 편집 키는 PM 키맵으로 위임.',
      },
    },
  },
}

export default meta
type Story = StoryObj

const STEPS: Principle[] = [
  {
    num: '01',
    title: '/ 입력',
    body: (
      <>
        빈 줄에서 <code>/</code> 를 누르면 <code>slashMenuPlugin</code> 이 트리거를 감지합니다. 블록 왼쪽의{' '}
        <code>+</code> 버튼도 같은 진입점입니다.
      </>
    ),
  },
  {
    num: '02',
    title: '메뉴 오픈',
    body: <>삽입 가능한 블록 목록이 뜨고, 키보드와 포인터 양쪽으로 항목을 고를 수 있습니다.</>,
  },
  {
    num: '03',
    title: '블록 삽입 · 변환',
    body: <>선택한 항목이 아래에 새 블록을 넣거나, 지금 있는 블록의 타입을 바꿉니다.</>,
    wide: true,
  },
]

const config: DeepDiveConfig = {
  accent: 'react',
  kicker: 'Deep Dive · @lodado/sdui-document-react',
  title: '블록 메뉴 · 슬래시 & + 버튼',
  lead: '빈 줄에서 / 를 입력하면 slashMenuPlugin 이 블록 삽입·변환 메뉴를 엽니다. 블록 왼쪽의 + 버튼도 아래에 블록을 넣습니다. Enter split·Backspace merge·Tab/Shift-Tab indent·outdent·Arrow 이동 같은 구조 편집 키는 PM 키맵이 keymapDelegation 으로 에디터에 위임됩니다.',
  pills: ['slashMenuPlugin', '+ button', 'keymapDelegation', 'block insert/convert'],
  steps: STEPS,
  stepsIntro: '슬래시든 + 버튼이든 하나의 메뉴로 수렴하고, 구조 편집 키는 별도로 위임됩니다.',
  sections: [
    {
      index: '12.1',
      label: 'Menus',
      title: '슬래시 메뉴 · 키 위임',
      blocks: [
        {
          kind: 'prose',
          body: (
            <>
              빈 줄에서 <code>/</code> 를 누르면 <code>slashMenuPlugin</code> 이 블록 삽입·변환 메뉴를 엽니다. 블록
              왼쪽의 <code>+</code> 버튼도 같은 메뉴를 열어 아래에 블록을 넣습니다. 반면 <code>Enter</code> 로 블록을
              나누고 <code>Backspace</code> 로 합치며 <code>Tab</code> · <code>Shift-Tab</code> 으로 들여쓰기와
              내어쓰기를 하고 <code>Arrow</code> 로 블록을 옮기는 구조 편집 키는 ProseMirror 키맵이{' '}
              <code>keymapDelegation</code> 을 통해 에디터로 위임됩니다. 메뉴와 키맵은 서로 다른 진입점이지만 결국 같은
              패치로 수렴합니다.
            </>
          ),
        },
      ],
    },
    {
      index: '12.2',
      label: 'Live',
      title: 'Slash menu & + button',
      blocks: [
        {
          kind: 'prose',
          body: (
            <>
              아래 에디터의 빈 줄에서 <code>/</code> 를 눌러 메뉴를 열어 보세요. 블록 왼쪽에 뜨는 <code>+</code>{' '}
              버튼으로도 같은 메뉴가 열립니다. 항목을 고르면 오른쪽 로그에 삽입·변환 패치가 그대로 찍힙니다.
            </>
          ),
        },
        {
          kind: 'demo',
          title: 'Slash menu & + button',
          hint: '빈 줄에서 / 입력 · 왼쪽 + 버튼',
          node: <EditorWithPatchLog content={blockMenuContent} />,
        },
      ],
    },
  ],
}

export const BlockMenu: Story = {
  name: '블록 메뉴',
  render: () => <DeepDiveTemplate config={config} />,
}
