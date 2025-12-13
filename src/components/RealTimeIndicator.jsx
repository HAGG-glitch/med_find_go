import { useMemo } from "react"
import { Circle } from "lucide-react"

/**
 * Real-time Indicator Component
 * Shows visual freshness indicator for hospital data
 */
export default function RealTimeIndicator({ lastUpdated, className = "" }) {
  const freshness = useMemo(() => {
    if (!lastUpdated) return "unknown"

    const now = new Date()
    const updated = new Date(lastUpdated)
    const diffMinutes = (now - updated) / (1000 * 60)

    if (diffMinutes < 5) return "live" // < 5 minutes
    if (diffMinutes < 30) return "recent" // < 30 minutes
    if (diffMinutes < 120) return "moderate" // < 2 hours
    return "stale" // > 2 hours
  }, [lastUpdated])

  const getConfig = () => {
    switch (freshness) {
      case "live":
        return {
          color: "text-accent",
          bg: "bg-accent/10",
          label: "Live",
          pulse: true,
        }
      case "recent":
        return {
          color: "text-primary",
          bg: "bg-primary/10",
          label: "Recent",
          pulse: false,
        }
      case "moderate":
        return {
          color: "text-yellow-600",
          bg: "bg-yellow-100",
          label: "Updated",
          pulse: false,
        }
      case "stale":
        return {
          color: "text-muted-foreground",
          bg: "bg-muted",
          label: "May be outdated",
          pulse: false,
        }
      default:
        return {
          color: "text-muted-foreground",
          bg: "bg-muted",
          label: "Unknown",
          pulse: false,
        }
    }
  }

  const config = getConfig()

  return (
    <div className={`inline-flex items-center gap-1.5 ${className}`}>
      <Circle
        className={`w-2 h-2 ${config.color} ${config.pulse ? "animate-pulse" : ""}`}
        fill="currentColor"
      />
      <span className={`text-xs font-medium ${config.color}`}>{config.label}</span>
    </div>
  )
}

