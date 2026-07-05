import {
  type AutosaveEvent,
  type AutosaveState,
  type AutosaveStatus,
  createInitialAutosaveState,
  reduceAutosaveState,
} from '@lodado/sdui-document'
import React, { useState } from 'react'

const STATUSES: AutosaveStatus[] = ['idle', 'dirty', 'saving', 'saved', 'failed', 'offline']

interface EventButton {
  label: string
  event: AutosaveEvent
  primary?: boolean
}

/**
 * reduceAutosaveState is a pure reducer — no timers, no network. Dispatch the
 * events a real autosave loop would emit and watch the status transition. The
 * status ring below is the machine's full state space.
 */
export const AutosaveDemo = () => {
  const [state, setState] = useState<AutosaveState>(createInitialAutosaveState)

  const dispatch = (event: AutosaveEvent) => setState((s) => reduceAutosaveState(s, event))

  const buttons: EventButton[] = [
    { label: 'local.change', event: { type: 'local.change', patchCount: 1 }, primary: true },
    { label: 'save.request', event: { type: 'save.request' } },
    { label: 'save.success', event: { type: 'save.success', acknowledgedVersion: state.localVersion } },
    { label: 'save.failure', event: { type: 'save.failure', error: '네트워크 오류' } },
    { label: 'network.offline', event: { type: 'network.offline' } },
    { label: 'network.online', event: { type: 'network.online' } },
  ]

  return (
    <div style={{ display: 'grid', gap: 16 }}>
      <div className="sdui-doc__statechips">
        {STATUSES.map((status, i) => (
          <React.Fragment key={status}>
            {i > 0 && <span className="sdui-doc__statechip-sep">·</span>}
            <span className="sdui-doc__statechip" data-active={state.status === status}>
              {status}
            </span>
          </React.Fragment>
        ))}
      </div>

      <div className="sdui-doc__toolbar" style={{ margin: 0 }}>
        {buttons.map((btn) => (
          <button
            key={btn.label}
            className={btn.primary ? 'sdui-doc__btn sdui-doc__btn--primary' : 'sdui-doc__btn'}
            onClick={() => dispatch(btn.event)}
          >
            {btn.label}
          </button>
        ))}
        <span style={{ flex: 1 }} />
        <button className="sdui-doc__btn" onClick={() => setState(createInitialAutosaveState())}>
          reset
        </button>
      </div>

      <pre className="sdui-doc__log" style={{ maxHeight: 'none' }}>
        {JSON.stringify(state, null, 2)}
      </pre>
    </div>
  )
}
