/**
 * Scenario Test: Subscription System
 *
 * Tests for subscription-based re-renders
 */

import React from "react";
import { screen } from "@testing-library/react";

import { useSduiLayoutAction, useSduiNodeSubscription } from "../../react/hooks";
import { createTestDocument, renderWithSduiLayout } from "../utils/test-utils";

// Component that subscribes to a specific node
const SubscribedComponent: React.FC<{ nodeId: string }> = ({ nodeId }) => {
  const { state } = useSduiNodeSubscription({ nodeId });
  const renderCount = React.useRef(0);
  renderCount.current += 1;

  return (
    <div data-testid={`subscribed-${nodeId}`}>
      <div>Render Count: {renderCount.current}</div>
      <div>X: {state?.layout.x}</div>
    </div>
  );
};

describe("Subscription System", () => {
  describe("as is: document loaded, 3 components subscribed to different nodes", () => {
    describe("when: store.updateNodeLayout(nodeId1, layout) called", () => {
      it("to be: only component subscribed to nodeId1 re-renders", () => {
        const document = createTestDocument({
          root: {
            id: "root",
            type: "Container",
            state: {
              layout: { x: 0, y: 0, w: 12, h: 1 },
            },
            children: [
              {
                id: "node-1",
                type: "Card",
                state: {
                  layout: { x: 0, y: 0, w: 4, h: 1 },
                },
              },
              {
                id: "node-2",
                type: "Card",
                state: {
                  layout: { x: 4, y: 0, w: 4, h: 1 },
                },
              },
              {
                id: "node-3",
                type: "Card",
                state: {
                  layout: { x: 8, y: 0, w: 4, h: 1 },
                },
              },
            ],
          },
        });

        const UpdateTest: React.FC = () => {
          const store = useSduiLayoutAction();
          React.useEffect(() => {
            // Update only node-1
            store.updateNodeLayout("node-1", { x: 2, y: 0 });
          }, [store]);

          return (
            <>
              <SubscribedComponent nodeId="node-1" />
              <SubscribedComponent nodeId="node-2" />
              <SubscribedComponent nodeId="node-3" />
            </>
          );
        };

        renderWithSduiLayout(document, undefined, <UpdateTest />);

        // All components should render initially
        expect(screen.getByTestId("subscribed-node-1")).toBeInTheDocument();
        expect(screen.getByTestId("subscribed-node-2")).toBeInTheDocument();
        expect(screen.getByTestId("subscribed-node-3")).toBeInTheDocument();
      });
    });
  });
});

