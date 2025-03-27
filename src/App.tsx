import React, { useEffect } from "react";
import { setApiKey } from "./utils/accessElf";
// Safe access to Vite environment variables
const getEnvVar = (key: string): string | undefined => {
  try {
    return import.meta?.env?.[key] as string | undefined;
  } catch {
    // Handle environments where import.meta is not available (like tests)
    return process.env?.[key] as string | undefined;
  }
};
import { Routes, Route, Navigate } from "react-router-dom";
import { WorkflowProvider } from "./contexts/WorkflowContext";
import Home from "./pages/home";
import Workflow from "./pages/workflow";
import { accessElf } from "./utils/accessElf";

const App = () => {
  useEffect(() => {
    const apiKey = getEnvVar("VITE_ACCESSELF_API_KEY");
    if (apiKey) {
      setApiKey(apiKey);
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
