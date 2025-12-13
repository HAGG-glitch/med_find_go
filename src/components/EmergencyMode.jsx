import { useState, useEffect } from "react"
import { AlertTriangle, X, Phone } from "lucide-react"
import { useNavigate } from "react-router-dom"
import { useHospitals } from "../hooks/useHospitals"
import { useGeolocation } from "../hooks/useGeolocation"
import HospitalCard from "./HospitalCard"

/**
 * Emergency Mode Component
 * Shows only critical hospitals with simplified UI
 */
export default function EmergencyMode() {
  const navigate = useNavigate()
  const { hospitals } = useHospitals({ pollInterval: 30000 })
  
  const handleClose = () => {
    navigate(-1) // Go back to previous page
  }
  const { location: userLocation, requestLocation } = useGeolocation()
  const [emergencyHospitals, setEmergencyHospitals] = useState([])

  useEffect(() => {
    // Request location if not available
    if (!userLocation) {
      requestLocation()
    }
  }, [userLocation, requestLocation])

  useEffect(() => {
    // Filter for emergency-ready hospitals
    const emergency = hospitals.filter(
      (h) => h.open_now && h.ambulance && h.emergency_capacity !== "low"
    )

    // Sort by distance if location available
    if (userLocation) {
      const calculateDistance = (lat1, lon1, lat2, lon2) => {
        const R = 6371
        const dLat = ((lat2 - lat1) * Math.PI) / 180
        const dLon = ((lon2 - lon1) * Math.PI) / 180
        const a =
          Math.sin(dLat / 2) * Math.sin(dLat / 2) +
          Math.cos((lat1 * Math.PI) / 180) *
            Math.cos((lat2 * Math.PI) / 180) *
            Math.sin(dLon / 2) *
            Math.sin(dLon / 2)
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
        return R * c
      }

      emergency.sort((a, b) => {
        const distA = calculateDistance(
          userLocation.latitude,
          userLocation.longitude,
          a.latitude,
          a.longitude
        )
        const distB = calculateDistance(
          userLocation.latitude,
          userLocation.longitude,
          b.latitude,
          b.longitude
        )
        return distA - distB
      })
    }

    setEmergencyHospitals(emergency)
  }, [hospitals, userLocation])

  return (
    <div className="fixed inset-0 bg-destructive/95 z-50 flex flex-col">
      {/* Header */}
      <div className="bg-destructive border-b border-destructive/20 p-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <AlertTriangle className="w-8 h-8 text-white animate-pulse" />
            <div>
              <h1 className="text-2xl font-bold text-white">Emergency Mode</h1>
              <p className="text-white/80 text-sm">
                Showing hospitals with ambulance & emergency capacity
              </p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="p-2 hover:bg-white/20 rounded-lg transition-colors"
            aria-label="Exit emergency mode"
          >
            <X className="w-6 h-6 text-white" />
          </button>
        </div>
      </div>

      {/* Emergency Hotline */}
      <div className="bg-white/10 border-b border-white/20 p-4">
        <div className="max-w-7xl mx-auto">
          <a
            href="tel:+23276999999"
            className="flex items-center justify-center gap-3 bg-white text-destructive px-8 py-4 rounded-xl font-bold text-lg hover:bg-white/90 transition-all shadow-lg hover:scale-105"
          >
            <Phone className="w-6 h-6" />
            <span>Call Emergency: +232 76 999 999</span>
          </a>
        </div>
      </div>

      {/* Hospital List */}
      <div className="flex-1 overflow-y-auto bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {emergencyHospitals.length === 0 ? (
            <div className="text-center py-12">
              <AlertTriangle className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-foreground mb-2">
                No Emergency Hospitals Available
              </h2>
              <p className="text-muted-foreground mb-6">
                Please call the emergency hotline above or try regular search
              </p>
              <button
                onClick={handleClose}
                className="px-6 py-3 bg-primary text-primary-foreground rounded-lg font-semibold hover:bg-primary/90 transition-colors"
              >
                Exit Emergency Mode
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="mb-4">
                <h2 className="text-xl font-bold text-foreground mb-1">
                  {emergencyHospitals.length} Emergency-Ready Hospitals
                </h2>
                <p className="text-sm text-muted-foreground">
                  Sorted by distance {userLocation ? "" : "(enable location for distance sorting)"}
                </p>
              </div>
              {emergencyHospitals.map((hospital) => (
                <HospitalCard key={hospital.id} hospital={hospital} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

