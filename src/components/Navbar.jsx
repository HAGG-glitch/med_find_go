import { Link, useNavigate } from "react-router-dom";
import {
  Search,
  Moon,
  Sun,
  Monitor,
  AlertCircle,
  AlertTriangle,
  Languages,
} from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";

export default function Navbar({ theme, setTheme }) {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/directory?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery("");
      setSearchOpen(false);
    }
  };

  return (
    <nav className="sticky top-0 z-50 bg-white dark:bg-[#0F172A] backdrop-blur-md border-b border-[#E2E8F0] dark:border-[#334155] shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-10 h-10 bg-gradient-to-br from-primary to-primary/80 rounded-xl flex items-center justify-center shadow-md group-hover:shadow-lg transition-all duration-200 group-hover:scale-105">
              <svg
                className="w-6 h-6 text-primary-foreground"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                />
              </svg>
            </div>
            <span className="text-xl font-bold text-gray-900 dark:text-white hidden sm:block group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
              {t("app_name")}
            </span>
          </Link>

          {/* Search - Desktop */}
          <form
            onSubmit={handleSearch}
            className="hidden md:flex flex-1 max-w-md mx-8"
          >
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 dark:text-gray-400 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t("search_placeholder")}
                className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-[#1E293B] border border-[#E2E8F0] dark:border-[#334155] rounded-xl text-sm text-[#111827] dark:text-[#E0F2FE] placeholder-gray-500 dark:placeholder-[#94A3B8] focus:outline-none focus:ring-2 focus:ring-amber-300 dark:focus:ring-amber-400 focus:border-amber-500 transition-all shadow-sm hover:shadow-md"
              />
            </div>
          </form>

          {/* Right Icons */}
          <div className="flex items-center gap-2">
            {/* Search Icon - Mobile */}
            <button
              onClick={() => setSearchOpen(!searchOpen)}
              className="md:hidden p-2.5 hover:bg-gray-100 dark:hover:bg-[#1E293B] rounded-xl transition-all duration-200 hover:scale-105 active:scale-95"
              aria-label="Toggle search"
            >
              <Search className="w-5 h-5 text-gray-700 dark:text-gray-300" />
            </button>

            {/* Language Toggle */}
            <button
              onClick={() => {
                const currentLang = i18n.language?.slice(0, 2) || "kr";
                const newLang = currentLang === "en" ? "kr" : "en";
                i18n.changeLanguage(newLang);
                localStorage.setItem("lang", newLang);
              }}
              className="p-2.5 hover:bg-gray-100 dark:hover:bg-[#1E293B] rounded-xl transition-all duration-200 hover:scale-105 active:scale-95"
              aria-label="Toggle language"
              title={
                (i18n.language?.slice(0, 2) || "kr") === "en"
                  ? "Switch to Krio"
                  : "Switch to English"
              }
            >
              <Languages className="w-5 h-5 text-gray-700 dark:text-gray-300" />
            </button>

            {/* Theme Toggle */}
            <div className="relative group">
              <button
                onClick={() => {
                  if (theme === "light") {
                    setTheme("dark");
                  } else if (theme === "dark") {
                    setTheme("system");
                  } else {
                    setTheme("light");
                  }
                }}
                className="p-2.5 hover:bg-gray-100 dark:hover:bg-[#1E293B] rounded-xl transition-all duration-200 hover:scale-105 active:scale-95"
                aria-label="Toggle theme"
                title={`Theme: ${
                  theme === "light"
                    ? "Light"
                    : theme === "dark"
                    ? "Dark"
                    : "System"
                }`}
              >
                {theme === "light" ? (
                  <Sun className="w-5 h-5 text-gray-700 dark:text-gray-300" />
                ) : theme === "dark" ? (
                  <Moon className="w-5 h-5 text-gray-700 dark:text-gray-300" />
                ) : (
                  <Monitor className="w-5 h-5 text-gray-700 dark:text-gray-300" />
                )}
              </button>
            </div>

            {/* Emergency Mode Toggle */}
            <Link
              to="/emergency"
              className="p-2.5 hover:bg-destructive/10 text-destructive rounded-xl transition-all duration-200 hover:scale-105 active:scale-95 relative group"
              aria-label="Emergency mode"
              title="Emergency Mode"
            >
              <AlertTriangle className="w-5 h-5" />
              <span className="absolute -top-1 -right-1 w-2 h-2 bg-destructive rounded-full animate-pulse"></span>
            </Link>
            {/* Emergency Services Link */}
            <Link
              to="/directory?emergency=true"
              className="p-2.5 hover:bg-destructive/10 text-destructive rounded-xl transition-all duration-200 hover:scale-105 active:scale-95"
              aria-label="Emergency services"
              title="Emergency Services"
            >
              <AlertCircle className="w-5 h-5" />
            </Link>
          </div>
        </div>

        {/* Mobile Search */}
        {searchOpen && (
          <form
            onSubmit={handleSearch}
            className="md:hidden pb-4 animate-in slide-in-from-top duration-200"
          >
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t("search_placeholder")}
                className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all shadow-sm"
                autoFocus
              />
            </div>
          </form>
        )}
      </div>
    </nav>
  );
}
