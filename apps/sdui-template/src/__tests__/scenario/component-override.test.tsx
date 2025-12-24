/**
 * Scenario Test: Component Override
 *
 * Tests for component override functionality
 */

import React from "react";
import { render, screen } from "@testing-library/react";

import { SduiLayoutRenderer } from "../../react/components/SduiLayoutRenderer";
import type { ComponentFactory } from "../../components/types";
import { createTestDocument } from "../utils/test-utils";

describe("Component Overrides", () => {
  describe("as is: document with node type CustomType", () => {
    describe("when: components={{ CustomType: customFactory }} passed to Renderer", () => {
      it("to be: custom factory used for that type", () => {
        const customFactory: ComponentFactory = (id) => (
          <div data-testid={`custom-${id}`}>Custom Component: {id}</div>
        );

        const document = createTestDocument({
          root: {
            id: "root",
            type: "CustomType",
            state: {
              layout: { x: 0, y: 0, w: 12, h: 1 },
            },
          },
        });

        render(
          <SduiLayoutRenderer document={document} components={{ CustomType: customFactory }} />
        );

        expect(screen.getByTestId("custom-root")).toBeInTheDocument();
        expect(screen.getByText(/Custom Component: root/i)).toBeInTheDocument();
      });
    });
  });

  describe("as is: document with node id custom-id, type DefaultType", () => {
    describe("when: componentOverrides={{ byNodeId: { custom-id: customFactory } }} passed", () => {
      it("to be: custom factory used for that ID (overrides type)", () => {
        const customFactory: ComponentFactory = (id) => (
          <div data-testid={`custom-by-id-${id}`}>Custom by ID: {id}</div>
        );

        const document = createTestDocument({
          root: {
            id: "root",
            type: "Container",
            state: {
              layout: { x: 0, y: 0, w: 12, h: 1 },
            },
            children: [
              {
                id: "custom-id",
                type: "DefaultType",
                state: {
                  layout: { x: 0, y: 0, w: 6, h: 1 },
                },
              },
            ],
          },
        });

        render(
          <SduiLayoutRenderer
            document={document}
            componentOverrides={{
              byNodeId: { "custom-id": customFactory },
            }}
          />
        );

        expect(screen.getByTestId("custom-by-id-custom-id")).toBeInTheDocument();
        expect(screen.getByText(/Custom by ID: custom-id/i)).toBeInTheDocument();
      });
    });
  });
});


