import { type AutosaveState,createInitialAutosaveState, reduceAutosaveState } from '@lodado/sdui-document'

export type AutosaveStatus = 'dirty' | 'saving' | 'failed' | 'offline' | 'saved'

export function buildAutosaveState(status: AutosaveStatus): AutosaveState {
  const dirty = reduceAutosaveState(createInitialAutosaveState(), { type: 'local.change', patchCount: 2 })

  if (status === 'dirty') {
    return dirty
  }

  if (status === 'saving') {
    return reduceAutosaveState(dirty, { type: 'save.request' })
  }

  if (status === 'failed') {
    return reduceAutosaveState(reduceAutosaveState(dirty, { type: 'save.request' }), {
      type: 'save.failure',
      error: 'network_error',
    })
  }

  if (status === 'offline') {
    return reduceAutosaveState(dirty, { type: 'network.offline' })
  }

  return reduceAutosaveState(reduceAutosaveState(dirty, { type: 'save.request' }), {
    type: 'save.success',
    acknowledgedVersion: 1,
  })
}
