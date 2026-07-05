'use client'

import type { ComponentFactory, SduiLayoutDocument } from '@lodado/sdui-template'
import {
  normalizeSduiLayout,
  SduiLayoutRenderer,
  SduiLayoutStateInspector,
  useRenderNode,
  useSduiLayoutAction,
  useSduiNodeReference,
  useSduiNodeSubscription,
} from '@lodado/sdui-template'
import React, { useRef, useState } from 'react'

/* ------------------------------------------------------------------ shared */

/** Container factory — renders its children through the render-props hook. */
const ContainerView = ({ nodeId, parentPath }: { nodeId: string; parentPath?: string[] }) => {
  const { childrenIds } = useSduiNodeSubscription({ nodeId })
  const { renderChildren } = useRenderNode({ nodeId, parentPath })
  return <div style={{ display: 'grid', gap: 10 }}>{renderChildren(childrenIds)}</div>
}
const containerFactory: ComponentFactory = (id, parentPath) => <ContainerView nodeId={id} parentPath={parentPath} />

/** A card that reports how many times it has re-rendered. */
const CounterCardView = ({ nodeId }: { nodeId: string }) => {
  const { state } = useSduiNodeSubscription({ nodeId })
  const renders = useRef(0)
  renders.current += 1
  const label = String(state.label ?? nodeId)
  const count = Number(state.count ?? 0)
  return (
    <div className="sdui-doc__srd-card">
      <div className="sdui-doc__srd-cardhead">
        <span className="sdui-doc__srd-label">{label}</span>
        <span className="sdui-doc__srd-renders" data-hot={renders.current > 1 ? 'true' : undefined}>
          렌더 {renders.current}회
        </span>
      </div>
      <div className="sdui-doc__srd-count">count: {count}</div>
    </div>
  )
}
const counterFactory: ComponentFactory = (id) => <CounterCardView nodeId={id} />

/* ----------------------------------------------- 1 · selective re-render */

const SUB_CARDS = ['card-a', 'card-b', 'card-c']

const subscriptionDoc: SduiLayoutDocument = {
  version: '1.0.0',
  metadata: { id: 'subscription-demo', name: 'Subscription demo' },
  root: {
    id: 'sub-root',
    type: 'Container',
    children: SUB_CARDS.map((id, i) => ({
      id,
      type: 'CounterCard',
      state: { label: `카드 ${String.fromCharCode(65 + i)}`, count: 0 },
    })),
  },
}

const SubscriptionControls = () => {
  const store = useSduiLayoutAction()
  const bump = (id: string) => {
    const current = Number(store.getNodeById(id).state?.count ?? 0)
    store.updateNodeState(id, { count: current + 1 })
  }
  return (
    <div className="sdui-doc__toolbar" style={{ marginTop: 12, marginBottom: 0 }}>
      {SUB_CARDS.map((id) => (
        <button key={id} type="button" className="sdui-doc__btn sdui-doc__btn--primary" onClick={() => bump(id)}>
          {id} +1
        </button>
      ))}
    </div>
  )
}

const subscriptionComponents = { Container: containerFactory, CounterCard: counterFactory }

/**
 * Bumping one card's state calls `store.updateNodeState(id, …)` which notifies
 * only that node's subscribers — the other cards keep their render count.
 */
export const SduiSubscriptionDemo = () => (
  <div>
    <SduiLayoutRenderer document={subscriptionDoc} components={subscriptionComponents}>
      <SubscriptionControls />
    </SduiLayoutRenderer>
    <p className="sdui-doc__srd-note">
      한 카드를 +1 하면 <strong>그 카드만</strong> 렌더 횟수가 오릅니다. 나머지는 구독이 걸리지 않아 그대로 — ID 기반
      선택적 리렌더.
    </p>
  </div>
)

/* --------------------------------------------------------- 2 · normalize */

const normalizeSample: SduiLayoutDocument = {
  version: '1.0.0',
  metadata: { id: 'normalize-sample', name: 'Normalize sample' },
  root: {
    id: 'root',
    type: 'Container',
    children: [
      { id: 'title', type: 'Title', state: { text: 'Dashboard' } },
      {
        id: 'row',
        type: 'Container',
        children: [
          { id: 'chart', type: 'Chart', state: { kind: 'bar' } },
          { id: 'badge', type: 'Badge', state: { label: 'live' } },
        ],
      },
    ],
  },
}

export const SduiNormalizeDemo = () => {
  const [view, setView] = useState<'nested' | 'flat'>('nested')
  const { entities } = normalizeSduiLayout(normalizeSample)

  const nestedJson = JSON.stringify(normalizeSample.root, null, 2)
  const flatJson = JSON.stringify(entities.nodes, null, 2)

  return (
    <div>
      <div className="sdui-doc__statechips" style={{ marginBottom: 12 }}>
        <button
          type="button"
          className="sdui-doc__statechip"
          data-active={view === 'nested'}
          onClick={() => setView('nested')}
        >
          중첩 트리 (입력)
        </button>
        <span className="sdui-doc__statechip-sep">→ normalizeSduiLayout →</span>
        <button
          type="button"
          className="sdui-doc__statechip"
          data-active={view === 'flat'}
          onClick={() => setView('flat')}
        >
          평탄한 nodes 맵 (출력)
        </button>
      </div>
      <pre className="sdui-doc__log" style={{ maxHeight: 340 }}>
        {view === 'nested' ? nestedJson : flatJson}
      </pre>
      <p className="sdui-doc__srd-note">
        {view === 'nested'
          ? '중첩된 children 배열. 사람이 쓰기 쉽지만 특정 노드 조회는 트리 순회가 필요합니다.'
          : 'id → 노드 맵 + childrenIds 로 평탄화. 어떤 노드든 O(1) 조회, 구독도 id 단위로 가능해집니다.'}
      </p>
    </div>
  )
}

/* --------------------------------------------------------- 3 · reference */

/** Mirror reads a *referenced* node's state via useSduiNodeReference. */
const MirrorCardView = ({ nodeId }: { nodeId: string }) => {
  const { referencedNodesMap, reference } = useSduiNodeReference({ nodeId })
  const renders = useRef(0)
  renders.current += 1
  const sourceId = Array.isArray(reference) ? reference[0] : reference
  const sourceCount = sourceId ? Number(referencedNodesMap[sourceId]?.state.count ?? 0) : 0
  return (
    <div className="sdui-doc__srd-card" data-variant="mirror">
      <div className="sdui-doc__srd-cardhead">
        <span className="sdui-doc__srd-label">🔗 거울 (reference: {String(sourceId)})</span>
        <span className="sdui-doc__srd-renders" data-hot={renders.current > 1 ? 'true' : undefined}>
          렌더 {renders.current}회
        </span>
      </div>
      <div className="sdui-doc__srd-count">원본 count 따라감: {sourceCount}</div>
    </div>
  )
}
const mirrorFactory: ComponentFactory = (id) => <MirrorCardView nodeId={id} />

const referenceDoc: SduiLayoutDocument = {
  version: '1.0.0',
  metadata: { id: 'reference-demo', name: 'Reference demo' },
  root: {
    id: 'ref-root',
    type: 'Container',
    children: [
      { id: 'source', type: 'CounterCard', state: { label: '원본 노드 (source)', count: 0 } },
      { id: 'mirror', type: 'MirrorCard', reference: 'source' },
    ],
  },
}

const ReferenceControls = () => {
  const store = useSduiLayoutAction()
  const bump = () => {
    const current = Number(store.getNodeById('source').state?.count ?? 0)
    store.updateNodeState('source', { count: current + 1 })
  }
  return (
    <div className="sdui-doc__toolbar" style={{ marginTop: 12, marginBottom: 0 }}>
      <button type="button" className="sdui-doc__btn sdui-doc__btn--primary" onClick={bump}>
        원본 source +1
      </button>
    </div>
  )
}

const referenceComponents = { Container: containerFactory, CounterCard: counterFactory, MirrorCard: mirrorFactory }

/**
 * The mirror node never holds the count — it subscribes to the referenced
 * `source` node and re-renders when source changes.
 */
export const SduiReferenceDemo = () => (
  <div>
    <SduiLayoutRenderer document={referenceDoc} components={referenceComponents}>
      <ReferenceControls />
    </SduiLayoutRenderer>
    <p className="sdui-doc__srd-note">
      거울 노드는 값을 저장하지 않습니다. <code>reference: &apos;source&apos;</code> 로 원본을 구독하다가 원본이 바뀌면
      함께 리렌더 — 노드 간 파생 상태.
    </p>
  </div>
)

/* --------------------------------------------------------- 4 · inspector */

const inspectorDoc: SduiLayoutDocument = {
  version: '1.0.0',
  metadata: { id: 'renderer-inspector', name: 'Renderer inspector' },
  root: {
    id: 'insp-root',
    type: 'Container',
    children: [
      { id: 'insp-a', type: 'CounterCard', state: { label: '노드 A', count: 0 } },
      { id: 'insp-b', type: 'CounterCard', state: { label: '노드 B', count: 0 } },
    ],
  },
}

const inspectorComponents = { Container: containerFactory, CounterCard: counterFactory }

/**
 * Node bumps use updateNodeState (notifyNode) — invisible to the version-
 * subscribed inspector. The version button uses updateVariable (notifyVersion)
 * which forces the inspector to re-read the whole store.
 */
const InspectorControls = () => {
  const store = useSduiLayoutAction()
  const bump = (id: string) => {
    const current = Number(store.getNodeById(id).state?.count ?? 0)
    store.updateNodeState(id, { count: current + 1 })
  }
  const bumpVersion = () => {
    const synced = Number((store.state.variables?.inspectorSyncedAt as number) ?? 0)
    store.updateVariable('inspectorSyncedAt', synced + 1)
  }
  return (
    <div className="sdui-doc__toolbar" style={{ marginTop: 0, marginBottom: 12 }}>
      <button type="button" className="sdui-doc__btn" onClick={() => bump('insp-a')}>
        노드 A +1 (notifyNode)
      </button>
      <button type="button" className="sdui-doc__btn" onClick={() => bump('insp-b')}>
        노드 B +1 (notifyNode)
      </button>
      <button type="button" className="sdui-doc__btn sdui-doc__btn--primary" onClick={bumpVersion}>
        버전 갱신 (notifyVersion ↑)
      </button>
    </div>
  )
}

/**
 * Demonstrates the two-channel subscription model: per-node edits do not move
 * the version-subscribed inspector until a version-level change flushes it.
 */
export const SduiInspectorDemo = () => (
  <div>
    <SduiLayoutRenderer document={inspectorDoc} components={inspectorComponents}>
      <InspectorControls />
      <SduiLayoutStateInspector title="Live SduiLayoutStore" defaultView="nodes" maxHeight={360} />
    </SduiLayoutRenderer>
    <p className="sdui-doc__srd-note">
      <strong>노드 +1</strong> 은 카드 count만 올리고 인스펙터는 그대로입니다(notifyNode → 버전 구독자 안 깨움).{' '}
      <strong>버전 갱신</strong> 을 누르면 그제서야 인스펙터가 전체를 다시 읽어 그동안의 변화가 한꺼번에 반영됩니다.
    </p>
  </div>
)
