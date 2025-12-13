import { Link, useNavigate } from "react-router-dom";
import {
  ArrowRight,
  Activity,
  MapPin,
  Truck,
  Building2,
  Users,
  Stethoscope,
  Locate,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import TypeaheadSearch from "../components/TypeaheadSearch";
import { useHospitals } from "../hooks/useHospitals";
import { useGeolocation } from "../hooks/useGeolocation";

export default function HomePage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { hospitals } = useHospitals({ pollInterval: 0 });
  const {
    location,
    requestLocation,
    loading: locationLoading,
  } = useGeolocation();

  const handleLocateMe = () => {
    if (location) {
      // If we already have location, navigate immediately
      navigate("/directory?sort=nearest&view=map");
    } else {
      // Request location first
      requestLocation();
      // Navigate to directory - it will handle location request if needed
      navigate("/directory?sort=nearest&view=map");
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-[#0F172A] text-[#111827] dark:text-[#E0F2FE]">
      {/* Hero Section */}
      <section className="relative bg-sky-100 dark:bg-[#1E293B] py-20 md:py-32 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <div className="inline-flex items-center gap-2 bg-green-100 text-green-800 px-4 py-2 rounded-full text-sm font-medium mb-6 border border-green-200 shadow-sm">
            <Activity className="w-4 h-4" />
            {t("real_time_availability")}
          </div>

          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-green-800 dark:text-[#E0F2FE] mb-6">
            {t("app_name")}
          </h1>

          <p className="text-xl md:text-2xl text-green-700 dark:text-[#94A3B8] mb-10 leading-relaxed">
            {t("find_hospitals_near_you")}
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/directory"
              className="inline-flex items-center justify-center gap-2 bg-amber-500 text-white px-8 py-4 rounded-xl font-semibold hover:bg-amber-600 transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-105 active:scale-95"
            >
              {t("view_hospitals")}
              <ArrowRight className="w-5 h-5" />
            </Link>

            <a
              href="tel:+23276999999"
              className="inline-flex items-center justify-center gap-2 bg-red-500 text-white px-8 py-4 rounded-xl font-semibold hover:bg-red-600 transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-105 active:scale-95"
            >
              {t("emergency_call")}
              <Activity className="w-5 h-5" />
            </a>
          </div>
        </div>
      </section>

      {/* Quick Stats */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
            {[
              { icon: Building2, value: 47, label: t("total_hospitals") },
              { icon: MapPin, value: 16, label: t("districts_covered") },
              { icon: Truck, value: 23, label: t("ambulances_available") },
            ].map((stat, i) => {
              const Icon = stat.icon;
              return (
                <div
                  key={i}
                  className="text-center p-6 bg-white dark:bg-[#1E293B] rounded-2xl border border-[#E2E8F0] dark:border-[#334155] hover:shadow-lg transition-all duration-200 hover:scale-105"
                >
                  <div className="inline-flex items-center justify-center w-14 h-14 bg-sky-100 text-green-800 rounded-xl mb-4 shadow-sm">
                    <Icon className="w-7 h-7" />
                  </div>
                  <div className="text-4xl font-bold text-green-800 dark:text-[#E0F2FE] mb-2">
                    {stat.value}
                  </div>
                  <div className="text-sm text-green-700 dark:text-[#94A3B8] font-medium">
                    {stat.label}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Search Section */}
      <section className="py-16 md:py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-green-800 dark:text-[#E0F2FE] mb-3">
              {t("find_medical_care")}
            </h2>
            <p className="text-green-700 dark:text-[#94A3B8]">
              {t("search_by_hospital")}
            </p>
          </div>

          <TypeaheadSearch hospitals={hospitals} className="mb-6" />

          <div className="flex items-center justify-center">
            <button
              onClick={handleLocateMe}
              className="inline-flex items-center gap-2 px-6 py-3 bg-amber-500 text-white rounded-xl font-semibold hover:bg-amber-600 transition-all duration-200 shadow-md hover:shadow-lg hover:scale-105 active:scale-95"
            >
              <Locate className="w-5 h-5" />
              <span>{t("locate_me")}</span>
            </button>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-green-800 dark:text-green-400 mb-3">
              {t("what_we_offer")}
            </h2>
            <p className="text-green-700 dark:text-green-300 max-w-2xl mx-auto">
              {t("comprehensive_medical")}
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: Activity,
                title: t("real_time_availability"),
                desc: t("real_time_availability_desc"),
              },
              {
                icon: MapPin,
                title: t("interactive_map"),
                desc: t("interactive_map_desc"),
              },
              {
                icon: Stethoscope,
                title: t("specialist_directory"),
                desc: t("specialist_directory_desc"),
              },
              {
                icon: Users,
                title: t("queue_status"),
                desc: t("queue_status_desc"),
              },
              {
                icon: Truck,
                title: t("emergency_services"),
                desc: t("emergency_services_desc"),
              },
              {
                icon: Activity,
                title: t("offline_access"),
                desc: t("offline_access_desc"),
              },
            ].map((feature, i) => {
              const Icon = feature.icon;
              return (
                <div
                  key={i}
                  className="bg-white dark:bg-[#1E293B] p-8 rounded-2xl border border-[#E2E8F0] dark:border-[#334155] hover:shadow-xl transition-all duration-200 hover:scale-105 group"
                >
                  <div className="w-14 h-14 bg-sky-100 text-green-800 rounded-xl flex items-center justify-center mb-5 shadow-sm group-hover:shadow-md transition-all">
                    <Icon className="w-7 h-7" />
                  </div>
                  <h3 className="text-xl font-semibold text-green-800 dark:text-[#E0F2FE] mb-3 group-hover:text-green-700 dark:group-hover:text-[#94A3B8] transition-colors">
                    {feature.title}
                  </h3>
                  <p className="text-green-700 dark:text-[#94A3B8] leading-relaxed">
                    {feature.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-green-800 dark:text-[#E0F2FE] mb-4">
            {t("ready_to_find")}
          </h2>
          <p className="text-green-700 dark:text-[#94A3B8] mb-8">
            {t("browse_comprehensive")}
          </p>
          <Link
            to="/directory"
            className="inline-flex items-center gap-2 bg-amber-500 text-white px-8 py-4 rounded-xl font-semibold hover:bg-amber-600 transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-105 active:scale-95"
          >
            {t("browse_all_hospitals")}
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>
    </div>
  );
}
