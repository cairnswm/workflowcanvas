import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, Send, Trash2 } from 'lucide-react';
import { useReactFlow } from 'reactflow';

interface ChatMessage {
  id: string;
  text: string;
  timestamp: number;
}

interface ChatPanelProps {
  nodeId: string;
  messages: ChatMessage[];
  onAddMessage: (message: string) => void;
  onDeleteMessage: (messageId: string) => void;
  onClose: () => void;
  position?: { x: number; y: number };
  onPositionChange?: (position: { x: number; y: number }) => void;
}

function ChatPanel({ 
  nodeId, 
  messages, 
  onAddMessage, 
  onDeleteMessage,
  onClose,
  position,
  onPositionChange 
}: ChatPanelProps) {
  const [newMessage, setNewMessage] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const { getNode } = useReactFlow();
  
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newMessage.trim()) {
      onAddMessage(newMessage.trim());
      setNewMessage('');
    }
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest('.chat-header')) {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(true);
      setDragStart({
        x: e.clientX - (position?.x || 0),
        y: e.clientY - (position?.y || 0)
      });
    }
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (isDragging && onPositionChange) {
      e.preventDefault();
      e.stopPropagation();
      const newX = e.clientX - dragStart.x;
      const newY = e.clientY - dragStart.y;
      onPositionChange({ x: newX, y: newY });
    }
  };

  const handleMouseUp = (e: MouseEvent) => {
    if (isDragging) {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(false);
    }
  };

  useEffect(() => {
    const handleGlobalMouseMove = (e: MouseEvent) => {
      if (isDragging) {
        handleMouseMove(e);
      }
    };

    const handleGlobalMouseUp = (e: MouseEvent) => {
      if (isDragging) {
        handleMouseUp(e);
      }
    };

    if (isDragging) {
      window.addEventListener('mousemove', handleGlobalMouseMove, true);
      window.addEventListener('mouseup', handleGlobalMouseUp, true);
      return () => {
        window.removeEventListener('mousemove', handleGlobalMouseMove, true);
        window.removeEventListener('mouseup', handleGlobalMouseUp, true);
      };
    }
  }, [isDragging, dragStart]);

  const node = getNode(nodeId);
  const defaultPosition = {
    x: (node?.width || 0) + 20,
    y: 0
  };

  const currentPosition = position || defaultPosition;

  return (
    <div
      ref={panelRef}
      className="fixed bg-white rounded-lg shadow-xl border border-gray-200 z-50"
      style={{
        left: currentPosition.x,
        top: currentPosition.y,
        width: '256px',
        cursor: isDragging ? 'grabbing' : 'default',
        pointerEvents: 'auto'
      }}
      onMouseDown={handleMouseDown}
      onClick={e => e.stopPropagation()}
    >
      <div className="chat-header flex items-center justify-between p-3 border-b border-gray-200 cursor-grab">
        <div className="flex items-center gap-2">
          <MessageCircle size={16} className="text-gray-500" />
          <span className="text-sm font-medium">Chat</span>
          {messages.length > 0 && (
            <span className="bg-blue-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
              {messages.length}
            </span>
          )}
        </div>
        <button
          onClick={e => {
            e.stopPropagation();
            onClose();
          }}
          className="text-gray-400 hover:text-gray-600"
        >
          ×
        </button>
      </div>
      <div className="h-64 overflow-y-auto p-3 space-y-2">
        {messages.map((message) => (
          <div key={message.id} className="group bg-gray-50 rounded-lg p-2 relative">
            <p className="text-sm text-gray-700 pr-6">{message.text}</p>
            <span className="text-xs text-gray-400">
              {new Date(message.timestamp).toLocaleTimeString()}
            </span>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDeleteMessage(message.id);
              }}
              className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-gray-200 rounded"
            >
              <Trash2 size={12} className="text-gray-500" />
            </button>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      <form onSubmit={handleSubmit} className="p-3 border-t border-gray-200">
        <div className="flex gap-2">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 text-sm border border-gray-200 rounded-md px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
            onClick={e => e.stopPropagation()}
          />
          <button
            type="submit"
            className="p-1 bg-blue-500 text-white rounded-md hover:bg-blue-600"
            disabled={!newMessage.trim()}
          >
            <Send size={14} />
          </button>
        </div>
      </form>
    </div>
  );
}

export default ChatPanel;