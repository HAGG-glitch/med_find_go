import { useState } from "react"
import { X, Upload, AlertCircle } from "lucide-react"

export default function ReportForm({ hospitalId, hospitalName, onClose }) {
  const [formData, setFormData] = useState({
    issueField: "",
    note: "",
    photo: null,
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const issueFields = [
    "Bed availability",
    "Oxygen availability",
    "Ambulance availability",
    "Phone number",
    "Address",
    "Services",
    "Specialists",
    "Opening hours",
    "Other",
  ]

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500))

    console.log("Report submitted:", {
      hospitalId,
      ...formData,
    })

    setIsSubmitting(false)
    setSubmitted(true)

    // Close after showing success
    setTimeout(() => {
      onClose()
    }, 2000)
  }

  const handlePhotoChange = (e) => {
    const file = e.target.files?.[0]
    if (file) {
      setFormData({ ...formData, photo: file })
    }
  }

  if (submitted) {
    return (
      <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <div className="bg-white border border-gray-200 rounded-2xl p-8 max-w-md w-full text-center shadow-2xl animate-in fade-in zoom-in duration-200">
          <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">Report Submitted!</h3>
          <p className="text-gray-600">Thank you for helping us keep information accurate.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-white border border-gray-200 rounded-2xl p-6 max-w-lg w-full my-8 shadow-2xl animate-in fade-in zoom-in duration-200">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Report Inaccurate Info</h2>
            <p className="text-sm text-gray-600 mt-1">{hospitalName}</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg transition-colors text-gray-500" disabled={isSubmitting}>
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Info Banner */}
        <div className="flex gap-3 p-4 bg-blue-50 border border-blue-200 rounded-xl mb-6">
          <AlertCircle className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
          <p className="text-sm text-gray-700">
            Help us maintain accurate information. Your report will be reviewed by our team within 24 hours.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Issue Field */}
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">What information is incorrect?</label>
            <select
              value={formData.issueField}
              onChange={(e) => setFormData({ ...formData, issueField: e.target.value })}
              required
              className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Select an issue</option>
              {issueFields.map((field) => (
                <option key={field} value={field}>
                  {field}
                </option>
              ))}
            </select>
          </div>

          {/* Note */}
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">Additional details (optional)</label>
            <textarea
              value={formData.note}
              onChange={(e) => setFormData({ ...formData, note: e.target.value })}
              rows={4}
              placeholder="Please provide any additional information that might help us verify the issue..."
              className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
            />
          </div>

          {/* Photo Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">Upload photo (optional)</label>
            <div className="relative">
              <input type="file" accept="image/*" onChange={handlePhotoChange} className="hidden" id="photo-upload" />
              <label
                htmlFor="photo-upload"
                className="flex items-center justify-center gap-2 w-full px-4 py-3 bg-gray-50 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer hover:bg-gray-100 transition-colors"
              >
                <Upload className="w-5 h-5 text-gray-500" />
                <span className="text-sm text-gray-600">
                  {formData.photo ? formData.photo.name : "Click to upload a photo"}
                </span>
              </label>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="flex-1 px-6 py-3 bg-gray-200 text-gray-800 rounded-xl font-semibold hover:bg-gray-300 transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50"
            >
              {isSubmitting ? "Submitting..." : "Submit Report"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
