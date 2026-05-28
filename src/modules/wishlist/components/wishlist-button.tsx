"use client"

import { useWishlist } from "@lib/hooks/use-wishlist"

type WishlistButtonProps = {
  productId: string
  className?: string
}

const WishlistButton = ({ productId, className = "" }: WishlistButtonProps) => {
  const { isWishlisted, toggle } = useWishlist()
  const active = isWishlisted(productId)

  return (
    <button
      onClick={(e) => {
        e.preventDefault()
        e.stopPropagation()
        toggle(productId)
      }}
      className={`flex items-center justify-center w-9 h-9 rounded-full bg-black/50 backdrop-blur-sm border border-white/10 hover:border-yellow-400/50 transition-all duration-200 z-10 ${className}`}
      aria-label={active ? "Quitar de favoritos" : "Agregar a favoritos"}
    >
      <svg
        viewBox="0 0 24 24"
        fill={active ? "#facc15" : "none"}
        stroke={active ? "#facc15" : "white"}
        strokeWidth="2"
        className="w-4 h-4 transition-colors duration-200"
      >
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
      </svg>
    </button>
  )
}

export default WishlistButton
