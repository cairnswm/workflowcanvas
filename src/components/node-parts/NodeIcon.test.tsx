import React from "react";
import { render } from "@testing-library/react";
import NodeIcon, { getNodeStyle } from "./NodeIcon";

describe("NodeIcon", () => {
  it("renders Activity icon for action type", () => {
    const { container } = render(<NodeIcon type="action" />);
    expect(container.querySelector(".text-blue-500")).toBeInTheDocument();
  });

  it("renders Database icon for state type", () => {
    const { container } = render(<NodeIcon type="state" />);
    expect(container.querySelector(".text-green-500")).toBeInTheDocument();
  });

  it("renders GitFork icon for decision type", () => {
    const { container } = render(<NodeIcon type="decision" />);
    expect(container.querySelector(".text-amber-500")).toBeInTheDocument();
  });

  it("renders Square icon for block type", () => {
    const { container } = render(<NodeIcon type="block" />);
    expect(container.querySelector(".text-gray-500")).toBeInTheDocument();
  });

  it("renders StickyNote icon for sticky type", () => {
    const { container } = render(<NodeIcon type="sticky" />);
    expect(container.querySelector(".text-yellow-500")).toBeInTheDocument();
  });

  it("returns null for unsupported type", () => {
    const { container } = render(<NodeIcon type="header" />);
    expect(container.firstChild).toBeNull();
  });
});

describe("getNodeStyle", () => {
  it("returns correct style for action type", () => {
    expect(getNodeStyle("action")).toBe("bg-white border-blue-400");
  });

  it("returns correct style for state type", () => {
    expect(getNodeStyle("state")).toBe("bg-gray-50 border-green-400");
  });

  it("returns correct style for decision type", () => {
    expect(getNodeStyle("decision")).toBe("bg-white border-amber-400");
  });

  it("returns correct style for block type", () => {
    expect(getNodeStyle("block")).toBe("bg-gray-200 border-gray-400");
  });

  it("returns correct style for image type", () => {
    expect(getNodeStyle("image")).toBe("bg-sky-50 border-sky-400");
  });

  it("returns correct style for sticky type", () => {
    expect(getNodeStyle("sticky")).toBe("bg-yellow-50 border-yellow-400");
  });

  it("returns default style for unsupported type", () => {
    expect(getNodeStyle("header")).toBe("bg-white border-gray-200");
  });
});