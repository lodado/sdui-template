import { createDocumentBlock } from '@lodado/sdui-document'
import { fireEvent, render, screen } from '@testing-library/react'
import React from 'react'

import { BlockChrome } from '../BlockChrome'

const codeBlock = createDocumentBlock({
  id: 'c1',
  type: 'document.code',
  state: { text: 'const a = 1' },
  attributes: { language: 'typescript' },
})

describe('CodeBlock chrome', () => {
  test('renders a pre>code wrapper around children', () => {
    const { container } = render(
      <BlockChrome block={codeBlock}>
        <span>const a = 1</span>
      </BlockChrome>,
    )
    expect(container.querySelector('pre.code-block code')).toBeInTheDocument()
  })

  test('language select shows current language and commits changes', () => {
    const onSetCodeLanguage = jest.fn()
    render(
      <BlockChrome block={codeBlock} onSetCodeLanguage={onSetCodeLanguage}>
        <span>const a = 1</span>
      </BlockChrome>,
    )
    const select = screen.getByLabelText('Code language')
    expect(select).toHaveValue('typescript')
    fireEvent.change(select, { target: { value: 'python' } })
    expect(onSetCodeLanguage).toHaveBeenCalledWith('c1', 'python')
  })

  test('unknown stored language still renders as the selected option', () => {
    const onSetCodeLanguage = jest.fn()
    const exotic = createDocumentBlock({
      id: 'c2',
      type: 'document.code',
      state: { text: 'x' },
      attributes: { language: 'brainfuck' },
    })
    render(
      <BlockChrome block={exotic} onSetCodeLanguage={onSetCodeLanguage}>
        <span>x</span>
      </BlockChrome>,
    )
    expect(screen.getByLabelText('Code language')).toHaveValue('brainfuck')
  })

  test('readOnly (no handler) renders a static language label', () => {
    render(
      <BlockChrome block={codeBlock}>
        <span>const a = 1</span>
      </BlockChrome>,
    )
    expect(screen.queryByLabelText('Code language')).not.toBeInTheDocument()
    expect(screen.getByText('typescript')).toBeInTheDocument()
  })

  test('wrap toggle reflects state and requests the opposite', () => {
    const onSetCodeWrap = jest.fn()
    const { container, rerender } = render(
      <BlockChrome block={codeBlock} onSetCodeWrap={onSetCodeWrap}>
        <span>const a = 1</span>
      </BlockChrome>,
    )
    // default: wrapped (switch on, no nowrap class)
    const toggle = screen.getByRole('switch', { name: 'Wrap lines' })
    expect(toggle).toHaveAttribute('aria-checked', 'true')
    expect(container.querySelector('pre.code-block--nowrap')).not.toBeInTheDocument()

    fireEvent.click(toggle)
    expect(onSetCodeWrap).toHaveBeenCalledWith('c1', false)

    // when stored wrap=false, the switch is off and the pre gets the nowrap class
    const noWrapBlock = createDocumentBlock({
      id: 'c1',
      type: 'document.code',
      state: { text: 'const a = 1' },
      attributes: { language: 'typescript', wrap: false },
    })
    rerender(
      <BlockChrome block={noWrapBlock} onSetCodeWrap={onSetCodeWrap}>
        <span>const a = 1</span>
      </BlockChrome>,
    )
    expect(screen.getByRole('switch', { name: 'Wrap lines' })).toHaveAttribute('aria-checked', 'false')
    expect(container.querySelector('pre.code-block--nowrap')).toBeInTheDocument()
  })

  test('readOnly hides the wrap toggle', () => {
    render(
      <BlockChrome block={codeBlock}>
        <span>const a = 1</span>
      </BlockChrome>,
    )
    expect(screen.queryByRole('switch', { name: 'Wrap lines' })).not.toBeInTheDocument()
  })
})
