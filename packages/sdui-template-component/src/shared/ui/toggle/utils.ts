/**
 * Get data-state attribute value for controlled toggle icons
 *
 * @param isControlled - Whether the toggle is in controlled mode
 * @param isChecked - Current checked state
 * @returns 'checked' | 'unchecked' | undefined
 */
export const getIconDataState = (
  isControlled: boolean,
  isChecked: boolean | undefined,
): 'checked' | 'unchecked' | undefined => {
  if (!isControlled) return undefined
  return isChecked ? 'checked' : 'unchecked'
}
