import React, { memo, useState, useCallback, useEffect, useRef } from 'react';
import { NodeResizer, Handle, Position } from 'reactflow';
import { Connection } from '../types';
import { useWorkflow } from '../contexts/WorkflowContext';

interface ChatMessage {
  id: string;
  text: string;
  timestamp: number;
}

interface ChatNodeData {
  label: string;
  type: 'chat';
  messages?: ChatMessage[];
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
  const { dispatch, state } = useWorkflow();
  const [inputText, setInputText] = useState('');
  const prevParentIdRef = useRef<string | undefined>(undefined);

  useEffect(() => {
    if (data.parentId !== prevParentIdRef.current) {
      prevParentIdRef.current = data.parentId;
      if (data.parentId) {
        console.log('Parent ID:', data.parentId);
        const parentNode = state.nodes.find(node => node.id === data.parentId);
        if (parentNode) {
          console.log('Parent Node Data:', parentNode.data);
          const connection: Connection = {
            source: data.parentId,
            target: id,
            sourceHandle: "chat",
            targetHandle: "chat",
            type: 'chatEdge'
          };
          dispatch({
            type: 'ADD_EDGE',
            payload: connection
          });
        }
      }
    }
  }, [data.parentId, state.nodes]);

  const [dimensions, setDimensions] = useState({ 
    width: data.width || 300, 
    height: data.height || 150 
  });

  const onResize = useCallback((evt: import('d3').D3DragEvent<HTMLDivElement, null, { x: number; y: number }>, params: { width: number; height: number }) => {
    const { width, height } = params;
    setDimensions({ width, height });
    dispatch({
      type: 'UPDATE_NODE_DATA',
      payload: {
        nodeId: id,
        data: { ...data, width, height }
      }
    });
  }, [id, data, dispatch]);

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    dispatch({ type: 'DELETE_NODE', payload: id });
  };

  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && inputText.trim()) {
      const newMessage = {
        id: `msg-${Date.now()}`,
        text: inputText,
        timestamp: Date.now(),
      };
      const messages = data.messages ? [...data.messages, newMessage] : [newMessage];
      if (data.parentId) {
        dispatch({
          type: 'UPDATE_NODE_DATA',
          payload: { nodeId: data.parentId, data: { messages } }
        });
      }
      dispatch({
        type: 'UPDATE_NODE_DATA',
        payload: { nodeId: id, data: { ...data, messages } }
      });
      setInputText('');
    }
  };

  return (
    <div className="relative">
      <Handle
        id="chat"
        type="target"
        position={Position.Left}
        style={{ top: '20px', background: '#555' }}
      />
      <NodeResizer
        isVisible={selected}
        minWidth={200}
        minHeight={150}
        onResize={onResize}
      />
      <div
        className="relative border rounded shadow-lg bg-white"
        style={{ width: `${dimensions.width}px`, height: `${dimensions.height}px` }}
      >
        <div className="flex justify-between items-center bg-gray-100 px-2 py-1">
          <div className="font-bold">{data.label}</div>
          <div className="flex gap-2">
            <button 
              onClick={handleDelete} 
              className="text-gray-500 hover:text-gray-700"
            >
              X
            </button>
          </div>
        </div>
        <div className="p-2 overflow-y-auto" style={{ height: 'calc(100% - 70px)' }}>
          {data.messages && data.messages.map(msg => (
            <div key={msg.id} className="text-sm mb-1">{msg.text}</div>
          ))}
        </div>
        <div className="absolute bottom-0 left-0 right-4">
          <input
            type="text"
            value={inputText}
            onChange={e => setInputText(e.target.value)}
            onKeyDown={handleInputKeyDown}
            className="w-full border-t px-2 py-1 text-sm outline-none"
            placeholder="Type a message and press Enter"
          />
        </div>
      </div>
    </div>
  );
};

export default memo(ChatNode);
