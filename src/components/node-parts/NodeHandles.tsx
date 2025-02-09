import React from "react";
import { Handle, Position } from "reactflow";

interface NodeHandlesProps {
  type: string;
}

const NodeHandles = ({ type }: NodeHandlesProps) => {
  const isDecision = type === "decision";

  return (
    <>
      <Handle
        type="target"
        position={Position.Top}
        className="w-2 h-2 !bg-blue-400"
      />
      <Handle
        type="source"
        position={Position.Right}
        id="chat"
        style={{ top: "20px", right: "-4px", opacity: 0 }}
        className="!bg-sky-400 hover:opacity-100"
      />
      {isDecision ? (
        <>
          <Handle
            type="source"
            position={Position.Bottom}
            className="w-2 h-2 !bg-red-400"
            id="bottom-left"
            style={{ left: "25%" }}
          />
          <Handle
            type="source"
            position={Position.Bottom}
            className="w-2 h-2 !bg-green-400"
            id="bottom-right"
            style={{ left: "75%" }}
          />
        </>
      ) : (
        <>
          <Handle
            type="source"
            position={Position.Bottom}
            className="w-2 h-2 !bg-gray-400"
            id="bottom-left"
            style={{ left: "25%" }}
          />
          <Handle
            type="source"
            position={Position.Bottom}
            className="w-2 h-2 !bg-gray-400"
            id="bottom-center"
            style={{ left: "50%" }}
          />
          <Handle
            type="source"
            position={Position.Bottom}
            className="w-2 h-2 !bg-gray-400"
            id="bottom-right"
            style={{ left: "75%" }}
          />
        </>
      )}
    </>
  );
};

export default NodeHandles;
