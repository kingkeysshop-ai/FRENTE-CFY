import repeat from "@lib/util/repeat"
import SkeletonProductPreview from "@modules/skeletons/components/skeleton-product-preview"

const SkeletonRelatedProducts = () => {
  return (
    <div className="flex flex-col gap-6 animate-pulse">
      <div className="flex flex-col gap-2">
        <div className="w-20 h-4 bg-[#1a1a1a] rounded" />
        <div className="w-48 h-8 bg-[#1a1a1a] rounded-lg" />
      </div>
      <ul className="grid grid-cols-2 small:grid-cols-4 gap-4">
        {repeat(4).map((index) => (
          <li key={index}>
            <SkeletonProductPreview />
          </li>
        ))}
      </ul>
    </div>
  )
}

export default SkeletonRelatedProducts
