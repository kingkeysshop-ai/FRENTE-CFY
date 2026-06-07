import SkeletonProductGrid from "@modules/skeletons/templates/skeleton-product-grid"

export default function Loading() {
  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      {/* Header skeleton */}
      <div className="bg-[#111111] border-b border-yellow-400/20 py-12 animate-pulse">
        <div className="content-container flex flex-col items-center gap-3">
          <div className="w-24 h-5 bg-[#1a1a1a] rounded-full" />
          <div className="w-56 h-10 bg-[#1a1a1a] rounded-xl" />
          <div className="w-40 h-4 bg-[#2a2a2a] rounded-lg" />
        </div>
      </div>
      <div className="flex flex-col small:flex-row small:items-start py-8 content-container gap-6">
        <div className="small:min-w-[220px] bg-[#111111] border border-[#2a2a2a] rounded-xl p-4 animate-pulse">
          <div className="w-20 h-4 bg-[#1a1a1a] rounded mb-4" />
          {[1, 2, 3, 4].map((i: any) => (
            <div key={i} className="w-full h-8 bg-[#1a1a1a] rounded-lg mb-2" />
          ))}
        </div>
        <div className="w-full">
          <SkeletonProductGrid numberOfProducts={8} />
        </div>
      </div>
    </div>
  )
}
