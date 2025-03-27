import React, { useEffect } from "react";
import { setApiKey } from "./utils/accessElf";
import { Routes, Route, Navigate } from "react-router-dom";
import { WorkflowProvider } from "./contexts/WorkflowContext";
import Home from "./pages/home";
import Workflow from "./pages/workflow";
import { accessElf } from "./utils/accessElf";

const App = () => {
  useEffect(() => {
    if (import.meta.env.VITE_ACCESSELF_API_KEY) {
      setApiKey(import.meta.env.VITE_ACCESSELF_API_KEY);
    }
  }, []);

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
