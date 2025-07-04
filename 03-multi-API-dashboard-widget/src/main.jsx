import App from "@/App.jsx";
import "@/index.css";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

createRoot(document.getElementById("root"), {
  onCaughtError: (error, errorInfo) => {
    console.error("React caught an error:", error, errorInfo);
  },
}).render(
  <StrictMode>
    <App />
  </StrictMode>
);
