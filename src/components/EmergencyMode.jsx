import { useState, useEffect } from "react";
import { AlertTriangle, X, Phone, Bed, Wind, Languages } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useHospitals } from "../hooks/useHospitals";
import { useGeolocation } from "../hooks/useGeolocation";
import { speak, stopSpeaking } from "../utils/speak";
import HospitalCard from "./HospitalCard";

/**
 * Emergency Mode Component
 * Shows only critical hospitals with simplified UI
 */
export default function EmergencyMode() {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const { hospitals } = useHospitals({ pollInterval: 30000 });
  const { location: userLocation, requestLocation } = useGeolocation();

  const [emergencyHospitals, setEmergencyHospitals] = useState([]);

  // Vibration feedback
  const vibrate = (pattern = [200]) => {
    if ("vibrate" in navigator) {
      navigator.vibrate(pattern);
    }
  };

  // Toggle language
  const toggleLanguage = () => {
    const currentLang = i18n.language?.slice(0, 2) || "kr";
    const newLang = currentLang === "en" ? "kr" : "en";
    i18n.changeLanguage(newLang);
    localStorage.setItem("lang", newLang);
    vibrate([100]);
    speak(t("emergency_help"), newLang);
  };

  const handleClose = () => {
    stopSpeaking();
    navigate(-1);
  };

  // Voice prompt and vibration on mount
  useEffect(() => {
    vibrate([200, 100, 200]);
    speak(t("emergency_mode_activated"), i18n.language);

    return () => {
      stopSpeaking();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!userLocation) requestLocation();
  }, [userLocation, requestLocation]);

  useEffect(() => {
    const emergency = hospitals.filter(
      (h) => h.open_now && h.ambulance && h.emergency_capacity !== "low"
    );

    if (userLocation) {
      const calculateDistance = (lat1, lon1, lat2, lon2) => {
        const R = 6371;
        const dLat = ((lat2 - lat1) * Math.PI) / 180;
        const dLon = ((lon2 - lon1) * Math.PI) / 180;
        const a =
          Math.sin(dLat / 2) ** 2 +
          Math.cos((lat1 * Math.PI) / 180) *
            Math.cos((lat2 * Math.PI) / 180) *
            Math.sin(dLon / 2) ** 2;
        return R * (2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)));
      };

      emergency.sort((a, b) => {
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

    setEmergencyHospitals(emergency);
  }, [hospitals, userLocation]);

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-red-600">
      {/* HEADER */}
      <header className="border-b border-red-700 bg-red-600 px-4 py-4">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <div className="flex items-center gap-3">
            <AlertTriangle className="h-9 w-9 animate-pulse text-white" />
            <div>
              <h1 className="text-2xl font-extrabold text-white">
                {t("emergency_mode")}
              </h1>
              <p className="text-sm text-white/80">
                {t("ambulance_emergency_ready")}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Language Toggle */}
            <button
              onClick={toggleLanguage}
              className="rounded-xl p-2 text-white transition hover:bg-white/20 active:scale-95"
              aria-label="Toggle language"
              title={
                i18n.language === "en" ? "Switch to Krio" : "Switch to English"
              }
            >
              <Languages className="h-5 w-5" />
            </button>

            <button
              onClick={handleClose}
              className="rounded-xl p-2 text-white transition hover:bg-white/20 active:scale-95"
              aria-label="Exit emergency mode"
            >
              <X className="h-6 w-6" />
            </button>
          </div>
        </div>
      </header>

      {/* EMERGENCY CALL & PANIC BUTTONS */}
      <section className="border-b border-white/20 bg-red-500 px-4 py-4">
        <div className="mx-auto max-w-7xl space-y-3">
          {/* Main Emergency Call */}
          <a
            href="tel:+23276999999"
            onClick={() => vibrate([100, 50, 100])}
            className="flex items-center justify-center gap-3 rounded-2xl bg-white px-8 py-5 text-lg font-extrabold text-red-600 shadow-xl transition active:scale-95 hover:bg-red-50"
          >
            <Phone className="h-6 w-6" />
            {t("call_emergency")}: +232 76 999 999
          </a>

          {/* Ultra-Simple Panic Buttons */}
          {emergencyHospitals.length > 0 && (
            <div className="grid grid-cols-3 gap-2">
              {/* BED Button */}
              <button
                onClick={() => {
                  vibrate([100]);
                  const hasBeds = emergencyHospitals.some(
                    (h) => h.beds_available > 0
                  );
                  speak(
                    hasBeds ? t("panic_bed") : t("panic_no_bed"),
                    i18n.language
                  );
                }}
                className="flex flex-col items-center justify-center gap-1 rounded-xl bg-white/90 px-4 py-4 text-sm font-bold text-red-600 shadow-lg transition active:scale-95 hover:bg-white"
              >
                <Bed className="h-6 w-6" />
                <span className="text-xs">{t("panic_bed")}</span>
              </button>

              {/* OXYGEN Button */}
              <button
                onClick={() => {
                  vibrate([100]);
                  const hasOxygen = emergencyHospitals.some(
                    (h) => h.oxygen_available
                  );
                  speak(
                    hasOxygen ? t("panic_oxygen") : t("panic_no_bed"),
                    i18n.language
                  );
                }}
                className="flex flex-col items-center justify-center gap-1 rounded-xl bg-white/90 px-4 py-4 text-sm font-bold text-red-600 shadow-lg transition active:scale-95 hover:bg-white"
              >
                <Wind className="h-6 w-6" />
                <span className="text-xs">{t("panic_oxygen")}</span>
              </button>

              {/* AMBULANCE Button */}
              <button
                onClick={() => {
                  vibrate([100]);
                  speak(t("panic_ambulance"), i18n.language);
                }}
                className="flex flex-col items-center justify-center gap-1 rounded-xl bg-white/90 px-4 py-4 text-sm font-bold text-red-600 shadow-lg transition active:scale-95 hover:bg-white"
              >
                <Phone className="h-6 w-6" />
                <span className="text-xs">{t("panic_ambulance")}</span>
              </button>
            </div>
          )}
        </div>
      </section>

      {/* CONTENT */}
      <main className="flex-1 overflow-y-auto bg-[#F8FAFC] dark:bg-[#0F172A]">
        <div className="mx-auto max-w-7xl px-4 py-6">
          {emergencyHospitals.length === 0 ? (
            <div className="py-16 text-center">
              <AlertTriangle className="mx-auto mb-5 h-16 w-16 text-gray-400" />
              <h2 className="mb-2 text-2xl font-bold text-gray-900">
                {t("no_emergency_hospitals")}
              </h2>
              <p className="mb-6 text-gray-600">
                {t("call_hotline_or_search")}
              </p>
              <button
                onClick={handleClose}
                className="rounded-xl bg-amber-500 px-6 py-3 font-semibold text-white shadow-md transition hover:bg-amber-600 active:scale-95"
              >
                {t("exit_emergency_mode")}
              </button>
            </div>
          ) : (
            <>
              <div className="mb-6">
                <h2 className="text-xl font-bold text-[#111827] dark:text-[#E0F2FE]">
                  {emergencyHospitals.length} {t("emergency_ready_hospitals")}
                </h2>
                <p className="text-sm text-gray-600 dark:text-[#94A3B8]">
                  {t("sorted_by_distance")}{" "}
                  {!userLocation && t("enable_location_for_accuracy")}
                </p>
              </div>

              <div className="space-y-4">
                {emergencyHospitals.map((hospital) => (
                  <HospitalCard key={hospital.id} hospital={hospital} />
                ))}
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
}
