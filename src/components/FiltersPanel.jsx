import { useState } from "react"
import { ChevronDown, ChevronUp, SlidersHorizontal, Heart } from "lucide-react"
import { useFavorites } from "../hooks/useFavorites"

export default function FiltersPanel({ filters, setFilters, sortBy, setSortBy }) {
  const { favorites } = useFavorites()
  const [isOpen, setIsOpen] = useState(false)

  const districts = [
    "Western Area",
    "Bo",
    "Kenema",
    "Kono",
    "Port Loko",
    "Bombali",
    "Tonkolili",
    "Kambia",
    "Kailahun",
    "Pujehun",
    "Moyamba",
    "Bonthe",
    "Koinadugu",
  ]

  const services = ["Maternity", "Surgery", "Pediatrics", "ICU", "Emergency", "X-Ray", "Laboratory"]

  const specialists = [
    "Obstetrician",
    "General Surgeon",
    "Pediatrician",
    "Cardiologist",
    "Orthopedic Surgeon",
    "Anesthesiologist",
  ]

  const toggleSpecialist = (specialist) => {
    setFilters((prev) => ({
      ...prev,
      specialists: prev.specialists.includes(specialist)
        ? prev.specialists.filter((s) => s !== specialist)
        : [...prev.specialists, specialist],
    }))
  }

  return (
    <>
      {/* Mobile Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="lg:hidden w-full flex items-center justify-between px-4 py-3 bg-card border border-border rounded-xl mb-4 hover:bg-muted/50 transition-all duration-200 hover:shadow-md"
      >
        <span className="flex items-center gap-2 font-medium text-foreground">
          <SlidersHorizontal className="w-4 h-4" />
          Filters & Sorting
        </span>
        {isOpen ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
      </button>

      {/* Filters Panel */}
      <div
        className={`bg-card border border-border rounded-2xl p-6 space-y-6 shadow-sm ${isOpen ? "block" : "hidden lg:block"}`}
      >
        <div>
          <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
            <SlidersHorizontal className="w-4 h-4" />
            Filters & Sorting
          </h3>

          {/* Sort By */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-foreground mb-2">Sort By</label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full px-3 py-2.5 bg-background border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all shadow-sm hover:shadow-md"
            >
              <option value="nearest">Nearest</option>
              <option value="rating">Highest Rated</option>
              <option value="beds">Most Beds Available</option>
            </select>
          </div>

          {/* Favorites Only */}
          {favorites.length > 0 && (
            <label className="flex items-center gap-2 mb-4 cursor-pointer">
              <input
                type="checkbox"
                checked={filters.favoritesOnly}
                onChange={(e) => setFilters({ ...filters, favoritesOnly: e.target.checked })}
                className="w-4 h-4 text-primary border-border rounded focus:ring-primary"
              />
              <span className="text-sm text-foreground flex items-center gap-1">
                <Heart className="w-4 h-4 text-destructive fill-current" />
                Favorites Only ({favorites.length})
              </span>
            </label>
          )}

          {/* Open Now */}
          <label className="flex items-center gap-2 mb-4 cursor-pointer">
            <input
              type="checkbox"
              checked={filters.openNow}
              onChange={(e) => setFilters({ ...filters, openNow: e.target.checked })}
              className="w-4 h-4 text-primary border-border rounded focus:ring-primary"
            />
            <span className="text-sm text-foreground">Open Now</span>
          </label>

          {/* Government/Private */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-foreground mb-2">Type</label>
            <div className="space-y-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="government"
                  checked={filters.government === null}
                  onChange={() => setFilters({ ...filters, government: null })}
                  className="w-4 h-4 text-primary border-border focus:ring-primary"
                />
                <span className="text-sm text-foreground">All</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="government"
                  checked={filters.government === true}
                  onChange={() => setFilters({ ...filters, government: true })}
                  className="w-4 h-4 text-primary border-border focus:ring-primary"
                />
                <span className="text-sm text-foreground">Government</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="government"
                  checked={filters.government === false}
                  onChange={() => setFilters({ ...filters, government: false })}
                  className="w-4 h-4 text-primary border-border focus:ring-primary"
                />
                <span className="text-sm text-foreground">Private</span>
              </label>
            </div>
          </div>

          {/* District */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-foreground mb-2">District</label>
            <select
              value={filters.district}
              onChange={(e) => setFilters({ ...filters, district: e.target.value })}
              className="w-full px-3 py-2.5 bg-background border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all shadow-sm hover:shadow-md"
            >
              <option value="">All Districts</option>
              {districts.map((district) => (
                <option key={district} value={district}>
                  {district}
                </option>
              ))}
            </select>
          </div>

          {/* Service Type */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-foreground mb-2">Service Type</label>
            <select
              value={filters.service}
              onChange={(e) => setFilters({ ...filters, service: e.target.value })}
              className="w-full px-3 py-2.5 bg-background border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all shadow-sm hover:shadow-md"
            >
              <option value="">All Services</option>
              {services.map((service) => (
                <option key={service} value={service}>
                  {service}
                </option>
              ))}
            </select>
          </div>

          {/* Ambulance Available */}
          <label className="flex items-center gap-2 mb-4 cursor-pointer">
            <input
              type="checkbox"
              checked={filters.ambulance}
              onChange={(e) => setFilters({ ...filters, ambulance: e.target.checked })}
              className="w-4 h-4 text-primary border-border rounded focus:ring-primary"
            />
            <span className="text-sm text-foreground">Ambulance Available</span>
          </label>

          {/* Emergency Capacity */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-foreground mb-2">Emergency Capacity</label>
            <select
              value={filters.emergencyCapacity}
              onChange={(e) => setFilters({ ...filters, emergencyCapacity: e.target.value })}
              className="w-full px-3 py-2.5 bg-background border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all shadow-sm hover:shadow-md"
            >
              <option value="">Any</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
          </div>

          {/* Minimum Beds */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-foreground mb-2">
              Min. Beds Available: {filters.minBeds}
            </label>
            <input
              type="range"
              min="0"
              max="50"
              value={filters.minBeds}
              onChange={(e) => setFilters({ ...filters, minBeds: Number.parseInt(e.target.value) })}
              className="w-full"
            />
          </div>

          {/* Specialists */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-foreground mb-2">Specialists</label>
            <div className="space-y-2">
              {specialists.map((specialist) => (
                <label key={specialist} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={filters.specialists.includes(specialist)}
                    onChange={() => toggleSpecialist(specialist)}
                    className="w-4 h-4 text-primary border-border rounded focus:ring-primary"
                  />
                  <span className="text-sm text-foreground">{specialist}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Minimum Rating */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-foreground mb-2">
              Min. Rating: {filters.minRating > 0 ? filters.minRating : "Any"}
            </label>
            <input
              type="range"
              min="0"
              max="5"
              step="0.5"
              value={filters.minRating}
              onChange={(e) => setFilters({ ...filters, minRating: Number.parseFloat(e.target.value) })}
              className="w-full"
            />
          </div>

          {/* Reset Button */}
          <button
            onClick={() =>
              setFilters({
                openNow: false,
                government: null,
                district: "",
                service: "",
                ambulance: false,
                emergencyCapacity: "",
                minBeds: 0,
                specialists: [],
                minRating: 0,
                favoritesOnly: false,
              })
            }
            className="w-full px-4 py-2.5 bg-muted text-foreground rounded-lg hover:bg-muted/80 transition-all duration-200 text-sm font-medium shadow-sm hover:shadow-md hover:scale-105 active:scale-95"
          >
            Reset Filters
          </button>
        </div>
      </div>
    </>
  )
}
