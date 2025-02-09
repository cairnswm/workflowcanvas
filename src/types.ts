import { Connection as BaseConnection, Node, Edge } from 'reactflow';

export interface Connection extends BaseConnection {
  type?: string;
}

export interface WorkflowData {
  nodes: Node[];
  edges: Edge[];
  filename?: string;
}
