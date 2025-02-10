import React from "react";
import { render } from "@testing-library/react";
import ChatMessages from "./ChatMessages";
import { ChatMessage } from "../../hooks/useNodeCommon";

describe("ChatMessages component", () => {
  it("renders without crashing", () => {
    render(<ChatMessages />);
  });

  it("renders no messages when messages prop is empty", () => {
    const { container } = render(<ChatMessages messages={[]} />);
    expect(container.textContent).toBe("");
  });

  it("renders messages correctly", () => {
    const messages: ChatMessage[] = [
      { id: "1", text: "Hello", timestamp: Date.now() },
      { id: "2", text: "World", timestamp: Date.now() },
    ];
    const { getByText } = render(<ChatMessages messages={messages} />);
    expect(getByText("Hello")).toBeInTheDocument();
    expect(getByText("World")).toBeInTheDocument();
  });

  it("applies correct styles", () => {
    const { container } = render(<ChatMessages />);
    const divElement = container.firstChild;
    expect(divElement).toHaveClass("p-2 overflow-y-auto");
    expect(divElement).toHaveStyle("height: calc(100% - 70px)");
  });
});