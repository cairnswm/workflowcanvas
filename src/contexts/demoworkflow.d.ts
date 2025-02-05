declare module './demoworkflow' {
  import { Node, Edge } from 'reactflow';
  interface DemoWorkflow {
    nodes: Node[];
    edges: Edge[];
    filename?: string;
  }
  const demoWorkflow: DemoWorkflow;
  export default demoWorkflow;
}
