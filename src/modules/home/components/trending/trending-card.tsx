"use client"

import { useState } from "react"
import Image from "next/image"
import { useParams } from "next/navigation"
import { Heart, Plus, Loader2, KeyRound } from "lucide-react"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { addToCart } from "@lib/data/cart"
import { useToast } from "@lib/context/toast-context"
import { useWishlist } from "@lib/hooks/use-wishlist"
import type { TrendingProduct } from "./index"

export default function TrendingCard({ product }: { product: TrendingProduct }) {
  const { countryCode } = useParams()
  const { showToast } = useToast()
  const { isWishlisted, toggle } = useWishlist()
  const [adding, setAdding] = useState(false)
  const wishlisted = isWishlisted(product.id)

  const handleAdd = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (!product.variantId || adding) return

    setAdding(true)
    try {
      await addToCart({
        variantId: product.variantId,
        quantity: 1,
        countryCode: (countryCode as string) ?? "co",
      })
      showToast("> agregado al carrito", product.title)
    } catch {
      showToast("> error al agregar", "Intenta de nuevo", "error")
    } finally {
      setAdding(false)
    }
  }

  return (
    <div className="group h-full flex flex-col bg-[#111111] border border-[#2a2a2a] hover:border-[#facc15]/50 rounded-xl overflow-hidden transition-all duration-300">
      {/* Imagen box-art */}
      <LocalizedClientLink
        href={`/products/${product.handle}`}
        className="relative block aspect-[3/4] overflow-hidden bg-gradient-to-br from-[#1a1a1a] to-[#0f0f0f]"
        data-testid="trending-card-link"
      >
        {product.thumbnail ? (
          <Image
            src={product.thumbnail}
            alt={product.title}
            fill
            sizes="(max-width: 640px) 58vw, (max-width: 768px) 33vw, 25vw"
            className="object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <KeyRound className="h-10 w-10 text-[#facc15]/20" />
          </div>
        )}

        {/* Favorito */}
        <button
          onClick={(e) => {
            e.preventDefault()
            e.stopPropagation()
            toggle(product.id)
          }}
          aria-label={wishlisted ? "Quitar de favoritos" : "Agregar a favoritos"}
          className="absolute top-2 right-2 z-10 flex items-center justify-center w-7 h-7 rounded-full bg-black/60 backdrop-blur-sm border border-white/10 hover:border-[#facc15]/50 transition-all duration-200"
        >
          <Heart
            className={`h-3.5 w-3.5 transition-colors duration-200 ${
              wishlisted ? "fill-[#facc15] text-[#facc15]" : "text-white"
            }`}
          />
        </button>

        <span className="absolute top-2 left-2 font-mono text-[9px] tracking-wider text-black bg-[#eab308]/90 px-1 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          [HOT]
        </span>
      </LocalizedClientLink>

      {/* Info */}
      <div className="p-2.5 flex flex-col gap-1.5 flex-1">
        <LocalizedClientLink href={`/products/${product.handle}`}>
          <h3
            data-testid="trending-card-title"
            className="font-mono text-white text-xs font-semibold leading-snug line-clamp-2 min-h-[2rem] group-hover:text-[#facc15] transition-colors duration-200"
          >
            {product.title}
          </h3>
        </LocalizedClientLink>

        {/* Precio */}
        <div className="font-mono" data-testid="trending-card-price">
          {product.priceBefore && (
            <span className="block text-[10px] text-[#888888] line-through">
              {product.priceBefore}
            </span>
          )}
          <span className="text-xs font-bold text-[#facc15]">
            {product.priceNow}
          </span>
        </div>

        {/* + agregar estilo CLI */}
        <button
          onClick={handleAdd}
          disabled={!product.variantId || adding}
          data-testid="trending-add-button"
          className="mt-auto w-full flex items-center justify-center gap-1 border border-[#eab308]/50 text-[#facc15] hover:bg-[#eab308] hover:text-black disabled:opacity-50 disabled:cursor-not-allowed font-mono text-[11px] font-bold tracking-wide py-1.5 rounded-lg transition-colors duration-200 cursor-pointer"
        >
          {adding ? (
            <Loader2 className="h-3 w-3 animate-spin" />
          ) : (
            <Plus className="h-3 w-3" strokeWidth={2.5} />
          )}
          agregar
        </button>
      </div>
    </div>
  )
}
