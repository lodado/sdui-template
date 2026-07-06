import type { Meta, StoryObj } from '@storybook/react-vite'
import React from 'react'

import { type DeepDiveConfig, DeepDiveTemplate, type Principle } from '../components'
import { AutosaveDemo } from '../demos/AutosaveDemo'

const meta: Meta = {
  title: 'Document/Deep Dive/06 · Autosave 상태 머신',
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: '타이머도 네트워크도 없는 순수 리듀서로 저장 상태를 결정론적으로 계산하는 방법.',
      },
    },
  },
}

export default meta
type Story = StoryObj

const STEPS: Principle[] = [
  {
    num: '01',
    title: '이벤트 디스패치',
    body: (
      <>
        저장 루프가 발생시킬 이벤트를 상태 머신에 그대로 흘려보냅니다:{' '}
        <code>local.change · save.request · save.success · save.failure · network.offline · network.online</code>.
      </>
    ),
  },
  {
    num: '02',
    title: '순수 전이',
    body: (
      <>
        <code>reduceAutosaveState(state, event)</code> 는 새 상태를 반환하는 순수 함수입니다. 타이머도 네트워크도 없이{' '}
        <code>dirty · saving · offline · failed</code> 전이가 결정론적으로 계산됩니다.
      </>
    ),
  },
  {
    num: '03',
    title: '오프라인·실패 큐잉',
    body: (
      <>
        <code>save.failure</code> · <code>network.offline</code> 이면 <code>pendingPatchCount</code>를 비우지 않습니다.{' '}
        <code>network.online</code> 으로 <code>dirty</code> 가 되면 저장 루프가 <code>save.request</code> 를 다시
        디스패치합니다. 패치 본문 큐는 리듀서 밖(앱 또는 협업 outbox)에 둡니다.
      </>
    ),
    wide: true,
  },
]

const INTEGRATION_LOOP_CODE = `// 의사코드 — 코어에 없음. 앱이 repository + patchQueue로 조립.
let autosave = createInitialAutosaveState()
const patchQueue: SduiDocumentPatch[] = []

function onLocalEdit(patches: SduiDocumentPatch[]) {
  patchQueue.push(...patches)
  autosave = reduceAutosaveState(autosave, {
    type: 'local.change',
    patchCount: patches.length,
  })
  scheduleFlush()
}

async function flush() {
  if (autosave.status === 'offline' || patchQueue.length === 0) return

  autosave = reduceAutosaveState(autosave, { type: 'save.request' })
  try {
    await repository.savePatches({ documentId, patches: patchQueue, ... })
    patchQueue.length = 0
    autosave = reduceAutosaveState(autosave, {
      type: 'save.success',
      acknowledgedVersion: autosave.localVersion,
    })
  } catch {
    autosave = reduceAutosaveState(autosave, {
      type: 'save.failure',
      error: 'network_error',
    })
    // patchQueue 유지 → 재시도 대기
  }
}

window.addEventListener('online', () => {
  autosave = reduceAutosaveState(autosave, { type: 'network.online' })
  flush()
})
window.addEventListener('offline', () => {
  autosave = reduceAutosaveState(autosave, { type: 'network.offline' })
})`

const OUTBOX_SNIPPET = `// 협업(R3): 패치 본문 큐는 collaboration/outbox.ts
export type ClientSyncState = {
  confirmedSeq: number
  pending: readonly PendingEnvelope[]  // envelope + inverse
}

// stageLocalEdit → pending push (낙관적 적용)
// acknowledgeCommit → 서버 ack 시 pending에서 제거
// reconcileRemote → 롤백 → 원격 적용 → pending 재적용 (rebase)`

const config: DeepDiveConfig = {
  accent: 'core',
  kicker: 'Deep Dive · @lodado/sdui-document',
  title: 'Autosave 상태 머신 · 타이머 없는 순수 리듀서',
  lead: 'reduceAutosaveState(state, event) 는 타이머도 네트워크도 없는 순수 리듀서입니다. 저장 루프가 발생시킬 이벤트를 디스패치하며 dirty·saving·offline·failed 전이를 결정론적으로 계산합니다. pendingPatchCount는 “아직 서버에 안 올라간 편집이 있다”는 신호이고, 패치 JSON 큐는 앱·outbox가 소유합니다.',
  pills: ['reduceAutosaveState', 'pendingPatchCount', 'patchQueue (app)', 'outbox (collab)', 'no timers'],
  steps: STEPS,
  stepsIntro:
    '키 입력이든 네트워크 상태 변화든, 결국 하나의 이벤트로 수렴하고 순수 리듀서가 다음 저장 상태를 계산합니다.',
  sections: [
    {
      index: '6.1',
      label: 'Model',
      title: '이벤트 → 상태 전이',
      blocks: [
        {
          kind: 'prose',
          body: (
            <>
              <code>reduceAutosaveState(state, event)</code> 는 타이머도 네트워크도 없는 <strong>순수 리듀서</strong>
              입니다. 저장 루프가 발생시킬 이벤트를 직접 디스패치하면{' '}
              <code>idle · dirty · saving · saved · failed · offline</code> 사이의 전이가 결정론적으로 계산됩니다.
              시간에 의존하는 요소가 없으니 같은 이벤트 시퀀스는 언제나 같은 상태로 수렴합니다.
            </>
          ),
        },
      ],
    },
    {
      index: '6.2',
      label: 'Live',
      title: 'reduceAutosaveState',
      blocks: [
        {
          kind: 'prose',
          body: (
            <>
              아래 이벤트 버튼을 눌러 저장 루프가 내보낼 이벤트를 직접 디스패치해 보세요. 상단 상태 링이 그때그때{' '}
              <code>dirty · saving · offline · failed</code> 로 전이하는 것을 눈으로 확인할 수 있습니다.
            </>
          ),
        },
        {
          kind: 'demo',
          title: 'reduceAutosaveState',
          hint: '이벤트를 눌러 상태 전이 관찰',
          node: <AutosaveDemo />,
        },
        {
          kind: 'callout',
          icon: '◆',
          body: (
            <>
              <strong>왜 순수 리듀서인가:</strong> 타이머와 네트워크는 어댑터 경계 밖에 두고 상태 전이만 순수 함수로
              남겼기 때문에, 실제 타이머나 서버 없이도 이벤트 시퀀스만으로 모든 전이를 헤드리스로 테스트할 수 있습니다.
            </>
          ),
        },
      ],
    },
    {
      index: '6.3',
      label: 'Queueing',
      title: '큐잉은 어디에 있나',
      blocks: [
        {
          kind: 'prose',
          body: (
            <>
              Storybook 문구의 &quot;큐에 남겨 둔다&quot;는 <strong>패치 배열을 리듀서 안에 넣는다</strong>는 뜻이
              아닙니다. <code>reduceAutosaveState</code> 가 들고 있는 것은 <code>pendingPatchCount</code> ·{' '}
              <code>localVersion</code> · <code>acknowledgedVersion</code> 뿐입니다.
              <ul style={{ margin: '12px 0 0', paddingLeft: '1.25rem' }}>
                <li>
                  <strong>단순 저장(autosave):</strong> 에디터는 <code>useDocumentPatches</code> 로 로컬에 즉시 적용하고{' '}
                  <code>onContentChange</code> 만 호출합니다. 소비자가 <code>patchQueue[]</code> +{' '}
                  <code>SduiDocumentRepository.savePatches</code> 로 flush 루프를 조립합니다.
                </li>
                <li>
                  <strong>실시간 협업(R3):</strong> 패치 본문 큐는 <code>collaboration/outbox.ts</code> 의{' '}
                  <code>ClientSyncState.pending</code> (envelope + inverse). 원격 로그 도착 시 rebase합니다.
                </li>
                <li>
                  <strong>오프라인 재생 보조:</strong> 앵커 블록이 삭제된 뒤 큐에 있던 insert/move는 패치의{' '}
                  <code>fallbackAfter</code> 로 대체 위치를 찾습니다 (<code>offlineReplay.test.ts</code>).
                </li>
              </ul>
            </>
          ),
        },
        {
          kind: 'prose',
          body: (
            <>
              전이 규칙 요약 — <code>autosave.test.ts</code> 와 동일한 계약입니다.
              <ul style={{ margin: '12px 0 0', paddingLeft: '1.25rem' }}>
                <li>
                  <code>save.failure</code> → <code>status: failed</code>, <code>pendingPatchCount</code> 유지
                </li>
                <li>
                  <code>network.offline</code> + <code>local.change</code> → <code>status: offline</code>, pending 누적
                </li>
                <li>
                  <code>network.online</code> + pending 있음 → <code>dirty</code> (저장 루프가 <code>save.request</code>{' '}
                  재시도)
                </li>
                <li>
                  <code>save.success</code> 는 <code>acknowledgedVersion &gt;= localVersion</code> 일 때만 pending
                  초기화 (stale ack 무시)
                </li>
              </ul>
            </>
          ),
        },
        { kind: 'code', file: '앱 통합 — 저장 루프 (의사코드)', code: INTEGRATION_LOOP_CODE },
        { kind: 'code', file: 'collaboration/outbox.ts — 협업 패치 큐', code: OUTBOX_SNIPPET },
        {
          kind: 'callout',
          icon: '▲',
          body: (
            <>
              <strong>@lodado/sdui-document-react</strong> 에는 아직 <code>useAutosave</code> 훅이 없습니다. 위 루프는{' '}
              <code>onContentChange</code> 받는 앱 레이어에서 조립하는 패턴입니다. 협업 전송·rebase 원리는{' '}
              <strong>26번 문서(협업 패치 로그)</strong> 를 참고하세요.
            </>
          ),
        },
      ],
    },
  ],
}

export const AutosaveStateMachine: Story = {
  name: 'Autosave 상태 머신',
  render: () => <DeepDiveTemplate config={config} />,
}
