import { useState, useEffect } from "react"

/**
 * Custom hook for managing favorite hospitals
 * Stores favorites in localStorage for offline access
 */
export function useFavorites() {
  const [favorites, setFavorites] = useState(() => {
    try {
      const stored = localStorage.getItem("favorite_hospitals")
      return stored ? JSON.parse(stored) : []
    } catch {
      return []
    }
  })

  // Save to localStorage whenever favorites change
  useEffect(() => {
    try {
      localStorage.setItem("favorite_hospitals", JSON.stringify(favorites))
    } catch (error) {
      console.error("Failed to save favorites:", error)
    }
  }, [favorites])

  const addFavorite = (hospitalId) => {
    setFavorites((prev) => {
      if (prev.includes(hospitalId)) return prev
      return [...prev, hospitalId]
    })
  }

  const removeFavorite = (hospitalId) => {
    setFavorites((prev) => prev.filter((id) => id !== hospitalId))
  }

  const toggleFavorite = (hospitalId) => {
    if (favorites.includes(hospitalId)) {
      removeFavorite(hospitalId)
    } else {
      addFavorite(hospitalId)
    }
  }

  const isFavorite = (hospitalId) => {
    return favorites.includes(hospitalId)
  }

  return {
    favorites,
    addFavorite,
    removeFavorite,
    toggleFavorite,
    isFavorite,
  }
}

