const SkeletonCardDetails = () => {
  return (
    <div className="flex flex-col gap-1 my-4 transition-all duration-150 ease-in-out">
      <div className="h-4 bg-[#2a2a2a] rounded-md w-1/4 animate-pulse mb-1"></div>
      <div className="pt-3 pb-1 block w-full h-11 px-4 mt-0 bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl animate-pulse" />
    </div>
  )
}

export default SkeletonCardDetails
