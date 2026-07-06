export interface EmojiEntry {
  char: string
  name: string
  keywords: string[]
  group: string
}

/** Curated, non-exhaustive set. Extend freely — this is plain data, no dependency. */
export const EMOJI_DATA: EmojiEntry[] = [
  { char: '😄', name: 'grinning face', keywords: ['smile', 'happy', 'joy'], group: 'Smileys' },
  { char: '😅', name: 'sweat smile', keywords: ['smile', 'nervous'], group: 'Smileys' },
  { char: '🙂', name: 'slight smile', keywords: ['smile'], group: 'Smileys' },
  { char: '😍', name: 'heart eyes', keywords: ['love', 'smile'], group: 'Smileys' },
  { char: '🤔', name: 'thinking face', keywords: ['think', 'hmm'], group: 'Smileys' },
  { char: '👍', name: 'thumbs up', keywords: ['yes', 'approve', 'like'], group: 'People' },
  { char: '👎', name: 'thumbs down', keywords: ['no', 'dislike'], group: 'People' },
  { char: '🙏', name: 'folded hands', keywords: ['please', 'thanks', 'pray'], group: 'People' },
  { char: '🎉', name: 'party popper', keywords: ['celebrate', 'party'], group: 'Objects' },
  { char: '🔥', name: 'fire', keywords: ['hot', 'lit', 'flame'], group: 'Objects' },
  { char: '⭐', name: 'star', keywords: ['favorite', 'star'], group: 'Objects' },
  { char: '💡', name: 'light bulb', keywords: ['idea', 'tip'], group: 'Objects' },
  { char: '📌', name: 'pushpin', keywords: ['pin', 'important'], group: 'Objects' },
  { char: '⚠️', name: 'warning', keywords: ['caution', 'alert'], group: 'Symbols' },
  { char: '✅', name: 'check mark', keywords: ['done', 'yes', 'ok'], group: 'Symbols' },
  { char: '❌', name: 'cross mark', keywords: ['no', 'wrong', 'error'], group: 'Symbols' },
  { char: '❤️', name: 'red heart', keywords: ['love', 'like'], group: 'Symbols' },
  { char: '🚀', name: 'rocket', keywords: ['launch', 'ship', 'fast'], group: 'Travel' },
  { char: '📝', name: 'memo', keywords: ['note', 'write', 'doc'], group: 'Objects' },
  { char: '📎', name: 'paperclip', keywords: ['attach', 'file'], group: 'Objects' },
  { char: '🔗', name: 'link', keywords: ['url', 'chain'], group: 'Objects' },
  { char: '📅', name: 'calendar', keywords: ['date', 'schedule'], group: 'Objects' },
]
