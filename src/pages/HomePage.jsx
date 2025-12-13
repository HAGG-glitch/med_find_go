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
import TypeaheadSearch from "../components/TypeaheadSearch";
import { useHospitals } from "../hooks/useHospitals";
import { useGeolocation } from "../hooks/useGeolocation";

export default function HomePage() {
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
    <div className="min-h-screen bg-sky-50">
      {/* Hero Section */}
      <section className="relative bg-sky-100 py-20 md:py-32 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <div className="inline-flex items-center gap-2 bg-green-100 text-green-800 px-4 py-2 rounded-full text-sm font-medium mb-6 border border-green-200 shadow-sm">
            <Activity className="w-4 h-4" />
            Real-time hospital availability
          </div>

          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-green-800 mb-6">
            Med-Find Salone
          </h1>

          <p className="text-xl md:text-2xl text-green-700 mb-10 leading-relaxed">
            Find hospitals with beds, oxygen & ambulance near you
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/directory"
              className="inline-flex items-center justify-center gap-2 bg-amber-500 text-white px-8 py-4 rounded-xl font-semibold hover:bg-amber-600 transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-105 active:scale-95"
            >
              View Hospitals
              <ArrowRight className="w-5 h-5" />
            </Link>

            <a
              href="tel:+23276999999"
              className="inline-flex items-center justify-center gap-2 bg-red-500 text-white px-8 py-4 rounded-xl font-semibold hover:bg-red-600 transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-105 active:scale-95"
            >
              Emergency Call
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
              { icon: Building2, value: 47, label: "Total Hospitals" },
              { icon: MapPin, value: 16, label: "Districts Covered" },
              { icon: Truck, value: 23, label: "Ambulances Available" },
            ].map((stat, i) => {
              const Icon = stat.icon;
              return (
                <div
                  key={i}
                  className="text-center p-6 bg-white rounded-2xl border border-gray-200 hover:shadow-lg transition-all duration-200 hover:scale-105"
                >
                  <div className="inline-flex items-center justify-center w-14 h-14 bg-sky-100 text-green-800 rounded-xl mb-4 shadow-sm">
                    <Icon className="w-7 h-7" />
                  </div>
                  <div className="text-4xl font-bold text-green-800 mb-2">
                    {stat.value}
                  </div>
                  <div className="text-sm text-green-700 font-medium">
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
            <h2 className="text-3xl font-bold text-green-800 mb-3">
              Find Medical Care Near You
            </h2>
            <p className="text-green-700">
              Search by hospital name, service, or district
            </p>
          </div>

          <TypeaheadSearch hospitals={hospitals} className="mb-6" />

          <div className="flex items-center justify-center">
            <button
              onClick={handleLocateMe}
              className="inline-flex items-center gap-2 px-6 py-3 bg-amber-500 text-white rounded-xl font-semibold hover:bg-amber-600 transition-all duration-200 shadow-md hover:shadow-lg hover:scale-105 active:scale-95"
            >
              <Locate className="w-5 h-5" />
              <span>Locate Me</span>
            </button>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-green-800 mb-3">
              What We Offer
            </h2>
            <p className="text-green-700 max-w-2xl mx-auto">
              Comprehensive medical directory with real-time information to help
              you make informed healthcare decisions
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: Activity,
                title: "Real-time Availability",
                desc: "Check bed availability, oxygen supplies, and ambulance status in real-time",
              },
              {
                icon: MapPin,
                title: "Interactive Map",
                desc: "View hospitals on an interactive map and get directions instantly",
              },
              {
                icon: Stethoscope,
                title: "Specialist Directory",
                desc: "Find specialists and services available at each healthcare facility",
              },
              {
                icon: Users,
                title: "Queue Status",
                desc: "Know the wait times before you go with our real-time queue information",
              },
              {
                icon: Truck,
                title: "Emergency Services",
                desc: "Quick access to emergency hotlines and ambulance availability",
              },
              {
                icon: Activity,
                title: "Offline Access",
                desc: "Browse hospital information even without internet connection",
              },
            ].map((feature, i) => {
              const Icon = feature.icon;
              return (
                <div
                  key={i}
                  className="bg-white p-8 rounded-2xl border border-gray-200 hover:shadow-xl transition-all duration-200 hover:scale-105 group"
                >
                  <div className="w-14 h-14 bg-sky-100 text-green-800 rounded-xl flex items-center justify-center mb-5 shadow-sm group-hover:shadow-md transition-all">
                    <Icon className="w-7 h-7" />
                  </div>
                  <h3 className="text-xl font-semibold text-green-800 mb-3 group-hover:text-green-700 transition-colors">
                    {feature.title}
                  </h3>
                  <p className="text-green-700 leading-relaxed">
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
          <h2 className="text-3xl md:text-4xl font-bold text-green-800 mb-4">
            Ready to Find Medical Care?
          </h2>
          <p className="text-green-700 mb-8">
            Browse our comprehensive directory of healthcare facilities across
            Sierra Leone
          </p>
          <Link
            to="/directory"
            className="inline-flex items-center gap-2 bg-amber-500 text-white px-8 py-4 rounded-xl font-semibold hover:bg-amber-600 transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-105 active:scale-95"
          >
            Browse All Hospitals
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>
    </div>
  );
}
