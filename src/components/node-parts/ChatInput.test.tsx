import React from "react";
import { render, fireEvent } from "@testing-library/react";
import ChatInput from "./ChatInput";

describe("ChatInput", () => {
  it("renders input field", () => {
    const { getByPlaceholderText } = render(<ChatInput onSendMessage={() => {}} />);
    const inputElement = getByPlaceholderText("Type a message and press Enter");
    expect(inputElement).toBeInTheDocument();
  });

  it("updates input value on change", () => {
    const { getByPlaceholderText } = render(<ChatInput onSendMessage={() => {}} />);
    const inputElement = getByPlaceholderText("Type a message and press Enter");
    fireEvent.change(inputElement, { target: { value: "Hello" } });
    expect(inputElement).toHaveValue("Hello");
  });

  it("calls onSendMessage and clears input on Enter key press", () => {
    const mockSendMessage = jest.fn();
    const { getByPlaceholderText } = render(<ChatInput onSendMessage={mockSendMessage} />);
    const inputElement = getByPlaceholderText("Type a message and press Enter");

    fireEvent.change(inputElement, { target: { value: "Hello" } });
    fireEvent.keyDown(inputElement, { key: "Enter", code: "Enter" });

    expect(mockSendMessage).toHaveBeenCalledWith("Hello");
    expect(inputElement).toHaveValue("");
  });

  it("does not call onSendMessage on Enter key press if input is empty", () => {
    const mockSendMessage = jest.fn();
    const { getByPlaceholderText } = render(<ChatInput onSendMessage={mockSendMessage} />);
    const inputElement = getByPlaceholderText("Type a message and press Enter");

    fireEvent.keyDown(inputElement, { key: "Enter", code: "Enter" });

    expect(mockSendMessage).not.toHaveBeenCalled();
  });
});