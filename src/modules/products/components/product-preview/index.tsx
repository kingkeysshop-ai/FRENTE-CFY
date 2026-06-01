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
    <LocalizedClientLink href={`/products/${product.handle}`} className="group block">
      <div
        data-testid="product-wrapper"
        className="bg-[#111111] border border-[#2a2a2a] hover:border-[#facc15]/40 rounded-2xl overflow-hidden transition-all duration-500 hover:shadow-glow-gold hover:-translate-y-1.5"
      >
        {/* Imagen */}
        <div className="relative overflow-hidden bg-gradient-to-br from-[#1a1a1a] to-[#0f0f0f]">
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
              <span className="px-2 py-1 bg-gradient-to-r from-[#facc15] to-[#f59e0b] text-[#0a0a0a] text-[11px] font-black rounded-lg uppercase tracking-wide shadow-glow-yellow-sm">
                🔥 Oferta
              </span>
            )}
            {isBestSeller(product) && (
              <span className="px-2 py-1 bg-purple-500/90 text-white text-[11px] font-black rounded-lg uppercase tracking-wide backdrop-blur-sm">
                ⭐ Más Vendido
              </span>
            )}
            {isLowStock && (
              <span className="px-2 py-1 bg-red-500/80 text-white text-[11px] font-black rounded-lg uppercase tracking-wide backdrop-blur-sm">
                ⚡ Últimas {inventory}
              </span>
            )}
          </div>
          {/* Wishlist heart */}
          <div className="absolute top-3 right-3 z-10">
            <WishlistButton productId={product.id} />
          </div>
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/50 transition-all duration-500 flex items-center justify-center">
            <span className="opacity-0 group-hover:opacity-100 transition-all duration-500 px-5 py-2.5 bg-gradient-to-r from-[#facc15] to-[#f59e0b] text-[#0a0a0a] text-sm font-bold rounded-xl translate-y-2 group-hover:translate-y-0 shadow-glow-yellow-sm">
              Ver Producto →
            </span>
          </div>
        </div>

        {/* Info del producto */}
        <div className="p-5 flex flex-col gap-3">
          {/* Titulo */}
          <h3
            className="text-white font-semibold text-sm leading-snug group-hover:text-gold transition-colors duration-300 line-clamp-2"
            data-testid="product-title"
          >
            {product.title}
          </h3>

          <div className="w-full h-px bg-gradient-to-r from-[#2a2a2a] via-[#2a2a2a] to-transparent" />

          {/* Precio + Stock */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-x-2">
              {cheapestPrice && <PreviewPrice price={cheapestPrice} />}
            </div>
            <span className="text-[11px] text-[#888888] bg-white/[0.03] px-2.5 py-1 rounded-lg flex items-center gap-1 border border-white/[0.04] font-medium">
              {inventory > 0 ? "✅ Stock" : "🔑 Digital"}
            </span>
          </div>
        </div>
      </div>
    </LocalizedClientLink>
  )
}
