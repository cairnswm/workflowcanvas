import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FileEdit } from 'lucide-react';

interface WorkflowHeaderProps {
  filename: string;
  onFilenameEdit: () => void;
}

const WorkflowHeader: React.FC<WorkflowHeaderProps> = ({ filename, onFilenameEdit }) => {
  const navigate = useNavigate();

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={() => navigate('/')}
        className="p-2 bg-white text-gray-700 rounded hover:bg-gray-100 border border-gray-200"
        title="Go to Home"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
          <polyline points="9 22 9 12 15 12 15 22" />
        </svg>
      </button>
      <span className="text-lg font-semibold text-gray-700">
        {filename}
      </span>
      <button
        onClick={onFilenameEdit}
        className="p-1 hover:bg-gray-100 rounded"
        title="Edit filename"
      >
        <FileEdit size={16} />
      </button>
    </div>
  );
};

export default WorkflowHeader;
