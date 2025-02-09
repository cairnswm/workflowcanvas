import { useCallback } from "react";
import { useReactFlow, Node } from "reactflow";
import { useWorkflow } from "../contexts/WorkflowContext";

export interface ChatMessage {
  id: string;
  text: string;
  timestamp: number;
}

export interface NodeData {
  label: string;
  type: string;
  messages?: ChatMessage[];
}

export const useNodeCommon = (id: string, data: NodeData) => {
  const reactFlowInstance = useReactFlow();
  const { dispatch } = useWorkflow();

  const openChat = useCallback(() => {
    const nodesArr = reactFlowInstance.getNodes();
    const parentNode = nodesArr.find(
      (n: Node) => n.id === id
    );
    const nodeWidth = parentNode?.width || 150;
    const offset = 20;
    const newPosition = parentNode
      ? { x: parentNode.position.x + nodeWidth + offset, y: parentNode.position.y }
      : { x: 0, y: 0 };
    const newNodeId = `node-${nodesArr.length + 1}`;

    dispatch({
      type: "ADD_NODE",
      payload: {
        id: newNodeId,
        type: "chatnode",
        position: newPosition,
        data: {
          label: `${data.label} Chat`,
          type: "chat",
          messages: data.messages || [],
          parentId: id,
        },
      },
    });

    setTimeout(() => {
      const nodes = reactFlowInstance.getNodes();
      const chatNode = nodes.find((n: Node) => n.id === newNodeId);
      if (chatNode) {
        reactFlowInstance.addEdges([
          {
            id: `${id}-to-${newNodeId}`,
            source: id,
            target: newNodeId,
            sourceHandle: "chat",
            targetHandle: "target",
            type: "chatEdge"
          },
        ]);
      }
    }, 100);
  }, [id, data.label, data.messages, dispatch, reactFlowInstance]);

  const handleDeleteClick = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    dispatch({ type: "DELETE_NODE", payload: id });
  }, [dispatch, id]);

  const updateNodeLabel = useCallback((label: string) => {
    dispatch({
      type: "UPDATE_NODE_LABEL",
      payload: { nodeId: id, label },
    });
  }, [dispatch, id]);

  return {
    openChat,
    handleDeleteClick,
    updateNodeLabel,
    dispatch,
  };
};
