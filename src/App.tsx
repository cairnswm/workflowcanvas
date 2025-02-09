import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { WorkflowProvider } from './contexts/WorkflowContext';
import Home from './components/home';
import Workflow from './components/workflow';

const App = () => {
  return (
    <BrowserRouter>
      <WorkflowProvider>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/workflow" element={<Workflow />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </WorkflowProvider>
    </BrowserRouter>
  );
};

export default App;
