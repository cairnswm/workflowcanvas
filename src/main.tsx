import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { ReactFlowProvider } from 'reactflow';
import App from './App.tsx';
import './index.css';
import { WorkflowProvider } from './contexts/WorkflowContext';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ReactFlowProvider>
      <WorkflowProvider>
        <App />
      </WorkflowProvider>
    </ReactFlowProvider>
  </StrictMode>
);