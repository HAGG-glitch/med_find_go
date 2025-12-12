import { Link } from "react-router-dom"

export default function Footer() {
  return (
    <footer className="bg-card border-t border-border mt-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Stats */}
          <div>
            <h3 className="font-semibold text-foreground mb-3">Quick Stats</h3>
            <div className="space-y-2 text-sm text-muted-foreground">
              <p>47 hospitals registered</p>
              <p>16 districts covered</p>
              <p>23 ambulances available</p>
            </div>
          </div>

          {/* Links */}
          <div>
            <h3 className="font-semibold text-foreground mb-3">Quick Links</h3>
            <div className="space-y-2 text-sm">
              <Link to="/about" className="block text-muted-foreground hover:text-primary transition-colors">
                About Us
              </Link>
              <Link to="/report" className="block text-muted-foreground hover:text-primary transition-colors">
                Report Issue
              </Link>
              <Link to="/admin" className="block text-muted-foreground hover:text-primary transition-colors">
                Admin Access
              </Link>
            </div>
          </div>

          {/* Info */}
          <div>
            <h3 className="font-semibold text-foreground mb-3">Emergency Hotline</h3>
            <a href="tel:+23276999999" className="text-lg font-bold text-destructive hover:underline">
              +232 76 999 999
            </a>
            <p className="text-sm text-muted-foreground mt-2">Available 24/7</p>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-border text-center text-sm text-muted-foreground">
          <p>&copy; 2025 Med-Find Salone. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
