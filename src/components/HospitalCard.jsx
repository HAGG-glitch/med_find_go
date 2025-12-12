import { Link } from "react-router-dom"
import { Star, Bed, Wind, Truck, Phone, MapPin, Clock } from "lucide-react"

export default function HospitalCard({ hospital, onViewMap }) {
  const getQueueColor = (status) => {
    if (status === "light") return "text-accent bg-accent/10"
    if (status === "medium") return "text-yellow-600 bg-yellow-100 dark:bg-yellow-900/20"
    return "text-destructive bg-destructive/10"
  }

  const getCapacityColor = (capacity) => {
    if (capacity === "high") return "text-accent bg-accent/10"
    if (capacity === "medium") return "text-yellow-600 bg-yellow-100 dark:bg-yellow-900/20"
    return "text-destructive bg-destructive/10"
  }

  return (
    <div className="bg-card border border-border rounded-2xl p-6 hover:shadow-xl transition-all duration-200 hover:scale-[1.02] hover:border-primary/20 group">
      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
        <div className="flex-1">
          {/* Header */}
          <div className="flex items-start justify-between mb-3">
            <div>
              <Link to={`/hospital/${hospital.id}`} className="hover:text-primary transition-colors">
                <h3 className="text-xl font-bold text-foreground mb-1">{hospital.name}</h3>
              </Link>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <MapPin className="w-4 h-4" />
                <span>{hospital.address}</span>
              </div>
            </div>
            {hospital.open_now && (
              <span className="px-3 py-1 bg-accent/10 text-accent text-xs font-medium rounded-full border border-accent/20 shadow-sm">
                Open
              </span>
            )}
          </div>

          {/* Rating */}
          <div className="flex items-center gap-1 mb-4">
            <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
            <span className="font-semibold text-foreground">{hospital.rating}</span>
            <span className="text-sm text-muted-foreground ml-1">
              ({hospital.is_government ? "Government" : "Private"})
            </span>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-4">
            <div className="flex items-center gap-2 p-2 rounded-lg hover:bg-muted/50 transition-colors">
              <div className="w-9 h-9 bg-primary/10 rounded-lg flex items-center justify-center shadow-sm">
                <Bed className="w-4 h-4 text-primary" />
              </div>
              <div>
                <div className="text-sm font-semibold text-foreground">{hospital.beds_available}</div>
                <div className="text-xs text-muted-foreground">Beds</div>
              </div>
            </div>

            <div className="flex items-center gap-2 p-2 rounded-lg hover:bg-muted/50 transition-colors">
              <div
                className={`w-9 h-9 rounded-lg flex items-center justify-center shadow-sm ${
                  hospital.oxygen ? "bg-accent/10" : "bg-muted"
                }`}
              >
                <Wind className={`w-4 h-4 ${hospital.oxygen ? "text-accent" : "text-muted-foreground"}`} />
              </div>
              <div>
                <div className="text-sm font-semibold text-foreground">{hospital.oxygen ? "Yes" : "No"}</div>
                <div className="text-xs text-muted-foreground">Oxygen</div>
              </div>
            </div>

            <div className="flex items-center gap-2 p-2 rounded-lg hover:bg-muted/50 transition-colors">
              <div
                className={`w-9 h-9 rounded-lg flex items-center justify-center shadow-sm ${
                  hospital.ambulance ? "bg-accent/10" : "bg-muted"
                }`}
              >
                <Truck className={`w-4 h-4 ${hospital.ambulance ? "text-accent" : "text-muted-foreground"}`} />
              </div>
              <div>
                <div className="text-sm font-semibold text-foreground">{hospital.ambulance ? "Yes" : "No"}</div>
                <div className="text-xs text-muted-foreground">Ambulance</div>
              </div>
            </div>
          </div>

          {/* Services Tags */}
          <div className="flex flex-wrap gap-2 mb-4">
            {hospital.services.slice(0, 3).map((service) => (
              <span
                key={service}
                className="px-3 py-1 bg-secondary text-secondary-foreground text-xs rounded-full border border-secondary/20 shadow-sm"
              >
                {service}
              </span>
            ))}
            {hospital.services.length > 3 && (
              <span className="px-3 py-1 bg-muted text-muted-foreground text-xs rounded-full border border-border">
                +{hospital.services.length - 3} more
              </span>
            )}
          </div>

          {/* Queue & Capacity */}
          <div className="flex flex-wrap gap-3 text-sm">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-muted-foreground" />
              <span className="text-muted-foreground">Queue:</span>
              <span className={`px-2 py-1 rounded-md text-xs font-medium ${getQueueColor(hospital.queue_status)}`}>
                {hospital.queue_status}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-muted-foreground">Emergency:</span>
              <span
                className={`px-2 py-1 rounded-md text-xs font-medium ${getCapacityColor(hospital.emergency_capacity)}`}
              >
                {hospital.emergency_capacity}
              </span>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex md:flex-col gap-2">
          <Link
            to={`/hospital/${hospital.id}`}
            className="flex-1 md:flex-initial px-4 py-2.5 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-all duration-200 text-center text-sm font-medium shadow-sm hover:shadow-md hover:scale-105 active:scale-95"
          >
            View Details
          </Link>
          {onViewMap && (
            <button
              onClick={onViewMap}
              className="flex-1 md:flex-initial px-4 py-2.5 bg-secondary text-secondary-foreground rounded-lg hover:bg-secondary/80 transition-all duration-200 text-center text-sm font-medium shadow-sm hover:shadow-md hover:scale-105 active:scale-95"
            >
              View on Map
            </button>
          )}
          <a
            href={`tel:${hospital.phone}`}
            className="flex-1 md:flex-initial px-4 py-2.5 bg-accent text-accent-foreground rounded-lg hover:bg-accent/90 transition-all duration-200 text-center text-sm font-medium flex items-center justify-center gap-2 shadow-sm hover:shadow-md hover:scale-105 active:scale-95"
          >
            <Phone className="w-4 h-4" />
            Call
          </a>
        </div>
      </div>

      {/* Last Updated */}
      <div className="mt-4 pt-4 border-t border-border/50 text-xs text-muted-foreground">
        Last updated: {new Date(hospital.last_updated).toLocaleString()}
      </div>
    </div>
  )
}
