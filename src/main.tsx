import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { ReactFlowProvider } from "reactflow";
import App from "./App.tsx";
import "./index.css";
import { BrowserRouter } from "react-router-dom";
import { TourProvider } from "./contexts/TourContext";
import { accessElf } from "./utils/accessElf";

const getEnvVar = (key: string): string | undefined => {
  try {
    return import.meta?.env?.[key] as string | undefined;
  } catch {
    // Handle environments where import.meta is not available (like tests)
    return process.env?.[key] as string | undefined;
  }
};

const apiKey = getEnvVar("VITE_ACCESSELF_API_KEY");
if (apiKey) {
  accessElf.setApiKey(apiKey);
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ReactFlowProvider>
      <BrowserRouter basename="/workflowcanvas">
        <TourProvider>
          <App />
        </TourProvider>
      </BrowserRouter>
    </ReactFlowProvider>
  </StrictMode>
);
