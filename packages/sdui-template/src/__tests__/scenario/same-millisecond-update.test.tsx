import { SduiLayoutStore } from '../../store/SduiLayoutStore'

/**
 * Regression: lastModified was a bare ISO timestamp (millisecond resolution),
 * so two mutations landing in the SAME millisecond produced an identical
 * useSyncExternalStore snapshot — the re-render was silently dropped
 * (flaky button.sdui.test failures under load).
 *
 * The snapshot value must change on EVERY mutation, regardless of clock
 * resolution.
 */
describe('lastModified snapshot uniqueness', () => {
  function createStore(): SduiLayoutStore {
    return new SduiLayoutStore({
      rootId: 'node-1',
      nodes: {
        'node-1': { id: 'node-1', type: 'Div', state: { value: 0 }, childrenIds: [] },
      },
    })
  }

  it('same-millisecond consecutive updates produce distinct snapshot values', () => {
    const store = createStore()

    store.updateNodeState('node-1', { value: 1 })
    const first = store.getSnapshot()['node-1']
    store.updateNodeState('node-1', { value: 2 })
    const second = store.getSnapshot()['node-1']

    expect(typeof first).toBe('string')
    expect(second).not.toBe(first)
  })

  it('a rapid burst of updates never repeats a snapshot value', () => {
    const store = createStore()

    const seen = new Set<string>()
    for (let i = 0; i < 50; i += 1) {
      store.updateNodeState('node-1', { value: i })
      seen.add(store.getSnapshot()['node-1'])
    }

    expect(seen.size).toBe(50)
  })
})
