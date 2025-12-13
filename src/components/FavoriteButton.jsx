import { Heart } from "lucide-react"
import { useFavorites } from "../hooks/useFavorites"

/**
 * Favorite Button Component
 * Allows users to save/unsave hospitals as favorites
 */
export default function FavoriteButton({ hospitalId, className = "" }) {
  const { isFavorite, toggleFavorite } = useFavorites()
  const favorited = isFavorite(hospitalId)

  return (
    <button
      onClick={(e) => {
        e.preventDefault()
        e.stopPropagation()
        toggleFavorite(hospitalId)
      }}
      className={`p-2 rounded-lg transition-all duration-200 hover:scale-110 active:scale-95 ${
        favorited
          ? "bg-destructive/10 text-destructive hover:bg-destructive/20"
          : "bg-muted text-muted-foreground hover:bg-muted/80"
      } ${className}`}
      aria-label={favorited ? "Remove from favorites" : "Add to favorites"}
      title={favorited ? "Remove from favorites" : "Add to favorites"}
    >
      <Heart className={`w-5 h-5 ${favorited ? "fill-current" : ""}`} />
    </button>
  )
}

