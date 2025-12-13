import { useState, useEffect } from "react";
import { Plus, Search, Edit, Trash2, RefreshCw, Lock } from "lucide-react";
import HospitalForm from "../components/admin/HospitalForm";
import AvailabilityForm from "../components/admin/AvailabilityForm";
import ReportsViewer from "../components/admin/ReportsViewer";
import { mockHospitals } from "../data/mockHospitals";

export default function AdminPanel() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [activeTab, setActiveTab] = useState("hospitals"); // hospitals, reports
  const [hospitals, setHospitals] = useState(mockHospitals);
  const [searchTerm, setSearchTerm] = useState("");
  const [editingHospital, setEditingHospital] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [showAvailabilityForm, setShowAvailabilityForm] = useState(false);
  const [selectedHospital, setSelectedHospital] = useState(null);

  // Check authentication
  const handleLogin = (e) => {
    e.preventDefault();
    const adminSecret = import.meta.env.VITE_ADMIN_SECRET || "admin123";
    if (password === adminSecret) {
      setIsAuthenticated(true);
      localStorage.setItem("admin_auth", "true");
    } else {
      alert("Incorrect password");
    }
  };

  useEffect(() => {
    const auth = localStorage.getItem("admin_auth");
    if (auth === "true") {
      setIsAuthenticated(true);
    }
  }, []);

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem("admin_auth");
  };

  // CRUD Operations
  const handleCreate = (hospitalData) => {
    const newHospital = {
      ...hospitalData,
      id: Math.max(...hospitals.map((h) => h.id)) + 1,
      last_updated: new Date().toISOString(),
    };
    setHospitals([...hospitals, newHospital]);
    setShowForm(false);
  };

  const handleUpdate = (hospitalData) => {
    setHospitals(
      hospitals.map((h) =>
        h.id === hospitalData.id
          ? {
              ...hospitalData,
              last_updated: new Date().toISOString(),
            }
          : h
      )
    );
    setEditingHospital(null);
    setShowForm(false);
  };

  const handleDelete = (id) => {
    if (confirm("Are you sure you want to delete this hospital?")) {
      setHospitals(hospitals.filter((h) => h.id !== id));
    }
  };

  const handleUpdateAvailability = (id, availabilityData) => {
    setHospitals(
      hospitals.map((h) =>
        h.id === id
          ? {
              ...h,
              ...availabilityData,
              last_updated: new Date().toISOString(),
            }
          : h
      )
    );
    setShowAvailabilityForm(false);
    setSelectedHospital(null);
  };

  // Filter hospitals by search
  const filteredHospitals = hospitals.filter(
    (h) =>
      h.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      h.district.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="bg-card border border-border rounded-2xl p-8 max-w-md w-full shadow-xl">
          <div className="w-16 h-16 bg-gradient-to-br from-primary/20 to-primary/10 text-primary rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-md">
            <Lock className="w-8 h-8" />
          </div>
          <h1 className="text-2xl font-bold text-foreground text-center mb-6">
            Admin Panel
          </h1>
          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Admin Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter admin password"
                className="w-full px-4 py-3 bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all shadow-sm hover:shadow-md"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full px-6 py-3 bg-primary text-primary-foreground rounded-xl font-semibold hover:bg-primary/90 transition-all duration-200 shadow-md hover:shadow-lg hover:scale-105 active:scale-95"
            >
              Login
            </button>
          </form>
          <p className="text-xs text-muted-foreground text-center mt-4">
            Default password: Check VITE_ADMIN_SECRET in .env
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-sky-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-deepforest mb-2">
              Admin Panel
            </h1>
            <p className="text-deepforest/70">
              Manage hospitals and review reports
            </p>
          </div>
          <button
            onClick={handleLogout}
            className="px-4 py-2.5 bg-white border border-gray-200 text-deepforest rounded-lg hover:bg-sky-50 transition-all duration-200 shadow-sm hover:shadow-md hover:scale-105 active:scale-95 font-medium"
          >
            Logout
          </button>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 border-b border-gray-200">
          <button
            onClick={() => setActiveTab("hospitals")}
            className={`px-6 py-3 font-medium transition-all duration-200 border-b-2 ${
              activeTab === "hospitals"
                ? "border-amber-400 text-amber-400"
                : "border-transparent text-deepforest/70 hover:text-deepforest hover:border-deepforest/30"
            }`}
          >
            Hospitals ({hospitals.length})
          </button>
          <button
            onClick={() => setActiveTab("reports")}
            className={`px-6 py-3 font-medium transition-all duration-200 border-b-2 ${
              activeTab === "reports"
                ? "border-amber-400 text-amber-400"
                : "border-transparent text-deepforest/70 hover:text-deepforest hover:border-deepforest/30"
            }`}
          >
            Reports
          </button>
        </div>

        {/* Hospitals Tab */}
        {activeTab === "hospitals" && (
          <>
            {/* Actions Bar */}
            <div className="flex flex-col md:flex-row gap-4 mb-6">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-leaf pointer-events-none" />
                <input
                  type="text"
                  placeholder="Search hospitals..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-400/30 focus:border-amber-400 transition-all shadow-sm hover:shadow-md"
                />
              </div>
              <button
                onClick={() => {
                  setEditingHospital(null);
                  setShowForm(true);
                }}
                className="flex items-center justify-center gap-2 px-6 py-3 bg-amber-400 text-white rounded-xl font-semibold hover:bg-amber-500 transition-all duration-200 shadow-md hover:shadow-lg hover:scale-105 active:scale-95"
              >
                <Plus className="w-5 h-5" />
                Add Hospital
              </button>
            </div>

            {/* Hospitals List */}
            <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-sky-50 border-b border-gray-200">
                    <tr>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-deepforest">
                        Name
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-deepforest">
                        District
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-deepforest">
                        Beds
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-deepforest">
                        Status
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-deepforest">
                        Last Updated
                      </th>
                      <th className="px-6 py-4 text-right text-sm font-semibold text-deepforest">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {filteredHospitals.map((hospital) => (
                      <tr
                        key={hospital.id}
                        className="hover:bg-sky-50 transition-colors duration-150"
                      >
                        <td className="px-6 py-4">
                          <div className="font-medium text-deepforest">
                            {hospital.name}
                          </div>
                          <div className="text-sm text-deepforest/70">
                            {hospital.phone}
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-deepforest">
                          {hospital.district}
                        </td>
                        <td className="px-6 py-4 text-sm text-deepforest">
                          {hospital.beds_available}
                        </td>
                        <td className="px-6 py-4">
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-medium ${
                              hospital.open_now
                                ? "bg-amber-100 text-amber-400"
                                : "bg-sky-100 text-deepforest/70"
                            }`}
                          >
                            {hospital.open_now ? "Open" : "Closed"}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-deepforest/70">
                          {new Date(hospital.last_updated).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => {
                                setSelectedHospital(hospital);
                                setShowAvailabilityForm(true);
                              }}
                              className="p-2 text-amber-400 hover:bg-amber-100 rounded-lg transition-all duration-200 hover:scale-110 active:scale-95"
                              title="Update availability"
                            >
                              <RefreshCw className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => {
                                setEditingHospital(hospital);
                                setShowForm(true);
                              }}
                              className="p-2 text-amber-400 hover:bg-amber-100 rounded-lg transition-all duration-200 hover:scale-110 active:scale-95"
                              title="Edit"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDelete(hospital.id)}
                              className="p-2 text-destructive hover:bg-destructive/10 rounded-lg transition-all duration-200 hover:scale-110 active:scale-95"
                              title="Delete"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}

        {/* Reports Tab */}
        {activeTab === "reports" && <ReportsViewer />}
      </div>

      {/* Hospital Form Modal */}
      {showForm && (
        <HospitalForm
          hospital={editingHospital}
          onSubmit={editingHospital ? handleUpdate : handleCreate}
          onClose={() => {
            setShowForm(false);
            setEditingHospital(null);
          }}
        />
      )}

      {/* Availability Form Modal */}
      {showAvailabilityForm && selectedHospital && (
        <AvailabilityForm
          hospital={selectedHospital}
          onSubmit={(data) =>
            handleUpdateAvailability(selectedHospital.id, data)
          }
          onClose={() => {
            setShowAvailabilityForm(false);
            setSelectedHospital(null);
          }}
        />
      )}
    </div>
  );
}
