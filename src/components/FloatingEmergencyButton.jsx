import { useState } from "react"
import { Phone, X, AlertCircle } from "lucide-react"

export default function FloatingEmergencyButton() {
  const [expanded, setExpanded] = useState(false)

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {expanded && (
        <div className="mb-4 bg-card border-2 border-destructive rounded-2xl shadow-2xl p-5 w-72 animate-in slide-in-from-bottom-4 duration-200 backdrop-blur-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-foreground flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-destructive animate-pulse" />
              Emergency
            </h3>
            <button
              onClick={() => setExpanded(false)}
              className="p-1.5 hover:bg-muted rounded-lg transition-all duration-200 hover:scale-110 active:scale-95"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          <div className="space-y-3">
            <a
              href="tel:+23276999999"
              className="flex items-center justify-center gap-2 px-4 py-3 bg-destructive text-destructive-foreground rounded-lg hover:bg-destructive/90 transition-all duration-200 w-full shadow-md hover:shadow-lg hover:scale-105 active:scale-95 font-semibold"
            >
              <Phone className="w-5 h-5" />
              <span>Emergency Hotline</span>
            </a>
            <p className="text-xs text-muted-foreground text-center font-medium">Available 24/7</p>
          </div>
        </div>
      )}

      <button
        onClick={() => setExpanded(!expanded)}
        className="w-16 h-16 bg-destructive text-destructive-foreground rounded-full shadow-xl hover:scale-110 active:scale-95 transition-all duration-200 flex items-center justify-center hover:shadow-2xl relative group"
        aria-label="Emergency"
      >
        {expanded ? <X className="w-7 h-7" /> : <Phone className="w-7 h-7" />}
        <span className="absolute inset-0 rounded-full bg-destructive animate-ping opacity-20 group-hover:opacity-30"></span>
      </button>
    </div>
  )
}
