import type { PatchEnvelope, SduiDocumentContent, SequencerState } from '@lodado/sdui-document'
import {
  commitEnvelope,
  createDocumentBlock,
  createDocumentId,
  createSequencerState,
  hlcTick,
} from '@lodado/sdui-document'
import React, { useMemo, useState } from 'react'

/**
 * Live sequencer demo: two clients edit from the same (possibly stale) view and
 * the pure server sequencer decides what commits. Uses the real
 * `createSequencerState` / `commitEnvelope` from @lodado/sdui-document — no mock.
 *
 * - editing DIFFERENT blocks from a stale view both commit (block-granular)
 * - editing the SAME block with a stale expectedVersion is rejected
 */

function makeContent(): SduiDocumentContent {
  return {
    schemaVersion: '1.1',
    root: createDocumentBlock({
      id: 'root',
      type: 'root',
      children: [
        { id: 'b1', type: 'paragraph', position: 'a0', state: { text: 'hello' } },
        { id: 'b2', type: 'paragraph', position: 'a1', state: { text: 'world' } },
      ],
    }),
  }
}

type LogLine = {
  key: string
  label: string
  status: 'committed' | 'rejected' | 'duplicate'
  detail: string
}

const ACTORS = { a: 'Client A', b: 'Client B' } as const

export const PatchLogDemo = () => {
  const [state, setState] = useState<SequencerState>(() => createSequencerState(makeContent()))
  const [log, setLog] = useState<LogLine[]>([])
  const [seq, setSeq] = useState(0)
  const [clock, setClock] = useState(1000)

  const blockText = useMemo(() => {
    const map: Record<string, string> = {}
    state.content.root.children?.forEach((block) => {
      map[block.id] = String(block.state?.text ?? '')
    })
    return map
  }, [state])

  const send = (input: {
    actorId: keyof typeof ACTORS
    blockId: string
    text: string
    expectedVersion?: number
    note: string
  }) => {
    const nextClock = clock + 10
    setClock(nextClock)
    const envelope: PatchEnvelope = {
      envelopeId: `env-${seq + 1}`,
      documentId: createDocumentId('doc-demo'),
      actorId: input.actorId,
      hlc: hlcTick(null, nextClock, input.actorId),
      baseSeq: state.log.seq,
      patches: [
        {
          type: 'block.update',
          blockId: input.blockId,
          state: { text: input.text },
          ...(input.expectedVersion !== undefined ? { expectedVersion: input.expectedVersion } : {}),
        },
      ],
    }

    const result = commitEnvelope(state, envelope)
    setSeq((n) => n + 1)
    setState(result.state)

    const actor = ACTORS[input.actorId]
    if (result.status === 'committed') {
      setLog((prev) => [
        ...prev,
        {
          key: envelope.envelopeId,
          label: `#${result.committed.seq} ${actor} → ${input.blockId}`,
          status: 'committed',
          detail: input.note,
        },
      ])
    } else if (result.status === 'rejected' && result.reason === 'blockConflict') {
      const conflict = result.conflicts[0]
      setLog((prev) => [
        ...prev,
        {
          key: envelope.envelopeId,
          label: `✕ ${actor} → ${input.blockId}`,
          status: 'rejected',
          detail: `blockConflict: expected v${conflict.expectedVersion}, server v${conflict.currentVersion}`,
        },
      ])
    } else if (result.status === 'rejected') {
      setLog((prev) => [
        ...prev,
        { key: envelope.envelopeId, label: `✕ ${actor} → ${input.blockId}`, status: 'rejected', detail: result.reason },
      ])
    } else {
      setLog((prev) => [
        ...prev,
        { key: envelope.envelopeId, label: `↺ ${actor}`, status: 'duplicate', detail: 'duplicate envelopeId' },
      ])
    }
  }

  const reset = () => {
    setState(createSequencerState(makeContent()))
    setLog([])
    setSeq(0)
    setClock(1000)
  }

  const statusColor: Record<LogLine['status'], string> = {
    committed: 'var(--doc-accent-soft)',
    rejected: '#fde2e1',
    duplicate: 'var(--doc-surface-raised)',
  }

  return (
    <div style={{ display: 'grid', gap: 12 }}>
      <div style={{ display: 'grid', gap: 6 }}>
        {['b1', 'b2'].map((id) => (
          <div
            key={id}
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              gap: 12,
              padding: '10px 14px',
              borderRadius: 8,
              border: '1px solid var(--doc-border)',
              background: 'var(--doc-surface-raised)',
            }}
          >
            <code style={{ fontSize: 12, color: 'var(--doc-text-subtle)' }}>{id}</code>
            <span style={{ fontWeight: 600, fontSize: 14 }}>{blockText[id]}</span>
          </div>
        ))}
      </div>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
        <button
          className="sdui-doc__btn"
          style={{ fontSize: 12 }}
          onClick={() => send({ actorId: 'a', blockId: 'b1', text: 'A edited b1', note: 'clean commit' })}
        >
          A가 b1 편집
        </button>
        <button
          className="sdui-doc__btn"
          style={{ fontSize: 12 }}
          onClick={() =>
            send({ actorId: 'b', blockId: 'b2', text: 'B edited b2', note: 'stale view, 다른 블록 → 커밋' })
          }
        >
          B가 b2 편집 (stale, 다른 블록)
        </button>
        <button
          className="sdui-doc__btn"
          style={{ fontSize: 12 }}
          onClick={() =>
            send({
              actorId: 'b',
              blockId: 'b1',
              text: 'B edited b1',
              expectedVersion: 0,
              note: '같은 블록 stale → 거부',
            })
          }
        >
          B가 b1 편집 (stale v0 → 충돌)
        </button>
        <button className="sdui-doc__btn" style={{ fontSize: 12 }} onClick={reset}>
          리셋
        </button>
      </div>

      <div style={{ display: 'grid', gap: 4 }}>
        <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--doc-text-subtle)' }}>DocumentLog (seq 순)</span>
        {log.length === 0 ? (
          <span style={{ fontSize: 12, color: 'var(--doc-text-subtle)' }}>
            버튼을 눌러 두 클라이언트의 편집을 서버 sequencer에 보내보세요. seq는 서버가 부여합니다.
          </span>
        ) : (
          log.map((line) => (
            <div
              key={line.key}
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                gap: 12,
                padding: '6px 12px',
                borderRadius: 6,
                fontSize: 12,
                background: statusColor[line.status],
              }}
            >
              <code>{line.label}</code>
              <span style={{ color: 'var(--doc-text-subtle)' }}>{line.detail}</span>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
