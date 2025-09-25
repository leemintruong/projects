
import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import "./styles/index.css"; // Tailwind CSS
import "./styles/tailwind.css"; // Tailwind CSS
import { AuthProvider } from "./contexts/AuthContext";

const container = document.getElementById("root");
const root = createRoot(container);

root.render(
  <React.StrictMode>
    <AuthProvider>
      <App />
    </AuthProvider>
  </React.StrictMode>
);
