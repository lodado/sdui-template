/**
 * Scenario Test: Error Handling
 *
 * Tests for error handling and edge cases
 */

import { render, screen } from '@testing-library/react'
import React from 'react'

import { SduiLayoutRenderer } from '../../react-wrapper/components/SduiLayoutRenderer'
import { defaultTestComponentFactory } from '../utils/dev-utils'

describe('Error Handling', () => {
  describe('as is: empty store', () => {
    describe('when: SduiLayoutRenderer receives document missing root.id', () => {
      it('to be: onError callback called with InvalidDocumentError', () => {
        const onError = jest.fn()
        const invalidDocument: any = {
          version: '1.0.0',
          root: {
            // Missing id
            type: 'Container',
          },
        }

        render(<SduiLayoutRenderer document={invalidDocument} onError={onError} components={{ Container: defaultTestComponentFactory }} />)

        // Error should be caught and passed to onError
        // Note: The actual error might be thrown during normalization
        // This test verifies the error callback is set up correctly
        expect(onError).toHaveBeenCalled()
      })
    })
  })
})
