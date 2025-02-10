import React, { useState } from "react";
import { useNodeCommon } from "../../hooks/useNodeCommon";
import NodeControls from "../node-parts/NodeControls";
import NodeHandles from "../node-parts/NodeHandles";
import NodeLabel from "../node-parts/NodeLabel";
import { ChatMessage } from "../../hooks/useNodeCommon";

interface StickyNoteData {
  label: string;
  type: "sticky";
  color?: string;
  messages?: ChatMessage[];
}

const StickyNote = ({ id, data }: { id: string; data: StickyNoteData }) => {
  const { openChat, handleDeleteClick, updateNodeLabel, dispatch } = useNodeCommon(id, data);
  const [showSettings, setShowSettings] = useState(false);

  const handleColorChange = (color: string) => {
    dispatch({
      type: "UPDATE_NODE_DATA",
      payload: {
        nodeId: id,
        data: { color }
      }
    });
    setShowSettings(false);
  };

  const colors = [
    "#fef3c7",
    "#fee2e2",
    "#f3e8ff",
    "#dbeafe",
    "#dcfce7",
    "#fef9c3"
  ];

  return (
    <>
      <div
        className="shadow-lg rounded-md border-2 aspect-square"
        style={{
          backgroundColor: data.color || "#fef3c7",
          minWidth: "180px",
          minHeight: "150px",
          width: "100%",
          height: "95%",
          resize: "both",
          position: "relative"
        }}
      >
        <NodeControls
          onChatClick={openChat}
          onDeleteClick={handleDeleteClick}
          onSettingsClick={() => setShowSettings(true)}
          messages={data.messages}
        />
        <NodeHandles type="sticky" />
        <div className="flex items-center gap-2 p-1 w-full h-full">
          <NodeLabel label={data.label} onLabelChange={updateNodeLabel} className="w-full break-words" />
        </div>
      </div>

      {showSettings && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 max-w-md w-full mx-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Sticky Note Settings</h3>
              <button
                onClick={() => setShowSettings(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                ×
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {colors.map((color) => (
                <button
                  key={color}
                  className="w-10 h-10 rounded-full border-2 border-gray-300 hover:border-blue-500 transition-colors"
                  style={{ backgroundColor: color }}
                  onClick={() => handleColorChange(color)}
                />
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default React.memo(StickyNote);
