// ponytail: dead shim. Block drag & drop moved to useBlockPointerDrag (native
// pointer, no dnd-kit). This file only survives because it could not be deleted
// in this environment — re-export the live helpers so nothing imports dnd-kit
// through here. Delete on next cleanup.
export { buildBlockDropPatches, computeOverRatio, projectBlockDrop } from './useBlockPointerDrag'
