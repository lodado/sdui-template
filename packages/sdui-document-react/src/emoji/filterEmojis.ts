import { EMOJI_DATA, type EmojiEntry } from './emojiData'

/** Filter the curated set by name substring or keyword, case-insensitive. */
export function filterEmojis(query: string): EmojiEntry[] {
  const needle = query.trim().toLowerCase()
  if (!needle) {
    return [...EMOJI_DATA]
  }

  return EMOJI_DATA.filter(
    (entry) =>
      entry.name.toLowerCase().includes(needle) ||
      entry.keywords.some((keyword) => keyword.toLowerCase().includes(needle)),
  )
}
