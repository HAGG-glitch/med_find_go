import { Routes, Route } from "react-router-dom"
import { useState, useEffect } from "react"
import Navbar from "./components/Navbar"
import Footer from "./components/Footer"
import FloatingEmergencyButton from "./components/FloatingEmergencyButton"
import OfflineIndicator from "./components/OfflineIndicator"
import HomePage from "./pages/HomePage"
import DirectoryPage from "./pages/DirectoryPage"
import HospitalDetailPage from "./pages/HospitalDetailPage"
import AdminPanel from "./pages/AdminPanel"

function App() {
  const [theme, setTheme] = useState(() => {
    const saved = localStorage.getItem("theme")
    return saved || "light"
  })

  useEffect(() => {
    localStorage.setItem("theme", theme)
    if (theme === "dark") {
      document.documentElement.classList.add("dark")
    } else {
      document.documentElement.classList.remove("dark")
    }
  }, [theme])

  const toggleTheme = () => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"))
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar theme={theme} toggleTheme={toggleTheme} />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/directory" element={<DirectoryPage />} />
          <Route path="/hospital/:id" element={<HospitalDetailPage />} />
          <Route path="/admin" element={<AdminPanel />} />
        </Routes>
      </main>
      <Footer />
      <FloatingEmergencyButton />
      <OfflineIndicator />
    </div>
  )
}

export default App
