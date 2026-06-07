import repeat from "@lib/util/repeat"

const SkeletonOrderItems = () => {
  return (
    <div className="flex flex-col gap-4 animate-pulse">
      {repeat(3).map((i: any) => (
        <div key={i} className="flex gap-4 items-center p-4 bg-[#111111] border border-gray-800 rounded-xl">
          <div className="w-16 h-16 bg-[#1a1a1a] rounded-lg shrink-0" />
          <div className="flex flex-col gap-2 flex-1">
            <div className="w-3/5 h-4 bg-[#1a1a1a] rounded" />
            <div className="w-2/5 h-3 bg-[#2a2a2a] rounded" />
          </div>
          <div className="w-16 h-5 bg-[#1a1a1a] rounded" />
        </div>
      ))}
    </div>
  )
}

export default SkeletonOrderItems
