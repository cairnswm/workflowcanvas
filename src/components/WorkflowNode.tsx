import React, { memo } from "react";
import { useNodeCommon } from "../hooks/useNodeCommon";
import NodeControls from "./node-parts/NodeControls";
import NodeHandles from "./node-parts/NodeHandles";
import NodeLabel from "./node-parts/NodeLabel";
import NodeIcon, { getNodeStyle } from "./node-parts/NodeIcon";

type NodeType = "action" | "state" | "decision" | "block" | "header" | "image";

interface ChatMessage {
  id: string;
  text: string;
  timestamp: number;
}

interface NodeData {
  label: string;
  type: NodeType;
  messages?: ChatMessage[];
}

const WorkflowNode = ({ id, data }: { id: string; data: NodeData }) => {
  const { openChat, handleDeleteClick, updateNodeLabel } = useNodeCommon(id, data);

  return (
    <div
      className={`relative px-4 py-2 shadow-lg rounded-md border-2 ${getNodeStyle(data.type)}`}
    >
      <NodeControls
        onChatClick={openChat}
        onDeleteClick={handleDeleteClick}
        messages={data.messages}
      />
      <NodeHandles type={data.type} />
      <div className="flex items-center gap-2">
        <NodeIcon type={data.type} />
        <NodeLabel label={data.label} onLabelChange={updateNodeLabel} />
      </div>
    </div>
  );
};

export default memo(WorkflowNode);
