import React from 'react';
import {
  Activity,
  Database,
  GitFork,
  Square,
  Type,
  FilePlus2,
  ImageDown,
  Image,
  MessageCircle,
  StickyNote as StickyNoteIcon,
  Download,
  Upload,
} from 'lucide-react';
import TourStep from '../tour/tourstep';

interface WorkflowToolbarProps {
  onAddNode: (type: 'action' | 'state' | 'decision' | 'block' | 'header' | 'image' | 'chat' | 'sticky') => void;
  onNewWorkflow: () => void;
  onExport: () => void;
  onImport: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onExportImage: () => void;
}

const WorkflowToolbar: React.FC<WorkflowToolbarProps> = ({
  onAddNode,
  onNewWorkflow,
  onExport,
  onImport,
  onExportImage,
}) => {
  return (
    <div className="flex gap-2">
      <div className="flex gap-2">
        <button
          onClick={() => onAddNode('header')}
          className="p-2 bg-violet-500 text-white rounded hover:bg-violet-600"
          title="Add Header"
        >
          <Type size={20} />
        </button>
        <button
          onClick={() => onAddNode('action')}
          className="p-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          title="Add Action Step"
        >
          <Activity size={20} />
        </button>
        <button
          onClick={() => onAddNode('state')}
          className="p-2 bg-green-500 text-white rounded hover:bg-green-600"
          title="Add State Step"
        >
          <Database size={20} />
        </button>
        <button
          onClick={() => onAddNode('decision')}
          className="p-2 bg-amber-500 text-white rounded hover:bg-amber-600"
          title="Add Decision Step"
        >
          <GitFork size={20} />
        </button>
        <button
          onClick={() => onAddNode('block')}
          className="p-2 bg-gray-500 text-white rounded hover:bg-gray-600"
          title="Add Block"
        >
          <Square size={20} />
        </button>
        <button
          onClick={() => onAddNode('image')}
          className="p-2 bg-sky-500 text-white rounded hover:bg-sky-600"
          title="Add Image"
        >
          <Image size={20} />
        </button>
        <button
          onClick={() => onAddNode('sticky')}
          className="p-2 bg-sky-500 text-white rounded hover:bg-sky-600"
          title="Add Sticky Note"
        >
          <StickyNoteIcon size={20} />
        </button>
        <button
          onClick={() => onAddNode('chat')}
          className="p-2 bg-indigo-500 text-white rounded hover:bg-indigo-600"
          title="Add Chat Node"
        >
          <MessageCircle size={20} />
        </button>
      </div>
      <div className="flex gap-2 ml-4 border-l pl-4">
        <button
          onClick={onNewWorkflow}
          className="p-2 bg-white text-gray-700 rounded hover:bg-gray-100 border border-gray-200"
          title="New Workflow"
        >
          <FilePlus2 size={20} />
          <TourStep step={1} />
        </button>
        <button
          onClick={onExport}
          className="p-2 bg-white text-gray-700 rounded hover:bg-gray-100 border border-gray-200"
          title="Export JSON"
        >
          <Download size={20} />
          <TourStep step={2} />
        </button>
        <label
          className="p-2 bg-white text-gray-700 rounded hover:bg-gray-100 border border-gray-200 cursor-pointer"
          title="Import JSON"
        >
          <Upload size={20} />
          <TourStep step={3} />
          <input
            type="file"
            accept=".json"
            onChange={onImport}
            className="hidden"
          />
        </label>
        <button
          onClick={onExportImage}
          className="p-2 bg-white text-gray-700 rounded hover:bg-gray-100 border border-gray-200"
          title="Export as PNG"
        >
          <ImageDown size={20} />
          <TourStep step={4} />
        </button>
      </div>
    </div>
  );
};

export default WorkflowToolbar;
