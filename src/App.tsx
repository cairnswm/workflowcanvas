import React, { useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { WorkflowProvider } from "./contexts/WorkflowContext";
import Home from "./pages/home";
import Workflow from "./pages/workflow";
import { accessElf } from "./utils/accessElf";

const App = () => {

  accessElf.track();

  return (
    <div data-testid="app">
      <WorkflowProvider>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/workflow" element={<Workflow />} />
          <Route path="*" element={<Navigate to="/" replace />} />

        </Routes>
      </WorkflowProvider>
    </div>
  );
};

export default App;
