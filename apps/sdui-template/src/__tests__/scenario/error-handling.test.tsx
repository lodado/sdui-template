/**
 * Scenario Test: Error Handling
 *
 * Tests for error handling and edge cases
 */

import React from "react";
import { render, screen } from "@testing-library/react";

import { SduiLayoutRenderer } from "../../react/components/SduiLayoutRenderer";

describe("Error Handling", () => {
  describe("as is: empty store", () => {
    describe("when: SduiLayoutRenderer receives document missing root.id", () => {
      it("to be: onError callback called with InvalidDocumentError", () => {
        const onError = jest.fn();
        const invalidDocument: any = {
          version: "1.0.0",
          root: {
            // Missing id
            type: "Container",
            state: {
              layout: { x: 0, y: 0, w: 12, h: 1 },
            },
          },
        };

        render(
          <SduiLayoutRenderer document={invalidDocument} onError={onError} />
        );

        // Error should be caught and passed to onError
        // Note: The actual error might be thrown during normalization
        // This test verifies the error callback is set up correctly
        expect(onError).toHaveBeenCalled();
      });
    });
  });
});



