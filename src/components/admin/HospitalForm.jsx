import { useState } from "react"
import { X } from "lucide-react"

export default function HospitalForm({ hospital, onSubmit, onClose }) {
  const [formData, setFormData] = useState(
    hospital || {
      name: "",
      address: "",
      district: "",
      phone: "",
      latitude: 8.4875,
      longitude: -13.234,
      beds_available: 0,
      oxygen: false,
      ambulance: false,
      services: [],
      specialists: [],
      rating: 0,
      queue_status: "light",
      emergency_capacity: "medium",
      is_government: true,
      open_now: true,
    },
  )

  const [serviceInput, setServiceInput] = useState("")
  const [specialistInput, setSpecialistInput] = useState("")

  const districts = [
    "Western Area",
    "Bo",
    "Kenema",
    "Kono",
    "Port Loko",
    "Bombali",
    "Tonkolili",
    "Kambia",
    "Kailahun",
    "Pujehun",
    "Moyamba",
    "Bonthe",
    "Koinadugu",
  ]

  const handleSubmit = (e) => {
    e.preventDefault()
    onSubmit(formData)
  }

  const addService = () => {
    if (serviceInput.trim() && !formData.services.includes(serviceInput.trim())) {
      setFormData({
        ...formData,
        services: [...formData.services, serviceInput.trim()],
      })
      setServiceInput("")
    }
  }

  const removeService = (service) => {
    setFormData({
      ...formData,
      services: formData.services.filter((s) => s !== service),
    })
  }

  const addSpecialist = () => {
    if (specialistInput.trim() && !formData.specialists.includes(specialistInput.trim())) {
      setFormData({
        ...formData,
        specialists: [...formData.specialists, specialistInput.trim()],
      })
      setSpecialistInput("")
    }
  }

  const removeSpecialist = (specialist) => {
    setFormData({
      ...formData,
      specialists: formData.specialists.filter((s) => s !== specialist),
    })
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-card border border-border rounded-2xl p-6 max-w-3xl w-full my-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-foreground">{hospital ? "Edit Hospital" : "Add New Hospital"}</h2>
          <button onClick={onClose} className="p-2 hover:bg-muted rounded-lg transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Info */}
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Hospital Name *</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
                className="w-full px-4 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">District *</label>
              <select
                value={formData.district}
                onChange={(e) => setFormData({ ...formData, district: e.target.value })}
                required
                className="w-full px-4 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="">Select district</option>
                {districts.map((district) => (
                  <option key={district} value={district}>
                    {district}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Address *</label>
              <input
                type="text"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                required
                className="w-full px-4 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Phone *</label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                required
                className="w-full px-4 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>

          {/* Coordinates */}
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Latitude *</label>
              <input
                type="number"
                step="0.0001"
                value={formData.latitude}
                onChange={(e) => setFormData({ ...formData, latitude: Number.parseFloat(e.target.value) })}
                required
                className="w-full px-4 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Longitude *</label>
              <input
                type="number"
                step="0.0001"
                value={formData.longitude}
                onChange={(e) => setFormData({ ...formData, longitude: Number.parseFloat(e.target.value) })}
                required
                className="w-full px-4 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>

          {/* Type & Status */}
          <div className="grid md:grid-cols-3 gap-4">
            <div>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.is_government}
                  onChange={(e) => setFormData({ ...formData, is_government: e.target.checked })}
                  className="w-4 h-4 text-primary border-border rounded focus:ring-primary"
                />
                <span className="text-sm font-medium text-foreground">Government Hospital</span>
              </label>
            </div>

            <div>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.open_now}
                  onChange={(e) => setFormData({ ...formData, open_now: e.target.checked })}
                  className="w-4 h-4 text-primary border-border rounded focus:ring-primary"
                />
                <span className="text-sm font-medium text-foreground">Currently Open</span>
              </label>
            </div>
          </div>

          {/* Services */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Services</label>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                value={serviceInput}
                onChange={(e) => setServiceInput(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addService())}
                placeholder="Add service..."
                className="flex-1 px-4 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <button
                type="button"
                onClick={addService}
                className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
              >
                Add
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {formData.services.map((service) => (
                <span
                  key={service}
                  className="px-3 py-1 bg-secondary text-secondary-foreground rounded-lg text-sm flex items-center gap-2"
                >
                  {service}
                  <button type="button" onClick={() => removeService(service)} className="hover:text-destructive">
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
          </div>

          {/* Specialists */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Specialists</label>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                value={specialistInput}
                onChange={(e) => setSpecialistInput(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addSpecialist())}
                placeholder="Add specialist..."
                className="flex-1 px-4 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <button
                type="button"
                onClick={addSpecialist}
                className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
              >
                Add
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {formData.specialists.map((specialist) => (
                <span
                  key={specialist}
                  className="px-3 py-1 bg-secondary text-secondary-foreground rounded-lg text-sm flex items-center gap-2"
                >
                  {specialist}
                  <button type="button" onClick={() => removeSpecialist(specialist)} className="hover:text-destructive">
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
          </div>

          {/* Buttons */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3 bg-muted text-foreground rounded-xl font-semibold hover:bg-muted/80 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-6 py-3 bg-primary text-primary-foreground rounded-xl font-semibold hover:bg-primary/90 transition-colors"
            >
              {hospital ? "Update Hospital" : "Create Hospital"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
