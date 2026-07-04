import { createInitialAutosaveState, reduceAutosaveState } from '../index';

describe('autosave state machine', () => {
  it('marks local changes as dirty and tracks pending patches', () => {
    const state = reduceAutosaveState(createInitialAutosaveState(), {
      type: 'local.change',
      patchCount: 2,
    });

    expect(state).toMatchObject({
      status: 'dirty',
      localVersion: 1,
      acknowledgedVersion: 0,
      pendingPatchCount: 2,
    });
  });

  it('transitions dirty changes through saving to saved', () => {
    const dirty = reduceAutosaveState(createInitialAutosaveState(), { type: 'local.change' });
    const saving = reduceAutosaveState(dirty, { type: 'save.request' });
    const saved = reduceAutosaveState(saving, {
      type: 'save.success',
      acknowledgedVersion: 1,
    });

    expect(saving.status).toBe('saving');
    expect(saved).toMatchObject({
      status: 'saved',
      acknowledgedVersion: 1,
      pendingPatchCount: 0,
    });
  });

  it('keeps newer local changes dirty while an older save succeeds', () => {
    const dirty = reduceAutosaveState(createInitialAutosaveState(), { type: 'local.change' });
    const saving = reduceAutosaveState(dirty, { type: 'save.request' });
    const editedAgain = reduceAutosaveState(saving, { type: 'local.change' });
    const staleSuccess = reduceAutosaveState(editedAgain, {
      type: 'save.success',
      acknowledgedVersion: 1,
    });

    expect(staleSuccess).toMatchObject({
      status: 'dirty',
      localVersion: 2,
      acknowledgedVersion: 0,
      pendingPatchCount: 2,
    });
  });

  it('preserves pending changes on save failure', () => {
    const dirty = reduceAutosaveState(createInitialAutosaveState(), {
      type: 'local.change',
      patchCount: 3,
    });
    const saving = reduceAutosaveState(dirty, { type: 'save.request' });
    const failed = reduceAutosaveState(saving, {
      type: 'save.failure',
      error: 'network_error',
    });

    expect(failed).toMatchObject({
      status: 'failed',
      pendingPatchCount: 3,
      error: 'network_error',
    });
  });

  it('keeps offline local changes pending and returns to dirty when online', () => {
    const offline = reduceAutosaveState(createInitialAutosaveState(), { type: 'network.offline' });
    const editedOffline = reduceAutosaveState(offline, {
      type: 'local.change',
      patchCount: 2,
    });
    const online = reduceAutosaveState(editedOffline, { type: 'network.online' });

    expect(editedOffline).toMatchObject({
      status: 'offline',
      localVersion: 1,
      pendingPatchCount: 2,
    });
    expect(online.status).toBe('dirty');
  });
});
