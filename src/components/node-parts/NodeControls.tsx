import React from "react";
import { MessageCircle, Trash2, Settings, Image } from "lucide-react";
import { ChatMessage } from "../../hooks/useNodeCommon";

interface NodeControlsProps {
  onChatClick: (e: React.MouseEvent) => void;
  onDeleteClick: (e: React.MouseEvent) => void;
  onSettingsClick?: (e: React.MouseEvent) => void;
  onImageClick?: (e: React.MouseEvent) => void;
  messages?: ChatMessage[];
}

const NodeControls = ({ onChatClick, onDeleteClick, onSettingsClick, onImageClick, messages }: NodeControlsProps) => (
  <div className="absolute -top-2 right-0 flex gap-1">
    <button
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        onChatClick(e);
      }}
      className="p-1 hover:bg-gray-100 rounded-full bg-white text-gray-500 hover:text-gray-700 shadow-sm border border-gray-200 text-xs relative"
      title="Open Chat"
    >
      <MessageCircle size={8} />
      {messages?.length ? (
        <span className="absolute -bottom-1 -right-1 bg-blue-500 text-white text-[8px] rounded-full w-3 h-3 flex items-center justify-center">
          {messages.length}
        </span>
      ) : null}
    </button>
    {onSettingsClick && (
      <button
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          onSettingsClick(e);
        }}
        className="p-1 hover:bg-gray-100 rounded-full bg-white text-gray-500 hover:text-gray-700 shadow-sm border border-gray-200 text-xs"
        title="Settings"
      >
        <Settings size={8} />
      </button>
    )}
    {onImageClick && (
      <button
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          onImageClick(e);
        }}
        className="p-1 hover:bg-sky-100 rounded-full bg-white text-sky-500 hover:text-sky-700 shadow-sm border border-sky-200 text-xs"
        title="Select Image"
      >
        <Image size={8} />
      </button>
    )}
    <button
      onClick={onDeleteClick}
      className="p-1 hover:bg-gray-100 rounded-full bg-white text-gray-500 hover:text-gray-700 shadow-sm border border-gray-200 text-xs"
      title="Delete"
    >
      <Trash2 size={8} />
    </button>
  </div>
);

export default NodeControls;
