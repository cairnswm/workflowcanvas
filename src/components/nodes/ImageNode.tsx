import React, { memo, useRef, useState, useCallback } from "react";
import { Image as LucideImage } from "lucide-react";
import { NodeResizer, OnResize } from "reactflow";
import { useNodeCommon } from "../../hooks/useNodeCommon";
import NodeControls from "../node-parts/NodeControls";
import NodeHandles from "../node-parts/NodeHandles";
import { getNodeStyle } from "../node-parts/NodeIcon";
import { ChatMessage } from "../../hooks/useNodeCommon";

interface ImageNodeData {
  label: string;
  type: "image";
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

const ImageNode = ({ id, data, selected }: ImageNodeProps) => {
  const [imageUrl, setImageUrl] = useState(data.imageUrl || "");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { openChat, handleDeleteClick, dispatch } = useNodeCommon(id, data);

  const handleImageSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
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
            type: "UPDATE_NODE_DATA",
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
        img.src = url;
      };
      reader.readAsDataURL(file);
    }
  }, [id, data, dispatch]);

  const onResize: OnResize = useCallback((evt, params) => {
    const { width, height } = params;
    dispatch({
      type: "UPDATE_NODE_DATA",
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
        className={`shadow-lg rounded-md border-2 ${getNodeStyle(data.type)} ${
          selected ? "ring-2 ring-sky-500" : ""
        }`}
        style={{ 
          width: data.width || MIN_WIDTH,
          height: data.height || MIN_HEIGHT,
        }}
      >
        <NodeControls
          onChatClick={openChat}
          onDeleteClick={handleDeleteClick}
          onImageClick={() => fileInputRef.current?.click()}
          messages={data.messages}
        />
        <NodeHandles type={data.type} />
        
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
            style={{ pointerEvents: "none" }}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-sky-400">
            <LucideImage size={48} />
          </div>
        )}
      </div>
    </div>
  );
};

export default memo(ImageNode);
