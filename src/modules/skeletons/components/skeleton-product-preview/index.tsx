const SkeletonProductPreview = () => {
  return (
    <div className="animate-pulse flex flex-col gap-3">
      <div className="aspect-[9/16] w-full bg-[#1a1a1a] rounded-xl" />
      <div className="flex justify-between items-center gap-2">
        <div className="w-3/5 h-4 bg-[#1a1a1a] rounded-lg" />
        <div className="w-1/5 h-4 bg-[#2a2a2a] rounded-lg" />
      </div>
    </div>
  )
}

export default SkeletonProductPreview
