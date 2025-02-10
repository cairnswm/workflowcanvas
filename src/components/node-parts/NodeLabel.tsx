import React, { useState, useRef, useEffect } from "react";

interface NodeLabelProps {
  label: string;
  onLabelChange: (label: string) => void;
  className?: string;
}

const NodeLabel = ({ label, onLabelChange, className }: NodeLabelProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [labelText, setLabelText] = useState(label);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    console.log("Label Updated", labelText);
  }, [labelText]);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      const textarea = inputRef.current;
      textarea.style.height = 'auto';
      textarea.style.height = `${textarea.scrollHeight}px`;
    }
  }, [isEditing, labelText]);

  const handleDoubleClick = () => {
    setIsEditing(true);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && e.shiftKey) {
      onLabelChange(labelText);
      setIsEditing(false);
      e.preventDefault();
    }
    if (e.key === "Escape") {
      console.log("************** handleKeyDown Escape", label);
      setLabelText(label);
      setIsEditing(false);
    }
  };

  const handleBlur = () => {
    console.log("************** handleBlur", labelText);
    onLabelChange(labelText);
    setIsEditing(false);
  };

  return (
    <div className={`ml-2 ${className || ''}`}>
      {isEditing ? (
        <textarea
          ref={inputRef}
          value={labelText}
          onChange={(e) => setLabelText(e.target.value)}
          onKeyDown={handleKeyDown}
          onBlur={handleBlur}
          className="text-xs font-medium bg-transparent border-none outline-none focus:ring-2 focus:ring-blue-500 rounded px-1 w-full resize-none"
          rows={1}
          style={{ height: 'auto', minHeight: '1em' }}
        />
      ) : (
        <div
          className="text-xs font-medium cursor-pointer hover:bg-gray-50 px-1 rounded w-full whitespace-pre-wrap"
          onDoubleClick={handleDoubleClick}
        >
          {label}
        </div>
      )}
    </div>
  );
};

export default NodeLabel;
