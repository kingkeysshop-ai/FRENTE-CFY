import SkeletonProductGrid from "@modules/skeletons/templates/skeleton-product-grid"

export default function Loading() {
  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      {/* Hero skeleton */}
      <div className="bg-[#111111] border-b border-[#facc15]/10 py-12">
        <div className="content-container flex flex-col items-center gap-3 animate-pulse">
          <div className="w-32 h-5 bg-[#facc15]/10 rounded-full" />
          <div className="w-64 h-10 bg-[#1a1a1a] rounded-xl" />
          <div className="w-80 h-4 bg-[#2a2a2a] rounded-lg" />
        </div>
      </div>

      {/* Contenido skeleton */}
      <div className="flex flex-col small:flex-row small:items-start py-8 content-container gap-6">
        {/* Filtros skeleton */}
        <div className="small:min-w-[220px] bg-[#111111] border border-[#2a2a2a] rounded-xl p-4 animate-pulse">
          <div className="w-20 h-4 bg-[#1a1a1a] rounded mb-4" />
          <div className="flex flex-col gap-3">
            {[1, 2, 3, 4].map((i: any) => (
              <div key={i} className="w-full h-8 bg-[#1a1a1a] rounded-lg" />
            ))}
          </div>
        </div>

        {/* Grid skeleton */}
        <div className="w-full">
          <SkeletonProductGrid numberOfProducts={8} />
        </div>
      </div>
    </div>
  )
}
