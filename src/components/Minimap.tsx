import React, { useState, memo } from "react";
import { MiniMap, useReactFlow } from "reactflow";
import { Minimize2, Maximize2 } from "lucide-react";
import CustomMinimapNode from "./CustomMinimapNode";

const minimapStyle = {
  backgroundColor: "rgb(249, 250, 251)",
  height: 160,
};

const nodeColor = (node: any) => {
  switch (node.data?.type) {
    case "action":
      return "#60A5FA"; // Bolder blue
    case "state":
      return "#4ADE80"; // Bolder green
    case "decision":
      return "#FCD34D"; // Bolder amber
    case "block":
      return "#9CA3AF"; // Bolder gray
    case "image":
      return "#7DD3FC"; // Sky blue

    case "sticky":
      return "#99009999";
    default:
      return "#E5E7EB";
  }
};

function Minimap() {
  const [isMinimized, setIsMinimized] = useState(false);
  const { setCenter, getNodes } = useReactFlow();

  const handleMinimapClick = (event: React.MouseEvent<HTMLDivElement>) => {
    const bounds = event.currentTarget.getBoundingClientRect();
    const x = (event.clientX - bounds.left) / bounds.width;
    const y = (event.clientY - bounds.top) / bounds.height;

    const nodes = getNodes();
    if (nodes.length > 0) {
      const xPos = nodes.reduce(
        (min, node) => Math.min(min, node.position.x),
        Infinity
      );
      const xMax = nodes.reduce(
        (max, node) => Math.max(max, node.position.x),
        -Infinity
      );
      const yPos = nodes.reduce(
        (min, node) => Math.min(min, node.position.y),
        Infinity
      );
      const yMax = nodes.reduce(
        (max, node) => Math.max(max, node.position.y),
        -Infinity
      );

      const targetX = xPos + (xMax - xPos) * x;
      const targetY = yPos + (yMax - yPos) * y;

      setCenter(targetX, targetY, { zoom: 1, duration: 800 });
    }
  };

  return (
    <div className="absolute bottom-4 left-[75px] z-50">
      <div
        className={`bg-white rounded-lg shadow-lg transition-all duration-300 ${
          isMinimized ? "w-10 h-10" : "w-[240px] h-[160px]"
        }`}
      >
        <button
          onClick={() => setIsMinimized(!isMinimized)}
          className="absolute top-2 right-2 p-1 hover:bg-gray-100 rounded-full z-10 bg-white shadow-sm"
        >
          {isMinimized ? <Maximize2 size={14} /> : <Minimize2 size={14} />}
        </button>

        {!isMinimized && (
          <div onClick={handleMinimapClick} className="w-full h-full">
            <MiniMap
              nodeComponent={CustomMinimapNode}
              style={minimapStyle}
              nodeColor={nodeColor}
              nodeStrokeWidth={3}
              nodeStrokeColor="#fff"
              zoomable
              pannable
              maskColor="rgba(0, 0, 0, 0.1)"
            />
          </div>
        )}
      </div>
    </div>
  );
}

export default Minimap;
