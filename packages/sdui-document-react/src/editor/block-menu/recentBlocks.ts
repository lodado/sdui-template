/**
 * Recently-used block menu items — persisted to localStorage so the slash menu
 * can surface the 3 most-recent inserts at the top when the query is empty
 * (Notion behavior). Item ids are used (not types) so heading levels and the
 * gallery/list collection variants stay distinct.
 */

const STORAGE_KEY = 'sdui-doc:recent-blocks'
const MAX_RECENT = 3

/** Reads the recent ids, newest first. Never throws (private mode / SSR safe). */
export function getRecentBlockIds(): string[] {
  try {
    if (typeof window === 'undefined') {
      return []
    }
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) {
      return []
    }
    const parsed: unknown = JSON.parse(raw)
    if (!Array.isArray(parsed)) {
      return []
    }
    return parsed.filter((entry): entry is string => typeof entry === 'string').slice(0, MAX_RECENT)
  } catch {
    return []
  }
}

/** Records an inserted block id as most-recent, deduped and capped. */
export function recordRecentBlock(id: string): void {
  try {
    if (typeof window === 'undefined') {
      return
    }
    const next = [id, ...getRecentBlockIds().filter((entry) => entry !== id)].slice(0, MAX_RECENT)
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
  } catch {
    // ignore quota / privacy-mode write failures — recent list is best-effort
  }
}
