import { useState, useEffect } from "react"
import { WifiOff } from "lucide-react"

export default function OfflineIndicator() {
  const [isOnline, setIsOnline] = useState(navigator.onLine)
  const [lastSync, setLastSync] = useState(new Date())

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true)
      setLastSync(new Date())
    }
    const handleOffline = () => setIsOnline(false)

    window.addEventListener("online", handleOnline)
    window.addEventListener("offline", handleOffline)

    return () => {
      window.removeEventListener("online", handleOnline)
      window.removeEventListener("offline", handleOffline)
    }
  }, [])

  if (isOnline) return null

  return (
    <div className="fixed top-20 left-1/2 -translate-x-1/2 bg-muted border border-border rounded-lg shadow-lg px-4 py-2 z-50">
      <div className="flex items-center gap-2 text-sm">
        <WifiOff className="w-4 h-4 text-muted-foreground" />
        <span className="text-foreground">Offline Mode</span>
        <span className="text-muted-foreground">• Last synced: {lastSync.toLocaleTimeString()}</span>
      </div>
    </div>
  )
}
