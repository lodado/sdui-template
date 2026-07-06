import { createDocumentBlock } from '@lodado/sdui-document'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import React from 'react'

import { BlockChrome } from '../BlockChrome'

test('copies code text and shows copied feedback', async () => {
  const writeText = jest.fn<Promise<void>, [string]>().mockResolvedValue(undefined)
  Object.defineProperty(navigator, 'clipboard', {
    configurable: true,
    value: { writeText },
  })

  const block = createDocumentBlock({
    id: 'code-copy',
    type: 'document.code',
    state: {
      content: [
        { type: 'text', text: 'const answer = 42' },
        { type: 'hard_break' },
        { type: 'text', text: 'return answer' },
      ],
    },
    attributes: { language: 'typescript' },
  })

  render(
    <BlockChrome block={block} onSetCodeLanguage={jest.fn()}>
      <span>rendered code</span>
    </BlockChrome>,
  )

  await userEvent.click(screen.getByRole('button', { name: 'Copy code' }))

  expect(writeText).toHaveBeenCalledWith('const answer = 42\nreturn answer')
  expect(screen.getByRole('button', { name: 'Copied' })).toHaveTextContent('Copied')
})
