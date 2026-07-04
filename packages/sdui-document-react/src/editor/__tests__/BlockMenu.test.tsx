import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import React from 'react'

import { BlockMenu } from '../block-menu/BlockMenu'
import { BLOCK_MENU_ITEMS } from '../block-menu/blockMenuItems'

const anchor = { left: 10, top: 20, bottom: 36 }

describe('BlockMenu', () => {
  test('renders filtered items as listbox options with active highlight', () => {
    render(
      <BlockMenu
        anchor={anchor}
        items={[...BLOCK_MENU_ITEMS]}
        activeIndex={1}
        view="menu"
        onSelect={jest.fn()}
        onSubmitLink={jest.fn()}
        onClose={jest.fn()}
      />,
    )
    const options = screen.getAllByRole('option')
    expect(options).toHaveLength(BLOCK_MENU_ITEMS.length)
    expect(options[1]).toHaveAttribute('aria-selected', 'true')
  })

  test('clicking an option fires onSelect with the item', async () => {
    const onSelect = jest.fn()
    render(
      <BlockMenu
        anchor={anchor}
        items={[...BLOCK_MENU_ITEMS]}
        activeIndex={0}
        view="menu"
        onSelect={onSelect}
        onSubmitLink={jest.fn()}
        onClose={jest.fn()}
      />,
    )
    await userEvent.click(screen.getByRole('option', { name: /divider/i }))
    expect(onSelect).toHaveBeenCalledWith(expect.objectContaining({ id: 'divider' }))
  })

  test('empty items shows a no-results row', () => {
    render(
      <BlockMenu
        anchor={anchor}
        items={[]}
        activeIndex={0}
        view="menu"
        onSelect={jest.fn()}
        onSubmitLink={jest.fn()}
        onClose={jest.fn()}
      />,
    )
    expect(screen.getByText(/no results/i)).toBeInTheDocument()
  })

  test('link view submits typed url', async () => {
    const onSubmitLink = jest.fn()
    render(
      <BlockMenu
        anchor={anchor}
        items={[]}
        activeIndex={0}
        view="link"
        onSelect={jest.fn()}
        onSubmitLink={onSubmitLink}
        onClose={jest.fn()}
      />,
    )
    await userEvent.type(screen.getByRole('textbox'), 'https://example.com{Enter}')
    expect(onSubmitLink).toHaveBeenCalledWith('https://example.com')
  })

  test('Escape in the link input closes the menu', async () => {
    const onClose = jest.fn()
    render(
      <BlockMenu
        anchor={anchor}
        items={[]}
        activeIndex={0}
        view="link"
        onSelect={jest.fn()}
        onSubmitLink={jest.fn()}
        onClose={onClose}
      />,
    )
    await userEvent.type(screen.getByRole('textbox'), '{Escape}')
    expect(onClose).toHaveBeenCalled()
  })
})
