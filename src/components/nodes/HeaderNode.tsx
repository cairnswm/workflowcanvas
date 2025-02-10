import React, { memo, useState, useRef, useEffect } from 'react';
import { useWorkflow } from '../../contexts/WorkflowContext';
import { Trash2 } from 'lucide-react';

interface NodeData {
  label: string;
  type: 'header';
}

function HeaderNode({ id, data }: { id: string; data: NodeData }) {
  const [isEditing, setIsEditing] = useState(false);
  const [labelText, setLabelText] = useState(data.label);
  const inputRef = useRef<HTMLInputElement>(null);
  const { dispatch } = useWorkflow();

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
    dispatch({ type: 'DELETE_NODE', payload: id });
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      dispatch({ type: 'UPDATE_NODE_LABEL', payload: { nodeId: id, label: labelText } });
      setIsEditing(false);
    }
    if (e.key === 'Escape') {
      setLabelText(data.label);
      setIsEditing(false);
    }
  };

  const handleBlur = () => {
    dispatch({ type: 'UPDATE_NODE_LABEL', payload: { nodeId: id, label: labelText } });
    setIsEditing(false);
  };

  return (
    <div className="relative">
      <button
        onClick={handleDeleteClick}
        className="absolute -top-2 right-0 p-0.5 hover:bg-gray-100 rounded-full bg-white text-gray-500 hover:text-gray-700 shadow-sm border border-gray-200 text-xs"
      >
        <Trash2 size={8} />
      </button>
      <div className="flex items-center justify-center">
        {isEditing ? (
          <input
            ref={inputRef}
            type="text"
            value={labelText}
            onChange={(e) => setLabelText(e.target.value)}
            onKeyDown={handleKeyDown}
            onBlur={handleBlur}
            className="text-xl font-bold bg-transparent border-none outline-none focus:ring-2 focus:ring-blue-500 rounded text-center"
            style={{ width: Math.max(120, labelText.length * 12) + 'px' }}
          />
        ) : (
          <div 
            className="text-xl font-bold cursor-pointer hover:bg-gray-50 px-2 py-1 rounded text-center"
            onDoubleClick={handleDoubleClick}
          >
            {data.label}
          </div>
        )}
      </div>
    </div>
  );
}

export default memo(HeaderNode);