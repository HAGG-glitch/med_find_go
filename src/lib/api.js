/**
 * API Client for Med-Find Salone
 * Handles all backend communication with proper error handling and caching
 */

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000"
const ADMIN_TOKEN = import.meta.env.VITE_ADMIN_SECRET || "admin123"

// Cache for ETag support
const cache = new Map()

/**
 * Generic fetch wrapper with ETag caching support
 */
async function fetchWithCache(url, options = {}) {
  const cacheKey = url
  const cached = cache.get(cacheKey)

  const headers = {
    "Content-Type": "application/json",
    ...options.headers,
  }

  // Add ETag if we have cached data
  if (cached?.etag) {
    headers["If-None-Match"] = cached.etag
  }

  try {
    const response = await fetch(`${API_URL}${url}`, {
      ...options,
      headers,
    })

    // 304 Not Modified - use cached data
    if (response.status === 304 && cached) {
      return cached.data
    }

    // Get ETag from response
    const etag = response.headers.get("ETag")

    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`)
    }

    const data = await response.json()

    // Cache the response with ETag
    if (etag) {
      cache.set(cacheKey, { data, etag, timestamp: Date.now() })
    }

    return data
  } catch (error) {
    // If offline, try to return cached data
    if (error.message.includes("Failed to fetch") && cached) {
      console.warn("Offline: Using cached data")
      return cached.data
    }
    throw error
  }
}

/**
 * Admin API calls with X-ADMIN-TOKEN header
 */
async function adminFetch(url, options = {}) {
  return fetchWithCache(url, {
    ...options,
    headers: {
      "X-ADMIN-TOKEN": ADMIN_TOKEN,
      ...options.headers,
    },
  })
}

// Public API endpoints
export const api = {
  // Health check
  async healthCheck() {
    return fetchWithCache("/health")
  },

  // Get all hospitals
  async getHospitals() {
    return fetchWithCache("/hospitals")
  },

  // Get hospital by ID
  async getHospital(id) {
    return fetchWithCache(`/hospitals/${id}`)
  },

  // Submit report
  async submitReport(reportData) {
    return fetchWithCache("/reports", {
      method: "POST",
      body: JSON.stringify(reportData),
    })
  },
}

// Admin API endpoints
export const adminApi = {
  // Create hospital
  async createHospital(hospitalData) {
    return adminFetch("/admin/hospitals", {
      method: "POST",
      body: JSON.stringify(hospitalData),
    })
  },

  // Update hospital
  async updateHospital(id, hospitalData) {
    return adminFetch(`/admin/hospitals/${id}`, {
      method: "PUT",
      body: JSON.stringify(hospitalData),
    })
  },

  // Delete hospital
  async deleteHospital(id) {
    return adminFetch(`/admin/hospitals/${id}`, {
      method: "DELETE",
    })
  },

  // Update availability
  async updateAvailability(id, availabilityData) {
    return adminFetch(`/admin/hospitals/${id}/availability`, {
      method: "POST",
      body: JSON.stringify(availabilityData),
    })
  },
}

// Clear cache (useful for testing or forced refresh)
export function clearCache() {
  cache.clear()
}

