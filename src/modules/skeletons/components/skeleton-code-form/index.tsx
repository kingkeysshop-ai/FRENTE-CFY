const SkeletonCodeForm = () => {
  return (
    <div className="flex flex-col gap-y-3 animate-pulse">
      <div className="w-24 h-4 bg-[#1a1a1a] rounded" />
      <div className="flex gap-2">
        <div className="flex-1 h-10 bg-[#1a1a1a] rounded-lg" />
        <div className="w-20 h-10 bg-[#2a2a2a] rounded-lg" />
      </div>
    </div>
  )
}

export default SkeletonCodeForm
