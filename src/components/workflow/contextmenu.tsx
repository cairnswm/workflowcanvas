import React from 'react';
import { Activity, Database, GitFork, Square, Type, Image, MessageCircle, StickyNote as StickyNoteIcon } from 'lucide-react';

interface ContextMenuProps {
  x: number;
  y: number;
  onSelect: (type: 'action' | 'state' | 'decision' | 'block' | 'header' | 'image' | 'chat' | 'sticky') => void;
  onClose: () => void;
}

const ContextMenu = ({ x, y, onSelect, onClose }: ContextMenuProps) => {
  const handleSelect = (type: 'action' | 'state' | 'decision' | 'block' | 'header' | 'image' | 'chat' | 'sticky') => {
    onSelect(type);
    onClose();
  };

  return (
    <div 
      className="fixed bg-white rounded-lg shadow-lg border border-gray-200 p-2 z-50"
      style={{ left: x, top: y }}
    >
      <div className="grid grid-cols-2 gap-2">
        <button
          onClick={() => handleSelect('header')}
          className="flex items-center gap-2 p-2 hover:bg-gray-100 rounded w-full"
        >
          <Type size={20} className="text-violet-500" />
          <span>Header</span>
        </button>
        <button
          onClick={() => handleSelect('action')}
          className="flex items-center gap-2 p-2 hover:bg-gray-100 rounded w-full"
        >
          <Activity size={20} className="text-blue-500" />
          <span>Action</span>
        </button>
        <button
          onClick={() => handleSelect('state')}
          className="flex items-center gap-2 p-2 hover:bg-gray-100 rounded w-full"
        >
          <Database size={20} className="text-green-500" />
          <span>State</span>
        </button>
        <button
          onClick={() => handleSelect('decision')}
          className="flex items-center gap-2 p-2 hover:bg-gray-100 rounded w-full"
        >
          <GitFork size={20} className="text-amber-500" />
          <span>Decision</span>
        </button>
        <button
          onClick={() => handleSelect('block')}
          className="flex items-center gap-2 p-2 hover:bg-gray-100 rounded w-full"
        >
          <Square size={20} className="text-gray-500" />
          <span>Block</span>
        </button>
        <button
          onClick={() => handleSelect('image')}
          className="flex items-center gap-2 p-2 hover:bg-gray-100 rounded w-full"
        >
          <Image size={20} className="text-sky-500" />
          <span>Image</span>
        </button>
        <button
          onClick={() => handleSelect('sticky')}
          className="flex items-center gap-2 p-2 hover:bg-gray-100 rounded w-full"
        >
          <StickyNoteIcon size={20} className="text-sky-500" />
          <span>Sticky</span>
        </button>
        <button
          onClick={() => handleSelect('chat')}
          className="flex items-center gap-2 p-2 hover:bg-gray-100 rounded w-full"
        >
          <MessageCircle size={20} className="text-indigo-500" />
          <span>Chat</span>
        </button>
      </div>
    </div>
  );
};

export default ContextMenu;
