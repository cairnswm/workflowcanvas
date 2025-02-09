import React, { memo, useState, useRef, useEffect } from "react";
import { Handle, Position, useReactFlow, Node } from "reactflow";
import { useWorkflow } from "../contexts/WorkflowContext";
import {
  Activity,
  Database,
  GitFork,
  Square,
  Trash2,
  MessageCircle,
} from "lucide-react";

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

function WorkflowNode({ id, data }: { id: string; data: NodeData }) {
  const reactFlowInstance = useReactFlow();

  const [isEditing, setIsEditing] = useState(false);
  const [labelText, setLabelText] = useState(data.label);
  const inputRef = useRef<HTMLInputElement>(null);
  const { dispatch } = useWorkflow();

  const openChat = () => {
    const nodesArr = reactFlowInstance.getNodes();
    const parentNode = nodesArr.find(
      (n: Node) => n.id === id
    );
    const nodeWidth = parentNode?.width || 150;
    const offset = 20; // 20px from the right edge
    const newPosition = parentNode
      ? { x: parentNode.position.x + nodeWidth + offset, y: parentNode.position.y }
      : { x: 0, y: 0 };
    const newNodeId = `node-${nodesArr.length + 1}`;

    dispatch({
      type: "ADD_NODE",
      payload: {
        id: newNodeId,
        type: "chatnode",
        position: newPosition,
        data: {
          label: `${data.label} Chat`,
          type: "chat",
          messages: data.messages || [],
          parentId: id,
        },
      },
    });

    setTimeout(() => {
      const nodes = reactFlowInstance.getNodes();
      const chatNode = nodes.find((n: Node) => n.id === newNodeId);
      if (chatNode) {
        reactFlowInstance.addEdges([
          {
            id: `${id}-to-${newNodeId}`,
            source: id,
            target: newNodeId,
            sourceHandle: "chat",
            targetHandle: "target",
            type: "chatEdge"
          },
        ]);
      }
    }, 100);
  };

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isEditing]);

  const handleDoubleClick = () => {
    setIsEditing(true);
  };

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    dispatch({ type: "DELETE_NODE", payload: id });
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      dispatch({
        type: "UPDATE_NODE_LABEL",
        payload: { nodeId: id, label: labelText },
      });
      setIsEditing(false);
    }
    if (e.key === "Escape") {
      setLabelText(data.label);
      setIsEditing(false);
    }
  };

  const handleBlur = () => {
    dispatch({
      type: "UPDATE_NODE_LABEL",
      payload: { nodeId: id, label: labelText },
    });
    setIsEditing(false);
  };

  const getNodeStyle = () => {
    switch (data.type) {
      case "action":
        return "bg-white border-blue-400";
      case "state":
        return "bg-gray-50 border-green-400";
      case "decision":
        return "bg-white border-amber-400";
      case "block":
        return "bg-gray-200 border-gray-400";
      case "image":
        return "bg-sky-50 border-sky-400";
      default:
        return "bg-white border-gray-200";
    }
  };

  const getIcon = () => {
    switch (data.type) {
      case "action":
        return <Activity size={14} className="text-blue-500" />;
      case "state":
        return <Database size={14} className="text-green-500" />;
      case "decision":
        return <GitFork size={14} className="text-amber-500" />;
      case "block":
        return <Square size={14} className="text-gray-500" />;
      default:
        return null;
    }
  };

  if (data.type === "decision") {
    return (
      <>
        <div
          className={`relative px-4 py-2 shadow-lg rounded-md border-2 ${getNodeStyle()}`}
        >
          <Handle
            type="target"
            position={Position.Top}
            className="w-2 h-2 !bg-blue-400"
          />
          <div className="absolute -top-2 right-0 flex gap-1">
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                openChat();
              }}
              className="p-1 hover:bg-gray-100 rounded-full bg-white text-gray-500 hover:text-gray-700 shadow-sm border border-gray-200 text-xs relative"
              title="Open Chat"
            >
              <MessageCircle size={8} />
              {data.messages?.length ? (
                <span className="absolute -bottom-1 -right-1 bg-blue-500 text-white text-[8px] rounded-full w-3 h-3 flex items-center justify-center">
                  {data.messages.length}
                </span>
              ) : null}
            </button>
            <button
              onClick={handleDeleteClick}
              className="p-1 hover:bg-gray-100 rounded-full bg-white text-gray-500 hover:text-gray-700 shadow-sm border border-gray-200 text-xs"
            >
              <Trash2 size={8} />
            </button>
          </div>
          <Handle
            type="source"
            position={Position.Right}
            id="chat"
          style={{ top: "20px", right: "-4px", opacity: 0 }}
          className="!bg-sky-400 hover:opacity-100"
          />
          <div className="flex items-center gap-2">
            {getIcon()}
            <div>
              {isEditing ? (
                <input
                  ref={inputRef}
                  type="text"
                  value={labelText}
                  onChange={(e) => setLabelText(e.target.value)}
                  onKeyDown={handleKeyDown}
                  onBlur={handleBlur}
                  className="text-xs font-medium bg-transparent border-none outline-none focus:ring-2 focus:ring-blue-500 rounded"
                  style={{ width: Math.max(60, labelText.length * 6) + "px" }}
                />
              ) : (
                <div
                  className="text-xs font-medium cursor-pointer hover:bg-gray-50 rounded"
                  onDoubleClick={handleDoubleClick}
                >
                  {data.label}
                </div>
              )}
            </div>
          </div>
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
        </div>
      </>
    );
  }

  return (
    <>
      <div
        className={`relative px-4 py-2 shadow-lg rounded-md border-2 ${getNodeStyle()}`}
      >
        <Handle
          type="target"
          position={Position.Top}
          className="w-2 h-2 !bg-blue-400"
        />
        <div className="absolute -top-2 right-0 flex gap-1">
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              openChat();
            }}
            className="p-1 hover:bg-gray-100 rounded-full bg-white text-gray-500 hover:text-gray-700 shadow-sm border border-gray-200 text-xs relative"
            title="Open Chat"
          >
            <MessageCircle size={8} />
            {data.messages?.length ? (
              <span className="absolute -bottom-1 -right-1 bg-blue-500 text-white text-[8px] rounded-full w-3 h-3 flex items-center justify-center">
                {data.messages.length}
              </span>
            ) : null}
          </button>
          <button
            onClick={handleDeleteClick}
            className="p-1 hover:bg-gray-100 rounded-full bg-white text-gray-500 hover:text-gray-700 shadow-sm border border-gray-200 text-xs"
          >
            <Trash2 size={8} />
          </button>
        </div>
        <div className="flex items-center gap-2">
          {getIcon()}
          <div className="ml-2">
            {isEditing ? (
              <input
                ref={inputRef}
                type="text"
                value={labelText}
                onChange={(e) => setLabelText(e.target.value)}
                onKeyDown={handleKeyDown}
                onBlur={handleBlur}
                className="text-xs font-medium bg-transparent border-none outline-none focus:ring-2 focus:ring-blue-500 rounded px-1"
                style={{ width: Math.max(80, labelText.length * 6) + "px" }}
              />
            ) : (
              <div
                className="text-xs font-medium cursor-pointer hover:bg-gray-50 px-1 rounded"
                onDoubleClick={handleDoubleClick}
              >
                {data.label}
              </div>
            )}
          </div>
        </div>
        <Handle
          type="source"
          position={Position.Right}
          id="chat"
          style={{ top: "20px", right: "-4px", opacity: 0 }}
          className="!bg-sky-400 hover:opacity-100"
        />
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
      </div>
    </>
  );
}

export default memo(WorkflowNode);
