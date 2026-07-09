/**
 * The viewer's core invariant: rendering `SduiDocumentViewer` must not load
 * ProseMirror or dnd-kit. Each factory below THROWS — jest only executes a
 * mock factory when something in the transitive require graph actually
 * imports that package, so any regression fails with the offending name.
 */
import { render } from '@testing-library/react'
import React from 'react'

import { createViewerFixture } from './viewerFixture'

jest.mock('prosemirror-commands', () => {
  throw new Error('prosemirror-commands leaked into the viewer import graph')
})
jest.mock('prosemirror-inputrules', () => {
  throw new Error('prosemirror-inputrules leaked into the viewer import graph')
})
jest.mock('prosemirror-keymap', () => {
  throw new Error('prosemirror-keymap leaked into the viewer import graph')
})
jest.mock('prosemirror-history', () => {
  throw new Error('prosemirror-history leaked into the viewer import graph')
})
jest.mock('prosemirror-model', () => {
  throw new Error('prosemirror-model leaked into the viewer import graph')
})
jest.mock('prosemirror-state', () => {
  throw new Error('prosemirror-state leaked into the viewer import graph')
})
jest.mock('prosemirror-view', () => {
  throw new Error('prosemirror-view leaked into the viewer import graph')
})
jest.mock('@dnd-kit/core', () => {
  throw new Error('@dnd-kit/core leaked into the viewer import graph')
})

describe('viewer import graph', () => {
  describe('as is: SduiDocumentViewer imported via the viewer entry', () => {
    describe('when rendering every block type and every mark', () => {
      it('to be: rendered without loading ProseMirror or dnd-kit', async () => {
        // dynamic import AFTER the throwing mocks are registered
        const { SduiDocumentViewer } = await import('../index')

        const { container } = render(<SduiDocumentViewer content={createViewerFixture()} />)

        expect(container.querySelector('[data-sdui-document-viewer]')).not.toBeNull()
        expect(container.querySelectorAll('[data-block-id]').length).toBeGreaterThan(20)
      })
    })
  })
})
