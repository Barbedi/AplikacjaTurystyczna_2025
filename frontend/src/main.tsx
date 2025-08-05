import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import "leaflet/dist/leaflet.css";

import AuthProvider from "./store/AuthProvider.tsx";
import ToastModalProvider from "./store/ToastModalProvider.tsx";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ToastModalProvider>
      <AuthProvider>
        <App />
      </AuthProvider>
    </ToastModalProvider>
  </React.StrictMode>,
);
