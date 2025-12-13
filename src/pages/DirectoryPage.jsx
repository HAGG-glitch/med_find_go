import { useState, useMemo, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { List, MapIcon } from "lucide-react";
import { useTranslation } from "react-i18next";
import FiltersPanel from "../components/FiltersPanel";
import HospitalList from "../components/HospitalList";
import MapboxMap from "../components/MapboxMap";
import { SkeletonList } from "../components/SkeletonLoader";
import { useHospitals } from "../hooks/useHospitals";
import { useGeolocation } from "../hooks/useGeolocation";
import { useFavorites } from "../hooks/useFavorites";

export default function DirectoryPage() {
  const { t } = useTranslation();
  const { hospitals, loading, error, lastSynced } = useHospitals({
    pollInterval: 30000,
  });
  const { location: userLocation, requestLocation } = useGeolocation();
  const { favorites } = useFavorites();
  const [searchParams, setSearchParams] = useSearchParams();
  const searchQuery = searchParams.get("search") || "";
  const [view, setView] = useState(() => {
    // Check URL params for view preference
    const viewParam = searchParams.get("view");
    return viewParam === "map" ? "map" : "list";
  });
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
    favoritesOnly: false, // NEW: Filter by favorites
  });
  const [sortBy, setSortBy] = useState(() => {
    // Check URL params for sort preference
    const sortParam = searchParams.get("sort");
    return sortParam || "nearest";
  });
  const [selectedHospital, setSelectedHospital] = useState(null);

  // Request location if coming from homepage "Locate Me" button
  useEffect(() => {
    const sortParam = searchParams.get("sort");
    if (sortParam === "nearest" && !userLocation) {
      requestLocation();
    }
  }, [searchParams, userLocation, requestLocation]);

  // Handle "View on Map" button click
  const handleViewOnMap = (hospitalId) => {
    setSelectedHospital(hospitalId);
    setView("map");
    // Scroll to top to ensure map is visible
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

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

  // Filter hospitals based on current filters and search
  const filteredHospitals = useMemo(() => {
    return hospitals.filter((hospital) => {
      // Search filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const matchesSearch =
          hospital.name.toLowerCase().includes(query) ||
          hospital.address.toLowerCase().includes(query) ||
          hospital.district.toLowerCase().includes(query) ||
          hospital.services.some((service) =>
            service.toLowerCase().includes(query)
          ) ||
          hospital.specialists.some((spec) =>
            spec.toLowerCase().includes(query)
          );
        if (!matchesSearch) return false;
      }

      // Favorites filter
      if (filters.favoritesOnly && !favorites.includes(hospital.id))
        return false;

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
  }, [hospitals, filters, favorites, searchQuery]);

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
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-[#0F172A] text-[#111827] dark:text-[#E0F2FE]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-bold text-deepforest dark:text-green-400 mb-2">
              {t("hospital_directory")}
            </h1>
            <p className="text-deepforest/70">
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
                  ? "bg-amber-400 text-white shadow-md"
                  : "bg-white dark:bg-[#1E293B] border border-[#E2E8F0] dark:border-[#334155] text-[#111827] dark:text-[#E0F2FE] hover:bg-sky-100 dark:hover:bg-[#334155] hover:shadow-sm"
              }`}
            >
              <List className="w-4 h-4 text-deepforest" />
              List
            </button>
            <button
              onClick={() => setView("map")}
              className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg font-medium transition-all duration-200 ${
                view === "map"
                  ? "bg-amber-400 text-white shadow-md"
                  : "bg-white dark:bg-[#1E293B] border border-[#E2E8F0] dark:border-[#334155] text-[#111827] dark:text-[#E0F2FE] hover:bg-sky-100 dark:hover:bg-[#334155] hover:shadow-sm"
              }`}
            >
              <MapIcon className="w-4 h-4 text-deepforest" />
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
              className="bg-white dark:bg-[#1E293B] border border-[#E2E8F0] dark:border-[#334155] rounded-2xl p-4 shadow-sm"
            />
          </div>

          {/* Content Area */}
          <div className="lg:col-span-3">
            {loading ? (
              <SkeletonList count={5} />
            ) : error ? (
              <div className="bg-white dark:bg-[#1E293B] border border-[#E2E8F0] dark:border-[#334155] rounded-2xl p-8 text-center shadow-sm">
                <p className="text-destructive mb-4">{error}</p>
                <p className="text-gray-500 text-sm">
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
                    onViewMap={handleViewOnMap}
                    className="space-y-4"
                  />
                )}
                {view === "map" && (
                  <div className="h-[calc(100vh-200px)] min-h-[500px] rounded-2xl overflow-hidden border border-[#E2E8F0] dark:border-[#334155] shadow-sm">
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
