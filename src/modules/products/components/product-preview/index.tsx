import { getProductPrice } from "@lib/util/get-product-price"
import { HttpTypes } from "@medusajs/types"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import WishlistButton from "@modules/wishlist/components/wishlist-button"
import Thumbnail from "../thumbnail"
import PreviewPrice from "./price"

const isBestSeller = (product: HttpTypes.StoreProduct) =>
  product.tags?.some((t: any) => t.value?.toLowerCase() === "best-seller" || t.value?.toLowerCase() === "mas-vendido")

const getInventory = (product: HttpTypes.StoreProduct) => {
  const total = product.variants?.reduce((sum: number, v: any) => sum + (v.manage_inventory ? (v.inventory_quantity || 0) : 999), 0) ?? 0
  return total
}

export default async function ProductPreview({
  product,
  isFeatured,
  region,
  priority,
}: {
  product: HttpTypes.StoreProduct
  isFeatured?: boolean
  region: any
  priority?: boolean
}) {
  const { cheapestPrice } = getProductPrice({ product })
  const inventory = getInventory(product)
  const isLowStock = inventory > 0 && inventory <= 5

  return (
    <LocalizedClientLink href={`/products/${product.handle}`} className="group">
      <div
        data-testid="product-wrapper"
        className="bg-[#111111] border border-[#2a2a2a] hover:border-[#facc15]/60 rounded-xl overflow-hidden transition-all duration-300 hover:shadow-[0_8px_30px_rgba(250,204,21,0.08)] hover:-translate-y-1"
      >
        {/* Imagen */}
        <div className="relative overflow-hidden bg-[#1a1a1a]">
          <Thumbnail
            thumbnail={product.thumbnail}
            images={product.images}
            size="full"
            isFeatured={isFeatured}
            priority={priority}
          />
          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
            {cheapestPrice?.price_type === "sale" && (
              <span className="px-2 py-1 bg-[#facc15] text-[#0a0a0a] text-xs font-black rounded-md uppercase tracking-wide">
                🔥 Oferta
              </span>
            )}
            {isBestSeller(product) && (
              <span className="px-2 py-1 bg-purple-500 text-white text-xs font-black rounded-md uppercase tracking-wide">
                ⭐ Más Vendido
              </span>
            )}
            {isLowStock && (
              <span className="px-2 py-1 bg-red-500/90 text-white text-xs font-black rounded-md uppercase tracking-wide">
                ⚡ Últimas {inventory}
              </span>
            )}
          </div>
          {/* Wishlist heart */}
          <div className="absolute top-3 right-3 z-10">
            <WishlistButton productId={product.id} />
          </div>
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-300 flex items-center justify-center">
            <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 px-4 py-2 bg-[#facc15] text-[#0a0a0a] text-sm font-bold rounded-lg">
              Ver Producto →
            </span>
          </div>
        </div>

        {/* Info del producto */}
        <div className="p-4 flex flex-col gap-2">
          {/* Titulo */}
          <h3
            className="text-white font-semibold text-sm leading-snug group-hover:text-[#facc15] transition-colors duration-200 line-clamp-2"
            data-testid="product-title"
          >
            {product.title}
          </h3>

          <div className="w-full h-px bg-[#2a2a2a]" />

          {/* Precio + Stock */}
          <div className="flex items-center justify-between mt-1">
            <div className="flex items-center gap-x-2">
              {cheapestPrice && <PreviewPrice price={cheapestPrice} />}
            </div>
            <span className="text-xs text-[#888888] bg-[#1a1a1a] px-2 py-1 rounded-md flex items-center gap-1">
              {inventory > 0 ? "✅ Stock" : "🔑 Digital"}
            </span>
          </div>
        </div>
      </div>
    </LocalizedClientLink>
  )
}
