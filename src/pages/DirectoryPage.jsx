import { useState, useMemo } from "react";
import { List, MapIcon } from "lucide-react";
import FiltersPanel from "../components/FiltersPanel";
import HospitalList from "../components/HospitalList";
import MapboxMap from "../components/MapboxMap";
import { SkeletonList } from "../components/SkeletonLoader";
import { useHospitals } from "../hooks/useHospitals";
import { useGeolocation } from "../hooks/useGeolocation";

export default function DirectoryPage() {
  const { hospitals, loading, error, lastSynced } = useHospitals({
    pollInterval: 30000,
  });
  const { location: userLocation } = useGeolocation();
  const [view, setView] = useState("list"); // "list" or "map"
  const [filters, setFilters] = useState({
    openNow: false,
    government: null, // null, true, or false
    district: "",
    service: "",
    ambulance: false,
    emergencyCapacity: "",
    minBeds: 0,
    specialists: [],
    minRating: 0,
  });
  const [sortBy, setSortBy] = useState("nearest"); // "nearest", "rating", "beds"
  const [selectedHospital, setSelectedHospital] = useState(null);

  // Calculate distance for nearest sort
  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371; // Earth's radius in km
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  // Filter hospitals based on current filters
  const filteredHospitals = useMemo(() => {
    return hospitals.filter((hospital) => {
      if (filters.openNow && !hospital.open_now) return false;
      if (
        filters.government !== null &&
        hospital.is_government !== filters.government
      )
        return false;
      if (filters.district && hospital.district !== filters.district)
        return false;
      if (filters.service && !hospital.services.includes(filters.service))
        return false;
      if (filters.ambulance && !hospital.ambulance) return false;
      if (
        filters.emergencyCapacity &&
        hospital.emergency_capacity !== filters.emergencyCapacity
      )
        return false;
      if (hospital.beds_available < filters.minBeds) return false;
      if (filters.specialists.length > 0) {
        const hasSpecialist = filters.specialists.some((spec) =>
          hospital.specialists.includes(spec)
        );
        if (!hasSpecialist) return false;
      }
      if (hospital.rating < filters.minRating) return false;
      return true;
    });
  }, [hospitals, filters]);

  // Sort hospitals
  const sortedHospitals = useMemo(() => {
    const sorted = [...filteredHospitals];

    if (sortBy === "rating") {
      return sorted.sort((a, b) => b.rating - a.rating);
    }
    if (sortBy === "beds") {
      return sorted.sort((a, b) => b.beds_available - a.beds_available);
    }
    if (sortBy === "nearest" && userLocation) {
      return sorted.sort((a, b) => {
        const distA = calculateDistance(
          userLocation.latitude,
          userLocation.longitude,
          a.latitude,
          a.longitude
        );
        const distB = calculateDistance(
          userLocation.latitude,
          userLocation.longitude,
          b.latitude,
          b.longitude
        );
        return distA - distB;
      });
    }
    return sorted;
  }, [filteredHospitals, sortBy, userLocation]);

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">
              Hospital Directory
            </h1>
            <p className="text-muted-foreground">
              {filteredHospitals.length} hospitals found{" "}
              {filters.district && `in ${filters.district}`}
            </p>
          </div>

          {/* View Toggle - Mobile */}
          <div className="md:hidden flex gap-2">
            <button
              onClick={() => setView("list")}
              className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg font-medium transition-all duration-200 ${
                view === "list"
                  ? "bg-primary text-primary-foreground shadow-md"
                  : "bg-card border border-border text-foreground hover:bg-muted hover:shadow-sm"
              }`}
            >
              <List className="w-4 h-4" />
              List
            </button>
            <button
              onClick={() => setView("map")}
              className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg font-medium transition-all duration-200 ${
                view === "map"
                  ? "bg-primary text-primary-foreground shadow-md"
                  : "bg-card border border-border text-foreground hover:bg-muted hover:shadow-sm"
              }`}
            >
              <MapIcon className="w-4 h-4" />
              Map
            </button>
          </div>
        </div>

        {/* Desktop Layout: Filters + Content */}
        <div className="grid lg:grid-cols-4 gap-6">
          {/* Filters Sidebar */}
          <div className="lg:col-span-1">
            <FiltersPanel
              filters={filters}
              setFilters={setFilters}
              sortBy={sortBy}
              setSortBy={setSortBy}
            />
          </div>

          {/* Content Area */}
          <div className="lg:col-span-3">
            {loading ? (
              <SkeletonList count={5} />
            ) : error ? (
              <div className="bg-card border border-border rounded-2xl p-8 text-center">
                <p className="text-destructive mb-4">{error}</p>
                <p className="text-muted-foreground text-sm">
                  Using cached data. Last synced:{" "}
                  {lastSynced ? new Date(lastSynced).toLocaleString() : "Never"}
                </p>
              </div>
            ) : (
              <>
                {view === "list" && (
                  <HospitalList
                    hospitals={sortedHospitals}
                    onHospitalClick={(id) => setSelectedHospital(id)}
                  />
                )}
                {view === "map" && (
                  <div className="h-[calc(100vh-200px)] min-h-[500px]">
                    <MapboxMap
                      hospitals={sortedHospitals}
                      onMarkerClick={(id) => setSelectedHospital(id)}
                      selectedHospital={selectedHospital}
                    />
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
