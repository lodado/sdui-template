import type { Meta, StoryObj } from '@storybook/react-vite'
import React from 'react'

import { type DeepDiveConfig, DeepDiveTemplate, type Principle } from '../components'

const meta: Meta = {
  title: 'Document/Deep Dive/08 · 어댑터 계약',
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: '영속·첨부·검색·협업을 인터페이스만으로 정의하고, 구현은 코어 밖에서 주입하는 방법.',
      },
    },
  },
}

export default meta
type Story = StoryObj

const STEPS: Principle[] = [
  {
    num: '01',
    title: '계약 정의',
    body: (
      <>
        코어는 <code>SduiDocumentRepository</code> · <code>SduiDocumentAttachmentStorage</code> 같은 인터페이스만
        선언합니다. 구현은 어디에도 없습니다.
      </>
    ),
  },
  {
    num: '02',
    title: '구현 주입',
    body: <>소비자가 DB·스토리지·검색 엔진에 맞춘 구현체를 만들어 계약에 주입합니다.</>,
  },
  {
    num: '03',
    title: '백엔드 교체 자유',
    body: <>도메인은 백엔드 선택을 모르므로 순수하게 유지됩니다. DB·S3·메모리 어떤 백엔드로도 자유롭게 교체됩니다.</>,
    wide: true,
  },
]

const CONTRACT_CODE = `// 코어는 인터페이스만 정의하고 구현은 소비자가 주입.
interface SduiDocumentRepository {
  load(id: SduiDocumentId): Promise<SduiDocument | null>
  save(document: SduiDocument): Promise<void>
  list(workspaceId: string): Promise<SduiDocumentSummary[]>
}

interface SduiDocumentAttachmentStorage {
  put(file: File): Promise<{ url: string }>
  remove(url: string): Promise<void>
}
// → DB·S3·메모리 어떤 백엔드로도 교체 가능. 도메인은 순수하게 유지.`

const config: DeepDiveConfig = {
  accent: 'core',
  kicker: 'Deep Dive · @lodado/sdui-document',
  title: '어댑터 계약 · 구현은 코어 밖으로',
  lead: '영속·첨부·검색·협업은 인터페이스만 정의합니다. 도메인은 백엔드 선택을 모르므로 순수하게 유지되고, 소비자가 DB·스토리지·검색 엔진을 주입합니다.',
  pills: ['DocumentRepository', 'StorageProvider', 'SearchIndex', 'CollaborationAdapter'],
  steps: STEPS,
  stepsIntro: '코어는 계약을 선언하고, 소비자는 구현을 주입합니다. 그 사이에서 백엔드는 언제든 갈아끼울 수 있습니다.',
  sections: [
    {
      index: '8.1',
      label: 'Contracts',
      title: '인터페이스만, 구현은 주입',
      blocks: [
        {
          kind: 'prose',
          body: (
            <>
              영속·첨부·검색·협업은 <strong>인터페이스만</strong> 정의됩니다. 도메인은 백엔드 선택을 알지 못하므로
              순수하게 유지되고, 소비자가 DB·스토리지·검색 엔진을 주입합니다. 라이브 데모가 없는 유일한 영역 — 계약만
              존재하기 때문입니다.
            </>
          ),
        },
        { kind: 'code', file: 'repositories/contracts.ts · storage/contracts.ts', code: CONTRACT_CODE },
      ],
    },
    {
      index: '8.2',
      label: 'Future',
      title: '협업은 확장점으로만',
      blocks: [
        {
          kind: 'prose',
          body: (
            <>
              계약은 오늘의 백엔드만이 아니라 내일의 기능도 겨냥합니다. <code>collaboration</code> 어댑터는 지금 필요한
              것보다 넓게 그려져, 구현이 붙기 전에도 도메인이 그 형태를 알고 있습니다.
            </>
          ),
        },
        {
          kind: 'callout',
          icon: '◆',
          body: (
            <>
              <strong>collaboration</strong> 어댑터는 <code>blockVersions</code> · <code>presence</code> 를 포함해
              미래의 문자 단위 협업을 위한 확장점을 열어둡니다 — 지금은 계약만, 구현은 없음.
            </>
          ),
        },
      ],
    },
  ],
}

export const AdapterContracts: Story = {
  name: '어댑터 계약',
  render: () => <DeepDiveTemplate config={config} />,
}
