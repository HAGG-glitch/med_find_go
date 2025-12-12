import { useState } from "react"
import { X } from "lucide-react"

export default function AvailabilityForm({ hospital, onSubmit, onClose }) {
  const [formData, setFormData] = useState({
    beds_available: hospital.beds_available,
    oxygen: hospital.oxygen,
    ambulance: hospital.ambulance,
    queue_status: hospital.queue_status,
    emergency_capacity: hospital.emergency_capacity,
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    onSubmit(formData)
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-card border border-border rounded-2xl p-6 max-w-md w-full">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-bold text-foreground">Update Availability</h2>
            <p className="text-sm text-muted-foreground mt-1">{hospital.name}</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-muted rounded-lg transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Beds Available */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Beds Available</label>
            <input
              type="number"
              min="0"
              value={formData.beds_available}
              onChange={(e) => setFormData({ ...formData, beds_available: Number.parseInt(e.target.value) })}
              className="w-full px-4 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          {/* Oxygen */}
          <div>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.oxygen}
                onChange={(e) => setFormData({ ...formData, oxygen: e.target.checked })}
                className="w-4 h-4 text-primary border-border rounded focus:ring-primary"
              />
              <span className="text-sm font-medium text-foreground">Oxygen Available</span>
            </label>
          </div>

          {/* Ambulance */}
          <div>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.ambulance}
                onChange={(e) => setFormData({ ...formData, ambulance: e.target.checked })}
                className="w-4 h-4 text-primary border-border rounded focus:ring-primary"
              />
              <span className="text-sm font-medium text-foreground">Ambulance Available</span>
            </label>
          </div>

          {/* Queue Status */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Queue Status</label>
            <select
              value={formData.queue_status}
              onChange={(e) => setFormData({ ...formData, queue_status: e.target.value })}
              className="w-full px-4 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="light">Light</option>
              <option value="medium">Medium</option>
              <option value="heavy">Heavy</option>
            </select>
          </div>

          {/* Emergency Capacity */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Emergency Capacity</label>
            <select
              value={formData.emergency_capacity}
              onChange={(e) => setFormData({ ...formData, emergency_capacity: e.target.value })}
              className="w-full px-4 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
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
              Update
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
