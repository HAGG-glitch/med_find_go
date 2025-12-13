import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { ErrorBoundary } from "./components/ErrorBoundary";
import App from "./App";
import "./index.css";
import "./i18n";

// Ensure no dark class is set initially - let App component handle it
const savedTheme = localStorage.getItem("theme") || "light";
if (savedTheme === "light") {
  document.documentElement.classList.remove("dark");
} else if (savedTheme === "dark") {
  document.documentElement.classList.add("dark");
} else {
  // System preference
  const isDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  if (isDark) {
    document.documentElement.classList.add("dark");
  } else {
    document.documentElement.classList.remove("dark");
  }
}

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <ErrorBoundary>
        <App />
      </ErrorBoundary>
    </BrowserRouter>
  </React.StrictMode>
);
