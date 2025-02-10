import React from "react";
import { render, fireEvent } from "@testing-library/react";
import NodeControls from "./NodeControls";
import { MessageCircle, Trash2, Settings, Image } from "lucide-react";

describe("NodeControls", () => {
  const mockOnChatClick = jest.fn();
  const mockOnDeleteClick = jest.fn();
  const mockOnSettingsClick = jest.fn();
  const mockOnImageClick = jest.fn();

  const defaultProps = {
    onChatClick: mockOnChatClick,
    onDeleteClick: mockOnDeleteClick,
    onSettingsClick: mockOnSettingsClick,
    onImageClick: mockOnImageClick,
    messages: [{ id: "1", text: "Test message", timestamp: Date.now() }],
  };

  it("renders correctly", () => {
    const { getByTitle } = render(<NodeControls {...defaultProps} />);
    expect(getByTitle("Open Chat")).toBeInTheDocument();
    expect(getByTitle("Delete")).toBeInTheDocument();
    expect(getByTitle("Settings")).toBeInTheDocument();
    expect(getByTitle("Select Image")).toBeInTheDocument();
  });

  it("calls onChatClick when chat button is clicked", () => {
    const { getByTitle } = render(<NodeControls {...defaultProps} />);
    fireEvent.click(getByTitle("Open Chat"));
    expect(mockOnChatClick).toHaveBeenCalled();
  });

  it("calls onDeleteClick when delete button is clicked", () => {
    const { getByTitle } = render(<NodeControls {...defaultProps} />);
    fireEvent.click(getByTitle("Delete"));
    expect(mockOnDeleteClick).toHaveBeenCalled();
  });

  it("calls onSettingsClick when settings button is clicked", () => {
    const { getByTitle } = render(<NodeControls {...defaultProps} />);
    fireEvent.click(getByTitle("Settings"));
    expect(mockOnSettingsClick).toHaveBeenCalled();
  });

  it("calls onImageClick when image button is clicked", () => {
    const { getByTitle } = render(<NodeControls {...defaultProps} />);
    fireEvent.click(getByTitle("Select Image"));
    expect(mockOnImageClick).toHaveBeenCalled();
  });

  it("displays the correct number of messages", () => {
    const { getByText } = render(<NodeControls {...defaultProps} />);
    expect(getByText("1")).toBeInTheDocument();
  });

  it("does not render settings button if onSettingsClick is not provided", () => {
    const { queryByTitle } = render(
      <NodeControls {...defaultProps} onSettingsClick={undefined} />
    );
    expect(queryByTitle("Settings")).toBeNull();
  });

  it("does not render image button if onImageClick is not provided", () => {
    const { queryByTitle } = render(
      <NodeControls {...defaultProps} onImageClick={undefined} />
    );
    expect(queryByTitle("Select Image")).toBeNull();
  });
});