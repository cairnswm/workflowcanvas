import React, { useState, useRef, useEffect } from "react";

interface NodeLabelProps {
  label: string;
  onLabelChange: (label: string) => void;
}

const NodeLabel = ({ label, onLabelChange }: NodeLabelProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [labelText, setLabelText] = useState(label);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isEditing]);

  const handleDoubleClick = () => {
    setIsEditing(true);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      onLabelChange(labelText);
      setIsEditing(false);
    }
    if (e.key === "Escape") {
      setLabelText(label);
      setIsEditing(false);
    }
  };

  const handleBlur = () => {
    onLabelChange(labelText);
    setIsEditing(false);
  };

  return (
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
          {label}
        </div>
      )}
    </div>
  );
};

export default NodeLabel;
