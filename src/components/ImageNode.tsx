import React, { memo, useState, useRef, useCallback } from 'react';
import { Image as LucideImage, Trash2, MessageCircle } from 'lucide-react';
import { useWorkflow } from '../contexts/WorkflowContext';
import { NodeResizer, Handle, Position, useReactFlow, Node } from 'reactflow';

interface ChatMessage {
  id: string;
  text: string;
  timestamp: number;
}

interface ImageNodeData {
  label: string;
  type: 'image';
  imageUrl?: string;
  imageData?: string;
  width?: number;
  height?: number;
  aspectRatio?: number;
  messages?: ChatMessage[];
}

interface ImageNodeProps {
  id: string;
  data: ImageNodeData;
  selected: boolean;
}

const MIN_WIDTH = 100;
const MIN_HEIGHT = 100;
const MAX_WIDTH = 500;

function ImageNode({ id, data, selected }: ImageNodeProps) {
  const [imageUrl, setImageUrl] = useState(data.imageUrl || '');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { dispatch } = useWorkflow();
  const { getNodes } = useReactFlow();

  const openChat = () => {
    const nodesArr = getNodes();
    const existingChatNode = nodesArr.find(
      (n: Node) => n.data.type === 'chat' && n.data.parentId === id
    );

    if (!existingChatNode) {
      const parentNode = nodesArr.find(
        (n: Node) => n.id === id
      );
      const nodeWidth = data.width || MIN_WIDTH;
      const offset = 20; // 20px from the right edge
      const newPosition = parentNode
        ? { x: parentNode.position.x + nodeWidth + offset, y: parentNode.position.y }
        : { x: 0, y: 0 };
      const newNodeId = `node-${nodesArr.length + 1}`;

      dispatch({
        type: 'ADD_NODE',
        payload: {
          id: newNodeId,
          type: 'chatnode',
          position: newPosition,
          data: {
            label: `${data.label} Chat`,
            type: 'chat',
            messages: data.messages || [],
            parentId: id,
          },
        },
      });
    }
  };

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const imageData = event.target?.result as string;
        const url = URL.createObjectURL(file);
        setImageUrl(url);
  
        const img = new Image(); 
        img.onload = () => {
          const ratio = img.width / img.height;
  
          const newWidth = Math.max(MIN_WIDTH, Math.min(img.width, MAX_WIDTH));
          const newHeight = newWidth / ratio;
  
          dispatch({
            type: 'UPDATE_NODE_DATA',
            payload: {
              nodeId: id,
              data: {
                ...data,
                imageUrl: url,
                imageData,
                width: newWidth,
                height: newHeight,
                aspectRatio: ratio,
              },
            },
          });
        };
  
        img.onerror = () => {
          console.error('Error loading image.');
        };
  
        img.src = url;
      };
  
      reader.onerror = () => {
        console.error('Error reading file.');
      };
  
      reader.readAsDataURL(file);
    }
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    dispatch({ type: 'DELETE_NODE', payload: id });
  };

  const onResize = useCallback((evt: import('d3').D3DragEvent<HTMLDivElement, null, { x: number; y: number }>, params: { width: number; height: number }) => {
    const { width, height } = params;
    dispatch({
      type: 'UPDATE_NODE_DATA',
      payload: {
        nodeId: id,
        data: { ...data, width, height }
      }
    });
  }, [id, data, dispatch]);

  const displayImage = data.imageData || imageUrl;

  return (
    <div className="relative">
      <NodeResizer
        isVisible={selected}
        minWidth={MIN_WIDTH}
        minHeight={MIN_HEIGHT}
        onResize={onResize}
        keepAspectRatio={displayImage ? true : false}
      />
      
      <div 
        className={`shadow-lg rounded-md border-2 border-sky-400 bg-sky-50 ${
          selected ? 'ring-2 ring-sky-500' : ''
        }`}
        style={{ 
          width: data.width || MIN_WIDTH,
          height: data.height || MIN_HEIGHT,
        }}
      >
        <div className="absolute top-2 right-2 flex gap-2 z-10">
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              openChat();
            }}
            className="p-1 hover:bg-sky-100 rounded-full bg-white text-sky-500 hover:text-sky-700 shadow-sm border border-sky-200 relative"
            title="Open Chat"
          >
            <MessageCircle size={12} />
            {data.messages?.length ? (
              <span className="absolute -bottom-1 -right-1 bg-blue-500 text-white text-[8px] rounded-full w-3 h-3 flex items-center justify-center">
                {data.messages.length}
              </span>
            ) : null}
          </button>
          <button
            onClick={() => fileInputRef.current?.click()}
            className="p-1 hover:bg-sky-100 rounded-full bg-white text-sky-500 hover:text-sky-700 shadow-sm border border-sky-200"
            title="Select Image"
          >
            <LucideImage size={12} />
          </button>
          <button
            onClick={handleDelete}
            className="p-1 hover:bg-sky-100 rounded-full bg-white text-sky-500 hover:text-sky-700 shadow-sm border border-sky-200"
            title="Delete"
          >
            <Trash2 size={12} />
          </button>
        </div>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleImageSelect}
          className="hidden"
        />
        {displayImage ? (
          <img
            src={displayImage}
            alt={data.label}
            className="w-full h-full object-contain"
            style={{ pointerEvents: 'none' }}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-sky-400">
            <LucideImage size={48} />
          </div>
        )}
        <Handle
          type="source"
          position={Position.Right}
          id="chat"
          style={{ top: "20px", right: "-4px", opacity: 0 }}
          className="!bg-sky-400 hover:opacity-100"
        />
      </div>
    </div>
  );
}

export default memo(ImageNode);
