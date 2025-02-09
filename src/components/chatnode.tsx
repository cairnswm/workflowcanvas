import React, { memo, useCallback, useEffect, useRef, useState } from "react";
import { NodeResizer, Handle, Position, OnResize } from "reactflow";
import { useWorkflow } from "../contexts/WorkflowContext";
import { useNodeCommon } from "../hooks/useNodeCommon";
import ChatInput from "./node-parts/ChatInput";
import ChatMessages from "./node-parts/ChatMessages";
import { Connection } from "../types";

interface ChatNodeData {
  label: string;
  type: "chat";
  messages?: {
    id: string;
    text: string;
    timestamp: number;
  }[];
  parentId?: string;
  width?: number;
  height?: number;
  isOpen?: boolean;
}

interface ChatNodeProps {
  id: string;
  data: ChatNodeData;
  selected: boolean;
}

const ChatNode = ({ id, data, selected }: ChatNodeProps) => {
  const { state } = useWorkflow();
  const { handleDeleteClick, dispatch } = useNodeCommon(id, data);
  const prevParentIdRef = useRef<string | undefined>(undefined);
  const [dimensions, setDimensions] = useState({
    width: data.width || 300,
    height: data.height || 150,
  });

  useEffect(() => {
    if (data.parentId !== prevParentIdRef.current) {
      prevParentIdRef.current = data.parentId;
      if (data.parentId) {
        const parentNode = state.nodes.find((node) => node.id === data.parentId);
        if (parentNode) {
          const connection: Connection = {
            source: data.parentId,
            target: id,
            sourceHandle: "chat",
            targetHandle: "chat",
            type: "chatEdge",
          };
          dispatch({
            type: "ADD_EDGE",
            payload: connection,
          });
        }
      }
    }
  }, [data.parentId, state.nodes, dispatch, id]);

  const onResize: OnResize = useCallback(
    (_, params) => {
      const { width, height } = params;
      setDimensions({ width, height });
      dispatch({
        type: "UPDATE_NODE_DATA",
        payload: {
          nodeId: id,
          data: { ...data, width, height },
        },
      });
    },
    [id, data, dispatch]
  );

  const handleSendMessage = useCallback(
    (text: string) => {
      const newMessage = {
        id: `msg-${Date.now()}`,
        text,
        timestamp: Date.now(),
      };
      const messages = data.messages ? [...data.messages, newMessage] : [newMessage];
      if (data.parentId) {
        dispatch({
          type: "UPDATE_NODE_DATA",
          payload: { nodeId: data.parentId, data: { messages } },
        });
      }
      dispatch({
        type: "UPDATE_NODE_DATA",
        payload: { nodeId: id, data: { ...data, messages } },
      });
    },
    [data, dispatch, id]
  );

  return (
    <div className="relative">
      <Handle
        id="chat"
        type="target"
        position={Position.Left}
        style={{ top: "20px", background: "#555" }}
      />
      <NodeResizer
        isVisible={selected}
        minWidth={200}
        minHeight={150}
        onResize={onResize}
      />
      <div
        className="relative border rounded shadow-lg bg-white"
        style={{
          width: `${dimensions.width}px`,
          height: `${dimensions.height}px`,
        }}
      >
        <div className="flex justify-between items-center bg-gray-100 px-2 py-1">
          <div className="font-bold">{data.label}</div>
          <button
            onClick={handleDeleteClick}
            className="text-gray-500 hover:text-gray-700"
          >
            X
          </button>
        </div>
        <ChatMessages messages={data.messages} />
        <ChatInput onSendMessage={handleSendMessage} />
      </div>
    </div>
  );
};

export default memo(ChatNode);
