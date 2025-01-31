import React, { useState, useRef, useEffect } from 'react';
import { EdgeProps, getBezierPath } from 'reactflow';
import { useWorkflow } from '../contexts/WorkflowContext';
import { Edit2, Trash2 } from 'lucide-react';

function CustomEdge({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  label,
}: EdgeProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [labelText, setLabelText] = useState(label as string);
  const inputRef = useRef<HTMLInputElement>(null);
  const { dispatch } = useWorkflow();

  const [edgePath, labelX, labelY] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isEditing]);

  const handleEditClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsEditing(true);
  };

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    dispatch({ type: 'DELETE_EDGE', payload: id });
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      dispatch({ type: 'UPDATE_EDGE_LABEL', payload: { edgeId: id, label: labelText } });
      setIsEditing(false);
    }
    if (e.key === 'Escape') {
      setLabelText(label as string);
      setIsEditing(false);
    }
  };

  const handleBlur = () => {
    dispatch({ type: 'UPDATE_EDGE_LABEL', payload: { edgeId: id, label: labelText } });
    setIsEditing(false);
  };

  return (
    <>
      <path
        id={id}
        className="react-flow__edge-path"
        d={edgePath}
        strokeWidth={2}
        stroke="#b1b1b7"
      />
      <foreignObject
        width={200}
        height={50}
        x={labelX - 100}
        y={labelY - 25}
        className="edgebutton-foreignobject"
        requiredExtensions="http://www.w3.org/1999/xhtml"
      >
        <div className="flex flex-col items-center justify-center gap-1">
          <div className="flex items-center gap-1">
            {isEditing ? (
              <input
                ref={inputRef}
                type="text"
                value={labelText || ''}
                onChange={(e) => setLabelText(e.target.value)}
                onKeyDown={handleKeyDown}
                onBlur={handleBlur}
                className="text-xs bg-white border border-gray-300 rounded px-2 py-1 outline-none focus:ring-2 focus:ring-blue-500"
                style={{ width: Math.max(60, (labelText?.length || 0) * 6) + 'px' }}
              />
            ) : labelText ? (
              <div
                className="text-xs bg-white px-2 py-1 rounded border border-transparent cursor-pointer hover:border-gray-300"
                onClick={handleEditClick}
              >
                {labelText}
              </div>
            ) : (
              <div className="flex items-center gap-1">
                <button
                  onClick={handleEditClick}
                  className="flex items-center text-xs bg-white pt-2 rounded border border-transparent hover:border-gray-300 text-gray-500 hover:text-gray-700"
                >
                  <Edit2 size={8} />
                </button>
                <button
                  onClick={handleDeleteClick}
                  className="flex items-center text-xs bg-white pt-2 rounded border border-transparent hover:border-gray-300 text-gray-500 hover:text-gray-700"
                >
                  <Trash2 size={8} />
                </button>
              </div>
            )}
            {labelText && (
              <button
                onClick={handleDeleteClick}
                className="flex items-center text-xs bg-white px-1.5 py-1 rounded border border-transparent hover:border-gray-300 text-gray-500 hover:text-gray-700"
              >
                <Trash2 size={10} />
              </button>
            )}
          </div>
        </div>
      </foreignObject>
    </>
  );
}

export default CustomEdge;