/**
 * Skeleton Loader Component
 * Provides loading placeholders for better UX
 */

export function SkeletonCard() {
  return (
    <div className="bg-card border border-border rounded-2xl p-6 animate-pulse">
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1">
          <div className="h-6 bg-muted rounded-lg w-3/4 mb-3"></div>
          <div className="h-4 bg-muted rounded-lg w-1/2 mb-4"></div>
          <div className="grid grid-cols-3 gap-3 mb-4">
            <div className="h-16 bg-muted rounded-lg"></div>
            <div className="h-16 bg-muted rounded-lg"></div>
            <div className="h-16 bg-muted rounded-lg"></div>
          </div>
          <div className="flex gap-2 mb-4">
            <div className="h-6 bg-muted rounded-full w-20"></div>
            <div className="h-6 bg-muted rounded-full w-24"></div>
            <div className="h-6 bg-muted rounded-full w-16"></div>
          </div>
        </div>
        <div className="flex md:flex-col gap-2">
          <div className="h-10 bg-muted rounded-lg w-24"></div>
          <div className="h-10 bg-muted rounded-lg w-24"></div>
        </div>
      </div>
    </div>
  )
}

export function SkeletonList({ count = 3 }) {
  return (
    <div className="space-y-4">
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  )
}

export function SkeletonDetail() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="h-64 md:h-96 bg-muted rounded-2xl"></div>
      <div className="bg-card border border-border rounded-2xl p-6">
        <div className="h-8 bg-muted rounded-lg w-1/2 mb-4"></div>
        <div className="h-4 bg-muted rounded-lg w-3/4 mb-2"></div>
        <div className="h-4 bg-muted rounded-lg w-1/2"></div>
      </div>
      <div className="grid md:grid-cols-3 gap-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="h-24 bg-muted rounded-xl"></div>
        ))}
      </div>
    </div>
  )
}

