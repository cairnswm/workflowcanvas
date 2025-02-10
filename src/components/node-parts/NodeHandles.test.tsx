import React from "react";
import { render } from "@testing-library/react";
import NodeHandles from "./NodeHandles";
import { ReactFlowProvider } from "reactflow";

describe("NodeHandles", () => {
  it("renders sticky node handles correctly", () => {
    const { container, getByTestId, getAllByTestId } = render(
      <ReactFlowProvider>
        <NodeHandles type="sticky" />
      </ReactFlowProvider>
    );
    const handles = getAllByTestId("sticky-handle");
    const chatHandle = getByTestId("chat-handle");
    expect(handles.length).toBe(8);
    expect(chatHandle).toBeInTheDocument();
  });

  it("renders decision node handles correctly", () => {
    const { container, getByTestId } = render(
      <ReactFlowProvider>
        <NodeHandles type="decision" />
      </ReactFlowProvider>
    );
    const targetHandle = getByTestId("default-target-handle");
    const redHandle = getByTestId("decision-red-handle");
    const greenHandle = getByTestId("decision-green-handle");
    const chatHandle = getByTestId("chat-handle");
    expect(targetHandle).toBeInTheDocument();
    expect(redHandle).toBeInTheDocument();
    expect(greenHandle).toBeInTheDocument();
    expect(chatHandle).toBeInTheDocument();
  });

  it("renders default node handles correctly", () => {
    const { container, getByTestId, getAllByTestId } = render(
      <ReactFlowProvider>
        <NodeHandles type="default" />
      </ReactFlowProvider>
    );
    const targetHandle = getByTestId("default-target-handle");
    const grayHandles = getAllByTestId("default-gray-handle");
    const chatHandle = getByTestId("chat-handle");
    expect(targetHandle).toBeInTheDocument();
    expect(grayHandles.length).toBe(3);
    expect(chatHandle).toBeInTheDocument();
  });
});