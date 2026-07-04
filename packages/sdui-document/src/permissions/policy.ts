import type { SduiDocumentAccessMode, SduiDocumentAction } from './actions';

export type SduiWorkspaceRole = 'admin' | 'member' | 'guest';
export type SduiCollectionRole = 'manager' | 'editor' | 'viewer';
export type SduiDocumentRole = 'editor' | 'viewer';

export type SduiDocumentActor = {
  id: string;
  workspaceRole: SduiWorkspaceRole;
  collectionRole?: SduiCollectionRole;
  documentRole?: SduiDocumentRole;
};

export type SduiDocumentPermissionInput = {
  actor: SduiDocumentActor;
  action: SduiDocumentAction;
};

export type SduiDocumentAccessInput = {
  actor: SduiDocumentActor;
};

export type SduiDocumentPermissionDecision = {
  allowed: boolean;
  readOnly?: boolean;
  reason?: 'permission_denied';
};

const WRITE_ACTIONS = new Set<SduiDocumentAction>([
  'update',
  'createChild',
  'move',
  'archive',
  'delete',
  'restore',
]);

function deny(): SduiDocumentPermissionDecision {
  return {
    allowed: false,
    reason: 'permission_denied',
  };
}

function allowIf(allowed: boolean): SduiDocumentPermissionDecision {
  return allowed ? { allowed: true } : deny();
}

function isAdmin(actor: SduiDocumentActor): boolean {
  return actor.workspaceRole === 'admin';
}

function canRead(actor: SduiDocumentActor): boolean {
  return isAdmin(actor) || Boolean(actor.collectionRole) || Boolean(actor.documentRole);
}

function canWrite(actor: SduiDocumentActor): boolean {
  return (
    isAdmin(actor) ||
    actor.collectionRole === 'manager' ||
    actor.collectionRole === 'editor' ||
    actor.documentRole === 'editor'
  );
}

function canShare(actor: SduiDocumentActor): boolean {
  return isAdmin(actor) || actor.collectionRole === 'manager';
}

export function canPerformDocumentAction(
  input: SduiDocumentPermissionInput
): SduiDocumentPermissionDecision {
  const { actor, action } = input;

  if (action === 'read' || action === 'downloadAttachment') {
    return allowIf(canRead(actor));
  }

  if (action === 'comment') {
    return allowIf(canRead(actor));
  }

  if (action === 'share') {
    return allowIf(canShare(actor));
  }

  if (WRITE_ACTIONS.has(action)) {
    const allowed = canWrite(actor);
    return {
      allowed,
      readOnly: !allowed && canRead(actor) ? true : undefined,
      reason: allowed ? undefined : 'permission_denied',
    };
  }

  return deny();
}

export function getDocumentAccessMode(input: SduiDocumentAccessInput): SduiDocumentAccessMode {
  if (canPerformDocumentAction({ actor: input.actor, action: 'update' }).allowed) {
    return 'editable';
  }

  if (canPerformDocumentAction({ actor: input.actor, action: 'read' }).allowed) {
    return 'readOnly';
  }

  return 'none';
}
