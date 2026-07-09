/**
 * useSduiVariables / useSduiVariable
 *
 * Components read global variables reactively: variable updates re-render
 * subscribers, unrelated renders reuse the same snapshot.
 */
import { act, render, screen } from '@testing-library/react'
import React from 'react'

import { SduiLayoutProvider } from '../../react-wrapper/context'
import { useSduiVariable, useSduiVariables } from '../../react-wrapper/hooks/useSduiVariables'
import { SduiLayoutStore } from '../../store'

const DOCUMENT = {
  version: '1.0',
  root: { id: 'root', type: 'Div' },
  variables: { count: 1, label: 'initial' },
}

const CountReader = () => {
  const count = useSduiVariable<number>('count')
  return <div data-testid="count">{String(count)}</div>
}

const AllReader = () => {
  const variables = useSduiVariables()
  return <div data-testid="all">{JSON.stringify(variables)}</div>
}

function renderWithStore() {
  const store = new SduiLayoutStore(DOCUMENT as never)
  const view = render(
    <SduiLayoutProvider store={store}>
      <CountReader />
      <AllReader />
    </SduiLayoutProvider>,
  )

  return { store, view }
}

describe('useSduiVariable', () => {
  it('reads the initial document variables', () => {
    renderWithStore()

    expect(screen.getByTestId('count')).toHaveTextContent('1')
    expect(screen.getByTestId('all')).toHaveTextContent('"label":"initial"')
  })

  it('re-renders when a variable is updated', () => {
    const { store } = renderWithStore()

    act(() => {
      store.updateVariable('count', 2)
    })

    expect(screen.getByTestId('count')).toHaveTextContent('2')
  })

  it('re-renders when variables are replaced wholesale', () => {
    const { store } = renderWithStore()

    act(() => {
      store.updateVariables({ count: 9 })
    })

    expect(screen.getByTestId('count')).toHaveTextContent('9')
    expect(screen.getByTestId('all')).not.toHaveTextContent('label')
  })

  it('returns undefined for a missing key', () => {
    const { store } = renderWithStore()

    act(() => {
      store.deleteVariable('count')
    })

    expect(screen.getByTestId('count')).toHaveTextContent('undefined')
  })
})
