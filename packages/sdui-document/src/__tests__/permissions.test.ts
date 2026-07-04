import {
  canPerformDocumentAction,
  getDocumentAccessMode,
  type SduiDocumentActor,
} from '../index';

describe('document permission policy', () => {
  it('allows workspace admins to perform privileged actions', () => {
    const actor: SduiDocumentActor = { id: 'admin', workspaceRole: 'admin' };

    expect(canPerformDocumentAction({ actor, action: 'delete' })).toMatchObject({ allowed: true });
    expect(getDocumentAccessMode({ actor })).toBe('editable');
  });

  it('treats viewers as read-only users', () => {
    const actor: SduiDocumentActor = {
      id: 'viewer',
      workspaceRole: 'member',
      collectionRole: 'viewer',
    };

    expect(canPerformDocumentAction({ actor, action: 'read' })).toMatchObject({ allowed: true });
    expect(canPerformDocumentAction({ actor, action: 'update' })).toMatchObject({
      allowed: false,
      readOnly: true,
    });
    expect(getDocumentAccessMode({ actor })).toBe('readOnly');
  });

  it('allows editors to update, create child documents, and comment', () => {
    const actor: SduiDocumentActor = {
      id: 'editor',
      workspaceRole: 'member',
      collectionRole: 'editor',
    };

    expect(canPerformDocumentAction({ actor, action: 'update' })).toMatchObject({ allowed: true });
    expect(canPerformDocumentAction({ actor, action: 'createChild' })).toMatchObject({ allowed: true });
    expect(canPerformDocumentAction({ actor, action: 'comment' })).toMatchObject({ allowed: true });
  });

  it('denies guests without an explicit document or collection role', () => {
    const actor: SduiDocumentActor = { id: 'guest', workspaceRole: 'guest' };

    expect(canPerformDocumentAction({ actor, action: 'read' })).toMatchObject({
      allowed: false,
      reason: 'permission_denied',
    });
    expect(getDocumentAccessMode({ actor })).toBe('none');
  });

  it('lets a document editor override collection viewer access', () => {
    const actor: SduiDocumentActor = {
      id: 'doc-editor',
      workspaceRole: 'member',
      collectionRole: 'viewer',
      documentRole: 'editor',
    };

    expect(canPerformDocumentAction({ actor, action: 'update' })).toMatchObject({ allowed: true });
    expect(getDocumentAccessMode({ actor })).toBe('editable');
  });
});
