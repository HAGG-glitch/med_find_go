import { useState } from "react"
import { CheckCircle, XCircle, AlertCircle } from "lucide-react"

// Mock reports data
const mockReports = [
  {
    id: 1,
    hospital_id: 1,
    hospital_name: "Connaught Hospital",
    issue_field: "Bed availability",
    note: "The number of beds shown is not accurate. There are actually 15 beds available.",
    created_at: "2025-12-10T14:30:00Z",
    status: "pending",
  },
  {
    id: 2,
    hospital_id: 2,
    hospital_name: "Princess Christian Maternity Hospital",
    issue_field: "Phone number",
    note: "The phone number listed is no longer in service.",
    created_at: "2025-12-09T11:20:00Z",
    status: "pending",
  },
  {
    id: 3,
    hospital_id: 3,
    hospital_name: "Bo Government Hospital",
    issue_field: "Services",
    note: "They now offer X-Ray services which is not listed.",
    created_at: "2025-12-08T16:45:00Z",
    status: "resolved",
  },
]

export default function ReportsViewer() {
  const [reports, setReports] = useState(mockReports)
  const [filter, setFilter] = useState("all") // all, pending, resolved

  const handleResolve = (id) => {
    setReports(reports.map((r) => (r.id === id ? { ...r, status: "resolved" } : r)))
  }

  const handleDismiss = (id) => {
    if (confirm("Are you sure you want to dismiss this report?")) {
      setReports(reports.filter((r) => r.id !== id))
    }
  }

  const filteredReports = reports.filter((r) => (filter === "all" ? true : r.status === filter))

  const getStatusColor = (status) => {
    if (status === "resolved") return "text-accent bg-accent/10"
    return "text-yellow-600 bg-yellow-100 dark:bg-yellow-900/20"
  }

  return (
    <div>
      {/* Filter Buttons */}
      <div className="flex gap-2 mb-6">
        <button
          onClick={() => setFilter("all")}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            filter === "all" ? "bg-primary text-primary-foreground" : "bg-card border border-border hover:bg-muted"
          }`}
        >
          All ({reports.length})
        </button>
        <button
          onClick={() => setFilter("pending")}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            filter === "pending" ? "bg-primary text-primary-foreground" : "bg-card border border-border hover:bg-muted"
          }`}
        >
          Pending ({reports.filter((r) => r.status === "pending").length})
        </button>
        <button
          onClick={() => setFilter("resolved")}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            filter === "resolved" ? "bg-primary text-primary-foreground" : "bg-card border border-border hover:bg-muted"
          }`}
        >
          Resolved ({reports.filter((r) => r.status === "resolved").length})
        </button>
      </div>

      {/* Reports List */}
      <div className="space-y-4">
        {filteredReports.length === 0 ? (
          <div className="bg-card border border-border rounded-2xl p-12 text-center">
            <AlertCircle className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-foreground mb-2">No reports found</h3>
            <p className="text-muted-foreground">There are no {filter !== "all" && filter} reports to display.</p>
          </div>
        ) : (
          filteredReports.map((report) => (
            <div key={report.id} className="bg-card border border-border rounded-2xl p-6">
              <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-bold text-foreground">{report.hospital_name}</h3>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(report.status)}`}>
                      {report.status}
                    </span>
                  </div>

                  <div className="space-y-2 mb-4">
                    <div className="text-sm">
                      <span className="text-muted-foreground">Issue Field:</span>
                      <span className="ml-2 font-medium text-foreground">{report.issue_field}</span>
                    </div>
                    <div className="text-sm">
                      <span className="text-muted-foreground">Note:</span>
                      <p className="mt-1 text-foreground">{report.note}</p>
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Reported: {new Date(report.created_at).toLocaleString()}
                    </div>
                  </div>
                </div>

                {report.status === "pending" && (
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleResolve(report.id)}
                      className="flex items-center gap-2 px-4 py-2 bg-accent text-accent-foreground rounded-lg hover:bg-accent/90 transition-colors text-sm font-medium"
                    >
                      <CheckCircle className="w-4 h-4" />
                      Resolve
                    </button>
                    <button
                      onClick={() => handleDismiss(report.id)}
                      className="flex items-center gap-2 px-4 py-2 bg-muted text-foreground rounded-lg hover:bg-muted/80 transition-colors text-sm font-medium"
                    >
                      <XCircle className="w-4 h-4" />
                      Dismiss
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
