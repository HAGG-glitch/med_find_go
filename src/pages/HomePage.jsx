import { Link } from "react-router-dom"
import { ArrowRight, Activity, MapPin, Truck, Building2, Users, Stethoscope } from "lucide-react"

export default function HomePage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary/5 via-background to-accent/5 py-20 md:py-32 overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 bg-primary/10 backdrop-blur-sm text-primary px-4 py-2 rounded-full text-sm font-medium mb-6 border border-primary/20 shadow-sm animate-in fade-in slide-in-from-bottom-4 duration-500">
              <Activity className="w-4 h-4" />
              Real-time hospital availability
            </div>

            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-foreground mb-6 text-balance animate-in fade-in slide-in-from-bottom-6 duration-700">
              Med-Find Salone
            </h1>

            <p className="text-xl md:text-2xl text-muted-foreground mb-10 text-pretty leading-relaxed animate-in fade-in slide-in-from-bottom-8 duration-900">
              Find hospitals with beds, oxygen & ambulance near you
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center animate-in fade-in slide-in-from-bottom-10 duration-1000">
              <Link
                to="/directory"
                className="inline-flex items-center justify-center gap-2 bg-primary text-primary-foreground px-8 py-4 rounded-xl font-semibold hover:bg-primary/90 transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-105 active:scale-95"
              >
                View Hospitals
                <ArrowRight className="w-5 h-5" />
              </Link>

              <a
                href="tel:+23276999999"
                className="inline-flex items-center justify-center gap-2 bg-destructive text-destructive-foreground px-8 py-4 rounded-xl font-semibold hover:bg-destructive/90 transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-105 active:scale-95"
              >
                Emergency Call
                <Activity className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Stats */}
      <section className="py-16 bg-card border-y border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
            <div className="text-center p-6 bg-background rounded-2xl border border-border hover:shadow-lg transition-all duration-200 hover:scale-105">
              <div className="inline-flex items-center justify-center w-14 h-14 bg-gradient-to-br from-primary/20 to-primary/10 text-primary rounded-xl mb-4 shadow-sm">
                <Building2 className="w-7 h-7" />
              </div>
              <div className="text-4xl font-bold text-foreground mb-2">47</div>
              <div className="text-sm text-muted-foreground font-medium">Total Hospitals</div>
            </div>

            <div className="text-center p-6 bg-background rounded-2xl border border-border hover:shadow-lg transition-all duration-200 hover:scale-105">
              <div className="inline-flex items-center justify-center w-14 h-14 bg-gradient-to-br from-accent/20 to-accent/10 text-accent rounded-xl mb-4 shadow-sm">
                <MapPin className="w-7 h-7" />
              </div>
              <div className="text-4xl font-bold text-foreground mb-2">16</div>
              <div className="text-sm text-muted-foreground font-medium">Districts Covered</div>
            </div>

            <div className="text-center p-6 bg-background rounded-2xl border border-border hover:shadow-lg transition-all duration-200 hover:scale-105 col-span-2 md:col-span-1">
              <div className="inline-flex items-center justify-center w-14 h-14 bg-gradient-to-br from-primary/20 to-primary/10 text-primary rounded-xl mb-4 shadow-sm">
                <Truck className="w-7 h-7" />
              </div>
              <div className="text-4xl font-bold text-foreground mb-2">23</div>
              <div className="text-sm text-muted-foreground font-medium">Ambulances Available</div>
            </div>
          </div>
        </div>
      </section>

      {/* Search Section */}
      <section className="py-16 md:py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-foreground mb-3">Find Medical Care Near You</h2>
            <p className="text-muted-foreground">Search by hospital name, service, or district</p>
          </div>

          <div className="relative">
            <input
              type="text"
              placeholder="Search hospital, service or district..."
              className="w-full px-6 py-4 bg-card border-2 border-border rounded-2xl text-lg focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all shadow-lg hover:shadow-xl"
            />
            <button className="absolute right-2 top-1/2 -translate-y-1/2 bg-primary text-primary-foreground px-6 py-3 rounded-xl font-semibold hover:bg-primary/90 transition-all duration-200 shadow-md hover:shadow-lg hover:scale-105 active:scale-95">
              Search
            </button>
          </div>

          <div className="mt-6 flex items-center justify-center">
            <button className="inline-flex items-center gap-2 text-primary hover:text-primary/80 transition-colors">
              <MapPin className="w-5 h-5" />
              <span className="font-medium">Locate me</span>
            </button>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-16 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-3">What We Offer</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Comprehensive medical directory with real-time information to help you make informed healthcare decisions
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-card p-8 rounded-2xl border border-border hover:shadow-xl transition-all duration-200 hover:scale-105 hover:border-primary/20 group">
              <div className="w-14 h-14 bg-gradient-to-br from-primary/20 to-primary/10 text-primary rounded-xl flex items-center justify-center mb-5 shadow-sm group-hover:shadow-md transition-all">
                <Activity className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-3 group-hover:text-primary transition-colors">
                Real-time Availability
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                Check bed availability, oxygen supplies, and ambulance status in real-time
              </p>
            </div>

            <div className="bg-card p-8 rounded-2xl border border-border hover:shadow-xl transition-all duration-200 hover:scale-105 hover:border-accent/20 group">
              <div className="w-14 h-14 bg-gradient-to-br from-accent/20 to-accent/10 text-accent rounded-xl flex items-center justify-center mb-5 shadow-sm group-hover:shadow-md transition-all">
                <MapPin className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-3 group-hover:text-accent transition-colors">
                Interactive Map
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                View hospitals on an interactive map and get directions instantly
              </p>
            </div>

            <div className="bg-card p-8 rounded-2xl border border-border hover:shadow-xl transition-all duration-200 hover:scale-105 hover:border-primary/20 group">
              <div className="w-14 h-14 bg-gradient-to-br from-primary/20 to-primary/10 text-primary rounded-xl flex items-center justify-center mb-5 shadow-sm group-hover:shadow-md transition-all">
                <Stethoscope className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-3 group-hover:text-primary transition-colors">
                Specialist Directory
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                Find specialists and services available at each healthcare facility
              </p>
            </div>

            <div className="bg-card p-8 rounded-2xl border border-border hover:shadow-xl transition-all duration-200 hover:scale-105 hover:border-accent/20 group">
              <div className="w-14 h-14 bg-gradient-to-br from-accent/20 to-accent/10 text-accent rounded-xl flex items-center justify-center mb-5 shadow-sm group-hover:shadow-md transition-all">
                <Users className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-3 group-hover:text-accent transition-colors">
                Queue Status
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                Know the wait times before you go with our real-time queue information
              </p>
            </div>

            <div className="bg-card p-8 rounded-2xl border border-border hover:shadow-xl transition-all duration-200 hover:scale-105 hover:border-primary/20 group">
              <div className="w-14 h-14 bg-gradient-to-br from-primary/20 to-primary/10 text-primary rounded-xl flex items-center justify-center mb-5 shadow-sm group-hover:shadow-md transition-all">
                <Truck className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-3 group-hover:text-primary transition-colors">
                Emergency Services
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                Quick access to emergency hotlines and ambulance availability
              </p>
            </div>

            <div className="bg-card p-8 rounded-2xl border border-border hover:shadow-xl transition-all duration-200 hover:scale-105 hover:border-accent/20 group">
              <div className="w-14 h-14 bg-gradient-to-br from-accent/20 to-accent/10 text-accent rounded-xl flex items-center justify-center mb-5 shadow-sm group-hover:shadow-md transition-all">
                <Activity className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-3 group-hover:text-accent transition-colors">
                Offline Access
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                Browse hospital information even without internet connection
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Ready to Find Medical Care?</h2>
          <p className="text-lg text-muted-foreground mb-8">
            Browse our comprehensive directory of healthcare facilities across Sierra Leone
          </p>
          <Link
            to="/directory"
            className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-8 py-4 rounded-xl font-semibold hover:bg-primary/90 transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-105 active:scale-95"
          >
            Browse All Hospitals
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>
    </div>
  )
}
