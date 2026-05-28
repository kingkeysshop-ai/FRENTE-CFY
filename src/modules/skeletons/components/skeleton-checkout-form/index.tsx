const SkeletonCheckoutForm = () => {
  return (
    <div className="w-full grid grid-cols-1 gap-y-6 animate-pulse">
      {[1, 2, 3, 4].map((step) => (
        <div key={step} className="bg-gray-900 border border-gray-700 rounded-xl overflow-hidden">
          <div className="flex items-center gap-3 px-6 py-4 border-b border-gray-700 bg-gray-800/50">
            <div className="w-7 h-7 rounded-full bg-gray-700" />
            <div className="w-40 h-4 bg-gray-700 rounded" />
          </div>
          <div className="p-6 space-y-3">
            <div className="w-full h-10 bg-gray-800 rounded-lg" />
            <div className="w-full h-10 bg-gray-800 rounded-lg" />
            <div className="w-2/3 h-10 bg-gray-800 rounded-lg" />
          </div>
        </div>
      ))}
    </div>
  )
}

export default SkeletonCheckoutForm
