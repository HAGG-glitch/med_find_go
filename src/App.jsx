import { Routes, Route } from "react-router-dom";
import { useState, useEffect } from "react";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import FloatingEmergencyButton from "./components/FloatingEmergencyButton";
import OfflineIndicator from "./components/OfflineIndicator";
import EmergencyMode from "./components/EmergencyMode";
import HomePage from "./pages/HomePage";
import DirectoryPage from "./pages/DirectoryPage";
import HospitalDetailPage from "./pages/HospitalDetailPage";
import AdminPanel from "./pages/AdminPanel";

function App() {
  const [theme, setTheme] = useState(() => {
    const saved = localStorage.getItem("theme");
    return saved || "light"; // Default to light instead of system
  });

  // Apply theme based on selection
  useEffect(() => {
    localStorage.setItem("theme", theme);

    const applyTheme = () => {
      let isDark = false;

      if (theme === "dark") {
        isDark = true;
      } else if (theme === "light") {
        isDark = false;
      } else if (theme === "system") {
        // System preference
        isDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      }

      // Force update by removing and adding class
      const html = document.documentElement;

      // Use a more forceful approach - remove all dark classes first
      while (html.classList.contains("dark")) {
        html.classList.remove("dark");
      }

      // Then add if needed
      if (isDark) {
        html.classList.add("dark");
      }

      // Force a reflow to ensure the change is applied
      void html.offsetHeight;
    };

    // Apply immediately
    applyTheme();

    // Listen for system theme changes when theme is set to "system"
    let mediaQuery = null;
    let handleChange = null;

    if (theme === "system") {
      mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
      handleChange = () => {
        const isDark = mediaQuery.matches;
        const html = document.documentElement;
        html.classList.remove("dark");
        if (isDark) {
          requestAnimationFrame(() => {
            html.classList.add("dark");
          });
        }
      };
      mediaQuery.addEventListener("change", handleChange);
    }

    return () => {
      if (mediaQuery && handleChange) {
        mediaQuery.removeEventListener("change", handleChange);
      }
    };
  }, [theme]);

  const setThemeMode = (mode) => {
    setTheme(mode);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAFC] dark:bg-[#0F172A] text-[#111827] dark:text-[#E0F2FE] transition-colors duration-300">
      <Navbar theme={theme} setTheme={setThemeMode} />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/directory" element={<DirectoryPage />} />
          <Route path="/hospital/:id" element={<HospitalDetailPage />} />
          <Route path="/admin" element={<AdminPanel />} />
          <Route path="/emergency" element={<EmergencyMode />} />
        </Routes>
      </main>
      <Footer />
      <FloatingEmergencyButton />
      <OfflineIndicator />
    </div>
  );
}

export default App;
