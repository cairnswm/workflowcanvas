import React from "react";
import { Handle, Position } from "reactflow";

interface NodeHandlesProps {
  type: string;
}

const NodeHandles = ({ type }: NodeHandlesProps) => {
  const isDecision = type === "decision";
  const isSticky = type === "sticky";

  if (isSticky) {
    return (
      <>
        <Handle
          type="source"
          position={Position.Top}
          className="w-2 h-2 bg-gray-400"
          id="top-source"
          style={{ left: "50%" }}
          data-testid="sticky-handle"
        />
        <Handle
          type="target"
          position={Position.Top}
          className="w-2 h-2 bg-gray-400"
          id="top-target"
          style={{ left: "50%" }}
          data-testid="sticky-handle"
        />
        <Handle
          type="source"
          position={Position.Right}
          className="w-2 h-2 bg-gray-400"
          id="right-source"
          style={{ top: "50%" }}
          data-testid="sticky-handle"
        />
        <Handle
          type="target"
          position={Position.Right}
          className="w-2 h-2 bg-gray-400"
          id="right-target"
          style={{ top: "50%" }}
          data-testid="sticky-handle"
        />
        <Handle
          type="source"
          position={Position.Bottom}
          className="w-2 h-2 bg-gray-400"
          id="bottom-source"
          style={{ left: "50%" }}
          data-testid="sticky-handle"
        />
        <Handle
          type="target"
          position={Position.Bottom}
          className="w-2 h-2 bg-gray-400"
          id="bottom-target"
          style={{ left: "50%" }}
          data-testid="sticky-handle"
        />
        <Handle
          type="source"
          position={Position.Left}
          className="w-2 h-2 bg-gray-400"
          id="left-source"
          style={{ top: "50%" }}
          data-testid="sticky-handle"
        />
        <Handle
          type="target"
          position={Position.Left}
          className="w-2 h-2 bg-gray-400"
          id="left-target"
          style={{ top: "50%" }}
          data-testid="sticky-handle"
        />
        <Handle
          type="source"
          position={Position.Right}
          id="chat"
          style={{ top: "20px", right: "-4px", opacity: 0 }}
          className="bg-sky-400 hover:opacity-100"
          data-testid="chat-handle"
        />
      </>
    );
  }

  return (
    <>
      <Handle
        type="target"
        position={Position.Top}
        className="w-2 h-2 bg-blue-400"
        data-testid="default-target-handle"
      />
      <Handle
        type="source"
        position={Position.Right}
        id="chat"
        style={{ top: "20px", right: "-4px", opacity: 0 }}
        className="bg-sky-400 hover:opacity-100"        
        data-testid="chat-handle"
      />
      {isDecision ? (
        <>
          <Handle
            type="source"
            position={Position.Bottom}
            className="w-2 h-2 bg-red-400"
            id="bottom-left"
            style={{ left: "25%" }}
            data-testid="decision-red-handle"
          />
          <Handle
            type="source"
            position={Position.Bottom}
            className="w-2 h-2 bg-green-400"
            id="bottom-right"
            style={{ left: "75%" }}
            data-testid="decision-green-handle"
          />
        </>
      ) : (
        <>
          <Handle
            type="source"
            position={Position.Bottom}
            className="w-2 h-2 bg-gray-400"
            id="bottom-left"
            style={{ left: "25%" }}
            data-testid="default-gray-handle"
          />
          <Handle
            type="source"
            position={Position.Bottom}
            className="w-2 h-2 bg-gray-400"
            id="bottom-center"
            style={{ left: "50%" }}
            data-testid="default-gray-handle"
          />
          <Handle
            type="source"
            position={Position.Bottom}
            className="w-2 h-2 bg-gray-400"
            id="bottom-right"
            style={{ left: "75%" }}
            data-testid="default-gray-handle"
          />
        </>
      )}
    </>
  );
};

export default NodeHandles;
