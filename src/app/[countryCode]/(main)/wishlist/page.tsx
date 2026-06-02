import { Metadata } from "next"
import { Suspense } from "react"
import { getRegion } from "@lib/data/regions"
import { listProducts } from "@lib/data/products"
import SkeletonProductGrid from "@modules/skeletons/templates/skeleton-product-grid"
import WishlistClient from "./wishlist-client"
import Heart from "@modules/common/icons/heart"

export const metadata: Metadata = {
  title: "Mis Favoritos",
  description: "Tus productos favoritos guardados en King Keys",
}

export default async function WishlistPage(props: {
  params: Promise<{ countryCode: string }>
}) {
  const params = await props.params
  const region = await getRegion(params.countryCode)
  if (!region) return null

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      <div className="content-container py-8 small:py-12">
        <div className="mb-8">
          <h1 className="text-2xl small:text-3xl font-black text-white uppercase tracking-wider inline-flex items-center gap-2">
            <Heart size="28" color="#facc15" /> Mis Favoritos
          </h1>
          <p className="text-[#888888] text-sm mt-2">
            Productos que te han gustado, guardados para más tarde.
          </p>
        </div>
        <Suspense fallback={<SkeletonProductGrid />}>
          <WishlistClient regionId={region.id} countryCode={params.countryCode} />
        </Suspense>
      </div>
    </div>
  )
}
