import { validateMonorepo } from "@end-of-line/shared";
// ABOUTME: Client application entry point with React and PixiJS initialization
// ABOUTME: Validates monorepo setup by importing from @end-of-line/shared
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";

// Validate monorepo setup
if (!validateMonorepo()) {
  throw new Error("Monorepo validation failed");
}

const rootElement = document.getElementById("root");
if (!rootElement) {
  throw new Error("Root element not found");
}

ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
