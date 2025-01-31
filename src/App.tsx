import React, { useCallback } from 'react';
import ReactFlow, {
  Background,
  Controls,
  Panel,
  NodeTypes,
  EdgeTypes,
  useReactFlow,
  useViewport,
  getRectOfNodes,
  getTransformForBounds,
} from 'reactflow';
import 'reactflow/dist/style.css';
import { Download, Upload, FileEdit, Activity, Database, GitFork, Square, Type, FilePlus2, ImageDown, Image } from 'lucide-react';
import { useWorkflow } from './contexts/WorkflowContext';
import WorkflowNode from './components/WorkflowNode';
import CustomEdge from './components/CustomEdge';
import Minimap from './components/Minimap';
import HeaderNode from './components/HeaderNode';
import ImageNode from './components/ImageNode';
import { toPng } from 'html-to-image';
import { exportWorkflow } from './utils';

const nodeTypes: NodeTypes = {
  workflowNode: WorkflowNode,
  headerNode: HeaderNode,
  imageNode: ImageNode,
};

const edgeTypes: EdgeTypes = {
  custom: CustomEdge,
};

const MIN_IMAGE_WIDTH = 3000;
const MIN_IMAGE_HEIGHT = 2000;
const PADDING = 100;

function App() {
  const { state, dispatch } = useWorkflow();
  const { nodes, edges, filename } = state;
  const { screenToFlowPosition, getNodes } = useReactFlow();
  const { x, y, zoom } = useViewport();

  const addNewNode = useCallback((type: 'action' | 'state' | 'decision' | 'block' | 'header' | 'image') => {
    const viewportCenter = screenToFlowPosition({
      x: window.innerWidth / 2,
      y: window.innerHeight / 2,
    });

    const newNode = {
      id: `node-${nodes.length + 1}`,
      type: type === 'header' ? 'headerNode' : type === 'image' ? 'imageNode' : 'workflowNode',
      position: viewportCenter,
      data: { 
        label: type === 'header' 
          ? 'Header Text'
          : type === 'image'
          ? 'Image'
          : `${type.charAt(0).toUpperCase() + type.slice(1)} ${nodes.length + 1}`,
        type 
      },
    };
    dispatch({ type: 'ADD_NODE', payload: newNode });
  }, [nodes.length, dispatch, screenToFlowPosition]);

  const handleExport = () => {
    exportWorkflow(nodes, edges, filename);
  };

  const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const workflow = JSON.parse(e.target?.result as string);
          dispatch({ type: 'SET_WORKFLOW', payload: workflow });
        } catch (error) {
          console.error('Error importing workflow:', error);
        }
      };
      reader.readAsText(file);
    }
  };

  const handleFilenameEdit = () => {
    const newFilename = prompt('Enter new filename:', filename);
    if (newFilename) {
      dispatch({ type: 'SET_FILENAME', payload: newFilename });
    }
  };

  const handleNewWorkflow = () => {
    if (window.confirm('Are you sure you want to clear the current workflow?')) {
      dispatch({ type: 'SET_WORKFLOW', payload: { nodes: [], edges: [] } });
    }
  };

  const handleExportImage = () => {
    const nodesBounds = getRectOfNodes(getNodes());
    if (!nodesBounds) return;

    // Create a temporary container for the workflow
    const tempContainer = document.createElement('div');
    tempContainer.style.position = 'absolute';
    tempContainer.style.left = '-9999px';
    tempContainer.style.width = `${nodesBounds.width + PADDING * 2}px`;
    tempContainer.style.height = `${nodesBounds.height + PADDING * 2}px`;
    document.body.appendChild(tempContainer);

    // Clone the ReactFlow instance without controls
    const reactFlowInstance = document.querySelector('.react-flow') as HTMLElement;
    const clone = reactFlowInstance.cloneNode(true) as HTMLElement;
    
    // Remove UI elements from clone
    clone.querySelectorAll('.react-flow__panel').forEach(el => el.remove());
    clone.querySelectorAll('.react-flow__minimap').forEach(el => el.remove());
    clone.querySelectorAll('.react-flow__controls').forEach(el => el.remove());
    
    tempContainer.appendChild(clone);

    // Calculate dimensions
    let width = Math.max(MIN_IMAGE_WIDTH, nodesBounds.width * 2);
    let height = Math.max(MIN_IMAGE_HEIGHT, nodesBounds.height * 2);
    
    const aspectRatio = nodesBounds.width / nodesBounds.height;
    if (width / height > aspectRatio) {
      width = height * aspectRatio;
    } else {
      height = width / aspectRatio;
    }

    const scale = Math.min(width / nodesBounds.width, height / nodesBounds.height);
    const xOffset = (width - nodesBounds.width * scale) / 2;
    const yOffset = (height - nodesBounds.height * scale) / 2;

    toPng(clone, {
      backgroundColor: '#ffffff',
      width: Math.round(width),
      height: Math.round(height),
      style: {
        width: `${Math.round(width)}px`,
        height: `${Math.round(height)}px`,
        transform: `translate(${xOffset}px, ${yOffset}px) scale(${scale})`,
        transformOrigin: 'top left',
      },
    })
      .then((dataUrl) => {
        const a = document.createElement('a');
        a.setAttribute('download', `${filename}.png`);
        a.setAttribute('href', dataUrl);
        a.click();
        document.body.removeChild(tempContainer);
      })
      .catch((error) => {
        console.error('Error exporting image:', error);
        document.body.removeChild(tempContainer);
      });
  };

  return (
    <div className="w-screen h-screen">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={(changes) => dispatch({ type: 'APPLY_NODE_CHANGES', payload: changes })}
        onEdgesChange={(changes) => dispatch({ type: 'APPLY_EDGE_CHANGES', payload: changes })}
        onConnect={(connection) => dispatch({ type: 'ADD_EDGE', payload: connection })}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        defaultEdgeOptions={{ type: 'custom' }}
        fitView
      >
        <Background />
        <Controls />
        <Minimap />
        <Panel position="top-left" className="flex items-center gap-2">
          <span className="text-lg font-semibold text-gray-700">{filename}</span>
          <button
            onClick={handleFilenameEdit}
            className="p-1 hover:bg-gray-100 rounded"
            title="Edit filename"
          >
            <FileEdit size={16} />
          </button>
        </Panel>
        <Panel position="top-right" className="flex gap-2">
          <div className="flex gap-2">
            <button
              onClick={() => addNewNode('header')}
              className="p-2 bg-violet-500 text-white rounded hover:bg-violet-600"
              title="Add Header"
            >
              <Type size={20} />
            </button>
            <button
              onClick={() => addNewNode('action')}
              className="p-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              title="Add Action Step"
            >
              <Activity size={20} />
            </button>
            <button
              onClick={() => addNewNode('state')}
              className="p-2 bg-green-500 text-white rounded hover:bg-green-600"
              title="Add State Step"
            >
              <Database size={20} />
            </button>
            <button
              onClick={() => addNewNode('decision')}
              className="p-2 bg-amber-500 text-white rounded hover:bg-amber-600"
              title="Add Decision Step"
            >
              <GitFork size={20} />
            </button>
            <button
              onClick={() => addNewNode('block')}
              className="p-2 bg-gray-500 text-white rounded hover:bg-gray-600"
              title="Add Block"
            >
              <Square size={20} />
            </button>
            <button
              onClick={() => addNewNode('image')}
              className="p-2 bg-sky-500 text-white rounded hover:bg-sky-600"
              title="Add Image"
            >
              <Image size={20} />
            </button>
          </div>
          <div className="flex gap-2 ml-4 border-l pl-4">
            <button
              onClick={handleNewWorkflow}
              className="p-2 bg-white text-gray-700 rounded hover:bg-gray-100 border border-gray-200"
              title="New Workflow"
            >
              <FilePlus2 size={20} />
            </button>
            <button
              onClick={handleExport}
              className="p-2 bg-white text-gray-700 rounded hover:bg-gray-100 border border-gray-200"
              title="Export JSON"
            >
              <Download size={20} />
            </button>
            <label className="p-2 bg-white text-gray-700 rounded hover:bg-gray-100 border border-gray-200 cursor-pointer"
              title="Import JSON"
            >
              <Upload size={20} />
              <input
                type="file"
                accept=".json"
                onChange={handleImport}
                className="hidden"
              />
            </label>
            <button
              onClick={handleExportImage}
              className="p-2 bg-white text-gray-700 rounded hover:bg-gray-100 border border-gray-200"
              title="Export as PNG"
            >
              <ImageDown size={20} />
            </button>
          </div>
        </Panel>
      </ReactFlow>
    </div>
  );
}

export default App;