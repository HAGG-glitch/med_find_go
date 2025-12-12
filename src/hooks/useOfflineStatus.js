import { useState, useEffect } from "react"

export function useOfflineStatus() {
  const [isOnline, setIsOnline] = useState(navigator.onLine)
  const [lastSync, setLastSync] = useState(new Date())

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true)
      setLastSync(new Date())
    }
    const handleOffline = () => {
      setIsOnline(false)
    }

    window.addEventListener("online", handleOnline)
    window.addEventListener("offline", handleOffline)

    return () => {
      window.removeEventListener("online", handleOnline)
      window.removeEventListener("offline", handleOffline)
    }
  }, [])

  return { isOnline, lastSync }
}
