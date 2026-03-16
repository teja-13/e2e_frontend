import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import ShaderBackground from "./components/ui/shader-background";
import App from "./App";
import "./App.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Router>
      <Routes>
        <Route path="/shader-debug" element={<ShaderBackground />} />
        <Route path="/*" element={<App />} />
      </Routes>
    </Router>
  </React.StrictMode>
);