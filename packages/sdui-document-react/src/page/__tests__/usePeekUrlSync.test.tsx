import { act, render } from '@testing-library/react'
import React, { useState } from 'react'

import { usePeekUrlSync } from '../usePeekUrlSync'

// Test harness: exposes the peek state the hook drives, and a setter to open/
// close from the "provider" side.
const Harness = ({ param }: { param?: string }) => {
  const [peekId, setPeekId] = useState<string | null>(null)
  usePeekUrlSync(param, peekId, setPeekId)

  return (
    <div>
      <span data-testid="peek">{peekId ?? 'none'}</span>
      <button type="button" onClick={() => setPeekId('doc-a')}>
        open
      </button>
      <button type="button" onClick={() => setPeekId(null)}>
        close
      </button>
    </div>
  )
}

function search() {
  return new URLSearchParams(window.location.search)
}

describe('usePeekUrlSync', () => {
  beforeEach(() => {
    window.history.pushState(null, '', '/')
  })

  it('as is: disabled (no param) — to be: URL untouched by open', () => {
    const { getByText } = render(<Harness />)

    act(() => getByText('open').click())

    expect(search().has('peek')).toBe(false)
  })

  it('as is: peek opens — to be: id written to the URL param', () => {
    const { getByText } = render(<Harness param="peek" />)

    act(() => getByText('open').click())

    expect(search().get('peek')).toBe('doc-a')
  })

  it('as is: peek closes — to be: param removed from the URL', () => {
    const { getByText } = render(<Harness param="peek" />)

    act(() => getByText('open').click())
    act(() => getByText('close').click())

    expect(search().has('peek')).toBe(false)
  })

  it('as is: URL already carries the param on mount — to be: peek opens from it', () => {
    window.history.pushState(null, '', '/?peek=doc-z')

    const { getByTestId } = render(<Harness param="peek" />)

    expect(getByTestId('peek')).toHaveTextContent('doc-z')
  })

  it('as is: back navigation (popstate) — to be: peek re-syncs from the URL', () => {
    const { getByText, getByTestId } = render(<Harness param="peek" />)

    act(() => getByText('open').click())
    expect(getByTestId('peek')).toHaveTextContent('doc-a')

    // simulate Back: restore the pre-open URL and fire popstate
    act(() => {
      window.history.pushState(null, '', '/')
      window.dispatchEvent(new PopStateEvent('popstate'))
    })

    expect(getByTestId('peek')).toHaveTextContent('none')
  })
})
