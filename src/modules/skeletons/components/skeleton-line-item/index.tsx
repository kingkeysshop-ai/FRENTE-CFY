const SkeletonLineItem = () => {
  return (
    <div className="flex flex-wrap small:flex-nowrap items-start small:items-center gap-3 small:gap-4 px-4 small:px-6 py-4 border-b border-[#2a2a2a]">
      <div className="flex items-start gap-3 flex-1 min-w-0 w-full small:w-auto">
        <div className="w-16 h-16 rounded-lg overflow-hidden bg-[#1a1a1a] animate-pulse shrink-0" />
        <div className="flex flex-col gap-2 flex-1">
          <div className="w-32 h-4 bg-[#1a1a1a] animate-pulse rounded" />
          <div className="w-20 h-3 bg-[#1a1a1a] animate-pulse rounded" />
        </div>
      </div>
      <div className="flex items-center gap-3 w-full small:w-auto small:min-w-[180px] justify-between small:justify-end pl-[72px] small:pl-0">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 small:w-8 small:h-8 bg-[#1a1a1a] animate-pulse rounded-lg" />
          <div className="w-14 h-9 small:h-8 bg-[#1a1a1a] animate-pulse rounded-lg" />
        </div>
        <div className="w-16 h-4 bg-yellow-400/20 animate-pulse rounded" />
      </div>
    </div>
  )
}

export default SkeletonLineItem
