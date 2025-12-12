import { useState, useEffect, useCallback } from "react"
import { api } from "../lib/api"
import { mockHospitals } from "../data/mockHospitals"

/**
 * Custom hook for fetching and managing hospitals data
 * Supports real-time polling, error handling, and offline fallback
 */
export function useHospitals(options = {}) {
  const { pollInterval = 30000, useMockData = true } = options

  const [hospitals, setHospitals] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [lastSynced, setLastSynced] = useState(null)

  const fetchHospitals = useCallback(async () => {
    try {
      setError(null)
      
      // Try to fetch from API
      try {
        const data = await api.getHospitals()
        setHospitals(data)
        setLastSynced(new Date())
        setLoading(false)
        return
      } catch (apiError) {
        // If API fails and mock data is enabled, use mock data
        if (useMockData) {
          console.warn("API unavailable, using mock data:", apiError)
          setHospitals(mockHospitals)
          setLastSynced(new Date())
          setLoading(false)
          return
        }
        throw apiError
      }
    } catch (err) {
      setError(err.message)
      setLoading(false)
      
      // Fallback to mock data if available
      if (useMockData) {
        setHospitals(mockHospitals)
      }
    }
  }, [useMockData])

  // Initial fetch
  useEffect(() => {
    fetchHospitals()
  }, [fetchHospitals])

  // Polling for real-time updates
  useEffect(() => {
    if (pollInterval <= 0) return

    const interval = setInterval(() => {
      fetchHospitals()
    }, pollInterval)

    return () => clearInterval(interval)
  }, [pollInterval, fetchHospitals])

  return {
    hospitals,
    loading,
    error,
    lastSynced,
    refetch: fetchHospitals,
  }
}

/**
 * Hook for fetching a single hospital by ID
 */
export function useHospital(id) {
  const [hospital, setHospital] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!id) {
      setLoading(false)
      return
    }

    const fetchHospital = async () => {
      try {
        setError(null)
        const data = await api.getHospital(id)
        setHospital(data)
      } catch (err) {
        // Fallback to mock data
        const mockHospital = mockHospitals.find((h) => h.id === Number.parseInt(id))
        if (mockHospital) {
          setHospital(mockHospital)
        } else {
          setError(err.message)
        }
      } finally {
        setLoading(false)
      }
    }

    fetchHospital()
  }, [id])

  return { hospital, loading, error }
}

