import type { Meta, StoryObj } from '@storybook/react-vite'
import React from 'react'

import { type DeepDiveConfig, DeepDiveTemplate, type Principle } from '../components'
import { PatchLogDemo } from '../demos/PatchLogDemo'

const meta: Meta = {
  title: 'Document/Deep Dive/26 · 협업 패치 로그 (Event Sourcing)',
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          '편집을 append-only 로그의 이벤트로 다루는 이벤트소싱 협업 코어(R3). HLC 시계, PatchEnvelope 전송, 서버 sequencer의 블록단위 충돌 판정, 스냅샷 재생, 클라이언트 outbox rebase.',
      },
    },
  },
}

export default meta
type Story = StoryObj

const STEPS: Principle[] = [
  {
    num: '01',
    title: '봉투로 감싸기',
    body: (
      <>
        클라이언트는 패치 배치를 <code>PatchEnvelope</code> 로 감쌉니다 — <code>hlc</code> 시계, 자신이 본 마지막{' '}
        <code>baseSeq</code>, 원자적 <code>patches</code> 를 함께 실어 인과관계를 전달합니다.
      </>
    ),
  },
  {
    num: '02',
    title: '서버가 seq 부여',
    body: (
      <>
        순수 <code>sequencer</code> 가 유일한 writer입니다. 봉투를 받아 블록단위 충돌을 판정하고, 통과하면 append-only{' '}
        <code>DocumentLog</code> 에 붙이며 <strong>서버가 seq를 부여</strong>합니다 — 순서의 유일한 권위.
      </>
    ),
  },
  {
    num: '03',
    title: '클라이언트 rebase',
    body: (
      <>
        클라이언트 <code>outbox</code> 는 로컬 편집을 낙관적으로 적용하고 inverse를 저장합니다. 원격 로그가 도착하면
        pending을 역순 롤백 → 원격을 seq순 적용 → 로컬을 새 기반 위에 재적용합니다.
      </>
    ),
    wide: true,
  },
]

const ENVELOPE_CODE = `// 클라이언트가 보내는 원자적 변경 단위 + 인과 메타데이터
type PatchEnvelope = {
  envelopeId: string        // 재시도 멱등키 (호출자 생성)
  documentId: SduiDocumentId
  actorId: string
  hlc: HlcTimestamp         // 오프라인/로컬 순서·감사용 (merge 권위 아님)
  baseSeq: number           // "내가 본 마지막 seq" = 인과정보
  patches: SduiDocumentPatch[]
}
// 서버가 수락하면 seq를 찍어 CommittedPatchEnvelope 가 된다
type CommittedPatchEnvelope = PatchEnvelope & { seq: number }`

const SEQUENCER_CODE = `// 순수 서버 sequencer — 단일 writer, R3 충돌 정책
function commitEnvelope(state, envelope): CommitEnvelopeResult {
  // 1. 같은 envelopeId 재전송 → 멱등 응답 (재시도 안전)
  if (dup) return { status: 'duplicate', ... }

  // 2. expectedVersion 충돌 → 봉투 전체 거부 (원자적 배치)
  const conflicts = detectVersionConflicts({ versions, patches })
  if (conflicts.length) return { status: 'rejected', reason: 'blockConflict', ... }

  // 3. 적용 시도. 대상 블록이 동시 삭제됐으면 throw → applyFailed
  try {
    const content  = applyDocumentPatches(state.content, patches)
    const versions = bumpBlockVersions(state.versions, patches)
    const { log, committed } = appendToLog(state.log, envelope)  // ← seq 부여
    return { status: 'committed', state: { content, versions, log }, committed }
  } catch (error) {
    return { status: 'rejected', reason: 'applyFailed', error, ... }
  }
}
// stale baseSeq 자체는 거부 사유가 아니다 — 충돌은 블록 단위`

const PRESENCE_CODE = `// packages/sdui-document/src/collaboration/presence.ts
upsertPresence(list, {
  documentId,
  userId,
  blockId,
  status: 'editing',
  lastActiveAt,
})

prunePresence(list, nowIso, ttlMs)
getBlockEditors(list, blockId)`

const config: DeepDiveConfig = {
  accent: 'core',
  kicker: 'Deep Dive · @lodado/sdui-document',
  title: '협업 패치 로그 · 이벤트소싱 코어',
  lead: '편집을 append-only 로그의 이벤트로 다룹니다. 순수 서버 sequencer가 봉투를 받아 블록단위로 충돌을 판정하고 seq를 부여하며, 클라이언트 outbox는 낙관적 편집을 원격 로그 위로 rebase합니다. 순서의 유일한 권위는 서버 seq — HLC는 오프라인 순서·감사용 메타.',
  pills: ['HLC', 'PatchEnvelope', 'DocumentLog', 'sequencer', 'outbox rebase', 'snapshot/replay'],
  steps: STEPS,
  stepsIntro: '봉투 → 서버 seq 부여 → 클라이언트 rebase. 세 단계가 오프라인 편집과 동시 편집을 재인덱싱 없이 합칩니다.',
  sections: [
    {
      index: '26.1',
      label: 'Why',
      title: '왜 seq가 권위이고 HLC가 아닌가',
      blocks: [
        {
          kind: 'prose',
          body: (
            <>
              모든 편집은 <strong>append-only 로그</strong>의 이벤트입니다. 순서의 유일한 권위는 서버가 append 시점에
              부여하는 <code>seq</code> 이며, 클라이언트 타임스탬프에서 파생되지 않습니다. <code>HlcTimestamp</code>{' '}
              (Hybrid Logical Clock)는 오프라인/로컬 편집의 순서와 감사 표시용 메타일 뿐, merge 권위가 아닙니다 — 물리
              시간이 뒤로 흘러도 <code>counter</code> 로 단조 증가를 보장하고 <code>actorId</code> 로 전순서를 만듭니다.
            </>
          ),
        },
        {
          kind: 'callout',
          icon: '◆',
          body: (
            <>
              <strong>baseSeq</strong> 는 &ldquo;클라이언트가 본 마지막 seq&rdquo;입니다 — 단순 타임스탬프가 나를 수
              없는 <em>인과정보</em>. 이 덕분에 두 사람이 같은 stale view에서 <strong>다른 블록</strong>을 고치면 둘 다
              커밋되고(Figma식), <strong>같은 블록</strong>을 고칠 때만 충돌로 거부됩니다.
            </>
          ),
        },
        { kind: 'code', file: 'collaboration/envelope.ts', code: ENVELOPE_CODE },
      ],
    },
    {
      index: '26.2',
      label: 'Live',
      title: '서버 sequencer: 두 클라이언트 동시 편집',
      blocks: [
        {
          kind: 'prose',
          body: (
            <>
              아래는 실제 <code>createSequencerState</code> · <code>commitEnvelope</code> 을 그대로 돌립니다. Client A가
              b1을 커밋한 뒤, Client B가 <strong>stale view</strong>(baseSeq=0)에서 편집을 보냅니다. 다른 블록(b2)이면
              커밋되고, 같은 블록(b1)을 낡은 <code>expectedVersion</code> 으로 고치면 <code>blockConflict</code> 로
              거부됩니다.
            </>
          ),
        },
        {
          kind: 'demo',
          title: 'Server sequencer 시뮬레이션',
          hint: '서버가 seq 부여 · 블록단위 충돌 판정 (실제 코어 코드)',
          node: <PatchLogDemo />,
        },
        { kind: 'code', file: 'collaboration/sequencer.ts', code: SEQUENCER_CODE },
      ],
    },
    {
      index: '26.3',
      label: 'Client',
      title: 'Outbox: 낙관적 편집 + rebase',
      blocks: [
        {
          kind: 'prose',
          body: (
            <>
              클라이언트 <code>outbox</code> 는 로컬 편집을 즉시 화면에 반영하고(<code>stageLocalEdit</code>), 각 편집의
              inverse를 pending에 저장합니다. 원격 엔트리가 도착하면 <code>reconcileRemote</code> 가 rebase합니다:
              pending을 역순으로 롤백 → 원격 패치를 seq순으로 적용 → 남은 로컬 편집을 새 기반 위에 재적용(inverse
              재계산). 서버가 돌려준 <strong>자기 자신의 봉투</strong>는 ack로 처리해 이중 적용을 막습니다.
            </>
          ),
        },
        {
          kind: 'callout',
          icon: '▲',
          body: (
            <>
              재적용 중 대상 블록이 원격에서 삭제돼 더 이상 적용 불가한 로컬 편집은 <strong>조용히 삼키지 않고</strong>{' '}
              <code>dropped</code> 로 반환됩니다 — 호출자(React 레이어)가 사용자에게 알려야 합니다.
            </>
          ),
        },
        {
          kind: 'badges',
          items: [
            'stageLocalEdit',
            'acknowledgeCommit',
            'reconcileRemote',
            'applyDocumentPatchesWithInverse',
            'dropped 보고',
          ],
        },
      ],
    },
    {
      index: '26.4',
      label: 'Scale',
      title: '스냅샷 + 재생으로 로그 비용 제한',
      blocks: [
        {
          kind: 'prose',
          body: (
            <>
              로그가 무한히 자라지 않도록 <code>DocumentSnapshot</code> 이 특정 seq의 상태를 물질화합니다:{' '}
              <code>state(N) = replayFromSnapshot(snapshot(K), entries K+1..N)</code>. 재생은{' '}
              <code>applyDocumentPatches</code> 가 순수 리듀서라 결정론적이고, <code>compactLog</code> 는 스냅샷 이후
              오래된 엔트리를 버리되 seq 카운터는 절대 되돌리지 않습니다.
            </>
          ),
        },
        {
          kind: 'badges',
          items: [
            'createDocumentLog',
            'appendToLog',
            'entriesSince',
            'createSnapshot',
            'replayFromSnapshot',
            'compactLog',
          ],
        },
        {
          kind: 'callout',
          icon: '◆',
          body: (
            <>
              전부 <code>packages/sdui-document/src/collaboration/</code> 의 순수 함수입니다 — I/O·wall-clock 없음(물리
              시간은 파라미터 주입). 영속·전송은 어댑터 계약(<strong>8번 문서</strong>)이 코어 밖에서 담당합니다.
            </>
          ),
        },
      ],
    },
    {
      index: '26.5',
      label: 'Presence',
      title: 'Presence는 로그가 아니라 TTL 상태',
      blocks: [
        {
          kind: 'prose',
          body: (
            <>
              패치 로그는 영구 이벤트지만 presence는 “지금 누가 어느 블록을 보고/편집 중인가”를 나타내는 휘발성
              상태입니다. 같은 사용자·문서 조합은 <code>upsertPresence</code> 로 덮어쓰고, 오래된 항목은{' '}
              <code>prunePresence</code> 로 제거합니다. 충돌 판정 권위는 여전히 sequencer와 block version에 있고,
              presence는 UI 힌트로만 씁니다.
            </>
          ),
        },
        { kind: 'code', file: 'collaboration/presence.ts', code: PRESENCE_CODE },
      ],
    },
  ],
}

export const CollaborationPatchLog: Story = {
  name: '협업 패치 로그 (Event Sourcing)',
  render: () => <DeepDiveTemplate config={config} />,
}
