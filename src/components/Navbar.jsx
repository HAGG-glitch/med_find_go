import { Link } from "react-router-dom"
import { Search, Moon, Sun, AlertCircle } from "lucide-react"
import { useState } from "react"

export default function Navbar({ theme, toggleTheme }) {
  const [searchOpen, setSearchOpen] = useState(false)

  return (
    <nav className="sticky top-0 z-50 bg-card/80 backdrop-blur-md border-b border-border/50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-10 h-10 bg-gradient-to-br from-primary to-primary/80 rounded-xl flex items-center justify-center shadow-md group-hover:shadow-lg transition-all duration-200 group-hover:scale-105">
              <svg className="w-6 h-6 text-primary-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                />
              </svg>
            </div>
            <span className="text-xl font-bold text-foreground hidden sm:block group-hover:text-primary transition-colors">
              Med-Find Salone
            </span>
          </Link>

          {/* Search - Desktop */}
          <div className="hidden md:flex flex-1 max-w-md mx-8">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground pointer-events-none" />
              <input
                type="text"
                placeholder="Search hospital, service or district..."
                className="w-full pl-10 pr-4 py-2.5 bg-muted/50 border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all shadow-sm hover:shadow-md"
              />
            </div>
          </div>

          {/* Right Icons */}
          <div className="flex items-center gap-2">
            {/* Search Icon - Mobile */}
            <button
              onClick={() => setSearchOpen(!searchOpen)}
              className="md:hidden p-2.5 hover:bg-muted rounded-xl transition-all duration-200 hover:scale-105 active:scale-95"
              aria-label="Toggle search"
            >
              <Search className="w-5 h-5 text-foreground" />
            </button>

            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2.5 hover:bg-muted rounded-xl transition-all duration-200 hover:scale-105 active:scale-95"
              aria-label="Toggle theme"
            >
              {theme === "light" ? (
                <Moon className="w-5 h-5 text-foreground" />
              ) : (
                <Sun className="w-5 h-5 text-foreground" />
              )}
            </button>

            {/* Emergency Icon */}
            <Link
              to="/directory?emergency=true"
              className="p-2.5 hover:bg-destructive/10 text-destructive rounded-xl transition-all duration-200 hover:scale-105 active:scale-95 relative group"
              aria-label="Emergency services"
            >
              <AlertCircle className="w-5 h-5" />
              <span className="absolute -top-1 -right-1 w-2 h-2 bg-destructive rounded-full animate-pulse"></span>
            </Link>
          </div>
        </div>

        {/* Mobile Search */}
        {searchOpen && (
          <div className="md:hidden pb-4 animate-in slide-in-from-top duration-200">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground pointer-events-none" />
              <input
                type="text"
                placeholder="Search hospital, service or district..."
                className="w-full pl-10 pr-4 py-2.5 bg-muted/50 border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all shadow-sm"
                autoFocus
              />
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
