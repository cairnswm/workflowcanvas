import React, { useCallback, useState, MouseEvent } from "react";
import ReactFlow, {
  Background,
  Controls,
  Panel,
  NodeTypes,
  EdgeTypes,
  useReactFlow,
  useViewport,
  getRectOfNodes,
} from "reactflow";
import "reactflow/dist/style.css";
import ChatNode from "../components/nodes/chatnode";
import ChatEdge from "../components/nodes/chatedge";
import { useWorkflow } from "../contexts/WorkflowContext";
import WorkflowNode from "../components/nodes/WorkflowNode";
import CustomEdge from "../components/nodes/CustomEdge";
import Minimap from "../components/minimap/Minimap";
import HeaderNode from "../components/nodes/HeaderNode";
import ImageNode from "../components/nodes/ImageNode";
import StickyNote from "../components/nodes/StickyNote";
import ContextMenu from "../components/workflow/contextmenu";
import { toPng } from "html-to-image";
import { exportWorkflow } from "../utils";
import WorkflowHeader from "../components/header/workflowheader";
import WorkflowToolbar from "../components/header/workflowtoolbar";
import { accessElf } from "../utils/accessElf";

const nodeTypes: NodeTypes = {
  workflowNode: WorkflowNode,
  headerNode: HeaderNode,
  imageNode: ImageNode,
  chatnode: ChatNode,
  stickyNote: StickyNote,
};

const edgeTypes: EdgeTypes = {
  custom: CustomEdge,
  chatEdge: ChatEdge,
};

const MIN_IMAGE_WIDTH = 3000;
const MIN_IMAGE_HEIGHT = 2000;
const PADDING = 100;

const Workflow: React.FC = () => {
  const [contextMenu, setContextMenu] = useState<{ x: number; y: number } | null>(null);
  const { state, dispatch } = useWorkflow();
  const { nodes, edges, filename } = state;
  const { screenToFlowPosition, getNodes } = useReactFlow();
  useViewport();

  accessElf.track("workflow");

  const addNewNode = useCallback((
    type: "action" | "state" | "decision" | "block" | "header" | "image" | "chat" | "sticky"
  ) => {
    const viewportCenter = screenToFlowPosition({
      x: window.innerWidth / 2,
      y: window.innerHeight / 2,
    });

    const newNode = {
      id: `node-${nodes.length + 1}`,
      type:
        type === "header"
          ? "headerNode"
          : type === "image"
          ? "imageNode"
          : type === "chat"
          ? "chatnode"
          : type === "sticky"
          ? "stickyNote"
          : "workflowNode",
      position: viewportCenter,
      data: {
        label:
          type === "header"
            ? "Header Text"
            : type === "image"
            ? "Image"
            : type === "chat"
            ? `Chat Node ${nodes.length + 1}`
            : type === "sticky"
            ? `Sticky Note ${nodes.length + 1}`
            : `${type.charAt(0).toUpperCase() + type.slice(1)} ${nodes.length + 1}`,
        type,
      },
    };
    dispatch({ type: "ADD_NODE", payload: newNode });
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
          dispatch({ type: "SET_WORKFLOW", payload: workflow });
        } catch (error) {
          console.error("Error importing workflow:", error);
        }
      };
      reader.readAsText(file);
    }
  };

  const handleFilenameEdit = () => {
    const newFilename = prompt("Enter new filename:", filename);
    if (newFilename) {
      dispatch({ type: "SET_FILENAME", payload: newFilename });
    }
  };

  const handleNewWorkflow = () => {
    if (window.confirm("Are you sure you want to clear the current workflow?")) {
      dispatch({ type: "SET_WORKFLOW", payload: { nodes: [], edges: [] } });
    }
  };

  const handleExportImage = () => {
    const nodesBounds = getRectOfNodes(getNodes());
    if (!nodesBounds) return;

    const tempContainer = document.createElement("div");
    tempContainer.style.position = "absolute";
    tempContainer.style.left = "-9999px";
    tempContainer.style.width = `${nodesBounds.width + PADDING * 2}px`;
    tempContainer.style.height = `${nodesBounds.height + PADDING * 2}px`;
    document.body.appendChild(tempContainer);

    const reactFlowInstance = document.querySelector(
      ".react-flow"
    ) as HTMLElement;
    const clone = reactFlowInstance.cloneNode(true) as HTMLElement;

    clone.querySelectorAll(".react-flow__panel").forEach((el) => el.remove());
    clone.querySelectorAll(".react-flow__minimap").forEach((el) => el.remove());
    clone
      .querySelectorAll(".react-flow__controls")
      .forEach((el) => el.remove());

    tempContainer.appendChild(clone);

    let width = Math.max(MIN_IMAGE_WIDTH, nodesBounds.width * 2);
    let height = Math.max(MIN_IMAGE_HEIGHT, nodesBounds.height * 2);

    const aspectRatio = nodesBounds.width / nodesBounds.height;
    if (width / height > aspectRatio) {
      width = height * aspectRatio;
    } else {
      height = width / aspectRatio;
    }

    const scale = Math.min(
      width / nodesBounds.width,
      height / nodesBounds.height
    );
    const xOffset = (width - nodesBounds.width * scale) / 2;
    const yOffset = (height - nodesBounds.height * scale) / 2;

    toPng(clone, {
      backgroundColor: "#ffffff",
      width: Math.round(width),
      height: Math.round(height),
      style: {
        width: `${Math.round(width)}px`,
        height: `${Math.round(height)}px`,
        transform: `translate(${xOffset}px, ${yOffset}px) scale(${scale})`,
        transformOrigin: "top left",
      },
    })
      .then((dataUrl) => {
        const a = document.createElement("a");
        a.setAttribute("download", `${filename}.png`);
        a.setAttribute("href", dataUrl);
        a.click();
        document.body.removeChild(tempContainer);
      })
      .catch((error) => {
        console.error("Error exporting image:", error);
        document.body.removeChild(tempContainer);
      });
  };

  return (
    <div className="w-screen h-screen">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={(changes) =>
          dispatch({ type: "APPLY_NODE_CHANGES", payload: changes })
        }
        onEdgesChange={(changes) =>
          dispatch({ type: "APPLY_EDGE_CHANGES", payload: changes })
        }
        onConnect={(connection) =>
          dispatch({ type: "ADD_EDGE", payload: connection })
        }
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        defaultEdgeOptions={{ type: "custom" }}
        onPaneClick={(event: MouseEvent) => {
          event.preventDefault();
          setContextMenu({ x: event.clientX, y: event.clientY });
        }}
        onPaneContextMenu={(event: MouseEvent) => {
          event.stopPropagation();
          event.preventDefault();
          setContextMenu({ x: event.clientX, y: event.clientY });
        }}
        fitView
      >
        <Background />
        <Controls />
        <Minimap />
        <Panel position="top-left">
          <WorkflowHeader filename={filename} onFilenameEdit={handleFilenameEdit} />
        </Panel>
        <Panel position="top-right">
          <WorkflowToolbar
            onAddNode={addNewNode}
            onNewWorkflow={handleNewWorkflow}
            onExport={handleExport}
            onImport={handleImport}
            onExportImage={handleExportImage}
          />
        </Panel>
        {contextMenu && (
          <>
            <div
              className="fixed inset-0 z-40"
              onClick={() => setContextMenu(null)}
            />
            <ContextMenu
              x={contextMenu.x}
              y={contextMenu.y}
              onSelect={addNewNode}
              onClose={() => setContextMenu(null)}
            />
          </>
        )}
      </ReactFlow>
    </div>
  );
};

export default Workflow;
