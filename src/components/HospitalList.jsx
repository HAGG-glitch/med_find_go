import HospitalCard from "./HospitalCard"

export default function HospitalList({ hospitals, onHospitalClick, onViewMap }) {
  if (hospitals.length === 0) {
    return (
      <div className="bg-card border border-border rounded-2xl p-12 text-center">
        <h3 className="text-xl font-semibold text-foreground mb-2">No hospitals found</h3>
        <p className="text-muted-foreground">Try adjusting your filters to see more results</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {hospitals.map((hospital) => (
        <HospitalCard
          key={hospital.id}
          hospital={hospital}
          onViewMap={onViewMap ? () => onViewMap(hospital.id) : undefined}
        />
      ))}
    </div>
  )
}
