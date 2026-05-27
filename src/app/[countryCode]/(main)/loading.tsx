export default function Loading() {
  return (
    <div className="min-h-screen bg-gray-950">
      {/* Hero skeleton */}
      <div className="min-h-[80vh] bg-gradient-to-br from-gray-900 via-gray-800 to-black flex items-center justify-center">
        <div className="flex flex-col items-center gap-6 px-6 animate-pulse">
          <div className="w-40 h-6 bg-yellow-400/10 rounded-full" />
          <div className="w-64 h-20 bg-gray-800 rounded-2xl" />
          <div className="w-80 h-5 bg-gray-700 rounded-lg" />
          <div className="flex gap-4 mt-2">
            <div className="w-36 h-12 bg-yellow-400/20 rounded-xl" />
            <div className="w-32 h-12 bg-gray-800 rounded-xl" />
          </div>
        </div>
      </div>
      {/* Categorías skeleton */}
      <div className="content-container py-16">
        <div className="w-48 h-8 bg-gray-800 rounded-xl mb-8 mx-auto animate-pulse" />
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i: any) => (
            <div key={i} className="h-32 bg-gray-900 border border-gray-800 rounded-xl animate-pulse" />
          ))}
        </div>
      </div>
      {/* Productos skeleton */}
      <div className="content-container pb-16">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-1 h-6 bg-yellow-400/30 rounded-full animate-pulse" />
          <div className="w-48 h-7 bg-gray-800 rounded-lg animate-pulse" />
        </div>
        <div className="flex gap-4 overflow-hidden">
          {[1, 2, 3, 4].map((i: any) => (
            <div key={i} className="shrink-0 w-[280px]">
              <div className="aspect-[11/14] bg-gray-900 border border-gray-800 rounded-xl animate-pulse" />
              <div className="mt-3 space-y-2">
                <div className="w-3/4 h-4 bg-gray-800 rounded animate-pulse" />
                <div className="w-1/2 h-4 bg-gray-800 rounded animate-pulse" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
