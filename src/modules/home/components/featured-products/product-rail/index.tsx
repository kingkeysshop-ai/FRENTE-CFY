import { listProducts } from "@lib/data/products"
import { HttpTypes } from "@medusajs/types"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import ProductPreview from "@modules/products/components/product-preview"
import CarouselArrows from "./CarouselArrows"

export default async function ProductRail({
  collection,
  region,
}: {
  collection: HttpTypes.StoreCollection
  region: any
}) {
  const {
    response: { products: pricedProducts },
  } = await listProducts({
    regionId: region.id,
    queryParams: {
      collection_id: [collection.id],
    },
  }).catch(() => ({ response: { products: [], count: 0 }, nextPage: null }))

  if (!pricedProducts?.length) return null

  const id = `carousel-${collection.id}`

  return (
    <div className="content-container py-10 relative">
      {/* Header de coleccion */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <span className="w-1 h-6 bg-[#facc15] rounded-full" />
          <h2 className="text-xl font-black text-white">{collection.title}</h2>
        </div>
        <LocalizedClientLink
          href={`/collections/${collection.handle}`}
          className="text-xs text-[#facc15] hover:text-[#e6b800] font-bold border border-[#facc15]/30 px-3 py-1.5 rounded-lg hover:bg-[#facc15]/10 transition-all duration-200"
        >
          Ver todos →
        </LocalizedClientLink>
      </div>

      {/* Carrusel horizontal */}
      <div className="relative">
        <div
          id={id}
          className="overflow-x-auto scroll-smooth snap-x snap-mandatory -mx-4 px-4 pb-4 hide-scrollbar"
        >
          <div className="flex gap-4">
            {pricedProducts.map((product, i) => (
              <div key={product.id} className="snap-start shrink-0 w-[72vw] min-w-[240px] max-w-[280px]">
                <ProductPreview product={product} region={region} isFeatured priority={i === 0} />
              </div>
            ))}
          </div>
        </div>
        <CarouselArrows containerId={id} />
      </div>

      {/* Fading edge hint */}
      <div className="absolute top-[92px] right-0 w-20 h-[calc(100%-92px)] bg-gradient-to-l from-[#0a0a0a] via-[#0a0a0a]/80 to-transparent pointer-events-none" />

      <style>{`
        .hide-scrollbar::-webkit-scrollbar { display: none; }
        .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  )
}
