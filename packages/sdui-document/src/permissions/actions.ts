export type SduiDocumentAction =
  | 'read'
  | 'update'
  | 'createChild'
  | 'move'
  | 'archive'
  | 'delete'
  | 'restore'
  | 'comment'
  | 'share'
  | 'downloadAttachment';

export type SduiDocumentAccessMode = 'none' | 'readOnly' | 'editable';
