import { useParams, Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import {
  Star,
  Bed,
  Wind,
  Truck,
  Phone,
  MapPin,
  Clock,
  Calendar,
  Users,
  ChevronLeft,
  Navigation,
  AlertCircle,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import { useHospital } from "../hooks/useHospitals";
import { SkeletonDetail } from "../components/SkeletonLoader";
import ReportForm from "../components/ReportForm";
import FavoriteButton from "../components/FavoriteButton";
import RealTimeIndicator from "../components/RealTimeIndicator";

export default function HospitalDetailPage() {
  const { t } = useTranslation();
  const { id } = useParams();
  const navigate = useNavigate();
  const [showReportForm, setShowReportForm] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const { hospital, loading, error } = useHospital(id);

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <SkeletonDetail />
        </div>
      </div>
    );
  }

  if (error || !hospital) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-foreground mb-2">
            {error ? t("error_loading_hospital") : t("hospital_not_found")}
          </h2>
          <Link to="/directory" className="text-primary hover:underline">
            {t("back_to_directory")}
          </Link>
        </div>
      </div>
    );
  }

  const getQueueColor = (status) => {
    if (status === "light") return "text-green bg-accent/10";
    if (status === "medium")
      return "text-yellow-600 bg-yellow-100 dark:bg-yellow-900/20";
    return "text-destructive bg-destructive/10";
  };

  const getCapacityColor = (capacity) => {
    if (capacity === "high") return "text-red bg-accent/10";
    if (capacity === "medium")
      return "text-yellow-600 bg-yellow-100 dark:bg-yellow-900/20";
    return "text-destructive bg-destructive/10";
  };

  const getDirections = () => {
    const url = `https://www.google.com/maps/dir/?api=1&destination=${hospital.latitude},${hospital.longitude}`;
    window.open(url, "_blank");
  };

  // Mock photos if none exist
  const photos =
    hospital.photos.length > 0
      ? hospital.photos
      : [
          `/placeholder.svg?height=400&width=600&query=${encodeURIComponent(
            `${hospital.name} hospital building exterior`
          )}`,
          `/placeholder.svg?height=400&width=600&query=${encodeURIComponent(
            `${hospital.name} medical facility interior`
          )}`,
          `/placeholder.svg?height=400&width=600&query=${encodeURIComponent(
            `${hospital.name} hospital ward`
          )}`,
        ];

  return (
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-[#0F172A] text-[#111827] dark:text-[#E0F2FE]">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-deepforest/70 hover:text-deepforest mb-6 transition-all duration-200 hover:gap-3 group"
        >
          <ChevronLeft className="w-5 h-5 group-hover:translate-x-[-2px] transition-transform text-deepforest" />
          <span className="font-medium">{t("back")}</span>
        </button>

        {/* Header Section */}
        <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden mb-6 shadow-sm">
          {/* Photo Carousel */}
          <div className="relative h-64 md:h-96 bg-sky-50">
            <img
              src={photos[currentImageIndex] || "/placeholder.svg"}
              alt={hospital.name}
              className="w-full h-full object-cover"
            />
            {photos.length > 1 && (
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                {photos.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`w-2 h-2 rounded-full transition-colors ${
                      index === currentImageIndex
                        ? "bg-amber-400"
                        : "bg-amber-200"
                    }`}
                  />
                ))}
              </div>
            )}
            {hospital.open_now && (
              <div className="absolute top-4 right-4 px-4 py-2 bg-amber-400 text-white rounded-lg font-semibold shadow border border-amber-200 animate-pulse">
                Open Now
              </div>
            )}
          </div>

          {/* Hospital Info */}
          <div className="p-6">
            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-4">
              <div className="flex-1">
                <div className="flex items-start gap-3 mb-2">
                  <h1 className="text-3xl font-bold text-deepforest flex-1">
                    {hospital.name}
                  </h1>
                  <FavoriteButton hospitalId={hospital.id} />
                </div>
                <div className="flex items-center gap-2 text-deepforest/70 mb-3">
                  <MapPin className="w-5 h-5 text-leaf" />
                  <span>
                    {hospital.address}, {hospital.district}
                  </span>
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1">
                    <Star className="w-6 h-6 fill-amber-400 text-amber-400" />
                    <span className="text-xl font-bold text-deepforest">
                      {hospital.rating}
                    </span>
                  </div>
                  <span className="px-3 py-1 bg-sky-100 text-deepforest text-sm font-medium rounded-full border border-gray-200">
                    {hospital.is_government ? "Government" : "Private"}
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col gap-2">
                <a
                  href={`tel:${hospital.phone}`}
                  className="flex items-center justify-center gap-2 px-6 py-3 bg-amber-400 text-white rounded-lg hover:bg-amber-500 transition-all duration-200 font-semibold shadow-sm hover:shadow-md hover:scale-105 active:scale-95"
                >
                  <Phone className="w-5 h-5" />
                  Call Hospital
                </a>
                <button
                  onClick={getDirections}
                  className="flex items-center justify-center gap-2 px-6 py-3 bg-deepforest text-amber-400 rounded-lg hover:bg-deepforest/90 transition-all duration-200 font-semibold shadow-sm hover:shadow-md hover:scale-105 active:scale-95"
                >
                  <Navigation className="w-5 h-5" />
                  Get Directions
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Availability Section */}
        <div className="bg-white dark:bg-[#1E293B] border border-[#E2E8F0] dark:border-[#334155] rounded-2xl p-6 mb-6 shadow-sm">
          <h2 className="text-xl font-bold text-deepforest mb-6">
            Current Availability
          </h2>
          <div className="grid md:grid-cols-3 gap-4">
            {/* Beds */}
            <div className="flex items-center gap-4 p-5 bg-sky-50 rounded-xl border border-gray-200 hover:shadow-md transition-all duration-200 hover:scale-105">
              <div className="w-14 h-14 bg-amber-100 rounded-xl flex items-center justify-center shadow-sm">
                <Bed className="w-7 h-7 text-amber-400" />
              </div>
              <div>
                <div className="text-2xl font-bold text-deepforest">
                  {hospital.beds_available}
                </div>
                <div className="text-sm text-deepforest/70">Beds Available</div>
              </div>
            </div>

            {/* Oxygen */}
            <div className="flex items-center gap-4 p-5 bg-sky-50 rounded-xl border border-gray-200 hover:shadow-md transition-all duration-200 hover:scale-105">
              <div
                className={`w-14 h-14 rounded-xl flex items-center justify-center shadow-sm ${
                  hospital.oxygen ? "bg-amber-100" : "bg-sky-100"
                }`}
              >
                <Wind
                  className={`w-7 h-7 ${
                    hospital.oxygen ? "text-amber-400" : "text-deepforest/40"
                  }`}
                />
              </div>
              <div>
                <div className="text-2xl font-bold text-deepforest">
                  {hospital.oxygen ? "Available" : "Not Available"}
                </div>
                <div className="text-sm text-deepforest/70">Oxygen Supply</div>
              </div>
            </div>

            {/* Ambulance */}
            <div className="flex items-center gap-4 p-5 bg-sky-50 rounded-xl border border-gray-200 hover:shadow-md transition-all duration-200 hover:scale-105">
              <div
                className={`w-14 h-14 rounded-xl flex items-center justify-center shadow-sm ${
                  hospital.ambulance ? "bg-amber-100" : "bg-sky-100"
                }`}
              >
                <Truck
                  className={`w-7 h-7 ${
                    hospital.ambulance ? "text-amber-400" : "text-deepforest/40"
                  }`}
                />
              </div>
              <div>
                <div className="text-2xl font-bold text-deepforest">
                  {hospital.ambulance ? "Available" : "Not Available"}
                </div>
                <div className="text-sm text-deepforest/70">Ambulance</div>
              </div>
            </div>
          </div>
        </div>

        {/* Services & Specialists */}
        <div className="grid md:grid-cols-2 gap-6 mb-6">
          {/* Services */}
          <div className="bg-white dark:bg-[#1E293B] border border-[#E2E8F0] dark:border-[#334155] rounded-2xl p-6 shadow-sm">
            <h2 className="text-xl font-bold text-deepforest mb-5">Services</h2>
            <div className="flex flex-wrap gap-2">
              {hospital.services.map((service) => (
                <span
                  key={service}
                  className="px-4 py-2 bg-sky-50 text-deepforest rounded-lg text-sm font-medium border border-gray-200 shadow-sm hover:shadow-md transition-all duration-200 hover:scale-105"
                >
                  {service}
                </span>
              ))}
            </div>
          </div>

          {/* Specialists */}
          <div className="bg-white dark:bg-[#1E293B] border border-[#E2E8F0] dark:border-[#334155] rounded-2xl p-6 shadow-sm">
            <h2 className="text-xl font-bold text-deepforest mb-5 flex items-center gap-2">
              <Users className="w-5 h-5 text-leaf" />
              Specialists
            </h2>
            <div className="space-y-3">
              {hospital.specialists.map((specialist) => (
                <div
                  key={specialist}
                  className="flex items-center gap-3 text-deepforest p-2 rounded-lg hover:bg-sky-100 transition-colors"
                >
                  <div className="w-2.5 h-2.5 bg-amber-400 rounded-full shadow-sm" />
                  <span className="font-medium">{specialist}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Contact & Visiting Hours */}
        <div className="bg-white dark:bg-[#1E293B] border border-[#E2E8F0] dark:border-[#334155] rounded-2xl p-6 mb-6 shadow-sm">
          <h2 className="text-xl font-bold text-deepforest mb-5">
            Contact & Visiting Hours
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Phone className="w-5 h-5 text-leaf" />
                <span className="font-medium text-deepforest">
                  Phone Number
                </span>
              </div>
              <a
                href={`tel:${hospital.phone}`}
                className="text-amber-400 hover:underline text-lg"
              >
                {hospital.phone}
              </a>
            </div>
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Calendar className="w-5 h-5 text-leaf" />
                <span className="font-medium text-deepforest">
                  Visiting Hours
                </span>
              </div>
              <p className="text-deepforest">Daily: 2:00 PM - 6:00 PM</p>
            </div>
          </div>
        </div>

        {/* Last Updated & Report Button */}
        <div className="bg-white border border-gray-200 rounded-2xl p-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="text-sm text-deepforest/70">
              <span className="font-medium">Last updated:</span>{" "}
              {new Date(hospital.last_updated).toLocaleString()}
            </div>
            <button
              onClick={() => setShowReportForm(true)}
              className="px-6 py-2.5 bg-amber-400 text-white rounded-lg hover:bg-amber-500 transition-all duration-200 font-medium shadow-sm hover:shadow-md hover:scale-105 active:scale-95"
            >
              Report Inaccurate Info
            </button>
          </div>
        </div>
      </div>

      {/* Report Form Modal */}
      {showReportForm && (
        <ReportForm
          hospitalId={hospital.id}
          hospitalName={hospital.name}
          onClose={() => setShowReportForm(false)}
        />
      )}
    </div>
  );
}
