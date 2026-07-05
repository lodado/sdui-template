import React, { useState } from 'react'

/**
 * Interactive teaching diagram for `projectNestedBlockDrop`.
 *
 * A fixed sample tree is shown flattened. The learner drops a block onto the
 * "Configuration" row and picks a vertical zone; the diagram mirrors the exact
 * projection rules (before / inside / after + horizontal depth clamp) and shows
 * both the resulting tree position and the `block.move` patch it produces.
 */

type Zone = 'before' | 'inside' | 'after'

interface SampleRow {
  id: string
  label: string
  depth: number
}

/** Flattened sample document. `C` (Configuration) is the drop target. */
const SAMPLE: SampleRow[] = [
  { id: 'A', label: 'Getting started', depth: 0 },
  { id: 'B', label: 'Installation', depth: 1 },
  { id: 'C', label: 'Configuration', depth: 1 },
  { id: 'D', label: 'API reference', depth: 0 },
]

const OVER = SAMPLE[2] // Configuration, depth 1
const MAX_DEPTH = OVER.depth + 1 // become child of C → 2
const MIN_DEPTH = 0 // next visible row (D) sits at depth 0

interface Projection {
  position: 'before' | 'inside' | 'after'
  anchorId: string
  depth: number
  note: string
}

/** Mirror of the real projection rules for the sample tree. */
function project(zone: Zone, depthAfter: number): Projection {
  if (zone === 'before') {
    return { position: 'before', anchorId: 'C', depth: OVER.depth, note: 'C의 바로 앞, 같은 깊이' }
  }
  if (zone === 'inside') {
    return { position: 'inside', anchorId: 'C', depth: OVER.depth + 1, note: 'C의 첫 자식으로 nest' }
  }
  // after-zone: horizontal depth decides the real position
  if (depthAfter === OVER.depth + 1) {
    return { position: 'inside', anchorId: 'C', depth: depthAfter, note: '오른쪽 끝 → C의 자식과 동일' }
  }
  if (depthAfter === OVER.depth) {
    return { position: 'after', anchorId: 'C', depth: depthAfter, note: 'C의 형제 (같은 깊이)' }
  }
  return { position: 'after', anchorId: 'A', depth: depthAfter, note: 'outdent → 조상 A의 형제' }
}

const ZONE_META: Record<Zone, { label: string; pct: string; color: string }> = {
  before: { label: 'before · 위 25%', pct: '< 0.25', color: '#227d9b' },
  inside: { label: 'inside · 가운데', pct: '0.25 – 0.75', color: '#1868db' },
  after: { label: 'after · 아래 25%', pct: '> 0.75', color: '#6e5dc6' },
}

const DRAGGED = { id: 'X', label: '📦 드래그 중인 블록' }

function buildResultRows(proj: Projection): Array<SampleRow & { ghost?: boolean }> {
  const dragged: SampleRow & { ghost: boolean } = { ...DRAGGED, depth: proj.depth, ghost: true }
  return SAMPLE.flatMap((row) => {
    if (row.id !== 'C') {
      return [row]
    }
    return proj.position === 'before' ? [dragged, row] : [row, dragged]
  })
}

const INDENT = 22

export const DropZoneDiagram = () => {
  const [zone, setZone] = useState<Zone>('inside')
  const [depthAfter, setDepthAfter] = useState<number>(OVER.depth)

  const proj = project(zone, depthAfter)
  const resultRows = buildResultRows(proj)

  const patch = `{
  type: 'block.move',
  blockId: 'X',
  target: { anchorId: '${proj.anchorId}', position: '${proj.position}' },
}`

  return (
    <div className="sdui-doc__dz">
      {/* left: the target row with a 3-zone ruler */}
      <div className="sdui-doc__dz-col">
        <div className="sdui-doc__dz-coltitle">1 · 어느 존에 놓을까</div>
        <p className="sdui-doc__dz-hint">
          포인터가 <strong>Configuration</strong> 행의 어디에 있느냐(세로 비율 <code>overRatio</code>)로 존이
          결정됩니다.
        </p>
        <div className="sdui-doc__dz-target">
          {(['before', 'inside', 'after'] as Zone[]).map((z) => (
            <button
              key={z}
              type="button"
              className="sdui-doc__dz-zone"
              data-active={zone === z}
              style={{ '--dz-zone': ZONE_META[z].color } as React.CSSProperties}
              onClick={() => setZone(z)}
            >
              <span className="sdui-doc__dz-zonelabel">{ZONE_META[z].label}</span>
              <span className="sdui-doc__dz-zonepct">
                overRatio {ZONE_META[z].pct}
                {z === 'inside' && <>&nbsp;→ row 본문</>}
              </span>
            </button>
          ))}
        </div>

        {zone === 'after' && (
          <div className="sdui-doc__dz-depth">
            <div className="sdui-doc__dz-coltitle">2 · 수평으로 밀어 깊이 선택</div>
            <p className="sdui-doc__dz-hint">
              after 존에서는 <strong>가로 오프셋</strong>(레벨당 24px)이 깊이를 정합니다. 범위는{' '}
              <code>
                [{MIN_DEPTH}, {MAX_DEPTH}]
              </code>{' '}
              로 clamp.
            </p>
            <div className="sdui-doc__dz-depthrow">
              <button
                type="button"
                className="sdui-doc__btn"
                disabled={depthAfter <= MIN_DEPTH}
                onClick={() => setDepthAfter((d) => Math.max(MIN_DEPTH, d - 1))}
              >
                ← outdent
              </button>
              <span className="sdui-doc__dz-depthval">depth {depthAfter}</span>
              <button
                type="button"
                className="sdui-doc__btn"
                disabled={depthAfter >= MAX_DEPTH}
                onClick={() => setDepthAfter((d) => Math.min(MAX_DEPTH, d + 1))}
              >
                nest →
              </button>
            </div>
          </div>
        )}
      </div>

      {/* right: resulting tree + patch */}
      <div className="sdui-doc__dz-col">
        <div className="sdui-doc__dz-coltitle">3 · 결과 트리</div>
        <div className="sdui-doc__dz-tree">
          {resultRows.map((row) => (
            <div
              key={row.id}
              className="sdui-doc__dz-treerow"
              data-ghost={row.ghost ? 'true' : undefined}
              data-over={row.id === 'C' ? 'true' : undefined}
              style={{ paddingLeft: 12 + row.depth * INDENT }}
            >
              <span className="sdui-doc__dz-bullet" />
              {row.label}
              {row.ghost && <span className="sdui-doc__dz-here">여기!</span>}
              {row.id === 'C' && !row.ghost && <span className="sdui-doc__dz-overtag">over</span>}
            </div>
          ))}
        </div>
        <div className="sdui-doc__dz-result">
          <span
            className="sdui-doc__dz-resultbadge"
            style={{ '--dz-zone': ZONE_META[zone].color } as React.CSSProperties}
          >
            position: {proj.position} · depth {proj.depth}
          </span>
          <span className="sdui-doc__dz-resultnote">{proj.note}</span>
        </div>
        <pre className="sdui-doc__dz-patch">{patch}</pre>
      </div>
    </div>
  )
}
