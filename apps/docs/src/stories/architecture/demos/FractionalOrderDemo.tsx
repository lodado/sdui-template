import { generatePositionBetween, generatePositions } from '@lodado/sdui-document'
import React, { useMemo, useState } from 'react'

interface OrderedItem {
  id: string
  label: string
  position: string
}

function seed(): OrderedItem[] {
  const positions = generatePositions(null, null, 3)
  return ['A', 'B', 'C'].map((label, i) => ({
    id: label.toLowerCase(),
    label: `블록 ${label}`,
    position: positions[i],
  }))
}

/**
 * Fractional indexing: inserting between two siblings mints a new key strictly
 * between their positions — neighbors keep their keys, so an insert is a single
 * block.insert with no reindex, and concurrent inserts never collide.
 */
export const FractionalOrderDemo = () => {
  const [items, setItems] = useState<OrderedItem[]>(seed)
  const [counter, setCounter] = useState(0)

  const sorted = useMemo(() => [...items].sort((a, b) => (a.position < b.position ? -1 : 1)), [items])

  const insertBetween = (index: number) => {
    const before = sorted[index]?.position ?? null
    const after = sorted[index + 1]?.position ?? null
    const position = generatePositionBetween(before, after)
    const n = counter + 1
    setCounter(n)
    setItems((prev) => [...prev, { id: `new-${n}`, label: `삽입 #${n}`, position }])
  }

  return (
    <div style={{ display: 'grid', gap: 4 }}>
      {sorted.map((item, index) => (
        <React.Fragment key={item.id}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: 12,
              padding: '10px 14px',
              borderRadius: 8,
              border: '1px solid var(--doc-border)',
              background: item.id.startsWith('new-') ? 'var(--doc-accent-soft)' : 'var(--doc-surface-raised)',
            }}
          >
            <span style={{ fontWeight: 600, fontSize: 14 }}>{item.label}</span>
            <code style={{ fontSize: 12, color: 'var(--doc-text-subtle)' }}>position: {item.position}</code>
          </div>
          {index < sorted.length - 1 && (
            <button
              className="sdui-doc__btn"
              style={{ justifySelf: 'center', fontSize: 12, padding: '3px 12px' }}
              onClick={() => insertBetween(index)}
            >
              ↓ 여기에 삽입 (사이 키 생성)
            </button>
          )}
        </React.Fragment>
      ))}
    </div>
  )
}
