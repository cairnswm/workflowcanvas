export interface WorkflowNode {
  id: string;
  type: 'workflowNode';
  position: { x: number; y: number };
  data: { label: string };
}

export interface WorkflowData {
  nodes: WorkflowNode[];
  edges: any[];
}