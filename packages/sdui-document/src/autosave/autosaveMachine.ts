export type AutosaveStatus = 'idle' | 'dirty' | 'saving' | 'saved' | 'failed' | 'offline';

export type AutosaveState = {
  status: AutosaveStatus;
  localVersion: number;
  acknowledgedVersion: number;
  pendingPatchCount: number;
  error?: string;
};

export type AutosaveEvent =
  | { type: 'local.change'; patchCount?: number }
  | { type: 'save.request' }
  | { type: 'save.success'; acknowledgedVersion: number }
  | { type: 'save.failure'; error: string }
  | { type: 'network.offline' }
  | { type: 'network.online' };

export function createInitialAutosaveState(): AutosaveState {
  return {
    status: 'idle',
    localVersion: 0,
    acknowledgedVersion: 0,
    pendingPatchCount: 0,
  };
}

function hasPendingChanges(state: AutosaveState): boolean {
  return state.pendingPatchCount > 0 || state.localVersion > state.acknowledgedVersion;
}

export function reduceAutosaveState(state: AutosaveState, event: AutosaveEvent): AutosaveState {
  switch (event.type) {
    case 'local.change':
      return {
        ...state,
        status: state.status === 'offline' ? 'offline' : 'dirty',
        localVersion: state.localVersion + 1,
        pendingPatchCount: state.pendingPatchCount + (event.patchCount ?? 1),
        error: undefined,
      };
    case 'save.request':
      return hasPendingChanges(state) && state.status !== 'offline'
        ? { ...state, status: 'saving', error: undefined }
        : state;
    case 'save.success':
      if (event.acknowledgedVersion < state.localVersion) {
        return state;
      }

      return {
        ...state,
        status: 'saved',
        acknowledgedVersion: event.acknowledgedVersion,
        pendingPatchCount: 0,
        error: undefined,
      };
    case 'save.failure':
      return {
        ...state,
        status: 'failed',
        error: event.error,
      };
    case 'network.offline':
      return {
        ...state,
        status: 'offline',
      };
    case 'network.online':
      return {
        ...state,
        status: hasPendingChanges(state) ? 'dirty' : 'idle',
      };
    default:
      return state;
  }
}
