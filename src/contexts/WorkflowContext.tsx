import React, { createContext, useContext, useReducer, ReactNode } from 'react';
import { Connection, Edge, Node, addEdge, applyNodeChanges, applyEdgeChanges } from 'reactflow';
import { WorkflowData } from '../types';

interface WorkflowState {
  nodes: Node[];
  edges: Edge[];
  filename: string;
}

type WorkflowAction =
  | { type: 'SET_NODES'; payload: Node[] }
  | { type: 'SET_EDGES'; payload: Edge[] }
  | { type: 'UPDATE_NODE_LABEL'; payload: { nodeId: string; label: string } }
  | { type: 'UPDATE_NODE_DATA'; payload: { nodeId: string; data: any } }
  | { type: 'UPDATE_EDGE_LABEL'; payload: { edgeId: string; label: string } }
  | { type: 'SET_WORKFLOW'; payload: WorkflowData & { filename?: string } }
  | { type: 'SET_FILENAME'; payload: string }
  | { type: 'APPLY_NODE_CHANGES'; payload: any[] }
  | { type: 'APPLY_EDGE_CHANGES'; payload: any[] }
  | { type: 'ADD_NODE'; payload: Node }
  | { type: 'ADD_EDGE'; payload: Connection }
  | { type: 'DELETE_NODE'; payload: string }
  | { type: 'DELETE_EDGE'; payload: string };

const initialState: WorkflowState = {
  nodes: [],
  edges: [],
  filename: 'Untitled Workflow'
};

function workflowReducer(state: WorkflowState, action: WorkflowAction): WorkflowState {
  switch (action.type) {
    case 'SET_NODES':
      return { ...state, nodes: action.payload };
    case 'SET_EDGES':
      return { ...state, edges: action.payload };
    case 'UPDATE_NODE_LABEL':
      return {
        ...state,
        nodes: state.nodes.map((node) =>
          node.id === action.payload.nodeId
            ? { ...node, data: { ...node.data, label: action.payload.label } }
            : node
        ),
      };
    case 'UPDATE_NODE_DATA':
      console.log("action.payload UPDATE_NODE_DATA", action.payload);
      return {
        ...state,
        nodes: state.nodes.map((node) =>
          node.id === action.payload.nodeId
            ? { ...node, data: { ...node.data, ...action.payload.data } }
            : node
        ),
      };
    case 'UPDATE_EDGE_LABEL':
      return {
        ...state,
        edges: state.edges.map((edge) =>
          edge.id === action.payload.edgeId
            ? { ...edge, label: action.payload.label }
            : edge
        ),
      };
    case 'SET_WORKFLOW':
      return {
        ...state,
        nodes: action.payload.nodes,
        edges: action.payload.edges,
        filename: action.payload.filename || state.filename,
      };
    case 'SET_FILENAME':
      return { ...state, filename: action.payload };
    case 'APPLY_NODE_CHANGES':
      return { ...state, nodes: applyNodeChanges(action.payload, state.nodes) };
    case 'APPLY_EDGE_CHANGES':
      return { ...state, edges: applyEdgeChanges(action.payload, state.edges) };
    case 'ADD_NODE':
      return { ...state, nodes: [...state.nodes, action.payload] };
    case 'ADD_EDGE':
      const newEdge = {
        ...action.payload,
        id: `edge-${state.edges.length + 1}`,
        label: '',
        type: 'custom'
      };
      return { ...state, edges: addEdge(newEdge, state.edges) };
    case 'DELETE_NODE':
      return {
        ...state,
        nodes: state.nodes.filter(node => node.id !== action.payload),
        edges: state.edges.filter(edge => 
          edge.source !== action.payload && edge.target !== action.payload
        ),
      };
    case 'DELETE_EDGE':
      return {
        ...state,
        edges: state.edges.filter(edge => edge.id !== action.payload),
      };
    default:
      return state;
  }
}

const WorkflowContext = createContext<{
  state: WorkflowState;
  dispatch: React.Dispatch<WorkflowAction>;
} | null>(null);

export function WorkflowProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(workflowReducer, initialState);

  return (
    <WorkflowContext.Provider value={{ state, dispatch }}>
      {children}
    </WorkflowContext.Provider>
  );
}

export function useWorkflow() {
  const context = useContext(WorkflowContext);
  if (!context) {
    throw new Error('useWorkflow must be used within a WorkflowProvider');
  }
  return context;
}