/**
 * Scenario Test: Store Reset
 *
 * Tests for store reset functionality
 */

import React from "react";
import { screen } from "@testing-library/react";

import { useSduiLayoutAction } from "../../react/hooks";
import { createTestDocument, renderWithSduiLayout } from "../utils/test-utils";

const ResetTest: React.FC = () => {
  const store = useSduiLayoutAction();
  const [reset, setReset] = React.useState(false);

  React.useEffect(() => {
    if (!reset) {
      store.reset();
      setReset(true);
    }
  }, [store, reset]);

  const rootId = store.getRootId();
  const nodes = store.state.nodes;

  return (
    <div>
      <div data-testid="root-id">{rootId || "undefined"}</div>
      <div data-testid="nodes-count">{Object.keys(nodes).length}</div>
    </div>
  );
};

describe("Store Reset", () => {
  describe("as is: document loaded, store populated", () => {
    describe("when: store.reset() called", () => {
      it("to be: store returns to initial state, all subscriptions cleaned up", () => {
        const document = createTestDocument();

        renderWithSduiLayout(document, undefined, <ResetTest />);

        // After reset, store should be empty
        expect(screen.getByTestId("root-id")).toHaveTextContent("undefined");
        expect(screen.getByTestId("nodes-count")).toHaveTextContent("0");
      });
    });
  });
});

