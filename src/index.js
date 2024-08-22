import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { ProviderNotification } from "./Components/ContextNotification/ContextNotification";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <ProviderNotification>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </ProviderNotification>
  </React.StrictMode>
);
