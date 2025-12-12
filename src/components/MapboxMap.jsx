import { useEffect, useRef, useState } from "react"
import mapboxgl from "mapbox-gl"
import { Locate, AlertCircle, Navigation } from "lucide-react"

// Set Mapbox access token
const mapboxToken = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN || ""
if (!mapboxToken) {
  console.warn(
    "⚠️ Mapbox access token is missing! Please add VITE_MAPBOX_ACCESS_TOKEN to your .env file. Get your token from: https://account.mapbox.com/access-tokens/",
  )
}
mapboxgl.accessToken = mapboxToken

export default function MapboxMap({ hospitals, onMarkerClick, selectedHospital }) {
  const mapContainer = useRef(null)
  const map = useRef(null)
  const markers = useRef([])
  const userMarker = useRef(null)
  const [userLocation, setUserLocation] = useState(null)
  const [nearestHospitals, setNearestHospitals] = useState([])
  const [showNearest, setShowNearest] = useState(false)

  // Calculate distance between two coordinates (Haversine formula)
  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371 // Earth's radius in km
    const dLat = ((lat2 - lat1) * Math.PI) / 180
    const dLon = ((lon2 - lon1) * Math.PI) / 180
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2)
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
    return R * c // Distance in km
  }

  useEffect(() => {
    if (!mapContainer.current || map.current) return

    // Check if Mapbox token is available
    if (!mapboxgl.accessToken) {
      console.error("Mapbox access token is required")
      return
    }

    // Initialize map
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/streets-v12",
      center: [-13.234, 8.4875], // Freetown, Sierra Leone
      zoom: 9,
    })

    // Add navigation controls
    map.current.addControl(new mapboxgl.NavigationControl(), "top-right")

    // Wait for map to load before adding sources and layers
    map.current.on("load", () => {
      // Add hospitals source
      map.current.addSource("hospitals", {
        type: "geojson",
        data: {
          type: "FeatureCollection",
          features: hospitals.map((hospital) => ({
            type: "Feature",
            properties: {
              id: hospital.id,
              name: hospital.name,
              rating: hospital.rating,
              beds: hospital.beds_available,
              oxygen: hospital.oxygen,
              ambulance: hospital.ambulance,
            },
            geometry: {
              type: "Point",
              coordinates: [hospital.longitude, hospital.latitude],
            },
          })),
        },
        cluster: true,
        clusterMaxZoom: 14,
        clusterRadius: 50,
      })

      // Add cluster circles
      map.current.addLayer({
        id: "clusters",
        type: "circle",
        source: "hospitals",
        filter: ["has", "point_count"],
        paint: {
          "circle-color": ["step", ["get", "point_count"], "#1E88E5", 5, "#2E7D32", 10, "#1976D2"],
          "circle-radius": ["step", ["get", "point_count"], 20, 5, 30, 10, 40],
          "circle-stroke-width": 2,
          "circle-stroke-color": "#fff",
        },
      })

      // Add cluster count labels
      map.current.addLayer({
        id: "cluster-count",
        type: "symbol",
        source: "hospitals",
        filter: ["has", "point_count"],
        layout: {
          "text-field": "{point_count_abbreviated}",
          "text-font": ["DIN Offc Pro Medium", "Arial Unicode MS Bold"],
          "text-size": 12,
        },
        paint: {
          "text-color": "#ffffff",
        },
      })

      // Add unclustered hospital points
      map.current.addLayer({
        id: "unclustered-point",
        type: "circle",
        source: "hospitals",
        filter: ["!", ["has", "point_count"]],
        paint: {
          "circle-color": "#1E88E5",
          "circle-radius": 8,
          "circle-stroke-width": 2,
          "circle-stroke-color": "#fff",
        },
      })

      // Click on cluster to zoom in
      map.current.on("click", "clusters", (e) => {
        const features = map.current.queryRenderedFeatures(e.point, {
          layers: ["clusters"],
        })
        const clusterId = features[0].properties.cluster_id
        map.current.getSource("hospitals").getClusterExpansionZoom(clusterId, (err, zoom) => {
          if (err) return

          map.current.easeTo({
            center: features[0].geometry.coordinates,
            zoom: zoom,
          })
        })
      })

      // Click on unclustered point to show popup
      map.current.on("click", "unclustered-point", (e) => {
        const coordinates = e.features[0].geometry.coordinates.slice()
        const { id, name, rating, beds, oxygen, ambulance } = e.features[0].properties

        // Create popup content
        const popupContent = `
          <div class="p-4 min-w-[200px]">
            <h3 class="font-bold text-lg mb-2">${name}</h3>
            <div class="space-y-2 text-sm">
              <div class="flex items-center gap-2">
                <span class="font-medium">Rating:</span>
                <span class="text-yellow-600">★ ${rating}</span>
              </div>
              <div class="flex items-center gap-2">
                <span class="font-medium">Beds:</span>
                <span>${beds} available</span>
              </div>
              <div class="flex items-center gap-2">
                <span class="font-medium">Oxygen:</span>
                <span class="${oxygen ? "text-green-600" : "text-gray-400"}">${oxygen ? "Available" : "Not available"}</span>
              </div>
              <div class="flex items-center gap-2">
                <span class="font-medium">Ambulance:</span>
                <span class="${ambulance ? "text-green-600" : "text-gray-400"}">${ambulance ? "Available" : "Not available"}</span>
              </div>
              <div class="mt-3 flex gap-2">
                <a href="/hospital/${id}" class="flex-1 px-3 py-2 bg-blue-600 text-white rounded text-center font-medium hover:bg-blue-700">View Details</a>
              </div>
            </div>
          </div>
        `

        new mapboxgl.Popup({ offset: 25 }).setLngLat(coordinates).setHTML(popupContent).addTo(map.current)

        if (onMarkerClick) {
          onMarkerClick(Number.parseInt(id))
        }
      })

      // Change cursor on hover
      map.current.on("mouseenter", "clusters", () => {
        map.current.getCanvas().style.cursor = "pointer"
      })
      map.current.on("mouseleave", "clusters", () => {
        map.current.getCanvas().style.cursor = ""
      })
      map.current.on("mouseenter", "unclustered-point", () => {
        map.current.getCanvas().style.cursor = "pointer"
      })
      map.current.on("mouseleave", "unclustered-point", () => {
        map.current.getCanvas().style.cursor = ""
      })
    })

    return () => {
      if (map.current) {
        map.current.remove()
        map.current = null
      }
    }
  }, [])

  // Update hospital data when hospitals change
  useEffect(() => {
    if (!map.current || !map.current.isStyleLoaded()) return

    const source = map.current.getSource("hospitals")
    if (source) {
      source.setData({
        type: "FeatureCollection",
        features: hospitals.map((hospital) => ({
          type: "Feature",
          properties: {
            id: hospital.id,
            name: hospital.name,
            rating: hospital.rating,
            beds: hospital.beds_available,
            oxygen: hospital.oxygen,
            ambulance: hospital.ambulance,
          },
          geometry: {
            type: "Point",
            coordinates: [hospital.longitude, hospital.latitude],
          },
        })),
      })
    }
  }, [hospitals])

  // Highlight selected hospital
  useEffect(() => {
    if (!map.current || !selectedHospital) return

    const hospital = hospitals.find((h) => h.id === selectedHospital)
    if (hospital) {
      map.current.flyTo({
        center: [hospital.longitude, hospital.latitude],
        zoom: 14,
        essential: true,
      })
    }
  }, [selectedHospital, hospitals])

  // Calculate and find nearest hospitals
  const findNearestHospitals = (userLat, userLon) => {
    const hospitalsWithDistance = hospitals.map((hospital) => ({
      ...hospital,
      distance: calculateDistance(userLat, userLon, hospital.latitude, hospital.longitude),
    }))

    // Sort by distance and get top 5 nearest
    const nearest = hospitalsWithDistance
      .sort((a, b) => a.distance - b.distance)
      .slice(0, 5)
      .map((h) => ({
        ...h,
        distanceFormatted: h.distance < 1 ? `${(h.distance * 1000).toFixed(0)}m` : `${h.distance.toFixed(2)}km`,
      }))

    setNearestHospitals(nearest)
    setShowNearest(true)

    // Draw lines to nearest hospitals
    if (map.current && map.current.isStyleLoaded()) {
      // Remove existing route layer if it exists
      if (map.current.getLayer("nearest-routes")) {
        map.current.removeLayer("nearest-routes")
      }
      if (map.current.getSource("nearest-routes")) {
        map.current.removeSource("nearest-routes")
      }

      // Add route lines
      map.current.addSource("nearest-routes", {
        type: "geojson",
        data: {
          type: "FeatureCollection",
          features: nearest.map((hospital) => ({
            type: "Feature",
            geometry: {
              type: "LineString",
              coordinates: [
                [userLon, userLat],
                [hospital.longitude, hospital.latitude],
              ],
            },
          })),
        },
      })

      map.current.addLayer({
        id: "nearest-routes",
        type: "line",
        source: "nearest-routes",
        layout: {
          "line-join": "round",
          "line-cap": "round",
        },
        paint: {
          "line-color": "#2E7D32",
          "line-width": 2,
          "line-dasharray": [2, 2],
        },
      })
    }
  }

  // Locate user
  const locateUser = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords
          setUserLocation([longitude, latitude])

          if (map.current) {
            map.current.flyTo({
              center: [longitude, latitude],
              zoom: 12,
              essential: true,
            })

            // Remove existing user marker
            if (userMarker.current) {
              userMarker.current.remove()
            }

            // Add user location marker
            userMarker.current = new mapboxgl.Marker({ color: "#2E7D32" })
              .setLngLat([longitude, latitude])
              .addTo(map.current)

            // Find nearest hospitals
            findNearestHospitals(latitude, longitude)
          }
        },
        (error) => {
          console.error("Error getting location:", error)
          alert("Unable to get your location. Please enable location services.")
        },
      )
    } else {
      alert("Geolocation is not supported by your browser")
    }
  }

  // Show error message if token is missing
  if (!mapboxgl.accessToken) {
    return (
      <div className="relative w-full h-full rounded-2xl overflow-hidden bg-muted flex items-center justify-center min-h-[500px]">
        <div className="text-center p-8 bg-card border border-border rounded-xl shadow-lg max-w-md">
          <AlertCircle className="w-12 h-12 text-destructive mx-auto mb-4" />
          <h3 className="text-lg font-bold text-foreground mb-2">Mapbox Token Required</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Please add your Mapbox access token to the <code className="bg-muted px-2 py-1 rounded">.env</code> file:
          </p>
          <code className="block bg-background border border-border rounded-lg p-3 text-xs text-left mb-4">
            VITE_MAPBOX_ACCESS_TOKEN=your_token_here
          </code>
          <a
            href="https://account.mapbox.com/access-tokens/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors text-sm font-medium"
          >
            Get Your Token
          </a>
        </div>
      </div>
    )
  }

  return (
    <div className="relative w-full h-full rounded-2xl overflow-hidden">
      <div ref={mapContainer} className="w-full h-full min-h-[500px]" />

      {/* Locate Button */}
      <button
        onClick={locateUser}
        className="absolute bottom-4 left-4 bg-card border border-border p-3 rounded-lg shadow-lg hover:bg-muted transition-all duration-200 hover:scale-105 active:scale-95 z-10"
        title="Locate me and find nearest hospitals"
      >
        <Locate className="w-5 h-5 text-foreground" />
      </button>

      {/* Nearest Hospitals Panel */}
      {showNearest && nearestHospitals.length > 0 && (
        <div className="absolute bottom-4 right-4 bg-card/95 backdrop-blur-sm border border-border rounded-xl shadow-xl p-4 max-w-sm z-10 max-h-[400px] overflow-y-auto">
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-sm font-bold text-foreground flex items-center gap-2">
              <Navigation className="w-4 h-4 text-primary" />
              Nearest Hospitals
            </h4>
            <button
              onClick={() => {
                setShowNearest(false)
                // Remove route lines
                if (map.current && map.current.getLayer("nearest-routes")) {
                  map.current.removeLayer("nearest-routes")
                  map.current.removeSource("nearest-routes")
                }
              }}
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              ×
            </button>
          </div>
          <div className="space-y-2">
            {nearestHospitals.map((hospital, index) => (
              <div
                key={hospital.id}
                onClick={() => {
                  if (onMarkerClick) onMarkerClick(hospital.id)
                  if (map.current) {
                    map.current.flyTo({
                      center: [hospital.longitude, hospital.latitude],
                      zoom: 14,
                    })
                  }
                }}
                className="p-3 bg-background rounded-lg border border-border hover:border-primary/50 cursor-pointer transition-all hover:shadow-md"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-bold text-primary bg-primary/10 px-2 py-0.5 rounded">
                        #{index + 1}
                      </span>
                      <h5 className="text-sm font-semibold text-foreground">{hospital.name}</h5>
                    </div>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Navigation className="w-3 h-3" />
                        {hospital.distanceFormatted}
                      </span>
                      <span>★ {hospital.rating}</span>
                      <span>{hospital.beds_available} beds</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Legend */}
      <div className="absolute top-4 left-4 bg-card/95 backdrop-blur-sm border border-border rounded-lg p-3 shadow-lg z-10">
        <h4 className="text-xs font-semibold text-foreground mb-2">Map Legend</h4>
        <div className="space-y-1 text-xs text-muted-foreground">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-primary rounded-full border border-white/50" />
            <span>Hospital</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-accent rounded-full border border-white/50" />
            <span>Your Location</span>
          </div>
        </div>
      </div>
    </div>
  )
}
