import { useState, useRef, useEffect } from "react"
import { Search, X, MapPin } from "lucide-react"
import { useNavigate } from "react-router-dom"

/**
 * Typeahead Search Component
 * Fuzzy search with autocomplete suggestions
 */
export default function TypeaheadSearch({ hospitals = [], onSelect, className = "" }) {
  const [query, setQuery] = useState("")
  const [suggestions, setSuggestions] = useState([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [selectedIndex, setSelectedIndex] = useState(-1)
  const inputRef = useRef(null)
  const suggestionsRef = useRef(null)
  const navigate = useNavigate()

  // Fuzzy search function
  const fuzzyMatch = (str, pattern) => {
    const strLower = str.toLowerCase()
    const patternLower = pattern.toLowerCase()
    let patternIdx = 0

    for (let i = 0; i < strLower.length && patternIdx < patternLower.length; i++) {
      if (strLower[i] === patternLower[patternIdx]) {
        patternIdx++
      }
    }

    return patternIdx === patternLower.length
  }

  // Calculate relevance score
  const calculateScore = (hospital, query) => {
    const queryLower = query.toLowerCase()
    let score = 0

    // Exact name match
    if (hospital.name.toLowerCase().includes(queryLower)) {
      score += 100
    }
    // Starts with query
    if (hospital.name.toLowerCase().startsWith(queryLower)) {
      score += 50
    }
    // District match
    if (hospital.district.toLowerCase().includes(queryLower)) {
      score += 30
    }
    // Service match
    if (hospital.services.some((s) => s.toLowerCase().includes(queryLower))) {
      score += 20
    }
    // Address match
    if (hospital.address.toLowerCase().includes(queryLower)) {
      score += 10
    }
    // Fuzzy match
    if (fuzzyMatch(hospital.name, query)) {
      score += 5
    }

    return score
  }

  // Update suggestions based on query
  useEffect(() => {
    if (query.trim().length === 0) {
      setSuggestions([])
      setShowSuggestions(false)
      return
    }

    const matched = hospitals
      .map((hospital) => ({
        hospital,
        score: calculateScore(hospital, query),
      }))
      .filter((item) => item.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 5)
      .map((item) => item.hospital)

    setSuggestions(matched)
    setShowSuggestions(matched.length > 0)
    setSelectedIndex(-1)
  }, [query, hospitals])

  // Handle input change
  const handleChange = (e) => {
    setQuery(e.target.value)
    setShowSuggestions(true)
  }

  // Handle suggestion selection
  const handleSelect = (hospital) => {
    setQuery("")
    setShowSuggestions(false)
    if (onSelect) {
      onSelect(hospital)
    } else {
      navigate(`/hospital/${hospital.id}`)
    }
  }

  // Handle keyboard navigation
  const handleKeyDown = (e) => {
    if (!showSuggestions || suggestions.length === 0) return

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault()
        setSelectedIndex((prev) => (prev < suggestions.length - 1 ? prev + 1 : prev))
        break
      case "ArrowUp":
        e.preventDefault()
        setSelectedIndex((prev) => (prev > 0 ? prev - 1 : -1))
        break
      case "Enter":
        e.preventDefault()
        if (selectedIndex >= 0 && selectedIndex < suggestions.length) {
          handleSelect(suggestions[selectedIndex])
        }
        break
      case "Escape":
        setShowSuggestions(false)
        inputRef.current?.blur()
        break
    }
  }

  // Scroll selected suggestion into view
  useEffect(() => {
    if (selectedIndex >= 0 && suggestionsRef.current) {
      const selectedElement = suggestionsRef.current.children[selectedIndex]
      if (selectedElement) {
        selectedElement.scrollIntoView({ block: "nearest" })
      }
    }
  }, [selectedIndex])

  // Highlight matching text
  const highlightText = (text, query) => {
    if (!query.trim()) return text

    const parts = text.split(new RegExp(`(${query})`, "gi"))
    return parts.map((part, i) =>
      part.toLowerCase() === query.toLowerCase() ? (
        <mark key={i} className="bg-primary/20 text-primary font-medium">
          {part}
        </mark>
      ) : (
        part
      ),
    )
  }

  return (
    <div className={`relative ${className}`}>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground pointer-events-none" />
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          onFocus={() => setShowSuggestions(suggestions.length > 0)}
          onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
          placeholder="Search hospital, service, or district..."
          className="w-full pl-10 pr-10 py-3 bg-card border-2 border-border rounded-xl text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all shadow-sm hover:shadow-md"
        />
        {query && (
          <button
            onClick={() => {
              setQuery("")
              setShowSuggestions(false)
              inputRef.current?.focus()
            }}
            className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-muted rounded-lg transition-colors"
            aria-label="Clear search"
          >
            <X className="w-4 h-4 text-muted-foreground" />
          </button>
        )}
      </div>

      {/* Suggestions Dropdown */}
      {showSuggestions && suggestions.length > 0 && (
        <div
          ref={suggestionsRef}
          className="absolute z-50 w-full mt-2 bg-card border border-border rounded-xl shadow-xl max-h-80 overflow-y-auto"
        >
          {suggestions.map((hospital, index) => (
            <button
              key={hospital.id}
              onClick={() => handleSelect(hospital)}
              className={`w-full text-left p-4 hover:bg-muted transition-colors border-b border-border last:border-b-0 ${
                index === selectedIndex ? "bg-muted" : ""
              }`}
            >
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                  <MapPin className="w-5 h-5 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold text-foreground mb-1">
                    {highlightText(hospital.name, query)}
                  </h4>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <MapPin className="w-3 h-3" />
                    <span>{hospital.district}</span>
                    <span>•</span>
                    <span>★ {hospital.rating}</span>
                    {hospital.beds_available > 0 && (
                      <>
                        <span>•</span>
                        <span>{hospital.beds_available} beds</span>
                      </>
                    )}
                  </div>
                  {hospital.services.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-2">
                      {hospital.services.slice(0, 3).map((service) => (
                        <span
                          key={service}
                          className="px-2 py-0.5 bg-secondary text-secondary-foreground text-xs rounded-full"
                        >
                          {service}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

