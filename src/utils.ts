import { Node, Edge } from 'reactflow';

export const exportWorkflow = (nodes: Node[], edges: Edge[], filename: string) => {
  const data = {
    nodes,
    edges,
    filename,
  };
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `${filename}.json`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

