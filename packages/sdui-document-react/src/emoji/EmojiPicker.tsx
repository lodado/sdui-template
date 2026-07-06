import React, { useState } from 'react'

import { filterEmojis } from './filterEmojis'

export interface EmojiPickerProps {
  onSelect: (char: string) => void
}

/** Curated-set emoji grid with keyword search. No dependency, no network. */
export const EmojiPicker = ({ onSelect }: EmojiPickerProps) => {
  const [query, setQuery] = useState('')
  const results = filterEmojis(query)

  return (
    <div className="emoji-picker" role="menu">
      <input
        className="emoji-picker__search"
        placeholder="Search emoji"
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        // eslint-disable-next-line jsx-a11y/no-autofocus
        autoFocus
      />
      <div className="emoji-picker__grid">
        {results.map((entry) => (
          <button key={entry.char} type="button" aria-label={entry.name} onClick={() => onSelect(entry.char)}>
            {entry.char}
          </button>
        ))}
      </div>
    </div>
  )
}
