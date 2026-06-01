const SkeletonCartTotals = ({ header = true }) => {
  return (
    <div className="flex flex-col gap-3 animate-pulse">
      {header && <div className="w-32 h-5 bg-[#1a1a1a] rounded mb-1" />}
      <div className="flex items-center justify-between">
        <div className="w-28 h-3 bg-[#1a1a1a] rounded" />
        <div className="w-20 h-3 bg-[#1a1a1a] rounded" />
      </div>
      <div className="flex items-center justify-between">
        <div className="w-24 h-3 bg-[#2a2a2a] rounded" />
        <div className="w-16 h-3 bg-[#2a2a2a] rounded" />
      </div>
      <div className="flex items-center justify-between">
        <div className="w-28 h-3 bg-[#2a2a2a] rounded" />
        <div className="w-20 h-3 bg-[#2a2a2a] rounded" />
      </div>
      <div className="w-full border-b border-[#2a2a2a] border-dashed my-1" />
      <div className="flex items-center justify-between">
        <div className="w-32 h-6 bg-[#1a1a1a] rounded" />
        <div className="w-24 h-6 bg-yellow-400/20 rounded" />
      </div>
    </div>
  )
}

export default SkeletonCartTotals
