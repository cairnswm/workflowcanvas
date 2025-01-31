import React, { memo, useState, useRef, useCallback } from 'react';
import { Image as LucideImage, Trash2, MessageCircle } from 'lucide-react';
import { useWorkflow } from '../contexts/WorkflowContext';
import { NodeResizer } from 'reactflow';
import ChatPortal from './ChatPortal';

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
  chatPosition?: { x: number; y: number };
}

interface ImageNodeProps {
  id: string;
  data: ImageNodeData;
  selected: boolean;
}

const MIN_WIDTH = 100;
const MIN_HEIGHT = 100;
const MAX_WIDTH = 500;
const MAX_HEIGHT = 500;

function ImageNode({ id, data, selected }: ImageNodeProps) {
  const [imageUrl, setImageUrl] = useState(data.imageUrl || '');
  const [aspectRatio, setAspectRatio] = useState(data.aspectRatio || 1);
  const [showChat, setShowChat] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { dispatch } = useWorkflow();

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
          setAspectRatio(ratio);
  
          // Update node data with new image and dimensions
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
  
        img.src = url; // Trigger loading
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

  const handleAddMessage = (message: string) => {
    const newMessage = {
      id: `msg-${Date.now()}`,
      text: message,
      timestamp: Date.now(),
    };
    
    const currentMessages = data.messages || [];
    dispatch({
      type: 'UPDATE_NODE_DATA',
      payload: {
        nodeId: id,
        data: {
          ...data,
          messages: [...currentMessages, newMessage],
        },
      },
    });
  };

  const handleDeleteMessage = (messageId: string) => {
    const currentMessages = data.messages || [];
    dispatch({
      type: 'UPDATE_NODE_DATA',
      payload: {
        nodeId: id,
        data: {
          ...data,
          messages: currentMessages.filter(msg => msg.id !== messageId),
        },
      },
    });
  };

  const handleChatPositionChange = (position: { x: number; y: number }) => {
    dispatch({
      type: 'UPDATE_NODE_DATA',
      payload: {
        nodeId: id,
        data: {
          ...data,
          chatPosition: position,
        },
      },
    });
  };

  const onResize = useCallback((evt: any, params: { width: number; height: number }) => {
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
    <>
      <div className="relative">
        <NodeResizer
          isVisible={selected}
          minWidth={MIN_WIDTH}
          minHeight={MIN_HEIGHT}
          onResize={onResize}
          keepAspectRatio={displayImage ? true : false}
          aspectRatio={aspectRatio}
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
                setShowChat(!showChat);
              }}
              className="p-1 hover:bg-sky-100 rounded-full bg-white text-sky-500 hover:text-sky-700 shadow-sm border border-sky-200 relative"
              title="Chat"
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
        </div>
      </div>
      {showChat && (
        <ChatPortal
          nodeId={id}
          messages={data.messages || []}
          onAddMessage={handleAddMessage}
          onDeleteMessage={handleDeleteMessage}
          onClose={() => setShowChat(false)}
          position={data.chatPosition}
          onPositionChange={handleChatPositionChange}
        />
      )}
    </>
  );
}

export default memo(ImageNode);