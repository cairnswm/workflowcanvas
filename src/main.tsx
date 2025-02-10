import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { ReactFlowProvider } from "reactflow";
import App from "./App.tsx";
import "./index.css";
import { BrowserRouter } from "react-router-dom";
import { TourProvider } from "./contexts/TourContext";

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
