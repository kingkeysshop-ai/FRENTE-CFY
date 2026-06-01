const SkeletonOrderInformation = () => {
  return (
    <div className="flex flex-col gap-6 animate-pulse">
      <div className="flex flex-col gap-3">
        <div className="w-40 h-5 bg-[#1a1a1a] rounded" />
        <div className="w-full h-[180px] bg-[#1a1a1a] rounded-xl" />
      </div>
      <div className="flex flex-col gap-3">
        <div className="w-40 h-5 bg-[#1a1a1a] rounded" />
        <div className="w-full h-[180px] bg-[#1a1a1a] rounded-xl" />
      </div>
    </div>
  )
}

export default SkeletonOrderInformation
