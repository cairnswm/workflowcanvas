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
    console.log("GETTING ENV VAR", key);
    console.log("IMPORT META", import.meta.env);
    return import.meta?.env?.[key] as string | undefined;
  } catch {
    // Handle environments where import.meta is not available (like tests)
    console.log("FALLING BACK TO PROCESS ENV");
    return process.env?.[key] as string | undefined;
  }
};

const apiKey = getEnvVar("VITE_ACCESSELF_API_KEY");
console.log("APIKEY", apiKey);
if (apiKey) {
  console.log("Setting API Key");
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
