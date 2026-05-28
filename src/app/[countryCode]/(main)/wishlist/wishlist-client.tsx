"use client"

import { useEffect, useState } from "react"
import { listProducts } from "@lib/data/products"
import { HttpTypes } from "@medusajs/types"
import ProductPreview from "@modules/products/components/product-preview"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { useWishlist } from "@lib/hooks/use-wishlist"

export default function WishlistClient({
  regionId,
  countryCode,
}: {
  regionId: string
  countryCode: string
}) {
  const { items } = useWishlist()
  const [products, setProducts] = useState<HttpTypes.StoreProduct[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!items.length) {
      setProducts([])
      setLoading(false)
      return
    }
    setLoading(true)
    listProducts({
      countryCode,
      queryParams: { id: items },
    })
      .then(({ response }) => {
        setProducts(response.products.filter((p) => items.includes(p.id)))
      })
      .catch(() => setProducts([]))
      .finally(() => setLoading(false))
  }, [items, countryCode])

  if (loading) {
    return (
      <div className="grid grid-cols-2 small:grid-cols-3 medium:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="bg-gray-900 rounded-xl animate-pulse h-80" />
        ))}
      </div>
    )
  }

  if (!items.length || !products.length) {
    return (
      <div className="bg-gray-900 border border-gray-700 rounded-xl p-12 text-center">
        <p className="text-gray-400 text-lg mb-4">No tienes favoritos aún.</p>
        <LocalizedClientLink
          href="/store"
          className="inline-flex items-center gap-2 py-3 px-6 bg-yellow-400 text-gray-900 font-bold rounded-xl hover:bg-yellow-300 transition-colors"
        >
          Explorar Productos →
        </LocalizedClientLink>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-2 small:grid-cols-3 medium:grid-cols-4 gap-4">
      {products.map((product) => (
        <ProductPreview
          key={product.id}
          product={product}
          region={{ id: regionId }}
        />
      ))}
    </div>
  )
}
